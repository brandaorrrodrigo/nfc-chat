import {
  CaptureMode,
  CameraAngle,
  RotationConfidence,
  RotationType,
  RotationOrigin,
  RotationAnalysis,
  LandmarkData,
  FrameAnalysis,
  BIOMECHANICAL_THRESHOLDS,
  TECHNICAL_MESSAGES
} from '../types/biomechanical-analysis.types';

/**
 * Engine de Detecção e Classificação de Rotação Axial
 *
 * Detecta compensações rotacionais baseado em:
 * - Modo de captura (1, 2 ou 3 ângulos)
 * - Assimetria bilateral
 * - Deslocamento do centro de massa
 * - Diferenças temporais de ativação
 */

interface BilateralComparison {
  leftShoulder: { x: number; y: number; z?: number };
  rightShoulder: { x: number; y: number; z?: number };
  leftHip: { x: number; y: number; z?: number };
  rightHip: { x: number; y: number; z?: number };
  leftKnee: { x: number; y: number; z?: number };
  rightKnee: { x: number; y: number; z?: number };
}

export class RotationDetectorEngine {

  /**
   * Extrai landmarks bilaterais de um frame
   */
  private extractBilateralLandmarks(landmarks: LandmarkData[]): BilateralComparison | null {
    const getLandmark = (name: string) => landmarks.find(l => l.name === name);

    const leftShoulder = getLandmark('left_shoulder');
    const rightShoulder = getLandmark('right_shoulder');
    const leftHip = getLandmark('left_hip');
    const rightHip = getLandmark('right_hip');
    const leftKnee = getLandmark('left_knee');
    const rightKnee = getLandmark('right_knee');

    // Validação: todos landmarks devem estar visíveis
    const required = [leftShoulder, rightShoulder, leftHip, rightHip, leftKnee, rightKnee];
    if (required.some(l => !l || !l.visible)) return null;

    return {
      leftShoulder: { x: leftShoulder!.x, y: leftShoulder!.y, z: leftShoulder!.z },
      rightShoulder: { x: rightShoulder!.x, y: rightShoulder!.y, z: rightShoulder!.z },
      leftHip: { x: leftHip!.x, y: leftHip!.y, z: leftHip!.z },
      rightHip: { x: rightHip!.x, y: rightHip!.y, z: rightHip!.z },
      leftKnee: { x: leftKnee!.x, y: leftKnee!.y, z: leftKnee!.z },
      rightKnee: { x: rightKnee!.x, y: rightKnee!.y, z: rightKnee!.z }
    };
  }

  /**
   * Calcula diferença angular bilateral no plano sagital (2D)
   */
  private calculateSagittalAsymmetry(bilateral: BilateralComparison): number {
    const leftShoulderAngle = Math.atan2(
      bilateral.leftShoulder.y - bilateral.leftHip.y,
      bilateral.leftShoulder.x - bilateral.leftHip.x
    ) * (180 / Math.PI);

    const rightShoulderAngle = Math.atan2(
      bilateral.rightShoulder.y - bilateral.rightHip.y,
      bilateral.rightShoulder.x - bilateral.rightHip.x
    ) * (180 / Math.PI);

    return Math.abs(leftShoulderAngle - rightShoulderAngle);
  }

  /**
   * Calcula assimetria no plano frontal (requer vista posterior)
   */
  private calculateFrontalAsymmetry(bilateral: BilateralComparison): number {
    if (!bilateral.leftShoulder.z || !bilateral.rightShoulder.z) {
      return 0; // sem dados 3D
    }

    const shoulderDepthDiff = Math.abs(
      bilateral.leftShoulder.z - bilateral.rightShoulder.z
    );

    const hipDepthDiff = Math.abs(
      (bilateral.leftHip.z ?? 0) - (bilateral.rightHip.z ?? 0)
    );

    const shoulderRotation = Math.atan(shoulderDepthDiff) * (180 / Math.PI);
    const hipRotation = Math.atan(hipDepthDiff) * (180 / Math.PI);

    return Math.max(shoulderRotation, hipRotation);
  }

  /**
   * Determina confiança da detecção baseada no modo de captura
   */
  private determineRotationConfidence(
    mode: CaptureMode,
    sagittalAsymmetry: number,
    frontalAsymmetry: number
  ): { confidence: RotationConfidence; score: number } {
    const { rotation } = BIOMECHANICAL_THRESHOLDS;

    switch (mode) {
      case CaptureMode.ESSENTIAL:
        if (sagittalAsymmetry < rotation.negligible) {
          return { confidence: RotationConfidence.NOT_MEASURABLE, score: 0 };
        }
        return {
          confidence: RotationConfidence.INFERRED,
          score: Math.min(45, sagittalAsymmetry * 3)
        };

      case CaptureMode.ADVANCED: {
        if (sagittalAsymmetry < rotation.minor && frontalAsymmetry < rotation.minor) {
          return { confidence: RotationConfidence.INFERRED, score: 40 };
        }
        const biplanarScore = Math.min(80, (sagittalAsymmetry + frontalAsymmetry) * 2);
        return { confidence: RotationConfidence.PROBABLE, score: biplanarScore };
      }

      case CaptureMode.PRO: {
        const totalAsymmetry = sagittalAsymmetry + frontalAsymmetry;
        if (totalAsymmetry < rotation.minor) {
          return { confidence: RotationConfidence.PROBABLE, score: 70 };
        }
        const proScore = Math.min(98, 80 + totalAsymmetry);
        return { confidence: RotationConfidence.CONFIRMED, score: proScore };
      }

      default:
        return { confidence: RotationConfidence.NOT_MEASURABLE, score: 0 };
    }
  }

  /**
   * Classifica tipo de rotação baseado em padrões
   */
  private classifyRotationType(
    _bilateral: BilateralComparison,
    sagittalAsymmetry: number,
    frontalAsymmetry: number,
    exerciseName: string
  ): RotationType {
    const { rotation } = BIOMECHANICAL_THRESHOLDS;

    if (sagittalAsymmetry < rotation.negligible && frontalAsymmetry < rotation.negligible) {
      return RotationType.NONE;
    }

    const technicalRotationExercises = [
      'arranque', 'arremesso', 'landmine', 'pallof press', 'woodchop'
    ];
    if (technicalRotationExercises.some(ex => exerciseName.toLowerCase().includes(ex))) {
      return RotationType.TECHNICAL;
    }

    if (sagittalAsymmetry > rotation.severe || frontalAsymmetry > rotation.severe) {
      return RotationType.STRUCTURAL;
    }

    if (sagittalAsymmetry > rotation.moderate || frontalAsymmetry > rotation.moderate) {
      return RotationType.FUNCTIONAL;
    }

    return RotationType.FUNCTIONAL;
  }

  /**
   * Identifica origem anatômica da rotação
   */
  private identifyRotationOrigin(bilateral: BilateralComparison): RotationOrigin {
    const shoulderAsymmetry = Math.abs(bilateral.leftShoulder.y - bilateral.rightShoulder.y);
    const hipAsymmetry = Math.abs(bilateral.leftHip.y - bilateral.rightHip.y);
    const kneeAsymmetry = Math.abs(bilateral.leftKnee.y - bilateral.rightKnee.y);

    const maxAsymmetry = Math.max(shoulderAsymmetry, hipAsymmetry, kneeAsymmetry);

    if (maxAsymmetry === shoulderAsymmetry) {
      return shoulderAsymmetry > 0.05 ? RotationOrigin.SCAPULAR : RotationOrigin.THORACIC;
    }

    if (maxAsymmetry === hipAsymmetry) {
      return hipAsymmetry > 0.05 ? RotationOrigin.PELVIC : RotationOrigin.LUMBAR;
    }

    return RotationOrigin.FEMORAL;
  }

  /**
   * Analisa rotação em múltiplos frames
   */
  public analyzeRotation(
    frames: FrameAnalysis[],
    mode: CaptureMode,
    exerciseName: string
  ): RotationAnalysis {
    const validFrames = frames
      .map(f => ({ ...f, bilateral: this.extractBilateralLandmarks(f.landmarks) }))
      .filter(f => f.bilateral !== null);

    if (validFrames.length === 0) {
      return {
        detected: false,
        confidence: RotationConfidence.NOT_MEASURABLE,
        confidenceScore: 0,
        type: RotationType.NONE,
        origin: RotationOrigin.MULTI_SEGMENTAL,
        magnitude: 0,
        asymmetryScore: 0,
        bilateralDifference: { shoulder: 0, hip: 0, knee: 0 },
        detectionMethod: 'Análise impossível: landmarks insuficientes'
      };
    }

    let totalSagittalAsymmetry = 0;
    let totalFrontalAsymmetry = 0;

    validFrames.forEach(frame => {
      totalSagittalAsymmetry += this.calculateSagittalAsymmetry(frame.bilateral!);
      totalFrontalAsymmetry += this.calculateFrontalAsymmetry(frame.bilateral!);
    });

    const avgSagittalAsymmetry = totalSagittalAsymmetry / validFrames.length;
    const avgFrontalAsymmetry = totalFrontalAsymmetry / validFrames.length;

    const midFrame = validFrames[Math.floor(validFrames.length / 2)];

    const { confidence, score } = this.determineRotationConfidence(
      mode, avgSagittalAsymmetry, avgFrontalAsymmetry
    );

    const type = this.classifyRotationType(
      midFrame.bilateral!, avgSagittalAsymmetry, avgFrontalAsymmetry, exerciseName
    );

    const origin = this.identifyRotationOrigin(midFrame.bilateral!);

    const magnitude = Math.sqrt(avgSagittalAsymmetry ** 2 + avgFrontalAsymmetry ** 2);
    const asymmetryScore = Math.min(100, magnitude * 3);
    const detectionMethod = TECHNICAL_MESSAGES.rotationDetection[confidence];

    return {
      detected: type !== RotationType.NONE,
      confidence,
      confidenceScore: score,
      type,
      origin,
      magnitude: Math.round(magnitude * 100) / 100,
      asymmetryScore: Math.round(asymmetryScore),
      bilateralDifference: {
        shoulder: Math.round(avgSagittalAsymmetry * 100) / 100,
        hip: Math.round(avgFrontalAsymmetry * 100) / 100,
        knee: Math.round(avgFrontalAsymmetry * 0.8 * 100) / 100
      },
      detectionMethod
    };
  }
}

// Exporta instância singleton
export const rotationDetector = new RotationDetectorEngine();
