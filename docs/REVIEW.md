# Review evidence

Review the exact proposed SHA and record evidence for:

- diff and scope: only intended files; no lockfile, product, credential, generated-report, or
  absolute-path changes;
- security and privacy: no browser profile, cookie, token, account claim, or broadened workflow
  permission; canonical gates use only authenticated read-only GitHub and package-registry access,
  never ChatGPT account activity;
- upstream: all four strict baseline axes are current, or the documented decision explains attention;
- dependencies: both workspaces have passing audits and every lagging package is either deferred
  within a declared exact-version or numeric-prefix bound with an honest reason, or surfaced for action;
- verification: focused tests, canonical gate, and `git diff --check` are tied to the reviewed SHA.

Do not claim browser, MCP, account, live-model, or packaged-release acceptance from source tests.

## 2026-10-29 reviewed upstream ledger

Base HEAD: `8e31e86`. Scope: DECISIONS/UPSTREAM review registers, CHANGELOG, ROADMAP,
the four-axis baseline, this evidence note, the baseline literals in fork-contract tests and
the exact-version `chromium-bidi` deferral bound (registry latest moved to 159.0.8131-0 at
2026-10-29T15:45Z; decision unchanged).
The comparison covers 38 commits through `860fa576eb47d9e20d7d8289235bfea94392d2fd` (v6.1.17),
seven PRs and 14 non-PR issues; each decision and re-review condition is in
[DECISIONS.md](DECISIONS.md#2026-10-29-upstream-review-6114-6117-912-934).
No product source, manifest, lockfile, installer pin, workflow permission or account data changes.
The review made no upstream writes; upstream was read through the GitHub API and one local fetch.

Observed verification before the canonical gate:

- System Bun 1.4.4 failed bootstrap's required-version check (exit 1). A repository-local
  official Bun 1.4.2 baseline archive was verified against its release SHA-256 listing;
  only this process's PATH was adjusted, with no system installation change.
- `pwsh -NoProfile -File tools/bootstrap_dev.ps1`: exit 0;
  `BOOTSTRAP PASSED: Bun 1.4.2, both frozen lockfiles, and Electron runtime.`
- Old-ledger `bun run scripts/check-upstream-baseline.ts --strict`: exit 1, all axes attention (later, the `b618281` candidate also failed strict, on the main and branch axes only, once upstream reached `860fa57`).
  The proposed ledger passed that same strict command through UPSTREAM_BASELINE_PATH
  (exit 0, Status current, all four axes current) before tracked promotion.
- Existing-contract red check, `bun test tests/fork-contract.test.ts`, after changing the
  expected ledger but before changing the baseline: exit 1, 3 pass / 1 fail.
- Green check, `bun test tests/fork-contract.test.ts tests/upstream-baseline.test.ts`:
  exit 0, 11 pass / 0 fail, 176 assertions. This is a ledger-contract red/green check,
  not a product-bug regression; no product fix is included.

Full `pwsh -NoProfile -File tools/dev_check.ps1` output is retained locally in ignored
`.maintenance-reports/dev-check.log`; the delivery report records its observed exit and tail.
The gate must recheck live upstream, both workspace freshness/audits, all normal tests,
typechecks, renderer/runtime build, relocatable smoke and whitespace. A changing or
unavailable upstream axis remains a failure, never an assumed pass. This evidence covers
source maintenance only, not signed-in UI, MCP execution or installed-package acceptance.

Canonical gate result: exit 0. Core: 1,077 pass / 92 skip / 0 fail; launcher:
411 pass / 1 skip / 0 fail. Both audits were clean, strict upstream and dependency status
were current, typechecks and renderer/runtime builds passed. Final output:

```text
RELOCATABLE_RUNTIME_SMOKE_OK
DEV CHECK PASSED: Bun 1.4.2, fork contract, strict upstream/dependency checks, verify, and whitespace.
```

The gate was run on the ledger pointing at `860fa576eb47` (v6.1.17), after the earlier
`b618281` ledger went stale when upstream advanced; its counts matched the earlier run. Only
this verification-result text was appended after the gate; final whitespace and scope checks
were repeated. No product behavior changed.

## 2026-11-02 port of 7e6e1a0, 0a8f233, 89f0ead, b6043e0

Base HEAD: `147a062`. Acceptance covers the four ported upstream fixes together with the review
corrections: the six-position slider contract, the real-child ownership-persistence segment, the
Doctor integration no-mutation assertion, stream diagnostics stored as LF, and the corrected
decision register. Both lockfiles are unchanged; the roadmap port row remains open for the
decision-gated and dependent commits.

Observed with Bun 1.4.2 on Windows:

- `pwsh -NoProfile -File tools/bootstrap_dev.ps1`: exit 0; both frozen lockfiles and Electron ready.
- `bun test tests/browser-worker-contract.test.ts -t "effort slider ARIA state"` before the
  correction: exit 1, 0 pass / 1 fail; the old max=5 rejection received a valid slider state.
- Real-child red check: temporarily substituted only `launcher/electron/runtime-supervisor.cjs`
  with its HEAD bytes, ran `node --test --test-name-pattern="starts, health-checks, drains, and
  stops its daemon" launcher/tests/runtime-supervisor.test.cjs`, and restored the exact saved
  worktree bytes in a finally block. Exit 1: expected null daemon, received a live ChildProcess.
  With the ported implementation the same test passed: exit 0, 1 pass / 0 fail; the later full
  launcher test run also exercised the restored implementation and the child exit assertion.
- Set `CHATGPT_DOM_TEST_BROWSER` to the installed Microsoft Edge executable for the offline
  fixture run: `bun test tests/browser-turn-binding.test.ts tests/chatgpt-model-family-browser.test.ts
  tests/browser-worker-contract.test.ts tests/doctor-compaction.test.ts tests/stream-diagnostics.test.ts`.
  Exit 0, 187 pass / 0 fail / 0 skip, 1,119 assertions. This actually executed the new explicit-picker
  and rendered-token DOM cases. No historical red result is claimed for those DOM cases.
- `bun run test`: exit 0, 1,094 pass / 98 skip / 0 fail, 8,854 assertions
  (1,192 tests across 88 files, 150.57 seconds). DOM fixtures gated by the unset environment
  variable are skipped here; their separate Edge run above provides execution evidence.
- `bun run launcher:test`: exit 0, 415 pass / 1 skip / 0 fail (416 tests).
- `pwsh -NoProfile -File tools/dev_check.ps1 -Quick`: exit 0, 16 pass / 0 fail;
  `VERSION_SYNC_OK 6.1.13 bun@1.4.2`, typecheck and whitespace passed;
  `QUICK CHECK PASSED: Bun 1.4.2, focused fork tests, version, typecheck, and whitespace.`
- `pwsh -NoProfile -File tools/dev_check.ps1`: exit 1 at the strict upstream gate:
  `Upstream check requires attention: attention.` Observed PR #955, issue #956 and the additional
  `fix/current-workspace-roots` branch exceed the reviewed ledger. The gate stopped before
  dependency freshness/audits and verify, so this run makes no new minimatch audit claim and
  provides no Full completion evidence. These pre-existing maintenance items are outside this fix.

Local logs are ignored under `.maintenance-reports/fix-*.log`; a final worktree fingerprint is
retained there for the uncommitted inputs. Source/fixture tests do not prove signed-in ChatGPT,
MCP, model-service behavior or packaged-release acceptance.

## 2026-11-03 launcher minimatch security maintenance

Base HEAD: `1bbf072d0c913549fa2dea3d593cbd2cd25450ff`. Scope: launcher manifest/lockfile,
version-scoped minimatch override, advisory-specific audit policy and checker, freshness integration,
regressions and maintenance documentation. The root lockfile, product versions, installer pins,
Electron version and workflow permissions are unchanged. The required launcher lockfile delta is
limited to the scoped override, patched minimatch and its dependency graph (Bun lock format 3).

Observed with Bun 1.4.2 on Windows:

- Raw `bun run launcher:audit` before the fix: exit 1, GHSA-g3hv-75wg-m249 reported
  minimatch 10.2.6, 3.1.5, 9.0.9 and 5.1.9; dependency parents were confirmed from `bun pm why`
  and the lockfile.
- Red regression: `node --test launcher/tests/minimatch-compatibility.test.cjs`, exit 1,
  1 pass / 1 fail. Legacy archive/filter behavior passed; modern consumers failed the missing
  reviewed override assertion. No changing package version is hardcoded in the assertions.
- Same regression after override/install: exit 0, 2 pass / 0 fail. Real ASAR creation/extraction
  (with unpack pattern), FileMatcher, filelist, glob and dir-compare were exercised.
- A regular Bun install left old nested minimatch artifacts in this existing node_modules tree;
  the consumer regression detected them. `bun install --cwd launcher --force --frozen-lockfile`
  refreshed the installed tree (exit 0); this step does not modify the generated lockfile.
- `pwsh -NoProfile -File tools/bootstrap_dev.ps1`: exit 0;
  `BOOTSTRAP PASSED: Bun 1.4.2, both frozen lockfiles, and Electron runtime.`
- `bun run launcher:audit`: exit 0; explicitly reports the three deferred legacy lock nodes,
  revisit 2026-11-17, and ends `LAUNCHER_AUDIT_OK`. Raw Bun audit is still executed; remaining
  findings are accepted only through the checked policy, not reported as zero vulnerabilities.
- `bun test tests/launcher-audit.test.ts tests/dependency-freshness.test.ts`: exit 0,
  11 pass / 0 fail, 53 assertions. Covers expiry, future/malformed/duplicate policies,
  unknown advisories, changed range/severity/nodes/versions, process/parse errors and honest
  `deferred` reporting in freshness.
- `pwsh -NoProfile -File tools/dev_check.ps1 -Quick`: exit 0, 18 pass / 0 fail, 201 assertions;
  `VERSION_SYNC_OK 6.1.13 bun@1.4.2`; ends
  `QUICK CHECK PASSED: Bun 1.4.2, focused fork tests, version, typecheck, and whitespace.`
- `pwsh -NoProfile -File tools/dev_check.ps1`: exit 1 at strict upstream tracking;
  `Upstream check requires attention: attention.` Observed PR #958, issue #957 and branch
  `fix/current-workspace-roots` exceed the reviewed ledger. This is outside minimatch maintenance;
  the gate stopped before freshness/verify and produced no Full completion evidence.
- Independent `bun run check:dependencies`: exit 1, `Dependency freshness requires attention: attention.`
  Existing exact latest bounds are exceeded by chromium-bidi 159.0.8138-0, motion 14.9.0,
  @vitejs/plugin-react 6.2.1 and Electron 45.2.1. Root audit is clean; launcher audit is explicitly
  `deferred`. No unrelated deferral bounds were silently renewed.
- The `bun run verify` test stages passed: root 1,100 pass / 98 skip / 0 fail,
  8,889 assertions (1,198 tests across 89 files); launcher 417 pass / 1 skip / 0 fail
  (418 tests). Both typechecks, renderer/runtime builds and third-party notices generation passed.
  The final Quick and focused runs also cover freshness's explicit deferred-status presentation.
- `bun run verify`: exit 0, ending `RELOCATABLE_RUNTIME_SMOKE_OK`. This includes relocated
  runtime startup, HTTP/lifecycle checks and graceful shutdown, without browser/account activity.

Ignored local logs use `.maintenance-reports/minimatch-*.log`. This work makes no signed-in UI,
MCP, live-model or Windows installer acceptance claim. The new roadmap follow-up is a plan for
re-review; the original unrelated port row stays open, and the completed security fix had no row
to remove. The audit checker reads the revisit deadline directly from the policy file.

## 2026-11-03 dependency rereview

Base HEAD: `545cd44a5159a83878182fe7a7ee9e58426dea82`. Scope: Electron launcher pin/lock,
exact freshness policy, the Playwright/BiDi import regression, CHANGELOG, DECISIONS and ROADMAP.
Root manifest/lockfile, Bun 1.4.2, app version 6.1.13, public installer pin v5.0.6 and the
minimatch security exception/deadline are unchanged. Decisions and re-review conditions:
[DECISIONS.md](DECISIONS.md#2026-11-03-dependency-rereview).

Observed on Windows x64 with Bun 1.4.2:

- `pwsh -NoProfile -File tools/bootstrap_dev.ps1`: exit 0;
  `BOOTSTRAP PASSED: Bun 1.4.2, both frozen lockfiles, and Electron runtime.`
  The installed Electron executable independently reports Electron 45.2.1, Node 24.22.1,
  Chromium 156.0.8078.75. Node 24 typings remain appropriate.
- `bun run check:dependencies` before changes: exit 1, four attention rows.
  After adoption/deferrals: exit 0, `Status: **current**`, no attention rows.
  Root audit is clean; launcher audit is explicitly `deferred` for three exact minimatch
  nodes under GHSA-g3hv-75wg-m249, with the existing 2026-11-17 deadline. This is not zero
  vulnerabilities. The verify run independently passed both audit commands.
- Red: trial-install chromium-bidi latest, then
  `bun test tests/chromium-bidi-compatibility.test.ts`: exit 1, 0 pass / 1 fail;
  `Cannot find module 'chromium-bidi/lib/cjs/bidiMapper/BidiMapper'`.
  Green: restore the original chromium-bidi dependency, then the same command: exit 0,
  1 pass / 0 fail, 3 assertions. No dependency version is hardcoded in the test.
  This guards a rejected upgrade's import compatibility; no product bug fix is claimed.
- `pwsh -NoProfile -File tools/dev_check.ps1`: exit 1. The focused contracts passed
  (18 pass / 0 fail), then strict upstream tracking reported
  `Upstream check requires attention: attention.` PR #958, issue #957, changed latest PR head
  and the extra `fix/current-workspace-roots` branch exceed the reviewed ledger. Main is current.
  This existing upstream-review requirement is outside dependency maintenance; the gate stops
  before freshness/verify and produces no successful Full completion record.
- Independent `bun run verify`: exit 0; root 1,101 pass / 98 skip / 0 fail, 8,892 assertions
  (1,199 tests across 90 files); launcher 417 pass / 1 skip / 0 fail (418 tests).
  Both typechecks, renderer/runtime builds and notices generation passed. Final output:
  `RELOCATABLE_RUNTIME_SMOKE_OK`.
- `bun run app:package`: exit 0; NSIS installer and blockmap built with Electron 45.2.1.
  Installer `codex-web-gpt-6.1.13-win-x64.exe` SHA-256:
  `e5b5e6a5cc83741d8c780c09b887c4b1daa34cd14b1f8418ab24f412b6b3930b`.
- First `bun run app:smoke`: exit 1, installer `/S /currentuser` timed out at 120 seconds
  (`ETIMEDOUT`) while verify was also running. No installation registry entry existed afterward.
  One isolated repeat of the same command, after verify completed, exited 0:
  `PACKAGED_LAUNCHER_SMOKE_OK win32/x64`. Timeouts were not increased. Resource contention is
  a hypothesis, not a confirmed cause. No third attempt was made.
- `git diff --check`: exit 0. Final relative-path input hashes and base SHA are retained in
  ignored `.maintenance-reports/dependency-worktree.json`; command logs share the
  `.maintenance-reports/dependency-` prefix.

The package smoke uses the existing current-user NSIS install path and leaves the installed
6.1.13 launcher in place; application/Codex/core data paths for the smoke are isolated and
cleaned by the runbook script. The smoke verifies packaged startup and the durable runtime,
not account login, ChatGPT/MCP/model calls, animation inspection or signed release acceptance.
Motion's visual condition remains deferred; the recurring roadmap row remains a future plan.

## 2026-11-03 navigation details and dependency version-line bounds

Base HEAD: `da1513e5d0625d0e052a1fc491a4d4d0163f10c0`. Scope: the two navigation guards,
their event fixtures and regressions, dependency-bound validation/matching and its tests,
the chromium-bidi 159-line deferral, maintenance guidance, changelog and roadmap.
Electron 45's installed declarations expose `details.url` and `details.isMainFrame` for both
`will-navigate` and `will-redirect`; the guards no longer depend on deprecated positional fields.
Renderer tests execute the registered handlers with the real destination policy in both development
and packaged modes. Turn tests check main-frame authentication interception and subframe exclusion.
These are offline event fixtures, not browser, account, MCP or packaged-release acceptance.

Dependency entries declare exactly one of `latest` (unchanged exact equality) or `latestPrefix`
(whole numeric components, one to three). Only chromium-bidi changes to a version-line bound;
the existing Playwright layout rationale and re-review conditions remain in the policy. Tests use
synthetic versions to cover prereleases, build metadata, prefix collisions, crossing boundaries,
workspace/package isolation and rejected malformed/ambiguous bounds. The two finished roadmap
rows contain no unique revisit date; the separate minimatch deadline and recurring review row remain.

Observed with Bun 1.4.2 on Windows; logs use the ignored `.maintenance-reports/roadmap-` prefix:

- `bun test tests/dependency-freshness.test.ts`: before implementation, exit 1,
  7 pass / 2 fail (prefix-only entry rejected; ambiguous bounds accepted). After implementation,
  exit 0, 9 pass / 0 fail, 69 assertions.
- `node --test --test-name-pattern="guards read details" launcher/tests/browser-host.test.cjs
  launcher/tests/renderer-wiring.test.cjs`: before implementation, exit 1, 0 pass / 2 fail;
  main-frame authentication was not blocked and the allowed renderer destination was blocked.
- `node --test --test-name-pattern="guards read details|a turn sign-in redirect"
  launcher/tests/browser-host.test.cjs launcher/tests/renderer-wiring.test.cjs`: after implementation,
  exit 0, 3 pass / 0 fail. This also verifies the existing sign-out/session-probe behavior.
- `pwsh -NoProfile -File tools/bootstrap_dev.ps1`: exit 0;
  `BOOTSTRAP PASSED: Bun 1.4.2, both frozen lockfiles, and Electron runtime.`
- `pwsh -NoProfile -File tools/dev_check.ps1`: exit 1 after 20 focused tests passed;
  `Command failed (1): bun run scripts/check-upstream-baseline.ts --strict`.
  Main is current; PR #958, issue #957, the latest PR head and additional
  `fix/current-workspace-roots` branch exceed the reviewed ledger. The gate stops before
  freshness/verify and does not produce a successful Full completion record. Reviewing those
  upstream changes is outside the two roadmap items; the baseline is unchanged.
- Independent `bun run check:dependencies`: exit 0, `Status: **current**`;
  root audit clean, launcher audit explicitly deferred under the existing exact-node minimatch
  exception (`revisit` 2026-11-17). The chromium-bidi 159-line latest is deferred.
- Independent `bun run verify`: exit 0; root 1,103 pass / 98 skip / 0 fail
  (1,201 tests across 90 files); launcher 419 pass / 1 skip / 0 fail (420 tests).
  Both typechecks, renderer/runtime builds and notices generation passed. Final output:
  `RELOCATABLE_RUNTIME_SMOKE_OK`.
- `git diff --check`: exit 0. Both lockfiles are unchanged; modified files retain LF.
  Only verification-result documentation was appended after the gates; final whitespace and scope
  checks were repeated. Final input hashes and base SHA are retained in ignored
  `.maintenance-reports/roadmap-worktree.json`.

## 2026-11-03 delivery compaction and delayed finals

Base HEAD: `e27d403c7886ec85901c9836a02c25b4b3ac37a8`. Scope: shared browser worker,
adapter retry classification, prompt compaction/diagnostics, helper forwarding, their regressions,
CHANGELOG, troubleshooting, DECISIONS and ROADMAP. All three reviewed upstream fixes apply to
Windows. Model/effort rules, Windows path handling, both lockfiles, source version, Bun pin and
public installer pin are unchanged. The remaining port row stays open for the other deferred groups;
no unique revisit deadline is removed. ROADMAP's existing dependency-review plan covers freshness
outside declared bounds, including a latest version below a numeric prefix.

Observed on Windows with Bun 1.4.2 (command logs under ignored `.maintenance-reports/ports-`):

- Initial bootstrap exited 1 because the default executable was Bun 1.4.4. The official Bun 1.4.2
  Windows archive was extracted under the ignored report directory and prepended to the process
  PATH only. `pwsh -NoProfile -File tools/bootstrap_dev.ps1` then exited 0, ending
  `BOOTSTRAP PASSED: Bun 1.4.2, both frozen lockfiles, and Electron runtime.`
- Before source changes, the following regression command exited 1 (289 pass / 4 skip / 21 fail):
  `bun test tests/browser-live-progress.test.ts tests/browser-worker-contract.test.ts
  tests/chatgpt-web-usage.test.ts tests/launcher-helper-client.test.ts
  tests/multipart-compaction.test.ts tests/chatgpt-web-harness.test.ts`.
  Failures include the 125-second delayed final, premature idle verdict, missing diagnostics/helper
  forwarding, over-ceiling compaction and the pending-result retry guard.
- Added the duplicate-result case before retry-source changes:
  `bun test tests/chatgpt-web-harness.test.ts --test-name-pattern 'delivery timeout retries'`
  exited 1 (2 pass / 2 fail), rejecting the old pending/duplicate-result retry behavior.
- Initial source integration exposed an unported upstream serializer reference (309 pass / 4 skip /
  2 fail). Diagnostic counting was adapted to this fork's actual serializer; the unrelated rendering
  and compaction-continuation deferrals were not imported.
- `bun test tests/multipart-compaction-boundary.test.ts` with only the compaction-ceiling patch
  temporarily reversed exited 1 (0 pass / 2 fail); exact equality failed to trim. The original
  working bytes were restored in a `finally` block. Then
  `bun test tests/multipart-compaction-boundary.test.ts tests/multipart-compaction.test.ts
  tests/chatgpt-web-usage.test.ts` exited 0 (29 pass / 0 fail, 219 assertions). Boundary probes isolate
  tokenizer granularity; integration cases use actual serialized messages, attachments and token
  estimates. No dependency version is pinned in a test assertion.
- Offline Edge fixtures use `CHATGPT_DOM_TEST_BROWSER`: `bun test tests/delivery-timeout.test.ts`
  first passed the visible bound-alert exclusions (1 pass) but failed the ACK case (1 fail) after
  repeated `setContent` on one page yielded an absent snapshot. One diagnostic repeat reproduced it;
  the underlying observer failure was not established. Each ACK variant now owns a fresh page,
  and that isolated fixture passes; no product timeout
  was increased. `bun test tests/delivery-timeout.test.ts --test-name-pattern 'damaged staging'`
  against the original ACK error code/retryability exited 1, then the restored fix exited 0
  (1 pass / 0 fail, 11 assertions). Exact, truncated and wrong-context ACKs are exercised.
- `pwsh -NoProfile -File tools/dev_check.ps1`: exit 1 at strict upstream tracking, after focused
  contracts passed. Main remains at the reviewed SHA; PR #959, issue #957, the latest PR head and
  additional `fix/current-workspace-roots` branch exceed the ledger. Tail:
  `Command failed (1): bun run scripts/check-upstream-baseline.ts --strict`.
  No successful Full completion evidence is produced; the upstream ledger is unchanged.
- `npm run check:dependencies`: exit 1, `Dependency freshness requires attention: attention.`
  Registry latest chromium-bidi is `157.0.8103-39`, outside the declared `159` prefix. Root audit is
  clean; launcher audit is explicitly deferred for three exact minimatch nodes through 2026-11-17.
  This is neither zero vulnerabilities nor an automatic renewal of the dependency bound.

- Independent `bun run verify`: exit 0. Core: 1,131 pass / 100 skip / 0 fail, 9,189 assertions
  (1,231 tests across 93 files). Launcher: 419 pass / 1 skip / 0 fail (420 tests). Both typechecks,
  renderer/runtime builds and notices generation passed. Tail: `RELOCATABLE_RUNTIME_SMOKE_OK`.
  This final suite covers all updated non-DOM regression files, including pending/duplicate native
  results, delayed finals and context diagnostics. Environment-gated browser tests are accounted
  for separately above; skips are not claimed as runtime acceptance.
- `git diff --check`: exit 0, no output. The accumulated diff was self-reviewed; original line
  endings, both lockfiles and empty index are confirmed. Only verification-result documentation
  was added after verify; final whitespace and scope were checked again. Final relative-path
  input hashes, HEAD and command outcomes are retained in ignored
  `.maintenance-reports/ports-worktree.json`.

These tests do not establish signed-in ChatGPT, MCP service, live-model, or packaged-release
acceptance. Those remain subject to the existing TEST_PLAN and release runbooks. MCP ABI,
Temporary Chat defaults and the Full Access workspace group still require their original decisions.

## 2026-11-03 external gate changes

Base HEAD: `ece4d7c38c901d19da3bd737a290e4a63a7e30a9`. Scope: the exact chromium-bidi
latest deferral, four-axis upstream ledger, independent #952 JSON and #953 busy-status ports,
their regression tests and maintenance documentation. The [dependency decision](DECISIONS.md#2026-11-03-dependency-rereview)
and [per-item upstream register](DECISIONS.md#2026-11-03-upstream-review-935959-and-current-workspace-roots)
record package evidence, exact upstream heads, fork file/line evidence and reconsideration conditions.
Original author of the #952 and #953 ports: r83bksga8fc3 (upstream PRs #952, #953).

Read-only registry revalidation confirmed latest `157.0.8103-39`, published after the checked
159 release. `npm view chromium-bidi time --json` and `versions --json` still list 159;
exact metadata for both checked releases has no deprecated field, and time has no unpublished
record. `npm pack chromium-bidi@157.0.8103-39 --dry-run --json` lists 310 files and the
`out/Default/gen/src/bidiMapper/BidiMapper.js` mapper, with zero required `lib/cjs/bidiMapper`
or `lib/cjs/cdp` paths. This supports the exact deferral, not a claim about why the tag moved.
Read-only GitHub revalidation inspected #957's follow-up, #959's patch and both workspace-branch
commits. Workspace authority and the coupled account-tier/composer changes remain deferred;
the branch's Vite 6.4.5 lock node is already present. No upstream writes were made.

Observed Windows verification (logs under ignored `.maintenance-reports/resume-`):

- System Bun 1.4.4: `pwsh -NoProfile -File tools/bootstrap_dev.ps1` and
  `pwsh -NoProfile -File tools/dev_check.ps1` each exit 1,
  `Bun 1.4.2 is required; found '1.4.4'.` `bun run verify` exits 1 at check-version,
  `Expected Bun 1.4.2, received 1.4.4`; subsequent verify steps are not executed by that command.
  `npm run check:dependencies` exits 1 with `Status: **check-failure**`: both workspaces report
  `bun outdated has no --json flag`. This is a runtime/checker incompatibility, not evidence
  that a dependency is outdated or vulnerable. The packageManager/engines pins remain unchanged.
- The existing repo-local official Bun 1.4.2 executable was selected only through the verification
  process PATH; the system installation was unchanged. With that executable,
  `pwsh -NoProfile -File tools/bootstrap_dev.ps1` exits 0,
  `BOOTSTRAP PASSED: Bun 1.4.2, both frozen lockfiles, and Electron runtime.`
- Red: with only `src/adapters/chatgpt-web/markdown.ts` and `browser-worker.ts` temporarily
  replaced by HEAD bytes, `bun test tests/chatgpt-web-markdown.test.ts tests/browser-response-dom.test.ts`
  exits 1, 46 pass / 7 fail. Failures cover strict JSON parsing, observed paragraph layout,
  lexical spelling, line breaks, streaming rewrite protection and busy accessibility announcements.
  The working source bytes were restored in a `finally` block and checked byte-for-byte.
- Green: `bun test tests/chatgpt-web-markdown.test.ts tests/browser-response-dom.test.ts
  tests/chromium-bidi-compatibility.test.ts` exits 0, 54 pass / 0 fail, 744 assertions.
  The busy-status case executes the production page callback using an offline DOM fixture;
  it requires no browser/account and retains real reasoning, commentary and final text.
  Compatibility assertions test installed import/layout properties, not a dependency version.

Source and installer versions, Windows packaging, model/effort rules, both lockfiles and the empty
index are preserved. These checks do not establish signed-in ChatGPT, MCP, live-model or packaged
release acceptance. The original roadmap port row and conditional re-review plans remain because
their separate acceptance conditions still apply; these external gate changes were not roadmap rows.

With Bun 1.4.2, `pwsh -NoProfile -File tools/dev_check.ps1` exits 0. The gate executes
the following checks sequentially and aborts on any nonzero child exit; each listed step exited 0:

| Command / gate step | Result / ending output |
| --- | --- |
| `bun test tests/fork-contract.test.ts tests/upstream-baseline.test.ts tests/dependency-freshness.test.ts` | 20 pass / 0 fail |
| `bun run scripts/check-upstream-baseline.ts --strict` | `Status: **current**`, all four axes current |
| `bun run scripts/check-dependency-freshness.ts --strict` | `Status: **current**`; exact chromium-bidi latest deferred; root audit clean, launcher security exceptions explicitly deferred |
| `bun run check-version` | Pinned Bun/source/release version contract passed |
| `bun run audit` | Root audit clean |
| `bun run launcher:audit` | Three exact minimatch nodes deferred under the existing exception, `revisit` 2026-11-17; not zero vulnerabilities |
| `bun run typecheck` | `tsc --noEmit`, no errors |
| `bun run test` | 1,140 pass / 100 skip / 0 fail; 1,240 tests across 93 files |
| `bun run launcher:typecheck` | `tsc --noEmit`, no errors |
| `bun run launcher:test` | 419 pass / 1 skip / 0 fail; 420 tests |
| `bun run --cwd launcher build:renderer` | Vite production build passed, 442 modules transformed |
| `bun run scripts/build-runtime-bundle.ts <scratch-runtime>` | Relocatable runtime built |
| `bun run scripts/generate-third-party-notices.ts <scratch-notices> --include-launcher` | Notices generated for 111 runtime packages |
| `bun run scripts/smoke-release.ts <scratch-runtime>` | `RELOCATABLE_RUNTIME_SMOKE_OK` |
| `git diff --check`, `git diff --cached --check`, `git show --check --format= HEAD` | No whitespace errors |

The enclosed `bun run verify` therefore exited 0 after all eleven verification steps.
Canonical tail: `DEV CHECK PASSED: Bun 1.4.2, fork contract, strict upstream/dependency checks,
verify, and whitespace.` The Full summary is local maintenance evidence; account/release
acceptance remains separate. No model quota was used.

No repository Markdown-link checker is configured in scripts or workflows. The local
`python .maintenance-reports/resume-check-links.py` checks every newly added Markdown local
target and heading fragment plus chromium-bidi's decision link: exit 0,
`NEW_LOCAL_LINKS: 8 checked, 0 broken`. In particular, both references to this section and
both DECISIONS heading fragments resolve. Verification-result text was added after the Full gate;
final link/whitespace checks and the complete diff review cover those documentation additions.
Relative input hashes and command outcomes are retained in ignored
`.maintenance-reports/resume-worktree.json`.

## 2026-11-03 opt-in Temporary Chat and MCP readiness

Base HEAD: `1be63e57449268b51dec32fd7bf598bceaeb9ea5`. Port `7c7c10e` (#918) with inverse
legacy preference migration, and `a738f04` (#893/#895) with installation/catalog separation.
Original author for both ports: vechen <147659719+miuuyy@users.noreply.github.com>.
The maintainer's dispatch resolves the former decision boundary: reject `ad9a611` default-on;
coordinate `53b6050` with the next installer version and one connector refresh; keep the Full Access
group deferred. See [DECISIONS](DECISIONS.md#2026-11-03-opt-in-temporary-chat-and-mcp-readiness).

Scope includes CLI/setup/provider/worker, both helper IPC paths, launcher runtime reads and state,
settings and Doctor, regressions, CHANGELOG and the English/Traditional Chinese documentation.
Legacy saved-chat false/true becomes Temporary Chat true/false. A stored file with neither key
becomes Temporary Chat: v5.0.6 (`git show v5.0.6:src/chatgpt-session.ts`, the `temporary-chat`
check) always opened Temporary Chat and wrote no chat-mode key, and no 6.x config or launcher-state
writer omits one (`saveConfig` only serializes `defaultConfig` or a parsed config; the state store
writes its full defaults), so absence in an existing file identifies v5.0.6. Only a brand-new
install with no file takes the saved-chat default. Regression tests pin a v5.0.6-shaped config and
state, explicit legacy and current values, and the new-install default in core and launcher.
An explicit new false takes precedence over legacy false. Reads normalize before UI synchronization;
subsequent persistence drops the legacy key. Existing CLI `--saved-chats` remains an alias for
`--ordinary-chats`. Retained Automatic and Zero Risk tabs retire on a privacy-preference change;
Zero Risk does not gain DOM access. Login, account inspection and smoke remain explicitly temporary.

Windows verification used the existing repo-local Bun 1.4.2 through process PATH only. Logs are
under ignored `.maintenance-reports/temporary-`; system Bun was not selected or modified.

- `pwsh -NoProfile -File tools/bootstrap_dev.ps1`: exit 0;
  `BOOTSTRAP PASSED: Bun 1.4.2, both frozen lockfiles, and Electron runtime.`
- Red before production edits: `bun test tests/runtime-layout.test.ts tests/cli.test.ts
  tests/browser-worker-contract.test.ts`: exit 1, 195 pass / 3 fail. Failures are inverse migration,
  missing connector guidance and Doctor catalog result separate from a healthy proxy.
- Red before production edits: `bun test launcher/tests/state.test.cjs
  launcher/tests/renderer-wiring.test.cjs`: exit 1, 40 pass / 2 fail. Legacy state migration is absent;
  installed integration remains blocked by unverified catalog. The behavioral renderer test also
  checks that incomplete installations stay blocked and connecting does not fabricate verification.
- `bun test launcher/tests/runtime-host.test.cjs --test-name-pattern 'runtime snapshots migrate'`:
  exit 1 before launcher snapshot normalization (0 pass / 1 fail).
- `bun test launcher/tests/browser-host.test.cjs --test-name-pattern 'Zero Risk new tabs'`:
  exit 1 against HEAD browser-host bytes; a `finally` block restored and byte-compared working bytes.
  The first runner attempt did not resolve its executable and is not counted as red evidence;
  the corrected absolute executable runner produced the failing test.
- `bun test tests/chatgpt-session.test.ts --test-name-pattern
  'login verification still|account inspection and smoke'`: exit 1 (0 pass / 2 fail) before making
  maintenance chat mode explicit; together with the Zero Risk case, the corrected production code
  passes `bun test tests/chatgpt-session.test.ts launcher/tests/browser-host.test.cjs
  --test-name-pattern 'login verification still|account inspection and smoke|Zero Risk new tabs'`:
  exit 0, 3 pass / 0 fail. No signed-in browser or live model was used.
- Focused green command: `bun test tests/runtime-layout.test.ts tests/cli.test.ts
  tests/browser-worker-contract.test.ts tests/chatgpt-session.test.ts tests/launcher-helper-client.test.ts
  tests/server-predictions.test.ts launcher/tests/state.test.cjs launcher/tests/renderer-wiring.test.cjs
  launcher/tests/localization.test.cjs launcher/tests/runtime-host.test.cjs launcher/tests/browser-host.test.cjs`:
  exit 0, 484 pass / 0 fail. It includes real helper subprocess IPC and transactional runtime rollback.
  The subsequent maintenance regression above adds two cases covered by the independent verify run.
- `pwsh -NoProfile -File tools/dev_check.ps1`: exit 0, `DEV CHECK PASSED: Bun 1.4.2, fork contract,
  strict upstream/dependency checks, verify, and whitespace.` Focused contracts: 22 pass / 0 fail;
  strict upstream tracking: all four axes current; dependency freshness current with chromium-bidi
  `159.0.8140-0` deferred by the version-line list below; core 1,148 pass / 100 skip / 0 fail;
  launcher 423 pass / 1 skip / 0 fail; runtime smoke `RELOCATABLE_RUNTIME_SMOKE_OK`.
  Root audit is clean; launcher retains the three exact minimatch security exceptions through
  2026-11-17.

ROADMAP keeps the remaining conditional ports and independently tracks account acceptance, the
next release's ABI work, dependency re-review and the existing machine-enforced security revisit.
No deadline-tracking row is removed. Source version, public installer pin, Bun pin, both lockfiles,
Windows packaging and model/effort constraints are preserved. These checks do not establish
signed-in ChatGPT, live MCP connector or packaged-release acceptance.

Independent `bun run verify`: exit 0, ending `RELOCATABLE_RUNTIME_SMOKE_OK`.
Core: 1,145 pass / 100 skip / 0 fail (1,245 tests, 9,434 assertions).
Launcher: 423 pass / 1 skip / 0 fail (424 tests). Both typechecks, renderer build (442 modules),
relocatable runtime build and notices for 111 runtime packages passed. Audit retains the existing
explicit minimatch deferral; skips are not live acceptance.

After that suite's source/test inputs were consumed, final review updated the remaining personalization
failure guidance to the new Settings label and strengthened preference fixtures. The isolated old-label
regression (`bun test tests/personalization-connector-preflight.test.ts --test-name-pattern
'absolute personalization deadline always'`) first exits 1 (0 pass / 1 fail).
The final affected-files command (`bun test tests/browser-worker-contract.test.ts
tests/personalization-connector-preflight.test.ts tests/server-predictions.test.ts
tests/chatgpt-session.test.ts tests/cli.test.ts tests/launcher-helper-client.test.ts
launcher/tests/browser-host.test.cjs launcher/tests/runtime-host.test.cjs`) reports 436 pass / 1 fail:
the saved multipart fixture still asserted the old polarity after its input was corrected to saved mode.
Correcting that fixture's assertion preserves the original saved-chat coverage, including unchanged
effort re-proof after a conversation URL appears. Only that failed case is rerun:
`bun test tests/browser-worker-contract.test.ts --test-name-pattern 'two-part saved chats'`
exits 0 (1 pass / 0 fail). `bun test tests/personalization-connector-preflight.test.ts` exits 0
(19 pass / 0 fail, 178 assertions), proving the final wording against production code.
The other 436 affected cases passed against those final production inputs. `bun run typecheck`
also exits 0 after the final fixture changes. The independent verify result above binds its earlier
inputs; these focused results cover the later wording and test refinements without repeating the
unchanged full suite or runtime smoke.

Final whitespace, original tracked-file line endings, local Markdown targets/fragments, empty index,
unchanged HEAD and both lockfiles were checked. Complete relative input hashes and command outcomes
are retained in ignored `.maintenance-reports/temporary-worktree.json`.

### Upgrade privacy: configurations with no chat-mode key

The only public release, v5.0.6, always opens `?temporary-chat=true`
(`git show v5.0.6:src/chatgpt-session.ts:169`) and its version 3 configuration has no chat-mode
key. Reading a missing key as saved chats would silently move an upgrading v5.0.6 user to ChatGPT
history. Writer audit: `saveConfig` is the only configuration writer; it serializes either
`defaultConfig()` or a `parseConfig()` result, and both always contain the key (tags `v6.0.0` through
`v6.1.13`, the adopted lineage, carry `useSavedChats` in both; upstream `v6.1.14` onward removed Temporary
Chat and writes neither key, which this fork has deferred and which would also map to the private
direction). The launcher state store writes its full defaults on every `update()`, which include the
key. So a stored file without either key is a v5.0.6 file, and the version field (3 for config, 1 for
state in both generations) cannot distinguish the generations.
`parseConfig`, `migrateChatPreferences` and the launcher state reader therefore map "stored, neither
key" to Temporary Chat, while `defaultConfig()` and a missing state file stay on saved chats.

Red before the change: `bun test tests/runtime-layout.test.ts`: 3 fail / 21 pass (the v5.0.6-shaped
config, the legacy/current matrix and the preference-survives-reload case read `false`);
`node --test tests/state.test.cjs tests/runtime-host.test.cjs`: 3 fail / 67 pass (the v5.0.6-shaped
launcher state, the state matrix and the runtime snapshot matrix). Green after: runtime-layout 24 pass /
0 fail; state and runtime-host 70 pass / 0 fail. Two existing fixtures that described a 6.x file without
the key now carry it explicitly (`persisted sidebar corruption ...` and the `launcherConfig` helper).
Tests pin: v5.0.6-shaped config and state become Temporary Chat in core and launcher, in Automatic and
Zero Risk provider configs and after re-saving; explicit legacy and current values are unchanged; a new
install (no file, or an unreadable or unversioned state file) stays on saved chats.

### chromium-bidi: both version lines deferred

npm latest alternated between the 157 and 159 lines (`159.0.8139-2`, then `157.0.8103-39`, then
`159.0.8140-0` at `2026-11-03T06:19:13.518Z`). `npm pack chromium-bidi@159.0.8140-0 --dry-run` lists
319 files with no `lib/cjs` entry, the same layout as `157.0.8103-39`, while installed Playwright
1.64.1 imports `chromium-bidi/lib/cjs/bidiMapper/BidiMapper` and `chromium-bidi/lib/cjs/cdp/CdpConnection`.
The deferral is now `latestPrefix: ["157", "159"]`; the checker accepts a prefix or a non-empty list of
unique prefixes (fail-closed on empty, duplicate, malformed or mixed-with-`latest` bounds). Red:
the new "several version lines" test failed (1 fail / 10 pass) before the checker change; green after:
`bun test tests/dependency-freshness.test.ts` 11 pass / 0 fail. `npm run check:dependencies` exits 0
with no attention rows. The assertions use synthetic fixture versions only.
