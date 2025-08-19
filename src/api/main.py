"""
FastAPI Application for Advanced LEO Search Tool
Provides REST API endpoints for comprehensive people search
"""

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any, Union
import logging
import asyncio
from datetime import datetime, timedelta
import json
import uuid

from ..core.search_engine import AdvancedSearchEngine, SearchQuery, SearchResponse
from ..core.data_sources import SearchResult
from ..security.auth import get_current_user, User
from ..models.schemas import (
    SearchRequest, SearchResponse as SearchResponseSchema,
    PersonSearchRequest, BusinessSearchRequest,
    CriminalSearchRequest, PropertySearchRequest,
    SearchFilters, GeographicScope, DateRange
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Advanced LEO Search Tool",
    description="Comprehensive people search tool for realtor companies",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Initialize search engine
config = {
    'elasticsearch_url': 'http://localhost:9200',
    'redis_url': 'redis://localhost:6379',
    'max_workers': 20,
    'cache_ttl': 3600
}

search_engine = AdvancedSearchEngine(config)

@app.on_event("startup")
async def startup_event():
    """Initialize application on startup"""
    logger.info("Starting Advanced LEO Search Tool...")
    
    # Initialize data sources
    try:
        # Test connections
        logger.info("Testing database connections...")
        # Add connection tests here
        
        logger.info("Application started successfully")
    except Exception as e:
        logger.error(f"Failed to start application: {e}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on application shutdown"""
    logger.info("Shutting down Advanced LEO Search Tool...")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

# Search endpoints
@app.post("/api/v1/search/person", response_model=SearchResponseSchema)
async def search_person(
    request: PersonSearchRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    """
    Search for a person across all data sources
    
    This endpoint performs comprehensive person search including:
    - Personal information (name, email, phone, address)
    - Criminal records
    - Property ownership
    - Business affiliations
    - Social media presence
    - Professional licenses
    """
    try:
        logger.info(f"Person search request from user {current_user.id}: {request}")
        
        # Validate request
        if not request.name and not request.email and not request.phone and not request.ssn:
            raise HTTPException(
                status_code=400,
                detail="At least one search parameter (name, email, phone, or SSN) is required"
            )
        
        # Create search query
        search_query = SearchQuery(
            query_id=str(uuid.uuid4()),
            query_type="person_search",
            parameters=request.dict(exclude_none=True),
            filters=request.filters.dict() if request.filters else {},
            date_range=request.date_range.dict() if request.date_range else None,
            geographic_scope=request.geographic_scope.dict() if request.geographic_scope else None,
            confidence_threshold=request.confidence_threshold or 0.7,
            max_results=request.max_results or 100,
            user_id=current_user.id
        )
        
        # Execute search
        response = await search_engine.search(search_query)
        
        # Log search activity
        background_tasks.add_task(
            log_search_activity,
            current_user.id,
            "person_search",
            search_query.query_id,
            len(response.results)
        )
        
        return SearchResponseSchema(
            query_id=response.query_id,
            total_results=response.total_results,
            results=[result_to_schema(r) for r in response.results],
            search_time=response.search_time,
            sources_queried=response.sources_queried,
            confidence_scores=response.confidence_scores,
            metadata=response.metadata,
            timestamp=response.timestamp
        )
        
    except Exception as e:
        logger.error(f"Person search failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/search/business", response_model=SearchResponseSchema)
async def search_business(
    request: BusinessSearchRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    """
    Search for business information across all data sources
    
    This endpoint searches for:
    - Business registration details
    - Corporate records
    - Business licenses
    - Financial information
    - Legal proceedings
    - Property holdings
    """
    try:
        logger.info(f"Business search request from user {current_user.id}: {request}")
        
        # Validate request
        if not request.business_name and not request.ein and not request.owner_name:
            raise HTTPException(
                status_code=400,
                detail="At least one search parameter (business_name, EIN, or owner_name) is required"
            )
        
        # Create search query
        search_query = SearchQuery(
            query_id=str(uuid.uuid4()),
            query_type="business_search",
            parameters=request.dict(exclude_none=True),
            filters=request.filters.dict() if request.filters else {},
            date_range=request.date_range.dict() if request.date_range else None,
            geographic_scope=request.geographic_scope.dict() if request.geographic_scope else None,
            confidence_threshold=request.confidence_threshold or 0.7,
            max_results=request.max_results or 100,
            user_id=current_user.id
        )
        
        # Execute search
        response = await search_engine.search(search_query)
        
        # Log search activity
        background_tasks.add_task(
            log_search_activity,
            current_user.id,
            "business_search",
            search_query.query_id,
            len(response.results)
        )
        
        return SearchResponseSchema(
            query_id=response.query_id,
            total_results=response.total_results,
            results=[result_to_schema(r) for r in response.results],
            search_time=response.search_time,
            sources_queried=response.sources_queried,
            confidence_scores=response.confidence_scores,
            metadata=response.metadata,
            timestamp=response.timestamp
        )
        
    except Exception as e:
        logger.error(f"Business search failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/search/criminal", response_model=SearchResponseSchema)
async def search_criminal_records(
    request: CriminalSearchRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    """
    Search for criminal records and background information
    
    This endpoint searches:
    - Criminal records
    - Arrest records
    - Court proceedings
    - Sex offender registry
    - Background checks
    - Legal history
    """
    try:
        logger.info(f"Criminal records search request from user {current_user.id}: {request}")
        
        # Validate request
        if not request.name and not request.ssn and not request.date_of_birth:
            raise HTTPException(
                status_code=400,
                detail="At least one search parameter (name, SSN, or date_of_birth) is required"
            )
        
        # Create search query with criminal-specific filters
        search_query = SearchQuery(
            query_id=str(uuid.uuid4()),
            query_type="criminal_search",
            parameters=request.dict(exclude_none=True),
            filters={
                'data_types': ['criminal_records', 'court_records', 'sex_offender_registry'],
                'sources': ['court_records', 'criminal_records', 'sex_offender_registry', 'background_check']
            },
            date_range=request.date_range.dict() if request.date_range else None,
            geographic_scope=request.geographic_scope.dict() if request.geographic_scope else None,
            confidence_threshold=request.confidence_threshold or 0.8,
            max_results=request.max_results or 100,
            user_id=current_user.id
        )
        
        # Execute search
        response = await search_engine.search(search_query)
        
        # Log search activity
        background_tasks.add_task(
            log_search_activity,
            current_user.id,
            "criminal_search",
            search_query.query_id,
            len(response.results)
        )
        
        return SearchResponseSchema(
            query_id=response.query_id,
            total_results=response.total_results,
            results=[result_to_schema(r) for r in response.results],
            search_time=response.search_time,
            sources_queried=response.sources_queried,
            confidence_scores=response.confidence_scores,
            metadata=response.metadata,
            timestamp=response.timestamp
        )
        
    except Exception as e:
        logger.error(f"Criminal records search failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/search/property", response_model=SearchResponseSchema)
async def search_property_records(
    request: PropertySearchRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    """
    Search for property and real estate records
    
    This endpoint searches:
    - Property ownership
    - Real estate transactions
    - Property assessments
    - Tax records
    - Liens and encumbrances
    - Property history
    """
    try:
        logger.info(f"Property search request from user {current_user.id}: {request}")
        
        # Validate request
        if not request.address and not request.property_id and not request.owner_name:
            raise HTTPException(
                status_code=400,
                detail="At least one search parameter (address, property_id, or owner_name) is required"
            )
        
        # Create search query with property-specific filters
        search_query = SearchQuery(
            query_id=str(uuid.uuid4()),
            query_type="property_search",
            parameters=request.dict(exclude_none=True),
            filters={
                'data_types': ['property_records', 'tax_records', 'financial_records'],
                'sources': ['property_records', 'tax_records', 'financial_records', 'court_records']
            },
            date_range=request.date_range.dict() if request.date_range else None,
            geographic_scope=request.geographic_scope.dict() if request.geographic_scope else None,
            confidence_threshold=request.confidence_threshold or 0.8,
            max_results=request.max_results or 100,
            user_id=current_user.id
        )
        
        # Execute search
        response = await search_engine.search(search_query)
        
        # Log search activity
        background_tasks.add_task(
            log_search_activity,
            current_user.id,
            "property_search",
            search_query.query_id,
            len(response.results)
        )
        
        return SearchResponseSchema(
            query_id=response.query_id,
            total_results=response.total_results,
            results=[result_to_schema(r) for r in response.results],
            search_time=response.search_time,
            sources_queried=response.sources_queried,
            confidence_scores=response.confidence_scores,
            metadata=response.metadata,
            timestamp=response.timestamp
        )
        
    except Exception as e:
        logger.error(f"Property search failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/search/advanced", response_model=SearchResponseSchema)
async def advanced_search(
    request: SearchRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    """
    Advanced search with custom parameters and filters
    
    This endpoint allows for:
    - Custom search parameters
    - Advanced filtering
    - Multiple data source selection
    - Custom confidence thresholds
    - Geographic and temporal constraints
    """
    try:
        logger.info(f"Advanced search request from user {current_user.id}: {request}")
        
        # Create search query
        search_query = SearchQuery(
            query_id=str(uuid.uuid4()),
            query_type="advanced_search",
            parameters=request.parameters,
            filters=request.filters.dict() if request.filters else {},
            date_range=request.date_range.dict() if request.date_range else None,
            geographic_scope=request.geographic_scope.dict() if request.geographic_scope else None,
            confidence_threshold=request.confidence_threshold or 0.7,
            max_results=request.max_results or 100,
            user_id=current_user.id
        )
        
        # Execute search
        response = await search_engine.advanced_search(search_query.dict())
        
        # Log search activity
        background_tasks.add_task(
            log_search_activity,
            current_user.id,
            "advanced_search",
            search_query.query_id,
            len(response.results)
        )
        
        return SearchResponseSchema(
            query_id=response.query_id,
            total_results=response.total_results,
            results=[result_to_schema(r) for r in response.results],
            search_time=response.search_time,
            sources_queried=response.sources_queried,
            confidence_scores=response.confidence_scores,
            metadata=response.metadata,
            timestamp=response.timestamp
        )
        
    except Exception as e:
        logger.error(f"Advanced search failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Utility endpoints
@app.get("/api/v1/search/{query_id}")
async def get_search_results(
    query_id: str,
    current_user: User = Depends(get_current_user)
):
    """Retrieve cached search results by query ID"""
    try:
        results = await search_engine.get_cached_results(query_id)
        
        if not results:
            raise HTTPException(status_code=404, detail="Search results not found")
        
        return {
            "query_id": query_id,
            "total_results": len(results),
            "results": [result_to_schema(r) for r in results],
            "cached": True,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Failed to retrieve cached results: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/sources")
async def get_data_sources(current_user: User = Depends(get_current_user)):
    """Get list of available data sources"""
    sources = [
        {
            "id": "court_records",
            "name": "Court Records",
            "description": "Public court records and legal documents",
            "reliability": 0.95,
            "update_frequency": "daily"
        },
        {
            "id": "property_records",
            "name": "Property Records",
            "description": "Real estate and property ownership records",
            "reliability": 0.90,
            "update_frequency": "weekly"
        },
        {
            "id": "business_records",
            "name": "Business Records",
            "description": "Business registration and corporate records",
            "reliability": 0.80,
            "update_frequency": "daily"
        },
        {
            "id": "criminal_records",
            "name": "Criminal Records",
            "description": "Criminal records and arrest records",
            "reliability": 0.95,
            "update_frequency": "real-time"
        },
        {
            "id": "social_media",
            "name": "Social Media",
            "description": "Public social media profiles and posts",
            "reliability": 0.60,
            "update_frequency": "real-time"
        },
        {
            "id": "government_apis",
            "name": "Government APIs",
            "description": "Various government APIs and public records",
            "reliability": 0.85,
            "update_frequency": "daily"
        }
    ]
    
    return {"sources": sources}

@app.get("/api/v1/status")
async def get_system_status(current_user: User = Depends(get_current_user)):
    """Get system status and health information"""
    try:
        # Check system components
        status = {
            "timestamp": datetime.now().isoformat(),
            "status": "operational",
            "components": {
                "search_engine": "operational",
                "data_sources": "operational",
                "database": "operational",
                "cache": "operational"
            },
            "performance": {
                "active_searches": 0,  # Would track actual active searches
                "cache_hit_rate": 0.85,  # Would calculate actual rate
                "average_response_time": 0.5  # Would track actual times
            }
        }
        
        return status
        
    except Exception as e:
        logger.error(f"Failed to get system status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Background tasks
async def log_search_activity(user_id: str, search_type: str, query_id: str, result_count: int):
    """Log search activity for audit purposes"""
    try:
        # This would log to a database or logging service
        logger.info(f"Search activity: User {user_id} performed {search_type} search {query_id}, found {result_count} results")
        
        # Add to audit log
        audit_entry = {
            "user_id": user_id,
            "search_type": search_type,
            "query_id": query_id,
            "result_count": result_count,
            "timestamp": datetime.now().isoformat(),
            "ip_address": "127.0.0.1"  # Would get actual IP
        }
        
        # Store in database or logging service
        # await audit_logger.log(audit_entry)
        
    except Exception as e:
        logger.error(f"Failed to log search activity: {e}")

# Helper functions
def result_to_schema(result: SearchResult) -> Dict[str, Any]:
    """Convert SearchResult to response schema"""
    return {
        "source": result.source,
        "data_type": result.data_type,
        "confidence": result.confidence,
        "raw_data": result.raw_data,
        "timestamp": result.timestamp.isoformat(),
        "metadata": result.metadata
    }

# Error handlers
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
