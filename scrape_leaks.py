#!/usr/bin/env python3
"""
Leak Database Scraper CLI Tool
NO API KEYS REQUIRED - Pure web scraping
"""

import asyncio
import argparse
import logging
import sys
from pathlib import Path
from src.core.leak_database_scraper import LeakDatabaseScraper

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('leak_scraper.log'),
        logging.StreamHandler(sys.stdout)
    ]
)

async def scrape_all_sources(config):
    """Scrape all available sources"""
    print("🚀 Starting comprehensive leak database scraping...")
    print("📡 Sources: HaveIBeenPwned, GitHub, Pastebin, Telegram, Dark Web")
    
    async with LeakDatabaseScraper(config) as scraper:
        results = await scraper.comprehensive_scrape()
        
        print(f"\n✅ Scraping completed!")
        print(f"📊 Breaches found: {results['breaches_found']}")
        print(f"📝 Records found: {results['records_found']}")
        print(f"🔍 Sources scraped: {results['sources_scraped']}")
        print(f"⏰ Timestamp: {results['timestamp']}")
        
        # Get database stats
        stats = scraper.get_database_stats()
        print(f"\n📈 Database Statistics:")
        print(f"   Total records: {stats['total_records']:,}")
        print(f"   Unique emails: {stats['unique_emails']:,}")
        print(f"   Unique domains: {stats['unique_domains']:,}")
        print(f"   Unique breaches: {stats['unique_breaches']:,}")
        print(f"   Database size: {stats['database_size_mb']:.2f} MB")
        
        if stats['top_domains']:
            print(f"\n🏆 Top domains:")
            for domain_info in stats['top_domains'][:5]:
                print(f"   {domain_info['domain']}: {domain_info['count']:,} records")

async def search_database(config, query, search_type):
    """Search the local leak database"""
    print(f"🔍 Searching database for: {query}")
    print(f"🔎 Search type: {search_type}")
    
    async with LeakDatabaseScraper(config) as scraper:
        records = await scraper.search_database(query, search_type)
        
        if not records:
            print("❌ No records found")
            return
        
        print(f"\n✅ Found {len(records)} records:")
        print("-" * 80)
        
        for i, record in enumerate(records[:10], 1):  # Show first 10
            print(f"{i}. Email: {record.email}")
            if record.password:
                print(f"   Password: {record.password}")
            if record.username:
                print(f"   Username: {record.username}")
            if record.domain:
                print(f"   Domain: {record.domain}")
            if record.breach_name:
                print(f"   Breach: {record.breach_name}")
            if record.source:
                print(f"   Source: {record.source}")
            print(f"   Confidence: {record.confidence:.2f}")
            print()
        
        if len(records) > 10:
            print(f"... and {len(records) - 10} more records")

async def download_public_dumps(config):
    """Download public breach dumps"""
    print("📥 Downloading public breach dumps...")
    
    async with LeakDatabaseScraper(config) as scraper:
        records = await scraper.download_public_dumps()
        
        print(f"✅ Downloaded {len(records)} records from public dumps")
        
        # Save to database
        scraper.save_records_to_database(records)
        
        # Show sample records
        if records:
            print(f"\n📋 Sample records:")
            for i, record in enumerate(records[:5], 1):
                print(f"{i}. {record.email} (from {record.breach_name})")

async def show_database_stats(config):
    """Show database statistics"""
    print("📊 Database Statistics")
    
    async with LeakDatabaseScraper(config) as scraper:
        stats = scraper.get_database_stats()
        
        print(f"\n📈 Overview:")
        print(f"   Total records: {stats['total_records']:,}")
        print(f"   Unique emails: {stats['unique_emails']:,}")
        print(f"   Unique domains: {stats['unique_domains']:,}")
        print(f"   Unique breaches: {stats['unique_breaches']:,}")
        print(f"   Database size: {stats['database_size_mb']:.2f} MB")
        
        if stats['top_domains']:
            print(f"\n🏆 Top domains by record count:")
            for i, domain_info in enumerate(stats['top_domains'], 1):
                print(f"   {i:2d}. {domain_info['domain']:<30} {domain_info['count']:,} records")

def main():
    parser = argparse.ArgumentParser(
        description="Leak Database Scraper - NO API KEYS REQUIRED",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Scrape all sources
  python scrape_leaks.py --scrape-all
  
  # Search for specific email
  python scrape_leaks.py --search test@example.com --type email
  
  # Search for domain
  python scrape_leaks.py --search gmail.com --type domain
  
  # Download public dumps only
  python scrape_leaks.py --download-dumps
  
  # Show database stats
  python scrape_leaks.py --stats
  
  # Full comprehensive scraping
  python scrape_leaks.py --scrape-all --download-dumps
        """
    )
    
    parser.add_argument(
        '--scrape-all',
        action='store_true',
        help='Scrape all available sources (HaveIBeenPwned, GitHub, Pastebin, etc.)'
    )
    
    parser.add_argument(
        '--download-dumps',
        action='store_true',
        help='Download public breach dumps'
    )
    
    parser.add_argument(
        '--search',
        type=str,
        help='Search for specific email, username, or domain'
    )
    
    parser.add_argument(
        '--type',
        choices=['email', 'domain', 'username', 'all'],
        default='all',
        help='Search type (default: all)'
    )
    
    parser.add_argument(
        '--stats',
        action='store_true',
        help='Show database statistics'
    )
    
    parser.add_argument(
        '--db-path',
        type=str,
        default='./data/leaks.db',
        help='Path to SQLite database (default: ./data/leaks.db)'
    )
    
    parser.add_argument(
        '--delay',
        type=int,
        default=2,
        help='Delay between requests in seconds (default: 2)'
    )
    
    args = parser.parse_args()
    
    if not any([args.scrape_all, args.download_dumps, args.search, args.stats]):
        parser.print_help()
        return
    
    # Configuration
    config = {
        'leak_db_path': args.db_path,
        'scraping_delay_seconds': args.delay
    }
    
    # Ensure data directory exists
    Path(args.db_path).parent.mkdir(parents=True, exist_ok=True)
    
    print("🔐 Leak Database Scraper")
    print("🚫 NO API KEYS REQUIRED - Pure web scraping")
    print("=" * 50)
    
    try:
        if args.scrape_all:
            asyncio.run(scrape_all_sources(config))
        
        if args.download_dumps:
            asyncio.run(download_public_dumps(config))
        
        if args.search:
            asyncio.run(search_database(config, args.search, args.type))
        
        if args.stats:
            asyncio.run(show_database_stats(config))
            
    except KeyboardInterrupt:
        print("\n⏹️  Scraping interrupted by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        logging.error(f"Error in main: {e}")

if __name__ == "__main__":
    main()
