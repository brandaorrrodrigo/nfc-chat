'use client';

/**
 * Pagina de Analise Individual de Video
 * Acessivel em /comunidades/[slug]/videos/[videoId]
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ThumbsUp, ThumbsDown, Eye, Clock, User, Loader2, CheckCircle, Bot, Target, Play, Star, AlertTriangle, RefreshCw, Trash2, Share2, X, ChevronDown, Calendar } from 'lucide-react';
import VideoPlayer from '@/components/nfv/VideoPlayer';
import MovementPatternBadge from '@/components/nfv/MovementPatternBadge';
import ShareModal from '@/components/nfv/ShareModal';
import CorrectivePlanCard from '@/components/nfv/CorrectivePlanCard';
import { safeRender } from '@/lib/utils/safe-render';

/** Arredonda valores numéricos para evitar floating point noise */
const formatValue = (val: unknown, decimals = 1): string => {
  if (val === null || val === undefined) return '';
  const num = typeof val === 'string' ? parseFloat(val) : Number(val);
  if (isNaN(num)) return String(val);
  return num.toFixed(decimals);
};

/** Formata string com valor+unidade (ex: "26.800000000000004°" → "26.8°") */
const formatValueStr = (val: string): string => {
  const match = val.match(/^(-?\d+\.?\d*)(.*)/);
  if (!match) return val;
  const num = parseFloat(match[1]);
  if (isNaN(num)) return val;
  return formatValue(num) + match[2];
};

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [correctivePlan, setCorrectivePlan] = useState<Record<string, unknown> | null>(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const [showTechnicalData, setShowTechnicalData] = useState(false);

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

  // Auto-retry: se video fica stuck em PENDING_AI ou ERROR por >30s, re-trigger analise automaticamente
  useEffect(() => {
    if (!analysis) return;
    if (!['PENDING_AI', 'ERROR'].includes(analysis.status)) return;

    const autoRetryTimer = setTimeout(async () => {
      console.log(`[NFV] Auto-retry: re-triggering analysis for ${videoId}`);
      try {
        await fetch('/api/nfv/analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ analysisId: videoId }),
        });
      } catch {
        // polling vai detectar mudancas
      }
    }, 30000); // 30 segundos

    return () => clearTimeout(autoRetryTimer);
  }, [analysis?.status, videoId]);

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
    const system = data.system as string || '';
    const isBiomechanicsAnalysis = analysisType.startsWith('biomechanics_') || system.startsWith('biomechanics-');

    // Verificar se é análise do Ollama Vision (tem overall_score)
    const isVisionAnalysis = 'overall_score' in data || 'frame_analyses' in data;

    if (isBiomechanicsAnalysis || isVisionAnalysis) {
      // Score - suporta formato antigo (overall_score) e novo (score)
      const score = (data.score as number) || (data.overall_score as number) || 0;
      const summary = data.summary as string;
      const recommendations = data.recommendations as string[] || [];
      const report = data.report as Record<string, unknown> || data.llm_report as Record<string, unknown> || {};
      // Frame analyses - suporta formato antigo, novo e biomechanics-v3
      const visionAnalysis = data.vision_analysis as Array<Record<string, unknown>> || [];
      const frameDetails = data.frame_details as Array<{
        frame: number;
        score: number;
        fase?: string;
        desvios?: Array<string | { criterio?: string; valor?: string; o_que_indica?: string; possivel_causa?: string; corretivo_sugerido?: string }>;
        justificativa?: string;
      }> || [];
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
        desvios?: Array<string | { criterio?: string; valor?: string; o_que_indica?: string; possivel_causa?: string; corretivo_sugerido?: string }>;
        desvios_detectados?: Array<string | { criterio?: string; valor?: string; o_que_indica?: string; possivel_causa?: string; corretivo_sugerido?: string }>;
        analysis?: string;
        justificativa?: string;
        score: number;
        confianca_medida?: string;
        interpolated?: boolean;
      }> || (frameDetails.length > 0
        ? frameDetails.map((fd, i) => ({
            frame: fd.frame || i + 1,
            timestamp: `Frame ${fd.frame || i + 1}`,
            fase: fd.fase,
            desvios: fd.desvios,
            justificativa: fd.justificativa,
            score: fd.score || 0,
          }))
        : visionAnalysis.map((v, i) => ({
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
          }))));
      const modelVision = data.model_vision as string || data.model as string || 'IA';
      const modelText = data.model_text as string;
      const framesAnalyzed = (data.frames_analyzed as number) || (data.metadata as Record<string,unknown>)?.frames_analyzed as number || frameAnalyses.length;
      const classificacao = (report.classificacao as string) || (data.classificacao as string) || (data.classification as string);

      const getClassBadge = (cls: string) => {
        switch (cls) {
          case 'excellent': return 'bg-green-500/20 text-green-400 border-green-500/30';
          case 'good': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
          case 'acceptable': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
          case 'warning': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
          case 'danger': return 'bg-red-500/20 text-red-400 border-red-500/30';
          default: return 'bg-zinc-700/50 text-zinc-400 border-zinc-600/30';
        }
      };

      // V2 Pipeline data
      const pipelineVersion = data.pipeline_version as string || '';
      const motorScore = data.motor_score as number;
      const stabilizerScore = data.stabilizer_score as number;
      const mediapipeConfidence = (data.mediapipe_confidence as number) || 0;
      const motorAnalysis = data.motor_analysis as Array<{
        joint: string;
        label: string;
        movement: string;
        rom: { value: number; unit: string; min?: number; max?: number; startAngle?: number; peakAngle?: number; returnAngle?: number; eccentricControl?: 'controlled' | 'dropped' | 'unknown'; note?: string; classification: string; classificationLabel: string };
        peak_contraction?: number | null;
        symmetry?: { diff: number; unit: string; classification: string } | number | null;
      }> || [];
      const stabilizerAnalysis = data.stabilizer_analysis as Array<{
        joint: string;
        label: string;
        expected_state: string;
        instability_meaning?: string;
        variation: { value: number; unit: string; classification: string; classificationLabel: string };
        interpretation: string;
        corrective_exercises: string[];
      }> || [];
      const muscles = data.muscles as { primary?: string[]; secondary?: string[]; stabilizers?: string[] } | null;


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
        <div className="space-y-8">
          {/* ═══ a) HERO: Score Geral ═══ */}
          <div className={`rounded-2xl p-6 border ${getScoreBg(score)} bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-zinc-800/80`}>
            <div className="text-center mb-5">
              <div className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-3">Score da Analise</div>
              <div className={`text-7xl font-black tracking-tight ${getScoreColor(score)}`}>
                {Number(score).toFixed(1)}
                <span className="text-3xl text-zinc-600 font-normal">/10</span>
              </div>
              {classificacao && (
                <span className={`inline-block mt-3 px-4 py-1.5 rounded-lg text-sm font-bold ${getClassificacaoColor(classificacao)}`}>
                  {classificacao}
                </span>
              )}
            </div>

            {/* Motor / Stabilizer sub-scores */}
            {motorScore != null && stabilizerScore != null && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-zinc-800/60 rounded-xl p-4 text-center border border-zinc-700/30">
                  <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Motor (60%)</div>
                  <div className={`text-3xl font-bold ${getScoreColor(motorScore)}`}>{Number(motorScore).toFixed(1)}</div>
                </div>
                <div className="bg-zinc-800/60 rounded-xl p-4 text-center border border-zinc-700/30">
                  <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Estabilizador (40%)</div>
                  <div className={`text-3xl font-bold ${getScoreColor(stabilizerScore)}`}>{Number(stabilizerScore).toFixed(1)}</div>
                </div>
              </div>
            )}

            {(summary || safeRender(report.resumo_executivo || report.resumo || '')) && (
              <p className="text-sm text-zinc-300 border-t border-zinc-800 pt-4">
                {safeRender(report.resumo_executivo || report.resumo) || safeRender(summary)}
              </p>
            )}

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800">
              <span className="text-[10px] text-zinc-600">{framesAnalyzed} frames analisados</span>
              <div className="flex items-center gap-2">
                {pipelineVersion && (
                  <span className={`text-[10px] px-2 py-0.5 rounded ${pipelineVersion === 'v2' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-zinc-700 text-zinc-400'}`}>
                    {pipelineVersion.toUpperCase()}
                  </span>
                )}
                <span className="text-[10px] text-zinc-600">
                  {pipelineVersion ? `MediaPipe ${(Number(mediapipeConfidence) * 100).toFixed(0)}%` : modelVision}
                </span>
              </div>
            </div>
          </div>

          {/* ═══ b) RESUMO RÁPIDO ═══ */}
          {(() => {
            const problems = stabilizerAnalysis
              .filter(s => s.variation.classification !== 'firme')
              .map(s => safeRender(s.instability_meaning || s.interpretation || `${safeRender(s.label)}: ${safeRender(s.variation.classificationLabel)}`));
            const positives = (report.pontos_positivos as string[]) || motorAnalysis
              .filter(m => ['excellent', 'good'].includes(m.rom.classification))
              .slice(0, 3)
              .map(m => `${safeRender(m.label)}: ${safeRender(m.rom.classificationLabel)}`);
            if (problems.length === 0 && positives.length === 0) return null;
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {problems.length > 0 && (
                  <div className="bg-red-500/5 rounded-xl p-4 border border-red-500/20">
                    <div className="text-[10px] text-red-400 uppercase tracking-wider font-semibold mb-2">Atencao</div>
                    {problems.slice(0, 3).map((p, i) => (
                      <p key={i} className="text-xs text-red-300/80 mb-1">• {safeRender(p)}</p>
                    ))}
                  </div>
                )}
                {positives.length > 0 && (
                  <div className="bg-green-500/5 rounded-xl p-4 border border-green-500/20">
                    <div className="text-[10px] text-green-400 uppercase tracking-wider font-semibold mb-2">Pontos Fortes</div>
                    {(positives as unknown[]).slice(0, 3).map((p, i) => (
                      <p key={i} className="text-xs text-green-300/80 mb-1">+ {safeRender(p)}</p>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}


          {/* Classifications Detail movido para seção técnica colapsável */}

          {/* ═══ c) ANÁLISE MOTORA ═══ */}
          {motorAnalysis.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
                <Target className="w-5 h-5 text-green-400" />
                Analise Motora
                <span className="text-xs px-2 py-0.5 rounded-lg bg-green-500/20 text-green-400 font-bold">
                  {motorScore != null ? `${Number(motorScore).toFixed(1)}/10` : ''}
                </span>
              </div>
              <div className="space-y-3">
                {motorAnalysis.map((m, i) => {
                  const romClass = m.rom.classification;
                  const romBg = romClass === 'excellent' ? 'border-green-500/50'
                    : romClass === 'good' ? 'border-blue-500/50'
                    : romClass === 'acceptable' ? 'border-yellow-500/50'
                    : romClass === 'warning' ? 'border-orange-500/50'
                    : romClass === 'danger' ? 'border-red-500/50' : 'border-zinc-700';
                  return (
                    <div key={i} className={`bg-zinc-800/50 rounded-xl p-4 border-l-3 ${romBg}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-zinc-200 font-medium">{safeRender(m.label || m.joint)}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded border ${getClassBadge(romClass)}`}>
                          {safeRender(m.rom.classificationLabel || romClass)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                        <span>Movimento: {safeRender(m.movement)}</span>
                        <span>ROM: {formatValue(m.rom.value)}{safeRender(m.rom.unit)}{m.rom.startAngle != null && m.rom.peakAngle != null && ` (de ${formatValue(m.rom.startAngle, 0)}${m.rom.unit} a ${formatValue(m.rom.peakAngle, 0)}${m.rom.unit})`}</span>
                        {m.rom.returnAngle != null && (
                          <span>retorno: {formatValue(m.rom.returnAngle, 0)}{safeRender(m.rom.unit)}</span>
                        )}
                        {m.rom.eccentricControl && m.rom.eccentricControl !== 'unknown' && (
                          <span className={m.rom.eccentricControl === 'controlled' ? 'text-green-600' : 'text-orange-500'}>
                            {m.rom.eccentricControl === 'controlled' ? '✓ exc. controlada' : '⚠ soltou peso'}
                          </span>
                        )}
                      </div>
                      {m.peak_contraction != null && !isNaN(Number(m.peak_contraction)) && (
                        <div className="text-[10px] text-zinc-500 mt-0.5">Pico contracao: {formatValue(m.peak_contraction, 0)}{safeRender(m.rom.unit)}</div>
                      )}
                      {m.rom.note && (
                        <div className={`text-[10px] mt-0.5 ${m.rom.note.startsWith('⚠') ? 'text-orange-400' : 'text-zinc-500'}`}>{m.rom.note}</div>
                      )}
                      {(() => {
                        const symVal = m.symmetry == null ? null
                          : typeof m.symmetry === 'number' ? m.symmetry
                          : typeof m.symmetry === 'object' && 'diff' in m.symmetry ? Number(m.symmetry.diff)
                          : null;
                        if (symVal === null || isNaN(symVal) || symVal > 20) return (
                          <div className="text-[10px] mt-0.5 text-zinc-600">Vista lateral — simetria nao disponivel</div>
                        );
                        return (
                          <div className={`text-[10px] mt-0.5 ${symVal > 15 ? 'text-orange-400' : 'text-zinc-500'}`}>
                            Simetria: {formatValue(symVal)}° diferenca
                          </div>
                        );
                      })()}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ d) ANÁLISE ESTABILIZADORES ═══ */}
          {stabilizerAnalysis.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Analise Estabilizadores
                <span className="text-xs px-2 py-0.5 rounded-lg bg-blue-500/20 text-blue-400 font-bold">
                  {stabilizerScore != null ? `${Number(stabilizerScore).toFixed(1)}/10` : ''}
                </span>
              </div>
              <div className="space-y-3">
                {stabilizerAnalysis.map((s, i) => {
                  const mode = (s as any).stability_mode || 'rigid';
                  const cls = s.variation.classification;
                  const stabClass = cls === 'firme' ? 'excellent'
                    : (mode !== 'rigid' && cls === 'alerta') ? 'info'
                    : cls === 'alerta' ? 'warning' : 'danger';
                  const stabBorder = stabClass === 'excellent' ? 'border-green-500/50'
                    : stabClass === 'info' ? 'border-blue-500/50'
                    : stabClass === 'warning' ? 'border-orange-500/50' : 'border-red-500/50';
                  const stateMsg = (() => {
                    if (mode === 'rigid') {
                      if (cls === 'firme') return { text: 'Estavel', color: 'text-green-400', icon: '✓' };
                      if (cls === 'alerta') return { text: 'Instavel — atencao', color: 'text-yellow-400', icon: '⚠' };
                      return { text: 'Compensacao — corrigir', color: 'text-red-400', icon: '✗' };
                    }
                    if (mode === 'controlled') {
                      if (cls === 'firme') return { text: 'Estavel', color: 'text-green-400', icon: '✓' };
                      if (cls === 'alerta') return { text: 'Movimento aceitavel para este exercicio', color: 'text-blue-400', icon: '~' };
                      return { text: 'Movimento excessivo — possivel impulso', color: 'text-orange-400', icon: '⚠' };
                    }
                    if (cls === 'firme') return { text: 'Controle excelente', color: 'text-green-400', icon: '✓' };
                    if (cls === 'alerta') return { text: 'Momentum normal da tecnica', color: 'text-blue-400', icon: '~' };
                    return { text: 'Momentum excessivo — reduzir carga', color: 'text-orange-400', icon: '⚠' };
                  })();
                  return (
                    <div key={i} className={`bg-zinc-800/50 rounded-xl p-4 border-l-3 ${stabBorder}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm text-zinc-200 font-medium">{safeRender(s.label || s.joint)}</span>
                          {mode !== 'rigid' && (
                            <span className={`text-[9px] px-1 py-0.5 rounded ${
                              mode === 'functional' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {mode === 'functional' ? 'FUNC' : 'CTRL'}
                            </span>
                          )}
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded border ${
                          stabClass === 'info' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : getClassBadge(stabClass)
                        }`}>
                          {safeRender(s.variation.classificationLabel || s.variation.classification)}
                        </span>
                      </div>
                      <div className="text-[10px] mb-1">
                        <span className={stateMsg.color}>{stateMsg.icon} {stateMsg.text}</span>
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        Variacao: {formatValue(s.variation.value)}{safeRender(s.variation.unit)}
                      </div>
                      {Array.isArray(s.corrective_exercises) && s.corrective_exercises.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {s.corrective_exercises.map((ex, j) => (
                            <span key={j} className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/20">
                              {safeRender(ex)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* V2: Musculos utilizados */}
          {muscles && (muscles.primary?.length || muscles.secondary?.length || muscles.stabilizers?.length) ? (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-white mb-3">
                <svg className="w-4 h-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Musculos Envolvidos
              </div>
              <div className="flex flex-wrap gap-1.5">
                {muscles.primary?.map((m, i) => (
                  <span key={`p-${i}`} className="text-[10px] px-2 py-0.5 rounded bg-pink-500/20 text-pink-400 border border-pink-500/20">{safeRender(m)}</span>
                ))}
                {muscles.secondary?.map((m, i) => (
                  <span key={`s-${i}`} className="text-[10px] px-2 py-0.5 rounded bg-zinc-700/50 text-zinc-400 border border-zinc-600/30">{safeRender(m)}</span>
                ))}
                {muscles.stabilizers?.map((m, i) => (
                  <span key={`st-${i}`} className="text-[10px] px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/20">{safeRender(m)}</span>
                ))}
              </div>
            </div>
          ) : null}

          {/* ═══ f) PLANO CORRETIVO ═══ */}
          {(() => {
            const hasStabProblems = stabilizerAnalysis.some(s => s.variation.classification !== 'firme');
            const hasAnyProblems = hasStabProblems || pontosCriticosNovo.length > 0 || pontosCriticosAntigo.length > 0;
            if (!hasAnyProblems && !displayPlan) return null;
            return (
              <CorrectivePlanCard
                plan={displayPlan}
                onGeneratePlan={handleGeneratePlan}
                loading={planLoading}
                error={planError}
              />
            );
          })()}

          {/* ═══ g) AGENDAR RETESTE ═══ */}
          <div className="text-center">
            <button
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600/15 border border-cyan-500/30 text-cyan-300 text-sm font-medium hover:bg-cyan-600/25 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Agendar Reteste em 2-4 Semanas
            </button>
            <p className="text-[10px] text-zinc-600 mt-2">Recomendado apos seguir o plano corretivo</p>
          </div>

          {/* ═══ VOTE: Esta análise foi útil? ═══ */}
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
                Util ({analysis?.helpful_votes || 0})
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
            {voted && <p className="text-xs text-zinc-500 mt-2">Obrigado pelo seu voto!</p>}
          </div>

          {/* ═══ h) RELATÓRIO IA ═══ */}
          {report && typeof report === 'object' && Object.keys(report).length > 0 && (() => {
            const pontosPositivos = report.pontos_positivos as string[] || [];
            const pontosAtencao = report.pontos_de_atencao as Array<{ item: string; severidade: string; sugestao: string }> || [];
            const conclusao = report.conclusao as string;
            const recsTop3 = report.recomendacoes_top3 as Array<{ prioridade: number; acao: string; motivo: string }> || [];
            const cadeiaMovimento = report.cadeia_de_movimento as Array<{ fase: string; descricao: string }> || [];
            if (pontosPositivos.length === 0 && pontosAtencao.length === 0 && !conclusao && recsTop3.length === 0) return null;

            return (
              <div className="space-y-4">
                {/* Pontos positivos */}
                {pontosPositivos.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Pontos Positivos
                    </div>
                    <ul className="space-y-1">
                      {pontosPositivos.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                          <span className="text-green-400 mt-0.5">+</span>
                          {safeRender(p)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Cadeia de movimento */}
                {cadeiaMovimento.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                      <Play className="w-4 h-4 text-cyan-400" />
                      Cadeia de Movimento
                    </div>
                    <div className="space-y-1.5">
                      {cadeiaMovimento.map((fase, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getFaseColor(String(fase.fase || '').toLowerCase())}`}>{safeRender(fase.fase)}</span>
                          <span className="text-zinc-400">{safeRender(fase.descricao)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pontos de atencao */}
                {pontosAtencao.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                      <AlertTriangle className="w-4 h-4 text-orange-400" />
                      Pontos de Atencao
                    </div>
                    <div className="space-y-2">
                      {pontosAtencao.map((p, i) => (
                        <div key={i} className="bg-zinc-800/50 rounded-lg p-2.5 border-l-2 border-orange-500/50">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-semibold ${getSeveridadeColor(safeRender(p.severidade))}`}>{safeRender(p.severidade)}</span>
                            <span className="text-xs text-zinc-300">{safeRender(p.item)}</span>
                          </div>
                          <p className="text-[10px] text-zinc-500">{safeRender(p.sugestao)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recomendacoes top 3 */}
                {recsTop3.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      Recomendacoes
                    </div>
                    <div className="space-y-1.5">
                      {recsTop3.map((r, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          <span className="text-yellow-400 font-bold">#{safeRender(r.prioridade)}</span>
                          <div>
                            <span className="text-zinc-300">{safeRender(r.acao)}</span>
                            <span className="text-zinc-500 ml-1">— {safeRender(r.motivo)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conclusao */}
                {conclusao && (
                  <div className="bg-zinc-800/30 rounded-lg p-3 border border-zinc-700/50">
                    <p className="text-xs text-zinc-400 italic">{safeRender(conclusao)}</p>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ═══ i) DADOS TÉCNICOS [Colapsado] ═══ */}
          <div>
            <button
              onClick={() => setShowTechnicalData(!showTechnicalData)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-800/30 border border-zinc-800 text-sm text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Target className="w-4 h-4 text-zinc-500" />
                Ver dados tecnicos
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showTechnicalData ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showTechnicalData && (
            <div className="space-y-6 border border-zinc-800/50 rounded-xl p-4 bg-zinc-900/30">

          {/* Classifications Detail - Tabela de critérios biomecânicos */}
          {(() => {
            const classificationsDetail = data.classifications_detail as Array<{
              type?: 'motor' | 'stabilizer';
              criterion: string;
              label: string;
              value: string;
              raw_value: number;
              unit: string;
              classification: string;
              classification_label: string;
              is_safety_critical: boolean;
              is_informative: boolean;
              note?: string;
            }> || [];
            if (classificationsDetail.length === 0) return null;

            const categoryLabel = (data.category as string) || '';

            return (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <Target className="w-4 h-4 text-cyan-400" />
                    Classificacao por Criterio
                  </div>
                  {categoryLabel && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      {categoryLabel}
                    </span>
                  )}
                </div>
                <div className="space-y-1.5">
                  {classificationsDetail.map((c, i) => (
                    <div key={i} className={`flex items-center justify-between bg-zinc-800/50 rounded-lg px-3 py-2 ${c.is_safety_critical ? 'border-l-2 border-red-500/70' : ''}`}>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {(() => {
                          const isStab = c.type === 'stabilizer' || c.note?.startsWith('✓') || c.note?.startsWith('⚠') || c.note?.startsWith('Estabilizador');
                          return (
                            <span className={`text-[8px] px-1 py-0.5 rounded flex-shrink-0 ${
                              isStab ? 'bg-blue-500/15 text-blue-400' : 'bg-green-500/15 text-green-400'
                            }`}>{isStab ? 'EST' : 'MOT'}</span>
                          );
                        })()}
                        <span className="text-xs text-zinc-300 truncate">{safeRender(c.label || c.criterion)}</span>
                        {c.is_safety_critical && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 flex-shrink-0">!</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span className="text-xs text-zinc-400 font-mono">{formatValueStr(safeRender(c.value))}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded border ${getClassBadge(safeRender(c.classification))}`}>
                          {safeRender(c.classification_label || c.classification)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {classificationsDetail.some(c => c.note) && (
                  <div className="mt-2 space-y-1">
                    {classificationsDetail.filter(c => c.note).map((c, i) => (
                      <p key={i} className={`text-[10px] ${
                        c.note?.startsWith('⚠') ? 'text-orange-400' : c.note?.startsWith('✓') ? 'text-green-400' : 'text-zinc-500'
                      }`}>
                        <span className="text-zinc-400">{safeRender(c.label || c.criterion)}:</span> {safeRender(c.note)}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

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
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${getSeveridadeColor(safeRender(ponto.severidade))} bg-zinc-800`}>
                        {safeRender(ponto.severidade)}
                      </span>
                      <span className="text-xs text-zinc-500">{safeRender(ponto.frequencia)}</span>
                    </div>
                    <p className="text-sm text-zinc-300 font-medium">{safeRender(ponto.nome)}</p>
                    <p className="text-xs text-zinc-500 mt-1">Frames: {Array.isArray(ponto.frames_afetados) ? ponto.frames_afetados.join(', ') : safeRender(ponto.frames_afetados)}</p>
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
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${getSeveridadeColor(safeRender(ponto.severidade))} bg-zinc-800`}>
                      {safeRender(ponto.severidade)}
                    </span>
                    <div>
                      <span className="text-xs text-zinc-500">[{safeRender(ponto.tipo)}]</span>
                      <p className="text-sm text-zinc-300">{safeRender(ponto.descricao)}</p>
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
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${getSeveridadeColor(safeRender(rec.severidade))} bg-zinc-800`}>
                        {safeRender(rec.severidade)}
                      </span>
                      <span className="text-xs text-purple-400">{safeRender(rec.tempo_correcao)}</span>
                    </div>
                    <p className="text-sm text-zinc-300 font-medium mb-3">Para: {safeRender(rec.desvio)}</p>

                    {/* Exercícios */}
                    <div className="mb-3">
                      <p className="text-xs text-zinc-500 mb-2">Exercicios:</p>
                      <div className="space-y-1.5 ml-2">
                        {rec.exercicios?.map((ex, j) => (
                          <div key={j} className="text-xs text-zinc-300 flex items-center gap-2">
                            <span className="text-green-400">→</span>
                            <span className="font-medium">{safeRender(ex.nome)}</span>
                            <span className="text-zinc-500">|</span>
                            <span>{safeRender(ex.volume)}</span>
                            <span className="text-zinc-500">|</span>
                            <span className="text-cyan-400">{safeRender(ex.frequencia)}</span>
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
                              <span>{safeRender(aj)}</span>
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
                      <span className="text-xs font-bold text-purple-400">#{safeRender(rec.prioridade)}</span>
                      <span className="text-xs text-zinc-500">{safeRender(rec.categoria)}</span>
                    </div>
                    <p className="text-sm text-zinc-300">{safeRender(rec.descricao)}</p>
                    {rec.exercicio_corretivo && (
                      <p className="text-xs text-cyan-400 mt-1">→ {safeRender(rec.exercicio_corretivo)}</p>
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
                    {safeRender(rec)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* V2: MediaPipe Frames (raw angles per frame) */}
          {pipelineVersion && frameAnalyses.length === 0 && (() => {
            const mpFrames = data.mediapipe_frames as Array<{
              frame: number;
              success: boolean;
              angles: Record<string, number> | null;
              error: string | null;
            }> || [];
            if (mpFrames.length === 0) return null;

            return (
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-white mb-3">
                  <Play className="w-4 h-4 text-cyan-400" />
                  Dados MediaPipe por Frame
                </div>
                <div className="space-y-2">
                  {mpFrames.map((mf, i) => (
                    <div key={i} className={`bg-zinc-800/50 rounded-lg p-2.5 ${mf.success ? '' : 'opacity-50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-zinc-500">Frame {safeRender(mf.frame)}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded ${mf.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {mf.success ? 'OK' : 'FALHOU'}
                        </span>
                      </div>
                      {mf.success && mf.angles && (
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(mf.angles).slice(0, 8).map(([key, val]) => (
                            <span key={key} className="text-[9px] bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-500">
                              {key.replace(/_/g, ' ')}: {typeof val === 'number' ? formatValue(val) : safeRender(val)}
                            </span>
                          ))}
                        </div>
                      )}
                      {mf.error && <p className="text-[10px] text-red-400">{safeRender(mf.error)}</p>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Frame by Frame Analysis (legacy/vision format) */}
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
                        Frame {safeRender(frame.frame_numero || frame.frame)} ({safeRender(frame.timestamp)})
                      </span>
                      {frame.fase && (
                        <span className={`text-[10px] px-2 py-0.5 rounded ${getFaseColor(safeRender(frame.fase))}`}>
                          {safeRender(frame.fase)}
                        </span>
                      )}
                      <span className={`text-sm font-semibold ${getScoreColor(Number(frame.score) || 0)}`}>
                        {safeRender(frame.score)}/10
                      </span>
                    </div>

                    {/* Angulos - suporta formato antigo e novo */}
                    {frame.angulos && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {(frame.angulos.joelho_esquerdo || frame.angulos.joelho_esq_graus) && (
                          <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">
                            Joelho E: {formatValue(frame.angulos.joelho_esquerdo || frame.angulos.joelho_esq_graus)}°
                          </span>
                        )}
                        {(frame.angulos.joelho_direito || frame.angulos.joelho_dir_graus) && (
                          <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">
                            Joelho D: {formatValue(frame.angulos.joelho_direito || frame.angulos.joelho_dir_graus)}°
                          </span>
                        )}
                        {(frame.angulos.flexao_quadril || frame.angulos.flexao_quadril_graus) && (
                          <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">
                            Quadril: {formatValue(frame.angulos.flexao_quadril || frame.angulos.flexao_quadril_graus)}°
                          </span>
                        )}
                        {(frame.angulos.inclinacao_tronco || frame.angulos.inclinacao_tronco_graus) && (
                          <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">
                            Tronco: {formatValue(frame.angulos.inclinacao_tronco || frame.angulos.inclinacao_tronco_graus)}°
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

                    {/* Desvios - suporta string (V1) e objeto (V2) */}
                    {(() => {
                      const desvios = frame.desvios_detectados || frame.desvios;
                      if (!Array.isArray(desvios) || desvios.length === 0) return null;
                      return (
                        <div className="mb-2 space-y-1">
                          {desvios.map((desvio, j) => {
                            if (typeof desvio === 'string') {
                              return (
                                <span key={j} className="text-[10px] text-orange-400 block">
                                  ⚠ {desvio}
                                </span>
                              );
                            }
                            if (desvio && typeof desvio === 'object') {
                              return (
                                <div key={j} className="text-[10px] text-orange-400 bg-orange-500/10 rounded px-2 py-1">
                                  <span className="font-medium">{safeRender(desvio.criterio || 'Desvio')}</span>
                                  {desvio.valor && <span className="text-zinc-400 ml-1">({safeRender(desvio.valor)})</span>}
                                  {desvio.o_que_indica && (
                                    <p className="text-zinc-400 mt-0.5">{safeRender(desvio.o_que_indica)}</p>
                                  )}
                                  {desvio.possivel_causa && (
                                    <p className="text-zinc-500 mt-0.5">Causa: {safeRender(desvio.possivel_causa)}</p>
                                  )}
                                  {desvio.corretivo_sugerido && (
                                    <p className="text-cyan-400/70 mt-0.5">Corretivo: {safeRender(desvio.corretivo_sugerido)}</p>
                                  )}
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      );
                    })()}

                    {/* Indicador de interpolação */}
                    {frame.interpolated && (
                      <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded mb-2 inline-block">
                        ⚡ Interpolado
                      </span>
                    )}

                    <p className="text-sm text-zinc-400">
                      {safeRender(frame.justificativa || frame.analysis)}
                    </p>

                  </div>
                ))}
              </div>
            </div>
          )}

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
                    <span className="text-sm text-zinc-300">{safeRender(item)}</span>
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
          renderPublishedAnalysis(displayAnalysis)
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
