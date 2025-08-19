"""
Authentication and Security Module for Advanced LEO Search Tool
Provides JWT authentication, role-based access control, and security features
"""

import jwt
import bcrypt
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Union
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
import logging
import hashlib
import secrets
from enum import Enum

logger = logging.getLogger(__name__)

# Security configuration
SECRET_KEY = "your-secret-key-here"  # In production, use environment variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Security scheme
security = HTTPBearer()

# Enums
class UserRole(str, Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    AGENT = "agent"
    VIEWER = "viewer"

class Permission(str, Enum):
    # Search permissions
    SEARCH_PERSON = "search_person"
    SEARCH_BUSINESS = "search_business"
    SEARCH_CRIMINAL = "search_criminal"
    SEARCH_PROPERTY = "search_property"
    ADVANCED_SEARCH = "advanced_search"
    
    # Data source permissions
    ACCESS_COURT_RECORDS = "access_court_records"
    ACCESS_CRIMINAL_RECORDS = "access_criminal_records"
    ACCESS_PROPERTY_RECORDS = "access_property_records"
    ACCESS_BUSINESS_RECORDS = "access_business_records"
    ACCESS_SOCIAL_MEDIA = "access_social_media"
    ACCESS_FINANCIAL_RECORDS = "access_financial_records"
    
    # System permissions
    VIEW_AUDIT_LOGS = "view_audit_logs"
    MANAGE_USERS = "manage_users"
    VIEW_STATISTICS = "view_statistics"
    SYSTEM_ADMIN = "system_admin"

# Models
class User(BaseModel):
    """User model with authentication and authorization"""
    id: str
    username: str
    email: str
    full_name: str
    role: UserRole
    permissions: List[Permission]
    is_active: bool = True
    created_at: datetime
    last_login: Optional[datetime] = None
    failed_login_attempts: int = 0
    locked_until: Optional[datetime] = None
    
    class Config:
        use_enum_values = True

class UserCreate(BaseModel):
    """User creation model"""
    username: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., pattern=r"^[^@]+@[^@]+\.[^@]+$")
    full_name: str = Field(..., min_length=1, max_length=100)
    password: str = Field(..., min_length=8)
    role: UserRole = UserRole.AGENT
    permissions: Optional[List[Permission]] = []

class UserLogin(BaseModel):
    """User login model"""
    username: str
    password: str
    remember_me: bool = False

class Token(BaseModel):
    """JWT token model"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user_id: str
    username: str
    role: UserRole

class TokenData(BaseModel):
    """Token payload data"""
    user_id: Optional[str] = None
    username: Optional[str] = None
    role: Optional[UserRole] = None
    permissions: Optional[List[Permission]] = []

# Role-based permission mapping
ROLE_PERMISSIONS = {
    UserRole.ADMIN: [
        Permission.SEARCH_PERSON, Permission.SEARCH_BUSINESS, Permission.SEARCH_CRIMINAL,
        Permission.SEARCH_PROPERTY, Permission.ADVANCED_SEARCH,
        Permission.ACCESS_COURT_RECORDS, Permission.ACCESS_CRIMINAL_RECORDS,
        Permission.ACCESS_PROPERTY_RECORDS, Permission.ACCESS_BUSINESS_RECORDS,
        Permission.ACCESS_SOCIAL_MEDIA, Permission.ACCESS_FINANCIAL_RECORDS,
        Permission.VIEW_AUDIT_LOGS, Permission.MANAGE_USERS,
        Permission.VIEW_STATISTICS, Permission.SYSTEM_ADMIN
    ],
    UserRole.MANAGER: [
        Permission.SEARCH_PERSON, Permission.SEARCH_BUSINESS, Permission.SEARCH_CRIMINAL,
        Permission.SEARCH_PROPERTY, Permission.ADVANCED_SEARCH,
        Permission.ACCESS_COURT_RECORDS, Permission.ACCESS_CRIMINAL_RECORDS,
        Permission.ACCESS_PROPERTY_RECORDS, Permission.ACCESS_BUSINESS_RECORDS,
        Permission.ACCESS_SOCIAL_MEDIA, Permission.ACCESS_FINANCIAL_RECORDS,
        Permission.VIEW_AUDIT_LOGS, Permission.VIEW_STATISTICS
    ],
    UserRole.AGENT: [
        Permission.SEARCH_PERSON, Permission.SEARCH_BUSINESS, Permission.SEARCH_CRIMINAL,
        Permission.SEARCH_PROPERTY, Permission.ADVANCED_SEARCH,
        Permission.ACCESS_COURT_RECORDS, Permission.ACCESS_CRIMINAL_RECORDS,
        Permission.ACCESS_PROPERTY_RECORDS, Permission.ACCESS_BUSINESS_RECORDS,
        Permission.ACCESS_SOCIAL_MEDIA, Permission.ACCESS_FINANCIAL_RECORDS
    ],
    UserRole.VIEWER: [
        Permission.SEARCH_PERSON, Permission.SEARCH_BUSINESS,
        Permission.ACCESS_PROPERTY_RECORDS, Permission.ACCESS_BUSINESS_RECORDS
    ]
}

# Mock user database (in production, use real database)
MOCK_USERS = {
    "admin": User(
        id="admin_001",
        username="admin",
        email="admin@realtorcompany.com",
        full_name="System Administrator",
        role=UserRole.ADMIN,
        permissions=ROLE_PERMISSIONS[UserRole.ADMIN],
        created_at=datetime.now(),
        is_active=True
    ),
    "manager": User(
        id="manager_001",
        username="manager",
        email="manager@realtorcompany.com",
        full_name="Office Manager",
        role=UserRole.MANAGER,
        permissions=ROLE_PERMISSIONS[UserRole.MANAGER],
        created_at=datetime.now(),
        is_active=True
    ),
    "agent": User(
        id="agent_001",
        username="agent",
        email="agent@realtorcompany.com",
        full_name="Real Estate Agent",
        role=UserRole.AGENT,
        permissions=ROLE_PERMISSIONS[UserRole.AGENT],
        created_at=datetime.now(),
        is_active=True
    ),
    "viewer": User(
        id="viewer_001",
        username="viewer",
        email="viewer@realtorcompany.com",
        full_name="Limited Access User",
        role=UserRole.VIEWER,
        permissions=ROLE_PERMISSIONS[UserRole.VIEWER],
        created_at=datetime.now(),
        is_active=True
    )
}

# Mock password hashes (in production, use database)
MOCK_PASSWORD_HASHES = {
    "admin": bcrypt.hashpw("admin123".encode(), bcrypt.gensalt()),
    "manager": bcrypt.hashpw("manager123".encode(), bcrypt.gensalt()),
    "agent": bcrypt.hashpw("agent123".encode(), bcrypt.gensalt()),
    "viewer": bcrypt.hashpw("viewer123".encode(), bcrypt.gensalt())
}

class AuthService:
    """Authentication service for managing users and tokens"""
    
    def __init__(self):
        self.secret_key = SECRET_KEY
        self.algorithm = ALGORITHM
        self.access_token_expire_minutes = ACCESS_TOKEN_EXPIRE_MINUTES
        self.refresh_token_expire_days = REFRESH_TOKEN_EXPIRE_DAYS
    
    def verify_password(self, plain_password: str, hashed_password: bytes) -> bool:
        """Verify a password against its hash"""
        try:
            return bcrypt.checkpw(plain_password.encode(), hashed_password)
        except Exception as e:
            logger.error(f"Password verification failed: {e}")
            return False
    
    def get_password_hash(self, password: str) -> bytes:
        """Generate password hash"""
        return bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    
    def authenticate_user(self, username: str, password: str) -> Optional[User]:
        """Authenticate user with username and password"""
        try:
            # Check if user exists
            if username not in MOCK_USERS:
                return None
            
            user = MOCK_USERS[username]
            
            # Check if account is locked
            if user.locked_until and datetime.now() < user.locked_until:
                logger.warning(f"Account {username} is locked until {user.locked_until}")
                return None
            
            # Check if account is active
            if not user.is_active:
                logger.warning(f"Account {username} is inactive")
                return None
            
            # Verify password
            if username in MOCK_PASSWORD_HASHES:
                if self.verify_password(password, MOCK_PASSWORD_HASHES[username]):
                    # Reset failed login attempts
                    user.failed_login_attempts = 0
                    user.last_login = datetime.now()
                    return user
                else:
                    # Increment failed login attempts
                    user.failed_login_attempts += 1
                    
                    # Lock account after 5 failed attempts
                    if user.failed_login_attempts >= 5:
                        user.locked_until = datetime.now() + timedelta(minutes=30)
                        logger.warning(f"Account {username} locked for 30 minutes due to failed attempts")
                    
                    return None
            
            return None
            
        except Exception as e:
            logger.error(f"Authentication failed for user {username}: {e}")
            return None
    
    def create_access_token(self, data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
        """Create JWT access token"""
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt
    
    def create_refresh_token(self, data: Dict[str, Any]) -> str:
        """Create JWT refresh token"""
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(days=self.refresh_token_expire_days)
        to_encode.update({"exp": expire, "type": "refresh"})
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt
    
    def verify_token(self, token: str) -> Optional[TokenData]:
        """Verify and decode JWT token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            
            # Check if token is expired
            if "exp" in payload:
                exp_timestamp = payload["exp"]
                if datetime.utcnow().timestamp() > exp_timestamp:
                    return None
            
            # Extract token data
            token_data = TokenData(
                user_id=payload.get("user_id"),
                username=payload.get("username"),
                role=payload.get("role"),
                permissions=payload.get("permissions", [])
            )
            
            return token_data
            
        except jwt.PyJWTError as e:
            logger.error(f"Token verification failed: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error during token verification: {e}")
            return None
    
    def create_tokens(self, user: User) -> Token:
        """Create both access and refresh tokens for a user"""
        access_token_expires = timedelta(minutes=self.access_token_expire_minutes)
        
        access_token_data = {
            "user_id": user.id,
            "username": user.username,
            "role": user.role.value,
            "permissions": [p.value for p in user.permissions]
        }
        
        refresh_token_data = {
            "user_id": user.id,
            "username": user.username,
            "role": user.role.value
        }
        
        access_token = self.create_access_token(access_token_data, access_token_expires)
        refresh_token = self.create_refresh_token(refresh_token_data)
        
        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=self.access_token_expire_minutes * 60,
            user_id=user.id,
            username=user.username,
            role=user.role
        )
    
    def refresh_access_token(self, refresh_token: str) -> Optional[str]:
        """Refresh access token using refresh token"""
        try:
            # Verify refresh token
            payload = jwt.decode(refresh_token, self.secret_key, algorithms=[self.algorithm])
            
            # Check if it's a refresh token
            if payload.get("type") != "refresh":
                return None
            
            # Check if token is expired
            if "exp" in payload:
                exp_timestamp = payload["exp"]
                if datetime.utcnow().timestamp() > exp_timestamp:
                    return None
            
            # Create new access token
            access_token_data = {
                "user_id": payload.get("user_id"),
                "username": payload.get("username"),
                "role": payload.get("role"),
                "permissions": payload.get("permissions", [])
            }
            
            access_token = self.create_access_token(access_token_data)
            return access_token
            
        except jwt.PyJWTError as e:
            logger.error(f"Refresh token verification failed: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error during token refresh: {e}")
            return None

# Initialize auth service
auth_service = AuthService()

# Dependency functions
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """Get current authenticated user from JWT token"""
    try:
        token = credentials.credentials
        token_data = auth_service.verify_token(token)
        
        if token_data is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Get user from database (using mock for now)
        username = token_data.username
        if username not in MOCK_USERS:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        user = MOCK_USERS[username]
        
        # Check if user is still active
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account is inactive",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return user
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting current user: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def require_permission(permission: Permission):
    """Decorator to require specific permission"""
    def permission_dependency(current_user: User = Depends(get_current_user)) -> User:
        if permission not in current_user.permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission '{permission}' required"
            )
        return current_user
    return permission_dependency

def require_role(role: UserRole):
    """Decorator to require specific role"""
    def role_dependency(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role != role and current_user.role != UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{role}' required"
            )
        return current_user
    return role_dependency

def require_minimum_role(minimum_role: UserRole):
    """Decorator to require minimum role level"""
    role_hierarchy = {
        UserRole.VIEWER: 1,
        UserRole.AGENT: 2,
        UserRole.MANAGER: 3,
        UserRole.ADMIN: 4
    }
    
    def role_dependency(current_user: User = Depends(get_current_user)) -> User:
        current_level = role_hierarchy.get(current_user.role, 0)
        required_level = role_hierarchy.get(minimum_role, 0)
        
        if current_level < required_level:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Minimum role '{minimum_role}' required"
            )
        return current_user
    return role_dependency

# Security utilities
def generate_secure_token(length: int = 32) -> str:
    """Generate secure random token"""
    return secrets.token_urlsafe(length)

def hash_sensitive_data(data: str) -> str:
    """Hash sensitive data for storage"""
    return hashlib.sha256(data.encode()).hexdigest()

def validate_password_strength(password: str) -> Dict[str, Any]:
    """Validate password strength"""
    errors = []
    warnings = []
    
    if len(password) < 8:
        errors.append("Password must be at least 8 characters long")
    
    if not any(c.isupper() for c in password):
        warnings.append("Consider using uppercase letters")
    
    if not any(c.islower() for c in password):
        warnings.append("Consider using lowercase letters")
    
    if not any(c.isdigit() for c in password):
        warnings.append("Consider using numbers")
    
    if not any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password):
        warnings.append("Consider using special characters")
    
    is_strong = len(errors) == 0 and len(warnings) <= 1
    
    return {
        "is_strong": is_strong,
        "errors": errors,
        "warnings": warnings,
        "score": max(0, 10 - len(errors) * 2 - len(warnings))
    }

# Rate limiting (basic implementation)
class RateLimiter:
    """Basic rate limiter for API endpoints"""
    
    def __init__(self, max_requests: int = 100, window_seconds: int = 3600):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = {}  # In production, use Redis or database
    
    def is_allowed(self, user_id: str) -> bool:
        """Check if user is allowed to make request"""
        now = datetime.now()
        
        if user_id not in self.requests:
            self.requests[user_id] = []
        
        # Remove old requests outside window
        self.requests[user_id] = [
            req_time for req_time in self.requests[user_id]
            if (now - req_time).total_seconds() < self.window_seconds
        ]
        
        # Check if under limit
        if len(self.requests[user_id]) < self.max_requests:
            self.requests[user_id].append(now)
            return True
        
        return False

# Initialize rate limiter
rate_limiter = RateLimiter(max_requests=100, window_seconds=3600)

def check_rate_limit(user_id: str) -> bool:
    """Check rate limit for user"""
    return rate_limiter.is_allowed(user_id)
