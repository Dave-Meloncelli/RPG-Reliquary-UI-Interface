
#!/usr/bin/env python3
"""
Automated Backup Script
Created by Autonomous System Risk Mitigation Engine
"""

import os
import shutil
import json
from datetime import datetime
from pathlib import Path

def create_backup():
    """Create automated backup of critical files"""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_dir = Path(f'backups/backup_{timestamp}')
    backup_dir.mkdir(parents=True, exist_ok=True)
    
    # Backup critical files
    critical_files = [
        'backend/app/main.py',
        'backend/requirements.txt',
        'KNOWLEDGE_HUB.md',
        'BACKLOG_MANAGEMENT.md'
    ]
    
    for file_path in critical_files:
        if Path(file_path).exists():
            dest_path = backup_dir / Path(file_path).name
            shutil.copy2(file_path, dest_path)
            print(f"Backed up: {file_path}")
    
    # Create backup manifest
    manifest = {
        'timestamp': timestamp,
        'files_backed_up': critical_files,
        'backup_location': str(backup_dir)
    }
    
    with open(backup_dir / 'manifest.json', 'w') as f:
        json.dump(manifest, f, indent=2)
    
    print(f"Backup completed: {backup_dir}")

if __name__ == "__main__":
    create_backup()
