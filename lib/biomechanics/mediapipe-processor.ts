/**
 * Processador de dados do MediaPipe
 * Extrai landmarks, calcula ângulos, desvios e métricas derivadas
 */

import { MetricValue } from './criteria-classifier';

// Tipos de dados do MediaPipe
export interface Landmark {
  x: number; // Coordenada horizontal normalizada (0-1)
  y: number; // Coordenada vertical normalizada (0-1)
  z?: number; // Profundidade (se disponível)
  visibility?: number; // Confiança da detecção (0-1)
}

export interface Frame {
  frameNumber: number;
  timestamp: number;
  landmarks: Record<string, Landmark>;
}

export interface ProcessedFrameMetrics {
  frameNumber: number;
  timestamp: number;
  phase?: 'eccentric' | 'concentric' | 'isometric';
  metrics: MetricValue[];
}

export interface ProcessedVideoMetrics {
  totalFrames: number;
  fps?: number;
  duration?: number;
  frames: ProcessedFrameMetrics[];
  summary: {
    rom: Record<string, { min: number; max: number }>;
    asymmetries: Record<string, number>;
    peakValues: Record<string, { value: number; frameNumber: number }>;
    phases: {
      eccentric?: { startFrame: number; endFrame: number; durationMs: number };
      concentric?: { startFrame: number; endFrame: number; durationMs: number };
    };
    tempo?: {
      eccentricMs: number;
      concentricMs: number;
      ratio: string;
    };
  };
}

// Nomes dos landmarks padrão do MediaPipe Pose
export const LANDMARKS = {
  // Spine
  NOSE: 'nose',
  LEFT_EYE: 'left_eye',
  RIGHT_EYE: 'right_eye',
  LEFT_EAR: 'left_ear',
  RIGHT_EAR: 'right_ear',

  // Shoulders
  LEFT_SHOULDER: 'left_shoulder',
  RIGHT_SHOULDER: 'right_shoulder',

  // Elbows
  LEFT_ELBOW: 'left_elbow',
  RIGHT_ELBOW: 'right_elbow',

  // Wrists
  LEFT_WRIST: 'left_wrist',
  RIGHT_WRIST: 'right_wrist',

  // Hips
  LEFT_HIP: 'left_hip',
  RIGHT_HIP: 'right_hip',

  // Knees
  LEFT_KNEE: 'left_knee',
  RIGHT_KNEE: 'right_knee',

  // Ankles
  LEFT_ANKLE: 'left_ankle',
  RIGHT_ANKLE: 'right_ankle',

  // Feet
  LEFT_HEEL: 'left_heel',
  RIGHT_HEEL: 'right_heel',
  LEFT_FOOT_INDEX: 'left_foot_index',
  RIGHT_FOOT_INDEX: 'right_foot_index',
};

/**
 * Calcula a distância euclidiana entre dois pontos
 */
function distance(p1: Landmark, p2: Landmark): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = (p2.z || 0) - (p1.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Calcula ângulo entre três pontos (em graus)
 * Ponto do meio é o vértice do ângulo
 */
function angleBetweenPoints(
  p1: Landmark,
  vertex: Landmark,
  p3: Landmark
): number {
  const v1 = { x: p1.x - vertex.x, y: p1.y - vertex.y };
  const v2 = { x: p3.x - vertex.x, y: p3.y - vertex.y };

  const dotProduct = v1.x * v2.x + v1.y * v2.y;
  const magnitude1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
  const magnitude2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  const cosineAngle = dotProduct / (magnitude1 * magnitude2);
  const radians = Math.acos(Math.max(-1, Math.min(1, cosineAngle)));
  return (radians * 180) / Math.PI;
}

/**
 * Calcula ângulo entre um vetor (p1→p2) e a vertical (para cima)
 * 0° = vertical, 90° = horizontal
 * Em coords de tela: vertical = (0, -1) pois y cresce pra baixo
 */
function angleFromVertical(p1: Landmark, p2: Landmark): number {
  const vx = p2.x - p1.x;
  const vy = p2.y - p1.y;
  // Vertical para cima em coords de tela: (0, -1)
  const dot = vy * -1; // vx*0 + vy*(-1)
  const mag = Math.sqrt(vx * vx + vy * vy);
  if (mag === 0) return 0;
  const cosAngle = dot / mag;
  const radians = Math.acos(Math.max(-1, Math.min(1, cosAngle)));
  return (radians * 180) / Math.PI;
}

/**
 * Calcula o ângulo de inclinação no plano frontal
 * Retorna desvio medial em cm (baseado em proporção do vídeo)
 */
function calculateMedialDisplacement(
  shoulder: Landmark,
  hip: Landmark,
  knee: Landmark,
  ankle: Landmark,
  frameWidth: number = 640
): number {
  // Linha esperada: ankle -> knee -> hip -> shoulder (alinhado)
  // Desvio medial = quanto o joelho se desvia da linha esperada (plano frontal)

  // Calcular linha reta entre ankle e hip
  const lineAngle = Math.atan2(hip.y - ankle.y, hip.x - ankle.x);
  const cos = Math.cos(lineAngle);
  const sin = Math.sin(lineAngle);

  // Projetar joelho na linha
  const dx = knee.x - ankle.x;
  const dy = knee.y - ankle.y;
  const projection = dx * cos + dy * sin;

  // Distância perpendicular (desvio)
  const perpDist = Math.abs(dy * cos - dx * sin);

  // Converter para cm (assumindo frame width = 640px ~= 50cm de corpo)
  return perpDist * (50 / frameWidth);
}

/**
 * Processa um único frame e extrai métricas
 */
export function processFrame(
  frame: Frame,
  category: string,
  frameWidth: number = 640,
  frameHeight: number = 480
): ProcessedFrameMetrics {
  const metrics: MetricValue[] = [];
  const lm = frame.landmarks;

  // Verificar landmarks necessários
  const hasRequiredLandmarks = (landmarks: string[]) => {
    return landmarks.every((l) => lm[l] && (lm[l].visibility || 1) > 0.5);
  };

  // ===== SQUAT / UNILATERAL =====
  if (['squat', 'unilateral'].includes(category)) {
    // Profundidade: ângulo do quadril
    if (
      hasRequiredLandmarks([
        LANDMARKS.LEFT_HIP,
        LANDMARKS.LEFT_KNEE,
        LANDMARKS.LEFT_ANKLE,
      ])
    ) {
      const hipAngle = angleBetweenPoints(
        lm[LANDMARKS.LEFT_SHOULDER],
        lm[LANDMARKS.LEFT_HIP],
        lm[LANDMARKS.LEFT_KNEE]
      );
      metrics.push({
        metric: 'hip_angle_left',
        value: Math.round(hipAngle),
        unit: '°',
      });
    }

    if (
      hasRequiredLandmarks([
        LANDMARKS.RIGHT_HIP,
        LANDMARKS.RIGHT_KNEE,
        LANDMARKS.RIGHT_ANKLE,
      ])
    ) {
      const hipAngle = angleBetweenPoints(
        lm[LANDMARKS.RIGHT_SHOULDER],
        lm[LANDMARKS.RIGHT_HIP],
        lm[LANDMARKS.RIGHT_KNEE]
      );
      metrics.push({
        metric: 'hip_angle_right',
        value: Math.round(hipAngle),
        unit: '°',
      });
    }

    // Valgo de joelho (deslocamento medial)
    if (
      hasRequiredLandmarks([
        LANDMARKS.RIGHT_SHOULDER,
        LANDMARKS.RIGHT_HIP,
        LANDMARKS.RIGHT_KNEE,
        LANDMARKS.RIGHT_ANKLE,
      ])
    ) {
      const valgo = calculateMedialDisplacement(
        lm[LANDMARKS.RIGHT_SHOULDER],
        lm[LANDMARKS.RIGHT_HIP],
        lm[LANDMARKS.RIGHT_KNEE],
        lm[LANDMARKS.RIGHT_ANKLE],
        frameWidth
      );
      metrics.push({
        metric: 'knee_valgus_right_cm',
        value: Math.round(valgo * 10) / 10,
        unit: 'cm',
      });
    }

    if (
      hasRequiredLandmarks([
        LANDMARKS.LEFT_SHOULDER,
        LANDMARKS.LEFT_HIP,
        LANDMARKS.LEFT_KNEE,
        LANDMARKS.LEFT_ANKLE,
      ])
    ) {
      const valgo = calculateMedialDisplacement(
        lm[LANDMARKS.LEFT_SHOULDER],
        lm[LANDMARKS.LEFT_HIP],
        lm[LANDMARKS.LEFT_KNEE],
        lm[LANDMARKS.LEFT_ANKLE],
        frameWidth
      );
      metrics.push({
        metric: 'knee_valgus_left_cm',
        value: Math.round(valgo * 10) / 10,
        unit: 'cm',
      });
    }

    // Inclinação do tronco (ângulo do vetor hip→shoulder vs vertical)
    // 0° = tronco vertical (em pé), ~30° = inclinação típica de agachamento
    if (
      hasRequiredLandmarks([
        LANDMARKS.LEFT_SHOULDER,
        LANDMARKS.LEFT_HIP,
      ])
    ) {
      const trunkAngle = angleFromVertical(
        lm[LANDMARKS.LEFT_HIP],
        lm[LANDMARKS.LEFT_SHOULDER]
      );
      metrics.push({
        metric: 'trunk_inclination_degrees',
        value: Math.round(trunkAngle),
        unit: '°',
      });
    }

    // Mudança de flexão lombar (proxy para butt wink)
    // Mede variação do ângulo pélvico: diferença entre tronco e quadril
    // Se o tronco inclina mais que o quadril flexiona, sugere flexão lombar
    if (
      hasRequiredLandmarks([
        LANDMARKS.LEFT_SHOULDER,
        LANDMARKS.LEFT_HIP,
        LANDMARKS.LEFT_KNEE,
      ])
    ) {
      const trunkTilt = angleFromVertical(
        lm[LANDMARKS.LEFT_HIP],
        lm[LANDMARKS.LEFT_SHOULDER]
      );
      const hipAngle = angleBetweenPoints(
        lm[LANDMARKS.LEFT_SHOULDER],
        lm[LANDMARKS.LEFT_HIP],
        lm[LANDMARKS.LEFT_KNEE]
      );
      // Em agachamento ideal: tronco inclina ~30° e hip angle ~80°
      // Butt wink: tronco inclina desproporcionalmente ao hip angle
      // Proxy: registrar o trunk tilt por frame, o aggregator calcula o DELTA
      metrics.push({
        metric: 'lumbar_flexion_proxy',
        value: Math.round(trunkTilt * 10) / 10,
        unit: '°',
      });
    }

    // Dorsiflexão do tornozelo
    // Mede inclinação da tíbia em relação à vertical (0° em pé, ~25-35° agachado)
    if (
      hasRequiredLandmarks([
        LANDMARKS.LEFT_KNEE,
        LANDMARKS.LEFT_ANKLE,
      ])
    ) {
      // Ângulo entre tíbia (ankle→knee) e referência vertical (ankle→ponto acima)
      const shinTilt = angleBetweenPoints(
        lm[LANDMARKS.LEFT_KNEE],
        lm[LANDMARKS.LEFT_ANKLE],
        { x: lm[LANDMARKS.LEFT_ANKLE].x, y: lm[LANDMARKS.LEFT_ANKLE].y - 0.2, z: 0 }
      );

      metrics.push({
        metric: 'ankle_dorsiflexion_degrees',
        value: Math.round(Math.max(0, shinTilt)),
        unit: '°',
      });
    }
  }

  // ===== HINGE (Deadlift, RDL) =====
  if (category === 'hinge') {
    // Flexão lombar
    if (
      hasRequiredLandmarks([
        LANDMARKS.LEFT_SHOULDER,
        LANDMARKS.LEFT_HIP,
      ])
    ) {
      const lumbarFlexion = Math.max(
        0,
        90 -
          angleBetweenPoints(
            { x: 0.5, y: 0, z: 0 },
            lm[LANDMARKS.LEFT_HIP],
            lm[LANDMARKS.LEFT_SHOULDER]
          )
      );
      metrics.push({
        metric: 'lumbar_flexion_degrees',
        value: Math.round(lumbarFlexion),
        unit: '°',
      });
    }

    // Hip hinge dominance (hip angle vs knee angle ratio)
    if (
      hasRequiredLandmarks([
        LANDMARKS.LEFT_HIP,
        LANDMARKS.LEFT_KNEE,
        LANDMARKS.LEFT_ANKLE,
      ])
    ) {
      const hipAngle = angleBetweenPoints(
        { x: 0.5, y: 0, z: 0 },
        lm[LANDMARKS.LEFT_HIP],
        lm[LANDMARKS.LEFT_KNEE]
      );
      const kneeAngle = angleBetweenPoints(
        lm[LANDMARKS.LEFT_HIP],
        lm[LANDMARKS.LEFT_KNEE],
        lm[LANDMARKS.LEFT_ANKLE]
      );

      const ratio = kneeAngle > 0 ? hipAngle / kneeAngle : 0;
      metrics.push({
        metric: 'hip_knee_angle_ratio',
        value: Math.round(ratio * 100) / 100,
      });
    }
  }

  // ===== HORIZONTAL PRESS (Supino) =====
  if (category === 'horizontal_press') {
    // Ângulo do cotovelo
    if (
      hasRequiredLandmarks([
        LANDMARKS.LEFT_SHOULDER,
        LANDMARKS.LEFT_ELBOW,
        LANDMARKS.LEFT_WRIST,
      ])
    ) {
      const elbowAngle = angleBetweenPoints(
        lm[LANDMARKS.LEFT_SHOULDER],
        lm[LANDMARKS.LEFT_ELBOW],
        lm[LANDMARKS.LEFT_WRIST]
      );
      metrics.push({
        metric: 'elbow_angle_left',
        value: Math.round(elbowAngle),
        unit: '°',
      });
    }

    // Extensão do punho
    if (
      hasRequiredLandmarks([
        LANDMARKS.LEFT_ELBOW,
        LANDMARKS.LEFT_WRIST,
      ])
    ) {
      const wristExtension = Math.max(
        0,
        angleBetweenPoints(
          lm[LANDMARKS.LEFT_ELBOW],
          lm[LANDMARKS.LEFT_WRIST],
          { x: lm[LANDMARKS.LEFT_WRIST].x + 0.1, y: lm[LANDMARKS.LEFT_WRIST].y, z: 0 }
        ) - 90
      );
      metrics.push({
        metric: 'wrist_extension_degrees',
        value: Math.round(wristExtension),
        unit: '°',
      });
    }
  }

  // ===== VERTICAL PRESS =====
  if (category === 'vertical_press') {
    // Flexão de ombro no lockout
    if (
      hasRequiredLandmarks([
        LANDMARKS.LEFT_HIP,
        LANDMARKS.LEFT_SHOULDER,
        LANDMARKS.LEFT_ELBOW,
      ])
    ) {
      const shoulderFlexion = angleBetweenPoints(
        lm[LANDMARKS.LEFT_HIP],
        lm[LANDMARKS.LEFT_SHOULDER],
        lm[LANDMARKS.LEFT_ELBOW]
      );
      metrics.push({
        metric: 'shoulder_flexion_degrees',
        value: Math.round(shoulderFlexion),
        unit: '°',
      });
    }

    // Extensão lombar
    if (
      hasRequiredLandmarks([
        LANDMARKS.LEFT_SHOULDER,
        LANDMARKS.LEFT_HIP,
      ])
    ) {
      const lumbarExtension = Math.max(
        0,
        angleBetweenPoints(
          { x: 0.5, y: 0, z: 0 },
          lm[LANDMARKS.LEFT_HIP],
          lm[LANDMARKS.LEFT_SHOULDER]
        ) - 90
      );
      metrics.push({
        metric: 'lumbar_extension_degrees',
        value: Math.round(lumbarExtension),
        unit: '°',
      });
    }
  }

  // ===== PULL (Remada / Puxada) =====
  if (category === 'pull') {
    // Ângulo do cotovelo na contração
    if (
      hasRequiredLandmarks([
        LANDMARKS.LEFT_SHOULDER,
        LANDMARKS.LEFT_ELBOW,
        LANDMARKS.LEFT_WRIST,
      ])
    ) {
      const elbowAngle = angleBetweenPoints(
        lm[LANDMARKS.LEFT_SHOULDER],
        lm[LANDMARKS.LEFT_ELBOW],
        lm[LANDMARKS.LEFT_WRIST]
      );
      metrics.push({
        metric: 'elbow_angle_contraction',
        value: Math.round(elbowAngle),
        unit: '°',
      });
    }

    // Flexão lombar
    if (
      hasRequiredLandmarks([
        LANDMARKS.LEFT_SHOULDER,
        LANDMARKS.LEFT_HIP,
      ])
    ) {
      const lumbarFlexion = Math.max(
        0,
        90 -
          angleBetweenPoints(
            { x: 0.5, y: 0, z: 0 },
            lm[LANDMARKS.LEFT_HIP],
            lm[LANDMARKS.LEFT_SHOULDER]
          )
      );
      metrics.push({
        metric: 'lumbar_flexion_degrees',
        value: Math.round(lumbarFlexion),
        unit: '°',
      });
    }
  }

  // ===== CORE =====
  if (category === 'core') {
    // Alinhamento da coluna (desvio da linha neutra)
    if (
      hasRequiredLandmarks([
        LANDMARKS.LEFT_SHOULDER,
        LANDMARKS.LEFT_HIP,
      ])
    ) {
      const spinalDeviation = Math.abs(
        90 -
          angleBetweenPoints(
            { x: 0.5, y: 0, z: 0 },
            lm[LANDMARKS.LEFT_HIP],
            lm[LANDMARKS.LEFT_SHOULDER]
          )
      );
      metrics.push({
        metric: 'spinal_deviation_degrees',
        value: Math.round(spinalDeviation),
        unit: '°',
      });
    }
  }

  return {
    frameNumber: frame.frameNumber,
    timestamp: frame.timestamp,
    metrics,
  };
}

/**
 * Processa múltiplos frames e calcula métricas resumidas
 */
export function processFrameSequence(
  frames: Frame[],
  category: string,
  fps: number = 30
): ProcessedVideoMetrics {
  const processedFrames = frames.map((f) => processFrame(f, category));

  // Calcular ROM (Range of Motion)
  const rom: Record<string, { min: number; max: number }> = {};

  for (const frame of processedFrames) {
    for (const metric of frame.metrics) {
      if (!rom[metric.metric]) {
        rom[metric.metric] = { min: metric.value, max: metric.value };
      }
      rom[metric.metric].min = Math.min(rom[metric.metric].min, metric.value);
      rom[metric.metric].max = Math.max(rom[metric.metric].max, metric.value);
    }
  }

  // Calcular assimetrias (diferenças lado esquerdo vs direito)
  const asymmetries: Record<string, number> = {};

  for (const frame of processedFrames) {
    const leftMetrics = frame.metrics.filter((m) => m.metric.includes('_left'));
    const rightMetrics = frame.metrics.filter((m) => m.metric.includes('_right'));

    for (const left of leftMetrics) {
      const baseMetric = left.metric.replace('_left', '');
      const right = rightMetrics.find((m) => m.metric === baseMetric + '_right');

      if (right) {
        const diff = Math.abs(left.value - right.value);
        if (!asymmetries[baseMetric] || asymmetries[baseMetric] < diff) {
          asymmetries[baseMetric] = diff;
        }
      }
    }
  }

  // Encontrar valores de pico
  const peakValues: Record<string, { value: number; frameNumber: number }> = {};

  for (const frame of processedFrames) {
    for (const metric of frame.metrics) {
      if (!peakValues[metric.metric] || Math.abs(metric.value) > Math.abs(peakValues[metric.metric].value)) {
        peakValues[metric.metric] = {
          value: metric.value,
          frameNumber: frame.frameNumber,
        };
      }
    }
  }

  // Detectar fases (excêntrica vs concêntrica) baseado na derivada do hip angle
  let phases = { eccentric: undefined, concentric: undefined } as any;
  let transitionFrame = -1;

  const hipAngles = processedFrames
    .map((f) => f.metrics.find((m) => m.metric.includes('hip_angle')))
    .filter(Boolean);

  if (hipAngles.length > 2) {
    for (let i = 1; i < hipAngles.length - 1; i++) {
      const prev = hipAngles[i - 1]?.value || 0;
      const curr = hipAngles[i]?.value || 0;
      const next = hipAngles[i + 1]?.value || 0;

      const derivative = next - prev;

      // Transição de negativa (descida) para positiva (subida)
      if (derivative < 0 && (next - curr) > 0) {
        transitionFrame = i;
        break;
      }
    }

    if (transitionFrame > 0) {
      const eccentricFrames = transitionFrame + 1;
      const concentricFrames = processedFrames.length - eccentricFrames;

      const eccentricMs = (eccentricFrames / fps) * 1000;
      const concentricMs = (concentricFrames / fps) * 1000;

      phases = {
        eccentric: {
          startFrame: 1,
          endFrame: transitionFrame,
          durationMs: eccentricMs,
        },
        concentric: {
          startFrame: transitionFrame + 1,
          endFrame: processedFrames.length,
          durationMs: concentricMs,
        },
      };

      const ratio = eccentricMs / concentricMs;
      phases.tempo = {
        eccentricMs: Math.round(eccentricMs),
        concentricMs: Math.round(concentricMs),
        ratio: `${ratio.toFixed(2)}:1`,
      };
    }
  }

  return {
    totalFrames: frames.length,
    fps,
    duration: frames.length / fps,
    frames: processedFrames,
    summary: {
      rom,
      asymmetries,
      peakValues,
      phases,
    },
  };
}
