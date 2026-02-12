/**
 * Widget de Análise Biomecânica para Comunidades
 * Mostra vídeos analisados de uma comunidade específica
 */

'use client';

import { useState, useEffect } from 'react';
import { Zap, Video, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface VideoAnalysis {
  id: string;
  user_name: string;
  movement_pattern: string;
  created_at: string;
  status: string;
  overall_score?: number;
}

interface Props {
  communitySlug: string;
  limit?: number;
}

export default function CommunityBiomechanicsWidget({ communitySlug, limit = 5 }: Props) {
  const [videos, setVideos] = useState<VideoAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCommunityVideos();
  }, [communitySlug]);

  const fetchCommunityVideos = async () => {
    try {
      setLoading(true);
      // Fetch all analyzed videos and filter by community
      const response = await fetch(`/api/biomechanics/list-videos?community=${communitySlug}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `API error: ${response.status}`);
      }

      // For now, show all videos (will be filtered by community on backend)
      setVideos(data.videos?.slice(0, limit) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar análises');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-500';
    if (score >= 6) return 'text-yellow-500';
    if (score >= 4) return 'text-orange-500';
    return 'text-red-500';
  };

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Análises Biomecânicas</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-slate-400">Carregando análises...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-800 rounded-lg border border-red-700/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-bold text-white">Análises Biomecânicas</h3>
        </div>
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Análises Biomecânicas</h3>
        </div>
        <div className="text-center py-8">
          <Video className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">Nenhuma análise realizada ainda</p>
          <p className="text-slate-500 text-sm mt-2">Envie um vídeo para começar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Análises Biomecânicas</h3>
        </div>
        <Link
          href={`/biomechanics/videos`}
          className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold"
        >
          Ver todas →
        </Link>
      </div>

      {/* Videos List */}
      <div className="space-y-4">
        {videos.map((video, idx) => (
          <Link
            key={video.id}
            href={`/biomechanics/dashboard?videoId=${video.id}`}
            className="group block"
          >
            <div className="bg-slate-700/50 hover:bg-slate-700 rounded-lg p-4 transition border border-slate-600/30 hover:border-cyan-500/30">
              {/* Row content */}
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-semibold text-slate-400 bg-slate-600 px-2 py-1 rounded">
                      #{idx + 1}
                    </span>
                    <p className="text-white font-semibold capitalize truncate">
                      {video.movement_pattern || 'Exercício'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>{video.user_name || 'Anônimo'}</span>
                    <span>•</span>
                    <span>{new Date(video.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                {/* Score Badge */}
                {video.overall_score !== undefined && (
                  <div className={`ml-4 text-right ${getScoreColor(video.overall_score)}`}>
                    <p className="text-2xl font-bold">{video.overall_score.toFixed(1)}</p>
                    <p className="text-xs text-slate-400">/10</p>
                  </div>
                )}
              </div>

              {/* Status indicator */}
              <div className="mt-3 flex items-center gap-2 text-xs">
                {video.status === 'BIOMECHANICS_ANALYZED_V2' ? (
                  <>
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-green-400">Analisado</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    <span className="text-yellow-400">Processando</span>
                  </>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer Link */}
      <div className="mt-6 pt-4 border-t border-slate-600/30">
        <Link
          href={`/biomechanics/videos`}
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold text-sm"
        >
          <TrendingUp className="w-4 h-4" />
          Ver todas as análises
        </Link>
      </div>
    </div>
  );
}
