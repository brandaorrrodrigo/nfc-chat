'use client';

/**
 * BadgeNotification - Modal de conquista de badge
 * Aparece quando usuário ganha novo badge
 */

import { useEffect, useState } from 'react';
import { X, Sparkles, Award } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  fpReward: number;
}

interface BadgeNotificationProps {
  badge: Badge | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BadgeNotification({ badge, isOpen, onClose }: BadgeNotificationProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // TODO: Add confetti animation (install canvas-confetti)
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender || !badge) return null;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-red-500 to-orange-500';
      case 'epic': return 'from-purple-500 to-pink-500';
      case 'rare': return 'from-blue-500 to-cyan-500';
      default: return 'from-green-500 to-emerald-500';
    }
  };

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'Lendário';
      case 'epic': return 'Épico';
      case 'rare': return 'Raro';
      default: return 'Comum';
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div
        className={`relative bg-gradient-to-br from-zinc-900 to-zinc-800 border-2 border-zinc-700 rounded-2xl max-w-md w-full p-8 transform transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sparkles Animation */}
        <div className="absolute -top-4 -right-4">
          <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
        </div>

        {/* Content */}
        <div className="text-center">
          {/* Badge Earned Text */}
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
              <Award className="w-4 h-4 text-green-400" />
              <span className="text-sm font-semibold text-green-400">Badge Conquistado!</span>
            </div>
          </div>

          {/* Badge Icon */}
          <div className="mb-6">
            <div
              className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${getRarityColor(
                badge.rarity
              )} p-1 animate-bounce-slow`}
            >
              <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center">
                <span className="text-6xl">{badge.icon}</span>
              </div>
            </div>
          </div>

          {/* Badge Info */}
          <div className="mb-6">
            <div className="inline-block px-3 py-1 mb-2 rounded-full bg-gradient-to-r ${getRarityColor(badge.rarity)} text-white text-xs font-bold">
              {getRarityLabel(badge.rarity)}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{badge.name}</h2>
            <p className="text-sm text-zinc-400">{badge.description}</p>
          </div>

          {/* FP Reward */}
          {badge.fpReward > 0 && (
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <p className="text-sm text-zinc-400 mb-1">Recompensa</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-bold text-yellow-400">+{badge.fpReward}</span>
                <span className="text-sm text-zinc-500">FP</span>
              </div>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:opacity-90 transition"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook para gerenciar notificações de badges
 */
export function useBadgeNotification() {
  const [badge, setBadge] = useState<Badge | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const showBadge = (newBadge: Badge) => {
    setBadge(newBadge);
    setIsOpen(true);
  };

  const closeBadge = () => {
    setIsOpen(false);
  };

  return {
    badge,
    isOpen,
    showBadge,
    closeBadge,
  };
}
