/**
 * Intervention Tracker
 *
 * Rastreia intervencoes da IA e detecta perguntas ignoradas
 * para ajustar comportamento futuro.
 *
 * FUNCOES:
 * 1. Salvar nova intervencao
 * 2. Marcar intervencao como respondida
 * 3. Detectar perguntas ignoradas
 * 4. Atualizar estatisticas do usuario
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { updateUserProbability, ANTI_SPAM_CONFIG } from './anti-spam';

// ========================================
// TIPOS
// ========================================

export interface InterventionRecord {
  comunidadeSlug: string;
  userId: string;
  triggerMessageId?: string;
  interventionType: string;
  interventionText: string;
  followUpQuestion: string;
}

export interface SavedIntervention {
  id: string;
  comunidade_slug: string;
  user_id: string;
  trigger_message_id: string | null;
  intervention_type: string;
  intervention_text: string;
  follow_up_question: string;
  was_answered: boolean;
  answer_message_id: string | null;
  answered_at: string | null;
  created_at: string;
}

export interface MensagemParaVerificacao {
  id: string;
  texto: string;
  autorId: string;
  timestamp: Date;
}

// ========================================
// CONFIGURACAO
// ========================================

const IGNORED_THRESHOLD = 3; // Numero de mensagens do usuario apos pergunta para considerar ignorada

// ========================================
// FUNCOES PRINCIPAIS
// ========================================

/**
 * Salva uma nova intervencao da IA no banco
 */
export async function saveIntervention(
  record: InterventionRecord,
  supabaseUrl: string,
  supabaseKey: string
): Promise<string | null> {
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data, error } = await supabase
      .from('nfc_chat_ia_interventions')
      .insert({
        comunidade_slug: record.comunidadeSlug,
        user_id: record.userId,
        trigger_message_id: record.triggerMessageId || null,
        intervention_type: record.interventionType,
        intervention_text: record.interventionText,
        follow_up_question: record.followUpQuestion,
        was_answered: false,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[Intervention Tracker] Erro ao salvar:', error);
      return null;
    }

    // Atualizar stats do usuario (incrementar intervencoes recebidas)
    await supabase.rpc('upsert_user_ia_stats', {
      p_user_id: record.userId,
      p_increment_interventions: true,
      p_increment_ignored: false,
      p_increment_answered: false,
      p_new_probability: null,
    });

    console.log('[Intervention Tracker] Intervencao salva:', data.id);
    return data.id;
  } catch (error) {
    console.error('[Intervention Tracker] Erro ao salvar intervencao:', error);
    return null;
  }
}

/**
 * Marca uma intervencao como respondida
 */
export async function markInterventionAnswered(
  interventionId: string,
  answerMessageId: string,
  supabaseUrl: string,
  supabaseKey: string
): Promise<void> {
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Buscar intervencao para pegar user_id
    const { data: intervention } = await supabase
      .from('nfc_chat_ia_interventions')
      .select('user_id')
      .eq('id', interventionId)
      .single();

    if (!intervention) {
      console.error('[Intervention Tracker] Intervencao nao encontrada:', interventionId);
      return;
    }

    // Atualizar intervencao
    const { error } = await supabase
      .from('nfc_chat_ia_interventions')
      .update({
        was_answered: true,
        answer_message_id: answerMessageId,
        answered_at: new Date().toISOString(),
      })
      .eq('id', interventionId);

    if (error) {
      console.error('[Intervention Tracker] Erro ao marcar respondida:', error);
      return;
    }

    // Atualizar probabilidade do usuario (bonus por responder)
    await updateUserProbability(
      intervention.user_id,
      'answered',
      supabaseUrl,
      supabaseKey
    );

    console.log('[Intervention Tracker] Intervencao marcada como respondida:', interventionId);
  } catch (error) {
    console.error('[Intervention Tracker] Erro ao marcar intervencao:', error);
  }
}

/**
 * Busca a ultima intervencao nao respondida para um usuario em uma comunidade
 */
export async function getLastUnansweredIntervention(
  userId: string,
  comunidadeSlug: string,
  supabaseUrl: string,
  supabaseKey: string
): Promise<SavedIntervention | null> {
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data, error } = await supabase
      .from('nfc_chat_ia_interventions')
      .select('*')
      .eq('user_id', userId)
      .eq('comunidade_slug', comunidadeSlug)
      .eq('was_answered', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      console.error('[Intervention Tracker] Erro ao buscar intervencao:', error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error('[Intervention Tracker] Erro ao buscar intervencao:', error);
    return null;
  }
}

/**
 * Verifica e marca perguntas ignoradas baseado nas mensagens recentes
 *
 * Criterios para considerar ignorada:
 * 1. IA fez pergunta para usuario X
 * 2. Usuario X enviou 3+ mensagens depois
 * 3. Nenhuma foi resposta direta a pergunta
 */
export async function checkIgnoredQuestions(
  comunidadeSlug: string,
  recentMessages: MensagemParaVerificacao[],
  supabaseUrl: string,
  supabaseKey: string
): Promise<void> {
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Buscar intervencoes nao respondidas nesta comunidade
    const { data: unansweredInterventions, error } = await supabase
      .from('nfc_chat_ia_interventions')
      .select('*')
      .eq('comunidade_slug', comunidadeSlug)
      .eq('was_answered', false)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error || !unansweredInterventions || unansweredInterventions.length === 0) {
      return;
    }

    for (const intervention of unansweredInterventions as SavedIntervention[]) {
      // Contar mensagens do usuario apos a intervencao
      const interventionTime = new Date(intervention.created_at);
      const userMessagesAfter = recentMessages.filter(
        (msg) =>
          msg.autorId === intervention.user_id &&
          msg.timestamp > interventionTime
      );

      // Se o usuario enviou 3+ mensagens apos a pergunta
      if (userMessagesAfter.length >= IGNORED_THRESHOLD) {
        // Verificar se alguma mensagem parece ser resposta
        const pareceResposta = userMessagesAfter.some((msg) =>
          isLikelyResponse(msg.texto, intervention.follow_up_question)
        );

        if (!pareceResposta) {
          // Marcar como ignorada
          await markInterventionIgnored(
            intervention.id,
            intervention.user_id,
            supabase,
            supabaseUrl,
            supabaseKey
          );
        }
      }
    }
  } catch (error) {
    console.error('[Intervention Tracker] Erro ao verificar perguntas ignoradas:', error);
  }
}

/**
 * Marca intervencao como ignorada e penaliza usuario
 */
async function markInterventionIgnored(
  interventionId: string,
  userId: string,
  supabase: SupabaseClient,
  supabaseUrl: string,
  supabaseKey: string
): Promise<void> {
  try {
    // Deletar ou marcar intervencao (opcional - pode manter para historico)
    // Por enquanto, vamos apenas atualizar a probabilidade

    // Atualizar probabilidade do usuario (penalidade por ignorar)
    await updateUserProbability(userId, 'ignored', supabaseUrl, supabaseKey);

    console.log('[Intervention Tracker] Pergunta marcada como ignorada para usuario:', userId);
  } catch (error) {
    console.error('[Intervention Tracker] Erro ao marcar como ignorada:', error);
  }
}

/**
 * Verifica se uma mensagem parece ser resposta a uma pergunta
 */
function isLikelyResponse(mensagem: string, pergunta: string): boolean {
  const msgLower = mensagem.toLowerCase();
  const perguntaLower = pergunta.toLowerCase();

  // Extrair palavras-chave da pergunta (excluindo palavras comuns)
  const stopWords = [
    'voce', 'como', 'qual', 'quais', 'que', 'onde', 'quando', 'porque',
    'pra', 'para', 'com', 'sem', 'mais', 'menos', 'sua', 'seu', 'isso',
    'esse', 'essa', 'nesse', 'nessa', 'ainda', 'ja', 'tem', 'ter', 'foi',
    'ser', 'esta', 'esta', 'sao', 'sobre', 'uma', 'um', 'uns', 'umas'
  ];

  const palavrasPergunta = perguntaLower
    .split(/\s+/)
    .filter((p) => p.length > 3 && !stopWords.includes(p));

  // Verificar se a mensagem contem pelo menos uma palavra-chave da pergunta
  const contemPalavraChave = palavrasPergunta.some((palavra) =>
    msgLower.includes(palavra)
  );

  // Verificar se a mensagem parece ser uma resposta direta
  const padroeResposta = [
    /^sim[,.]?\s/i,
    /^nao[,.]?\s/i,
    /^acho que/i,
    /^pra mim/i,
    /^no meu caso/i,
    /^eu (tambem|sempre|nunca|geralmente)/i,
    /^quanto a isso/i,
    /^sobre isso/i,
    /^respondendo/i,
  ];

  const pareceRespostaDireta = padroeResposta.some((padrao) =>
    padrao.test(msgLower)
  );

  return contemPalavraChave || pareceRespostaDireta;
}

/**
 * Detecta se a mensagem atual e uma resposta a uma intervencao pendente
 */
export async function detectResponseToIntervention(
  userId: string,
  comunidadeSlug: string,
  mensagem: string,
  messageId: string,
  supabaseUrl: string,
  supabaseKey: string
): Promise<boolean> {
  // Buscar ultima intervencao nao respondida
  const intervention = await getLastUnansweredIntervention(
    userId,
    comunidadeSlug,
    supabaseUrl,
    supabaseKey
  );

  if (!intervention) {
    return false;
  }

  // Verificar se a mensagem parece ser resposta
  if (isLikelyResponse(mensagem, intervention.follow_up_question)) {
    // Marcar como respondida
    await markInterventionAnswered(
      intervention.id,
      messageId,
      supabaseUrl,
      supabaseKey
    );
    return true;
  }

  return false;
}
