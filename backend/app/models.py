from sqlalchemy import Column, Integer, String

from .database import Base


class Task(Base):
    """SQLAlchemy model for a task item."""

    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(String, default="pending", nullable=False)

