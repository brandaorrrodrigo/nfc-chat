/**
 * DTOs para Deep Analysis Service
 */

import { IsString, IsNumber, IsObject, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Input para Deep Analysis
 */
export class DeepAnalysisInputDto {
  @IsObject()
  quickAnalysis: any; // QuickAnalysisResult from Prisma

  @IsString()
  exerciseId: string;

  @IsString()
  userId: string;

  @IsNumber()
  @IsOptional()
  estimatedTime?: number;
}

/**
 * Resultado de busca RAG
 */
export class RagSearchResultDto {
  success: boolean;
  sources: ScientificSourceDto[];
  chunks: RagChunkDto[];
  scores: number[];
}

/**
 * Fonte científica
 */
export class ScientificSourceDto {
  title: string;
  authors: string;
  year: number;
  journal: string;
  doi: string;
  evidence_level: string;
  excerpt: string;
  relevance: number;
}

/**
 * Chunk de documento RAG
 */
export class RagChunkDto {
  text: string;
  metadata: any;
  score: number;
}

/**
 * Parâmetros de busca RAG
 */
export class RagSearchParamsDto {
  @IsString()
  deviationType: string;

  @IsString()
  exerciseId: string;

  @IsString()
  severity: string;

  @IsNumber()
  topK: number;
}

/**
 * Output de Deep Analysis
 */
export class DeepAnalysisOutputDto {
  rag_sources_used: ScientificSourceDto[];
  llm_narrative: string;
  scientific_context: ScientificContextDto;
  processing_time_ms: number;
}

/**
 * Contexto científico consolidado
 */
export class ScientificContextDto {
  deviations_analyzed: string[];
  sources: Array<{
    title: string;
    authors: string;
    year: number;
    relevance_score: number;
  }>;
  total_chunks: number;
}

/**
 * Configuração de geração LLM
 */
export class LlmGenerationOptionsDto {
  @IsString()
  model: string;

  @IsNumber()
  @IsOptional()
  temperature?: number;

  @IsNumber()
  @IsOptional()
  top_p?: number;

  @IsNumber()
  @IsOptional()
  max_tokens?: number;
}

/**
 * Request para Ollama
 */
export class OllamaGenerateRequestDto {
  @IsString()
  model: string;

  @IsString()
  prompt: string;

  @IsObject()
  @IsOptional()
  options?: {
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
  };
}

/**
 * Response do Ollama
 */
export class OllamaGenerateResponseDto {
  text: string;
  model: string;
  created_at: string;
  done: boolean;
}
