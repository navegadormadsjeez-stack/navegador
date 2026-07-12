@echo off
title Instalador - Madsjeez Seller Browser
echo.
echo  ========================================
echo   Madsjeez Seller Browser v0.1.0
echo   Instalador para Windows
echo  ========================================
echo.

dotnet --list-runtimes 2>nul | findstr /C:"Microsoft.WindowsDesktop.App 8." >nul
if errorlevel 1 (
    echo [AVISO] .NET 8 Desktop Runtime no detectado.
    echo Descargalo desde: https://dotnet.microsoft.com/download/dotnet/8.0
    echo Busca "Desktop Runtime" x64 e instalalo antes de continuar.
    echo.
    set /p CONT="Continuar de todos modos? (S/N): "
    if /i not "%CONT%"=="S" exit /b 1
)

set "INSTALL_DIR=%LOCALAPPDATA%\Programs\MadsjeezSellerBrowser"
set "DESKTOP=%USERPROFILE%\Desktop"
set "STARTMENU=%APPDATA%\Microsoft\Windows\Start Menu\Programs"

echo Instalando en: %INSTALL_DIR%
echo.

if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

echo Copiando archivos...
xcopy /E /Y /I /Q "%~dp0*" "%INSTALL_DIR%\" >nul 2>&1
del "%INSTALL_DIR%\Instalar.bat" >nul 2>&1

echo Creando acceso directo en el escritorio...
powershell -NoProfile -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%DESKTOP%\Madsjeez Seller Browser.lnk'); $s.TargetPath = '%INSTALL_DIR%\MadsjeezSellerBrowser.exe'; $s.WorkingDirectory = '%INSTALL_DIR%'; $s.Description = 'Madsjeez Seller Browser'; $s.Save()"

echo Creando acceso en el menu Inicio...
if not exist "%STARTMENU%\Madsjeez" mkdir "%STARTMENU%\Madsjeez"
powershell -NoProfile -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%STARTMENU%\Madsjeez\Madsjeez Seller Browser.lnk'); $s.TargetPath = '%INSTALL_DIR%\MadsjeezSellerBrowser.exe'; $s.WorkingDirectory = '%INSTALL_DIR%'; $s.Description = 'Madsjeez Seller Browser'; $s.Save()"

echo.
echo  Instalacion completada!
echo.
echo  Inicia sesion con:
echo    admin@madsjeez.com / Admin123!
echo  o crea tu cuenta nueva.
echo.
set /p LAUNCH="Abrir ahora? (S/N): "
if /i "%LAUNCH%"=="S" start "" "%INSTALL_DIR%\MadsjeezSellerBrowser.exe"
echo.
pause
