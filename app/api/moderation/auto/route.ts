/**
 * API: Auto Moderation
 * POST /api/moderation/auto
 *
 * Modera conteúdo automaticamente com LLM
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { moderateContent, calculateQualityScore } from '@/lib/moderation/ai-moderator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, context, author } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'text is required and must be a string' },
        { status: 400 }
      );
    }

    console.log(`🛡️ Auto moderation request (${text.length} chars)`);

    // Moderar conteúdo
    const result = await moderateContent({
      text,
      context: context || 'Comunidade NFC',
      author,
    });

    // Calcular quality score
    const qualityScore = calculateQualityScore(text, result);

    return NextResponse.json({
      success: true,
      moderation: {
        decision: result.decision,
        confidence: result.confidence,
        reason: result.reason,
        qualityScore,
        categories: result.categories,
        suggestions: result.suggestions,
      },
      action: getActionForDecision(result.decision),
    });
  } catch (error: any) {
    console.error('❌ Auto moderation error:', error);

    return NextResponse.json(
      {
        error: 'Moderation failed',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Determina ação a ser tomada baseada na decisão
 */
function getActionForDecision(decision: string): string {
  switch (decision) {
    case 'APPROVE':
      return 'publish';
    case 'FLAG':
      return 'review';
    case 'REJECT':
      return 'block';
    default:
      return 'publish';
  }
}
