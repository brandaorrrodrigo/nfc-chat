/**
 * API Endpoint para gerar relatório com dados pré-computados
 * POST /api/biomechanics/generate-report
 *
 * Aceita ângulos já medidos e gera relatório completo via Ollama + RAG
 */

import { NextRequest, NextResponse } from 'next/server';
import { getExerciseCategory, getCategoryTemplate } from '@/lib/biomechanics/category-templates';
import { classifyMetrics, extractAllRAGTopics } from '@/lib/biomechanics/criteria-classifier';
import { buildPrompt } from '@/lib/biomechanics/prompt-builder';
import { queryRAG } from '@/lib/biomechanics/biomechanics-rag';
import { sendPromptToOllama } from '@/lib/biomechanics/llm-bridge';

interface AngleData {
  profundidade?: number;
  valgo?: number;
  tronco?: number;
  tornozelo?: number;
  lombar?: number;
  assimetria?: number;
}

interface GenerateReportRequest {
  exercise: string; // ex: "agachamento com barra"
  angles: AngleData;
  constraint?: string; // ex: "safety_bars"
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: GenerateReportRequest = await request.json();
    const { exercise, angles, constraint } = body;

    if (!exercise || !angles) {
      return NextResponse.json(
        { error: 'Campos "exercise" e "angles" são obrigatórios' },
        { status: 400 }
      );
    }

    // 1. Mapear ângulos para métricas
    const category = getExerciseCategory(exercise);
    const template = getCategoryTemplate(category);

    const metrics = [
      { metric: 'hip_angle_at_bottom', value: angles.profundidade, unit: '°' },
      { metric: 'knee_medial_displacement_cm', value: angles.valgo, unit: 'cm' },
      { metric: 'trunk_inclination_degrees', value: angles.tronco, unit: '°' },
      { metric: 'ankle_dorsiflexion_degrees', value: angles.tornozelo, unit: '°' },
      { metric: 'lumbar_flexion_change_degrees', value: angles.lombar, unit: '°' },
      { metric: 'bilateral_angle_difference', value: angles.assimetria, unit: '°' },
    ].filter((m) => m.value !== undefined) as any[];

    // 2. Classificar
    const classification = classifyMetrics(
      metrics,
      template,
      exercise,
      constraint as any
    );

    // 3. Extrair tópicos RAG
    const ragTopics = extractAllRAGTopics(classification);
    const ragContexts = queryRAG(ragTopics);

    // 4. Construir prompt
    const prompt = buildPrompt({
      result: classification,
      template,
      exerciseName: exercise,
      ragContext: ragContexts,
      equipmentConstraint: constraint as any,
    });

    // 5. Chamar Ollama
    let llmReport = null;
    try {
      llmReport = await sendPromptToOllama(prompt, classification, { timeoutMs: 180000 });
      console.log('[generate-report] Relatório Ollama gerado com sucesso');
    } catch (llmError: any) {
      console.warn('[generate-report] Ollama indisponível:', llmError.message);
      // Continua com fallback
    }

    // 6. Retornar resultado completo
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
          label: c.label,
          metric: c.metric,
          value: c.value,
          unit: c.unit,
          level: c.classification,
          level_label: c.classificationLabel,
          is_safety_critical: c.isSafetyCritical,
          is_informative: c.isInformativeOnly || false,
          range: c.range,
          note: c.note,
        })),
      },

      rag: {
        topics_needed: ragTopics,
        contexts_found: ragContexts.length,
        contexts: ragContexts.map((ctx) => ({
          topic: ctx.topic,
          source: ctx.source,
        })),
      },

      report: llmReport,
    });
  } catch (error: any) {
    console.error('[generate-report] Erro:', error);
    return NextResponse.json(
      { error: 'Geração de relatório falhou', details: error.message },
      { status: 500 }
    );
  }
}

// GET: documentação
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/biomechanics/generate-report',
    description: 'Gera relatório completo com ângulos pré-computados',
    method: 'POST',
    example_request: {
      exercise: 'agachamento com barra',
      angles: {
        profundidade: 104,
        valgo: 0,
        tronco: 7.2,
        tornozelo: 22,
        lombar: 10.5,
        assimetria: 0,
      },
      constraint: 'safety_bars',
    },
    example_response: {
      success: true,
      classification: {
        overall_score: 8.7,
        details: [
          {
            criterion: 'Profundidade',
            value: 104,
            level: 'acceptable',
            level_label: 'Aceitável',
          },
        ],
      },
      report: {
        resumo_executivo: '...',
        problemas_identificados: [],
        pontos_positivos: [],
        recomendacoes: [],
        score_geral: 8.7,
        classificacao: 'BOM',
        proximos_passos: [],
      },
    },
  });
}
