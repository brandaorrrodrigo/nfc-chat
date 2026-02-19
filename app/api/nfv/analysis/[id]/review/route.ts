/**
 * API Route: NFV Analysis Review
 * POST - Admin aprovar/rejeitar/solicitar revisao
 */

import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase';
import { approveAnalysis, rejectAnalysis, requestRevision } from '@/lib/biomechanics/video-analysis-service';
import { awardFP } from '@/lib/fp/service';
import { FP_CONFIG } from '@/lib/fp/config';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { id } = await params;
    const body = await req.json();
    const { action, reviewerId, publishedAnalysis, notes, reason } = body;

    if (!action || !reviewerId) {
      return NextResponse.json({ error: 'action e reviewerId obrigatorios' }, { status: 400 });
    }

    let result;

    switch (action) {
      case 'approve': {
        if (!publishedAnalysis) {
          return NextResponse.json({ error: 'publishedAnalysis obrigatorio para aprovacao' }, { status: 400 });
        }

        result = await approveAnalysis(id, reviewerId, publishedAnalysis, notes);

        // Recompensar autor com FP
        if (result.success) {
          // Buscar userId do autor
          const { getAnalysis } = await import('@/lib/biomechanics/video-analysis-service');
          const { data: analysis } = await getAnalysis(id);
          if (analysis) {
            await awardFP(analysis.user_id, FP_CONFIG.ACTIONS.VIDEO_PUBLISHED, undefined, {
              analysis_id: id,
              arena_slug: analysis.arena_slug,
            });
          }
        }
        break;
      }

      case 'reject': {
        if (!reason) {
          return NextResponse.json({ error: 'reason obrigatorio para rejeicao' }, { status: 400 });
        }
        result = await rejectAnalysis(id, reviewerId, reason);
        break;
      }

      case 'revision': {
        if (!notes) {
          return NextResponse.json({ error: 'notes obrigatorio para revisao' }, { status: 400 });
        }
        result = await requestRevision(id, reviewerId, notes);
        break;
      }

      default:
        return NextResponse.json({ error: 'action invalida (approve/reject/revision)' }, { status: 400 });
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Erro na revisao' }, { status: 500 });
    }

    return NextResponse.json({ success: true, action });
  } catch (error) {
    console.error('[NFV] Review POST error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
