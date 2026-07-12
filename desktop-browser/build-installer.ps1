# Madsjeez Seller Browser — Instalador profesional (Inno Setup)
# Genera release\MadsjeezSellerBrowserSetup.exe
# Requiere Inno Setup 6: https://jrsoftware.org/isinfo.php

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot
$Version = "0.1.8"
$PublishDir = Join-Path $ProjectRoot "publish\win-x64"
$ReleaseDir = Join-Path $ProjectRoot "release"
$SetupPath = Join-Path $ReleaseDir "MadsjeezSellerBrowserSetup.exe"
$IssFile = Join-Path $ProjectRoot "installer\MadsjeezSellerBrowser.iss"
$IsccCandidates = @(
    "${env:ProgramFiles(x86)}\Inno Setup 6\ISCC.exe"
    "${env:ProgramFiles}\Inno Setup 6\ISCC.exe"
    "${env:LocalAppData}\Programs\Inno Setup 6\ISCC.exe"
)
$Iscc = $IsccCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1

Write-Host "=== Madsjeez Seller Browser Installer v$Version ===" -ForegroundColor Cyan

if (-not (Test-Path $Iscc)) {
    Write-Host ""
    Write-Host "Inno Setup 6 no esta instalado." -ForegroundColor Red
    Write-Host "Descargalo gratis: https://jrsoftware.org/isdl.php" -ForegroundColor Yellow
    Write-Host "O en CI/GitHub Actions se instala automaticamente." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Alternativa legacy (extractor 7-Zip): .\build-setup.ps1" -ForegroundColor DarkGray
    exit 1
}

Write-Host "Publishing win-x64 (self-contained, .NET incluido)..." -ForegroundColor Yellow
dotnet publish "$ProjectRoot\MadsjeezSellerBrowser.csproj" `
    -c Release `
    -r win-x64 `
    --self-contained true `
    -p:PublishSingleFile=false `
    -p:PublishReadyToRun=true `
    -o $PublishDir

if ($LASTEXITCODE -ne 0) { throw "dotnet publish failed" }

Copy-Item (Join-Path $ProjectRoot "Assets\app.ico") (Join-Path $PublishDir "app.ico") -Force
@('Instalar.bat', 'CreateShortcuts.ps1', 'LEEME.txt') | ForEach-Object {
    Remove-Item (Join-Path $PublishDir $_) -ErrorAction SilentlyContinue
}

New-Item -ItemType Directory -Force -Path $ReleaseDir | Out-Null

Write-Host "Compiling Inno Setup installer..." -ForegroundColor Yellow
& $Iscc $IssFile
if ($LASTEXITCODE -ne 0) { throw "Inno Setup compilation failed" }

if (-not (Test-Path $SetupPath)) { throw "Installer not found at $SetupPath" }

$hash = (Get-FileHash $SetupPath -Algorithm SHA256).Hash.ToLower()
$size = (Get-Item $SetupPath).Length
$sizeMB = [math]::Round($size / 1MB, 1)

Write-Host ""
Write-Host "Installer ready!" -ForegroundColor Green
Write-Host "  File:   $SetupPath"
Write-Host "  Size:   $sizeMB MB ($size bytes)"
Write-Host "  SHA256: $hash"
Write-Host ""
Write-Host "Para firma gratuita (SmartScreen): ver docs/SIGNPATH.md" -ForegroundColor Cyan
Write-Host ""

@{
    path = $SetupPath
    size = $size
    sha256 = $hash
    version = $Version
} | ConvertTo-Json
