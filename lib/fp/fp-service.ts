/**
 * Serviço de Gerenciamento de FP
 * Aplica regras, valida limites e registra transações
 */

import { createClient } from '@supabase/supabase-js';
import { FPAction, getFPRule } from './fp-rules';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface FPTransactionResult {
  success: boolean;
  amount: number;
  newBalance: number;
  transactionId?: string;
  reason?: string;
  blocked?: boolean;
}

export interface FPValidationResult {
  allowed: boolean;
  reason?: string;
  remainingToday?: number;
  nextAvailableAt?: Date;
}

/**
 * Valida se o usuário pode ganhar FP por uma ação
 * Checa dailyCap e cooldown
 */
export async function validateFPAction(
  userId: string,
  action: FPAction
): Promise<FPValidationResult> {
  const rule = getFPRule(action);

  // 1. Checar daily cap
  if (rule.dailyCap) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: todayTransactions } = await supabase
      .from('FPTransaction')
      .select('amount')
      .eq('userId', userId)
      .eq('type', action)
      .gte('createdAt', today.toISOString());

    const totalToday = (todayTransactions || [])
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    if (totalToday >= rule.dailyCap) {
      return {
        allowed: false,
        reason: 'daily_cap_reached',
        remainingToday: 0,
      };
    }
  }

  // 2. Checar cooldown
  if (rule.cooldown) {
    const { data: lastTransaction } = await supabase
      .from('FPTransaction')
      .select('createdAt')
      .eq('userId', userId)
      .eq('type', action)
      .order('createdAt', { ascending: false })
      .limit(1)
      .single();

    if (lastTransaction) {
      const lastTime = new Date(lastTransaction.createdAt);
      const cooldownMs = rule.cooldown * 60 * 1000;
      const nextAvailable = new Date(lastTime.getTime() + cooldownMs);

      if (new Date() < nextAvailable) {
        return {
          allowed: false,
          reason: 'cooldown_active',
          nextAvailableAt: nextAvailable,
        };
      }
    }
  }

  return { allowed: true };
}

/**
 * Adiciona FP ao usuário por uma ação
 */
export async function awardFP(
  userId: string,
  action: FPAction,
  options: {
    relatedEntityType?: string;
    relatedEntityId?: string;
    description?: string;
    bypassValidation?: boolean;
  } = {}
): Promise<FPTransactionResult> {
  try {
    const rule = getFPRule(action);

    // Validar se pode ganhar FP (a menos que seja bypass)
    if (!options.bypassValidation && rule.fpValue > 0) {
      const validation = await validateFPAction(userId, action);
      if (!validation.allowed) {
        return {
          success: false,
          amount: 0,
          newBalance: 0,
          reason: validation.reason,
          blocked: true,
        };
      }
    }

    // Buscar saldo atual
    const { data: user } = await supabase
      .from('User')
      .select('fpAvailable')
      .eq('id', userId)
      .single();

    if (!user) {
      return {
        success: false,
        amount: 0,
        newBalance: 0,
        reason: 'user_not_found',
      };
    }

    const currentBalance = user.fpAvailable || 0;
    const newBalance = Math.max(0, currentBalance + rule.fpValue);

    // Atualizar saldo
    const { error: updateError } = await supabase
      .from('User')
      .update({ fpAvailable: newBalance })
      .eq('id', userId);

    if (updateError) {
      console.error('[FP Service] Update error:', updateError);
      return {
        success: false,
        amount: 0,
        newBalance: currentBalance,
        reason: 'update_failed',
      };
    }

    // Registrar transação
    const { data: transaction, error: transactionError } = await supabase
      .from('FPTransaction')
      .insert({
        userId,
        amount: rule.fpValue,
        type: action,
        description: options.description || rule.description,
        relatedEntityType: options.relatedEntityType,
        relatedEntityId: options.relatedEntityId,
      })
      .select()
      .single();

    if (transactionError) {
      console.error('[FP Service] Transaction error:', transactionError);
    }

    return {
      success: true,
      amount: rule.fpValue,
      newBalance,
      transactionId: transaction?.id,
    };
  } catch (error) {
    console.error('[FP Service] Award error:', error);
    return {
      success: false,
      amount: 0,
      newBalance: 0,
      reason: 'internal_error',
    };
  }
}

/**
 * Deduz FP do usuário (para gastos)
 */
export async function spendFP(
  userId: string,
  amount: number,
  options: {
    action?: FPAction;
    relatedEntityType?: string;
    relatedEntityId?: string;
    description?: string;
  }
): Promise<FPTransactionResult> {
  try {
    // Buscar saldo atual
    const { data: user } = await supabase
      .from('User')
      .select('fpAvailable')
      .eq('id', userId)
      .single();

    if (!user) {
      return {
        success: false,
        amount: 0,
        newBalance: 0,
        reason: 'user_not_found',
      };
    }

    const currentBalance = user.fpAvailable || 0;

    // Validar saldo suficiente
    if (currentBalance < amount) {
      return {
        success: false,
        amount: 0,
        newBalance: currentBalance,
        reason: 'insufficient_balance',
      };
    }

    const newBalance = currentBalance - amount;

    // Atualizar saldo
    const { error: updateError } = await supabase
      .from('User')
      .update({ fpAvailable: newBalance })
      .eq('id', userId);

    if (updateError) {
      console.error('[FP Service] Spend update error:', updateError);
      return {
        success: false,
        amount: 0,
        newBalance: currentBalance,
        reason: 'update_failed',
      };
    }

    // Registrar transação
    const { data: transaction, error: transactionError } = await supabase
      .from('FPTransaction')
      .insert({
        userId,
        amount: -amount,
        type: options.action || 'FP_MANUAL_ADJUSTMENT',
        description: options.description || 'Gasto de FP',
        relatedEntityType: options.relatedEntityType,
        relatedEntityId: options.relatedEntityId,
      })
      .select()
      .single();

    if (transactionError) {
      console.error('[FP Service] Spend transaction error:', transactionError);
    }

    return {
      success: true,
      amount: -amount,
      newBalance,
      transactionId: transaction?.id,
    };
  } catch (error) {
    console.error('[FP Service] Spend error:', error);
    return {
      success: false,
      amount: 0,
      newBalance: 0,
      reason: 'internal_error',
    };
  }
}

/**
 * Busca histórico de FP do usuário
 */
export async function getFPHistory(
  userId: string,
  limit = 50,
  offset = 0
) {
  const { data, error } = await supabase
    .from('FPTransaction')
    .select('*')
    .eq('userId', userId)
    .order('createdAt', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('[FP Service] History error:', error);
    return [];
  }

  return data || [];
}

/**
 * Busca estatísticas de FP do usuário
 */
export async function getFPStats(userId: string) {
  const { data: user } = await supabase
    .from('User')
    .select('fpAvailable, fpTotal')
    .eq('id', userId)
    .single();

  // FP ganho hoje
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: todayTransactions } = await supabase
    .from('FPTransaction')
    .select('amount')
    .eq('userId', userId)
    .gte('createdAt', today.toISOString());

  const fpToday = (todayTransactions || [])
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  // FP gasto hoje
  const fpSpentToday = (todayTransactions || [])
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return {
    available: user?.fpAvailable || 0,
    total: user?.fpTotal || 0,
    earnedToday: fpToday,
    spentToday: fpSpentToday,
  };
}

/**
 * Helper específico para NFV (compatibilidade)
 */
export async function spendFPForVideo(
  userId: string,
  videoData: {
    arena_slug: string;
    movement_pattern: string;
  }
) {
  const fpCost = 25; // Configurável por arena

  const result = await spendFP(userId, fpCost, {
    action: 'VIDEO_ANALYSIS_SUBMITTED',
    relatedEntityType: 'VIDEO_ANALYSIS',
    relatedEntityId: null,
    description: `Análise de vídeo: ${videoData.movement_pattern}`,
  });

  return {
    success: result.success,
    fpSpent: result.success ? fpCost : 0,
    newBalance: result.newBalance,
    reason: result.reason,
  };
}
