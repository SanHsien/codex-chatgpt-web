#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
expected_bun="1.4.0"
check_only=false
if [[ "${1:-}" == "--check-only" ]]; then check_only=true; elif [[ $# -gt 0 ]]; then echo "Usage: tools/bootstrap_dev.sh [--check-only]" >&2; exit 2; fi
export BUN_INSTALL_CACHE_DIR="$repo_root/.bun-cache"
require_bun() { local actual; actual="$(bun --version)"; [[ "$actual" == "$expected_bun" ]] || { echo "Bun $expected_bun is required; found '$actual'." >&2; exit 1; }; }
require_github_access() { command -v gh >/dev/null 2>&1 || { echo "GitHub CLI (gh) is required for strict upstream tracking. Install gh, authenticate with gh auth login --hostname github.com, then rerun bootstrap." >&2; exit 1; }; gh auth status --hostname github.com >/dev/null 2>&1 || { echo "Authenticated GitHub CLI access is required for strict upstream tracking. Run gh auth login --hostname github.com, then rerun bootstrap. Bootstrap never signs in for you." >&2; exit 1; }; }
electron_ready() {
  local root="$1" dist="$1/node_modules/electron/dist" path_file="$1/node_modules/electron/path.txt" relative
  [[ -f "$path_file" && -d "$dist" ]] || return 1
  relative="$(tr -d '\r\n' < "$path_file")"
  [[ -n "$relative" && "$relative" != /* && "$relative" != *\\* && ! "$relative" =~ (^|/)\.\.(/|$) && -f "$dist/$relative" ]]
}
require_bun
require_github_access
if [[ "$check_only" == true ]]; then echo "BOOTSTRAP PREREQUISITES PASSED: Bun $expected_bun and authenticated GitHub CLI access."; exit 0; fi
(cd "$repo_root" && bun install --frozen-lockfile)
(cd "$repo_root/launcher" && bun install --frozen-lockfile)
if electron_ready "$repo_root/launcher"; then
  echo "ELECTRON_RUNTIME=ready"
else
  lifecycle="$repo_root/launcher/node_modules/electron/install.js"
  [[ -f "$lifecycle" ]] || { echo "Electron runtime is incomplete and its installed lifecycle script is missing: $lifecycle" >&2; exit 1; }
  (cd "$repo_root/launcher" && bun node_modules/electron/install.js)
  electron_ready "$repo_root/launcher" || { echo "Electron lifecycle repair did not produce a safe runtime under launcher/node_modules/electron/dist." >&2; exit 1; }
  echo "ELECTRON_RUNTIME=repaired"
fi
echo "BOOTSTRAP PASSED: Bun $expected_bun, both frozen lockfiles, and Electron runtime."
