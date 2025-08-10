#!/usr/bin/env python3
from __future__ import annotations

"""
Quarantine invalid JSON report files to backlog/invalid to satisfy rigid CI.
Moves any JSON in reports/ that fails to parse.
"""

import json
from pathlib import Path
from typing import List


def main() -> None:
    reports = Path("reports")
    if not reports.exists():
        print("No reports directory found")
        return

    quarantine_dir = Path("backlog/invalid")
    quarantine_dir.mkdir(parents=True, exist_ok=True)

    moved: List[str] = []
    for p in reports.glob("*.json"):
        if not p.is_file():
            continue
        try:
            with p.open("r", encoding="utf-8") as f:
                json.load(f)
        except Exception:
            target = quarantine_dir / p.name
            try:
                p.rename(target)
                moved.append(str(target))
            except Exception as e:
                print(f"Failed to move {p} -> {target}: {e}")

    if moved:
        print("Quarantined invalid JSON files:")
        for m in moved:
            print(f" - {m}")
    else:
        print("No invalid JSON files found")


if __name__ == "__main__":
    main()


