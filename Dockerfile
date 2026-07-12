# Fallback Dockerfile when Railway root directory is not set to backend-api.
# Preferred: set Root Directory = backend-api in Railway service settings.
FROM node:22-alpine AS builder

WORKDIR /app

COPY backend-api/package*.json ./
COPY backend-api/prisma.config.ts ./
COPY backend-api/prisma ./prisma/
RUN npm ci --legacy-peer-deps

COPY backend-api/ .
RUN npx prisma generate
RUN rm -f tsconfig.tsbuildinfo tsconfig.build.tsbuildinfo && npx nest build --webpack

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

CMD ["sh", "-c", "npx prisma db push && node dist/main.js"]
