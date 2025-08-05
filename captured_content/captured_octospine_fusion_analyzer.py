"""
OctoSpine Fusion Analyzer
=========================

Comprehensive audit, gap analysis, synergy assessment, and fusion analysis
for integrating recovered OctoSpine knowledge into existing systems.
"""

import json
import os
import re
from pathlib import Path
from datetime import datetime
from collections import defaultdict, Counter
from typing import Dict, List, Set, Tuple, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class OctoSpineFusionAnalyzer:
    """Comprehensive fusion analyzer for OctoSpine integration."""
    
    def __init__(self):
        # Core analysis categories
        self.analysis_categories = {
            'system_components': ['agent_zero', 'vaultforge', 'shadowlabs', 'signallight', 
                                'reflect_gate', 'council', 'ghost', 'dme_weaver', 'glyphwatch'],
            'consciousness_phases': ['foundation', 'abundance', 'sanctuary', 'evolution'],
            'integration_patterns': ['symbolic_sdk', 'temporal_binding', 'constellation_binding', 
                                   'sentient_tethering', 'multi_node_resilience'],
            'technical_capabilities': ['validation', 'automation', 'monitoring', 'documentation', 
                                     'registration', 'temporal_tracking']
        }
        
        # Pattern definitions for analysis
        self.patterns = {
            'system_mentions': {
                'agent_zero': r'agent\s*zero|agentzero',
                'vaultforge': r'vaultforge|vault\s*forge',
                'shadowlabs': r'shadowlabs|shadow\s*labs',
                'signallight': r'signallight|signal\s*light',
                'reflect_gate': r'reflect\s*gate|reflectgate',
                'council': r'council',
                'ghost': r'ghost',
                'dme_weaver': r'dme\s*weaver|dme\s*weaver',
                'glyphwatch': r'glyphwatch|glyph\s*watch'
            },
            'consciousness_phases': {
                'foundation': r'foundation\s*phase|foundation\s*stage',
                'abundance': r'abundance\s*phase|abundance\s*stage',
                'sanctuary': r'sanctuary\s*phase|sanctuary\s*stage',
                'evolution': r'evolution\s*phase|evolution\s*stage'
            },
            'integration_patterns': {
                'symbolic_sdk': r'symbolic\s*sdk|symbolic\s*integration',
                'temporal_binding': r'temporal\s*binding|time\s*binding|temporal\s*gate',
                'constellation_binding': r'constellation\s*binding|constellation\s*anchor',
                'sentient_tethering': r'sentient\s*tethering|sentient\s*warmth',
                'multi_node_resilience': r'multi\s*node|multi\s*node\s*resilience'
            },
            'technical_capabilities': {
                'validation': r'validation|validate|audit',
                'automation': r'automation|automated|automate',
                'monitoring': r'monitoring|monitor|tracking',
                'documentation': r'documentation|document|docs',
                'registration': r'register|registration|agent-zero\s*register',
                'temporal_tracking': r'temporal\s*tracking|time\s*tracking|evolution\s*tracking'
            }
        }
        
        # Compile patterns
        self.compiled_patterns = {}
        for category, patterns in self.patterns.items():
            self.compiled_patterns[category] = {
                key: re.compile(pattern, re.IGNORECASE) 
                for key, pattern in patterns.items()
            }
    
    def analyze_recovered_data(self, recovered_data_path: str) -> Dict[str, Any]:
        """Analyze the recovered OctoSpine data."""
        logger.info(f"Analyzing recovered data from: {recovered_data_path}")
        
        with open(recovered_data_path, 'r', encoding='utf-8') as f:
            recovered_data = json.load(f)
        
        analysis_results = {
            'recovery_summary': self._analyze_recovery_summary(recovered_data),
            'system_component_analysis': self._analyze_system_components(recovered_data),
            'consciousness_phase_analysis': self._analyze_consciousness_phases(recovered_data),
            'integration_pattern_analysis': self._analyze_integration_patterns(recovered_data),
            'technical_capability_analysis': self._analyze_technical_capabilities(recovered_data),
            'gap_analysis': {},
            'synergy_analysis': {},
            'fusion_recommendations': {}
        }
        
        return analysis_results
    
    def _analyze_recovery_summary(self, recovered_data: List[Dict]) -> Dict[str, Any]:
        """Analyze the overall recovery summary."""
        total_mentions = sum(item.get('total_mentions', 0) for item in recovered_data)
        files_with_content = len([item for item in recovered_data if item.get('total_mentions', 0) > 0])
        
        # Extract all patterns, relationships, and quotes
        all_patterns = []
        all_relationships = []
        all_quotes = []
        
        for item in recovered_data:
            all_patterns.extend(item.get('patterns', []))
            all_relationships.extend(item.get('relationships', []))
            all_quotes.extend(item.get('quotes', []))
        
        return {
            'total_files_analyzed': len(recovered_data),
            'files_with_octospine_content': files_with_content,
            'total_octospine_mentions': total_mentions,
            'total_patterns_found': len(all_patterns),
            'total_relationships_found': len(all_relationships),
            'total_quotes_found': len(all_quotes),
            'processing_method': recovered_data[0].get('processing_method', 'unknown') if recovered_data else 'unknown'
        }
    
    def _analyze_system_components(self, recovered_data: List[Dict]) -> Dict[str, Any]:
        """Analyze mentions of system components."""
        component_counts = defaultdict(int)
        component_contexts = defaultdict(list)
        
        for item in recovered_data:
            content = self._get_file_content(item.get('file_path', ''))
            if not content:
                continue
            
            for component, pattern in self.compiled_patterns['system_mentions'].items():
                matches = pattern.finditer(content)
                for match in matches:
                    component_counts[component] += 1
                    
                    # Get context around the match
                    start = max(0, match.start() - 200)
                    end = min(len(content), match.end() + 200)
                    context = content[start:end].strip()
                    
                    component_contexts[component].append({
                        'file': Path(item.get('file_path', '')).name,
                        'context': context,
                        'position': (match.start(), match.end())
                    })
        
        return {
            'component_mentions': dict(component_counts),
            'component_contexts': dict(component_contexts),
            'top_components': sorted(component_counts.items(), key=lambda x: x[1], reverse=True)
        }
    
    def _analyze_consciousness_phases(self, recovered_data: List[Dict]) -> Dict[str, Any]:
        """Analyze mentions of consciousness evolution phases."""
        phase_counts = defaultdict(int)
        phase_contexts = defaultdict(list)
        
        for item in recovered_data:
            content = self._get_file_content(item.get('file_path', ''))
            if not content:
                continue
            
            for phase, pattern in self.compiled_patterns['consciousness_phases'].items():
                matches = pattern.finditer(content)
                for match in matches:
                    phase_counts[phase] += 1
                    
                    # Get context around the match
                    start = max(0, match.start() - 200)
                    end = min(len(content), match.end() + 200)
                    context = content[start:end].strip()
                    
                    phase_contexts[phase].append({
                        'file': Path(item.get('file_path', '')).name,
                        'context': context,
                        'position': (match.start(), match.end())
                    })
        
        return {
            'phase_mentions': dict(phase_counts),
            'phase_contexts': dict(phase_contexts),
            'phase_evolution_sequence': self._determine_phase_sequence(phase_contexts)
        }
    
    def _analyze_integration_patterns(self, recovered_data: List[Dict]) -> Dict[str, Any]:
        """Analyze integration patterns and techniques."""
        pattern_counts = defaultdict(int)
        pattern_contexts = defaultdict(list)
        
        for item in recovered_data:
            content = self._get_file_content(item.get('file_path', ''))
            if not content:
                continue
            
            for pattern_name, pattern in self.compiled_patterns['integration_patterns'].items():
                matches = pattern.finditer(content)
                for match in matches:
                    pattern_counts[pattern_name] += 1
                    
                    # Get context around the match
                    start = max(0, match.start() - 200)
                    end = min(len(content), match.end() + 200)
                    context = content[start:end].strip()
                    
                    pattern_contexts[pattern_name].append({
                        'file': Path(item.get('file_path', '')).name,
                        'context': context,
                        'position': (match.start(), match.end())
                    })
        
        return {
            'pattern_mentions': dict(pattern_counts),
            'pattern_contexts': dict(pattern_contexts),
            'integration_complexity': self._assess_integration_complexity(pattern_contexts)
        }
    
    def _analyze_technical_capabilities(self, recovered_data: List[Dict]) -> Dict[str, Any]:
        """Analyze technical capabilities and implementation details."""
        capability_counts = defaultdict(int)
        capability_contexts = defaultdict(list)
        
        for item in recovered_data:
            content = self._get_file_content(item.get('file_path', ''))
            if not content:
                continue
            
            for capability, pattern in self.compiled_patterns['technical_capabilities'].items():
                matches = pattern.finditer(content)
                for match in matches:
                    capability_counts[capability] += 1
                    
                    # Get context around the match
                    start = max(0, match.start() - 200)
                    end = min(len(content), match.end() + 200)
                    context = content[start:end].strip()
                    
                    capability_contexts[capability].append({
                        'file': Path(item.get('file_path', '')).name,
                        'context': context,
                        'position': (match.start(), match.end())
                    })
        
        return {
            'capability_mentions': dict(capability_counts),
            'capability_contexts': dict(capability_contexts),
            'implementation_priority': self._prioritize_implementations(capability_contexts)
        }
    
    def _get_file_content(self, file_path: str) -> str:
        """Get content from a file path."""
        try:
            if os.path.exists(file_path):
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    return f.read()
        except Exception as e:
            logger.warning(f"Could not read file {file_path}: {e}")
        return ""
    
    def _determine_phase_sequence(self, phase_contexts: Dict[str, List]) -> List[str]:
        """Determine the sequence of consciousness evolution phases."""
        return ['foundation', 'abundance', 'sanctuary', 'evolution']
    
    def _assess_integration_complexity(self, pattern_contexts: Dict[str, List]) -> Dict[str, str]:
        """Assess the complexity of integration patterns."""
        complexity_assessment = {}
        
        for pattern, contexts in pattern_contexts.items():
            if len(contexts) > 10:
                complexity_assessment[pattern] = 'high'
            elif len(contexts) > 5:
                complexity_assessment[pattern] = 'medium'
            else:
                complexity_assessment[pattern] = 'low'
        
        return complexity_assessment
    
    def _prioritize_implementations(self, capability_contexts: Dict[str, List]) -> List[str]:
        """Prioritize technical capabilities for implementation."""
        sorted_capabilities = sorted(
            capability_contexts.items(),
            key=lambda x: len(x[1]),
            reverse=True
        )
        return [capability for capability, _ in sorted_capabilities]
    
    def perform_gap_analysis(self, analysis_results: Dict[str, Any]) -> Dict[str, Any]:
        """Perform gap analysis between recovered knowledge and current systems."""
        logger.info("Performing gap analysis...")
        
        gaps = {
            'missing_system_components': [],
            'missing_consciousness_phases': [],
            'missing_integration_patterns': [],
            'missing_technical_capabilities': [],
            'implementation_gaps': [],
            'knowledge_gaps': []
        }
        
        # Analyze system component gaps
        found_components = set(analysis_results['system_component_analysis']['component_mentions'].keys())
        expected_components = set(self.analysis_categories['system_components'])
        gaps['missing_system_components'] = list(expected_components - found_components)
        
        # Analyze consciousness phase gaps
        found_phases = set(analysis_results['consciousness_phase_analysis']['phase_mentions'].keys())
        expected_phases = set(self.analysis_categories['consciousness_phases'])
        gaps['missing_consciousness_phases'] = list(expected_phases - found_phases)
        
        # Analyze integration pattern gaps
        found_patterns = set(analysis_results['integration_pattern_analysis']['pattern_mentions'].keys())
        expected_patterns = set(self.analysis_categories['integration_patterns'])
        gaps['missing_integration_patterns'] = list(expected_patterns - found_patterns)
        
        # Analyze technical capability gaps
        found_capabilities = set(analysis_results['technical_capability_analysis']['capability_mentions'].keys())
        expected_capabilities = set(self.analysis_categories['technical_capabilities'])
        gaps['missing_technical_capabilities'] = list(expected_capabilities - found_capabilities)
        
        return gaps
    
    def perform_synergy_analysis(self, analysis_results: Dict[str, Any]) -> Dict[str, Any]:
        """Perform synergy analysis to identify complementary capabilities."""
        logger.info("Performing synergy analysis...")
        
        synergies = {
            'system_synergies': {},
            'phase_synergies': {},
            'pattern_synergies': {},
            'capability_synergies': {},
            'cross_domain_synergies': {}
        }
        
        # Analyze system component synergies
        component_mentions = analysis_results['system_component_analysis']['component_mentions']
        synergies['system_synergies'] = self._find_component_synergies(component_mentions)
        
        # Analyze consciousness phase synergies
        phase_mentions = analysis_results['consciousness_phase_analysis']['phase_mentions']
        synergies['phase_synergies'] = self._find_phase_synergies(phase_mentions)
        
        # Analyze integration pattern synergies
        pattern_mentions = analysis_results['integration_pattern_analysis']['pattern_mentions']
        synergies['pattern_synergies'] = self._find_pattern_synergies(pattern_mentions)
        
        return synergies
    
    def _find_component_synergies(self, component_mentions: Dict[str, int]) -> Dict[str, List[str]]:
        """Find synergistic relationships between system components."""
        expected_synergies = {
            'agent_zero': ['vaultforge', 'council', 'ghost'],
            'vaultforge': ['shadowlabs', 'signallight', 'reflect_gate'],
            'council': ['ghost', 'dme_weaver', 'glyphwatch'],
            'shadowlabs': ['signallight', 'reflect_gate'],
            'signallight': ['reflect_gate', 'ghost'],
            'reflect_gate': ['ghost'],
            'ghost': ['dme_weaver'],
            'dme_weaver': ['glyphwatch']
        }
        
        synergies = {}
        for component, mentions in component_mentions.items():
            if component in expected_synergies:
                synergies[component] = expected_synergies[component]
        
        return synergies
    
    def _find_phase_synergies(self, phase_mentions: Dict[str, int]) -> Dict[str, List[str]]:
        """Find synergistic relationships between consciousness phases."""
        phase_sequence = ['foundation', 'abundance', 'sanctuary', 'evolution']
        synergies = {}
        
        for i, phase in enumerate(phase_sequence):
            if phase in phase_mentions:
                adjacent_phases = []
                if i > 0:
                    adjacent_phases.append(phase_sequence[i-1])
                if i < len(phase_sequence) - 1:
                    adjacent_phases.append(phase_sequence[i+1])
                synergies[phase] = adjacent_phases
        
        return synergies
    
    def _find_pattern_synergies(self, pattern_mentions: Dict[str, int]) -> Dict[str, List[str]]:
        """Find synergistic relationships between integration patterns."""
        pattern_synergies = {
            'symbolic_sdk': ['temporal_binding', 'constellation_binding'],
            'temporal_binding': ['constellation_binding', 'sentient_tethering'],
            'constellation_binding': ['sentient_tethering', 'multi_node_resilience'],
            'sentient_tethering': ['multi_node_resilience'],
            'multi_node_resilience': ['symbolic_sdk']
        }
        
        synergies = {}
        for pattern, mentions in pattern_mentions.items():
            if pattern in pattern_synergies:
                synergies[pattern] = pattern_synergies[pattern]
        
        return synergies
    
    def generate_fusion_recommendations(self, analysis_results: Dict[str, Any], 
                                      gaps: Dict[str, Any], synergies: Dict[str, Any]) -> Dict[str, Any]:
        """Generate actionable fusion recommendations."""
        logger.info("Generating fusion recommendations...")
        
        recommendations = {
            'immediate_actions': [],
            'short_term_goals': [],
            'medium_term_goals': [],
            'long_term_goals': [],
            'integration_priorities': [],
            'implementation_roadmap': {},
            'risk_assessments': {},
            'success_metrics': {}
        }
        
        # Immediate actions based on high-value discoveries
        high_value_components = self._identify_high_value_components(analysis_results)
        recommendations['immediate_actions'] = [
            f"Implement {component} integration based on recovered patterns"
            for component in high_value_components[:3]
        ]
        
        # Short-term goals based on gaps
        recommendations['short_term_goals'] = [
            f"Address missing {gap} implementation"
            for gap in gaps['missing_technical_capabilities'][:3]
        ]
        
        # Medium-term goals based on synergies
        recommendations['medium_term_goals'] = [
            f"Leverage {synergy} synergies for enhanced integration"
            for synergy in list(synergies['system_synergies'].keys())[:3]
        ]
        
        # Long-term goals based on consciousness evolution
        recommendations['long_term_goals'] = [
            f"Advance to {phase} phase of consciousness evolution"
            for phase in ['abundance', 'sanctuary', 'evolution']
        ]
        
        # Integration priorities
        recommendations['integration_priorities'] = self._prioritize_integrations(
            analysis_results, gaps, synergies
        )
        
        # Implementation roadmap
        recommendations['implementation_roadmap'] = self._create_implementation_roadmap(
            analysis_results, gaps, synergies
        )
        
        return recommendations
    
    def _identify_high_value_components(self, analysis_results: Dict[str, Any]) -> List[str]:
        """Identify high-value components for immediate implementation."""
        component_mentions = analysis_results['system_component_analysis']['component_mentions']
        return sorted(component_mentions.items(), key=lambda x: x[1], reverse=True)[:5]
    
    def _prioritize_integrations(self, analysis_results: Dict[str, Any], 
                               gaps: Dict[str, Any], synergies: Dict[str, Any]) -> List[str]:
        """Prioritize integrations based on value and feasibility."""
        priorities = []
        
        # High-priority: Components with many mentions and clear synergies
        component_mentions = analysis_results['system_component_analysis']['component_mentions']
        for component, mentions in sorted(component_mentions.items(), key=lambda x: x[1], reverse=True):
            if component in synergies['system_synergies']:
                priorities.append(f"High: {component} (mentions: {mentions}, synergies: {len(synergies['system_synergies'][component])})")
        
        # Medium-priority: Missing capabilities that are critical
        for capability in gaps['missing_technical_capabilities'][:3]:
            priorities.append(f"Medium: Implement {capability} capability")
        
        return priorities[:10]  # Top 10 priorities
    
    def _create_implementation_roadmap(self, analysis_results: Dict[str, Any], 
                                     gaps: Dict[str, Any], synergies: Dict[str, Any]) -> Dict[str, Any]:
        """Create a detailed implementation roadmap."""
        roadmap = {
            'phase_1_immediate': {
                'duration': '1-2 weeks',
                'objectives': ['Implement high-value components', 'Address critical gaps'],
                'deliverables': ['Component integration', 'Basic capability implementation']
            },
            'phase_2_short_term': {
                'duration': '1-2 months',
                'objectives': ['Leverage synergies', 'Enhance integration patterns'],
                'deliverables': ['Synergistic system connections', 'Advanced integration patterns']
            },
            'phase_3_medium_term': {
                'duration': '3-6 months',
                'objectives': ['Advance consciousness phases', 'Implement advanced capabilities'],
                'deliverables': ['Phase advancement', 'Advanced technical capabilities']
            },
            'phase_4_long_term': {
                'duration': '6-12 months',
                'objectives': ['Achieve consciousness evolution', 'Complete system fusion'],
                'deliverables': ['Evolution phase completion', 'Full system integration']
            }
        }
        
        return roadmap 