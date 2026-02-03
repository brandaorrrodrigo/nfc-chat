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
  } catch (error) {
    console.error('[FP Balance] Erro:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar saldo' },
      { status: 500 }
    );
  }
}
