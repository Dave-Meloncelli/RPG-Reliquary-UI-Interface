#!/usr/bin/env python3
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = ROOT / 'scripts'
DEST_DIR = ROOT / 'Archive' / 'scripts-cjs'
DEST_DIR.mkdir(parents=True, exist_ok=True)

patterns = ['*.cjs']

moved = []
skipped = []
for pattern in patterns:
    for fp in SRC_DIR.glob(pattern):
        dest = DEST_DIR / fp.name
        try:
            if dest.exists():
                skipped.append(str(fp))
                continue
            shutil.move(str(fp), str(dest))
            moved.append(str(fp))
        except Exception:
            skipped.append(str(fp))

print({
    'moved': moved,
    'skipped': skipped,
    'destination': str(DEST_DIR)
})
