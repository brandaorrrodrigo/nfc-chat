'use client';

/**
 * ContextChip - Chips de Contexto
 * ================================
 *
 * Exibe informações contextuais sobre a usuária
 * Design feminino e suave
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

export type ChipColor = 'pink' | 'teal' | 'blue' | 'purple' | 'orange' | 'green';

export interface ContextChipProps {
  icon: LucideIcon;
  label: string;
  color: ChipColor;
  onClick?: () => void;
}

const colorClasses: Record<ChipColor, string> = {
  pink: 'bg-pink-500/20 text-pink-300 border-pink-500/30 hover:bg-pink-500/30',
  teal: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/30',
  blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30',
  purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30',
  orange: 'bg-orange-500/20 text-orange-300 border-orange-500/30 hover:bg-orange-500/30',
  green: 'bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30',
};

export default function ContextChip({ icon: Icon, label, color, onClick }: ContextChipProps) {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
        border transition-colors whitespace-nowrap
        ${colorClasses[color]}
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </Component>
  );
}
