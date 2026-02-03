/**
 * API: User Progression
 * GET /api/gamification/progression
 *
 * Obtém dados de progressão do usuário
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import {
  getUserProgression,
  getMotivationalMessage,
} from '@/lib/gamification/progression-service';

export async function GET(request: NextRequest) {
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

    // Buscar dados de progressão
    const progression = await getUserProgression(userId);

    // Gerar mensagem motivacional
    const motivationalMessage = getMotivationalMessage(
      progression.currentFP,
      progression.nextTier
    );

    return NextResponse.json({
      success: true,
      data: {
        currentFP: progression.currentFP,
        currentTier: progression.currentTier,
        nextTier: progression.nextTier,
        allTiers: progression.allTiers,
        milestones: progression.milestones,
        completedMilestones: progression.completedMilestones,
        totalMilestones: progression.totalMilestones,
        motivationalMessage,
      },
    });
  } catch (error: any) {
    console.error('❌ Progression error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch progression',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
