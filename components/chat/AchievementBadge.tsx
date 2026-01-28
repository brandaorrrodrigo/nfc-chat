'use client';

/**
 * AchievementBadge - Badges de Conquista
 * =======================================
 *
 * Mostra conquistas e progresso da usuária
 * Gamificação viciante com emojis 🏆💪✨
 */

import React from 'react';
import { Lock, Sparkles, Trophy } from 'lucide-react';

export interface AchievementBadgeProps {
  icon: string;
  title: string;
  description?: string;
  unlocked?: boolean;
  progress?: number;
  total?: number;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward?: number;
  onClick?: () => void;
}

const rarityConfig = {
  common: {
    gradient: 'from-gray-400 to-gray-500',
    bg: 'bg-slate-800/50',
    border: 'border-gray-600/50',
    label: 'Comum',
    emoji: '⭐',
  },
  rare: {
    gradient: 'from-blue-400 to-cyan-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    label: 'Raro',
    emoji: '💎',
  },
  epic: {
    gradient: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    label: 'Épico',
    emoji: '🌟',
  },
  legendary: {
    gradient: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    label: 'Lendário',
    emoji: '👑',
  },
};

export default function AchievementBadge({
  icon,
  title,
  description,
  unlocked = false,
  progress,
  total,
  rarity = 'common',
  xpReward,
  onClick
}: AchievementBadgeProps) {
  const config = rarityConfig[rarity];
  const hasProgress = progress !== undefined && total !== undefined;
  const progressPercent = hasProgress ? (progress / total) * 100 : 0;

  if (unlocked) {
    return (
      <button
        onClick={onClick}
        className={`
          w-full flex items-center gap-3 p-3 rounded-xl
          bg-gradient-to-r ${config.bg} ${config.border} border
          hover:shadow-md transition-all duration-200
          text-left group
        `}
      >
        {/* Icon with glow */}
        <div className="relative shrink-0">
          <div className={`
            w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient}
            flex items-center justify-center text-2xl shadow-lg
            group-hover:scale-110 transition-transform
          `}>
            {icon}
          </div>
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-semibold text-white truncate">{title}</p>
            <span className="text-xs">{config.emoji}</span>
          </div>
          <p className="text-xs text-cyan-400 font-medium flex items-center gap-1">
            ✅ Desbloqueado!
            {xpReward && (
              <span className="ml-1 px-1.5 py-0.5 bg-cyan-500/20 rounded text-cyan-300">
                +{xpReward} XP
              </span>
            )}
          </p>
        </div>
      </button>
    );
  }

  // Locked badge with progress
  return (
    <button
      onClick={onClick}
      className={`
        w-full p-3 rounded-xl bg-slate-800/50 border border-purple-500/30
        hover:bg-purple-500/10 transition-all duration-200
        text-left group
      `}
    >
      <div className="flex items-center gap-3 mb-2">
        {/* Locked icon */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center">
            <span className="text-2xl grayscale opacity-50">{icon}</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center">
            <Lock className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-300 truncate">{title}</p>
          {description && (
            <p className="text-xs text-gray-500 truncate">{description}</p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {hasProgress && (
        <div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${config.gradient} rounded-full transition-all duration-500`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1 text-right">
            {progress}/{total} {progressPercent >= 80 && '🔥 Quase lá!'}
          </p>
        </div>
      )}
    </button>
  );
}

// Componente de streak
export function StreakBadge({
  days,
  maxDays = 30,
  emoji = '🔥'
}: {
  days: number;
  maxDays?: number;
  emoji?: string;
}) {
  const percentage = Math.min((days / maxDays) * 100, 100);

  const getStreakLevel = () => {
    if (days >= 30) return { label: 'Imparável! 👑', color: 'from-amber-400 to-orange-500' };
    if (days >= 14) return { label: 'Em chamas! 💎', color: 'from-purple-500 to-pink-500' };
    if (days >= 7) return { label: 'Incrível! 🌟', color: 'from-teal-400 to-emerald-500' };
    if (days >= 3) return { label: 'Mandando bem! ⭐', color: 'from-blue-400 to-cyan-500' };
    return { label: 'Começando! 💪', color: 'from-gray-400 to-gray-500' };
  };

  const { label, color } = getStreakLevel();

  return (
    <div className={`p-4 rounded-2xl bg-gradient-to-r ${color} text-white relative overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 text-6xl opacity-20 -rotate-12 translate-x-2 -translate-y-2">
        {emoji}
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-white/80 text-sm font-medium">Sequência</p>
            <p className="text-3xl font-black">
              {days} <span className="text-lg font-normal">dias</span>
            </p>
          </div>
          <div className="text-4xl animate-bounce" style={{ animationDuration: '1s' }}>
            {emoji}
          </div>
        </div>

        <p className="text-sm font-medium text-white/90 mb-2">{label}</p>

        <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-white/70 mt-1">
          {maxDays - days > 0 ? `${maxDays - days} dias para próximo nível` : 'Nível máximo! 🎉'}
        </p>
      </div>
    </div>
  );
}

// Mini achievement para notificações
export function MiniAchievement({
  icon,
  title,
  xp
}: {
  icon: string;
  title: string;
  xp: number;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/30 animate-slideIn">
      <div className="text-2xl">{icon}</div>
      <div className="flex-1">
        <p className="font-semibold text-white">{title}</p>
        <p className="text-sm text-amber-400 font-medium">+{xp} XP ganhos! 🎉</p>
      </div>
      <Trophy className="w-5 h-5 text-amber-400" />
    </div>
  );
}
