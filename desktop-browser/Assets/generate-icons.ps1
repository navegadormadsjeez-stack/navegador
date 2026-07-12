# Regenera app.ico desde app-icon.png (fuente: logo oficial Madsjeez Browser)
$ErrorActionPreference = 'Stop'
$Assets = $PSScriptRoot
$png = Join-Path $Assets 'app-icon.png'
$ico = Join-Path $Assets 'app.ico'

if (-not (Test-Path $png)) {
    throw "Falta $png — coloca el PNG oficial como app-icon.png"
}

python -c @"
from PIL import Image
from pathlib import Path
img = Image.open(Path(r'$png')).convert('RGBA')
sizes = [(256,256),(128,128),(64,64),(48,48),(32,32),(16,16)]
img.save(Path(r'$ico'), format='ICO', sizes=sizes)
print('OK:', r'$ico')
"@

Write-Host "Icono generado: $ico" -ForegroundColor Green
