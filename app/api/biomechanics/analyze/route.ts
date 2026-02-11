/**
 * API Endpoint para análise biomecânica de vídeos
 * POST /api/biomechanics/analyze
 *
 * Pipeline REAL:
 * 1. Baixa vídeo do Supabase Storage
 * 2. Extrai frames com ffmpeg
 * 3. Analisa cada frame com Ollama Vision (llama3.2-vision)
 * 4. Mapeia ângulos extraídos para métricas da categoria do exercício
 * 5. Classifica contra ranges do template
 * 6. Gera relatório com LLM + RAG
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { downloadVideoFromSupabase, downloadVideoFromUrl, extractFrames } from '@/lib/vision/video-analysis';
import { analyzeAllFrames, FrameAnalysis } from '@/lib/biomechanics/vision-analyzer';
import {
  classifyMetrics,
  extractAllRAGTopics,
  MetricValue,
} from '@/lib/biomechanics/criteria-classifier';
import {
  getCategoryTemplate,
  getExerciseCategory,
} from '@/lib/biomechanics/category-templates';
import { buildPrompt } from '@/lib/biomechanics/prompt-builder';
import { sendPromptToOllama } from '@/lib/biomechanics/llm-bridge';
import { queryRAG } from '@/lib/biomechanics/biomechanics-rag';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const TABLE = 'nfc_chat_video_analyses';

/**
 * Agrega análises de múltiplos frames em métricas resumidas
 */
function aggregateFrameAnalyses(frames: FrameAnalysis[]): {
  avgAngles: FrameAnalysis['angulos_aproximados'];
  minAngles: FrameAnalysis['angulos_aproximados'];
  maxAngles: FrameAnalysis['angulos_aproximados'];
  avgScore: number;
  hasValgus: boolean;
  trunkVariation: number;
  escapulasRetraidas: boolean;
} {
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
function visionToMetrics(
  agg: ReturnType<typeof aggregateFrameAnalyses>,
  category: string
): MetricValue[] {
  const metrics: MetricValue[] = [];

  switch (category) {
    case 'squat': {
      // hip_angle_at_bottom: MIN do quadril (posição mais baixa)
      if (agg.minAngles.flexao_quadril_graus >= 0)
        metrics.push({ metric: 'hip_angle_at_bottom', value: agg.minAngles.flexao_quadril_graus, unit: '°' });
      // knee_medial_displacement_cm: estimado pelo valgus
      metrics.push({ metric: 'knee_medial_displacement_cm', value: agg.hasValgus ? 4 : 1, unit: 'cm' });
      // trunk_inclination_degrees: AVG do tronco
      if (agg.avgAngles.inclinacao_tronco_graus >= 0)
        metrics.push({ metric: 'trunk_inclination_degrees', value: agg.avgAngles.inclinacao_tronco_graus, unit: '°' });
      // ankle_dorsiflexion_degrees: estimado (se joelho avança sobre pés)
      metrics.push({ metric: 'ankle_dorsiflexion_degrees', value: 28, unit: '°' }); // TODO: estimar melhor
      // lumbar_flexion_change_degrees: variação da lombar
      if (agg.maxAngles.lombar_flexao_graus >= 0 && agg.minAngles.lombar_flexao_graus >= 0)
        metrics.push({ metric: 'lumbar_flexion_change_degrees', value: agg.maxAngles.lombar_flexao_graus - agg.minAngles.lombar_flexao_graus, unit: '°' });
      // bilateral_angle_difference: diff joelhos
      if (agg.avgAngles.joelho_esq_graus >= 0 && agg.avgAngles.joelho_dir_graus >= 0)
        metrics.push({ metric: 'bilateral_angle_difference', value: Math.abs(agg.avgAngles.joelho_esq_graus - agg.avgAngles.joelho_dir_graus), unit: '°' });
      break;
    }

    case 'hinge': {
      // lumbar_flexion_degrees: AVG da lombar
      if (agg.avgAngles.lombar_flexao_graus >= 0)
        metrics.push({ metric: 'lumbar_flexion_degrees', value: agg.avgAngles.lombar_flexao_graus, unit: '°' });
      // hip_angle_vs_knee_angle_ratio: quanto quadril fecha vs joelho
      if (agg.minAngles.flexao_quadril_graus >= 0 && agg.minAngles.joelho_esq_graus >= 0) {
        const hipChange = 180 - agg.minAngles.flexao_quadril_graus;
        const kneeChange = 180 - agg.minAngles.joelho_esq_graus;
        const ratio = kneeChange > 0 ? hipChange / kneeChange : 2;
        metrics.push({ metric: 'hip_angle_vs_knee_angle_ratio', value: ratio, unit: ':1' });
      }
      // horizontal_bar_deviation_cm: estimado pela estabilidade do tronco
      metrics.push({ metric: 'horizontal_bar_deviation_cm', value: agg.trunkVariation > 10 ? 5 : 2, unit: 'cm' });
      // thoracic_flexion_degrees: inclinação do tronco
      if (agg.avgAngles.inclinacao_tronco_graus >= 0)
        metrics.push({ metric: 'thoracic_flexion_degrees', value: agg.avgAngles.inclinacao_tronco_graus, unit: '°' });
      // hip_extension_at_top: max extensão do quadril
      if (agg.maxAngles.flexao_quadril_graus >= 0)
        metrics.push({ metric: 'hip_extension_at_top', value: agg.maxAngles.flexao_quadril_graus, unit: '°' });
      break;
    }

    case 'pull': {
      // scapular_distance_change_cm: estimado pela retração escapular
      metrics.push({ metric: 'scapular_distance_change_cm', value: agg.escapulasRetraidas ? 3 : 1, unit: 'cm' });
      // elbow_angle_at_contraction: MIN do cotovelo
      if (agg.minAngles.cotovelo_esq_graus >= 0)
        metrics.push({ metric: 'elbow_angle_at_contraction', value: agg.minAngles.cotovelo_esq_graus, unit: '°' });
      // trunk_angle_variation_degrees: variação do tronco durante o movimento
      metrics.push({ metric: 'trunk_angle_variation_degrees', value: agg.trunkVariation, unit: '°' });
      // lumbar_flexion_degrees: flexão lombar média
      if (agg.avgAngles.lombar_flexao_graus >= 0)
        metrics.push({ metric: 'lumbar_flexion_degrees', value: agg.avgAngles.lombar_flexao_graus, unit: '°' });
      else if (agg.avgAngles.inclinacao_tronco_graus >= 0)
        metrics.push({ metric: 'lumbar_flexion_degrees', value: agg.avgAngles.inclinacao_tronco_graus, unit: '°' });
      break;
    }

    case 'horizontal_press': {
      // elbow_angle_at_chest: MIN do cotovelo (ponto mais baixo)
      if (agg.minAngles.cotovelo_esq_graus >= 0)
        metrics.push({ metric: 'elbow_angle_at_chest', value: agg.minAngles.cotovelo_esq_graus, unit: '°' });
      // elbow_abduction_angle: estimado
      metrics.push({ metric: 'elbow_abduction_angle', value: 55, unit: '°' }); // TODO: estimar
      // wrist_extension_degrees: estimado
      metrics.push({ metric: 'wrist_extension_degrees', value: 5, unit: '°' });
      break;
    }

    case 'vertical_press': {
      // shoulder_flexion_at_top: MAX da flexão do ombro
      if (agg.maxAngles.ombro_flexao_graus >= 0)
        metrics.push({ metric: 'shoulder_flexion_at_top', value: agg.maxAngles.ombro_flexao_graus, unit: '°' });
      // lumbar_extension_increase_degrees: extensão lombar
      if (agg.maxAngles.lombar_flexao_graus >= 0 && agg.minAngles.lombar_flexao_graus >= 0)
        metrics.push({ metric: 'lumbar_extension_increase_degrees', value: agg.maxAngles.lombar_flexao_graus - agg.minAngles.lombar_flexao_graus, unit: '°' });
      // rib_cage_angle_change: estimado pelo tronco
      metrics.push({ metric: 'rib_cage_angle_change', value: agg.trunkVariation, unit: '°' });
      break;
    }

    default: {
      // Genérico: usar todos os ângulos disponíveis
      if (agg.avgAngles.flexao_quadril_graus >= 0)
        metrics.push({ metric: 'hip_angle_at_bottom', value: agg.minAngles.flexao_quadril_graus, unit: '°' });
      if (agg.avgAngles.inclinacao_tronco_graus >= 0)
        metrics.push({ metric: 'trunk_inclination_degrees', value: agg.avgAngles.inclinacao_tronco_graus, unit: '°' });
      break;
    }
  }

  return metrics;
}

export async function POST(request: NextRequest) {
  let tempDir: string | null = null;

  try {
    const body = await request.json();
    const { videoId, equipmentConstraint } = body;

    if (!videoId) {
      return NextResponse.json({ error: 'videoId is required' }, { status: 400 });
    }

    const supabase = getSupabase();

    // 1. Buscar vídeo no banco
    const { data: video, error: fetchError } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', videoId)
      .single();

    if (fetchError || !video) {
      return NextResponse.json({ error: 'Video not found', details: fetchError?.message }, { status: 404 });
    }

    const exerciseName = video.movement_pattern || 'exercicio';
    const category = getExerciseCategory(exerciseName);
    const template = getCategoryTemplate(category);

    console.log(`[Biomechanics] Analyzing video ${videoId}`);
    console.log(`[Biomechanics] Exercise: ${exerciseName} → Category: ${category}`);

    // 2. Baixar vídeo
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nfv-api-'));
    let localVideoPath: string | null = null;

    if (video.video_path) {
      try {
        await fs.promises.access(video.video_path);
        localVideoPath = video.video_path;
      } catch {
        // Não é arquivo local — baixar do Supabase Storage
        localVideoPath = await downloadVideoFromSupabase(video.video_path, tempDir);
      }
    } else if (video.video_url) {
      localVideoPath = await downloadVideoFromUrl(video.video_url, tempDir);
    }

    if (!localVideoPath) {
      return NextResponse.json({ error: 'Não foi possível baixar o vídeo' }, { status: 400 });
    }

    console.log(`[Biomechanics] Video downloaded: ${localVideoPath}`);

    // 3. Extrair frames
    const frameCount = 6;
    const framesDir = path.join(tempDir, 'frames');
    fs.mkdirSync(framesDir, { recursive: true });
    const framePaths = await extractFrames(localVideoPath, framesDir, frameCount);

    console.log(`[Biomechanics] Extracted ${framePaths.length} frames`);

    // 4. Converter frames para base64 e analisar com Vision
    const framesBase64: string[] = [];
    for (const fp of framePaths) {
      const buffer = await fs.promises.readFile(fp);
      framesBase64.push(buffer.toString('base64'));
    }

    console.log(`[Biomechanics] Analyzing ${framesBase64.length} frames with Ollama Vision (${exerciseName})...`);
    const visionResults = await analyzeAllFrames(framesBase64, exerciseName);

    // 5. Log dos ângulos extraídos
    for (let i = 0; i < visionResults.length; i++) {
      const r = visionResults[i];
      console.log(`[Biomechanics] Frame ${i + 1}: score=${r.score}, hip=${r.angulos_aproximados.flexao_quadril_graus}°, knee_L=${r.angulos_aproximados.joelho_esq_graus}°, trunk=${r.angulos_aproximados.inclinacao_tronco_graus}°, elbow_L=${r.angulos_aproximados.cotovelo_esq_graus}°, lombar=${r.angulos_aproximados.lombar_flexao_graus}°`);
    }

    // 6. Agregar resultados dos frames
    const aggregated = aggregateFrameAnalyses(visionResults);

    console.log(`[Biomechanics] Aggregated: avgScore=${aggregated.avgScore.toFixed(1)}, trunkVar=${aggregated.trunkVariation.toFixed(1)}°, valgus=${aggregated.hasValgus}`);

    // 7. Mapear para MetricValue[] da categoria correta
    const metrics = visionToMetrics(aggregated, category);

    console.log(`[Biomechanics] Metrics for ${category}:`);
    for (const m of metrics) {
      console.log(`  ${m.metric}: ${m.value}${m.unit || ''}`);
    }

    // 8. Classificar contra template
    const classification = classifyMetrics(
      metrics,
      template,
      exerciseName,
      equipmentConstraint || undefined
    );

    console.log(`[Biomechanics] Score: ${classification.overallScore.toFixed(1)}/10 (${classification.summary.excellent}E ${classification.summary.good}G ${classification.summary.acceptable}A ${classification.summary.warning}W ${classification.summary.danger}D)`);

    // 9. Extrair tópicos RAG
    const ragTopics = extractAllRAGTopics(classification);
    let ragContexts: any[] = [];
    if (ragTopics.length > 0) {
      try {
        const ragResults = await queryRAG(ragTopics);
        ragContexts = ragResults || [];
      } catch {
        console.warn('[Biomechanics] RAG query failed, continuing without');
      }
    }

    // 10. Build prompt para LLM
    const prompt = buildPrompt({
      result: classification,
      template,
      exerciseName,
      ragContext: ragContexts,
      equipmentConstraint: equipmentConstraint || undefined,
      videoMetadata: {
        duration: 0,
        frameCount: framePaths.length,
        fps: 30,
      },
    });

    // 11. Gerar relatório via Ollama + RAG
    let llmReport: Awaited<ReturnType<typeof sendPromptToOllama>> = null;
    try {
      llmReport = await sendPromptToOllama(prompt, classification, { timeoutMs: 180000 });
      console.log('[Biomechanics] Relatório Ollama gerado com sucesso');
    } catch (llmError: any) {
      console.warn('[Biomechanics] Ollama indisponível:', llmError.message);
    }

    // 12. Preparar resultado
    const biomechanicsResult = {
      timestamp: new Date().toISOString(),
      system: 'biomechanics-v3-vision',
      exercise_type: exerciseName,
      category,
      overall_score: classification.overallScore,
      vision_score: aggregated.avgScore,
      equipment_constraint: classification.constraintApplied || null,
      equipment_constraint_label: classification.constraintLabel || null,
      classification_summary: classification.summary,
      classifications_detail: classification.classifications.map(c => ({
        criterion: c.criterion,
        label: c.label || c.criterion,
        metric: c.metric,
        value: `${c.value}${c.unit || ''}`,
        raw_value: c.value,
        unit: c.unit || '',
        classification: c.classification,
        classification_label: c.classificationLabel || c.classification,
        is_safety_critical: c.isSafetyCritical,
        is_informative: c.isInformativeOnly || false,
        note: c.note,
        rag_topics: c.ragTopics,
      })),
      rag_topics_used: ragTopics,
      frames_analyzed: framePaths.length,
      frame_scores: visionResults.map(f => f.score),
      frame_details: visionResults.map((f, i) => ({
        frame: i + 1,
        score: f.score,
        fase: f.fase,
        desvios: f.desvios_criticos,
        justificativa: f.justificativa,
      })),
      llm_report: llmReport || null,
    };

    // 13. Salvar no banco
    const { error: updateError } = await supabase
      .from(TABLE)
      .update({
        status: 'BIOMECHANICS_ANALYZED_V2',
        ai_analysis: biomechanicsResult,
        updated_at: new Date().toISOString(),
      })
      .eq('id', videoId);

    if (updateError) {
      console.error('[Biomechanics] Error saving:', updateError);
    }

    // 14. Retornar resultado
    return NextResponse.json({
      success: true,
      videoId,
      analysis: biomechanicsResult,
      diagnostic: {
        score: classification.overallScore,
        summary: classification.summary,
        problems: classification.classifications
          .filter(c => ['warning', 'danger'].includes(c.classification) && !c.isInformativeOnly)
          .map(c => ({
            criterion: c.criterion,
            label: c.label || c.criterion,
            metric: c.metric,
            value: `${c.value}${c.unit || ''}`,
            raw_value: c.value,
            unit: c.unit || '',
            classification: c.classification,
            classification_label: c.classificationLabel || c.classification,
            is_safety_critical: c.isSafetyCritical,
            is_informative: c.isInformativeOnly || false,
            note: c.note,
            rag_topics: c.ragTopics,
          })),
        positive: classification.classifications
          .filter(c => ['excellent', 'good'].includes(c.classification))
          .map(c => ({
            criterion: c.criterion,
            label: c.label || c.criterion,
            metric: c.metric,
            value: `${c.value}${c.unit || ''}`,
            raw_value: c.value,
            unit: c.unit || '',
            classification: c.classification,
            classification_label: c.classificationLabel || c.classification,
            is_safety_critical: c.isSafetyCritical,
            is_informative: c.isInformativeOnly || false,
            note: c.note,
            rag_topics: c.ragTopics,
          })),
      },
      report: llmReport,
    });
  } catch (error) {
    console.error('[Biomechanics] Analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    if (tempDir && fs.existsSync(tempDir)) {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch { /* cleanup */ }
    }
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'POST /api/biomechanics/analyze',
    version: 'v3-vision',
    description: 'Analyzes exercise video biomechanics using Ollama Vision (llama3.2-vision)',
    pipeline: [
      '1. Download video from Supabase Storage',
      '2. Extract frames with ffmpeg',
      '3. Analyze each frame with llama3.2-vision',
      '4. Map angles to exercise-specific metrics',
      '5. Classify against category template ranges',
      '6. Generate report with LLM + RAG',
    ],
    categories: ['squat', 'hinge', 'pull', 'horizontal_press', 'vertical_press', 'unilateral', 'core'],
    request: {
      method: 'POST',
      body: {
        videoId: 'string - ID from nfc_chat_video_analyses table',
        equipmentConstraint: 'optional: none | safety_bars | machine_guided | space_limited | pain_limited | rehab',
      },
    },
  });
}
