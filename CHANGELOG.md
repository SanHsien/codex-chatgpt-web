# Changelog

This file records maintained-fork work and release identity. See this fork's
[releases](https://github.com/SanHsien/codex-chatgpt-web/releases) for published Windows assets.

## 2026-10-29

- Reviewed the 38-commit upstream delta through v6.1.17 (`860fa57`), new PRs #914-#934 and
  non-PR issues #912-#933; recorded each decision and reconsideration condition.
- Advanced only the strict four-axis reviewed-history ledger and its contract assertions.
  Fork source stays 6.1.13; the public Windows installer/updater stays v5.0.6.
- Updated [ROADMAP.md](ROADMAP.md) and review evidence; source ports, account and package acceptance
  remain separate work.

## 2026-10-25

- Adopted upstream 6.x in three single-parent merge stages (A: 6.0 line `7579422`,
  B: 6.1.0-6.1.3 `fa2d2c6`, C: 6.1.4-6.1.13 `0901b9f`), bringing fork source to 6.1.13
  while keeping the public Windows release and installer pinned to v5.0.6.
- Restored ChatGPT Web browser automation for the updated ChatGPT UI (composer, model picker,
  power slider, turn keys, send/stop selectors), aligned launcher with 6.0 CLI and symlinked
  `config.toml`, and adopted saved chats, composer predictions, attachment upload, tunnel proxy,
  and `skills/pro-researcher`.
- Preserved Windows named-pipe handling, `toNamespacedPath`, `Codex Native2` connector identity,
  Windows-only packaging/updater, Electron 44.9.1, Bun 1.4.2, and the 80 s tool timeout cap (#904).
- Added fork fix in `chatGptModelFamilyMatches` to accept observed Chinese effort labels
  (`即时`, `中`, `高`) from upstream issue #911.
- Monitored upstream issue #910 and advanced the reviewed ledger through PR #909 and issue #911.
- Updated dependency overrides (Hono 4.13.12, `@hono/node-server` 2.1.3).
- Backlog and follow-up work are tracked in [ROADMAP.md](ROADMAP.md).

## 2026-09-20

- Added a disabled-by-default, bounded quality-loop contract. Quick verification is
  feedback-only; only a successful Full gate can emit schema-v1 evidence bound to
  the current Git HEAD.
- Reviewed upstream items #570–#589 and advanced the fail-closed baseline to PR #589
  and issue #587 without adopting unverified upstream code.

## 2026-09-13

- Adopted the reviewed upstream `v5.0.6` release identity for this fork's Windows package,
  installer, and updater. Fork assets are released and supported only from
  `SanHsien/codex-chatgpt-web`; this does not claim byte-equivalence to upstream.

## 2026-09-06

- Added the Windows-only maintained-fork overlay: frozen bootstrap, networked canonical maintenance gate,
  reviewed upstream baseline, and fork documentation.
- Removed public macOS/Linux distribution, packaging, autostart, updater, release, and developer-support
  surfaces. Future upstream changes are evaluated only for Windows applicability.
- Aligned the overlay with four-axis fail-closed upstream tracking, whole-workspace
  dependency freshness, least-privilege scheduled checks, and explicit review/test boundaries.
