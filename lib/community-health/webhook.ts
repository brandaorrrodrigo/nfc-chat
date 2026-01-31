/**
 * Webhook System - Community Health Notifications
 *
 * Envia notificações para webhooks configurados quando:
 * - Saúde da comunidade muda de status
 * - Alertas críticos são gerados
 * - Marcos são atingidos (100 msgs, etc.)
 * - Eventos especiais (badge rara, etc.)
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { HealthMetrics, HealthAlert, HealthStatus } from './health-metrics';

// ==========================================
// TIPOS
// ==========================================

export type WebhookEvent =
  | 'health_status_changed'
  | 'critical_alert'
  | 'milestone_reached'
  | 'daily_summary'
  | 'weekly_summary'
  | 'new_user_welcome'
  | 'badge_unlocked'
  | 'engagement_spike';

export interface WebhookConfig {
  id: string;
  communitySlug: string;
  url: string;
  secret?: string;           // Para validação HMAC
  events: WebhookEvent[];
  isActive: boolean;
  createdAt: string;
  lastTriggeredAt?: string;
  failureCount: number;
}

export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  communitySlug: string;
  data: {
    // Health Status Changed
    previousStatus?: HealthStatus;
    currentStatus?: HealthStatus;
    score?: number;

    // Critical Alert
    alert?: HealthAlert;

    // Milestone
    milestone?: {
      type: 'messages' | 'users' | 'badges' | 'streak';
      value: number;
      description: string;
    };

    // Summary
    metrics?: Partial<HealthMetrics>;

    // User Events
    user?: {
      id: string;
      name: string;
    };

    // Badge Events
    badge?: {
      id: string;
      name: string;
      rarity: string;
    };

    // Custom data
    [key: string]: any;
  };
}

export interface WebhookResult {
  success: boolean;
  webhookId: string;
  statusCode?: number;
  error?: string;
  responseTime?: number;
}

// ==========================================
// CONSTANTES
// ==========================================

export const MILESTONES = {
  messages: [100, 500, 1000, 5000, 10000],
  users: [10, 50, 100, 500, 1000],
  badges: [10, 50, 100],
  streak: [7, 30, 100, 365],
};

// ==========================================
// FUNÇÕES PRINCIPAIS
// ==========================================

/**
 * Envia webhook para URL configurada
 */
export async function sendWebhook(
  config: WebhookConfig,
  payload: WebhookPayload
): Promise<WebhookResult> {
  const startTime = Date.now();

  try {
    // Verificar se webhook está ativo
    if (!config.isActive) {
      return {
        success: false,
        webhookId: config.id,
        error: 'Webhook inativo',
      };
    }

    // Verificar se evento está inscrito
    if (!config.events.includes(payload.event)) {
      return {
        success: false,
        webhookId: config.id,
        error: 'Evento não inscrito',
      };
    }

    // Preparar headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Webhook-Event': payload.event,
      'X-Webhook-Timestamp': payload.timestamp,
    };

    // Adicionar signature se secret configurado
    if (config.secret) {
      const signature = await generateSignature(JSON.stringify(payload), config.secret);
      headers['X-Webhook-Signature'] = signature;
    }

    // Enviar request
    const response = await fetch(config.url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const responseTime = Date.now() - startTime;

    // Atualizar timestamp e status
    await updateWebhookStatus(config.id, response.ok, responseTime);

    if (!response.ok) {
      return {
        success: false,
        webhookId: config.id,
        statusCode: response.status,
        error: `HTTP ${response.status}`,
        responseTime,
      };
    }

    return {
      success: true,
      webhookId: config.id,
      statusCode: response.status,
      responseTime,
    };

  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    await updateWebhookStatus(config.id, false, responseTime);

    return {
      success: false,
      webhookId: config.id,
      error: error.message || 'Erro desconhecido',
      responseTime,
    };
  }
}

/**
 * Dispara webhooks para um evento específico
 */
export async function triggerWebhooks(
  communitySlug: string,
  event: WebhookEvent,
  data: WebhookPayload['data']
): Promise<WebhookResult[]> {
  // Buscar webhooks configurados para esta comunidade
  const webhooks = await getWebhooksForCommunity(communitySlug, event);

  if (webhooks.length === 0) {
    return [];
  }

  const payload: WebhookPayload = {
    event,
    timestamp: new Date().toISOString(),
    communitySlug,
    data,
  };

  // Enviar para todos os webhooks em paralelo
  const results = await Promise.all(
    webhooks.map(webhook => sendWebhook(webhook, payload))
  );

  // Log resultados
  const successCount = results.filter(r => r.success).length;
  console.log(`[Webhook] ${event}: ${successCount}/${results.length} enviados com sucesso`);

  return results;
}

/**
 * Notifica mudança de status de saúde
 */
export async function notifyHealthStatusChange(
  communitySlug: string,
  previousStatus: HealthStatus,
  currentStatus: HealthStatus,
  score: number
): Promise<WebhookResult[]> {
  // Só notifica se status piorou ou melhorou significativamente
  const statusOrder: HealthStatus[] = ['critical', 'concerning', 'moderate', 'good', 'excellent'];
  const prevIndex = statusOrder.indexOf(previousStatus);
  const currIndex = statusOrder.indexOf(currentStatus);

  if (prevIndex === currIndex) {
    return [];
  }

  return triggerWebhooks(communitySlug, 'health_status_changed', {
    previousStatus,
    currentStatus,
    score,
  });
}

/**
 * Notifica alerta crítico
 */
export async function notifyCriticalAlert(
  communitySlug: string,
  alert: HealthAlert
): Promise<WebhookResult[]> {
  if (alert.type !== 'critical') {
    return [];
  }

  return triggerWebhooks(communitySlug, 'critical_alert', { alert });
}

/**
 * Notifica milestone atingido
 */
export async function notifyMilestoneReached(
  communitySlug: string,
  milestoneType: 'messages' | 'users' | 'badges' | 'streak',
  value: number
): Promise<WebhookResult[]> {
  const milestones = MILESTONES[milestoneType];

  if (!milestones.includes(value)) {
    return [];
  }

  const descriptions: Record<string, string> = {
    messages: `${value} mensagens na comunidade`,
    users: `${value} membros ativos`,
    badges: `${value} badges desbloqueadas`,
    streak: `${value} dias de streak`,
  };

  return triggerWebhooks(communitySlug, 'milestone_reached', {
    milestone: {
      type: milestoneType,
      value,
      description: descriptions[milestoneType],
    },
  });
}

/**
 * Envia resumo diário
 */
export async function sendDailySummary(
  communitySlug: string,
  metrics: HealthMetrics
): Promise<WebhookResult[]> {
  return triggerWebhooks(communitySlug, 'daily_summary', {
    metrics: {
      engagement: metrics.engagement,
      sentiment: metrics.sentiment,
      growth: metrics.growth,
      overallScore: metrics.overallScore,
      overallStatus: metrics.overallStatus,
      alerts: metrics.alerts,
    },
  });
}

/**
 * Envia resumo semanal
 */
export async function sendWeeklySummary(
  communitySlug: string,
  metrics: HealthMetrics
): Promise<WebhookResult[]> {
  return triggerWebhooks(communitySlug, 'weekly_summary', { metrics });
}

// ==========================================
// FUNÇÕES DE GESTÃO DE WEBHOOKS
// ==========================================

/**
 * Busca webhooks de uma comunidade
 */
export async function getWebhooksForCommunity(
  communitySlug: string,
  event?: WebhookEvent
): Promise<WebhookConfig[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return [];
  }

  try {
    let query = supabase
      .from('nfc_community_webhooks')
      .select('*')
      .eq('community_slug', communitySlug)
      .eq('is_active', true)
      .lt('failure_count', 5); // Desativar após 5 falhas

    const { data, error } = await query;

    if (error) {
      // Tabela pode não existir
      if (!error.message?.includes('does not exist')) {
        console.error('[Webhook] Erro ao buscar:', error);
      }
      return [];
    }

    // Filtrar por evento se especificado
    let webhooks = (data || []).map(w => ({
      id: w.id,
      communitySlug: w.community_slug,
      url: w.url,
      secret: w.secret,
      events: w.events || [],
      isActive: w.is_active,
      createdAt: w.created_at,
      lastTriggeredAt: w.last_triggered_at,
      failureCount: w.failure_count || 0,
    }));

    if (event) {
      webhooks = webhooks.filter(w => w.events.includes(event));
    }

    return webhooks;

  } catch (error) {
    console.error('[Webhook] Erro inesperado:', error);
    return [];
  }
}

/**
 * Registra novo webhook
 */
export async function registerWebhook(
  communitySlug: string,
  url: string,
  events: WebhookEvent[],
  secret?: string
): Promise<WebhookConfig | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }

  try {
    const id = `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const { data, error } = await supabase
      .from('nfc_community_webhooks')
      .insert({
        id,
        community_slug: communitySlug,
        url,
        secret,
        events,
        is_active: true,
        failure_count: 0,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('[Webhook] Erro ao registrar:', error);
      return null;
    }

    return {
      id: data.id,
      communitySlug: data.community_slug,
      url: data.url,
      secret: data.secret,
      events: data.events,
      isActive: data.is_active,
      createdAt: data.created_at,
      failureCount: 0,
    };

  } catch (error) {
    console.error('[Webhook] Erro inesperado ao registrar:', error);
    return null;
  }
}

/**
 * Atualiza status do webhook após envio
 */
async function updateWebhookStatus(
  webhookId: string,
  success: boolean,
  responseTime: number
): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) {
    return;
  }

  try {
    const updates: any = {
      last_triggered_at: new Date().toISOString(),
      last_response_time_ms: responseTime,
    };

    if (!success) {
      // Incrementar contador de falhas
      const { data } = await supabase
        .from('nfc_community_webhooks')
        .select('failure_count')
        .eq('id', webhookId)
        .single();

      updates.failure_count = (data?.failure_count || 0) + 1;

      // Desativar após 5 falhas
      if (updates.failure_count >= 5) {
        updates.is_active = false;
      }
    } else {
      // Reset contador de falhas em sucesso
      updates.failure_count = 0;
    }

    await supabase
      .from('nfc_community_webhooks')
      .update(updates)
      .eq('id', webhookId);

  } catch (error) {
    console.error('[Webhook] Erro ao atualizar status:', error);
  }
}

/**
 * Remove webhook
 */
export async function removeWebhook(webhookId: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) {
    return false;
  }

  try {
    const { error } = await supabase
      .from('nfc_community_webhooks')
      .delete()
      .eq('id', webhookId);

    return !error;

  } catch (error) {
    console.error('[Webhook] Erro ao remover:', error);
    return false;
  }
}

// ==========================================
// UTILITÁRIOS
// ==========================================

/**
 * Gera signature HMAC para validação
 */
async function generateSignature(payload: string, secret: string): Promise<string> {
  // Em ambiente browser/edge, usar Web Crypto API
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(payload);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return `sha256=${hashHex}`;
}

// ==========================================
// EXPORTS
// ==========================================

export default {
  sendWebhook,
  triggerWebhooks,
  notifyHealthStatusChange,
  notifyCriticalAlert,
  notifyMilestoneReached,
  sendDailySummary,
  sendWeeklySummary,
  getWebhooksForCommunity,
  registerWebhook,
  removeWebhook,
  MILESTONES,
};
