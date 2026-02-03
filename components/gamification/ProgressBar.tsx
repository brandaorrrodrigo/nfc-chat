'use client';

/**
 * Progress Bar Component
 * Barra de progresso para próximo tier
 */

import { useEffect, useState } from 'react';
import { TrendingUp, Zap } from 'lucide-react';

interface ProgressionData {
  currentFP: number;
  currentTier: {
    tierName: string;
    badge: string;
    discountPercent: number;
  } | null;
  nextTier: {
    tierName: string;
    badge: string;
    fpRequired: number;
    percentage: number;
    discountPercent: number;
  } | null;
  motivationalMessage: string;
}

export function ProgressBar() {
  const [data, setData] = useState<ProgressionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgression();
  }, []);

  const fetchProgression = async () => {
    try {
      const res = await fetch('/api/gamification/progression');
      if (res.ok) {
        const result = await res.json();
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching progression:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) return null;

  const { currentFP, currentTier, nextTier, motivationalMessage } = data;

  // Se não há próximo tier, usuário já desbloqueou tudo
  if (!nextTier) {
    return (
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">👑</span>
          <div>
            <div className="text-white font-bold text-lg">Nível Máximo!</div>
            <div className="text-white/80 text-sm">
              Você desbloqueou todos os tiers
            </div>
          </div>
        </div>
        <div className="mt-4 bg-white/20 backdrop-blur-sm rounded p-3 text-white text-sm">
          ✨ {motivationalMessage}
        </div>
      </div>
    );
  }

  const fpNeeded = nextTier.fpRequired - currentFP;
  const percentage = Math.min(100, nextTier.percentage);

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 p-6 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          <span className="font-semibold text-white">Seu Progresso</span>
        </div>
        <div className="text-emerald-400 font-bold text-lg">{currentFP} FP</div>
      </div>

      {/* Tier Atual e Próximo */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {currentTier ? (
            <>
              <span className="text-2xl">{currentTier.badge}</span>
              <span className="text-sm text-zinc-400">
                {currentTier.discountPercent}% OFF
              </span>
            </>
          ) : (
            <span className="text-sm text-zinc-500">Iniciante</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="text-2xl">{nextTier.badge}</span>
          <span className="text-sm text-emerald-400 font-semibold">
            {nextTier.discountPercent}% OFF
          </span>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="relative h-8 bg-zinc-800 rounded-full overflow-hidden mb-3">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500 ease-out flex items-center justify-end pr-3"
          style={{ width: `${percentage}%` }}
        >
          {percentage > 15 && (
            <span className="text-white text-xs font-bold">
              {Math.round(percentage)}%
            </span>
          )}
        </div>

        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      </div>

      {/* Info */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-400">
          Faltam <strong className="text-white">{fpNeeded} FP</strong>
        </span>
        <span className="text-zinc-500">{nextTier.fpRequired} FP</span>
      </div>

      {/* Mensagem Motivacional */}
      <div className="mt-4 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-lg p-3">
        <p className="text-sm text-emerald-400">{motivationalMessage}</p>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
