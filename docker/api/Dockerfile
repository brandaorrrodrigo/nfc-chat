FROM node:20-alpine AS base

# Instalar dependências do sistema
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    ffmpeg

WORKDIR /app

# ============================================================================
# DEPENDENCIES
# ============================================================================
FROM base AS dependencies

# Copiar package files
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci

# Gerar Prisma Client
RUN npx prisma generate

# ============================================================================
# DEVELOPMENT
# ============================================================================
FROM dependencies AS development

# Copiar source code
COPY . .

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); });"

# Start em modo desenvolvimento
CMD ["npm", "run", "start:dev"]
