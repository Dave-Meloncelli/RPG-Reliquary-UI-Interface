#!/usr/bin/env python3
"""
Multi-Agent Orchestration Service
Coordinates specialized agent teams and task distribution
"""

import asyncio
import json
import logging
import os
import time
from typing import Dict, List, Optional, Any
from contextlib import asynccontextmanager
from enum import Enum
from dataclasses import dataclass
from datetime import datetime, timedelta

import uvicorn
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import redis.asyncio as redis
import aiohttp
from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST
from fastapi.responses import Response

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables
redis_client: Optional[redis.Redis] = None
active_teams: Dict[str, Dict[str, Any]] = {}
task_queue: List[Dict[str, Any]] = []
team_workloads: Dict[str, int] = {}

# Prometheus metrics
TASK_COUNTER = Counter('orchestrator_tasks_total', 'Total tasks processed', ['team', 'status'])
TASK_DURATION = Histogram('orchestrator_task_duration_seconds', 'Task duration in seconds', ['team'])
TEAM_WORKLOAD = Gauge('orchestrator_team_workload', 'Current team workload', ['team'])
ACTIVE_SESSIONS = Gauge('orchestrator_active_sessions', 'Number of active sessions')

class TaskPriority(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class TaskType(Enum):
    RESEARCH = "research"
    DESIGN = "design"
    DEVELOPMENT = "development"
    AUDIT = "audit"
    ORCHESTRATION = "orchestration"

class TeamType(Enum):
    RESEARCH = "research"
    DESIGN = "design"
    DEVELOPMENT = "development"
    AUDIT = "audit"
    ORCHESTRATION = "orchestration"

@dataclass
class Agent:
    id: str
    name: str
    role: str
    capabilities: List[str]
    status: str = "idle"
    current_task: Optional[str] = None
    workload: int = 0

@dataclass
class Team:
    id: str
    name: str
    type: TeamType
    agents: List[Agent]
    max_concurrent_tasks: int = 5
    current_tasks: int = 0
    status: str = "active"

class TaskRequest(BaseModel):
    """Task request model"""
    task_id: str = Field(..., description="Unique task identifier")
    task_type: TaskType = Field(..., description="Type of task")
    priority: TaskPriority = Field(default=TaskPriority.MEDIUM, description="Task priority")
    description: str = Field(..., description="Task description")
    requirements: Dict[str, Any] = Field(default={}, description="Task requirements")
    estimated_duration: int = Field(default=300, description="Estimated duration in seconds")
    dependencies: List[str] = Field(default=[], description="Task dependencies")

class TaskResponse(BaseModel):
    """Task response model"""
    task_id: str = Field(..., description="Task identifier")
    assigned_team: str = Field(..., description="Assigned team")
    assigned_agents: List[str] = Field(..., description="Assigned agents")
    estimated_completion: datetime = Field(..., description="Estimated completion time")
    status: str = Field(..., description="Task status")

class TeamStatus(BaseModel):
    """Team status model"""
    team_id: str = Field(..., description="Team identifier")
    team_name: str = Field(..., description="Team name")
    team_type: str = Field(..., description="Team type")
    status: str = Field(..., description="Team status")
    active_agents: int = Field(..., description="Number of active agents")
    current_workload: int = Field(..., description="Current workload")
    max_capacity: int = Field(..., description="Maximum capacity")

class OrchestratorStatus(BaseModel):
    """Orchestrator status model"""
    status: str = Field(..., description="Service status")
    active_teams: int = Field(..., description="Number of active teams")
    total_agents: int = Field(..., description="Total number of agents")
    active_tasks: int = Field(..., description="Number of active tasks")
    queue_length: int = Field(..., description="Task queue length")
    uptime: float = Field(..., description="Service uptime in seconds")

# Initialize teams
def initialize_teams():
    """Initialize the multi-agent teams"""
    global active_teams
    
    # Research Team
    research_agents = [
        Agent("res_lead", "Research Lead", "Lead", ["research", "analysis", "validation"]),
        Agent("res_analyst", "Research Analyst", "Analyst", ["data_analysis", "pattern_recognition"]),
        Agent("res_validator", "Research Validator", "Validator", ["validation", "quality_assurance"])
    ]
    
    # Design Team
    design_agents = [
        Agent("des_lead", "Design Lead", "Lead", ["design", "ux", "creative_direction"]),
        Agent("des_ui", "UI/UX Designer", "UI/UX", ["ui_design", "ux_research", "prototyping"]),
        Agent("des_graphics", "Graphics Designer", "Graphics", ["graphic_design", "visual_identity"])
    ]
    
    # Development Team
    dev_agents = [
        Agent("dev_lead", "Development Lead", "Lead", ["development", "architecture", "code_review"]),
        Agent("dev_frontend", "Frontend Developer", "Frontend", ["react", "typescript", "ui_development"]),
        Agent("dev_backend", "Backend Developer", "Backend", ["python", "fastapi", "database"]),
        Agent("dev_devops", "DevOps Engineer", "DevOps", ["docker", "kubernetes", "ci_cd"]),
        Agent("dev_qa", "QA Engineer", "QA", ["testing", "quality_assurance", "automation"])
    ]
    
    # Audit Team
    audit_agents = [
        Agent("audit_lead", "Audit Lead", "Lead", ["audit", "compliance", "security"]),
        Agent("audit_monitor", "Audit Monitor", "Monitor", ["monitoring", "logging", "alerting"])
    ]
    
    # Orchestration Team
    orch_agents = [
        Agent("orch_coord", "Orchestration Coordinator", "Coordinator", ["coordination", "task_distribution"]),
        Agent("orch_balancer", "Load Balancer", "Load Balancer", ["load_balancing", "resource_management"])
    ]
    
    active_teams = {
        "research": Team("research", "Research Team", TeamType.RESEARCH, research_agents),
        "design": Team("design", "Design Team", TeamType.DESIGN, design_agents),
        "development": Team("development", "Development Team", TeamType.DEVELOPMENT, dev_agents),
        "audit": Team("audit", "Audit Team", TeamType.AUDIT, audit_agents),
        "orchestration": Team("orchestration", "Orchestration Team", TeamType.ORCHESTRATION, orch_agents)
    }
    
    # Initialize workload gauges
    for team_id in active_teams:
        TEAM_WORKLOAD.labels(team=team_id).set(0)

# Startup and shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    global redis_client
    
    # Startup
    logger.info("Starting Multi-Agent Orchestration Service...")
    
    # Initialize teams
    initialize_teams()
    
    # Initialize Redis connection
    try:
        redis_client = redis.Redis(
            host=os.getenv("REDIS_HOST", "redis"),
            port=int(os.getenv("REDIS_PORT", "6379")),
            password=os.getenv("REDIS_PASSWORD", ""),
            decode_responses=True
        )
        await redis_client.ping()
        logger.info("Redis connection established")
    except Exception as e:
        logger.warning(f"Redis connection failed: {e}")
        redis_client = None
    
    # Start background tasks
    asyncio.create_task(load_balancer())
    asyncio.create_task(health_monitor())
    
    yield
    
    # Shutdown
    logger.info("Shutting down Multi-Agent Orchestration Service...")
    
    # Close Redis connection
    if redis_client:
        await redis_client.close()

# Create FastAPI app
app = FastAPI(
    title="Multi-Agent Orchestration Service",
    description="Coordinates specialized agent teams and task distribution",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def select_optimal_team(task: TaskRequest) -> str:
    """Select the optimal team for a task"""
    team_mapping = {
        TaskType.RESEARCH: "research",
        TaskType.DESIGN: "design",
        TaskType.DEVELOPMENT: "development",
        TaskType.AUDIT: "audit",
        TaskType.ORCHESTRATION: "orchestration"
    }
    
    primary_team = team_mapping.get(task.task_type)
    if not primary_team:
        raise ValueError(f"No team mapping for task type: {task.task_type}")
    
    # Check if primary team has capacity
    team = active_teams[primary_team]
    if team.current_tasks < team.max_concurrent_tasks:
        return primary_team
    
    # Find alternative team with lowest workload
    min_workload = float('inf')
    selected_team = primary_team
    
    for team_id, team_data in active_teams.items():
        if team_data.current_tasks < team_data.max_concurrent_tasks:
            workload = team_data.current_tasks / team_data.max_concurrent_tasks
            if workload < min_workload:
                min_workload = workload
                selected_team = team_id
    
    return selected_team

async def assign_task_to_agents(team_id: str, task: TaskRequest) -> List[str]:
    """Assign task to available agents in the team"""
    team = active_teams[team_id]
    assigned_agents = []
    
    # Find available agents
    for agent in team.agents:
        if agent.status == "idle" and agent.workload < 3:  # Max 3 concurrent tasks per agent
            agent.status = "busy"
            agent.current_task = task.task_id
            agent.workload += 1
            assigned_agents.append(agent.id)
            
            # Only assign to one agent for now (can be expanded for collaborative tasks)
            break
    
    return assigned_agents

async def load_balancer():
    """Background task for load balancing"""
    while True:
        try:
            # Redistribute tasks if needed
            for team_id, team in active_teams.items():
                if team.current_tasks > team.max_concurrent_tasks * 0.8:  # 80% capacity threshold
                    logger.warning(f"Team {team_id} approaching capacity: {team.current_tasks}/{team.max_concurrent_tasks}")
                    
                    # Could implement task redistribution here
                    
                # Update Prometheus metrics
                TEAM_WORKLOAD.labels(team=team_id).set(team.current_tasks)
            
            await asyncio.sleep(30)  # Check every 30 seconds
            
        except Exception as e:
            logger.error(f"Load balancer error: {e}")
            await asyncio.sleep(60)

async def health_monitor():
    """Background task for health monitoring"""
    while True:
        try:
            # Check team health
            for team_id, team in active_teams.items():
                # Check if agents are responsive
                for agent in team.agents:
                    if agent.status == "busy" and agent.current_task:
                        # Could implement agent health checks here
                        pass
            
            await asyncio.sleep(60)  # Check every minute
            
        except Exception as e:
            logger.error(f"Health monitor error: {e}")
            await asyncio.sleep(120)

@app.get("/health", response_model=OrchestratorStatus)
async def health_check():
    """Health check endpoint"""
    total_agents = sum(len(team.agents) for team in active_teams.values())
    active_tasks = sum(team.current_tasks for team in active_teams.values())
    
    return OrchestratorStatus(
        status="healthy",
        active_teams=len(active_teams),
        total_agents=total_agents,
        active_tasks=active_tasks,
        queue_length=len(task_queue),
        uptime=time.time() - app.state.start_time if hasattr(app.state, 'start_time') else 0
    )

@app.post("/task/assign", response_model=TaskResponse)
async def assign_task(task: TaskRequest):
    """Assign a task to the optimal team"""
    try:
        start_time = time.time()
        
        # Select optimal team
        team_id = await select_optimal_team(task)
        team = active_teams[team_id]
        
        # Assign to agents
        assigned_agents = await assign_task_to_agents(team_id, task)
        
        if not assigned_agents:
            raise HTTPException(status_code=503, detail="No available agents in team")
        
        # Update team workload
        team.current_tasks += 1
        
        # Calculate estimated completion
        estimated_completion = datetime.now() + timedelta(seconds=task.estimated_duration)
        
        # Update metrics
        TASK_COUNTER.labels(team=team_id, status="assigned").inc()
        
        # Store task in Redis if available
        if redis_client:
            task_data = {
                "task_id": task.task_id,
                "team_id": team_id,
                "assigned_agents": assigned_agents,
                "status": "assigned",
                "assigned_at": datetime.now().isoformat(),
                "estimated_completion": estimated_completion.isoformat()
            }
            await redis_client.hset(f"task:{task.task_id}", mapping=task_data)
        
        logger.info(f"Task {task.task_id} assigned to team {team_id}")
        
        return TaskResponse(
            task_id=task.task_id,
            assigned_team=team_id,
            assigned_agents=assigned_agents,
            estimated_completion=estimated_completion,
            status="assigned"
        )
    
    except Exception as e:
        logger.error(f"Task assignment error: {e}")
        TASK_COUNTER.labels(team="unknown", status="failed").inc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/teams", response_model=List[TeamStatus])
async def get_teams_status():
    """Get status of all teams"""
    teams_status = []
    
    for team_id, team in active_teams.items():
        active_agents = sum(1 for agent in team.agents if agent.status == "busy")
        
        teams_status.append(TeamStatus(
            team_id=team_id,
            team_name=team.name,
            team_type=team.type.value,
            status=team.status,
            active_agents=active_agents,
            current_workload=team.current_tasks,
            max_capacity=team.max_concurrent_tasks
        ))
    
    return teams_status

@app.get("/team/{team_id}", response_model=TeamStatus)
async def get_team_status(team_id: str):
    """Get status of a specific team"""
    if team_id not in active_teams:
        raise HTTPException(status_code=404, detail="Team not found")
    
    team = active_teams[team_id]
    active_agents = sum(1 for agent in team.agents if agent.status == "busy")
    
    return TeamStatus(
        team_id=team_id,
        team_name=team.name,
        team_type=team.type.value,
        status=team.status,
        active_agents=active_agents,
        current_workload=team.current_tasks,
        max_capacity=team.max_concurrent_tasks
    )

@app.post("/task/{task_id}/complete")
async def complete_task(task_id: str, background_tasks: BackgroundTasks):
    """Mark a task as completed"""
    try:
        # Find task in Redis
        if redis_client:
            task_data = await redis_client.hgetall(f"task:{task_id}")
            if not task_data:
                raise HTTPException(status_code=404, detail="Task not found")
            
            team_id = task_data.get("team_id")
            assigned_agents = json.loads(task_data.get("assigned_agents", "[]"))
            
            # Update team workload
            if team_id in active_teams:
                team = active_teams[team_id]
                team.current_tasks = max(0, team.current_tasks - 1)
                
                # Free up agents
                for agent_id in assigned_agents:
                    for agent in team.agents:
                        if agent.id == agent_id:
                            agent.status = "idle"
                            agent.current_task = None
                            agent.workload = max(0, agent.workload - 1)
                            break
            
            # Update task status
            await redis_client.hset(f"task:{task_id}", "status", "completed")
            await redis_client.hset(f"task:{task_id}", "completed_at", datetime.now().isoformat())
            
            # Update metrics
            TASK_COUNTER.labels(team=team_id, status="completed").inc()
            
            logger.info(f"Task {task_id} completed")
            
            return {"success": True, "message": f"Task {task_id} completed"}
        
        raise HTTPException(status_code=500, detail="Redis not available")
    
    except Exception as e:
        logger.error(f"Task completion error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/metrics")
async def get_metrics():
    """Get Prometheus metrics"""
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

@app.get("/tasks/queue")
async def get_task_queue():
    """Get current task queue"""
    return {
        "queue_length": len(task_queue),
        "tasks": task_queue
    }

if __name__ == "__main__":
    # Set start time for uptime calculation
    app.state.start_time = time.time()
    
    # Run the application
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=30007,
        reload=False,
        log_level="info"
    ) 