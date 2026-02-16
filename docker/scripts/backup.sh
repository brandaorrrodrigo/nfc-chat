#!/bin/bash

# ============================================================================
# BACKUP SCRIPT - Database + Volumes
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
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="${BACKUP_ROOT}/${TIMESTAMP}"

cd "$(dirname "$0")/.."

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║              Backup Manager - NFC/NFV                      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}[INFO] Timestamp: ${TIMESTAMP}${NC}"
echo ""

# Criar diretório de backup
mkdir -p "${BACKUP_DIR}"

# 1. Backup do PostgreSQL
echo -e "${YELLOW}[BACKUP] PostgreSQL...${NC}"
docker-compose exec -T postgres pg_dump -U ${POSTGRES_USER:-nfv_user} ${POSTGRES_DB:-nfv_database} | gzip > "${BACKUP_DIR}/postgres_${TIMESTAMP}.sql.gz"
echo -e "${GREEN}[SUCCESS] PostgreSQL backup criado!${NC}"

# 2. Backup do Redis (AOF)
echo -e "${YELLOW}[BACKUP] Redis...${NC}"
docker-compose exec -T redis redis-cli --pass ${REDIS_PASSWORD:-redis_password} BGSAVE
sleep 2
docker cp nfv-redis:/data/dump.rdb "${BACKUP_DIR}/redis_${TIMESTAMP}.rdb" 2>/dev/null || echo -e "${YELLOW}[WARNING] Redis dump não encontrado${NC}"
echo -e "${GREEN}[SUCCESS] Redis backup criado!${NC}"

# 3. Backup de variáveis de ambiente
echo -e "${YELLOW}[BACKUP] Environment variables...${NC}"
cp .env "${BACKUP_DIR}/.env.backup" 2>/dev/null || echo -e "${YELLOW}[WARNING] .env não encontrado${NC}"

# 4. Informações dos volumes
echo -e "${YELLOW}[INFO] Listando volumes Docker...${NC}"
docker volume ls | grep nfv > "${BACKUP_DIR}/volumes_list.txt"

# 5. Criar arquivo de metadados
cat > "${BACKUP_DIR}/backup_info.txt" <<EOF
NFC/NFV Backup Information
==========================
Timestamp: ${TIMESTAMP}
Date: $(date)
Host: $(hostname)

Docker Compose Version:
$(docker-compose version)

Running Containers:
$(docker-compose ps)

Volumes:
$(docker volume ls | grep nfv)

Database Size:
$(docker-compose exec -T postgres psql -U ${POSTGRES_USER:-nfv_user} -d ${POSTGRES_DB:-nfv_database} -c "SELECT pg_size_pretty(pg_database_size('${POSTGRES_DB:-nfv_database}'));" | grep -v 'pg_size' | tail -1)
EOF

# 6. Comprimir backup completo
echo -e "${YELLOW}[COMPRESS] Comprimindo backup...${NC}"
cd "${BACKUP_ROOT}"
tar -czf "nfv_backup_${TIMESTAMP}.tar.gz" "${TIMESTAMP}/"

# Tamanho do backup
BACKUP_SIZE=$(du -h "nfv_backup_${TIMESTAMP}.tar.gz" | cut -f1)

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              Backup Completed Successfully!                ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}[INFO] Arquivo de backup:${NC} nfv_backup_${TIMESTAMP}.tar.gz"
echo -e "${BLUE}[INFO] Tamanho:${NC} ${BACKUP_SIZE}"
echo -e "${BLUE}[INFO] Localização:${NC} ${BACKUP_ROOT}/"
echo ""
echo -e "${YELLOW}[INFO] Para restaurar: ${NC}./scripts/restore.sh ${TIMESTAMP}"
echo ""

# Limpar backups antigos (manter últimos 7 dias)
echo -e "${YELLOW}[CLEANUP] Removendo backups com mais de 7 dias...${NC}"
find "${BACKUP_ROOT}" -name "nfv_backup_*.tar.gz" -type f -mtime +7 -delete
find "${BACKUP_ROOT}" -maxdepth 1 -type d -mtime +7 -exec rm -rf {} \; 2>/dev/null || true

echo -e "${GREEN}[DONE] Backup concluído!${NC}"
echo ""
