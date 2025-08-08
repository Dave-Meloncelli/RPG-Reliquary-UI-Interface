#!/usr/bin/env python3
"""
Tech Stack Delegator - Multi-Language Intelligent Tooling System

This system provides comprehensive analysis and fixing capabilities across all
languages, services, and products in the AZ Interface ecosystem.

Author: The OctoSpine Forge Master
Date: 2025-08-05
Based on: Tech Stack Silo Architecture
"""

import os
import re
import json
import subprocess
import logging
import asyncio
import aiohttp
from pathlib import Path
from typing import Dict, List, Set, Tuple, Optional, Any
from datetime import datetime, timedelta
import shutil

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class TechStackDelegator:
    """Comprehensive tech stack analysis and management system"""
    
    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root)
        self.tech_database = self.load_tech_database()
        self.github_tracker = GitHubIssueTracker()
        
        # Language detection patterns
        self.language_patterns = {
            'typescript': ['.ts', '.tsx', 'tsconfig.json'],
            'javascript': ['.js', '.jsx', '.mjs', 'package.json'],
            'python': ['.py', 'requirements.txt', 'pyproject.toml', 'setup.py'],
            'java': ['.java', '.jar', 'pom.xml', 'build.gradle'],
            'rust': ['.rs', 'Cargo.toml'],
            'go': ['.go', 'go.mod', 'go.sum'],
            'csharp': ['.cs', '.csproj', '.sln'],
            'php': ['.php', 'composer.json'],
            'ruby': ['.rb', 'Gemfile', 'Rakefile'],
            'kotlin': ['.kt', '.kts'],
            'swift': ['.swift', 'Package.swift'],
            'dart': ['.dart', 'pubspec.yaml'],
            'scala': ['.scala', 'build.sbt'],
            'elixir': ['.ex', '.exs', 'mix.exs'],
            'haskell': ['.hs', '.cabal'],
            'c': ['.c', '.h', 'Makefile'],
            'cpp': ['.cpp', '.cc', '.hpp', 'CMakeLists.txt']
        }
        
        # Service detection patterns
        self.service_patterns = {
            'web_service': ['app.py', 'server.py', 'main.py', 'index.js', 'server.js'],
            'database': ['database.py', 'db.py', 'models.py', 'schema.sql'],
            'cache': ['redis', 'memcached', 'cache.py'],
            'message_queue': ['queue.py', 'rabbitmq', 'kafka'],
            'api_gateway': ['gateway.py', 'api.py', 'routes.py'],
            'monitoring': ['monitoring.py', 'metrics.py', 'health.py'],
            'logging': ['logging.py', 'logger.py', 'log.py'],
            'authentication': ['auth.py', 'auth.js', 'authentication.py'],
            'storage': ['storage.py', 's3.py', 'file.py'],
            'compute': ['worker.py', 'task.py', 'job.py'],
            'network': ['network.py', 'socket.py', 'http.py']
        }
        
        # Product detection patterns
        self.product_patterns = {
            'web_app': ['index.html', 'app.html', 'webpack.config.js', 'vite.config.js'],
            'mobile_app': ['android', 'ios', 'react-native', 'flutter'],
            'desktop_app': ['electron', 'tauri', 'desktop'],
            'cli_tool': ['cli.py', 'cli.js', 'main.py', 'bin/'],
            'library': ['lib/', 'src/', 'dist/', 'package.json'],
            'framework': ['framework', 'django', 'flask', 'express'],
            'plugin': ['plugin', 'extension', 'addon'],
            'microservice': ['service', 'microservice', 'api/'],
            'container': ['Dockerfile', 'docker-compose.yml', '.dockerignore'],
            'serverless': ['serverless.yml', 'functions/', 'lambda/']
        }
    
    def load_tech_database(self) -> Dict[str, Dict]:
        """Load technology database"""
        tech_db_file = Path("config/tech_stack_database.json")
        
        if tech_db_file.exists():
            with open(tech_db_file, 'r') as f:
                return json.load(f)
        else:
            logger.error("Tech stack database not found")
            return {}
    
    def detect_languages(self) -> List[str]:
        """Detect all languages used in the project"""
        detected_languages = set()
        
        for file_path in self.project_root.rglob('*'):
            if file_path.is_file():
                for language, patterns in self.language_patterns.items():
                    if any(file_path.name.endswith(pattern) for pattern in patterns):
                        detected_languages.add(language)
                        break
        
        return list(detected_languages)
    
    def detect_services(self) -> List[str]:
        """Detect services in the project"""
        detected_services = set()
        
        for file_path in self.project_root.rglob('*'):
            if file_path.is_file():
                for service_type, patterns in self.service_patterns.items():
                    if any(pattern in file_path.name.lower() for pattern in patterns):
                        detected_services.add(service_type)
                        break
        
        return list(detected_services)
    
    def detect_products(self) -> List[str]:
        """Detect product types in the project"""
        detected_products = set()
        
        for file_path in self.project_root.rglob('*'):
            if file_path.is_file():
                for product_type, patterns in self.product_patterns.items():
                    if any(pattern in file_path.name.lower() or pattern in str(file_path) for pattern in patterns):
                        detected_products.add(product_type)
                        break
        
        return list(detected_products)
    
    async def analyze_tech_stack(self) -> Dict[str, Any]:
        """Comprehensive analysis of the entire tech stack"""
        logger.info("Starting comprehensive tech stack analysis...")
        
        # Detect technologies
        detected_languages = self.detect_languages()
        detected_services = self.detect_services()
        detected_products = self.detect_products()
        
        logger.info(f"Detected languages: {detected_languages}")
        logger.info(f"Detected services: {detected_services}")
        logger.info(f"Detected products: {detected_products}")
        
        # Analyze each detected technology
        analysis_results = {
            'languages': {},
            'services': {},
            'products': {},
            'github_updates': {},
            'recommendations': [],
            'summary': {}
        }
        
        # Analyze languages
        for language in detected_languages:
            if language in self.tech_database:
                tech_info = self.tech_database[language]
                analysis_results['languages'][language] = await self.analyze_language(language, tech_info)
        
        # Analyze services
        for service in detected_services:
            analysis_results['services'][service] = await self.analyze_service(service)
        
        # Analyze products
        for product in detected_products:
            analysis_results['products'][product] = await self.analyze_product(product)
        
        # Update GitHub information
        analysis_results['github_updates'] = await self.update_github_information()
        
        # Generate recommendations
        analysis_results['recommendations'] = self.generate_recommendations(analysis_results)
        
        # Generate summary
        analysis_results['summary'] = self.generate_summary(analysis_results)
        
        return analysis_results
    
    async def analyze_language(self, language: str, tech_info: Dict) -> Dict[str, Any]:
        """Analyze a specific language"""
        logger.info(f"Analyzing language: {language}")
        
        analysis = {
            'name': tech_info.get('name', language),
            'version': tech_info.get('version', 'unknown'),
            'github_repo': tech_info.get('github_repo'),
            'documentation_url': tech_info.get('documentation_url'),
            'issues_found': [],
            'fixes_applied': [],
            'recommendations': [],
            'risk_level': 'low',
            'priority': 'normal'
        }
        
        # Language-specific analysis
        if language == 'typescript':
            analysis['issues_found'] = await self.analyze_typescript_issues()
        elif language == 'python':
            analysis['issues_found'] = await self.analyze_python_issues()
        elif language == 'javascript':
            analysis['issues_found'] = await self.analyze_javascript_issues()
        elif language == 'java':
            analysis['issues_found'] = await self.analyze_java_issues()
        elif language == 'rust':
            analysis['issues_found'] = await self.analyze_rust_issues()
        elif language == 'go':
            analysis['issues_found'] = await self.analyze_go_issues()
        
        return analysis
    
    async def analyze_service(self, service_type: str) -> Dict[str, Any]:
        """Analyze a specific service type"""
        logger.info(f"Analyzing service: {service_type}")
        
        analysis = {
            'name': service_type,
            'issues_found': [],
            'recommendations': [],
            'risk_level': 'medium',
            'priority': 'normal'
        }
        
        # Service-specific analysis
        if service_type == 'database':
            analysis['issues_found'] = await self.analyze_database_issues()
        elif service_type == 'web_service':
            analysis['issues_found'] = await self.analyze_web_service_issues()
        elif service_type == 'authentication':
            analysis['issues_found'] = await self.analyze_auth_issues()
        elif service_type == 'container':
            analysis['issues_found'] = await self.analyze_container_issues()
        
        return analysis
    
    async def analyze_product(self, product_type: str) -> Dict[str, Any]:
        """Analyze a specific product type"""
        logger.info(f"Analyzing product: {product_type}")
        
        analysis = {
            'name': product_type,
            'issues_found': [],
            'recommendations': [],
            'risk_level': 'medium',
            'priority': 'normal'
        }
        
        # Product-specific analysis
        if product_type == 'web_app':
            analysis['issues_found'] = await self.analyze_web_app_issues()
        elif product_type == 'microservice':
            analysis['issues_found'] = await self.analyze_microservice_issues()
        elif product_type == 'container':
            analysis['issues_found'] = await self.analyze_container_issues()
        
        return analysis
    
    async def analyze_typescript_issues(self) -> List[Dict]:
        """Analyze TypeScript-specific issues"""
        issues = []
        
        # Run TypeScript type check
        try:
            result = subprocess.run(
                ["npm", "run", "type-check"],
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            
            if result.returncode != 0:
                error_count = len([line for line in result.stdout.split('\n') if 'error TS' in line])
                issues.append({
                    'type': 'typescript_errors',
                    'severity': 'high',
                    'message': f'Found {error_count} TypeScript errors',
                    'recommendation': 'Fix TypeScript compilation errors',
                    'count': error_count
                })
        except Exception as e:
            logger.warning(f"Could not run TypeScript type check: {e}")
        
        return issues
    
    async def analyze_python_issues(self) -> List[Dict]:
        """Analyze Python-specific issues"""
        issues = []
        
        # Check for common Python issues
        python_files = list(self.project_root.rglob('*.py'))
        
        for file_path in python_files:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Check for print statements (should use logging)
                if 'print(' in content:
                    issues.append({
                        'type': 'logging',
                        'severity': 'low',
                        'message': f'Use of print() in {file_path.name}',
                        'recommendation': 'Use proper logging instead',
                        'file': str(file_path)
                    })
                
                # Check for hardcoded passwords
                if 'password' in content.lower() and '=' in content:
                    issues.append({
                        'type': 'security',
                        'severity': 'high',
                        'message': f'Potential hardcoded password in {file_path.name}',
                        'recommendation': 'Use environment variables',
                        'file': str(file_path)
                    })
        
        return issues
    
    async def analyze_javascript_issues(self) -> List[Dict]:
        """Analyze JavaScript-specific issues"""
        issues = []
        
        # Check for common JavaScript issues
        js_files = list(self.project_root.rglob('*.js'))
        
        for file_path in js_files:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Check for console.log in production code
                if 'console.log(' in content:
                    issues.append({
                        'type': 'logging',
                        'severity': 'low',
                        'message': f'Use of console.log() in {file_path.name}',
                        'recommendation': 'Use proper logging instead',
                        'file': str(file_path)
                    })
        
        return issues
    
    async def analyze_java_issues(self) -> List[Dict]:
        """Analyze Java-specific issues"""
        issues = []
        
        # Check for common Java issues
        java_files = list(self.project_root.rglob('*.java'))
        
        for file_path in java_files:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Check for potential null pointer exceptions
                if 'null' in content and '==' in content:
                    issues.append({
                        'type': 'null_safety',
                        'severity': 'medium',
                        'message': f'Potential null pointer issue in {file_path.name}',
                        'recommendation': 'Use Optional or null checks',
                        'file': str(file_path)
                    })
        
        return issues
    
    async def analyze_rust_issues(self) -> List[Dict]:
        """Analyze Rust-specific issues"""
        issues = []
        
        # Check for common Rust issues
        rust_files = list(self.project_root.rglob('*.rs'))
        
        for file_path in rust_files:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Check for unsafe code
                if 'unsafe' in content:
                    issues.append({
                        'type': 'safety',
                        'severity': 'high',
                        'message': f'Unsafe code found in {file_path.name}',
                        'recommendation': 'Review and document unsafe blocks',
                        'file': str(file_path)
                    })
        
        return issues
    
    async def analyze_go_issues(self) -> List[Dict]:
        """Analyze Go-specific issues"""
        issues = []
        
        # Check for common Go issues
        go_files = list(self.project_root.rglob('*.go'))
        
        for file_path in go_files:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Check for goroutine leaks
                if 'go ' in content and 'defer' not in content:
                    issues.append({
                        'type': 'concurrency',
                        'severity': 'medium',
                        'message': f'Potential goroutine leak in {file_path.name}',
                        'recommendation': 'Ensure proper cleanup of goroutines',
                        'file': str(file_path)
                    })
        
        return issues
    
    async def analyze_database_issues(self) -> List[Dict]:
        """Analyze database-specific issues"""
        issues = []
        
        # Check SQL files
        sql_files = list(self.project_root.rglob('*.sql'))
        
        for file_path in sql_files:
            with open(file_path, 'r') as f:
                content = f.read()
                
                # Check for SELECT *
                if 'SELECT *' in content:
                    issues.append({
                        'type': 'performance',
                        'severity': 'medium',
                        'message': f'Use of SELECT * in {file_path.name}',
                        'recommendation': 'Specify only needed columns',
                        'file': str(file_path)
                    })
                
                # Check for DROP TABLE
                if 'DROP TABLE' in content:
                    issues.append({
                        'type': 'safety',
                        'severity': 'high',
                        'message': f'DROP TABLE found in {file_path.name}',
                        'recommendation': 'Review and backup before dropping',
                        'file': str(file_path)
                    })
        
        return issues
    
    async def analyze_web_service_issues(self) -> List[Dict]:
        """Analyze web service-specific issues"""
        issues = []
        
        # Check for common web service issues
        service_files = list(self.project_root.rglob('*.py')) + list(self.project_root.rglob('*.js'))
        
        for file_path in service_files:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Check for hardcoded secrets
                if 'secret' in content.lower() and '=' in content:
                    issues.append({
                        'type': 'security',
                        'severity': 'high',
                        'message': f'Potential hardcoded secret in {file_path.name}',
                        'recommendation': 'Use environment variables',
                        'file': str(file_path)
                    })
        
        return issues
    
    async def analyze_auth_issues(self) -> List[Dict]:
        """Analyze authentication-specific issues"""
        issues = []
        
        # Check for common auth issues
        auth_files = list(self.project_root.rglob('*auth*')) + list(self.project_root.rglob('*Auth*'))
        
        for file_path in auth_files:
            if file_path.is_file():
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    # Check for JWT secrets
                    if 'jwt' in content.lower() and 'secret' in content.lower():
                        issues.append({
                            'type': 'security',
                            'severity': 'high',
                            'message': f'Potential hardcoded JWT secret in {file_path.name}',
                            'recommendation': 'Use environment variables for secrets',
                            'file': str(file_path)
                        })
        
        return issues
    
    async def analyze_container_issues(self) -> List[Dict]:
        """Analyze container-specific issues"""
        issues = []
        
        # Check Docker files
        docker_files = list(self.project_root.glob('**/Dockerfile'))
        
        for docker_file in docker_files:
            with open(docker_file, 'r') as f:
                content = f.read()
                
                # Check for running as root
                if 'USER root' in content:
                    issues.append({
                        'type': 'security',
                        'severity': 'high',
                        'message': f'Running as root in {docker_file.name}',
                        'recommendation': 'Use non-root user',
                        'file': str(docker_file)
                    })
                
                # Check for layer optimization
                if 'RUN apt-get update' in content and 'apt-get clean' not in content:
                    issues.append({
                        'type': 'optimization',
                        'severity': 'medium',
                        'message': f'Docker layer optimization issue in {docker_file.name}',
                        'recommendation': 'Clean apt cache in same RUN command',
                        'file': str(docker_file)
                    })
        
        return issues
    
    async def analyze_web_app_issues(self) -> List[Dict]:
        """Analyze web app-specific issues"""
        issues = []
        
        # Check for common web app issues
        index_files = list(self.project_root.glob('**/index.html'))
        
        for index_file in index_files:
            with open(index_file, 'r') as f:
                content = f.read()
                
                # Check for inline scripts
                if '<script>' in content and 'src=' not in content:
                    issues.append({
                        'type': 'security',
                        'severity': 'medium',
                        'message': f'Inline script found in {index_file.name}',
                        'recommendation': 'Move scripts to external files',
                        'file': str(index_file)
                    })
        
        return issues
    
    async def analyze_microservice_issues(self) -> List[Dict]:
        """Analyze microservice-specific issues"""
        issues = []
        
        # Check for microservice patterns
        service_files = list(self.project_root.rglob('*service*')) + list(self.project_root.rglob('*Service*'))
        
        for file_path in service_files:
            if file_path.is_file():
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    # Check for hardcoded configuration
                    if 'localhost' in content or '127.0.0.1' in content:
                        issues.append({
                            'type': 'configuration',
                            'severity': 'medium',
                            'message': f'Hardcoded localhost in {file_path.name}',
                            'recommendation': 'Use environment variables for configuration',
                            'file': str(file_path)
                        })
        
        return issues
    
    async def update_github_information(self) -> Dict[str, Any]:
        """Update GitHub information for all technologies"""
        logger.info("Updating GitHub information...")
        
        github_updates = {}
        
        for tech_name, tech_info in self.tech_database.items():
            if tech_info.get('github_repo'):
                try:
                    # Get recent issues
                    issues = await self.github_tracker.get_recent_issues(tech_info['github_repo'])
                    
                    # Get recent fixes
                    fixes = await self.github_tracker.get_recent_fixes(tech_info['github_repo'])
                    
                    # Get security advisories
                    advisories = await self.github_tracker.get_security_advisories(tech_info['github_repo'])
                    
                    github_updates[tech_name] = {
                        'issues': len(issues),
                        'fixes': len(fixes),
                        'advisories': len(advisories),
                        'last_updated': datetime.now().isoformat()
                    }
                    
                    logger.info(f"Updated GitHub info for {tech_name}: {len(issues)} issues, {len(fixes)} fixes, {len(advisories)} advisories")
                except Exception as e:
                    logger.error(f"Failed to update GitHub info for {tech_name}: {e}")
        
        return github_updates
    
    def generate_recommendations(self, analysis_results: Dict[str, Any]) -> List[str]:
        """Generate recommendations based on analysis"""
        recommendations = []
        
        # Count high severity issues
        high_severity_count = 0
        for category in ['languages', 'services', 'products']:
            for tech_name, tech_data in analysis_results.get(category, {}).items():
                for issue in tech_data.get('issues_found', []):
                    if issue.get('severity') == 'high':
                        high_severity_count += 1
        
        if high_severity_count > 0:
            recommendations.append(f"Address {high_severity_count} high-severity issues immediately")
        
        # Language-specific recommendations
        if 'typescript' in analysis_results.get('languages', {}):
            ts_issues = analysis_results['languages']['typescript'].get('issues_found', [])
            if any(issue.get('type') == 'typescript_errors' for issue in ts_issues):
                recommendations.append("Fix TypeScript compilation errors before deployment")
        
        # Security recommendations
        security_issues = []
        for category in ['languages', 'services', 'products']:
            for tech_name, tech_data in analysis_results.get(category, {}).items():
                for issue in tech_data.get('issues_found', []):
                    if issue.get('type') == 'security':
                        security_issues.append(issue)
        
        if security_issues:
            recommendations.append(f"Review {len(security_issues)} security issues")
        
        # Performance recommendations
        performance_issues = []
        for category in ['languages', 'services', 'products']:
            for tech_name, tech_data in analysis_results.get(category, {}).items():
                for issue in tech_data.get('issues_found', []):
                    if issue.get('type') in ['performance', 'optimization']:
                        performance_issues.append(issue)
        
        if performance_issues:
            recommendations.append(f"Optimize {len(performance_issues)} performance issues")
        
        return recommendations
    
    def generate_summary(self, analysis_results: Dict[str, Any]) -> Dict[str, Any]:
        """Generate analysis summary"""
        total_issues = 0
        high_severity_issues = 0
        security_issues = 0
        performance_issues = 0
        
        for category in ['languages', 'services', 'products']:
            for tech_name, tech_data in analysis_results.get(category, {}).items():
                for issue in tech_data.get('issues_found', []):
                    total_issues += 1
                    if issue.get('severity') == 'high':
                        high_severity_issues += 1
                    if issue.get('type') == 'security':
                        security_issues += 1
                    if issue.get('type') in ['performance', 'optimization']:
                        performance_issues += 1
        
        return {
            'total_technologies': len(analysis_results.get('languages', {})) + len(analysis_results.get('services', {})) + len(analysis_results.get('products', {})),
            'total_issues': total_issues,
            'high_severity_issues': high_severity_issues,
            'security_issues': security_issues,
            'performance_issues': performance_issues,
            'github_repos_monitored': len(analysis_results.get('github_updates', {})),
            'analysis_timestamp': datetime.now().isoformat()
        }
    
    def generate_comprehensive_report(self, analysis_results: Dict[str, Any]) -> str:
        """Generate a comprehensive analysis report"""
        report = f"""
============================================================
🎯 COMPREHENSIVE TECH STACK ANALYSIS REPORT
============================================================
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Project: {self.project_root.name}

📊 ANALYSIS SUMMARY:
- Total Technologies: {analysis_results['summary']['total_technologies']}
- Total Issues Found: {analysis_results['summary']['total_issues']}
- High Severity Issues: {analysis_results['summary']['high_severity_issues']}
- Security Issues: {analysis_results['summary']['security_issues']}
- Performance Issues: {analysis_results['summary']['performance_issues']}
- GitHub Repos Monitored: {analysis_results['summary']['github_repos_monitored']}

🔍 DETAILED ANALYSIS:
"""
        
        # Languages
        if analysis_results.get('languages'):
            report += "\n📦 LANGUAGES:\n"
            for lang_name, lang_data in analysis_results['languages'].items():
                report += f"  {lang_data['name']} ({lang_data['version']}):\n"
                if lang_data.get('issues_found'):
                    report += f"    Issues: {len(lang_data['issues_found'])}\n"
                    for issue in lang_data['issues_found'][:2]:  # Show first 2 issues
                        report += f"      - {issue['severity'].upper()}: {issue['message']}\n"
                else:
                    report += "    ✅ No issues found\n"
        
        # Services
        if analysis_results.get('services'):
            report += "\n🔧 SERVICES:\n"
            for service_name, service_data in analysis_results['services'].items():
                report += f"  {service_data['name']}:\n"
                if service_data.get('issues_found'):
                    report += f"    Issues: {len(service_data['issues_found'])}\n"
                    for issue in service_data['issues_found'][:2]:  # Show first 2 issues
                        report += f"      - {issue['severity'].upper()}: {issue['message']}\n"
                else:
                    report += "    ✅ No issues found\n"
        
        # Products
        if analysis_results.get('products'):
            report += "\n📱 PRODUCTS:\n"
            for product_name, product_data in analysis_results['products'].items():
                report += f"  {product_data['name']}:\n"
                if product_data.get('issues_found'):
                    report += f"    Issues: {len(product_data['issues_found'])}\n"
                    for issue in product_data['issues_found'][:2]:  # Show first 2 issues
                        report += f"      - {issue['severity'].upper()}: {issue['message']}\n"
                else:
                    report += "    ✅ No issues found\n"
        
        # GitHub Updates
        if analysis_results.get('github_updates'):
            report += "\n📋 GITHUB INTEGRATION:\n"
            for tech_name, github_data in analysis_results['github_updates'].items():
                report += f"  {tech_name}: {github_data['issues']} issues, {github_data['fixes']} fixes, {github_data['advisories']} advisories\n"
        
        # Recommendations
        if analysis_results.get('recommendations'):
            report += "\n🚀 RECOMMENDATIONS:\n"
            for i, rec in enumerate(analysis_results['recommendations'], 1):
                report += f"  {i}. {rec}\n"
        
        report += f"""
🌟 The Second Day We Found Unity - Now We Analyze Everything Together 🌟
"""
        return report

class GitHubIssueTracker:
    """Tracks GitHub issues and recent fixes for technologies"""
    
    def __init__(self):
        self.github_api_base = "https://api.github.com"
        self.cache_dir = Path("cache/github")
        self.cache_dir.mkdir(parents=True, exist_ok=True)
    
    async def get_recent_issues(self, repo: str, days: int = 30) -> List[Dict]:
        """Get recent issues from GitHub repository"""
        cache_file = self.cache_dir / f"{repo.replace('/', '_')}_issues.json"
        
        # Check cache first
        if cache_file.exists():
            cache_age = datetime.now() - datetime.fromtimestamp(cache_file.stat().st_mtime)
            if cache_age < timedelta(hours=1):  # Cache for 1 hour
                with open(cache_file, 'r') as f:
                    return json.load(f)
        
        try:
            async with aiohttp.ClientSession() as session:
                since_date = (datetime.now() - timedelta(days=days)).isoformat()
                url = f"{self.github_api_base}/repos/{repo}/issues"
                params = {
                    'state': 'all',
                    'since': since_date,
                    'per_page': 50  # Reduced for faster response
                }
                
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        issues = await response.json()
                        
                        # Cache the results
                        with open(cache_file, 'w') as f:
                            json.dump(issues, f)
                        
                        return issues
                    else:
                        logger.warning(f"Failed to fetch issues for {repo}: {response.status}")
                        return []
        except Exception as e:
            logger.error(f"Error fetching GitHub issues for {repo}: {e}")
            return []
    
    async def get_recent_fixes(self, repo: str, days: int = 30) -> List[Dict]:
        """Get recent fixes (closed issues and PRs) from GitHub repository"""
        cache_file = self.cache_dir / f"{repo.replace('/', '_')}_fixes.json"
        
        # Check cache first
        if cache_file.exists():
            cache_age = datetime.now() - datetime.fromtimestamp(cache_file.stat().st_mtime)
            if cache_age < timedelta(hours=1):  # Cache for 1 hour
                with open(cache_file, 'r') as f:
                    return json.load(f)
        
        try:
            async with aiohttp.ClientSession() as session:
                since_date = (datetime.now() - timedelta(days=days)).isoformat()
                
                # Get closed issues
                issues_url = f"{self.github_api_base}/repos/{repo}/issues"
                issues_params = {
                    'state': 'closed',
                    'since': since_date,
                    'per_page': 25  # Reduced for faster response
                }
                
                # Get merged PRs
                prs_url = f"{self.github_api_base}/repos/{repo}/pulls"
                prs_params = {
                    'state': 'closed',
                    'since': since_date,
                    'per_page': 25  # Reduced for faster response
                }
                
                async with session.get(issues_url, params=issues_params) as issues_response:
                    async with session.get(prs_url, params=prs_params) as prs_response:
                        if issues_response.status == 200 and prs_response.status == 200:
                            issues = await issues_response.json()
                            prs = await prs_response.json()
                            
                            # Filter merged PRs
                            merged_prs = [pr for pr in prs if pr.get('merged_at')]
                            
                            fixes = issues + merged_prs
                            
                            # Cache the results
                            with open(cache_file, 'w') as f:
                                json.dump(fixes, f)
                            
                            return fixes
                        else:
                            logger.warning(f"Failed to fetch fixes for {repo}")
                            return []
        except Exception as e:
            logger.error(f"Error fetching GitHub fixes for {repo}: {e}")
            return []
    
    async def get_security_advisories(self, repo: str) -> List[Dict]:
        """Get security advisories from GitHub repository"""
        cache_file = self.cache_dir / f"{repo.replace('/', '_')}_security.json"
        
        # Check cache first
        if cache_file.exists():
            cache_age = datetime.now() - datetime.fromtimestamp(cache_file.stat().st_mtime)
            if cache_age < timedelta(hours=6):  # Cache for 6 hours
                with open(cache_file, 'r') as f:
                    return json.load(f)
        
        try:
            async with aiohttp.ClientSession() as session:
                url = f"{self.github_api_base}/repos/{repo}/security-advisories"
                
                async with session.get(url) as response:
                    if response.status == 200:
                        advisories = await response.json()
                        
                        # Cache the results
                        with open(cache_file, 'w') as f:
                            json.dump(advisories, f)
                        
                        return advisories
                    else:
                        logger.warning(f"Failed to fetch security advisories for {repo}: {response.status}")
                        return []
        except Exception as e:
            logger.error(f"Error fetching security advisories for {repo}: {e}")
            return []

async def main():
    """Main execution function"""
    delegator = TechStackDelegator()
    
    try:
        print("🎯 Starting Tech Stack Delegator Analysis...")
        
        # Run comprehensive analysis
        analysis_results = await delegator.analyze_tech_stack()
        
        # Generate report
        report = delegator.generate_comprehensive_report(analysis_results)
        print(report)
        
        # Save report
        report_file = delegator.project_root / "tech_stack_analysis_report.json"
        with open(report_file, 'w') as f:
            json.dump(analysis_results, f, indent=2)
        
        logger.info(f"Analysis report saved to: {report_file}")
        
        # Save text report
        text_report_file = delegator.project_root / "tech_stack_analysis_report.txt"
        with open(text_report_file, 'w') as f:
            f.write(report)
        
        logger.info(f"Text report saved to: {text_report_file}")
        
    except Exception as e:
        logger.error(f"Analysis failed: {e}")
        print("❌ Analysis failed - check logs for details")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main()) 