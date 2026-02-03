/**
 * API: Coupon Stats
 * GET /api/coupons/stats?period=week
 *
 * Estatísticas de conversão de cupons
 * ADMIN ONLY
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { getConversionStats } from '@/lib/coupons/coupon-service';

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação de admin
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const period = (searchParams.get('period') || 'week') as 'day' | 'week' | 'month';

    console.log(`📊 Fetching coupon stats for period: ${period}`);

    // Obter estatísticas
    const stats = await getConversionStats(period);

    return NextResponse.json({
      success: true,
      period,
      stats,
    });
  } catch (error: any) {
    console.error('❌ Coupon stats error:', error);

    return NextResponse.json(
      {
        error: 'Erro ao obter estatísticas',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
