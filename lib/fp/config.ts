/**
 * Configuração do Sistema de FP
 *
 * FP = sistema de INCENTIVO DE PARTICIPAÇÃO REAL NO CHAT
 *
 * PRINCÍPIOS:
 * - FP NÃO é recompensa por passividade
 * - FP NÃO deve ser fácil de farmar
 * - FP exige ação social, cognitiva e participativa
 * - FP gera DESCONTO no APP, logo precisa ser escasso e meritocrático
 *
 * LOOP: Chat → Conhecimento → App → Resultados → Chat → Desconto → App
 */

export const FP_CONFIG = {
  // ==========================================
  // AÇÕES BÁSICAS (Chat)
  // ==========================================
  DAILY_ACCESS: 1,              // Abrir o chat no dia (1x/dia, presença mínima)
  CHAT_MESSAGE: 2,              // Enviar mensagem comum
  CHAT_QUESTION: 5,             // Fazer PERGUNTA (termina com "?") - estimula curiosidade
  CHAT_MESSAGE_LONG_BONUS: 3,   // Bônus adicional para mensagem 100+ chars

  // ==========================================
  // AÇÕES DE ALTO VALOR
  // ==========================================
  CREATE_ARENA: 20,             // Criar NOVA ARENA (ação rara, exige iniciativa)

  // ==========================================
  // STREAK / CONSTÂNCIA
  // ==========================================
  // NÃO existe bônus diário de streak
  // NÃO existe FP por "ficar logado parado"
  // Dia ativo = ao menos 1 interação válida
  STREAK_30_DAYS_BONUS: 30,     // Bônus ÚNICO ao completar 30 dias consecutivos
  // ❗ NÃO é recorrente - se quebrar, recomeça do zero

  // ==========================================
  // APP - Resultados (valores altos)
  // ==========================================
  APP_WEEK_COMPLETE: 50,        // Completar semana de treino
  APP_MONTH_COMPLETE: 150,      // Completar ciclo mensal
  APP_RESULT_LOGGED: 30,        // Registrar resultado/medida
  APP_ACHIEVEMENT: 100,         // Conquistar badge no app
  APP_REFERRAL: 200,            // Indicar amigo que assina

  // ==========================================
  // NFV - Video Analysis (GASTO e GANHO)
  // ==========================================
  VIDEO_UPLOAD_COST: 25,           // Custo para enviar video (GASTO)
  VIDEO_ANALYSIS_PUBLISHED: 10,    // Ganho quando analise e publicada
  HELPFUL_VOTE_RECEIVED: 3,        // Ganho quando alguem vota util

  // ==========================================
  // CONVERSÃO - Desconto no APP
  // ==========================================
  // FP é CONSUMIDO ao gerar desconto
  // Desconto aplicado no checkout do APP
  FP_PER_PERCENT: 20,           // 20 FP = 1% de desconto
  MAX_DISCOUNT_PERCENT: 30,     // Máximo 30% de desconto
  MIN_FP_TO_REDEEM: 100,        // Mínimo para resgatar (5%)
  // Exemplo: 100 FP → 5%, 200 FP → 10%, 300 FP → 15%

  // ==========================================
  // LIMITES - Anti-exploit
  // ==========================================
  MAX_FP_PER_DAY_CHAT: 30,      // Máximo de FP por dia no chat (reduzido)
  MESSAGE_COOLDOWN_MS: 60000,   // 1 min entre mensagens que dão FP
  MIN_MESSAGE_LENGTH: 5,        // Mínimo de chars para ganhar FP
  INACTIVITY_DAYS: 90,          // Dias sem atividade para zerar FP

  // ==========================================
  // AÇÕES - Tipos
  // ==========================================
  ACTIONS: {
    // Chat - Básicas
    DAILY_ACCESS: 'daily_access',       // Abrir chat (+1)
    MESSAGE: 'message',                 // Mensagem comum (+2)
    QUESTION: 'question',               // Pergunta com "?" (+5)
    MESSAGE_LONG: 'message_long',       // Mensagem longa (+3 adicional)

    // Chat - Alto valor
    CREATE_ARENA: 'create_arena',       // Criar nova arena (+20)

    // Streak
    STREAK_30_BONUS: 'streak_30_bonus', // 30 dias consecutivos (+30, único)

    // App
    WEEK_COMPLETE: 'week_complete',
    MONTH_COMPLETE: 'month_complete',
    RESULT_LOGGED: 'result_logged',
    ACHIEVEMENT: 'achievement',
    REFERRAL: 'referral',

    // NFV - Video
    VIDEO_UPLOAD: 'video_upload',
    VIDEO_PUBLISHED: 'video_published',
    HELPFUL_VOTE: 'helpful_vote',

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
  streak_30_claimed: boolean;         // Bônus de 30 dias já foi dado? (único, não recorrente)
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
