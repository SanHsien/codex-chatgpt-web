# Changelog

This file records maintained-fork work and release identity. See this fork's
[releases](https://github.com/SanHsien/codex-chatgpt-web/releases) for published Windows assets.

## 2026-11-03

- Port verified opt-in Temporary Chat (`7c7c10e`, #918) across CLI, settings, IPC and worker.
  Preserve legacy saved-chat choices by inverse migration and keep saved history as the default
  for new installs. An existing configuration or launcher state with neither chat-mode key (every
  v5.0.6 file, which always opened Temporary Chat) stays on Temporary Chat after upgrading.
  Retain `--saved-chats` as an alias for `--ordinary-chats`. Include connector-unavailable guidance
  and Automatic / Zero Risk regressions. Do not adopt `ad9a611`'s default-on change.
- Separate MCP setup readiness from catalog verification (`a738f04`, #893/#895); installation
  permits MCP setup while Doctor keeps catalog failure visible beside a healthy proxy.
  Original author of both ports: vechen <147659719+miuuyy@users.noreply.github.com>.
- Coordinate the deferred `53b6050` tools/list ABI change with the next Windows installer release
  so the connector needs only one refresh. Keep the Full Access workspace group deferred together.

- Recheck the chromium-bidi latest-tag rollback and defer the incompatible 157 and 159 version
  lines together (`latestPrefix` accepts a list of version lines); preserve Playwright's installed
  import contract and both lockfiles.
- Review upstream #935–#959 and both workspace-branch commits; port #952 plain JSON preservation
  and #953 busy-status channel filtering with regression tests. Record bounded deferrals and
  advance only the reviewed-history ledger.
  Original author of #952 and #953: r83bksga8fc3 (upstream PRs #952, #953).

- Port delivery/staging retry guards (`e1780b1`), multipart compaction transport limits
  (`f9325c9`) and delayed-final/context-cost diagnostics (`ffe041f`) to the Windows shared path.
  Guard pending and duplicate native tool results against replay, preserve checkpoint/final
  instructions, rebuild trimmed attachments and retain ordinary history. Keep source/release pins.

- Read Electron navigation and redirect guard URLs from event details, preserving renderer
  destination restrictions and main-frame authentication interception without deprecated arguments.
- Support explicit numeric `latestPrefix` dependency deferrals alongside unchanged exact `latest`
  matching; apply the chromium-bidi 159-line bound and test component boundaries and invalid policies.

- Upgrade the Windows launcher to Electron 45.2.1 and remove its freshness deferral.
- Re-review chromium-bidi, Motion and the React build plugin against exact registry releases;
  retain bounded deferrals for Playwright import-layout compatibility, animation inspection,
  and the Vite 8 peer requirement. Add a version-independent Playwright/BiDi import regression.

- Override modern launcher minimatch consumers to the patched line for GHSA-g3hv-75wg-m249.
  Preserve legacy callable APIs for ASAR/glob/directory filters under an exact-node,
  advisory-specific audit deferral expiring on 2026-11-17 (Asia/Taipei).
- Keep live Bun audit enabled in verify and dependency freshness; reject other advisories,
  changed vulnerable nodes/ranges/severity, malformed results and expired exceptions.
- Add archive, file-filter and audit-policy regressions; retain Bun, Electron and installer pins.

## 2026-11-02

- Ported four independent upstream 6.1.14-6.1.17 fixes: Doctor compaction-override check
  (`7e6e1a0`, #919), stopping the owned runtime when ownership persistence fails (`0a8f233`, #905),
  exact model selection in the explicit ChatGPT picker with the six-position effort slider
  (`89f0ead`, #921, keeping this fork's #911 effort labels), and rendered turn identity with stream
  completion tracing (`b6043e0`, #914).
- Each port carries upstream's regression tests, including the owned-runtime real-child segment and
  the Doctor no-mutation assertion. Fork source stays 6.1.13; the public Windows installer/updater
  stays v5.0.6. The remaining roadmap port row (decision-gated and dependent commits) stays open.

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
