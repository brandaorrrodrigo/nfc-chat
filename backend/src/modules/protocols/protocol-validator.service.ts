/**
 * Protocol Validator Service
 *
 * Responsável por validar protocolos corretivos em diferentes estágios:
 * 1. Validação de protocolo base (carregado do JSON)
 * 2. Validação de protocolo personalizado (após aplicação de regras)
 *
 * IMPORTANTE: Sistema 100% determinístico - mesmas entradas = mesmas saídas
 */

import { Injectable, Logger } from '@nestjs/common';
import {
  BaseProtocol,
  PersonalizedProtocol,
  ValidationResult,
  ProtocolPhase,
  Exercise,
} from './interfaces/protocol.interface';

@Injectable()
export class ProtocolValidatorService {
  private readonly logger = new Logger(ProtocolValidatorService.name);

  /**
   * Valida protocolo base carregado do JSON
   *
   * Verifica:
   * - Campos obrigatórios presentes
   * - Estrutura de fases válida
   * - Exercícios com dados completos
   * - Critérios de avanço definidos
   *
   * @param protocol - Protocolo base a validar
   * @returns Resultado da validação com erros e warnings
   */
  validateBaseProtocol(protocol: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validação de campos obrigatórios de nível superior
    if (!protocol) {
      errors.push('Protocol is null or undefined');
      return { valid: false, errors, warnings };
    }

    if (!protocol.protocolId) errors.push('Missing protocolId');
    if (!protocol.version) errors.push('Missing version');
    if (!protocol.deviationType) errors.push('Missing deviationType');
    if (!protocol.severity) errors.push('Missing severity');
    if (!protocol.description) errors.push('Missing description');

    // Validação de severity
    if (
      protocol.severity &&
      !['mild', 'moderate', 'severe'].includes(protocol.severity)
    ) {
      errors.push(
        `Invalid severity: ${protocol.severity}. Must be 'mild', 'moderate', or 'severe'`,
      );
    }

    // Validação de fases
    if (!protocol.phases) {
      errors.push('Missing phases array');
    } else if (!Array.isArray(protocol.phases)) {
      errors.push('Phases must be an array');
    } else if (protocol.phases.length === 0) {
      errors.push('Protocol must have at least one phase');
    } else {
      this.validatePhases(protocol.phases, errors, warnings);
    }

    // Validação de duração total
    if (protocol.totalDurationWeeks !== undefined) {
      if (protocol.totalDurationWeeks <= 0) {
        errors.push('totalDurationWeeks must be positive');
      }

      // Verificar se soma das fases = totalDurationWeeks
      if (protocol.phases && Array.isArray(protocol.phases)) {
        const sumPhaseDurations = protocol.phases.reduce(
          (sum: number, phase: any) => sum + (phase.durationWeeks || 0),
          0,
        );

        if (Math.abs(sumPhaseDurations - protocol.totalDurationWeeks) > 0.1) {
          warnings.push(
            `Sum of phase durations (${sumPhaseDurations}) doesn't match totalDurationWeeks (${protocol.totalDurationWeeks})`,
          );
        }
      }
    }

    // Validação de frequência
    if (protocol.frequencyPerWeek !== undefined) {
      if (protocol.frequencyPerWeek <= 0 || protocol.frequencyPerWeek > 7) {
        errors.push('frequencyPerWeek must be between 1 and 7');
      }
    }

    // Validação de expected outcomes
    if (protocol.expectedOutcomes && !Array.isArray(protocol.expectedOutcomes)) {
      errors.push('expectedOutcomes must be an array');
    }

    // Warnings para campos opcionais importantes
    if (!protocol.prerequisites) {
      warnings.push('No prerequisites defined');
    }

    if (!protocol.contraindications) {
      warnings.push('No contraindications defined');
    }

    if (!protocol.expectedOutcomes || protocol.expectedOutcomes.length === 0) {
      warnings.push('No expected outcomes defined');
    }

    const valid = errors.length === 0;

    if (!valid) {
      this.logger.error(
        `Base protocol validation failed for ${protocol.protocolId || 'unknown'}: ${errors.join('; ')}`,
      );
    } else if (warnings.length > 0) {
      this.logger.warn(
        `Base protocol validation warnings for ${protocol.protocolId}: ${warnings.join('; ')}`,
      );
    }

    return { valid, errors, warnings };
  }

  /**
   * Valida protocolo personalizado (após aplicação de regras)
   *
   * Verificações adicionais:
   * - Duração modificada é razoável (<16 semanas total)
   * - Exercícios não foram completamente removidos
   * - Frequência modificada é realista (1-7x/semana)
   * - Substituições de exercícios são válidas
   *
   * @param protocol - Protocolo personalizado
   * @returns Resultado da validação
   */
  validatePersonalizedProtocol(protocol: PersonalizedProtocol): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Primeiro, validar como protocolo base
    const baseValidation = this.validateBaseProtocol(protocol);
    errors.push(...baseValidation.errors);
    warnings.push(...baseValidation.warnings);

    // Validações específicas de personalização

    // 1. Duração total razoável
    if (protocol.modifiedDurationWeeks) {
      if (protocol.modifiedDurationWeeks > 16) {
        warnings.push(
          `Modified duration very long: ${protocol.modifiedDurationWeeks} weeks (>16 weeks)`,
        );
      }

      if (protocol.modifiedDurationWeeks < 2) {
        warnings.push(
          `Modified duration very short: ${protocol.modifiedDurationWeeks} weeks (<2 weeks)`,
        );
      }
    }

    // 2. Frequência modificada
    if (protocol.modifiedFrequencyPerWeek !== undefined) {
      if (
        protocol.modifiedFrequencyPerWeek <= 0 ||
        protocol.modifiedFrequencyPerWeek > 7
      ) {
        errors.push(
          `Invalid modifiedFrequencyPerWeek: ${protocol.modifiedFrequencyPerWeek}. Must be 1-7`,
        );
      }
    }

    // 3. Fases modificadas devem ter exercícios
    if (protocol.modifiedPhases && Array.isArray(protocol.modifiedPhases)) {
      protocol.modifiedPhases.forEach((phase: ProtocolPhase, index: number) => {
        if (!phase.exercises || phase.exercises.length === 0) {
          errors.push(`Modified phase ${index + 1} has no exercises`);
        }
      });
    }

    // 4. Substituições de exercícios
    if (protocol.substitutedExercises) {
      const substitutionCount = Object.keys(protocol.substitutedExercises).length;

      if (substitutionCount > 0) {
        this.logger.debug(
          `Protocol has ${substitutionCount} exercise substitutions`,
        );
      }

      // Verificar se exercícios substituídos existiam
      const allOriginalExercises = new Set<string>();
      if (protocol.phases) {
        protocol.phases.forEach((phase) => {
          phase.exercises?.forEach((ex) => {
            if (ex.exerciseId) {
              allOriginalExercises.add(ex.exerciseId);
            }
          });
        });
      }

      Object.keys(protocol.substitutedExercises).forEach((originalId) => {
        if (!allOriginalExercises.has(originalId)) {
          warnings.push(
            `Substituted exercise ${originalId} not found in original protocol`,
          );
        }
      });
    }

    // 5. Notas adicionais
    if (!protocol.additionalNotes || protocol.additionalNotes.length === 0) {
      warnings.push('No additional personalization notes provided');
    }

    const valid = errors.length === 0;

    if (!valid) {
      this.logger.error(
        `Personalized protocol validation failed: ${errors.join('; ')}`,
      );
    } else if (warnings.length > 0) {
      this.logger.warn(
        `Personalized protocol validation warnings: ${warnings.join('; ')}`,
      );
    }

    return { valid, errors, warnings };
  }

  /**
   * Valida array de fases
   */
  private validatePhases(
    phases: any[],
    errors: string[],
    warnings: string[],
  ): void {
    phases.forEach((phase, index) => {
      const phaseLabel = `Phase ${index + 1} (${phase.name || 'unnamed'})`;

      // Campos obrigatórios da fase
      if (!phase.phaseNumber) {
        errors.push(`${phaseLabel}: Missing phaseNumber`);
      } else if (phase.phaseNumber !== index + 1) {
        warnings.push(
          `${phaseLabel}: phaseNumber (${phase.phaseNumber}) doesn't match position (${index + 1})`,
        );
      }

      if (!phase.name) {
        errors.push(`${phaseLabel}: Missing name`);
      }

      if (!phase.durationWeeks) {
        errors.push(`${phaseLabel}: Missing durationWeeks`);
      } else if (phase.durationWeeks <= 0) {
        errors.push(`${phaseLabel}: durationWeeks must be positive`);
      }

      if (!phase.goals) {
        warnings.push(`${phaseLabel}: No goals defined`);
      } else if (!Array.isArray(phase.goals) || phase.goals.length === 0) {
        warnings.push(`${phaseLabel}: Goals array is empty`);
      }

      // Validar exercícios da fase
      if (!phase.exercises) {
        errors.push(`${phaseLabel}: Missing exercises array`);
      } else if (!Array.isArray(phase.exercises)) {
        errors.push(`${phaseLabel}: exercises must be an array`);
      } else if (phase.exercises.length === 0) {
        errors.push(`${phaseLabel}: exercises array is empty`);
      } else {
        this.validateExercises(phase.exercises, phaseLabel, errors, warnings);
      }

      // Validar critérios de avanço
      if (!phase.advancementCriteria) {
        warnings.push(`${phaseLabel}: No advancement criteria defined`);
      } else {
        if (!phase.advancementCriteria.requiredWeeks) {
          warnings.push(`${phaseLabel}: No required weeks in advancement criteria`);
        }

        if (
          !phase.advancementCriteria.qualitativeCriteria ||
          phase.advancementCriteria.qualitativeCriteria.length === 0
        ) {
          warnings.push(
            `${phaseLabel}: No qualitative criteria in advancement criteria`,
          );
        }
      }
    });
  }

  /**
   * Valida array de exercícios
   */
  private validateExercises(
    exercises: any[],
    phaseLabel: string,
    errors: string[],
    warnings: string[],
  ): void {
    exercises.forEach((exercise, index) => {
      const exLabel = `${phaseLabel}, Exercise ${index + 1} (${exercise.name || 'unnamed'})`;

      // Campos obrigatórios
      if (!exercise.exerciseId) {
        errors.push(`${exLabel}: Missing exerciseId`);
      }

      if (!exercise.name) {
        errors.push(`${exLabel}: Missing name`);
      }

      if (!exercise.category) {
        warnings.push(`${exLabel}: Missing category`);
      } else if (
        !['mobility', 'activation', 'strength', 'integration'].includes(
          exercise.category,
        )
      ) {
        warnings.push(
          `${exLabel}: Invalid category '${exercise.category}'. Expected: mobility, activation, strength, or integration`,
        );
      }

      if (exercise.sets === undefined || exercise.sets === null) {
        errors.push(`${exLabel}: Missing sets`);
      } else if (exercise.sets <= 0) {
        errors.push(`${exLabel}: sets must be positive`);
      }

      if (!exercise.reps) {
        errors.push(`${exLabel}: Missing reps`);
      }

      if (exercise.rest === undefined || exercise.rest === null) {
        warnings.push(`${exLabel}: No rest period defined`);
      }

      if (!exercise.equipment || exercise.equipment.length === 0) {
        warnings.push(`${exLabel}: No equipment specified`);
      }

      if (!exercise.cues || exercise.cues.length === 0) {
        warnings.push(`${exLabel}: No coaching cues provided`);
      }
    });
  }

  /**
   * Validação rápida (apenas erros críticos)
   */
  quickValidate(protocol: any): boolean {
    if (!protocol) return false;
    if (!protocol.protocolId) return false;
    if (!protocol.phases || protocol.phases.length === 0) return false;

    // Verificar que todas as fases têm exercícios
    for (const phase of protocol.phases) {
      if (!phase.exercises || phase.exercises.length === 0) {
        return false;
      }
    }

    return true;
  }
}
