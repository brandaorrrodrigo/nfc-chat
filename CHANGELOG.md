# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [1.0.0] - 2026-02-15

### 🎉 Release Inicial

Primeira versão de produção do **NutriFitCoach Biomechanical Analysis Platform**.

### ✨ Adicionado

#### Core Features
- **Análise Biomecânica V2** com MediaPipe Tasks API
  - Pipeline v4-mediapipe com detecção de 33 landmarks corporais
  - Classificação Motor/Stabilizer com multiplicadores contextuais
  - Suporte para 8 exercícios (back_squat, deadlift, chest_supported_row, lateral_raise, bench_press, hip_thrust, barbell_row, cable_row)
  - ROM calculado como diferença |start - peak| para todos exercícios
  - Análise em 3 pontos: startAngle/peakAngle/ROM
  - Modos de estabilidade: rigid, controlled, functional
  - Mensagens contextuais baseadas em stabilityMode

#### Upload System
- **Storage Abstraction** com suporte Local e S3/MinIO
- **Thumbnail Generation** com FFmpeg e Sharp
- **Video Metadata Extraction** (resolução, duração, codec, bitrate, FPS)
- **Quota Management** baseado em subscription
  - Free: 3 análises/mês, 500MB storage
  - Premium: 10 análises/mês, 5GB storage
  - Premium Plus: Ilimitado, 100GB storage
- **File Validation** com magic bytes verification
- Suporte para formatos: MP4, WebM, MOV, AVI (max 500MB)

#### Infrastructure
- **Docker Compose** completo com 8 serviços
  - PostgreSQL 16 Alpine com health checks e volumes
  - Redis 7 Alpine com AOF persistence
  - MinIO para object storage
  - API com replicas=2 em produção
  - Worker com replicas=3, BullMQ para filas
  - Nginx como reverse proxy com rate limiting
- **Multi-stage Dockerfiles** (70% menores que single-stage)
- **Health Checks** em todos os serviços
- **Backup/Restore Scripts** com rotação dual (daily + weekly)
- **Automation via Makefile** com 30+ comandos

#### Database
- **Prisma ORM** com PostgreSQL
- Schema completo:
  - User (id, email, name, subscription, quotas)
  - VideoAnalysis (id, userId, videoId, status, results)
  - VideoUpload (id, userId, key, size, metadata)
  - Subscription (id, userId, tier, limits)
- Migrations e seeding

#### API
- **REST Endpoints**:
  - `POST /api/biomechanics/analyze` - Análise biomecânica
  - `GET /api/biomechanics/analyze` - Info do endpoint
  - `POST /api/upload/video` - Upload de vídeo
  - `GET /api/upload/url/:key` - URL presigned para download
  - `DELETE /api/upload/:key` - Deletar vídeo
  - `GET /api/health` - Health check
  - `GET /api/metrics` - Prometheus metrics
- Rate limiting: 10 req/s (API), 2 req/s (upload)
- CORS configurável via ambiente

#### Frontend
- **Dashboard Biomecânico** em `/biomechanics/dashboard`
  - Display de scores Motor/Stabilizer/Overall
  - ROM detalhado com 3 pontos (start→peak)
  - Mensagens contextuais por stabilityMode
  - Badges de classificação (excellent, good, acceptable, warning, danger)
- **Video Page** com análise detalhada
- Responsive design com Tailwind CSS

#### Security
- **JWT Authentication** com 15min expiration
- **Refresh Tokens** com 7 dias expiration
- **Input Validation** com class-validator
- **SQL Injection Protection** via Prisma ORM
- **XSS Protection** com DOMPurify
- **Rate Limiting** em Nginx e application level
- **Non-root Containers** para segurança
- **Secrets Management** via Docker secrets e .env
- **LGPD Compliance** com direitos do usuário implementados

#### Performance
- **Redis Caching** (10x mais rápido em cache hits)
- **Connection Pooling** (Prisma: pool_size=10)
- **Lazy Loading** de dados pesados
- **Gzip Compression** (70% menor payload)
- **Parallel Processing** de frames (3x mais rápido)
- Benchmarks:
  - Upload 100MB: 28s avg, 42s p99
  - Análise: 42s avg, 68s p99
  - API cache hit: 48ms avg, 95ms p99

#### Monitoring
- **Structured Logging** com Winston (JSON format)
- **Prometheus Metrics** com exporters (node, postgres, redis)
- **Health Checks** com status detalhado de serviços
- **Grafana Dashboards** (system, app, database, queue, business)
- **AlertManager** com regras (HighErrorRate, SlowAPI, HighMemory, etc)

#### Documentation
- **README.md** completo com quick start e troubleshooting
- **CONTRIBUTING.md** com workflow e style guide
- **SECURITY.md** com política de segurança e vulnerability reporting
- **PERFORMANCE.md** com benchmarks e otimizações
- **MONITORING.md** com setup de observabilidade
- **CHANGELOG.md** (este arquivo)
- **UPGRADE.md** com guia de upgrade

#### Scripts
- `scripts/start.sh` - Inicia todos os serviços com validação
- `scripts/stop.sh` - Para todos os serviços com graceful shutdown
- `scripts/backup.sh` - Backup PostgreSQL + uploads com rotação
- `scripts/restore.sh` - Restore de backups com validação
- `scripts/migrate.sh` - Executa migrations Prisma
- `scripts/health.sh` - Verifica saúde de todos os serviços
- `scripts/logs.sh` - Visualiza logs agregados com filtros
- `scripts/validate.sh` - Valida configuração antes de deployment
- `scripts/fix-eperm.js` - Fix EPERM no Windows

### 🔧 Mudanças

#### Breaking Changes
- ROM agora é calculado como |start - peak| para TODOS exercícios (não mais ângulo absoluto)
- Thresholds de templates recalibrados:
  - back_squat knee: excellent ≥100° (antes: ≤70°)
  - back_squat hip: excellent ≥100° (antes: ≤70°)
  - chest_supported_row elbow: excellent ≥95° (antes: ≤75°)
  - bench_press elbow: excellent ≥90° (antes: ≥170°)
  - hip_thrust hip: excellent ≥80° (antes: ≥170°)

### 🐛 Corrigido

- Re-análise na Vercel agora mostra mensagem amigável quando recebe 500
- `formatValue()` com NaN guard para evitar crashes
- `safeRender()` wrapper para componentes React
- Fix EPERM no Windows durante build (via fix-eperm.js preload)
- Elbow direction agora determinada por `category` (press vs pull), não metric name
- Hip agora retorna `peakContractionValue` para deadlift/hip_thrust

### 📊 Resultados de Teste

Vídeos de teste com pipeline v4-mediapipe:

| Exercício | Score | Motor | Stabilizer | Detalhes |
|-----------|-------|-------|------------|----------|
| Agachamento | 7.8 | 9.3 | 5.5 | Joelho 139° (174→35) excellent, Quadril 95° (168→74) good |
| Terra | 7.5 | 6.7 | 8.8 | Quadril 127° (158→32) excellent, Joelho 132° (172→40) acceptable |
| Puxadas | 6.1 | 4.7 | 8.3 | Ombro 27° (64→38) warning, Cotovelo 25° (176→135) danger |

### 📦 Dependências

#### Backend
- Next.js 15.5.12
- React 19
- Prisma 6.2.1
- MediaPipe 0.10.31 (Python)
- OpenCV 4.13.0 (Python)
- Python 3.11.9
- BullMQ (Redis queues)
- FFmpeg (video processing)
- Sharp (image optimization)

#### Frontend
- Tailwind CSS
- Radix UI
- Lucide Icons

#### Infrastructure
- PostgreSQL 16 Alpine
- Redis 7 Alpine
- MinIO RELEASE.2024-02-17
- Nginx 1.25 Alpine
- Docker 24+
- Docker Compose 2+

### 🚀 Deployment

Deploy em produção:
```bash
make deploy-prod
# OU
vercel --prod
```

URL de produção: https://chat.nutrifitcoach.com.br

### 👥 Contribuidores

- NutriFitCoach Team
- Claude Sonnet 4.5 (AI Assistant)

---

## [Unreleased]

### 🔮 Planejado para v1.1.0

- [ ] Suporte para mais 15 exercícios (total 23)
- [ ] Análise de movimento 3D com múltiplas câmeras
- [ ] Comparação lado-a-lado de vídeos
- [ ] Exportação de relatórios em PDF
- [ ] Dashboard de progresso do usuário
- [ ] Integração com wearables (Apple Watch, Garmin)
- [ ] Tracing distribuído com Jaeger
- [ ] Machine Learning para detecção automática de exercício
- [ ] Suporte a live streaming para análise em tempo real

---

## Tipos de Mudanças

- **Adicionado** - Para novas funcionalidades
- **Mudado** - Para mudanças em funcionalidades existentes
- **Descontinuado** - Para funcionalidades que serão removidas
- **Removido** - Para funcionalidades removidas
- **Corrigido** - Para correções de bugs
- **Segurança** - Para correções de vulnerabilidades

---

**Links:**
- [Unreleased]: https://github.com/nutrifitcoach/nfc-comunidades/compare/v1.0.0...HEAD
- [1.0.0]: https://github.com/nutrifitcoach/nfc-comunidades/releases/tag/v1.0.0
