# Madsjeez Seller Browser

**El sistema operativo para vendedores online de Latinoamérica.**

Navegador desktop especializado con espacios de trabajo aislados, panel de IA tipo Copilot, gestión de productos y backend completo.

## Estructura del monorepo

```
navegador/
├── desktop-browser/    # WPF + CefSharp (.NET 8)
├── backend-api/        # NestJS + Prisma + PostgreSQL + Redis
├── admin-panel/        # Next.js 14 + Tailwind CSS
├── shared/             # Tipos compartidos TypeScript
├── docs/               # Documentación
└── docker-compose.yml  # Infraestructura local
```

## Requisitos

| Componente | Requisito |
|-----------|-----------|
| Desktop | .NET 8 SDK, Windows 10+ |
| Backend | Node.js 20+, Docker |
| Admin | Node.js 20+ |
| Base de datos | PostgreSQL 16, Redis 7 |

## Inicio rápido

### 1. Infraestructura (Docker)

```bash
docker-compose up -d postgres redis
```

### 2. Backend API

```bash
cd backend-api
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run start:dev
```

API disponible en: `http://localhost:3001`  
Swagger docs: `http://localhost:3001/api/docs`

### 3. Panel Admin

```bash
cd admin-panel
cp .env.example .env.local
npm install
npm run dev
```

Panel en: `http://localhost:3000`

### 4. Navegador Desktop

```bash
cd desktop-browser
dotnet restore
dotnet run
```

## Credenciales demo (seed)

- **Admin:** `admin@madsjeez.com` / `Admin123!`

## Funcionalidades MVP

### Navegador
- Pestañas múltiples, navegación, favoritos, historial, descargas
- Modo oscuro, perfiles de usuario aislados

### Espacios de trabajo
- **Maqjeez:** Mercado Libre, WhatsApp, Gmail, Madsjeez
- **Materia Natural:** Instagram, Facebook, WhatsApp Business
- Cookies, sesiones y cache aislados por perfil

### Panel IA
- Títulos Mercado Libre, descripciones SEO, respuestas a clientes
- Análisis de competencia, resumen de páginas, posts Facebook, sugerencia de precios
- Lee URL y contenido visible de la página actual

### Sistema de productos
- Catálogo local con precios, stock, imágenes y compatibilidades
- Sincronizable con backend API

### Backend API
- Auth (JWT + refresh tokens), usuarios, workspaces, productos
- Suscripciones (Free/Pro/Enterprise), IA con límites por plan
- Actualizaciones, telemetría, notificaciones

## Despliegue Railway

Ver [docs/deployment-railway.md](docs/deployment-railway.md)

## Roadmap

| Fase | Descripción | Estado |
|------|-------------|--------|
| 1 | Navegador funcional | ✅ MVP |
| 2 | IA integrada | ✅ MVP |
| 3 | Marketplace | 🔜 Preparado |
| 4 | Publicación masiva | 🔜 Preparado |
| 5 | Automatizaciones | 🔜 Preparado |

## Instalador Windows (profesional)

Instalador con asistente gráfico **Inno Setup** (como cualquier app de Windows):

```powershell
cd desktop-browser
.\build-installer.ps1
```

Genera `desktop-browser/release/MadsjeezSellerBrowserSetup.exe` con:

- Asistente en español (siguiente → instalar → finalizar)
- Acceso directo en escritorio y menú Inicio
- Entrada en **Agregar o quitar programas**
- Apertura automática al terminar
- Verificación de .NET 8 Desktop Runtime

### Firma gratuita (SmartScreen)

Ver [docs/SIGNPATH.md](docs/SIGNPATH.md) — certificado de código **gratis** vía SignPath Foundation (open source).

Release automático en GitHub Actions al pushear un tag `v*`:

```bash
git tag v0.1.1
git push origin v0.1.1
```

## Licencia

[MIT](LICENSE) — Open source. Firma gratuita con [SignPath Foundation](https://signpath.org/).
