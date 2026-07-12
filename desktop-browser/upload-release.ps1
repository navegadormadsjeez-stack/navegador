# Subir release a GitHub (requiere permisos de escritura en el repo)

$ErrorActionPreference = "Stop"
$Version = "0.1.0"
$Zip = Join-Path $PSScriptRoot "release\MadsjeezSellerBrowser-v$Version-win-x64.zip"

if (-not (Test-Path $Zip)) {
    Write-Host "Ejecuta primero: .\build-release.ps1" -ForegroundColor Red
    exit 1
}

gh release create "v$Version" $Zip `
    --repo navegadormadsjeez-stack/navegador `
    --title "Madsjeez Seller Browser v$Version" `
    --notes "Windows 64-bit. Extrae el ZIP y ejecuta Instalar.bat. Requiere .NET 8 Desktop Runtime."

Write-Host "Release creado. URL de descarga:" -ForegroundColor Green
Write-Host "https://github.com/navegadormadsjeez-stack/navegador/releases/download/v$Version/MadsjeezSellerBrowser-v$Version-win-x64.zip"
