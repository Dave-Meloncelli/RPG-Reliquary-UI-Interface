from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import asyncio
import logging
import json
import os
from datetime import datetime
from typing import Dict, Any, List, Set
import uuid
from contextlib import asynccontextmanager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global state
class A2AGateway:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self.registered_agents: Dict[str, Dict[str, Any]] = {}
        self.message_queue: List[Dict[str, Any]] = []
        self.node_id = os.getenv("A2A_NODE_ID", f"a2a-gateway-{uuid.uuid4().hex[:8]}")

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)
        logger.info(f"New A2A connection established. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        logger.info(f"A2A connection closed. Total connections: {len(self.active_connections)}")

    async def broadcast(self, message: Dict[str, Any]):
        """Broadcast message to all connected agents"""
        if self.active_connections:
            await asyncio.gather(
                *[connection.send_text(json.dumps(message)) for connection in self.active_connections]
            )

    async def send_personal_message(self, message: Dict[str, Any], websocket: WebSocket):
        """Send message to specific agent"""
        await websocket.send_text(json.dumps(message))

    def register_agent(self, agent_id: str, agent_info: Dict[str, Any]):
        """Register a new agent"""
        self.registered_agents[agent_id] = {
            **agent_info,
            "registered_at": datetime.utcnow().isoformat(),
            "last_seen": datetime.utcnow().isoformat()
        }
        logger.info(f"Agent {agent_id} registered")

    def update_agent_status(self, agent_id: str, status: str):
        """Update agent status"""
        if agent_id in self.registered_agents:
            self.registered_agents[agent_id]["status"] = status
            self.registered_agents[agent_id]["last_seen"] = datetime.utcnow().isoformat()

# Initialize gateway
gateway = A2AGateway()

# FastAPI app
app = FastAPI(
    title="A2A Protocol Gateway",
    description="Agent-to-Agent communication gateway",
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
        "service": "a2a-gateway",
        "node_id": gateway.node_id,
        "version": "1.0.0",
        "connections": len(gateway.active_connections),
        "registered_agents": len(gateway.registered_agents)
    }

# A2A API endpoints
@app.get("/api/agents")
async def list_agents():
    """List all registered agents"""
    return {
        "agents": list(gateway.registered_agents.values()),
        "total": len(gateway.registered_agents)
    }

@app.post("/api/agents/register")
async def register_agent(agent_data: Dict[str, Any]):
    """Register a new agent"""
    agent_id = agent_data.get("agent_id", str(uuid.uuid4()))
    gateway.register_agent(agent_id, agent_data)
    return {
        "agent_id": agent_id,
        "status": "registered",
        "message": f"Agent {agent_id} successfully registered"
    }

@app.post("/api/messages/broadcast")
async def broadcast_message(message_data: Dict[str, Any]):
    """Broadcast message to all connected agents"""
    message = {
        "id": str(uuid.uuid4()),
        "type": "broadcast",
        "timestamp": datetime.utcnow().isoformat(),
        "sender": message_data.get("sender", "gateway"),
        "content": message_data.get("content", ""),
        "metadata": message_data.get("metadata", {})
    }
    
    await gateway.broadcast(message)
    gateway.message_queue.append(message)
    
    return {
        "message_id": message["id"],
        "status": "broadcasted",
        "recipients": len(gateway.active_connections)
    }

@app.get("/api/messages")
async def get_messages(limit: int = 100):
    """Get recent messages"""
    return {
        "messages": gateway.message_queue[-limit:],
        "total": len(gateway.message_queue)
    }

@app.get("/api/status")
async def get_gateway_status():
    """Get gateway status and statistics"""
    return {
        "node_id": gateway.node_id,
        "status": "running",
        "uptime": "00:00:00",  # TODO: Calculate actual uptime
        "connections": len(gateway.active_connections),
        "registered_agents": len(gateway.registered_agents),
        "message_queue_size": len(gateway.message_queue),
        "timestamp": datetime.utcnow().isoformat()
    }

# WebSocket endpoint for agent connections
@app.websocket("/ws/{agent_id}")
async def websocket_endpoint(websocket: WebSocket, agent_id: str):
    await gateway.connect(websocket)
    
    # Register agent if not already registered
    if agent_id not in gateway.registered_agents:
        gateway.register_agent(agent_id, {
            "agent_id": agent_id,
            "status": "connected",
            "capabilities": [],
            "protocol_version": "1.0"
        })
    
    try:
        while True:
            # Receive message from agent
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Update agent status
            gateway.update_agent_status(agent_id, "active")
            
            # Process message based on type
            message_type = message.get("type", "unknown")
            
            if message_type == "ping":
                # Respond to ping
                await gateway.send_personal_message({
                    "type": "pong",
                    "timestamp": datetime.utcnow().isoformat(),
                    "node_id": gateway.node_id
                }, websocket)
            
            elif message_type == "broadcast":
                # Broadcast message to all other agents
                broadcast_msg = {
                    "id": str(uuid.uuid4()),
                    "type": "broadcast",
                    "timestamp": datetime.utcnow().isoformat(),
                    "sender": agent_id,
                    "content": message.get("content", ""),
                    "metadata": message.get("metadata", {})
                }
                
                # Send to all connections except sender
                for connection in gateway.active_connections:
                    if connection != websocket:
                        await connection.send_text(json.dumps(broadcast_msg))
                
                # Add to message queue
                gateway.message_queue.append(broadcast_msg)
            
            elif message_type == "direct":
                # Send direct message to specific agent
                target_agent = message.get("target")
                if target_agent and target_agent in gateway.registered_agents:
                    # TODO: Implement direct messaging between agents
                    pass
            
            elif message_type == "register":
                # Update agent registration
                gateway.register_agent(agent_id, message.get("agent_info", {}))
                await gateway.send_personal_message({
                    "type": "registered",
                    "agent_id": agent_id,
                    "timestamp": datetime.utcnow().isoformat()
                }, websocket)
            
            # Log message
            logger.info(f"Message from {agent_id}: {message_type}")
            
    except WebSocketDisconnect:
        gateway.disconnect(websocket)
        gateway.update_agent_status(agent_id, "disconnected")
        logger.info(f"Agent {agent_id} disconnected")
    except Exception as e:
        logger.error(f"Error handling message from {agent_id}: {e}")
        gateway.disconnect(websocket)

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

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=5001,
        reload=True,
        log_level="info"
    ) 