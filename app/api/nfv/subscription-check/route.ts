/**
 * API Route: NFV Subscription Check
 * GET - Verificar se usuario tem assinatura ativa do App
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId obrigatorio' }, { status: 400 });
    }

    // TODO: Integrar com sistema real de assinaturas
    // Por enquanto, retorna false (ninguem e assinante)
    // Em producao, verificar no Stripe/RevenueCat/etc
    const isSubscriber = false;
    const subscriptionTier = null;
    const expiresAt = null;

    return NextResponse.json({
      userId,
      isSubscriber,
      subscriptionTier,
      expiresAt,
      benefits: isSubscriber
        ? {
            unlimitedUploads: true,
            priorityReview: true,
            allArenas: true,
          }
        : null,
    });
  } catch (error) {
    console.error('[NFV] Subscription check error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
