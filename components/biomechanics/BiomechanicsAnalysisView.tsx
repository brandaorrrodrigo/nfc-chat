'use client';

/**
 * BiomechanicsAnalysisView — Renderização unificada de análise biomecânica
 * Usado em comunidades/videos e biomechanics/dashboard
 * Aceita `data` no formato snake_case da API/banco (motor_score, motor_analysis, etc.)
 */

import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Play, Star, Target, ThumbsUp, ThumbsDown, ChevronDown, Calendar } from 'lucide-react';
import CorrectivePlanCard from '@/components/nfv/CorrectivePlanCard';
import { safeRender } from '@/lib/utils/safe-render';

const formatValue = (val: unknown, decimals = 1): string => {
  if (val === null || val === undefined) return '';
  const num = typeof val === 'string' ? parseFloat(val) : Number(val);
  if (isNaN(num)) return String(val);
  return num.toFixed(decimals);
};

const formatValueStr = (val: string): string => {
  const match = val.match(/^(-?\d+\.?\d*)(.*)/);
  if (!match) return val;
  const num = parseFloat(match[1]);
  if (isNaN(num)) return val;
  return formatValue(num) + match[2];
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

interface BiomechanicsAnalysisViewProps {
  data: Record<string, unknown>;
  // Plano corretivo
  plan?: Record<string, unknown> | null;
  onGeneratePlan?: () => void;
  planLoading?: boolean;
  planError?: string | null;
  // Votação (opcional — apenas na página pública de vídeo)
  helpfulVotes?: number;
  onVote?: (type: 'helpful' | 'not_helpful') => void;
  voted?: string | null;
  voting?: boolean;
}

export default function BiomechanicsAnalysisView({
  data,
  plan,
  onGeneratePlan,
  planLoading,
  planError,
  helpfulVotes,
  onVote,
  voted,
  voting,
}: BiomechanicsAnalysisViewProps) {
  const [showTechnicalData, setShowTechnicalData] = useState(false);
  const [openInfoIdx, setOpenInfoIdx] = useState<number | null>(null);

  // Verificar formato da análise
  const analysisType = data.analysis_type as string || '';
  const system = data.system as string || '';
  const isBiomechanicsAnalysis = analysisType.startsWith('biomechanics_') || system.startsWith('biomechanics-');
  const isVisionAnalysis = 'overall_score' in data || 'frame_analyses' in data;

  if (!isBiomechanicsAnalysis && !isVisionAnalysis) {
    // Fallback: formato legado
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
  }

  // === Formato biomecânico (V2 pipeline) ===
  const score = (data.score as number) || (data.overall_score as number) || 0;
  const summary = data.summary as string;
  const recommendations = data.recommendations as string[] || [];
  const report = data.report as Record<string, unknown> || data.llm_report as Record<string, unknown> || {};
  const visionAnalysis = data.vision_analysis as Array<Record<string, unknown>> || [];
  const frameDetails = data.frame_details as Array<{
    frame: number; score: number; fase?: string;
    desvios?: Array<string | { criterio?: string; valor?: string; o_que_indica?: string; possivel_causa?: string; corretivo_sugerido?: string }>;
    justificativa?: string;
  }> || [];
  const frameAnalyses = (data.frame_analyses as Array<{
    frame: number; frame_numero?: number; timestamp: string; fase?: string;
    angulos?: { joelho_esq_graus?: number; joelho_dir_graus?: number; joelho_esquerdo?: number; joelho_direito?: number; flexao_quadril_graus?: number; flexao_quadril?: number; inclinacao_tronco_graus?: number; inclinacao_tronco?: number };
    alinhamentos?: { joelhos_sobre_pes?: boolean; joelho_esq_valgo?: boolean; joelho_dir_valgo?: boolean; coluna_neutra?: boolean };
    desvios?: Array<string | { criterio?: string; valor?: string; o_que_indica?: string; possivel_causa?: string; corretivo_sugerido?: string }>;
    desvios_detectados?: Array<string | { criterio?: string; valor?: string; o_que_indica?: string; possivel_causa?: string; corretivo_sugerido?: string }>;
    analysis?: string; justificativa?: string; score: number; confianca_medida?: string; interpolated?: boolean;
  }> || (frameDetails.length > 0
    ? frameDetails.map((fd, i) => ({ frame: fd.frame || i + 1, timestamp: `Frame ${fd.frame || i + 1}`, fase: fd.fase, desvios: fd.desvios, justificativa: fd.justificativa, score: fd.score || 0 }))
    : visionAnalysis.map((v, i) => ({
        frame: (v.frame_numero as number) || i + 1, timestamp: v.timestamp as string || `${i * 0.4}s`, fase: v.fase as string,
        angulos: v.angulos as Record<string, number>, alinhamentos: v.alinhamentos as Record<string, boolean>,
        desvios: (v.desvios_detectados as string[]) || (v.desvios as string[]), justificativa: v.justificativa as string,
        score: v.score as number || 0, confianca_medida: v.confianca_medida as string, interpolated: v.interpolated as boolean,
      }))));

  const modelVision = data.model_vision as string || data.model as string || 'IA';
  const framesAnalyzed = (data.frames_analyzed as number) || (data.metadata as Record<string, unknown>)?.frames_analyzed as number || frameAnalyses.length;
  const classificacao = (report.classificacao as string) || (data.classificacao as string) || (data.classification as string);

  const pipelineVersion = data.pipeline_version as string || '';
  const motorScore = data.motor_score as number;
  const stabilizerScore = data.stabilizer_score as number;
  const mediapipeConfidence = (data.mediapipe_confidence as number) || 0;
  const motorAnalysis = data.motor_analysis as Array<{
    joint: string; label: string; movement: string;
    rom: { value: number; unit: string; min?: number; max?: number; startAngle?: number; peakAngle?: number; returnAngle?: number; eccentricControl?: 'controlled' | 'dropped' | 'unknown'; note?: string; classification: string; classificationLabel: string };
    peak_contraction?: number | null;
    symmetry?: { diff: number; unit: string; classification: string } | number | null;
  }> || [];
  const stabilizerAnalysis = data.stabilizer_analysis as Array<{
    joint: string; label: string; expected_state: string; instability_meaning?: string;
    variation: { value: number; unit: string; classification: string; classificationLabel: string };
    interpretation: string; corrective_exercises: string[];
  }> || [];
  const muscles = data.muscles as { primary?: string[]; secondary?: string[]; stabilizers?: string[] } | null;

  const pontosCriticosNovo = data.pontos_criticos as Array<{ nome: string; severidade: string; frames_afetados: number[]; frequencia: string }> || [];
  const pontosCriticosAntigo = (report.pontos_criticos as Array<{ tipo: string; descricao: string; severidade: string }>) || [];
  const recomendacoesExercicios = data.recomendacoes_exercicios as Array<{
    desvio: string; severidade: string; exercicios: Array<{ nome: string; volume: string; frequencia: string }>; ajustes_tecnicos: string[]; tempo_correcao: string;
  }> || [];
  const recomendacoesCorretivas = (report.recomendacoes as Array<{ prioridade: number; categoria: string; descricao: string; exercicio_corretivo?: string }>) || [];

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
      case 'MODERADA': case 'MODERADO': return 'text-orange-400';
      case 'CRITICA': case 'SEVERO': return 'text-red-400';
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
          <div className="text-xs text-zinc-500 uppercase tracking-[0.2em] mb-3">Score da Analise</div>
          <div className={`text-9xl font-black tracking-tight ${getScoreColor(score)}`}>
            {Number(score).toFixed(1)}
            <span className="text-4xl text-zinc-600 font-normal">/10</span>
          </div>
          {classificacao && (
            <span className={`inline-block mt-3 px-4 py-1.5 rounded-lg text-base font-bold ${getClassificacaoColor(classificacao)}`}>
              {classificacao}
            </span>
          )}
        </div>

        {/* Motor / Stabilizer sub-scores */}
        {motorScore != null && stabilizerScore != null && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-zinc-800/60 rounded-xl p-4 text-center border border-zinc-700/30">
              <div className="text-sm text-zinc-500 uppercase tracking-wider mb-2">Motor (60%)</div>
              <div className={`text-4xl font-bold ${getScoreColor(motorScore)}`}>{Number(motorScore).toFixed(1)}</div>
            </div>
            <div className="bg-zinc-800/60 rounded-xl p-4 text-center border border-zinc-700/30">
              <div className="text-sm text-zinc-500 uppercase tracking-wider mb-2">Estabilizador (40%)</div>
              <div className={`text-4xl font-bold ${getScoreColor(stabilizerScore)}`}>{Number(stabilizerScore).toFixed(1)}</div>
            </div>
          </div>
        )}

        {(summary || safeRender(report.resumo_executivo || report.resumo || '')) && (
          <p className="text-sm text-zinc-300 border-t border-zinc-800 pt-4">
            {safeRender(report.resumo_executivo || report.resumo) || safeRender(summary)}
          </p>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800">
          <span className="text-xs text-zinc-600">{framesAnalyzed} frames analisados</span>
          <div className="flex items-center gap-2">
            {pipelineVersion && (
              <span className={`text-xs px-2 py-0.5 rounded ${pipelineVersion === 'v2' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-zinc-700 text-zinc-400'}`}>
                {pipelineVersion.toUpperCase()}
              </span>
            )}
            <span className="text-xs text-zinc-600">
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
                <div className="text-xs text-red-400 uppercase tracking-wider font-semibold mb-2">Atencao</div>
                {problems.slice(0, 3).map((p, i) => (
                  <p key={i} className="text-sm text-red-300/80 mb-1">• {safeRender(p)}</p>
                ))}
              </div>
            )}
            {positives.length > 0 && (
              <div className="bg-green-500/5 rounded-xl p-4 border border-green-500/20">
                <div className="text-xs text-green-400 uppercase tracking-wider font-semibold mb-2">Pontos Fortes</div>
                {(positives as unknown[]).slice(0, 3).map((p, i) => (
                  <p key={i} className="text-sm text-green-300/80 mb-1">+ {safeRender(p)}</p>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* ═══ c) ANÁLISE MOTORA ═══ */}
      {motorAnalysis.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-green-400 flex-shrink-0" />
            <span className="text-xl font-semibold text-white">Analise Motora</span>
            {motorScore != null && (
              <span className={`text-2xl font-bold ml-auto ${getScoreColor(motorScore)}`}>{Number(motorScore).toFixed(1)}<span className="text-sm text-zinc-500 font-normal">/10</span></span>
            )}
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
                    <span className="text-lg text-zinc-100 font-semibold">{safeRender(m.label || m.joint)}</span>
                    <span className={`text-sm px-2.5 py-0.5 rounded border ${getClassBadge(romClass)}`}>
                      {safeRender(m.rom.classificationLabel || romClass)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-400">
                    <span>Movimento: {safeRender(m.movement)}</span>
                    <span>ROM: {formatValue(m.rom.value)}{safeRender(m.rom.unit)}{m.rom.startAngle != null && m.rom.peakAngle != null && ` (de ${formatValue(m.rom.startAngle, 0)}${m.rom.unit} a ${formatValue(m.rom.peakAngle, 0)}${m.rom.unit})`}</span>
                  </div>
                  {m.peak_contraction != null && !isNaN(Number(m.peak_contraction)) && (
                    <div className="text-sm text-zinc-500 mt-0.5">Pico contracao: {formatValue(m.peak_contraction, 0)}{safeRender(m.rom.unit)}</div>
                  )}
                  {m.rom.note && (
                    <div className={`text-sm mt-0.5 ${m.rom.note.startsWith('⚠') ? 'text-orange-400' : 'text-zinc-500'}`}>{m.rom.note}</div>
                  )}
                  {(() => {
                    const symVal = m.symmetry == null ? null
                      : typeof m.symmetry === 'number' ? m.symmetry
                      : typeof m.symmetry === 'object' && 'diff' in m.symmetry ? Number(m.symmetry.diff)
                      : null;
                    if (symVal === null || isNaN(symVal) || symVal > 20) return (
                      <div className="text-sm mt-0.5 text-zinc-600">Vista lateral — simetria nao disponivel</div>
                    );
                    return (
                      <div className={`text-sm mt-0.5 ${symVal > 15 ? 'text-orange-400' : 'text-zinc-500'}`}>
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
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-6 h-6 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-xl font-semibold text-white">Analise Estabilizadores</span>
            {stabilizerScore != null && (
              <span className={`text-2xl font-bold ml-auto ${getScoreColor(stabilizerScore)}`}>{Number(stabilizerScore).toFixed(1)}<span className="text-sm text-zinc-500 font-normal">/10</span></span>
            )}
          </div>
          <div className="space-y-3">
            {stabilizerAnalysis.map((s, i) => {
              const mode = (s as { stability_mode?: string }).stability_mode || 'rigid';
              const cls = s.variation.classification;
              const stabClass = cls === 'firme' ? 'excellent'
                : (mode !== 'rigid' && cls === 'alerta') ? 'info'
                : cls === 'alerta' ? 'warning' : 'danger';
              const stabBorder = stabClass === 'excellent' ? 'border-green-500/50'
                : stabClass === 'info' ? 'border-blue-500/50'
                : stabClass === 'warning' ? 'border-orange-500/50' : 'border-red-500/50';
              const stateMsgs = (s as { state_messages?: { firme?: string; alerta?: string; compensacao?: string } }).state_messages;
              const stateMsg = (() => {
                if (mode === 'rigid') {
                  if (cls === 'firme') return { text: 'Estavel', color: 'text-green-400', icon: '✓' };
                  if (cls === 'alerta') return { text: 'Instavel — atencao', color: 'text-yellow-400', icon: '⚠' };
                  return { text: 'Compensacao — corrigir', color: 'text-red-400', icon: '✗' };
                }
                if (mode === 'controlled') {
                  if (cls === 'firme') return { text: stateMsgs?.firme || 'Estavel', color: 'text-green-400', icon: '✓' };
                  if (cls === 'alerta') return { text: stateMsgs?.alerta || 'Movimento aceitavel para este exercicio', color: 'text-blue-400', icon: '~' };
                  return { text: stateMsgs?.compensacao || 'Movimento excessivo — possivel impulso', color: 'text-orange-400', icon: '⚠' };
                }
                // functional
                if (cls === 'firme') return { text: stateMsgs?.firme || 'Controle excelente', color: 'text-green-400', icon: '✓' };
                if (cls === 'alerta') return { text: stateMsgs?.alerta || 'Momentum normal da tecnica', color: 'text-blue-400', icon: '~' };
                return { text: stateMsgs?.compensacao || 'Momentum excessivo — reduzir carga', color: 'text-orange-400', icon: '⚠' };
              })();
              const transparency = (s as { transparency?: {
                rawValue: number; minFrame?: number; maxFrame?: number;
                p10?: number; p90?: number;
                correctionNote?: string;
                baseThresholds?: { acceptable: number; warning: number; danger: number };
                effectiveThresholds: { acceptable: number; warning: number; danger: number };
                explanation: string;
              } }).transparency;
              const isInfoOpen = openInfoIdx === i;
              return (
                <div key={i} className={`bg-zinc-800/50 rounded-xl p-4 border-l-3 ${stabBorder}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg text-zinc-100 font-semibold">{safeRender(s.label || s.joint)}</span>
                      {mode !== 'rigid' && (
                        <span className={`text-[11px] px-1 py-0.5 rounded ${
                          mode === 'functional' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {mode === 'functional' ? 'FUNC' : 'CTRL'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm px-2.5 py-0.5 rounded border ${
                        stabClass === 'info' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : getClassBadge(stabClass)
                      }`}>
                        {safeRender(s.variation.classificationLabel || s.variation.classification)}
                      </span>
                      {transparency && (
                        <button
                          onClick={() => setOpenInfoIdx(isInfoOpen ? null : i)}
                          className={`p-0.5 rounded transition-colors ${isInfoOpen ? 'text-blue-400' : 'text-zinc-600 hover:text-zinc-400'}`}
                          title="Como medimos?"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="text-sm mb-1">
                    <span className={stateMsg.color}>{stateMsg.icon} {stateMsg.text}</span>
                  </div>
                  <div className="text-sm text-zinc-500">
                    Variacao: {formatValue(s.variation.value)}{safeRender(s.variation.unit)}
                  </div>
                  {isInfoOpen && transparency && (
                    <div className="mt-2 p-2.5 bg-zinc-900/80 rounded-lg border border-zinc-700/50 text-xs space-y-1">
                      <p className="text-zinc-300 font-medium mb-1.5">📊 Como medimos</p>
                      <div className="text-zinc-500 space-y-0.5">
                        <p>Valor medido: <span className="text-zinc-300">{formatValue(transparency.rawValue)}{safeRender(s.variation.unit)}</span></p>
                        {transparency.minFrame != null && transparency.maxFrame != null && (
                          <p>Range frames: <span className="text-zinc-300">{formatValue(transparency.minFrame)}° — {formatValue(transparency.maxFrame)}°</span></p>
                        )}
                        {transparency.p10 != null && transparency.p90 != null && (
                          <p>P10–P90: <span className="text-zinc-300">{formatValue(transparency.p10)}° – {formatValue(transparency.p90)}°</span></p>
                        )}
                        <div className="pt-0.5 border-t border-zinc-700/50">
                          {transparency.baseThresholds && mode !== 'rigid' && (
                            <p className="text-zinc-600 mb-0.5">
                              Base:{' '}
                              <span className="text-zinc-500">ok &lt;{transparency.baseThresholds.acceptable}{s.variation.unit}</span>
                              {' | '}
                              <span className="text-zinc-500">atenção &lt;{transparency.baseThresholds.warning}{s.variation.unit}</span>
                              {' | '}
                              <span className="text-zinc-500">limite &gt;{transparency.baseThresholds.danger}{s.variation.unit}</span>
                              <span className="text-zinc-600"> ×{mode === 'functional' ? '3' : '1.8'} ({mode})</span>
                            </p>
                          )}
                          <p>
                            Efetivo:{' '}
                            <span className="text-green-400">ok &lt;{transparency.effectiveThresholds.acceptable}{s.variation.unit}</span>
                            {' | '}
                            <span className="text-yellow-400">atenção &lt;{transparency.effectiveThresholds.warning}{s.variation.unit}</span>
                            {' | '}
                            <span className="text-red-400">limite &gt;{transparency.effectiveThresholds.danger}{s.variation.unit}</span>
                          </p>
                        </div>
                        {transparency.correctionNote && (
                          <p className="text-zinc-600 italic pt-0.5 border-t border-zinc-700/30">⚙ {transparency.correctionNote}</p>
                        )}
                        <p className="text-zinc-400 italic pt-0.5">{transparency.explanation}</p>
                      </div>
                    </div>
                  )}
                  {Array.isArray(s.corrective_exercises) && s.corrective_exercises.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {s.corrective_exercises.map((ex, j) => (
                        <span key={j} className="text-xs px-2 py-1 rounded bg-purple-500/15 text-purple-400 border border-purple-500/20">
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

      {/* ═══ e) MÚSCULOS ═══ */}
      {muscles && (muscles.primary?.length || muscles.secondary?.length || muscles.stabilizers?.length) ? (
        <div>
          <div className="flex items-center gap-2 text-base font-medium text-white mb-3">
            <svg className="w-4 h-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Musculos Envolvidos
          </div>
          <div className="flex flex-wrap gap-1.5">
            {muscles.primary?.map((m, i) => (
              <span key={`p-${i}`} className="text-xs px-2.5 py-1 rounded bg-pink-500/20 text-pink-400 border border-pink-500/20">{safeRender(m)}</span>
            ))}
            {muscles.secondary?.map((m, i) => (
              <span key={`s-${i}`} className="text-xs px-2.5 py-1 rounded bg-zinc-700/50 text-zinc-400 border border-zinc-600/30">{safeRender(m)}</span>
            ))}
            {muscles.stabilizers?.map((m, i) => (
              <span key={`st-${i}`} className="text-xs px-2.5 py-1 rounded bg-blue-500/15 text-blue-400 border border-blue-500/20">{safeRender(m)}</span>
            ))}
          </div>
        </div>
      ) : null}

      {/* ═══ f) PLANO CORRETIVO ═══ */}
      {(() => {
        const hasStabProblems = stabilizerAnalysis.some(s => s.variation.classification !== 'firme');
        const hasAnyProblems = hasStabProblems || pontosCriticosNovo.length > 0 || pontosCriticosAntigo.length > 0;
        if (!hasAnyProblems && !plan) return null;
        return (
          <CorrectivePlanCard
            plan={plan as any}
            onGeneratePlan={onGeneratePlan}
            loading={planLoading}
            error={planError}
          />
        );
      })()}

      {/* ═══ g) AGENDAR RETESTE ═══ */}
      {stabilizerAnalysis.some(s => s.variation.classification !== 'firme') && (
        <div className="text-center">
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600/15 border border-cyan-500/30 text-cyan-300 text-sm font-medium hover:bg-cyan-600/25 transition-colors">
            <Calendar className="w-4 h-4" />
            Agendar Reteste em 2-4 Semanas
          </button>
          <p className="text-xs text-zinc-600 mt-2">Recomendado apos seguir o plano corretivo</p>
        </div>
      )}

      {/* ═══ h) VOTE (opcional) ═══ */}
      {onVote && (
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
          <p className="text-sm text-zinc-300 mb-3">Esta analise foi util?</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onVote('helpful')}
              disabled={voting || voted !== null}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
                voted === 'helpful'
                  ? 'bg-green-600/20 border border-green-600/30 text-green-300'
                  : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:border-green-600/30 hover:text-green-300'
              } disabled:opacity-50`}
            >
              <ThumbsUp className="w-4 h-4" />
              Util ({helpfulVotes || 0})
            </button>
            <button
              onClick={() => onVote('not_helpful')}
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
      )}


      {/* ═══ j) DADOS TÉCNICOS [Colapsado] ═══ */}
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

          {/* Classifications Detail */}
          {(() => {
            const classificationsDetail = data.classifications_detail as Array<{
              type?: 'motor' | 'stabilizer'; criterion: string; label: string;
              value: string; raw_value: number; unit: string; classification: string;
              classification_label: string; is_safety_critical: boolean; is_informative: boolean; note?: string;
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
                            <span className={`text-[8px] px-1 py-0.5 rounded flex-shrink-0 ${isStab ? 'bg-blue-500/15 text-blue-400' : 'bg-green-500/15 text-green-400'}`}>
                              {isStab ? 'EST' : 'MOT'}
                            </span>
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
                      <p key={i} className={`text-[10px] ${c.note?.startsWith('⚠') ? 'text-orange-400' : c.note?.startsWith('✓') ? 'text-green-400' : 'text-zinc-500'}`}>
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
                Pontos Criticos ({pontosCriticosNovo.length})
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

          {/* Protocolos de Exercícios Corretivos */}
          {recomendacoesExercicios.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-white mb-3">
                <Target className="w-4 h-4 text-purple-400" />
                Protocolos de Exercicios Corretivos
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
                    {rec.ajustes_tecnicos?.length > 0 && (
                      <div>
                        <p className="text-xs text-zinc-500 mb-2">Ajustes Tecnicos:</p>
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

          {/* MediaPipe Frames (raw angles) */}
          {pipelineVersion && frameAnalyses.length === 0 && (() => {
            const mpFrames = data.mediapipe_frames as Array<{
              frame: number; success: boolean; angles: Record<string, number> | null; error: string | null;
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
                    {frame.alinhamentos && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {frame.alinhamentos.joelhos_sobre_pes === false && (
                          <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded">Joelhos desalinhados</span>
                        )}
                        {frame.alinhamentos.joelho_esq_valgo && (
                          <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded">Valgo Esq</span>
                        )}
                        {frame.alinhamentos.joelho_dir_valgo && (
                          <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded">Valgo Dir</span>
                        )}
                        {frame.alinhamentos.coluna_neutra === false && (
                          <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded">Coluna nao neutra</span>
                        )}
                      </div>
                    )}
                    {(() => {
                      const desvios = frame.desvios_detectados || frame.desvios;
                      if (!Array.isArray(desvios) || desvios.length === 0) return null;
                      return (
                        <div className="mb-2 space-y-1">
                          {desvios.map((desvio, j) => {
                            if (typeof desvio === 'string') return (
                              <span key={j} className="text-[10px] text-orange-400 block">⚠ {desvio}</span>
                            );
                            if (desvio && typeof desvio === 'object') return (
                              <div key={j} className="text-[10px] text-orange-400 bg-orange-500/10 rounded px-2 py-1">
                                <span className="font-medium">{safeRender(desvio.criterio || 'Desvio')}</span>
                                {desvio.valor && <span className="text-zinc-400 ml-1">({safeRender(desvio.valor)})</span>}
                                {desvio.o_que_indica && <p className="text-zinc-400 mt-0.5">{safeRender(desvio.o_que_indica)}</p>}
                                {desvio.possivel_causa && <p className="text-zinc-500 mt-0.5">Causa: {safeRender(desvio.possivel_causa)}</p>}
                                {desvio.corretivo_sugerido && <p className="text-cyan-400/70 mt-0.5">Corretivo: {safeRender(desvio.corretivo_sugerido)}</p>}
                              </div>
                            );
                            return null;
                          })}
                        </div>
                      );
                    })()}
                    {frame.interpolated && (
                      <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded mb-2 inline-block">⚡ Interpolado</span>
                    )}
                    <p className="text-sm text-zinc-400">{safeRender(frame.justificativa || frame.analysis)}</p>
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
