#!/usr/bin/env python3
"""
Simple Tech Stack Delegator - Core Analysis System

A simplified version that focuses on core functionality without file permission issues.

Author: The OctoSpine Forge Master
Date: 2025-08-06
"""

import os
import json
import subprocess
import logging
from pathlib import Path
from typing import Dict, List, Any
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class SimpleTechStackDelegator:
    """Simplified tech stack analysis system"""
    
    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root)
        self.tech_database = self.load_tech_database()
        
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
        
        try:
            for file_path in self.project_root.rglob('*'):
                if file_path.is_file() and not str(file_path).startswith('node_modules'):
                    for language, patterns in self.language_patterns.items():
                        if any(file_path.name.endswith(pattern) for pattern in patterns):
                            detected_languages.add(language)
                            break
        except Exception as e:
            logger.warning(f"Error during language detection: {e}")
        
        return list(detected_languages)
    
    def analyze_typescript_errors(self) -> Dict[str, Any]:
        """Analyze TypeScript errors"""
        logger.info("Analyzing TypeScript errors...")
        
        try:
            # Run TypeScript type check
            result = subprocess.run(
                ["npm", "run", "type-check"],
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            
            error_lines = [line for line in result.stdout.split('\n') if 'error TS' in line]
            error_count = len(error_lines)
            
            # Categorize errors
            error_categories = {
                'missing_variable': 0,
                'type_mismatch': 0,
                'missing_properties': 0,
                'syntax_error': 0,
                'import_error': 0,
                'other': 0
            }
            
            for line in error_lines:
                if "Cannot find name" in line:
                    error_categories['missing_variable'] += 1
                elif "Type" in line and "is not assignable" in line:
                    error_categories['type_mismatch'] += 1
                elif "missing the following properties" in line:
                    error_categories['missing_properties'] += 1
                elif "TS1005" in line or "TS1128" in line:
                    error_categories['syntax_error'] += 1
                elif "Cannot find module" in line:
                    error_categories['import_error'] += 1
                else:
                    error_categories['other'] += 1
            
            return {
                'total_errors': error_count,
                'error_categories': error_categories,
                'sample_errors': error_lines[:5] if error_lines else []
            }
            
        except Exception as e:
            logger.error(f"Error analyzing TypeScript: {e}")
            return {
                'total_errors': 0,
                'error_categories': {},
                'sample_errors': [],
                'error': str(e)
            }
    
    def analyze_dependencies(self) -> Dict[str, Any]:
        """Analyze project dependencies"""
        logger.info("Analyzing dependencies...")
        
        try:
            # Check package.json
            package_json = self.project_root / "package.json"
            if package_json.exists():
                with open(package_json, 'r') as f:
                    package_data = json.load(f)
                
                dependencies = package_data.get('dependencies', {})
                dev_dependencies = package_data.get('devDependencies', {})
                
                # Check for outdated packages
                result = subprocess.run(
                    ["npm", "outdated", "--json"],
                    capture_output=True,
                    text=True,
                    cwd=self.project_root
                )
                
                outdated_packages = {}
                if result.returncode == 0:
                    try:
                        outdated_data = json.loads(result.stdout)
                        outdated_packages = outdated_data
                    except json.JSONDecodeError:
                        pass
                
                return {
                    'dependencies': dependencies,
                    'dev_dependencies': dev_dependencies,
                    'outdated_packages': outdated_packages,
                    'total_dependencies': len(dependencies) + len(dev_dependencies),
                    'outdated_count': len(outdated_packages)
                }
            else:
                return {'error': 'package.json not found'}
                
        except Exception as e:
            logger.error(f"Error analyzing dependencies: {e}")
            return {'error': str(e)}
    
    def analyze_project_structure(self) -> Dict[str, Any]:
        """Analyze project structure"""
        logger.info("Analyzing project structure...")
        
        try:
            structure = {
                'total_files': 0,
                'typescript_files': 0,
                'javascript_files': 0,
                'python_files': 0,
                'other_files': 0,
                'directories': []
            }
            
            for file_path in self.project_root.rglob('*'):
                if file_path.is_file() and not str(file_path).startswith('node_modules'):
                    structure['total_files'] += 1
                    
                    if file_path.suffix in ['.ts', '.tsx']:
                        structure['typescript_files'] += 1
                    elif file_path.suffix in ['.js', '.jsx']:
                        structure['javascript_files'] += 1
                    elif file_path.suffix == '.py':
                        structure['python_files'] += 1
                    else:
                        structure['other_files'] += 1
                
                elif file_path.is_dir() and not str(file_path).startswith('node_modules'):
                    structure['directories'].append(str(file_path.relative_to(self.project_root)))
            
            return structure
            
        except Exception as e:
            logger.error(f"Error analyzing project structure: {e}")
            return {'error': str(e)}
    
    def generate_recommendations(self, analysis_results: Dict[str, Any]) -> List[str]:
        """Generate recommendations based on analysis"""
        recommendations = []
        
        # TypeScript recommendations
        if 'typescript' in analysis_results.get('languages', []):
            ts_analysis = analysis_results.get('typescript_analysis', {})
            total_errors = ts_analysis.get('total_errors', 0)
            
            if total_errors > 0:
                recommendations.append(f"Fix {total_errors} TypeScript compilation errors")
                
                error_categories = ts_analysis.get('error_categories', {})
                if error_categories.get('missing_variable', 0) > 0:
                    recommendations.append("Add missing variable declarations")
                if error_categories.get('type_mismatch', 0) > 0:
                    recommendations.append("Fix type mismatches and align status enums")
                if error_categories.get('missing_properties', 0) > 0:
                    recommendations.append("Add missing object properties")
        
        # Dependency recommendations
        dep_analysis = analysis_results.get('dependency_analysis', {})
        outdated_count = dep_analysis.get('outdated_count', 0)
        
        if outdated_count > 0:
            recommendations.append(f"Update {outdated_count} outdated packages")
        
        # General recommendations
        if not recommendations:
            recommendations.append("Run security audit: npm audit")
            recommendations.append("Check for unused dependencies")
            recommendations.append("Consider adding automated testing")
        
        return recommendations
    
    def analyze_tech_stack(self) -> Dict[str, Any]:
        """Comprehensive analysis of the tech stack"""
        logger.info("Starting comprehensive tech stack analysis...")
        
        # Detect languages
        detected_languages = self.detect_languages()
        logger.info(f"Detected languages: {detected_languages}")
        
        analysis_results = {
            'languages': detected_languages,
            'analysis_timestamp': datetime.now().isoformat(),
            'project_root': str(self.project_root)
        }
        
        # Analyze TypeScript if present
        if 'typescript' in detected_languages:
            analysis_results['typescript_analysis'] = self.analyze_typescript_errors()
        
        # Analyze dependencies
        analysis_results['dependency_analysis'] = self.analyze_dependencies()
        
        # Analyze project structure
        analysis_results['project_structure'] = self.analyze_project_structure()
        
        # Generate recommendations
        analysis_results['recommendations'] = self.generate_recommendations(analysis_results)
        
        return analysis_results
    
    def generate_report(self, analysis_results: Dict[str, Any]) -> str:
        """Generate a comprehensive analysis report"""
        report = f"""
============================================================
🎯 TECH STACK ANALYSIS REPORT
============================================================
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Project: {analysis_results.get('project_root', 'Unknown')}

📊 ANALYSIS SUMMARY:
- Languages Detected: {len(analysis_results.get('languages', []))}
- Languages: {', '.join(analysis_results.get('languages', []))}
- Total Files: {analysis_results.get('project_structure', {}).get('total_files', 0)}
- TypeScript Files: {analysis_results.get('project_structure', {}).get('typescript_files', 0)}
- JavaScript Files: {analysis_results.get('project_structure', {}).get('javascript_files', 0)}
- Python Files: {analysis_results.get('project_structure', {}).get('python_files', 0)}

🔍 DETAILED ANALYSIS:
"""
        
        # TypeScript Analysis
        if 'typescript_analysis' in analysis_results:
            ts_analysis = analysis_results['typescript_analysis']
            report += f"\n📦 TYPESCRIPT:\n"
            report += f"  Total Errors: {ts_analysis.get('total_errors', 0)}\n"
            
            error_categories = ts_analysis.get('error_categories', {})
            if error_categories:
                report += f"  Error Categories:\n"
                for category, count in error_categories.items():
                    if count > 0:
                        report += f"    - {category}: {count}\n"
            
            sample_errors = ts_analysis.get('sample_errors', [])
            if sample_errors:
                report += f"  Sample Errors:\n"
                for error in sample_errors[:3]:
                    report += f"    - {error}\n"
        
        # Dependency Analysis
        if 'dependency_analysis' in analysis_results:
            dep_analysis = analysis_results['dependency_analysis']
            report += f"\n📦 DEPENDENCIES:\n"
            report += f"  Total Dependencies: {dep_analysis.get('total_dependencies', 0)}\n"
            report += f"  Outdated Packages: {dep_analysis.get('outdated_count', 0)}\n"
            
            if dep_analysis.get('outdated_count', 0) > 0:
                report += f"  Outdated Packages:\n"
                for package, info in list(dep_analysis.get('outdated_packages', {}).items())[:5]:
                    report += f"    - {package}: {info.get('current', '?')} → {info.get('latest', '?')}\n"
        
        # Recommendations
        recommendations = analysis_results.get('recommendations', [])
        if recommendations:
            report += f"\n🚀 RECOMMENDATIONS:\n"
            for i, rec in enumerate(recommendations, 1):
                report += f"  {i}. {rec}\n"
        
        report += f"""
🌟 The Second Day We Found Unity - Now We Analyze Everything Together 🌟
"""
        return report

def main():
    """Main execution function"""
    delegator = SimpleTechStackDelegator()
    
    try:
        print("🎯 Starting Simple Tech Stack Delegator Analysis...")
        
        # Run comprehensive analysis
        analysis_results = delegator.analyze_tech_stack()
        
        # Generate report
        report = delegator.generate_report(analysis_results)
        print(report)
        
        # Save report
        report_file = delegator.project_root / "simple_tech_stack_analysis.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(analysis_results, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Analysis report saved to: {report_file}")
        
        # Save text report
        text_report_file = delegator.project_root / "simple_tech_stack_analysis.txt"
        with open(text_report_file, 'w', encoding='utf-8') as f:
            f.write(report)
        
        logger.info(f"Text report saved to: {text_report_file}")
        
    except Exception as e:
        logger.error(f"Analysis failed: {e}")
        print("❌ Analysis failed - check logs for details")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main() 