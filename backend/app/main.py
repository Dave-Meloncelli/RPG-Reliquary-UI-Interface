from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="AZ Interface API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class HealthResponse(BaseModel):
    status: str
    message: str

class TaskItem(BaseModel):
    id: str
    title: str
    description: str
    status: str

# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(status="healthy", message="AZ Interface API is running")

# Example task endpoints
@app.get("/tasks", response_model=List[TaskItem])
async def get_tasks():
    # Mock data - replace with actual database queries
    return [
        TaskItem(id="1", title="System Check", description="Run diagnostics", status="pending"),
        TaskItem(id="2", title="Backup", description="Create system backup", status="completed")
    ]

@app.post("/tasks", response_model=TaskItem)
async def create_task(task: TaskItem):
    # Mock implementation - replace with actual database operations
    return task

@app.get("/tasks/{task_id}", response_model=TaskItem)
async def get_task(task_id: str):
    # Mock implementation
    if task_id == "1":
        return TaskItem(id="1", title="System Check", description="Run diagnostics", status="pending")
    raise HTTPException(status_code=404, detail="Task not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
