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

if "%SILENT%"=="0" echo Instalando en: %INSTALL_DIR%
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

if "%SILENT%"=="0" echo Copiando archivos...
xcopy /E /Y /I /Q "%~dp0*" "%INSTALL_DIR%\" >nul 2>&1
del "%INSTALL_DIR%\Instalar.bat" >nul 2>&1
del "%INSTALL_DIR%\CreateShortcuts.ps1" >nul 2>&1
del "%INSTALL_DIR%\LEEME.txt" >nul 2>&1

if "%SILENT%"=="0" echo Creando acceso directo en el escritorio...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0CreateShortcuts.ps1" -InstallDir "%INSTALL_DIR%"
if errorlevel 1 (
  echo [ERROR] No se pudo crear el acceso directo.
  exit /b 1
)

if "%SILENT%"=="0" (
  echo.
  echo  Instalacion completada!
  echo  Icono creado en el escritorio: Madsjeez Seller Browser
  echo  Abriendo el navegador...
  echo.
)

timeout /t 2 /nobreak >nul

powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -LiteralPath '%INSTALL_DIR%\MadsjeezSellerBrowser.exe' -WorkingDirectory '%INSTALL_DIR%'"

if "%SILENT%"=="0" pause

endlocal
exit /b 0
