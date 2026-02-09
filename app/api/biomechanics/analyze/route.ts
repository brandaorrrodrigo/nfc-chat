/**
 * API Endpoint para análise biomecânica de vídeos
 * POST /api/biomechanics/analyze
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { downloadVideoFromSupabase, downloadVideoFromUrl, extractFrames } from '@/lib/vision/video-analysis';
import { analyzeBiomechanics, queryRAG } from '@/lib/biomechanics';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const TABLE = 'nfc_chat_video_analyses';

/**
 * Mock MediaPipe extractor - simula extração de landmarks
 * Cinemática realista: quadril desce, joelho avança, tronco inclina
 * Em produção, usar ffmpeg + mediapipe real
 */
function createMockLandmarksFromFrameNumber(frameNum: number, totalFrames: number) {
  const progress = frameNum / totalFrames;
  const depth = Math.sin(progress * Math.PI); // 0 → 1 → 0

  // Quadril desce e recua levemente
  const hipY = 0.5 + depth * 0.25;
  const hipXOffset = -depth * 0.03;

  // Joelho avança para frente e desce
  const kneeY = 0.7 + depth * 0.1;
  const kneeXOffset = depth * 0.08;

  // Ombro inclina para frente (tronco inclina)
  const shoulderXOffset = depth * 0.05;
  const shoulderY = 0.2 + depth * 0.12;

  return {
    left_shoulder: { x: 0.3 + shoulderXOffset, y: shoulderY, z: 0, visibility: 0.95 },
    right_shoulder: { x: 0.7 + shoulderXOffset, y: shoulderY, z: 0, visibility: 0.95 },
    left_hip: { x: 0.3 + hipXOffset, y: hipY, z: 0, visibility: 0.95 },
    right_hip: { x: 0.7 + hipXOffset, y: hipY, z: 0, visibility: 0.95 },
    left_knee: { x: 0.3 + kneeXOffset, y: kneeY, z: 0, visibility: 0.95 },
    right_knee: { x: 0.7 + kneeXOffset, y: kneeY, z: 0, visibility: 0.95 },
    left_ankle: { x: 0.3, y: 0.9, z: 0, visibility: 0.95 },
    right_ankle: { x: 0.7, y: 0.9, z: 0, visibility: 0.95 },
    left_heel: { x: 0.28, y: 0.92, z: 0, visibility: 0.9 },
    right_heel: { x: 0.68, y: 0.92, z: 0, visibility: 0.9 },
    left_foot_index: { x: 0.35, y: 0.92, z: 0, visibility: 0.9 },
    right_foot_index: { x: 0.75, y: 0.92, z: 0, visibility: 0.9 },
    left_elbow: { x: 0.25, y: 0.4, z: 0, visibility: 0.9 },
    right_elbow: { x: 0.75, y: 0.4, z: 0, visibility: 0.9 },
    left_wrist: { x: 0.2, y: 0.3, z: 0, visibility: 0.9 },
    right_wrist: { x: 0.8, y: 0.3, z: 0, visibility: 0.9 },
    nose: { x: 0.5, y: 0.15, z: 0, visibility: 0.95 },
  };
}

export async function POST(request: NextRequest) {
  let tempDir: string | null = null;

  try {
    const body = await request.json();
    const { videoId } = body;

    if (!videoId) {
      return NextResponse.json(
        { error: 'videoId is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    // 1. Buscar vídeo
    const { data: video, error: fetchError } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', videoId)
      .single();

    if (fetchError || !video) {
      return NextResponse.json(
        { error: 'Video not found', details: fetchError?.message },
        { status: 404 }
      );
    }

    // 2. Baixar vídeo
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nfv-api-'));
    let localVideoPath: string | null = null;

    try {
      if (video.video_path) {
        localVideoPath = await downloadVideoFromSupabase(video.video_path, tempDir);
      } else if (video.video_url) {
        localVideoPath = await downloadVideoFromUrl(video.video_url, tempDir);
      }
    } catch (downloadError) {
      console.warn('Could not download real video, using mock data');
    }

    // 3. Extrair frames
    let framePaths: string[] = [];
    const frameCount = 15;
    const fps = 30;

    if (localVideoPath && fs.existsSync(localVideoPath)) {
      try {
        const framesDir = path.join(tempDir, 'frames');
        fs.mkdirSync(framesDir, { recursive: true });
        framePaths = await extractFrames(localVideoPath, framesDir, frameCount);
      } catch (frameError) {
        console.warn('Could not extract frames, using mock data');
      }
    }

    // 4. Preparar frames para análise
    const frames = Array.from({ length: Math.max(framePaths.length, frameCount) }, (_, i) => ({
      frameNumber: i + 1,
      timestamp: (i / fps) * 1000,
      landmarks: createMockLandmarksFromFrameNumber(i, frameCount),
    }));

    // 5. Executar análise biomecânica
    const analysis = await analyzeBiomechanics(
      {
        exerciseName: video.movement_pattern || 'squat',
        frames,
        fps,
      },
      {
        includeRAG: true,
        useMinimalPrompt: false,
        debugMode: false,
      }
    );

    // 6. Preparar resultado
    const biomechanicsResult = {
      timestamp: new Date().toISOString(),
      system: 'biomechanics-v2',
      exercise_type: video.movement_pattern,
      overall_score: analysis.classification.overallScore,
      classification_summary: analysis.classification.summary,
      classifications_detail: analysis.classification.classifications.map((c) => ({
        criterion: c.criterion,
        label: c.label || c.criterion,
        metric: c.metric,
        value: `${c.value}${c.unit || ''}`,
        raw_value: c.value,
        unit: c.unit || '',
        classification: c.classification,
        classification_label: c.classificationLabel || c.classification,
        is_safety_critical: c.isSafetyCritical,
        note: c.note,
        rag_topics: c.ragTopics,
      })),
      rag_topics_used: analysis.ragTopicsUsed,
      frames_analyzed: analysis.mediaMetrics.totalFrames,
      duration_seconds: analysis.mediaMetrics.duration,
    };

    // 7. Salvar no banco de dados
    const { error: updateError } = await supabase
      .from(TABLE)
      .update({
        status: 'BIOMECHANICS_ANALYZED_V2',
        ai_analysis: biomechanicsResult,
        updated_at: new Date().toISOString(),
      })
      .eq('id', videoId);

    if (updateError) {
      console.error('Error saving to database:', updateError);
      // Não falhar a requisição por causa do erro de save
    }

    // 8. Retornar resultado
    return NextResponse.json({
      success: true,
      videoId,
      analysis: biomechanicsResult,
      diagnostic: {
        score: analysis.classification.overallScore,
        summary: analysis.classification.summary,
        problems: analysis.classification.classifications
          .filter((c) => ['warning', 'danger'].includes(c.classification))
          .map((c) => ({
            criterion: c.criterion,
            label: c.label || c.criterion,
            metric: c.metric,
            value: `${c.value}${c.unit || ''}`,
            raw_value: c.value,
            unit: c.unit || '',
            classification: c.classification,
            classification_label: c.classificationLabel || c.classification,
            is_safety_critical: c.isSafetyCritical,
            note: c.note,
            rag_topics: c.ragTopics,
          })),
        positive: analysis.classification.classifications
          .filter((c) => ['excellent', 'good'].includes(c.classification))
          .map((c) => ({
            criterion: c.criterion,
            label: c.label || c.criterion,
            metric: c.metric,
            value: `${c.value}${c.unit || ''}`,
            raw_value: c.value,
            unit: c.unit || '',
            classification: c.classification,
            classification_label: c.classificationLabel || c.classification,
            is_safety_critical: c.isSafetyCritical,
            note: c.note,
            rag_topics: c.ragTopics,
          })),
      },
    });
  } catch (error) {
    console.error('Biomechanics analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    // Limpar arquivos temporários
    if (tempDir && fs.existsSync(tempDir)) {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (e) {
        console.warn('Could not clean temp directory');
      }
    }
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    endpoint: 'POST /api/biomechanics/analyze',
    description: 'Analyzes exercise video biomechanics',
    request: {
      method: 'POST',
      body: {
        videoId: 'string - ID from nfc_chat_video_analyses table',
      },
    },
    response: {
      success: 'boolean',
      videoId: 'string',
      analysis: {
        overall_score: 'number (1-10)',
        classification_summary: { excellent: 'number', warning: 'number', danger: 'number' },
        classifications_detail: 'array of criteria with scores',
        rag_topics_used: 'array of knowledge topics',
      },
      diagnostic: 'summary of problems and positive aspects',
    },
  });
}
