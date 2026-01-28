'use client';

/**
 * QuickReply - Respostas Rápidas
 * ===============================
 *
 * Botões de resposta rápida sugeridos pela IA
 * Design feminino com hover suave
 */

import React from 'react';

export interface QuickReplyProps {
  text: string;
  emoji?: string;
  onClick: () => void;
  variant?: 'default' | 'highlighted';
}

export default function QuickReply({
  text,
  emoji,
  onClick,
  variant = 'default'
}: QuickReplyProps) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium
        transition-all duration-200 hover:scale-105 active:scale-95
        ${variant === 'highlighted'
          ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]'
          : 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/30 hover:border-purple-500/50'
        }
      `}
    >
      {emoji && <span className="text-base">{emoji}</span>}
      {text}
    </button>
  );
}

// Componente para grupo de quick replies
export function QuickReplyGroup({
  replies,
  onSelect
}: {
  replies: { text: string; emoji?: string; highlighted?: boolean }[];
  onSelect: (text: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {replies.map((reply, idx) => (
        <QuickReply
          key={idx}
          text={reply.text}
          emoji={reply.emoji}
          variant={reply.highlighted ? 'highlighted' : 'default'}
          onClick={() => onSelect(reply.text)}
        />
      ))}
    </div>
  );
}
