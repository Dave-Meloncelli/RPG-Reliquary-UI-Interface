#!/usr/bin/env python3
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]


def index_dir(dir_path: Path):
    entries = []
    for p in sorted(dir_path.glob('*')):
        if p.is_file():
            try:
                size = p.stat().st_size
                # Read at most first 100 lines for preview
                head_lines = []
                with p.open('r', encoding='utf-8', errors='ignore') as f:
                    for i, line in enumerate(f):
                        if i >= 100:
                            break
                        head_lines.append(line.rstrip('\n'))
                entries.append({
                    'name': p.name,
                    'size_bytes': size,
                    'preview_lines': head_lines
                })
            except Exception:
                entries.append({
                    'name': p.name,
                    'size_bytes': None,
                    'preview_lines': []
                })
        elif p.is_dir():
            entries.append({'name': p.name, 'dir': True})
    return entries


def main():
    targets = [
        ROOT / 'scripts' / 'frames',
        ROOT / 'scripts' / 'js',
        ROOT / 'scripts' / 'ps',
        ROOT / 'internal',
        ROOT / 'reports'
    ]
    out_dir = ROOT / 'internal' / 'indexes'
    out_dir.mkdir(parents=True, exist_ok=True)
    for t in targets:
        if t.exists():
            idx = index_dir(t)
            out_file = out_dir / f"{t.name}.index.json"
            with out_file.open('w', encoding='utf-8') as f:
                json.dump(idx, f, indent=2, ensure_ascii=False)
            print(f"Indexed {t} -> {out_file}")

if __name__ == '__main__':
    main()
