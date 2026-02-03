'use client';

/**
 * NFV Category Filter - Tabs horizontais de categorias (Level 2)
 * Filtra mensagens no Hub por tag/categoria
 */

import React from 'react';
import { NFV_CONFIG, type NFVCategory } from '@/lib/biomechanics/nfv-config';

interface NFVCategoryFilterProps {
  activeCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export default function NFVCategoryFilter({
  activeCategory,
  onCategoryChange,
}: NFVCategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-700">
      {/* Todos */}
      <button
        onClick={() => onCategoryChange(null)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
          activeCategory === null
            ? 'bg-[#8b5cf6] text-white shadow-lg shadow-purple-500/20'
            : 'bg-zinc-800/60 text-zinc-400 hover:bg-zinc-700/60 hover:text-zinc-200'
        }`}
      >
        Todos
      </button>

      {NFV_CONFIG.CATEGORIES.map((cat: NFVCategory) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            activeCategory === cat.id
              ? 'bg-[#8b5cf6] text-white shadow-lg shadow-purple-500/20'
              : 'bg-zinc-800/60 text-zinc-400 hover:bg-zinc-700/60 hover:text-zinc-200'
          }`}
        >
          <span>{cat.icon}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
