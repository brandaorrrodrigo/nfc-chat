'use client';

/**
 * VideoGallery - Grid de analises publicadas com filtros
 */

import React, { useEffect, useState } from 'react';
import { Search, Filter, Loader2, AlertTriangle, X } from 'lucide-react';
import { NFV_CONFIG } from '@/lib/biomechanics/nfv-config';
import { useVideoAnalysis } from '@/hooks/useVideoAnalysis';
import VideoAnalysisCard from './VideoAnalysisCard';

interface VideoGalleryProps {
  arenaSlug?: string;
  onSelectAnalysis?: (id: string) => void;
}

export default function VideoGallery({ arenaSlug, onSelectAnalysis }: VideoGalleryProps) {
  const [selectedPattern, setSelectedPattern] = useState<string | undefined>();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { analyses, loading, error, hasMore, fetchAnalyses, loadMore, deleteAnalysis } = useVideoAnalysis({
    arenaSlug,
    status: undefined,
    pattern: selectedPattern,
    limit: 12,
  });

  useEffect(() => {
    fetchAnalyses(0);
  }, [fetchAnalyses]);

  // Auto-retry: quando galeria carrega, detecta videos stuck e re-trigga analise
  useEffect(() => {
    if (analyses.length === 0) return;
    const stuckVideos = analyses.filter(a =>
      ['PENDING_AI', 'ERROR'].includes(a.status)
    );
    if (stuckVideos.length === 0) return;

    console.log(`[NFV Gallery] Found ${stuckVideos.length} stuck videos, triggering auto-retry...`);
    stuckVideos.forEach(video => {
      fetch('/api/nfv/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisId: video.id }),
      }).then(res => {
        if (res.status === 503) {
          console.log(`[NFV Gallery] Servidor local indisponivel para ${video.id} — mantendo PENDING`);
        }
      }).catch(() => {/* background retry */});
    });

    // Re-fetch apos 15s para pegar resultados
    const refreshTimer = setTimeout(() => {
      fetchAnalyses(0);
    }, 15000);

    return () => clearTimeout(refreshTimer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analyses.length]); // Roda quando lista carrega

  const patterns = arenaSlug
    ? NFV_CONFIG.PREMIUM_ARENAS.filter(a => a.slug === arenaSlug).map(a => a.pattern)
    : NFV_CONFIG.PREMIUM_ARENAS.map(a => a.pattern);

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    await deleteAnalysis(deleteTargetId);
    setDeleting(false);
    setDeleteTargetId(null);
  };

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
              onDelete={(id) => setDeleteTargetId(id)}
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

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !deleting && setDeleteTargetId(null)} />
          <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl max-w-sm w-full p-6">
            <button
              onClick={() => !deleting && setDeleteTargetId(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">Excluir video</h3>
            </div>

            <p className="text-sm text-zinc-400 mb-6">
              Tem certeza que deseja excluir este video? Esta acao nao pode ser desfeita.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteTargetId(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm hover:bg-zinc-700 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600/20 border border-red-600/30 text-red-300 text-sm hover:bg-red-600/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
