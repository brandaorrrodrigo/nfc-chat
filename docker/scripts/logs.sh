#!/bin/bash

# ============================================================================
# LOGS VIEWER - Centralized logging
# ============================================================================

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

cd "$(dirname "$0")/.."

# Verificar se serviço foi especificado
SERVICE=${1:-all}

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    Logs Viewer                             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ "$SERVICE" == "all" ]; then
    echo -e "${YELLOW}[INFO] Mostrando logs de TODOS os serviços${NC}"
    echo -e "${YELLOW}[INFO] Use Ctrl+C para sair${NC}"
    echo ""
    docker-compose logs -f --tail=100
else
    echo -e "${YELLOW}[INFO] Mostrando logs de: ${SERVICE}${NC}"
    echo -e "${YELLOW}[INFO] Use Ctrl+C para sair${NC}"
    echo ""
    docker-compose logs -f --tail=100 "$SERVICE"
fi
