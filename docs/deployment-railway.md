# Despliegue en Railway

## Backend API

### 1. Crear proyecto en Railway

```bash
railway login
railway init
```

### 2. Agregar servicios

En el dashboard de Railway, agregar:

1. **PostgreSQL** (plugin)
2. **Redis** (plugin)
3. **API** (desde GitHub repo, root: `backend-api`)

### 3. Variables de entorno

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=<generar-string-seguro-64-chars>
JWT_REFRESH_SECRET=<generar-string-seguro-64-chars>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://admin.madsjeez.com
AI_API_KEY=sk-...
AI_API_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=madsjeez-updates
R2_PUBLIC_URL=https://updates.madsjeez.com
ADMIN_EMAIL=admin@madsjeez.com
```

### 4. Deploy

Railway detectará el `Dockerfile` en `backend-api/` y desplegará automáticamente.

El `railway.toml` configura:
- Health check en `/api/v1/health`
- Migraciones Prisma al iniciar
- Restart policy on failure

### 5. Seed inicial

```bash
railway run npm run prisma:seed
```

## Admin Panel

Desplegar en Railway o Vercel:

```env
NEXT_PUBLIC_API_URL=https://api.madsjeez.com/api/v1
```

## Cloudflare R2 (Actualizaciones)

1. Crear bucket `madsjeez-updates`
2. Subir releases: `/{version}/MadsjeezSellerBrowser-setup.exe`
3. Configurar dominio público en Cloudflare
4. Registrar versiones via Admin Panel o API POST `/updates`

## GitHub Actions

El workflow `.github/workflows/ci.yml` ejecuta en cada push:
- Build + lint backend
- Build + lint admin panel
- Build desktop browser (Windows)
