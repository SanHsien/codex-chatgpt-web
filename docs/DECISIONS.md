# Decisions

## 2026-09-06 — Windows-only maintenance boundary

Maintain Windows behavior, Bun 1.4.2, tests, license, and Traditional Chinese/English docs. Remove
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

## 2026-09-11 reconciliation: #419–#424 and bounded v5.0.6 ports

The #419–#424 reconciliation remains authoritative: #419 and #421 are unallocated, #420 and #423
remain deferred Windows reports without a bounded root cause, #422 remains monitored, and #424 remains
rejected as macOS-only. After that reconciliation, the fork used one exact read-only fetch of
`e85e3693fdb4e3e033348c08df0298c20fcdb612`; there was no upstream write, merge, release, or tag.
The following independently minimal ports supersede the earlier decision rows for these items only.

| Item | Decision | Boundary and evidence | Re-review trigger |
| --- | --- | --- | --- |
| #376 | adopt | `toNamespacedPath()` now normalizes each of the three owned Windows `pathIdentity()` copies before case folding; `tests/environment.test.ts` exercises indexed rollout/home namespace combinations without altering #362 authority behavior. | Codex changes rollout/state path conventions. |
| #379 | adopt | Live Windows registry discovery now requires `environment === process.env`; injected and explicit roots remain pure, covered by `tests/dev-profile.test.ts`. | Discovery injection or registry contract changes. |
| #394 | adopt | Setup recovery accepts only a fully absent managed interrupt hook; partial, changed, owned-state, and malformed TOML remain fail-closed, covered by `tests/codex-integration.test.ts`. | Hook journal/TOML ownership changes. |
| #402 | adopt | Merged source `509cfc97285cc6793af5c0e161153db0b405a767` (head `f69ec84c7b9c9fc8c21c4be4d67538e43ca3afdf`) supplied only Simplified Chinese personalization labels and parameterized `tests/personalization-connector-preflight.test.ts`; anchored control, owned-menu, deadline, cleanup, and rollback invariants remain. | ChatGPT changes localized control/menu semantics. |
| #404 | adopt | Used the v5.0.6 maintainer-local implementation, not unmerged head `451b8a372094c8594e3a9c6cfb7b7ab1de0f1394`: direct/raw guards include `collaboration__wait_agent`, retain native arguments/results, remove inherited schema default, and require the native 30,000 ms interval. `tests/chatgpt-web-harness.test.ts` covers wrong interval, direct/raw paths, and timeout-not-completion. | Native wait tool names/schema/defaults change. |

Focused suite passed on Windows/Bun 1.4.0:
`bun test tests/environment.test.ts tests/dev-profile.test.ts tests/codex-integration.test.ts tests/personalization-connector-preflight.test.ts tests/chatgpt-web-harness.test.ts`.

## 2026-09-11 selective port reconciliation: #372, #377, #397

The #419–#424 reconciliation and the first five selective ports remain unchanged. This later,
separate addendum supersedes only the older defer rows for #372, #377, and #397. It inspected the
exact read-only v5.0.5 `0b053b6750b1d4f127619765388eb43c6d212ca2` and v5.0.6
`e85e3693fdb4e3e033348c08df0298c20fcdb612` objects; no upstream write, merge, cherry-pick,
tag, or release occurred.

| Item | Decision | Boundary and evidence | Re-review trigger |
| --- | --- | --- | --- |
| #372 | adopt | Managed-tunnel adoption and fresh starts both require local MCP diagnostics proof before monitoring; unknown remains non-ready, fatal diagnostics fail closed, and startup failure runs managed cleanup. `launcher/tests/runtime-supervisor.test.cjs` covers proof/ordering/adoption/cleanup. | Tunnel diagnostics or monitor lifecycle changes. |
| #377 | adopt | Main-frame document navigation retires a retained Zero Risk binding; same-document/hash/history and child-frame navigation do not. Active resumed turns fail explicitly and require a full-context retry. `launcher/tests/browser-host.test.cjs` covers the boundary and recovery. | Electron navigation semantics or retained-turn lifecycle changes. |
| #397 | adopt | Browser-host descriptor v3 publishes native target identities for automatic surfaces, and the TypeScript consumer selects with `Target.getTargetInfo`, rejecting malformed/duplicate/retired targets and respecting abort. `launcher/tests/browser-host.test.cjs` plus `tests/launcher-browser-host.test.ts` cover producer/consumer coherence. | DevTools target identity or descriptor schema changes. |

## 2026-09-12 — Upstream #425–#458 reconciliation

Read-only inventory reviewed all 34 numbers; #440 is unallocated. Upstream `main` and its only branch
remain `e85e3693fdb4e3e033348c08df0298c20fcdb612`; latest PR is closed #456 at
`24641d5cea83693fa0a2feddb29a690f297ad1c2`, and latest non-PR issue is #458. No upstream write,
fetch, merge, cherry-pick, tag, or release occurred.

| Items | Decision | Continuation record |
| --- | --- | --- |
| #428 | adopt | Retained local-tool turns re-prove and, if absent, reselect the exact connector before prompt insertion; focused regression covers ordering and fail-closed behavior. |
| #436 | adopt | Structural personalization discovery is bounded to five seconds after label proof fails; the absolute deadline, exact selectors, cleanup, and 424 fail-closed contract remain. |
| #442 | adopt independently | Scrub all six known exact 32-character broker capabilities, including JSON-escaped boundaries; near matches remain untouched. |
| #452 | defer, acceptance gap | Actual install does not write a static model catalog, while the native smoke does. Offline tests cannot prove live Desktop picker/503 behavior; require catalog counters, `/v1/models` ingress, and 503 diagnostics before any live-usability claim. |
| #416, #418, #422–#424, #426, #430, #432, #435, #437–#439, #443–#444, #446–#451, #457 | defer/monitor | Windows or cross-platform relevance exists, but evidence is missing, non-Windows-only, unstable, or crosses a separately governed boundary. Detailed triggers are in `docs/UPSTREAM.md`. |
| #425, #427, #429, #431, #433–#434, #440–#441, #445, #453–#456, #458 | reject | Missing/unallocated, non-Windows, duplicate, broad unauthorized capability, closed failed stack, or lacks a bounded safety contract. |
| #420 | reject, supersedes prior defer | Reporter resolved it as local MCP/connector configuration rather than an upstream defect. |

Do not re-open #452 by adding `model_catalog_json` as a one-line workaround: a valid change needs
reversible journal ownership, cache invalidation, catalog provenance, and current Codex compatibility.

## 2026-09-13 — Upstream #459–#470 and dependency freshness

- #459–#461, #463, #465, #468, #470: defer pending isolated, rebased Windows contracts and tests.
- #462, #464, #467, #469: reject as unauthorized broad sub-agent capability, POSIX-only work,
  non-defect question, or a no-Windows-evidence PAC change.
- #466: monitor; it is a fresh Windows retained-follow-up report without enough evidence to distinguish
  it from #428, so do not claim universal live-account resolution.
- Dependency gate: update launcher React/React DOM and their Node/React type packages to the current
  compatible versions; keep zod 4.4.3 deferred at reviewed latest 4.6.4 because the current MCP SDK
  schema types fail against zod 4.6.4. Keep Vite 6.4.3 deferred at reviewed latest 8.3.0 pending a
  packaged Windows major-upgrade acceptance. Strict freshness and both audits must remain green.

## 2026-09-13 — Fork `v5.0.6` release identity revalidation

Read-only revalidation confirmed that upstream `main` remains
`e85e3693fdb4e3e033348c08df0298c20fcdb612`, open PR #469 remains at
`79be7ff23b16ba49cf680ebcba3b3cc6c395bbcf`, the latest non-PR issue remains #467, and no #471-or-
later item exists. Annotated tags remain `v5.0.5` at
`0b053b6750b1d4f127619765388eb43c6d212ca2` (tag-object prefix `dd254f2e`) and `v5.0.6` at
`e85e3693fdb4e3e033348c08df0298c20fcdb612` (tag-object prefix `24250dcf`). No new main, PR, or
non-PR issue code exists beyond the reviewed baseline; #470 remains unmerged and deferred.

Decision: use `v5.0.6` as the maintained fork's Windows release identity. Root and launcher
metadata, installer, updater, user-facing download links, and contracts point only to
`SanHsien/codex-chatgpt-web`. This is a release-identity and routing decision, not an upstream merge
or a claim that the fork's source or published artifacts are byte-equivalent to upstream.

## 2026-09-13 — Upstream PR #470 local usage dashboard

Read-only revalidation found open, non-draft PR #470, `feat: local usage dashboard with per-tier and
Pro version counts`, based on `e85e3693fdb4e3e033348c08df0298c20fcdb612` at head
`79be7ff23b16ba49cf680ebcba3b3cc6c395bbcf`. It is `MERGEABLE` but `UNSTABLE`, has 32 changed files,
no maintainer review or comments, actionlint success, and failing Windows/macOS/Linux verify jobs.

Decision: defer without code adoption. This optional feature broadens local storage, locking,
backup/retention, browser acceptance/outcome telemetry, launcher UI/i18n/styles/types, and upgrade
expectations; it is not a bounded Windows defect. Re-review only after an upstream merge/release with
green Windows CI and an independently validated fork contract for local-only privacy,
corruption/recovery, locking, installer/updater data preservation, acceptance-count semantics, and no
representation as official remaining quota.

## 2026-09-19 — Upstream v5.0.7, v5.0.8, and main@eaf4f09ae92d reconciliation

Read-only revalidation reviewed upstream releases v5.0.7 (`973c287edf53c37d3d9fa2356010d635a6ccf25b`),
v5.0.8 (`00aab23eb78a0d35ab575ff14044e29c0f80e711`), and latest main commit `eaf4f09ae92d4dc4429fa597b0861663138f08f8`.
The latest PR is closed #569 (head `4af00a2f67e50071f249f3c7da22a6883a2bf9c5`) and latest non-PR issue is #571.

| Scope / Item | Decision | Windows applicability and rationale |
| --- | --- | --- |
| ChatGPT DIL/PUIK response root selector (#538 / v5.0.8) | **adopt** | Fixes unread ChatGPT web responses where the assistant container does not use the legacy `.markdown` class. Directly impacts Windows browser automation stability without altering security boundaries. |
| Launcher-side system proxy discovery (#535, #438 / v5.0.8) | defer | Windows native loopback proxy routing is already functioning in our overlay; defer deeper runtime refactoring pending concrete Windows reproduction of loopback proxy failure. |
| 6-part context transport (commit `eaf4f09ae92d`) | defer | Increases context staging complexity; our Windows overlay maintains stable 3-part transport with thorough test coverage. |
| Multi-language UI additions & Skills as files (#534 / v5.0.8) | reject | Non-core experimental features that add unnecessary complexity to this Windows-focused, self-contained fork. |
| Non-Windows distribution & release workflows | reject | Retain strict Windows-only scope; non-Windows scripts and artifacts are excluded. |

## 2026-09-19 — Upstream #570–#589 follow-up

Read-only review covered the complete allocated range; #572–#576, #586, and #588 are unallocated.
Upstream `main` and branch heads remain unchanged. No upstream fetch, merge, or write occurred.

- Defer #577–#583 and #585 pending upstream acceptance plus bounded Windows lifecycle, visual,
  replay, and route-ownership evidence. #582 is the strongest Windows adoption candidate but still
  lacks upstream checks and packaged visual verification.
- Defer #589: debugger-based runtime rewriting of a changing ChatGPT bundle is too brittle to adopt
  without green Windows evidence and an explicit fail-safe compatibility contract.
- Reject #570–#571 as non-Windows, #584 as an unrequested localization expansion, and #587 as an
  unbounded architecture proposal.
- Advance the reviewed ledger to PR #589 at `534fbefa9a51ec60518561ca937a3b8e51320245`
  and non-PR issue #587; neither is a merge target.

## 2026-09-21 — Upstream #590–#618 follow-up

Read-only review covered every allocated PR and issue number from #590 through #618 (25 items;
`main` remains `eaf4f09ae92d4dc4429fa597b0861663138f08f8`, unchanged since the 2026-09-19 baseline).
No upstream fetch, merge, cherry-pick, tag, or release occurred; this pass does not merge any code.

| Item | Exact observed state | Decision | Windows applicability and rationale |
| --- | --- | --- | --- |
| [#590](https://github.com/miuuyy/codex-chatgpt-web/pull/590) | closed, unmerged, `CLEAN` | reject | Opt-in local Grok CLI compaction is a new third-party-CLI integration surface outside this fork's ChatGPT-web-only scope. |
| [#593](https://github.com/miuuyy/codex-chatgpt-web/pull/593) | open, non-draft, `UNSTABLE` | defer | Cross-thread follow-up authentication fix is plausibly Windows-relevant but has no upstream review or Windows-specific acceptance yet. |
| [#596](https://github.com/miuuyy/codex-chatgpt-web/pull/596) | closed, unmerged, `CLEAN` | reject | Recognizing another host's `.codex` visualization root addresses a multi-host bridge topology this fork does not support. |
| [#597](https://github.com/miuuyy/codex-chatgpt-web/pull/597) | closed, unmerged, `CLEAN` | defer | Broad browser-turn/observation-recovery/launcher-lifecycle stabilization; closed without merge, no isolated Windows regression exists to port piecemeal. |
| [#598](https://github.com/miuuyy/codex-chatgpt-web/pull/598) | open, non-draft, `UNSTABLE` | reject | New opt-in browser-host-only launcher mode is a product-surface expansion, not a defect fix. |
| [#600](https://github.com/miuuyy/codex-chatgpt-web/pull/600) | open, non-draft, `UNSTABLE` | defer | Directly targets Windows MCP Setup `tunnel-client` install failures; strongest Windows adoption candidate in this batch, but lacks upstream review/green checks. |
| [#601](https://github.com/miuuyy/codex-chatgpt-web/pull/601) | open, non-draft, `UNSTABLE` | defer | Reading turn environment across a native compaction summary overlaps this fork's already-adopted #362/#376 environment-authority ports; needs a diff against current source before porting. |
| [#602](https://github.com/miuuyy/codex-chatgpt-web/pull/602) | open, non-draft, `UNSTABLE` | defer | Explicit unavailable-Pro-effort classification is plausibly Windows-relevant UI state handling, no Windows-specific acceptance evidence yet. |
| [#603](https://github.com/miuuyy/codex-chatgpt-web/pull/603) | open, non-draft, `UNSTABLE` | defer | Rate-limit dialog classification between multipart stages; same rationale as #602. |
| [#604](https://github.com/miuuyy/codex-chatgpt-web/pull/604) | open, non-draft, `UNSTABLE` | defer | Preserving replacement broker sockets during shutdown touches launcher lifecycle; no Windows-specific regression evidence yet. |
| [#611](https://github.com/miuuyy/codex-chatgpt-web/pull/611) | open, non-draft, `UNSTABLE` | defer | Localizing temporary-chat personalization labels overlaps this fork's already-adopted #402 zh-CN labels; related to open issue #609 below. |
| [#613](https://github.com/miuuyy/codex-chatgpt-web/pull/613) | open, non-draft, `UNSTABLE` | defer | Tolerating reordered Codex interrupt hook state is directly relevant to this fork's #394 interrupt-hook port and open issue #612 below. |
| [#615](https://github.com/miuuyy/codex-chatgpt-web/pull/615) | closed, unmerged, `DIRTY` | reject | Measured ChatGPT message-budget/resumable-context-handoff feature; closed without merge, no bounded Windows defect. |
| [#616](https://github.com/miuuyy/codex-chatgpt-web/pull/616) | closed, unmerged, `DIRTY` | reject | Duplicate re-submission of #615; same rationale. |
| [#594](https://github.com/miuuyy/codex-chatgpt-web/issues/594) | closed, `not_planned` | reject | Maintainer did not plan to fix the persistent-session model-resolution report. |
| [#595](https://github.com/miuuyy/codex-chatgpt-web/issues/595) | open, `bug` | monitor | Multi-device turn-token invalidation has no Windows-specific reproduction or fix yet. |
| [#599](https://github.com/miuuyy/codex-chatgpt-web/issues/599) | closed, `not_planned` | reject | Windows localhost-Responses-provider candidate fix for #452 was closed `not_planned`; this fork's own #452 row in the prior register remains the tracked entry. |
| [#605](https://github.com/miuuyy/codex-chatgpt-web/issues/605) | open, `bug` | monitor | In-app browser stuck loading on resume; no isolated cause or regression yet. |
| [#606](https://github.com/miuuyy/codex-chatgpt-web/issues/606) | open, no label | reject | Explicitly reproduced on Linux with current main DEV smoke also failing there; no Windows-specific evidence. |
| [#609](https://github.com/miuuyy/codex-chatgpt-web/issues/609) | open, no label | defer | Hardcoded EN/ZH locale regex in `ensureChatGptPersonalizedConnectorAccess` breaking other locales (e.g. cs-CZ) is a real correctness gap tracked by open PR #611 above. |
| [#610](https://github.com/miuuyy/codex-chatgpt-web/issues/610) | open, no label | monitor | "Extra High" effort forcing an "Upgrade to Pro" modal on Plus overlaps this fork's already-adopted #436 personalization-preflight port; no Windows-specific regression evidence supplied yet to distinguish this from expected product gating. |
| [#612](https://github.com/miuuyy/codex-chatgpt-web/issues/612) | open, no label | defer | `doctor` rejecting a semantically unchanged interrupt hook after Codex reorders trust state is tracked by open PR #613 above and relevant to this fork's own #394 fail-closed hook logic. |
| [#614](https://github.com/miuuyy/codex-chatgpt-web/issues/614) | open, no label | monitor | TROUBLESHOOTING `[agents]` fix producing a "duplicate field" error for `max_threads` on codex-cli 0.155.1 needs a reproduction against this fork's pinned CLI version before any local doc/code change. |
| [#617](https://github.com/miuuyy/codex-chatgpt-web/issues/617) | open, `bug` | monitor | Windows v5.0.8 Full Harness connected but the Codex Native2 Tunnel connector cannot be created; Windows-relevant but no isolated cause or upstream triage yet. |
| [#618](https://github.com/miuuyy/codex-chatgpt-web/issues/618) | open, `bug` | monitor | Codex execution succeeding on the first chat then failing on the second message has no isolated cause or Windows-specific regression yet. |

No item in this batch was ported; every `defer`/`monitor` decision needs either upstream review,
a Windows-specific reproduction, or an owner-authorized porting task before code moves. Advance the
reviewed ledger to PR #616 at `64362fd2a802c5fdb2869ea66c0ea055c6451972` and non-PR issue #618;
`main` (`eaf4f09ae92d4dc4429fa597b0861663138f08f8`) and both branch heads (`6.0.0`, `main`) are
unchanged and remain current. Neither axis is a merge target.

## 2026-09-21 — Upstream #619–#620 follow-up

Read-only review of the two non-PR issues opened after the #590–#618 batch. No new pull request,
`main` commit or branch head appeared.

| Item | Upstream state | Decision | Reason |
| --- | --- | --- | --- |
| [#619](https://github.com/miuuyy/codex-chatgpt-web/issues/619) | open, no label | monitor | Long sessions failing after compaction with `missing cwd in trusted Codex environment context` on v5.0.8 / Codex 0.154; no isolated cause, upstream triage or Windows-specific evidence yet. |
| [#620](https://github.com/miuuyy/codex-chatgpt-web/issues/620) | closed, no label | monitor | Setup CLI rejecting `--app-name` for the Native2 connector after an upstream CLI change; closed upstream without a linked fix PR, and no reproduction against this fork's setup path yet. |

Nothing was ported. Advance the reviewed non-PR issue ledger to #620; the PR ledger stays at
#616 (`64362fd2a802c5fdb2869ea66c0ea055c6451972`) and `main` stays at
`eaf4f09ae92d4dc4429fa597b0861663138f08f8`.

## 2026-09-25 — main@75794225, PR #617–#658, issues #621–#662, and branch removal

`main` advanced `eaf4f09ae92d…` → `757942251222…` via six commits, the largest being a squashed
`6.0.0` feature release (opt-in Pro usage tracking, new model catalog, saved chats, 6-part context
transport, native Linux ARM64 packaging, staged updater). The `6.0.0` branch (previously at the old
`main` head) is gone — it was merged, not lost. Decision: **defer** the whole `main`/`6.0.0` advance;
this fork stays on its own reviewed 3-part-transport Windows-only baseline, and any adoption is a
bounded, separately owned task (touches dependency files outside this worker's scope).

Re-evaluated the Windows rollout-path identity candidate (#376/#365/#399): built an isolated
reproduction and a codebase-level regression fixture for `pathIdentity()` not stripping an incoming
`\\?\`/`\\?\UNC\` extended-length prefix before `resolve()`. Under both `node` and `bun` 1.4.2 on this
Windows host, `resolve()` + `toNamespacedPath()` + `toLowerCase()` already normalize prefixed and
un-prefixed forms of the same path to the same identity — no defect reproduces. No source change was
kept; a drafted no-op fix and test were verified inert and reverted. The 2026-09-11 `#376` `adopt`
decision (`toNamespacedPath()` itself) is unchanged.

| Item | Head / status | Decision | Reconsider trigger |
| --- | --- | --- | --- |
| `main`/`6.0.0` (commits `8bd72e512cec`…`757942251222`) | squashed 6.0.0 release + 3 follow-ups | defer | Owner authorizes a bounded 6.0.0 adoption plan with its own dependency/packaging review. |
| Branch `6.0.0` removed | merged into `main` | n/a, inventory change | — |
| pathIdentity() extended-prefix candidate (#376/#365/#399) | re-evaluated, no defect found | reject (no port needed) | A concrete Windows reproduction demonstrates `resolve()`/`toNamespacedPath()` mishandling a `\\?\`/`\\?\UNC\` input on the fork's actual pinned Bun version. |
| PR #623 | closed/unmerged, draft, `3420e522f046a217c4d57cbcad2e4c425232cd79` | reject | A worker/control-server-based lease-cancellation design (matching this fork's own architecture) is proposed and tested. |
| PR #627 | closed/unmerged, `eaeb42ad140b3eae9d01208e93ab96f64edd688f` | reject | Superseded by an unreleased, differently worded local fix upstream; no isolated diff exists. |
| PR #638 | closed/unmerged, `37677cf79259c60f94fa5f953ca5f75f9b0136f7` | reject | Maintainer declined it outright (unwanted `.omx` logs, reverted release protections). |
| PR #649 | closed/unmerged, `06dc7b830a978b11828f5fff89a0d19f8cc946c4` | reject | Declined as out-of-scope six-language localization; related correctness gaps tracked under #640/#642/#648. |
| PR #650 | closed/unmerged, `c3dcadf1712b025400a2d1bea6484247c9356d5a` | reject | Declined: shown to drop a completed tool-call result in the PR's own isolated check. |
| PR #654 | open, `1cb4acb6461a80765e7c1bfb446fc7b16cdf9f5f` | **adopt** | Ported 2026-09-25: `overlapsDisplay()` in `launcher/electron/window-state.cjs` now requires 96px width / 32px title-bar height inside a display's work area before keeping saved window coordinates. `launcher/tests/window-state.test.cjs` covers it; `node --test` passes. Re-review if Electron's display/work-area geometry contract changes. |
| PR #656 | open, `90adf9dc9f37349cfef85448536bb9d72d4449b7` | **adopt** | Ported 2026-09-25: `readRecent()` in `launcher/electron/logging.cjs` now reads the rotated `launcher.jsonl.1` before the current file, capped at 300 records. `launcher/tests/logging.test.cjs` covers it; `node --test` passes. Re-review if the log-rotation file-naming contract changes. |
| PR #658 | open, `f3173055eea2976aebdd4cb3c62faeb3ac0f489c` | **adopt** | Security-relevant; ported 2026-09-25: `exportSanitizedLogs()` in `launcher/electron/logging.cjs` now also compares `fs.realpathSync()` output and device/inode identity, not just resolved path strings, before writing — closing a hard-link/symlink overwrite of source logs. `launcher/tests/logging.test.cjs` covers it (symlink case skipped on Windows, matching upstream); `node --test` passes. Re-review if the export destination-identity check changes. |
| #621 | closed, macOS | reject | A Windows reproduction. |
| #622 | open, cross-platform tracking | monitor | A bounded Windows-specific defect is isolated from the tracking issue. |
| #624 | closed, Linux | reject | Outside Windows-only scope. |
| #626 | closed `not_planned`, Windows | monitor | A reproduction against this fork's own `psmux`/`tmux` detection. |
| #628 | closed, Linux | reject | Outside Windows-only scope. |
| #629 | open, Windows | monitor | An isolated cause for the intermittent Native2 turn-token failure. |
| #630 | open, macOS | reject | A Windows reproduction. |
| #631 | open, macOS | reject | A Windows reproduction. |
| #633 | closed `not_planned`, Windows | monitor | A reproduction against this fork's own `ALL_TOOLS` follow-up-turn handling. |
| #634 | closed `not_planned`, no body | reject | Any reproduction evidence at all. |
| #635 | closed `completed`, `fix: released`, Windows | defer | This fork's own hyperlink-preservation path is checked against a Windows reproduction. |
| #636 | closed `not_planned`, no body | reject | Any reproduction evidence at all. |
| #637 | closed `completed`, no label | defer | This fork's automatic-route/effort-pinning logic is checked against a reproduction. |
| #639 | closed `not_planned` | reject | Specific to the deferred `v6.0.0` model-capacity path. |
| #640 | open, `fix: committed-unreleased`, Windows | monitor | A bounded `6.0.0` adoption decision is made (fix is entangled with the deferred base). |
| #642 | closed `completed`, `fix: committed-unreleased`, cross-platform | defer | The Korean-label fix is isolated from the rejected six-language localization expansion it ships with. |
| #643 | closed `duplicate` | reject | — |
| #645 | closed `not_planned`, no body | reject | Any reproduction evidence at all. |
| #646 | open, macOS | reject | A Windows reproduction. |
| #647 | open, macOS | reject | A Windows reproduction. |
| #648 | closed `not_planned`, Windows | reject | Declined upstream alongside PR #649. |
| #651 | closed `completed`, no platform info | reject | Any Windows-specific reproduction. |
| #652 | open, Linux | reject | Outside Windows-only scope. |
| #653 | open, cross-platform | adopt-linked | Tracked by adopted PR #654; ported. |
| #655 | open, cross-platform | adopt-linked | Tracked by adopted PR #656; ported. |
| #657 | open, cross-platform | adopt-linked | Tracked by adopted PR #658; ported. |
| #659 | open, Windows | defer | A bounded installer-retry/backoff design is drafted. |
| #660 | closed `not_planned` | reject | Declined upstream. |
| #661 | open, Windows | monitor | Specific to the deferred `v6.0.0` base; an isolated cause on this fork's own baseline. |
| #662 | open, Windows | monitor | An isolated cause for the `launcher:browser-smoke` login-expired error. |

Five more items (PR #664, issues #663/#665–#667) appeared upstream while this review was in
progress; `main` did not move again. #664 (draft, `UNSTABLE`) adapts browser-worker selectors to
ChatGPT's September 24 interface change — the same DOM-drift class as the adopted #538 fix — but is
too large/unstable to port this round.

| Item | Head / status | Decision | Reconsider trigger |
| --- | --- | --- | --- |
| #663 | open, `bug`, no body | reject | Any reproduction evidence at all. |
| PR #664 | open, draft, `UNSTABLE`, `39dbceaee47f8821a5df0bc06a9785bb1b9e9cfc` | defer | It leaves draft with green checks, or this fork's own browser-worker smoke test reproduces the composer/send failure independently. |
| #665 | open, Linux x64 | reject | Outside Windows-only scope. |
| #666 | open, feature request | monitor | It becomes a bounded, owner-authorized Windows-scoped documentation/UI task. |
| #667 | open | defer | Same trigger as PR #664 above (tracks it). |

One more issue (#668) appeared during verification; same symptom class as #662/#667, on `v6.0.0`.

| Item | Head / status | Decision | Reconsider trigger |
| --- | --- | --- | --- |
| #668 | open, `bug`, Windows 10, `v6.0.0` | defer | Same trigger as #667/PR #664 above. |

Advance the reviewed ledger to `main` `757942251222ee0f71953c35636679c6d92dd636`, PR #664 at
`39dbceaee47f8821a5df0bc06a9785bb1b9e9cfc`, non-PR issue #668, and branch inventory `main` only.

## 2026-09-30 reconciliation: main@fa2d2c6c, PR #665–#739, issues #663–#738

Read-only inventory: upstream `main` advanced six commits to `fa2d2c6c24926078b46eedb2186f69f2e8d548d7`
(releases 6.1.0–6.1.3 plus two follow-ups; 90 files, +3497/-505), tag `v6.1.2` fetched, latest PR is
closed #739 at `9d42927b342644590c07696939dfd99a1928ea9c`, latest non-PR issue is #738, and `main` is the
only branch. Histories are unrelated (squashed fork), so nothing is merged; only isolated ports are adopted.

| Item | Decision | Reason | Reconsider when |
| --- | --- | --- | --- |
| Commits `2933410`, `8d37291`, `76aa5d1`, `2d73f62`, `fa2d2c6` (6.1.0–6.1.3) | defer (adoption pending: built on the deferred 6.0.0 base, entangled across 90 files, verified only by account-bound browser acceptance that offline gates cannot prove) | Same class as the deferred #664 DOM-drift fix; this fork remains on the v5.0.6 identity. | Owner authorizes a bounded 6.0.0/6.1 adoption plan. |
| Commit `a13cd09` (test fixture line endings) | not-applicable | Touches fixtures that exist only on the 6.x tree. | Same as above. |
| PR #729 fast-uri 3.1.6 -> 3.1.7 (GHSA-58mr-gqgx-xq4g, GHSA-qw65-cvwx-89v3) | **adopt** | Fork pins `fast-uri` 3.1.6 in `overrides` of `package.json` and `launcher/package.json`; raised both plus both `bun.lock` (integrity from `bun install`); superseded by 3.1.8 in the dependency pass below. | - |
| PRs #669, #681, #689, #698, #707, #718, #727, #728, #730 (browser worker/broker/steering fixes) | defer | Patch the 6.x browser-worker and broker code, absent in this baseline. | Adoption plan above. |
| PRs #679, #719 (ProLite/Pro usage title), #705 (catalog diagnostics), #683 (workspace-write recovery) | defer | Depend on 6.0.0 Pro-usage tracking and model catalog. | Adoption plan above. |
| PR #725 (system theme in launcher browser) | monitor | Cosmetic, open upstream. | It merges. |
| PR #692 (NODE_USE_SYSTEM_CA on Windows), closed | monitor | Windows-relevant proxy/CA behavior but unmerged upstream; no reproduction here. | A Windows CA failure is reproduced here. |
| PRs #691 (image capture feature), #694 (updater proxy; fork removed the updater), #735 (README video), #732 (withdrawn), #739 (empty arena PR) | reject | Feature, removed surface, promo, or withdrawn/junk. | - |
| Issues #673, #678, #682, #693, #699, #700, #702, #704, #708, #709, #711, #712, #715, #717, #721, #724 (Windows) | defer | All are v6.1.x reports; the code paths do not exist in the v5.0.6 baseline. | Adoption plan above. |
| Issues #672, #674, #676, #680, #686, #687, #690, #737, #738 (cross-platform/unlabeled 6.1 harness) | defer | Same as above. | Adoption plan above. |
| Issues #703 (account invalidated after sustained automation) | monitor | Account-safety risk applies to any automated ChatGPT use; needs-info upstream. | Upstream identifies a cause. |
| Issues #675, #677, #695, #696, #697, #720, #726, #736 (macOS), #684, #685, #713, #722, #723, #731 (Linux), #688 (Unix socket) | reject | Outside the Windows-only scope. | - |
| Issues #670, #671, #733, #734 | reject | Docs/video, declined `not_planned`, or withdrawn. | - |

Counts: 6 commits (all defer or not-applicable), 21 PRs (1 adopt, 13 defer, 2 monitor, 5 reject), 46 issues
(25 defer, 1 monitor, 20 reject).

Advance the reviewed ledger to `main` `fa2d2c6c24926078b46eedb2186f69f2e8d548d7`, PR #739 at
`9d42927b342644590c07696939dfd99a1928ea9c`, non-PR issue #738, and branch inventory `main` only.

## 2026-10-01 addendum: PR #740–#744, issues #739–#743

Read-only re-check after the reconciliation above; `main` is unchanged at `fa2d2c6c24926078b46eedb2186f69f2e8d548d7`.
Numbers #740 and #741 are not retrievable through the API (absent or removed).

| Item | Decision | Reason | Reconsider when |
| --- | --- | --- | --- |
| PR #742 (session continuity), closed unmerged | reject | 239-file contributor rewrite closed without merge; not reviewable as an isolated port. | It is reopened as a focused change. |
| PR #744 (multi-account profile pooling, failover, longer compaction timeout), open, `unstable`; `11cfdad80d86b132f331bd2b6871b56de210c837` | reject | Rotating several ChatGPT accounts to avoid per-account rate limits works against this fork's account-safety stance (see #703) and touches 6.x-only browser-host code. | It merges upstream and a single-account, Windows-relevant part can be split out. |
| Issue #743 (Developer Mode missing on a Plus account, MCP app setup), open, `bug` | defer | Reported against 6.1.3 and depends on an account plan/setting, not on code in this baseline. | Adoption plan above, or an account-independent cause is found. |

Advance the reviewed ledger to PR #744 at `11cfdad80d86b132f331bd2b6871b56de210c837` and non-PR issue #743.

## 2026-10-01 addendum 2: PR #748, issues #745–#747

Re-check before the push; `main` is still `fa2d2c6c24926078b46eedb2186f69f2e8d548d7`.

| Item | Decision | Reason | Reconsider when |
| --- | --- | --- | --- |
| PR #748 (Microsoft 365 / Cursor compatibility), open; `fee796790f31287caade25b2b61a0101972463be` | defer | 58 files, +12059/-333 feature work on the 6.x base this fork has deferred; not reviewable as an isolated port. | It merges upstream and the 6.x adoption plan above is taken up. |
| Issue #745 (6.1.3 Full harness: read-only review runs blocked by a safety-status check), open, `bug` | defer | Reported against 6.1.3 behaviour that this baseline does not ship. | The 6.x adoption plan above, or the report reproduces on this baseline. |
| Issue #746 (expose `autoApproveToolCalls` in Launcher Settings), open, feature | defer | Feature request; changes an approval default, which needs an explicit product decision here. | Upstream ships it and the 6.x adoption plan is taken up. |
| Issue #747 (Codex computer use cannot reach the built-in browser), open, `bug` | defer | Reported against 6.1.3; no fix upstream yet. | Upstream lands a fix, or it reproduces on this baseline. |

Advance the reviewed ledger to PR #748 at `fee796790f31287caade25b2b61a0101972463be` and non-PR issue #747.

## 2026-10-01 dependency maintenance

The strict dependency gate failed on advisories and unreviewed updates; resolved without raising runtime floors.

| Item | Decision | Reason | Reconsider when |
| --- | --- | --- | --- |
| `fast-uri` (GHSA-hrr3-gc8f-f4qj, fixed at 3.1.8) | **adopt** | `ajv@8.20.0` pins `fast-uri@3.1.7` exactly, so `bun audit fix` was blocked; root and launcher `overrides` moved 3.1.7 -> 3.1.8 (same major). | An `ajv` release declares a fixed range, then the override can be dropped. |
| `ip-address` 10.3.1 -> 10.7.1 (4 advisories via `@modelcontextprotocol/sdk` > `express-rate-limit`) | **adopt** | In-range lockfile update from `bun audit fix`; no manifest change. | - |
| `brace-expansion` 1.1.21 / 2.1.7 / 5.0.12, `undici` 6.28.1 / 7.29.1 (launcher, via `electron-builder` and `electron`) | **adopt** | In-range lockfile updates from `bun audit fix`; `bun audit` is clean in both workspaces. | - |
| `@modelcontextprotocol/sdk` 1.30.1 -> 1.31.0 | **adopt** (lock only) | In range of the existing `^1.30.1`; the declared floor is unchanged. | - |
| `@types/node` 24.13.4 -> 24.19.0 (launcher) | **adopt** | In-range dev typings that stay on the 24.x line of the bundled Electron Node. | - |
| `electron` 44.4.5 -> 44.5.1 | defer | Same-major change to the packaged runtime and an exact pin; needs a packaged installer run. Recorded in `.github/dependency-deferrals.json`. | 44.5.1 or later is verified with launcher package and smoke:package. |
| `motion` 13.5.0, `@types/node` 26.6.3, `vite` 8.3.2, `chromium-bidi` 157.0.8081-0 | defer (renewed) | Latest advanced past the recorded bound; the earlier reasons stand (visual runtime major; Node 24 typings match Electron; vite and its React plugin move together; browser-protocol major). | Latest moves again, or the Electron pin bundles a newer Node major. |

Result: `bun audit` clean in both workspaces; `bun run check:dependencies --strict` reports `current`.

## 2026-10-24 audit advisories (required check `verify`)

`bun run audit` failed `verify` with 13 root advisories (1 critical, 4 high, 6 moderate, 2 low), and `bun run launcher:audit` was failing behind it with 18 more; both workspaces are clean now.

| Item | Decision | Reason | Reconsider when |
| --- | --- | --- | --- |
| `@modelcontextprotocol/sdk` 1.31.0 -> 1.32.0 (3 advisories, direct), `body-parser` 2.3.0 -> 2.4.0, `proxy-addr` 2.0.7 -> 2.0.8 (critical), `ip-address` 10.7.1 -> 10.7.4 | **adopt** | In-range lockfile updates from `bun audit fix`; the declared `^1.30.1` floor is unchanged. | - |
| `hono` 4.13.7 -> 4.13.11, `fast-uri` 3.1.8 -> 3.1.9 (root and launcher) | **adopt** | Existing `overrides` moved by hand: `@hono/node-server@2.1.1` and `@modelcontextprotocol/sdk` pin `hono` exactly, and `ajv@8.20.0` pins `fast-uri` exactly, so `bun audit fix` is blocked. | A dependent declares a fixed range, then the override can be dropped. |
| `zod` 4.4.3 -> 4.6.6 (direct pin) and new `overrides` entry `zod` 4.6.6 | **adopt** | GHSA-mrhx-c7xc-m3w5 is fixed only in 4.6.6 and `chromium-bidi@12.1.0` depends on `zod@^3.24.1`, so `bun audit fix` is blocked and no fixed 3.x exists. Only `chromium-bidi` pulled zod 3 (the SDK accepts `^3.25 \|\| ^4.0`), so the override collapses the tree to one zod. `chromium-bidi` is reached only through `playwright-core`'s lazy BiDi-over-CDP path (`chromium-bidi/lib/cjs/bidiMapper/BidiMapper`), which this repo does not use (it calls `chromium.launch`, `launchPersistentContext` and `connectOverCDP` without the `bidi-chromium` channel). Verified anyway: after the override `chromium-bidi` resolves `zod@4.6.6` (its nested `zod@3.25.76` is gone from `bun.lock`), and a real `channel: "bidi-chromium"` launch of Chrome still opens a page and reads its DOM; `bun run typecheck` passes with the SDK 1.32.0 schema types, so the old 4.6.5 TS2322 deferral is removed. | `chromium-bidi` is moved to a release that depends on zod 4 (158.x), then the override can be dropped. |
| `electron` 44.4.5 -> 44.9.1, `vite` 6.4.3 -> 6.4.4, `undici` 6.29.1 / 7.30.1, `http-cache-semantics` 4.3.0, `source-map-js` 1.2.2 (launcher) | **adopt** | `bun audit fix` (18 advisories). Electron has an exact pin; 44.9.1 is where GHSA-jr5w-w6x2-84p9 (high) is fixed and still bundles Node 24 (24.22.0), so `@types/node` 24.x stays. The earlier 44.5.1 deferral is replaced by a 45.0.0 (major) deferral. A packaged installer run (launcher package and smoke:package) was not performed. | A packaged installer run with Electron 44.9.1 or later is recorded. |
| `zod` 4.6.7, `@modelcontextprotocol/sdk` 1.32.2, `playwright-core` 1.64.1, `chromium-bidi` 158, `react` 19.3.1 and other freshness drift | not touched | Outside this fix; `bun run check:dependencies --strict` still reports `attention` for them and needs its own sweep. | The next dependency sweep. |

## 2026-10-25 dependency maintenance

`bun run check:dependencies --strict` reported `attention` after the 10-24 audit fix; this sweep clears it without raising any declared floor.

| Item | Decision | Reason | Reconsider when |
| --- | --- | --- | --- |
| `@modelcontextprotocol/sdk` 1.32.2, `playwright-core` 1.64.1 (root); `react`/`react-dom` 19.3.1, `@types/node` 24.19.2, `electron-builder` 26.18.0, `vite` 6.4.5 (launcher) | **adopt** | In-range lockfile updates; declared ranges are unchanged. `electron-builder` 26.18.0 lowers its own `@noble/hashes` dependency from `^2.2.0` to `^1.8.0`, so the launcher lock resolves 1.8.0; this is the dependent's declaration, not ours, and `bun audit` stays clean. | - |
| `zod` 4.6.6 -> 4.6.7 (direct pin and `overrides`) | **adopt** | Patch release of the exact pin; the override keeps one zod in the tree as recorded on 2026-10-24. | - |
| `playwright-core` deferral | removed | The lock now holds the latest release, so nothing is outdated. | - |
| `@types/bun` 1.4.4 | **defer** (new entry) | The exact pin 1.4.2 mirrors the pinned Bun 1.4.2 runtime (`engines`); the types move with the Bun pin. | The Bun pin moves. |
| `chromium-bidi` 158.0.8123-0, `motion` 14.6.0, `@types/node` 26.6.5, `@vitejs/plugin-react` 6.1.2, `vite` 8.3.5, `typescript` 7.0.2, `turndown` 7.2.4, `@types/turndown` 5.0.6, `electron` 45.0.0 | **defer** (renewed) | Reasons unchanged from earlier reviews; `latest` values and review dates refreshed in `.github/dependency-deferrals.json`. | A newer release resurfaces them; or the reason named in each entry is met. |

Result: `bun audit` clean in both workspaces; `tsc` and launcher typecheck pass.

## 2026-10-25 reconciliation: main@0901b9fb, PR #749–#909, issues #748–#906

Upstream `main` advanced from `fa2d2c6` to `0901b9fb1976b4a984c7e9b4082c2868767bbf7c` (v6.1.4–v6.1.13, 40 commits). This fork is still the v5.0.6 Windows-only 3-part-transport baseline, so the 6.x line stays deferred as a whole, following the earlier decisions above. This ledger comes from a read-only inventory by four reviewers (compaction, browser, launcher, issues); nothing was written upstream.

Fork evidence is cited as `file:line` at fork `38b0cc8` (before this pass). Numbers #756, #779, #796, #798, #839, #846, #862, #878, #887, #901, #903, #907 and #908 return 404 from the API (never allocated).

### Adopted in this pass

Ported as fork-local implementations of the upstream approach, not as cherry-picks; each has a regression test in the same change.

| Item | Decision | Reason | Reconsider when |
| --- | --- | --- | --- |
| Orphan-promise catch (same shape as PR #750, upstream 6.1.4) | adopt | `withBrowserTurnAbort`, `withAbort` and `withCompactionAbort` returned `Promise.reject` on an already-aborted signal without observing the abandoned promise (`browser-worker.ts:1124`, `index.ts:75`, `compaction-handoff.ts:144`). Bun 1.4.4 exits the process on an unhandled rejection (probe exit=1). Fixed in all three files; test `tests/turn-abort-orphan.test.ts`. | A Bun release changes unhandled-rejection handling. |
| PR #858 (auto-approve clicked while the tool request was still streaming, "Invalid conversation body") | adopt | The `autoApprove` branch pressed Enter after only a visibility wait and never checked the Stop button (`browser-worker.ts:793-801`). It now waits for the Stop button to clear. Files: `browser-worker.ts`, `tests/browser-worker-contract.test.ts`. | ChatGPT changes the approval card DOM or the Stop selector. |
| PR #806 (context JSON stalls ChatGPT Markdown parsing) | adopt | Backticks inside the context JSON can trigger catastrophic regex backtracking in the page's link parser; the fork had no escaping (`prompt.ts:150-151`). Backticks are now escaped as `\u0060` and record weight is measured on the escaped output. Files: `prompt.ts`, `tests/prompt-contract.test.ts`. | Token or sha budgets drift on code-heavy contexts. |
| PR #801 (false composer mismatch from decorated URL icons) | adopt | The composer read-back removed only plugin pills and inline-selection cursor targets (`browser-worker.ts:2832-2845`); ChatGPT inserts SVG icons with inline CSS next to some URLs. The read-back now ignores `svg`, `style` and `script`. Files: `browser-worker.ts`, `tests/composer-insert.test.ts`. | The composer markup changes again. |
| Suspension clock made monotonic, plus handoff deadline (upstream 6.1.13 and 6.1.4) | adopt | `ChatGptSuspensionClock` mixed `Date.now()` ticks with `performance.now()` budgets and did not tick before `suspendedMs()` (`browser-worker.ts:1012-1041`, `:2170`); the 5-minute compaction handoff timer ignored suspended time (`index.ts:900-924`); it now refunds slept time and still expires after awake inactivity. Files: `browser-worker.ts`, `index.ts`, `tests/browser-worker-contract.test.ts`. | Sleep/wake still produces early stage or handoff timeouts. |
| PR #881 (keep automatic tool approval across launcher upgrades) | adopt | `upgradeManagedRuntime` omitted `--auto-approve-tool-calls` while the other setup paths passed it (`launcher/electron/runtime.cjs:1150-1163`); setup already carries the saved config over, so this aligns the upgrade path and makes the preference explicit rather than relying on carry-over. Files: `launcher/electron/runtime.cjs`, `launcher/tests/runtime-host.test.cjs`. | — |
| `redactExportText` path masking (upstream 6.1.7) | adopt | Measured on the fork: `c:/users/alice/AppData/x` and `\\wsl.localhost\Ubuntu\home\alice\p` were exported unchanged, because the rules required a drive letter and were case-sensitive (`launcher/electron/logging.cjs:33-34`). Files: `logging.cjs`, `launcher/tests/logging.test.cjs`. | — |
| PR #897 (launcher settings with a UTF-8 BOM), open upstream | adopt | `state.cjs:34` and `window-state.cjs:61` parsed JSON directly, so a BOM-prefixed file fell back to defaults; core `src/config.ts:215` already strips the BOM. Fork-local `json-file.cjs`, not dependent on the PR merging. Files: `launcher/electron/json-file.cjs`, `state.cjs`, `window-state.cjs`, `launcher/tests/utf8-bom-compatibility.test.cjs`. | Upstream merges a different shape and the two should converge. |
| PR #898 (avoid a duplicate launcher typecheck in verify), open upstream | adopt | `scripts/verify.ts:26` ran `launcher:typecheck` and `:28` ran `launcher:build`, whose script typechecks again. Files: `scripts/verify.ts`, `tests/verify-script.test.ts`. | — |

### Evaluated and not adopted

Most 6.x items have no fork counterpart: the fork has no `gpt-6`, `midnight`, `human-source`, `model_catalog_failed` or `acknowledgedStages` code, and its launcher already ships Electron 44.9.1.

#### Pull requests

| Item | Decision | Reason | Reconsider when |
| --- | --- | --- | --- |
| #909 (client-side upload quota notice), open | defer | Built entirely on the #807 attachment observer, which the fork does not have. | #807 is taken up. |
| #807 (wait for attachment processing before submit) | defer | 128-line CDP observer tied to a private ChatGPT endpoint; the fork attaches images only and fails slowly, not silently (`browser-worker.ts:3640-3649`). | Repeated "not ready to send" after image upload, or the fork supports file attachments again. |
| #905 (stop owned children when ownership writes fail), open; #900 (same, closed, superseded by #905) | defer | 9 files, +915 lines mixing supervisor, installer and dependency changes; `tryWriteState` (`runtime-supervisor.cjs:433`) already covers part of it. | #905 merges with green CI, or leftover launcher children are observed. |
| #899 (separate Codex startup and cancellation deadlines), open | reject | `smoke:cancel` is not part of verify or CI and defaults to a macOS app path. | `smoke:cancel` joins CI. |
| #896 (native task context across repeated compaction), open | monitor | Builds on #837 `source`/`sourceWasDelegation`, which the fork lacks; not merged. | It merges; reassess with track E below. |
| #892 (native child compaction without a human alias) | defer | The fork fails earlier with `ChatGPT web requires a current-turn user message` (`environment.ts:191-213`); the default subagent protocol is Compatibility V1. | `subagentProtocol=native` is used. |
| #889 (preserve desktop delegation roles) | defer | `parser.ts:553-563` lacks the branch, but a delegation turn dies earlier (see #837); a lone parser branch has no user-visible effect. | Decided together with #837. |
| #884 (validate midnight deltas after native compaction) | defer | Report recommends port inside the midnight track; fork `environment.ts:266-279` rejects two environment claims. Depends on the calendar-delta parser the fork lacks. | Compaction track below is taken up. |
| #842 (accept worker inventories in calendar updates) | defer | Report recommends port with the midnight track; the fork has no calendar delta at all (`thread-environment.ts:157` throws). | Same as #884. |
| #837 (native task identity through compaction) | defer | Part (c), excluding a lone `agents_md.instructions` refresh, is a recommended port (`compaction.ts:134-142`, `environment.ts:135-141`); parts (a) and (b) need delegation support the fork lacks. | Compaction track below is taken up. |
| #830 (trusted cwd across native Page context), closed | reject | Superseded by the maintainer's own 6.1.9 change; the approach is a recommended port in the compaction track (fork scanners at `environment.ts:291`, `:444` only skip `developer`). | Compaction track below is taken up. |
| #845 (Codex 0.163 rollout root conflict), closed | reject | Maintainer fix is more complete; the rollout-root part is a recommended port (`codex-rollout-environment.ts:369-370`, `:464-467`). The long-prompt matching part was rejected upstream. | Compaction track below is taken up. |
| #852 (trusted `CODEX_HOME` list), closed | reject | The maintainer shipped a different implementation in 6.1.11. The fork does not throw `missing network access` (`environment.ts:681-682`) and uses a single home. | Two real `CODEX_HOME` values are used. |
| #856 (permanent chat binding per Codex thread), closed | reject | Maintainer rejected it as too broad; conflicts with the fork's rolling checkpoint model. | — |
| #770 (reuse retained Luna chats), closed | reject | Replaced upstream by Bigger Context, which the fork already has; the PR's matrix never reached main. | — |
| #890 (Electron 42.11.3), merged; #882 (Vite 6.4.4), closed | already in fork | Fork has Electron 44.9.1 and `vite@6.4.4` (`launcher/package.json`, `launcher/bun.lock:709`); `bun audit` is clean. | A new Electron or Vite advisory appears. |
| #879 (macOS signing in PR verification), merged | reject | macOS only; fork CI is `windows-latest`. | — |
| #840 (shared stdio handshake), closed | defer | The `MCP_STDIO_SEND_INITIALIZED_NOTIFICATION` option does not exist in the pinned tunnel-client 0.0.12 (`src/tunnel.ts:9`); adding the env alone is a no-op. | The tunnel-client pin is upgraded to 0.0.13 or later. |
| #828 (Turkish launcher), #831 (Brazilian Portuguese launcher) | reject | Maintainer declined more languages; the fork ships `en`, `zh-CN`, `ja` only and has no `languages.json`. | A specific language is requested explicitly. |
| #810, #780 (troubleshooting docs) | reject | #810 depends on Bigger Context guidance the maintainer expects to age; #780 recommends third-party account switchers. | — |
| #829 (restore the Codex route before launcher quit) | reject | Maintainer declined: already-open Codex sessions keep the loopback endpoint; explicit disconnect is the supported path. | Maintainer changes position. |
| #785 (keep a user-disconnected route disconnected across restarts), closed | reject | The PR's diff removes startup recovery after a failed start; the maintainer's 6.1.7 journal approach is the one to port (see the recommended section). | — |
| #824 (broker state in MCP timeout diagnostics) | monitor | Diagnostics only (`mcp-server.ts:572-587`); the maintainer's final form depends on broker work outside this baseline. | An unreadable `codex_tool_timeout` occurs. |
| #823 (distinguish platform refusals from Codex authorization), #877 (staged JSON through renderer escapes), #880 (comparison survey skip) | reject | The maintainer declined or asked for raw DOM evidence; #806 already covers the main part of #877. | Raw failing DOM is supplied. |
| #802, #803 (assistant answers under a nested role) | reject | The author closed #803 conceding the structure was inferred; the fork has no `data-conversation-role` path. | Archived DOM evidence appears upstream. |
| #799 (Japanese stop button) | defer | Conditional port (selector additions); only effective if the new composer markup is present (probe below). Fork selector is `chatgpt-session.ts:23`. | The probe shows the new UI, or a long Pro turn is judged incomplete near 75 s. |
| #786 (Japanese comma in model announcements), #778 (fixed High route), #781 (defer offscreen history layout) | reject | The fork lacks the announcement parser and model families; the maintainer rejected #778 and #781 (no real-workload measurement). | Model-family verification from 6.x is adopted. |
| #782 (Native2 tool discovery with exec headers) | defer | Report recommends port (random marker per inventory; fork parses the whole block at `mcp-server.ts:262-295`); not taken in this pass. | Next browser/MCP pass. |
| #773 (retry failed primary login navigation) | defer | Report lists it in the second batch, decided after the DOM probe (`browser-host.cjs:1051-1068`). | Probe result below. |
| #764 (recover stalled Send acknowledgements) | defer | Report recommends port (Enter and acceptance observed in parallel, send budget 20 s in `browser-worker.ts:998`); medium risk on submission semantics, needs its own review. | Next browser pass. |
| #753 (KaTeX to a single LaTeX source) | defer | Report recommends port; needs an explicit `@mixmark-io/domino` dependency, which must go through the dependency gate. | Next browser pass with a dependency decision. |
| #769, #788 (file preview cards that mutate after streaming) | defer | Depends on new-UI DOM attributes and 6.x buffer changes; the fork has no reproducible premise. | `ChatGPT changed a completed text block` is seen with file previews. |
| #771 (auto-approve current tool requests) | defer | Conditional port; new approval card DOM cannot be confirmed offline. | Auto-approve waits until the 90 s tool timeout, or the probe shows the new UI. |
| #766 (Think when `/think` clears the connector pill) | already in fork | The fork clicks the Think button directly (`browser-worker.ts:1276-1292`); residual risk is non-English UI labels. | Think errors on Free or Luna accounts. |
| #772 (ChatGPT Latest model routes), #876 (Browser Smoke on sliderless pickers) | defer | Belong to the GPT-6 model-family line; the fork has only `gpt-5.6-sol` and `gpt-5.6-luna` (`chatgpt-web-models.ts:2-3`). | 6.x adoption plan. |
| #755 (long-session admission and launcher responsiveness, 86 files) | defer | The core was re-done upstream as smaller changes tied to the 6.x broker. | — |
| #765 (bound native polling before MCP timeout) | reject | The author closed it as opened against the wrong repo. | — |

#### Issues and never-allocated numbers

| Item | Decision | Reason | Reconsider when |
| --- | --- | --- | --- |
| #756, #779, #796, #798, #839, #846, #862, #878, #887, #901, #903, #907, #908 | reject | 404 from `gh api`; never allocated, nothing to review. | — |
| #904 (`codex_write_stdin` `yield_time_ms` up to 300 s vs the 90 s MCP deadline), open | adopt (2026-10-25, maintainer-approved) | Defect confirmed in the fork (`mcp-server.ts:670` `.max(300_000)`, `:44` 90 s). `yield_time_ms` is now capped at 80 s (`CHATGPT_WEB_WRITE_STDIN_MAX_YIELD_MS`). This changes the `tools/list` contract and the pinned connector ABI hash, so the ChatGPT connector must be refreshed after release. | Upstream ships a different bound. |
| #827 (repeated approval prompts and reported safety blocks) | defer | Maintainer later attributed it to 90 s command timeouts; same root family as #904. | With #904 (now adopted). |
| #870 (`EACCES uv_spawn` on the staged tunnel-client exe), open | monitor | The fork has the same code path (`src/tunnel.ts:122-132`), but the root cause is unconfirmed upstream and there is a single report. | A second independent Windows report, or an upstream root cause. |
| #895 (Web models missing in Codex, `502 ConnectionRefused`), open | monitor | Same family as #452, already deferred; no reproduction details. | Upstream root cause, or a local report. |
| #865 (response DOM disappeared during an active turn), open | monitor | Same error text exists at `browser-worker.ts:1445`; upstream does not know the cause either (alert text not logged). | Upstream discloses the alert text or cause. |
| #906 (App setup rate limited), #893 (setup step 3 fails), #873 (retracted report) | reject | #906 is an external account limit; #893 has contradictory, non-reproducible details; #873 was withdrawn. | — |
| #902 (Think button timeout on a Free account), open | defer | One report without diagnostics; the fork already uses the Think button (`browser-worker.ts:1270-1304`). | A Windows Free account reproduces the fork's Think error. |
| #872, #871, #869, #867, #776 | reject | #872 is `not-planned` and a synthetic build; #871 is the model omitting `turn_token` (same family as #834); #869 is `not-planned` and tied to 6.1.x rekeying; #867 and #776 are false positives from a 6.x consistency check the fork lacks. | A live reproduction with logs. |
| #868 (neutralize link lexemes in multipart JSON) | defer | Relates to the 6.x multipart design; #806 is the part that applies here. | The fork adopts 6.x multipart. |
| #849 (compaction continuation `workspace_roots` conflict), closed | already in fork | The fork tolerates an undefined `workspace_roots` (`codex-rollout-environment.ts:464-467`); not tested against the newest Codex. Rollout-root reconciliation is in the compaction track. | The newest Codex shows the same message. |
| #847 (compaction rejected after Codex stops writing `workspace_roots`), closed | defer | Part of the rollout-reconciliation track (the fork's four full-access cases fail the upstream test). | Compaction track below. |
| #850 (Kaspersky false positive), #843 (read-only MCP call rejected), #841 (Windows tutorial request), #763 (MCP Connect step order), #761, #759, #758, #749 | reject | Release-signing or support issues, no logs, or user error; #749 is expected behaviour (`not-planned`). | Logs or a code-level cause appear. |
| #825, #791, #790 | reject | 6.x-only code paths (offscreen effort control, GPT-6 stream events, Steering environment message); the fork has none of them. | 6.x adoption plan. |
| #822 (Think button `locator.waitFor` timeout), closed | already in fork | The fork already uses the Think button (`browser-worker.ts:1270-1304`). | — |
| #777 (message too long), closed | defer | 6.1.5 changed the 6.x splitting algorithm; the fork rejects oversize messages up front (`browser-worker.ts:905-920`). | A fork user reports "too long". |
| #762 (final submission fails with "2 new conversation turns"), closed | defer | The fork has the same structure (`browser-worker.ts:1309-1317`), but the upstream fix is coupled to the 6.x multipart state machine and no fork reproduction exists. | A fork user sees "N new conversation turns". |
| #757 (power loss leaves environment state unusable), closed | defer | `index.ts:847` has no rebuild path; rare, and the upstream change is tied to 6.x. | A fork user is blocked by corrupt state. |
| #751 (sustained CPU on Windows), closed | defer | Needs measurement; unknown whether the fork's `input-tokens.ts` has the same duplicate counting. | A fork report of high CPU. |
| #857 (Temporary Chat reconnect timeout), closed, released | monitor | The cause is an external ChatGPT change; the upstream fix moved to saved chats, a 6.x design. | The fork's Temporary Chat path fails in practice. |
| #864, #836, #793, #811, #833, #874, #838, #783, #784, #789, #814, #853, #767 | reject | No single portable fix, 6.x or GPT-6 specific, Linux or macOS specific, or `not-planned` (#838, #814, #853); #874 and #838 are macOS reports and the fork pre-checks length at `browser-worker.ts:905-920`. | — |
| #860 (manage Codex-created saved chats), #851 (rollout recovery for a separate `CODEX_HOME`), #832 (suggested-followup labels leak), #888 (cross-chat task becomes an unnamed tool result), #854 (launcher helper takeover duplicates a turn) | defer | Feature request or fixes tied to code the fork does not have; #851 matters only if a second `CODEX_HOME` is used; #888 is the same delegation gap as #889. | The matching fork symptom is reported. |
| #894 (no `<cwd>` with several workspace roots), open | monitor | The fork silently takes the first root as cwd (`environment.ts:601-614`); upstream's fix is not yet on main. A fork-side disambiguation via the `workspaces` metadata key is a possible small fix. | Upstream publishes its fix. |
| #861, #826, #821, #812 (missing cwd around compaction) | defer | Midnight and compaction-environment recovery belong to the compaction track; the fork throws at `thread-environment.ts:157`. | Compaction track below. |
| #883 (rebuilt compaction environment followed by a midnight delta), #891 (native child compaction without a human alias) | defer | Same tracks as #884 and #892; the fork lacks the prerequisites. | Compaction track below. |
| #863 (compaction loop with no summary), open | monitor | The `control_` to `turn_` token fix does not apply (`mcp-server.ts:36`); the symptom is only noted as a counterpart to #856. | The loop reproduces on the fork. |
| #886, #885, #875, #855, #866, #844, #859, #835, #834, #813, #809, #808, #805, #804, #795, #794, #792, #787, #774, #768, #819, #818, #816, #815, #820, #817, #800, #797, #775, #760, #752, #754, #848 | reject | macOS or Linux reports (the fork is Windows-only) about 6.x paths: Bigger Context folding, compaction loops, GPT-6 pickers, long-reply watchdogs, updater, model catalog. #815 (fences lost) and #794 (aborted `/v1/models` logged as 502) are platform-neutral but have no Windows report. | A Windows report, or the fork has the same behaviour. |

### Recommended next, needs maintainer decision

- **#904, `codex_write_stdin` upper bound.** `yield_time_ms` allows 300000 but a 90 s MCP deadline retires the binding (`mcp-server.ts:670`, `:44`). The fix (clamp below the deadline, for example 80000) changes the `tools/list` contract and the ABI hash and requires a connector refresh. The maintainer approved it on 2026-10-25 and it is adopted in a follow-up commit; the connector refresh after release is the maintainer's step.
- **#785 route recovery.** The simplified change (stop reconnecting on launcher start) would stop the route auto-reconnecting after a launcher fail-safe rollback. The version to port is the 6.1.7 journal approach (`reconnectOnStartup`, `route recover`, `--for-runtime-recovery`, `--preserve-disconnected-route`; around 150 lines across `src/` and `launcher/`).
- **DOM-dependent fixes.** Whether they matter depends on the ChatGPT UI the maintainer's account currently sees. Run the one-time probe in the browser review section 5 (checks `[data-turn-key]`, the old `conversation-turn-*`, `form[data-chatgpt-composer]`, `#prompt-textarea`, and both model slider attributes). New-UI results mean single-point ports are pointless and the 6.x adoption plan should start; old-UI results leave the DOM items (Stop selector, #771, #773) deferred. The probe has not been run.
- **6.x adoption plan.** Deferred as a whole since the earlier decisions; the GPT-6 family, saved chats, multipart staging, tunnel-client pin upgrade (0.0.12 to 0.0.16 or later, which also carries #840), and launcher localization all hang on this decision. The maintainer decided on 2026-10-25 to start the adoption in stages; each stage is gated and pushed separately.
- **Compaction track** (compaction review sections 3 and 4): midnight/calendar-delta recovery (#842, #884, `b3040fc`; fork throws at `thread-environment.ts:157`), the `agents_md.instructions` refresh exclusion and open-page context classification (#837(c), #830), and rollout reconciliation (external writable roots, `workspaceRootsDeclared`, `conflictingAuthorityFields`; #845, #847, #849). Rollout reconciliation touches the authorization boundary and must keep `pathIdentity` with `toNamespacedPath`. Delegation and Native V2 (#837(a)(b), #889, #892, #896) stay deferred unless Native V2 is used.
- **Other report-recommended ports not taken in this pass:** Enter/acceptance parallelism and a larger send budget (#764), Native2 inventory marker (#782), KaTeX (#753), background-tab viewport (`3077638`), page-script timeout and primary-renderer recovery, and launcher diagnostic events.

Advance the reviewed ledger to PR #909 at 1f09c1928292f34d15f28a33aab2f3c831380c9d, non-PR issue #906, and upstream main 0901b9fb1976b4a984c7e9b4082c2868767bbf7c.

## 2026-10-25 6.x adoption, stage A: upstream 6.0 line (`7579422`)

The maintainer authorized adopting upstream 6.x in stages. Stage A is a three-way merge of upstream `7579422` (last commit of the 6.0 line) into this fork, committed as one single-parent commit so upstream history is not imported. The ChatGPT account probe (zh-TW UI, `form[data-chatgpt-composer]` present, fork composer selectors absent) showed the account is already on the new UI, so the browser layer is the priority and the stages run back to back (A, then 6.1.0-6.1.3, then 6.1.4-6.1.13).

| Item | Decision | Reason | Reconsider when |
| --- | --- | --- | --- |
| Merge base | `c648c09` (v5.0.4), not v5.0.6 | The fork only ported parts of 5.0.5/5.0.6, so a v5.0.6 ancestor silently kept stale fork code in clean hunks (image endpoints, `--app-name`, token reserve). `src/` and the launcher runtime were redone against `c648c09`; the remaining auto-merged files were checked against it. | - |
| Fork identity and scope | kept | Windows-only packaging and workflows, Bun 1.4.2, en/zh-CN/ja launcher languages (no ko, zh-TW, ja/zh-CN README), reviewed-release updater, `isChatGptUrl`, `pathIdentity` with `toNamespacedPath` (#376), and every previously ported fix. `README.ko.md` and its assets are not adopted; `fork-contract` asserts they stay absent. | The owner changes the supported platforms. |
| Version | 6.0.0 in `package.json`, `launcher/package.json`, `src/version.ts` | The installer, `REVIEWED_RELEASE_VERSION`, READMEs, and release-contract tests still name 5.0.6; they move together when a release is cut. | A 6.x release is published. |
| `--app-name` | removed from the launcher | Upstream 6.0 removed the flag from the core CLI (the #620 failure mode); the launcher now selects `DEV_CONNECTOR_NAME`/`CURRENT_CONNECTOR_NAME` by profile. | - |
| Symlinked `config.toml` (#352) | adopt in core and launcher | Core already carried upstream's symlink handling; the launcher now matches it (write through the link, keep the link and directory mode). The earlier deferral of #352 is superseded. The restore path needs a host that can create symlinks to be exercised; local tests fall back to a regular file. | A symlink regression is found on a Windows host with Developer Mode. |
| Connector identity | stay `Codex Native2` | Upstream 6.1.13 still uses `Codex Native2`; adopting the upstream contract needs no new identity, and no maintainer-side migration is required because the product is not in daily use. This supersedes the earlier idea of moving to `Codex Native3`. | The fork diverges from the upstream tools/list contract. |
| Deleted tests | accepted | The six-kind retired-handle scrub (`call`/`control`/`handoff`) now follows upstream (turn/request/binding only; native `call_*` ids are preserved); one stripped end-marker hook-comment case follows upstream tolerance; two upstream symlink tests skip when symlinks cannot be created. | - |

## 2026-10-25 6.x adoption, stage B: upstream 6.1.0-6.1.3 (`fa2d2c6`)

Three-way merge of upstream `fa2d2c6` on top of stage A (ancestor `7579422`), committed as a single-parent commit. 6.1.0 is the release that supports the updated ChatGPT UI; the account probe already showed the maintainer's account is on that UI, so this stage restores the browser layer (composer `form[data-chatgpt-composer]`, the `data-codex-intelligence-trigger` and power-slider model picker, `data-turn-key` turns, and the new send/stop selectors). Version is now 6.1.3 in `package.json`, `launcher/package.json`, and `src/version.ts`; the installer pin, `REVIEWED_RELEASE_VERSION`, and the READMEs keep naming 5.0.6 until a release is cut.

| Item | Decision | Reason | Reconsider when |
| --- | --- | --- | --- |
| Browser layer (selectors, model picker, turn identity, send acknowledgement) | adopt | Entirely the 6.1.3 versions; the fork's added in-page selector literal (the #801 composer read-back) now also removes the `app-mention-path` pill. Offline fixtures cannot prove behaviour against the live UI, so an account-bound smoke test is still needed. | The live UI drifts again. |
| `turn-broker.ts` | fork | Keeps the fork's Windows named-pipe handling (no `socket.destroy()` after the response frame, `closeAfterFlush`, `end` event); upstream 6.1.3 re-added the destroy. Upstream's socket-identity unlink guard and response-frame shape validation are kept. | Named-pipe resets reappear on Windows. |
| ABI hash in `tests/chatgpt-web-harness.test.ts` | updated | Verified that the only difference from upstream 6.1.3 is the #904 80 s cap and its description. | - |
| Dropped upstream additions | removed | Tray template icons (macOS), the latest-release installer resolver tests (the fork installer is pinned), and the Linux/macOS packaging tests. `window-state` now fits a partly visible window like upstream, so the fork's old "no usable title bar" case was replaced. | - |
| `personalization-connector-preflight` timeout assertion | loosened | It asserted exactly 5000 ms from `Date.now()` and flaked under load; now `4000 < timeout <= 5000`. | - |
| Skipped tests (24) | accepted | Real-browser fixtures gated by `CHATGPT_DOM_TEST_BROWSER`, plus symlink tests on hosts that cannot create symlinks. | A browser-equipped runner is available. |

## 2026-10-25 6.x adoption, stage C: upstream 6.1.4-6.1.13 (`0901b9f`)

Three-way merge of upstream `0901b9f` (6.1.13) on top of stage B (ancestor `fa2d2c6`), committed as one single-parent commit. With this stage the fork has the whole upstream main as of 2026-10-21; `tools/upstream_baseline.json` already records that revision as reviewed. Version is 6.1.13 in `package.json`, `launcher/package.json`, and `src/version.ts`; the installer pin, `REVIEWED_RELEASE_VERSION`, and the READMEs keep naming 5.0.6 until a release is cut.

| Item | Decision | Reason | Reconsider when |
| --- | --- | --- | --- |
| Earlier single-point ports (orphan-promise catch, #858, #806, #801, `ChatGptSuspensionClock` plus the handoff deadline, retained-connector reselect) | superseded by upstream | Upstream 6.1.4-6.1.13 carries the same fixes, in a stricter form for #858 (unique Allow/Deny, click, waits for the dialog to hide) and with its own handoff timer. The fork duplicates were dropped; only the `export` on the three abort wrappers stays so `tests/turn-abort-orphan.test.ts` keeps testing them. Fork tests whose target was removed were deleted; the #858 behaviour tests were adapted. | - |
| Fork-only code kept | kept | `pathIdentity` with `toNamespacedPath` (#376), the 5 s structural personalization cap, identical-claim de-duplication across input items (narrowed so upstream's same-turn midnight delta still validates), single-pass `decodeXmlText`, the named-pipe handling in `turn-broker.ts`, `bridge.ts` error truncation, and the #904 `yield_time_ms` cap of 80 s (upstream still allows 300 s). | Upstream fixes the same defects. |
| ABI hash | updated | The only difference from upstream 6.1.13 is the #904 cap and its description (verified by temporarily reverting those two lines). | - |
| Saved chats, composer predictions, attachment upload, tunnel proxy support, `browser-page-script`, `turn-activity`, `skills/pro-researcher` | adopt | Part of 6.1.x and platform neutral. The README documents the new "Save chats in ChatGPT" and system-proxy behaviour in Traditional Chinese. | - |
| Updater | fork with upstream's `createUpdateDownloader` | The reviewed-release pin and Windows-only asset logic stay; the Electron `net.request` downloader (system proxy, credential-URL rejection, redirect validation, idle timeout) and bounded retry are absorbed. | - |
| Electron | stay on 44.9.1 | Newer than upstream's 42.11.3 and already covers its origin-check advisory. | Electron 45 is verified with a packaged run. |
| Dependencies | adopt with fork pins | `@mixmark-io/domino` 2.2.0, `@modelcontextprotocol/sdk` ^1.31.0, and override pins for `ip-address` (10.7.4, raised from upstream's vulnerable 10.7.1), `proxy-addr`, `global-agent`, `http-cache-semantics`, `source-map-js`. `@hono/node-server` 2.1.3 and `hono` 4.13.12 follow upstream 6.1.4 (raised from the fork's 2.1.1 and 4.13.11). | The next audit. |
| Not adopted | reject | macOS/Linux packaging and updater code, ko and zh-TW launcher copy, non-Windows README downloads. | The owner changes the supported platforms. |

## 2026-10-25 addendum: issue #910, numbers #907-#908

Read-only re-check after stage C; upstream `main` is still `0901b9fb1976b4a984c7e9b4082c2868767bbf7c` and the latest PR is still #909 at `1f09c1928292f34d15f28a33aab2f3c831380c9d`. Numbers #907 and #908 are not retrievable through the API (absent or removed).

| Item | Decision | Reason | Reconsider when |
| --- | --- | --- | --- |
| Issue #910 (v6.1.13 aborts a completed ChatGPT response about 79 s after send despite `stallTimeoutSec`), open | monitor | Reported on macOS arm64 with the Plus tier; the fork now ships the same 6.1.13 response-tracking code, so a Windows reproduction is plausible but none is reported. | A Windows reproduction, or upstream identifies a platform-neutral cause. |

Advance the reviewed ledger to non-PR issue #910.

## 2026-10-25 addendum: issue #911

Read-only re-check; upstream `main` is still `0901b9fb1976b4a984c7e9b4082c2868767bbf7c`, latest PR still #909.

| Item | Decision | Reason | Reconsider when |
| --- | --- | --- | --- |
| Issue #911 (v6.1.13 rejects a valid GPT-6 High selection in the Simplified Chinese picker because the announcement says `高`), open | adopt (own fix) | Reproduced by reading the code: `chatGptModelFamilyMatches` compared the announced mode with English words only, and upstream has the same code. The fork now also accepts the labels seen in the report (`即时`, `中`, `高`; the Traditional form `即時` was not observed, so it is not accepted); the slider position is still checked separately, and unknown translations stay rejected. Extra High and Pro labels were not observed in the report and are not guessed. | Upstream lands its own fix (compare, then drop the local list), or an Extra High / Pro label is observed. |

Advance the reviewed ledger to non-PR issue #911.

## 2026-10-29 upstream review: 6.1.14-6.1.17, #912-#934

This is a reviewed-history update, not a source merge or release adoption. The read-only
[comparison](https://github.com/miuuyy/codex-chatgpt-web/compare/0901b9fb1976b4a984c7e9b4082c2868767bbf7c...860fa576eb47d9e20d7d8289235bfea94392d2fd)
contains 38 commits: the first pass stopped at `b618281` (36 commits), and upstream then added
`760ab5a` and `860fa57` before this ledger was promoted, so the review was extended to them.
Release notes for [v6.1.14](https://github.com/miuuyy/codex-chatgpt-web/releases/tag/v6.1.14)
(2026-10-26), [v6.1.15](https://github.com/miuuyy/codex-chatgpt-web/releases/tag/v6.1.15),
[v6.1.16](https://github.com/miuuyy/codex-chatgpt-web/releases/tag/v6.1.16) and
[v6.1.17](https://github.com/miuuyy/codex-chatgpt-web/releases/tag/v6.1.17) (the last three
all 2026-10-29) were read alongside the code and test delta. Release dates do not prove Windows
acceptance.
All product ports below are deferred or rejected, except the rows marked `ported` (`dc29540`, `2f0936b`, `9c3633c`, and 2026-11-07 ports `d3cf95a`, `1a0e893`; see the port sections below); the fork source stays 6.1.13, the public
installer/updater stays 5.0.6, and Bun stays 1.4.2. Follow-up work belongs only in ROADMAP.md.
Earlier decisions are superseded only where explicitly stated below.

### Main commits, including merge-only history

Commit prefixes below uniquely identify commits in the exact comparison above. A deferral is
about local adoption, even where upstream has already merged or released the change.

| Commit | Decision | Reason and reconsideration condition |
| --- | --- | --- |
| `d3cf95a70387` rich JSON rendering (#886) | ported (2026-11-07) | Escapes string lexemes and changes multipart size accounting. Ported to `src/adapters/chatgpt-web/prompt.ts` with round-trip, Unicode delimiter shielding and partition-budget regressions in `tests/prompt-contract.test.ts`. See the 2026-11-07 port section below. |
| `afa35a7bd76c` remove Temporary Chat | reject this intermediate design | Superseded upstream by `7c7c10e`/`ad9a611`; do not remove and then restore a user preference. The final opt-in migration is adopted by the 2026-11-03 decision below. |
| `e6ed93a4006b` cwd-less updates (#894) | defer | Replaces first-root cwd inference with current native rollout authority across environment/store types. Reconsider with reordered-root, missing-rollout and restricted-mode negative regressions. Supersedes the earlier monitor trigger: a fix now exists. |
| `3790e3f46c51` native steering test synchronization | defer | Accompanies native-task restoration; import with that implementation, not as an unrelated test-only change. |
| `794e5769e5e3` accepted native task after compaction | defer | Restores authenticated task messages and attribution in the prompt; needs repeated-compaction, new-steering and forged-source negative tests against this fork. |
| `3b47927089e4` native goal source | defer | Extends checkpoint provenance to synthetic goals; review with `794e576` so older human messages cannot replace the current task. |
| `6140f0b0a6ee` observed Chinese effort labels (#911) | reject duplicate replacement | The fork already accepts exactly the same observed labels (即时/中/高) and rejects unknown labels. Keep the local regression; reconsider parser consolidation with the picker port, without guessing new translations. |
| `53b60503b432` 60 s command polls (#904) | adopt with next installer release | Fork already advertises 80 s for the dedicated tool. Upstream additionally bounds generic/native exec and rejects excessive durations without rewriting them. This changes tools/list and its ABI; adopt with the next installer version after focused transport tests, coordinating one connector refresh with release. The local cap is not claimed equivalent. |
| `7b7f2f807d2e` merge #896 | defer | Same native-task restoration as `794e576`/`3b47927`; merge status satisfies the earlier re-review trigger, not local acceptance. |
| `150787819816` merge main into context branch | reject direct merge | Integration history is not an independent port; component decisions above apply. |
| `ffe041f880f0` delayed finals/token diagnostics | ported | Windows shared-path adoption on 2026-11-03: deterministic delayed-final, bounded inactivity, empty/lost DOM and explicit-failure regressions; numeric-only submitted-context diagnostics use the fork serializer. Not a generic #910 repair. |
| `a738f0485c6a` MCP setup/catalog separation (#893/#895) | ported (2026-11-03); see decision below | Separates core installation readiness from catalog health. Adopt with failed catalog, healthy proxy and incomplete-installation regressions; a catalog error remains visible. |
| `988f45a15201` dependencies/Electron preparation | defer remaining dependency removal; reject pin replacement | Fork locks already contain body-parser 2.4.0, fast-uri 3.1.9, ip-address 10.7.4, qs 6.16.2, Zod 4.6.7 and Undici 7.30.1/6.29.1. Keep Electron 44.9.1 rather than upstream 42.11.16 and Bun 1.4.2 rather than 1.4.0. Bootstrap already prepares Electron; verify already avoids duplicate renderer typecheck. Removing chromium-bidi is a separate unused-dependency assessment, not a forced major upgrade. |
| `467dea6b99d7` merge main into context branch | reject direct merge | Integration history; retain per-component decisions and both fork lockfiles. |
| `cfeaf04bc7f5` release 6.1.14 | defer source/release adoption | Includes removed Temporary Chat, authority and MCP contract changes above. Never move the fork installer from release notes alone. |
| `b48477ea8ada` Full Access worktrees | defer | Uses runtime_workspace_roots and permits authenticated Full Access cwd outside retained roots. Changes authorization boundaries in rollout, store and broker; retain namespace path normalization and prove restricted modes still reject out-of-root cwd. |
| `dc29540a0f99` current Think sprite (#902) | ported (2026-11-02) | Upstream captured the renamed `#codex-icon-brain-regular-20` sprite in English and zh-TW; the fork's `CHATGPT_THINK_BUTTON_SELECTOR` now lists it beside the older `#brain-regular-20` fragment. It is the prerequisite of `9c3633c`: without it a Luna account with the new sprite would fail `chatgpt_model_controls_unavailable`. Fixture `tests/fixtures/chatgpt-composer-think-2026-10-28.html` and a red-then-green selector test were added; no signed-in Windows verification in this task. See the port section below. |
| `7e6e1a0bfae4` Doctor compaction override (#919) | ported (2026-11-02) | Read-only global/default-profile TOML inspection ported to `src/doctor-compaction.ts` and `src/doctor.ts` with no-override, safe override, window-ceiling warning, default profile, BOM/syntax handling, and no-mutation regressions in `tests/doctor-compaction.test.ts`. See the 2026-11-02 port section below. |
| `7c7c10edee41` restore Temporary Chat (#918) | ported with inverse legacy migration (2026-11-03); see decision below | Renames useSavedChats to useTemporaryChats across CLI, IPC, settings and worker. Preserve old preferences by inverse migration with explicit-opt-out, connector-unavailable and Zero Risk regressions; account acceptance remains separately opt-in. |
| `ad9a6114a598` default Temporary Chat on | reject default-on | Keep the saved-chat default for new installs and preserve existing behavior, including the implicit Temporary Chat of v5.0.6 configurations; do not silently change a privacy-related default. |
| `d80bf0d49cef` BOM settings/verification | reject | Rejected port. The fork already has equivalent and cleaner BOM-tolerant JSON parsing in `launcher/electron/json-file.cjs` (committed on 2026-10-25 via `ee3b8f8`), verified by `launcher/tests/utf8-bom-compatibility.test.cjs`. Fork `scripts/verify.ts` also already uses `build:renderer`. |
| `d3734f1f378c` cancellation measurement | defer | Changes live smoke timing to start at provider terminal. Not needed for this read-only maintenance task; reassess when cancellation acceptance is explicitly run. |
| `0a8f233f88d3` owned runtime persistence failure (#905) | ported (2026-11-02) | Ported bounded recovery tasks, safe child termination and unsafe start guards to `launcher/electron/runtime-supervisor.cjs`, covered in `launcher/tests/runtime-supervisor.test.cjs` by three parameterized unsafe-cleanup cases (active-turn, unverified-pid, shutdown-error), one cleanup-wait case, and a real-child integration case that forces a filesystem write failure, confirms child exit and blocks starts until persistence recovers. See the 2026-11-02 port section below. |
| `89f0ead030f1` exact explicit model picker (#921) | ported (2026-11-02) | Ported exact Sol/Astra matching, 6 slider positions and Astra Max verification while retaining local #911 Simplified Chinese effort labels. Verified with `tests/chatgpt-model-selection.test.ts` and `tests/chatgpt-model-family-browser.test.ts`. See the 2026-11-02 port section below. |
| `b6043e022eaf` rendered identity/stream diagnostics (#914) | ported (2026-11-02) | Ported DOM BR boundary normalization, hidden/duplicate identity rejection and `src/adapters/chatgpt-web/stream-diagnostics.ts` lifecycle observers without adopting #914 draft reload recovery. Verified by `tests/stream-diagnostics.test.ts` and `tests/browser-turn-binding.test.ts`. See the 2026-11-02 port section below. |
| `0286265634a4` native session reminder layer | defer | Adds native view, restricted preload and renderer entry. Requires Windows browser focus, layering, resize and dismissal checks; offline build alone is insufficient. |
| `87449745382b` merge #921 | reject duplicate | Same exact-picker candidate as `89f0ead`; already ported via `89f0ead` with no additional independent implementation. |
| `b95b38a0f45b` merge main into worktree branch | reject direct merge | Integration history; authority and UI components require their own acceptance. |
| `30e7ad9deb73` isolate ChatGPT UI contracts | reject structural churn | Re-extracting shared selectors to a separate `chatgpt-ui` module carries high regression risk against local Chinese labels (#911) with no Windows behavioral benefit. The fork already maintains model picker and inline reasoning controls in `src/chatgpt-session.ts`. |
| `8a75f1ba3916` release 6.1.15 | defer source/release adoption | Includes exact picker, Temporary Chat default, native reminder and Full Access changes; preserve fork source/release separation. |
| `2f0936b6360b` inline model control (#924/#927/#928) | ported (2026-10-31) | Narrow observed reasoning selector added with retained variants and unrelated-button negatives; exact model/effort verification before Send is unchanged. No fallback or guessed selector. See the port section below. |
| `f9325c967be3` multipart compaction ceiling (#930) | ported | Windows shared-path adoption on 2026-11-03: exact exclusive boundary, account/family/effort/part-count limits, checkpoint/final instruction, atomic records, rebuilt attachments and ordinary-request-no-trim regressions. |
| `e1780b1c1b87` delivery/staging retry guards (#929) | ported | Windows shared-path adoption on 2026-11-03: bound visible alert and exact staging ACK fixtures; pending/duplicate results block retry, completed/late canonical results permit continuation without replay, with the existing retry cap. |
| `1a0e8934e608` connector navigation diagnostics (#925) | ported (2026-11-07) | Wrapped `refreshChatGptHomeDocument` in `try` block in `launcher/electron/browser-host.cjs` so pre-helper navigation aborts record `connector.verification_failed` in diagnostics and clean up `manualOperation`. Verified by red-then-green test in `launcher/tests/browser-host.test.cjs`. See the 2026-11-07 port section below. |
| `9c3633c6e260` positive Luna evidence (#932) | ported (2026-10-31, with `dc29540` prerequisite 2026-11-02) | Missing paid controls must not overwrite the catalog with Luna-only. Ported together with the inline picker selector and the #902 Think sprite; model reinstall remains an account-bound step. See the port section below. |
| `b6182818bb14` release 6.1.16 | defer source/release adoption | Important Windows model-control fix, but source incorporation and account/package acceptance remain separate work. Do not raise package versions or the 5.0.6 installer pin in a review-only update. |
| `760ab5a8ad87` preserve added Full Access workspaces after compaction (#933) | defer port | Keeps the rollout's declared roots and adds the current claim's extra roots (Codex's per-thread visualization/output folder), only when rollout and claim are both Full Access, cwd matches and every declared native root is already in the claim; cwd, permissions and task identity still come from the exact rollout. The patch sits on top of the 6.1.14 authority changes (`e6ed93a`, `b48477e`) that the fork has deferred, and the fork's `thread-environment.ts` is still the 6.1.13 shape, so it is not a standalone cherry-pick. Reconsider it together with those two commits: import its `tests/environment.test.ts` cases (declared session/turn roots plus an added output root) and add Windows drive-letter/namespace path-identity cases, a restricted-mode negative (an extra root must still be rejected) and dropped/replaced/foreign-root negatives. Whether the fork's 6.1.13 code shows the same `workspace_roots, writable_roots` conflict was not reproduced in this review; a fresh Windows report of that conflict on the fork moves this to high priority. |
| `860fa576eb47` release 6.1.17 | defer source/release adoption | The commit changes only version strings (four READMEs, two package manifests, `scripts/install.sh`, `src/version.ts`); the comparison file list shows the only other changes are `760ab5a` and its test. The notes add one fix (#933) and restate Electron 42.11.16 and Bun 1.4.0, which the fork deliberately keeps at 44.9.1 and 1.4.2 (see `988f45a`). Do not raise package versions or the 5.0.6 installer pin in a review-only update. |

### New pull requests

The seven heads were read from the newest-PR inventory's first 30 results; its last
number is below the previous #909 waterline, so the new range is complete. Exact heads are
recorded because closed, merged and draft are different states, not acceptance verdicts.

| PR | Observed state / head | Decision | Reason and reconsideration condition |
| --- | --- | --- | --- |
| [#914](https://github.com/miuuyy/codex-chatgpt-web/pull/914) | open draft; `71a8def2be770cda978461b627de605ab3cfef2c` | defer | Native goals plus vanished-response reload/expansion recovery; author reports longer-run failures after bounded successes. Only its separately released rendered-marker fix is considered above. Reconsider a stabilized, bounded Windows reproduction and no-resubmit/ownership tests. |
| [#915](https://github.com/miuuyy/codex-chatgpt-web/pull/915) | closed, unmerged draft; `12e9f4d659393bdd89c974bc6ccb5ff8e69dde04` | reject withdrawn implementation | Superseded by #917; archive mutation succeeded but persistence readback remained unreliable. Do not introduce account writes through this review. |
| [#921](https://github.com/miuuyy/codex-chatgpt-web/pull/921) | merged; `89f0ead030f1b7889aa86d30518a0259ee3df5a0` | defer | Reviewed as the exact-model candidate above. Retain strict family/effort verification and the local Chinese-label regression. |
| [#927](https://github.com/miuuyy/codex-chatgpt-web/pull/927) | closed unmerged; `745fbf3b1d6bffcbc9fad3375f65863cf58fef93` | reject direct import | Same observed inline selector is released in `2f0936b`; use the canonical implementation candidate. Reported Windows success is useful evidence, not this fork's acceptance; its Full verify was interrupted. |
| [#928](https://github.com/miuuyy/codex-chatgpt-web/pull/928) | closed unmerged draft; `383ac18c42b55a492ebcffc497db76b4cb0cc633` | reject bundled import | Inline selector is covered by `2f0936b`. The additional empty-new-chat reload is not established as a generic missing-final repair; reassess only a bounded Windows recovery case. |
| [#931](https://github.com/miuuyy/codex-chatgpt-web/pull/931) | closed unmerged; `2cfdd4322e4a07f2f22ce4920f1c4bfe9bed115f` | reject bundle | Canonical #929/#930 fixes are reviewed above. Synthetic native identity and /v1/chat/completions expand the authenticated Codex contract, and Linux flags are outside scope. A new API requires an explicit separate requirement. |
| [#934](https://github.com/miuuyy/codex-chatgpt-web/pull/934) | open draft; `891e7b752f7e78401fdc2d1b0c3334644a44008f` | defer | Native clipboard paste above 32,768 characters changes clipboard ownership, IPC and accepted-turn proof for pasted attachments. Bun suite was not run by the author. Reconsider stable tests proving clipboard restoration and exact acceptance without resubmission on Windows. |

### New non-PR issues and unavailable numbers

The newest-first issues endpoint returned 100 items and crossed below #911; filtering out
pull_request records leaves the complete 14 new non-PR issues below. API 404 is recorded as
absent or removed, not proof that a number was never allocated. Reporter diagnostics were not
downloaded; issue bodies, public release notes and source/test patches were sufficient for deferral.

| Issue | Observed state | Decision | Reason and reconsideration condition |
| --- | --- | --- | --- |
| [#912](https://github.com/miuuyy/codex-chatgpt-web/issues/912) normal chats | closed, not-planned; Windows | defer preference redesign | Review final #918 migration, not the removed 6.1.14 intermediate design; verify existing explicit settings before changing defaults. |
| [#913](https://github.com/miuuyy/codex-chatgpt-web/issues/913) context/OpenCode hardening | open; macOS, needs logs | defer | Measurements and local patches do not establish this fork's Windows/OpenCode contract. #904 and #930 have separate bounded candidates; do not infer one shared cause. |
| #916 | API 404 | reject as actionable item | Absent or removed at review time; reconsider if retrievable. |
| [#917](https://github.com/miuuyy/codex-chatgpt-web/issues/917) retired-chat archival | closed, not-planned | reject current proposal | Upstream declined the feature; account mutation and persistence remain unverified. Reconsider only a separately requested feature with explicit account acceptance. |
| [#918](https://github.com/miuuyy/codex-chatgpt-web/issues/918) Temporary Chat | closed, released; Windows | defer | Free/Luna report establishes a Windows candidate, not Bigger Context/compaction support. Follow the migration decision above. |
| [#919](https://github.com/miuuyy/codex-chatgpt-web/issues/919) compaction override | closed, released; Windows | defer | Bounded read-only Doctor candidate in `7e6e1a0`; require profile and no-write tests. |
| #920 | API 404 | reject as actionable item | Absent or removed at review time; reconsider if retrievable. |
| [#922](https://github.com/miuuyy/codex-chatgpt-web/issues/922) UI/quota question | closed | defer documentation assessment | No confirmed shared-quota bug. Upstream removed a blanket no-Work/Codex-quota promise; evaluate any matching fork wording in both README languages without claiming account billing evidence. |
| [#923](https://github.com/miuuyy/codex-chatgpt-web/issues/923) Astra effort menu | closed, released; macOS | ported via `89f0ead` (2026-11-02) | Linked portable fix is exact-picker #921, ported with Sol/Astra matching and Astra Max verification; strict selection already failed closed. Closed on the fork; model reinstall remains an account-bound step. |
| [#924](https://github.com/miuuyy/codex-chatgpt-web/issues/924) inline picker | closed, released; macOS | ported via `2f0936b` (2026-10-31) | Independent Windows evidence exists in #927; inspect and test `2f0936b` against fork callers rather than guessing menu labels. |
| [#925](https://github.com/miuuyy/codex-chatgpt-web/issues/925) connector navigation/turn identity | closed, partial release; macOS | navigation diagnostic ported via `1a0e893` (2026-11-07); turn_id / undetected-response part deferred | Navigation diagnostic is ported (see the 2026-11-07 port section). The unresolved turn_id report stays deferred pending fresh Windows evidence before relaxing identity checks. A comment added after the first pass (2026-10-29T15:33Z, v6.1.16, macOS) reports a turn accepted by ChatGPT whose assistant response the bridge did not detect in the DOM; it has no Windows evidence and stays a separate, unreproduced item. |
| [#926](https://github.com/miuuyy/codex-chatgpt-web/issues/926) Luna-only Plus | closed, released; Linux | ported via `9c3633c` (2026-10-31) with `dc29540` prerequisite (2026-11-02) | Shared paid-capability detection has a confirmed Windows counterpart #932, ported with positive Luna evidence; no Linux packaging is imported. Closed on the fork. |
| [#929](https://github.com/miuuyy/codex-chatgpt-web/issues/929) delivery/ACK/frozen page | open, partial release; macOS | ported bounded retry fix (2026-11-03) | Canonical alert and staging changes differ from reporter's broad retry/near-match proposal. Preserve exact ACK and no-replay guards; generic frozen/missing-final behavior still needs evidence. |
| [#930](https://github.com/miuuyy/codex-chatgpt-web/issues/930) multipart compaction | closed, released; macOS | ported linked portable fix | Shared prompt fix `f9325c9` adopted on 2026-11-03 with checkpoint, ceiling and no ordinary-history trimming regressions; the original issue report remains macOS evidence. |
| [#932](https://github.com/miuuyy/codex-chatgpt-web/issues/932) Luna-only/crash | closed, released; Windows/cross-platform | ported via `9c3633c` + `dc29540` (2026-11-02) | Confirms Windows relevance of inline picker/positive capability detection; requires coordinated model-catalog tests and separate opted-in reinstall validation. |
| [#933](https://github.com/miuuyy/codex-chatgpt-web/issues/933) declared visualization roots | closed, completed 2026-10-29T15:38Z by v6.1.17 (open at the first pass); macOS report, Windows confirmation comment, 6.1.16 | defer port | Fixed upstream by `760ab5a` in v6.1.17, which supersedes the earlier note that 6.1.16 did not fix it. The fix keeps declared native roots and only adds claim roots when both sides are Full Access; restricted tasks keep their native grants. The local port waits with `e6ed93a`/`b48477e`, as in the commit row above. Reconsider when those authority commits are ported, or on a fresh Windows report of the `workspace_roots, writable_roots` conflict; require current/parent thread-only visualization roots, dropped/replaced/foreign-root negatives and Windows namespace regressions first. |

### Four-axis promotion evidence

The first candidate ledger (`main` `b6182818bb14d108a63cfa548b9c6684d82cfacc`) was checked with UPSTREAM_BASELINE_PATH before
replacing the tracked baseline: exit 0, all four axes current. While it was being promoted,
upstream `main` advanced to `860fa576eb47d9e20d7d8289235bfea94392d2fd` (`760ab5a`, `860fa57`) and v6.1.17 was published, so the
same stale candidate then failed strict (exit 1) with the main and branch axes `attention`; the review was extended
and the ledger re-pointed. A second read-only pass re-queried the other axes: the newest PR is
still #934 (head unchanged), the newest non-PR issue is still #933, and the branch inventory is
still `main` only. Items #913, #914, #929 and #934 stayed open, every other reviewed item kept
its state, and #933 moved from open to closed (completed). The reviewed values are:

- main and sole branch `main`: `860fa576eb47d9e20d7d8289235bfea94392d2fd`;
- latest PR #934, head `891e7b752f7e78401fdc2d1b0c3334644a44008f`;
- latest non-PR issue #933; reviewedAt `2026-10-29`.

The canonical gate rechecks these live values; unavailable or newly advanced axes must fail.
Only read-only GitHub API queries and a local `git fetch` of upstream objects (to read the two new
commits) were used. No merge, cherry-pick, Git staging/commit, upstream write, account operation
or release was performed. The tracked fork-contract assertions advance with this reviewed ledger.

## 2026-10-31 port: inline model control (#924/#927/#928) and positive Luna capability evidence (#932)

Ported from the 6.1.14-6.1.17 reviewed delta (see the 2026-10-29 review above), each with a
red-then-green test. Only #924 (`2f0936b`), #932 (`9c3633c`) and their prerequisite #902
(`dc29540`, added 2026-11-02) are ported; everything else from that review stays deferred.

1. **Inline model control (`2f0936b`, #924/#927/#928)**:
   - Added `button[aria-haspopup="menu"][data-composer-navigation-target="reasoning"][data-selected-reasoning-effort]` to `CHATGPT_EFFORT_CONTROL_SELECTOR` in `src/chatgpt-session.ts`.
   - Verified via a structural domino test in `tests/chatgpt-session.test.ts`.
   - Preserves existing selectors, model/effort verification and Windows path isolation.

2. **Positive Luna capability evidence (`9c3633c`, #932)**:
   - Updated `setChatGptThinkMode` in `src/adapters/chatgpt-web/browser-worker.ts` and `waitForChatGptEffortControl` in `src/chatgpt-session.ts` to require positive proof of a verified Think control instead of treating picker absence as Luna.
   - Throws `chatgpt_capabilities_stale` when a paid model control appears after Luna setup.
   - Verified across `tests/browser-worker-contract.test.ts`, `tests/chatgpt-session.test.ts` and `tests/setup-lifecycle.test.ts`; troubleshooting guidance added to `TROUBLESHOOTING.md`.
   - `chatGptThinkButtons` now lives only in `src/chatgpt-session.ts`; the browser worker imports it.

3. **Current Think sprite (`dc29540`, #902), the prerequisite of item 2**:
   - Positive Luna evidence requires recognizing the Think control. Upstream renamed the sprite fragment to `#codex-icon-brain-regular-20` (observed in English and zh-TW); the fork only accepted `#brain-regular-20`, so after item 2 a Luna account with the new sprite would have failed with `chatgpt_model_controls_unavailable`. The new fragment is added to `CHATGPT_THINK_BUTTON_SELECTOR` as a third, exact-match clause; the older fragments stay.
   - The diff was compared with upstream `dc29540`: same selector line, same fixture `tests/fixtures/chatgpt-composer-think-2026-10-28.html`, and the same fixture added to the gated Electron Think test in `tests/browser-generation.test.ts`.
   - Because domino cannot evaluate `:has()`, the red-then-green test in `tests/chatgpt-session.test.ts` pins the property instead (each captured sprite href, English and zh-TW labels, must end with a fragment the selector lists). It was also run against Microsoft Edge through `CHATGPT_DOM_TEST_BROWSER` together with the item below.

4. **Upstream `tests/chatgpt-capabilities-browser.test.ts`**:
   - Ported its second case (a unique recognized Think control proves Luna; unknown or ambiguous controls are rejected; the draft is never touched) as `tests/chatgpt-capabilities-browser.test.ts`, gated by `CHATGPT_DOM_TEST_BROWSER` like the other real-browser tests.
   - Its first case is not ported: it reads `chatgpt-model-picker-power-2026-09-29.html`, a fixture belonging to the UI-contract extraction (`30e7ad9`, rejected above), not the now-ported exact picker (`89f0ead`, #921). The paid inline-control behavior it checks is covered offline in `tests/chatgpt-session.test.ts`. Reconsider the fixture only if upstream introduces a newly observed inline-picker variant requiring DOM regression.

5. **Still deferred or rejected from the 2026-10-29 review**: the table above is the complete
   list; the fourteen rows marked `ported` are `dc29540`, `2f0936b`, `9c3633c`,
   `7e6e1a0`, `0a8f233`, `89f0ead`, `b6043e0`, `ffe041f`, `f9325c9`, `e1780b1`, `7c7c10e`, `a738f04`, `d3cf95a`, and `1a0e893`. The items still open, which [ROADMAP.md](../ROADMAP.md) tracks
   across port and release follow-ups, are: `e6ed93a` (#894), `3790e3f`, `794e576`, `3b47927`, `53b6050`
   (#904, next installer release), `7b7f2f8`, `988f45a` (dependency removal only), `b48477e`,
   `d3734f1`, `0286265`, `760ab5a` (#933), the three release-version commits
   (`cfeaf04`, `8a75f1b`, `b618281`) and `860fa57`; plus the open PR #914 and #934 and the deferred issue
   decisions. Release version bumps stay deferred: the installer pin remains v5.0.6 and the fork package
   remains 6.1.13.

## 2026-11-03 launcher minimatch advisory GHSA-g3hv-75wg-m249

The [GitHub advisory](https://github.com/advisories/GHSA-g3hv-75wg-m249) reports all minimatch
versions below 11.0.1 as affected, with glob preprocessing amplification at optimizationLevel >= 2.
The registry latest electron-builder/app-builder-lib was already the installed 26.18.0;
upgrading the direct dependency cannot remove these paths. The reviewed dependency tree was:

```text
electron-builder -> app-builder-lib -> minimatch 10.2.6
                  -> @electron/universal -> minimatch 9.0.9
                  -> ejs -> jake -> filelist -> minimatch 5.1.9
                  -> @electron/asar -> minimatch 3.1.5
                                   -> glob -> minimatch 3.1.5
                  -> @electron/universal -> dir-compare -> minimatch 3.1.5
```

Use Bun 1.4.2's version-scoped `minimatch@>=5` override to 11.0.4 for the named-export consumers.
The launcher lockfile becomes format 3, generated and frozen-install tested with pinned Bun 1.4.2.
The root lockfile and Electron 44.9.1 remain unchanged. Actual consumer tests cover FileMatcher,
filelist, glob, dir-compare, and ASAR creation/extraction including an unpack pattern.

Do not globally override minimatch: asar 3.4.1 and dir-compare 4.2.0 invoke its default export
as a function, whereas minimatch 11 exports an object. Glob 7 also uses the legacy interface.
The latest asar 4.3.1 still requires minimatch ^10; universal 3.0.6 requires asar ^4,
filelist 2.0.2 still requires ^10, and dir-compare 5.0.0 still requires ^3. A broad tooling migration
would therefore neither remove the advisory nor preserve the reviewed packaging contract by itself.

Accept only the remaining three exact minimatch 3.1.5 lock nodes under
`.github/audit-deferrals.json`, until 2026-11-17 (Asia/Taipei). This is time-bounded risk acceptance,
not a claim that those versions are unaffected. These are local build-time consumers of packaging
patterns; the product has no remote packaging-glob endpoint. Reconsider on compatible parent releases,
advisory/lock changes or the deadline. Windows installer acceptance remains separate.

Extend the existing exact-bound dependency-review convention with a distinct security exception
file: latest-version deferrals do not waive audit findings. Launcher audit always executes raw Bun
audit first, then validates the exact URL/range/severity and all vulnerable lock nodes. Expiry,
new findings, changed nodes and process/parse failures remain fatal. Dependency freshness uses the
same launcher audit script; no audit is disabled or severity-filtered. The checker reads `revisit`
directly, so the deadline does not depend on a roadmap row alone. Evidence: [REVIEW.md](REVIEW.md).

## 2026-11-02 port: independent fixes (7e6e1a0, 0a8f233, 89f0ead, b6043e0)

Ported four independent, non-defer-dependent fixes from the 6.1.14-6.1.17 reviewed delta, preserving
existing models, effort parameters, and Windows path / security boundaries without modifying the
public installer pin. The prior blanket red-then-green claim is withdrawn: DOM tests are gated by
`CHATGPT_DOM_TEST_BROWSER`, and a skipped case is not execution evidence. The correction run executed
these DOM fixtures locally through Microsoft Edge (187 pass / 0 fail across five focused files,
exit 0); no historical DOM red result is claimed. Current correction-run
evidence is recorded in [REVIEW.md](REVIEW.md).

1. **Doctor compaction override (`7e6e1a0`, #919)**:
   - Added read-only inspection of Codex `config.toml` in `src/doctor-compaction.ts` and integrated it into `src/doctor.ts` as `inspectCodexCompaction`.
   - Reads `model_auto_compact_token_limit` after merging the selected default profile over global settings. For a recognized Web model route it checks that route; otherwise it checks all available Web routes. It warns when the override exceeds a route threshold: the minimum of its advertised auto-compaction limit and `model_context_window` (or the route context window when unset). Handles missing config, safe limits, BOM and syntax errors without mutating disk.
   - Verified by `tests/doctor-compaction.test.ts` (offline unit and `runDoctor` integration); documentation added to `TROUBLESHOOTING.md`.

2. **Owned runtime persistence failure handling (`0a8f233`, #905)**:
   - Updated `launcher/electron/runtime-supervisor.cjs` to catch state write failures, track cleanup completion via `stateWriteCleanup`, ensure bounded termination of owned runtime children, and prevent overlapping starts when state writing fails.
   - Covered by three parameterized unsafe-cleanup tests (active-turn, unverified-pid, shutdown-error), one cleanup-wait test, and the real-child filesystem-failure integration segment in `launcher/tests/runtime-supervisor.test.cjs`. The latter confirms `child.exitCode !== null`, rejects a new start while persistence is blocked, and permits restart after restoring the state path. The upstream `/ENOTDIR|EEXIST/` regex passed locally on Windows unchanged.

3. **Exact explicit model picker and Astra Max (`89f0ead`, #921)**:
   - Extended `CHATGPT_EFFORT_SLIDER_MAX_OPTIONS = 6` in `src/chatgpt-session.ts`.
   - Updated `src/adapters/chatgpt-web/limits.ts` and `src/adapters/chatgpt-web/model-selection.ts` to recognize `GPT-6 Sol` and `GPT-6 Astra`, map Astra Max to `gpt-6-pro`, verify exact 6-position slider effort, and forward `mode.effort` in `browser-worker.ts`.
   - Retained fork's `#911` Simplified Chinese effort labels (`即时`, `中`, `高`).
   - Verified by offline unit tests in `tests/chatgpt-model-selection.test.ts` and real-browser fixture tests in `tests/chatgpt-model-family-browser.test.ts`.

4. **Rendered turn identity and stream diagnostics (`b6043e0`, #914)**:
   - Ported `src/adapters/chatgpt-web/stream-diagnostics.ts` directly from upstream commit history.
   - Updated `src/adapters/chatgpt-web/browser-worker.ts` to use `innerText` for `<br>` boundary handling, filter hidden/duplicate token identities, and attach stream lifecycle diagnostic callbacks.
   - Deliberately omitted the experimental vanished-response reload and expansion recovery from draft #914.
   - Verified by `tests/stream-diagnostics.test.ts` (7 unit tests) and `tests/browser-turn-binding.test.ts` (DOM boundary turnToken extraction).

5. **Original deferrals and subsequent dispositions**:
   - `ffe041f` (delayed finals / token diagnostics): The original deferral is superseded by the deterministic tests and port recorded under [2026-11-03 delivery, compaction and delayed finals](#2026-11-03-delivery-compaction-and-delayed-finals); no generic #910 fix is claimed.
   - `f9325c9` (multipart compaction ceiling #930): The original coupled-port deferral is superseded by the joint adoption with `ffe041f` on 2026-11-03.
   - `e1780b1` (delivery / staging retry guards #929): The original deferral is superseded by the pending, completed, late and duplicate tool-result replay regressions and adoption on 2026-11-03.
   - MCP and Temporary Chat decisions are resolved by the 2026-11-03 opt-in Temporary Chat and MCP readiness decision below: adopt `7c7c10e` and `a738f04`, reject `ad9a611`, and coordinate `53b6050` with the next installer release. Full Access worktree restructuring (`760ab5a`, `e6ed93a`, `b48477e`) remains deferred as one group.

## 2026-11-03 dependency rereview

Base: `545cd44a5159a83878182fe7a7ee9e58426dea82`. The registry recheck reproduced the four
freshness attention rows before changes. This review supersedes the earlier bounds for those
packages; unrelated deferrals and the separate minimatch security deadline stay in force.

| Package / reviewed latest | Decision | Evidence and reconsideration condition |
| --- | --- | --- |
| `chromium-bidi` 159.0.8138-0 | defer; retain 12.1.0 | Trial installation contains `out/`, while the installed Playwright core bundle requires `chromium-bidi/lib/cjs/bidiMapper/BidiMapper` and `chromium-bidi/lib/cjs/cdp/CdpConnection`. The import contract fails with `MODULE_NOT_FOUND`; restoring 12.1.0 passes. Reconsider when Playwright supports the new layout, a compatibility shim is reviewed, or latest advances. |
| `electron` 45.2.1 | adopt from 44.9.1 | Exact launcher manifest and lock pin move together; the Electron freshness deferral is removed. Node remains on major 24, so Node 24 typings remain appropriate (their reason is refreshed). Windows package and installer smoke are required; results are recorded in REVIEW. |
| `motion` 14.9.0 | defer; retain 12.43.0 | The React upgrade guide describes changed prop filtering in 13 and no breaking changes in 14. This is not evidence of a known failure in this fork. The existing visual acceptance condition remains unmet: `App.tsx` uses `AnimatePresence` for onboarding/page transitions and toast enter/exit; `smoke:package` only loads the renderer and verifies the runtime, then exits. Reconsider after isolated packaged UI inspection of these transitions, a relevant animation/security fix, or newer latest. |
| `@vitejs/plugin-react` 6.2.1 | defer; retain 5.2.0 | Exact registry metadata requires peer `vite: ^8.0.0`; installed Vite is 6.4.5. Adopt together with the already-deferred Vite 8 toolchain after renderer build, package and smoke verification, or re-review when latest advances. Do not force an incompatible peer into the current build. |

Sources checked on 2026-11-03: exact npm metadata for
[chromium-bidi](https://registry.npmjs.org/chromium-bidi/159.0.8138-0),
[Electron](https://registry.npmjs.org/electron/45.2.1),
[Motion](https://registry.npmjs.org/motion/14.9.0) and
[plugin-react](https://registry.npmjs.org/@vitejs%2fplugin-react/6.2.1);
[Electron 45](https://www.electronjs.org/blog/electron-45-0) and
[Motion React upgrade guide](https://motion.dev/docs/react-upgrade-guide).
The BiDi trial also attempted one isolated headless Edge launch with a 30-second bound; it timed
out, so it provides no browser compatibility claim. The deterministic import failure above is
the reason for retaining the old dependency. No account login or model call was involved.

`tests/chromium-bidi-compatibility.test.ts` extracts the actual lazy imports from installed
Playwright and loads each against installed chromium-bidi. It asserts resolvability/loadability,
not a dependency version. The same test failed on the trial upgrade and passed after restoration.
The root manifest and root lockfile return exactly to their base contents; the launcher lockfile
changes only the Electron node and workspace pin.

Re-review is machine-triggered by a latest version exceeding its
`.github/dependency-deferrals.json` bound (an exact `latest`, or one or more `latestPrefix`
version lines); there is no separate untracked revisit date.
See [REVIEW.md](REVIEW.md#2026-11-03-dependency-rereview) for local acceptance and its limits.

### Latest-tag rollback recheck (2026-11-03)

At base `ece4d7c38c901d19da3bd737a290e4a63a7e30a9`, `npm view chromium-bidi time --json`
and `versions --json` show latest `157.0.8103-39` published at `2026-11-03T01:40:48.039Z`,
after `159.0.8139-2` at `2026-11-02T17:46:55.391Z`. The 159 releases are still listed;
exact metadata for both checked versions has no `deprecated` field, and the time response has
no `unpublished` record. This establishes the observed tag/publication state, not why the tag moved.
`npm pack chromium-bidi@157.0.8103-39 --dry-run --json` lists 310 files, including
`out/Default/gen/src/bidiMapper/BidiMapper.js`, but neither `lib/cjs/bidiMapper` nor `lib/cjs/cdp`.
That cannot satisfy the installed Playwright imports tested by
`tests/chromium-bidi-compatibility.test.ts:8`. Keep the installed 12.1.0 and both lockfiles;
replace the former 159-line exception with exact latest `157.0.8103-39`. Any different latest
must resurface, including a return to 159. Reconsider also on Playwright layout support or a
reviewed shim. No runtime upgrade or browser compatibility acceptance is claimed.

### Both version lines deferred (2026-11-03)

npm latest then moved again, to `159.0.8140-0` (published `2026-11-03T06:19:13.518Z`), after the
157 tag above. `npm pack chromium-bidi@159.0.8140-0 --dry-run` lists 319 files, including
`out/Default/gen/src/bidiMapper/*`, and no `lib/cjs` path, so it has the same layout as
`157.0.8103-39` and `159.0.8138-0`. An exact `latest` bound would turn red every time the tag crossed
between the two lines, although the compatibility conclusion is identical. The deferral is now a
`latestPrefix` list of the two version lines, `157` and `159`; the checker accepts one prefix or a
non-empty list of unique prefixes and defers a latest matching any entry, while every other line
still resurfaces. A line-wide bound is deliberately coarse: a later release on either line could
change the package layout. `tests/chromium-bidi-compatibility.test.ts` is the machine check of that
layout against the installed Playwright; keep 12.1.0 and both lockfiles until it passes on a
candidate, Playwright supports the new layout, or a shim is reviewed.

## 2026-11-03 delivery compaction and delayed finals

Base: `e27d403c7886ec85901c9836a02c25b4b3ac37a8`. Adopt the three reviewed shared TypeScript
fixes on Windows; they do not depend on platform-specific launchers or change model/effort routing.

- `e1780b1` (#929): recognize only an exact visible service delivery alert in the bound turn,
  outside user/assistant content and with no Stop control. Retry staging only for an exact ACK
  mismatch before final commit. Pending native calls and duplicate canonical results prevent
  retry; completed or late canonical results continue with saved evidence without replaying a command.
  The existing three-retry budget remains in force.
- `f9325c9` (#930): use the browser transport's exclusive total-token ceiling for multipart
  compaction, including framing, acknowledgements, attachment costs and platform reserve. Trim
  only oldest expendable compaction history; preserve required system context, newest cumulative
  checkpoint and final instruction. Count the omission notice, rebuild attachments, retain atomic
  records and reject unfit required context. Ordinary requests retain their complete history.
- `ffe041f`: allow ten minutes of inactivity when final completion is uncertain, including the
  reported 125-second delayed final. Explicit failures, empty completed answers and missing DOM
  keep their own checks. Record numeric context costs by role and forward them through the helper.
  The diagnostic serializer uses this fork's existing `withoutRetiredTurnHandles(JSON.stringify(...))`;
  upstream's `serializeMultipartContext` belongs to the separately deferred rendering fix and is
  not introduced implicitly. Counts exclude contents and identifiers and are not additive usage.

Reconsider if Windows fixtures or native result reconciliation regress, if the observed UI service
alert/ACK contract changes, or if upstream changes its transport budget. MCP ABI, Temporary Chat
and the Full Access workspace group remain deferred. Source and installer versions remain unchanged.
Tests, gate results and account/package acceptance limits are recorded in
[REVIEW.md](REVIEW.md#2026-11-03-delivery-compaction-and-delayed-finals).

## 2026-11-03 upstream review: #935–#959 and current workspace roots

Base: `ece4d7c38c901d19da3bd737a290e4a63a7e30a9`. Read-only GitHub issue bodies, #957's
follow-up comment, each PR's source/test patch and exact heads were inspected. Main is unchanged
at `860fa576eb47d9e20d7d8289235bfea94392d2fd`. The table records reviewed history, not a merge.
Local evidence is relative to this source snapshot. Closed PRs are not assumed merged.

| Item / exact source | Decision and fork evidence | Reconsideration condition |
| --- | --- | --- |
| #935 `2dc3d2c` | defer. It recovers a previous turn's source when the current turn has none. This fork already stores the source (`src/adapters/chatgpt-web/compaction-continuation.ts:9`, `:54`), but `acceptedCheckpoint` is exact-turn scoped (`:80`) and source lookup currently stays at the expected turn (`src/adapters/chatgpt-web/environment.ts:339`). The proposal intentionally broadens that replay boundary, so it requires its own cross-turn authority acceptance. | Prove previous-turn-only compaction recovery on Windows with same-thread/model/effort scope, ambiguity, stale/rewritten summary, explicit foreign owner and normal-turn rejection tests. |
| #936 | defer. Windows missing-cwd report is relevant; native recovery still requires recognized current claims (`src/adapters/chatgpt-web/thread-environment.ts:215`). Persisted cache alone cannot authorize the failed request. | Adopt the grouped current-native world-state recovery with positive and forged/stale Windows fixtures. |
| #937 / #943 / #946 | not applicable: each exact issue API returns 404; no source patch exists. | The number becomes available. |
| #938 | defer diagnosis. Windows Plus manual Zero Risk report supplies no capability diagnostics; route effort checks require positively observed account capabilities (`src/chatgpt-web-models.ts:616`). Enabling paid effort from billing assertions alone would bypass that check. | A privacy-safe account capability snapshot identifies a selector/probe defect, with a regression. |
| #939 | defer with workspace group. Windows `world_state full=false` visualization-only roots conflict with the fork's exact roots comparison (`src/adapters/chatgpt-web/thread-environment.ts:258`); no native-world-state comparison exists here. | Adopt reviewed world-state handling with #933/#936, preserving cwd, restricted policies and current native turn proof. |
| #940 `282df611` | defer; closed alternative. Its strict last-full-snapshot plus visualization delta implementation changes native authority reconciliation (`src/adapters/chatgpt-web/codex-rollout-environment.ts:201`, `src/adapters/chatgpt-web/thread-environment.ts:258`). The newer workspace branch handles later calendar/tool merge patches and supersedes this narrow alternative. | Review the grouped branch rather than stacking both competing reconciliation implementations. |
| #941 | defer feature. Downloading authenticated sandbox artifacts adds network/file delivery authority; current conversion returns Markdown (`src/adapters/chatgpt-web/markdown.ts:223`), not an authenticated download pipeline. | Define Windows destination, traversal/size/type limits and current-turn message ownership; test before account-bound download acceptance. |
| #942 | defer. macOS memory measurements do not establish a Windows leak; restarting retained documents could discard active ownership tracked by `src/adapters/chatgpt-web/browser-worker.ts:3103`. | A bounded Windows idle/active memory reproduction and safe tab-recycling acceptance exist. |
| #944 | defer diagnosis. macOS native-result/compaction race is unconfirmed; the fork rejects active environment changes (`src/adapters/chatgpt-web/turn-broker.ts:429`), which could explain a blocked receipt but does not prove causation. | Reproduce a matched native-result/compaction race on Windows and retain exact-once tool completion tests. |
| #945 | defer with #939. Reported macOS roots conflicts overlap shared code at `src/adapters/chatgpt-web/thread-environment.ts:258`; cache fallback is not a safe fix. | Grouped world-state tests cover Windows continuation and stale/mismatched roots. |
| #947 `9e089e75` | defer. Closed fresh-compaction receipt proposal changes prompt authority, transaction owner cancellation and completion arbitration together; this fork begins retained receipts at `src/adapters/chatgpt-web/compaction-handoff.ts:310` and broker transactions at `src/adapters/chatgpt-web/turn-broker.ts:409`. | Define fresh summary-only MCP receipt acceptance and test suspension, cancellation, missing receipt and zero work-tool authority as one change. |
| #948 `dc6d781c` | defer. Document-global historical identity memory affects submission acknowledgement (`src/adapters/chatgpt-web/browser-worker.ts:3103`, `:3289`), next to the newly ported retry guards. An unbounded Set survives helper processes until navigation. | Bound retained-document history and verify remount, genuinely competing turns, navigation reset and staging ACK ownership together. |
| #949 | defer diagnosis. Windows renderer idle-document failure is relevant, but no root-cause patch is supplied; the current bootstrap fails on renderer termination and deadline (`launcher/electron/browser-host.cjs:294`, `:302`). Extending 10 seconds is not a proven repair. | Controlled Windows reproduction identifies renderer/process cleanup failure and verifies recovery without reboot. |
| #950 `74830815` | defer. Passive startup-restriction observation and visible label extraction are coupled to the upstream extracted picker; this fork still reads exact control `innerText` (`src/adapters/chatgpt-web/browser-worker.ts:2869`, `:2901`). | Adapt to this fork's picker, test hidden placeholders and future matching fallback restrictions, preserve pre-Send-only rejection and no model substitution. |
| #951 `1591305f` | defer. Closed patch imports `activateChatGptEffortMenu` from the deferred `chatgpt-ui` module; this fork owns activation and slider readers in `src/chatgpt-session.ts:213`, `:389`, `:415`. Its new test also requires the deferred September power-picker fixture. | Adapt activation against this fork's fixture/API and prove no submit, no draft mutation and locked capability rejection. |
| #952 `c481e0e630c6b850d9cb6469b0e0c0a03697e8e1` | adopt independent fix. `src/adapters/chatgpt-web/markdown.ts:182` accepts only whole JSON in narrow plain layout before escaping/wiki links; `tests/chatgpt-web-markdown.test.ts:4` covers lexical spelling, hostile attributes, malformed JSON and stream rewrite rejection. | JSON layout contract changes or strict-consumer regression fails. |
| #953 `c1c595f06525a3ffde92b8da866e41bb8df5445c` | adopt independent fix. Busy status metadata is marked UI at `src/adapters/chatgpt-web/browser-worker.ts:5067`; `tests/browser-response-dom.test.ts:174` exercises the actual production callback and retains real reasoning/commentary. | Busy semantics or channel separation regresses. |
| #954 `511792d1` | defer with workspace group. Adds cwd-less visualization widening on top of #933, while this fork only substitutes roots when the native record omits them and cwd agrees (`src/adapters/chatgpt-web/thread-environment.ts:240`). | Port #933 prerequisites and choose one reconciliation design with forged/foreign-thread/restricted negative tests. |
| #955 `1d129671` | defer. Expands automatic approval to Russian; existing exact English connector/one-time allow rules are security-sensitive (`src/adapters/chatgpt-web/browser-worker.ts:1064`, `:1079`, `:1093`). Source tests use semantic, not captured Russian DOM. | Capture/validate owned Russian surface and test exact connector escaping, denial, cancellation, duplicate and unowned cards before enabling clicks. |
| #956 | defer diagnosis. Linux retained chats report a verified slider but failed model-header readback; this fork also checks exact header labels (`src/adapters/chatgpt-web/browser-worker.ts:2869`, `:2901`). The report infers the failing header text but does not capture it. | Capture the failing Windows header and adapt #950 with retained/new-chat tests; do not silently substitute a model or retry a sent turn. |
| #957 and follow-up comment | defer. `src/adapters/chatgpt-web/environment.ts:262–271` rejects a selected revision with a different native turn ID; the comment additionally identifies roots removal rejected by `src/adapters/chatgpt-web/turn-broker.ts:429–434`. Skipping internal messages alone cannot fix both. Evidence is one modified macOS run, not Windows acceptance. | A focused fix tests goal-clear internal-item selection plus same-cwd Full Access root changes, while rejecting changed cwd, privilege loss, workspace-write changes and foreign turn IDs. |
| #958 `810a3100` | defer feature. Adds persistent 100 MiB/thread images without expiry and broker-bound `codex.image_context` operations; this fork's prompt uses per-message refs (`src/adapters/chatgpt-web/prompt.ts:239`) and MCP selects registered tools (`src/adapters/chatgpt-web/mcp-server.ts:932`). This changes retention and tool authority, not just deduplication. | Maintainer accepts retention/cleanup policy and MCP operation contract; verify Windows storage, revocation, restart/compaction, overflow and cross-thread isolation together. |
| #959 `e1b3c7e8cd3a40d4063f196a4e42568649d42e6e` | defer integrated composer fix. Closed PR has no reviews/comments. Fork transport limits use `proAvailable` (`src/chatgpt-web-models.ts:229`); PR introduces session-proven billing `proPlan` across config/setup/helper, plus restored-draft cleanup. Its new non-Pro Max 500k bound is explicitly unmeasured. Fork insertion is at `src/adapters/chatgpt-web/browser-worker.ts:4348`; connector identity is not rechecked by the PR's empty-editor guard. | Agree conservative unknown/Team/Max limits; adapt billing migration and old-helper fallback, then test restored drafts, disabled Send, Korean alert, cancellation and exact connector preservation together. No isolated draft guard is claimed safe for the connector-pill path without those tests. |
| `fix/current-workspace-roots@adabeb16abad149f64546b45e8ef88aa4c917f56`: `8203fb7` | defer. Read actual patch: it scans latest filesystem-bearing `world_state` merge patches, compares exact filesystem XML and retains start projects. Fork native reader (`src/adapters/chatgpt-web/codex-rollout-environment.ts:201`, `:729`) and claim model do not carry rolloutPath/filesystemXml; reconciliation (`src/adapters/chatgpt-web/thread-environment.ts:240`) also lacks deferred #933 widening. This is the grouped trust-boundary change, not an independent line fix. | Adapt alongside #933/#936/#939 with Windows full/partial/reset world-state, foreign turn, cwd, permission downgrade and continuation tests; choose it over competing #940/#954 alternatives. |
| Same branch: `adabeb16` | already adopted; no additional patch. The actual change is only Vite 6.4.4 to 6.4.5 and its integrity; fork `launcher/bun.lock:703` already resolves 6.4.5 with the same integrity. | A new Vite advisory or lock node change. |

Attribution for the two independent ports (also retain in the eventual commit message):

Co-authored-by: r83bksga8fc3 <r83bksga8fc3@proton.me>

The four-axis reviewed ledger may advance to PR #959/head `e1b3c7e8`, issue #957 and both exact
branch heads after this register. Deferred items remain tracked in ROADMAP; installer/source
versions, models, effort parameters and both lockfiles are unchanged. Verification is recorded
in [REVIEW.md](REVIEW.md#2026-11-03-external-gate-changes).

## 2026-11-03 opt-in Temporary Chat and MCP readiness

The maintainer authorized these choices through the dispatching agent. Adopt `7c7c10e`
(#918), authored by vechen <147659719+miuuyy@users.noreply.github.com>, with this fork's inverse
legacy migration rather than upstream's removal-era assumption. Rename `useSavedChats` to
`useTemporaryChats` across CLI, setup, provider, IPC, launcher settings and worker. A valid explicit
new value takes precedence, including `false`; otherwise legacy `false` becomes Temporary Chat
`true` and legacy `true` becomes `false`. A stored configuration or launcher state with neither key
predates the setting and becomes `true`: the only public release (v5.0.6) always opens
`?temporary-chat=true` and writes no such key, while every writer in the adopted 6.x source
(`v6.0.0` through `v6.1.13`, this fork's lineage) persists one: the config writers all serialize
`defaultConfig` or a parsed config, and the launcher state store writes its defaults on every
update. An absent key in an existing file therefore comes from v5.0.6. Upstream `v6.1.14` onward
removed Temporary Chat and writes neither key; the fork deferred that source, and a file from it
would also map to Temporary Chat, the more private direction. The configuration and state version
fields (3 and 1 in both generations) cannot tell the generations apart. A brand-new
install has no stored file and starts from `defaultConfig`, which is `false` (saved chats).
Save only the new key. Launcher runtime
reads normalize before UI synchronization, and persisted launcher state drops the legacy key.
Invalid runtime preference types fail explicitly. Preserve `--saved-chats` as the ordinary-chat
alias so existing Windows CLI calls continue to work. Temporary Chat applies to Automatic and
Zero Risk without enabling DOM inspection in Zero Risk; completed retained chats retire when the
privacy preference changes. Prediction-only turns remain temporary and tool-free.

Reject `ad9a611` (default Temporary Chat on for every install): new installations keep the
saved-chat default, and installations with stored settings keep the mode they already use, so
upgrading from v5.0.6 does not silently move anyone from Temporary Chat to saved history. Missing connectors
in Temporary Chat explain how to turn the option off. Offline migration, helper IPC, connector
failure and Zero Risk tests do not establish account-bound behavior; account acceptance remains
in ROADMAP and requires separate authorization/login.

Adopt `a738f04` (#893/#895), by the same author. Core integration installation is the MCP setup
prerequisite; catalog verification is independent. Incomplete installations remain blocked.
Doctor reports pending, failed and recovered catalog requests separately from proxy health;
a healthy proxy must not hide the latest catalog error. Keep sanitized status/stage/code details
and localized error text. This port does not change the tools/list ABI.

Adopt `53b6050` (60-second command polling and tools/list ABI) with the **next installer version**,
not as an independent update. It requires focused transport/poll-limit tests and connector refresh;
coordinating it with release asks users to refresh only once. The release row tracks the trigger.
No installer pin changes here. Keep `760ab5a`, `e6ed93a` and `b48477e` (Full Access additional
workspaces) deferred as a group; retain Windows path and workspace authority boundaries.

## 2026-11-04 native upstream follows the route Codex used before setup

Setup replaces Codex `openai_base_url` with the bridge. The bridge used to forward every non-Web
model to the hardcoded official backend, so a route that Codex used before setup (for example a
local multi-provider router serving `anthropic/*` and `combo/*` rows) silently stopped working: the
official backend rejects those models for a ChatGPT account.

Decision: all native endpoints (`responses`, `responses/compact`, `models`, `alpha/search`,
`images/*`) share one configurable upstream. `nativeUpstreamUrl` in `config.json` wins when set;
otherwise `serve` uses the integration journal's `previous.openai_base_url`; only when Codex had no
custom route does traffic go to `https://chatgpt.com/backend-api/codex`. The incoming Codex
authorization header is forwarded unchanged, as before. Resolving from the journal at start-up (not
copying it into `config.json` during setup) keeps one source of truth: a later
`--replace-codex-route` setup updates the journal and the next start follows it. `/healthz` and
Doctor report the active upstream so a fallback to the official backend is visible.

A route recorded in the journal is trusted as the user's own previous choice; the bridge never
discovers or probes other local services. A previous value pointing at the bridge itself is ignored.

A loopback upstream (`127.0.0.1`, `localhost`, `[::1]`) is fetched directly. The launcher's proxy
resolver stays restricted to `https://chatgpt.com/backend-api/codex/` and answers HTTP 400 for
anything else; a loopback target never needs the OS proxy, so widening that allow-list is not
needed. A non-loopback custom upstream still fails with that explicit error until a need appears.

### Pinned `model_catalog_json`

When Codex config pins `model_catalog_json`, Codex reads that file and never asks the bridge for
`/models`, so Web rows cannot appear. Options considered:

| Option | Rejected / chosen because |
| --- | --- |
| Write Web rows into the pinned file | rejected: edits another tool's file; its next re-sync silently removes them; uninstall must surgically strip rows. |
| Remove the pin so Codex asks the bridge | rejected: changes which catalog Codex trusts for every native row and diverges from what the other tool configured. |
| Point the pin at a bridge-owned merged copy | **chosen**: the pinned file is never written; the merged copy is the pinned catalog plus the Web rows built by the same `augmentNativeModelCatalog` used for `/models`. |

The overlay state lives in its own journal (`codex/catalog-overlay.json`) instead of a new route
journal version, because restoring it is intentionally lenient and independent of the route's
strict ownership checks: install, reconnect and Setup apply it; disconnect and uninstall put the
original line back byte-for-byte **only while the line still names the merged copy**, then delete the
merged copy. A newer value belongs to someone else and is left alone. A missing pinned file is left
untouched rather than replaced.

Re-sync by the other tool: if it rewrites its own catalog file, the running bridge re-merges within
30 seconds (and at every start). If it rewrites the Codex config line back to its own file, Web rows
disappear until Setup or reconnect runs again; Doctor reports this as a `catalog-overlay` warning.
Reconsider if Codex gains a way to combine a pinned catalog with a remote `/models` list.

## 2026-11-04 upstream review: #960–#963

Read-only GitHub issue bodies and comments were inspected; main, the latest PR/head and both branch
heads are unchanged. The table records reviewed history, not a merge.

| Item | Decision and fork evidence | Reconsideration condition |
| --- | --- | --- |
| #960 / #962 | not applicable: each exact issue API returns 404; no source patch exists. | The number becomes available. |
| #961 | defer diagnosis. Windows Plus, Full harness: the turn ends with `A newer Codex instruction superseded this ChatGPT response.` This fork emits the same message from `chatGptTurnSupersededError` (`src/adapters/chatgpt-web/adapter-error.ts:67`) when a newer Codex instruction replaces an in-flight turn (`src/adapters/chatgpt-web/turn-execution.ts:540`), which is intended cancellation, not by itself a defect. The report has screenshots and an attached diagnostics file but no identified trigger, no upstream triage and no fix. | A privacy-safe diagnostic shows the supersede firing without a newer Codex instruction (for example a duplicate or replayed request), with a Windows reproduction and a regression. |
| #963 | Fork-local detached-turn root cause/fix recorded on 2026-11-25; see the decision below. The effort-menu timeout remains deferred. Original upstream report: defer diagnosis. Windows 6.1.17, GPT-6 Sol (Web): `Reconnecting 5/5`, repeated `ChatGPT opened another user turn while the bound assistant response was detached` (`src/adapters/chatgpt-web/browser-worker.ts:3486`) followed by retained compaction fallback, and 120 s `effort_selection` stage timeouts (`src/adapters/chatgpt-web/browser-worker.ts:5640`). The report itself says the concurrent Cloudflare check is not established as the cause, and the tunnel-ID rejection is a separate setup observation. No root cause or patch is supplied; raising timeouts or loosening the detached-turn binding is not a proven repair. | A controlled Windows reproduction isolates why the bound response detaches or the effort menu never settles, with a regression that keeps the turn-binding and no-resend guarantees. |

The four-axis reviewed ledger advances to issue #963; PR #959/head `e1b3c7e8` and both exact branch
heads are unchanged. Deferred items are tracked in ROADMAP.

## 2026-11-04 dependency rereview

Strict freshness reported three attention rows. Unrelated deferrals and the minimatch security
deadline stay in force.

| Package / reviewed latest | Decision | Evidence and reconsideration condition |
| --- | --- | --- |
| `electron` 45.2.2 | adopt from 45.2.1 | Patch release: Chromium 156.0.8078.80, Node 24.22.2, and two fixes (Wayland hidden-parent crash, `removeInsertedCSS()` user origin). Exact launcher manifest and lock pin move together. Node stays on major 24, so the Node 24 typings deferral keeps its reason. Package built; the scripted installer smoke timed out three times (installer over 120 s) and remains outstanding, while the installed launcher was verified manually; see REVIEW. |
| `turndown` 7.2.5 | defer; retain 7.2.0 | 7.2.5 only speeds up output concatenation and bumps development dependencies; no advisory affects turndown. The exact pin moves together with `@types/turndown`. Reconsider on a security or correctness fix relevant to Markdown conversion, or when both move in a dedicated pass. |
| `motion` 14.9.1 | defer; retain 12.43.0 | A patch on the already-deferred 14 line. The 2026-11-03 visual acceptance condition (packaged onboarding/page/toast transitions) is still unmet. |

Sources checked on 2026-11-04: [Electron v45.2.2 release notes](https://github.com/electron/electron/releases/tag/v45.2.2),
[turndown v7.2.5](https://github.com/mixmark-io/turndown/releases/tag/v7.2.5) and npm registry metadata.

## 2026-11-05 proxy start timeout

On the first launcher start after a reboot the Responses daemon stayed alive but printed nothing
for 21.6 s; `waitForProxy` gave up at 20 s, stopped it and restored the previous Codex route
(`Responses proxy did not become healthy on 127.0.0.1:17841 within 20000ms`). A manual start of
the same command reached `listening` in about 4 s, so the evidence points to cold-start latency
(empty disk cache and antivirus scanning of the runtime), not a daemon defect; no daemon error
output exists to prove the cause.

Decision: raise the proxy start wait to 90 s (`PROXY_START_TIMEOUT_MS`). The wait already ends
immediately when the daemon exits, so the longer cap only applies to a live daemon that has not
answered yet. 90 s stays below the tunnel start budget (120 s) so a hung daemon still fails and
the route is still restored. Regression tests use a virtual clock for the slow-but-healthy, never
healthy and already-exited cases. Reconsider if the daemon gains a readiness signal earlier than
`/healthz`, or if starts routinely approach the cap.

## 2026-11-05 upstream review: #964–#965

| Item | Decision and fork evidence | Reconsideration condition |
| --- | --- | --- |
| #964 `445aa23bba01beba631453af022aa44c623e2e85` | defer. Closed, unmerged. It adds an opt-in `doctor --verify-mcp` that round-trips a random file hash through the MCP broker (`src/doctor-mcp.ts`, +357 lines) and wires the launcher's Verify action to a time-limited receipt, but it also carries the closed #940 world-state prerequisite that this fork already deferred with the #933/#936/#939 workspace group (`src/adapters/chatgpt-web/codex-rollout-environment.ts`, `thread-environment.ts`). The author states that prerequisite must be reconciled with upstream first. | The MCP proof lands upstream without the #940 prerequisite, or the workspace group is adopted; then verify the broker round-trip on Windows Full harness with tunnel/daemon binding and no stale turn. |
| #965 | defer diagnosis. macOS arm64 performance report: a one-command Native2 turn takes 84–168 s; the reporter could not isolate MCP transport from model or browser time and asks for timing diagnostics. Not a Windows reproduction and no defect is identified. | A Windows measurement that separates broker delivery, result acknowledgement and model continuation, or upstream adds such timing diagnostics. |

The four-axis ledger advances to PR #964/head `445aa23b` and issue #965; main and branch heads are unchanged.

## 2026-11-05 dependency rereview

| Package / reviewed latest | Decision | Evidence and reconsideration condition |
| --- | --- | --- |
| `electron` 45.2.3 | adopt from 45.2.2 | Patch release backporting upstream ANGLE, Chromium, Dawn, FFmpeg, PDFium, Skia and V8 fixes ([release notes](https://github.com/electron/electron/releases/tag/v45.2.3)). Exact manifest and lock pin move together; Node stays on major 24. Packaged together with the proxy start timeout fix; package and install results are in REVIEW. |
| `vite` 8.3.6 | defer; retain 6.4.5 | A patch on the already-deferred 8 line; the Vite 8 plus plugin-react 6 migration is still a dedicated pass. |

## 2026-11-05 single-effort routes ignore the requested effort

The catalog already advertises GPT-6 Sol Instant and GPT-5.6 Sol Instant with exactly one
effort (`low`, also the default). Codex still forwards a global `model_reasoning_effort`
(for example `medium`), and the route rejected it with `does not support effort "medium"`, so
the user had to remember to switch to `low` every time. A route with exactly one supported effort
has nothing to choose, so it now uses that effort whatever was requested. Routes with several
efforts keep rejecting an unsupported one; account gating of the single effort is unchanged.
This is not model or effort substitution between alternatives, which stays refused.

## 2026-11-07 port: rich JSON rendering (#886) and connector navigation diagnostics (#925); disposition of remaining 6.1.14–6.1.17 deferrals

Adopted the two standalone, Windows-applicable fixes from the remaining 6.1.14–6.1.17 deferred ledger:

1. **Rich JSON rendering (`d3cf95a`, #886)**:
   - Encodes rich-text delimiters inside JSON string lexemes only in `src/adapters/chatgpt-web/prompt.ts` (`serializeMultipartContext`), escaping `\\(["\\])|[<>[\]*_~():#\x60]` to Unicode hex while leaving structural JSON syntax and decoded payload values intact.
   - Updated `multipartRecordWeight` and `partitionMultipartContext` to serialize and measure through `serializeMultipartContext`.
   - Verified by red-then-green regression test in `tests/prompt-contract.test.ts`.

2. **Connector navigation failure logging (`1a0e893`, #925)**:
   - Wrapped `refreshChatGptHomeDocument(useTemporaryChats)` within the `try` block of `runConnectorVerification` in `launcher/electron/browser-host.cjs`.
   - A pre-helper navigation abort now records `connector.verification_failed` in launcher diagnostics and cleans up `manualOperation` rather than failing unhandled before diagnostic logging.
   - Verified by red-then-green regression test in `launcher/tests/browser-host.test.cjs`.

3. **Dispositions of remaining 6.1.14–6.1.17 deferrals**:
   - `d80bf0d` (BOM settings/verification): rejected port. The fork already has equivalent and cleaner BOM-tolerant JSON parsing in `launcher/electron/json-file.cjs` (committed on 2026-10-25 via `ee3b8f8`), verified by `launcher/tests/utf8-bom-compatibility.test.cjs`. Fork `scripts/verify.ts` also already uses `build:renderer`.
   - `30e7ad9` (isolate ChatGPT UI contracts): rejected structural churn. The fork's model picker, inline controls (`2f0936b`), and Chinese effort labels (`#911`) were already ported in `src/chatgpt-session.ts` and `src/adapters/chatgpt-web/model-selection.ts`. Re-extracting to a separate module is structural churn with high regression risk against local labels and no Windows behavioral benefit.
   - Native task restoration (`794e576`, `3b47927`, `3790e3f`, `7b7f2f8`): retain deferral. Coupled with issue #935 and cross-turn authority boundaries; `3b47927` modifies `extractChatGptTurnUserRevision` (`sourceWasDelegation` -> `sourceWasSyntheticInstruction`) and reverses attribution precedence from human messages to synthetic goals, which requires maintainer direction alongside the workspace/world-state group.
   - `d3734f1` (cancellation measurement): retain deferral. Modifies live smoke timing; reassess when cancellation acceptance is explicitly run.
   - `0286265` (native session reminder layer): retain deferral. Adds native Electron views requiring live Windows focus, layering, resize and dismissal acceptance.
   - `988f45a` (dependencies/Electron preparation): reject pin replacement; defer chromium-bidi removal (installed Playwright core requires its lib/cjs layout, see 2026-11-03 dependency rereview). Electron and Bun remain pinned to fork specifications.
   - `8744974` (merge #921): rejected duplicate. Implementation was already ported via `89f0ead`.
   - Release version bumps (`cfeaf04`, `8a75f1b`, `b618281`, `860fa57`): retain fork separation (source 6.1.13, installer 5.0.6).
   - Specified exclusions: MCP contract (`53b6050`), Temporary Chat default (`ad9a611`), and Full Access additional workspaces (`760ab5a`, `e6ed93a`, `b48477e`) remain tracked by their respective roadmap triggers.
   - Open draft PRs and deferred issues:
     - PR [#914](https://github.com/miuuyy/codex-chatgpt-web/pull/914): retain deferral. Rendered marker fix ported (`b6043e0`, 2026-11-02); reload recovery requires stabilized, bounded Windows reproduction and no-resubmit proof.
     - PR [#934](https://github.com/miuuyy/codex-chatgpt-web/pull/934): retain deferral. Changes clipboard ownership and IPC; requires stable tests proving clipboard restoration and exact acceptance without resubmission on Windows.
     - Issue [#912](https://github.com/miuuyy/codex-chatgpt-web/issues/912): retain deferral of intermediate preference redesign. Addressed via final #918 inverse migration (2026-11-03 decision).
     - Issue [#913](https://github.com/miuuyy/codex-chatgpt-web/issues/913): retain deferral. macOS measurements and local patches do not establish this fork's Windows/OpenCode contract; components #904 and #930 are separately bounded.

## 2026-11-11 upstream review: 860fa57..32fd343 (v6.1.18, #965-#985)

Reviewed-history update that also ports four fixes. The read-only range is
`860fa576eb47d9e20d7d8289235bfea94392d2fd...32fd3436eb6ed94898b987a3c369003bb6fb8d54`
(`upstream/main`): 12 non-merge commits and merge `9f2370c` (#973). Read alongside the code delta
and the commit bodies. The watermark advances to `32fd343`; the source stays 6.1.13 and the public
installer pin stays 5.0.6 (Bun 1.4.2 and Electron 44.9.1 kept). Upstream content was read as
untrusted data. The scan of added lines found no zero-width characters, no `curl|bash`, `iwr|iex`,
`bypassPermissions` or `--dangerously-skip-permissions`. The hits were read: an HTML comment in the
PR template of `2d7c80a` (documentation only), and `--dangerously-bypass-approvals-and-sandbox` in the
cancellation smoke harness of `d3734f1` (earlier range, deferred, not executed).

### Commits

| Commit | Decision | Reason and reconsideration condition |
| --- | --- | --- |
| `3d43448` export recognized network error codes (stream diagnostics) | ported | Only an allowlist of Chromium `net::ERR_*` codes is exported; any other CDP `errorText` becomes `unknown`, so messages, URLs and proxy details never leave. Red: the upstream test failed (`networkError` absent). Green after the source hunk applied cleanly: `tests/stream-diagnostics.test.ts` 8 pass, 0 fail. |
| `1be1e97` retain observed turn identities across helpers (#948) | ported | The observer keeps observed identities with the document, and the submission baseline copies that history instead of the current snapshot, so a helper replacement cannot acknowledge Send from remounted history. Red: on Edge (`CHATGPT_DOM_TEST_BROWSER`), after scrolling, `currentSubmissionEvidence` threw `ChatGPT exposed 3 new conversation turns`. Green: `undefined`; `user_turn` for the new request with `acceptedUserIdentity` `group:user:new-request`; competing turns throw `2 new` and, after a fresh baseline, `3 new`, exactly as the upstream test asserts. Caveat: under `bun test` on this host, Playwright `browser.close()` does not return (a bare launch/setContent test also times out), so the upstream DOM test hits its 15 s timeout after its assertions. The same steps were run as a standalone Bun script against the same Edge build. The DOM tests stay gated by `CHATGPT_DOM_TEST_BROWSER`. |
| `5d4d9b6` minimatch to 11.0.5 for modern lines (GHSA-g3hv-75wg-m249) | ported (manual, lock regenerated) | The fork's override `minimatch@>=5` to 11.0.4 kept a version below the advisory boundary `<11.0.1`. Replaced with `minimatch@>=7.0.0 <11.0.1` to 11.0.5. Legacy `filelist/minimatch` (5.1.9) and the 3.1.5 nodes now resolve without an override, as upstream designed. `launcher/bun.lock` regenerated with `bun install --lockfile-only`. Red: `tests/launcher-minimatch-override.test.ts` fails on the pre-change manifest and lock (override missing; 11.0.4 is below 11.0.5) and passes after. Launcher audit (`scripts/audit-launcher.ts`): no vulnerabilities. The audit-deferral for the 3.1.5 nodes still holds. |
| `adabeb1` launcher Vite 6.4.5 | skip, already equivalent | The fork's `launcher/bun.lock` already resolves `vite@6.4.5` under `^6.4.4`. |
| `32fd343` ready tunnel check independent of scheduling (test only) | ported (test hardening) | Adds a 5 s timeout and a mocked `Date` to one already-ready tmux test. Not a red/green change: the test is timing-dependent and has no behavioral assertion change. `launcher/tests/runtime-supervisor.test.cjs`: 63 pass, 1 skip, 0 fail. |
| `8203fb7` accept current workspace roots recorded by Codex (#936/#939/#944/#945) | defer | The patch does not apply to `environment.ts` or `thread-environment.ts` (6.1.13 shape). It changes the authorization root check, so it belongs to the Full Access group with `e6ed93a`, `b48477e`, `760ab5a` (see 2026-10-29). Reconsider with that group, or on a Windows report of the `workspace_roots, writable_roots` conflict; require reordered-root, missing-rollout, restricted-mode and foreign-root negatives. |
| `beee796` preserve native task provenance through compaction (#935/#957) | defer | The patch does not apply (`compaction-continuation.ts`, `environment.ts`). Same native-task group as `794e576`/`3b47927`. The ledger trigger (repeated-compaction, new-steering and forged-source negatives, plus the authority group) is not met on this fork. |
| `c3b24da` preserve native goal edits during active web turns | defer | The patch does not apply (`environment.ts`, `native-context.ts`). Same native-task/authority group as `beee796`. |
| `ce18786` expose update check failures, respect GitHub rate limits | defer | Touches `update.cjs` (retry and `retryAt`), `App.tsx`, `UpdateSettings.tsx`, `i18n.ts`, with its own tests. No fork-side equivalent, and no Windows report of a silent update failure or a rate limit. Port as a separate change with red tests. Reconsider on a Windows update-check failure with no visible message, or a rate-limit report. |
| `373dd19` save security-key sign-ins by quitting dedicated Chrome gracefully (#973, merged) | defer | The fix is macOS-specific (`NSRunningApplication`, Command-Q semantics). A Windows equivalent (graceful CDP `Browser.close` before capture) is plausible but not verified, and there is no Windows account repro. Reconsider on a Windows security-key or passkey sign-in that loses the session after Continue. |
| `2d7c80a` PR template and CONTRIBUTING screenshot rule | skip | Contribution policy for upstream PRs. This fork accepts no outside PRs (AGENTS: fork writes belong to the fork). |
| `1cc49aa` release 6.1.18 | defer source/release adoption | Version strings only. Consistent with `860fa57`: no version or installer-pin change in a review-only update. |
| `9f2370c` merge #973 | reject direct merge | Integration history; the component `373dd19` is decided above. |

### Pull requests (#965-#985)

| PR | State | Decision | Reason |
| --- | --- | --- | --- |
| #964 | closed | no change | Already reviewed on 2026-11-05. |
| #973 | merged | defer (see `373dd19`) | macOS-specific fix. |
| #978 | open | defer | Compaction effort and repeated failed Temporary Chat sends. Open and not stabilized; reconsider when merged, with a Windows repro of the failed-send loop. |
| #979 | open draft | defer | Two-part history handoff proposal; draft. |
| #981 | open | reject | Adds a Microsoft 365 Copilot provider and launcher integration. Outside this fork's ChatGPT Web scope; a new provider needs a separate requirement. |
| #984 | open | defer | Honors the selected language in the embedded browser. Launcher UI; needs a Windows check of the embedded browser before adoption. |
| #985 | open | defer | Resets embedded browser session data. Destructive to the signed-in state; needs an explicit maintainer decision and a Windows account-bound check. |

### Issues (#961-#987)

| Issue | State | Decision | Reason |
| --- | --- | --- | --- |
| #961 | open, Windows 11 | defer | "stream disconnected ... superseded" report without a root cause. Keep with #963 for a controlled Windows diagnosis. |
| #963 | open, Windows | fork-local fix; effort timeout deferred | Detached-turn ownership/history classification is reproduced and fixed in fork 6.1.15 (2026-11-25); no upstream patch or contact. Effort-menu timeout remains unproven. |
| #965 | closed | reject | macOS performance report. |
| #968 | closed | no change | Portuguese-language Windows MCP tunnel `removeChild` report, closed upstream; no fork reproduction. |
| #969 | open, Linux | reject | Linux-only; this fork is Windows-only. |
| #970 | closed | no change | Covered by #976 (below). |
| #971 | open, macOS | defer | macOS env-context report. |
| #974 | open, Windows 11, 6.1.18 | defer | "stream disconnected ... final DOM could not be aligned". A Windows report, but no bounded DOM capture or repro; same family as #910. Reconsider with a Windows reproduction and sanitized DOM evidence. |
| #975 | open, Windows 11, Codex Desktop 26.1103 | defer | ChatGPT redirects back to the sign-in section after use. No logs or steps; not reproduced. Reconsider with a Windows repro and session-state evidence. |
| #976 | open, macOS | defer | Native `gpt-6-astra` turns rejected for the reserved `web.run` function. macOS; reconsider if Windows Codex Desktop reports the same. |
| #977 | open, macOS | defer | Composer draft restore breaks Bigger Context; reproduced on stock 6.1.17, macOS only. |
| #982 | open, macOS | defer | Midnight-delta check rejects plain-line `<subagents>`; reproduced on macOS. Reconsider with a Windows repro. |
| #983 | open | defer | Free (Luna-only) account setup fails on the effort slider verification; account-bound, not reproducible here. |
| #986 | open, Windows x64, 6.1.18, filed 2026-11-11 | defer; high priority | Windows report of fresh Web turns failing with `ChatGPT web turn is missing cw...` (missing trusted cwd) after toggling Bigger Context, a follow-up to #936 on 6.1.18. Adjacent to the recorded `workspace_roots, writable_roots` conflict, but the error text is not identical, and the upstream fix (`8203fb7`, which does not apply to this fork) is not yet proven for it. Causal role of the setting is unconfirmed by the reporter. Reconsider first: the Full Access authority group port (`8203fb7` with `e6ed93a`/`b48477e`/`760ab5a`), gated on a Windows reproduction that shows which root check fails. |
| #987 | open, Windows x64, 6.1.18, filed 2026-11-11 | defer | "Local execution policy blocks a lot of calls" (Codex Desktop 26.1103): Codex refuses some local tool calls such as inspecting a Chrome tab or launching Discord or Chrome in debugging mode. The refusal comes from the Codex-side execution policy shown in the report, not from the bridge; no bridge log or reproduction is provided. Reconsider with a bridge-side trace or a reproduction on Windows that shows the bridge rejecting or altering the call. |

### Re-judged deferral groups

- Native task group `794e576`/`3b47927` and `beee796`/`c3b24da`, and the Full Access authority group `8203fb7`/`e6ed93a`/`b48477e`/`760ab5a`: the new commits patch the `environment.ts` and `compaction-continuation.ts` regions that the fork's 6.1.13 shape lacks, so none applies. The trigger is not met; the group stays deferred as one unit.
- `53b6050` (60 s command polls, ABI): unchanged; adopt with the next installer release.

### Dependencies and gate status (2026-11-11)

- `launcher/package.json` and `bun.lock`: `minimatch@>=7.0.0 <11.0.1` to 11.0.5 (upstream `5d4d9b6`); Vite moved in range to 6.4.6. The regression test `tests/launcher-minimatch-override.test.ts` was red on the pre-change manifest and lock.
- Root `playwright-core` 1.65.0 was tried and reverted: `tests/chromium-bidi-compatibility.test.ts` failed (lazy BiDi imports need a layout the installed chromium-bidi 12.1.0 lacks). It is deferred with `latest: 1.65.0` in `.github/dependency-deferrals.json`.
- New deferrals with reviewed bounds: Electron 45.3.0 (packaged smoke required), motion 14.12.0, `@vitejs/plugin-react` 6.3.0, Vite 8.3.8, chromium-bidi 160 line.
- Test-only: `tests/launcher-browser-host.test.ts` deadline race (commit `9901977`). The server now never answers, so only the client deadline can end the request. Red was reproduced under induced CPU load (`aborted` / `ECONNRESET` instead of `timed out`); green on three loaded runs.
- Load-sensitive timing tests (GPT-6 Plus stages, multipart compaction, oversized predictions, suspension clock) are recorded in ROADMAP. Their budgets were not widened.
- Gate: `scripts/check-upstream-baseline.ts --strict` current; `scripts/check-dependency-freshness.ts --strict` current; `bun run verify` is the remaining item. See the 2026-11-11 CHANGELOG entry for the latest run result.

## 2026-11-13 security: `@hono/node-server` 2.1.3 -> 2.1.6

- `bun run audit` (inside `bun run verify`) reported two moderate advisories for `@hono/node-server` >=2.0.0 <2.1.6: GHSA-qv5m-9pm6-hqp3 (unhandled `ECONNRESET` during an asynchronous WebSocket upgrade crashes the process) and GHSA-jpvv-r467-5p4w (backslash parsed as a path separator, an access-control bypass behind a reverse proxy). The exact pin moved to 2.1.6, the first fixed patch release in the same minor line.
- Evidence (Bun 1.4.2): `bun run audit` "No vulnerabilities found"; `pwsh -NoProfile -File tools/dev_check.ps1 -Quick` passed; `bun run test` 1162 pass / 101 skip / 0 fail; `tests/dependency-freshness.test.ts` 11 pass.
- Not changed: the strict upstream baseline check reports new unreviewed upstream commits; that review is a separate ROADMAP item.

## 2026-11-13 upstream review: 32fd343..f08d165

Reviewed all ten commits in local `upstream/main`, from
`32fd3436eb6ed94898b987a3c369003bb6fb8d54` (exclusive) through
`f08d16509e6a5447a0d0f2943abb172c69705160` (inclusive), using commit bodies and complete source/test
deltas. No fetch, merge, cherry-pick, upstream write or release action. Four core fixes are independently
ported; the fork source remains 6.1.13 and installer/updater remains v5.0.6. Bun 1.4.2, both lockfiles,
the existing Electron pin, Windows packaging and bilingual READMEs are preserved.

### Commits (oldest first)

| Commit | Decision | Reason and reconsideration condition |
| --- | --- | --- |
| `ddfb69a804d433067fd0ec87f236561c4e8a8270` embedded browser language | defer | Moves state-store initialization before Electron readiness and applies a process-wide Chromium `lang` switch. PR #984 is now merged and has unit tests, but that does not prove the packaged Windows browser's language or sign-in behavior. Reconsider together with `e9c9509` after Windows first-run, full-quit/reopen, invalid-language fallback and saved ChatGPT-language acceptance. No launcher locale change is ported. |
| `e9c9509579c25a9c22e45c673198c21d48e64578` restart/language hints | defer | Companion UI copy for the deferred locale behavior; adopting it alone would promise unsupported behavior. Reconsider with `ddfb69a`, preserving this fork's product wording and zh-TW/English copy. |
| `8b1fd95f6a2bece9dee9d8d8f4dfd6a8317f5918` merge #984 | skip | Duplicate integration history; both component commits are reviewed above. No direct merge into the fork. |
| `ccf1061afb3660a124cb6097b9d9cb672a8bb3f8` embedded browser data reset | defer | Adds IPC and a confirmed UI action that clears cookies, cache and site data and forces sign-in again. PR #985 is merged, but the 2026-11-11 requirement for an explicit feature decision and Windows account-bound acceptance is still unmet. Reconsider with `d935e3c`, proving confirmation/cancel, owned-session isolation, active-turn handling, failure recovery and sign-in after reset. No data reset is performed. |
| `d935e3cf75df72102f7414375f20887ef5f40c80` reset lifecycle | defer | Companion fix navigates all live contents idle before clearing storage, closes tabs afterward, rewrites the descriptor, waits for runtime startup and dismisses the session reminder after success. It depends on the deferred reset feature and the fork also defers the native session-reminder layer. Reconsider as one Windows-tested reset/lifecycle group; do not introduce the reminder layer implicitly. |
| `890153cf78bfd01ffebaa7e23d5e5fbabfd2de46` UUID subagent inventories (#982) | adopt | Independently extend the fork's exported calendar pattern for UUID lines, optional labels and empty inventories. Keep the existing CodeQL root-list hardening and all rollout, current-turn, permission-profile and root corroboration. The inventory grants no authority or child ownership. Tests cover V1/V2 continuation, malformed UUIDs, injected cwd and changed roots/profiles. Reconsider if native inventory syntax changes or a negative regression fails. |
| `e574edcbbdf12b7301b6aac5b9dc99e03abc19cc` Mermaid preview remounts (#974) | adopt | Remove preview-only shells before Markdown alignment while retaining separate Mermaid code and code views inside previews. The offline DOM fixture reproduces remount/duplicate shells, proves no repeated output and retains Mermaid source. This addresses a Windows-reported alignment family without weakening committed-range checks. Reconsider if ChatGPT changes preview/code markup. |
| `33d248957bde6f035aae63641d47f56de8e831cf` restored composer drafts (#977) | adopt | Plain prompts and Bigger Context stages select the entire editor and insert in one synchronous step, preventing a draft restored after clear from being prepended. Connector-pill insertion retains its existing path; exact readback and abort checks remain authoritative. Selection/focus unit tests and the worker contract prove replacement selection. Reconsider if editor selection semantics change; signed-in draft restoration remains separate acceptance. |
| `3b41eda2efa731245d171b51dbd30935e587c937` merge #985 | skip | Duplicate integration history; both reset component commits are deferred above. No direct merge. |
| `f08d16509e6a5447a0d0f2943abb172c69705160` capability inspection (#983) | adopt | Use the existing owned Radix activation (click/pointerdown) instead of Enter and capture sanitized slider failure evidence before Escape. Forward and validate the inspection trace id. Adapt to the fork's existing `chatgpt-session.ts` module, retaining its `temporary: true` result and forced Temporary Chat inspection isolation. Tests prove the pointer fallback, open-slider capture, one failure checkpoint, cleanup and secret exclusion. Reconsider on menu/slider contract changes; account-tier behavior still needs separate acceptance. |

### Inventory and superseded dispositions

Live `bun run scripts/check-upstream-baseline.ts --strict` reports all four axes current: main `f08d165`,
latest PR #985/head `d935e3c` (merged), non-PR issue #987, and two branches: main plus unchanged
`fix/current-workspace-roots@adabeb16abad149f64546b45e8ef88aa4c917f56`. No checker bypass or fallback was added.

This supersedes the 2026-11-11 deferrals for the bounded code fixes #974/#977/#982/#983 only;
it does not close account-bound acceptance. #984/#985 are merged but still deferred in this fork.
The supplied recent-PR snapshot also records #981 closed (provider remains out of scope), #978 open at
`be5afa0f3e0840e89229d451a0e8bf3740243e09` and #979 open at
`5841e1e79c937da51ed74f4c2986c441c9e6cb03`. Their unmerged heads are outside this ten-commit review;
the existing compaction/authority deferrals remain. The native-task, Full Access, updater reporting,
session-reminder and release/ABI groups retain their existing triggers.

### Verification

All commands use Bun 1.4.2. The added product regressions were run before source changes:
25 pass, 7 fail and 1 module-load error (the new composer replacement export was absent).
Failures identify V1/V2 UUID delta rejection, Mermaid remount consistency, plain-prompt insertion,
Enter-based capability activation and missing pre-cleanup diagnostics. After porting, the five focused
files passed: 358 pass, 1 skip, 0 fail. The baseline-contract red check separately produced
3 pass, 1 fail before updating the baseline.

Focused command:
`bun test tests/environment.test.ts tests/browser-response-dom.test.ts tests/browser-worker-contract.test.ts tests/composer-insert.test.ts tests/chatgpt-session.test.ts`.

- `pwsh -NoProfile -File tools/dev_check.ps1 -Quick`: exit 0; focused maintenance tests, version
  6.1.13/Bun 1.4.2, typecheck and whitespace pass.
- `bun run test`: exit 0; 1167 pass, 101 skip, 0 fail.
- `bun run scripts/check-upstream-baseline.ts --strict`: exit 0, all four axes current.
- `bun run scripts/check-dependency-freshness.ts --strict` is red for an unrelated reason: launcher
  `motion` 14.13.0 and `electron` 45.3.1 were released past their recorded deferral bounds. That
  re-judgement is tracked separately; this port touches no lockfile or launcher source.
- `git diff --check`: exit 0. The upstream added-line scan finds no zero-width/bidi control
  characters or remote-pipe/permission-bypass command patterns. This is a bounded text scan, not
  proof of general security.

Windows Edge DOM tests are intentionally not run. Offline DOM, mocks and source contracts establish
only local behavior; signed-in UI, MCP and packaged release acceptance remain independent.

## 2026-11-13 launcher dependencies: Electron 45.3.1 adopted, motion re-deferred

| Package | Decision | Reason |
| --- | --- | --- |
| `electron` 45.3.1 | adopt from 45.2.3 | The 2026-11-11 deferral asked for the packaged app:smoke and installer validation, or a security fix that only ships in 45.3.0; both now hold. 45.3.0 backports Chromium/Dawn/V8 fixes (Chromium 156.0.8078.96) and fixes incorrect display of hidden windows on Windows ([notes](https://github.com/electron/electron/releases/tag/v45.3.0)); 45.3.1 stops trusting eMudhra's revoked RSA intermediates ([notes](https://github.com/electron/electron/releases/tag/v45.3.1)). In the 45 line these ship only in 45.3.x. Exact manifest and lock pin move together; only the `electron` lock entry changed. Node stays on major 24. The Electron freshness deferral is removed. |
| `motion` 14.13.0 | defer (bound 14.12.0 -> 14.13.0) | Still a major move from 12.43.0; the packaged animation inspection from 2026-11-04 is still outstanding. |

Evidence (Bun 1.4.2): launcher `bun run test` 427 pass / 0 fail / 1 skip; `bun run package:win` built the unsigned Windows package; `bun run smoke:package` (the same script as root `app:smoke`: silent `/S /currentuser` install within its 120 s limit, then `--launcher-smoke-test`) printed `PACKAGED_LAUNCHER_SMOKE_OK win32/x64`, so the installer step that timed out on 2026-11-04 and with 45.2.2 passed this time. The script then installed over an existing current-user installation; since `88f84f7` it refuses to without explicit consent (see REVIEW).

## 2026-11-13 security: `hono` override 4.13.12 -> 4.13.18

- `bun audit` flagged `hono` <4.13.16 through `@modelcontextprotocol/sdk > @hono/node-server > hono` (GHSA-4m76-xfj5-7975, `mount()` path bypassing middleware scoped inside the mount prefix). Hono published a batch of advisories on 2026-11-12 (also GHSA-46wx-v44x-9hh2, GHSA-4h7h-rv7c-7m2v, GHSA-h7mg-cq63-vhpq, GHSA-3gg2-335m-rxc6). The root override moved to 4.13.18, the newest 4.13 patch; only the `hono` lock entry changed. The project uses only the MCP stdio transport, so the HTTP adapter path stays unused; the pin keeps `bun audit` a working release gate.
- Evidence (Bun 1.4.2): `bun run audit` "No vulnerabilities found"; `scripts/check-dependency-freshness.ts --strict` current.

## 2026-11-14 DOM fixture browser lifecycle

The earlier `browser.close()` diagnosis was too narrow: a Bun test deadline can expire
while Playwright is still waiting for Edge shutdown, after the DOM assertions have
finished. The close promise can subsequently resolve while the next test is running.
Launching and terminating an Edge process in every case charged that variable process
lifecycle to each case's assertion timeout; the multi-scenario rebind case could exhaust
its existing 30-second budget in the same way as the shorter 5-second cases. This does
not establish a Bun or Playwright process-handling defect.

The turn-binding fixture suite now owns one browser through `beforeAll`/`afterAll`,
with separate 15-second limits for launch and shutdown. Each case retains fresh,
isolated contexts and closes all remaining contexts in `finally` before the next case.
The local HTTP fixture also stops its server if context cleanup fails. Existing case
timeouts and product code remain unchanged. Reconsider process reuse if a future
fixture changes browser-level state or requires a different launch configuration.

## 2026-11-16 embedded browser data reset (#985) not ported

Owner-delegated decision (主人授權小瑪). Do not port `ccf1061` (#985) or its lifecycle companion `d935e3c`: clearing cookies, cache, site data and sign-in state is destructive and no user need has been stated. The fork's language work (#984, `ddfb69a`/`e9c9509`) stays deferred under its existing Windows acceptance criteria; that is not a pending owner decision. Reconsider data reset only on an explicit user request, as one Windows-tested reset/lifecycle group, without introducing the session-reminder layer.

## 2026-11-21 dependency rereview

Base: `595857f`. CI run 44868856094 failed in `bun run verify` at `launcher:audit` with
`Invalid or expired audit deferral`; strict freshness also reported four attention rows.

**minimatch (GHSA-g3hv-75wg-m249): deferral removed, nothing re-deferred.** The failure was the
`revisit` date (2026-11-17) of `.github/audit-deferrals.json`, not a live finding. The advisory was
narrowed after the 2026-11-03 review: GitHub (`gh api advisories/GHSA-g3hv-75wg-m249`, updated
2026-11-04) and the npm bulk advisory endpoint both report `>=7.0.0 <11.0.1`, no longer `<11.0.1`.
The three deferred nodes (`@electron/asar/minimatch`, `dir-compare/minimatch`, `glob/minimatch`,
all 3.1.5) and `filelist/minimatch` 5.1.9 are outside that range, and the only node inside the
7-11 line resolves to 11.0.5 through the existing `minimatch@>=7.0.0 <11.0.1` override. Raw
`bun audit --json` in `launcher` prints `{}` with exit 0. With the entry removed,
`bun run launcher:audit` prints `Launcher audit: no vulnerabilities`. No dependency changed for
this. The exception mechanism stays; a new finding fails closed as before.

| Package / reviewed latest | Decision | Evidence and reconsideration condition |
| --- | --- | --- |
| `electron` 45.4.1 | adopt from 45.3.1 | [v45.4.1](https://github.com/electron/electron/releases/tag/v45.4.1) backports fixes from ANGLE, Chromium, Dawn, FFmpeg, PDFium and V8 (Chromium 156.0.8078.100); in the 45 line these ship only here. Exact manifest and lock pin move together; only the `electron` lock entry changed. Bundled Node is 24.22.3, so the Node 24 typings deferral keeps its reason. Package and installer smoke are taken from CI on a clean runner; the local scripted smoke was not run because it refuses to overwrite an existing current-user installation. |
| `motion` 14.14.0 | defer (bound 14.13.0 -> 14.14.0); retain 12.43.0 | A trial install passed launcher `typecheck` and `build:renderer`, then was reverted. The packaged inspection of onboarding/page/toast transitions from 2026-11-04 is still outstanding and no automated gate covers it; running a second launcher on the maintainer host risks the live bridge. Reconsider after that inspection, on a relevant animation/security fix, or newer latest. |
| `playwright-core` 1.65.1 | defer (bound 1.65.0 -> 1.65.1); retain 1.64.1 | Trial lock of 1.65.1: the chromium-bidi compatibility test passes warm (both `lib/cjs` imports resolve from 12.1.0), but a full root suite with Edge DOM fixtures ended 1190 pass / 14 skip / 64 fail / 6 errors under host load, with no same-host 1.64.1 run. Inconclusive, so not adopted. Reconsider after an idle-host DOM fixture comparison of both versions. |
| `@types/bun` 1.4.5 | defer (bound 1.4.4 -> 1.4.5) | Types move with the pinned Bun 1.4.2 runtime. |
| `chromium-bidi` 160.0.8175-0, `@vitejs/plugin-react` 6.3.0, `turndown` 7.2.5 | unchanged | Latest is still inside each recorded bound (160 line; 6.3.0 with peer `vite ^8.0.0`; 7.2.5). |

Not resolved here: `bun run check:upstream` exits 1 because upstream `main` moved from the baseline
`f08d165` to `8e9fac0`, so the Full `tools/dev_check.ps1` gate stops there. Resolved by the
2026-11-22 upstream review below.

## 2026-11-22 upstream review: f08d165..8e9fac0 (v6.1.19, #986-#1004)

Reviewed all nine commits in local `upstream/main`, from
`f08d16509e6a5447a0d0f2943abb172c69705160` (exclusive) through
`8e9fac038dcd998bf23716df2b08379a15854ec9` (inclusive), using commit bodies and complete source/test
deltas. Fetch only; no merge, cherry-pick, upstream write or release action. Four commits are adopted
as independent ports; the fork source stays 6.1.13, installer/updater stays v5.0.6, Bun stays 1.4.2.
The added-line scan finds no eval of remote text, `new Function`, remote-pipe commands, long encoded
blobs, permission-bypass flags or new network endpoints. The only new URLs are upstream issue links,
ChatGPT CDN references in a selector README that the fork does not carry, a comment in a fixture and
the `https://unrelated.example` negative test origin. The `<script>` in the locked-efforts fixture is
local fixture behavior and is not ported. This is a bounded text scan, not proof of general security.

### Commits (oldest first)

| Commit | Decision | Reason and reconsideration condition |
| --- | --- | --- |
| `e309382493b04a6174ec34dccccdbe10696ae62e` retained regressions | adopt (tests only) | Adds the captured #974 Mermaid remount case and fixture, a DOM restored-draft multipart case (#977) and UUID calendar-delta cases before and after compaction (#982). All three fixes were ported on 2026-11-13, so these are retained regressions, not a red/green change; they pass against the existing source. |
| `5f9026ac5c26d4063c1b96300e13e46daa23047a` passkey localStorage quota (#991) | adopt | Values up to the browser's 10 MiB UTF-16 per-origin quota are accepted; aggregate key+value bytes are bounded before session mutation; cookie, name, type and cleanup bounds are unchanged. Reported on macOS, but the validator is platform-neutral and the fork ships passkey import on Windows. Red first: 3 launcher tests failed; green after the port. Reconsider if Chromium changes its DOM storage quota. |
| `6b38797fd8d9cc317140e32822359154bea54f7f` Hono advisories | skip (superseded) | Moves overrides to `@hono/node-server` 2.1.6 and `hono` 4.13.16. The fork already pins 2.1.6 and 4.13.18 (2026-11-13 entries above); adopting would downgrade `hono`. |
| `b5f0e9bf95d68ad3737d84c83604a2f27856fab1` session loss vs invalid expiry | adopt | An unparsable `expires` is now an invalid response (`status: error`) instead of a silent sign-out, and an observed authenticated-to-signed-out transition logs `browser.session_signed_out` with only a fixed reason code; the session payload is never logged. This gives evidence for the deferred Windows session-loss reports (#961/#975/#986). Red first: 2 launcher tests failed; green after the port. |
| `4735c03af4d72642965da4be2643d0c856b773fa` noninteractive image previews (#996) | adopt (adapted) | Windows-reported: an image thumbnail rendered without a preview button was never recognized, the turn timed out, and the generic error was retried, which uploaded the files again. Ported `chatGptAttachmentPreview` into the fork's `src/chatgpt-session.ts` (the fork has no `src/chatgpt-ui/`), limited to image MIME types, a non-inert attachment row and visible elements. Only a preview `TimeoutError` becomes the non-retryable `chatgpt_attachment_unconfirmed` (502) error; abort and page-closed errors propagate unchanged; preview waits are aborted in `finally`; observation disposal rejects pending waits. Red first: a module-load error plus 2 contract failures; green after the port. Reconsider if the composer attachment markup changes. |
| `783181931a60c6cbaba50010e2e78fc9cfd58833` disabled efforts and explicit Instant (#993/#994) | defer | Fails fast when ChatGPT disables every effort option after a usage limit, and verifies GPT-6 Instant before Send. The source spans `model-picker.ts`, which the fork does not have, and the fork's effort selection carries its own Temporary Chat isolation and Luna capability ports; a correct port is a separate adaptation, not a mechanical one. Linux/Plus report, no Windows reproduction. Reconsider on a Windows report of the 70 s "model controls are unavailable" failure, or when the model-picker module split is ported. |
| `9eb7eb7a2ed345ad4c30cfd2abe4fb2455d8feb9` smallest Bigger Context transport | defer | Replaces about 285 lines of browser-worker transport planning with a new `transport-budget.ts` and rewrites usage and token estimation (21 files). It does not apply to the fork's diverged prompt/usage code, changes how much context is sent, and its closed predecessor PR #1001 was not merged. Reconsider as one group with `8e9fac0` and open PR #1003 when upstream stabilizes it, with Windows Bigger Context acceptance (#986 is the related Windows report). |
| `2c986617ac1e64492ba1957ac2496ae4202dfae3` Release v6.1.19 | skip | Upstream version and download links. The fork keeps its own release identity (source 6.1.13, installer v5.0.6). |
| `8e9fac038dcd998bf23716df2b08379a15854ec9` transport fixture timeouts | defer | Raises test timeouts for fixtures introduced by `9eb7eb7`; it has no meaning without that commit. Reconsider with it. |

### Pull requests and issues above the watermarks

| Item | Observed state | Decision | Reason and reconsideration condition |
| --- | --- | --- | --- |
| #986 | open issue, Windows, P1, `needs logs` | defer | Fresh Web turns fail with a missing trusted cwd after toggling Bigger Context. No upstream fix yet; already tracked in the 6.1.18 ROADMAP row. Reconsider on an upstream fix or a Windows reproduction here. |
| #987 | closed issue, duplicate, not planned | no action | Upstream closed it as a duplicate. |
| #988, #989, #990, #992, #998 | API returns 404 | no action | Not visible upstream (never allocated or removed). Recorded so the range has no unexplained gap. |
| #991 | closed issue, fix released | adopt | Fixed by `5f9026a`, ported above. |
| #993 / PR #994 | issue closed (fix released); PR closed unmerged | defer | Fixed upstream by `7831819`, deferred above. |
| PR #995 | closed unmerged, feature | reject | The "browser relay no MCP" feature was not accepted upstream and is outside the fork's scope. |
| #996 | closed issue, Windows, fix released | adopt | Fixed by `4735c03`, ported above. |
| PR #997 | open draft, `UNSTABLE`, head `3b6bb99a96adfc3b61c47ca3e0197b19a2b9c2ef` | defer | Keeps missing compaction handoffs terminal. Draft, unmerged. Reconsider when merged or on a Windows compaction-handoff report. |
| #999 | closed issue | reject | No technical content; asks for off-platform contact. |
| #1000 | open issue, macOS, P1, partial release | defer | macOS Full-harness report without a Windows reproduction. Reconsider on a Windows reproduction. |
| PR #1001 | closed unmerged, head `c1fbce15bccf662874dcc43a18b170795aeea5eb` | no action | Superseded upstream by `9eb7eb7`, deferred above. |
| PR #1002 | open draft, `UNSTABLE`, head `3aad5b6c66150986368e19849b7d77a7ee93db61` | defer | Native2 token-copy error recovery; 16 files, including a new recovery path in the turn broker. Reconsider when merged and the fork has a matching Windows failure. |
| PR #1003 | open draft, `UNSTABLE`, head `26e6483dd87bddd5128845b12afda7ab754bee15` | defer | Account-scoped message-limit recovery built on the `9eb7eb7` transport budget (38 files). Reconsider with `9eb7eb7`. |
| #1004 | open issue, no PR | defer | Codex 0.169 can send a date/timezone-only preamble that the resolver rejects as unauthenticated history. The logic is platform-neutral, so it can reach Windows with that Codex version. No upstream fix exists, and loosening rollout authentication without one is a security-relevant change. The reporter's standalone test was read as data and not run. Reconsider when upstream lands a fix, or when this fork's Windows Codex reaches 0.169 and reproduces it; any port must keep permissions sourced from the matching native `turn_context`. |

Branches: `main@8e9fac0` and unchanged `fix/current-workspace-roots@adabeb16abad149f64546b45e8ef88aa4c917f56`.

### Verification

The focused red/green runs used Bun 1.4.5 from PATH; the canonical gate uses the repo-local Bun 1.4.2.

- Launcher `node --test tests/passkey-login-state.test.cjs tests/browser-host.test.cjs`: with tests only,
  3 fail (passkey) and then 2 fail (session loss); after both ports, 144 pass, 0 fail.
- `bun test tests/browser-worker-contract.test.ts tests/chatgpt-web-harness.test.ts tests/attachment-upload.test.ts`:
  red 2 fail plus 1 module-load error; green 268 pass, 11 skip, 0 fail.
- `bun test tests/browser-response-dom.test.ts tests/composer-insert.test.ts tests/environment.test.ts`
  (retained regressions): 170 pass, 2 skip, 0 fail.
- `tests/fork-contract.test.ts`: red 1 fail after the watermark expectations moved; green after the baseline update.
- `bun run check:upstream` (strict): exit 0, all four axes current.
- `pwsh -NoProfile -File tools/dev_check.ps1` (Bun 1.4.2): fork contract, strict upstream and strict
  dependency freshness pass. The root suite failed three runs on timeouts under host load (about 60 %
  CPU), each time on different 5 s cases (1171-1172 pass, 103 skip, 1-2 fail); none is in a changed
  code path. Each failed case passes alone: `two-part saved chats` takes about 2 s with and without this
  change. The `verify` steps after the root suite were then run separately and all exit 0:
  `launcher:typecheck`, `launcher:test`, `build:renderer`, the runtime bundle, third-party notices and
  `RELOCATABLE_RUNTIME_SMOKE_OK`. No single run passed end to end, so no Full completion summary was written.
- A local Edge DOM run of `tests/attachment-upload.test.ts` (`CHATGPT_DOM_TEST_BROWSER`) is not evidence:
  it times out on this host both before the port (0 pass, 10 fail) and after it (3 pass, 8 fail), the
  browser-lifecycle problem recorded on 2026-11-14. Signed-in UI, MCP and packaged acceptance remain separate.
`f08d165` to `8e9fac0`, so the Full `tools/dev_check.ps1` gate stops there. It is tracked in ROADMAP.

## 2026-11-23 upstream issues #1005-#1006

Fetch and `gh` read only; no merge, cherry-pick, upstream write or release action. Issue bodies and the
attached diagnostics were read as data and nothing in them was run.

| Item | Decision | Reason and reconsideration condition |
| --- | --- | --- |
| #1005 | no action | Does not resolve: `gh issue view`, the issues API and the pulls API all return 404 (deleted, transferred or never public). Treated as absent, not as reviewed. Re-check if it appears. |
| #1006 | open issue, bug, Windows x64, 6.1.19, Free tier | defer (observation) | Reporter cannot send a second message in one Web conversation and gets "Codex ran out of room in the model's context window". That is the symptom family of the deferred `9eb7eb7` transport budget and PR #1003 (account-scoped message limits); no upstream fix or maintainer reply yet, and the report has no fork reproduction. Reconsider together with `9eb7eb7`/#1003, or when this fork reproduces it on Windows. |

Baseline advanced to latest non-PR issue #1006; main, PR #1003 and branches are unchanged.

## 2026-11-22 — Responses listener refuses non-loopback Host headers

Fleet audit found the Responses listener (`startServer`) checked `Origin` on non-GET requests only and never looked at `Host`, so a DNS-rebound page could read GET routes such as `/healthz`. `loopbackHostAllowed` now runs first for every method and returns 403 unless `Host` is `127.0.0.1`, `localhost` or `[::1]` (port optional, but if present it must equal the listening port; the existing raw-socket test sends a port-less `Host: 127.0.0.1`). Callers checked: Codex and the launcher use `http://127.0.0.1:<port>`; the managed tunnel talks to the MCP server, not this listener. Fork-only hardening, not yet in upstream; adopt upstream if it adds an equivalent. The running bridge keeps the old code until restarted (ROADMAP row).

## 2026-11-24 — Push-triggered Actions cut back after GitHub suspended this fork's workflows for usage

GitHub suspended this fork's Actions for excessive usage, as it did AIHOT, OpenMontage and reverse-skill on 2026-11-23. Before re-enabling, push triggers are narrowed the same way (AIHOT commit 713caec). Every push ran CI and CodeQL on `windows-latest`, the most expensive runner class, including pushes that only touched notes.

- `ci.yml`: push (main only) ignores `ROADMAP.md`, `FORK.md`, `NOTICE.md`, `docs/REVIEW.md`, `docs/UPSTREAM.md`, `docs/DECISIONS.md`, `tools/upstream_baseline.json`. `pull_request` is unfiltered so required checks never stick pending; `tests/fork-contract.test.ts` still reads these notes, and every change reaches it through a PR run or the next code push.
- `codeql.yml`: push scans only when `*.ts/tsx/mts/js/mjs/cjs`, `.github/codeql/codeql-config.yml` or the workflow change. `pull_request` and the weekly schedule stay unfiltered.
- `dependency-freshness.yml`, `upstream-check.yml`: already had a `paths` allowlist of their own checker, config and workflow; added `branches: [main]` so pushes to other branches no longer trigger them. Schedules unchanged (monthly, weekly).
- `release.yml`: untouched; the `v*` tag trigger is the release mechanism.
- Revert: remove the marked `paths-ignore` / `paths` / `branches` lines.
- Revisit when: Actions is re-enabled and `gh run list` shows usage still being limited; then reduce the schedule or the push scope further.

## 2026-11-24 Bun pin 1.4.2 -> 1.4.5

The local gate (`tools/dev_check.ps1`) refused to run: the machine's Bun is 1.4.5 (WinGet `Oven-sh.Bun`) and the gate demanded 1.4.2. The only other Bun on the machine is a 1.4.2 copy under `~/.bun-1.4.2`, selected through `PATH` per process in earlier sessions.

Why 1.4.2 was pinned: `git log -S'1.4.2'` shows it in the initial commit (`75ddaa1`), and no reason is recorded anywhere (`docs/DECISIONS.md`, `FORK.md`, `docs/UPSTREAM.md` and `docs/REVIEW.md` only restate it as a fork specification; the `@types/bun` deferral says the types follow the pin). Upstream is on 1.4.0. The one concrete incompatibility on record (`docs/REVIEW.md`, 2026-11-21, Bun 1.4.4) is `check-dependency-freshness.ts` calling `bun outdated --json`: 1.4.2 silently ignored the flag and printed the text table, while 1.4.4 and later reject it (`bun outdated has no --json flag`). That is a checker bug, not a reason to hold the runtime back, so it is fixed (`bun outdated` without flags) and pinned by a test.

| Item | Decision | Evidence and reconsideration condition |
| --- | --- | --- |
| Bun 1.4.2 -> 1.4.5 (`packageManager`, `engines.bun`, `@types/bun`, `tools/dev_check.ps1`, `tools/bootstrap_dev.ps1`, `ci.yml`, `dependency-freshness.yml`, `release.yml` twice, `upstream-check.yml`, `AGENTS.md`, both READMEs, `docs/DEVELOPMENT.md`) | adopt | No recorded reason to stay. `bun install` changed only `@types/bun` and `bun-types` in `bun.lock` (3 lines); launcher `bun install --frozen-lockfile` reports no changes. Release `bun-v1.4.5` is published (not a prerelease) with `bun-windows-x64-baseline.zip`, which `prepare-windows-baseline-bun.ps1` verifies against `SHASUMS256.txt`. Reconsider (pin back) if CI or a packaged smoke shows a Bun 1.4.5 regression. |
| `LICENSES/Bun-1.4.2.md` -> `LICENSES/Bun-1.4.5.md` | adopt | The embedded runtime ships Bun's licence notice. Bun's `LICENSE.md` at `bun-v1.4.5` is 14778 bytes against 5613 at `bun-v1.4.2`: it adds the `bun lint`, `bun fmt` and `bun test` diff ports (typescript-go, ESLint, typescript-eslint, oxlint, Prettier and others). The file is copied from the tag (line endings normalized) and `generate-third-party-notices.ts` reads the new name. |
| `.github/dependency-deferrals.json` `@types/bun` entry | remove | `@types/bun` is at latest (1.4.5); the deferral existed only because the types followed the older pin. |
| `scripts/check-dependency-freshness.ts` | fix | Runs `bun outdated` without `--json` and requires the `bun outdated v1.4.5` header; `tests/dependency-freshness.test.ts` pins both. |
| `scripts/check-version.ts` | harden | It now also fails when the dev-check and bootstrap `$expectedBun`, `upstream-check.yml`, `dependency-freshness.yml`, the freshness checker header, the notices script licence name, `AGENTS.md` or `docs/DEVELOPMENT.md` disagree with `packageManager`. This drift is why the gate could break without any manifest change. |

Scope boundary: the next built installer embeds Bun 1.4.5. The public installer/updater pin stays v5.0.6 and the shipped 6.1.13 runtime is unchanged. The package build and silent-install smoke (`bun run package:win`, `smoke:package`) were not run locally because they refuse to overwrite the existing current-user installation; packaged acceptance comes from CI on a clean runner and from the release process.

## 2026-11-24 upstream review: 8e9fac0..fc701f6 (v6.2.0, #1007-#1010)

Reviewed the three new commits in local `upstream/main` (`8e9fac038dcd998bf23716df2b08379a15854ec9` exclusive through `fc701f6fbcff9fb65f679445389aca0c60410271` inclusive, tag `v6.2.0`), issues #1007 and #1008, PR #1010 and the comments on #1007/#1008. Fetch and read-only `gh` calls only; no merge, cherry-pick, upstream write or release action. Issue bodies and the attached diagnostics were read as data and nothing in them was run. The added-line scan of `src`, `tests` and `scripts` finds no eval of remote text, `new Function`, remote-pipe commands, permission-bypass flags, child-process spawns or new network endpoints; it is a bounded text scan, not proof of general security.

`git apply --check` shows `a3eed96` applies cleanly and `5b1f511` does not: the fork has no `src/chatgpt-ui/model-picker.ts` or `src/adapters/chatgpt-web/transport-budget.ts` (the 6.1.14-6.1.19 module split stays deferred), and `browser-worker.ts`, `model-selection.ts` and two tests have diverged.

| Item | Decision | Reason and reconsideration condition |
| --- | --- | --- |
| `a3eed964ca7e5792f11f59d54acf3d6f21461031` authenticate Codex 0.169 calendar-only initial preamble (#1004) | adopt | The trigger recorded on 2026-11-22 ("upstream lands a fix") is met, and this machine's Codex is `0.171.0-alpha.13`, so the shape can occur here. Applied verbatim (source and tests). A claim is accepted only when it is a single `<current_date>`/`<timezone>` environment message that is deep-equal to a native `response_item` after `task_started` and before this turn's `turn_context`, with a `world_state` carrying the same date and timezone; any other tag (cwd, filesystem, policy) or any other placement still fails closed. Permissions still come from the matching native `turn_context`: the test asserts `cwd`, `writableRoots` and the read-only sandbox from it, and rejects missing or mismatched `world_state`, a preamble after `turn_context`, tampered content and a claim carrying `<cwd>`. Red first: the new test failed with "does not authenticate the historical environment messages" before the source port. A local Codex rollout has the same `task_started` -> environment message -> `world_state` -> `turn_context` order; no real 0.169+ calendar-only run was captured. |
| `5b1f511926eb8d3a71fe5a7e232590de635a6d84` GPT-6.2 Sol and three-family model picker (#1007, P0, cross-platform) | adopt (adapted, GPT-6 and GPT-5.6 only); defer the rest (the 6.2 routes were ported later the same day, see [2026-11-24 GPT-6.2 Sol support](#2026-11-24-gpt-62-sol-support-fork-local-version-6114)) | The reported error is this fork's own message too ("ChatGPT model 6 could not be selected and verified"). With rows `Latest`, `6`, `GPT-5.6 Sol`, the shared GPT-6 selector matched two rows and `selectChatGptModelFamily` refused; the active header also repeats the bare version (`6 6 High`), which the announcement parser read as mode `6 High`. Red first: the upstream November 23 DOM fixture, run against Edge here, failed in the fork with exactly that error. Ported: `familyOption` prefers a named row, then the explicit `6` row, and uses `Latest` only when no explicit row exists (the old picker still works); `parseChatGptModelAnnouncement` collapses an identical repeated bare version (`6 6.1 High` and `6 6` stay unparsed). Version and effort are still verified after selection. Tests: two unit tests in `tests/chatgpt-model-selection.test.ts` and the fixture test in `tests/chatgpt-model-family-browser.test.ts`. Deferred: GPT-6.2 routes, catalog entries and the 6.2 composer limit (they add user-visible models and need the module split), and the three-family locked-effort panel with the `hasConfirmedLockedInstant` family parameter (the fork carries none of the #993 locked-panel code). Verified only against local DOM fixtures; a signed-in ChatGPT picker was not touched (tracked by the ROADMAP row "驗證新版 UI、模型選擇與完整工具連接"). Reconsider the deferred parts with the model-picker module split. |
| `fc701f6fbcff9fb65f679445389aca0c60410271` Release v6.2.0 | skip | Version strings only (four READMEs, two manifests, `scripts/install.sh`, `src/version.ts`). Source stays 6.1.13 and the installer/updater v5.0.6, as in the `860fa57` precedent. |
| #1007 (open issue, P0, cross-platform, v6.1.19 macOS Plus) | adopt, adapted | See `5b1f511`. |
| #1008 (open issue, Windows x64, v6.2.0, Temporary Chat) | defer (observation) | Four turns failed with "no new response activity for 600 seconds"; the reporter says the cause of the missing final answer is unknown, and two #1007 comments describe a v6.2.0 Temporary Chat / Bigger Context regression on macOS that v6.1.19 does not have. This fork carries neither the 6.2.0 code nor the deferred Bigger Context rewrite (`9eb7eb7`, PR #1003), and has no reproduction. Reconsider when upstream names a root cause, or when this fork reproduces the 600 s timeout on Windows. |
| #1009 | no action | Does not resolve through the issues or pulls API (404). Treated as absent, not as reviewed. Re-check if it appears. |
| #1011 (open issue, Windows x64, v6.2.0, GPT-6.2 Sol High; filed 2026-11-24 after this review began) | defer (observation) | Intermittent "final DOM could not be aligned with text already streamed to Codex" near the end of a reply that looks complete in the browser. The reporter has no isolated prompt, no safe-log export and no evidence of the cause; related #974 was a Mermaid-specific fix this fork already ported. The alignment code is model-independent and unchanged by the 6.2 routes, so the 6.2 port neither depends on nor addresses it. Reconsider when upstream names a cause or this fork reproduces it. |
| PR #1010 prefer visible GPT-6 row over hidden named duplicate (open, `unstable`, head `52028cba49d9188ebd989f0b28cdb5bf41f85513`, +43/-0 in `model-picker.ts` and one test) | defer | A hidden unchecked `GPT-6 Sol` row can shadow the visible checked `GPT-6` row. This fork's `familyOption` also tries the named row with `includeHidden: true` first, so it may share the defect, but there is no reproduction without a signed-in picker, the PR targets a file this fork does not have, and its author states the current-main adaptation was not typechecked. Reconsider when merged, or when this fork reproduces a verification failure with a hidden duplicate row. |
| Branches | no action | `main@fc701f6` and unchanged `fix/current-workspace-roots@adabeb16abad149f64546b45e8ef88aa4c917f56`. |

Baseline advanced to `main@fc701f6`, PR #1010 (head `52028cba49d9188ebd989f0b28cdb5bf41f85513`) and non-PR issue #1011 (it was #1008 until #1011 appeared later the same day).

### Verification

Bun 1.4.5 from the WinGet install, the same Bun the gate now requires.

- `tests/environment.test.ts`: red 1 fail with only the upstream tests applied, then 131 pass / 0 fail after the source port.
- `tests/chatgpt-model-selection.test.ts`: red on both new tests before the port, 8 pass / 0 fail after.
- `tests/chatgpt-model-family-browser.test.ts` with `CHATGPT_DOM_TEST_BROWSER` set to Edge: red with the #1007 error, green after. In the same Edge run, `tests/chatgpt-effort-browser.test.ts` "smoke requires positive Luna control evidence" times out at 40 s; it fails identically on the unmodified HEAD (checked with `git stash`), so it is not caused by this change, and it is skipped without that variable, so the gate does not run it.
- `bun run scripts/check-upstream-baseline.ts --strict`: all axes current after the baseline move.

## 2026-11-24 GPT-6.2 Sol support (fork-local version 6.1.14)

The owner's Codex default model is `gpt-6.2-sol` and ChatGPT's web picker moved to GPT-6.2 on 2026-11-23, so the 6.2 part of upstream `5b1f511` that the earlier review deferred is ported now. `5b1f511` does not apply to this tree (no `src/chatgpt-ui/model-picker.ts` or `transport-budget.ts`), so the logic is re-expressed in the fork's own structure instead of copied wholesale. Upstream content was read as data only.

| Item | Decision | Reason and reconsideration condition |
| --- | --- | --- |
| `ChatGptWebModelFamily` gains `"6.2"`; routes `chatgpt-web/gpt-6.2-sol-instant` and `chatgpt-web/gpt-6.2-sol` (`src/chatgpt-web-models.ts`, `src/types.ts`, `src/dev-chat`, helper and worker types) | adopt | The hunks of `5b1f511` for these files apply cleanly and are taken verbatim. The upstream route and catalog tests were applied first and failed (11 failures) before the source change. Efforts: Instant, and Medium/High/Extra High on `gpt-6.2-sol`; no 6.2 Pro route exists upstream either (Pro stays `gpt-6-pro`). |
| Context budgets | adopt | 6.2 shares GPT-6's Bigger Context limits (Plus 120k/110k, Pro 240k/220k) and its Instant has no Bigger Context. Upstream rechecked the 253k/283k boundary on 2026-11-23; this fork re-measured nothing and relies on that capture. Reconsider if a 6.2 recall test on this account contradicts it. |
| Composer limit | adopt | `resolveChatGptWebTransportLimits` takes the family; Pro 6.2 Instant accepts 500,000 characters (upstream measured 500,000 accepted and 545,000 rejected). The fork's browser-worker input and multipart checks, its staging-mode resolver and the prompt compiler now pass the family through. Red first: the Pro Instant test failed with the plumbing removed. Plus accounts use the Plus limits, which are unchanged. |
| Row selection and verification (`model-selection.ts`) | adopt (rewritten) | `6.2` resolves to an explicit `6.2` / `GPT-6.2 Sol` row if one exists, otherwise to `Latest`, then the announced version must read `6.2`. An account whose `Latest` still serves GPT-6 therefore fails closed (`ChatGPT model 6.2 could not be selected and verified`), never silently running another model. GPT-6 and GPT-5.6 resolution is unchanged from the 2026-11-24 #1007 port. Tests: unit and the November 23 Edge DOM fixture (6.2 Instant/High/Extra High, GPT-6, GPT-5.6, plus the older-Latest fail-closed case). The 6.2 explicit-row unit test failed before the change; the fixture cases pass with only the `Latest` fallback, since that path existed already. |
| Catalog priority (`model-catalog.ts`) | adopt | Compatibility V1 keeps at most five spawn-agent overrides. Upstream's list now pins `gpt-6.2-sol-instant` and `gpt-5.6-sol` (the roster becomes native `gpt-5.6-sol`, `gpt-6.2-sol`, `gpt-6-sol`, `gpt-5.6-pro`, `gpt-6-pro`), so `chatgpt-web/gpt-5.6-sol` no longer appears among the overrides. This is a catalog ordering change, not a routing change; GPT-5.6 turns still select and verify as before. |
| Retained conversations | adopt | The family is part of the conversation key, so 6.2 and 6 on the same thread never share a ChatGPT chat (new test). |
| Three-family locked-effort panel (`hasConfirmedLockedInstant` family parameter, `chatGptLockedEffortPanel` six-row limit) | defer | The fork has none of the underlying `7831819` locked-effort recognition (9 files, about 280 lines, a new fixture), so the 6.2 delta has nothing to attach to. It matters only for accounts whose slider is locked to Instant; the owner's account reports Sol available, Pro unavailable and a medium effort setting. Reconsider with `7831819`, or when a locked account hits "controls are unavailable" on 6.2. |
| PR #1010 and #1008 | still deferred | 6.2 does not depend on either. #1010 only concerns a hidden duplicate row; #1008 is an unrelated v6.2.0 response-completion report. |

Naming: the owner's `~/.codex/config.toml` has `model = "gpt-6.2-sol"`, which is the native Codex slug. The Web route is the catalog entry `chatgpt-web/gpt-6.2-sol` (and `chatgpt-web/gpt-6.2-sol-instant`); it appears after the bridge restarts on the new build and Codex refreshes its model catalog. This change does not edit the owner's Codex configuration.

Version: `package.json`, `launcher/package.json` and `src/version.ts` move 6.1.13 -> 6.1.14 so the installer file name differs from the installed one. This is fork-local numbering: it is not upstream 6.1.14, whose other changes remain unadopted, and the installer/updater pin stays v5.0.6.

## 2026-11-25 fork-local detached-turn root cause (#963)

Decision: fix locally in 6.1.15. No upstream contact, push, or adoption. The #963
120 s effort-selection symptom is separate and remains deferred.

Root cause: in a long retained conversation ChatGPT virtualizes old turns and later
remounts history groups that were never in the pre-Send baseline. The previous
binding code treated any unknown user group as "ChatGPT opened another user turn",
and four rounds of special cases (accepted-user anchors, history prefixes, rekeying)
kept finding paths that bound a historical answer or aborted our own turn.

Design (6.1.15, `src/adapters/chatgpt-web/turn-ownership.ts`, two pure functions):

- `ownerOf`: candidates are mounted user groups outside `baseline.initialTurnIdentities`.
  With a prepared turn token the owner is the unique candidate whose rendered message
  carries exactly that token. Without one (browser-only text) it is the accepted key if
  it is a candidate with exactly the submitted text, else the unique exact-text candidate
  that is the last user group. A user key is never proof by itself when a token exists,
  and `acceptedUserIdentity` is only written from this same proof.
- `resolve`: no owner -> WAIT (keep the binding; the existing deadline governs). A user
  group after the owner -> ABORT (a genuine competing turn). Otherwise the answer is
  `group:assistant:<owner key>`; it must not be in the baseline and must be mounted,
  else WAIT. Nothing falls back to an older user, and history before the owner is
  ignored, never expanded.
- Evidence is read by a cheap non-expanding probe, bounded per poll: only the last
  `MAX_PROBED_USERS` (4) non-baseline users after the last mounted baseline user are
  read, so hundreds of remounted history groups cost nothing. First binding and
  detached-answer recovery may additionally expand only the single last non-baseline user
  (per-action timeouts; a group that vanishes mid-expansion means "no proof yet"), and
  that proof is transferred only onto the same node after the cleanup.
- Token-less text is the weaker mode: its candidate must come after the last mounted
  baseline user, and when the baseline had users but none is mounted any more nothing
  anchors the position, so only a previously proven accepted key can own (else WAIT).
- In the group layout first binding has no "any new answer" path: without owner proof it
  WAITs, so a remounted lone answer (or several) is neither bound nor reported as "N new
  turns"; a group without a user bubble (an Activity shell with another key) is not bound.
  The expansion proof is substituted into the real observation, so the token-less baseline
  anchor still applies to it.
- Layout split: a conversation whose turn ids carry no `group:` key at all (the legacy
  `data-turn-id` / `conversation-turn-*` layout, `chatGptUsesGroupTurns`) keeps the original
  behavior unchanged: `chatGptSubmissionEvidence`, `chatGptNewTurnIdentity` first binding and
  `chatGptReboundTurnIdentity` rebinding with the binding's accepted turn set. Virtualization
  remounts of never-seen history only happen with `data-turn-key` groups, so the ownership
  rules apply there only. Any `group:` id (state, baseline or binding) selects the new rules.
- Send acknowledgement (never expands; ChatGPT can swap the just-sent bubble for
  Activity) is `submissionEvidence`: owner proof -> user_turn; a new answer paired with a
  probed candidate user (one of the last four after the last mounted baseline user, not
  conclusively foreign; its tail may be collapsed) -> assistant_turn; running generation ->
  generation_running; any other non-baseline user after the last mounted baseline user ->
  `uncertain` (history above that user, and lone remounted answers, are neither evidence
  nor uncertainty, so they cannot fail a retry or fake an acknowledgement). Acknowledgement ignores `uncertain` and keeps waiting, but
  the compaction retry/reset paths treat it as "possibly sent": they refuse to reset the
  composer or re-attach the prompt, so unproven history can never cause a resend.
  `foreign` is set only when the adapter read complete, uncollapsed content that is
  conclusively not this Send, so readable remounted history does not acknowledge.

Kept from earlier rounds: no history expansion, no resubmission (Send is activated once in
`sendAttachedPrompt`; the binding path never calls it), expansion cleanup bounded by the
10 s connector action timeout that cannot mutate a rebound page, no new total cap on the
multipart acknowledgement path, `reconcileMultipartHistory` unchanged, and failure
diagnostics that carry only counts and booleans (candidates, owner found, token mode,
later users), never text, tokens or identities.

Documented limits: a competing user that cannot be distinguished from our own turn
(a token that never renders, or token-less text identical to remounted history that sits
after the last mounted baseline user) waits until the existing deadline instead of
guessing, and token-less ownership needs a mounted baseline user (else WAIT); in the group
layout owner-less Activity shells with a different key are never bound (acknowledgement
still comes from generation); the legacy layout is deliberately not covered by these rules; a real user turn inserted before our owner is indistinguishable from remounted
history and is ignored, though it cannot select its answer. Token-less browser-only
text is the weaker mode by design.

Local evidence: 21 field failures (14 with zero users at acceptance) match the symptom,
but those files lack the failing predicate and cannot prove one shared cause. Version
numbers follow 56e0e55 (root/launcher manifests, `src/version.ts`, fork docs,
changelog); both lockfiles and the v5.0.6 installer/updater pins are unchanged.
Evidence: [REVIEW](REVIEW.md#2026-11-26-detached-turn-ownership-redesign-fork-6115).

## 2026-11-26 upstream review: fc701f6..065a478 (#1000 attachment names, #1011-#1018)

Reviewed the one new commit in local `upstream/main` (`fc701f6fbcff9fb65f679445389aca0c60410271` exclusive through `065a478e380c75080d2d304db5db46915a160a92` inclusive), PRs #1014, #1017 and #1018, and issues #1011, #1013 and #1015 (issues #1000 and #1008 re-read). Fetch and read-only `gh` calls only; no merge, cherry-pick, upstream write or release action. Issue and PR bodies and attached diagnostics were read as data and nothing in them was run. The commit adds no eval of remote text, `new Function`, remote-pipe commands, permission-bypass flags, child-process spawns or new network endpoints; this is a bounded text read, not proof of general security.

`git apply --check` shows `065a478` does not apply: the fork has no `src/chatgpt-ui/composer.ts`, so the same change was made by hand in `src/chatgpt-session.ts` (where `chatGptAttachmentPreview` lives), `attachment-upload.ts` and the test.

| Item | Decision | Reason and reconsideration condition |
| --- | --- | --- |
| `065a478e380c75080d2d304db5db46915a160a92` match ChatGPT-suffixed attachment preview names (#1000) | adopt (adapted to the fork's module layout) | ChatGPT can rename an attached file to `name(20261124-215438).png`; the exact-name composer preview lookup and the exact upload-stream filter then never match, so attaching fails before send. This is how compaction handoffs fail with `stage=file_attachment` in #1000 (macOS report, but the matcher is platform independent code the fork shares). `chatGptAttachmentNamePattern` accepts the exact name or one parenthesized numeric/timestamp (or ` (1)`) suffix before the extension, and nothing else. Preview lookup also ignores `inert` subtrees; upload observation reports the expected name for a matched renamed one. Red first: with the new tests and without the source change, `tests/attachment-upload.test.ts` fails to load (the exported pattern function is missing); after the port 13 pass / 0 fail, including the Edge DOM test with a renamed image tile next to an adjacent `-10.png` tile that must not match. No real signed-in ChatGPT rename was observed here; the suffix shape comes from upstream's capture. Does not touch turn binding, submission evidence or `turn-ownership.ts`. |
| #1000 (open, macOS, v6.1.18, compaction attachment failure) | partly resolved | The renamed-attachment cause is covered by `065a478`. The report also mentions failures with Bigger Context off and inline transport; any remaining cause is not shown, and the Bigger Context rewrite (`9eb7eb7`, PR #1003) stays deferred. Reconsider when a Windows `stage=file_attachment` failure is captured with a name that the new pattern does not match. |
| PR #1017 and PR #1018 GPT-5.6 Sol row with a localized retirement subtitle (#1013) (both open, competing, unmerged, head of #1018 `eb686c4f5d425486dee83f0f4c87e1b0dc7dbd3a`) | defer | Real and Windows-relevant: ChatGPT adds "Leaving on December 23" under the GPT-5.6 Sol row, so the fork's exact `GPT[-\s]?5\.6\s+Sol` accessible-name lookup (`familyOption` in `model-selection.ts`) may find zero rows and fail with "ChatGPT model 5.6 could not be selected and verified". Two PRs fix it differently (#1018 also adds pt-BR effort labels), neither is merged, both target `model-picker.ts` which the fork lacks, and the live accessibility tree was never captured (the #1017 author says so). A guessed selector would weaken the unique-row check this fork keeps, and the fork's default route is GPT-6.2/GPT-6, not 5.6. Reconsider when one PR merges, or when this fork reproduces the 5.6 failure on Windows; then port the narrow fallback (exact name first, then the row's own label span) with the subtitle fixture. |
| PR #1014 optional ChatGPT Project routing (open) | defer | New user-visible setting, CLI flags and launcher UI touching new-chat creation and compaction fallback; large, unmerged, and no Windows owner requested it. Reconsider when merged and the maintainer wants Project routing. |
| #1011 (open, v6.2.0 Windows) GPT-6.2 Web final answer truncated after final DOM alignment failure | defer (observation) | Reporter cannot say which build failed; this relates to final-answer alignment after streaming, where the fork's `turn-ownership.ts` binding (6.1.15, HEAD) now decides which answer belongs to the turn. No reproduction against 6.1.15. Reconsider when reproduced on the fork after 6.1.15 ships. |
| #1013 (open, v6.2.0 Windows) Browser Smoke fails GPT-5.6 verification | defer | See PR #1017/#1018. |
| #1015 (open, v6.2.0 Windows) direct messages in 6.2.0 chats lose the execution token, "missing cwd" after launcher restart, browser timeouts, "ChatGPT exposed 2 new conversation turns for one submitted message" | defer (observation) | Mostly 6.2.0 code (execution token, trusted-environment recovery) this fork does not carry. The two-new-turns line touches turn binding: the fork's `turn-ownership.ts` design (HEAD, 6.1.15) binds a turn only through this Send's token or the exact-text unique last user, so upstream's `reconcileAssistantTurnBinding` changes were not ported and none were evaluated as a drop-in. Reconsider when the fork reproduces "missing cwd" after a restart or a double-turn abort on Windows with 6.1.15. |
| Branches | no action | `main@065a478` and unchanged `fix/current-workspace-roots@adabeb16abad149f64546b45e8ef88aa4c917f56`. |

Baseline advanced to `main@065a478`, PR #1018 (head `eb686c4f5d425486dee83f0f4c87e1b0dc7dbd3a`) and non-PR issue #1015.

### Dependency freshness (same gate run)

The strict dependency check turned red on the same day for three new in-range launcher releases, unrelated to the upstream commit: `@types/node` 24.19.2 -> 24.19.4, `@types/react` 19.3.0 -> 19.3.3 and Electron 45.4.1 -> 45.5.0. Adopted as in `3c66361` (Electron patch/minor release, exact pin moved; caret floors raised for the two type packages; `launcher/bun.lock` regenerated by `bun update`). The `@types/node` 26.6.10 latest stays deferred: Electron 45.5.0 still bundles Node v24.22.3 (checked with `ELECTRON_RUN_AS_NODE` on the installed binary), so the 24.x typings match the runtime; `.github/dependency-deferrals.json` is renewed to that latest. Packaged-installer smoke (`package:win`, `smoke:package`) was not run locally; the next release build and CI cover it.

### Review follow-up to the `065a478` port

- Name collision: the suffix-tolerant pattern let `a.md` also accept `a(1).md`, so with both files expected an upload event for `a(1).md` was attributed to `a.md` (the other never completed and the wait timed out on a successful upload), and the `a(1).md` tile could satisfy the `a.md` preview. Upload attribution is now exact first, and a renamed variant counts only when exactly one expected name could own it; `chatGptAttachmentNameMatcher` makes the preview lookup exact when another expected name is a variant of this one. Tests: a two-file upload attribution test and a two-file preview test (both red without the fix for attribution), plus pattern edge cases (regex-special name, dotfile, no extension, multi-extension, Unicode).
- Behavior change beyond #1000 (kept deliberately): like upstream, group and button preview tiles now ignore `inert` subtrees (before, only the image-alt branch did), and the button branch matches the accessible name instead of the `aria-label` attribute. Upstream's own renamed-tile test requires this: its fixture puts the renamed `role=button` tile in an inert row that must not count as ready. A direct test covers a normal non-image group tile (counted when live, ignored inside `inert`).
- Packaging with Electron 45.5.0: `bun run package:win` succeeded and produced `launcher/artifacts/codex-web-gpt-6.1.15-win-x64.exe` (unsigned; sha256 `c54c294d12a7acb6b750d0b812c32ba9f231d112c53f67568381f93e8df0bb8a`). `smoke:package` was not run: it silently installs into the current user's real installation (registry key and install directory outside the repository), which this task may not touch; run it on a clean runner or with explicit owner consent.

### Verification

Bun 1.4.5, Edge as `CHATGPT_DOM_TEST_BROWSER`.

- `tests/attachment-upload.test.ts`: red without the source change (missing export), 13 pass / 0 fail after.
- `bun run scripts/check-upstream-baseline.ts --strict`: all axes current after the baseline move.
