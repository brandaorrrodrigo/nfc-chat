#!/bin/bash

# ============================================================================
# STOP DOCKER COMPOSE INFRASTRUCTURE
# ============================================================================

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Opções
REMOVE_VOLUMES=${1:-no}

cd "$(dirname "$0")/.."

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        Stopping NFC/NFV Docker Infrastructure              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ "$REMOVE_VOLUMES" == "--volumes" ] || [ "$REMOVE_VOLUMES" == "-v" ]; then
    echo -e "${RED}[WARNING] Isso irá remover TODOS os volumes (dados serão perdidos)!${NC}"
    read -p "Tem certeza? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        echo -e "${YELLOW}[INFO] Operação cancelada.${NC}"
        exit 0
    fi

    echo -e "${YELLOW}[INFO] Parando containers e removendo volumes...${NC}"
    docker-compose down -v
    echo -e "${GREEN}[SUCCESS] Containers e volumes removidos!${NC}"
else
    echo -e "${YELLOW}[INFO] Parando containers (volumes preservados)...${NC}"
    docker-compose down
    echo -e "${GREEN}[SUCCESS] Containers parados!${NC}"
    echo ""
    echo -e "${YELLOW}[INFO] Para remover volumes também: ${NC}./stop.sh --volumes"
fi

echo ""
echo -e "${GREEN}[INFO] Infrastructure stopped successfully!${NC}"
echo ""
