/**
 * API: Validate Referral Code
 * GET /api/referral/validate?code=NFCABC123
 *
 * Valida código de indicação
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { validateReferralCode } from '@/lib/referral/referral-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      );
    }

    // Validar código
    const result = await validateReferralCode(code);

    if (!result.valid) {
      return NextResponse.json({
        valid: false,
        reason: result.reason,
        message: getReasonMessage(result.reason),
      });
    }

    return NextResponse.json({
      valid: true,
      referral: {
        code: result.referral!.code,
        bonusFP: result.referral!.bonusFP,
        bonusDiscount: result.referral!.bonusDiscount,
      },
      message: 'Código válido',
    });
  } catch (error: any) {
    console.error('❌ Validate referral code error:', error);

    return NextResponse.json(
      {
        error: 'Failed to validate code',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

function getReasonMessage(reason?: string): string {
  switch (reason) {
    case 'code_not_found':
      return 'Código não encontrado';
    case 'code_expired':
      return 'Código expirado';
    case 'max_usage_reached':
      return 'Código atingiu limite de usos';
    default:
      return 'Código inválido';
  }
}
