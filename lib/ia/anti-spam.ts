/**
 * IA Anti-Spam System
 *
 * Controla frequencia de intervencoes da IA para evitar spam
 * e manter naturalidade nas conversas.
 *
 * REGRAS:
 * 1. Minimo 8 mensagens humanas desde ultima intervencao
 * 2. Cooldown de 10 minutos por usuario
 * 3. Maximo 2 intervencoes por dia por usuario
 * 4. Probabilidade base de 40% (ajustavel por comportamento)
 */

import { createClient } from '@supabase/supabase-js';

// ========================================
// CONFIGURACAO
// ========================================

export const ANTI_SPAM_CONFIG = {
  // Minimo de mensagens humanas antes de intervir novamente
  MIN_HUMAN_MESSAGES: 8,

  // Cooldown em minutos entre intervencoes para mesmo usuario
  COOLDOWN_MINUTES: 10,

  // Maximo de intervencoes por dia por usuario
  MAX_DAILY_INTERVENTIONS: 2,

  // Probabilidade base de intervencao (40%)
  BASE_PROBABILITY: 0.4,

  // Penalidade quando usuario ignora pergunta (reduz 50%)
  IGNORE_PENALTY: 0.5,

  // Bonus quando usuario responde (aumenta 20%)
  RESPONSE_BONUS: 1.2,

  // Minimo de probabilidade apos penalidades
  MIN_PROBABILITY: 0.1,

  // Maximo de probabilidade apos bonus
  MAX_PROBABILITY: 0.6,
};

// ========================================
// TIPOS
// ========================================

export interface AntiSpamResult {
  canIntervene: boolean;
  reason?: string;
  adjustedProbability: number;
  stats: {
    messagesSinceLastIntervention: number;
    minutesSinceLastIntervention: number;
    dailyInterventions: number;
    questionsIgnored: number;
  };
}

export interface MensagemRecente {
  id: string;
  autorId: string;
  isIA: boolean;
  timestamp: Date;
}

interface UserStats {
  interventions_received: number;
  questions_ignored: number;
  questions_answered: number;
  adjusted_probability: number;
  last_intervention_at: string | null;
}

// ========================================
// FUNCAO PRINCIPAL
// ========================================

/**
 * Verifica se a IA pode intervir baseado nas regras anti-spam
 */
export async function checkAntiSpam(
  userId: string,
  comunidadeSlug: string,
  recentMessages: MensagemRecente[],
  supabaseUrl?: string,
  supabaseKey?: string
): Promise<AntiSpamResult> {
  // Calcular mensagens humanas desde ultima intervencao da IA
  let humanMessagesSinceIA = 0;
  let lastIATimestamp: Date | null = null;

  // Percorrer mensagens de tras pra frente
  for (let i = recentMessages.length - 1; i >= 0; i--) {
    const msg = recentMessages[i];
    if (msg.isIA) {
      lastIATimestamp = msg.timestamp;
      break;
    }
    if (!msg.isIA && msg.autorId !== 'ia') {
      humanMessagesSinceIA++;
    }
  }

  // Se nao tem mensagem da IA, contar todas as humanas
  if (!lastIATimestamp) {
    humanMessagesSinceIA = recentMessages.filter(
      (m) => !m.isIA && m.autorId !== 'ia'
    ).length;
  }

  // Verificar minimo de mensagens
  if (humanMessagesSinceIA < ANTI_SPAM_CONFIG.MIN_HUMAN_MESSAGES) {
    return {
      canIntervene: false,
      reason: `Aguardando mais mensagens (${humanMessagesSinceIA}/${ANTI_SPAM_CONFIG.MIN_HUMAN_MESSAGES})`,
      adjustedProbability: 0,
      stats: {
        messagesSinceLastIntervention: humanMessagesSinceIA,
        minutesSinceLastIntervention: 0,
        dailyInterventions: 0,
        questionsIgnored: 0,
      },
    };
  }

  // Se nao tem Supabase configurado, usar apenas verificacao local
  if (!supabaseUrl || !supabaseKey) {
    return checkAntiSpamLocal(humanMessagesSinceIA, lastIATimestamp);
  }

  // Buscar stats do usuario no banco
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Buscar stats de hoje
    const { data: statsData } = await supabase
      .from('nfc_chat_ia_user_stats')
      .select('*')
      .eq('user_id', userId)
      .eq('stat_date', new Date().toISOString().split('T')[0])
      .single();

    const userStats: UserStats | null = statsData;

    // Calcular tempo desde ultima intervencao
    let minutesSinceLastIntervention = Infinity;
    if (userStats?.last_intervention_at) {
      const lastIntervention = new Date(userStats.last_intervention_at);
      minutesSinceLastIntervention =
        (Date.now() - lastIntervention.getTime()) / (1000 * 60);
    }

    // Verificar cooldown
    if (minutesSinceLastIntervention < ANTI_SPAM_CONFIG.COOLDOWN_MINUTES) {
      const remaining = Math.ceil(
        ANTI_SPAM_CONFIG.COOLDOWN_MINUTES - minutesSinceLastIntervention
      );
      return {
        canIntervene: false,
        reason: `Cooldown ativo (${remaining} min restantes)`,
        adjustedProbability: 0,
        stats: {
          messagesSinceLastIntervention: humanMessagesSinceIA,
          minutesSinceLastIntervention: Math.floor(minutesSinceLastIntervention),
          dailyInterventions: userStats?.interventions_received || 0,
          questionsIgnored: userStats?.questions_ignored || 0,
        },
      };
    }

    // Verificar limite diario
    const dailyInterventions = userStats?.interventions_received || 0;
    if (dailyInterventions >= ANTI_SPAM_CONFIG.MAX_DAILY_INTERVENTIONS) {
      return {
        canIntervene: false,
        reason: `Limite diario atingido (${dailyInterventions}/${ANTI_SPAM_CONFIG.MAX_DAILY_INTERVENTIONS})`,
        adjustedProbability: 0,
        stats: {
          messagesSinceLastIntervention: humanMessagesSinceIA,
          minutesSinceLastIntervention: Math.floor(minutesSinceLastIntervention),
          dailyInterventions,
          questionsIgnored: userStats?.questions_ignored || 0,
        },
      };
    }

    // Calcular probabilidade ajustada
    let adjustedProbability = userStats?.adjusted_probability || ANTI_SPAM_CONFIG.BASE_PROBABILITY;

    // Aplicar penalidade por perguntas ignoradas
    const questionsIgnored = userStats?.questions_ignored || 0;
    if (questionsIgnored > 0) {
      adjustedProbability *= Math.pow(
        ANTI_SPAM_CONFIG.IGNORE_PENALTY,
        questionsIgnored
      );
    }

    // Garantir limites
    adjustedProbability = Math.max(
      ANTI_SPAM_CONFIG.MIN_PROBABILITY,
      Math.min(ANTI_SPAM_CONFIG.MAX_PROBABILITY, adjustedProbability)
    );

    // Verificar probabilidade
    const random = Math.random();
    if (random > adjustedProbability) {
      return {
        canIntervene: false,
        reason: `Probabilidade nao atingida (${(random * 100).toFixed(0)}% > ${(adjustedProbability * 100).toFixed(0)}%)`,
        adjustedProbability,
        stats: {
          messagesSinceLastIntervention: humanMessagesSinceIA,
          minutesSinceLastIntervention: Math.floor(minutesSinceLastIntervention),
          dailyInterventions,
          questionsIgnored,
        },
      };
    }

    // Pode intervir!
    return {
      canIntervene: true,
      adjustedProbability,
      stats: {
        messagesSinceLastIntervention: humanMessagesSinceIA,
        minutesSinceLastIntervention: Math.floor(minutesSinceLastIntervention),
        dailyInterventions,
        questionsIgnored,
      },
    };
  } catch (error) {
    console.error('[Anti-Spam] Erro ao buscar stats:', error);
    // Fallback para verificacao local
    return checkAntiSpamLocal(humanMessagesSinceIA, lastIATimestamp);
  }
}

/**
 * Verificacao local (sem banco de dados)
 */
function checkAntiSpamLocal(
  humanMessagesSinceIA: number,
  lastIATimestamp: Date | null
): AntiSpamResult {
  // Calcular tempo desde ultima intervencao
  let minutesSinceLastIntervention = Infinity;
  if (lastIATimestamp) {
    minutesSinceLastIntervention =
      (Date.now() - lastIATimestamp.getTime()) / (1000 * 60);
  }

  // Verificar cooldown
  if (minutesSinceLastIntervention < ANTI_SPAM_CONFIG.COOLDOWN_MINUTES) {
    const remaining = Math.ceil(
      ANTI_SPAM_CONFIG.COOLDOWN_MINUTES - minutesSinceLastIntervention
    );
    return {
      canIntervene: false,
      reason: `Cooldown ativo (${remaining} min restantes)`,
      adjustedProbability: 0,
      stats: {
        messagesSinceLastIntervention: humanMessagesSinceIA,
        minutesSinceLastIntervention: Math.floor(minutesSinceLastIntervention),
        dailyInterventions: 0,
        questionsIgnored: 0,
      },
    };
  }

  // Verificar probabilidade base
  const random = Math.random();
  if (random > ANTI_SPAM_CONFIG.BASE_PROBABILITY) {
    return {
      canIntervene: false,
      reason: `Probabilidade nao atingida (${(random * 100).toFixed(0)}% > ${(ANTI_SPAM_CONFIG.BASE_PROBABILITY * 100).toFixed(0)}%)`,
      adjustedProbability: ANTI_SPAM_CONFIG.BASE_PROBABILITY,
      stats: {
        messagesSinceLastIntervention: humanMessagesSinceIA,
        minutesSinceLastIntervention: Math.floor(minutesSinceLastIntervention),
        dailyInterventions: 0,
        questionsIgnored: 0,
      },
    };
  }

  return {
    canIntervene: true,
    adjustedProbability: ANTI_SPAM_CONFIG.BASE_PROBABILITY,
    stats: {
      messagesSinceLastIntervention: humanMessagesSinceIA,
      minutesSinceLastIntervention: Math.floor(minutesSinceLastIntervention),
      dailyInterventions: 0,
      questionsIgnored: 0,
    },
  };
}

/**
 * Atualiza a probabilidade do usuario apos resposta ou ignorar
 */
export async function updateUserProbability(
  userId: string,
  action: 'answered' | 'ignored',
  supabaseUrl: string,
  supabaseKey: string
): Promise<void> {
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Buscar probabilidade atual
    const { data: statsData } = await supabase
      .from('nfc_chat_ia_user_stats')
      .select('adjusted_probability')
      .eq('user_id', userId)
      .eq('stat_date', new Date().toISOString().split('T')[0])
      .single();

    let currentProbability =
      statsData?.adjusted_probability || ANTI_SPAM_CONFIG.BASE_PROBABILITY;

    // Ajustar probabilidade
    if (action === 'answered') {
      currentProbability = Math.min(
        ANTI_SPAM_CONFIG.MAX_PROBABILITY,
        currentProbability * ANTI_SPAM_CONFIG.RESPONSE_BONUS
      );
    } else {
      currentProbability = Math.max(
        ANTI_SPAM_CONFIG.MIN_PROBABILITY,
        currentProbability * ANTI_SPAM_CONFIG.IGNORE_PENALTY
      );
    }

    // Atualizar no banco
    await supabase.rpc('upsert_user_ia_stats', {
      p_user_id: userId,
      p_increment_interventions: false,
      p_increment_ignored: action === 'ignored',
      p_increment_answered: action === 'answered',
      p_new_probability: currentProbability,
    });
  } catch (error) {
    console.error('[Anti-Spam] Erro ao atualizar probabilidade:', error);
  }
}
