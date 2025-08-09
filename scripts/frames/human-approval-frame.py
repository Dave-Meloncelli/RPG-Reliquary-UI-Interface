#!/usr/bin/env python3
"""
Human Approval Frame
Provides human-in-the-loop approval for critical decisions and actions
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import traceback

class HumanApprovalManager:
    """Manages human approval workflow for critical decisions"""
    
    def __init__(self, approval_path: str = "approvals"):
        self.approval_path = Path(approval_path)
        self.approval_path.mkdir(exist_ok=True)
        self.pending_approvals_path = self.approval_path / "pending"
        self.approved_approvals_path = self.approval_path / "approved"
        self.rejected_approvals_path = self.approval_path / "rejected"
        
        # Create subdirectories
        for path in [self.pending_approvals_path, self.approved_approvals_path, self.rejected_approvals_path]:
            path.mkdir(exist_ok=True)
    
    def create_approval_request(self, request_data: Dict[str, Any]) -> str:
        """Create a new approval request"""
        
        request_id = f"approval_{int(datetime.now().timestamp())}"
        
        approval_request = {
            "id": request_id,
            "type": request_data.get("type", "general"),
            "title": request_data.get("title", "Approval Request"),
            "description": request_data.get("description", ""),
            "priority": request_data.get("priority", "medium"),
            "category": request_data.get("category", "general"),
            "requested_actions": request_data.get("requested_actions", []),
            "risks": request_data.get("risks", []),
            "benefits": request_data.get("benefits", []),
            "alternatives": request_data.get("alternatives", []),
            "context": request_data.get("context", {}),
            "created_at": datetime.now().isoformat(),
            "status": "pending",
            "approver": None,
            "approved_at": None,
            "rejected_at": None,
            "approval_notes": None,
            "auto_approval_threshold": request_data.get("auto_approval_threshold", 0.8),
            "confidence_score": request_data.get("confidence_score", 0.5)
        }
        
        # Save approval request
        request_file = self.pending_approvals_path / f"{request_id}.json"
        with open(request_file, 'w', encoding='utf-8') as f:
            json.dump(approval_request, f, indent=2, ensure_ascii=False)
        
        return request_id
    
    def get_pending_approvals(self) -> List[Dict[str, Any]]:
        """Get all pending approval requests"""
        pending_approvals = []
        
        for request_file in self.pending_approvals_path.glob("*.json"):
            try:
                with open(request_file, 'r', encoding='utf-8') as f:
                    approval_request = json.load(f)
                    pending_approvals.append(approval_request)
            except Exception as e:
                print(f"⚠️  Could not load approval request {request_file}: {e}")
        
        # Sort by priority and creation time
        priority_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
        pending_approvals.sort(key=lambda x: (priority_order.get(x.get("priority", "medium"), 2), x.get("created_at", "")))
        
        return pending_approvals
    
    def approve_request(self, request_id: str, approver: str = "human", notes: str = "") -> bool:
        """Approve a pending request"""
        
        request_file = self.pending_approvals_path / f"{request_id}.json"
        
        if not request_file.exists():
            print(f"❌ Approval request {request_id} not found")
            return False
        
        try:
            with open(request_file, 'r', encoding='utf-8') as f:
                approval_request = json.load(f)
            
            # Update approval status
            approval_request["status"] = "approved"
            approval_request["approver"] = approver
            approval_request["approved_at"] = datetime.now().isoformat()
            approval_request["approval_notes"] = notes
            
            # Move to approved directory
            approved_file = self.approved_approvals_path / f"{request_id}.json"
            with open(approved_file, 'w', encoding='utf-8') as f:
                json.dump(approval_request, f, indent=2, ensure_ascii=False)
            
            # Remove from pending
            request_file.unlink()
            
            print(f"✅ Approval request {request_id} approved by {approver}")
            return True
            
        except Exception as e:
            print(f"❌ Error approving request {request_id}: {e}")
            return False
    
    def reject_request(self, request_id: str, rejector: str = "human", notes: str = "") -> bool:
        """Reject a pending request"""
        
        request_file = self.pending_approvals_path / f"{request_id}.json"
        
        if not request_file.exists():
            print(f"❌ Approval request {request_id} not found")
            return False
        
        try:
            with open(request_file, 'r', encoding='utf-8') as f:
                approval_request = json.load(f)
            
            # Update rejection status
            approval_request["status"] = "rejected"
            approval_request["approver"] = rejector
            approval_request["rejected_at"] = datetime.now().isoformat()
            approval_request["approval_notes"] = notes
            
            # Move to rejected directory
            rejected_file = self.rejected_approvals_path / f"{request_id}.json"
            with open(rejected_file, 'w', encoding='utf-8') as f:
                json.dump(approval_request, f, indent=2, ensure_ascii=False)
            
            # Remove from pending
            request_file.unlink()
            
            print(f"❌ Approval request {request_id} rejected by {rejector}")
            return True
            
        except Exception as e:
            print(f"❌ Error rejecting request {request_id}: {e}")
            return False
    
    def auto_approve_if_safe(self, request_id: str) -> bool:
        """Auto-approve request if it meets safety criteria"""
        
        request_file = self.pending_approvals_path / f"{request_id}.json"
        
        if not request_file.exists():
            return False
        
        try:
            with open(request_file, 'r', encoding='utf-8') as f:
                approval_request = json.load(f)
            
            # Check if auto-approval is safe
            confidence_score = approval_request.get("confidence_score", 0)
            auto_threshold = approval_request.get("auto_approval_threshold", 0.8)
            priority = approval_request.get("priority", "medium")
            
            # Only auto-approve if confidence is high and priority is not critical
            if confidence_score >= auto_threshold and priority != "critical":
                return self.approve_request(request_id, "auto_approval", "Auto-approved based on high confidence score")
            
            return False
            
        except Exception as e:
            print(f"❌ Error in auto-approval for {request_id}: {e}")
            return False

def run_human_approval(context: Dict[str, Any] = None) -> Dict[str, Any]:
    """Main function to handle human approval workflow"""
    
    if context is None:
        context = {}
    
    print("👤 Running Human Approval Process...")
    
    try:
        # Initialize approval manager
        approval_manager = HumanApprovalManager()
        
        # Check for pending approvals
        pending_approvals = approval_manager.get_pending_approvals()
        
        if not pending_approvals:
            print("✅ No pending approvals found")
            return {
                "success": True,
                "human_approval_complete": True,
                "pending_approvals": 0,
                "auto_approved": 0,
                "requires_human_approval": 0,
                "timestamp": datetime.now().isoformat()
            }
        
        print(f"📋 Found {len(pending_approvals)} pending approval(s)")
        
        # Process each pending approval
        auto_approved = 0
        requires_human_approval = 0
        processed_approvals = []
        
        for approval in pending_approvals:
            request_id = approval["id"]
            
            # Try auto-approval first
            if approval_manager.auto_approve_if_safe(request_id):
                auto_approved += 1
                processed_approvals.append({
                    "id": request_id,
                    "action": "auto_approved",
                    "reason": "High confidence score"
                })
            else:
                requires_human_approval += 1
                processed_approvals.append({
                    "id": request_id,
                    "action": "requires_human_approval",
                    "reason": f"Priority: {approval['priority']}, Confidence: {approval.get('confidence_score', 0):.2f}"
                })
        
        # Generate approval summary
        approval_summary = {
            "total_pending": len(pending_approvals),
            "auto_approved": auto_approved,
            "requires_human_approval": requires_human_approval,
            "approval_rate": auto_approved / len(pending_approvals) if pending_approvals else 0
        }
        
        # Create approval report
        result = {
            "success": True,
            "human_approval_complete": True,
            "approval_summary": approval_summary,
            "processed_approvals": processed_approvals,
            "pending_approvals": pending_approvals,
            "timestamp": datetime.now().isoformat()
        }
        
        # Save detailed report
        report_path = f"reports/human_approval_{int(datetime.now().timestamp())}.json"
        os.makedirs("reports", exist_ok=True)
        
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Human approval process complete: {auto_approved} auto-approved, {requires_human_approval} require human review")
        print(f"📄 Report saved: {report_path}")
        
        # Print approval details
        if auto_approved > 0:
            print(f"🤖 Auto-approved {auto_approved} request(s) based on confidence scores")
        
        if requires_human_approval > 0:
            print(f"👤 {requires_human_approval} request(s) require human review:")
            for approval in pending_approvals:
                if approval["id"] not in [p["id"] for p in processed_approvals if p["action"] == "auto_approved"]:
                    print(f"   • {approval['title']} (Priority: {approval['priority']})")
        
        return result
        
    except Exception as e:
        error_result = {
            "success": False,
            "error": f"Human approval process failed: {str(e)}",
            "traceback": traceback.format_exc(),
            "timestamp": datetime.now().isoformat()
        }
        
        print(f"❌ Error: {error_result['error']}")
        return error_result

def create_sample_approval_request():
    """Create a sample approval request for testing"""
    
    approval_manager = HumanApprovalManager()
    
    # Create a sample approval request
    request_id = approval_manager.create_approval_request({
        "type": "framework_optimization",
        "title": "Implement Self-Healing Mechanisms",
        "description": "Add automatic recovery mechanisms for failed frames to improve framework resilience",
        "priority": "high",
        "category": "reliability",
        "requested_actions": [
            "Create SelfHealingFrame",
            "Integrate with FrameExecutor",
            "Add failure detection logic",
            "Implement recovery strategies"
        ],
        "risks": [
            "Potential false positives in failure detection",
            "Recovery actions might interfere with normal operation"
        ],
        "benefits": [
            "Improved framework reliability",
            "Reduced manual intervention",
            "Higher success rates"
        ],
        "alternatives": [
            "Manual recovery procedures",
            "Enhanced error reporting only"
        ],
        "confidence_score": 0.85,
        "auto_approval_threshold": 0.8
    })
    
    print(f"📝 Created sample approval request: {request_id}")
    return request_id

if __name__ == "__main__":
    # Test the frame
    print("🧪 Testing Human Approval Frame...")
    
    # Create a sample approval request
    sample_request_id = create_sample_approval_request()
    
    # Run the approval process
    result = run_human_approval()
    print(json.dumps(result, indent=2))
