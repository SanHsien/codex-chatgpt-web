import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

test("maintained-fork manifest documents cross-platform entrypoints and boundaries", () => {
  for (const path of ["AGENTS.md", "CLAUDE.md", "CHANGELOG.md", "FORK.md", "NOTICE.md", "CODE_OF_CONDUCT.md", "docs/DEVELOPMENT.md", "docs/DECISIONS.md", "docs/REVIEW.md", "docs/TEST_PLAN.md", "docs/UPSTREAM.md", "tools/bootstrap_dev.ps1", "tools/dev_check.ps1", "tools/bootstrap_dev.sh", "tools/dev_check.sh", "tools/upstream_baseline.json", ".github/dependency-deferrals.json", "scripts/check-dependency-freshness.ts"]) expect(existsSync(resolve(root, path))).toBe(true);
  expect(read("FORK.md")).toContain("reviewed");
  expect(read("README.md")).toContain("Maintained fork notice");
  expect(read("README.md")).toContain("https://github.com/miuuyy/codex-chatgpt-web/releases/latest/download/install-launcher.sh");
  expect(read("README.md")).toContain("https://github.com/miuuyy/codex-chatgpt-web/releases/latest/download/install-launcher.ps1");
  expect(read("README.md")).toContain("git clone https://github.com/SanHsien/codex-chatgpt-web.git");
  expect(read("docs/DEVELOPMENT.md")).toContain("do **not** sign in to ChatGPT");
  expect(read("docs/TEST_PLAN.md")).toContain("must never be reported as proof");
});

test("maintenance workflows are read-only, bounded, strict, and do not write issues", () => {
  const upstream = read(".github/workflows/upstream-check.yml"), dependencies = read(".github/workflows/dependency-freshness.yml"), codeql = read(".github/workflows/codeql.yml"), dependabot = read(".github/dependabot.yml");
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
  expect(dependabot).toContain('package-ecosystem: "bun"');
  expect(dependabot).toContain('directory: "/"');
  expect(dependabot).toContain('directory: "/launcher"');
});

test("canonical gates enforce no-repair checks and maintenance contracts", () => {
  const powershell = read("tools/dev_check.ps1"), posix = read("tools/dev_check.sh"), bootstrap = read("tools/bootstrap_dev.ps1"), posixBootstrap = read("tools/bootstrap_dev.sh");
  for (const gate of [powershell, posix]) {
    expect(gate).toContain("check-upstream-baseline.ts");
    expect(gate).toContain("check-dependency-freshness.ts");
    expect(gate).toContain("fork-contract.test.ts");
  }
  expect(bootstrap).toContain("ELECTRON_RUNTIME=repaired");
  expect(posixBootstrap).toContain("ELECTRON_RUNTIME=repaired");
  expect(bootstrap).toContain("gh auth status --hostname github.com");
  expect(posixBootstrap).toContain("gh auth status --hostname github.com");
  expect(powershell).toContain("'diff', '--cached', '--check'");
  expect(powershell).toContain("'show', '--check', '--format=', 'HEAD'");
  expect(powershell).toContain('"$resolvedBase..HEAD"');
  expect(powershell).toContain("Test-ElectronRuntime");
  expect(powershell).toContain("tools\\bootstrap_dev.ps1");
  expect(posix).not.toContain("install.js");
});
