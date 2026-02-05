/**
 * Exemplo de Integração Completa - Pipeline Híbrido
 *
 * Este arquivo demonstra como integrar todos os serviços do pipeline
 * em um controller ou service real do NestJS.
 *
 * NÃO COMPILAR: Este é apenas um exemplo educacional
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { QuickAnalysisService } from '../quick-analysis.service';
import { DecisionEngineService } from '../decision-engine.service';
import { PrismaService } from '../../prisma/prisma.service';
import { QuickAnalysisInputDto } from '../dto/quick-analysis.dto';

// ============================================================================
// EXEMPLO 1: Controller básico de análise de vídeo
// ============================================================================

/**
 * Controller para análise de vídeos
 */
@Injectable()
export class VideoAnalysisController {
  private readonly logger = new Logger(VideoAnalysisController.name);

  constructor(
    private quickAnalysis: QuickAnalysisService,
    private decisionEngine: DecisionEngineService,
    private prisma: PrismaService,
  ) {}

  /**
   * Endpoint: POST /api/video/analyze
   *
   * Executa pipeline híbrido completo:
   * 1. Análise rápida
   * 2. Decisão inteligente
   * 3. Análise profunda (se necessário)
   */
  async analyzeVideo(input: QuickAnalysisInputDto, userId: string) {
    this.logger.log(
      `Starting video analysis for user=${userId}, exercise=${input.exerciseId}`,
    );

    // 1. BUSCAR USUÁRIO
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    // 2. ANÁLISE RÁPIDA (200-500ms)
    this.logger.debug('Executing quick analysis...');
    const quickResult = await this.quickAnalysis.analyze(input);

    this.logger.log(
      `Quick analysis completed: score=${quickResult.overall_score}, similarity=${(quickResult.similarity_to_gold * 100).toFixed(1)}%`,
    );

    // 3. DECISÃO INTELIGENTE (< 10ms)
    this.logger.debug('Evaluating deep analysis decision...');
    const decision = await this.decisionEngine.shouldRunDeepAnalysis(
      quickResult as any,
      user,
    );

    this.logger.log(
      `Decision: shouldRun=${decision.shouldRun}, triggers=${decision.triggers.length}`,
    );

    // 4. RETORNAR RESULTADO RÁPIDO OU EXECUTAR ANÁLISE PROFUNDA
    if (!decision.shouldRun) {
      // Caso 4a: Análise rápida suficiente
      return {
        type: 'quick',
        quick_analysis: quickResult,
        decision: {
          reason: decision.reason,
          triggers: decision.triggers,
        },
        recommendations: this.generateQuickRecommendations(quickResult),
      };
    }

    // Caso 4b: Análise profunda necessária
    this.logger.log(
      `Executing deep analysis (estimated time: ${decision.estimatedTime}ms)...`,
    );

    // TODO: Implementar deep analysis com RAG + LLM
    // const deepResult = await this.deepAnalysisService.analyze({
    //   quickAnalysis: quickResult,
    //   exerciseId: input.exerciseId,
    //   userId,
    //   deviations: quickResult.deviations_detected
    // });

    return {
      type: 'deep',
      quick_analysis: quickResult,
      // deep_analysis: deepResult,
      decision: {
        reason: decision.reason,
        triggers: decision.triggers,
        estimated_time: decision.estimatedTime,
      },
    };
  }

  /**
   * Gera recomendações básicas baseado na análise rápida
   */
  private generateQuickRecommendations(quickResult: any) {
    const recommendations = [];

    // Score excelente
    if (quickResult.overall_score >= 8) {
      recommendations.push({
        type: 'positive',
        message: 'Execução excelente! Continue assim.',
      });
    }

    // Score baixo
    if (quickResult.overall_score < 5) {
      recommendations.push({
        type: 'warning',
        message:
          'Execução precisa de melhorias significativas. Considere reduzir carga e focar em técnica.',
      });
    }

    // Similaridade baixa
    if (quickResult.similarity_to_gold < 0.7) {
      recommendations.push({
        type: 'info',
        message: `Seu movimento está ${((1 - quickResult.similarity_to_gold) * 100).toFixed(0)}% diferente do padrão ideal.`,
      });
    }

    // Desvios específicos
    const deviations = quickResult.deviations_detected;
    for (const dev of deviations) {
      if (dev.severity === 'severe') {
        recommendations.push({
          type: 'critical',
          message: `Desvio crítico detectado: ${dev.type}. Consulte um profissional.`,
        });
      }
    }

    return recommendations;
  }
}

// ============================================================================
// EXEMPLO 2: Service para batch processing de vídeos
// ============================================================================

/**
 * Service para processar múltiplos vídeos em lote
 * Útil para análises assíncronas ou background jobs
 */
@Injectable()
export class VideoBatchProcessorService {
  private readonly logger = new Logger(VideoBatchProcessorService.name);

  constructor(
    private quickAnalysis: QuickAnalysisService,
    private decisionEngine: DecisionEngineService,
    private prisma: PrismaService,
  ) {}

  /**
   * Processa múltiplos vídeos em paralelo com rate limiting
   */
  async processBatch(videos: QuickAnalysisInputDto[], userId: string) {
    this.logger.log(`Processing batch of ${videos.length} videos for user=${userId}`);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    const results = [];

    // Processar até 5 vídeos em paralelo
    const BATCH_SIZE = 5;
    for (let i = 0; i < videos.length; i += BATCH_SIZE) {
      const batch = videos.slice(i, i + BATCH_SIZE);

      const batchResults = await Promise.all(
        batch.map(async (video) => {
          try {
            // Quick analysis
            const quickResult = await this.quickAnalysis.analyze(video);

            // Decision
            const decision = await this.decisionEngine.shouldRunDeepAnalysis(
              quickResult as any,
              user,
            );

            return {
              video_path: video.videoPath,
              status: 'success',
              quick_result: quickResult,
              needs_deep_analysis: decision.shouldRun,
              decision_reason: decision.reason,
            };
          } catch (error) {
            this.logger.error(
              `Error processing video ${video.videoPath}: ${error.message}`,
            );
            return {
              video_path: video.videoPath,
              status: 'error',
              error: error.message,
            };
          }
        }),
      );

      results.push(...batchResults);

      // Small delay entre batches para evitar overload
      if (i + BATCH_SIZE < videos.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    this.logger.log(`Batch processing completed: ${results.length} videos`);

    return {
      total: results.length,
      successful: results.filter((r) => r.status === 'success').length,
      failed: results.filter((r) => r.status === 'error').length,
      needs_deep_analysis: results.filter((r) => r.needs_deep_analysis).length,
      results,
    };
  }

  /**
   * Prioriza vídeos para análise profunda baseado em urgência
   */
  async prioritizeDeepAnalysis(analysisIds: string[]) {
    // Buscar todas as análises rápidas
    const quickAnalyses = await this.prisma.quickAnalysisResult.findMany({
      where: { id: { in: analysisIds } },
      include: {
        video_analysis: {
          include: {
            user: true,
          },
        },
      },
    });

    // Preparar dados para priorização
    const analysesData = quickAnalyses.map((qa) => ({
      id: qa.id,
      score: qa.overall_score,
      isPremium: ['pro', 'coach'].includes(
        qa.video_analysis.user.subscription_tier,
      ),
      deviations: JSON.parse(qa.deviations_detected as string).length,
    }));

    // Priorizar usando decision engine
    const prioritizedIds = this.decisionEngine.prioritizeAnalysisQueue(
      analysesData,
    );

    this.logger.log(`Prioritized ${prioritizedIds.length} analyses for deep processing`);

    return prioritizedIds;
  }
}

// ============================================================================
// EXEMPLO 3: Service para monitoramento e métricas
// ============================================================================

/**
 * Service para coletar métricas do pipeline
 */
@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    private decisionEngine: DecisionEngineService,
    private prisma: PrismaService,
  ) {}

  /**
   * Gera relatório de decisões tomadas em período
   */
  async getDecisionReport(startDate: Date, endDate: Date) {
    // Buscar todas as análises rápidas do período
    const quickAnalyses = await this.prisma.quickAnalysisResult.findMany({
      where: {
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        video_analysis: {
          include: {
            user: true,
          },
        },
      },
    });

    // Simular decisões para cada análise
    const decisions = await Promise.all(
      quickAnalyses.map(async (qa) => {
        return this.decisionEngine.shouldRunDeepAnalysis(
          qa as any,
          qa.video_analysis.user,
        );
      }),
    );

    // Gerar relatório
    const report = this.decisionEngine.generateDecisionReport(decisions);

    return {
      period: { start: startDate, end: endDate },
      ...report,
      metrics: {
        deep_analysis_rate:
          (report.deepAnalysisExecuted / report.totalDecisions) * 100,
        avg_triggers_per_decision: report.avgTriggers,
      },
    };
  }

  /**
   * Obtém estatísticas de performance
   */
  async getPerformanceStats() {
    const quickAnalyses = await this.prisma.quickAnalysisResult.findMany({
      select: {
        processing_time_ms: true,
        overall_score: true,
        classification: true,
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 1000, // Últimas 1000 análises
    });

    const processingTimes = quickAnalyses.map((qa) => qa.processing_time_ms);
    const scores = quickAnalyses.map((qa) => qa.overall_score);

    return {
      quick_analysis: {
        count: quickAnalyses.length,
        processing_time: {
          avg: this.average(processingTimes),
          min: Math.min(...processingTimes),
          max: Math.max(...processingTimes),
          p50: this.percentile(processingTimes, 50),
          p95: this.percentile(processingTimes, 95),
          p99: this.percentile(processingTimes, 99),
        },
        scores: {
          avg: this.average(scores),
          min: Math.min(...scores),
          max: Math.max(...scores),
        },
        classifications: {
          EXCELENTE: quickAnalyses.filter((qa) => qa.classification === 'EXCELENTE')
            .length,
          BOM: quickAnalyses.filter((qa) => qa.classification === 'BOM').length,
          REGULAR: quickAnalyses.filter((qa) => qa.classification === 'REGULAR')
            .length,
          RUIM: quickAnalyses.filter((qa) => qa.classification === 'RUIM').length,
          CRÍTICO: quickAnalyses.filter((qa) => qa.classification === 'CRÍTICO')
            .length,
        },
      },
    };
  }

  private average(numbers: number[]): number {
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
  }

  private percentile(numbers: number[], p: number): number {
    const sorted = [...numbers].sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[index];
  }
}

// ============================================================================
// EXEMPLO 4: Webhook handler para análise assíncrona
// ============================================================================

/**
 * Handler para processar vídeos via webhook/queue
 */
@Injectable()
export class VideoQueueProcessor {
  private readonly logger = new Logger(VideoQueueProcessor.name);

  constructor(
    private quickAnalysis: QuickAnalysisService,
    private decisionEngine: DecisionEngineService,
    private prisma: PrismaService,
  ) {}

  /**
   * Processa job da fila
   * Integra com Bull Queue ou similar
   */
  async processVideoJob(job: {
    videoPath: string;
    exerciseId: string;
    userId: string;
    frames: any[];
  }) {
    const { videoPath, exerciseId, userId, frames } = job;

    this.logger.log(`Processing video job: ${videoPath}`);

    try {
      // 1. Quick analysis
      const quickResult = await this.quickAnalysis.analyze({
        videoPath,
        exerciseId,
        userId,
        frames,
      });

      // 2. Decision
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      const decision = await this.decisionEngine.shouldRunDeepAnalysis(
        quickResult as any,
        user!,
      );

      // 3. Se deep analysis necessária, criar novo job
      if (decision.shouldRun) {
        this.logger.log(`Enqueueing deep analysis job for ${videoPath}`);

        // TODO: Criar job para deep analysis
        // await this.deepAnalysisQueue.add('analyze', {
        //   quickAnalysisId: quickResult.id,
        //   videoPath,
        //   userId,
        //   estimatedTime: decision.estimatedTime
        // });
      }

      // 4. Notificar usuário
      await this.notifyUser(userId, {
        type: 'analysis_complete',
        quickResult,
        needsDeepAnalysis: decision.shouldRun,
      });

      return {
        status: 'success',
        quickAnalysisId: quickResult.id,
        needsDeepAnalysis: decision.shouldRun,
      };
    } catch (error) {
      this.logger.error(`Video job failed: ${error.message}`, error.stack);

      // Notificar erro ao usuário
      await this.notifyUser(userId, {
        type: 'analysis_failed',
        error: error.message,
      });

      throw error;
    }
  }

  private async notifyUser(userId: string, payload: any) {
    // TODO: Implementar notificação (WebSocket, Push, Email, etc)
    this.logger.debug(`Notifying user ${userId}:`, payload);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  VideoAnalysisController,
  VideoBatchProcessorService,
  AnalyticsService,
  VideoQueueProcessor,
};
