# Development

## Windows-first bootstrap

Run from the repository root in PowerShell:

```powershell
pwsh -NoProfile -File tools\bootstrap_dev.ps1
pwsh -NoProfile -File tools\dev_check.ps1
```

Bootstrap verifies the exact Bun 1.4.0 runtime and installs both locked dependency trees with
`--frozen-lockfile`; it never updates a lockfile. It uses the ignored repo-local `.bun-cache` so a
stale global Bun cache cannot affect a reproducible Windows setup. The full check runs the fork-contract tests,
strict upstream baseline check, upstream `bun run verify`, and whitespace validation.

Bootstrap also verifies Electron's installed `path.txt` and referenced runtime under `launcher/node_modules/electron/dist`.
If a frozen Bun install leaves that lifecycle artifact incomplete, bootstrap runs the installed Electron lifecycle
script once and fails if the runtime is still unsafe or absent. `dev_check.ps1` never repairs it: run bootstrap first.

These source/package checks deliberately do not sign in to ChatGPT, launch a browser, use MCP,
install the production launcher, change Codex configuration, or use model quota. Account-bound
acceptance remains opt-in upstream release validation and is not a fork gate.

## Other platforms

Upstream macOS and Linux paths remain supported. Use the same Bun version and frozen installs, then
run `bun run verify`. See [upstream documentation](../README.md) for product and packaging commands.

## Upstream review

`tools/upstream_baseline.json` records a reviewed upstream `main` commit. Run:

```powershell
bun run scripts/check-upstream-baseline.ts --strict
```

The check reads the `upstream` remote and reports drift without fetching, merging, pushing, or
writing upstream. An invalid or missing baseline fails closed. Record each review outcome in
[UPSTREAM.md](UPSTREAM.md) and the rationale in [DECISIONS.md](DECISIONS.md).
