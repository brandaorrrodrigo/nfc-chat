/**
 * API: POST /api/fp/redeem
 * Resgata FP por desconto (gera cupom)
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { spendFP, calculateDiscount } from '@/lib/fp/service';
import { FP_CONFIG } from '@/lib/fp/config';

interface RedeemRequest {
  amount: number;
}

export async function POST(request: NextRequest) {
  try {
    // Autenticação
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const body: RedeemRequest = await request.json();
    const { amount } = body;

    // Validações
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Quantidade inválida' },
        { status: 400 }
      );
    }

    if (amount < FP_CONFIG.MIN_FP_TO_REDEEM) {
      return NextResponse.json({
        success: false,
        error: `Mínimo de ${FP_CONFIG.MIN_FP_TO_REDEEM} FP para resgatar`,
        minRequired: FP_CONFIG.MIN_FP_TO_REDEEM,
      });
    }

    const result = await spendFP(session.user.id, amount);

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.reason === 'insufficient_balance'
          ? 'Saldo insuficiente'
          : 'Não foi possível processar o resgate',
        reason: result.reason,
      });
    }

    return NextResponse.json({
      success: true,
      fpSpent: result.fpSpent,
      newBalance: result.newBalance,
      discountPercent: result.discountPercent,
      couponCode: result.couponCode,
      message: `Cupom de ${result.discountPercent}% criado com sucesso!`,
    });
  } catch (error) {
    console.error('[FP Redeem] Erro:', error);
    return NextResponse.json(
      { error: 'Erro interno ao resgatar FP' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/fp/redeem - Simula quanto desconto o usuário teria
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const amount = parseInt(url.searchParams.get('amount') || '0', 10);

    if (amount <= 0) {
      return NextResponse.json({
        discountPercent: 0,
        fpRequired: FP_CONFIG.MIN_FP_TO_REDEEM,
        fpPerPercent: FP_CONFIG.FP_PER_PERCENT,
        maxDiscount: FP_CONFIG.MAX_DISCOUNT_PERCENT,
      });
    }

    const discountPercent = calculateDiscount(amount);

    return NextResponse.json({
      amount,
      discountPercent,
      fpPerPercent: FP_CONFIG.FP_PER_PERCENT,
      maxDiscount: FP_CONFIG.MAX_DISCOUNT_PERCENT,
    });
  } catch (error) {
    console.error('[FP Redeem Preview] Erro:', error);
    return NextResponse.json(
      { error: 'Erro interno' },
      { status: 500 }
    );
  }
}
