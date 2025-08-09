# Autonomous Framework v2 - Frames & Scaffolds

This document describes the contract for Frames, how Scaffolds orchestrate them, and how to extend the system safely.

## Concepts
- Frame: a reusable module with `id`, `name`, `type`, `file_path`, `entry_point`, `success_criteria`, and `rollback_plan`.
- Scaffold: a composition of frames across 10 stages: Scope → Identify/Analyze → Plan → Implement → Success Continue → Final Audit → Meta Audit → Approval → Update Registers → Push/Diagnostics.

## Frame Contract (Python/JS/PS)
- File must exist and export the `entry_point` function.
- Entry point signature (Python): `def run_<frame>(context: Dict[str, Any]) -> Dict[str, Any]`.
- Must return JSON-serializable dict containing `success: bool` and all keys in `success_criteria`.
- Keep I/O bounded; stream or batch small sets; add `parameters.timeout` when long-running.

## Success Criteria
- Each frame defines required keys (e.g., `deep_pattern_recognition_complete: True`). The framework validates these post-run.

## Adding a Frame
1. Place Python frames in `scripts/frames/` (snake-case filenames).
2. JS bridges: `scripts/js/`, PowerShell scripts: `scripts/ps/`.
3. Register in `FrameRegistry._load_frames()` with strict `FrameType`, `entry_point`, and `success_criteria`.
4. Add to relevant scaffold stages.

## Changing/Retiring a Frame
- Update `FrameRegistry` path and related scaffolds.
- If retiring, move file to `Archive/` and remove from scaffolds, keeping a changelog line.

## Chaining Scaffolds
- Preferred: use the `streaming_observability` scaffold for tail→DPR→predictive→improvement loops.
- For multi-leg runs, run `autonomous-framework-v2.py <scaffold_id>` sequentially and rely on preserved context; an orchestrator will formalize this soon.

## Continuance vs Human Approval
- Default requires human gate (Human Approval Frame). Auto-approval is possible when `confidence_score ≥ auto_approval_threshold`.
- Planned: `AF_CONTINUANCE=1` or `--continuance` to permit automatic progression across legs with audit notes.

## Logging & Reports
- Reports saved to `reports/`. Large artifacts should be rotated; only summaries checked into VCS.
- Knowledge hub persists in `knowledge_hub/`; cache in `intelligent_cache/`.

## Safety & Performance
- Use `log_tailer` to feed small batches to DPR to avoid long runs.
- `parallel_execution` to run independent frames; prefer small worker counts by default.
- `self_healing` to recover from common failures; `predictive_analysis` to steer execution.

## Testing
- Each frame should have a smoke test (invocation returns `success: True` and required keys under normal context).
