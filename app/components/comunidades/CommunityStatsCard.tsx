'use client';

/**
 * COMPONENTE: CommunityStatsCard - Estatísticas por Comunidade
 *
 * Exibe nos cards e header interno:
 * - Membros inscritos
 * - Usuários ativos agora (últimos 15 min)
 * - Tópicos abertos
 * - Última atividade ("há 2 min", "há 40s")
 *
 * Visual: Destacado, não pequeno, não escondido
 * Estética: Cyberpunk HUD
 */

import React, { useState, useEffect } from 'react';
import { Users, Activity, FileText, Clock, Wifi } from 'lucide-react';

// ========================================
// TIPOS
// ========================================

interface CommunityStats {
  membrosInscritos: number;
  usuariosAtivos: number; // Últimos 15 min
  topicosAbertos: number;
  ultimaAtividade: string; // "há 2 min", "há 40s"
  ultimaAtividadeTimestamp: Date;
}

// ========================================
// DADOS MOCK POR COMUNIDADE
// ========================================

const COMMUNITY_STATS_MOCK: Record<string, CommunityStats> = {
  lipedema: {
    membrosInscritos: 1247,
    usuariosAtivos: 47,
    topicosAbertos: 24,
    ultimaAtividade: 'há 2 min',
    ultimaAtividadeTimestamp: new Date(Date.now() - 2 * 60 * 1000),
  },
  peptideos: {
    membrosInscritos: 856,
    usuariosAtivos: 63,
    topicosAbertos: 18,
    ultimaAtividade: 'há 40s',
    ultimaAtividadeTimestamp: new Date(Date.now() - 40 * 1000),
  },
};

// ========================================
// COMPONENTE: Stat Individual
// ========================================

function StatBadge({
  icon: Icon,
  value,
  label,
  color = 'text-[#00ff88]',
  highlight = false,
}: {
  icon: React.ElementType;
  value: number | string;
  label: string;
  color?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg transition-all
        ${highlight
          ? 'bg-[#00ff88]/10 border border-[#00ff88]/30'
          : 'bg-zinc-800/50 border border-zinc-700/50'
        }
      `}
    >
      <div className="relative">
        <Icon className={`w-4 h-4 ${color}`} strokeWidth={1.5} />
        {highlight && (
          <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-white font-mono tabular-nums">
          {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
        </span>
        <span className="text-[9px] text-zinc-500 uppercase tracking-wider">
          {label}
        </span>
      </div>
    </div>
  );
}

// ========================================
// COMPONENTE: Stats Inline (para cards)
// ========================================

interface CommunityStatsInlineProps {
  slug: string;
  size?: 'sm' | 'md';
}

export function CommunityStatsInline({ slug, size = 'md' }: CommunityStatsInlineProps) {
  const stats = COMMUNITY_STATS_MOCK[slug] || COMMUNITY_STATS_MOCK.lipedema;

  if (size === 'sm') {
    return (
      <div className="flex items-center gap-3 text-xs">
        <span className="flex items-center gap-1 text-zinc-400">
          <Users className="w-3 h-3" />
          <span className="font-mono">{stats.membrosInscritos.toLocaleString()}</span>
        </span>
        <span className="w-1 h-1 rounded-full bg-zinc-700" />
        <span className="flex items-center gap-1 text-emerald-400">
          <Activity className="w-3 h-3" />
          <span className="font-mono">{stats.usuariosAtivos}</span>
          <span className="text-zinc-500">online</span>
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <StatBadge
        icon={Users}
        value={stats.membrosInscritos}
        label="Membros"
      />
      <StatBadge
        icon={Activity}
        value={stats.usuariosAtivos}
        label="Online"
        color="text-emerald-400"
        highlight
      />
      <StatBadge
        icon={FileText}
        value={stats.topicosAbertos}
        label="Tópicos"
        color="text-cyan-400"
      />
    </div>
  );
}

// ========================================
// COMPONENTE: Stats Header (para header interno)
// ========================================

interface CommunityStatsHeaderProps {
  slug: string;
  showLastActivity?: boolean;
}

export function CommunityStatsHeader({ slug, showLastActivity = true }: CommunityStatsHeaderProps) {
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [lastActivityText, setLastActivityText] = useState('');

  useEffect(() => {
    const data = COMMUNITY_STATS_MOCK[slug] || COMMUNITY_STATS_MOCK.lipedema;
    setStats(data);
    setLastActivityText(data.ultimaAtividade);

    // Atualizar texto de última atividade
    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - data.ultimaAtividadeTimestamp.getTime()) / 1000);

      if (diff < 60) {
        setLastActivityText(`há ${diff}s`);
      } else if (diff < 3600) {
        setLastActivityText(`há ${Math.floor(diff / 60)} min`);
      } else {
        setLastActivityText(`há ${Math.floor(diff / 3600)}h`);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [slug]);

  if (!stats) return null;

  return (
    <div className="bg-zinc-900/70 backdrop-blur-sm border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-[#00ff88]" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-[#00ff88] animate-ping" />
          </div>
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
            Estatísticas da Arena
          </span>
        </div>
        {showLastActivity && (
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Clock className="w-3 h-3" />
            <span className="font-mono">Última atividade: </span>
            <span className="text-[#00ff88] font-mono">{lastActivityText}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Membros Inscritos */}
        <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/50">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-zinc-400" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Membros</span>
          </div>
          <p className="text-xl font-bold text-white font-mono">
            {stats.membrosInscritos.toLocaleString()}
          </p>
        </div>

        {/* Usuários Ativos */}
        <div className="bg-[#00ff88]/5 rounded-lg p-3 border border-[#00ff88]/20">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-[#00ff88]" />
            <span className="text-[10px] text-[#00ff88]/70 uppercase tracking-wider">Online Agora</span>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold text-[#00ff88] font-mono">
              {stats.usuariosAtivos}
            </p>
            <div className="relative">
              <Wifi className="w-4 h-4 text-[#00ff88]" />
              <div className="absolute inset-0 animate-ping">
                <Wifi className="w-4 h-4 text-[#00ff88] opacity-50" />
              </div>
            </div>
          </div>
        </div>

        {/* Tópicos Abertos */}
        <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/50">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Tópicos</span>
          </div>
          <p className="text-xl font-bold text-white font-mono">
            {stats.topicosAbertos}
          </p>
        </div>

        {/* Última Atividade */}
        <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/50">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Atividade</span>
          </div>
          <p className="text-xl font-bold text-purple-400 font-mono">
            {lastActivityText}
          </p>
        </div>
      </div>
    </div>
  );
}

// ========================================
// COMPONENTE PADRÃO: Card Completo
// ========================================

interface CommunityStatsCardProps {
  slug: string;
  variant?: 'card' | 'inline' | 'header';
}

export default function CommunityStatsCard({ slug, variant = 'card' }: CommunityStatsCardProps) {
  if (variant === 'inline') {
    return <CommunityStatsInline slug={slug} />;
  }

  if (variant === 'header') {
    return <CommunityStatsHeader slug={slug} />;
  }

  // Default: card variant
  return <CommunityStatsHeader slug={slug} />;
}
