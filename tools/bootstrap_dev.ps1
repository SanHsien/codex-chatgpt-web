[CmdletBinding()]
param(
  [switch]$CheckOnly
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$expectedBun = '1.4.0'
$env:BUN_INSTALL_CACHE_DIR = Join-Path $repoRoot '.bun-cache'

function Invoke-Checked {
  param([string]$FilePath, [string[]]$Arguments, [string]$WorkingDirectory)
  Push-Location $WorkingDirectory
  try {
    & $FilePath @Arguments
    if ($LASTEXITCODE -ne 0) { throw "Command failed ($LASTEXITCODE): $FilePath $($Arguments -join ' ')" }
  } finally {
    Pop-Location
  }
}

function Test-ElectronRuntime {
  param([string]$LauncherRoot)
  $electronRoot = Join-Path $LauncherRoot 'node_modules/electron'
  $distRoot = Join-Path $electronRoot 'dist'
  $pathFile = Join-Path $electronRoot 'path.txt'
  if (-not (Test-Path -LiteralPath $pathFile -PathType Leaf) -or -not (Test-Path -LiteralPath $distRoot -PathType Container)) {
    return $false
  }
  $relativePath = (Get-Content -LiteralPath $pathFile -Raw).Trim()
  if (-not $relativePath -or [IO.Path]::IsPathRooted($relativePath) -or $relativePath -match '(^|[\\/])\.\.([\\/]|$)') {
    return $false
  }
  $distFullPath = [IO.Path]::GetFullPath($distRoot)
  $runtimePath = [IO.Path]::GetFullPath((Join-Path $distFullPath $relativePath))
  $distPrefix = $distFullPath.TrimEnd([IO.Path]::DirectorySeparatorChar, [IO.Path]::AltDirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
  if (-not $runtimePath.StartsWith($distPrefix, [StringComparison]::Ordinal)) {
    return $false
  }
  return Test-Path -LiteralPath $runtimePath -PathType Leaf
}

function Test-GitHubAccess {
  if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    throw 'GitHub CLI (gh) is required for strict upstream tracking. Install gh, authenticate with gh auth login --hostname github.com, then rerun bootstrap.'
  }
  $null = & gh auth status --hostname github.com 2>$null
  if ($LASTEXITCODE -ne 0) {
    throw 'Authenticated GitHub CLI access is required for strict upstream tracking. Run gh auth login --hostname github.com, then rerun bootstrap. Bootstrap never signs in for you.'
  }
}

$actualBun = (& bun --version).Trim()
if ($LASTEXITCODE -ne 0 -or $actualBun -ne $expectedBun) {
  throw "Bun $expectedBun is required; found '$actualBun'."
}
Test-GitHubAccess
if ($CheckOnly) {
  Write-Output "BOOTSTRAP PREREQUISITES PASSED: Bun $actualBun and authenticated GitHub CLI access."
  return
}

Invoke-Checked -FilePath 'bun' -Arguments @('install', '--frozen-lockfile') -WorkingDirectory $repoRoot
$launcherRoot = Join-Path $repoRoot 'launcher'
Invoke-Checked -FilePath 'bun' -Arguments @('install', '--frozen-lockfile') -WorkingDirectory $launcherRoot
if (-not (Test-ElectronRuntime -LauncherRoot $launcherRoot)) {
  $lifecycleScript = Join-Path $launcherRoot 'node_modules/electron/install.js'
  if (-not (Test-Path -LiteralPath $lifecycleScript -PathType Leaf)) {
    throw "Electron runtime is incomplete and its installed lifecycle script is missing: $lifecycleScript"
  }
  Invoke-Checked -FilePath 'bun' -Arguments @('node_modules/electron/install.js') -WorkingDirectory $launcherRoot
  if (-not (Test-ElectronRuntime -LauncherRoot $launcherRoot)) {
    throw 'Electron lifecycle repair did not produce a safe runtime under launcher/node_modules/electron/dist.'
  }
  Write-Output 'ELECTRON_RUNTIME=repaired'
} else {
  Write-Output 'ELECTRON_RUNTIME=ready'
}
Write-Output "BOOTSTRAP PASSED: Bun $actualBun, both frozen lockfiles, and Electron runtime."
