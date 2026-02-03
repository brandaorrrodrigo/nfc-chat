/**
 * API: Complete Referral
 * POST /api/referral/complete
 *
 * Completa referral (quando indicado faz primeira conversão)
 * Chamado automaticamente após primeiro resgate de cupom
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { completeReferral } from '@/lib/referral/referral-service';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id || session.user.email;

    // Completar referral
    const success = await completeReferral(userId);

    if (!success) {
      return NextResponse.json({
        success: false,
        message: 'No pending referral found or already completed',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Referral completed successfully',
    });
  } catch (error: any) {
    console.error('❌ Complete referral error:', error);

    return NextResponse.json(
      {
        error: 'Failed to complete referral',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
