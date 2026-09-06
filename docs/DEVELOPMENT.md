# Development

## Windows-first canonical path

```powershell
pwsh -NoProfile -File tools\bootstrap_dev.ps1
pwsh -NoProfile -File tools\dev_check.ps1
```

Bootstrap requires Bun `1.4.0`, installs root and launcher with `--frozen-lockfile`, and never
changes either lockfile. It validates Electron's contained `path.txt` runtime and safely runs the
installed lifecycle script once only when that artifact is incomplete. The repair-free gate validates
Bun/Electron, fork/upstream/dependency contracts, strict upstream and dependency checks, upstream
`bun run verify`, and Git whitespace.

## POSIX parity

```bash
tools/bootstrap_dev.sh
tools/dev_check.sh [base-ref]
```

These scripts have the same frozen-install and Electron lifecycle rules as PowerShell. The dev gate
never repairs dependencies; run bootstrap first if Electron is incomplete.

## Boundaries

The canonical gates are offline source/package checks. They do **not** sign in to ChatGPT, launch a
browser, configure MCP/Codex, install the production launcher, or consume model quota. Browser,
account, MCP, and release smoke remain opt-in procedures and cannot be inferred from unit tests.
See [TEST_PLAN.md](TEST_PLAN.md), [REVIEW.md](REVIEW.md), and [UPSTREAM.md](UPSTREAM.md).

## Dependency freshness

`bun run check:dependencies` checks root and launcher using Bun `outdated` and `audit` without
installing or editing manifests. Bun 1.4.0 emits a text table even with `--json`; the checker parses
that pinned format defensively. Exact latest-version deferrals in
`.github/dependency-deferrals.json` require reviewed upstream or packaged desktop verification and
must be renewed when a newer release appears.
