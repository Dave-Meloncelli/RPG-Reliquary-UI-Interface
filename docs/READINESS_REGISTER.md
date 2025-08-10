## Readiness Register

Purpose: Snapshot of preparedness across products/components to avoid endless improvement cycles. Use this to decide go/no-go and defer major diversions to backlog.

Legend:
- Ready: OK for day-to-day usage/minimal oversight
- Pilot-ready: OK for controlled use; known gaps documented
- Dev-ready: Works for development; needs more before user exposure

Last updated: {{auto-updated by framework runs}}

### Components

| Component | Status | Rationale | Immediate next steps |
|---|---|---|---|
| Autonomous Framework (v2) | Pilot-ready | Cross-language frames; diagnostics; approval gate; external failures captured; reports saved | Enable CI gating of scaffold on PRs; expand unit tests |
| Backend API (FastAPI) | Dev-ready → Pilot-ready (with SQLite) | Health/liveness/readiness implemented; structured logging w/ requestId; auth basic; SQLite default | Harden auth/session; add Postgres profile; integrate structured logger deeper |
| WebSocket (AZV-003) | Dev-ready | Implementation exists; not fully exercised in CI | Add smoke test; integrate into app lifecycle |
| Knowledge Hub | Pilot-ready | Auto-updates and audits integrated; centralized | Ensure links to all new reports registered |
| CI Gate (secrets/deps + tests) | Pilot-ready | Secrets triaged; dep audit best-effort; health pytest in CI | Consider strict dep fail; expand test matrix |
| Secrets Scanner | Pilot-ready | Allowlist/ignores; severity; high=0 locally | Triage findings; rotate any real secrets; refine allowlist |
| Dependency Vulnerabilities | Dev-ready | npm audit JSON parsed; optional safe fix | Add ecosystem breadth (pip-audit); policy thresholds |
| SBOM & License (SPDX) | Dev-ready | Basic SBOM; SPDX allow/deny; violations reported | Resolve licenses from metadata; add denygate in CI |
| Observability | Dev-ready | Logging config; requestId propagation | Add metrics/tracing; DB/request correlation IDs |
| Context Intelligence / Frame Optimizer | Pilot-ready | Runs in meta-audit; flags gaps/alignment | Feed into approval stage and backlog automatically |
| PowerShell Frames | Pilot-ready | Diagnostics proven; JSON I/O stable | Add more PS frames as needed |

### Operating Rules
- Major diversions: defer to backlog unless critical; keep current run focused to completion.
- Human approval: Stage 8 aggregates recommendations/remediations; approve/deny/modify there.
- CI: Fails on high-severity secrets; dependency strictness configurable via CI_STRICT.

### Pointers
- Reports: `reports/` (SBOM, secrets, deps, scaffold reports)
- Policies: `config/security/` (secrets allowlist, SPDX policy)
- Health endpoints: `/liveness`, `/readiness`


