/**
 * Dashboard de Análise Biomecânica
 * Exibe resultados de análise de vídeos de exercício
 */

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle, AlertTriangle, Zap, Target, TrendingUp, Info, Trash2, ArrowLeft, X, Loader2, RefreshCw, Video, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { safeRender } from '@/lib/utils/safe-render';
import BiomechanicsAnalysisView from '@/components/biomechanics/BiomechanicsAnalysisView';

/** Arredonda valores numéricos para evitar floating point noise (ex: 26.800000000000004 → 26.8) */
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
  type?: string;
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

// V1 Report Format
interface LLMAnalysisReport {
  resumo_executivo: string;
  problemas_identificados: LLMProblem[];
  pontos_positivos: string[];
  recomendacoes: LLMRecommendation[];
  score_geral: number;
  classificacao: 'EXCELENTE' | 'BOM' | 'REGULAR' | 'NECESSITA_CORRECAO';
  proximos_passos: string[];
  // V2 fields (optional)
  cadeia_de_movimento?: Array<{ fase: string; descricao: string }>;
  pontos_de_atencao?: Array<{ item: string; severidade: string; sugestao: string }>;
  conclusao?: string;
  recomendacoes_top3?: Array<{ prioridade: number; acao: string; motivo: string }>;
}

interface MotorAnalysisItem {
  joint: string;
  label: string;
  movement: string;
  rom: {
    value: number;
    unit: string;
    min?: number;
    max?: number;
    startAngle?: number;
    peakAngle?: number;
    returnAngle?: number;
    eccentricControl?: 'controlled' | 'dropped' | 'unknown';
    note?: string;
    classification: string;
    classificationLabel: string;
  };
  peak_contraction?: number | null;
  symmetry?: { diff: number; unit: string; classification: string } | number | null;
}

interface StabilizerAnalysisItem {
  joint: string;
  label: string;
  expected_state: string;
  instability_meaning?: string;
  stability_mode?: 'rigid' | 'controlled' | 'functional';
  variation: { value: number; unit: string; classification: string; classificationLabel: string };
  interpretation: string;
  corrective_exercises: string[];
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
  // V2 pipeline data
  pipelineVersion?: string;
  motorScore?: number;
  stabilizerScore?: number;
  motorAnalysis?: MotorAnalysisItem[];
  stabilizerAnalysis?: StabilizerAnalysisItem[];
  mediapipeConfidence?: number;
  muscles?: { primary?: string[]; secondary?: string[]; stabilizers?: string[] };
}

export default function BiomechanicsDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlVideoId = searchParams?.get('videoId');

  const [videoId, setVideoId] = useState(urlVideoId || '');
  const [equipmentConstraint, setEquipmentConstraint] = useState('none');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [correctivePlan, setCorrectivePlan] = useState<any>(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);
  // rawData: formato snake_case do banco/API para BiomechanicsAnalysisView
  const [rawData, setRawData] = useState<Record<string, unknown> | null>(null);

  const CONSTRAINT_OPTIONS = [
    { value: 'none', label: 'Sem limitação' },
    { value: 'safety_bars', label: 'Barras de segurança' },
    { value: 'machine_guided', label: 'Máquina guiada (Smith)' },
    { value: 'space_limited', label: 'Espaço limitado' },
    { value: 'pain_limited', label: 'Dor limitando amplitude' },
    { value: 'rehab', label: 'Em reabilitação' },
  ];

  // Transforma ai_analysis salvo no banco para o formato AnalysisResult do dashboard
  const transformDbToAnalysisResult = (videoId: string, dbRecord: any): AnalysisResult | null => {
    let aiData = dbRecord.ai_analysis;

    // Deep parse: ai_analysis pode estar serializado como string
    for (let i = 0; i < 3; i++) {
      if (typeof aiData === 'string') {
        try { aiData = JSON.parse(aiData); } catch { break; }
      } else { break; }
    }

    if (!aiData || typeof aiData !== 'object') return null;

    const classifications = aiData.classifications_detail || [];
    const summary = aiData.classification_summary || { excellent: 0, good: 0, acceptable: 0, warning: 0, danger: 0 };

    // V2 pipeline pode ter summary.motor e summary.stabilizer ao inves do formato flat
    const flatSummary = summary.excellent !== undefined ? summary : {
      excellent: (summary.motor?.excellent || 0) + (summary.stabilizer?.excellent || 0),
      good: (summary.motor?.good || 0) + (summary.stabilizer?.good || 0),
      acceptable: (summary.motor?.acceptable || 0) + (summary.stabilizer?.acceptable || 0),
      warning: (summary.motor?.warning || 0) + (summary.stabilizer?.warning || 0),
      danger: (summary.motor?.danger || 0) + (summary.stabilizer?.danger || 0),
    };

    return {
      success: true,
      videoId,
      analysis: {
        overall_score: aiData.overall_score || 0,
        exercise_type: aiData.exercise_type || dbRecord.movement_pattern || 'exercicio',
        timestamp: aiData.timestamp || dbRecord.created_at || new Date().toISOString(),
        equipment_constraint: aiData.equipment_constraint || null,
        equipment_constraint_label: aiData.equipment_constraint_label || null,
        classification_summary: flatSummary,
        classifications_detail: classifications,
        rag_topics_used: aiData.rag_topics_used || [],
        frames_analyzed: aiData.frames_analyzed || 0,
      },
      diagnostic: {
        score: aiData.overall_score || 0,
        summary: flatSummary,
        problems: classifications.filter((c: Classification) =>
          ['warning', 'danger'].includes(c.classification) && !c.is_informative
        ),
        positive: classifications.filter((c: Classification) =>
          ['excellent', 'good'].includes(c.classification)
        ),
      },
      report: aiData.llm_report || null,
      // V2 pipeline data
      pipelineVersion: aiData.pipeline_version || undefined,
      motorScore: aiData.motor_score,
      stabilizerScore: aiData.stabilizer_score,
      motorAnalysis: aiData.motor_analysis || [],
      stabilizerAnalysis: aiData.stabilizer_analysis || [],
      mediapipeConfidence: aiData.mediapipe_confidence,
      muscles: aiData.muscles || undefined,
    };
  };

  // Buscar análise existente do banco (sem re-executar pipeline)
  const loadExistingAnalysis = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/nfv/videos/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Vídeo não encontrado (${response.status})`);
      }

      const dbRecord = data.analysis;

      if (!dbRecord || !dbRecord.ai_analysis) {
        setError('Vídeo encontrado mas ainda não foi analisado. Clique em "Re-analisar" para executar a análise.');
        return;
      }

      const result = transformDbToAnalysisResult(id, dbRecord);
      if (!result) {
        setError('Dados de análise corrompidos. Clique em "Re-analisar" para gerar nova análise.');
        return;
      }

      setAnalysis(result);
      // Parsear ai_analysis para rawData (formato snake_case para BiomechanicsAnalysisView)
      let rawAiData: unknown = dbRecord.ai_analysis;
      for (let i = 0; i < 3; i++) {
        if (typeof rawAiData === 'string') {
          try { rawAiData = JSON.parse(rawAiData); } catch { break; }
        } else break;
      }
      setRawData(rawAiData as Record<string, unknown>);
    } catch (err) {
      console.error('[Dashboard] Erro ao carregar análise:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar análise');
    } finally {
      setLoading(false);
    }
  };

  // Auto-load quando videoId vem da URL — busca existente, NÃO re-analisa
  useEffect(() => {
    if (urlVideoId) {
      setVideoId(urlVideoId);
      loadExistingAnalysis(urlVideoId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlVideoId]);

  // Re-analisar: executa pipeline completo (requer MediaPipe/Ollama no servidor)
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
        // Erro 503: Vercel sem ANALYSIS_SERVER_URL configurado
        if (response.status === 503) {
          setError(
            '🚫 A análise de vídeo requer FFmpeg, Python e MediaPipe que não estão disponíveis em ambientes serverless como a Vercel.\n\n' +
            '💡 Solução: Configure ANALYSIS_SERVER_URL na Vercel apontando para seu servidor local via Cloudflare Tunnel.\n\n' +
            '📦 Setup Local:\n' +
            '1. Inicie o servidor: npm run dev\n' +
            '2. Instale o túnel: winget install Cloudflare.cloudflared\n' +
            '3. Crie o túnel: cloudflared tunnel --url http://localhost:3000\n' +
            '4. Adicione ANALYSIS_SERVER_URL=<url-do-tunel> nas env vars da Vercel\n\n' +
            '☁️ Produção: AWS EC2 + Docker, Google Cloud Run, DigitalOcean Droplet + Docker, VPS próprio com Docker Compose'
          );
          return;
        }

        // Erro 500: Servidor local sem dependências (MediaPipe, FFmpeg, Ollama)
        if (response.status === 500) {
          setError(
            '🚫 A análise de vídeo requer FFmpeg, Python e MediaPipe que não estão disponíveis em ambientes serverless como a Vercel.\n\n' +
            '📦 Setup Local:\n' +
            '1. Clone o repositório\n' +
            '2. pip install mediapipe==0.10.31 opencv-python numpy\n' +
            '3. Acesse http://localhost:3000\n' +
            '4. Análise funcionará automaticamente\n\n' +
            '☁️ Produção: AWS EC2 + Docker, Google Cloud Run, DigitalOcean Droplet + Docker, VPS próprio com Docker Compose'
          );
          return;
        }

        throw new Error(data.error || data.details || `API error: ${response.status}`);
      }

      setAnalysis(data);
      setRawData(data as Record<string, unknown>);
    } catch (err) {
      console.error('[Dashboard] Erro na re-análise:', err);
      setError(err instanceof Error ? err.message : 'Servidor de analise indisponivel');
    } finally {
      setLoading(false);
    }
  };

  // Buscar: primeiro tenta carregar existente, se não tiver, analisa
  const handleAnalyzeClick = async () => {
    const id = videoId.trim();
    if (!id) {
      setError('Por favor, insira um ID de vídeo');
      return;
    }
    // Tenta carregar existente primeiro
    await loadExistingAnalysis(id);
  };

  // Carregar/Gerar plano corretivo
  const handleGeneratePlan = async () => {
    const id = videoId.trim();
    if (!id) return;

    setPlanLoading(true);
    setPlanError(null);

    try {
      // Primeiro tenta GET (plano existente)
      const getRes = await fetch(`/api/nfv/corrective-plan?analysisId=${id}`);
      if (getRes.ok) {
        const getData = await getRes.json();
        if (getData.plan?.semanas?.length > 0) {
          setCorrectivePlan(getData.plan);
          setPlanLoading(false);
          return;
        }
      }

      // Se não existe, gera via POST
      const postRes = await fetch('/api/nfv/corrective-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisId: id, force: true }),
      });

      const postData = await postRes.json();
      if (!postRes.ok) {
        throw new Error(postData.error || 'Erro ao gerar plano');
      }

      setCorrectivePlan(postData.plan);
    } catch (err) {
      console.error('[Dashboard] Erro no plano corretivo:', err);
      setPlanError(err instanceof Error ? err.message : 'Erro ao gerar plano corretivo');
    } finally {
      setPlanLoading(false);
    }
  };

  // Tentar carregar plano existente quando análise carrega
  useEffect(() => {
    if (analysis && videoId) {
      // Verifica se tem problemas que justifiquem plano corretivo
      const hasProblems = analysis.diagnostic.problems.length > 0;
      if (hasProblems) {
        // Tenta carregar plano existente (silencioso, sem loading)
        fetch(`/api/nfv/corrective-plan?analysisId=${videoId}`)
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (data?.plan?.semanas?.length > 0) {
              setCorrectivePlan(data.plan);
            }
          })
          .catch(() => {}); // silencioso
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysis]);

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
            <div className="flex items-center gap-2">
              <button
                onClick={() => analyzeVideo(videoId)}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600/10 border border-cyan-600/20 text-cyan-400 text-sm font-medium hover:bg-cyan-600/20 transition-colors disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4" />
                Re-analisar
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/10 border border-red-600/20 text-red-400 text-sm font-medium hover:bg-red-600/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Excluir Video
              </button>
            </div>
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
            <p className="font-semibold whitespace-pre-line">Erro: {error}</p>
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
                  {Number(analysis.analysis.overall_score).toFixed(1)}
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

            {/* V2: Motor / Stabilizer Score Breakdown */}
            {analysis.motorScore != null && analysis.stabilizerScore != null && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-800 rounded-lg border border-cyan-700/30 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-slate-400 text-sm font-semibold">PIPELINE</p>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-cyan-900/40 text-cyan-300 border border-cyan-700/30">
                      {(analysis.pipelineVersion || 'v2').toUpperCase()}
                    </span>
                  </div>
                  {analysis.mediapipeConfidence != null && (
                    <p className="text-slate-400 text-sm">
                      Confianca MediaPipe: <span className="text-cyan-400 font-semibold">{(Number(analysis.mediapipeConfidence) * 100).toFixed(0)}%</span>
                    </p>
                  )}
                </div>
                <div className={`rounded-lg border border-slate-700 p-6 ${getScoreBgColor(analysis.motorScore)}`}>
                  <p className="text-slate-600 text-sm font-semibold mb-1">SCORE MOTOR (60%)</p>
                  <p className={`text-3xl font-bold ${getScoreColor(analysis.motorScore)}`}>
                    {Number(analysis.motorScore).toFixed(1)}<span className="text-lg">/10</span>
                  </p>
                </div>
                <div className={`rounded-lg border border-slate-700 p-6 ${getScoreBgColor(analysis.stabilizerScore)}`}>
                  <p className="text-slate-600 text-sm font-semibold mb-1">SCORE ESTABILIZADOR (40%)</p>
                  <p className={`text-3xl font-bold ${getScoreColor(analysis.stabilizerScore)}`}>
                    {Number(analysis.stabilizerScore).toFixed(1)}<span className="text-lg">/10</span>
                  </p>
                </div>
              </div>
            )}

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
                          <p className="font-bold text-white">{safeRender(problem.label || problem.criterion)}</p>
                          <p className="text-red-300 text-sm">
                            Valor: <span className="font-mono font-semibold">{formatValueStr(safeRender(problem.value))}</span>
                          </p>
                          <p className="text-red-300 text-sm mt-1">
                            Classificação: <span className="font-semibold">{safeRender(problem.classification_label || problem.classification)}</span>
                          </p>
                          {problem.note && (
                            <p className="text-red-300/70 text-xs mt-1 italic">{safeRender(problem.note)}</p>
                          )}
                          {problem.rag_topics && problem.rag_topics.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {problem.rag_topics.map((topic, i) => (
                                <span
                                  key={i}
                                  className="bg-red-900/40 text-red-300 text-xs px-2 py-1 rounded"
                                >
                                  {safeRender(topic)}
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
                          <p className="font-bold text-white">{safeRender(positive.label || positive.criterion)}</p>
                          <p className="text-green-300 text-sm">
                            Valor: <span className="font-mono font-semibold">{formatValueStr(safeRender(positive.value))}</span>
                          </p>
                          <p className="text-green-300 text-sm mt-1">
                            Classificação: <span className="font-semibold">{safeRender(positive.classification_label || positive.classification)}</span>
                          </p>
                          {positive.note && (
                            <p className="text-green-300/70 text-xs mt-1 italic">{safeRender(positive.note)}</p>
                          )}
                          {positive.rag_topics && positive.rag_topics.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {positive.rag_topics.map((topic, i) => (
                                <span
                                  key={i}
                                  className="bg-green-900/40 text-green-300 text-xs px-2 py-1 rounded"
                                >
                                  {safeRender(topic)}
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

            {/* Análise Detalhada — layout unificado com comunidades/videos */}
            {rawData && (
              <div className="mt-8">
                <BiomechanicsAnalysisView
                  data={rawData}
                  plan={correctivePlan}
                  onGeneratePlan={handleGeneratePlan}
                  planLoading={planLoading}
                  planError={planError}
                />
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
          <div className="text-center py-16">
            <Zap className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Nenhuma análise carregada</h3>
            <p className="text-slate-400 mb-2">
              Insira um ID de vídeo no campo acima e clique em &quot;Analisar&quot; para visualizar
            </p>
            <p className="text-slate-500 text-sm mb-8">
              ou escolha um vídeo já analisado na lista abaixo
            </p>
            <Link
              href="/biomechanics/videos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 border border-slate-700 hover:border-cyan-500/50 rounded-lg text-white font-semibold transition"
            >
              <Video className="w-4 h-4 text-cyan-400" />
              Ver vídeos analisados
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </Link>
            <p className="text-slate-600 text-xs mt-8">
              Para nova análise, configure <code className="text-slate-500">ANALYSIS_SERVER_URL</code> na Vercel
            </p>
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
