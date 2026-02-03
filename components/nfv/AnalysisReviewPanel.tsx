'use client';

/**
 * AnalysisReviewPanel - Painel de revisao admin para analises de video
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Loader2, Save } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import MovementPatternBadge from './MovementPatternBadge';
import { getAdminReviewChecklist } from '@/lib/biomechanics/movement-patterns';

interface AnalysisData {
  id: string;
  video_url: string;
  thumbnail_url?: string;
  movement_pattern: string;
  user_name: string;
  user_description?: string;
  status: string;
  ai_analysis?: Record<string, unknown>;
  ai_confidence?: number;
  admin_notes?: string;
  created_at: string;
}

interface AnalysisReviewPanelProps {
  analysisId: string;
  reviewerId: string;
  onBack?: () => void;
  onReviewComplete?: () => void;
}

export default function AnalysisReviewPanel({
  analysisId,
  reviewerId,
  onBack,
  onReviewComplete,
}: AnalysisReviewPanelProps) {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [adminNotes, setAdminNotes] = useState('');
  const [editedAnalysis, setEditedAnalysis] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  const fetchAnalysis = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/nfv/videos/${analysisId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setAnalysis(data.analysis);
      setAdminNotes(data.analysis.admin_notes || '');

      if (data.analysis.ai_analysis) {
        setEditedAnalysis(JSON.stringify(data.analysis.ai_analysis, null, 2));
      }

      // Inicializar checklist
      const items = getAdminReviewChecklist(data.analysis.movement_pattern);
      const initial: Record<string, boolean> = {};
      items.forEach(item => { initial[item] = false; });
      setChecklist(initial);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar analise');
    } finally {
      setLoading(false);
    }
  }, [analysisId]);

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  const handleAction = async (action: 'approve' | 'reject' | 'revision') => {
    setSubmitting(true);
    setError(null);

    try {
      let publishedAnalysis;
      try {
        publishedAnalysis = editedAnalysis ? JSON.parse(editedAnalysis) : analysis?.ai_analysis;
      } catch {
        setError('JSON da analise editada invalido');
        setSubmitting(false);
        return;
      }

      const res = await fetch(`/api/nfv/analysis/${analysisId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          reviewerId,
          publishedAnalysis: action === 'approve' ? publishedAnalysis : undefined,
          notes: adminNotes || undefined,
          reason: action === 'reject' ? rejectionReason : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      onReviewComplete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na revisao');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-red-400">{error || 'Analise nao encontrada'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div>
          <h2 className="text-lg font-bold text-white">Revisao de Analise</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <MovementPatternBadge pattern={analysis.movement_pattern} size="sm" />
            <span className="text-xs text-zinc-500">por {analysis.user_name}</span>
          </div>
        </div>
      </div>

      {/* Video */}
      <VideoPlayer
        src={analysis.video_url}
        thumbnailUrl={analysis.thumbnail_url}
        className="max-h-80"
      />

      {/* User Description */}
      {analysis.user_description && (
        <div className="bg-zinc-800/50 rounded-xl p-3 border border-zinc-700">
          <p className="text-xs text-zinc-500 mb-1">Descricao do usuario:</p>
          <p className="text-sm text-zinc-300">{analysis.user_description}</p>
        </div>
      )}

      {/* AI Analysis */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-zinc-300">Analise da IA</h3>
          {analysis.ai_confidence !== undefined && (
            <span className="text-xs text-zinc-500">
              Confianca: {Math.round(analysis.ai_confidence * 100)}%
            </span>
          )}
        </div>
        <textarea
          value={editedAnalysis}
          onChange={(e) => setEditedAnalysis(e.target.value)}
          className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl p-3 text-xs text-zinc-200 font-mono resize-y h-48 focus:outline-none focus:border-purple-500/50"
          placeholder="Analise da IA em JSON..."
        />
        <p className="text-[10px] text-zinc-600 mt-1">Edite o JSON acima para ajustar a analise antes de aprovar</p>
      </div>

      {/* Checklist */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-300 mb-2">Checklist de Revisao</h3>
        <div className="space-y-1.5">
          {Object.entries(checklist).map(([item, checked]) => (
            <label
              key={item}
              className="flex items-start gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecklist(prev => ({ ...prev, [item]: e.target.checked }))}
                className="mt-0.5 rounded border-zinc-600 bg-zinc-800 text-purple-500 focus:ring-purple-500"
              />
              <span className={`text-xs ${checked ? 'text-zinc-300' : 'text-zinc-500'} group-hover:text-zinc-300 transition-colors`}>
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Admin Notes */}
      <div>
        <label className="block text-sm text-zinc-300 mb-2">Notas do Revisor</label>
        <textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          placeholder="Observacoes internas sobre a analise..."
          className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl p-3 text-sm text-zinc-200 resize-none h-20 focus:outline-none focus:border-purple-500/50"
        />
      </div>

      {/* Rejection Reason (condicional) */}
      <div>
        <label className="block text-sm text-zinc-300 mb-2">Motivo da Rejeicao (se rejeitar)</label>
        <input
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Video sem qualidade, exercicio nao identificavel..."
          className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl p-3 text-sm text-zinc-200 focus:outline-none focus:border-purple-500/50"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-3">
          <p className="text-xs text-red-300">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => handleAction('approve')}
          disabled={submitting}
          className="flex-1 py-3 rounded-xl bg-green-600/20 border border-green-600/30 text-green-300 font-semibold hover:bg-green-600/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
          Aprovar
        </button>

        <button
          onClick={() => handleAction('revision')}
          disabled={submitting}
          className="flex-1 py-3 rounded-xl bg-amber-600/20 border border-amber-600/30 text-amber-300 font-semibold hover:bg-amber-600/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
          Revisao
        </button>

        <button
          onClick={() => handleAction('reject')}
          disabled={submitting}
          className="flex-1 py-3 rounded-xl bg-red-600/20 border border-red-600/30 text-red-300 font-semibold hover:bg-red-600/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
          Rejeitar
        </button>
      </div>
    </div>
  );
}
