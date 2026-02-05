/**
 * Metrics Collector Service
 *
 * Coleta, agrega e persiste métricas do pipeline híbrido
 */

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../modules/prisma/prisma.service';
import { PipelineStage } from './error-handling.strategy';

/**
 * Métricas de um job individual
 */
export interface JobMetrics {
  jobId: string;
  videoAnalysisId?: string;
  userId: string;
  exerciseId: string;

  // Tempos por estágio (ms)
  stages: {
    extraction?: number;
    mediapipe?: number;
    quickAnalysis: number;
    decision: number;
    deepAnalysis?: number;
    protocols?: number;
    save: number;
    notification?: number;
  };

  // Total
  totalTime: number;
  startTime: Date;
  endTime: Date;

  // Cache
  cacheHits: {
    l1: boolean;
    l2: boolean;
    l3: boolean;
  };

  // Decisão
  deepAnalysisTriggered: boolean;
  decisionTriggers: string[];

  // Recursos
  framesExtracted?: number;
  framesAnalyzed: number;
  ragDocsRetrieved?: number;
  llmTokensUsed?: number;

  // Resultado
  quickScore: number;
  deviationsCount: number;
  protocolsGenerated: number;

  // Erros
  errors: Array<{
    stage: PipelineStage;
    type: string;
    message: string;
    recovered: boolean;
  }>;
}

/**
 * Métricas agregadas (por período)
 */
export interface AggregatedMetrics {
  period: { start: Date; end: Date };
  totalJobs: number;
  successfulJobs: number;
  failedJobs: number;

  // Performance
  avgTotalTime: number;
  p50TotalTime: number;
  p95TotalTime: number;
  p99TotalTime: number;

  // Por estágio
  stageMetrics: {
    [key in PipelineStage]?: {
      avg: number;
      p95: number;
      count: number;
    };
  };

  // Deep analysis
  deepAnalysisRate: number; // % que rodou deep
  avgDeepAnalysisTime: number;

  // Cache
  cacheHitRates: {
    l1: number;
    l2: number;
    l3: number;
  };

  // Recursos
  avgFramesAnalyzed: number;
  totalLlmTokens: number;
  totalRagDocs: number;

  // Qualidade
  avgQuickScore: number;
  scoreDistribution: {
    EXCELENTE: number;
    BOM: number;
    REGULAR: number;
    RUIM: number;
    CRÍTICO: number;
  };

  // Desvios
  mostCommonDeviations: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;

  // Erros
  errorRate: number;
  errorsByType: Record<string, number>;
  recoveryRate: number; // % de erros recuperados
}

@Injectable()
export class MetricsCollectorService {
  private readonly logger = new Logger(MetricsCollectorService.name);

  // Buffer em memória para métricas (flushed periodicamente)
  private metricsBuffer: JobMetrics[] = [];
  private readonly BUFFER_SIZE = 100;
  private readonly FLUSH_INTERVAL = 60000; // 1 minuto

  constructor(private prisma: PrismaService) {
    // Auto-flush periódico
    setInterval(() => this.flushMetrics(), this.FLUSH_INTERVAL);
  }

  /**
   * Registra métricas de um job completo
   */
  async recordJobMetrics(metrics: JobMetrics): Promise<void> {
    this.logger.debug(`Recording metrics for job ${metrics.jobId}`);

    // Adicionar ao buffer
    this.metricsBuffer.push(metrics);

    // Flush se buffer cheio
    if (this.metricsBuffer.length >= this.BUFFER_SIZE) {
      await this.flushMetrics();
    }
  }

  /**
   * Flush métricas do buffer para o banco
   */
  private async flushMetrics(): Promise<void> {
    if (this.metricsBuffer.length === 0) {
      return;
    }

    this.logger.log(`Flushing ${this.metricsBuffer.length} metrics to database`);

    try {
      // Batch insert
      await this.prisma.analysisMetrics.createMany({
        data: this.metricsBuffer.map((m) => ({
          video_analysis_id: m.videoAnalysisId!,
          extraction_time_ms: m.stages.extraction,
          mediapipe_time_ms: m.stages.mediapipe,
          quick_analysis_time_ms: m.stages.quickAnalysis,
          deep_analysis_time_ms: m.stages.deepAnalysis,
          protocols_time_ms: m.stages.protocols,
          total_time_ms: m.totalTime,
          cache_hit_l1: m.cacheHits.l1,
          cache_hit_l2: m.cacheHits.l2,
          cache_hit_l3: m.cacheHits.l3,
          deep_analysis_triggered: m.deepAnalysisTriggered,
          decision_triggers: m.decisionTriggers,
          frames_extracted: m.framesExtracted,
          frames_analyzed: m.framesAnalyzed,
          rag_docs_retrieved: m.ragDocsRetrieved,
          llm_tokens_used: m.llmTokensUsed,
        })),
        skipDuplicates: true,
      });

      this.logger.log(`Successfully flushed ${this.metricsBuffer.length} metrics`);

      // Limpar buffer
      this.metricsBuffer = [];
    } catch (error) {
      this.logger.error(`Failed to flush metrics: ${error.message}`);
      // Manter no buffer para próxima tentativa
    }
  }

  /**
   * Gera métricas agregadas para um período
   */
  async getAggregatedMetrics(startDate: Date, endDate: Date): Promise<AggregatedMetrics> {
    this.logger.log(`Generating aggregated metrics from ${startDate} to ${endDate}`);

    // Buscar todas as métricas do período
    const metrics = await this.prisma.analysisMetrics.findMany({
      where: {
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        video_analysis: {
          include: {
            quick_result: true,
          },
        },
      },
    });

    if (metrics.length === 0) {
      return this.getEmptyMetrics(startDate, endDate);
    }

    // Análises bem-sucedidas vs falhadas
    const analyses = await this.prisma.videoAnalysis.findMany({
      where: {
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalJobs = analyses.length;
    const successfulJobs = analyses.filter((a) => a.status === 'completed').length;
    const failedJobs = analyses.filter((a) => a.status === 'failed').length;

    // Performance
    const totalTimes = metrics.map((m) => m.total_time_ms);
    const avgTotalTime = this.average(totalTimes);
    const p50TotalTime = this.percentile(totalTimes, 50);
    const p95TotalTime = this.percentile(totalTimes, 95);
    const p99TotalTime = this.percentile(totalTimes, 99);

    // Deep analysis rate
    const deepCount = metrics.filter((m) => m.deep_analysis_triggered).length;
    const deepAnalysisRate = (deepCount / metrics.length) * 100;
    const deepTimes = metrics
      .filter((m) => m.deep_analysis_time_ms)
      .map((m) => m.deep_analysis_time_ms!);
    const avgDeepAnalysisTime = deepTimes.length > 0 ? this.average(deepTimes) : 0;

    // Cache hit rates
    const cacheHitRates = {
      l1: (metrics.filter((m) => m.cache_hit_l1).length / metrics.length) * 100,
      l2: (metrics.filter((m) => m.cache_hit_l2).length / metrics.length) * 100,
      l3: (metrics.filter((m) => m.cache_hit_l3).length / metrics.length) * 100,
    };

    // Recursos
    const avgFramesAnalyzed = this.average(metrics.map((m) => m.frames_analyzed));
    const totalLlmTokens = metrics.reduce((sum, m) => sum + (m.llm_tokens_used || 0), 0);
    const totalRagDocs = metrics.reduce((sum, m) => sum + (m.rag_docs_retrieved || 0), 0);

    // Qualidade
    const quickResults = metrics.map((m) => m.video_analysis.quick_result).filter(Boolean);
    const avgQuickScore = this.average(quickResults.map((r) => r!.overall_score));

    const scoreDistribution = {
      EXCELENTE: quickResults.filter((r) => r!.classification === 'EXCELENTE').length,
      BOM: quickResults.filter((r) => r!.classification === 'BOM').length,
      REGULAR: quickResults.filter((r) => r!.classification === 'REGULAR').length,
      RUIM: quickResults.filter((r) => r!.classification === 'RUIM').length,
      CRÍTICO: quickResults.filter((r) => r!.classification === 'CRÍTICO').length,
    };

    // Desvios mais comuns
    const allDeviations: string[] = [];
    for (const qr of quickResults) {
      const deviations = JSON.parse(qr!.deviations_detected as string);
      allDeviations.push(...deviations.map((d: any) => d.type));
    }

    const deviationCounts = allDeviations.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonDeviations = Object.entries(deviationCounts)
      .map(([type, count]) => ({
        type,
        count,
        percentage: (count / allDeviations.length) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Estágios
    const stageMetrics = {
      [PipelineStage.EXTRACTION]: this.getStageStats(
        metrics.map((m) => m.extraction_time_ms).filter(Boolean) as number[],
      ),
      [PipelineStage.MEDIAPIPE]: this.getStageStats(
        metrics.map((m) => m.mediapipe_time_ms).filter(Boolean) as number[],
      ),
      [PipelineStage.QUICK_ANALYSIS]: this.getStageStats(
        metrics.map((m) => m.quick_analysis_time_ms),
      ),
      [PipelineStage.DEEP_ANALYSIS]: this.getStageStats(
        metrics.map((m) => m.deep_analysis_time_ms).filter(Boolean) as number[],
      ),
      [PipelineStage.PROTOCOLS]: this.getStageStats(
        metrics.map((m) => m.protocols_time_ms).filter(Boolean) as number[],
      ),
    };

    return {
      period: { start: startDate, end: endDate },
      totalJobs,
      successfulJobs,
      failedJobs,
      avgTotalTime,
      p50TotalTime,
      p95TotalTime,
      p99TotalTime,
      stageMetrics,
      deepAnalysisRate,
      avgDeepAnalysisTime,
      cacheHitRates,
      avgFramesAnalyzed,
      totalLlmTokens,
      totalRagDocs,
      avgQuickScore,
      scoreDistribution,
      mostCommonDeviations,
      errorRate: (failedJobs / totalJobs) * 100,
      errorsByType: {}, // TODO: Implementar tracking de erros
      recoveryRate: 0, // TODO: Implementar tracking de recovery
    };
  }

  /**
   * Estatísticas de um estágio
   */
  private getStageStats(times: number[]): { avg: number; p95: number; count: number } {
    if (times.length === 0) {
      return { avg: 0, p95: 0, count: 0 };
    }

    return {
      avg: this.average(times),
      p95: this.percentile(times, 95),
      count: times.length,
    };
  }

  /**
   * Calcula média
   */
  private average(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
  }

  /**
   * Calcula percentil
   */
  private percentile(numbers: number[], p: number): number {
    if (numbers.length === 0) return 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  /**
   * Métricas vazias (sem dados no período)
   */
  private getEmptyMetrics(start: Date, end: Date): AggregatedMetrics {
    return {
      period: { start, end },
      totalJobs: 0,
      successfulJobs: 0,
      failedJobs: 0,
      avgTotalTime: 0,
      p50TotalTime: 0,
      p95TotalTime: 0,
      p99TotalTime: 0,
      stageMetrics: {},
      deepAnalysisRate: 0,
      avgDeepAnalysisTime: 0,
      cacheHitRates: { l1: 0, l2: 0, l3: 0 },
      avgFramesAnalyzed: 0,
      totalLlmTokens: 0,
      totalRagDocs: 0,
      avgQuickScore: 0,
      scoreDistribution: {
        EXCELENTE: 0,
        BOM: 0,
        REGULAR: 0,
        RUIM: 0,
        CRÍTICO: 0,
      },
      mostCommonDeviations: [],
      errorRate: 0,
      errorsByType: {},
      recoveryRate: 0,
    };
  }

  /**
   * Gera relatório de performance em texto
   */
  generatePerformanceReport(metrics: AggregatedMetrics): string {
    return `
╔════════════════════════════════════════════════════════════════
║ PERFORMANCE REPORT
║ Period: ${metrics.period.start.toLocaleDateString()} - ${metrics.period.end.toLocaleDateString()}
╠════════════════════════════════════════════════════════════════
║ SUMMARY
║ Total Jobs:          ${metrics.totalJobs}
║ Successful:          ${metrics.successfulJobs} (${((metrics.successfulJobs / metrics.totalJobs) * 100).toFixed(1)}%)
║ Failed:              ${metrics.failedJobs} (${metrics.errorRate.toFixed(1)}%)
╠════════════════════════════════════════════════════════════════
║ PERFORMANCE (Total Time)
║ Average:             ${(metrics.avgTotalTime / 1000).toFixed(2)}s
║ P50 (Median):        ${(metrics.p50TotalTime / 1000).toFixed(2)}s
║ P95:                 ${(metrics.p95TotalTime / 1000).toFixed(2)}s
║ P99:                 ${(metrics.p99TotalTime / 1000).toFixed(2)}s
╠════════════════════════════════════════════════════════════════
║ DEEP ANALYSIS
║ Triggered:           ${metrics.deepAnalysisRate.toFixed(1)}% of jobs
║ Avg Time:            ${(metrics.avgDeepAnalysisTime / 1000).toFixed(2)}s
╠════════════════════════════════════════════════════════════════
║ CACHE HIT RATES
║ L1 (Complete):       ${metrics.cacheHitRates.l1.toFixed(1)}%
║ L2 (Gold Std):       ${metrics.cacheHitRates.l2.toFixed(1)}%
║ L3 (RAG):            ${metrics.cacheHitRates.l3.toFixed(1)}%
╠════════════════════════════════════════════════════════════════
║ QUALITY METRICS
║ Avg Quick Score:     ${metrics.avgQuickScore.toFixed(2)}/10
║ Distribution:
║   EXCELENTE:         ${metrics.scoreDistribution.EXCELENTE}
║   BOM:               ${metrics.scoreDistribution.BOM}
║   REGULAR:           ${metrics.scoreDistribution.REGULAR}
║   RUIM:              ${metrics.scoreDistribution.RUIM}
║   CRÍTICO:           ${metrics.scoreDistribution.CRÍTICO}
╠════════════════════════════════════════════════════════════════
║ MOST COMMON DEVIATIONS
${metrics.mostCommonDeviations
  .map((d) => `║   ${d.type.padEnd(20)} ${d.count} (${d.percentage.toFixed(1)}%)`)
  .join('\n')}
╠════════════════════════════════════════════════════════════════
║ RESOURCES
║ Avg Frames:          ${metrics.avgFramesAnalyzed.toFixed(1)}
║ Total LLM Tokens:    ${metrics.totalLlmTokens.toLocaleString()}
║ Total RAG Docs:      ${metrics.totalRagDocs}
╚════════════════════════════════════════════════════════════════
    `.trim();
  }

  /**
   * Cleanup ao destruir o service (flush final)
   */
  async onModuleDestroy() {
    await this.flushMetrics();
  }
}
