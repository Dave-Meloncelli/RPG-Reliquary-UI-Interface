#!/usr/bin/env python3
"""
All-In Analysis Frame
Comprehensive analysis of gaps, risks, opportunities, and synergies
"""

import os
import sys
import json
import subprocess
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional

# Analysis categories for comprehensive coverage
ANALYSIS_CATEGORIES = {
    'gaps': {
        'capability': ['missing_features', 'incomplete_implementations', 'unmet_requirements'],
        'coverage': ['untested_areas', 'edge_cases', 'error_scenarios'],
        'integration': ['broken_links', 'inconsistent_apis', 'data_flow_issues'],
        'knowledge': ['undocumented_processes', 'missing_documentation', 'knowledge_silos']
    },
    'risks': {
        'technical': ['security_vulnerabilities', 'performance_bottlenecks', 'scalability_issues'],
        'operational': ['deployment_risks', 'monitoring_gaps', 'disaster_recovery'],
        'security': ['access_control', 'data_protection', 'compliance_issues'],
        'business': ['market_fit', 'user_experience', 'competitive_position']
    },
    'opportunities': {
        'optimization': ['performance_improvements', 'resource_efficiency', 'cost_reduction'],
        'automation': ['manual_processes', 'repetitive_tasks', 'deployment_automation'],
        'synergy': ['tool_integration', 'process_alignment', 'knowledge_sharing'],
        'innovation': ['new_features', 'technology_upgrades', 'market_expansion']
    },
    'synergies': {
        'cross_component': ['shared_utilities', 'common_patterns', 'unified_apis'],
        'tool_integration': ['workflow_automation', 'data_flow', 'event_driven_arch'],
        'process_efficiency': ['streamlined_workflows', 'reduced_duplication', 'faster_iteration']
    }
}

# Impact scoring system
IMPACT_LEVELS = {
    'critical': {'score': 5, 'description': 'Immediate attention required, blocking progress'},
    'high': {'score': 4, 'description': 'Significant impact on system health or efficiency'},
    'medium': {'score': 3, 'description': 'Moderate impact, should be addressed soon'},
    'low': {'score': 2, 'description': 'Minor impact, nice to have'},
    'negligible': {'score': 1, 'description': 'Minimal impact, can be deferred'}
}

# Effort estimation
EFFORT_LEVELS = {
    'trivial': {'hours': 1, 'description': 'Quick fix or simple addition'},
    'small': {'hours': 4, 'description': 'Few hours of work'},
    'medium': {'hours': 16, 'description': '1-2 days of work'},
    'large': {'hours': 40, 'description': '1 week of work'},
    'massive': {'hours': 80, 'description': '2+ weeks of work'}
}

def analyze_file_structure() -> Dict[str, Any]:
    """Analyze the file structure and identify patterns"""
    analysis = {
        'files': [],
        'directories': [],
        'patterns': {},
        'missing': []
    }

    root_dir = Path.cwd()
    common_patterns = [
        'package.json', 'requirements.txt', 'README.md', '.gitignore',
        'tsconfig.json', 'vite.config.ts', 'tailwind.config.js',
        'Dockerfile', 'docker-compose.yml', '.env.example'
    ]

    def scan_directory(directory: Path, relative_path: str = ''):
        try:
            for item in directory.iterdir():
                relative_item_path = str(item.relative_to(root_dir))
                
                if item.is_dir():
                    analysis['directories'].append(relative_item_path)
                    scan_directory(item, relative_item_path)
                else:
                    analysis['files'].append(relative_item_path)
        except PermissionError:
            # Directory might not be accessible
            pass

    scan_directory(root_dir)

    # Check for missing common patterns
    for pattern in common_patterns:
        if not any(pattern in f for f in analysis['files']):
            analysis['missing'].append(pattern)

    return analysis

def analyze_dependencies() -> Dict[str, Any]:
    """Analyze dependencies across different ecosystems"""
    analysis = {
        'python': {'packages': [], 'vulnerabilities': [], 'outdated': []},
        'node': {'packages': [], 'vulnerabilities': [], 'outdated': []},
        'system': {'tools': [], 'missing': []}
    }

    try:
        # Analyze Python dependencies
        requirements_path = Path('backend/requirements.txt')
        if requirements_path.exists():
            with open(requirements_path, 'r', encoding='utf-8') as f:
                requirements = f.read()
                analysis['python']['packages'] = [
                    line.split('==')[0].split('>=')[0].split('<=')[0]
                    for line in requirements.split('\n')
                    if line.strip() and not line.startswith('#')
                ]

        # Analyze Node.js dependencies
        package_json_path = Path('package.json')
        if package_json_path.exists():
            with open(package_json_path, 'r', encoding='utf-8') as f:
                package_json = json.load(f)
                analysis['node']['packages'] = list(
                    (package_json.get('dependencies', {}) or {}).keys()
                ) + list(
                    (package_json.get('devDependencies', {}) or {}).keys()
                )

        # Check for system tools
        system_tools = ['git', 'python', 'pip']
        for tool in system_tools:
            try:
                subprocess.run([tool, '--version'], capture_output=True, check=True)
                analysis['system']['tools'].append(tool)
            except (subprocess.CalledProcessError, FileNotFoundError):
                analysis['system']['missing'].append(tool)

    except Exception as e:
        print(f"Warning: Error analyzing dependencies: {e}")

    return analysis

def analyze_code_quality() -> Dict[str, Any]:
    """Analyze code quality indicators"""
    analysis = {
        'complexity': {'high': [], 'medium': [], 'low': []},
        'duplication': {'files': [], 'patterns': []},
        'documentation': {'covered': [], 'missing': []},
        'testing': {'coverage': 0, 'missing': []}
    }

    # Analyze file sizes and complexity indicators
    code_extensions = {'.py', '.js', '.ts', '.jsx', '.tsx'}
    
    for file_path in Path('.').rglob('*'):
        if file_path.is_file() and file_path.suffix in code_extensions:
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    lines = len(content.split('\n'))
                    
                    if lines > 1000:
                        analysis['complexity']['high'].append(str(file_path))
                    elif lines > 500:
                        analysis['complexity']['medium'].append(str(file_path))
                    else:
                        analysis['complexity']['low'].append(str(file_path))

                    # Check for documentation
                    if any(marker in content for marker in ['"""', "'''", '//', '/*', '#']):
                        analysis['documentation']['covered'].append(str(file_path))
                    else:
                        analysis['documentation']['missing'].append(str(file_path))
            except Exception:
                # Skip files that can't be read
                pass

    return analysis

def identify_gaps(file_structure: Dict, dependencies: Dict, code_quality: Dict) -> List[Dict[str, Any]]:
    """Identify gaps in the system"""
    gaps = []

    # Capability gaps
    if file_structure['missing']:
        gaps.append({
            'category': 'capability',
            'type': 'missing_features',
            'description': f"Missing common project files: {', '.join(file_structure['missing'])}",
            'impact': IMPACT_LEVELS['medium'],
            'effort': EFFORT_LEVELS['small'],
            'priority': 'medium'
        })

    if dependencies['system']['missing']:
        gaps.append({
            'category': 'capability',
            'type': 'missing_features',
            'description': f"Missing system tools: {', '.join(dependencies['system']['missing'])}",
            'impact': IMPACT_LEVELS['high'],
            'effort': EFFORT_LEVELS['small'],
            'priority': 'high'
        })

    # Coverage gaps
    if code_quality['documentation']['missing']:
        gaps.append({
            'category': 'coverage',
            'type': 'missing_documentation',
            'description': f"{len(code_quality['documentation']['missing'])} files lack documentation",
            'impact': IMPACT_LEVELS['medium'],
            'effort': EFFORT_LEVELS['medium'],
            'priority': 'medium'
        })

    # Integration gaps
    if not Path('KNOWLEDGE_HUB.md').exists():
        gaps.append({
            'category': 'integration',
            'type': 'broken_links',
            'description': 'Missing centralized knowledge hub',
            'impact': IMPACT_LEVELS['high'],
            'effort': EFFORT_LEVELS['medium'],
            'priority': 'high'
        })

    return gaps

def identify_risks(file_structure: Dict, dependencies: Dict, code_quality: Dict) -> List[Dict[str, Any]]:
    """Identify risks in the system"""
    risks = []

    # Technical risks
    if code_quality['complexity']['high']:
        risks.append({
            'category': 'technical',
            'type': 'performance_bottlenecks',
            'description': f"{len(code_quality['complexity']['high'])} highly complex files may cause maintenance issues",
            'impact': IMPACT_LEVELS['high'],
            'effort': EFFORT_LEVELS['large'],
            'priority': 'high'
        })

    if dependencies['system']['missing']:
        risks.append({
            'category': 'operational',
            'type': 'deployment_risks',
            'description': 'Missing system dependencies may cause deployment failures',
            'impact': IMPACT_LEVELS['critical'],
            'effort': EFFORT_LEVELS['small'],
            'priority': 'critical'
        })

    # Security risks
    if Path('.env').exists() and not Path('.env.example').exists():
        risks.append({
            'category': 'security',
            'type': 'access_control',
            'description': 'Environment variables not properly documented',
            'impact': IMPACT_LEVELS['medium'],
            'effort': EFFORT_LEVELS['trivial'],
            'priority': 'medium'
        })

    return risks

def identify_opportunities(file_structure: Dict, dependencies: Dict, code_quality: Dict) -> List[Dict[str, Any]]:
    """Identify opportunities for improvement"""
    opportunities = []

    # Optimization opportunities
    if code_quality['complexity']['high']:
        opportunities.append({
            'category': 'optimization',
            'type': 'performance_improvements',
            'description': 'Refactor complex files to improve maintainability',
            'impact': IMPACT_LEVELS['high'],
            'effort': EFFORT_LEVELS['large'],
            'priority': 'high'
        })

    # Automation opportunities
    if not Path('.github/workflows').exists():
        opportunities.append({
            'category': 'automation',
            'type': 'deployment_automation',
            'description': 'Implement CI/CD pipeline for automated testing and deployment',
            'impact': IMPACT_LEVELS['high'],
            'effort': EFFORT_LEVELS['medium'],
            'priority': 'high'
        })

    # Innovation opportunities
    if dependencies['python']['packages'] and dependencies['node']['packages']:
        opportunities.append({
            'category': 'innovation',
            'type': 'technology_upgrades',
            'description': 'Consider modernizing to a unified tech stack for better integration',
            'impact': IMPACT_LEVELS['medium'],
            'effort': EFFORT_LEVELS['massive'],
            'priority': 'low'
        })

    return opportunities

def identify_synergies(file_structure: Dict, dependencies: Dict, code_quality: Dict) -> List[Dict[str, Any]]:
    """Identify synergies and integration opportunities"""
    synergies = []

    # Cross-component synergies
    if Path('scripts').exists() and Path('backend').exists():
        synergies.append({
            'category': 'cross_component',
            'type': 'shared_utilities',
            'description': 'Scripts and backend can share common utilities and patterns',
            'impact': IMPACT_LEVELS['medium'],
            'effort': EFFORT_LEVELS['small'],
            'priority': 'medium'
        })

    # Tool integration synergies
    if dependencies['python']['packages'] and dependencies['node']['packages']:
        synergies.append({
            'category': 'tool_integration',
            'type': 'workflow_automation',
            'description': 'Python and Node.js tools can be integrated for comprehensive automation',
            'impact': IMPACT_LEVELS['high'],
            'effort': EFFORT_LEVELS['medium'],
            'priority': 'high'
        })

    return synergies

def calculate_priority_score(item: Dict[str, Any]) -> float:
    """Calculate priority score based on impact and effort"""
    impact_score = item['impact']['score']
    effort_score = 6 - (item['effort']['hours'] / 16)  # Inverse relationship
    return (impact_score * 0.7) + (effort_score * 0.3)

def generate_recommendations(gaps: List[Dict], risks: List[Dict], 
                           opportunities: List[Dict], synergies: List[Dict]) -> Dict[str, List[Dict]]:
    """Generate actionable recommendations"""
    all_items = gaps + risks + opportunities + synergies
    
    # Calculate priority scores
    for item in all_items:
        item['priority_score'] = calculate_priority_score(item)

    # Sort by priority score
    all_items.sort(key=lambda x: x['priority_score'], reverse=True)

    # Generate actionable recommendations
    recommendations = {
        'immediate': [item for item in all_items if item['priority'] in ['critical', 'high']],
        'short_term': [item for item in all_items if item['priority'] == 'medium'],
        'long_term': [item for item in all_items if item['priority'] == 'low'],
        'quick_wins': [item for item in all_items if item['effort']['hours'] <= 4 and item['impact']['score'] >= 3]
    }

    return recommendations

def run_all_in_analysis(context: Dict[str, Any] = None) -> Dict[str, Any]:
    """Main analysis function"""
    if context is None:
        context = {}
    
    verbose = not context.get('entry_point')
    
    try:
        if verbose:
            print('🔍 Starting comprehensive "all-in" analysis...')

        # Perform systematic analysis
        file_structure = analyze_file_structure()
        dependencies = analyze_dependencies()
        code_quality = analyze_code_quality()

        # Identify all categories
        gaps = identify_gaps(file_structure, dependencies, code_quality)
        risks = identify_risks(file_structure, dependencies, code_quality)
        opportunities = identify_opportunities(file_structure, dependencies, code_quality)
        synergies = identify_synergies(file_structure, dependencies, code_quality)

        # Generate recommendations
        recommendations = generate_recommendations(gaps, risks, opportunities, synergies)

        # Calculate summary metrics
        all_items = gaps + risks + opportunities + synergies
        summary = {
            'total_items': len(all_items),
            'critical_items': len(recommendations['immediate']),
            'quick_wins': len(recommendations['quick_wins']),
            'estimated_effort_hours': sum(item['effort']['hours'] for item in all_items),
            'risk_score': sum(risk['impact']['score'] for risk in risks) / max(len(risks), 1),
            'opportunity_score': sum(opp['impact']['score'] for opp in opportunities) / max(len(opportunities), 1)
        }

        # Save detailed report
        reports_dir = Path('reports')
        reports_dir.mkdir(exist_ok=True)
        
        report_path = reports_dir / f'all_in_analysis_{int(time.time())}.json'
        detailed_report = {
            'analysis_timestamp': datetime.now().isoformat(),
            'summary': summary,
            'gaps': gaps,
            'risks': risks,
            'opportunities': opportunities,
            'synergies': synergies,
            'recommendations': recommendations,
            'raw_data': {
                'file_structure': file_structure,
                'dependencies': dependencies,
                'code_quality': code_quality
            }
        }

        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(detailed_report, f, indent=2, ensure_ascii=False)

        result = {
            'success': True,
            'all_in_analysis_complete': True,
            'report_path': str(report_path),
            'summary': summary,
            'critical_items_count': len(recommendations['immediate']),
            'quick_wins_count': len(recommendations['quick_wins']),
            'total_effort_hours': summary['estimated_effort_hours'],
            'risk_score': summary['risk_score'],
            'opportunity_score': summary['opportunity_score']
        }

        if context and context.get('entry_point'):
            print(json.dumps(result))
            return result
        else:
            print(json.dumps(result))
            
            if verbose:
                print('\n📊 Analysis Summary:')
                print(f"Total items analyzed: {summary['total_items']}")
                print(f"Critical items: {summary['critical_items']}")
                print(f"Quick wins: {summary['quick_wins']}")
                print(f"Estimated effort: {summary['estimated_effort_hours']} hours")
                print(f"Risk score: {summary['risk_score']:.2f}/5")
                print(f"Opportunity score: {summary['opportunity_score']:.2f}/5")
                
                if recommendations['immediate']:
                    print('\n🚨 Immediate Actions:')
                    for i, item in enumerate(recommendations['immediate'][:5], 1):
                        print(f"{i}. {item['description']} ({item['effort']['hours']}h, {item['impact']['description']})")

                if recommendations['quick_wins']:
                    print('\n⚡ Quick Wins:')
                    for i, item in enumerate(recommendations['quick_wins'][:3], 1):
                        print(f"{i}. {item['description']} ({item['effort']['hours']}h, {item['impact']['description']})")

            return detailed_report

    except Exception as e:
        fail = {
            'success': False,
            'all_in_analysis_complete': False,
            'error': str(e),
            'summary': 'All-in analysis failed'
        }
        if verbose:
            print(json.dumps(fail))
        return fail

if __name__ == "__main__":
    run_all_in_analysis()
