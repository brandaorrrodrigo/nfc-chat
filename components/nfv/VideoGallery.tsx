'use client';

/**
 * VideoGallery - Grid de analises publicadas com filtros
 */

import React, { useEffect, useState } from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
import { NFV_CONFIG } from '@/lib/biomechanics/nfv-config';
import { useVideoAnalysis } from '@/hooks/useVideoAnalysis';
import VideoAnalysisCard from './VideoAnalysisCard';

interface VideoGalleryProps {
  arenaSlug?: string;
  onSelectAnalysis?: (id: string) => void;
}

export default function VideoGallery({ arenaSlug, onSelectAnalysis }: VideoGalleryProps) {
  const [selectedPattern, setSelectedPattern] = useState<string | undefined>();

  const { analyses, loading, error, hasMore, fetchAnalyses, loadMore } = useVideoAnalysis({
    arenaSlug,
    // Mostrar todos: pendentes, analisados e aprovados
    status: undefined,
    pattern: selectedPattern,
    limit: 12,
  });

  useEffect(() => {
    fetchAnalyses(0);
  }, [fetchAnalyses]);

  const patterns = arenaSlug
    ? NFV_CONFIG.PREMIUM_ARENAS.filter(a => a.slug === arenaSlug).map(a => a.pattern)
    : NFV_CONFIG.PREMIUM_ARENAS.map(a => a.pattern);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex items-center gap-1 text-zinc-500">
          <Filter className="w-3.5 h-3.5" />
          <span className="text-xs">Filtrar:</span>
        </div>

        <button
          onClick={() => {
            setSelectedPattern(undefined);
          }}
          className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
            !selectedPattern
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600'
          }`}
        >
          Todos
        </button>

        {patterns.map(pattern => (
          <button
            key={pattern}
            onClick={() => setSelectedPattern(pattern)}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
              selectedPattern === pattern
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600'
            }`}
          >
            {pattern.charAt(0).toUpperCase() + pattern.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && analyses.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-8">
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={() => fetchAnalyses(0)}
            className="mt-2 text-xs text-purple-400 hover:text-purple-300"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && analyses.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
          <p className="text-sm text-zinc-400">Nenhuma analise publicada ainda.</p>
          <p className="text-xs text-zinc-600 mt-1">
            Seja o primeiro a enviar um video para analise!
          </p>
        </div>
      )}

      {/* Grid */}
      {analyses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyses.map(analysis => (
            <VideoAnalysisCard
              key={analysis.id}
              analysis={analysis}
              onClick={() => onSelectAnalysis?.(analysis.id)}
            />
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && analyses.length > 0 && (
        <div className="flex justify-center pt-4">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2 rounded-xl bg-zinc-800 text-zinc-400 text-sm hover:bg-zinc-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Carregando...
              </>
            ) : (
              'Carregar mais'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
