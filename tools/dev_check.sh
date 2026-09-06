#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"; expected_bun="1.4.0"; base_ref="${1:-}"
actual_bun="$(bun --version)"; [[ "$actual_bun" == "$expected_bun" ]] || { echo "Bun $expected_bun is required; found '$actual_bun'." >&2; exit 1; }
electron="$repo_root/launcher/node_modules/electron"; dist="$electron/dist"; path_file="$electron/path.txt"
[[ -f "$path_file" && -d "$dist" ]] || { echo "Electron runtime is incomplete. Run tools/bootstrap_dev.sh, then rerun this check." >&2; exit 1; }
relative="$(tr -d '\r\n' < "$path_file")"
[[ -n "$relative" && "$relative" != /* && "$relative" != *\\* && ! "$relative" =~ (^|/)\.\.(/|$) && -f "$dist/$relative" ]] || { echo "Electron runtime is incomplete. Run tools/bootstrap_dev.sh, then rerun this check." >&2; exit 1; }
cd "$repo_root"
bun test tests/fork-contract.test.ts tests/upstream-baseline.test.ts tests/dependency-freshness.test.ts
bun run scripts/check-upstream-baseline.ts --strict
bun run scripts/check-dependency-freshness.ts --strict
bun run verify
git diff --check
git diff --cached --check
if [[ -n "$base_ref" ]]; then
  [[ ! "$base_ref" =~ ^0+$ ]] || { echo "BaseRef cannot be an all-zero revision: $base_ref" >&2; exit 1; }
  git rev-parse --verify "$base_ref^{commit}" >/dev/null
  git diff --check "$base_ref..HEAD"
else
  git show --check --format= HEAD
fi
echo "DEV CHECK PASSED: Bun $actual_bun, fork contract, upstream/dependency checks, upstream verify, and whitespace."
