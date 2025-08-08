from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

# Enums
class ConsciousnessLevel(str, Enum):
    AWARENESS = "awareness"
    UNDERSTANDING = "understanding"
    INTEGRATION = "integration"
    MASTERY = "mastery"
    TRANSCENDENCE = "transcendence"

class WorkflowStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    ARCHIVED = "archived"

class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class TaskStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    BLOCKED = "blocked"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class IntegrationType(str, Enum):
    API = "api"
    WEBHOOK = "webhook"
    DATABASE = "database"
    FILE_SYSTEM = "file_system"
    MESSAGING = "messaging"

# Base schemas
class BaseSchema(BaseModel):
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

# User schemas
class UserBase(BaseSchema):
    username: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., pattern=r"^[^@]+@[^@]+\.[^@]+$")
    consciousness_level: Optional[ConsciousnessLevel] = ConsciousnessLevel.AWARENESS
    evolution_score: Optional[float] = Field(0.0, ge=0.0, le=100.0)
    preferences: Optional[Dict[str, Any]] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserUpdate(BaseSchema):
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[str] = Field(None, pattern=r"^[^@]+@[^@]+\.[^@]+$")
    consciousness_level: Optional[ConsciousnessLevel] = None
    evolution_score: Optional[float] = Field(None, ge=0.0, le=100.0)
    preferences: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None

class UserResponse(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime
    updated_at: datetime
    last_evolution_check: Optional[datetime] = None

# Task schemas
class TaskBase(BaseSchema):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    priority: TaskPriority = TaskPriority.MEDIUM
    due_date: Optional[datetime] = None
    estimated_hours: Optional[float] = Field(None, ge=0.0)
    tags: Optional[List[str]] = None
    task_metadata: Optional[Dict[str, Any]] = None

class TaskCreate(TaskBase):
    workflow_id: Optional[int] = None

class TaskUpdate(BaseSchema):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    workflow_id: Optional[int] = None
    due_date: Optional[datetime] = None
    estimated_hours: Optional[float] = Field(None, ge=0.0)
    actual_hours: Optional[float] = Field(None, ge=0.0)
    tags: Optional[List[str]] = None
    task_metadata: Optional[Dict[str, Any]] = None

class TaskResponse(TaskBase):
    id: int
    status: TaskStatus
    user_id: int
    workflow_id: Optional[int] = None
    actual_hours: Optional[float] = None
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None

# Subtask schemas
class SubtaskBase(BaseSchema):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    order_index: int = Field(0, ge=0)

class SubtaskCreate(SubtaskBase):
    parent_task_id: int

class SubtaskUpdate(BaseSchema):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    order_index: Optional[int] = Field(None, ge=0)

class SubtaskResponse(SubtaskBase):
    id: int
    status: TaskStatus
    parent_task_id: int
    created_at: datetime
    completed_at: Optional[datetime] = None

# Workflow schemas
class WorkflowBase(BaseSchema):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    template_id: Optional[str] = None
    configuration: Optional[Dict[str, Any]] = None
    workflow_metadata: Optional[Dict[str, Any]] = None

class WorkflowCreate(WorkflowBase):
    pass

class WorkflowUpdate(BaseSchema):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    status: Optional[WorkflowStatus] = None
    template_id: Optional[str] = None
    configuration: Optional[Dict[str, Any]] = None
    workflow_metadata: Optional[Dict[str, Any]] = None

class WorkflowResponse(WorkflowBase):
    id: int
    status: WorkflowStatus
    user_id: int
    created_at: datetime
    updated_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

# WorkflowStep schemas
class WorkflowStepBase(BaseSchema):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    step_type: str = Field(..., min_length=1, max_length=50)
    order_index: int = Field(0, ge=0)
    configuration: Optional[Dict[str, Any]] = None

class WorkflowStepCreate(WorkflowStepBase):
    workflow_id: int

class WorkflowStepUpdate(BaseSchema):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    step_type: Optional[str] = Field(None, min_length=1, max_length=50)
    order_index: Optional[int] = Field(None, ge=0)
    configuration: Optional[Dict[str, Any]] = None
    is_completed: Optional[bool] = None

class WorkflowStepResponse(WorkflowStepBase):
    id: int
    workflow_id: int
    is_completed: bool
    created_at: datetime
    completed_at: Optional[datetime] = None

# Consciousness schemas
class ConsciousnessLogBase(BaseSchema):
    level: ConsciousnessLevel
    score_change: float = Field(0.0, ge=-10.0, le=10.0)
    activity_type: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = None
    duration_minutes: Optional[int] = Field(None, ge=0)
    consciousness_metadata: Optional[Dict[str, Any]] = None

class ConsciousnessLogCreate(ConsciousnessLogBase):
    pass

class ConsciousnessLogResponse(ConsciousnessLogBase):
    id: int
    user_id: int
    created_at: datetime

# Template schemas
class TemplateBase(BaseSchema):
    name: str = Field(..., min_length=1, max_length=100)
    category: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = None
    version: str = Field("1.0", pattern=r"^\d+\.\d+$")
    configuration: Optional[Dict[str, Any]] = None
    template_metadata: Optional[Dict[str, Any]] = None

class TemplateCreate(TemplateBase):
    id: str = Field(..., min_length=1, max_length=50)

class TemplateUpdate(BaseSchema):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    category: Optional[str] = Field(None, min_length=1, max_length=50)
    description: Optional[str] = None
    version: Optional[str] = Field(None, pattern=r"^\d+\.\d+$")
    is_active: Optional[bool] = None
    configuration: Optional[Dict[str, Any]] = None
    template_metadata: Optional[Dict[str, Any]] = None

class TemplateResponse(TemplateBase):
    id: str
    is_active: bool
    usage_count: int
    created_at: datetime
    updated_at: datetime
    last_used: Optional[datetime] = None

# Template Execution schemas
class TemplateExecutionBase(BaseSchema):
    input_data: Optional[Dict[str, Any]] = None
    session_id: Optional[str] = None

class TemplateExecutionCreate(TemplateExecutionBase):
    template_id: str

class TemplateExecutionResponse(TemplateExecutionBase):
    id: int
    template_id: str
    user_id: Optional[int] = None
    output_data: Optional[Dict[str, Any]] = None
    execution_time_ms: Optional[int] = None
    success: bool
    error_message: Optional[str] = None
    created_at: datetime

# Analytics schemas
class AnalyticsEventBase(BaseSchema):
    event_type: str = Field(..., min_length=1, max_length=50)
    event_name: str = Field(..., min_length=1, max_length=100)
    session_id: Optional[str] = None
    page_url: Optional[str] = None
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None
    properties: Optional[Dict[str, Any]] = None

class AnalyticsEventCreate(AnalyticsEventBase):
    pass

class AnalyticsEventResponse(AnalyticsEventBase):
    id: int
    user_id: Optional[int] = None
    created_at: datetime

# Integration schemas
class IntegrationBase(BaseSchema):
    name: str = Field(..., min_length=1, max_length=100)
    integration_type: IntegrationType
    description: Optional[str] = None
    configuration: Optional[Dict[str, Any]] = None
    credentials: Optional[Dict[str, Any]] = None

class IntegrationCreate(IntegrationBase):
    pass

class IntegrationUpdate(BaseSchema):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    is_active: Optional[bool] = None
    configuration: Optional[Dict[str, Any]] = None
    credentials: Optional[Dict[str, Any]] = None

class IntegrationResponse(IntegrationBase):
    id: int
    is_active: bool
    last_sync: Optional[datetime] = None
    sync_status: str
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: datetime

# Notification schemas
class NotificationBase(BaseSchema):
    title: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=1)
    notification_type: str = Field(..., min_length=1, max_length=50)
    action_url: Optional[str] = None
    notification_metadata: Optional[Dict[str, Any]] = None

class NotificationCreate(NotificationBase):
    pass

class NotificationUpdate(BaseSchema):
    is_read: Optional[bool] = None

class NotificationResponse(NotificationBase):
    id: int
    user_id: int
    is_read: bool
    created_at: datetime
    read_at: Optional[datetime] = None

# Backup schemas
class BackupBase(BaseSchema):
    name: str = Field(..., min_length=1, max_length=100)
    backup_type: str = Field(..., min_length=1, max_length=50)
    file_path: str = Field(..., min_length=1)
    backup_metadata: Optional[Dict[str, Any]] = None

class BackupCreate(BackupBase):
    pass

class BackupUpdate(BaseSchema):
    status: Optional[str] = None
    file_size_bytes: Optional[int] = Field(None, ge=0)
    error_message: Optional[str] = None

class BackupResponse(BackupBase):
    id: int
    file_size_bytes: Optional[int] = None
    status: str
    created_at: datetime
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None

# Authentication schemas
class UserLogin(BaseSchema):
    username: str
    password: str

class TokenResponse(BaseSchema):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

# Health and system schemas
class HealthResponse(BaseSchema):
    status: str
    message: str
    timestamp: datetime
    version: str

class SystemStats(BaseSchema):
    total_users: int
    active_users: int
    total_tasks: int
    completed_tasks: int
    total_workflows: int
    active_workflows: int
    database_size_mb: float
    uptime_seconds: int

# Pagination schemas
class PaginationParams(BaseSchema):
    page: int = Field(1, ge=1)
    size: int = Field(10, ge=1, le=100)
    sort_by: Optional[str] = None
    sort_order: Optional[str] = Field(None, pattern=r"^(asc|desc)$")

class PaginatedResponse(BaseSchema):
    items: List[Any]
    total: int
    page: int
    size: int
    pages: int

# Search schemas
class SearchParams(BaseSchema):
    query: str = Field(..., min_length=1)
    filters: Optional[Dict[str, Any]] = None
    pagination: Optional[PaginationParams] = None

# Consciousness evolution schemas
class EvolutionProgress(BaseSchema):
    current_level: ConsciousnessLevel
    evolution_score: float
    progress_percentage: float
    next_level: Optional[ConsciousnessLevel] = None
    activities_completed: int
    total_activities: int
    last_activity_date: Optional[datetime] = None

class EvolutionRecommendation(BaseSchema):
    activity_type: str
    title: str
    description: str
    estimated_duration_minutes: int
    difficulty_level: str
    potential_score_increase: float
    prerequisites: Optional[List[str]] = None

# Workflow execution schemas
class WorkflowExecutionRequest(BaseSchema):
    workflow_id: int
    input_data: Optional[Dict[str, Any]] = None
    configuration_overrides: Optional[Dict[str, Any]] = None

class WorkflowExecutionResponse(BaseSchema):
    execution_id: str
    workflow_id: int
    status: str
    current_step: Optional[int] = None
    total_steps: int
    progress_percentage: float
    started_at: datetime
    estimated_completion: Optional[datetime] = None
    output_data: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None

# API Response schemas
class APIResponse(BaseSchema):
    success: bool
    message: str
    data: Optional[Any] = None
    errors: Optional[List[str]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ErrorResponse(BaseSchema):
    error: str
    message: str
    details: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
