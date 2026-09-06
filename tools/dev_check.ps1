[CmdletBinding()]
param(
  [string]$BaseRef
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$expectedBun = '1.4.0'

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

$actualBun = (& bun --version).Trim()
if ($LASTEXITCODE -ne 0 -or $actualBun -ne $expectedBun) {
  throw "Bun $expectedBun is required; found '$actualBun'."
}

Invoke-Checked -FilePath 'bun' -Arguments @('test', 'tests/fork-contract.test.ts', 'tests/upstream-baseline.test.ts')
Invoke-Checked -FilePath 'bun' -Arguments @('run', 'scripts/check-upstream-baseline.ts', '--strict')
Invoke-Checked -FilePath 'bun' -Arguments @('run', 'verify')
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
Write-Output "DEV CHECK PASSED: Bun $actualBun, fork contract, upstream baseline, upstream verify, and whitespace."
