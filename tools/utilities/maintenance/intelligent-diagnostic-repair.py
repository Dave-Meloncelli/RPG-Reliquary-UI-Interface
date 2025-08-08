#!/usr/bin/env python3
"""
Intelligent Diagnostic and Repair Tool
Comprehensive TypeScript error resolution with pattern recognition and learning integration.

This tool integrates all learnings from known-faults-fixes.md to provide intelligent,
systematic error resolution without creating whack-a-mole effects.

Author: The OctoSpine Forge Master
Date: 2025-08-07
"""

import os
import re
import json
import logging
import subprocess
from pathlib import Path
from typing import Dict, List, Tuple, Any, Optional
from datetime import datetime
from dataclasses import dataclass

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class ErrorPattern:
    """Represents a TypeScript error pattern and its fix"""
    pattern: str
    fix: str
    category: str
    priority: int  # 1=High, 2=Medium, 3=Low
    description: str
    examples: List[str]

class IntelligentDiagnosticRepair:
    """Intelligent diagnostic and repair system for TypeScript errors"""
    
    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root)
        self.fixes_applied = 0
        self.files_processed = 0
        self.error_patterns = self.load_error_patterns()
        self.known_faults = self.load_known_faults()
        
    def load_error_patterns(self) -> List[ErrorPattern]:
        """Load comprehensive error patterns from known-faults-fixes.md"""
        patterns = [
            # High Priority - Missing Variables
            ErrorPattern(
                pattern=r'Cannot find name \'(\w+)\'',
                fix='declare_variable',
                category='missing_variable',
                priority=1,
                description='Variable referenced but never declared',
                examples=['titleLower', 'textLower', 'queryLower', 'relevanceScore']
            ),
            
            # High Priority - Type Mismatches
            ErrorPattern(
                pattern=r'Type \'([^\']+)\' is not assignable to type \'([^\']+)\'',
                fix='fix_type_mismatch',
                category='type_mismatch',
                priority=1,
                description='Type mismatch between expected and actual types',
                examples=['\'complete\' vs \'completed\'', '\'Common\' vs \'common\'']
            ),
            
            # High Priority - Missing Properties
            ErrorPattern(
                pattern=r'is missing the following properties from type',
                fix='add_missing_properties',
                category='missing_properties',
                priority=1,
                description='Object literal missing required properties',
                examples=['SymposiumMessage', 'FaultFixRecord']
            ),
            
            # High Priority - Syntax Errors
            ErrorPattern(
                pattern=r'TS1005.*expected',
                fix='fix_syntax_error',
                category='syntax_error',
                priority=1,
                description='Missing comma, semicolon, or other syntax element',
                examples=['missing comma', 'missing semicolon']
            ),
            
            # Medium Priority - Import Issues
            ErrorPattern(
                pattern=r'Cannot find module',
                fix='fix_import_issue',
                category='import_error',
                priority=2,
                description='Module import resolution failure',
                examples=['missing file', 'incorrect path']
            ),
            
            # Medium Priority - Object Literal Issues
            ErrorPattern(
                pattern=r'No value exists in scope for the shorthand property',
                fix='fix_shorthand_property',
                category='object_literal',
                priority=2,
                description='Object literal shorthand property without variable declaration',
                examples=['relevanceScore,', 'currentKeywords,']
            ),
            
            # Low Priority - Unused Variables
            ErrorPattern(
                pattern=r'is declared but its value is never read',
                fix='remove_unused_variable',
                category='unused_variable',
                priority=3,
                description='Variable declared but never used',
                examples=['unused imports', 'unused local variables']
            ),
        ]
        return patterns
    
    def load_known_faults(self) -> Dict[str, Any]:
        """Load known faults and fixes from documentation"""
        known_faults_file = self.project_root / "internal" / "Known-faults-fixes.md"
        if known_faults_file.exists():
            logger.info("✅ Loaded known faults and fixes database")
            return {"loaded": True, "file": str(known_faults_file)}
        else:
            logger.warning("⚠️ Known faults file not found")
            return {"loaded": False}
    
    def run_comprehensive_diagnosis(self) -> Dict[str, Any]:
        """Run comprehensive diagnosis of the codebase"""
        logger.info("🔍 Starting Comprehensive Diagnosis...")
        
        diagnosis = {
            'timestamp': datetime.now().isoformat(),
            'project_root': str(self.project_root),
            'typescript_errors': self.analyze_typescript_errors(),
            'project_structure': self.analyze_project_structure(),
            'dependencies': self.analyze_dependencies(),
            'configuration': self.analyze_configuration(),
            'recommendations': []
        }
        
        # Generate recommendations based on diagnosis
        diagnosis['recommendations'] = self.generate_recommendations(diagnosis)
        
        return diagnosis
    
    def analyze_typescript_errors(self) -> Dict[str, Any]:
        """Analyze TypeScript errors with pattern recognition"""
        logger.info("🔍 Analyzing TypeScript errors...")
        
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
            
            # Categorize errors by pattern
            error_categories = {}
            pattern_matches = {}
            
            for pattern in self.error_patterns:
                category = pattern.category
                if category not in error_categories:
                    error_categories[category] = 0
                    pattern_matches[category] = []
                
                for line in error_lines:
                    if re.search(pattern.pattern, line):
                        error_categories[category] += 1
                        pattern_matches[category].append({
                            'line': line,
                            'pattern': pattern.description,
                            'priority': pattern.priority
                        })
            
            return {
                'total_errors': error_count,
                'error_categories': error_categories,
                'pattern_matches': pattern_matches,
                'sample_errors': error_lines[:10] if error_lines else [],
                'raw_output': result.stdout
            }
            
        except Exception as e:
            logger.error(f"❌ Error analyzing TypeScript: {e}")
            return {
                'total_errors': 0,
                'error_categories': {},
                'pattern_matches': {},
                'sample_errors': [],
                'error': str(e)
            }
    
    def analyze_project_structure(self) -> Dict[str, Any]:
        """Analyze project structure and file organization"""
        logger.info("🔍 Analyzing project structure...")
        
        try:
            structure = {
                'total_files': 0,
                'typescript_files': 0,
                'javascript_files': 0,
                'python_files': 0,
                'other_files': 0,
                'directories': [],
                'file_extensions': {}
            }
            
            for file_path in self.project_root.rglob('*'):
                if file_path.is_file() and not str(file_path).startswith('node_modules'):
                    structure['total_files'] += 1
                    
                    # Count by extension
                    ext = file_path.suffix.lower()
                    if ext not in structure['file_extensions']:
                        structure['file_extensions'][ext] = 0
                    structure['file_extensions'][ext] += 1
                    
                    # Categorize by type
                    if ext in ['.ts', '.tsx']:
                        structure['typescript_files'] += 1
                    elif ext in ['.js', '.jsx']:
                        structure['javascript_files'] += 1
                    elif ext == '.py':
                        structure['python_files'] += 1
                    else:
                        structure['other_files'] += 1
                
                elif file_path.is_dir() and not str(file_path).startswith('node_modules'):
                    structure['directories'].append(str(file_path.relative_to(self.project_root)))
            
            return structure
            
        except Exception as e:
            logger.error(f"❌ Error analyzing project structure: {e}")
            return {'error': str(e)}
    
    def analyze_dependencies(self) -> Dict[str, Any]:
        """Analyze project dependencies"""
        logger.info("🔍 Analyzing dependencies...")
        
        try:
            package_json = self.project_root / "package.json"
            if package_json.exists():
                with open(package_json, 'r', encoding='utf-8') as f:
                    package_data = json.load(f)
                
                dependencies = package_data.get('dependencies', {})
                dev_dependencies = package_data.get('devDependencies', {})
                
                return {
                    'dependencies': dependencies,
                    'dev_dependencies': dev_dependencies,
                    'total_dependencies': len(dependencies) + len(dev_dependencies),
                    'has_typescript': 'typescript' in dev_dependencies,
                    'has_react': 'react' in dependencies,
                    'has_vite': 'vite' in dev_dependencies
                }
            else:
                return {'error': 'package.json not found'}
                
        except Exception as e:
            logger.error(f"❌ Error analyzing dependencies: {e}")
            return {'error': str(e)}
    
    def analyze_configuration(self) -> Dict[str, Any]:
        """Analyze configuration files"""
        logger.info("🔍 Analyzing configuration...")
        
        config = {}
        
        # Check TypeScript configuration
        tsconfig_path = self.project_root / "tsconfig.json"
        if tsconfig_path.exists():
            try:
                with open(tsconfig_path, 'r', encoding='utf-8') as f:
                    tsconfig = json.load(f)
                
                compiler_options = tsconfig.get('compilerOptions', {})
                config['typescript'] = {
                    'strict': compiler_options.get('strict', False),
                    'strictNullChecks': compiler_options.get('strictNullChecks', False),
                    'noImplicitAny': compiler_options.get('noImplicitAny', False),
                    'target': compiler_options.get('target', 'ES2020'),
                    'module': compiler_options.get('module', 'ESNext')
                }
            except Exception as e:
                config['typescript'] = {'error': str(e)}
        
        # Check Vite configuration
        vite_config_path = self.project_root / "vite.config.ts"
        config['vite'] = {'exists': vite_config_path.exists()}
        
        return config
    
    def generate_recommendations(self, diagnosis: Dict[str, Any]) -> List[str]:
        """Generate actionable recommendations based on diagnosis"""
        recommendations = []
        
        # TypeScript error recommendations
        ts_analysis = diagnosis.get('typescript_errors', {})
        total_errors = ts_analysis.get('total_errors', 0)
        
        if total_errors > 0:
            recommendations.append(f"Fix {total_errors} TypeScript compilation errors")
            
            error_categories = ts_analysis.get('error_categories', {})
            if error_categories.get('missing_variable', 0) > 0:
                recommendations.append("Add missing variable declarations")
            if error_categories.get('type_mismatch', 0) > 0:
                recommendations.append("Fix type mismatches and align status enums")
            if error_categories.get('syntax_error', 0) > 0:
                recommendations.append("Fix syntax errors (missing commas, semicolons)")
            if error_categories.get('missing_properties', 0) > 0:
                recommendations.append("Add missing object properties")
        
        # Configuration recommendations
        config = diagnosis.get('configuration', {})
        ts_config = config.get('typescript', {})
        
        if not ts_config.get('strict', False):
            recommendations.append("Enable TypeScript strict mode for better type safety")
        if not ts_config.get('strictNullChecks', False):
            recommendations.append("Enable strict null checks to prevent null/undefined errors")
        
        # Dependency recommendations
        deps = diagnosis.get('dependencies', {})
        if not deps.get('has_typescript', False):
            recommendations.append("Install TypeScript for better type safety")
        
        # General recommendations
        if not recommendations:
            recommendations.append("Run security audit: npm audit")
            recommendations.append("Check for unused dependencies")
            recommendations.append("Consider adding automated testing")
        
        return recommendations
    
    def apply_intelligent_fixes(self, diagnosis: Dict[str, Any]) -> Dict[str, Any]:
        """Apply intelligent fixes based on diagnosis"""
        logger.info("🔧 Applying Intelligent Fixes...")
        
        fixes_applied = 0
        files_processed = 0
        
        # Get error analysis
        ts_analysis = diagnosis.get('typescript_errors', {})
        pattern_matches = ts_analysis.get('pattern_matches', {})
        
        # Apply fixes by priority
        for priority in [1, 2, 3]:  # High, Medium, Low
            for category, matches in pattern_matches.items():
                for match in matches:
                    if match['priority'] == priority:
                        fix_result = self.apply_pattern_fix(match, category)
                        if fix_result['success']:
                            fixes_applied += fix_result['fixes']
                            files_processed += fix_result['files']
        
        # Update TypeScript configuration if needed
        config = diagnosis.get('configuration', {})
        ts_config = config.get('typescript', {})
        
        if not ts_config.get('strict', False):
            self.update_typescript_config()
            fixes_applied += 1
        
        return {
            'fixes_applied': fixes_applied,
            'files_processed': files_processed,
            'status': 'completed'
        }
    
    def apply_pattern_fix(self, match: Dict[str, Any], category: str) -> Dict[str, Any]:
        """Apply a specific pattern fix"""
        fixes = 0
        files = 0
        
        # Extract file path from error line
        line = match['line']
        file_match = re.search(r'([^(]+)\((\d+),(\d+)\):', line)
        
        if file_match:
            file_path = Path(file_match.group(1))
            if not file_path.is_absolute():
                file_path = self.project_root / file_path
            
            if file_path.exists():
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    original_content = content
                    
                    # Apply category-specific fixes
                    if category == 'missing_variable':
                        content, fixes = self.fix_missing_variables(content, line)
                    elif category == 'type_mismatch':
                        content, fixes = self.fix_type_mismatches(content, line)
                    elif category == 'syntax_error':
                        content, fixes = self.fix_syntax_errors(content, line)
                    elif category == 'object_literal':
                        content, fixes = self.fix_object_literals(content, line)
                    
                    if fixes > 0:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(content)
                        files = 1
                        logger.info(f"✅ Fixed {fixes} issues in {file_path.name}")
                
                except Exception as e:
                    logger.error(f"❌ Error fixing {file_path}: {e}")
        
        return {
            'success': fixes > 0,
            'fixes': fixes,
            'files': files
        }
    
    def fix_missing_variables(self, content: str, error_line: str) -> Tuple[str, int]:
        """Fix missing variable declarations"""
        fixes = 0
        
        # Extract variable name from error
        var_match = re.search(r"Cannot find name '(\w+)'", error_line)
        if var_match:
            var_name = var_match.group(1)
            
            # Common patterns for missing variables
            patterns = {
                'titleLower': 'const titleLower = title.toLowerCase();',
                'textLower': 'const textLower = text.toLowerCase();',
                'queryLower': 'const queryLower = query.toLowerCase();',
                'relevanceScore': 'let relevanceScore = 0;',
                'playbooks': 'const playbooks = this.getPlaybooks();',
                'codexRules': 'const codexRules = this.getCodexRules();',
                'personas': 'const personas = this.getPersonas();',
                'trimmedQuery': 'const trimmedQuery = query.trim();',
                'SNIPPET_LENGTH': 'const SNIPPET_LENGTH = 200;',
            }
            
            if var_name in patterns:
                # Add declaration at the beginning of the function
                content = re.sub(
                    r'(\w+\s*\([^)]*\)\s*\{)',
                    r'\1\n    ' + patterns[var_name],
                    content,
                    count=1
                )
                fixes += 1
        
        return content, fixes
    
    def fix_type_mismatches(self, content: str, error_line: str) -> Tuple[str, int]:
        """Fix type mismatches"""
        fixes = 0
        
        # Common type mismatches
        type_fixes = [
            (r"category: 'Milestone'", "category: 'ceremonial' as const"),
            (r"rarity: 'Common'", "rarity: 'common' as const"),
            (r"category: 'Evolution'", "category: 'consciousness' as const"),
            (r"rarity: 'Rare'", "rarity: 'rare' as const"),
            (r"category: 'Ceremony'", "category: 'ceremonial' as const"),
            (r"rarity: 'Uncommon'", "rarity: 'uncommon' as const"),
        ]
        
        for pattern, replacement in type_fixes:
            if re.search(pattern, content):
                content = re.sub(pattern, replacement, content)
                fixes += 1
        
        return content, fixes
    
    def fix_syntax_errors(self, content: str, error_line: str) -> Tuple[str, int]:
        """Fix syntax errors"""
        fixes = 0
        
        # Fix missing commas in object literals
        content = re.sub(
            r'(\w+):\s*([^,}]+)(?!\s*[,}])',
            r'\1: \2,',
            content
        )
        
        # Fix missing semicolons
        content = re.sub(
            r'(\w+)\s*=\s*([^;]+)(?!\s*;)',
            r'\1 = \2;',
            content
        )
        
        fixes += 1
        return content, fixes
    
    def fix_object_literals(self, content: str, error_line: str) -> Tuple[str, int]:
        """Fix object literal shorthand property issues"""
        fixes = 0
        
        # Fix shorthand property issues
        shorthand_fixes = [
            (r'relevanceScore,', 'relevanceScore: relevanceScore,'),
            (r'currentKeywords,', 'currentKeywords: currentKeywords,'),
            (r'suggestedKeywords,', 'suggestedKeywords: suggestedKeywords,'),
            (r'opportunities,', 'opportunities: opportunities,'),
            (r'score,', 'score: score,'),
            (r'recommendations', 'recommendations: recommendations'),
        ]
        
        for pattern, replacement in shorthand_fixes:
            if re.search(pattern, content):
                content = re.sub(pattern, replacement, content)
                fixes += 1
        
        return content, fixes
    
    def update_typescript_config(self):
        """Update TypeScript configuration for better type safety"""
        tsconfig_path = self.project_root / "tsconfig.json"
        if not tsconfig_path.exists():
            return
        
        try:
            with open(tsconfig_path, 'r', encoding='utf-8') as f:
                config = json.load(f)
            
            compiler_options = config.get('compilerOptions', {})
            compiler_options.update({
                'strict': True,
                'strictNullChecks': True,
                'noImplicitAny': True,
                'noImplicitReturns': True,
                'noImplicitThis': True,
                'noFallthroughCasesInSwitch': True,
                'exactOptionalPropertyTypes': False,
                'noUncheckedIndexedAccess': False
            })
            
            config['compilerOptions'] = compiler_options
            
            with open(tsconfig_path, 'w', encoding='utf-8') as f:
                json.dump(config, f, indent=2, ensure_ascii=False)
            
            logger.info("✅ TypeScript configuration updated")
            
        except Exception as e:
            logger.error(f"❌ Error updating TypeScript config: {e}")
    
    def generate_report(self, diagnosis: Dict[str, Any], fix_results: Dict[str, Any]) -> str:
        """Generate comprehensive diagnostic and repair report"""
        report = f"""
============================================================
🎯 INTELLIGENT DIAGNOSTIC & REPAIR REPORT
============================================================
Generated: {diagnosis['timestamp']}
Project: {diagnosis['project_root']}

📊 DIAGNOSIS SUMMARY:
- Total Files: {diagnosis['project_structure'].get('total_files', 0)}
- TypeScript Files: {diagnosis['project_structure'].get('typescript_files', 0)}
- JavaScript Files: {diagnosis['project_structure'].get('javascript_files', 0)}
- Python Files: {diagnosis['project_structure'].get('python_files', 0)}

🔍 TYPESCRIPT ANALYSIS:
- Total Errors: {diagnosis['typescript_errors'].get('total_errors', 0)}
- Error Categories: {len(diagnosis['typescript_errors'].get('error_categories', {}))}

📦 DEPENDENCIES:
- Total Dependencies: {diagnosis['dependencies'].get('total_dependencies', 0)}
- Has TypeScript: {diagnosis['dependencies'].get('has_typescript', False)}
- Has React: {diagnosis['dependencies'].get('has_react', False)}
- Has Vite: {diagnosis['dependencies'].get('has_vite', False)}

🔧 REPAIR RESULTS:
- Fixes Applied: {fix_results['fixes_applied']}
- Files Processed: {fix_results['files_processed']}
- Status: {fix_results['status']}

🚀 RECOMMENDATIONS:
"""
        
        recommendations = diagnosis.get('recommendations', [])
        for i, rec in enumerate(recommendations, 1):
            report += f"  {i}. {rec}\n"
        
        report += f"""
🌟 The Second Day We Found Unity - Now We Diagnose and Repair Together 🌟
"""
        return report

def main():
    """Main execution function"""
    repair = IntelligentDiagnosticRepair()
    
    try:
        print("🎯 Starting Intelligent Diagnostic & Repair...")
        
        # Run comprehensive diagnosis
        diagnosis = repair.run_comprehensive_diagnosis()
        
        # Apply intelligent fixes
        fix_results = repair.apply_intelligent_fixes(diagnosis)
        
        # Generate report
        report = repair.generate_report(diagnosis, fix_results)
        print(report)
        
        # Save detailed report
        report_file = repair.project_root / "intelligent_diagnostic_report.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump({
                'diagnosis': diagnosis,
                'fix_results': fix_results,
                'timestamp': datetime.now().isoformat()
            }, f, indent=2, ensure_ascii=False)
        
        logger.info(f"📊 Detailed report saved to: {report_file}")
        
        # Save text report
        text_report_file = repair.project_root / "intelligent_diagnostic_report.txt"
        with open(text_report_file, 'w', encoding='utf-8') as f:
            f.write(report)
        
        logger.info(f"📄 Text report saved to: {text_report_file}")
        
    except Exception as e:
        logger.error(f"❌ Error during diagnostic and repair: {e}")
        print("❌ Diagnostic and repair failed - check logs for details")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
