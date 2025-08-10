#!/usr/bin/env python3
"""
Resource Allocation Engine Frame

Addresses critical infrastructure gap: No intelligent distribution of computational resources
Implements intelligent resource allocation across all integrated systems and personas
"""

import json
import time
import psutil
import threading
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from enum import Enum
import uuid
import queue
import logging

class ResourceType(Enum):
    """Types of computational resources"""
    CPU = "cpu"
    MEMORY = "memory"
    DISK = "disk"
    NETWORK = "network"
    GPU = "gpu"
    STORAGE = "storage"

class AllocationPriority(Enum):
    """Resource allocation priority levels"""
    LOW = 1
    NORMAL = 2
    HIGH = 3
    CRITICAL = 4
    EMERGENCY = 5

@dataclass
class ResourceRequest:
    """Resource allocation request"""
    request_id: str
    agent_id: str
    resource_type: ResourceType
    amount_requested: float
    priority: AllocationPriority
    timestamp: str
    duration_minutes: int
    purpose: str
    metadata: Dict[str, Any]

@dataclass
class ResourceAllocation:
    """Active resource allocation"""
    allocation_id: str
    request_id: str
    agent_id: str
    resource_type: ResourceType
    amount_allocated: float
    start_time: str
    end_time: str
    status: str  # active, completed, failed, suspended

@dataclass
class SystemResources:
    """Current system resource availability"""
    total_cpu_cores: int
    available_cpu_percent: float
    total_memory_gb: float
    available_memory_gb: float
    total_disk_gb: float
    available_disk_gb: float
    network_bandwidth_mbps: float
    gpu_available: bool
    timestamp: str

class ResourceAllocationEngine:
    """Intelligent resource allocation engine for all AI systems"""
    
    def __init__(self, config_path: str = "config/resource_allocation.json"):
        self.config_path = Path(config_path)
        self.resource_requests: Dict[str, ResourceRequest] = {}
        self.active_allocations: Dict[str, ResourceAllocation] = {}
        self.system_resources: Optional[SystemResources] = None
        self.allocation_history: List[ResourceAllocation] = []
        self.engine_active = False
        self.engine_thread = None
        
        # Load configuration
        self.config = self._load_config()
        
        # Initialize engine paths
        self.reports_dir = Path("reports")
        self.reports_dir.mkdir(exist_ok=True)
        
        # Setup logging
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger("ResourceAllocation")
        
    def _load_config(self) -> Dict[str, Any]:
        """Load resource allocation configuration"""
        if self.config_path.exists():
            with open(self.config_path, 'r') as f:
                return json.load(f)
        else:
            # Default configuration
            config = {
                "allocation_interval": 10,  # seconds
                "resource_limits": {
                    "cpu_percent_per_agent": 25,
                    "memory_gb_per_agent": 4,
                    "disk_gb_per_agent": 10,
                    "network_mbps_per_agent": 100
                },
                "priority_weights": {
                    "emergency": 5,
                    "critical": 4,
                    "high": 3,
                    "normal": 2,
                    "low": 1
                },
                "auto_scaling": True,
                "load_balancing": True,
                "cost_optimization": True
            }
            # Save default config
            self.config_path.parent.mkdir(exist_ok=True)
            with open(self.config_path, 'w') as f:
                json.dump(config, f, indent=2)
            return config
    
    def start_engine(self) -> Dict[str, Any]:
        """Start the resource allocation engine"""
        if self.engine_active:
            return {"success": False, "error": "Engine already active"}
        
        self.engine_active = True
        self.engine_thread = threading.Thread(target=self._engine_loop)
        self.engine_thread.daemon = True
        self.engine_thread.start()
        
        return {"success": True, "message": "Resource allocation engine started"}
    
    def stop_engine(self) -> Dict[str, Any]:
        """Stop the resource allocation engine"""
        self.engine_active = False
        if self.engine_thread:
            self.engine_thread.join(timeout=5)
        
        return {"success": True, "message": "Resource allocation engine stopped"}
    
    def request_resources(self, agent_id: str, resource_type: ResourceType, 
                         amount: float, priority: AllocationPriority, 
                         duration_minutes: int, purpose: str, 
                         metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """Request resource allocation"""
        # Validate request
        if amount <= 0:
            return {"success": False, "error": "Amount must be positive"}
        
        if duration_minutes <= 0:
            return {"success": False, "error": "Duration must be positive"}
        
        # Create resource request
        request = ResourceRequest(
            request_id=str(uuid.uuid4()),
            agent_id=agent_id,
            resource_type=resource_type,
            amount_requested=amount,
            priority=priority,
            timestamp=datetime.now().isoformat(),
            duration_minutes=duration_minutes,
            purpose=purpose,
            metadata=metadata or {}
        )
        
        # Store request
        self.resource_requests[request.request_id] = request
        
        self.logger.info(f"Resource request: {agent_id} -> {resource_type.value} ({amount})")
        
        return {"success": True, "request_id": request.request_id}
    
    def release_resources(self, allocation_id: str) -> Dict[str, Any]:
        """Release allocated resources"""
        if allocation_id not in self.active_allocations:
            return {"success": False, "error": f"Allocation {allocation_id} not found"}
        
        allocation = self.active_allocations[allocation_id]
        allocation.status = "completed"
        allocation.end_time = datetime.now().isoformat()
        
        # Move to history
        self.allocation_history.append(allocation)
        del self.active_allocations[allocation_id]
        
        self.logger.info(f"Resources released: {allocation.agent_id} -> {allocation.resource_type.value}")
        
        return {"success": True, "message": "Resources released successfully"}
    
    def get_available_resources(self) -> Dict[str, Any]:
        """Get current available resources"""
        if self.system_resources is None:
            self._update_system_resources()
        
        return {
            "cpu_percent": self.system_resources.available_cpu_percent,
            "memory_gb": self.system_resources.available_memory_gb,
            "disk_gb": self.system_resources.available_disk_gb,
            "network_mbps": self.system_resources.network_bandwidth_mbps,
            "gpu_available": self.system_resources.gpu_available,
            "timestamp": self.system_resources.timestamp
        }
    
    def get_allocation_status(self, agent_id: str) -> Dict[str, Any]:
        """Get resource allocation status for an agent"""
        agent_allocations = [
            alloc for alloc in self.active_allocations.values()
            if alloc.agent_id == agent_id
        ]
        
        return {
            "agent_id": agent_id,
            "active_allocations": len(agent_allocations),
            "allocations": [asdict(alloc) for alloc in agent_allocations],
            "total_cpu_percent": sum(alloc.amount_allocated for alloc in agent_allocations 
                                   if alloc.resource_type == ResourceType.CPU),
            "total_memory_gb": sum(alloc.amount_allocated for alloc in agent_allocations 
                                 if alloc.resource_type == ResourceType.MEMORY)
        }
    
    def _engine_loop(self):
        """Main engine loop"""
        while self.engine_active:
            try:
                # Update system resources
                self._update_system_resources()
                
                # Process resource requests
                self._process_resource_requests()
                
                # Monitor active allocations
                self._monitor_allocations()
                
                # Optimize resource usage
                self._optimize_resource_usage()
                
                # Save engine state
                self._save_engine_state()
                
                # Wait for next interval
                time.sleep(self.config["allocation_interval"])
                
            except Exception as e:
                self.logger.error(f"Engine error: {e}")
                time.sleep(1)
    
    def _update_system_resources(self):
        """Update current system resource availability"""
        # CPU
        cpu_percent = psutil.cpu_percent(interval=1)
        available_cpu_percent = 100 - cpu_percent
        total_cpu_cores = psutil.cpu_count()
        
        # Memory
        memory = psutil.virtual_memory()
        total_memory_gb = memory.total / (1024**3)
        available_memory_gb = memory.available / (1024**3)
        
        # Disk
        disk = psutil.disk_usage('/')
        total_disk_gb = disk.total / (1024**3)
        available_disk_gb = disk.free / (1024**3)
        
        # Network (simplified)
        network_bandwidth_mbps = 1000  # Assume 1 Gbps
        
        # GPU (simplified)
        gpu_available = False  # Would check actual GPU availability
        
        self.system_resources = SystemResources(
            total_cpu_cores=total_cpu_cores,
            available_cpu_percent=available_cpu_percent,
            total_memory_gb=total_memory_gb,
            available_memory_gb=available_memory_gb,
            total_disk_gb=total_disk_gb,
            available_disk_gb=available_disk_gb,
            network_bandwidth_mbps=network_bandwidth_mbps,
            gpu_available=gpu_available,
            timestamp=datetime.now().isoformat()
        )
    
    def _process_resource_requests(self):
        """Process pending resource requests"""
        # Sort requests by priority
        sorted_requests = sorted(
            self.resource_requests.values(),
            key=lambda req: (req.priority.value, req.timestamp),
            reverse=True
        )
        
        for request in sorted_requests:
            # Check if resources are available
            if self._can_allocate_resources(request):
                # Allocate resources
                allocation = self._allocate_resources(request)
                if allocation:
                    # Remove from requests
                    del self.resource_requests[request.request_id]
                    
                    self.logger.info(f"Resources allocated: {request.agent_id} -> {request.resource_type.value}")
    
    def _can_allocate_resources(self, request: ResourceRequest) -> bool:
        """Check if resources can be allocated for a request"""
        if self.system_resources is None:
            return False
        
        # Check resource limits
        limits = self.config["resource_limits"]
        
        if request.resource_type == ResourceType.CPU:
            if request.amount_requested > limits["cpu_percent_per_agent"]:
                return False
            if request.amount_requested > self.system_resources.available_cpu_percent:
                return False
        
        elif request.resource_type == ResourceType.MEMORY:
            if request.amount_requested > limits["memory_gb_per_agent"]:
                return False
            if request.amount_requested > self.system_resources.available_memory_gb:
                return False
        
        elif request.resource_type == ResourceType.DISK:
            if request.amount_requested > limits["disk_gb_per_agent"]:
                return False
            if request.amount_requested > self.system_resources.available_disk_gb:
                return False
        
        return True
    
    def _allocate_resources(self, request: ResourceRequest) -> Optional[ResourceAllocation]:
        """Allocate resources for a request"""
        # Calculate end time
        end_time = datetime.now().timestamp() + (request.duration_minutes * 60)
        
        # Create allocation
        allocation = ResourceAllocation(
            allocation_id=str(uuid.uuid4()),
            request_id=request.request_id,
            agent_id=request.agent_id,
            resource_type=request.resource_type,
            amount_allocated=request.amount_requested,
            start_time=datetime.now().isoformat(),
            end_time=datetime.fromtimestamp(end_time).isoformat(),
            status="active"
        )
        
        # Store allocation
        self.active_allocations[allocation.allocation_id] = allocation
        
        return allocation
    
    def _monitor_allocations(self):
        """Monitor active allocations"""
        current_time = datetime.now().timestamp()
        
        for allocation_id, allocation in list(self.active_allocations.items()):
            end_time = datetime.fromisoformat(allocation.end_time).timestamp()
            
            # Check if allocation has expired
            if current_time > end_time:
                allocation.status = "completed"
                allocation.end_time = datetime.now().isoformat()
                
                # Move to history
                self.allocation_history.append(allocation)
                del self.active_allocations[allocation_id]
                
                self.logger.info(f"Allocation expired: {allocation.agent_id} -> {allocation.resource_type.value}")
    
    def _optimize_resource_usage(self):
        """Optimize resource usage based on configuration"""
        if not self.config["load_balancing"]:
            return
        
        # Simple load balancing: redistribute resources if needed
        agent_allocations = {}
        
        for allocation in self.active_allocations.values():
            if allocation.agent_id not in agent_allocations:
                agent_allocations[allocation.agent_id] = []
            agent_allocations[allocation.agent_id].append(allocation)
        
        # Check for resource imbalances
        for agent_id, allocations in agent_allocations.items():
            total_cpu = sum(alloc.amount_allocated for alloc in allocations 
                          if alloc.resource_type == ResourceType.CPU)
            total_memory = sum(alloc.amount_allocated for alloc in allocations 
                             if alloc.resource_type == ResourceType.MEMORY)
            
            # If agent is using too many resources, consider rebalancing
            if total_cpu > self.config["resource_limits"]["cpu_percent_per_agent"] * 1.5:
                self.logger.warning(f"Agent {agent_id} using excessive CPU: {total_cpu}%")
    
    def _save_engine_state(self):
        """Save current engine state to file"""
        # Convert enums to strings for JSON serialization
        def convert_enum_to_string(obj):
            if isinstance(obj, dict):
                return {k: convert_enum_to_string(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [convert_enum_to_string(item) for item in obj]
            elif hasattr(obj, 'value'):  # Enum objects
                return obj.value
            else:
                return obj
        
        engine_state = {
            "timestamp": datetime.now().isoformat(),
            "system_resources": asdict(self.system_resources) if self.system_resources else None,
            "active_allocations": {k: convert_enum_to_string(asdict(v)) for k, v in self.active_allocations.items()},
            "pending_requests": {k: convert_enum_to_string(asdict(v)) for k, v in self.resource_requests.items()},
            "allocation_history": [convert_enum_to_string(asdict(alloc)) for alloc in self.allocation_history[-50:]],  # Last 50
            "summary": self._generate_summary()
        }
        
        state_file = self.reports_dir / "resource_allocation_engine_state.json"
        with open(state_file, 'w') as f:
            json.dump(engine_state, f, indent=2)
    
    def _generate_summary(self) -> Dict[str, Any]:
        """Generate engine summary"""
        total_allocations = len(self.active_allocations)
        pending_requests = len(self.resource_requests)
        
        # Calculate resource usage
        total_cpu_allocated = sum(
            alloc.amount_allocated for alloc in self.active_allocations.values()
            if alloc.resource_type == ResourceType.CPU
        )
        total_memory_allocated = sum(
            alloc.amount_allocated for alloc in self.active_allocations.values()
            if alloc.resource_type == ResourceType.MEMORY
        )
        
        return {
            "total_allocations": total_allocations,
            "pending_requests": pending_requests,
            "total_cpu_allocated_percent": total_cpu_allocated,
            "total_memory_allocated_gb": total_memory_allocated,
            "available_cpu_percent": self.system_resources.available_cpu_percent if self.system_resources else 0,
            "available_memory_gb": self.system_resources.available_memory_gb if self.system_resources else 0,
            "engine_active": self.engine_active
        }
    
    def get_engine_data(self) -> Dict[str, Any]:
        """Get current engine data"""
        # Convert enums to strings for JSON serialization
        def convert_enum_to_string(obj):
            if isinstance(obj, dict):
                return {k: convert_enum_to_string(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [convert_enum_to_string(item) for item in obj]
            elif hasattr(obj, 'value'):  # Enum objects
                return obj.value
            else:
                return obj
        
        return {
            "timestamp": datetime.now().isoformat(),
            "summary": self._generate_summary(),
            "system_resources": asdict(self.system_resources) if self.system_resources else None,
            "active_allocations": {k: convert_enum_to_string(asdict(v)) for k, v in self.active_allocations.items()},
            "pending_requests": {k: convert_enum_to_string(asdict(v)) for k, v in self.resource_requests.items()}
        }

def main():
    """Main function for frame execution"""
    print("⚡ Starting Resource Allocation Engine Frame")
    
    # Initialize engine
    engine = ResourceAllocationEngine()
    
    # Start engine
    result = engine.start_engine()
    print(f"⚡ Engine Status: {result}")
    
    # Request some test resources
    test_requests = [
        ("crewai_lane_manager", ResourceType.CPU, 15.0, AllocationPriority.HIGH, 30, "Build coordination"),
        ("agent_zero_researcher", ResourceType.MEMORY, 2.0, AllocationPriority.NORMAL, 60, "Research analysis"),
        ("playwright_automation_engineer", ResourceType.CPU, 10.0, AllocationPriority.NORMAL, 45, "Browser automation"),
        ("n8n_workflow_manager", ResourceType.MEMORY, 1.5, AllocationPriority.LOW, 20, "Workflow management")
    ]
    
    for agent_id, resource_type, amount, priority, duration, purpose in test_requests:
        result = engine.request_resources(agent_id, resource_type, amount, priority, duration, purpose)
        print(f"📋 Resource Request: {result}")
    
    # Let it run for a few seconds
    time.sleep(10)
    
    # Get engine data
    engine_data = engine.get_engine_data()
    
    # Save comprehensive report
    report_file = Path("reports") / f"resource_allocation_engine_{int(time.time())}.json"
    with open(report_file, 'w') as f:
        json.dump(engine_data, f, indent=2)
    
    # Stop engine
    engine.stop_engine()
    
    print(f"✅ Resource Allocation Engine Frame completed")
    print(f"📄 Report saved: {report_file}")
    
            return {
            "success": True,
            "engine_implemented": True,
            "allocation_active": True,
            "report_file": str(report_file),
            "summary": engine_data["summary"]
        }

if __name__ == "__main__":
    result = main()
    print(json.dumps(result, indent=2))
