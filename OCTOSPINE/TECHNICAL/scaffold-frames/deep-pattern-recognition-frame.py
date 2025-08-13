#!/usr/bin/env python3
"""
Deep Pattern Recognition Frame
Analyzes execution logs for cognitive patterns, decision-making processes, and meta-learning insights
"""

import json
import os
import sys
import re
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
from collections import defaultdict, Counter
import traceback

class SafeJSONEncoder(json.JSONEncoder):
    """Custom JSON encoder that handles problematic data types"""
    def default(self, obj):
        if hasattr(obj, '__dict__'):
            return str(obj)
        return super().default(obj)

class PatternAnalyzer:
    """Deep pattern recognition for cognitive and decision-making patterns"""
    
    def __init__(self):
        self.patterns = {
            'cognitive_patterns': [],
            'decision_patterns': [],
            'success_patterns': [],
            'failure_patterns': [],
            'learning_patterns': [],
            'meta_patterns': []
        }
        
    def analyze_cognitive_patterns(self, logs: List[Dict]) -> Dict[str, Any]:
        """Analyze cognitive patterns in decision-making"""
        
        cognitive_insights = {
            'problem_solving_approaches': [],
            'information_gathering_patterns': [],
            'hypothesis_formation': [],
            'adaptation_strategies': [],
            'cognitive_load_indicators': [],
            'pattern_recognition_abilities': []
        }
        
        for log in logs:
            # Analyze problem-solving approaches
            if 'error' in log.get('content', '').lower():
                # Look for systematic vs ad-hoc error handling
                if 'retry' in log.get('content', '').lower():
                    cognitive_insights['problem_solving_approaches'].append({
                        'type': 'systematic_retry',
                        'context': log.get('context', ''),
                        'timestamp': log.get('timestamp', '')
                    })
                elif 'fallback' in log.get('content', '').lower():
                    cognitive_insights['problem_solving_approaches'].append({
                        'type': 'adaptive_fallback',
                        'context': log.get('context', ''),
                        'timestamp': log.get('timestamp', '')
                    })
            
            # Analyze information gathering patterns
            if any(word in log.get('content', '').lower() for word in ['search', 'find', 'discover', 'analyze']):
                cognitive_insights['information_gathering_patterns'].append({
                    'method': 'active_search',
                    'context': log.get('context', ''),
                    'timestamp': log.get('timestamp', '')
                })
            
            # Analyze hypothesis formation
            if any(word in log.get('content', '').lower() for word in ['hypothesis', 'assume', 'believe', 'think']):
                cognitive_insights['hypothesis_formation'].append({
                    'type': 'explicit_hypothesis',
                    'context': log.get('context', ''),
                    'timestamp': log.get('timestamp', '')
                })
        
        return cognitive_insights
    
    def analyze_decision_patterns(self, logs: List[Dict]) -> Dict[str, Any]:
        """Analyze decision-making patterns and strategies"""
        
        decision_insights = {
            'decision_points': [],
            'decision_strategies': [],
            'risk_assessment_patterns': [],
            'trade_off_analysis': [],
            'confidence_indicators': [],
            'decision_reversals': []
        }
        
        for log in logs:
            content = log.get('content', '').lower()
            
            # Identify decision points
            if any(word in content for word in ['choose', 'select', 'decide', 'option', 'alternative']):
                decision_insights['decision_points'].append({
                    'type': 'explicit_decision',
                    'context': log.get('context', ''),
                    'timestamp': log.get('timestamp', '')
                })
            
            # Analyze decision strategies
            if 'risk' in content and 'assess' in content:
                decision_insights['risk_assessment_patterns'].append({
                    'type': 'explicit_risk_assessment',
                    'context': log.get('context', ''),
                    'timestamp': log.get('timestamp', '')
                })
            
            # Look for trade-off analysis
            if any(word in content for word in ['trade', 'off', 'balance', 'versus', 'vs']):
                decision_insights['trade_off_analysis'].append({
                    'type': 'trade_off_consideration',
                    'context': log.get('context', ''),
                    'timestamp': log.get('timestamp', '')
                })
            
            # Analyze confidence indicators
            if any(word in content for word in ['confident', 'sure', 'certain', 'uncertain', 'doubt']):
                decision_insights['confidence_indicators'].append({
                    'type': 'confidence_expression',
                    'context': log.get('context', ''),
                    'timestamp': log.get('timestamp', '')
                })
        
        return decision_insights
    
    def analyze_success_failure_patterns(self, logs: List[Dict]) -> Dict[str, Any]:
        """Analyze patterns leading to success and failure"""
        
        success_failure_insights = {
            'success_indicators': [],
            'failure_indicators': [],
            'recovery_patterns': [],
            'escalation_patterns': [],
            'success_factors': [],
            'failure_modes': []
        }
        
        for i, log in enumerate(logs):
            content = log.get('content', '').lower()
            
            # Success indicators
            if any(word in content for word in ['success', 'complete', 'finished', 'done', '✅']):
                success_failure_insights['success_indicators'].append({
                    'type': 'explicit_success',
                    'context': log.get('context', ''),
                    'timestamp': log.get('timestamp', ''),
                    'preceding_actions': self._get_preceding_actions(logs, i, 5)
                })
            
            # Failure indicators
            if any(word in content for word in ['error', 'fail', 'exception', '❌', 'failed']):
                success_failure_insights['failure_indicators'].append({
                    'type': 'explicit_failure',
                    'context': log.get('context', ''),
                    'timestamp': log.get('timestamp', ''),
                    'preceding_actions': self._get_preceding_actions(logs, i, 5)
                })
            
            # Recovery patterns
            if 'retry' in content or 'fallback' in content:
                success_failure_insights['recovery_patterns'].append({
                    'type': 'recovery_attempt',
                    'context': log.get('context', ''),
                    'timestamp': log.get('timestamp', '')
                })
        
        return success_failure_insights
    
    def analyze_learning_patterns(self, logs: List[Dict]) -> Dict[str, Any]:
        """Analyze learning and adaptation patterns"""
        
        learning_insights = {
            'knowledge_acquisition': [],
            'skill_development': [],
            'adaptation_events': [],
            'learning_transfer': [],
            'knowledge_application': [],
            'meta_learning': []
        }
        
        for log in logs:
            content = log.get('content', '').lower()
            
            # Knowledge acquisition patterns
            if any(word in content for word in ['learn', 'discover', 'find', 'understand', 'realize']):
                learning_insights['knowledge_acquisition'].append({
                    'type': 'knowledge_gain',
                    'context': log.get('context', ''),
                    'timestamp': log.get('timestamp', '')
                })
            
            # Adaptation events
            if any(word in content for word in ['adapt', 'change', 'modify', 'adjust', 'evolve']):
                learning_insights['adaptation_events'].append({
                    'type': 'adaptation',
                    'context': log.get('context', ''),
                    'timestamp': log.get('timestamp', '')
                })
            
            # Meta-learning (learning about learning)
            if any(word in content for word in ['pattern', 'strategy', 'approach', 'method']):
                learning_insights['meta_learning'].append({
                    'type': 'meta_learning',
                    'context': log.get('context', ''),
                    'timestamp': log.get('timestamp', '')
                })
        
        return learning_insights
    
    def analyze_meta_patterns(self, logs: List[Dict]) -> Dict[str, Any]:
        """Analyze high-level meta-patterns across all dimensions"""
        
        meta_insights = {
            'system_evolution_patterns': [],
            'complexity_management': [],
            'coordination_patterns': [],
            'emergent_behaviors': [],
            'system_intelligence': [],
            'consciousness_indicators': []
        }
        
        # Analyze system evolution
        evolution_indicators = []
        for log in logs:
            content = log.get('content', '').lower()
            if any(word in content for word in ['evolve', 'improve', 'optimize', 'enhance']):
                evolution_indicators.append(log)
        
        if evolution_indicators:
            meta_insights['system_evolution_patterns'] = [{
                'type': 'continuous_improvement',
                'frequency': len(evolution_indicators),
                'indicators': evolution_indicators
            }]
        
        # Analyze complexity management
        complexity_indicators = []
        for log in logs:
            content = log.get('content', '').lower()
            if any(word in content for word in ['complex', 'complicated', 'simplify', 'break', 'down']):
                complexity_indicators.append(log)
        
        if complexity_indicators:
            meta_insights['complexity_management'] = [{
                'type': 'complexity_awareness',
                'frequency': len(complexity_indicators),
                'indicators': complexity_indicators
            }]
        
        # Analyze consciousness indicators
        consciousness_indicators = []
        for log in logs:
            content = log.get('content', '').lower()
            if any(word in content for word in ['aware', 'conscious', 'reflect', 'understand', 'realize']):
                consciousness_indicators.append(log)
        
        if consciousness_indicators:
            meta_insights['consciousness_indicators'] = [{
                'type': 'self_awareness',
                'frequency': len(consciousness_indicators),
                'indicators': consciousness_indicators
            }]
        
        return meta_insights
    
    def _get_preceding_actions(self, logs: List[Dict], current_index: int, lookback: int) -> List[Dict]:
        """Get preceding actions for context analysis"""
        start_index = max(0, current_index - lookback)
        return logs[start_index:current_index]
    
    def extract_lessons_learned(self, all_patterns: Dict[str, Any]) -> List[Dict]:
        """Extract high-level lessons learned from patterns"""
        
        lessons = []
        
        # Lesson 1: Problem-solving effectiveness
        cognitive_patterns = all_patterns.get('cognitive_patterns', {})
        if cognitive_patterns.get('problem_solving_approaches'):
            systematic_count = len([p for p in cognitive_patterns['problem_solving_approaches'] 
                                  if p['type'] == 'systematic_retry'])
            adaptive_count = len([p for p in cognitive_patterns['problem_solving_approaches'] 
                                if p['type'] == 'adaptive_fallback'])
            
            if systematic_count > adaptive_count:
                lessons.append({
                    'lesson': 'Systematic problem-solving is more effective than ad-hoc approaches',
                    'evidence': f'{systematic_count} systematic vs {adaptive_count} adaptive approaches',
                    'recommendation': 'Continue systematic approach, enhance adaptive capabilities'
                })
        
        # Lesson 2: Decision-making quality
        decision_patterns = all_patterns.get('decision_patterns', {})
        if decision_patterns.get('risk_assessment_patterns'):
            lessons.append({
                'lesson': 'Explicit risk assessment improves decision quality',
                'evidence': f'{len(decision_patterns["risk_assessment_patterns"])} risk assessments performed',
                'recommendation': 'Institutionalize risk assessment in decision processes'
            })
        
        # Lesson 3: Learning effectiveness
        learning_patterns = all_patterns.get('learning_patterns', {})
        if learning_patterns.get('adaptation_events'):
            lessons.append({
                'lesson': 'Adaptation is key to system evolution',
                'evidence': f'{len(learning_patterns["adaptation_events"])} adaptation events',
                'recommendation': 'Increase adaptation frequency and effectiveness'
            })
        
        # Lesson 4: Success factors
        success_failure = all_patterns.get('success_failure_patterns', {})
        if success_failure.get('success_indicators'):
            lessons.append({
                'lesson': 'Systematic approaches lead to higher success rates',
                'evidence': f'{len(success_failure["success_indicators"])} success indicators',
                'recommendation': 'Document and replicate successful patterns'
            })
        
        return lessons

def load_execution_logs(log_directory: str = "reports") -> List[Dict]:
    """Load execution logs from specific files or reports directory"""
    
    logs = []
    
    try:
        # Check if specific files were provided via command line
        if len(sys.argv) > 2 and sys.argv[1] == '--files':
            file_paths = [Path(fp) for fp in sys.argv[2:]]
            print(f"📁 Loading specific files: {', '.join(sys.argv[2:])}")
        else:
            # Load all JSON files in the reports directory
            log_path = Path(log_directory)
            if not log_path.exists():
                print(f"⚠️  Reports directory not found: {log_directory}")
                return logs
            
            file_paths = list(log_path.glob("*.json"))
            print(f"📁 Found {len(file_paths)} JSON files in {log_directory}")
        
        for file_path in file_paths:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    
                    # Extract log-like information from various report formats
                    if isinstance(data, dict):
                        # Add file context
                        data['source_file'] = str(file_path)
                        data['timestamp'] = data.get('timestamp', datetime.now().isoformat())
                        
                        # Convert to log format
                        log_entry = {
                            'content': json.dumps(data, ensure_ascii=False),
                            'context': data.get('context', {}),
                            'timestamp': data.get('timestamp', datetime.now().isoformat()),
                            'source': str(file_path)
                        }
                        logs.append(log_entry)
                        
            except Exception as e:
                print(f"⚠️  Could not load {file_path}: {e}")
                continue
    
    except Exception as e:
        print(f"❌ Error loading logs: {e}")
    
    return logs

def run_deep_pattern_recognition(context: Dict[str, Any] = None) -> Dict[str, Any]:
    """Main function to run deep pattern recognition analysis"""
    
    if context is None:
        context = {}
    
    print("🧠 Running Deep Pattern Recognition Analysis...")
    
    try:
        # Load execution logs
        logs = load_execution_logs()
        print(f"📊 Loaded {len(logs)} log entries for analysis")
        
        # Initialize pattern analyzer
        analyzer = PatternAnalyzer()
        
        # Run all pattern analyses
        cognitive_patterns = analyzer.analyze_cognitive_patterns(logs)
        decision_patterns = analyzer.analyze_decision_patterns(logs)
        success_failure_patterns = analyzer.analyze_success_failure_patterns(logs)
        learning_patterns = analyzer.analyze_learning_patterns(logs)
        meta_patterns = analyzer.analyze_meta_patterns(logs)
        
        # Combine all patterns
        all_patterns = {
            'cognitive_patterns': cognitive_patterns,
            'decision_patterns': decision_patterns,
            'success_failure_patterns': success_failure_patterns,
            'learning_patterns': learning_patterns,
            'meta_patterns': meta_patterns
        }
        
        # Extract lessons learned
        lessons_learned = analyzer.extract_lessons_learned(all_patterns)
        
        # Generate insights summary
        insights_summary = {
            'total_patterns_identified': sum(len(patterns) for patterns in all_patterns.values()),
            'cognitive_insights': len(cognitive_patterns.get('problem_solving_approaches', [])),
            'decision_insights': len(decision_patterns.get('decision_points', [])),
            'learning_insights': len(learning_patterns.get('knowledge_acquisition', [])),
            'success_insights': len(success_failure_patterns.get('success_indicators', [])),
            'meta_insights': len(meta_patterns.get('system_evolution_patterns', []))
        }
        
        # Combine results
        result = {
            "success": True,
            "deep_pattern_recognition_complete": True,
            "pattern_analysis": all_patterns,
            "lessons_learned": lessons_learned,
            "insights_summary": insights_summary,
            "analysis_metadata": {
                "logs_analyzed": len(logs),
                "time_range": {
                    "start": min([log.get('timestamp', '') for log in logs]) if logs else '',
                    "end": max([log.get('timestamp', '') for log in logs]) if logs else ''
                },
                "pattern_categories": len(all_patterns)
            },
            "timestamp": datetime.now().isoformat()
        }
        
        # Save detailed report
        report_path = f"reports/deep_pattern_recognition_{int(datetime.now().timestamp())}.json"
        os.makedirs("reports", exist_ok=True)
        
        # Simplify result for JSON serialization
        simplified_result = {
            "success": True,
            "deep_pattern_recognition_complete": True,
            "pattern_summary": {
                "cognitive_patterns_count": len(cognitive_patterns.get('problem_solving_approaches', [])),
                "decision_patterns_count": len(decision_patterns.get('decision_points', [])),
                "success_failure_patterns_count": len(success_failure_patterns.get('success_indicators', [])),
                "learning_patterns_count": len(learning_patterns.get('knowledge_acquisition', [])),
                "meta_patterns_count": len(meta_patterns.get('system_evolution_patterns', []))
            },
            "lessons_learned": lessons_learned,
            "insights_summary": insights_summary,
            "analysis_metadata": {
                "logs_analyzed": len(logs),
                "time_range": {
                    "start": min([log.get('timestamp', '') for log in logs]) if logs else '',
                    "end": max([log.get('timestamp', '') for log in logs]) if logs else ''
                },
                "pattern_categories": len(all_patterns)
            },
            "timestamp": datetime.now().isoformat()
        }
        
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(simplified_result, f, indent=2, ensure_ascii=False, cls=SafeJSONEncoder)
        
        print(f"📄 Deep pattern recognition report saved: {report_path}")
        print(f"🧠 Identified {insights_summary['total_patterns_identified']} patterns")
        print(f"📚 Extracted {len(lessons_learned)} lessons learned")
        print(f"🎯 Key insights:")
        for lesson in lessons_learned[:3]:  # Show top 3 lessons
            print(f"   • {lesson['lesson']}")
        
        return simplified_result
        
    except Exception as e:
        error_result = {
            "success": False,
            "error": f"Deep pattern recognition failed: {str(e)}",
            "traceback": traceback.format_exc(),
            "timestamp": datetime.now().isoformat()
        }
        
        print(f"❌ Error: {error_result['error']}")
        return error_result

if __name__ == "__main__":
    # Test the frame
    result = run_deep_pattern_recognition()
    print(json.dumps(result, indent=2))
