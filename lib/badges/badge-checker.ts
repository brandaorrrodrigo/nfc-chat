/**
 * Badge Checker - Verificacao e Desbloqueio de Badges
 *
 * Verifica se usuario atingiu criterios para desbloquear badges
 * e persiste no banco de dados.
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { ALL_BADGES, BadgeDefinition, getBadgeById } from './badge-definitions';

// ==========================================
// TIPOS
// ==========================================

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  unlockedAt: Date;
  fpRewarded: number;
}

export interface UserStats {
  messageCount: number;
  streakDays: number;
  totalFP: number;
  reactionsReceived: number;
  arenasParticipated: number;
  topicsCreated: number;
  investigationsCompleted: number;
  communityMessageCounts: Record<string, number>;
  joinedAt: Date;
}

export interface BadgeCheckResult {
  newBadges: BadgeDefinition[];
  totalFPRewarded: number;
}

// ==========================================
// FUNCOES DE BANCO
// ==========================================

/**
 * Busca badges desbloqueadas do usuario
 */
export async function getUserBadges(userId: string): Promise<UserBadge[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('nfc_user_badges')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      if (error.message?.includes('does not exist')) {
        return [];
      }
      console.error('[Badges] Erro ao buscar badges:', error);
      return [];
    }

    return (data || []).map(d => ({
      id: d.id,
      userId: d.user_id,
      badgeId: d.badge_id,
      unlockedAt: new Date(d.unlocked_at),
      fpRewarded: d.fp_rewarded,
    }));
  } catch (error) {
    console.error('[Badges] Erro inesperado:', error);
    return [];
  }
}

/**
 * Salva badge desbloqueada
 */
export async function saveBadgeUnlock(
  userId: string,
  badgeId: string,
  fpRewarded: number
): Promise<string | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }

  try {
    const id = `badge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const { error } = await supabase
      .from('nfc_user_badges')
      .insert({
        id,
        user_id: userId,
        badge_id: badgeId,
        unlocked_at: new Date().toISOString(),
        fp_rewarded: fpRewarded,
      });

    if (error) {
      if (!error.message?.includes('does not exist')) {
        console.error('[Badges] Erro ao salvar badge:', error);
      }
      return null;
    }

    return id;
  } catch (error) {
    console.error('[Badges] Erro inesperado:', error);
    return null;
  }
}

/**
 * Busca estatisticas do usuario para verificacao de badges
 */
export async function getUserStatsForBadges(userId: string): Promise<UserStats | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }

  try {
    // Buscar contagem de mensagens
    const { count: messageCount } = await supabase
      .from('nfc_chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', userId)
      .eq('is_deleted', false);

    // Buscar streak do FP
    const { data: fpData } = await supabase
      .from('nfc_user_fp')
      .select('streak_current, balance, created_at')
      .eq('user_id', userId)
      .single();

    // Buscar reacoes recebidas
    const { count: reactionsReceived } = await supabase
      .from('nfc_chat_reactions')
      .select('*', { count: 'exact', head: true })
      .eq('message_author_id', userId);

    // Buscar arenas participadas (comunidades distintas com mensagens)
    const { data: arenasData } = await supabase
      .from('nfc_chat_messages')
      .select('comunidade_slug')
      .eq('author_id', userId)
      .eq('is_deleted', false);

    const arenasParticipated = new Set(arenasData?.map(d => d.comunidade_slug) || []).size;

    // Buscar topicos criados
    const { count: topicsCreated } = await supabase
      .from('nfc_chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', userId)
      .is('parent_id', null)
      .eq('is_deleted', false);

    // Buscar investigacoes completadas
    const { count: investigationsCompleted } = await supabase
      .from('nfc_chat_investigations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_complete', true);

    // Mensagens por comunidade
    const communityMessageCounts: Record<string, number> = {};
    if (arenasData) {
      for (const msg of arenasData) {
        communityMessageCounts[msg.comunidade_slug] = (communityMessageCounts[msg.comunidade_slug] || 0) + 1;
      }
    }

    return {
      messageCount: messageCount || 0,
      streakDays: fpData?.streak_current || 0,
      totalFP: fpData?.balance || 0,
      reactionsReceived: reactionsReceived || 0,
      arenasParticipated,
      topicsCreated: topicsCreated || 0,
      investigationsCompleted: investigationsCompleted || 0,
      communityMessageCounts,
      joinedAt: fpData?.created_at ? new Date(fpData.created_at) : new Date(),
    };
  } catch (error) {
    console.error('[Badges] Erro ao buscar stats:', error);
    return null;
  }
}

// ==========================================
// LOGICA DE VERIFICACAO
// ==========================================

/**
 * Verifica se usuario atingiu criterios para uma badge especifica
 */
function checkBadgeCriteria(badge: BadgeDefinition, stats: UserStats): boolean {
  const { criteria } = badge;

  switch (criteria.type) {
    case 'messages':
      if (criteria.communitySlug) {
        return (stats.communityMessageCounts[criteria.communitySlug] || 0) >= criteria.threshold;
      }
      return stats.messageCount >= criteria.threshold;

    case 'streak':
      return stats.streakDays >= criteria.threshold;

    case 'fp':
      return stats.totalFP >= criteria.threshold;

    case 'reactions':
      return stats.reactionsReceived >= criteria.threshold;

    case 'arenas':
      return stats.arenasParticipated >= criteria.threshold;

    case 'topics':
      return stats.topicsCreated >= criteria.threshold;

    case 'investigations':
      return stats.investigationsCompleted >= criteria.threshold;

    case 'special':
      // Early adopter: entrou nos primeiros 30 dias
      if (badge.id === 'early_adopter') {
        const launchDate = new Date('2024-12-01'); // Data de lancamento
        const daysSinceLaunch = Math.floor((stats.joinedAt.getTime() - launchDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysSinceLaunch <= 30;
      }
      return false;

    default:
      return false;
  }
}

/**
 * Verifica e desbloqueia novas badges para o usuario
 */
export async function checkAndUnlockBadges(userId: string): Promise<BadgeCheckResult> {
  const result: BadgeCheckResult = {
    newBadges: [],
    totalFPRewarded: 0,
  };

  // Buscar stats do usuario
  const stats = await getUserStatsForBadges(userId);
  if (!stats) {
    return result;
  }

  // Buscar badges ja desbloqueadas
  const unlockedBadges = await getUserBadges(userId);
  const unlockedIds = new Set(unlockedBadges.map(b => b.badgeId));

  // Verificar cada badge
  for (const badge of ALL_BADGES) {
    // Ja desbloqueada?
    if (unlockedIds.has(badge.id)) {
      continue;
    }

    // Atingiu criterios?
    if (checkBadgeCriteria(badge, stats)) {
      // Desbloquear!
      const savedId = await saveBadgeUnlock(userId, badge.id, badge.fpReward);

      if (savedId) {
        result.newBadges.push(badge);
        result.totalFPRewarded += badge.fpReward;

        console.log(`[Badges] Usuario ${userId} desbloqueou: ${badge.name} (+${badge.fpReward} FP)`);
      }
    }
  }

  return result;
}

/**
 * Retorna lista de badges com status de desbloqueio
 */
export async function getBadgesWithStatus(userId: string): Promise<{
  badge: BadgeDefinition;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}[]> {
  const unlockedBadges = await getUserBadges(userId);
  const unlockedMap = new Map(unlockedBadges.map(b => [b.badgeId, b]));

  const stats = await getUserStatsForBadges(userId);

  return ALL_BADGES.map(badge => {
    const unlocked = unlockedMap.get(badge.id);

    // Calcular progresso para badges nao desbloqueadas
    let progress: number | undefined;
    let maxProgress: number | undefined;

    if (!unlocked && stats) {
      maxProgress = badge.criteria.threshold;

      switch (badge.criteria.type) {
        case 'messages':
          if (badge.criteria.communitySlug) {
            progress = stats.communityMessageCounts[badge.criteria.communitySlug] || 0;
          } else {
            progress = stats.messageCount;
          }
          break;
        case 'streak':
          progress = stats.streakDays;
          break;
        case 'fp':
          progress = stats.totalFP;
          break;
        case 'reactions':
          progress = stats.reactionsReceived;
          break;
        case 'arenas':
          progress = stats.arenasParticipated;
          break;
        case 'topics':
          progress = stats.topicsCreated;
          break;
        case 'investigations':
          progress = stats.investigationsCompleted;
          break;
      }
    }

    return {
      badge,
      unlocked: !!unlocked,
      unlockedAt: unlocked?.unlockedAt,
      progress: progress !== undefined ? Math.min(progress, maxProgress || progress) : undefined,
      maxProgress,
    };
  });
}

export default {
  getUserBadges,
  saveBadgeUnlock,
  getUserStatsForBadges,
  checkAndUnlockBadges,
  getBadgesWithStatus,
};
