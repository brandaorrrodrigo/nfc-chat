#!/bin/bash

# Script de inicialização rápida do MediaPipe Service
# Uso: ./start.sh [dev|prod]

set -e

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

MODE="${1:-dev}"

echo -e "${BLUE}Starting MediaPipe Service in ${MODE} mode...${NC}"

# Verificar se venv existe
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Virtual environment not found. Running setup...${NC}"
    ./setup.sh
fi

# Ativar venv
source venv/bin/activate

# Carregar variáveis de ambiente
if [ -f ".env" ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Iniciar baseado no modo
if [ "$MODE" = "prod" ] || [ "$MODE" = "production" ]; then
    echo -e "${GREEN}Starting in PRODUCTION mode with Gunicorn...${NC}"
    export FLASK_ENV=production
    export DEBUG=false

    gunicorn \
        --bind ${HOST:-0.0.0.0}:${PORT:-5000} \
        --workers ${MAX_WORKERS:-4} \
        --threads 2 \
        --worker-class sync \
        --timeout ${TIMEOUT_SECONDS:-120} \
        --keep-alive 5 \
        --log-level ${LOG_LEVEL:-info} \
        --access-logfile - \
        --error-logfile - \
        mediapipe_service:app

elif [ "$MODE" = "dev" ] || [ "$MODE" = "development" ]; then
    echo -e "${GREEN}Starting in DEVELOPMENT mode with Flask dev server...${NC}"
    export FLASK_ENV=development
    export DEBUG=true

    python mediapipe_service.py

elif [ "$MODE" = "test" ]; then
    echo -e "${GREEN}Running tests...${NC}"
    pytest test_mediapipe_service.py -v --cov=. --cov-report=term-missing

else
    echo -e "${YELLOW}Unknown mode: $MODE${NC}"
    echo "Usage: $0 [dev|prod|test]"
    echo "  dev  - Development mode with Flask dev server (default)"
    echo "  prod - Production mode with Gunicorn"
    echo "  test - Run tests"
    exit 1
fi
