/**
 * Página de vídeos analisados
 * Lista todos os vídeos com análise biomecânica
 */

'use client';

import { useState, useEffect } from 'react';
import { Video, Calendar, User, Zap, TrendingUp, Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface VideoRecord {
  id: string;
  user_name: string;
  movement_pattern: string;
  created_at: string;
  status: string;
  overall_score?: number;
  exercise_type?: string;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/biomechanics/list-videos');

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      setVideos(data.videos || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar vídeos');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 6) return 'bg-yellow-100 text-yellow-800';
    if (score >= 4) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/nfv/videos/${deleteTargetId}`, { method: 'DELETE' });
      if (res.ok) {
        setVideos(prev => prev.filter(v => v.id !== deleteTargetId));
      }
    } catch {
      // silently fail
    } finally {
      setDeleting(false);
      setDeleteTargetId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'BIOMECHANICS_ANALYZED_V2':
        return <span className="px-3 py-1 bg-green-900/30 text-green-300 text-xs font-semibold rounded">Analisado</span>;
      case 'PENDING':
        return <span className="px-3 py-1 bg-yellow-900/30 text-yellow-300 text-xs font-semibold rounded">Pendente</span>;
      default:
        return <span className="px-3 py-1 bg-slate-700 text-slate-300 text-xs font-semibold rounded">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Video className="w-8 h-8 text-cyan-400" />
            Vídeos Analisados
          </h1>
          <p className="text-slate-400">Histórico de análises biomecânicas</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block">
              <Zap className="w-12 h-12 text-cyan-400 animate-spin" />
            </div>
            <p className="text-slate-400 mt-4">Carregando vídeos...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-6 text-red-200">
            <p className="font-semibold">Erro: {error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && (videos?.length ?? 0) === 0 && (
          <div className="text-center py-12">
            <Video className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">Nenhum vídeo analisado ainda</p>
          </div>
        )}

        {/* Videos Grid */}
        {!loading && !error && (videos?.length ?? 0) > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="relative group">
                <Link
                  href={`/biomechanics/dashboard?videoId=${video.id}`}
                >
                  <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-cyan-500/50 transition">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white capitalize mb-2">
                          {video.movement_pattern || video.exercise_type || 'Exercício'}
                        </h3>
                        <p className="text-slate-400 text-sm flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {video.user_name || 'Anônimo'}
                        </p>
                      </div>
                      {video.overall_score !== undefined && (
                        <div className={`px-4 py-2 rounded font-bold text-lg ${getScoreColor(video.overall_score)}`}>
                          {video.overall_score.toFixed(1)}/10
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="space-y-3 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar className="w-4 h-4" />
                        {new Date(video.created_at).toLocaleString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(video.status)}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center gap-2">
                      <span className="flex-1 px-4 py-2 bg-cyan-600/20 text-cyan-400 font-semibold rounded border border-cyan-600/30 text-center text-sm">
                        Ver Análise Completa
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Delete Button */}
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeleteTargetId(video.id); }}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-red-600/10 border border-red-600/20 text-red-400 hover:bg-red-600/20 transition-colors"
                  title="Excluir video"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {!loading && !error && (videos?.length ?? 0) > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <p className="text-slate-400 text-sm font-semibold mb-2">TOTAL DE VÍDEOS</p>
              <p className="text-3xl font-bold text-cyan-400">{videos?.length ?? 0}</p>
            </div>
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <p className="text-slate-400 text-sm font-semibold mb-2">ANALISADOS</p>
              <p className="text-3xl font-bold text-green-400">
                {(videos?.filter(v => v.status === 'BIOMECHANICS_ANALYZED_V2')?.length ?? 0)}
              </p>
            </div>
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <p className="text-slate-400 text-sm font-semibold mb-2">SCORE MÉDIO</p>
              <p className="text-3xl font-bold text-yellow-400">
                {Math.round(
                  (videos?.filter(v => v.overall_score) || [])
                    .reduce((sum, v) => sum + (v.overall_score || 0), 0) /
                    ((videos?.filter(v => v.overall_score)?.length ?? 0) || 1)
                )}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !deleting && setDeleteTargetId(null)} />
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6">
            <button
              onClick={() => !deleting && setDeleteTargetId(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">Excluir video</h3>
            </div>

            <p className="text-sm text-slate-400 mb-2">
              Tem certeza que deseja excluir este video?
            </p>
            <p className="text-xs text-slate-500 mb-6">
              ID: {deleteTargetId}
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteTargetId(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600/20 border border-red-600/30 text-red-300 text-sm hover:bg-red-600/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
