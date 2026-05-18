FROM mirror.gcr.io/library/node:20-alpine AS builder

ENV NODE_ENV=development
WORKDIR /app
# RU network: dl-cdn.alpinelinux.org Fastly edge may be blocked, see ~/unite/rules/docker-mirrors.md
RUN sed -i 's|https\?://dl-cdn.alpinelinux.org|https://mirror.yandex.ru/mirrors|g' /etc/apk/repositories
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts
COPY tsconfig.json ./
COPY src/ src/
RUN npm run build

FROM mirror.gcr.io/library/node:20-alpine

RUN sed -i 's|https\?://dl-cdn.alpinelinux.org|https://mirror.yandex.ru/mirrors|g' /etc/apk/repositories && \
    apk add --no-cache curl

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --ignore-scripts
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "dist/index.js"]
