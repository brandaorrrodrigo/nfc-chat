/**
 * API Route: NFV Analysis - Trigger IA analise de video
 * POST - Iniciar analise por IA (Pipeline Biomecânico Completo)
 *
 * Fluxo: PENDING_AI -> PROCESSING -> BIOMECHANICS_ANALYZED_V2 ou ERROR
 *
 * Pipeline:
 * 1. Baixa vídeo do Supabase Storage
 * 2. Extrai frames com ffmpeg
 * 3. Analisa cada frame com Ollama Vision (ângulos estruturados)
 * 4. Mapeia ângulos para métricas da categoria do exercício
 * 5. Classifica contra ranges do template (squat/hinge/pull/press/etc)
 * 6. Gera relatório com LLM + RAG
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { downloadVideoFromSupabase, downloadVideoFromUrl, extractFrames, checkVisionModelAvailable } from '@/lib/vision/video-analysis';
import { analyzeAllFrames } from '@/lib/biomechanics/vision-analyzer';
import { classifyMetrics, extractAllRAGTopics } from '@/lib/biomechanics/criteria-classifier';
import { getCategoryTemplate, getExerciseCategory } from '@/lib/biomechanics/category-templates';
import { buildPrompt } from '@/lib/biomechanics/prompt-builder';
import { sendPromptToOllama } from '@/lib/biomechanics/llm-bridge';
import { queryRAG } from '@/lib/biomechanics/biomechanics-rag';
import { aggregateFrameAnalyses, visionToMetrics } from '@/lib/biomechanics/frame-aggregator';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const TABLE = 'nfc_chat_video_analyses';

async function setAnalysisError(analysisId: string, errorMessage: string): Promise<void> {
  try {
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabase();
    await supabase
      .from(TABLE)
      .update({
        status: 'ERROR',
        ai_analysis: {
          error: errorMessage,
          timestamp: new Date().toISOString(),
        },
      })
      .eq('id', analysisId);
  } catch { /* best effort */ }
}

export async function POST(req: NextRequest) {
  let analysisId: string | undefined;
  let tempDir: string | null = null;

  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const body = await req.json();
    analysisId = body.analysisId;

    if (!analysisId) {
      return NextResponse.json({ error: 'analysisId obrigatorio' }, { status: 400 });
    }

    const supabase = getSupabase();

    // 1. Buscar analise
    const { data: analysis, error: fetchError } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', analysisId)
      .single();

    if (fetchError || !analysis) {
      return NextResponse.json({ error: 'Analise nao encontrada' }, { status: 404 });
    }

    if (!['PENDING_AI', 'ERROR'].includes(analysis.status)) {
      return NextResponse.json({ error: 'Analise ja foi processada' }, { status: 400 });
    }

    // 2. Setar status PROCESSING
    await supabase
      .from(TABLE)
      .update({ status: 'PROCESSING' })
      .eq('id', analysisId);

    // 3. Verificar se Vision Model esta disponivel
    const visionAvailable = await checkVisionModelAvailable();

    if (!visionAvailable) {
      console.log('[NFV] Vision model nao disponivel, setando ERROR');
      await setAnalysisError(analysisId, 'Servico de analise indisponivel. Ollama nao esta rodando ou nao tem modelo de visao.');
      return NextResponse.json({ error: 'Servico de analise indisponivel' }, { status: 503 });
    }

    if (!analysis.video_url && !analysis.video_path) {
      await setAnalysisError(analysisId, 'Video nao encontrado no registro');
      return NextResponse.json({ error: 'Video nao encontrado' }, { status: 400 });
    }

    const exerciseName = analysis.movement_pattern || 'exercicio';
    const category = getExerciseCategory(exerciseName);
    const template = getCategoryTemplate(category);
    const frameCount = 6;

    console.log(`[NFV] Iniciando pipeline biomecânico para ${analysisId}`);
    console.log(`[NFV] Exercicio: ${exerciseName} → Categoria: ${category}`);

    // 4. Baixar video e extrair frames
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nfv-analysis-'));
    let localVideoPath: string | null = null;

    if (analysis.video_path) {
      try {
        fs.accessSync(analysis.video_path);
        localVideoPath = analysis.video_path;
      } catch {
        localVideoPath = await downloadVideoFromSupabase(analysis.video_path, tempDir);
      }
    } else if (analysis.video_url) {
      localVideoPath = await downloadVideoFromUrl(analysis.video_url, tempDir);
    }

    if (!localVideoPath) {
      await setAnalysisError(analysisId, 'Nao foi possivel baixar o video');
      return NextResponse.json({ error: 'Nao foi possivel baixar o video' }, { status: 400 });
    }

    console.log(`[NFV] Video baixado: ${localVideoPath}`);

    // 5. Extrair frames
    const framesDir = path.join(tempDir, 'frames');
    fs.mkdirSync(framesDir, { recursive: true });
    const framePaths = await extractFrames(localVideoPath, framesDir, frameCount);

    console.log(`[NFV] ${framePaths.length} frames extraidos`);

    // 6. Converter frames para base64 e analisar com Vision (ângulos estruturados)
    const framesBase64: string[] = [];
    for (const fp of framePaths) {
      const buffer = await fs.promises.readFile(fp);
      framesBase64.push(buffer.toString('base64'));
    }

    console.log(`[NFV] Analisando ${framesBase64.length} frames com Vision (${exerciseName})...`);
    const visionResults = await analyzeAllFrames(framesBase64, exerciseName);

    // Log dos ângulos extraídos
    for (let i = 0; i < visionResults.length; i++) {
      const r = visionResults[i];
      console.log(`[NFV] Frame ${i + 1}: score=${r.score}, hip=${r.angulos_aproximados.flexao_quadril_graus}°, knee_L=${r.angulos_aproximados.joelho_esq_graus}°, trunk=${r.angulos_aproximados.inclinacao_tronco_graus}°, lombar=${r.angulos_aproximados.lombar_flexao_graus}°`);
    }

    // 7. Agregar resultados dos frames
    const aggregated = aggregateFrameAnalyses(visionResults);
    console.log(`[NFV] Agregado: avgScore=${aggregated.avgScore.toFixed(1)}, trunkVar=${aggregated.trunkVariation.toFixed(1)}°, valgus=${aggregated.hasValgus}`);

    // 8. Mapear para MetricValue[] da categoria correta
    const metrics = visionToMetrics(aggregated, category);

    console.log(`[NFV] Metricas para ${category}:`);
    for (const m of metrics) {
      console.log(`  ${m.metric}: ${m.value}${m.unit || ''}`);
    }

    // 9. Classificar contra template
    const equipmentConstraint = body.equipmentConstraint || undefined;
    const classification = classifyMetrics(metrics, template, exerciseName, equipmentConstraint);

    console.log(`[NFV] Score: ${classification.overallScore.toFixed(1)}/10 (${classification.summary.excellent}E ${classification.summary.good}G ${classification.summary.acceptable}A ${classification.summary.warning}W ${classification.summary.danger}D)`);

    // 10. Extrair tópicos RAG
    const ragTopics = extractAllRAGTopics(classification);
    let ragContexts: any[] = [];
    if (ragTopics.length > 0) {
      try {
        const ragResults = await queryRAG(ragTopics);
        ragContexts = ragResults || [];
      } catch {
        console.warn('[NFV] RAG query failed, continuando sem RAG');
      }
    }

    // 11. Build prompt para LLM
    const prompt = buildPrompt({
      result: classification,
      template,
      exerciseName,
      ragContext: ragContexts,
      equipmentConstraint,
      videoMetadata: {
        duration: 0,
        frameCount: framePaths.length,
        fps: 30,
      },
    });

    // 12. Gerar relatório via Ollama LLM
    let llmReport: Awaited<ReturnType<typeof sendPromptToOllama>> = null;
    try {
      llmReport = await sendPromptToOllama(prompt, classification, { timeoutMs: 180000 });
      console.log('[NFV] Relatório Ollama gerado com sucesso');
    } catch (llmError: any) {
      console.warn('[NFV] Ollama LLM indisponivel:', llmError.message);
    }

    // 13. Preparar resultado estruturado
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

    console.log(`[NFV] Pipeline completo! Score: ${classification.overallScore.toFixed(1)}/10 | Categoria: ${category}`);

    // 14. Salvar no banco
    const { data: updated, error: updateError } = await supabase
      .from(TABLE)
      .update({
        ai_analysis: biomechanicsResult,
        ai_analyzed_at: new Date().toISOString(),
        status: 'BIOMECHANICS_ANALYZED_V2',
        updated_at: new Date().toISOString(),
      })
      .eq('id', analysisId)
      .select()
      .single();

    if (updateError) {
      console.error('[NFV] Error updating analysis:', updateError);
      return NextResponse.json({ error: 'Erro ao salvar analise' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      analysis: updated,
      aiResult: biomechanicsResult,
    });
  } catch (error: any) {
    console.error('[NFV] Analysis POST error:', error);
    if (analysisId) {
      await setAnalysisError(analysisId, error.message || 'Erro interno na analise');
    }
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  } finally {
    // Cleanup temp files
    if (tempDir && fs.existsSync(tempDir)) {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch { /* cleanup */ }
    }
  }
}
