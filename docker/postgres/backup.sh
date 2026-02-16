#!/bin/bash

# ============================================================================
# POSTGRES BACKUP SCRIPT
# ============================================================================

set -e

# Configurações
BACKUP_DIR="/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="nfv_backup_${TIMESTAMP}.sql.gz"
RETENTION_DAYS=7

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}[BACKUP] Iniciando backup do PostgreSQL...${NC}"
echo -e "${YELLOW}[INFO] Database: ${POSTGRES_DB}${NC}"
echo -e "${YELLOW}[INFO] Timestamp: ${TIMESTAMP}${NC}"

# Criar diretório de backup se não existir
mkdir -p ${BACKUP_DIR}

# Realizar backup
pg_dump -U ${POSTGRES_USER} ${POSTGRES_DB} | gzip > ${BACKUP_DIR}/${BACKUP_FILE}

# Verificar se backup foi criado
if [ -f "${BACKUP_DIR}/${BACKUP_FILE}" ]; then
    BACKUP_SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_FILE}" | cut -f1)
    echo -e "${GREEN}[SUCCESS] Backup criado com sucesso!${NC}"
    echo -e "${YELLOW}[INFO] Arquivo: ${BACKUP_FILE}${NC}"
    echo -e "${YELLOW}[INFO] Tamanho: ${BACKUP_SIZE}${NC}"
else
    echo -e "${RED}[ERROR] Falha ao criar backup!${NC}"
    exit 1
fi

# Limpar backups antigos
echo -e "${YELLOW}[INFO] Removendo backups com mais de ${RETENTION_DAYS} dias...${NC}"
find ${BACKUP_DIR} -name "nfv_backup_*.sql.gz" -type f -mtime +${RETENTION_DAYS} -delete

# Listar backups disponíveis
echo -e "${GREEN}[INFO] Backups disponíveis:${NC}"
ls -lh ${BACKUP_DIR}/nfv_backup_*.sql.gz 2>/dev/null || echo "Nenhum backup encontrado"

echo -e "${GREEN}[BACKUP] Concluído!${NC}"
