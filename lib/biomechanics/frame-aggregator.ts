/**
 * Funções de agregação de frames para pipeline biomecânico
 * Extraídas de app/api/biomechanics/analyze/route.ts para reutilização
 */

import type { FrameAnalysis } from './vision-analyzer';
import type { MetricValue } from './criteria-classifier';
import type { ExerciseTemplate } from './exercise-templates-v2';
import type { MotorMetricInput, StabilizerMetricInput } from './classifier-v2';

export interface AggregatedFrameData {
  avgAngles: FrameAnalysis['angulos_aproximados'];
  minAngles: FrameAnalysis['angulos_aproximados'];
  maxAngles: FrameAnalysis['angulos_aproximados'];
  avgScore: number;
  hasValgus: boolean;
  trunkVariation: number;
  escapulasRetraidas: boolean;
}

/**
 * Agrega análises de múltiplos frames em métricas resumidas
 */
export function aggregateFrameAnalyses(frames: FrameAnalysis[]): AggregatedFrameData {
  const validFrames = frames.filter(f => f.score > 0);
  if (validFrames.length === 0) {
    return {
      avgAngles: frames[0]?.angulos_aproximados || {} as any,
      minAngles: frames[0]?.angulos_aproximados || {} as any,
      maxAngles: frames[0]?.angulos_aproximados || {} as any,
      avgScore: 5,
      hasValgus: false,
      trunkVariation: 0,
      escapulasRetraidas: false,
    };
  }

  const keys = [
    'joelho_esq_graus', 'joelho_dir_graus', 'flexao_quadril_graus',
    'inclinacao_tronco_graus', 'cotovelo_esq_graus', 'cotovelo_dir_graus',
    'ombro_flexao_graus', 'lombar_flexao_graus',
  ] as const;

  const avg: any = {};
  const min: any = {};
  const max: any = {};

  for (const key of keys) {
    const vals = validFrames.map(f => f.angulos_aproximados[key]).filter(v => v >= 0);
    if (vals.length === 0) {
      avg[key] = -1;
      min[key] = -1;
      max[key] = -1;
    } else {
      avg[key] = vals.reduce((s, v) => s + v, 0) / vals.length;
      min[key] = Math.min(...vals);
      max[key] = Math.max(...vals);
    }
  }

  const trunkVals = validFrames.map(f => f.angulos_aproximados.inclinacao_tronco_graus).filter(v => v >= 0);
  const trunkVariation = trunkVals.length > 1 ? Math.max(...trunkVals) - Math.min(...trunkVals) : 0;

  return {
    avgAngles: avg,
    minAngles: min,
    maxAngles: max,
    avgScore: validFrames.reduce((s, f) => s + f.score, 0) / validFrames.length,
    hasValgus: validFrames.some(f => f.alinhamentos.joelho_esq_valgo || f.alinhamentos.joelho_dir_valgo),
    trunkVariation,
    escapulasRetraidas: validFrames.some(f => f.alinhamentos.escapulas_retraidas),
  };
}

/**
 * Mapeia ângulos do Vision para MetricValue[] baseado na categoria do exercício
 */
export function visionToMetrics(
  agg: AggregatedFrameData,
  category: string
): MetricValue[] {
  const metrics: MetricValue[] = [];

  switch (category) {
    case 'squat': {
      if (agg.minAngles.flexao_quadril_graus >= 0)
        metrics.push({ metric: 'hip_angle_at_bottom', value: agg.minAngles.flexao_quadril_graus, unit: '°' });
      metrics.push({ metric: 'knee_medial_displacement_cm', value: agg.hasValgus ? 4 : 1, unit: 'cm' });
      if (agg.avgAngles.inclinacao_tronco_graus >= 0)
        metrics.push({ metric: 'trunk_inclination_degrees', value: agg.avgAngles.inclinacao_tronco_graus, unit: '°' });
      metrics.push({ metric: 'ankle_dorsiflexion_degrees', value: 28, unit: '°' });
      if (agg.maxAngles.lombar_flexao_graus >= 0 && agg.minAngles.lombar_flexao_graus >= 0)
        metrics.push({ metric: 'lumbar_flexion_change_degrees', value: agg.maxAngles.lombar_flexao_graus - agg.minAngles.lombar_flexao_graus, unit: '°' });
      if (agg.avgAngles.joelho_esq_graus >= 0 && agg.avgAngles.joelho_dir_graus >= 0)
        metrics.push({ metric: 'bilateral_angle_difference', value: Math.abs(agg.avgAngles.joelho_esq_graus - agg.avgAngles.joelho_dir_graus), unit: '°' });
      break;
    }

    case 'hinge': {
      if (agg.avgAngles.lombar_flexao_graus >= 0)
        metrics.push({ metric: 'lumbar_flexion_degrees', value: agg.avgAngles.lombar_flexao_graus, unit: '°' });
      if (agg.minAngles.flexao_quadril_graus >= 0 && agg.minAngles.joelho_esq_graus >= 0) {
        const hipChange = 180 - agg.minAngles.flexao_quadril_graus;
        const kneeChange = 180 - agg.minAngles.joelho_esq_graus;
        const ratio = kneeChange > 0 ? hipChange / kneeChange : 2;
        metrics.push({ metric: 'hip_angle_vs_knee_angle_ratio', value: ratio, unit: ':1' });
      }
      metrics.push({ metric: 'horizontal_bar_deviation_cm', value: agg.trunkVariation > 10 ? 5 : 2, unit: 'cm' });
      if (agg.avgAngles.inclinacao_tronco_graus >= 0)
        metrics.push({ metric: 'thoracic_flexion_degrees', value: agg.avgAngles.inclinacao_tronco_graus, unit: '°' });
      if (agg.maxAngles.flexao_quadril_graus >= 0)
        metrics.push({ metric: 'hip_extension_at_top', value: agg.maxAngles.flexao_quadril_graus, unit: '°' });
      break;
    }

    case 'pull': {
      metrics.push({ metric: 'scapular_distance_change_cm', value: agg.escapulasRetraidas ? 3 : 1, unit: 'cm' });
      if (agg.minAngles.cotovelo_esq_graus >= 0)
        metrics.push({ metric: 'elbow_angle_at_contraction', value: agg.minAngles.cotovelo_esq_graus, unit: '°' });
      metrics.push({ metric: 'trunk_angle_variation_degrees', value: agg.trunkVariation, unit: '°' });
      if (agg.avgAngles.lombar_flexao_graus >= 0)
        metrics.push({ metric: 'lumbar_flexion_degrees', value: agg.avgAngles.lombar_flexao_graus, unit: '°' });
      else if (agg.avgAngles.inclinacao_tronco_graus >= 0)
        metrics.push({ metric: 'lumbar_flexion_degrees', value: agg.avgAngles.inclinacao_tronco_graus, unit: '°' });
      break;
    }

    case 'horizontal_press': {
      if (agg.minAngles.cotovelo_esq_graus >= 0)
        metrics.push({ metric: 'elbow_angle_at_chest', value: agg.minAngles.cotovelo_esq_graus, unit: '°' });
      metrics.push({ metric: 'elbow_abduction_angle', value: 55, unit: '°' });
      metrics.push({ metric: 'wrist_extension_degrees', value: 5, unit: '°' });
      break;
    }

    case 'vertical_press': {
      if (agg.maxAngles.ombro_flexao_graus >= 0)
        metrics.push({ metric: 'shoulder_flexion_at_top', value: agg.maxAngles.ombro_flexao_graus, unit: '°' });
      if (agg.maxAngles.lombar_flexao_graus >= 0 && agg.minAngles.lombar_flexao_graus >= 0)
        metrics.push({ metric: 'lumbar_extension_increase_degrees', value: agg.maxAngles.lombar_flexao_graus - agg.minAngles.lombar_flexao_graus, unit: '°' });
      metrics.push({ metric: 'rib_cage_angle_change', value: agg.trunkVariation, unit: '°' });
      break;
    }

    default: {
      if (agg.avgAngles.flexao_quadril_graus >= 0)
        metrics.push({ metric: 'hip_angle_at_bottom', value: agg.minAngles.flexao_quadril_graus, unit: '°' });
      if (agg.avgAngles.inclinacao_tronco_graus >= 0)
        metrics.push({ metric: 'trunk_inclination_degrees', value: agg.avgAngles.inclinacao_tronco_graus, unit: '°' });
      break;
    }
  }

  return metrics;
}

// ============================
// V2: Mapeamento para Motor/Estabilizador
// ============================

/**
 * Mapeia ângulos do Vision para métricas V2 (motor + stabilizer)
 * Usa o template V2 para saber quais articulações mapear
 */
export function visionToMetricsV2(
  agg: AggregatedFrameData,
  frames: FrameAnalysis[],
  template: ExerciseTemplate,
): { motorMetrics: MotorMetricInput[]; stabilizerMetrics: StabilizerMetricInput[] } {
  const motorMetrics: MotorMetricInput[] = [];
  const stabilizerMetrics: StabilizerMetricInput[] = [];

  // --- Mapear MOTORAS ---
  for (const mj of template.motorJoints) {
    const input = mapMotorJoint(mj.joint, mj.criteria.rom.metric, agg, frames);
    if (input) motorMetrics.push(input);
  }

  // --- Mapear ESTABILIZADORAS ---
  for (const sj of template.stabilizerJoints) {
    const input = mapStabilizerJoint(sj.joint, sj.criteria.maxVariation.metric, agg, frames);
    if (input) stabilizerMetrics.push(input);
  }

  return { motorMetrics, stabilizerMetrics };
}

/**
 * Mapeia uma articulação motora para MotorMetricInput
 * Motor = precisa do valor de ROM (amplitude do movimento)
 */
function mapMotorJoint(
  joint: string,
  metric: string,
  agg: AggregatedFrameData,
  frames: FrameAnalysis[],
): MotorMetricInput | null {
  switch (joint) {
    case 'knee': {
      // ROM = diferença entre max e min flexão
      const left = frames.map(f => f.angulos_aproximados.joelho_esq_graus).filter(v => v >= 0);
      const right = frames.map(f => f.angulos_aproximados.joelho_dir_graus).filter(v => v >= 0);
      if (left.length === 0 && right.length === 0) return null;

      // Para squat: valor no fundo (min angle = máxima flexão)
      const leftMin = left.length > 0 ? Math.min(...left) : -1;
      const rightMin = right.length > 0 ? Math.min(...right) : -1;
      const romValue = metric.includes('flexion_at_bottom')
        ? Math.min(leftMin >= 0 ? leftMin : 999, rightMin >= 0 ? rightMin : 999)
        : metric.includes('extension_range')
          ? (left.length > 0 ? Math.max(...left) - Math.min(...left) : 0)
          : (leftMin >= 0 ? leftMin : rightMin);

      return {
        joint: 'knee',
        romValue: romValue >= 0 ? romValue : 0,
        romUnit: '°',
        leftValue: leftMin >= 0 ? leftMin : undefined,
        rightValue: rightMin >= 0 ? rightMin : undefined,
      };
    }

    case 'hip': {
      const vals = frames.map(f => f.angulos_aproximados.flexao_quadril_graus).filter(v => v >= 0);
      if (vals.length === 0) return null;

      let romValue: number;
      if (metric.includes('flexion_at_bottom')) {
        romValue = Math.min(...vals); // Mínimo ângulo = máxima flexão
      } else if (metric.includes('extension_range')) {
        romValue = Math.max(...vals) - Math.min(...vals); // Amplitude total
      } else {
        romValue = agg.avgAngles.flexao_quadril_graus;
      }

      return { joint: 'hip', romValue, romUnit: '°' };
    }

    case 'ankle': {
      // Dorsiflexão estimada — Vision não extrai diretamente
      // Usar heurística: se quadril vai profundo, tornozelo provavelmente tem boa dorsiflexão
      const hipMin = agg.minAngles.flexao_quadril_graus;
      const estimated = hipMin >= 0 && hipMin < 90 ? 35 : hipMin < 100 ? 28 : 20;
      return { joint: 'ankle', romValue: estimated, romUnit: '°' };
    }

    case 'shoulder': {
      const vals = frames.map(f => f.angulos_aproximados.ombro_flexao_graus).filter(v => v >= 0);
      if (vals.length === 0) return null;

      let romValue: number;
      if (metric.includes('extension_rom') || metric.includes('abduction')) {
        romValue = Math.max(...vals) - Math.min(...vals);
      } else {
        romValue = Math.max(...vals);
      }

      // Peak contraction: escápulas retraídas → estimativa de retração
      const peakContractionValue = agg.escapulasRetraidas ? 3.5 : 1.5;

      return {
        joint: 'shoulder',
        romValue,
        romUnit: '°',
        peakContractionValue,
        peakContractionUnit: 'cm',
      };
    }

    case 'elbow': {
      const left = frames.map(f => f.angulos_aproximados.cotovelo_esq_graus).filter(v => v >= 0);
      const right = frames.map(f => f.angulos_aproximados.cotovelo_dir_graus).filter(v => v >= 0);
      if (left.length === 0 && right.length === 0) return null;

      // Para pull: ângulo no pico de contração (mínimo = máxima flexão)
      const leftMin = left.length > 0 ? Math.min(...left) : -1;
      const rightMin = right.length > 0 ? Math.min(...right) : -1;
      const romValue = Math.min(leftMin >= 0 ? leftMin : 999, rightMin >= 0 ? rightMin : 999);

      return {
        joint: 'elbow',
        romValue: romValue < 999 ? romValue : 0,
        romUnit: '°',
        leftValue: leftMin >= 0 ? leftMin : undefined,
        rightValue: rightMin >= 0 ? rightMin : undefined,
      };
    }

    default:
      return null;
  }
}

/**
 * Mapeia uma articulação estabilizadora para StabilizerMetricInput
 * Stabilizer = variação ao longo dos frames (max - min)
 */
function mapStabilizerJoint(
  joint: string,
  metric: string,
  agg: AggregatedFrameData,
  frames: FrameAnalysis[],
): StabilizerMetricInput | null {
  switch (joint) {
    case 'lumbar': {
      const vals = frames.map(f => f.angulos_aproximados.lombar_flexao_graus).filter(v => v >= 0);
      if (vals.length < 2) return null;
      return { joint: 'lumbar', variationValue: Math.max(...vals) - Math.min(...vals), unit: '°' };
    }

    case 'trunk': {
      return { joint: 'trunk', variationValue: agg.trunkVariation, unit: '°' };
    }

    case 'thoracic': {
      // Usar inclinação do tronco como proxy para torácica
      const vals = frames.map(f => f.angulos_aproximados.inclinacao_tronco_graus).filter(v => v >= 0);
      if (vals.length < 2) return null;
      return { joint: 'thoracic', variationValue: Math.max(...vals) - Math.min(...vals), unit: '°' };
    }

    case 'knee_alignment': {
      // Valgo = deslocamento medial
      const hasValgus = frames.some(f => f.alinhamentos.joelho_esq_valgo || f.alinhamentos.joelho_dir_valgo);
      const valgusCount = frames.filter(f => f.alinhamentos.joelho_esq_valgo || f.alinhamentos.joelho_dir_valgo).length;
      // Estimar cm baseado em quantos frames têm valgo
      const ratio = valgusCount / frames.length;
      const estimatedCm = ratio > 0.5 ? 6 : ratio > 0.2 ? 3 : hasValgus ? 1.5 : 0;
      return { joint: 'knee_alignment', variationValue: estimatedCm, unit: 'cm' };
    }

    case 'shoulder_position': {
      const vals = frames.map(f => f.angulos_aproximados.ombro_flexao_graus).filter(v => v >= 0);
      if (vals.length < 2) return null;
      // Variação da posição do ombro = proxy para desvio da barra
      const variation = Math.max(...vals) - Math.min(...vals);
      return { joint: 'shoulder_position', variationValue: variation * 0.3, unit: 'cm' }; // Converter graus para cm estimado
    }

    case 'wrist': {
      // Vision não extrai ângulo de punho diretamente
      // Estimar baseado na estabilidade geral
      const trunkStable = agg.trunkVariation < 5;
      return { joint: 'wrist', variationValue: trunkStable ? 3 : 8, unit: '°' };
    }

    case 'elbow': {
      // Para isolados (elevação lateral): variação do cotovelo deve ser mínima
      const left = frames.map(f => f.angulos_aproximados.cotovelo_esq_graus).filter(v => v >= 0);
      const right = frames.map(f => f.angulos_aproximados.cotovelo_dir_graus).filter(v => v >= 0);
      const leftVar = left.length >= 2 ? Math.max(...left) - Math.min(...left) : 0;
      const rightVar = right.length >= 2 ? Math.max(...right) - Math.min(...right) : 0;
      return { joint: 'elbow', variationValue: Math.max(leftVar, rightVar), unit: '°' };
    }

    case 'shoulder_elevation': {
      // Vision não extrai elevação do ombro diretamente
      // Estimar: se tronco oscila, provavelmente encolheu ombros
      return { joint: 'shoulder_elevation', variationValue: agg.trunkVariation > 5 ? 3 : 0.5, unit: 'cm' };
    }

    default:
      return null;
  }
}
