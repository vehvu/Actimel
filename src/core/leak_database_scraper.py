"""
Leak Database Scraper - NO API KEYS REQUIRED
Accesses already scraped leak databases and scrapes new ones
"""

import asyncio
import aiohttp
import logging
from typing import Dict, List, Optional, Any, Set
from dataclasses import dataclass
from datetime import datetime
import json
import re
import hashlib
import sqlite3
from pathlib import Path
from bs4 import BeautifulSoup
import csv
import gzip
import zipfile
from urllib.parse import urljoin, urlparse, quote_plus
import time

logger = logging.getLogger(__name__)

@dataclass
class LeakRecord:
    """Individual leak record"""
    email: str
    password: Optional[str] = None
    username: Optional[str] = None
    domain: Optional[str] = None
    breach_name: Optional[str] = None
    breach_date: Optional[str] = None
    source: str = ""
    confidence: float = 0.0
    timestamp: datetime = None

@dataclass
class BreachInfo:
    """Breach metadata"""
    name: str
    date: str
    records_count: int
    description: str
    source: str
    url: str

class LeakDatabaseScraper:
    """Scrapes leak databases and breach collections - NO API KEYS"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.session = None
        self.db_path = Path(config.get('leak_db_path', './data/leaks.db'))
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self.initialize_database()
        
        # Known breach sources
        self.breach_sources = {
            'haveibeenpwned': 'https://haveibeenpwned.com/PwnedWebsites',
            'breachdirectory': 'https://github.com/hmaverickadams/breach-parse',
            'leakcheck': 'https://leakcheck.io/',
            'dehashed': 'https://dehashed.com/',
            'snusbase': 'https://snusbase.com/',
            'pastebin': 'https://pastebin.com/',
            'github_dumps': 'https://github.com/search?q=breach+data',
            'telegram_channels': 'https://t.me/s/breachdata',
            'dark_web_forums': 'http://zqktlwiuavvvqqt4ybvgvi7tyo4hjl5xgfuvpdf6otjiycgwqbym2qad.onion/',
        }
    
    def initialize_database(self):
        """Initialize SQLite database for storing leak data"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create tables
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS leak_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL,
                password TEXT,
                username TEXT,
                domain TEXT,
                breach_name TEXT,
                breach_date TEXT,
                source TEXT,
                confidence REAL,
                timestamp TEXT,
                hash TEXT UNIQUE
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS breach_info (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE,
                date TEXT,
                records_count INTEGER,
                description TEXT,
                source TEXT,
                url TEXT,
                last_updated TEXT
            )
        ''')
        
        # Create indexes
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_email ON leak_records(email)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_domain ON leak_records(domain)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_breach_name ON leak_records(breach_name)')
        
        conn.commit()
        conn.close()
    
    async def __aenter__(self):
        """Initialize async HTTP session"""
        self.session = aiohttp.ClientSession(
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive',
            }
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Clean up async session"""
        if self.session:
            await self.session.close()
    
    async def scrape_haveibeenpwned(self) -> List[BreachInfo]:
        """Scrape HaveIBeenPwned breach list"""
        breaches = []
        try:
            url = "https://haveibeenpwned.com/PwnedWebsites"
            async with self.session.get(url) as response:
                if response.status == 200:
                    html = await response.text()
                    soup = BeautifulSoup(html, 'html.parser')
                    
                    # Find breach entries
                    breach_elements = soup.find_all('div', class_='pwnedWebsite')
                    for element in breach_elements:
                        name_elem = element.find('h3')
                        date_elem = element.find('time')
                        desc_elem = element.find('p')
                        
                        if name_elem:
                            breach = BreachInfo(
                                name=name_elem.get_text(strip=True),
                                date=date_elem.get('datetime') if date_elem else '',
                                records_count=0,
                                description=desc_elem.get_text(strip=True) if desc_elem else '',
                                source='haveibeenpwned',
                                url=url
                            )
                            breaches.append(breach)
                            
        except Exception as e:
            logger.error(f"Error scraping HaveIBeenPwned: {e}")
        
        return breaches
    
    async def scrape_github_dumps(self) -> List[BreachInfo]:
        """Scrape GitHub for breach data dumps"""
        breaches = []
        try:
            # Search for breach data repositories
            search_urls = [
                "https://github.com/search?q=breach+data&type=repositories",
                "https://github.com/search?q=password+leak&type=repositories",
                "https://github.com/search?q=email+dump&type=repositories",
                "https://github.com/search?q=breach+compilation&type=repositories"
            ]
            
            for url in search_urls:
                async with self.session.get(url) as response:
                    if response.status == 200:
                        html = await response.text()
                        soup = BeautifulSoup(html, 'html.parser')
                        
                        # Find repository links
                        repo_links = soup.find_all('a', href=re.compile(r'/[^/]+/[^/]+$'))
                        for link in repo_links[:10]:  # Limit to first 10
                            repo_name = link.get_text(strip=True)
                            repo_url = f"https://github.com{link['href']}"
                            
                            breach = BreachInfo(
                                name=f"github_{repo_name}",
                                date=datetime.now().strftime('%Y-%m-%d'),
                                records_count=0,
                                description=f"GitHub repository: {repo_name}",
                                source='github',
                                url=repo_url
                            )
                            breaches.append(breach)
                
                # Rate limiting
                await asyncio.sleep(2)
                
        except Exception as e:
            logger.error(f"Error scraping GitHub dumps: {e}")
        
        return breaches
    
    async def scrape_pastebin_dumps(self) -> List[BreachInfo]:
        """Scrape Pastebin for breach data"""
        breaches = []
        try:
            # Search for breach-related pastes
            search_urls = [
                "https://pastebin.com/search?q=breach",
                "https://pastebin.com/search?q=password",
                "https://pastebin.com/search?q=email+dump",
                "https://pastebin.com/search?q=leak"
            ]
            
            for url in search_urls:
                async with self.session.get(url) as response:
                    if response.status == 200:
                        html = await response.text()
                        soup = BeautifulSoup(html, 'html.parser')
                        
                        # Find paste links
                        paste_links = soup.find_all('a', href=re.compile(r'/[\w]+$'))
                        for link in paste_links[:5]:  # Limit to first 5
                            paste_id = link['href'].split('/')[-1]
                            paste_url = f"https://pastebin.com{link['href']}"
                            
                            breach = BreachInfo(
                                name=f"pastebin_{paste_id}",
                                date=datetime.now().strftime('%Y-%m-%d'),
                                records_count=0,
                                description=f"Pastebin paste: {paste_id}",
                                source='pastebin',
                                url=paste_url
                            )
                            breaches.append(breach)
                
                # Rate limiting
                await asyncio.sleep(3)
                
        except Exception as e:
            logger.error(f"Error scraping Pastebin: {e}")
        
        return breaches
    
    async def download_public_dumps(self) -> List[LeakRecord]:
        """Download and parse public breach dumps"""
        records = []
        
        # Known public dump URLs
        public_dumps = [
            {
                'name': 'BreachCompilation',
                'url': 'https://github.com/hmaverickadams/breach-parse/raw/master/breach-compilation.txt',
                'format': 'text'
            },
            {
                'name': 'RockYou2021',
                'url': 'https://github.com/ohmybahgosh/RockYou2021.txt/raw/master/RockYou2021.txt',
                'format': 'text'
            },
            {
                'name': 'Collection1',
                'url': 'https://github.com/ohmybahgosh/RockYou2021.txt/raw/master/Collection1.txt',
                'format': 'text'
            }
        ]
        
        for dump in public_dumps:
            try:
                logger.info(f"Downloading {dump['name']}...")
                async with self.session.get(dump['url']) as response:
                    if response.status == 200:
                        content = await response.text()
                        
                        # Parse based on format
                        if dump['format'] == 'text':
                            dump_records = self.parse_text_dump(content, dump['name'])
                            records.extend(dump_records)
                        
                        logger.info(f"Downloaded {len(dump_records)} records from {dump['name']}")
                
                # Rate limiting
                await asyncio.sleep(5)
                
            except Exception as e:
                logger.error(f"Error downloading {dump['name']}: {e}")
        
        return records
    
    def parse_text_dump(self, content: str, source: str) -> List[LeakRecord]:
        """Parse text-based breach dumps"""
        records = []
        lines = content.split('\n')
        
        for line in lines[:10000]:  # Limit to first 10k lines for demo
            line = line.strip()
            if not line or len(line) < 3:
                continue
            
            # Try to extract email and password
            parts = line.split(':')
            if len(parts) >= 2:
                email = parts[0].strip()
                password = parts[1].strip()
                
                # Validate email format
                if re.match(r'^[^@]+@[^@]+\.[^@]+$', email):
                    domain = email.split('@')[1]
                    
                    record = LeakRecord(
                        email=email,
                        password=password,
                        domain=domain,
                        breach_name=source,
                        source=source,
                        confidence=0.8,
                        timestamp=datetime.now()
                    )
                    records.append(record)
        
        return records
    
    async def scrape_telegram_channels(self) -> List[BreachInfo]:
        """Scrape Telegram channels for breach data (public channels only)"""
        breaches = []
        try:
            # Public Telegram channels that share breach data
            channels = [
                'https://t.me/breachdata',
                'https://t.me/leakcheck',
                'https://t.me/databreaches',
                'https://t.me/breachcompilation'
            ]
            
            for channel_url in channels:
                try:
                    async with self.session.get(channel_url) as response:
                        if response.status == 200:
                            html = await response.text()
                            soup = BeautifulSoup(html, 'html.parser')
                            
                            # Extract channel info
                            title_elem = soup.find('title')
                            if title_elem:
                                channel_name = title_elem.get_text(strip=True)
                                
                                breach = BreachInfo(
                                    name=f"telegram_{channel_name}",
                                    date=datetime.now().strftime('%Y-%m-%d'),
                                    records_count=0,
                                    description=f"Telegram channel: {channel_name}",
                                    source='telegram',
                                    url=channel_url
                                )
                                breaches.append(breach)
                    
                    # Rate limiting
                    await asyncio.sleep(3)
                    
                except Exception as e:
                    logger.error(f"Error scraping Telegram channel {channel_url}: {e}")
                    
        except Exception as e:
            logger.error(f"Error scraping Telegram channels: {e}")
        
        return breaches
    
    async def scrape_dark_web_forums(self) -> List[BreachInfo]:
        """Scrape dark web forums (public mirrors only)"""
        breaches = []
        try:
            # Public mirrors of dark web forums
            mirrors = [
                'http://zqktlwiuavvvqqt4ybvgvi7tyo4hjl5xgfuvpdf6otjiycgwqbym2qad.onion/',
                'https://dark.fail/',  # Public dark web directory
                'https://thehiddenwiki.org/',  # Public directory
            ]
            
            for mirror in mirrors:
                try:
                    async with self.session.get(mirror, timeout=30) as response:
                        if response.status == 200:
                            html = await response.text()
                            soup = BeautifulSoup(html, 'html.parser')
                            
                            # Look for breach-related content
                            breach_links = soup.find_all('a', href=re.compile(r'breach|leak|dump', re.I))
                            for link in breach_links[:5]:
                                breach = BreachInfo(
                                    name=f"darkweb_{link.get_text(strip=True)[:50]}",
                                    date=datetime.now().strftime('%Y-%m-%d'),
                                    records_count=0,
                                    description=f"Dark web forum: {link.get_text(strip=True)}",
                                    source='darkweb',
                                    url=link.get('href', '')
                                )
                                breaches.append(breach)
                    
                    # Rate limiting
                    await asyncio.sleep(5)
                    
                except Exception as e:
                    logger.error(f"Error scraping dark web mirror {mirror}: {e}")
                    
        except Exception as e:
            logger.error(f"Error scraping dark web forums: {e}")
        
        return breaches
    
    def save_records_to_database(self, records: List[LeakRecord]):
        """Save leak records to SQLite database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        saved_count = 0
        for record in records:
            try:
                # Create hash for deduplication
                record_hash = hashlib.md5(
                    f"{record.email}:{record.password}:{record.breach_name}".encode()
                ).hexdigest()
                
                cursor.execute('''
                    INSERT OR IGNORE INTO leak_records 
                    (email, password, username, domain, breach_name, breach_date, 
                     source, confidence, timestamp, hash)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    record.email,
                    record.password,
                    record.username,
                    record.domain,
                    record.breach_name,
                    record.breach_date,
                    record.source,
                    record.confidence,
                    record.timestamp.isoformat() if record.timestamp else None,
                    record_hash
                ))
                
                if cursor.rowcount > 0:
                    saved_count += 1
                    
            except Exception as e:
                logger.error(f"Error saving record {record.email}: {e}")
        
        conn.commit()
        conn.close()
        logger.info(f"Saved {saved_count} new records to database")
    
    def save_breach_info_to_database(self, breaches: List[BreachInfo]):
        """Save breach metadata to database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        saved_count = 0
        for breach in breaches:
            try:
                cursor.execute('''
                    INSERT OR REPLACE INTO breach_info 
                    (name, date, records_count, description, source, url, last_updated)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (
                    breach.name,
                    breach.date,
                    breach.records_count,
                    breach.description,
                    breach.source,
                    breach.url,
                    datetime.now().isoformat()
                ))
                
                if cursor.rowcount > 0:
                    saved_count += 1
                    
            except Exception as e:
                logger.error(f"Error saving breach info {breach.name}: {e}")
        
        conn.commit()
        conn.close()
        logger.info(f"Saved {saved_count} breach info records to database")
    
    async def search_database(self, query: str, search_type: str = 'email') -> List[LeakRecord]:
        """Search the local leak database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        if search_type == 'email':
            cursor.execute('''
                SELECT email, password, username, domain, breach_name, breach_date, 
                       source, confidence, timestamp
                FROM leak_records 
                WHERE email LIKE ?
                ORDER BY confidence DESC
            ''', (f'%{query}%',))
        elif search_type == 'domain':
            cursor.execute('''
                SELECT email, password, username, domain, breach_name, breach_date, 
                       source, confidence, timestamp
                FROM leak_records 
                WHERE domain LIKE ?
                ORDER BY confidence DESC
            ''', (f'%{query}%',))
        else:
            cursor.execute('''
                SELECT email, password, username, domain, breach_name, breach_date, 
                       source, confidence, timestamp
                FROM leak_records 
                WHERE email LIKE ? OR username LIKE ? OR domain LIKE ?
                ORDER BY confidence DESC
            ''', (f'%{query}%', f'%{query}%', f'%{query}%'))
        
        rows = cursor.fetchall()
        conn.close()
        
        records = []
        for row in rows:
            record = LeakRecord(
                email=row[0],
                password=row[1],
                username=row[2],
                domain=row[3],
                breach_name=row[4],
                breach_date=row[5],
                source=row[6],
                confidence=row[7],
                timestamp=datetime.fromisoformat(row[8]) if row[8] else None
            )
            records.append(record)
        
        return records
    
    async def comprehensive_scrape(self) -> Dict[str, Any]:
        """Perform comprehensive scraping of all sources"""
        logger.info("Starting comprehensive leak database scraping...")
        
        all_breaches = []
        all_records = []
        
        # Scrape different sources
        sources = [
            ('haveibeenpwned', self.scrape_haveibeenpwned),
            ('github_dumps', self.scrape_github_dumps),
            ('pastebin_dumps', self.scrape_pastebin_dumps),
            ('telegram_channels', self.scrape_telegram_channels),
            ('dark_web_forums', self.scrape_dark_web_forums),
        ]
        
        for source_name, scraper_func in sources:
            try:
                logger.info(f"Scraping {source_name}...")
                if source_name == 'github_dumps':
                    breaches = await scraper_func()
                    all_breaches.extend(breaches)
                else:
                    breaches = await scraper_func()
                    all_breaches.extend(breaches)
                
                # Rate limiting between sources
                await asyncio.sleep(5)
                
            except Exception as e:
                logger.error(f"Error scraping {source_name}: {e}")
        
        # Download public dumps
        try:
            logger.info("Downloading public breach dumps...")
            records = await self.download_public_dumps()
            all_records.extend(records)
        except Exception as e:
            logger.error(f"Error downloading public dumps: {e}")
        
        # Save to database
        if all_records:
            self.save_records_to_database(all_records)
        
        if all_breaches:
            self.save_breach_info_to_database(all_breaches)
        
        return {
            'breaches_found': len(all_breaches),
            'records_found': len(all_records),
            'sources_scraped': len(sources),
            'timestamp': datetime.now().isoformat()
        }
    
    def get_database_stats(self) -> Dict[str, Any]:
        """Get statistics about the local leak database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Total records
        cursor.execute('SELECT COUNT(*) FROM leak_records')
        total_records = cursor.fetchone()[0]
        
        # Unique emails
        cursor.execute('SELECT COUNT(DISTINCT email) FROM leak_records')
        unique_emails = cursor.fetchone()[0]
        
        # Unique domains
        cursor.execute('SELECT COUNT(DISTINCT domain) FROM leak_records')
        unique_domains = cursor.fetchone()[0]
        
        # Breach sources
        cursor.execute('SELECT COUNT(DISTINCT breach_name) FROM leak_records')
        unique_breaches = cursor.fetchone()[0]
        
        # Top domains
        cursor.execute('''
            SELECT domain, COUNT(*) as count 
            FROM leak_records 
            WHERE domain IS NOT NULL 
            GROUP BY domain 
            ORDER BY count DESC 
            LIMIT 10
        ''')
        top_domains = cursor.fetchall()
        
        conn.close()
        
        return {
            'total_records': total_records,
            'unique_emails': unique_emails,
            'unique_domains': unique_domains,
            'unique_breaches': unique_breaches,
            'top_domains': [{'domain': d[0], 'count': d[1]} for d in top_domains],
            'database_size_mb': self.db_path.stat().st_size / (1024 * 1024)
        }

# Usage example
async def main():
    config = {
        'leak_db_path': './data/leaks.db',
        'scraping_delay_seconds': 2
    }
    
    async with LeakDatabaseScraper(config) as scraper:
        # Perform comprehensive scraping
        results = await scraper.comprehensive_scrape()
        print(f"Scraping completed: {results}")
        
        # Get database stats
        stats = scraper.get_database_stats()
        print(f"Database stats: {stats}")
        
        # Search for specific email
        records = await scraper.search_database('test@example.com', 'email')
        print(f"Found {len(records)} records for test@example.com")

if __name__ == "__main__":
    asyncio.run(main())
