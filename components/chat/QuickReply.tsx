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
          ? 'bg-gradient-to-r from-teal-500 via-emerald-500 to-purple-500 text-white shadow-lg hover:shadow-xl'
          : 'bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 text-gray-700 border border-pink-200 hover:border-pink-300'
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
