/**
 * Configurações Centralizadas de Performance
 *
 * Define limites, otimizações e parâmetros de processamento
 * para o sistema de análise biomecânica NFC/NFV.
 */

export const PerformanceConfig = {
  // TensorFlow Backend
  tensorflow: {
    backend: process.env.TF_BACKEND || 'cpu',  // 'cpu' | 'wasm' | 'webgl' | 'gpu'
    threads: parseInt(process.env.TF_THREADS || '4'),
    enableProfiling: process.env.NODE_ENV === 'development'
  },

  // Processamento de Vídeo
  video: {
    // Extração de frames
    maxFps: parseInt(process.env.MAX_FPS || '30'),  // Reduzir de 60 para 30 para economizar recursos
    extractionFormat: 'jpg' as const,  // jpg mais rápido que png
    jpegQuality: 85,

    // Batch processing
    batchSize: parseInt(process.env.BATCH_SIZE || '10'),  // Processar N frames por vez
    maxConcurrentVideos: parseInt(process.env.MAX_CONCURRENT_VIDEOS || '2'),

    // Limites
    maxVideoDuration: 60,  // segundos
    maxVideoSize: 100 * 1024 * 1024,  // 100MB
    allowedFormats: ['mp4', 'webm', 'mov', 'avi']
  },

  // Cache
  cache: {
    enableFrameCache: true,
    frameCacheTTL: 3600,  // 1 hora
    enableResultCache: true,
    resultCacheTTL: 86400,  // 24 horas
    maxCacheSize: 1000  // número máximo de itens
  },

  // Memory Management
  memory: {
    maxFramesInMemory: 300,  // Limpar frames antigos após N frames
    gcInterval: 10000,  // Garbage collection manual a cada 10s
    enableMemoryMonitoring: true
  },

  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    db: parseInt(process.env.REDIS_DB || '0'),
    password: process.env.REDIS_PASSWORD,
    keyPrefix: 'nfc:',
    maxRetriesPerRequest: null
  },

  // Filas (BullMQ)
  queue: {
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential' as const,
        delay: 5000
      },
      removeOnComplete: {
        count: 100,
        age: 86400  // 24h
      },
      removeOnFail: {
        count: 1000
      }
    },
    limiter: {
      max: 10,
      duration: 60000  // 10 jobs por minuto
    }
  },

  // Upload
  upload: {
    maxFileSize: 100 * 1024 * 1024,  // 100MB
    allowedMimeTypes: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'],
    uploadDir: process.env.UPLOAD_DIR || './data/videos/uploads',
    tempDir: process.env.TEMP_DIR || './data/temp'
  },

  // API
  api: {
    port: parseInt(process.env.PORT || '3000'),
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    rateLimit: {
      windowMs: 15 * 60 * 1000,  // 15 minutos
      max: 100  // 100 requests por windowMs
    }
  }
} as const;

export type PerformanceConfigType = typeof PerformanceConfig;

/**
 * Validação de configuração
 */
export function validatePerformanceConfig(): void {
  const errors: string[] = [];

  // Validar backend TensorFlow
  const validBackends = ['cpu', 'wasm', 'webgl', 'gpu'];
  if (!validBackends.includes(PerformanceConfig.tensorflow.backend)) {
    errors.push(`Backend TensorFlow inválido: ${PerformanceConfig.tensorflow.backend}`);
  }

  // Validar limites de vídeo
  if (PerformanceConfig.video.maxVideoDuration <= 0) {
    errors.push('maxVideoDuration deve ser > 0');
  }

  if (PerformanceConfig.video.maxVideoSize <= 0) {
    errors.push('maxVideoSize deve ser > 0');
  }

  if (PerformanceConfig.video.batchSize <= 0) {
    errors.push('batchSize deve ser > 0');
  }

  // Validar Redis
  if (PerformanceConfig.redis.port < 1 || PerformanceConfig.redis.port > 65535) {
    errors.push('Porta Redis inválida');
  }

  if (errors.length > 0) {
    throw new Error(`Erros de configuração:\n${errors.join('\n')}`);
  }

  console.log('✅ Configuração de performance validada');
}
