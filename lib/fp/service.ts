/**
 * Serviço de FP - Operações principais
 */

import { db } from '../db';
import { FP_CONFIG, FPAction, UserFP, FPStats, FPTransaction } from './config';

// ==========================================
// INICIALIZAÇÃO
// ==========================================

// Nome das tabelas com prefixo (evita conflito com APP)
const TABLE_USER_FP = 'nfc_chat_user_fp';
const TABLE_FP_TRANSACTIONS = 'nfc_chat_fp_transactions';

/**
 * Garante que o usuário tem registro na tabela nfc_chat_user_fp
 */
export async function ensureUserFP(userId: string): Promise<UserFP> {
  // Tenta buscar existente
  const existing = await db.query<UserFP>(
    `SELECT * FROM ${TABLE_USER_FP} WHERE user_id = $1`,
    [userId]
  );

  if (existing.rows.length > 0) {
    return existing.rows[0];
  }

  // Cria novo registro
  const result = await db.query<UserFP>(
    `INSERT INTO ${TABLE_USER_FP} (user_id, balance, total_earned, total_spent, streak_current, streak_best, fp_earned_today)
     VALUES ($1, 0, 0, 0, 0, 0, 0)
     ON CONFLICT (user_id) DO NOTHING
     RETURNING *`,
    [userId]
  );

  if (result.rows.length > 0) {
    return result.rows[0];
  }

  // Race condition: busca novamente
  const retry = await db.query<UserFP>(
    `SELECT * FROM ${TABLE_USER_FP} WHERE user_id = $1`,
    [userId]
  );
  return retry.rows[0];
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
  const result = await db.query<FPTransaction>(
    `SELECT * FROM ${TABLE_FP_TRANSACTIONS}
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
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
 */
export async function awardFP(
  userId: string,
  action: FPAction,
  customAmount?: number,
  metadata?: Record<string, unknown>
): Promise<AwardResult> {
  const userFP = await ensureUserFP(userId);
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  // Calcula amount baseado na ação
  let amount = customAmount ?? getAmountForAction(action);
  let description = getDescriptionForAction(action);

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

  // 2. Verifica cooldown de mensagem
  if (action === FP_CONFIG.ACTIONS.MESSAGE || action === FP_CONFIG.ACTIONS.MESSAGE_LONG) {
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

  // 3. Verifica bônus diário único
  if (action === FP_CONFIG.ACTIONS.DAILY_ACCESS) {
    if (userFP.last_daily_bonus_at === today) {
      return {
        success: false,
        fpEarned: 0,
        newBalance: userFP.balance,
        streak: userFP.streak_current,
        reason: 'daily_bonus_already_claimed'
      };
    }
  }

  // ==========================================
  // ATUALIZA STREAK
  // ==========================================

  let newStreak = userFP.streak_current;
  let streakBonus = 0;

  if (action === FP_CONFIG.ACTIONS.DAILY_ACCESS) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (userFP.last_daily_bonus_at === yesterdayStr) {
      // Continuando streak
      newStreak = userFP.streak_current + 1;
      streakBonus = FP_CONFIG.STREAK_DAILY_BONUS;

      // Milestones
      if (newStreak === 7) {
        streakBonus += FP_CONFIG.STREAK_MILESTONE_7;
      } else if (newStreak === 30) {
        streakBonus += FP_CONFIG.STREAK_MILESTONE_30;
      }
    } else if (userFP.last_daily_bonus_at !== today) {
      // Reinicia streak
      newStreak = 1;
    }
  }

  const totalAmount = amount + streakBonus;
  const newBalance = userFP.balance + totalAmount;
  const newStreakBest = Math.max(userFP.streak_best, newStreak);

  // ==========================================
  // PERSISTE
  // ==========================================

  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    // Atualiza nfc_chat_user_fp
    const updateQuery = action === FP_CONFIG.ACTIONS.DAILY_ACCESS
      ? `UPDATE ${TABLE_USER_FP} SET
           balance = $2,
           total_earned = total_earned + $3,
           streak_current = $4,
           streak_best = $5,
           last_activity_at = NOW(),
           last_daily_bonus_at = $6,
           fp_earned_today = CASE
             WHEN DATE(last_activity_at) = CURRENT_DATE THEN fp_earned_today + $3
             ELSE $3
           END,
           updated_at = NOW()
         WHERE user_id = $1`
      : action === FP_CONFIG.ACTIONS.MESSAGE || action === FP_CONFIG.ACTIONS.MESSAGE_LONG
      ? `UPDATE ${TABLE_USER_FP} SET
           balance = $2,
           total_earned = total_earned + $3,
           last_activity_at = NOW(),
           last_message_fp_at = NOW(),
           fp_earned_today = CASE
             WHEN DATE(last_activity_at) = CURRENT_DATE THEN fp_earned_today + $3
             ELSE $3
           END,
           updated_at = NOW()
         WHERE user_id = $1`
      : `UPDATE ${TABLE_USER_FP} SET
           balance = $2,
           total_earned = total_earned + $3,
           last_activity_at = NOW(),
           updated_at = NOW()
         WHERE user_id = $1`;

    const params = action === FP_CONFIG.ACTIONS.DAILY_ACCESS
      ? [userId, newBalance, totalAmount, newStreak, newStreakBest, today]
      : [userId, newBalance, totalAmount];

    await client.query(updateQuery, params);

    // Registra transação principal
    await client.query(
      `INSERT INTO ${TABLE_FP_TRANSACTIONS} (user_id, amount, type, action, description, metadata)
       VALUES ($1, $2, 'earn', $3, $4, $5)`,
      [userId, amount, action, description, JSON.stringify(metadata || {})]
    );

    // Registra bônus de streak separadamente
    if (streakBonus > 0) {
      await client.query(
        `INSERT INTO ${TABLE_FP_TRANSACTIONS} (user_id, amount, type, action, description, metadata)
         VALUES ($1, $2, 'earn', $3, $4, $5)`,
        [
          userId,
          streakBonus,
          FP_CONFIG.ACTIONS.STREAK_BONUS,
          `Bônus de streak: ${newStreak} dias`,
          JSON.stringify({ streak: newStreak })
        ]
      );
    }

    await client.query('COMMIT');

    return {
      success: true,
      fpEarned: totalAmount,
      newBalance,
      streak: newStreak,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
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
 * Gasta FP para obter desconto
 */
export async function spendFP(
  userId: string,
  amount: number
): Promise<SpendResult> {
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

  // Persiste
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    await client.query(
      `UPDATE ${TABLE_USER_FP} SET
         balance = $2,
         total_spent = total_spent + $3,
         updated_at = NOW()
       WHERE user_id = $1`,
      [userId, newBalance, amount]
    );

    await client.query(
      `INSERT INTO ${TABLE_FP_TRANSACTIONS} (user_id, amount, type, action, description, metadata)
       VALUES ($1, $2, 'spend', $3, $4, $5)`,
      [
        userId,
        -amount,
        FP_CONFIG.ACTIONS.REDEEM,
        `Resgate: ${discountPercent}% de desconto`,
        JSON.stringify({ discount_percent: discountPercent, coupon_code: couponCode })
      ]
    );

    await client.query('COMMIT');

    return {
      success: true,
      fpSpent: amount,
      newBalance,
      discountPercent,
      couponCode,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// ==========================================
// DESCONTO
// ==========================================

/**
 * Calcula % de desconto baseado no FP
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
    FP_CONFIG.ACTIONS.MESSAGE,
    FP_CONFIG.ACTIONS.MESSAGE_LONG,
    FP_CONFIG.ACTIONS.QUESTION_TECH,
    FP_CONFIG.ACTIONS.DAILY_ACCESS,
  ];
  return chatActions.includes(action);
}

function getAmountForAction(action: FPAction): number {
  const amounts: Record<string, number> = {
    [FP_CONFIG.ACTIONS.MESSAGE]: FP_CONFIG.CHAT_MESSAGE,
    [FP_CONFIG.ACTIONS.MESSAGE_LONG]: FP_CONFIG.CHAT_MESSAGE_LONG,
    [FP_CONFIG.ACTIONS.QUESTION_TECH]: FP_CONFIG.CHAT_QUESTION_TECH,
    [FP_CONFIG.ACTIONS.DAILY_ACCESS]: FP_CONFIG.DAILY_ACCESS,
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
    [FP_CONFIG.ACTIONS.MESSAGE]: 'Mensagem enviada',
    [FP_CONFIG.ACTIONS.MESSAGE_LONG]: 'Mensagem detalhada',
    [FP_CONFIG.ACTIONS.QUESTION_TECH]: 'Pergunta técnica',
    [FP_CONFIG.ACTIONS.DAILY_ACCESS]: 'Acesso diário',
    [FP_CONFIG.ACTIONS.STREAK_BONUS]: 'Bônus de streak',
    [FP_CONFIG.ACTIONS.STREAK_MILESTONE]: 'Marco de streak',
    [FP_CONFIG.ACTIONS.WEEK_COMPLETE]: 'Semana completa no app',
    [FP_CONFIG.ACTIONS.MONTH_COMPLETE]: 'Ciclo mensal completo',
    [FP_CONFIG.ACTIONS.RESULT_LOGGED]: 'Resultado registrado',
    [FP_CONFIG.ACTIONS.ACHIEVEMENT]: 'Conquista desbloqueada',
    [FP_CONFIG.ACTIONS.REFERRAL]: 'Indicação convertida',
    [FP_CONFIG.ACTIONS.REDEEM]: 'Resgate de desconto',
  };
  return descriptions[action] || action;
}
