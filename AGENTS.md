# Repository guidance

- Preserve upstream product behavior, CLI names, Bun `1.4.0`, both lockfiles, release packaging,
  MIT attribution, installer URLs, and all three README languages.
- Fork writes belong only to `SanHsien/codex-chatgpt-web`. Upstream `miuuyy/codex-chatgpt-web` is
  read-only unless the owner explicitly authorizes contribution in this task.
- Windows PowerShell is the primary path: run `pwsh -NoProfile -File tools\dev_check.ps1`. POSIX
  parity is `tools/bootstrap_dev.sh` then `tools/dev_check.sh`; neither canonical gate signs in,
  launches a browser, configures MCP/Codex, or uses model quota.
- `tools/upstream_baseline.json` is reviewed history, never a merge target. All four axes must be
  available and current before its strict check passes. Dependency deferrals are exact latest-version
  bounds: a newer release must resurface for review.
- Keep generated maintenance reports, credentials, cookies, profiles, diagnostics, and absolute local
  paths out of Git. Detailed procedures: [development](docs/DEVELOPMENT.md),
  [upstream](docs/UPSTREAM.md), [review](docs/REVIEW.md), and [test plan](docs/TEST_PLAN.md).
