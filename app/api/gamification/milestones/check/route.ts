/**
 * API: Check Milestones (Cron Job)
 * POST /api/gamification/milestones/check
 *
 * Verifica e completa milestones pendentes
 */

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { checkAndCompleteMilestones } from '@/lib/gamification/progression-service';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Verificar autorização (token de cron OU admin)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'dev-secret';

    const hasValidToken = authHeader === `Bearer ${cronSecret}`;
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user && (session.user as any).role === 'admin';

    if (!hasValidToken && !isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🎯 Starting milestone check job...');

    // Buscar todos os usuários ativos
    const users = await prisma.user.findMany({
      select: { id: true },
      take: 100, // Processar em batches
    });

    let totalCompleted = 0;

    for (const user of users) {
      const completed = await checkAndCompleteMilestones(user.id);
      totalCompleted += completed;

      if (completed > 0) {
        console.log(`✅ User ${user.id}: ${completed} milestones completed`);
      }
    }

    console.log(`🎉 Milestone check completed: ${totalCompleted} total completions`);

    return NextResponse.json({
      success: true,
      usersChecked: users.length,
      milestonesCompleted: totalCompleted,
    });
  } catch (error: any) {
    console.error('❌ Milestone check error:', error);

    return NextResponse.json(
      {
        error: 'Failed to check milestones',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
