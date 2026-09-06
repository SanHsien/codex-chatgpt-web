# Repository guidance

- Preserve upstream product behavior, CLI names, Bun 1.4.0, release packaging, license, and
  documentation languages unless a focused, verified compatibility fix requires a change.
- Windows PowerShell is the primary contributor path. Run `pwsh -NoProfile -File tools\dev_check.ps1`
  before proposing a change; it must not perform account-bound browser, MCP, or live-model smoke.
- Never commit credentials, cookies, browser profiles, tunnel IDs, API keys, private prompts,
  diagnostics, generated artifacts, or absolute local paths.
- `tools/upstream_baseline.json` is reviewed history, not a merge target. Run the strict checker
  before advancing it and record the reason in `docs/UPSTREAM.md`.
- Fork issues, pushes, releases, and workflows belong only to `SanHsien/codex-chatgpt-web` unless
  the owner explicitly authorizes upstream contribution.
