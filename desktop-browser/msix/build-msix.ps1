# Builds an MSIX package for future Microsoft Store submission (development identity).
# Requires Windows SDK (MakeAppx.exe, optional SignTool).
#
# Usage:
#   .\build-msix.ps1
#   .\build-msix.ps1 -CertificatePath "C:\certs\dev.pfx" -CertificatePassword "secret"
#
# Public Store builds MUST use the official Partner Center Publisher identity.
# Self-signed certificates are for local development/testing only.

[CmdletBinding()]
param(
    [string]$ProjectRoot = (Split-Path (Split-Path $PSScriptRoot -Parent) -Parent),
    [string]$Version = "0.1.14.0",
    [string]$OutputDir = "",
    [string]$CertificatePath = "",
    [SecureString]$CertificatePassword,
    [switch]$AllowUnsignedDevInstall
)

$ErrorActionPreference = "Stop"

$DesktopRoot = Join-Path $ProjectRoot "desktop-browser"
$PublishDir = Join-Path $DesktopRoot "publish\win-x64"
$MsixRoot = Join-Path $DesktopRoot "msix"
$StagingDir = Join-Path $MsixRoot "staging"
$ManifestPath = Join-Path $MsixRoot "Package.appxmanifest"

if ([string]::IsNullOrWhiteSpace($OutputDir)) {
    $OutputDir = Join-Path $DesktopRoot "release"
}

function Find-SdkTool {
    param([string]$ToolName)
    $kitsRoot = "${env:ProgramFiles(x86)}\Windows Kits\10\bin"
    if (-not (Test-Path $kitsRoot)) { return $null }
    Get-ChildItem $kitsRoot -Directory | Sort-Object Name -Descending | ForEach-Object {
        $candidate = Join-Path $_.FullName "x64\$ToolName"
        if (Test-Path $candidate) { return $candidate }
    } | Select-Object -First 1
}

Write-Host "=== MadsJeez Browser MSIX Build ===" -ForegroundColor Cyan
Write-Host "Version: $Version"

Write-Host "Publishing desktop app..." -ForegroundColor Yellow
dotnet publish (Join-Path $DesktopRoot "MadsjeezSellerBrowser.csproj") `
    -c Release -r win-x64 --self-contained true `
    -p:PublishSingleFile=false -p:PublishReadyToRun=true `
    -o $PublishDir
if ($LASTEXITCODE -ne 0) { throw "dotnet publish failed" }

Copy-Item (Join-Path $DesktopRoot "Assets\app.ico") (Join-Path $PublishDir "app.ico") -Force

if (Test-Path $StagingDir) { Remove-Item $StagingDir -Recurse -Force }
New-Item -ItemType Directory -Force -Path $StagingDir | Out-Null
Copy-Item "$PublishDir\*" $StagingDir -Recurse -Force
Copy-Item $ManifestPath (Join-Path $StagingDir "AppxManifest.xml") -Force

$assetsDir = Join-Path $StagingDir "Assets"
New-Item -ItemType Directory -Force -Path $assetsDir | Out-Null
$iconPng = Join-Path $DesktopRoot "Assets\app-icon.png"
if (Test-Path $iconPng) {
    Copy-Item $iconPng (Join-Path $assetsDir "StoreLogo.png") -Force
    Copy-Item $iconPng (Join-Path $assetsDir "Square150x150Logo.png") -Force
    Copy-Item $iconPng (Join-Path $assetsDir "Square44x44Logo.png") -Force
} else {
    Write-Warning "Assets\app-icon.png not found; add Store logos before Store submission."
}

$makeAppx = Find-SdkTool "makeappx.exe"
if (-not $makeAppx) {
    throw "MakeAppx.exe not found. Install Windows 10/11 SDK."
}

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
$msixPath = Join-Path $OutputDir "MadsJeezBrowser_$($Version -replace '\.','_').msix"

Write-Host "Packaging MSIX..." -ForegroundColor Yellow
& $makeAppx pack /d $StagingDir /p $msixPath /o
if ($LASTEXITCODE -ne 0) { throw "MakeAppx pack failed" }

if ($CertificatePath) {
    $signTool = Find-SdkTool "signtool.exe"
    if (-not $signTool) { throw "SignTool.exe not found." }

    Write-Host "Signing MSIX with provided certificate..." -ForegroundColor Yellow
    if ($CertificatePassword) {
        $plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
            [Runtime.InteropServices.Marshal]::SecureStringToBSTR($CertificatePassword))
        & $signTool sign /fd SHA256 /f $CertificatePath /p $plain $msixPath
    } else {
        & $signTool sign /fd SHA256 /f $CertificatePath $msixPath
    }
    if ($LASTEXITCODE -ne 0) { throw "SignTool failed" }
    Write-Host "MSIX signed successfully." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "MSIX created UNSIGNED (development only)." -ForegroundColor Yellow
    Write-Host "For Microsoft Store, replace Identity/Publisher in Package.appxmanifest with Partner Center values and sign with the official certificate."
    Write-Host "Self-signed certs are for local dev only — not for public distribution."
    if (-not $AllowUnsignedDevInstall) {
        Write-Host "Pass -CertificatePath for signing, or -AllowUnsignedDevInstall to acknowledge unsigned output."
        exit 2
    }
}

Write-Host "MSIX ready: $msixPath" -ForegroundColor Green
Get-Item $msixPath | Select-Object FullName, Length, LastWriteTime
