/**
 * API: User Badge
 * GET /api/urgency/badge
 *
 * Obtém badge do usuário autenticado
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { getUserBadge, isEarlyAdopter } from '@/lib/urgency/urgency-service';

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

    const [badge, earlyAdopter] = await Promise.all([
      getUserBadge(userId),
      isEarlyAdopter(userId),
    ]);

    return NextResponse.json({
      success: true,
      badge,
      isEarlyAdopter: earlyAdopter,
    });
  } catch (error: any) {
    console.error('❌ Badge error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch badge',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
