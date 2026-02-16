# 📊 Monitoring & Observability Guide

Guia completo de monitoring e observabilidade para o NFC/NFV Platform.

---

## 📋 Índice

- [Overview](#overview)
- [Health Checks](#health-checks)
- [Logs](#logs)
- [Metrics](#metrics)
- [Alerting](#alerting)
- [Dashboards](#dashboards)
- [Tracing](#tracing)

---

## 🎯 Overview

### Pilares da Observabilidade

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  1. LOGS        2. METRICS      3. TRACES       │
│     │               │               │           │
│     │               │               │           │
│     ▼               ▼               ▼           │
│  ┌─────┐       ┌─────┐         ┌─────┐         │
│  │ ELK │       │Prom │         │Jaeger│        │
│  │Loki │       │Grafana│       │Zipkin│        │
│  └─────┘       └─────┘         └─────┘         │
│     │               │               │           │
│     └───────────────┼───────────────┘           │
│                     │                           │
│              ┌──────▼──────┐                    │
│              │  Dashboards  │                   │
│              │   Alerts     │                   │
│              └──────────────┘                   │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## ✅ Health Checks

### Built-in Health Check

```bash
# Via Make
make health

# Via Script
./docker/scripts/health.sh

# Via HTTP
curl http://localhost:3000/health
curl http://localhost/health  # Nginx
```

### Response

```json
{
  "status": "healthy",
  "timestamp": "2026-02-15T10:30:00Z",
  "uptime": 86400,
  "services": {
    "database": "healthy",
    "redis": "healthy",
    "storage": "healthy",
    "worker": "healthy"
  },
  "version": "1.0.0"
}
```

### Custom Health Checks

```typescript
// app/api/health/route.ts
export async function GET() {
  const checks = await Promise.all([
    checkDatabase(),
    checkRedis(),
    checkStorage(),
    checkWorker()
  ]);

  const allHealthy = checks.every(c => c.status === 'healthy');

  return Response.json(
    {
      status: allHealthy ? 'healthy' : 'degraded',
      checks
    },
    { status: allHealthy ? 200 : 503 }
  );
}
```

---

## 📝 Logs

### Log Levels

```typescript
// Winston logger
import winston from 'winston';

const logger = winston.createLogger({
  levels: {
    error: 0,    // Erros críticos
    warn: 1,     // Warnings
    info: 2,     // Informações gerais
    http: 3,     // HTTP requests
    debug: 4     // Debug detalhado
  },
  level: process.env.LOG_LEVEL || 'info'
});
```

### Structured Logging

```typescript
// ✅ BOM: Structured logs (JSON)
logger.info('Video analysis started', {
  videoId: 'va_123',
  userId: 'user_456',
  exerciseType: 'back_squat',
  timestamp: new Date().toISOString()
});

// ❌ RUIM: String simples
logger.info('Video analysis started for video va_123');
```

### Log Rotation

```yaml
# docker-compose.yml
services:
  api:
    logging:
      driver: "json-file"
      options:
        max-size: "50m"
        max-file: "5"
```

### Centralized Logging (Loki)

#### docker-compose.monitoring.yml

```yaml
version: '3.8'

services:
  loki:
    image: grafana/loki:latest
    ports:
      - "3100:3100"
    volumes:
      - loki_data:/loki
    command: -config.file=/etc/loki/local-config.yaml

  promtail:
    image: grafana/promtail:latest
    volumes:
      - /var/log:/var/log
      - /var/lib/docker/containers:/var/lib/docker/containers
      - ./promtail-config.yml:/etc/promtail/config.yml
    command: -config.file=/etc/promtail/config.yml

volumes:
  loki_data:
```

---

## 📈 Metrics

### Prometheus Setup

#### docker-compose.monitoring.yml

```yaml
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'

  node-exporter:
    image: prom/node-exporter:latest
    ports:
      - "9100:9100"

  postgres-exporter:
    image: prometheuscommunity/postgres-exporter
    environment:
      DATA_SOURCE_NAME: postgresql://user:pass@postgres:5432/db?sslmode=disable
    ports:
      - "9187:9187"

  redis-exporter:
    image: oliver006/redis_exporter
    environment:
      REDIS_ADDR: redis:6379
      REDIS_PASSWORD: ${REDIS_PASSWORD}
    ports:
      - "9121:9121"

volumes:
  prometheus_data:
```

#### prometheus.yml

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']

  - job_name: 'api'
    static_configs:
      - targets: ['api:3000']
```

### Application Metrics

```typescript
// lib/metrics.ts
import { Registry, Counter, Histogram, Gauge } from 'prom-client';

export const register = new Registry();

// Requests
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5, 10]
});

export const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// Videos
export const videosProcessed = new Counter({
  name: 'videos_processed_total',
  help: 'Total videos processed',
  labelNames: ['exercise_type', 'status']
});

export const videoProcessingDuration = new Histogram({
  name: 'video_processing_duration_seconds',
  help: 'Duration of video processing',
  labelNames: ['exercise_type'],
  buckets: [10, 30, 60, 120, 300]
});

// Queue
export const queueSize = new Gauge({
  name: 'queue_size',
  help: 'Current queue size',
  labelNames: ['queue_name']
});

// Register all
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(videosProcessed);
register.registerMetric(videoProcessingDuration);
register.registerMetric(queueSize);
```

### Metrics Endpoint

```typescript
// app/api/metrics/route.ts
import { register } from '@/lib/metrics';

export async function GET() {
  const metrics = await register.metrics();

  return new Response(metrics, {
    headers: { 'Content-Type': register.contentType }
  });
}
```

---

## 🚨 Alerting

### Alert Rules (Prometheus)

```yaml
# alerts.yml
groups:
  - name: app_alerts
    rules:
      # High Error Rate
      - alert: HighErrorRate
        expr: |
          rate(http_requests_total{status_code=~"5.."}[5m])
          / rate(http_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate ({{ $value }}%)"
          description: "More than 5% of requests are failing"

      # Slow API Responses
      - alert: SlowAPIResponses
        expr: |
          histogram_quantile(0.95,
            rate(http_request_duration_seconds_bucket[5m])
          ) > 1
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "API responses are slow (p95: {{ $value }}s)"

      # High Queue Size
      - alert: HighQueueSize
        expr: queue_size > 50
        for: 15m
        labels:
          severity: warning
        annotations:
          summary: "Queue size is high ({{ $value }})"

      # Database Connection Issues
      - alert: DatabaseConnectionLow
        expr: pg_stat_activity_count < 5
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Low database connections"

      # High Memory Usage
      - alert: HighMemoryUsage
        expr: |
          (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes)
          / node_memory_MemTotal_bytes > 0.9
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Memory usage is high ({{ $value }}%)"

      # High CPU Usage
      - alert: HighCPUUsage
        expr: 100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 15m
        labels:
          severity: warning
        annotations:
          summary: "CPU usage is high ({{ $value }}%)"

      # Service Down
      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service {{ $labels.job }} is down"
```

### Alert Manager Setup

```yaml
# docker-compose.monitoring.yml
services:
  alertmanager:
    image: prom/alertmanager:latest
    ports:
      - "9093:9093"
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml
    command:
      - '--config.file=/etc/alertmanager/alertmanager.yml'
```

```yaml
# alertmanager.yml
global:
  resolve_timeout: 5m
  slack_api_url: 'YOUR_SLACK_WEBHOOK_URL'

route:
  receiver: 'slack-notifications'
  group_by: ['alertname', 'severity']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 12h

receivers:
  - name: 'slack-notifications'
    slack_configs:
      - channel: '#alerts'
        title: '{{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'

  - name: 'email-notifications'
    email_configs:
      - to: 'ops@nutrifitcoach.com.br'
        from: 'alerts@nutrifitcoach.com.br'
        smarthost: 'smtp.gmail.com:587'
        auth_username: 'alerts@nutrifitcoach.com.br'
        auth_password: 'YOUR_PASSWORD'
```

---

## 📊 Dashboards

### Grafana Setup

```yaml
# docker-compose.monitoring.yml
services:
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD:-admin}
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning

volumes:
  grafana_data:
```

### Pre-configured Dashboards

#### 1. System Overview

- CPU, Memory, Disk usage
- Network I/O
- Container status

#### 2. Application Metrics

- Request rate (req/s)
- Response times (p50, p95, p99)
- Error rate
- Active users

#### 3. Database Metrics

- Query duration
- Connection pool usage
- Cache hit rate
- Slow queries

#### 4. Queue Metrics

- Queue size
- Processing rate
- Failed jobs
- Job duration

#### 5. Business Metrics

- Videos processed/hour
- User signups
- Revenue metrics
- Feature usage

---

## 🔍 Tracing (Futuro)

### Jaeger Setup

```yaml
# docker-compose.monitoring.yml
services:
  jaeger:
    image: jaegertracing/all-in-one:latest
    ports:
      - "5775:5775/udp"
      - "6831:6831/udp"
      - "6832:6832/udp"
      - "5778:5778"
      - "16686:16686"
      - "14268:14268"
      - "14250:14250"
      - "9411:9411"
    environment:
      COLLECTOR_ZIPKIN_HTTP_PORT: 9411
```

### Instrumentation

```typescript
// lib/tracing.ts
import { trace } from '@opentelemetry/api';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';

const provider = new NodeTracerProvider();
provider.addSpanProcessor(
  new BatchSpanProcessor(
    new JaegerExporter({
      endpoint: 'http://jaeger:14268/api/traces'
    })
  )
);

registerInstrumentations({
  instrumentations: [new HttpInstrumentation()]
});

provider.register();

export const tracer = trace.getTracer('nfc-nfv-api');
```

---

## 🚀 Quick Start

### Setup Completo de Monitoring

```bash
# 1. Criar arquivo docker-compose.monitoring.yml
# (Use o arquivo fornecido acima)

# 2. Iniciar serviços de monitoring
docker-compose -f docker-compose.yml \
               -f docker-compose.monitoring.yml \
               up -d

# 3. Acessar dashboards
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3000 (admin/admin)
# Alertmanager: http://localhost:9093

# 4. Configurar Grafana datasources
# Settings → Data Sources → Add Prometheus
# URL: http://prometheus:9090

# 5. Importar dashboards
# Dashboards → Import → 1860 (Node Exporter)
# Dashboards → Import → 9628 (PostgreSQL)
# Dashboards → Import → 763 (Redis)
```

---

## 📞 On-Call Playbook

### High Error Rate

1. **Check logs:** `make logs-api`
2. **Check recent deploys:** `git log -10 --oneline`
3. **Rollback if needed:** `./scripts/rollback.sh`
4. **Notify team:** Slack #incidents

### Database Issues

1. **Check connections:** `docker exec -it nfv-postgres pg_stat_activity`
2. **Check slow queries:** Ver PERFORMANCE.md
3. **Restart if needed:** `docker-compose restart postgres`

### Queue Backlog

1. **Check queue size:** Redis CLI `LLEN bull:video-analysis:wait`
2. **Scale workers:** `docker-compose up -d --scale worker=6`
3. **Purge failed:** `docker-compose exec redis redis-cli DEL bull:video-analysis:failed`

---

**Última atualização:** 2026-02-15
**Versão:** 1.0.0

📊 **Measure everything. Improve continuously.**
