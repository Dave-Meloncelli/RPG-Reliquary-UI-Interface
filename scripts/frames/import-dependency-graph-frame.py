#!/usr/bin/env python3
"""
Import & Dependency Graph Frame
Builds a simple import/require graph for Python and JS/TS files.
"""

import json
import re
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, List

PY_IMPORT_RE = re.compile(r"^(?:from\s+([\w\._]+)\s+import|import\s+([\w\._]+))", re.M)
JS_IMPORT_RE = re.compile(r"import\s+[^;]*?from\s+['\"]([^'\"]+)['\"]|require\(['\"]([^'\"]+)['\"]\)")
IGNORE_DIRS = {'.git', 'node_modules', '.vite', '.husky', '__pycache__'}


def run_import_dependency_graph(context: Dict[str, Any] = None) -> Dict[str, Any]:
    if context is None:
        context = {}
    root = Path('.').resolve()
    graph: Dict[str, List[str]] = {}

    for p in root.rglob('*'):
        rel = p.relative_to(root)
        if any(part in IGNORE_DIRS for part in rel.parts):
            continue
        if not p.is_file():
            continue
        suffix = p.suffix.lower()
        if suffix not in {'.py', '.js', '.ts', '.tsx'}:
            continue
        try:
            text = p.read_text(encoding='utf-8', errors='ignore')
        except Exception:
            continue
        deps: List[str] = []
        if suffix == '.py':
            for m in PY_IMPORT_RE.finditer(text):
                mod = m.group(1) or m.group(2)
                if mod:
                    deps.append(mod)
        else:
            for m in JS_IMPORT_RE.finditer(text):
                mod = m.group(1) or m.group(2)
                if mod:
                    deps.append(mod)
        graph[str(rel).replace('\\', '/')] = sorted(set(deps))

    result = {
        'success': True,
        'import_dependency_graph_complete': True,
        'graph': graph,
        'nodes': len(graph),
        'timestamp': datetime.now().isoformat()
    }
    Path('reports').mkdir(exist_ok=True)
    out = Path('reports') / f"import_dependency_graph_{int(datetime.now().timestamp())}.json"
    with out.open('w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    return result

if __name__ == '__main__':
    print(json.dumps(run_import_dependency_graph(), indent=2))
