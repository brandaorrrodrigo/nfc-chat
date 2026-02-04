'use client';

/**
 * Pagina de Analise Individual de Video
 * Acessivel em /comunidades/[slug]/videos/[videoId]
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ThumbsUp, ThumbsDown, Eye, Clock, User, Loader2, CheckCircle, Bot, Target, Play, Star } from 'lucide-react';
import VideoPlayer from '@/components/nfv/VideoPlayer';
import MovementPatternBadge from '@/components/nfv/MovementPatternBadge';

interface AnalysisDetail {
  id: string;
  video_url: string;
  thumbnail_url?: string;
  movement_pattern: string;
  user_name: string;
  user_description?: string;
  status: string;
  ai_analysis?: Record<string, unknown>;
  ai_confidence?: number;
  published_analysis?: Record<string, unknown>;
  published_at?: string;
  view_count: number;
  helpful_votes: number;
  created_at: string;
}

export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.videoId as string;

  const [analysis, setAnalysis] = useState<AnalysisDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voted, setVoted] = useState<string | null>(null);
  const [voting, setVoting] = useState(false);

  // Mock userId
  const userId = 'user_mock_001';

  const fetchAnalysis = useCallback(async () => {
    setLoading(true);
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

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return 'bg-green-500/20 border-green-500/30';
    if (score >= 6) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  const renderPublishedAnalysis = (data: Record<string, unknown>) => {
    // Verificar se é análise do Ollama Vision (tem overall_score)
    const isVisionAnalysis = 'overall_score' in data || 'frame_analyses' in data;

    if (isVisionAnalysis) {
      const score = (data.overall_score as number) || 0;
      const summary = data.summary as string;
      const recommendations = data.recommendations as string[] || [];
      const frameAnalyses = data.frame_analyses as Array<{
        frame: number;
        timestamp: string;
        analysis: string;
        score: number;
      }> || [];
      const model = data.model as string || 'IA';
      const framesAnalyzed = (data.frames_analyzed as number) || frameAnalyses.length;

      return (
        <div className="space-y-6">
          {/* Score Card */}
          <div className={`border rounded-xl p-5 ${getScoreBg(score)}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm text-zinc-400 mb-1">
                  <Bot className="w-4 h-4" />
                  Score da Analise
                </div>
                <div className={`text-5xl font-bold ${getScoreColor(score)}`}>
                  {score.toFixed(1)}
                  <span className="text-2xl text-zinc-500">/10</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-zinc-500">Modelo</div>
                <div className="text-sm text-zinc-400">{model}</div>
                <div className="text-xs text-zinc-500 mt-2">Frames</div>
                <div className="text-sm text-zinc-400">{framesAnalyzed}</div>
              </div>
            </div>

            {summary && (
              <p className="mt-4 text-sm text-zinc-300 border-t border-zinc-700/50 pt-4">
                {summary}
              </p>
            )}
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-white mb-3">
                <Target className="w-4 h-4 text-purple-400" />
                Recomendacoes
              </div>
              <ul className="space-y-2">
                {recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                    <Star className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Frame by Frame Analysis */}
          {frameAnalyses.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-white mb-4">
                <Play className="w-4 h-4 text-cyan-400" />
                Analise Frame a Frame
              </div>
              <div className="space-y-4">
                {frameAnalyses.map((frame, i) => (
                  <div key={i} className="border-l-2 border-zinc-700 pl-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-zinc-500">
                        Frame {frame.frame} ({frame.timestamp})
                      </span>
                      <span className={`text-sm font-semibold ${getScoreColor(frame.score)}`}>
                        {frame.score}/10
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400">
                      {frame.analysis}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Fallback: formato antigo
    const sections = [
      { key: 'key_observations', label: 'Observacoes Principais' },
      { key: 'suggestions', label: 'Sugestoes' },
      { key: 'requires_attention', label: 'Pontos de Atencao' },
    ];

    return (
      <div className="space-y-4">
        {sections.map(({ key, label }) => {
          const items = data[key];
          if (!Array.isArray(items) || items.length === 0) return null;
          return (
            <div key={key}>
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">{label}</h4>
              <ul className="space-y-1.5">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-zinc-300">{String(item)}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        {data.note && (
          <p className="text-xs text-zinc-500 italic">{String(data.note)}</p>
        )}

        {data.confidence_level && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Nivel de confianca:</span>
            <span className="text-xs text-purple-400 font-medium">{String(data.confidence_level)}</span>
          </div>
        )}
      </div>
    );
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
        {displayAnalysis && (
          <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
            <h3 className="text-sm font-bold text-white mb-4">Resultado da Analise</h3>
            {renderPublishedAnalysis(displayAnalysis)}
          </div>
        )}

        {/* Vote */}
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
          <p className="text-sm text-zinc-300 mb-3">Esta analise foi util?</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleVote('helpful')}
              disabled={voting || voted !== null}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
                voted === 'helpful'
                  ? 'bg-green-600/20 border border-green-600/30 text-green-300'
                  : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:border-green-600/30 hover:text-green-300'
              } disabled:opacity-50`}
            >
              <ThumbsUp className="w-4 h-4" />
              Util ({analysis.helpful_votes})
            </button>
            <button
              onClick={() => handleVote('not_helpful')}
              disabled={voting || voted !== null}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
                voted === 'not_helpful'
                  ? 'bg-red-600/20 border border-red-600/30 text-red-300'
                  : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:border-red-600/30 hover:text-red-300'
              } disabled:opacity-50`}
            >
              <ThumbsDown className="w-4 h-4" />
              Nao util
            </button>
          </div>
          {voted && (
            <p className="text-xs text-zinc-500 mt-2">Obrigado pelo seu voto!</p>
          )}
        </div>
      </div>
    </div>
  );
}
