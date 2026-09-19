# Bounded quality loop

This repository exposes deterministic Windows gates for an optional, manually triggered coding loop. The loop is disabled by default in `loop-policy.toml`; adding the policy does not authorize a scheduler, deployment, merge, push, browser login, or external write.

## Gate contract

- Iteration feedback: `pwsh -NoProfile -File tools/dev_check.ps1 -Quick`.
- Final candidate: `pwsh -NoProfile -File tools/dev_check.ps1`.
- This repository has no mutation gate. Do not substitute Full or Quick and label it mutation evidence.
- Only a successful Full run may create `artifacts/quality-summary.json`. The summary must be schema v1, use profile `full`, bind the current complete Git HEAD, and report every gate as boolean `true`.
- Starting either Quick or Full invalidates old Full evidence before running. A failed Full run therefore leaves no completion summary.

## Operating boundary

Use one isolated worktree, one maker, and an independent checker. Keep iteration, elapsed-time, token, and repeated-failure limits from `loop-policy.toml`. Persist only compact runtime state under ignored `loop-state/`; never store credentials or transcripts there.

Stop immediately on success, exhausted budget, repeated failure, unavailable verification, or a human-approval boundary. Authentication, authorization, payments, personal data, deletion, deployment, secrets, and major dependency changes remain human decisions. The loop may prepare evidence but cannot approve or execute those actions.

Strict upstream or dependency drift is a real failed Full gate. Review and update the maintained-fork ledger before retrying; do not rewrite the summary or run Quick to manufacture completion evidence.
