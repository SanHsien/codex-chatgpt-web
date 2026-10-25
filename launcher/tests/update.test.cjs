const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { EventEmitter } = require("node:events");
const { PassThrough } = require("node:stream");
const { REVIEWED_RELEASE_VERSION, buildJob, compareVersions, createUpdateController, createUpdateDownloader, expectedChecksum, releaseAssetName, reviewedRelease, validateReleaseAssetUrl } = require("../electron/update.cjs");

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

test("a failed startup check is retried on a bounded schedule; a successful one is not repeated", async () => {
  const release = {
    tag_name: "v5.0.6",
    assets: ["codex-web-gpt-5.0.6-win-x64.exe", "checksums.txt"].map(name => ({
      name,
      browser_download_url: `https://github.com/SanHsien/codex-chatgpt-web/releases/download/v5.0.6/${name}`,
    })),
  };
  const controllerFor = (retryDelaysMs, fetchRelease, logged = []) => createUpdateController({
    currentVersion: "5.0.3",
    platform: "win32",
    arch: "x64",
    packaged: true,
    executablePath: "C:\launcher.exe",
    runtimeExecutable: "/tmp/bun",
    logsDirectory: "/tmp/logs",
    retryDelaysMs,
    logger: { info() {}, warn: (event, detail) => logged.push({ event, detail }) },
    dependencies: { fetchRelease },
  });
  const settle = () => new Promise(resolve => setTimeout(resolve, 60));

  let calls = 0;
  const logged = [];
  // Offline at sign-in, then a release whose assets are still uploading, then the complete release.
  const recovering = controllerFor([5, 5, 5], async () => {
    calls += 1;
    if (calls === 1) throw new Error("net::ERR_INTERNET_DISCONNECTED");
    if (calls === 2) return { ...release, assets: [] };
    return release;
  }, logged);
  assert.equal((await recovering.checkOnce()).status, "error");
  await settle();
  assert.deepEqual(recovering.getState(), { status: "available", version: "5.0.6" });
  assert.equal(calls, 3);
  assert.deepEqual(logged.map(entry => entry.detail.retryInMs), [5, 5]);
  await settle();
  assert.equal(calls, 3);

  let failures = 0;
  const exhausted = controllerFor([5], async () => {
    failures += 1;
    throw new Error("offline");
  });
  await exhausted.checkOnce();
  await settle();
  assert.deepEqual(exhausted.getState(), { status: "error", message: "offline" });
  assert.equal(failures, 2);
  assert.equal((await exhausted.checkOnce()).status, "error");
  assert.equal(failures, 2);
});

test("preview and draft releases stay hidden until promoted, regardless of the version suffix", async () => {
  for (const tag of ["5.0.6", "5.0.6-rc.1"]) {
    for (const flags of [{ prerelease: true }, { draft: true }, { prerelease: false, draft: false }]) {
      const controller = createUpdateController({
        currentVersion: "5.0.3", platform: "win32", arch: "x64", packaged: true,
        dependencies: {
          fetchRelease: async () => ({
            tag_name: `v${tag}`, ...flags,
            assets: [`codex-web-gpt-${tag}-win-x64.exe`, "checksums.txt"].map(name => ({
              name,
              browser_download_url: `https://github.com/SanHsien/codex-chatgpt-web/releases/download/v${tag}/${name}`,
            })),
          }),
        },
      });
      const hidden = flags.prerelease || flags.draft;
      if (!hidden && tag !== REVIEWED_RELEASE_VERSION) continue; // the fork only offers its reviewed release
      assert.deepEqual(await controller.checkOnce(), hidden
        ? { status: "up-to-date" }
        : { status: "available", version: tag });
      if (hidden) await assert.rejects(controller.beginInstall(), /No launcher update/);
    }
  }
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


// Electron emits redirects before the response and requires synchronous approval.
function updateTransport({ redirects = [], body = "release metadata", status = 200, stall, error } = {}) {
  const requests = [];
  const createRequest = options => {
    const request = new EventEmitter();
    requests.push(request);
    request.options = options;
    request.followed = [];
    request.aborted = false;
    request.abort = () => {
      if (request.aborted) return;
      request.aborted = true;
      request.response?.emit("aborted");
      request.emit("abort");
    };
    request.end = () => queueMicrotask(() => {
      for (const destination of redirects) {
        let followed = false;
        request.followRedirect = () => { followed = true; request.followed.push(destination); };
        request.emit("redirect", 302, "GET", destination, {});
        if (request.aborted) return;
        if (!followed) { request.emit("error", new Error("Redirect was cancelled")); return; }
      }
      if (stall === "headers") return;
      const response = request.response = new PassThrough();
      response.statusCode = status;
      request.emit("response", response);
      response.write(Buffer.from(body));
      if (error) request.emit("error", error);
      else if (stall !== "body") response.end();
    });
    return request;
  };
  return { createRequest, requests };
}

test("update downloads follow Chromium redirects synchronously without cookies", async () => {
  const transport = updateTransport({ redirects: ["https://release-assets.githubusercontent.com/asset"] });
  const downloader = createUpdateDownloader(transport.createRequest);
  assert.equal(await downloader.downloadText("https://github.com/release"), "release metadata");
  assert.equal(transport.requests.length, 1);
  assert.deepEqual(transport.requests[0].followed, ["https://release-assets.githubusercontent.com/asset"]);
  for (const { options, aborted } of transport.requests) {
    assert.equal(options.credentials, "omit");
    assert.equal(options.redirect, "manual");
    assert.equal(options.cache, "no-store");
    assert.equal(aborted, true);
  }
});

test("update downloads reject redirect downgrades, redirect loops and oversized metadata", async () => {
  for (const url of ["http://example.com/asset", "https://user:secret@example.com/asset"]) {
    const transport = updateTransport({ redirects: [url] });
    const downloader = createUpdateDownloader(transport.createRequest);
    await assert.rejects(downloader.downloadText("https://github.com/release"), /Refusing non-HTTPS/);
    assert.deepEqual(transport.requests[0].followed, []);
    assert.equal(transport.requests[0].aborted, true);
    await assert.rejects(downloader.downloadText(url), /Refusing non-HTTPS/);
    assert.equal(transport.requests.length, 1);
  }
  const loop = updateTransport({ redirects: Array(6).fill("https://github.com/again") });
  await assert.rejects(createUpdateDownloader(loop.createRequest).downloadText("https://github.com/release"), /Too many redirects/);
  assert.equal(loop.requests[0].followed.length, 5);
  const oversized = createUpdateDownloader(updateTransport({ body: "12345" }).createRequest);
  await assert.rejects(oversized.downloadText("https://github.com/release", 4), /size limit/);
});

test("update downloads cancel stalled headers and stalled response bodies", async () => {
  // Keep the event loop alive while testing the deliberately unref'ed production timer.
  const keepAlive = setInterval(() => {}, 1000);
  try {
    for (const stall of ["headers", "body"]) {
      const transport = updateTransport({ stall });
      await assert.rejects(createUpdateDownloader(transport.createRequest, 15).downloadText("https://github.com/release"), /timed out/);
      assert.equal(transport.requests[0].aborted, true);
    }
  } finally {
    clearInterval(keepAlive);
  }
});

test("update downloads reject HTTP errors and interrupted response streams", async () => {
  for (const [options, message] of [
    [{ status: 404 }, /HTTP 404/],
    [{ error: new Error("connection lost") }, /connection lost/],
  ]) {
    const transport = updateTransport(options);
    await assert.rejects(createUpdateDownloader(transport.createRequest).downloadText("https://github.com/release"), message);
    assert.equal(transport.requests[0].aborted, true);
  }
});

test("update asset streaming preserves bytes and refuses to overwrite a file", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "codex-update-download-"));
  const destination = path.join(root, "asset.zip");
  const bytes = Buffer.from([0, 1, 2, 127, 128, 255]);
  const downloader = createUpdateDownloader(updateTransport({ body: bytes }).createRequest);
  try {
    await downloader.downloadFile("https://github.com/release", destination);
    assert.deepEqual(fs.readFileSync(destination), bytes);
    await assert.rejects(downloader.downloadFile("https://github.com/release", destination), /EEXIST/);
    assert.deepEqual(fs.readFileSync(destination), bytes);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
