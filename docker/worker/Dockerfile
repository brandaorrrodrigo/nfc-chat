FROM node:20-alpine AS base

# Instalar dependências do sistema + FFmpeg
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    ffmpeg \
    dumb-init

WORKDIR /app

# ============================================================================
# DEPENDENCIES
# ============================================================================
FROM base AS dependencies

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --only=production && npm cache clean --force
RUN npx prisma generate

# ============================================================================
# BUILD
# ============================================================================
FROM base AS build

COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma/

RUN npm ci
COPY src ./src
RUN npm run build

# ============================================================================
# PRODUCTION
# ============================================================================
FROM base AS production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY --from=dependencies --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=dependencies --chown=nodejs:nodejs /app/prisma ./prisma
COPY --from=build --chown=nodejs:nodejs /app/dist ./dist
COPY --from=build --chown=nodejs:nodejs /app/package*.json ./

RUN mkdir -p data/frames data/results logs && \
    chown -R nodejs:nodejs data logs

USER nodejs

# Worker não precisa expor porta, mas vamos adicionar healthcheck
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD ps aux | grep 'node dist/worker' || exit 1

# Start worker
CMD ["dumb-init", "node", "dist/worker/main.js"]
