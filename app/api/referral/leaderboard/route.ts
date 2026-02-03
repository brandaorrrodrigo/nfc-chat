/**
 * API: Referral Leaderboard
 * GET /api/referral/leaderboard?limit=10
 *
 * Top indicadores (ranking)
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getTopReferrers } from '@/lib/referral/referral-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Buscar top referrers
    const topReferrers = await getTopReferrers(limit);

    return NextResponse.json({
      success: true,
      topReferrers,
      total: topReferrers.length,
    });
  } catch (error: any) {
    console.error('❌ Referral leaderboard error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch leaderboard',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
