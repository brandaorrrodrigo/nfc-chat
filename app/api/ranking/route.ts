/**
 * API: Ranking/Leaderboard
 * GET /api/ranking?type=fp_total&limit=10
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRanking, getUserRank, RankingType } from '@/lib/ranking/leaderboard-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = (searchParams.get('type') || 'fp_total') as RankingType;
    const limit = parseInt(searchParams.get('limit') || '10');
    const userId = searchParams.get('userId');

    const ranking = await getRanking(type, limit);

    let userRank: number | null = null;
    if (userId) {
      userRank = await getUserRank(userId, type);
    }

    return NextResponse.json({
      type,
      ranking,
      userRank,
    });
  } catch (error: any) {
    console.error('[Ranking API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
