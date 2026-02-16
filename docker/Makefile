# ============================================================================
# MAKEFILE - NFC/NFV Docker Infrastructure
# ============================================================================

.PHONY: help start stop restart logs build clean backup restore migrate health

# Cores para output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[1;33m
BLUE := \033[0;34m
NC := \033[0m

# Configurações
COMPOSE := docker-compose
COMPOSE_PROD := docker-compose -f docker-compose.yml -f docker-compose.prod.yml

## help: Mostra esta mensagem de ajuda
help:
	@echo "$(BLUE)╔════════════════════════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║  NFC/NFV Biomechanical Analysis - Docker Commands         ║$(NC)"
	@echo "$(BLUE)╚════════════════════════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(YELLOW)Comandos disponíveis:$(NC)"
	@echo "  $(GREEN)make start$(NC)          - Iniciar todos os serviços (dev)"
	@echo "  $(GREEN)make start-prod$(NC)     - Iniciar todos os serviços (production)"
	@echo "  $(GREEN)make stop$(NC)           - Parar todos os serviços"
	@echo "  $(GREEN)make restart$(NC)        - Reiniciar todos os serviços"
	@echo "  $(GREEN)make build$(NC)          - Build das imagens Docker"
	@echo "  $(GREEN)make logs$(NC)           - Ver logs de todos os serviços"
	@echo "  $(GREEN)make logs-api$(NC)       - Ver logs da API"
	@echo "  $(GREEN)make logs-worker$(NC)    - Ver logs do Worker"
	@echo "  $(GREEN)make health$(NC)         - Verificar saúde dos serviços"
	@echo "  $(GREEN)make backup$(NC)         - Criar backup completo"
	@echo "  $(GREEN)make restore$(NC)        - Restaurar backup"
	@echo "  $(GREEN)make migrate$(NC)        - Executar migrações do banco"
	@echo "  $(GREEN)make clean$(NC)          - Limpar containers e volumes"
	@echo "  $(GREEN)make shell-api$(NC)      - Shell no container da API"
	@echo "  $(GREEN)make shell-db$(NC)       - Shell no PostgreSQL"
	@echo "  $(GREEN)make db-reset$(NC)       - Resetar banco de dados"
	@echo ""

## start: Iniciar infraestrutura (desenvolvimento)
start:
	@echo "$(GREEN)Iniciando infraestrutura (desenvolvimento)...$(NC)"
	@./scripts/start.sh development

## start-prod: Iniciar infraestrutura (produção)
start-prod:
	@echo "$(GREEN)Iniciando infraestrutura (produção)...$(NC)"
	@./scripts/start.sh production

## stop: Parar todos os serviços
stop:
	@echo "$(YELLOW)Parando serviços...$(NC)"
	@./scripts/stop.sh

## restart: Reiniciar todos os serviços
restart: stop start

## build: Build das imagens Docker
build:
	@echo "$(YELLOW)Building Docker images...$(NC)"
	@$(COMPOSE) build

## build-prod: Build das imagens para produção
build-prod:
	@echo "$(YELLOW)Building Docker images (production)...$(NC)"
	@$(COMPOSE_PROD) build

## logs: Ver logs de todos os serviços
logs:
	@$(COMPOSE) logs -f --tail=100

## logs-api: Ver logs da API
logs-api:
	@$(COMPOSE) logs -f --tail=100 api

## logs-worker: Ver logs do Worker
logs-worker:
	@$(COMPOSE) logs -f --tail=100 worker

## logs-nginx: Ver logs do Nginx
logs-nginx:
	@$(COMPOSE) logs -f --tail=100 nginx

## health: Verificar saúde dos serviços
health:
	@./scripts/health.sh

## backup: Criar backup completo
backup:
	@./scripts/backup.sh

## restore: Restaurar backup (uso: make restore TIMESTAMP=20260215_143022)
restore:
	@./scripts/restore.sh $(TIMESTAMP)

## migrate: Executar migrações do banco
migrate:
	@./scripts/migrate.sh

## migrate-deploy: Executar migrações (production)
migrate-deploy:
	@$(COMPOSE) exec api npx prisma migrate deploy

## db-reset: Resetar banco de dados (CUIDADO!)
db-reset:
	@echo "$(RED)ATENÇÃO: Isso irá APAGAR todos os dados!$(NC)"
	@read -p "Confirmar? (yes/no): " confirm; \
	if [ "$$confirm" = "yes" ]; then \
		$(COMPOSE) exec api npx prisma migrate reset --force; \
	fi

## clean: Limpar containers, images e volumes
clean:
	@echo "$(RED)Limpando containers, images e volumes...$(NC)"
	@$(COMPOSE) down -v --rmi local
	@echo "$(GREEN)Limpeza concluída!$(NC)"

## shell-api: Shell no container da API
shell-api:
	@$(COMPOSE) exec api /bin/sh

## shell-worker: Shell no container do Worker
shell-worker:
	@$(COMPOSE) exec worker /bin/sh

## shell-db: Conectar ao PostgreSQL
shell-db:
	@$(COMPOSE) exec postgres psql -U nfv_user -d nfv_database

## shell-redis: Conectar ao Redis CLI
shell-redis:
	@$(COMPOSE) exec redis redis-cli -a redis_password

## ps: Ver status dos containers
ps:
	@$(COMPOSE) ps

## stats: Ver estatísticas de uso
stats:
	@docker stats --no-stream $$(docker ps --filter name=nfv- --format "{{.Names}}")

## test: Executar testes
test:
	@$(COMPOSE) exec api npm test

## test-e2e: Executar testes E2E
test-e2e:
	@$(COMPOSE) exec api npm run test:e2e

## lint: Executar linter
lint:
	@$(COMPOSE) exec api npm run lint

## format: Formatar código
format:
	@$(COMPOSE) exec api npm run format

## seed: Seed do banco de dados
seed:
	@$(COMPOSE) exec api npm run seed

## dev: Modo desenvolvimento com hot-reload
dev:
	@$(COMPOSE) up

## prod: Modo produção
prod:
	@$(COMPOSE_PROD) up -d

## down: Parar e remover containers
down:
	@$(COMPOSE) down

## up: Iniciar containers (sem build)
up:
	@$(COMPOSE) up -d

## pull: Pull das imagens mais recentes
pull:
	@$(COMPOSE) pull
