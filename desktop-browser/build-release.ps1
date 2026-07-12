# Madsjeez Seller Browser - Release build
# Produces a ~138 MB ZIP (framework-dependent) ready to distribute.

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot
$Version = "0.1.0"
$PublishDir = Join-Path $ProjectRoot "publish\win-x64"
$ReleaseDir = Join-Path $ProjectRoot "release"
$ZipName = "MadsjeezSellerBrowser-v$Version-win-x64.zip"
$ZipPath = Join-Path $ReleaseDir $ZipName

Write-Host "=== Madsjeez Seller Browser v$Version ===" -ForegroundColor Cyan
Write-Host "Publishing win-x64 (requires .NET 8 Desktop Runtime on target PC)..." -ForegroundColor Yellow

dotnet publish "$ProjectRoot\MadsjeezSellerBrowser.csproj" `
    -c Release `
    -r win-x64 `
    --self-contained false `
    -p:PublishSingleFile=false `
    -o $PublishDir

if ($LASTEXITCODE -ne 0) { throw "dotnet publish failed" }

Copy-Item (Join-Path $ProjectRoot "installer\Instalar.bat") $PublishDir -Force
Copy-Item (Join-Path $ProjectRoot "installer\LEEME.txt") $PublishDir -Force

Write-Host "Creating ZIP package..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path $ReleaseDir | Out-Null
if (Test-Path $ZipPath) { Remove-Item $ZipPath -Force }

Compress-Archive -Path "$PublishDir\*" -DestinationPath $ZipPath -CompressionLevel Optimal

$hash = (Get-FileHash $ZipPath -Algorithm SHA256).Hash.ToLower()
$size = (Get-Item $ZipPath).Length
$sizeMB = [math]::Round($size / 1MB, 1)

Write-Host ""
Write-Host "Release ready!" -ForegroundColor Green
Write-Host "  Folder: $PublishDir"
Write-Host "  ZIP:    $ZipPath ($sizeMB MB)"
Write-Host "  SHA256: $hash"
Write-Host "  Size:   $size bytes"
Write-Host ""
Write-Host "Run: $PublishDir\MadsjeezSellerBrowser.exe" -ForegroundColor Cyan
Write-Host ""
Write-Host "Upload the ZIP and set downloadUrl in the API (updates table)." -ForegroundColor Yellow
