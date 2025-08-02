from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
import json
import os
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import uuid
import asyncio
from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic models
class AgentRegistration(BaseModel):
    agent_id: str
    name: str
    capabilities: List[str]
    endpoint: str
    protocol_version: str = "1.0"
    metadata: Dict[str, Any] = {}

class AgentStatus(BaseModel):
    agent_id: str
    status: str
    last_seen: datetime
    health_score: float = 1.0

# Global registry state
class A2ARegistry:
    def __init__(self):
        self.agents: Dict[str, Dict[str, Any]] = {}
        self.health_checks: Dict[str, datetime] = {}
        self.node_id = os.getenv("A2A_NODE_ID", f"a2a-registry-{uuid.uuid4().hex[:8]}")

    def register_agent(self, agent_data: AgentRegistration) -> Dict[str, Any]:
        """Register a new agent"""
        agent_info = {
            "agent_id": agent_data.agent_id,
            "name": agent_data.name,
            "capabilities": agent_data.capabilities,
            "endpoint": agent_data.endpoint,
            "protocol_version": agent_data.protocol_version,
            "metadata": agent_data.metadata,
            "registered_at": datetime.utcnow().isoformat(),
            "last_seen": datetime.utcnow().isoformat(),
            "status": "registered"
        }
        
        self.agents[agent_data.agent_id] = agent_info
        logger.info(f"Agent {agent_data.agent_id} registered")
        
        return agent_info

    def update_agent_status(self, agent_id: str, status: str):
        """Update agent status"""
        if agent_id in self.agents:
            self.agents[agent_id]["status"] = status
            self.agents[agent_id]["last_seen"] = datetime.utcnow().isoformat()
            self.health_checks[agent_id] = datetime.utcnow()

    def get_agent(self, agent_id: str) -> Optional[Dict[str, Any]]:
        """Get agent information"""
        return self.agents.get(agent_id)

    def list_agents(self, status_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        """List all agents with optional status filter"""
        agents = list(self.agents.values())
        if status_filter:
            agents = [agent for agent in agents if agent["status"] == status_filter]
        return agents

    def find_agents_by_capability(self, capability: str) -> List[Dict[str, Any]]:
        """Find agents with specific capability"""
        return [
            agent for agent in self.agents.values()
            if capability in agent.get("capabilities", [])
        ]

    def remove_agent(self, agent_id: str) -> bool:
        """Remove agent from registry"""
        if agent_id in self.agents:
            del self.agents[agent_id]
            if agent_id in self.health_checks:
                del self.health_checks[agent_id]
            logger.info(f"Agent {agent_id} removed from registry")
            return True
        return False

    def cleanup_inactive_agents(self, max_age_minutes: int = 30):
        """Remove agents that haven't been seen recently"""
        cutoff_time = datetime.utcnow() - timedelta(minutes=max_age_minutes)
        inactive_agents = []
        
        for agent_id, agent in self.agents.items():
            last_seen = datetime.fromisoformat(agent["last_seen"])
            if last_seen < cutoff_time:
                inactive_agents.append(agent_id)
        
        for agent_id in inactive_agents:
            self.remove_agent(agent_id)
        
        if inactive_agents:
            logger.info(f"Removed {len(inactive_agents)} inactive agents")

# Initialize registry
registry = A2ARegistry()

# FastAPI app
app = FastAPI(
    title="A2A Agent Registry",
    description="Central registry for A2A protocol agents",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for Docker healthcheck"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "a2a-registry",
        "node_id": registry.node_id,
        "version": "1.0.0",
        "registered_agents": len(registry.agents)
    }

# Registry API endpoints
@app.post("/api/agents/register", response_model=Dict[str, Any])
async def register_agent(agent_data: AgentRegistration):
    """Register a new agent"""
    try:
        agent_info = registry.register_agent(agent_data)
        return {
            "success": True,
            "agent_id": agent_data.agent_id,
            "message": f"Agent {agent_data.agent_id} successfully registered",
            "agent_info": agent_info
        }
    except Exception as e:
        logger.error(f"Error registering agent: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/agents", response_model=Dict[str, Any])
async def list_agents(status: Optional[str] = None):
    """List all registered agents"""
    agents = registry.list_agents(status)
    return {
        "agents": agents,
        "total": len(agents),
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/agents/{agent_id}", response_model=Dict[str, Any])
async def get_agent(agent_id: str):
    """Get specific agent information"""
    agent = registry.get_agent(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail=f"Agent {agent_id} not found")
    
    return {
        "agent": agent,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.put("/api/agents/{agent_id}/status")
async def update_agent_status(agent_id: str, status_data: Dict[str, str]):
    """Update agent status"""
    status = status_data.get("status")
    if not status:
        raise HTTPException(status_code=400, detail="Status is required")
    
    registry.update_agent_status(agent_id, status)
    return {
        "success": True,
        "agent_id": agent_id,
        "status": status,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/agents/search/capability/{capability}")
async def find_agents_by_capability(capability: str):
    """Find agents with specific capability"""
    agents = registry.find_agents_by_capability(capability)
    return {
        "capability": capability,
        "agents": agents,
        "total": len(agents),
        "timestamp": datetime.utcnow().isoformat()
    }

@app.delete("/api/agents/{agent_id}")
async def remove_agent(agent_id: str):
    """Remove agent from registry"""
    success = registry.remove_agent(agent_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Agent {agent_id} not found")
    
    return {
        "success": True,
        "agent_id": agent_id,
        "message": f"Agent {agent_id} removed from registry"
    }

@app.post("/api/registry/cleanup")
async def cleanup_inactive_agents(max_age_minutes: int = 30):
    """Clean up inactive agents"""
    registry.cleanup_inactive_agents(max_age_minutes)
    return {
        "success": True,
        "message": f"Cleanup completed with {max_age_minutes} minute threshold",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/registry/status")
async def get_registry_status():
    """Get registry status and statistics"""
    # Calculate health statistics
    healthy_agents = len([a for a in registry.agents.values() if a["status"] == "active"])
    total_agents = len(registry.agents)
    
    return {
        "node_id": registry.node_id,
        "status": "running",
        "total_agents": total_agents,
        "healthy_agents": healthy_agents,
        "health_percentage": (healthy_agents / total_agents * 100) if total_agents > 0 else 0,
        "last_cleanup": "N/A",  # TODO: Track cleanup timestamps
        "timestamp": datetime.utcnow().isoformat()
    }

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "timestamp": datetime.utcnow().isoformat()}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "timestamp": datetime.utcnow().isoformat()}
    )

# Background task for periodic cleanup
async def periodic_cleanup():
    """Periodically clean up inactive agents"""
    while True:
        try:
            registry.cleanup_inactive_agents()
            await asyncio.sleep(300)  # Run every 5 minutes
        except Exception as e:
            logger.error(f"Error in periodic cleanup: {e}")
            await asyncio.sleep(60)

@app.on_event("startup")
async def startup_event():
    """Start background tasks on startup"""
    asyncio.create_task(periodic_cleanup())
    logger.info("A2A Registry started with periodic cleanup")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=5003,
        reload=True,
        log_level="info"
    ) 