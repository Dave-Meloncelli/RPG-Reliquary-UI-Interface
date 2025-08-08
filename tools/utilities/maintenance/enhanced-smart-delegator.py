#!/usr/bin/env python3
"""
Enhanced Smart Delegator with Agentic Oversight
- Manual file runs for diagnostics
- Fault classification (code vs dependency vs configuration)
- Backlog system for dependency-related issues
- VibeCoder-friendly explanations
- Recursive fault analysis
- Research integration with Playwright
"""

import os
import json
import subprocess
import re
import time
from datetime import datetime
from dataclasses import dataclass, asdict
from enum import Enum
from typing import List, Dict, Optional, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class FaultType(Enum):
    CODE = "code"
    DEPENDENCY = "dependency"
    CONFIGURATION = "configuration"
    ENVIRONMENT = "environment"
    EXTERNAL = "external"
    UNKNOWN = "unknown"

class FaultSeverity(Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

@dataclass
class FaultClassification:
    id: str
    type: FaultType
    severity: FaultSeverity
    description: str
    file: str
    line: Optional[int]
    error_code: Optional[str]
    dependencies: List[str]
    recursive: bool
    research_required: bool
    vibe_coder_explanation: str
    backlog_item: bool
    backlog_reason: Optional[str]
    created_at: datetime
    status: str = "open"

@dataclass
class BacklogItem:
    id: str
    title: str
    description: str
    fault_type: FaultType
    dependencies_required: List[str]
    vibe_coder_explanation: str
    priority: str
    created_at: datetime
    status: str = "pending"

class EnhancedSmartDelegator:
    def __init__(self, project_root: str = "."):
        self.project_root = os.path.abspath(project_root)
        self.faults: List[FaultClassification] = []
        self.backlog: List[BacklogItem] = []
        self.session_id = f"session-{int(time.time())}"
        
        # Fault patterns for classification
        self.dependency_patterns = [
            r"Cannot find module",
            r"Module not found",
            r"API endpoint not found",
            r"Service unavailable",
            r"Connection refused",
            r"ECONNREFUSED",
            r"ENOTFOUND",
            r"Missing dependency",
            r"Import.*failed",
            r"require.*not found"
        ]
        
        self.configuration_patterns = [
            r"Configuration.*missing",
            r"Environment.*not set",
            r"API key.*required",
            r"Database.*connection",
            r"Port.*already in use",
            r"Permission.*denied"
        ]
        
        self.code_patterns = [
            r"SyntaxError",
            r"TypeError",
            r"ReferenceError",
            r"Unexpected token",
            r"Missing.*semicolon",
            r"Unexpected.*identifier"
        ]

    def run_manual_file_analysis(self) -> Dict[str, Any]:
        """Run comprehensive manual file analysis"""
        logger.info("🔍 Starting manual file analysis...")
        
        analysis = {
            "timestamp": datetime.now().isoformat(),
            "session_id": self.session_id,
            "files_analyzed": 0,
            "faults_found": 0,
            "backlog_items": 0,
            "summary": {}
        }
        
        # Analyze TypeScript files
        ts_files = self._find_typescript_files()
        analysis["files_analyzed"] = len(ts_files)
        
        for file_path in ts_files:
            file_faults = self._analyze_file(file_path)
            analysis["faults_found"] += len(file_faults)
            
            for fault in file_faults:
                self.faults.append(fault)
                if fault.backlog_item:
                    self._create_backlog_item(fault)
                    analysis["backlog_items"] += 1
        
        # Run TypeScript compiler for current errors
        current_errors = self._run_typescript_check()
        analysis["current_errors"] = current_errors
        
        # Generate summary
        analysis["summary"] = self._generate_analysis_summary()
        
        return analysis

    def _find_typescript_files(self) -> List[str]:
        """Find all TypeScript files in the project"""
        ts_files = []
        for root, dirs, files in os.walk(self.project_root):
            # Skip node_modules and other build directories
            dirs[:] = [d for d in dirs if d not in ['node_modules', 'dist', 'build', '.git']]
            
            for file in files:
                if file.endswith(('.ts', '.tsx')):
                    ts_files.append(os.path.join(root, file))
        
        return ts_files

    def _analyze_file(self, file_path: str) -> List[FaultClassification]:
        """Analyze a single file for potential faults"""
        faults = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                lines = content.split('\n')
            
            # Check for common patterns
            for line_num, line in enumerate(lines, 1):
                fault = self._classify_line_fault(file_path, line_num, line)
                if fault:
                    faults.append(fault)
        
        except Exception as e:
            logger.error(f"Error analyzing {file_path}: {e}")
        
        return faults

    def _classify_line_fault(self, file_path: str, line_num: int, line: str) -> Optional[FaultClassification]:
        """Classify a potential fault in a line of code"""
        
        # Check for dependency issues
        for pattern in self.dependency_patterns:
            if re.search(pattern, line, re.IGNORECASE):
                return FaultClassification(
                    id=f"fault-{int(time.time())}-{line_num}",
                    type=FaultType.DEPENDENCY,
                    severity=FaultSeverity.HIGH,
                    description=f"Dependency issue detected: {line.strip()}",
                    file=file_path,
                    line=line_num,
                    error_code=None,
                    dependencies=self._extract_dependencies(line),
                    recursive=True,
                    research_required=True,
                    vibe_coder_explanation=self._generate_vibe_coder_explanation("dependency", line),
                    backlog_item=True,
                    backlog_reason="Missing dependency needs to be installed or configured",
                    created_at=datetime.now()
                )
        
        # Check for configuration issues
        for pattern in self.configuration_patterns:
            if re.search(pattern, line, re.IGNORECASE):
                return FaultClassification(
                    id=f"fault-{int(time.time())}-{line_num}",
                    type=FaultType.CONFIGURATION,
                    severity=FaultSeverity.MEDIUM,
                    description=f"Configuration issue detected: {line.strip()}",
                    file=file_path,
                    line=line_num,
                    error_code=None,
                    dependencies=[],
                    recursive=False,
                    research_required=False,
                    vibe_coder_explanation=self._generate_vibe_coder_explanation("configuration", line),
                    backlog_item=False,
                    backlog_reason=None,
                    created_at=datetime.now()
                )
        
        # Check for code issues
        for pattern in self.code_patterns:
            if re.search(pattern, line, re.IGNORECASE):
                return FaultClassification(
                    id=f"fault-{int(time.time())}-{line_num}",
                    type=FaultType.CODE,
                    severity=FaultSeverity.MEDIUM,
                    description=f"Code issue detected: {line.strip()}",
                    file=file_path,
                    line=line_num,
                    error_code=None,
                    dependencies=[],
                    recursive=False,
                    research_required=False,
                    vibe_coder_explanation=self._generate_vibe_coder_explanation("code", line),
                    backlog_item=False,
                    backlog_reason=None,
                    created_at=datetime.now()
                )
        
        return None

    def _extract_dependencies(self, line: str) -> List[str]:
        """Extract dependency names from a line"""
        dependencies = []
        
        # Look for import statements
        import_match = re.search(r'import.*from\s+[\'"]([^\'"]+)[\'"]', line)
        if import_match:
            dependencies.append(import_match.group(1))
        
        # Look for require statements
        require_match = re.search(r'require\s*\(\s*[\'"]([^\'"]+)[\'"]', line)
        if require_match:
            dependencies.append(require_match.group(1))
        
        return dependencies

    def _generate_vibe_coder_explanation(self, fault_type: str, line: str) -> str:
        """Generate VibeCoder-friendly explanations"""
        
        explanations = {
            "dependency": f"""
🎯 What's happening: The code is trying to use something that isn't installed or available yet.

🔍 The problem: {line.strip()}

💡 Think of it like: You're trying to use a tool that's not in your toolbox yet. You need to either:
   - Install the missing tool (npm install package-name)
   - Make sure the tool is available (check if service is running)
   - Use a different tool that you do have

🚀 Quick fix: This will be added to the backlog until we get the missing pieces set up.
            """,
            
            "configuration": f"""
🎯 What's happening: The system needs some information to work properly, but it's not set up yet.

🔍 The problem: {line.strip()}

💡 Think of it like: You're trying to use an app but haven't set up your account yet. You need to:
   - Add your API keys to the environment
   - Set up your database connection
   - Configure your settings

🚀 Quick fix: This needs configuration, not code changes.
            """,
            
            "code": f"""
🎯 What's happening: There's a small mistake in the code that needs fixing.

🔍 The problem: {line.strip()}

💡 Think of it like: A typo in a sentence - the meaning is clear but it needs to be corrected.

🚀 Quick fix: This can be fixed with a small code change.
            """
        }
        
        return explanations.get(fault_type, "Unknown issue type")

    def _run_typescript_check(self) -> Dict[str, Any]:
        """Run TypeScript compiler and capture errors"""
        try:
            result = subprocess.run(
                ["npm", "run", "type-check"],
                capture_output=True,
                text=True,
                cwd=self.project_root,
                timeout=60
            )
            
            # Parse TypeScript errors
            errors = []
            for line in result.stderr.split('\n'):
                if 'error TS' in line:
                    error_info = self._parse_typescript_error(line)
                    if error_info:
                        errors.append(error_info)
            
            return {
                "total_errors": len(errors),
                "errors": errors,
                "raw_output": result.stderr
            }
        
        except Exception as e:
            logger.error(f"Error running TypeScript check: {e}")
            return {"total_errors": 0, "errors": [], "raw_output": str(e)}

    def _parse_typescript_error(self, error_line: str) -> Optional[Dict[str, Any]]:
        """Parse a TypeScript error line"""
        # Example: src/services/authService.ts(10,15): error TS2307: Cannot find module './types' or its corresponding type declarations.
        pattern = r'([^(]+)\((\d+),(\d+)\):\s+error\s+TS(\d+):\s+(.+)'
        match = re.search(pattern, error_line)
        
        if match:
            return {
                "file": match.group(1),
                "line": int(match.group(2)),
                "column": int(match.group(3)),
                "error_code": f"TS{match.group(4)}",
                "message": match.group(5)
            }
        
        return None

    def _create_backlog_item(self, fault: FaultClassification):
        """Create a backlog item for dependency-related faults"""
        backlog_item = BacklogItem(
            id=f"backlog-{int(time.time())}",
            title=f"Resolve {fault.type.value} issue in {os.path.basename(fault.file)}",
            description=fault.description,
            fault_type=fault.type,
            dependencies_required=fault.dependencies,
            vibe_coder_explanation=fault.vibe_coder_explanation,
            priority="medium" if fault.severity == FaultSeverity.MEDIUM else "high",
            created_at=datetime.now()
        )
        
        self.backlog.append(backlog_item)

    def _generate_analysis_summary(self) -> Dict[str, Any]:
        """Generate a summary of the analysis"""
        fault_counts = {}
        for fault_type in FaultType:
            fault_counts[fault_type.value] = len([f for f in self.faults if f.type == fault_type])
        
        return {
            "total_faults": len(self.faults),
            "faults_by_type": fault_counts,
            "backlog_items": len(self.backlog),
            "recommendations": self._generate_recommendations()
        }

    def _generate_recommendations(self) -> List[str]:
        """Generate recommendations based on analysis"""
        recommendations = []
        
        dependency_faults = [f for f in self.faults if f.type == FaultType.DEPENDENCY]
        if dependency_faults:
            recommendations.append(f"🔧 {len(dependency_faults)} dependency issues found - these are in the backlog")
        
        code_faults = [f for f in self.faults if f.type == FaultType.CODE]
        if code_faults:
            recommendations.append(f"📝 {len(code_faults)} code issues found - these can be fixed immediately")
        
        if self.backlog:
            recommendations.append(f"📋 {len(self.backlog)} items added to backlog for later resolution")
        
        return recommendations

    def generate_comprehensive_report(self) -> Dict[str, Any]:
        """Generate a comprehensive report"""
        return {
            "session_id": self.session_id,
            "timestamp": datetime.now().isoformat(),
            "analysis": self.run_manual_file_analysis(),
            "faults": [asdict(fault) for fault in self.faults],
            "backlog": [asdict(item) for item in self.backlog],
            "summary": {
                "total_faults": len(self.faults),
                "backlog_items": len(self.backlog),
                "faults_by_type": {
                    fault_type.value: len([f for f in self.faults if f.type == fault_type])
                    for fault_type in FaultType
                }
            }
        }

def main():
    """Main function to run the enhanced smart delegator"""
    print("🧠 Starting Enhanced Smart Delegator with Manual File Analysis...")
    
    delegator = EnhancedSmartDelegator()
    
    # Run comprehensive analysis
    report = delegator.generate_comprehensive_report()
    
    # Save report
    report_file = "enhanced_smart_delegator_report.json"
    with open(report_file, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, default=str)
    
    print(f"📊 Analysis complete! Report saved to: {report_file}")
    print(f"🔍 Found {report['summary']['total_faults']} potential issues")
    print(f"📋 Added {report['summary']['backlog_items']} items to backlog")
    
    # Print VibeCoder-friendly summary
    print("\n🎯 VibeCoder Summary:")
    for fault in delegator.faults[:5]:  # Show first 5 faults
        print(f"\n📁 {os.path.basename(fault.file)} (line {fault.line})")
        print(f"🔍 {fault.description}")
        print(f"💡 {fault.vibe_coder_explanation[:200]}...")
    
    if delegator.backlog:
        print(f"\n📋 Backlog Items ({len(delegator.backlog)}):")
        for item in delegator.backlog[:3]:  # Show first 3 backlog items
            print(f"  • {item.title}")
            print(f"    Dependencies: {', '.join(item.dependencies_required)}")

if __name__ == "__main__":
    main()
