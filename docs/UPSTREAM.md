# Upstream tracking

The baseline is reviewed history, not a merge target. At 2026-09-07, upstream
`miuuyy/codex-chatgpt-web` `main` remains `c648c09501bb1b704c7ad5273fb5f5d6b8992dd2`; the latest
open PR is `#347` at `df0224756d639edfa2124ed96c1dad75e05e06df`, the latest non-PR issue is `#348`, and the only upstream branch is `main` at that
SHA. The fork is **Windows-only**: reviews adopt only verified Windows-applicable work.

## Open pull-request decisions

| PR | Head | Decision | Windows applicability and reason | Reconsider when |
| --- | --- | --- | --- | --- |
| [#347](https://github.com/miuuyy/codex-chatgpt-web/pull/347) | `df0224756d639edfa2124ed96c1dad75e05e06df` | adopt | The new head extends the ported current-thread visualization-root rule to the authenticated parent thread; Windows regression coverage accepts only that shape and still rejects unrelated roots. | Codex changes the private visualization-root shape or parent-thread metadata. |
| [#343](https://github.com/miuuyy/codex-chatgpt-web/pull/343) | `96070ea6f8c4a181b624a0f626e174107b5874d4` | defer | Japanese launcher diagnostics are not a verified Windows defect and the PR has no checks. | It gains checks or a Windows-localized diagnostic regression. |
| [#340](https://github.com/miuuyy/codex-chatgpt-web/pull/340) | `ffef4f335c48b521562d4d21c26bb1c89e12f64e` | adopt | Fixes V1 null-agent-path lineage, linked to Windows issue #314; minimal fail-closed compatibility and tests are ported. | Codex changes V1 rollout metadata. |
| [#338](https://github.com/miuuyy/codex-chatgpt-web/pull/338) | `37dbecce686bb19fe8871699e205d43ca0dbe5f8` | defer | No committed regression tests or checks prove the Luna Think behavior. | A tested Windows reproduction and checks are supplied. |
| [#329](https://github.com/miuuyy/codex-chatgpt-web/pull/329) | `c55b5cef7f7a6d1b8c0759d7806a94f06d10ce77` | defer | Localized confirmation handling is potentially Windows-relevant, but the branch has a dirty merge conflict and no checks. | The conflict is resolved and focused tests pass. |

## Open issue decisions

| Issue | Decision | Windows applicability and reason | Reconsider when |
| --- | --- | --- | --- |
| [#348](https://github.com/miuuyy/codex-chatgpt-web/issues/348) | monitor | Windows 10 Full Harness report: TOML rewrite places the interrupt-hook end marker before its start marker; no PR or verified fix exists. | Upstream provides a regression and safe marker-normalization fix. |
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
