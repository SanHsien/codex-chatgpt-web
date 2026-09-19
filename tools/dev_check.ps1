[CmdletBinding()]
param(
  [string]$BaseRef,
  [switch]$Quick
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$expectedBun = '1.4.0'
$summaryDir = Join-Path $repoRoot 'artifacts'
$summaryPath = Join-Path $summaryDir 'quality-summary.json'

# Any new run invalidates prior Full evidence. Quick never recreates it.
if (Test-Path -LiteralPath $summaryPath -PathType Leaf) {
  Remove-Item -LiteralPath $summaryPath -Force
}

function Invoke-Checked {
  param([string]$FilePath, [string[]]$Arguments, [string]$WorkingDirectory = $repoRoot)
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

$actualBun = (& bun --version).Trim()
if ($LASTEXITCODE -ne 0 -or $actualBun -ne $expectedBun) {
  throw "Bun $expectedBun is required; found '$actualBun'."
}
if (-not (Test-ElectronRuntime -LauncherRoot (Join-Path $repoRoot 'launcher'))) {
  throw 'Electron runtime is incomplete. Run pwsh -NoProfile -File tools\bootstrap_dev.ps1, then rerun this check.'
}

Invoke-Checked -FilePath 'bun' -Arguments @('test', 'tests/fork-contract.test.ts', 'tests/upstream-baseline.test.ts', 'tests/dependency-freshness.test.ts')
if (-not $Quick) {
  Invoke-Checked -FilePath 'bun' -Arguments @('run', 'scripts/check-upstream-baseline.ts', '--strict')
  Invoke-Checked -FilePath 'bun' -Arguments @('run', 'scripts/check-dependency-freshness.ts', '--strict')
  Invoke-Checked -FilePath 'bun' -Arguments @('run', 'verify')
} else {
  Invoke-Checked -FilePath 'bun' -Arguments @('run', 'check-version')
  Invoke-Checked -FilePath 'bun' -Arguments @('run', 'typecheck')
}
Invoke-Checked -FilePath 'git' -Arguments @('diff', '--check')
Invoke-Checked -FilePath 'git' -Arguments @('diff', '--cached', '--check')
if ($BaseRef) {
  if ($BaseRef -match '^[0]+$') { throw "BaseRef cannot be an all-zero revision: $BaseRef" }
  $resolvedBase = (& git rev-parse --verify "$BaseRef^{commit}" 2>$null).Trim()
  if ($LASTEXITCODE -ne 0 -or -not $resolvedBase) { throw "BaseRef is not a valid commit: $BaseRef" }
  Invoke-Checked -FilePath 'git' -Arguments @('diff', '--check', "$resolvedBase..HEAD")
} else {
  Invoke-Checked -FilePath 'git' -Arguments @('show', '--check', '--format=', 'HEAD')
}

if (-not $Quick) {
  if (-not (Test-Path -LiteralPath $summaryDir -PathType Container)) {
    New-Item -ItemType Directory -Path $summaryDir -Force | Out-Null
  }
  $headSha = (& git rev-parse --verify HEAD 2>$null)
  if ($LASTEXITCODE -ne 0 -or -not $headSha) { throw 'Unable to resolve current git HEAD.' }
  $summaryPayload = @{
    schema_version = 1
    profile = 'full'
    passed = $true
    commit = $headSha.Trim()
    timestamp = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
    gates = @{
      fork_contract = $true
      upstream_baseline = $true
      dependency_freshness = $true
      verify = $true
      whitespace = $true
    }
  } | ConvertTo-Json -Depth 4
  Set-Content -LiteralPath $summaryPath -Value $summaryPayload -Encoding utf8
  Write-Output "DEV CHECK PASSED: Bun $actualBun, fork contract, strict upstream/dependency checks, verify, and whitespace."
} else {
  Write-Output "QUICK CHECK PASSED: Bun $actualBun, focused fork tests, version, typecheck, and whitespace."
}
