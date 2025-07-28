import os
import sys
import asyncio
import pytest
from httpx import AsyncClient
from httpx import ASGITransport
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

os.environ["DATABASE_URL"] = "sqlite:///./test.db"

from app.main import app
from app.database import Base, get_db

engine = create_engine(os.environ["DATABASE_URL"], connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="module")
def anyio_backend():
    return "asyncio"

@pytest.mark.anyio
async def test_health_check():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        resp = await ac.get("/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "healthy"

@pytest.mark.anyio
async def test_create_and_get_task():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {"title": "Test Task", "description": "desc", "status": "pending"}
        res = await ac.post("/tasks", json=payload)
        assert res.status_code == 200
        created = res.json()
        assert created["id"] > 0

        task_id = created["id"]
        res = await ac.get(f"/tasks/{task_id}")
        assert res.status_code == 200
        fetched = res.json()
        assert fetched["title"] == "Test Task"

        res = await ac.get("/tasks")
        assert res.status_code == 200
        tasks = res.json()
        assert any(t["id"] == task_id for t in tasks)
