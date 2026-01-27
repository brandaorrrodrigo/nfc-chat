'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Smile, Loader2 } from 'lucide-react';
import { useComunidadesAuth } from './ComunidadesAuthContext';

// Tipos de reação disponíveis
export const REACTIONS = [
  { type: 'forca', emoji: '💪', label: 'Força' },
  { type: 'amor', emoji: '❤️', label: 'Amor' },
  { type: 'inspirador', emoji: '🔥', label: 'Inspirador' },
  { type: 'util', emoji: '🎯', label: 'Útil' },
  { type: 'parabens', emoji: '👏', label: 'Parabéns' },
] as const;

export type ReactionType = typeof REACTIONS[number]['type'];

interface Reaction {
  type: ReactionType;
  emoji: string;
  count: number;
  userReacted: boolean;
}

interface ReactionPickerProps {
  messageId: string;
  communitySlug: string;
  initialReactions?: Reaction[];
  compact?: boolean;
  onLoginRequired?: () => void;
}

/**
 * ReactionPicker - Seletor de reações para mensagens
 *
 * Features:
 * - 5 emojis: 💪 Força, ❤️ Amor, 🔥 Inspirador, 🎯 Útil, 👏 Parabéns
 * - Toggle: clica de novo para remover
 * - Animação suave ao reagir
 * - Exibe contador de reações
 * - Destaque para reações do usuário
 */
export default function ReactionPicker({
  messageId,
  communitySlug,
  initialReactions = [],
  compact = false,
  onLoginRequired
}: ReactionPickerProps) {
  const { isAuthenticated } = useComunidadesAuth();
  const [reactions, setReactions] = useState<Reaction[]>(initialReactions);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [animatingEmoji, setAnimatingEmoji] = useState<string | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Carregar reações ao montar
  useEffect(() => {
    loadReactions();
  }, [messageId]);

  // Fechar picker ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadReactions = async () => {
    try {
      const res = await fetch(
        `/api/comunidades/reactions?messageId=${messageId}&community=${communitySlug}`
      );
      const data = await res.json();

      if (data.reactions) {
        // Mapear para o formato esperado
        const mapped: Reaction[] = data.reactions.map((r: any) => ({
          type: r.type,
          emoji: REACTIONS.find(rx => rx.type === r.type)?.emoji || r.tipo,
          count: r.total,
          userReacted: r.userReacted || false
        }));
        setReactions(mapped);
      }
    } catch (err) {
      console.error('Error loading reactions:', err);
    }
  };

  const handleReaction = async (reactionType: ReactionType, emoji: string) => {
    // Se não autenticado, pedir login
    if (!isAuthenticated) {
      if (onLoginRequired) {
        onLoginRequired();
      } else {
        window.location.href = `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
      }
      return;
    }

    setLoading(reactionType);
    setAnimatingEmoji(emoji);

    try {
      const res = await fetch('/api/comunidades/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId,
          communitySlug,
          reactionType
        })
      });

      const data = await res.json();

      if (data.success) {
        // Atualizar estado local
        setReactions(prev => {
          const existing = prev.find(r => r.type === reactionType);

          if (data.action === 'added') {
            if (existing) {
              return prev.map(r =>
                r.type === reactionType
                  ? { ...r, count: r.count + 1, userReacted: true }
                  : r
              );
            } else {
              return [...prev, {
                type: reactionType,
                emoji,
                count: 1,
                userReacted: true
              }];
            }
          } else {
            // Removed
            if (existing && existing.count === 1) {
              return prev.filter(r => r.type !== reactionType);
            } else {
              return prev.map(r =>
                r.type === reactionType
                  ? { ...r, count: r.count - 1, userReacted: false }
                  : r
              );
            }
          }
        });
      }
    } catch (err) {
      console.error('Error toggling reaction:', err);
    } finally {
      setLoading(null);
      setTimeout(() => setAnimatingEmoji(null), 300);
      setShowPicker(false);
    }
  };

  // Reações existentes (com contagem > 0)
  const activeReactions = reactions.filter(r => r.count > 0);

  return (
    <div className="relative" ref={pickerRef}>
      {/* Reações existentes */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {activeReactions.map((reaction) => (
          <button
            key={reaction.type}
            onClick={() => handleReaction(reaction.type, reaction.emoji)}
            disabled={loading === reaction.type}
            className={`
              flex items-center gap-1
              px-2 py-1 rounded-lg
              text-sm
              transition-all duration-200
              ${reaction.userReacted
                ? 'bg-[#00ff88]/20 border border-[#00ff88]/50 text-[#00ff88]'
                : 'bg-zinc-800/50 border border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
              }
              ${animatingEmoji === reaction.emoji ? 'scale-125' : ''}
              disabled:opacity-50
            `}
          >
            <span className={`text-base ${animatingEmoji === reaction.emoji ? 'animate-bounce' : ''}`}>
              {reaction.emoji}
            </span>
            <span className="font-semibold text-xs">{reaction.count}</span>
          </button>
        ))}

        {/* Botão para adicionar reação */}
        <button
          onClick={() => setShowPicker(!showPicker)}
          className={`
            flex items-center justify-center
            w-7 h-7 rounded-lg
            transition-all duration-200
            ${showPicker
              ? 'bg-[#00ff88]/20 border border-[#00ff88]/50 text-[#00ff88]'
              : 'bg-zinc-800/50 border border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600'
            }
          `}
          title="Adicionar reação"
        >
          <Smile className="w-4 h-4" />
        </button>
      </div>

      {/* Picker popup */}
      {showPicker && (
        <div
          className="
            absolute bottom-full left-0 mb-2
            flex items-center gap-1
            px-2 py-1.5
            bg-zinc-900/95 backdrop-blur-md
            border border-zinc-700
            rounded-xl
            shadow-[0_0_30px_rgba(0,0,0,0.5)]
            z-50
            animate-in fade-in slide-in-from-bottom-2 duration-200
          "
        >
          {REACTIONS.map((r) => {
            const isActive = reactions.find(rx => rx.type === r.type)?.userReacted;
            return (
              <button
                key={r.type}
                onClick={() => handleReaction(r.type, r.emoji)}
                disabled={loading === r.type}
                className={`
                  relative
                  p-1.5 rounded-lg
                  transition-all duration-200
                  hover:scale-125 hover:bg-zinc-800
                  group
                  ${isActive ? 'bg-[#00ff88]/20' : ''}
                `}
                title={r.label}
              >
                {loading === r.type ? (
                  <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
                ) : (
                  <span className="text-xl">{r.emoji}</span>
                )}

                {/* Tooltip */}
                <span
                  className="
                    absolute -top-8 left-1/2 -translate-x-1/2
                    px-2 py-0.5
                    text-[10px] font-medium
                    bg-zinc-800 text-zinc-300
                    rounded
                    opacity-0 group-hover:opacity-100
                    transition-opacity
                    whitespace-nowrap
                    pointer-events-none
                  "
                >
                  {r.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Componente compacto para mostrar apenas contadores
export function ReactionDisplay({
  reactions,
  onReactionClick,
}: {
  reactions: Reaction[];
  onReactionClick?: (type: ReactionType) => void;
}) {
  if (!reactions.length) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {reactions.map((r) => (
        <button
          key={r.type}
          onClick={() => onReactionClick?.(r.type)}
          className={`
            flex items-center gap-1
            px-2 py-1 rounded-lg
            text-sm
            ${r.userReacted
              ? 'bg-[#00ff88]/20 border border-[#00ff88]/50 text-[#00ff88]'
              : 'bg-zinc-800/50 border border-zinc-700 text-zinc-400'
            }
            hover:border-[#00ff88]/50
            transition-all duration-200
          `}
        >
          <span className="text-base">{r.emoji}</span>
          <span className="font-semibold text-xs">{r.count}</span>
        </button>
      ))}
    </div>
  );
}
