import bcrypt
import re
import secrets
import string
from typing import Optional, Tuple
from datetime import datetime, timedelta
import jwt
from fastapi import HTTPException, status
from pydantic import BaseModel, validator, EmailStr
import logging

logger = logging.getLogger(__name__)

# Security configuration
PASSWORD_MIN_LENGTH = 8
PASSWORD_REQUIRE_UPPERCASE = True
PASSWORD_REQUIRE_LOWERCASE = True
PASSWORD_REQUIRE_DIGITS = True
PASSWORD_REQUIRE_SPECIAL = True
MAX_LOGIN_ATTEMPTS = 5
LOCKOUT_DURATION_MINUTES = 15
TOKEN_BLACKLIST_TTL = 24 * 60 * 60  # 24 hours

class PasswordValidationError(Exception):
    pass

class SecurityConfig:
    """Security configuration and utilities"""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password using bcrypt with salt"""
        salt = bcrypt.gensalt(rounds=12)
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    @staticmethod
    def verify_password(password: str, hashed_password: str) -> bool:
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
    
    @staticmethod
    def validate_password_strength(password: str) -> Tuple[bool, str]:
        """Validate password strength requirements"""
        if len(password) < PASSWORD_MIN_LENGTH:
            return False, f"Password must be at least {PASSWORD_MIN_LENGTH} characters long"
        
        if PASSWORD_REQUIRE_UPPERCASE and not re.search(r'[A-Z]', password):
            return False, "Password must contain at least one uppercase letter"
        
        if PASSWORD_REQUIRE_LOWERCASE and not re.search(r'[a-z]', password):
            return False, "Password must contain at least one lowercase letter"
        
        if PASSWORD_REQUIRE_DIGITS and not re.search(r'\d', password):
            return False, "Password must contain at least one digit"
        
        if PASSWORD_REQUIRE_SPECIAL and not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            return False, "Password must contain at least one special character"
        
        return True, "Password meets strength requirements"
    
    @staticmethod
    def generate_secure_token(length: int = 32) -> str:
        """Generate a cryptographically secure token"""
        alphabet = string.ascii_letters + string.digits
        return ''.join(secrets.choice(alphabet) for _ in range(length))
    
    @staticmethod
    def sanitize_input(input_str: str) -> str:
        """Basic input sanitization to prevent XSS"""
        if not input_str:
            return input_str
        
        # Remove potentially dangerous characters
        dangerous_chars = ['<', '>', '"', "'", '&', 'javascript:', 'onload', 'onerror']
        sanitized = input_str
        for char in dangerous_chars:
            sanitized = sanitized.replace(char, '')
        
        return sanitized.strip()
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None

class PasswordResetManager:
    """Manage password reset functionality"""
    
    def __init__(self, redis_client):
        self.redis_client = redis_client
    
    def generate_reset_token(self, user_id: int) -> str:
        """Generate a password reset token"""
        token = SecurityConfig.generate_secure_token(32)
        # Store token with 1-hour expiration
        self.redis_client.setex(f"reset_token:{token}", 3600, str(user_id))
        return token
    
    def validate_reset_token(self, token: str) -> Optional[int]:
        """Validate and return user_id for reset token"""
        user_id = self.redis_client.get(f"reset_token:{token}")
        if user_id:
            return int(user_id)
        return None
    
    def invalidate_reset_token(self, token: str):
        """Invalidate a reset token"""
        self.redis_client.delete(f"reset_token:{token}")

class AccountLockoutManager:
    """Manage account lockout functionality"""
    
    def __init__(self, redis_client):
        self.redis_client = redis_client
    
    def record_failed_login(self, username: str) -> bool:
        """Record a failed login attempt and check if account should be locked"""
        key = f"failed_logins:{username}"
        failed_attempts = self.redis_client.incr(key)
        
        # Set expiration for the counter
        if failed_attempts == 1:
            self.redis_client.expire(key, LOCKOUT_DURATION_MINUTES * 60)
        
        return failed_attempts >= MAX_LOGIN_ATTEMPTS
    
    def is_account_locked(self, username: str) -> bool:
        """Check if account is currently locked"""
        key = f"failed_logins:{username}"
        failed_attempts = self.redis_client.get(key)
        return failed_attempts and int(failed_attempts) >= MAX_LOGIN_ATTEMPTS
    
    def reset_failed_attempts(self, username: str):
        """Reset failed login attempts on successful login"""
        key = f"failed_logins:{username}"
        self.redis_client.delete(key)

class TokenBlacklistManager:
    """Manage JWT token blacklisting"""
    
    def __init__(self, redis_client):
        self.redis_client = redis_client
    
    def blacklist_token(self, token: str, expires_at: datetime):
        """Add token to blacklist"""
        ttl = int((expires_at - datetime.utcnow()).total_seconds())
        if ttl > 0:
            self.redis_client.setex(f"blacklist:{token}", ttl, "1")
    
    def is_token_blacklisted(self, token: str) -> bool:
        """Check if token is blacklisted"""
        return bool(self.redis_client.exists(f"blacklist:{token}"))

# Pydantic models with enhanced validation
class SecureUserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    
    @validator('username')
    def validate_username(cls, v):
        if len(v) < 3:
            raise ValueError('Username must be at least 3 characters long')
        if not re.match(r'^[a-zA-Z0-9_]+$', v):
            raise ValueError('Username can only contain letters, numbers, and underscores')
        return SecurityConfig.sanitize_input(v)
    
    @validator('password')
    def validate_password(cls, v):
        is_valid, message = SecurityConfig.validate_password_strength(v)
        if not is_valid:
            raise ValueError(message)
        return v

class SecureUserLogin(BaseModel):
    username: str
    password: str
    
    @validator('username')
    def validate_username(cls, v):
        return SecurityConfig.sanitize_input(v)

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str
    
    @validator('new_password')
    def validate_new_password(cls, v):
        is_valid, message = SecurityConfig.validate_password_strength(v)
        if not is_valid:
            raise ValueError(message)
        return v

# Security middleware functions
def get_security_headers() -> dict:
    """Get security headers for responses"""
    return {
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
        "X-XSS-Protection": "1; mode=block",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
        "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "geolocation=(), microphone=(), camera=()"
    }

def validate_csrf_token(token: str, session_token: str) -> bool:
    """Validate CSRF token"""
    return token == session_token

def generate_csrf_token() -> str:
    """Generate CSRF token"""
    return SecurityConfig.generate_secure_token(32)

# Rate limiting utilities
def get_rate_limit_key(identifier: str, action: str) -> str:
    """Generate rate limit key"""
    return f"rate_limit:{action}:{identifier}"

def check_rate_limit(redis_client, key: str, max_requests: int, window_seconds: int) -> bool:
    """Check if rate limit is exceeded"""
    current = redis_client.get(key)
    if current and int(current) >= max_requests:
        return False
    
    redis_client.incr(key)
    redis_client.expire(key, window_seconds)
    return True 