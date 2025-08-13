#!/usr/bin/env python3
"""
Filesystem Discovery Frame
Inventories repository files with basic metadata for downstream analysis.
"""

import json
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, List

IGNORE_DIRS = {'.git', 'node_modules', '.vite', '.husky', '.pytest_cache', '__pycache__'}


def run_filesystem_discovery(context: Dict[str, Any] = None) -> Dict[str, Any]:
    if context is None:
        context = {}
    root = Path('.').resolve()
    max_files = int(context.get('max_files', 20000))
    collected: List[Dict[str, Any]] = []

    for p in root.rglob('*'):
        try:
            rel = p.relative_to(root)
            if any(part in IGNORE_DIRS for part in rel.parts):
                continue
            if p.is_file():
                st = p.stat()
                collected.append({
                    'path': str(rel).replace('\\', '/'),
                    'size_bytes': st.st_size,
                    'modified': datetime.fromtimestamp(st.st_mtime).isoformat(),
                    'suffix': p.suffix.lower(),
                })
                if len(collected) >= max_files:
                    break
        except Exception:
            continue

    result = {
        'success': True,
        'filesystem_discovery_complete': True,
        'files_count': len(collected),
        'files': collected[:2000],
        'timestamp': datetime.now().isoformat()
    }
    Path('reports').mkdir(exist_ok=True)
    out = Path('reports') / f"filesystem_discovery_{int(datetime.now().timestamp())}.json"
    with out.open('w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    return result

if __name__ == '__main__':
    print(json.dumps(run_filesystem_discovery(), indent=2))
