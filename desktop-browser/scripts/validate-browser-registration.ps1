# Validates MadsJeez Browser Windows registration (HKLM browser client + ProgIDs).
# Usage:
#   .\validate-browser-registration.ps1
#   .\validate-browser-registration.ps1 -InstallDir "C:\Program Files\MadsjeezSellerBrowser"
#   .\validate-browser-registration.ps1 -SkipOpenTests
#   .\validate-browser-registration.ps1 -CheckUninstallCleanup

[CmdletBinding()]
param(
    [string]$InstallDir = "${env:ProgramFiles}\MadsjeezSellerBrowser",
    [switch]$SkipOpenTests,
    [switch]$CheckUninstallCleanup
)

$ErrorActionPreference = "Stop"

$AppName = "Madsjeez Seller Browser"
$CanonicalName = "MadsJeezBrowser"
$ExeName = "MadsjeezSellerBrowser.exe"
$HtmlProgId = "MadsJeezHTML"
$HttpProgId = "MadsJeezHTTP"
$HttpsProgId = "MadsJeezHTTPS"

$failures = New-Object System.Collections.Generic.List[string]
$warnings = New-Object System.Collections.Generic.List[string]
$passed = 0

function Pass([string]$Message) {
    Write-Host "[OK]   $Message" -ForegroundColor Green
    $script:passed++
}

function Fail([string]$Message) {
    Write-Host "[FAIL] $Message" -ForegroundColor Red
    $script:failures.Add($Message) | Out-Null
}

function Warn([string]$Message) {
    Write-Host "[WARN] $Message" -ForegroundColor Yellow
    $script:warnings.Add($Message) | Out-Null
}

function Get-RegValue {
    param(
        [Microsoft.Win32.RegistryHive]$Hive,
        [string]$SubKey,
        [string]$Name = ""
    )
    $base = if ($Hive -eq [Microsoft.Win32.RegistryHive]::LocalMachine) {
        [Microsoft.Win32.RegistryKey]::OpenBaseKey($Hive, [Microsoft.Win32.RegistryView]::Registry64)
    } else {
        [Microsoft.Win32.RegistryKey]::OpenBaseKey($Hive, [Microsoft.Win32.RegistryView]::Default)
    }
    $key = $base.OpenSubKey($SubKey)
    try {
        if ($null -eq $key) { return $null }
        return $key.GetValue($Name)
    } finally {
        if ($null -ne $key) { $key.Close() }
        $base.Close()
    }
}

function Test-ProgIdCommand {
    param([string]$ProgId, [string]$ExpectedExePath)
    $command = Get-RegValue LocalMachine "SOFTWARE\Classes\$ProgId\shell\open\command"
    if ([string]::IsNullOrWhiteSpace($command)) {
        Fail "ProgID '$ProgId' shell\open\command missing"
        return
    }
    if ($command -notmatch [regex]::Escape($ExpectedExePath)) {
        Fail "ProgID '$ProgId' command does not reference expected exe: $command"
        return
    }
    if ($command -notmatch '%1') {
        Fail "ProgID '$ProgId' command missing %1 placeholder: $command"
        return
    }
    Pass "ProgID '$ProgId' shell\open\command OK"
}

Write-Host ""
Write-Host "=== MadsJeez Browser Registration Validation ===" -ForegroundColor Cyan
Write-Host "InstallDir: $InstallDir"
Write-Host ""

$exePath = Join-Path $InstallDir $ExeName
if (Test-Path $exePath) {
    Pass "Executable exists: $exePath"
} else {
    Fail "Executable not found: $exePath"
}

$registeredApps = Get-RegValue LocalMachine "SOFTWARE\RegisteredApplications" $AppName
if ($registeredApps -eq "Software\Clients\StartMenuInternet\$CanonicalName\Capabilities") {
    Pass "RegisteredApplications entry OK"
} else {
    Fail "RegisteredApplications missing or incorrect (got: $registeredApps)"
}

$clientRoot = Get-RegValue LocalMachine "SOFTWARE\Clients\StartMenuInternet\$CanonicalName"
if ($clientRoot -eq $AppName) {
    Pass "StartMenuInternet client root OK"
} else {
    Fail "StartMenuInternet\$CanonicalName missing or incorrect (got: $clientRoot)"
}

foreach ($cap in @("ApplicationName", "ApplicationDescription", "ApplicationIcon")) {
    $value = Get-RegValue LocalMachine "SOFTWARE\Clients\StartMenuInternet\$CanonicalName\Capabilities" $cap
    if ([string]::IsNullOrWhiteSpace($value)) {
        Fail "Capabilities\$cap missing"
    } else {
        Pass "Capabilities\$cap = $value"
    }
}

$httpAssoc = Get-RegValue LocalMachine "SOFTWARE\Clients\StartMenuInternet\$CanonicalName\Capabilities\URLAssociations" "http"
$httpsAssoc = Get-RegValue LocalMachine "SOFTWARE\Clients\StartMenuInternet\$CanonicalName\Capabilities\URLAssociations" "https"
if ($httpAssoc -eq $HttpProgId) { Pass "URL association http -> $HttpProgId" } else { Fail "URL association http incorrect (got: $httpAssoc)" }
if ($httpsAssoc -eq $HttpsProgId) { Pass "URL association https -> $HttpsProgId" } else { Fail "URL association https incorrect (got: $httpsAssoc)" }

foreach ($ext in @(".htm", ".html", ".xhtml", ".svg", ".webp")) {
    $assoc = Get-RegValue LocalMachine "SOFTWARE\Clients\StartMenuInternet\$CanonicalName\Capabilities\FileAssociations" $ext
    if ($assoc -eq $HtmlProgId) {
        Pass "File association $ext -> $HtmlProgId"
    } else {
        Fail "File association $ext incorrect (got: $assoc)"
    }
}

if (Test-Path $exePath) {
    Test-ProgIdCommand $HtmlProgId $exePath
    Test-ProgIdCommand $HttpProgId $exePath
    Test-ProgIdCommand $HttpsProgId $exePath

    $clientCommand = Get-RegValue LocalMachine "SOFTWARE\Clients\StartMenuInternet\$CanonicalName\shell\open\command"
    if ($clientCommand -match [regex]::Escape($exePath) -and $clientCommand -match '%1') {
        Pass "StartMenuInternet shell\open\command OK"
    } else {
        Fail "StartMenuInternet shell\open\command incorrect: $clientCommand"
    }
}

if ($CheckUninstallCleanup) {
    Write-Host ""
    Write-Host "Uninstall cleanup mode: expecting registry keys to be absent." -ForegroundColor Yellow
    if ($null -eq (Get-RegValue LocalMachine "SOFTWARE\RegisteredApplications" $AppName)) {
        Pass "RegisteredApplications cleaned up"
    } else {
        Fail "RegisteredApplications still present after uninstall"
    }
    if ($null -eq (Get-RegValue LocalMachine "SOFTWARE\Clients\StartMenuInternet\$CanonicalName")) {
        Pass "StartMenuInternet client cleaned up"
    } else {
        Fail "StartMenuInternet client still present after uninstall"
    }
}

if (-not $SkipOpenTests -and (Test-Path $exePath)) {
    Write-Host ""
    Write-Host "Open tests (optional smoke):" -ForegroundColor Cyan

    try {
        $urlProc = Start-Process -FilePath $exePath -ArgumentList "https://example.com" -PassThru -WindowStyle Minimized
        Start-Sleep -Seconds 3
        if (-not $urlProc.HasExited) {
            Pass "Launched with https://example.com (PID $($urlProc.Id))"
            Stop-Process -Id $urlProc.Id -Force -ErrorAction SilentlyContinue
        } else {
            Warn "Process exited quickly after URL launch (exit $($urlProc.ExitCode))"
        }
    } catch {
        Warn "URL open test failed: $($_.Exception.Message)"
    }

    $tempHtml = Join-Path $env:TEMP "madsjeez-validation-test.html"
    @"
<!DOCTYPE html>
<html><head><title>MadsJeez validation</title></head>
<body><h1>Registration test</h1></body></html>
"@ | Set-Content -Path $tempHtml -Encoding UTF8

    try {
        $fileProc = Start-Process -FilePath $exePath -ArgumentList "`"$tempHtml`"" -PassThru -WindowStyle Minimized
        Start-Sleep -Seconds 3
        if (-not $fileProc.HasExited) {
            Pass "Launched with local HTML file (PID $($fileProc.Id))"
            Stop-Process -Id $fileProc.Id -Force -ErrorAction SilentlyContinue
        } else {
            Warn "Process exited quickly after file launch (exit $($fileProc.ExitCode))"
        }
    } catch {
        Warn "File open test failed: $($_.Exception.Message)"
    } finally {
        Remove-Item $tempHtml -ErrorAction SilentlyContinue
    }
}

Write-Host ""
Write-Host "Windows App Certification Kit:" -ForegroundColor Cyan
$wackCandidates = @(
    "${env:ProgramFiles(x86)}\Windows Kits\10\App Certification Kit\appcert.exe",
    "${env:ProgramFiles}\Windows Kits\10\App Certification Kit\appcert.exe"
)
$wack = $wackCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if ($wack) {
    Warn "WACK found at $wack - run manually against MSIX or packaged app for Store certification."
} else {
    Warn "WACK (appcert.exe) not installed. Install Windows SDK App Certification Kit for Store validation."
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "Passed:   $passed"
Write-Host "Warnings: $($warnings.Count)"
Write-Host "Failures: $($failures.Count)"

if ($failures.Count -gt 0) {
    Write-Host ""
    foreach ($f in $failures) { Write-Host "  - $f" -ForegroundColor Red }
    exit 1
}

exit 0
