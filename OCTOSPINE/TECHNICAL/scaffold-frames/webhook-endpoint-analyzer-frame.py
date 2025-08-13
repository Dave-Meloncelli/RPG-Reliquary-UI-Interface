#!/usr/bin/env python3
"""
Webhook & Endpoint Analyzer Frame
Scans repository for outbound endpoints/webhooks and basic auth token patterns.
"""

import json
import os
import re
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, List

URL_RE = re.compile(r"https?://[\w\.-]+(?:/[\w\-\./%?=&]*)?", re.I)
TOKEN_HINTS = [
    'authorization', 'api_key', 'api-key', 'token', 'webhook', 'bearer', 'x-api-key'
]
IGNORE_DIRS = {'.git', 'node_modules', '.vite', '.husky', '.pytest_cache', '__pycache__'}
MAX_FILE_BYTES = 2 * 1024 * 1024  # 2 MB per scan window
TAIL_BYTES = 1 * 1024 * 1024      # 1 MB tail sample for large files


def _scan_text(text: str) -> Dict[str, List[str]]:
    urls = URL_RE.findall(text)
    lower = text.lower()
    hints = [h for h in TOKEN_HINTS if h in lower]
    return {
        'urls': list(sorted(set(urls)))[:50],
        'hints': list(sorted(set(hints)))
    }


def _stream_scan_file(p: Path) -> Dict[str, List[str]]:
    try:
        size = p.stat().st_size
    except Exception:
        return {'urls': [], 'hints': []}

    # Small files: read whole safely (bounded by MAX_FILE_BYTES anyway)
    if size <= MAX_FILE_BYTES:
        try:
            text = p.read_text(encoding='utf-8', errors='ignore')
            return _scan_text(text)
        except Exception:
            return {'urls': [], 'hints': []}

    # Large files: head sample + tail sample
    urls: List[str] = []
    hints: List[str] = []

    # Head
    try:
        with p.open('r', encoding='utf-8', errors='ignore') as f:
            read = f.read(MAX_FILE_BYTES)
            res = _scan_text(read)
            urls.extend(res['urls'])
            hints.extend(res['hints'])
    except Exception:
        pass

    # Tail
    try:
        with p.open('rb') as fb:
            if size > TAIL_BYTES:
                fb.seek(size - TAIL_BYTES)
            tail_bytes = fb.read()
        tail_text = tail_bytes.decode('utf-8', errors='ignore')
        res = _scan_text(tail_text)
        urls.extend(res['urls'])
        hints.extend(res['hints'])
    except Exception:
        pass

    # Dedup and cap
    urls = list(sorted(set(urls)))[:50]
    hints = list(sorted(set(hints)))
    return {'urls': urls, 'hints': hints}


def run_webhook_endpoint_analyzer(context: Dict[str, Any] = None) -> Dict[str, Any]:
    if context is None:
        context = {}
    root = Path('.').resolve()
    findings: List[Dict[str, Any]] = []
    max_findings = int(context.get('max_findings', 1000))

    for p in root.rglob('*'):
        rel = p.relative_to(root)
        if any(part in IGNORE_DIRS for part in rel.parts):
            continue
        if not p.is_file():
            continue
        if p.suffix.lower() not in {'.js', '.ts', '.tsx', '.py', '.json', '.yml', '.yaml', '.md', '.txt'}:
            continue
        res = _stream_scan_file(p)
        if res['urls'] or res['hints']:
            findings.append({
                'path': str(rel).replace('\\', '/'),
                'urls': res['urls'][:20],
                'hints': res['hints']
            })
        if len(findings) >= max_findings:
            break

    result = {
        'success': True,
        'webhook_endpoint_analysis_complete': True,
        'findings_count': len(findings),
        'findings': findings[:500],
        'timestamp': datetime.now().isoformat()
    }
    Path('reports').mkdir(exist_ok=True)
    out = Path('reports') / f"webhook_endpoint_analysis_{int(datetime.now().timestamp())}.json"
    with out.open('w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    return result

if __name__ == '__main__':
    print(json.dumps(run_webhook_endpoint_analyzer(), indent=2))
