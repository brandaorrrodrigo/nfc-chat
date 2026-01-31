/**
 * AI Moderator - Sistema de Moderacao e Acolhimento
 *
 * Integra todas as funcionalidades de moderacao:
 * - Deteccao de novatos
 * - Analise de sentimento
 * - Geracao de respostas personalizadas
 * - Celebracao de conquistas
 * - Correcao de desinformacao
 *
 * FLUXO:
 * 1. Usuario cria mensagem
 * 2. Moderator analisa conteudo
 * 3. Decide tipo de resposta (ou nenhuma)
 * 4. Gera resposta personalizada
 * 5. Retorna com FP a ser concedido
 */

import { isNewUser, getUserStats, shouldWelcomeUser, type UserStats } from './user-detector';
import {
  analyzeContent,
  classifyMessageType,
  getMisinformationCorrection,
  type ContentAnalysis,
} from './sentiment-detector';
import {
  AI_RESPONSE_TEMPLATES,
  generateResponse,
  calculateFPReward,
  type TemplateContext,
} from './response-templates';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  generateInvestigativeResponse,
  type InvestigativeContext,
  type InvestigativeResponseResult,
} from '@/lib/ai/investigative-response';

// ========================================
// TIPOS
// ========================================

export interface ModerationInput {
  userId: string;
  userName: string;
  content: string;
  communitySlug: string;
  communityName?: string;
  messageId?: string;
}

export interface ModerationResult {
  shouldRespond: boolean;
  response?: string;
  responseType?: 'welcome' | 'emotional_support' | 'misinformation' | 'question' | 'achievement' | 'engagement' | 'regular' | 'investigation_start' | 'investigation_question' | 'investigation_diagnosis';
  fpAwarded: number;
  action: string;
  analysis?: ContentAnalysis;
  userStats?: UserStats;
  interventionId?: string;
  investigationId?: string;
  questionsRemaining?: number;
}

export interface ModerationConfig {
  enableWelcomeMessages: boolean;
  enableEmotionalSupport: boolean;
  enableMisinformationCorrection: boolean;
  enableAchievementCelebration: boolean;
  enableInvestigativeResponse: boolean;
  minMessageLengthForAnalysis: number;
  cooldownMinutes: number;
}

// ========================================
// CONFIGURACAO PADRAO
// ========================================

export const DEFAULT_MODERATION_CONFIG: ModerationConfig = {
  enableWelcomeMessages: true,
  enableEmotionalSupport: true,
  enableMisinformationCorrection: true,
  enableAchievementCelebration: true,
  enableInvestigativeResponse: true,
  minMessageLengthForAnalysis: 10,
  cooldownMinutes: 5,
};

// ========================================
// FUNCAO PRINCIPAL
// ========================================

/**
 * Modera uma mensagem e retorna resposta apropriada
 */
export async function moderateMessage(
  input: ModerationInput,
  config: Partial<ModerationConfig> = {}
): Promise<ModerationResult> {
  const cfg = { ...DEFAULT_MODERATION_CONFIG, ...config };

  // Resultado padrao
  const defaultResult: ModerationResult = {
    shouldRespond: false,
    fpAwarded: 0,
    action: 'none',
  };

  try {
    // 1. VERIFICAR SE E NOVATO (BOAS-VINDAS)
    if (cfg.enableWelcomeMessages) {
      const welcomeCheck = await shouldWelcomeUser(input.userId, input.communitySlug);

      if (welcomeCheck.shouldWelcome) {
        const fpAwarded = calculateFPReward('welcome', false);

        const response = generateResponse('WELCOME_NEW_USER', {
          userName: input.userName,
          communityName: input.communityName || input.communitySlug,
          fpAwarded,
        });

        // Salvar intervencao
        const interventionId = await saveModeratorIntervention({
          userId: input.userId,
          communitySlug: input.communitySlug,
          type: 'welcome',
          responseText: response,
          messageId: input.messageId,
        });

        return {
          shouldRespond: true,
          response,
          responseType: 'welcome',
          fpAwarded,
          action: 'welcome_new_user',
          interventionId,
        };
      }
    }

    // Mensagem muito curta - nao analisar
    if (input.content.length < cfg.minMessageLengthForAnalysis) {
      return {
        ...defaultResult,
        fpAwarded: 2, // FP basico por mensagem
        action: 'short_message',
      };
    }

    // 2. ANALISAR CONTEUDO
    const analysis = analyzeContent(input.content);
    const classification = classifyMessageType(analysis);

    // 3. BUSCAR STATS DO USUARIO
    const userStats = await getUserStats(input.userId, input.communitySlug);

    // 4. VERIFICAR COOLDOWN
    const canIntervene = await checkModerationCooldown(
      input.userId,
      input.communitySlug,
      cfg.cooldownMinutes
    );

    if (!canIntervene && classification.type !== 'misinformation') {
      // Desinformacao sempre corrige, independente de cooldown
      return {
        shouldRespond: false,
        fpAwarded: analysis.isLongMessage ? 5 : 2,
        action: 'cooldown_active',
        analysis,
        userStats,
      };
    }

    // 5. PROCESSAR POR TIPO
    let response: string | undefined;
    let fpAwarded = 0;
    let interventionId: string | undefined;

    switch (classification.type) {
      // DESINFORMACAO (PRIORIDADE MAXIMA)
      case 'misinformation':
        if (cfg.enableMisinformationCorrection && analysis.misinformationType) {
          const correction = getMisinformationCorrection(analysis.misinformationType);
          fpAwarded = calculateFPReward('misinformation', analysis.isLongMessage);

          response = generateResponse('MISINFORMATION_CORRECTION', {
            userName: input.userName,
            topic: analysis.mainTopic,
            correction: correction || 'A ciencia mostra algo diferente.',
            fpAwarded,
          });

          interventionId = await saveModeratorIntervention({
            userId: input.userId,
            communitySlug: input.communitySlug,
            type: 'misinformation',
            responseText: response,
            messageId: input.messageId,
          });
        }
        break;

      // SUPORTE EMOCIONAL
      case 'emotional_support':
        if (cfg.enableEmotionalSupport) {
          fpAwarded = calculateFPReward('emotional_support', analysis.isLongMessage);

          const templateType = analysis.emotion === 'ansiedade'
            ? 'EMOTIONAL_ANXIETY'
            : analysis.emotion === 'frustracao'
              ? 'EMOTIONAL_FRUSTRATION_RESULTS'
              : 'EMOTIONAL_VALIDATION';

          response = generateResponse(templateType, {
            userName: input.userName,
            emotion: analysis.emotion,
            topic: analysis.mainTopic !== 'geral' ? analysis.mainTopic : undefined,
            fpAwarded,
          });

          interventionId = await saveModeratorIntervention({
            userId: input.userId,
            communitySlug: input.communitySlug,
            type: 'emotional_support',
            responseText: response,
            messageId: input.messageId,
          });
        }
        break;

      // CONQUISTA
      case 'achievement':
        if (cfg.enableAchievementCelebration) {
          fpAwarded = calculateFPReward('achievement', analysis.isLongMessage);

          response = generateResponse('ACHIEVEMENT_CELEBRATION', {
            userName: input.userName,
            achievement: 'Sua conquista',
            fpAwarded,
          });

          interventionId = await saveModeratorIntervention({
            userId: input.userId,
            communitySlug: input.communitySlug,
            type: 'achievement',
            responseText: response,
            messageId: input.messageId,
          });
        }
        break;

      // PERGUNTA - Sistema de Investigacao Progressiva
      case 'question':
        if (cfg.enableInvestigativeResponse) {
          // Usar sistema de investigacao progressiva
          const investigativeContext: InvestigativeContext = {
            userId: input.userId,
            userName: input.userName,
            messageId: input.messageId || `msg_${Date.now()}`,
            comunidadeSlug: input.communitySlug,
            content: input.content,
            isReplyToIA: false,
          };

          const investigativeResult = await generateInvestigativeResponse(investigativeContext);

          if (investigativeResult.shouldRespond && investigativeResult.response) {
            fpAwarded = investigativeResult.fpAwarded;
            response = investigativeResult.response;

            interventionId = await saveModeratorIntervention({
              userId: input.userId,
              communitySlug: input.communitySlug,
              type: investigativeResult.responseType,
              responseText: response,
              messageId: input.messageId,
            });

            return {
              shouldRespond: true,
              response,
              responseType: investigativeResult.responseType as any,
              fpAwarded,
              action: investigativeResult.responseType,
              analysis,
              userStats,
              interventionId,
              investigationId: investigativeResult.investigationId,
              questionsRemaining: investigativeResult.questionsRemaining,
            };
          }
        }

        // Fallback: apenas calcular FP se investigacao nao responder
        fpAwarded = calculateFPReward('question', analysis.isLongMessage);
        break;

      // ENGAJAMENTO / REGULAR
      default:
        fpAwarded = analysis.isLongMessage ? 5 : 2;
        break;
    }

    return {
      shouldRespond: !!response,
      response,
      responseType: classification.type,
      fpAwarded,
      action: classification.type,
      analysis,
      userStats,
      interventionId,
    };

  } catch (error) {
    console.error('[Moderator] Erro ao moderar mensagem:', error);
    return {
      ...defaultResult,
      fpAwarded: 2, // FP basico mesmo com erro
      action: 'error',
    };
  }
}

// ========================================
// FUNCOES AUXILIARES
// ========================================

/**
 * Verifica cooldown de moderacao por usuario
 */
async function checkModerationCooldown(
  userId: string,
  communitySlug: string,
  cooldownMinutes: number
): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) {
    return true; // Se nao tem DB, permite
  }

  try {
    const cooldownTime = new Date(Date.now() - cooldownMinutes * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('nfc_chat_ia_interventions')
      .select('id')
      .eq('user_id', userId)
      .eq('comunidade_slug', communitySlug)
      .gte('created_at', cooldownTime)
      .limit(1);

    if (error) {
      // Tabela pode nao existir
      if (error.message?.includes('does not exist')) {
        return true;
      }
      console.error('[Moderator] Erro ao verificar cooldown:', error);
      return true;
    }

    return !data || data.length === 0;
  } catch {
    return true;
  }
}

/**
 * Salva intervencao do moderador no banco
 */
async function saveModeratorIntervention(params: {
  userId: string;
  communitySlug: string;
  type: string;
  responseText: string;
  messageId?: string;
}): Promise<string | undefined> {
  if (!isSupabaseConfigured() || !supabase) {
    return undefined;
  }

  try {
    const id = `mod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const { error } = await supabase
      .from('nfc_chat_ia_interventions')
      .insert({
        id,
        comunidade_slug: params.communitySlug,
        user_id: params.userId,
        trigger_message_id: params.messageId || null,
        intervention_type: params.type,
        intervention_text: params.responseText,
        follow_up_question: '',
        was_answered: false,
        created_at: new Date().toISOString(),
      });

    if (error) {
      // Tabela pode nao existir - nao e erro critico
      if (!error.message?.includes('does not exist')) {
        console.error('[Moderator] Erro ao salvar intervencao:', error);
      }
      return undefined;
    }

    return id;
  } catch (error) {
    console.error('[Moderator] Erro inesperado ao salvar:', error);
    return undefined;
  }
}

/**
 * Celebra streak do usuario
 */
export async function celebrateStreak(
  userId: string,
  userName: string,
  streakDays: number,
  fpTotal: number
): Promise<{ response: string; fpBonus: number } | null> {
  // Streaks especiais: 7, 14, 30, 60, 90, 180, 365
  const specialStreaks = [7, 14, 30, 60, 90, 180, 365];

  if (!specialStreaks.includes(streakDays)) {
    return null;
  }

  // Bonus proporcional ao streak
  const fpBonus = Math.floor(streakDays * 1.5);

  const response = generateResponse('STREAK_CELEBRATION', {
    userName,
    streakDays,
    fpAwarded: fpBonus,
    fpTotal: fpTotal + fpBonus,
  });

  return { response, fpBonus };
}

/**
 * Celebra milestone de FP
 */
export function celebrateFPMilestone(
  userName: string,
  fpTotal: number
): { response: string; milestone: number } | null {
  // Milestones: 100, 250, 500, 1000
  const milestones = [100, 250, 500, 1000];

  // Encontrar milestone alcancado
  const milestone = milestones.find(m => fpTotal >= m && fpTotal < m + 50);

  if (!milestone) {
    return null;
  }

  const response = generateResponse('FP_MILESTONE', {
    userName,
    customData: { milestone },
  });

  return { response, milestone };
}

// ========================================
// EXPORTS
// ========================================

export default {
  moderateMessage,
  celebrateStreak,
  celebrateFPMilestone,
  DEFAULT_MODERATION_CONFIG,
};
