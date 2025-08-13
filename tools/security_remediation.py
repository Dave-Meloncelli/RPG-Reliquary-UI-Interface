#!/usr/bin/env python3
"""
Security Remediation Script
Addresses the 86 vulnerabilities reported by GitHub Dependabot
"""

import json
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Any
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SecurityRemediation:
    """Comprehensive security vulnerability remediation"""
    
    def __init__(self):
        self.root_dir = Path(".")
        self.reports_dir = Path("reports")
        self.reports_dir.mkdir(exist_ok=True)
        
    def run_python_security_audit(self) -> Dict[str, Any]:
        """Run comprehensive Python security audit"""
        logger.info("🔍 Running Python security audit...")
        
        try:
            # Run safety scan
            result = subprocess.run(
                ["safety", "scan", "--json"],
                capture_output=True,
                text=True,
                timeout=60
            )
            
            if result.returncode == 0:
                vulnerabilities = json.loads(result.stdout)
                logger.info(f"✅ Python security audit completed: {len(vulnerabilities.get('vulnerabilities', []))} vulnerabilities found")
                return {
                    "success": True,
                    "vulnerabilities": vulnerabilities.get('vulnerabilities', []),
                    "total": len(vulnerabilities.get('vulnerabilities', []))
                }
            else:
                logger.error(f"❌ Python security audit failed: {result.stderr}")
                return {"success": False, "error": result.stderr}
                
        except Exception as e:
            logger.error(f"❌ Python security audit error: {e}")
            return {"success": False, "error": str(e)}
    
    def run_npm_security_audit(self) -> Dict[str, Any]:
        """Run comprehensive npm security audit"""
        logger.info("🔍 Running npm security audit...")
        
        try:
            # Run npm audit with JSON output
            result = subprocess.run(
                ["npm", "audit", "--json"],
                capture_output=True,
                text=True,
                timeout=60
            )
            
            if result.returncode in [0, 1]:  # npm audit returns 1 if vulnerabilities found
                audit_data = json.loads(result.stdout)
                vulnerabilities = audit_data.get('vulnerabilities', {})
                total_vulns = sum(len(vulns) for vulns in vulnerabilities.values())
                
                logger.info(f"✅ npm security audit completed: {total_vulns} vulnerabilities found")
                return {
                    "success": True,
                    "vulnerabilities": vulnerabilities,
                    "total": total_vulns,
                    "metadata": audit_data.get('metadata', {})
                }
            else:
                logger.error(f"❌ npm security audit failed: {result.stderr}")
                return {"success": False, "error": result.stderr}
                
        except Exception as e:
            logger.error(f"❌ npm security audit error: {e}")
            return {"success": False, "error": str(e)}
    
    def update_python_dependencies(self) -> Dict[str, Any]:
        """Update Python dependencies to latest secure versions"""
        logger.info("🔄 Updating Python dependencies...")
        
        try:
            # Update critical packages
            critical_packages = [
                "urllib3>=2.5.0",
                "requests>=2.32.4", 
                "certifi>=2025.8.3",
                "charset-normalizer>=3.4.3",
                "beautifulsoup4>=4.13.4",
                "cachetools>=6.1.0",
                "packaging>=25.0",
                "pillow>=11.3.0",
                "numpy>=2.3.2",
                "pandas>=2.3.1"
            ]
            
            updated_packages = []
            failed_packages = []
            
            for package in critical_packages:
                try:
                    result = subprocess.run(
                        ["pip", "install", "--upgrade", package],
                        capture_output=True,
                        text=True,
                        timeout=30
                    )
                    
                    if result.returncode == 0:
                        updated_packages.append(package)
                        logger.info(f"✅ Updated {package}")
                    else:
                        failed_packages.append(package)
                        logger.warning(f"⚠️ Failed to update {package}: {result.stderr}")
                        
                except Exception as e:
                    failed_packages.append(package)
                    logger.error(f"❌ Error updating {package}: {e}")
            
            return {
                "success": True,
                "updated_packages": updated_packages,
                "failed_packages": failed_packages,
                "total_updated": len(updated_packages),
                "total_failed": len(failed_packages)
            }
            
        except Exception as e:
            logger.error(f"❌ Python dependency update error: {e}")
            return {"success": False, "error": str(e)}
    
    def update_npm_dependencies(self) -> Dict[str, Any]:
        """Update npm dependencies to latest secure versions"""
        logger.info("🔄 Updating npm dependencies...")
        
        try:
            # Update all packages
            result = subprocess.run(
                ["npm", "update"],
                capture_output=True,
                text=True,
                timeout=120
            )
            
            if result.returncode == 0:
                logger.info("✅ npm dependencies updated successfully")
                return {"success": True, "message": "npm dependencies updated"}
            else:
                logger.error(f"❌ npm update failed: {result.stderr}")
                return {"success": False, "error": result.stderr}
                
        except Exception as e:
            logger.error(f"❌ npm dependency update error: {e}")
            return {"success": False, "error": str(e)}
    
    def generate_security_report(self, python_audit: Dict, npm_audit: Dict, 
                                python_update: Dict, npm_update: Dict) -> Dict[str, Any]:
        """Generate comprehensive security report"""
        logger.info("📊 Generating security report...")
        
        report = {
            "timestamp": subprocess.run(["date"], capture_output=True, text=True).stdout.strip(),
            "summary": {
                "python_vulnerabilities": python_audit.get("total", 0),
                "npm_vulnerabilities": npm_audit.get("total", 0),
                "total_vulnerabilities": (python_audit.get("total", 0) + npm_audit.get("total", 0)),
                "python_packages_updated": python_update.get("total_updated", 0),
                "npm_packages_updated": 1 if npm_update.get("success") else 0
            },
            "python_audit": python_audit,
            "npm_audit": npm_audit,
            "python_updates": python_update,
            "npm_updates": npm_update,
            "recommendations": self._generate_recommendations(python_audit, npm_audit)
        }
        
        # Save report
        report_file = self.reports_dir / f"security_remediation_{int(subprocess.run(['date', '+%s'], capture_output=True, text=True).stdout.strip())}.json"
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        logger.info(f"📄 Security report saved: {report_file}")
        return report
    
    def _generate_recommendations(self, python_audit: Dict, npm_audit: Dict) -> List[str]:
        """Generate security recommendations"""
        recommendations = []
        
        # Python recommendations
        if python_audit.get("total", 0) > 0:
            recommendations.append("🔧 Update vulnerable Python packages to latest versions")
            recommendations.append("🔧 Consider using virtual environments for dependency isolation")
            recommendations.append("🔧 Implement automated security scanning in CI/CD pipeline")
        
        # npm recommendations
        if npm_audit.get("total", 0) > 0:
            recommendations.append("🔧 Update vulnerable npm packages to latest versions")
            recommendations.append("🔧 Consider using npm audit fix for automatic fixes")
            recommendations.append("🔧 Implement dependency pinning for critical packages")
        
        # General recommendations
        recommendations.extend([
            "🔧 Set up automated vulnerability scanning with GitHub Dependabot",
            "🔧 Implement security policy and vulnerability disclosure process",
            "🔧 Regular security audits and dependency updates",
            "🔧 Consider using security-focused package managers",
            "🔧 Implement SBOM (Software Bill of Materials) generation"
        ])
        
        return recommendations
    
    def run_comprehensive_remediation(self) -> Dict[str, Any]:
        """Run comprehensive security remediation"""
        logger.info("🚀 Starting comprehensive security remediation...")
        
        # Run security audits
        python_audit = self.run_python_security_audit()
        npm_audit = self.run_npm_security_audit()
        
        # Update dependencies
        python_update = self.update_python_dependencies()
        npm_update = self.update_npm_dependencies()
        
        # Generate report
        report = self.generate_security_report(python_audit, npm_audit, python_update, npm_update)
        
        # Final audit
        final_python_audit = self.run_python_security_audit()
        final_npm_audit = self.run_npm_security_audit()
        
        report["final_audit"] = {
            "python_vulnerabilities_remaining": final_python_audit.get("total", 0),
            "npm_vulnerabilities_remaining": final_npm_audit.get("total", 0),
            "total_remaining": (final_python_audit.get("total", 0) + final_npm_audit.get("total", 0))
        }
        
        logger.info("✅ Comprehensive security remediation completed")
        return report

def main():
    """Main function"""
    print("🔒 SECURITY REMEDIATION SCRIPT")
    print("=" * 50)
    
    remediation = SecurityRemediation()
    result = remediation.run_comprehensive_remediation()
    
    print("\n📊 REMEDIATION SUMMARY")
    print("=" * 50)
    print(f"Python vulnerabilities: {result['summary']['python_vulnerabilities']}")
    print(f"npm vulnerabilities: {result['summary']['npm_vulnerabilities']}")
    print(f"Total vulnerabilities: {result['summary']['total_vulnerabilities']}")
    print(f"Python packages updated: {result['summary']['python_packages_updated']}")
    print(f"npm packages updated: {result['summary']['npm_packages_updated']}")
    
    if result.get("final_audit"):
        print(f"\n🔍 FINAL AUDIT")
        print(f"Remaining vulnerabilities: {result['final_audit']['total_remaining']}")
    
    print(f"\n📄 Detailed report saved to reports/")
    
    return result

if __name__ == "__main__":
    result = main()
    print(json.dumps(result, indent=2))
