# Repository guidance

- Preserve Windows product behavior, CLI names, Bun `1.4.0`, both lockfiles, Windows release
  packaging, MIT attribution, the PowerShell installer URL, and the Traditional Chinese/English READMEs.
- Fork writes belong only to `SanHsien/codex-chatgpt-web`. Upstream `miuuyy/codex-chatgpt-web` is
  read-only unless the owner explicitly authorizes contribution in this task.
- This fork supports Windows only. Run `pwsh -NoProfile -File tools\bootstrap_dev.ps1`, then
  `pwsh -NoProfile -File tools\dev_check.ps1`; neither canonical gate signs in,
  launches a browser, configures MCP/Codex, or uses model quota.
- `tools/upstream_baseline.json` is reviewed history, never a merge target. All four axes must be
  available and current before its strict check passes. Dependency deferrals are exact latest-version
  bounds: a newer release must resurface for review.
- Keep generated maintenance reports, credentials, cookies, profiles, diagnostics, and absolute local
  paths out of Git. Detailed procedures: [development](docs/DEVELOPMENT.md),
  [upstream](docs/UPSTREAM.md), [review](docs/REVIEW.md), and [test plan](docs/TEST_PLAN.md).
