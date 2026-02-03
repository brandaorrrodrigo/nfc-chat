/**
 * API: POST /api/fp/earn
 * Registra ganho de FP por ação do usuário
 *
 * REFATORADO v2.0:
 * - Detecta perguntas (?) automaticamente → +5 FP
 * - Mensagem comum → +2 FP
 * - Mensagem longa (100+ chars) → +3 FP bônus adicional
 * - Limite diário: 30 FP
 * - Cooldown: 1 min entre mensagens
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { awardFP } from '@/lib/fp/service';
import { FP_CONFIG, FPAction } from '@/lib/fp/config';

interface EarnRequest {
  action: FPAction;
  metadata?: {
    messageLength?: number;
    messageContent?: string;  // Conteúdo para detectar pergunta
    roomId?: string;
    arenaId?: string;
    [key: string]: unknown;
  };
}

/**
 * Detecta se uma mensagem é uma pergunta
 * Considera "?" no final (ignorando espaços)
 */
function isQuestion(content?: string): boolean {
  if (!content) return false;
  const trimmed = content.trim();
  return trimmed.endsWith('?');
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

    // ==========================================
    // LÓGICA DE DETECÇÃO DE TIPO DE MENSAGEM
    // ==========================================
    let finalAction = action;
    let bonusFP = 0;

    if (action === FP_CONFIG.ACTIONS.MESSAGE) {
      const messageLength = metadata?.messageLength || 0;
      const messageContent = metadata?.messageContent || '';

      // Verifica tamanho mínimo
      if (messageLength < FP_CONFIG.MIN_MESSAGE_LENGTH) {
        return NextResponse.json({
          success: false,
          fpEarned: 0,
          reason: 'message_too_short',
        });
      }

      // Detecta pergunta (termina com "?") → +5 FP
      if (isQuestion(messageContent)) {
        finalAction = FP_CONFIG.ACTIONS.QUESTION;
      }

      // Bônus para mensagem longa (100+ chars) → +3 FP adicional
      // Este bônus é ALÉM do FP base (pergunta ou mensagem)
      if (messageLength >= 100) {
        bonusFP = FP_CONFIG.CHAT_MESSAGE_LONG_BONUS;
      }
    }

    // Registra FP da ação principal
    const result = await awardFP(session.user.id, finalAction, undefined, metadata);

    // Se teve bônus de mensagem longa e a ação principal deu certo, registra bônus
    let totalFPEarned = result.fpEarned;
    if (bonusFP > 0 && result.success) {
      const bonusResult = await awardFP(
        session.user.id,
        FP_CONFIG.ACTIONS.MESSAGE_LONG,
        bonusFP,
        { ...metadata, bonus_for: finalAction }
      );
      if (bonusResult.success) {
        totalFPEarned += bonusResult.fpEarned;
      }
    }

    return NextResponse.json({
      success: result.success,
      fpEarned: totalFPEarned,
      newBalance: result.newBalance + (bonusFP > 0 && result.success ? bonusFP : 0),
      streak: result.streak,
      reason: result.reason,
      actionType: finalAction,  // Retorna tipo detectado para debug
      hadLongBonus: bonusFP > 0,
    });
  } catch (error) {
    console.error('[FP Earn] Erro:', error);
    return NextResponse.json(
      { error: 'Erro interno ao registrar FP' },
      { status: 500 }
    );
  }
}
