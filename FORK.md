# Maintained fork

This fork adds maintenance controls without changing upstream product behavior. Fork-only writes,
issues, releases, and workflows target `SanHsien/codex-chatgpt-web`; upstream is read-only unless
the owner explicitly authorizes a contribution. The reviewed upstream state is not merged
automatically: see [docs/UPSTREAM.md](docs/UPSTREAM.md) and [CHANGELOG.md](CHANGELOG.md).

This is a maintained fork of [miuuyy/codex-chatgpt-web](https://github.com/miuuyy/codex-chatgpt-web),
licensed under the upstream MIT License retained in [LICENSE](LICENSE).

- Fork: [SanHsien/codex-chatgpt-web](https://github.com/SanHsien/codex-chatgpt-web)
- Upstream default branch: `main`
- Reviewed upstream baseline: `c648c09501bb1b704c7ad5273fb5f5d6b8992dd2`
- Baseline meaning: reviewed, not merged or automatically adopted

The fork preserves upstream product behavior and attribution. Its overlay supplies Windows-first
bootstrap and verification, fork governance, security reporting boundaries, maintenance automation,
and a fail-closed upstream drift check. Product changes remain deliberately out of scope unless a
verified compatibility need arises.

This is unofficial ChatGPT Web automation, not an OpenAI API or a quota bypass. Features and
allowances depend on the user's account and plan; ChatGPT UI changes can break the integration.
Users are responsible for complying with OpenAI terms and their workspace policy.
