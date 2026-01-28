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
    bg: 'bg-gradient-to-br from-white to-gray-50',
    border: 'border-gray-200',
    icon: 'from-gray-100 to-gray-200',
  },
  premium: {
    bg: 'bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50',
    border: 'border-purple-200',
    icon: 'from-purple-100 to-pink-100',
  },
  success: {
    bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
    border: 'border-green-200',
    icon: 'from-green-100 to-emerald-100',
  },
  warning: {
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
    border: 'border-amber-200',
    icon: 'from-amber-100 to-orange-100',
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
      <div className="absolute top-2 right-2 text-purple-300 opacity-50">
        <Sparkles className="w-4 h-4" />
      </div>

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${styles.icon} flex items-center justify-center text-2xl shrink-0 shadow-sm`}>
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
            {title}
            <span className="text-sm">✨</span>
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {description}
          </p>

          {cta && (
            <button className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors group">
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
      className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-full text-sm font-medium text-gray-700 border border-gray-200 hover:border-gray-300 transition-all hover:shadow-sm whitespace-nowrap"
    >
      <span className="text-base">{emoji}</span>
      {text}
    </button>
  );
}
