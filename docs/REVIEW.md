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
