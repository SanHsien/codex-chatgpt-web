# Decisions

## 2026-09-06 — Windows-first maintenance overlay

Keep upstream product code, release behavior, Bun 1.4.0, tests, license, and multilingual docs
unchanged. Add only repository governance, deterministic upstream tracking, source-only PowerShell
entrypoints, and GitHub maintenance automation. This avoids creating a second product line while
making maintenance repeatable on Windows.

## 2026-09-06 — Upstream baseline policy

Record `c648c09501bb1b704c7ad5273fb5f5d6b8992dd2` as reviewed upstream `main`, not as an automatic
merge target. The scheduled checker fails visibly when `main` moves, requiring a deliberate review
and documented adopt/defer decision.
