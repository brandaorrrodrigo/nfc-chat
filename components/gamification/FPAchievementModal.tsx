/**
 * FPAchievementModal - Modal de celebracao de conquistas
 *
 * Exibe um modal fullscreen com animacoes, confetes e celebracao
 * quando o usuario desbloqueia uma conquista importante.
 */

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Flame, Target, Gift, X, Sparkles, Zap } from 'lucide-react';
import { FPIcon } from './FPIcon';

// Tipos de conquistas e suas configuracoes
const ACHIEVEMENT_CONFIG: Record<string, {
  icon: React.ReactNode;
  gradient: string;
  bgGradient: string;
  title: string;
  description: string;
}> = {
  streak_7: {
    icon: <Flame className="w-12 h-12" />,
    gradient: 'from-orange-400 to-red-500',
    bgGradient: 'from-orange-950/90 to-red-950/90',
    title: '7 Dias de Fogo!',
    description: 'Voce manteve a constancia por uma semana inteira!',
  },
  streak_30: {
    icon: <Flame className="w-12 h-12" />,
    gradient: 'from-amber-400 via-orange-500 to-red-600',
    bgGradient: 'from-amber-950/90 via-orange-950/90 to-red-950/90',
    title: '30 Dias Imbativel!',
    description: 'Um mes de dedicacao! Voce e uma inspiracao!',
  },
  first_message: {
    icon: <Star className="w-12 h-12" />,
    gradient: 'from-emerald-400 to-cyan-500',
    bgGradient: 'from-emerald-950/90 to-cyan-950/90',
    title: 'Primeira Mensagem!',
    description: 'Bem-vindo a comunidade! Continue participando!',
  },
  first_question: {
    icon: <Sparkles className="w-12 h-12" />,
    gradient: 'from-blue-400 to-indigo-500',
    bgGradient: 'from-blue-950/90 to-indigo-950/90',
    title: 'Mente Curiosa!',
    description: 'Voce fez sua primeira pergunta. Conhecimento e poder!',
  },
  arena_creator: {
    icon: <Target className="w-12 h-12" />,
    gradient: 'from-purple-400 to-pink-500',
    bgGradient: 'from-purple-950/90 to-pink-950/90',
    title: 'Criador de Arena!',
    description: 'Voce criou sua primeira arena de discussao!',
  },
  fp_100: {
    icon: <FPIcon size={48} animated glow />,
    gradient: 'from-amber-400 to-orange-500',
    bgGradient: 'from-amber-950/90 to-orange-950/90',
    title: 'Centuriao!',
    description: 'Voce acumulou 100 FP! Ja pode resgatar desconto!',
  },
  fp_500: {
    icon: <Trophy className="w-12 h-12" />,
    gradient: 'from-yellow-400 to-amber-500',
    bgGradient: 'from-yellow-950/90 to-amber-950/90',
    title: 'Elite NutriFit!',
    description: '500 FP acumulados! Voce esta entre os melhores!',
  },
  first_redeem: {
    icon: <Gift className="w-12 h-12" />,
    gradient: 'from-emerald-400 to-teal-500',
    bgGradient: 'from-emerald-950/90 to-teal-950/90',
    title: 'Primeiro Resgate!',
    description: 'Voce usou seus FP para ganhar desconto!',
  },
  default: {
    icon: <Trophy className="w-12 h-12" />,
    gradient: 'from-amber-400 to-orange-500',
    bgGradient: 'from-amber-950/90 to-orange-950/90',
    title: 'Conquista Desbloqueada!',
    description: 'Parabens pelo seu progresso!',
  },
};

// Componente de confete individual
function Confetti({ delay, color }: { delay: number; color: string }) {
  const randomX = Math.random() * 100;
  const randomDuration = 2 + Math.random() * 2;

  return (
    <motion.div
      initial={{
        opacity: 1,
        x: `${randomX}vw`,
        y: -20,
        rotate: 0,
        scale: Math.random() * 0.5 + 0.5,
      }}
      animate={{
        opacity: [1, 1, 0],
        y: '100vh',
        rotate: Math.random() * 720 - 360,
      }}
      transition={{
        duration: randomDuration,
        delay,
        ease: 'linear',
      }}
      className={`absolute w-3 h-3 ${color}`}
      style={{
        borderRadius: Math.random() > 0.5 ? '50%' : '0%',
      }}
    />
  );
}

// Componente de confetes
function ConfettiExplosion({ count = 50 }: { count?: number }) {
  const colors = [
    'bg-amber-400',
    'bg-orange-500',
    'bg-emerald-400',
    'bg-cyan-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-yellow-400',
    'bg-red-500',
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[150]">
      {[...Array(count)].map((_, i) => (
        <Confetti
          key={i}
          delay={Math.random() * 0.5}
          color={colors[Math.floor(Math.random() * colors.length)]}
        />
      ))}
    </div>
  );
}

interface FPAchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievementType: string;
  fpAwarded?: number;
  customTitle?: string;
  customDescription?: string;
}

export function FPAchievementModal({
  isOpen,
  onClose,
  achievementType,
  fpAwarded = 0,
  customTitle,
  customDescription,
}: FPAchievementModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  const config = ACHIEVEMENT_CONFIG[achievementType] || ACHIEVEMENT_CONFIG.default;
  const title = customTitle || config.title;
  const description = customDescription || config.description;

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Fechar com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Confetes */}
          {showConfetti && <ConfettiExplosion count={60} />}

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[140]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-[145] p-4"
          >
            <div className={`
              relative w-full max-w-md
              bg-gradient-to-br ${config.bgGradient}
              border border-white/10
              rounded-3xl overflow-hidden
              shadow-2xl
            `}>
              {/* Botao fechar */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>

              {/* Efeito de brilho */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10 pointer-events-none" />

              {/* Conteudo */}
              <div className="relative p-8 text-center">
                {/* Icone principal */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className={`
                    mx-auto w-24 h-24 mb-6
                    flex items-center justify-center
                    rounded-full
                    bg-gradient-to-br ${config.gradient}
                    shadow-lg shadow-current/30
                  `}
                >
                  <div className="text-white">
                    {config.icon}
                  </div>
                </motion.div>

                {/* Titulo */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`
                    text-2xl font-bold mb-2
                    bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent
                  `}
                >
                  {title}
                </motion.h2>

                {/* Descricao */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/70 mb-6"
                >
                  {description}
                </motion.p>

                {/* FP ganhos */}
                {fpAwarded > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    className="inline-flex items-center gap-2 px-6 py-3 mb-6 rounded-full bg-white/10"
                  >
                    <FPIcon size={24} glow />
                    <span className="text-xl font-bold text-white">
                      +{fpAwarded} FP
                    </span>
                  </motion.div>
                )}

                {/* Botao continuar */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  onClick={onClose}
                  className={`
                    w-full py-4 rounded-xl
                    bg-gradient-to-r ${config.gradient}
                    text-white font-bold text-lg
                    hover:opacity-90 transition-opacity
                    shadow-lg shadow-current/30
                  `}
                >
                  Continuar
                </motion.button>
              </div>

              {/* Particulas de fundo */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0.2, 0.5, 0.2],
                      scale: [1, 1.2, 1],
                      x: [0, Math.random() * 20 - 10, 0],
                      y: [0, Math.random() * 20 - 10, 0],
                    }}
                    transition={{
                      duration: 3,
                      delay: i * 0.2,
                      repeat: Infinity,
                    }}
                    className="absolute w-2 h-2 rounded-full bg-white/30"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Hook para gerenciar o modal de conquistas
 */
export function useFPAchievementModal() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    achievementType: string;
    fpAwarded: number;
    customTitle?: string;
    customDescription?: string;
  }>({
    isOpen: false,
    achievementType: 'default',
    fpAwarded: 0,
  });

  const showAchievement = useCallback((
    achievementType: string,
    fpAwarded: number = 0,
    customTitle?: string,
    customDescription?: string
  ) => {
    setModalState({
      isOpen: true,
      achievementType,
      fpAwarded,
      customTitle,
      customDescription,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  }, []);

  return {
    ...modalState,
    showAchievement,
    closeModal,
  };
}

export default FPAchievementModal;
