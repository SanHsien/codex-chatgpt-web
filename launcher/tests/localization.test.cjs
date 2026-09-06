const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

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
    assert.match(source, /releases\/download\/v5\.0\.4\/install-launcher\.ps1/);
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

test("the reviewed upstream installer receives and restores its explicit version interface", () => {
  const command = commandFences(englishReadme).find((block) => block.includes("install-launcher.ps1"));
  assert.ok(command, "README must contain the reviewed installer command");
  assert.match(command, /\$env:CODEX_WEB_GPT_VERSION = "5\.0\.4"/);
  assert.match(command, /\$previousVersion = \$env:CODEX_WEB_GPT_VERSION/);
  assert.match(command, /Remove-Item Env:CODEX_WEB_GPT_VERSION/);
  // The released v5.0.4 installer selects $env:CODEX_WEB_GPT_VERSION before its latest-release
  // fallback. Replace only its network invocation and execute the published-interface wrapper.
  const wrapper = command.replace(/^powershell\n/, "").replace(/^\s*irm .*install-launcher\.ps1 \| iex$/m, "  $selectedVersion = $env:CODEX_WEB_GPT_VERSION");
  const script = `$env:CODEX_WEB_GPT_VERSION = "prior-value"\n${wrapper}\n[pscustomobject]@{ selected = $selectedVersion; restored = $env:CODEX_WEB_GPT_VERSION } | ConvertTo-Json -Compress\n`;
  const result = spawnSync("pwsh", ["-NoProfile", "-NonInteractive", "-EncodedCommand", Buffer.from(script, "utf16le").toString("base64")], {
    encoding: "utf8",
    windowsHide: true,
  });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout.trim()), { selected: "5.0.4", restored: "prior-value" });
});
