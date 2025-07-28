from sqlalchemy.orm import Session

from . import models, schemas


def get_task(db: Session, task_id: int) -> models.Task | None:
    """Retrieve a single task by ID."""
    return db.query(models.Task).filter(models.Task.id == task_id).first()


def get_tasks(db: Session, skip: int = 0, limit: int = 100) -> list[models.Task]:
    """Return a list of tasks."""
    return db.query(models.Task).offset(skip).limit(limit).all()


def create_task(db: Session, task: schemas.TaskCreate) -> models.Task:
    """Create a new task and persist it to the database."""
    db_task = models.Task(title=task.title, description=task.description, status=task.status)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

