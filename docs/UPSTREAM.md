# Upstream tracking

The baseline is reviewed history, not a merge target. A read-only GitHub inventory on 2026-09-07 found
upstream `miuuyy/codex-chatgpt-web` `main` still at `c648c09501bb1b704c7ad5273fb5f5d6b8992dd2`; the
latest PR is open, non-draft [#362](https://github.com/miuuyy/codex-chatgpt-web/pull/362) at
`80ee0e3eac62067c14dd719d702ae1d7c55fdbe5`, the latest non-PR issue is [#359](https://github.com/miuuyy/codex-chatgpt-web/issues/359), and the only upstream branch is `main` at that SHA. The fork is
**Windows-only**: reviews adopt only verified Windows-applicable work.

## Open pull-request decisions

| PR | Head | Decision | Windows applicability and reason | Reconsider when |
| --- | --- | --- | --- | --- |
| [#347](https://github.com/miuuyy/codex-chatgpt-web/pull/347) | `df0224756d639edfa2124ed96c1dad75e05e06df` | adopt | The new head extends the ported current-thread visualization-root rule to the authenticated parent thread; Windows regression coverage accepts only that shape and still rejects unrelated roots. | Codex changes the private visualization-root shape or parent-thread metadata. |
| [#343](https://github.com/miuuyy/codex-chatgpt-web/pull/343) | `96070ea6f8c4a181b624a0f626e174107b5874d4` | defer | Japanese launcher diagnostics are not a verified Windows defect and the PR has no checks. | It gains checks or a Windows-localized diagnostic regression. |
| [#340](https://github.com/miuuyy/codex-chatgpt-web/pull/340) | `ffef4f335c48b521562d4d21c26bb1c89e12f64e` | adopt | Fixes V1 null-agent-path lineage, linked to Windows issue #314; minimal fail-closed compatibility and tests are ported. | Codex changes V1 rollout metadata. |
| [#338](https://github.com/miuuyy/codex-chatgpt-web/pull/338) | `37dbecce686bb19fe8871699e205d43ca0dbe5f8` | defer | No committed regression tests or checks prove the Luna Think behavior. | A tested Windows reproduction and checks are supplied. |
| [#329](https://github.com/miuuyy/codex-chatgpt-web/pull/329) | `c55b5cef7f7a6d1b8c0759d7806a94f06d10ce77` | defer | Localized confirmation handling is potentially Windows-relevant, but the branch has a dirty merge conflict and no checks. | The conflict is resolved and focused tests pass. |

## 2026-09-08 follow-up: #360–#362

The PRs below are open, non-draft, and `UNSTABLE`. None of their branches was merged or fetched; #362's
minimal fix was independently ported and verified in this fork. Author-reported tests alone do not establish
this fork's Windows acceptance.

| PR | Exact observed state / head | Decision | Windows applicability and rationale | Re-review trigger |
| --- | --- | --- | --- | --- |
| [#360](https://github.com/miuuyy/codex-chatgpt-web/pull/360) | open, non-draft, `UNSTABLE`; `a4cd7012150bd76789fc818bd04d55cfa90a2744`; no upstream review or comments | defer | Its opt-in `external-provider` route mode is explicitly an unsupported local-fork patch. This fork has no concrete external-router requirement; its broad setup, launcher, configuration-journal, native-turn, and subagent ownership changes have no bounded Windows compatibility or security acceptance. | A concrete Windows external-router requirement exists; upstream stabilizes and accepts a reviewed implementation without an uncommitted handoff; and a bounded Windows compatibility/security acceptance proves the ownership transfer fails closed for config, journal, native turns, launcher/setup, and subagents. |
| [#361](https://github.com/miuuyy/codex-chatgpt-web/pull/361) | open, non-draft, `UNSTABLE`; `c09aa18b8a2a84e3fa3d77dcd4b339d3575cbbe6` | reject | The Dock/menu-bar-only preference and its prerequisites are explicitly macOS-only, including a fix for macOS issue #286; they are outside this Windows-only fork's supported scope. | The owner authorizes a separately bounded Windows product requirement with a Windows-applicable design and regression evidence. |
| [#362](https://github.com/miuuyy/codex-chatgpt-web/pull/362) | open, non-draft, `UNSTABLE`; `80ee0e3eac62067c14dd719d702ae1d7c55fdbe5` | adopt | Windows v5.0.4 Full-mode compaction can lose its continuation environment when Codex rebuilds one user preamble with sibling parts. The minimal port reads `<environment_context>` per array part, deduplicates identical claims, rejects distinct claims, and keeps bare strings off primary authority paths; continuation-only string claims remain cross-checked with native rollout authority. The three focused regressions pass. | The PR head changes, a Windows Full-mode continuation regression fails, or Codex changes content-part/rollout-authority shape. `contextualUserMessage` joined-text classification is deliberately excluded; it needs a separately bounded vocabulary/ordering review. |

## 2026-09-07 follow-up: #349–#359 complete register

The following live states were read from GitHub before moving the baseline. PR author claims and local
tests are not adoption evidence. Closed/unmerged and draft PRs remain unmerged history; no upstream
write, fetch, merge, or release action was taken.

| Item | Exact observed state / head | Decision | Windows applicability and rationale | Re-review trigger |
| --- | --- | --- | --- | --- |
| [#349](https://github.com/miuuyy/codex-chatgpt-web/pull/349) | closed, unmerged; `f9619efd69bf397fec19edcdec53156762a88c92` | reject | Upstream explicitly declined its 502 `Stopped thinking` taxonomy: that visible state does not distinguish manual Stop from an upstream interruption. Its tests therefore do not establish a Windows fix. | A privacy-safe Windows trace distinguishes the termination source, and a focused no-replay regression proves the resulting classification. |
| [#350](https://github.com/miuuyy/codex-chatgpt-web/issues/350) | closed issue; macOS arm64 setup report | reject | macOS-only connector-creation report is outside public Windows support. | A current Windows reproduction with a bounded local cause. |
| [#351](https://github.com/miuuyy/codex-chatgpt-web/issues/351) | open issue; macOS arm64 reports | reject | The generic stopped-response reports have no Windows reproduction and do not establish a common cause. | A privacy-safe Windows safe-log trace identifies the post-submit failure state without replaying the accepted turn. |
| [#352](https://github.com/miuuyy/codex-chatgpt-web/issues/352) | open issue; no PR | defer | A symlinked `config.toml` can matter on Windows, but only macOS isolated checkpoint evidence exists; a `stat`-only change could replace the link during rollback. | A Windows symlink/junction reproduction plus capture, setup, failure rollback, and removal tests prove both link and target bytes remain intact. |
| [#353](https://github.com/miuuyy/codex-chatgpt-web/issues/353) | open issue; no PR | defer | The report combines a legacy non-`chatgpt-web/*` compact passthrough 404 with a separate non-Pro Web staging-size problem. No bounded Windows fix is supplied. | A Windows regression isolates the legacy fallback and proves an actionable local error or safe local route without bundling a Web size-policy redesign. |
| [#354](https://github.com/miuuyy/codex-chatgpt-web/pull/354) | open draft; `466d682f0a054ed2699c65e86465e81815c141ce` | defer | Uncached loopback-health discovery could help Windows monitoring, but the draft has no Windows/package acceptance and changes deleted Japanese/Simplified README surfaces. | A non-draft, Windows-packaged reproduction proves inventory false-green behavior; then port only the smallest supervisor behavior and regression, retaining Windows-only docs. |
| [#355](https://github.com/miuuyy/codex-chatgpt-web/pull/355) | closed, unmerged draft; `1108fa6298fab765dce6a052b7edc2510c0bad17` | monitor | Upstream declined classification/retry policy because it leaves the viewport geometry/lifecycle cause unaddressed and has no installed Windows acceptance. The no-replay boundary remains valuable. | A Windows trace identifies the failed initial-acquisition or post-submit rebind transition, with an installed-path regression that preserves cancellation and never replays an accepted turn. |
| [#356](https://github.com/miuuyy/codex-chatgpt-web/issues/356) | open issue; no PR | monitor | Claimed Chinese per-call approval labels were not reproduced; contributor tests invented labels and cannot establish the rendered card. | A supported Windows per-call flow (auto-approval off) supplies privacy-safe observed labels/DOM and a regression that keeps one-time and persistent approval distinct. |
| [#357](https://github.com/miuuyy/codex-chatgpt-web/issues/357) | open issue; no PR | defer | It is a Windows Go/Think Full-mode report, but declined PR #338 bypassed ordinary Think enforcement and lacks fresh-versus-retained connector proof. | Reproduce fresh and retained Go/Full Think requests with connector retention and ordinary Luna controls; a candidate must retain explicit model/effort enforcement. |
| [#358](https://github.com/miuuyy/codex-chatgpt-web/issues/358) | open enhancement; no PR | reject | Japanese launcher-diagnostic localization is not a Windows-only public-support commitment; the prior formatter corrupts replacement tokens and changed non-Japanese output. | Owner authorizes Japanese UI support and a bounded implementation preserves dynamic values literally with token, quote, and backslash regressions. |
| [#359](https://github.com/miuuyy/codex-chatgpt-web/issues/359) | open enhancement; no PR | monitor | This is the retained #355 policy idea, not evidence that the viewport defect is fixed. Initial acquisition and post-submit rebind must stay distinct. | The geometry/lifecycle failure is reproduced on Windows and a focused fix proves cancellation plus no replay after `send_activated` and `accepted`. |

## Previously reviewed issue decisions

| Issue | Decision | Windows applicability and reason | Reconsider when |
| --- | --- | --- | --- |
| [#348](https://github.com/miuuyy/codex-chatgpt-web/issues/348) | monitor | Closed Windows 10 Full Harness report: TOML rewrite places the interrupt-hook end marker before its start marker; no PR or verified fix exists. | Upstream provides a regression and safe marker-normalization fix. |
| [#346](https://github.com/miuuyy/codex-chatgpt-web/issues/346) | monitor | Windows/Plus/Full report has no verified new fix. | A reproducible fix or validated regression test appears. |
| [#345](https://github.com/miuuyy/codex-chatgpt-web/issues/345) | defer | Windows/WSL feature requires a security design for path, runtime, and ownership boundaries. | A bounded design and Windows/WSL tests are reviewed. |
| [#344](https://github.com/miuuyy/codex-chatgpt-web/issues/344) | defer | Windows launcher from WSL needs the same explicit cross-environment security design. | A safe design and integration tests exist. |
| [#339](https://github.com/miuuyy/codex-chatgpt-web/issues/339) | reject | macOS-only investigation is outside this fork. | The report becomes Windows-reproducible. |
| [#332](https://github.com/miuuyy/codex-chatgpt-web/issues/332) | defer | Usage-estimate enhancement is not required for Windows-only maintenance. | A verified Windows product need and bounded design appear. |
| [#328](https://github.com/miuuyy/codex-chatgpt-web/issues/328) | monitor | Connector 404 investigation lacks logs and a verified Windows fix. | Privacy-safe evidence and a regression are supplied. |
| [#326](https://github.com/miuuyy/codex-chatgpt-web/issues/326) | reject | Cloudflare Tunnel companion is a new, out-of-scope product surface. | Owner authorizes a separate design. |
| [#323](https://github.com/miuuyy/codex-chatgpt-web/issues/323) | reject | macOS-only Luna stream report is outside this fork. | It becomes Windows-reproducible. |
| [#321](https://github.com/miuuyy/codex-chatgpt-web/issues/321) | monitor | Windows compaction report awaits retest and has no new fix. | Retest fails with safe evidence or a tested fix appears. |
| [#319](https://github.com/miuuyy/codex-chatgpt-web/issues/319) | reject | macOS arm64 report is outside this Windows-only fork. | It becomes Windows-reproducible with a bounded Windows fix. |
| [#314](https://github.com/miuuyy/codex-chatgpt-web/issues/314) | adopt-linked | Windows lineage failure is addressed by adopted PR #340 (`ffef4f335c48b521562d4d21c26bb1c89e12f64e`). | A post-port Windows regression fails. |
| [#312](https://github.com/miuuyy/codex-chatgpt-web/issues/312) | defer | Account-safety investigation needs verified evidence, not speculative automation changes. | A bounded, privacy-safe mitigation is tested. |
| [#308](https://github.com/miuuyy/codex-chatgpt-web/issues/308) | monitor | Windows search freeze awaits retest; no verified new fix exists. | Retest or a regression identifies a Windows fix. |
| [#297](https://github.com/miuuyy/codex-chatgpt-web/issues/297) | defer | Native V2 encrypted delegation is a broad protocol enhancement, not required by current V1 support. | Owner requests V2 work with a tested contract. |
| [#286](https://github.com/miuuyy/codex-chatgpt-web/issues/286) | reject | macOS Dock behavior is outside this fork. | It gains a Windows impact. |
| [#278](https://github.com/miuuyy/codex-chatgpt-web/issues/278) | monitor | Windows hidden-viewport report awaits retest and has no verified new fix. | Retest fails or a focused Windows regression is available. |

```text
GitHub read-only inventory
  ├─ main commit
  ├─ latest pull request
  ├─ latest non-PR issue
  └─ complete branch set
          │
          └─ all current -> pass; unavailable or changed -> attention/fail closed
```

Run `bun run check:upstream` before a maintenance delivery. The checker uses read-only GitHub API
queries; it never fetches, merges, pushes, or writes upstream. `--strict` exits non-zero for changed
or unavailable axes. When it reports attention, review the exact upstream change, record an
adopt/defer/reject decision here and in [DECISIONS.md](DECISIONS.md), then update the baseline only
after relevant validation.
