import {
  CaptureMode,
  CameraSetup,
  ConfidenceFactors,
  LandmarkData,
  BIOMECHANICAL_THRESHOLDS,
  CONFIDENCE_LEVEL_MAP
} from '../types/biomechanical-analysis.types';

/**
 * Engine de Cálculo de Confiabilidade da Análise Biomecânica
 *
 * Calcula índice de confiabilidade baseado em:
 * - Calibração espacial
 * - Resolução temporal
 * - Visibilidade de landmarks
 * - Estabilidade de tracking
 * - Cobertura de ângulos
 * - Qualidade de iluminação
 */

export class ConfidenceCalculatorEngine {

  /**
   * Calcula score de calibração espacial
   */
  private calculateSpatialCalibration(setup: CameraSetup): number {
    const idealDistance = 3.0; // metros
    const distance = setup.distanceToSubject;

    // Penaliza distâncias muito próximas ou muito distantes
    const distanceScore = Math.max(0, 100 - Math.abs(distance - idealDistance) * 20);

    // Penaliza resoluções baixas
    const minResolution = 1280 * 720;
    const currentResolution = setup.resolution.width * setup.resolution.height;
    const resolutionScore = Math.min(100, (currentResolution / minResolution) * 100);

    return (distanceScore * 0.6 + resolutionScore * 0.4);
  }

  /**
   * Calcula score de resolução temporal
   */
  private calculateTemporalResolution(fps: number): number {
    const { minimum, recommended, optimal } = BIOMECHANICAL_THRESHOLDS.fps;

    if (fps < minimum) return 0;
    if (fps >= optimal) return 100;

    // Normalização linear entre minimum e optimal
    const range = optimal - minimum;
    const value = fps - minimum;

    return (value / range) * 100;
  }

  /**
   * Calcula score de visibilidade de landmarks
   */
  private calculateLandmarkVisibility(landmarks: LandmarkData[]): number {
    if (landmarks.length === 0) return 0;

    const visibleCount = landmarks.filter(l => l.visible && !l.occluded).length;
    const visibilityPercentage = (visibleCount / landmarks.length) * 100;

    // Aplica peso à confiança média dos landmarks
    const avgConfidence = landmarks
      .filter(l => l.visible)
      .reduce((sum, l) => sum + l.confidence, 0) / visibleCount;

    const confidenceScore = avgConfidence * 100;

    return (visibilityPercentage * 0.7 + confidenceScore * 0.3);
  }

  /**
   * Calcula estabilidade de tracking frame-to-frame
   */
  private calculateTrackingStability(
    currentFrame: LandmarkData[],
    previousFrame: LandmarkData[]
  ): number {
    if (previousFrame.length === 0) return 100; // primeiro frame

    let totalVariance = 0;
    let comparedLandmarks = 0;

    currentFrame.forEach(current => {
      const previous = previousFrame.find(p => p.name === current.name);
      if (!previous || !current.visible || !previous.visible) return;

      const dx = current.x - previous.x;
      const dy = current.y - previous.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      totalVariance += distance;
      comparedLandmarks++;
    });

    if (comparedLandmarks === 0) return 0;

    const avgVariance = totalVariance / comparedLandmarks;

    // Threshold: variância < 0.02 = estável
    const stabilityScore = Math.max(0, 100 - (avgVariance * 5000));

    return stabilityScore;
  }

  /**
   * Calcula cobertura espacial baseada nos ângulos capturados
   */
  private calculateViewCoverage(mode: CaptureMode): number {
    const coverage = {
      [CaptureMode.ESSENTIAL]: 33,  // 1 plano = 33%
      [CaptureMode.ADVANCED]: 66,   // 2 planos = 66%
      [CaptureMode.PRO]: 100        // 3 planos = 100%
    };

    return coverage[mode];
  }

  /**
   * Calcula qualidade de iluminação baseada na variância de confiança
   */
  private calculateLightingQuality(landmarks: LandmarkData[]): number {
    if (landmarks.length === 0) return 0;

    const confidences = landmarks
      .filter(l => l.visible)
      .map(l => l.confidence);

    if (confidences.length === 0) return 0;

    // Alta confiança média = boa iluminação
    const avgConfidence = confidences.reduce((a, b) => a + b, 0) / confidences.length;

    // Baixa variância = iluminação uniforme
    const variance = confidences.reduce((sum, c) => {
      return sum + Math.pow(c - avgConfidence, 2);
    }, 0) / confidences.length;

    const uniformityScore = Math.max(0, 100 - (variance * 1000));
    const brightnessScore = avgConfidence * 100;

    return (uniformityScore * 0.4 + brightnessScore * 0.6);
  }

  /**
   * Calcula todos os fatores de confiabilidade
   */
  public calculateConfidenceFactors(
    setup: CameraSetup,
    currentLandmarks: LandmarkData[],
    previousLandmarks: LandmarkData[] = []
  ): ConfidenceFactors {
    return {
      spatialCalibration: this.calculateSpatialCalibration(setup),
      temporalResolution: this.calculateTemporalResolution(setup.fps),
      landmarkVisibility: this.calculateLandmarkVisibility(currentLandmarks),
      trackingStability: this.calculateTrackingStability(currentLandmarks, previousLandmarks),
      viewCoverage: this.calculateViewCoverage(setup.mode),
      lightingQuality: this.calculateLightingQuality(currentLandmarks)
    };
  }

  /**
   * Calcula score final de confiabilidade (média ponderada)
   */
  public calculateOverallConfidence(factors: ConfidenceFactors): number {
    const weights = {
      spatialCalibration: 0.15,
      temporalResolution: 0.10,
      landmarkVisibility: 0.25,
      trackingStability: 0.20,
      viewCoverage: 0.20,
      lightingQuality: 0.10
    };

    const score =
      factors.spatialCalibration * weights.spatialCalibration +
      factors.temporalResolution * weights.temporalResolution +
      factors.landmarkVisibility * weights.landmarkVisibility +
      factors.trackingStability * weights.trackingStability +
      factors.viewCoverage * weights.viewCoverage +
      factors.lightingQuality * weights.lightingQuality;

    return Math.round(score * 100) / 100; // 2 casas decimais
  }

  /**
   * Classifica nível de confiabilidade
   */
  public getConfidenceLevel(score: number): 'baixa' | 'moderada' | 'alta' | 'excelente' {
    for (const [level, range] of Object.entries(CONFIDENCE_LEVEL_MAP)) {
      if (score >= range.min && score <= range.max) {
        return level as 'baixa' | 'moderada' | 'alta' | 'excelente';
      }
    }
    return 'baixa';
  }

  /**
   * Valida se confiabilidade está acima do mínimo para o modo
   */
  public isConfidenceValid(score: number, mode: CaptureMode): boolean {
    const minRequired = BIOMECHANICAL_THRESHOLDS.minConfidence[mode];
    return score >= minRequired;
  }

  /**
   * Gera recomendações baseadas em fatores baixos
   */
  public generateRecommendations(factors: ConfidenceFactors): string[] {
    const recommendations: string[] = [];

    if (factors.spatialCalibration < 70) {
      recommendations.push(
        'Ajustar distância da câmera para aproximadamente 3 metros do executante'
      );
    }

    if (factors.temporalResolution < 70) {
      recommendations.push(
        'Aumentar taxa de captura para mínimo de 60 fps para melhor resolução temporal'
      );
    }

    if (factors.landmarkVisibility < BIOMECHANICAL_THRESHOLDS.landmarkVisibility.minimum) {
      recommendations.push(
        'Melhorar visibilidade de landmarks críticos (verificar oclusões e enquadramento)'
      );
    }

    if (factors.trackingStability < 70) {
      recommendations.push(
        'Reduzir movimentos bruscos da câmera e estabilizar posicionamento'
      );
    }

    if (factors.viewCoverage < 66) {
      recommendations.push(
        'Adicionar ângulos de captura para análise tridimensional completa'
      );
    }

    if (factors.lightingQuality < 70) {
      recommendations.push(
        'Melhorar iluminação do ambiente para distribuição uniforme e redução de sombras'
      );
    }

    return recommendations;
  }
}

// Exporta instância singleton
export const confidenceCalculator = new ConfidenceCalculatorEngine();
