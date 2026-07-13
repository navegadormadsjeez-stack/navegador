FROM node:22-alpine AS builder

WORKDIR /app

ARG BUILD_SHA=local
ENV NEXT_PUBLIC_BUILD_SHA=${BUILD_SHA}

COPY package*.json ./
RUN npm ci

COPY . .
RUN mkdir -p public
ENV NEXT_PUBLIC_API_URL=https://navegador-production.up.railway.app/api/v1
ENV NEXT_PUBLIC_DOWNLOAD_URL=https://github.com/navegadormadsjeez-stack/navegador/releases/download/v0.1.10/MadsjeezSellerBrowserSetup.exe
RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=https://navegador-production.up.railway.app/api/v1
ENV NEXT_PUBLIC_DOWNLOAD_URL=https://github.com/navegadormadsjeez-stack/navegador/releases/download/v0.1.10/MadsjeezSellerBrowserSetup.exe

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
