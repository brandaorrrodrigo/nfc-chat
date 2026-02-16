#!/bin/bash

# ============================================================================
# START DOCKER COMPOSE INFRASTRUCTURE
# ============================================================================

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Detectar ambiente
ENVIRONMENT=${1:-development}

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  NFC/NFV Biomechanical Analysis - Docker Infrastructure   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Environment: ${ENVIRONMENT}${NC}"
echo ""

# Navegar para diretório docker
cd "$(dirname "$0")/.."

# Verificar se .env existe
if [ ! -f .env ]; then
    echo -e "${YELLOW}[WARNING] Arquivo .env não encontrado. Copiando .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}[SUCCESS] Arquivo .env criado. Por favor, revise as configurações.${NC}"
    echo -e "${YELLOW}[INFO] Editando .env agora...${NC}"
    sleep 2
fi

# Criar diretórios necessários
echo -e "${YELLOW}[INFO] Criando diretórios necessários...${NC}"
mkdir -p postgres/backups
mkdir -p nginx/ssl
mkdir -p secrets

# Verificar Docker e Docker Compose
if ! command -v docker &> /dev/null; then
    echo -e "${RED}[ERROR] Docker não está instalado!${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}[ERROR] Docker Compose não está instalado!${NC}"
    exit 1
fi

# Parar containers existentes
echo -e "${YELLOW}[INFO] Parando containers existentes...${NC}"
docker-compose down 2>/dev/null || true

# Build das imagens
echo -e "${YELLOW}[INFO] Building Docker images...${NC}"
if [ "$ENVIRONMENT" == "production" ]; then
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
else
    docker-compose build
fi

# Iniciar serviços
echo -e "${GREEN}[START] Iniciando serviços...${NC}"
echo ""

if [ "$ENVIRONMENT" == "production" ]; then
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
else
    docker-compose up -d
fi

# Aguardar serviços ficarem prontos
echo ""
echo -e "${YELLOW}[INFO] Aguardando serviços ficarem prontos...${NC}"
sleep 5

# Verificar health checks
echo -e "${YELLOW}[INFO] Verificando health checks...${NC}"
echo ""

services=("postgres" "redis" "minio" "api")
for service in "${services[@]}"; do
    echo -n "  - ${service}: "
    if docker-compose ps | grep -q "${service}.*healthy"; then
        echo -e "${GREEN}✓ Healthy${NC}"
    elif docker-compose ps | grep -q "${service}.*Up"; then
        echo -e "${YELLOW}⚠ Running (waiting for health check)${NC}"
    else
        echo -e "${RED}✗ Not running${NC}"
    fi
done

echo ""

# Executar migrações do Prisma
echo -e "${YELLOW}[INFO] Executando migrações do banco de dados...${NC}"
docker-compose exec -T api npx prisma migrate deploy || echo -e "${YELLOW}[WARNING] Migrações já executadas ou banco ainda não está pronto${NC}"

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              Infrastructure Started Successfully!         ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}[INFO] Serviços disponíveis:${NC}"
echo -e "  ${GREEN}API:${NC}           http://localhost:3000"
echo -e "  ${GREEN}API Docs:${NC}      http://localhost:3000/api/docs"
echo -e "  ${GREEN}Health:${NC}        http://localhost:3000/health"
echo -e "  ${GREEN}MinIO Console:${NC} http://localhost:9001"
echo -e "  ${GREEN}PostgreSQL:${NC}    localhost:5432"
echo -e "  ${GREEN}Redis:${NC}         localhost:6379"
echo ""
echo -e "${YELLOW}[INFO] Para ver logs: ${NC}docker-compose logs -f"
echo -e "${YELLOW}[INFO] Para parar:    ${NC}docker-compose down"
echo ""
