/**
 * API: Expiration Reminders (Cron Job)
 * POST /api/urgency/expiration-reminders
 *
 * Envia lembretes para cupons próximos de expirar
 */

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { sendExpirationReminders } from '@/lib/urgency/urgency-service';

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

    console.log('⏰ Starting expiration reminders job...');

    // Enviar lembretes
    const result = await sendExpirationReminders();

    console.log(`✅ Expiration reminders completed: ${result.sent} sent, ${result.failed} failed`);

    return NextResponse.json({
      success: true,
      sent: result.sent,
      failed: result.failed,
      message: `Sent ${result.sent} reminders successfully`,
    });
  } catch (error: any) {
    console.error('❌ Expiration reminders error:', error);

    return NextResponse.json(
      {
        error: 'Failed to send reminders',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
