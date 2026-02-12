/**
 * API Endpoint para análise biomecânica de vídeos
 * POST /api/biomechanics/analyze
 *
 * Pipeline REAL (v4 — MediaPipe):
 * 1. Baixa vídeo do Supabase Storage
 * 2. Extrai frames com ffmpeg
 * 3. Analisa cada frame com MediaPipe Pose (Python) — ângulos REAIS
 * 4. Classifica Motor vs Stabilizer (V2) ou categoria genérica (V1 fallback)
 * 5. Gera relatório com Ollama TEXT (llama3.1) + RAG
 *
 * NÃO usa Ollama Vision para extração de ângulos.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { downloadVideoFromSupabase, downloadVideoFromUrl, extractFrames } from '@/lib/vision/video-analysis';
import {
  analyzeFramesWithMediaPipe,
  aggregateMediaPipeFrames,
  mediapipeToMetricsV2,
  mediapipeToMetricsV1,
} from '@/lib/biomechanics/mediapipe-bridge';
import {
  classifyMetrics,
  extractAllRAGTopics,
} from '@/lib/biomechanics/criteria-classifier';
import {
  getCategoryTemplate,
  getExerciseCategory,
} from '@/lib/biomechanics/category-templates';
import { buildPrompt } from '@/lib/biomechanics/prompt-builder';
import { sendPromptToOllama } from '@/lib/biomechanics/llm-bridge';
import { queryRAG } from '@/lib/biomechanics/biomechanics-rag';
import { getExerciseTemplateV2 } from '@/lib/biomechanics/exercise-templates-v2';
import { classifyExerciseV2, extractV2RAGTopics } from '@/lib/biomechanics/classifier-v2';
import { buildPromptV2 } from '@/lib/biomechanics/prompt-builder';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const TABLE = 'nfc_chat_video_analyses';

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

    // 4. Analisar frames com MediaPipe (Python) — ângulos REAIS
    console.log(`[Biomechanics] Analyzing ${framePaths.length} frames with MediaPipe Pose...`);
    const mediapipeResult = await analyzeFramesWithMediaPipe(framePaths);

    if (!mediapipeResult.success || mediapipeResult.frames_processed === 0) {
      console.error('[Biomechanics] MediaPipe failed:', mediapipeResult.error);
      return NextResponse.json(
        { error: 'MediaPipe analysis failed', details: mediapipeResult.error },
        { status: 500 },
      );
    }

    console.log(`[Biomechanics] MediaPipe processed ${mediapipeResult.frames_processed}/${mediapipeResult.frames_total} frames`);

    // 5. Agregar resultados dos frames
    const aggregated = aggregateMediaPipeFrames(mediapipeResult);

    console.log(`[Biomechanics] Aggregated: confidence=${aggregated.avgConfidence}, frames_used=${aggregated.framesProcessed} (filtered_out=${aggregated.framesFiltered}), hip_avg_min=${aggregated.minAngles.hip_avg}°, knee_L_min=${aggregated.minAngles.knee_left}°, trunk=${aggregated.avgAngles.trunk_inclination}°`);
    if (aggregated.videoQualityWarning) {
      console.log(`[Biomechanics] ⚠ Video quality warning: ${aggregated.videoQualityWarning}`);
    }

    // 6. Log dos ângulos de cada frame
    for (let i = 0; i < mediapipeResult.frames.length; i++) {
      const f = mediapipeResult.frames[i];
      if (f.success) {
        const a = f.world_angles || f.angles;
        console.log(`[Biomechanics] Frame ${i + 1}: knee_L=${a.knee_left}° knee_R=${a.knee_right}° hip=${a.hip_avg}° trunk=${a.trunk_inclination}° valgus_L=${a.knee_valgus_left_cm}cm conf=${a.confidence}`);
      } else {
        console.log(`[Biomechanics] Frame ${i + 1}: FAILED - ${f.error}`);
      }
    }

    // 7. Tentar V2 (Motor/Estabilizador) primeiro, fallback para V1
    const templateV2 = getExerciseTemplateV2(exerciseName);
    const isV2 = !!templateV2;

    if (isV2) {
      console.log(`[Biomechanics] V2 template found: ${templateV2!.exerciseId} (${templateV2!.exerciseName})`);
    } else {
      console.log(`[Biomechanics] No V2 template for "${exerciseName}", using V1 (${category})`);
    }

    let biomechanicsResult: any;
    let llmReport: any = null;
    let responsePayload: any;

    if (isV2 && templateV2) {
      // ========== PIPELINE V2: Motor vs Estabilizador ==========

      // 7a. Mapear MediaPipe → métricas V2
      const { motorMetrics, stabilizerMetrics } = mediapipeToMetricsV2(aggregated, templateV2);

      console.log(`[Biomechanics V2] Motor metrics: ${motorMetrics.map(m => `${m.joint}=${m.romValue}${m.romUnit}`).join(', ')}`);
      console.log(`[Biomechanics V2] Stabilizer metrics: ${stabilizerMetrics.map(s => `${s.joint}=${s.variationValue}${s.unit}`).join(', ')}`);

      // 8a. Classificar V2
      const resultV2 = classifyExerciseV2(motorMetrics, stabilizerMetrics, templateV2);

      console.log(`[Biomechanics V2] Score: ${resultV2.overallScore}/10 (Motor: ${resultV2.motorScore}, Stabilizer: ${resultV2.stabilizerScore})`);

      // 9a. RAG para articulações com problema
      const ragTopics = extractV2RAGTopics(resultV2);
      let ragContexts: any[] = [];
      if (ragTopics.length > 0) {
        try {
          const ragResults = await queryRAG(ragTopics);
          ragContexts = ragResults || [];
        } catch {
          console.warn('[Biomechanics V2] RAG query failed, continuing without');
        }
      }

      // 10a. Build prompt V2
      const prompt = buildPromptV2({
        result: resultV2,
        template: templateV2,
        ragContext: ragContexts,
        videoMetadata: { frameCount: framePaths.length },
      });

      // 11a. Gerar relatório via Ollama TEXT (llama3.1, NÃO vision)
      try {
        llmReport = await sendPromptToOllama(prompt, null, { timeoutMs: 180000 });
        console.log('[Biomechanics V2] Relatório Ollama TEXT gerado com sucesso');
      } catch (llmError: any) {
        console.warn('[Biomechanics V2] Ollama indisponível:', llmError.message);
      }

      // 12a. Preparar resultado V2
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
        equipment_constraint: equipmentConstraint || null,

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

        // V1-compatible fields for frontend backward compat
        classifications_detail: [
          ...resultV2.motorAnalysis.map(m => ({
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
            note: `Motor: ${m.movement}`,
            rag_topics: m.ragTopics,
          })),
          ...resultV2.stabilizerAnalysis.map(s => ({
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

      responsePayload = {
        success: true,
        videoId,
        pipeline: 'v2',
        angle_source: 'mediapipe',
        video_quality_warning: aggregated.videoQualityWarning,
        analysis: biomechanicsResult,
        diagnostic: {
          score: resultV2.overallScore,
          motor_score: resultV2.motorScore,
          stabilizer_score: resultV2.stabilizerScore,
          summary: resultV2.summary,
          motor_problems: resultV2.motorAnalysis
            .filter(m => m.rom.classification === 'warning' || m.rom.classification === 'danger'),
          stabilizer_problems: resultV2.stabilizerAnalysis
            .filter(s => s.variation.classification !== 'firme'),
          positive_motors: resultV2.motorAnalysis
            .filter(m => m.rom.classification === 'excellent' || m.rom.classification === 'good'),
          stable_joints: resultV2.stabilizerAnalysis
            .filter(s => s.variation.classification === 'firme'),
        },
        report: llmReport,
      };

    } else {
      // ========== PIPELINE V1: Categoria genérica (fallback) ==========

      // 7b. Mapear MediaPipe → MetricValue[] V1
      const metrics = mediapipeToMetricsV1(aggregated, category);

      console.log(`[Biomechanics V1] Metrics for ${category}:`);
      for (const m of metrics) {
        console.log(`  ${m.metric}: ${m.value}${m.unit || ''}`);
      }

      // 8b. Classificar contra template
      const classification = classifyMetrics(
        metrics,
        template,
        exerciseName,
        equipmentConstraint || undefined,
      );

      console.log(`[Biomechanics V1] Score: ${classification.overallScore.toFixed(1)}/10`);

      // 9b. Extrair tópicos RAG
      const ragTopics = extractAllRAGTopics(classification);
      let ragContexts: any[] = [];
      if (ragTopics.length > 0) {
        try {
          const ragResults = await queryRAG(ragTopics);
          ragContexts = ragResults || [];
        } catch {
          console.warn('[Biomechanics V1] RAG query failed, continuing without');
        }
      }

      // 10b. Build prompt V1
      const prompt = buildPrompt({
        result: classification,
        template,
        exerciseName,
        ragContext: ragContexts,
        equipmentConstraint: equipmentConstraint || undefined,
        videoMetadata: { duration: 0, frameCount: framePaths.length, fps: 30 },
      });

      // 11b. Gerar relatório via Ollama TEXT
      try {
        llmReport = await sendPromptToOllama(prompt, classification, { timeoutMs: 180000 });
        console.log('[Biomechanics V1] Relatório Ollama TEXT gerado com sucesso');
      } catch (llmError: any) {
        console.warn('[Biomechanics V1] Ollama indisponível:', llmError.message);
      }

      // 12b. Preparar resultado V1
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
        mediapipe_frames: mediapipeResult.frames.map((f, i) => ({
          frame: i + 1,
          success: f.success,
          angles: f.success ? (f.world_angles || f.angles) : null,
          error: f.error || null,
        })),
        llm_report: llmReport || null,
      };

      responsePayload = {
        success: true,
        videoId,
        pipeline: 'v1',
        angle_source: 'mediapipe',
        video_quality_warning: aggregated.videoQualityWarning,
        analysis: biomechanicsResult,
        diagnostic: {
          score: classification.overallScore,
          summary: classification.summary,
          problems: classification.classifications
            .filter(c => ['warning', 'danger'].includes(c.classification) && !c.isInformativeOnly),
          positive: classification.classifications
            .filter(c => ['excellent', 'good'].includes(c.classification)),
        },
        report: llmReport,
      };
    }

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
    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error('[Biomechanics] Analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
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
  const { listV2Exercises } = await import('@/lib/biomechanics/exercise-templates-v2');
  return NextResponse.json({
    endpoint: 'POST /api/biomechanics/analyze',
    version: 'v4-mediapipe',
    description: 'Analyzes exercise video biomechanics using MediaPipe Pose for angle extraction + Ollama TEXT for report generation',
    pipeline: [
      '1. Download video from Supabase Storage',
      '2. Extract frames with ffmpeg',
      '3. Analyze each frame with MediaPipe Pose (Python, model=heavy)',
      '4. Aggregate angles across frames (min/max/avg)',
      '5a. V2: Map to motor/stabilizer metrics → classify → Motor 60% + Stabilizer 40%',
      '5b. V1 fallback: Map to category metrics → classify against generic ranges',
      '6. Generate report with Ollama TEXT (llama3.1) + RAG',
    ],
    angle_source: 'MediaPipe Pose Landmarker (heavy model, 33 landmarks, 3D world coordinates)',
    v2_exercises: listV2Exercises(),
    categories_v1: ['squat', 'hinge', 'pull', 'horizontal_press', 'vertical_press', 'unilateral', 'core'],
    request: {
      method: 'POST',
      body: {
        videoId: 'string - ID from nfc_chat_video_analyses table',
        equipmentConstraint: 'optional: none | safety_bars | machine_guided | space_limited | pain_limited | rehab',
      },
    },
  });
}
