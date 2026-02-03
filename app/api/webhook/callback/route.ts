/**
 * API: Webhook Callback
 * POST /api/webhook/callback
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { handleWebhookCallback } from '@/lib/webhook/webhook-service';

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get('x-webhook-secret');
    if (secret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    const { event, couponCode, metadata } = await request.json();
    await handleWebhookCallback(event, couponCode, metadata);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
