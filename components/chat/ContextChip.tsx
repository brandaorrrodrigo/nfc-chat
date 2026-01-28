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
  pink: 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100',
  teal: 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100',
  blue: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
  purple: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
  orange: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
  green: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
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
