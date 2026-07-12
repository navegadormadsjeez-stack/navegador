FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma/
RUN npm ci --legacy-peer-deps

COPY . .
RUN npx prisma generate
ARG CACHEBUST=585c8ae
RUN rm -f tsconfig.tsbuildinfo tsconfig.build.tsbuildinfo \
  && npm run build \
  && test -f dist/main.js || (echo "ERROR: dist/main.js not found after build" && ls -laR dist && exit 1)

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

CMD ["sh", "-c", "npx prisma db push && echo 'Starting API...' && exec node dist/main.js"]
