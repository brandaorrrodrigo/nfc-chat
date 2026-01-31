/**
 * User Detector - Deteccao de Novatos e Stats de Usuario
 *
 * Detecta se o usuario e novo (primeiro post), veterano,
 * e fornece estatisticas para personalizacao de respostas.
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// ========================================
// TIPOS
// ========================================

export interface UserStats {
  userId: string;
  postCount: number;
  messageCount: number;
  fpTotal: number;
  streakDays: number;
  firstPostAt: Date | null;
  lastActiveAt: Date | null;
  isNew: boolean;
  isActive: boolean;
  isVeteran: boolean;
  isSuperActive: boolean;
}

export interface UserLevel {
  level: 'novato' | 'participante' | 'ativo' | 'veterano' | 'lider';
  label: string;
  minMessages: number;
  fpMultiplier: number;
}

// ========================================
// NIVEIS DE USUARIO
// ========================================

const USER_LEVELS: UserLevel[] = [
  { level: 'novato', label: 'Novato', minMessages: 0, fpMultiplier: 1.5 },
  { level: 'participante', label: 'Participante', minMessages: 5, fpMultiplier: 1.0 },
  { level: 'ativo', label: 'Membro Ativo', minMessages: 20, fpMultiplier: 1.0 },
  { level: 'veterano', label: 'Veterano', minMessages: 100, fpMultiplier: 0.8 },
  { level: 'lider', label: 'Lider', minMessages: 500, fpMultiplier: 0.7 },
];

// ========================================
// FUNCOES PRINCIPAIS
// ========================================

/**
 * Verifica se e o primeiro post do usuario na comunidade
 * NOTA: Esta funcao é chamada APÓS a mensagem já ter sido salva,
 * portanto consideramos "novo" se count <= 1 (apenas a mensagem atual)
 */
export async function isNewUser(
  userId: string,
  comunidadeSlug?: string
): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) {
    console.warn('[UserDetector] Supabase nao configurado');
    return false;
  }

  try {
    let query = supabase
      .from('nfc_chat_messages')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (comunidadeSlug) {
      query = query.eq('comunidade_slug', comunidadeSlug);
    }

    const { count, error } = await query;

    if (error) {
      console.error('[UserDetector] Erro ao verificar usuario:', error);
      return false;
    }

    // count <= 1 porque a mensagem atual JÁ foi salva antes de chamar moderatePost
    return (count ?? 0) <= 1;
  } catch (error) {
    console.error('[UserDetector] Erro inesperado:', error);
    return false;
  }
}

/**
 * Obtem estatisticas completas do usuario
 */
export async function getUserStats(
  userId: string,
  comunidadeSlug?: string
): Promise<UserStats> {
  const defaultStats: UserStats = {
    userId,
    postCount: 0,
    messageCount: 0,
    fpTotal: 0,
    streakDays: 0,
    firstPostAt: null,
    lastActiveAt: null,
    isNew: true,
    isActive: false,
    isVeteran: false,
    isSuperActive: false,
  };

  if (!isSupabaseConfigured() || !supabase) {
    console.warn('[UserDetector] Supabase nao configurado');
    return defaultStats;
  }

  try {
    // Buscar contagem de mensagens
    let messagesQuery = supabase
      .from('nfc_chat_messages')
      .select('id, created_at', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (comunidadeSlug) {
      messagesQuery = messagesQuery.eq('comunidade_slug', comunidadeSlug);
    }

    const { data: messages, count: messageCount, error: msgError } = await messagesQuery;

    if (msgError) {
      console.error('[UserDetector] Erro ao buscar mensagens:', msgError);
      return defaultStats;
    }

    // Buscar FP do usuario
    let fpTotal = 0;
    let streakDays = 0;

    try {
      const { data: fpData, error: fpError } = await supabase
        .from('nfc_fp_balances')
        .select('balance, streak_days')
        .eq('user_id', userId)
        .single();

      if (!fpError && fpData) {
        fpTotal = fpData.balance || 0;
        streakDays = fpData.streak_days || 0;
      }
    } catch {
      // Tabela de FP pode nao existir
    }

    const count = messageCount ?? 0;
    const firstPost = messages && messages.length > 0 ? new Date(messages[0].created_at) : null;
    const lastPost = messages && messages.length > 0
      ? new Date(messages[messages.length - 1].created_at)
      : null;

    return {
      userId,
      postCount: count, // Considerando mensagens como posts
      messageCount: count,
      fpTotal,
      streakDays,
      firstPostAt: firstPost,
      lastActiveAt: lastPost,
      isNew: count <= 1, // <= 1 porque a mensagem atual JÁ foi salva
      isActive: count >= 5 && count < 100,
      isVeteran: count >= 100 || fpTotal >= 500,
      isSuperActive: count >= 20 && streakDays >= 7,
    };
  } catch (error) {
    console.error('[UserDetector] Erro inesperado:', error);
    return defaultStats;
  }
}

/**
 * Determina o nivel do usuario baseado em atividade
 */
export function getUserLevel(stats: UserStats): UserLevel {
  const messageCount = stats.messageCount;

  // Percorrer niveis do maior para menor
  for (let i = USER_LEVELS.length - 1; i >= 0; i--) {
    if (messageCount >= USER_LEVELS[i].minMessages) {
      return USER_LEVELS[i];
    }
  }

  return USER_LEVELS[0]; // Novato por padrao
}

/**
 * Verifica se usuario merece bonus de boas-vindas
 */
export async function shouldWelcomeUser(
  userId: string,
  comunidadeSlug: string
): Promise<{
  shouldWelcome: boolean;
  userName?: string;
  reason: string;
}> {
  if (!isSupabaseConfigured() || !supabase) {
    return { shouldWelcome: false, reason: 'Supabase nao configurado' };
  }

  try {
    // Verificar se ja foi dado boas-vindas nesta comunidade
    const { data: welcomed, error: welcomeError } = await supabase
      .from('nfc_chat_ia_interventions')
      .select('id')
      .eq('user_id', userId)
      .eq('comunidade_slug', comunidadeSlug)
      .eq('intervention_type', 'welcome')
      .limit(1);

    if (welcomeError && !welcomeError.message?.includes('does not exist')) {
      console.error('[UserDetector] Erro ao verificar boas-vindas:', welcomeError);
    }

    if (welcomed && welcomed.length > 0) {
      return { shouldWelcome: false, reason: 'Ja recebeu boas-vindas nesta comunidade' };
    }

    // Verificar se e primeiro post
    const isNew = await isNewUser(userId, comunidadeSlug);

    if (!isNew) {
      return { shouldWelcome: false, reason: 'Nao e primeiro post' };
    }

    // Buscar nome do usuario
    const { data: userMsg } = await supabase
      .from('nfc_chat_messages')
      .select('user_name')
      .eq('user_id', userId)
      .limit(1)
      .single();

    return {
      shouldWelcome: true,
      userName: userMsg?.user_name || 'Usuario',
      reason: 'Primeiro post do usuario na comunidade',
    };
  } catch (error) {
    console.error('[UserDetector] Erro ao verificar boas-vindas:', error);
    return { shouldWelcome: false, reason: 'Erro ao verificar' };
  }
}

/**
 * Busca usuarios similares (para conexao)
 */
export async function findSimilarUsers(
  userId: string,
  comunidadeSlug: string,
  interests: string[],
  limit: number = 3
): Promise<Array<{
  userId: string;
  userName: string;
  commonInterests: string[];
}>> {
  if (!isSupabaseConfigured() || !supabase) {
    return [];
  }

  try {
    // Buscar usuarios ativos na comunidade (exceto o proprio)
    const { data: activeUsers, error } = await supabase
      .from('nfc_chat_messages')
      .select('user_id, user_name, content')
      .eq('comunidade_slug', comunidadeSlug)
      .neq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error || !activeUsers) {
      return [];
    }

    // Agrupar por usuario e analisar conteudo
    const userContents = new Map<string, { name: string; texts: string[] }>();

    for (const msg of activeUsers) {
      const existing = userContents.get(msg.user_id);
      if (existing) {
        existing.texts.push(msg.content);
      } else {
        userContents.set(msg.user_id, {
          name: msg.user_name,
          texts: [msg.content],
        });
      }
    }

    // Encontrar usuarios com interesses similares
    const similar: Array<{
      userId: string;
      userName: string;
      commonInterests: string[];
    }> = [];

    for (const [uid, data] of userContents) {
      const allText = data.texts.join(' ').toLowerCase();
      const common = interests.filter((interest) =>
        allText.includes(interest.toLowerCase())
      );

      if (common.length > 0) {
        similar.push({
          userId: uid,
          userName: data.name,
          commonInterests: common,
        });
      }
    }

    // Ordenar por mais interesses em comum
    similar.sort((a, b) => b.commonInterests.length - a.commonInterests.length);

    return similar.slice(0, limit);
  } catch (error) {
    console.error('[UserDetector] Erro ao buscar usuarios similares:', error);
    return [];
  }
}

export default {
  isNewUser,
  getUserStats,
  getUserLevel,
  shouldWelcomeUser,
  findSimilarUsers,
};
