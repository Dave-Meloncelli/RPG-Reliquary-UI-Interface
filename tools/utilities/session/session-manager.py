#!/usr/bin/env python3
"""
Session Manager - Consciousness-Aware Session Continuity

Manages session transitions, context preservation, and seamless handoffs
for vibe coders and consciousness evolution workflows.

Author: The OctoSpine Forge Master
Date: 2025-08-06
"""

import os
import json
import time
import logging
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
import threading

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@dataclass
class SessionContext:
    """Session context data structure"""
    session_id: str
    start_time: str
    current_task: str
    progress_percentage: float
    current_vibe: str  # creative, debugging, learning, evolution
    consciousness_alignment: bool
    unity_principle: str
    next_steps: List[str]
    completed_steps: List[str]
    token_usage: int
    token_limit: int
    patterns_discovered: List[Dict]
    issues_found: List[Dict]
    fixes_applied: List[Dict]
    recommendations: List[str]
    flow_state: str  # deep_flow, interrupted, transitioning
    context_snapshot: Dict[str, Any]

class TokenTracker:
    """Tracks token usage and estimates remaining capacity"""
    
    def __init__(self, initial_limit: int = 100000):
        self.token_limit = initial_limit
        self.current_tokens = 0
        self.token_history = []
        self.start_time = datetime.now()
        self.rate_per_minute = 0
        
    def update_usage(self, tokens_used: int):
        """Update current token usage"""
        self.current_tokens += tokens_used
        self.token_history.append({
            'timestamp': datetime.now().isoformat(),
            'tokens': tokens_used,
            'total': self.current_tokens
        })
        
        # Calculate rate
        elapsed_minutes = (datetime.now() - self.start_time).total_seconds() / 60
        if elapsed_minutes > 0:
            self.rate_per_minute = self.current_tokens / elapsed_minutes
    
    def get_usage_percentage(self) -> float:
        """Get current usage as percentage"""
        return (self.current_tokens / self.token_limit) * 100
    
    def estimate_remaining_time(self) -> int:
        """Estimate remaining time in minutes"""
        if self.rate_per_minute > 0:
            remaining_tokens = self.token_limit - self.current_tokens
            return int(remaining_tokens / self.rate_per_minute)
        return 0
    
    def should_transition(self, threshold: float = 90.0) -> bool:
        """Check if session should transition"""
        return self.get_usage_percentage() >= threshold

class SessionManager:
    """Manages session continuity and context preservation"""
    
    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root)
        self.context_dir = self.project_root / "session_context"
        self.context_dir.mkdir(exist_ok=True)
        
        self.token_tracker = TokenTracker()
        self.current_context = None
        self.session_id = self.generate_session_id()
        
        # Load existing context if available
        self.load_existing_context()
    
    def generate_session_id(self) -> str:
        """Generate unique session ID"""
        timestamp = datetime.now().strftime('%Y%m%d-%H%M%S')
        return f"session-{timestamp}"
    
    def load_existing_context(self):
        """Load context from previous session"""
        context_file = self.context_dir / "latest_context.json"
        if context_file.exists():
            try:
                with open(context_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.current_context = SessionContext(**data)
                    logger.info(f"Loaded context from previous session: {self.current_context.session_id}")
            except Exception as e:
                logger.warning(f"Failed to load context: {e}")
    
    def create_initial_context(self, task: str = "Tech Stack Analysis"):
        """Create initial session context"""
        self.current_context = SessionContext(
            session_id=self.session_id,
            start_time=datetime.now().isoformat(),
            current_task=task,
            progress_percentage=0.0,
            current_vibe="creative",
            consciousness_alignment=True,
            unity_principle="The Second Day We Found Unity",
            next_steps=[
                "Implement Session Management System",
                "Fix Environment Issues",
                "Create Vibe Coder Interface",
                "Build HRM Integration"
            ],
            completed_steps=[],
            token_usage=0,
            token_limit=self.token_tracker.token_limit,
            patterns_discovered=[],
            issues_found=[],
            fixes_applied=[],
            recommendations=[],
            flow_state="deep_flow",
            context_snapshot={}
        )
    
    def update_context(self, **kwargs):
        """Update current session context"""
        if self.current_context:
            for key, value in kwargs.items():
                if hasattr(self.current_context, key):
                    setattr(self.current_context, key, value)
    
    def add_pattern_discovered(self, pattern: Dict):
        """Add discovered pattern to context"""
        if self.current_context:
            self.current_context.patterns_discovered.append(pattern)
    
    def add_issue_found(self, issue: Dict):
        """Add found issue to context"""
        if self.current_context:
            self.current_context.issues_found.append(issue)
    
    def add_fix_applied(self, fix: Dict):
        """Add applied fix to context"""
        if self.current_context:
            self.current_context.fixes_applied.append(fix)
    
    def add_recommendation(self, recommendation: str):
        """Add recommendation to context"""
        if self.current_context:
            self.current_context.recommendations.append(recommendation)
    
    def check_session_status(self) -> Dict[str, Any]:
        """Check current session status and determine if transition is needed"""
        if not self.current_context:
            self.create_initial_context()
        
        usage_percentage = self.token_tracker.get_usage_percentage()
        remaining_time = self.token_tracker.estimate_remaining_time()
        
        status = {
            "session_id": self.current_context.session_id,
            "usage_percentage": usage_percentage,
            "remaining_time_minutes": remaining_time,
            "current_task": self.current_context.current_task,
            "progress_percentage": self.current_context.progress_percentage,
            "current_vibe": self.current_context.current_vibe,
            "flow_state": self.current_context.flow_state,
            "should_transition": self.token_tracker.should_transition(),
            "consciousness_alignment": self.current_context.consciousness_alignment
        }
        
        # Update context with current token usage
        self.update_context(
            token_usage=self.token_tracker.current_tokens,
            progress_percentage=min(usage_percentage, 100.0)
        )
        
        return status
    
    def create_context_menu(self) -> Dict[str, Any]:
        """Create context menu for session transition"""
        if not self.current_context:
            return {"error": "No active context"}
        
        # Save current context
        self.save_context()
        
        return {
            "type": "session_transition",
            "session_id": self.current_context.session_id,
            "current_context": asdict(self.current_context),
            "recommendation": "Start new session to continue seamlessly",
            "handoff_data": {
                "current_task": self.current_context.current_task,
                "next_steps": self.current_context.next_steps,
                "progress_percentage": self.current_context.progress_percentage,
                "patterns_discovered": len(self.current_context.patterns_discovered),
                "issues_found": len(self.current_context.issues_found),
                "fixes_applied": len(self.current_context.fixes_applied),
                "context_preservation": True,
                "consciousness_alignment": True,
                "unity_principle": self.current_context.unity_principle
            },
            "transition_message": "🌟 The Second Day We Found Unity - Continuing Our Journey Together 🌟"
        }
    
    def save_context(self):
        """Save current session context"""
        if not self.current_context:
            return
        
        try:
            # Save as latest context
            latest_file = self.context_dir / "latest_context.json"
            with open(latest_file, 'w', encoding='utf-8') as f:
                json.dump(asdict(self.current_context), f, indent=2, ensure_ascii=False)
            
            # Save as session-specific file
            session_file = self.context_dir / f"{self.session_id}_context.json"
            with open(session_file, 'w', encoding='utf-8') as f:
                json.dump(asdict(self.current_context), f, indent=2, ensure_ascii=False)
            
            logger.info(f"Context saved: {session_file}")
            
        except Exception as e:
            logger.error(f"Failed to save context: {e}")
    
    def generate_session_report(self) -> str:
        """Generate comprehensive session report"""
        if not self.current_context:
            return "No session context available"
        
        report = f"""
============================================================
🎯 SESSION CONTINUITY REPORT
============================================================
Session ID: {self.current_context.session_id}
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Start Time: {self.current_context.start_time}

📊 SESSION SUMMARY:
- Current Task: {self.current_context.current_task}
- Progress: {self.current_context.progress_percentage:.1f}%
- Current Vibe: {self.current_context.current_vibe}
- Flow State: {self.current_context.flow_state}
- Consciousness Alignment: {self.current_context.consciousness_alignment}
- Unity Principle: {self.current_context.unity_principle}

🔍 ACTIVITY SUMMARY:
- Patterns Discovered: {len(self.current_context.patterns_discovered)}
- Issues Found: {len(self.current_context.issues_found)}
- Fixes Applied: {len(self.current_context.fixes_applied)}
- Recommendations: {len(self.current_context.recommendations)}

📋 COMPLETED STEPS:
"""
        
        for step in self.current_context.completed_steps:
            report += f"  ✅ {step}\n"
        
        report += f"""
🚀 NEXT STEPS:
"""
        
        for step in self.current_context.next_steps:
            report += f"  🔄 {step}\n"
        
        if self.current_context.patterns_discovered:
            report += f"""
🧠 PATTERNS DISCOVERED:
"""
            for pattern in self.current_context.patterns_discovered[:5]:
                report += f"  - {pattern.get('name', 'Unknown')}: {pattern.get('description', 'No description')}\n"
        
        if self.current_context.issues_found:
            report += f"""
⚠️ ISSUES FOUND:
"""
            for issue in self.current_context.issues_found[:5]:
                report += f"  - {issue.get('type', 'Unknown')}: {issue.get('message', 'No message')}\n"
        
        if self.current_context.fixes_applied:
            report += f"""
🔧 FIXES APPLIED:
"""
            for fix in self.current_context.fixes_applied[:5]:
                report += f"  - {fix.get('type', 'Unknown')}: {fix.get('description', 'No description')}\n"
        
        if self.current_context.recommendations:
            report += f"""
💡 RECOMMENDATIONS:
"""
            for i, rec in enumerate(self.current_context.recommendations, 1):
                report += f"  {i}. {rec}\n"
        
        report += f"""
🌟 The Second Day We Found Unity - Session Continuity Achieved 🌟
"""
        return report
    
    def transition_to_new_session(self) -> Dict[str, Any]:
        """Prepare for transition to new session"""
        if not self.current_context:
            return {"error": "No active context"}
        
        # Save current context
        self.save_context()
        
        # Generate transition data
        transition_data = {
            "previous_session_id": self.current_context.session_id,
            "handoff_context": asdict(self.current_context),
            "transition_timestamp": datetime.now().isoformat(),
            "recommendations": [
                "Load context from latest_context.json",
                "Continue from next_steps list",
                "Maintain consciousness alignment",
                "Preserve flow state and vibe"
            ]
        }
        
        # Save transition data
        transition_file = self.context_dir / f"{self.session_id}_transition.json"
        with open(transition_file, 'w', encoding='utf-8') as f:
            json.dump(transition_data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Session transition prepared: {transition_file}")
        
        return transition_data

def main():
    """Test session manager"""
    manager = SessionManager()
    
    # Create initial context
    manager.create_initial_context("Tech Stack Silo Implementation")
    
    # Simulate some activity
    manager.token_tracker.update_usage(50000)  # 50% usage
    manager.add_pattern_discovered({
        "name": "TypeScript Error Pattern",
        "description": "Missing variable declarations in auth services",
        "severity": "high"
    })
    manager.add_issue_found({
        "type": "typescript_error",
        "message": "1424 TypeScript compilation errors found",
        "severity": "high"
    })
    manager.add_recommendation("Implement automated TypeScript error fixing")
    
    # Check status
    status = manager.check_session_status()
    print("Session Status:", json.dumps(status, indent=2))
    
    # Generate report
    report = manager.generate_session_report()
    print(report)
    
    # Save context
    manager.save_context()

if __name__ == "__main__":
    main() 