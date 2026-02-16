#!/bin/bash

# ============================================================================
# DATABASE MIGRATION SCRIPT
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
echo -e "${BLUE}║            Database Migration Manager                      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar se API está rodando
if ! docker-compose ps | grep -q "api.*Up"; then
    echo -e "${RED}[ERROR] Container API não está rodando!${NC}"
    echo -e "${YELLOW}[INFO] Execute: ./scripts/start.sh${NC}"
    exit 1
fi

# Menu de opções
echo -e "${YELLOW}Escolha uma opção:${NC}"
echo "  1) Executar migrações pendentes (migrate deploy)"
echo "  2) Criar nova migração (migrate dev)"
echo "  3) Resetar banco de dados (migrate reset)"
echo "  4) Ver status das migrações (migrate status)"
echo "  5) Gerar Prisma Client"
echo ""
read -p "Opção: " option

case $option in
    1)
        echo -e "${YELLOW}[INFO] Executando migrações pendentes...${NC}"
        docker-compose exec api npx prisma migrate deploy
        echo -e "${GREEN}[SUCCESS] Migrações executadas!${NC}"
        ;;
    2)
        read -p "Nome da migração: " migration_name
        echo -e "${YELLOW}[INFO] Criando migração: ${migration_name}${NC}"
        docker-compose exec api npx prisma migrate dev --name "$migration_name"
        echo -e "${GREEN}[SUCCESS] Migração criada!${NC}"
        ;;
    3)
        echo -e "${RED}[WARNING] Isso irá APAGAR todos os dados do banco!${NC}"
        read -p "Tem certeza? (yes/no): " confirm
        if [ "$confirm" == "yes" ]; then
            echo -e "${YELLOW}[INFO] Resetando banco de dados...${NC}"
            docker-compose exec api npx prisma migrate reset --force
            echo -e "${GREEN}[SUCCESS] Banco resetado!${NC}"
        else
            echo -e "${YELLOW}[INFO] Operação cancelada.${NC}"
        fi
        ;;
    4)
        echo -e "${YELLOW}[INFO] Status das migrações:${NC}"
        docker-compose exec api npx prisma migrate status
        ;;
    5)
        echo -e "${YELLOW}[INFO] Gerando Prisma Client...${NC}"
        docker-compose exec api npx prisma generate
        echo -e "${GREEN}[SUCCESS] Prisma Client gerado!${NC}"
        ;;
    *)
        echo -e "${RED}[ERROR] Opção inválida!${NC}"
        exit 1
        ;;
esac

echo ""
