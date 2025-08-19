#!/usr/bin/env python3
"""
Test script for Leak Database Scraper
"""

import asyncio
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / 'src'))

from src.core.leak_database_scraper import LeakDatabaseScraper

async def test_basic_functionality():
    """Test basic scraper functionality"""
    print("🧪 Testing Leak Database Scraper...")
    
    config = {
        'leak_db_path': './data/test_leaks.db',
        'scraping_delay_seconds': 1
    }
    
    try:
        async with LeakDatabaseScraper(config) as scraper:
            print("✅ Scraper initialized successfully")
            
            # Test database stats
            stats = scraper.get_database_stats()
            print(f"✅ Database stats retrieved: {stats}")
            
            # Test search (should return empty initially)
            records = await scraper.search_database('test@example.com', 'email')
            print(f"✅ Search test completed: {len(records)} records found")
            
            print("\n🎉 All basic tests passed!")
            return True
            
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

async def test_public_dumps():
    """Test downloading public dumps"""
    print("\n📥 Testing public dump downloads...")
    
    config = {
        'leak_db_path': './data/test_leaks.db',
        'scraping_delay_seconds': 1
    }
    
    try:
        async with LeakDatabaseScraper(config) as scraper:
            # Download public dumps
            records = await scraper.download_public_dumps()
            print(f"✅ Downloaded {len(records)} records from public dumps")
            
            if records:
                # Save to database
                scraper.save_records_to_database(records)
                print("✅ Records saved to database")
                
                # Test search with downloaded data
                sample_email = records[0].email if records else 'test@example.com'
                search_results = await scraper.search_database(sample_email, 'email')
                print(f"✅ Search test with downloaded data: {len(search_results)} results")
            
            return True
            
    except Exception as e:
        print(f"❌ Public dumps test failed: {e}")
        return False

async def test_breach_scraping():
    """Test breach metadata scraping"""
    print("\n📡 Testing breach metadata scraping...")
    
    config = {
        'leak_db_path': './data/test_leaks.db',
        'scraping_delay_seconds': 2
    }
    
    try:
        async with LeakDatabaseScraper(config) as scraper:
            # Test HaveIBeenPwned scraping
            breaches = await scraper.scrape_haveibeenpwned()
            print(f"✅ HaveIBeenPwned scraping: {len(breaches)} breaches found")
            
            # Test GitHub dumps scraping
            github_breaches = await scraper.scrape_github_dumps()
            print(f"✅ GitHub dumps scraping: {len(github_breaches)} repositories found")
            
            if breaches or github_breaches:
                # Save breach info
                all_breaches = breaches + github_breaches
                scraper.save_breach_info_to_database(all_breaches)
                print("✅ Breach info saved to database")
            
            return True
            
    except Exception as e:
        print(f"❌ Breach scraping test failed: {e}")
        return False

async def main():
    """Run all tests"""
    print("🚀 Leak Database Scraper Test Suite")
    print("=" * 50)
    
    tests = [
        ("Basic Functionality", test_basic_functionality),
        ("Public Dumps", test_public_dumps),
        ("Breach Scraping", test_breach_scraping),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = await test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} test crashed: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\n🎯 Overall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The scraper is working correctly.")
        print("\n🚀 You can now run:")
        print("   python scrape_leaks.py --scrape-all --download-dumps")
    else:
        print("⚠️  Some tests failed. Check the output above for details.")
    
    return passed == total

if __name__ == "__main__":
    try:
        success = asyncio.run(main())
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n⏹️  Tests interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Test suite crashed: {e}")
        sys.exit(1)
