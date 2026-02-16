# 🐳 NFC/NFV Docker Infrastructure

Infraestrutura Docker completa para o sistema de análise biomecânica NFC/NFV com PostgreSQL, Redis, MinIO, API NestJS, Workers e Nginx.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Pré-requisitos](#pré-requisitos)
- [Quick Start](#quick-start)
- [Arquitetura](#arquitetura)
- [Serviços](#serviços)
- [Configuração](#configuração)
- [Comandos](#comandos)
- [Backup e Restore](#backup-e-restore)
- [Troubleshooting](#troubleshooting)
- [Produção](#produção)

---

## 🎯 Visão Geral

Esta infraestrutura fornece:

- ✅ **PostgreSQL 16** - Banco de dados principal com backup automático
- ✅ **Redis 7** - Cache e filas BullMQ
- ✅ **MinIO** - Storage S3-compatible para vídeos
- ✅ **API NestJS** - Backend REST com Swagger
- ✅ **Worker** - Processamento assíncrono de análises
- ✅ **Nginx** - Reverse proxy e load balancer
- ✅ **Health Checks** - Monitoramento automático
- ✅ **Volumes Persistentes** - Dados preservados entre restarts
- ✅ **Networks Isoladas** - Segurança entre containers
- ✅ **Logs Centralizados** - JSON logs com rotação
- ✅ **Scripts de Gerenciamento** - Automação completa

---

## 📦 Pré-requisitos

### Software Necessário

```bash
# Docker
docker --version  # >= 24.0.0

# Docker Compose
docker-compose --version  # >= 2.20.0
# OU
docker compose version

# Make (opcional, mas recomendado)
make --version
```

### Instalação do Docker

#### Windows
1. Baixar Docker Desktop: https://www.docker.com/products/docker-desktop
2. Instalar e reiniciar
3. Habilitar WSL2 se solicitado

#### Linux
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER
```

#### macOS
1. Baixar Docker Desktop: https://www.docker.com/products/docker-desktop
2. Instalar via DMG

---

## 🚀 Quick Start

### 1. Configurar Variáveis de Ambiente

```bash
cd docker
cp .env.example .env
```

Editar `.env` com suas configurações:
```bash
# Exemplo mínimo
POSTGRES_PASSWORD=sua_senha_segura_aqui
REDIS_PASSWORD=outra_senha_segura
JWT_SECRET=chave_jwt_muito_segura_min_32_chars
```

### 2. Iniciar Infraestrutura

**Usando Make (recomendado):**
```bash
make start
```

**Usando scripts diretamente:**
```bash
./scripts/start.sh
```

**Usando Docker Compose:**
```bash
docker-compose up -d
```

### 3. Verificar Status

```bash
make health
# OU
./scripts/health.sh
# OU
docker-compose ps
```

### 4. Acessar Serviços

- **API:** http://localhost:3000
- **API Docs (Swagger):** http://localhost:3000/api/docs
- **MinIO Console:** http://localhost:9001 (admin/admin123)
- **Health Check:** http://localhost/health

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                        NGINX (Port 80/443)                   │
│                     Reverse Proxy + SSL                      │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   API:3000   │  │   API:3000   │  │   API:3000   │
│  (Replica 1) │  │  (Replica 2) │  │  (Replica 3) │
└───────┬──────┘  └───────┬──────┘  └───────┬──────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  PostgreSQL  │  │    Redis     │  │    MinIO     │
│   Port 5432  │  │   Port 6379  │  │  Port 9000   │
└──────────────┘  └──────────────┘  └──────────────┘
        │                 │                 │
        │                 ▼                 │
        │          ┌──────────────┐         │
        │          │   Worker 1   │         │
        │          ├──────────────┤         │
        └──────────│   Worker 2   │─────────┘
                   ├──────────────┤
                   │   Worker 3   │
                   └──────────────┘
```

---

## 🔧 Serviços

### PostgreSQL
- **Imagem:** `postgres:16-alpine`
- **Porta:** 5432
- **Volumes:** `postgres_data` → `/var/lib/postgresql/data`
- **Backups:** `./postgres/backups`

### Redis
- **Imagem:** `redis:7-alpine`
- **Porta:** 6379
- **Persistência:** AOF enabled
- **Max Memory:** 512MB (configura LRU)

### MinIO
- **Imagem:** `minio/minio:latest`
- **Porta API:** 9000
- **Porta Console:** 9001
- **Bucket:** `nfv-videos` (criado automaticamente)
- **Volumes:** `minio_data` → `/data`

### API (NestJS)
- **Build:** Multi-stage com Node 20 Alpine
- **Porta:** 3000
- **Replicas (prod):** 2
- **Health Check:** `/health`
- **Volumes:**
  - Source code (dev, read-only)
  - Uploads, frames, results

### Worker
- **Build:** Multi-stage com Node 20 Alpine
- **Replicas (prod):** 3
- **Concorrência:** 2 jobs simultâneos por worker
- **Processamento:** TensorFlow + FFmpeg

### Nginx
- **Imagem:** `nginx:alpine`
- **Portas:** 80, 443
- **SSL:** Self-signed (dev) / Let's Encrypt (prod)
- **Features:**
  - Reverse proxy
  - Load balancing (least_conn)
  - Rate limiting
  - Gzip compression

---

## ⚙️ Configuração

### Variáveis de Ambiente (.env)

```bash
# Node
NODE_ENV=development  # development | production

# PostgreSQL
POSTGRES_USER=nfv_user
POSTGRES_PASSWORD=change_me_in_production
POSTGRES_DB=nfv_database

# Redis
REDIS_PASSWORD=change_me_in_production
REDIS_MAX_MEMORY=512mb

# MinIO
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=change_me_in_production
MINIO_APP_USER=nfvapp
MINIO_APP_PASSWORD=change_me_in_production

# API
API_PORT=3000
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
CORS_ORIGIN=http://localhost:3000

# Storage
STORAGE_TYPE=minio  # local | minio | s3
MAX_FILE_SIZE=104857600  # 100MB

# Processing
TF_BACKEND=cpu  # cpu | gpu
TF_THREADS=4
MAX_CONCURRENT_VIDEOS=2
WORKER_CONCURRENCY=2

# Nginx
HTTP_PORT=80
HTTPS_PORT=443
```

### Secrets (Produção)

Para produção, use secrets do Docker:

```bash
# Criar secrets
echo "senha_super_segura" > docker/secrets/postgres_password.txt
echo "jwt_key_min_32_chars_very_secure" > docker/secrets/jwt_secret.txt

# Usar no docker-compose.prod.yml
secrets:
  postgres_password:
    file: ./secrets/postgres_password.txt
```

---

## 📝 Comandos

### Make (Recomendado)

```bash
# Ver todos os comandos
make help

# Iniciar
make start              # Desenvolvimento
make start-prod         # Produção

# Parar
make stop               # Parar serviços
make down               # Parar e remover containers

# Logs
make logs               # Todos os serviços
make logs-api           # Apenas API
make logs-worker        # Apenas Worker

# Saúde
make health             # Verificar status de todos os serviços

# Build
make build              # Build desenvolvimento
make build-prod         # Build produção

# Banco de Dados
make migrate            # Executar migrações
make db-reset           # Resetar banco (CUIDADO!)
make shell-db           # Conectar ao PostgreSQL

# Shells
make shell-api          # Shell no container da API
make shell-worker       # Shell no Worker
make shell-redis        # Redis CLI

# Backup/Restore
make backup             # Criar backup completo
make restore TIMESTAMP=20260215_143022  # Restaurar backup

# Limpeza
make clean              # Remover containers, images e volumes

# Desenvolvimento
make dev                # Modo desenvolvimento (com logs)
make test               # Executar testes
make lint               # Linter
```

### Scripts Diretos

```bash
# Gerenciamento
./scripts/start.sh [development|production]
./scripts/stop.sh [--volumes]
./scripts/health.sh
./scripts/logs.sh [service]

# Banco de Dados
./scripts/migrate.sh
./scripts/backup.sh
./scripts/restore.sh TIMESTAMP
```

### Docker Compose

```bash
# Básico
docker-compose up -d           # Iniciar
docker-compose down            # Parar
docker-compose ps              # Status
docker-compose logs -f         # Logs

# Serviços específicos
docker-compose up -d api       # Apenas API
docker-compose restart worker  # Reiniciar worker
docker-compose exec api sh     # Shell na API

# Build
docker-compose build           # Build todas as imagens
docker-compose build --no-cache api  # Rebuild API sem cache

# Produção
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## 💾 Backup e Restore

### Backup Automático

```bash
# Backup completo (DB + Redis + volumes)
make backup
# OU
./scripts/backup.sh
```

O backup cria:
- `postgres_TIMESTAMP.sql.gz` - Dump do PostgreSQL
- `redis_TIMESTAMP.rdb` - Snapshot do Redis
- `.env.backup` - Cópia das variáveis
- `backup_info.txt` - Metadados
- `nfv_backup_TIMESTAMP.tar.gz` - Arquivo final comprimido

### Restore

```bash
# Listar backups disponíveis
ls -lh docker/backups/nfv_backup_*.tar.gz

# Restaurar backup específico
make restore TIMESTAMP=20260215_143022
# OU
./scripts/restore.sh 20260215_143022
```

### Backup Agendado (Cron)

Adicionar ao crontab:
```bash
# Backup diário às 3h
0 3 * * * cd /path/to/nfc-comunidades/docker && ./scripts/backup.sh >> /var/log/nfv-backup.log 2>&1
```

---

## 🔍 Troubleshooting

### Container não inicia

```bash
# Ver logs do container
docker-compose logs [service]

# Ver todos os logs
docker-compose logs

# Rebuild sem cache
docker-compose build --no-cache [service]
```

### Banco de dados não conecta

```bash
# Verificar se PostgreSQL está rodando
docker-compose ps postgres

# Verificar health check
docker-compose ps | grep postgres

# Conectar manualmente
make shell-db
# OU
docker-compose exec postgres psql -U nfv_user -d nfv_database
```

### Worker não processa jobs

```bash
# Verificar logs do worker
make logs-worker

# Verificar Redis
make shell-redis
> KEYS *  # Ver todas as chaves
> LLEN bull:video-analysis:wait  # Ver fila de espera
```

### MinIO não acessível

```bash
# Verificar se MinIO está rodando
docker-compose ps minio

# Acessar console
http://localhost:9001

# Verificar bucket
docker-compose exec minio mc ls nfvminio/nfv-videos
```

### Porta já em uso

```bash
# Encontrar processo usando a porta
netstat -ano | findstr :3000  # Windows
lsof -i :3000                  # Linux/Mac

# Mudar porta no .env
API_PORT=3001
```

### Limpar tudo e recomeçar

```bash
# CUIDADO: Remove TODOS os dados!
make clean
make start
```

---

## 🚀 Produção

### 1. Preparar Secrets

```bash
# Criar secrets
mkdir -p docker/secrets
echo "senha_postgresql_super_segura_min_16_chars" > docker/secrets/postgres_password.txt
echo "chave_jwt_super_segura_min_32_chars_random" > docker/secrets/jwt_secret.txt

# Permissões
chmod 600 docker/secrets/*
```

### 2. Configurar .env para Produção

```bash
NODE_ENV=production
POSTGRES_PASSWORD=use_secret_file
JWT_SECRET=use_secret_file
REDIS_PASSWORD=senha_forte_redis
MINIO_ROOT_PASSWORD=senha_forte_minio

# Domínios
CORS_ORIGIN=https://nutrifitcoach.com.br
```

### 3. SSL/TLS com Let's Encrypt

```bash
# Instalar certbot
apt-get install certbot

# Obter certificado
certbot certonly --standalone -d api.nutrifitcoach.com.br

# Copiar certificados
cp /etc/letsencrypt/live/api.nutrifitcoach.com.br/fullchain.pem docker/nginx/ssl/
cp /etc/letsencrypt/live/api.nutrifitcoach.com.br/privkey.pem docker/nginx/ssl/

# Descomentar configuração HTTPS no nginx.conf
```

### 4. Iniciar em Produção

```bash
make start-prod
# OU
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 5. Monitoramento

```bash
# Health checks contínuos
watch -n 10 make health

# Logs em tempo real
make logs

# Recursos
docker stats
```

### 6. Backup Automático

```bash
# Cron para backup diário
crontab -e

# Adicionar linha:
0 3 * * * cd /opt/nfc-comunidades/docker && ./scripts/backup.sh
```

---

## 📊 Recursos e Limites

### Desenvolvimento

| Serviço | CPU | Memória | Storage |
|---------|-----|---------|---------|
| PostgreSQL | Ilimitado | Ilimitado | 10GB |
| Redis | Ilimitado | 512MB | 1GB |
| MinIO | Ilimitado | Ilimitado | 50GB |
| API | Ilimitado | Ilimitado | - |
| Worker | Ilimitado | Ilimitado | - |

### Produção

| Serviço | CPU | Memória | Replicas |
|---------|-----|---------|----------|
| PostgreSQL | 1-2 cores | 1-2GB | 1 |
| Redis | 0.5-1 core | 512MB-1GB | 1 |
| MinIO | 0.5-1 core | 1-2GB | 1 |
| API | 1-2 cores | 2-4GB | 2 |
| Worker | 2-4 cores | 4-8GB | 3 |

---

## 📚 Documentação Adicional

- [Swagger API Docs](http://localhost:3000/api/docs)
- [MinIO Documentation](https://min.io/docs/minio/linux/index.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/docs/)
- [NestJS Documentation](https://docs.nestjs.com/)

---

## 🆘 Suporte

**Issues:** https://github.com/nutrifitcoach/nfc-comunidades/issues

**Email:** suporte@nutrifitcoach.com.br

---

## 📄 Licença

Propriedade de NutriFitCoach © 2026

---

**🎉 Infraestrutura criada e documentada com sucesso!**
