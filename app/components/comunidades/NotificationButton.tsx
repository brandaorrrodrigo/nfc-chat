'use client';

import React, { useState, useEffect } from 'react';
import { Bell, BellRing, Loader2, Check } from 'lucide-react';
import { useComunidadesAuth } from './ComunidadesAuthContext';

interface NotificationButtonProps {
  communitySlug: string;
  communityTitle: string;
  variant?: 'compact' | 'full';
  className?: string;
  onLoginRequired?: () => void;
}

/**
 * Botão de Notificações para Comunidades
 *
 * - Não logado: mostra botão que pede login
 * - Logado + não inscrito: mostra "Notificações"
 * - Logado + inscrito: mostra "Inscrito" com check
 */
export default function NotificationButton({
  communitySlug,
  communityTitle,
  variant = 'compact',
  className = '',
  onLoginRequired
}: NotificationButtonProps) {
  const { isAuthenticated } = useComunidadesAuth();
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Verificar status ao montar (se logado)
  useEffect(() => {
    if (isAuthenticated) {
      checkSubscriptionStatus();
    }
  }, [isAuthenticated, communitySlug]);

  const checkSubscriptionStatus = async () => {
    try {
      const res = await fetch(`/api/comunidades/subscribe?community=${communitySlug}`);
      const data = await res.json();
      setSubscribed(data.subscribed || false);
    } catch (err) {
      console.error('Error checking subscription:', err);
    }
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Se não está logado, pedir login
    if (!isAuthenticated) {
      if (onLoginRequired) {
        onLoginRequired();
      } else {
        window.location.href = `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
      }
      return;
    }

    setLoading(true);

    try {
      if (subscribed) {
        // Cancelar
        const res = await fetch(`/api/comunidades/subscribe?community=${communitySlug}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          setSubscribed(false);
        }
      } else {
        // Inscrever
        const res = await fetch('/api/comunidades/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ communitySlug })
        });
        if (res.ok) {
          setSubscribed(true);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
        }
      }
    } catch (err) {
      console.error('Error toggling subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  // Estados visuais
  const isSubscribed = subscribed && isAuthenticated;
  const Icon = loading ? Loader2 : isSubscribed ? BellRing : Bell;

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className={`
          flex items-center gap-1.5
          px-2.5 py-1.5
          text-xs
          rounded-lg
          transition-all duration-300
          disabled:opacity-50
          ${isSubscribed
            ? 'text-amber-400 bg-amber-400/10 border border-amber-400/30 hover:bg-amber-400/20'
            : 'text-zinc-400 hover:text-amber-400 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 hover:border-amber-400/50'
          }
          ${className}
        `}
        title={isSubscribed ? 'Notificações ativas - clique para desativar' : 'Ativar notificações'}
      >
        <Icon className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : isSubscribed ? 'animate-pulse' : ''}`} />
        <span className="hidden sm:inline">
          {loading ? '...' : isSubscribed ? 'Inscrito' : 'Notificações'}
        </span>
        {showSuccess && <Check className="w-3 h-3 text-green-400" />}
      </button>
    );
  }

  // Variant full
  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`
        flex items-center justify-center gap-2
        px-4 py-2.5
        text-sm font-semibold
        rounded-xl
        transition-all duration-300
        disabled:opacity-50
        ${isSubscribed
          ? 'text-amber-400 bg-amber-400/10 border border-amber-400/30 hover:bg-amber-400/20'
          : 'text-zinc-300 hover:text-amber-400 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-amber-400/50'
        }
        ${className}
      `}
    >
      <Icon className={`w-4 h-4 ${loading ? 'animate-spin' : isSubscribed ? 'animate-pulse' : ''}`} />
      <span>
        {loading ? 'Processando...' : isSubscribed ? 'Notificações Ativas' : 'Ativar Notificações'}
      </span>
      {showSuccess && <Check className="w-4 h-4 text-green-400" />}
    </button>
  );
}
