/**
 * API: User Badges
 * GET /api/gamification/badges
 *
 * Obtém badges conquistados do usuário
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { getUserBadges } from '@/lib/gamification/progression-service';

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id || session.user.email;

    // Buscar badges
    const badges = await getUserBadges(userId);

    return NextResponse.json({
      success: true,
      badges,
      total: badges.length,
    });
  } catch (error: any) {
    console.error('❌ Badges error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch badges',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
