'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface FavoriteButtonProps {
  type: 'topico' | 'comunidade';
  slug: string;
  id?: string;
  variant?: 'icon' | 'button' | 'compact';
  className?: string;
  onLoginRequired?: () => void;
  showLabel?: boolean;
}

/**
 * FavoriteButton - Botão para favoritar/desfavoritar conteúdo
 *
 * Features:
 * - Toggle favorito com feedback visual
 * - Persiste no banco de dados
 * - Animação ao favoritar
 * - Múltiplas variantes visuais
 * - Graceful degradation para não-logados
 */
export default function FavoriteButton({
  type,
  slug,
  id,
  variant = 'icon',
  className = '',
  onLoginRequired,
  showLabel = false
}: FavoriteButtonProps) {
  const { data: session, status } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [animating, setAnimating] = useState(false);

  const isAuthenticated = status === 'authenticated' && session?.user;

  // Carrega estado inicial
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    async function checkFavoriteStatus() {
      try {
        const identifier = id || slug;
        const res = await fetch(`/api/comunidades/favorites?type=${type}&id=${identifier}`);
        const data = await res.json();
        setIsFavorite(data.isFavorite);
      } catch (err) {
        console.error('Error checking favorite status:', err);
      } finally {
        setLoading(false);
      }
    }

    checkFavoriteStatus();
  }, [isAuthenticated, type, slug, id]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      onLoginRequired?.();
      return;
    }

    setLoading(true);
    setAnimating(true);

    try {
      const res = await fetch('/api/comunidades/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, slug, id })
      });

      const data = await res.json();
      setIsFavorite(data.isFavorite);

      // Reset animation
      setTimeout(() => setAnimating(false), 500);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setLoading(false);
    }
  };

  // Variante ícone (para usar em cards, headers, etc)
  if (variant === 'icon') {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`
          relative p-2 rounded-lg
          transition-all duration-200
          ${isFavorite
            ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
            : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/50 hover:text-amber-400'
          }
          disabled:opacity-50
          ${animating ? 'scale-125' : 'scale-100'}
          ${className}
        `}
        title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isFavorite ? (
          <BookmarkCheck className="w-4 h-4" />
        ) : (
          <Bookmark className="w-4 h-4" />
        )}

        {/* Pulse effect when favoriting */}
        {animating && isFavorite && (
          <span className="absolute inset-0 rounded-lg bg-amber-400/30 animate-ping" />
        )}
      </button>
    );
  }

  // Variante compacta (para listas)
  if (variant === 'compact') {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`
          flex items-center gap-1.5 text-xs
          transition-all duration-200
          ${isFavorite
            ? 'text-amber-400'
            : 'text-zinc-500 hover:text-amber-400'
          }
          disabled:opacity-50
          ${animating ? 'scale-110' : 'scale-100'}
          ${className}
        `}
        title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : isFavorite ? (
          <BookmarkCheck className="w-3.5 h-3.5" />
        ) : (
          <Bookmark className="w-3.5 h-3.5" />
        )}
        {showLabel && (
          <span>{isFavorite ? 'Salvo' : 'Salvar'}</span>
        )}
      </button>
    );
  }

  // Variante botão (para uso standalone)
  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg
        font-medium text-sm
        transition-all duration-200
        ${isFavorite
          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
          : 'bg-zinc-800/50 text-zinc-300 border border-zinc-700 hover:border-amber-500/30 hover:text-amber-400'
        }
        disabled:opacity-50
        ${animating ? 'scale-105' : 'scale-100'}
        ${className}
      `}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isFavorite ? (
        <BookmarkCheck className="w-4 h-4" />
      ) : (
        <Bookmark className="w-4 h-4" />
      )}
      <span>{isFavorite ? 'Salvo' : 'Salvar'}</span>

      {/* Pulse effect */}
      {animating && isFavorite && (
        <span className="absolute inset-0 rounded-lg bg-amber-400/20 animate-ping" />
      )}
    </button>
  );
}

// Hook para gerenciar favoritos
export function useFavorites() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    async function fetchFavorites() {
      try {
        const res = await fetch('/api/comunidades/favorites');
        const data = await res.json();
        setFavorites(data.favorites || []);
      } catch (err) {
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [session]);

  return { favorites, loading };
}
