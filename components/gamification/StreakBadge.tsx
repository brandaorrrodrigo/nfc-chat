'use client';

/**
 * StreakBadge - Componente visual de streak diário
 * Mostra dias consecutivos e progresso para próximo milestone
 */

import { useState, useEffect } from 'react';
import { Flame, TrendingUp, Award } from 'lucide-react';

interface StreakBadgeProps {
  userId: string;
  variant?: 'compact' | 'full';
  showDetails?: boolean;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  isActive: boolean;
  nextMilestone?: {
    days: number;
    bonus: number;
    daysLeft: number;
  };
}

export function StreakBadge({
  userId,
  variant = 'compact',
  showDetails = false,
}: StreakBadgeProps) {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreak();
  }, [userId]);

  const fetchStreak = async () => {
    try {
      const res = await fetch(`/api/streak?userId=${userId}`);
      const data = await res.json();
      setStreak(data);
    } catch (error) {
      console.error('Error fetching streak:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !streak) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${
          streak.isActive && streak.currentStreak > 0
            ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30'
            : 'bg-zinc-800/50 border border-zinc-700'
        }`}
      >
        <Flame
          className={`w-4 h-4 ${
            streak.isActive && streak.currentStreak > 0
              ? 'text-orange-400 animate-pulse'
              : 'text-zinc-600'
          }`}
        />
        <span className="text-sm font-semibold text-white">
          {streak.currentStreak}
        </span>
        <span className="text-xs text-zinc-400">dia{streak.currentStreak !== 1 ? 's' : ''}</span>
      </div>
    );
  }

  // Variant: full
  return (
    <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Streak Ativo</p>
            <p className="text-xs text-zinc-400">Dias consecutivos</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-orange-400">{streak.currentStreak}</p>
          <p className="text-xs text-zinc-500">
            Recorde: {streak.longestStreak}
          </p>
        </div>
      </div>

      {/* Next Milestone */}
      {streak.nextMilestone && streak.nextMilestone.daysLeft > 0 && (
        <div className="mt-4 pt-4 border-t border-orange-500/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-yellow-400" />
              <p className="text-xs text-zinc-300">
                Próximo bônus: {streak.nextMilestone.days} dias
              </p>
            </div>
            <p className="text-xs font-semibold text-yellow-400">
              +{streak.nextMilestone.bonus} FP
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${
                  (streak.currentStreak / streak.nextMilestone.days) * 100
                }%`,
              }}
            />
          </div>

          <p className="text-xs text-zinc-500 mt-1">
            Faltam {streak.nextMilestone.daysLeft} dia{streak.nextMilestone.daysLeft !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Achieved Milestone */}
      {streak.nextMilestone && streak.nextMilestone.daysLeft === 0 && (
        <div className="mt-4 pt-4 border-t border-orange-500/20 bg-green-500/10 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-green-400" />
            <p className="text-sm font-semibold text-green-400">
              Parabéns! Você atingiu {streak.currentStreak} dias de streak!
            </p>
          </div>
        </div>
      )}

      {/* Details */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-orange-500/20">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <p>
              Continue entrando todos os dias para manter seu streak e ganhar bônus de FP!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Streak Icon - Versão minimalista para header
 */
export function StreakIcon({ userId }: { userId: string }) {
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    fetchStreak();
  }, [userId]);

  const fetchStreak = async () => {
    try {
      const res = await fetch(`/api/streak?userId=${userId}`);
      const data = await res.json();
      setCurrentStreak(data.currentStreak || 0);
    } catch (error) {
      console.error('Error fetching streak:', error);
    }
  };

  if (currentStreak === 0) return null;

  return (
    <div className="relative">
      <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">
        {currentStreak}
      </span>
    </div>
  );
}
