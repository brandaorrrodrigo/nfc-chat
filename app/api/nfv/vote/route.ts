/**
 * API Route: NFV Vote
 * POST - Votar util/nao util em uma analise
 */

import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase';
import { voteAnalysis, getAnalysis } from '@/lib/biomechanics/video-analysis-service';
import { awardFP } from '@/lib/fp/service';
import { FP_CONFIG } from '@/lib/fp/config';

export async function POST(req: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const body = await req.json();
    const { analysisId, userId, voteType } = body;

    if (!analysisId || !userId || !voteType) {
      return NextResponse.json({ error: 'analysisId, userId e voteType obrigatorios' }, { status: 400 });
    }

    if (!['helpful', 'not_helpful'].includes(voteType)) {
      return NextResponse.json({ error: 'voteType deve ser helpful ou not_helpful' }, { status: 400 });
    }

    // Nao permitir votar na propria analise
    const { data: analysis } = await getAnalysis(analysisId);
    if (analysis && analysis.user_id === userId) {
      return NextResponse.json({ error: 'Nao pode votar na propria analise' }, { status: 400 });
    }

    const result = await voteAnalysis(analysisId, userId, voteType);

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Erro ao votar' }, { status: 500 });
    }

    // Recompensar autor do video com FP quando voto e helpful
    if (voteType === 'helpful' && analysis) {
      await awardFP(analysis.user_id, FP_CONFIG.ACTIONS.HELPFUL_VOTE, {
        analysis_id: analysisId,
        voter_id: userId,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[NFV] Vote POST error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
