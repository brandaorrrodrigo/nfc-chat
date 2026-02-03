'use client';

/**
 * FPDashboard - Painel completo de Fitness Points
 */

import { useState, useEffect } from 'react';
import { Coins, TrendingUp, ArrowUpRight, ArrowDownRight, History } from 'lucide-react';

interface FPDashboardProps {
  userId: string;
}

export function FPDashboard({ userId }: FPDashboardProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/fp/balance?userId=${userId}`)
      .then(res => res.json())
      .then(data => { setStats(data); setLoading(false); });
  }, [userId]);

  if (loading || !stats) return <div className="animate-pulse h-32 bg-zinc-800 rounded-xl" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-5 h-5 text-purple-400" />
            <span className="text-xs text-zinc-500">Disponível</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.available}</p>
          <p className="text-xs text-zinc-400">FP</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-xs text-zinc-500">Total</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-xs text-zinc-400">Acumulados</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpRight className="w-5 h-5 text-blue-400" />
            <span className="text-xs text-zinc-500">Hoje</span>
          </div>
          <p className="text-2xl font-bold text-white">+{stats.earnedToday}</p>
          <p className="text-xs text-zinc-400">Ganhos</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownRight className="w-5 h-5 text-orange-400" />
            <span className="text-xs text-zinc-500">Hoje</span>
          </div>
          <p className="text-2xl font-bold text-white">-{stats.spentToday}</p>
          <p className="text-xs text-zinc-400">Gastos</p>
        </div>
      </div>
    </div>
  );
}
