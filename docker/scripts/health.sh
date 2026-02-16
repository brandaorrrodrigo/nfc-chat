#!/bin/bash

# ============================================================================
# HEALTH CHECK SCRIPT - Verify all services
# ============================================================================

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

cd "$(dirname "$0")/.."

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║              Health Check - NFC/NFV Infrastructure         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Função para verificar serviço
check_service() {
    local service=$1
    local port=$2
    local endpoint=$3

    echo -n "  ${service}: "

    # Verificar se container está rodando
    if ! docker-compose ps | grep -q "${service}.*Up"; then
        echo -e "${RED}✗ Container não está rodando${NC}"
        return 1
    fi

    # Verificar health check se disponível
    if docker-compose ps | grep -q "${service}.*healthy"; then
        echo -e "${GREEN}✓ Healthy${NC}"
        return 0
    elif docker-compose ps | grep -q "${service}.*unhealthy"; then
        echo -e "${RED}✗ Unhealthy${NC}"
        return 1
    else
        # Tentar conexão HTTP se endpoint fornecido
        if [ ! -z "$endpoint" ]; then
            if curl -sf "http://localhost:${port}${endpoint}" > /dev/null 2>&1; then
                echo -e "${GREEN}✓ Responding${NC}"
                return 0
            else
                echo -e "${YELLOW}⚠ Not responding on ${endpoint}${NC}"
                return 1
            fi
        else
            echo -e "${YELLOW}⚠ Running (no health check)${NC}"
            return 0
        fi
    fi
}

# Verificar serviços
echo -e "${YELLOW}[SERVICES]${NC}"
check_service "postgres" "5432" ""
check_service "redis" "6379" ""
check_service "minio" "9000" "/minio/health/live"
check_service "api" "3000" "/health"
check_service "worker" "" ""
check_service "nginx" "80" "/health"

echo ""

# Verificar uso de recursos
echo -e "${YELLOW}[RESOURCES]${NC}"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}" | grep nfv || echo "Nenhum container encontrado"

echo ""

# Verificar volumes
echo -e "${YELLOW}[VOLUMES]${NC}"
docker volume ls | grep nfv | awk '{print "  " $2}' || echo "Nenhum volume encontrado"

echo ""

# Verificar network
echo -e "${YELLOW}[NETWORK]${NC}"
docker network ls | grep nfv | awk '{print "  " $2 " (" $3 ")"}'

echo ""
echo -e "${GREEN}[DONE] Health check concluído!${NC}"
echo ""
