import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

test("maintained-fork documents and PowerShell entrypoints are tracked", () => {
  for (const path of [
    "AGENTS.md",
    "FORK.md",
    "NOTICE.md",
    "CODE_OF_CONDUCT.md",
    "docs/DEVELOPMENT.md",
    "docs/DECISIONS.md",
    "docs/UPSTREAM.md",
    "tools/bootstrap_dev.ps1",
    "tools/dev_check.ps1",
    "tools/upstream_baseline.json",
  ]) {
    expect(existsSync(resolve(root, path))).toBe(true);
  }
  expect(read("FORK.md")).toContain("reviewed, not merged");
  expect(read("README.md")).toContain("Maintained fork notice");
  expect(read("docs/DEVELOPMENT.md")).toContain("do not sign in to ChatGPT");
});

test("maintenance workflows stay least-privilege and strict on upstream drift", () => {
  const codeql = read(".github/workflows/codeql.yml");
  const upstream = read(".github/workflows/upstream-drift.yml");
  const dependabot = read(".github/dependabot.yml");
  expect(codeql).toContain("security-events: write");
  expect(upstream).toContain("contents: read");
  expect(upstream).toContain("git remote add upstream https://github.com/miuuyy/codex-chatgpt-web.git");
  expect(upstream).toContain("--strict");
  expect(dependabot).toContain('package-ecosystem: "bun"');
  expect(dependabot).toContain('directory: "/launcher"');
});
