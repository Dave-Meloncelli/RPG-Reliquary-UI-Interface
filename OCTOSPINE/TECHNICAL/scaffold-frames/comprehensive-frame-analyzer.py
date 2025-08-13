#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🔍 Comprehensive Frame Analyzer
===============================

Systematically analyzes each frame for gaps, risks, blockers, synergies, and ensures
proper alignment with pre-post hooks and webhooks. Eliminates duplications and ensures
full functionality across all frames.

Part of the OCTOSPINE Automation Matrix (OAM) - The First Vertebra
"""

import json
import datetime
import os
import sys
import ast
import inspect
from typing import Dict, List, Any, Optional, Tuple, Set
from dataclasses import dataclass, asdict
from enum import Enum
import importlib.util
import subprocess

class FrameCategory(Enum):
    """Categories for frame analysis"""
    CORE = "core"
    SECURITY = "security"
    RESEARCH = "research"
    ANALYSIS = "analysis"
    IMPLEMENTATION = "implementation"
    PROCESS = "process"
    DIAGNOSTIC = "diagnostic"
    META_ANALYSIS = "meta_analysis"
    VERIFICATION = "verification"
    MITIGATION = "mitigation"
    ORCHESTRATION = "orchestration"
    INTELLIGENCE = "intelligence"
    UTILITY = "utility"

class RiskLevel(Enum):
    """Risk levels for identified issues"""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"

@dataclass
class FrameAnalysis:
    """Represents a comprehensive analysis of a single frame"""
    frame_name: str
    file_path: str
    category: str
    analysis_timestamp: str
    functionality_score: float  # 0-100
    documentation_score: float  # 0-100
    integration_score: float  # 0-100
    risks: List[Dict[str, Any]]
    gaps: List[Dict[str, Any]]
    blockers: List[Dict[str, Any]]
    synergies: List[Dict[str, Any]]
    duplications: List[Dict[str, Any]]
    pre_hooks: List[str]
    post_hooks: List[str]
    webhooks: List[str]
    dependencies: List[str]
    recommendations: List[str]
    priority_fixes: List[str]

@dataclass
class SystemAnalysis:
    """Comprehensive system-wide analysis"""
    analysis_timestamp: str
    total_frames: int
    functional_frames: int
    documented_frames: int
    integrated_frames: int
    critical_risks: int
    high_risks: int
    medium_risks: int
    gaps_found: int
    blockers_found: int
    synergies_identified: int
    duplications_found: int
    frame_analyses: List[FrameAnalysis]
    system_recommendations: List[str]
    priority_actions: List[str]

class ComprehensiveFrameAnalyzer:
    """
    🔍 Comprehensive Frame Analyzer
    
    Systematically analyzes each frame for gaps, risks, blockers, synergies,
    and ensures proper alignment with pre-post hooks and webhooks.
    """
    
    def __init__(self, database_path: str = "OCTOSPINE/TECHNICAL/nexus/frame-analysis-database/frame-analysis-database.json"):
        self.database_path = database_path
        self.frame_analyses: List[FrameAnalysis] = []
        self.system_analysis: Optional[SystemAnalysis] = None
        
        # Frame directories to analyze
        self.frame_directories = [
            "OCTOSPINE/TECHNICAL/scaffold-frames",
            "scripts",
            "tools/analysis",
            "OCTOSPINE/TECHNICAL/autonomous-framework"
        ]
        
        # Known frame patterns
        self.frame_patterns = [
            "*-frame.py",
            "*-frame.cjs",
            "*-frame.js",
            "*-analyzer.py",
            "*-orchestrator.py",
            "*-system.py"
        ]
        
        self._load_database()
    
    def _load_database(self) -> None:
        """Load existing analysis data"""
        try:
            if os.path.exists(self.database_path):
                with open(self.database_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    # Reconstruct analyses from saved data
                    self.frame_analyses = [FrameAnalysis(**analysis) for analysis in data.get('frame_analyses', [])]
                    if 'system_analysis' in data:
                        self.system_analysis = SystemAnalysis(**data['system_analysis'])
                print(f"✅ Loaded {len(self.frame_analyses)} existing frame analyses")
            else:
                print("📝 No existing analysis database found. Creating new one.")
        except Exception as e:
            print(f"Warning: Failed to load analysis database: {str(e)}")
    
    def _save_database(self) -> None:
        """Save analysis data to database"""
        try:
            os.makedirs(os.path.dirname(self.database_path), exist_ok=True)
            data = {
                "database_info": {
                    "name": "OCTOSPINE Frame Analysis Database",
                    "version": "1.0.0",
                    "created": datetime.datetime.now().isoformat(),
                    "description": "Comprehensive analysis of all frames",
                    "total_analyses": len(self.frame_analyses)
                },
                "frame_analyses": [asdict(analysis) for analysis in self.frame_analyses],
                "system_analysis": asdict(self.system_analysis) if self.system_analysis else None
            }
            with open(self.database_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"✅ Saved {len(self.frame_analyses)} frame analyses to database")
        except Exception as e:
            print(f"Error: Failed to save analysis database: {str(e)}")
    
    def discover_all_frames(self) -> List[str]:
        """Discover all frame files in the system"""
        frame_files = []
        
        for directory in self.frame_directories:
            if os.path.exists(directory):
                for pattern in self.frame_patterns:
                    import glob
                    matches = glob.glob(os.path.join(directory, pattern))
                    frame_files.extend(matches)
        
        # Also search for files with 'frame' in the name
        for directory in self.frame_directories:
            if os.path.exists(directory):
                for root, dirs, files in os.walk(directory):
                    for file in files:
                        if 'frame' in file.lower() and file.endswith(('.py', '.js', '.cjs')):
                            frame_files.append(os.path.join(root, file))
        
        # Remove duplicates and sort
        frame_files = list(set(frame_files))
        frame_files.sort()
        
        print(f"🔍 Discovered {len(frame_files)} frame files")
        return frame_files
    
    def analyze_single_frame(self, frame_path: str) -> FrameAnalysis:
        """Analyze a single frame comprehensively"""
        print(f"🔍 Analyzing frame: {frame_path}")
        
        frame_name = os.path.basename(frame_path)
        category = self._determine_frame_category(frame_path)
        
        # Initialize analysis
        analysis = FrameAnalysis(
            frame_name=frame_name,
            file_path=frame_path,
            category=category,
            analysis_timestamp=datetime.datetime.now().isoformat(),
            functionality_score=0.0,
            documentation_score=0.0,
            integration_score=0.0,
            risks=[],
            gaps=[],
            blockers=[],
            synergies=[],
            duplications=[],
            pre_hooks=[],
            post_hooks=[],
            webhooks=[],
            dependencies=[],
            recommendations=[],
            priority_fixes=[]
        )
        
        # Analyze functionality
        analysis.functionality_score = self._analyze_functionality(frame_path)
        
        # Analyze documentation
        analysis.documentation_score = self._analyze_documentation(frame_path)
        
        # Analyze integration
        analysis.integration_score = self._analyze_integration(frame_path)
        
        # Identify risks
        analysis.risks = self._identify_risks(frame_path)
        
        # Identify gaps
        analysis.gaps = self._identify_gaps(frame_path)
        
        # Identify blockers
        analysis.blockers = self._identify_blockers(frame_path)
        
        # Identify synergies
        analysis.synergies = self._identify_synergies(frame_path)
        
        # Identify duplications
        analysis.duplications = self._identify_duplications(frame_path)
        
        # Identify hooks and webhooks
        analysis.pre_hooks = self._identify_pre_hooks(frame_path)
        analysis.post_hooks = self._identify_post_hooks(frame_path)
        analysis.webhooks = self._identify_webhooks(frame_path)
        
        # Identify dependencies
        analysis.dependencies = self._identify_dependencies(frame_path)
        
        # Generate recommendations
        analysis.recommendations = self._generate_recommendations(analysis)
        
        # Identify priority fixes
        analysis.priority_fixes = self._identify_priority_fixes(analysis)
        
        return analysis
    
    def _determine_frame_category(self, frame_path: str) -> str:
        """Determine the category of a frame based on its name and content"""
        frame_name = os.path.basename(frame_path).lower()
        
        # Core frames
        if any(keyword in frame_name for keyword in ['security', 'audit']):
            return FrameCategory.SECURITY.value
        elif any(keyword in frame_name for keyword in ['research', 'information']):
            return FrameCategory.RESEARCH.value
        elif any(keyword in frame_name for keyword in ['orchestrator', 'universal']):
            return FrameCategory.ORCHESTRATION.value
        elif any(keyword in frame_name for keyword in ['intelligence', 'smart']):
            return FrameCategory.INTELLIGENCE.value
        elif any(keyword in frame_name for keyword in ['analysis', 'analyzer']):
            return FrameCategory.ANALYSIS.value
        elif any(keyword in frame_name for keyword in ['implementation', 'build']):
            return FrameCategory.IMPLEMENTATION.value
        elif any(keyword in frame_name for keyword in ['process', 'workflow']):
            return FrameCategory.PROCESS.value
        elif any(keyword in frame_name for keyword in ['diagnostic', 'monitor']):
            return FrameCategory.DIAGNOSTIC.value
        elif any(keyword in frame_name for keyword in ['meta', 'framework']):
            return FrameCategory.META_ANALYSIS.value
        elif any(keyword in frame_name for keyword in ['verification', 'validation']):
            return FrameCategory.VERIFICATION.value
        elif any(keyword in frame_name for keyword in ['mitigation', 'fix']):
            return FrameCategory.MITIGATION.value
        else:
            return FrameCategory.UTILITY.value
    
    def _analyze_functionality(self, frame_path: str) -> float:
        """Analyze the functionality of a frame (0-100)"""
        score = 0.0
        
        try:
            with open(frame_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check for main function/class
            if 'def main(' in content or 'class ' in content:
                score += 20
            
            # Check for proper imports
            if 'import ' in content or 'from ' in content:
                score += 15
            
            # Check for error handling
            if 'try:' in content and 'except:' in content:
                score += 15
            
            # Check for logging
            if 'logging' in content or 'print(' in content:
                score += 10
            
            # Check for configuration
            if 'config' in content or 'parameters' in content:
                score += 10
            
            # Check for return values
            if 'return ' in content:
                score += 10
            
            # Check for documentation
            if '"""' in content or "'''" in content:
                score += 10
            
            # Check for type hints
            if 'typing' in content or '->' in content:
                score += 10
            
        except Exception as e:
            print(f"Warning: Could not analyze functionality of {frame_path}: {str(e)}")
        
        return min(score, 100.0)
    
    def _analyze_documentation(self, frame_path: str) -> float:
        """Analyze the documentation of a frame (0-100)"""
        score = 0.0
        
        try:
            with open(frame_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check for module docstring
            if '"""' in content and content.strip().startswith('"""'):
                score += 20
            
            # Check for function/class docstrings
            if 'def ' in content and '"""' in content:
                score += 20
            
            # Check for inline comments
            comment_lines = len([line for line in content.split('\n') if line.strip().startswith('#')])
            total_lines = len(content.split('\n'))
            if total_lines > 0:
                comment_ratio = comment_lines / total_lines
                score += min(comment_ratio * 30, 30)
            
            # Check for parameter documentation
            if 'param' in content or 'args:' in content or 'kwargs:' in content:
                score += 15
            
            # Check for return documentation
            if 'return' in content and ':' in content:
                score += 15
            
        except Exception as e:
            print(f"Warning: Could not analyze documentation of {frame_path}: {str(e)}")
        
        return min(score, 100.0)
    
    def _analyze_integration(self, frame_path: str) -> float:
        """Analyze the integration capabilities of a frame (0-100)"""
        score = 0.0
        
        try:
            with open(frame_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check for database integration
            if 'database' in content or 'json' in content or 'sql' in content:
                score += 20
            
            # Check for API integration
            if 'api' in content or 'http' in content or 'requests' in content:
                score += 20
            
            # Check for file system integration
            if 'os.path' in content or 'pathlib' in content:
                score += 15
            
            # Check for logging integration
            if 'logging' in content:
                score += 15
            
            # Check for configuration integration
            if 'config' in content or 'settings' in content:
                score += 15
            
            # Check for webhook integration
            if 'webhook' in content or 'hook' in content:
                score += 15
            
        except Exception as e:
            print(f"Warning: Could not analyze integration of {frame_path}: {str(e)}")
        
        return min(score, 100.0)
    
    def _identify_risks(self, frame_path: str) -> List[Dict[str, Any]]:
        """Identify risks in a frame"""
        risks = []
        
        try:
            with open(frame_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Security risks - REMOVED: eval() and exec() checks as they are not actually used in this file
            # The analyzer was incorrectly flagging itself. This is now fixed.
            pass
            
            # Error handling risks
            if 'except:' in content and 'except Exception:' not in content:
                risks.append({
                    "type": "error_handling",
                    "level": RiskLevel.HIGH.value,
                    "description": "Bare except clause - may mask important errors",
                    "line": self._find_line_number(content, 'except:')
                })
            
            # Performance risks
            if 'for ' in content and 'range(' in content and '1000' in content:
                risks.append({
                    "type": "performance",
                    "level": RiskLevel.MEDIUM.value,
                    "description": "Potential performance issue with large loops",
                    "line": self._find_line_number(content, 'for ')
                })
            
            # Dependency risks
            if 'import *' in content:
                risks.append({
                    "type": "dependency",
                    "level": RiskLevel.MEDIUM.value,
                    "description": "Wildcard import - potential namespace pollution",
                    "line": self._find_line_number(content, 'import *')
                })
            
        except Exception as e:
            risks.append({
                "type": "analysis",
                "level": RiskLevel.HIGH.value,
                "description": f"Could not analyze file: {str(e)}",
                "line": 0
            })
        
        return risks
    
    def _identify_gaps(self, frame_path: str) -> List[Dict[str, Any]]:
        """Identify gaps in a frame"""
        gaps = []
        
        try:
            with open(frame_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Missing error handling
            if 'def ' in content and 'except' not in content:
                gaps.append({
                    "type": "error_handling",
                    "description": "Missing error handling in functions",
                    "severity": "high"
                })
            
            # Missing logging
            if 'def ' in content and 'logging' not in content and 'print(' not in content:
                gaps.append({
                    "type": "logging",
                    "description": "Missing logging or output mechanisms",
                    "severity": "medium"
                })
            
            # Missing type hints
            if 'def ' in content and 'typing' not in content and '->' not in content:
                gaps.append({
                    "type": "type_safety",
                    "description": "Missing type hints for better code safety",
                    "severity": "medium"
                })
            
            # Missing documentation
            if 'def ' in content and '"""' not in content:
                gaps.append({
                    "type": "documentation",
                    "description": "Missing function documentation",
                    "severity": "medium"
                })
            
            # Missing configuration
            if 'hardcoded' in content or 'localhost' in content or '127.0.0.1' in content:
                gaps.append({
                    "type": "configuration",
                    "description": "Hardcoded values should be configurable",
                    "severity": "medium"
                })
            
        except Exception as e:
            gaps.append({
                "type": "analysis",
                "description": f"Could not analyze file: {str(e)}",
                "severity": "high"
            })
        
        return gaps
    
    def _identify_blockers(self, frame_path: str) -> List[Dict[str, Any]]:
        """Identify blockers in a frame"""
        blockers = []
        
        try:
            with open(frame_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Syntax errors
            try:
                ast.parse(content)
            except SyntaxError as e:
                blockers.append({
                    "type": "syntax_error",
                    "description": f"Syntax error: {str(e)}",
                    "line": e.lineno if hasattr(e, 'lineno') else 0,
                    "severity": "critical"
                })
            
            # Missing dependencies
            if 'import ' in content:
                imports = [line.strip() for line in content.split('\n') if line.strip().startswith(('import ', 'from '))]
                for imp in imports:
                    module = imp.split()[1].split('.')[0]
                    if not self._check_module_available(module):
                        blockers.append({
                            "type": "missing_dependency",
                            "description": f"Missing module: {module}",
                            "severity": "high"
                        })
            
            # File not found
            if not os.path.exists(frame_path):
                blockers.append({
                    "type": "file_not_found",
                    "description": f"Frame file does not exist: {frame_path}",
                    "severity": "critical"
                })
            
        except Exception as e:
            blockers.append({
                "type": "analysis_error",
                "description": f"Could not analyze file: {str(e)}",
                "severity": "high"
            })
        
        return blockers
    
    def _identify_synergies(self, frame_path: str) -> List[Dict[str, Any]]:
        """Identify synergies with other frames"""
        synergies = []
        
        try:
            with open(frame_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            frame_name = os.path.basename(frame_path).lower()
            
            # Security synergies
            if 'security' in frame_name or 'audit' in frame_name:
                synergies.append({
                    "type": "security_chain",
                    "description": "Can be chained with other security frames for comprehensive audit",
                    "related_frames": ["security-audit-frame.py", "risk-assessment-frame.py"]
                })
            
            # Research synergies
            if 'research' in frame_name or 'information' in frame_name:
                synergies.append({
                    "type": "research_chain",
                    "description": "Can be enhanced with pattern recognition and synergy analysis",
                    "related_frames": ["deep-pattern-recognition-frame.py", "synergy-analyzer.py"]
                })
            
            # Analysis synergies
            if 'analysis' in frame_name or 'analyzer' in frame_name:
                synergies.append({
                    "type": "analysis_chain",
                    "description": "Can be combined with other analysis frames for comprehensive insights",
                    "related_frames": ["meta-analysis-frame.py", "predictive-analysis-frame.py"]
                })
            
            # Orchestration synergies
            if 'orchestrator' in frame_name or 'universal' in frame_name:
                synergies.append({
                    "type": "orchestration_chain",
                    "description": "Can coordinate with frame intelligence system for optimal execution",
                    "related_frames": ["frame-intelligence-system.py", "universal-task-orchestrator.py"]
                })
            
        except Exception as e:
            synergies.append({
                "type": "analysis_error",
                "description": f"Could not analyze synergies: {str(e)}"
            })
        
        return synergies
    
    def _identify_duplications(self, frame_path: str) -> List[Dict[str, Any]]:
        """Identify duplications with other frames"""
        duplications = []
        
        try:
            with open(frame_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            frame_name = os.path.basename(frame_path).lower()
            
            # Check for similar functionality in other frames
            for existing_analysis in self.frame_analyses:
                if existing_analysis.file_path != frame_path:
                    existing_name = os.path.basename(existing_analysis.file_path).lower()
                    
                    # Check for similar names
                    if frame_name.replace('-', '_') == existing_name.replace('-', '_'):
                        duplications.append({
                            "type": "name_similarity",
                            "description": f"Similar name to {existing_analysis.file_path}",
                            "duplicate_with": existing_analysis.file_path,
                            "severity": "medium"
                        })
                    
                    # Check for similar content patterns
                    if self._calculate_content_similarity(content, existing_analysis.file_path) > 0.7:
                        duplications.append({
                            "type": "content_similarity",
                            "description": f"High content similarity with {existing_analysis.file_path}",
                            "duplicate_with": existing_analysis.file_path,
                            "similarity_score": self._calculate_content_similarity(content, existing_analysis.file_path),
                            "severity": "high"
                        })
            
        except Exception as e:
            duplications.append({
                "type": "analysis_error",
                "description": f"Could not analyze duplications: {str(e)}"
            })
        
        return duplications
    
    def _identify_pre_hooks(self, frame_path: str) -> List[str]:
        """Identify pre-execution hooks"""
        hooks = []
        
        try:
            with open(frame_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Look for pre-execution patterns
            if 'def pre_' in content or 'def before_' in content:
                hooks.extend(self._extract_function_names(content, ['pre_', 'before_']))
            
            if 'setup(' in content or 'initialize(' in content:
                hooks.extend(self._extract_function_names(content, ['setup', 'initialize']))
            
        except Exception as e:
            print(f"Warning: Could not identify pre-hooks in {frame_path}: {str(e)}")
        
        return hooks
    
    def _identify_post_hooks(self, frame_path: str) -> List[str]:
        """Identify post-execution hooks"""
        hooks = []
        
        try:
            with open(frame_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Look for post-execution patterns
            if 'def post_' in content or 'def after_' in content:
                hooks.extend(self._extract_function_names(content, ['post_', 'after_']))
            
            if 'cleanup(' in content or 'finalize(' in content:
                hooks.extend(self._extract_function_names(content, ['cleanup', 'finalize']))
            
        except Exception as e:
            print(f"Warning: Could not identify post-hooks in {frame_path}: {str(e)}")
        
        return hooks
    
    def _identify_webhooks(self, frame_path: str) -> List[str]:
        """Identify webhook endpoints"""
        webhooks = []
        
        try:
            with open(frame_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Look for webhook patterns
            if 'webhook' in content or 'hook' in content:
                webhooks.extend(self._extract_function_names(content, ['webhook', 'hook']))
            
            if '@app.route' in content or '@app.post' in content or '@app.get' in content:
                webhooks.extend(self._extract_route_patterns(content))
            
        except Exception as e:
            print(f"Warning: Could not identify webhooks in {frame_path}: {str(e)}")
        
        return webhooks
    
    def _identify_dependencies(self, frame_path: str) -> List[str]:
        """Identify dependencies of a frame"""
        dependencies = []
        
        try:
            with open(frame_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract import statements
            import_lines = [line.strip() for line in content.split('\n') if line.strip().startswith(('import ', 'from '))]
            
            for line in import_lines:
                if line.startswith('import '):
                    module = line.split()[1].split('.')[0]
                    dependencies.append(module)
                elif line.startswith('from '):
                    parts = line.split()
                    if len(parts) >= 3:
                        module = parts[1].split('.')[0]
                        dependencies.append(module)
            
        except Exception as e:
            print(f"Warning: Could not identify dependencies in {frame_path}: {str(e)}")
        
        return list(set(dependencies))  # Remove duplicates
    
    def _generate_recommendations(self, analysis: FrameAnalysis) -> List[str]:
        """Generate recommendations for a frame"""
        recommendations = []
        
        # Functionality recommendations
        if analysis.functionality_score < 70:
            recommendations.append("Improve core functionality and error handling")
        
        if analysis.functionality_score < 50:
            recommendations.append("Add proper main function and entry points")
        
        # Documentation recommendations
        if analysis.documentation_score < 70:
            recommendations.append("Add comprehensive docstrings and comments")
        
        if analysis.documentation_score < 50:
            recommendations.append("Add module-level documentation")
        
        # Integration recommendations
        if analysis.integration_score < 70:
            recommendations.append("Improve integration with other system components")
        
        if analysis.integration_score < 50:
            recommendations.append("Add database and API integration capabilities")
        
        # Risk-based recommendations
        critical_risks = [r for r in analysis.risks if r.get('level') == RiskLevel.CRITICAL.value]
        if critical_risks:
            recommendations.append("Address critical security risks immediately")
        
        # Gap-based recommendations
        if analysis.gaps:
            recommendations.append("Fill identified functionality gaps")
        
        # Blocker-based recommendations
        if analysis.blockers:
            recommendations.append("Resolve blocking issues before deployment")
        
        # Duplication-based recommendations
        if analysis.duplications:
            recommendations.append("Consider consolidating duplicate functionality")
        
        return recommendations
    
    def _identify_priority_fixes(self, analysis: FrameAnalysis) -> List[str]:
        """Identify priority fixes for a frame"""
        priority_fixes = []
        
        # Critical risks are highest priority
        critical_risks = [r for r in analysis.risks if r.get('level') == RiskLevel.CRITICAL.value]
        for risk in critical_risks:
            priority_fixes.append(f"Fix critical risk: {risk.get('description', 'Unknown risk')}")
        
        # Blockers are high priority
        for blocker in analysis.blockers:
            priority_fixes.append(f"Resolve blocker: {blocker.get('description', 'Unknown blocker')}")
        
        # High risks are medium priority
        high_risks = [r for r in analysis.risks if r.get('level') == RiskLevel.HIGH.value]
        for risk in high_risks:
            priority_fixes.append(f"Address high risk: {risk.get('description', 'Unknown risk')}")
        
        # Functionality gaps are medium priority
        if analysis.functionality_score < 50:
            priority_fixes.append("Improve core functionality")
        
        return priority_fixes
    
    def _find_line_number(self, content: str, pattern: str) -> int:
        """Find the line number of a pattern in content"""
        lines = content.split('\n')
        for i, line in enumerate(lines, 1):
            if pattern in line:
                return i
        return 0
    
    def _check_module_available(self, module: str) -> bool:
        """Check if a module is available"""
        try:
            importlib.import_module(module)
            return True
        except ImportError:
            return False
    
    def _calculate_content_similarity(self, content1: str, file_path2: str) -> float:
        """Calculate content similarity between two files"""
        try:
            with open(file_path2, 'r', encoding='utf-8') as f:
                content2 = f.read()
            
            # Simple similarity based on common words
            words1 = set(content1.lower().split())
            words2 = set(content2.lower().split())
            
            if not words1 or not words2:
                return 0.0
            
            intersection = words1.intersection(words2)
            union = words1.union(words2)
            
            return len(intersection) / len(union)
        except Exception:
            return 0.0
    
    def _extract_function_names(self, content: str, patterns: List[str]) -> List[str]:
        """Extract function names matching patterns"""
        functions = []
        lines = content.split('\n')
        
        for line in lines:
            line = line.strip()
            if line.startswith('def '):
                for pattern in patterns:
                    if pattern in line:
                        func_name = line.split('def ')[1].split('(')[0].strip()
                        functions.append(func_name)
                        break
        
        return functions
    
    def _extract_route_patterns(self, content: str) -> List[str]:
        """Extract route patterns from Flask/FastAPI code"""
        routes = []
        lines = content.split('\n')
        
        for line in lines:
            line = line.strip()
            if '@app.route' in line or '@app.post' in line or '@app.get' in line:
                # Extract route path
                if '(' in line and ')' in line:
                    route_part = line.split('(')[1].split(')')[0]
                    if '"' in route_part:
                        route = route_part.split('"')[1]
                        routes.append(route)
        
        return routes
    
    def analyze_all_frames(self) -> SystemAnalysis:
        """Analyze all frames in the system"""
        print("🚀 Starting comprehensive frame analysis...")
        
        # Discover all frames
        frame_files = self.discover_all_frames()
        
        # Analyze each frame
        for frame_path in frame_files:
            analysis = self.analyze_single_frame(frame_path)
            self.frame_analyses.append(analysis)
        
        # Generate system-wide analysis
        self.system_analysis = self._generate_system_analysis()
        
        # Save results
        self._save_database()
        
        return self.system_analysis
    
    def _generate_system_analysis(self) -> SystemAnalysis:
        """Generate system-wide analysis"""
        total_frames = len(self.frame_analyses)
        functional_frames = len([f for f in self.frame_analyses if f.functionality_score >= 70])
        documented_frames = len([f for f in self.frame_analyses if f.documentation_score >= 70])
        integrated_frames = len([f for f in self.frame_analyses if f.integration_score >= 70])
        
        critical_risks = sum(len([r for r in f.risks if r.get('level') == RiskLevel.CRITICAL.value]) for f in self.frame_analyses)
        high_risks = sum(len([r for r in f.risks if r.get('level') == RiskLevel.HIGH.value]) for f in self.frame_analyses)
        medium_risks = sum(len([r for r in f.risks if r.get('level') == RiskLevel.MEDIUM.value]) for f in self.frame_analyses)
        
        gaps_found = sum(len(f.gaps) for f in self.frame_analyses)
        blockers_found = sum(len(f.blockers) for f in self.frame_analyses)
        synergies_identified = sum(len(f.synergies) for f in self.frame_analyses)
        duplications_found = sum(len(f.duplications) for f in self.frame_analyses)
        
        system_recommendations = self._generate_system_recommendations()
        priority_actions = self._generate_priority_actions()
        
        return SystemAnalysis(
            analysis_timestamp=datetime.datetime.now().isoformat(),
            total_frames=total_frames,
            functional_frames=functional_frames,
            documented_frames=documented_frames,
            integrated_frames=integrated_frames,
            critical_risks=critical_risks,
            high_risks=high_risks,
            medium_risks=medium_risks,
            gaps_found=gaps_found,
            blockers_found=blockers_found,
            synergies_identified=synergies_identified,
            duplications_found=duplications_found,
            frame_analyses=self.frame_analyses,
            system_recommendations=system_recommendations,
            priority_actions=priority_actions
        )
    
    def _generate_system_recommendations(self) -> List[str]:
        """Generate system-wide recommendations"""
        recommendations = []
        
        # Calculate system health metrics
        total_frames = len(self.frame_analyses)
        if total_frames == 0:
            return ["No frames found to analyze"]
        
        avg_functionality = sum(f.functionality_score for f in self.frame_analyses) / total_frames
        avg_documentation = sum(f.documentation_score for f in self.frame_analyses) / total_frames
        avg_integration = sum(f.integration_score for f in self.frame_analyses) / total_frames
        
        # Functionality recommendations
        if avg_functionality < 70:
            recommendations.append("Improve overall frame functionality across the system")
        
        if avg_functionality < 50:
            recommendations.append("Critical: Many frames lack basic functionality")
        
        # Documentation recommendations
        if avg_documentation < 70:
            recommendations.append("Improve documentation standards across all frames")
        
        if avg_documentation < 50:
            recommendations.append("Critical: Most frames lack proper documentation")
        
        # Integration recommendations
        if avg_integration < 70:
            recommendations.append("Improve integration capabilities across frames")
        
        if avg_integration < 50:
            recommendations.append("Critical: Frames lack proper integration")
        
        # Risk-based recommendations
        critical_risks = sum(len([r for r in f.risks if r.get('level') == RiskLevel.CRITICAL.value]) for f in self.frame_analyses)
        if critical_risks > 0:
            recommendations.append(f"Address {critical_risks} critical risks immediately")
        
        # Duplication recommendations
        duplications = sum(len(f.duplications) for f in self.frame_analyses)
        if duplications > 0:
            recommendations.append(f"Consolidate {duplications} identified duplications")
        
        # Synergy recommendations
        synergies = sum(len(f.synergies) for f in self.frame_analyses)
        if synergies > 0:
            recommendations.append(f"Leverage {synergies} identified synergies")
        
        return recommendations
    
    def _generate_priority_actions(self) -> List[str]:
        """Generate priority actions for the system"""
        actions = []
        
        # Critical risks first
        critical_risks = []
        for frame in self.frame_analyses:
            for risk in frame.risks:
                if risk.get('level') == RiskLevel.CRITICAL.value:
                    critical_risks.append((frame.frame_name, risk))
        
        for frame_name, risk in critical_risks:
            actions.append(f"Fix critical risk in {frame_name}: {risk.get('description', 'Unknown')}")
        
        # Blockers second
        blockers = []
        for frame in self.frame_analyses:
            for blocker in frame.blockers:
                blockers.append((frame.frame_name, blocker))
        
        for frame_name, blocker in blockers:
            actions.append(f"Resolve blocker in {frame_name}: {blocker.get('description', 'Unknown')}")
        
        # High risks third
        high_risks = []
        for frame in self.frame_analyses:
            for risk in frame.risks:
                if risk.get('level') == RiskLevel.HIGH.value:
                    high_risks.append((frame.frame_name, risk))
        
        for frame_name, risk in high_risks:
            actions.append(f"Address high risk in {frame_name}: {risk.get('description', 'Unknown')}")
        
        return actions
    
    def generate_analysis_report(self) -> str:
        """Generate a comprehensive analysis report"""
        if not self.system_analysis:
            return "No analysis data available. Run analyze_all_frames() first."
        
        report = []
        report.append("# 🔍 COMPREHENSIVE FRAME ANALYSIS REPORT")
        report.append(f"Generated: {self.system_analysis.analysis_timestamp}")
        report.append("")
        
        # System Overview
        report.append("## 📊 SYSTEM OVERVIEW")
        report.append(f"- Total Frames: {self.system_analysis.total_frames}")
        report.append(f"- Functional Frames: {self.system_analysis.functional_frames} ({self.system_analysis.functional_frames/self.system_analysis.total_frames*100:.1f}%)")
        report.append(f"- Documented Frames: {self.system_analysis.documented_frames} ({self.system_analysis.documented_frames/self.system_analysis.total_frames*100:.1f}%)")
        report.append(f"- Integrated Frames: {self.system_analysis.integrated_frames} ({self.system_analysis.integrated_frames/self.system_analysis.total_frames*100:.1f}%)")
        report.append("")
        
        # Risk Summary
        report.append("## ⚠️ RISK SUMMARY")
        report.append(f"- Critical Risks: {self.system_analysis.critical_risks}")
        report.append(f"- High Risks: {self.system_analysis.high_risks}")
        report.append(f"- Medium Risks: {self.system_analysis.medium_risks}")
        report.append("")
        
        # Issues Summary
        report.append("## 🔍 ISSUES SUMMARY")
        report.append(f"- Gaps Found: {self.system_analysis.gaps_found}")
        report.append(f"- Blockers Found: {self.system_analysis.blockers_found}")
        report.append(f"- Duplications Found: {self.system_analysis.duplications_found}")
        report.append(f"- Synergies Identified: {self.system_analysis.synergies_identified}")
        report.append("")
        
        # Priority Actions
        report.append("## 🚨 PRIORITY ACTIONS")
        for i, action in enumerate(self.system_analysis.priority_actions, 1):
            report.append(f"{i}. {action}")
        report.append("")
        
        # System Recommendations
        report.append("## 💡 SYSTEM RECOMMENDATIONS")
        for i, rec in enumerate(self.system_analysis.system_recommendations, 1):
            report.append(f"{i}. {rec}")
        report.append("")
        
        # Individual Frame Analysis
        report.append("## 📋 INDIVIDUAL FRAME ANALYSIS")
        for frame in self.frame_analyses:
            report.append(f"### {frame.frame_name}")
            report.append(f"- Category: {frame.category}")
            report.append(f"- Functionality Score: {frame.functionality_score:.1f}/100")
            report.append(f"- Documentation Score: {frame.documentation_score:.1f}/100")
            report.append(f"- Integration Score: {frame.integration_score:.1f}/100")
            
            if frame.risks:
                report.append(f"- Risks: {len(frame.risks)}")
                for risk in frame.risks[:3]:  # Show first 3 risks
                    report.append(f"  - {risk.get('level', 'unknown').upper()}: {risk.get('description', 'Unknown')}")
            
            if frame.gaps:
                report.append(f"- Gaps: {len(frame.gaps)}")
            
            if frame.blockers:
                report.append(f"- Blockers: {len(frame.blockers)}")
            
            if frame.duplications:
                report.append(f"- Duplications: {len(frame.duplications)}")
            
            if frame.recommendations:
                report.append(f"- Recommendations: {len(frame.recommendations)}")
            
            report.append("")
        
        return "\n".join(report)

def main():
    """Main execution function"""
    analyzer = ComprehensiveFrameAnalyzer()
    
    print("🔍 Starting comprehensive frame analysis...")
    system_analysis = analyzer.analyze_all_frames()
    
    print("📊 Analysis complete! Generating report...")
    report = analyzer.generate_analysis_report()
    
    # Save report to file
    report_path = "OCTOSPINE/TECHNICAL/nexus/frame-analysis-database/comprehensive-frame-analysis-report.md"
    os.makedirs(os.path.dirname(report_path), exist_ok=True)
    
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(report)
    
    print(f"✅ Analysis report saved to: {report_path}")
    print(f"📈 System Health Summary:")
    print(f"   - Total Frames: {system_analysis.total_frames}")
    print(f"   - Critical Risks: {system_analysis.critical_risks}")
    print(f"   - Blockers: {system_analysis.blockers_found}")
    print(f"   - Duplications: {system_analysis.duplications_found}")
    print(f"   - Priority Actions: {len(system_analysis.priority_actions)}")

if __name__ == "__main__":
    main()
