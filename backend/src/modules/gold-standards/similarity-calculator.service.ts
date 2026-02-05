import { Injectable, Logger } from '@nestjs/common';
import {
  IFrameAngles,
  IGoldAngles,
  ISimilarityWeights,
} from '../analysis/interfaces/frame.interface';

/**
 * Resultado do cálculo de similaridade
 */
export interface SimilarityResult {
  /** Similaridade global ponderada (0-1) */
  overall: number;
  /** Similaridade por articulação (0-1) */
  byJoint: Record<string, number>;
}

/**
 * Serviço responsável por calcular similaridade entre movimentos do usuário
 * e padrões gold standard usando funções matemáticas com tolerância progressiva
 */
@Injectable()
export class SimilarityCalculatorService {
  private readonly logger = new Logger(SimilarityCalculatorService.name);

  /**
   * Calcula similaridade entre ângulos do usuário e gold standard
   * usando função de similaridade com tolerância progressiva
   *
   * @param userAngles - Ângulos medidos do usuário
   * @param goldAngles - Ângulos ideais do gold standard com tolerâncias
   * @param weights - Pesos para cálculo ponderado
   * @returns Resultado com similaridade global e por articulação
   *
   * @example
   * ```typescript
   * const result = calculator.calculateFrameSimilarity(
   *   { knee_left: 90, knee_right: 92, hip: 85, trunk: 45, ankle_left: 70, ankle_right: 68 },
   *   goldStandard.phases_data.eccentric_mid.angles,
   *   { knee: 0.3, hip: 0.25, trunk: 0.2, ankle: 0.15, symmetry: 0.1 }
   * );
   * console.log(`Similaridade: ${(result.overall * 100).toFixed(1)}%`);
   * ```
   */
  calculateFrameSimilarity(
    userAngles: IFrameAngles,
    goldAngles: IGoldAngles,
    weights: ISimilarityWeights,
  ): SimilarityResult {
    try {
      const similarities: Record<string, number> = {};

      // Calcular similaridade para cada articulação
      for (const joint of ['knee', 'hip', 'trunk', 'ankle']) {
        if (joint === 'knee' || joint === 'ankle') {
          // Bilateral: média de esquerdo e direito
          const leftKey = `${joint}_left` as keyof IFrameAngles;
          const rightKey = `${joint}_right` as keyof IFrameAngles;

          const goldLeft = goldAngles[leftKey];
          const goldRight = goldAngles[rightKey];

          if (!goldLeft || !goldRight) {
            this.logger.warn(
              `Gold angles missing for ${joint}. Using default similarity 0.5`,
            );
            similarities[joint] = 0.5;
            continue;
          }

          const simLeft = this.angleSimilarity(
            userAngles[leftKey],
            goldLeft.ideal,
            goldLeft.tolerance,
          );

          const simRight = this.angleSimilarity(
            userAngles[rightKey],
            goldRight.ideal,
            goldRight.tolerance,
          );

          similarities[joint] = (simLeft + simRight) / 2;

          this.logger.debug(
            `${joint}: left=${simLeft.toFixed(3)}, right=${simRight.toFixed(3)}, avg=${similarities[joint].toFixed(3)}`,
          );
        } else {
          // Unilateral (hip, trunk)
          const key = joint as keyof IFrameAngles;
          const goldJoint = goldAngles[key];

          if (!goldJoint) {
            this.logger.warn(
              `Gold angles missing for ${joint}. Using default similarity 0.5`,
            );
            similarities[joint] = 0.5;
            continue;
          }

          similarities[joint] = this.angleSimilarity(
            userAngles[key],
            goldJoint.ideal,
            goldJoint.tolerance,
          );

          this.logger.debug(
            `${joint}: similarity=${similarities[joint].toFixed(3)}`,
          );
        }
      }

      // Calcular simetria bilateral
      const symmetry = this.calculateSymmetry(userAngles);
      similarities['symmetry'] = symmetry;

      this.logger.debug(`symmetry: ${symmetry.toFixed(3)}`);

      // Similaridade ponderada
      const overall =
        similarities.knee * weights.knee +
        similarities.hip * weights.hip +
        similarities.trunk * weights.trunk +
        similarities.ankle * weights.ankle +
        similarities.symmetry * weights.symmetry;

      this.logger.log(
        `Frame similarity calculated: overall=${(overall * 100).toFixed(1)}%`,
      );

      return {
        overall,
        byJoint: similarities,
      };
    } catch (error) {
      this.logger.error(
        `Error calculating frame similarity: ${error.message}`,
        error.stack,
      );
      throw new Error(`Failed to calculate similarity: ${error.message}`);
    }
  }

  /**
   * Função de similaridade com tolerância progressiva
   * Implementa degradação suave em 3 zonas:
   * - Zona 1 (0-tolerance): similaridade = 1.0 (perfeito)
   * - Zona 2 (tolerance-2x): degradação linear 1.0 → 0.7
   * - Zona 3 (2x-3x): degradação linear 0.7 → 0.4
   * - Além 3x: decaimento exponencial → 0
   *
   * @param user - Ângulo medido do usuário
   * @param ideal - Ângulo ideal do gold standard
   * @param tolerance - Tolerância aceitável em graus
   * @returns Similaridade normalizada (0-1)
   *
   * @example
   * ```typescript
   * // Dentro da tolerância
   * angleSimilarity(90, 92, 5) // → 1.0
   *
   * // Fora da tolerância
   * angleSimilarity(90, 105, 5) // → ~0.4
   * ```
   */
  private angleSimilarity(
    user: number,
    ideal: number,
    tolerance: number,
  ): number {
    const diff = Math.abs(user - ideal);

    if (diff <= tolerance) {
      // Zona 1: Perfeito
      return 1.0;
    } else if (diff <= tolerance * 2) {
      // Zona 2: Degradação linear (1.0 → 0.7)
      const ratio = (diff - tolerance) / tolerance;
      return 1.0 - ratio * 0.3; // 1.0 → 0.7
    } else if (diff <= tolerance * 3) {
      // Zona 3: Degradação linear (0.7 → 0.4)
      const ratio = (diff - tolerance * 2) / tolerance;
      return 0.7 - ratio * 0.3; // 0.7 → 0.4
    } else {
      // Além de 3x tolerance: decai exponencialmente
      const excessDiff = diff - tolerance * 3;
      return Math.max(0, 0.4 * Math.exp(-excessDiff / 50)); // 0.4 → 0
    }
  }

  /**
   * Calcula simetria bilateral comparando lados esquerdo e direito
   * para joelhos e tornozelos
   *
   * Assimetria > 20° nos joelhos = zero symmetry
   * Assimetria > 15° nos tornozelos = zero symmetry
   *
   * @param angles - Ângulos do frame
   * @returns Score de simetria (0-1)
   *
   * @example
   * ```typescript
   * // Movimento simétrico
   * calculateSymmetry({
   *   knee_left: 90, knee_right: 92,
   *   ankle_left: 70, ankle_right: 71
   * }) // → ~0.95
   *
   * // Movimento assimétrico severo
   * calculateSymmetry({
   *   knee_left: 90, knee_right: 110,
   *   ankle_left: 70, ankle_right: 85
   * }) // → ~0.2
   * ```
   */
  private calculateSymmetry(angles: IFrameAngles): number {
    try {
      const kneeDiff = Math.abs(angles.knee_left - angles.knee_right);
      const ankleDiff = Math.abs(angles.ankle_left - angles.ankle_right);

      // Função linear: diff=0 → 1.0, diff=threshold → 0.0
      const kneeSymmetry = Math.max(0, 1 - kneeDiff / 20); // 20° = zero
      const ankleSymmetry = Math.max(0, 1 - ankleDiff / 15); // 15° = zero

      return (kneeSymmetry + ankleSymmetry) / 2;
    } catch (error) {
      this.logger.warn(
        `Error calculating symmetry: ${error.message}. Returning 0.5`,
      );
      return 0.5; // Fallback seguro
    }
  }

  /**
   * Calcula diferença percentual entre dois valores
   *
   * @param value1 - Primeiro valor
   * @param value2 - Segundo valor
   * @returns Diferença percentual (0-100)
   */
  calculatePercentageDifference(value1: number, value2: number): number {
    if (value2 === 0) {
      this.logger.warn('Division by zero in percentage calculation');
      return 100;
    }

    return Math.abs(((value1 - value2) / value2) * 100);
  }

  /**
   * Determina se a similaridade está dentro do aceitável
   *
   * @param similarity - Score de similaridade (0-1)
   * @param threshold - Threshold mínimo aceitável (padrão: 0.7)
   * @returns true se aceitável
   */
  isAcceptableSimilarity(similarity: number, threshold: number = 0.7): boolean {
    return similarity >= threshold;
  }

  /**
   * Classifica similaridade em categorias descritivas
   *
   * @param similarity - Score de similaridade (0-1)
   * @returns Classificação textual
   */
  classifySimilarity(similarity: number): string {
    if (similarity >= 0.9) return 'EXCELENTE';
    if (similarity >= 0.8) return 'MUITO BOM';
    if (similarity >= 0.7) return 'BOM';
    if (similarity >= 0.6) return 'REGULAR';
    if (similarity >= 0.5) return 'RUIM';
    return 'CRÍTICO';
  }
}
