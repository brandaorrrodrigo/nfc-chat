/**
 * API Route: Análise de Ângulos Pré-Computados
 * POST /api/biomechanics/analyze-angles
 *
 * Aceita dados numéricos de ângulos (já extraídos por MediaPipe externamente)
 * e executa: classificação → prompt builder → RAG → Ollama → relatório
 *
 * Uso: quando o cliente já tem os ângulos do MediaPipe e quer apenas
 * a análise biomecânica sem precisar enviar vídeo.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getExerciseCategory, getCategoryTemplate } from '@/lib/biomechanics/category-templates';
import { classifyMetrics, MetricValue, extractAllRAGTopics } from '@/lib/biomechanics/criteria-classifier';
import { buildPrompt, buildMinimalPrompt } from '@/lib/biomechanics/prompt-builder';
import { queryRAG } from '@/lib/biomechanics/biomechanics-rag';
import { sendPromptToOllama, checkLLMAvailability, LLMAnalysisReport } from '@/lib/biomechanics/llm-bridge';

// ============================
// Tipos de entrada
// ============================

interface AngleInput {
  joint: string;    // ex: "joelho_d", "quadril", "tronco", "valgo_d", "knee_left", "hip"
  value: number;    // ex: 82 (graus) ou 6 (cm para valgus)
  unit?: string;    // default "°", usar "cm" para deslocamentos
  phase?: string;   // ex: "eccentric", "concentric", "bottom"
}

interface AnalyzeAnglesRequest {
  exercise: string;           // ex: "agachamento com barra"
  angles: AngleInput[];       // lista de medições
  includeRAG?: boolean;       // default true
  sendToLLM?: boolean;        // default true
}

// ============================
// Mapeamento joint → metric
// ============================

/**
 * Mapeia nomes de articulações (PT e EN) para nomes de métricas
 * usados nos CategoryTemplates.
 */
const JOINT_TO_METRIC: Record<string, Record<string, { metric: string; defaultUnit: string }>> = {
  squat: {
    quadril: { metric: 'hip_angle_at_bottom', defaultUnit: '°' },
    quadril_d: { metric: 'hip_angle_at_bottom', defaultUnit: '°' },
    quadril_e: { metric: 'hip_angle_at_bottom', defaultUnit: '°' },
    hip: { metric: 'hip_angle_at_bottom', defaultUnit: '°' },
    hip_left: { metric: 'hip_angle_at_bottom', defaultUnit: '°' },
    hip_right: { metric: 'hip_angle_at_bottom', defaultUnit: '°' },
    tronco: { metric: 'trunk_inclination_degrees', defaultUnit: '°' },
    trunk: { metric: 'trunk_inclination_degrees', defaultUnit: '°' },
    inclinacao_tronco: { metric: 'trunk_inclination_degrees', defaultUnit: '°' },
    tornozelo: { metric: 'ankle_dorsiflexion_degrees', defaultUnit: '°' },
    tornozelo_d: { metric: 'ankle_dorsiflexion_degrees', defaultUnit: '°' },
    tornozelo_e: { metric: 'ankle_dorsiflexion_degrees', defaultUnit: '°' },
    ankle: { metric: 'ankle_dorsiflexion_degrees', defaultUnit: '°' },
    ankle_left: { metric: 'ankle_dorsiflexion_degrees', defaultUnit: '°' },
    ankle_right: { metric: 'ankle_dorsiflexion_degrees', defaultUnit: '°' },
    valgo: { metric: 'knee_medial_displacement_cm', defaultUnit: 'cm' },
    valgo_d: { metric: 'knee_medial_displacement_cm', defaultUnit: 'cm' },
    valgo_e: { metric: 'knee_medial_displacement_cm', defaultUnit: 'cm' },
    valgus: { metric: 'knee_medial_displacement_cm', defaultUnit: 'cm' },
    knee_valgus: { metric: 'knee_medial_displacement_cm', defaultUnit: 'cm' },
    desvio_medial: { metric: 'knee_medial_displacement_cm', defaultUnit: 'cm' },
    lombar: { metric: 'lumbar_flexion_change_degrees', defaultUnit: '°' },
    lumbar: { metric: 'lumbar_flexion_change_degrees', defaultUnit: '°' },
    butt_wink: { metric: 'lumbar_flexion_change_degrees', defaultUnit: '°' },
    assimetria: { metric: 'bilateral_angle_difference', defaultUnit: '°' },
    asymmetry: { metric: 'bilateral_angle_difference', defaultUnit: '°' },
  },
  hinge: {
    lombar: { metric: 'lumbar_flexion_degrees', defaultUnit: '°' },
    lumbar: { metric: 'lumbar_flexion_degrees', defaultUnit: '°' },
    tronco: { metric: 'lumbar_flexion_degrees', defaultUnit: '°' },
    trunk: { metric: 'lumbar_flexion_degrees', defaultUnit: '°' },
    quadril: { metric: 'hip_extension_at_top', defaultUnit: '°' },
    hip: { metric: 'hip_extension_at_top', defaultUnit: '°' },
    toracica: { metric: 'thoracic_flexion_degrees', defaultUnit: '°' },
    thoracic: { metric: 'thoracic_flexion_degrees', defaultUnit: '°' },
    back_angle: { metric: 'thoracic_flexion_degrees', defaultUnit: '°' },
    barra: { metric: 'horizontal_bar_deviation_cm', defaultUnit: 'cm' },
    bar_path: { metric: 'horizontal_bar_deviation_cm', defaultUnit: 'cm' },
  },
  horizontal_press: {
    cotovelo: { metric: 'elbow_angle_at_chest', defaultUnit: '°' },
    elbow: { metric: 'elbow_angle_at_chest', defaultUnit: '°' },
    elbow_left: { metric: 'elbow_angle_at_chest', defaultUnit: '°' },
    elbow_right: { metric: 'elbow_angle_at_chest', defaultUnit: '°' },
    abdução_cotovelo: { metric: 'elbow_abduction_angle', defaultUnit: '°' },
    elbow_flare: { metric: 'elbow_abduction_angle', defaultUnit: '°' },
    punho: { metric: 'wrist_extension_degrees', defaultUnit: '°' },
    wrist: { metric: 'wrist_extension_degrees', defaultUnit: '°' },
  },
  vertical_press: {
    ombro: { metric: 'shoulder_flexion_at_top', defaultUnit: '°' },
    shoulder: { metric: 'shoulder_flexion_at_top', defaultUnit: '°' },
    lombar: { metric: 'lumbar_extension_increase_degrees', defaultUnit: '°' },
    lumbar: { metric: 'lumbar_extension_increase_degrees', defaultUnit: '°' },
    costelas: { metric: 'rib_cage_angle_change', defaultUnit: '°' },
    rib_flare: { metric: 'rib_cage_angle_change', defaultUnit: '°' },
  },
  pull: {
    cotovelo: { metric: 'elbow_angle_at_contraction', defaultUnit: '°' },
    elbow: { metric: 'elbow_angle_at_contraction', defaultUnit: '°' },
    tronco: { metric: 'trunk_angle_variation_degrees', defaultUnit: '°' },
    trunk: { metric: 'trunk_angle_variation_degrees', defaultUnit: '°' },
    lombar: { metric: 'lumbar_flexion_degrees', defaultUnit: '°' },
    lumbar: { metric: 'lumbar_flexion_degrees', defaultUnit: '°' },
  },
  unilateral: {
    valgo: { metric: 'knee_medial_displacement_cm', defaultUnit: 'cm' },
    valgus: { metric: 'knee_medial_displacement_cm', defaultUnit: 'cm' },
    pelve: { metric: 'contralateral_pelvic_drop_degrees', defaultUnit: '°' },
    pelvic_drop: { metric: 'contralateral_pelvic_drop_degrees', defaultUnit: '°' },
    tronco_lateral: { metric: 'trunk_lateral_deviation_degrees', defaultUnit: '°' },
    lateral_lean: { metric: 'trunk_lateral_deviation_degrees', defaultUnit: '°' },
  },
  core: {
    coluna: { metric: 'deviation_from_neutral_line', defaultUnit: '°' },
    spine: { metric: 'deviation_from_neutral_line', defaultUnit: '°' },
    pelve: { metric: 'anterior_posterior_tilt_change', defaultUnit: '°' },
    pelvic: { metric: 'anterior_posterior_tilt_change', defaultUnit: '°' },
    costelas: { metric: 'rib_flare_angle', defaultUnit: '°' },
    rib_flare: { metric: 'rib_flare_angle', defaultUnit: '°' },
  },
};

function normalizeJointName(joint: string): string {
  return joint
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-\s]+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

// ============================
// Handler
// ============================

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: AnalyzeAnglesRequest = await request.json();
    const { exercise, angles, includeRAG = true, sendToLLM = true } = body;

    if (!exercise || !angles || angles.length === 0) {
      return NextResponse.json(
        { error: 'Campos "exercise" e "angles" são obrigatórios' },
        { status: 400 }
      );
    }

    // 1. Determinar categoria e template
    const category = getExerciseCategory(exercise);
    const template = getCategoryTemplate(category);

    // 2. Converter angles de entrada → MetricValue[]
    const jointMap = JOINT_TO_METRIC[category] || JOINT_TO_METRIC.squat;
    const seenMetrics = new Set<string>();
    const metrics: MetricValue[] = [];

    for (const angle of angles) {
      const normalized = normalizeJointName(angle.joint);
      const mapping = jointMap[normalized];

      if (mapping && !seenMetrics.has(mapping.metric)) {
        metrics.push({
          metric: mapping.metric,
          value: angle.value,
          unit: angle.unit || mapping.defaultUnit,
        });
        seenMetrics.add(mapping.metric);
      }
    }

    if (metrics.length === 0) {
      return NextResponse.json(
        {
          error: 'Nenhum ângulo pôde ser mapeado para métricas válidas',
          hint: `Joints válidos para ${category}: ${Object.keys(jointMap).join(', ')}`,
        },
        { status: 400 }
      );
    }

    // 3. Classificar contra template
    const classification = classifyMetrics(metrics, template, exercise);

    // 4. RAG
    const ragTopics = extractAllRAGTopics(classification);
    const ragContexts = includeRAG ? queryRAG(ragTopics) : [];

    // 5. Construir prompt
    const prompt = buildPrompt({
      result: classification,
      template,
      exerciseName: exercise,
      ragContext: ragContexts,
    });

    // 6. Enviar ao LLM (opcional)
    let llmReport: LLMAnalysisReport | null = null;
    if (sendToLLM) {
      try {
        llmReport = await sendPromptToOllama(prompt, classification, { timeoutMs: 180000 });
      } catch (llmError: any) {
        console.warn('[analyze-angles] LLM indisponível:', llmError.message);
      }
    }

    return NextResponse.json({
      success: true,
      exercise,
      category,
      processing_time_ms: Date.now() - startTime,

      classification: {
        overall_score: classification.overallScore,
        summary: classification.summary,
        has_danger: classification.hasDangerCriteria,
        has_warning_safety: classification.hasWarningSafetyCriteria,
        details: classification.classifications.map((c) => ({
          criterion: c.criterion,
          metric: c.metric,
          value: c.value,
          unit: c.unit,
          level: c.classification,
          is_safety_critical: c.isSafetyCritical,
          range: c.range,
          note: c.note,
        })),
      },

      rag: {
        topics_needed: ragTopics,
        contexts_found: ragContexts.length,
      },

      report: llmReport,

      prompt_metadata: {
        exercise: prompt.metadata.exerciseName,
        category: prompt.metadata.category,
        criteria_count: prompt.metadata.criteriaCount,
        danger_count: prompt.metadata.dangerCount,
        warning_count: prompt.metadata.warningCount,
        rag_topics_count: prompt.metadata.ragTopicsCount,
      },
    });
  } catch (error: any) {
    console.error('[analyze-angles] Erro:', error);
    return NextResponse.json(
      { error: 'Análise falhou', details: error.message },
      { status: 500 }
    );
  }
}

// GET: info sobre o endpoint
export async function GET() {
  const llm = await checkLLMAvailability();

  return NextResponse.json({
    endpoint: '/api/biomechanics/analyze-angles',
    description: 'Analisa ângulos pré-computados do MediaPipe',
    method: 'POST',
    llm: { available: llm.available, model: llm.model },
    categories: Object.keys(JOINT_TO_METRIC),
    example_request: {
      exercise: 'agachamento com barra',
      angles: [
        { joint: 'quadril', value: 68, unit: '°' },
        { joint: 'tronco', value: 48, unit: '°' },
        { joint: 'valgo_d', value: 6, unit: 'cm' },
        { joint: 'tornozelo', value: 28, unit: '°' },
        { joint: 'assimetria', value: 4, unit: '°' },
      ],
      includeRAG: true,
      sendToLLM: true,
    },
  });
}
