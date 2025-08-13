#!/usr/bin/env python3
"""
Index Registrar Frame
Consolidates per-folder indexes and writes a repo manifest for agent discovery.
"""

import json
from pathlib import Path
from datetime import datetime
from typing import Dict, Any


def run_index_registrar(context: Dict[str, Any] = None) -> Dict[str, Any]:
    if context is None:
        context = {}
    root = Path('.').resolve()
    idx_dir = root / 'internal' / 'indexes'
    manifest = {
        'generated_at': datetime.now().isoformat(),
        'folders': {},
        'summary': {}
    }
    loaded = 0

    for name in ['frames', 'js', 'ps', 'internal', 'reports']:
        fp = idx_dir / f'{name}.index.json'
        if fp.exists():
            try:
                data = json.loads(fp.read_text(encoding='utf-8'))
                manifest['folders'][name] = data
                manifest['summary'][name] = len(data)
                loaded += 1
            except Exception:
                continue

    out_file = root / 'internal' / 'repo.manifest.json'
    out_file.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding='utf-8')

    return {
        'success': True,
        'index_registrar_complete': True,
        'indexes_loaded': loaded,
        'manifest_path': str(out_file)
    }

if __name__ == '__main__':
    print(json.dumps(run_index_registrar(), indent=2))
