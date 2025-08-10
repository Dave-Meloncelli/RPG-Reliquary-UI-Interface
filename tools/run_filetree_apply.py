#!/usr/bin/env python3
import importlib.util
from pathlib import Path
import json

root = Path(__file__).resolve().parents[1]
frame_path = root / 'scripts' / 'frames' / 'filetree-organizer-frame.py'

spec = importlib.util.spec_from_file_location('filetree_organizer', str(frame_path))
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)  # type: ignore

res = mod.run_filetree_organizer({'dry_run': False})
print(json.dumps(res, indent=2))
