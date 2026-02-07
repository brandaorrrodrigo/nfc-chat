'use client';

/**
 * COMPONENTE: GlobalStatsHeader - Header Fixo de Estatísticas Globais REAIS
 *
 * Visual: HUD / Painel Técnico
 * Estética: Dark + Verde Neon (#00ff88) + Fonte Monoespaçada
 *
 * Indicadores:
 * - Total de usuários cadastrados
 * - Usuários online agora
 * - Total de posts
 * - Total de comentários
 *
 * ✅ INTEGRADO COM API REAL - useCommunityStats hook
 * Atualização automática a cada 30s
 * Uso: /comunidades e /comunidades/[slug]
 */

import React, { useState, useEffect } from 'react';
import { Users, Activity, MessageSquare, Bot } from 'lucide-react';
import { useCommunityStats } from '@/app/hooks/useCommunityStats';

// ========================================
// COMPONENTE: Stat Item Individual
// ========================================

function StatItem({
  icon: Icon,
  value,
  label,
  color = 'text-[#00ff88]',
  pulse = false,
}: {
  icon: React.ElementType;
  value: number | string;
  label: string;
  color?: string;
  pulse?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="relative">
        <Icon className={`w-4 h-4 ${color}`} strokeWidth={1.5} />
        {pulse && (
          <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-ping" />
        )}
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1.5">
        <span className="text-sm sm:text-base font-mono font-bold text-white tabular-nums">
          {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
        </span>
        <span className="text-[10px] sm:text-xs font-mono text-zinc-500 uppercase tracking-wider">
          {label}
        </span>
      </div>
    </div>
  );
}

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export default function GlobalStatsHeader() {
  // ✅ Hook de stats REAIS (atualiza a cada 30s automaticamente)
  const { stats: communityStats, loading } = useCommunityStats();
  const [lastUpdate, setLastUpdate] = useState<string>('agora');

  // Atualizar texto de "última atualização"
  useEffect(() => {
    if (!communityStats) return;

    const updateTimer = setInterval(() => {
      const now = new Date();
      const lastUpdateDate = new Date(communityStats.updatedAt);
      const diff = Math.floor((now.getTime() - lastUpdateDate.getTime()) / 1000);

      if (diff < 10) {
        setLastUpdate('agora');
      } else if (diff < 60) {
        setLastUpdate(`há ${diff}s`);
      } else {
        setLastUpdate(`há ${Math.floor(diff / 60)}min`);
      }
    }, 5000);

    return () => clearInterval(updateTimer);
  }, [communityStats]);

  // @deprecated - Header global agora é EcossistemaHeader via providers.tsx
  return (
    <div className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 gap-4">
          {/* Stats Grid */}
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 overflow-x-auto scrollbar-none">
            <StatItem
              icon={Users}
              value={communityStats?.totalUsers || 0}
              label="Usuários"
              pulse
            />

            <div className="w-[1px] h-6 bg-zinc-800 hidden sm:block" />

            <StatItem
              icon={Activity}
              value={communityStats?.onlineNow || 0}
              label="Online"
              color="text-emerald-400"
              pulse
            />

            <div className="w-[1px] h-6 bg-zinc-800 hidden sm:block" />

            <StatItem
              icon={MessageSquare}
              value={communityStats?.totalPosts || 0}
              label="Posts"
              color="text-cyan-400"
            />

            <div className="w-[1px] h-6 bg-zinc-800 hidden sm:block" />

            <StatItem
              icon={Bot}
              value={communityStats?.totalComments || 0}
              label="Comentários"
              color="text-purple-400"
            />
          </div>

          {/* Connection Status */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              {!loading && communityStats ? (
                <>
                  <div className="relative">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88]" />
                    <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-ping" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-600 uppercase">
                    {lastUpdate}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-zinc-700 border-t-[#00ff88] rounded-full animate-spin" />
                  <span className="text-[10px] font-mono text-zinc-600 uppercase">
                    Carregando...
                  </span>
                </>
              )}
            </div>

            {/* Mobile: Apenas indicador */}
            <div className="sm:hidden relative">
              <div className="w-2 h-2 rounded-full bg-[#00ff88]" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-[#00ff88] animate-ping" />
            </div>
          </div>
        </div>
      </div>

      {/* Activity Bar - Animação de progresso */}
      <div className="h-[2px] bg-zinc-900 relative overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-[#00ff88]/40 to-transparent"
          style={{
            animation: 'slideRightStats 4s ease-in-out infinite',
          }}
        />
      </div>

      <style jsx>{`
        @keyframes slideRightStats {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(500%);
          }
        }
      `}</style>
    </div>
  );
}
