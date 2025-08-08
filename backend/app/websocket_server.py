
import asyncio
import json
import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WebSocketManager:
    """Manages WebSocket connections"""
    
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.connection_groups: Dict[str, List[str]] = {}
    
    async def connect(self, websocket: WebSocket, client_id: str):
        """Accept WebSocket connection"""
        await websocket.accept()
        self.active_connections[client_id] = websocket
        logger.info(f"Client {client_id} connected")
        
        # Send welcome message
        await self.send_personal_message(
            {"type": "connection", "status": "connected", "client_id": client_id},
            client_id
        )
    
    def disconnect(self, client_id: str):
        """Remove WebSocket connection"""
        if client_id in self.active_connections:
            del self.active_connections[client_id]
            logger.info(f"Client {client_id} disconnected")
    
    async def send_personal_message(self, message: dict, client_id: str):
        """Send message to specific client"""
        if client_id in self.active_connections:
            try:
                await self.active_connections[client_id].send_text(json.dumps(message))
            except Exception as e:
                logger.error(f"Error sending message to {client_id}: {e}")
                self.disconnect(client_id)
    
    async def broadcast(self, message: dict, exclude_client: str = None):
        """Broadcast message to all connected clients"""
        disconnected_clients = []
        
        for client_id, connection in self.active_connections.items():
            if client_id != exclude_client:
                try:
                    await connection.send_text(json.dumps(message))
                except Exception as e:
                    logger.error(f"Error broadcasting to {client_id}: {e}")
                    disconnected_clients.append(client_id)
        
        # Clean up disconnected clients
        for client_id in disconnected_clients:
            self.disconnect(client_id)

# Create WebSocket manager instance
websocket_manager = WebSocketManager()

# WebSocket endpoints
@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """WebSocket endpoint for real-time communication"""
    await websocket_manager.connect(websocket, client_id)
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message = json.loads(data)
            
            logger.info(f"Received from {client_id}: {message}")
            
            # Handle different message types
            if message.get("type") == "chat":
                # Broadcast chat message to all clients
                await websocket_manager.broadcast({
                    "type": "chat",
                    "client_id": client_id,
                    "message": message.get("message", ""),
                    "timestamp": datetime.now().isoformat()
                }, exclude_client=client_id)
                
                # Send confirmation to sender
                await websocket_manager.send_personal_message({
                    "type": "chat_sent",
                    "status": "success",
                    "timestamp": datetime.now().isoformat()
                }, client_id)
            
            elif message.get("type") == "system":
                # Handle system messages
                await websocket_manager.send_personal_message({
                    "type": "system_response",
                    "message": f"System received: {message.get('message', '')}",
                    "timestamp": datetime.now().isoformat()
                }, client_id)
            
            else:
                # Echo back unknown message types
                await websocket_manager.send_personal_message({
                    "type": "echo",
                    "original_message": message,
                    "timestamp": datetime.now().isoformat()
                }, client_id)
                
    except WebSocketDisconnect:
        websocket_manager.disconnect(client_id)
        # Notify other clients about disconnection
        await websocket_manager.broadcast({
            "type": "client_disconnected",
            "client_id": client_id,
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"WebSocket error for {client_id}: {e}")
        websocket_manager.disconnect(client_id)

# Health check endpoint for WebSocket
@app.get("/ws/health")
async def websocket_health():
    """Health check for WebSocket server"""
    return {
        "status": "healthy",
        "active_connections": len(websocket_manager.active_connections),
        "timestamp": datetime.now().isoformat()
    }

# WebSocket connection status
@app.get("/ws/status")
async def websocket_status():
    """Get WebSocket connection status"""
    return {
        "active_connections": list(websocket_manager.active_connections.keys()),
        "total_connections": len(websocket_manager.active_connections),
        "timestamp": datetime.now().isoformat()
    }
