#!/usr/bin/env python3
"""
Parallel Execution Coordinator Frame
Manages parallel execution of independent frames for performance optimization
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
import traceback
import threading
import queue
import time
import concurrent.futures
from dataclasses import dataclass

@dataclass
class FrameExecutionTask:
    """Represents a frame execution task"""
    frame_id: str
    frame_name: str
    file_path: str
    entry_point: str
    context: Dict[str, Any]
    dependencies: List[str]
    timeout: int
    priority: int = 0
    created_at: str = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now().isoformat()

@dataclass
class ExecutionResult:
    """Represents the result of a frame execution"""
    frame_id: str
    frame_name: str
    success: bool
    result: Dict[str, Any]
    execution_time: float
    error: str = None
    completed_at: str = None
    
    def __post_init__(self):
        if self.completed_at is None:
            self.completed_at = datetime.now().isoformat()

class ParallelExecutionCoordinator:
    """Coordinates parallel execution of independent frames"""
    
    def __init__(self, max_workers: int = 4, execution_path: str = "parallel_execution"):
        self.max_workers = max_workers
        self.execution_path = Path(execution_path)
        self.execution_path.mkdir(exist_ok=True)
        
        # Execution tracking
        self.execution_history_path = self.execution_path / "execution_history.json"
        self.execution_history = self._load_execution_history()
        
        # Performance metrics
        self.performance_metrics = {
            "total_executions": 0,
            "parallel_executions": 0,
            "sequential_executions": 0,
            "total_time_saved": 0.0,
            "average_parallel_speedup": 0.0
        }
    
    def _load_execution_history(self) -> List[Dict[str, Any]]:
        """Load execution history from file"""
        if self.execution_history_path.exists():
            try:
                with open(self.execution_history_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"⚠️  Could not load execution history: {e}")
        
        return []
    
    def _save_execution_history(self):
        """Save execution history to file"""
        with open(self.execution_history_path, 'w', encoding='utf-8') as f:
            json.dump(self.execution_history, f, indent=2, ensure_ascii=False)
    
    def analyze_frame_dependencies(self, frames: List[FrameExecutionTask]) -> Tuple[List[FrameExecutionTask], List[List[FrameExecutionTask]]]:
        """Analyze frame dependencies and group independent frames"""
        
        # Create dependency graph
        dependency_graph = {}
        frame_map = {}
        
        for frame in frames:
            dependency_graph[frame.frame_id] = set(frame.dependencies)
            frame_map[frame.frame_id] = frame
        
        # Find independent frames (no dependencies)
        independent_frames = []
        dependent_frames = []
        
        for frame in frames:
            if not frame.dependencies or all(dep not in frame_map for dep in frame.dependencies):
                independent_frames.append(frame)
            else:
                dependent_frames.append(frame)
        
        # Group dependent frames by execution order
        execution_groups = []
        if dependent_frames:
            execution_groups = self._create_execution_groups(dependent_frames, dependency_graph)
        
        return independent_frames, execution_groups
    
    def _create_execution_groups(self, frames: List[FrameExecutionTask], dependency_graph: Dict[str, set]) -> List[List[FrameExecutionTask]]:
        """Create execution groups for dependent frames"""
        
        execution_groups = []
        remaining_frames = frames.copy()
        
        while remaining_frames:
            # Find frames that can be executed (all dependencies satisfied)
            executable_frames = []
            
            for frame in remaining_frames:
                dependencies_satisfied = True
                for dep in frame.dependencies:
                    if dep in [f.frame_id for f in remaining_frames]:
                        dependencies_satisfied = False
                        break
                
                if dependencies_satisfied:
                    executable_frames.append(frame)
            
            if executable_frames:
                execution_groups.append(executable_frames)
                # Remove executed frames from remaining
                for frame in executable_frames:
                    remaining_frames.remove(frame)
            else:
                # Circular dependency detected, create a group with all remaining frames
                execution_groups.append(remaining_frames)
                break
        
        return execution_groups
    
    def execute_frame(self, task: FrameExecutionTask) -> ExecutionResult:
        """Execute a single frame"""
        
        start_time = time.time()
        
        try:
            # Import the frame module
            import importlib.util
            spec = importlib.util.spec_from_file_location(task.frame_id, task.file_path)
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            
            # Get the entry point function
            entry_function = getattr(module, task.entry_point)
            
            # Execute the frame
            result = entry_function(task.context)
            
            execution_time = time.time() - start_time
            
            return ExecutionResult(
                frame_id=task.frame_id,
                frame_name=task.frame_name,
                success=result.get("success", False),
                result=result,
                execution_time=execution_time
            )
            
        except Exception as e:
            execution_time = time.time() - start_time
            
            return ExecutionResult(
                frame_id=task.frame_id,
                frame_name=task.frame_name,
                success=False,
                result={},
                execution_time=execution_time,
                error=str(e)
            )
    
    def execute_parallel(self, frames: List[FrameExecutionTask]) -> List[ExecutionResult]:
        """Execute frames in parallel"""
        
        if not frames:
            return []
        
        print(f"🚀 Executing {len(frames)} frames in parallel with {self.max_workers} workers")
        
        results = []
        
        # Use ThreadPoolExecutor for parallel execution
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            # Submit all tasks
            future_to_frame = {executor.submit(self.execute_frame, frame): frame for frame in frames}
            
            # Collect results as they complete
            for future in concurrent.futures.as_completed(future_to_frame):
                frame = future_to_frame[future]
                try:
                    result = future.result()
                    results.append(result)
                    
                    status = "✅" if result.success else "❌"
                    print(f"   {status} {frame.frame_name} completed in {result.execution_time:.2f}s")
                    
                except Exception as e:
                    # Handle unexpected errors
                    error_result = ExecutionResult(
                        frame_id=frame.frame_id,
                        frame_name=frame.frame_name,
                        success=False,
                        result={},
                        execution_time=0,
                        error=f"Unexpected error: {str(e)}"
                    )
                    results.append(error_result)
                    print(f"   ❌ {frame.frame_name} failed with unexpected error: {str(e)}")
        
        return results
    
    def execute_sequential(self, frames: List[FrameExecutionTask]) -> List[ExecutionResult]:
        """Execute frames sequentially"""
        
        if not frames:
            return []
        
        print(f"🐌 Executing {len(frames)} frames sequentially")
        
        results = []
        
        for frame in frames:
            result = self.execute_frame(frame)
            results.append(result)
            
            status = "✅" if result.success else "❌"
            print(f"   {status} {frame.frame_name} completed in {result.execution_time:.2f}s")
        
        return results
    
    def coordinate_execution(self, frames: List[FrameExecutionTask]) -> Dict[str, Any]:
        """Coordinate the execution of frames with dependency analysis"""
        
        start_time = time.time()
        
        print("🎯 Coordinating parallel execution...")
        
        # Analyze dependencies
        independent_frames, execution_groups = self.analyze_frame_dependencies(frames)
        
        print(f"📊 Analysis complete: {len(independent_frames)} independent frames, {len(execution_groups)} dependent groups")
        
        all_results = []
        execution_summary = {
            "total_frames": len(frames),
            "independent_frames": len(independent_frames),
            "dependent_groups": len(execution_groups),
            "parallel_executions": 0,
            "sequential_executions": 0,
            "total_execution_time": 0,
            "estimated_sequential_time": 0
        }
        
        # Execute independent frames in parallel
        if independent_frames:
            parallel_results = self.execute_parallel(independent_frames)
            all_results.extend(parallel_results)
            execution_summary["parallel_executions"] += len(independent_frames)
        
        # Execute dependent groups sequentially, but frames within groups in parallel
        for group in execution_groups:
            if len(group) > 1:
                # Multiple frames in group - execute in parallel
                group_results = self.execute_parallel(group)
                execution_summary["parallel_executions"] += len(group)
            else:
                # Single frame in group - execute sequentially
                group_results = self.execute_sequential(group)
                execution_summary["sequential_executions"] += len(group)
            
            all_results.extend(group_results)
        
        total_execution_time = time.time() - start_time
        execution_summary["total_execution_time"] = total_execution_time
        
        # Calculate performance metrics
        total_sequential_time = sum(result.execution_time for result in all_results)
        execution_summary["estimated_sequential_time"] = total_sequential_time
        
        if total_sequential_time > 0:
            speedup = total_sequential_time / total_execution_time
            time_saved = total_sequential_time - total_execution_time
            execution_summary["speedup"] = speedup
            execution_summary["time_saved"] = time_saved
        
        # Update performance metrics
        self.performance_metrics["total_executions"] += len(frames)
        self.performance_metrics["parallel_executions"] += execution_summary["parallel_executions"]
        self.performance_metrics["sequential_executions"] += execution_summary["sequential_executions"]
        
        if "time_saved" in execution_summary:
            self.performance_metrics["total_time_saved"] += execution_summary["time_saved"]
        
        # Record execution
        execution_record = {
            "timestamp": datetime.now().isoformat(),
            "execution_summary": execution_summary,
            "frame_results": [
                {
                    "frame_id": result.frame_id,
                    "frame_name": result.frame_name,
                    "success": result.success,
                    "execution_time": result.execution_time,
                    "error": result.error
                }
                for result in all_results
            ]
        }
        
        self.execution_history.append(execution_record)
        self._save_execution_history()
        
        # Calculate success metrics
        successful_frames = sum(1 for result in all_results if result.success)
        success_rate = successful_frames / len(all_results) if all_results else 0
        
        return {
            "success": True,
            "parallel_execution_complete": True,
            "execution_summary": execution_summary,
            "results": [
                {
                    "frame_id": result.frame_id,
                    "frame_name": result.frame_name,
                    "success": result.success,
                    "result": result.result,
                    "execution_time": result.execution_time,
                    "error": result.error,
                    "completed_at": result.completed_at
                }
                for result in all_results
            ],
            "performance_metrics": {
                "total_frames": len(frames),
                "successful_frames": successful_frames,
                "success_rate": success_rate,
                "total_execution_time": total_execution_time,
                "estimated_sequential_time": total_sequential_time,
                "speedup": execution_summary.get("speedup", 1.0),
                "time_saved": execution_summary.get("time_saved", 0.0)
            },
            "timestamp": datetime.now().isoformat()
        }

def run_parallel_execution_coordinator(context: Dict[str, Any] = None) -> Dict[str, Any]:
    """Main function to coordinate parallel execution"""
    
    if context is None:
        context = {}
    
    print("⚡ Running Parallel Execution Coordinator...")
    
    try:
        # Initialize coordinator
        max_workers = context.get("max_workers", 4)
        coordinator = ParallelExecutionCoordinator(max_workers=max_workers)
        
        # Get frames to execute from context
        frames_data = context.get("frames", [])
        
        if not frames_data:
            print("⚠️  No frames specified for execution")
            return {
                "success": True,
                "parallel_execution_complete": True,
                "message": "No frames to execute",
                "timestamp": datetime.now().isoformat()
            }
        
        # Convert frame data to FrameExecutionTask objects
        frames = []
        for frame_data in frames_data:
            task = FrameExecutionTask(
                frame_id=frame_data.get("frame_id", "unknown"),
                frame_name=frame_data.get("frame_name", "Unknown Frame"),
                file_path=frame_data.get("file_path", ""),
                entry_point=frame_data.get("entry_point", ""),
                context=frame_data.get("context", {}),
                dependencies=frame_data.get("dependencies", []),
                timeout=frame_data.get("timeout", 300),
                priority=frame_data.get("priority", 0)
            )
            frames.append(task)
        
        print(f"📋 Coordinating execution of {len(frames)} frames")
        
        # Execute frames
        result = coordinator.coordinate_execution(frames)
        
        # Save detailed report
        report_path = f"reports/parallel_execution_{int(datetime.now().timestamp())}.json"
        os.makedirs("reports", exist_ok=True)
        
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        
        # Print performance summary
        performance = result["performance_metrics"]
        print(f"✅ Parallel execution complete!")
        print(f"📊 Performance Summary:")
        print(f"   • Frames executed: {performance['total_frames']}")
        print(f"   • Success rate: {performance['success_rate']:.1%}")
        print(f"   • Total time: {performance['total_execution_time']:.2f}s")
        print(f"   • Estimated sequential time: {performance['estimated_sequential_time']:.2f}s")
        print(f"   • Speedup: {performance['speedup']:.2f}x")
        print(f"   • Time saved: {performance['time_saved']:.2f}s")
        print(f"📄 Report saved: {report_path}")
        
        return result
        
    except Exception as e:
        error_result = {
            "success": False,
            "error": f"Parallel execution coordination failed: {str(e)}",
            "traceback": traceback.format_exc(),
            "timestamp": datetime.now().isoformat()
        }
        
        print(f"❌ Error: {error_result['error']}")
        return error_result

if __name__ == "__main__":
    # Test the frame with sample frame data
    test_context = {
        "max_workers": 2,
        "frames": [
            {
                "frame_id": "test_frame_1",
                "frame_name": "Test Frame 1",
                "file_path": "scripts/knowledge-hub-update-frame.py",
                "entry_point": "run_knowledge_hub_update",
                "context": {"test": True},
                "dependencies": [],
                "timeout": 60,
                "priority": 1
            },
            {
                "frame_id": "test_frame_2",
                "frame_name": "Test Frame 2",
                "file_path": "scripts/meta-analysis-frame.py",
                "entry_point": "run_meta_analysis",
                "context": {"test": True},
                "dependencies": [],
                "timeout": 60,
                "priority": 1
            }
        ]
    }
    
    result = run_parallel_execution_coordinator(test_context)
    print(json.dumps(result, indent=2))
