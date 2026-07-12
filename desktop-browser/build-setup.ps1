# DEPRECATED: Usar build-installer.ps1 (Inno Setup — instalador profesional)
# Este script genera un auto-extraible 7-Zip solo como respaldo.

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot
$BuildInstaller = Join-Path $ProjectRoot "build-installer.ps1"
$IsccCandidates = @(
    "${env:ProgramFiles(x86)}\Inno Setup 6\ISCC.exe"
    "${env:ProgramFiles}\Inno Setup 6\ISCC.exe"
    "${env:LocalAppData}\Programs\Inno Setup 6\ISCC.exe"
)
$Iscc = $IsccCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1

if (Test-Path $Iscc) {
    Write-Host "Redirigiendo a build-installer.ps1 (Inno Setup)..." -ForegroundColor Cyan
    & $BuildInstaller
    exit $LASTEXITCODE
}

Write-Host "Inno Setup no encontrado. Usando extractor 7-Zip (legacy)..." -ForegroundColor Yellow
Write-Host "Instala Inno Setup para el instalador profesional: https://jrsoftware.org/isdl.php" -ForegroundColor Yellow
Write-Host ""

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

if (-not (Test-Path $SevenZip)) {
    throw "7-Zip no encontrado. Instala Inno Setup o 7-Zip."
}

Write-Host "=== Madsjeez Seller Browser Setup v$Version (legacy 7-Zip) ===" -ForegroundColor Cyan

dotnet publish "$ProjectRoot\MadsjeezSellerBrowser.csproj" `
    -c Release -r win-x64 --self-contained false `
    -p:PublishSingleFile=false -o $PublishDir
if ($LASTEXITCODE -ne 0) { throw "dotnet publish failed" }

if (Test-Path $StageDir) { Remove-Item $StageDir -Recurse -Force }
New-Item -ItemType Directory -Force -Path $StageDir | Out-Null

Copy-Item -Path "$PublishDir\*" -Destination $StageDir -Recurse -Force
Copy-Item (Join-Path $ProjectRoot "installer\Instalar.bat") $StageDir -Force
Copy-Item (Join-Path $ProjectRoot "installer\CreateShortcuts.ps1") $StageDir -Force
Copy-Item (Join-Path $ProjectRoot "Assets\app.ico") $StageDir -Force

if (Test-Path $ArchivePath) { Remove-Item $ArchivePath -Force }
& $SevenZip a -t7z -mx=5 -mfb=64 -md=32m -ms=on $ArchivePath "$StageDir\*" | Out-Null
if ($LASTEXITCODE -ne 0) { throw "7z compression failed" }

$config = @"
;!@Install@!UTF-8!
Title="Madsjeez Seller Browser"
BeginPrompt="Instalar Madsjeez Seller Browser v$Version en este equipo?"
ExecuteFile="Instalar.bat"
ExecuteParameters="/SILENT"
;!@InstallEnd@!
"@
Set-Content -Path $ConfigPath -Value $config -Encoding UTF8

New-Item -ItemType Directory -Force -Path $ReleaseDir | Out-Null
if (Test-Path $SetupPath) { Remove-Item $SetupPath -Force }

cmd /c "copy /b `"$SfxModule`" + `"$ConfigPath`" + `"$ArchivePath`" `"$SetupPath`"" | Out-Null

Remove-Item $StageDir -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item $ArchivePath -Force -ErrorAction SilentlyContinue
Remove-Item $ConfigPath -Force -ErrorAction SilentlyContinue

$hash = (Get-FileHash $SetupPath -Algorithm SHA256).Hash.ToLower()
$size = (Get-Item $SetupPath).Length

Write-Host "Setup.exe ready (legacy): $SetupPath" -ForegroundColor Green
Write-Host "SHA256: $hash"
