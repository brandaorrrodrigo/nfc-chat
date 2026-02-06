'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Activity,
  Dumbbell,
  Heart,
  Users,
  Utensils,
  BookOpen,
  Zap,
  LucideIcon,
} from 'lucide-react';
import type { ArenaWithTags, ArenaCategoria } from '@/types/arena';
import {
  CATEGORIA_LABELS,
  CATEGORIA_ORDER,
  CATEGORIA_GRADIENTS,
  STATUS_CONFIG,
  groupArenasByCategory,
} from '@/lib/arena-utils';

const CATEGORIA_ICON_MAP: Record<ArenaCategoria, LucideIcon> = {
  NUTRICAO_DIETAS: Utensils,
  TREINO_EXERCICIOS: Dumbbell,
  BIOMECANICA_NFV: Activity,
  AVALIACAO_BIOMECANICA_NFV: Zap,
  AVALIACAO_BIOMETRICA_NFV: Activity,
  SAUDE_CONDICOES_CLINICAS: Heart,
  RECEITAS_ALIMENTACAO: Utensils,
  COMUNIDADES_LIVRES: Users,
};

interface ArenaIndexProps {
  arenas: ArenaWithTags[];
}

export default function ArenaIndex({ arenas }: ArenaIndexProps) {
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

  const groups = groupArenasByCategory(arenas);

  const toggleCategory = (cat: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const nonEmptyCategories = CATEGORIA_ORDER.filter(
    (cat) => groups[cat] && groups[cat].length > 0
  );

  if (nonEmptyCategories.length === 0) return null;

  return (
    <div className="card-premium rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-[#00f5ff]/20 to-[#8b5cf6]/20">
          <BookOpen className="w-5 h-5 text-[#00f5ff]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">
            Indice de Arenas
          </h2>
          <p className="text-xs text-zinc-500">
            {arenas.length} arenas organizadas por categoria
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="divide-y divide-white/5">
        {nonEmptyCategories.map((cat) => {
          const isOpen = openCategories.has(cat);
          const Icon = CATEGORIA_ICON_MAP[cat] || Users;
          const gradient = CATEGORIA_GRADIENTS[cat];
          const categoryArenas = groups[cat];

          return (
            <div key={cat}>
              {/* Category header */}
              <button
                onClick={() => toggleCategory(cat)}
                className="w-full flex items-center gap-3 px-6 py-3.5 hover:bg-white/[0.02] transition-colors text-left"
              >
                <div className={`p-1.5 rounded-lg bg-gradient-to-br ${gradient} bg-opacity-20`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="flex-1 text-sm font-semibold text-white">
                  {CATEGORIA_LABELS[cat]}
                </span>
                <span className="text-xs text-zinc-500 mr-2">
                  {categoryArenas.length}
                </span>
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-zinc-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                )}
              </button>

              {/* Arena list */}
              {isOpen && (
                <div className="bg-black/20">
                  {categoryArenas.map((arena) => {
                    const statusCfg = STATUS_CONFIG[arena.status] || STATUS_CONFIG.COLD;
                    return (
                      <Link
                        key={arena.id}
                        href={`/comunidades/${arena.slug}`}
                        className="flex items-center gap-3 px-6 pl-14 py-2.5 hover:bg-white/[0.03] transition-colors group"
                      >
                        <span className="flex-1 text-sm text-zinc-300 group-hover:text-white transition-colors truncate">
                          {arena.name}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                          <MessageSquare className="w-3 h-3" />
                          {arena.totalPosts.toLocaleString()}
                        </span>
                        <span className={`flex items-center gap-1 text-xs ${statusCfg.color}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotColor}`} />
                          <span className="hidden sm:inline">{statusCfg.label}</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
