/**
 * Sistema de Regras de FP (Fitness Points)
 * Define todas as ações que geram ou consomem FP
 */

export type FPAction =
  // Criação de conteúdo
  | 'POST_CREATED'
  | 'POST_QUALITY_BONUS'
  | 'COMMENT_CREATED'
  | 'COMMENT_HELPFUL'
  | 'REPLY_CREATED'
  | 'BEST_ANSWER'

  // Engagement
  | 'POST_LIKED'
  | 'COMMENT_LIKED'
  | 'POST_SHARED'

  // NFV/Biomecânica
  | 'VIDEO_ANALYSIS_SUBMITTED'
  | 'VIDEO_ANALYSIS_APPROVED'

  // Streak e Daily
  | 'DAILY_LOGIN'
  | 'FIRST_POST_DAY'
  | 'STREAK_BONUS_7'
  | 'STREAK_BONUS_30'
  | 'STREAK_BONUS_90'
  | 'STREAK_BONUS_365'

  // Penalidades
  | 'SPAM_PENALTY'
  | 'LOW_QUALITY_PENALTY'
  | 'REPORTED_CONTENT_PENALTY'
  | 'VIOLATION_PENALTY'

  // Conquistas
  | 'BADGE_EARNED'
  | 'MILESTONE_REACHED'

  // Conversão
  | 'FP_TO_DISCOUNT'
  | 'FP_MANUAL_ADJUSTMENT';

/**
 * Configuração de regras de FP
 */
export interface FPRuleConfig {
  action: FPAction;
  fpValue: number;
  dailyCap?: number;        // Máximo de FP por essa ação/dia
  cooldown?: number;        // Minutos entre ações
  minStreak?: number;       // Streak mínimo necessário
  requiresApproval?: boolean; // Precisa de aprovação de moderador
  description: string;
}

/**
 * Regras de FP - Configuração completa
 */
export const FP_RULES: Record<FPAction, FPRuleConfig> = {
  // ========================================
  // CRIAÇÃO DE CONTEÚDO
  // ========================================

  POST_CREATED: {
    action: 'POST_CREATED',
    fpValue: 10,
    dailyCap: 50,           // Max 5 posts/dia ganham FP
    cooldown: 30,           // 30 min entre posts que ganham FP
    description: 'Criar novo tópico',
  },

  POST_QUALITY_BONUS: {
    action: 'POST_QUALITY_BONUS',
    fpValue: 15,
    requiresApproval: true,
    description: 'Bônus por post de alta qualidade (aprovado por mod)',
  },

  COMMENT_CREATED: {
    action: 'COMMENT_CREATED',
    fpValue: 5,
    dailyCap: 50,           // Max 10 comentários/dia
    cooldown: 10,
    description: 'Criar comentário útil',
  },

  COMMENT_HELPFUL: {
    action: 'COMMENT_HELPFUL',
    fpValue: 10,
    description: 'Comentário marcado como útil',
  },

  REPLY_CREATED: {
    action: 'REPLY_CREATED',
    fpValue: 2,
    dailyCap: 20,           // Max 10 respostas/dia
    cooldown: 5,
    description: 'Responder a comentário',
  },

  BEST_ANSWER: {
    action: 'BEST_ANSWER',
    fpValue: 20,
    description: 'Resposta marcada como melhor resposta',
  },

  // ========================================
  // ENGAGEMENT
  // ========================================

  POST_LIKED: {
    action: 'POST_LIKED',
    fpValue: 1,
    dailyCap: 10,           // Max 10 FP por dia com likes
    description: 'Receber like em post',
  },

  COMMENT_LIKED: {
    action: 'COMMENT_LIKED',
    fpValue: 1,
    dailyCap: 10,
    description: 'Receber like em comentário',
  },

  POST_SHARED: {
    action: 'POST_SHARED',
    fpValue: 5,
    dailyCap: 20,
    description: 'Post compartilhado',
  },

  // ========================================
  // NFV/BIOMECÂNICA
  // ========================================

  VIDEO_ANALYSIS_SUBMITTED: {
    action: 'VIDEO_ANALYSIS_SUBMITTED',
    fpValue: -25,           // Custo para enviar vídeo
    description: 'Enviar vídeo para análise (custo)',
  },

  VIDEO_ANALYSIS_APPROVED: {
    action: 'VIDEO_ANALYSIS_APPROVED',
    fpValue: 10,
    description: 'Bônus quando análise é aprovada e publicada',
  },

  // ========================================
  // STREAK E DAILY
  // ========================================

  DAILY_LOGIN: {
    action: 'DAILY_LOGIN',
    fpValue: 1,             // v2.1 -50%
    dailyCap: 1,            // Apenas 1x por dia
    description: 'Login diário',
  },

  FIRST_POST_DAY: {
    action: 'FIRST_POST_DAY',
    fpValue: 5,
    dailyCap: 5,
    description: 'Bônus por primeiro post do dia',
  },

  STREAK_BONUS_7: {
    action: 'STREAK_BONUS_7',
    fpValue: 8,             // v2.1 explícito
    minStreak: 7,
    description: 'Bônus de 7 dias de streak',
  },

  STREAK_BONUS_30: {
    action: 'STREAK_BONUS_30',
    fpValue: 30,            // v2.1 explícito
    minStreak: 30,
    description: 'Bônus de 30 dias de streak',
  },

  STREAK_BONUS_90: {
    action: 'STREAK_BONUS_90',
    fpValue: 75,            // v2.1 explícito
    minStreak: 90,
    description: 'Bônus de 90 dias de streak',
  },

  STREAK_BONUS_365: {
    action: 'STREAK_BONUS_365',
    fpValue: 250,           // v2.1 -50%
    minStreak: 365,
    description: 'Bônus de 1 ano de streak',
  },

  // ========================================
  // PENALIDADES
  // ========================================

  SPAM_PENALTY: {
    action: 'SPAM_PENALTY',
    fpValue: -5,
    description: 'Penalidade por spam',
  },

  LOW_QUALITY_PENALTY: {
    action: 'LOW_QUALITY_PENALTY',
    fpValue: -3,
    description: 'Penalidade por conteúdo de baixa qualidade',
  },

  REPORTED_CONTENT_PENALTY: {
    action: 'REPORTED_CONTENT_PENALTY',
    fpValue: -10,
    requiresApproval: true,
    description: 'Penalidade por conteúdo reportado (aprovado por mod)',
  },

  VIOLATION_PENALTY: {
    action: 'VIOLATION_PENALTY',
    fpValue: -50,
    requiresApproval: true,
    description: 'Penalidade grave por violação de regras',
  },

  // ========================================
  // CONQUISTAS
  // ========================================

  BADGE_EARNED: {
    action: 'BADGE_EARNED',
    fpValue: 10,
    description: 'Conquistar badge',
  },

  MILESTONE_REACHED: {
    action: 'MILESTONE_REACHED',
    fpValue: 25,
    description: 'Atingir marco especial',
  },

  // ========================================
  // CONVERSÃO
  // ========================================

  FP_TO_DISCOUNT: {
    action: 'FP_TO_DISCOUNT',
    fpValue: 0,             // Variável baseado na conversão
    description: 'Converter FP em desconto',
  },

  FP_MANUAL_ADJUSTMENT: {
    action: 'FP_MANUAL_ADJUSTMENT',
    fpValue: 0,             // Ajuste manual por admin
    requiresApproval: true,
    description: 'Ajuste manual de FP por administrador',
  },
};

/**
 * Helpers
 */
export function getFPRule(action: FPAction): FPRuleConfig {
  return FP_RULES[action];
}

export function getFPValue(action: FPAction): number {
  return FP_RULES[action].fpValue;
}

export function hasActionDailyCap(action: FPAction): boolean {
  return FP_RULES[action].dailyCap !== undefined;
}

export function getDailyCap(action: FPAction): number | undefined {
  return FP_RULES[action].dailyCap;
}

export function hasCooldown(action: FPAction): boolean {
  return FP_RULES[action].cooldown !== undefined;
}

export function getCooldown(action: FPAction): number | undefined {
  return FP_RULES[action].cooldown;
}
