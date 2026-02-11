/**
 * API Route: NFV Analysis - Trigger IA analise de video
 * POST - Iniciar analise por IA (Ollama llama3.2-vision)
 *
 * Fluxo: PENDING_AI -> PROCESSING -> AI_ANALYZED ou ERROR
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { analyzeExerciseVideo, checkVisionModelAvailable } from '@/lib/vision/video-analysis';

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

    // Buscar analise
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

    // Setar status PROCESSING antes de comecar
    await supabase
      .from(TABLE)
      .update({ status: 'PROCESSING' })
      .eq('id', analysisId);

    // Verificar se Vision Model esta disponivel
    const visionAvailable = await checkVisionModelAvailable();

    if (!visionAvailable) {
      console.log('[NFV] Vision model nao disponivel, setando ERROR');
      await setAnalysisError(analysisId, 'Servico de analise indisponivel. Ollama nao esta rodando ou nao tem modelo de visao.');
      return NextResponse.json({
        error: 'Servico de analise indisponivel',
      }, { status: 503 });
    }

    if (!analysis.video_url && !analysis.video_path) {
      await setAnalysisError(analysisId, 'Video nao encontrado no registro');
      return NextResponse.json({
        error: 'Video nao encontrado',
      }, { status: 400 });
    }

    // Analise real com Vision Model
    console.log(`[NFV] Iniciando analise Vision para ${analysisId}`);

    const visionResult = await analyzeExerciseVideo({
      videoUrl: analysis.video_url,
      videoPath: analysis.video_path,
      exerciseType: analysis.movement_pattern,
      focusAreas: ['tecnica', 'postura', 'amplitude', 'compensacoes'],
      framesCount: 6,
    });

    const aiAnalysis = {
      movement_pattern: analysis.movement_pattern,
      analysis_type: 'vision_model',
      timestamp: new Date().toISOString(),
      model: 'llama3.2-vision',

      overall_score: visionResult.overallScore,
      summary: visionResult.summary,
      key_observations: visionResult.technicalIssues.slice(0, 5),
      suggestions: visionResult.recommendations,
      requires_attention: visionResult.technicalIssues.filter(i =>
        i.toLowerCase().includes('grave') || i.toLowerCase().includes('severo')
      ),

      frames_analyzed: visionResult.frames.length,
      frame_scores: visionResult.frames.map(f => f.score),

      technical_details: {
        lowest_score_frame: Math.min(...visionResult.frames.map(f => f.score)),
        highest_score_frame: Math.max(...visionResult.frames.map(f => f.score)),
        total_issues: visionResult.technicalIssues.length,
      },
    };

    console.log(`[NFV] Analise completa (score: ${visionResult.overallScore.toFixed(1)}/10)`);

    // Atualizar registro com resultado
    const { data: updated, error: updateError } = await supabase
      .from(TABLE)
      .update({
        ai_analysis: aiAnalysis,
        ai_analyzed_at: new Date().toISOString(),
        status: 'AI_ANALYZED',
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
      aiResult: aiAnalysis,
    });
  } catch (error: any) {
    console.error('[NFV] Analysis POST error:', error);
    if (analysisId) {
      await setAnalysisError(analysisId, error.message || 'Erro interno na analise');
    }
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
