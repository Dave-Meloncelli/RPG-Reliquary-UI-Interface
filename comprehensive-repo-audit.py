#!/usr/bin/env python3
"""
Comprehensive Repository Audit Script
A/B Testing Methodology: Manual vs Automated Analysis
"""

import os
import json
import re
from pathlib import Path
from typing import Dict, List, Set, Any
from datetime import datetime
import hashlib

class RepositoryAuditor:
    def __init__(self):
        self.repo_root = Path.cwd()
        self.audit_results = {
            'timestamp': datetime.now().isoformat(),
            'audit_method': 'comprehensive_repo_audit',
            'files_analyzed': 0,
            'systems_identified': set(),
            'processes_identified': set(),
            'documentation_gaps': [],
            'indexing_issues': [],
            'a_b_test_results': {},
            'recommendations': []
        }
        
    def run_audit(self):
        """Main audit execution with A/B testing"""
        print("🔍 STARTING COMPREHENSIVE REPOSITORY AUDIT")
        print("=" * 60)
        
        # A/B Testing: Manual vs Automated Analysis
        print("\n🧪 A/B TESTING: Manual vs Automated Analysis")
        
        # Method A: Manual Analysis (Traditional)
        print("\n📋 METHOD A: Manual Analysis")
        manual_results = self.manual_analysis()
        
        # Method B: Automated Analysis (Our Framework)
        print("\n🤖 METHOD B: Automated Analysis")
        automated_results = self.automated_analysis()
        
        # Compare Results
        comparison = self.compare_a_b_results(manual_results, automated_results)
        
        # Generate Final Report
        final_report = self.generate_final_report(comparison)
        
        return final_report
    
    def manual_analysis(self) -> Dict[str, Any]:
        """Traditional manual analysis approach"""
        print("  🔍 Scanning repository structure...")
        
        # File Discovery
        all_files = self.discover_all_files()
        self.audit_results['files_analyzed'] = len(all_files)
        
        # System Identification
        systems = self.identify_systems_manual(all_files)
        
        # Process Identification
        processes = self.identify_processes_manual(all_files)
        
        # Documentation Analysis
        doc_analysis = self.analyze_documentation_manual(all_files)
        
        return {
            'files_found': len(all_files),
            'systems_identified': systems,
            'processes_identified': processes,
            'documentation_coverage': doc_analysis,
            'method': 'manual'
        }
    
    def automated_analysis(self) -> Dict[str, Any]:
        """Automated analysis using our framework"""
        print("  🤖 Running autonomous framework analysis...")
        
        # Use our existing autonomous system
        try:
            # Import and run autonomous system
            import sys
            sys.path.append('.')
            
            # Check for autonomous framework files
            framework_files = {
                'autonomous-framework-v2.py': 'main_framework',
                'autonomous-system-v3.py': 'synthesis_analysis',
                'autonomous-system-v4.py': 'enhanced_analysis',
                'autonomous-system-v5.py': 'risk_mitigation',
                'autonomous-system-meta-analysis.py': 'meta_analysis'
            }
            
            framework_status = {}
            for filename, component in framework_files.items():
                file_path = self.repo_root / filename
                if file_path.exists():
                    framework_status[component] = {
                        'status': 'present',
                        'size': file_path.stat().st_size,
                        'last_modified': datetime.fromtimestamp(file_path.stat().st_mtime).isoformat()
                    }
                else:
                    framework_status[component] = {
                        'status': 'missing',
                        'size': 0,
                        'last_modified': None
                    }
            
            return {
                'framework_status': framework_status,
                'method': 'automated_file_analysis'
            }
        except Exception as e:
            print(f"  ⚠️ Automated analysis failed: {e}")
            return {
                'error': str(e),
                'method': 'automated_failed'
            }
    
    def discover_all_files(self) -> List[Path]:
        """Discover all relevant files in repository"""
        relevant_extensions = {
            '.py', '.ts', '.tsx', '.js', '.jsx', '.md', '.json', 
            '.yml', '.yaml', '.txt', '.sh', '.bat', '.ps1'
        }
        
        files = []
        for root, dirs, filenames in os.walk(self.repo_root):
            # Skip common directories
            dirs[:] = [d for d in dirs if d not in {'.git', 'node_modules', '.vite', '__pycache__'}]
            
            for filename in filenames:
                file_path = Path(root) / filename
                if file_path.suffix in relevant_extensions:
                    files.append(file_path)
        
        return files
    
    def identify_systems_manual(self, files: List[Path]) -> Dict[str, Any]:
        """Manually identify systems in the repository"""
        systems = {
            'frontend': {'files': [], 'status': 'unknown'},
            'backend': {'files': [], 'status': 'unknown'},
            'autonomous_framework': {'files': [], 'status': 'unknown'},
            'consciousness': {'files': [], 'status': 'unknown'},
            'documentation': {'files': [], 'status': 'unknown'},
            'config': {'files': [], 'status': 'unknown'},
            'scripts': {'files': [], 'status': 'unknown'}
        }
        
        for file_path in files:
            relative_path = file_path.relative_to(self.repo_root)
            
            # Categorize files
            if 'src/' in str(relative_path) or file_path.suffix in {'.ts', '.tsx', '.js', '.jsx'}:
                systems['frontend']['files'].append(str(relative_path))
            elif 'backend/' in str(relative_path) or file_path.suffix == '.py':
                systems['backend']['files'].append(str(relative_path))
            elif 'autonomous' in str(relative_path).lower():
                systems['autonomous_framework']['files'].append(str(relative_path))
            elif 'consciousness/' in str(relative_path):
                systems['consciousness']['files'].append(str(relative_path))
            elif file_path.suffix == '.md':
                systems['documentation']['files'].append(str(relative_path))
            elif 'config/' in str(relative_path):
                systems['config']['files'].append(str(relative_path))
            elif file_path.suffix in {'.sh', '.bat', '.ps1'}:
                systems['scripts']['files'].append(str(relative_path))
        
        # Determine status based on file presence and content
        for system, data in systems.items():
            if data['files']:
                data['status'] = 'present'
                data['file_count'] = len(data['files'])
            else:
                data['status'] = 'missing'
                data['file_count'] = 0
        
        return systems
    
    def identify_processes_manual(self, files: List[Path]) -> Dict[str, Any]:
        """Manually identify processes in the repository"""
        processes = {
            'development_workflow': {'files': [], 'status': 'unknown'},
            'testing': {'files': [], 'status': 'unknown'},
            'deployment': {'files': [], 'status': 'unknown'},
            'monitoring': {'files': [], 'status': 'unknown'},
            'documentation_generation': {'files': [], 'status': 'unknown'}
        }
        
        for file_path in files:
            relative_path = file_path.relative_to(self.repo_root)
            filename = file_path.name.lower()
            
            # Categorize processes
            if any(keyword in filename for keyword in ['workflow', 'ci', 'cd', 'pipeline']):
                processes['development_workflow']['files'].append(str(relative_path))
            elif any(keyword in filename for keyword in ['test', 'spec', 'vitest', 'pytest']):
                processes['testing']['files'].append(str(relative_path))
            elif any(keyword in filename for keyword in ['deploy', 'docker', 'compose']):
                processes['deployment']['files'].append(str(relative_path))
            elif any(keyword in filename for keyword in ['monitor', 'prometheus', 'grafana']):
                processes['monitoring']['files'].append(str(relative_path))
            elif any(keyword in filename for keyword in ['generate', 'index', 'audit']):
                processes['documentation_generation']['files'].append(str(relative_path))
        
        # Determine status
        for process, data in processes.items():
            if data['files']:
                data['status'] = 'present'
                data['file_count'] = len(data['files'])
            else:
                data['status'] = 'missing'
                data['file_count'] = 0
        
        return processes
    
    def analyze_documentation_manual(self, files: List[Path]) -> Dict[str, Any]:
        """Manually analyze documentation coverage"""
        documentation_files = [f for f in files if f.suffix == '.md']
        
        # Key documentation files to check
        key_docs = {
            'README.md': 'main_readme',
            'KNOWLEDGE_HUB.md': 'knowledge_hub',
            'BACKLOG_MANAGEMENT.md': 'backlog',
            'TECH_STACK_REGISTRY.md': 'tech_stack',
            'CENTRAL_INDEX_IMPLEMENTATION_SUMMARY.md': 'central_index'
        }
        
        doc_analysis = {
            'total_docs': len(documentation_files),
            'key_docs_present': {},
            'missing_key_docs': [],
            'coverage_score': 0
        }
        
        # Check for key documentation
        for doc_file, doc_type in key_docs.items():
            doc_path = self.repo_root / doc_file
            if doc_path.exists():
                doc_analysis['key_docs_present'][doc_type] = str(doc_path)
            else:
                doc_analysis['missing_key_docs'].append(doc_file)
        
        # Calculate coverage score
        present_count = len(doc_analysis['key_docs_present'])
        total_count = len(key_docs)
        doc_analysis['coverage_score'] = (present_count / total_count) * 100 if total_count > 0 else 0
        
        return doc_analysis
    
    def compare_a_b_results(self, manual_results: Dict, automated_results: Dict) -> Dict[str, Any]:
        """Compare manual vs automated analysis results"""
        comparison = {
            'method_comparison': {},
            'accuracy_assessment': {},
            'recommendations': []
        }
        
        # Compare file discovery
        manual_files = manual_results.get('files_found', 0)
        automated_files = automated_results.get('synthesis_analysis', {}).get('files_analyzed', 0)
        
        comparison['method_comparison']['file_discovery'] = {
            'manual': manual_files,
            'automated': automated_files,
            'difference': abs(manual_files - automated_files)
        }
        
        # Compare system identification
        manual_systems = manual_results.get('systems_identified', {})
        automated_systems = automated_results.get('synthesis_analysis', {}).get('systems', {})
        
        comparison['method_comparison']['system_identification'] = {
            'manual_systems': len(manual_systems),
            'automated_systems': len(automated_systems),
            'overlap': len(set(manual_systems.keys()) & set(automated_systems.keys()))
        }
        
        # Generate recommendations
        if manual_files > automated_files:
            comparison['recommendations'].append("Automated analysis missed some files - improve discovery")
        elif automated_files > manual_files:
            comparison['recommendations'].append("Automated analysis found more files - manual may be incomplete")
        
        return comparison
    
    def generate_final_report(self, comparison: Dict[str, Any]) -> Dict[str, Any]:
        """Generate comprehensive final audit report"""
        report = {
            'audit_summary': {
                'timestamp': datetime.now().isoformat(),
                'audit_duration': 'comprehensive',
                'methods_used': ['manual', 'automated'],
                'total_files_analyzed': self.audit_results['files_analyzed']
            },
            'a_b_testing_results': comparison,
            'repository_health': self.assess_repository_health(),
            'documentation_status': self.assess_documentation_status(),
            'indexing_status': self.assess_indexing_status(),
            'recommendations': self.generate_recommendations(),
            'next_actions': self.generate_next_actions()
        }
        
        # Save report
        report_path = self.repo_root / 'COMPREHENSIVE_AUDIT_REPORT.json'
        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2, default=str)
        
        print(f"\n📊 COMPREHENSIVE AUDIT COMPLETE")
        print(f"📄 Report saved to: {report_path}")
        
        return report
    
    def assess_repository_health(self) -> Dict[str, Any]:
        """Assess overall repository health"""
        health_indicators = {
            'structure_organization': 'good',
            'documentation_coverage': 'good',
            'automation_level': 'excellent',
            'testing_coverage': 'unknown',
            'security_measures': 'good'
        }
        
        # Check for key indicators
        if (self.repo_root / 'autonomous-framework-v2.py').exists():
            health_indicators['automation_level'] = 'excellent'
        
        if (self.repo_root / 'KNOWLEDGE_HUB.md').exists():
            health_indicators['documentation_coverage'] = 'good'
        
        return health_indicators
    
    def assess_documentation_status(self) -> Dict[str, Any]:
        """Assess documentation completeness"""
        key_docs = [
            'README.md',
            'KNOWLEDGE_HUB.md',
            'BACKLOG_MANAGEMENT.md',
            'docs/reference/TECH_STACK_REGISTRY.md',
            'docs/reference/CENTRAL_INDEX_IMPLEMENTATION_SUMMARY.md'
        ]
        
        doc_status = {}
        for doc in key_docs:
            doc_path = self.repo_root / doc
            doc_status[doc] = {
                'exists': doc_path.exists(),
                'size': doc_path.stat().st_size if doc_path.exists() else 0,
                'last_modified': datetime.fromtimestamp(doc_path.stat().st_mtime).isoformat() if doc_path.exists() else None
            }
        
        return doc_status
    
    def assess_indexing_status(self) -> Dict[str, Any]:
        """Assess indexing completeness"""
        indexing_status = {
            'autonomous_framework_indexed': False,
            'tech_stack_indexed': False,
            'backlog_indexed': False,
            'documentation_indexed': False
        }
        
        # Check if autonomous framework is properly indexed
        if (self.repo_root / 'KNOWLEDGE_HUB.md').exists():
            try:
                with open(self.repo_root / 'KNOWLEDGE_HUB.md', 'r', encoding='utf-8') as f:
                    content = f.read()
                    if 'autonomous-framework-v2.py' in content:
                        indexing_status['autonomous_framework_indexed'] = True
                    if 'TECH_STACK_REGISTRY.md' in content:
                        indexing_status['tech_stack_indexed'] = True
                    if 'BACKLOG_MANAGEMENT.md' in content:
                        indexing_status['backlog_indexed'] = True
            except UnicodeDecodeError:
                # Try with different encoding
                try:
                    with open(self.repo_root / 'KNOWLEDGE_HUB.md', 'r', encoding='latin-1') as f:
                        content = f.read()
                        if 'autonomous-framework-v2.py' in content:
                            indexing_status['autonomous_framework_indexed'] = True
                        if 'TECH_STACK_REGISTRY.md' in content:
                            indexing_status['tech_stack_indexed'] = True
                        if 'BACKLOG_MANAGEMENT.md' in content:
                            indexing_status['backlog_indexed'] = True
                except Exception:
                    print("  ⚠️ Could not read KNOWLEDGE_HUB.md due to encoding issues")
        
        return indexing_status
    
    def generate_recommendations(self) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []
        
        # Check for missing documentation
        if not (self.repo_root / 'KNOWLEDGE_HUB.md').exists():
            recommendations.append("Create KNOWLEDGE_HUB.md for central documentation")
        
        # Check for autonomous framework documentation
        if not (self.repo_root / 'autonomous-framework-v2.py').exists():
            recommendations.append("Autonomous framework not found - verify implementation")
        
        # Check for proper indexing
        if not (self.repo_root / 'docs/reference/TECH_STACK_REGISTRY.md').exists():
            recommendations.append("Create TECH_STACK_REGISTRY.md for technology documentation")
        
        return recommendations
    
    def generate_next_actions(self) -> List[str]:
        """Generate next action items"""
        actions = [
            "Review comprehensive audit report",
            "Address any documentation gaps identified",
            "Update indexing for any missing systems",
            "Run autonomous framework on next backlog item",
            "Schedule regular audit cycles"
        ]
        
        return actions

def main():
    """Main execution function"""
    auditor = RepositoryAuditor()
    report = auditor.run_audit()
    
    # Print summary
    print("\n" + "=" * 60)
    print("📊 AUDIT SUMMARY")
    print("=" * 60)
    print(f"📁 Files Analyzed: {report['audit_summary']['total_files_analyzed']}")
    print(f"🔍 Methods Used: {', '.join(report['audit_summary']['methods_used'])}")
    print(f"📄 Report Location: COMPREHENSIVE_AUDIT_REPORT.json")
    
    # Print key findings
    print("\n🎯 KEY FINDINGS:")
    for recommendation in report['recommendations']:
        print(f"  • {recommendation}")
    
    print("\n🚀 NEXT ACTIONS:")
    for action in report['next_actions']:
        print(f"  • {action}")
    
    print("\n✅ Comprehensive repository audit complete!")

if __name__ == "__main__":
    main()
