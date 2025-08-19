"""
Configuration settings for Advanced LEO Search Tool
Loads configuration from environment variables with sensible defaults
"""

import os
from typing import Dict, List, Optional, Any
from pydantic import BaseSettings, Field, validator
from pathlib import Path

class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Application settings
    app_name: str = "Advanced LEO Search Tool"
    app_version: str = "1.0.0"
    debug: bool = Field(False, env="DEBUG")
    environment: str = Field("production", env="ENVIRONMENT")
    
    # Server settings
    host: str = Field("0.0.0.0", env="HOST")
    port: int = Field(8000, env="PORT")
    workers: int = Field(1, env="WORKERS")
    
    # Security settings
    secret_key: str = Field("your-secret-key-change-in-production", env="SECRET_KEY")
    algorithm: str = Field("HS256", env="ALGORITHM")
    access_token_expire_minutes: int = Field(30, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    refresh_token_expire_days: int = Field(7, env="REFRESH_TOKEN_EXPIRE_DAYS")
    
    # Database settings
    database_url: str = Field("postgresql://user:password@localhost/leo_search", env="DATABASE_URL")
    redis_url: str = Field("redis://localhost:6379", env="REDIS_URL")
    elasticsearch_url: str = Field("http://localhost:9200", env="ELASTICSEARCH_URL")
    
    # Data source settings
    enable_court_records: bool = Field(True, env="ENABLE_COURT_RECORDS")
    enable_criminal_records: bool = Field(True, env="ENABLE_CRIMINAL_RECORDS")
    enable_property_records: bool = Field(True, env="ENABLE_PROPERTY_RECORDS")
    enable_business_records: bool = Field(True, env="ENABLE_BUSINESS_RECORDS")
    enable_social_media: bool = Field(True, env="ENABLE_SOCIAL_MEDIA")
    enable_government_apis: bool = Field(True, env="ENABLE_GOVERNMENT_APIS")
    
    # API rate limiting
    rate_limit_max_requests: int = Field(100, env="RATE_LIMIT_MAX_REQUESTS")
    rate_limit_window_seconds: int = Field(3600, env="RATE_LIMIT_WINDOW_SECONDS")
    
    # Search settings
    max_search_results: int = Field(1000, env="MAX_SEARCH_RESULTS")
    default_confidence_threshold: float = Field(0.7, env="DEFAULT_CONFIDENCE_THRESHOLD")
    enable_ai_enhancement: bool = Field(True, env="ENABLE_AI_ENHANCEMENT")
    enable_entity_correlation: bool = Field(True, env="ENABLE_ENTITY_CORRELATION")
    
    # Cache settings
    cache_ttl_seconds: int = Field(3600, env="CACHE_TTL_SECONDS")
    enable_redis_cache: bool = Field(True, env="ENABLE_REDIS_CACHE")
    enable_elasticsearch_cache: bool = Field(True, env="ENABLE_ELASTICSEARCH_CACHE")
    
    # Logging settings
    log_level: str = Field("INFO", env="LOG_LEVEL")
    log_file: Optional[str] = Field(None, env="LOG_FILE")
    enable_structured_logging: bool = Field(True, env="ENABLE_STRUCTURED_LOGGING")
    
    # Monitoring settings
    enable_metrics: bool = Field(True, env="ENABLE_METRICS")
    metrics_port: int = Field(9090, env="METRICS_PORT")
    enable_health_checks: bool = Field(True, env="ENABLE_HEALTH_CHECKS")
    
    # FREE/PUBLIC API settings - NO PAID SERVICES
    # Court records APIs (FREE with registration)
    pacer_username: Optional[str] = Field(None, env="PACER_USERNAME")
    pacer_password: Optional[str] = Field(None, env="PACER_PASSWORD")
    
    # Social media APIs (FREE tiers only)
    twitter_api_key: Optional[str] = Field(None, env="TWITTER_API_KEY")
    twitter_api_secret: Optional[str] = Field(None, env="TWITTER_API_SECRET")
    twitter_bearer_token: Optional[str] = Field(None, env="TWITTER_BEARER_TOKEN")
    
    # Government APIs (FREE)
    census_api_key: Optional[str] = Field(None, env="CENSUS_API_KEY")
    fec_api_key: Optional[str] = Field(None, env="FEC_API_KEY")
    
    # Open Data APIs (FREE)
    opencorporates_api_key: Optional[str] = Field(None, env="OPENCORPORATES_API_KEY")
    opensecrets_api_key: Optional[str] = Field(None, env="OPENSECRETS_API_KEY")
    data_gov_api_key: Optional[str] = Field(None, env="DATA_GOV_API_KEY")
    
    # Geocoding services (FREE alternatives)
    nominatim_user_agent: str = Field("LEO-Search-Tool/1.0", env="NOMINATIM_USER_AGENT")
    mapbox_access_token: Optional[str] = Field(None, env="MAPBOX_ACCESS_TOKEN")  # Free tier
    usps_user_id: Optional[str] = Field(None, env="USPS_USER_ID")  # Free with registration
    
    # Web scraping configuration (FREE)
    enable_web_scraping: bool = Field(True, env="ENABLE_WEB_SCRAPING")
    scraping_delay_seconds: int = Field(2, env="SCRAPING_DELAY_SECONDS")
    max_requests_per_minute: int = Field(30, env="MAX_REQUESTS_PER_MINUTE")
    scraping_user_agent: str = Field("LEO-Search-Tool/1.0 (Educational/Research Use)", env="SCRAPING_USER_AGENT")
    
    # File paths
    data_directory: str = Field("./data", env="DATA_DIRECTORY")
    temp_directory: str = Field("./temp", env="TEMP_DIRECTORY")
    logs_directory: str = Field("./logs", env="LOGS_DIRECTORY")
    
    # Feature flags
    enable_advanced_search: bool = Field(True, env="ENABLE_ADVANCED_SEARCH")
    enable_batch_search: bool = Field(False, env="ENABLE_BATCH_SEARCH")
    enable_export_results: bool = Field(True, env="ENABLE_EXPORT_RESULTS")
    enable_audit_logging: bool = Field(True, env="ENABLE_AUDIT_LOGGING")
    
    # Performance settings
    max_concurrent_searches: int = Field(20, env="MAX_CONCURRENT_SEARCHES")
    search_timeout_seconds: int = Field(300, env="SEARCH_TIMEOUT_SECONDS")
    enable_connection_pooling: bool = Field(True, env="ENABLE_CONNECTION_POOLING")
    
    # Data retention settings
    search_result_retention_days: int = Field(90, env="SEARCH_RESULT_RETENTION_DAYS")
    audit_log_retention_days: int = Field(365, env="AUDIT_LOG_RETENTION_DAYS")
    cache_retention_days: int = Field(7, env="CACHE_RETENTION_DAYS")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
    
    @validator('environment')
    def validate_environment(cls, v):
        allowed = ['development', 'staging', 'production', 'testing']
        if v not in allowed:
            raise ValueError(f'Environment must be one of: {allowed}')
        return v
    
    @validator('log_level')
    def validate_log_level(cls, v):
        allowed = ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']
        if v.upper() not in allowed:
            raise ValueError(f'Log level must be one of: {allowed}')
        return v.upper()
    
    @validator('default_confidence_threshold')
    def validate_confidence_threshold(cls, v):
        if not 0.0 <= v <= 1.0:
            raise ValueError('Confidence threshold must be between 0.0 and 1.0')
        return v
    
    @validator('max_search_results')
    def validate_max_search_results(cls, v):
        if v < 1 or v > 10000:
            raise ValueError('Max search results must be between 1 and 10000')
        return v

# Create settings instance
settings = Settings()

# Additional configuration functions
def get_database_config() -> Dict[str, Any]:
    """Get database configuration"""
    return {
        "url": settings.database_url,
        "pool_size": 20 if settings.enable_connection_pooling else 1,
        "max_overflow": 30 if settings.enable_connection_pooling else 0,
        "pool_pre_ping": True,
        "echo": settings.debug
    }

def get_redis_config() -> Dict[str, Any]:
    """Get Redis configuration"""
    return {
        "url": settings.redis_url,
        "max_connections": 20,
        "retry_on_timeout": True,
        "health_check_interval": 30
    }

def get_elasticsearch_config() -> Dict[str, Any]:
    """Get Elasticsearch configuration"""
    return {
        "urls": [settings.elasticsearch_url],
        "timeout": 30,
        "max_retries": 3,
        "retry_on_timeout": True,
        "sniff_on_start": True,
        "sniff_on_connection_fail": True
    }

def get_logging_config() -> Dict[str, Any]:
    """Get logging configuration"""
    config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "standard": {
                "format": "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
            },
            "structured": {
                "format": '{"timestamp": "%(asctime)s", "level": "%(levelname)s", "logger": "%(name)s", "message": "%(message)s"}'
            }
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "level": settings.log_level,
                "formatter": "structured" if settings.enable_structured_logging else "standard",
                "stream": "ext://sys.stdout"
            }
        },
        "loggers": {
            "": {
                "handlers": ["console"],
                "level": settings.log_level,
                "propagate": True
            }
        }
    }
    
    # Add file handler if log file is specified
    if settings.log_file:
        config["handlers"]["file"] = {
            "class": "logging.FileHandler",
            "level": settings.log_level,
            "formatter": "structured" if settings.enable_structured_logging else "standard",
            "filename": settings.log_file,
            "mode": "a"
        }
        config["loggers"][""]["handlers"].append("file")
    
    return config

def get_cors_config() -> Dict[str, Any]:
    """Get CORS configuration"""
    if settings.environment == "development":
        return {
            "allow_origins": ["*"],
            "allow_credentials": True,
            "allow_methods": ["*"],
            "allow_headers": ["*"]
        }
    else:
        return {
            "allow_origins": [
                "https://yourdomain.com",
                "https://app.yourdomain.com"
            ],
            "allow_credentials": True,
            "allow_methods": ["GET", "POST", "PUT", "DELETE"],
            "allow_headers": ["*"]
        }

def get_rate_limit_config() -> Dict[str, Any]:
    """Get rate limiting configuration"""
    return {
        "max_requests": settings.rate_limit_max_requests,
        "window_seconds": settings.rate_limit_window_seconds,
        "enable_by_user": True,
        "enable_by_ip": True,
        "enable_by_endpoint": True
    }

def get_search_config() -> Dict[str, Any]:
    """Get search configuration"""
    return {
        "max_results": settings.max_search_results,
        "default_confidence": settings.default_confidence_threshold,
        "enable_ai": settings.enable_ai_enhancement,
        "enable_correlation": settings.enable_entity_correlation,
        "timeout_seconds": settings.search_timeout_seconds,
        "max_concurrent": settings.max_concurrent_searches
    }

def get_cache_config() -> Dict[str, Any]:
    """Get cache configuration"""
    return {
        "ttl_seconds": settings.cache_ttl_seconds,
        "enable_redis": settings.enable_redis_cache,
        "enable_elasticsearch": settings.enable_elasticsearch_cache,
        "retention_days": settings.cache_retention_days
    }

def get_monitoring_config() -> Dict[str, Any]:
    """Get monitoring configuration"""
    return {
        "enable_metrics": settings.enable_metrics,
        "metrics_port": settings.metrics_port,
        "enable_health_checks": settings.enable_health_checks,
        "health_check_interval": 30,
        "enable_alerting": True
    }

# Environment-specific overrides
def get_environment_config() -> Dict[str, Any]:
    """Get environment-specific configuration"""
    if settings.environment == "development":
        return {
            "debug": True,
            "log_level": "DEBUG",
            "enable_metrics": False,
            "enable_audit_logging": False
        }
    elif settings.environment == "testing":
        return {
            "debug": True,
            "log_level": "DEBUG",
            "database_url": "postgresql://test:test@localhost/test_db",
            "redis_url": "redis://localhost:6379/1",
            "enable_audit_logging": False
        }
    elif settings.environment == "staging":
        return {
            "debug": False,
            "log_level": "INFO",
            "enable_metrics": True,
            "enable_audit_logging": True
        }
    else:  # production
        return {
            "debug": False,
            "log_level": "WARNING",
            "enable_metrics": True,
            "enable_audit_logging": True,
            "enable_connection_pooling": True
        }

# Create directories if they don't exist
def ensure_directories():
    """Ensure required directories exist"""
    directories = [
        settings.data_directory,
        settings.temp_directory,
        settings.logs_directory
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)

# Initialize directories
ensure_directories()
