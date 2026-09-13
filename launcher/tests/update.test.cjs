const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { REVIEWED_RELEASE_VERSION, buildJob, compareVersions, createUpdateController, expectedChecksum, releaseAssetName, reviewedRelease, validateReleaseAssetUrl } = require("../electron/update.cjs");

test("release comparison and Windows assets are strict", () => {
  assert.equal(compareVersions("1.1.5", "1.1.4"), 1);
  assert.equal(compareVersions("1.1.4", "1.1.4"), 0);
  assert.equal(compareVersions("1.1.3", "1.1.4"), -1);
  assert.equal(releaseAssetName("1.2.0", "win32", "x64"), "codex-web-gpt-1.2.0-win-x64.exe");
  assert.equal(releaseAssetName("1.2.0", "darwin", "x64"), null);
  assert.equal(releaseAssetName("1.2.0", "linux", "x64"), null);
  assert.throws(() => buildJob({ version: "1.2.0", platform: "linux", executablePath: "/tmp/launcher", assetPath: "/tmp/update", tempRoot: "/tmp", logPath: "/tmp/log" }), /not supported/);
});

test("checksums and release URLs bind the reviewed fork Windows asset", () => {
  const hash = "a".repeat(64);
  assert.equal(REVIEWED_RELEASE_VERSION, "5.0.6");
  assert.deepEqual(reviewedRelease("win32", "x64").assets.map(({ name }) => name), ["codex-web-gpt-5.0.6-win-x64.exe", "checksums.txt"]);
  assert.equal(expectedChecksum(`${hash}  launcher.exe\n`, "launcher.exe"), hash);
  assert.throws(() => expectedChecksum(`${hash}  other.exe\n`, "launcher.exe"), /no entry/);
  assert.equal(
    validateReleaseAssetUrl("https://github.com/SanHsien/codex-chatgpt-web/releases/download/v5.0.6/launcher.exe", "5.0.6", "launcher.exe"),
    "https://github.com/SanHsien/codex-chatgpt-web/releases/download/v5.0.6/launcher.exe",
  );
  assert.throws(() => validateReleaseAssetUrl("https://github.com/SanHsien/codex-chatgpt-web/releases/download/v5.0.5/launcher.exe", "5.0.5", "launcher.exe"), /unreviewed release version/);
  assert.throws(() => validateReleaseAssetUrl("https://github.com/example/launcher.exe", "5.0.6", "launcher.exe"), /unexpected release asset URL/);
});

test("verified Windows update is handed to one detached worker", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "launcher-update-test-"));
  const assetBody = Buffer.from("new installer");
  const hash = crypto.createHash("sha256").update(assetBody).digest("hex");
  let spawned = null;
  try {
    const controller = createUpdateController({
      currentVersion: "5.0.3", platform: "win32", arch: "x64", packaged: true,
      executablePath: path.join(root, "Codex Web GPT.exe"), runtimeExecutable: process.execPath, logsDirectory: path.join(root, "logs"),
      dependencies: {
        fetchRelease: async () => ({ tag_name: "v5.0.6", assets: [
          { name: "codex-web-gpt-5.0.6-win-x64.exe", browser_download_url: "https://github.com/SanHsien/codex-chatgpt-web/releases/download/v5.0.6/codex-web-gpt-5.0.6-win-x64.exe" },
          { name: "checksums.txt", browser_download_url: "https://github.com/SanHsien/codex-chatgpt-web/releases/download/v5.0.6/checksums.txt" },
        ] }),
        downloadText: async () => `${hash}  codex-web-gpt-5.0.6-win-x64.exe\n`,
        downloadFile: async (_url, destination) => fs.writeFileSync(destination, assetBody),
        sha256: (filePath) => crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex"),
        spawnWorker: (runtime, worker, job) => { spawned = { runtime, worker, job, data: JSON.parse(fs.readFileSync(job, "utf8")) }; return { pid: 123, unref() {}, kill() {} }; },
      },
    });
    assert.deepEqual(await controller.checkOnce(), { status: "available", version: "5.0.6" });
    const launch = await controller.beginInstall();
    assert.equal(spawned.runtime, process.execPath);
    assert.equal(spawned.data.platform, "win32");
    assert.equal(spawned.data.target, path.join(root, "Codex Web GPT.exe"));
    assert.equal(fs.existsSync(spawned.data.source), true);
    assert.equal(controller.getState().status, "installing");
    controller.cancelInstall(launch);
    assert.equal(fs.existsSync(launch.tempRoot), false);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test("updater refuses a release that was not explicitly reviewed", async () => {
  const controller = createUpdateController({
    currentVersion: "5.0.3", platform: "win32", arch: "x64", packaged: true,
    executablePath: "C:\\launcher.exe", runtimeExecutable: process.execPath, logsDirectory: os.tmpdir(),
    dependencies: { fetchRelease: async () => ({ tag_name: "v5.0.5", assets: [] }) },
  });
  const state = await controller.checkOnce();
  assert.equal(state.status, "error");
  assert.match(state.message, /unreviewed release version: 5\.0\.5/);
});

test("Windows update worker runs the installer and relaunches its installed target", () => {
  if (process.platform !== "win32") return;
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "launcher-worker-test-"));
  const jobRoot = path.join(root, "job");
  const source = process.env.ComSpec;
  const target = process.execPath;
  const logPath = path.join(root, "logs", "update-worker.log");
  const jobPath = path.join(root, "job.json");
  fs.mkdirSync(jobRoot);
  assert.ok(source && fs.existsSync(source), "Windows command processor is required for this worker smoke");
  fs.writeFileSync(jobPath, JSON.stringify({ version: "1.2.0", platform: "win32", parentPid: 2147483647, tempRoot: jobRoot, logPath, source, target }));
  try {
    const result = spawnSync(process.execPath, [path.join(__dirname, "..", "electron", "update-worker.cjs"), jobPath], { encoding: "utf8", timeout: 10_000, windowsHide: true });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(fs.existsSync(target), true);
    assert.match(fs.readFileSync(logPath, "utf8"), /installed and relaunched/);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
