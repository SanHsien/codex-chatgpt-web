# Upstream tracking

| Field | Value |
| --- | --- |
| Upstream | [miuuyy/codex-chatgpt-web](https://github.com/miuuyy/codex-chatgpt-web) |
| Branch | `main` |
| Reviewed commit | `c648c09501bb1b704c7ad5273fb5f5d6b8992dd2` |
| Review state | Reviewed; not merged or auto-adopted |
| Re-review trigger | Upstream `main` differs from the recorded commit |

Run `bun run scripts/check-upstream-baseline.ts --strict` before each maintenance delivery. When
drift is found, review the exact change, record adopt/defer/reject reasoning in
[DECISIONS.md](DECISIONS.md), and update the baseline only after validation.
