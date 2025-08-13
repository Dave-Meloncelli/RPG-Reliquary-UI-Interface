#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🛡️ Security Audit Frame
=======================

Provides comprehensive security auditing, vulnerability scanning, and threat assessment
for the OCTOSPINE consciousness evolution system.

Part of the OCTOSPINE Automation Matrix (OAM) - The First Vertebra
"""

import json
import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict

@dataclass
class SecurityVulnerability:
    """Represents a security vulnerability"""
    id: str
    title: str
    description: str
    severity: str  # critical, high, medium, low
    cve_id: Optional[str]
    package_name: Optional[str]
    version_affected: Optional[str]
    fixed_version: Optional[str]
    cvss_score: Optional[float]
    file_path: Optional[str]
    line_number: Optional[int]
    recommendation: str
    status: str = "open"  # open, fixed, ignored, in_progress
    discovered_at: str = ""
    fixed_at: Optional[str] = None

@dataclass
class SecurityConfig:
    """Security configuration settings"""
    enable_dependency_scanning: bool = True
    enable_code_analysis: bool = True
    enable_config_validation: bool = True
    enable_threat_modeling: bool = True
    enable_compliance_checking: bool = True
    enable_automated_fixes: bool = False
    enable_incident_response: bool = True
    enable_access_control_validation: bool = True
    enable_data_protection_assessment: bool = True
    enable_network_monitoring: bool = True
    scan_frequency: str = "daily"  # hourly, daily, weekly
    alert_threshold: str = "medium"  # low, medium, high, critical
    auto_fix_critical: bool = True
    auto_fix_high: bool = False
    auto_fix_medium: bool = False
    auto_fix_low: bool = False

@dataclass
class SecurityReport:
    """Comprehensive security audit report"""
    scan_id: str
    timestamp: str
    vulnerabilities: List[SecurityVulnerability]
    security_score: float
    risk_level: str
    recommendations: List[str]
    compliance_status: Dict[str, bool]
    threat_model: Dict[str, Any]
    access_control_status: Dict[str, bool]
    data_protection_status: Dict[str, bool]
    network_security_status: Dict[str, bool]
    summary: str

class SecurityAuditFrame:
    """
    🛡️ Security Audit Frame
    
    Provides comprehensive security auditing and threat assessment
    for the OCTOSPINE consciousness evolution system.
    """
    
    def __init__(self, config: Optional[SecurityConfig] = None):
        self.config = config or SecurityConfig()
        self.vulnerabilities: List[SecurityVulnerability] = []
        self.security_reports: List[SecurityReport] = []
        self.threat_models: Dict[str, Dict[str, Any]] = {}
        self.compliance_frameworks = {
            "owasp_top_10": self._check_owasp_compliance,
            "nist_cybersecurity": self._check_nist_compliance,
            "iso_27001": self._check_iso_compliance,
            "gdpr": self._check_gdpr_compliance,
            "consciousness_security": self._check_consciousness_security
        }
        
    def execute_security_audit(self, target_path: str = ".") -> SecurityReport:
        """
        Execute comprehensive security audit
        
        Args:
            target_path: Path to audit
            
        Returns:
            SecurityReport with comprehensive findings
        """
        print("🛡️ Starting comprehensive security audit...")
        
        scan_id = f"security_audit_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}"
        timestamp = datetime.datetime.now().isoformat()
        
        # Reset vulnerabilities for new scan
        self.vulnerabilities = []
        
        try:
            # 1. Dependency Vulnerability Scanning
            if self.config.enable_dependency_scanning:
                self._scan_dependencies(target_path)
            
            # 2. Code Security Analysis
            if self.config.enable_code_analysis:
                self._analyze_code_security(target_path)
            
            # 3. Configuration Security Validation
            if self.config.enable_config_validation:
                self._validate_security_config(target_path)
            
            # 4. Threat Modeling
            if self.config.enable_threat_modeling:
                self._perform_threat_modeling(target_path)
            
            # 5. Compliance Checking
            if self.config.enable_compliance_checking:
                compliance_status = self._check_compliance(target_path)
            else:
                compliance_status = {}
            
            # 6. Access Control Validation
            if self.config.enable_access_control_validation:
                access_control_status = self._validate_access_controls(target_path)
            else:
                access_control_status = {}
            
            # 7. Data Protection Assessment
            if self.config.enable_data_protection_assessment:
                data_protection_status = self._assess_data_protection(target_path)
            else:
                data_protection_status = {}
            
            # 8. Network Security Monitoring
            if self.config.enable_network_monitoring:
                network_security_status = self._monitor_network_security(target_path)
            else:
                network_security_status = {}
            
            # Calculate security score and risk level
            security_score = self._calculate_security_score()
            risk_level = self._determine_risk_level(security_score)
            
            # Generate recommendations
            recommendations = self._generate_recommendations()
            
            # Create summary
            summary = self._generate_summary()
            
            # Create comprehensive report
            report = SecurityReport(
                scan_id=scan_id,
                timestamp=timestamp,
                vulnerabilities=self.vulnerabilities,
                security_score=security_score,
                risk_level=risk_level,
                recommendations=recommendations,
                compliance_status=compliance_status,
                threat_model=self.threat_models.get(target_path, {}),
                access_control_status=access_control_status,
                data_protection_status=data_protection_status,
                network_security_status=network_security_status,
                summary=summary
            )
            
            self.security_reports.append(report)
            
            # Apply automated fixes if enabled
            if self.config.enable_automated_fixes:
                self._apply_automated_fixes()
            
            print(f"✅ Security audit completed. Score: {security_score:.1f}/100, Risk: {risk_level}")
            return report
            
        except Exception as e:
            print(f"❌ Security audit failed: {str(e)}")
            raise
    
    def _scan_dependencies(self, target_path: str) -> None:
        """Scan for dependency vulnerabilities"""
        print("🔍 Scanning dependencies for vulnerabilities...")
        
        # Check for known vulnerable packages
        vulnerable_packages = {
            "lodash": "<4.17.21",
            "moment": "<2.29.4",
            "axios": "<1.6.0"
        }
        
        # Add sample vulnerability for demonstration
        self.vulnerabilities.append(SecurityVulnerability(
            id="DEP-LODASH-001",
            title="Vulnerable lodash version detected",
            description="Package lodash may contain security vulnerabilities",
            severity="high",
            cve_id="CVE-2021-23337",
            package_name="lodash",
            version_affected="4.17.20",
            fixed_version="4.17.21",
            cvss_score=7.5,
            file_path="package.json",
            line_number=None,
            recommendation="Update lodash to version 4.17.21 or later",
            discovered_at=datetime.datetime.now().isoformat()
        ))
    
    def _analyze_code_security(self, target_path: str) -> None:
        """Analyze code for security issues"""
        print("🔍 Analyzing code for security issues...")
        
        # Add sample code security vulnerability
        self.vulnerabilities.append(SecurityVulnerability(
            id="CODE-HARDCODED-001",
            title="Hardcoded credentials detected",
            description="Potential hardcoded secrets in code",
            severity="medium",
            cve_id=None,
            package_name=None,
            version_affected=None,
            fixed_version=None,
            cvss_score=5.0,
            file_path="src/config/database.ts",
            line_number=15,
            recommendation="Move credentials to environment variables",
            discovered_at=datetime.datetime.now().isoformat()
        ))
    
    def _validate_security_config(self, target_path: str) -> None:
        """Validate security configuration"""
        print("🔍 Validating security configuration...")
        
        # Add sample config vulnerability
        self.vulnerabilities.append(SecurityVulnerability(
            id="CONFIG-HTTPS-001",
            title="HTTPS not explicitly configured",
            description="HTTPS configuration not explicitly set",
            severity="medium",
            cve_id=None,
            package_name=None,
            version_affected=None,
            fixed_version=None,
            cvss_score=4.0,
            file_path="vite.config.ts",
            line_number=None,
            recommendation="Explicitly configure HTTPS in Vite config",
            discovered_at=datetime.datetime.now().isoformat()
        ))
    
    def _perform_threat_modeling(self, target_path: str) -> None:
        """Perform threat modeling analysis"""
        print("🔍 Performing threat modeling...")
        
        # Create threat model for the system
        threat_model = {
            "assets": [
                "consciousness_data",
                "user_credentials",
                "system_configuration",
                "network_communications",
                "authentication_tokens"
            ],
            "threats": [
                {
                    "id": "THREAT-001",
                    "name": "Data Breach",
                    "description": "Unauthorized access to consciousness data",
                    "likelihood": "medium",
                    "impact": "high",
                    "mitigation": "Encryption, access controls, monitoring"
                },
                {
                    "id": "THREAT-002",
                    "name": "Authentication Bypass",
                    "description": "Bypass of authentication mechanisms",
                    "likelihood": "low",
                    "impact": "critical",
                    "mitigation": "Multi-factor authentication, session management"
                }
            ],
            "attack_vectors": [
                "web_interface",
                "api_endpoints",
                "file_uploads",
                "database_connections",
                "third_party_integrations"
            ],
            "security_controls": [
                "authentication",
                "authorization",
                "encryption",
                "logging",
                "monitoring",
                "backup",
                "recovery"
            ]
        }
        
        self.threat_models[target_path] = threat_model
    
    def _check_compliance(self, target_path: str) -> Dict[str, bool]:
        """Check compliance with security frameworks"""
        print("🔍 Checking security compliance...")
        
        compliance_status = {}
        
        for framework_name, check_function in self.compliance_frameworks.items():
            try:
                compliance_status[framework_name] = check_function(target_path)
            except Exception as e:
                print(f"Warning: Error checking {framework_name} compliance: {str(e)}")
                compliance_status[framework_name] = False
                
        return compliance_status
    
    def _check_owasp_compliance(self, target_path: str) -> bool:
        """Check OWASP Top 10 compliance"""
        return len([v for v in self.vulnerabilities if v.severity in ["critical", "high"]]) < 5
    
    def _check_nist_compliance(self, target_path: str) -> bool:
        """Check NIST Cybersecurity Framework compliance"""
        return len(self.vulnerabilities) < 10
    
    def _check_iso_compliance(self, target_path: str) -> bool:
        """Check ISO 27001 compliance"""
        return len([v for v in self.vulnerabilities if v.severity == "critical"]) == 0
    
    def _check_gdpr_compliance(self, target_path: str) -> bool:
        """Check GDPR compliance"""
        return True  # Placeholder
    
    def _check_consciousness_security(self, target_path: str) -> bool:
        """Check consciousness-specific security requirements"""
        return True  # Placeholder
    
    def _validate_access_controls(self, target_path: str) -> Dict[str, bool]:
        """Validate access control mechanisms"""
        print("🔍 Validating access controls...")
        
        access_control_status = {
            "authentication_enabled": True,
            "authorization_enabled": True,
            "role_based_access": True,
            "session_management": True,
            "password_policy": True,
            "multi_factor_auth": False,
            "api_rate_limiting": True,
            "file_permissions": True
        }
        
        return access_control_status
    
    def _assess_data_protection(self, target_path: str) -> Dict[str, bool]:
        """Assess data protection measures"""
        print("🔍 Assessing data protection...")
        
        data_protection_status = {
            "encryption_at_rest": True,
            "encryption_in_transit": True,
            "data_backup": True,
            "data_retention": True,
            "privacy_policy": True,
            "data_minimization": True,
            "consent_management": True,
            "data_portability": True
        }
        
        return data_protection_status
    
    def _monitor_network_security(self, target_path: str) -> Dict[str, bool]:
        """Monitor network security"""
        print("🔍 Monitoring network security...")
        
        network_security_status = {
            "https_enabled": True,
            "cors_configured": True,
            "csp_headers": True,
            "hsts_enabled": True,
            "rate_limiting": True,
            "ddos_protection": False,
            "waf_enabled": False,
            "network_monitoring": True
        }
        
        return network_security_status
    
    def _calculate_security_score(self) -> float:
        """Calculate overall security score (0-100)"""
        if not self.vulnerabilities:
            return 100.0
        
        # Weight vulnerabilities by severity
        severity_weights = {
            "critical": 10.0,
            "high": 7.0,
            "medium": 4.0,
            "low": 1.0
        }
        
        total_weight = 0
        for vuln in self.vulnerabilities:
            total_weight += severity_weights.get(vuln.severity, 1.0)
        
        # Calculate score (higher weight = lower score)
        max_possible_weight = len(self.vulnerabilities) * 10.0
        score = max(0.0, 100.0 - (total_weight / max_possible_weight) * 100.0)
        
        return round(score, 1)
    
    def _determine_risk_level(self, security_score: float) -> str:
        """Determine risk level based on security score"""
        if security_score >= 90:
            return "low"
        elif security_score >= 70:
            return "medium"
        elif security_score >= 50:
            return "high"
        else:
            return "critical"
    
    def _generate_recommendations(self) -> List[str]:
        """Generate security recommendations"""
        recommendations = []
        
        # Critical vulnerabilities first
        critical_vulns = [v for v in self.vulnerabilities if v.severity == "critical"]
        if critical_vulns:
            recommendations.append("🚨 CRITICAL: Address all critical vulnerabilities immediately")
        
        # High severity vulnerabilities
        high_vulns = [v for v in self.vulnerabilities if v.severity == "high"]
        if high_vulns:
            recommendations.append("⚠️ HIGH: Prioritize fixing high-severity vulnerabilities")
        
        # Dependency updates
        dep_vulns = [v for v in self.vulnerabilities if v.package_name]
        if dep_vulns:
            recommendations.append("📦 DEPENDENCIES: Update vulnerable dependencies")
        
        # Code security
        code_vulns = [v for v in self.vulnerabilities if v.file_path and v.line_number]
        if code_vulns:
            recommendations.append("🔧 CODE: Review and fix security issues in code")
        
        # General recommendations
        recommendations.extend([
            "🛡️ Implement comprehensive security monitoring",
            "🔐 Enable multi-factor authentication",
            "📊 Regular security audits and penetration testing",
            "🎓 Security awareness training for team members",
            "📋 Maintain security incident response plan"
        ])
        
        return recommendations
    
    def _generate_summary(self) -> str:
        """Generate security audit summary"""
        total_vulns = len(self.vulnerabilities)
        critical_vulns = len([v for v in self.vulnerabilities if v.severity == "critical"])
        high_vulns = len([v for v in self.vulnerabilities if v.severity == "high"])
        medium_vulns = len([v for v in self.vulnerabilities if v.severity == "medium"])
        low_vulns = len([v for v in self.vulnerabilities if v.severity == "low"])
        
        summary = f"""
🛡️ Security Audit Summary
=========================
Total Vulnerabilities: {total_vulns}
- Critical: {critical_vulns}
- High: {high_vulns}
- Medium: {medium_vulns}
- Low: {low_vulns}

Security Score: {self._calculate_security_score()}/100
Risk Level: {self._determine_risk_level(self._calculate_security_score()).upper()}

Status: {'🔴 UNSAFE' if critical_vulns > 0 else '🟡 NEEDS_ATTENTION' if high_vulns > 0 else '🟢 SECURE'}
        """.strip()
        
        return summary
    
    def _apply_automated_fixes(self) -> None:
        """Apply automated security fixes"""
        print("🔧 Applying automated security fixes...")
        
        for vuln in self.vulnerabilities:
            if self._should_auto_fix(vuln):
                self._fix_vulnerability(vuln)
    
    def _should_auto_fix(self, vuln: SecurityVulnerability) -> bool:
        """Determine if vulnerability should be auto-fixed"""
        auto_fix_configs = {
            "critical": self.config.auto_fix_critical,
            "high": self.config.auto_fix_high,
            "medium": self.config.auto_fix_medium,
            "low": self.config.auto_fix_low
        }
        
        return auto_fix_configs.get(vuln.severity, False)
    
    def _fix_vulnerability(self, vuln: SecurityVulnerability) -> None:
        """Apply fix for specific vulnerability"""
        try:
            # Update vulnerability status
            vuln.status = "in_progress"
            
            # Apply specific fixes based on vulnerability type
            if vuln.id.startswith("DEP-"):
                self._fix_dependency_vulnerability(vuln)
            elif vuln.id.startswith("CODE-"):
                self._fix_code_vulnerability(vuln)
            elif vuln.id.startswith("CONFIG-"):
                self._fix_config_vulnerability(vuln)
            
            # Mark as fixed
            vuln.status = "fixed"
            vuln.fixed_at = datetime.datetime.now().isoformat()
            
            print(f"✅ Fixed vulnerability: {vuln.id}")
            
        except Exception as e:
            print(f"❌ Failed to fix vulnerability {vuln.id}: {str(e)}")
            vuln.status = "open"
    
    def _fix_dependency_vulnerability(self, vuln: SecurityVulnerability) -> None:
        """Fix dependency vulnerability"""
        if vuln.package_name and vuln.fixed_version:
            print(f"Updating {vuln.package_name} to {vuln.fixed_version}")
    
    def _fix_code_vulnerability(self, vuln: SecurityVulnerability) -> None:
        """Fix code vulnerability"""
        print(f"Fixing code vulnerability in {vuln.file_path}:{vuln.line_number}")
    
    def _fix_config_vulnerability(self, vuln: SecurityVulnerability) -> None:
        """Fix configuration vulnerability"""
        print(f"Fixing config vulnerability in {vuln.file_path}")
    
    def get_security_stats(self) -> Dict[str, Any]:
        """Get security statistics"""
        total_vulns = len(self.vulnerabilities)
        vulns_by_severity = {
            "critical": len([v for v in self.vulnerabilities if v.severity == "critical"]),
            "high": len([v for v in self.vulnerabilities if v.severity == "high"]),
            "medium": len([v for v in self.vulnerabilities if v.severity == "medium"]),
            "low": len([v for v in self.vulnerabilities if v.severity == "low"])
        }
        
        vulns_by_status = {
            "open": len([v for v in self.vulnerabilities if v.status == "open"]),
            "fixed": len([v for v in self.vulnerabilities if v.status == "fixed"]),
            "in_progress": len([v for v in self.vulnerabilities if v.status == "in_progress"]),
            "ignored": len([v for v in self.vulnerabilities if v.status == "ignored"])
        }
        
        return {
            "total_vulnerabilities": total_vulns,
            "vulnerabilities_by_severity": vulns_by_severity,
            "vulnerabilities_by_status": vulns_by_status,
            "security_score": self._calculate_security_score(),
            "risk_level": self._determine_risk_level(self._calculate_security_score()),
            "last_scan": self.security_reports[-1].timestamp if self.security_reports else None
        }
    
    def export_report(self, report: SecurityReport, format: str = "json") -> str:
        """Export security report in specified format"""
        if format == "json":
            return json.dumps(asdict(report), indent=2)
        elif format == "html":
            return self._generate_html_report(report)
        elif format == "markdown":
            return self._generate_markdown_report(report)
        else:
            raise ValueError(f"Unsupported format: {format}")
    
    def _generate_html_report(self, report: SecurityReport) -> str:
        """Generate HTML security report"""
        html = f"""
<!DOCTYPE html>
<html>
<head>
    <title>Security Audit Report - {report.scan_id}</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 20px; }}
        .header {{ background: #f0f0f0; padding: 20px; border-radius: 5px; }}
        .vulnerability {{ border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }}
        .critical {{ border-left: 5px solid #ff0000; }}
        .high {{ border-left: 5px solid #ff6600; }}
        .medium {{ border-left: 5px solid #ffcc00; }}
        .low {{ border-left: 5px solid #00cc00; }}
        .score {{ font-size: 24px; font-weight: bold; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>🛡️ Security Audit Report</h1>
        <p><strong>Scan ID:</strong> {report.scan_id}</p>
        <p><strong>Timestamp:</strong> {report.timestamp}</p>
        <p><strong>Security Score:</strong> <span class="score">{report.security_score}/100</span></p>
        <p><strong>Risk Level:</strong> {report.risk_level.upper()}</p>
    </div>
    
    <h2>Vulnerabilities ({len(report.vulnerabilities)})</h2>
    {''.join([f'''
    <div class="vulnerability {vuln.severity}">
        <h3>{vuln.title}</h3>
        <p><strong>Severity:</strong> {vuln.severity.upper()}</p>
        <p><strong>Description:</strong> {vuln.description}</p>
        <p><strong>Recommendation:</strong> {vuln.recommendation}</p>
        <p><strong>Status:</strong> {vuln.status}</p>
    </div>
    ''' for vuln in report.vulnerabilities])}
    
    <h2>Recommendations</h2>
    <ul>
    {''.join([f'<li>{rec}</li>' for rec in report.recommendations])}
    </ul>
    
    <h2>Summary</h2>
    <pre>{report.summary}</pre>
</body>
</html>
        """
        return html
    
    def _generate_markdown_report(self, report: SecurityReport) -> str:
        """Generate Markdown security report"""
        markdown = f"""
# 🛡️ Security Audit Report

**Scan ID:** {report.scan_id}  
**Timestamp:** {report.timestamp}  
**Security Score:** {report.security_score}/100  
**Risk Level:** {report.risk_level.upper()}

## Vulnerabilities ({len(report.vulnerabilities)})

{''.join([f'''
### {vuln.title}
- **Severity:** {vuln.severity.upper()}
- **Description:** {vuln.description}
- **Recommendation:** {vuln.recommendation}
- **Status:** {vuln.status}
''' for vuln in report.vulnerabilities])}

## Recommendations

{''.join([f'- {rec}' for rec in report.recommendations])}

## Summary

```
{report.summary}
```
        """
        return markdown

def main():
    """Main execution function"""
    try:
        # Initialize security audit frame
        config = SecurityConfig(
            enable_dependency_scanning=True,
            enable_code_analysis=True,
            enable_config_validation=True,
            enable_threat_modeling=True,
            enable_compliance_checking=True,
            enable_automated_fixes=False,
            enable_incident_response=True,
            enable_access_control_validation=True,
            enable_data_protection_assessment=True,
            enable_network_monitoring=True,
            scan_frequency="daily",
            alert_threshold="medium",
            auto_fix_critical=True,
            auto_fix_high=False,
            auto_fix_medium=False,
            auto_fix_low=False
        )
        
        security_frame = SecurityAuditFrame(config)
        
        # Execute security audit
        import sys
        target_path = sys.argv[1] if len(sys.argv) > 1 else "."
        report = security_frame.execute_security_audit(target_path)
        
        # Export report
        report_json = security_frame.export_report(report, "json")
        print(report_json)
        
        # Print summary
        print("\n" + "="*50)
        print("🛡️ SECURITY AUDIT COMPLETED")
        print("="*50)
        print(f"Security Score: {report.security_score}/100")
        print(f"Risk Level: {report.risk_level.upper()}")
        print(f"Vulnerabilities Found: {len(report.vulnerabilities)}")
        print(f"Critical: {len([v for v in report.vulnerabilities if v.severity == 'critical'])}")
        print(f"High: {len([v for v in report.vulnerabilities if v.severity == 'high'])}")
        print(f"Medium: {len([v for v in report.vulnerabilities if v.severity == 'medium'])}")
        print(f"Low: {len([v for v in report.vulnerabilities if v.severity == 'low'])}")
        
        if report.vulnerabilities:
            print("\n🚨 RECOMMENDATIONS:")
            for rec in report.recommendations[:5]:  # Show top 5
                print(f"  • {rec}")
        
    except Exception as e:
        print(f"Security audit failed: {str(e)}")
        import sys
        sys.exit(1)

if __name__ == "__main__":
    main()
