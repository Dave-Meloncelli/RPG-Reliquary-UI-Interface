#!/usr/bin/env python3
"""
Render the latest import_dependency_graph_*.json as a simple SVG.
Output: reports/import_dependency_graph.svg

This is a lightweight visual: nodes are files, edges are imports.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List, Tuple

REPORTS = Path("reports")


def find_latest_graph() -> Path | None:
    if not REPORTS.exists():
        return None
    candidates: List[Tuple[float, Path]] = []
    for p in REPORTS.iterdir():
        if p.is_file() and p.name.startswith("import_dependency_graph_") and p.suffix == ".json":
            try:
                candidates.append((p.stat().st_mtime, p))
            except Exception:
                continue
    if not candidates:
        return None
    candidates.sort(key=lambda x: x[0], reverse=True)
    return candidates[0][1]


def load_graph(path: Path) -> Dict[str, Any]:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def layout(nodes: List[str]) -> Dict[str, Tuple[float, float]]:
    # Simple grid layout for readability
    positions: Dict[str, Tuple[float, float]] = {}
    cols = 6
    x_gap = 220
    y_gap = 120
    for idx, name in enumerate(sorted(nodes)):
        row = idx // cols
        col = idx % cols
        positions[name] = (100 + col * x_gap, 100 + row * y_gap)
    return positions


def to_svg(graph: Dict[str, Any]) -> str:
    g: Dict[str, List[str]] = graph.get("graph", {})
    nodes = sorted(g.keys())
    pos = layout(nodes)

    # SVG header
    parts: List[str] = [
        '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 1600 1200">',
        '<rect width="100%" height="100%" fill="#ffffff" />'
    ]

    # Edges
    for src, deps in g.items():
        x1, y1 = pos.get(src, (0, 0))
        for dep in deps or []:
            if dep in nodes:
                x2, y2 = pos.get(dep, (0, 0))
                parts.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#94a3b8" stroke-width="1" marker-end="url(#arrow)" />')

    # Arrow marker
    parts.insert(1, '<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#94a3b8" /></marker></defs>')

    # Nodes
    for name in nodes:
        x, y = pos[name]
        parts.append(f'<rect x="{x-80}" y="{y-18}" rx="6" ry="6" width="160" height="28" fill="#eef2ff" stroke="#4f46e5" stroke-width="1" />')
        label = name[-22:] if len(name) > 22 else name
        parts.append(f'<text x="{x}" y="{y}" text-anchor="middle" font-size="10" fill="#111827" font-family="Segoe UI, Roboto, sans-serif">{label}</text>')

    parts.append('</svg>')
    return "\n".join(parts)


def main() -> None:
    path = find_latest_graph()
    if not path:
        print("No graph JSON found")
        return
    graph = load_graph(path)
    svg = to_svg(graph)
    out = REPORTS / "import_dependency_graph.svg"
    with out.open("w", encoding="utf-8") as f:
        f.write(svg)
    print(str(out))


if __name__ == "__main__":
    main()


