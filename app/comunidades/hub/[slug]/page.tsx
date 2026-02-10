'use client';

/**
 * PÁGINA HUB - Grid de Arenas Filhas
 *
 * Mostra todas as arenas que pertencem a um HUB (arenaType='NFV_HUB')
 * Exemplo: /comunidades/hub/hub-biomecanico
 *
 * Layout:
 * - Header: título, descrição, ícone do HUB
 * - Breadcrumb navegável
 * - Grid responsivo (2 colunas desktop, 1 mobile)
 * - ArenaCards com links para arenas individuais
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface HubData {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  arenaType: string;
  categoria: string;
}

interface ArenaChild {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  totalPosts: number;
  requiresFP: number | null;
  status: string;
  arenaType: string;
}

interface HubResponse {
  success: boolean;
  hub?: HubData;
  children?: ArenaChild[];
  error?: string;
}

const ICON_MAP: Record<string, string> = {
  Activity: '🦴',
  Video: '🎥',
  Zap: '⚡',
  Home: '🏠',
  Heart: '❤️',
  Brain: '🧠',
  Users: '👥',
  Sparkles: '✨',
  Camera: '📸',
  Utensils: '🍽️',
  Syringe: '💉',
  TrendingDown: '📉',
  Dumbbell: '🏋️',
};

function getIconEmoji(icon: string): string {
  return ICON_MAP[icon] || '📌';
}

function ArenaCard({ arena }: { arena: ArenaChild }) {
  const isPremium = (arena.requiresFP ?? 0) > 0;

  return (
    <Link href={`/comunidades/${arena.slug}`}>
      <div
        className="group relative h-full overflow-hidden rounded-2xl p-6 cursor-pointer transition-all duration-300 border border-white/10 hover:border-white/30"
        style={{
          background: `linear-gradient(135deg, rgba(26, 31, 58, 0.6) 0%, rgba(10, 14, 39, 0.8) 100%)`,
        }}
      >
        {/* Glow de fundo no hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${arena.color}40 0%, transparent 100%)`,
          }}
        />

        {/* Conteúdo */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header com ícone */}
          <div className="flex items-start gap-3 mb-4">
            <div
              className="p-3 rounded-xl text-2xl group-hover:scale-110 transition-transform duration-300 flex items-center justify-center w-12 h-12"
              style={{
                background: `${arena.color}20`,
                color: arena.color,
              }}
            >
              {getIconEmoji(arena.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white mb-1 group-hover:opacity-80 transition-opacity line-clamp-2">
                {arena.name}
              </h3>
            </div>
          </div>

          {/* Descrição */}
          <p className="text-sm text-gray-400 leading-relaxed mb-4 flex-grow line-clamp-3">
            {arena.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">
                {arena.totalPosts} posts
              </span>
              <span className="text-[10px] text-gray-600">•</span>
              <span className="text-[10px] text-emerald-400 font-medium">
                🤖 IA
              </span>
            </div>
            {isPremium && (
              <span
                className="text-[10px] font-bold px-2 py-1 rounded-full border"
                style={{
                  background: `${arena.color}15`,
                  borderColor: `${arena.color}40`,
                  color: arena.color,
                }}
              >
                PREMIUM
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="h-full overflow-hidden rounded-2xl p-6 bg-zinc-900/50 animate-pulse">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-zinc-800" />
        <div className="flex-1">
          <div className="h-5 bg-zinc-800 rounded w-3/4 mb-2" />
          <div className="h-4 bg-zinc-800 rounded w-1/2" />
        </div>
      </div>
      <div className="h-4 bg-zinc-800 rounded w-full mb-2" />
      <div className="h-4 bg-zinc-800 rounded w-2/3 mb-4" />
      <div className="h-4 bg-zinc-800 rounded w-1/3" />
    </div>
  );
}

export default function HubPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [data, setData] = useState<HubResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHub() {
      try {
        const res = await fetch(`/api/hubs/${slug}`);
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('Erro ao carregar HUB:', error);
        setData({ success: false, error: 'Erro ao carregar HUB' });
      } finally {
        setLoading(false);
      }
    }

    fetchHub();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen relative" style={{
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #1a0a27 100%)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
          <div className="animate-spin inline-flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-cyan-400" />
          </div>
          <p className="text-gray-400 mt-4">Carregando HUB...</p>
        </div>
      </div>
    );
  }

  if (!data?.success || !data.hub) {
    return (
      <div className="min-h-screen relative" style={{
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #1a0a27 100%)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
          <Link href="/comunidades" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Link>
          <div className="text-center">
            <p className="text-red-400 font-semibold">{data?.error || 'HUB não encontrado'}</p>
          </div>
        </div>
      </div>
    );
  }

  const hub = data.hub;
  const children = data.children || [];
  const hubIcon = getIconEmoji(hub.icon);

  return (
    <div className="min-h-screen relative" style={{
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #1a0a27 100%)'
    }}>
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 245, 255, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 245, 255, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full filter blur-[150px] opacity-10"
          style={{ background: `${hub.color}80` }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-gray-400">
          <Link href="/comunidades" className="hover:text-cyan-400 transition-colors">
            Comunidades
          </Link>
          <span>/</span>
          <span className="text-white font-semibold">{hub.name}</span>
        </div>

        {/* Botão Voltar */}
        <Link
          href="/comunidades"
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-400 hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-start gap-6 mb-6">
            <div
              className="p-4 rounded-2xl text-5xl"
              style={{
                background: `${hub.color}20`,
                color: hub.color,
              }}
            >
              {hubIcon}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                {hub.name}
              </h1>
              <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
                {hub.description}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="px-4 py-2 bg-zinc-800/50 rounded-lg border border-white/10">
              <span className="text-white font-semibold">{children.length}</span>
              <span className="text-gray-400 ml-2">arenas</span>
            </div>
            <div className="px-4 py-2 bg-zinc-800/50 rounded-lg border border-white/10">
              <span className="text-white font-semibold">
                {children.reduce((sum, a) => sum + a.totalPosts, 0)}
              </span>
              <span className="text-gray-400 ml-2">posts</span>
            </div>
          </div>
        </div>

        {/* Grid de Arenas */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : children.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((arena) => (
              <ArenaCard key={arena.id} arena={arena} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              Nenhuma arena encontrada neste HUB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
