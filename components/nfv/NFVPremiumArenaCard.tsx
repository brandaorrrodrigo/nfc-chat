'use client';

/**
 * NFV Premium Arena Card - Card link para arenas premium de analise
 */

import React from 'react';
import Link from 'next/link';
import { Video, Lock, ChevronRight } from 'lucide-react';
import type { NFVPremiumArena } from '@/lib/biomechanics/nfv-config';

interface NFVPremiumArenaCardProps {
  arena: NFVPremiumArena;
  analysisCount?: number;
}

export default function NFVPremiumArenaCard({
  arena,
  analysisCount = 0,
}: NFVPremiumArenaCardProps) {
  return (
    <Link
      href={`/comunidades/${arena.slug}`}
      className="group block bg-zinc-900/70 border border-zinc-800 rounded-xl p-4 hover:border-zinc-600 transition-all hover:shadow-lg"
      style={{ '--arena-color': arena.color } as React.CSSProperties}
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
          style={{ backgroundColor: `${arena.color}20` }}
        >
          {arena.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
            {arena.name}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <Video className="w-3 h-3 text-zinc-500" />
            <span className="text-xs text-zinc-500">
              {analysisCount} {analysisCount === 1 ? 'analise' : 'analises'}
            </span>
            <span className="text-xs text-amber-400/80 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              {arena.fpCost} FP
            </span>
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
      </div>
    </Link>
  );
}
