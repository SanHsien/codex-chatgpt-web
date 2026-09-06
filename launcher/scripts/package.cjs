const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const electronBuilderCli = require.resolve("electron-builder/out/cli/cli.js", { paths: [root] });
const requested = process.argv[2] || "--win";

if (requested !== "--win" || process.platform !== "win32") {
  throw new Error("Windows-only packaging must run on Windows with --win");
}

const env = { ...process.env };
if (!env.CSC_LINK && !env.CSC_NAME) env.CSC_IDENTITY_AUTO_DISCOVERY = "false";
const staging = fs.mkdtempSync(path.join(os.tmpdir(), "codex-web-gpt-package-"));
const artifactsDirectory = path.join(root, "artifacts");

try {
  const result = spawnSync("node", [electronBuilderCli, "--win", "--publish", "never", `--config.directories.output=${staging}`], {
    cwd: root, env, stdio: "inherit", shell: false,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);

  fs.mkdirSync(artifactsDirectory, { recursive: true });
  for (const entry of fs.readdirSync(artifactsDirectory, { withFileTypes: true })) {
    if (entry.isFile() && /\.(?:exe|blockmap)$/i.test(entry.name)) fs.rmSync(path.join(artifactsDirectory, entry.name), { force: true });
  }
  const artifacts = fs.readdirSync(staging, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(?:exe|blockmap)$/i.test(entry.name));
  if (!artifacts.some((entry) => /-win-x64\.exe$/i.test(entry.name))) throw new Error(`electron-builder produced no Windows installer in ${staging}`);
  for (const artifact of artifacts) fs.copyFileSync(path.join(staging, artifact.name), path.join(artifactsDirectory, artifact.name));
} finally {
  fs.rmSync(staging, { recursive: true, force: true });
}
