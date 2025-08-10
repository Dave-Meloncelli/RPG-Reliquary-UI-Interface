#!/usr/bin/env python3
import json
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
SRC_FILES = [
    ROOT / 'autonomous_synthesis_report.json',
]
BACKLOG_DIR = ROOT / 'backlog'
INDEX_FILE = BACKLOG_DIR / 'synthesis_backlog.index.json'

BACKLOG_DIR.mkdir(exist_ok=True)

index = []
if INDEX_FILE.exists():
    try:
        index = json.loads(INDEX_FILE.read_text(encoding='utf-8'))
    except Exception:
        index = []

moved = []
for src in SRC_FILES:
    if not src.exists():
        continue
    ts = datetime.now().strftime('%Y%m%d_%H%M%S')
    dest = BACKLOG_DIR / f"synthesis_report_{ts}.json"
    # write copy and remove original
    data = src.read_text(encoding='utf-8', errors='ignore')
    dest.write_text(data, encoding='utf-8')
    src.unlink(missing_ok=True)
    moved.append(str(dest))
    try:
        payload = json.loads(data)
    except Exception:
        payload = {"raw": True}
    index.append({
        'path': str(dest.relative_to(ROOT)).replace('\\','/'),
        'timestamp': datetime.now().isoformat(),
        'summary': {
            'synergies': payload.get('synergies_found') or payload.get('synergies', None),
            'opportunities': payload.get('opportunities'),
            'risks': payload.get('risks_identified') or payload.get('risks'),
        }
    })

INDEX_FILE.write_text(json.dumps(index, indent=2, ensure_ascii=False), encoding='utf-8')

print(json.dumps({'moved': moved, 'index_entries': len(index)}, indent=2))
