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
    // Verificar se é análise biomecânica estruturada (novo formato)
    const isBiomechanicsAnalysis = 'analysis_type' in data &&
      (data.analysis_type === 'biomechanics_structured' || data.analysis_type === 'biomechanics_complete');

    // Verificar se é análise do Ollama Vision (tem overall_score)
    const isVisionAnalysis = 'overall_score' in data || 'frame_analyses' in data;

    if (isBiomechanicsAnalysis || isVisionAnalysis) {
      const score = (data.overall_score as number) || 0;
      const summary = data.summary as string;
      const recommendations = data.recommendations as string[] || [];
      const report = data.report as Record<string, unknown> || {};
      const frameAnalyses = data.frame_analyses as Array<{
        frame: number;
        timestamp: string;
        fase?: string;
        angulos?: { joelho_esq_graus?: number; joelho_dir_graus?: number; flexao_quadril_graus?: number; inclinacao_tronco_graus?: number };
        alinhamentos?: { joelhos_sobre_pes?: boolean; joelho_esq_valgo?: boolean; joelho_dir_valgo?: boolean; coluna_neutra?: boolean };
        desvios?: string[];
        analysis?: string;
        justificativa?: string;
        score: number;
      }> || [];
      const modelVision = data.model_vision as string || data.model as string || 'IA';
      const modelText = data.model_text as string;
      const framesAnalyzed = (data.frames_analyzed as number) || frameAnalyses.length;
      const classificacao = (report.classificacao as string) || (data.classificacao as string);
      const pontosCriticos = (report.pontos_criticos as Array<{ tipo: string; descricao: string; severidade: string }>) || [];
      const recomendacoesCorretivas = (report.recomendacoes as Array<{ prioridade: number; categoria: string; descricao: string; exercicio_corretivo?: string }>) || [];

      const getClassificacaoColor = (c: string) => {
        switch (c) {
          case 'EXCELENTE': return 'text-green-400 bg-green-500/20';
          case 'BOM': return 'text-blue-400 bg-blue-500/20';
          case 'REGULAR': return 'text-yellow-400 bg-yellow-500/20';
          default: return 'text-red-400 bg-red-500/20';
        }
      };

      const getSeveridadeColor = (s: string) => {
        switch (s) {
          case 'LEVE': return 'text-yellow-400';
          case 'MODERADO': return 'text-orange-400';
          case 'SEVERO': return 'text-red-400';
          default: return 'text-zinc-400';
        }
      };

      const getFaseColor = (fase?: string) => {
        switch (fase) {
          case 'excentrica': return 'bg-blue-500/20 text-blue-400';
          case 'isometrica': return 'bg-purple-500/20 text-purple-400';
          case 'concentrica': return 'bg-green-500/20 text-green-400';
          default: return 'bg-zinc-700 text-zinc-400';
        }
      };

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
                {classificacao && (
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-semibold ${getClassificacaoColor(classificacao)}`}>
                    {classificacao}
                  </span>
                )}
              </div>
              <div className="text-right">
                <div className="text-xs text-zinc-500">Vision</div>
                <div className="text-sm text-zinc-400">{modelVision}</div>
                {modelText && (
                  <>
                    <div className="text-xs text-zinc-500 mt-2">Text</div>
                    <div className="text-sm text-zinc-400">{modelText}</div>
                  </>
                )}
                <div className="text-xs text-zinc-500 mt-2">Frames</div>
                <div className="text-sm text-zinc-400">{framesAnalyzed}</div>
              </div>
            </div>

            {(summary || report.resumo) && (
              <p className="mt-4 text-sm text-zinc-300 border-t border-zinc-700/50 pt-4">
                {(report.resumo as string) || summary}
              </p>
            )}
          </div>

          {/* Pontos Criticos */}
          {pontosCriticos.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-white mb-3">
                <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Pontos Criticos
              </div>
              <div className="space-y-2">
                {pontosCriticos.map((ponto, i) => (
                  <div key={i} className="flex items-start gap-3 bg-zinc-800/50 rounded-lg p-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${getSeveridadeColor(ponto.severidade)} bg-zinc-800`}>
                      {ponto.severidade}
                    </span>
                    <div>
                      <span className="text-xs text-zinc-500">[{ponto.tipo}]</span>
                      <p className="text-sm text-zinc-300">{ponto.descricao}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recomendacoes Corretivas */}
          {recomendacoesCorretivas.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-white mb-3">
                <Target className="w-4 h-4 text-purple-400" />
                Recomendacoes Corretivas
              </div>
              <div className="space-y-3">
                {recomendacoesCorretivas.map((rec, i) => (
                  <div key={i} className="bg-zinc-800/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-purple-400">#{rec.prioridade}</span>
                      <span className="text-xs text-zinc-500">{rec.categoria}</span>
                    </div>
                    <p className="text-sm text-zinc-300">{rec.descricao}</p>
                    {rec.exercicio_corretivo && (
                      <p className="text-xs text-cyan-400 mt-1">→ {rec.exercicio_corretivo}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations simples (fallback) */}
          {recommendations.length > 0 && recomendacoesCorretivas.length === 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-white mb-3">
                <Target className="w-4 h-4 text-purple-400" />
                Proximos Passos
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
                      {frame.fase && (
                        <span className={`text-[10px] px-2 py-0.5 rounded ${getFaseColor(frame.fase)}`}>
                          {frame.fase}
                        </span>
                      )}
                      <span className={`text-sm font-semibold ${getScoreColor(frame.score)}`}>
                        {frame.score}/10
                      </span>
                    </div>

                    {/* Angulos */}
                    {frame.angulos && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {frame.angulos.joelho_esq_graus && (
                          <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">
                            Joelho E: {frame.angulos.joelho_esq_graus}°
                          </span>
                        )}
                        {frame.angulos.joelho_dir_graus && (
                          <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">
                            Joelho D: {frame.angulos.joelho_dir_graus}°
                          </span>
                        )}
                        {frame.angulos.flexao_quadril_graus && (
                          <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">
                            Quadril: {frame.angulos.flexao_quadril_graus}°
                          </span>
                        )}
                        {frame.angulos.inclinacao_tronco_graus && (
                          <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">
                            Tronco: {frame.angulos.inclinacao_tronco_graus}°
                          </span>
                        )}
                      </div>
                    )}

                    {/* Alinhamentos */}
                    {frame.alinhamentos && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {frame.alinhamentos.joelhos_sobre_pes === false && (
                          <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                            Joelhos desalinhados
                          </span>
                        )}
                        {frame.alinhamentos.joelho_esq_valgo && (
                          <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                            Valgo Esq
                          </span>
                        )}
                        {frame.alinhamentos.joelho_dir_valgo && (
                          <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                            Valgo Dir
                          </span>
                        )}
                        {frame.alinhamentos.coluna_neutra === false && (
                          <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded">
                            Coluna nao neutra
                          </span>
                        )}
                      </div>
                    )}

                    {/* Desvios */}
                    {frame.desvios && frame.desvios.length > 0 && (
                      <div className="mb-2">
                        {frame.desvios.map((desvio, j) => (
                          <span key={j} className="text-[10px] text-orange-400 block">
                            ⚠ {desvio}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-sm text-zinc-400">
                      {frame.justificativa || frame.analysis}
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
