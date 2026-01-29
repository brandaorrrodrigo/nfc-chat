/**
 * API: POST /api/fp/earn
 * Registra ganho de FP por ação do usuário
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { awardFP } from '@/lib/fp/service';
import { FP_CONFIG, FPAction } from '@/lib/fp/config';

interface EarnRequest {
  action: FPAction;
  metadata?: {
    messageLength?: number;
    roomId?: string;
    [key: string]: unknown;
  };
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

    const body: EarnRequest = await request.json();
    const { action, metadata } = body;

    // Valida ação
    const validActions = Object.values(FP_CONFIG.ACTIONS);
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: 'Ação inválida' },
        { status: 400 }
      );
    }

    // Determina tipo de mensagem baseado no tamanho
    let finalAction = action;
    if (action === FP_CONFIG.ACTIONS.MESSAGE && metadata?.messageLength) {
      if (metadata.messageLength >= 100) {
        finalAction = FP_CONFIG.ACTIONS.MESSAGE_LONG;
      } else if (metadata.messageLength < FP_CONFIG.MIN_MESSAGE_LENGTH) {
        return NextResponse.json({
          success: false,
          fpEarned: 0,
          reason: 'message_too_short',
        });
      }
    }

    const result = await awardFP(session.user.id, finalAction, undefined, metadata);

    return NextResponse.json({
      success: result.success,
      fpEarned: result.fpEarned,
      newBalance: result.newBalance,
      streak: result.streak,
      reason: result.reason,
    });
  } catch (error) {
    console.error('[FP Earn] Erro:', error);
    return NextResponse.json(
      { error: 'Erro interno ao registrar FP' },
      { status: 500 }
    );
  }
}
