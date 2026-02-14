/**
 * Bridge Node.js → Python MediaPipe
 * Chama scripts/mediapipe_analyze_frame.py via child_process
 * Retorna ângulos articulares REAIS (sem Ollama Vision)
 *
 * Melhorias v4.1:
 * - Filtro de confidence DUAL: motor >= 0.3 (captura extremos), estabilizador >= 0.5 (filtra ruído)
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

/** Confidence mínimo para MOTOR (min/max ROM) — mais permissivo para capturar posições extremas */
const MOTOR_MIN_CONFIDENCE = 0.3;

/** Confidence mínimo para ESTABILIZADOR (variação) — mais restritivo para filtrar ruído */
const STABILIZER_MIN_CONFIDENCE = 0.5;

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

/** Métricas que devem usar coordenadas 2D da imagem (não world 3D) */
const IMAGE_ONLY_METRICS = new Set([
  'knee_valgus_left_cm', 'knee_valgus_right_cm',
  'shoulder_elevation_left', 'shoulder_elevation_right',
  'wrist_angle_left', 'wrist_angle_right',
  'hip_width_norm', 'calibration_factor',
]);

export interface AggregatedMediaPipeData {
  avgAngles: MediaPipeAngles;
  /** Min/max calculados com MOTOR threshold (conf >= 0.3) — captura extremos */
  minAngles: MediaPipeAngles;
  maxAngles: MediaPipeAngles;
  /** Ângulos de cada frame com STABILIZER threshold (conf >= 0.5) — para variação */
  allFrameAngles: MediaPipeAngles[];
  /** Confidence de cada frame filtrado (mesmo índice que allFrameAngles) */
  frameConfidences: number[];
  framesProcessed: number;
  /** Frames descartados (conf < threshold motor) */
  framesFiltered: number;
  avgConfidence: number;
  /** Aviso se qualidade do vídeo é baixa */
  videoQualityWarning: string | null;
}

/**
 * Agrega ângulos de múltiplos frames MediaPipe
 *
 * Estratégia DUAL de filtragem:
 * - MOTOR (min/max): conf >= 0.3 — mais permissivo para capturar posições extremas
 *   (ex: fundo do agachamento tem conf mais baixo por oclusão, mas os ângulos são válidos)
 * - STABILIZER (variação): conf >= 0.5 — mais restritivo para filtrar ruído
 * - Média ponderada por confidence
 * - Aviso de qualidade quando conf médio < 0.6
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

  // Mesclar world_angles (3D) + image angles (2D) para cada frame:
  // - Ângulos articulares (knee, hip, shoulder, elbow, trunk) → world_angles (mais preciso em 3D)
  // - Métricas posicionais (valgo, elevação ombro) → image angles (plano frontal 2D)
  const allAngles = successFrames.map(f => {
    const hasWorld = Object.keys(f.world_angles || {}).length > 2;
    if (!hasWorld) return f.angles;

    // Começar com world_angles (ângulos articulares em 3D)
    const merged: MediaPipeAngles = { ...f.world_angles };

    // Substituir métricas posicionais pelas da imagem 2D
    for (const key of IMAGE_ONLY_METRICS) {
      const imgVal = (f.angles as Record<string, number | undefined>)[key];
      if (imgVal !== undefined) {
        (merged as Record<string, number>)[key] = imgVal;
      } else {
        // Remover valor 3D incorreto
        delete (merged as Record<string, number | undefined>)[key];
      }
    }

    // Confidence da imagem (world não tem)
    merged.confidence = f.angles.confidence;
    return merged;
  });
  const allConfidences = allAngles.map(a => a.confidence ?? 0);

  // --- FILTRO DUAL ---
  // Motor: conf >= 0.3 (captura posições extremas como fundo do agachamento)
  const motorFrames: { angles: MediaPipeAngles; confidence: number }[] = [];
  // Stabilizer: conf >= 0.5 (filtra ruído para variação)
  const stabFrames: { angles: MediaPipeAngles; confidence: number }[] = [];

  for (let i = 0; i < allAngles.length; i++) {
    const conf = allConfidences[i];
    if (conf >= MOTOR_MIN_CONFIDENCE) {
      motorFrames.push({ angles: allAngles[i], confidence: conf });
    }
    if (conf >= STABILIZER_MIN_CONFIDENCE) {
      stabFrames.push({ angles: allAngles[i], confidence: conf });
    }
  }

  const framesFilteredMotor = successFrames.length - motorFrames.length;
  const framesFilteredStab = successFrames.length - stabFrames.length;
  if (framesFilteredMotor > 0 || framesFilteredStab > 0) {
    console.log(`[MediaPipe] Filtro: ${framesFilteredMotor} frames removidos para motor (conf<${MOTOR_MIN_CONFIDENCE}), ${framesFilteredStab} para estabilizador (conf<${STABILIZER_MIN_CONFIDENCE})`);
  }

  // Fallback: se TODOS foram descartados, usar originais
  const useMotorFrames = motorFrames.length > 0 ? motorFrames : allAngles.map((a, i) => ({ angles: a, confidence: allConfidences[i] }));
  const useStabFrames = stabFrames.length > 0 ? stabFrames : allAngles.map((a, i) => ({ angles: a, confidence: allConfidences[i] }));

  // === MIN/MAX a partir dos frames MOTOR (threshold mais baixo) ===
  const motorAngles = useMotorFrames.map(f => f.angles);
  const motorConfs = useMotorFrames.map(f => f.confidence);

  const allKeys = new Set<string>();
  for (const angles of motorAngles) {
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
    // MIN/MAX: from motor frames (conf >= 0.3)
    const motorValues: { value: number; confidence: number }[] = [];
    for (let i = 0; i < motorAngles.length; i++) {
      const v = (motorAngles[i] as Record<string, number | undefined>)[key];
      if (v !== undefined && v >= 0) {
        motorValues.push({ value: v, confidence: motorConfs[i] });
      }
    }
    if (motorValues.length === 0) continue;

    const vals = motorValues.map(v => v.value);
    (min as Record<string, number>)[key] = Math.round(Math.min(...vals) * 10) / 10;
    (max as Record<string, number>)[key] = Math.round(Math.max(...vals) * 10) / 10;

    // AVG: weighted average from motor frames
    const weights = motorValues.map(v => v.confidence);
    (avg as Record<string, number>)[key] = weightedAverage(vals, weights);
  }

  // === allFrameAngles para estabilizadores (threshold mais alto) ===
  const stabAngles = useStabFrames.map(f => f.angles);
  const stabConfs = useStabFrames.map(f => f.confidence);

  // Confidence médio (dos frames estabilizadores)
  const avgConf = stabConfs.length > 0
    ? Math.round((stabConfs.reduce((s, v) => s + v, 0) / stabConfs.length) * 1000) / 1000
    : 0;

  // Aviso de qualidade do vídeo
  let videoQualityWarning: string | null = null;
  if (avgConf < 0.6) {
    videoQualityWarning = 'Qualidade do vídeo limitada — análise pode ser imprecisa. Para análise mais precisa, filme de perfil ou de frente, com boa iluminação e corpo inteiro visível.';
  }

  return {
    avgAngles: avg,
    minAngles: min,
    maxAngles: max,
    allFrameAngles: stabAngles,
    frameConfidences: stabConfs,
    framesProcessed: useMotorFrames.length,
    framesFiltered: framesFilteredMotor,
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
    const input = mapMediaPipeMotor(mj.joint, mj.criteria.rom.metric, agg, template.category);
    if (input) motorMetrics.push(input);
  }

  for (const sj of template.stabilizerJoints) {
    const input = mapMediaPipeStabilizer(sj.joint, sj.criteria.maxVariation.metric, agg, template.category);
    if (input) stabilizerMetrics.push(input);
  }

  return { motorMetrics, stabilizerMetrics };
}

/** Categorias onde o movimento vai de LOW → HIGH (start=min, peak=max) */
const LOW_TO_HIGH_CATEGORIES = new Set(['hip_dominant', 'isolation_shoulder']);

/**
 * Mapeia articulação motora do MediaPipe
 * Inclui startAngle/peakAngle para análise em 3 pontos
 */
function mapMediaPipeMotor(
  joint: string,
  metric: string,
  agg: AggregatedMediaPipeData,
  category: string,
): MotorMetricInput | null {
  const { minAngles, maxAngles, avgAngles } = agg;
  const lowToHigh = LOW_TO_HIGH_CATEGORIES.has(category);

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

      // 3 pontos: ângulos absolutos de start e peak
      const kneeMax = Math.max(maxAngles.knee_left ?? 0, maxAngles.knee_right ?? 0);
      const kneeMin = Math.min(leftMin ?? 999, rightMin ?? 999);
      const startAngle = lowToHigh ? (kneeMin < 999 ? kneeMin : undefined) : (kneeMax || undefined);
      const peakAngle = lowToHigh ? (kneeMax || undefined) : (kneeMin < 999 ? kneeMin : undefined);

      return {
        joint: 'knee',
        romValue: romValue < 999 ? romValue : 0,
        romUnit: '°',
        leftValue: leftMin,
        rightValue: rightMin,
        startAngle,
        peakAngle,
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

      // 3 pontos
      const startAngle = lowToHigh ? hipMin : hipMax;
      const peakAngle = lowToHigh ? hipMax : hipMin;

      return {
        joint: 'hip',
        romValue,
        romUnit: '°',
        leftValue: minAngles.hip_left,
        rightValue: minAngles.hip_right,
        startAngle,
        peakAngle,
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

      // 3 pontos
      const sMin = Math.min(minAngles.shoulder_left ?? 999, minAngles.shoulder_right ?? 999);
      const sMax = Math.max(leftMax ?? 0, rightMax ?? 0);
      const shoulderStart = lowToHigh ? (sMin < 999 ? sMin : undefined) : (sMax || undefined);
      const shoulderPeak = lowToHigh ? (sMax || undefined) : (sMin < 999 ? sMin : undefined);

      return {
        joint: 'shoulder',
        romValue,
        romUnit: '°',
        leftValue: leftMax,
        rightValue: rightMax,
        peakContractionValue,
        peakContractionUnit: peakContractionValue !== undefined ? 'cm' : undefined,
        startAngle: shoulderStart,
        peakAngle: shoulderPeak,
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

      // 3 pontos — elbow em press: start=min(flexão), peak=max(extensão); em pull: start=max, peak=min
      const elbowMax = Math.max(leftMax ?? 0, rightMax ?? 0);
      const elbowMin = Math.min(leftMin ?? 999, rightMin ?? 999);
      let elbowStart: number | undefined;
      let elbowPeak: number | undefined;
      if (metric.includes('extension_at_lockout')) {
        elbowStart = elbowMin < 999 ? elbowMin : undefined;
        elbowPeak = elbowMax || undefined;
      } else {
        elbowStart = elbowMax || undefined;
        elbowPeak = elbowMin < 999 ? elbowMin : undefined;
      }

      return {
        joint: 'elbow',
        romValue,
        romUnit: '°',
        leftValue: metric.includes('extension_at_lockout') ? leftMax : leftMin,
        rightValue: metric.includes('extension_at_lockout') ? rightMax : rightMin,
        startAngle: elbowStart,
        peakAngle: elbowPeak,
      };
    }

    default:
      return null;
  }
}

/**
 * Mapeia articulação estabilizadora do MediaPipe
 * Usa percentil 10-90 para variação (elimina spikes de outliers)
 *
 * Para exercícios hinge (deadlift, RDL):
 * - trunk_inclination varia ~60° por design (o tronco DEVE inclinar)
 * - Para isolar instabilidade REAL (spine rounding), subtrai a variação esperada pelo hip ROM
 * - Fórmula: adjustedVar = trunkVar - hipVar * 0.5 (clamped >= 0)
 */
function mapMediaPipeStabilizer(
  joint: string,
  _metric: string,
  agg: AggregatedMediaPipeData,
  category?: string,
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

  /**
   * Corrige variação do tronco para exercícios onde o tronco DEVE mover (hinge).
   * Em deadlift com spine neutra: trunk_inclination ≈ f(hip_flexion)
   * A variação que NÃO é explicada pelo hip ROM = instabilidade espinhal real.
   */
  const getHipCorrectedTrunkVariation = (): number | null => {
    const trunkVar = getRobustVariation('trunk_inclination');
    if (trunkVar === null) return null;

    // Só corrige para hinge — em squat/press o tronco não deve mover tanto
    if (category !== 'hinge') return trunkVar;

    const hipVar = getRobustVariation('hip_avg');
    if (hipVar === null || hipVar < 10) return trunkVar;

    // Fator 0.5: em spine neutra, trunk move ~50% do que o hip
    const corrected = Math.max(0, trunkVar - hipVar * 0.5);
    return Math.round(corrected * 10) / 10;
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
      const variation = getHipCorrectedTrunkVariation();
      if (variation === null) return null;
      return { joint: 'lumbar', variationValue: variation, unit: '°' };
    }

    case 'trunk': {
      // Trunk = inclinação MÉDIA em relação à vertical (não variação)
      // Ex: 35° = forward lean moderado. Ranges no template: acceptable=40, warning=52
      const avgTrunk = agg.avgAngles.trunk_inclination;
      if (avgTrunk === undefined || avgTrunk === null) return null;
      return { joint: 'trunk', variationValue: avgTrunk, unit: '°' };
    }

    case 'thoracic': {
      const variation = getHipCorrectedTrunkVariation();
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
      const variation = getHipCorrectedTrunkVariation();
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
