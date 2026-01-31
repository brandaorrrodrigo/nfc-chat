/**
 * useBadges - Hook para Sistema de Badges
 *
 * Busca badges do usuario e verifica novas conquistas.
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import type { BadgeDefinition, BadgeCategory, BadgeRarity } from '@/lib/badges';

// ==========================================
// TIPOS
// ==========================================

export interface BadgeWithStatus {
  badge: {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: BadgeCategory;
    rarity: BadgeRarity;
    fpReward: number;
  };
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface BadgesResponse {
  success: boolean;
  badges: BadgeWithStatus[];
  byCategory: Record<string, BadgeWithStatus[]>;
  stats: {
    unlocked: number;
    total: number;
    percentage: number;
  };
}

export interface CheckBadgesResponse {
  success: boolean;
  newBadges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    category: BadgeCategory;
    rarity: BadgeRarity;
    fpReward: number;
  }>;
  totalFPRewarded: number;
  hasNewBadges: boolean;
}

export interface UseBadgesReturn {
  badges: BadgeWithStatus[];
  byCategory: Record<string, BadgeWithStatus[]>;
  stats: { unlocked: number; total: number; percentage: number } | null;
  isLoading: boolean;
  error: string | null;
  fetchBadges: (userId: string) => Promise<void>;
  checkBadges: (userId: string) => Promise<CheckBadgesResponse | null>;
  newBadges: CheckBadgesResponse['newBadges'];
  clearNewBadges: () => void;
}

// ==========================================
// HOOK
// ==========================================

export function useBadges(): UseBadgesReturn {
  const [badges, setBadges] = useState<BadgeWithStatus[]>([]);
  const [byCategory, setByCategory] = useState<Record<string, BadgeWithStatus[]>>({});
  const [stats, setStats] = useState<{ unlocked: number; total: number; percentage: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newBadges, setNewBadges] = useState<CheckBadgesResponse['newBadges']>([]);

  /**
   * Busca badges do usuario
   */
  const fetchBadges = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/badges?userId=${userId}`);
      const data: BadgesResponse = await response.json();

      if (!data.success) {
        throw new Error(data.success ? '' : 'Erro ao buscar badges');
      }

      setBadges(data.badges);
      setByCategory(data.byCategory);
      setStats(data.stats);

    } catch (err: any) {
      console.error('[useBadges] Erro:', err);
      setError(err.message || 'Erro ao buscar badges');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Verifica e desbloqueia novas badges
   */
  const checkBadges = useCallback(async (userId: string): Promise<CheckBadgesResponse | null> => {
    try {
      const response = await fetch('/api/badges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data: CheckBadgesResponse = await response.json();

      if (data.success && data.hasNewBadges) {
        setNewBadges(data.newBadges);
        // Recarregar badges
        await fetchBadges(userId);
      }

      return data;

    } catch (err: any) {
      console.error('[useBadges] Erro ao verificar:', err);
      return null;
    }
  }, [fetchBadges]);

  /**
   * Limpa lista de novas badges (apos mostrar notificacao)
   */
  const clearNewBadges = useCallback(() => {
    setNewBadges([]);
  }, []);

  return {
    badges,
    byCategory,
    stats,
    isLoading,
    error,
    fetchBadges,
    checkBadges,
    newBadges,
    clearNewBadges,
  };
}

export default useBadges;
