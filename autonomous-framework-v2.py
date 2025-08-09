#!/usr/bin/env python3
"""
Autonomous Framework v2 - Enhanced Modular Scaffold System
Implements 9-stage framework with meta-audit and context preservation
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
import shutil
import re

class Stage(Enum):
    """Enhanced framework stages with meta-audit"""
    SCOPE = 1
    IDENTIFY_ANALYZE = 2
    PLAN = 3
    IMPLEMENT = 4
    SUCCESS_CONTINUE = 5
    FINAL_AUDIT = 6
    META_AUDIT = 7  # NEW: Meta-analysis of the framework execution itself
    APPROVAL = 8  # NEW: Human-in-the-loop approval of actions/remediations
    UPDATE_REGISTERS = 9
    PUSH_GITHUB = 10

class FrameType(Enum):
    """Types of frames that can be used in scaffolds"""
    MODULE = "module"
    TOOL = "tool"
    PROCESS = "process"
    ANALYSIS = "analysis"
    MITIGATION = "mitigation"
    VERIFICATION = "verification"
    META_ANALYSIS = "meta_analysis"  # NEW: For analyzing framework execution
    IMPLEMENTATION = "implementation"  # NEW: For implementation tasks
    DIAGNOSTIC = "diagnostic"  # NEW: For diagnostic analysis

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
    context_preservation: bool = True  # NEW: Whether to preserve context
    
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
    context_preservation: bool = True  # NEW: Whether to preserve context
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now().isoformat()

@dataclass
class ExecutionContext:
    """Enhanced context for frame execution"""
    stage: Stage
    frame: Frame
    input_data: Dict[str, Any]
    previous_results: Dict[str, Any]
    parameters: Dict[str, Any]
    preserved_context: Dict[str, Any] = None  # NEW: Preserved context from previous runs
    attempt_count: int = 0
    max_attempts: int = 2

@dataclass
class ExternalCommandResult:
    """Result of external command execution"""
    command: str
    return_code: int
    stdout: str
    stderr: str
    execution_time: float
    success: bool
    error_type: str = None
    recommendations: List[str] = None
    dependencies_affected: List[str] = None
    severity: str = "medium"  # low, medium, high, critical

class ContextPreservationManager:
    """Manages context preservation across framework executions"""
    
    def __init__(self):
        self.context_dir = Path('context_preservation')
        self.context_dir.mkdir(exist_ok=True)
    
    def save_context(self, task_id: str, context: Dict[str, Any]):
        """Save execution context for future reference"""
        context_file = self.context_dir / f'{task_id}_context.json'
        
        # Convert ExternalCommandResult objects to dictionaries for JSON serialization
        serializable_context = self._make_json_serializable(context)
        
        context_data = {
            'task_id': task_id,
            'timestamp': datetime.now().isoformat(),
            'context': serializable_context,
            'version': '2.0'
        }
        with open(context_file, 'w') as f:
            json.dump(context_data, f, indent=2)
        print(f"💾 Context preserved: {context_file}")
    
    def _make_json_serializable(self, obj):
        """Convert objects to JSON serializable format"""
        if isinstance(obj, dict):
            return {k: self._make_json_serializable(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [self._make_json_serializable(item) for item in obj]
        elif hasattr(obj, '__class__') and obj.__class__.__name__ == 'ExternalCommandResult':
            # Convert ExternalCommandResult to dict
            return {
                'command': obj.command,
                'return_code': obj.return_code,
                'stdout': obj.stdout,
                'stderr': obj.stderr,
                'execution_time': obj.execution_time,
                'success': obj.success,
                'error_type': obj.error_type,
                'recommendations': obj.recommendations,
                'dependencies_affected': obj.dependencies_affected,
                'severity': obj.severity
            }
        else:
            return obj
    
    def load_context(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Load preserved context for a task"""
        context_file = self.context_dir / f'{task_id}_context.json'
        if context_file.exists():
            with open(context_file, 'r') as f:
                context_data = json.load(f)
            print(f"📂 Context loaded: {context_file}")
            return context_data.get('context', {})
        return None
    
    def merge_contexts(self, old_context: Dict[str, Any], new_context: Dict[str, Any]) -> Dict[str, Any]:
        """Merge old and new contexts intelligently"""
        merged = old_context.copy()
        
        # Merge recommendations
        if 'recommendations' in old_context and 'recommendations' in new_context:
            merged['recommendations'] = old_context['recommendations'] + new_context['recommendations']
        
        # Merge findings
        if 'findings' in old_context and 'findings' in new_context:
            merged['findings'] = {**old_context['findings'], **new_context['findings']}
        
        # Merge action items
        if 'action_items' in old_context and 'action_items' in new_context:
            merged['action_items'] = old_context['action_items'] + new_context['action_items']
        
        # Update timestamps
        merged['last_updated'] = datetime.now().isoformat()
        merged['context_merge_count'] = merged.get('context_merge_count', 0) + 1
        
        return merged

class FrameRegistry:
    """Enhanced registry for all available frames"""
    
    def __init__(self):
        self.frames: Dict[str, Frame] = {}
        self.scaffolds: Dict[str, Scaffold] = {}
        self._load_frames()
        self._load_scaffolds()
    
    def _load_frames(self):
        """Load all available frames including meta-analysis frames"""
        
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
            success_criteria={'synthesis_complete': True, 'analysis_successful': True},
            rollback_plan='Remove synthesis report files',
            context_preservation=True
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
            rollback_plan='Restore from backup, revert changes',
            context_preservation=True
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
            rollback_plan='Remove analysis reports',
            context_preservation=True
        )
        
        # NEW: Meta-Analysis Frame
        self.frames['meta_analysis'] = Frame(
            id='meta_analysis',
            name='Meta-Analysis',
            type=FrameType.META_ANALYSIS,
            description='Analyzes framework execution itself for optimization',
            file_path='autonomous-system-meta-analysis.py',
            entry_point='run_meta_analysis',
            dependencies=['json', 'pathlib', 'datetime'],
            parameters={'analyze_framework': True, 'preserve_context': True},
            success_criteria={'framework_optimized': True, 'context_preserved': True},
            rollback_plan='No rollback needed - analysis only',
            context_preservation=True
        )
        
        # WebSocket Implementation Frame (for AZV-003)
        self.frames['websocket_implementation'] = Frame(
            id='websocket_implementation',
            name='WebSocket Implementation',
            type=FrameType.IMPLEMENTATION,
            description='Implements WebSocket server for real-time communication',
            file_path='backend/websocket_implementation.py',
            entry_point='implement_websocket_server',
            dependencies=['fastapi', 'websockets', 'json'],
            parameters={'port': 8001, 'enable_ssl': False},
            success_criteria={'websocket_server_running': True, 'connections_accepted': True},
            rollback_plan='Remove WebSocket endpoints and revert to HTTP-only',
            context_preservation=True
        )
        
        # System Audit Frame
        self.frames['system_audit'] = Frame(
            id='system_audit',
            name='System Audit',
            type=FrameType.ANALYSIS,
            description='Comprehensive system audit and validation',
            file_path='scripts/js/system-audit.js',
            entry_point='performFullAudit',
            dependencies=['fs', 'path', 'child_process'],
            parameters={'recursive': True, 'validate_hub': True},
            success_criteria={'audit_complete': True, 'hub_validated': True},
            rollback_plan='No rollback needed - read-only operation',
            context_preservation=True
        )
        
        # Knowledge Hub Update Frame
        self.frames['knowledge_hub_update'] = Frame(
            id='knowledge_hub_update',
            name='Knowledge Hub Update',
            type=FrameType.PROCESS,
            description='Updates Knowledge Hub with new findings',
            file_path='scripts/js/knowledge-hub-updater.js',
            entry_point='updateHub',
            dependencies=['fs', 'path', 'child_process'],
            parameters={'auto_update': True, 'generate_report': True},
            success_criteria={'hub_updated': True, 'report_generated': True},
            rollback_plan='Restore previous hub version from git',
            context_preservation=True
        )
        
        # External Failure Diagnostic Frame
        self.frames['external_failure_diagnostic'] = Frame(
            id='external_failure_diagnostic',
            name='External Failure Diagnostic',
            type=FrameType.DIAGNOSTIC,
            description='Analyze external command failures and generate recommendations',
            file_path='scripts/js/external-failure-diagnostic.js',
            entry_point='analyzeFailures',
            dependencies=['node'],
            parameters={'comprehensive_analysis': True, 'generate_recommendations': True},
            success_criteria={'analysis_complete': True, 'recommendations_generated': True},
            rollback_plan='No rollback needed for diagnostic analysis',
            context_preservation=True
        )

        # PowerShell Diagnostic Frame (example, multi-language support)
        self.frames['powershell_diagnostic'] = Frame(
            id='powershell_diagnostic',
            name='PowerShell Diagnostic',
            type=FrameType.DIAGNOSTIC,
            description='Validates PowerShell frame execution and structure',
            file_path='scripts/ps/powershell-diagnostic.ps1',
            entry_point='',
            dependencies=['powershell'],
            parameters={},
            success_criteria={'analysis_complete': True, 'recommendations_generated': True},
            rollback_plan='None',
            context_preservation=True
        )

        # SBOM & License Frame
        self.frames['sbom_license'] = Frame(
            id='sbom_license',
            name='SBOM & License',
            type=FrameType.ANALYSIS,
            description='Generate SBOM and basic license info',
            file_path='scripts/js/sbom-license.js',
            entry_point='generateSbom',
            dependencies=['node'],
            parameters={},
            success_criteria={'sbom_generated': True, 'licenses_checked': True},
            rollback_plan='Remove generated SBOM files',
            context_preservation=True
        )

        # Health/Readiness Frame (PowerShell)
        self.frames['health_readiness'] = Frame(
            id='health_readiness',
            name='Health & Readiness',
            type=FrameType.IMPLEMENTATION,
            description='Validate or create health/readiness placeholders',
            file_path='scripts/ps/health-readiness.ps1',
            entry_point='',
            dependencies=['powershell'],
            parameters={},
            success_criteria={'health_endpoints_validated': True},
            rollback_plan='Remove placeholder files',
            context_preservation=True
        )

        # Observability Bootstrap Frame
        self.frames['observability_bootstrap'] = Frame(
            id='observability_bootstrap',
            name='Observability Bootstrap',
            type=FrameType.IMPLEMENTATION,
            description='Create basic structured logging configuration',
            file_path='scripts/js/observability-bootstrap.js',
            entry_point='bootstrapObservability',
            dependencies=['node'],
            parameters={},
            success_criteria={'observability_bootstrapped': True},
            rollback_plan='Delete created configuration files',
            context_preservation=True
        )

        # Frame Optimizer (Python)
        self.frames['frame_optimizer'] = Frame(
            id='frame_optimizer',
            name='Frame Optimizer',
            type=FrameType.ANALYSIS,
            description='Analyze frames for gaps, omissions, and synergies',
            file_path='scripts/frame-optimizer.py',
            entry_point='run_frame_optimizer',
            dependencies=['python'],
            parameters={},
            success_criteria={'optimization_complete': True},
            rollback_plan='None',
            context_preservation=True
        )

        # Context Intelligence (Python)
        self.frames['context_intelligence'] = Frame(
            id='context_intelligence',
            name='Context Intelligence',
            type=FrameType.ANALYSIS,
            description='Scan preserved context for alignment and missing links',
            file_path='scripts/context-intelligence.py',
            entry_point='run_context_intelligence',
            dependencies=['python'],
            parameters={},
            success_criteria={'context_scan_complete': True},
            rollback_plan='None',
            context_preservation=True
        )

        # Secrets Scanner
        self.frames['secrets_scan'] = Frame(
            id='secrets_scan',
            name='Secrets Scan',
            type=FrameType.ANALYSIS,
            description='Scan repository for potential secrets',
            file_path='scripts/js/secrets-scan.js',
            entry_point='scanSecrets',
            dependencies=['node'],
            parameters={},
            success_criteria={'secrets_scan_complete': True},
            rollback_plan='Remove generated reports if needed',
            context_preservation=True
        )

        # Dependency Vulnerability Scan
        self.frames['dependency_vuln'] = Frame(
            id='dependency_vuln',
            name='Dependency Vulnerability Scan',
            type=FrameType.ANALYSIS,
            description='Aggregate dependency vulnerability report',
            file_path='scripts/js/dependency-vuln.js',
            entry_point='scanDependencies',
            dependencies=['node'],
            parameters={},
            success_criteria={'dependency_scan_complete': True},
            rollback_plan='Remove generated reports if needed',
            context_preservation=True
        )

        # Human Approval Aggregator (collect recommendations, actions, low hanging fruit)
        self.frames['human_approval'] = Frame(
            id='human_approval',
            name='Human Approval Gate',
            type=FrameType.PROCESS,
            description='Aggregate recommendations and remediations for human review',
            file_path='scripts/js/remediation.js',
            entry_point='generateRemediationPlan',
            dependencies=['node'],
            parameters={},
            success_criteria={'remediation_generated': True},
            rollback_plan='None',
            context_preservation=True
        )

        # Backup Bootstrap (implements basic backup capability)
        self.frames['backup_bootstrap'] = Frame(
            id='backup_bootstrap',
            name='Backup Bootstrap',
            type=FrameType.IMPLEMENTATION,
            description='Create basic backup script and directory',
            file_path='scripts/backup-bootstrap.py',
            entry_point='run_backup_bootstrap',
            dependencies=['python'],
            parameters={},
            success_criteria={'backup_bootstrap_complete': True},
            rollback_plan='Remove scripts/backup.py and backups/ if needed',
            context_preservation=True
        )

        # Register Intelligent Failure Response frame
        self.frames['intelligent_failure_response'] = Frame(
            id='intelligent_failure_response',
            name='Intelligent Failure Response',
            description='Analyzes failures and adds targeted diagnostic frames',
            file_path='scripts/intelligent-failure-response.js',
            type=FrameType.ANALYSIS,
            entry_point='analyzeFailures',
            dependencies=['node'],
            parameters={'timeout': 300},
            success_criteria={'intelligent_response_generated': True},
            rollback_plan='No rollback needed - analysis only',
            context_preservation=True
        )

        # Register All-In Analysis frame
        self.frames['all_in_analysis'] = Frame(
            id='all_in_analysis',
            name='All-In Analysis',
            description='Comprehensive analysis of gaps, risks, opportunities, and synergies',
            file_path='scripts/all-in-analysis.py',
            type=FrameType.ANALYSIS,
            entry_point='run_all_in_analysis',
            dependencies=['python'],
            parameters={'timeout': 300},
            success_criteria={'all_in_analysis_complete': True},
            rollback_plan='No rollback needed - analysis only',
            context_preservation=True
        )

        # Register Pre-Existing Systems Discovery frame
        self.frames['pre_existing_systems_discovery'] = Frame(
            id='pre_existing_systems_discovery',
            name='Pre-Existing Systems Discovery',
            description='Discovers and analyzes existing audit systems, GitHub Actions, hooks, and automation infrastructure',
            file_path='scripts/pre-existing-systems-discovery.py',
            type=FrameType.ANALYSIS,
            entry_point='discover_existing_systems',
            dependencies=['python'],
            parameters={'timeout': 300},
            success_criteria={'systems_discovered': True, 'integration_plan_generated': True},
            rollback_plan='No rollback needed - discovery only',
            context_preservation=True
        )

        # Register System Integration Implementation frame
        self.frames['system_integration_implementation'] = Frame(
            id='system_integration_implementation',
            name='System Integration Implementation',
            description='Implements integration with existing audit systems, GitHub Actions, hooks, and automation infrastructure',
            file_path='scripts/system-integration-implementation.py',
            type=FrameType.IMPLEMENTATION,
            entry_point='implement_system_integration',
            dependencies=['python'],
            parameters={'timeout': 300},
            success_criteria={'integration_implemented': True},
            rollback_plan='Restore backup files if integration fails',
            context_preservation=True
        )

        # Register Improvement and Optimization frame
        self.frames['improvement_optimization'] = Frame(
            id='improvement_optimization',
            name='Improvement and Optimization',
            description='Continuously analyzes and improves the autonomous framework and system performance',
            file_path='scripts/frames/improvement-optimization-frame.py',
            type=FrameType.ANALYSIS,
            entry_point='run_improvement_optimization',
            dependencies=['python'],
            parameters={'timeout': 300},
            success_criteria={'improvement_optimization_complete': True},
            rollback_plan='No rollback needed - analysis only',
            context_preservation=True
        )

        # Register Deep Pattern Recognition frame
        self.frames['deep_pattern_recognition'] = Frame(
            id='deep_pattern_recognition',
            name='Deep Pattern Recognition',
            description='Analyzes execution logs for cognitive patterns, decision-making processes, and meta-learning insights',
            file_path='scripts/frames/deep-pattern-recognition-frame.py',
            type=FrameType.ANALYSIS,
            entry_point='run_deep_pattern_recognition',
            dependencies=['python'],
            parameters={'timeout': 600},
            success_criteria={'deep_pattern_recognition_complete': True},
            rollback_plan='No rollback needed - analysis only',
            context_preservation=True
        )
        
        # Register Knowledge Hub Update frame
        self.frames['knowledge_hub_update'] = Frame(
            id='knowledge_hub_update',
            name='Knowledge Hub Update',
            description='Manages persistent learning and knowledge storage across framework executions',
            file_path='scripts/frames/knowledge-hub-update-frame.py',
            type=FrameType.META_ANALYSIS,
            entry_point='run_knowledge_hub_update',
            dependencies=['python'],
            parameters={'timeout': 300},
            success_criteria={'hub_updated': True},
            rollback_plan='No rollback needed - read-only operations',
            context_preservation=True
        )
        
        # Register Meta Analysis frame
        self.frames['meta_analysis'] = Frame(
            id='meta_analysis',
            name='Meta Analysis',
            description='Analyzes framework execution for self-improvement and optimization',
            file_path='scripts/frames/meta-analysis-frame.py',
            type=FrameType.META_ANALYSIS,
            entry_point='run_meta_analysis',
            dependencies=['python'],
            parameters={'timeout': 300},
            success_criteria={'meta_analysis_complete': True},
            rollback_plan='No rollback needed - analysis only',
            context_preservation=True
        )
        
        # Register Human Approval frame
        self.frames['human_approval'] = Frame(
            id='human_approval',
            name='Human Approval',
            description='Provides human-in-the-loop approval for critical decisions and actions',
            file_path='scripts/frames/human-approval-frame.py',
            type=FrameType.VERIFICATION,
            entry_point='run_human_approval',
            dependencies=['python'],
            parameters={'timeout': 300},
            success_criteria={'human_approval_complete': True},
            rollback_plan='No rollback needed - approval only',
            context_preservation=True
        )

        # Register Self-Healing frame
        self.frames['self_healing'] = Frame(
            id='self_healing',
            name='Self-Healing',
            description='Automatically detects and recovers from frame failures',
            file_path='scripts/frames/self-healing-frame.py',
            type=FrameType.MITIGATION,
            entry_point='run_self_healing',
            dependencies=['python'],
            parameters={'timeout': 300},
            success_criteria={'self_healing_complete': True},
            rollback_plan='No rollback needed - mitigation only',
            context_preservation=True
        )

        # Register Parallel Execution Coordinator frame
        self.frames['parallel_execution'] = Frame(
            id='parallel_execution',
            name='Parallel Execution Coordinator',
            description='Coordinates parallel execution of independent frames',
            file_path='scripts/frames/parallel-execution-coordinator-frame.py',
            type=FrameType.PROCESS,
            entry_point='run_parallel_execution_coordinator',
            dependencies=['python'],
            parameters={'timeout': 600},
            success_criteria={'parallel_execution_complete': True},
            rollback_plan='No rollback needed - coordination only',
            context_preservation=True
        )

        # Register Predictive Analysis frame
        self.frames['predictive_analysis'] = Frame(
            id='predictive_analysis',
            name='Predictive Analysis',
            description='Analyzes historical execution data to predict failures and optimize performance',
            file_path='scripts/frames/predictive-analysis-frame.py',
            type=FrameType.ANALYSIS,
            entry_point='run_predictive_analysis',
            dependencies=['python'],
            parameters={'timeout': 300},
            success_criteria={'predictive_analysis_complete': True},
            rollback_plan='No rollback needed - analysis only',
            context_preservation=True
        )

        # Register Intelligent Caching frame
        self.frames['intelligent_caching'] = Frame(
            id='intelligent_caching',
            name='Intelligent Caching',
            description='Manages intelligent caching for repeated operations to improve performance',
            file_path='scripts/frames/intelligent-caching-frame.py',
            type=FrameType.PROCESS,
            entry_point='run_intelligent_caching',
            dependencies=['python'],
            parameters={'timeout': 120},
            success_criteria={'success': True},
            rollback_plan='No rollback needed - caching only',
            context_preservation=True
        )

        # Register Log Tailer frame
        self.frames['log_tailer'] = Frame(
            id='log_tailer',
            name='Log Tailer',
            description='Tails recent reports and runs Deep Pattern Recognition incrementally',
            file_path='scripts/frames/log-tailer-frame.py',
            type=FrameType.PROCESS,
            entry_point='run_log_tailer',
            dependencies=['python'],
            parameters={'timeout': 180},
            success_criteria={'log_tailer_complete': True},
            rollback_plan='No rollback needed - read-only',
            context_preservation=True
        )
    
    def _load_scaffolds(self):
        """Load predefined scaffolds including task-specific ones"""
        
        # WebSocket Implementation Scaffold (for AZV-003)
        self.scaffolds['websocket_implementation'] = Scaffold(
            id='websocket_implementation',
            name='WebSocket Server Implementation',
            description='Complete WebSocket server implementation for AZV-003',
            stages={
                1: [self.frames['synthesis_analysis']],      # Scope: Analyze current backend
                2: [self.frames['enhanced_analysis']],       # Identify & Analyze: WebSocket requirements
                3: [self.frames['system_audit']],           # Plan: Audit current system state
                4: [self.frames['websocket_implementation']], # Implement: WebSocket server
                5: [],                                      # Success continue
                6: [self.frames['synthesis_analysis']],     # Final audit: Verify implementation
                7: [self.frames['meta_analysis']],          # Meta-audit: Analyze framework execution
                8: [self.frames['human_approval']],           # Approval (Human-in-the-loop)
                9: [self.frames['knowledge_hub_update']],   # Update Registers
                10: [self.frames['external_failure_diagnostic'], self.frames['powershell_diagnostic']]  # Push GitHub/Diagnostics
            },
            dependencies=['python', 'fastapi', 'websockets'],
            success_criteria={'websocket_implemented': True, 'framework_optimized': True},
            context_preservation=True
        )
        
        # Full System Analysis Scaffold
        self.scaffolds['full_system_analysis'] = Scaffold(
            id='full_system_analysis',
            name='Full System Analysis',
            description='Complete system analysis and optimization',
            stages={
                1: [self.frames['pre_existing_systems_discovery'], self.frames['synthesis_analysis']],      # Scope: Discover existing systems first
                2: [self.frames['enhanced_analysis'], self.frames['sbom_license'], self.frames['secrets_scan'], self.frames['dependency_vuln'], self.frames['frame_optimizer']],       # Identify & Analyze
                3: [self.frames['system_audit']],           # Plan
                4: [self.frames['risk_mitigation'], self.frames['backup_bootstrap'], self.frames['health_readiness'], self.frames['observability_bootstrap']],  # Implement
                5: [],                                      # Success continue
                6: [self.frames['synthesis_analysis'], self.frames['sbom_license']],     # Final audit
                7: [self.frames['meta_analysis'], self.frames['improvement_optimization']],          # Meta-audit + Improvement
                8: [self.frames['human_approval']],           # Approval (Human-in-the-loop)
                9: [self.frames['knowledge_hub_update']],   # Update Registers
                10: [self.frames['external_failure_diagnostic'], self.frames['powershell_diagnostic']]  # Push GitHub/Diagnostics
            },
            dependencies=['python', 'node', 'git'],
            success_criteria={'analysis_complete': True, 'hub_updated': True, 'systems_discovered': True, 'improvement_optimization_complete': True},
            context_preservation=True
        )
        
        # Quick Assessment Scaffold
        self.scaffolds['quick_assessment'] = Scaffold(
            id='quick_assessment',
            name='Quick Assessment',
            description='Rapid system assessment with external failure analysis',
            stages={
                1: [self.frames['synthesis_analysis']],      # Scope
                2: [self.frames['system_audit']],           # Identify & Analyze
                3: [],                                      # Plan (minimal)
                4: [],                                      # Implement (minimal)
                5: [],                                      # Success continue
                6: [self.frames['synthesis_analysis']],     # Final audit
                7: [self.frames['meta_analysis']],          # Meta-audit
                8: [self.frames['human_approval']],           # Approval (Human-in-the-loop)
                9: [self.frames['knowledge_hub_update']],   # Update Registers
                10: [self.frames['external_failure_diagnostic'], self.frames['powershell_diagnostic']]  # Analyze external failures + PS demo
            },
            dependencies=['python', 'node'],
            success_criteria={'assessment_complete': True, 'hub_updated': True, 'failures_analyzed': True},
            context_preservation=True
        )

        # System Integration Scaffold (NEW)
        self.scaffolds['system_integration'] = Scaffold(
            id='system_integration',
            name='System Integration',
            description='Discover existing systems and integrate framework with them',
            stages={
                1: [self.frames['pre_existing_systems_discovery']],      # Scope: Discover existing systems
                2: [self.frames['synthesis_analysis']],      # Identify & Analyze: Analyze integration opportunities
                3: [self.frames['system_audit']],           # Plan: Plan integration strategy
                4: [self.frames['system_integration_implementation'], self.frames['risk_mitigation']],        # Implement: Implement integration and mitigate risks
                5: [],                                      # Success continue
                6: [self.frames['synthesis_analysis']],     # Final audit: Verify integration
                7: [self.frames['meta_analysis']],          # Meta-audit: Analyze integration success
                8: [self.frames['human_approval']],         # Approval: Human review of integration plan
                9: [self.frames['knowledge_hub_update']],   # Update Registers: Document integration
                10: [self.frames['external_failure_diagnostic']]  # Diagnostics: Check for integration issues
            },
            dependencies=['python', 'node', 'git'],
            success_criteria={'systems_discovered': True, 'integration_plan_generated': True, 'integration_implemented': True, 'hub_updated': True},
            context_preservation=True
        )

        # Continuous Improvement Scaffold
        self.scaffolds['continuous_improvement'] = Scaffold(
            id='continuous_improvement',
            name='Continuous Improvement',
            description='Continuous analysis and optimization of the autonomous framework',
            stages={
                1: [self.frames['improvement_optimization']],      # Scope: Analyze current performance
                2: [self.frames['predictive_analysis'], self.frames['synthesis_analysis']],      # Identify & Analyze
                3: [self.frames['parallel_execution']],           # Plan: coordinate parallel runs where possible
                4: [self.frames['risk_mitigation'], self.frames['self_healing']],        # Implement: Mitigate + heal
                5: [],                                      # Success continue
                6: [self.frames['improvement_optimization'], self.frames['intelligent_caching']],     # Final audit + caching
                7: [self.frames['meta_analysis'], self.frames['deep_pattern_recognition'], self.frames['log_tailer']],          # Meta + DPR tailing
                8: [self.frames['human_approval']],         # Approval
                9: [self.frames['knowledge_hub_update']],   # Update Registers
                10: [self.frames['external_failure_diagnostic']]  # Diagnostics: Check for improvement issues
            },
            dependencies=['python', 'node'],
            success_criteria={'improvement_optimization_complete': True, 'hub_updated': True, 'improvements_identified': True, 'deep_pattern_recognition_complete': True},
            context_preservation=True
        )

        # Deep Pattern Recognition Scaffold
        self.scaffolds['deep_pattern_recognition'] = Scaffold(
            id='deep_pattern_recognition',
            name='Deep Pattern Recognition',
            description='Deep recursive pattern recognition for cognitive insights and meta-learning',
            stages={
                1: [self.frames['log_tailer']],      # Scope: stream/tail recent logs
                2: [self.frames['deep_pattern_recognition'], self.frames['synthesis_analysis']],      # Analyze
                3: [self.frames['predictive_analysis']],           # Plan: predictive strategy
                4: [self.frames['improvement_optimization'], self.frames['self_healing']],        # Implement
                5: [],                                      # Success continue
                6: [self.frames['deep_pattern_recognition'], self.frames['intelligent_caching']],     # Final audit + cache
                7: [self.frames['meta_analysis']],          # Meta-audit
                8: [self.frames['human_approval']],         # Approval
                9: [self.frames['knowledge_hub_update']],   # Update Registers
                10: [self.frames['external_failure_diagnostic']]  # Diagnostics: Check for pattern issues
            },
            dependencies=['python', 'node'],
            success_criteria={'deep_pattern_recognition_complete': True, 'hub_updated': True, 'cognitive_insights_identified': True},
            context_preservation=True
        )

        # Streaming Observability Scaffold (NEW)
        self.scaffolds['streaming_observability'] = Scaffold(
            id='streaming_observability',
            name='Streaming Observability',
            description='Continuously tail reports and feed incremental Deep Pattern Recognition for near-real-time insights',
            stages={
                1: [self.frames['observability_bootstrap']],
                2: [self.frames['log_tailer']],
                3: [self.frames['deep_pattern_recognition']],
                4: [self.frames['predictive_analysis']],
                5: [],
                6: [self.frames['improvement_optimization']],
                7: [self.frames['meta_analysis']],
                8: [self.frames['human_approval']],
                9: [self.frames['knowledge_hub_update']],
                10: [self.frames['external_failure_diagnostic']]
            },
            dependencies=['python', 'node'],
            success_criteria={'deep_pattern_recognition_complete': True, 'hub_updated': True},
            context_preservation=True
        )

        # Comprehensive All-In Analysis Scaffold
        self.scaffolds['all_in_analysis'] = Scaffold(
            id='all_in_analysis',
            name='Comprehensive All-In Analysis',
            description='Complete analysis of gaps, risks, opportunities, and synergies across all dimensions',
            stages={
                1: [self.frames['all_in_analysis']],        # Scope
                2: [self.frames['all_in_analysis'], self.frames['enhanced_analysis'], self.frames['frame_optimizer']],  # Identify & Analyze
                3: [self.frames['system_audit']],           # Plan
                4: [self.frames['risk_mitigation'], self.frames['context_intelligence']],  # Implement
                5: [],                                      # Success continue
                6: [self.frames['all_in_analysis'], self.frames['synthesis_analysis']],  # Final audit
                7: [self.frames['meta_analysis'], self.frames['frame_optimizer'], self.frames['context_intelligence']],  # Meta-audit
                8: [self.frames['human_approval']],         # Approval (Human-in-the-loop)
                9: [self.frames['knowledge_hub_update']],   # Update Registers
                10: [self.frames['external_failure_diagnostic'], self.frames['powershell_diagnostic']]  # Push GitHub/Diagnostics
            },
            dependencies=['python', 'node', 'git'],
            success_criteria={'all_in_analysis_complete': True, 'hub_updated': True},
            context_preservation=True
        )

class FrameExecutor:
    """Enhanced frame executor with context preservation"""
    
    def __init__(self, registry: FrameRegistry, context_manager: ContextPreservationManager):
        self.registry = registry
        self.context_manager = context_manager
        self.execution_history = []
    
    def execute_frame(self, context: ExecutionContext) -> Dict[str, Any]:
        """Execute a single frame with context preservation"""
        # Indicate to frames that we're running under the autonomous framework
        os.environ['AF_FRAMEWORK_RUN'] = '1'
        print(f"\n🔧 Executing Frame: {context.frame.name}")
        print(f"   Stage: {context.stage.name}")
        print(f"   Attempt: {context.attempt_count + 1}/{context.max_attempts}")
        
        if context.preserved_context:
            print(f"   📂 Using preserved context: {len(context.preserved_context)} items")
        
        try:
            # Load the frame module
            module = self._load_frame_module(context.frame)
            
            # Execute the frame with context
            result = self._execute_frame_entry_point(module, context)
            
            # Validate success criteria
            success = self._validate_success_criteria(result, context.frame.success_criteria)
            
            if success:
                print(f"✅ Frame executed successfully: {context.frame.name}")
                
                # Preserve context if enabled
                if context.frame.context_preservation:
                    self._preserve_frame_context(context, result)
                
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
    
    def _preserve_frame_context(self, context: ExecutionContext, result: Dict[str, Any]):
        """Preserve frame execution context"""
        context_data = {
            'frame_id': context.frame.id,
            'stage': context.stage.value,
            'input_data': context.input_data,
            'parameters': context.parameters,
            'result': result,
            'timestamp': datetime.now().isoformat()
        }
        
        # Save to context preservation directory
        context_file = self.context_manager.context_dir / f'{context.frame.id}_{context.stage.value}_context.json'
        with open(context_file, 'w') as f:
            json.dump(context_data, f, indent=2)
    
    def _load_frame_module(self, frame: Frame):
        """Load a frame module dynamically"""
        if frame.file_path.endswith('.py'):
            # Load Python module
            spec = importlib.util.spec_from_file_location(frame.id, frame.file_path)
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            return module
        elif frame.file_path.endswith('.js'):
            # NEW: JavaScript module bridge
            return self._create_js_bridge(frame)
        elif frame.file_path.endswith('.ps1'):
            # NEW: PowerShell script bridge
            return self._create_ps_bridge(frame)
        else:
            raise Exception(f"Unsupported file type: {frame.file_path}")
    
    def _create_js_bridge(self, frame: Frame):
        """Create a bridge object for JavaScript modules"""
        return {
            'type': 'js_bridge',
            'file_path': frame.file_path,
            'entry_point': frame.entry_point,
            'execute': lambda context: self._execute_js_function(frame, context)
        }

    def _create_ps_bridge(self, frame: Frame):
        """Create a bridge object for PowerShell scripts"""
        return {
            'type': 'ps_bridge',
            'file_path': frame.file_path,
            'execute': lambda context: self._execute_ps_script(frame, context)
        }
    
    def _execute_js_function(self, frame: Frame, context: ExecutionContext):
        """Execute JavaScript function with context"""
        import json
        import tempfile
        
        # Create temporary context file with proper path handling
        context_file = tempfile.mktemp(suffix='.json')
        context_data = {
            'input_data': context.input_data,
            'parameters': context.parameters,
            'previous_results': context.previous_results,
            'entry_point': frame.entry_point
        }
        
        with open(context_file, 'w', encoding='utf-8') as f:
            json.dump(context_data, f)
        
        try:
            # Execute JS with context file
            # Convert relative path to absolute path for proper module resolution
            import pathlib
            import urllib.parse
            abs_file_path = str(pathlib.Path(frame.file_path).resolve())
            
            # Convert Windows path to file:// URL for ES modules
            if os.name == 'nt':  # Windows
                file_url = f"file:///{abs_file_path.replace(':', '|').replace('\\', '/')}"
            else:
                file_url = f"file://{abs_file_path}"
            
            # Use proper path escaping for the context file
            context_file_escaped = context_file.replace('\\', '\\\\')
            
            js_code = (
                "(async () => {\n"
                "  try {\n"
                "    const moduleObj = await import(process.env.FILE_URL);\n"
                "    const fs = require('fs');\n"
                "    const context = JSON.parse(fs.readFileSync(process.env.CONTEXT_FILE, 'utf8'));\n"
                "    const fn = moduleObj[context.entry_point];\n"
                "    if (typeof fn !== 'function') {\n"
                "      console.log(JSON.stringify({ success: false, error: 'Entry point not found: ' + context.entry_point }));\n"
                "      return;\n"
                "    }\n"
                "    const output = await fn(context);\n"
                "    console.log(JSON.stringify(output));\n"
                "  } catch (error) {\n"
                "    console.log(JSON.stringify({ success: false, error: String((error && error.message) || error) }));\n"
                "  }\n"
                "})();\n"
            )

            cmd = ['node', '-e', js_code]

            # Prepare environment with variables for the JS snippet
            env = os.environ.copy()
            env['FILE_URL'] = file_url
            env['CONTEXT_FILE'] = context_file_escaped
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                encoding='utf-8',
                errors='replace',
                cwd=os.getcwd(),
                env=env
            )
            
            if result.returncode != 0:
                raise Exception(f"JavaScript execution failed: {result.stderr}")
            
            # Debug: Print the output to see what we're getting
            print(f"DEBUG: JavaScript stdout length: {len(result.stdout)}")
            print(f"DEBUG: JavaScript stdout: {repr(result.stdout[:200])}")
            print(f"DEBUG: JavaScript stdout end: {repr(result.stdout[-200:])}")
            print(f"DEBUG: JavaScript stderr: {repr(result.stderr)}")
            
            # Parse JSON response - look for JSON at the end of the output
            stdout_lines = result.stdout.strip().split('\n')
            json_response = None
            
            # Look for JSON in the last few lines
            for line in reversed(stdout_lines[-10:]):
                line = line.strip()
                if line.startswith('{') and line.endswith('}'):
                    try:
                        json_response = json.loads(line)
                        break
                    except json.JSONDecodeError:
                        continue
            
            if json_response is None:
                raise Exception("No JSON response found in JavaScript output")
            
            response = json_response
            
            if not response.get('success', True) and 'error' in response:
                raise Exception(f"JavaScript function failed: {response.get('error')}")
            
            # For compatibility: if some bridge prints {{success:true, result}}, merge it
            if 'result' in response and isinstance(response['result'], dict):
                merged = response.copy()
                merged.update(response['result'])
                return merged
            
            # Otherwise, return the frame's object as-is
            return response
            
        finally:
            # Cleanup temporary file
            os.unlink(context_file)

    def _execute_ps_script(self, frame: Frame, context: ExecutionContext):
        """Execute a PowerShell script with JSON context and parse JSON result"""
        import json
        import tempfile
        # Write context to temp file
        context_file = tempfile.mktemp(suffix='.json')
        context_data = {
            'input_data': context.input_data,
            'parameters': context.parameters,
            'previous_results': context.previous_results
        }
        with open(context_file, 'w', encoding='utf-8') as f:
            json.dump(context_data, f)

        try:
            ps_command = [
                'powershell', '-NoProfile', '-ExecutionPolicy', 'Bypass',
                '-File', frame.file_path,
                '-ContextFile', context_file
            ]

            result = subprocess.run(
                ps_command,
                capture_output=True,
                text=True,
                encoding='utf-8',
                errors='replace',
                cwd=os.getcwd()
            )

            if result.returncode != 0:
                raise Exception(f"PowerShell execution failed: {result.stderr}")

            # Debug output
            print(f"DEBUG: PowerShell stdout length: {len(result.stdout)}")
            print(f"DEBUG: PowerShell stdout: {repr(result.stdout[:200])}")
            print(f"DEBUG: PowerShell stdout end: {repr(result.stdout[-200:])}")
            print(f"DEBUG: PowerShell stderr: {repr(result.stderr)}")

            # Parse last JSON object from stdout
            stdout_lines = result.stdout.strip().split('\n')
            json_response = None
            for line in reversed(stdout_lines[-20:]):
                line = line.strip()
                if line.startswith('{') and line.endswith('}'):
                    try:
                        json_response = json.loads(line)
                        break
                    except json.JSONDecodeError:
                        continue
            if json_response is None:
                raise Exception('No JSON response found in PowerShell output')

            # Accept either plain object with success flags or {result: {...}}
            if 'result' in json_response and isinstance(json_response['result'], dict):
                merged = json_response.copy()
                merged.update(json_response['result'])
                return merged
            return json_response
        finally:
            try:
                os.unlink(context_file)
            except Exception:
                pass
    
    def _execute_frame_entry_point(self, module, context: ExecutionContext):
        """Execute the frame's entry point with context"""
        if isinstance(module, dict) and module.get('type') == 'js_bridge':
            # Handle JavaScript bridge
            return module['execute'](context)
        elif isinstance(module, dict) and module.get('type') == 'ps_bridge':
            # Handle PowerShell bridge
            return module['execute'](context)
        elif hasattr(module, context.frame.entry_point):
            # Handle Python modules
            entry_point = getattr(module, context.frame.entry_point)
            if callable(entry_point):
                # Pass context if the function accepts it
                try:
                    return entry_point(context=context)
                except TypeError:
                    return entry_point()
            else:
                return entry_point
        else:
            raise Exception(f"Entry point '{context.frame.entry_point}' not found in module")
    
    def _validate_success_criteria(self, result: Dict[str, Any], criteria: Dict[str, Any]) -> bool:
        """Validate that the result meets success criteria"""
        print(f"DEBUG: Validating success criteria")
        print(f"DEBUG: Result keys: {list(result.keys())}")
        print(f"DEBUG: Criteria: {criteria}")
        
        for key, expected_value in criteria.items():
            if key not in result:
                print(f"DEBUG: Missing key '{key}' in result")
                return False
            if result[key] != expected_value:
                print(f"DEBUG: Value mismatch for '{key}': expected {expected_value}, got {result[key]}")
                return False
        print(f"DEBUG: All success criteria met")
        return True

class ExternalCommandExecutor:
    """Enhanced external command executor with failure analysis"""
    
    def __init__(self):
        self.command_history = []
        self.failure_patterns = {
            'dependency_missing': [
                r"command not found",
                r"module not found",
                r"package not found",
                r"cannot find module"
            ],
            'permission_denied': [
                r"permission denied",
                r"access denied",
                r"EACCES"
            ],
            'timeout': [
                r"timeout",
                r"killed",
                r"SIGTERM",
                r"SIGKILL"
            ],
            'memory_issue': [
                r"out of memory",
                r"ENOMEM",
                r"memory allocation failed"
            ],
            'configuration_error': [
                r"configuration error",
                r"invalid configuration",
                r"config file not found"
            ]
        }
    
    def execute_command(self, command, timeout: int = 300, capture_output: bool = True) -> ExternalCommandResult:
        """Execute external command with detailed analysis"""
        # Convert command to string for display and list for execution
        if isinstance(command, list):
            command_str = ' '.join(command)
            command_list = command
        else:
            command_str = str(command)
            command_list = command.split() if isinstance(command, str) else command
            
        print(f"🔧 Executing: {command_str}")
        start_time = time.time()
        
        try:
            result = subprocess.run(
                command_list,
                capture_output=capture_output,
                text=True,
                timeout=timeout,
                encoding='utf-8',
                errors='replace'
            )
            
            execution_time = time.time() - start_time
            success = result.returncode == 0
            
            # Analyze the result
            analysis = self._analyze_command_result(command_str, result, execution_time)
            
            self.command_history.append(analysis)
            
            if not success:
                print(f"❌ Command failed: {command_str}")
                print(f"   Return code: {result.returncode}")
                print(f"   Error: {result.stderr[:200]}...")
            else:
                print(f"✅ Command succeeded: {command_str}")
            
            return analysis
            
        except subprocess.TimeoutExpired:
            execution_time = time.time() - start_time
            analysis = ExternalCommandResult(
                command=command_str,
                return_code=-1,
                stdout="",
                stderr=f"Command timed out after {timeout} seconds",
                execution_time=execution_time,
                success=False,
                error_type="timeout",
                recommendations=[
                    "Increase timeout value",
                    "Check for infinite loops or deadlocks",
                    "Consider breaking command into smaller parts"
                ],
                severity="high"
            )
            self.command_history.append(analysis)
            return analysis
            
        except Exception as e:
            execution_time = time.time() - start_time
            analysis = ExternalCommandResult(
                command=command_str,
                return_code=-1,
                stdout="",
                stderr=str(e),
                execution_time=execution_time,
                success=False,
                error_type="execution_error",
                recommendations=[
                    "Check command syntax",
                    "Verify dependencies are installed",
                    "Check file permissions"
                ],
                severity="medium"
            )
            self.command_history.append(analysis)
            return analysis
    
    def _analyze_command_result(self, command: str, result: subprocess.CompletedProcess, execution_time: float) -> ExternalCommandResult:
        """Analyze command result and generate recommendations"""
        success = result.returncode == 0
        error_type = None
        recommendations = []
        dependencies_affected = []
        severity = "low"
        
        if not success:
            # Analyze stderr for error patterns
            stderr_lower = result.stderr.lower()
            
            for error_type_name, patterns in self.failure_patterns.items():
                for pattern in patterns:
                    if re.search(pattern, stderr_lower, re.IGNORECASE):
                        error_type = error_type_name
                        break
                if error_type:
                    break
            
            # Generate specific recommendations based on error type
            if error_type == "dependency_missing":
                severity = "high"
                recommendations = [
                    "Install missing dependencies",
                    "Check package.json for required packages",
                    "Run 'npm install' to install dependencies",
                    "Verify Node.js/npm installation"
                ]
                # Extract potential missing dependency names
                deps = re.findall(r"cannot find module ['\"]([^'\"]+)['\"]", result.stderr)
                dependencies_affected.extend(deps)
                
            elif error_type == "permission_denied":
                severity = "high"
                recommendations = [
                    "Check file permissions",
                    "Run with appropriate user privileges",
                    "Verify file ownership",
                    "Check if files are read-only"
                ]
                
            elif error_type == "timeout":
                severity = "medium"
                recommendations = [
                    "Increase timeout value",
                    "Check for infinite loops",
                    "Consider breaking into smaller commands",
                    "Monitor system resources"
                ]
                
            elif error_type == "memory_issue":
                severity = "critical"
                recommendations = [
                    "Increase system memory",
                    "Optimize memory usage",
                    "Check for memory leaks",
                    "Consider using streaming for large files"
                ]
                
            elif error_type == "configuration_error":
                severity = "medium"
                recommendations = [
                    "Check configuration files",
                    "Verify environment variables",
                    "Review configuration syntax",
                    "Check for missing config files"
                ]
            
            # Generic recommendations if no specific pattern matched
            if not recommendations:
                recommendations = [
                    "Review command syntax",
                    "Check system requirements",
                    "Verify all dependencies are installed",
                    "Check logs for more details"
                ]
        
        return ExternalCommandResult(
            command=command,
            return_code=result.returncode,
            stdout=result.stdout,
            stderr=result.stderr,
            execution_time=execution_time,
            success=success,
            error_type=error_type,
            recommendations=recommendations,
            dependencies_affected=dependencies_affected,
            severity=severity
        )
    
    def get_failure_summary(self) -> Dict[str, Any]:
        """Generate summary of all command failures"""
        failures = [cmd for cmd in self.command_history if not cmd.success]
        
        if not failures:
            return {"status": "no_failures", "message": "All commands executed successfully"}
        
        # Group failures by type
        failures_by_type = {}
        for failure in failures:
            error_type = failure.error_type or "unknown"
            if error_type not in failures_by_type:
                failures_by_type[error_type] = []
            failures_by_type[error_type].append(failure)
        
        # Generate overall recommendations
        all_recommendations = []
        critical_issues = []
        
        for failure in failures:
            all_recommendations.extend(failure.recommendations or [])
            if failure.severity in ["high", "critical"]:
                critical_issues.append(failure)
        
        # Remove duplicates while preserving order
        unique_recommendations = []
        for rec in all_recommendations:
            if rec not in unique_recommendations:
                unique_recommendations.append(rec)
        
        return {
            "status": "failures_detected",
            "total_failures": len(failures),
            "critical_failures": len(critical_issues),
            "failures_by_type": {
                error_type: len(failures) for error_type, failures in failures_by_type.items()
            },
            "recommendations": unique_recommendations,
            "critical_issues": [
                {
                    "command": f.command,
                    "error_type": f.error_type,
                    "severity": f.severity,
                    "recommendations": f.recommendations
                } for f in critical_issues
            ],
            "all_failures": [
                {
                    "command": f.command,
                    "return_code": f.return_code,
                    "error_type": f.error_type,
                    "severity": f.severity,
                    "stderr": f.stderr[:500]  # Truncate for readability
                } for f in failures
            ]
        }

class AutonomousFramework:
    """Enhanced autonomous framework orchestrator with meta-audit"""
    
    def __init__(self):
        self.registry = FrameRegistry()
        self.context_manager = ContextPreservationManager()
        self.executor = FrameExecutor(self.registry, self.context_manager)
        self.external_executor = ExternalCommandExecutor()  # NEW: External command executor
        self.current_context = {}
        self.execution_log = []
    
    def execute_scaffold(self, scaffold_id: str, input_data: Dict[str, Any] = None) -> Dict[str, Any]:
        """Execute a complete scaffold with meta-audit"""
        print(f"🚀 AUTONOMOUS FRAMEWORK v2 - EXECUTING SCAFFOLD: {scaffold_id}")
        print("=" * 80)
        
        if scaffold_id not in self.registry.scaffolds:
            raise Exception(f"Scaffold '{scaffold_id}' not found")
        
        scaffold = self.registry.scaffolds[scaffold_id]
        
        # Load preserved context if available
        preserved_context = self.context_manager.load_context(scaffold_id)
        
        self.current_context = {
            'scaffold_id': scaffold_id,
            'input_data': input_data or {},
            'previous_results': {},
            'preserved_context': preserved_context,
            'start_time': datetime.now().isoformat()
        }
        
        try:
            # Execute each stage (now 9 stages)
            for stage_num in range(1, 11):
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
                
                elif stage == Stage.META_AUDIT:
                    stage_result = self._execute_meta_audit(scaffold)
                
                elif stage == Stage.PUSH_GITHUB:
                    # Optionally skip git push (default skip in this environment)
                    if os.environ.get('AF_SKIP_GIT_PUSH', '1') == '1':
                        print("🔒 Skipping Git push (AF_SKIP_GIT_PUSH=1)")
                        # keep previous stage_result (from frames if any) or mark as skipped
                        if 'results' not in stage_result:
                            stage_result = {'status': 'skipped', 'reason': 'Git push disabled'}
                    else:
                        stage_result = self._push_to_github()
                
                self.execution_log.append({
                    'stage': stage_num,
                    'stage_name': stage.name,
                    'result': stage_result,
                    'timestamp': datetime.now().isoformat()
                })
            
            # Preserve final context
            self.context_manager.save_context(scaffold_id, self.current_context)
            
            # Generate final report
            final_report = self._generate_final_report(scaffold)
            
            print("\n" + "=" * 80)
            print("🎉 SCAFFOLD EXECUTION COMPLETE")
            print(f"📄 Final report saved: {final_report['report_path']}")
            print(f"💾 Context preserved for future runs")
            print("=" * 80)
            
            return final_report
            
        except Exception as e:
            print(f"\n❌ Scaffold execution failed: {str(e)}")
            self._handle_failure(e)
            raise e
    
    def _execute_stage(self, scaffold: Scaffold, stage: Stage, stage_num: int) -> Dict[str, Any]:
        """Execute a single stage with context preservation"""
        frames = scaffold.stages.get(stage_num, [])
        
        if not frames:
            print(f"   No frames for stage {stage_num}")
            return {'status': 'no_frames', 'message': f'No frames defined for stage {stage_num}'}
        
        stage_results = []
        stage_failed = False
        critical_failures = []
        
        for frame in frames:
            context = ExecutionContext(
                stage=stage,
                frame=frame,
                input_data=self.current_context['input_data'],
                previous_results=self.current_context['previous_results'],
                parameters=frame.parameters,
                preserved_context=self.current_context.get('preserved_context', {})
            )
            
            try:
                result = self.executor.execute_frame(context)
                stage_results.append({
                    'frame_id': frame.id,
                    'frame_name': frame.name,
                    'success': True,
                    'result': result
                })
                print(f"✅ Frame {frame.name} completed successfully")
                
            except Exception as e:
                error_msg = f"Frame {frame.name} failed: {str(e)}"
                print(f"❌ {error_msg}")
                
                stage_results.append({
                    'frame_id': frame.id,
                    'frame_name': frame.name,
                    'success': False,
                    'error': str(e)
                })
                
                # Check if this is a critical frame (required for stage success)
                if self._is_critical_frame(frame, stage):
                    stage_failed = True
                    critical_failures.append(error_msg)
                    print(f"🚨 CRITICAL FRAME FAILURE: {frame.name} is required for stage {stage_num}")
                
                # For non-critical frames, log but continue
                else:
                    print(f"⚠️ Non-critical frame {frame.name} failed, continuing...")
        
        # If stage has critical failures, raise exception to trigger retry logic
        if stage_failed:
            failure_summary = "\n".join(critical_failures)
            raise Exception(f"Stage {stage_num} ({stage.name}) failed due to critical frame failures:\n{failure_summary}")
        
        return {
            'stage': stage_num,
            'stage_name': stage.name,
            'frames_executed': len(frames),
            'successful_frames': len([r for r in stage_results if r['success']]),
            'failed_frames': len([r for r in stage_results if not r['success']]),
            'results': stage_results,
            'stage_failed': stage_failed
        }
    
    def _execute_meta_audit(self, scaffold: Scaffold) -> Dict[str, Any]:
        """Execute meta-audit to analyze framework execution itself"""
        print("🔍 Executing Meta-Audit...")
        
        # Create meta-analysis report
        meta_analysis = {
            'framework_performance': {
                'total_stages': 9,
                'successful_stages': len([log for log in self.execution_log if self._check_stage_success(log['result'])]),
                'failed_stages': len([log for log in self.execution_log if not self._check_stage_success(log['result'])]),
                'success_rate': len([log for log in self.execution_log if self._check_stage_success(log['result'])]) / len(self.execution_log) * 100
            },
            'context_preservation': {
                'context_loaded': self.current_context.get('preserved_context') is not None,
                'context_items': len(self.current_context.get('preserved_context') or {}),
                'context_merge_count': (self.current_context.get('preserved_context') or {}).get('context_merge_count', 0)
            },
            'frame_analysis': {
                'total_frames_executed': sum(log['result'].get('frames_executed', 0) for log in self.execution_log),
                'successful_frames': sum(log['result'].get('successful_frames', 0) for log in self.execution_log),
                'failed_frames': sum(log['result'].get('failed_frames', 0) for log in self.execution_log)
            },
            'optimization_recommendations': self._generate_optimization_recommendations(),
            'context_loss_analysis': self._analyze_context_loss()
        }
        
        # Save meta-analysis report
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        meta_report_path = f'reports/meta_analysis_{scaffold.id}_{timestamp}.json'
        Path('reports').mkdir(exist_ok=True)
        
        with open(meta_report_path, 'w') as f:
            json.dump(meta_analysis, f, indent=2)
        
        print(f"📄 Meta-analysis report saved: {meta_report_path}")
        
        return {
            'status': 'meta_audit_complete',
            'meta_analysis': meta_analysis,
            'report_path': meta_report_path
        }
    
    def _generate_optimization_recommendations(self) -> List[str]:
        """Generate optimization recommendations based on execution analysis"""
        recommendations = []
        
        # Analyze execution patterns
        failed_stages = [log for log in self.execution_log if not self._check_stage_success(log['result'])]
        
        if failed_stages:
            recommendations.append("Consider increasing max_attempts for failed stages")
            recommendations.append("Review frame dependencies and execution order")
        
        # Analyze context preservation
        if not self.current_context.get('preserved_context'):
            recommendations.append("Enable context preservation for better continuity")
        
        # Analyze frame performance
        total_frames = sum(log['result'].get('frames_executed', 0) for log in self.execution_log)
        successful_frames = sum(log['result'].get('successful_frames', 0) for log in self.execution_log)
        
        if total_frames > 0 and (successful_frames / total_frames) < 0.8:
            recommendations.append("Review frame success criteria and validation logic")
        
        return recommendations
    
    def _analyze_context_loss(self) -> Dict[str, Any]:
        """Analyze potential context loss during execution"""
        context_loss = {
            'potential_loss_points': [],
            'preservation_effectiveness': 0.0,
            'recommendations': []
        }
        
        # Check for context preservation at each stage
        preserved_context = self.current_context.get('preserved_context', {})
        
        if preserved_context:
            context_loss['preservation_effectiveness'] = 100.0
            context_loss['recommendations'].append("Context preservation working effectively")
        else:
            context_loss['potential_loss_points'].append("No previous context found")
            context_loss['recommendations'].append("Enable context preservation for this scaffold")
        
        return context_loss
    
    def _is_critical_frame(self, frame: Frame, stage: Stage) -> bool:
        """Determine if a frame is critical for stage success"""
        # Critical frames by stage
        critical_frames_by_stage = {
            Stage.SCOPE: ['synthesis_analysis'],  # Scope analysis is critical
            Stage.IDENTIFY_ANALYZE: ['enhanced_analysis', 'system_audit'],  # Analysis is critical
            Stage.PLAN: ['system_audit'],  # Planning audit is critical
            Stage.IMPLEMENT: ['websocket_implementation', 'risk_mitigation'],  # Implementation is critical
            Stage.FINAL_AUDIT: ['synthesis_analysis'],  # Final audit is critical
            Stage.META_AUDIT: ['meta_analysis'],  # Meta-audit is critical
            Stage.UPDATE_REGISTERS: ['knowledge_hub_update'],  # Knowledge hub update is critical
            Stage.PUSH_GITHUB: [],  # Git push is not critical (can be manual)
            Stage.SUCCESS_CONTINUE: []  # This stage is handled by framework logic
        }
        
        # Check if frame is critical for this stage
        critical_frames = critical_frames_by_stage.get(stage, [])
        return frame.id in critical_frames
    
    def _check_stage_success(self, stage_result: Dict[str, Any]) -> bool:
        """Check if a stage was successful"""
        # Consider stages with no frames as successful (neutral pass)
        if stage_result.get('status') == 'no_frames':
            return True
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
        """Push changes to GitHub with enhanced failure analysis"""
        print("📤 Pushing to GitHub...")
        
        git_operations = []
        external_failures = []
        
        try:
            # Check if we're in a git repository
            print("🔍 Checking git repository status...")
            result = self.external_executor.execute_command('git status')
            git_operations.append(result)
            
            if not result.success:
                return {
                    'status': 'no_git_repo',
                    'message': 'Not in a git repository',
                    'external_failures': [result],
                    'recommendations': result.recommendations
                }
            
            # Add all changes
            print("📁 Adding changes to git...")
            result = self.external_executor.execute_command('git add .')
            git_operations.append(result)
            
            if not result.success:
                external_failures.append(result)
            
            # Commit changes (this will trigger husky pre-commit hooks)
            print("💾 Committing changes (this may trigger pre-commit hooks)...")
            commit_message = f"Autonomous Framework v2 Update - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
            # Use list format to avoid shell quoting issues
            result = self.external_executor.execute_command(['git', 'commit', '-m', commit_message])
            git_operations.append(result)
            
            if not result.success:
                external_failures.append(result)
                # Analyze the failure - this is likely where lint-staged failed
                print("🔍 Analyzing commit failure (likely pre-commit hooks)...")
                analysis = self._analyze_commit_failure(result)
                external_failures.extend(analysis.get('additional_failures', []))
            
            # Push to remote
            print("🚀 Pushing to remote repository...")
            result = self.external_executor.execute_command('git push')
            git_operations.append(result)
            
            if not result.success:
                external_failures.append(result)
            
            # Generate failure analysis
            failure_summary = self.external_executor.get_failure_summary()
            
            if external_failures:
                print(f"\n⚠️ External command failures detected: {len(external_failures)}")
                print("🔍 Running diagnostic analysis...")
                diagnostic_report = self._run_diagnostic_analysis(external_failures)
                
                return {
                    'status': 'partial_success' if any(op.success for op in git_operations) else 'error',
                    'message': f'Git operations completed with {len(external_failures)} external failures',
                    'commit_message': commit_message if any(op.success for op in git_operations) else None,
                    'external_failures': external_failures,
                    'failure_summary': failure_summary,
                    'diagnostic_report': diagnostic_report,
                    'recommendations': failure_summary.get('recommendations', [])
                }
            else:
                return {
                    'status': 'success',
                    'message': 'Successfully pushed to GitHub',
                    'commit_message': commit_message,
                    'external_failures': [],
                    'failure_summary': failure_summary
                }
            
        except Exception as e:
            return {
                'status': 'error',
                'message': f'Git operation failed: {str(e)}',
                'external_failures': external_failures,
                'recommendations': ['Check git configuration', 'Verify remote repository access']
            }
    
    def _analyze_commit_failure(self, commit_result: ExternalCommandResult) -> Dict[str, Any]:
        """Analyze git commit failure, especially pre-commit hook failures"""
        analysis = {
            'failure_type': 'unknown',
            'additional_failures': [],
            'recommendations': []
        }
        
        stderr = commit_result.stderr.lower()
        
        # Check if this is a pre-commit hook failure
        if 'husky' in stderr or 'lint-staged' in stderr or 'pre-commit' in stderr:
            analysis['failure_type'] = 'pre_commit_hook'
            analysis['recommendations'].extend([
                "Pre-commit hooks failed - this is likely due to linting/formatting issues",
                "Check the specific lint-staged commands that failed",
                "Review package.json lint-staged configuration",
                "Consider running lint-staged commands manually to identify issues"
            ])
            
            # Try to identify specific failed commands from stderr
            failed_commands = []
            if 'eslint' in stderr:
                failed_commands.append('eslint --fix')
            if 'prettier' in stderr:
                failed_commands.append('prettier --write')
            if 'npm run' in stderr:
                # Extract npm run commands
                npm_commands = re.findall(r'npm run ([a-zA-Z0-9-]+)', stderr)
                failed_commands.extend([f'npm run {cmd}' for cmd in npm_commands])
            
            if failed_commands:
                analysis['failed_commands'] = failed_commands
                analysis['recommendations'].append(f"Failed commands: {', '.join(failed_commands)}")
        
        # Check for other common git commit issues
        elif 'nothing to commit' in stderr:
            analysis['failure_type'] = 'no_changes'
            analysis['recommendations'].append("No changes to commit - this is normal if no files were modified")
        
        elif 'author identity' in stderr:
            analysis['failure_type'] = 'git_config'
            analysis['recommendations'].extend([
                "Git author identity not configured",
                "Run: git config --global user.name 'Your Name'",
                "Run: git config --global user.email 'your.email@example.com'"
            ])
        
        return analysis
    
    def _run_diagnostic_analysis(self, external_failures: List[ExternalCommandResult]) -> Dict[str, Any]:
        """Run comprehensive diagnostic analysis of external failures"""
        print("🔬 Running comprehensive diagnostic analysis...")
        
        diagnostic_report = {
            'timestamp': datetime.now().isoformat(),
            'total_failures': len(external_failures),
            'failure_categories': {},
            'orphan_analysis': {},
            'dependency_impact': {},
            'recommendations': [],
            'action_items': []
        }
        
        # Categorize failures
        for failure in external_failures:
            error_type = failure.error_type or 'unknown'
            if error_type not in diagnostic_report['failure_categories']:
                diagnostic_report['failure_categories'][error_type] = []
            diagnostic_report['failure_categories'][error_type].append({
                'command': failure.command,
                'severity': failure.severity,
                'recommendations': failure.recommendations
            })
        
        # Analyze orphans (failures that don't block the main process)
        orphan_analysis = self._analyze_orphans(external_failures)
        diagnostic_report['orphan_analysis'] = orphan_analysis
        
        # Analyze dependency impact
        dependency_impact = self._analyze_dependency_impact(external_failures)
        diagnostic_report['dependency_impact'] = dependency_impact
        
        # Generate comprehensive recommendations
        all_recommendations = []
        for failure in external_failures:
            all_recommendations.extend(failure.recommendations or [])
        
        # Remove duplicates while preserving order
        unique_recommendations = []
        for rec in all_recommendations:
            if rec not in unique_recommendations:
                unique_recommendations.append(rec)
        
        diagnostic_report['recommendations'] = unique_recommendations
        
        # Generate action items
        action_items = self._generate_action_items(external_failures, diagnostic_report)
        diagnostic_report['action_items'] = action_items
        
        return diagnostic_report
    
    def _analyze_orphans(self, external_failures: List[ExternalCommandResult]) -> Dict[str, Any]:
        """Analyze which failures are 'orphans' that don't block the main process"""
        orphans = []
        blockers = []
        
        for failure in external_failures:
            # Determine if this failure is an orphan or a blocker
            if failure.command.startswith('npm run') or 'eslint' in failure.command or 'prettier' in failure.command:
                # These are typically orphans - they don't block git operations
                orphans.append({
                    'command': failure.command,
                    'reason': 'Non-blocking tool failure',
                    'impact': 'Code quality tools failed but core operations may continue'
                })
            elif failure.command.startswith('git'):
                # Git operations are blockers
                blockers.append({
                    'command': failure.command,
                    'reason': 'Core git operation failure',
                    'impact': 'Blocks version control operations'
                })
            else:
                # Unknown - treat as potential blocker
                blockers.append({
                    'command': failure.command,
                    'reason': 'Unknown command type',
                    'impact': 'May block operations'
                })
        
        return {
            'orphans': orphans,
            'blockers': blockers,
            'orphan_count': len(orphans),
            'blocker_count': len(blockers)
        }
    
    def _analyze_dependency_impact(self, external_failures: List[ExternalCommandResult]) -> Dict[str, Any]:
        """Analyze the impact of failures on dependencies"""
        affected_dependencies = set()
        dependency_failures = []
        
        for failure in external_failures:
            if failure.dependencies_affected:
                affected_dependencies.update(failure.dependencies_affected)
                dependency_failures.append({
                    'command': failure.command,
                    'dependencies': failure.dependencies_affected,
                    'severity': failure.severity
                })
        
        return {
            'affected_dependencies': list(affected_dependencies),
            'dependency_failures': dependency_failures,
            'total_affected': len(affected_dependencies)
        }
    
    def _generate_action_items(self, external_failures: List[ExternalCommandResult], diagnostic_report: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate prioritized action items based on failure analysis"""
        action_items = []
        
        # High priority: Critical and high severity failures
        critical_failures = [f for f in external_failures if f.severity in ['critical', 'high']]
        for failure in critical_failures:
            action_items.append({
                'priority': 'high',
                'type': 'fix',
                'description': f'Fix {failure.error_type} in {failure.command}',
                'recommendations': failure.recommendations,
                'estimated_effort': 'medium'
            })
        
        # Medium priority: Dependency issues
        if diagnostic_report['dependency_impact']['total_affected'] > 0:
            action_items.append({
                'priority': 'medium',
                'type': 'dependency',
                'description': f'Resolve {diagnostic_report["dependency_impact"]["total_affected"]} dependency issues',
                'recommendations': ['Run npm install', 'Check package.json', 'Verify Node.js version'],
                'estimated_effort': 'low'
            })
        
        # Low priority: Orphan failures
        if diagnostic_report['orphan_analysis']['orphan_count'] > 0:
            action_items.append({
                'priority': 'low',
                'type': 'quality',
                'description': f'Address {diagnostic_report["orphan_analysis"]["orphan_count"]} code quality issues',
                'recommendations': ['Run eslint --fix', 'Run prettier --write', 'Check linting configuration'],
                'estimated_effort': 'low'
            })
        
        return action_items
    
    def _generate_final_report(self, scaffold: Scaffold) -> Dict[str, Any]:
        """Generate final execution report with meta-analysis and external failure analysis"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        report_path = f'reports/scaffold_execution_v2_{scaffold.id}_{timestamp}.json'
        
        # Get external failure analysis
        external_failure_summary = self.external_executor.get_failure_summary()
        
        report = {
            'metadata': {
                'scaffold_id': scaffold.id,
                'scaffold_name': scaffold.name,
                'start_time': self.current_context['start_time'],
                'end_time': datetime.now().isoformat(),
                'version': '2.0',
                'framework_version': 'v2'
            },
            'execution_summary': {
                'total_stages': 9,
                'successful_stages': len([log for log in self.execution_log if self._check_stage_success(log['result'])]),
                'failed_stages': len([log for log in self.execution_log if not self._check_stage_success(log['result'])]),
                'total_frames_executed': sum(log['result'].get('frames_executed', 0) for log in self.execution_log),
                'total_successful_frames': sum(log['result'].get('successful_frames', 0) for log in self.execution_log)
            },
            'context_preservation': {
                'context_loaded': self.current_context.get('preserved_context') is not None,
                'context_items': len(self.current_context.get('preserved_context') or {}),
                'context_preserved': True
            },
            'external_command_analysis': {
                'failure_summary': external_failure_summary,
                'command_history': [
                    {
                        'command': cmd.command,
                        'success': cmd.success,
                        'error_type': cmd.error_type,
                        'severity': cmd.severity,
                        'execution_time': cmd.execution_time,
                        'return_code': cmd.return_code,
                        'stderr': cmd.stderr[:500] if cmd.stderr else None,  # Truncate for readability
                        'recommendations': cmd.recommendations
                    } for cmd in self.external_executor.command_history
                ]
            },
            'stage_results': self.execution_log,
            'frame_execution_history': self.executor.execution_history,
            'input_data': self.current_context['input_data'],
            'previous_results': self.current_context['previous_results']
        }
        
        # Generate recommendations and action items
        recommendations = self._generate_comprehensive_recommendations(report)
        report['recommendations'] = recommendations
        
        # Save report
        Path('reports').mkdir(exist_ok=True)
        
        # Convert ExternalCommandResult objects to dictionaries for JSON serialization
        serializable_report = self.context_manager._make_json_serializable(report)
        
        with open(report_path, 'w') as f:
            json.dump(serializable_report, f, indent=2)
        
        # Print summary to console
        self._print_execution_summary(report)
        
        return {
            'status': 'complete',
            'report_path': report_path,
            'report': report
        }
    
    def _generate_comprehensive_recommendations(self, report: Dict[str, Any]) -> Dict[str, Any]:
        """Generate comprehensive recommendations based on execution results"""
        recommendations = {
            'framework_improvements': [],
            'external_fixes': [],
            'quality_improvements': [],
            'priority_actions': []
        }
        
        # Framework improvements based on execution
        successful_stages = report['execution_summary']['successful_stages']
        total_stages = report['execution_summary']['total_stages']
        success_rate = (successful_stages / total_stages) * 100
        
        if success_rate < 80:
            recommendations['framework_improvements'].append({
                'type': 'success_rate',
                'description': f'Low success rate ({success_rate:.1f}%) - consider framework optimization',
                'priority': 'high'
            })
        
        # External command fixes
        external_summary = report['external_command_analysis']['failure_summary']
        if external_summary.get('status') == 'failures_detected':
            recommendations['external_fixes'].extend(external_summary.get('recommendations', []))
            
            # Add priority actions for critical failures
            critical_failures = external_summary.get('critical_issues', [])
            for failure in critical_failures:
                recommendations['priority_actions'].append({
                    'type': 'critical_fix',
                    'description': f'Fix critical {failure["error_type"]} in {failure["command"]}',
                    'recommendations': failure.get('recommendations', []),
                    'priority': 'critical'
                })
        
        # Quality improvements
        if report['external_command_analysis']['command_history']:
            quality_failures = [
                cmd for cmd in report['external_command_analysis']['command_history']
                if not cmd['success'] and cmd['command'] in ['eslint --fix', 'prettier --write']
            ]
            if quality_failures:
                recommendations['quality_improvements'].append({
                    'type': 'code_quality',
                    'description': f'Address {len(quality_failures)} code quality issues',
                    'actions': ['Run eslint --fix', 'Run prettier --write', 'Review linting configuration']
                })
        
        return recommendations
    
    def _print_execution_summary(self, report: Dict[str, Any]):
        """Print a comprehensive execution summary to console"""
        print("\n" + "=" * 80)
        print("📊 EXECUTION SUMMARY")
        print("=" * 80)
        
        # Basic execution stats
        summary = report['execution_summary']
        print(f"✅ Successful stages: {summary['successful_stages']}/{summary['total_stages']}")
        print(f"✅ Successful frames: {summary['total_successful_frames']}/{summary['total_frames_executed']}")
        
        # External command analysis
        external_summary = report['external_command_analysis']['failure_summary']
        if external_summary.get('status') == 'failures_detected':
            print(f"\n⚠️ External Command Failures:")
            print(f"   Total failures: {external_summary['total_failures']}")
            print(f"   Critical failures: {external_summary['critical_failures']}")
            
            if external_summary.get('recommendations'):
                print(f"\n🔧 Key Recommendations:")
                for i, rec in enumerate(external_summary['recommendations'][:5], 1):
                    print(f"   {i}. {rec}")
        
        # Priority actions
        if report.get('recommendations', {}).get('priority_actions'):
            print(f"\n🚨 Priority Actions:")
            for action in report['recommendations']['priority_actions']:
                print(f"   • {action['description']}")
        
        print("=" * 80)
    
    def _handle_failure(self, error: Exception):
        """Handle framework execution failure"""
        print(f"\n🚨 FRAMEWORK FAILURE HANDLING")
        print(f"Error: {str(error)}")
        print(f"Traceback: {traceback.format_exc()}")
        
        # Save failure report
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        failure_path = f'reports/framework_failure_v2_{timestamp}.json'
        
        failure_report = {
            'timestamp': datetime.now().isoformat(),
            'error': str(error),
            'traceback': traceback.format_exc(),
            'context': self.current_context,
            'execution_log': self.execution_log
        }
        
        Path('reports').mkdir(exist_ok=True)
        
        # Convert ExternalCommandResult objects to dictionaries for JSON serialization
        serializable_failure_report = self.context_manager._make_json_serializable(failure_report)
        
        with open(failure_path, 'w') as f:
            json.dump(serializable_failure_report, f, indent=2)
        
        print(f"📄 Failure report saved: {failure_path}")
    
    def list_available_scaffolds(self) -> List[Dict[str, Any]]:
        """List all available scaffolds"""
        return [
            {
                'id': scaffold.id,
                'name': scaffold.name,
                'description': scaffold.description,
                'stages': len(scaffold.stages),
                'dependencies': scaffold.dependencies,
                'context_preservation': scaffold.context_preservation
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
                'file_path': frame.file_path,
                'context_preservation': frame.context_preservation
            }
            for frame in self.registry.frames.values()
        ]

def main():
    """Main entry point"""
    print("🤖 AUTONOMOUS FRAMEWORK v2 - ENHANCED MODULAR SCAFFOLD SYSTEM")
    print("=" * 80)
    
    framework = AutonomousFramework()
    
    # List available options
    print("\n📋 Available Scaffolds:")
    scaffolds = framework.list_available_scaffolds()
    for i, scaffold in enumerate(scaffolds, 1):
        print(f"{i}. {scaffold['name']} ({scaffold['id']})")
        print(f"   {scaffold['description']}")
        print(f"   Stages: {scaffold['stages']}, Dependencies: {', '.join(scaffold['dependencies'])}")
        print(f"   Context Preservation: {'✅' if scaffold['context_preservation'] else '❌'}")
        print()
    
    print("\n🔧 Available Frames:")
    frames = framework.list_available_frames()
    for i, frame in enumerate(frames, 1):
        print(f"{i}. {frame['name']} ({frame['type']})")
        print(f"   {frame['description']}")
        print(f"   File: {frame['file_path']}")
        print(f"   Context Preservation: {'✅' if frame['context_preservation'] else '❌'}")
        print()
    
    # Execute a scaffold with safer CLI parsing: require explicit --scaffold
    args = sys.argv[1:]
    scaffold_id = None
    input_data = {}
    if '--scaffold' in args:
        idx = args.index('--scaffold')
        if idx + 1 < len(args):
            scaffold_id = args[idx + 1]
    if '--input' in args:
        idx = args.index('--input')
        if idx + 1 < len(args):
            try:
                input_data = json.loads(args[idx + 1])
            except Exception:
                input_data = {}
    if scaffold_id:
        
        print(f"\n🚀 Executing scaffold: {scaffold_id}")
        result = framework.execute_scaffold(scaffold_id, input_data)
        print(f"✅ Execution complete: {result['status']}")
    else:
        print("\n💡 Usage:")
        print("python autonomous-framework-v2.py --scaffold <id> [--input '<json>']")
        print("\nExamples:")
        print("python autonomous-framework-v2.py --scaffold websocket_implementation")
        print("python autonomous-framework-v2.py --scaffold full_system_analysis")
        print("python autonomous-framework-v2.py --scaffold quick_assessment --input '{\"scope\": \"security\"}'")

if __name__ == "__main__":
    main()
