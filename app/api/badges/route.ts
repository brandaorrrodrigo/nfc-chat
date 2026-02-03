/**
 * API: Badges
 * GET /api/badges?userId=xxx - Buscar badges do usuário
 * POST /api/badges/check - Verificar e conceder badges
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserBadges, checkAndAwardBadges, getBadgeProgress } from '@/lib/badges/badge-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');

    if (!userId) {
      return NextResponse.json({ error: 'userId é obrigatório' }, { status: 400 });
    }

    if (action === 'progress') {
      const progress = await getBadgeProgress(userId);
      return NextResponse.json(progress);
    }

    const badges = await getUserBadges(userId);
    return NextResponse.json({ badges });
  } catch (error: any) {
    console.error('[Badges API GET] Error:', error);
    return NextResponse.json({ error: error.message || 'Erro interno' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId é obrigatório' }, { status: 400 });
    }

    const newBadges = await checkAndAwardBadges(userId);

    return NextResponse.json({
      success: true,
      newBadges,
      count: newBadges.length,
    });
  } catch (error: any) {
    console.error('[Badges API POST] Error:', error);
    return NextResponse.json({ error: error.message || 'Erro interno' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
