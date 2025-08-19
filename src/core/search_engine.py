"""
Advanced Search Engine for LEO Search Tool
Coordinates all data sources and provides sophisticated search capabilities
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass, field
from datetime import datetime, timedelta
import json
import hashlib
from concurrent.futures import ThreadPoolExecutor
import pandas as pd
from elasticsearch import Elasticsearch
from redis import Redis
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import spacy
import re

from .data_sources import DataSourceManager, SearchResult

logger = logging.getLogger(__name__)

@dataclass
class SearchQuery:
    """Structured search query with validation"""
    query_id: str
    query_type: str
    parameters: Dict[str, Any]
    filters: Dict[str, Any] = field(default_factory=dict)
    date_range: Optional[Dict[str, datetime]] = None
    geographic_scope: Optional[Dict[str, Any]] = None
    confidence_threshold: float = 0.7
    max_results: int = 100
    user_id: Optional[str] = None
    timestamp: datetime = field(default_factory=datetime.now)
    
    def __post_init__(self):
        if not self.query_id:
            self.query_id = self._generate_query_id()
    
    def _generate_query_id(self) -> str:
        """Generate unique query ID"""
        content = f"{self.query_type}_{self.timestamp.isoformat()}_{self.user_id or 'anonymous'}"
        return hashlib.md5(content.encode()).hexdigest()

@dataclass
class SearchResponse:
    """Comprehensive search response"""
    query_id: str
    total_results: int
    results: List[SearchResult]
    search_time: float
    sources_queried: List[str]
    confidence_scores: Dict[str, float]
    metadata: Dict[str, Any]
    timestamp: datetime = field(default_factory=datetime.now)

class AdvancedSearchEngine:
    """Advanced search engine with AI-powered matching and data correlation"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.data_source_manager = DataSourceManager(config)
        self.elasticsearch = Elasticsearch(config.get('elasticsearch_url', 'http://localhost:9200'))
        self.redis = Redis.from_url(config.get('redis_url', 'redis://localhost:6379'))
        self.nlp = spacy.load("en_core_web_sm")
        self.executor = ThreadPoolExecutor(max_workers=20)
        
        # Initialize AI models
        self.vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        self.similarity_cache = {}
        
        # Search patterns and rules
        self.search_patterns = self._initialize_search_patterns()
        
    def _initialize_search_patterns(self) -> Dict[str, Any]:
        """Initialize search patterns and rules"""
        return {
            'name_variations': {
                'first_last': r'^(\w+)\s+(\w+)$',
                'last_first': r'^(\w+),\s*(\w+)$',
                'middle_initial': r'^(\w+)\s+(\w\.)\s+(\w+)$',
                'full_name': r'^(\w+)\s+(\w+)\s+(\w+)$'
            },
            'phone_formats': {
                'us_standard': r'^(\d{3})-(\d{3})-(\d{4})$',
                'us_compact': r'^(\d{10})$',
                'international': r'^\+(\d{1,3})\s*(\d{1,4})\s*(\d{1,4})\s*(\d{1,4})$'
            },
            'email_patterns': {
                'standard': r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
                'business': r'^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$'
            }
        }
    
    async def search(self, query: Union[Dict[str, Any], SearchQuery]) -> SearchResponse:
        """Main search method with advanced capabilities"""
        start_time = datetime.now()
        
        # Convert dict to SearchQuery if needed
        if isinstance(query, dict):
            query = SearchQuery(**query)
        
        # Validate and enhance query
        enhanced_query = await self._enhance_query(query)
        
        # Execute search across all sources
        raw_results = await self._execute_search(enhanced_query)
        
        # Process and correlate results
        processed_results = await self._process_results(raw_results, enhanced_query)
        
        # Apply AI-powered matching and scoring
        scored_results = await self._apply_ai_scoring(processed_results, enhanced_query)
        
        # Filter and rank results
        final_results = await self._filter_and_rank_results(scored_results, enhanced_query)
        
        # Cache results
        await self._cache_results(query.query_id, final_results)
        
        search_time = (datetime.now() - start_time).total_seconds()
        
        return SearchResponse(
            query_id=query.query_id,
            total_results=len(final_results),
            results=final_results,
            search_time=search_time,
            sources_queried=list(set(r.source for r in final_results)),
            confidence_scores={r.source: r.confidence for r in final_results},
            metadata={
                'query_enhancement': enhanced_query.parameters,
                'ai_scoring_applied': True,
                'results_cached': True
            }
        )
    
    async def _enhance_query(self, query: SearchQuery) -> SearchQuery:
        """Enhance search query with additional parameters and validation"""
        enhanced_params = query.parameters.copy()
        
        # Name enhancement
        if 'name' in enhanced_params:
            enhanced_params.update(self._enhance_name_search(enhanced_params['name']))
        
        # Phone enhancement
        if 'phone' in enhanced_params:
            enhanced_params.update(self._enhance_phone_search(enhanced_params['phone']))
        
        # Email enhancement
        if 'email' in enhanced_params:
            enhanced_params.update(self._enhance_email_search(enhanced_params['email']))
        
        # Address enhancement
        if 'address' in enhanced_params:
            enhanced_params.update(await self._enhance_address_search(enhanced_params['address']))
        
        # Geographic scope enhancement
        if query.geographic_scope:
            enhanced_params.update(await self._enhance_geographic_scope(query.geographic_scope))
        
        query.parameters = enhanced_params
        return query
    
    def _enhance_name_search(self, name: str) -> Dict[str, Any]:
        """Enhance name search with variations and patterns"""
        enhancements = {}
        
        # Parse name components
        name_parts = name.strip().split()
        if len(name_parts) >= 2:
            enhancements['first_name'] = name_parts[0]
            enhancements['last_name'] = name_parts[-1]
            if len(name_parts) > 2:
                enhancements['middle_names'] = name_parts[1:-1]
        
        # Generate name variations
        enhancements['name_variations'] = [
            name,
            name.replace(' ', ''),
            ' '.join(name_parts[::-1]),  # Last, First
            name.lower(),
            name.upper()
        ]
        
        # Add phonetic variations
        enhancements['phonetic_variations'] = self._generate_phonetic_variations(name)
        
        return enhancements
    
    def _enhance_phone_search(self, phone: str) -> Dict[str, Any]:
        """Enhance phone search with different formats"""
        enhancements = {}
        
        # Clean phone number
        clean_phone = re.sub(r'[^\d+]', '', phone)
        enhancements['clean_phone'] = clean_phone
        
        # Generate phone variations
        if len(clean_phone) == 10:
            enhancements['phone_variations'] = [
                clean_phone,
                f"{clean_phone[:3]}-{clean_phone[3:6]}-{clean_phone[6:]}",
                f"({clean_phone[:3]}) {clean_phone[3:6]}-{clean_phone[6:]}",
                f"+1{clean_phone}"
            ]
        
        return enhancements
    
    def _enhance_email_search(self, email: str) -> Dict[str, Any]:
        """Enhance email search with domain analysis"""
        enhancements = {}
        
        if '@' in email:
            username, domain = email.split('@')
            enhancements['email_username'] = username
            enhancements['email_domain'] = domain
            enhancements['email_variations'] = [
                email,
                email.lower(),
                f"{username}@{domain.lower()}",
                f"{username.lower()}@{domain.lower()}"
            ]
        
        return enhancements
    
    async def _enhance_address_search(self, address: str) -> Dict[str, Any]:
        """Enhance address search with geocoding and parsing"""
        enhancements = {}
        
        try:
            # Parse address components
            parsed = self._parse_address(address)
            enhancements.update(parsed)
            
            # Geocoding
            geocoded = await self._geocode_address(address)
            if geocoded:
                enhancements.update(geocoded)
                
        except Exception as e:
            logger.warning(f"Address enhancement failed: {e}")
        
        return enhancements
    
    def _parse_address(self, address: str) -> Dict[str, Any]:
        """Parse address into components"""
        # Basic address parsing
        parts = address.split(',')
        parsed = {
            'street_address': parts[0].strip() if parts else '',
            'city': parts[1].strip() if len(parts) > 1 else '',
            'state': parts[2].strip() if len(parts) > 2 else '',
            'zip_code': parts[3].strip() if len(parts) > 3 else ''
        }
        
        # Extract ZIP code pattern
        zip_match = re.search(r'\b\d{5}(?:-\d{4})?\b', address)
        if zip_match:
            parsed['zip_code'] = zip_match.group()
        
        return parsed
    
    async def _geocode_address(self, address: str) -> Dict[str, Any]:
        """Geocode address for enhanced search"""
        try:
            # This would integrate with geocoding services
            # For now, return basic structure
            return {
                'latitude': None,
                'longitude': None,
                'geographic_region': None
            }
        except Exception as e:
            logger.warning(f"Geocoding failed: {e}")
            return {}
    
    async def _enhance_geographic_scope(self, scope: Dict[str, Any]) -> Dict[str, Any]:
        """Enhance geographic scope with additional parameters"""
        enhancements = {}
        
        if 'zip_code' in scope:
            enhancements['zip_radius'] = await self._get_zip_radius(scope['zip_code'])
        
        if 'city' in scope:
            enhancements['city_metro_area'] = await self._get_metro_area(scope['city'])
        
        return enhancements
    
    async def _execute_search(self, query: SearchQuery) -> List[SearchResult]:
        """Execute search across all data sources"""
        try:
            # Search all data sources concurrently
            results = await self.data_source_manager.search_all_sources(query.parameters)
            
            # Apply query filters
            filtered_results = self._apply_query_filters(results, query.filters)
            
            return filtered_results
            
        except Exception as e:
            logger.error(f"Search execution failed: {e}")
            return []
    
    def _apply_query_filters(self, results: List[SearchResult], filters: Dict[str, Any]) -> List[SearchResult]:
        """Apply query filters to results"""
        filtered = results
        
        # Date range filter
        if 'date_range' in filters:
            start_date = filters['date_range'].get('start')
            end_date = filters['date_range'].get('end')
            if start_date or end_date:
                filtered = [
                    r for r in filtered
                    if (not start_date or r.timestamp >= start_date) and
                       (not end_date or r.timestamp <= end_date)
                ]
        
        # Source filter
        if 'sources' in filters:
            allowed_sources = filters['sources']
            filtered = [r for r in filtered if r.source in allowed_sources]
        
        # Data type filter
        if 'data_types' in filters:
            allowed_types = filters['data_types']
            filtered = [r for r in filtered if r.data_type in allowed_types]
        
        return filtered
    
    async def _process_results(self, results: List[SearchResult], query: SearchQuery) -> List[SearchResult]:
        """Process and correlate search results"""
        processed = []
        
        # Group results by entity
        entity_groups = self._group_results_by_entity(results)
        
        # Process each entity group
        for entity_id, group_results in entity_groups.items():
            processed_group = await self._process_entity_group(entity_id, group_results, query)
            processed.extend(processed_group)
        
        return processed
    
    def _group_results_by_entity(self, results: List[SearchResult]) -> Dict[str, List[SearchResult]]:
        """Group results by entity using similarity matching"""
        groups = {}
        
        for result in results:
            # Find best matching group
            best_group = None
            best_similarity = 0
            
            for group_id, group_results in groups.items():
                similarity = self._calculate_entity_similarity(result, group_results[0])
                if similarity > best_similarity and similarity > 0.8:
                    best_similarity = similarity
                    best_group = group_id
            
            if best_group:
                groups[best_group].append(result)
            else:
                # Create new group
                new_group_id = f"entity_{len(groups)}"
                groups[new_group_id] = [result]
        
        return groups
    
    def _calculate_entity_similarity(self, result1: SearchResult, result2: SearchResult) -> float:
        """Calculate similarity between two results"""
        # Extract key fields for comparison
        fields1 = self._extract_comparison_fields(result1)
        fields2 = self._extract_comparison_fields(result2)
        
        # Calculate field-level similarities
        similarities = []
        for field in ['name', 'email', 'phone', 'address']:
            if field in fields1 and field in fields2:
                sim = self._calculate_field_similarity(fields1[field], fields2[field])
                similarities.append(sim)
        
        # Return average similarity
        return np.mean(similarities) if similarities else 0.0
    
    def _extract_comparison_fields(self, result: SearchResult) -> Dict[str, Any]:
        """Extract fields for entity comparison"""
        fields = {}
        
        # Extract from raw_data
        raw = result.raw_data
        
        if 'name' in raw:
            fields['name'] = raw['name']
        if 'email' in raw:
            fields['email'] = raw['email']
        if 'phone' in raw:
            fields['phone'] = raw['phone']
        if 'address' in raw:
            fields['address'] = raw['address']
        
        return fields
    
    def _calculate_field_similarity(self, value1: Any, value2: Any) -> float:
        """Calculate similarity between two field values"""
        if not value1 or not value2:
            return 0.0
        
        # Convert to strings for comparison
        str1 = str(value1).lower().strip()
        str2 = str(value2).lower().strip()
        
        if str1 == str2:
            return 1.0
        
        # Use NLP similarity for names
        if len(str1.split()) > 1 and len(str2.split()) > 1:
            doc1 = self.nlp(str1)
            doc2 = self.nlp(str2)
            return doc1.similarity(doc2)
        
        # Use edit distance for other fields
        return self._levenshtein_similarity(str1, str2)
    
    def _levenshtein_similarity(self, str1: str, str2: str) -> float:
        """Calculate Levenshtein distance-based similarity"""
        if len(str1) < len(str2):
            str1, str2 = str2, str1
        
        if len(str2) == 0:
            return 0.0
        
        previous_row = list(range(len(str2) + 1))
        for i, c1 in enumerate(str1):
            current_row = [i + 1]
            for j, c2 in enumerate(str2):
                insertions = previous_row[j + 1] + 1
                deletions = current_row[j] + 1
                substitutions = previous_row[j] + (c1 != c2)
                current_row.append(min(insertions, deletions, substitutions))
            previous_row = current_row
        
        max_len = max(len(str1), len(str2))
        distance = previous_row[-1]
        return 1.0 - (distance / max_len)
    
    async def _process_entity_group(self, entity_id: str, group_results: List[SearchResult], query: SearchQuery) -> List[SearchResult]:
        """Process a group of results for the same entity"""
        processed = []
        
        # Merge duplicate information
        merged_data = self._merge_entity_data(group_results)
        
        # Create enhanced result
        enhanced_result = SearchResult(
            source="entity_correlation",
            data_type="correlated_entity",
            confidence=np.mean([r.confidence for r in group_results]),
            raw_data=merged_data,
            timestamp=datetime.now(),
            metadata={
                'entity_id': entity_id,
                'source_count': len(group_results),
                'sources': [r.source for r in group_results],
                'correlation_method': 'ai_enhanced'
            }
        )
        
        processed.append(enhanced_result)
        
        # Add individual results with correlation metadata
        for result in group_results:
            result.metadata['correlated_entity_id'] = entity_id
            result.metadata['correlation_confidence'] = enhanced_result.confidence
            processed.append(result)
        
        return processed
    
    def _merge_entity_data(self, results: List[SearchResult]) -> Dict[str, Any]:
        """Merge data from multiple results for the same entity"""
        merged = {}
        
        for result in results:
            for key, value in result.raw_data.items():
                if key not in merged:
                    merged[key] = value
                elif isinstance(value, list) and isinstance(merged[key], list):
                    merged[key].extend(value)
                elif isinstance(value, dict) and isinstance(merged[key], dict):
                    merged[key].update(value)
        
        return merged
    
    async def _apply_ai_scoring(self, results: List[SearchResult], query: SearchQuery) -> List[SearchResult]:
        """Apply AI-powered scoring to results"""
        scored_results = []
        
        for result in results:
            # Calculate AI-enhanced confidence score
            ai_score = await self._calculate_ai_confidence(result, query)
            
            # Update result confidence
            result.confidence = (result.confidence + ai_score) / 2
            
            # Add AI scoring metadata
            result.metadata['ai_score'] = ai_score
            result.metadata['ai_scoring_method'] = 'multi_factor_analysis'
            
            scored_results.append(result)
        
        return scored_results
    
    async def _calculate_ai_confidence(self, result: SearchResult, query: SearchQuery) -> float:
        """Calculate AI-enhanced confidence score"""
        score = 0.0
        
        # Data quality scoring
        quality_score = self._assess_data_quality(result)
        score += quality_score * 0.3
        
        # Relevance scoring
        relevance_score = self._assess_relevance(result, query)
        score += relevance_score * 0.4
        
        # Source reliability scoring
        reliability_score = self._assess_source_reliability(result.source)
        score += reliability_score * 0.3
        
        return min(score, 1.0)
    
    def _assess_data_quality(self, result: SearchResult) -> float:
        """Assess the quality of data in a result"""
        quality_score = 0.0
        
        raw_data = result.raw_data
        
        # Completeness scoring
        required_fields = ['name', 'email', 'phone', 'address']
        completeness = sum(1 for field in required_fields if field in raw_data) / len(required_fields)
        quality_score += completeness * 0.4
        
        # Data freshness scoring
        if 'timestamp' in raw_data:
            age = datetime.now() - raw_data['timestamp']
            freshness = max(0, 1 - (age.days / 365))  # Decay over a year
            quality_score += freshness * 0.3
        
        # Data consistency scoring
        consistency = self._assess_data_consistency(raw_data)
        quality_score += consistency * 0.3
        
        return quality_score
    
    def _assess_data_consistency(self, data: Dict[str, Any]) -> float:
        """Assess consistency of data fields"""
        consistency_score = 0.0
        
        # Check for conflicting information
        conflicts = 0
        total_checks = 0
        
        # Name consistency
        if 'name' in data and 'email' in data:
            total_checks += 1
            email_name = data['email'].split('@')[0] if '@' in data['email'] else ''
            if email_name and data['name'].lower() not in email_name.lower():
                conflicts += 1
        
        # Phone format consistency
        if 'phone' in data:
            total_checks += 1
            phone = str(data['phone'])
            if not re.match(r'^\+?[\d\s\-\(\)]+$', phone):
                conflicts += 1
        
        if total_checks > 0:
            consistency_score = 1 - (conflicts / total_checks)
        
        return consistency_score
    
    def _assess_relevance(self, result: SearchResult, query: SearchQuery) -> float:
        """Assess relevance of result to query"""
        relevance_score = 0.0
        
        query_params = query.parameters
        result_data = result.raw_data
        
        # Exact match scoring
        exact_matches = 0
        total_fields = 0
        
        for field in ['name', 'email', 'phone', 'address']:
            if field in query_params and field in result_data:
                total_fields += 1
                if str(query_params[field]).lower() == str(result_data[field]).lower():
                    exact_matches += 1
        
        if total_fields > 0:
            relevance_score += (exact_matches / total_fields) * 0.6
        
        # Partial match scoring
        partial_matches = 0
        for field in ['name', 'email', 'phone', 'address']:
            if field in query_params and field in result_data:
                query_val = str(query_params[field]).lower()
                result_val = str(result_data[field]).lower()
                
                if query_val in result_val or result_val in query_val:
                    partial_matches += 1
        
        if total_fields > 0:
            relevance_score += (partial_matches / total_fields) * 0.4
        
        return relevance_score
    
    def _assess_source_reliability(self, source: str) -> float:
        """Assess reliability of a data source"""
        # Source reliability scores (would be configurable)
        reliability_scores = {
            'court_records': 0.95,
            'property_records': 0.90,
            'government_apis': 0.85,
            'business_records': 0.80,
            'phone_directories': 0.75,
            'social_media': 0.60,
            'news_media': 0.70,
            'entity_correlation': 0.85
        }
        
        return reliability_scores.get(source, 0.50)
    
    async def _filter_and_rank_results(self, results: List[SearchResult], query: SearchQuery) -> List[SearchResult]:
        """Filter and rank results based on query criteria"""
        # Apply confidence threshold
        filtered = [r for r in results if r.confidence >= query.confidence_threshold]
        
        # Sort by confidence and relevance
        filtered.sort(key=lambda x: (x.confidence, x.metadata.get('ai_score', 0)), reverse=True)
        
        # Limit results
        if query.max_results:
            filtered = filtered[:query.max_results]
        
        return filtered
    
    async def _cache_results(self, query_id: str, results: List[SearchResult]):
        """Cache search results for future use"""
        try:
            cache_data = {
                'results': [self._serialize_result(r) for r in results],
                'timestamp': datetime.now().isoformat(),
                'count': len(results)
            }
            
            # Cache in Redis
            self.redis.setex(
                f"search_results:{query_id}",
                3600,  # 1 hour TTL
                json.dumps(cache_data)
            )
            
            # Index in Elasticsearch
            await self._index_results_elasticsearch(query_id, results)
            
        except Exception as e:
            logger.error(f"Failed to cache results: {e}")
    
    def _serialize_result(self, result: SearchResult) -> Dict[str, Any]:
        """Serialize SearchResult for caching"""
        return {
            'source': result.source,
            'data_type': result.data_type,
            'confidence': result.confidence,
            'raw_data': result.raw_data,
            'timestamp': result.timestamp.isoformat(),
            'metadata': result.metadata
        }
    
    async def _index_results_elasticsearch(self, query_id: str, results: List[SearchResult]):
        """Index results in Elasticsearch for advanced search"""
        try:
            for i, result in enumerate(results):
                doc = {
                    'query_id': query_id,
                    'source': result.source,
                    'data_type': result.data_type,
                    'confidence': result.confidence,
                    'raw_data': result.raw_data,
                    'timestamp': result.timestamp,
                    'metadata': result.metadata,
                    'search_text': self._extract_searchable_text(result)
                }
                
                self.elasticsearch.index(
                    index='leo_search_results',
                    id=f"{query_id}_{i}",
                    body=doc
                )
                
        except Exception as e:
            logger.error(f"Failed to index results in Elasticsearch: {e}")
    
    def _extract_searchable_text(self, result: SearchResult) -> str:
        """Extract searchable text from result"""
        text_parts = []
        
        # Extract text from raw_data
        for key, value in result.raw_data.items():
            if isinstance(value, str):
                text_parts.append(value)
            elif isinstance(value, (list, tuple)):
                text_parts.extend([str(v) for v in value if isinstance(v, str)])
        
        return ' '.join(text_parts)
    
    async def get_cached_results(self, query_id: str) -> Optional[List[SearchResult]]:
        """Retrieve cached search results"""
        try:
            cached = self.redis.get(f"search_results:{query_id}")
            if cached:
                cache_data = json.loads(cached)
                results = []
                
                for result_data in cache_data['results']:
                    result = SearchResult(
                        source=result_data['source'],
                        data_type=result_data['data_type'],
                        confidence=result_data['confidence'],
                        raw_data=result_data['raw_data'],
                        timestamp=datetime.fromisoformat(result_data['timestamp']),
                        metadata=result_data['metadata']
                    )
                    results.append(result)
                
                return results
                
        except Exception as e:
            logger.error(f"Failed to retrieve cached results: {e}")
        
        return None
    
    async def advanced_search(self, query: Dict[str, Any]) -> SearchResponse:
        """Advanced search with additional capabilities"""
        # Check cache first
        if 'query_id' in query:
            cached = await self.get_cached_results(query['query_id'])
            if cached:
                return SearchResponse(
                    query_id=query['query_id'],
                    total_results=len(cached),
                    results=cached,
                    search_time=0.0,
                    sources_queried=list(set(r.source for r in cached)),
                    confidence_scores={r.source: r.confidence for r in cached},
                    metadata={'cached': True},
                    timestamp=datetime.now()
                )
        
        # Perform new search
        return await self.search(query)
