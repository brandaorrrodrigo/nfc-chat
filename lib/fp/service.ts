/**
 * Serviço de FP - Operações principais
 *
 * PRINCÍPIOS:
 * - FP NÃO é recompensa por passividade
 * - FP exige ação social, cognitiva e participativa
 * - Quem só entra e sai → quase não ganha FP
 * - Quem pergunta, conversa e cria → evolui rápido
 *
 * ATUALIZADO: Usa Supabase REST API (não pg direto)
 */

import { getSupabase } from '../supabase';
import { FP_CONFIG, FPAction, UserFP, FPStats, FPTransaction } from './config';

// ==========================================
// TABELAS (prefixo nfc_chat_ para não conflitar com APP)
// ==========================================

const TABLE_USER_FP = 'nfc_chat_user_fp';
const TABLE_FP_TRANSACTIONS = 'nfc_chat_fp_transactions';

// ==========================================
// INICIALIZAÇÃO
// ==========================================

/**
 * Garante que o usuário tem registro na tabela nfc_chat_user_fp
 */
export async function ensureUserFP(userId: string): Promise<UserFP> {
  const supabase = getSupabase();

  // Tenta buscar existente
  const { data: existing, error: selectError } = await supabase
    .from(TABLE_USER_FP)
    .select('*')
    .eq('user_id', userId)
    .single();

  if (existing && !selectError) {
    return existing as UserFP;
  }

  // Cria novo registro
  const { data: inserted, error: insertError } = await supabase
    .from(TABLE_USER_FP)
    .insert({
      user_id: userId,
      balance: 0,
      total_earned: 0,
      total_spent: 0,
      streak_current: 0,
      streak_best: 0,
      streak_30_claimed: false,
      fp_earned_today: 0,
    })
    .select()
    .single();

  if (inserted && !insertError) {
    return inserted as UserFP;
  }

  // Race condition: busca novamente
  const { data: retry } = await supabase
    .from(TABLE_USER_FP)
    .select('*')
    .eq('user_id', userId)
    .single();

  return retry as UserFP;
}

// ==========================================
// CONSULTAS
// ==========================================

/**
 * Retorna o saldo e stats do usuário
 */
export async function getUserFP(userId: string): Promise<FPStats> {
  const userFP = await ensureUserFP(userId);

  const discountAvailable = calculateDiscount(userFP.balance);
  const currentPercentFP = Math.floor(userFP.balance / FP_CONFIG.FP_PER_PERCENT) * FP_CONFIG.FP_PER_PERCENT;
  const nextPercentFP = currentPercentFP + FP_CONFIG.FP_PER_PERCENT;
  const fpToNextPercent = nextPercentFP - userFP.balance;

  return {
    balance: userFP.balance,
    streak: userFP.streak_current,
    streakBest: userFP.streak_best,
    totalEarned: userFP.total_earned,
    discountAvailable,
    fpToNextPercent: discountAvailable >= FP_CONFIG.MAX_DISCOUNT_PERCENT ? 0 : fpToNextPercent,
  };
}

/**
 * Retorna histórico de transações
 */
export async function getTransactionHistory(
  userId: string,
  limit = 50
): Promise<FPTransaction[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from(TABLE_FP_TRANSACTIONS)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[FP] Error fetching transactions:', error);
    return [];
  }

  return data as FPTransaction[];
}

// ==========================================
// GANHAR FP
// ==========================================

interface AwardResult {
  success: boolean;
  fpEarned: number;
  newBalance: number;
  streak: number;
  reason?: string;
}

/**
 * Credita FP para o usuário
 *
 * Regras:
 * - Abrir chat: +1 FP (1x/dia)
 * - Mensagem comum: +2 FP
 * - Pergunta (?): +5 FP
 * - Mensagem longa (100+): +3 FP adicional
 * - Criar arena: +20 FP
 * - 30 dias consecutivos: +30 FP (único, não recorrente)
 */
export async function awardFP(
  userId: string,
  action: FPAction,
  customAmount?: number,
  metadata?: Record<string, unknown>
): Promise<AwardResult> {
  const supabase = getSupabase();
  const userFP = await ensureUserFP(userId);
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  // Calcula amount baseado na ação
  let amount = customAmount ?? getAmountForAction(action);
  const description = getDescriptionForAction(action);

  // ==========================================
  // VALIDAÇÕES ANTI-EXPLOIT
  // ==========================================

  // 1. Verifica limite diário para ações de chat
  if (isChatAction(action)) {
    if (userFP.fp_earned_today >= FP_CONFIG.MAX_FP_PER_DAY_CHAT) {
      return {
        success: false,
        fpEarned: 0,
        newBalance: userFP.balance,
        streak: userFP.streak_current,
        reason: 'daily_limit_reached'
      };
    }

    // Ajusta se ultrapassar limite
    const remaining = FP_CONFIG.MAX_FP_PER_DAY_CHAT - userFP.fp_earned_today;
    if (amount > remaining) {
      amount = remaining;
    }
  }

  // 2. Verifica cooldown de mensagem (exceto para daily_access)
  if (action === FP_CONFIG.ACTIONS.MESSAGE || action === FP_CONFIG.ACTIONS.QUESTION || action === FP_CONFIG.ACTIONS.MESSAGE_LONG) {
    if (userFP.last_message_fp_at) {
      const timeSinceLastMessage = now.getTime() - new Date(userFP.last_message_fp_at).getTime();
      if (timeSinceLastMessage < FP_CONFIG.MESSAGE_COOLDOWN_MS) {
        return {
          success: false,
          fpEarned: 0,
          newBalance: userFP.balance,
          streak: userFP.streak_current,
          reason: 'cooldown_active'
        };
      }
    }
  }

  // 3. Verifica acesso diário único
  if (action === FP_CONFIG.ACTIONS.DAILY_ACCESS) {
    if (userFP.last_daily_bonus_at === today) {
      return {
        success: false,
        fpEarned: 0,
        newBalance: userFP.balance,
        streak: userFP.streak_current,
        reason: 'daily_access_already_claimed'
      };
    }
  }

  // ==========================================
  // ATUALIZA STREAK (nova lógica)
  // ==========================================

  let newStreak = userFP.streak_current;
  let streak30Bonus = 0;
  let shouldClaimStreak30 = false;

  if (action === FP_CONFIG.ACTIONS.DAILY_ACCESS) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (userFP.last_daily_bonus_at === yesterdayStr) {
      // Continuando streak
      newStreak = userFP.streak_current + 1;

      // Bônus de 30 dias (ÚNICO - só se nunca foi dado)
      if (newStreak === 30 && !userFP.streak_30_claimed) {
        streak30Bonus = FP_CONFIG.STREAK_30_DAYS_BONUS;
        shouldClaimStreak30 = true;
      }
    } else if (userFP.last_daily_bonus_at !== today) {
      // Reinicia streak (quebrou sequência)
      newStreak = 1;
    }
  }

  const totalAmount = amount + streak30Bonus;
  const newBalance = userFP.balance + totalAmount;
  const newStreakBest = Math.max(userFP.streak_best, newStreak);

  // ==========================================
  // PERSISTE - Usando Supabase REST
  // ==========================================

  try {
    // Determina se é novo dia para resetar fp_earned_today
    const lastActivityDate = userFP.last_activity_at
      ? new Date(userFP.last_activity_at).toISOString().split('T')[0]
      : null;
    const isNewDay = lastActivityDate !== today;

    // Prepara update baseado no tipo de ação
    const updateData: Record<string, unknown> = {
      balance: newBalance,
      total_earned: userFP.total_earned + totalAmount,
      last_activity_at: now.toISOString(),
      fp_earned_today: isNewDay ? totalAmount : userFP.fp_earned_today + totalAmount,
      updated_at: now.toISOString(),
    };

    if (action === FP_CONFIG.ACTIONS.DAILY_ACCESS) {
      updateData.streak_current = newStreak;
      updateData.streak_best = newStreakBest;
      updateData.last_daily_bonus_at = today;
      if (shouldClaimStreak30) {
        updateData.streak_30_claimed = true;
      }
    }

    if (action === FP_CONFIG.ACTIONS.MESSAGE || action === FP_CONFIG.ACTIONS.QUESTION || action === FP_CONFIG.ACTIONS.MESSAGE_LONG) {
      updateData.last_message_fp_at = now.toISOString();
    }

    // Update user FP
    const { error: updateError } = await supabase
      .from(TABLE_USER_FP)
      .update(updateData)
      .eq('user_id', userId);

    if (updateError) {
      throw updateError;
    }

    // Registra transação principal
    await supabase
      .from(TABLE_FP_TRANSACTIONS)
      .insert({
        user_id: userId,
        amount: amount,
        type: 'earn',
        action: action,
        description: description,
        metadata: metadata || {},
      });

    // Registra bônus de 30 dias separadamente (se aplicável)
    if (streak30Bonus > 0) {
      await supabase
        .from(TABLE_FP_TRANSACTIONS)
        .insert({
          user_id: userId,
          amount: streak30Bonus,
          type: 'earn',
          action: FP_CONFIG.ACTIONS.STREAK_30_BONUS,
          description: '30 dias consecutivos (bônus único)',
          metadata: { streak: newStreak, unique_bonus: true },
        });
    }

    return {
      success: true,
      fpEarned: totalAmount,
      newBalance,
      streak: newStreak,
    };
  } catch (error) {
    console.error('[FP] Error awarding FP:', error);
    throw error;
  }
}

// ==========================================
// GASTAR FP
// ==========================================

interface SpendResult {
  success: boolean;
  fpSpent: number;
  newBalance: number;
  discountPercent: number;
  couponCode?: string;
  reason?: string;
}

/**
 * Gasta FP para obter desconto no APP
 * FP é CONSUMIDO ao gerar desconto
 */
export async function spendFP(
  userId: string,
  amount: number
): Promise<SpendResult> {
  const supabase = getSupabase();
  const userFP = await ensureUserFP(userId);

  // Validações
  if (amount < FP_CONFIG.MIN_FP_TO_REDEEM) {
    return {
      success: false,
      fpSpent: 0,
      newBalance: userFP.balance,
      discountPercent: 0,
      reason: `minimum_not_met:${FP_CONFIG.MIN_FP_TO_REDEEM}`
    };
  }

  if (amount > userFP.balance) {
    return {
      success: false,
      fpSpent: 0,
      newBalance: userFP.balance,
      discountPercent: 0,
      reason: 'insufficient_balance'
    };
  }

  const discountPercent = calculateDiscount(amount);
  const newBalance = userFP.balance - amount;
  const couponCode = generateCouponCode(userId, discountPercent);

  try {
    // Update user FP
    const { error: updateError } = await supabase
      .from(TABLE_USER_FP)
      .update({
        balance: newBalance,
        total_spent: userFP.total_spent + amount,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (updateError) {
      throw updateError;
    }

    // Registra transação
    await supabase
      .from(TABLE_FP_TRANSACTIONS)
      .insert({
        user_id: userId,
        amount: -amount,
        type: 'spend',
        action: FP_CONFIG.ACTIONS.REDEEM,
        description: `Desconto: ${discountPercent}% no APP`,
        metadata: { discount_percent: discountPercent, coupon_code: couponCode },
      });

    return {
      success: true,
      fpSpent: amount,
      newBalance,
      discountPercent,
      couponCode,
    };
  } catch (error) {
    console.error('[FP] Error spending FP:', error);
    throw error;
  }
}

// ==========================================
// DESCONTO
// ==========================================

/**
 * Calcula % de desconto baseado no FP
 * 20 FP = 1%, máximo 30%
 */
export function calculateDiscount(fpBalance: number): number {
  const rawPercent = Math.floor(fpBalance / FP_CONFIG.FP_PER_PERCENT);
  return Math.min(rawPercent, FP_CONFIG.MAX_DISCOUNT_PERCENT);
}

/**
 * Gera código de cupom único
 */
export function generateCouponCode(userId: string, discountPercent: number): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const userPart = userId.slice(-4).toUpperCase();
  return `NFC${discountPercent}-${userPart}${timestamp}`;
}

// ==========================================
// HELPERS
// ==========================================

function isChatAction(action: FPAction): boolean {
  const chatActions: string[] = [
    FP_CONFIG.ACTIONS.DAILY_ACCESS,
    FP_CONFIG.ACTIONS.MESSAGE,
    FP_CONFIG.ACTIONS.QUESTION,
    FP_CONFIG.ACTIONS.MESSAGE_LONG,
    FP_CONFIG.ACTIONS.CREATE_ARENA,
  ];
  return chatActions.includes(action);
}

function getAmountForAction(action: FPAction): number {
  const amounts: Record<string, number> = {
    // Chat - Básicas
    [FP_CONFIG.ACTIONS.DAILY_ACCESS]: FP_CONFIG.DAILY_ACCESS,           // +1
    [FP_CONFIG.ACTIONS.MESSAGE]: FP_CONFIG.CHAT_MESSAGE,                // +2
    [FP_CONFIG.ACTIONS.QUESTION]: FP_CONFIG.CHAT_QUESTION,              // +5
    [FP_CONFIG.ACTIONS.MESSAGE_LONG]: FP_CONFIG.CHAT_MESSAGE_LONG_BONUS, // +3 (adicional)

    // Chat - Alto valor
    [FP_CONFIG.ACTIONS.CREATE_ARENA]: FP_CONFIG.CREATE_ARENA,           // +20

    // App
    [FP_CONFIG.ACTIONS.WEEK_COMPLETE]: FP_CONFIG.APP_WEEK_COMPLETE,
    [FP_CONFIG.ACTIONS.MONTH_COMPLETE]: FP_CONFIG.APP_MONTH_COMPLETE,
    [FP_CONFIG.ACTIONS.RESULT_LOGGED]: FP_CONFIG.APP_RESULT_LOGGED,
    [FP_CONFIG.ACTIONS.ACHIEVEMENT]: FP_CONFIG.APP_ACHIEVEMENT,
    [FP_CONFIG.ACTIONS.REFERRAL]: FP_CONFIG.APP_REFERRAL,
  };
  return amounts[action] || 0;
}

function getDescriptionForAction(action: FPAction): string {
  const descriptions: Record<string, string> = {
    // Chat
    [FP_CONFIG.ACTIONS.DAILY_ACCESS]: 'Acesso diário',
    [FP_CONFIG.ACTIONS.MESSAGE]: 'Mensagem enviada',
    [FP_CONFIG.ACTIONS.QUESTION]: 'Pergunta feita',
    [FP_CONFIG.ACTIONS.MESSAGE_LONG]: 'Mensagem detalhada',
    [FP_CONFIG.ACTIONS.CREATE_ARENA]: 'Nova arena criada',
    [FP_CONFIG.ACTIONS.STREAK_30_BONUS]: '30 dias consecutivos',

    // App
    [FP_CONFIG.ACTIONS.WEEK_COMPLETE]: 'Semana completa no APP',
    [FP_CONFIG.ACTIONS.MONTH_COMPLETE]: 'Ciclo mensal completo',
    [FP_CONFIG.ACTIONS.RESULT_LOGGED]: 'Resultado registrado',
    [FP_CONFIG.ACTIONS.ACHIEVEMENT]: 'Conquista desbloqueada',
    [FP_CONFIG.ACTIONS.REFERRAL]: 'Indicação convertida',
    [FP_CONFIG.ACTIONS.REDEEM]: 'Desconto resgatado',
  };
  return descriptions[action] || action;
}
