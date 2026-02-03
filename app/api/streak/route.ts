/**
 * API: Streak
 * GET /api/streak?userId=xxx - Buscar dados de streak
 * POST /api/streak - Atualizar streak no login
 */

import { NextRequest, NextResponse } from 'next/server';
import { getStreakData, updateStreakOnLogin } from '@/lib/streak/streak-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId é obrigatório' },
        { status: 400 }
      );
    }

    const streakData = await getStreakData(userId);

    return NextResponse.json(streakData);
  } catch (error: any) {
    console.error('[Streak API GET] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId é obrigatório' },
        { status: 400 }
      );
    }

    const result = await updateStreakOnLogin(userId);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[Streak API POST] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
