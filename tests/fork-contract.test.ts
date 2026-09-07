import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

test("maintained-fork manifest documents Windows-only entrypoints and boundaries", () => {
  for (const path of ["AGENTS.md", "CLAUDE.md", "CHANGELOG.md", "FORK.md", "NOTICE.md", "CODE_OF_CONDUCT.md", "README.en.md", "docs/DEVELOPMENT.md", "docs/DECISIONS.md", "docs/REVIEW.md", "docs/TEST_PLAN.md", "docs/UPSTREAM.md", "tools/bootstrap_dev.ps1", "tools/dev_check.ps1", "tools/upstream_baseline.json", ".github/dependency-deferrals.json", "scripts/check-dependency-freshness.ts"]) expect(existsSync(resolve(root, path))).toBe(true);
  expect(existsSync(resolve(root, "README.zh-CN.md"))).toBe(false);
  expect(existsSync(resolve(root, "README.ja.md"))).toBe(false);
  expect(read("FORK.md")).toContain("reviewed");
  expect(read("README.md")).toContain("維護 fork 說明");
  expect(read("README.en.md")).toContain("Maintained fork notice");
  expect(read("README.md")).toContain("僅支援 Windows");
  expect(read("README.en.md")).toContain("Windows only");
  const reviewedInstaller = "https://github.com/miuuyy/codex-chatgpt-web/releases/download/v5.0.4/install-launcher.ps1";
  expect(read("README.md")).toContain(reviewedInstaller);
  expect(read("README.en.md")).toContain(reviewedInstaller);
  expect(read("README.md")).toContain("git clone https://github.com/SanHsien/codex-chatgpt-web.git");
  expect(read("README.md")).toContain("已審閱的上游 Windows release **v5.0.4**");
  expect(read("README.en.md")).toContain("reviewed upstream Windows release **v5.0.4**");
  expect(read("README.md")).toContain("Zero Risk 會保留本機 Responses 橋接程式");
  expect(read("README.md")).toContain("`Codex Zero Risk`");
  for (const path of ["README.md", "README.en.md", "TROUBLESHOOTING.md", "scripts/install-launcher.ps1", "launcher/electron/update.cjs"]) expect(read(path)).not.toContain("releases/latest");
  expect(read("scripts/install-launcher.ps1")).toContain('$Version = "5.0.4"');
  expect(read("launcher/electron/update.cjs")).toContain('const REVIEWED_RELEASE_VERSION = "5.0.4"');
  expect(read("launcher/electron/main.cjs")).toContain('const GITHUB_URL = "https://github.com/SanHsien/codex-chatgpt-web"');
  expect(read("launcher/electron/update.cjs")).toContain('const REPOSITORY = "miuuyy/codex-chatgpt-web"');
  expect(read("docs/UPSTREAM.md")).toContain("80ee0e3eac62067c14dd719d702ae1d7c55fdbe5");
  expect(read("docs/UPSTREAM.md")).toContain("a4cd7012150bd76789fc818bd04d55cfa90a2744");
  expect(read("docs/UPSTREAM.md")).toContain("f9619efd69bf397fec19edcdec53156762a88c92");
  expect(read("docs/UPSTREAM.md")).toContain("ffef4f335c48b521562d4d21c26bb1c89e12f64e");
  expect(read("docs/UPSTREAM.md")).toContain("issues/319");
  expect(read("docs/UPSTREAM.md")).toContain("macOS arm64 report is outside this Windows-only fork");
  expect(read("docs/DECISIONS.md")).toContain("Issue #319 | macOS arm64 report | reject");
  expect(read("docs/DECISIONS.md")).toContain("Issue #359 | open; viewport classification backlog | monitor");
  expect(read("docs/DECISIONS.md")).toContain("PR #361 | open, non-draft, `UNSTABLE`; `c09aa18b8a2a84e3fa3d77dcd4b339d3575cbbe6` | reject macOS Dock/menu-bar mode");
  expect(read("docs/DECISIONS.md")).toContain("PR #362 | open, non-draft, `UNSTABLE`; `80ee0e3eac62067c14dd719d702ae1d7c55fdbe5` | adopt minimal per-part continuation environment parsing");
  expect(read("tools/upstream_baseline.json")).toContain('"latestPullRequest": 362');
  expect(read("tools/upstream_baseline.json")).toContain('"latestPullRequestHead": "80ee0e3eac62067c14dd719d702ae1d7c55fdbe5"');
  expect(read("tools/upstream_baseline.json")).toContain('"latestNonPullRequestIssue": 359');
  expect(read("docs/DEVELOPMENT.md")).toContain("do **not** sign in to ChatGPT");
  expect(read("docs/TEST_PLAN.md")).toContain("must never be reported as proof");
});

test("maintenance workflows are read-only, bounded, strict, and do not write issues", () => {
  const upstream = read(".github/workflows/upstream-check.yml"), dependencies = read(".github/workflows/dependency-freshness.yml"), codeql = read(".github/workflows/codeql.yml"), ci = read(".github/workflows/ci.yml"), release = read(".github/workflows/release.yml"), dependabot = read(".github/dependabot.yml");
  for (const workflow of [upstream, dependencies]) {
    expect(workflow).toContain("contents: read");
    expect(workflow).toContain("timeout-minutes:");
    expect(workflow).toContain("concurrency:");
    expect(workflow).toContain("--strict");
    expect(workflow).toContain("GITHUB_STEP_SUMMARY");
    expect(workflow).not.toContain("issues: write");
    expect(workflow).not.toContain("gh issue");
  }
  expect(upstream).toContain("GH_TOKEN");
  expect(dependencies).toContain("--frozen-lockfile");
  for (const workflow of [upstream, dependencies]) {
    expect(workflow).toContain("continue-on-error: true");
    expect(workflow).toContain("if: always()");
    expect(workflow).toContain("Report unavailable: checker did not produce a report.");
    expect(workflow).toContain("steps.checker.outcome");
  }
  expect(upstream).toContain("steps.checker.outputs.upstream_status");
  expect(dependencies).toContain("steps.checker.outputs.dependency_status");
  expect(read(".gitignore")).toContain(".maintenance-reports/");
  expect(codeql).toContain("actions: read");
  expect(codeql).toContain("contents: read");
  expect(codeql).toContain("security-events: write");
  for (const workflow of [upstream, dependencies, codeql, ci, release]) {
    expect(workflow).toContain("windows-latest");
    expect(workflow).not.toMatch(/ubuntu-latest|macos-|AppImage|launchd|libnotify/);
  }
  expect(dependabot).toContain('package-ecosystem: "bun"');
  expect(dependabot).toContain('directory: "/"');
  expect(dependabot).toContain('directory: "/launcher"');
});

test("canonical Windows gates enforce no-repair checks and maintenance contracts", () => {
  const powershell = read("tools/dev_check.ps1"), bootstrap = read("tools/bootstrap_dev.ps1");
  expect(powershell).toContain("check-upstream-baseline.ts");
  expect(powershell).toContain("check-dependency-freshness.ts");
  expect(powershell).toContain("fork-contract.test.ts");
  expect(bootstrap).toContain("ELECTRON_RUNTIME=repaired");
  expect(bootstrap).toContain("gh auth status --hostname github.com");
  expect(powershell).toContain("'diff', '--cached', '--check'");
  expect(powershell).toContain("'show', '--check', '--format=', 'HEAD'");
  expect(powershell).toContain('"$resolvedBase..HEAD"');
  expect(powershell).toContain("Test-ElectronRuntime");
  expect(powershell).toContain("tools\\bootstrap_dev.ps1");
  expect(existsSync(resolve(root, "tools/dev_check.sh"))).toBe(false);
  expect(existsSync(resolve(root, "tools/bootstrap_dev.sh"))).toBe(false);
});

test("public contribution templates are owned by the Windows-only fork", () => {
  const pullRequest = read(".github/PULL_REQUEST_TEMPLATE.md");
  const bug = read(".github/ISSUE_TEMPLATE/bug-report.yml");
  const config = read(".github/ISSUE_TEMPLATE/config.yml");
  expect(pullRequest).toContain("Windows x64 NSIS");
  expect(pullRequest).not.toMatch(/macOS|Linux/);
  expect(bug).toContain("Windows x64 only");
  expect(bug).toContain("https://github.com/SanHsien/codex-chatgpt-web");
  expect(bug).not.toMatch(/macOS|Linux|Ubuntu/);
  expect(config).toContain("https://github.com/SanHsien/codex-chatgpt-web");
  expect(config).not.toContain("miuuyy/codex-chatgpt-web");
});
