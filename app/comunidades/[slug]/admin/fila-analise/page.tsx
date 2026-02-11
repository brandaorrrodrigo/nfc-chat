'use client';

/**
 * Pagina da Fila de Revisao Admin para Analises de Video
 * Acessivel em /comunidades/[slug]/admin/fila-analise
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Filter, RefreshCw, Inbox } from 'lucide-react';
import AnalysisQueueItem from '@/components/nfv/AnalysisQueueItem';
import AnalysisReviewPanel from '@/components/nfv/AnalysisReviewPanel';

type QueueStatus = 'AI_ANALYZED' | 'PENDING_REVIEW' | 'REVISION_NEEDED' | 'all';

interface QueueAnalysis {
  id: string;
  user_name: string;
  movement_pattern: string;
  user_description?: string;
  status: string;
  created_at: string;
  arena_slug: string;
}

export default function FilaAnalisePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  // Mock admin
  const reviewerId = 'admin_001';

  const [queue, setQueue] = useState<QueueAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<QueueStatus>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchQueue = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('arenaSlug', slug);
      if (statusFilter !== 'all') {
        params.set('status', statusFilter);
      } else {
        // Buscar todos os status pendentes de revisao
        params.set('status', 'AI_ANALYZED');
      }
      params.set('limit', '50');

      const res = await fetch(`/api/nfv/videos?${params}`);
      const data = await res.json();

      if (statusFilter === 'all') {
        // Buscar tambem PENDING_REVIEW e REVISION_NEEDED
        const [pr, rn] = await Promise.all([
          fetch(`/api/nfv/videos?arenaSlug=${slug}&status=PENDING_REVIEW&limit=50`).then(r => r.json()),
          fetch(`/api/nfv/videos?arenaSlug=${slug}&status=REVISION_NEEDED&limit=50`).then(r => r.json()),
        ]);

        setQueue([
          ...(data.videos || []),
          ...(pr.videos || []),
          ...(rn.videos || []),
        ].sort((a: QueueAnalysis, b: QueueAnalysis) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()));
      } else {
        setQueue(data.videos || []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [slug, statusFilter]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  const handleReviewComplete = () => {
    setSelectedId(null);
    fetchQueue();
  };

  // Se tem analise selecionada, mostra painel de revisao
  if (selectedId) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <AnalysisReviewPanel
            analysisId={selectedId}
            reviewerId={reviewerId}
            onBack={() => setSelectedId(null)}
            onReviewComplete={handleReviewComplete}
          />
        </div>
      </div>
    );
  }

  const statusFilters: { value: QueueStatus; label: string }[] = [
    { value: 'all', label: 'Todos Pendentes' },
    { value: 'AI_ANALYZED', label: 'IA Concluiu' },
    { value: 'PENDING_REVIEW', label: 'Pendente Revisao' },
    { value: 'REVISION_NEEDED', label: 'Revisao Necessaria' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-semibold text-white">Fila de Analise</h1>
            <p className="text-xs text-zinc-500">{queue.length} analises pendentes</p>
          </div>
          <button
            onClick={fetchQueue}
            disabled={loading}
            className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
          {statusFilters.map(f => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
                statusFilter === f.value
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
          </div>
        )}

        {/* Empty */}
        {!loading && queue.length === 0 && (
          <div className="text-center py-12">
            <Inbox className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-sm text-zinc-400">Nenhuma analise pendente</p>
            <p className="text-xs text-zinc-600 mt-1">Todas as analises foram revisadas!</p>
          </div>
        )}

        {/* Queue */}
        {!loading && queue.length > 0 && (
          <div className="space-y-3">
            {queue.map(analysis => (
              <AnalysisQueueItem
                key={analysis.id}
                analysis={analysis}
                onSelect={setSelectedId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
