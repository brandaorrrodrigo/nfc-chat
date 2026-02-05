/**
 * Serviço RAG (Retrieval Augmented Generation)
 * Orquestra busca de contexto científico relevante
 */

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { VectorStoreService } from './vector-store.service';
import { EmbeddingService } from './embedding.service';
import { RagSearchParamsDto, RagSearchResultDto, ScientificSourceDto } from '../dto/deep-analysis.dto';
import { IScientificContext, DeviationType, ExerciseCategory } from '../interfaces/rag.interface';

@Injectable()
export class RagService implements OnModuleInit {
  private readonly logger = new Logger(RagService.name);

  constructor(
    private vectorStore: VectorStoreService,
    private embeddingService: EmbeddingService,
  ) {}

  async onModuleInit() {
    // Verificar se coleções existem
    await this.vectorStore.ensureCollections();

    // Log de status
    const stats = await this.vectorStore.getCollectionInfo('biomechanics_knowledge');
    this.logger.log(`RAG initialized - ${stats?.points_count || 0} knowledge chunks available`);
  }

  /**
   * Busca contexto científico relevante para um desvio específico
   */
  async searchContext(params: RagSearchParamsDto): Promise<RagSearchResultDto> {
    try {
      // 1. Construir query otimizada
      const query = this.buildQuery(params);

      this.logger.debug(`RAG query for ${params.deviationType}: "${query}"`);

      // 2. Gerar embedding da query
      const queryEmbedding = await this.embeddingService.generateEmbedding(query);

      // 3. Buscar no vector store com filtros
      const searchResults = await this.vectorStore.search({
        collectionName: 'biomechanics_knowledge',
        queryVector: queryEmbedding,
        limit: params.topK,
        filter: {
          deviation_type: params.deviationType as DeviationType,
          exercise_category: this.getExerciseCategory(params.exerciseId),
          evidence_level: ['meta-analysis', 'systematic-review', 'rct'],
          year: {
            gte: 2010, // Estudos a partir de 2010
          },
        },
        scoreThreshold: 0.5, // Relevância mínima
      });

      // 4. Processar resultados
      const chunks = searchResults.map((r) => ({
        text: r.payload.text,
        metadata: r.payload.metadata,
        score: r.score,
      }));

      // 5. Extrair fontes únicas
      const sources = this.extractSources(searchResults);

      this.logger.log(
        `RAG found ${chunks.length} chunks from ${sources.length} sources for ${params.deviationType}`,
      );

      return {
        success: true,
        sources,
        chunks,
        scores: searchResults.map((r) => r.score),
      };
    } catch (error) {
      this.logger.error(`RAG search failed: ${error.message}`, error.stack);
      return {
        success: false,
        sources: [],
        chunks: [],
        scores: [],
      };
    }
  }

  /**
   * Busca contexto para múltiplos desvios em paralelo
   */
  async searchMultipleDeviations(
    deviations: Array<{ type: string; severity: string }>,
    exerciseId: string,
    topKPerDeviation: number = 3,
  ): Promise<IScientificContext> {
    const searchPromises = deviations.map((deviation) =>
      this.searchContext({
        deviationType: deviation.type,
        exerciseId,
        severity: deviation.severity,
        topK: topKPerDeviation,
      }),
    );

    const results = await Promise.all(searchPromises);

    return this.consolidateResults(results);
  }

  /**
   * Consolida resultados de múltiplas buscas
   */
  private consolidateResults(results: RagSearchResultDto[]): IScientificContext {
    const allSources: ScientificSourceDto[] = [];
    const allChunks: any[] = [];
    const allScores: number[] = [];

    for (const result of results) {
      if (result.success) {
        allSources.push(...result.sources);
        allChunks.push(...result.chunks);
        allScores.push(...result.scores);
      }
    }

    // Remover fontes duplicadas
    const uniqueSources = this.deduplicateSources(allSources);

    // Ordenar por relevância
    uniqueSources.sort((a, b) => b.relevance - a.relevance);

    const avgRelevance = allScores.length > 0
      ? allScores.reduce((sum, s) => sum + s, 0) / allScores.length
      : 0;

    return {
      sources: uniqueSources,
      chunks: allChunks,
      totalChunks: allChunks.length,
      relevanceScores: allScores,
      averageRelevance: avgRelevance,
    };
  }

  /**
   * Constrói query otimizada para busca
   */
  private buildQuery(params: RagSearchParamsDto): string {
    // Templates de query específicos por tipo de desvio
    const queryTemplates: Record<string, string> = {
      knee_valgus:
        'dynamic knee valgus correction treatment exercises hip abductor strengthening neuromuscular control',
      butt_wink:
        'lumbar flexion pelvic posterior tilt squat correction hip mobility ankle dorsiflexion',
      forward_lean:
        'excessive trunk lean forward squat correction ankle mobility core strength',
      heel_rise:
        'heel rise ankle dorsiflexion limitation calf flexibility soleus gastrocnemius stretch',
      asymmetric_loading:
        'bilateral asymmetry unilateral strength imbalance correction single leg training',
      excessive_spinal_flexion:
        'spinal flexion deadlift correction neutral spine core stability',
      shoulder_impingement:
        'shoulder impingement overhead press scapular dyskinesis rotator cuff',
      hip_shift:
        'hip shift lateral deviation squat correction hip mobility gluteal activation',
    };

    const baseQuery = queryTemplates[params.deviationType] ||
      `${params.deviationType} biomechanics correction treatment`;

    // Adicionar contexto do exercício
    return `${baseQuery} ${params.exerciseId}`;
  }

  /**
   * Extrai informações de fontes científicas dos resultados
   */
  private extractSources(results: any[]): ScientificSourceDto[] {
    const sourcesMap = new Map<string, ScientificSourceDto>();

    for (const result of results) {
      const metadata = result.payload.metadata;
      const sourceKey = `${metadata.doi}`;

      if (!sourcesMap.has(sourceKey)) {
        sourcesMap.set(sourceKey, {
          title: metadata.title,
          authors: metadata.authors,
          year: metadata.year,
          journal: metadata.journal,
          doi: metadata.doi,
          evidence_level: metadata.evidence_level,
          excerpt: result.payload.text.substring(0, 200) + '...',
          relevance: result.score,
        });
      } else {
        // Se já existe, atualizar relevância se for maior
        const existing = sourcesMap.get(sourceKey);
        if (result.score > existing.relevance) {
          existing.relevance = result.score;
        }
      }
    }

    return Array.from(sourcesMap.values()).sort((a, b) => b.relevance - a.relevance);
  }

  /**
   * Remove fontes duplicadas
   */
  private deduplicateSources(sources: ScientificSourceDto[]): ScientificSourceDto[] {
    const seen = new Set<string>();
    return sources.filter((source) => {
      const key = source.doi;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Determina categoria do exercício
   */
  private getExerciseCategory(exerciseId: string): ExerciseCategory {
    const categories: Record<string, ExerciseCategory> = {
      squat: 'lower_body_compound',
      'back-squat': 'lower_body_compound',
      'front-squat': 'lower_body_compound',
      'goblet-squat': 'lower_body_compound',
      deadlift: 'posterior_chain',
      'romanian-deadlift': 'posterior_chain',
      'bench-press': 'upper_body_push',
      'overhead-press': 'upper_body_push',
      'military-press': 'upper_body_push',
      row: 'upper_body_pull',
      'barbell-row': 'upper_body_pull',
      'pull-up': 'upper_body_pull',
      'clean': 'olympic_lift',
      'snatch': 'olympic_lift',
      plank: 'core',
    };

    // Buscar match mais próximo
    for (const [key, category] of Object.entries(categories)) {
      if (exerciseId.toLowerCase().includes(key)) {
        return category;
      }
    }

    // Default: lower body compound (mais comum)
    return 'lower_body_compound';
  }

  /**
   * Busca por DOI específico
   */
  async searchByDoi(doi: string): Promise<RagSearchResultDto> {
    try {
      // Busca simples sem filtros complexos
      const dummyEmbedding = new Array(768).fill(0);

      const results = await this.vectorStore.search({
        collectionName: 'biomechanics_knowledge',
        queryVector: dummyEmbedding,
        limit: 100,
        filter: {
          doi,
        },
      });

      const chunks = results.map((r) => ({
        text: r.payload.text,
        metadata: r.payload.metadata,
        score: 1.0,
      }));

      const sources = this.extractSources(results);

      return {
        success: true,
        sources,
        chunks,
        scores: results.map(() => 1.0),
      };
    } catch (error) {
      this.logger.error(`Failed to search by DOI ${doi}: ${error.message}`);
      return {
        success: false,
        sources: [],
        chunks: [],
        scores: [],
      };
    }
  }

  /**
   * Estatísticas do RAG
   */
  async getStats(): Promise<{
    totalChunks: number;
    collections: string[];
  }> {
    try {
      const info = await this.vectorStore.getCollectionInfo('biomechanics_knowledge');

      return {
        totalChunks: info?.points_count || 0,
        collections: ['biomechanics_knowledge', 'exercise_library'],
      };
    } catch (error) {
      this.logger.error(`Failed to get RAG stats: ${error.message}`);
      return {
        totalChunks: 0,
        collections: [],
      };
    }
  }
}
