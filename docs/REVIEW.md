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
