'use client';

/**
 * VideoAnalysisCard - Card de analise publicada na galeria
 */

import React from 'react';
import { Play, ThumbsUp, Eye, Clock, User } from 'lucide-react';
import MovementPatternBadge from './MovementPatternBadge';

interface VideoAnalysisCardProps {
  analysis: {
    id: string;
    video_url: string;
    thumbnail_url?: string;
    movement_pattern: string;
    user_name: string;
    user_description?: string;
    published_at?: string;
    view_count: number;
    helpful_votes: number;
    ai_confidence?: number;
  };
  onClick?: () => void;
}

export default function VideoAnalysisCard({ analysis, onClick }: VideoAnalysisCardProps) {
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

        {/* Badge */}
        <div className="absolute top-2 left-2">
          <MovementPatternBadge pattern={analysis.movement_pattern} size="sm" />
        </div>

        {/* Confidence */}
        {analysis.ai_confidence !== undefined && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-zinc-300">
            {Math.round(analysis.ai_confidence * 100)}% conf.
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
            {formatDate(analysis.published_at)}
          </span>
        </div>
      </div>
    </div>
  );
}
