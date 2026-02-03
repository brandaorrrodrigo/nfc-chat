/**
 * API: List Coupons
 * GET /api/coupons/list?status=ACTIVE&limit=50
 *
 * Lista cupons do usuário autenticado
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { getUserCoupons } from '@/lib/coupons/coupon-service';

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Autenticação necessária' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as 'ACTIVE' | 'USED' | 'EXPIRED' | null;
    const limit = parseInt(searchParams.get('limit') || '50');

    const userId = (session.user as any).id || session.user.email;

    // Buscar cupons
    const coupons = await getUserCoupons(userId, {
      status: status || undefined,
      limit,
    });

    return NextResponse.json({
      success: true,
      coupons,
      total: coupons.length,
    });
  } catch (error: any) {
    console.error('❌ List coupons error:', error);

    return NextResponse.json(
      {
        error: 'Erro ao listar cupons',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
