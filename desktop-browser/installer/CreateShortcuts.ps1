param(
    [Parameter(Mandatory = $true)]
    [string]$InstallDir
)

$ErrorActionPreference = 'Stop'

$exePath = Join-Path $InstallDir 'MadsjeezSellerBrowser.exe'
if (-not (Test-Path $exePath)) {
    throw "No se encontro $exePath"
}

function New-AppShortcut {
    param([string]$LinkPath)

    $shell = New-Object -ComObject WScript.Shell
    $shortcut = $shell.CreateShortcut($LinkPath)
    $shortcut.TargetPath = $exePath
    $shortcut.WorkingDirectory = $InstallDir
    $shortcut.Description = 'Madsjeez Seller Browser'
    $shortcut.IconLocation = "$exePath,0"
    $shortcut.Save()
}

$shell = New-Object -ComObject WScript.Shell
$desktop = $shell.SpecialFolders.Item('Desktop')
$programs = $shell.SpecialFolders.Item('Programs')
$startMenu = Join-Path $programs 'Madsjeez'

if (-not (Test-Path $startMenu)) {
    New-Item -ItemType Directory -Path $startMenu -Force | Out-Null
}

New-AppShortcut (Join-Path $desktop 'Madsjeez Seller Browser.lnk')
New-AppShortcut (Join-Path $startMenu 'Madsjeez Seller Browser.lnk')
