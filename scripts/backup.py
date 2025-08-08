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