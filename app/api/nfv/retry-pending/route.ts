/**
 * API Route: Retry stuck video analyses
 * GET /api/nfv/retry-pending
 *
 * Busca videos com status PENDING_AI (>5min) ou ERROR e retrigger analise.
 * Pode ser chamado por cron, manualmente, ou via webhook.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

const TABLE = 'nfc_chat_video_analyses';
const STUCK_THRESHOLD_MINUTES = 5;
const MAX_RETRIES_PER_RUN = 5;

export async function GET(req: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    // Auth opcional via header ou query param
    const authToken = req.headers.get('x-cron-secret') ||
                      new URL(req.url).searchParams.get('secret');
    const expectedSecret = process.env.CRON_SECRET;
    if (expectedSecret && authToken !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabase();
    const cutoffTime = new Date(Date.now() - STUCK_THRESHOLD_MINUTES * 60 * 1000).toISOString();

    // Buscar videos PENDING_AI travados (mais antigos que threshold)
    const { data: pendingVideos } = await supabase
      .from(TABLE)
      .select('id, status, created_at')
      .eq('status', 'PENDING_AI')
      .lt('created_at', cutoffTime)
      .order('created_at', { ascending: true })
      .limit(MAX_RETRIES_PER_RUN);

    // Buscar videos ERROR para retry
    const { data: errorVideos } = await supabase
      .from(TABLE)
      .select('id, status, created_at')
      .eq('status', 'ERROR')
      .order('created_at', { ascending: true })
      .limit(MAX_RETRIES_PER_RUN);

    const videosToRetry = [
      ...(pendingVideos || []),
      ...(errorVideos || []),
    ].slice(0, MAX_RETRIES_PER_RUN);

    if (videosToRetry.length === 0) {
      return NextResponse.json({
        message: 'Nenhum video pendente para reprocessar',
        checked_at: new Date().toISOString(),
      });
    }

    const baseUrl = process.env.NEXTAUTH_URL ||
                   process.env.NEXT_PUBLIC_APP_URL ||
                   'http://localhost:3000';

    const results: Array<{
      id: string;
      previousStatus: string;
      retrySuccess: boolean;
      newScore?: number;
      error?: string;
    }> = [];

    for (const video of videosToRetry) {
      // Resetar para PENDING_AI antes de retrigger
      await supabase
        .from(TABLE)
        .update({ status: 'PENDING_AI', ai_analysis: null })
        .eq('id', video.id);

      // Trigger analise
      try {
        const response = await fetch(`${baseUrl}/api/nfv/analysis`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ analysisId: video.id }),
        });

        const data = await response.json().catch(() => ({}));
        results.push({
          id: video.id,
          previousStatus: video.status,
          retrySuccess: response.ok,
          newScore: data.aiResult?.overall_score,
        });
      } catch (err: any) {
        results.push({
          id: video.id,
          previousStatus: video.status,
          retrySuccess: false,
          error: err.message,
        });
      }
    }

    return NextResponse.json({
      retried: results.length,
      results,
      checked_at: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[NFV] retry-pending error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
