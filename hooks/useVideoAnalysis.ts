'use client';

/**
 * Hook para gerenciar analises de video
 */

import { useState, useCallback } from 'react';

interface VideoAnalysis {
  id: string;
  arena_slug: string;
  user_id: string;
  user_name: string;
  video_url: string;
  thumbnail_url?: string;
  movement_pattern: string;
  user_description?: string;
  status: string;
  ai_analysis?: Record<string, unknown>;
  ai_confidence?: number;
  published_analysis?: Record<string, unknown>;
  published_at?: string;
  rejection_reason?: string;
  view_count: number;
  helpful_votes: number;
  created_at: string;
}

interface UseVideoAnalysisOptions {
  arenaSlug?: string;
  status?: string;
  pattern?: string;
  limit?: number;
}

export function useVideoAnalysis(options: UseVideoAnalysisOptions = {}) {
  const [analyses, setAnalyses] = useState<VideoAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchAnalyses = useCallback(async (offset = 0) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (options.arenaSlug) params.set('arenaSlug', options.arenaSlug);
      if (options.status) params.set('status', options.status);
      if (options.pattern) params.set('pattern', options.pattern);
      params.set('limit', String(options.limit || 20));
      params.set('offset', String(offset));

      const res = await fetch(`/api/nfv/videos?${params}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Erro ao buscar analises');

      const videos = data.videos || [];
      if (offset === 0) {
        setAnalyses(videos);
      } else {
        setAnalyses(prev => [...prev, ...videos]);
      }
      setHasMore(videos.length === (options.limit || 20));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [options.arenaSlug, options.status, options.pattern, options.limit]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchAnalyses(analyses.length);
    }
  }, [loading, hasMore, analyses.length, fetchAnalyses]);

  const vote = useCallback(async (analysisId: string, userId: string, voteType: 'helpful' | 'not_helpful') => {
    try {
      const res = await fetch('/api/nfv/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisId, userId, voteType }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao votar');
      }

      // Atualizar contagem local
      setAnalyses(prev => prev.map(a => {
        if (a.id === analysisId) {
          return {
            ...a,
            helpful_votes: voteType === 'helpful' ? a.helpful_votes + 1 : a.helpful_votes,
          };
        }
        return a;
      }));

      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    analyses,
    loading,
    error,
    hasMore,
    fetchAnalyses,
    loadMore,
    vote,
  };
}

/**
 * Hook para buscar uma analise individual
 */
export function useSingleAnalysis(analysisId: string) {
  const [analysis, setAnalysis] = useState<VideoAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = useCallback(async () => {
    if (!analysisId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/nfv/videos/${analysisId}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Erro ao buscar analise');

      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [analysisId]);

  return { analysis, loading, error, fetchAnalysis };
}
