#!/usr/bin/env python3
import json
import os
from pathlib import Path
from datetime import datetime


def run_backup_bootstrap(context: dict | None = None) -> dict:
    try:
        root = Path('.').resolve()
        backups_dir = root / 'backups'
        backups_dir.mkdir(exist_ok=True)
        scripts_dir = root / 'scripts'
        scripts_dir.mkdir(exist_ok=True)

        backup_script = scripts_dir / 'backup.py'
        if not backup_script.exists():
            backup_script.write_text(
                """
import shutil
import os
from pathlib import Path
from datetime import datetime

INCLUDE_DIRS = [
    'backend',
    'config',
    'reports'
]

EXCLUDE = {'.git', 'node_modules', 'venv', '__pycache__'}


def create_backup(dest_root: str | None = None) -> str:
    root = Path('.').resolve()
    backups_dir = Path('backups').resolve()
    backups_dir.mkdir(exist_ok=True)
    ts = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
    dest = backups_dir / f'backup_{ts}'
    if dest_root:
        dest = Path(dest_root) / dest.name
    dest.mkdir(parents=True, exist_ok=True)
    for d in INCLUDE_DIRS:
        src = root / d
        if src.exists():
            dst = dest / d
            if src.is_dir():
                shutil.copytree(src, dst, dirs_exist_ok=True, ignore=shutil.ignore_patterns(*EXCLUDE))
            else:
                dst.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(src, dst)
    return str(dest)

if __name__ == '__main__':
    path = create_backup()
    print(path)
                """.strip(),
                encoding='utf-8'
            )

        readme = backups_dir / 'README.md'
        if not readme.exists():
            readme.write_text(
                """
# Backups

- Run `python scripts/backup.py` to create a timestamped backup under this folder.
- Included: `backend/`, `config/`, `reports/`.
- Excluded: `.git`, `node_modules`, `venv`, `__pycache__`.
- For scheduling: use Windows Task Scheduler or cron on Linux.
                """.strip(),
                encoding='utf-8'
            )

        result = {
            'success': True,
            'backup_bootstrap_complete': True,
            'data': {
                'backups_dir': str(backups_dir),
                'backup_script': str(backup_script),
            },
            'summary': 'Backup bootstrap created',
        }
        print(json.dumps(result))
        return result
    except Exception as e:
        fail = {'success': False, 'backup_bootstrap_complete': False, 'error': str(e)}
        print(json.dumps(fail))
        return fail


if __name__ == '__main__':
    run_backup_bootstrap({})
