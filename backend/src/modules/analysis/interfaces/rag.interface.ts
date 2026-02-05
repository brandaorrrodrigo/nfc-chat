/**
 * Interfaces para sistema RAG
 */

/**
 * Documento científico completo
 */
export interface IScientificDocument {
  title: string;
  authors: string;
  year: number;
  journal: string;
  doi: string;
  content: string;
  abstract?: string;
  keywords?: string[];
  metadata: IDocumentMetadata;
}

/**
 * Metadados do documento
 */
export interface IDocumentMetadata {
  evidence_level: EvidenceLevel;
  deviation_types: DeviationType[];
  exercise_categories: ExerciseCategory[];
  study_type?: StudyType;
  sample_size?: number;
  population?: string;
}

/**
 * Níveis de evidência científica
 */
export type EvidenceLevel =
  | 'meta-analysis'
  | 'systematic-review'
  | 'rct'
  | 'cohort'
  | 'case-control'
  | 'case-series'
  | 'expert-opinion';

/**
 * Tipos de desvio biomecânico
 */
export type DeviationType =
  | 'knee_valgus'
  | 'butt_wink'
  | 'forward_lean'
  | 'heel_rise'
  | 'asymmetric_loading'
  | 'excessive_spinal_flexion'
  | 'shoulder_impingement'
  | 'hip_shift';

/**
 * Categorias de exercício
 */
export type ExerciseCategory =
  | 'lower_body_compound'
  | 'upper_body_push'
  | 'upper_body_pull'
  | 'posterior_chain'
  | 'core'
  | 'olympic_lift';

/**
 * Tipos de estudo
 */
export type StudyType =
  | 'meta-analysis'
  | 'systematic-review'
  | 'randomized-controlled-trial'
  | 'prospective-cohort'
  | 'retrospective-cohort'
  | 'cross-sectional'
  | 'case-control'
  | 'case-report';

/**
 * Parâmetros de busca no vector store
 */
export interface IVectorSearchParams {
  collectionName: string;
  queryVector: number[];
  limit: number;
  filter?: IVectorFilter;
  scoreThreshold?: number;
}

/**
 * Filtros para busca vetorial
 */
export interface IVectorFilter {
  deviation_type?: DeviationType | DeviationType[];
  exercise_category?: ExerciseCategory | ExerciseCategory[];
  evidence_level?: EvidenceLevel | EvidenceLevel[];
  year?: {
    gte?: number;
    lte?: number;
  };
}

/**
 * Resultado de busca vetorial
 */
export interface IVectorSearchResult {
  id: string;
  score: number;
  payload: {
    text: string;
    metadata: IChunkMetadata;
  };
}

/**
 * Metadados do chunk
 */
export interface IChunkMetadata {
  title: string;
  authors: string;
  year: number;
  journal: string;
  doi: string;
  evidence_level: EvidenceLevel;
  deviation_type: DeviationType;
  exercise_category: ExerciseCategory;
  chunk_index: number;
}

/**
 * Point para Qdrant
 */
export interface IQdrantPoint {
  id: string;
  vector: number[];
  payload: {
    text: string;
    metadata: IChunkMetadata;
  };
}

/**
 * Configuração de coleção Qdrant
 */
export interface IQdrantCollectionConfig {
  vectors: {
    size: number;
    distance: 'Cosine' | 'Euclid' | 'Dot';
  };
  optimizers_config?: {
    default_segment_number?: number;
  };
  replication_factor?: number;
}

/**
 * Contexto científico consolidado
 */
export interface IScientificContext {
  sources: IScientificSource[];
  chunks: IContextChunk[];
  totalChunks: number;
  relevanceScores: number[];
  averageRelevance: number;
}

/**
 * Fonte científica simplificada
 */
export interface IScientificSource {
  title: string;
  authors: string;
  year: number;
  journal: string;
  doi: string;
  evidence_level: EvidenceLevel;
  excerpt: string;
  relevance: number;
}

/**
 * Chunk de contexto
 */
export interface IContextChunk {
  text: string;
  source: string;
  relevance: number;
  metadata: IChunkMetadata;
}

/**
 * Template de query RAG
 */
export interface IRagQueryTemplate {
  deviationType: DeviationType;
  template: string;
  keywords: string[];
}
