'use client';

import { useState, useCallback } from 'react';

interface SubscriptionState {
  subscribed: boolean;
  loading: boolean;
  error: string | null;
}

/**
 * Hook para gerenciar inscrição em notificações de comunidades
 */
export function useCommunitySubscription(communitySlug: string) {
  const [state, setState] = useState<SubscriptionState>({
    subscribed: false,
    loading: false,
    error: null
  });

  // Verificar status de inscrição
  const checkSubscription = useCallback(async () => {
    try {
      const res = await fetch(`/api/comunidades/subscribe?community=${communitySlug}`);
      const data = await res.json();

      setState(prev => ({
        ...prev,
        subscribed: data.subscribed || false,
        error: null
      }));

      return data;
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message }));
      return null;
    }
  }, [communitySlug]);

  // Toggle inscrição
  const toggleSubscription = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      if (state.subscribed) {
        // Cancelar inscrição
        const res = await fetch(`/api/comunidades/subscribe?community=${communitySlug}`, {
          method: 'DELETE'
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Erro ao cancelar inscrição');
        }

        setState({ subscribed: false, loading: false, error: null });
        return { success: true, subscribed: false };
      } else {
        // Inscrever-se
        const res = await fetch('/api/comunidades/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ communitySlug })
        });
        const data = await res.json();

        if (!res.ok) {
          if (res.status === 401) {
            // Usuário não logado
            return { success: false, requiresAuth: true, error: data.error };
          }
          throw new Error(data.error || 'Erro ao ativar notificações');
        }

        setState({ subscribed: true, loading: false, error: null });
        return { success: true, subscribed: true, message: data.message };
      }
    } catch (err: any) {
      setState(prev => ({ ...prev, loading: false, error: err.message }));
      return { success: false, error: err.message };
    }
  }, [communitySlug, state.subscribed]);

  return {
    ...state,
    checkSubscription,
    toggleSubscription
  };
}

export default useCommunitySubscription;
