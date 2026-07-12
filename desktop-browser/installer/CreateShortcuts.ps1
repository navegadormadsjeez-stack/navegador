param(
    [Parameter(Mandatory = $true)]
    [string]$InstallDir
)

$ErrorActionPreference = 'Stop'
$log = Join-Path $env:TEMP 'MadsjeezInstall.log'

function Write-Log {
    param([string]$Message)
    Add-Content -Path $log -Value "[$(Get-Date -Format 'HH:mm:ss')] $Message"
}

$exePath = Join-Path $InstallDir 'MadsjeezSellerBrowser.exe'
if (-not (Test-Path -LiteralPath $exePath)) {
    Write-Log "ERROR: No se encontro $exePath"
    exit 1
}

$iconFile = Join-Path $InstallDir 'app.ico'
$iconLocation = if (Test-Path -LiteralPath $iconFile) {
    "$iconFile,0"
} else {
    "$exePath,0"
}

function Get-DesktopPath {
    $candidates = @(
        [Environment]::GetFolderPath('Desktop')
        (Join-Path $env:USERPROFILE 'Desktop')
        (Join-Path $env:USERPROFILE 'Escritorio')
    )

    if ($env:OneDrive) {
        $candidates += @(
            (Join-Path $env:OneDrive 'Desktop')
            (Join-Path $env:OneDrive 'Escritorio')
        )
    }

    foreach ($path in $candidates) {
        if ($path -and (Test-Path -LiteralPath $path)) {
            return $path
        }
    }

    $shell = New-Object -ComObject WScript.Shell
    return $shell.SpecialFolders.Item('Desktop')
}

function Get-ProgramsPath {
    $programs = [Environment]::GetFolderPath('Programs')
    if ($programs -and (Test-Path -LiteralPath $programs)) {
        return $programs
    }

    $shell = New-Object -ComObject WScript.Shell
    return $shell.SpecialFolders.Item('Programs')
}

function New-AppShortcut {
    param([string]$LinkPath)

    $parent = Split-Path -Parent $LinkPath
    if (-not (Test-Path -LiteralPath $parent)) {
        New-Item -ItemType Directory -Path $parent -Force | Out-Null
    }

    $shell = New-Object -ComObject WScript.Shell
    $shortcut = $shell.CreateShortcut($LinkPath)
    $shortcut.TargetPath = $exePath
    $shortcut.WorkingDirectory = $InstallDir
    $shortcut.Description = 'Madsjeez Seller Browser'
    $shortcut.IconLocation = $iconLocation
    $shortcut.Save()
    Write-Log "Acceso directo creado: $LinkPath"
}

try {
    $desktop = Get-DesktopPath
    $programs = Get-ProgramsPath
    $startMenu = Join-Path $programs 'Madsjeez'

    New-AppShortcut (Join-Path $desktop 'Madsjeez Seller Browser.lnk')
    New-AppShortcut (Join-Path $startMenu 'Madsjeez Seller Browser.lnk')
    Write-Log 'Accesos directos creados correctamente'
    exit 0
} catch {
    Write-Log "ERROR accesos directos: $($_.Exception.Message)"
    exit 1
}
