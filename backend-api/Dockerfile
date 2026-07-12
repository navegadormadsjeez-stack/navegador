FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma/
RUN npm ci --legacy-peer-deps

COPY . .
RUN npx prisma generate \
  && rm -f tsconfig.tsbuildinfo tsconfig.build.tsbuildinfo \
  && npm run build \
  && test -f dist/main.js

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/main.js"]
