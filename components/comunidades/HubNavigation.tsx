'use client';

/**
 * HubNavigation - Navegação para Hubs de Arenas
 *
 * Use este componente em menus, headers ou sidebars
 * para vincular aos hubs de arenas
 */

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface HubLink {
  slug: string;
  title: string;
  emoji: string;
  description: string;
}

const HUBS: HubLink[] = [
  {
    slug: 'hub-avaliacao-fisica',
    title: 'Hub de Avaliação Física',
    emoji: '👤',
    description: 'Composição, postura, assimetrias e transformação',
  },
  {
    slug: 'hub-biomecanico',
    title: 'Hub Biomecânica - Análise de Exercício',
    emoji: '⚡',
    description: 'Agachamento, terra, supino, puxadas e elevação pélvica',
  },
];

export function HubNavigation() {
  return (
    <nav className="space-y-2">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">
        🏢 Hubs de Comunidades
      </p>
      {HUBS.map((hub) => (
        <Link
          key={hub.slug}
          href={`/comunidades/hub/${hub.slug}`}
          className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800/50 transition-colors group"
        >
          <span className="text-xl mt-0.5">{hub.emoji}</span>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">
              {hub.title}
            </h4>
            <p className="text-xs text-gray-500 truncate">{hub.description}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 transition-colors flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100" />
        </Link>
      ))}
    </nav>
  );
}

/**
 * HubNavigationDropdown - Para menus dropdown/mobile
 */
export function HubNavigationDropdown() {
  return (
    <div className="py-2">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-2">
        🏢 Hubs
      </p>
      <div className="space-y-1">
        {HUBS.map((hub) => (
          <Link
            key={hub.slug}
            href={`/comunidades/hub/${hub.slug}`}
            className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-slate-800/50 hover:text-white transition-colors"
          >
            <span className="inline-block mr-2">{hub.emoji}</span>
            {hub.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * HubNavigationGrid - Para exibir hubs em grid (dashboard)
 */
export function HubNavigationGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {HUBS.map((hub) => (
        <Link
          key={hub.slug}
          href={`/comunidades/hub/${hub.slug}`}
          className="group relative overflow-hidden rounded-lg border border-purple-500/20 bg-slate-900/50 p-4 hover:bg-slate-900 hover:border-cyan-500/50 transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
        >
          <div className="text-3xl mb-2">{hub.emoji}</div>
          <h3 className="font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors text-sm line-clamp-2">
            {hub.title}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2">{hub.description}</p>
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/5 group-hover:to-cyan-500/10 transition-all" />
        </Link>
      ))}
    </div>
  );
}
