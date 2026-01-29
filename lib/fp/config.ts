/**
 * Configuração do Sistema de FP
 * FP = moeda de engajamento do NutriFitCoach
 */

export const FP_CONFIG = {
  // ==========================================
  // CHAT - Valores baixos (engajamento)
  // ==========================================
  CHAT_MESSAGE: 2,              // Mensagem enviada
  CHAT_MESSAGE_LONG: 5,         // Mensagem >100 chars
  CHAT_QUESTION_TECH: 8,        // Pergunta técnica detectada
  DAILY_ACCESS: 10,             // Primeiro acesso do dia
  STREAK_DAILY_BONUS: 5,        // Bônus por dia de streak
  STREAK_MILESTONE_7: 20,       // Bônus ao completar 7 dias
  STREAK_MILESTONE_30: 100,     // Bônus ao completar 30 dias

  // ==========================================
  // APP - Valores altos (resultados)
  // ==========================================
  APP_WEEK_COMPLETE: 50,        // Completar semana de treino
  APP_MONTH_COMPLETE: 150,      // Completar ciclo mensal
  APP_RESULT_LOGGED: 30,        // Registrar resultado/medida
  APP_ACHIEVEMENT: 100,         // Conquistar badge no app
  APP_REFERRAL: 200,            // Indicar amigo que assina

  // ==========================================
  // CONVERSÃO - Desconto
  // ==========================================
  FP_PER_PERCENT: 20,           // 20 FP = 1% de desconto
  MAX_DISCOUNT_PERCENT: 30,     // Máximo 30% de desconto
  MIN_FP_TO_REDEEM: 100,        // Mínimo para resgatar (5%)

  // ==========================================
  // LIMITES - Anti-exploit
  // ==========================================
  MAX_FP_PER_DAY_CHAT: 50,      // Máximo de FP por dia no chat
  MESSAGE_COOLDOWN_MS: 60000,   // 1 min entre mensagens que dão FP
  MIN_MESSAGE_LENGTH: 5,        // Mínimo de chars para ganhar FP
  INACTIVITY_DAYS: 90,          // Dias sem atividade para zerar FP

  // ==========================================
  // AÇÕES - Tipos
  // ==========================================
  ACTIONS: {
    // Chat
    MESSAGE: 'message',
    MESSAGE_LONG: 'message_long',
    QUESTION_TECH: 'question_tech',
    DAILY_ACCESS: 'daily_access',
    STREAK_BONUS: 'streak_bonus',
    STREAK_MILESTONE: 'streak_milestone',

    // App
    WEEK_COMPLETE: 'week_complete',
    MONTH_COMPLETE: 'month_complete',
    RESULT_LOGGED: 'result_logged',
    ACHIEVEMENT: 'achievement',
    REFERRAL: 'referral',

    // Sistema
    REDEEM: 'redeem',
    EXPIRE: 'expire',
    ADMIN_ADJUST: 'admin_adjust',
  }
} as const;

// Tipos derivados da config
export type FPAction = typeof FP_CONFIG.ACTIONS[keyof typeof FP_CONFIG.ACTIONS];

export interface FPTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'earn' | 'spend';
  action: FPAction;
  description?: string;
  metadata?: Record<string, unknown>;
  created_at: Date;
}

export interface UserFP {
  user_id: string;
  balance: number;
  total_earned: number;
  total_spent: number;
  streak_current: number;
  streak_best: number;
  last_activity_at: Date | null;
  last_daily_bonus_at: string | null; // DATE format YYYY-MM-DD
  fp_earned_today: number;
  last_message_fp_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface FPStats {
  balance: number;
  streak: number;
  streakBest: number;
  totalEarned: number;
  discountAvailable: number;
  fpToNextPercent: number;
}
