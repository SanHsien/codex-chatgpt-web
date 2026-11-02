# Review evidence

Review the exact proposed SHA and record evidence for:

- diff and scope: only intended files; no lockfile, product, credential, generated-report, or
  absolute-path changes;
- security and privacy: no browser profile, cookie, token, account claim, or broadened workflow
  permission; canonical gates use only authenticated read-only GitHub and package-registry access,
  never ChatGPT account activity;
- upstream: all four strict baseline axes are current, or the documented decision explains attention;
- dependencies: both workspaces have passing audits and every lagging package is either exact-version
  deferred with an honest reason or surfaced for action;
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
