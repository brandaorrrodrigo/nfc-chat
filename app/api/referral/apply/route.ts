/**
 * API: Apply Referral Code
 * POST /api/referral/apply
 *
 * Aplica código de indicação (quando novo usuário se registra)
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { applyReferralCode } from '@/lib/referral/referral-service';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Referral code is required' },
        { status: 400 }
      );
    }

    // Aplicar código
    const result = await applyReferralCode(code, userId);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          message: getErrorMessage(result.error),
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      reward: result.reward,
      message: `Código aplicado! Você ganhou ${result.reward!.refereeDiscount}% de desconto extra!`,
    });
  } catch (error: any) {
    console.error('❌ Apply referral code error:', error);

    return NextResponse.json(
      {
        error: 'Failed to apply code',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

function getErrorMessage(error?: string): string {
  switch (error) {
    case 'invalid_code':
      return 'Código inválido';
    case 'cannot_use_own_code':
      return 'Você não pode usar seu próprio código';
    case 'already_used_referral':
      return 'Você já usou um código de indicação';
    default:
      return 'Erro ao aplicar código';
  }
}
