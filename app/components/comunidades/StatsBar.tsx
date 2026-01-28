'use client';

/**
 * COMPONENTE: StatsBar - Painel de Estatísticas Globais
 *
 * Visual: HUD / Command Center - Cyberpunk
 * Estética: Dark + Verde Neon (#00ff88)
 *
 * Pronto para integração com API futura
 */

import React from 'react';
import { Users, Activity, MessageSquare, Bot } from 'lucide-react';

// ========================================
// TIPOS
// ========================================

interface StatsData {
  totalUsers: number;
  activeUsers7d: number;
  activeTopics: number;
  iaInteractions: number;
}

interface StatCardProps {
  icon: React.ElementType;
  value: number;
  label: string;
  accentColor?: string;
}

// ========================================
// DADOS MOCK (Pronto para substituir por API)
// ========================================

const STATS_MOCK: StatsData = {
  totalUsers: 12480,
  activeUsers7d: 3214,
  activeTopics: 842,
  iaInteractions: 1926,
};

// ========================================
// UTILITÁRIOS
// ========================================

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toLocaleString('pt-BR');
}

// ========================================
// COMPONENTE: StatCard Individual
// ========================================

function StatCard({ icon: Icon, value, label, accentColor = '#00ff88' }: StatCardProps) {
  return (
    <div
      className={`
        group relative
        bg-zinc-900/70 backdrop-blur-sm
        border border-zinc-800
        rounded-xl p-4 sm:p-5
        transition-all duration-300
        hover:border-[#00ff88]/50
        hover:shadow-[0_0_25px_rgba(0,255,136,0.15)]
        cursor-default
      `}
    >
      {/* Glow effect on hover */}
      <div
        className={`
          absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
          bg-gradient-to-br from-[#00ff88]/5 to-transparent
          transition-opacity duration-300
          pointer-events-none
        `}
      />

      <div className="relative z-10 flex items-center gap-3 sm:gap-4">
        {/* Icon Container */}
        <div
          className={`
            relative flex-shrink-0
            w-10 h-10 sm:w-12 sm:h-12
            rounded-lg
            bg-zinc-800/80
            group-hover:bg-[#00ff88]/10
            border border-zinc-700/50
            group-hover:border-[#00ff88]/30
            flex items-center justify-center
            transition-all duration-300
          `}
        >
          <Icon
            className={`
              w-5 h-5 sm:w-6 sm:h-6
              text-zinc-400
              group-hover:text-[#00ff88]
              transition-colors duration-300
            `}
            strokeWidth={1.5}
          />

          {/* Pulse indicator */}
          <div
            className={`
              absolute -top-1 -right-1
              w-2.5 h-2.5
              bg-[#00ff88]
              rounded-full
              opacity-0 group-hover:opacity-100
              transition-opacity duration-300
            `}
          >
            <div
              className={`
                absolute inset-0
                bg-[#00ff88]
                rounded-full
                animate-ping
              `}
            />
          </div>
        </div>

        {/* Value & Label */}
        <div className="flex flex-col min-w-0">
          <span
            className={`
              text-xl sm:text-2xl lg:text-3xl
              font-bold text-white
              group-hover:text-[#00ff88]
              transition-colors duration-300
              tabular-nums
            `}
          >
            {formatNumber(value)}
          </span>
          <span
            className={`
              text-[10px] sm:text-xs
              font-mono uppercase tracking-wider
              text-zinc-500
              group-hover:text-zinc-400
              transition-colors duration-300
              truncate
            `}
          >
            {label}
          </span>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className={`
          absolute bottom-0 left-4 right-4 h-[2px]
          bg-gradient-to-r from-transparent via-zinc-700 to-transparent
          group-hover:via-[#00ff88]/50
          transition-all duration-300
        `}
      />
    </div>
  );
}

// ========================================
// COMPONENTE PRINCIPAL: StatsBar
// ========================================

interface StatsBarProps {
  stats?: StatsData;
}

export default function StatsBar({ stats = STATS_MOCK }: StatsBarProps) {
  const statItems = [
    {
      icon: Users,
      value: stats.totalUsers,
      label: 'Agentes Registrados',
    },
    {
      icon: Activity,
      value: stats.activeUsers7d,
      label: 'Ativos (7 dias)',
    },
    {
      icon: MessageSquare,
      value: stats.activeTopics,
      label: 'Tópicos Ativos',
    },
    {
      icon: Bot,
      value: stats.iaInteractions,
      label: 'Intervenções IA',
    },
  ];

  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
          <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
            Status do Sistema
          </span>
        </div>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-zinc-800 to-transparent" />
      </div>

      {/* Stats Grid */}
      <div
        className={`
          grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4
        `}
      >
        {statItems.map((item, index) => (
          <StatCard
            key={index}
            icon={item.icon}
            value={item.value}
            label={item.label}
          />
        ))}
      </div>

      {/* System Status Indicator */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <div className="relative">
          <div className="w-2 h-2 rounded-full bg-[#00ff88]" />
          <div className="absolute inset-0 w-2 h-2 rounded-full bg-[#00ff88] animate-ping opacity-75" />
        </div>
        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
          Todos os sistemas operacionais
        </span>
      </div>
    </section>
  );
}
