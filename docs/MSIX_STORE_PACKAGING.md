# Empaquetado MSIX para Microsoft Store

Base de empaquetado MSIX para una futura publicación en Microsoft Store. **No** reemplaza el instalador Inno Setup actual de producción.

## Identidad de desarrollo (actual)

En `desktop-browser/msix/Package.appxmanifest`:

| Campo | Valor dev |
|-------|-----------|
| `Identity/@Name` | `MadsJeez.Browser` |
| `Identity/@Publisher` | `CN=MadsJeez Development` |
| `Identity/@Version` | `0.1.14.0` (actualizar por release) |
| `ProcessorArchitecture` | `x64` |

## Antes de publicar en Store

Reemplazar con los valores oficiales de **Partner Center**:

1. **Name** — Package Identity Name asignado por Microsoft
2. **Publisher** — CN del certificado de firma de Store (ej. `CN=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`)
3. **Version** — Cuadruple de versión Store (`Major.Minor.Build.Revision`)
4. Logos en `Assets/` según requisitos de Store (150x150, 44x44, etc.)

## Contenido del manifiesto

- **Executable:** `MadsjeezSellerBrowser.exe`
- **Protocol handlers:** `http`, `https`
- **File associations:** `.htm`, `.html`, `.xhtml`, `.svg`, `.webp`
- **App execution alias:** `madsjeez-browser.exe`
- **Capabilities:** `internetClient`, `runFullTrust` (app de escritorio full-trust)

## Compilar MSIX local

```powershell
cd desktop-browser\msix
.\build-msix.ps1 -AllowUnsignedDevInstall
```

Con certificado de desarrollo:

```powershell
.\build-msix.ps1 -CertificatePath "C:\certs\dev.pfx" -CertificatePassword (Read-Host -AsSecureString)
```

## Requisitos

- Windows 10/11 SDK (`MakeAppx.exe`, opcional `SignTool.exe`)
- .NET 8 SDK
- Publish previo del proyecto desktop (`dotnet publish`)

## Certificados

| Tipo | Uso |
|------|-----|
| **Store signing** | Publicación oficial — Microsoft firma al subir el paquete |
| **Autofirmado** | Solo pruebas locales sideload |
| **Sin certificado** | El script genera MSIX sin firmar y sale con código 2 (modo dev) |

> Los certificados autofirmados **no** deben usarse para distribución pública.

## Windows App Certification Kit (WACK)

Para certificación Store, instalar **Windows SDK > App Certification Kit** y ejecutar pruebas contra el MSIX empaquetado:

```powershell
& "${env:ProgramFiles(x86)}\Windows Kits\10\App Certification Kit\appcert.exe" test ...
```

El script `validate-browser-registration.ps1` informa si WACK está instalado.

## Flujo recomendado Store

1. Actualizar identidad en `Package.appxmanifest` con valores Partner Center
2. `.\build-msix.ps1` con certificado de pipeline o entrega a Partner Center
3. Ejecutar WACK
4. Subir `.msix`/`.msixbundle` a Partner Center
5. Mantener Inno Setup para descargas directas fuera de Store

## Archivos

- `desktop-browser/msix/Package.appxmanifest`
- `desktop-browser/msix/build-msix.ps1`
- `docs/WINDOWS_BROWSER_REGISTRATION.md` — registro clásico HKLM (Inno)
