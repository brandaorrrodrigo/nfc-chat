'use client';

/**
 * InsightsPanel Component - Side Panel Premium
 * =============================================
 *
 * Painel lateral com insights, métricas e gamificação
 * Design premium para engajamento feminino
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  TrendingUp,
  Trophy,
  Target,
  Flame,
  Zap,
  Star,
  Crown,
  Heart,
  Bookmark,
  Calendar,
  ChevronRight,
  Sparkles,
  Award,
  Gift,
  Lock,
} from 'lucide-react';

// ========================================
// TIPOS
// ========================================

export interface UserStats {
  streak: number;
  totalMessages: number;
  totalFP: number;
  level: number;
  xpToNextLevel: number;
  currentXp: number;
  savedMessages: number;
  likedMessages: number;
  weeklyGoalProgress: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface InsightsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
}

// ========================================
// LEVEL PROGRESS
// ========================================

function LevelProgress({ level, currentXp, xpToNextLevel }: { level: number; currentXp: number; xpToNextLevel: number }) {
  const percentage = (currentXp / xpToNextLevel) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-2xl bg-gradient-to-br from-nfc-violet/20 to-nfc-cyan/10 border border-nfc-violet/20"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nfc-violet to-nfc-cyan flex items-center justify-center shadow-nfc-glow-violet">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-zinc-500">Seu Nível</p>
            <p className="text-xl font-bold text-white">Level {level}</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-3xl"
        >
          ✨
        </motion.div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-zinc-400">Progresso</span>
          <span className="text-nfc-cyan font-bold">{currentXp.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP</span>
        </div>
        <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, type: 'spring' }}
            className="h-full bg-gradient-to-r from-nfc-violet to-nfc-cyan rounded-full relative"
          >
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ========================================
// STREAK DISPLAY
// ========================================

function StreakDisplay({ streak }: { streak: number }) {
  const getStreakInfo = () => {
    if (streak >= 30) return { gradient: 'from-amber-400 to-orange-500', label: 'Lendário', emoji: '👑' };
    if (streak >= 14) return { gradient: 'from-purple-500 to-pink-500', label: 'Épico', emoji: '💎' };
    if (streak >= 7) return { gradient: 'from-nfc-cyan to-nfc-violet', label: 'Incrível', emoji: '🌟' };
    if (streak >= 3) return { gradient: 'from-nfc-neon to-nfc-emerald', label: 'Em alta', emoji: '🔥' };
    return { gradient: 'from-zinc-500 to-zinc-600', label: 'Começando', emoji: '💪' };
  };

  const { gradient, label, emoji } = getStreakInfo();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-xs font-medium">Streak Atual</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">{streak}</span>
              <span className="text-white/80 text-sm">dias</span>
            </div>
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl"
          >
            {emoji}
          </motion.div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Flame className="w-4 h-4 text-white/80" />
          <span className="text-white/80 text-xs font-medium">{label}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ========================================
// STATS GRID
// ========================================

function StatsGrid({ stats }: { stats: UserStats }) {
  const items = [
    { icon: Zap, label: 'FitPoints', value: stats.totalFP.toLocaleString(), color: 'text-nfc-neon' },
    { icon: Heart, label: 'Curtidas', value: stats.likedMessages, color: 'text-pink-400' },
    { icon: Bookmark, label: 'Salvos', value: stats.savedMessages, color: 'text-nfc-cyan' },
    { icon: TrendingUp, label: 'Mensagens', value: stats.totalMessages, color: 'text-nfc-emerald' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-3 rounded-xl bg-zinc-900 border border-zinc-800"
        >
          <div className="flex items-center gap-2 mb-1">
            <item.icon className={`w-4 h-4 ${item.color}`} />
            <span className="text-xs text-zinc-500">{item.label}</span>
          </div>
          <p className="text-xl font-bold text-white">{item.value}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ========================================
// WEEKLY GOAL
// ========================================

function WeeklyGoal({ progress }: { progress: number }) {
  const daysOfWeek = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const today = new Date().getDay();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-nfc-emerald" />
          <span className="text-sm font-semibold text-white">Meta Semanal</span>
        </div>
        <span className="text-sm text-nfc-emerald font-bold">{progress}%</span>
      </div>

      <div className="flex justify-between gap-1">
        {daysOfWeek.map((day, index) => {
          const isCompleted = index < Math.floor(progress / (100 / 7));
          const isToday = index === today;

          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <div
                className={`
                  w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium
                  ${isCompleted
                    ? 'bg-nfc-emerald text-white'
                    : isToday
                    ? 'bg-zinc-800 border-2 border-nfc-emerald text-nfc-emerald'
                    : 'bg-zinc-800 text-zinc-500'
                  }
                `}
              >
                {isCompleted ? '✓' : day}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ========================================
// BADGES SECTION
// ========================================

function BadgesSection({ badges }: { badges: Badge[] }) {
  const rarityColors = {
    common: 'from-zinc-400 to-zinc-500',
    rare: 'from-blue-400 to-cyan-500',
    epic: 'from-purple-500 to-pink-500',
    legendary: 'from-amber-400 to-orange-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-semibold text-white">Conquistas</span>
        </div>
        <button className="text-xs text-nfc-cyan hover:text-nfc-cyan-400 transition-colors">
          Ver todas
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {badges.slice(0, 8).map((badge) => (
          <motion.div
            key={badge.id}
            whileHover={{ scale: 1.1 }}
            className="relative group"
          >
            <div
              className={`
                w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                ${badge.unlocked
                  ? `bg-gradient-to-br ${rarityColors[badge.rarity]}`
                  : 'bg-zinc-800'
                }
              `}
            >
              {badge.unlocked ? (
                badge.icon
              ) : (
                <Lock className="w-5 h-5 text-zinc-600" />
              )}
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
              {badge.name}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ========================================
// DAILY BONUS
// ========================================

function DailyBonus() {
  const [claimed, setClaimed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-2xl bg-gradient-to-br from-nfc-neon/20 to-nfc-emerald/10 border border-nfc-neon/20"
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={!claimed ? { rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-nfc-neon to-nfc-emerald flex items-center justify-center"
        >
          <Gift className="w-6 h-6 text-black" />
        </motion.div>

        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Bônus Diário</p>
          <p className="text-xs text-zinc-400">
            {claimed ? 'Volte amanhã!' : '+50 FP esperando você!'}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setClaimed(true)}
          disabled={claimed}
          className={`
            px-4 py-2 rounded-xl text-sm font-bold transition-all
            ${claimed
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              : 'bg-nfc-neon text-black hover:bg-nfc-neon-400 shadow-nfc-neon'
            }
          `}
        >
          {claimed ? 'Coletado ✓' : 'Coletar'}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export default function InsightsPanel({ isOpen, onClose, stats }: InsightsPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="
              fixed top-0 right-0 h-full w-full max-w-sm
              bg-zinc-950 border-l border-zinc-800
              z-50 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700
            "
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-nfc-neon" />
                <h2 className="text-lg font-bold text-white">Seu Progresso</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <LevelProgress
                level={stats.level}
                currentXp={stats.currentXp}
                xpToNextLevel={stats.xpToNextLevel}
              />

              <StreakDisplay streak={stats.streak} />

              <DailyBonus />

              <StatsGrid stats={stats} />

              <WeeklyGoal progress={stats.weeklyGoalProgress} />

              <BadgesSection badges={stats.badges} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
