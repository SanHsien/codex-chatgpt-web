const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const launcherRoot = path.resolve(__dirname, "..");
const repositoryRoot = path.resolve(launcherRoot, "..");
const read = (...parts) => fs.readFileSync(path.join(repositoryRoot, ...parts), "utf8");

const englishReadme = read("README.en.md");
const traditionalChineseReadme = read("README.md");

function commandFences(source) {
  return [...source.matchAll(/```(bash|powershell)\n([\s\S]*?)```/g)]
    .map((match) => `${match[1]}\n${match[2].trim()}`);
}

function linkTargets(source) {
  const markdown = [...source.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)].map((match) => match[1]);
  const html = [...source.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  return [...new Set([...markdown, ...html])].sort();
}

test("both README languages expose the Windows-only installer and locale switch", () => {
  for (const source of [traditionalChineseReadme, englishReadme]) {
    assert.match(source, /README\.md">繁體中文<\/a> · <a href="README\.en\.md">English/);
    assert.match(source, /Windows only|僅支援 Windows/);
    assert.match(source, /install-launcher\.ps1/);
    assert.match(source, /releases\/download\/v5\.0\.6\/install-launcher\.ps1/);
    assert.doesNotMatch(source, /README\.zh-CN\.md|README\.ja\.md|install-launcher\.sh/);
  }
  assert.deepEqual(
    commandFences(traditionalChineseReadme).filter((block) => block.includes("install-launcher.ps1")),
    commandFences(englishReadme).filter((block) => block.includes("install-launcher.ps1")),
  );
  assert.deepEqual(
    linkTargets(traditionalChineseReadme).filter((target) => target.includes("install-launcher.ps1")),
    linkTargets(englishReadme).filter((target) => target.includes("install-launcher.ps1")),
  );
});

test("the README command pins this fork's reviewed installer", () => {
  const command = commandFences(englishReadme).find((block) => block.includes("install-launcher.ps1"));
  assert.ok(command, "README must contain the pinned installer command");
  assert.match(command, /https:\/\/github\.com\/SanHsien\/codex-chatgpt-web\/releases\/download\/v5\.0\.6\/install-launcher\.ps1 \| iex/);
  assert.doesNotMatch(command, /CODEX_WEB_GPT_VERSION/);
});
