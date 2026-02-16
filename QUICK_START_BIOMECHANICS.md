# 🚀 Quick Start - Sistema de Análise Biomecânica

Guia rápido para colocar o sistema em funcionamento em 5 minutos.

---

## ⚡ Setup Rápido (Desenvolvimento)

### 1. Pré-requisitos

Certifique-se de ter instalado:
- [x] Node.js 20+
- [x] PostgreSQL 16+
- [x] Redis 7+
- [x] FFmpeg 6+

```bash
# Verificar versões
node --version   # v20.x.x
npm --version    # 10.x.x
psql --version   # 16.x
redis-cli --version # 7.x
ffmpeg -version  # 6.x
```

---

### 2. Clonar e Instalar Dependências

```bash
cd D:\NUTRIFITCOACH_MASTER\nfc-comunidades
npm install
```

---

### 3. Configurar Variáveis de Ambiente

```bash
# Copiar template
cp .env.biomechanics.example .env.biomechanics

# Editar (ajustar senhas e URLs)
nano .env.biomechanics
```

**Configurações essenciais:**
```env
# Database
DATABASE_URL="postgresql://nfc:sua_senha@localhost:5432/nfc_biomechanics"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# App
NODE_ENV=development
PORT=3000
```

---

### 4. Setup do Banco de Dados

```bash
# Gerar Prisma Client
npx prisma generate

# Criar banco de dados (se não existir)
createdb nfc_biomechanics

# Executar migrations
npx prisma migrate dev --name initial-biomechanics

# Popular com dados iniciais
npx prisma db seed
```

**Resultado esperado:**
```
✅ Admin criado: admin@nutrifitcoach.com
✅ Arena criada: Receitas Saudáveis (5 tags)
...
✅ Exercício criado: Agachamento Livre (Back Squat)
...
🎉 Seed completed!
```

---

### 5. Iniciar Serviços

**Opção A: Com Docker (Recomendado)**
```bash
docker-compose -f docker-compose.biomechanics.yml up -d

# Verificar status
docker-compose -f docker-compose.biomechanics.yml ps

# Ver logs
docker-compose -f docker-compose.biomechanics.yml logs -f app
```

**Opção B: Sem Docker (Manual)**

Terminal 1 - App:
```bash
npm run dev
```

Terminal 2 - Worker:
```bash
npm run worker
```

Terminal 3 - Redis (se não estiver rodando):
```bash
redis-server
```

---

### 6. Testar API

```bash
# Health check
curl http://localhost:3000/health

# System stats
curl http://localhost:3000/api/v1/biomechanical/stats

# Listar análises do usuário teste
curl "http://localhost:3000/api/v1/biomechanical/analyses?userId=<USER_ID>&limit=10"
```

---

## 📹 Testar Upload de Vídeo

### Via cURL

```bash
# Preparar vídeo de teste (30s máximo)
# Coloque em: ./data/test-video.mp4

curl -X POST http://localhost:3000/api/v1/biomechanical/analyze \
  -F "video=@./data/test-video.mp4" \
  -F "exerciseName=Agachamento Livre" \
  -F "captureMode=ESSENTIAL" \
  -F "userId=<USER_ID>" \
  -F "webhookUrl=https://webhook.site/your-unique-id"

# Resposta esperada:
{
  "jobId": "bull:video-processing:123",
  "analysisId": "clxxxxx",
  "status": "queued"
}
```

### Via Postman

1. **Criar request POST:**
   - URL: `http://localhost:3000/api/v1/biomechanical/analyze`
   - Method: `POST`
   - Body: `form-data`

2. **Adicionar campos:**
   - `video`: (file) selecionar vídeo MP4
   - `exerciseName`: (text) `Agachamento Livre`
   - `captureMode`: (text) `ESSENTIAL`
   - `userId`: (text) ID do usuário
   - `webhookUrl`: (text) URL do webhook (opcional)

3. **Enviar e capturar `analysisId`**

---

## 🔍 Verificar Status da Análise

```bash
# Substituir <ANALYSIS_ID> pelo ID retornado
curl http://localhost:3000/api/v1/biomechanical/analysis/<ANALYSIS_ID>

# Resposta enquanto processa:
{
  "id": "clxxxxx",
  "status": "processing",
  "progress": {
    "stage": "detection",
    "progress": 45
  }
}

# Resposta quando completo:
{
  "id": "clxxxxx",
  "status": "completed",
  "result": {
    "analysis": {
      "motorScore": 8.5,
      "stabilizerScore": 7.2,
      // ...
    },
    "metadata": {
      "totalFrames": 45,
      "processingTimeMs": 12500
    }
  }
}
```

---

## 🎛️ Dashboards de Monitoramento

### BullMQ Board (Fila de Jobs)
```
http://localhost:8082
```
- Visualizar jobs (waiting, active, completed, failed)
- Retry jobs manualmente
- Ver detalhes de cada job

### Redis Commander (Cache)
```
http://localhost:8081
```
- Visualizar keys de cache
- Verificar TTL
- Ver dados da fila

---

## 📊 Verificar Logs

```bash
# Logs do app
docker-compose -f docker-compose.biomechanics.yml logs -f app

# Logs do worker
docker-compose -f docker-compose.biomechanics.yml logs -f worker

# Logs do Redis
docker-compose -f docker-compose.biomechanics.yml logs -f redis

# Logs do PostgreSQL
docker-compose -f docker-compose.biomechanics.yml logs -f postgres
```

---

## 🔧 Comandos Úteis

### Prisma

```bash
# Gerar client após mudanças no schema
npx prisma generate

# Criar nova migration
npx prisma migrate dev --name your-migration-name

# Aplicar migrations (produção)
npx prisma migrate deploy

# Abrir Prisma Studio (GUI do banco)
npx prisma studio
# Acessar: http://localhost:5555

# Reset banco (CUIDADO: apaga tudo)
npx prisma migrate reset
```

### Docker

```bash
# Iniciar serviços
docker-compose -f docker-compose.biomechanics.yml up -d

# Parar serviços
docker-compose -f docker-compose.biomechanics.yml down

# Parar e remover volumes (CUIDADO: apaga dados)
docker-compose -f docker-compose.biomechanics.yml down -v

# Rebuild após mudanças
docker-compose -f docker-compose.biomechanics.yml up -d --build

# Ver status
docker-compose -f docker-compose.biomechanics.yml ps

# Acessar shell do container
docker-compose -f docker-compose.biomechanics.yml exec app bash
docker-compose -f docker-compose.biomechanics.yml exec worker bash

# Ver uso de recursos
docker stats
```

### BullMQ Queue

```bash
# Pausar fila
curl -X POST http://localhost:3000/api/v1/biomechanical/queue/pause

# Resumir fila
curl -X POST http://localhost:3000/api/v1/biomechanical/queue/resume

# Limpar jobs falhos
curl -X POST http://localhost:3000/api/v1/biomechanical/queue/clean
```

---

## 🧪 Executar Testes

```bash
# Unit tests
npm test

# Specific test file
npm test src/modules/biomechanical/prisma.service.spec.ts

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

---

## 🐛 Troubleshooting

### Erro: Prisma Client não gerado
```bash
npx prisma generate
```

### Erro: Conexão com PostgreSQL
```bash
# Verificar se PostgreSQL está rodando
pg_isready

# Verificar DATABASE_URL no .env.biomechanics
cat .env.biomechanics | grep DATABASE_URL

# Testar conexão manual
psql -h localhost -U nfc -d nfc_biomechanics
```

### Erro: Conexão com Redis
```bash
# Verificar se Redis está rodando
redis-cli ping
# Resposta esperada: PONG

# Verificar portas
netstat -an | grep 6379
```

### Erro: Worker não processa jobs
```bash
# Verificar se worker está rodando
docker-compose -f docker-compose.biomechanics.yml ps worker

# Ver logs do worker
docker-compose -f docker-compose.biomechanics.yml logs -f worker

# Restart worker
docker-compose -f docker-compose.biomechanics.yml restart worker
```

### Erro: TensorFlow lento
```bash
# Verificar backend em uso
node -e "console.log(require('@tensorflow/tfjs').getBackend())"
# Resposta esperada: cpu (ou webgl se disponível)

# Reduzir batch size no .env.biomechanics
BATCH_SIZE=5
MAX_FPS=15
```

### Erro: Timeout no processamento
```bash
# Aumentar timeout no .env.biomechanics
WORKER_TIMEOUT=600000  # 10 minutos

# Restart worker
docker-compose -f docker-compose.biomechanics.yml restart worker
```

---

## 📚 Próximos Passos

Após o setup funcionar:

1. **Ler documentação completa:**
   - `README_BIOMECHANICS_SERVICE.md` - API do service
   - `BIOMECHANICS_DEPLOYMENT.md` - Deploy em produção
   - `PRISMA_SCHEMA_README.md` - Schema do banco

2. **Implementar features adicionais:**
   - DTOs de validação
   - Testes unitários
   - Testes de integração

3. **Deploy em produção:**
   - Configurar CI/CD
   - Setup SSL/HTTPS
   - Configurar monitoramento

---

## ✅ Checklist de Verificação

Antes de considerar o setup completo:

- [ ] Node.js 20+ instalado
- [ ] PostgreSQL 16+ rodando
- [ ] Redis 7+ rodando
- [ ] FFmpeg 6+ instalado
- [ ] `.env.biomechanics` configurado
- [ ] Prisma Client gerado (`npx prisma generate`)
- [ ] Migrations executadas (`npx prisma migrate dev`)
- [ ] Seed executado (`npx prisma db seed`)
- [ ] App rodando (`http://localhost:3000/health` retorna 200)
- [ ] Worker rodando (ver logs)
- [ ] BullMQ Board acessível (`http://localhost:8082`)
- [ ] Redis Commander acessível (`http://localhost:8081`)
- [ ] Upload de vídeo testado
- [ ] Status da análise verificado
- [ ] Resultado da análise recebido

---

## 🆘 Suporte

**Documentação:**
- `README_BIOMECHANICS_SERVICE.md` - Service docs
- `BIOMECHANICS_DEPLOYMENT.md` - Deployment guide
- `PRISMA_SCHEMA_README.md` - Database schema
- `SESSION_SUMMARY_2026-02-15.md` - Implementation summary

**Logs:**
```bash
# Ver todos os logs
docker-compose -f docker-compose.biomechanics.yml logs -f
```

**Debug:**
```bash
# Abrir Prisma Studio para ver dados
npx prisma studio

# Verificar fila no Redis
redis-cli
> SELECT 0
> KEYS bull:video-processing:*
> LLEN bull:video-processing:wait
```

---

**✅ Setup completo! Sistema pronto para análise de vídeos biomecânicos.**

**Primeiro teste:**
1. Upload vídeo via API
2. Verificar status via API
3. Aguardar processamento
4. Receber resultado completo

**Happy coding! 🚀**
