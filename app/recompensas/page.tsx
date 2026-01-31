/**
 * Pagina de Recompensas - Explicacao do Sistema FP
 *
 * Explica como funciona o sistema de Fitness Points,
 * como ganhar e como converter em desconto.
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { FPExplanation } from '@/components/gamification/FPExplanation';
import { useFP } from '@/hooks/useFP';

export default function RecompensasPage() {
  const { balance, streak, loading } = useFP();

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-black">
      {/* Header com voltar */}
      <div className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Voltar</span>
          </Link>
          <h1 className="text-lg font-semibold text-white">Recompensas</h1>
        </div>
      </div>

      {/* Conteudo principal */}
      <main className="px-4 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <FPExplanation
            currentBalance={loading ? 0 : balance}
            currentStreak={loading ? 0 : streak}
          />
        </motion.div>
      </main>
    </div>
  );
}
