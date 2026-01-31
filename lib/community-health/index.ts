/**
 * Community Health System - Exports
 *
 * Sistema de monitoramento de saúde da comunidade.
 */

// Métricas de Saúde
export {
  calculateHealthMetrics,
  DEFAULT_HEALTH_CONFIG,
  type HealthMetrics,
  type HealthAlert,
  type HealthStatus,
  type HealthConfig,
} from './health-metrics';

// Sistema de Webhooks
export {
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
  type WebhookEvent,
  type WebhookConfig,
  type WebhookPayload,
  type WebhookResult,
} from './webhook';
