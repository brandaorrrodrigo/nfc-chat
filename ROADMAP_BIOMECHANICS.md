# 🗺️ Roadmap - Sistema de Análise Biomecânica NFC/NFV

Plano de evolução do sistema de análise biomecânica.

---

## ✅ Fase 1: Infraestrutura Base (COMPLETA)

### Performance & Otimização
- [x] Batch processing com p-queue
- [x] Frame caching (Redis)
- [x] Garbage collection automático
- [x] TensorFlow.js otimizado (Web backend)
- [x] Performance: 0.19 FPS → 12 FPS (63x melhora)

### Queue System
- [x] BullMQ queue com Redis
- [x] Worker com concorrência configurável
- [x] Event listeners (active, completed, failed)
- [x] Webhook delivery
- [x] Retry logic
- [x] Job status tracking

### API REST
- [x] NestJS module completo
- [x] BiomechanicalController (4 endpoints)
- [x] DTOs de validação
- [x] Upload de vídeo (Multer)
- [x] Error handling

### Business Logic
- [x] BiomechanicalService (9 métodos públicos)
- [x] Persistência com Prisma
- [x] Cache de resultados (Redis DB 1)
- [x] Cleanup de arquivos
- [x] Performance metrics

### Database
- [x] Schema Prisma completo (35+ models)
- [x] VideoAnalysis consolidado (queue + arena)
- [x] Exercise catalog (8 exercícios)
- [x] CorrectivePlan system
- [x] AnalysisComparison (baseline tracking)
- [x] ApiKey & Webhook models
- [x] PrismaService com helpers
- [x] Seed data

### DevOps
- [x] Docker multi-stage build
- [x] docker-compose (6 services)
- [x] GitHub Actions CI/CD
- [x] Health checks
- [x] Environment config

### Documentação
- [x] Service documentation (README_BIOMECHANICS_SERVICE.md)
- [x] Deployment guide (BIOMECHANICS_DEPLOYMENT.md)
- [x] Schema docs (PRISMA_SCHEMA_README.md)
- [x] Quick start guide (QUICK_START_BIOMECHANICS.md)
- [x] Session summary (SESSION_SUMMARY_2026-02-15.md)
- [x] Roadmap (este arquivo)

---

## 🚧 Fase 2: Integração e Testes (EM PROGRESSO)

### Prioridade Alta 🔴

#### 2.1 Executar Migrations
**Status:** Pendente
**Estimativa:** 30 minutos
**Responsável:** DevOps

**Tarefas:**
- [ ] Executar `npx prisma migrate dev --name initial-biomechanics`
- [ ] Verificar schema no banco
- [ ] Executar `npx prisma db seed`
- [ ] Validar dados criados via Prisma Studio

**Critérios de Aceite:**
- Migration aplicada sem erros
- Todas as tabelas criadas
- Seed data populado corretamente
- Admin user acessível

---

#### 2.2 Integrar PrismaService
**Status:** Pendente
**Estimativa:** 2 horas
**Responsável:** Backend

**Tarefas:**
- [ ] Atualizar BiomechanicalService para usar PrismaService injetado
- [ ] Remover imports standalone do Prisma
- [ ] Atualizar app.module.ts para importar PrismaModule
- [ ] Testar endpoints da API

**Critérios de Aceite:**
- BiomechanicalService usa PrismaService via DI
- Endpoints funcionam corretamente
- Sem imports diretos de @prisma/client

---

#### 2.3 Worker Integration
**Status:** Pendente
**Estimativa:** 3 horas
**Responsável:** Backend

**Tarefas:**
- [ ] Adicionar callbacks no `video-processing.queue.ts`
- [ ] Chamar `BiomechanicalService.updateAnalysisStatus` nos eventos
- [ ] Implementar webhook delivery
- [ ] Testar fluxo completo (upload → processing → completed)

**Arquivo a modificar:**
```typescript
// src/queues/video-processing.queue.ts

private setupEventListeners(): void {
  const service = new BiomechanicalService(prisma);

  this.worker.on('active', async (job) => {
    await service.updateAnalysisStatus(job.data.videoId, 'processing');
  });

  this.worker.on('completed', async (job, result) => {
    await service.updateAnalysisStatus(job.data.videoId, 'completed', {
      result: {
        analysis: result.analysis,
        metadata: result.metadata
      }
    });
  });

  this.worker.on('failed', async (job, error) => {
    await service.updateAnalysisStatus(job.data.videoId, 'failed', {
      error: error.message
    });
  });
}
```

**Critérios de Aceite:**
- Worker atualiza status no banco
- Webhooks são disparados
- Cache é invalidado corretamente

---

### Prioridade Média 🟡

#### 2.4 DTOs Adicionais
**Status:** Pendente
**Estimativa:** 4 horas
**Responsável:** Backend

**DTOs a criar:**
1. **CreateComparisonDto**
   ```typescript
   export class CreateComparisonDto {
     @IsString() userId!: string;
     @IsString() baselineId!: string;
     @IsString() comparisonId!: string;
   }
   ```

2. **CreateCorrectivePlanDto**
   ```typescript
   export class CreateCorrectivePlanDto {
     @IsString() userId!: string;
     @IsString() videoAnalysisId!: string;
     @IsString() title!: string;
     @IsString() description!: string;
     @IsArray() goals!: string[];
     @IsNumber() duration!: number;
     @IsObject() protocol!: any;
   }
   ```

3. **UpdateCorrectiveSessionDto**
   ```typescript
   export class UpdateCorrectiveSessionDto {
     @IsOptional() @IsObject() exercisesCompleted?: any;
     @IsOptional() @IsString() notes?: string;
     @IsOptional() @IsEnum(['easy', 'moderate', 'hard']) userFeedback?: string;
     @IsOptional() @IsNumber() @Min(0) @Max(10) painLevel?: number;
     @IsEnum(SessionStatus) status!: string;
   }
   ```

**Critérios de Aceite:**
- DTOs validam corretamente
- Erros 400 retornam mensagens claras
- Documentação atualizada

---

#### 2.5 Unit Tests
**Status:** Pendente
**Estimativa:** 6 horas
**Responsável:** QA + Backend

**Testes a criar:**

1. **PrismaService Tests**
   - `should connect on module init`
   - `should disconnect on module destroy`
   - `should perform health check`
   - `should cleanup old analyses`
   - `should retry transactions on failure`

2. **BiomechanicalService Tests**
   - `should queue video analysis`
   - `should get analysis status`
   - `should update analysis status`
   - `should list user analyses`
   - `should get system stats`
   - `should cleanup old files`
   - `should retry failed analysis`
   - `should cancel analysis`
   - `should get performance metrics`

3. **BiomechanicalController Tests**
   - `POST /analyze should upload and enqueue`
   - `GET /analysis/:id should return status`
   - `GET /analyses should list with pagination`
   - `GET /stats should return system metrics`

**Coverage esperado:** >80%

**Critérios de Aceite:**
- Todos os testes passam
- Coverage >80%
- Mock de Prisma e Redis

---

#### 2.6 Integration Tests
**Status:** Pendente
**Estimativa:** 8 horas
**Responsável:** QA + Backend

**Cenários a testar:**

1. **Fluxo completo de análise**
   - Upload de vídeo
   - Enfileiramento
   - Processamento
   - Armazenamento de resultado
   - Notificação via webhook

2. **Fluxo de comparação**
   - Criar análise baseline
   - Criar segunda análise
   - Criar comparação
   - Verificar deltas

3. **Fluxo de plano corretivo**
   - Criar plano baseado em análise
   - Criar sessões
   - Atualizar progresso de sessões
   - Marcar plano como completo

4. **Fluxo de webhook**
   - Registrar webhook
   - Disparar evento
   - Verificar delivery
   - Testar retry em falha

**Critérios de Aceite:**
- Testes E2E passam
- Banco de teste isolado
- Cleanup automático após testes

---

### Prioridade Baixa 🟢

#### 2.7 E2E Tests
**Status:** Pendente
**Estimativa:** 4 horas
**Responsável:** QA

**Cenários:**
- Upload completo via Postman
- Polling de status
- Recebimento de resultado
- Comparação de análises

---

## 🎯 Fase 3: Features Avançadas (PLANEJADA)

### 3.1 Análise Comparativa
**Status:** Não iniciado
**Estimativa:** 2 semanas

**Features:**
- Comparar duas análises (baseline vs atual)
- Calcular deltas (motor, stabilizer, IGPB)
- Gerar relatório de evolução
- Visualização de progresso (frontend)

**Endpoints a criar:**
```typescript
POST /api/v1/biomechanical/comparisons
GET  /api/v1/biomechanical/comparisons/:id
GET  /api/v1/biomechanical/comparisons/user/:userId
```

---

### 3.2 Planos Corretivos
**Status:** Não iniciado
**Estimativa:** 3 semanas

**Features:**
- Criar plano baseado em análise
- Sugerir exercícios corretivos
- Acompanhar sessões
- Marcar progresso
- Notificações de sessão

**Endpoints a criar:**
```typescript
POST   /api/v1/biomechanical/corrective-plans
GET    /api/v1/biomechanical/corrective-plans/:id
GET    /api/v1/biomechanical/corrective-plans/user/:userId
PATCH  /api/v1/biomechanical/corrective-plans/:id
DELETE /api/v1/biomechanical/corrective-plans/:id

POST   /api/v1/biomechanical/corrective-sessions
PATCH  /api/v1/biomechanical/corrective-sessions/:id
```

---

### 3.3 Catálogo de Exercícios
**Status:** Não iniciado
**Estimativa:** 1 semana

**Features:**
- CRUD de exercícios
- Busca por categoria
- Filtros (equipment, muscles)
- Templates de análise personalizados

**Endpoints a criar:**
```typescript
GET    /api/v1/biomechanical/exercises
GET    /api/v1/biomechanical/exercises/:id
POST   /api/v1/biomechanical/exercises (admin only)
PATCH  /api/v1/biomechanical/exercises/:id (admin only)
DELETE /api/v1/biomechanical/exercises/:id (admin only)
```

---

### 3.4 Histórico de Usuário
**Status:** Não iniciado
**Estimativa:** 1 semana

**Features:**
- Registrar execuções de exercícios
- Acompanhar evolução de cargas
- Gráficos de progresso
- Export para PDF

**Endpoints a criar:**
```typescript
POST /api/v1/biomechanical/user-exercises
GET  /api/v1/biomechanical/user-exercises/user/:userId
GET  /api/v1/biomechanical/user-exercises/exercise/:exerciseId
```

---

### 3.5 Webhooks Avançados
**Status:** Não iniciado
**Estimativa:** 1 semana

**Features:**
- CRUD de webhooks
- Teste de webhook
- Histórico de deliveries
- Retry manual
- HMAC signature validation

**Endpoints a criar:**
```typescript
POST   /api/v1/biomechanical/webhooks
GET    /api/v1/biomechanical/webhooks/:id
PATCH  /api/v1/biomechanical/webhooks/:id
DELETE /api/v1/biomechanical/webhooks/:id
POST   /api/v1/biomechanical/webhooks/:id/test
GET    /api/v1/biomechanical/webhooks/:id/deliveries
POST   /api/v1/biomechanical/webhook-deliveries/:id/retry
```

---

### 3.6 API Keys
**Status:** Não iniciado
**Estimativa:** 1 semana

**Features:**
- Gerar API keys
- Revogar keys
- Rate limiting por key
- Permissions granulares
- Usage metrics

**Endpoints a criar:**
```typescript
POST   /api/v1/biomechanical/api-keys
GET    /api/v1/biomechanical/api-keys
GET    /api/v1/biomechanical/api-keys/:id
DELETE /api/v1/biomechanical/api-keys/:id
GET    /api/v1/biomechanical/api-keys/:id/usage
```

---

## 🔐 Fase 4: Segurança e Compliance (PLANEJADA)

### 4.1 Autenticação & Autorização
**Estimativa:** 2 semanas

- [ ] JWT authentication
- [ ] Role-based access control (RBAC)
- [ ] API key authentication
- [ ] OAuth2 integration (Google, Facebook)
- [ ] Session management

### 4.2 Rate Limiting
**Estimativa:** 1 semana

- [ ] Global rate limiting
- [ ] Per-user rate limiting
- [ ] Per-API-key rate limiting
- [ ] Abuse detection

### 4.3 Data Privacy (LGPD/GDPR)
**Estimativa:** 2 semanas

- [ ] Data encryption at rest
- [ ] Data encryption in transit
- [ ] Right to be forgotten (delete user data)
- [ ] Data export (JSON)
- [ ] Audit logs de acesso

### 4.4 Security Audit
**Estimativa:** 1 semana

- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF tokens
- [ ] Helmet headers
- [ ] CORS configuration
- [ ] Input sanitization
- [ ] Dependency audit (npm audit)

---

## 📊 Fase 5: Monitoramento e Observabilidade (PLANEJADA)

### 5.1 Metrics (Prometheus)
**Estimativa:** 1 semana

- [ ] Custom metrics (análises/hora, FPS médio)
- [ ] HTTP metrics (request count, latency)
- [ ] Database metrics (query time, connections)
- [ ] Queue metrics (jobs waiting, processing time)
- [ ] Cache metrics (hit rate, memory usage)

### 5.2 Dashboards (Grafana)
**Estimativa:** 1 semana

- [ ] System overview dashboard
- [ ] Analysis performance dashboard
- [ ] Queue monitoring dashboard
- [ ] Error tracking dashboard
- [ ] User activity dashboard

### 5.3 Logging (ELK Stack)
**Estimativa:** 1 semana

- [ ] Centralized logging (Elasticsearch)
- [ ] Log aggregation (Logstash)
- [ ] Log visualization (Kibana)
- [ ] Structured logs (JSON)
- [ ] Log retention policies

### 5.4 Alerting
**Estimativa:** 3 dias

- [ ] Slack notifications
- [ ] Email alerts
- [ ] PagerDuty integration
- [ ] Alert rules (error rate, latency, disk usage)

### 5.5 Error Tracking (Sentry)
**Estimativa:** 2 dias

- [ ] Sentry integration
- [ ] Error grouping
- [ ] Source maps
- [ ] Release tracking

---

## ⚡ Fase 6: Performance e Escalabilidade (PLANEJADA)

### 6.1 GPU Acceleration
**Estimativa:** 2 semanas

- [ ] TensorFlow.js GPU backend
- [ ] CUDA support
- [ ] Benchmark GPU vs CPU
- [ ] Fallback strategy

**Performance esperada:**
- CPU: 12 FPS
- GPU: 60-120 FPS (5-10x melhora)

### 6.2 Horizontal Scaling
**Estimativa:** 2 semanas

- [ ] Multiple worker instances
- [ ] Load balancing (Nginx)
- [ ] Redis Cluster
- [ ] PostgreSQL read replicas
- [ ] CDN para vídeos (CloudFlare)

### 6.3 Caching Avançado
**Estimativa:** 1 semana

- [ ] Multi-level cache (L1: memory, L2: Redis)
- [ ] Cache warming
- [ ] Cache invalidation strategies
- [ ] Cache compression

### 6.4 Database Optimization
**Estimativa:** 1 semana

- [ ] Query optimization (EXPLAIN ANALYZE)
- [ ] Index optimization
- [ ] Partitioning (por data)
- [ ] Connection pooling tuning
- [ ] Materialized views

---

## 🚀 Fase 7: Deployment e Infraestrutura (PLANEJADA)

### 7.1 Kubernetes
**Estimativa:** 3 semanas

- [ ] Helm charts
- [ ] Horizontal Pod Autoscaler
- [ ] Ingress configuration
- [ ] ConfigMaps e Secrets
- [ ] Persistent volumes

### 7.2 CI/CD Avançado
**Estimativa:** 1 semana

- [ ] Blue-green deployment
- [ ] Canary releases
- [ ] Rollback automático
- [ ] Smoke tests pós-deploy

### 7.3 Backup e Disaster Recovery
**Estimativa:** 1 semana

- [ ] Automated PostgreSQL backups
- [ ] Redis snapshots
- [ ] S3 backup storage
- [ ] Restore procedures
- [ ] RTO/RPO SLA

### 7.4 Multi-Region
**Estimativa:** 4 semanas

- [ ] Multi-region deployment
- [ ] Geo-replication
- [ ] Latency-based routing
- [ ] Data residency compliance

---

## 🎨 Fase 8: Frontend Integration (PLANEJADA)

### 8.1 Upload Component
**Estimativa:** 1 semana

- [ ] Drag-and-drop upload
- [ ] Progress bar
- [ ] Video preview
- [ ] Validation (size, duration, format)

### 8.2 Analysis Dashboard
**Estimativa:** 2 semanas

- [ ] Análises recentes
- [ ] Filtros (status, exercício, data)
- [ ] Paginação
- [ ] Exportar para PDF

### 8.3 Result Visualization
**Estimativa:** 2 semanas

- [ ] Score gauges (motor, stabilizer, IGPB)
- [ ] Joint analysis cards
- [ ] Video player com overlay
- [ ] Recommendations list

### 8.4 Comparison View
**Estimativa:** 1 semana

- [ ] Side-by-side comparison
- [ ] Delta visualization
- [ ] Progress charts
- [ ] Timeline

### 8.5 Corrective Plan UI
**Estimativa:** 2 semanas

- [ ] Criar plano
- [ ] Visualizar exercícios
- [ ] Marcar sessões
- [ ] Acompanhar progresso

---

## 📈 Métricas de Sucesso

### Performance
- **FPS:** >30 FPS (CPU), >120 FPS (GPU)
- **Latência API:** <200ms (p95)
- **Tempo de processamento:** <2 minutos (vídeo de 30s)
- **Throughput:** >100 análises/hora

### Reliability
- **Uptime:** >99.9%
- **Error rate:** <0.1%
- **Queue success rate:** >99%
- **Webhook delivery rate:** >95%

### Scalability
- **Concurrent users:** 1000+
- **Queue size:** 10,000+ jobs
- **Database size:** 1TB+
- **Cache hit rate:** >80%

### Quality
- **Test coverage:** >85%
- **Documentation coverage:** 100%
- **API stability:** Zero breaking changes
- **Security score:** A+ (Mozilla Observatory)

---

## 🗓️ Timeline Estimado

| Fase | Duração | Status |
|------|---------|--------|
| Fase 1: Infraestrutura Base | 2 semanas | ✅ Completo |
| Fase 2: Integração e Testes | 1 semana | 🚧 Em progresso |
| Fase 3: Features Avançadas | 4 semanas | 📅 Planejada |
| Fase 4: Segurança | 3 semanas | 📅 Planejada |
| Fase 5: Monitoramento | 2 semanas | 📅 Planejada |
| Fase 6: Performance | 3 semanas | 📅 Planejada |
| Fase 7: Deployment | 4 semanas | 📅 Planejada |
| Fase 8: Frontend | 4 semanas | 📅 Planejada |
| **Total** | **~6 meses** | - |

---

## 🎯 Prioridades Imediatas (Esta Semana)

1. **Executar migrations** (30 min)
2. **Integrar PrismaService** (2h)
3. **Worker integration** (3h)
4. **Testar fluxo completo** (1h)
5. **Deploy em staging** (2h)

**Total:** 1 dia de trabalho

---

## 📞 Stakeholders

- **Product Owner:** Definir features prioritárias
- **Tech Lead:** Arquitetura e decisões técnicas
- **Backend Team:** Implementação da API
- **Frontend Team:** UI/UX
- **DevOps Team:** Infraestrutura e deploy
- **QA Team:** Testes e quality assurance

---

**✅ Roadmap vivo - atualizar conforme progresso!**

**Última atualização:** 2026-02-15
