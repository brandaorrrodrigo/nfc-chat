/**
 * API: Webhooks Management
 * Path: /api/webhooks
 *
 * GET - Lista webhooks de uma comunidade
 * POST - Registra novo webhook
 * DELETE - Remove webhook
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import {
  getWebhooksForCommunity,
  registerWebhook,
  removeWebhook,
  sendWebhook,
  type WebhookEvent,
} from '@/lib/community-health';

// ==========================================
// GET - Listar webhooks
// ==========================================

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const communitySlug = searchParams.get('communitySlug');

    if (!communitySlug) {
      return NextResponse.json(
        { success: false, error: 'communitySlug obrigatório' },
        { status: 400 }
      );
    }

    const webhooks = await getWebhooksForCommunity(communitySlug);

    // Mascarar secrets
    const safeWebhooks = webhooks.map(w => ({
      ...w,
      secret: w.secret ? '****' : undefined,
    }));

    return NextResponse.json({
      success: true,
      webhooks: safeWebhooks,
      count: safeWebhooks.length,
    });

  } catch (error: any) {
    console.error('[Webhooks GET Error]', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao listar webhooks', details: error.message },
      { status: 500 }
    );
  }
}

// ==========================================
// POST - Registrar webhook
// ==========================================

interface RegisterWebhookBody {
  communitySlug: string;
  url: string;
  events: WebhookEvent[];
  secret?: string;
  testWebhook?: boolean;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    const body: RegisterWebhookBody = await request.json();

    // Validação
    if (!body.communitySlug || !body.url || !body.events?.length) {
      return NextResponse.json(
        { success: false, error: 'communitySlug, url e events são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar URL
    try {
      new URL(body.url);
    } catch {
      return NextResponse.json(
        { success: false, error: 'URL inválida' },
        { status: 400 }
      );
    }

    // Validar eventos
    const validEvents: WebhookEvent[] = [
      'health_status_changed',
      'critical_alert',
      'milestone_reached',
      'daily_summary',
      'weekly_summary',
      'new_user_welcome',
      'badge_unlocked',
      'engagement_spike',
    ];

    const invalidEvents = body.events.filter(e => !validEvents.includes(e));
    if (invalidEvents.length > 0) {
      return NextResponse.json(
        { success: false, error: `Eventos inválidos: ${invalidEvents.join(', ')}` },
        { status: 400 }
      );
    }

    // Registrar webhook
    const webhook = await registerWebhook(
      body.communitySlug,
      body.url,
      body.events,
      body.secret
    );

    if (!webhook) {
      return NextResponse.json(
        { success: false, error: 'Erro ao registrar webhook' },
        { status: 500 }
      );
    }

    // Testar webhook se solicitado
    let testResult: any = null;
    if (body.testWebhook) {
      testResult = await sendWebhook(webhook, {
        event: 'health_status_changed',
        timestamp: new Date().toISOString(),
        communitySlug: body.communitySlug,
        data: {
          previousStatus: 'test' as any,
          currentStatus: 'test' as any,
          score: 100,
          message: 'Este é um teste de webhook',
        },
      });
    }

    return NextResponse.json({
      success: true,
      webhook: {
        ...webhook,
        secret: webhook.secret ? '****' : undefined,
      },
      testResult,
    });

  } catch (error: any) {
    console.error('[Webhooks POST Error]', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao registrar webhook', details: error.message },
      { status: 500 }
    );
  }
}

// ==========================================
// DELETE - Remover webhook
// ==========================================

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const webhookId = searchParams.get('webhookId');

    if (!webhookId) {
      return NextResponse.json(
        { success: false, error: 'webhookId obrigatório' },
        { status: 400 }
      );
    }

    const removed = await removeWebhook(webhookId);

    if (!removed) {
      return NextResponse.json(
        { success: false, error: 'Webhook não encontrado ou erro ao remover' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook removido com sucesso',
    });

  } catch (error: any) {
    console.error('[Webhooks DELETE Error]', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao remover webhook', details: error.message },
      { status: 500 }
    );
  }
}
