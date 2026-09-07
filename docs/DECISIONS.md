# Decisions

## 2026-09-06 — Windows-only maintenance boundary

Maintain Windows behavior, Bun 1.4.0, tests, license, and Traditional Chinese/English docs. Remove
public macOS/Linux distribution, packaging, autostart, updater, release, and developer-support surfaces.
Keep shared internal platform abstractions when they support Windows or removing them would broaden the
product refactor. Source and development use this fork; until it has a release, packaged installation
and auto-update use the pinned, reviewed upstream Windows release `v5.0.4`.

## 2026-09-07 — Upstream baseline and complete decision register

`main` remains reviewed at `c648c09501bb1b704c7ad5273fb5f5d6b8992dd2`; a read-only GitHub inventory
now records latest PR #355 (`1108fa6298fab765dce6a052b7edc2510c0bad17`, closed/unmerged draft) and
latest non-PR issue #359. The baseline is history, never a merge target. Every listed open item has a
Windows-applicability decision; implementation detail and links are in [UPSTREAM.md](UPSTREAM.md).

| Item | Head / status | Decision | Reconsider trigger |
| --- | --- | --- | --- |
| PR #347 | `df0224756d639edfa2124ed96c1dad75e05e06df` | adopt authenticated parent visualization-root lineage | Codex changes root shape or parent metadata. |
| PR #343 | `96070ea6f8c4a181b624a0f626e174107b5874d4` | defer Japanese diagnostics | Windows regression plus checks. |
| PR #340 / issue #314 | `ffef4f335c48b521562d4d21c26bb1c89e12f64e` | adopt V1 null-agent-path compatibility | Post-port Windows regression. |
| PR #338 | `37dbecce686bb19fe8871699e205d43ca0dbe5f8` | defer | Committed regression tests and checks. |
| PR #329 | `c55b5cef7f7a6d1b8c0759d7806a94f06d10ce77` | defer | Clean merge plus focused checks. |
| Issue #348 | closed; Windows 10 Full Harness interrupt-hook marker ordering; no verified fix | monitor | Upstream regression plus safe marker-normalization fix. |
| Issue #346 | Windows report; no verified fix | monitor | Safe reproduction or a tested fix. |
| Issue #345 | WSL-backed workspace feature | defer | Security design and integration tests. |
| Issue #344 | Windows launcher/WSL feature | defer | Security design and integration tests. |
| Issue #339 | macOS-only retired binding | reject | A Windows reproduction. |
| Issue #332 | usage-estimation enhancement | defer | Verified Windows need and bounded design. |
| Issue #328 | connector investigation | monitor | Safe logs and a regression. |
| Issue #326 | Cloudflare Tunnel feature | reject | Separate owner-authorized design. |
| Issue #323 | macOS-only stream behavior | reject | A Windows reproduction. |
| Issue #321 | Windows report; no verified fix | monitor | Safe reproduction or a tested fix. |
| Issue #319 | macOS arm64 report | reject | A Windows reproduction and a bounded Windows fix. |
| Issue #314 | linked to adopted PR #340 | adopt-linked | Post-port Windows regression. |
| Issue #312 | account-safety investigation | defer | Verified Windows need and bounded design. |
| Issue #308 | Windows report; no verified fix | monitor | Safe reproduction or a tested fix. |
| Issue #297 | native V2 encrypted enhancement | defer | Verified Windows need and bounded design. |
| Issue #286 | macOS Dock behavior | reject | A Windows reproduction. |
| Issue #278 | Windows report; no verified fix | monitor | Safe reproduction or a tested fix. |

## 2026-09-07 — Upstream #349–#359 reconciliation

The baseline moved only after a read-only review of every item. No PR was merged or copied. The
closed/unmerged PRs are not endorsements, and draft/macOS-only evidence does not establish a Windows
release fix.

| Item | Head / status | Decision | Reconsider trigger |
| --- | --- | --- | --- |
| PR #349 | closed/unmerged `f9619efd69bf397fec19edcdec53156762a88c92` | reject | Windows trace distinguishes manual Stop from upstream interruption and a no-replay classification regression passes. |
| Issue #350 | closed; macOS arm64 | reject | Current Windows reproduction with bounded local cause. |
| Issue #351 | open; macOS arm64 reports | reject | Windows safe-log trace identifies the post-submit state without replay. |
| Issue #352 | open; symlinked config checkpoint | defer | Windows link capture/setup/rollback/removal tests preserve link and target bytes. |
| Issue #353 | open; legacy compact 404 plus Web size work | defer | Windows test isolates legacy fallback and validates a bounded local error/route. |
| PR #354 | open draft `466d682f0a054ed2699c65e86465e81815c141ce` | defer | Windows packaged false-green reproduction; port only supervisor behavior and regression. |
| PR #355 | closed/unmerged draft `1108fa6298fab765dce6a052b7edc2510c0bad17` | monitor | Windows geometry/lifecycle trace plus installed no-replay/cancellation regression. |
| Issue #356 | open; Chinese per-call approval | monitor | Supported Windows flow provides observed labels/DOM and approval-mode regression. |
| Issue #357 | open; Windows Go/Think Full mode | defer | Fresh/retained Full-mode reproduction preserves connector, Luna, and explicit Think enforcement. |
| Issue #358 | open; Japanese diagnostics enhancement | reject | Owner authorizes Japanese UI support and literal dynamic-value formatter tests pass. |
| Issue #359 | open; viewport classification backlog | monitor | Windows cause is identified and a focused policy proves no replay after submit. |

Strict tracking fails on changed or unavailable main/PR/issue/branch axes; update this register before
updating `tools/upstream_baseline.json`. Dependency checks remain read-only and exact-version
deferrals must be revisited when newer releases appear.
