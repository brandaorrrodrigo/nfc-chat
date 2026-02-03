/**
 * API: Generate Referral Code
 * POST /api/referral/generate
 *
 * Gera código de indicação para o usuário
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { generateReferralCode } from '@/lib/referral/referral-service';

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

    // Gerar código
    const referralCode = await generateReferralCode(userId);

    return NextResponse.json({
      success: true,
      code: referralCode.code,
      referral: referralCode,
    });
  } catch (error: any) {
    console.error('❌ Generate referral code error:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate referral code',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
