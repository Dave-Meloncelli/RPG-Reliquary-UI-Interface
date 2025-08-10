#!/usr/bin/env python3
"""
Filetree Organizer Frame
Scans repository root and safely organizes stray files into canonical folders.
Supports dry-run mode and emits a plan before executing moves.
"""

import json
import shutil
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any

CANONICAL = {
    'docs': ['.md'],
    'reports': ['.json', '.html'],
    'logs': ['.log'],
    'scripts/ps': ['.ps1'],
}

PROTECTED_FILES = {
    'README.md', 'LICENSE', 'package.json', 'package-lock.json', 'tsconfig.json',
    'vite.config.ts', 'index.html', '.gitignore', '.gitattributes',
    'autonomous-framework-v2.py', 'autonomous-framework.py', 'autonomous-system-meta-analysis.py',
    'autonomous-system-v1.py', 'autonomous-system-v2.py', 'autonomous-system-v3.py',
    'autonomous-system-v4.py', 'autonomous-system-v5.py'
}

PROTECTED_DIRS = {
    'scripts', 'internal', 'config', 'src', 'public', 'backend', 'tools', 'Archive', 'node_modules',
    'reports', 'docs', 'knowledge_hub', 'intelligent_cache', 'self_healing', 'parallel_execution'
}


def classify(file: Path) -> str:
    ext = file.suffix.lower()
    for target, exts in CANONICAL.items():
        if ext in exts:
            # Prefer existing subtrees for reports and docs
            if target == 'reports' and file.name.endswith('.html'):
                return 'reports'
            if target == 'docs' and file.name.endswith('.md'):
                return 'docs'
            return target
    return ''


def run_filetree_organizer(context: Dict[str, Any] = None) -> Dict[str, Any]:
    if context is None:
        context = {}
    dry_run = bool(context.get('dry_run', True))
    root = Path('.').resolve()

    moves: List[Dict[str, str]] = []
    skipped: List[str] = []

    for item in root.iterdir():
        if item.is_dir():
            if item.name in PROTECTED_DIRS:
                continue
            # leave other directories alone for now
            continue
        if not item.is_file():
            continue
        if item.name in PROTECTED_FILES:
            skipped.append(str(item))
            continue
        target_dir = classify(item)
        if not target_dir:
            # Default destinations
            if item.suffix.lower() in {'.bat', '.sh', '.py'}:
                target_dir = 'tools' if item.suffix.lower() == '.py' else 'scripts'
            else:
                target_dir = 'Archive/unsorted'
        dest_dir = root / target_dir
        dest_dir.mkdir(parents=True, exist_ok=True)
        dest = dest_dir / item.name
        if dest.exists():
            # Avoid overwrite
            new_name = f"{item.stem}_{int(datetime.now().timestamp())}{item.suffix}"
            dest = dest_dir / new_name
        moves.append({'from': str(item), 'to': str(dest)})

    applied = []
    if not dry_run:
        for mv in moves:
            try:
                shutil.move(mv['from'], mv['to'])
                applied.append(mv)
            except Exception:
                skipped.append(mv['from'])

    result = {
        'success': True,
        'filetree_organizer_complete': True,
        'dry_run': dry_run,
        'planned_moves': moves if dry_run else applied,
        'skipped': skipped,
        'timestamp': datetime.now().isoformat()
    }

    Path('reports').mkdir(exist_ok=True)
    out = Path('reports') / f"filetree_organizer_{int(datetime.now().timestamp())}.json"
    with out.open('w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    return result


if __name__ == '__main__':
    print(json.dumps(run_filetree_organizer({'dry_run': True}), indent=2))
