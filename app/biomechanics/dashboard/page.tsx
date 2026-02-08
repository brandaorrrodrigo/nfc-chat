/**
 * Dashboard de Análise Biomecânica
 * Exibe resultados de análise de vídeos de exercício
 */

'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Zap, Target, TrendingUp } from 'lucide-react';

interface Classification {
  criterion: string;
  value: string;
  classification: string;
  is_safety_critical: boolean;
  rag_topics: string[];
}

interface AnalysisResult {
  success: boolean;
  videoId: string;
  analysis: {
    overall_score: number;
    exercise_type: string;
    timestamp: string;
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
    problems: Classification[];
    positive: Classification[];
  };
}

export default function BiomechanicsDashboard() {
  const [videoId, setVideoId] = useState('va_1770241761873_ckobfl93u');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load default video on mount
    analyzeVideo('va_1770241761873_ckobfl93u');
  }, []);

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
        body: JSON.stringify({ videoId: idToAnalyze }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao analisar vídeo');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeClick = () => analyzeVideo(videoId);

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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Zap className="w-8 h-8 text-cyan-400" />
            Dashboard Biomecânico
          </h1>
          <p className="text-slate-400">Análise avançada de movimento e técnica de exercício</p>
        </div>

        {/* Input Section */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-8">
          <label className="block text-white font-semibold mb-3">ID do Vídeo</label>
          <div className="flex gap-3">
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
              </div>

              {/* Exercise Type */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <p className="text-slate-400 text-sm font-semibold mb-2">EXERCÍCIO</p>
                <p className="text-xl font-bold text-white capitalize">
                  {analysis.analysis.exercise_type || 'Indefinido'}
                </p>
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
                  {analysis.analysis.rag_topics_used.length}
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
                          <p className="font-bold text-white capitalize">{problem.criterion}</p>
                          <p className="text-red-300 text-sm">
                            Valor: <span className="font-semibold">{problem.value}</span>
                          </p>
                          <p className="text-red-300 text-sm mt-1">
                            Classificação: <span className="font-semibold uppercase">{problem.classification}</span>
                          </p>
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
                          <p className="font-bold text-white capitalize">{positive.criterion}</p>
                          <p className="text-green-300 text-sm">
                            Valor: <span className="font-semibold">{positive.value}</span>
                          </p>
                          <p className="text-green-300 text-sm mt-1">
                            Classificação: <span className="font-semibold uppercase">{positive.classification}</span>
                          </p>
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
                      <th className="text-left px-4 py-2 text-slate-400 font-semibold">Classificação</th>
                      <th className="text-left px-4 py-2 text-slate-400 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.analysis.classifications_detail.map((classification, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-700 hover:bg-slate-700/30 transition"
                      >
                        <td className="px-4 py-3 text-white font-semibold capitalize">
                          {classification.criterion}
                        </td>
                        <td className="px-4 py-3 text-cyan-400 font-mono">{classification.value}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded text-xs font-semibold ${
                              classification.classification === 'danger'
                                ? 'bg-red-900/50 text-red-300'
                                : classification.classification === 'warning'
                                  ? 'bg-yellow-900/50 text-yellow-300'
                                  : classification.classification === 'excellent'
                                    ? 'bg-green-900/50 text-green-300'
                                    : 'bg-blue-900/50 text-blue-300'
                            }`}
                          >
                            {classification.classification.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {classification.is_safety_critical ? (
                            <span className="text-red-400 font-semibold">⚠️ Crítico</span>
                          ) : (
                            <span className="text-slate-400">OK</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RAG Topics Section */}
            {analysis.analysis.rag_topics_used.length > 0 && (
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
            <p className="text-slate-400 text-lg">Insira um ID de vídeo e clique em "Analisar" para começar</p>
          </div>
        )}
      </div>
    </div>
  );
}
