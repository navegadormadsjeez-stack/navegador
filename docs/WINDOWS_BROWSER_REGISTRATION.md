# Registro de MadsJeez Browser en Windows

Este documento describe cómo el instalador Inno Setup registra **MadsJeez Seller Browser** como navegador web en Windows 10/11 x64, cómo validarlo y cómo elegirlo como navegador predeterminado.

## Diagnóstico previo

Instalaciones antiguas (`PrivilegesRequired=lowest`, `%LOCALAPPDATA%\Programs\...`) **no** podían escribir en `HKLM` y Windows no mostraba la app en **Configuración > Aplicaciones > Aplicaciones predeterminadas**.

Desde **v0.1.14**, el instalador requiere **administrador** e instala en:

```
C:\Program Files\MadsjeezSellerBrowser\
```

## Claves de registro (HKLM)

| Ruta | Propósito |
|------|-----------|
| `SOFTWARE\RegisteredApplications` | Expone la app en Apps predeterminadas |
| `SOFTWARE\Clients\StartMenuInternet\MadsJeezBrowser` | Cliente de navegador |
| `...\Capabilities` | Nombre, descripción, icono |
| `...\Capabilities\URLAssociations` | `http` → `MadsJeezHTTP`, `https` → `MadsJeezHTTPS` |
| `...\Capabilities\FileAssociations` | `.htm`, `.html`, `.xhtml`, `.svg`, `.webp` → `MadsJeezHTML` |
| `SOFTWARE\Classes\MadsJeezHTML` | ProgID para archivos web |
| `SOFTWARE\Classes\MadsJeezHTTP` | ProgID para URLs HTTP |
| `SOFTWARE\Classes\MadsJeezHTTPS` | ProgID para URLs HTTPS |

Cada ProgID incluye:

- `DefaultIcon` → `{app}\MadsjeezSellerBrowser.exe,0`
- `shell\open\command` → `"{app}\MadsjeezSellerBrowser.exe" "%1"`

## Instalación

1. Descargar `MadsjeezSellerBrowserSetup.exe` (release GitHub o panel admin).
2. Ejecutar **como administrador** (UAC).
3. Completar el asistente de Inno Setup.
4. Abrir el navegador → **Ajustes** → sección **Windows** → **Elegir MadsJeez como navegador predeterminado**.

> Windows **no permite** establecer el navegador predeterminado silenciosamente. El usuario debe confirmarlo en Configuración.

## Validación automática

```powershell
cd desktop-browser\scripts
.\validate-browser-registration.ps1
```

Parámetros:

- `-InstallDir "C:\Program Files\MadsjeezSellerBrowser"` — ruta personalizada
- `-SkipOpenTests` — omitir pruebas de lanzamiento con URL/archivo
- `-CheckUninstallCleanup` — verificar que las claves ya no existen (post-desinstalación)

## Desinstalación y limpieza

1. **Configuración > Aplicaciones > Aplicaciones instaladas** → desinstalar *Madsjeez Seller Browser*.
2. Verificar limpieza:

```powershell
.\validate-browser-registration.ps1 -CheckUninstallCleanup
```

El instalador usa flags `uninsdeletekeyifempty` / `uninsdeletevalue` para eliminar las entradas HKLM al desinstalar.

## Argumentos de línea de comandos

La app acepta una URL o archivo local como primer argumento:

```powershell
& "C:\Program Files\MadsjeezSellerBrowser\MadsjeezSellerBrowser.exe" "https://example.com"
& "C:\Program Files\MadsjeezSellerBrowser\MadsjeezSellerBrowser.exe" "C:\temp\page.html"
```

## Compilar instalador

```powershell
cd desktop-browser
.\build-installer.ps1
```

Salida: `desktop-browser\release\MadsjeezSellerBrowserSetup.exe`

## Archivos relacionados

- `desktop-browser/installer/MadsjeezSellerBrowser.iss` — definición Inno Setup
- `desktop-browser/scripts/validate-browser-registration.ps1` — validación
- `desktop-browser/Services/StartupArgumentResolver.cs` — resolución de argumentos
- `desktop-browser/Views/SettingsPage.xaml` — botón Apps predeterminadas
