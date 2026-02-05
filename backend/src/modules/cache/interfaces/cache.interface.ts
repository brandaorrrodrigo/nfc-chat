/**
 * Interfaces para sistema de cache
 */

/**
 * Níveis de cache
 */
export enum CacheLevel {
  L1_VIDEO_ANALYSIS = 'L1', // Análise idêntica completa (Redis, 24h)
  L2_GOLD_STANDARD = 'L2', // Padrões ouro (Memory, 7d)
  L3_RAG_CONTEXT = 'L3', // Contexto científico RAG (Redis, 30d)
  L4_PROTOCOLS = 'L4', // Protocolos corretivos (Memory, indefinido)
}

/**
 * Entrada de cache
 */
export interface ICacheEntry<T = any> {
  key: string;
  value: T;
  level: CacheLevel;
  ttl: number;
  createdAt: Date;
  expiresAt?: Date;
  hits: number;
  size?: number;
}

/**
 * Estatísticas de cache
 */
export interface ICacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  evictions?: number;
  requests: number;
  hitRate: number;
  keyCount: number;
  sizeBytes?: number;
  sizeMB?: string;
}

/**
 * Configuração de cache por nível
 */
export interface ICacheLevelConfig {
  level: CacheLevel;
  storage: 'redis' | 'memory';
  ttl: number; // segundos, -1 = indefinido
  maxSize?: number; // bytes (para memory)
  evictionStrategy?: 'lru' | 'lfu' | 'fifo';
}

/**
 * Opções para get
 */
export interface ICacheGetOptions {
  level?: CacheLevel;
  fallback?: () => Promise<any>;
  setOnMiss?: boolean;
}

/**
 * Opções para set
 */
export interface ICacheSetOptions {
  level?: CacheLevel;
  ttl?: number;
  skipIfExists?: boolean;
}

/**
 * Resultado de operação de cache
 */
export interface ICacheOperationResult {
  success: boolean;
  hit: boolean;
  level?: CacheLevel;
  latencyMs: number;
  error?: string;
}

/**
 * Padrão de invalidação
 */
export interface ICacheInvalidationPattern {
  pattern: string;
  levels?: CacheLevel[];
}
