/**
 * API: Award FP
 * POST /api/fp/award
 * Registra ação e concede FP ao usuário
 */

import { NextRequest, NextResponse } from 'next/server';
import { awardFP } from '@/lib/fp/fp-service';
import { FPAction } from '@/lib/fp/fp-rules';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, action, relatedEntityType, relatedEntityId, description } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'userId e action são obrigatórios' },
        { status: 400 }
      );
    }

    const result = await awardFP(userId, action as FPAction, {
      relatedEntityType,
      relatedEntityId,
      description,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          reason: result.reason,
          blocked: result.blocked,
        },
        { status: result.blocked ? 429 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      amount: result.amount,
      newBalance: result.newBalance,
      transactionId: result.transactionId,
    });
  } catch (error: any) {
    console.error('[FP Award API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
