"""
Pydantic schemas for Advanced LEO Search Tool
Defines all request and response models
"""

from pydantic import BaseModel, Field, validator
from typing import Dict, List, Optional, Any, Union
from datetime import datetime, date
from enum import Enum

# Enums
class SearchType(str, Enum):
    PERSON = "person"
    BUSINESS = "business"
    CRIMINAL = "criminal"
    PROPERTY = "property"
    ADVANCED = "advanced"

class DataSource(str, Enum):
    COURT_RECORDS = "court_records"
    PROPERTY_RECORDS = "property_records"
    BUSINESS_RECORDS = "business_records"
    SOCIAL_MEDIA = "social_media"
    PHONE_DIRECTORIES = "phone_directories"
    EMAIL_DATABASES = "email_databases"
    GOVERNMENT_APIS = "government_apis"
    NEWS_MEDIA = "news_media"
    FINANCIAL_RECORDS = "financial_records"
    VEHICLE_RECORDS = "vehicle_records"
    VOTER_RECORDS = "voter_records"
    PROFESSIONAL_LICENSES = "professional_licenses"
    CRIMINAL_RECORDS = "criminal_records"
    SEX_OFFENDER_REGISTRY = "sex_offender_registry"
    BANKRUPTCY_RECORDS = "bankruptcy_records"
    TAX_RECORDS = "tax_records"
    MARRIAGE_RECORDS = "marriage_records"
    DEATH_RECORDS = "death_records"
    IMMIGRATION_RECORDS = "immigration_records"
    MILITARY_RECORDS = "military_records"
    EDUCATION_RECORDS = "education_records"
    MEDICAL_LICENSES = "medical_licenses"
    REAL_ESTATE_LICENSES = "real_estate_licenses"
    INSURANCE_RECORDS = "insurance_records"
    UTILITY_RECORDS = "utility_records"
    SOCIAL_SECURITY = "social_security"
    CREDIT_BUREAUS = "credit_bureaus"
    BACKGROUND_CHECK = "background_check"
    ADDRESS_VERIFICATION = "address_verification"
    IDENTITY_VERIFICATION = "identity_verification"

class DataType(str, Enum):
    PERSONAL_INFO = "personal_info"
    CRIMINAL_RECORDS = "criminal_records"
    COURT_RECORDS = "court_records"
    PROPERTY_RECORDS = "property_records"
    BUSINESS_RECORDS = "business_records"
    SOCIAL_MEDIA = "social_media"
    PHONE_INFO = "phone_info"
    EMAIL_INFO = "email_info"
    ADDRESS_INFO = "address_info"
    FINANCIAL_RECORDS = "financial_records"
    VEHICLE_RECORDS = "vehicle_records"
    VOTER_RECORDS = "voter_records"
    PROFESSIONAL_LICENSES = "professional_licenses"
    SEX_OFFENDER_REGISTRY = "sex_offender_registry"
    BANKRUPTCY_RECORDS = "bankruptcy_records"
    TAX_RECORDS = "tax_records"
    MARRIAGE_RECORDS = "marriage_records"
    DEATH_RECORDS = "death_records"
    IMMIGRATION_RECORDS = "immigration_records"
    MILITARY_RECORDS = "military_records"
    EDUCATION_RECORDS = "education_records"
    MEDICAL_LICENSES = "medical_licenses"
    REAL_ESTATE_LICENSES = "real_estate_licenses"
    INSURANCE_RECORDS = "insurance_records"
    UTILITY_RECORDS = "utility_records"
    SOCIAL_SECURITY = "social_security"
    CREDIT_RECORDS = "credit_records"
    BACKGROUND_CHECK = "background_check"
    CORRELATED_ENTITY = "correlated_entity"

class ConfidenceLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    VERY_HIGH = "very_high"

# Base models
class BaseSearchRequest(BaseModel):
    """Base class for all search requests"""
    confidence_threshold: Optional[float] = Field(0.7, ge=0.0, le=1.0, description="Minimum confidence threshold")
    max_results: Optional[int] = Field(100, ge=1, le=1000, description="Maximum number of results to return")
    filters: Optional['SearchFilters'] = Field(None, description="Search filters")
    date_range: Optional['DateRange'] = Field(None, description="Date range for search")
    geographic_scope: Optional['GeographicScope'] = Field(None, description="Geographic scope for search")

class SearchFilters(BaseModel):
    """Search filters for narrowing results"""
    sources: Optional[List[DataSource]] = Field(None, description="Specific data sources to search")
    data_types: Optional[List[DataType]] = Field(None, description="Specific data types to include")
    exclude_sources: Optional[List[DataSource]] = Field(None, description="Data sources to exclude")
    exclude_data_types: Optional[List[DataType]] = Field(None, description="Data types to exclude")
    min_confidence: Optional[float] = Field(None, ge=0.0, le=1.0, description="Minimum confidence score")
    max_confidence: Optional[float] = Field(None, ge=0.0, le=1.0, description="Maximum confidence score")
    has_criminal_record: Optional[bool] = Field(None, description="Filter for criminal records")
    has_property: Optional[bool] = Field(None, description="Filter for property ownership")
    has_business: Optional[bool] = Field(None, description="Filter for business affiliations")
    is_active: Optional[bool] = Field(None, description="Filter for active records")

class DateRange(BaseModel):
    """Date range for search constraints"""
    start_date: Optional[datetime] = Field(None, description="Start date for search")
    end_date: Optional[datetime] = Field(None, description="End date for search")
    relative_days: Optional[int] = Field(None, ge=1, description="Relative days from now")
    
    @validator('end_date')
    def validate_date_range(cls, v, values):
        if v and 'start_date' in values and values['start_date']:
            if v < values['start_date']:
                raise ValueError('End date must be after start date')
        return v

class GeographicScope(BaseModel):
    """Geographic scope for search constraints"""
    zip_code: Optional[str] = Field(None, description="ZIP code for search")
    city: Optional[str] = Field(None, description="City for search")
    state: Optional[str] = Field(None, description="State for search")
    county: Optional[str] = Field(None, description="County for search")
    radius_miles: Optional[float] = Field(None, ge=0.1, le=1000.0, description="Search radius in miles")
    coordinates: Optional[Dict[str, float]] = Field(None, description="Latitude and longitude coordinates")
    
    @validator('coordinates')
    def validate_coordinates(cls, v):
        if v:
            if 'latitude' not in v or 'longitude' not in v:
                raise ValueError('Coordinates must include latitude and longitude')
            if not (-90 <= v['latitude'] <= 90):
                raise ValueError('Latitude must be between -90 and 90')
            if not (-180 <= v['longitude'] <= 180):
                raise ValueError('Longitude must be between -180 and 180')
        return v

# Person search models
class PersonSearchRequest(BaseSearchRequest):
    """Request model for person search"""
    name: Optional[str] = Field(None, description="Full name or partial name")
    first_name: Optional[str] = Field(None, description="First name")
    last_name: Optional[str] = Field(None, description="Last name")
    middle_name: Optional[str] = Field(None, description="Middle name or initial")
    email: Optional[str] = Field(None, description="Email address")
    phone: Optional[str] = Field(None, description="Phone number")
    ssn: Optional[str] = Field(None, description="Social Security Number (last 4 digits only)")
    date_of_birth: Optional[date] = Field(None, description="Date of birth")
    address: Optional[str] = Field(None, description="Address")
    zip_code: Optional[str] = Field(None, description="ZIP code")
    city: Optional[str] = Field(None, description="City")
    state: Optional[str] = Field(None, description="State")
    age_range: Optional[Dict[str, int]] = Field(None, description="Age range (min_age, max_age)")
    
    @validator('ssn')
    def validate_ssn(cls, v):
        if v and len(v) > 4:
            raise ValueError('SSN should only include last 4 digits for security')
        return v
    
    @validator('age_range')
    def validate_age_range(cls, v):
        if v:
            if 'min_age' in v and 'max_age' in v:
                if v['min_age'] > v['max_age']:
                    raise ValueError('Minimum age must be less than maximum age')
                if v['min_age'] < 0 or v['max_age'] > 150:
                    raise ValueError('Age must be between 0 and 150')
        return v

# Business search models
class BusinessSearchRequest(BaseSearchRequest):
    """Request model for business search"""
    business_name: Optional[str] = Field(None, description="Business name")
    ein: Optional[str] = Field(None, description="Employer Identification Number")
    owner_name: Optional[str] = Field(None, description="Business owner name")
    business_type: Optional[str] = Field(None, description="Type of business")
    industry: Optional[str] = Field(None, description="Business industry")
    address: Optional[str] = Field(None, description="Business address")
    zip_code: Optional[str] = Field(None, description="Business ZIP code")
    city: Optional[str] = Field(None, description="Business city")
    state: Optional[str] = Field(None, description="Business state")
    phone: Optional[str] = Field(None, description="Business phone number")
    website: Optional[str] = Field(None, description="Business website")
    incorporation_date: Optional[date] = Field(None, description="Date of incorporation")
    is_active: Optional[bool] = Field(None, description="Whether business is active")

# Criminal search models
class CriminalSearchRequest(BaseSearchRequest):
    """Request model for criminal records search"""
    name: Optional[str] = Field(None, description="Full name")
    first_name: Optional[str] = Field(None, description="First name")
    last_name: Optional[str] = Field(None, description="Last name")
    ssn: Optional[str] = Field(None, description="Social Security Number (last 4 digits only)")
    date_of_birth: Optional[date] = Field(None, description="Date of birth")
    address: Optional[str] = Field(None, description="Address")
    zip_code: Optional[str] = Field(None, description="ZIP code")
    city: Optional[str] = Field(None, description="City")
    state: Optional[str] = Field(None, description="State")
    case_number: Optional[str] = Field(None, description="Court case number")
    court: Optional[str] = Field(None, description="Court name")
    charge_type: Optional[str] = Field(None, description="Type of charge")
    conviction_status: Optional[str] = Field(None, description="Conviction status")
    include_expunged: Optional[bool] = Field(False, description="Include expunged records")
    
    @validator('ssn')
    def validate_ssn(cls, v):
        if v and len(v) > 4:
            raise ValueError('SSN should only include last 4 digits for security')
        return v

# Property search models
class PropertySearchRequest(BaseSearchRequest):
    """Request model for property records search"""
    address: Optional[str] = Field(None, description="Property address")
    property_id: Optional[str] = Field(None, description="Property ID or parcel number")
    owner_name: Optional[str] = Field(None, description="Property owner name")
    zip_code: Optional[str] = Field(None, description="Property ZIP code")
    city: Optional[str] = Field(None, description="Property city")
    state: Optional[str] = Field(None, description="Property state")
    county: Optional[str] = Field(None, description="Property county")
    property_type: Optional[str] = Field(None, description="Type of property")
    square_footage: Optional[Dict[str, int]] = Field(None, description="Square footage range")
    year_built: Optional[Dict[str, int]] = Field(None, description="Year built range")
    property_value: Optional[Dict[str, float]] = Field(None, description="Property value range")
    has_liens: Optional[bool] = Field(None, description="Whether property has liens")
    has_encumbrances: Optional[bool] = Field(None, description="Whether property has encumbrances")
    
    @validator('square_footage', 'year_built', 'property_value')
    def validate_ranges(cls, v):
        if v:
            if 'min' in v and 'max' in v:
                if v['min'] > v['max']:
                    raise ValueError('Minimum value must be less than maximum value')
        return v

# Advanced search models
class SearchRequest(BaseSearchRequest):
    """Request model for advanced search"""
    parameters: Dict[str, Any] = Field(..., description="Custom search parameters")
    search_type: SearchType = Field(SearchType.ADVANCED, description="Type of search")
    query_string: Optional[str] = Field(None, description="Free-form query string")
    use_ai_enhancement: Optional[bool] = Field(True, description="Use AI enhancement")
    include_correlations: Optional[bool] = Field(True, description="Include entity correlations")
    sort_by: Optional[str] = Field("confidence", description="Sort results by field")
    sort_order: Optional[str] = Field("desc", description="Sort order (asc/desc)")

# Response models
class SearchResult(BaseModel):
    """Individual search result"""
    source: str = Field(..., description="Data source")
    data_type: str = Field(..., description="Type of data")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score")
    raw_data: Dict[str, Any] = Field(..., description="Raw data from source")
    timestamp: str = Field(..., description="Timestamp of result")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")
    
    class Config:
        schema_extra = {
            "example": {
                "source": "court_records",
                "data_type": "criminal_records",
                "confidence": 0.95,
                "raw_data": {
                    "name": "John Doe",
                    "case_number": "CR-2023-001",
                    "charge": "DUI",
                    "court": "Superior Court"
                },
                "timestamp": "2023-12-01T10:00:00Z",
                "metadata": {
                    "ai_score": 0.92,
                    "correlation_method": "ai_enhanced"
                }
            }
        }

class SearchResponse(BaseModel):
    """Complete search response"""
    query_id: str = Field(..., description="Unique query identifier")
    total_results: int = Field(..., ge=0, description="Total number of results")
    results: List[SearchResult] = Field(..., description="Search results")
    search_time: float = Field(..., ge=0.0, description="Search execution time in seconds")
    sources_queried: List[str] = Field(..., description="Data sources that were queried")
    confidence_scores: Dict[str, float] = Field(..., description="Confidence scores by source")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")
    timestamp: str = Field(..., description="Response timestamp")
    
    class Config:
        schema_extra = {
            "example": {
                "query_id": "abc123",
                "total_results": 5,
                "results": [],
                "search_time": 2.5,
                "sources_queried": ["court_records", "property_records"],
                "confidence_scores": {
                    "court_records": 0.95,
                    "property_records": 0.90
                },
                "metadata": {
                    "ai_scoring_applied": True,
                    "results_cached": True
                },
                "timestamp": "2023-12-01T10:00:00Z"
            }
        }

# Additional models
class SearchStatistics(BaseModel):
    """Search statistics and metrics"""
    total_searches: int = Field(..., description="Total number of searches performed")
    successful_searches: int = Field(..., description="Number of successful searches")
    failed_searches: int = Field(..., description="Number of failed searches")
    average_search_time: float = Field(..., description="Average search time in seconds")
    cache_hit_rate: float = Field(..., description="Cache hit rate percentage")
    most_queried_sources: List[Dict[str, Any]] = Field(..., description="Most frequently queried data sources")
    search_trends: Dict[str, Any] = Field(..., description="Search trends over time")

class DataSourceInfo(BaseModel):
    """Information about a data source"""
    id: str = Field(..., description="Data source identifier")
    name: str = Field(..., description="Data source name")
    description: str = Field(..., description="Data source description")
    reliability: float = Field(..., ge=0.0, le=1.0, description="Reliability score")
    update_frequency: str = Field(..., description="How often data is updated")
    coverage: Dict[str, Any] = Field(..., description="Geographic and temporal coverage")
    api_endpoint: Optional[str] = Field(None, description="API endpoint if applicable")
    rate_limit: Optional[Dict[str, Any]] = Field(None, description="Rate limiting information")
    last_updated: Optional[str] = Field(None, description="Last update timestamp")

class SystemStatus(BaseModel):
    """System status information"""
    timestamp: str = Field(..., description="Status timestamp")
    status: str = Field(..., description="Overall system status")
    components: Dict[str, str] = Field(..., description="Status of individual components")
    performance: Dict[str, Any] = Field(..., description="Performance metrics")
    alerts: List[str] = Field(default_factory=list, description="Active system alerts")

# Update forward references
SearchFilters.update_forward_refs()
DateRange.update_forward_refs()
GeographicScope.update_forward_refs()
