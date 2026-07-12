@echo off
setlocal EnableExtensions
title Instalador - Madsjeez Seller Browser

set "SILENT=0"
if /I "%~1"=="/SILENT" set "SILENT=1"
if /I "%~1"=="-SILENT" set "SILENT=1"

set "INSTALL_DIR=%LOCALAPPDATA%\Programs\MadsjeezSellerBrowser"
set "LOG=%TEMP%\MadsjeezInstall.log"

echo [%date% %time%] Inicio instalacion SILENT=%SILENT% >> "%LOG%"

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

if "%SILENT%"=="0" echo Instalando en: %INSTALL_DIR%
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

if "%SILENT%"=="0" echo Copiando archivos...
robocopy "%~dp0" "%INSTALL_DIR%" /E /NFL /NDL /NJH /NJS /nc /ns /np >> "%LOG%" 2>&1
if %ERRORLEVEL% GEQ 8 (
  echo [ERROR] Fallo al copiar archivos. Ver %LOG%
  exit /b 1
)

del "%INSTALL_DIR%\Instalar.bat" >nul 2>&1
del "%INSTALL_DIR%\CreateShortcuts.ps1" >nul 2>&1
del "%INSTALL_DIR%\LEEME.txt" >nul 2>&1

if not exist "%INSTALL_DIR%\MadsjeezSellerBrowser.exe" (
  echo [ERROR] No se encontro MadsjeezSellerBrowser.exe en %INSTALL_DIR%
  echo [%date% %time%] ERROR exe faltante >> "%LOG%"
  exit /b 1
)

if "%SILENT%"=="0" echo Creando accesos directos...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0CreateShortcuts.ps1" -InstallDir "%INSTALL_DIR%" >> "%LOG%" 2>&1
if errorlevel 1 (
  echo [AVISO] No se pudieron crear todos los accesos directos. Ver %LOG%
)

if "%SILENT%"=="0" (
  echo.
  echo  Instalacion completada!
  echo  Buscá "Madsjeez Seller Browser" en el escritorio o menu Inicio.
  echo  Abriendo el navegador...
  echo.
)

rem start crea un proceso independiente (el SFX no lo mata al cerrar)
start "" /D "%INSTALL_DIR%" "%INSTALL_DIR%\MadsjeezSellerBrowser.exe"

if "%SILENT%"=="0" pause

endlocal
exit /b 0
