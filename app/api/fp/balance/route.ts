/**
 * API: GET /api/fp/balance
 * Retorna saldo e stats de FP do usuário
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { getUserFP } from '@/lib/fp/service';

export async function GET(request: NextRequest) {
  try {
    // Autenticação
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const stats = await getUserFP(session.user.id);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error('[FP Balance] Erro:', error);

    // Se tabela não existe, retorna defaults em vez de 500
    const isTableMissing = error?.message?.includes('relation') ||
      error?.code === '42P01' ||
      error?.message?.includes('does not exist');

    if (isTableMissing) {
      return NextResponse.json({
        success: true,
        data: {
          balance: 0,
          streak: 0,
          streakBest: 0,
          totalEarned: 0,
          discountAvailable: 0,
          fpToNextPercent: 20,
        },
      });
    }

    return NextResponse.json(
      { error: 'Erro interno ao buscar saldo' },
      { status: 500 }
    );
  }
}
