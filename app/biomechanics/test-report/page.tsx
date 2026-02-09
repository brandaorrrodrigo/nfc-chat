'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Zap, Target, TrendingUp } from 'lucide-react';

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

interface ReportResponse {
  success: boolean;
  exercise: string;
  category: string;
  processing_time_ms: number;
  classification: {
    overall_score: number;
    summary: {
      excellent: number;
      good: number;
      acceptable: number;
      warning: number;
      danger: number;
    };
    details: Array<{
      criterion: string;
      label: string;
      level: string;
      level_label: string;
      value: number;
    }>;
  };
  rag: {
    topics_needed: string[];
    contexts_found: number;
  };
  report: LLMAnalysisReport | null;
}

export default function TestReportPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testData = {
    exercise: 'agachamento com barra',
    angles: {
      profundidade: 104,
      valgo: 0,
      tronco: 7.2,
      tornozelo: 22,
      lombar: 10.5,
      assimetria: 0,
    },
    constraint: 'safety_bars',
  };

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/biomechanics/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data: ReportResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar relatório');
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Zap className="w-8 h-8 text-cyan-400" />
            Teste de Relatório IA
          </h1>
          <p className="text-slate-400">Gera relatório Ollama + RAG com dados pré-computados</p>
        </div>

        {/* Test Data Section */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Dados de Teste</h2>
          <div className="bg-slate-700/50 p-4 rounded font-mono text-slate-300 text-sm mb-6">
            <p>Exercício: {testData.exercise}</p>
            <p>Constraint: {testData.constraint}</p>
            <p className="mt-3 text-slate-400">Ângulos:</p>
            <ul className="ml-4 space-y-1 text-slate-300">
              <li>• Profundidade: {testData.angles.profundidade}° (INFORMATIVO - barras de segurança)</li>
              <li>• Valgo: {testData.angles.valgo}cm (ACEITÁVEL)</li>
              <li>• Tronco: {testData.angles.tronco}° (ACEITÁVEL)</li>
              <li>• Tornozelo: {testData.angles.tornozelo}° (INFORMATIVO - barras de segurança)</li>
              <li>• Lombar: {testData.angles.lombar}° (ALERTA - butt wink)</li>
              <li>• Assimetria: {testData.angles.assimetria}° (ACEITÁVEL)</li>
            </ul>
            <p className="mt-3 text-slate-400">Tópicos RAG esperados:</p>
            <ul className="ml-4 space-y-1 text-slate-300">
              <li>• retroversão pélvica agachamento</li>
              <li>• butt wink</li>
              <li>• flexão lombar</li>
            </ul>
          </div>

          <button
            onClick={generateReport}
            disabled={loading}
            className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded disabled:opacity-50 transition"
          >
            {loading ? 'Gerando relatório...' : 'Gerar Relatório'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-6 text-red-200">
            <p className="font-semibold">Erro: {error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <>
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className={`rounded-lg border border-slate-700 p-6 ${getScoreBgColor(result.classification.overall_score)}`}>
                <p className="text-slate-600 text-sm font-semibold mb-2">SCORE CLASSIFICAÇÃO</p>
                <p className={`text-4xl font-bold ${getScoreColor(result.classification.overall_score)}`}>
                  {result.classification.overall_score.toFixed(1)}/10
                </p>
              </div>

              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <p className="text-slate-400 text-sm font-semibold mb-2">CATEGORIA</p>
                <p className="text-xl font-bold text-white capitalize">{result.category}</p>
              </div>

              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <p className="text-slate-400 text-sm font-semibold mb-2">TEMPO PROCESSAMENTO</p>
                <p className="text-xl font-bold text-cyan-400">{result.processing_time_ms}ms</p>
              </div>

              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <p className="text-slate-400 text-sm font-semibold mb-2">TÓPICOS RAG</p>
                <p className="text-xl font-bold text-purple-400">{result.rag.contexts_found}</p>
              </div>
            </div>

            {/* Classificações */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4">
                <p className="text-green-400 text-xs font-semibold mb-1">EXCELENTE</p>
                <p className="text-3xl font-bold text-green-400">{result.classification.summary.excellent}</p>
              </div>
              <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
                <p className="text-blue-400 text-xs font-semibold mb-1">BOM</p>
                <p className="text-3xl font-bold text-blue-400">{result.classification.summary.good}</p>
              </div>
              <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4">
                <p className="text-slate-400 text-xs font-semibold mb-1">ACEITÁVEL</p>
                <p className="text-3xl font-bold text-slate-400">{result.classification.summary.acceptable}</p>
              </div>
              <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4">
                <p className="text-yellow-400 text-xs font-semibold mb-1">ALERTA</p>
                <p className="text-3xl font-bold text-yellow-400">{result.classification.summary.warning}</p>
              </div>
              <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4">
                <p className="text-red-400 text-xs font-semibold mb-1">CRÍTICO</p>
                <p className="text-3xl font-bold text-red-400">{result.classification.summary.danger}</p>
              </div>
            </div>

            {/* LLM Report */}
            {result.report && (
              <div className="bg-slate-800 rounded-lg border border-cyan-700/50 p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-cyan-400" />
                  Análise de IA (Ollama)
                </h2>

                {/* Executive Summary */}
                <div className="bg-slate-700/50 rounded-lg p-4 mb-6 border border-cyan-600/30">
                  <h3 className="text-lg font-semibold text-cyan-300 mb-2">Resumo Executivo</h3>
                  <p className="text-slate-300 leading-relaxed">{result.report.resumo_executivo}</p>
                </div>

                {/* Score and Classification */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-700/50 rounded-lg p-4 border border-cyan-600/30">
                    <p className="text-slate-400 text-sm font-semibold mb-1">SCORE GERAL (IA)</p>
                    <p className={`text-3xl font-bold ${getScoreColor(result.report.score_geral)}`}>
                      {result.report.score_geral.toFixed(1)}/10
                    </p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 border border-cyan-600/30">
                    <p className="text-slate-400 text-sm font-semibold mb-1">CLASSIFICAÇÃO</p>
                    <p className="text-2xl font-bold text-cyan-300">
                      {result.report.classificacao.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>

                {/* Identified Problems */}
                {result.report.problemas_identificados.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-red-300 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Problemas Identificados ({result.report.problemas_identificados.length})
                    </h3>
                    <div className="space-y-3">
                      {result.report.problemas_identificados.map((problema, idx) => (
                        <div
                          key={idx}
                          className="bg-red-900/20 border border-red-700/30 rounded p-3"
                        >
                          <div className="flex items-start gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold flex-shrink-0 ${
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
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Positive Points */}
                {result.report.pontos_positivos.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-green-300 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Pontos Positivos ({result.report.pontos_positivos.length})
                    </h3>
                    <ul className="space-y-2">
                      {result.report.pontos_positivos.map((ponto, idx) => (
                        <li key={idx} className="text-green-300 text-sm flex items-start gap-2">
                          <span className="text-green-400 mt-0.5">✓</span>
                          <span>{ponto}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {result.report.recomendacoes.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-yellow-300 mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Recomendações ({result.report.recomendacoes.length})
                    </h3>
                    <div className="space-y-3">
                      {result.report.recomendacoes.map((rec, idx) => (
                        <div
                          key={idx}
                          className="bg-yellow-900/20 border border-yellow-700/30 rounded p-3"
                        >
                          <div className="flex items-start gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-yellow-900/60 text-yellow-200 flex-shrink-0">
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
                {result.report.proximos_passos.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Próximos Passos
                    </h3>
                    <ol className="space-y-2">
                      {result.report.proximos_passos.map((passo, idx) => (
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

            {!result.report && (
              <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4 mb-8 text-yellow-300">
                <p>⚠️ Relatório não disponível. Verifique se Ollama está rodando em localhost:11434</p>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!result && !loading && !error && (
          <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
            <Zap className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">Clique no botão acima para gerar o relatório de teste</p>
          </div>
        )}
      </div>
    </div>
  );
}
