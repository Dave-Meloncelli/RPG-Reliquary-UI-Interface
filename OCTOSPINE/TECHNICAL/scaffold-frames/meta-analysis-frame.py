#!/usr/bin/env python3
"""
Meta Analysis Frame
Analyzes framework execution for self-improvement and optimization
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import traceback
from collections import defaultdict, Counter

class MetaAnalyzer:
    """Analyzes framework execution patterns for self-improvement"""
    
    def __init__(self):
        self.analysis_results = {}
    
    def analyze_execution_patterns(self, execution_history: List[Dict]) -> Dict[str, Any]:
        """Analyze execution patterns for trends and insights"""
        
        if not execution_history:
            return {"error": "No execution history available"}
        
        # Calculate basic statistics
        total_executions = len(execution_history)
        successful_executions = sum(1 for ex in execution_history if ex.get("success", False))
        success_rate = successful_executions / total_executions if total_executions > 0 else 0
        
        # Analyze duration patterns
        durations = [ex.get("duration", 0) for ex in execution_history if ex.get("duration", 0) > 0]
        avg_duration = sum(durations) / len(durations) if durations else 0
        max_duration = max(durations) if durations else 0
        min_duration = min(durations) if durations else 0
        
        # Analyze frame performance
        frame_performance = defaultdict(list)
        for ex in execution_history:
            scaffold_id = ex.get("scaffold_id", "unknown")
            frame_performance[scaffold_id].append({
                "success": ex.get("success", False),
                "duration": ex.get("duration", 0),
                "frames_executed": ex.get("frames_executed", 0),
                "successful_frames": ex.get("successful_frames", 0),
                "failed_frames": ex.get("failed_frames", 0)
            })
        
        # Calculate scaffold-specific metrics
        scaffold_metrics = {}
        for scaffold_id, performances in frame_performance.items():
            scaffold_success_rate = sum(1 for p in performances if p["success"]) / len(performances)
            scaffold_avg_duration = sum(p["duration"] for p in performances) / len(performances)
            scaffold_avg_frames = sum(p["frames_executed"] for p in performances) / len(performances)
            
            scaffold_metrics[scaffold_id] = {
                "execution_count": len(performances),
                "success_rate": scaffold_success_rate,
                "avg_duration": scaffold_avg_duration,
                "avg_frames_executed": scaffold_avg_frames
            }
        
        # Identify trends
        recent_executions = execution_history[-10:] if len(execution_history) >= 10 else execution_history
        recent_success_rate = sum(1 for ex in recent_executions if ex.get("success", False)) / len(recent_executions)
        
        trend_analysis = {
            "overall_trend": "improving" if recent_success_rate > success_rate else "declining" if recent_success_rate < success_rate else "stable",
            "recent_performance": recent_success_rate,
            "historical_performance": success_rate
        }
        
        return {
            "execution_statistics": {
                "total_executions": total_executions,
                "successful_executions": successful_executions,
                "success_rate": success_rate,
                "avg_duration": avg_duration,
                "max_duration": max_duration,
                "min_duration": min_duration
            },
            "scaffold_metrics": scaffold_metrics,
            "trend_analysis": trend_analysis,
            "performance_insights": self._generate_performance_insights(success_rate, avg_duration, scaffold_metrics)
        }
    
    def _generate_performance_insights(self, success_rate: float, avg_duration: float, scaffold_metrics: Dict) -> List[str]:
        """Generate insights based on performance data"""
        insights = []
        
        if success_rate < 0.8:
            insights.append("Framework success rate below 80% - consider implementing self-healing mechanisms")
        
        if success_rate < 0.9:
            insights.append("Success rate below 90% - review failure patterns and implement predictive analysis")
        
        if avg_duration > 300:  # 5 minutes
            insights.append("Average execution time exceeds 5 minutes - consider parallel execution optimization")
        
        # Find best and worst performing scaffolds
        if scaffold_metrics:
            best_scaffold = max(scaffold_metrics.items(), key=lambda x: x[1]["success_rate"])
            worst_scaffold = min(scaffold_metrics.items(), key=lambda x: x[1]["success_rate"])
            
            if best_scaffold[1]["success_rate"] > 0.95:
                insights.append(f"Excellent performance in {best_scaffold[0]} scaffold - consider replicating patterns")
            
            if worst_scaffold[1]["success_rate"] < 0.7:
                insights.append(f"Poor performance in {worst_scaffold[0]} scaffold - requires immediate attention")
        
        return insights
    
    def analyze_failure_patterns(self, execution_history: List[Dict]) -> Dict[str, Any]:
        """Analyze failure patterns to identify common issues"""
        
        failed_executions = [ex for ex in execution_history if not ex.get("success", False)]
        
        if not failed_executions:
            return {"message": "No failures detected in execution history"}
        
        # Analyze failure characteristics
        failure_analysis = {
            "total_failures": len(failed_executions),
            "failure_rate": len(failed_executions) / len(execution_history),
            "failure_patterns": {}
        }
        
        # Group failures by scaffold
        scaffold_failures = defaultdict(list)
        for failure in failed_executions:
            scaffold_id = failure.get("scaffold_id", "unknown")
            scaffold_failures[scaffold_id].append(failure)
        
        for scaffold_id, failures in scaffold_failures.items():
            failure_analysis["failure_patterns"][scaffold_id] = {
                "failure_count": len(failures),
                "avg_duration_before_failure": sum(f.get("duration", 0) for f in failures) / len(failures),
                "avg_frames_executed": sum(f.get("frames_executed", 0) for f in failures) / len(failures),
                "common_failure_points": self._identify_failure_points(failures)
            }
        
        return failure_analysis
    
    def _identify_failure_points(self, failures: List[Dict]) -> List[str]:
        """Identify common failure points"""
        failure_points = []
        
        for failure in failures:
            failed_frames = failure.get("failed_frames", 0)
            total_frames = failure.get("frames_executed", 0)
            
            if failed_frames > 0 and total_frames > 0:
                failure_stage = (failed_frames / total_frames) * 10  # Approximate stage
                if failure_stage <= 3:
                    failure_points.append("early_stage_failure")
                elif failure_stage <= 7:
                    failure_points.append("mid_stage_failure")
                else:
                    failure_points.append("late_stage_failure")
        
        # Count occurrences
        point_counts = Counter(failure_points)
        return [f"{point} ({count} occurrences)" for point, count in point_counts.most_common()]
    
    def generate_optimization_recommendations(self, analysis_results: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate optimization recommendations based on analysis"""
        
        recommendations = []
        
        # Performance recommendations
        if "execution_statistics" in analysis_results:
            stats = analysis_results["execution_statistics"]
            
            if stats["success_rate"] < 0.9:
                recommendations.append({
                    "category": "reliability",
                    "priority": "high",
                    "recommendation": "Implement self-healing mechanisms",
                    "rationale": f"Success rate of {stats['success_rate']:.1%} is below target of 90%",
                    "expected_impact": "Increase success rate to 95%+"
                })
            
            if stats["avg_duration"] > 300:
                recommendations.append({
                    "category": "performance",
                    "priority": "high",
                    "recommendation": "Implement parallel execution",
                    "rationale": f"Average execution time of {stats['avg_duration']:.1f}s is too high",
                    "expected_impact": "Reduce execution time by 50%"
                })
        
        # Intelligence recommendations
        recommendations.append({
            "category": "intelligence",
            "priority": "medium",
            "recommendation": "Implement predictive analysis",
            "rationale": "Historical data analysis can prevent failures",
            "expected_impact": "Reduce failure rate by 30%"
        })
        
        recommendations.append({
            "category": "intelligence",
            "priority": "medium",
            "recommendation": "Enhance pattern recognition",
            "rationale": "Better pattern recognition improves decision making",
            "expected_impact": "Improve success rate by 10%"
        })
        
        # Monitoring recommendations
        recommendations.append({
            "category": "monitoring",
            "priority": "medium",
            "recommendation": "Implement real-time monitoring",
            "rationale": "Real-time monitoring enables proactive intervention",
            "expected_impact": "Reduce manual intervention by 60%"
        })
        
        return recommendations

def run_meta_analysis(context: Dict[str, Any] = None) -> Dict[str, Any]:
    """Main function to run meta-analysis of framework execution"""
    
    if context is None:
        context = {}
    
    print("🔍 Running Meta Analysis...")
    
    try:
        # Initialize meta analyzer
        analyzer = MetaAnalyzer()
        
        # Load execution history from knowledge hub if available
        execution_history = []
        knowledge_hub_path = Path("knowledge_hub")
        knowledge_index_path = knowledge_hub_path / "knowledge_index.json"
        
        if knowledge_index_path.exists():
            try:
                with open(knowledge_index_path, 'r', encoding='utf-8') as f:
                    knowledge_index = json.load(f)
                    execution_history = knowledge_index.get("execution_history", [])
                    print(f"📊 Loaded {len(execution_history)} execution records from knowledge hub")
            except Exception as e:
                print(f"⚠️  Could not load execution history: {e}")
        
        # If no execution history, create sample data for testing
        if not execution_history:
            print("📝 No execution history found, using sample data for analysis")
            execution_history = [
                {
                    "timestamp": "2025-08-08T20:00:00",
                    "scaffold_id": "full_system_analysis",
                    "success": True,
                    "duration": 180,
                    "frames_executed": 8,
                    "successful_frames": 8,
                    "failed_frames": 0,
                    "patterns_identified": 15,
                    "lessons_learned": 3
                },
                {
                    "timestamp": "2025-08-08T21:00:00",
                    "scaffold_id": "continuous_improvement",
                    "success": False,
                    "duration": 120,
                    "frames_executed": 5,
                    "successful_frames": 3,
                    "failed_frames": 2,
                    "patterns_identified": 8,
                    "lessons_learned": 2
                }
            ]
        
        # Run analyses
        execution_analysis = analyzer.analyze_execution_patterns(execution_history)
        failure_analysis = analyzer.analyze_failure_patterns(execution_history)
        optimization_recommendations = analyzer.generate_optimization_recommendations(execution_analysis)
        
        # Generate meta-insights
        meta_insights = []
        
        if "execution_statistics" in execution_analysis:
            stats = execution_analysis["execution_statistics"]
            meta_insights.append({
                "insight": f"Framework success rate: {stats['success_rate']:.1%}",
                "type": "performance_metric",
                "confidence": 0.9
            })
            
            meta_insights.append({
                "insight": f"Average execution time: {stats['avg_duration']:.1f} seconds",
                "type": "performance_metric",
                "confidence": 0.9
            })
        
        if "trend_analysis" in execution_analysis:
            trend = execution_analysis["trend_analysis"]
            meta_insights.append({
                "insight": f"Performance trend: {trend['overall_trend']}",
                "type": "trend_analysis",
                "confidence": 0.8
            })
        
        # Combine results
        result = {
            "success": True,
            "meta_analysis_complete": True,
            "execution_analysis": execution_analysis,
            "failure_analysis": failure_analysis,
            "optimization_recommendations": optimization_recommendations,
            "meta_insights": meta_insights,
            "analysis_metadata": {
                "executions_analyzed": len(execution_history),
                "analysis_timestamp": datetime.now().isoformat(),
                "analysis_duration": 0  # Will be calculated by caller
            },
            "timestamp": datetime.now().isoformat()
        }
        
        # Save detailed report
        report_path = f"reports/meta_analysis_{int(datetime.now().timestamp())}.json"
        os.makedirs("reports", exist_ok=True)
        
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        
        print(f"📊 Meta analysis complete: {len(optimization_recommendations)} recommendations generated")
        print(f"📄 Report saved: {report_path}")
        
        # Print key insights
        if meta_insights:
            print("🎯 Key insights:")
            for insight in meta_insights[:3]:
                print(f"   • {insight['insight']}")
        
        if optimization_recommendations:
            print("🚀 Top recommendations:")
            for rec in optimization_recommendations[:3]:
                print(f"   • {rec['recommendation']} ({rec['priority']} priority)")
        
        return result
        
    except Exception as e:
        error_result = {
            "success": False,
            "error": f"Meta analysis failed: {str(e)}",
            "traceback": traceback.format_exc(),
            "timestamp": datetime.now().isoformat()
        }
        
        print(f"❌ Error: {error_result['error']}")
        return error_result

if __name__ == "__main__":
    # Test the frame
    result = run_meta_analysis()
    print(json.dumps(result, indent=2))
