const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const launcherRoot = path.resolve(__dirname, "..");
const repositoryRoot = path.resolve(launcherRoot, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(launcherRoot, "package.json"), "utf8"));
const repositoryManifest = JSON.parse(fs.readFileSync(path.join(repositoryRoot, "package.json"), "utf8"));
const read = (file) => fs.readFileSync(path.join(repositoryRoot, file), "utf8");

test("the public launcher command retains the Electron bootstrap", () => {
  assert.equal(repositoryManifest.scripts.launcher, "bun run scripts/start-launcher.ts");
  assert.equal(repositoryManifest.scripts.launcher, repositoryManifest.scripts.app);
});

test("launcher exposes Windows-only NSIS packaging and a checksummed PowerShell installer", () => {
  const installer = read("scripts/install-launcher.ps1");
  assert.equal(manifest.scripts.package, "bun run build && bun run build:runtime && bun run scripts/package.cjs --win");
  assert.equal(manifest.scripts["package:win"], manifest.scripts.package);
  assert.equal(manifest.scripts["package:mac"], undefined);
  assert.equal(manifest.scripts["package:linux"], undefined);
  assert.deepEqual(manifest.build.win.target, ["nsis"]);
  assert.equal(manifest.build.win.icon, "assets/icon.ico");
  assert.equal(manifest.build.mac, undefined);
  assert.equal(manifest.build.linux, undefined);
  assert.equal(manifest.build.asarUnpack, undefined);
  assert.ok(fs.existsSync(path.join(launcherRoot, "assets", "icon.ico")));
  assert.equal(manifest.build.nsis.oneClick, false);
  assert.equal(manifest.build.nsis.perMachine, false);
  assert.equal(manifest.build.nsis.allowElevation, false);
  assert.match(installer, /miuuyy\/codex-chatgpt-web/);
  assert.match(installer, /checksums\.txt/);
  assert.match(installer, /SHA-?256/i);
  assert.match(installer, /codex-web-gpt-\$Version-win-\$Arch\.exe/);
  assert.match(installer, /\[Environment\]::Is64BitOperatingSystem/);
  assert.doesNotMatch(installer, /IsPathFullyQualified/);
  assert.ok(installer.includes(`HKCU:\\Software\\${manifest.build.nsis.guid}`));
});

test("Windows packaging, update, and smoke paths are executable contracts", () => {
  const packager = fs.readFileSync(path.join(launcherRoot, "scripts", "package.cjs"), "utf8");
  const updater = fs.readFileSync(path.join(launcherRoot, "electron", "update.cjs"), "utf8");
  const worker = fs.readFileSync(path.join(launcherRoot, "electron", "update-worker.cjs"), "utf8");
  const smoke = fs.readFileSync(path.join(launcherRoot, "scripts", "smoke-package.cjs"), "utf8");
  assert.match(packager, /process\.platform !== "win32"/);
  assert.match(packager, /electron-builder\/out\/cli\/cli\.js/);
  assert.match(packager, /-win-x64\\\.exe/);
  assert.doesNotMatch(packager, /AppImage|--mac|--linux/);
  assert.match(updater, /platform === "win32"/);
  assert.match(updater, /SHA-256 verification failed/);
  assert.match(updater, /detached:\s*true/);
  assert.doesNotMatch(updater, /darwin|linux|AppImage/);
  assert.match(worker, /job\.platform !== "win32"/);
  assert.match(worker, /waitForParent/);
  assert.match(worker, /spawnSync\(job\.source, \["\/S"\]/);
  assert.match(smoke, /Windows-only package smoke must run on Windows/);
  assert.match(smoke, /run\(installer, \["\/S", "\/currentuser"\]/);
  assert.match(smoke, /reg\.exe[\s\S]*InstallLocation/);
});

test("workflows package, smoke, and publish Windows assets only", () => {
  const ci = read(".github/workflows/ci.yml");
  const codeql = read(".github/workflows/codeql.yml");
  const release = read(".github/workflows/release.yml");
  for (const workflow of [ci, codeql, release]) {
    assert.match(workflow, /windows-latest/);
    assert.doesNotMatch(workflow, /macos|ubuntu|linux|AppImage|\.dmg|launchd/i);
  }
  assert.match(ci, /bun run app:package/);
  assert.match(ci, /bun run app:smoke/);
  assert.match(release, /launcher\/artifacts\/\*-win-x64\.exe/);
  assert.match(release, /install-launcher\.ps1/);
  assert.match(release, /Get-FileHash -Algorithm SHA256/);
  assert.match(release, /WriteAllLines\(\$checksumsPath/);
  assert.doesNotMatch(release, /Set-Content[^\n]*-NoNewline/);
  assert.match(release, /checksums\.txt does not cover/);
  assert.match(release, /Published release asset names must exactly match this run's expected Windows asset set/);
  assert.match(release, /expectedAssetNames/);
  assert.match(release, /publishedAssetNames/);
  assert.match(release, /expectedAssetNames\.Count -ne \$expectedAssets\.Count/);
  assert.match(release, /publishedAssetNames\.Count -ne \$published\.Count/);
  assert.match(release, /Published asset checksum mismatch/);
  assert.match(release, /Published checksums\.txt digest mismatch/);
  assert.match(release, /function Invoke-GhRelease/);
  assert.match(release, /if \(\$LASTEXITCODE -ne 0\)/);
  assert.match(release, /Invoke-GhRelease -Arguments \(@\("release", "upload"/);
  assert.match(release, /Invoke-GhRelease -Arguments \(@\("release", "edit"/);
  assert.match(release, /Invoke-GhRelease -Arguments \(@\("release", "create"/);
  assert.match(release, /assets,isDraft,isPrerelease,tagName/);
  assert.doesNotMatch(release, /isLatest/);
  assert.match(release, /Invoke-GhRelease -Arguments @\("api", "repos\/\$env:GITHUB_REPOSITORY\/releases\/latest"\)/);
  assert.match(release, /Published release tag does not match this workflow event/);
  assert.match(release, /Published release must not remain a draft/);
  assert.match(release, /Published prerelease state does not match tag semantics/);
  assert.match(release, /Published stable release is not GitHub's latest release/);
  assert.doesNotMatch(ci, /actionlint\.yaml/);
  assert.equal(fs.existsSync(path.join(repositoryRoot, ".github", "actionlint.yaml")), false);
});

test("removed macOS/Linux distribution surfaces have no retained files", () => {
  for (const file of [
    "scripts/install.sh", "scripts/install-launcher.sh", "scripts/prepare-linux-libnotify.sh",
    "tools/bootstrap_dev.sh", "tools/dev_check.sh", "launcher/assets/linux-appimage-runner.sh",
    "launcher/scripts/prepare-linux-appimage-tools.cjs", "launcher/scripts/smoke-linux-appimage-symbols.sh",
    "LICENSES/libnotify-0.8.7-LGPL-2.1.md",
  ]) assert.equal(fs.existsSync(path.join(repositoryRoot, file)), false, file);
});
