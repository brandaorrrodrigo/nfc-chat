'use client';

/**
 * Pagina de Analise Individual de Video
 * Acessivel em /comunidades/[slug]/videos/[videoId]
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Eye, Clock, User, Loader2, AlertTriangle, RefreshCw, Trash2, Share2, X } from 'lucide-react';
import VideoPlayer from '@/components/nfv/VideoPlayer';
import MovementPatternBadge from '@/components/nfv/MovementPatternBadge';
import ShareModal from '@/components/nfv/ShareModal';
import BiomechanicsAnalysisView from '@/components/biomechanics/BiomechanicsAnalysisView';

/** Arredonda valores numéricos para evitar floating point noise */
interface AnalysisDetail {
  id: string;
  video_url: string;
  thumbnail_url?: string;
  movement_pattern: string;
  user_name: string;
  user_description?: string;
  status: string;
  ai_analysis?: Record<string, unknown>;
  published_analysis?: Record<string, unknown>;
  published_at?: string;
  view_count: number;
  helpful_votes: number;
  created_at: string;
}

export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = (params?.videoId ?? "") as string;

  const [analysis, setAnalysis] = useState<AnalysisDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voted, setVoted] = useState<string | null>(null);
  const [voting, setVoting] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [pendingLocal, setPendingLocal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [correctivePlan, setCorrectivePlan] = useState<Record<string, unknown> | null>(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);

  // Mock userId
  const userId = 'user_mock_001';

  const fetchAnalysis = useCallback(async () => {
    try {
      const res = await fetch(`/api/nfv/videos/${videoId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar analise');
    } finally {
      setLoading(false);
    }
  }, [videoId]);

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  // Polling: re-fetch a cada 10s quando status e PENDING_AI ou PROCESSING
  // Para quando pendingLocal=true (servidor local indisponível — status não vai mudar)
  useEffect(() => {
    if (!analysis) return;
    const shouldPoll = !pendingLocal && ['PENDING_AI', 'PROCESSING'].includes(analysis.status);
    if (!shouldPoll) return;

    const intervalId = setInterval(() => {
      fetchAnalysis();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [analysis?.status, fetchAnalysis, pendingLocal]);

  // Auto-retry removido: causava loop infinito de re-renders ao chamar setPendingLocal(true)
  // dentro de um setTimeout callback. O vídeo fica com status PENDING_AI no banco e o
  // servidor local o processa quando voltar online. O polling de 10s detecta quando completa.

  const handleRetryAnalysis = async () => {
    setRetrying(true);
    try {
      const res = await fetch('/api/nfv/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisId: videoId }),
      });
      if (res.status === 503) {
        setPendingLocal(true); // Vercel: sem servidor local disponível
      } else {
        setPendingLocal(false);
        await fetchAnalysis();
      }
    } catch {
      // polling vai pegar as mudancas
    } finally {
      setRetrying(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/nfv/videos/${videoId}`, { method: 'DELETE' });
      if (res.ok) {
        router.back();
        return;
      }
    } catch {
      // silently fail
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleGeneratePlan = async () => {
    setPlanLoading(true);
    setPlanError(null);
    try {
      const res = await fetch('/api/nfv/corrective-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisId: videoId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao gerar plano');
      if (data.plan) {
        setCorrectivePlan(data.plan);
      }
    } catch (err) {
      setPlanError(err instanceof Error ? err.message : 'Erro ao gerar plano corretivo');
    } finally {
      setPlanLoading(false);
    }
  };

  const handleVote = async (voteType: 'helpful' | 'not_helpful') => {
    if (voting || voted) return;
    setVoting(true);
    try {
      const res = await fetch('/api/nfv/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisId: videoId, userId, voteType }),
      });
      if (res.ok) {
        setVoted(voteType);
        if (analysis && voteType === 'helpful') {
          setAnalysis({ ...analysis, helpful_votes: analysis.helpful_votes + 1 });
        }
      }
    } catch {
      // silently fail
    } finally {
      setVoting(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-sm text-red-400 mb-4">{error || 'Analise nao encontrada'}</p>
          <button
            onClick={() => router.back()}
            className="text-sm text-purple-400 hover:text-purple-300"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  // Parse ai_analysis se for string (Supabase às vezes retorna JSONB como string)
  let parsedAiAnalysis = analysis.ai_analysis;
  if (typeof parsedAiAnalysis === 'string') {
    try {
      parsedAiAnalysis = JSON.parse(parsedAiAnalysis);
    } catch {
      parsedAiAnalysis = undefined;
    }
  }

  // Extrair plano corretivo se ja existir nos dados da analise
  const existingPlan = (analysis.published_analysis as any)?.corrective_plan
    || (parsedAiAnalysis as any)?.corrective_plan
    || null;
  const displayPlan = correctivePlan || existingPlan;

  const displayAnalysis = analysis.published_analysis || parsedAiAnalysis;

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
            <h1 className="text-sm font-semibold text-white">Analise Biomecanica</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <MovementPatternBadge pattern={analysis.movement_pattern} size="sm" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            {displayAnalysis && (
              <button
                onClick={() => setShowShareModal(true)}
                className="p-2 rounded-lg text-zinc-400 hover:text-purple-400 hover:bg-zinc-800 transition-colors"
                title="Compartilhar"
              >
                <Share2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
              title="Excluir"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Video */}
        <VideoPlayer
          src={analysis.video_url}
          thumbnailUrl={analysis.thumbnail_url}
          className="max-h-96"
        />

        {/* Action Bar */}
        <div className="flex items-center gap-3">
          {displayAnalysis && (
            <button
              onClick={() => setShowShareModal(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/20 border border-purple-600/30 text-purple-300 text-sm font-medium hover:bg-purple-600/30 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Compartilhar
            </button>
          )}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600/10 border border-red-600/20 text-red-400 text-sm font-medium hover:bg-red-600/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Excluir
          </button>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-sm text-zinc-300">{analysis.user_name}</span>
            </div>
            <span className="text-zinc-700">•</span>
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(analysis.published_at || analysis.created_at)}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {analysis.view_count} views
            </span>
          </div>
        </div>

        {/* User Description */}
        {analysis.user_description && (
          <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
            <p className="text-xs text-zinc-500 mb-1">Descricao do usuario:</p>
            <p className="text-sm text-zinc-300">{analysis.user_description}</p>
          </div>
        )}

        {/* Analysis Content */}
        {analysis.status === 'PENDING_AI' || analysis.status === 'PROCESSING' ? (
          <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 text-center">
            {pendingLocal ? (
              <>
                <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <p className="text-sm text-zinc-300 font-medium">Aguardando servidor local</p>
                <p className="text-xs text-zinc-500 mt-1">
                  O video foi salvo. A analise sera processada quando o servidor local estiver ativo.
                </p>
              </>
            ) : (
              <>
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-3" />
                <p className="text-sm text-zinc-300 font-medium">
                  {analysis.status === 'PROCESSING' ? 'Analisando video...' : 'Na fila de analise...'}
                </p>
                <p className="text-xs text-zinc-500 mt-1">Atualizando automaticamente</p>
              </>
            )}
          </div>
        ) : analysis.status === 'ERROR' ? (
          <div className="bg-zinc-900 rounded-xl p-5 border border-red-800/50">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <p className="text-sm text-red-400 font-medium">Erro na analise</p>
            </div>
            <p className="text-xs text-zinc-400 mb-4">
              {(parsedAiAnalysis as any)?.error || 'Ocorreu um erro durante a analise do video.'}
            </p>
            <button
              onClick={handleRetryAnalysis}
              disabled={retrying}
              className="px-4 py-2 rounded-lg bg-purple-600/20 border border-purple-600/30 text-purple-300 text-sm hover:bg-purple-600/30 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {retrying ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {pendingLocal ? 'Verificar novamente' : 'Tentar novamente'}
            </button>
          </div>
        ) : displayAnalysis ? (
          <BiomechanicsAnalysisView
            data={displayAnalysis}
            plan={displayPlan}
            onGeneratePlan={handleGeneratePlan}
            planLoading={planLoading}
            planError={planError}
            helpfulVotes={analysis.helpful_votes}
            onVote={handleVote}
            voted={voted}
            voting={voting}
          />
        ) : null}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !deleting && setShowDeleteConfirm(false)} />
          <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl max-w-sm w-full p-6">
            <button
              onClick={() => !deleting && setShowDeleteConfirm(false)}
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
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm hover:bg-zinc-700 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
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

      {/* Share Modal */}
      {showShareModal && analysis && displayAnalysis && (
        <ShareModal
          analysis={analysis}
          displayAnalysis={displayAnalysis}
          open={showShareModal}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
