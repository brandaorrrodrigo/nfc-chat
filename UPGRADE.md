# 🔄 Guia de Upgrade

Guia completo para atualizar o NutriFitCoach NFC/NFV Platform entre versões.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Antes de Atualizar](#antes-de-atualizar)
- [Upgrade para v1.0.0](#upgrade-para-v100)
- [Rollback](#rollback)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

### Semantic Versioning

Este projeto segue [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.x.x): Mudanças incompatíveis que quebram API
- **MINOR** (x.1.x): Novas funcionalidades compatíveis com versões anteriores
- **PATCH** (x.x.1): Correções de bugs compatíveis

### Tipos de Upgrade

#### 1. Patch Upgrade (x.x.1 → x.x.2)
- ✅ **Seguro**: Apenas bug fixes
- ✅ **Downtime**: Zero (rolling update)
- ✅ **Rollback**: Automático se falhar
- ✅ **Backup**: Recomendado mas não obrigatório

#### 2. Minor Upgrade (x.1.x → x.2.x)
- ⚠️ **Seguro**: Novas features, sem breaking changes
- ⚠️ **Downtime**: Mínimo (~30s)
- ✅ **Rollback**: Simples
- ✅ **Backup**: Obrigatório

#### 3. Major Upgrade (1.x.x → 2.x.x)
- 🚨 **Breaking Changes**: Mudanças incompatíveis
- 🚨 **Downtime**: Moderado (~5-15min)
- ⚠️ **Rollback**: Complexo (pode precisar restore de DB)
- 🚨 **Backup**: CRÍTICO

---

## ⚠️ Antes de Atualizar

### Checklist Pré-Upgrade

```bash
# 1. Verificar versão atual
docker-compose exec api node -e "console.log(require('./package.json').version)"

# 2. Ler CHANGELOG da nova versão
cat CHANGELOG.md

# 3. Fazer backup COMPLETO
make backup
# OU manualmente:
./docker/scripts/backup.sh --with-uploads

# 4. Verificar espaço em disco
df -h
# Recomendado: ≥10GB livre

# 5. Verificar memória disponível
free -h
# Recomendado: ≥4GB livre

# 6. Testar em ambiente de staging PRIMEIRO
# Nunca faça upgrade direto em produção sem testar!

# 7. Notificar usuários (para upgrades com downtime)
# "Sistema em manutenção programada das 02:00 às 02:30 UTC"

# 8. Ter plano de rollback pronto
cat UPGRADE.md  # Seção "Rollback"
```

### Ambiente de Staging

**SEMPRE teste em staging antes de produção:**

```bash
# 1. Clone dados de produção para staging
./docker/scripts/backup.sh
# Copie backup para servidor de staging
scp postgres/backups/backup_*.sql.gz staging:/tmp/

# 2. No servidor de staging
./docker/scripts/restore.sh /tmp/backup_*.sql.gz

# 3. Faça o upgrade em staging
git checkout v1.1.0
make deploy

# 4. Teste TUDO
make test
make test-e2e
# Teste manual de funcionalidades críticas

# 5. Só depois de validado, faça em produção
```

---

## 🚀 Upgrade para v1.0.0

### De Versão Anterior (Beta/Alpha) → v1.0.0

Esta é a primeira versão de produção. Se você está vindo de uma versão beta/alpha anterior, siga estes passos:

#### 1. Backup Completo

```bash
# Backup de database + uploads
cd docker
./scripts/backup.sh --with-uploads

# Verificar backup criado
ls -lh postgres/backups/
# Deve ter backup_YYYYMMDD_HHMMSS.sql.gz
```

#### 2. Parar Serviços

```bash
make stop
# OU
docker-compose down
```

#### 3. Atualizar Código

```bash
# Fetch nova versão
git fetch --tags

# Checkout versão v1.0.0
git checkout v1.0.0

# OU se estiver usando clone direto
git pull origin main
```

#### 4. Atualizar Variáveis de Ambiente

```bash
# Compare .env com .env.example da nova versão
diff .env docker/.env.example

# Adicione NOVAS variáveis necessárias
vim .env
```

**Variáveis NOVAS em v1.0.0:**

```bash
# Adicionar ao .env se não existirem:

# Storage (obrigatório)
STORAGE_TYPE=local  # ou 's3'

# MinIO/S3 (se STORAGE_TYPE=s3)
MINIO_ENDPOINT=http://minio:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=nfv-videos
MINIO_USE_SSL=false

# Quota (obrigatório)
FREE_TIER_MONTHLY_ANALYSES=3
FREE_TIER_STORAGE_GB=0.5
PREMIUM_TIER_MONTHLY_ANALYSES=10
PREMIUM_TIER_STORAGE_GB=5
PREMIUM_PLUS_MONTHLY_ANALYSES=-1  # ilimitado
PREMIUM_PLUS_STORAGE_GB=100

# Upload (obrigatório)
MAX_FILE_SIZE_MB=500
ALLOWED_VIDEO_MIMETYPES=video/mp4,video/webm,video/quicktime,video/x-msvideo
UPLOAD_PATH=/app/uploads
THUMBNAIL_WIDTH=320
THUMBNAIL_HEIGHT=180

# Metrics (opcional)
ENABLE_METRICS=true
METRICS_PORT=9090
```

#### 5. Migrations de Database

**⚠️ BREAKING CHANGE: Schema mudou significativamente**

```bash
# Gerar nova migration
npx prisma migrate dev --name upgrade_to_v1

# OU aplicar migrations existentes
npx prisma migrate deploy
```

**Mudanças no Schema v1.0.0:**

- ✅ **Nova tabela:** `VideoUpload` (id, userId, key, size, metadata)
- ✅ **Nova tabela:** `Subscription` (id, userId, tier, limits)
- ✅ **Alterado:** `VideoAnalysis.results` agora é JSON estruturado (não string)
- ✅ **Adicionado:** `User.subscription` (relação com Subscription)
- ✅ **Adicionado:** `User.monthlyAnalysesUsed`, `User.storageUsedGB`

**Migration Manual (se automática falhar):**

```sql
-- Executar no PostgreSQL
docker-compose exec postgres psql -U nfv_user -d nfv_database

-- 1. Criar tabela VideoUpload
CREATE TABLE "video_uploads" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "key" TEXT NOT NULL UNIQUE,
  "filename" TEXT NOT NULL,
  "mimetype" TEXT NOT NULL,
  "size" BIGINT NOT NULL,
  "metadata" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE INDEX "video_uploads_user_id_idx" ON "video_uploads"("user_id");
CREATE INDEX "video_uploads_key_idx" ON "video_uploads"("key");

-- 2. Criar tabela Subscription
CREATE TABLE "subscriptions" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL UNIQUE,
  "tier" TEXT NOT NULL DEFAULT 'free',
  "monthly_analyses_limit" INTEGER NOT NULL DEFAULT 3,
  "storage_limit_gb" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
  "status" TEXT NOT NULL DEFAULT 'active',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- 3. Adicionar campos em User
ALTER TABLE "users" ADD COLUMN "monthly_analyses_used" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "users" ADD COLUMN "storage_used_gb" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "users" ADD COLUMN "last_quota_reset" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- 4. Criar subscriptions para users existentes
INSERT INTO "subscriptions" ("id", "user_id", "tier", "monthly_analyses_limit", "storage_limit_gb", "status", "created_at", "updated_at")
SELECT
  'sub_' || "id",
  "id",
  'free',
  3,
  0.5,
  'active',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "users"
WHERE NOT EXISTS (
  SELECT 1 FROM "subscriptions" WHERE "subscriptions"."user_id" = "users"."id"
);
```

#### 6. Rebuild Imagens Docker

```bash
# Rebuild com novas mudanças
make build
# OU
docker-compose build --no-cache
```

#### 7. Iniciar Serviços

```bash
make start
# OU
docker-compose up -d
```

#### 8. Verificar Health

```bash
# Aguardar todos os serviços ficarem healthy
make health

# Verificar logs
make logs

# Testar endpoint
curl http://localhost:3000/health
```

#### 9. Smoke Tests

```bash
# 1. Testar upload
curl -X POST http://localhost:3000/api/upload/video \
  -F "video=@test-video.mp4" \
  -F "userId=test-user-id"

# 2. Testar análise
curl -X POST http://localhost:3000/api/biomechanics/analyze \
  -H "Content-Type: application/json" \
  -d '{"videoId":"va_test"}'

# 3. Testar quota
curl http://localhost:3000/api/users/me/quota \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 4. Verificar métricas
curl http://localhost:3000/api/metrics
```

#### 10. Monitorar

```bash
# Monitorar logs por 15 minutos
make logs-api
make logs-worker

# Verificar erros
make logs | grep -i error

# Verificar métricas
# Abrir Grafana: http://localhost:3000
# Dashboards → NFC/NFV Overview
```

### Upgrade Bem-Sucedido ✅

Se tudo passou:
- ✅ Health checks todos `healthy`
- ✅ Smoke tests passaram
- ✅ Logs sem erros críticos
- ✅ Métricas normais

**Upgrade completo!** 🎉

---

## ⏪ Rollback

### Rollback Rápido (< 1 hora após upgrade)

Se detectar problema IMEDIATAMENTE após upgrade:

```bash
# 1. Parar serviços
make stop

# 2. Voltar para versão anterior
git checkout v0.9.0  # Versão anterior

# 3. Restaurar backup
./docker/scripts/restore.sh postgres/backups/backup_BEFORE_UPGRADE.sql.gz

# 4. Rebuild (se Dockerfile mudou)
make build

# 5. Iniciar
make start

# 6. Verificar
make health
```

### Rollback Completo (> 1 hora após upgrade)

Se já houve mudanças de dados após upgrade:

```bash
# 1. Notificar usuários
echo "Sistema em manutenção para correção de problemas"

# 2. Fazer backup do estado atual (para investigação)
./docker/scripts/backup.sh
mv postgres/backups/backup_*.sql.gz postgres/backups/backup_FAILED_UPGRADE.sql.gz

# 3. Parar serviços
make stop

# 4. Voltar código
git checkout v0.9.0

# 5. Restaurar backup PRÉ-UPGRADE
./docker/scripts/restore.sh postgres/backups/backup_BEFORE_UPGRADE.sql.gz

# 6. Rebuild + Start
make build
make start

# 7. Verificar
make health
make test

# 8. Investigar causa do problema
# Comparar logs:
diff postgres/backups/backup_BEFORE_UPGRADE.sql.gz \
     postgres/backups/backup_FAILED_UPGRADE.sql.gz
```

### Rollback de Migration

Se apenas migration falhou:

```bash
# 1. Reverter migration
npx prisma migrate resolve --rolled-back MIGRATION_NAME

# 2. OU restaurar backup
./docker/scripts/restore.sh postgres/backups/backup_BEFORE_UPGRADE.sql.gz

# 3. Investigar problema
npx prisma migrate status
npx prisma validate
```

---

## 🔧 Troubleshooting

### Problema: Migration Falhou

```bash
# Sintoma
Error: Migration failed: P3009
Database migration failed on execution

# Solução
# 1. Verificar estado das migrations
npx prisma migrate status

# 2. Marcar migration como resolvida (se já foi aplicada manualmente)
npx prisma migrate resolve --applied MIGRATION_NAME

# 3. OU reverter
npx prisma migrate resolve --rolled-back MIGRATION_NAME

# 4. Aplicar novamente
npx prisma migrate deploy
```

### Problema: Container Não Inicia

```bash
# Sintoma
Error: Container exits immediately after start

# Solução
# 1. Verificar logs
docker-compose logs api
docker-compose logs worker

# 2. Verificar variáveis de ambiente
docker-compose config

# 3. Verificar health
docker-compose ps

# 4. Entrar no container para debug
docker-compose run --rm api sh
# Dentro do container:
env | grep DATABASE
node -e "require('./dist/main')"
```

### Problema: Database Connection Failed

```bash
# Sintoma
Error: Can't reach database server at localhost:5432

# Solução
# 1. Verificar se PostgreSQL está rodando
docker-compose ps postgres

# 2. Verificar logs do PostgreSQL
docker-compose logs postgres

# 3. Verificar conexão
docker-compose exec postgres pg_isready

# 4. Testar conexão manual
docker-compose exec postgres psql -U nfv_user -d nfv_database -c "SELECT 1"

# 5. Verificar DATABASE_URL no .env
echo $DATABASE_URL
```

### Problema: Out of Memory

```bash
# Sintoma
Error: JavaScript heap out of memory

# Solução
# 1. Aumentar limite de memória no Docker
# docker-compose.yml
services:
  api:
    deploy:
      resources:
        limits:
          memory: 8G  # Era 4G

# 2. Aumentar heap do Node.js
# .env
NODE_OPTIONS=--max-old-space-size=6144  # Era 4096

# 3. Restart
make restart
```

### Problema: Quota Reset Não Funcionou

```bash
# Sintoma
Usuários ainda com quota zerada após reset mensal

# Solução
# 1. Reset manual
docker-compose exec postgres psql -U nfv_user -d nfv_database

UPDATE users
SET monthly_analyses_used = 0,
    last_quota_reset = CURRENT_TIMESTAMP
WHERE last_quota_reset < DATE_TRUNC('month', CURRENT_TIMESTAMP);

# 2. Verificar
SELECT id, email, monthly_analyses_used, last_quota_reset
FROM users
LIMIT 10;
```

### Problema: Upload Falha Após Upgrade

```bash
# Sintoma
Error: ENOENT: no such file or directory '/app/uploads'

# Solução
# 1. Criar diretório de uploads
docker-compose exec api mkdir -p /app/uploads
docker-compose exec api chown -R nodejs:nodejs /app/uploads

# 2. Verificar volume montado
docker-compose config | grep -A 5 volumes

# 3. Verificar permissões
docker-compose exec api ls -la /app/
```

---

## 📞 Suporte

Se encontrar problemas durante upgrade:

1. **Verifique CHANGELOG.md** - Mudanças conhecidas
2. **Verifique GitHub Issues** - Problemas reportados
3. **Consulte documentação** - README.md, SECURITY.md, PERFORMANCE.md
4. **Faça rollback** - Se crítico, volte para versão anterior
5. **Reporte problema** - GitHub Issues ou email

**Contatos:**
- **GitHub Issues:** [github.com/nutrifitcoach/nfc-comunidades/issues](https://github.com/nutrifitcoach/nfc-comunidades/issues)
- **Email:** support@nutrifitcoach.com.br
- **Discord:** [discord.gg/nutrifitcoach](https://discord.gg/nutrifitcoach)

---

## 📋 Checklist Pós-Upgrade

Após completar upgrade:

- [ ] ✅ Todos os serviços healthy
- [ ] ✅ Smoke tests passaram
- [ ] ✅ Logs sem erros críticos
- [ ] ✅ Métricas dentro do normal
- [ ] ✅ Backup criado e validado
- [ ] ✅ Usuários notificados (se houve downtime)
- [ ] ✅ Documentação atualizada (se necessário)
- [ ] ✅ Monitoramento ativo por 24h
- [ ] ✅ Plano de rollback documentado
- [ ] ✅ Time informado sobre mudanças

---

**Última atualização:** 2026-02-15
**Versão:** 1.0.0

🔄 **Sempre teste em staging antes de produção!**
