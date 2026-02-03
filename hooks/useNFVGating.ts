'use client';

/**
 * Hook para check de FP + subscription combinado (gating NFV)
 */

import { useState, useCallback, useEffect } from 'react';
import { NFV_CONFIG } from '@/lib/biomechanics/nfv-config';

interface GatingState {
  isLoading: boolean;
  allowed: boolean;
  reason: 'subscription' | 'fp_sufficient' | 'fp_insufficient' | 'not_authenticated' | null;
  fpCost: number;
  fpBalance: number;
  hasSubscription: boolean;
  showModal: boolean;
}

interface UseNFVGatingReturn {
  gating: GatingState;
  checkPermission: () => Promise<void>;
  openGatingModal: () => void;
  closeGatingModal: () => void;
}

export function useNFVGating(
  userId: string | null,
  arenaSlug: string
): UseNFVGatingReturn {
  const [gating, setGating] = useState<GatingState>({
    isLoading: true,
    allowed: false,
    reason: null,
    fpCost: NFV_CONFIG.FP_VIDEO_UPLOAD_COST,
    fpBalance: 0,
    hasSubscription: false,
    showModal: false,
  });

  const checkPermission = useCallback(async () => {
    if (!userId) {
      setGating(prev => ({
        ...prev,
        isLoading: false,
        allowed: false,
        reason: 'not_authenticated',
      }));
      return;
    }

    setGating(prev => ({ ...prev, isLoading: true }));

    try {
      const res = await fetch(`/api/nfv/gating?userId=${userId}&arenaSlug=${arenaSlug}`);
      const data = await res.json();

      setGating(prev => ({
        ...prev,
        isLoading: false,
        allowed: data.allowed,
        reason: data.reason,
        fpCost: data.fpCost,
        fpBalance: data.fpBalance,
        hasSubscription: data.hasSubscription,
      }));
    } catch {
      setGating(prev => ({
        ...prev,
        isLoading: false,
        allowed: false,
        reason: 'fp_insufficient',
      }));
    }
  }, [userId, arenaSlug]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  const openGatingModal = useCallback(() => {
    setGating(prev => ({ ...prev, showModal: true }));
  }, []);

  const closeGatingModal = useCallback(() => {
    setGating(prev => ({ ...prev, showModal: false }));
  }, []);

  return { gating, checkPermission, openGatingModal, closeGatingModal };
}
