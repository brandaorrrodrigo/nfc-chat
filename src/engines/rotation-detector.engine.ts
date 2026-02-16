/**
 * Engine de Detecção de Rotação Axial
 *
 * Detecta e classifica compensações rotacionais através de análise
 * biplanar ou triplanar de assimetrias bilaterais.
 */

import type {
  FrameAnalysis,
  LandmarkData,
  RotationAnalysis
} from '../types/biomechanical-analysis.types';
import {
  CaptureMode,
  RotationConfidence,
  RotationType,
  RotationOrigin,
  BIOMECHANICAL_THRESHOLDS
} from '../types/biomechanical-analysis.types';

/**
 * Interface para comparação bilateral de landmarks
 */
interface BilateralComparison {
  leftShoulder: { x: number; y: number; z?: number };
  rightShoulder: { x: number; y: number; z?: number };
  leftHip: { x: number; y: number; z?: number };
  rightHip: { x: number; y: number; z?: number };
  leftKnee: { x: number; y: number; z?: number };
  rightKnee: { x: number; y: number; z?: number };
}

/**
 * Engine singleton para detecção de rotação
 */
class RotationDetectorEngine {
  /**
   * Extrai landmarks bilaterais para análise de assimetria
   * @param landmarks - Array de landmarks do MediaPipe
   * @returns Objeto com landmarks pareados ou null se incompleto
   */
  private extractBilateralLandmarks(
    landmarks: LandmarkData[]
  ): BilateralComparison | null {
    const requiredLandmarks = [
      'left_shoulder',
      'right_shoulder',
      'left_hip',
      'right_hip',
      'left_knee',
      'right_knee'
    ];

    // Validar que todos os landmarks necessários estão presentes e visíveis
    const landmarkMap = new Map<string, LandmarkData>();
    for (const lm of landmarks) {
      if (requiredLandmarks.includes(lm.name) && lm.visible && !lm.occluded) {
        landmarkMap.set(lm.name, lm);
      }
    }

    // Verificar se todos estão presentes
    if (landmarkMap.size !== requiredLandmarks.length) {
      return null;
    }

    return {
      leftShoulder: landmarkMap.get('left_shoulder')!,
      rightShoulder: landmarkMap.get('right_shoulder')!,
      leftHip: landmarkMap.get('left_hip')!,
      rightHip: landmarkMap.get('right_hip')!,
      leftKnee: landmarkMap.get('left_knee')!,
      rightKnee: landmarkMap.get('right_knee')!
    };
  }

  /**
   * Calcula assimetria no plano sagital
   * @param bilateral - Landmarks bilaterais
   * @returns Assimetria em graus
   */
  private calculateSagittalAsymmetry(bilateral: BilateralComparison): number {
    // Calcular ângulo ombro-quadril esquerdo (plano sagital)
    const leftAngle = Math.atan2(
      bilateral.leftHip.y - bilateral.leftShoulder.y,
      bilateral.leftHip.x - bilateral.leftShoulder.x
    );

    // Calcular ângulo ombro-quadril direito (plano sagital)
    const rightAngle = Math.atan2(
      bilateral.rightHip.y - bilateral.rightShoulder.y,
      bilateral.rightHip.x - bilateral.rightShoulder.x
    );

    // Converter para graus e retornar diferença absoluta
    const leftDegrees = (leftAngle * 180) / Math.PI;
    const rightDegrees = (rightAngle * 180) / Math.PI;

    return Math.abs(leftDegrees - rightDegrees);
  }

  /**
   * Calcula assimetria no plano frontal (requer coordenadas Z)
   * @param bilateral - Landmarks bilaterais
   * @returns Assimetria em graus (0 se sem coordenadas Z)
   */
  private calculateFrontalAsymmetry(bilateral: BilateralComparison): number {
    // Verificar se há coordenadas Z disponíveis
    if (
      bilateral.leftShoulder.z === undefined ||
      bilateral.rightShoulder.z === undefined ||
      bilateral.leftHip.z === undefined ||
      bilateral.rightHip.z === undefined
    ) {
      return 0;
    }

    // Diferença de profundidade (eixo Z) entre ombros
    const shoulderDepthDiff = Math.abs(
      bilateral.leftShoulder.z - bilateral.rightShoulder.z
    );

    // Diferença de profundidade entre quadris
    const hipDepthDiff = Math.abs(bilateral.leftHip.z - bilateral.rightHip.z);

    // Calcular largura dos ombros para normalizar
    const shoulderWidth = Math.abs(
      bilateral.leftShoulder.x - bilateral.rightShoulder.x
    );

    // Converter diferença de profundidade para graus de rotação
    // atan(depthDiff / width) aproxima o ângulo de rotação
    const shoulderRotation = Math.atan(shoulderDepthDiff / shoulderWidth);
    const hipRotation = Math.atan(hipDepthDiff / shoulderWidth);

    // Retornar o máximo entre rotação de ombro e quadril (em graus)
    return Math.max(
      (shoulderRotation * 180) / Math.PI,
      (hipRotation * 180) / Math.PI
    );
  }

  /**
   * Determina confiança da detecção baseado no modo de captura e assimetrias
   * @param mode - Modo de captura
   * @param sagittalAsymmetry - Assimetria sagital em graus
   * @param frontalAsymmetry - Assimetria frontal em graus
   * @returns Objeto com confiança e score
   */
  private determineRotationConfidence(
    mode: CaptureMode,
    sagittalAsymmetry: number,
    frontalAsymmetry: number
  ): { confidence: RotationConfidence; score: number } {
    const { negligible } = BIOMECHANICAL_THRESHOLDS.rotation;

    switch (mode) {
      case CaptureMode.ESSENTIAL:
        // Apenas 1 plano - confiança limitada
        if (sagittalAsymmetry < negligible) {
          return { confidence: 'NOT_MEASURABLE' as RotationConfidence, score: 0 };
        }
        return {
          confidence: 'INFERRED' as RotationConfidence,
          score: Math.min(45, sagittalAsymmetry * 3)
        };

      case CaptureMode.ADVANCED:
        // 2 planos ortogonais - confiança moderada/alta
        const totalAsymmetry = sagittalAsymmetry + frontalAsymmetry;
        if (totalAsymmetry < BIOMECHANICAL_THRESHOLDS.rotation.minor) {
          return { confidence: 'INFERRED' as RotationConfidence, score: 40 };
        }
        return {
          confidence: 'PROBABLE' as RotationConfidence,
          score: Math.min(80, totalAsymmetry * 2)
        };

      case CaptureMode.PRO:
        // 3 planos - alta confiança (reconstrução 3D)
        const total = sagittalAsymmetry + frontalAsymmetry;
        if (total < BIOMECHANICAL_THRESHOLDS.rotation.minor) {
          return { confidence: 'PROBABLE' as RotationConfidence, score: 70 };
        }
        return {
          confidence: 'CONFIRMED' as RotationConfidence,
          score: Math.min(98, 80 + total)
        };

      default:
        return { confidence: 'NOT_MEASURABLE' as RotationConfidence, score: 0 };
    }
  }

  /**
   * Classifica o tipo de rotação detectada
   * @param bilateral - Landmarks bilaterais
   * @param sagittalAsym - Assimetria sagital
   * @param frontalAsym - Assimetria frontal
   * @param exerciseName - Nome do exercício
   * @returns Tipo de rotação classificado
   */
  private classifyRotationType(
    bilateral: BilateralComparison,
    sagittalAsym: number,
    frontalAsym: number,
    exerciseName: string
  ): RotationType {
    const totalAsym = sagittalAsym + frontalAsym;
    const { negligible, severe } = BIOMECHANICAL_THRESHOLDS.rotation;

    // Sem rotação significativa
    if (totalAsym < negligible) {
      return 'NONE' as RotationType;
    }

    // Exercícios com rotação técnica intencional
    const technicalExercises = [
      'arranque',
      'arremesso',
      'landmine',
      'pallof',
      'woodchop',
      'rotacional'
    ];
    const isTechnical = technicalExercises.some((ex) =>
      exerciseName.toLowerCase().includes(ex)
    );
    if (isTechnical) {
      return 'TECHNICAL' as RotationType;
    }

    // Assimetria severa sugere origem estrutural
    if (totalAsym > severe) {
      return 'STRUCTURAL' as RotationType;
    }

    // Assimetria moderada sugere déficit funcional
    if (totalAsym > BIOMECHANICAL_THRESHOLDS.rotation.moderate) {
      return 'FUNCTIONAL' as RotationType;
    }

    // Padrão padrão: funcional
    return 'FUNCTIONAL' as RotationType;
  }

  /**
   * Identifica origem anatômica da rotação
   * @param bilateral - Landmarks bilaterais
   * @returns Origem da rotação
   */
  private identifyRotationOrigin(bilateral: BilateralComparison): RotationOrigin {
    // Calcular assimetrias verticais (eixo Y)
    const shoulderAsymmetry = Math.abs(
      bilateral.leftShoulder.y - bilateral.rightShoulder.y
    );
    const hipAsymmetry = Math.abs(bilateral.leftHip.y - bilateral.rightHip.y);
    const kneeAsymmetry = Math.abs(bilateral.leftKnee.y - bilateral.rightKnee.y);

    // Identificar segmento com maior assimetria
    const maxAsymmetry = Math.max(shoulderAsymmetry, hipAsymmetry, kneeAsymmetry);

    // Threshold para considerar assimetria significativa (normalizado 0-1)
    const SIGNIFICANT_THRESHOLD = 0.05;

    if (maxAsymmetry === shoulderAsymmetry) {
      // Diferença grande sugere origem torácica, pequena escapular
      return shoulderAsymmetry > SIGNIFICANT_THRESHOLD
        ? ('THORACIC' as RotationOrigin)
        : ('SCAPULAR' as RotationOrigin);
    }

    if (maxAsymmetry === hipAsymmetry) {
      // Diferença grande sugere origem lombar, pequena pélvica
      return hipAsymmetry > SIGNIFICANT_THRESHOLD
        ? ('LUMBAR' as RotationOrigin)
        : ('PELVIC' as RotationOrigin);
    }

    if (maxAsymmetry === kneeAsymmetry) {
      return 'FEMORAL' as RotationOrigin;
    }

    // Múltiplos segmentos com assimetria similar
    return 'MULTI_SEGMENTAL' as RotationOrigin;
  }

  /**
   * Analisa rotação axial através de múltiplos frames
   * @param frames - Array de frames analisados
   * @param mode - Modo de captura
   * @param exerciseName - Nome do exercício
   * @returns Análise completa de rotação
   */
  public analyzeRotation(
    frames: FrameAnalysis[],
    mode: CaptureMode,
    exerciseName: string
  ): RotationAnalysis {
    // Filtrar frames com landmarks completos
    const validFrames = frames
      .map((frame) => ({
        frame,
        bilateral: this.extractBilateralLandmarks(frame.landmarks)
      }))
      .filter((f) => f.bilateral !== null);

    // Se nenhum frame válido, retornar análise vazia
    if (validFrames.length === 0) {
      return {
        detected: false,
        confidence: 'NOT_MEASURABLE' as RotationConfidence,
        confidenceScore: 0,
        type: 'NONE' as RotationType,
        origin: 'MULTI_SEGMENTAL' as RotationOrigin,
        magnitude: 0,
        asymmetryScore: 0,
        bilateralDifference: {
          shoulder: 0,
          hip: 0,
          knee: 0
        },
        detectionMethod: 'Análise insuficiente - landmarks incompletos'
      };
    }

    // Calcular assimetrias médias
    let totalSagittalAsym = 0;
    let totalFrontalAsym = 0;

    for (const { bilateral } of validFrames) {
      totalSagittalAsym += this.calculateSagittalAsymmetry(bilateral!);
      totalFrontalAsym += this.calculateFrontalAsymmetry(bilateral!);
    }

    const avgSagittalAsym = totalSagittalAsym / validFrames.length;
    const avgFrontalAsym = totalFrontalAsym / validFrames.length;

    // Usar frame do meio para análise de origem
    const middleFrame = validFrames[Math.floor(validFrames.length / 2)];
    const bilateral = middleFrame.bilateral!;

    // Determinar confiança
    const { confidence, score } = this.determineRotationConfidence(
      mode,
      avgSagittalAsym,
      avgFrontalAsym
    );

    // Classificar tipo
    const type = this.classifyRotationType(
      bilateral,
      avgSagittalAsym,
      avgFrontalAsym,
      exerciseName
    );

    // Identificar origem
    const origin = this.identifyRotationOrigin(bilateral);

    // Calcular magnitude (combinação vetorial)
    const magnitude = Math.sqrt(
      avgSagittalAsym ** 2 + avgFrontalAsym ** 2
    );

    // Calcular asymmetryScore (0-100)
    const asymmetryScore = Math.min(100, magnitude * 3);

    // Calcular diferenças bilaterais individuais
    const shoulderDiff = Math.abs(
      bilateral.leftShoulder.y - bilateral.rightShoulder.y
    ) * 180; // Aproximação em graus
    const hipDiff = Math.abs(bilateral.leftHip.y - bilateral.rightHip.y) * 180;
    const kneeDiff = Math.abs(bilateral.leftKnee.y - bilateral.rightKnee.y) * 180;

    // Determinar método de detecção
    const detectionMethod =
      mode === CaptureMode.PRO
        ? 'Reconstrução vetorial tridimensional'
        : mode === CaptureMode.ADVANCED
        ? 'Análise biplanar ortogonal (sagital + frontal)'
        : 'Inferência através de assimetria sagital';

    return {
      detected: magnitude >= BIOMECHANICAL_THRESHOLDS.rotation.negligible,
      confidence,
      confidenceScore: score,
      type,
      origin,
      magnitude,
      asymmetryScore,
      bilateralDifference: {
        shoulder: Math.round(shoulderDiff * 100) / 100,
        hip: Math.round(hipDiff * 100) / 100,
        knee: Math.round(kneeDiff * 100) / 100
      },
      detectionMethod
    };
  }
}

/**
 * Instância singleton do engine de detecção de rotação
 */
export const rotationDetector = new RotationDetectorEngine();
