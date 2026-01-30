/**
 * API: GET /api/fp/test
 * Teste do sistema FP (REMOVER EM PRODUÇÃO)
 */

import { NextResponse } from 'next/server';
import { awardFP, getUserFP } from '@/lib/fp/service';
import { FP_CONFIG } from '@/lib/fp/config';

export async function GET() {
  const TEST_USER_ID = 'test-fp-' + Date.now();
  const results: Record<string, unknown> = {};

  try {
    // 1. Daily access (+1)
    results.daily = await awardFP(TEST_USER_ID, FP_CONFIG.ACTIONS.DAILY_ACCESS);

    // 2. Message (+2)
    results.message = await awardFP(TEST_USER_ID, FP_CONFIG.ACTIONS.MESSAGE, undefined, {
      messageLength: 50,
      messageContent: 'Teste de mensagem comum'
    });

    // 3. Question (+5) - vai dar cooldown
    results.question = await awardFP(TEST_USER_ID, FP_CONFIG.ACTIONS.QUESTION, undefined, {
      messageLength: 30,
      messageContent: 'Como funciona?'
    });

    // 4. Stats finais
    results.stats = await getUserFP(TEST_USER_ID);

    // 5. Resumo
    results.summary = {
      testUserId: TEST_USER_ID,
      expectedTotal: '1 (daily) + 2 (msg) = 3 FP (question blocked by cooldown)',
      actualBalance: results.stats,
      configUsed: {
        DAILY_ACCESS: FP_CONFIG.DAILY_ACCESS,
        CHAT_MESSAGE: FP_CONFIG.CHAT_MESSAGE,
        CHAT_QUESTION: FP_CONFIG.CHAT_QUESTION,
        MAX_FP_PER_DAY: FP_CONFIG.MAX_FP_PER_DAY_CHAT,
        COOLDOWN_MS: FP_CONFIG.MESSAGE_COOLDOWN_MS,
      }
    };

    return NextResponse.json({
      success: true,
      message: 'Sistema FP funcionando!',
      results
    });

  } catch (error) {
    console.error('[FP Test] Erro:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
