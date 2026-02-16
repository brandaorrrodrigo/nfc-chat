# 📘 BiomechanicalService - Documentação Completa

Serviço de lógica de negócio para análise biomecânica de vídeos com MediaPipe.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Métodos Públicos](#métodos-públicos)
4. [Integração com Worker](#integração-com-worker)
5. [Cache e Performance](#cache-e-performance)
6. [Exemplos de Uso](#exemplos-de-uso)
7. [Testes](#testes)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O `BiomechanicalService` é a camada de lógica de negócio que:

- ✅ Gerencia fila de processamento de vídeos (BullMQ)
- ✅ Persiste análises no PostgreSQL (Prisma)
- ✅ Implementa cache de resultados (Redis)
- ✅ Rastreia status em tempo real
- ✅ Fornece estatísticas do sistema
- ✅ Gerencia cleanup de arquivos temporários
- ✅ Implementa retry logic para análises falhas
- ✅ Registra logs detalhados de operações

---

## 🏗️ Arquitetura

```
┌─────────────────┐
│   Controller    │ ← API REST
└────────┬────────┘
         │
    ┌────▼────────────────┐
    │ BiomechanicalService│ ← Lógica de Negócio
    └────┬────────────────┘
         │
    ┌────┼──────────────────┐
    │    │                  │
┌───▼────▼───┐    ┌────────▼────┐
│ PostgreSQL │    │ Redis Cache │
│  (Prisma)  │    │   (DB 1)    │
└────────────┘    └─────────────┘
         │
    ┌────▼──────────┐
    │  BullMQ Queue │ → Worker
    │  (Redis DB 0) │
    └───────────────┘
```

---

## 📚 Métodos Públicos

### 1. `queueVideoAnalysis(params)`

Enfileira vídeo para análise biomecânica.

**Parâmetros:**
```typescript
interface QueueAnalysisParams {
  videoPath: string;        // Caminho do vídeo no servidor
  exerciseName: string;     // Nome do exercício
  captureMode: CaptureMode; // 'ESSENTIAL' | 'ADVANCED' | 'PRO'
  userId: string;           // ID do usuário
  webhookUrl?: string;      // URL para callback (opcional)
}
```

**Retorno:**
```typescript
{
  jobId: string;       // ID do job na fila
  analysisId: string;  // ID da análise no banco
}
```

**Exemplo:**
```typescript
const { analysisId, jobId } = await service.queueVideoAnalysis({
  videoPath: '/uploads/video-123.mp4',
  exerciseName: 'Agachamento Livre',
  captureMode: 'ESSENTIAL',
  userId: 'user_abc',
  webhookUrl: 'https://myapp.com/webhook'
});
```

**O que faz:**
1. Cria registro no banco (`video_analyses`)
2. Adiciona job à fila BullMQ
3. Atualiza registro com `jobId`
4. Retorna IDs para tracking

---

### 2. `getAnalysisStatus(analysisId)`

Obtém status atual de uma análise.

**Parâmetros:**
- `analysisId: string` - ID da análise

**Retorno:**
```typescript
interface AnalysisStatus {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress?: {
    stage: string;    // 'extraction' | 'detection' | 'analysis'
    progress: number; // 0-100
  };
  result?: BiomechanicalAnalysis;  // Resultado completo (se completed)
  error?: string;                   // Mensagem de erro (se failed)
  createdAt: Date;
  updatedAt: Date;
}
```

**Exemplo:**
```typescript
const status = await service.getAnalysisStatus('abc123');

if (status.status === 'completed') {
  console.log('Scores:', status.result.scores);
} else if (status.status === 'processing') {
  console.log('Progresso:', status.progress);
}
```

**Cache:**
- ✅ Resultados completos: TTL 1 hora
- ⏱️ Em processamento: TTL 1 minuto

---

### 3. `updateAnalysisStatus(analysisId, status, data)`

Atualiza status da análise (usado pelo worker).

**Parâmetros:**
```typescript
analysisId: string;
status: 'processing' | 'completed' | 'failed';
data?: {
  result?: any;      // Resultado da análise (se completed)
  error?: string;    // Mensagem de erro (se failed)
  metadata?: any;    // Metadados adicionais
}
```

**Exemplo:**
```typescript
// Worker marca como "processing"
await service.updateAnalysisStatus('abc123', 'processing');

// Worker marca como "completed" e salva resultado
await service.updateAnalysisStatus('abc123', 'completed', {
  result: {
    analysis: biomechanicalAnalysis,
    metadata: { totalFrames: 45, processingTimeMs: 12500 }
  }
});
```

**O que faz:**
1. Atualiza status no banco
2. Se `completed`, salva resultado em `biomechanical_results`
3. Invalida cache

---

### 4. `listUserAnalyses(userId, options)`

Lista análises de um usuário com paginação.

**Parâmetros:**
```typescript
userId: string;
options?: {
  limit?: number;   // Default: 10
  offset?: number;  // Default: 0
}
```

**Retorno:**
```typescript
{
  items: Analysis[];  // Array de análises
  total: number;      // Total de análises do usuário
  limit: number;      // Limite aplicado
  offset: number;     // Offset aplicado
}
```

**Exemplo:**
```typescript
const { items, total } = await service.listUserAnalyses('user_abc', {
  limit: 20,
  offset: 0
});

console.log(`${items.length} de ${total} análises`);
```

---

### 5. `getSystemStats()`

Obtém estatísticas do sistema.

**Retorno:**
```typescript
interface SystemStats {
  totalAnalyses: number;
  queueStats: {
    waiting: number;    // Aguardando processamento
    active: number;     // Em processamento
    completed: number;  // Completadas
    failed: number;     // Falhas
  };
  detectorStats: {      // Stats do MediaPipe
    totalFrames: number;
    cacheHits: number;
    avgProcessingTime: number;
    fps: number;
  };
  cacheStats: {
    hits: number;
    misses: number;
    hitRate: number;    // Percentual
    size: number;       // Número de itens em cache
  };
}
```

**Exemplo:**
```typescript
const stats = await service.getSystemStats();

console.log('Queue:', stats.queueStats);
console.log('Cache hit rate:', stats.cacheStats.hitRate + '%');
```

---

### 6. `cleanupOldFiles(olderThanDays)`

Remove vídeos de análises antigas.

**Parâmetros:**
- `olderThanDays: number` - Idade mínima em dias (default: 7)

**Retorno:**
- `number` - Quantidade de arquivos deletados

**Exemplo:**
```typescript
// Deletar vídeos com mais de 30 dias
const deleted = await service.cleanupOldFiles(30);
console.log(`${deleted} arquivos deletados`);
```

**Uso recomendado:**
- Executar via cron diariamente
- Produção: 7 dias
- Desenvolvimento: 1 dia

---

### 7. `retryFailedAnalysis(analysisId)`

Reprocessa análise que falhou.

**Parâmetros:**
- `analysisId: string` - ID da análise falha

**Retorno:**
```typescript
{ jobId: string }  // ID do novo job
```

**Exemplo:**
```typescript
try {
  const { jobId } = await service.retryFailedAnalysis('abc123');
  console.log('Análise reenfileirada:', jobId);
} catch (error) {
  console.error('Erro:', error.message);
}
```

**Validações:**
- ❌ Análise deve existir
- ❌ Status deve ser 'failed'
- ❌ Vídeo deve existir no disco

---

### 8. `cancelAnalysis(analysisId)`

Cancela análise em processamento.

**Parâmetros:**
- `analysisId: string` - ID da análise

**Retorno:**
- `void`

**Exemplo:**
```typescript
await service.cancelAnalysis('abc123');
console.log('Análise cancelada');
```

**O que faz:**
1. Remove job da fila (se ainda em fila)
2. Marca status como 'failed' com erro "Cancelado pelo usuário"
3. Remove vídeo do disco
4. Invalida cache

---

### 9. `getPerformanceMetrics(timeRange)`

Obtém métricas de performance do sistema.

**Parâmetros:**
- `timeRange: 'day' | 'week' | 'month'` - Período de análise

**Retorno:**
```typescript
{
  timeRange: string;
  totalCompleted: number;
  avgProcessingTimeMs: number;
  minProcessingTimeMs: number;
  maxProcessingTimeMs: number;
  avgProcessingTimeFormatted: string;  // "5m 30s"
  throughput: number;  // Análises por hora
}
```

**Exemplo:**
```typescript
const metrics = await service.getPerformanceMetrics('week');

console.log('Throughput:', metrics.throughput, 'análises/hora');
console.log('Tempo médio:', metrics.avgProcessingTimeFormatted);
```

---

## 🔗 Integração com Worker

O worker deve chamar `updateAnalysisStatus` nos eventos da fila.

**Adicionar no `video-processing.queue.ts`:**

```typescript
import { BiomechanicalService } from '../modules/biomechanical/biomechanical.service';

private setupEventListeners(): void {
  const service = new BiomechanicalService();

  // Job iniciou
  this.worker.on('active', async (job) => {
    await service.updateAnalysisStatus(job.data.videoId, 'processing');
  });

  // Job completou
  this.worker.on('completed', async (job, result) => {
    await service.updateAnalysisStatus(job.data.videoId, 'completed', {
      result: {
        analysis: result.analysis,
        metadata: result.metadata
      }
    });
  });

  // Job falhou
  this.worker.on('failed', async (job, error) => {
    await service.updateAnalysisStatus(job.data.videoId, 'failed', {
      error: error.message
    });
  });
}
```

---

## ⚡ Cache e Performance

### Estratégia de Cache

**Cache de Status:**
- Chave: `nfv:cache:analysis:status:{analysisId}`
- TTL: 3600s (completed) | 60s (processing/queued)

**Invalidação:**
- ✅ Automática ao atualizar status
- ✅ Manual com `redis.del(cacheKey)`

### Estatísticas de Cache

```typescript
const stats = await service.getSystemStats();

console.log(`Hit rate: ${stats.cacheStats.hitRate}%`);
console.log(`Cache size: ${stats.cacheStats.size} itens`);
```

**Meta de performance:**
- Hit rate > 70%
- Latência < 50ms para hits
- Latência < 200ms para misses

---

## 💡 Exemplos de Uso

### Exemplo Completo: Upload e Polling

```typescript
// 1. Upload e enfileiramento
const { analysisId } = await service.queueVideoAnalysis({
  videoPath: uploadedFile.path,
  exerciseName: 'Agachamento Livre',
  captureMode: 'ESSENTIAL',
  userId: req.user.id,
  webhookUrl: 'https://myapp.com/webhook'
});

// 2. Polling de status
const pollStatus = async () => {
  const status = await service.getAnalysisStatus(analysisId);

  console.log(`Status: ${status.status}`);

  if (status.progress) {
    console.log(`[${status.progress.stage}] ${status.progress.progress}%`);
  }

  if (status.status === 'completed') {
    console.log('Resultado:', status.result);
    return true;
  } else if (status.status === 'failed') {
    console.error('Erro:', status.error);
    return true;
  }

  return false;
};

// Polling a cada 2 segundos
const interval = setInterval(async () => {
  const done = await pollStatus();
  if (done) clearInterval(interval);
}, 2000);
```

### Exemplo: Dashboard de Admin

```typescript
// Estatísticas do sistema
const stats = await service.getSystemStats();

console.log('=== SISTEMA ===');
console.log(`Total de análises: ${stats.totalAnalyses}`);
console.log(`Fila: ${stats.queueStats.waiting} aguardando`);
console.log(`Processando: ${stats.queueStats.active}`);
console.log(`Cache hit rate: ${stats.cacheStats.hitRate}%`);

// Métricas de performance
const metrics = await service.getPerformanceMetrics('day');

console.log('\n=== PERFORMANCE (24h) ===');
console.log(`Completadas: ${metrics.totalCompleted}`);
console.log(`Tempo médio: ${metrics.avgProcessingTimeFormatted}`);
console.log(`Throughput: ${metrics.throughput.toFixed(2)} análises/hora`);
```

### Exemplo: Cleanup Automático (Cron)

```typescript
import { CronJob } from 'cron';

// Executar todo dia às 3:00 AM
const cleanupJob = new CronJob('0 3 * * *', async () => {
  console.log('Iniciando cleanup...');

  const deleted = await service.cleanupOldFiles(7);

  console.log(`Cleanup concluído: ${deleted} arquivos deletados`);
});

cleanupJob.start();
```

---

## 🧪 Testes

Ver arquivo completo: `src/modules/biomechanical/biomechanical.service.spec.ts`

**Executar testes:**
```bash
npm test src/modules/biomechanical/biomechanical.service.spec.ts
```

---

## 🐛 Troubleshooting

### Problema: Cache não funciona

**Sintomas:**
- Hit rate = 0%
- Latência alta

**Solução:**
```bash
# Verificar conexão Redis
docker-compose exec redis redis-cli PING

# Verificar banco 1 (cache)
docker-compose exec redis redis-cli -n 1 KEYS "nfv:cache:*"
```

### Problema: Status não atualiza

**Sintomas:**
- Análise fica "queued" para sempre
- Status não muda

**Solução:**
1. Verificar worker rodando:
```bash
docker-compose ps worker
docker-compose logs worker
```

2. Verificar callbacks do worker:
```typescript
// Garantir que setupEventListeners() está sendo chamado
```

### Problema: Cleanup não deleta arquivos

**Sintomas:**
- Disco cheio
- Arquivos antigos não são removidos

**Solução:**
```typescript
// Executar manualmente
const deleted = await service.cleanupOldFiles(0);
console.log('Deletados:', deleted);

// Verificar permissões de escrita
await fs.access(videoPath, fs.constants.W_OK);
```

---

## 📊 Métricas Esperadas

| Métrica | Desenvolvimento | Produção |
|---------|----------------|----------|
| Cache hit rate | > 50% | > 80% |
| Throughput | 5-10 análises/hora | 50-100 análises/hora |
| Tempo médio | 2-5 minutos | < 1 minuto |
| Taxa de sucesso | > 80% | > 95% |

---

## ✅ Checklist de Integração

- [ ] BiomechanicalService instalado
- [ ] Redis rodando (DB 0 e DB 1)
- [ ] PostgreSQL com schema migrado
- [ ] Worker com callbacks configurados
- [ ] Endpoints REST testados
- [ ] Cache validado (hit rate > 50%)
- [ ] Cleanup agendado (cron)
- [ ] Webhooks testados (se aplicável)
- [ ] Monitoramento configurado

---

**✅ Service pronto para produção!**

Próximos passos: Testes de carga, monitoramento com Prometheus/Grafana, backup automático do banco.
