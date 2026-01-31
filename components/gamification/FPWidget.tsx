/**
 * FPWidget - Widget flutuante de FP
 *
 * Sempre visivel no canto inferior direito da tela.
 * Mostra saldo de FP, streak e link para pagina de recompensas.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Gift, ChevronUp, Trophy, Info } from 'lucide-react';
import Link from 'next/link';
import { useFP } from '@/hooks/useFP';
import { FP_CONFIG } from '@/lib/fp/config';
import { FPIcon } from './FPIcon';

interface FPWidgetProps {
  initialExpanded?: boolean;
  showOnlyWhenLoggedIn?: boolean;
  userId?: string;
}

export function FPWidget({
  initialExpanded = false,
  showOnlyWhenLoggedIn = true,
  userId,
}: FPWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [isVisible, setIsVisible] = useState(true);
  const { balance, streak, discountAvailable, loading, error } = useFP();

  // Calcula o desconto disponivel
  const discountPercent = Math.min(
    Math.floor(balance / FP_CONFIG.FP_PER_PERCENT),
    FP_CONFIG.MAX_DISCOUNT_PERCENT
  );

  // FP para o proximo 1%
  const fpForNextPercent = FP_CONFIG.FP_PER_PERCENT - (balance % FP_CONFIG.FP_PER_PERCENT);

  // Esconde em mobile quando teclado esta aberto (scroll para baixo)
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY;
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        setIsVisible(!isScrollingDown || currentScrollY < 100);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Se nao tem userId e showOnlyWhenLoggedIn, nao mostra
  if (showOnlyWhenLoggedIn && !userId) {
    return null;
  }

  if (error) {
    return null; // Nao mostra widget se houver erro
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-4 right-4 z-[90]"
        >
          <div className={`
            bg-zinc-900/95 backdrop-blur-md
            border border-zinc-800
            rounded-2xl shadow-2xl shadow-black/50
            overflow-hidden
            transition-all duration-300
            ${isExpanded ? 'w-72' : 'w-auto'}
          `}>
            {/* Header compacto (sempre visivel) */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-800/50 transition-colors"
            >
              {/* Moeda FP animada */}
              <motion.div
                animate={{
                  scale: loading ? 1 : [1, 1.05, 1],
                }}
                transition={{
                  scale: { duration: 2, repeat: Infinity },
                }}
                className="relative"
              >
                {/* Glow */}
                <div className="absolute inset-0 bg-yellow-500 rounded-full blur-md opacity-30" />
                <FPIcon size={44} animated={!loading} spin={loading} />
              </motion.div>

              {/* Saldo */}
              <div className="flex-1 text-left">
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-white">
                    {loading ? '...' : balance.toLocaleString()}
                  </span>
                  <span className="text-xs text-zinc-500">FP</span>
                </div>
                {streak > 0 && (
                  <div className="flex items-center gap-1 text-xs text-orange-400">
                    <Flame className="w-3 h-3" />
                    <span>{streak} dias</span>
                  </div>
                )}
              </div>

              {/* Chevron */}
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronUp className="w-5 h-5 text-zinc-500" />
              </motion.div>
            </button>

            {/* Conteudo expandido */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-4">
                    {/* Barra de progresso para proximo % */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-400">Proximo 1% de desconto</span>
                        <span className="text-amber-400 font-medium">{fpForNextPercent} FP</span>
                      </div>
                      <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${((FP_CONFIG.FP_PER_PERCENT - fpForNextPercent) / FP_CONFIG.FP_PER_PERCENT) * 100}%`
                          }}
                          transition={{ duration: 0.5 }}
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                        />
                      </div>
                    </div>

                    {/* Desconto disponivel */}
                    {discountPercent > 0 && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <Gift className="w-5 h-5 text-emerald-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-emerald-400">
                            {discountPercent}% de desconto
                          </p>
                          <p className="text-xs text-emerald-400/70">
                            Disponivel para usar no app
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Stats rapidos */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 rounded-lg bg-zinc-800/50">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Flame className="w-3.5 h-3.5 text-orange-400" />
                          <span className="text-xs text-zinc-400">Streak</span>
                        </div>
                        <p className="text-lg font-bold text-white">{streak} <span className="text-xs font-normal text-zinc-500">dias</span></p>
                      </div>
                      <div className="p-2 rounded-lg bg-zinc-800/50">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Trophy className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-xs text-zinc-400">Desconto</span>
                        </div>
                        <p className="text-lg font-bold text-white">{discountPercent}%</p>
                      </div>
                    </div>

                    {/* Botao para pagina de recompensas */}
                    <Link
                      href="/recompensas"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold hover:opacity-90 transition-opacity"
                    >
                      <Info className="w-4 h-4" />
                      <span>Como ganhar mais FP</span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * FPWidgetMini - Versao compacta para headers
 */
interface FPWidgetMiniProps {
  onClick?: () => void;
}

export function FPWidgetMini({ onClick }: FPWidgetMiniProps) {
  const { balance, streak, loading } = useFP();

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 transition-colors border border-zinc-700/50"
    >
      {/* FP */}
      <div className="flex items-center gap-1.5">
        <FPIcon size={24} />
        <span className="text-sm font-bold text-white">
          {loading ? '...' : balance.toLocaleString()}
        </span>
        <span className="text-xs text-zinc-500">FP</span>
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-zinc-600" />

      {/* Streak */}
      <div className="flex items-center gap-1.5">
        <Flame className={`w-4 h-4 ${streak > 0 ? 'text-orange-500' : 'text-zinc-600'}`} />
        <span className={`text-sm font-bold ${streak > 0 ? 'text-white' : 'text-zinc-500'}`}>
          {streak}
        </span>
        <span className="text-xs text-zinc-500">dias</span>
      </div>
    </motion.button>
  );
}

export default FPWidget;
