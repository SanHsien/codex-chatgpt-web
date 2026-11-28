# Release validation

CI proves that the Windows runtime builds, the launcher starts, and the Windows package passes its
smoke contract. It does not prove an authenticated ChatGPT session, a live MCP connector, or a
complete Codex turn. A release candidate is not ready until those account-bound flows are exercised
manually on Windows.

## Preview releases and updater visibility

Use GitHub's **Set as a pre-release** flag for public test builds. They remain downloadable from
Releases and are excluded from `/releases/latest`. A draft keeps a release private before
publication.

After validation, uncheck **Set as a pre-release** and select **Set as latest release**, or publish
a newer stable release. The Windows fork's updater and PowerShell installer use a reviewed
version pin. The launcher shipped in v5.0.6 can only discover v5.0.6. Promotion changes GitHub's
latest-release listing. Existing v5.0.6 installations need a separately verified migration path.

The tag workflow marks new suffixed versions such as `v6.0.0-rc.1` as pre-releases automatically
and preserves an existing release's pre-release flag when rerun.
Use a new version for changed binaries; toggling publication flags promotes the existing build.
To keep a final version out of GitHub's latest-release listing during public testing, prepare a
draft release with **Set as a pre-release** checked before pushing its tag. The workflow publishes
it with that flag preserved.

GitHub documents this contract in [Get the latest release](https://docs.github.com/en/rest/releases/releases#get-the-latest-release).

## Required evidence

Record the release version, operating-system version, install path (`clean` or `upgrade`), ChatGPT
plan, Codex version, result of each check, and a redacted Activity log for every failure. Never
capture cookies, tunnel IDs, API keys, bearer tokens, or prompt contents.

## Windows 11 gate

Run this list on a maintained Windows 11 x64 machine with a real ChatGPT account:

1. Install the packaged launcher on a clean profile and prove that the embedded Bun runtime starts.
2. Sign in inside the embedded browser and prove that Temporary Chat reaches a usable composer.
3. Install the Codex model route, restart Codex, and prove that every account-available ChatGPT Web
   effort appears exactly once without removing native models.
4. Complete one Browser-only turn and verify streamed commentary plus the final answer.
5. Configure the `Codex Native2` connector, run **Verify runtime**, and complete one Full-mode local
   tool turn. Repeat with Pro when the account exposes Pro.
6. Drive a chat past the compaction threshold and prove that it continues after compaction without
   a duplicate or orphaned browser turn.
7. On a clean install, prove that setup offers both interaction modes and defaults to With
   Automation. Select Zero Risk and prove that Codex shows exactly one generic Web model after
   restart, a retained chat receives only the next prompt, and
   compaction completes through MCP before the compacted continuation opens a fresh manual chat.
   Inspect the copied prompt and prove that it contains only the current `request_id`, never a
   surface nonce, capability token, or prompt-level lifecycle commands.
   Switch back to Automatic and prove that the account-visible catalog is restored.
8. Cancel a running turn by closing its launcher tab, then cancel another with the launcher action;
   prove that neither turn recreates a tab or keeps the runtime busy.
9. Quit the launcher during an active turn, confirm the explicit cancellation path, reopen it, and
   prove that the saved ChatGPT session and Codex route are still valid.
10. Prove Codex Voice can create a WebRTC call while Responses use the local bridge. Disconnect the
   bridge and prove that both exact previous route assignments are restored; reconnect it and prove
   that the existing private MCP credentials are reused rather than replaced.
11. Upgrade from the previous public release and prove that launcher state, browser state, Codex
    settings, and MCP configuration survive the updater transaction.

Any failed or unexecuted item blocks a stable release. An alpha may ship with a named failed item
only when the release notes describe the limitation and recovery path explicitly.

### v3.0.0 result

Maintainer validation passed on Windows 11 x64 on 2026-08-22 using the published v3.0.0-alpha
upgrade package and a real ChatGPT Pro account. The authenticated launcher, Codex model catalog,
Full-mode MCP tools, Pro turns, compaction, cancellation, session reuse, and preserved connector
configuration were exercised successfully. The direct installer completed successfully but gave no
clear completion action; v3.0.0 changes it to an assisted installer with a final launch option.
