#!/usr/bin/env python3
import json
import os
from pathlib import Path
from typing import Dict, Any, List

CONTEXT_DIR = Path('context_preservation')


def scan_context() -> Dict[str, Any]:
    CONTEXT_DIR.mkdir(exist_ok=True)
    files = list(CONTEXT_DIR.glob('*_context.json'))
    align_issues = []
    missing_links = []
    total_items = 0
    for f in files:
        try:
            data = json.loads(f.read_text(encoding='utf-8', errors='replace'))
            ctx = data.get('context', {})
            total_items += len(ctx) if isinstance(ctx, dict) else 0
            # Simple alignment checks
            if 'previous_results' not in ctx:
                align_issues.append({'file': f.name, 'issue': 'missing_previous_results'})
            if 'input_data' not in ctx:
                align_issues.append({'file': f.name, 'issue': 'missing_input_data'})
            # Missing cross links to reports
            if 'reports' not in ctx and not any(k.startswith('stage_') for k in (ctx.keys() if isinstance(ctx, dict) else [])):
                missing_links.append({'file': f.name, 'issue': 'no_report_links'})
        except Exception as e:
            align_issues.append({'file': f.name, 'issue': 'parse_error', 'detail': str(e)})
    return {
        'success': True,
        'context_scan_complete': True,
        'files_scanned': len(files),
        'total_items': total_items,
        'alignment_issues': align_issues,
        'missing_links': missing_links,
        'summary': f'scanned={len(files)} issues={len(align_issues)} links_missing={len(missing_links)}'
    }


def run_context_intelligence(context: Dict[str, Any] = None):
    result = scan_context()
    print(json.dumps(result))
    return result

if __name__ == '__main__':
    run_context_intelligence()
