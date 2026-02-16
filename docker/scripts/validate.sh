#!/bin/bash

# ============================================================================
# VALIDATION SCRIPT - Verificar configuração antes do deploy
# ============================================================================

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

cd "$(dirname "$0")/.."

ERRORS=0
WARNINGS=0

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         NFC/NFV Infrastructure Validation                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# ============================================================================
# 1. VERIFICAR DOCKER
# ============================================================================
echo -e "${YELLOW}[1/10] Verificando Docker...${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker não está instalado!${NC}"
    ((ERRORS++))
else
    DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
    echo -e "${GREEN}✓ Docker instalado (${DOCKER_VERSION})${NC}"
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}✗ Docker Compose não está instalado!${NC}"
    ((ERRORS++))
else
    echo -e "${GREEN}✓ Docker Compose instalado${NC}"
fi

# ============================================================================
# 2. VERIFICAR ARQUIVOS DE CONFIGURAÇÃO
# ============================================================================
echo ""
echo -e "${YELLOW}[2/10] Verificando arquivos de configuração...${NC}"

if [ ! -f .env ]; then
    echo -e "${RED}✗ Arquivo .env não encontrado!${NC}"
    echo -e "${YELLOW}  Execute: cp .env.example .env${NC}"
    ((ERRORS++))
else
    echo -e "${GREEN}✓ Arquivo .env encontrado${NC}"
fi

if [ ! -f docker-compose.yml ]; then
    echo -e "${RED}✗ docker-compose.yml não encontrado!${NC}"
    ((ERRORS++))
else
    echo -e "${GREEN}✓ docker-compose.yml encontrado${NC}"
fi

# ============================================================================
# 3. VERIFICAR VARIÁVEIS CRÍTICAS NO .ENV
# ============================================================================
echo ""
echo -e "${YELLOW}[3/10] Verificando variáveis de ambiente...${NC}"

if [ -f .env ]; then
    source .env

    # PostgreSQL
    if [ -z "$POSTGRES_PASSWORD" ] || [ "$POSTGRES_PASSWORD" == "nfv_password_change_in_production" ]; then
        echo -e "${RED}✗ POSTGRES_PASSWORD não está configurada corretamente!${NC}"
        ((ERRORS++))
    else
        echo -e "${GREEN}✓ POSTGRES_PASSWORD configurada${NC}"
    fi

    # Redis
    if [ -z "$REDIS_PASSWORD" ] || [ "$REDIS_PASSWORD" == "redis_password_change_in_production" ]; then
        echo -e "${YELLOW}⚠ REDIS_PASSWORD usando valor padrão (trocar em produção)${NC}"
        ((WARNINGS++))
    else
        echo -e "${GREEN}✓ REDIS_PASSWORD configurada${NC}"
    fi

    # JWT
    if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" == "your-super-secret-jwt-key-change-in-production-min-32-chars" ]; then
        echo -e "${RED}✗ JWT_SECRET não está configurada corretamente!${NC}"
        ((ERRORS++))
    else
        JWT_LENGTH=${#JWT_SECRET}
        if [ $JWT_LENGTH -lt 32 ]; then
            echo -e "${YELLOW}⚠ JWT_SECRET muito curta (mínimo 32 caracteres)${NC}"
            ((WARNINGS++))
        else
            echo -e "${GREEN}✓ JWT_SECRET configurada (${JWT_LENGTH} chars)${NC}"
        fi
    fi

    # Node Environment
    if [ -z "$NODE_ENV" ]; then
        echo -e "${YELLOW}⚠ NODE_ENV não definido (usando 'development')${NC}"
        ((WARNINGS++))
    else
        echo -e "${GREEN}✓ NODE_ENV: ${NODE_ENV}${NC}"
    fi
fi

# ============================================================================
# 4. VERIFICAR DOCKERFILES
# ============================================================================
echo ""
echo -e "${YELLOW}[4/10] Verificando Dockerfiles...${NC}"

if [ ! -f api/Dockerfile ]; then
    echo -e "${RED}✗ api/Dockerfile não encontrado!${NC}"
    ((ERRORS++))
else
    echo -e "${GREEN}✓ api/Dockerfile encontrado${NC}"
fi

if [ ! -f worker/Dockerfile ]; then
    echo -e "${RED}✗ worker/Dockerfile não encontrado!${NC}"
    ((ERRORS++))
else
    echo -e "${GREEN}✓ worker/Dockerfile encontrado${NC}"
fi

if [ ! -f nginx/Dockerfile ]; then
    echo -e "${RED}✗ nginx/Dockerfile não encontrado!${NC}"
    ((ERRORS++))
else
    echo -e "${GREEN}✓ nginx/Dockerfile encontrado${NC}"
fi

# ============================================================================
# 5. VERIFICAR NGINX CONFIG
# ============================================================================
echo ""
echo -e "${YELLOW}[5/10] Verificando configuração Nginx...${NC}"

if [ ! -f nginx/nginx.conf ]; then
    echo -e "${RED}✗ nginx/nginx.conf não encontrado!${NC}"
    ((ERRORS++))
else
    echo -e "${GREEN}✓ nginx/nginx.conf encontrado${NC}"
fi

# ============================================================================
# 6. VERIFICAR SCRIPTS
# ============================================================================
echo ""
echo -e "${YELLOW}[6/10] Verificando scripts...${NC}"

SCRIPTS=("start.sh" "stop.sh" "backup.sh" "restore.sh" "migrate.sh" "health.sh" "logs.sh")
for script in "${SCRIPTS[@]}"; do
    if [ ! -f "scripts/$script" ]; then
        echo -e "${RED}✗ scripts/${script} não encontrado!${NC}"
        ((ERRORS++))
    elif [ ! -x "scripts/$script" ]; then
        echo -e "${YELLOW}⚠ scripts/${script} não é executável${NC}"
        echo -e "${YELLOW}  Execute: chmod +x scripts/${script}${NC}"
        ((WARNINGS++))
    else
        echo -e "${GREEN}✓ scripts/${script}${NC}"
    fi
done

# ============================================================================
# 7. VERIFICAR PORTAS DISPONÍVEIS
# ============================================================================
echo ""
echo -e "${YELLOW}[7/10] Verificando portas...${NC}"

source .env 2>/dev/null || true

PORTS_TO_CHECK=(
    "${API_PORT:-3000}:API"
    "${POSTGRES_PORT:-5432}:PostgreSQL"
    "${REDIS_PORT:-6379}:Redis"
    "${MINIO_PORT:-9000}:MinIO"
    "${MINIO_CONSOLE_PORT:-9001}:MinIO Console"
    "${HTTP_PORT:-80}:HTTP"
    "${HTTPS_PORT:-443}:HTTPS"
)

for port_info in "${PORTS_TO_CHECK[@]}"; do
    PORT=$(echo $port_info | cut -d':' -f1)
    SERVICE=$(echo $port_info | cut -d':' -f2)

    if netstat -tuln 2>/dev/null | grep -q ":${PORT} " || lsof -i :${PORT} 2>/dev/null | grep -q LISTEN; then
        echo -e "${YELLOW}⚠ Porta ${PORT} (${SERVICE}) já está em uso${NC}"
        ((WARNINGS++))
    else
        echo -e "${GREEN}✓ Porta ${PORT} (${SERVICE}) disponível${NC}"
    fi
done

# ============================================================================
# 8. VERIFICAR ESPAÇO EM DISCO
# ============================================================================
echo ""
echo -e "${YELLOW}[8/10] Verificando espaço em disco...${NC}"

AVAILABLE_GB=$(df -BG . | tail -1 | awk '{print $4}' | sed 's/G//')
if [ "$AVAILABLE_GB" -lt 50 ]; then
    echo -e "${RED}✗ Espaço insuficiente: ${AVAILABLE_GB}GB (mínimo: 50GB)${NC}"
    ((ERRORS++))
else
    echo -e "${GREEN}✓ Espaço em disco: ${AVAILABLE_GB}GB disponível${NC}"
fi

# ============================================================================
# 9. VERIFICAR MEMÓRIA
# ============================================================================
echo ""
echo -e "${YELLOW}[9/10] Verificando memória...${NC}"

if command -v free &> /dev/null; then
    TOTAL_MEM_GB=$(free -g | grep Mem | awk '{print $2}')
    if [ "$TOTAL_MEM_GB" -lt 16 ]; then
        echo -e "${YELLOW}⚠ Memória total: ${TOTAL_MEM_GB}GB (recomendado: 16GB+)${NC}"
        ((WARNINGS++))
    else
        echo -e "${GREEN}✓ Memória total: ${TOTAL_MEM_GB}GB${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Não foi possível verificar memória${NC}"
    ((WARNINGS++))
fi

# ============================================================================
# 10. VERIFICAR SSL (para produção)
# ============================================================================
echo ""
echo -e "${YELLOW}[10/10] Verificando SSL/TLS...${NC}"

if [ "${NODE_ENV}" == "production" ]; then
    if [ ! -f nginx/ssl/fullchain.pem ] || [ ! -f nginx/ssl/privkey.pem ]; then
        echo -e "${RED}✗ Certificados SSL não encontrados em nginx/ssl/${NC}"
        echo -e "${YELLOW}  Configure SSL antes de fazer deploy em produção${NC}"
        ((ERRORS++))
    else
        echo -e "${GREEN}✓ Certificados SSL encontrados${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Modo desenvolvimento - SSL será auto-gerado${NC}"
fi

# ============================================================================
# RESUMO
# ============================================================================
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                   Validation Summary                       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ TUDO OK! Infraestrutura pronta para deploy!${NC}"
    echo ""
    echo -e "${YELLOW}Próximo passo:${NC}"
    echo -e "  ${GREEN}make start${NC}       - Iniciar em desenvolvimento"
    echo -e "  ${GREEN}make start-prod${NC}  - Iniciar em produção"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ ${WARNINGS} avisos encontrados (pode prosseguir)${NC}"
    echo ""
    echo -e "${YELLOW}Próximo passo:${NC}"
    echo -e "  ${GREEN}make start${NC}  - Iniciar infraestrutura"
    exit 0
else
    echo -e "${RED}✗ ${ERRORS} erros críticos encontrados!${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ ${WARNINGS} avisos${NC}"
    fi
    echo ""
    echo -e "${YELLOW}Corrija os erros antes de prosseguir.${NC}"
    exit 1
fi
