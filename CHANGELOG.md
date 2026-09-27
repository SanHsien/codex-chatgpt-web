# Changelog

This file records maintained-fork work and release identity. See this fork's
[releases](https://github.com/SanHsien/codex-chatgpt-web/releases) for published Windows assets.

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
