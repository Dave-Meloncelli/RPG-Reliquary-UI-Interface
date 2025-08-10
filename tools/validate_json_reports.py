#!/usr/bin/env python3
"""
Validate JSON outputs produced by the framework.
Rigid CI gate: exits non-zero if any JSON file fails to parse.
Targets:
- reports/*.json
- internal/repo.manifest.json
- internal/indexes/*.index.json
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import List


def collect_targets() -> List[Path]:
    targets: List[Path] = []
    reports = Path("reports")
    if reports.exists():
        targets.extend(p for p in reports.glob("*.json") if p.is_file())

    manifest = Path("internal/repo.manifest.json")
    if manifest.exists():
        targets.append(manifest)

    indexes_dir = Path("internal/indexes")
    if indexes_dir.exists():
        targets.extend(p for p in indexes_dir.glob("*.index.json") if p.is_file())

    return targets


def main() -> None:
    errors: List[str] = []
    targets = collect_targets()
    for path in targets:
        try:
            with path.open("r", encoding="utf-8") as f:
                json.load(f)
        except Exception as e:
            errors.append(f"{path}: {e}")

    if errors:
        print("JSON validation failed for:")
        for err in errors:
            print(f" - {err}")
        sys.exit(2)
    else:
        print(f"Validated {len(targets)} JSON files successfully")


if __name__ == "__main__":
    main()


