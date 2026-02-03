/**
 * API: Redeem Coupon
 * POST /api/coupons/redeem
 *
 * Consome FP e gera cupom de desconto
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { redeemCoupon } from '@/lib/coupons/coupon-service';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Autenticação necessária' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tierId, arenaSource } = body;

    if (!tierId || typeof tierId !== 'string') {
      return NextResponse.json(
        { error: 'tierId é obrigatório' },
        { status: 400 }
      );
    }

    const userId = (session.user as any).id || session.user.email;

    console.log(`🎟️ Redeem request: ${tierId} for user ${userId}`);

    // Resgatar cupom
    const result = await redeemCoupon(userId, tierId, arenaSource);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          reason: result.reason,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      coupon: result.coupon,
      message: 'Cupom resgatado com sucesso!',
    });
  } catch (error: any) {
    console.error('❌ Redeem error:', error);

    return NextResponse.json(
      {
        error: 'Erro ao resgatar cupom',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
