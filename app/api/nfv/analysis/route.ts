/**
 * API Route: NFV Analysis - Trigger IA pre-analise
 * POST - Iniciar analise por IA
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { getMovementAnalysisPrompt } from '@/lib/biomechanics/movement-patterns';
import { analyzeExerciseVideo, checkVisionModelAvailable } from '@/lib/vision/video-analysis';

const TABLE = 'nfc_chat_video_analyses';

export async function POST(req: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const body = await req.json();
    const { analysisId } = body;

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

    if (analysis.status !== 'PENDING_AI') {
      return NextResponse.json({ error: 'Analise ja foi processada' }, { status: 400 });
    }

    // Verificar se Vision Model está disponível
    const visionAvailable = await checkVisionModelAvailable();

    let aiAnalysis: any;

    if (visionAvailable && (analysis.video_url || analysis.video_path)) {
      // 🎥 ANÁLISE REAL COM VISION MODEL (Ollama llama3.2-vision)
      console.log('🎥 Starting vision-based analysis with Ollama...');
      console.log(`   Video URL: ${analysis.video_url}`);
      console.log(`   Video Path: ${analysis.video_path}`);

      try {
        const visionResult = await analyzeExerciseVideo({
          videoUrl: analysis.video_url, // URL do Supabase Storage
          videoPath: analysis.video_path, // Path no bucket (fallback)
          exerciseType: analysis.movement_pattern,
          focusAreas: ['técnica', 'postura', 'amplitude', 'compensações'],
          framesCount: 6,
        });

        aiAnalysis = {
          movement_pattern: analysis.movement_pattern,
          analysis_type: 'vision_model',
          timestamp: new Date().toISOString(),
          model: 'llama3.2-vision',

          // Dados da análise de vídeo
          overall_score: visionResult.overallScore,
          summary: visionResult.summary,
          key_observations: visionResult.technicalIssues.slice(0, 5),
          suggestions: visionResult.recommendations,
          requires_attention: visionResult.technicalIssues.filter(i =>
            i.toLowerCase().includes('grave') || i.toLowerCase().includes('severo')
          ),

          // Análise frame-by-frame
          frames_analyzed: visionResult.frames.length,
          frame_scores: visionResult.frames.map(f => f.score),
          confidence_level: visionResult.overallScore >= 7 ? 'high' : 'medium',

          // Detalhes técnicos
          technical_details: {
            lowest_score_frame: Math.min(...visionResult.frames.map(f => f.score)),
            highest_score_frame: Math.max(...visionResult.frames.map(f => f.score)),
            total_issues: visionResult.technicalIssues.length,
          },
        };

        console.log(`✅ Vision analysis complete (score: ${visionResult.overallScore.toFixed(1)}/10)`);
      } catch (visionError) {
        console.error('Vision analysis failed, using fallback:', visionError);
        aiAnalysis = createFallbackAnalysis(analysis);
      }
    } else {
      // FALLBACK: Análise baseada em prompt
      console.log('⚠️ Vision model not available, using prompt-based analysis');
      aiAnalysis = createFallbackAnalysis(analysis);
    }

    // Calcular confiança baseada no tipo de análise
    const aiConfidence = aiAnalysis.analysis_type === 'vision_model'
      ? aiAnalysis.overall_score / 10
      : 0.5;

    // Atualizar registro
    const { data: updated, error: updateError } = await supabase
      .from(TABLE)
      .update({
        ai_analysis: aiAnalysis,
        ai_analyzed_at: new Date().toISOString(),
        ai_confidence: aiConfidence,
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
  } catch (error) {
    console.error('[NFV] Analysis POST error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

/**
 * Cria análise fallback quando Vision Model não está disponível
 */
function createFallbackAnalysis(analysis: any) {
  const prompt = getMovementAnalysisPrompt(
    analysis.movement_pattern,
    analysis.user_description || ''
  );

  return {
    movement_pattern: analysis.movement_pattern,
    analysis_type: 'prompt_based',
    timestamp: new Date().toISOString(),
    prompt_used: prompt,

    // Pontos de análise baseados no padrão
    key_observations: [
      'Análise automática do padrão de movimento',
      'Verificar alinhamento articular',
      'Avaliar cadeia cinética',
    ],

    // Sugestões gerais
    suggestions: [
      'Manter alinhamento neutro da coluna',
      'Verificar ativação muscular correta',
      'Observar compensações durante o movimento',
    ],

    // Flags para revisão humana
    requires_attention: [],
    confidence_level: 'low',

    // Nota
    note: 'Pré-análise baseada em prompt. Recomenda-se análise com Vision Model para maior precisão.',
  };
}
