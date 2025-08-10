#!/usr/bin/env python3
"""
Generate a consolidated forensic summary from the latest forensic reports.
Outputs:
- reports/forensic_consolidated_summary.json
- reports/forensic_consolidated_summary.html
"""

from __future__ import annotations

import json
import os
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple


REPORTS_DIR = Path("reports")


def load_json(path: Path) -> Optional[Dict[str, Any]]:
    try:
        with path.open("r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return None


def find_latest_report_by_prefix(prefix: str) -> Optional[Path]:
    if not REPORTS_DIR.exists():
        return None
    candidates: List[Tuple[float, Path]] = []
    for file in REPORTS_DIR.iterdir():
        if not file.is_file():
            continue
        if file.name.startswith(prefix) and file.suffix.lower() == ".json":
            try:
                candidates.append((file.stat().st_mtime, file))
            except Exception:
                continue
    if not candidates:
        return None
    candidates.sort(key=lambda x: x[0], reverse=True)
    return candidates[0][1]


def ensure_reports_dir() -> None:
    REPORTS_DIR.mkdir(exist_ok=True)


def summarize() -> Dict[str, Any]:
    ensure_reports_dir()

    # Latest inputs
    fs_path = find_latest_report_by_prefix("filesystem_discovery_")
    endpoints_path = find_latest_report_by_prefix("webhook_endpoint_analysis_")
    graph_path = find_latest_report_by_prefix("import_dependency_graph_")
    organizer_path = find_latest_report_by_prefix("filetree_organizer_")
    meta_path = find_latest_report_by_prefix("meta_analysis_forensic_recovery_")
    scaffold_path = find_latest_report_by_prefix("scaffold_execution_v2_forensic_recovery_")

    fs = load_json(fs_path) if fs_path else None
    endpoints = load_json(endpoints_path) if endpoints_path else None
    graph = load_json(graph_path) if graph_path else None
    organizer = load_json(organizer_path) if organizer_path else None
    meta = load_json(meta_path) if meta_path else None
    scaffold = load_json(scaffold_path) if scaffold_path else None

    # Metrics
    files_count = (fs or {}).get("files_count", 0)
    endpoint_findings_count = (endpoints or {}).get("findings_count", 0)
    sensitive_hint_counts: Dict[str, int] = {}
    if endpoints and isinstance(endpoints.get("findings"), list):
        for item in endpoints["findings"]:
            for hint in item.get("hints", []) or []:
                sensitive_hint_counts[hint] = sensitive_hint_counts.get(hint, 0) + 1

    graph_nodes_raw = (graph or {}).get("nodes", 0)
    if isinstance(graph_nodes_raw, int):
        graph_nodes = graph_nodes_raw
    elif isinstance(graph_nodes_raw, list):
        graph_nodes = len(graph_nodes_raw)
    else:
        graph_nodes = 0
    planned_moves = len((organizer or {}).get("planned_moves", []))
    organizer_dry_run = bool((organizer or {}).get("dry_run", True))

    # Detect recurring stray artifacts in root
    root_stray_regenerator = False
    stray_report_name = "autonomous_synthesis_report.json"
    root_stray_path = Path(stray_report_name)
    if root_stray_path.exists():
        # If organizer had a plan to move this and it's present again, flag as recurring
        if planned_moves > 0:
            for mv in (organizer or {}).get("planned_moves", []):
                if mv.get("from", "").lower().endswith(stray_report_name.lower()):
                    root_stray_regenerator = True
                    break

    # Recommendations (ranked)
    recommendations: List[Dict[str, Any]] = []

    if root_stray_regenerator or root_stray_path.exists():
        recommendations.append({
            "priority": "high",
            "effect": "repo_hygiene",
            "title": "Write synthesis reports into reports/ to prevent root regeneration",
            "action": "Change Synthesis Analysis output path to reports/",
            "evidence": stray_report_name,
        })

    if endpoint_findings_count > 0 and any(k in sensitive_hint_counts for k in ["token", "api_key", "bearer"]):
        recommendations.append({
            "priority": "high",
            "effect": "security",
            "title": "Run deep secrets scan and enforce .gitignore for artifacts",
            "action": "Integrate a dedicated secrets scanner and redact or move sensitive files",
            "evidence": {"findings": endpoint_findings_count, "hints": sensitive_hint_counts},
        })

    recommendations.append({
        "priority": "medium",
        "effect": "ops_visibility",
        "title": "Add offline link map and optional online link validation",
        "action": "Generate URL manifest; validate reachability when network is permitted",
    })

    if graph_nodes > 0:
        recommendations.append({
            "priority": "medium",
            "effect": "architecture",
            "title": "Visualize import/dependency graph",
            "action": "Produce SVG graph to surface hotspots and cycles",
            "evidence": {"nodes": graph_nodes},
        })

    recommendations.append({
        "priority": "medium",
        "effect": "quality_gate",
        "title": "Add minimal CI (lint-only) and commit message enforcement",
        "action": "Enable GitHub Actions lint workflow and commitlint",
    })

    recommendations.append({
        "priority": "low",
        "effect": "performance",
        "title": "Tune caching for large scans",
        "action": "Enable intelligent caching for file discovery and endpoint scans",
    })

    # Build summary
    summary: Dict[str, Any] = {
        "generated_at": datetime.now().isoformat(),
        "inputs": {
            "filesystem_discovery": str(fs_path) if fs_path else None,
            "webhook_endpoint_analysis": str(endpoints_path) if endpoints_path else None,
            "import_dependency_graph": str(graph_path) if graph_path else None,
            "filetree_organizer": str(organizer_path) if organizer_path else None,
            "meta_analysis": str(meta_path) if meta_path else None,
            "scaffold_execution": str(scaffold_path) if scaffold_path else None,
        },
        "metrics": {
            "files_count": files_count,
            "endpoint_findings_count": endpoint_findings_count,
            "sensitive_hint_counts": sensitive_hint_counts,
            "dependency_nodes": graph_nodes,
            "planned_moves": planned_moves,
            "organizer_dry_run": organizer_dry_run,
        },
        "recommendations_ranked": recommendations,
    }

    return summary


def write_json(summary: Dict[str, Any]) -> Path:
    out = REPORTS_DIR / "forensic_consolidated_summary.json"
    with out.open("w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    return out


def write_html(summary: Dict[str, Any]) -> Path:
    out = REPORTS_DIR / "forensic_consolidated_summary.html"
    metrics = summary.get("metrics", {})
    hint_counts = metrics.get("sensitive_hint_counts", {})
    max_hint = max(hint_counts.values()) if hint_counts else 1

    def bar(width_pct: float) -> str:
        return f'<div style="height:10px;background:#4f46e5;width:{width_pct:.1f}%;border-radius:3px"></div>'

    rows: List[str] = []
    for hint, count in sorted(hint_counts.items(), key=lambda x: x[1], reverse=True):
        width = (count / max_hint) * 100.0
        rows.append(f"<tr><td>{hint}</td><td>{count}</td><td>{bar(width)}</td></tr>")

    rec_rows: List[str] = []
    for rec in summary.get("recommendations_ranked", []):
        rec_rows.append(
            f"<tr><td>{rec.get('priority')}</td><td>{rec.get('effect')}</td><td>{rec.get('title')}</td><td>{rec.get('action')}</td></tr>"
        )

    html = f"""
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Forensic Consolidated Summary</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body {{ font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; margin: 24px; color: #111827; }}
    h1 {{ font-size: 22px; margin-bottom: 4px; }}
    h2 {{ font-size: 16px; margin-top: 24px; }}
    table {{ border-collapse: collapse; width: 100%; }}
    th, td {{ border: 1px solid #e5e7eb; padding: 6px 8px; text-align: left; font-size: 13px; }}
    th {{ background: #f9fafb; }}
    .kpi {{ display: inline-block; margin-right: 16px; padding: 8px 10px; background: #f3f4f6; border-radius: 6px; }}
  </style>
  </head>
  <body>
    <h1>Forensic Consolidated Summary</h1>
    <div style="color:#6b7280">Generated {datetime.now().isoformat()}</div>

    <h2>Key Metrics</h2>
    <div class="kpi">Files: <b>{metrics.get('files_count', 0)}</b></div>
    <div class="kpi">Endpoints Findings: <b>{metrics.get('endpoint_findings_count', 0)}</b></div>
    <div class="kpi">Dependency Nodes: <b>{metrics.get('dependency_nodes', 0)}</b></div>
    <div class="kpi">Planned Moves: <b>{metrics.get('planned_moves', 0)}</b></div>

    <h2>Sensitive Hint Density</h2>
    <table>
      <thead><tr><th>Hint</th><th>Count</th><th>Density</th></tr></thead>
      <tbody>
        {''.join(rows) if rows else '<tr><td colspan=3>No sensitive hints recorded</td></tr>'}
      </tbody>
    </table>

    <h2>Ranked Recommendations</h2>
    <table>
      <thead><tr><th>Priority</th><th>Effect</th><th>Title</th><th>Action</th></tr></thead>
      <tbody>
        {''.join(rec_rows) if rec_rows else '<tr><td colspan=4>No recommendations</td></tr>'}
      </tbody>
    </table>

  </body>
</html>
"""

    with out.open("w", encoding="utf-8") as f:
        f.write(html)
    return out


def main() -> None:
    summary = summarize()
    json_path = write_json(summary)
    html_path = write_html(summary)
    print(json.dumps({
        "success": True,
        "summary_json": str(json_path),
        "summary_html": str(html_path)
    }, indent=2))


if __name__ == "__main__":
    main()


