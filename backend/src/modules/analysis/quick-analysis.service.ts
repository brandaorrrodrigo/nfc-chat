import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoldStandardService } from '../gold-standards/gold-standard.service';
import {
  SimilarityCalculatorService,
  SimilarityResult,
} from '../gold-standards/similarity-calculator.service';
import {
  QuickAnalysisInputDto,
  QuickAnalysisOutputDto,
  ScoreClassification,
} from './dto/quick-analysis.dto';
import {
  IFrame,
  IFrameAnalysis,
  IGoldPhase,
  IFrameAngles,
  IGoldAngles,
} from './interfaces/frame.interface';
import {
  IDeviation,
  IAggregatedDeviation,
  ICommonCompensation,
  DeviationSeverity,
  DeviationTrend,
  DeviationType,
} from './interfaces/deviation.interface';

/**
 * Serviço responsável pela CAMADA 1 do pipeline híbrido:
 * Análise rápida com comparação ao gold standard
 *
 * Pipeline:
 * 1. Buscar gold standard do exercício
 * 2. Comparar cada frame com fase correspondente
 * 3. Detectar desvios biomecânicos
 * 4. Calcular score global e similaridade
 * 5. Salvar resultado no banco
 *
 * Tempo esperado: 200-500ms
 */
@Injectable()
export class QuickAnalysisService {
  private readonly logger = new Logger(QuickAnalysisService.name);

  constructor(
    private prisma: PrismaService,
    private goldStandardService: GoldStandardService,
    private similarityCalculator: SimilarityCalculatorService,
  ) {}

  /**
   * Executa análise rápida do vídeo comparando com gold standard
   *
   * @param input - Dados do vídeo com frames extraídos
   * @returns Resultado da análise rápida com score e desvios
   *
   * @throws {NotFoundException} Se gold standard não for encontrado
   * @throws {Error} Se análise falhar
   *
   * @example
   * ```typescript
   * const result = await quickAnalysis.analyze({
   *   videoPath: '/uploads/video_123.mp4',
   *   exerciseId: 'back-squat',
   *   userId: 'user_123',
   *   frames: [...]
   * });
   *
   * console.log(`Score: ${result.overall_score}/10`);
   * console.log(`Similaridade: ${(result.similarity_to_gold * 100).toFixed(1)}%`);
   * ```
   */
  async analyze(
    input: QuickAnalysisInputDto,
  ): Promise<QuickAnalysisOutputDto> {
    const startTime = Date.now();
    this.logger.log(
      `Starting quick analysis for exercise=${input.exerciseId}, user=${input.userId}, frames=${input.frames.length}`,
    );

    try {
      // 1. Buscar gold standard do exercício (cache L2)
      const goldStandard = await this.goldStandardService.getByExercise(
        input.exerciseId,
      );

      if (!goldStandard) {
        throw new NotFoundException(
          `Gold standard not found for exercise ${input.exerciseId}`,
        );
      }

      this.logger.debug(
        `Gold standard loaded: ${goldStandard.exercise_id} v${goldStandard.version}`,
      );

      // 2. Comparar cada frame com fase correspondente do gold standard
      const framesAnalysis: IFrameAnalysis[] = [];
      const allDeviations: IDeviation[] = [];

      for (const frame of input.frames) {
        const goldPhase = this.matchPhaseFromAngles(
          frame.angles,
          goldStandard.phases_data as any,
        );

        // Calcular similaridade frame-a-frame
        const frameSimilarity = this.similarityCalculator.calculateFrameSimilarity(
          frame.angles,
          goldPhase.angles,
          goldStandard.similarity_weights as any,
        );

        // Detectar desvios neste frame
        const frameDeviations = this.detectDeviations(
          frame.angles,
          goldPhase.angles,
          goldStandard.common_compensations as any,
          frame.frame_number,
        );

        framesAnalysis.push({
          frame_number: frame.frame_number,
          timestamp_ms: frame.timestamp_ms,
          phase: goldPhase.phase_name,
          angles: frame.angles,
          similarity: frameSimilarity.overall,
          similarity_by_joint: frameSimilarity.byJoint,
          deviations: frameDeviations,
          score: this.calculateFrameScore(
            frameSimilarity.overall,
            frameDeviations,
          ),
        });

        allDeviations.push(...frameDeviations);
      }

      this.logger.debug(
        `Analyzed ${framesAnalysis.length} frames, detected ${allDeviations.length} raw deviations`,
      );

      // 3. Agregar desvios (agrupar por tipo)
      const aggregatedDeviations = this.aggregateDeviations(
        allDeviations,
        input.frames.length,
      );

      // 4. Calcular score global e similaridade média
      const overallSimilarity =
        framesAnalysis.reduce((sum, f) => sum + f.similarity, 0) /
        framesAnalysis.length;

      const overallScore = this.calculateOverallScore(
        framesAnalysis,
        aggregatedDeviations,
      );

      const classification = this.classifyScore(overallScore);

      const processingTime = Date.now() - startTime;

      // 5. Salvar no banco
      const quickResult = await this.saveQuickAnalysis({
        video_analysis_id: input.videoPath, // Será linkado à análise mãe
        overall_score: overallScore,
        classification,
        similarity_to_gold: overallSimilarity,
        frames_data: framesAnalysis,
        deviations_detected: aggregatedDeviations,
        processing_time_ms: processingTime,
      });

      this.logger.log(
        `Quick analysis completed in ${processingTime}ms: score=${overallScore.toFixed(2)}, similarity=${(overallSimilarity * 100).toFixed(1)}%, deviations=${aggregatedDeviations.length}`,
      );

      return {
        id: quickResult.id,
        overall_score: quickResult.overall_score,
        classification: quickResult.classification as ScoreClassification,
        similarity_to_gold: quickResult.similarity_to_gold,
        frames_data: JSON.parse(quickResult.frames_data as string),
        deviations_detected: JSON.parse(
          quickResult.deviations_detected as string,
        ),
        processing_time_ms: quickResult.processing_time_ms,
        created_at: quickResult.created_at,
      };
    } catch (error) {
      this.logger.error(
        `Quick analysis failed: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Detecta desvios comparando ângulos do usuário com gold standard
   * usando regras catalogadas de compensações comuns
   *
   * @param userAngles - Ângulos medidos do usuário
   * @param goldAngles - Ângulos ideais do gold standard
   * @param commonCompensations - Regras de desvios do catálogo
   * @param frameNumber - Número do frame atual
   * @returns Lista de desvios detectados
   */
  private detectDeviations(
    userAngles: IFrameAngles,
    goldAngles: IGoldAngles,
    commonCompensations: ICommonCompensation[],
    frameNumber: number,
  ): IDeviation[] {
    const deviations: IDeviation[] = [];

    // Iterar por cada compensação comum catalogada
    for (const compensation of commonCompensations) {
      try {
        const detected = this.evaluateDeviationRule(
          compensation,
          userAngles,
          goldAngles,
          frameNumber,
        );

        if (detected) {
          deviations.push(detected);
        }
      } catch (error) {
        this.logger.warn(
          `Error evaluating deviation rule ${compensation.id}: ${error.message}`,
        );
      }
    }

    return deviations;
  }

  /**
   * Avalia regra de detecção de um desvio específico
   *
   * Implementa lógica específica para cada tipo de desvio:
   * - knee_valgus: valgo dinâmico dos joelhos
   * - butt_wink: retroversão pélvica no fundo
   * - forward_lean: inclinação excessiva do tronco
   * - heel_rise: elevação dos calcanhares
   * - asymmetric_loading: assimetria bilateral
   *
   * @param deviationRule - Regra do catálogo de desvios
   * @param userAngles - Ângulos do usuário
   * @param goldAngles - Ângulos do gold standard
   * @param frameNumber - Número do frame
   * @returns Desvio detectado ou null
   */
  private evaluateDeviationRule(
    deviationRule: ICommonCompensation,
    userAngles: IFrameAngles,
    goldAngles: IGoldAngles,
    frameNumber: number,
  ): IDeviation | null {
    const { id, severity_thresholds, description } = deviationRule;

    // KNEE VALGUS: Valgo dinâmico (joelhos colapsando para dentro)
    if (id === 'knee_valgus') {
      const kneeLeft = userAngles.knee_left;
      const kneeRight = userAngles.knee_right;
      const goldKneeLeft = goldAngles.knee_left.ideal;
      const goldKneeRight = goldAngles.knee_right.ideal;

      const deviationLeft = Math.abs(kneeLeft - goldKneeLeft);
      const deviationRight = Math.abs(kneeRight - goldKneeRight);

      const maxDeviation = Math.max(deviationLeft, deviationRight);
      const side = deviationLeft > deviationRight ? 'left' : 'right';

      const severity = this.determineSeverity(
        maxDeviation,
        severity_thresholds,
      );

      if (severity) {
        return {
          type: 'knee_valgus',
          severity,
          location: `knee_${side}`,
          value: maxDeviation,
          frame_number: frameNumber,
          description,
        };
      }
    }

    // BUTT WINK: Retroversão pélvica (perda da lordose lombar)
    if (id === 'butt_wink') {
      const hipAngle = userAngles.hip;
      const goldHip = goldAngles.hip.ideal;

      // Butt wink = hip fecha muito além do esperado (retroversão)
      const deviation = goldHip - hipAngle; // Negativo se fechar demais

      if (deviation > 0) {
        // Apenas se fechar além do ideal
        const severity = this.determineSeverity(
          deviation,
          severity_thresholds,
        );

        if (severity) {
          return {
            type: 'butt_wink',
            severity,
            location: 'hip',
            value: deviation,
            frame_number: frameNumber,
            description,
          };
        }
      }
    }

    // FORWARD LEAN: Inclinação excessiva do tronco para frente
    if (id === 'forward_lean') {
      const trunkAngle = userAngles.trunk;
      const goldTrunk = goldAngles.trunk.ideal;

      // Forward lean = tronco mais inclinado que o ideal
      const deviation = trunkAngle - goldTrunk;

      if (deviation > 0) {
        const severity = this.determineSeverity(
          deviation,
          severity_thresholds,
        );

        if (severity) {
          return {
            type: 'forward_lean',
            severity,
            location: 'trunk',
            value: deviation,
            frame_number: frameNumber,
            description,
          };
        }
      }
    }

    // HEEL RISE: Elevação dos calcanhares (falta dorsiflexão)
    if (id === 'heel_rise') {
      const ankleLeft = userAngles.ankle_left;
      const ankleRight = userAngles.ankle_right;
      const goldAnkleLeft = goldAngles.ankle_left.ideal;
      const goldAnkleRight = goldAngles.ankle_right.ideal;

      // Heel rise = tornozelo não atinge dorsiflexão adequada
      const deviationLeft = goldAnkleLeft - ankleLeft;
      const deviationRight = goldAnkleRight - ankleRight;

      const maxDeviation = Math.max(deviationLeft, deviationRight);
      const side = deviationLeft > deviationRight ? 'left' : 'right';

      if (maxDeviation > 0) {
        const severity = this.determineSeverity(
          maxDeviation,
          severity_thresholds,
        );

        if (severity) {
          return {
            type: 'heel_rise',
            severity,
            location: `ankle_${side}`,
            value: maxDeviation,
            frame_number: frameNumber,
            description,
          };
        }
      }
    }

    // ASYMMETRIC LOADING: Assimetria bilateral
    if (id === 'asymmetric_loading') {
      const kneeDiff = Math.abs(userAngles.knee_left - userAngles.knee_right);
      const ankleDiff = Math.abs(
        userAngles.ankle_left - userAngles.ankle_right,
      );

      const maxAsymmetry = Math.max(kneeDiff, ankleDiff);
      const location = kneeDiff > ankleDiff ? 'knees' : 'ankles';

      const severity = this.determineSeverity(
        maxAsymmetry,
        severity_thresholds,
      );

      if (severity) {
        return {
          type: 'asymmetric_loading',
          severity,
          location,
          value: maxAsymmetry,
          frame_number: frameNumber,
          description,
        };
      }
    }

    return null;
  }

  /**
   * Determina severidade baseado em thresholds do catálogo
   *
   * @param value - Valor do desvio
   * @param thresholds - Thresholds de severidade
   * @returns Severidade ou null se abaixo do threshold mild
   */
  private determineSeverity(
    value: number,
    thresholds: any,
  ): DeviationSeverity | null {
    try {
      const severeMin = parseFloat(
        thresholds.severe.angle_deviation.split('-')[0],
      );
      const moderateMin = parseFloat(
        thresholds.moderate.angle_deviation.split('-')[0],
      );
      const mildMin = parseFloat(thresholds.mild.angle_deviation.split('-')[0]);

      if (value >= severeMin) return 'severe';
      if (value >= moderateMin) return 'moderate';
      if (value >= mildMin) return 'mild';

      return null;
    } catch (error) {
      this.logger.warn(`Error parsing thresholds: ${error.message}`);
      return null;
    }
  }

  /**
   * Agrupa desvios por tipo e calcula estatísticas
   *
   * @param deviations - Lista de desvios detectados
   * @param totalFrames - Total de frames analisados
   * @returns Lista de desvios agregados com tendências
   */
  private aggregateDeviations(
    deviations: IDeviation[],
    totalFrames: number,
  ): IAggregatedDeviation[] {
    try {
      const grouped = deviations.reduce((acc, dev) => {
        if (!acc[dev.type]) {
          acc[dev.type] = [];
        }
        acc[dev.type].push(dev);
        return acc;
      }, {} as Record<string, IDeviation[]>);

      return Object.entries(grouped).map(([type, devs]) => {
        const frames = devs.map((d) => d.frame_number);
        const avgValue = devs.reduce((sum, d) => sum + d.value, 0) / devs.length;
        const maxSeverity = this.getMaxSeverity(devs.map((d) => d.severity));
        const trend = this.detectTrend(devs);

        return {
          type: type as DeviationType,
          severity: maxSeverity,
          frames_affected: frames,
          percentage: (frames.length / totalFrames) * 100,
          average_value: avgValue,
          trend,
        };
      });
    } catch (error) {
      this.logger.error(`Error aggregating deviations: ${error.message}`);
      return [];
    }
  }

  /**
   * Retorna a severidade máxima de uma lista
   */
  private getMaxSeverity(severities: DeviationSeverity[]): DeviationSeverity {
    if (severities.includes('severe')) return 'severe';
    if (severities.includes('moderate')) return 'moderate';
    return 'mild';
  }

  /**
   * Detecta tendência do desvio ao longo do tempo
   * (útil para identificar fadiga)
   *
   * @param deviations - Lista de desvios ordenados temporalmente
   * @returns Tendência: increasing, decreasing, stable
   */
  private detectTrend(deviations: IDeviation[]): DeviationTrend {
    if (deviations.length < 3) return 'stable';

    try {
      const values = deviations.map((d) => d.value);
      const midpoint = Math.floor(values.length / 2);

      const first = values.slice(0, midpoint);
      const last = values.slice(midpoint);

      const avgFirst = first.reduce((a, b) => a + b, 0) / first.length;
      const avgLast = last.reduce((a, b) => a + b, 0) / last.length;

      if (avgLast > avgFirst * 1.2) return 'increasing'; // Piora > 20%
      if (avgLast < avgFirst * 0.8) return 'decreasing'; // Melhora > 20%
      return 'stable';
    } catch (error) {
      this.logger.warn(`Error detecting trend: ${error.message}`);
      return 'stable';
    }
  }

  /**
   * Calcula score de um frame individual (0-10)
   */
  private calculateFrameScore(
    similarity: number,
    deviations: IDeviation[],
  ): number {
    let score = similarity * 10; // Base: 0-10

    // Penalizar por desvios
    for (const dev of deviations) {
      if (dev.severity === 'severe') score -= 3;
      else if (dev.severity === 'moderate') score -= 2;
      else score -= 1;
    }

    return Math.max(0, Math.min(10, score));
  }

  /**
   * Calcula score global da análise (0-10)
   */
  private calculateOverallScore(
    frames: IFrameAnalysis[],
    deviations: IAggregatedDeviation[],
  ): number {
    if (frames.length === 0) return 0;

    const avgFrameScore =
      frames.reduce((sum, f) => sum + f.score, 0) / frames.length;

    // Penalizar por desvios críticos agregados
    const criticalCount = deviations.filter(
      (d) => d.severity === 'severe' || d.severity === 'moderate',
    ).length;

    const penalty = criticalCount * 0.5;

    return Math.max(0, Math.min(10, avgFrameScore - penalty));
  }

  /**
   * Classifica score em categoria descritiva
   */
  private classifyScore(score: number): ScoreClassification {
    if (score >= 8) return ScoreClassification.EXCELENTE;
    if (score >= 7) return ScoreClassification.BOM;
    if (score >= 5) return ScoreClassification.REGULAR;
    if (score >= 3) return ScoreClassification.RUIM;
    return ScoreClassification.CRITICO;
  }

  /**
   * Determina fase do movimento baseado em ângulos
   * (heurística simplificada: usar ângulo do joelho)
   */
  private matchPhaseFromAngles(angles: IFrameAngles, goldPhases: any): IGoldPhase {
    const kneeAngle = angles.knee_left;

    // Heurística: joelho mais estendido = topo, mais flexionado = fundo
    if (kneeAngle > 150) return goldPhases.eccentric_top;
    if (kneeAngle > 100) return goldPhases.eccentric_mid;
    if (kneeAngle <= 100 && kneeAngle >= 80) return goldPhases.isometric_bottom;

    return goldPhases.concentric;
  }

  /**
   * Salva resultado da análise rápida no banco
   */
  private async saveQuickAnalysis(data: any) {
    try {
      return await this.prisma.quickAnalysisResult.create({
        data: {
          ...data,
          frames_data: JSON.stringify(data.frames_data),
          deviations_detected: JSON.stringify(data.deviations_detected),
        },
      });
    } catch (error) {
      this.logger.error(`Error saving quick analysis: ${error.message}`);
      throw new Error(`Failed to save analysis: ${error.message}`);
    }
  }
}
