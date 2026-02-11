'use client';

/**
 * Pagina de Analise Individual de Video
 * Acessivel em /comunidades/[slug]/videos/[videoId]
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ThumbsUp, ThumbsDown, Eye, Clock, User, Loader2, CheckCircle, Bot, Target, Play, Star, AlertTriangle, RefreshCw, Trash2, Share2, X } from 'lucide-react';
import VideoPlayer from '@/components/nfv/VideoPlayer';
import MovementPatternBadge from '@/components/nfv/MovementPatternBadge';
import ShareModal from '@/components/nfv/ShareModal';

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
  const videoId = params.videoId as string;

  const [analysis, setAnalysis] = useState<AnalysisDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voted, setVoted] = useState<string | null>(null);
  const [voting, setVoting] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

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
  useEffect(() => {
    if (!analysis) return;
    const shouldPoll = ['PENDING_AI', 'PROCESSING'].includes(analysis.status);
    if (!shouldPoll) return;

    const intervalId = setInterval(() => {
      fetchAnalysis();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [analysis?.status, fetchAnalysis]);

  const handleRetryAnalysis = async () => {
    setRetrying(true);
    try {
      await fetch('/api/nfv/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisId: videoId }),
      });
      await fetchAnalysis();
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
    const analysisType = data.analysis_type as string || '';
    const isBiomechanicsAnalysis = analysisType.startsWith('biomechanics_');

    // Verificar se é análise do Ollama Vision (tem overall_score)
    const isVisionAnalysis = 'overall_score' in data || 'frame_analyses' in data;

    if (isBiomechanicsAnalysis || isVisionAnalysis) {
      // Score - suporta formato antigo (overall_score) e novo (score)
      const score = (data.score as number) || (data.overall_score as number) || 0;
      const summary = data.summary as string;
      const recommendations = data.recommendations as string[] || [];
      const report = data.report as Record<string, unknown> || {};
      // Frame analyses - suporta formato antigo e novo
      const visionAnalysis = data.vision_analysis as Array<Record<string, unknown>> || [];
      const frameAnalyses = (data.frame_analyses as Array<{
        frame: number;
        frame_numero?: number;
        timestamp: string;
        fase?: string;
        angulos?: {
          joelho_esq_graus?: number;
          joelho_dir_graus?: number;
          joelho_esquerdo?: number;
          joelho_direito?: number;
          flexao_quadril_graus?: number;
          flexao_quadril?: number;
          inclinacao_tronco_graus?: number;
          inclinacao_tronco?: number;
        };
        alinhamentos?: { joelhos_sobre_pes?: boolean; joelho_esq_valgo?: boolean; joelho_dir_valgo?: boolean; coluna_neutra?: boolean };
        desvios?: string[];
        desvios_detectados?: string[];
        analysis?: string;
        justificativa?: string;
        score: number;
        confianca_medida?: string;
        interpolated?: boolean;
      }> || visionAnalysis.map((v, i) => ({
        frame: (v.frame_numero as number) || i + 1,
        timestamp: v.timestamp as string || `${i * 0.4}s`,
        fase: v.fase as string,
        angulos: v.angulos as Record<string, number>,
        alinhamentos: v.alinhamentos as Record<string, boolean>,
        desvios: (v.desvios_detectados as string[]) || (v.desvios as string[]),
        justificativa: v.justificativa as string,
        score: v.score as number || 0,
        confianca_medida: v.confianca_medida as string,
        interpolated: v.interpolated as boolean
      })));
      const modelVision = data.model_vision as string || data.model as string || 'IA';
      const modelText = data.model_text as string;
      const framesAnalyzed = (data.frames_analyzed as number) || (data.metadata as Record<string,unknown>)?.frames_analyzed as number || frameAnalyses.length;
      const classificacao = (report.classificacao as string) || (data.classificacao as string) || (data.classification as string);


      // Pontos críticos - novo formato do script (com fallback para formato antigo)
      const pontosCriticosNovo = data.pontos_criticos as Array<{ nome: string; severidade: string; frames_afetados: number[]; frequencia: string }> || [];
      const pontosCriticosAntigo = (report.pontos_criticos as Array<{ tipo: string; descricao: string; severidade: string }>) || [];

      // Recomendações - novo formato do script (com fallback para formato antigo)
      const recomendacoesExercicios = data.recomendacoes_exercicios as Array<{
        desvio: string;
        severidade: string;
        exercicios: Array<{ nome: string; volume: string; frequencia: string }>;
        ajustes_tecnicos: string[];
        tempo_correcao: string;
      }> || [];
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
        switch (s?.toUpperCase()) {
          case 'LEVE': return 'text-yellow-400';
          case 'MODERADA':
          case 'MODERADO': return 'text-orange-400';
          case 'CRITICA':
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


          {/* Pontos Criticos - Novo formato */}
          {pontosCriticosNovo.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-white mb-3">
                <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Pontos Críticos ({pontosCriticosNovo.length})
              </div>
              <div className="space-y-2">
                {pontosCriticosNovo.map((ponto, i) => (
                  <div key={i} className="bg-zinc-800/50 rounded-lg p-3 border-l-4 border-red-500/50">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${getSeveridadeColor(ponto.severidade)} bg-zinc-800`}>
                        {ponto.severidade}
                      </span>
                      <span className="text-xs text-zinc-500">{ponto.frequencia}</span>
                    </div>
                    <p className="text-sm text-zinc-300 font-medium">{ponto.nome}</p>
                    <p className="text-xs text-zinc-500 mt-1">Frames: {ponto.frames_afetados?.join(', ')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pontos Criticos - Formato antigo (fallback) */}
          {pontosCriticosNovo.length === 0 && pontosCriticosAntigo.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-white mb-3">
                <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Pontos Criticos
              </div>
              <div className="space-y-2">
                {pontosCriticosAntigo.map((ponto, i) => (
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

          {/* Protocolos de Exercícios Corretivos - Novo formato */}
          {recomendacoesExercicios.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-white mb-3">
                <Target className="w-4 h-4 text-purple-400" />
                Protocolos de Exercícios Corretivos
              </div>
              <div className="space-y-4">
                {recomendacoesExercicios.map((rec, i) => (
                  <div key={i} className="bg-zinc-800/50 rounded-lg p-4 border-l-4 border-purple-500/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${getSeveridadeColor(rec.severidade)} bg-zinc-800`}>
                        {rec.severidade}
                      </span>
                      <span className="text-xs text-purple-400">⏱️ {rec.tempo_correcao}</span>
                    </div>
                    <p className="text-sm text-zinc-300 font-medium mb-3">Para: {rec.desvio}</p>

                    {/* Exercícios */}
                    <div className="mb-3">
                      <p className="text-xs text-zinc-500 mb-2">💪 Exercícios:</p>
                      <div className="space-y-1.5 ml-2">
                        {rec.exercicios?.map((ex, j) => (
                          <div key={j} className="text-xs text-zinc-300 flex items-center gap-2">
                            <span className="text-green-400">→</span>
                            <span className="font-medium">{ex.nome}</span>
                            <span className="text-zinc-500">|</span>
                            <span>{ex.volume}</span>
                            <span className="text-zinc-500">|</span>
                            <span className="text-cyan-400">{ex.frequencia}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Ajustes técnicos */}
                    {rec.ajustes_tecnicos?.length > 0 && (
                      <div>
                        <p className="text-xs text-zinc-500 mb-2">🎯 Ajustes Técnicos:</p>
                        <ul className="space-y-1 ml-2">
                          {rec.ajustes_tecnicos.map((aj, j) => (
                            <li key={j} className="text-xs text-zinc-400 flex items-start gap-2">
                              <span className="text-yellow-400">•</span>
                              <span>{aj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recomendacoes Corretivas - Formato antigo (fallback) */}
          {recomendacoesExercicios.length === 0 && recomendacoesCorretivas.length > 0 && (
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
          {recommendations.length > 0 && recomendacoesExercicios.length === 0 && recomendacoesCorretivas.length === 0 && (
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
                        Frame {frame.frame_numero || frame.frame} ({frame.timestamp})
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

                    {/* Angulos - suporta formato antigo e novo */}
                    {frame.angulos && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {(frame.angulos.joelho_esquerdo || frame.angulos.joelho_esq_graus) && (
                          <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">
                            Joelho E: {frame.angulos.joelho_esquerdo || frame.angulos.joelho_esq_graus}°
                          </span>
                        )}
                        {(frame.angulos.joelho_direito || frame.angulos.joelho_dir_graus) && (
                          <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">
                            Joelho D: {frame.angulos.joelho_direito || frame.angulos.joelho_dir_graus}°
                          </span>
                        )}
                        {(frame.angulos.flexao_quadril || frame.angulos.flexao_quadril_graus) && (
                          <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">
                            Quadril: {frame.angulos.flexao_quadril || frame.angulos.flexao_quadril_graus}°
                          </span>
                        )}
                        {(frame.angulos.inclinacao_tronco || frame.angulos.inclinacao_tronco_graus) && (
                          <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">
                            Tronco: {frame.angulos.inclinacao_tronco || frame.angulos.inclinacao_tronco_graus}°
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

                    {/* Desvios - suporta formato antigo e novo */}
                    {((frame.desvios_detectados || frame.desvios) && (frame.desvios_detectados || frame.desvios)!.length > 0) && (
                      <div className="mb-2">
                        {(frame.desvios_detectados || frame.desvios)!.map((desvio, j) => (
                          <span key={j} className="text-[10px] text-orange-400 block">
                            ⚠ {desvio}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Indicador de interpolação */}
                    {frame.interpolated && (
                      <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded mb-2 inline-block">
                        ⚡ Interpolado
                      </span>
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
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-3" />
            <p className="text-sm text-zinc-300 font-medium">
              {analysis.status === 'PROCESSING' ? 'Analisando video...' : 'Na fila de analise...'}
            </p>
            <p className="text-xs text-zinc-500 mt-1">Atualizando automaticamente</p>
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
              Tentar novamente
            </button>
          </div>
        ) : displayAnalysis ? (
          <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
            <h3 className="text-sm font-bold text-white mb-4">Resultado da Analise</h3>
            {renderPublishedAnalysis(displayAnalysis)}
          </div>
        ) : null}

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
