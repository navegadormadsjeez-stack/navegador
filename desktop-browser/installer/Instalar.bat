@echo off
setlocal EnableExtensions
title Instalador - Madsjeez Seller Browser

set "SILENT=0"
if /I "%~1"=="/SILENT" set "SILENT=1"
if /I "%~1"=="-SILENT" set "SILENT=1"

if "%SILENT%"=="0" (
  echo.
  echo  ========================================
  echo   Madsjeez Seller Browser v0.1.0
  echo   Instalador para Windows
  echo  ========================================
  echo.
)

dotnet --list-runtimes 2>nul | findstr /C:"Microsoft.WindowsDesktop.App 8." >nul
if errorlevel 1 (
  if "%SILENT%"=="0" (
    echo [AVISO] .NET 8 Desktop Runtime no detectado.
    echo Descargalo desde: https://dotnet.microsoft.com/download/dotnet/8.0
    echo Busca "Desktop Runtime" x64 e instalalo antes de continuar.
    echo.
    set /p CONT="Continuar de todos modos? (S/N): "
    if /i not "%CONT%"=="S" exit /b 1
  )
)

set "INSTALL_DIR=%LOCALAPPDATA%\Programs\MadsjeezSellerBrowser"
set "DESKTOP=%USERPROFILE%\Desktop"
set "STARTMENU=%APPDATA%\Microsoft\Windows\Start Menu\Programs"

if "%SILENT%"=="0" echo Instalando en: %INSTALL_DIR%
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

if "%SILENT%"=="0" echo Copiando archivos...
xcopy /E /Y /I /Q "%~dp0*" "%INSTALL_DIR%\" >nul 2>&1
del "%INSTALL_DIR%\Instalar.bat" >nul 2>&1
del "%INSTALL_DIR%\LEEME.txt" >nul 2>&1

powershell -NoProfile -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%DESKTOP%\Madsjeez Seller Browser.lnk'); $s.TargetPath = '%INSTALL_DIR%\MadsjeezSellerBrowser.exe'; $s.WorkingDirectory = '%INSTALL_DIR%'; $s.Description = 'Madsjeez Seller Browser'; $s.IconLocation = '%INSTALL_DIR%\MadsjeezSellerBrowser.exe,0'; $s.Save()"

if not exist "%STARTMENU%\Madsjeez" mkdir "%STARTMENU%\Madsjeez"
powershell -NoProfile -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%STARTMENU%\Madsjeez\Madsjeez Seller Browser.lnk'); $s.TargetPath = '%INSTALL_DIR%\MadsjeezSellerBrowser.exe'; $s.WorkingDirectory = '%INSTALL_DIR%'; $s.Description = 'Madsjeez Seller Browser'; $s.IconLocation = '%INSTALL_DIR%\MadsjeezSellerBrowser.exe,0'; $s.Save()"

if "%SILENT%"=="0" (
  echo.
  echo  Instalacion completada!
  echo  Acceso directo creado en el escritorio.
  echo.
  set /p LAUNCH="Abrir ahora? (S/N): "
  if /i "%LAUNCH%"=="S" start "" "%INSTALL_DIR%\MadsjeezSellerBrowser.exe"
  echo.
  pause
) else (
  start "" "%INSTALL_DIR%\MadsjeezSellerBrowser.exe"
)

endlocal
exit /b 0
