/**
 * Bridge: MediaPipe Python Output → BiomechanicalAnalysis (NFC v2.0)
 *
 * Converte o resultado do pipeline MediaPipe/V2 para o formato tipado
 * BiomechanicalAnalysis do sistema de engines src/.
 *
 * Fluxo:
 *   Python MediaPipe → aggregated + V2 classification
 *       ↓
 *   convertToBiomechanicalAnalysis()
 *       ↓
 *   FrameAnalysis[] + MovementScores + CameraSetup
 *       ↓
 *   biomechanicalAnalyzer.analyze() → BiomechanicalAnalysis
 */

import {
  biomechanicalAnalyzer,
  type AnalysisParams,
} from '@/src/engines/biomechanical-analyzer.engine';
import {
  CaptureMode,
  CameraAngle,
  type FrameAnalysis,
  type LandmarkData,
  type MovementScores,
  type BiomechanicalAnalysis,
} from '@/src/types/biomechanical-analysis.types';
import type { AnalysisResultV2 } from './classifier-v2';
import type {
  MediaPipeResult,
  AggregatedMediaPipeData,
  MediaPipeLandmark,
} from './mediapipe-bridge';

// ============================================================================
// CONVERSÃO PRINCIPAL
// ============================================================================

/**
 * Converte resultado do pipeline MediaPipe/V2 para BiomechanicalAnalysis.
 *
 * @param params.exerciseName - Nome do exercício
 * @param params.mediapipeResult - Resultado bruto do script Python
 * @param params.v2Result - Resultado da classificação V2 (opcional se V1)
 * @param params.aggregated - Dados agregados do pipeline
 * @param params.fps - FPS do vídeo (padrão: 30)
 * @returns BiomechanicalAnalysis completo ou null se dados insuficientes
 */
export function convertToBiomechanicalAnalysis(params: {
  exerciseName: string;
  mediapipeResult: MediaPipeResult;
  v2Result?: AnalysisResultV2;
  aggregated: AggregatedMediaPipeData;
  fps?: number;
}): BiomechanicalAnalysis | null {
  const { exerciseName, mediapipeResult, v2Result, aggregated, fps = 30 } = params;

  try {
    // 1. Converter frames Python → FrameAnalysis[]
    const frames = buildFrameAnalysis(mediapipeResult.frames, fps);

    if (frames.length === 0) {
      console.warn('[BiomechanicalBridge] Nenhum frame válido com landmarks disponíveis');
      return null;
    }

    // 2. Mapear scores (V2 usa escala 0-10, engines usam 0-100)
    const scores = buildMovementScores(v2Result, aggregated);

    // 3. Construir CameraSetup (sempre ESSENTIAL em produção: 1 câmera lateral)
    const captureSetup: AnalysisParams['captureSetup'] = {
      mode: CaptureMode.ESSENTIAL,
      angles: [CameraAngle.SAGITTAL_RIGHT],
      fps,
      resolution: { width: 1920, height: 1080 },
      distanceToSubject: 3.0,
      synchronized: false,
      maxDesyncMs: 0,
    };

    // 4. Executar análise via engine orquestrador
    const analysis = biomechanicalAnalyzer.analyze({
      exerciseName,
      captureSetup,
      frames,
      scores,
    });

    return analysis;

  } catch (error) {
    console.error('[BiomechanicalBridge] Erro na conversão:', error);
    return null;
  }
}

// ============================================================================
// HELPERS PRIVADOS
// ============================================================================

/**
 * Converte frames Python para FrameAnalysis[].
 * Usa world_landmarks (metros) se disponíveis, fallback para landmarks normalizados.
 */
function buildFrameAnalysis(
  pythonFrames: MediaPipeResult['frames'],
  fps: number,
): FrameAnalysis[] {
  const frames: FrameAnalysis[] = [];

  for (let i = 0; i < pythonFrames.length; i++) {
    const pf = pythonFrames[i];

    if (!pf.success) continue;

    // Preferir world_landmarks (coordenadas métricas), fallback para landmarks normalizados
    const landmarkSource = pf.world_landmarks ?? pf.landmarks;

    if (!landmarkSource || Object.keys(landmarkSource).length === 0) continue;

    const landmarks = convertPythonLandmarksToLandmarkData(landmarkSource);

    if (landmarks.length < 6) continue; // Mínimo para análise

    frames.push({
      frameNumber: i,
      timestamp: (i * 1000) / fps,
      landmarks,
      cameraAngle: CameraAngle.SAGITTAL_RIGHT,
    });
  }

  return frames;
}

/**
 * Converte dicionário de landmarks Python para LandmarkData[].
 */
function convertPythonLandmarksToLandmarkData(
  pythonLandmarks: Record<string, MediaPipeLandmark>,
): LandmarkData[] {
  return Object.entries(pythonLandmarks).map(([name, lm]) => ({
    name,
    x: lm.x,
    y: lm.y,
    z: lm.z,
    confidence: lm.visibility,
    visible: lm.visibility > 0.5,
    occluded: lm.visibility < 0.3,
  }));
}

/**
 * Mapeia scores V2 (0-10) para MovementScores (0-100).
 * Calcula symmetry e compensation a partir da análise de joints.
 */
function buildMovementScores(
  v2Result: AnalysisResultV2 | undefined,
  aggregated: AggregatedMediaPipeData,
): MovementScores {
  if (!v2Result) {
    // Fallback para V1: usar apenas confiança como proxy
    const baseScore = Math.min(100, aggregated.avgConfidence * 100);
    return {
      motor: Math.round(baseScore),
      stabilizer: Math.round(baseScore * 0.9),
      symmetry: Math.round(baseScore * 0.85),
      compensation: Math.round((1 - aggregated.avgConfidence) * 40),
      igpb: Math.round(baseScore * 0.8),
    };
  }

  const motor = Math.min(100, Math.max(0, Math.round(v2Result.motorScore * 10)));
  const stabilizer = Math.min(100, Math.max(0, Math.round(v2Result.stabilizerScore * 10)));

  // Simetria: % de joints estabilizadores classificados como "firme"
  const totalStabilizers = v2Result.stabilizerAnalysis.length;
  const firmeCount = v2Result.stabilizerAnalysis.filter(
    (s) => s.variation.classification === 'firme',
  ).length;
  const symmetry = Math.min(100, Math.max(0,
    totalStabilizers > 0
      ? Math.round((firmeCount / totalStabilizers) * 100)
      : Math.round(stabilizer * 0.9),
  ));

  // Compensação: % de joints com problemas detectados
  const totalJoints = v2Result.motorAnalysis.length + totalStabilizers;
  const problemCount =
    v2Result.motorAnalysis.filter(
      (m) => m.rom.classification === 'warning' || m.rom.classification === 'danger',
    ).length +
    v2Result.stabilizerAnalysis.filter(
      (s) => s.variation.classification !== 'firme',
    ).length;
  const compensation = Math.min(100, Math.max(0,
    totalJoints > 0
      ? Math.round((problemCount / totalJoints) * 100)
      : Math.round((100 - motor) * 0.4),
  ));

  const igpb = Math.min(100, Math.max(0, Math.round(v2Result.overallScore * 10)));

  return { motor, stabilizer, symmetry, compensation, igpb };
}
