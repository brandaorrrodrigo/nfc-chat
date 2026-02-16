/**
 * Sistema de Análise Biomecânica NFC/NFV - Exports Principais
 *
 * Exporta todos os componentes do sistema para facilitar importações
 */

// ============================================================================
// TIPOS
// ============================================================================

export type {
  // Enums (exportados como valores, mas podem ser usados como tipos)
  CaptureMode,
  CameraAngle,
  RotationConfidence,
  RotationType,
  RotationOrigin,
  RiskLevel,
  // Interfaces
  ConfidenceFactors,
  CameraSetup,
  LandmarkData,
  FrameAnalysis,
  RotationAnalysis,
  MovementScores,
  CorrectiveAction,
  UpgradePrompt,
  RetestRecommendation,
  BiomechanicalAnalysis
} from './types/biomechanical-analysis.types';

// Exportar enums como valores
export {
  CaptureMode,
  CameraAngle,
  RotationConfidence,
  RotationType,
  RotationOrigin,
  RiskLevel,
  BIOMECHANICAL_THRESHOLDS,
  TECHNICAL_MESSAGES,
  CONFIDENCE_LEVEL_MAP
} from './types/biomechanical-analysis.types';

// ============================================================================
// ENGINES
// ============================================================================

export { confidenceCalculator } from './engines/confidence-calculator.engine';
export { rotationDetector } from './engines/rotation-detector.engine';
export { reportGenerator } from './engines/report-generator.engine';
export {
  biomechanicalAnalyzer,
  type AnalysisParams
} from './engines/biomechanical-analyzer.engine';

// ============================================================================
// UTILITÁRIOS
// ============================================================================

export {
  generateAnalysisId,
  formatConfidenceScore,
  formatRotationMagnitude,
  getConfidenceColor,
  getRiskColor,
  formatBiomechanicalReport,
  formatBiomechanicalReportHTML,
  analysisToJSON,
  calculateAnalysisQuality
} from './utils/biomechanical.helpers';

// ============================================================================
// EXEMPLO DE USO RÁPIDO
// ============================================================================

/**
 * Exemplo de uso básico:
 *
 * ```typescript
 * import { biomechanicalAnalyzer, CaptureMode, CameraAngle } from '@/src';
 *
 * const analysis = biomechanicalAnalyzer.analyze({
 *   exerciseName: 'Agachamento',
 *   captureSetup: {
 *     mode: CaptureMode.ESSENTIAL,
 *     angles: [CameraAngle.SAGITTAL_RIGHT],
 *     fps: 60,
 *     resolution: { width: 1920, height: 1080 },
 *     distanceToSubject: 3.0,
 *     synchronized: true,
 *     maxDesyncMs: 16
 *   },
 *   frames: [...],
 *   scores: { motor: 75, stabilizer: 65, symmetry: 82, compensation: 25, igpb: 73 }
 * });
 *
 * console.log(`Confiabilidade: ${analysis.confidenceScore}%`);
 * console.log(`Risco: ${analysis.riskLevel}`);
 * ```
 */
