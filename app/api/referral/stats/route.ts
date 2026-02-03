/**
 * API: Referral Stats
 * GET /api/referral/stats
 *
 * Estatísticas de indicações do usuário
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { getUserReferralStats } from '@/lib/referral/referral-service';

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

    // Buscar stats
    const stats = await getUserReferralStats(userId);

    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        rewards: {
          referrerFP: 50,
          refereeDiscount: 10,
        },
      },
    });
  } catch (error: any) {
    console.error('❌ Referral stats error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch stats',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
