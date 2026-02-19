/**
 * Serviço de Streak - Sistema de dias consecutivos
 * Incentiva retorno diário com bônus progressivos
 */

import { createClient } from '@supabase/supabase-js';
import { awardFP } from '../fp/fp-service';
import { onStreakMilestone } from '../fp/fp-hooks';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface StreakData {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastLoginDate: string;
  streakBonusesClaimed: number[];
  isActive: boolean;
  nextMilestone?: {
    days: number;
    bonus: number;
    daysLeft: number;
  };
}

const STREAK_MILESTONES = [7, 30, 90, 365];

/**
 * Atualiza streak do usuário no login
 */
export async function updateStreakOnLogin(
  userId: string
): Promise<{ success: boolean; streakData: StreakData; bonusAwarded?: number }> {
  try {
    // 1. Buscar dados atuais do usuário
    const { data: user } = await supabase
      .from('User')
      .select('currentStreak, longestStreak, lastLoginDate, streakBonusesClaimed')
      .eq('id', userId)
      .single();

    if (!user) {
      return {
        success: false,
        streakData: getDefaultStreakData(userId),
      };
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate) : null;
    const lastLoginDay = lastLogin
      ? new Date(lastLogin.getFullYear(), lastLogin.getMonth(), lastLogin.getDate())
      : null;

    let currentStreak = user.currentStreak || 0;
    let longestStreak = user.longestStreak || 0;
    let bonusesClaimed = user.streakBonusesClaimed || [];
    let bonusAwarded: number | undefined;

    // 2. Calcular novo streak
    if (!lastLoginDay) {
      // Primeiro login
      currentStreak = 1;
    } else {
      const daysDiff = Math.floor(
        (today.getTime() - lastLoginDay.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 0) {
        // Já fez login hoje - não alterar streak
        return {
          success: true,
          streakData: buildStreakData(user, userId),
        };
      } else if (daysDiff === 1) {
        // Login consecutivo
        currentStreak += 1;
      } else {
        // Perdeu o streak
        currentStreak = 1;
        bonusesClaimed = []; // Reset bônus
      }
    }

    // 3. Atualizar longest streak
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }

    // 4. Checar milestones e dar bônus
    for (const milestone of STREAK_MILESTONES) {
      if (currentStreak === milestone && !bonusesClaimed.includes(milestone)) {
        // Dar bônus de streak
        const result = await onStreakMilestone(userId, milestone);
        if (result.success) {
          bonusesClaimed.push(milestone);
          bonusAwarded = (result as any).amount;
        }
      }
    }

    // 5. Atualizar no banco
    await supabase
      .from('User')
      .update({
        currentStreak,
        longestStreak,
        lastLoginDate: now.toISOString(),
        streakBonusesClaimed: bonusesClaimed,
      })
      .eq('id', userId);

    // 6. Award FP por login diário
    await awardFP(userId, 'DAILY_LOGIN', {
      description: `Login diário - Streak: ${currentStreak} dias`,
    });

    const streakData: StreakData = {
      userId,
      currentStreak,
      longestStreak,
      lastLoginDate: now.toISOString(),
      streakBonusesClaimed: bonusesClaimed,
      isActive: true,
      nextMilestone: getNextMilestone(currentStreak, bonusesClaimed),
    };

    return {
      success: true,
      streakData,
      bonusAwarded,
    };
  } catch (error) {
    console.error('[Streak Service] Update error:', error);
    return {
      success: false,
      streakData: getDefaultStreakData(userId),
    };
  }
}

/**
 * Busca dados de streak do usuário
 */
export async function getStreakData(userId: string): Promise<StreakData> {
  try {
    const { data: user } = await supabase
      .from('User')
      .select('currentStreak, longestStreak, lastLoginDate, streakBonusesClaimed')
      .eq('id', userId)
      .single();

    if (!user) {
      return getDefaultStreakData(userId);
    }

    return buildStreakData(user, userId);
  } catch (error) {
    console.error('[Streak Service] Get error:', error);
    return getDefaultStreakData(userId);
  }
}

/**
 * Verifica se streak está em risco (próximo de expirar)
 */
export async function isStreakAtRisk(userId: string): Promise<boolean> {
  try {
    const { data: user } = await supabase
      .from('User')
      .select('lastLoginDate')
      .eq('id', userId)
      .single();

    if (!user?.lastLoginDate) return false;

    const lastLogin = new Date(user.lastLoginDate);
    const now = new Date();
    const hoursSinceLogin = (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60);

    // Em risco se passou mais de 18 horas sem login
    return hoursSinceLogin >= 18 && hoursSinceLogin < 48;
  } catch (error) {
    console.error('[Streak Service] Risk check error:', error);
    return false;
  }
}

/**
 * Retorna ranking de streaks
 */
export async function getStreakLeaderboard(limit = 10) {
  try {
    const { data: users } = await supabase
      .from('User')
      .select('id, name, currentStreak, longestStreak')
      .order('currentStreak', { ascending: false })
      .limit(limit);

    return users || [];
  } catch (error) {
    console.error('[Streak Service] Leaderboard error:', error);
    return [];
  }
}

// ========================================
// HELPERS
// ========================================

function getDefaultStreakData(userId: string): StreakData {
  return {
    userId,
    currentStreak: 0,
    longestStreak: 0,
    lastLoginDate: new Date().toISOString(),
    streakBonusesClaimed: [],
    isActive: false,
    nextMilestone: getNextMilestone(0, []),
  };
}

function buildStreakData(user: any, userId: string): StreakData {
  const currentStreak = user.currentStreak || 0;
  const bonusesClaimed = user.streakBonusesClaimed || [];

  return {
    userId,
    currentStreak,
    longestStreak: user.longestStreak || 0,
    lastLoginDate: user.lastLoginDate || new Date().toISOString(),
    streakBonusesClaimed: bonusesClaimed,
    isActive: currentStreak > 0,
    nextMilestone: getNextMilestone(currentStreak, bonusesClaimed),
  };
}

function getNextMilestone(
  currentStreak: number,
  bonusesClaimed: number[]
): { days: number; bonus: number; daysLeft: number } | undefined {
  const nextMilestone = STREAK_MILESTONES.find(
    (m) => m > currentStreak || !bonusesClaimed.includes(m)
  );

  if (!nextMilestone) return undefined;

  const bonusMap: Record<number, number> = {
    7: 20,
    30: 50,
    90: 100,
    365: 500,
  };

  return {
    days: nextMilestone,
    bonus: bonusMap[nextMilestone],
    daysLeft: Math.max(0, nextMilestone - currentStreak),
  };
}
