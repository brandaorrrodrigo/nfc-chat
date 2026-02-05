import { Injectable, Logger } from '@nestjs/common';
import { QuickAnalysisResult, User } from '@prisma/client';
import {
  DeepAnalysisDecisionDto,
  CacheStrategyDto,
} from './dto/deep-analysis-decision.dto';
import { IAggregatedDeviation } from './interfaces/deviation.interface';

/**
 * Serviço responsável pelas decisões inteligentes do pipeline híbrido:
 * - Determinar quando executar análise profunda (RAG + LLM)
 * - Definir estratégias de cache
 * - Estimar tempo de processamento
 * - Priorizar recursos baseado em contexto
 *
 * Motor de decisão com 5 critérios:
 * 1. Score baixo (< 7.0)
 * 2. Similaridade baixa (< 70%)
 * 3. Desvios críticos (moderate/severe)
 * 4. Múltiplos desvios simultâneos (≥ 3)
 * 5. Tier do usuário (Premium sempre recebe análise profunda)
 */
@Injectable()
export class DecisionEngineService {
  private readonly logger = new Logger(DecisionEngineService.name);

  // Thresholds configuráveis
  private readonly SCORE_THRESHOLD = 7.0;
  private readonly SIMILARITY_THRESHOLD = 0.7;
  private readonly MULTIPLE_DEVIATIONS_THRESHOLD = 3;
  private readonly MINIMUM_TRIGGERS_FREE_TIER = 2;

  // Tempos de processamento (ms)
  private readonly BASE_DEEP_ANALYSIS_TIME = 30000; // 30s base
  private readonly PER_DEVIATION_TIME = 10000; // +10s por desvio

  // Tiers premium
  private readonly PREMIUM_TIERS = ['pro', 'coach'];

  /**
   * Decide se a análise profunda (RAG + LLM) deve ser executada
   * baseado em múltiplos critérios
   *
   * @param quickResult - Resultado da análise rápida
   * @param user - Dados do usuário (incluindo tier)
   * @returns Decisão com razão, tempo estimado e triggers
   *
   * @example
   * ```typescript
   * const decision = await decisionEngine.shouldRunDeepAnalysis(
   *   quickAnalysisResult,
   *   user
   * );
   *
   * if (decision.shouldRun) {
   *   console.log(`Executando análise profunda: ${decision.reason}`);
   *   console.log(`Tempo estimado: ${decision.estimatedTime}ms`);
   *   // Executar RAG + LLM...
   * } else {
   *   console.log(`Análise rápida suficiente: ${decision.reason}`);
   *   // Retornar resultado rápido ao usuário
   * }
   * ```
   */
  async shouldRunDeepAnalysis(
    quickResult: QuickAnalysisResult,
    user: User,
  ): Promise<DeepAnalysisDecisionDto> {
    this.logger.log(
      `Evaluating deep analysis decision for analysis_id=${quickResult.id}, user=${user.id}`,
    );

    const triggers: string[] = [];
    let deviations: IAggregatedDeviation[] = [];

    try {
      deviations = JSON.parse(quickResult.deviations_detected as string);
    } catch (error) {
      this.logger.warn(
        `Failed to parse deviations: ${error.message}. Assuming empty.`,
      );
    }

    // CRITÉRIO 1: Score baixo
    if (quickResult.overall_score < this.SCORE_THRESHOLD) {
      triggers.push(
        `score_low: ${quickResult.overall_score.toFixed(1)}/10 (< ${this.SCORE_THRESHOLD})`,
      );
      this.logger.debug(`Trigger 1: Low score`);
    }

    // CRITÉRIO 2: Similaridade com gold standard baixa
    if (quickResult.similarity_to_gold < this.SIMILARITY_THRESHOLD) {
      const percentage = (quickResult.similarity_to_gold * 100).toFixed(1);
      triggers.push(
        `similarity_low: ${percentage}% (< ${this.SIMILARITY_THRESHOLD * 100}%)`,
      );
      this.logger.debug(`Trigger 2: Low similarity`);
    }

    // CRITÉRIO 3: Desvios críticos (moderate ou severe)
    const criticalDeviations = deviations.filter(
      (d) => d.severity === 'moderate' || d.severity === 'severe',
    );

    if (criticalDeviations.length > 0) {
      const types = criticalDeviations.map((d) => d.type).join(', ');
      triggers.push(
        `critical_deviations: ${criticalDeviations.length}x [${types}]`,
      );
      this.logger.debug(
        `Trigger 3: ${criticalDeviations.length} critical deviations`,
      );
    }

    // CRITÉRIO 4: Múltiplos desvios simultâneos
    if (deviations.length >= this.MULTIPLE_DEVIATIONS_THRESHOLD) {
      triggers.push(`multiple_deviations: ${deviations.length} simultâneos`);
      this.logger.debug(`Trigger 4: Multiple deviations`);
    }

    // CRITÉRIO 5: Usuário Premium (sempre recebe análise profunda)
    const isPremium = this.PREMIUM_TIERS.includes(user.subscription_tier);

    if (isPremium) {
      triggers.push(
        `premium_tier: ${user.subscription_tier} - análise completa incluída`,
      );
      this.logger.log(`Premium user detected: always run deep analysis`);

      return {
        shouldRun: true,
        reason: 'Usuário Premium - análise profunda incluída no plano',
        estimatedTime: this.estimateDeepAnalysisTime(
          criticalDeviations.length,
        ),
        triggers,
      };
    }

    // DECISÃO FINAL (usuários free)
    const shouldRun = triggers.length >= this.MINIMUM_TRIGGERS_FREE_TIER;

    const decision: DeepAnalysisDecisionDto = {
      shouldRun,
      reason: shouldRun
        ? `${triggers.length} critérios atingidos: análise profunda necessária para prescrição corretiva`
        : `Análise rápida suficiente (apenas ${triggers.length} trigger${triggers.length !== 1 ? 's' : ''}). Análise profunda disponível no plano Premium.`,
      estimatedTime: shouldRun
        ? this.estimateDeepAnalysisTime(criticalDeviations.length)
        : 0,
      triggers,
    };

    this.logger.log(
      `Decision: shouldRun=${decision.shouldRun}, triggers=${triggers.length}/${this.MINIMUM_TRIGGERS_FREE_TIER}, reason="${decision.reason}"`,
    );

    return decision;
  }

  /**
   * Estima tempo de análise profunda baseado na complexidade
   *
   * Fatores:
   * - Base: 30s para RAG + LLM
   * - +10s para cada desvio crítico adicional (busca RAG específica)
   * - +5s se múltiplos desvios simultâneos (análise de interação)
   *
   * @param criticalDeviationsCount - Número de desvios críticos
   * @returns Tempo estimado em milissegundos
   *
   * @example
   * ```typescript
   * estimateDeepAnalysisTime(0) // → 30000ms (30s)
   * estimateDeepAnalysisTime(2) // → 50000ms (50s)
   * estimateDeepAnalysisTime(4) // → 75000ms (75s) - inclui bônus de interação
   * ```
   */
  private estimateDeepAnalysisTime(criticalDeviationsCount: number): number {
    let time = this.BASE_DEEP_ANALYSIS_TIME;

    // Tempo adicional por desvio crítico
    time += criticalDeviationsCount * this.PER_DEVIATION_TIME;

    // Bônus se múltiplos desvios (análise de interação)
    if (criticalDeviationsCount >= 3) {
      time += 5000; // +5s para análise de interação entre desvios
      this.logger.debug(
        `Added 5s for multi-deviation interaction analysis`,
      );
    }

    this.logger.debug(
      `Estimated time: ${time}ms (${criticalDeviationsCount} critical deviations)`,
    );

    return time;
  }

  /**
   * Determina estratégia de cache baseado em contexto
   *
   * Níveis de cache:
   * - L1: Análise idêntica (vídeo hash + user + exercise) - TTL 24h
   * - L2: Gold standard (apenas exercise) - TTL 7 dias
   * - L3: RAG context (desvio + categoria) - TTL 30 dias
   *
   * @param exerciseId - ID do exercício
   * @param userId - ID do usuário
   * @param videoHash - Hash opcional do vídeo (para L1)
   * @returns Estratégia de cache
   *
   * @example
   * ```typescript
   * const strategy = decisionEngine.getCacheStrategy(
   *   'back-squat',
   *   'user_123',
   *   'abc123def456'
   * );
   *
   * // Verificar cache
   * const cached = await redis.get(strategy.key);
   * if (cached && Date.now() - cached.timestamp < strategy.ttl * 1000) {
   *   return cached.data;
   * }
   * ```
   */
  getCacheStrategy(
    exerciseId: string,
    userId: string,
    videoHash?: string,
  ): CacheStrategyDto {
    if (videoHash) {
      // L1: Análise idêntica (vídeo específico)
      return {
        level: 'L1',
        ttl: 86400, // 24h
        key: `video_analysis:${userId}:${exerciseId}:${videoHash}`,
      };
    }

    // L2: Gold standard (exercício específico)
    return {
      level: 'L2',
      ttl: 604800, // 7 dias
      key: `gold_standard:${exerciseId}`,
    };
  }

  /**
   * Determina estratégia de cache para contexto RAG
   *
   * @param deviationType - Tipo do desvio
   * @param severity - Severidade
   * @returns Estratégia de cache L3
   */
  getRagCacheStrategy(
    deviationType: string,
    severity: string,
  ): CacheStrategyDto {
    return {
      level: 'L3',
      ttl: 2592000, // 30 dias
      key: `rag_context:${deviationType}:${severity}`,
    };
  }

  /**
   * Avalia se vale a pena executar análise profunda baseado em custo/benefício
   *
   * Considera:
   * - Custo computacional (tempo + $)
   * - Benefício esperado (melhora na prescrição)
   * - Tier do usuário
   *
   * @param decision - Decisão inicial
   * @param estimatedCost - Custo estimado em créditos
   * @returns true se vale a pena executar
   */
  evaluateCostBenefit(
    decision: DeepAnalysisDecisionDto,
    estimatedCost: number,
  ): boolean {
    // Premium sempre vale a pena (já pago)
    if (decision.triggers.some((t) => t.includes('premium_tier'))) {
      return true;
    }

    // Free tier: apenas se múltiplos triggers E custo razoável
    const hasCriticalDeviations = decision.triggers.some((t) =>
      t.includes('critical_deviations'),
    );
    const hasLowScore = decision.triggers.some((t) => t.includes('score_low'));

    const isCriticalCase = hasCriticalDeviations || hasLowScore;
    const isAffordable = estimatedCost < 100; // threshold arbitrário

    return isCriticalCase && isAffordable;
  }

  /**
   * Prioriza análises na fila baseado em urgência
   *
   * Critérios de prioridade:
   * 1. Usuários premium (prioridade alta)
   * 2. Casos críticos (score < 5)
   * 3. Múltiplos desvios severos
   * 4. FIFO para os demais
   *
   * @param analyses - Lista de análises pendentes
   * @returns Lista ordenada por prioridade
   */
  prioritizeAnalysisQueue(
    analyses: Array<{ id: string; score: number; isPremium: boolean; deviations: number }>,
  ): string[] {
    const sorted = [...analyses].sort((a, b) => {
      // 1. Premium primeiro
      if (a.isPremium && !b.isPremium) return -1;
      if (!a.isPremium && b.isPremium) return 1;

      // 2. Score mais baixo (casos críticos)
      if (a.score < 5 && b.score >= 5) return -1;
      if (a.score >= 5 && b.score < 5) return 1;

      // 3. Mais desvios
      return b.deviations - a.deviations;
    });

    this.logger.debug(
      `Prioritized ${sorted.length} analyses. First: ${sorted[0]?.id}`,
    );

    return sorted.map((a) => a.id);
  }

  /**
   * Atualiza thresholds dinamicamente baseado em métricas
   * (Feature futura: machine learning para otimização)
   *
   * @param metrics - Métricas de performance do sistema
   */
  async updateThresholds(metrics: {
    avgProcessingTime: number;
    userSatisfaction: number;
    falsePositives: number;
  }): Promise<void> {
    this.logger.log(
      `Threshold update requested with metrics: ${JSON.stringify(metrics)}`,
    );

    // TODO: Implementar ML para otimização automática
    // Por enquanto, apenas log
    this.logger.debug('Dynamic threshold update not yet implemented');
  }

  /**
   * Gera relatório de decisões tomadas
   *
   * @param decisions - Lista de decisões
   * @returns Estatísticas agregadas
   */
  generateDecisionReport(decisions: DeepAnalysisDecisionDto[]): {
    totalDecisions: number;
    deepAnalysisExecuted: number;
    quickAnalysisOnly: number;
    avgTriggers: number;
    mostCommonTrigger: string;
  } {
    const deepCount = decisions.filter((d) => d.shouldRun).length;
    const quickCount = decisions.length - deepCount;

    const allTriggers = decisions.flatMap((d) => d.triggers);
    const avgTriggers = allTriggers.length / decisions.length;

    // Contar triggers
    const triggerCounts = allTriggers.reduce((acc, trigger) => {
      const type = trigger.split(':')[0];
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonTrigger =
      Object.entries(triggerCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      'none';

    return {
      totalDecisions: decisions.length,
      deepAnalysisExecuted: deepCount,
      quickAnalysisOnly: quickCount,
      avgTriggers: Math.round(avgTriggers * 100) / 100,
      mostCommonTrigger,
    };
  }
}
