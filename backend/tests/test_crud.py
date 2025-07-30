import os
import sys
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database import Base
from app import crud, schemas

@pytest.fixture()
def db_session():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_create_task(db_session):
    task_in = schemas.TaskCreate(title="Task 1", description="desc", status="pending")
    created = crud.create_task(db_session, task_in)
    assert created.id > 0
    assert created.title == "Task 1"


def test_get_task(db_session):
    task_in = schemas.TaskCreate(title="Another", description="desc", status="pending")
    created = crud.create_task(db_session, task_in)
    fetched = crud.get_task(db_session, created.id)
    assert fetched is not None
    assert fetched.id == created.id


def test_get_tasks(db_session):
    crud.create_task(db_session, schemas.TaskCreate(title="One", description="d", status="pending"))
    crud.create_task(db_session, schemas.TaskCreate(title="Two", description="d", status="done"))
    tasks = crud.get_tasks(db_session)
    titles = {t.title for t in tasks}
    assert {"One", "Two"}.issubset(titles)


def test_get_task_not_found(db_session):
    assert crud.get_task(db_session, 9999) is None
