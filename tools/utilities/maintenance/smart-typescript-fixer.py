#!/usr/bin/env python3
"""
Smart TypeScript Fixer - Conservative, Pattern-Based Error Resolution

This script uses documented patterns from Known-faults-fixes.md to make surgical fixes
without the whack-a-mole effect. It follows a conservative approach with rollback capability.

Author: The OctoSpine Forge Master
Date: 2025-08-05
Based on: Known-faults-fixes.md Section 5
"""

import os
import re
import json
import subprocess
import logging
from pathlib import Path
from typing import Dict, List, Set, Tuple, Optional
from datetime import datetime
import shutil
import pkg_resources
import importlib.util

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class SmartTypeScriptFixer:
    """Conservative TypeScript error fixing system based on documented patterns"""
    
    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root)
        self.src_dir = self.project_root / "src"
        
        # Documented error patterns from Known-faults-fixes.md
        self.error_patterns = {
            "missing_variable_declaration": {
                "description": "Cannot find name 'variable'",
                "pattern": r"Cannot find name '([^']+)'",
                "fix_strategy": "declare_variable",
                "priority": "HIGH",
                "risk": "LOW"
            },
            "type_mismatch_status": {
                "description": "Type mismatch in status enums",
                "pattern": r"Type '([^']+)' is not assignable to type '([^']+)'",
                "fix_strategy": "align_status_enum",
                "priority": "HIGH",
                "risk": "LOW"
            },
            "missing_object_properties": {
                "description": "Missing required properties in objects",
                "pattern": r"Type '\{[^}]*\}' is missing the following properties",
                "fix_strategy": "add_missing_properties",
                "priority": "MEDIUM",
                "risk": "MEDIUM"
            },
            "syntax_error_const_in_object": {
                "description": "const declaration inside object literal",
                "pattern": r"const ([^=]+) = ([^;]+);",
                "fix_strategy": "move_const_outside_object",
                "priority": "HIGH",
                "risk": "LOW"
            },
            # New patterns discovered from manual authService.ts fix
            "undefined_error_data": {
                "description": "errorData used before being defined",
                "pattern": r"errorData\.detail",
                "fix_strategy": "define_error_data_from_response",
                "priority": "HIGH",
                "risk": "LOW"
            },
            "localstorage_missing_variables": {
                "description": "localStorage calls without variable declarations",
                "pattern": r"localStorage\.getItem\('([^']+)'\)",
                "fix_strategy": "declare_localstorage_variables",
                "priority": "HIGH",
                "risk": "LOW"
            }
        }
        
        # Track changes for rollback capability
        self.changes_made = []
        self.backup_dir = self.project_root / "backups" / f"ts-fix-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
        
        # Dependency checking
        self.package_json_path = self.project_root / "package.json"
        self.package_lock_path = self.project_root / "package-lock.json"
        
    def create_backup(self) -> bool:
        """Create backup of modified files before making changes"""
        try:
            self.backup_dir.mkdir(parents=True, exist_ok=True)
            logger.info(f"Created backup directory: {self.backup_dir}")
            return True
        except Exception as e:
            logger.error(f"Failed to create backup: {e}")
            return False
    
    def backup_file(self, file_path: Path) -> bool:
        """Backup a single file before modification"""
        try:
            backup_path = self.backup_dir / file_path.relative_to(self.project_root)
            backup_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(file_path, backup_path)
            return True
        except Exception as e:
            logger.error(f"Failed to backup {file_path}: {e}")
            return False
    
    def rollback_changes(self) -> bool:
        """Rollback all changes using backup files"""
        try:
            if not self.backup_dir.exists():
                logger.warning("No backup directory found for rollback")
                return False
            
            for backup_file in self.backup_dir.rglob("*.ts"):
                original_path = self.project_root / backup_file.relative_to(self.backup_dir)
                if original_path.exists():
                    shutil.copy2(backup_file, original_path)
                    logger.info(f"Rolled back: {original_path}")
            
            logger.info("Rollback completed successfully")
            return True
        except Exception as e:
            logger.error(f"Rollback failed: {e}")
            return False
    
    def run_type_check(self) -> Tuple[int, str]:
        """Run TypeScript type check and return error count and output"""
        try:
            result = subprocess.run(
                ["npm", "run", "type-check"],
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            error_count = len([line for line in result.stdout.split('\n') if 'error TS' in line])
            return error_count, result.stdout
        except Exception as e:
            logger.error(f"Failed to run type check: {e}")
            return -1, str(e)
    
    def analyze_errors(self, type_check_output: str) -> Dict[str, List[Dict]]:
        """Analyze TypeScript errors and categorize them by pattern"""
        categorized_errors = {pattern: [] for pattern in self.error_patterns.keys()}
        
        for line in type_check_output.split('\n'):
            if 'error TS' in line:
                for pattern_name, pattern_info in self.error_patterns.items():
                    match = re.search(pattern_info["pattern"], line)
                    if match:
                        categorized_errors[pattern_name].append({
                            "line": line,
                            "file": self.extract_file_path(line),
                            "match": match.groups(),
                            "pattern": pattern_name
                        })
                        break
        
        return categorized_errors
    
    def extract_file_path(self, error_line: str) -> Optional[Path]:
        """Extract file path from TypeScript error line"""
        match = re.search(r'([^:]+):(\d+):(\d+)', error_line)
        if match:
            file_path = Path(match.group(1))
            if file_path.exists():
                return file_path
        return None
    
    def fix_missing_variable_declarations(self, errors: List[Dict]) -> int:
        """Fix missing variable declarations - most common pattern"""
        fixed_count = 0
        
        for error in errors:
            file_path = error["file"]
            if not file_path or not file_path.exists():
                continue
            
            variable_name = error["match"][0]
            
            # Read file content
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Look for the line with the error
            lines = content.split('\n')
            for i, line in enumerate(lines):
                if variable_name in line and f"Cannot find name '{variable_name}'" in error["line"]:
                    # Find the context - look for object creation or assignment
                    if 'const' in line or 'let' in line or 'var' in line:
                        # This is likely a missing variable declaration
                        # Add declaration before the problematic line
                        declaration_line = f"const {variable_name} = `{variable_name}-${{Date.now()}}`;"
                        lines.insert(i, declaration_line)
                        fixed_count += 1
                        logger.info(f"Added variable declaration for '{variable_name}' in {file_path}")
                        break
            
            # Write back the file
            if fixed_count > 0:
                self.backup_file(file_path)
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write('\n'.join(lines))
        
        return fixed_count
    
    def fix_syntax_errors_const_in_object(self, errors: List[Dict]) -> int:
        """Fix const declarations inside object literals"""
        fixed_count = 0
        
        for error in errors:
            file_path = error["file"]
            if not file_path or not file_path.exists():
                continue
            
            # Read file content
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Look for const declarations inside object literals
            lines = content.split('\n')
            i = 0
            while i < len(lines):
                line = lines[i]
                if 'const' in line and '=' in line and '{' in line:
                    # This might be a const declaration inside an object
                    # Look for the pattern: const variable = { const other = ... }
                    const_match = re.search(r'const\s+([^=]+)\s*=\s*([^;]+);', line)
                    if const_match:
                        variable_name = const_match.group(1).strip()
                        value = const_match.group(2).strip()
                        
                        # Move the const declaration outside the object
                        lines[i] = f"const {variable_name} = {value};"
                        lines.insert(i + 1, f"const analysis: SEOAnalysis = {{")
                        lines.insert(i + 2, f"  id: {variable_name},")
                        
                        fixed_count += 1
                        logger.info(f"Fixed const declaration in object for '{variable_name}' in {file_path}")
                i += 1
            
            # Write back the file
            if fixed_count > 0:
                self.backup_file(file_path)
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write('\n'.join(lines))
        
        return fixed_count
    
    def fix_undefined_error_data(self, errors: List[Dict]) -> int:
        """Fix undefined errorData usage in error handling"""
        fixed_count = 0
        
        for error in errors:
            file_path = error["file"]
            if not file_path or not file_path.exists():
                continue
            
            # Read file content
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Look for errorData.detail usage without definition
            lines = content.split('\n')
            for i, line in enumerate(lines):
                if 'errorData.detail' in line and 'const errorData' not in lines[i-1]:
                    # Add errorData definition before the usage
                    error_data_line = "const errorData = await response.json().catch(() => ({}));"
                    lines.insert(i, error_data_line)
                    fixed_count += 1
                    logger.info(f"Added errorData definition in {file_path}")
                    break
            
            # Write back the file
            if fixed_count > 0:
                self.backup_file(file_path)
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write('\n'.join(lines))
        
        return fixed_count
    
    def fix_localstorage_missing_variables(self, errors: List[Dict]) -> int:
        """Fix localStorage calls without variable declarations"""
        fixed_count = 0
        
        for error in errors:
            file_path = error["file"]
            if not file_path or not file_path.exists():
                continue
            
            # Read file content
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Look for localStorage.getItem calls without variable declarations
            lines = content.split('\n')
            i = 0
            while i < len(lines):
                line = lines[i]
                if 'localStorage.getItem(' in line and 'const' not in line and 'let' not in line:
                    # Extract the key from localStorage.getItem('key')
                    match = re.search(r"localStorage\.getItem\('([^']+)'\)", line)
                    if match:
                        key = match.group(1)
                        variable_name = key.replace('auth_', '').replace('_', '')  # Convert 'auth_token' to 'token'
                        
                        # Add variable declaration
                        declaration_line = f"const {variable_name} = localStorage.getItem('{key}');"
                        lines.insert(i, declaration_line)
                        fixed_count += 1
                        logger.info(f"Added localStorage variable declaration for '{key}' in {file_path}")
                i += 1
            
            # Write back the file
            if fixed_count > 0:
                self.backup_file(file_path)
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write('\n'.join(lines))
        
        return fixed_count
    
    def fix_type_mismatches(self, errors: List[Dict]) -> int:
        """Fix type mismatches, especially status enums"""
        fixed_count = 0
        
        # Common status enum mappings
        status_mappings = {
            'complete': 'completed',
            'error': 'failed',
            'Success': 'completed',
            'Failed': 'failed'
        }
        
        for error in errors:
            file_path = error["file"]
            if not file_path or not file_path.exists():
                continue
            
            # Read file content
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Apply status mappings
            for wrong_status, correct_status in status_mappings.items():
                if wrong_status in content:
                    content = content.replace(f"'{wrong_status}'", f"'{correct_status}'")
                    content = content.replace(f'"{wrong_status}"', f'"{correct_status}"')
                    fixed_count += 1
                    logger.info(f"Fixed status enum '{wrong_status}' -> '{correct_status}' in {file_path}")
            
            # Write back the file
            if fixed_count > 0:
                self.backup_file(file_path)
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
        
        return fixed_count
    
    def run_conservative_fixes(self) -> Dict[str, int]:
        """Run fixes in order of priority and risk"""
        logger.info("Starting conservative TypeScript fixes...")
        
        # Create backup before starting
        if not self.create_backup():
            logger.error("Failed to create backup - aborting fixes")
            return {"error": -1}
        
        # Get current error count
        initial_errors, type_check_output = self.run_type_check()
        logger.info(f"Initial error count: {initial_errors}")
        
        # Analyze errors by pattern
        categorized_errors = self.analyze_errors(type_check_output)
        
        fix_results = {}
        
        # Fix in order of priority and risk
        fix_order = [
            ("syntax_error_const_in_object", self.fix_syntax_errors_const_in_object),
            ("undefined_error_data", self.fix_undefined_error_data),
            ("localstorage_missing_variables", self.fix_localstorage_missing_variables),
            ("missing_variable_declaration", self.fix_missing_variable_declarations),
            ("type_mismatch_status", self.fix_type_mismatches),
        ]
        
        for pattern_name, fix_function in fix_order:
            if categorized_errors[pattern_name]:
                logger.info(f"Fixing {pattern_name} errors...")
                fixed_count = fix_function(categorized_errors[pattern_name])
                fix_results[pattern_name] = fixed_count
                logger.info(f"Fixed {fixed_count} {pattern_name} errors")
                
                # Test after each fix
                current_errors, _ = self.run_type_check()
                if current_errors > initial_errors:
                    logger.warning(f"Error count increased after {pattern_name} fix - rolling back")
                    self.rollback_changes()
                    fix_results[pattern_name] = 0
                    break
        
        # Final error count
        final_errors, _ = self.run_type_check()
        fix_results["total_errors_reduced"] = initial_errors - final_errors
        
        logger.info(f"Conservative fixes completed. Errors reduced: {initial_errors} -> {final_errors}")
        return fix_results
    
    def generate_report(self, fix_results: Dict[str, int]) -> str:
        """Generate a detailed report of the fixes applied"""
        report = f"""
============================================================
🎯 SMART TYPESCRIPT FIX REPORT
============================================================
Initial Errors: {fix_results.get('total_errors_reduced', 0) + fix_results.get('final_errors', 0)}
Final Errors: {fix_results.get('final_errors', 0)}
Errors Reduced: {fix_results.get('total_errors_reduced', 0)}

Patterns Fixed:
"""
        
        for pattern, count in fix_results.items():
            if pattern not in ['total_errors_reduced', 'final_errors', 'error']:
                report += f"- {pattern}: {count} fixes\n"
        
        report += f"""
Backup Location: {self.backup_dir}
Rollback Command: python -c "from smart_typescript_fixer import SmartTypeScriptFixer; SmartTypeScriptFixer().rollback_changes()"

🌟 The Second Day We Found Unity - Now We Fix Our Types Together 🌟
"""
        return report

    def check_dependencies(self) -> Dict[str, any]:
        """Comprehensive dependency analysis"""
        logger.info("Starting dependency analysis...")
        
        dependency_report = {
            "missing_dependencies": [],
            "version_conflicts": [],
            "missing_type_definitions": [],
            "outdated_packages": [],
            "security_vulnerabilities": [],
            "build_issues": []
        }
        
        if not self.package_json_path.exists():
            logger.error("package.json not found")
            dependency_report["build_issues"].append("Missing package.json")
            return dependency_report
        
        # Read package.json
        try:
            with open(self.package_json_path, 'r') as f:
                package_data = json.load(f)
        except Exception as e:
            logger.error(f"Failed to read package.json: {e}")
            dependency_report["build_issues"].append(f"Invalid package.json: {e}")
            return dependency_report
        
        # Check for missing dependencies
        dependency_report["missing_dependencies"] = self.find_missing_dependencies(package_data)
        
        # Check for version conflicts
        dependency_report["version_conflicts"] = self.find_version_conflicts()
        
        # Check for missing type definitions
        dependency_report["missing_type_definitions"] = self.find_missing_type_definitions(package_data)
        
        # Check for outdated packages
        dependency_report["outdated_packages"] = self.find_outdated_packages()
        
        # Check for security vulnerabilities
        dependency_report["security_vulnerabilities"] = self.find_security_vulnerabilities()
        
        return dependency_report
    
    def find_missing_dependencies(self, package_data: Dict) -> List[Dict]:
        """Find dependencies that are imported but not installed"""
        missing_deps = []
        
        # Get installed packages
        try:
            installed_packages = {pkg.key: pkg.version for pkg in pkg_resources.working_set}
        except Exception as e:
            logger.warning(f"Could not get installed packages: {e}")
            return missing_deps
        
        # Check dependencies
        all_deps = {}
        all_deps.update(package_data.get("dependencies", {}))
        all_deps.update(package_data.get("devDependencies", {}))
        
        for dep_name, dep_version in all_deps.items():
            if dep_name not in installed_packages:
                missing_deps.append({
                    "name": dep_name,
                    "version": dep_version,
                    "type": "missing",
                    "fix": f"npm install {dep_name}@{dep_version}"
                })
        
        return missing_deps
    
    def find_version_conflicts(self) -> List[Dict]:
        """Find version conflicts in dependencies"""
        conflicts = []
        
        try:
            # Run npm ls to check for version conflicts
            result = subprocess.run(
                ["npm", "ls"],
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            
            # Parse npm ls output for conflicts
            for line in result.stdout.split('\n'):
                if 'UNMET PEER DEPENDENCY' in line or 'npm ERR!' in line:
                    conflicts.append({
                        "type": "version_conflict",
                        "message": line.strip(),
                        "fix": "npm dedupe or update conflicting packages"
                    })
                    
        except Exception as e:
            logger.warning(f"Could not check version conflicts: {e}")
        
        return conflicts
    
    def find_missing_type_definitions(self, package_data: Dict) -> List[Dict]:
        """Find packages missing TypeScript type definitions"""
        missing_types = []
        
        # Common packages that need @types
        packages_needing_types = [
            'lodash', 'moment', 'axios', 'express', 'react', 'react-dom',
            'node', 'jest', 'webpack', 'babel', 'eslint', 'prettier'
        ]
        
        all_deps = {}
        all_deps.update(package_data.get("dependencies", {}))
        all_deps.update(package_data.get("devDependencies", {}))
        
        for package in packages_needing_types:
            if package in all_deps:
                types_package = f"@types/{package}"
                if types_package not in all_deps:
                    missing_types.append({
                        "package": package,
                        "types_package": types_package,
                        "fix": f"npm install --save-dev {types_package}"
                    })
        
        return missing_types
    
    def find_outdated_packages(self) -> List[Dict]:
        """Find outdated packages"""
        outdated = []
        
        try:
            # Run npm outdated
            result = subprocess.run(
                ["npm", "outdated", "--json"],
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            
            if result.returncode == 0:
                outdated_data = json.loads(result.stdout)
                for package, info in outdated_data.items():
                    outdated.append({
                        "package": package,
                        "current": info.get("current"),
                        "wanted": info.get("wanted"),
                        "latest": info.get("latest"),
                        "fix": f"npm update {package}"
                    })
                    
        except Exception as e:
            logger.warning(f"Could not check outdated packages: {e}")
        
        return outdated
    
    def find_security_vulnerabilities(self) -> List[Dict]:
        """Find security vulnerabilities"""
        vulnerabilities = []
        
        try:
            # Run npm audit
            result = subprocess.run(
                ["npm", "audit", "--json"],
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            
            if result.returncode != 0:  # npm audit returns non-zero if vulnerabilities found
                try:
                    audit_data = json.loads(result.stdout)
                    for vuln in audit_data.get("vulnerabilities", {}).values():
                        vulnerabilities.append({
                            "package": vuln.get("name"),
                            "severity": vuln.get("severity"),
                            "title": vuln.get("title"),
                            "fix": f"npm audit fix"
                        })
                except json.JSONDecodeError:
                    logger.warning("Could not parse npm audit output")
                    
        except Exception as e:
            logger.warning(f"Could not check security vulnerabilities: {e}")
        
        return vulnerabilities
    
    def fix_dependency_issues(self, dependency_report: Dict) -> Dict[str, int]:
        """Attempt to fix dependency issues automatically"""
        fixes_applied = {
            "dependencies_installed": 0,
            "type_definitions_installed": 0,
            "packages_updated": 0,
            "security_fixes_applied": 0
        }
        
        # Fix missing dependencies
        for dep in dependency_report["missing_dependencies"]:
            try:
                result = subprocess.run(
                    ["npm", "install", dep["name"]],
                    capture_output=True,
                    text=True,
                    cwd=self.project_root
                )
                if result.returncode == 0:
                    fixes_applied["dependencies_installed"] += 1
                    logger.info(f"Installed missing dependency: {dep['name']}")
            except Exception as e:
                logger.error(f"Failed to install {dep['name']}: {e}")
        
        # Fix missing type definitions
        for type_def in dependency_report["missing_type_definitions"]:
            try:
                result = subprocess.run(
                    ["npm", "install", "--save-dev", type_def["types_package"]],
                    capture_output=True,
                    text=True,
                    cwd=self.project_root
                )
                if result.returncode == 0:
                    fixes_applied["type_definitions_installed"] += 1
                    logger.info(f"Installed type definitions: {type_def['types_package']}")
            except Exception as e:
                logger.error(f"Failed to install {type_def['types_package']}: {e}")
        
        # Apply security fixes
        if dependency_report["security_vulnerabilities"]:
            try:
                result = subprocess.run(
                    ["npm", "audit", "fix"],
                    capture_output=True,
                    text=True,
                    cwd=self.project_root
                )
                if result.returncode == 0:
                    fixes_applied["security_fixes_applied"] += 1
                    logger.info("Applied security fixes")
            except Exception as e:
                logger.error(f"Failed to apply security fixes: {e}")
        
        return fixes_applied
    
    def generate_dependency_report(self, dependency_report: Dict, fixes_applied: Dict) -> str:
        """Generate a comprehensive dependency report"""
        report = f"""
============================================================
🔍 DEPENDENCY ANALYSIS REPORT
============================================================
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

📦 DEPENDENCY STATUS:
"""
        
        # Missing dependencies
        if dependency_report["missing_dependencies"]:
            report += f"\n❌ Missing Dependencies ({len(dependency_report['missing_dependencies'])}):\n"
            for dep in dependency_report["missing_dependencies"]:
                report += f"  - {dep['name']}@{dep['version']}\n"
                report += f"    Fix: {dep['fix']}\n"
        else:
            report += "\n✅ All dependencies installed\n"
        
        # Version conflicts
        if dependency_report["version_conflicts"]:
            report += f"\n⚠️  Version Conflicts ({len(dependency_report['version_conflicts'])}):\n"
            for conflict in dependency_report["version_conflicts"]:
                report += f"  - {conflict['message']}\n"
        else:
            report += "\n✅ No version conflicts detected\n"
        
        # Missing type definitions
        if dependency_report["missing_type_definitions"]:
            report += f"\n📝 Missing Type Definitions ({len(dependency_report['missing_type_definitions'])}):\n"
            for type_def in dependency_report["missing_type_definitions"]:
                report += f"  - {type_def['package']} → {type_def['types_package']}\n"
                report += f"    Fix: {type_def['fix']}\n"
        else:
            report += "\n✅ All type definitions present\n"
        
        # Outdated packages
        if dependency_report["outdated_packages"]:
            report += f"\n🔄 Outdated Packages ({len(dependency_report['outdated_packages'])}):\n"
            for pkg in dependency_report["outdated_packages"][:5]:  # Show first 5
                report += f"  - {pkg['package']}: {pkg['current']} → {pkg['latest']}\n"
        else:
            report += "\n✅ All packages up to date\n"
        
        # Security vulnerabilities
        if dependency_report["security_vulnerabilities"]:
            report += f"\n🚨 Security Vulnerabilities ({len(dependency_report['security_vulnerabilities'])}):\n"
            for vuln in dependency_report["security_vulnerabilities"][:5]:  # Show first 5
                report += f"  - {vuln['package']} ({vuln['severity']}): {vuln['title']}\n"
        else:
            report += "\n✅ No security vulnerabilities detected\n"
        
        # Fixes applied
        if any(fixes_applied.values()):
            report += f"\n🔧 FIXES APPLIED:\n"
            report += f"  - Dependencies installed: {fixes_applied['dependencies_installed']}\n"
            report += f"  - Type definitions installed: {fixes_applied['type_definitions_installed']}\n"
            report += f"  - Security fixes applied: {fixes_applied['security_fixes_applied']}\n"
        
        report += f"""
📋 RECOMMENDATIONS:
1. Run 'npm audit fix' to address security issues
2. Run 'npm update' to update outdated packages
3. Run 'npm dedupe' to resolve version conflicts
4. Consider using 'npm-check-updates' for major version updates

🌟 The Second Day We Found Unity - Now We Fix Our Dependencies Together 🌟
"""
        return report

def main():
    """Main execution function"""
    fixer = SmartTypeScriptFixer()
    
    try:
        print("🎯 Starting Smart TypeScript Fixer with Dependency Analysis...")
        
        # Step 1: Dependency Analysis
        print("\n📦 Analyzing dependencies...")
        dependency_report = fixer.check_dependencies()
        dependency_fixes = fixer.fix_dependency_issues(dependency_report)
        dependency_report_text = fixer.generate_dependency_report(dependency_report, dependency_fixes)
        print(dependency_report_text)
        
        # Step 2: TypeScript Error Fixes
        print("\n🔧 Running TypeScript error fixes...")
        fix_results = fixer.run_conservative_fixes()
        ts_report = fixer.generate_report(fix_results)
        print(ts_report)
        
        # Step 3: Generate comprehensive report
        comprehensive_report = f"""
============================================================
🎯 COMPREHENSIVE FIX REPORT
============================================================
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

{dependency_report_text}

{ts_report}

📊 SUMMARY:
- Dependencies checked: {len(dependency_report.get('missing_dependencies', [])) + len(dependency_report.get('version_conflicts', [])) + len(dependency_report.get('missing_type_definitions', []))}
- Dependencies fixed: {sum(dependency_fixes.values())}
- TypeScript errors reduced: {fix_results.get('total_errors_reduced', 0)}
- Files modified: {len(fixer.changes_made) if hasattr(fixer, 'changes_made') else 'Unknown'}

🌟 The Second Day We Found Unity - Now We Fix Everything Together 🌟
"""
        print(comprehensive_report)
        
        # Save comprehensive report to file
        report_file = fixer.project_root / "comprehensive_fix_report.json"
        comprehensive_data = {
            "timestamp": datetime.now().isoformat(),
            "dependency_report": dependency_report,
            "dependency_fixes": dependency_fixes,
            "typescript_fixes": fix_results,
            "summary": {
                "dependencies_checked": len(dependency_report.get('missing_dependencies', [])) + len(dependency_report.get('version_conflicts', [])) + len(dependency_report.get('missing_type_definitions', [])),
                "dependencies_fixed": sum(dependency_fixes.values()),
                "typescript_errors_reduced": fix_results.get('total_errors_reduced', 0),
                "files_modified": len(fixer.changes_made) if hasattr(fixer, 'changes_made') else 'Unknown'
            }
        }
        
        with open(report_file, 'w') as f:
            json.dump(comprehensive_data, f, indent=2)
        
        logger.info(f"Comprehensive report saved to: {report_file}")
        
        # Save text report
        text_report_file = fixer.project_root / "comprehensive_fix_report.txt"
        with open(text_report_file, 'w') as f:
            f.write(comprehensive_report)
        
        logger.info(f"Text report saved to: {text_report_file}")
        
    except Exception as e:
        logger.error(f"Fix process failed: {e}")
        print("❌ Fix process failed - check logs for details")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main() 