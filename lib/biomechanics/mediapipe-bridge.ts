/**
 * Bridge Node.js → Python MediaPipe
 * Chama scripts/mediapipe_analyze_frame.py via child_process
 * Retorna ângulos articulares REAIS (sem Ollama Vision)
 *
 * Melhorias v4.1:
 * - Filtro de confidence: descarta frames com confidence < 0.5
 * - Percentil 10-90 para variação dos estabilizadores (elimina outliers)
 * - Média ponderada por confidence (frames melhores pesam mais)
 * - Aviso de qualidade do vídeo quando confidence < 0.6
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import type { MotorMetricInput, StabilizerMetricInput } from './classifier-v2';
import type { ExerciseTemplate } from './exercise-templates-v2';

const execAsync = promisify(exec);

const SCRIPT_PATH = path.join(process.cwd(), 'scripts', 'mediapipe_analyze_frame.py');

/** Confidence mínimo para incluir um frame na análise */
const MIN_CONFIDENCE = 0.5;

// ============================
// Tipos MediaPipe
// ============================

export interface MediaPipeAngles {
  knee_left?: number;
  knee_right?: number;
  hip_left?: number;
  hip_right?: number;
  hip_avg?: number;
  elbow_left?: number;
  elbow_right?: number;
  shoulder_left?: number;
  shoulder_right?: number;
  ankle_raw_left?: number;
  ankle_raw_right?: number;
  ankle_dorsiflexion_left?: number;
  ankle_dorsiflexion_right?: number;
  trunk_inclination?: number;
  knee_valgus_left_cm?: number;
  knee_valgus_right_cm?: number;
  shoulder_elevation_left?: number;
  shoulder_elevation_right?: number;
  wrist_angle_left?: number;
  wrist_angle_right?: number;
  hip_width_norm?: number;
  calibration_factor?: number;
  confidence?: number;
}

export interface MediaPipeFrameResult {
  success: boolean;
  frame: string;
  angles: MediaPipeAngles;
  world_angles: MediaPipeAngles;
  error?: string;
}

export interface MediaPipeResult {
  success: boolean;
  frames_total: number;
  frames_processed: number;
  frames: MediaPipeFrameResult[];
  error?: string;
}

// ============================
// Chamar Python
// ============================

/**
 * Analisa frames com MediaPipe via Python script
 */
export async function analyzeFramesWithMediaPipe(
  framePaths: string[],
): Promise<MediaPipeResult> {
  if (framePaths.length === 0) {
    return { success: false, frames_total: 0, frames_processed: 0, frames: [], error: 'No frames provided' };
  }

  const quotedPaths = framePaths.map(p => `"${p.replace(/\\/g, '/')}"`).join(' ');
  const cmd = `python "${SCRIPT_PATH.replace(/\\/g, '/')}" ${quotedPaths}`;

  try {
    const { stdout, stderr } = await execAsync(cmd, {
      timeout: 120000,
      maxBuffer: 10 * 1024 * 1024,
    });

    if (stderr) {
      const criticalErrors = stderr.split('\n').filter(
        line => line.includes('Error') && !line.includes('WARNING') && !line.includes('INFO') && !line.includes('W0000'),
      );
      if (criticalErrors.length > 0) {
        console.warn('[MediaPipe] stderr warnings:', criticalErrors.join('\n'));
      }
    }

    return JSON.parse(stdout.trim()) as MediaPipeResult;
  } catch (error: any) {
    console.error('[MediaPipe] Bridge error:', error.message);
    return { success: false, frames_total: framePaths.length, frames_processed: 0, frames: [], error: error.message };
  }
}

/**
 * Analisa um diretório de frames com MediaPipe
 */
export async function analyzeFramesDirWithMediaPipe(
  framesDir: string,
): Promise<MediaPipeResult> {
  const cmd = `python "${SCRIPT_PATH.replace(/\\/g, '/')}" --dir "${framesDir.replace(/\\/g, '/')}"`;

  try {
    const { stdout } = await execAsync(cmd, { timeout: 120000, maxBuffer: 10 * 1024 * 1024 });
    return JSON.parse(stdout.trim()) as MediaPipeResult;
  } catch (error: any) {
    console.error('[MediaPipe] Dir analysis error:', error.message);
    return { success: false, frames_total: 0, frames_processed: 0, frames: [], error: error.message };
  }
}

// ============================
// Utilitários Estatísticos
// ============================

/**
 * Calcula percentil de um array ordenado
 * percentile(0.1) = P10, percentile(0.9) = P90
 */
function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  if (sorted.length === 1) return sorted[0];
  const idx = p * (sorted.length - 1);
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (idx - lower);
}

/**
 * Calcula variação usando percentil 10-90 (robusto contra outliers)
 * Em vez de max - min (sensível a 1 frame ruim), usa P90 - P10
 */
function robustVariation(values: number[]): number {
  if (values.length < 3) {
    return values.length >= 2 ? Math.round((Math.max(...values) - Math.min(...values)) * 10) / 10 : 0;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const p10 = percentile(sorted, 0.1);
  const p90 = percentile(sorted, 0.9);
  return Math.round((p90 - p10) * 10) / 10;
}

/**
 * Média ponderada por confidence
 * Frames com confidence maior pesam mais na média
 */
function weightedAverage(values: number[], weights: number[]): number {
  if (values.length === 0) return 0;
  let sumWV = 0;
  let sumW = 0;
  for (let i = 0; i < values.length; i++) {
    const w = weights[i] ?? 1;
    sumWV += values[i] * w;
    sumW += w;
  }
  return sumW > 0 ? Math.round((sumWV / sumW) * 10) / 10 : 0;
}

// ============================
// Agregação de Frames MediaPipe
// ============================

export interface AggregatedMediaPipeData {
  avgAngles: MediaPipeAngles;
  minAngles: MediaPipeAngles;
  maxAngles: MediaPipeAngles;
  /** Ângulos de cada frame (já filtrados por confidence) */
  allFrameAngles: MediaPipeAngles[];
  /** Confidence de cada frame filtrado (mesmo índice que allFrameAngles) */
  frameConfidences: number[];
  framesProcessed: number;
  framesFiltered: number;
  avgConfidence: number;
  /** Aviso se qualidade do vídeo é baixa */
  videoQualityWarning: string | null;
}

/**
 * Agrega ângulos de múltiplos frames MediaPipe
 *
 * Melhorias:
 * 1. Filtra frames com confidence < 0.5
 * 2. Usa média ponderada por confidence
 * 3. Percentil 10-90 disponível para estabilizadores (via robustVariation)
 * 4. Gera aviso de qualidade quando confidence < 0.6
 */
export function aggregateMediaPipeFrames(result: MediaPipeResult): AggregatedMediaPipeData {
  const successFrames = result.frames.filter(f => f.success);

  if (successFrames.length === 0) {
    return {
      avgAngles: {}, minAngles: {}, maxAngles: {},
      allFrameAngles: [], frameConfidences: [],
      framesProcessed: 0, framesFiltered: 0,
      avgConfidence: 0, videoQualityWarning: 'Nenhuma pose detectada nos frames.',
    };
  }

  // Escolher world_angles (3D métrico) quando disponível
  const allAngles = successFrames.map(f =>
    Object.keys(f.world_angles || {}).length > 2 ? f.world_angles : f.angles,
  );

  const allConfidences = allAngles.map(a => a.confidence ?? 0);

  // --- FILTRO 1: Descartar frames com confidence < MIN_CONFIDENCE ---
  const filtered: { angles: MediaPipeAngles; confidence: number }[] = [];
  for (let i = 0; i < allAngles.length; i++) {
    if (allConfidences[i] >= MIN_CONFIDENCE) {
      filtered.push({ angles: allAngles[i], confidence: allConfidences[i] });
    }
  }

  const framesFiltered = successFrames.length - filtered.length;
  if (framesFiltered > 0) {
    console.log(`[MediaPipe] Filtro confidence: ${framesFiltered} frames descartados (conf < ${MIN_CONFIDENCE})`);
  }

  // Se todos foram descartados, usar os originais (melhor algo que nada)
  const useFrames = filtered.length > 0 ? filtered : allAngles.map((a, i) => ({ angles: a, confidence: allConfidences[i] }));

  const frameAngles = useFrames.map(f => f.angles);
  const frameConfs = useFrames.map(f => f.confidence);

  // Coletar todas as keys
  const allKeys = new Set<string>();
  for (const angles of frameAngles) {
    for (const key of Object.keys(angles)) {
      if (key !== 'confidence' && key !== 'hip_width_norm' && key !== 'calibration_factor') {
        allKeys.add(key);
      }
    }
  }

  const avg: MediaPipeAngles = {};
  const min: MediaPipeAngles = {};
  const max: MediaPipeAngles = {};

  for (const key of allKeys) {
    const valuesWithConf: { value: number; confidence: number }[] = [];
    for (let i = 0; i < frameAngles.length; i++) {
      const v = (frameAngles[i] as Record<string, number | undefined>)[key];
      if (v !== undefined && v >= 0) {
        valuesWithConf.push({ value: v, confidence: frameConfs[i] });
      }
    }

    if (valuesWithConf.length === 0) continue;

    const values = valuesWithConf.map(v => v.value);
    const weights = valuesWithConf.map(v => v.confidence);

    // --- MELHORIA 3: Média ponderada por confidence ---
    (avg as Record<string, number>)[key] = weightedAverage(values, weights);
    (min as Record<string, number>)[key] = Math.round(Math.min(...values) * 10) / 10;
    (max as Record<string, number>)[key] = Math.round(Math.max(...values) * 10) / 10;
  }

  // Confidence médio (dos frames FILTRADOS)
  const avgConf = frameConfs.length > 0
    ? Math.round((frameConfs.reduce((s, v) => s + v, 0) / frameConfs.length) * 1000) / 1000
    : 0;

  // --- MELHORIA 4: Aviso de qualidade do vídeo ---
  let videoQualityWarning: string | null = null;
  if (avgConf < 0.6) {
    videoQualityWarning = 'Qualidade do vídeo limitada — análise pode ser imprecisa. Para análise mais precisa, filme de perfil ou de frente, com boa iluminação e corpo inteiro visível.';
  }

  return {
    avgAngles: avg,
    minAngles: min,
    maxAngles: max,
    allFrameAngles: frameAngles,
    frameConfidences: frameConfs,
    framesProcessed: useFrames.length,
    framesFiltered,
    avgConfidence: avgConf,
    videoQualityWarning,
  };
}

// ============================
// Mapeamento MediaPipe → V2 Motor/Stabilizer
// ============================

/**
 * Mapeia ângulos do MediaPipe para métricas V2 (Motor + Stabilizer)
 */
export function mediapipeToMetricsV2(
  agg: AggregatedMediaPipeData,
  template: ExerciseTemplate,
): { motorMetrics: MotorMetricInput[]; stabilizerMetrics: StabilizerMetricInput[] } {
  const motorMetrics: MotorMetricInput[] = [];
  const stabilizerMetrics: StabilizerMetricInput[] = [];

  for (const mj of template.motorJoints) {
    const input = mapMediaPipeMotor(mj.joint, mj.criteria.rom.metric, agg);
    if (input) motorMetrics.push(input);
  }

  for (const sj of template.stabilizerJoints) {
    const input = mapMediaPipeStabilizer(sj.joint, sj.criteria.maxVariation.metric, agg);
    if (input) stabilizerMetrics.push(input);
  }

  return { motorMetrics, stabilizerMetrics };
}

/**
 * Mapeia articulação motora do MediaPipe
 */
function mapMediaPipeMotor(
  joint: string,
  metric: string,
  agg: AggregatedMediaPipeData,
): MotorMetricInput | null {
  const { minAngles, maxAngles, avgAngles } = agg;

  switch (joint) {
    case 'knee': {
      const leftMin = minAngles.knee_left;
      const rightMin = minAngles.knee_right;
      if (leftMin === undefined && rightMin === undefined) return null;

      const romValue = metric.includes('flexion_at_bottom')
        ? Math.min(leftMin ?? 999, rightMin ?? 999)
        : metric.includes('extension_range')
          ? ((maxAngles.knee_left ?? 0) - (minAngles.knee_left ?? 0))
          : Math.min(leftMin ?? 999, rightMin ?? 999);

      return {
        joint: 'knee',
        romValue: romValue < 999 ? romValue : 0,
        romUnit: '°',
        leftValue: leftMin,
        rightValue: rightMin,
      };
    }

    case 'hip': {
      const hipMin = minAngles.hip_avg ?? minAngles.hip_left;
      const hipMax = maxAngles.hip_avg ?? maxAngles.hip_left;
      if (hipMin === undefined) return null;

      let romValue: number;
      if (metric.includes('flexion_at_bottom')) {
        romValue = hipMin;
      } else if (metric.includes('extension_range') || metric.includes('extension_rom')) {
        romValue = (hipMax ?? hipMin) - hipMin;
      } else {
        romValue = avgAngles.hip_avg ?? hipMin;
      }

      return {
        joint: 'hip',
        romValue,
        romUnit: '°',
        leftValue: minAngles.hip_left,
        rightValue: minAngles.hip_right,
      };
    }

    case 'ankle': {
      const leftDf = maxAngles.ankle_dorsiflexion_left;
      const rightDf = maxAngles.ankle_dorsiflexion_right;
      const leftRaw = minAngles.ankle_raw_left;
      const rightRaw = minAngles.ankle_raw_right;

      let romValue: number | undefined;
      if (leftDf !== undefined || rightDf !== undefined) {
        romValue = Math.max(leftDf ?? 0, rightDf ?? 0);
      } else if (leftRaw !== undefined || rightRaw !== undefined) {
        const leftCalc = leftRaw !== undefined ? Math.max(0, 90 - leftRaw) : 0;
        const rightCalc = rightRaw !== undefined ? Math.max(0, 90 - rightRaw) : 0;
        romValue = Math.max(leftCalc, rightCalc);
      }

      if (romValue === undefined) return null;
      return { joint: 'ankle', romValue, romUnit: '°' };
    }

    case 'shoulder': {
      const leftMax = maxAngles.shoulder_left;
      const rightMax = maxAngles.shoulder_right;
      if (leftMax === undefined && rightMax === undefined) return null;

      let romValue: number;
      if (metric.includes('extension_rom') || metric.includes('abduction') || metric.includes('horizontal_adduction_rom')) {
        const leftRange = (maxAngles.shoulder_left ?? 0) - (minAngles.shoulder_left ?? 0);
        const rightRange = (maxAngles.shoulder_right ?? 0) - (minAngles.shoulder_right ?? 0);
        romValue = Math.max(leftRange, rightRange);
      } else {
        romValue = Math.max(leftMax ?? 0, rightMax ?? 0);
      }

      const elevLeft = avgAngles.shoulder_elevation_left;
      const elevRight = avgAngles.shoulder_elevation_right;
      const peakContractionValue = elevLeft !== undefined && elevRight !== undefined
        ? Math.abs(elevLeft - elevRight)
        : undefined;

      return {
        joint: 'shoulder',
        romValue,
        romUnit: '°',
        leftValue: leftMax,
        rightValue: rightMax,
        peakContractionValue,
        peakContractionUnit: peakContractionValue !== undefined ? 'cm' : undefined,
      };
    }

    case 'elbow': {
      const leftMin = minAngles.elbow_left;
      const rightMin = minAngles.elbow_right;
      const leftMax = maxAngles.elbow_left;
      const rightMax = maxAngles.elbow_right;
      if (leftMin === undefined && rightMin === undefined) return null;

      let romValue: number;
      if (metric.includes('extension_at_lockout')) {
        // Para bench press: ângulo MÁXIMO = extensão máxima no lockout
        romValue = Math.max(leftMax ?? 0, rightMax ?? 0);
      } else {
        // Para pull/curl: ângulo mínimo = máxima contração
        romValue = Math.min(leftMin ?? 999, rightMin ?? 999);
        if (romValue >= 999) romValue = 0;
      }

      return {
        joint: 'elbow',
        romValue,
        romUnit: '°',
        leftValue: metric.includes('extension_at_lockout') ? leftMax : leftMin,
        rightValue: metric.includes('extension_at_lockout') ? rightMax : rightMin,
      };
    }

    default:
      return null;
  }
}

/**
 * Mapeia articulação estabilizadora do MediaPipe
 * Usa percentil 10-90 para variação (elimina spikes de outliers)
 */
function mapMediaPipeStabilizer(
  joint: string,
  _metric: string,
  agg: AggregatedMediaPipeData,
): StabilizerMetricInput | null {
  const { allFrameAngles } = agg;

  // Helper: variação ROBUSTA (P10-P90)
  const getRobustVariation = (key: keyof MediaPipeAngles): number | null => {
    const values: number[] = [];
    for (const frame of allFrameAngles) {
      const v = (frame as Record<string, number | undefined>)[key as string];
      if (v !== undefined && v >= 0) {
        values.push(v);
      }
    }
    if (values.length < 2) return null;
    return robustVariation(values);
  };

  // Helper: P90 robusto para valores absolutos (valgo)
  const getRobustMax = (key: keyof MediaPipeAngles): number => {
    const values: number[] = [];
    for (const frame of allFrameAngles) {
      const v = (frame as Record<string, number | undefined>)[key as string];
      if (v !== undefined && v >= 0) {
        values.push(v);
      }
    }
    if (values.length === 0) return 0;
    if (values.length < 3) return Math.round(Math.max(...values) * 10) / 10;
    const sorted = [...values].sort((a, b) => a - b);
    return Math.round(percentile(sorted, 0.9) * 10) / 10;
  };

  switch (joint) {
    case 'lumbar': {
      const variation = getRobustVariation('trunk_inclination');
      if (variation === null) return null;
      return { joint: 'lumbar', variationValue: variation, unit: '°' };
    }

    case 'trunk': {
      const variation = getRobustVariation('trunk_inclination');
      if (variation === null) return null;
      return { joint: 'trunk', variationValue: variation, unit: '°' };
    }

    case 'thoracic': {
      const variation = getRobustVariation('trunk_inclination');
      if (variation === null) return null;
      return { joint: 'thoracic', variationValue: variation, unit: '°' };
    }

    case 'knee_alignment': {
      const leftP90 = getRobustMax('knee_valgus_left_cm');
      const rightP90 = getRobustMax('knee_valgus_right_cm');
      return { joint: 'knee_alignment', variationValue: Math.max(leftP90, rightP90), unit: 'cm' };
    }

    case 'shoulder_position': {
      const leftVar = getRobustVariation('shoulder_left');
      const rightVar = getRobustVariation('shoulder_right');
      const variation = Math.max(leftVar ?? 0, rightVar ?? 0);
      return { joint: 'shoulder_position', variationValue: Math.round(variation * 0.3 * 10) / 10, unit: 'cm' };
    }

    case 'wrist': {
      const leftVar = getRobustVariation('wrist_angle_left');
      const rightVar = getRobustVariation('wrist_angle_right');
      const variation = Math.max(leftVar ?? 0, rightVar ?? 0);
      return { joint: 'wrist', variationValue: variation, unit: '°' };
    }

    case 'elbow': {
      const leftVar = getRobustVariation('elbow_left');
      const rightVar = getRobustVariation('elbow_right');
      const variation = Math.max(leftVar ?? 0, rightVar ?? 0);
      return { joint: 'elbow', variationValue: variation, unit: '°' };
    }

    case 'shoulder_elevation': {
      const leftVar = getRobustVariation('shoulder_elevation_left');
      const rightVar = getRobustVariation('shoulder_elevation_right');
      const variation = Math.max(leftVar ?? 0, rightVar ?? 0);
      return { joint: 'shoulder_elevation', variationValue: variation, unit: 'cm' };
    }

    // --- Novos joints para Bench Press + Hip Thrust ---

    case 'scapula': {
      // Variação da elevação do ombro como proxy para movimento escapular
      const leftVar = getRobustVariation('shoulder_elevation_left');
      const rightVar = getRobustVariation('shoulder_elevation_right');
      const variation = Math.max(leftVar ?? 0, rightVar ?? 0);
      return { joint: 'scapula', variationValue: variation, unit: '°' };
    }

    case 'elbow_flare': {
      // Para bench press: ângulo dos cotovelos em relação ao tronco
      const leftAvg = agg.avgAngles.elbow_left;
      const rightAvg = agg.avgAngles.elbow_right;
      const avgElbow = Math.max(leftAvg ?? 0, rightAvg ?? 0);
      // elbow angle ~90° no fundo do supino ≈ ~45° flare (ideal)
      // elbow angle >120° = flare excessivo (~70°+)
      const estimatedFlare = avgElbow > 90 ? (avgElbow - 90) + 45 : 45;
      return { joint: 'elbow_flare', variationValue: estimatedFlare, unit: '°' };
    }

    case 'thoracic_arch': {
      // Variação da inclinação do tronco como proxy para estabilidade do arco
      const variation = getRobustVariation('trunk_inclination');
      if (variation === null) return null;
      return { joint: 'thoracic_arch', variationValue: variation, unit: '°' };
    }

    case 'feet': {
      // Sem dados diretos de pés no MediaPipe — heurística baseada em trunk stability
      const trunkVar = getRobustVariation('trunk_inclination');
      const estimated = trunkVar !== null ? (trunkVar > 10 ? 4 : trunkVar > 5 ? 2 : 0.5) : 0.5;
      return { joint: 'feet', variationValue: estimated, unit: 'cm' };
    }

    case 'rib_cage': {
      // Variação do tronco como proxy para rib flare
      const variation = getRobustVariation('trunk_inclination');
      if (variation === null) return null;
      return { joint: 'rib_cage', variationValue: variation, unit: '°' };
    }

    case 'knee_angle': {
      // Variação dos ângulos dos joelhos (devem manter ~90° constantes no hip thrust)
      const leftVar = getRobustVariation('knee_left');
      const rightVar = getRobustVariation('knee_right');
      const variation = Math.max(leftVar ?? 0, rightVar ?? 0);
      return { joint: 'knee_angle', variationValue: variation, unit: '°' };
    }

    case 'cervical': {
      // Sem dados cervicais diretos no MediaPipe — proxy: elevação do ombro
      const leftVar = getRobustVariation('shoulder_elevation_left');
      const rightVar = getRobustVariation('shoulder_elevation_right');
      const variation = Math.max(leftVar ?? 0, rightVar ?? 0);
      return { joint: 'cervical', variationValue: variation, unit: '°' };
    }

    default:
      return null;
  }
}

// ============================
// Mapeamento MediaPipe → V1 (backward compat)
// ============================

import type { MetricValue } from './criteria-classifier';

/**
 * Mapeia ângulos do MediaPipe para MetricValue[] V1
 * Usa média ponderada e variação robusta (P10-P90)
 */
export function mediapipeToMetricsV1(
  agg: AggregatedMediaPipeData,
  category: string,
): MetricValue[] {
  const metrics: MetricValue[] = [];
  const { avgAngles, minAngles, maxAngles, allFrameAngles } = agg;

  const getTrunkVariation = (): number => {
    const values = allFrameAngles
      .map(a => a.trunk_inclination)
      .filter((v): v is number => v !== undefined);
    return robustVariation(values);
  };

  const getValgusP90 = (): number => {
    const leftVals = allFrameAngles.map(a => a.knee_valgus_left_cm).filter((v): v is number => v !== undefined && v >= 0);
    const rightVals = allFrameAngles.map(a => a.knee_valgus_right_cm).filter((v): v is number => v !== undefined && v >= 0);
    const getP90 = (vals: number[]): number => {
      if (vals.length === 0) return 0;
      if (vals.length < 3) return Math.max(...vals);
      const sorted = [...vals].sort((a, b) => a - b);
      return percentile(sorted, 0.9);
    };
    return Math.round(Math.max(getP90(leftVals), getP90(rightVals)) * 10) / 10;
  };

  switch (category) {
    case 'squat': {
      if (minAngles.hip_avg !== undefined)
        metrics.push({ metric: 'hip_angle_at_bottom', value: minAngles.hip_avg, unit: '°' });

      metrics.push({ metric: 'knee_medial_displacement_cm', value: getValgusP90(), unit: 'cm' });

      if (avgAngles.trunk_inclination !== undefined)
        metrics.push({ metric: 'trunk_inclination_degrees', value: avgAngles.trunk_inclination, unit: '°' });

      const ankleDF = Math.max(maxAngles.ankle_dorsiflexion_left ?? 0, maxAngles.ankle_dorsiflexion_right ?? 0);
      metrics.push({ metric: 'ankle_dorsiflexion_degrees', value: ankleDF, unit: '°' });

      metrics.push({ metric: 'lumbar_flexion_change_degrees', value: getTrunkVariation(), unit: '°' });

      if (minAngles.knee_left !== undefined && minAngles.knee_right !== undefined)
        metrics.push({ metric: 'bilateral_angle_difference', value: Math.round(Math.abs(minAngles.knee_left - minAngles.knee_right) * 10) / 10, unit: '°' });
      break;
    }

    case 'hinge': {
      metrics.push({ metric: 'lumbar_flexion_degrees', value: getTrunkVariation(), unit: '°' });

      if (minAngles.hip_avg !== undefined && minAngles.knee_left !== undefined) {
        const hipChange = 180 - minAngles.hip_avg;
        const kneeChange = 180 - minAngles.knee_left;
        const ratio = kneeChange > 0 ? Math.round((hipChange / kneeChange) * 10) / 10 : 2;
        metrics.push({ metric: 'hip_angle_vs_knee_angle_ratio', value: ratio, unit: ':1' });
      }

      const trunkVar = getTrunkVariation();
      metrics.push({ metric: 'horizontal_bar_deviation_cm', value: trunkVar > 10 ? 5 : 2, unit: 'cm' });

      if (avgAngles.trunk_inclination !== undefined)
        metrics.push({ metric: 'thoracic_flexion_degrees', value: avgAngles.trunk_inclination, unit: '°' });

      if (maxAngles.hip_avg !== undefined)
        metrics.push({ metric: 'hip_extension_at_top', value: maxAngles.hip_avg, unit: '°' });
      break;
    }

    case 'pull': {
      const shoulderVals = allFrameAngles.map(a => a.shoulder_left).filter((v): v is number => v !== undefined);
      const scapChange = robustVariation(shoulderVals);
      metrics.push({ metric: 'scapular_distance_change_cm', value: Math.round(scapChange * 0.3 * 10) / 10, unit: 'cm' });

      if (minAngles.elbow_left !== undefined)
        metrics.push({ metric: 'elbow_angle_at_contraction', value: minAngles.elbow_left, unit: '°' });

      metrics.push({ metric: 'trunk_angle_variation_degrees', value: getTrunkVariation(), unit: '°' });

      if (avgAngles.trunk_inclination !== undefined)
        metrics.push({ metric: 'lumbar_flexion_degrees', value: avgAngles.trunk_inclination, unit: '°' });
      break;
    }

    case 'horizontal_press': {
      if (minAngles.elbow_left !== undefined)
        metrics.push({ metric: 'elbow_angle_at_chest', value: minAngles.elbow_left, unit: '°' });

      const wristVals = allFrameAngles.map(a => a.wrist_angle_left).filter((v): v is number => v !== undefined);
      metrics.push({ metric: 'wrist_extension_degrees', value: robustVariation(wristVals), unit: '°' });
      break;
    }

    case 'vertical_press': {
      if (maxAngles.shoulder_left !== undefined)
        metrics.push({ metric: 'shoulder_flexion_at_top', value: maxAngles.shoulder_left, unit: '°' });

      metrics.push({ metric: 'lumbar_extension_increase_degrees', value: getTrunkVariation(), unit: '°' });
      metrics.push({ metric: 'rib_cage_angle_change', value: getTrunkVariation(), unit: '°' });
      break;
    }

    default: {
      if (minAngles.hip_avg !== undefined)
        metrics.push({ metric: 'hip_angle_at_bottom', value: minAngles.hip_avg, unit: '°' });
      if (avgAngles.trunk_inclination !== undefined)
        metrics.push({ metric: 'trunk_inclination_degrees', value: avgAngles.trunk_inclination, unit: '°' });
      break;
    }
  }

  return metrics;
}
