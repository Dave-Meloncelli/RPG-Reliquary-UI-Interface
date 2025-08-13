#!/usr/bin/env python3
"""
Knowledge Hub Update Frame
Manages persistent learning and knowledge storage across framework executions
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import traceback
import hashlib

class KnowledgeHub:
    """Manages persistent knowledge storage and retrieval"""
    
    def __init__(self, hub_path: str = "knowledge_hub"):
        self.hub_path = Path(hub_path)
        self.hub_path.mkdir(exist_ok=True)
        self.knowledge_index_path = self.hub_path / "knowledge_index.json"
        self.patterns_path = self.hub_path / "patterns"
        self.lessons_path = self.hub_path / "lessons"
        self.meta_insights_path = self.hub_path / "meta_insights"
        
        # Create subdirectories
        for path in [self.patterns_path, self.lessons_path, self.meta_insights_path]:
            path.mkdir(exist_ok=True)
        
        # Initialize knowledge index
        self.knowledge_index = self._load_knowledge_index()
    
    def _load_knowledge_index(self) -> Dict[str, Any]:
        """Load or create knowledge index"""
        if self.knowledge_index_path.exists():
            try:
                with open(self.knowledge_index_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"⚠️  Could not load knowledge index: {e}")
        
        return {
            "created_at": datetime.now().isoformat(),
            "last_updated": datetime.now().isoformat(),
            "total_entries": 0,
            "patterns": {},
            "lessons": {},
            "meta_insights": {},
            "execution_history": []
        }
    
    def _save_knowledge_index(self):
        """Save knowledge index to file"""
        self.knowledge_index["last_updated"] = datetime.now().isoformat()
        with open(self.knowledge_index_path, 'w', encoding='utf-8') as f:
            json.dump(self.knowledge_index, f, indent=2, ensure_ascii=False)
    
    def store_pattern(self, pattern_data: Dict[str, Any]) -> str:
        """Store a new pattern"""
        pattern_id = hashlib.md5(f"{pattern_data.get('type', '')}{datetime.now().isoformat()}".encode()).hexdigest()[:8]
        
        pattern_entry = {
            "id": pattern_id,
            "type": pattern_data.get("type", "unknown"),
            "category": pattern_data.get("category", "general"),
            "description": pattern_data.get("description", ""),
            "evidence": pattern_data.get("evidence", []),
            "success_rate": pattern_data.get("success_rate", 0.0),
            "frequency": pattern_data.get("frequency", 1),
            "first_seen": datetime.now().isoformat(),
            "last_seen": datetime.now().isoformat(),
            "context": pattern_data.get("context", {}),
            "tags": pattern_data.get("tags", [])
        }
        
        # Save pattern file
        pattern_file = self.patterns_path / f"{pattern_id}.json"
        with open(pattern_file, 'w', encoding='utf-8') as f:
            json.dump(pattern_entry, f, indent=2, ensure_ascii=False)
        
        # Update index
        self.knowledge_index["patterns"][pattern_id] = {
            "type": pattern_entry["type"],
            "category": pattern_entry["category"],
            "first_seen": pattern_entry["first_seen"],
            "last_seen": pattern_entry["last_seen"],
            "success_rate": pattern_entry["success_rate"],
            "frequency": pattern_entry["frequency"]
        }
        
        self.knowledge_index["total_entries"] += 1
        self._save_knowledge_index()
        
        return pattern_id
    
    def store_lesson(self, lesson_data: Dict[str, Any]) -> str:
        """Store a new lesson learned"""
        lesson_id = hashlib.md5(f"{lesson_data.get('lesson', '')}{datetime.now().isoformat()}".encode()).hexdigest()[:8]
        
        lesson_entry = {
            "id": lesson_id,
            "lesson": lesson_data.get("lesson", ""),
            "evidence": lesson_data.get("evidence", ""),
            "recommendation": lesson_data.get("recommendation", ""),
            "category": lesson_data.get("category", "general"),
            "impact": lesson_data.get("impact", "medium"),
            "confidence": lesson_data.get("confidence", 0.5),
            "created_at": datetime.now().isoformat(),
            "last_referenced": datetime.now().isoformat(),
            "reference_count": 1,
            "tags": lesson_data.get("tags", [])
        }
        
        # Save lesson file
        lesson_file = self.lessons_path / f"{lesson_id}.json"
        with open(lesson_file, 'w', encoding='utf-8') as f:
            json.dump(lesson_entry, f, indent=2, ensure_ascii=False)
        
        # Update index
        self.knowledge_index["lessons"][lesson_id] = {
            "lesson": lesson_entry["lesson"][:100] + "..." if len(lesson_entry["lesson"]) > 100 else lesson_entry["lesson"],
            "category": lesson_entry["category"],
            "impact": lesson_entry["impact"],
            "confidence": lesson_entry["confidence"],
            "created_at": lesson_entry["created_at"],
            "reference_count": lesson_entry["reference_count"]
        }
        
        self.knowledge_index["total_entries"] += 1
        self._save_knowledge_index()
        
        return lesson_id
    
    def store_meta_insight(self, insight_data: Dict[str, Any]) -> str:
        """Store a new meta-insight"""
        insight_id = hashlib.md5(f"{insight_data.get('insight', '')}{datetime.now().isoformat()}".encode()).hexdigest()[:8]
        
        insight_entry = {
            "id": insight_id,
            "insight": insight_data.get("insight", ""),
            "type": insight_data.get("type", "general"),
            "analysis_data": insight_data.get("analysis_data", {}),
            "confidence": insight_data.get("confidence", 0.5),
            "created_at": datetime.now().isoformat(),
            "last_updated": datetime.now().isoformat(),
            "tags": insight_data.get("tags", [])
        }
        
        # Save insight file
        insight_file = self.meta_insights_path / f"{insight_id}.json"
        with open(insight_file, 'w', encoding='utf-8') as f:
            json.dump(insight_entry, f, indent=2, ensure_ascii=False)
        
        # Update index
        self.knowledge_index["meta_insights"][insight_id] = {
            "insight": insight_entry["insight"][:100] + "..." if len(insight_entry["insight"]) > 100 else insight_entry["insight"],
            "type": insight_entry["type"],
            "confidence": insight_entry["confidence"],
            "created_at": insight_entry["created_at"]
        }
        
        self.knowledge_index["total_entries"] += 1
        self._save_knowledge_index()
        
        return insight_id
    
    def record_execution(self, execution_data: Dict[str, Any]):
        """Record framework execution for historical analysis"""
        execution_record = {
            "timestamp": datetime.now().isoformat(),
            "scaffold_id": execution_data.get("scaffold_id", "unknown"),
            "success": execution_data.get("success", False),
            "duration": execution_data.get("duration", 0),
            "frames_executed": execution_data.get("frames_executed", 0),
            "successful_frames": execution_data.get("successful_frames", 0),
            "failed_frames": execution_data.get("failed_frames", 0),
            "patterns_identified": execution_data.get("patterns_identified", 0),
            "lessons_learned": execution_data.get("lessons_learned", 0)
        }
        
        self.knowledge_index["execution_history"].append(execution_record)
        
        # Keep only last 1000 executions
        if len(self.knowledge_index["execution_history"]) > 1000:
            self.knowledge_index["execution_history"] = self.knowledge_index["execution_history"][-1000:]
        
        self._save_knowledge_index()
    
    def get_relevant_patterns(self, context: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Get patterns relevant to current context"""
        relevant_patterns = []
        
        for pattern_id, pattern_info in self.knowledge_index["patterns"].items():
            # Simple relevance scoring based on type and category matching
            relevance_score = 0
            
            if pattern_info["type"] in context.get("frame_types", []):
                relevance_score += 2
            
            if pattern_info["category"] in context.get("categories", []):
                relevance_score += 1
            
            if pattern_info["success_rate"] > 0.8:
                relevance_score += 1
            
            if relevance_score > 0:
                pattern_file = self.patterns_path / f"{pattern_id}.json"
                if pattern_file.exists():
                    try:
                        with open(pattern_file, 'r', encoding='utf-8') as f:
                            pattern_data = json.load(f)
                            pattern_data["relevance_score"] = relevance_score
                            relevant_patterns.append(pattern_data)
                    except Exception as e:
                        print(f"⚠️  Could not load pattern {pattern_id}: {e}")
        
        # Sort by relevance score
        relevant_patterns.sort(key=lambda x: x.get("relevance_score", 0), reverse=True)
        return relevant_patterns[:10]  # Return top 10
    
    def get_relevant_lessons(self, context: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Get lessons relevant to current context"""
        relevant_lessons = []
        
        for lesson_id, lesson_info in self.knowledge_index["lessons"].items():
            # Simple relevance scoring based on category and impact
            relevance_score = 0
            
            if lesson_info["category"] in context.get("categories", []):
                relevance_score += 2
            
            if lesson_info["impact"] in ["high", "critical"]:
                relevance_score += 1
            
            if lesson_info["confidence"] > 0.7:
                relevance_score += 1
            
            if relevance_score > 0:
                lesson_file = self.lessons_path / f"{lesson_id}.json"
                if lesson_file.exists():
                    try:
                        with open(lesson_file, 'r', encoding='utf-8') as f:
                            lesson_data = json.load(f)
                            lesson_data["relevance_score"] = relevance_score
                            relevant_lessons.append(lesson_data)
                    except Exception as e:
                        print(f"⚠️  Could not load lesson {lesson_id}: {e}")
        
        # Sort by relevance score
        relevant_lessons.sort(key=lambda x: x.get("relevance_score", 0), reverse=True)
        return relevant_lessons[:5]  # Return top 5

def run_knowledge_hub_update(context: Dict[str, Any] = None) -> Dict[str, Any]:
    """Main function to update knowledge hub with new insights"""
    
    if context is None:
        context = {}
    
    print("🧠 Running Knowledge Hub Update...")
    
    try:
        # Initialize knowledge hub
        hub = KnowledgeHub()
        
        # Extract patterns from context
        patterns_stored = []
        if "pattern_analysis" in context:
            pattern_analysis = context["pattern_analysis"]
            
            for pattern_type, patterns in pattern_analysis.items():
                if isinstance(patterns, list):
                    for pattern in patterns:
                        if isinstance(pattern, dict):
                            pattern_id = hub.store_pattern({
                                "type": pattern_type,
                                "category": pattern.get("type", "general"),
                                "description": f"{pattern_type} pattern identified",
                                "evidence": [pattern.get("context", "")],
                                "success_rate": 0.8,  # Default success rate
                                "frequency": 1,
                                "context": pattern,
                                "tags": [pattern_type, "auto_generated"]
                            })
                            patterns_stored.append(pattern_id)
        
        # Extract lessons from context
        lessons_stored = []
        if "lessons_learned" in context:
            for lesson in context["lessons_learned"]:
                if isinstance(lesson, dict):
                    lesson_id = hub.store_lesson({
                        "lesson": lesson.get("lesson", ""),
                        "evidence": lesson.get("evidence", ""),
                        "recommendation": lesson.get("recommendation", ""),
                        "category": "framework_improvement",
                        "impact": "high",
                        "confidence": 0.8,
                        "tags": ["auto_generated", "framework_improvement"]
                    })
                    lessons_stored.append(lesson_id)
        
        # Extract meta-insights from context
        insights_stored = []
        if "insights_summary" in context:
            insights = context["insights_summary"]
            insight_id = hub.store_meta_insight({
                "insight": f"Framework execution analysis: {insights.get('total_patterns_identified', 0)} patterns, {insights.get('cognitive_insights', 0)} cognitive, {insights.get('learning_insights', 0)} learning",
                "type": "execution_analysis",
                "analysis_data": insights,
                "confidence": 0.9,
                "tags": ["execution_analysis", "auto_generated"]
            })
            insights_stored.append(insight_id)
        
        # Record execution
        hub.record_execution({
            "scaffold_id": context.get("scaffold_id", "unknown"),
            "success": context.get("success", True),
            "duration": context.get("duration", 0),
            "frames_executed": context.get("frames_executed", 0),
            "successful_frames": context.get("successful_frames", 0),
            "failed_frames": context.get("failed_frames", 0),
            "patterns_identified": len(patterns_stored),
            "lessons_learned": len(lessons_stored)
        })
        
        # Generate summary
        summary = {
            "patterns_stored": len(patterns_stored),
            "lessons_stored": len(lessons_stored),
            "insights_stored": len(insights_stored),
            "total_entries": hub.knowledge_index["total_entries"],
            "execution_count": len(hub.knowledge_index["execution_history"])
        }
        
        result = {
            "success": True,
            "hub_updated": True,
            "summary": summary,
            "patterns_stored": patterns_stored,
            "lessons_stored": lessons_stored,
            "insights_stored": insights_stored,
            "knowledge_hub_path": str(hub.hub_path),
            "timestamp": datetime.now().isoformat()
        }
        
        # Save report
        report_path = f"reports/knowledge_hub_update_{int(datetime.now().timestamp())}.json"
        os.makedirs("reports", exist_ok=True)
        
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        
        print(f"📚 Knowledge hub updated: {summary['patterns_stored']} patterns, {summary['lessons_stored']} lessons, {summary['insights_stored']} insights")
        print(f"📄 Report saved: {report_path}")
        
        return result
        
    except Exception as e:
        error_result = {
            "success": False,
            "error": f"Knowledge hub update failed: {str(e)}",
            "traceback": traceback.format_exc(),
            "timestamp": datetime.now().isoformat()
        }
        
        print(f"❌ Error: {error_result['error']}")
        return error_result

if __name__ == "__main__":
    # Test the frame
    test_context = {
        "pattern_analysis": {
            "cognitive_patterns": [
                {"type": "systematic_retry", "context": "test context"}
            ]
        },
        "lessons_learned": [
            {"lesson": "Test lesson", "evidence": "Test evidence", "recommendation": "Test recommendation"}
        ],
        "insights_summary": {
            "total_patterns_identified": 5,
            "cognitive_insights": 2,
            "learning_insights": 3
        }
    }
    
    result = run_knowledge_hub_update(test_context)
    print(json.dumps(result, indent=2))
