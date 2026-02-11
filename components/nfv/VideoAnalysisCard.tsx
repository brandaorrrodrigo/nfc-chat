'use client';

/**
 * VideoAnalysisCard - Card de analise publicada na galeria
 */

import React from 'react';
import { Play, ThumbsUp, Eye, Clock, User, Loader2, Bot, CheckCircle, AlertTriangle, Trash2, Share2 } from 'lucide-react';
import MovementPatternBadge from './MovementPatternBadge';

interface VideoAnalysisCardProps {
  analysis: {
    id: string;
    video_url: string;
    thumbnail_url?: string;
    movement_pattern: string;
    user_name: string;
    user_description?: string;
    status?: string;
    published_at?: string;
    created_at?: string;
    view_count: number;
    helpful_votes: number;
  };
  onClick?: () => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
}

// Badge de status do vídeo
function StatusBadge({ status }: { status?: string }) {
  switch (status) {
    case 'PENDING_AI':
      return (
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px]">
          <Loader2 className="w-3 h-3 animate-spin" />
          Na fila
        </div>
      );
    case 'AI_ANALYZED':
      return (
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px]">
          <Bot className="w-3 h-3" />
          Analisado
        </div>
      );
    case 'PROCESSING':
      return (
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[10px]">
          <Loader2 className="w-3 h-3 animate-spin" />
          Processando
        </div>
      );
    case 'APPROVED':
      return (
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px]">
          <CheckCircle className="w-3 h-3" />
          Aprovado
        </div>
      );
    case 'ERROR':
      return (
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px]">
          <AlertTriangle className="w-3 h-3" />
          Erro
        </div>
      );
    default:
      return null;
  }
}

export default function VideoAnalysisCard({ analysis, onClick, onDelete, onShare }: VideoAnalysisCardProps) {
  const formatDate = (date?: string) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffH = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffH < 1) return 'agora';
    if (diffH < 24) return `${diffH}h`;
    const diffD = Math.floor(diffH / 24);
    if (diffD < 7) return `${diffD}d`;
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <div
      onClick={onClick}
      className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden cursor-pointer hover:border-zinc-600 transition-all group"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-zinc-800">
        {analysis.thumbnail_url ? (
          <img
            src={analysis.thumbnail_url}
            alt={analysis.movement_pattern}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play className="w-10 h-10 text-zinc-600" />
          </div>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-colors">
          <div className="w-12 h-12 rounded-full bg-white/0 group-hover:bg-white/20 flex items-center justify-center transition-colors">
            <Play className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity ml-0.5" />
          </div>
        </div>

        {/* Badge de padrão */}
        <div className="absolute top-2 left-2">
          <MovementPatternBadge pattern={analysis.movement_pattern} size="sm" />
        </div>

        {/* Badge de status */}
        <div className="absolute bottom-2 left-2">
          <StatusBadge status={analysis.status} />
        </div>

        {/* Action buttons (top-right) — sempre visivel */}
        {(onDelete || (onShare && ['AI_ANALYZED', 'APPROVED'].includes(analysis.status || ''))) && (
          <div className="absolute top-2 right-2 flex items-center gap-1">
            {onShare && ['AI_ANALYZED', 'APPROVED'].includes(analysis.status || '') && (
              <button
                onClick={(e) => { e.stopPropagation(); onShare(analysis.id); }}
                className="p-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-zinc-300 hover:text-white hover:bg-black/80 transition-colors"
                title="Compartilhar"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(analysis.id); }}
                className="p-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-zinc-300 hover:text-red-400 hover:bg-black/80 transition-colors"
                title="Excluir"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

      </div>

      {/* Info */}
      <div className="p-3">
        {/* User */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <User className="w-3 h-3 text-zinc-500" />
          <span className="text-xs text-zinc-400 truncate">{analysis.user_name}</span>
        </div>

        {/* Description */}
        {analysis.user_description && (
          <p className="text-xs text-zinc-300 line-clamp-2 mb-2">
            {analysis.user_description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 text-[10px] text-zinc-600">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {analysis.view_count}
          </span>
          <span className="flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" />
            {analysis.helpful_votes}
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <Clock className="w-3 h-3" />
            {formatDate(analysis.published_at || analysis.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
}
