# Continuance Protocol

Continuance mode permits the framework to proceed across stages and scaffolds with minimized human intervention while preserving safety.

## Activation
- Environment: `AF_CONTINUANCE=1`
- CLI (planned): `--continuance`

## Guardrails
- Human Approval auto-approval only when `confidence_score ≥ threshold` and `priority != critical`.
- Critical actions always require explicit human approval unless overridden per run.
- All auto decisions are logged to reports with `continuance: true` and rationales.

## Defaults
- Auto-approval threshold: 0.8
- Max parallel workers: 2
- DPR tail max batch: 6 files; ignore files > 100MB
- Cache TTLs per operation (see `Intelligent Caching`)

## Audit
- Every continuance sequence produces a consolidated report and updates the Knowledge Hub.

## Rollback
- Frames should specify non-destructive rollbacks (most new frames are read-only or self-healing).
