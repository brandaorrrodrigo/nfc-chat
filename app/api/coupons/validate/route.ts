/**
 * API: Validate Coupon
 * GET /api/coupons/validate?code=NFCMON8A7B2C
 *
 * Valida cupom por código
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { validateCoupon } from '@/lib/coupons/coupon-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'Código do cupom é obrigatório' },
        { status: 400 }
      );
    }

    console.log(`🔍 Validating coupon: ${code}`);

    // Validar cupom
    const result = await validateCoupon(code);

    if (!result.valid) {
      return NextResponse.json({
        valid: false,
        reason: result.reason,
        message: getReasonMessage(result.reason),
      });
    }

    return NextResponse.json({
      valid: true,
      coupon: result.coupon,
      message: 'Cupom válido',
    });
  } catch (error: any) {
    console.error('❌ Validate coupon error:', error);

    return NextResponse.json(
      {
        error: 'Erro ao validar cupom',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

function getReasonMessage(reason?: string): string {
  switch (reason) {
    case 'coupon_not_found':
      return 'Cupom não encontrado';
    case 'coupon_used':
      return 'Cupom já foi utilizado';
    case 'coupon_expired':
      return 'Cupom expirado';
    case 'validation_error':
      return 'Erro ao validar cupom';
    default:
      return 'Cupom inválido';
  }
}
