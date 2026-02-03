/**
 * API Route: NFV Analysis - Trigger IA pre-analise
 * POST - Iniciar analise por IA
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { getMovementAnalysisPrompt } from '@/lib/biomechanics/movement-patterns';

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

    // Gerar prompt para IA baseado no padrao de movimento
    const prompt = getMovementAnalysisPrompt(
      analysis.movement_pattern,
      analysis.user_description || ''
    );

    // Simular analise da IA (em producao, integrar com LLaVA/Ollama)
    const aiAnalysis = {
      movement_pattern: analysis.movement_pattern,
      analysis_type: 'automated',
      timestamp: new Date().toISOString(),
      prompt_used: prompt,

      // Pontos de analise baseados no padrao
      key_observations: [
        'Analise automatica do padrao de movimento',
        'Verificar alinhamento articular',
        'Avaliar cadeia cinetica',
      ],

      // Sugestoes gerais
      suggestions: [
        'Manter alinhamento neutro da coluna',
        'Verificar ativacao muscular correta',
        'Observar compensacoes durante o movimento',
      ],

      // Flags para revisao humana
      requires_attention: [],
      confidence_level: 'medium',

      // Nota: em producao, a IA analisaria frames do video
      note: 'Pre-analise automatica. Revisao humana pendente.',
    };

    // Atualizar registro
    const { data: updated, error: updateError } = await supabase
      .from(TABLE)
      .update({
        ai_analysis: aiAnalysis,
        ai_analyzed_at: new Date().toISOString(),
        ai_confidence: 0.6,
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
