from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_, func, desc, asc
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import json

from . import models, schemas
from .database import get_db

# User CRUD operations
def get_user(db: Session, user_id: int) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_username(db: Session, username: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.username == username).first()

def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[models.User]:
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        consciousness_level=user.consciousness_level,
        evolution_score=user.evolution_score,
        preferences=user.preferences
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user_update: schemas.UserUpdate) -> Optional[models.User]:
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    
    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    db_user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_evolution(db: Session, user_id: int, score_change: float, level: Optional[models.ConsciousnessLevel] = None) -> Optional[models.User]:
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    
    db_user.evolution_score = max(0.0, min(100.0, db_user.evolution_score + score_change))
    if level:
        db_user.consciousness_level = level
    db_user.last_evolution_check = datetime.utcnow()
    db_user.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_user)
    return db_user

# Task CRUD operations
def get_task(db: Session, task_id: int) -> Optional[models.Task]:
    return db.query(models.Task).filter(models.Task.id == task_id).first()

def get_tasks(db: Session, user_id: int, skip: int = 0, limit: int = 100, 
              status: Optional[models.TaskStatus] = None, 
              priority: Optional[models.TaskPriority] = None) -> List[models.Task]:
    query = db.query(models.Task).filter(models.Task.user_id == user_id)
    
    if status:
        query = query.filter(models.Task.status == status)
    if priority:
        query = query.filter(models.Task.priority == priority)
    
    return query.offset(skip).limit(limit).all()

def create_task(db: Session, task: schemas.TaskCreate, user_id: int) -> models.Task:
    db_task = models.Task(
        **task.dict(),
        user_id=user_id
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, task_id: int, task_update: schemas.TaskUpdate) -> Optional[models.Task]:
    db_task = get_task(db, task_id)
    if not db_task:
        return None
    
    update_data = task_update.dict(exclude_unset=True)
    
    # Handle status change
    if 'status' in update_data and update_data['status'] == models.TaskStatus.COMPLETED:
        db_task.completed_at = datetime.utcnow()
    
    for field, value in update_data.items():
        setattr(db_task, field, value)
    
    db_task.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int) -> bool:
    db_task = get_task(db, task_id)
    if not db_task:
        return False
    
    db.delete(db_task)
    db.commit()
    return True

# Subtask CRUD operations
def get_subtask(db: Session, subtask_id: int) -> Optional[models.Subtask]:
    return db.query(models.Subtask).filter(models.Subtask.id == subtask_id).first()

def get_subtasks_by_task(db: Session, task_id: int) -> List[models.Subtask]:
    return db.query(models.Subtask).filter(models.Subtask.parent_task_id == task_id).order_by(models.Subtask.order_index).all()

def create_subtask(db: Session, subtask: schemas.SubtaskCreate) -> models.Subtask:
    db_subtask = models.Subtask(**subtask.dict())
    db.add(db_subtask)
    db.commit()
    db.refresh(db_subtask)
    return db_subtask

def update_subtask(db: Session, subtask_id: int, subtask_update: schemas.SubtaskUpdate) -> Optional[models.Subtask]:
    db_subtask = get_subtask(db, subtask_id)
    if not db_subtask:
        return None
    
    update_data = subtask_update.dict(exclude_unset=True)
    
    if 'status' in update_data and update_data['status'] == models.TaskStatus.COMPLETED:
        db_subtask.completed_at = datetime.utcnow()
    
    for field, value in update_data.items():
        setattr(db_subtask, field, value)
    
    db.commit()
    db.refresh(db_subtask)
    return db_subtask

# Workflow CRUD operations
def get_workflow(db: Session, workflow_id: int) -> Optional[models.Workflow]:
    return db.query(models.Workflow).filter(models.Workflow.id == workflow_id).first()

def get_workflows(db: Session, user_id: int, skip: int = 0, limit: int = 100,
                  status: Optional[models.WorkflowStatus] = None) -> List[models.Workflow]:
    query = db.query(models.Workflow).filter(models.Workflow.user_id == user_id)
    
    if status:
        query = query.filter(models.Workflow.status == status)
    
    return query.offset(skip).limit(limit).all()

def create_workflow(db: Session, workflow: schemas.WorkflowCreate, user_id: int) -> models.Workflow:
    db_workflow = models.Workflow(
        **workflow.dict(),
        user_id=user_id
    )
    db.add(db_workflow)
    db.commit()
    db.refresh(db_workflow)
    return db_workflow

def update_workflow(db: Session, workflow_id: int, workflow_update: schemas.WorkflowUpdate) -> Optional[models.Workflow]:
    db_workflow = get_workflow(db, workflow_id)
    if not db_workflow:
        return None
    
    update_data = workflow_update.dict(exclude_unset=True)
    
    # Handle status changes
    if 'status' in update_data:
        if update_data['status'] == models.WorkflowStatus.ACTIVE and not db_workflow.started_at:
            db_workflow.started_at = datetime.utcnow()
        elif update_data['status'] == models.WorkflowStatus.COMPLETED:
            db_workflow.completed_at = datetime.utcnow()
    
    for field, value in update_data.items():
        setattr(db_workflow, field, value)
    
    db_workflow.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_workflow)
    return db_workflow

# WorkflowStep CRUD operations
def get_workflow_step(db: Session, step_id: int) -> Optional[models.WorkflowStep]:
    return db.query(models.WorkflowStep).filter(models.WorkflowStep.id == step_id).first()

def get_workflow_steps(db: Session, workflow_id: int) -> List[models.WorkflowStep]:
    return db.query(models.WorkflowStep).filter(models.WorkflowStep.workflow_id == workflow_id).order_by(models.WorkflowStep.order_index).all()

def create_workflow_step(db: Session, step: schemas.WorkflowStepCreate) -> models.WorkflowStep:
    db_step = models.WorkflowStep(**step.dict())
    db.add(db_step)
    db.commit()
    db.refresh(db_step)
    return db_step

def update_workflow_step(db: Session, step_id: int, step_update: schemas.WorkflowStepUpdate) -> Optional[models.WorkflowStep]:
    db_step = get_workflow_step(db, step_id)
    if not db_step:
        return None
    
    update_data = step_update.dict(exclude_unset=True)
    
    if 'is_completed' in update_data and update_data['is_completed']:
        db_step.completed_at = datetime.utcnow()
    
    for field, value in update_data.items():
        setattr(db_step, field, value)
    
    db.commit()
    db.refresh(db_step)
    return db_step

# Consciousness Log CRUD operations
def get_consciousness_log(db: Session, log_id: int) -> Optional[models.ConsciousnessLog]:
    return db.query(models.ConsciousnessLog).filter(models.ConsciousnessLog.id == log_id).first()

def get_consciousness_logs(db: Session, user_id: int, skip: int = 0, limit: int = 100,
                          activity_type: Optional[str] = None,
                          level: Optional[models.ConsciousnessLevel] = None) -> List[models.ConsciousnessLog]:
    query = db.query(models.ConsciousnessLog).filter(models.ConsciousnessLog.user_id == user_id)
    
    if activity_type:
        query = query.filter(models.ConsciousnessLog.activity_type == activity_type)
    if level:
        query = query.filter(models.ConsciousnessLog.level == level)
    
    return query.order_by(desc(models.ConsciousnessLog.created_at)).offset(skip).limit(limit).all()

def create_consciousness_log(db: Session, log: schemas.ConsciousnessLogCreate, user_id: int) -> models.ConsciousnessLog:
    db_log = models.ConsciousnessLog(
        **log.dict(),
        user_id=user_id
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    
    # Update user evolution score
    update_user_evolution(db, user_id, log.score_change, log.level)
    
    return db_log

def get_evolution_progress(db: Session, user_id: int) -> Optional[Dict[str, Any]]:
    user = get_user(db, user_id)
    if not user:
        return None
    
    # Get recent activities
    recent_logs = get_consciousness_logs(db, user_id, limit=10)
    
    # Calculate progress
    total_activities = len(recent_logs)
    completed_activities = len([log for log in recent_logs if log.score_change > 0])
    
    # Determine next level
    levels = [level.value for level in models.ConsciousnessLevel]
    current_index = levels.index(user.consciousness_level)
    next_level = levels[current_index + 1] if current_index < len(levels) - 1 else None
    
    # Calculate progress percentage (simplified)
    progress_percentage = min(100.0, (user.evolution_score / 100.0) * 100)
    
    return {
        "current_level": user.consciousness_level,
        "evolution_score": user.evolution_score,
        "progress_percentage": progress_percentage,
        "next_level": next_level,
        "activities_completed": completed_activities,
        "total_activities": total_activities,
        "last_activity_date": recent_logs[0].created_at if recent_logs else None
    }

# Template CRUD operations
def get_template(db: Session, template_id: str) -> Optional[models.Template]:
    return db.query(models.Template).filter(models.Template.id == template_id).first()

def get_templates(db: Session, skip: int = 0, limit: int = 100,
                 category: Optional[str] = None,
                 is_active: Optional[bool] = None) -> List[models.Template]:
    query = db.query(models.Template)
    
    if category:
        query = query.filter(models.Template.category == category)
    if is_active is not None:
        query = query.filter(models.Template.is_active == is_active)
    
    return query.offset(skip).limit(limit).all()

def create_template(db: Session, template: schemas.TemplateCreate) -> models.Template:
    db_template = models.Template(**template.dict())
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template

def update_template(db: Session, template_id: str, template_update: schemas.TemplateUpdate) -> Optional[models.Template]:
    db_template = get_template(db, template_id)
    if not db_template:
        return None
    
    update_data = template_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_template, field, value)
    
    db_template.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_template)
    return db_template

def increment_template_usage(db: Session, template_id: str) -> Optional[models.Template]:
    db_template = get_template(db, template_id)
    if not db_template:
        return None
    
    db_template.usage_count += 1
    db_template.last_used = datetime.utcnow()
    db.commit()
    db.refresh(db_template)
    return db_template

# Template Execution CRUD operations
def create_template_execution(db: Session, execution: schemas.TemplateExecutionCreate, 
                            user_id: Optional[int] = None) -> models.TemplateExecution:
    db_execution = models.TemplateExecution(
        **execution.dict(),
        user_id=user_id
    )
    db.add(db_execution)
    db.commit()
    db.refresh(db_execution)
    return db_execution

def update_template_execution(db: Session, execution_id: int, 
                            output_data: Optional[Dict[str, Any]] = None,
                            execution_time_ms: Optional[int] = None,
                            success: bool = True,
                            error_message: Optional[str] = None) -> Optional[models.TemplateExecution]:
    db_execution = db.query(models.TemplateExecution).filter(models.TemplateExecution.id == execution_id).first()
    if not db_execution:
        return None
    
    if output_data is not None:
        db_execution.output_data = output_data
    if execution_time_ms is not None:
        db_execution.execution_time_ms = execution_time_ms
    if success is not None:
        db_execution.success = success
    if error_message is not None:
        db_execution.error_message = error_message
    
    db.commit()
    db.refresh(db_execution)
    return db_execution

# Analytics CRUD operations
def create_analytics_event(db: Session, event: schemas.AnalyticsEventCreate, 
                          user_id: Optional[int] = None) -> models.AnalyticsEvent:
    db_event = models.AnalyticsEvent(
        **event.dict(),
        user_id=user_id
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def get_analytics_events(db: Session, user_id: Optional[int] = None,
                        event_type: Optional[str] = None,
                        start_date: Optional[datetime] = None,
                        end_date: Optional[datetime] = None,
                        skip: int = 0, limit: int = 100) -> List[models.AnalyticsEvent]:
    query = db.query(models.AnalyticsEvent)
    
    if user_id:
        query = query.filter(models.AnalyticsEvent.user_id == user_id)
    if event_type:
        query = query.filter(models.AnalyticsEvent.event_type == event_type)
    if start_date:
        query = query.filter(models.AnalyticsEvent.created_at >= start_date)
    if end_date:
        query = query.filter(models.AnalyticsEvent.created_at <= end_date)
    
    return query.order_by(desc(models.AnalyticsEvent.created_at)).offset(skip).limit(limit).all()

# Integration CRUD operations
def get_integration(db: Session, integration_id: int) -> Optional[models.Integration]:
    return db.query(models.Integration).filter(models.Integration.id == integration_id).first()

def get_integrations(db: Session, skip: int = 0, limit: int = 100,
                    integration_type: Optional[models.IntegrationType] = None,
                    is_active: Optional[bool] = None) -> List[models.Integration]:
    query = db.query(models.Integration)
    
    if integration_type:
        query = query.filter(models.Integration.integration_type == integration_type)
    if is_active is not None:
        query = query.filter(models.Integration.is_active == is_active)
    
    return query.offset(skip).limit(limit).all()

def create_integration(db: Session, integration: schemas.IntegrationCreate) -> models.Integration:
    db_integration = models.Integration(**integration.dict())
    db.add(db_integration)
    db.commit()
    db.refresh(db_integration)
    return db_integration

def update_integration(db: Session, integration_id: int, integration_update: schemas.IntegrationUpdate) -> Optional[models.Integration]:
    db_integration = get_integration(db, integration_id)
    if not db_integration:
        return None
    
    update_data = integration_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_integration, field, value)
    
    db_integration.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_integration)
    return db_integration

def update_integration_sync_status(db: Session, integration_id: int, 
                                 sync_status: str, 
                                 error_message: Optional[str] = None) -> Optional[models.Integration]:
    db_integration = get_integration(db, integration_id)
    if not db_integration:
        return None
    
    db_integration.sync_status = sync_status
    db_integration.last_sync = datetime.utcnow()
    if error_message:
        db_integration.error_message = error_message
    
    db.commit()
    db.refresh(db_integration)
    return db_integration

# Notification CRUD operations
def get_notification(db: Session, notification_id: int) -> Optional[models.Notification]:
    return db.query(models.Notification).filter(models.Notification.id == notification_id).first()

def get_notifications(db: Session, user_id: int, skip: int = 0, limit: int = 100,
                     is_read: Optional[bool] = None,
                     notification_type: Optional[str] = None) -> List[models.Notification]:
    query = db.query(models.Notification).filter(models.Notification.user_id == user_id)
    
    if is_read is not None:
        query = query.filter(models.Notification.is_read == is_read)
    if notification_type:
        query = query.filter(models.Notification.notification_type == notification_type)
    
    return query.order_by(desc(models.Notification.created_at)).offset(skip).limit(limit).all()

def create_notification(db: Session, notification: schemas.NotificationCreate, user_id: int) -> models.Notification:
    db_notification = models.Notification(
        **notification.dict(),
        user_id=user_id
    )
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification

def mark_notification_read(db: Session, notification_id: int) -> Optional[models.Notification]:
    db_notification = get_notification(db, notification_id)
    if not db_notification:
        return None
    
    db_notification.is_read = True
    db_notification.read_at = datetime.utcnow()
    db.commit()
    db.refresh(db_notification)
    return db_notification

def mark_all_notifications_read(db: Session, user_id: int) -> int:
    result = db.query(models.Notification).filter(
        models.Notification.user_id == user_id,
        models.Notification.is_read == False
    ).update({
        "is_read": True,
        "read_at": datetime.utcnow()
    })
    db.commit()
    return result

# Backup CRUD operations
def get_backup(db: Session, backup_id: int) -> Optional[models.Backup]:
    return db.query(models.Backup).filter(models.Backup.id == backup_id).first()

def get_backups(db: Session, skip: int = 0, limit: int = 100,
                backup_type: Optional[str] = None,
                status: Optional[str] = None) -> List[models.Backup]:
    query = db.query(models.Backup)
    
    if backup_type:
        query = query.filter(models.Backup.backup_type == backup_type)
    if status:
        query = query.filter(models.Backup.status == status)
    
    return query.order_by(desc(models.Backup.created_at)).offset(skip).limit(limit).all()

def create_backup(db: Session, backup: schemas.BackupCreate) -> models.Backup:
    db_backup = models.Backup(**backup.dict())
    db.add(db_backup)
    db.commit()
    db.refresh(db_backup)
    return db_backup

def update_backup_status(db: Session, backup_id: int, status: str,
                        file_size_bytes: Optional[int] = None,
                        error_message: Optional[str] = None) -> Optional[models.Backup]:
    db_backup = get_backup(db, backup_id)
    if not db_backup:
        return None
    
    db_backup.status = status
    if status == "completed":
        db_backup.completed_at = datetime.utcnow()
    if file_size_bytes is not None:
        db_backup.file_size_bytes = file_size_bytes
    if error_message is not None:
        db_backup.error_message = error_message
    
    db.commit()
    db.refresh(db_backup)
    return db_backup

# System Stats
def get_system_stats(db: Session) -> Dict[str, Any]:
    total_users = db.query(func.count(models.User.id)).scalar()
    active_users = db.query(func.count(models.User.id)).filter(models.User.is_active == True).scalar()
    total_tasks = db.query(func.count(models.Task.id)).scalar()
    completed_tasks = db.query(func.count(models.Task.id)).filter(models.Task.status == models.TaskStatus.COMPLETED.value).scalar()
    total_workflows = db.query(func.count(models.Workflow.id)).scalar()
    active_workflows = db.query(func.count(models.Workflow.id)).filter(models.Workflow.status == models.WorkflowStatus.ACTIVE.value).scalar()
    
    return {
        "total_users": total_users,
        "active_users": active_users,
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "total_workflows": total_workflows,
        "active_workflows": active_workflows,
        "database_size_mb": 0.0,  # Would need to calculate from actual database
        "uptime_seconds": 0  # Would need to track from application start
    }

# Utility functions
def get_password_hash(password: str) -> str:
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    return pwd_context.verify(plain_password, hashed_password)
