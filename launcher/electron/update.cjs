const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { pipeline } = require("node:stream/promises");

const REPOSITORY = "SanHsien/codex-chatgpt-web";
const REVIEWED_RELEASE_VERSION = "5.0.6";
const REVIEWED_RELEASE_BASE_URL = `https://github.com/${REPOSITORY}/releases/download/v${REVIEWED_RELEASE_VERSION}`;
const USER_AGENT = "codex-web-gpt-launcher-updater";
const MAX_REDIRECTS = 5;
// A launcher started at sign-in can run its only check before the network is up, or while a new
// release is still uploading its assets. Retry failures a few times; success is still checked once.
const UPDATE_CHECK_RETRY_DELAYS_MS = [60_000, 5 * 60_000, 30 * 60_000];

function parseVersion(value) {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/.exec(String(value || "").trim());
  if (!match) return null;
  return { major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3]), prerelease: match[4] || null };
}
function compareVersions(left, right) {
  const a = parseVersion(left), b = parseVersion(right);
  if (!a || !b) throw new Error(`Invalid release version comparison: ${left} / ${right}`);
  for (const key of ["major", "minor", "patch"]) if (a[key] !== b[key]) return a[key] > b[key] ? 1 : -1;
  if (a.prerelease === b.prerelease) return 0;
  if (a.prerelease === null) return 1;
  if (b.prerelease === null) return -1;
  return a.prerelease.localeCompare(b.prerelease, "en", { numeric: true });
}
function releaseVersion(tagName) {
  const version = String(tagName || "").replace(/^v/, "");
  if (!parseVersion(version)) throw new Error(`GitHub returned an invalid release tag: ${tagName}`);
  return version;
}
function releaseAssetName(version, platform = process.platform, arch = process.arch) {
  return platform === "win32" && arch === "x64" ? `codex-web-gpt-${version}-win-x64.exe` : null;
}
function expectedChecksum(contents, assetName) {
  for (const line of String(contents || "").split(/\r?\n/)) {
    const match = /^([a-fA-F0-9]{64})\s+(.+)$/.exec(line.trim());
    if (match && match[2] === assetName) return match[1].toLowerCase();
  }
  throw new Error(`checksums.txt has no entry for ${assetName}`);
}
function validateReleaseAssetUrl(raw, version, assetName) {
  if (version !== REVIEWED_RELEASE_VERSION) throw new Error(`Refusing unreviewed release version: ${version}`);
  const url = new URL(raw), expectedPath = `/${REPOSITORY}/releases/download/v${version}/${assetName}`;
  if (url.protocol !== "https:" || url.hostname !== "github.com" || url.pathname !== expectedPath) throw new Error(`GitHub returned an unexpected release asset URL for ${assetName}`);
  return url.toString();
}

function createUpdateDownloader(createRequest, idleTimeoutMs = 60_000) {
  const validateUrl = value => {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) {
      throw new Error("Refusing non-HTTPS or credential-bearing update URL");
    }
    return url.toString();
  };

  async function* chunks(url) {
    const request = createRequest({
      url: validateUrl(url),
      headers: { Accept: "application/vnd.github+json", "User-Agent": USER_AGENT },
      credentials: "omit",
      cache: "no-store",
      redirect: "manual",
    });
    let timer;
    let response;
    let failure;
    let finished = false;
    let rejectResponse;
    const fail = error => {
      if (finished || failure) return;
      failure = error;
      rejectResponse(error);
      response?.destroy(error);
      request.abort();
    };
    const armTimeout = () => {
      clearTimeout(timer);
      timer = setTimeout(() => fail(new Error("Update request timed out")), idleTimeoutMs);
      timer.unref?.();
    };
    try {
      await new Promise((resolve, reject) => {
        rejectResponse = reject;
        let redirects = 0;
        request.on("error", fail);
        request.on("abort", () => fail(new Error("Update download was aborted")));
        // net.fetch cancels manual redirects instead of exposing a 3xx response.
        // ClientRequest lets us validate every destination before following it.
        request.on("redirect", (_status, _method, destination) => {
          try {
            if (++redirects > MAX_REDIRECTS) throw new Error("Too many redirects while downloading update");
            validateUrl(destination);
            armTimeout();
            request.followRedirect();
          } catch (error) {
            fail(error);
          }
        });
        request.once("response", incoming => {
          response = incoming;
          response.on("error", fail);
          response.on("aborted", () => fail(new Error("Update download was interrupted")));
          resolve();
        });
        armTimeout();
        request.end();
      });
      if (failure) throw failure;
      if (response.statusCode !== 200) throw new Error(`Update download failed with HTTP ${response.statusCode}`);
      armTimeout();
      for await (const chunk of response) {
        armTimeout();
        yield chunk;
      }
    } finally {
      finished = true;
      clearTimeout(timer);
      response?.destroy();
      request.abort();
    }
  }

  return {
    async downloadText(url, maxBytes = 2 * 1024 * 1024) {
      const parts = [];
      let bytes = 0;
      for await (const chunk of chunks(url)) {
        bytes += chunk.length;
        if (bytes > maxBytes) throw new Error("Update metadata exceeded its size limit");
        parts.push(chunk);
      }
      return Buffer.concat(parts).toString("utf8");
    },
    async downloadFile(url, destination) {
      await pipeline(chunks(url), fs.createWriteStream(destination, { flags: "wx", mode: 0o600 }));
    },
  };
}

function sha256(filePath) {
  const hash = crypto.createHash("sha256"), fd = fs.openSync(filePath, "r"), buffer = Buffer.allocUnsafe(1024 * 1024);
  try { for (;;) { const count = fs.readSync(fd, buffer, 0, buffer.length, null); if (!count) break; hash.update(buffer.subarray(0, count)); } } finally { fs.closeSync(fd); }
  return hash.digest("hex");
}
function buildJob({ version, platform, executablePath, assetPath, tempRoot, logPath }) {
  if (platform !== "win32") throw new Error(`Updates are not supported on ${platform}`);
  return { version, platform, parentPid: process.pid, tempRoot, logPath, source: assetPath, target: executablePath };
}
function reviewedRelease(platform = process.platform, arch = process.arch) {
  const assetName = releaseAssetName(REVIEWED_RELEASE_VERSION, platform, arch);
  if (!assetName) return { tag_name: `v${REVIEWED_RELEASE_VERSION}`, assets: [] };
  return {
    tag_name: `v${REVIEWED_RELEASE_VERSION}`,
    assets: [
      { name: assetName, browser_download_url: `${REVIEWED_RELEASE_BASE_URL}/${assetName}` },
      { name: "checksums.txt", browser_download_url: `${REVIEWED_RELEASE_BASE_URL}/checksums.txt` },
    ],
  };
}
function defaultDependencies() {
  // Chromium owns the launcher's system proxy/PAC policy. Do not bypass it with
  // Node HTTPS or borrow cookies from the authenticated ChatGPT browser profile.
  const { downloadText, downloadFile } = createUpdateDownloader(
    options => require("electron").net.request(options),
  );
  return { fetchRelease: async () => reviewedRelease(), downloadText, downloadFile, sha256,
    spawnWorker(runtimeExecutable, workerPath, jobPath) { return spawn(runtimeExecutable, [workerPath, jobPath], { detached: true, stdio: "ignore", windowsHide: true }); },
  };
}
function createUpdateController({ currentVersion, platform, arch, packaged, executablePath, runtimeExecutable, logsDirectory, publish, logger, retryDelaysMs = UPDATE_CHECK_RETRY_DELAYS_MS, dependencies = {} }) {
  const deps = { ...defaultDependencies(), ...dependencies };
  const supportedAsset = releaseAssetName(currentVersion, platform, arch);
  let state = packaged && supportedAsset ? { status: "idle" } : { status: "disabled" }, checked = false, failedChecks = 0, pending = null, candidate = null;
  const transition = (next) => { state = next; publish?.(state); return state; };
  async function checkOnce() {
    if (state.status === "disabled" || checked) return state;
    checked = true; return check();
  }
  async function check() {
    transition({ status: "checking" });
    try {
      const release = await deps.fetchRelease();
      if (release?.draft === true || release?.prerelease === true) { candidate = null; return transition({ status: "up-to-date" }); }
      const version = releaseVersion(release?.tag_name);
      if (version !== REVIEWED_RELEASE_VERSION) throw new Error(`Refusing unreviewed release version: ${version}`);
      if (compareVersions(version, currentVersion) <= 0) { candidate = null; return transition({ status: "up-to-date" }); }
      const assetName = releaseAssetName(version, platform, arch); if (!assetName) return transition({ status: "disabled" });
      const assets = Array.isArray(release?.assets) ? release.assets : [], asset = assets.find((item) => item?.name === assetName), checksums = assets.find((item) => item?.name === "checksums.txt");
      if (!asset?.browser_download_url || !checksums?.browser_download_url) throw new Error(`Release v${version} is missing ${assetName} or checksums.txt`);
      candidate = { version, assetName, assetUrl: validateReleaseAssetUrl(asset.browser_download_url, version, assetName), checksumsUrl: validateReleaseAssetUrl(checksums.browser_download_url, version, "checksums.txt") };
      logger?.info("launcher.update_available", { currentVersion, version, platform, arch }); return transition({ status: "available", version });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const retryInMs = retryDelaysMs[failedChecks];
      failedChecks += 1;
      logger?.warn("launcher.update_check_failed", {
        message,
        ...(retryInMs !== undefined ? { retryInMs } : {}),
      });
      const failed = transition({ status: "error", message });
      if (retryInMs !== undefined) {
        const timer = setTimeout(() => {
          // Only a still-failed check is repeated; nothing else leaves the error state.
          if (state === failed) void check();
        }, retryInMs);
        timer.unref?.();
      }
      return failed;
    }
  }
  async function beginInstall() {
    if (pending) throw new Error("An update is already being prepared");
    if (state.status !== "available" || !candidate) throw new Error("No launcher update is available");
    const available = candidate;
    pending = (async () => {
      transition({ status: "downloading", version: available.version }); const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "codex-web-gpt-update-"));
      try {
        const expected = expectedChecksum(await deps.downloadText(available.checksumsUrl), available.assetName), assetPath = path.join(tempRoot, available.assetName);
        await deps.downloadFile(available.assetUrl, assetPath);
        if (deps.sha256(assetPath) !== expected) throw new Error(`SHA-256 verification failed for ${available.assetName}`);
        const workerPath = path.join(tempRoot, "update-worker.cjs"); fs.copyFileSync(path.join(__dirname, "update-worker.cjs"), workerPath);
        const jobPath = path.join(tempRoot, "job.json");
        fs.writeFileSync(jobPath, `${JSON.stringify(buildJob({ version: available.version, platform, executablePath, assetPath, tempRoot, logPath: path.join(logsDirectory, "update-worker.log") }))}\n`, { mode: 0o600 });
        const child = deps.spawnWorker(runtimeExecutable, workerPath, jobPath);
        if (!Number.isInteger(child?.pid) || child.pid <= 0) throw new Error("The update worker did not start");
        child.unref?.(); logger?.info("launcher.update_worker_started", { pid: child.pid, version: available.version }); transition({ status: "installing", version: available.version });
        return { child, tempRoot, version: available.version };
      } catch (error) { fs.rmSync(tempRoot, { recursive: true, force: true }); transition({ status: "available", version: available.version }); throw error; }
    })();
    try { return await pending; } finally { pending = null; }
  }
  function cancelInstall(launch) { try { launch?.child?.kill(); } catch {} if (launch?.tempRoot) fs.rmSync(launch.tempRoot, { recursive: true, force: true }); if (candidate) transition({ status: "available", version: candidate.version }); }
  return { getState: () => state, checkOnce, beginInstall, cancelInstall };
}
module.exports = { REVIEWED_RELEASE_VERSION, buildJob, compareVersions, createUpdateController, createUpdateDownloader, expectedChecksum, parseVersion, releaseAssetName, releaseVersion, reviewedRelease, validateReleaseAssetUrl };
