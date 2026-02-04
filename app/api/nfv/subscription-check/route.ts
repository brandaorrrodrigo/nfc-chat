/**
 * API Route: NFV Subscription Check
 * GET - Verificar se usuario tem assinatura ativa do App
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId obrigatorio' }, { status: 400 });
    }

    // Verificar via sessão NextAuth (is_premium propagado do auth-config)
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as any;
    const isSubscriber = sessionUser?.is_premium === true;

    const subscriptionTier = isSubscriber ? 'app_premium' : null;
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
