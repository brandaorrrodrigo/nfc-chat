/**
 * API: Complete Milestone
 * POST /api/gamification/milestones/complete
 *
 * Marca milestone como completo
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { completeMilestone } from '@/lib/gamification/progression-service';

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

    const body = await request.json();
    const { milestoneId } = body;

    if (!milestoneId) {
      return NextResponse.json(
        { error: 'milestoneId is required' },
        { status: 400 }
      );
    }

    // Completar milestone
    const success = await completeMilestone(userId, milestoneId);

    if (!success) {
      return NextResponse.json(
        { error: 'Milestone already completed or invalid' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Milestone completed successfully',
    });
  } catch (error: any) {
    console.error('❌ Complete milestone error:', error);

    return NextResponse.json(
      {
        error: 'Failed to complete milestone',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
