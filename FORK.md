# Maintained fork

This fork adds maintenance controls without changing upstream product behavior. Fork-only writes,
issues, releases, and workflows target `SanHsien/codex-chatgpt-web`; upstream is read-only unless
the maintainer explicitly authorizes a contribution. The reviewed upstream state is not merged
automatically: see [docs/UPSTREAM.md](docs/UPSTREAM.md), [CHANGELOG.md](CHANGELOG.md), and [ROADMAP.md](ROADMAP.md).

This is a maintained fork of miuuyy/codex-chatgpt-web, licensed under the upstream MIT License
retained in [LICENSE](LICENSE).

- Fork: [SanHsien/codex-chatgpt-web](https://github.com/SanHsien/codex-chatgpt-web)
- Upstream default branch: `main`
- Reviewed upstream baseline: `860fa576eb47d9e20d7d8289235bfea94392d2fd` (upstream `main` / `v6.1.17`, PR #934, issue #933; see [tools/upstream_baseline.json](tools/upstream_baseline.json) and [docs/UPSTREAM.md](docs/UPSTREAM.md))
- Baseline meaning: reviewed history, not merged or automatically adopted
- Adopted source version: upstream 6.1.13 (`0901b9fb1976b4a984c7e9b4082c2868767bbf7c`, adopted 2026-10-25; see [docs/DECISIONS.md](docs/DECISIONS.md))
- Published release version: `v5.0.6` Windows release identity, installer, and updater pin

This fork uses the reviewed upstream `v5.0.6` release identity for its own Windows release. That
identity does not assert source or artifact byte-equivalence with upstream; the fork's published
assets, installer, updater, support, and release records belong to `SanHsien/codex-chatgpt-web`.
Separating the adopted source version (6.1.13) from the published release version (`v5.0.6`) is an
intentional release boundary (see [docs/DECISIONS.md](docs/DECISIONS.md#2026-10-25-6x-adoption-stage-c-upstream-614-6113-0901b9f)).

Follow-up work and pending tasks are tracked exclusively in [ROADMAP.md](ROADMAP.md).

The fork preserves upstream attribution and Windows product behavior. It intentionally supports
**Windows only**: its overlay supplies Windows bootstrap, verification, packaging, updater, fork
governance, security reporting boundaries, maintenance automation, and a fail-closed upstream drift
check. Evaluate upstream changes only for Windows applicability; macOS/Linux distribution and
developer-support changes are out of scope.

This is unofficial ChatGPT Web automation, not an OpenAI API or a quota bypass. Features and
allowances depend on the user's account and plan; ChatGPT UI changes can break the integration.
Users are responsible for complying with OpenAI terms and their workspace policy.
