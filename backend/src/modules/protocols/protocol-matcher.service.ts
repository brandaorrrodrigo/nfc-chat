/**
 * Protocol Matcher Service
 *
 * Orquestrador principal para geração de protocolos corretivos (LAYER 3)
 *
 * Processo:
 * 1. Filtra desvios corrigíveis
 * 2. Prioriza por severidade + risco de lesão
 * 3. Carrega protocolos base via ProtocolLoaderService (com cache L4)
 * 4. Valida protocolos base via ProtocolValidatorService
 * 5. Personaliza protocolos via ProtocolPersonalizerService (5 regras determinísticas)
 * 6. Integra múltiplos protocolos se necessário
 * 7. Extrai rationale científico do deep context (se disponível)
 * 8. Validação final
 *
 * IMPORTANTE: Sistema 100% determinístico - mesmas entradas = mesmas saídas
 */

import { Injectable, Logger } from '@nestjs/common';
import { ProtocolLoaderService } from './protocol-loader.service';
import { ProtocolValidatorService } from './protocol-validator.service';
import { ProtocolPersonalizerService } from './protocol-personalizer.service';
import {
  GenerateProtocolsInput,
  GeneratedProtocol,
  DeviationInput,
  UserProfile,
  ProtocolPriority,
  BaseProtocol,
} from './interfaces/protocol.interface';

@Injectable()
export class ProtocolMatcherService {
  private readonly logger = new Logger(ProtocolMatcherService.name);

  /**
   * Pesos para priorização de desvios por severidade
   */
  private readonly severityWeights = {
    severe: 3,
    moderate: 2,
    mild: 1,
  };

  /**
   * Pesos para priorização por risco de lesão
   */
  private readonly injuryRiskWeights = {
    knee_valgus: 3, // Alto risco de lesão de LCA
    butt_wink: 2, // Risco moderado de lesão lombar
    forward_lean: 2,
    heel_rise: 1,
    asymmetric_loading: 2,
  };

  constructor(
    private loader: ProtocolLoaderService,
    private validator: ProtocolValidatorService,
    private personalizer: ProtocolPersonalizerService,
  ) {}

  /**
   * Gera protocolos corretivos personalizados
   *
   * @param input - Desvios detectados + perfil do usuário + contexto profundo
   * @returns Lista de protocolos gerados e personalizados
   */
  async generateProtocols(
    input: GenerateProtocolsInput,
  ): Promise<GeneratedProtocol[]> {
    const startTime = Date.now();

    this.logger.log(
      `Generating protocols for user ${input.userProfile.userId}: ${input.deviations.length} deviations detected`,
    );

    const generatedProtocols: GeneratedProtocol[] = [];

    try {
      // ETAPA 1: Filtrar desvios corrigíveis (confidence >= 0.6)
      const correctableDeviations = this.filterCorrectableDeviations(
        input.deviations,
      );

      if (correctableDeviations.length === 0) {
        this.logger.warn('No correctable deviations found (all confidence < 0.6)');
        return [];
      }

      this.logger.debug(
        `${correctableDeviations.length} correctable deviations (filtered from ${input.deviations.length})`,
      );

      // ETAPA 2: Priorizar desvios por severidade + risco de lesão
      const prioritizedDeviations = this.prioritizeDeviations(
        correctableDeviations,
      );

      this.logger.debug(
        `Prioritized deviations: ${prioritizedDeviations.map((p) => `${p.deviationType}(${p.priorityScore})`).join(', ')}`,
      );

      // ETAPA 3-7: Processar cada desvio
      for (const prioritized of prioritizedDeviations) {
        try {
          const protocol = await this.generateSingleProtocol(
            prioritized,
            input.userProfile,
            input.deepContext,
          );

          if (protocol) {
            generatedProtocols.push(protocol);
          }
        } catch (error) {
          const err = error as Error;
          this.logger.error(
            `Failed to generate protocol for ${prioritized.deviationType}: ${err.message}`,
            err.stack,
          );
        }
      }

      // ETAPA 8: Integração de protocolos (se múltiplos)
      if (generatedProtocols.length > 1) {
        this.integrateMultipleProtocols(generatedProtocols);
      }

      const duration = Date.now() - startTime;
      this.logger.log(
        `Generated ${generatedProtocols.length} protocols in ${duration}ms`,
      );

      return generatedProtocols;
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Protocol generation failed: ${err.message}`,
        err.stack,
      );
      throw error;
    }
  }

  /**
   * Gera um protocolo individual
   */
  private async generateSingleProtocol(
    prioritized: ProtocolPriority,
    userProfile: UserProfile,
    deepContext?: any,
  ): Promise<GeneratedProtocol | null> {
    const { deviationType, severity } = prioritized;

    // ETAPA 3: Carregar protocolo base (com cache L4)
    const baseProtocol = await this.loader.loadProtocol(deviationType, severity);

    if (!baseProtocol) {
      this.logger.warn(
        `Protocol not found for ${deviationType}/${severity}`,
      );
      return null;
    }

    // ETAPA 4: Validar protocolo base
    const baseValidation = this.validator.validateBaseProtocol(baseProtocol);

    if (!baseValidation.valid) {
      this.logger.error(
        `Base protocol validation failed for ${baseProtocol.protocolId}: ${baseValidation.errors.join('; ')}`,
      );
      return null;
    }

    // ETAPA 5: Personalizar protocolo (5 regras determinísticas)
    const { protocol: personalizedProtocol, log: personalizationLog } =
      this.personalizer.personalizeProtocol(baseProtocol, userProfile);

    // ETAPA 6: Validar protocolo personalizado
    const personalizedValidation =
      this.validator.validatePersonalizedProtocol(personalizedProtocol);

    if (!personalizedValidation.valid) {
      this.logger.error(
        `Personalized protocol validation failed: ${personalizedValidation.errors.join('; ')}`,
      );
      // Não bloquear, apenas logar warnings
    }

    // ETAPA 7: Extrair rationale científico do deep context
    const scientificRationale = this.extractScientificRationale(
      deviationType,
      severity,
      deepContext,
    );

    // Construir protocolo gerado
    const generatedProtocol: GeneratedProtocol = {
      protocolId: `${baseProtocol.protocolId}_${userProfile.userId}_${Date.now()}`,
      deviationType,
      deviationSeverity: severity,
      baseProtocol,
      personalizedProtocol,
      personalizationLog,
      scientificRationale,
      createdAt: new Date(),
    };

    this.logger.debug(
      `Generated protocol ${generatedProtocol.protocolId} (${personalizationLog.filter((l) => l.applied).length}/5 rules applied)`,
    );

    return generatedProtocol;
  }

  /**
   * ETAPA 1: Filtra desvios corrigíveis (confidence >= 0.6)
   */
  private filterCorrectableDeviations(
    deviations: DeviationInput[],
  ): DeviationInput[] {
    return deviations.filter((deviation) => {
      if (deviation.confidence < 0.6) {
        this.logger.debug(
          `Filtered out ${deviation.type}: low confidence (${deviation.confidence})`,
        );
        return false;
      }

      return true;
    });
  }

  /**
   * ETAPA 2: Prioriza desvios por severidade + risco de lesão
   *
   * Score = (severity_weight * 10) + (injury_risk_weight * 5)
   *
   * Exemplos:
   * - knee_valgus severe: (3*10) + (3*5) = 45
   * - butt_wink moderate: (2*10) + (2*5) = 30
   * - heel_rise mild: (1*10) + (1*5) = 15
   */
  private prioritizeDeviations(
    deviations: DeviationInput[],
  ): ProtocolPriority[] {
    const priorities: ProtocolPriority[] = deviations.map((deviation) => {
      const severityWeight = this.severityWeights[deviation.severity] || 1;
      const riskWeight = (this.injuryRiskWeights as Record<string, number>)[deviation.type] || 1;

      const priorityScore = severityWeight * 10 + riskWeight * 5;

      const injuryRisk: 'low' | 'moderate' | 'high' =
        riskWeight === 3 ? 'high' : riskWeight === 2 ? 'moderate' : 'low';

      return {
        deviationType: deviation.type,
        severity: deviation.severity,
        priorityScore,
        injuryRisk,
      };
    });

    // Ordenar por priority score (maior = mais prioritário)
    priorities.sort((a, b) => b.priorityScore - a.priorityScore);

    return priorities;
  }

  /**
   * ETAPA 7: Extrai rationale científico do deep context
   *
   * Se deep context disponível, busca insights relevantes ao desvio
   */
  private extractScientificRationale(
    deviationType: string,
    severity: string,
    deepContext?: any,
  ): string | undefined {
    if (!deepContext) {
      return undefined;
    }

    // Se deep context tem narrative científico, extrair
    if (deepContext.scientific_narrative) {
      return deepContext.scientific_narrative;
    }

    // Se deep context tem insights por desvio
    if (deepContext.deviation_insights && deepContext.deviation_insights[deviationType]) {
      const insight = deepContext.deviation_insights[deviationType];
      return insight.rationale || insight.explanation;
    }

    return undefined;
  }

  /**
   * ETAPA 8: Integra múltiplos protocolos
   *
   * Estratégia:
   * - Se protocolos compartilham exercícios: aumentar volume em vez de duplicar
   * - Se protocolos conflitam (mesma região muscular): priorizar o de maior score
   * - Adicionar notas sobre integração
   */
  private integrateMultipleProtocols(protocols: GeneratedProtocol[]): void {
    this.logger.log(
      `Integrating ${protocols.length} protocols for combined execution`,
    );

    // Detectar exercícios duplicados entre protocolos
    const exerciseOccurrences = new Map<string, number>();

    protocols.forEach((protocol) => {
      protocol.personalizedProtocol.modifiedPhases.forEach((phase) => {
        phase.exercises.forEach((exercise) => {
          const count = exerciseOccurrences.get(exercise.exerciseId) || 0;
          exerciseOccurrences.set(exercise.exerciseId, count + 1);
        });
      });
    });

    // Identificar exercícios compartilhados (presentes em >1 protocolo)
    const sharedExercises = Array.from(exerciseOccurrences.entries())
      .filter(([_, count]) => count > 1)
      .map(([exerciseId, _]) => exerciseId);

    if (sharedExercises.length > 0) {
      this.logger.debug(
        `Found ${sharedExercises.length} shared exercises across protocols`,
      );

      // Adicionar nota em cada protocolo
      protocols.forEach((protocol) => {
        protocol.personalizedProtocol.additionalNotes.push(
          `MÚLTIPLOS PROTOCOLOS: Este protocolo faz parte de um programa integrado com ${protocols.length} protocolos. Alguns exercícios aparecem em múltiplos protocolos - execute apenas 1x.`,
        );

        // Marcar exercícios compartilhados
        protocol.personalizedProtocol.modifiedPhases.forEach((phase) => {
          phase.exercises.forEach((exercise) => {
            if (sharedExercises.includes(exercise.exerciseId)) {
              if (!exercise.cues) {
                exercise.cues = [];
              }

              exercise.cues.push(
                '[EXERCÍCIO COMPARTILHADO] - Aparece em múltiplos protocolos, execute apenas 1x',
              );
            }
          });
        });
      });
    }

    // Adicionar nota de agendamento
    protocols.forEach((protocol) => {
      protocol.personalizedProtocol.additionalNotes.push(
        `AGENDAMENTO: Com ${protocols.length} protocolos ativos, considere distribuir ao longo da semana para evitar fadiga excessiva.`,
      );
    });

    this.logger.log(`Protocol integration complete`);
  }

  /**
   * Lista todos os protocolos disponíveis
   */
  async listAvailableProtocols(): Promise<
    Array<{ deviationType: string; severity: string; protocolId: string }>
  > {
    return this.loader.listAvailableProtocols();
  }

  /**
   * Carrega protocolo específico (sem personalização)
   */
  async loadProtocol(
    deviationType: string,
    severity: 'mild' | 'moderate' | 'severe',
  ): Promise<BaseProtocol | null> {
    return this.loader.loadProtocol(deviationType, severity);
  }

  /**
   * Valida protocolo
   */
  validateProtocol(protocol: any): { valid: boolean; errors: string[]; warnings: string[] } {
    return this.validator.validateBaseProtocol(protocol);
  }

  /**
   * Recarrega protocolo do filesystem (invalida cache)
   */
  async reloadProtocol(
    deviationType: string,
    severity: 'mild' | 'moderate' | 'severe',
  ): Promise<BaseProtocol | null> {
    return this.loader.reloadProtocol(deviationType, severity);
  }

  /**
   * Invalida cache de protocolos
   */
  async invalidateCache(deviationType?: string): Promise<number> {
    if (deviationType) {
      return this.loader.invalidateDeviationType(deviationType);
    } else {
      return this.loader.invalidateAllProtocols();
    }
  }
}
