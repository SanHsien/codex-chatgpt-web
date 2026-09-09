# Decisions

## 2026-09-06 — Windows-only maintenance boundary

Maintain Windows behavior, Bun 1.4.0, tests, license, and Traditional Chinese/English docs. Remove
public macOS/Linux distribution, packaging, autostart, updater, release, and developer-support surfaces.
Keep shared internal platform abstractions when they support Windows or removing them would broaden the
product refactor. Source and development use this fork; until it has a release, packaged installation
and auto-update use the pinned, reviewed upstream Windows release `v5.0.4`.

## 2026-09-07 — Upstream baseline and complete decision register

`main` remains reviewed at `c648c09501bb1b704c7ad5273fb5f5d6b8992dd2`; that initial read-only GitHub inventory
recorded latest PR #355 (`1108fa6298fab765dce6a052b7edc2510c0bad17`, closed/unmerged draft) and
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

## 2026-09-07 — Upstream #360–#361 reconciliation

The read-only inventory still reports `main` and its only branch at
`c648c09501bb1b704c7ad5273fb5f5d6b8992dd2`, latest non-PR issue #359, and latest PR #361 at
`c09aa18b8a2a84e3fa3d77dcd4b339d3575cbbe6`. No application code was imported.

| Item | Head / status | Decision | Reconsider trigger |
| --- | --- | --- | --- |
| PR #360 | open, non-draft, `UNSTABLE`; `a4cd7012150bd76789fc818bd04d55cfa90a2744`; no upstream review/comments | defer external-provider mode | Concrete Windows external-router use, upstream-reviewed stabilization without an uncommitted handoff, and bounded Windows compatibility/security acceptance of fail-closed config, journal, native-turn, launcher/setup, and subagent ownership. |
| PR #361 | open, non-draft, `UNSTABLE`; `c09aa18b8a2a84e3fa3d77dcd4b339d3575cbbe6` | reject macOS Dock/menu-bar mode | Owner-authorized, separately bounded Windows requirement with Windows-applicable design and regression evidence. |

## 2026-09-08 — Upstream #362 Windows Full-mode adoption

Read-only review of [#362](https://github.com/miuuyy/codex-chatgpt-web/pull/362) at
`80ee0e3eac62067c14dd719d702ae1d7c55fdbe5` confirmed the Windows v5.0.4 Full-mode compaction
failure: a rebuilt user preamble can place `<environment_context>` beside recommended-plugin and
AGENTS.md parts, hiding it from joined-text recognition. The minimal local port reads array parts,
deduplicates identical continuation claims, rejects conflicting claims, and leaves bare-string
content non-authority-bearing on primary paths. Continuation-only string claims remain subject to
native rollout cross-checking. No upstream branch was fetched or merged.

| Item | Head / status | Decision | Reconsider trigger |
| --- | --- | --- | --- |
| PR #362 | open, non-draft, `UNSTABLE`; `80ee0e3eac62067c14dd719d702ae1d7c55fdbe5` | adopt minimal per-part continuation environment parsing | PR head/content-part/rollout-authority shape changes, or a Windows Full-mode continuation regression fails. `contextualUserMessage` joined-text classification remains excluded pending a separately bounded vocabulary/ordering review. |

## 2026-09-10 — Upstream #417–#418 reconciliation

Only the non-PR issue axis moved since the #363–#416 register. Read-only GitHub inventory; no upstream
write, fetch, merge, or release action.

| Item | Head / status | Decision | Reconsider trigger |
| --- | --- | --- | --- |
| #417 | never allocated; API returns 404 | reject | The number is ever allocated. |
| Issue #418 | open, label `bug`, no PR; opened 2026-09-09 | defer | Platform fields contradict each other (`macOS arm64` vs `Windows 11`); a Windows reproduction with privacy-safe diagnostics identifies the empty native-tool discovery step, and a regression separates "no tool registered" from "tool registered but not selected". |

## 2026-09-09 — Upstream #363–#416 reconciliation

This register covers every PR and issue number from #363 through #416 (54 numbers; 14 were never
allocated — #382–#393, #401, #409). The read-only GitHub inventory on 2026-09-09 found upstream
`main` advanced to `e85e3693fdb4e3e033348c08df0298c20fcdb612`. No code was ported this round; items
marked `defer` are adoption candidates pending further review, not changes already applied to this fork.

| Item | Head / status | Decision | Reconsider trigger |
| --- | --- | --- | --- |
| Issue #363 | closed issue, `not_planned`, `bug` | reject | A bounded Windows reproduction shows **Keep running on close** genuinely fails to keep the bridge alive. |
| Issue #364 | closed issue, `completed`, locked, converted to Discussion | defer | The retained Discussion produces a bounded design and a Windows-reproducible size-rejection retry case this fork can verify. |
| PR #365 | closed/unmerged draft `c98cf139e185cc39d582c43b45aabd8603fde6a9` | reject | The PR is reopened or its head changes, or #376's adoption candidacy below is resolved. |
| PR #366 | closed/unmerged `6337889e8bc8ea33129f7edf931f35a9b82a9578` | reject | This fork's own verify/typecheck scripts start failing on a packaged Bun runtime without a `bunx` shim, or PowerShell fails to expand a test-file glob. |
| PR #367 | closed/unmerged `e3e230deebb796079b1cc87be21dbe64cd64ba33` | reject | #379's re-review trigger below fires. |
| PR #368 | closed/unmerged `7d63cc92ee884ef0a68674720adfdbecd86671a3` | reject | #377's re-review trigger below fires. |
| PR #369 | closed/unmerged `a3c9c4ebbed77c6b7ef6cf47e6cb951f050e4f09` | reject | A stricter, boundary-preserving design (per the #380 follow-up comment) is implemented and reviewed. |
| PR #370 | closed/unmerged `5a7abe344a4bccdbe34dde649fb2f5d50d6d581a` | reject | A fresh native trace reproduces the failure against current `main` behavior. |
| PR #371 | closed/unmerged `a83a5472c8969f5c626e652c0a082e9af18d7d14` | reject | A handoff design proven safe across cancellation, cleanup, and retention is reviewed. |
| Issue #372 | closed issue, `completed`, `bug`/`P2`/`fix: released` | defer | Escalated as an adopt candidate pending source confirmation against this fork's tunnel-monitoring startup path. |
| PR #373 | closed/unmerged `29d9c2da3b57770ce49645f02319ffd580c4cfde` | reject | #381's re-review trigger below fires with a controlled-workload comparison. |
| Issue #374 | open issue, `bug`/`enhancement`/`P2`/`investigation` | reject | The owner authorizes a bounded, Windows-scoped connector-naming design distinct from the declined redesign. |
| PR #375 | closed/unmerged `9b62e1264d91f1f922c869d1d10501104ede8c0f` | reject | A page-capacity limit is established with evidence beyond this PR and reconciled with #346/#353. |
| Issue #376 | closed issue, `completed`, `bug`/`P2`/`Windows`/`fix: released` | defer | Escalated as an adopt candidate in this round's report; port `toNamespacedPath()`-equivalent normalization into all three `pathIdentity()` copies with a Windows regression test, then update this row to `adopt`. |
| Issue #377 | closed issue, `completed`, `bug`/`P2`/`fix: released` | defer | Escalated as an adopt candidate pending source confirmation; if this fork's browser-host navigation handling lacks the same invalidation, port it with a focused regression, then update this row. |
| Issue #378 | closed issue, `completed`, locked, `enhancement`/`P3`/`backlog` | reject | Same trigger as #366 above. |
| Issue #379 | closed issue, `completed`, `bug`/`P3`/`fix: released` | defer | Escalated as a low-priority adopt candidate; confirm whether this fork's `installedLauncherCandidates()`-equivalent has the same impurity before porting. |
| Issue #380 | closed issue, `completed`, locked, `enhancement`/`P2`/`backlog` | defer | The stricter design is implemented and reviewed upstream, or the owner authorizes this fork to design it independently. |
| Issue #381 | closed issue, `completed`, locked, `enhancement`/`P2`/`backlog` | defer | A measurement-only diagnostic patch or #397's shipped fix is reviewed against this fork. |
| Issue #394 | closed issue, `completed`, `bug`/`P1`/`fix: released`/`investigation`/`awaiting retest` | defer | Escalated as an adopt candidate; audit `launcher:setup-core` handling for a removed hook and, if the harsh failure persists, port a bounded recovery path with a regression test. |
| PR #395 | closed/unmerged `9be751b3274a2aca43453608d4d9d666e6641737` | reject | A Windows safe-log trace of a stale-"Stopped thinking" cancellation is captured against current `main` behavior. |
| PR #396 | closed/unmerged `6a52fd00aed7c28bc74d3b48cca93ba528580afa` | reject | The deferral notice is confirmed on-screen during an actual failing turn with a privacy-safe capture. |
| Issue #397 | open issue, `bug`/`P1`/`fix: released`/`investigation`/`awaiting retest` | defer | Escalated as an adopt candidate; confirm this fork's page-selection logic against native browser target identity, and re-check once upstream closes #397 after retest. |
| Issue #398 | closed issue, `completed`, `bug`/`awaiting retest` | monitor | This fork reproduces the same `Compaction continuation requires one current native environment claim` failure despite the #362 port. |
| PR #399 | closed/unmerged `dirty` `31ba066893b8f7b3d64ec3e135f05db7f3dedbe5` | reject | Same trigger as #376 above. |
| PR #400 | closed/unmerged `0d389e9837e8df6f4b81ac5e326cc9f2e75bc0c5` | reject | A combined localization implementation ships in a release and the owner authorizes non-English launcher-diagnostics support for this Windows-only fork. |
| PR #402 | closed/merged `f69ec84c7b9c9fc8c21c4be4d67538e43ca3afdf` | defer | Escalated as an adopt candidate; diff this fork's personalization preflight against the merged commit and port with the included regression tests. |
| PR #403 | closed/unmerged `dirty` `d7249d5a8a4f23ac044120a595d5517113829561` | reject | #405's re-review trigger below fires with a reproducible failure on the pinned Bun 1.4.0. |
| PR #404 | closed/unmerged `451b8a372094c8594e3a9c6cfb7b7ab1de0f1394` | monitor | The fix ships in a release; then treat as a fresh adoption candidate against this fork's collaboration-wait guard. |
| Issue #405 | open issue, no labels | monitor | The requested reproduction evidence (or this fork's own login timeout on Bun 1.4.0) appears. |
| Issue #406 | open issue, `bug` | reject | The reporter retests on v5.0.6 in Full harness mode and the failure persists with a safe-log export. |
| Issue #407 | open issue, no labels | monitor | A privacy-safe safe-log export is supplied and correlates the two error timestamps to a specific launcher-side cause. |
| Issue #408 | open issue, no labels | monitor | Maintainer triage or a privacy-safe reproduction narrows the cause. |
| Issue #410 | open issue, `bug` | reject | It becomes Windows-reproducible with an actual diagnostic report. |
| Issue #411 | open issue, no labels | defer | #412/#413's re-review trigger below fires. |
| PR #412 | open, non-draft, `unstable` `e73e910bdf2fd36bf7e0cde92d27930b26660440` | defer | Escalated as a low-risk adopt candidate; port the issue-form and troubleshooting wording into this fork's own docs. |
| PR #413 | open, non-draft, `unstable` `210174707702bc64f872eff080c526295e5b5efb` | defer | Escalated as a low-risk adopt candidate alongside #412. |
| Issue #414 | open issue, `bug`, very fresh (2026-09-09) | monitor | Maintainer triage or a translated, itemized reproduction narrows the cause. |
| PR #415 | open, non-draft, `unstable` `826f8804f59cf8972571018cfb8b15b5166c3a8b` | adopt dependency advisory fixes | Ported 2026-09-10 without fetching the branch: `js-yaml` 4.3.1 → 4.3.2 in `launcher`, and root `overrides` to `@hono/node-server@2.1.1` / `hono@4.13.7` because `@hono/node-server@2.0.12` pinned `hono@4.12.34` exactly. `bun audit` clean in both workspaces; 947 tests pass. Re-review if a later advisory names either package. |
| Issue #416 | open issue, no labels, very fresh (2026-09-09) | defer | This fork independently reproduces the Extra-High/Pro coupling defect on its own installed v5.0.6-equivalent build and verifies the patch with its own regression run, or upstream reviews and accepts a version of it. |
