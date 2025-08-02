import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import os
import sys

# Add the backend directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'backend'))

from app.main import app
from app.database import get_db, Base
from app.models import User, Task

# Create in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def client():
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as c:
        yield c
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def test_user():
    return {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpassword123"
    }

@pytest.fixture
def test_task():
    return {
        "title": "Test Task",
        "description": "This is a test task"
    }

class TestHealthCheck:
    def test_health_check(self, client):
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data
        assert data["version"] == "1.0.0"

class TestAuthentication:
    def test_register_user(self, client, test_user):
        response = client.post("/auth/register", json=test_user)
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == test_user["username"]
        assert data["email"] == test_user["email"]
        assert "id" in data
        assert data["is_active"] is True
        assert data["is_admin"] is False

    def test_register_duplicate_username(self, client, test_user):
        # Register first user
        client.post("/auth/register", json=test_user)
        
        # Try to register with same username
        duplicate_user = test_user.copy()
        duplicate_user["email"] = "different@example.com"
        response = client.post("/auth/register", json=duplicate_user)
        assert response.status_code == 400
        assert "already registered" in response.json()["detail"]

    def test_register_duplicate_email(self, client, test_user):
        # Register first user
        client.post("/auth/register", json=test_user)
        
        # Try to register with same email
        duplicate_user = test_user.copy()
        duplicate_user["username"] = "differentuser"
        response = client.post("/auth/register", json=duplicate_user)
        assert response.status_code == 400
        assert "already registered" in response.json()["detail"]

    def test_login_success(self, client, test_user):
        # Register user first
        client.post("/auth/register", json=test_user)
        
        # Login
        login_data = {
            "username": test_user["username"],
            "password": test_user["password"]
        }
        response = client.post("/auth/login", json=login_data)
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert "expires_in" in data

    def test_login_invalid_credentials(self, client, test_user):
        # Register user first
        client.post("/auth/register", json=test_user)
        
        # Try to login with wrong password
        login_data = {
            "username": test_user["username"],
            "password": "wrongpassword"
        }
        response = client.post("/auth/login", json=login_data)
        assert response.status_code == 401
        assert "Incorrect username or password" in response.json()["detail"]

    def test_login_nonexistent_user(self, client):
        login_data = {
            "username": "nonexistent",
            "password": "password"
        }
        response = client.post("/auth/login", json=login_data)
        assert response.status_code == 401
        assert "Incorrect username or password" in response.json()["detail"]

class TestProtectedEndpoints:
    def test_get_user_me_authenticated(self, client, test_user):
        # Register and login
        client.post("/auth/register", json=test_user)
        login_response = client.post("/auth/login", json={
            "username": test_user["username"],
            "password": test_user["password"]
        })
        token = login_response.json()["access_token"]
        
        # Test protected endpoint
        headers = {"Authorization": f"Bearer {token}"}
        response = client.get("/users/me", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == test_user["username"]
        assert data["email"] == test_user["email"]

    def test_get_user_me_unauthenticated(self, client):
        response = client.get("/users/me")
        assert response.status_code == 403

    def test_get_user_me_invalid_token(self, client):
        headers = {"Authorization": "Bearer invalid_token"}
        response = client.get("/users/me", headers=headers)
        assert response.status_code == 401

class TestTasks:
    def test_create_task_authenticated(self, client, test_user, test_task):
        # Register and login
        client.post("/auth/register", json=test_user)
        login_response = client.post("/auth/login", json={
            "username": test_user["username"],
            "password": test_user["password"]
        })
        token = login_response.json()["access_token"]
        
        # Create task
        headers = {"Authorization": f"Bearer {token}"}
        response = client.post("/tasks", json=test_task, headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == test_task["title"]
        assert data["description"] == test_task["description"]
        assert data["status"] == "pending"
        assert "id" in data
        assert "user_id" in data

    def test_create_task_unauthenticated(self, client, test_task):
        response = client.post("/tasks", json=test_task)
        assert response.status_code == 403

    def test_get_tasks_authenticated(self, client, test_user, test_task):
        # Register and login
        client.post("/auth/register", json=test_user)
        login_response = client.post("/auth/login", json={
            "username": test_user["username"],
            "password": test_user["password"]
        })
        token = login_response.json()["access_token"]
        
        # Create a task
        headers = {"Authorization": f"Bearer {token}"}
        client.post("/tasks", json=test_task, headers=headers)
        
        # Get tasks
        response = client.get("/tasks", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 1
        assert data[0]["title"] == test_task["title"]

    def test_get_tasks_unauthenticated(self, client):
        response = client.get("/tasks")
        assert response.status_code == 403

    def test_get_task_by_id_authenticated(self, client, test_user, test_task):
        # Register and login
        client.post("/auth/register", json=test_user)
        login_response = client.post("/auth/login", json={
            "username": test_user["username"],
            "password": test_user["password"]
        })
        token = login_response.json()["access_token"]
        
        # Create a task
        headers = {"Authorization": f"Bearer {token}"}
        create_response = client.post("/tasks", json=test_task, headers=headers)
        task_id = create_response.json()["id"]
        
        # Get specific task
        response = client.get(f"/tasks/{task_id}", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == task_id
        assert data["title"] == test_task["title"]

    def test_get_task_by_id_not_found(self, client, test_user):
        # Register and login
        client.post("/auth/register", json=test_user)
        login_response = client.post("/auth/login", json={
            "username": test_user["username"],
            "password": test_user["password"]
        })
        token = login_response.json()["access_token"]
        
        # Try to get non-existent task
        headers = {"Authorization": f"Bearer {token}"}
        response = client.get("/tasks/999", headers=headers)
        assert response.status_code == 404

    def test_update_task_authenticated(self, client, test_user, test_task):
        # Register and login
        client.post("/auth/register", json=test_user)
        login_response = client.post("/auth/login", json={
            "username": test_user["username"],
            "password": test_user["password"]
        })
        token = login_response.json()["access_token"]
        
        # Create a task
        headers = {"Authorization": f"Bearer {token}"}
        create_response = client.post("/tasks", json=test_task, headers=headers)
        task_id = create_response.json()["id"]
        
        # Update task
        update_data = {"title": "Updated Task", "status": "completed"}
        response = client.put(f"/tasks/{task_id}", json=update_data, headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Updated Task"
        assert data["status"] == "completed"

    def test_delete_task_authenticated(self, client, test_user, test_task):
        # Register and login
        client.post("/auth/register", json=test_user)
        login_response = client.post("/auth/login", json={
            "username": test_user["username"],
            "password": test_user["password"]
        })
        token = login_response.json()["access_token"]
        
        # Create a task
        headers = {"Authorization": f"Bearer {token}"}
        create_response = client.post("/tasks", json=test_task, headers=headers)
        task_id = create_response.json()["id"]
        
        # Delete task
        response = client.delete(f"/tasks/{task_id}", headers=headers)
        assert response.status_code == 200
        assert response.json()["message"] == "Task deleted successfully"
        
        # Verify task is deleted
        get_response = client.get(f"/tasks/{task_id}", headers=headers)
        assert get_response.status_code == 404

class TestErrorHandling:
    def test_invalid_json(self, client):
        response = client.post("/auth/login", data="invalid json")
        assert response.status_code == 422

    def test_missing_required_fields(self, client):
        response = client.post("/auth/login", json={"username": "test"})
        assert response.status_code == 422

    def test_invalid_task_id(self, client, test_user):
        # Register and login
        client.post("/auth/register", json=test_user)
        login_response = client.post("/auth/login", json={
            "username": test_user["username"],
            "password": test_user["password"]
        })
        token = login_response.json()["access_token"]
        
        # Try to get task with invalid ID
        headers = {"Authorization": f"Bearer {token}"}
        response = client.get("/tasks/invalid", headers=headers)
        assert response.status_code == 422 