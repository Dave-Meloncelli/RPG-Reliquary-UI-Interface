#!/usr/bin/env python3
"""
Check database structure
"""

from app.database import engine
from sqlalchemy import text

def check_database():
    print("🔍 Checking Database Structure")
    print("=" * 40)
    
    with engine.connect() as conn:
        # Check tables
        result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table'"))
        tables = [row[0] for row in result]
        print(f"Tables: {tables}")
        
        # Check users table structure
        if 'users' in tables:
            result = conn.execute(text("PRAGMA table_info(users)"))
            columns = [(row[1], row[2]) for row in result]
            print(f"\nUsers table columns: {columns}")
            
            # Check if there are any users
            result = conn.execute(text("SELECT COUNT(*) FROM users"))
            count = result.scalar()
            print(f"Number of users: {count}")
            
            if count > 0:
                result = conn.execute(text("SELECT username, consciousness_level FROM users LIMIT 1"))
                user = result.fetchone()
                if user:
                    print(f"Sample user: {user}")

if __name__ == "__main__":
    check_database()
