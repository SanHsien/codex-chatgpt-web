const path = require("node:path");
const { spawnSync } = require("node:child_process");

const overwriteConsent = "CODEX_WEB_GPT_SMOKE_ALLOW_OVERWRITE";

function checkInstallOverwrite(guid, env = process.env, query = spawnSync) {
  const subkey = `Software\\${guid}`.replace(/'/g, "''");
  // OpenSubKey distinguishes an absent key from a failed query without parsing localized errors.
  const script = `
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$key = [Microsoft.Win32.Registry]::CurrentUser.OpenSubKey('${subkey}')
try {
  $value = if ($null -eq $key) { $null } else { $key.GetValue('InstallLocation', $null, [Microsoft.Win32.RegistryValueOptions]::DoNotExpandEnvironmentNames) }
  # Windows PowerShell 5.1 prints nothing for ConvertTo-Json $null, so emit the literal.
  if ($null -eq $value) { 'null' } else { ConvertTo-Json -InputObject $value -Compress }
} finally {
  if ($null -ne $key) { $key.Dispose() }
}`;
  const result = query("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script], {
    encoding: "utf8", windowsHide: true, timeout: 15_000,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Cannot check existing installation: ${result.stderr?.trim() || "registry query failed"}`);
  const location = JSON.parse(result.stdout.trim());
  if (location === null) return null;
  if (typeof location !== "string" || !path.win32.isAbsolute(location)) {
    throw new Error("Windows registry contains an invalid InstallLocation; refusing package smoke installation");
  }
  if (env[overwriteConsent] !== "1") {
    throw new Error(`Refusing to overwrite existing Codex Web GPT installation at ${location} (HKCU\\Software\\${guid} InstallLocation). Set ${overwriteConsent}=1 only to explicitly allow replacement.`);
  }
  return location;
}

module.exports = { checkInstallOverwrite };
