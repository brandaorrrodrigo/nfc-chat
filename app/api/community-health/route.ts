/**
 * API: Community Health
 * Path: /api/community-health
 *
 * GET - Retorna métricas de saúde da comunidade
 * POST - Dispara verificação manual e webhooks
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import {
  calculateHealthMetrics,
  notifyHealthStatusChange,
  notifyCriticalAlert,
  type HealthMetrics,
} from '@/lib/community-health';

// Cache de métricas (5 minutos)
const metricsCache = new Map<string, { metrics: HealthMetrics; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

// ==========================================
// GET - Consultar métricas de saúde
// ==========================================

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const communitySlug = searchParams.get('communitySlug');
    const period = (searchParams.get('period') as 'day' | 'week' | 'month') || 'day';
    const skipCache = searchParams.get('skipCache') === 'true';

    if (!communitySlug) {
      return NextResponse.json(
        { success: false, error: 'communitySlug obrigatório' },
        { status: 400 }
      );
    }

    // Verificar cache
    const cacheKey = `${communitySlug}_${period}`;
    const cached = metricsCache.get(cacheKey);

    if (!skipCache && cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({
        success: true,
        metrics: cached.metrics,
        fromCache: true,
        cacheAge: Math.round((Date.now() - cached.timestamp) / 1000),
      });
    }

    // Calcular métricas
    const metrics = await calculateHealthMetrics(communitySlug, period);

    if (!metrics) {
      return NextResponse.json({
        success: true,
        metrics: null,
        message: 'Dados insuficientes ou Supabase não configurado',
      });
    }

    // Atualizar cache
    metricsCache.set(cacheKey, { metrics, timestamp: Date.now() });

    return NextResponse.json({
      success: true,
      metrics,
      fromCache: false,
    });

  } catch (error: any) {
    console.error('[Community Health GET Error]', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao calcular métricas', details: error.message },
      { status: 500 }
    );
  }
}

// ==========================================
// POST - Disparar verificação e webhooks
// ==========================================

interface HealthCheckBody {
  communitySlug: string;
  previousStatus?: string;
  notifyWebhooks?: boolean;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    const body: HealthCheckBody = await request.json();

    if (!body.communitySlug) {
      return NextResponse.json(
        { success: false, error: 'communitySlug obrigatório' },
        { status: 400 }
      );
    }

    // Calcular métricas atuais
    const metrics = await calculateHealthMetrics(body.communitySlug, 'day');

    if (!metrics) {
      return NextResponse.json({
        success: true,
        metrics: null,
        webhooksTriggered: 0,
        message: 'Dados insuficientes',
      });
    }

    let webhooksTriggered = 0;

    // Notificar webhooks se solicitado
    if (body.notifyWebhooks !== false) {
      // 1. Mudança de status
      if (body.previousStatus && body.previousStatus !== metrics.overallStatus) {
        const results = await notifyHealthStatusChange(
          body.communitySlug,
          body.previousStatus as any,
          metrics.overallStatus,
          metrics.overallScore
        );
        webhooksTriggered += results.filter(r => r.success).length;
      }

      // 2. Alertas críticos
      const criticalAlerts = metrics.alerts.filter(a => a.type === 'critical');
      for (const alert of criticalAlerts) {
        const results = await notifyCriticalAlert(body.communitySlug, alert);
        webhooksTriggered += results.filter(r => r.success).length;
      }
    }

    // Atualizar cache
    const cacheKey = `${body.communitySlug}_day`;
    metricsCache.set(cacheKey, { metrics, timestamp: Date.now() });

    return NextResponse.json({
      success: true,
      metrics,
      webhooksTriggered,
      criticalAlertsCount: metrics.alerts.filter(a => a.type === 'critical').length,
    });

  } catch (error: any) {
    console.error('[Community Health POST Error]', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao processar', details: error.message },
      { status: 500 }
    );
  }
}
