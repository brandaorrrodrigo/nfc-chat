/**
 * Dashboard de Análise Biomecânica
 * Exibe resultados de análise de vídeos de exercício
 */

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle, AlertTriangle, Zap, Target, TrendingUp, Info, Trash2, ArrowLeft, X, Loader2 } from 'lucide-react';

interface Classification {
  criterion: string;
  label: string;
  metric: string;
  value: string;
  raw_value: number;
  unit: string;
  classification: string;
  classification_label: string;
  is_safety_critical: boolean;
  is_informative?: boolean;
  note?: string;
  rag_topics: string[];
}

interface LLMProblem {
  nome: string;
  severidade: 'CRITICA' | 'MODERADA' | 'LEVE';
  descricao: string;
  causa_provavel?: string;
  fundamentacao?: string;
}

interface LLMRecommendation {
  prioridade: number;
  categoria: string;
  descricao: string;
  exercicio_corretivo?: string;
}

interface LLMAnalysisReport {
  resumo_executivo: string;
  problemas_identificados: LLMProblem[];
  pontos_positivos: string[];
  recomendacoes: LLMRecommendation[];
  score_geral: number;
  classificacao: 'EXCELENTE' | 'BOM' | 'REGULAR' | 'NECESSITA_CORRECAO';
  proximos_passos: string[];
}

interface AnalysisResult {
  success: boolean;
  videoId: string;
  analysis: {
    overall_score: number;
    exercise_type: string;
    timestamp: string;
    equipment_constraint?: string | null;
    equipment_constraint_label?: string | null;
    classification_summary: {
      excellent: number;
      good: number;
      acceptable: number;
      warning: number;
      danger: number;
    };
    classifications_detail: Classification[];
    rag_topics_used: string[];
    frames_analyzed: number;
  };
  diagnostic: {
    score: number;
    summary: {
      excellent: number;
      good: number;
      acceptable: number;
      warning: number;
      danger: number;
    };
    problems: (Classification & Record<string, any>)[];
    positive: (Classification & Record<string, any>)[];
  };
  report?: LLMAnalysisReport | null;
}

export default function BiomechanicsDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlVideoId = searchParams.get('videoId');

  const [videoId, setVideoId] = useState(urlVideoId || '');
  const [equipmentConstraint, setEquipmentConstraint] = useState('none');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const CONSTRAINT_OPTIONS = [
    { value: 'none', label: 'Sem limitação' },
    { value: 'safety_bars', label: 'Barras de segurança' },
    { value: 'machine_guided', label: 'Máquina guiada (Smith)' },
    { value: 'space_limited', label: 'Espaço limitado' },
    { value: 'pain_limited', label: 'Dor limitando amplitude' },
    { value: 'rehab', label: 'Em reabilitação' },
  ];

  // Auto-load quando videoId vem da URL
  useEffect(() => {
    if (urlVideoId) {
      setVideoId(urlVideoId);
      analyzeVideo(urlVideoId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlVideoId]);

  const analyzeVideo = async (id?: string) => {
    const idToAnalyze = id || videoId;
    if (!idToAnalyze.trim()) {
      setError('Por favor, insira um ID de vídeo');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/biomechanics/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: idToAnalyze,
          equipmentConstraint: equipmentConstraint !== 'none' ? equipmentConstraint : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || `API error: ${response.status}`);
      }

      setAnalysis(data);
    } catch (err) {
      console.error('[Dashboard] Erro na análise:', err);
      setError(err instanceof Error ? err.message : 'Erro ao analisar vídeo');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeClick = () => analyzeVideo(videoId);

  const handleDelete = async () => {
    const idToDelete = videoId.trim();
    if (!idToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/nfv/videos/${idToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        setAnalysis(null);
        setVideoId('');
        setShowDeleteConfirm(false);
        router.push('/biomechanics/videos');
        return;
      }
    } catch {
      // silently fail
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    if (score >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'bg-green-100';
    if (score >= 6) return 'bg-yellow-100';
    if (score >= 4) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const getClassificationIcon = (classification: string) => {
    switch (classification) {
      case 'danger':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'excellent':
      case 'good':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button onClick={() => router.push('/biomechanics/videos')} className="text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                <Zap className="w-8 h-8 text-cyan-400" />
                Dashboard Biomecânico
              </h1>
            </div>
            <p className="text-slate-400 ml-9">Análise avançada de movimento e técnica de exercício</p>
          </div>
          {analysis && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/10 border border-red-600/20 text-red-400 text-sm font-medium hover:bg-red-600/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Excluir Video
            </button>
          )}
        </div>

        {/* Input Section */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-8">
          <label className="block text-white font-semibold mb-3">ID do Vídeo</label>
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              placeholder="va_1770241761873_ckobfl93u"
              className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleAnalyzeClick}
              disabled={loading}
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded disabled:opacity-50 transition"
            >
              {loading ? 'Analisando...' : 'Analisar'}
            </button>
          </div>
          <div>
            <label className="block text-slate-400 text-sm font-semibold mb-2">Contexto / Limitação Externa</label>
            <select
              value={equipmentConstraint}
              onChange={(e) => setEquipmentConstraint(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-cyan-500"
            >
              {CONSTRAINT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {equipmentConstraint !== 'none' && (
              <span className="ml-3 text-sm text-amber-400">
                Critérios de amplitude serão informativos (não penalizam score)
              </span>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-6 text-red-200">
            <p className="font-semibold">Erro: {error}</p>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <>
            {/* Overall Score Card */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {/* Score */}
              <div className={`rounded-lg border border-slate-700 p-6 ${getScoreBgColor(analysis.analysis.overall_score)}`}>
                <p className="text-slate-600 text-sm font-semibold mb-2">SCORE GERAL</p>
                <p className={`text-4xl font-bold ${getScoreColor(analysis.analysis.overall_score)}`}>
                  {analysis.analysis.overall_score.toFixed(1)}
                  <span className="text-xl">/10</span>
                </p>
                {analysis.analysis.equipment_constraint && analysis.analysis.equipment_constraint !== 'none' && (
                  <p className="text-slate-500 text-xs mt-2">Score reflete apenas qualidade técnica</p>
                )}
              </div>

              {/* Exercise Type */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <p className="text-slate-400 text-sm font-semibold mb-2">EXERCÍCIO</p>
                <p className="text-xl font-bold text-white capitalize">
                  {analysis.analysis.exercise_type || 'Indefinido'}
                </p>
                {analysis.analysis.equipment_constraint_label && (
                  <span className="inline-block mt-2 px-2 py-1 bg-amber-900/40 text-amber-300 text-xs rounded font-semibold">
                    {analysis.analysis.equipment_constraint_label}
                  </span>
                )}
              </div>

              {/* Frames Analyzed */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <p className="text-slate-400 text-sm font-semibold mb-2">FRAMES</p>
                <p className="text-xl font-bold text-cyan-400">
                  {analysis.analysis.frames_analyzed}
                </p>
              </div>

              {/* RAG Topics */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <p className="text-slate-400 text-sm font-semibold mb-2">TÓPICOS RAG</p>
                <p className="text-xl font-bold text-purple-400">
                  {(analysis?.analysis?.rag_topics_used || []).length}
                </p>
              </div>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4">
                <p className="text-green-400 text-xs font-semibold mb-1">EXCELENTE</p>
                <p className="text-3xl font-bold text-green-400">{analysis.diagnostic.summary.excellent}</p>
              </div>
              <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
                <p className="text-blue-400 text-xs font-semibold mb-1">BOM</p>
                <p className="text-3xl font-bold text-blue-400">{analysis.diagnostic.summary.good}</p>
              </div>
              <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4">
                <p className="text-slate-400 text-xs font-semibold mb-1">ACEITÁVEL</p>
                <p className="text-3xl font-bold text-slate-400">{analysis.diagnostic.summary.acceptable}</p>
              </div>
              <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4">
                <p className="text-yellow-400 text-xs font-semibold mb-1">ALERTA</p>
                <p className="text-3xl font-bold text-yellow-400">{analysis.diagnostic.summary.warning}</p>
              </div>
              <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4">
                <p className="text-red-400 text-xs font-semibold mb-1">CRÍTICO</p>
                <p className="text-3xl font-bold text-red-400">{analysis.diagnostic.summary.danger}</p>
              </div>
            </div>

            {/* Problems Section */}
            {analysis.diagnostic.problems.length > 0 && (
              <div className="bg-slate-800 rounded-lg border border-red-700/50 p-6 mb-8">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  Problemas Identificados
                </h2>
                <div className="space-y-3">
                  {analysis.diagnostic.problems.map((problem, idx) => (
                    <div
                      key={idx}
                      className="bg-red-900/20 border border-red-700/30 rounded p-4"
                    >
                      <div className="flex items-start gap-3">
                        {getClassificationIcon(problem.classification)}
                        <div className="flex-1">
                          <p className="font-bold text-white">{problem.label || problem.criterion}</p>
                          <p className="text-red-300 text-sm">
                            Valor: <span className="font-mono font-semibold">{problem.value}</span>
                          </p>
                          <p className="text-red-300 text-sm mt-1">
                            Classificação: <span className="font-semibold">{problem.classification_label || problem.classification}</span>
                          </p>
                          {problem.note && (
                            <p className="text-red-300/70 text-xs mt-1 italic">{problem.note}</p>
                          )}
                          {problem.rag_topics && problem.rag_topics.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {problem.rag_topics.map((topic, i) => (
                                <span
                                  key={i}
                                  className="bg-red-900/40 text-red-300 text-xs px-2 py-1 rounded"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Positive Section */}
            {analysis.diagnostic.positive.length > 0 && (
              <div className="bg-slate-800 rounded-lg border border-green-700/50 p-6 mb-8">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  Pontos Positivos
                </h2>
                <div className="space-y-3">
                  {analysis.diagnostic.positive.map((positive, idx) => (
                    <div
                      key={idx}
                      className="bg-green-900/20 border border-green-700/30 rounded p-4"
                    >
                      <div className="flex items-start gap-3">
                        {getClassificationIcon(positive.classification)}
                        <div className="flex-1">
                          <p className="font-bold text-white">{positive.label || positive.criterion}</p>
                          <p className="text-green-300 text-sm">
                            Valor: <span className="font-mono font-semibold">{positive.value}</span>
                          </p>
                          <p className="text-green-300 text-sm mt-1">
                            Classificação: <span className="font-semibold">{positive.classification_label || positive.classification}</span>
                          </p>
                          {positive.note && (
                            <p className="text-green-300/70 text-xs mt-1 italic">{positive.note}</p>
                          )}
                          {positive.rag_topics && positive.rag_topics.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {positive.rag_topics.map((topic, i) => (
                                <span
                                  key={i}
                                  className="bg-green-900/40 text-green-300 text-xs px-2 py-1 rounded"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Classifications Table */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
                Todas as Classificações
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left px-4 py-2 text-slate-400 font-semibold">Critério</th>
                      <th className="text-left px-4 py-2 text-slate-400 font-semibold">Valor</th>
                      <th className="text-left px-4 py-2 text-slate-400 font-semibold">Nível</th>
                      <th className="text-left px-4 py-2 text-slate-400 font-semibold">Status</th>
                      <th className="text-left px-4 py-2 text-slate-400 font-semibold">Observação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.analysis.classifications_detail.map((c, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-700 hover:bg-slate-700/30 transition"
                      >
                        <td className="px-4 py-3 text-white font-semibold">
                          {c.label || c.criterion}
                        </td>
                        <td className="px-4 py-3 text-cyan-400 font-mono">{c.value}</td>
                        <td className="px-4 py-3">
                          {c.is_informative ? (
                            <span className="px-3 py-1 rounded text-xs font-semibold bg-slate-600/50 text-slate-300">
                              INFORMATIVO
                            </span>
                          ) : (
                            <span
                              className={`px-3 py-1 rounded text-xs font-semibold ${
                                c.classification === 'danger'
                                  ? 'bg-red-900/50 text-red-300'
                                  : c.classification === 'warning'
                                    ? 'bg-yellow-900/50 text-yellow-300'
                                    : c.classification === 'excellent'
                                      ? 'bg-green-900/50 text-green-300'
                                      : c.classification === 'good'
                                        ? 'bg-emerald-900/50 text-emerald-300'
                                        : 'bg-blue-900/50 text-blue-300'
                              }`}
                            >
                              {(c.classification_label || c.classification).toUpperCase()}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {c.is_informative ? (
                            <span className="text-slate-400 text-xs flex items-center gap-1">
                              <Info className="w-3 h-3" />
                              Amplitude limitada
                            </span>
                          ) : c.is_safety_critical ? (
                            <span className="text-red-400 font-semibold">Risco de Lesão</span>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs max-w-[200px] truncate">
                          {c.note || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* LLM Report Section */}
            {analysis.report && (
              <div className="bg-slate-800 rounded-lg border border-cyan-700/50 p-6 mb-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-cyan-400" />
                  Análise de IA (Ollama)
                </h2>

                {/* Executive Summary */}
                <div className="bg-slate-700/50 rounded-lg p-4 mb-6 border border-cyan-600/30">
                  <h3 className="text-lg font-semibold text-cyan-300 mb-2">Resumo Executivo</h3>
                  <p className="text-slate-300 leading-relaxed">{analysis.report.resumo_executivo}</p>
                </div>

                {/* Score and Classification */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-700/50 rounded-lg p-4 border border-cyan-600/30">
                    <p className="text-slate-400 text-sm font-semibold mb-1">SCORE GERAL (IA)</p>
                    <p className={`text-3xl font-bold ${getScoreColor(analysis.report.score_geral)}`}>
                      {analysis.report.score_geral.toFixed(1)}/10
                    </p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 border border-cyan-600/30">
                    <p className="text-slate-400 text-sm font-semibold mb-1">CLASSIFICAÇÃO</p>
                    <p className="text-2xl font-bold text-cyan-300">
                      {analysis.report.classificacao.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>

                {/* Identified Problems */}
                {(analysis?.report?.problemas_identificados?.length ?? 0) > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-red-300 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Problemas Identificados
                    </h3>
                    <div className="space-y-3">
                      {analysis.report.problemas_identificados.map((problema, idx) => (
                        <div
                          key={idx}
                          className="bg-red-900/20 border border-red-700/30 rounded p-3"
                        >
                          <div className="flex items-start gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              problema.severidade === 'CRITICA'
                                ? 'bg-red-900/60 text-red-200'
                                : problema.severidade === 'MODERADA'
                                  ? 'bg-yellow-900/60 text-yellow-200'
                                  : 'bg-blue-900/60 text-blue-200'
                            }`}>
                              {problema.severidade}
                            </span>
                            <p className="font-semibold text-white">{problema.nome}</p>
                          </div>
                          <p className="text-red-300 text-sm mb-1">{problema.descricao}</p>
                          {problema.causa_provavel && (
                            <p className="text-red-300/70 text-xs italic">
                              Causa provável: {problema.causa_provavel}
                            </p>
                          )}
                          {problema.fundamentacao && (
                            <p className="text-red-300/70 text-xs mt-1 italic">
                              {problema.fundamentacao}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Positive Points */}
                {(analysis?.report?.pontos_positivos?.length ?? 0) > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-green-300 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Pontos Positivos
                    </h3>
                    <ul className="space-y-2">
                      {analysis.report.pontos_positivos.map((ponto, idx) => (
                        <li key={idx} className="text-green-300 text-sm flex items-start gap-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span>{ponto}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {(analysis?.report?.recomendacoes?.length ?? 0) > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-yellow-300 mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Recomendações
                    </h3>
                    <div className="space-y-3">
                      {analysis.report.recomendacoes.map((rec, idx) => (
                        <div
                          key={idx}
                          className="bg-yellow-900/20 border border-yellow-700/30 rounded p-3"
                        >
                          <div className="flex items-start gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-yellow-900/60 text-yellow-200">
                              P{rec.prioridade}
                            </span>
                            <div className="flex-1">
                              <p className="font-semibold text-white text-sm">{rec.categoria}</p>
                              <p className="text-yellow-300 text-sm">{rec.descricao}</p>
                              {rec.exercicio_corretivo && (
                                <p className="text-yellow-300/80 text-xs mt-1">
                                  Ex. corretivo: {rec.exercicio_corretivo}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Next Steps */}
                {(analysis?.report?.proximos_passos?.length ?? 0) > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Próximos Passos
                    </h3>
                    <ol className="space-y-2">
                      {analysis.report.proximos_passos.map((passo, idx) => (
                        <li key={idx} className="text-blue-300 text-sm flex items-start gap-2">
                          <span className="font-semibold text-blue-400 flex-shrink-0">{idx + 1}.</span>
                          <span>{passo}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* RAG Topics Section */}
            {(analysis?.analysis?.rag_topics_used?.length ?? 0) > 0 && (
              <div className="bg-slate-800 rounded-lg border border-purple-700/50 p-6">
                <h2 className="text-xl font-bold text-white mb-4">Tópicos de Conhecimento</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {analysis.analysis.rag_topics_used.map((topic, idx) => (
                    <div
                      key={idx}
                      className="bg-purple-900/20 border border-purple-700/30 rounded p-3 flex items-center gap-2"
                    >
                      <Target className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span className="text-purple-300 text-sm">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="mt-8 text-center text-slate-500 text-sm">
              <p>Análise realizada em: {new Date(analysis.analysis.timestamp).toLocaleString('pt-BR')}</p>
              <p>ID do vídeo: {analysis.videoId}</p>
            </div>
          </>
        )}

        {/* Empty State */}
        {!analysis && !loading && (
          <div className="text-center py-12">
            <Zap className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">Insira um ID de vídeo e clique em &quot;Analisar&quot; para começar</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !deleting && setShowDeleteConfirm(false)} />
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6">
            <button
              onClick={() => !deleting && setShowDeleteConfirm(false)}
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
              ID: {videoId}
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
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
