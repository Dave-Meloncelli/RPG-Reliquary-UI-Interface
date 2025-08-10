#!/usr/bin/env python3
import json
import os
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]

REPORTS_DIR = ROOT / 'reports'
PAR_EXEC_DIR = ROOT / 'parallel_execution'
SELF_HEAL_DIR = ROOT / 'self_healing'
KNOWLEDGE_HUB = ROOT / 'knowledge_hub' / 'knowledge_index.json'

def human(n):
    for unit in ['B','KB','MB','GB','TB']:
        if n < 1024:
            return f"{n:.1f}{unit}"
        n /= 1024
    return f"{n:.1f}PB"

freed = 0
changes = []

# 1) Prune reports: keep latest 100 *.json
if REPORTS_DIR.exists():
    files = [p for p in REPORTS_DIR.glob('*.json') if p.is_file()]
    files.sort(key=lambda p: p.stat().st_mtime, reverse=True)
    for old in files[100:]:
        try:
            s = old.stat().st_size
            old.unlink()
            freed += s
            changes.append({"deleted_report": str(old.relative_to(ROOT))})
        except Exception:
            pass

# 2) Prune parallel execution history to last 50 records
hist = PAR_EXEC_DIR / 'execution_history.json'
if hist.exists():
    try:
        data = json.loads(hist.read_text(encoding='utf-8'))
        if isinstance(data, list) and len(data) > 50:
            trimmed = data[:50]
            hist.write_text(json.dumps(trimmed, indent=2, ensure_ascii=False), encoding='utf-8')
            changes.append({"trimmed_parallel_execution_history": len(data) - len(trimmed)})
    except Exception:
        pass

# 3) Prune self-healing recovery history to last 200
rec = SELF_HEAL_DIR / 'recovery_history.json'
if rec.exists():
    try:
        data = json.loads(rec.read_text(encoding='utf-8'))
        if isinstance(data, list) and len(data) > 200:
            trimmed = data[-200:]
            rec.write_text(json.dumps(trimmed, indent=2, ensure_ascii=False), encoding='utf-8')
            changes.append({"trimmed_self_healing_history": len(data) - len(trimmed)})
    except Exception:
        pass

# 4) Prune knowledge hub execution history to last 200
if KNOWLEDGE_HUB.exists():
    try:
        hub = json.loads(KNOWLEDGE_HUB.read_text(encoding='utf-8'))
        hist = hub.get('execution_history', [])
        if isinstance(hist, list) and len(hist) > 200:
            hub['execution_history'] = hist[-200:]
            KNOWLEDGE_HUB.write_text(json.dumps(hub, indent=2, ensure_ascii=False), encoding='utf-8')
            changes.append({"trimmed_knowledge_hub_history": len(hist) - 200})
    except Exception:
        pass

print(json.dumps({
    "success": True,
    "freed": human(freed),
    "changes": changes,
    "timestamp": datetime.now().isoformat()
}, indent=2))
