from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text, ForeignKey, Float, JSON, Enum as SQLEnum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()

# Enums for consciousness evolution platform
class ConsciousnessLevel(enum.Enum):
    AWARENESS = "awareness"
    UNDERSTANDING = "understanding"
    INTEGRATION = "integration"
    MASTERY = "mastery"
    TRANSCENDENCE = "transcendence"

class WorkflowStatus(enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    ARCHIVED = "archived"

class TaskPriority(enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class TaskStatus(enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    BLOCKED = "blocked"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class IntegrationType(enum.Enum):
    API = "api"
    WEBHOOK = "webhook"
    DATABASE = "database"
    FILE_SYSTEM = "file_system"
    MESSAGING = "messaging"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Consciousness evolution fields
    consciousness_level = Column(String, default=ConsciousnessLevel.AWARENESS.value)
    evolution_score = Column(Float, default=0.0)
    last_evolution_check = Column(DateTime, nullable=True)
    preferences = Column(JSON, nullable=True)  # User preferences and settings
    
    # Relationships
    tasks = relationship("Task", back_populates="user")
    sessions = relationship("UserSession", back_populates="user")
    consciousness_logs = relationship("ConsciousnessLog", back_populates="user")
    workflows = relationship("Workflow", back_populates="user")
    analytics_events = relationship("AnalyticsEvent", back_populates="user")

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    status = Column(String, default=TaskStatus.PENDING.value)
    priority = Column(String, default=TaskPriority.MEDIUM.value)
    user_id = Column(Integer, ForeignKey("users.id"))
    workflow_id = Column(Integer, ForeignKey("workflows.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    due_date = Column(DateTime, nullable=True)
    estimated_hours = Column(Float, nullable=True)
    actual_hours = Column(Float, nullable=True)
    tags = Column(JSON, nullable=True)  # Array of tags
    task_metadata = Column(JSON, nullable=True)  # Additional task metadata

    # Relationships
    user = relationship("User", back_populates="tasks")
    workflow = relationship("Workflow", back_populates="tasks")
    subtasks = relationship("Subtask", back_populates="parent_task")
    task_logs = relationship("TaskLog", back_populates="task")

class Subtask(Base):
    __tablename__ = "subtasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    status = Column(String, default=TaskStatus.PENDING.value)
    parent_task_id = Column(Integer, ForeignKey("tasks.id"))
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    parent_task = relationship("Task", back_populates="subtasks")

class Workflow(Base):
    __tablename__ = "workflows"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    status = Column(String, default=WorkflowStatus.DRAFT.value)
    user_id = Column(Integer, ForeignKey("users.id"))
    template_id = Column(String, nullable=True)  # Reference to template system
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    configuration = Column(JSON, nullable=True)  # Workflow configuration
    workflow_metadata = Column(JSON, nullable=True)  # Additional workflow metadata
    
    # Relationships
    user = relationship("User", back_populates="workflows")
    tasks = relationship("Task", back_populates="workflow")
    workflow_steps = relationship("WorkflowStep", back_populates="workflow")

class WorkflowStep(Base):
    __tablename__ = "workflow_steps"
    
    id = Column(Integer, primary_key=True, index=True)
    workflow_id = Column(Integer, ForeignKey("workflows.id"))
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    step_type = Column(String)  # task, decision, integration, etc.
    order_index = Column(Integer, default=0)
    configuration = Column(JSON, nullable=True)  # Step-specific configuration
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    workflow = relationship("Workflow", back_populates="workflow_steps")

class UserSession(Base):
    __tablename__ = "user_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    session_token = Column(String, unique=True, index=True)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_activity = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)

    # Relationships
    user = relationship("User", back_populates="sessions")

class ConsciousnessLog(Base):
    __tablename__ = "consciousness_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    level = Column(String)
    score_change = Column(Float, default=0.0)
    activity_type = Column(String, index=True)  # meditation, reflection, practice, etc.
    description = Column(Text, nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    consciousness_metadata = Column(JSON, nullable=True)  # Additional consciousness data
    
    # Relationships
    user = relationship("User", back_populates="consciousness_logs")

class Template(Base):
    __tablename__ = "templates"
    
    id = Column(String, primary_key=True, index=True)  # Template ID from template system
    name = Column(String, index=True)
    category = Column(String, index=True)
    description = Column(Text, nullable=True)
    version = Column(String, default="1.0")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    usage_count = Column(Integer, default=0)
    last_used = Column(DateTime, nullable=True)
    configuration = Column(JSON, nullable=True)  # Template configuration
    template_metadata = Column(JSON, nullable=True)  # Additional template metadata

class TemplateExecution(Base):
    __tablename__ = "template_executions"
    
    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(String, ForeignKey("templates.id"))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    input_data = Column(JSON, nullable=True)
    output_data = Column(JSON, nullable=True)
    execution_time_ms = Column(Integer, nullable=True)
    success = Column(Boolean, default=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    session_id = Column(String, nullable=True)
    
    # Relationships
    template = relationship("Template")

class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    event_type = Column(String, index=True)  # page_view, action, error, etc.
    event_name = Column(String, index=True)
    session_id = Column(String, nullable=True)
    page_url = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    properties = Column(JSON, nullable=True)  # Event-specific properties
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="analytics_events")

class Integration(Base):
    __tablename__ = "integrations"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    integration_type = Column(String)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    configuration = Column(JSON, nullable=True)  # Integration configuration
    credentials = Column(JSON, nullable=True)  # Encrypted credentials
    last_sync = Column(DateTime, nullable=True)
    sync_status = Column(String, default="idle")  # idle, syncing, error
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class SystemLog(Base):
    __tablename__ = "system_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    level = Column(String, index=True)  # INFO, WARNING, ERROR, CRITICAL
    message = Column(Text)
    source = Column(String)  # Component that generated the log
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    log_metadata = Column(JSON, nullable=True)  # JSON string for additional data
    request_id = Column(String, nullable=True)  # For request tracing

class ApiKey(Base):
    __tablename__ = "api_keys"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    key_hash = Column(String, unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_used = Column(DateTime, nullable=True)
    permissions = Column(JSON, nullable=True)  # JSON string for permissions
    rate_limit = Column(Integer, default=1000)  # Requests per hour

class TaskLog(Base):
    __tablename__ = "task_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    action = Column(String, index=True)  # created, updated, status_changed, etc.
    old_value = Column(Text, nullable=True)
    new_value = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    task_log_metadata = Column(JSON, nullable=True)
    
    # Relationships
    task = relationship("Task", back_populates="task_logs")

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, index=True)
    message = Column(Text)
    notification_type = Column(String, index=True)  # task, system, evolution, etc.
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    read_at = Column(DateTime, nullable=True)
    action_url = Column(String, nullable=True)  # URL to navigate to when clicked
    notification_metadata = Column(JSON, nullable=True)
    
    # Relationships
    user = relationship("User")

class Backup(Base):
    __tablename__ = "backups"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    backup_type = Column(String, index=True)  # full, incremental, etc.
    file_path = Column(String)
    file_size_bytes = Column(Integer, nullable=True)
    status = Column(String, default="pending")  # pending, in_progress, completed, failed
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)
    backup_metadata = Column(JSON, nullable=True)
