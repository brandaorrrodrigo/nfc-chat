'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, Flame, MessageSquare, Users, Clock, ChevronRight, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TrendingTopic {
  id: string;
  title: string;
  slug: string;
  communitySlug: string;
  communityTitle: string;
  responseCount: number;
  viewCount: number;
  engagementScore: number;
  lastActivityAt: string;
  isHot: boolean;
  author?: {
    name: string;
    isFounder?: boolean;
  };
}

interface TrendingTopicsProps {
  communitySlug?: string; // Se definido, mostra apenas dessa comunidade
  limit?: number;
  variant?: 'sidebar' | 'full' | 'compact';
  showHeader?: boolean;
}

// Dados mock para demonstração (MVP)
const MOCK_TRENDING: TrendingTopic[] = [
  {
    id: '1',
    title: 'Melhor estratégia para déficit nos finais de semana',
    slug: 'estrategia-deficit-fim-semana',
    communitySlug: 'deficit-calorico',
    communityTitle: 'Déficit Calórico',
    responseCount: 47,
    viewCount: 892,
    engagementScore: 95,
    lastActivityAt: '2026-02-03T12:55:00.000Z',
    isHot: true,
    author: { name: 'Dra. Helena', isFounder: true }
  },
  {
    id: '2',
    title: 'Hip thrust: barra vs anilha - qual vocês preferem?',
    slug: 'hip-thrust-barra-anilha',
    communitySlug: 'treino-gluteo',
    communityTitle: 'Treino de Glúteo',
    responseCount: 38,
    viewCount: 654,
    engagementScore: 88,
    lastActivityAt: '2026-02-03T12:48:00.000Z',
    isHot: true,
    author: { name: 'Fernanda Lima' }
  },
  {
    id: '3',
    title: 'Ozempic 0.5mg para 1mg - relatos de transição',
    slug: 'ozempic-transicao-dose',
    communitySlug: 'canetas',
    communityTitle: 'Canetas Emagrecedoras',
    responseCount: 31,
    viewCount: 523,
    engagementScore: 82,
    lastActivityAt: '2026-02-03T12:35:00.000Z',
    isHot: true,
    author: { name: 'Dr. Ricardo', isFounder: true }
  },
  {
    id: '4',
    title: 'Dieta anti-inflamatória: resultados após 3 semanas',
    slug: 'dieta-anti-inflamatoria-resultados',
    communitySlug: 'lipedema',
    communityTitle: 'Protocolo Lipedema',
    responseCount: 28,
    viewCount: 412,
    engagementScore: 78,
    lastActivityAt: '2026-02-03T12:15:00.000Z',
    isHot: false,
    author: { name: 'Maria Silva' }
  },
  {
    id: '5',
    title: 'Treino em casa só com peso corporal - funciona?',
    slug: 'treino-casa-peso-corporal',
    communitySlug: 'treino-casa',
    communityTitle: 'Treino em Casa',
    responseCount: 24,
    viewCount: 387,
    engagementScore: 72,
    lastActivityAt: '2026-02-03T12:00:00.000Z',
    isHot: false,
    author: { name: 'Coach Bret', isFounder: true }
  },
  {
    id: '6',
    title: 'Ansiedade noturna e compulsão - como vocês lidam?',
    slug: 'ansiedade-noturna-compulsao',
    communitySlug: 'ansiedade-alimentacao',
    communityTitle: 'Ansiedade e Alimentação',
    responseCount: 42,
    viewCount: 678,
    engagementScore: 85,
    lastActivityAt: '2026-02-03T12:30:00.000Z',
    isHot: true,
    author: { name: 'Dra. Lucia', isFounder: true }
  },
];

/**
 * TrendingTopics - Exibe os tópicos mais populares
 *
 * Features:
 * - Score de engajamento (respostas + views)
 * - Indicador "HOT" para tópicos muito ativos
 * - Link direto para o tópico
 * - Filtro por comunidade
 */
export default function TrendingTopics({
  communitySlug,
  limit = 5,
  variant = 'sidebar',
  showHeader = true
}: TrendingTopicsProps) {
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // MVP: Usar dados mock
    // Em produção: fetch de /api/comunidades/trending
    const filtered = communitySlug
      ? MOCK_TRENDING.filter(t => t.communitySlug === communitySlug)
      : MOCK_TRENDING;

    setTopics(filtered.slice(0, limit));
    setLoading(false);
  }, [communitySlug, limit]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-zinc-800/50 rounded-lg" />
        ))}
      </div>
    );
  }

  if (topics.length === 0) {
    return null;
  }

  // Variante compacta (para usar em cards)
  if (variant === 'compact') {
    return (
      <div className="space-y-2">
        {topics.slice(0, 3).map((topic, index) => (
          <Link
            key={topic.id}
            href={`/comunidades/${topic.communitySlug}`}
            className="flex items-center gap-2 text-sm hover:text-[#00ff88] transition-colors group"
          >
            <span className="text-zinc-600 font-mono text-xs w-4">{index + 1}.</span>
            <span className="truncate text-zinc-300 group-hover:text-[#00ff88]">
              {topic.title}
            </span>
            {topic.isHot && <Flame className="w-3 h-3 text-orange-400 flex-shrink-0" />}
          </Link>
        ))}
      </div>
    );
  }

  // Variante sidebar (padrão)
  if (variant === 'sidebar') {
    return (
      <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl overflow-hidden">
        {/* Header */}
        {showHeader && (
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#00ff88]" />
            <span className="text-sm font-semibold text-white">Trending</span>
            <div className="ml-auto flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-400 animate-pulse" />
              <span className="text-[10px] text-orange-400 font-mono">LIVE</span>
            </div>
          </div>
        )}

        {/* Lista */}
        <div className="divide-y divide-zinc-800/50">
          {topics.map((topic, index) => (
            <Link
              key={topic.id}
              href={`/comunidades/${topic.communitySlug}`}
              className="block px-4 py-3 hover:bg-zinc-800/30 transition-colors group"
            >
              <div className="flex items-start gap-3">
                {/* Ranking */}
                <div className={`
                  flex-shrink-0 w-6 h-6 rounded-lg
                  flex items-center justify-center
                  text-xs font-bold
                  ${index < 3
                    ? 'bg-[#00ff88]/20 text-[#00ff88]'
                    : 'bg-zinc-800 text-zinc-500'
                  }
                `}>
                  {index + 1}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <p className="text-sm text-zinc-200 group-hover:text-[#00ff88] transition-colors line-clamp-2">
                      {topic.title}
                    </p>
                    {topic.isHot && (
                      <Flame className="w-3.5 h-3.5 text-orange-400 flex-shrink-0 animate-pulse" />
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-zinc-500">
                    <span className="text-[#00ff88]/70">{topic.communityTitle}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{topic.responseCount}</span>
                    </div>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(topic.lastActivityAt), {
                        locale: ptBR,
                        addSuffix: false
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-900/50">
          <button className="w-full flex items-center justify-center gap-1 text-xs text-zinc-500 hover:text-[#00ff88] transition-colors">
            <span>Ver todos os trending</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  // Variante full (para página dedicada)
  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <TrendingUp className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Trending Topics</h2>
            <p className="text-sm text-zinc-500">Os assuntos mais quentes agora</p>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {topics.map((topic, index) => (
          <Link
            key={topic.id}
            href={`/comunidades/${topic.communitySlug}`}
            className={`
              block p-4 rounded-xl
              bg-zinc-900/50 border border-zinc-800
              hover:border-[#00ff88]/50 hover:shadow-[0_0_20px_rgba(0,255,136,0.1)]
              transition-all group
              ${index === 0 ? 'sm:col-span-2 bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/30' : ''}
            `}
          >
            <div className="flex items-start gap-4">
              {/* Ranking Badge */}
              <div className={`
                flex-shrink-0 w-10 h-10 rounded-xl
                flex items-center justify-center
                text-lg font-black
                ${index === 0
                  ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-[0_0_20px_rgba(251,146,60,0.4)]'
                  : index < 3
                    ? 'bg-[#00ff88]/20 text-[#00ff88]'
                    : 'bg-zinc-800 text-zinc-400'
                }
              `}>
                {index === 0 ? <Flame className="w-5 h-5" /> : index + 1}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start gap-2 mb-2">
                  <h3 className={`
                    font-semibold group-hover:text-[#00ff88] transition-colors
                    ${index === 0 ? 'text-lg text-white' : 'text-sm text-zinc-200'}
                  `}>
                    {topic.title}
                  </h3>
                  {topic.isHot && index !== 0 && (
                    <Flame className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  )}
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <span className="text-[#00ff88]">{topic.communityTitle}</span>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>{topic.responseCount} respostas</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {formatDistanceToNow(new Date(topic.lastActivityAt), {
                        locale: ptBR,
                        addSuffix: true
                      })}
                    </span>
                  </div>
                </div>

                {/* Author */}
                {topic.author && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-zinc-500">Iniciado por</span>
                    <span className="text-xs text-zinc-300">{topic.author.name}</span>
                    {topic.author.isFounder && (
                      <span className="px-1.5 py-0.5 text-[9px] bg-yellow-500/20 text-yellow-400 rounded font-bold">
                        FOUNDER
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Engagement Score */}
              <div className="flex-shrink-0 text-right">
                <div className="text-lg font-bold text-[#00ff88]">{topic.engagementScore}</div>
                <div className="text-[10px] text-zinc-500">score</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
