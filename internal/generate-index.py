#!/usr/bin/env python3
import json
import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FW_PATH = ROOT / 'autonomous-framework-v2.py'


def load_framework():
    spec = importlib.util.spec_from_file_location('af_v2', str(FW_PATH))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.AutonomousFramework


if __name__ == "__main__":
    AutonomousFramework = load_framework()
    fw = AutonomousFramework()
    frames = fw.list_available_frames()
    scaffolds = fw.list_available_scaffolds()
    (ROOT / 'internal').mkdir(exist_ok=True)
    with open(ROOT / 'internal' / 'frames.index.json', 'w', encoding='utf-8') as f:
        json.dump(frames, f, indent=2, ensure_ascii=False)
    with open(ROOT / 'internal' / 'scaffolds.index.json', 'w', encoding='utf-8') as f:
        json.dump(scaffolds, f, indent=2, ensure_ascii=False)
    print("Indexes generated: internal/frames.index.json, internal/scaffolds.index.json")
