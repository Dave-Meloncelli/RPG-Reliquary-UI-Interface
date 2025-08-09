# Scaffold Orchestrator (Design)

Purpose: run ordered scaffold chains with shared preserved context and optional continuance mode.

Proposed CLI:
- `python orchestrator.py --chain streaming_observability,continuous_improvement --continuance`

Behavior:
- Load preserved context between legs using `ContextPreservationManager` keyed by scaffold id.
- Respect continuance flag for Human Approval.
- Produce a combined report at the end.
