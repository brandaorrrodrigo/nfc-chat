/**
 * Protocol Personalizer Service
 *
 * Aplica 5 regras determinísticas de personalização em protocolos corretivos:
 *
 * REGRA 1: Training Age - Ajusta duração e complexidade baseado em experiência
 * REGRA 2: Injury History - Reduz carga e progressão se histórico relevante
 * REGRA 3: Equipment - Substitui exercícios baseado em disponibilidade
 * REGRA 4: Weekly Frequency - Ajusta volume se <4x/semana
 * REGRA 5: Current Symptoms - Adiciona precauções se dor presente
 *
 * IMPORTANTE: Sistema 100% determinístico - mesmas entradas = mesmas saídas
 * NÃO usa LLM, NÃO usa randomização
 */

import { Injectable, Logger } from '@nestjs/common';
import {
  BaseProtocol,
  PersonalizedProtocol,
  PersonalizationLog,
  PersonalizationChange,
  UserProfile,
  InjuryRecord,
  Symptom,
  ProtocolPhase,
  Exercise,
} from './interfaces/protocol.interface';

@Injectable()
export class ProtocolPersonalizerService {
  private readonly logger = new Logger(ProtocolPersonalizerService.name);

  /**
   * Mapa de exercícios alternativos por equipamento
   * Formato: { exerciseId: { equipment: alternativeExerciseId } }
   */
  private readonly exerciseAlternatives: Record<
    string,
    Record<string, string>
  > = {
    // Exemplo: goblet squat pode ser substituído
    goblet_squat: {
      bodyweight: 'air_squat',
      resistance_band: 'banded_squat',
    },
    // Adicionar mais conforme necessário
  };

  /**
   * Aplica todas as regras de personalização em um protocolo
   *
   * @param baseProtocol - Protocolo base carregado
   * @param userProfile - Perfil do usuário
   * @returns Protocolo personalizado + log de mudanças
   */
  personalizeProtocol(
    baseProtocol: BaseProtocol,
    userProfile: UserProfile,
  ): { protocol: PersonalizedProtocol; log: PersonalizationLog[] } {
    this.logger.log(
      `Personalizing protocol ${baseProtocol.protocolId} for user ${userProfile.userId}`,
    );

    // Inicializar protocolo personalizado como cópia profunda do base
    const personalizedProtocol: PersonalizedProtocol = {
      ...baseProtocol,
      modifiedPhases: JSON.parse(JSON.stringify(baseProtocol.phases)),
      modifiedDurationWeeks: baseProtocol.totalDurationWeeks,
      modifiedFrequencyPerWeek: baseProtocol.frequencyPerWeek,
      additionalNotes: [],
      substitutedExercises: {},
    };

    const log: PersonalizationLog[] = [];

    // Aplicar regras em ordem (ordem importa para efeitos cumulativos)
    log.push(this.applyRule1_TrainingAge(personalizedProtocol, userProfile));
    log.push(this.applyRule2_InjuryHistory(personalizedProtocol, userProfile));
    log.push(this.applyRule3_Equipment(personalizedProtocol, userProfile));
    log.push(this.applyRule4_WeeklyFrequency(personalizedProtocol, userProfile));
    log.push(this.applyRule5_CurrentSymptoms(personalizedProtocol, userProfile));

    // Contar quantas regras foram aplicadas
    const appliedCount = log.filter((l) => l.applied).length;

    this.logger.log(
      `Personalization complete: ${appliedCount}/5 rules applied for ${baseProtocol.protocolId}`,
    );

    return { protocol: personalizedProtocol, log };
  }

  /**
   * REGRA 1: Training Age
   *
   * Beginner (<1 ano):
   * - Aumenta duração de cada fase em 50%
   * - Remove exercícios avançados (categoria 'integration')
   * - Adiciona nota de supervisão recomendada
   *
   * Advanced (>5 anos):
   * - Reduz duração de cada fase em 20%
   * - Mantém todos os exercícios
   * - Permite progressão mais agressiva
   */
  private applyRule1_TrainingAge(
    protocol: PersonalizedProtocol,
    userProfile: UserProfile,
  ): PersonalizationLog {
    const changes: PersonalizationChange[] = [];
    let applied = false;

    const trainingAge = userProfile.trainingAge;
    const trainingAgeYears = userProfile.trainingAgeYears;

    if (trainingAge === 'beginner' || (trainingAgeYears && trainingAgeYears < 1)) {
      applied = true;

      // MUDANÇA 1: Aumentar duração de fases em 50%
      protocol.modifiedPhases.forEach((phase, index) => {
        const original = phase.durationWeeks;
        phase.durationWeeks = Math.ceil(phase.durationWeeks * 1.5);

        changes.push({
          field: `phases[${index}].durationWeeks`,
          originalValue: original,
          newValue: phase.durationWeeks,
          rationale:
            'Beginner training age requires slower progression for motor learning',
        });
      });

      // Recalcular duração total
      const originalTotal = protocol.modifiedDurationWeeks;
      protocol.modifiedDurationWeeks = protocol.modifiedPhases.reduce(
        (sum, phase) => sum + phase.durationWeeks,
        0,
      );

      changes.push({
        field: 'modifiedDurationWeeks',
        originalValue: originalTotal,
        newValue: protocol.modifiedDurationWeeks,
        rationale: 'Total duration adjusted based on phase modifications',
      });

      // MUDANÇA 2: Remover exercícios de integração (muito avançados)
      let removedCount = 0;
      protocol.modifiedPhases.forEach((phase) => {
        const originalLength = phase.exercises.length;
        phase.exercises = phase.exercises.filter(
          (ex) => ex.category !== 'integration',
        );
        removedCount += originalLength - phase.exercises.length;
      });

      if (removedCount > 0) {
        changes.push({
          field: 'exercises',
          originalValue: removedCount + ' integration exercises',
          newValue: 'removed',
          rationale: 'Integration exercises too advanced for beginners',
        });
      }

      // MUDANÇA 3: Adicionar nota de supervisão
      protocol.additionalNotes.push(
        'BEGINNER: Supervisão por profissional qualificado altamente recomendada nas primeiras 4-6 semanas',
      );
      protocol.additionalNotes.push(
        'BEGINNER: Priorize qualidade do movimento sobre quantidade/carga',
      );

      this.logger.debug(
        `RULE 1 (Beginner): Extended duration by 50%, removed ${removedCount} integration exercises`,
      );
    } else if (
      trainingAge === 'advanced' ||
      (trainingAgeYears && trainingAgeYears > 5)
    ) {
      applied = true;

      // MUDANÇA 1: Reduzir duração em 20%
      protocol.modifiedPhases.forEach((phase, index) => {
        const original = phase.durationWeeks;
        phase.durationWeeks = Math.max(1, Math.ceil(phase.durationWeeks * 0.8));

        changes.push({
          field: `phases[${index}].durationWeeks`,
          originalValue: original,
          newValue: phase.durationWeeks,
          rationale: 'Advanced training age allows faster adaptation',
        });
      });

      // Recalcular duração total
      const originalTotal = protocol.modifiedDurationWeeks;
      protocol.modifiedDurationWeeks = protocol.modifiedPhases.reduce(
        (sum, phase) => sum + phase.durationWeeks,
        0,
      );

      changes.push({
        field: 'modifiedDurationWeeks',
        originalValue: originalTotal,
        newValue: protocol.modifiedDurationWeeks,
        rationale: 'Total duration adjusted based on phase modifications',
      });

      // MUDANÇA 2: Nota de progressão agressiva
      protocol.additionalNotes.push(
        'ADVANCED: Você pode progredir mais rapidamente se os critérios forem atingidos',
      );
      protocol.additionalNotes.push(
        'ADVANCED: Considere adicionar carga/complexidade mesmo antes de avançar de fase',
      );

      this.logger.debug(`RULE 1 (Advanced): Reduced duration by 20%`);
    }

    return {
      rule: 'RULE_1_TRAINING_AGE',
      applied,
      reason: applied
        ? `Training age: ${trainingAge || trainingAgeYears + ' years'}`
        : 'Training age is intermediate (no modification)',
      changes,
    };
  }

  /**
   * REGRA 2: Injury History
   *
   * Se histórico de lesão relevante ao desvio:
   * - Reduz carga inicial em 30%
   * - Aumenta duração de fase inicial em 50%
   * - Adiciona critérios de progressão mais conservadores
   * - Adiciona contraindicações específicas
   */
  private applyRule2_InjuryHistory(
    protocol: PersonalizedProtocol,
    userProfile: UserProfile,
  ): PersonalizationLog {
    const changes: PersonalizationChange[] = [];
    let applied = false;

    if (!userProfile.injuryHistory || userProfile.injuryHistory.length === 0) {
      return {
        rule: 'RULE_2_INJURY_HISTORY',
        applied: false,
        reason: 'No injury history reported',
        changes: [],
      };
    }

    // Filtrar lesões relevantes ao tipo de desvio
    const relevantInjuries = this.findRelevantInjuries(
      userProfile.injuryHistory,
      protocol.deviationType,
    );

    if (relevantInjuries.length === 0) {
      return {
        rule: 'RULE_2_INJURY_HISTORY',
        applied: false,
        reason: 'No injuries relevant to this deviation type',
        changes: [],
      };
    }

    applied = true;

    // MUDANÇA 1: Reduzir carga inicial
    protocol.modifiedPhases.forEach((phase, phaseIndex) => {
      if (phaseIndex === 0) {
        // Apenas primeira fase
        phase.exercises.forEach((exercise, exIndex) => {
          if (exercise.load && exercise.load !== 'bodyweight') {
            const original = exercise.load;
            exercise.load = this.reduceLoad(exercise.load);

            changes.push({
              field: `phases[0].exercises[${exIndex}].load`,
              originalValue: original,
              newValue: exercise.load,
              rationale: `Injury history in ${relevantInjuries[0].location} requires reduced initial load`,
            });
          }
        });
      }
    });

    // MUDANÇA 2: Estender primeira fase em 50%
    const firstPhase = protocol.modifiedPhases[0];
    if (firstPhase) {
      const originalDuration = firstPhase.durationWeeks;
      firstPhase.durationWeeks = Math.ceil(firstPhase.durationWeeks * 1.5);

      changes.push({
        field: 'phases[0].durationWeeks',
        originalValue: originalDuration,
        newValue: firstPhase.durationWeeks,
        rationale: 'Extended initial phase for conservative progression due to injury history',
      });

      // Atualizar duração total
      protocol.modifiedDurationWeeks = protocol.modifiedPhases.reduce(
        (sum, phase) => sum + phase.durationWeeks,
        0,
      );
    }

    // MUDANÇA 3: Adicionar contraindicações
    relevantInjuries.forEach((injury) => {
      const warning = `ATENÇÃO: Histórico de ${injury.type} em ${injury.location}. ${
        injury.fullyRecovered ? 'Recuperado' : 'NÃO totalmente recuperado'
      }. Progrida com cautela extra.`;

      if (!protocol.contraindications) {
        protocol.contraindications = [];
      }

      protocol.contraindications.push(warning);
      protocol.additionalNotes.push(warning);
    });

    // MUDANÇA 4: Adicionar critérios conservadores
    protocol.additionalNotes.push(
      'INJURY HISTORY: Avance de fase apenas se ZERO dor/desconforto na região lesionada',
    );
    protocol.additionalNotes.push(
      'INJURY HISTORY: Qualquer sinal de piora: retorne à fase anterior ou pause o protocolo',
    );

    this.logger.debug(
      `RULE 2: Found ${relevantInjuries.length} relevant injuries, applied conservative modifications`,
    );

    return {
      rule: 'RULE_2_INJURY_HISTORY',
      applied,
      reason: `Relevant injury history: ${relevantInjuries.map((i) => i.location).join(', ')}`,
      changes,
    };
  }

  /**
   * REGRA 3: Equipment
   *
   * Substitui exercícios baseado em equipamento disponível:
   * - Se exercício requer equipamento não disponível
   * - Substitui por alternativa com equipamento disponível
   * - Mantém categoria e objetivo do exercício
   */
  private applyRule3_Equipment(
    protocol: PersonalizedProtocol,
    userProfile: UserProfile,
  ): PersonalizationLog {
    const changes: PersonalizationChange[] = [];
    let applied = false;

    const availableEquipment = userProfile.equipmentAvailable || ['bodyweight'];

    this.logger.debug(
      `Available equipment: ${availableEquipment.join(', ')}`,
    );

    protocol.modifiedPhases.forEach((phase, phaseIndex) => {
      phase.exercises.forEach((exercise, exIndex) => {
        // Verificar se exercício requer equipamento não disponível
        const requiredEquipment = exercise.equipment || [];
        const hasRequiredEquipment = requiredEquipment.some((eq) =>
          availableEquipment.includes(eq),
        );

        if (!hasRequiredEquipment && requiredEquipment.length > 0) {
          // Tentar encontrar alternativa
          const alternative = this.findAlternativeExercise(
            exercise,
            availableEquipment,
          );

          if (alternative) {
            applied = true;

            const originalId = exercise.exerciseId;
            const originalName = exercise.name;

            // Substituir exercício
            Object.assign(exercise, alternative);

            // Registrar substituição
            if (!protocol.substitutedExercises) {
              protocol.substitutedExercises = {};
            }
            protocol.substitutedExercises[originalId] = alternative.exerciseId;

            changes.push({
              field: `phases[${phaseIndex}].exercises[${exIndex}]`,
              originalValue: `${originalName} (${originalId})`,
              newValue: `${alternative.name} (${alternative.exerciseId})`,
              rationale: `Original requires ${requiredEquipment.join('/')}, substituted with exercise using ${alternative.equipment.join('/')}`,
            });

            this.logger.debug(
              `Substituted ${originalName} -> ${alternative.name} due to equipment availability`,
            );
          } else {
            // Nenhuma alternativa encontrada - marcar como warning
            this.logger.warn(
              `No alternative found for ${exercise.name} requiring ${requiredEquipment.join('/')}`,
            );

            protocol.additionalNotes.push(
              `EQUIPAMENTO: ${exercise.name} requer ${requiredEquipment.join(' ou ')} - considere adquirir ou encontrar alternativa`,
            );
          }
        }
      });
    });

    return {
      rule: 'RULE_3_EQUIPMENT',
      applied,
      reason: applied
        ? `Substituted exercises to match available equipment: ${availableEquipment.join(', ')}`
        : 'All exercises compatible with available equipment',
      changes,
    };
  }

  /**
   * REGRA 4: Weekly Frequency
   *
   * Se frequência semanal < 4x:
   * - Reduz número de exercícios para 70%
   * - Aumenta séries dos exercícios mantidos (+30%)
   * - Foca nos exercícios mais importantes (remove activation, mantém strength/integration)
   */
  private applyRule4_WeeklyFrequency(
    protocol: PersonalizedProtocol,
    userProfile: UserProfile,
  ): PersonalizationLog {
    const changes: PersonalizationChange[] = [];
    let applied = false;

    const weeklyFrequency = userProfile.weeklyFrequency;

    if (!weeklyFrequency || weeklyFrequency >= 4) {
      return {
        rule: 'RULE_4_WEEKLY_FREQUENCY',
        applied: false,
        reason: weeklyFrequency
          ? `Frequency is adequate: ${weeklyFrequency}x/week`
          : 'Weekly frequency not specified',
        changes: [],
      };
    }

    applied = true;

    protocol.modifiedPhases.forEach((phase, phaseIndex) => {
      const originalExerciseCount = phase.exercises.length;

      // Priorizar exercícios: strength > integration > mobility > activation
      const priorityOrder = ['strength', 'integration', 'mobility', 'activation'];

      phase.exercises.sort((a, b) => {
        const aIndex = priorityOrder.indexOf(a.category || '');
        const bIndex = priorityOrder.indexOf(b.category || '');
        return aIndex - bIndex;
      });

      // Manter apenas 70% dos exercícios
      const targetCount = Math.max(2, Math.ceil(originalExerciseCount * 0.7));
      const keptExercises = phase.exercises.slice(0, targetCount);
      const removedExercises = phase.exercises.slice(targetCount);

      // Aumentar séries dos exercícios mantidos em 30%
      keptExercises.forEach((exercise, exIndex) => {
        const originalSets = exercise.sets;
        exercise.sets = Math.ceil(exercise.sets * 1.3);

        changes.push({
          field: `phases[${phaseIndex}].exercises[${exIndex}].sets`,
          originalValue: originalSets,
          newValue: exercise.sets,
          rationale: `Increased volume to compensate for reduced frequency (${weeklyFrequency}x/week)`,
        });
      });

      // Atualizar lista de exercícios
      phase.exercises = keptExercises;

      if (removedExercises.length > 0) {
        changes.push({
          field: `phases[${phaseIndex}].exercises`,
          originalValue: `${originalExerciseCount} exercises`,
          newValue: `${targetCount} exercises (removed ${removedExercises.map((e) => e.name).join(', ')})`,
          rationale: `Reduced exercise count due to low weekly frequency (${weeklyFrequency}x/week)`,
        });
      }
    });

    // Atualizar frequência modificada
    protocol.modifiedFrequencyPerWeek = weeklyFrequency;

    protocol.additionalNotes.push(
      `LOW FREQUENCY (${weeklyFrequency}x/semana): Protocolo adaptado com menos exercícios e maior volume`,
    );
    protocol.additionalNotes.push(
      `Considere aumentar frequência para 4-5x/semana para resultados mais rápidos`,
    );

    this.logger.debug(
      `RULE 4: Adapted protocol for ${weeklyFrequency}x/week frequency`,
    );

    return {
      rule: 'RULE_4_WEEKLY_FREQUENCY',
      applied,
      reason: `Low weekly frequency: ${weeklyFrequency}x/week (recommended: 4+)`,
      changes,
    };
  }

  /**
   * REGRA 5: Current Symptoms
   *
   * Se dor presente (severity >= 4/10):
   * - Adiciona warm-up estendido à fase inicial
   * - Reduz intensidade inicial em 20-25%
   * - Adiciona critério de progressão: "Sem dor durante/após exercícios"
   * - Adiciona nota de monitoramento de sintomas
   */
  private applyRule5_CurrentSymptoms(
    protocol: PersonalizedProtocol,
    userProfile: UserProfile,
  ): PersonalizationLog {
    const changes: PersonalizationChange[] = [];
    let applied = false;

    if (!userProfile.currentSymptoms || userProfile.currentSymptoms.length === 0) {
      return {
        rule: 'RULE_5_CURRENT_SYMPTOMS',
        applied: false,
        reason: 'No current symptoms reported',
        changes: [],
      };
    }

    // Filtrar sintomas de dor relevantes (severity >= 4)
    const relevantSymptoms = userProfile.currentSymptoms.filter(
      (s) => s.type === 'pain' && s.severity >= 4,
    );

    if (relevantSymptoms.length === 0) {
      return {
        rule: 'RULE_5_CURRENT_SYMPTOMS',
        applied: false,
        reason: 'Symptoms present but not severe enough (< 4/10)',
        changes: [],
      };
    }

    applied = true;

    // MUDANÇA 1: Reduzir intensidade inicial
    const firstPhase = protocol.modifiedPhases[0];
    if (firstPhase) {
      firstPhase.exercises.forEach((exercise, exIndex) => {
        // Reduzir séries em ~25%
        const originalSets = exercise.sets;
        exercise.sets = Math.max(1, Math.ceil(exercise.sets * 0.75));

        if (originalSets !== exercise.sets) {
          changes.push({
            field: `phases[0].exercises[${exIndex}].sets`,
            originalValue: originalSets,
            newValue: exercise.sets,
            rationale: 'Reduced initial intensity due to current pain symptoms',
          });
        }

        // Reduzir carga se aplicável
        if (exercise.load && exercise.load !== 'bodyweight') {
          const originalLoad = exercise.load;
          exercise.load = this.reduceLoad(exercise.load);

          changes.push({
            field: `phases[0].exercises[${exIndex}].load`,
            originalValue: originalLoad,
            newValue: exercise.load,
            rationale: 'Reduced load due to current pain symptoms',
          });
        }
      });
    }

    // MUDANÇA 2: Adicionar warm-up estendido
    protocol.additionalNotes.push(
      `SINTOMAS PRESENTES: Inicie SEMPRE com 10-15min de aquecimento geral e mobilidade da região afetada`,
    );
    protocol.additionalNotes.push(
      `Localizações com dor: ${relevantSymptoms.map((s) => `${s.location} (${s.severity}/10)`).join(', ')}`,
    );

    // MUDANÇA 3: Adicionar critério de progressão
    protocol.modifiedPhases.forEach((phase) => {
      if (phase.advancementCriteria) {
        if (!phase.advancementCriteria.qualitativeCriteria) {
          phase.advancementCriteria.qualitativeCriteria = [];
        }

        phase.advancementCriteria.qualitativeCriteria.unshift(
          'Ausência de dor durante e após os exercícios (escala 0-2/10)',
        );
      }
    });

    // MUDANÇA 4: Nota de monitoramento
    protocol.additionalNotes.push(
      `MONITORAMENTO: Registre nível de dor ANTES, DURANTE e APÓS cada sessão`,
    );
    protocol.additionalNotes.push(
      `Se dor aumentar >2 pontos durante exercício: PARE imediatamente e consulte profissional`,
    );

    this.logger.debug(
      `RULE 5: Applied pain management modifications for ${relevantSymptoms.length} symptoms`,
    );

    return {
      rule: 'RULE_5_CURRENT_SYMPTOMS',
      applied,
      reason: `Current pain symptoms: ${relevantSymptoms.map((s) => `${s.location} (${s.severity}/10)`).join(', ')}`,
      changes,
    };
  }

  /**
   * HELPER: Encontra lesões relevantes ao tipo de desvio
   */
  private findRelevantInjuries(
    injuries: InjuryRecord[],
    deviationType: string,
  ): InjuryRecord[] {
    const relevanceMap: Record<string, string[]> = {
      knee_valgus: ['knee', 'joelho', 'acl', 'lcl', 'meniscus', 'lca', 'lcm'],
      butt_wink: ['hip', 'quadril', 'lower_back', 'lombar', 'lumbar'],
      forward_lean: ['ankle', 'tornozelo', 'hip', 'quadril', 'lower_back', 'lombar'],
      heel_rise: ['ankle', 'tornozelo', 'achilles', 'aquiles', 'calf', 'panturrilha'],
      asymmetric_loading: ['knee', 'joelho', 'hip', 'quadril', 'leg', 'perna'],
    };

    const keywords = relevanceMap[deviationType] || [];

    return injuries.filter((injury) => {
      const location = injury.location.toLowerCase();
      const type = injury.type.toLowerCase();

      return keywords.some(
        (keyword) => location.includes(keyword) || type.includes(keyword),
      );
    });
  }

  /**
   * HELPER: Reduz um nível de carga
   */
  private reduceLoad(currentLoad: string): string {
    const loadHierarchy = ['bodyweight', 'light', 'moderate', 'heavy'];
    const currentIndex = loadHierarchy.indexOf(currentLoad);

    if (currentIndex > 0) {
      return loadHierarchy[currentIndex - 1];
    }

    return currentLoad; // Já é bodyweight
  }

  /**
   * HELPER: Encontra exercício alternativo baseado em equipamento
   */
  private findAlternativeExercise(
    exercise: Exercise,
    availableEquipment: string[],
  ): Exercise | null {
    // Primeiro: verificar tabela de alternativas pré-definidas
    const alternatives = this.exerciseAlternatives[exercise.exerciseId];

    if (alternatives) {
      for (const equipment of availableEquipment) {
        if (alternatives[equipment]) {
          const altId = alternatives[equipment];
          // Criar exercício alternativo (simplificado - em produção buscaria de DB)
          return {
            ...exercise,
            exerciseId: altId,
            name: exercise.name.replace(/\(.*\)/, `(${equipment})`),
            equipment: [equipment],
          };
        }
      }
    }

    // Fallback: se exercício permite bodyweight, usar isso
    if (availableEquipment.includes('bodyweight')) {
      return {
        ...exercise,
        equipment: ['bodyweight'],
        load: 'bodyweight',
        name: exercise.name + ' (bodyweight)',
      };
    }

    return null;
  }
}
