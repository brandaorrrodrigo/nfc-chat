/**
 * FPDisplayCompact - Display compacto de FP para header
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Flame } from 'lucide-react';

interface FPDisplayCompactProps {
  balance: number;
  streak: number;
  loading?: boolean;
  onClick?: () => void;
}

export function FPDisplayCompact({
  balance,
  streak,
  loading = false,
  onClick,
}: FPDisplayCompactProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-zinc-800/50 animate-pulse">
        <div className="w-16 h-5 bg-zinc-700 rounded" />
        <div className="w-12 h-5 bg-zinc-700 rounded" />
      </div>
    );
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 transition-colors border border-zinc-700/50"
    >
      {/* FP Balance */}
      <div className="flex items-center gap-1.5">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="w-5 h-5 rounded-md bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"
        >
          <Zap className="w-3 h-3 text-black" />
        </motion.div>
        <span className="text-sm font-bold text-white">
          {balance.toLocaleString()}
        </span>
        <span className="text-xs text-zinc-500">FP</span>
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-zinc-600" />

      {/* Streak */}
      <div className="flex items-center gap-1.5">
        <Flame
          className={`w-4 h-4 ${
            streak > 0 ? 'text-orange-500' : 'text-zinc-600'
          }`}
        />
        <span
          className={`text-sm font-bold ${
            streak > 0 ? 'text-white' : 'text-zinc-500'
          }`}
        >
          {streak}
        </span>
        <span className="text-xs text-zinc-500">dias</span>
      </div>
    </motion.button>
  );
}
