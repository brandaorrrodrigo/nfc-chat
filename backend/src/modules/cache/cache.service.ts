/**
 * Cache Service
 *
 * Gerencia cache Redis em 3 níveis (L1, L2, L3)
 */

import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { CACHE_CONFIG } from '../../workers/queue.config';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.redis.on('connect', () => {
      this.logger.log('Redis connected successfully');
    });

    this.redis.on('error', (error) => {
      this.logger.error(`Redis error: ${error.message}`);
    });
  }

  /**
   * Get valor do cache
   */
  async get(key: string): Promise<any | null> {
    try {
      const cached = await this.redis.get(key);
      if (!cached) {
        this.logger.debug(`Cache miss: ${key}`);
        return null;
      }

      this.logger.debug(`Cache hit: ${key}`);
      return JSON.parse(cached);
    } catch (error) {
      this.logger.error(`Cache get error for key ${key}: ${error.message}`);
      return null;
    }
  }

  /**
   * Set valor no cache
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);

      if (ttl) {
        await this.redis.setex(key, ttl, serialized);
      } else {
        await this.redis.set(key, serialized);
      }

      this.logger.debug(`Cache set: ${key} (TTL: ${ttl || 'infinite'}s)`);
    } catch (error) {
      this.logger.error(`Cache set error for key ${key}: ${error.message}`);
    }
  }

  /**
   * Delete do cache
   */
  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
      this.logger.debug(`Cache delete: ${key}`);
    } catch (error) {
      this.logger.error(`Cache delete error for key ${key}: ${error.message}`);
    }
  }

  /**
   * Cache L1: Análise completa
   */
  async getCompleteAnalysis(videoPath: string, userId: string, exerciseId: string): Promise<any | null> {
    const key = `${CACHE_CONFIG.L1.prefix}${videoPath}:${userId}:${exerciseId}`;
    return this.get(key);
  }

  async setCompleteAnalysis(
    videoPath: string,
    userId: string,
    exerciseId: string,
    data: any,
  ): Promise<void> {
    const key = `${CACHE_CONFIG.L1.prefix}${videoPath}:${userId}:${exerciseId}`;
    await this.set(key, data, CACHE_CONFIG.L1.ttl);
  }

  /**
   * Cache L2: Gold Standard
   */
  async getGoldStandard(exerciseId: string): Promise<any | null> {
    const key = `${CACHE_CONFIG.L2.prefix}${exerciseId}`;
    return this.get(key);
  }

  async setGoldStandard(exerciseId: string, data: any): Promise<void> {
    const key = `${CACHE_CONFIG.L2.prefix}${exerciseId}`;
    await this.set(key, data, CACHE_CONFIG.L2.ttl);
  }

  /**
   * Cache L3: RAG Context
   */
  async getRagContext(deviationType: string, severity: string): Promise<any | null> {
    const key = `${CACHE_CONFIG.L3.prefix}${deviationType}:${severity}`;
    return this.get(key);
  }

  async setRagContext(deviationType: string, severity: string, data: any): Promise<void> {
    const key = `${CACHE_CONFIG.L3.prefix}${deviationType}:${severity}`;
    await this.set(key, data, CACHE_CONFIG.L3.ttl);
  }

  /**
   * Invalidar cache por padrão
   */
  async invalidatePattern(pattern: string): Promise<number> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length === 0) return 0;

      await this.redis.del(...keys);
      this.logger.log(`Invalidated ${keys.length} cache keys matching ${pattern}`);
      return keys.length;
    } catch (error) {
      this.logger.error(`Cache invalidate error for pattern ${pattern}: ${error.message}`);
      return 0;
    }
  }

  /**
   * Estatísticas do cache
   */
  async getStats(): Promise<{
    keys: number;
    memoryUsed: string;
    hitRate: number;
  }> {
    try {
      const info = await this.redis.info('stats');
      const memoryInfo = await this.redis.info('memory');

      // Parse info
      const statsLines = info.split('\r\n');
      const keyspaceHits = parseInt(
        statsLines.find((l) => l.startsWith('keyspace_hits:'))?.split(':')[1] || '0',
      );
      const keyspaceMisses = parseInt(
        statsLines.find((l) => l.startsWith('keyspace_misses:'))?.split(':')[1] || '0',
      );

      const hitRate =
        keyspaceHits + keyspaceMisses > 0
          ? (keyspaceHits / (keyspaceHits + keyspaceMisses)) * 100
          : 0;

      const memoryLines = memoryInfo.split('\r\n');
      const memoryUsed =
        memoryLines.find((l) => l.startsWith('used_memory_human:'))?.split(':')[1] || 'unknown';

      const dbSize = await this.redis.dbsize();

      return {
        keys: dbSize,
        memoryUsed,
        hitRate: Math.round(hitRate * 100) / 100,
      };
    } catch (error) {
      this.logger.error(`Error getting cache stats: ${error.message}`);
      return {
        keys: 0,
        memoryUsed: 'unknown',
        hitRate: 0,
      };
    }
  }

  /**
   * Cleanup ao destruir o service
   */
  async onModuleDestroy() {
    await this.redis.quit();
  }
}
