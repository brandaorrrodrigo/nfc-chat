'use client';

/**
 * AnalysisQueueItem - Item na fila de revisao admin
 */

import React from 'react';
import { Clock, User, Video, AlertTriangle, CheckCircle, XCircle, Eye, Loader2 } from 'lucide-react';
import MovementPatternBadge from './MovementPatternBadge';

interface AnalysisQueueItemProps {
  analysis: {
    id: string;
    user_name: string;
    movement_pattern: string;
    user_description?: string;
    status: string;
    created_at: string;
    arena_slug: string;
  };
  onSelect?: (id: string) => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING_AI: { label: 'Aguardando IA', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', icon: <Clock className="w-3 h-3" /> },
  PROCESSING: { label: 'Processando', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20', icon: <Loader2 className="w-3 h-3 animate-spin" /> },
  AI_ANALYZED: { label: 'IA Concluiu', color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20', icon: <Eye className="w-3 h-3" /> },
  PENDING_REVIEW: { label: 'Pendente Revisao', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: <AlertTriangle className="w-3 h-3" /> },
  APPROVED: { label: 'Aprovado', color: 'text-green-400 bg-green-400/10 border-green-400/20', icon: <CheckCircle className="w-3 h-3" /> },
  REJECTED: { label: 'Rejeitado', color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: <XCircle className="w-3 h-3" /> },
  REVISION_NEEDED: { label: 'Revisao Necessaria', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20', icon: <AlertTriangle className="w-3 h-3" /> },
  ERROR: { label: 'Erro', color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: <AlertTriangle className="w-3 h-3" /> },
};

export default function AnalysisQueueItem({ analysis, onSelect }: AnalysisQueueItemProps) {
  const statusCfg = STATUS_CONFIG[analysis.status] || STATUS_CONFIG.PENDING_AI;

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      onClick={() => onSelect?.(analysis.id)}
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-600 cursor-pointer transition-all"
    >
      <div className="flex items-start gap-3">
        {/* Video icon */}
        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
          <Video className="w-5 h-5 text-zinc-500" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <MovementPatternBadge pattern={analysis.movement_pattern} size="sm" />
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusCfg.color}`}>
              {statusCfg.icon}
              {statusCfg.label}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mb-1">
            <User className="w-3 h-3 text-zinc-500" />
            <span className="text-xs text-zinc-400">{analysis.user_name}</span>
          </div>

          {analysis.user_description && (
            <p className="text-xs text-zinc-500 line-clamp-1 mb-1.5">
              {analysis.user_description}
            </p>
          )}

          <div className="flex items-center gap-3 text-[10px] text-zinc-600">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(analysis.created_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
