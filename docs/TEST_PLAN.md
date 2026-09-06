# Test plan

## Networked canonical gates

`tools/dev_check.ps1` is the Windows canonical gate; `tools/dev_check.sh` is POSIX parity. They
validate pinned Bun, the existing Electron artifact, fork contracts, four-axis upstream tracking,
whole-workspace dependency freshness and Bun audit, upstream verification, and whitespace. Strict
upstream tracking requires authenticated read-only GitHub access; dependency checks may use the
package registry. Unit tests include positive, malformed, and unavailable fixture cases without
network access.

## Optional account-bound smoke

Browser login, MCP connector, ChatGPT account behavior, desktop package installation, and release
smoke require an explicit opt-in runbook and minimal evidence for that run. They are not run by the
canonical maintenance gate, and unit tests must never be reported as proof of those outcomes.
