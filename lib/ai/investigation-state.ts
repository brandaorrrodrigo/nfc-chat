/**
 * Investigation State - Gerenciamento do Estado de Investigação
 *
 * Mantém o estado de cada investigação em andamento:
 * - Quantas perguntas foram feitas
 * - Quantas respostas foram recebidas
 * - Se a investigação está completa
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { InvestigationQuestion } from './investigation-templates';

// ========================================
// TIPOS
// ========================================

export interface InvestigationState {
  id?: string;
  userId: string;
  postId: string;
  comunidadeSlug: string;
  topic: string;
  questionsAsked: number;
  answersReceived: number;
  askedQuestions: string[]; // Lista de perguntas já feitas
  isComplete: boolean;
  createdAt: Date;
  lastQuestionAt: Date;
}

// ========================================
// FUNÇÕES DE BANCO DE DADOS
// ========================================

/**
 * Salvar ou atualizar estado da investigação
 */
export async function saveInvestigationState(state: InvestigationState): Promise<string | null> {
  if (!isSupabaseConfigured() || !supabase) {
    console.warn('[Investigation] Supabase não configurado');
    return null;
  }

  try {
    const record = {
      user_id: state.userId,
      post_id: state.postId,
      comunidade_slug: state.comunidadeSlug,
      topic: state.topic,
      questions_asked: state.questionsAsked,
      answers_received: state.answersReceived,
      asked_questions: state.askedQuestions,
      is_complete: state.isComplete,
      last_question_at: state.lastQuestionAt.toISOString(),
    };

    if (state.id) {
      // Update existente
      const { error } = await supabase
        .from('nfc_chat_investigations')
        .update(record)
        .eq('id', state.id);

      if (error) {
        console.error('[Investigation] Erro ao atualizar:', error);
        return null;
      }
      return state.id;
    } else {
      // Insert novo
      const { data, error } = await supabase
        .from('nfc_chat_investigations')
        .insert({
          ...record,
          created_at: state.createdAt.toISOString(),
        })
        .select('id')
        .single();

      if (error) {
        // Tabela pode não existir
        if (error.message?.includes('does not exist')) {
          console.warn('[Investigation] Tabela não existe ainda');
          return null;
        }
        console.error('[Investigation] Erro ao inserir:', error);
        return null;
      }
      return data?.id || null;
    }
  } catch (error) {
    console.error('[Investigation] Erro inesperado:', error);
    return null;
  }
}

/**
 * Buscar estado da investigação por postId
 */
export async function getInvestigationState(postId: string): Promise<InvestigationState | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('nfc_chat_investigations')
      .select('*')
      .eq('post_id', postId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Não encontrado - ok
        return null;
      }
      if (error.message?.includes('does not exist')) {
        return null;
      }
      console.error('[Investigation] Erro ao buscar:', error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      userId: data.user_id,
      postId: data.post_id,
      comunidadeSlug: data.comunidade_slug,
      topic: data.topic,
      questionsAsked: data.questions_asked,
      answersReceived: data.answers_received,
      askedQuestions: data.asked_questions || [],
      isComplete: data.is_complete,
      createdAt: new Date(data.created_at),
      lastQuestionAt: new Date(data.last_question_at),
    };
  } catch (error) {
    console.error('[Investigation] Erro inesperado:', error);
    return null;
  }
}

/**
 * Buscar investigações ativas de um usuário em uma comunidade
 */
export async function getActiveInvestigations(
  userId: string,
  comunidadeSlug: string
): Promise<InvestigationState[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('nfc_chat_investigations')
      .select('*')
      .eq('user_id', userId)
      .eq('comunidade_slug', comunidadeSlug)
      .eq('is_complete', false)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      if (error.message?.includes('does not exist')) {
        return [];
      }
      console.error('[Investigation] Erro ao buscar ativas:', error);
      return [];
    }

    return (data || []).map(d => ({
      id: d.id,
      userId: d.user_id,
      postId: d.post_id,
      comunidadeSlug: d.comunidade_slug,
      topic: d.topic,
      questionsAsked: d.questions_asked,
      answersReceived: d.answers_received,
      askedQuestions: d.asked_questions || [],
      isComplete: d.is_complete,
      createdAt: new Date(d.created_at),
      lastQuestionAt: new Date(d.last_question_at),
    }));
  } catch (error) {
    console.error('[Investigation] Erro inesperado:', error);
    return [];
  }
}

/**
 * Marcar investigação como completa
 */
export async function completeInvestigation(investigationId: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) {
    return false;
  }

  try {
    const { error } = await supabase
      .from('nfc_chat_investigations')
      .update({ is_complete: true })
      .eq('id', investigationId);

    if (error) {
      console.error('[Investigation] Erro ao completar:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('[Investigation] Erro inesperado:', error);
    return false;
  }
}

// ========================================
// FUNÇÕES DE LÓGICA
// ========================================

/**
 * Verifica se deve fazer a próxima pergunta
 */
export function shouldAskNextQuestion(
  state: InvestigationState,
  flow: InvestigationQuestion
): boolean {
  // Já completou
  if (state.isComplete) return false;

  // Ainda não tem respostas suficientes
  if (state.answersReceived < flow.requiredAnswers) {
    // E ainda tem perguntas para fazer
    if (state.questionsAsked < flow.questions.length) {
      return true;
    }
  }

  return false;
}

/**
 * Pega a próxima pergunta que ainda não foi feita
 */
export function getNextQuestion(
  state: InvestigationState,
  flow: InvestigationQuestion
): string | null {
  // Encontrar pergunta que ainda não foi feita
  for (const question of flow.questions) {
    if (!state.askedQuestions.includes(question)) {
      return question;
    }
  }
  return null;
}

/**
 * Verifica se investigação está pronta para diagnóstico final
 */
export function isReadyForDiagnosis(
  state: InvestigationState,
  flow: InvestigationQuestion
): boolean {
  return (
    !state.isComplete &&
    state.answersReceived >= flow.requiredAnswers
  );
}

/**
 * Cria um novo estado de investigação
 */
export function createNewInvestigationState(
  userId: string,
  postId: string,
  comunidadeSlug: string,
  topic: string
): InvestigationState {
  return {
    userId,
    postId,
    comunidadeSlug,
    topic,
    questionsAsked: 0,
    answersReceived: 0,
    askedQuestions: [],
    isComplete: false,
    createdAt: new Date(),
    lastQuestionAt: new Date(),
  };
}

export default {
  saveInvestigationState,
  getInvestigationState,
  getActiveInvestigations,
  completeInvestigation,
  shouldAskNextQuestion,
  getNextQuestion,
  isReadyForDiagnosis,
  createNewInvestigationState,
};
