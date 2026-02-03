'use client';

/**
 * NFV Hub - Layout do Hub Biomecanico
 * Level 1: Arena aberta com categorias + sidebar de arenas premium
 */

import React, { useState } from 'react';
import { Activity, Video, Zap } from 'lucide-react';
import NFVCategoryFilter from './NFVCategoryFilter';
import NFVPremiumArenaCard from './NFVPremiumArenaCard';
import { NFV_CONFIG, getPremiumArenasByCategory } from '@/lib/biomechanics/nfv-config';
import type { NFVPremiumArena } from '@/lib/biomechanics/nfv-config';

interface NFVHubProps {
  children: React.ReactNode;
}

export default function NFVHub({ children }: NFVHubProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Filtra arenas premium baseado na categoria ativa
  const filteredArenas: NFVPremiumArena[] = activeCategory
    ? getPremiumArenasByCategory(activeCategory)
    : NFV_CONFIG.PREMIUM_ARENAS;

  return (
    <div className="flex flex-col h-full">
      {/* Header NFV */}
      <div className="bg-gradient-to-r from-purple-900/30 via-zinc-900/50 to-cyan-900/30 border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-5 h-5 text-purple-400" />
          <h2 className="text-sm font-bold text-white">Hub Biomecanico</h2>
          <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-mono">
            NFV
          </span>
        </div>
        <p className="text-xs text-zinc-400 mb-3">
          Discuta tecnica, biomecanica e padroes de movimento. Analise de video nas arenas premium.
        </p>

        {/* Category Filter */}
        <NFVCategoryFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Feed principal (chat) */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

        {/* Sidebar - Arenas Premium (desktop only) */}
        <div className="hidden lg:flex flex-col w-72 border-l border-zinc-800 bg-zinc-950/50 overflow-y-auto">
          <div className="p-3 border-b border-zinc-800">
            <div className="flex items-center gap-2 mb-1">
              <Video className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Arenas de Analise
              </h3>
            </div>
            <p className="text-[10px] text-zinc-500">
              Envie video e receba analise com IA + revisao especialista
            </p>
          </div>

          <div className="p-3 space-y-2">
            {filteredArenas.map((arena) => (
              <NFVPremiumArenaCard key={arena.slug} arena={arena} />
            ))}
          </div>

          {/* FP Info */}
          <div className="mt-auto p-3 border-t border-zinc-800">
            <div className="bg-gradient-to-r from-amber-900/20 to-purple-900/20 rounded-lg p-3 border border-zinc-800">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                  Como funciona
                </span>
              </div>
              <ul className="text-[10px] text-zinc-400 space-y-1">
                <li>25 FP por upload de video</li>
                <li>+10 FP quando analise e publicada</li>
                <li>+3 FP por voto util recebido</li>
                <li>Assinantes App: upload gratuito</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
