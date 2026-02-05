/**
 * Serviço de Vector Store (Qdrant)
 */

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QdrantClient } from '@qdrant/js-client-rest';
import {
  IVectorSearchParams,
  IVectorSearchResult,
  IQdrantPoint,
  IQdrantCollectionConfig,
} from '../interfaces/rag.interface';

@Injectable()
export class VectorStoreService implements OnModuleInit {
  private readonly logger = new Logger(VectorStoreService.name);
  private client: QdrantClient;
  private readonly qdrantUrl: string;
  private readonly collections: string[];

  constructor(private configService: ConfigService) {
    this.qdrantUrl = this.configService.get('QDRANT_URL', 'http://localhost:6333');
    this.collections = ['biomechanics_knowledge', 'exercise_library'];
  }

  async onModuleInit() {
    try {
      this.client = new QdrantClient({ url: this.qdrantUrl });

      // Verificar conexão
      const collections = await this.client.getCollections();
      this.logger.log(
        `Connected to Qdrant at ${this.qdrantUrl} (${collections.collections.length} collections)`,
      );

      // Garantir que coleções necessárias existam
      await this.ensureCollections();
    } catch (error) {
      this.logger.error(`Failed to connect to Qdrant: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Garante que coleções necessárias existam
   */
  async ensureCollections(): Promise<void> {
    for (const collectionName of this.collections) {
      const exists = await this.collectionExists(collectionName);

      if (!exists) {
        await this.createCollection(collectionName);
      } else {
        this.logger.log(`Collection '${collectionName}' already exists`);
      }
    }
  }

  /**
   * Verifica se coleção existe
   */
  async collectionExists(name: string): Promise<boolean> {
    try {
      await this.client.getCollection(name);
      return true;
    } catch (error) {
      if (error.status === 404) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Cria nova coleção com configuração otimizada
   */
  async createCollection(name: string): Promise<void> {
    const config: IQdrantCollectionConfig = {
      vectors: {
        size: 768, // nomic-embed-text dimension
        distance: 'Cosine',
      },
      optimizers_config: {
        default_segment_number: 2,
      },
      replication_factor: 1,
    };

    await this.client.createCollection(name, config);

    // Criar índices para filtros otimizados
    await this.createPayloadIndices(name);

    this.logger.log(`Created collection: ${name}`);
  }

  /**
   * Cria índices para payload (filtros)
   */
  private async createPayloadIndices(collectionName: string): Promise<void> {
    const indices = [
      { field: 'metadata.deviation_type', type: 'keyword' },
      { field: 'metadata.exercise_category', type: 'keyword' },
      { field: 'metadata.evidence_level', type: 'keyword' },
      { field: 'metadata.year', type: 'integer' },
      { field: 'metadata.doi', type: 'keyword' },
    ];

    for (const index of indices) {
      try {
        await this.client.createPayloadIndex(collectionName, {
          field_name: index.field,
          field_schema: index.type as any,
        });

        this.logger.debug(`Created index on ${collectionName}.${index.field}`);
      } catch (error) {
        // Índice pode já existir
        this.logger.debug(`Index ${index.field} may already exist: ${error.message}`);
      }
    }
  }

  /**
   * Busca vetorial com filtros
   */
  async search(params: IVectorSearchParams): Promise<IVectorSearchResult[]> {
    try {
      const results = await this.client.search(params.collectionName, {
        vector: params.queryVector,
        limit: params.limit,
        filter: this.buildFilter(params.filter),
        with_payload: true,
        with_vector: false,
        score_threshold: params.scoreThreshold,
      });

      this.logger.debug(
        `Vector search returned ${results.length} results for ${params.collectionName}`,
      );

      return results.map((r) => ({
        id: r.id as string,
        score: r.score,
        payload: r.payload as any,
      }));
    } catch (error) {
      this.logger.error(`Vector search failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Constrói filtro Qdrant a partir de parâmetros
   */
  private buildFilter(filter: any): any {
    if (!filter) return undefined;

    const conditions = [];

    // Filtro por deviation_type
    if (filter.deviation_type) {
      if (Array.isArray(filter.deviation_type)) {
        conditions.push({
          key: 'metadata.deviation_type',
          match: { any: filter.deviation_type },
        });
      } else {
        conditions.push({
          key: 'metadata.deviation_type',
          match: { value: filter.deviation_type },
        });
      }
    }

    // Filtro por exercise_category
    if (filter.exercise_category) {
      if (Array.isArray(filter.exercise_category)) {
        conditions.push({
          key: 'metadata.exercise_category',
          match: { any: filter.exercise_category },
        });
      } else {
        conditions.push({
          key: 'metadata.exercise_category',
          match: { value: filter.exercise_category },
        });
      }
    }

    // Filtro por evidence_level
    if (filter.evidence_level) {
      if (Array.isArray(filter.evidence_level)) {
        conditions.push({
          key: 'metadata.evidence_level',
          match: { any: filter.evidence_level },
        });
      } else {
        conditions.push({
          key: 'metadata.evidence_level',
          match: { value: filter.evidence_level },
        });
      }
    }

    // Filtro por ano
    if (filter.year) {
      if (filter.year.gte !== undefined) {
        conditions.push({
          key: 'metadata.year',
          range: { gte: filter.year.gte },
        });
      }
      if (filter.year.lte !== undefined) {
        conditions.push({
          key: 'metadata.year',
          range: { lte: filter.year.lte },
        });
      }
    }

    if (conditions.length === 0) return undefined;

    return {
      must: conditions,
    };
  }

  /**
   * Insere ou atualiza pontos no vector store
   */
  async upsert(collectionName: string, points: IQdrantPoint[]): Promise<void> {
    try {
      await this.client.upsert(collectionName, {
        wait: true,
        points: points as any,
      });

      this.logger.log(`Upserted ${points.length} points to ${collectionName}`);
    } catch (error) {
      this.logger.error(`Upsert failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Deleta pontos por IDs
   */
  async deletePoints(collectionName: string, pointIds: string[]): Promise<void> {
    try {
      await this.client.delete(collectionName, {
        wait: true,
        points: pointIds as any,
      });

      this.logger.log(`Deleted ${pointIds.length} points from ${collectionName}`);
    } catch (error) {
      this.logger.error(`Delete failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Deleta coleção
   */
  async deleteCollection(collectionName: string): Promise<void> {
    try {
      await this.client.deleteCollection(collectionName);
      this.logger.log(`Deleted collection: ${collectionName}`);
    } catch (error) {
      this.logger.error(`Failed to delete collection: ${error.message}`);
      throw error;
    }
  }

  /**
   * Conta pontos em coleção
   */
  async countPoints(collectionName: string): Promise<number> {
    try {
      const info = await this.client.getCollection(collectionName);
      return info.points_count || 0;
    } catch (error) {
      this.logger.error(`Failed to count points: ${error.message}`);
      return 0;
    }
  }

  /**
   * Obtém informações da coleção
   */
  async getCollectionInfo(collectionName: string): Promise<any> {
    try {
      const info = await this.client.getCollection(collectionName);
      return {
        name: collectionName,
        points_count: info.points_count,
        vectors_count: info.vectors_count,
        indexed_vectors_count: info.indexed_vectors_count,
        status: info.status,
      };
    } catch (error) {
      this.logger.error(`Failed to get collection info: ${error.message}`);
      return null;
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.getCollections();
      return true;
    } catch (error) {
      this.logger.error(`Qdrant health check failed: ${error.message}`);
      return false;
    }
  }
}
