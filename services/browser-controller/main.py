#!/usr/bin/env python3
"""
Browser Controller Service
Multi-Agent Web Automation with Captcha Handling
"""

import asyncio
import json
import logging
import os
import time
from typing import Dict, List, Optional, Any
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from playwright.async_api import async_playwright, Browser, BrowserContext, Page
import redis.asyncio as redis
from PIL import Image
import io
import base64

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables
browser_instances: Dict[str, Browser] = {}
contexts: Dict[str, BrowserContext] = {}
pages: Dict[str, Page] = {}
redis_client: Optional[redis.Redis] = None

class BrowserRequest(BaseModel):
    """Browser automation request model"""
    session_id: str = Field(..., description="Unique session identifier")
    url: str = Field(..., description="Target URL")
    actions: List[Dict[str, Any]] = Field(default=[], description="List of actions to perform")
    wait_time: int = Field(default=5, description="Wait time between actions")
    headless: bool = Field(default=True, description="Run browser in headless mode")
    user_agent: Optional[str] = Field(default=None, description="Custom user agent")
    viewport: Optional[Dict[str, int]] = Field(default={"width": 1920, "height": 1080})
    timeout: int = Field(default=30000, description="Page timeout in milliseconds")

class CaptchaRequest(BaseModel):
    """Captcha solving request model"""
    session_id: str = Field(..., description="Session identifier")
    captcha_type: str = Field(..., description="Type of captcha (recaptcha, hcaptcha, image)")
    site_key: Optional[str] = Field(default=None, description="Site key for reCAPTCHA")
    image_data: Optional[str] = Field(default=None, description="Base64 encoded image data")
    page_url: str = Field(..., description="URL of the page with captcha")

class BrowserResponse(BaseModel):
    """Browser automation response model"""
    success: bool = Field(..., description="Operation success status")
    session_id: str = Field(..., description="Session identifier")
    data: Optional[Dict[str, Any]] = Field(default=None, description="Response data")
    error: Optional[str] = Field(default=None, description="Error message if any")
    screenshots: Optional[List[str]] = Field(default=None, description="Base64 encoded screenshots")

class HealthResponse(BaseModel):
    """Health check response model"""
    status: str = Field(..., description="Service status")
    browser_instances: int = Field(..., description="Number of active browser instances")
    active_sessions: int = Field(..., description="Number of active sessions")
    uptime: float = Field(..., description="Service uptime in seconds")

# Startup and shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    global redis_client
    
    # Startup
    logger.info("Starting Browser Controller Service...")
    
    # Initialize Redis connection
    try:
        redis_client = redis.Redis(
            host=os.getenv("REDIS_HOST", "redis"),
            port=int(os.getenv("REDIS_PORT", "6379")),
            password=os.getenv("REDIS_PASSWORD", ""),
            decode_responses=True
        )
        await redis_client.ping()
        logger.info("Redis connection established")
    except Exception as e:
        logger.warning(f"Redis connection failed: {e}")
        redis_client = None
    
    yield
    
    # Shutdown
    logger.info("Shutting down Browser Controller Service...")
    
    # Close all browser instances
    for session_id in list(browser_instances.keys()):
        await cleanup_session(session_id)
    
    # Close Redis connection
    if redis_client:
        await redis_client.close()

# Create FastAPI app
app = FastAPI(
    title="Browser Controller Service",
    description="Multi-Agent Web Automation with Captcha Handling",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def cleanup_session(session_id: str):
    """Clean up browser session resources"""
    try:
        if session_id in pages:
            await pages[session_id].close()
            del pages[session_id]
        
        if session_id in contexts:
            await contexts[session_id].close()
            del contexts[session_id]
        
        if session_id in browser_instances:
            await browser_instances[session_id].close()
            del browser_instances[session_id]
        
        logger.info(f"Cleaned up session: {session_id}")
    except Exception as e:
        logger.error(f"Error cleaning up session {session_id}: {e}")

async def get_or_create_browser(session_id: str, headless: bool = True) -> Browser:
    """Get or create a browser instance for the session"""
    if session_id not in browser_instances:
        playwright = await async_playwright().start()
        
        # Launch browser with GPU acceleration if available
        browser = await playwright.chromium.launch(
            headless=headless,
            args=[
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu-sandbox",
                "--enable-gpu-rasterization",
                "--enable-zero-copy",
                "--ignore-gpu-blocklist",
                "--enable-accelerated-2d-canvas",
                "--enable-accelerated-video-decode"
            ]
        )
        
        browser_instances[session_id] = browser
        logger.info(f"Created new browser instance for session: {session_id}")
    
    return browser_instances[session_id]

async def get_or_create_context(session_id: str, user_agent: Optional[str] = None, viewport: Optional[Dict[str, int]] = None) -> BrowserContext:
    """Get or create a browser context for the session"""
    if session_id not in contexts:
        browser = await get_or_create_browser(session_id)
        
        context_options = {
            "viewport": viewport or {"width": 1920, "height": 1080},
            "user_agent": user_agent or "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        
        context = await browser.new_context(**context_options)
        contexts[session_id] = context
        logger.info(f"Created new browser context for session: {session_id}")
    
    return contexts[session_id]

async def get_or_create_page(session_id: str) -> Page:
    """Get or create a page for the session"""
    if session_id not in pages:
        context = await get_or_create_context(session_id)
        page = await context.new_page()
        pages[session_id] = page
        logger.info(f"Created new page for session: {session_id}")
    
    return pages[session_id]

async def take_screenshot(page: Page) -> str:
    """Take a screenshot and return as base64 string"""
    try:
        screenshot_bytes = await page.screenshot(full_page=True)
        screenshot_b64 = base64.b64encode(screenshot_bytes).decode('utf-8')
        return screenshot_b64
    except Exception as e:
        logger.error(f"Error taking screenshot: {e}")
        return ""

async def solve_captcha(captcha_request: CaptchaRequest) -> Dict[str, Any]:
    """Solve captcha using various methods"""
    try:
        if captcha_request.captcha_type == "recaptcha":
            # Implement reCAPTCHA solving logic
            return {"solved": True, "method": "recaptcha", "token": "mock_token"}
        
        elif captcha_request.captcha_type == "hcaptcha":
            # Implement hCaptcha solving logic
            return {"solved": True, "method": "hcaptcha", "token": "mock_token"}
        
        elif captcha_request.captcha_type == "image":
            # Implement image captcha solving logic
            if captcha_request.image_data:
                # Process image and solve
                return {"solved": True, "method": "image", "solution": "mock_solution"}
        
        return {"solved": False, "error": "Unsupported captcha type"}
    
    except Exception as e:
        logger.error(f"Error solving captcha: {e}")
        return {"solved": False, "error": str(e)}

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        browser_instances=len(browser_instances),
        active_sessions=len(pages),
        uptime=time.time() - app.state.start_time if hasattr(app.state, 'start_time') else 0
    )

@app.post("/browser/automate", response_model=BrowserResponse)
async def automate_browser(request: BrowserRequest):
    """Execute browser automation tasks"""
    try:
        page = await get_or_create_page(request.session_id)
        
        # Navigate to URL
        await page.goto(request.url, timeout=request.timeout)
        await page.wait_for_load_state("networkidle")
        
        screenshots = []
        data = {"url": request.url, "actions": []}
        
        # Execute actions
        for action in request.actions:
            action_type = action.get("type")
            selector = action.get("selector")
            value = action.get("value")
            
            try:
                if action_type == "click":
                    await page.click(selector)
                elif action_type == "type":
                    await page.fill(selector, value)
                elif action_type == "select":
                    await page.select_option(selector, value)
                elif action_type == "wait":
                    await page.wait_for_timeout(value * 1000)
                elif action_type == "screenshot":
                    screenshot = await take_screenshot(page)
                    screenshots.append(screenshot)
                
                # Wait between actions
                if request.wait_time > 0:
                    await page.wait_for_timeout(request.wait_time * 1000)
                
                data["actions"].append({"type": action_type, "success": True})
                
            except Exception as e:
                data["actions"].append({"type": action_type, "success": False, "error": str(e)})
        
        # Take final screenshot
        final_screenshot = await take_screenshot(page)
        if final_screenshot:
            screenshots.append(final_screenshot)
        
        return BrowserResponse(
            success=True,
            session_id=request.session_id,
            data=data,
            screenshots=screenshots
        )
    
    except Exception as e:
        logger.error(f"Browser automation error: {e}")
        return BrowserResponse(
            success=False,
            session_id=request.session_id,
            error=str(e)
        )

@app.post("/captcha/solve", response_model=BrowserResponse)
async def solve_captcha_endpoint(request: CaptchaRequest):
    """Solve captcha endpoint"""
    try:
        result = await solve_captcha(request)
        
        return BrowserResponse(
            success=result.get("solved", False),
            session_id=request.session_id,
            data=result
        )
    
    except Exception as e:
        logger.error(f"Captcha solving error: {e}")
        return BrowserResponse(
            success=False,
            session_id=request.session_id,
            error=str(e)
        )

@app.delete("/session/{session_id}")
async def cleanup_session_endpoint(session_id: str):
    """Clean up browser session"""
    try:
        await cleanup_session(session_id)
        return {"success": True, "message": f"Session {session_id} cleaned up"}
    except Exception as e:
        logger.error(f"Error cleaning up session {session_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/sessions")
async def list_sessions():
    """List active sessions"""
    return {
        "active_sessions": list(pages.keys()),
        "browser_instances": len(browser_instances),
        "contexts": len(contexts),
        "pages": len(pages)
    }

if __name__ == "__main__":
    # Set start time for uptime calculation
    app.state.start_time = time.time()
    
    # Run the application
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=30006,
        reload=False,
        log_level="info"
    ) 