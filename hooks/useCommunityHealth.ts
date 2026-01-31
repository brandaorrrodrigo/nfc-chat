/**
 * useCommunityHealth - Hook para Sistema de Saúde da Comunidade
 *
 * Busca e monitora métricas de saúde da comunidade.
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { HealthMetrics, HealthStatus, HealthAlert } from '@/lib/community-health';

// ==========================================
// TIPOS
// ==========================================

export interface UseCommunityHealthReturn {
  metrics: HealthMetrics | null;
  status: HealthStatus | null;
  score: number | null;
  alerts: HealthAlert[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  fetchHealth: (skipCache?: boolean) => Promise<void>;
  triggerCheck: () => Promise<void>;
}

export interface UseCommunityHealthOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // ms
  period?: 'day' | 'week' | 'month';
}

// ==========================================
// HOOK
// ==========================================

export function useCommunityHealth(
  communitySlug: string,
  options: UseCommunityHealthOptions = {}
): UseCommunityHealthReturn {
  const {
    autoRefresh = false,
    refreshInterval = 5 * 60 * 1000, // 5 minutos
    period = 'day',
  } = options;

  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Busca métricas de saúde
   */
  const fetchHealth = useCallback(async (skipCache: boolean = false) => {
    if (!communitySlug) return;

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        communitySlug,
        period,
        ...(skipCache && { skipCache: 'true' }),
      });

      const response = await fetch(`/api/community-health?${params}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao buscar métricas');
      }

      setMetrics(data.metrics);
      setLastUpdated(new Date());

    } catch (err: any) {
      console.error('[useCommunityHealth] Erro:', err);
      setError(err.message || 'Erro ao buscar métricas');
    } finally {
      setIsLoading(false);
    }
  }, [communitySlug, period]);

  /**
   * Dispara verificação manual com webhooks
   */
  const triggerCheck = useCallback(async () => {
    if (!communitySlug) return;

    setIsLoading(true);
    setError(null);

    try {
      const previousStatus = metrics?.overallStatus;

      const response = await fetch('/api/community-health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          communitySlug,
          previousStatus,
          notifyWebhooks: true,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao verificar saúde');
      }

      setMetrics(data.metrics);
      setLastUpdated(new Date());

      console.log(`[useCommunityHealth] Check completo. Webhooks: ${data.webhooksTriggered}`);

    } catch (err: any) {
      console.error('[useCommunityHealth] Erro no check:', err);
      setError(err.message || 'Erro ao verificar saúde');
    } finally {
      setIsLoading(false);
    }
  }, [communitySlug, metrics?.overallStatus]);

  // Buscar métricas inicialmente
  useEffect(() => {
    if (communitySlug) {
      fetchHealth();
    }
  }, [communitySlug, fetchHealth]);

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh && communitySlug) {
      intervalRef.current = setInterval(() => {
        fetchHealth();
      }, refreshInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval, communitySlug, fetchHealth]);

  return {
    metrics,
    status: metrics?.overallStatus || null,
    score: metrics?.overallScore ?? null,
    alerts: metrics?.alerts || [],
    isLoading,
    error,
    lastUpdated,
    fetchHealth,
    triggerCheck,
  };
}

export default useCommunityHealth;
