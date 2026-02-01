/**
 * useAIModerator - Hook para Moderacao IA
 *
 * Hook React para integrar moderacao automatica nas comunidades.
 * Analisa mensagens e retorna respostas da IA quando necessario.
 *
 * USO:
 * ```tsx
 * const { moderatePost, isProcessing, lastResult } = useAIModerator();
 *
 * async function handleSubmit() {
 *   const result = await moderatePost({
 *     userId: session.user.id,
 *     userName: session.user.name,
 *     content: message,
 *     communitySlug: slug,
 *   });
 *
 *   if (result?.moderation.shouldRespond) {
 *     // IA quer responder - criar mensagem da IA
 *     await createAIMessage(result.moderation.response);
 *   }
 *
 *   if (result?.fp.awarded > 0) {
 *     // Mostrar toast de FP
 *     showFPToast(result.fp.awarded);
 *   }
 * }
 * ```
 */

'use client';

import { useState, useCallback } from 'react';

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
  checkStreak?: boolean;
  checkFPMilestone?: boolean;
}

export interface ModerationResponse {
  success: boolean;
  moderation: {
    shouldRespond: boolean;
    response?: string;
    responseType?: string;
    action: string;
    interventionId?: string;
    investigationId?: string;
    questionsRemaining?: number;
  };
  fp: {
    awarded: number;
    action: string;
  };
  analysis?: {
    sentiment: string;
    mainTopic: string;
    isQuestion: boolean;
    needsEmotionalSupport: boolean;
    hasMisinformation: boolean;
  };
  celebrations?: {
    streak?: {
      response: string;
      fpBonus: number;
    };
    fpMilestone?: {
      response: string;
      milestone: number;
    };
  };
  error?: string;
}

export interface UseAIModeratorReturn {
  moderatePost: (input: ModerationInput) => Promise<ModerationResponse | null>;
  isProcessing: boolean;
  lastResult: ModerationResponse | null;
  error: string | null;
  clearError: () => void;
  clearLastResult: () => void;
}

// ========================================
// HOOK
// ========================================

export function useAIModerator(): UseAIModeratorReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<ModerationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Modera um post/mensagem
   */
  const moderatePost = useCallback(async (
    input: ModerationInput
  ): Promise<ModerationResponse | null> => {
    setIsProcessing(true);
    setError(null);

    console.log('🔵 [useAIModerator] Iniciando moderação:', {
      communitySlug: input.communitySlug,
      userName: input.userName,
      contentPreview: input.content.substring(0, 100),
    });

    try {
      const response = await fetch('/api/ai/moderate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      console.log('🔵 [useAIModerator] Resposta HTTP:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('🔴 [useAIModerator] Erro na API:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data: ModerationResponse = await response.json();

      console.log('✅ [useAIModerator] Moderação concluída:', {
        success: data.success,
        shouldRespond: data.moderation?.shouldRespond,
        responseType: data.moderation?.responseType,
        fpAwarded: data.fp?.awarded,
      });

      setLastResult(data);
      return data;

    } catch (err: any) {
      console.error('🔴 [useAIModerator] Erro:', err);
      setError(err.message || 'Erro ao processar moderacao');
      return null;

    } finally {
      setIsProcessing(false);
    }
  }, []);

  /**
   * Limpa erro
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Limpa ultimo resultado
   */
  const clearLastResult = useCallback(() => {
    setLastResult(null);
  }, []);

  return {
    moderatePost,
    isProcessing,
    lastResult,
    error,
    clearError,
    clearLastResult,
  };
}

// ========================================
// HOOK SIMPLIFICADO PARA CELEBRACOES
// ========================================

export interface CelebrationResult {
  type: 'streak' | 'fp_milestone' | 'achievement';
  response: string;
  fpBonus?: number;
  milestone?: number;
}

export function useCelebrations() {
  const [celebrations, setCelebrations] = useState<CelebrationResult[]>([]);

  /**
   * Adiciona celebracao a fila
   */
  const addCelebration = useCallback((celebration: CelebrationResult) => {
    setCelebrations(prev => [...prev, celebration]);
  }, []);

  /**
   * Remove celebracao da fila
   */
  const removeCelebration = useCallback((index: number) => {
    setCelebrations(prev => prev.filter((_, i) => i !== index));
  }, []);

  /**
   * Processa resultado de moderacao para celebracoes
   */
  const processModerationResult = useCallback((result: ModerationResponse) => {
    if (result.celebrations?.streak) {
      addCelebration({
        type: 'streak',
        response: result.celebrations.streak.response,
        fpBonus: result.celebrations.streak.fpBonus,
      });
    }

    if (result.celebrations?.fpMilestone) {
      addCelebration({
        type: 'fp_milestone',
        response: result.celebrations.fpMilestone.response,
        milestone: result.celebrations.fpMilestone.milestone,
      });
    }
  }, [addCelebration]);

  /**
   * Celebracao atual (primeira da fila)
   */
  const currentCelebration = celebrations[0] || null;

  /**
   * Consome celebracao atual
   */
  const dismissCelebration = useCallback(() => {
    removeCelebration(0);
  }, [removeCelebration]);

  return {
    celebrations,
    currentCelebration,
    addCelebration,
    removeCelebration,
    dismissCelebration,
    processModerationResult,
    hasCelebrations: celebrations.length > 0,
  };
}

// ========================================
// EXPORTS
// ========================================

export default useAIModerator;
