/**
 * FPToast - Toast animado para notificacoes de FP
 *
 * Exibe notificacoes quando o usuario ganha FP, com diferentes
 * estilos baseados no tipo de acao realizada.
 */

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, HelpCircle, Trophy, Flame, Star, Target, Zap } from 'lucide-react';
import { FPIcon } from './FPIcon';

// Tipos de acao e suas configuracoes visuais
const ACTION_CONFIG: Record<string, {
  icon: React.ReactNode;
  label: string;
  gradient: string;
  shadowColor: string;
}> = {
  daily_access: {
    icon: <Star className="w-4 h-4" />,
    label: 'Acesso diario',
    gradient: 'from-amber-400 to-yellow-500',
    shadowColor: 'shadow-yellow-500/40',
  },
  message: {
    icon: <MessageSquare className="w-4 h-4" />,
    label: 'Mensagem enviada',
    gradient: 'from-emerald-400 to-green-500',
    shadowColor: 'shadow-green-500/40',
  },
  question: {
    icon: <HelpCircle className="w-4 h-4" />,
    label: 'Pergunta feita',
    gradient: 'from-cyan-400 to-blue-500',
    shadowColor: 'shadow-blue-500/40',
  },
  message_long: {
    icon: <MessageSquare className="w-4 h-4" />,
    label: 'Mensagem detalhada',
    gradient: 'from-purple-400 to-indigo-500',
    shadowColor: 'shadow-purple-500/40',
  },
  create_arena: {
    icon: <Target className="w-4 h-4" />,
    label: 'Arena criada',
    gradient: 'from-rose-400 to-pink-500',
    shadowColor: 'shadow-pink-500/40',
  },
  streak_30_bonus: {
    icon: <Flame className="w-4 h-4" />,
    label: '30 dias de streak!',
    gradient: 'from-orange-400 to-red-500',
    shadowColor: 'shadow-orange-500/40',
  },
  achievement: {
    icon: <Trophy className="w-4 h-4" />,
    label: 'Conquista desbloqueada',
    gradient: 'from-amber-400 to-orange-500',
    shadowColor: 'shadow-orange-500/40',
  },
  default: {
    icon: <Star className="w-4 h-4" />,
    label: 'FP ganho',
    gradient: 'from-amber-400 to-orange-500',
    shadowColor: 'shadow-orange-500/40',
  },
};

interface FPToastProps {
  amount: number;
  action: string;
  onComplete?: () => void;
  isAchievement?: boolean;
  achievementName?: string;
}

export function FPToast({
  amount,
  action,
  onComplete,
  isAchievement = false,
  achievementName,
}: FPToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  const config = ACTION_CONFIG[action] || ACTION_CONFIG.default;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onComplete?.(), 300);
    }, isAchievement ? 4000 : 2500);

    return () => clearTimeout(timer);
  }, [onComplete, isAchievement]);

  if (amount <= 0) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 25,
          }}
          className={`
            fixed top-20 right-4 z-[100]
            flex items-center gap-3
            px-4 py-3 rounded-xl
            bg-gradient-to-r ${config.gradient}
            text-white font-semibold
            shadow-lg ${config.shadowColor}
            backdrop-blur-sm
            ${isAchievement ? 'min-w-[280px]' : ''}
          `}
        >
          {/* Moeda FP com animacao */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 0.6, repeat: isAchievement ? 2 : 1 }}
            className="relative flex-shrink-0"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-50" />
            <FPIcon size={44} animated glow />
          </motion.div>

          {/* Conteudo */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="text-xl font-bold"
              >
                +{amount}
              </motion.span>
              <span className="text-sm opacity-90">FP</span>
            </div>
            <p className="text-xs opacity-80">
              {isAchievement && achievementName ? achievementName : config.label}
            </p>
          </div>

          {/* Particulas decorativas */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            {[...Array(isAchievement ? 8 : 4)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  x: '50%',
                  y: '50%',
                  scale: 0,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  repeat: isAchievement ? 1 : 0,
                }}
                className="absolute w-2 h-2 rounded-full bg-white/40"
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * FPToastContainer - Gerenciador de toasts
 *
 * Mantém uma fila de toasts e os exibe sequencialmente
 */
interface ToastItem {
  id: string;
  amount: number;
  action: string;
  isAchievement?: boolean;
  achievementName?: string;
}

interface FPToastContainerProps {
  toasts: ToastItem[];
  onToastComplete: (id: string) => void;
}

export function FPToastContainer({ toasts, onToastComplete }: FPToastContainerProps) {
  // Mostra apenas o primeiro toast da fila
  const currentToast = toasts[0];

  if (!currentToast) return null;

  return (
    <FPToast
      key={currentToast.id}
      amount={currentToast.amount}
      action={currentToast.action}
      isAchievement={currentToast.isAchievement}
      achievementName={currentToast.achievementName}
      onComplete={() => onToastComplete(currentToast.id)}
    />
  );
}

/**
 * Hook para gerenciar toasts de FP
 */
export function useFPToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts(prev => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
  };
}

export default FPToast;
