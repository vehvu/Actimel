#!/usr/bin/env python3
"""
Generate Sample Leak Data for Testing
This creates realistic sample data so you can test the search functionality
"""

import sqlite3
import hashlib
from datetime import datetime
from pathlib import Path

def generate_sample_data():
    """Generate realistic sample leak data"""
    
    # Sample breach data
    sample_breaches = [
        {
            'name': 'LinkedIn2012',
            'date': '2012-06-06',
            'records_count': 117000000,
            'description': 'LinkedIn database breach',
            'source': 'sample_data',
            'url': 'https://example.com/linkedin2012'
        },
        {
            'name': 'Adobe2013',
            'date': '2013-10-03',
            'records_count': 153000000,
            'description': 'Adobe Creative Cloud breach',
            'source': 'sample_data',
            'url': 'https://example.com/adobe2013'
        },
        {
            'name': 'Yahoo2013',
            'date': '2013-08-01',
            'records_count': 3000000000,
            'description': 'Yahoo account breach',
            'source': 'sample_data',
            'url': 'https://example.com/yahoo2013'
        },
        {
            'name': 'Equifax2017',
            'date': '2017-07-29',
            'records_count': 147900000,
            'description': 'Equifax credit bureau breach',
            'source': 'sample_data',
            'url': 'https://example.com/equifax2017'
        }
    ]
    
    # Sample email/password combinations
    sample_records = [
        ('john.doe@gmail.com', 'password123', 'john.doe', 'gmail.com'),
        ('jane.smith@yahoo.com', 'qwerty456', 'jane.smith', 'yahoo.com'),
        ('mike.johnson@hotmail.com', 'letmein789', 'mike.johnson', 'hotmail.com'),
        ('sarah.wilson@outlook.com', 'welcome2023', 'sarah.wilson', 'outlook.com'),
        ('david.brown@aol.com', 'admin123', 'david.brown', 'aol.com'),
        ('emma.davis@icloud.com', 'password2024', 'emma.davis', 'icloud.com'),
        ('james.miller@protonmail.com', 'securepass', 'james.miller', 'protonmail.com'),
        ('lisa.garcia@tutanota.com', 'mypassword', 'lisa.garcia', 'tutanota.com'),
        ('robert.rodriguez@mail.com', '123456789', 'robert.rodriguez', 'mail.com'),
        ('amanda.martinez@yandex.com', 'password', 'amanda.martinez', 'yandex.com'),
        ('christopher.lee@naver.com', 'admin', 'christopher.lee', 'naver.com'),
        ('michelle.white@daum.net', 'root', 'michelle.white', 'daum.net'),
        ('daniel.harris@live.com', 'user123', 'daniel.harris', 'live.com'),
        ('jennifer.clark@me.com', 'login', 'jennifer.clark', 'me.com'),
        ('thomas.lewis@mac.com', 'pass123', 'thomas.lewis', 'mac.com'),
        ('ashley.robinson@att.net', 'password1', 'ashley.robinson', 'att.net'),
        ('kevin.walker@verizon.net', '123456', 'kevin.walker', 'verizon.net'),
        ('stephanie.young@comcast.net', 'qwerty', 'stephanie.young', 'comcast.net'),
        ('jason.allen@cox.net', 'abc123', 'jason.allen', 'cox.net'),
        ('rebecca.king@charter.net', 'password123', 'rebecca.king', 'charter.net'),
        ('nathan.wright@earthlink.net', 'admin123', 'nathan.wright', 'earthlink.net'),
        ('stephanie.lopez@juno.com', 'root123', 'stephanie.lopez', 'juno.com'),
        ('brandon.hill@netzero.net', 'user123', 'brandon.hill', 'netzero.net'),
        ('nicole.scott@mindspring.com', 'login123', 'nicole.scott', 'mindspring.com'),
        ('kevin.green@peoplepc.com', 'pass123', 'kevin.green', 'peoplepc.com'),
        ('rachel.adams@bellsouth.net', 'password1', 'rachel.adams', 'bellsouth.net'),
        ('andrew.baker@swbell.net', '123456', 'andrew.baker', 'swbell.net'),
        ('lisa.gonzalez@ameritech.net', 'qwerty', 'lisa.gonzalez', 'ameritech.net'),
        ('michael.nelson@centurytel.net', 'abc123', 'michael.nelson', 'centurytel.net'),
        ('jessica.carter@windstream.net', 'password123', 'jessica.carter', 'windstream.net'),
        ('ryan.mitchell@frontier.com', 'admin123', 'ryan.mitchell', 'frontier.com'),
        ('lauren.roberts@optimum.net', 'root123', 'lauren.roberts', 'optimum.net'),
        ('tyler.turner@brighthouse.com', 'user123', 'tyler.turner', 'brighthouse.com'),
        ('hannah.phillips@cableone.net', 'login123', 'hannah.phillips', 'cableone.net'),
        ('justin.campbell@mediacomcc.com', 'pass123', 'justin.campbell', 'mediacomcc.com'),
        ('brittany.parker@suddenlink.net', 'password1', 'brittany.parker', 'suddenlink.net'),
        ('austin.evans@wideopenwest.com', '123456', 'austin.evans', 'wideopenwest.com'),
        ('samantha.edwards@armstrong.com', 'qwerty', 'samantha.edwards', 'armstrong.com'),
        ('tyler.collins@atlanticbb.net', 'abc123', 'tyler.collins', 'atlanticbb.net'),
        ('morgan.stewart@buckeye.com', 'password123', 'morgan.stewart', 'buckeye.com'),
        ('jordan.sanchez@cincinnati-bell.com', 'admin123', 'jordan.sanchez', 'cincinnati-bell.com'),
        ('taylor.morris@hawaiiantel.com', 'root123', 'taylor.morris', 'hawaiiantel.com'),
        ('riley.rogers@hawaiiantel.com', 'user123', 'riley.rogers', 'hawaiiantel.com'),
        ('casey.reed@hawaiiantel.com', 'login123', 'casey.reed', 'hawaiiantel.com'),
        ('avery.cook@hawaiiantel.com', 'pass123', 'avery.cook', 'hawaiiantel.com'),
        ('quinn.morgan@hawaiiantel.com', 'password1', 'quinn.morgan', 'hawaiiantel.com'),
        ('blake.bell@hawaiiantel.com', '123456', 'blake.bell', 'hawaiiantel.com'),
        ('emery.murphy@hawaiiantel.com', 'qwerty', 'emery.murphy', 'hawaiiantel.com'),
        ('rowan.bailey@hawaiiantel.com', 'abc123', 'rowan.bailey', 'hawaiiantel.com'),
        ('hadley.rivera@hawaiiantel.com', 'password123', 'hadley.rivera', 'hawaiiantel.com'),
        ('sage.cooper@hawaiiantel.com', 'admin123', 'sage.cooper', 'hawaiiantel.com'),
        ('quincy.richardson@hawaiiantel.com', 'root123', 'quincy.richardson', 'hawaiiantel.com'),
        ('parker.cox@hawaiiantel.com', 'user123', 'parker.cox', 'hawaiiantel.com'),
        ('remy.ward@hawaiiantel.com', 'login123', 'remy.ward', 'hawaiiantel.com'),
        ('lennon.torres@hawaiiantel.com', 'pass123', 'lennon.torres', 'hawaiiantel.com'),
        ('milan.peterson@hawaiiantel.com', 'password1', 'milan.peterson', 'hawaiiantel.com'),
        ('sutton.gray@hawaiiantel.com', '123456', 'sutton.gray', 'hawaiiantel.com'),
        ('bowie.ramirez@hawaiiantel.com', 'qwerty', 'bowie.ramirez', 'hawaiiantel.com'),
        ('atlas.james@hawaiiantel.com', 'abc123', 'atlas.james', 'hawaiiantel.com'),
        ('rhodes.watson@hawaiiantel.com', 'password123', 'rhodes.watson', 'hawaiiantel.com'),
        ('decker.brooks@hawaiiantel.com', 'admin123', 'decker.brooks', 'hawaiiantel.com'),
        ('flynn.kelly@hawaiiantel.com', 'root123', 'flynn.kelly', 'hawaiiantel.com'),
        ('sage.sanders@hawaiiantel.com', 'user123', 'sage.sanders', 'hawaiiantel.com'),
        ('tatum.price@hawaiiantel.com', 'login123', 'tatum.price', 'hawaiiantel.com'),
        ('kace.bennett@hawaiiantel.com', 'pass123', 'kace.bennett', 'hawaiiantel.com'),
        ('zayne.wood@hawaiiantel.com', 'password1', 'zayne.wood', 'hawaiiantel.com'),
        ('krew.barnes@hawaiiantel.com', '123456', 'krew.barnes', 'hawaiiantel.com'),
        ('jett.ross@hawaiiantel.com', 'qwerty', 'jett.ross', 'hawaiiantel.com'),
        ('zephyr.henderson@hawaiiantel.com', 'abc123', 'zephyr.henderson', 'hawaiiantel.com'),
        ('paisley.coleman@hawaiiantel.com', 'password123', 'paisley.coleman', 'hawaiiantel.com'),
        ('rylan.jenkins@hawaiiantel.com', 'admin123', 'rylan.jenkins', 'hawaiiantel.com'),
    ]
    
    # Ensure data directory exists
    data_dir = Path('./data')
    data_dir.mkdir(exist_ok=True)
    
    db_path = data_dir / 'leaks.db'
    
    # Connect to database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Create tables if they don't exist
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
    
    # Insert breach info
    for breach in sample_breaches:
        cursor.execute('''
            INSERT OR REPLACE INTO breach_info 
            (name, date, records_count, description, source, url, last_updated)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            breach['name'],
            breach['date'],
            breach['records_count'],
            breach['description'],
            breach['source'],
            breach['url'],
            datetime.now().isoformat()
        ))
    
    # Insert sample records
    for email, password, username, domain in sample_records:
        # Create hash for deduplication
        record_hash = hashlib.md5(
            f"{email}:{password}:sample_data".encode()
        ).hexdigest()
        
        # Assign random breach names
        import random
        breach_names = ['LinkedIn2012', 'Adobe2013', 'Yahoo2013', 'Equifax2017']
        breach_name = random.choice(breach_names)
        
        cursor.execute('''
            INSERT OR IGNORE INTO leak_records 
            (email, password, username, domain, breach_name, breach_date, 
             source, confidence, timestamp, hash)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            email,
            password,
            username,
            domain,
            breach_name,
            '2012-2023',
            'sample_data',
            0.9,
            datetime.now().isoformat(),
            record_hash
        ))
    
    # Commit and close
    conn.commit()
    conn.close()
    
    print(f"✅ Generated sample data:")
    print(f"   📊 {len(sample_breaches)} breach sources")
    print(f"   📝 {len(sample_records)} sample records")
    print(f"   💾 Database: {db_path}")
    print(f"\n🚀 Now you can test the search functionality!")

if __name__ == "__main__":
    generate_sample_data()
