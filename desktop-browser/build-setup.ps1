# Madsjeez Seller Browser - Chrome-style Setup.exe installer
# Builds framework-dependent publish + 7-Zip self-extracting installer (.exe)

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot
$Version = "0.1.0"
$PublishDir = Join-Path $ProjectRoot "publish\win-x64"
$ReleaseDir = Join-Path $ProjectRoot "release"
$SetupName = "MadsjeezSellerBrowserSetup.exe"
$SetupPath = Join-Path $ReleaseDir $SetupName
$StageDir = Join-Path $ProjectRoot ".setup-stage"
$ArchivePath = Join-Path $ProjectRoot ".setup-stage.7z"
$ConfigPath = Join-Path $ProjectRoot ".setup-config.txt"
$SevenZip = "${env:ProgramFiles}\7-Zip\7z.exe"
$SfxModule = "${env:ProgramFiles}\7-Zip\7z.sfx"

Write-Host "=== Madsjeez Seller Browser Setup v$Version ===" -ForegroundColor Cyan

if (-not (Test-Path $SevenZip)) {
    throw "7-Zip no encontrado. Instala 7-Zip desde https://www.7-zip.org/"
}

Write-Host "Publishing win-x64..." -ForegroundColor Yellow
dotnet publish "$ProjectRoot\MadsjeezSellerBrowser.csproj" `
    -c Release `
    -r win-x64 `
    --self-contained false `
    -p:PublishSingleFile=false `
    -o $PublishDir

if ($LASTEXITCODE -ne 0) { throw "dotnet publish failed" }

Write-Host "Staging installer files..." -ForegroundColor Yellow
if (Test-Path $StageDir) { Remove-Item $StageDir -Recurse -Force }
New-Item -ItemType Directory -Force -Path $StageDir | Out-Null

Copy-Item -Path "$PublishDir\*" -Destination $StageDir -Recurse -Force
Copy-Item (Join-Path $ProjectRoot "installer\Instalar.bat") $StageDir -Force

if (Test-Path $ArchivePath) { Remove-Item $ArchivePath -Force }

Write-Host "Compressing (puede tardar unos minutos)..." -ForegroundColor Yellow
& $SevenZip a -t7z -mx=5 -mfb=64 -md=32m -ms=on $ArchivePath "$StageDir\*" | Out-Null
if ($LASTEXITCODE -ne 0) { throw "7z compression failed" }

$config = @"
;!@Install@!UTF-8!
Title="Madsjeez Seller Browser"
BeginPrompt="Instalar Madsjeez Seller Browser v$Version en este equipo?"
RunProgram="Instalar.bat /SILENT"
;!@InstallEnd@!
"@
Set-Content -Path $ConfigPath -Value $config -Encoding UTF8

New-Item -ItemType Directory -Force -Path $ReleaseDir | Out-Null
if (Test-Path $SetupPath) { Remove-Item $SetupPath -Force }

Write-Host "Building Setup.exe..." -ForegroundColor Yellow
cmd /c "copy /b `"$SfxModule`" + `"$ConfigPath`" + `"$ArchivePath`" `"$SetupPath`"" | Out-Null
if (-not (Test-Path $SetupPath)) { throw "Failed to create Setup.exe" }

Remove-Item $StageDir -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item $ArchivePath -Force -ErrorAction SilentlyContinue
Remove-Item $ConfigPath -Force -ErrorAction SilentlyContinue

$hash = (Get-FileHash $SetupPath -Algorithm SHA256).Hash.ToLower()
$size = (Get-Item $SetupPath).Length
$sizeMB = [math]::Round($size / 1MB, 1)

Write-Host ""
Write-Host "Setup.exe ready!" -ForegroundColor Green
Write-Host "  File:   $SetupPath"
Write-Host "  Size:   $sizeMB MB ($size bytes)"
Write-Host "  SHA256: $hash"
Write-Host ""

@{
    path = $SetupPath
    size = $size
    sha256 = $hash
    version = $Version
} | ConvertTo-Json
