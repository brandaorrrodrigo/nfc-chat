'use client';

import React from 'react';
import type { ArenaCategoria } from '@/types/arena';
import { FILTER_OPTIONS } from '@/lib/arena-utils';

interface QuickFiltersProps {
  activeFilter: ArenaCategoria | null;
  onFilterChange: (filter: ArenaCategoria | null) => void;
}

export default function QuickFilters({ activeFilter, onFilterChange }: QuickFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
      {FILTER_OPTIONS.map((option) => {
        const isActive = activeFilter === option.key;

        return (
          <button
            key={option.label}
            onClick={() => onFilterChange(option.key)}
            className={`
              flex-shrink-0
              px-4 py-2
              rounded-lg
              text-sm font-medium
              transition-all duration-200
              whitespace-nowrap
              ${
                isActive
                  ? 'bg-gradient-to-r from-[#00f5ff]/20 to-[#8b5cf6]/20 text-white border border-[#00f5ff]/40 shadow-[0_0_15px_rgba(0,245,255,0.15)]'
                  : 'bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:border-zinc-600 hover:text-white'
              }
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
