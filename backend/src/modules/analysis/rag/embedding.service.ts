/**
 * Serviço de geração de embeddings com cache Redis
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OllamaService } from '../ollama/ollama.service';
import { createHash } from 'crypto';
import Redis from 'ioredis';

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);
  private readonly redis: Redis;
  private readonly cacheEnabled: boolean;
  private readonly cacheTtl: number;
  private readonly embeddingModel: string;

  constructor(
    private configService: ConfigService,
    private ollamaService: OllamaService,
  ) {
    this.cacheEnabled = this.configService.get('EMBEDDING_CACHE_ENABLED', 'true') === 'true';
    this.cacheTtl = this.configService.get('EMBEDDING_CACHE_TTL', 86400); // 24 horas
    this.embeddingModel = this.configService.get('EMBEDDING_MODEL', 'nomic-embed-text');

    if (this.cacheEnabled) {
      this.redis = new Redis({
        host: this.configService.get('REDIS_HOST', 'localhost'),
        port: this.configService.get('REDIS_PORT', 6379),
        password: this.configService.get('REDIS_PASSWORD'),
        keyPrefix: 'embedding:',
      });

      this.logger.log('Embedding cache enabled (Redis)');
    }
  }

  /**
   * Gera embedding com cache
   */
  async generateEmbedding(text: string): Promise<number[]> {
    // Normalizar texto
    const normalizedText = this.normalizeText(text);

    // Verificar cache
    if (this.cacheEnabled) {
      const cached = await this.getFromCache(normalizedText);
      if (cached) {
        this.logger.debug('Embedding cache hit');
        return cached;
      }
    }

    // Gerar embedding
    const startTime = Date.now();
    const embedding = await this.ollamaService.generateEmbedding(
      normalizedText,
      this.embeddingModel,
    );

    const generationTime = Date.now() - startTime;
    this.logger.debug(`Embedding generated in ${generationTime}ms (${embedding.length}D)`);

    // Salvar em cache
    if (this.cacheEnabled) {
      await this.saveToCache(normalizedText, embedding);
    }

    return embedding;
  }

  /**
   * Gera embeddings em lote de forma eficiente
   */
  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];

    // Verificar cache primeiro
    const uncachedTexts: string[] = [];
    const uncachedIndices: number[] = [];

    if (this.cacheEnabled) {
      for (let i = 0; i < texts.length; i++) {
        const normalized = this.normalizeText(texts[i]);
        const cached = await this.getFromCache(normalized);

        if (cached) {
          embeddings[i] = cached;
        } else {
          uncachedTexts.push(normalized);
          uncachedIndices.push(i);
        }
      }

      this.logger.log(
        `Batch embeddings: ${texts.length - uncachedTexts.length}/${texts.length} from cache`,
      );
    } else {
      uncachedTexts.push(...texts.map(t => this.normalizeText(t)));
      uncachedIndices.push(...texts.map((_, i) => i));
    }

    // Gerar embeddings não-cacheados em batches
    if (uncachedTexts.length > 0) {
      const batchSize = 10;
      const startTime = Date.now();

      for (let i = 0; i < uncachedTexts.length; i += batchSize) {
        const batch = uncachedTexts.slice(i, i + batchSize);
        const batchIndices = uncachedIndices.slice(i, i + batchSize);

        const batchEmbeddings = await Promise.all(
          batch.map(text => this.ollamaService.generateEmbedding(text, this.embeddingModel)),
        );

        // Inserir nos índices corretos
        for (let j = 0; j < batchEmbeddings.length; j++) {
          const originalIndex = batchIndices[j];
          embeddings[originalIndex] = batchEmbeddings[j];

          // Salvar em cache
          if (this.cacheEnabled) {
            await this.saveToCache(batch[j], batchEmbeddings[j]);
          }
        }
      }

      const totalTime = Date.now() - startTime;
      this.logger.log(`Generated ${uncachedTexts.length} embeddings in ${totalTime}ms`);
    }

    return embeddings;
  }

  /**
   * Normaliza texto antes de gerar embedding
   */
  private normalizeText(text: string): string {
    return text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ') // Múltiplos espaços -> 1 espaço
      .slice(0, 8000); // Limitar tamanho (embeddings têm limite)
  }

  /**
   * Gera chave de cache
   */
  private getCacheKey(text: string): string {
    // Hash MD5 do texto para usar como chave
    const hash = createHash('md5').update(text).digest('hex');
    return `${this.embeddingModel}:${hash}`;
  }

  /**
   * Busca embedding no cache
   */
  private async getFromCache(text: string): Promise<number[] | null> {
    if (!this.cacheEnabled) return null;

    try {
      const key = this.getCacheKey(text);
      const cached = await this.redis.get(key);

      if (cached) {
        return JSON.parse(cached);
      }

      return null;
    } catch (error) {
      this.logger.warn(`Cache read error: ${error.message}`);
      return null;
    }
  }

  /**
   * Salva embedding no cache
   */
  private async saveToCache(text: string, embedding: number[]): Promise<void> {
    if (!this.cacheEnabled) return;

    try {
      const key = this.getCacheKey(text);
      await this.redis.setex(key, this.cacheTtl, JSON.stringify(embedding));
    } catch (error) {
      this.logger.warn(`Cache write error: ${error.message}`);
    }
  }

  /**
   * Limpa cache de embeddings
   */
  async clearCache(): Promise<void> {
    if (!this.cacheEnabled) return;

    try {
      const keys = await this.redis.keys('*');
      if (keys.length > 0) {
        await this.redis.del(...keys);
        this.logger.log(`Cleared ${keys.length} embeddings from cache`);
      }
    } catch (error) {
      this.logger.error(`Failed to clear cache: ${error.message}`);
    }
  }

  /**
   * Estatísticas do cache
   */
  async getCacheStats(): Promise<{ keys: number; memory: string }> {
    if (!this.cacheEnabled) {
      return { keys: 0, memory: '0B' };
    }

    try {
      const keys = await this.redis.keys('*');
      const info = await this.redis.info('memory');

      // Parse memory info
      const memMatch = info.match(/used_memory_human:([^\r\n]+)/);
      const memory = memMatch ? memMatch[1] : '0B';

      return {
        keys: keys.length,
        memory,
      };
    } catch (error) {
      this.logger.error(`Failed to get cache stats: ${error.message}`);
      return { keys: 0, memory: '0B' };
    }
  }

  /**
   * Cleanup ao desligar
   */
  async onModuleDestroy() {
    if (this.redis) {
      await this.redis.quit();
      this.logger.log('Redis connection closed');
    }
  }
}
