/**
 * Serviço de Badges - Verificação e concessão automática
 * Verifica critérios e concede badges quando atingidos
 */

import { createClient } from '@supabase/supabase-js';
import { ALL_BADGES, BadgeDefinition, getBadgeById } from './badge-definitions';
import { onBadgeEarned } from '../fp/fp-hooks';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface UserBadge {
  id: string;
  userId: string;
  badgeType: string;
  name: string;
  icon: string;
  earnedAt: string;
}

/**
 * Verifica e concede todos os badges que o usuário merece
 */
export async function checkAndAwardBadges(userId: string): Promise<BadgeDefinition[]> {
  try {
    // Buscar badges já conquistados
    const { data: earnedBadges } = await supabase
      .from('UserBadge')
      .select('badgeType')
      .eq('userId', userId);

    const earnedTypes = new Set((earnedBadges || []).map(b => b.badgeType));

    // Buscar estatísticas do usuário
    const stats = await getUserStats(userId);

    // Verificar cada badge
    const newBadges: BadgeDefinition[] = [];

    for (const badge of ALL_BADGES) {
      // Pular se já tem
      if (earnedTypes.has(badge.id)) continue;

      // Verificar critério
      const earned = checkBadgeCriteria(badge, stats);

      if (earned) {
        const success = await awardBadge(userId, badge);
        if (success) {
          newBadges.push(badge);
        }
      }
    }

    return newBadges;
  } catch (error) {
    console.error('[Badge Service] Check error:', error);
    return [];
  }
}

/**
 * Concede um badge específico ao usuário
 */
export async function awardBadge(
  userId: string,
  badge: BadgeDefinition
): Promise<boolean> {
  try {
    // Verificar se já tem
    const { data: existing } = await supabase
      .from('UserBadge')
      .select('id')
      .eq('userId', userId)
      .eq('badgeType', badge.id)
      .single();

    if (existing) return false;

    // Criar badge
    const { error } = await supabase
      .from('UserBadge')
      .insert({
        userId,
        badgeType: badge.id,
        name: badge.name,
        icon: badge.icon,
      });

    if (error) {
      console.error('[Badge Service] Award error:', error);
      return false;
    }

    // Dar FP reward
    if (badge.fpReward > 0) {
      await onBadgeEarned(userId, badge.id, badge.name);
    }

    console.log(`[Badge Service] Awarded ${badge.name} to user ${userId}`);
    return true;
  } catch (error) {
    console.error('[Badge Service] Award error:', error);
    return false;
  }
}

/**
 * Busca badges do usuário
 */
export async function getUserBadges(userId: string): Promise<UserBadge[]> {
  try {
    const { data, error } = await supabase
      .from('UserBadge')
      .select('*')
      .eq('userId', userId)
      .order('earnedAt', { ascending: false });

    if (error) {
      console.error('[Badge Service] Get badges error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('[Badge Service] Get badges error:', error);
    return [];
  }
}

/**
 * Busca estatísticas do usuário para verificação de badges
 */
async function getUserStats(userId: string): Promise<Record<string, number>> {
  try {
    // Buscar dados do usuário
    const { data: user } = await supabase
      .from('User')
      .select('fpTotal, currentStreak, longestStreak')
      .eq('id', userId)
      .single();

    // Contar posts
    const { count: postsCount } = await supabase
      .from('Post')
      .select('id', { count: 'exact', head: true })
      .eq('authorId', userId);

    // Contar comentários
    const { count: commentsCount } = await supabase
      .from('Comment')
      .select('id', { count: 'exact', head: true })
      .eq('authorId', userId);

    // Contar likes recebidos em posts
    const { count: likesCount } = await supabase
      .from('PostLike')
      .select('postId', { count: 'exact', head: true })
      .in('postId',
        supabase.from('Post').select('id').eq('authorId', userId) as any
      );

    // Contar best answers
    const { count: bestAnswersCount } = await supabase
      .from('Comment')
      .select('id', { count: 'exact', head: true })
      .eq('authorId', userId)
      .eq('isBestAnswer', true);

    // Contar vídeos NFV enviados
    const { count: videosCount } = await supabase
      .from('nfc_chat_video_analyses')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    return {
      fpTotal: user?.fpTotal || 0,
      currentStreak: user?.currentStreak || 0,
      longestStreak: user?.longestStreak || 0,
      postsCreated: postsCount || 0,
      commentsCreated: commentsCount || 0,
      likesReceived: likesCount || 0,
      bestAnswers: bestAnswersCount || 0,
      videosSubmitted: videosCount || 0,
      messages: (postsCount || 0) + (commentsCount || 0),
    };
  } catch (error) {
    console.error('[Badge Service] Get stats error:', error);
    return {};
  }
}

/**
 * Verifica se usuário atende critério do badge
 */
function checkBadgeCriteria(
  badge: BadgeDefinition,
  stats: Record<string, number>
): boolean {
  const { criteria } = badge;
  const value = stats[criteria.type] || 0;

  return value >= criteria.threshold;
}

/**
 * Busca progresso do usuário para próximos badges
 */
export async function getBadgeProgress(userId: string) {
  try {
    const stats = await getUserStats(userId);
    const earned = await getUserBadges(userId);
    const earnedTypes = new Set(earned.map(b => b.badgeType));

    // Próximos badges disponíveis
    const nextBadges = ALL_BADGES
      .filter(b => !earnedTypes.has(b.id))
      .map(badge => {
        const value = stats[badge.criteria.type] || 0;
        const progress = Math.min(100, (value / badge.criteria.threshold) * 100);

        return {
          badge,
          progress,
          current: value,
          required: badge.criteria.threshold,
          remaining: Math.max(0, badge.criteria.threshold - value),
        };
      })
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 5); // Top 5 próximos

    return {
      earned: earned.length,
      total: ALL_BADGES.length,
      nextBadges,
    };
  } catch (error) {
    console.error('[Badge Service] Progress error:', error);
    return { earned: 0, total: 0, nextBadges: [] };
  }
}
