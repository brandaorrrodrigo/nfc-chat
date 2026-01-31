/**
 * Community Health Metrics
 *
 * Calcula métricas de saúde da comunidade:
 * - Engajamento (mensagens, reações, usuários ativos)
 * - Sentimento geral (positivo, neutro, negativo)
 * - Crescimento (novos membros, retenção)
 * - Qualidade (mensagens longas, perguntas respondidas)
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// ==========================================
// TIPOS
// ==========================================

export type HealthStatus = 'excellent' | 'good' | 'moderate' | 'concerning' | 'critical';

export interface HealthMetrics {
  // Identificação
  communitySlug: string;
  calculatedAt: string;
  period: 'day' | 'week' | 'month';

  // Engajamento
  engagement: {
    totalMessages: number;
    uniqueUsers: number;
    averageMessagesPerUser: number;
    reactionsGiven: number;
    questionsAsked: number;
    questionsAnswered: number;
    responseRate: number; // % de perguntas respondidas
  };

  // Sentimento
  sentiment: {
    positive: number;    // Contagem
    neutral: number;
    negative: number;
    averageScore: number; // -1 a 1
    trend: 'improving' | 'stable' | 'declining';
  };

  // Crescimento
  growth: {
    newUsers: number;
    returningUsers: number;
    churnedUsers: number;   // Não voltaram em 7+ dias
    retentionRate: number;  // % de usuários que voltam
    netGrowth: number;      // Novos - Churned
  };

  // Qualidade
  quality: {
    averageMessageLength: number;
    longMessages: number;      // > 100 chars
    linksShared: number;
    misinformationCorrected: number;
    iaInterventions: number;
    fpAwarded: number;
    badgesUnlocked: number;
  };

  // Score Geral
  overallScore: number;       // 0-100
  overallStatus: HealthStatus;

  // Alertas
  alerts: HealthAlert[];
}

export interface HealthAlert {
  type: 'warning' | 'critical' | 'info' | 'success';
  category: 'engagement' | 'sentiment' | 'growth' | 'quality';
  message: string;
  metric: string;
  value: number;
  threshold: number;
  timestamp: string;
}

export interface HealthConfig {
  // Thresholds de Engajamento
  minDailyMessages: number;
  minUniqueUsers: number;
  minResponseRate: number;

  // Thresholds de Sentimento
  minSentimentScore: number;
  maxNegativeRatio: number;

  // Thresholds de Crescimento
  minRetentionRate: number;
  maxChurnRate: number;

  // Thresholds de Qualidade
  minAverageMessageLength: number;
}

// ==========================================
// CONFIGURAÇÃO PADRÃO
// ==========================================

export const DEFAULT_HEALTH_CONFIG: HealthConfig = {
  minDailyMessages: 10,
  minUniqueUsers: 3,
  minResponseRate: 0.5,
  minSentimentScore: 0.1,
  maxNegativeRatio: 0.3,
  minRetentionRate: 0.4,
  maxChurnRate: 0.3,
  minAverageMessageLength: 30,
};

// ==========================================
// CÁLCULO DE MÉTRICAS
// ==========================================

/**
 * Calcula todas as métricas de saúde da comunidade
 */
export async function calculateHealthMetrics(
  communitySlug: string,
  period: 'day' | 'week' | 'month' = 'day',
  config: Partial<HealthConfig> = {}
): Promise<HealthMetrics | null> {
  if (!isSupabaseConfigured() || !supabase) {
    console.log('[Health] Supabase não configurado');
    return null;
  }

  const cfg = { ...DEFAULT_HEALTH_CONFIG, ...config };
  const now = new Date();

  // Calcular período
  let startDate: Date;
  switch (period) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  }

  try {
    // Buscar mensagens do período
    const { data: messages, error: msgError } = await supabase
      .from('nfc_chat_messages')
      .select('*')
      .eq('comunidade_slug', communitySlug)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (msgError) {
      console.error('[Health] Erro ao buscar mensagens:', msgError);
      // Continuar com dados vazios
    }

    const msgs = messages || [];

    // Calcular métricas de engajamento
    const uniqueUserIds = new Set(msgs.map(m => m.user_id).filter(Boolean));
    const questionsCount = msgs.filter(m =>
      m.content?.includes('?') ||
      /como|porque|qual|quando|quanto/i.test(m.content || '')
    ).length;

    // Buscar reações do período
    const { data: reactions } = await supabase
      .from('nfc_chat_reactions')
      .select('id')
      .eq('comunidade_slug', communitySlug)
      .gte('created_at', startDate.toISOString());

    // Buscar intervenções IA
    const { data: interventions } = await supabase
      .from('nfc_chat_ia_interventions')
      .select('*')
      .eq('comunidade_slug', communitySlug)
      .gte('created_at', startDate.toISOString());

    const iaInterventions = interventions || [];
    const answeredInterventions = iaInterventions.filter(i => i.was_answered).length;

    // Calcular métricas de sentimento (simplificado)
    const sentimentScores = msgs.map(m => analyzeSentimentSimple(m.content || ''));
    const positiveCount = sentimentScores.filter(s => s > 0.2).length;
    const negativeCount = sentimentScores.filter(s => s < -0.2).length;
    const neutralCount = sentimentScores.length - positiveCount - negativeCount;
    const avgSentiment = sentimentScores.length > 0
      ? sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length
      : 0;

    // Buscar usuários novos vs retornando
    const { data: userStats } = await supabase
      .from('nfc_chat_user_stats')
      .select('*')
      .eq('comunidade_slug', communitySlug);

    const users = userStats || [];
    const periodStart = startDate.getTime();
    const newUsers = users.filter(u => new Date(u.created_at).getTime() >= periodStart).length;
    const returningUsers = uniqueUserIds.size - newUsers;

    // Calcular churn (usuários que não mandaram msg em 7+ dias)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const { data: inactiveUsers } = await supabase
      .from('nfc_chat_user_stats')
      .select('user_id')
      .eq('comunidade_slug', communitySlug)
      .lt('last_message_at', sevenDaysAgo.toISOString());

    const churnedUsers = inactiveUsers?.length || 0;
    const retentionRate = users.length > 0
      ? (users.length - churnedUsers) / users.length
      : 1;

    // Calcular métricas de qualidade
    const messageLengths = msgs.map(m => (m.content || '').length);
    const avgLength = messageLengths.length > 0
      ? messageLengths.reduce((a, b) => a + b, 0) / messageLengths.length
      : 0;
    const longMessages = messageLengths.filter(l => l > 100).length;

    // Buscar badges do período
    const { data: badges } = await supabase
      .from('nfc_user_badges')
      .select('id')
      .gte('unlocked_at', startDate.toISOString());

    // Calcular FP concedido (simplificado)
    const fpAwarded = msgs.length * 3; // Média estimada

    // Montar engajamento
    const engagement = {
      totalMessages: msgs.length,
      uniqueUsers: uniqueUserIds.size,
      averageMessagesPerUser: uniqueUserIds.size > 0 ? msgs.length / uniqueUserIds.size : 0,
      reactionsGiven: reactions?.length || 0,
      questionsAsked: questionsCount,
      questionsAnswered: answeredInterventions,
      responseRate: questionsCount > 0 ? answeredInterventions / questionsCount : 1,
    };

    // Montar sentimento
    const previousSentiment = avgSentiment; // Simplificado
    const sentiment = {
      positive: positiveCount,
      neutral: neutralCount,
      negative: negativeCount,
      averageScore: avgSentiment,
      trend: avgSentiment >= previousSentiment ? 'stable' : 'declining' as const,
    };

    // Montar crescimento
    const growth = {
      newUsers,
      returningUsers,
      churnedUsers,
      retentionRate,
      netGrowth: newUsers - churnedUsers,
    };

    // Montar qualidade
    const quality = {
      averageMessageLength: avgLength,
      longMessages,
      linksShared: msgs.filter(m => /https?:\/\//.test(m.content || '')).length,
      misinformationCorrected: iaInterventions.filter(i => i.intervention_type === 'misinformation').length,
      iaInterventions: iaInterventions.length,
      fpAwarded,
      badgesUnlocked: badges?.length || 0,
    };

    // Calcular score geral (0-100)
    const scores = {
      engagement: calculateEngagementScore(engagement, cfg),
      sentiment: calculateSentimentScore(sentiment, cfg),
      growth: calculateGrowthScore(growth, cfg),
      quality: calculateQualityScore(quality, cfg),
    };

    const overallScore = Math.round(
      (scores.engagement * 0.3) +
      (scores.sentiment * 0.25) +
      (scores.growth * 0.25) +
      (scores.quality * 0.2)
    );

    // Determinar status
    const overallStatus = getHealthStatus(overallScore);

    // Gerar alertas
    const alerts = generateAlerts(engagement, sentiment, growth, quality, cfg);

    return {
      communitySlug,
      calculatedAt: now.toISOString(),
      period,
      engagement,
      sentiment,
      growth,
      quality,
      overallScore,
      overallStatus,
      alerts,
    };

  } catch (error) {
    console.error('[Health] Erro ao calcular métricas:', error);
    return null;
  }
}

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

/**
 * Análise de sentimento simplificada
 */
function analyzeSentimentSimple(text: string): number {
  const positive = [
    'obrigado', 'legal', 'otimo', 'incrivel', 'show', 'top', 'adorei',
    'consegui', 'funciona', 'resultado', 'feliz', 'animado', 'motivado'
  ];
  const negative = [
    'nao consigo', 'frustrado', 'dificil', 'cansado', 'desisti',
    'problema', 'erro', 'pior', 'triste', 'ansiedade', 'medo'
  ];

  const lower = text.toLowerCase();
  let score = 0;

  positive.forEach(word => {
    if (lower.includes(word)) score += 0.3;
  });

  negative.forEach(word => {
    if (lower.includes(word)) score -= 0.3;
  });

  return Math.max(-1, Math.min(1, score));
}

function calculateEngagementScore(engagement: HealthMetrics['engagement'], cfg: HealthConfig): number {
  let score = 50;

  // Mensagens
  if (engagement.totalMessages >= cfg.minDailyMessages) score += 15;
  else score -= 10;

  // Usuários únicos
  if (engagement.uniqueUsers >= cfg.minUniqueUsers) score += 15;
  else score -= 10;

  // Taxa de resposta
  if (engagement.responseRate >= cfg.minResponseRate) score += 10;
  else score -= 5;

  // Reações
  if (engagement.reactionsGiven > 0) score += 10;

  return Math.max(0, Math.min(100, score));
}

function calculateSentimentScore(sentiment: HealthMetrics['sentiment'], cfg: HealthConfig): number {
  let score = 50;

  // Score médio
  score += sentiment.averageScore * 30;

  // Ratio negativo
  const total = sentiment.positive + sentiment.neutral + sentiment.negative;
  if (total > 0) {
    const negativeRatio = sentiment.negative / total;
    if (negativeRatio > cfg.maxNegativeRatio) score -= 20;
  }

  // Trend
  if (sentiment.trend === 'improving') score += 10;
  else if (sentiment.trend === 'declining') score -= 10;

  return Math.max(0, Math.min(100, score));
}

function calculateGrowthScore(growth: HealthMetrics['growth'], cfg: HealthConfig): number {
  let score = 50;

  // Novos usuários
  if (growth.newUsers > 0) score += 15;

  // Retenção
  if (growth.retentionRate >= cfg.minRetentionRate) score += 20;
  else score -= 15;

  // Net growth
  if (growth.netGrowth > 0) score += 15;
  else if (growth.netGrowth < 0) score -= 10;

  return Math.max(0, Math.min(100, score));
}

function calculateQualityScore(quality: HealthMetrics['quality'], cfg: HealthConfig): number {
  let score = 50;

  // Tamanho médio das mensagens
  if (quality.averageMessageLength >= cfg.minAverageMessageLength) score += 15;
  else score -= 5;

  // Mensagens longas (engajamento qualitativo)
  if (quality.longMessages > 0) score += 10;

  // Badges desbloqueadas
  if (quality.badgesUnlocked > 0) score += 15;

  // Correções de desinformação (positivo - comunidade aprende)
  if (quality.misinformationCorrected > 0) score += 10;

  return Math.max(0, Math.min(100, score));
}

function getHealthStatus(score: number): HealthStatus {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'moderate';
  if (score >= 20) return 'concerning';
  return 'critical';
}

function generateAlerts(
  engagement: HealthMetrics['engagement'],
  sentiment: HealthMetrics['sentiment'],
  growth: HealthMetrics['growth'],
  quality: HealthMetrics['quality'],
  cfg: HealthConfig
): HealthAlert[] {
  const alerts: HealthAlert[] = [];
  const now = new Date().toISOString();

  // Alertas de Engajamento
  if (engagement.totalMessages < cfg.minDailyMessages) {
    alerts.push({
      type: 'warning',
      category: 'engagement',
      message: 'Baixo volume de mensagens',
      metric: 'totalMessages',
      value: engagement.totalMessages,
      threshold: cfg.minDailyMessages,
      timestamp: now,
    });
  }

  if (engagement.uniqueUsers < cfg.minUniqueUsers) {
    alerts.push({
      type: 'warning',
      category: 'engagement',
      message: 'Poucos usuários ativos',
      metric: 'uniqueUsers',
      value: engagement.uniqueUsers,
      threshold: cfg.minUniqueUsers,
      timestamp: now,
    });
  }

  // Alertas de Sentimento
  if (sentiment.averageScore < cfg.minSentimentScore) {
    alerts.push({
      type: sentiment.averageScore < 0 ? 'critical' : 'warning',
      category: 'sentiment',
      message: 'Sentimento da comunidade baixo',
      metric: 'averageScore',
      value: sentiment.averageScore,
      threshold: cfg.minSentimentScore,
      timestamp: now,
    });
  }

  // Alertas de Crescimento
  if (growth.retentionRate < cfg.minRetentionRate) {
    alerts.push({
      type: 'critical',
      category: 'growth',
      message: 'Taxa de retenção preocupante',
      metric: 'retentionRate',
      value: growth.retentionRate,
      threshold: cfg.minRetentionRate,
      timestamp: now,
    });
  }

  // Alertas positivos
  if (growth.newUsers > 5) {
    alerts.push({
      type: 'success',
      category: 'growth',
      message: 'Crescimento acelerado de novos membros',
      metric: 'newUsers',
      value: growth.newUsers,
      threshold: 5,
      timestamp: now,
    });
  }

  if (quality.badgesUnlocked > 3) {
    alerts.push({
      type: 'success',
      category: 'quality',
      message: 'Alta conquista de badges',
      metric: 'badgesUnlocked',
      value: quality.badgesUnlocked,
      threshold: 3,
      timestamp: now,
    });
  }

  return alerts;
}

// ==========================================
// EXPORTS
// ==========================================

export default {
  calculateHealthMetrics,
  DEFAULT_HEALTH_CONFIG,
};
