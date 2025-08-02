from fastapi import Request, Response
from fastapi.middleware.base import BaseHTTPMiddleware
from fastapi.responses import JSONResponse
import time
import logging
from typing import Optional
from .security import get_security_headers, check_rate_limit, get_rate_limit_key

logger = logging.getLogger(__name__)

class SecurityMiddleware(BaseHTTPMiddleware):
    """Security middleware for adding security headers and rate limiting"""
    
    def __init__(self, app, redis_client=None):
        super().__init__(app)
        self.redis_client = redis_client
    
    async def dispatch(self, request: Request, call_next):
        # Add security headers to all responses
        response = await call_next(request)
        
        # Add security headers
        security_headers = get_security_headers()
        for header, value in security_headers.items():
            response.headers[header] = value
        
        return response

class RateLimitMiddleware(BaseHTTPMiddleware):
    """Rate limiting middleware"""
    
    def __init__(self, app, redis_client, max_requests: int = 100, window_seconds: int = 60):
        super().__init__(app)
        self.redis_client = redis_client
        self.max_requests = max_requests
        self.window_seconds = window_seconds
    
    async def dispatch(self, request: Request, call_next):
        # Get client identifier (IP address or user ID)
        client_id = self._get_client_id(request)
        
        # Check rate limit
        rate_limit_key = get_rate_limit_key(client_id, "api")
        
        if not check_rate_limit(
            self.redis_client, 
            rate_limit_key, 
            self.max_requests, 
            self.window_seconds
        ):
            return JSONResponse(
                status_code=429,
                content={"detail": "Rate limit exceeded. Please try again later."}
            )
        
        response = await call_next(request)
        return response
    
    def _get_client_id(self, request: Request) -> str:
        """Get client identifier for rate limiting"""
        # Try to get user ID from token if authenticated
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            # In a real implementation, you'd decode the JWT to get user ID
            # For now, use IP address
            return request.client.host
        
        # Fall back to IP address
        return request.client.host

class LoggingMiddleware(BaseHTTPMiddleware):
    """Request logging middleware"""
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Log request
        logger.info(f"Request: {request.method} {request.url.path} from {request.client.host}")
        
        response = await call_next(request)
        
        # Log response
        process_time = time.time() - start_time
        logger.info(f"Response: {response.status_code} in {process_time:.3f}s")
        
        # Add timing header
        response.headers["X-Process-Time"] = str(process_time)
        
        return response

class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    """Enhanced error handling middleware"""
    
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        except Exception as e:
            # Log the error
            logger.error(f"Unhandled error: {str(e)}", exc_info=True)
            
            # Return generic error response (don't leak information)
            return JSONResponse(
                status_code=500,
                content={"detail": "Internal server error"}
            )

class CSRFMiddleware(BaseHTTPMiddleware):
    """CSRF protection middleware"""
    
    def __init__(self, app, exclude_paths: Optional[list] = None):
        super().__init__(app)
        self.exclude_paths = exclude_paths or ["/health", "/docs", "/openapi.json"]
    
    async def dispatch(self, request: Request, call_next):
        # Skip CSRF check for excluded paths
        if request.url.path in self.exclude_paths:
            return await call_next(request)
        
        # Skip CSRF check for GET requests
        if request.method == "GET":
            return await call_next(request)
        
        # Check CSRF token for state-changing operations
        csrf_token = request.headers.get("X-CSRF-Token")
        if not csrf_token:
            return JSONResponse(
                status_code=403,
                content={"detail": "CSRF token required"}
            )
        
        # In a real implementation, you'd validate the CSRF token
        # For now, just check if it exists
        if not csrf_token.strip():
            return JSONResponse(
                status_code=403,
                content={"detail": "Invalid CSRF token"}
            )
        
        return await call_next(request)

class ContentTypeMiddleware(BaseHTTPMiddleware):
    """Content type validation middleware"""
    
    async def dispatch(self, request: Request, call_next):
        # Check content type for POST/PUT requests
        if request.method in ["POST", "PUT", "PATCH"]:
            content_type = request.headers.get("content-type", "")
            
            # Allow JSON and form data
            if not (content_type.startswith("application/json") or 
                   content_type.startswith("application/x-www-form-urlencoded") or
                   content_type.startswith("multipart/form-data")):
                return JSONResponse(
                    status_code=415,
                    content={"detail": "Unsupported content type"}
                )
        
        return await call_next(request) 