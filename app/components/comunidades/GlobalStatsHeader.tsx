'use client';

/**
 * COMPONENTE: GlobalStatsHeader - Header Fixo de Estatísticas Globais
 *
 * Visual: HUD / Painel Técnico
 * Estética: Dark + Verde Neon (#00ff88) + Fonte Monoespaçada
 *
 * Indicadores:
 * - Total de usuários cadastrados
 * - Usuários ativos (24h)
 * - Mensagens publicadas hoje
 * - Intervenções da IA hoje
 *
 * Atualização automática a cada 30-60s
 * Uso: /comunidades e /comunidades/[slug]
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Users, Activity, MessageSquare, Bot, Wifi, WifiOff } from 'lucide-react';

// ========================================
// TIPOS
// ========================================

interface GlobalStats {
  totalUsuarios: number;
  ativos24h: number;
  mensagensHoje: number;
  intervencoesIA: number;
  ultimaAtualizacao: Date;
}

// ========================================
// DADOS MOCK
// ========================================

const STATS_MOCK: GlobalStats = {
  totalUsuarios: 12847,
  ativos24h: 1423,
  mensagensHoje: 847,
  intervencoesIA: 156,
  ultimaAtualizacao: new Date(),
};

// Simulação de variação nos dados
function gerarVariacao(base: number, percentual: number = 5): number {
  const variacao = Math.floor(base * (percentual / 100));
  const delta = Math.floor(Math.random() * variacao * 2) - variacao;
  return Math.max(0, base + delta);
}

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

interface GlobalStatsHeaderProps {
  refreshInterval?: number; // Em milissegundos (padrão: 45000 = 45s)
}

export default function GlobalStatsHeader({ refreshInterval = 45000 }: GlobalStatsHeaderProps) {
  const [stats, setStats] = useState<GlobalStats>(STATS_MOCK);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('agora');

  // Simular atualização de dados
  const fetchStats = useCallback(() => {
    // MVP: Simular pequenas variações nos dados
    setStats({
      totalUsuarios: gerarVariacao(STATS_MOCK.totalUsuarios, 1),
      ativos24h: gerarVariacao(STATS_MOCK.ativos24h, 10),
      mensagensHoje: gerarVariacao(STATS_MOCK.mensagensHoje, 15),
      intervencoesIA: gerarVariacao(STATS_MOCK.intervencoesIA, 20),
      ultimaAtualizacao: new Date(),
    });
    setLastUpdate('agora');
    setIsConnected(true);
  }, []);

  // Atualização automática
  useEffect(() => {
    fetchStats();

    const interval = setInterval(() => {
      fetchStats();
    }, refreshInterval);

    // Atualizar texto de "última atualização"
    const updateTimer = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - stats.ultimaAtualizacao.getTime()) / 1000);

      if (diff < 10) {
        setLastUpdate('agora');
      } else if (diff < 60) {
        setLastUpdate(`há ${diff}s`);
      } else {
        setLastUpdate(`há ${Math.floor(diff / 60)}min`);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(updateTimer);
    };
  }, [fetchStats, refreshInterval, stats.ultimaAtualizacao]);

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 gap-4">
          {/* Stats Grid */}
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 overflow-x-auto scrollbar-none">
            <StatItem
              icon={Users}
              value={stats.totalUsuarios}
              label="Cadastrados"
              pulse
            />

            <div className="w-[1px] h-6 bg-zinc-800 hidden sm:block" />

            <StatItem
              icon={Activity}
              value={stats.ativos24h}
              label="Ativos 24h"
              color="text-emerald-400"
              pulse
            />

            <div className="w-[1px] h-6 bg-zinc-800 hidden sm:block" />

            <StatItem
              icon={MessageSquare}
              value={stats.mensagensHoje}
              label="Msgs Hoje"
              color="text-cyan-400"
            />

            <div className="w-[1px] h-6 bg-zinc-800 hidden sm:block" />

            <StatItem
              icon={Bot}
              value={stats.intervencoesIA}
              label="IA Hoje"
              color="text-purple-400"
            />
          </div>

          {/* Connection Status */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              {isConnected ? (
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
                  <WifiOff className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-[10px] font-mono text-red-400 uppercase">
                    Reconectando...
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
    </header>
  );
}
