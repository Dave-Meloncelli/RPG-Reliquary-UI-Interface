#!/usr/bin/env python3
"""
Autonomous System - Iteration 3
Final synthesis loop: capturing synergies, opportunities, risks, and blockers.
"""

import os
import sys
import subprocess
import platform
import json
import time
from pathlib import Path
from typing import Dict, List, Set
from datetime import datetime

class SynthesisAnalyzer:
    """Analyzes the entire system for synergies, risks, and opportunities"""
    
    def __init__(self):
        self.synergies = []
        self.low_hanging_fruit = []
        self.risks = []
        self.blockers = []
        self.orphans = []
        self.potential_loops = []
        self.opportunities = []
        
    def analyze_system_synergies(self, capabilities: Dict, tools: List, reports: List):
        """Identify synergies between different system components"""
        print("\n🔗 ANALYZING SYSTEM SYNERGIES...")
        
        # Check for capability combinations
        if capabilities.get('can_make_http_requests') and capabilities.get('can_install_packages'):
            self.synergies.append({
                'type': 'capability_combination',
                'description': 'HTTP + Package Installation = Auto-update capability',
                'impact': 'high',
                'implementation': 'Can automatically check for and install package updates'
            })
        
        if capabilities.get('can_monitor_system') and capabilities.get('can_write_files'):
            self.synergies.append({
                'type': 'capability_combination',
                'description': 'System Monitoring + File Writing = Logging system',
                'impact': 'medium',
                'implementation': 'Can create comprehensive system logs and reports'
            })
        
        # Check for tool combinations
        if 'python' in tools and 'pip' in tools:
            self.synergies.append({
                'type': 'tool_combination',
                'description': 'Python + pip = Full package ecosystem',
                'impact': 'high',
                'implementation': 'Can install any Python package and extend functionality'
            })
        
        for synergy in self.synergies:
            print(f"✅ Synergy: {synergy['description']} (Impact: {synergy['impact']})")
        
        return self.synergies
    
    def identify_low_hanging_fruit(self, capabilities: Dict, tools: List):
        """Identify easy wins and quick improvements"""
        print("\n🍎 IDENTIFYING LOW HANGING FRUIT...")
        
        # Easy capability additions
        if capabilities.get('can_write_files') and not capabilities.get('can_read_files'):
            self.low_hanging_fruit.append({
                'type': 'capability_enhancement',
                'description': 'Fix file reading capability',
                'effort': 'low',
                'impact': 'medium',
                'implementation': 'Simple file read test and error handling'
            })
        
        # Easy tool additions
        if 'python' in tools and 'pip' not in tools:
            self.low_hanging_fruit.append({
                'type': 'tool_addition',
                'description': 'Install pip for package management',
                'effort': 'low',
                'impact': 'high',
                'implementation': 'Use get-pip.py or package manager'
            })
        
        # Easy automation opportunities
        if capabilities.get('can_install_packages'):
            self.low_hanging_fruit.append({
                'type': 'automation_opportunity',
                'description': 'Auto-install common development packages',
                'effort': 'low',
                'impact': 'high',
                'implementation': 'Install requests, psutil, pytest, etc.'
            })
        
        for fruit in self.low_hanging_fruit:
            print(f"🍎 Low Hanging Fruit: {fruit['description']} (Effort: {fruit['effort']}, Impact: {fruit['impact']})")
        
        return self.low_hanging_fruit
    
    def assess_risks_and_blockers(self, capabilities: Dict, tools: List):
        """Identify potential risks and blockers"""
        print("\n⚠️ ASSESSING RISKS AND BLOCKERS...")
        
        # Permission risks
        if not capabilities.get('can_write_files'):
            self.risks.append({
                'type': 'permission_risk',
                'description': 'Cannot write files - system limited',
                'severity': 'high',
                'mitigation': 'Check permissions, run as administrator if needed'
            })
        
        # Network risks
        if not capabilities.get('can_access_network'):
            self.risks.append({
                'type': 'network_risk',
                'description': 'No network access - cannot download packages',
                'severity': 'medium',
                'mitigation': 'Use offline package cache or manual installation'
            })
        
        # Dependency blockers
        if 'pip' not in tools:
            self.blockers.append({
                'type': 'dependency_blocker',
                'description': 'No pip - cannot install Python packages',
                'severity': 'high',
                'solution': 'Install pip or use alternative package manager'
            })
        
        # Environment blockers
        if platform.system() == 'Windows' and not capabilities.get('can_run_python'):
            self.blockers.append({
                'type': 'environment_blocker',
                'description': 'Python not working on Windows',
                'severity': 'critical',
                'solution': 'Reinstall Python or check PATH configuration'
            })
        
        for risk in self.risks:
            print(f"⚠️ Risk: {risk['description']} (Severity: {risk['severity']})")
        
        for blocker in self.blockers:
            print(f"🚫 Blocker: {blocker['description']} (Severity: {blocker['severity']})")
        
        return self.risks, self.blockers
    
    def find_orphans_and_unused_capabilities(self, capabilities: Dict, tools: List):
        """Find orphaned or unused components"""
        print("\n👻 FINDING ORPHANS AND UNUSED CAPABILITIES...")
        
        # Check for unused capabilities
        unused_capabilities = []
        for capability, status in capabilities.items():
            if status and capability not in ['can_run_python', 'can_write_files', 'can_install_packages']:
                # Check if this capability is actually being used
                if not self._is_capability_utilized(capability):
                    unused_capabilities.append(capability)
        
        for capability in unused_capabilities:
            self.orphans.append({
                'type': 'unused_capability',
                'description': f'Capability "{capability}" is available but not utilized',
                'recommendation': f'Implement functionality that uses {capability}',
                'priority': 'low'
            })
        
        # Check for orphaned tools
        orphaned_tools = []
        for tool in tools:
            if tool not in ['python', 'pip'] and not self._is_tool_utilized(tool):
                orphaned_tools.append(tool)
        
        for tool in orphaned_tools:
            self.orphans.append({
                'type': 'orphaned_tool',
                'description': f'Tool "{tool}" is available but not utilized',
                'recommendation': f'Integrate {tool} into workflows or remove if unnecessary',
                'priority': 'medium'
            })
        
        for orphan in self.orphans:
            print(f"👻 Orphan: {orphan['description']} (Priority: {orphan['priority']})")
        
        return self.orphans
    
    def detect_potential_endless_loops(self, capabilities: Dict, tools: List):
        """Detect potential endless loops and circular dependencies"""
        print("\n🔄 DETECTING POTENTIAL ENDLESS LOOPS...")
        
        # Check for circular dependency patterns
        if capabilities.get('can_install_packages') and 'pip' in tools:
            self.potential_loops.append({
                'type': 'circular_dependency',
                'description': 'pip installs packages, but pip itself is a package',
                'risk': 'medium',
                'mitigation': 'Ensure pip is installed via alternative method (get-pip.py)'
            })
        
        # Check for self-referential operations
        if capabilities.get('can_write_files'):
            self.potential_loops.append({
                'type': 'self_reference',
                'description': 'System can modify its own files',
                'risk': 'low',
                'mitigation': 'Use version control and backup before self-modification'
            })
        
        # Check for delegation loops
        if capabilities.get('can_delegate_failures'):
            self.potential_loops.append({
                'type': 'delegation_loop',
                'description': 'Delegation system could create infinite fallback loops',
                'risk': 'medium',
                'mitigation': 'Implement maximum delegation depth and circuit breaker'
            })
        
        for loop in self.potential_loops:
            print(f"🔄 Potential Loop: {loop['description']} (Risk: {loop['risk']})")
        
        return self.potential_loops
    
    def identify_opportunities(self, capabilities: Dict, tools: List, reports: List):
        """Identify growth and improvement opportunities"""
        print("\n🚀 IDENTIFYING OPPORTUNITIES...")
        
        # Performance opportunities
        if capabilities.get('can_monitor_system'):
            self.opportunities.append({
                'type': 'performance_optimization',
                'description': 'Implement performance monitoring and optimization',
                'impact': 'high',
                'effort': 'medium',
                'implementation': 'Monitor CPU, memory, disk usage and optimize accordingly'
            })
        
        # Automation opportunities
        if capabilities.get('can_install_packages') and capabilities.get('can_make_http_requests'):
            self.opportunities.append({
                'type': 'automation_enhancement',
                'description': 'Implement automatic dependency management',
                'impact': 'high',
                'effort': 'medium',
                'implementation': 'Auto-check for updates and install missing dependencies'
            })
        
        # Integration opportunities
        if 'python' in tools and capabilities.get('can_write_files'):
            self.opportunities.append({
                'type': 'integration_opportunity',
                'description': 'Integrate with external tools and APIs',
                'impact': 'high',
                'effort': 'high',
                'implementation': 'Connect to package repositories, monitoring services, etc.'
            })
        
        # Learning opportunities
        if len(reports) > 1:
            self.opportunities.append({
                'type': 'learning_enhancement',
                'description': 'Implement machine learning for approach selection',
                'impact': 'high',
                'effort': 'high',
                'implementation': 'Use historical data to predict best approaches'
            })
        
        for opportunity in self.opportunities:
            print(f"🚀 Opportunity: {opportunity['description']} (Impact: {opportunity['impact']}, Effort: {opportunity['effort']})")
        
        return self.opportunities
    
    def _is_capability_utilized(self, capability: str) -> bool:
        """Check if a capability is being utilized"""
        # This would check if the capability is actually used in workflows
        # For now, we'll assume basic capabilities are utilized
        return capability in ['can_run_python', 'can_write_files', 'can_install_packages']
    
    def _is_tool_utilized(self, tool: str) -> bool:
        """Check if a tool is being utilized"""
        # This would check if the tool is actually used in workflows
        # For now, we'll assume basic tools are utilized
        return tool in ['python', 'pip']
    
    def generate_synthesis_report(self) -> Dict:
        """Generate comprehensive synthesis report"""
        return {
            'synergies': self.synergies,
            'low_hanging_fruit': self.low_hanging_fruit,
            'risks': self.risks,
            'blockers': self.blockers,
            'orphans': self.orphans,
            'potential_loops': self.potential_loops,
            'opportunities': self.opportunities,
            'summary': {
                'total_synergies': len(self.synergies),
                'total_opportunities': len(self.low_hanging_fruit) + len(self.opportunities),
                'total_risks': len(self.risks),
                'total_blockers': len(self.blockers),
                'total_orphans': len(self.orphans),
                'total_loops': len(self.potential_loops)
            }
        }

def load_previous_iterations():
    """Load data from previous iterations"""
    print("📂 Loading previous iteration data...")
    
    data = {
        'capabilities': {},
        'tools': [],
        'reports': []
    }
    
    # Load Iteration 1 report
    try:
        with open('autonomous_iteration_1_report.json', 'r') as f:
            iter1_data = json.load(f)
            data['capabilities'].update(iter1_data.get('capabilities', {}))
            tools_data = iter1_data.get('tool_check', {})
            if tools_data and isinstance(tools_data, dict):
                available_tools = tools_data.get('available', [])
                if isinstance(available_tools, list):
                    data['tools'].extend(available_tools)
            data['reports'].append(iter1_data)
    except FileNotFoundError:
        print("⚠️ Iteration 1 report not found")
    except Exception as e:
        print(f"⚠️ Error loading iteration 1: {e}")
    
    # Load Iteration 2 report
    try:
        with open('autonomous_iteration_2_report.json', 'r') as f:
            iter2_data = json.load(f)
            data['capabilities'].update(iter2_data.get('capabilities', {}))
            data['reports'].append(iter2_data)
    except FileNotFoundError:
        print("⚠️ Iteration 2 report not found")
    except Exception as e:
        print(f"⚠️ Error loading iteration 2: {e}")
    
    # Ensure we have safe defaults
    if not isinstance(data['capabilities'], dict):
        data['capabilities'] = {}
    if not isinstance(data['tools'], list):
        data['tools'] = []
    if not isinstance(data['reports'], list):
        data['reports'] = []
    
    print(f"📊 Loaded: {len(data['capabilities'])} capabilities, {len(data['tools'])} tools, {len(data['reports'])} reports")
    return data

def run_final_synthesis(context=None):
    """Run the final synthesis analysis with robust error handling"""
    print("🤖 AUTONOMOUS SYSTEM - ITERATION 3")
    print("Final Synthesis: Synergies, Opportunities, Risks, and Blockers")
    print("=" * 70)
    
    try:
        # Load previous iteration data
        previous_data = load_previous_iterations()
        
        # Initialize synthesis analyzer
        analyzer = SynthesisAnalyzer()
        
        # Run all analyses with null safety
        capabilities = previous_data.get('capabilities', {}) or {}
        tools = previous_data.get('tools', []) or []
        reports = previous_data.get('reports', []) or []
        
        # Ensure all variables are properly initialized
        if not isinstance(capabilities, dict):
            capabilities = {}
        if not isinstance(tools, list):
            tools = []
        if not isinstance(reports, list):
            reports = []
        
        # Run all analyses and store results with error handling
        try:
            analyzer.synergies = analyzer.analyze_system_synergies(capabilities, tools, reports) or []
        except Exception as e:
            print(f"⚠️ Synergy analysis error: {e}")
            analyzer.synergies = []
        
        try:
            analyzer.low_hanging_fruit = analyzer.identify_low_hanging_fruit(capabilities, tools) or []
        except Exception as e:
            print(f"⚠️ Low hanging fruit analysis error: {e}")
            analyzer.low_hanging_fruit = []
        
        try:
            risks, blockers = analyzer.assess_risks_and_blockers(capabilities, tools)
            analyzer.risks = risks or []
            analyzer.blockers = blockers or []
        except Exception as e:
            print(f"⚠️ Risk analysis error: {e}")
            analyzer.risks = []
            analyzer.blockers = []
        
        try:
            analyzer.orphans = analyzer.find_orphans_and_unused_capabilities(capabilities, tools) or []
        except Exception as e:
            print(f"⚠️ Orphan analysis error: {e}")
            analyzer.orphans = []
        
        try:
            analyzer.potential_loops = analyzer.detect_potential_endless_loops(capabilities, tools) or []
        except Exception as e:
            print(f"⚠️ Loop analysis error: {e}")
            analyzer.potential_loops = []
        
        try:
            analyzer.opportunities = analyzer.identify_opportunities(capabilities, tools, reports) or []
        except Exception as e:
            print(f"⚠️ Opportunity analysis error: {e}")
            analyzer.opportunities = []
        
        # Generate synthesis report
        synthesis_report = analyzer.generate_synthesis_report()
        
        # Save synthesis report
        try:
            with open('autonomous_synthesis_report.json', 'w') as f:
                json.dump(synthesis_report, f, indent=2)
            print(f"\n📄 Synthesis report saved: autonomous_synthesis_report.json")
        except Exception as e:
            print(f"❌ Could not save synthesis report: {e}")
        
        # Summary
        print("\n" + "=" * 70)
        print("📊 SYNTHESIS ANALYSIS COMPLETE")
        print(f"🔗 Synergies found: {synthesis_report['summary']['total_synergies']}")
        print(f"🍎 Low hanging fruit: {len(analyzer.low_hanging_fruit)}")
        print(f"🚀 Opportunities: {len(analyzer.opportunities)}")
        print(f"⚠️ Risks identified: {synthesis_report['summary']['total_risks']}")
        print(f"🚫 Blockers found: {synthesis_report['summary']['total_blockers']}")
        print(f"👻 Orphans detected: {synthesis_report['summary']['total_orphans']}")
        print(f"🔄 Potential loops: {synthesis_report['summary']['total_loops']}")
        print("=" * 70)
        
        # Priority recommendations with safe iteration
        print("\n🎯 PRIORITY RECOMMENDATIONS:")
        
        # High impact, low effort
        try:
            high_impact_low_effort = [item for item in (analyzer.low_hanging_fruit or []) 
                                    if isinstance(item, dict) and item.get('impact') == 'high' and item.get('effort') == 'low']
            if high_impact_low_effort:
                print("🔥 HIGH IMPACT, LOW EFFORT:")
                for item in high_impact_low_effort:
                    print(f"   • {item.get('description', 'Unknown')}")
        except Exception as e:
            print(f"⚠️ Error processing low hanging fruit: {e}")
        
        # Critical blockers
        try:
            critical_blockers = [blocker for blocker in (analyzer.blockers or []) 
                               if isinstance(blocker, dict) and blocker.get('severity') == 'critical']
            if critical_blockers:
                print("🚨 CRITICAL BLOCKERS TO RESOLVE:")
                for blocker in critical_blockers:
                    print(f"   • {blocker.get('description', 'Unknown')} - {blocker.get('solution', 'No solution')}")
        except Exception as e:
            print(f"⚠️ Error processing blockers: {e}")
        
        # High-risk items
        try:
            high_risks = [risk for risk in (analyzer.risks or []) 
                         if isinstance(risk, dict) and risk.get('severity') == 'high']
            if high_risks:
                print("⚠️ HIGH RISKS TO MITIGATE:")
                for risk in high_risks:
                    print(f"   • {risk.get('description', 'Unknown')} - {risk.get('mitigation', 'No mitigation')}")
        except Exception as e:
            print(f"⚠️ Error processing risks: {e}")
        
        print("\n🎯 The autonomous system is now fully analyzed and ready for optimization!")
        
        # Return success result for framework
        return {
            'synthesis_complete': True,
            'synergies_found': len(analyzer.synergies) > 0,
            'risks_identified': len(analyzer.risks) > 0 or len(analyzer.blockers) > 0,
            'opportunities_found': len(analyzer.opportunities) > 0,
            'analysis_successful': True,
            'timestamp': datetime.now().isoformat()
        }
        
    except Exception as e:
        print(f"❌ Critical synthesis analysis error: {e}")
        import traceback
        traceback.print_exc()
        
        # Return failure result for framework
        return {
            'synthesis_complete': False,
            'analysis_successful': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }

if __name__ == "__main__":
    run_final_synthesis()
