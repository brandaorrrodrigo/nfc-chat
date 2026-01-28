'use client';

/**
 * MessageBubble - Bolha de Mensagem
 * ==================================
 *
 * Mensagens de chat com design premium feminino
 * Suporte a reações, quick replies e muito mais 💕✨
 */

import React, { useState } from 'react';
import { Heart, Star, ThumbsUp, Copy, Check, Share2, MoreHorizontal } from 'lucide-react';
import { QuickReplyGroup } from './QuickReply';

export interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  time: string;
  reactions?: {
    hearts: number;
    stars: number;
    thumbs: number;
  };
  quickReplies?: { text: string; emoji?: string; highlighted?: boolean }[];
  isNew?: boolean;
}

export interface MessageBubbleProps {
  message: Message;
  aiName?: string;
  aiEmoji?: string;
  userName?: string;
  userPhoto?: string;
  onQuickReply?: (text: string) => void;
  onReaction?: (messageId: string, type: 'heart' | 'star' | 'thumbs') => void;
}

export default function MessageBubble({
  message,
  aiName = 'Dra. Sofia',
  aiEmoji = '✨',
  userName = 'Você',
  userPhoto,
  onQuickReply,
  onReaction,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (message.type === 'ai') {
    return (
      <div
        className={`flex gap-4 max-w-3xl ${message.isNew ? 'animate-slideIn' : ''}`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Avatar IA */}
        <div className="relative shrink-0">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-400 to-purple-500 animate-pulse blur-md opacity-40" />
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 via-emerald-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {aiEmoji}
          </div>
          {/* Status online */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Name */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-white">{aiName}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white font-medium">
              IA 💕
            </span>
          </div>

          {/* Bubble */}
          <div className="relative group">
            <div className="bg-purple-500/20 backdrop-blur-sm rounded-2xl rounded-tl-sm p-4 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
              <p className="text-white leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            </div>

            {/* Actions overlay */}
            {showActions && (
              <div className="absolute -top-2 right-2 flex items-center gap-1 bg-slate-800/90 backdrop-blur-sm rounded-full shadow-lg border border-purple-500/30 px-2 py-1 animate-fadeIn">
                <button
                  onClick={handleCopy}
                  className="p-1.5 hover:bg-purple-500/20 rounded-full transition-colors"
                  title="Copiar"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-purple-300" />
                  )}
                </button>
                <button
                  className="p-1.5 hover:bg-purple-500/20 rounded-full transition-colors"
                  title="Compartilhar"
                >
                  <Share2 className="w-4 h-4 text-purple-300" />
                </button>
                <button
                  className="p-1.5 hover:bg-purple-500/20 rounded-full transition-colors"
                  title="Mais"
                >
                  <MoreHorizontal className="w-4 h-4 text-purple-300" />
                </button>
              </div>
            )}
          </div>

          {/* Quick Replies */}
          {message.quickReplies && message.quickReplies.length > 0 && (
            <QuickReplyGroup
              replies={message.quickReplies}
              onSelect={(text) => onQuickReply?.(text)}
            />
          )}

          {/* Reactions & Time */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onReaction?.(message.id, 'heart')}
                className="p-1.5 hover:bg-pink-500/20 rounded-full transition-colors group"
              >
                <Heart className="w-4 h-4 text-purple-400 group-hover:text-pink-400 transition-colors" />
              </button>
              <button
                onClick={() => onReaction?.(message.id, 'star')}
                className="p-1.5 hover:bg-amber-500/20 rounded-full transition-colors group"
              >
                <Star className="w-4 h-4 text-purple-400 group-hover:text-amber-400 transition-colors" />
              </button>
              <button
                onClick={() => onReaction?.(message.id, 'thumbs')}
                className="p-1.5 hover:bg-cyan-500/20 rounded-full transition-colors group"
              >
                <ThumbsUp className="w-4 h-4 text-purple-400 group-hover:text-cyan-400 transition-colors" />
              </button>
            </div>
            <span className="text-xs text-purple-300/60">{message.time}</span>
          </div>
        </div>
      </div>
    );
  }

  // User message
  return (
    <div className={`flex gap-4 max-w-3xl ml-auto flex-row-reverse ${message.isNew ? 'animate-slideIn' : ''}`}>
      {/* User Avatar */}
      <div className="shrink-0">
        {userPhoto ? (
          <img
            src={userPhoto}
            alt={userName}
            className="w-10 h-10 rounded-full object-cover border-2 border-purple-400/50 shadow-lg"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg">
            {userName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Bubble */}
      <div>
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-2xl rounded-tr-sm p-4 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]">
          <p className="whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        </div>
        <div className="flex justify-end mt-1">
          <span className="text-xs text-purple-300/60">{message.time}</span>
        </div>
      </div>
    </div>
  );
}

// Componente de data separador
export function DateSeparator({ date }: { date: string }) {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px bg-purple-500/30" />
      <span className="text-xs text-purple-300 font-medium px-3 py-1 bg-purple-500/20 backdrop-blur-sm rounded-full border border-purple-500/30">
        {date}
      </span>
      <div className="flex-1 h-px bg-purple-500/30" />
    </div>
  );
}

// Componente de sistema/notificação
export function SystemMessage({ content, emoji }: { content: string; emoji?: string }) {
  return (
    <div className="flex justify-center my-4">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full text-sm text-purple-200">
        {emoji && <span>{emoji}</span>}
        {content}
      </div>
    </div>
  );
}
