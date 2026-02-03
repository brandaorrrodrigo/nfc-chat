/**
 * Serviço de Ranking/Leaderboard
 * Rankings de FP, Streak, Contribuições
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export type RankingType = 'fp_total' | 'fp_monthly' | 'streak' | 'videos';

export interface RankingEntry {
  userId: string;
  userName: string;
  userAvatar?: string;
  value: number;
  rank: number;
}

/**
 * Busca ranking por FP total
 */
export async function getFPTotalRanking(limit = 10): Promise<RankingEntry[]> {
  try {
    const { data, error } = await supabase
      .from('User')
      .select('id, name, avatar, fpTotal')
      .order('fpTotal', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((user, index) => ({
      userId: user.id,
      userName: user.name || 'Usuário',
      userAvatar: user.avatar,
      value: user.fpTotal || 0,
      rank: index + 1,
    }));
  } catch (error) {
    console.error('[Leaderboard] FP Total error:', error);
    return [];
  }
}

/**
 * Busca ranking por FP do mês
 */
export async function getFPMonthlyRanking(limit = 10): Promise<RankingEntry[]> {
  try {
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .rpc('get_monthly_fp_ranking', {
        start_date: firstDayOfMonth.toISOString(),
        result_limit: limit,
      });

    if (error) {
      // Fallback se RPC não existir
      console.warn('[Leaderboard] RPC not found, using fallback');
      return [];
    }

    return (data || []).map((user: any, index: number) => ({
      userId: user.user_id,
      userName: user.user_name || 'Usuário',
      userAvatar: user.user_avatar,
      value: user.fp_earned || 0,
      rank: index + 1,
    }));
  } catch (error) {
    console.error('[Leaderboard] FP Monthly error:', error);
    return [];
  }
}

/**
 * Busca ranking por Streak
 */
export async function getStreakRanking(limit = 10): Promise<RankingEntry[]> {
  try {
    const { data, error } = await supabase
      .from('User')
      .select('id, name, avatar, currentStreak')
      .order('currentStreak', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((user, index) => ({
      userId: user.id,
      userName: user.name || 'Usuário',
      userAvatar: user.avatar,
      value: user.currentStreak || 0,
      rank: index + 1,
    }));
  } catch (error) {
    console.error('[Leaderboard] Streak error:', error);
    return [];
  }
}

/**
 * Busca ranking por vídeos NFV
 */
export async function getVideosRanking(limit = 10): Promise<RankingEntry[]> {
  try {
    const { data, error } = await supabase
      .from('nfc_chat_video_analyses')
      .select('user_id, user_name')
      .eq('status', 'APPROVED');

    if (error) throw error;

    // Contar vídeos por usuário
    const userCounts = new Map<string, { name: string; count: number }>();

    (data || []).forEach((video: any) => {
      const userId = video.user_id;
      const userName = video.user_name || 'Usuário';

      if (!userCounts.has(userId)) {
        userCounts.set(userId, { name: userName, count: 0 });
      }

      const current = userCounts.get(userId)!;
      current.count += 1;
    });

    // Converter para array e ordenar
    const ranking = Array.from(userCounts.entries())
      .map(([userId, data]) => ({
        userId,
        userName: data.name,
        value: data.count,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

    return ranking;
  } catch (error) {
    console.error('[Leaderboard] Videos error:', error);
    return [];
  }
}

/**
 * Busca ranking baseado no tipo
 */
export async function getRanking(
  type: RankingType,
  limit = 10
): Promise<RankingEntry[]> {
  switch (type) {
    case 'fp_total':
      return getFPTotalRanking(limit);
    case 'fp_monthly':
      return getFPMonthlyRanking(limit);
    case 'streak':
      return getStreakRanking(limit);
    case 'videos':
      return getVideosRanking(limit);
    default:
      return [];
  }
}

/**
 * Busca posição do usuário no ranking
 */
export async function getUserRank(
  userId: string,
  type: RankingType
): Promise<number | null> {
  try {
    const ranking = await getRanking(type, 1000); // Buscar top 1000
    const position = ranking.findIndex((entry) => entry.userId === userId);
    return position >= 0 ? position + 1 : null;
  } catch (error) {
    console.error('[Leaderboard] User rank error:', error);
    return null;
  }
}
