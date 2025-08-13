from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ValidationError
from typing import List, Optional, Dict, Any
import os
import logging
import jwt
import time
from datetime import datetime, timedelta
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, String, Integer, DateTime, Boolean, Text, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import SQLAlchemyError
import redis
from contextlib import asynccontextmanager
import json

# Import template handler
from .template_handler import template_handler, TemplateCommand, TemplateResult, TemplateCategory
from .middleware import (
    SecurityMiddleware,
    RateLimitMiddleware,
    LoggingMiddleware,
    ErrorHandlingMiddleware,
    CSRFMiddleware,
    ContentTypeMiddleware,
    RequestIdMiddleware,
)

# Load environment variables
load_dotenv()

def configure_logging():
    """Configure logging based on config/observability/logging.json"""
    try:
        with open(os.path.join('config', 'observability', 'logging.json'), 'r', encoding='utf-8') as f:
            cfg = json.load(f)
    except Exception:
        cfg = {"level": "info", "format": "plain"}

    level = getattr(logging, str(cfg.get('level', 'info')).upper(), logging.INFO)
    root = logging.getLogger()
    root.setLevel(level)
    # Clear existing handlers to avoid duplicates
    for h in list(root.handlers):
        root.removeHandler(h)

    class JsonFormatter(logging.Formatter):
        def format(self, record: logging.LogRecord) -> str:
            base = {
                "timestamp": datetime.utcnow().isoformat(),
                "level": record.levelname.lower(),
                "message": record.getMessage(),
                "component": getattr(record, 'component', record.name),
                "requestId": getattr(record, 'requestId', None)
            }
            # Attach any extras commonly used
            for k in ("status", "durationMs", "path", "method", "client"):
                v = getattr(record, k, None)
                if v is not None:
                    base[k] = v
            return json.dumps(base)

    stream_handler = logging.StreamHandler()
    file_handler = logging.FileHandler('app.log')
    if cfg.get('format') == 'json':
        fmt = JsonFormatter()
    else:
        fmt = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    stream_handler.setFormatter(fmt)
    file_handler.setFormatter(fmt)
    root.addHandler(stream_handler)
    root.addHandler(file_handler)

configure_logging()
logger = logging.getLogger(__name__)

# Security configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# Redis configuration
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
redis_client = redis.from_url(REDIS_URL)

# Security
security = HTTPBearer()

# Database Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    status = Column(String, default="pending")
    user_id = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic models
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool
    is_admin: bool

class TaskCreate(BaseModel):
    title: str
    description: str

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class TaskResponse(BaseModel):
    id: int
    title: str
    description: str
    status: str
    user_id: int
    created_at: datetime
    updated_at: datetime

class HealthResponse(BaseModel):
    status: str
    message: str
    timestamp: datetime
    version: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

# Template-related models
class TemplateExecuteRequest(BaseModel):
    message: str
    user_context: Optional[Dict[str, Any]] = {}

class TemplateExecuteResponse(BaseModel):
    success: bool
    output: str
    data: Dict[str, Any] = {}
    errors: List[str] = []
    execution_time: float
    template_used: str

class TemplateListResponse(BaseModel):
    templates: List[Dict[str, Any]]
    total_count: int
    categories: List[str]

# Autonomous System Models
class AutonomousErrorReport(BaseModel):
    timestamp: str
    error: Dict[str, Any]
    componentStack: Optional[str] = None
    context: Dict[str, Any]
    severity: str
    source: str

class AutonomousFrameRegistration(BaseModel):
    frames: List[Dict[str, Any]]
    source: str

class AutonomousHealthResponse(BaseModel):
    status: str
    timestamp: str
    frames: Dict[str, Any]
    autonomous_active: bool

# Utility functions
def get_password_hash(password: str) -> str:
    import hashlib
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return get_password_hash(plain_password) == hashed_password

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return payload
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(payload: Dict[str, Any] = Depends(verify_token), db: Session = Depends(get_db)):
    username = payload.get("sub")
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Rate limiting
def check_rate_limit(request: Request, user_id: int):
    key = f"rate_limit:{user_id}:{int(time.time() // 60)}"
    current = redis_client.get(key)
    if current and int(current) > 100:  # 100 requests per minute
        raise HTTPException(status_code=429, detail="Rate limit exceeded")
    redis_client.incr(key)
    redis_client.expire(key, 60)

# Application lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting AZ Interface API")
    try:
        # Test database connection
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        logger.info("Database connection successful")
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        raise
    
    try:
        # Test Redis connection
        redis_client.ping()
        logger.info("Redis connection successful")
    except Exception as e:
        logger.warning(f"Redis connection failed: {e}")
        logger.info("Continuing without Redis (rate limiting disabled)")
        # Don't raise - make Redis optional
    # Set readiness state
    app.state.ready = True
    yield
    
    # Shutdown
    logger.info("Shutting down AZ Interface API")
    app.state.ready = False

# Create FastAPI app
app = FastAPI(
    title="AZ Interface API",
    version="1.0.0",
    description="Production-ready API for Agent Zero Vault",
    lifespan=lifespan
)

# Configure CORS for production
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    os.getenv("FRONTEND_URL", "http://localhost:3000")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Install core middlewares
app.add_middleware(RequestIdMiddleware)
app.add_middleware(ErrorHandlingMiddleware)
app.add_middleware(SecurityMiddleware)
app.add_middleware(ContentTypeMiddleware)
app.add_middleware(LoggingMiddleware)
# Optional rate limit if Redis available
try:
    redis_client.ping()
    app.add_middleware(RateLimitMiddleware, redis_client=redis_client)
except Exception:
    pass

# Global exception handler
@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    logger.warning(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": "Validation error", "errors": exc.errors()}
    )

@app.exception_handler(SQLAlchemyError)
async def database_exception_handler(request: Request, exc: SQLAlchemyError):
    logger.error(f"Database error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Database error occurred"}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unexpected error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        message="AZ Interface API is running",
        timestamp=datetime.utcnow(),
        version="1.0.0"
    )

# Liveness probe (process/responding)
@app.get("/liveness")
async def liveness():
    return {"status": "alive", "timestamp": datetime.utcnow().isoformat()}

# Readiness probe (dependencies ready: DB, optional Redis)
@app.get("/readiness")
async def readiness():
    issues = []
    # DB check
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
    except Exception as e:
        issues.append({"component": "database", "error": str(e)})
    # Redis optional
    try:
        redis_client.ping()
    except Exception as e:
        # Redis is optional; record warning but do not fail readiness
        issues.append({"component": "redis", "warning": str(e)})
    # Also consider app.state.ready
    not_ready = not getattr(app.state, 'ready', False) or any('error' in i for i in issues)
    status_code = 200 if not not_ready else 503
    payload = {
        "status": "ready" if status_code == 200 else "not_ready",
        "issues": issues,
        "timestamp": datetime.utcnow().isoformat()
    }
    return JSONResponse(status_code=status_code, content=payload)

# Authentication endpoints
@app.post("/auth/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.username == user.username) | (User.email == user.email)
    ).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        logger.info(f"New user registered: {user.username}")
        return UserResponse(
            id=db_user.id,
            username=db_user.username,
            email=db_user.email,
            is_active=db_user.is_active,
            is_admin=db_user.is_admin
        )
    except Exception as e:
        db.rollback()
        logger.error(f"User registration failed: {e}")
        raise HTTPException(status_code=500, detail="Registration failed")

@app.post("/auth/login", response_model=TokenResponse)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == user_credentials.username).first()
    if not user or not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    logger.info(f"User logged in: {user.username}")
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

# Protected endpoints
@app.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        is_active=current_user.is_active,
        is_admin=current_user.is_admin
    )

# Task endpoints
@app.get("/tasks", response_model=List[TaskResponse])
async def get_tasks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    check_rate_limit(Request, current_user.id)
    
    tasks = db.query(Task).filter(Task.user_id == current_user.id).offset(skip).limit(limit).all()
    return [
        TaskResponse(
            id=task.id,
            title=task.title,
            description=task.description,
            status=task.status,
            user_id=task.user_id,
            created_at=task.created_at,
            updated_at=task.updated_at
        ) for task in tasks
    ]

@app.post("/tasks", response_model=TaskResponse)
async def create_task(
    task: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    check_rate_limit(Request, current_user.id)
    
    db_task = Task(
        title=task.title,
        description=task.description,
        user_id=current_user.id
    )
    
    try:
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        logger.info(f"Task created by user {current_user.username}: {task.title}")
        return TaskResponse(
            id=db_task.id,
            title=db_task.title,
            description=db_task.description,
            status=db_task.status,
            user_id=db_task.user_id,
            created_at=db_task.created_at,
            updated_at=db_task.updated_at
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Task creation failed: {e}")
        raise HTTPException(status_code=500, detail="Task creation failed")

@app.get("/tasks/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    check_rate_limit(Request, current_user.id)
    
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        status=task.status,
        user_id=task.user_id,
        created_at=task.created_at,
        updated_at=task.updated_at
    )

@app.put("/tasks/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    check_rate_limit(Request, current_user.id)
    
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = task_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)
    
    task.updated_at = datetime.utcnow()
    
    try:
        db.commit()
        db.refresh(task)
        logger.info(f"Task updated by user {current_user.username}: {task.title}")
        return TaskResponse(
            id=task.id,
            title=task.title,
            description=task.description,
            status=task.status,
            user_id=task.user_id,
            created_at=task.created_at,
            updated_at=task.updated_at
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Task update failed: {e}")
        raise HTTPException(status_code=500, detail="Task update failed")

@app.delete("/tasks/{task_id}")
async def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    check_rate_limit(Request, current_user.id)
    
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    try:
        db.delete(task)
        db.commit()
        logger.info(f"Task deleted by user {current_user.username}: {task.title}")
        return {"message": "Task deleted successfully"}
    except Exception as e:
        db.rollback()
        logger.error(f"Task deletion failed: {e}")
        raise HTTPException(status_code=500, detail="Task deletion failed")

# ============================================================================
# TEMPLATE COMMAND HANDLERS - AZV-002 Implementation
# ============================================================================

@app.post("/templates/execute", response_model=TemplateExecuteResponse)
async def execute_template_command(
    request: TemplateExecuteRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Execute a template command from user message
    
    Supports @template commands like:
    - @template rpg_condition_assessment item_type="book" condition_notes="good"
    - @template market_intelligence item_category="rpg" timeframe="30d"
    - @template list
    """
    check_rate_limit(Request, current_user.id)
    
    try:
        # Check for special commands
        if request.message.strip().lower() == "@template list":
            templates = template_handler.get_available_templates()
            return TemplateExecuteResponse(
                success=True,
                output="Available templates:\n\n" + "\n".join([
                    f"• {t['symbol']} **{t['name']}** ({t['category']}) - {t['description']}"
                    for t in templates
                ]),
                data={"templates": templates},
                execution_time=0.0,
                template_used="template_list"
            )
        
        # Parse template command
        command = template_handler.parse_template_command(request.message, request.user_context)
        
        if not command:
            return TemplateExecuteResponse(
                success=False,
                output="No template command found. Use @template list to see available templates.",
                errors=["No @template command detected"],
                execution_time=0.0,
                template_used=""
            )
        
        # Execute template
        result = await template_handler.execute_template(command)
        
        logger.info(f"Template executed by user {current_user.username}: {result.template_used}")
        
        return TemplateExecuteResponse(
            success=result.success,
            output=result.output,
            data=result.data,
            errors=result.errors,
            execution_time=result.execution_time,
            template_used=result.template_used
        )
        
    except Exception as e:
        logger.error(f"Error in template execution: {str(e)}")
        return TemplateExecuteResponse(
            success=False,
            output=f"Error executing template command: {str(e)}",
            errors=[str(e)],
            execution_time=0.0,
            template_used=""
        )

@app.get("/templates/list", response_model=TemplateListResponse)
async def list_templates(
    category: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """
    List available templates, optionally filtered by category
    
    Categories: Business, Vault, System, Integration, Consciousness
    """
    check_rate_limit(Request, current_user.id)
    
    try:
        # Convert category string to enum if provided
        template_category = None
        if category:
            try:
                template_category = TemplateCategory(category)
            except ValueError:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Invalid category. Must be one of: {[c.value for c in TemplateCategory]}"
                )
        
        templates = template_handler.get_available_templates(template_category)
        
        # Get unique categories
        categories = list(set([t["category"] for t in templates]))
        
        logger.info(f"Templates listed by user {current_user.username}: {len(templates)} templates")
        
        return TemplateListResponse(
            templates=templates,
            total_count=len(templates),
            categories=categories
        )
        
    except Exception as e:
        logger.error(f"Error listing templates: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error listing templates: {str(e)}")

@app.get("/templates/{template_id}")
async def get_template_details(
    template_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Get detailed information about a specific template
    """
    check_rate_limit(Request, current_user.id)
    
    try:
        templates = template_handler.get_available_templates()
        template = next((t for t in templates if t["id"] == template_id), None)
        
        if not template:
            raise HTTPException(status_code=404, detail=f"Template '{template_id}' not found")
        
        logger.info(f"Template details retrieved by user {current_user.username}: {template_id}")
        
        return template
        
    except Exception as e:
        logger.error(f"Error getting template details: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting template details: {str(e)}")

# ============================================================================
# AUTONOMOUS SYSTEM ENDPOINTS - Integration with AZ Interface Framework
# ============================================================================

# Global autonomous state
autonomous_frames = {}
autonomous_errors = []

@app.post("/api/autonomous/error-report")
async def report_autonomous_error(
    error_report: AutonomousErrorReport,
    request: Request
):
    """
    Receive error reports from autonomous system components
    """
    try:
        # Store error in memory (in production, use persistent storage)
        error_data = error_report.dict()
        error_data['received_at'] = datetime.utcnow().isoformat()
        error_data['request_id'] = getattr(request.state, 'request_id', 'unknown')
        
        autonomous_errors.append(error_data)
        
        # Keep only last 100 errors to prevent memory bloat
        if len(autonomous_errors) > 100:
            autonomous_errors.pop(0)
        
        # Log error for monitoring
        logger.error(
            f"Autonomous error reported: {error_report.error.get('message', 'Unknown error')}",
            extra={
                'component': 'autonomous_system',
                'source': error_report.source,
                'severity': error_report.severity,
                'timestamp': error_report.timestamp
            }
        )
        
        # Trigger self-healing if critical
        if error_report.severity == 'critical':
            await trigger_autonomous_healing(error_report)
        
        return {
            "status": "received",
            "timestamp": datetime.utcnow().isoformat(),
            "error_id": len(autonomous_errors)
        }
        
    except Exception as e:
        logger.error(f"Failed to process autonomous error report: {e}")
        raise HTTPException(status_code=500, detail="Failed to process error report")

@app.post("/api/autonomous/frames/register")
async def register_autonomous_frames(
    frame_registration: AutonomousFrameRegistration,
    request: Request
):
    """
    Register autonomous frames for monitoring
    """
    try:
        for frame in frame_registration.frames:
            frame_id = frame.get('id')
            if frame_id:
                frame['registered_at'] = datetime.utcnow().isoformat()
                frame['source'] = frame_registration.source
                frame['request_id'] = getattr(request.state, 'request_id', 'unknown')
                autonomous_frames[frame_id] = frame
        
        logger.info(
            f"Autonomous frames registered from {frame_registration.source}: {len(frame_registration.frames)} frames",
            extra={'component': 'autonomous_system'}
        )
        
        return {
            "status": "registered",
            "frames_count": len(frame_registration.frames),
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Failed to register autonomous frames: {e}")
        raise HTTPException(status_code=500, detail="Failed to register frames")

@app.get("/api/autonomous/health", response_model=AutonomousHealthResponse)
async def get_autonomous_health():
    """
    Get health status of autonomous system
    """
    try:
        # Calculate health metrics
        active_frames = sum(1 for f in autonomous_frames.values() if f.get('status') == 'active')
        error_frames = sum(1 for f in autonomous_frames.values() if f.get('status') == 'error')
        recent_errors = len([e for e in autonomous_errors if 
            datetime.fromisoformat(e['received_at'].replace('Z', '+00:00')).timestamp() > 
            (datetime.utcnow().timestamp() - 3600)  # Last hour
        ])
        
        # Determine overall status
        if error_frames > active_frames * 0.5:  # More than 50% frames in error
            status = 'critical'
        elif recent_errors > 10:  # More than 10 errors in last hour
            status = 'degraded'
        elif len(autonomous_frames) == 0:
            status = 'inactive'
        else:
            status = 'healthy'
        
        return AutonomousHealthResponse(
            status=status,
            timestamp=datetime.utcnow().isoformat(),
            frames={
                'total': len(autonomous_frames),
                'active': active_frames,
                'error': error_frames,
                'details': autonomous_frames
            },
            autonomous_active=len(autonomous_frames) > 0
        )
        
    except Exception as e:
        logger.error(f"Failed to get autonomous health: {e}")
        return AutonomousHealthResponse(
            status='error',
            timestamp=datetime.utcnow().isoformat(),
            frames={'error': str(e)},
            autonomous_active=False
        )

@app.get("/api/autonomous/errors")
async def get_autonomous_errors(
    limit: int = 50,
    severity: Optional[str] = None,
    source: Optional[str] = None
):
    """
    Get recent autonomous system errors
    """
    try:
        filtered_errors = autonomous_errors
        
        # Filter by severity
        if severity:
            filtered_errors = [e for e in filtered_errors if e.get('severity') == severity]
        
        # Filter by source
        if source:
            filtered_errors = [e for e in filtered_errors if e.get('source') == source]
        
        # Sort by timestamp (most recent first) and limit
        filtered_errors = sorted(
            filtered_errors, 
            key=lambda x: x.get('received_at', ''), 
            reverse=True
        )[:limit]
        
        return {
            "errors": filtered_errors,
            "total": len(filtered_errors),
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Failed to get autonomous errors: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve errors")

@app.get("/api/autonomous/frames")
async def get_autonomous_frames(
    status: Optional[str] = None,
    source: Optional[str] = None
):
    """
    Get registered autonomous frames
    """
    try:
        filtered_frames = autonomous_frames
        
        # Filter by status
        if status:
            filtered_frames = {k: v for k, v in filtered_frames.items() if v.get('status') == status}
        
        # Filter by source
        if source:
            filtered_frames = {k: v for k, v in filtered_frames.items() if v.get('source') == source}
        
        return {
            "frames": filtered_frames,
            "total": len(filtered_frames),
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Failed to get autonomous frames: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve frames")

async def trigger_autonomous_healing(error_report: AutonomousErrorReport):
    """
    Trigger autonomous self-healing procedures for critical errors
    """
    try:
        logger.info(
            f"Triggering autonomous healing for critical error from {error_report.source}",
            extra={'component': 'autonomous_healing'}
        )
        
        # Implement healing strategies based on error type
        error_type = error_report.error.get('name', 'unknown')
        
        healing_actions = {
            'TypeError': 'type_validation_scaffold',
            'NetworkError': 'connection_retry_scaffold',
            'DatabaseError': 'database_recovery_scaffold',
            'AuthenticationError': 'auth_refresh_scaffold',
            'ValidationError': 'input_sanitization_scaffold'
        }
        
        action = healing_actions.get(error_type, 'generic_error_scaffold')
        
        # Log healing action (in production, trigger actual healing procedures)
        logger.info(
            f"Autonomous healing action selected: {action}",
            extra={
                'component': 'autonomous_healing',
                'action': action,
                'error_type': error_type,
                'severity': error_report.severity
            }
        )
        
        # Update frame status if applicable
        source_parts = error_report.source.split('-')
        if len(source_parts) > 1:
            frame_id = source_parts[0]
            if frame_id in autonomous_frames:
                autonomous_frames[frame_id]['status'] = 'recovering'
                autonomous_frames[frame_id]['healing_action'] = action
                autonomous_frames[frame_id]['healing_triggered_at'] = datetime.utcnow().isoformat()
        
    except Exception as e:
        logger.error(f"Failed to trigger autonomous healing: {e}")

# Health check with detailed system metrics (enhanced version)
@app.get("/health/detailed")
async def detailed_health():
    """Detailed health check with system metrics for autonomous monitoring"""
    try:
        import psutil
        import sys
        
        # Database check
        db_status = "healthy"
        try:
            db = SessionLocal()
            db.execute(text("SELECT 1"))
            db.close()
        except Exception as e:
            db_status = f"unhealthy: {str(e)}"

        # Redis check  
        redis_status = "healthy"
        try:
            redis_client.ping()
        except Exception as e:
            redis_status = f"unhealthy: {str(e)}"

        # System metrics
        system_metrics = {
            "cpu_percent": psutil.cpu_percent(interval=1),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_percent": psutil.disk_usage('/').percent if os.name != 'nt' else psutil.disk_usage('C:').percent,
            "uptime": time.time() - psutil.boot_time()
        }

        # Autonomous system metrics
        autonomous_metrics = {
            "active_frames": len([f for f in autonomous_frames.values() if f.get('status') == 'active']),
            "error_frames": len([f for f in autonomous_frames.values() if f.get('status') == 'error']),
            "recent_errors": len([e for e in autonomous_errors if 
                datetime.fromisoformat(e['received_at'].replace('Z', '+00:00')).timestamp() > 
                (datetime.utcnow().timestamp() - 3600)
            ]),
            "total_frames": len(autonomous_frames)
        }

        health_data = {
            "status": "healthy" if db_status == "healthy" else "degraded",
            "timestamp": datetime.utcnow().isoformat(),
            "version": "1.0.0",
            "services": {
                "database": db_status,
                "redis": redis_status,
            },
            "system": system_metrics,
            "autonomous": autonomous_metrics,
            "environment": {
                "python_version": f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}",
                "platform": os.name
            }
        }

        status_code = 200 if health_data["status"] == "healthy" else 503
        return JSONResponse(status_code=status_code, content=health_data)
        
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "status": "unhealthy",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
