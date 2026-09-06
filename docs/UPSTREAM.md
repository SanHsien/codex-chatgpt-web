# Upstream tracking

The baseline is reviewed history, not a merge target. Its 2026-09-06 review records upstream
`miuuyy/codex-chatgpt-web`: `main` at `c648c09501bb1b704c7ad5273fb5f5d6b8992dd2`, latest PR
`#343`, latest non-PR issue `#345`, and one branch (`main` at that SHA). Status remains
**reviewed-not-merged**.

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
or unavailable axes. `--output <file>` writes its Markdown report and `--github-output` appends a
status to `GITHUB_OUTPUT`; generated reports belong under ignored `.maintenance-reports/`.

When it reports attention, review the exact upstream change and record an adopt, defer, or reject
decision in [DECISIONS.md](DECISIONS.md). Only then update the baseline after relevant validation.
