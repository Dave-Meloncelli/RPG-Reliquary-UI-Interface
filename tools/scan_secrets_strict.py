#!/usr/bin/env python3
"""
High-confidence secret scan (rigid CI gate).
Blocks on confident matches; skips low-confidence noise.
Scans tracked files excluding node_modules and large binaries.
"""

from __future__ import annotations

import base64
import re
import sys
from pathlib import Path
from typing import Iterable, List, Tuple


SKIP_DIRS = {".git", "node_modules", "backend/node_modules", "venv", ".venv", "dist", "build", "out"}
TEXT_EXTS = {".js", ".ts", ".tsx", ".json", ".md", ".py", ".ps1", ".cjs", ".mjs", ".yml", ".yaml", ".html", ".css", ".ini", ".toml"}
MAX_FILE_BYTES = 2_000_000

# High-confidence patterns only
PATTERNS: List[Tuple[str, re.Pattern]] = [
    ("AWS Access Key", re.compile(r"\bAKIA[0-9A-Z]{16}\b")),
    ("AWS Secret Key", re.compile(r"\baws_secret_access_key\b\s*[:=]\s*['\"]?[A-Za-z0-9/+=]{40}['\"]?", re.I)),
    ("GitHub Token", re.compile(r"\bghp_[A-Za-z0-9]{36}\b")),
    ("Slack Token", re.compile(r"\bxox[baprs]-[A-Za-z0-9-]{10,48}\b")),
    # Allowlist common placeholder tokens like "your-...-api-key" to reduce noise
    ("Generic Bearer", re.compile(r"\bBearer\s+(?!your-)[A-Za-z0-9-_\.=]{20,}\b")),
    ("OpenAI Key", re.compile(r"\bsk-[a-zA-Z0-9]{20,}[_\-][a-zA-Z0-9]{20,}\b")),
]


def is_textual(path: Path) -> bool:
    if path.suffix.lower() in TEXT_EXTS:
        return True
    return path.stat().st_size < 200_000  # heuristic small files treated as text


def iter_files() -> Iterable[Path]:
    root = Path(".")
    for p in root.rglob("*"):
        if not p.is_file():
            continue
        if any(part in SKIP_DIRS for part in p.parts):
            continue
        try:
            if p.stat().st_size > MAX_FILE_BYTES:
                continue
        except Exception:
            continue
        if not is_textual(p):
            continue
        yield p


def scan() -> List[str]:
    hits: List[str] = []
    for path in iter_files():
        try:
            content = path.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue
        for label, pat in PATTERNS:
            for m in pat.finditer(content):
                snippet = content[max(0, m.start()-6): m.end()+6].replace("\n", " ")
                hits.append(f"{label}: {path} :: {snippet}")
    return hits


def main() -> None:
    hits = scan()
    if hits:
        print("High-confidence secrets detected:")
        for h in hits:
            print(" - ", h)
        sys.exit(3)
    print("No high-confidence secrets found")


if __name__ == "__main__":
    main()


