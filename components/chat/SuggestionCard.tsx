'use client';

/**
 * SuggestionCard - Cards de Sugestão
 * ===================================
 *
 * Cards contextuais com sugestões da IA
 * Design premium e feminino com muitos emojis 💕
 */

import React from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';

export interface SuggestionCardProps {
  icon: string;
  title: string;
  description: string;
  cta?: string;
  onClick?: () => void;
  variant?: 'default' | 'premium' | 'success' | 'warning';
}

const variantClasses = {
  default: {
    bg: 'bg-slate-800/50 backdrop-blur-sm',
    border: 'border-purple-500/30',
    icon: 'from-slate-700 to-slate-600',
  },
  premium: {
    bg: 'bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-cyan-500/10',
    border: 'border-purple-500/30',
    icon: 'from-purple-500/30 to-pink-500/30',
  },
  success: {
    bg: 'bg-gradient-to-br from-green-500/10 to-emerald-500/10',
    border: 'border-green-500/30',
    icon: 'from-green-500/30 to-emerald-500/30',
  },
  warning: {
    bg: 'bg-gradient-to-br from-amber-500/10 to-orange-500/10',
    border: 'border-amber-500/30',
    icon: 'from-amber-500/30 to-orange-500/30',
  },
};

export default function SuggestionCard({
  icon,
  title,
  description,
  cta,
  onClick,
  variant = 'premium'
}: SuggestionCardProps) {
  const styles = variantClasses[variant];

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-4 border
        ${styles.bg} ${styles.border}
        ${onClick ? 'cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5' : ''}
      `}
      onClick={onClick}
    >
      {/* Decorative sparkles */}
      <div className="absolute top-2 right-2 text-purple-400 opacity-50">
        <Sparkles className="w-4 h-4" />
      </div>

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${styles.icon} flex items-center justify-center text-2xl shrink-0 shadow-sm`}>
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
            {title}
            <span className="text-sm">✨</span>
          </h4>
          <p className="text-sm text-gray-300 leading-relaxed">
            {description}
          </p>

          {cta && (
            <button className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors group">
              {cta}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Variante compacta para inline
export function SuggestionChip({
  emoji,
  text,
  onClick
}: {
  emoji: string;
  text: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-full text-sm font-medium text-purple-200 border border-purple-500/30 hover:border-purple-500/50 transition-all hover:shadow-[0_0_10px_rgba(168,85,247,0.2)] whitespace-nowrap"
    >
      <span className="text-base">{emoji}</span>
      {text}
    </button>
  );
}
