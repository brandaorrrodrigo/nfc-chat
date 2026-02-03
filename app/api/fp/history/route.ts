/**
 * API: FP History
 * GET /api/fp/history?userId=xxx&limit=50
 */

import { NextRequest, NextResponse } from 'next/server';
import { getFPHistory } from '@/lib/fp/fp-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!userId) {
      return NextResponse.json({ error: 'userId é obrigatório' }, { status: 400 });
    }

    const history = await getFPHistory(userId, limit);
    return NextResponse.json(history);
  } catch (error: any) {
    console.error('[FP History API] Error:', error);
    return NextResponse.json({ error: error.message || 'Erro interno' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
