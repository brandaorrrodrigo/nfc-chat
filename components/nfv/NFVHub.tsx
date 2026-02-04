'use client';

/**
 * NFV Hub - Layout do Hub Biomecanico
 * Página principal com categorias + cards das arenas premium
 * Funciona standalone (sem children)
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { Activity, Video, Zap, ArrowLeft, ChevronRight, Lock } from 'lucide-react';
import NFVCategoryFilter from './NFVCategoryFilter';
import { NFV_CONFIG, getPremiumArenasByCategory } from '@/lib/biomechanics/nfv-config';
import type { NFVPremiumArena } from '@/lib/biomechanics/nfv-config';

export default function NFVHub() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredArenas: NFVPremiumArena[] = activeCategory
    ? getPremiumArenasByCategory(activeCategory)
    : NFV_CONFIG.PREMIUM_ARENAS;

  return (
    <div
      className="min-h-[calc(100vh-64px)] flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #1a0a27 100%)'
      }}
    >
      {/* Header NFV */}
      <div className="bg-gradient-to-r from-purple-900/30 via-zinc-900/50 to-cyan-900/30 border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <Link href="/" className="text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Activity className="w-6 h-6 text-purple-400" />
            <h1 className="text-lg font-bold text-white">Hub Biomecânico</h1>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-mono">
              NFV
            </span>
          </div>
          <p className="text-sm text-zinc-400 mb-4 ml-8">
            Envie vídeos dos seus exercícios e receba análise biomecânica com IA + revisão de especialista.
          </p>

          {/* Category Filter */}
          <div className="ml-8">
            <NFVCategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>
        </div>
      </div>

      {/* Conteúdo Principal - Grid de Arenas Premium */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-6">

          {/* Cards das Arenas Premium */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {filteredArenas.map((arena) => (
              <Link
                key={arena.slug}
                href={`/comunidades/${arena.slug}`}
                className="group block bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-600 transition-all hover:shadow-xl hover:shadow-purple-500/5"
              >
                <div className="flex items-start gap-4">
                  {/* Icon grande */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ backgroundColor: `${arena.color}20` }}
                  >
                    {arena.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors mb-1">
                      {arena.name}
                    </h3>

                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex items-center gap-1 text-xs text-zinc-500">
                        <Video className="w-3 h-3" />
                        Análise de vídeo
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-xs text-amber-400/80">
                        <Lock className="w-3 h-3" />
                        {arena.fpCost} FP por upload
                      </span>
                      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-purple-400 transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Info Box - Como Funciona */}
          <div className="bg-gradient-to-r from-amber-900/10 via-purple-900/10 to-cyan-900/10 rounded-2xl p-6 border border-zinc-800">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Como funciona a Análise Biomecânica
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                  1
                </div>
                <p className="text-xs text-zinc-400">Escolha o exercício e entre na arena</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
                  2
                </div>
                <p className="text-xs text-zinc-400">Envie seu vídeo (arquivo ou URL do YouTube)</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                  3
                </div>
                <p className="text-xs text-zinc-400">IA analisa biomecânica automaticamente</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                  4
                </div>
                <p className="text-xs text-zinc-400">Especialista revisa e publica em até 48h</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-800">
              <div className="flex flex-wrap gap-4 text-[11px] text-zinc-500">
                <span>25 FP por upload de vídeo</span>
                <span>+10 FP quando análise é publicada</span>
                <span>+3 FP por voto útil recebido</span>
                <span className="text-emerald-400/70">Assinantes App: upload gratuito</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
