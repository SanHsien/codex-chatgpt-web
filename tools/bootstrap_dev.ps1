[CmdletBinding()]
param()

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

$actualBun = (& bun --version).Trim()
if ($LASTEXITCODE -ne 0 -or $actualBun -ne $expectedBun) {
  throw "Bun $expectedBun is required; found '$actualBun'."
}

Invoke-Checked -FilePath 'bun' -Arguments @('install', '--frozen-lockfile') -WorkingDirectory $repoRoot
Invoke-Checked -FilePath 'bun' -Arguments @('install', '--frozen-lockfile') -WorkingDirectory (Join-Path $repoRoot 'launcher')
Write-Output "BOOTSTRAP PASSED: Bun $actualBun and both frozen lockfiles."
