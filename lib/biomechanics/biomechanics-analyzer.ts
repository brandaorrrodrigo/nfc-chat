/**
 * Orquestrador principal da análise biomecânica
 * Integra: categoria → template → classificação → prompt → LLM
 */

import { getCategoryTemplate, getExerciseCategory, EquipmentConstraint, CONSTRAINT_LABELS } from './category-templates';
import { classifyMetrics, ClassificationResult, extractAllRAGTopics, MetricValue } from './criteria-classifier';
import { buildPrompt, buildMinimalPrompt, BuiltPrompt } from './prompt-builder';
import { ProcessedVideoMetrics, Frame, processFrameSequence } from './mediapipe-processor';
import type { RAGContext } from './prompt-builder';

export interface BiomechanicsAnalysisInput {
  exerciseName: string;
  category?: string; // Se não fornecido, usa getExerciseCategory
  frames: Frame[];
  fps?: number;
  ragContexts?: RAGContext[]; // Contextos RAG pré-processados (opcional)
  includeRAG?: boolean; // Se true, usa contextos RAG fornecidos
  equipmentConstraint?: EquipmentConstraint; // Limitação externa (barras de segurança, Smith, etc)
}

export interface BiomechanicsAnalysisOutput {
  exerciseName: string;
  category: string;
  timestamp: string;
  classification: ClassificationResult;
  mediaMetrics: ProcessedVideoMetrics;
  prompt: BuiltPrompt;
  ragTopicsUsed: string[];
  readyForLLM: boolean;
  diagnosticSummary: string;
}

export interface AnalysisConfig {
  includeRAG: boolean;
  useMinimalPrompt: boolean;
  debugMode: boolean;
}

/**
 * Realiza análise biomecânica completa
 */
export async function analyzeBiomechanics(
  input: BiomechanicsAnalysisInput,
  config: AnalysisConfig = {
    includeRAG: true,
    useMinimalPrompt: false,
    debugMode: false,
  }
): Promise<BiomechanicsAnalysisOutput> {
  try {
    // 1. Validar entrada
    if (!input.frames || input.frames.length === 0) {
      throw new Error('Nenhum frame fornecido para análise');
    }

    if (!input.exerciseName) {
      throw new Error('Nome do exercício é obrigatório');
    }

    // 2. Determinar categoria
    const category = input.category || getExerciseCategory(input.exerciseName);
    const template = getCategoryTemplate(category);

    if (config.debugMode) {
      console.log(`[Biomechanics] Exercício: ${input.exerciseName}`);
      console.log(`[Biomechanics] Categoria: ${category}`);
      console.log(`[Biomechanics] Frames: ${input.frames.length}`);
    }

    // 3. Processar frames com MediaPipe
    const mediaMetrics = processFrameSequence(input.frames, category, input.fps || 30);

    if (config.debugMode) {
      console.log(`[Biomechanics] Métricas extraídas: ${mediaMetrics.frames.length} frames`);
    }

    // 4. Agregar métricas de todos os frames para classificação
    // (usar média ou pico, dependendo do critério)
    const aggregatedMetrics = aggregateMetricsAcrossFrames(mediaMetrics);

    if (config.debugMode) {
      console.log(`[Biomechanics] Métricas agregadas: ${aggregatedMetrics.length}`);
    }

    // 5. Classificar contra template
    const classification = classifyMetrics(aggregatedMetrics, template, input.exerciseName, input.equipmentConstraint);

    if (config.debugMode) {
      console.log(`[Biomechanics] Classificação: ${classification.overallScore}/10`);
      console.log(`[Biomechanics] Danger: ${classification.summary.danger} | Warning: ${classification.summary.warning}`);
    }

    // 6. Extrair tópicos RAG necessários
    const ragTopics = extractAllRAGTopics(classification);
    const finalRAGContexts = config.includeRAG
      ? input.ragContexts?.filter((ctx) => ragTopics.includes(ctx.topic)) || []
      : [];

    if (config.debugMode) {
      console.log(`[Biomechanics] Tópicos RAG: ${ragTopics.length}`);
    }

    // 7. Construir prompt
    const prompt = config.useMinimalPrompt
      ? buildMinimalPrompt(classification, template, input.exerciseName)
      : buildPrompt({
          result: classification,
          template,
          exerciseName: input.exerciseName,
          ragContext: finalRAGContexts,
          equipmentConstraint: input.equipmentConstraint,
          videoMetadata: {
            duration: mediaMetrics.duration,
            frameCount: mediaMetrics.totalFrames,
            fps: mediaMetrics.fps,
          },
        });

    // 8. Gerar resumo diagnóstico
    const diagnosticSummary = generateDiagnosticSummary(
      input.exerciseName,
      classification,
      mediaMetrics,
      ragTopics.length
    );

    return {
      exerciseName: input.exerciseName,
      category,
      timestamp: new Date().toISOString(),
      classification,
      mediaMetrics,
      prompt,
      ragTopicsUsed: ragTopics,
      readyForLLM: true,
      diagnosticSummary,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    throw new Error(`Análise biomecânica falhou: ${message}`);
  }
}

/**
 * Agrega métricas de múltiplos frames para uma análise de resumo
 * Usa diferentes estratégias para diferentes tipos de métrica:
 * - Ângulos: média
 * - Deslocamentos: máximo
 * - ROM: min/max dos frames
 */
function aggregateMetricsAcrossFrames(mediaMetrics: ProcessedVideoMetrics): MetricValue[] {
  const aggregated: MetricValue[] = [];
  const metricMap = new Map<string, number[]>();

  // Coletar todos os valores por métrica
  for (const frame of mediaMetrics.frames) {
    for (const metric of frame.metrics) {
      if (!metricMap.has(metric.metric)) {
        metricMap.set(metric.metric, []);
      }
      metricMap.get(metric.metric)!.push(metric.value);
    }
  }

  // Agregar baseado no tipo de métrica
  for (const [metricName, values] of metricMap.entries()) {
    if (values.length === 0) continue;

    let aggregatedValue: number;

    // Deslocamentos (cm): usar máximo
    if (metricName.includes('_cm') || metricName.includes('displacement')) {
      aggregatedValue = Math.max(...values);
    }
    // ROM: já está em summary
    else if (metricName.includes('rom')) {
      continue;
    }
    // Ângulos de profundidade (hip): usar MÍNIMO (fundo do agachamento)
    else if (metricName.includes('hip_angle')) {
      aggregatedValue = Math.min(...values);
    }
    // Outros ângulos: usar média
    else {
      aggregatedValue = values.reduce((a, b) => a + b, 0) / values.length;
    }

    // Encontrar unidade a partir do primeiro valor
    const sampleFrame = mediaMetrics.frames.find((f) =>
      f.metrics.some((m) => m.metric === metricName)
    );
    const unit = sampleFrame?.metrics.find((m) => m.metric === metricName)?.unit;

    aggregated.push({
      metric: metricName,
      value: Math.round(aggregatedValue * 10) / 10,
      unit,
    });
  }

  // Adicionar dados de ROM como métricas derivadas
  for (const [metricName, range] of Object.entries(mediaMetrics.summary.rom)) {
    // hip_angle → hip_angle_at_bottom (usar MIN = fundo do agachamento)
    if (metricName.includes('hip_angle') && !aggregated.some(a => a.metric === 'hip_angle_at_bottom')) {
      aggregated.push({
        metric: 'hip_angle_at_bottom',
        value: range.min,
        unit: '°',
      });
    }
    // lumbar_flexion_proxy → lumbar_flexion_change_degrees (MAX - MIN = mudança total)
    if (metricName === 'lumbar_flexion_proxy') {
      aggregated.push({
        metric: 'lumbar_flexion_change_degrees',
        value: Math.round((range.max - range.min) * 10) / 10,
        unit: '°',
      });
    }
  }

  // Mapear knee_valgus → knee_medial_displacement_cm (template espera este nome)
  const valgusLeft = aggregated.find(a => a.metric === 'knee_valgus_left_cm');
  const valgusRight = aggregated.find(a => a.metric === 'knee_valgus_right_cm');
  if (valgusLeft || valgusRight) {
    const maxValgus = Math.max(valgusLeft?.value || 0, valgusRight?.value || 0);
    aggregated.push({
      metric: 'knee_medial_displacement_cm',
      value: maxValgus,
      unit: 'cm',
    });
  }

  // Adicionar assimetrias
  for (const [metricName, diff] of Object.entries(mediaMetrics.summary.asymmetries)) {
    aggregated.push({
      metric: `${metricName}_difference`,
      value: Math.round(diff * 10) / 10,
      unit: '°',
    });
  }

  // Mapear hip_angle_difference → bilateral_angle_difference (template espera este nome)
  const hipDiff = aggregated.find(a => a.metric === 'hip_angle_difference');
  if (hipDiff) {
    aggregated.push({
      metric: 'bilateral_angle_difference',
      value: hipDiff.value,
      unit: '°',
    });
  }

  return aggregated;
}

/**
 * Gera um resumo diagnóstico legível para visualização rápida
 */
function generateDiagnosticSummary(
  exerciseName: string,
  classification: ClassificationResult,
  mediaMetrics: ProcessedVideoMetrics,
  ragTopicsCount: number
): string {
  const lines: string[] = [];

  lines.push('╔════════════════════════════════════════════════════════════╗');
  lines.push('║            RESUMO DIAGNÓSTICO BIOMECÂNICO                  ║');
  lines.push('╚════════════════════════════════════════════════════════════╝');
  lines.push('');

  // Básico
  lines.push(`📋 Exercício: ${exerciseName}`);
  lines.push(`📊 Score Geral: ${classification.overallScore}/10`);
  lines.push(`⏱️  Duração: ${mediaMetrics.duration?.toFixed(1) || '?'}s (${mediaMetrics.totalFrames} frames)`);
  if (classification.constraintApplied && classification.constraintApplied !== 'none') {
    lines.push(`🔧 Contexto: ${classification.constraintLabel || classification.constraintApplied}`);
  }
  lines.push('');

  // Resumo de classificações
  lines.push('📈 Distribuição de Critérios:');
  lines.push(`   🔴 Crítico (Danger): ${classification.summary.danger}`);
  lines.push(`   🟡 Alerta (Warning):  ${classification.summary.warning}`);
  lines.push(`   🟢 OK (Accept/Good):  ${classification.summary.acceptable + classification.summary.excellent + classification.summary.good}`);
  lines.push('');

  // Problemas críticos
  const dangerItems = classification.classifications.filter((c) => c.classification === 'danger');
  if (dangerItems.length > 0) {
    lines.push('🔴 PROBLEMAS CRÍTICOS:');
    dangerItems.forEach((item) => {
      lines.push(`   • ${item.label || item.criterion}: ${item.value}${item.unit || ''}`);
      if (item.isSafetyCritical) {
        lines.push(`     ⚠️ RISCO DE LESÃO`);
      }
    });
    lines.push('');
  }

  // Alertas
  const warningItems = classification.classifications.filter((c) => c.classification === 'warning');
  if (warningItems.length > 0) {
    lines.push('🟡 ÁREAS DE ALERTA:');
    warningItems.slice(0, 3).forEach((item) => {
      lines.push(`   • ${item.label || item.criterion}: ${item.value}${item.unit || ''}`);
    });
    if (warningItems.length > 3) {
      lines.push(`   ... e ${warningItems.length - 3} mais`);
    }
    lines.push('');
  }

  // Fases
  if (mediaMetrics.summary.phases.eccentric) {
    lines.push('⚡ Fases Detectadas:');
    lines.push(
      `   Excêntrica: ${mediaMetrics.summary.phases.eccentric.durationMs}ms (frames ${mediaMetrics.summary.phases.eccentric.startFrame}-${mediaMetrics.summary.phases.eccentric.endFrame})`
    );
    if (mediaMetrics.summary.phases.concentric) {
      lines.push(
        `   Concêntrica: ${mediaMetrics.summary.phases.concentric.durationMs}ms (frames ${mediaMetrics.summary.phases.concentric.startFrame}-${mediaMetrics.summary.phases.concentric.endFrame})`
      );
    }
    if (mediaMetrics.summary.tempo) {
      lines.push(`   Ratio: ${mediaMetrics.summary.tempo.ratio}`);
    }
    lines.push('');
  }

  // RAG
  lines.push(`📚 Contextos RAG: ${ragTopicsCount} tópicos`);
  lines.push('');

  // Status
  lines.push('✅ Pronto para análise do LLM');

  return lines.join('\n');
}

/**
 * Versão simplificada: apenas retorna a classificação sem LLM
 * Útil para testes rápidos
 */
export async function classifyOnly(
  input: BiomechanicsAnalysisInput
): Promise<ClassificationResult> {
  const category = input.category || getExerciseCategory(input.exerciseName);
  const template = getCategoryTemplate(category);
  const mediaMetrics = processFrameSequence(input.frames, category, input.fps || 30);
  const aggregatedMetrics = aggregateMetricsAcrossFrames(mediaMetrics);
  const classification = classifyMetrics(aggregatedMetrics, template, input.exerciseName, input.equipmentConstraint);

  return classification;
}

/**
 * Gera dados fictícios para teste (mock de frames MediaPipe)
 * Simula cinemática realista do agachamento:
 * - Quadril desce e vai para trás
 * - Joelho avança para frente
 * - Tronco inclina
 * - Tornozelo dorsiflete
 * - Inclui heel landmarks
 */
export function generateMockFrames(
  count: number,
  exerciseType: 'squat' | 'hinge' | 'press' = 'squat'
): Frame[] {
  const frames: Frame[] = [];

  for (let i = 0; i < count; i++) {
    const progress = i / count; // 0 a 1
    // Curva sinusoidal: 0 no início → 1 no fundo → 0 no fim
    const depth = Math.sin(progress * Math.PI);

    let landmarks: Record<string, any> = {
      left_shoulder: { x: 0.3, y: 0.2, z: 0, visibility: 0.9 },
      right_shoulder: { x: 0.7, y: 0.2, z: 0, visibility: 0.9 },
      left_hip: { x: 0.3, y: 0.5, z: 0, visibility: 0.9 },
      right_hip: { x: 0.7, y: 0.5, z: 0, visibility: 0.9 },
      left_knee: { x: 0.3, y: 0.7, z: 0, visibility: 0.9 },
      right_knee: { x: 0.7, y: 0.7, z: 0, visibility: 0.9 },
      left_ankle: { x: 0.3, y: 0.9, z: 0, visibility: 0.9 },
      right_ankle: { x: 0.7, y: 0.9, z: 0, visibility: 0.9 },
      left_heel: { x: 0.28, y: 0.92, z: 0, visibility: 0.9 },
      right_heel: { x: 0.68, y: 0.92, z: 0, visibility: 0.9 },
      left_foot_index: { x: 0.35, y: 0.92, z: 0, visibility: 0.9 },
      right_foot_index: { x: 0.75, y: 0.92, z: 0, visibility: 0.9 },
      left_elbow: { x: 0.25, y: 0.4, z: 0, visibility: 0.9 },
      right_elbow: { x: 0.75, y: 0.4, z: 0, visibility: 0.9 },
      left_wrist: { x: 0.2, y: 0.3, z: 0, visibility: 0.9 },
      right_wrist: { x: 0.8, y: 0.3, z: 0, visibility: 0.9 },
    };

    if (exerciseType === 'squat') {
      // Quadril desce (y aumenta) e recua levemente (x diminui)
      const hipY = 0.5 + depth * 0.25;
      const hipX_L = 0.3 - depth * 0.03;
      const hipX_R = 0.7 - depth * 0.03;
      landmarks.left_hip = { x: hipX_L, y: hipY, z: 0, visibility: 0.9 };
      landmarks.right_hip = { x: hipX_R, y: hipY, z: 0, visibility: 0.9 };

      // Joelho avança para frente (x aumenta) e desce proporcionalmente
      const kneeY = 0.7 + depth * 0.1;
      const kneeX_L = 0.3 + depth * 0.08;
      const kneeX_R = 0.7 + depth * 0.08;
      landmarks.left_knee = { x: kneeX_L, y: kneeY, z: 0, visibility: 0.9 };
      landmarks.right_knee = { x: kneeX_R, y: kneeY, z: 0, visibility: 0.9 };

      // Ombro inclina para frente (tronco inclina)
      const shoulderX_L = 0.3 + depth * 0.05;
      const shoulderX_R = 0.7 + depth * 0.05;
      const shoulderY = 0.2 + depth * 0.12;
      landmarks.left_shoulder = { x: shoulderX_L, y: shoulderY, z: 0, visibility: 0.9 };
      landmarks.right_shoulder = { x: shoulderX_R, y: shoulderY, z: 0, visibility: 0.9 };
    }

    frames.push({
      frameNumber: i + 1,
      timestamp: (i / 30) * 1000, // 30fps
      landmarks,
    });
  }

  return frames;
}
