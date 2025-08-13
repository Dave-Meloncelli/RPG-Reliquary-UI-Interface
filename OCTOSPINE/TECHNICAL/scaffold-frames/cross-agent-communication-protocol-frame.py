#!/usr/bin/env python3
"""
Cross-Agent Communication Protocol Frame

Addresses critical infrastructure gap: No standardized messaging between different AI systems
Implements a unified communication protocol for all integrated systems and personas
"""

import json
import time
import asyncio
import threading
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional, Callable
from dataclasses import dataclass, asdict
from enum import Enum
import uuid
import queue
import logging

class MessageType(Enum):
    """Types of messages in the communication protocol"""
    COMMAND = "command"
    RESPONSE = "response"
    STATUS_UPDATE = "status_update"
    DATA_REQUEST = "data_request"
    DATA_RESPONSE = "data_response"
    ALERT = "alert"
    HEARTBEAT = "heartbeat"
    COORDINATION = "coordination"
    EMERGENCY = "emergency"

class MessagePriority(Enum):
    """Message priority levels"""
    LOW = 1
    NORMAL = 2
    HIGH = 3
    CRITICAL = 4
    EMERGENCY = 5

@dataclass
class Message:
    """Standardized message format for cross-agent communication"""
    message_id: str
    sender_id: str
    recipient_id: str
    message_type: MessageType
    priority: MessagePriority
    timestamp: str
    payload: Dict[str, Any]
    metadata: Dict[str, Any]
    correlation_id: Optional[str] = None
    expires_at: Optional[str] = None

@dataclass
class AgentInfo:
    """Information about a registered agent"""
    agent_id: str
    agent_name: str
    agent_type: str  # crewai, n8n, agent_zero, playwright, framework
    capabilities: List[str]
    status: str  # online, offline, busy, error
    last_heartbeat: str
    message_queue_size: int

class CrossAgentCommunicationProtocol:
    """Unified communication protocol for all AI systems"""
    
    def __init__(self, config_path: str = "config/communication.json"):
        self.config_path = Path(config_path)
        self.agents: Dict[str, AgentInfo] = {}
        self.message_queues: Dict[str, queue.PriorityQueue] = {}
        self.message_handlers: Dict[str, Callable] = {}
        self.communication_active = False
        self.communication_thread = None
        self.message_history: List[Message] = []
        
        # Load configuration
        self.config = self._load_config()
        
        # Initialize communication paths
        self.reports_dir = Path("reports")
        self.reports_dir.mkdir(exist_ok=True)
        
        # Setup logging
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger("CrossAgentCommunication")
        
    def _load_config(self) -> Dict[str, Any]:
        """Load communication configuration"""
        if self.config_path.exists():
            with open(self.config_path, 'r') as f:
                return json.load(f)
        else:
            # Default configuration
            config = {
                "heartbeat_interval": 30,  # seconds
                "message_timeout": 300,  # seconds
                "max_queue_size": 1000,
                "retry_attempts": 3,
                "protocol_version": "1.0",
                "encryption_enabled": False,
                "compression_enabled": True,
                "message_retention_hours": 24
            }
            # Save default config
            self.config_path.parent.mkdir(exist_ok=True)
            with open(self.config_path, 'w') as f:
                json.dump(config, f, indent=2)
            return config
    
    def start_communication(self) -> Dict[str, Any]:
        """Start the communication protocol"""
        if self.communication_active:
            return {"success": False, "error": "Communication already active"}
        
        self.communication_active = True
        self.communication_thread = threading.Thread(target=self._communication_loop)
        self.communication_thread.daemon = True
        self.communication_thread.start()
        
        return {"success": True, "message": "Cross-agent communication started"}
    
    def stop_communication(self) -> Dict[str, Any]:
        """Stop the communication protocol"""
        self.communication_active = False
        if self.communication_thread:
            self.communication_thread.join(timeout=5)
        
        return {"success": True, "message": "Cross-agent communication stopped"}
    
    def register_agent(self, agent_id: str, agent_name: str, agent_type: str, 
                      capabilities: List[str]) -> Dict[str, Any]:
        """Register a new agent in the communication system"""
        if agent_id in self.agents:
            return {"success": False, "error": f"Agent {agent_id} already registered"}
        
        # Create agent info
        agent_info = AgentInfo(
            agent_id=agent_id,
            agent_name=agent_name,
            agent_type=agent_type,
            capabilities=capabilities,
            status="online",
            last_heartbeat=datetime.now().isoformat(),
            message_queue_size=0
        )
        
        # Register agent
        self.agents[agent_id] = agent_info
        self.message_queues[agent_id] = queue.PriorityQueue(maxsize=self.config["max_queue_size"])
        
        self.logger.info(f"Agent registered: {agent_id} ({agent_name})")
        
        return {"success": True, "agent_id": agent_id, "message": "Agent registered successfully"}
    
    def unregister_agent(self, agent_id: str) -> Dict[str, Any]:
        """Unregister an agent from the communication system"""
        if agent_id not in self.agents:
            return {"success": False, "error": f"Agent {agent_id} not found"}
        
        # Remove agent
        del self.agents[agent_id]
        del self.message_queues[agent_id]
        
        self.logger.info(f"Agent unregistered: {agent_id}")
        
        return {"success": True, "message": "Agent unregistered successfully"}
    
    def send_message(self, sender_id: str, recipient_id: str, message_type: MessageType,
                    payload: Dict[str, Any], priority: MessagePriority = MessagePriority.NORMAL,
                    correlation_id: Optional[str] = None) -> Dict[str, Any]:
        """Send a message to another agent"""
        # Validate sender
        if sender_id not in self.agents:
            return {"success": False, "error": f"Sender {sender_id} not registered"}
        
        # Validate recipient
        if recipient_id not in self.agents:
            return {"success": False, "error": f"Recipient {recipient_id} not registered"}
        
        # Create message
        message = Message(
            message_id=str(uuid.uuid4()),
            sender_id=sender_id,
            recipient_id=recipient_id,
            message_type=message_type,
            priority=priority,
            timestamp=datetime.now().isoformat(),
            payload=payload,
            metadata={
                "protocol_version": self.config["protocol_version"],
                "compression_enabled": self.config["compression_enabled"]
            },
            correlation_id=correlation_id,
            expires_at=datetime.fromtimestamp(datetime.now().timestamp() + self.config["message_timeout"]).isoformat()
        )
        
        # Add to recipient's queue
        try:
            self.message_queues[recipient_id].put((priority.value, message), timeout=1)
            self.agents[recipient_id].message_queue_size = self.message_queues[recipient_id].qsize()
        except queue.Full:
            return {"success": False, "error": f"Recipient {recipient_id} queue is full"}
        
        # Add to message history
        self.message_history.append(message)
        
        self.logger.info(f"Message sent: {sender_id} -> {recipient_id} ({message_type.value})")
        
        return {"success": True, "message_id": message.message_id}
    
    def receive_message(self, agent_id: str, timeout: float = 1.0) -> Optional[Message]:
        """Receive a message for an agent"""
        if agent_id not in self.message_queues:
            return None
        
        try:
            priority, message = self.message_queues[agent_id].get(timeout=timeout)
            self.agents[agent_id].message_queue_size = self.message_queues[agent_id].qsize()
            return message
        except queue.Empty:
            return None
    
    def broadcast_message(self, sender_id: str, message_type: MessageType,
                         payload: Dict[str, Any], priority: MessagePriority = MessagePriority.NORMAL,
                         exclude_sender: bool = True) -> Dict[str, Any]:
        """Broadcast a message to all registered agents"""
        results = []
        
        for recipient_id in self.agents.keys():
            if exclude_sender and recipient_id == sender_id:
                continue
            
            result = self.send_message(sender_id, recipient_id, message_type, payload, priority)
            results.append({"recipient": recipient_id, "result": result})
        
        return {
            "success": True,
            "broadcast_results": results,
            "total_recipients": len(results)
        }
    
    def register_message_handler(self, agent_id: str, handler: Callable[[Message], None]) -> Dict[str, Any]:
        """Register a message handler for an agent"""
        if agent_id not in self.agents:
            return {"success": False, "error": f"Agent {agent_id} not registered"}
        
        self.message_handlers[agent_id] = handler
        
        return {"success": True, "message": "Message handler registered"}
    
    def _communication_loop(self):
        """Main communication loop"""
        while self.communication_active:
            try:
                # Process message handlers
                self._process_message_handlers()
                
                # Send heartbeats
                self._send_heartbeats()
                
                # Clean up expired messages
                self._cleanup_expired_messages()
                
                # Update agent statuses
                self._update_agent_statuses()
                
                # Save communication state
                self._save_communication_state()
                
                # Wait for next interval
                time.sleep(1)
                
            except Exception as e:
                self.logger.error(f"Communication error: {e}")
                time.sleep(1)
    
    def _process_message_handlers(self):
        """Process registered message handlers"""
        for agent_id, handler in self.message_handlers.items():
            if agent_id not in self.message_queues:
                continue
            
            # Process all available messages
            while True:
                message = self.receive_message(agent_id, timeout=0.1)
                if message is None:
                    break
                
                try:
                    handler(message)
                except Exception as e:
                    self.logger.error(f"Handler error for {agent_id}: {e}")
    
    def _send_heartbeats(self):
        """Send heartbeat messages to all agents"""
        current_time = datetime.now().timestamp()
        heartbeat_interval = self.config["heartbeat_interval"]
        
        for agent_id in self.agents.keys():
            last_heartbeat = datetime.fromisoformat(self.agents[agent_id].last_heartbeat).timestamp()
            
            if current_time - last_heartbeat >= heartbeat_interval:
                # Send heartbeat
                self.broadcast_message(
                    sender_id=agent_id,
                    message_type=MessageType.HEARTBEAT,
                    payload={"timestamp": datetime.now().isoformat()},
                    priority=MessagePriority.LOW,
                    exclude_sender=False
                )
                
                # Update last heartbeat
                self.agents[agent_id].last_heartbeat = datetime.now().isoformat()
    
    def _cleanup_expired_messages(self):
        """Clean up expired messages from history"""
        current_time = datetime.now().timestamp()
        
        self.message_history = [
            message for message in self.message_history
            if message.expires_at is None or 
            datetime.fromisoformat(message.expires_at).timestamp() > current_time
        ]
    
    def _update_agent_statuses(self):
        """Update agent statuses based on heartbeats"""
        current_time = datetime.now().timestamp()
        heartbeat_timeout = self.config["heartbeat_interval"] * 2
        
        for agent_id, agent_info in self.agents.items():
            last_heartbeat = datetime.fromisoformat(agent_info.last_heartbeat).timestamp()
            
            if current_time - last_heartbeat > heartbeat_timeout:
                agent_info.status = "offline"
            elif agent_info.status == "offline":
                agent_info.status = "online"
    
    def _convert_enum_to_string(self, obj):
        """Convert enum objects to strings for JSON serialization"""
        if isinstance(obj, dict):
            return {k: self._convert_enum_to_string(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [self._convert_enum_to_string(item) for item in obj]
        elif hasattr(obj, 'value'):  # Enum objects
            return obj.value
        else:
            return obj

    def _save_communication_state(self):
        """Save current communication state to file"""
        # Convert enums to strings for JSON serialization
        communication_state = {
            "timestamp": datetime.now().isoformat(),
            "agents": {k: self._convert_enum_to_string(asdict(v)) for k, v in self.agents.items()},
            "message_history": [self._convert_enum_to_string(asdict(msg)) for msg in self.message_history[-100:]],  # Last 100 messages
            "summary": self._generate_summary()
        }
        
        state_file = self.reports_dir / "cross_agent_communication_state.json"
        with open(state_file, 'w') as f:
            json.dump(communication_state, f, indent=2)
    
    def _generate_summary(self) -> Dict[str, Any]:
        """Generate communication summary"""
        total_agents = len(self.agents)
        online_agents = sum(1 for agent in self.agents.values() if agent.status == "online")
        total_messages = len(self.message_history)
        
        # Count messages by type
        message_types = {}
        for message in self.message_history:
            msg_type = message.message_type.value
            message_types[msg_type] = message_types.get(msg_type, 0) + 1
        
        return {
            "total_agents": total_agents,
            "online_agents": online_agents,
            "agent_uptime_percent": (online_agents / total_agents * 100) if total_agents > 0 else 0,
            "total_messages": total_messages,
            "message_types": message_types,
            "protocol_version": self.config["protocol_version"]
        }
    
    def get_communication_data(self) -> Dict[str, Any]:
        """Get current communication data"""
        return {
            "timestamp": datetime.now().isoformat(),
            "summary": self._generate_summary(),
            "agents": {k: self._convert_enum_to_string(asdict(v)) for k, v in self.agents.items()},
            "recent_messages": [self._convert_enum_to_string(asdict(msg)) for msg in self.message_history[-20:]]
        }

def main():
    """Main function for frame execution"""
    print("📡 Starting Cross-Agent Communication Protocol Frame")
    
    # Initialize communication protocol
    protocol = CrossAgentCommunicationProtocol()
    
    # Start communication
    result = protocol.start_communication()
    print(f"📡 Communication Status: {result}")
    
    # Register sample agents
    sample_agents = [
        ("crewai_lane_manager", "CrewAI Lane Manager", "crewai", ["coordination", "resource_management"]),
        ("n8n_workflow_manager", "N8N Workflow Manager", "n8n", ["workflow_automation", "integration"]),
        ("agent_zero_researcher", "Agent Zero Researcher", "agent_zero", ["research", "analysis"]),
        ("playwright_automation_engineer", "Playwright Automation Engineer", "playwright", ["browser_automation", "testing"]),
        ("framework_orchestrator", "Framework Orchestrator", "framework", ["orchestration", "governance"])
    ]
    
    for agent_id, agent_name, agent_type, capabilities in sample_agents:
        result = protocol.register_agent(agent_id, agent_name, agent_type, capabilities)
        print(f"🤖 Agent Registration: {result}")
    
    # Send some test messages
    test_messages = [
        ("crewai_lane_manager", "n8n_workflow_manager", MessageType.COORDINATION, {"task": "start_build_workflow"}),
        ("agent_zero_researcher", "framework_orchestrator", MessageType.STATUS_UPDATE, {"status": "research_completed"}),
        ("playwright_automation_engineer", "crewai_lane_manager", MessageType.DATA_RESPONSE, {"test_results": "all_passed"})
    ]
    
    for sender, recipient, msg_type, payload in test_messages:
        result = protocol.send_message(sender, recipient, msg_type, payload)
        print(f"📨 Message Sent: {result}")
    
    # Let it run for a few seconds
    time.sleep(5)
    
    # Get communication data
    communication_data = protocol.get_communication_data()
    
    # Save comprehensive report
    report_file = Path("reports") / f"cross_agent_communication_protocol_{int(time.time())}.json"
    with open(report_file, 'w') as f:
        json.dump(communication_data, f, indent=2)
    
    # Stop communication
    protocol.stop_communication()
    
    print(f"✅ Cross-Agent Communication Protocol Frame completed")
    print(f"📄 Report saved: {report_file}")
    
    return {
        "success": True,
        "protocol_implemented": True,
        "report_file": str(report_file),
        "summary": communication_data["summary"]
    }

if __name__ == "__main__":
    result = main()
    print(json.dumps(result, indent=2))
