/**
 * Client HTTP para o serviço Python MediaPipe (port 5000)
 * Converte angles da resposta Python para MetricValue[] do classifier
 * e landmarks_3d para Frame[] do mediapipe-processor
 */

import axios from 'axios';
import { MetricValue } from './criteria-classifier';
import { Frame, Landmark } from './mediapipe-processor';

const MEDIAPIPE_SERVICE_URL = process.env.MEDIAPIPE_SERVICE_URL || 'http://localhost:5000';

// ============================
// Tipos da resposta Python
// ============================

export interface MediaPipeServiceFrame {
  path: string;
  timestamp_ms: number;
}

export interface MediaPipeAngles {
  knee_left?: number;
  knee_right?: number;
  hip?: number;
  trunk?: number;
  ankle_left?: number;
  ankle_right?: number;
  knee_valgus_left?: number;
  knee_valgus_right?: number;
  pelvic_tilt?: number;
  back_angle?: number;
  elbow_left?: number;
  elbow_right?: number;
  shoulder_left?: number;
  shoulder_right?: number;
}

interface MediaPipeServiceFrameResult {
  frame_number: number;
  timestamp_ms: number;
  phase: string;
  confidence: number;
  landmarks_3d: Array<Record<string, any>>;
  angles: MediaPipeAngles;
}

export interface MediaPipeServiceResult {
  success: boolean;
  frames: MediaPipeServiceFrameResult[];
  duration_ms: number;
  processing_time_ms: number;
}

// ============================
// Client HTTP
// ============================

export async function callMediaPipeService(
  framePaths: MediaPipeServiceFrame[],
  exerciseType: string = 'squat'
): Promise<MediaPipeServiceResult> {
  const response = await axios.post(
    `${MEDIAPIPE_SERVICE_URL}/analyze-frames`,
    { frames: framePaths, exercise_type: exerciseType },
    { timeout: 60000 }
  );
  return response.data;
}

export async function checkMediaPipeService(): Promise<boolean> {
  try {
    const response = await axios.get(`${MEDIAPIPE_SERVICE_URL}/health`, { timeout: 3000 });
    return response.data?.status === 'healthy';
  } catch {
    return false;
  }
}

// ============================
// BRIDGE: Python angles → MetricValue[]
// ============================

/**
 * Mapeamento de nomes de ângulos do Python para nomes de métricas
 * usados nos CategoryTemplates (criteria-classifier)
 */
const ANGLE_METRIC_MAP: Record<string, Record<string, { metric: string; unit: string }>> = {
  squat: {
    hip: { metric: 'hip_angle_at_bottom', unit: '°' },
    trunk: { metric: 'trunk_inclination_degrees', unit: '°' },
    ankle_left: { metric: 'ankle_dorsiflexion_degrees', unit: '°' },
    knee_valgus_left: { metric: 'knee_medial_displacement_cm', unit: 'cm' },
    knee_valgus_right: { metric: 'knee_medial_displacement_cm', unit: 'cm' },
    pelvic_tilt: { metric: 'lumbar_flexion_change_degrees', unit: '°' },
  },
  hinge: {
    trunk: { metric: 'lumbar_flexion_degrees', unit: '°' },
    back_angle: { metric: 'thoracic_flexion_degrees', unit: '°' },
    hip: { metric: 'hip_extension_at_top', unit: '°' },
  },
  horizontal_press: {
    elbow_left: { metric: 'elbow_angle_at_chest', unit: '°' },
    elbow_right: { metric: 'elbow_angle_at_chest', unit: '°' },
  },
  vertical_press: {
    shoulder_left: { metric: 'shoulder_flexion_at_top', unit: '°' },
    trunk: { metric: 'lumbar_extension_increase_degrees', unit: '°' },
  },
  pull: {
    elbow_left: { metric: 'elbow_angle_at_contraction', unit: '°' },
    trunk: { metric: 'lumbar_flexion_degrees', unit: '°' },
  },
};

/**
 * Converte ângulos retornados pelo Python MediaPipe service em MetricValue[]
 * compatível com o criteria-classifier
 */
export function pythonAnglesToMetricValues(
  angles: MediaPipeAngles,
  category: string
): MetricValue[] {
  const metrics: MetricValue[] = [];
  const mapping = ANGLE_METRIC_MAP[category] || ANGLE_METRIC_MAP.squat;
  const seenMetrics = new Set<string>();

  for (const [angleKey, value] of Object.entries(angles)) {
    if (value === undefined || value === null) continue;

    const mapEntry = mapping[angleKey];
    if (mapEntry && !seenMetrics.has(mapEntry.metric)) {
      metrics.push({
        metric: mapEntry.metric,
        value: Math.round(value * 10) / 10,
        unit: mapEntry.unit,
      });
      seenMetrics.add(mapEntry.metric);
    }
  }

  // Assimetria bilateral (joelhos)
  if (angles.knee_left != null && angles.knee_right != null) {
    metrics.push({
      metric: 'bilateral_angle_difference',
      value: Math.round(Math.abs(angles.knee_left - angles.knee_right) * 10) / 10,
      unit: '°',
    });
  }

  return metrics;
}

/**
 * Agrega métricas de múltiplos frames do Python service.
 * Usa média para ângulos e máximo para deslocamentos.
 */
export function aggregatePythonFrameMetrics(
  frames: MediaPipeServiceFrameResult[],
  category: string
): MetricValue[] {
  if (frames.length === 0) return [];

  // Coletar todos os valores por key
  const byKey = new Map<string, number[]>();
  for (const frame of frames) {
    for (const [key, value] of Object.entries(frame.angles)) {
      if (value == null) continue;
      if (!byKey.has(key)) byKey.set(key, []);
      byKey.get(key)!.push(value);
    }
  }

  // Criar angles agregados: mínimo para hip (profundidade), máximo para valgus, média para resto
  const aggregated: MediaPipeAngles = {};
  byKey.forEach((values, key) => {
    if (key === 'hip') {
      // Para profundidade, o menor valor é o fundo do agachamento
      (aggregated as any)[key] = Math.min(...values);
    } else if (key.includes('valgus')) {
      // Para valgus, o máximo é o pior desvio
      (aggregated as any)[key] = Math.max(...values);
    } else {
      // Para outros, média
      (aggregated as any)[key] = values.reduce((a, b) => a + b, 0) / values.length;
    }
  });

  return pythonAnglesToMetricValues(aggregated, category);
}

// ============================
// BRIDGE: Python landmarks_3d → Frame[]
// ============================

const LANDMARK_INDEX_TO_NAME: Record<number, string> = {
  0: 'nose',
  11: 'left_shoulder',
  12: 'right_shoulder',
  13: 'left_elbow',
  14: 'right_elbow',
  15: 'left_wrist',
  16: 'right_wrist',
  23: 'left_hip',
  24: 'right_hip',
  25: 'left_knee',
  26: 'right_knee',
  27: 'left_ankle',
  28: 'right_ankle',
};

/**
 * Converte landmarks_3d da resposta Python para Frame[] do mediapipe-processor.ts
 */
export function pythonLandmarksToFrames(
  serviceResult: MediaPipeServiceResult
): Frame[] {
  return serviceResult.frames.map((f) => {
    const landmarks: Record<string, Landmark> = {};

    if (Array.isArray(f.landmarks_3d)) {
      for (let i = 0; i < f.landmarks_3d.length; i++) {
        const lm = f.landmarks_3d[i];
        const name = lm.name || LANDMARK_INDEX_TO_NAME[lm.id ?? i];
        if (name) {
          landmarks[name] = {
            x: lm.x,
            y: lm.y,
            z: lm.z || 0,
            visibility: lm.visibility ?? 0.9,
          };
        }
      }
    }

    return {
      frameNumber: f.frame_number,
      timestamp: f.timestamp_ms,
      landmarks,
    };
  });
}
