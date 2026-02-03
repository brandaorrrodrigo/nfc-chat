/**
 * API: Scarcity Message
 * GET /api/urgency/scarcity?tierId=tier_advanced
 *
 * Obtém mensagem de escassez para um tier específico
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import {
  getScarcityMessageForTier,
  shouldShowScarcityAlert,
} from '@/lib/urgency/social-proof';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tierId = searchParams.get('tierId');

    if (!tierId) {
      return NextResponse.json(
        { error: 'tierId is required' },
        { status: 400 }
      );
    }

    const [message, shouldShow] = await Promise.all([
      getScarcityMessageForTier(tierId),
      shouldShowScarcityAlert(tierId),
    ]);

    return NextResponse.json({
      success: true,
      tierId,
      message,
      shouldShow,
    });
  } catch (error: any) {
    console.error('❌ Scarcity error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch scarcity data',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
