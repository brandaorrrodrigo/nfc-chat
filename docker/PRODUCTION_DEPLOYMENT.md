# 🚀 PRODUCTION DEPLOYMENT GUIDE

Guia passo-a-passo para fazer deploy da infraestrutura NFC/NFV em produção.

---

## 📋 Pré-requisitos

### Servidor

- ✅ **Ubuntu 22.04 LTS** ou superior
- ✅ **Mínimo:** 8 CPU cores, 32GB RAM, 200GB SSD
- ✅ **Recomendado:** 16 CPU cores, 64GB RAM, 500GB SSD
- ✅ **IP público** com DNS configurado
- ✅ **Portas abertas:** 80, 443, 22

### Software

- Docker 24.0+
- Docker Compose 2.20+
- Git
- Make (opcional)

---

## 🎯 Step-by-Step Deployment

### STEP 1: Preparar Servidor

```bash
# Conectar ao servidor
ssh root@seu-servidor.com

# Atualizar sistema
apt update && apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
apt install docker-compose-plugin -y

# Verificar instalação
docker --version
docker compose version

# Criar usuário para deploy (opcional, mas recomendado)
adduser nfvdeploy
usermod -aG docker nfvdeploy
su - nfvdeploy
```

### STEP 2: Clonar Repositório

```bash
# Criar diretório
mkdir -p /opt/nfc-comunidades
cd /opt/nfc-comunidades

# Clonar repo
git clone https://github.com/nutrifitcoach/nfc-comunidades.git .

# OU fazer upload via SCP
# scp -r /local/path user@server:/opt/nfc-comunidades
```

### STEP 3: Configurar Secrets

```bash
cd docker

# Criar diretório de secrets
mkdir -p secrets

# Gerar senhas seguras
openssl rand -base64 32 > secrets/postgres_password.txt
openssl rand -base64 48 > secrets/jwt_secret.txt
openssl rand -base64 32 > secrets/redis_password.txt
openssl rand -base64 32 > secrets/minio_password.txt

# Definir permissões
chmod 600 secrets/*
chmod 700 secrets

# Verificar
ls -la secrets/
```

### STEP 4: Configurar .env

```bash
# Copiar template
cp .env.example .env

# Editar configurações
nano .env
```

**Configurações OBRIGATÓRIAS para produção:**

```bash
# Environment
NODE_ENV=production

# PostgreSQL
POSTGRES_USER=nfv_user
POSTGRES_PASSWORD=<ler do secrets/postgres_password.txt>
POSTGRES_DB=nfv_production

# Redis
REDIS_PASSWORD=<ler do secrets/redis_password.txt>
REDIS_MAX_MEMORY=2gb

# MinIO
MINIO_ROOT_USER=nfvadmin
MINIO_ROOT_PASSWORD=<ler do secrets/minio_password.txt>
MINIO_APP_USER=nfvapp
MINIO_APP_PASSWORD=<outra senha segura>
MINIO_DOMAIN=storage.nutrifitcoach.com.br
MINIO_SERVER_URL=https://storage.nutrifitcoach.com.br

# API
API_PORT=3000
JWT_SECRET=<ler do secrets/jwt_secret.txt>
CORS_ORIGIN=https://nutrifitcoach.com.br,https://app.nutrifitcoach.com.br

# Storage
STORAGE_TYPE=minio
MAX_FILE_SIZE=104857600

# Processing
TF_BACKEND=cpu
TF_THREADS=8
MAX_CONCURRENT_VIDEOS=4
WORKER_CONCURRENCY=3

# Nginx
HTTP_PORT=80
HTTPS_PORT=443
```

### STEP 5: Configurar SSL/TLS

#### Opção A: Let's Encrypt (Recomendado)

```bash
# Instalar certbot
apt install certbot -y

# Parar Nginx se estiver rodando
docker-compose down nginx 2>/dev/null || true

# Obter certificados
certbot certonly --standalone \
  -d api.nutrifitcoach.com.br \
  -d storage.nutrifitcoach.com.br \
  --email admin@nutrifitcoach.com.br \
  --agree-tos \
  --no-eff-email

# Copiar certificados
mkdir -p nginx/ssl
cp /etc/letsencrypt/live/api.nutrifitcoach.com.br/fullchain.pem nginx/ssl/
cp /etc/letsencrypt/live/api.nutrifitcoach.com.br/privkey.pem nginx/ssl/

# Definir permissões
chmod 644 nginx/ssl/fullchain.pem
chmod 600 nginx/ssl/privkey.pem

# Configurar renovação automática
crontab -e
# Adicionar:
0 0 * * * certbot renew --quiet --deploy-hook "docker-compose -f /opt/nfc-comunidades/docker/docker-compose.yml restart nginx"
```

#### Opção B: Certificado próprio

```bash
mkdir -p nginx/ssl

# Copiar seus certificados
cp /path/to/fullchain.pem nginx/ssl/
cp /path/to/privkey.pem nginx/ssl/

chmod 644 nginx/ssl/fullchain.pem
chmod 600 nginx/ssl/privkey.pem
```

### STEP 6: Configurar Nginx para Produção

```bash
# Editar nginx.conf
nano nginx/nginx.conf
```

**Descomentar seção HTTPS:**

```nginx
# Descomentar linhas 95-146 (server HTTPS)
server {
    listen 443 ssl http2;
    server_name api.nutrifitcoach.com.br;

    # SSL Certificates
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    # ... resto da config
}
```

**Habilitar redirect HTTP → HTTPS:**

```nginx
# Na seção HTTP (linha ~78), descomentar:
return 301 https://$host$request_uri;
```

### STEP 7: Build das Imagens

```bash
# Build produção
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Verificar imagens criadas
docker images | grep nfc
```

### STEP 8: Iniciar Serviços

```bash
# Iniciar em produção
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Acompanhar logs
docker-compose logs -f
```

### STEP 9: Executar Migrações

```bash
# Aguardar banco ficar pronto (30-60 segundos)
sleep 60

# Executar migrações
docker-compose exec api npx prisma migrate deploy

# Gerar Prisma Client
docker-compose exec api npx prisma generate

# (Opcional) Seed inicial
docker-compose exec api npm run seed
```

### STEP 10: Verificar Saúde

```bash
# Health check
./scripts/health.sh

# OU verificar manualmente
curl https://api.nutrifitcoach.com.br/health
curl https://api.nutrifitcoach.com.br/api/docs

# Verificar containers
docker-compose ps

# Verificar recursos
docker stats
```

---

## 🔒 Configurações de Segurança

### Firewall (UFW)

```bash
# Habilitar UFW
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable

# Verificar status
ufw status
```

### Fail2Ban (Proteção contra brute force)

```bash
# Instalar
apt install fail2ban -y

# Configurar
cat > /etc/fail2ban/jail.local <<EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
EOF

# Reiniciar
systemctl restart fail2ban
systemctl status fail2ban
```

### Limitar acesso ao PostgreSQL/Redis

```bash
# Editar docker-compose.yml
# Remover seções "ports:" de postgres e redis
# Eles só precisam estar acessíveis internamente
```

### Secrets Management

```bash
# NUNCA commitar secrets no Git
echo "secrets/" >> .gitignore
echo ".env" >> .gitignore

# Backup dos secrets em local SEGURO (fora do servidor)
scp -r secrets/ user@backup-server:/secure/nfc-secrets-backup/
```

---

## 💾 Configurar Backups Automáticos

### Backup Diário

```bash
# Criar diretório de backups
mkdir -p /opt/nfc-backups

# Configurar cron
crontab -e

# Adicionar linhas:
# Backup diário às 3h
0 3 * * * cd /opt/nfc-comunidades/docker && ./scripts/backup.sh >> /var/log/nfc-backup.log 2>&1

# Limpar backups antigos (manter 30 dias)
0 4 * * * find /opt/nfc-comunidades/docker/backups -name "*.tar.gz" -mtime +30 -delete
```

### Backup Remoto (Opcional)

```bash
# Instalar rclone
curl https://rclone.org/install.sh | bash

# Configurar cloud storage (S3, Google Drive, etc)
rclone config

# Script de sync
cat > /opt/nfc-backups/sync-to-cloud.sh <<'EOF'
#!/bin/bash
BACKUP_DIR="/opt/nfc-comunidades/docker/backups"
REMOTE="mycloud:nfc-backups"

echo "Syncing backups to cloud..."
rclone sync $BACKUP_DIR $REMOTE --progress
echo "Sync complete!"
EOF

chmod +x /opt/nfc-backups/sync-to-cloud.sh

# Cron para sync diário
crontab -e
# Adicionar:
0 5 * * * /opt/nfc-backups/sync-to-cloud.sh >> /var/log/nfc-cloud-backup.log 2>&1
```

---

## 📊 Monitoramento

### Logs Centralizados

```bash
# Ver logs em tempo real
docker-compose logs -f

# Ver logs de serviço específico
docker-compose logs -f api
docker-compose logs -f worker

# Logs do Nginx
docker-compose exec nginx tail -f /var/log/nginx/access.log
docker-compose exec nginx tail -f /var/log/nginx/error.log
```

### Resource Monitoring

```bash
# Instalar htop
apt install htop -y

# Monitorar
htop

# Docker stats
docker stats

# Disk usage
df -h
du -sh /var/lib/docker
```

### Alertas (Opcional)

```bash
# Instalar prometheus-node-exporter
apt install prometheus-node-exporter -y

# Expor métricas
# Configurar Grafana Cloud ou self-hosted Prometheus
```

---

## 🔄 Updates e Maintenance

### Atualizar Aplicação

```bash
cd /opt/nfc-comunidades

# Backup antes de atualizar
cd docker
./scripts/backup.sh

# Pull código novo
git pull origin main

# Rebuild imagens
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Parar serviços
docker-compose down

# Executar migrações
docker-compose up -d postgres redis
sleep 30
docker-compose run --rm api npx prisma migrate deploy

# Iniciar todos os serviços
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Verificar
./scripts/health.sh
```

### Atualizar Docker Images Base

```bash
# Pull novas versões
docker-compose pull

# Restart com novas images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Limpar images antigas
docker image prune -a
```

### Limpar Recursos

```bash
# Limpar containers parados
docker container prune

# Limpar images não usadas
docker image prune -a

# Limpar volumes órfãos
docker volume prune

# Limpar tudo (CUIDADO!)
docker system prune -a --volumes
```

---

## 🆘 Disaster Recovery

### Restaurar de Backup

```bash
cd /opt/nfc-comunidades/docker

# Listar backups
ls -lh backups/

# Restaurar
./scripts/restore.sh 20260215_143022

# Verificar
./scripts/health.sh
docker-compose logs -f
```

### Migrar para Novo Servidor

```bash
# No servidor ANTIGO:
cd /opt/nfc-comunidades/docker
./scripts/backup.sh

# Copiar backup para novo servidor
scp backups/nfv_backup_TIMESTAMP.tar.gz user@novo-servidor:/tmp/

# No servidor NOVO:
# 1. Seguir steps 1-5 (preparar servidor)
# 2. Copiar backup
mkdir -p /opt/nfc-comunidades/docker/backups
mv /tmp/nfv_backup_TIMESTAMP.tar.gz /opt/nfc-comunidades/docker/backups/

# 3. Restaurar
cd /opt/nfc-comunidades/docker
./scripts/restore.sh TIMESTAMP

# 4. Atualizar DNS para apontar para novo servidor
```

---

## ✅ Production Checklist

Antes de ir para produção, verificar:

### Configuração
- [ ] Variáveis de ambiente configuradas (.env)
- [ ] Secrets criados e protegidos
- [ ] SSL/TLS configurado (Let's Encrypt ou próprio)
- [ ] CORS configurado com domínios corretos
- [ ] Nginx configurado para HTTPS
- [ ] DNS apontando para servidor

### Segurança
- [ ] Senhas fortes geradas
- [ ] Secrets NÃO commitados no Git
- [ ] Firewall configurado (UFW)
- [ ] Fail2Ban instalado
- [ ] PostgreSQL/Redis sem portas expostas publicamente
- [ ] Usuários não-root nos containers

### Backup
- [ ] Backup automático configurado (cron)
- [ ] Testado restore de backup
- [ ] Backup remoto configurado (opcional)
- [ ] Retenção de backups configurada

### Monitoramento
- [ ] Health checks funcionando
- [ ] Logs centralizados acessíveis
- [ ] Resource monitoring configurado
- [ ] Alertas configurados (opcional)

### Performance
- [ ] Resource limits configurados
- [ ] Replicas configuradas (API: 2, Worker: 3)
- [ ] Redis max memory configurado
- [ ] Nginx rate limiting configurado

### Testes
- [ ] Health check OK em todos os serviços
- [ ] API respondendo (https://api.domain.com/health)
- [ ] Swagger acessível (https://api.domain.com/api/docs)
- [ ] Upload de vídeo funcionando
- [ ] Worker processando jobs
- [ ] MinIO acessível

---

## 📞 Suporte

**Issues:** https://github.com/nutrifitcoach/nfc-comunidades/issues

**Email:** devops@nutrifitcoach.com.br

**Documentação:** `/opt/nfc-comunidades/docker/README.md`

---

## 🎉 Deployment Concluído!

Se todos os passos foram seguidos corretamente, sua infraestrutura NFC/NFV está:

- ✅ Rodando em produção
- ✅ Com HTTPS configurado
- ✅ Com backups automáticos
- ✅ Monitorada e segura
- ✅ Pronta para escalar

**Next steps:**
1. Configurar domínio e DNS
2. Testar upload de vídeos
3. Configurar monitoramento avançado (opcional)
4. Configurar CI/CD (opcional)

---

**Desenvolvido por NutriFitCoach DevOps Team**
**Versão:** 1.0.0
**Data:** 2026-02-15
