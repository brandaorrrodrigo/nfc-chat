/**
 * API: Conversion Trigger
 * POST /api/conversion/trigger
 *
 * Processa gatilhos de conversão (cron job)
 * Envia notificações para usuários elegíveis
 */

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { processConversionTriggers } from '@/lib/conversion/conversion-triggers';

export async function POST(request: NextRequest) {
  try {
    // Verificar token de autorização (para cron jobs)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'dev-secret';

    // Permitir via token OU via sessão admin
    const hasValidToken = authHeader === `Bearer ${cronSecret}`;
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user && (session.user as any).role === 'admin';

    if (!hasValidToken && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { maxNotifications = 10 } = body;

    console.log(`🎯 Conversion trigger job started`);

    // Processar gatilhos
    const stats = await processConversionTriggers({
      maxNotifications,
    });

    return NextResponse.json({
      success: true,
      stats,
      message: `Processed ${stats.opportunities} opportunities, sent ${stats.sent} notifications`,
    });
  } catch (error: any) {
    console.error('❌ Conversion trigger error:', error);

    return NextResponse.json(
      {
        error: 'Processing failed',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
