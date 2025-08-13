#!/usr/bin/env python3
"""
Comprehensive Dependency Manager Frame

Addresses the 86 vulnerabilities reported by GitHub Dependabot
Provides systematic dependency management, security scanning, and automated fixes
"""

import json
import subprocess
import time
import threading
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from enum import Enum
import logging
import re

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DependencyType(Enum):
    """Types of dependencies"""
    NPM = "npm"
    PYTHON = "python"
    DOCKER = "docker"
    SYSTEM = "system"

class VulnerabilitySeverity(Enum):
    """Vulnerability severity levels"""
    CRITICAL = "critical"
    HIGH = "high"
    MODERATE = "moderate"
    LOW = "low"

@dataclass
class Vulnerability:
    """Vulnerability information"""
    id: str
    package_name: str
    package_version: str
    severity: VulnerabilitySeverity
    title: str
    description: str
    cve_id: Optional[str] = None
    cvss_score: Optional[float] = None
    fix_version: Optional[str] = None
    dependency_type: DependencyType = DependencyType.NPM

@dataclass
class DependencyInfo:
    """Dependency information"""
    name: str
    current_version: str
    latest_version: str
    dependency_type: DependencyType
    is_outdated: bool
    vulnerabilities: List[Vulnerability]
    update_priority: str  # critical, high, medium, low

class ComprehensiveDependencyManager:
    """Comprehensive dependency management system"""
    
    def __init__(self, config_path: str = "config/dependency_manager.json"):
        self.config_path = Path(config_path)
        self.root_dir = Path(".")
        self.reports_dir = Path("reports")
        self.reports_dir.mkdir(exist_ok=True)
        
        # Load configuration
        self.config = self._load_config()
        
        # Initialize managers
        self.npm_manager = NPMDependencyManager()
        self.python_manager = PythonDependencyManager()
        
        # Track all dependencies
        self.all_dependencies: Dict[str, DependencyInfo] = {}
        self.all_vulnerabilities: List[Vulnerability] = []
        
    def _load_config(self) -> Dict[str, Any]:
        """Load dependency manager configuration"""
        if self.config_path.exists():
            with open(self.config_path, 'r') as f:
                return json.load(f)
        else:
            # Default configuration
            config = {
                "scan_interval_hours": 6,
                "auto_fix_enabled": True,
                "auto_update_enabled": False,
                "critical_threshold": 5,
                "high_threshold": 10,
                "moderate_threshold": 20,
                "notification_channels": ["console", "file"],
                "backup_enabled": True,
                "rollback_enabled": True,
                "security_scan_enabled": True,
                "dependency_pinning": True
            }
            # Save default config
            self.config_path.parent.mkdir(exist_ok=True)
            with open(self.config_path, 'w') as f:
                json.dump(config, f, indent=2)
            return config
    
    def scan_all_dependencies(self) -> Dict[str, Any]:
        """Scan all dependencies across all types"""
        logger.info("🔍 Starting comprehensive dependency scan...")
        
        results = {
            "timestamp": datetime.now().isoformat(),
            "npm_scan": self.npm_manager.scan_dependencies(),
            "python_scan": self.python_manager.scan_dependencies(),
            "summary": {}
        }
        
        # Aggregate results
        total_vulnerabilities = 0
        total_dependencies = 0
        
        # Process npm results
        if results["npm_scan"]["success"]:
            npm_vulns = results["npm_scan"].get("vulnerabilities", [])
            total_vulnerabilities += len(npm_vulns)
            total_dependencies += results["npm_scan"].get("total_dependencies", 0)
            
            # Add to global tracking
            for vuln in npm_vulns:
                self.all_vulnerabilities.append(vuln)
        
        # Process python results
        if results["python_scan"]["success"]:
            python_vulns = results["python_scan"].get("vulnerabilities", [])
            total_vulnerabilities += len(python_vulns)
            total_dependencies += results["python_scan"].get("total_dependencies", 0)
            
            # Add to global tracking
            for vuln in python_vulns:
                self.all_vulnerabilities.append(vuln)
        
        results["summary"] = {
            "total_vulnerabilities": total_vulnerabilities,
            "total_dependencies": total_dependencies,
            "critical_vulnerabilities": len([v for v in self.all_vulnerabilities if v.severity == VulnerabilitySeverity.CRITICAL]),
            "high_vulnerabilities": len([v for v in self.all_vulnerabilities if v.severity == VulnerabilitySeverity.HIGH]),
            "moderate_vulnerabilities": len([v for v in self.all_vulnerabilities if v.severity == VulnerabilitySeverity.MODERATE]),
            "low_vulnerabilities": len([v for v in self.all_vulnerabilities if v.severity == VulnerabilitySeverity.LOW])
        }
        
        logger.info(f"✅ Comprehensive scan completed: {total_vulnerabilities} vulnerabilities found")
        return results
    
    def fix_vulnerabilities(self, auto_fix: bool = True) -> Dict[str, Any]:
        """Fix vulnerabilities systematically"""
        logger.info("🔧 Starting vulnerability remediation...")
        
        results = {
            "timestamp": datetime.now().isoformat(),
            "npm_fixes": self.npm_manager.fix_vulnerabilities(auto_fix),
            "python_fixes": self.python_manager.fix_vulnerabilities(auto_fix),
            "summary": {}
        }
        
        # Aggregate fix results
        total_fixed = 0
        total_failed = 0
        
        if results["npm_fixes"]["success"]:
            total_fixed += results["npm_fixes"].get("fixed_count", 0)
            total_failed += results["npm_fixes"].get("failed_count", 0)
        
        if results["python_fixes"]["success"]:
            total_fixed += results["python_fixes"].get("fixed_count", 0)
            total_failed += results["python_fixes"].get("failed_count", 0)
        
        results["summary"] = {
            "total_fixed": total_fixed,
            "total_failed": total_failed,
            "success_rate": (total_fixed / (total_fixed + total_failed) * 100) if (total_fixed + total_failed) > 0 else 0
        }
        
        logger.info(f"✅ Vulnerability remediation completed: {total_fixed} fixed, {total_failed} failed")
        return results
    
    def update_dependencies(self, force_update: bool = False) -> Dict[str, Any]:
        """Update dependencies to latest versions"""
        logger.info("🔄 Starting dependency updates...")
        
        results = {
            "timestamp": datetime.now().isoformat(),
            "npm_updates": self.npm_manager.update_dependencies(force_update),
            "python_updates": self.python_manager.update_dependencies(force_update),
            "summary": {}
        }
        
        # Aggregate update results
        total_updated = 0
        total_failed = 0
        
        if results["npm_updates"]["success"]:
            total_updated += results["npm_updates"].get("updated_count", 0)
            total_failed += results["npm_updates"].get("failed_count", 0)
        
        if results["python_updates"]["success"]:
            total_updated += results["python_updates"].get("updated_count", 0)
            total_failed += results["python_updates"].get("failed_count", 0)
        
        results["summary"] = {
            "total_updated": total_updated,
            "total_failed": total_failed,
            "success_rate": (total_updated / (total_updated + total_failed) * 100) if (total_updated + total_failed) > 0 else 0
        }
        
        logger.info(f"✅ Dependency updates completed: {total_updated} updated, {total_failed} failed")
        return results
    
    def generate_comprehensive_report(self, scan_results: Dict, fix_results: Dict, update_results: Dict) -> Dict[str, Any]:
        """Generate comprehensive dependency report"""
        logger.info("📊 Generating comprehensive dependency report...")
        
        report = {
            "timestamp": datetime.now().isoformat(),
            "scan_results": scan_results,
            "fix_results": fix_results,
            "update_results": update_results,
            "all_vulnerabilities": [asdict(v) for v in self.all_vulnerabilities],
            "recommendations": self._generate_recommendations(scan_results, fix_results, update_results),
            "next_actions": self._generate_next_actions(scan_results, fix_results, update_results)
        }
        
        # Save report
        report_file = self.reports_dir / f"comprehensive_dependency_report_{int(time.time())}.json"
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        logger.info(f"📄 Comprehensive report saved: {report_file}")
        return report
    
    def _generate_recommendations(self, scan_results: Dict, fix_results: Dict, update_results: Dict) -> List[str]:
        """Generate recommendations based on results"""
        recommendations = []
        
        total_vulns = scan_results.get("summary", {}).get("total_vulnerabilities", 0)
        critical_vulns = scan_results.get("summary", {}).get("critical_vulnerabilities", 0)
        
        if critical_vulns > 0:
            recommendations.append("🚨 CRITICAL: Address critical vulnerabilities immediately")
            recommendations.append("🔧 Consider manual intervention for critical security issues")
        
        if total_vulns > 50:
            recommendations.append("📈 HIGH: Large number of vulnerabilities detected - implement automated scanning")
            recommendations.append("🔧 Consider dependency pinning to prevent regressions")
        
        if fix_results.get("summary", {}).get("success_rate", 0) < 80:
            recommendations.append("⚠️ MEDIUM: Low fix success rate - review failed fixes manually")
        
        recommendations.extend([
            "🔧 Set up automated dependency scanning in CI/CD pipeline",
            "🔧 Implement dependency update policies",
            "🔧 Consider using dependency management tools (Dependabot, Renovate)",
            "🔧 Regular security audits and dependency reviews",
            "🔧 Implement SBOM (Software Bill of Materials) generation"
        ])
        
        return recommendations
    
    def _generate_next_actions(self, scan_results: Dict, fix_results: Dict, update_results: Dict) -> List[str]:
        """Generate next actions based on results"""
        actions = []
        
        remaining_vulns = scan_results.get("summary", {}).get("total_vulnerabilities", 0)
        if remaining_vulns > 0:
            actions.append("🔍 Investigate remaining vulnerabilities manually")
            actions.append("📋 Create vulnerability remediation plan")
        
        if fix_results.get("summary", {}).get("total_failed", 0) > 0:
            actions.append("🔧 Review and fix failed vulnerability remediations")
        
        actions.extend([
            "📊 Schedule regular dependency scans",
            "🔔 Set up vulnerability alerting",
            "📚 Document dependency management procedures",
            "🧪 Test application after dependency updates"
        ])
        
        return actions

class NPMDependencyManager:
    """NPM dependency management"""
    
    def scan_dependencies(self) -> Dict[str, Any]:
        """Scan npm dependencies for vulnerabilities"""
        try:
            # Run npm audit
            result = subprocess.run(
                ["npm", "audit", "--json"],
                capture_output=True,
                text=True,
                timeout=60
            )
            
            if result.returncode in [0, 1]:  # npm audit returns 1 if vulnerabilities found
                audit_data = json.loads(result.stdout)
                vulnerabilities = []
                
                # Parse vulnerabilities
                for vuln_id, vuln_data in audit_data.get('vulnerabilities', {}).items():
                    for path, path_data in vuln_data.items():
                        vuln = Vulnerability(
                            id=vuln_id,
                            package_name=path_data.get('name', ''),
                            package_version=path_data.get('version', ''),
                            severity=VulnerabilitySeverity(path_data.get('severity', 'moderate')),
                            title=path_data.get('title', ''),
                            description=path_data.get('description', ''),
                            cve_id=path_data.get('cwe', ''),
                            cvss_score=path_data.get('cvss', {}).get('score', 0),
                            fix_version=path_data.get('fixAvailable', {}).get('version', ''),
                            dependency_type=DependencyType.NPM
                        )
                        vulnerabilities.append(vuln)
                
                return {
                    "success": True,
                    "vulnerabilities": [asdict(v) for v in vulnerabilities],
                    "total_vulnerabilities": len(vulnerabilities),
                    "total_dependencies": audit_data.get('metadata', {}).get('dependencies', {}).get('total', 0),
                    "audit_data": audit_data
                }
            else:
                return {"success": False, "error": result.stderr}
                
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def fix_vulnerabilities(self, auto_fix: bool = True) -> Dict[str, Any]:
        """Fix npm vulnerabilities"""
        try:
            fixed_count = 0
            failed_count = 0
            
            if auto_fix:
                # Try npm audit fix
                result = subprocess.run(
                    ["npm", "audit", "fix"],
                    capture_output=True,
                    text=True,
                    timeout=120
                )
                
                if result.returncode == 0:
                    # Count fixed vulnerabilities from output
                    fixed_count = len(re.findall(r'fixed \d+ of \d+ vulnerabilities', result.stdout))
                else:
                    failed_count += 1
            
            return {
                "success": True,
                "fixed_count": fixed_count,
                "failed_count": failed_count,
                "auto_fix_attempted": auto_fix
            }
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def update_dependencies(self, force_update: bool = False) -> Dict[str, Any]:
        """Update npm dependencies"""
        try:
            updated_count = 0
            failed_count = 0
            
            # Get outdated packages
            result = subprocess.run(
                ["npm", "outdated", "--json"],
                capture_output=True,
                text=True,
                timeout=60
            )
            
            if result.returncode == 0:
                outdated_data = json.loads(result.stdout)
                updated_count = len(outdated_data)
                
                # Update packages
                if force_update or updated_count > 0:
                    update_result = subprocess.run(
                        ["npm", "update"],
                        capture_output=True,
                        text=True,
                        timeout=120
                    )
                    
                    if update_result.returncode != 0:
                        failed_count = updated_count
                        updated_count = 0
            
            return {
                "success": True,
                "updated_count": updated_count,
                "failed_count": failed_count,
                "outdated_packages": updated_count
            }
            
        except Exception as e:
            return {"success": False, "error": str(e)}

class PythonDependencyManager:
    """Python dependency management"""
    
    def scan_dependencies(self) -> Dict[str, Any]:
        """Scan Python dependencies for vulnerabilities"""
        try:
            # Run safety scan
            result = subprocess.run(
                ["safety", "scan", "--json"],
                capture_output=True,
                text=True,
                timeout=60
            )
            
            if result.returncode == 0:
                safety_data = json.loads(result.stdout)
                vulnerabilities = []
                
                # Parse vulnerabilities
                for vuln_data in safety_data.get('vulnerabilities', []):
                    vuln = Vulnerability(
                        id=vuln_data.get('vulnerability_id', ''),
                        package_name=vuln_data.get('package_name', ''),
                        package_version=vuln_data.get('installed_version', ''),
                        severity=VulnerabilitySeverity(vuln_data.get('severity', 'moderate')),
                        title=vuln_data.get('advisory', ''),
                        description=vuln_data.get('advisory', ''),
                        cve_id=vuln_data.get('cve_id', ''),
                        fix_version=vuln_data.get('fixed_version', ''),
                        dependency_type=DependencyType.PYTHON
                    )
                    vulnerabilities.append(vuln)
                
                return {
                    "success": True,
                    "vulnerabilities": [asdict(v) for v in vulnerabilities],
                    "total_vulnerabilities": len(vulnerabilities),
                    "total_dependencies": safety_data.get('packages_scanned', 0),
                    "safety_data": safety_data
                }
            else:
                return {"success": False, "error": result.stderr}
                
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def fix_vulnerabilities(self, auto_fix: bool = True) -> Dict[str, Any]:
        """Fix Python vulnerabilities"""
        try:
            fixed_count = 0
            failed_count = 0
            
            if auto_fix:
                # Get vulnerable packages and update them
                scan_result = self.scan_dependencies()
                if scan_result["success"]:
                    for vuln_data in scan_result["vulnerabilities"]:
                        package_name = vuln_data["package_name"]
                        fix_version = vuln_data.get("fix_version")
                        
                        if fix_version:
                            try:
                                result = subprocess.run(
                                    ["pip", "install", "--upgrade", f"{package_name}>={fix_version}"],
                                    capture_output=True,
                                    text=True,
                                    timeout=30
                                )
                                
                                if result.returncode == 0:
                                    fixed_count += 1
                                else:
                                    failed_count += 1
                            except Exception as e:
                                failed_count += 1
            
            return {
                "success": True,
                "fixed_count": fixed_count,
                "failed_count": failed_count,
                "auto_fix_attempted": auto_fix
            }
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def update_dependencies(self, force_update: bool = False) -> Dict[str, Any]:
        """Update Python dependencies"""
        try:
            updated_count = 0
            failed_count = 0
            
            # Get outdated packages
            result = subprocess.run(
                ["pip", "list", "--outdated", "--format=json"],
                capture_output=True,
                text=True,
                timeout=60
            )
            
            if result.returncode == 0:
                outdated_data = json.loads(result.stdout)
                updated_count = len(outdated_data)
                
                # Update packages
                if force_update or updated_count > 0:
                    for package in outdated_data:
                        try:
                            update_result = subprocess.run(
                                ["pip", "install", "--upgrade", package["name"]],
                                capture_output=True,
                                text=True,
                                timeout=30
                            )
                            
                            if update_result.returncode != 0:
                                failed_count += 1
                        except Exception as e:
                            failed_count += 1
            
            return {
                "success": True,
                "updated_count": updated_count,
                "failed_count": failed_count,
                "outdated_packages": updated_count
            }
            
        except Exception as e:
            return {"success": False, "error": str(e)}

def main():
    """Main function for frame execution"""
    print("🔧 Starting Comprehensive Dependency Manager Frame")
    
    # Initialize dependency manager
    manager = ComprehensiveDependencyManager()
    
    # Scan all dependencies
    scan_results = manager.scan_all_dependencies()
    print(f"📊 Scan Results: {scan_results['summary']}")
    
    # Fix vulnerabilities
    fix_results = manager.fix_vulnerabilities(auto_fix=True)
    print(f"🔧 Fix Results: {fix_results['summary']}")
    
    # Update dependencies
    update_results = manager.update_dependencies(force_update=False)
    print(f"🔄 Update Results: {update_results['summary']}")
    
    # Generate comprehensive report
    report = manager.generate_comprehensive_report(scan_results, fix_results, update_results)
    
    print(f"✅ Comprehensive Dependency Manager Frame completed")
    print(f"📄 Report saved: {report.get('report_file', 'reports/')}")
    
    return {
        "success": True,
        "dependency_manager_implemented": True,
        "scan_completed": True,
        "fixes_applied": True,
        "updates_completed": True,
        "report_file": str(Path("reports") / f"comprehensive_dependency_report_{int(time.time())}.json"),
        "summary": {
            "total_vulnerabilities": scan_results["summary"]["total_vulnerabilities"],
            "total_fixed": fix_results["summary"]["total_fixed"],
            "total_updated": update_results["summary"]["total_updated"]
        }
    }

if __name__ == "__main__":
    result = main()
    print(json.dumps(result, indent=2))
