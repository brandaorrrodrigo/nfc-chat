/**
 * Configuração das Filas BullMQ
 *
 * Define configurações para processamento assíncrono de análises de vídeo
 */

import { BullModuleOptions } from '@nestjs/bull';

/**
 * Configuração do Redis
 */
export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  connectTimeout: 10000,
};

/**
 * Configuração da fila de análise híbrida
 */
export const hybridVideoAnalysisQueueConfig: BullModuleOptions = {
  name: 'hybrid-video-analysis',
  redis: redisConfig,
  defaultJobOptions: {
    attempts: 3, // Máximo 3 tentativas
    backoff: {
      type: 'exponential',
      delay: 5000, // Começa com 5s, dobra a cada tentativa
    },
    removeOnComplete: {
      age: 86400, // Remove após 24h
      count: 100, // Mantém últimos 100
    },
    removeOnFail: {
      age: 604800, // Remove após 7 dias
      count: 500, // Mantém últimos 500 erros
    },
    timeout: 300000, // 5 minutos timeout total
  },
  limiter: {
    max: 5, // Máximo 5 jobs simultâneos (limite de GPU/recursos)
    duration: 60000, // Por minuto
  },
  settings: {
    stalledInterval: 30000, // Check stalled jobs a cada 30s
    maxStalledCount: 2, // Job considerado stalled após 2 checks
    guardInterval: 5000,
    retryProcessDelay: 5000,
  },
};

/**
 * Prioridades de jobs
 */
export enum JobPriority {
  CRITICAL = 1, // Usuário premium com erro
  HIGH = 2, // Usuário premium
  NORMAL = 3, // Usuário free (score baixo)
  LOW = 4, // Usuário free (retry)
}

/**
 * Estimativas de tempo por etapa (ms)
 */
export const STAGE_TIME_ESTIMATES = {
  EXTRACTION: 10000, // 10s - FFmpeg
  MEDIAPIPE: 15000, // 15s - Python service
  QUICK_ANALYSIS: 500, // 0.5s - Quick comparison
  DECISION: 10, // 10ms - Decision engine
  DEEP_ANALYSIS: 35000, // 35s - RAG + LLM
  PROTOCOLS: 1000, // 1s - Rule-based
  SAVE: 500, // 0.5s - Database
  NOTIFICATION: 100, // 100ms - WebSocket
};

/**
 * Thresholds de retry por tipo de erro
 */
export const RETRY_STRATEGIES = {
  EXTRACTION_ERROR: {
    maxAttempts: 3,
    backoff: 'exponential',
    delay: 5000,
  },
  MEDIAPIPE_ERROR: {
    maxAttempts: 2, // Python service pode estar down
    backoff: 'fixed',
    delay: 10000,
  },
  QUICK_ANALYSIS_ERROR: {
    maxAttempts: 3,
    backoff: 'exponential',
    delay: 2000,
  },
  DEEP_ANALYSIS_ERROR: {
    maxAttempts: 2, // LLM pode estar rate-limited
    backoff: 'exponential',
    delay: 30000, // Esperar mais tempo
  },
  DATABASE_ERROR: {
    maxAttempts: 3,
    backoff: 'exponential',
    delay: 1000,
  },
  UNKNOWN_ERROR: {
    maxAttempts: 1, // Não retry erros desconhecidos
    backoff: 'fixed',
    delay: 0,
  },
};

/**
 * Configuração de eventos da fila
 */
export const QUEUE_EVENTS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  FAILED: 'failed',
  PROGRESS: 'progress',
  STALLED: 'stalled',
  REMOVED: 'removed',
  DRAINED: 'drained',
};

/**
 * Limites de recursos
 */
export const RESOURCE_LIMITS = {
  MAX_VIDEO_SIZE_MB: 500, // 500MB máximo
  MAX_VIDEO_DURATION_SEC: 180, // 3 minutos máximo
  MAX_FRAMES: 20, // Máximo 20 frames por análise
  MAX_CONCURRENT_JOBS: 5, // Máximo 5 análises simultâneas (GPU limit)
  MEMORY_LIMIT_MB: 2048, // 2GB por job
};

/**
 * Configuração de cache
 */
export const CACHE_CONFIG = {
  L1: {
    ttl: 86400, // 24 horas
    prefix: 'analysis:complete:',
  },
  L2: {
    ttl: 604800, // 7 dias
    prefix: 'gold_standard:',
  },
  L3: {
    ttl: 2592000, // 30 dias
    prefix: 'rag_context:',
  },
  FRAMES: {
    ttl: 3600, // 1 hora (temporário)
    prefix: 'frames:',
  },
};

/**
 * Configuração de notificações
 */
export const NOTIFICATION_CONFIG = {
  WEBSOCKET_EVENTS: {
    ANALYSIS_STARTED: 'analysis:started',
    ANALYSIS_PROGRESS: 'analysis:progress',
    ANALYSIS_COMPLETED: 'analysis:completed',
    ANALYSIS_FAILED: 'analysis:failed',
  },
  EMAIL: {
    enabled: process.env.EMAIL_NOTIFICATIONS === 'true',
    sendOnComplete: true,
    sendOnFail: true,
  },
  PUSH: {
    enabled: process.env.PUSH_NOTIFICATIONS === 'true',
    sendOnComplete: true,
  },
};

/**
 * Helper para criar job options customizado
 */
export function createJobOptions(
  priority: JobPriority,
  options?: Partial<{
    timeout: number;
    attempts: number;
    removeOnComplete: boolean;
  }>,
) {
  return {
    priority,
    timeout: options?.timeout || hybridVideoAnalysisQueueConfig.defaultJobOptions.timeout,
    attempts: options?.attempts || hybridVideoAnalysisQueueConfig.defaultJobOptions.attempts,
    removeOnComplete: options?.removeOnComplete !== false,
    backoff: hybridVideoAnalysisQueueConfig.defaultJobOptions.backoff,
  };
}
