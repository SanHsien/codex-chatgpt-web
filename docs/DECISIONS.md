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

## 2026-09-06 — Four-axis and dependency policy

Upstream review tracks main, latest pull request, latest non-PR issue, and the full branch set;
unavailable inventory is a check failure, never zero findings. Dependency checks cover root and
launcher, are read-only, and allow only exact latest-version deferrals with no compatibility claim.

## 2026-09-06 — Monitor upstream Issue #346

Record upstream Issue #346 as reviewed and monitored, not ported. It is an open v5.0.4 report with
no upstream fix, so it does not justify a fork product, package, or lockfile change. Reassess when
upstream publishes a concrete fix or related change.
