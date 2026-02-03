'use client';

/**
 * Movement Pattern Badge - Badge visual do tipo de movimento
 */

import React from 'react';
import { NFV_CONFIG } from '@/lib/biomechanics/nfv-config';

interface MovementPatternBadgeProps {
  pattern: string;
  size?: 'sm' | 'md';
}

const PATTERN_LABELS: Record<string, string> = {
  agachamento: 'Agachamento',
  terra: 'Lev. Terra',
  supino: 'Supino',
  puxadas: 'Puxadas',
  'elevacao-pelvica': 'Elev. Pelvica',
};

export default function MovementPatternBadge({
  pattern,
  size = 'sm',
}: MovementPatternBadgeProps) {
  const arenaConfig = NFV_CONFIG.PREMIUM_ARENAS.find(a => a.pattern === pattern);
  const label = PATTERN_LABELS[pattern] || pattern;
  const color = arenaConfig?.color || '#8b5cf6';
  const icon = arenaConfig?.icon || '🏋️';

  const sizeClasses = size === 'sm'
    ? 'text-[10px] px-2 py-0.5 gap-1'
    : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses}`}
      style={{
        backgroundColor: `${color}15`,
        color: color,
        border: `1px solid ${color}30`,
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  );
}
