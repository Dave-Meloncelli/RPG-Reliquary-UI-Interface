#!/usr/bin/env python3
"""
Predictive Analysis Frame
Analyzes historical execution data to predict failures and optimize performance
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
import traceback
from collections import defaultdict, Counter
import statistics

class PredictiveAnalyzer:
    """Analyzes historical data to predict failures and optimize performance"""
    
    def __init__(self, analysis_path: str = "predictive_analysis"):
        self.analysis_path = Path(analysis_path)
        self.analysis_path.mkdir(exist_ok=True)
        
        # Analysis data storage
        self.predictions_path = self.analysis_path / "predictions.json"
        self.models_path = self.analysis_path / "models.json"
        self.accuracy_history_path = self.analysis_path / "accuracy_history.json"
        
        # Load existing data
        self.predictions = self._load_predictions()
        self.models = self._load_models()
        self.accuracy_history = self._load_accuracy_history()
    
    def _load_predictions(self) -> List[Dict[str, Any]]:
        """Load existing predictions"""
        if self.predictions_path.exists():
            try:
                with open(self.predictions_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"⚠️  Could not load predictions: {e}")
        
        return []
    
    def _save_predictions(self):
        """Save predictions to file"""
        with open(self.predictions_path, 'w', encoding='utf-8') as f:
            json.dump(self.predictions, f, indent=2, ensure_ascii=False)
    
    def _load_models(self) -> Dict[str, Any]:
        """Load prediction models"""
        if self.models_path.exists():
            try:
                with open(self.models_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"⚠️  Could not load models: {e}")
        
        return {
            "failure_prediction": {},
            "performance_prediction": {},
            "resource_prediction": {},
            "last_updated": datetime.now().isoformat()
        }
    
    def _save_models(self):
        """Save prediction models"""
        self.models["last_updated"] = datetime.now().isoformat()
        with open(self.models_path, 'w', encoding='utf-8') as f:
            json.dump(self.models, f, indent=2, ensure_ascii=False)
    
    def _load_accuracy_history(self) -> List[Dict[str, Any]]:
        """Load accuracy history"""
        if self.accuracy_history_path.exists():
            try:
                with open(self.accuracy_history_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"⚠️  Could not load accuracy history: {e}")
        
        return []
    
    def _save_accuracy_history(self):
        """Save accuracy history"""
        with open(self.accuracy_history_path, 'w', encoding='utf-8') as f:
            json.dump(self.accuracy_history, f, indent=2, ensure_ascii=False)
    
    def analyze_execution_patterns(self, execution_history: List[Dict]) -> Dict[str, Any]:
        """Analyze execution patterns for prediction models"""
        
        if not execution_history:
            return {"error": "No execution history available"}
        
        # Group executions by scaffold
        scaffold_executions = defaultdict(list)
        for execution in execution_history:
            scaffold_id = execution.get("scaffold_id", "unknown")
            scaffold_executions[scaffold_id].append(execution)
        
        # Analyze patterns for each scaffold
        pattern_analysis = {}
        
        for scaffold_id, executions in scaffold_executions.items():
            if len(executions) < 2:
                continue  # Need at least 2 executions for pattern analysis
            
            # Calculate basic statistics
            success_rates = [ex.get("success", False) for ex in executions]
            durations = [ex.get("duration", 0) for ex in executions if ex.get("duration", 0) > 0]
            frame_counts = [ex.get("frames_executed", 0) for ex in executions]
            
            # Success rate analysis
            success_rate = sum(success_rates) / len(success_rates)
            success_rate_trend = self._calculate_trend(success_rates)
            
            # Duration analysis
            avg_duration = statistics.mean(durations) if durations else 0
            duration_trend = self._calculate_trend(durations) if len(durations) > 1 else "stable"
            duration_volatility = statistics.stdev(durations) if len(durations) > 1 else 0
            
            # Frame count analysis
            avg_frames = statistics.mean(frame_counts) if frame_counts else 0
            frame_count_trend = self._calculate_trend(frame_counts) if len(frame_counts) > 1 else "stable"
            
            # Failure pattern analysis
            failure_patterns = self._analyze_failure_patterns(executions)
            
            pattern_analysis[scaffold_id] = {
                "execution_count": len(executions),
                "success_rate": {
                    "current": success_rate,
                    "trend": success_rate_trend,
                    "prediction": self._predict_success_rate(success_rates)
                },
                "duration": {
                    "average": avg_duration,
                    "trend": duration_trend,
                    "volatility": duration_volatility,
                    "prediction": self._predict_duration(durations)
                },
                "frame_count": {
                    "average": avg_frames,
                    "trend": frame_count_trend,
                    "prediction": self._predict_frame_count(frame_counts)
                },
                "failure_patterns": failure_patterns,
                "risk_assessment": self._assess_risk(success_rate, duration_volatility, failure_patterns)
            }
        
        return pattern_analysis
    
    def _calculate_trend(self, values: List[float]) -> str:
        """Calculate trend direction from a list of values"""
        if len(values) < 2:
            return "stable"
        
        # Simple trend calculation using first and last values
        first_half = values[:len(values)//2]
        second_half = values[len(values)//2:]
        
        if not first_half or not second_half:
            return "stable"
        
        first_avg = statistics.mean(first_half)
        second_avg = statistics.mean(second_half)
        
        if second_avg > first_avg * 1.1:
            return "improving"
        elif second_avg < first_avg * 0.9:
            return "declining"
        else:
            return "stable"
    
    def _analyze_failure_patterns(self, executions: List[Dict]) -> Dict[str, Any]:
        """Analyze patterns in failures"""
        
        failed_executions = [ex for ex in executions if not ex.get("success", False)]
        
        if not failed_executions:
            return {
                "failure_rate": 0.0,
                "common_failure_types": [],
                "failure_timing": "none"
            }
        
        # Calculate failure rate
        failure_rate = len(failed_executions) / len(executions)
        
        # Analyze failure timing
        failure_timing = self._analyze_failure_timing(failed_executions)
        
        # Analyze failure types (if available)
        failure_types = []
        for failure in failed_executions:
            error = failure.get("error", "")
            if error:
                failure_types.append(self._classify_failure_type(error))
        
        common_failure_types = Counter(failure_types).most_common(3)
        
        return {
            "failure_rate": failure_rate,
            "common_failure_types": [{"type": t, "count": c} for t, c in common_failure_types],
            "failure_timing": failure_timing
        }
    
    def _analyze_failure_timing(self, failed_executions: List[Dict]) -> str:
        """Analyze when failures typically occur"""
        
        if not failed_executions:
            return "none"
        
        # Analyze failure timing based on execution order
        failure_positions = []
        for failure in failed_executions:
            # Try to determine if it's early, mid, or late failure
            duration = failure.get("duration", 0)
            frames_executed = failure.get("frames_executed", 0)
            
            if duration < 30:  # Less than 30 seconds
                failure_positions.append("early")
            elif duration < 300:  # Less than 5 minutes
                failure_positions.append("mid")
            else:
                failure_positions.append("late")
        
        if failure_positions:
            most_common = Counter(failure_positions).most_common(1)[0][0]
            return most_common
        
        return "unknown"
    
    def _classify_failure_type(self, error_message: str) -> str:
        """Classify failure type from error message"""
        
        error_lower = error_message.lower()
        
        if any(word in error_lower for word in ['timeout', 'timed out']):
            return 'timeout'
        elif any(word in error_lower for word in ['file not found', 'no such file']):
            return 'file_not_found'
        elif any(word in error_lower for word in ['permission denied', 'access denied']):
            return 'permission_error'
        elif any(word in error_lower for word in ['module not found', 'import error']):
            return 'dependency_error'
        elif any(word in error_lower for word in ['json decode', 'invalid json']):
            return 'json_error'
        elif any(word in error_lower for word in ['connection refused', 'network error']):
            return 'connection_error'
        elif any(word in error_lower for word in ['memory error', 'out of memory']):
            return 'memory_error'
        else:
            return 'unknown_error'
    
    def _predict_success_rate(self, success_rates: List[bool]) -> float:
        """Predict future success rate"""
        
        if not success_rates:
            return 0.5  # Default prediction
        
        # Simple prediction based on recent trend
        recent_success_rate = sum(success_rates[-5:]) / min(len(success_rates), 5)
        
        # Apply trend adjustment
        if len(success_rates) >= 10:
            trend = self._calculate_trend(success_rates)
            if trend == "improving":
                return min(recent_success_rate * 1.1, 1.0)
            elif trend == "declining":
                return max(recent_success_rate * 0.9, 0.0)
        
        return recent_success_rate
    
    def _predict_duration(self, durations: List[float]) -> float:
        """Predict future execution duration"""
        
        if not durations:
            return 300  # Default 5 minutes
        
        # Use exponential moving average for prediction
        if len(durations) == 1:
            return durations[0]
        
        # Simple weighted average (more weight to recent values)
        weights = [i + 1 for i in range(len(durations))]
        weighted_sum = sum(d * w for d, w in zip(durations, weights))
        total_weight = sum(weights)
        
        predicted_duration = weighted_sum / total_weight
        
        # Apply trend adjustment
        trend = self._calculate_trend(durations)
        if trend == "improving":
            predicted_duration *= 0.9
        elif trend == "declining":
            predicted_duration *= 1.1
        
        return max(predicted_duration, 10)  # Minimum 10 seconds
    
    def _predict_frame_count(self, frame_counts: List[int]) -> int:
        """Predict future frame count"""
        
        if not frame_counts:
            return 5  # Default prediction
        
        # Simple average with trend adjustment
        avg_frames = statistics.mean(frame_counts)
        
        trend = self._calculate_trend(frame_counts)
        if trend == "improving":
            avg_frames *= 0.9
        elif trend == "declining":
            avg_frames *= 1.1
        
        return max(int(avg_frames), 1)  # Minimum 1 frame
    
    def _assess_risk(self, success_rate: float, duration_volatility: float, failure_patterns: Dict) -> Dict[str, Any]:
        """Assess risk level for future executions"""
        
        risk_score = 0.0
        risk_factors = []
        
        # Success rate risk
        if success_rate < 0.8:
            risk_score += 0.3
            risk_factors.append("low_success_rate")
        
        if success_rate < 0.6:
            risk_score += 0.2
            risk_factors.append("very_low_success_rate")
        
        # Duration volatility risk
        if duration_volatility > 100:  # High volatility
            risk_score += 0.2
            risk_factors.append("high_duration_volatility")
        
        # Failure pattern risk
        failure_rate = failure_patterns.get("failure_rate", 0.0)
        if failure_rate > 0.2:
            risk_score += 0.3
            risk_factors.append("high_failure_rate")
        
        if failure_rate > 0.4:
            risk_score += 0.2
            risk_factors.append("very_high_failure_rate")
        
        # Determine risk level
        if risk_score >= 0.8:
            risk_level = "critical"
        elif risk_score >= 0.6:
            risk_level = "high"
        elif risk_score >= 0.4:
            risk_level = "medium"
        elif risk_score >= 0.2:
            risk_level = "low"
        else:
            risk_level = "minimal"
        
        return {
            "risk_score": risk_score,
            "risk_level": risk_level,
            "risk_factors": risk_factors,
            "recommendations": self._generate_risk_recommendations(risk_factors)
        }
    
    def _generate_risk_recommendations(self, risk_factors: List[str]) -> List[str]:
        """Generate recommendations based on risk factors"""
        
        recommendations = []
        
        for factor in risk_factors:
            if factor == "low_success_rate":
                recommendations.append("Implement self-healing mechanisms")
            elif factor == "very_low_success_rate":
                recommendations.append("Critical: Review and fix underlying issues")
            elif factor == "high_duration_volatility":
                recommendations.append("Implement adaptive timeouts")
            elif factor == "high_failure_rate":
                recommendations.append("Add predictive failure prevention")
            elif factor == "very_high_failure_rate":
                recommendations.append("Critical: Immediate intervention required")
        
        return recommendations
    
    def generate_predictions(self, pattern_analysis: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate predictions based on pattern analysis"""
        
        predictions = []
        
        for scaffold_id, patterns in pattern_analysis.items():
            # Success rate prediction
            success_prediction = patterns["success_rate"]["prediction"]
            
            # Duration prediction
            duration_prediction = patterns["duration"]["prediction"]
            
            # Frame count prediction
            frame_count_prediction = patterns["frame_count"]["prediction"]
            
            # Risk assessment
            risk_assessment = patterns["risk_assessment"]
            
            prediction = {
                "scaffold_id": scaffold_id,
                "prediction_type": "execution_prediction",
                "predicted_success_rate": success_prediction,
                "predicted_duration": duration_prediction,
                "predicted_frame_count": frame_count_prediction,
                "risk_assessment": risk_assessment,
                "confidence": self._calculate_prediction_confidence(patterns),
                "prediction_horizon": "next_execution",
                "created_at": datetime.now().isoformat()
            }
            
            predictions.append(prediction)
        
        return predictions
    
    def _calculate_prediction_confidence(self, patterns: Dict[str, Any]) -> float:
        """Calculate confidence level for predictions"""
        
        confidence = 0.5  # Base confidence
        
        # Higher confidence with more data
        execution_count = patterns.get("execution_count", 0)
        if execution_count >= 10:
            confidence += 0.2
        elif execution_count >= 5:
            confidence += 0.1
        
        # Higher confidence with stable patterns
        success_trend = patterns["success_rate"]["trend"]
        duration_trend = patterns["duration"]["trend"]
        
        if success_trend == "stable" and duration_trend == "stable":
            confidence += 0.2
        elif success_trend == "stable" or duration_trend == "stable":
            confidence += 0.1
        
        # Lower confidence with high volatility
        duration_volatility = patterns["duration"]["volatility"]
        if duration_volatility > 100:
            confidence -= 0.1
        
        # Lower confidence with high risk
        risk_score = patterns["risk_assessment"]["risk_score"]
        if risk_score > 0.6:
            confidence -= 0.2
        
        return max(min(confidence, 1.0), 0.0)  # Clamp between 0 and 1

def run_predictive_analysis(context: Dict[str, Any] = None) -> Dict[str, Any]:
    """Main function to run predictive analysis"""
    
    if context is None:
        context = {}
    
    print("🔮 Running Predictive Analysis...")
    
    try:
        # Initialize predictive analyzer
        analyzer = PredictiveAnalyzer()
        
        # Load execution history from knowledge hub
        execution_history = []
        knowledge_hub_path = Path("knowledge_hub")
        knowledge_index_path = knowledge_hub_path / "knowledge_index.json"
        
        if knowledge_index_path.exists():
            try:
                with open(knowledge_index_path, 'r', encoding='utf-8') as f:
                    knowledge_index = json.load(f)
                    execution_history = knowledge_index.get("execution_history", [])
                    print(f"📊 Loaded {len(execution_history)} execution records for analysis")
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
                    "failed_frames": 0
                },
                {
                    "timestamp": "2025-08-08T21:00:00",
                    "scaffold_id": "full_system_analysis",
                    "success": True,
                    "duration": 165,
                    "frames_executed": 8,
                    "successful_frames": 8,
                    "failed_frames": 0
                },
                {
                    "timestamp": "2025-08-08T22:00:00",
                    "scaffold_id": "continuous_improvement",
                    "success": False,
                    "duration": 120,
                    "frames_executed": 5,
                    "successful_frames": 3,
                    "failed_frames": 2,
                    "error": "File not found: missing_config.json"
                }
            ]
        
        # Analyze execution patterns
        pattern_analysis = analyzer.analyze_execution_patterns(execution_history)
        
        # Generate predictions
        predictions = analyzer.generate_predictions(pattern_analysis)
        
        # Store predictions
        analyzer.predictions.extend(predictions)
        analyzer._save_predictions()
        
        # Generate insights
        insights = []
        
        for scaffold_id, patterns in pattern_analysis.items():
            success_rate = patterns["success_rate"]["current"]
            risk_level = patterns["risk_assessment"]["risk_level"]
            
            insights.append({
                "scaffold_id": scaffold_id,
                "insight": f"Success rate: {success_rate:.1%}, Risk level: {risk_level}",
                "type": "performance_insight",
                "confidence": patterns["success_rate"]["prediction"]
            })
        
        # Calculate overall metrics
        total_executions = len(execution_history)
        successful_executions = sum(1 for ex in execution_history if ex.get("success", False))
        overall_success_rate = successful_executions / total_executions if total_executions > 0 else 0
        
        # Create analysis report
        result = {
            "success": True,
            "predictive_analysis_complete": True,
            "pattern_analysis": pattern_analysis,
            "predictions": predictions,
            "insights": insights,
            "overall_metrics": {
                "total_executions": total_executions,
                "successful_executions": successful_executions,
                "overall_success_rate": overall_success_rate,
                "scaffolds_analyzed": len(pattern_analysis),
                "predictions_generated": len(predictions)
            },
            "analysis_metadata": {
                "analysis_timestamp": datetime.now().isoformat(),
                "executions_analyzed": len(execution_history),
                "prediction_horizon": "next_execution"
            },
            "timestamp": datetime.now().isoformat()
        }
        
        # Save detailed report
        report_path = f"reports/predictive_analysis_{int(datetime.now().timestamp())}.json"
        os.makedirs("reports", exist_ok=True)
        
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        
        print(f"🔮 Predictive analysis complete: {len(predictions)} predictions generated")
        print(f"📄 Report saved: {report_path}")
        
        # Print key insights
        if insights:
            print("🎯 Key insights:")
            for insight in insights[:3]:
                print(f"   • {insight['insight']}")
        
        if predictions:
            print("🔮 Top predictions:")
            for prediction in predictions[:3]:
                scaffold_id = prediction["scaffold_id"]
                success_rate = prediction["predicted_success_rate"]
                risk_level = prediction["risk_assessment"]["risk_level"]
                print(f"   • {scaffold_id}: {success_rate:.1%} success rate, {risk_level} risk")
        
        return result
        
    except Exception as e:
        error_result = {
            "success": False,
            "error": f"Predictive analysis failed: {str(e)}",
            "traceback": traceback.format_exc(),
            "timestamp": datetime.now().isoformat()
        }
        
        print(f"❌ Error: {error_result['error']}")
        return error_result

if __name__ == "__main__":
    # Test the frame
    result = run_predictive_analysis()
    print(json.dumps(result, indent=2))
