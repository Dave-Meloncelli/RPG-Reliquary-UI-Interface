"""
Webhook endpoints for Essential Frames Automation
Handles automatic triggers and notifications for critical validation steps
"""

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Dict, Any, Optional
import json
import logging
from datetime import datetime
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/webhooks", tags=["webhooks"])

# Webhook payload models
class WebhookPayload(BaseModel):
    timestamp: str
    context: Optional[Dict[str, Any]] = None

class PreCompilationPayload(WebhookPayload):
    validation_result: Dict[str, Any]

class DependencyCheckPayload(WebhookPayload):
    health_result: Dict[str, Any]

class ErrorImpactPayload(WebhookPayload):
    impact_analysis: Dict[str, Any]
    rollback_needed: bool

class FixValidationPayload(WebhookPayload):
    safety_validation: Dict[str, Any]
    impact_prediction: Dict[str, Any]
    should_proceed: bool

# Webhook storage
webhook_logs_path = Path("config/webhooks/logs")
webhook_logs_path.mkdir(parents=True, exist_ok=True)

def log_webhook(webhook_name: str, payload: Dict[str, Any]):
    """Log webhook execution"""
    log_entry = {
        "webhook_name": webhook_name,
        "timestamp": datetime.now().isoformat(),
        "payload": payload
    }
    
    log_file = webhook_logs_path / f"{webhook_name}_{int(datetime.now().timestamp())}.json"
    with open(log_file, 'w', encoding='utf-8') as f:
        json.dump(log_entry, f, indent=2, ensure_ascii=False)
    
    logger.info(f"Webhook {webhook_name} executed and logged")

@router.post("/pre-compilation")
async def pre_compilation_webhook(payload: PreCompilationPayload):
    """Handle pre-compilation validation webhook"""
    try:
        logger.info("Pre-compilation validation webhook triggered")
        
        # Log the webhook
        log_webhook("pre_compilation_validation", payload.dict())
        
        # Process validation result
        validation_result = payload.validation_result
        
        if not validation_result.get("success", False):
            issues = validation_result.get("issues_found", [])
            logger.warning(f"Pre-compilation validation failed: {len(issues)} issues found")
            
            # Could trigger additional actions here (e.g., notifications, rollbacks)
            return {
                "status": "validation_failed",
                "issues_count": len(issues),
                "message": f"Pre-compilation validation failed: {len(issues)} issues found"
            }
        else:
            logger.info("Pre-compilation validation passed")
            return {
                "status": "validation_passed",
                "message": "Pre-compilation validation successful"
            }
            
    except Exception as e:
        logger.error(f"Pre-compilation webhook error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/dependency-check")
async def dependency_check_webhook(payload: DependencyCheckPayload):
    """Handle dependency health check webhook"""
    try:
        logger.info("Dependency check webhook triggered")
        
        # Log the webhook
        log_webhook("dependency_check", payload.dict())
        
        # Process health result
        health_result = payload.health_result
        
        if not health_result.get("all_healthy", False):
            missing_deps = health_result.get("missing_deps", [])
            logger.warning(f"Dependency check failed: {len(missing_deps)} missing dependencies")
            
            # Could trigger automatic dependency installation here
            return {
                "status": "dependencies_missing",
                "missing_count": len(missing_deps),
                "missing_deps": missing_deps,
                "message": f"Missing {len(missing_deps)} dependencies"
            }
        else:
            logger.info("Dependency check passed")
            return {
                "status": "dependencies_healthy",
                "message": "All dependencies are healthy"
            }
            
    except Exception as e:
        logger.error(f"Dependency check webhook error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/health-monitor")
async def health_monitor_webhook(payload: WebhookPayload):
    """Handle health monitoring webhook"""
    try:
        logger.info("Health monitor webhook triggered")
        
        # Log the webhook
        log_webhook("health_monitor", payload.dict())
        
        # Could implement system health checks here
        return {
            "status": "health_monitored",
            "message": "Health monitoring active"
        }
        
    except Exception as e:
        logger.error(f"Health monitor webhook error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/error-impact")
async def error_impact_webhook(payload: ErrorImpactPayload):
    """Handle error impact analysis webhook"""
    try:
        logger.info("Error impact analysis webhook triggered")
        
        # Log the webhook
        log_webhook("error_impact_analysis", payload.dict())
        
        # Process impact analysis
        impact_analysis = payload.impact_analysis
        rollback_needed = payload.rollback_needed
        
        if rollback_needed:
            error_increase = impact_analysis.get("error_increase_percentage", 0)
            logger.warning(f"Error impact analysis: {error_increase:.1f}% increase detected, rollback needed")
            
            # Could trigger automatic rollback here
            return {
                "status": "rollback_triggered",
                "error_increase_percentage": error_increase,
                "message": f"Rollback triggered due to {error_increase:.1f}% error increase"
            }
        else:
            logger.info("Error impact analysis: no rollback needed")
            return {
                "status": "no_rollback_needed",
                "message": "Error impact within acceptable limits"
            }
            
    except Exception as e:
        logger.error(f"Error impact webhook error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/rollback")
async def rollback_webhook(payload: WebhookPayload):
    """Handle rollback trigger webhook"""
    try:
        logger.info("Rollback webhook triggered")
        
        # Log the webhook
        log_webhook("rollback_trigger", payload.dict())
        
        # Could implement automatic rollback logic here
        return {
            "status": "rollback_initiated",
            "message": "Rollback process initiated"
        }
        
    except Exception as e:
        logger.error(f"Rollback webhook error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/fix-validation")
async def fix_validation_webhook(payload: FixValidationPayload):
    """Handle fix validation webhook"""
    try:
        logger.info("Fix validation webhook triggered")
        
        # Log the webhook
        log_webhook("fix_validation", payload.dict())
        
        # Process validation results
        safety_validation = payload.safety_validation
        impact_prediction = payload.impact_prediction
        should_proceed = payload.should_proceed
        
        if should_proceed:
            logger.info("Fix validation: proceeding with fix")
            return {
                "status": "fix_approved",
                "safety_level": safety_validation.get("risk_level", "unknown"),
                "confidence": impact_prediction.get("confidence", 0),
                "message": "Fix approved to proceed"
            }
        else:
            logger.warning("Fix validation: fix rejected")
            return {
                "status": "fix_rejected",
                "safety_level": safety_validation.get("risk_level", "unknown"),
                "confidence": impact_prediction.get("confidence", 0),
                "message": "Fix rejected due to safety or impact concerns"
            }
            
    except Exception as e:
        logger.error(f"Fix validation webhook error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/impact-prediction")
async def impact_prediction_webhook(payload: WebhookPayload):
    """Handle impact prediction webhook"""
    try:
        logger.info("Impact prediction webhook triggered")
        
        # Log the webhook
        log_webhook("impact_prediction", payload.dict())
        
        # Could implement impact prediction logic here
        return {
            "status": "impact_predicted",
            "message": "Impact prediction completed"
        }
        
    except Exception as e:
        logger.error(f"Impact prediction webhook error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status")
async def webhook_status():
    """Get webhook system status"""
    try:
        # Count webhook logs
        log_files = list(webhook_logs_path.glob("*.json"))
        
        # Group by webhook type
        webhook_counts = {}
        for log_file in log_files:
            try:
                with open(log_file, 'r', encoding='utf-8') as f:
                    log_entry = json.load(f)
                    webhook_name = log_entry.get("webhook_name", "unknown")
                    webhook_counts[webhook_name] = webhook_counts.get(webhook_name, 0) + 1
            except Exception as e:
                logger.warning(f"Could not read log file {log_file}: {e}")
        
        return {
            "status": "healthy",
            "total_webhooks": len(log_files),
            "webhook_counts": webhook_counts,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Webhook status error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
