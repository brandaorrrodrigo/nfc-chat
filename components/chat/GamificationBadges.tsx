'use client';

/**
 * GamificationBadges Component - Sistema de Conquistas
 * =====================================================
 *
 * Sistema completo de badges, streaks e FitPoints
 * Design premium para máximo engajamento
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Star,
  Crown,
  Flame,
  Zap,
  Heart,
  Target,
  Award,
  Gift,
  Lock,
  Sparkles,
  TrendingUp,
  Calendar,
  MessageSquare,
  BookOpen,
  Dumbbell,
  Apple,
  Moon,
  Droplets,
  Brain,
} from 'lucide-react';

// ========================================
// TIPOS
// ========================================

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'streak' | 'messages' | 'engagement' | 'nutrition' | 'fitness' | 'special';
  rarity: BadgeRarity;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export interface GamificationBadgesProps {
  badges: Badge[];
  totalFP: number;
  streak: number;
  onBadgeClick?: (badge: Badge) => void;
}

// ========================================
// CONFIGURAÇÕES
// ========================================

const rarityConfig: Record<BadgeRarity, {
  gradient: string;
  border: string;
  glow: string;
  label: string;
}> = {
  common: {
    gradient: 'from-zinc-400 to-zinc-500',
    border: 'border-zinc-500/50',
    glow: '',
    label: 'Comum',
  },
  rare: {
    gradient: 'from-blue-400 to-cyan-500',
    border: 'border-cyan-500/50',
    glow: 'shadow-lg shadow-cyan-500/20',
    label: 'Raro',
  },
  epic: {
    gradient: 'from-purple-500 to-pink-500',
    border: 'border-purple-500/50',
    glow: 'shadow-lg shadow-purple-500/30',
    label: 'Épico',
  },
  legendary: {
    gradient: 'from-amber-400 to-orange-500',
    border: 'border-amber-500/50',
    glow: 'shadow-lg shadow-amber-500/30',
    label: 'Lendário',
  },
};

const categoryIcons: Record<Badge['category'], React.ElementType> = {
  streak: Flame,
  messages: MessageSquare,
  engagement: Heart,
  nutrition: Apple,
  fitness: Dumbbell,
  special: Crown,
};

// ========================================
// BADGE CARD
// ========================================

function BadgeCard({
  badge,
  onClick,
}: {
  badge: Badge;
  onClick?: () => void;
}) {
  const rarity = rarityConfig[badge.rarity];
  const CategoryIcon = categoryIcons[badge.category];

  return (
    <motion.button
      whileHover={{ scale: badge.unlocked ? 1.05 : 1 }}
      whileTap={{ scale: badge.unlocked ? 0.95 : 1 }}
      onClick={onClick}
      className={`
        relative p-4 rounded-2xl transition-all duration-300
        ${badge.unlocked
          ? `bg-gradient-to-br ${rarity.gradient} ${rarity.glow}`
          : 'bg-zinc-900 border border-zinc-800'
        }
      `}
    >
      {/* Badge Icon */}
      <div className="flex flex-col items-center gap-3">
        <div
          className={`
            w-16 h-16 rounded-2xl flex items-center justify-center text-3xl
            ${badge.unlocked
              ? 'bg-white/20'
              : 'bg-zinc-800'
            }
          `}
        >
          {badge.unlocked ? (
            badge.icon
          ) : (
            <Lock className="w-6 h-6 text-zinc-600" />
          )}
        </div>

        <div className="text-center">
          <p className={`
            text-sm font-bold truncate max-w-[100px]
            ${badge.unlocked ? 'text-white' : 'text-zinc-500'}
          `}>
            {badge.name}
          </p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <CategoryIcon className={`w-3 h-3 ${badge.unlocked ? 'text-white/70' : 'text-zinc-600'}`} />
            <span className={`text-xs ${badge.unlocked ? 'text-white/70' : 'text-zinc-600'}`}>
              {rarity.label}
            </span>
          </div>
        </div>

        {/* Progress bar for locked badges */}
        {!badge.unlocked && badge.progress !== undefined && badge.maxProgress !== undefined && (
          <div className="w-full">
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                className={`h-full bg-gradient-to-r ${rarity.gradient} rounded-full`}
              />
            </div>
            <p className="text-xs text-zinc-500 mt-1 text-center">
              {badge.progress}/{badge.maxProgress}
            </p>
          </div>
        )}
      </div>

      {/* Unlock animation overlay */}
      {badge.unlocked && (
        <motion.div
          animate={{ opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-2xl bg-white/10"
        />
      )}
    </motion.button>
  );
}

// ========================================
// BADGE DETAIL MODAL
// ========================================

function BadgeDetailModal({
  badge,
  isOpen,
  onClose,
}: {
  badge: Badge | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!badge) return null;

  const rarity = rarityConfig[badge.rarity];
  const CategoryIcon = categoryIcons[badge.category];

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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-sm mx-auto z-50"
          >
            <div className={`
              relative p-6 rounded-3xl overflow-hidden
              ${badge.unlocked
                ? `bg-gradient-to-br ${rarity.gradient}`
                : 'bg-zinc-900 border border-zinc-800'
              }
            `}>
              {/* Background decoration */}
              {badge.unlocked && (
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                </div>
              )}

              {/* Content */}
              <div className="relative z-10 text-center">
                <motion.div
                  animate={badge.unlocked ? { rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`
                    w-24 h-24 mx-auto mb-4 rounded-3xl flex items-center justify-center text-5xl
                    ${badge.unlocked ? 'bg-white/20' : 'bg-zinc-800'}
                  `}
                >
                  {badge.unlocked ? badge.icon : <Lock className="w-10 h-10 text-zinc-600" />}
                </motion.div>

                <h3 className={`text-xl font-bold mb-2 ${badge.unlocked ? 'text-white' : 'text-zinc-400'}`}>
                  {badge.name}
                </h3>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <CategoryIcon className={`w-4 h-4 ${badge.unlocked ? 'text-white/70' : 'text-zinc-500'}`} />
                  <span className={`text-sm ${badge.unlocked ? 'text-white/70' : 'text-zinc-500'}`}>
                    {rarity.label}
                  </span>
                </div>

                <p className={`text-sm mb-6 ${badge.unlocked ? 'text-white/80' : 'text-zinc-500'}`}>
                  {badge.description}
                </p>

                {badge.unlocked && badge.unlockedAt && (
                  <div className="flex items-center justify-center gap-2 text-white/60 text-xs">
                    <Calendar className="w-3 h-3" />
                    <span>
                      Desbloqueado em {badge.unlockedAt.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}

                {!badge.unlocked && badge.progress !== undefined && badge.maxProgress !== undefined && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-zinc-500 mb-2">
                      <span>Progresso</span>
                      <span>{badge.progress}/{badge.maxProgress}</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                        className={`h-full bg-gradient-to-r ${rarity.gradient} rounded-full`}
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={onClose}
                  className={`
                    mt-6 px-6 py-2 rounded-xl text-sm font-bold transition-all
                    ${badge.unlocked
                      ? 'bg-white/20 text-white hover:bg-white/30'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }
                  `}
                >
                  Fechar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ========================================
// FP DISPLAY
// ========================================

function FPDisplay({ totalFP }: { totalFP: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-gradient-to-br from-nfc-neon/20 to-nfc-emerald/10 border border-nfc-neon/20"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-nfc-neon to-nfc-emerald flex items-center justify-center shadow-nfc-neon"
          >
            <Zap className="w-7 h-7 text-black" />
          </motion.div>
          <div>
            <p className="text-sm text-zinc-400">Seu FP</p>
            <p className="text-3xl font-black text-white">{totalFP.toLocaleString()}</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-xl bg-nfc-neon/20 border border-nfc-neon/30 text-nfc-neon text-sm font-bold hover:bg-nfc-neon/30 transition-all"
        >
          <Gift className="w-4 h-4 inline mr-2" />
          Resgatar
        </motion.button>
      </div>

      <div className="mt-4 pt-4 border-t border-nfc-neon/10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">Próxima recompensa</span>
          <span className="text-nfc-neon font-bold">2.000 FP</span>
        </div>
        <div className="mt-2 h-2 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((totalFP % 2000) / 2000 * 100, 100)}%` }}
            className="h-full bg-gradient-to-r from-nfc-neon to-nfc-emerald rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
}

// ========================================
// STREAK DISPLAY
// ========================================

function StreakDisplay({ streak }: { streak: number }) {
  const getStreakLevel = () => {
    if (streak >= 30) return { label: 'Lendário', emoji: '👑', gradient: 'from-amber-400 to-orange-500' };
    if (streak >= 14) return { label: 'Épico', emoji: '💎', gradient: 'from-purple-500 to-pink-500' };
    if (streak >= 7) return { label: 'Incrível', emoji: '🌟', gradient: 'from-nfc-cyan to-nfc-violet' };
    if (streak >= 3) return { label: 'Em alta', emoji: '🔥', gradient: 'from-nfc-neon to-nfc-emerald' };
    return { label: 'Começando', emoji: '💪', gradient: 'from-zinc-500 to-zinc-600' };
  };

  const { label, emoji, gradient } = getStreakLevel();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-2xl bg-gradient-to-br ${gradient} relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">Streak Atual</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-white">{streak}</span>
            <span className="text-white/80 text-lg">dias</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Flame className="w-4 h-4 text-white/80" />
            <span className="text-white/80 text-sm font-medium">{label}</span>
          </div>
        </div>

        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl"
        >
          {emoji}
        </motion.div>
      </div>

      {/* Streak bonus indicator */}
      {streak >= 7 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 pt-4 border-t border-white/20 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span className="text-white text-sm font-medium">
            Bônus de {streak >= 30 ? '3x' : streak >= 14 ? '2x' : '1.5x'} FP ativo!
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export default function GamificationBadges({
  badges,
  totalFP,
  streak,
  onBadgeClick,
}: GamificationBadgesProps) {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [activeCategory, setActiveCategory] = useState<Badge['category'] | 'all'>('all');

  const categories = [
    { id: 'all' as const, label: 'Todas', icon: Award },
    { id: 'streak' as const, label: 'Streaks', icon: Flame },
    { id: 'messages' as const, label: 'Mensagens', icon: MessageSquare },
    { id: 'engagement' as const, label: 'Engajamento', icon: Heart },
    { id: 'nutrition' as const, label: 'Nutrição', icon: Apple },
    { id: 'fitness' as const, label: 'Fitness', icon: Dumbbell },
    { id: 'special' as const, label: 'Especiais', icon: Crown },
  ];

  const filteredBadges = activeCategory === 'all'
    ? badges
    : badges.filter((b) => b.category === activeCategory);

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FPDisplay totalFP={totalFP} />
        <StreakDisplay streak={streak} />
      </div>

      {/* Badges Section */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Suas Conquistas</h2>
              <p className="text-sm text-zinc-500">
                {unlockedCount} de {badges.length} desbloqueadas
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold text-white">{Math.round((unlockedCount / badges.length) * 100)}%</p>
            <p className="text-xs text-zinc-500">completo</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
                  ${activeCategory === cat.id
                    ? 'bg-nfc-neon text-black'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredBadges.map((badge) => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              onClick={() => {
                setSelectedBadge(badge);
                onBadgeClick?.(badge);
              }}
            />
          ))}
        </div>
      </div>

      {/* Badge Detail Modal */}
      <BadgeDetailModal
        badge={selectedBadge}
        isOpen={selectedBadge !== null}
        onClose={() => setSelectedBadge(null)}
      />
    </div>
  );
}
