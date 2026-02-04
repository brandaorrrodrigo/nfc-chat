/**
 * Hook: useFP
 * Gerencia estado de FP no cliente
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { FP_CONFIG, FPStats } from '@/lib/fp/config';

interface FPEarnedEvent {
  amount: number;
  action: string;
  timestamp: number;
}

interface UseFPReturn {
  // Estado
  balance: number;
  streak: number;
  streakBest: number;
  discountAvailable: number;
  fpToNextPercent: number;
  loading: boolean;
  error: string | null;

  // Ações
  refresh: () => Promise<void>;
  earnFP: (action: string, metadata?: Record<string, unknown>) => Promise<FPEarnResult>;
  claimDailyBonus: () => Promise<FPEarnResult>;

  // Eventos
  lastEarned: FPEarnedEvent | null;
  clearLastEarned: () => void;
}

interface FPEarnResult {
  success: boolean;
  fpEarned: number;
  newBalance: number;
  streak: number;
  reason?: string;
}

export function useFP(): UseFPReturn {
  const [stats, setStats] = useState<FPStats>({
    balance: 0,
    streak: 0,
    streakBest: 0,
    totalEarned: 0,
    discountAvailable: 0,
    fpToNextPercent: FP_CONFIG.FP_PER_PERCENT,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastEarned, setLastEarned] = useState<FPEarnedEvent | null>(null);

  const dailyBonusClaimed = useRef(false);

  // Carrega stats do servidor
  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/fp/balance');

      // 401 = não logado, apenas usa defaults sem erro
      if (response.status === 401) {
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Falha ao carregar FP');
      }

      const data = await response.json();

      if (data.success && data.data) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('[useFP] Erro ao carregar:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega ao montar
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Ganha FP
  const earnFP = useCallback(async (
    action: string,
    metadata?: Record<string, unknown>
  ): Promise<FPEarnResult> => {
    try {
      const response = await fetch('/api/fp/earn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, metadata }),
      });

      const data = await response.json();

      if (data.success && data.fpEarned > 0) {
        // Atualiza estado local
        setStats(prev => ({
          ...prev,
          balance: data.newBalance,
          streak: data.streak,
          streakBest: Math.max(prev.streakBest, data.streak),
        }));

        // Registra evento para toast
        setLastEarned({
          amount: data.fpEarned,
          action,
          timestamp: Date.now(),
        });
      }

      return {
        success: data.success,
        fpEarned: data.fpEarned || 0,
        newBalance: data.newBalance || stats.balance,
        streak: data.streak || stats.streak,
        reason: data.reason,
      };
    } catch (err) {
      console.error('[useFP] Erro ao ganhar FP:', err);
      return {
        success: false,
        fpEarned: 0,
        newBalance: stats.balance,
        streak: stats.streak,
        reason: 'network_error',
      };
    }
  }, [stats.balance, stats.streak]);

  // Claim daily bonus
  const claimDailyBonus = useCallback(async (): Promise<FPEarnResult> => {
    if (dailyBonusClaimed.current) {
      return {
        success: false,
        fpEarned: 0,
        newBalance: stats.balance,
        streak: stats.streak,
        reason: 'already_claimed_locally',
      };
    }

    const result = await earnFP(FP_CONFIG.ACTIONS.DAILY_ACCESS);

    if (result.success) {
      dailyBonusClaimed.current = true;
    }

    return result;
  }, [earnFP, stats.balance, stats.streak]);

  // Limpa evento de FP ganho
  const clearLastEarned = useCallback(() => {
    setLastEarned(null);
  }, []);

  return {
    balance: stats.balance,
    streak: stats.streak,
    streakBest: stats.streakBest,
    discountAvailable: stats.discountAvailable,
    fpToNextPercent: stats.fpToNextPercent,
    loading,
    error,
    refresh,
    earnFP,
    claimDailyBonus,
    lastEarned,
    clearLastEarned,
  };
}
