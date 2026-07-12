# Firma de código gratuita con SignPath Foundation

Madsjeez Seller Browser es **open source** (licencia MIT) para poder usar [SignPath Foundation](https://signpath.org/) — firma de código **gratuita** para proyectos OSS.

Con el instalador firmado, Windows deja de mostrar **"Editor desconocido"** y SmartScreen confía en la app mucho antes.

## Requisitos (ya cumplidos en este repo)

- Repositorio público en GitHub
- Licencia MIT en `LICENSE`
- Builds reproducibles desde GitHub Actions
- Instalador `.exe` generado con Inno Setup

## Pasos para activar la firma (una sola vez)

### 1. Solicitar acceso gratuito

1. Entrá a **https://signpath.org/** → **Apply**
2. Completá el formulario con:
   - **Repo:** `https://github.com/navegadormadsjeez-stack/navegador`
   - **Licencia:** MIT
   - **Descripción:** Navegador desktop para vendedores (WPF + CefSharp)
   - **Motivo:** Eliminar avisos SmartScreen en el instalador de Windows
3. Esperá la aprobación (suele tardar **1–5 días hábiles**)

### 2. Configurar proyecto en SignPath

Tras la aprobación, en el panel de SignPath:

1. Creá el proyecto vinculado al repo de GitHub
2. **Project slug:** `madsjeez-seller-browser` (debe coincidir con el workflow)
3. **Signing policy:** `release-signing`
4. Instalá la **SignPath GitHub App** en el repositorio

### 3. Secrets en GitHub

En **Settings → Secrets and variables → Actions** del repo, agregá:

| Secret | Dónde obtenerlo |
|---|---|
| `SIGNPATH_API_TOKEN` | SignPath → Organization → API tokens |
| `SIGNPATH_ORG_ID` | SignPath → Organization → Settings |

### 4. Publicar instalador firmado

```bash
git tag v0.1.1
git push origin v0.1.1
```

El workflow `.github/workflows/release-windows.yml`:

1. Compila la app .NET
2. Genera el instalador Inno Setup
3. Lo envía a SignPath para firmarlo
4. Publica el `.exe` firmado en **GitHub Releases**

### 5. Actualizar URL de descarga

Copiá la URL del asset firmado de GitHub Releases y actualizá:

- `backend-api/prisma/seed-prod.js`
- `admin-panel/.env.production` → `NEXT_PUBLIC_DOWNLOAD_URL`
- `admin-panel/Dockerfile`

O usá directamente:

`https://github.com/navegadormadsjeez-stack/navegador/releases/latest/download/MadsjeezSellerBrowserSetup.exe`

## Notas importantes

- **Primera versión firmada:** SmartScreen puede avisar unas pocas descargas hasta acumular reputación. Es normal con certificados OV gratuitos.
- **Sin SignPath configurado:** el workflow publica el instalador **sin firmar** (mejor UI, pero sigue el aviso de Windows).
- **No uses certificados autofirmados:** no eliminan SmartScreen.

## Verificar firma

1. Descargá el instalador firmado
2. Clic derecho → **Propiedades** → pestaña **Firmas digitales**
3. Debe aparecer SignPath / editor verificado

## Referencias

- [SignPath OSS Program](https://signpath.io/product/open-source)
- [GitHub Action](https://github.com/SignPath/github-action-submit-signing-request)
- [Microsoft — opciones de firma](https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/code-signing-options)
