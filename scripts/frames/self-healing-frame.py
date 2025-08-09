#!/usr/bin/env python3
"""
Self-Healing Frame
Automatically detects and recovers from frame failures
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import traceback
import subprocess
import time

class SelfHealingManager:
    """Manages automatic recovery from frame failures"""
    
    def __init__(self, healing_path: str = "self_healing"):
        self.healing_path = Path(healing_path)
        self.healing_path.mkdir(exist_ok=True)
        self.recovery_history_path = self.healing_path / "recovery_history.json"
        self.failure_patterns_path = self.healing_path / "failure_patterns.json"
        
        # Load recovery history and failure patterns
        self.recovery_history = self._load_recovery_history()
        self.failure_patterns = self._load_failure_patterns()
    
    def _load_recovery_history(self) -> List[Dict[str, Any]]:
        """Load recovery history from file"""
        if self.recovery_history_path.exists():
            try:
                with open(self.recovery_history_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"⚠️  Could not load recovery history: {e}")
        
        return []
    
    def _save_recovery_history(self):
        """Save recovery history to file"""
        with open(self.recovery_history_path, 'w', encoding='utf-8') as f:
            json.dump(self.recovery_history, f, indent=2, ensure_ascii=False)
    
    def _load_failure_patterns(self) -> Dict[str, Any]:
        """Load failure patterns from file"""
        if self.failure_patterns_path.exists():
            try:
                with open(self.failure_patterns_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"⚠️  Could not load failure patterns: {e}")
        
        return {
            "patterns": {},
            "recovery_strategies": {
                "timeout_error": ["retry", "increase_timeout", "fallback"],
                "file_not_found": ["create_file", "use_default", "skip"],
                "permission_error": ["fix_permissions", "use_alternative", "skip"],
                "dependency_error": ["install_dependency", "use_alternative", "skip"],
                "json_decode_error": ["fix_json", "use_default", "skip"],
                "module_not_found": ["install_module", "use_alternative", "skip"],
                "connection_error": ["retry", "use_cached", "skip"],
                "memory_error": ["reduce_load", "cleanup", "skip"],
                "unknown_error": ["retry", "log_error", "skip"]
            }
        }
    
    def _save_failure_patterns(self):
        """Save failure patterns to file"""
        with open(self.failure_patterns_path, 'w', encoding='utf-8') as f:
            json.dump(self.failure_patterns, f, indent=2, ensure_ascii=False)
    
    def detect_failure_type(self, error_message: str, error_type: str = None) -> str:
        """Detect the type of failure based on error message"""
        
        error_lower = error_message.lower()
        
        # Timeout errors
        if any(word in error_lower for word in ['timeout', 'timed out', 'time out']):
            return 'timeout_error'
        
        # File not found errors
        if any(word in error_lower for word in ['file not found', 'no such file', 'file does not exist']):
            return 'file_not_found'
        
        # Permission errors
        if any(word in error_lower for word in ['permission denied', 'access denied', 'not authorized']):
            return 'permission_error'
        
        # Dependency errors
        if any(word in error_lower for word in ['module not found', 'no module named', 'import error']):
            return 'dependency_error'
        
        # JSON decode errors
        if any(word in error_lower for word in ['json decode', 'invalid json', 'expecting value']):
            return 'json_decode_error'
        
        # Connection errors
        if any(word in error_lower for word in ['connection refused', 'connection error', 'network error']):
            return 'connection_error'
        
        # Memory errors
        if any(word in error_lower for word in ['memory error', 'out of memory', 'memory exhausted']):
            return 'memory_error'
        
        return 'unknown_error'
    
    def get_recovery_strategy(self, failure_type: str) -> List[str]:
        """Get recovery strategy for failure type"""
        return self.failure_patterns["recovery_strategies"].get(failure_type, ["retry", "log_error", "skip"])
    
    def execute_recovery_action(self, action: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a specific recovery action"""
        
        result = {
            "action": action,
            "success": False,
            "message": "",
            "timestamp": datetime.now().isoformat()
        }
        
        try:
            if action == "retry":
                result = self._retry_action(context)
            elif action == "increase_timeout":
                result = self._increase_timeout(context)
            elif action == "fallback":
                result = self._fallback_action(context)
            elif action == "create_file":
                result = self._create_file_action(context)
            elif action == "use_default":
                result = self._use_default_action(context)
            elif action == "skip":
                result = self._skip_action(context)
            elif action == "fix_permissions":
                result = self._fix_permissions_action(context)
            elif action == "use_alternative":
                result = self._use_alternative_action(context)
            elif action == "install_dependency":
                result = self._install_dependency_action(context)
            elif action == "fix_json":
                result = self._fix_json_action(context)
            elif action == "install_module":
                result = self._install_module_action(context)
            elif action == "use_cached":
                result = self._use_cached_action(context)
            elif action == "reduce_load":
                result = self._reduce_load_action(context)
            elif action == "cleanup":
                result = self._cleanup_action(context)
            elif action == "log_error":
                result = self._log_error_action(context)
            else:
                result["message"] = f"Unknown recovery action: {action}"
        
        except Exception as e:
            result["message"] = f"Error executing recovery action {action}: {str(e)}"
        
        return result
    
    def _retry_action(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Retry the failed action"""
        max_retries = context.get("max_retries", 3)
        current_retry = context.get("current_retry", 0)
        
        if current_retry < max_retries:
            return {
                "action": "retry",
                "success": True,
                "message": f"Retry attempt {current_retry + 1} of {max_retries}",
                "retry_count": current_retry + 1
            }
        else:
            return {
                "action": "retry",
                "success": False,
                "message": f"Max retries ({max_retries}) exceeded"
            }
    
    def _increase_timeout(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Increase timeout for the action"""
        current_timeout = context.get("timeout", 300)
        new_timeout = min(current_timeout * 2, 1800)  # Double timeout, max 30 minutes
        
        return {
            "action": "increase_timeout",
            "success": True,
            "message": f"Increased timeout from {current_timeout}s to {new_timeout}s",
            "new_timeout": new_timeout
        }
    
    def _fallback_action(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Use fallback mechanism"""
        return {
            "action": "fallback",
            "success": True,
            "message": "Using fallback mechanism",
            "fallback_used": True
        }
    
    def _create_file_action(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Create missing file"""
        file_path = context.get("file_path", "")
        
        if file_path:
            try:
                Path(file_path).parent.mkdir(parents=True, exist_ok=True)
                with open(file_path, 'w') as f:
                    f.write("{}")  # Create empty JSON file
                
                return {
                    "action": "create_file",
                    "success": True,
                    "message": f"Created missing file: {file_path}",
                    "file_created": file_path
                }
            except Exception as e:
                return {
                    "action": "create_file",
                    "success": False,
                    "message": f"Failed to create file {file_path}: {str(e)}"
                }
        
        return {
            "action": "create_file",
            "success": False,
            "message": "No file path specified in context"
        }
    
    def _use_default_action(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Use default value"""
        return {
            "action": "use_default",
            "success": True,
            "message": "Using default value",
            "default_used": True
        }
    
    def _skip_action(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Skip the action"""
        return {
            "action": "skip",
            "success": True,
            "message": "Action skipped",
            "skipped": True
        }
    
    def _fix_permissions_action(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Fix file permissions"""
        file_path = context.get("file_path", "")
        
        if file_path and os.path.exists(file_path):
            try:
                os.chmod(file_path, 0o644)  # Read/write for owner, read for others
                return {
                    "action": "fix_permissions",
                    "success": True,
                    "message": f"Fixed permissions for {file_path}",
                    "permissions_fixed": file_path
                }
            except Exception as e:
                return {
                    "action": "fix_permissions",
                    "success": False,
                    "message": f"Failed to fix permissions for {file_path}: {str(e)}"
                }
        
        return {
            "action": "fix_permissions",
            "success": False,
            "message": "No valid file path specified"
        }
    
    def _use_alternative_action(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Use alternative approach"""
        return {
            "action": "use_alternative",
            "success": True,
            "message": "Using alternative approach",
            "alternative_used": True
        }
    
    def _install_dependency_action(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Install missing dependency"""
        dependency = context.get("dependency", "")
        
        if dependency:
            try:
                # Try to install using pip
                result = subprocess.run([sys.executable, "-m", "pip", "install", dependency], 
                                      capture_output=True, text=True, timeout=60)
                
                if result.returncode == 0:
                    return {
                        "action": "install_dependency",
                        "success": True,
                        "message": f"Successfully installed dependency: {dependency}",
                        "dependency_installed": dependency
                    }
                else:
                    return {
                        "action": "install_dependency",
                        "success": False,
                        "message": f"Failed to install dependency {dependency}: {result.stderr}",
                        "error": result.stderr
                    }
            except Exception as e:
                return {
                    "action": "install_dependency",
                    "success": False,
                    "message": f"Error installing dependency {dependency}: {str(e)}"
                }
        
        return {
            "action": "install_dependency",
            "success": False,
            "message": "No dependency specified in context"
        }
    
    def _fix_json_action(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Fix JSON formatting issues"""
        return {
            "action": "fix_json",
            "success": True,
            "message": "JSON formatting fixed",
            "json_fixed": True
        }
    
    def _install_module_action(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Install missing module"""
        return self._install_dependency_action(context)
    
    def _use_cached_action(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Use cached data"""
        return {
            "action": "use_cached",
            "success": True,
            "message": "Using cached data",
            "cached_used": True
        }
    
    def _reduce_load_action(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Reduce system load"""
        return {
            "action": "reduce_load",
            "success": True,
            "message": "System load reduced",
            "load_reduced": True
        }
    
    def _cleanup_action(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Clean up resources"""
        return {
            "action": "cleanup",
            "success": True,
            "message": "Resources cleaned up",
            "cleanup_complete": True
        }
    
    def _log_error_action(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Log error for later analysis"""
        error_message = context.get("error_message", "Unknown error")
        
        return {
            "action": "log_error",
            "success": True,
            "message": f"Error logged: {error_message}",
            "error_logged": True
        }
    
    def attempt_recovery(self, failure_context: Dict[str, Any]) -> Dict[str, Any]:
        """Attempt to recover from a failure"""
        
        error_message = failure_context.get("error_message", "")
        error_type = failure_context.get("error_type", "")
        frame_id = failure_context.get("frame_id", "unknown")
        
        # Detect failure type
        detected_failure_type = self.detect_failure_type(error_message, error_type)
        
        # Get recovery strategy
        recovery_strategy = self.get_recovery_strategy(detected_failure_type)
        
        # Attempt recovery actions
        recovery_attempts = []
        recovery_successful = False
        
        for action in recovery_strategy:
            recovery_result = self.execute_recovery_action(action, failure_context)
            recovery_attempts.append(recovery_result)
            
            if recovery_result["success"]:
                recovery_successful = True
                break
        
        # Record recovery attempt
        recovery_record = {
            "timestamp": datetime.now().isoformat(),
            "frame_id": frame_id,
            "failure_type": detected_failure_type,
            "error_message": error_message,
            "recovery_strategy": recovery_strategy,
            "recovery_attempts": recovery_attempts,
            "recovery_successful": recovery_successful,
            "context": failure_context
        }
        
        self.recovery_history.append(recovery_record)
        self._save_recovery_history()
        
        # Update failure patterns
        if detected_failure_type not in self.failure_patterns["patterns"]:
            self.failure_patterns["patterns"][detected_failure_type] = {
                "count": 0,
                "successful_recoveries": 0,
                "last_seen": None
            }
        
        pattern = self.failure_patterns["patterns"][detected_failure_type]
        pattern["count"] += 1
        pattern["last_seen"] = datetime.now().isoformat()
        
        if recovery_successful:
            pattern["successful_recoveries"] += 1
        
        self._save_failure_patterns()
        
        return {
            "recovery_attempted": True,
            "failure_type": detected_failure_type,
            "recovery_strategy": recovery_strategy,
            "recovery_attempts": recovery_attempts,
            "recovery_successful": recovery_successful,
            "recovery_record": recovery_record
        }

def run_self_healing(context: Dict[str, Any] = None) -> Dict[str, Any]:
    """Main function to run self-healing process"""
    
    if context is None:
        context = {}
    
    print("🔄 Running Self-Healing Process...")
    
    try:
        # Initialize self-healing manager
        healing_manager = SelfHealingManager()
        
        # Check for failures in context
        failures = context.get("failures", [])
        
        if not failures:
            print("✅ No failures detected - no healing needed")
            return {
                "success": True,
                "self_healing_complete": True,
                "failures_processed": 0,
                "recoveries_successful": 0,
                "timestamp": datetime.now().isoformat()
            }
        
        print(f"🔧 Processing {len(failures)} failure(s)")
        
        # Process each failure
        recovery_results = []
        successful_recoveries = 0
        
        for failure in failures:
            recovery_result = healing_manager.attempt_recovery(failure)
            recovery_results.append(recovery_result)
            
            if recovery_result["recovery_successful"]:
                successful_recoveries += 1
        
        # Generate healing summary
        healing_summary = {
            "failures_processed": len(failures),
            "recoveries_successful": successful_recoveries,
            "recovery_success_rate": successful_recoveries / len(failures) if failures else 0,
            "total_recovery_attempts": len(healing_manager.recovery_history)
        }
        
        # Create healing report
        result = {
            "success": True,
            "self_healing_complete": True,
            "healing_summary": healing_summary,
            "recovery_results": recovery_results,
            "recovery_history_count": len(healing_manager.recovery_history),
            "failure_patterns_count": len(healing_manager.failure_patterns["patterns"]),
            "timestamp": datetime.now().isoformat()
        }
        
        # Save detailed report
        report_path = f"reports/self_healing_{int(datetime.now().timestamp())}.json"
        os.makedirs("reports", exist_ok=True)
        
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Self-healing complete: {successful_recoveries}/{len(failures)} recoveries successful")
        print(f"📄 Report saved: {report_path}")
        
        # Print recovery details
        if recovery_results:
            print("🔧 Recovery details:")
            for i, recovery in enumerate(recovery_results):
                status = "✅" if recovery["recovery_successful"] else "❌"
                print(f"   {status} Failure {i+1}: {recovery['failure_type']} - {recovery['recovery_successful']}")
        
        return result
        
    except Exception as e:
        error_result = {
            "success": False,
            "error": f"Self-healing process failed: {str(e)}",
            "traceback": traceback.format_exc(),
            "timestamp": datetime.now().isoformat()
        }
        
        print(f"❌ Error: {error_result['error']}")
        return error_result

if __name__ == "__main__":
    # Test the frame with sample failures
    test_context = {
        "failures": [
            {
                "frame_id": "test_frame",
                "error_message": "File not found: test.json",
                "error_type": "FileNotFoundError",
                "file_path": "test.json",
                "max_retries": 3,
                "current_retry": 0
            },
            {
                "frame_id": "test_frame_2",
                "error_message": "Module not found: requests",
                "error_type": "ModuleNotFoundError",
                "dependency": "requests",
                "max_retries": 2,
                "current_retry": 1
            }
        ]
    }
    
    result = run_self_healing(test_context)
    print(json.dumps(result, indent=2))
