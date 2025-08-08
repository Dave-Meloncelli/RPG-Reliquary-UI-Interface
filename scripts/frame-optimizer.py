#!/usr/bin/env python3
import json
import os
import re
from pathlib import Path
from typing import Dict, Any, List

FRAME_BLOCK_RE = re.compile(r"self\.frames\['(?P<id>[^']+)'\]\s*=\s*Frame\((?P<body>.*?)\)\s*\)", re.DOTALL)
FIELD_RE = re.compile(r"(\w+)\s*=\s*(.+?)(?:,\s*\n|\n\s*\)|,\s*#|,\s*$)", re.DOTALL)
STR_RE = re.compile(r"^'([^']*)'|\"([^\"]*)\"")
DICT_RE = re.compile(r"\{[\s\S]*?\}")
LIST_RE = re.compile(r"\[[\s\S]*?\]")


def _parse_field(value: str):
    value = value.strip()
    if value.startswith('{'):
        return 'dict', value
    if value.startswith('['):
        return 'list', value
    m = STR_RE.match(value)
    if m:
        return 'str', m.group(1) or m.group(2)
    if value in ('True', 'False'):
        return 'bool', value == 'True'
    return 'raw', value


def analyze_frames(framework_path: str) -> Dict[str, Any]:
    content = Path(framework_path).read_text(encoding='utf-8', errors='replace')
    results: List[Dict[str, Any]] = []
    gaps = []
    recommendations = []

    for m in FRAME_BLOCK_RE.finditer(content):
        fid = m.group('id')
        body = m.group('body')
        fields = {}
        for fm in FIELD_RE.finditer(body):
            key, raw = fm.group(1), fm.group(2)
            ftype, parsed = _parse_field(raw)
            fields[key] = {'type': ftype, 'value': parsed, 'raw': raw}

        file_path = fields.get('file_path', {}).get('value')
        entry_point = fields.get('entry_point', {}).get('value')
        success_criteria = fields.get('success_criteria', {}).get('value')
        rollback_plan = fields.get('rollback_plan', {}).get('value')
        dependencies = fields.get('dependencies', {}).get('value')
        ftype = fields.get('type', {}).get('raw', '').strip()

        frame_report = {
            'id': fid,
            'file_path': file_path,
            'entry_point': entry_point,
            'type_expr': ftype,
            'has_success_criteria': bool(success_criteria and success_criteria.startswith('{')),
            'has_rollback': bool(rollback_plan),
            'has_dependencies': bool(dependencies and dependencies.startswith('[')),
            'file_exists': bool(file_path and Path(file_path).exists())
        }
        results.append(frame_report)

        # Gap checks
        if not frame_report['file_exists']:
            gaps.append({'frame': fid, 'issue': 'file_missing', 'detail': file_path})
        if file_path and file_path.endswith('.js') and not entry_point:
            gaps.append({'frame': fid, 'issue': 'missing_entry_point_js'})
        if file_path and file_path.endswith('.ps1') and entry_point:
            recommendations.append({'frame': fid, 'suggestion': 'Clear entry_point for PowerShell frames'})
        if not frame_report['has_success_criteria']:
            gaps.append({'frame': fid, 'issue': 'missing_success_criteria'})
        if not frame_report['has_rollback']:
            recommendations.append({'frame': fid, 'suggestion': 'Add rollback_plan for safer changes'})
        if not frame_report['has_dependencies']:
            recommendations.append({'frame': fid, 'suggestion': 'Declare dependencies for tooling clarity'})

    # Synergy suggestions
    synergies = []
    # Example: if observability exists without health readiness, suggest pairing, and vice versa
    frame_ids = {r['id'] for r in results}
    if 'observability_bootstrap' in frame_ids and 'health_readiness' not in frame_ids:
        synergies.append('Add Health & Readiness frame to complement Observability')
    if 'sbom_license' in frame_ids and 'external_failure_diagnostic' not in frame_ids:
        synergies.append('Pair SBOM with external failure diagnostics for supply-chain visibility')

    return {
        'success': True,
        'optimization_complete': True,
        'frames_analyzed': len(results),
        'gaps': gaps,
        'recommendations': recommendations,
        'synergies': synergies,
        'summary': f"Analyzed {len(results)} frames; gaps={len(gaps)}, recs={len(recommendations)}, syn={len(synergies)}"
    }


def run_frame_optimizer(context: Dict[str, Any] = None):
    framework_path = 'autonomous-framework-v2.py'
    report = analyze_frames(framework_path)
    print(json.dumps(report))
    return report

if __name__ == '__main__':
    run_frame_optimizer()
