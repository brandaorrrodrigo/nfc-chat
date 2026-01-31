/**
 * FPContext - Contexto global para o sistema de FP
 *
 * Gerencia estado de FP, toasts e modals de achievement
 * de forma global, disponivel em toda a aplicacao.
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useFP } from '@/hooks/useFP';
import { FPToastContainer, useFPToasts } from '@/components/gamification/FPToast';
import { FPAchievementModal, useFPAchievementModal } from '@/components/gamification/FPAchievementModal';
import { FPWidget } from '@/components/gamification/FPWidget';

interface FPContextType {
  // Estado do FP
  balance: number;
  streak: number;
  streakBest: number;
  discountAvailable: number;
  loading: boolean;
  error: string | null;

  // Acoes
  earnFP: (action: string, metadata?: Record<string, unknown>) => Promise<{
    success: boolean;
    fpEarned: number;
    newBalance: number;
    streak: number;
    reason?: string;
  }>;
  claimDailyBonus: () => Promise<{
    success: boolean;
    fpEarned: number;
    newBalance: number;
    streak: number;
    reason?: string;
  }>;
  refresh: () => Promise<void>;

  // Toast
  showToast: (amount: number, action: string, isAchievement?: boolean, achievementName?: string) => void;

  // Achievement modal
  showAchievement: (type: string, fpAwarded?: number, title?: string, description?: string) => void;
}

const FPContext = createContext<FPContextType | undefined>(undefined);

interface FPProviderProps {
  children: React.ReactNode;
  userId?: string;
  showWidget?: boolean;
}

export function FPProvider({ children, userId, showWidget = true }: FPProviderProps) {
  const fp = useFP();
  const { toasts, addToast, removeToast } = useFPToasts();
  const achievementModal = useFPAchievementModal();

  // Mostra toast quando FP e ganho
  const showToast = useCallback((
    amount: number,
    action: string,
    isAchievement = false,
    achievementName?: string
  ) => {
    if (amount > 0) {
      addToast({ amount, action, isAchievement, achievementName });
    }
  }, [addToast]);

  // Mostra modal de achievement
  const showAchievement = useCallback((
    type: string,
    fpAwarded = 0,
    title?: string,
    description?: string
  ) => {
    achievementModal.showAchievement(type, fpAwarded, title, description);
  }, [achievementModal]);

  // Wrapper para earnFP que automaticamente mostra toast
  const earnFPWithToast = useCallback(async (
    action: string,
    metadata?: Record<string, unknown>
  ) => {
    const result = await fp.earnFP(action, metadata);

    if (result.success && result.fpEarned > 0) {
      showToast(result.fpEarned, action);
    }

    return result;
  }, [fp, showToast]);

  // Wrapper para claimDailyBonus que mostra toast
  const claimDailyBonusWithToast = useCallback(async () => {
    const result = await fp.claimDailyBonus();

    if (result.success && result.fpEarned > 0) {
      showToast(result.fpEarned, 'daily_access');
    }

    return result;
  }, [fp, showToast]);

  // Observa lastEarned do hook original para mostrar toast
  useEffect(() => {
    if (fp.lastEarned && fp.lastEarned.amount > 0) {
      // Ja esta sendo mostrado pelo wrapper, apenas limpa
      fp.clearLastEarned();
    }
  }, [fp.lastEarned, fp.clearLastEarned]);

  const value: FPContextType = {
    // Estado
    balance: fp.balance,
    streak: fp.streak,
    streakBest: fp.streakBest,
    discountAvailable: fp.discountAvailable,
    loading: fp.loading,
    error: fp.error,

    // Acoes
    earnFP: earnFPWithToast,
    claimDailyBonus: claimDailyBonusWithToast,
    refresh: fp.refresh,

    // UI
    showToast,
    showAchievement,
  };

  return (
    <FPContext.Provider value={value}>
      {children}

      {/* Toast container global */}
      <FPToastContainer toasts={toasts} onToastComplete={removeToast} />

      {/* Achievement modal global */}
      <FPAchievementModal
        isOpen={achievementModal.isOpen}
        onClose={achievementModal.closeModal}
        achievementType={achievementModal.achievementType}
        fpAwarded={achievementModal.fpAwarded}
        customTitle={achievementModal.customTitle}
        customDescription={achievementModal.customDescription}
      />

      {/* Widget flutuante */}
      {showWidget && userId && (
        <FPWidget userId={userId} showOnlyWhenLoggedIn={true} />
      )}
    </FPContext.Provider>
  );
}

export function useFPContext() {
  const context = useContext(FPContext);
  if (context === undefined) {
    throw new Error('useFPContext must be used within a FPProvider');
  }
  return context;
}

/**
 * Hook opcional que nao dispara erro se usado fora do provider
 */
export function useFPContextOptional() {
  return useContext(FPContext);
}

export default FPContext;
