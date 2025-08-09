#!/usr/bin/env python3
"""
System Integration Implementation Frame
======================================

Implements integration with existing audit systems, GitHub Actions, hooks, and automation infrastructure
based on discovery results.
"""

import os
import json
import subprocess
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime
import shutil

def implement_system_integration(context: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Implement integration with existing systems based on discovery results.
    
    Args:
        context: Execution context from the framework
        
    Returns:
        Dict containing integration implementation results
    """
    print("🔗 IMPLEMENTING SYSTEM INTEGRATION...")
    print("=" * 60)
    
    # Initialize results
    results = {
        'integration_implemented': True,
        'timestamp': datetime.now().isoformat(),
        'implemented_integrations': [],
        'integration_points_created': [],
        'backup_files_created': [],
        'errors': []
    }
    
    try:
        # Load discovery results if available
        discovery_results = load_discovery_results()
        if not discovery_results:
            print("⚠️ No discovery results found. Running discovery first...")
            discovery_results = run_discovery()
        
        # 1. Implement GitHub Actions integration
        print("📋 Implementing GitHub Actions integration...")
        github_integration = implement_github_actions_integration(discovery_results)
        results['implemented_integrations'].append(github_integration)
        
        # 2. Implement Git hooks integration
        print("🔗 Implementing Git hooks integration...")
        hooks_integration = implement_git_hooks_integration(discovery_results)
        results['implemented_integrations'].append(hooks_integration)
        
        # 3. Implement audit scripts integration
        print("🔍 Implementing audit scripts integration...")
        scripts_integration = implement_audit_scripts_integration(discovery_results)
        results['implemented_integrations'].append(scripts_integration)
        
        # 4. Create integration documentation
        print("📝 Creating integration documentation...")
        docs_integration = create_integration_documentation(discovery_results, results)
        results['implemented_integrations'].append(docs_integration)
        
        # 5. Update framework configuration
        print("⚙️ Updating framework configuration...")
        config_integration = update_framework_configuration(discovery_results)
        results['implemented_integrations'].append(config_integration)
        
        # Save detailed report
        report_path = f"reports/system_integration_implementation_{int(datetime.now().timestamp())}.json"
        os.makedirs("reports", exist_ok=True)
        with open(report_path, 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"📄 Integration report saved: {report_path}")
        print("=" * 60)
        print("✅ SYSTEM INTEGRATION IMPLEMENTATION COMPLETE")
        
    except Exception as e:
        results['errors'].append(str(e))
        print(f"❌ Error during integration: {e}")
    
    return results

def load_discovery_results() -> Optional[Dict[str, Any]]:
    """Load the most recent discovery results"""
    reports_dir = Path("reports")
    if not reports_dir.exists():
        return None
    
    # Find the most recent discovery report
    discovery_reports = list(reports_dir.glob("pre_existing_systems_discovery_*.json"))
    if not discovery_reports:
        return None
    
    latest_report = max(discovery_reports, key=lambda x: x.stat().st_mtime)
    
    try:
        with open(latest_report, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"⚠️ Error loading discovery results: {e}")
        return None

def run_discovery() -> Dict[str, Any]:
    """Run discovery if no results are available"""
    try:
        from scripts.pre_existing_systems_discovery import discover_existing_systems
        return discover_existing_systems()
    except ImportError:
        print("⚠️ Could not import discovery module")
        return {}

def implement_github_actions_integration(discovery_results: Dict[str, Any]) -> Dict[str, Any]:
    """Implement GitHub Actions integration"""
    integration_result = {
        'type': 'github_actions_integration',
        'status': 'implemented',
        'files_modified': [],
        'files_created': [],
        'backup_files': []
    }
    
    try:
        workflows_dir = Path(".github/workflows")
        if not workflows_dir.exists():
            workflows_dir.mkdir(parents=True, exist_ok=True)
        
        # Create framework integration workflow
        framework_workflow = create_framework_workflow()
        workflow_path = workflows_dir / "framework-integration.yml"
        
        # Backup existing workflow if it exists
        if workflow_path.exists():
            backup_path = workflows_dir / f"framework-integration.yml.backup.{int(datetime.now().timestamp())}"
            shutil.copy2(workflow_path, backup_path)
            integration_result['backup_files'].append(str(backup_path))
        
        # Write new workflow
        with open(workflow_path, 'w') as f:
            f.write(framework_workflow)
        
        integration_result['files_created'].append(str(workflow_path))
        
        # Update existing workflows to trigger framework
        existing_workflows = discovery_results.get('discovered_systems', {}).get('github_actions', {}).get('workflows', {})
        for workflow_name, workflow_info in existing_workflows.items():
            if workflow_info.get('audit_related', False):
                updated = update_existing_workflow(workflow_name, workflow_info)
                if updated:
                    integration_result['files_modified'].append(workflow_name)
        
    except Exception as e:
        integration_result['status'] = 'failed'
        integration_result['error'] = str(e)
    
    return integration_result

def implement_git_hooks_integration(discovery_results: Dict[str, Any]) -> Dict[str, Any]:
    """Implement Git hooks integration"""
    integration_result = {
        'type': 'git_hooks_integration',
        'status': 'implemented',
        'files_modified': [],
        'files_created': [],
        'backup_files': []
    }
    
    try:
        # Update pre-commit hook to include framework validation
        pre_commit_path = Path(".husky/pre-commit")
        if pre_commit_path.exists():
            # Backup existing hook
            backup_path = Path(f".husky/pre-commit.backup.{int(datetime.now().timestamp())}")
            shutil.copy2(pre_commit_path, backup_path)
            integration_result['backup_files'].append(str(backup_path))
            
            # Update pre-commit hook
            updated_content = update_pre_commit_hook(pre_commit_path)
            with open(pre_commit_path, 'w') as f:
                f.write(updated_content)
            
            integration_result['files_modified'].append(str(pre_commit_path))
        
        # Create framework validation script
        validation_script = create_framework_validation_script()
        validation_path = Path("scripts/framework-validation.js")
        
        with open(validation_path, 'w') as f:
            f.write(validation_script)
        
        integration_result['files_created'].append(str(validation_path))
        
    except Exception as e:
        integration_result['status'] = 'failed'
        integration_result['error'] = str(e)
    
    return integration_result

def implement_audit_scripts_integration(discovery_results: Dict[str, Any]) -> Dict[str, Any]:
    """Implement audit scripts integration"""
    integration_result = {
        'type': 'audit_scripts_integration',
        'status': 'implemented',
        'frames_created': [],
        'scripts_analyzed': [],
        'integration_points': []
    }
    
    try:
        # Analyze existing audit scripts and create framework frames
        audit_scripts = discovery_results.get('discovered_systems', {}).get('audit_scripts', {}).get('scripts', {})
        
        for script_name, script_info in audit_scripts.items():
            if 'error' not in script_info:
                frame_created = create_frame_from_script(script_name, script_info)
                if frame_created:
                    integration_result['frames_created'].append(script_name)
                
                integration_result['scripts_analyzed'].append(script_name)
        
        # Create integration registry
        registry = create_integration_registry(audit_scripts)
        registry_path = Path("config/framework-integration-registry.json")
        registry_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(registry_path, 'w') as f:
            json.dump(registry, f, indent=2)
        
        integration_result['integration_points'].append(str(registry_path))
        
    except Exception as e:
        integration_result['status'] = 'failed'
        integration_result['error'] = str(e)
    
    return integration_result

def create_integration_documentation(discovery_results: Dict[str, Any], implementation_results: Dict[str, Any]) -> Dict[str, Any]:
    """Create integration documentation"""
    integration_result = {
        'type': 'documentation_integration',
        'status': 'implemented',
        'files_created': []
    }
    
    try:
        # Create integration guide
        integration_guide = create_integration_guide(discovery_results, implementation_results)
        guide_path = Path("docs/system/FRAMEWORK_INTEGRATION_GUIDE.md")
        guide_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(guide_path, 'w') as f:
            f.write(integration_guide)
        
        integration_result['files_created'].append(str(guide_path))
        
        # Create integration status report
        status_report = create_integration_status_report(discovery_results, implementation_results)
        status_path = Path("docs/system/INTEGRATION_STATUS.md")
        
        with open(status_path, 'w') as f:
            f.write(status_report)
        
        integration_result['files_created'].append(str(status_path))
        
    except Exception as e:
        integration_result['status'] = 'failed'
        integration_result['error'] = str(e)
    
    return integration_result

def update_framework_configuration(discovery_results: Dict[str, Any]) -> Dict[str, Any]:
    """Update framework configuration to reference existing systems"""
    integration_result = {
        'type': 'configuration_integration',
        'status': 'implemented',
        'files_modified': []
    }
    
    try:
        # Update Knowledge Hub with integration information
        knowledge_hub_path = Path("KNOWLEDGE_HUB.md")
        if knowledge_hub_path.exists():
            updated_content = update_knowledge_hub_integration(knowledge_hub_path, discovery_results)
            with open(knowledge_hub_path, 'w') as f:
                f.write(updated_content)
            
            integration_result['files_modified'].append(str(knowledge_hub_path))
        
        # Create integration configuration file
        integration_config = create_integration_config(discovery_results)
        config_path = Path("config/framework-integration.json")
        config_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(config_path, 'w') as f:
            json.dump(integration_config, f, indent=2)
        
        integration_result['files_modified'].append(str(config_path))
        
    except Exception as e:
        integration_result['status'] = 'failed'
        integration_result['error'] = str(e)
    
    return integration_result

# Helper functions for creating integration components
def create_framework_workflow() -> str:
    """Create GitHub Actions workflow for framework integration"""
    return """name: Framework Integration
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
  workflow_dispatch:

jobs:
  framework-integration:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
          
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: |
          pip install -r backend/requirements.txt
          npm ci
          
      - name: Run Framework Integration
        run: |
          python autonomous-framework-v2.py system_integration
          
      - name: Upload Integration Report
        uses: actions/upload-artifact@v3
        with:
          name: framework-integration-report
          path: reports/system_integration_implementation_*.json
"""

def update_existing_workflow(workflow_name: str, workflow_info: Dict[str, Any]) -> bool:
    """Update existing workflow to include framework integration"""
    try:
        workflow_path = Path(workflow_info['path'])
        if not workflow_path.exists():
            return False
        
        # Read existing content
        with open(workflow_path, 'r') as f:
            content = f.read()
        
        # Add framework integration step if not already present
        if 'framework-integration' not in content:
            # Find a good place to insert the framework step
            if 'jobs:' in content:
                # Add framework step after existing jobs
                framework_step = """
      - name: Run Framework Integration
        run: |
          python autonomous-framework-v2.py quick_assessment
"""
                # Insert before the last job
                lines = content.split('\n')
                for i, line in enumerate(lines):
                    if line.strip().startswith('- name:') and i > 0:
                        lines.insert(i, framework_step)
                        break
                
                content = '\n'.join(lines)
                
                # Write updated content
                with open(workflow_path, 'w') as f:
                    f.write(content)
                
                return True
        
        return False
        
    except Exception as e:
        print(f"⚠️ Error updating workflow {workflow_name}: {e}")
        return False

def update_pre_commit_hook(hook_path: Path) -> str:
    """Update pre-commit hook to include framework validation"""
    try:
        with open(hook_path, 'r') as f:
            content = f.read()
        
        # Add framework validation if not already present
        if 'framework-validation' not in content:
            framework_validation = """
# Framework validation
echo "Running framework validation..."
node scripts/framework-validation.js
if [ $? -ne 0 ]; then
  echo "Framework validation failed"
  exit 1
fi
"""
            content += framework_validation
        
        return content
        
    except Exception as e:
        print(f"⚠️ Error updating pre-commit hook: {e}")
        return "npx lint-staged"

def create_framework_validation_script() -> str:
    """Create framework validation script for pre-commit hooks"""
    return """#!/usr/bin/env node
/**
 * Framework Validation Script
 * Validates framework configuration and readiness for commit
 */

const fs = require('fs');
const path = require('path');

function validateFramework() {
    console.log('🔍 Validating framework configuration...');
    
    const errors = [];
    const warnings = [];
    
    // Check if framework file exists
    if (!fs.existsSync('autonomous-framework-v2.py')) {
        errors.push('Framework file not found: autonomous-framework-v2.py');
    }
    
    // Check if required directories exist
    const requiredDirs = ['scripts', 'reports', 'backlog'];
    requiredDirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            warnings.push(`Directory not found: ${dir}`);
        }
    });
    
    // Check if integration configuration exists
    if (!fs.existsSync('config/framework-integration.json')) {
        warnings.push('Integration configuration not found');
    }
    
    // Report results
    if (errors.length > 0) {
        console.error('❌ Framework validation failed:');
        errors.forEach(error => console.error(`  - ${error}`));
        process.exit(1);
    }
    
    if (warnings.length > 0) {
        console.warn('⚠️ Framework validation warnings:');
        warnings.forEach(warning => console.warn(`  - ${warning}`));
    }
    
    console.log('✅ Framework validation passed');
}

validateFramework();
"""

def create_frame_from_script(script_name: str, script_info: Dict[str, Any]) -> bool:
    """Create a framework frame from an existing audit script"""
    try:
        script_path = Path(script_info['path'])
        if not script_path.exists():
            return False
        
        # Create frame configuration
        frame_config = {
            'id': f"existing_{script_name.replace('.', '_')}",
            'name': f"Existing {script_name}",
            'description': f"Integration with existing {script_name}",
            'file_path': str(script_path),
            'type': 'analysis',
            'entry_point': 'main',
            'dependencies': ['node'] if script_path.suffix in ['.js', '.cjs'] else ['python'],
            'parameters': {'timeout': 300},
            'success_criteria': {'integration_complete': True},
            'rollback_plan': 'No rollback needed - integration only',
            'context_preservation': True
        }
        
        # Save frame configuration
        frames_dir = Path("config/frames")
        frames_dir.mkdir(parents=True, exist_ok=True)
        
        frame_path = frames_dir / f"{frame_config['id']}.json"
        with open(frame_path, 'w') as f:
            json.dump(frame_config, f, indent=2)
        
        return True
        
    except Exception as e:
        print(f"⚠️ Error creating frame from {script_name}: {e}")
        return False

def create_integration_registry(audit_scripts: Dict[str, Any]) -> Dict[str, Any]:
    """Create integration registry for existing scripts"""
    registry = {
        'version': '1.0',
        'created_at': datetime.now().isoformat(),
        'integrated_scripts': {},
        'integration_points': [],
        'configuration': {
            'auto_discovery': True,
            'backup_existing': True,
            'preserve_context': True
        }
    }
    
    for script_name, script_info in audit_scripts.items():
        if 'error' not in script_info:
            registry['integrated_scripts'][script_name] = {
                'path': script_info['path'],
                'type': script_info.get('type', 'unknown'),
                'audit_functions': script_info.get('audit_functions', []),
                'dependencies': script_info.get('dependencies', []),
                'frame_id': f"existing_{script_name.replace('.', '_')}"
            }
    
    return registry

def create_integration_guide(discovery_results: Dict[str, Any], implementation_results: Dict[str, Any]) -> str:
    """Create integration guide documentation"""
    return f"""# Framework Integration Guide

## Overview
This guide documents the integration between the Autonomous Framework and existing systems.

## Integration Status
- **GitHub Actions**: {len([r for r in implementation_results['implemented_integrations'] if r['type'] == 'github_actions_integration' and r['status'] == 'implemented'])} workflows integrated
- **Git Hooks**: {len([r for r in implementation_results['implemented_integrations'] if r['type'] == 'git_hooks_integration' and r['status'] == 'implemented'])} hooks integrated
- **Audit Scripts**: {len([r for r in implementation_results['implemented_integrations'] if r['type'] == 'audit_scripts_integration' and r['status'] == 'implemented'])} scripts integrated

## Discovered Systems
{format_discovered_systems(discovery_results)}

## Integration Points
{format_integration_points(implementation_results)}

## Usage
1. Run discovery: `python autonomous-framework-v2.py system_integration`
2. Review integration report in `reports/`
3. Verify integration in existing workflows

## Configuration
Integration configuration is stored in `config/framework-integration.json`
"""

def create_integration_status_report(discovery_results: Dict[str, Any], implementation_results: Dict[str, Any]) -> str:
    """Create integration status report"""
    return f"""# Integration Status Report

Generated: {datetime.now().isoformat()}

## Summary
- **Total Systems Discovered**: {len(discovery_results.get('discovered_systems', {}))}
- **Integration Opportunities**: {len(discovery_results.get('integration_opportunities', []))}
- **Duplication Risks**: {len(discovery_results.get('duplication_risks', []))}
- **Implementations Completed**: {len([r for r in implementation_results['implemented_integrations'] if r['status'] == 'implemented'])}

## Implementation Results
{format_implementation_results(implementation_results)}

## Next Steps
{format_next_steps(discovery_results, implementation_results)}
"""

def update_knowledge_hub_integration(hub_path: Path, discovery_results: Dict[str, Any]) -> str:
    """Update Knowledge Hub with integration information"""
    try:
        with open(hub_path, 'r') as f:
            content = f.read()
        
        # Add integration section if not present
        if '## 🔗 System Integration' not in content:
            integration_section = """

## 🔗 System Integration

### Discovered Systems
- **GitHub Actions**: {github_count} workflows
- **Git Hooks**: {hooks_count} hooks
- **Audit Scripts**: {scripts_count} scripts
- **Configuration Files**: {config_count} files

### Integration Status
- ✅ Pre-Existing Systems Discovery implemented
- ✅ System Integration scaffold available
- ✅ Integration with existing CI/CD pipeline
- ✅ Framework validation in pre-commit hooks

### Usage
```bash
# Run system integration
python autonomous-framework-v2.py system_integration

# Run discovery only
python scripts/pre-existing-systems-discovery.py
```

""".format(
                github_count=discovery_results.get('discovered_systems', {}).get('github_actions', {}).get('count', 0),
                hooks_count=discovery_results.get('discovered_systems', {}).get('git_hooks', {}).get('count', 0),
                scripts_count=discovery_results.get('discovered_systems', {}).get('audit_scripts', {}).get('count', 0),
                config_count=discovery_results.get('discovered_systems', {}).get('config_files', {}).get('count', 0)
            )
            
            # Insert before the last section
            lines = content.split('\n')
            for i, line in enumerate(lines):
                if line.startswith('## ') and i > len(lines) - 10:  # Near the end
                    lines.insert(i, integration_section)
                    break
            
            content = '\n'.join(lines)
        
        return content
        
    except Exception as e:
        print(f"⚠️ Error updating Knowledge Hub: {e}")
        return content

def create_integration_config(discovery_results: Dict[str, Any]) -> Dict[str, Any]:
    """Create integration configuration file"""
    return {
        'version': '1.0',
        'created_at': datetime.now().isoformat(),
        'discovery_results': discovery_results,
        'integration_settings': {
            'auto_discovery': True,
            'backup_existing': True,
            'preserve_context': True,
            'github_actions_integration': True,
            'git_hooks_integration': True,
            'audit_scripts_integration': True
        },
        'framework_configuration': {
            'discovery_frame': 'pre_existing_systems_discovery',
            'integration_scaffold': 'system_integration',
            'validation_script': 'scripts/framework-validation.js'
        }
    }

# Helper formatting functions
def format_discovered_systems(discovery_results: Dict[str, Any]) -> str:
    """Format discovered systems for documentation"""
    systems = discovery_results.get('discovered_systems', {})
    
    formatted = []
    for system_type, system_info in systems.items():
        count = system_info.get('count', 0)
        formatted.append(f"- **{system_type.replace('_', ' ').title()}**: {count} items")
    
    return '\n'.join(formatted)

def format_integration_points(implementation_results: Dict[str, Any]) -> str:
    """Format integration points for documentation"""
    points = []
    for integration in implementation_results['implemented_integrations']:
        if integration['status'] == 'implemented':
            points.append(f"- **{integration['type']}**: {len(integration.get('files_created', []))} files created, {len(integration.get('files_modified', []))} files modified")
    
    return '\n'.join(points) if points else "- No integration points implemented"

def format_implementation_results(implementation_results: Dict[str, Any]) -> str:
    """Format implementation results for documentation"""
    results = []
    for integration in implementation_results['implemented_integrations']:
        status = "✅" if integration['status'] == 'implemented' else "❌"
        results.append(f"{status} **{integration['type']}**: {integration['status']}")
        if 'error' in integration:
            results.append(f"  - Error: {integration['error']}")
    
    return '\n'.join(results)

def format_next_steps(discovery_results: Dict[str, Any], implementation_results: Dict[str, Any]) -> str:
    """Format next steps for documentation"""
    steps = []
    
    # Check for high priority opportunities
    opportunities = discovery_results.get('integration_opportunities', [])
    high_priority = [opp for opp in opportunities if opp.get('priority') == 'high']
    
    if high_priority:
        steps.append("### High Priority Opportunities")
        for opp in high_priority:
            steps.append(f"- {opp['description']} (Effort: {opp['effort']})")
    
    # Check for duplication risks
    risks = discovery_results.get('duplication_risks', [])
    if risks:
        steps.append("### Address Duplication Risks")
        for risk in risks:
            steps.append(f"- {risk['description']} (Severity: {risk['severity']})")
    
    return '\n'.join(steps) if steps else "- No immediate next steps identified"

if __name__ == "__main__":
    # Test the integration function
    result = implement_system_integration()
    print(json.dumps(result, indent=2))
