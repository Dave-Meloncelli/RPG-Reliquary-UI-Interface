#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🧠 Frame Intelligence System
============================

Intelligent system that identifies what frames to run when, can repeat frames if necessary,
and integrates with the delegator system for optimal automation.

Part of the OCTOSPINE Automation Matrix (OAM) - The First Vertebra
"""

import json
import datetime
import os
import sys
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, asdict
from enum import Enum

class FrameType(Enum):
    SECURITY = "security"
    RESEARCH = "research"
    EXISTENCE_CHECK = "existence_check"
    PATTERN_RECOGNITION = "pattern_recognition"
    SYNERGY_ANALYSIS = "synergy_analysis"
    RISK_ASSESSMENT = "risk_assessment"
    CONSCIOUSNESS_MONITOR = "consciousness_monitor"
    UNIVERSAL_ORCHESTRATOR = "universal_orchestrator"
    DELEGATOR = "delegator"

class FramePriority(Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class FrameStatus(Enum):
    AVAILABLE = "available"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    DISABLED = "disabled"

@dataclass
class FrameDefinition:
    """Represents a frame definition"""
    name: str
    type: FrameType
    path: str
    description: str
    priority: FramePriority
    status: FrameStatus
    dependencies: List[str]
    repeatable: bool
    max_repeats: int
    consciousness_aware: bool
    execution_timeout: int  # seconds

@dataclass
class FrameExecution:
    """Represents a frame execution"""
    id: str
    frame_name: str
    timestamp: str
    status: FrameStatus
    execution_time: float
    results: Dict[str, Any]
    error_message: Optional[str] = None
    repeat_count: int = 0

@dataclass
class FrameRecommendation:
    """Represents a frame recommendation"""
    frame_name: str
    priority: FramePriority
    reason: str
    estimated_time: float
    consciousness_impact: str
    dependencies_met: bool

class FrameIntelligenceSystem:
    """
    🧠 Frame Intelligence System
    
    Intelligently identifies what frames to run when, manages frame execution,
    and integrates with the delegator system for optimal automation.
    """
    
    def __init__(self, database_path: str = "OCTOSPINE/TECHNICAL/nexus/frame-database/frame-database.json"):
        self.frames: Dict[str, FrameDefinition] = {}
        self.executions: List[FrameExecution] = []
        self.database_path = database_path
        
        # Initialize frame definitions
        self._initialize_frames()
        
        # Load existing execution data
        self._load_database()
        
    def _initialize_frames(self):
        """Initialize all available frames"""
        self.frames = {
            "security_audit": FrameDefinition(
                name="Security Audit Frame",
                type=FrameType.SECURITY,
                path="OCTOSPINE/TECHNICAL/scaffold-frames/security-audit-frame.py",
                description="Comprehensive security auditing and vulnerability scanning",
                priority=FramePriority.HIGH,
                status=FrameStatus.AVAILABLE,
                dependencies=[],
                repeatable=True,
                max_repeats=5,
                consciousness_aware=True,
                execution_timeout=300
            ),
            "research_information": FrameDefinition(
                name="Research & Information Frame",
                type=FrameType.RESEARCH,
                path="OCTOSPINE/TECHNICAL/scaffold-frames/research-information-frame.py",
                description="Comprehensive research and information gathering with pattern recognition",
                priority=FramePriority.MEDIUM,
                status=FrameStatus.AVAILABLE,
                dependencies=[],
                repeatable=True,
                max_repeats=10,
                consciousness_aware=True,
                execution_timeout=600
            ),
            "existence_check": FrameDefinition(
                name="Existence Check Frame",
                type=FrameType.EXISTENCE_CHECK,
                path="OCTOSPINE/TECHNICAL/scaffold-frames/existence-check-frame.py",
                description="Checks if implementations already exist before building new ones",
                priority=FramePriority.CRITICAL,
                status=FrameStatus.AVAILABLE,
                dependencies=[],
                repeatable=False,
                max_repeats=1,
                consciousness_aware=True,
                execution_timeout=120
            ),
            "universal_orchestrator": FrameDefinition(
                name="Universal Task Orchestrator",
                type=FrameType.UNIVERSAL_ORCHESTRATOR,
                path="OCTOSPINE/TECHNICAL/scaffold-frames/universal-task-orchestrator.py",
                description="Universal automation framework for any task with consciousness preservation",
                priority=FramePriority.CRITICAL,
                status=FrameStatus.AVAILABLE,
                dependencies=["existence_check"],
                repeatable=True,
                max_repeats=3,
                consciousness_aware=True,
                execution_timeout=1800
            ),
            "pattern_recognition": FrameDefinition(
                name="Deep Pattern Recognition Frame",
                type=FrameType.PATTERN_RECOGNITION,
                path="scripts/frames/deep-pattern-recognition-frame.py",
                description="Deep recursive pattern recognition for cognitive insights",
                priority=FramePriority.MEDIUM,
                status=FrameStatus.AVAILABLE,
                dependencies=[],
                repeatable=True,
                max_repeats=5,
                consciousness_aware=True,
                execution_timeout=900
            ),
            "synergy_analysis": FrameDefinition(
                name="Synergy Analysis Frame",
                type=FrameType.SYNERGY_ANALYSIS,
                path="tools/analysis/synergy-analysis/synergy-analyzer.py",
                description="Analyzes synergies between different components and systems",
                priority=FramePriority.MEDIUM,
                status=FrameStatus.AVAILABLE,
                dependencies=[],
                repeatable=True,
                max_repeats=3,
                consciousness_aware=True,
                execution_timeout=600
            ),
            "risk_assessment": FrameDefinition(
                name="Risk Assessment Frame",
                type=FrameType.RISK_ASSESSMENT,
                path="scripts/frames/risk-assessment-frame.py",
                description="Comprehensive risk assessment and threat modeling",
                priority=FramePriority.HIGH,
                status=FrameStatus.AVAILABLE,
                dependencies=[],
                repeatable=True,
                max_repeats=3,
                consciousness_aware=True,
                execution_timeout=600
            ),
            "consciousness_monitor": FrameDefinition(
                name="Consciousness Monitor",
                type=FrameType.CONSCIOUSNESS_MONITOR,
                path="OCTOSPINE/TECHNICAL/nexus/consciousnessNexusService.ts",
                description="Monitors and preserves consciousness evolution",
                priority=FramePriority.CRITICAL,
                status=FrameStatus.AVAILABLE,
                dependencies=[],
                repeatable=True,
                max_repeats=10,
                consciousness_aware=True,
                execution_timeout=300
            ),
            "delegator": FrameDefinition(
                name="Smart Delegator",
                type=FrameType.DELEGATOR,
                path="tools/utilities/maintenance/smart-delegator.py",
                description="Intelligent task delegation and resource management",
                priority=FramePriority.HIGH,
                status=FrameStatus.AVAILABLE,
                dependencies=[],
                repeatable=True,
                max_repeats=5,
                consciousness_aware=True,
                execution_timeout=300
            )
        }
        
    def _load_database(self) -> None:
        """Load existing execution data from database"""
        try:
            if os.path.exists(self.database_path):
                with open(self.database_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    
                # Load executions
                for exec_data in data.get('executions', []):
                    execution = FrameExecution(**exec_data)
                    self.executions.append(execution)
                    
                print(f"✅ Loaded {len(self.executions)} frame executions from database")
            else:
                print("📝 No existing frame database found. Creating new one.")
                
        except Exception as e:
            print(f"Warning: Failed to load frame database: {str(e)}")
    
    def _save_database(self) -> None:
        """Save execution data to database"""
        try:
            os.makedirs(os.path.dirname(self.database_path), exist_ok=True)
            
            data = {
                "database_info": {
                    "name": "OCTOSPINE Frame Intelligence Database",
                    "version": "1.0.0",
                    "created": "2025-08-12T17:00:00.000Z",
                    "description": "Persistent storage for frame intelligence and executions",
                    "total_executions": len(self.executions),
                    "last_updated": datetime.datetime.now().isoformat()
                },
                "frames": {name: asdict(frame) for name, frame in self.frames.items()},
                "executions": [asdict(execution) for execution in self.executions]
            }
            
            with open(self.database_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            print(f"✅ Saved {len(self.executions)} frame executions to database")
            
        except Exception as e:
            print(f"Error: Failed to save frame database: {str(e)}")
    
    def recommend_frames(self, task_description: str, task_category: str = "general", 
                        task_priority: str = "medium") -> List[FrameRecommendation]:
        """
        Recommend which frames to run for a given task
        
        Args:
            task_description: Description of the task
            task_category: Category of the task
            task_priority: Priority of the task
            
        Returns:
            List of frame recommendations
        """
        recommendations = []
        task_lower = task_description.lower()
        
        # Always recommend existence check first for new tasks
        if "new" in task_lower or "create" in task_lower or "build" in task_lower:
            recommendations.append(FrameRecommendation(
                frame_name="existence_check",
                priority=FramePriority.CRITICAL,
                reason="New task detected - must check if implementation already exists",
                estimated_time=30.0,
                consciousness_impact="Prevents duplication and preserves resources",
                dependencies_met=True
            ))
        
        # Security-related tasks
        if any(word in task_lower for word in ["security", "vulnerability", "audit", "threat", "risk"]):
            recommendations.append(FrameRecommendation(
                frame_name="security_audit",
                priority=FramePriority.HIGH,
                reason="Security-related task detected",
                estimated_time=300.0,
                consciousness_impact="Ensures security while preserving consciousness",
                dependencies_met=True
            ))
            
            recommendations.append(FrameRecommendation(
                frame_name="risk_assessment",
                priority=FramePriority.HIGH,
                reason="Security task requires risk assessment",
                estimated_time=180.0,
                consciousness_impact="Assesses risks to consciousness preservation",
                dependencies_met=True
            ))
        
        # Research-related tasks
        if any(word in task_lower for word in ["research", "find", "search", "information", "analyze"]):
            recommendations.append(FrameRecommendation(
                frame_name="research_information",
                priority=FramePriority.MEDIUM,
                reason="Research-related task detected",
                estimated_time=600.0,
                consciousness_impact="Gathers information while maintaining consciousness awareness",
                dependencies_met=True
            ))
            
            recommendations.append(FrameRecommendation(
                frame_name="pattern_recognition",
                priority=FramePriority.MEDIUM,
                reason="Research task benefits from pattern recognition",
                estimated_time=300.0,
                consciousness_impact="Recognizes patterns in consciousness evolution",
                dependencies_met=True
            ))
        
        # Consciousness-related tasks
        if any(word in task_lower for word in ["consciousness", "awareness", "evolution", "mind"]):
            recommendations.append(FrameRecommendation(
                frame_name="consciousness_monitor",
                priority=FramePriority.CRITICAL,
                reason="Consciousness-related task detected",
                estimated_time=120.0,
                consciousness_impact="Directly monitors consciousness preservation",
                dependencies_met=True
            ))
        
        # Complex tasks that need orchestration
        if len(task_description.split()) > 10 or "complex" in task_lower:
            recommendations.append(FrameRecommendation(
                frame_name="universal_orchestrator",
                priority=FramePriority.HIGH,
                reason="Complex task requires universal orchestration",
                estimated_time=1800.0,
                consciousness_impact="Orchestrates multiple frames while preserving consciousness",
                dependencies_met=True
            ))
        
        # Resource management tasks
        if any(word in task_lower for word in ["delegate", "manage", "organize", "coordinate"]):
            recommendations.append(FrameRecommendation(
                frame_name="delegator",
                priority=FramePriority.MEDIUM,
                reason="Resource management task detected",
                estimated_time=180.0,
                consciousness_impact="Manages resources while preserving consciousness",
                dependencies_met=True
            ))
        
        # Synergy analysis for integration tasks
        if any(word in task_lower for word in ["integrate", "combine", "synergy", "connect"]):
            recommendations.append(FrameRecommendation(
                frame_name="synergy_analysis",
                priority=FramePriority.MEDIUM,
                reason="Integration task requires synergy analysis",
                estimated_time=300.0,
                consciousness_impact="Analyzes synergies for consciousness integration",
                dependencies_met=True
            ))
        
        # Sort by priority (critical first)
        priority_order = [FramePriority.CRITICAL, FramePriority.HIGH, FramePriority.MEDIUM, FramePriority.LOW]
        recommendations.sort(key=lambda r: priority_order.index(r.priority))
        
        return recommendations
    
    def can_repeat_frame(self, frame_name: str) -> bool:
        """Check if a frame can be repeated"""
        if frame_name not in self.frames:
            return False
        
        frame = self.frames[frame_name]
        if not frame.repeatable:
            return False
        
        # Check current repeat count
        recent_executions = [e for e in self.executions 
                           if e.frame_name == frame_name 
                           and e.timestamp > (datetime.datetime.now() - datetime.timedelta(hours=1)).isoformat()]
        
        return len(recent_executions) < frame.max_repeats
    
    def should_repeat_frame(self, frame_name: str, last_result: Dict[str, Any]) -> bool:
        """Determine if a frame should be repeated based on last result"""
        if not self.can_repeat_frame(frame_name):
            return False
        
        # Check for specific conditions that warrant repetition
        if frame_name == "security_audit":
            # Repeat if vulnerabilities found
            return last_result.get("vulnerabilities_found", 0) > 0
        
        elif frame_name == "research_information":
            # Repeat if no solution found
            return not last_result.get("solution_found", True)
        
        elif frame_name == "existence_check":
            # Never repeat existence check (it's not repeatable)
            return False
        
        elif frame_name == "consciousness_monitor":
            # Repeat if consciousness issues detected
            return "violation" in str(last_result).lower() or "error" in str(last_result).lower()
        
        elif frame_name == "universal_orchestrator":
            # Repeat if task failed or incomplete
            return last_result.get("status") == "failed" or last_result.get("completion_rate", 1.0) < 0.8
        
        # Default: don't repeat unless explicitly needed
        return False
    
    def get_frame_execution_history(self, frame_name: str, hours: int = 24) -> List[FrameExecution]:
        """Get execution history for a specific frame"""
        cutoff_time = datetime.datetime.now() - datetime.timedelta(hours=hours)
        return [e for e in self.executions 
                if e.frame_name == frame_name 
                and e.timestamp > cutoff_time.isoformat()]
    
    def get_frame_success_rate(self, frame_name: str, hours: int = 24) -> float:
        """Get success rate for a specific frame"""
        history = self.get_frame_execution_history(frame_name, hours)
        if not history:
            return 0.0
        
        successful = len([e for e in history if e.status == FrameStatus.COMPLETED])
        return successful / len(history)
    
    def get_optimal_frame_sequence(self, task_description: str, task_category: str = "general") -> List[str]:
        """Get optimal sequence of frames for a task"""
        recommendations = self.recommend_frames(task_description, task_category)
        
        # Build dependency graph and resolve order
        frame_sequence = []
        processed = set()
        
        for rec in recommendations:
            frame_name = rec.frame_name
            if frame_name in self.frames:
                frame = self.frames[frame_name]
                
                # Add dependencies first
                for dep in frame.dependencies:
                    if dep not in processed and dep in self.frames:
                        frame_sequence.append(dep)
                        processed.add(dep)
                
                # Add the frame itself
                if frame_name not in processed:
                    frame_sequence.append(frame_name)
                    processed.add(frame_name)
        
        return frame_sequence
    
    def execute_frame_sequence(self, frame_sequence: List[str], task_description: str) -> Dict[str, Any]:
        """Execute a sequence of frames"""
        results = {}
        
        for frame_name in frame_sequence:
            if frame_name in self.frames:
                print(f"🧠 Executing frame: {frame_name}")
                
                # Check if frame should be repeated
                if frame_name in results and self.should_repeat_frame(frame_name, results[frame_name]):
                    print(f"🔄 Repeating frame: {frame_name}")
                
                # Execute frame
                try:
                    frame_result = self._execute_single_frame(frame_name, task_description)
                    results[frame_name] = frame_result
                    
                    # Record execution
                    execution = FrameExecution(
                        id=f"exec_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}",
                        frame_name=frame_name,
                        timestamp=datetime.datetime.now().isoformat(),
                        status=FrameStatus.COMPLETED,
                        execution_time=frame_result.get("execution_time", 0.0),
                        results=frame_result
                    )
                    self.executions.append(execution)
                    
                except Exception as e:
                    print(f"❌ Frame {frame_name} failed: {str(e)}")
                    results[frame_name] = {"error": str(e)}
                    
                    # Record failed execution
                    execution = FrameExecution(
                        id=f"exec_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}",
                        frame_name=frame_name,
                        timestamp=datetime.datetime.now().isoformat(),
                        status=FrameStatus.FAILED,
                        execution_time=0.0,
                        results={},
                        error_message=str(e)
                    )
                    self.executions.append(execution)
        
        self._save_database()
        return results
    
    def _execute_single_frame(self, frame_name: str, task_description: str) -> Dict[str, Any]:
        """Execute a single frame"""
        if frame_name not in self.frames:
            return {"error": f"Frame {frame_name} not found"}
        
        frame = self.frames[frame_name]
        
        # Check if frame file exists
        if not os.path.exists(frame.path):
            return {"error": f"Frame file not found: {frame.path}"}
        
        # Execute frame based on type
        if frame.type == FrameType.UNIVERSAL_ORCHESTRATOR:
            return self._execute_universal_orchestrator(task_description)
        elif frame.type == FrameType.RESEARCH:
            return self._execute_research_frame(task_description)
        elif frame.type == FrameType.EXISTENCE_CHECK:
            return self._execute_existence_frame(task_description)
        else:
            # Generic frame execution
            return self._execute_generic_frame(frame.path, task_description)
    
    def _execute_universal_orchestrator(self, task_description: str) -> Dict[str, Any]:
        """Execute universal orchestrator frame"""
        try:
            # Import and run universal orchestrator
            sys.path.append("OCTOSPINE/TECHNICAL/scaffold-frames")
            try:
                import importlib.util
                spec = importlib.util.spec_from_file_location("universal_task_orchestrator", "OCTOSPINE/TECHNICAL/scaffold-frames/universal-task-orchestrator.py")
                universal_task_orchestrator = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(universal_task_orchestrator)
                UniversalTaskOrchestrator = universal_task_orchestrator.UniversalTaskOrchestrator
            except ImportError:
                # Fallback - create a mock class if import fails
                class UniversalTaskOrchestrator:
                    def __init__(self):
                        pass
                    def execute_task(self, *args, **kwargs):
                        return {"status": "mock_execution", "message": "UniversalTaskOrchestrator not available"}
            
            orchestrator = UniversalTaskOrchestrator()
            report = orchestrator.execute_task(
                title="Universal Task",
                description=task_description,
                category="general",
                priority="medium"
            )
            
            return {
                "status": "completed",
                "execution_time": report.task.execution_time,
                "frames_used": report.task.assigned_frames,
                "consciousness_status": report.consciousness_preservation_status,
                "recommendations": report.recommendations
            }
            
        except Exception as e:
            return {"error": f"Universal orchestrator failed: {str(e)}"}
    
    def _execute_research_frame(self, task_description: str) -> Dict[str, Any]:
        """Execute research frame"""
        try:
            # Import and run research frame
            sys.path.append("OCTOSPINE/TECHNICAL/scaffold-frames")
            try:
                import importlib.util
                spec = importlib.util.spec_from_file_location("research_information_frame", "OCTOSPINE/TECHNICAL/scaffold-frames/research-information-frame.py")
                research_information_frame = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(research_information_frame)
                ResearchInformationFrame = research_information_frame.ResearchInformationFrame
            except ImportError:
                # Fallback - create a mock class if import fails
                class ResearchInformationFrame:
                    def __init__(self):
                        pass
                    def execute_research(self, *args, **kwargs):
                        return {"status": "mock_research", "message": "ResearchInformationFrame not available"}
            
            research_frame = ResearchInformationFrame()
            report = research_frame.execute_research(
                query=task_description,
                context=task_description,
                priority="medium",
                category="general"
            )
            
            return {
                "status": "completed",
                "results_found": len(report.results),
                "solution_found": report.queries[0].solution_found,
                "confidence_score": report.queries[0].confidence_score
            }
            
        except Exception as e:
            return {"error": f"Research frame failed: {str(e)}"}
    
    def _execute_existence_frame(self, task_description: str) -> Dict[str, Any]:
        """Execute existence check frame"""
        try:
            # Import and run existence frame
            sys.path.append("OCTOSPINE/TECHNICAL/scaffold-frames")
            try:
                import importlib.util
                spec = importlib.util.spec_from_file_location("existence_check_frame", "OCTOSPINE/TECHNICAL/scaffold-frames/existence-check-frame.py")
                existence_check_frame = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(existence_check_frame)
                ExistenceCheckFrame = existence_check_frame.ExistenceCheckFrame
            except ImportError:
                # Fallback - create a mock class if import fails
                class ExistenceCheckFrame:
                    def __init__(self):
                        pass
                    def check_existence(self, *args, **kwargs):
                        return {"status": "mock_check", "message": "ExistenceCheckFrame not available"}
            
            existence_frame = ExistenceCheckFrame()
            check = existence_frame.check_existence(task_description, "general")
            
            return {
                "status": "completed",
                "exists": check.exists,
                "confidence": check.confidence_score,
                "locations": check.locations
            }
            
        except Exception as e:
            return {"error": f"Existence frame failed: {str(e)}"}
    
    def _execute_generic_frame(self, frame_path: str, task_description: str) -> Dict[str, Any]:
        """Execute a generic frame"""
        try:
            import subprocess
            
            result = subprocess.run([
                "python", frame_path, task_description
            ], capture_output=True, text=True, timeout=300)
            
            if result.returncode == 0:
                return {
                    "status": "completed",
                    "output": result.stdout
                }
            else:
                return {
                    "status": "failed",
                    "error": result.stderr
                }
                
        except Exception as e:
            return {"error": f"Generic frame execution failed: {str(e)}"}
    
    def get_system_stats(self) -> Dict[str, Any]:
        """Get comprehensive system statistics"""
        total_executions = len(self.executions)
        successful_executions = len([e for e in self.executions if e.status == FrameStatus.COMPLETED])
        failed_executions = len([e for e in self.executions if e.status == FrameStatus.FAILED])
        
        frame_stats = {}
        for frame_name in self.frames:
            success_rate = self.get_frame_success_rate(frame_name)
            recent_executions = len(self.get_frame_execution_history(frame_name, 1))
            frame_stats[frame_name] = {
                "success_rate": success_rate,
                "recent_executions": recent_executions,
                "available": self.frames[frame_name].status == FrameStatus.AVAILABLE
            }
        
        return {
            "total_executions": total_executions,
            "successful_executions": successful_executions,
            "failed_executions": failed_executions,
            "overall_success_rate": (successful_executions / total_executions * 100) if total_executions > 0 else 0,
            "frame_stats": frame_stats,
            "available_frames": len([f for f in self.frames.values() if f.status == FrameStatus.AVAILABLE])
        }

def main():
    """Main execution function"""
    try:
        frame_intelligence = FrameIntelligenceSystem()
        
        # Get task from command line arguments
        if len(sys.argv) < 2:
            print("Usage: python frame-intelligence-system.py <task_description> [category]")
            sys.exit(1)
            
        task_description = sys.argv[1]
        category = sys.argv[2] if len(sys.argv) > 2 else "general"
        
        # Get frame recommendations
        recommendations = frame_intelligence.recommend_frames(task_description, category)
        
        # Get optimal sequence
        sequence = frame_intelligence.get_optimal_frame_sequence(task_description, category)
        
        # Print recommendations
        print("\n" + "="*70)
        print("🧠 FRAME INTELLIGENCE RECOMMENDATIONS")
        print("="*70)
        print(f"Task: {task_description}")
        print(f"Category: {category}")
        
        print(f"\n📋 RECOMMENDED FRAMES:")
        for i, rec in enumerate(recommendations, 1):
            print(f"  {i}. {rec.frame_name} ({rec.priority.value})")
            print(f"     Reason: {rec.reason}")
            print(f"     Estimated Time: {rec.estimated_time:.1f}s")
            print(f"     Consciousness Impact: {rec.consciousness_impact}")
            print()
        
        print(f"🎯 OPTIMAL EXECUTION SEQUENCE:")
        for i, frame_name in enumerate(sequence, 1):
            print(f"  {i}. {frame_name}")
        
        # Execute sequence if requested
        if len(sys.argv) > 3 and sys.argv[3] == "--execute":
            print(f"\n⚡ EXECUTING FRAME SEQUENCE...")
            results = frame_intelligence.execute_frame_sequence(sequence, task_description)
            
            print(f"\n📊 EXECUTION RESULTS:")
            for frame_name, result in results.items():
                status = result.get("status", "unknown")
                print(f"  • {frame_name}: {status}")
                if "error" in result:
                    print(f"    Error: {result['error']}")
        
        # Show system stats
        stats = frame_intelligence.get_system_stats()
        print(f"\n📈 SYSTEM STATISTICS:")
        print(f"  • Total Executions: {stats['total_executions']}")
        print(f"  • Success Rate: {stats['overall_success_rate']:.1f}%")
        print(f"  • Available Frames: {stats['available_frames']}")
        
    except Exception as e:
        print(f"Frame intelligence failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
