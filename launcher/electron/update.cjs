const crypto = require("node:crypto");
const fs = require("node:fs");
const https = require("node:https");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { pipeline } = require("node:stream/promises");

const REPOSITORY = "miuuyy/codex-chatgpt-web";
const REVIEWED_RELEASE_VERSION = "5.0.4";
const REVIEWED_RELEASE_BASE_URL = `https://github.com/${REPOSITORY}/releases/download/v${REVIEWED_RELEASE_VERSION}`;
const USER_AGENT = "codex-web-gpt-launcher-updater";
const MAX_REDIRECTS = 5;

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
function request(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > MAX_REDIRECTS) return reject(new Error(`Too many redirects while downloading ${url}`));
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return reject(new Error(`Refusing non-HTTPS update URL: ${parsed.protocol}`));
    const req = https.get(parsed, { headers: { Accept: "application/vnd.github+json", "User-Agent": USER_AGENT } }, (response) => {
      if ([301, 302, 303, 307, 308].includes(response.statusCode) && response.headers.location) {
        response.resume(); request(new URL(response.headers.location, parsed).toString(), redirects + 1).then(resolve, reject); return;
      }
      if (response.statusCode !== 200) { response.resume(); reject(new Error(`Update download failed with HTTP ${response.statusCode}`)); return; }
      resolve(response);
    });
    req.setTimeout(60_000, () => req.destroy(new Error("Update request timed out")));
    req.once("error", reject);
  });
}
async function downloadText(url, maxBytes = 2 * 1024 * 1024) {
  const response = await request(url), chunks = []; let bytes = 0;
  for await (const chunk of response) { bytes += chunk.length; if (bytes > maxBytes) throw new Error("Update metadata exceeded its size limit"); chunks.push(chunk); }
  return Buffer.concat(chunks).toString("utf8");
}
async function downloadFile(url, destination) { await pipeline(await request(url), fs.createWriteStream(destination, { flags: "wx", mode: 0o600 })); }
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
  return { fetchRelease: async () => reviewedRelease(), downloadText, downloadFile, sha256,
    spawnWorker(runtimeExecutable, workerPath, jobPath) { return spawn(runtimeExecutable, [workerPath, jobPath], { detached: true, stdio: "ignore", windowsHide: true }); },
  };
}
function createUpdateController({ currentVersion, platform, arch, packaged, executablePath, runtimeExecutable, logsDirectory, publish, logger, dependencies = {} }) {
  const deps = { ...defaultDependencies(), ...dependencies };
  const supportedAsset = releaseAssetName(currentVersion, platform, arch);
  let state = packaged && supportedAsset ? { status: "idle" } : { status: "disabled" }, checked = false, pending = null, candidate = null;
  const transition = (next) => { state = next; publish?.(state); return state; };
  async function checkOnce() {
    if (state.status === "disabled" || checked) return state;
    checked = true; transition({ status: "checking" });
    try {
      const release = await deps.fetchRelease(), version = releaseVersion(release?.tag_name);
      if (version !== REVIEWED_RELEASE_VERSION) throw new Error(`Refusing unreviewed release version: ${version}`);
      if (compareVersions(version, currentVersion) <= 0) { candidate = null; return transition({ status: "up-to-date" }); }
      const assetName = releaseAssetName(version, platform, arch); if (!assetName) return transition({ status: "disabled" });
      const assets = Array.isArray(release?.assets) ? release.assets : [], asset = assets.find((item) => item?.name === assetName), checksums = assets.find((item) => item?.name === "checksums.txt");
      if (!asset?.browser_download_url || !checksums?.browser_download_url) throw new Error(`Release v${version} is missing ${assetName} or checksums.txt`);
      candidate = { version, assetName, assetUrl: validateReleaseAssetUrl(asset.browser_download_url, version, assetName), checksumsUrl: validateReleaseAssetUrl(checksums.browser_download_url, version, "checksums.txt") };
      logger?.info("launcher.update_available", { currentVersion, version, platform, arch }); return transition({ status: "available", version });
    } catch (error) { const message = error instanceof Error ? error.message : String(error); logger?.warn("launcher.update_check_failed", { message }); return transition({ status: "error", message }); }
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
module.exports = { REVIEWED_RELEASE_VERSION, buildJob, compareVersions, createUpdateController, expectedChecksum, parseVersion, releaseAssetName, releaseVersion, reviewedRelease, validateReleaseAssetUrl };
