# Implementation Guide for Free Data Sources

## Overview
This guide provides practical implementation examples for integrating free data sources into the Advanced LEO Search Tool. All examples use **FREE APIs and services only**.

---

## 🚀 Quick Start

### 1. Environment Setup
```bash
# Copy the environment template
cp env.template .env

# Install dependencies
pip install -r requirements.txt

# Start services
docker-compose up -d
```

### 2. Get Free API Keys
- **Census API**: [https://api.census.gov/data/key_signup.html](https://api.census.gov/data/key_signup.html)
- **FEC API**: [https://api.open.fec.gov/developers/](https://api.open.fec.gov/developers/)
- **OpenCorporates**: [https://api.opencorporates.com/](https://api.opencorporates.com/)
- **OpenSecrets**: [https://www.opensecrets.org/api/](https://www.opensecrets.org/api/)

---

## 🏛️ Government APIs Implementation

### 1. US Census Bureau API

```python
import requests
from typing import Dict, Any

class CensusAPISource:
    """Free US Census Bureau data source"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.census.gov/data"
        self.session = requests.Session()
    
    async def search_person(self, name: str, state: str = None) -> Dict[str, Any]:
        """Search for person using Census data"""
        try:
            # Get demographic data by location
            params = {
                'get': 'NAME,POP,DENSITY,HOUSING_UNITS',
                'for': f'state:{state}' if state else 'state:*',
                'key': self.api_key
            }
            
            response = self.session.get(f"{self.base_url}/2020/dec/pl", params=params)
            response.raise_for_status()
            
            return {
                'source': 'census_bureau',
                'data': response.json(),
                'timestamp': datetime.now().isoformat()
            }
            
        except requests.RequestException as e:
            logger.error(f"Census API error: {e}")
            return None
```

### 2. Federal Election Commission (FEC) API

```python
class FECAPISource:
    """Free FEC campaign finance data source"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.open.fec.gov/v1"
        self.session = requests.Session()
    
    async def search_contributions(self, name: str) -> Dict[str, Any]:
        """Search for political contributions by name"""
        try:
            params = {
                'api_key': self.api_key,
                'contributor_name': name,
                'per_page': 100
            }
            
            response = self.session.get(f"{self.base_url}/schedules/schedule_a/", params=params)
            response.raise_for_status()
            
            return {
                'source': 'fec',
                'data': response.json(),
                'timestamp': datetime.now().isoformat()
            }
            
        except requests.RequestException as e:
            logger.error(f"FEC API error: {e}")
            return None
```

---

## 📊 Open Data APIs Implementation

### 1. OpenCorporates API

```python
class OpenCorporatesSource:
    """Free business data from OpenCorporates"""
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key
        self.base_url = "https://api.opencorporates.com"
        self.session = requests.Session()
    
    async def search_company(self, company_name: str) -> Dict[str, Any]:
        """Search for company information"""
        try:
            params = {
                'q': company_name,
                'api_token': self.api_key
            }
            
            response = self.session.get(f"{self.base_url}/companies/search", params=params)
            response.raise_for_status()
            
            return {
                'source': 'opencorporates',
                'data': response.json(),
                'timestamp': datetime.now().isoformat()
            }
            
        except requests.RequestException as e:
            logger.error(f"OpenCorporates API error: {e}")
            return None
```

### 2. OpenSecrets API

```python
class OpenSecretsSource:
    """Free political contribution data from OpenSecrets"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://www.opensecrets.org/api"
        self.session = requests.Session()
    
    async def search_contributions(self, name: str) -> Dict[str, Any]:
        """Search for political contributions"""
        try:
            params = {
                'apikey': self.api_key,
                'method': 'getOrgs',
                'org': name
            }
            
            response = self.session.get(f"{self.base_url}/", params=params)
            response.raise_for_status()
            
            return {
                'source': 'opensecrets',
                'data': response.json(),
                'timestamp': datetime.now().isoformat()
            }
            
        except requests.RequestException as e:
            logger.error(f"OpenSecrets API error: {e}")
            return None
```

---

## 🌐 Web Scraping Implementation

### 1. Respectful Web Scraper

```python
import asyncio
import aiohttp
from bs4 import BeautifulSoup
import time
from urllib.robotparser import RobotFileParser

class RespectfulWebScraper:
    """Web scraper that respects robots.txt and rate limits"""
    
    def __init__(self, delay_seconds: int = 2, user_agent: str = None):
        self.delay = delay_seconds
        self.user_agent = user_agent or "LEO-Search-Tool/1.0 (Educational/Research Use)"
        self.session = None
        self.last_request_time = 0
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession(
            headers={'User-Agent': self.user_agent}
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def can_scrape(self, url: str) -> bool:
        """Check if we can scrape a URL based on robots.txt"""
        try:
            rp = RobotFileParser()
            robots_url = f"{url.split('/')[0]}//{url.split('/')[2]}/robots.txt"
            rp.set_url(robots_url)
            rp.read()
            return rp.can_fetch(self.user_agent, url)
        except Exception:
            # If we can't read robots.txt, be conservative
            return False
    
    async def scrape_with_delay(self, url: str) -> str:
        """Scrape a URL with rate limiting"""
        # Respect rate limiting
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        if time_since_last < self.delay:
            await asyncio.sleep(self.delay - time_since_last)
        
        try:
            async with self.session.get(url) as response:
                response.raise_for_status()
                self.last_request_time = time.time()
                return await response.text()
        except Exception as e:
            logger.error(f"Scraping error for {url}: {e}")
            return None
```

### 2. Phone Directory Scraper

```python
class PhoneDirectoryScraper(RespectfulWebScraper):
    """Scrape phone directories for contact information"""
    
    async def search_whitepages(self, name: str, location: str = None) -> Dict[str, Any]:
        """Search Whitepages for contact information"""
        if not await self.can_scrape("https://www.whitepages.com"):
            return None
        
        try:
            # Construct search URL
            search_url = f"https://www.whitepages.com/name/{name}"
            if location:
                search_url += f"/{location}"
            
            html = await self.scrape_with_delay(search_url)
            if not html:
                return None
            
            # Parse results
            soup = BeautifulSoup(html, 'html.parser')
            results = []
            
            # Extract phone numbers and addresses
            phone_elements = soup.find_all('span', class_='phone')
            address_elements = soup.find_all('span', class_='address')
            
            for phone, address in zip(phone_elements, address_elements):
                results.append({
                    'phone': phone.get_text(strip=True),
                    'address': address.get_text(strip=True),
                    'source': 'whitepages'
                })
            
            return {
                'source': 'whitepages',
                'results': results,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Whitepages scraping error: {e}")
            return None
```

---

## 📱 Social Media Implementation

### 1. Twitter API v2 (Free Tier)

```python
import tweepy

class TwitterSource:
    """Twitter API v2 integration (free tier)"""
    
    def __init__(self, bearer_token: str):
        self.client = tweepy.Client(bearer_token=bearer_token)
    
    async def search_tweets(self, query: str, max_results: int = 100) -> Dict[str, Any]:
        """Search for tweets containing the query"""
        try:
            # Twitter API v2 search
            response = self.client.search_recent_tweets(
                query=query,
                max_results=min(max_results, 100),  # Free tier limit
                tweet_fields=['created_at', 'author_id', 'public_metrics']
            )
            
            if not response.data:
                return {'source': 'twitter', 'results': [], 'timestamp': datetime.now().isoformat()}
            
            results = []
            for tweet in response.data:
                results.append({
                    'id': tweet.id,
                    'text': tweet.text,
                    'created_at': tweet.created_at.isoformat(),
                    'author_id': tweet.author_id,
                    'metrics': tweet.public_metrics
                })
            
            return {
                'source': 'twitter',
                'results': results,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Twitter API error: {e}")
            return None
```

### 2. Public Profile Scraper

```python
class PublicProfileScraper(RespectfulWebScraper):
    """Scrape public social media profiles"""
    
    async def scrape_linkedin_public(self, company_name: str) -> Dict[str, Any]:
        """Scrape public LinkedIn company page"""
        if not await self.can_scrape("https://www.linkedin.com"):
            return None
        
        try:
            search_url = f"https://www.linkedin.com/company/{company_name.lower().replace(' ', '-')}"
            html = await self.scrape_with_delay(search_url)
            
            if not html:
                return None
            
            soup = BeautifulSoup(html, 'html.parser')
            
            # Extract company information
            company_info = {}
            
            # Company name
            name_elem = soup.find('h1', class_='org-top-card-summary__title')
            if name_elem:
                company_info['name'] = name_elem.get_text(strip=True)
            
            # Company description
            desc_elem = soup.find('p', class_='org-top-card-summary__tagline')
            if desc_elem:
                company_info['description'] = desc_elem.get_text(strip=True)
            
            # Company size
            size_elem = soup.find('dd', class_='org-about-company-module__company-size-definition-text')
            if size_elem:
                company_info['size'] = size_elem.get_text(strip=True)
            
            return {
                'source': 'linkedin_public',
                'data': company_info,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"LinkedIn scraping error: {e}")
            return None
```

---

## 🗺️ Geolocation Services Implementation

### 1. OpenStreetMap Nominatim

```python
class NominatimGeocoder:
    """Free geocoding using OpenStreetMap Nominatim"""
    
    def __init__(self, user_agent: str):
        self.user_agent = user_agent
        self.base_url = "https://nominatim.openstreetmap.org"
        self.session = requests.Session()
        self.session.headers.update({'User-Agent': user_agent})
    
    async def geocode(self, address: str) -> Dict[str, Any]:
        """Geocode an address to coordinates"""
        try:
            params = {
                'q': address,
                'format': 'json',
                'limit': 1
            }
            
            response = self.session.get(f"{self.base_url}/search", params=params)
            response.raise_for_status()
            
            data = response.json()
            if not data:
                return None
            
            result = data[0]
            return {
                'source': 'nominatim',
                'latitude': float(result['lat']),
                'longitude': float(result['lon']),
                'display_name': result['display_name'],
                'address': result['address'],
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Nominatim geocoding error: {e}")
            return None
    
    async def reverse_geocode(self, lat: float, lon: float) -> Dict[str, Any]:
        """Reverse geocode coordinates to address"""
        try:
            params = {
                'lat': lat,
                'lon': lon,
                'format': 'json'
            }
            
            response = self.session.get(f"{self.base_url}/reverse", params=params)
            response.raise_for_status()
            
            result = response.json()
            return {
                'source': 'nominatim',
                'address': result['display_name'],
                'address_details': result['address'],
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Nominatim reverse geocoding error: {e}")
            return None
```

### 2. MapBox Free Tier

```python
class MapBoxGeocoder:
    """MapBox geocoding (free tier - 50,000 requests/month)"""
    
    def __init__(self, access_token: str):
        self.access_token = access_token
        self.base_url = "https://api.mapbox.com/geocoding/v5/mapbox.places"
        self.session = requests.Session()
    
    async def geocode(self, address: str) -> Dict[str, Any]:
        """Geocode an address using MapBox"""
        try:
            params = {
                'access_token': self.access_token,
                'q': address,
                'limit': 1
            }
            
            response = self.session.get(f"{self.base_url}/{address}.json", params=params)
            response.raise_for_status()
            
            data = response.json()
            if not data.get('features'):
                return None
            
            feature = data['features'][0]
            return {
                'source': 'mapbox',
                'latitude': feature['center'][1],
                'longitude': feature['center'][0],
                'display_name': feature['place_name'],
                'confidence': feature.get('relevance', 0),
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"MapBox geocoding error: {e}")
            return None
```

---

## 🔍 Data Source Integration

### 1. Unified Data Source Manager

```python
class FreeDataSourceManager:
    """Manages all free data sources with fallback strategies"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.sources = {}
        self.initialize_sources()
    
    def initialize_sources(self):
        """Initialize all free data sources"""
        # Government APIs
        if self.config.get('census_api_key'):
            self.sources['census'] = CensusAPISource(self.config['census_api_key'])
        
        if self.config.get('fec_api_key'):
            self.sources['fec'] = FECAPISource(self.config['fec_api_key'])
        
        # Open Data APIs
        if self.config.get('opencorporates_api_key'):
            self.sources['opencorporates'] = OpenCorporatesSource(self.config['opencorporates_api_key'])
        
        if self.config.get('opensecrets_api_key'):
            self.sources['opensecrets'] = OpenSecretsSource(self.config['opensecrets_api_key'])
        
        # Web Scraping
        if self.config.get('enable_web_scraping'):
            self.sources['phone_directory'] = PhoneDirectoryScraper(
                delay_seconds=self.config.get('scraping_delay_seconds', 2)
            )
            self.sources['public_profiles'] = PublicProfileScraper(
                delay_seconds=self.config.get('scraping_delay_seconds', 2)
            )
        
        # Social Media
        if self.config.get('twitter_bearer_token'):
            self.sources['twitter'] = TwitterSource(self.config['twitter_bearer_token'])
        
        # Geolocation
        if self.config.get('enable_geocoding'):
            self.sources['nominatim'] = NominatimGeocoder(
                self.config.get('nominatim_user_agent', 'LEO-Search-Tool/1.0')
            )
            
            if self.config.get('mapbox_access_token'):
                self.sources['mapbox'] = MapBoxGeocoder(self.config['mapbox_access_token'])
    
    async def search_all_sources(self, query: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Search across all available free data sources"""
        tasks = []
        
        for source_name, source in self.sources.items():
            if hasattr(source, 'search') and callable(getattr(source, 'search')):
                task = source.search(query)
                tasks.append(task)
        
        # Execute searches concurrently
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Process results
        all_results = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                logger.error(f"Source {list(self.sources.keys())[i]} failed: {result}")
                continue
            if result:
                all_results.append(result)
        
        return all_results
```

---

## 📊 Data Processing & Correlation

### 1. Result Correlation Engine

```python
class FreeDataCorrelationEngine:
    """Correlates results from multiple free data sources"""
    
    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")
    
    def correlate_results(self, results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Correlate and merge results from different sources"""
        correlated = []
        processed = set()
        
        for i, result1 in enumerate(results):
            if i in processed:
                continue
            
            correlated_result = {
                'sources': [result1['source']],
                'data': result1['data'],
                'confidence': self._calculate_confidence(result1),
                'correlations': []
            }
            
            # Find correlations with other results
            for j, result2 in enumerate(results[i+1:], i+1):
                if j in processed:
                    continue
                
                similarity = self._calculate_similarity(result1, result2)
                if similarity > 0.8:  # High similarity threshold
                    correlated_result['sources'].append(result2['source'])
                    correlated_result['correlations'].append({
                        'source': result2['source'],
                        'similarity': similarity
                    })
                    processed.add(j)
            
            correlated.append(correlated_result)
            processed.add(i)
        
        return correlated
    
    def _calculate_similarity(self, result1: Dict, result2: Dict) -> float:
        """Calculate similarity between two results"""
        # Implement similarity calculation logic
        # This could use NLP, fuzzy matching, etc.
        return 0.0  # Placeholder
    
    def _calculate_confidence(self, result: Dict) -> float:
        """Calculate confidence score for a result"""
        # Base confidence on source reliability and data quality
        source_confidence = {
            'census': 0.95,
            'fec': 0.90,
            'opencorporates': 0.85,
            'opensecrets': 0.85,
            'twitter': 0.70,
            'whitepages': 0.60,
            'linkedin_public': 0.75
        }
        
        return source_confidence.get(result['source'], 0.50)
```

---

## 🚀 Usage Examples

### 1. Basic Search

```python
# Initialize the data source manager
config = {
    'census_api_key': 'your-census-key',
    'fec_api_key': 'your-fec-key',
    'enable_web_scraping': True,
    'scraping_delay_seconds': 2
}

manager = FreeDataSourceManager(config)

# Search for a person
query = {
    'name': 'John Smith',
    'location': 'New York'
}

results = await manager.search_all_sources(query)
print(f"Found {len(results)} results from {len(manager.sources)} sources")
```

### 2. Company Search

```python
# Search for company information
company_query = {
    'company_name': 'Acme Corporation',
    'search_type': 'business'
}

company_results = await manager.search_all_sources(company_query)

# Correlate results
correlation_engine = FreeDataCorrelationEngine()
correlated_results = correlation_engine.correlate_results(company_results)

for result in correlated_results:
    print(f"Sources: {', '.join(result['sources'])}")
    print(f"Confidence: {result['confidence']:.2f}")
    print(f"Data: {result['data']}")
    print("---")
```

---

## 📋 Best Practices

### 1. Rate Limiting
- Implement delays between requests
- Respect API rate limits
- Use exponential backoff for failures

### 2. Error Handling
- Gracefully handle API failures
- Implement fallback strategies
- Log all errors for debugging

### 3. Data Quality
- Validate data from all sources
- Cross-reference information
- Implement confidence scoring

### 4. Legal Compliance
- Respect robots.txt
- Follow API terms of service
- Implement proper user consent

---

## 🎯 Next Steps

1. **Get API Keys**: Sign up for free API keys
2. **Test Sources**: Verify each data source works
3. **Implement Rate Limiting**: Add proper delays and limits
4. **Add Error Handling**: Implement robust error handling
5. **Test Integration**: Verify all sources work together
6. **Monitor Usage**: Track API usage and rate limits

---

## 📚 Additional Resources

- [Census API Examples](https://www.census.gov/data/developers/data-sets.html)
- [FEC API Documentation](https://api.open.fec.gov/developers/)
- [OpenCorporates API Guide](https://api.opencorporates.com/)
- [Web Scraping Best Practices](https://www.scrapingbee.com/blog/web-scraping-ethics/)
