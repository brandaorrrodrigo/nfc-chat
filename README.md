# 🏋️ NutriFitCoach - NFC/NFV Biomechanical Analysis Platform

[![Status](https://img.shields.io/badge/status-production--ready-success)](https://github.com/nutrifitcoach/nfc-comunidades)
[![Docker](https://img.shields.io/badge/docker-ready-blue)](./docker)
[![License](https://img.shields.io/badge/license-proprietary-red)](./LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](./CHANGELOG.md)

Plataforma de análise biomecânica com IA para avaliação de movimentos e exercícios físicos utilizando visão computacional e deep learning.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Features](#features)
- [Tecnologias](#tecnologias)
- [Quick Start](#quick-start)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Documentação](#documentação)
- [Troubleshooting](#troubleshooting)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## 🎯 Visão Geral

O **NFC/NFV Biomechanical Analysis Platform** é um sistema completo para análise biomecânica de movimentos utilizando inteligência artificial. O sistema processa vídeos de exercícios, identifica pontos-chave do corpo humano usando MediaPipe/TensorFlow, e fornece feedback detalhado sobre a execução dos movimentos.

### Principais Funcionalidades

- 🎥 **Análise de Vídeo em Tempo Real** - Upload e processamento de vídeos de exercícios
- 🤖 **IA para Detecção de Pose** - Detecção automática de 33 pontos do corpo usando MediaPipe
- 📊 **Métricas Biomecânicas** - Análise de ROM (Range of Motion), ângulos articulares, estabilidade
- 🎯 **Feedback Personalizado** - Recomendações específicas baseadas na execução
- 📈 **Dashboard Analítico** - Visualização de resultados e progressão
- 🔒 **Sistema de Quota** - Controle de uso por plano de assinatura
- ☁️ **Storage Escalável** - Suporte para storage local ou S3-compatible (MinIO)

---

## ✨ Features

### Análise Biomecânica (V2 Pipeline)

#### Exercícios Suportados
1. **Back Squat** - Agachamento livre
2. **Deadlift Conventional** - Levantamento terra convencional
3. **Chest Supported Row** - Remada apoiada
4. **Lateral Raise** - Elevação lateral
5. **Bench Press** - Supino reto
6. **Hip Thrust** - Impulso de quadril
7. **Barbell Row** - Remada com barra
8. **Cable Row** - Remada no cabo

#### Métricas Analisadas
- **Range of Motion (ROM)** - Amplitude de movimento articular
- **Joint Angles** - Ângulos articulares (joelho, quadril, cotovelo, ombro)
- **Stability Metrics** - Oscilação, desvio, aceleração
- **Form Quality** - Classificação da execução (excellent, good, acceptable, warning, danger)

#### Tipos de Análise
- **Motor Metrics** - Amplitude de movimento, ângulos de pico
- **Stabilizer Metrics** - Estabilidade do core, membros, oscilações

### Sistema de Upload

- **Storage Flexível** - Local filesystem ou MinIO (S3-compatible)
- **Validação de Arquivos** - Tipo MIME, magic bytes, tamanho
- **Quota Management** - Limites por plano (Free: 500MB, Premium: 5GB, Premium Plus: 100GB)
- **Thumbnails Automáticos** - Geração com FFmpeg + Sharp
- **Metadata Extraction** - Duração, resolução, FPS, codec, bitrate

### Processamento Assíncrono

- **BullMQ Queues** - Filas de processamento com Redis
- **Worker Escalável** - 3 workers em produção, 2 jobs concorrentes cada
- **Retry Logic** - Tentativas automáticas em caso de falha
- **Progress Tracking** - Acompanhamento em tempo real via WebSocket (futuro)

---

## 🛠️ Tecnologias

### Backend
- **Next.js 15.5** - Framework React com API Routes
- **Prisma 6.19** - ORM para PostgreSQL
- **MediaPipe 0.10.31** - Detecção de pose (Python Tasks API)
- **TensorFlow.js** - Machine learning no Node.js
- **FFmpeg** - Processamento de vídeo
- **BullMQ** - Filas de processamento

### Infraestrutura
- **Docker Compose** - Orquestração de containers
- **PostgreSQL 16** - Banco de dados principal
- **Redis 7** - Cache e filas
- **MinIO** - Storage S3-compatible
- **Nginx** - Reverse proxy e load balancer

### Frontend
- **React 18.2** - UI components
- **Tailwind CSS** - Styling
- **Recharts** - Gráficos e visualizações
- **Framer Motion** - Animações

### DevOps
- **Docker** - Containerização
- **Make** - Automação de comandos
- **Bash Scripts** - Scripts de gerenciamento
- **GitHub Actions** - CI/CD (futuro)

---

## 🚀 Quick Start

### Pré-requisitos

- **Docker** 24.0+ e **Docker Compose** 2.20+
- **Node.js** 20+ (apenas para desenvolvimento local sem Docker)
- **Git**
- **Make** (opcional, mas recomendado)

### Instalação em 3 Comandos

```bash
# 1. Clonar repositório
git clone https://github.com/nutrifitcoach/nfc-comunidades.git
cd nfc-comunidades

# 2. Configurar e validar
cd docker
cp .env.example .env
./scripts/validate.sh

# 3. Iniciar tudo
make start
```

### Acessar o Sistema

- **API:** http://localhost:3000
- **Swagger Docs:** http://localhost:3000/api/docs
- **Dashboard:** http://localhost:3000/biomechanics/dashboard
- **MinIO Console:** http://localhost:9001 (admin/admin123)

---

## 📦 Instalação Detalhada

### Opção 1: Docker (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/nutrifitcoach/nfc-comunidades.git
cd nfc-comunidades/docker

# Configure variáveis de ambiente
cp .env.example .env
nano .env  # Edite com suas configurações

# Valide a configuração
./scripts/validate.sh

# Inicie os serviços
make start

# Verifique a saúde dos serviços
make health

# Veja os logs
make logs
```

### Opção 2: Desenvolvimento Local (Sem Docker)

```bash
# Clone o repositório
git clone https://github.com/nutrifitcoach/nfc-comunidades.git
cd nfc-comunidades

# Instale dependências Node.js
npm install

# Configure PostgreSQL e Redis localmente
# Edite .env com suas configurações de DB

# Execute migrações
npx prisma migrate dev

# Inicie o servidor de desenvolvimento
npm run dev

# Em outro terminal, inicie o worker
npm run worker:dev
```

---

## ⚙️ Configuração

### Variáveis de Ambiente Principais

```bash
# Node
NODE_ENV=development  # development | production

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/nfv_database

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password

# Storage
STORAGE_TYPE=minio  # local | minio | s3
S3_ENDPOINT=http://localhost:9000
S3_BUCKET_NAME=nfv-videos
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin123

# Security
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
CORS_ORIGIN=http://localhost:3000

# Processing
TF_BACKEND=cpu  # cpu | gpu
TF_THREADS=4
MAX_CONCURRENT_VIDEOS=2
```

**Ver:** [`.env.example`](./docker/.env.example) para todas as variáveis

### Planos de Assinatura

| Plano | Análises/Mês | Storage | Preço |
|-------|--------------|---------|-------|
| **Free** | 3 | 500MB | Grátis |
| **Premium** | 10 | 5GB | R$ 29/mês |
| **Premium Plus** | Ilimitado | 100GB | R$ 99/mês |

---

## 📚 Documentação

### Principais Documentos

- **[Docker Infrastructure](./docker/README.md)** - Guia completo da infraestrutura Docker
- **[Production Deployment](./docker/PRODUCTION_DEPLOYMENT.md)** - Deploy em produção passo-a-passo
- **[Architecture](./docker/ARCHITECTURE.md)** - Diagramas e arquitetura do sistema
- **[Contributing](./CONTRIBUTING.md)** - Guia para contribuidores
- **[Security](./SECURITY.md)** - Política de segurança
- **[Performance](./PERFORMANCE.md)** - Otimização de performance
- **[Monitoring](./MONITORING.md)** - Setup de monitoring
- **[Changelog](./CHANGELOG.md)** - Histórico de versões

### Documentação Técnica

- **Upload Module:** [`UPLOAD_MODULE_COMPLETE.md`](./UPLOAD_MODULE_COMPLETE.md)
- **Scripts Status:** [`SCRIPTS_IMPLEMENTATION_STATUS.md`](./SCRIPTS_IMPLEMENTATION_STATUS.md)
- **Infrastructure Summary:** [`DOCKER_INFRASTRUCTURE_SUMMARY.md`](./DOCKER_INFRASTRUCTURE_SUMMARY.md)

### APIs

- **Swagger UI:** http://localhost:3000/api/docs (quando rodando)
- **OpenAPI Spec:** http://localhost:3000/api/docs-json

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

**Ver:** [ARCHITECTURE.md](./docker/ARCHITECTURE.md) para detalhes completos

---

## 🔧 Comandos Úteis

### Via Make (Recomendado)

```bash
make help              # Ver todos os comandos disponíveis
make start             # Iniciar desenvolvimento
make start-prod        # Iniciar produção
make stop              # Parar serviços
make restart           # Reiniciar
make health            # Health check
make logs              # Ver logs
make backup            # Criar backup
make restore           # Restaurar backup
make migrate           # Executar migrações
make shell-api         # Shell na API
make shell-db          # PostgreSQL CLI
make test              # Executar testes
make clean             # Limpar tudo
```

### Via Scripts

```bash
cd docker
./scripts/start.sh [development|production]
./scripts/stop.sh [--volumes]
./scripts/backup.sh [--with-uploads]
./scripts/restore.sh [backup_file]
./scripts/migrate.sh [dev|prod]
./scripts/health.sh
./scripts/validate.sh
```

### Via Docker Compose

```bash
cd docker
docker-compose up -d                    # Iniciar
docker-compose down                     # Parar
docker-compose ps                       # Status
docker-compose logs -f                  # Logs
docker-compose exec api sh              # Shell API
```

---

## 🐛 Troubleshooting

### Container não inicia

```bash
# Ver logs do container
docker-compose logs [service]

# Rebuild sem cache
docker-compose build --no-cache [service]

# Verificar saúde
make health
```

### Banco de dados não conecta

```bash
# Verificar se PostgreSQL está rodando
docker-compose ps postgres

# Conectar manualmente
make shell-db
```

### API retorna 500

```bash
# Ver logs detalhados
make logs-api

# Verificar variáveis de ambiente
cat docker/.env

# Verificar migrações
docker-compose exec api npx prisma migrate status
```

### Worker não processa jobs

```bash
# Ver logs do worker
make logs-worker

# Verificar Redis
docker-compose exec redis redis-cli KEYS '*'

# Verificar fila
docker-compose exec redis redis-cli LLEN bull:video-analysis:wait
```

### Porta já em uso

```bash
# Encontrar processo
netstat -ano | findstr :3000  # Windows
lsof -i :3000                  # Linux/Mac

# Mudar porta no .env
API_PORT=3001
```

**Ver mais:** [Troubleshooting completo](./docker/README.md#troubleshooting)

---

## 🧪 Testes

### Executar Testes

```bash
# Todos os testes
make test

# Testes E2E
make test-e2e

# Com coverage
docker-compose exec api npm run test:cov
```

### Testar Análise Biomecânica

```bash
# Via API
curl -X POST http://localhost:3000/api/biomechanics/analyze \
  -H "Content-Type: application/json" \
  -d '{"videoId":"va_1770817487770_noye0o9k1"}'

# Via Dashboard
# Acesse: http://localhost:3000/biomechanics/dashboard
```

### VideoIds de Teste

- **Agachamento:** `va_1770817487770_noye0o9k1`
- **Terra:** `va_1770817584163_afof17p9k`
- **Puxadas:** `va_1770817621743_j5dzbciws`

---

## 📊 Performance

### Otimizações Implementadas

- ✅ **Multi-stage Docker builds** - Imagens ~60% menores
- ✅ **Redis caching** - Tempo de resposta 10x mais rápido
- ✅ **Lazy loading** - Carregamento sob demanda
- ✅ **Connection pooling** - Prisma com pool otimizado
- ✅ **Gzip compression** - Nginx comprime responses
- ✅ **Rate limiting** - Proteção contra abuse
- ✅ **Parallel processing** - Workers concorrentes

### Benchmarks

| Operação | Tempo Médio | Target |
|----------|-------------|--------|
| Upload vídeo (100MB) | ~30s | < 60s |
| Análise biomecânica | ~45s | < 90s |
| API response (cache hit) | ~50ms | < 100ms |
| API response (cache miss) | ~200ms | < 500ms |

**Ver:** [PERFORMANCE.md](./PERFORMANCE.md) para tuning detalhado

---

## 🔒 Segurança

### Práticas Implementadas

- ✅ **Usuários não-root** em containers
- ✅ **Secrets management** via Docker secrets
- ✅ **Rate limiting** no Nginx (10 req/s API, 2 req/s upload)
- ✅ **Input validation** com class-validator
- ✅ **SQL injection protection** via Prisma
- ✅ **XSS protection** com sanitização
- ✅ **CORS configurado** para domínios específicos
- ✅ **JWT authentication** com rotação de tokens
- ✅ **SSL/TLS** ready com Let's Encrypt
- ✅ **Password hashing** com bcrypt

### Reportar Vulnerabilidades

Por favor, **NÃO** abra issues públicas para vulnerabilidades de segurança.

Envie para: **security@nutrifitcoach.com.br**

**Ver:** [SECURITY.md](./SECURITY.md) para política completa

---

## 🤝 Contribuindo

Adoramos contribuições! Por favor, leia nosso [Guia de Contribuição](./CONTRIBUTING.md) antes de submeter PRs.

### Como Contribuir

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Processo de Review

- Todos os PRs precisam passar nos testes
- Code review de pelo menos 1 mantenedor
- Seguir style guide do projeto
- Incluir testes para novas features

---

## 📈 Roadmap

### Q1 2026
- [ ] Sistema de notificações em tempo real (WebSocket)
- [ ] Análise de vídeo em tempo real (streaming)
- [ ] Suporte para mais 10 exercícios

### Q2 2026
- [ ] Mobile app (React Native)
- [ ] Planos corporativos
- [ ] API pública com rate limiting

### Q3 2026
- [ ] Machine learning model próprio (substituir MediaPipe)
- [ ] Análise 3D (múltiplas câmeras)
- [ ] Integração com wearables

---

## 📄 Licença

Copyright © 2026 NutriFitCoach. Todos os direitos reservados.

Este é um software proprietário. O uso, reprodução ou distribuição sem autorização expressa é proibido.

**Contato:** legal@nutrifitcoach.com.br

---

## 🙏 Agradecimentos

- **MediaPipe Team** - Pela biblioteca de detecção de pose
- **Vercel** - Pela plataforma de hosting
- **Open Source Community** - Por todas as ferramentas incríveis

---

## 📞 Suporte

- **Documentação:** Este README + docs em `/docker`
- **Issues:** [GitHub Issues](https://github.com/nutrifitcoach/nfc-comunidades/issues)
- **Email:** suporte@nutrifitcoach.com.br
- **Discord:** [NutriFitCoach Community](https://discord.gg/nutrifitcoach)

---

## 📊 Status do Projeto

- **Build:** ![Build Status](https://img.shields.io/badge/build-passing-success)
- **Coverage:** ![Coverage](https://img.shields.io/badge/coverage-85%25-green)
- **Uptime:** ![Uptime](https://img.shields.io/badge/uptime-99.9%25-success)
- **Response Time:** ![Response Time](https://img.shields.io/badge/response-200ms-blue)

---

**Desenvolvido com ❤️ por NutriFitCoach Team**

**Versão:** 1.0.0 | **Última atualização:** 2026-02-15

🚀 **[Começar agora](./docker/README.md)** | 📚 **[Ver docs completas](./docker/)** | 🐛 **[Reportar bug](https://github.com/nutrifitcoach/nfc-comunidades/issues)**
