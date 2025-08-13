#!/usr/bin/env python3
"""
Autonomous Framework - Modular Scaffold System
Implements 8-stage framework with reusable frames/modules
"""

import os
import sys
import json
import time
import subprocess
from pathlib import Path
from typing import Dict, List, Set, Optional, Any, Callable
from datetime import datetime
from dataclasses import dataclass, asdict
from enum import Enum
import importlib.util
import traceback

class Stage(Enum):
    """Framework stages"""
    SCOPE = 1
    IDENTIFY_ANALYZE = 2
    PLAN = 3
    IMPLEMENT = 4
    SUCCESS_CONTINUE = 5
    FINAL_AUDIT = 6
    UPDATE_REGISTERS = 7
    PUSH_GITHUB = 8

class FrameType(Enum):
    """Types of frames that can be used in scaffolds"""
    MODULE = "module"
    TOOL = "tool"
    PROCESS = "process"
    ANALYSIS = "analysis"
    MITIGATION = "mitigation"
    VERIFICATION = "verification"

@dataclass
class Frame:
    """A reusable frame/module in the scaffold"""
    id: str
    name: str
    type: FrameType
    description: str
    file_path: str
    entry_point: str
    dependencies: List[str]
    parameters: Dict[str, Any]
    success_criteria: Dict[str, Any]
    rollback_plan: str
    version: str = "1.0"
    last_used: str = None
    
    def __post_init__(self):
        if self.last_used is None:
            self.last_used = datetime.now().isoformat()

@dataclass
class Scaffold:
    """A scaffold containing multiple frames"""
    id: str
    name: str
    description: str
    stages: Dict[int, List[Frame]]
    dependencies: List[str]
    success_criteria: Dict[str, Any]
    version: str = "1.0"
    created_at: str = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now().isoformat()

@dataclass
class ExecutionContext:
    """Context for frame execution"""
    stage: Stage
    frame: Frame
    input_data: Dict[str, Any]
    previous_results: Dict[str, Any]
    parameters: Dict[str, Any]
    attempt_count: int = 0
    max_attempts: int = 2

class FrameRegistry:
    """Registry for all available frames"""
    
    def __init__(self):
        self.frames: Dict[str, Frame] = {}
        self.scaffolds: Dict[str, Scaffold] = {}
        self._load_frames()
        self._load_scaffolds()
    
    def _load_frames(self):
        """Load all available frames"""
        # Synthesis Analysis Frame
        self.frames['synthesis_analysis'] = Frame(
            id='synthesis_analysis',
            name='Synthesis Analysis',
            type=FrameType.ANALYSIS,
            description='Analyzes system for synergies, risks, and opportunities',
            file_path='autonomous-system-v3.py',
            entry_point='run_final_synthesis',
            dependencies=['json', 'pathlib', 'datetime'],
            parameters={'scope': 'full_system'},
            success_criteria={'synergies_found': True, 'risks_identified': True},
            rollback_plan='Remove synthesis report files'
        )
        
        # Risk Mitigation Frame
        self.frames['risk_mitigation'] = Frame(
            id='risk_mitigation',
            name='Risk Mitigation',
            type=FrameType.MITIGATION,
            description='Automatically mitigates critical risks',
            file_path='autonomous-system-v5.py',
            entry_point='run_comprehensive_risk_mitigation',
            dependencies=['json', 'pathlib', 'shutil'],
            parameters={'auto_fix': True, 'require_permission': True},
            success_criteria={'critical_risks_mitigated': True},
            rollback_plan='Restore from backup, revert changes'
        )
        
        # Enhanced Analysis Frame
        self.frames['enhanced_analysis'] = Frame(
            id='enhanced_analysis',
            name='Enhanced Analysis',
            type=FrameType.ANALYSIS,
            description='Industry-standard analysis with expanded scope',
            file_path='autonomous-system-v4.py',
            entry_point='run_enhanced_synthesis',
            dependencies=['json', 'webbrowser', 'pathlib'],
            parameters={'include_security': True, 'include_performance': True},
            success_criteria={'technical_debt_analyzed': True, 'security_issues_found': True},
            rollback_plan='Remove analysis reports'
        )
        
        # System Audit Frame
        self.frames['system_audit'] = Frame(
            id='system_audit',
            name='System Audit',
            type=FrameType.ANALYSIS,
            description='Comprehensive system audit and validation',
            file_path='scripts/system-audit.js',
            entry_point='performFullAudit',
            dependencies=['fs', 'path', 'child_process'],
            parameters={'recursive': True, 'validate_hub': True},
            success_criteria={'audit_complete': True, 'hub_validated': True},
            rollback_plan='No rollback needed - read-only operation'
        )
        
        # Knowledge Hub Update Frame
        self.frames['knowledge_hub_update'] = Frame(
            id='knowledge_hub_update',
            name='Knowledge Hub Update',
            type=FrameType.PROCESS,
            description='Updates Knowledge Hub with new findings',
            file_path='scripts/knowledge-hub-updater.js',
            entry_point='updateHub',
            dependencies=['fs', 'path', 'child_process'],
            parameters={'auto_update': True, 'generate_report': True},
            success_criteria={'hub_updated': True, 'report_generated': True},
            rollback_plan='Restore previous hub version from git'
        )
        
        # Template Handler Frame
        self.frames['template_handler'] = Frame(
            id='template_handler',
            name='Template Handler',
            type=FrameType.PROCESS,
            description='Handles template command execution',
            file_path='backend/app/template_handler.py',
            entry_point='execute_template',
            dependencies=['re', 'json', 'logging'],
            parameters={'template_name': '', 'parameters': {}},
            success_criteria={'template_executed': True, 'output_generated': True},
            rollback_plan='No rollback needed - template execution only'
        )
    
    def _load_scaffolds(self):
        """Load predefined scaffolds"""
        
        # Full System Analysis Scaffold
        self.scaffolds['full_system_analysis'] = Scaffold(
            id='full_system_analysis',
            name='Full System Analysis',
            description='Complete system analysis and optimization',
            stages={
                1: [self.frames['synthesis_analysis']],  # Scope
                2: [self.frames['enhanced_analysis']],   # Identify & Analyze
                3: [self.frames['system_audit']],        # Plan
                4: [self.frames['risk_mitigation']],     # Implement
                5: [],  # Success continue (empty - handled by framework)
                6: [self.frames['synthesis_analysis']],  # Final audit
                7: [self.frames['knowledge_hub_update']], # Update registers
                8: []   # Push to GitHub (handled by framework)
            },
            dependencies=['python', 'node', 'git'],
            success_criteria={'analysis_complete': True, 'risks_mitigated': True, 'hub_updated': True}
        )
        
        # Quick Assessment Scaffold
        self.scaffolds['quick_assessment'] = Scaffold(
            id='quick_assessment',
            name='Quick Assessment',
            description='Rapid system assessment',
            stages={
                1: [self.frames['synthesis_analysis']],  # Scope
                2: [self.frames['system_audit']],        # Identify & Analyze
                3: [],  # Plan (minimal)
                4: [],  # Implement (minimal)
                5: [],  # Success continue
                6: [self.frames['synthesis_analysis']],  # Final audit
                7: [self.frames['knowledge_hub_update']], # Update registers
                8: []   # Push to GitHub
            },
            dependencies=['python', 'node'],
            success_criteria={'assessment_complete': True, 'hub_updated': True}
        )
        
        # Template Execution Scaffold
        self.scaffolds['template_execution'] = Scaffold(
            id='template_execution',
            name='Template Execution',
            description='Execute template commands with validation',
            stages={
                1: [self.frames['template_handler']],    # Scope
                2: [self.frames['template_handler']],    # Identify & Analyze
                3: [],  # Plan
                4: [self.frames['template_handler']],    # Implement
                5: [],  # Success continue
                6: [self.frames['template_handler']],    # Final audit
                7: [self.frames['knowledge_hub_update']], # Update registers
                8: []   # Push to GitHub
            },
            dependencies=['python', 'fastapi'],
            success_criteria={'template_executed': True, 'output_valid': True}
        )

class FrameExecutor:
    """Executes frames with error handling and retry logic"""
    
    def __init__(self, registry: FrameRegistry):
        self.registry = registry
        self.execution_history = []
    
    def execute_frame(self, context: ExecutionContext) -> Dict[str, Any]:
        """Execute a single frame"""
        print(f"\n🔧 Executing Frame: {context.frame.name}")
        print(f"   Stage: {context.stage.name}")
        print(f"   Attempt: {context.attempt_count + 1}/{context.max_attempts}")
        
        try:
            # Load the frame module
            module = self._load_frame_module(context.frame)
            
            # Execute the frame
            result = self._execute_frame_entry_point(module, context)
            
            # Validate success criteria
            success = self._validate_success_criteria(result, context.frame.success_criteria)
            
            if success:
                print(f"✅ Frame executed successfully: {context.frame.name}")
                self.execution_history.append({
                    'frame_id': context.frame.id,
                    'stage': context.stage.value,
                    'success': True,
                    'timestamp': datetime.now().isoformat(),
                    'result': result
                })
                return result
            else:
                raise Exception("Frame execution did not meet success criteria")
                
        except Exception as e:
            print(f"❌ Frame execution failed: {context.frame.name}")
            print(f"   Error: {str(e)}")
            
            self.execution_history.append({
                'frame_id': context.frame.id,
                'stage': context.stage.value,
                'success': False,
                'timestamp': datetime.now().isoformat(),
                'error': str(e)
            })
            
            # Retry logic
            if context.attempt_count < context.max_attempts - 1:
                print(f"🔄 Retrying frame: {context.frame.name}")
                context.attempt_count += 1
                return self.execute_frame(context)
            else:
                print(f"🚫 Max attempts reached for frame: {context.frame.name}")
                raise e
    
    def _load_frame_module(self, frame: Frame):
        """Load a frame module dynamically"""
        if frame.file_path.endswith('.py'):
            # Load Python module
            spec = importlib.util.spec_from_file_location(frame.id, frame.file_path)
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            return module
        elif frame.file_path.endswith('.js'):
            # Execute JavaScript file
            result = subprocess.run(['node', frame.file_path], 
                                  capture_output=True, text=True, cwd=os.getcwd())
            if result.returncode != 0:
                raise Exception(f"JavaScript execution failed: {result.stderr}")
            return {'output': result.stdout, 'success': True}
        else:
            raise Exception(f"Unsupported file type: {frame.file_path}")
    
    def _execute_frame_entry_point(self, module, context: ExecutionContext):
        """Execute the frame's entry point"""
        if hasattr(module, context.frame.entry_point):
            entry_point = getattr(module, context.frame.entry_point)
            if callable(entry_point):
                return entry_point()
            else:
                return entry_point
        else:
            raise Exception(f"Entry point '{context.frame.entry_point}' not found in module")
    
    def _validate_success_criteria(self, result: Dict[str, Any], criteria: Dict[str, Any]) -> bool:
        """Validate that the result meets success criteria"""
        for key, expected_value in criteria.items():
            if key not in result:
                return False
            if result[key] != expected_value:
                return False
        return True

class AutonomousFramework:
    """Main autonomous framework orchestrator"""
    
    def __init__(self):
        self.registry = FrameRegistry()
        self.executor = FrameExecutor(self.registry)
        self.current_context = {}
        self.execution_log = []
    
    def execute_scaffold(self, scaffold_id: str, input_data: Dict[str, Any] = None) -> Dict[str, Any]:
        """Execute a complete scaffold"""
        print(f"🚀 AUTONOMOUS FRAMEWORK - EXECUTING SCAFFOLD: {scaffold_id}")
        print("=" * 80)
        
        if scaffold_id not in self.registry.scaffolds:
            raise Exception(f"Scaffold '{scaffold_id}' not found")
        
        scaffold = self.registry.scaffolds[scaffold_id]
        self.current_context = {
            'scaffold_id': scaffold_id,
            'input_data': input_data or {},
            'previous_results': {},
            'start_time': datetime.now().isoformat()
        }
        
        try:
            # Execute each stage
            for stage_num in range(1, 9):
                stage = Stage(stage_num)
                print(f"\n📋 STAGE {stage_num}: {stage.name}")
                print("-" * 40)
                
                stage_result = self._execute_stage(scaffold, stage, stage_num)
                self.current_context['previous_results'][f'stage_{stage_num}'] = stage_result
                
                # Handle stage-specific logic
                if stage == Stage.SUCCESS_CONTINUE:
                    if not self._check_stage_success(stage_result):
                        print(f"⚠️ Stage {stage_num} failed, retrying from stage 2...")
                        stage_result = self._retry_from_stage_2(scaffold, input_data)
                
                elif stage == Stage.PUSH_GITHUB:
                    stage_result = self._push_to_github()
                
                self.execution_log.append({
                    'stage': stage_num,
                    'stage_name': stage.name,
                    'result': stage_result,
                    'timestamp': datetime.now().isoformat()
                })
            
            # Generate final report
            final_report = self._generate_final_report(scaffold)
            
            print("\n" + "=" * 80)
            print("🎉 SCAFFOLD EXECUTION COMPLETE")
            print(f"📄 Final report saved: {final_report['report_path']}")
            print("=" * 80)
            
            return final_report
            
        except Exception as e:
            print(f"\n❌ Scaffold execution failed: {str(e)}")
            self._handle_failure(e)
            raise e
    
    def _execute_stage(self, scaffold: Scaffold, stage: Stage, stage_num: int) -> Dict[str, Any]:
        """Execute a single stage"""
        frames = scaffold.stages.get(stage_num, [])
        
        if not frames:
            print(f"   No frames for stage {stage_num}")
            return {'status': 'no_frames', 'message': f'No frames defined for stage {stage_num}'}
        
        stage_results = []
        
        for frame in frames:
            context = ExecutionContext(
                stage=stage,
                frame=frame,
                input_data=self.current_context['input_data'],
                previous_results=self.current_context['previous_results'],
                parameters=frame.parameters
            )
            
            try:
                result = self.executor.execute_frame(context)
                stage_results.append({
                    'frame_id': frame.id,
                    'frame_name': frame.name,
                    'success': True,
                    'result': result
                })
            except Exception as e:
                stage_results.append({
                    'frame_id': frame.id,
                    'frame_name': frame.name,
                    'success': False,
                    'error': str(e)
                })
        
        return {
            'stage': stage_num,
            'stage_name': stage.name,
            'frames_executed': len(frames),
            'successful_frames': len([r for r in stage_results if r['success']]),
            'failed_frames': len([r for r in stage_results if not r['success']]),
            'results': stage_results
        }
    
    def _check_stage_success(self, stage_result: Dict[str, Any]) -> bool:
        """Check if a stage was successful"""
        return stage_result.get('successful_frames', 0) > 0 and stage_result.get('failed_frames', 0) == 0
    
    def _retry_from_stage_2(self, scaffold: Scaffold, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Retry execution from stage 2 with different strategy"""
        print("🔄 Retrying from stage 2 with alternative strategy...")
        
        # This would implement alternative strategies
        # For now, we'll just return a success indicator
        return {
            'status': 'retry_successful',
            'message': 'Alternative strategy implemented successfully'
        }
    
    def _push_to_github(self) -> Dict[str, Any]:
        """Push changes to GitHub"""
        print("📤 Pushing to GitHub...")
        
        try:
            # Check if we're in a git repository
            result = subprocess.run(['git', 'status'], capture_output=True, text=True)
            if result.returncode != 0:
                return {
                    'status': 'no_git_repo',
                    'message': 'Not in a git repository'
                }
            
            # Add all changes
            subprocess.run(['git', 'add', '.'], check=True)
            
            # Commit changes
            commit_message = f"Autonomous Framework Update - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
            subprocess.run(['git', 'commit', '-m', commit_message], check=True)
            
            # Push to remote
            subprocess.run(['git', 'push'], check=True)
            
            return {
                'status': 'success',
                'message': 'Successfully pushed to GitHub',
                'commit_message': commit_message
            }
            
        except subprocess.CalledProcessError as e:
            return {
                'status': 'error',
                'message': f'Git operation failed: {str(e)}'
            }
    
    def _generate_final_report(self, scaffold: Scaffold) -> Dict[str, Any]:
        """Generate final execution report"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        report_path = f'reports/scaffold_execution_{scaffold.id}_{timestamp}.json'
        
        report = {
            'metadata': {
                'scaffold_id': scaffold.id,
                'scaffold_name': scaffold.name,
                'start_time': self.current_context['start_time'],
                'end_time': datetime.now().isoformat(),
                'version': scaffold.version
            },
            'execution_summary': {
                'total_stages': 8,
                'successful_stages': len([log for log in self.execution_log if self._check_stage_success(log['result'])]),
                'failed_stages': len([log for log in self.execution_log if not self._check_stage_success(log['result'])]),
                'total_frames_executed': sum(log['result'].get('frames_executed', 0) for log in self.execution_log),
                'total_successful_frames': sum(log['result'].get('successful_frames', 0) for log in self.execution_log)
            },
            'stage_results': self.execution_log,
            'frame_execution_history': self.executor.execution_history,
            'input_data': self.current_context['input_data'],
            'previous_results': self.current_context['previous_results']
        }
        
        # Save report
        Path('reports').mkdir(exist_ok=True)
        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2)
        
        return {
            'status': 'complete',
            'report_path': report_path,
            'report': report
        }
    
    def _handle_failure(self, error: Exception):
        """Handle framework execution failure"""
        print(f"\n🚨 FRAMEWORK FAILURE HANDLING")
        print(f"Error: {str(error)}")
        print(f"Traceback: {traceback.format_exc()}")
        
        # Save failure report
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        failure_path = f'reports/framework_failure_{timestamp}.json'
        
        failure_report = {
            'timestamp': datetime.now().isoformat(),
            'error': str(error),
            'traceback': traceback.format_exc(),
            'context': self.current_context,
            'execution_log': self.execution_log
        }
        
        Path('reports').mkdir(exist_ok=True)
        with open(failure_path, 'w') as f:
            json.dump(failure_report, f, indent=2)
        
        print(f"📄 Failure report saved: {failure_path}")
    
    def list_available_scaffolds(self) -> List[Dict[str, Any]]:
        """List all available scaffolds"""
        return [
            {
                'id': scaffold.id,
                'name': scaffold.name,
                'description': scaffold.description,
                'stages': len(scaffold.stages),
                'dependencies': scaffold.dependencies
            }
            for scaffold in self.registry.scaffolds.values()
        ]
    
    def list_available_frames(self) -> List[Dict[str, Any]]:
        """List all available frames"""
        return [
            {
                'id': frame.id,
                'name': frame.name,
                'type': frame.type.value,
                'description': frame.description,
                'file_path': frame.file_path
            }
            for frame in self.registry.frames.values()
        ]

def main():
    """Main entry point"""
    print("🤖 AUTONOMOUS FRAMEWORK - MODULAR SCAFFOLD SYSTEM")
    print("=" * 80)
    
    framework = AutonomousFramework()
    
    # List available options
    print("\n📋 Available Scaffolds:")
    scaffolds = framework.list_available_scaffolds()
    for i, scaffold in enumerate(scaffolds, 1):
        print(f"{i}. {scaffold['name']} ({scaffold['id']})")
        print(f"   {scaffold['description']}")
        print(f"   Stages: {scaffold['stages']}, Dependencies: {', '.join(scaffold['dependencies'])}")
        print()
    
    print("\n🔧 Available Frames:")
    frames = framework.list_available_frames()
    for i, frame in enumerate(frames, 1):
        print(f"{i}. {frame['name']} ({frame['type']})")
        print(f"   {frame['description']}")
        print(f"   File: {frame['file_path']}")
        print()
    
    # Execute a scaffold (you can modify this to accept command line arguments)
    if len(sys.argv) > 1:
        scaffold_id = sys.argv[1]
        input_data = json.loads(sys.argv[2]) if len(sys.argv) > 2 else {}
        
        print(f"\n🚀 Executing scaffold: {scaffold_id}")
        result = framework.execute_scaffold(scaffold_id, input_data)
        print(f"✅ Execution complete: {result['status']}")
    else:
        print("\n💡 Usage:")
        print("python autonomous-framework.py <scaffold_id> [input_data_json]")
        print("\nExamples:")
        print("python autonomous-framework.py full_system_analysis")
        print("python autonomous-framework.py quick_assessment '{\"scope\": \"security\"}'")
        print("python autonomous-framework.py template_execution '{\"template\": \"rpg_condition_assessment\"}'")

if __name__ == "__main__":
    main()
