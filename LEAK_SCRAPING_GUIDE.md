# 🔐 Leak Database Scraper Guide - NO API KEYS REQUIRED

## Overview
This tool scrapes **already leaked databases** and breach collections from public sources using **pure web scraping**. No API keys, no paid services - just accessing publicly available breach data.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install aiohttp beautifulsoup4
```

### 2. Run the Scraper
```bash
# Scrape all sources
python scrape_leaks.py --scrape-all

# Download public dumps only
python scrape_leaks.py --download-dumps

# Search for specific email
python scrape_leaks.py --search test@example.com --type email
```

## 📡 Data Sources (Already Scraped)

### 1. **HaveIBeenPwned** 
- **URL**: https://haveibeenpwned.com/PwnedWebsites
- **Data**: Breach metadata, dates, descriptions
- **Method**: Web scraping
- **Rate Limit**: Respectful delays

### 2. **GitHub Breach Repositories**
- **Search**: "breach data", "password leak", "email dump"
- **Examples**: 
  - [Breach-Parse](https://github.com/hmaverickadams/breach-parse)
  - [RockYou2021](https://github.com/ohmybahgosh/RockYou2021.txt)
  - [Collection1](https://github.com/ohmybahgosh/RockYou2021.txt)
- **Method**: Repository discovery and raw file downloads

### 3. **Pastebin Dumps**
- **Search**: "breach", "password", "email dump", "leak"
- **Method**: Search and scrape public pastes
- **Rate Limit**: 3+ second delays

### 4. **Telegram Channels**
- **Channels**: @breachdata, @leakcheck, @databreaches
- **Method**: Public channel scraping
- **Rate Limit**: 3+ second delays

### 5. **Dark Web Forums (Public Mirrors)**
- **Mirrors**: dark.fail, thehiddenwiki.org
- **Method**: Public mirror scraping
- **Rate Limit**: 5+ second delays

## 📥 Public Breach Dumps (Pre-Scraped)

### 1. **BreachCompilation**
- **Size**: ~3.7GB
- **Records**: ~1.4 billion
- **Format**: email:password
- **Source**: Public GitHub repository

### 2. **RockYou2021**
- **Size**: ~8.4GB
- **Records**: ~8.4 billion
- **Format**: password only
- **Source**: Public GitHub repository

### 3. **Collection1**
- **Size**: ~2.2GB
- **Records**: ~1 billion
- **Format**: email:password
- **Source**: Public GitHub repository

## 🛠️ Usage Examples

### Example 1: Comprehensive Scraping
```bash
# Scrape all sources and download public dumps
python scrape_leaks.py --scrape-all --download-dumps

# Output:
# 🚀 Starting comprehensive leak database scraping...
# 📡 Sources: HaveIBeenPwned, GitHub, Pastebin, Telegram, Dark Web
# 📥 Downloading public breach dumps...
# ✅ Scraping completed!
# 📊 Breaches found: 25
# 📝 Records found: 1,234,567
# 🔍 Sources scraped: 5
```

### Example 2: Search Specific Email
```bash
# Search for specific email
python scrape_leaks.py --search john.doe@gmail.com --type email

# Output:
# 🔍 Searching database for: john.doe@gmail.com
# 🔎 Search type: email
# ✅ Found 3 records:
# 1. Email: john.doe@gmail.com
#    Password: password123
#    Domain: gmail.com
#    Breach: LinkedIn2012
#    Source: breach-compilation
#    Confidence: 0.80
```

### Example 3: Search by Domain
```bash
# Search for all records from specific domain
python scrape_leaks.py --search gmail.com --type domain

# Output:
# 🔍 Searching database for: gmail.com
# 🔎 Search type: domain
# ✅ Found 1,234 records:
# 1. Email: user1@gmail.com
#    Password: password123
#    Domain: gmail.com
#    Breach: Adobe2013
#    Source: breach-compilation
#    Confidence: 0.85
```

### Example 4: Database Statistics
```bash
# Show database statistics
python scrape_leaks.py --stats

# Output:
# 📊 Database Statistics
# 📈 Overview:
#    Total records: 1,234,567
#    Unique emails: 987,654
#    Unique domains: 1,234
#    Unique breaches: 25
#    Database size: 45.67 MB
# 🏆 Top domains by record count:
#     1. gmail.com                   123,456 records
#     2. yahoo.com                    98,765 records
#     3. hotmail.com                  87,654 records
```

## 🔍 Advanced Search Options

### Search Types
- **`--type email`**: Search by email address
- **`--type domain`**: Search by domain name
- **`--type username`**: Search by username
- **`--type all`**: Search across all fields (default)

### Custom Database Path
```bash
# Use custom database location
python scrape_leaks.py --db-path /path/to/custom/leaks.db --stats
```

### Rate Limiting
```bash
# Custom delay between requests (default: 2 seconds)
python scrape_leaks.py --delay 5 --scrape-all
```

## 📊 Database Schema

### `leak_records` Table
```sql
CREATE TABLE leak_records (
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
);
```

### `breach_info` Table
```sql
CREATE TABLE breach_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    date TEXT,
    records_count INTEGER,
    description TEXT,
    source TEXT,
    url TEXT,
    last_updated TEXT
);
```

## 🚨 Legal & Ethical Considerations

### ✅ **What's Legal**
- Scraping **publicly available** breach data
- Accessing **public** repositories and websites
- Using **public** breach collections
- Research and educational purposes

### ❌ **What's NOT Legal**
- Accessing private/restricted data
- Bypassing authentication
- Violating website terms of service
- Using data for malicious purposes

### 🔒 **Best Practices**
- Respect `robots.txt` files
- Implement rate limiting (2+ second delays)
- Use appropriate user agents
- Only access public information
- Follow website terms of service

## 📈 Performance & Scaling

### Current Limitations
- **Rate Limiting**: 2-5 second delays between requests
- **Memory Usage**: Loads entire dumps into memory
- **Database Size**: Can grow to several GB
- **Scraping Speed**: Limited by rate limiting

### Optimization Tips
- Use SSD storage for database
- Increase RAM for large dumps
- Run during off-peak hours
- Use multiple IP addresses (with proper delays)
- Implement incremental updates

## 🐛 Troubleshooting

### Common Issues

#### 1. **Import Errors**
```bash
# Install missing dependencies
pip install aiohttp beautifulsoup4
```

#### 2. **Database Locked**
```bash
# Check if another process is using the database
# Close any other instances of the scraper
```

#### 3. **Rate Limiting**
```bash
# Increase delays
python scrape_leaks.py --delay 10 --scrape-all
```

#### 4. **Memory Issues**
```bash
# Process smaller dumps first
python scrape_leaks.py --download-dumps
# Then scrape sources
python scrape_leaks.py --scrape-all
```

### Debug Mode
```bash
# Enable debug logging
export PYTHONPATH=.
python -c "
import logging
logging.basicConfig(level=logging.DEBUG)
from src.core.leak_database_scraper import LeakDatabaseScraper
import asyncio

async def test():
    config = {'leak_db_path': './data/leaks.db'}
    async with LeakDatabaseScraper(config) as scraper:
        stats = scraper.get_database_stats()
        print(f'Stats: {stats}')

asyncio.run(test())
"
```

## 🔄 Automation & Scheduling

### Cron Job Example
```bash
# Add to crontab - run daily at 2 AM
0 2 * * * cd /path/to/leak-scraper && python scrape_leaks.py --scrape-all --download-dumps >> /var/log/leak-scraper.log 2>&1
```

### Systemd Service Example
```ini
[Unit]
Description=Leak Database Scraper
After=network.target

[Service]
Type=oneshot
User=your-user
WorkingDirectory=/path/to/leak-scraper
ExecStart=/usr/bin/python3 scrape_leaks.py --scrape-all --download-dumps
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

## 📚 Additional Resources

### Documentation
- [HaveIBeenPwned API](https://haveibeenpwned.com/API/v3)
- [GitHub Search API](https://docs.github.com/en/rest/search)
- [BeautifulSoup Documentation](https://www.crummy.com/software/BeautifulSoup/)

### Legal Resources
- [Web Scraping Legal Guide](https://www.scrapingbee.com/blog/web-scraping-legal/)
- [GDPR Compliance](https://gdpr.eu/)
- [CCPA Compliance](https://www.caprivacy.org/)

### Security Resources
- [Data Breach Response](https://www.ftc.gov/business-guidance/privacy-security/data-security)
- [Password Security](https://www.ncsc.gov.uk/collection/passwords)

## 🎯 Next Steps

1. **Start Small**: Begin with `--download-dumps` to get public data
2. **Test Search**: Use `--search` to verify data quality
3. **Scale Up**: Add `--scrape-all` for comprehensive coverage
4. **Monitor**: Check `--stats` regularly
5. **Automate**: Set up scheduled scraping
6. **Integrate**: Connect to your LEO search tool

## ⚠️ Important Notes

- **Educational Use Only**: This tool is for research and educational purposes
- **Public Data Only**: Only accesses publicly available information
- **Rate Limiting**: Always respect website rate limits
- **Legal Compliance**: Ensure compliance with local laws
- **Data Privacy**: Handle breach data responsibly

---

**Remember**: This tool provides access to **already leaked** data that is publicly available. Use responsibly and legally!
