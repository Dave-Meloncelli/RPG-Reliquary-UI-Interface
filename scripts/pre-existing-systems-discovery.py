#!/usr/bin/env python3
"""
Pre-Existing Systems Discovery Frame
====================================

Discovers and analyzes existing audit systems, GitHub Actions, hooks, and automation infrastructure
to prevent duplication and enable integration with existing systems.
"""

import os
import json
import subprocess
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime
import glob

def discover_existing_systems(context: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Discover and analyze existing audit systems, GitHub Actions, hooks, and automation infrastructure.
    
    Args:
        context: Execution context from the framework
        
    Returns:
        Dict containing discovered systems and integration recommendations
    """
    print("🔍 DISCOVERING PRE-EXISTING SYSTEMS...")
    print("=" * 60)
    
    # Initialize results
    results = {
        'systems_discovered': True,
        'integration_plan_generated': True,
        'timestamp': datetime.now().isoformat(),
        'discovered_systems': {},
        'integration_opportunities': [],
        'duplication_risks': [],
        'recommendations': []
    }
    
    # 1. Discover GitHub Actions workflows
    print("📋 Discovering GitHub Actions workflows...")
    github_actions = discover_github_actions()
    results['discovered_systems']['github_actions'] = github_actions
    
    # 2. Discover Git hooks
    print("🔗 Discovering Git hooks...")
    git_hooks = discover_git_hooks()
    results['discovered_systems']['git_hooks'] = git_hooks
    
    # 3. Discover existing audit scripts
    print("🔍 Discovering existing audit scripts...")
    audit_scripts = discover_audit_scripts()
    results['discovered_systems']['audit_scripts'] = audit_scripts
    
    # 4. Discover package.json scripts
    print("📦 Discovering package.json scripts...")
    package_scripts = discover_package_scripts()
    results['discovered_systems']['package_scripts'] = package_scripts
    
    # 5. Discover configuration files
    print("⚙️ Discovering configuration files...")
    config_files = discover_config_files()
    results['discovered_systems']['config_files'] = config_files
    
    # 6. Analyze integration opportunities
    print("🔗 Analyzing integration opportunities...")
    integration_opportunities = analyze_integration_opportunities(results['discovered_systems'])
    results['integration_opportunities'] = integration_opportunities
    
    # 7. Identify duplication risks
    print("⚠️ Identifying duplication risks...")
    duplication_risks = identify_duplication_risks(results['discovered_systems'])
    results['duplication_risks'] = duplication_risks
    
    # 8. Generate integration plan
    print("📋 Generating integration plan...")
    integration_plan = generate_integration_plan(results)
    results['integration_plan'] = integration_plan
    
    # 9. Generate recommendations
    print("💡 Generating recommendations...")
    recommendations = generate_recommendations(results)
    results['recommendations'] = recommendations
    
    # Save detailed report
    report_path = f"reports/pre_existing_systems_discovery_{int(datetime.now().timestamp())}.json"
    os.makedirs("reports", exist_ok=True)
    with open(report_path, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"📄 Detailed report saved: {report_path}")
    print("=" * 60)
    print("✅ PRE-EXISTING SYSTEMS DISCOVERY COMPLETE")
    
    return results

def discover_github_actions() -> Dict[str, Any]:
    """Discover GitHub Actions workflows"""
    workflows_dir = Path(".github/workflows")
    workflows = {}
    
    if workflows_dir.exists():
        for workflow_file in workflows_dir.glob("*.yml"):
            try:
                with open(workflow_file, 'r') as f:
                    content = f.read()
                    workflows[workflow_file.name] = {
                        'path': str(workflow_file),
                        'size': workflow_file.stat().st_size,
                        'triggers': extract_workflow_triggers(content),
                        'jobs': extract_workflow_jobs(content),
                        'audit_related': is_audit_related_workflow(content)
                    }
            except Exception as e:
                workflows[workflow_file.name] = {
                    'path': str(workflow_file),
                    'error': str(e)
                }
    
    return {
        'count': len(workflows),
        'workflows': workflows,
        'audit_workflows': [w for w in workflows.values() if w.get('audit_related', False)]
    }

def discover_git_hooks() -> Dict[str, Any]:
    """Discover Git hooks"""
    hooks_dir = Path(".husky")
    hooks = {}
    
    if hooks_dir.exists():
        for hook_file in hooks_dir.glob("*"):
            if hook_file.is_file():
                try:
                    with open(hook_file, 'r') as f:
                        content = f.read()
                        hooks[hook_file.name] = {
                            'path': str(hook_file),
                            'size': hook_file.stat().st_size,
                            'content': content.strip(),
                            'audit_related': is_audit_related_hook(content)
                        }
                except Exception as e:
                    hooks[hook_file.name] = {
                        'path': str(hook_file),
                        'error': str(e)
                    }
    
    # Also check for pre-commit config
    pre_commit_config = Path("config/pre-commit-config.json")
    if pre_commit_config.exists():
        try:
            with open(pre_commit_config, 'r') as f:
                config = json.load(f)
                hooks['pre-commit-config'] = {
                    'path': str(pre_commit_config),
                    'config': config,
                    'audit_related': True
                }
        except Exception as e:
            hooks['pre-commit-config'] = {
                'path': str(pre_commit_config),
                'error': str(e)
            }
    
    return {
        'count': len(hooks),
        'hooks': hooks,
        'audit_hooks': [h for h in hooks.values() if h.get('audit_related', False)]
    }

def discover_audit_scripts() -> Dict[str, Any]:
    """Discover existing audit scripts"""
    scripts_dir = Path("scripts")
    audit_scripts = {}
    
    if scripts_dir.exists():
        # Look for audit-related scripts
        audit_patterns = [
            "audit-*.js", "audit-*.py", "audit-*.cjs",
            "*audit*.js", "*audit*.py", "*audit*.cjs",
            "system-audit*", "comprehensive-audit*"
        ]
        
        for pattern in audit_patterns:
            for script_file in scripts_dir.glob(pattern):
                try:
                    with open(script_file, 'r') as f:
                        content = f.read()
                        audit_scripts[script_file.name] = {
                            'path': str(script_file),
                            'size': script_file.stat().st_size,
                            'type': script_file.suffix,
                            'audit_functions': extract_audit_functions(content, script_file.suffix),
                            'dependencies': extract_script_dependencies(content, script_file.suffix)
                        }
                except Exception as e:
                    audit_scripts[script_file.name] = {
                        'path': str(script_file),
                        'error': str(e)
                    }
    
    return {
        'count': len(audit_scripts),
        'scripts': audit_scripts,
        'by_type': group_scripts_by_type(audit_scripts)
    }

def discover_package_scripts() -> Dict[str, Any]:
    """Discover package.json scripts"""
    package_files = ["package.json", "backend/package.json"]
    package_scripts = {}
    
    for package_file in package_files:
        if Path(package_file).exists():
            try:
                with open(package_file, 'r') as f:
                    data = json.load(f)
                    scripts = data.get('scripts', {})
                    audit_scripts = {k: v for k, v in scripts.items() if 'audit' in k.lower()}
                    
                    package_scripts[package_file] = {
                        'path': package_file,
                        'all_scripts': scripts,
                        'audit_scripts': audit_scripts,
                        'audit_script_count': len(audit_scripts)
                    }
            except Exception as e:
                package_scripts[package_file] = {
                    'path': package_file,
                    'error': str(e)
                }
    
    return {
        'count': len(package_scripts),
        'packages': package_scripts,
        'total_audit_scripts': sum(p.get('audit_script_count', 0) for p in package_scripts.values())
    }

def discover_config_files() -> Dict[str, Any]:
    """Discover configuration files"""
    config_patterns = [
        "*.config.js", "*.config.json", "*.config.yml",
        "eslint*", "prettier*", "husky*", "lint-staged*"
    ]
    
    config_files = {}
    
    for pattern in config_patterns:
        for config_file in Path(".").glob(pattern):
            try:
                with open(config_file, 'r') as f:
                    content = f.read()
                    config_files[config_file.name] = {
                        'path': str(config_file),
                        'size': config_file.stat().st_size,
                        'type': config_file.suffix,
                        'audit_related': is_audit_related_config(content)
                    }
            except Exception as e:
                config_files[config_file.name] = {
                    'path': str(config_file),
                    'error': str(e)
                }
    
    return {
        'count': len(config_files),
        'files': config_files,
        'audit_configs': [c for c in config_files.values() if c.get('audit_related', False)]
    }

def analyze_integration_opportunities(discovered_systems: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Analyze integration opportunities between discovered systems"""
    opportunities = []
    
    # Integration between GitHub Actions and framework
    if discovered_systems.get('github_actions', {}).get('audit_workflows'):
        opportunities.append({
            'type': 'github_actions_integration',
            'description': 'Integrate framework with existing GitHub Actions audit workflows',
            'priority': 'high',
            'effort': 'medium',
            'benefits': ['Leverage existing CI/CD pipeline', 'Avoid duplication', 'Unified reporting']
        })
    
    # Integration between Git hooks and framework
    if discovered_systems.get('git_hooks', {}).get('audit_hooks'):
        opportunities.append({
            'type': 'git_hooks_integration',
            'description': 'Integrate framework with existing Git hooks for pre-commit audits',
            'priority': 'high',
            'effort': 'low',
            'benefits': ['Automated pre-commit validation', 'Consistent audit execution', 'Early error detection']
        })
    
    # Integration between existing audit scripts and framework
    if discovered_systems.get('audit_scripts', {}).get('count', 0) > 0:
        opportunities.append({
            'type': 'audit_scripts_integration',
            'description': 'Integrate existing audit scripts as framework frames',
            'priority': 'medium',
            'effort': 'medium',
            'benefits': ['Reuse proven audit logic', 'Maintain existing workflows', 'Extend functionality']
        })
    
    # Integration between package scripts and framework
    if discovered_systems.get('package_scripts', {}).get('total_audit_scripts', 0) > 0:
        opportunities.append({
            'type': 'package_scripts_integration',
            'description': 'Integrate existing npm audit scripts with framework execution',
            'priority': 'medium',
            'effort': 'low',
            'benefits': ['Leverage existing npm ecosystem', 'Consistent dependency management', 'Automated fixes']
        })
    
    return opportunities

def identify_duplication_risks(discovered_systems: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Identify potential duplication risks"""
    risks = []
    
    # Check for duplicate audit functionality
    audit_functions = set()
    for script in discovered_systems.get('audit_scripts', {}).get('scripts', {}).values():
        if 'audit_functions' in script:
            for func in script['audit_functions']:
                if func in audit_functions:
                    risks.append({
                        'type': 'duplicate_functionality',
                        'description': f'Duplicate audit function: {func}',
                        'severity': 'medium',
                        'impact': 'Maintenance overhead, inconsistent results'
                    })
                audit_functions.add(func)
    
    # Check for overlapping GitHub Actions and framework
    if discovered_systems.get('github_actions', {}).get('audit_workflows'):
        risks.append({
            'type': 'overlapping_automation',
            'description': 'Framework may duplicate existing GitHub Actions audit workflows',
            'severity': 'high',
            'impact': 'Conflicting automation, resource waste, confusion'
        })
    
    return risks

def generate_integration_plan(results: Dict[str, Any]) -> Dict[str, Any]:
    """Generate integration plan"""
    plan = {
        'immediate_actions': [],
        'short_term_actions': [],
        'long_term_actions': [],
        'integration_points': []
    }
    
    # Immediate actions
    if results['duplication_risks']:
        plan['immediate_actions'].append({
            'action': 'Review and resolve duplication risks',
            'priority': 'critical',
            'description': 'Address overlapping functionality before proceeding'
        })
    
    # Short term actions
    for opportunity in results['integration_opportunities']:
        if opportunity['priority'] == 'high':
            plan['short_term_actions'].append({
                'action': f"Implement {opportunity['type']}",
                'priority': opportunity['priority'],
                'effort': opportunity['effort'],
                'description': opportunity['description']
            })
    
    # Integration points
    discovered = results['discovered_systems']
    
    if discovered.get('github_actions', {}).get('audit_workflows'):
        plan['integration_points'].append({
            'system': 'GitHub Actions',
            'integration_type': 'workflow_trigger',
            'description': 'Trigger framework execution from existing GitHub Actions',
            'implementation': 'Add framework execution step to existing workflows'
        })
    
    if discovered.get('git_hooks', {}).get('audit_hooks'):
        plan['integration_points'].append({
            'system': 'Git Hooks',
            'integration_type': 'pre_commit_integration',
            'description': 'Integrate framework with pre-commit hooks',
            'implementation': 'Add framework validation to pre-commit hooks'
        })
    
    return plan

def generate_recommendations(results: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Generate recommendations based on discovered systems"""
    recommendations = []
    
    # Check if framework should integrate rather than replace
    if results['discovered_systems'].get('github_actions', {}).get('count', 0) > 0:
        recommendations.append({
            'type': 'integration_over_replacement',
            'priority': 'high',
            'description': 'Integrate with existing GitHub Actions rather than creating parallel systems',
            'rationale': 'Existing CI/CD pipeline already established'
        })
    
    # Check for audit script consolidation
    if results['discovered_systems'].get('audit_scripts', {}).get('count', 0) > 5:
        recommendations.append({
            'type': 'consolidate_audit_scripts',
            'priority': 'medium',
            'description': 'Consolidate multiple audit scripts into framework frames',
            'rationale': 'Reduce maintenance overhead and improve consistency'
        })
    
    # Check for configuration standardization
    if results['discovered_systems'].get('config_files', {}).get('count', 0) > 3:
        recommendations.append({
            'type': 'standardize_configuration',
            'priority': 'medium',
            'description': 'Standardize configuration across existing systems and framework',
            'rationale': 'Ensure consistent behavior and reduce configuration drift'
        })
    
    return recommendations

# Helper functions
def extract_workflow_triggers(content: str) -> List[str]:
    """Extract workflow triggers from GitHub Actions content"""
    triggers = []
    lines = content.split('\n')
    for line in lines:
        if 'on:' in line or 'push:' in line or 'pull_request:' in line:
            triggers.append(line.strip())
    return triggers

def extract_workflow_jobs(content: str) -> List[str]:
    """Extract workflow jobs from GitHub Actions content"""
    jobs = []
    lines = content.split('\n')
    for line in lines:
        if 'jobs:' in line or '- name:' in line:
            jobs.append(line.strip())
    return jobs

def is_audit_related_workflow(content: str) -> bool:
    """Check if workflow is audit-related"""
    audit_keywords = ['audit', 'test', 'lint', 'check', 'verify', 'validate']
    content_lower = content.lower()
    return any(keyword in content_lower for keyword in audit_keywords)

def is_audit_related_hook(content: str) -> bool:
    """Check if hook is audit-related"""
    audit_keywords = ['audit', 'lint', 'test', 'check', 'validate']
    content_lower = content.lower()
    return any(keyword in content_lower for keyword in audit_keywords)

def extract_audit_functions(content: str, file_type: str) -> List[str]:
    """Extract audit-related functions from script content"""
    functions = []
    lines = content.split('\n')
    
    for line in lines:
        if file_type in ['.js', '.cjs']:
            if 'function' in line and ('audit' in line.lower() or 'check' in line.lower()):
                functions.append(line.strip())
        elif file_type == '.py':
            if 'def ' in line and ('audit' in line.lower() or 'check' in line.lower()):
                functions.append(line.strip())
    
    return functions

def extract_script_dependencies(content: str, file_type: str) -> List[str]:
    """Extract script dependencies"""
    dependencies = []
    lines = content.split('\n')
    
    for line in lines:
        if file_type in ['.js', '.cjs']:
            if 'require(' in line or 'import ' in line:
                dependencies.append(line.strip())
        elif file_type == '.py':
            if 'import ' in line or 'from ' in line:
                dependencies.append(line.strip())
    
    return dependencies

def group_scripts_by_type(scripts: Dict[str, Any]) -> Dict[str, List[str]]:
    """Group scripts by file type"""
    grouped = {}
    for script_name, script_info in scripts.items():
        script_type = script_info.get('type', 'unknown')
        if script_type not in grouped:
            grouped[script_type] = []
        grouped[script_type].append(script_name)
    return grouped

def is_audit_related_config(content: str) -> bool:
    """Check if configuration is audit-related"""
    audit_keywords = ['audit', 'lint', 'test', 'check', 'validate', 'eslint', 'prettier']
    content_lower = content.lower()
    return any(keyword in content_lower for keyword in audit_keywords)

if __name__ == "__main__":
    # Test the discovery function
    result = discover_existing_systems()
    print(json.dumps(result, indent=2))
