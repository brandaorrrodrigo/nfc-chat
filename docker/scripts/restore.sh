#!/bin/bash

# ============================================================================
# RESTORE SCRIPT - Database + Volumes
# ============================================================================

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configurações
BACKUP_ROOT="./backups"

cd "$(dirname "$0")/.."

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║              Restore Manager - NFC/NFV                     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar se timestamp foi fornecido
if [ -z "$1" ]; then
    echo -e "${YELLOW}[INFO] Backups disponíveis:${NC}"
    echo ""
    ls -lh "${BACKUP_ROOT}"/nfv_backup_*.tar.gz 2>/dev/null | awk '{print "  " $9 " (" $5 ")"}'
    echo ""
    echo -e "${YELLOW}[INFO] Uso: ${NC}./scripts/restore.sh TIMESTAMP"
    echo -e "${YELLOW}[INFO] Exemplo: ${NC}./scripts/restore.sh 20260215_143022"
    exit 1
fi

TIMESTAMP=$1
BACKUP_FILE="${BACKUP_ROOT}/nfv_backup_${TIMESTAMP}.tar.gz"
RESTORE_DIR="${BACKUP_ROOT}/${TIMESTAMP}"

# Verificar se backup existe
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}[ERROR] Backup não encontrado: ${BACKUP_FILE}${NC}"
    exit 1
fi

echo -e "${YELLOW}[INFO] Restaurando backup: ${TIMESTAMP}${NC}"
echo ""
echo -e "${RED}[WARNING] Isso irá SUBSTITUIR todos os dados atuais!${NC}"
read -p "Tem certeza? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo -e "${YELLOW}[INFO] Operação cancelada.${NC}"
    exit 0
fi

# Descomprimir backup
echo -e "${YELLOW}[RESTORE] Descomprimindo backup...${NC}"
cd "${BACKUP_ROOT}"
tar -xzf "nfv_backup_${TIMESTAMP}.tar.gz"
cd ..

# Parar containers
echo -e "${YELLOW}[RESTORE] Parando containers...${NC}"
docker-compose down

# Iniciar apenas banco de dados e redis
echo -e "${YELLOW}[RESTORE] Iniciando serviços de dados...${NC}"
docker-compose up -d postgres redis
sleep 5

# Restaurar PostgreSQL
echo -e "${YELLOW}[RESTORE] Restaurando PostgreSQL...${NC}"
gunzip -c "${RESTORE_DIR}/postgres_${TIMESTAMP}.sql.gz" | docker-compose exec -T postgres psql -U ${POSTGRES_USER:-nfv_user} -d ${POSTGRES_DB:-nfv_database}
echo -e "${GREEN}[SUCCESS] PostgreSQL restaurado!${NC}"

# Restaurar Redis
if [ -f "${RESTORE_DIR}/redis_${TIMESTAMP}.rdb" ]; then
    echo -e "${YELLOW}[RESTORE] Restaurando Redis...${NC}"
    docker cp "${RESTORE_DIR}/redis_${TIMESTAMP}.rdb" nfv-redis:/data/dump.rdb
    docker-compose restart redis
    echo -e "${GREEN}[SUCCESS] Redis restaurado!${NC}"
fi

# Restaurar variáveis de ambiente (backup)
if [ -f "${RESTORE_DIR}/.env.backup" ]; then
    echo -e "${YELLOW}[INFO] Arquivo .env.backup disponível em: ${RESTORE_DIR}/.env.backup${NC}"
    echo -e "${YELLOW}[INFO] Revise antes de sobrescrever o .env atual!${NC}"
fi

# Reiniciar todos os serviços
echo -e "${YELLOW}[RESTORE] Reiniciando todos os serviços...${NC}"
docker-compose up -d

# Aguardar serviços
sleep 10

# Executar migrações
echo -e "${YELLOW}[RESTORE] Executando migrações do Prisma...${NC}"
docker-compose exec api npx prisma migrate deploy || echo -e "${YELLOW}[WARNING] Migrações podem já estar aplicadas${NC}"

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              Restore Completed Successfully!               ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}[INFO] Backup restaurado: ${TIMESTAMP}${NC}"
echo -e "${YELLOW}[INFO] Verifique os logs: ${NC}docker-compose logs -f"
echo ""
