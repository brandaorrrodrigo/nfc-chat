/**
 * API Route: NFV Analysis - Auto-trigger de análise biomecânica
 * POST - Pipeline completo MediaPipe + V2 Classifier + RAG + Ollama TEXT
 *
 * Fluxo: PENDING_AI → PROCESSING → BIOMECHANICS_ANALYZED_V2 ou ERROR
 *
 * Pipeline (idêntico ao /api/biomechanics/analyze):
 * 1. Baixa vídeo do Supabase Storage
 * 2. Extrai frames com ffmpeg
 * 3. Analisa cada frame com MediaPipe Pose (Python, heavy model)
 * 4. V2: Motor/Estabilizador | V1 fallback: categoria genérica
 * 5. Gera relatório com Ollama TEXT (llama3.1) + RAG
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { downloadVideoFromSupabase, downloadVideoFromUrl, extractFrames } from '@/lib/vision/video-analysis';
import {
  analyzeFramesWithMediaPipe,
  aggregateMediaPipeFrames,
  mediapipeToMetricsV2,
  mediapipeToMetricsV1,
} from '@/lib/biomechanics/mediapipe-bridge';
import { classifyMetrics, extractAllRAGTopics } from '@/lib/biomechanics/criteria-classifier';
import { getCategoryTemplate, getExerciseCategory } from '@/lib/biomechanics/category-templates';
import { buildPrompt, buildPromptV2, type RAGContext } from '@/lib/biomechanics/prompt-builder';
import { sendPromptToOllama } from '@/lib/biomechanics/llm-bridge';
import { queryRAG } from '@/lib/biomechanics/biomechanics-rag';
import { getExerciseTemplateV2 } from '@/lib/biomechanics/exercise-templates-v2';
import { classifyExerciseV2, extractV2RAGTopics } from '@/lib/biomechanics/classifier-v2';
import { generateCorrectivePlanFromAnalysis } from '@/lib/biomechanics/corrective-plan-generator';
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

    // 1. Buscar análise
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

    if (!analysis.video_url && !analysis.video_path) {
      await setAnalysisError(analysisId, 'Video nao encontrado no registro');
      return NextResponse.json({ error: 'Video nao encontrado' }, { status: 400 });
    }

    const exerciseName = analysis.movement_pattern || 'exercicio';
    const category = getExerciseCategory(exerciseName);
    const template = getCategoryTemplate(category);

    console.log(`[NFV] Pipeline MediaPipe para ${analysisId}`);
    console.log(`[NFV] Exercicio: ${exerciseName} → Categoria: ${category}`);

    // 3. Baixar vídeo e extrair frames
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

    // 4. Extrair frames
    const frameCount = 6;
    const framesDir = path.join(tempDir, 'frames');
    fs.mkdirSync(framesDir, { recursive: true });
    const framePaths = await extractFrames(localVideoPath, framesDir, frameCount);

    console.log(`[NFV] ${framePaths.length} frames extraidos`);

    // 5. Analisar frames com MediaPipe (Python)
    console.log(`[NFV] Analisando ${framePaths.length} frames com MediaPipe Pose...`);
    const mediapipeResult = await analyzeFramesWithMediaPipe(framePaths);

    if (!mediapipeResult.success || mediapipeResult.frames_processed === 0) {
      console.error('[NFV] MediaPipe failed:', mediapipeResult.error);
      await setAnalysisError(analysisId, `MediaPipe falhou: ${mediapipeResult.error}`);
      return NextResponse.json({ error: 'MediaPipe analysis failed' }, { status: 500 });
    }

    console.log(`[NFV] MediaPipe: ${mediapipeResult.frames_processed}/${mediapipeResult.frames_total} frames`);

    // 6. Agregar resultados dos frames
    const aggregated = aggregateMediaPipeFrames(mediapipeResult);

    console.log(`[NFV] Aggregated: conf=${aggregated.avgConfidence}, frames=${aggregated.framesProcessed} (filtrados=${aggregated.framesFiltered})`);
    if (aggregated.videoQualityWarning) {
      console.log(`[NFV] Aviso qualidade: ${aggregated.videoQualityWarning}`);
    }

    // 7. V2 (Motor/Estabilizador) ou V1 fallback
    const templateV2 = getExerciseTemplateV2(exerciseName);
    const isV2 = !!templateV2;

    let biomechanicsResult: Record<string, unknown>;
    let llmReport: unknown = null;

    if (isV2 && templateV2) {
      // ========== PIPELINE V2 ==========
      console.log(`[NFV] V2: ${templateV2.exerciseId} (${templateV2.exerciseName})`);

      const { motorMetrics, stabilizerMetrics } = mediapipeToMetricsV2(aggregated, templateV2);
      const resultV2 = classifyExerciseV2(motorMetrics, stabilizerMetrics, templateV2);

      console.log(`[NFV] V2 Score: ${resultV2.overallScore}/10 (Motor: ${resultV2.motorScore}, Stab: ${resultV2.stabilizerScore})`);

      // RAG
      const ragTopics = extractV2RAGTopics(resultV2);
      let ragContexts: RAGContext[] = [];
      if (ragTopics.length > 0) {
        try {
          const ragResults = await queryRAG(ragTopics);
          ragContexts = ragResults || [];
        } catch {
          console.warn('[NFV] RAG failed, continuing');
        }
      }

      // Ollama LLM report
      const prompt = buildPromptV2({
        result: resultV2,
        template: templateV2,
        ragContext: ragContexts,
        videoMetadata: { frameCount: framePaths.length },
      });

      try {
        llmReport = await sendPromptToOllama(prompt, null, { timeoutMs: 180000 });
        console.log('[NFV] Relatório Ollama gerado');
      } catch (llmError: unknown) {
        console.warn('[NFV] Ollama indisponível:', llmError instanceof Error ? llmError.message : 'unknown');
      }

      biomechanicsResult = {
        timestamp: new Date().toISOString(),
        system: 'biomechanics-v4-mediapipe',
        pipeline_version: 'v2',
        angle_source: 'mediapipe_pose_heavy',
        exercise_id: templateV2.exerciseId,
        exercise_type: resultV2.exerciseName,
        category: resultV2.category,
        type: resultV2.type,
        overall_score: resultV2.overallScore,
        motor_score: resultV2.motorScore,
        stabilizer_score: resultV2.stabilizerScore,
        mediapipe_confidence: aggregated.avgConfidence,
        frames_filtered: aggregated.framesFiltered,
        video_quality_warning: aggregated.videoQualityWarning,
        equipment_constraint: body.equipmentConstraint || null,

        motor_analysis: resultV2.motorAnalysis.map(m => ({
          joint: m.joint,
          label: m.label,
          movement: m.movement,
          rom: m.rom,
          peak_contraction: m.peakContraction || null,
          symmetry: m.symmetry || null,
        })),

        stabilizer_analysis: resultV2.stabilizerAnalysis.map(s => ({
          joint: s.joint,
          label: s.label,
          expected_state: s.expectedState,
          instability_meaning: s.instabilityMeaning,
          variation: s.variation,
          interpretation: s.interpretation,
          corrective_exercises: s.correctiveExercises,
        })),

        classification_summary: {
          motor: resultV2.summary.motor,
          stabilizer: resultV2.summary.stabilizer,
        },

        classifications_detail: [
          ...resultV2.motorAnalysis.map(m => ({
            type: 'motor' as const,
            criterion: m.joint,
            label: m.label,
            metric: m.rom.unit === 'cm' ? `${m.joint}_cm` : `${m.joint}_rom`,
            value: `${m.rom.value}${m.rom.unit}`,
            raw_value: m.rom.value,
            unit: m.rom.unit,
            classification: m.rom.classification,
            classification_label: m.rom.classificationLabel,
            is_safety_critical: false,
            is_informative: false,
            note: m.movement,
            rag_topics: m.ragTopics,
          })),
          ...resultV2.stabilizerAnalysis.map(s => ({
            type: 'stabilizer' as const,
            criterion: s.joint,
            label: s.label,
            metric: `${s.joint}_variation`,
            value: `${s.variation.value}${s.variation.unit}`,
            raw_value: s.variation.value,
            unit: s.variation.unit,
            classification: s.variation.classification === 'firme' ? 'excellent'
              : s.variation.classification === 'alerta' ? 'warning' : 'danger',
            classification_label: s.variation.classificationLabel,
            is_safety_critical: s.variation.classification === 'compensação',
            is_informative: false,
            note: s.variation.classification === 'firme'
              ? `✓ ${s.expectedState}`
              : `⚠ ${s.instabilityMeaning}`,
            rag_topics: s.ragTopics,
          })),
        ],

        muscles: resultV2.muscles,
        rag_topics_used: ragTopics,
        frames_analyzed: framePaths.length,
        mediapipe_frames: mediapipeResult.frames.map((f, i) => ({
          frame: i + 1,
          success: f.success,
          angles: f.success ? (f.world_angles || f.angles) : null,
          error: f.error || null,
        })),
        llm_report: llmReport || null,
      };

    } else {
      // ========== PIPELINE V1 FALLBACK ==========
      console.log(`[NFV] V1 fallback: ${category}`);

      const metrics = mediapipeToMetricsV1(aggregated, category);
      const classification = classifyMetrics(metrics, template, exerciseName, body.equipmentConstraint || undefined);

      console.log(`[NFV] V1 Score: ${classification.overallScore.toFixed(1)}/10`);

      const ragTopics = extractAllRAGTopics(classification);
      let ragContexts: RAGContext[] = [];
      if (ragTopics.length > 0) {
        try {
          const ragResults = await queryRAG(ragTopics);
          ragContexts = ragResults || [];
        } catch {
          console.warn('[NFV] RAG failed, continuing');
        }
      }

      const prompt = buildPrompt({
        result: classification,
        template,
        exerciseName,
        ragContext: ragContexts,
        equipmentConstraint: body.equipmentConstraint || undefined,
        videoMetadata: { duration: 0, frameCount: framePaths.length, fps: 30 },
      });

      try {
        llmReport = await sendPromptToOllama(prompt, classification, { timeoutMs: 180000 });
        console.log('[NFV] Relatório Ollama V1 gerado');
      } catch (llmError: unknown) {
        console.warn('[NFV] Ollama indisponível:', llmError instanceof Error ? llmError.message : 'unknown');
      }

      biomechanicsResult = {
        timestamp: new Date().toISOString(),
        system: 'biomechanics-v4-mediapipe',
        pipeline_version: 'v1',
        angle_source: 'mediapipe_pose_heavy',
        exercise_type: exerciseName,
        category,
        overall_score: classification.overallScore,
        mediapipe_confidence: aggregated.avgConfidence,
        frames_filtered: aggregated.framesFiltered,
        video_quality_warning: aggregated.videoQualityWarning,
        equipment_constraint: classification.constraintApplied || null,
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
        mediapipe_frames: mediapipeResult.frames.map((f, i) => ({
          frame: i + 1,
          success: f.success,
          angles: f.success ? (f.world_angles || f.angles) : null,
          error: f.error || null,
        })),
        llm_report: llmReport || null,
      };
    }

    console.log(`[NFV] Pipeline completo! Score: ${biomechanicsResult.overall_score}/10`);

    // 8. Auto-generate corrective plan if problems detected
    const hasProblems = (biomechanicsResult.stabilizer_analysis as Array<{ variation: { classification: string } }>)
      ?.some(s => s.variation.classification !== 'firme');
    if (hasProblems) {
      try {
        const plan = await generateCorrectivePlanFromAnalysis(biomechanicsResult);
        if (plan && plan.semanas.length > 0) {
          biomechanicsResult.corrective_plan = plan;
          console.log(`[NFV] Plano corretivo auto-gerado: ${plan.semanas.length} semanas`);
        }
      } catch (planErr) {
        console.warn('[NFV] Auto-corrective plan failed:', planErr);
      }
    }

    // 9. Salvar no banco
    const { error: updateError } = await supabase
      .from(TABLE)
      .update({
        ai_analysis: biomechanicsResult,
        ai_analyzed_at: new Date().toISOString(),
        status: 'BIOMECHANICS_ANALYZED_V2',
        updated_at: new Date().toISOString(),
      })
      .eq('id', analysisId);

    if (updateError) {
      console.error('[NFV] Error updating:', updateError);
      return NextResponse.json({ error: 'Erro ao salvar analise' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      analysisId,
      pipeline: isV2 ? 'v2' : 'v1',
      score: biomechanicsResult.overall_score,
    });
  } catch (error: unknown) {
    console.error('[NFV] Analysis error:', error);
    if (analysisId) {
      await setAnalysisError(analysisId, error instanceof Error ? error.message : 'Erro interno');
    }
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  } finally {
    if (tempDir && fs.existsSync(tempDir)) {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch { /* cleanup */ }
    }
  }
}
