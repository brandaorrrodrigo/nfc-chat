'use client';

import React from 'react';
import { Crown, Sparkles, Shield } from '@/lib/icons';

/**
 * NutriFitCoach Badge Component
 *
 * Variantes:
 * - default: Cinza neutro
 * - premium: Roxo com brilho
 * - founder: Dourado com brilho especial
 * - admin: Vermelho
 * - success: Verde
 * - warning: Amarelo
 * - neon: Verde neon (estilo chat)
 */

export interface BadgeProps {
  variant?: 'default' | 'premium' | 'founder' | 'admin' | 'success' | 'warning' | 'neon';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  icon?: 'crown' | 'sparkles' | 'shield' | React.ReactNode;
  className?: string;
}

const iconMap = {
  crown: Crown,
  sparkles: Sparkles,
  shield: Shield,
};

export default function Badge({
  variant = 'default',
  size = 'sm',
  children,
  icon,
  className = '',
}: BadgeProps) {
  const baseStyles = `
    inline-flex items-center gap-1.5 font-medium rounded-full
    transition-all duration-200
  `;

  const variantStyles = {
    default: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
    premium: `
      bg-gradient-to-r from-nfc-violet-600/20 to-nfc-violet-500/20
      text-nfc-violet-300 border border-nfc-violet-500/30
      shadow-nfc-glow-violet
    `,
    founder: `
      bg-gradient-to-r from-yellow-500/20 to-amber-500/20
      text-yellow-300 border border-yellow-500/30
      shadow-[0_0_15px_rgba(251,191,36,0.3)]
    `,
    admin: 'bg-red-500/20 text-red-300 border border-red-500/30',
    success: 'bg-nfc-emerald-500/20 text-nfc-emerald-300 border border-nfc-emerald-500/30',
    warning: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    neon: `
      bg-nfc-neon/10 text-nfc-neon border border-nfc-neon/30
      shadow-nfc-neon
    `,
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const renderIcon = () => {
    if (!icon) return null;

    if (typeof icon === 'string' && icon in iconMap) {
      const IconComponent = iconMap[icon as keyof typeof iconMap];
      return <IconComponent className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />;
    }

    return icon;
  };

  return (
    <span
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {renderIcon()}
      {children}
    </span>
  );
}

// Convenience exports for common badges
export function PremiumBadge({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return (
    <Badge variant="premium" size={size} icon="sparkles">
      Premium
    </Badge>
  );
}

export function FounderBadge({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return (
    <Badge variant="founder" size={size} icon="crown">
      Founder
    </Badge>
  );
}

export function AdminBadge({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return (
    <Badge variant="admin" size={size} icon="shield">
      Admin
    </Badge>
  );
}
