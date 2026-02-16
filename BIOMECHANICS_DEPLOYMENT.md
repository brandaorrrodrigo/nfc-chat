# 🚀 Deployment Guide - NFC/NFV Biomechanics System

Guia completo para deployment do sistema de análise biomecânica em produção.

---

## 📋 Pré-requisitos

### Hardware Recomendado

**Mínimo (Desenvolvimento):**
- CPU: 4 cores
- RAM: 8GB
- Disco: 50GB SSD
- Rede: 100 Mbps

**Recomendado (Produção):**
- CPU: 8+ cores (16 threads)
- RAM: 16GB+
- Disco: 200GB+ SSD NVMe
- Rede: 1 Gbps
- GPU: NVIDIA com CUDA (opcional, melhora 5x a performance)

### Software

- Docker 24+ e Docker Compose 2+
- Node.js 20+ (para desenvolvimento local)
- PostgreSQL 16+
- Redis 7+
- FFmpeg 6+

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────┐
│              Load Balancer (Nginx)           │
└────────────┬────────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼────┐       ┌───▼────┐
│  App   │       │ Worker │
│ (API)  │       │ (Queue)│
└────┬───┘       └───┬────┘
     │               │
┌────┴───────────────┴────┐
│       Redis (Fila)       │
└─────────┬────────────────┘
          │
┌─────────▼────────┐
│  PostgreSQL (DB) │
└──────────────────┘
```

---

## 🐳 Quick Start com Docker

### 1. Clone e Configure

```bash
git clone https://github.com/seu-repo/nfc-comunidades.git
cd nfc-comunidades

# Copiar configuração
cp .env.biomechanics.example .env.biomechanics

# Editar variáveis
nano .env.biomechanics
```

### 2. Build e Deploy

```bash
# Desenvolvimento (com hot reload)
docker-compose -f docker-compose.biomechanics.yml up -d

# Produção
docker-compose -f docker-compose.biomechanics.yml --profile production up -d

# Com ferramentas de monitoramento
docker-compose -f docker-compose.biomechanics.yml --profile tools up -d
```

### 3. Migrar Banco de Dados

```bash
docker-compose -f docker-compose.biomechanics.yml exec app npx prisma migrate deploy
```

### 4. Verificar Status

```bash
# Logs
docker-compose -f docker-compose.biomechanics.yml logs -f app

# Status dos containers
docker-compose -f docker-compose.biomechanics.yml ps

# Health check
curl http://localhost:3000/health
```

---

## 📊 Monitoramento

### Acessar Dashboards

- **App**: http://localhost:3000
- **BullMQ Board**: http://localhost:8082 (fila de jobs)
- **Redis Commander**: http://localhost:8081 (dados Redis)

### Métricas Importantes

```bash
# Stats do sistema
curl http://localhost:3000/api/v1/biomechanical/stats

# Status da fila
docker-compose -f docker-compose.biomechanics.yml exec redis redis-cli INFO
```

---

## 🔧 Configuração Avançada

### Habilitar GPU (NVIDIA)

1. **Instalar NVIDIA Container Toolkit:**

```bash
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/libnvidia-container/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/libnvidia-container/$distribution/libnvidia-container.list | sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit
sudo systemctl restart docker
```

2. **Atualizar `.env.biomechanics`:**

```env
TF_BACKEND=gpu
```

3. **Restart:**

```bash
docker-compose -f docker-compose.biomechanics.yml restart worker
```

### Escalar Workers

```bash
# Escalar para 4 workers
docker-compose -f docker-compose.biomechanics.yml up -d --scale worker=4
```

### Otimizar para Alta Carga

Editar `.env.biomechanics`:

```env
MAX_CONCURRENT_VIDEOS=4
BATCH_SIZE=20
WORKER_CONCURRENCY=4
TF_THREADS=8
```

---

## 🚀 Deploy em Produção

### Opção 1: VPS Manual (Ubuntu 22.04)

```bash
# 1. Conectar via SSH
ssh user@your-server.com

# 2. Instalar dependências
sudo apt update
sudo apt install -y docker.io docker-compose git

# 3. Clone projeto
git clone https://github.com/seu-repo/nfc-comunidades.git
cd nfc-comunidades

# 4. Configurar ambiente
cp .env.biomechanics.example .env.biomechanics
nano .env.biomechanics

# 5. Deploy
docker-compose -f docker-compose.biomechanics.yml up -d

# 6. Setup Nginx (reverse proxy)
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/biomechanics
```

**Nginx config:**

```nginx
server {
    listen 80;
    server_name biomechanics.nutrifitcoach.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/biomechanics /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Setup SSL com Certbot
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d biomechanics.nutrifitcoach.com.br
```

### Opção 2: CI/CD com GitHub Actions

Já configurado em `.github/workflows/biomechanics-deploy.yml`.

**Secrets necessários no GitHub:**

- `PROD_HOST`: IP do servidor
- `PROD_USER`: Usuário SSH
- `PROD_SSH_KEY`: Chave SSH privada
- `SLACK_WEBHOOK`: Webhook do Slack (opcional)

**Trigger deploy:**

```bash
git push origin main  # Deploy automático para produção
```

---

## 🔒 Segurança

### 1. Configurar Firewall

```bash
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### 2. Secrets e Senhas

- ❌ **NUNCA** commitar `.env.biomechanics` no Git
- ✅ Usar senhas fortes (16+ caracteres)
- ✅ Rotacionar secrets regularmente
- ✅ Usar GitHub Secrets para CI/CD

### 3. Limitar Rate (Nginx)

```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

location /api/v1/biomechanical/analyze {
    limit_req zone=api burst=20;
    proxy_pass http://localhost:3000;
}
```

---

## 📈 Performance Tuning

### Benchmarks Esperados

| Configuração | FPS | Tempo/Vídeo (30s) | Vídeos/Hora |
|--------------|-----|-------------------|-------------|
| CPU (4 cores) | 12 | ~2.5 minutos | ~24 |
| CPU (16 cores) | 30 | ~1 minuto | ~60 |
| GPU (NVIDIA 3090) | 120 | ~15 segundos | ~240 |

### Otimizações

**1. Cache Redis:**
- Habilitar `enableFrameCache`
- Ajustar `maxCacheSize` baseado em RAM

**2. Batch Size:**
- CPU: `BATCH_SIZE=10-20`
- GPU: `BATCH_SIZE=50-100`

**3. Concorrência:**
- Calcular: `WORKER_CONCURRENCY = (cores * 0.75)`

**4. Garbage Collection:**
- Ajustar `gcInterval` se houver memory leaks

---

## 🐛 Troubleshooting

### Problema: Worker trava/timeout

```bash
# Verificar logs
docker-compose -f docker-compose.biomechanics.yml logs worker

# Reiniciar worker
docker-compose -f docker-compose.biomechanics.yml restart worker

# Verificar memória
docker stats nfc-worker
```

**Solução:** Reduzir `BATCH_SIZE` ou `MAX_CONCURRENT_VIDEOS`.

### Problema: Fila Redis crescendo infinitamente

```bash
# Verificar fila
docker-compose -f docker-compose.biomechanics.yml exec redis redis-cli LLEN bull:video-processing:wait

# Pausar fila
curl -X POST http://localhost:3000/api/v1/biomechanical/queue/pause

# Limpar jobs falhos
curl -X POST http://localhost:3000/api/v1/biomechanical/queue/clean
```

### Problema: TensorFlow lento

1. Verificar backend:
```bash
docker-compose -f docker-compose.biomechanics.yml exec worker node -e "console.log(require('@tensorflow/tfjs').getBackend())"
```

2. Habilitar GPU (se disponível)
3. Reduzir `MAX_FPS` para 15

---

## 📞 Suporte

- **Documentação**: `./VIDEO_PIPELINE_README.md`
- **Issues**: https://github.com/seu-repo/issues
- **Logs**: `docker-compose logs -f`

---

## 📝 Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados migrado (`prisma migrate deploy`)
- [ ] SSL/HTTPS configurado
- [ ] Firewall configurado
- [ ] Backups automáticos habilitados
- [ ] Monitoramento ativo (logs, métricas)
- [ ] Health checks passando
- [ ] Teste de upload de vídeo funcionando
- [ ] Webhooks testados (se aplicável)
- [ ] CI/CD validado

---

**✅ Sistema pronto para produção!**

Para escalar ainda mais, considere:
- Load balancer (HAProxy/Nginx)
- Cluster Kubernetes
- CDN para resultados (CloudFlare)
- Object storage (S3) para vídeos
