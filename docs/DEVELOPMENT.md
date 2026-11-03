# Development

## Windows-only canonical path

```powershell
pwsh -NoProfile -File tools\bootstrap_dev.ps1
pwsh -NoProfile -File tools\dev_check.ps1
```

Bootstrap requires Bun `1.4.2`, installs root and launcher with `--frozen-lockfile`, and never
changes either lockfile. It also requires the GitHub CLI with authenticated GitHub access because
the canonical gate performs strict read-only upstream tracking; bootstrap never starts a login flow.
Use `pwsh -NoProfile -File tools\bootstrap_dev.ps1 -CheckOnly` to check those prerequisites. It validates Electron's contained `path.txt` runtime and safely runs the
installed lifecycle script once only when that artifact is incomplete. The repair-free gate validates
Bun/Electron, fork/upstream/dependency contracts, strict upstream and dependency checks, upstream
`bun run verify`, and Git whitespace.

## Boundaries

The canonical gates are networked source/package maintenance checks: strict upstream tracking uses
authenticated read-only GitHub API access and dependency freshness/audit may access the registry.
They do **not** sign in to ChatGPT, launch a browser, configure MCP/Codex, install the production
launcher, or consume model quota. Browser, account, MCP, and release smoke remain opt-in procedures
and cannot be inferred from unit tests.
See [TEST_PLAN.md](TEST_PLAN.md), [REVIEW.md](REVIEW.md), and [UPSTREAM.md](UPSTREAM.md).

## Dependency freshness

`bun run check:dependencies` checks root and launcher using Bun `outdated` and `audit` without
installing or editing manifests. Bun 1.4.2 emits a text table even with `--json`; the checker parses
that pinned format defensively. Deferrals in `.github/dependency-deferrals.json` require reviewed
upstream or packaged desktop verification. Each entry declares exactly one bound: `latest` retains
exact string equality; `latestPrefix` accepts one, two or three numeric components (for example
`159`, `159.0`, `159.0.8139`), or a non-empty list of unique prefixes when the registry's latest
alternates between version lines (a latest on any listed line is deferred). Prefix matching compares
whole major/minor/patch components, including prerelease and build variants within that line;
`159` never matches `1590`. Malformed, empty, duplicated or ambiguous bounds fail closed. Releases
outside the declared bound require review. The chromium-bidi 157 and 159 version lines are deferred
for the Playwright import-layout incompatibility; re-review also applies when Playwright adopts that
layout or a compatible shim is reviewed.

Launcher `audit` still runs live `bun audit --json`; `scripts/audit-launcher.ts` applies the
separate security exceptions in `.github/audit-deferrals.json`. Freshness invokes that same
launcher script, while root audit remains raw Bun audit. A security exception binds the advisory
URL, affected range, severity and every affected lock node/version; it requires a reason,
reconsideration condition and machine-enforced `revisit` deadline (Asia/Taipei, exclusive).
Unknown findings, changed nodes, invalid output, command failures and expired exceptions fail closed.
The existing dependency deferrals cover latest-version lag only, not vulnerabilities.
