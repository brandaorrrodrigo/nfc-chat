/**
 * API: Badges
 * Path: /api/badges
 *
 * GET - Retorna badges do usuario com status
 * POST - Verifica e desbloqueia novas badges
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import {
  getBadgesWithStatus,
  checkAndUnlockBadges,
  ALL_BADGES,
} from '@/lib/badges';

// ==========================================
// GET - Listar badges do usuario
// ==========================================

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    // Pegar userId da query ou sessao
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId obrigatorio' },
        { status: 400 }
      );
    }

    // Buscar badges com status
    const badges = await getBadgesWithStatus(userId);

    // Separar por categoria
    const byCategory = badges.reduce((acc, b) => {
      const cat = b.badge.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(b);
      return acc;
    }, {} as Record<string, typeof badges>);

    // Estatisticas
    const unlockedCount = badges.filter(b => b.unlocked).length;
    const totalCount = badges.length;

    return NextResponse.json({
      success: true,
      badges,
      byCategory,
      stats: {
        unlocked: unlockedCount,
        total: totalCount,
        percentage: Math.round((unlockedCount / totalCount) * 100),
      },
    });

  } catch (error: any) {
    console.error('[Badges GET Error]', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar badges', details: error.message },
      { status: 500 }
    );
  }
}

// ==========================================
// POST - Verificar e desbloquear badges
// ==========================================

interface CheckBadgesBody {
  userId: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    const body: CheckBadgesBody = await request.json();

    const userId = body.userId || session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId obrigatorio' },
        { status: 400 }
      );
    }

    // Verificar e desbloquear novas badges
    const result = await checkAndUnlockBadges(userId);

    return NextResponse.json({
      success: true,
      newBadges: result.newBadges.map(b => ({
        id: b.id,
        name: b.name,
        description: b.description,
        icon: b.icon,
        category: b.category,
        rarity: b.rarity,
        fpReward: b.fpReward,
      })),
      totalFPRewarded: result.totalFPRewarded,
      hasNewBadges: result.newBadges.length > 0,
    });

  } catch (error: any) {
    console.error('[Badges POST Error]', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao verificar badges', details: error.message },
      { status: 500 }
    );
  }
}
