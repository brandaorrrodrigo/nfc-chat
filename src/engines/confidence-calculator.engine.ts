/**
 * Engine de Cálculo de Confiabilidade Técnica
 *
 * Calcula o índice de confiabilidade da análise biomecânica baseado em 6 fatores:
 * 1. Calibração espacial (distância, resolução)
 * 2. Resolução temporal (fps)
 * 3. Visibilidade de landmarks
 * 4. Estabilidade de tracking
 * 5. Cobertura de planos (view coverage)
 * 6. Qualidade de iluminação
 */

import type {
  CameraSetup,
  LandmarkData,
  ConfidenceFactors
} from '../types/biomechanical-analysis.types';
import {
  CaptureMode,
  BIOMECHANICAL_THRESHOLDS,
  CONFIDENCE_LEVEL_MAP
} from '../types/biomechanical-analysis.types';

/**
 * Engine singleton para cálculo de confiabilidade
 */
class ConfidenceCalculatorEngine {
  /**
   * Calcula score de calibração espacial baseado em distância e resolução
   * @param setup - Configuração da câmera
   * @returns Score 0-100
   */
  private calculateSpatialCalibration(setup: CameraSetup): number {
    const IDEAL_DISTANCE = 3.0; // metros
    const MIN_RESOLUTION = 1280 * 720;

    // Penalizar desvios da distância ideal
    const distanceDeviation = Math.abs(setup.distanceToSubject - IDEAL_DISTANCE);
    const distanceScore = Math.max(0, 100 - distanceDeviation * 20);

    // Score de resolução
    const totalPixels = setup.resolution.width * setup.resolution.height;
    const resolutionScore = Math.min(100, (totalPixels / MIN_RESOLUTION) * 100);

    // Ponderação: 60% distância, 40% resolução
    return distanceScore * 0.6 + resolutionScore * 0.4;
  }

  /**
   * Calcula score de resolução temporal (fps normalizado)
   * @param fps - Frames por segundo
   * @returns Score 0-100
   */
  private calculateTemporalResolution(fps: number): number {
    const { minimum, optimal } = BIOMECHANICAL_THRESHOLDS.fps;

    if (fps < minimum) {
      return 0;
    }

    if (fps >= optimal) {
      return 100;
    }

    // Normalização linear entre minimum e optimal
    return ((fps - minimum) / (optimal - minimum)) * 100;
  }

  /**
   * Calcula score de visibilidade de landmarks
   * @param landmarks - Landmarks detectados
   * @returns Score 0-100
   */
  private calculateLandmarkVisibility(landmarks: LandmarkData[]): number {
    if (landmarks.length === 0) {
      return 0;
    }

    // Contar landmarks visíveis e não oclusos
    const visibleLandmarks = landmarks.filter(
      (lm) => lm.visible && !lm.occluded
    );
    const visibilityPercentage = (visibleLandmarks.length / landmarks.length) * 100;

    // Calcular confiança média dos landmarks visíveis
    const avgConfidence =
      visibleLandmarks.reduce((sum, lm) => sum + lm.confidence, 0) /
      visibleLandmarks.length;

    // Ponderação: 70% visibilidade, 30% confiança
    return visibilityPercentage * 0.7 + avgConfidence * 100 * 0.3;
  }

  /**
   * Calcula score de estabilidade de tracking frame-to-frame
   * @param current - Landmarks do frame atual
   * @param previous - Landmarks do frame anterior
   * @returns Score 0-100
   */
  private calculateTrackingStability(
    current: LandmarkData[],
    previous: LandmarkData[]
  ): number {
    // Primeiro frame não tem previous
    if (previous.length === 0) {
      return 100;
    }

    const variances: number[] = [];

    // Calcular variância para cada landmark correspondente
    for (const currLm of current) {
      const prevLm = previous.find((lm) => lm.name === currLm.name);
      if (!prevLm || !currLm.visible || !prevLm.visible) {
        continue;
      }

      // Distância euclidiana 2D
      const dx = currLm.x - prevLm.x;
      const dy = currLm.y - prevLm.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      variances.push(distance);
    }

    if (variances.length === 0) {
      return 0;
    }

    // Média das variâncias
    const avgVariance = variances.reduce((sum, v) => sum + v, 0) / variances.length;

    // Score: 100 - (variância * fator de penalização)
    // Variância típica em coordenadas normalizadas é ~0.01-0.02
    const score = 100 - avgVariance * 5000;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calcula score de cobertura de planos (view coverage)
   * @param mode - Modo de captura
   * @returns Score 0-100
   */
  private calculateViewCoverage(mode: CaptureMode): number {
    switch (mode) {
      case CaptureMode.ESSENTIAL:
        return 33; // 1 plano
      case CaptureMode.ADVANCED:
        return 66; // 2 planos ortogonais
      case CaptureMode.PRO:
        return 100; // 3 planos (reconstrução 3D completa)
      default:
        return 0;
    }
  }

  /**
   * Calcula score de qualidade de iluminação baseado em uniformidade de confiança
   * @param landmarks - Landmarks detectados
   * @returns Score 0-100
   */
  private calculateLightingQuality(landmarks: LandmarkData[]): number {
    if (landmarks.length === 0) {
      return 0;
    }

    const visibleLandmarks = landmarks.filter((lm) => lm.visible);
    if (visibleLandmarks.length === 0) {
      return 0;
    }

    // Confiança média (brightness)
    const avgConfidence =
      visibleLandmarks.reduce((sum, lm) => sum + lm.confidence, 0) /
      visibleLandmarks.length;

    // Variância das confianças (uniformidade)
    const variance =
      visibleLandmarks.reduce(
        (sum, lm) => sum + Math.pow(lm.confidence - avgConfidence, 2),
        0
      ) / visibleLandmarks.length;

    // Scores individuais
    const uniformityScore = Math.max(0, 100 - variance * 1000);
    const brightnessScore = avgConfidence * 100;

    // Ponderação: 40% uniformidade, 60% brilho
    return uniformityScore * 0.4 + brightnessScore * 0.6;
  }

  /**
   * Calcula todos os fatores de confiabilidade
   * @param setup - Setup da câmera
   * @param currentLandmarks - Landmarks do frame atual
   * @param previousLandmarks - Landmarks do frame anterior (opcional)
   * @returns Objeto com todos os fatores
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
      trackingStability: this.calculateTrackingStability(
        currentLandmarks,
        previousLandmarks
      ),
      viewCoverage: this.calculateViewCoverage(setup.mode),
      lightingQuality: this.calculateLightingQuality(currentLandmarks)
    };
  }

  /**
   * Calcula score geral de confiabilidade (média ponderada dos fatores)
   * @param factors - Fatores de confiabilidade
   * @returns Score 0-100 (arredondado para 2 casas decimais)
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

    return Math.round(score * 100) / 100;
  }

  /**
   * Classifica nível qualitativo de confiabilidade
   * @param score - Score de confiabilidade (0-100)
   * @returns Nível qualitativo
   */
  public getConfidenceLevel(
    score: number
  ): 'baixa' | 'moderada' | 'alta' | 'excelente' {
    if (score >= CONFIDENCE_LEVEL_MAP.excelente.min) {
      return 'excelente';
    }
    if (score >= CONFIDENCE_LEVEL_MAP.alta.min) {
      return 'alta';
    }
    if (score >= CONFIDENCE_LEVEL_MAP.moderada.min) {
      return 'moderada';
    }
    return 'baixa';
  }

  /**
   * Valida se a confiabilidade é adequada para o modo de captura
   * @param score - Score de confiabilidade
   * @param mode - Modo de captura
   * @returns true se confiabilidade é válida
   */
  public isConfidenceValid(score: number, mode: CaptureMode): boolean {
    const minRequired = BIOMECHANICAL_THRESHOLDS.minConfidence[mode];
    return score >= minRequired;
  }

  /**
   * Gera recomendações para melhorar a confiabilidade
   * @param factors - Fatores de confiabilidade
   * @returns Array de recomendações textuais
   */
  public generateRecommendations(factors: ConfidenceFactors): string[] {
    const recommendations: string[] = [];

    if (factors.spatialCalibration < 70) {
      recommendations.push(
        'Ajustar distância da câmera para aproximadamente 3 metros do sujeito'
      );
    }

    if (factors.temporalResolution < 70) {
      recommendations.push(
        'Aumentar taxa de frames para no mínimo 60 fps (ideal: 120 fps)'
      );
    }

    if (factors.landmarkVisibility < 70) {
      recommendations.push(
        'Melhorar enquadramento para garantir visibilidade de todos os landmarks críticos'
      );
    }

    if (factors.trackingStability < 70) {
      recommendations.push(
        'Estabilizar câmera usando tripé ou suporte fixo para reduzir variações de tracking'
      );
    }

    if (factors.viewCoverage < 66) {
      recommendations.push(
        'Adicionar ângulos de câmera ortogonais para análise multiplanar (upgrade para modo Avançado ou Pro)'
      );
    }

    if (factors.lightingQuality < 70) {
      recommendations.push(
        'Melhorar iluminação para obter detecção mais uniforme dos landmarks'
      );
    }

    return recommendations;
  }
}

/**
 * Instância singleton do engine de confiabilidade
 */
export const confidenceCalculator = new ConfidenceCalculatorEngine();
