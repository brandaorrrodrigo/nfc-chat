'use client';

/**
 * TypingIndicator - Indicador de Digitação
 * =========================================
 *
 * "Dra. Sofia está digitando..."
 * Animação suave e feminina
 */

import React from 'react';

export interface TypingIndicatorProps {
  name?: string;
  avatarEmoji?: string;
}

export default function TypingIndicator({
  name = 'Dra. Sofia',
  avatarEmoji = '✨'
}: TypingIndicatorProps) {
  return (
    <div className="flex gap-4 max-w-3xl animate-fadeIn">
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/30">
          {avatarEmoji}
        </div>
      </div>

      {/* Bubble */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl rounded-tl-sm p-4 shadow-sm border border-purple-500/30">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span
              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
              style={{ animationDelay: '0ms', animationDuration: '600ms' }}
            />
            <span
              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
              style={{ animationDelay: '150ms', animationDuration: '600ms' }}
            />
            <span
              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
              style={{ animationDelay: '300ms', animationDuration: '600ms' }}
            />
          </div>
          <span className="text-xs text-gray-400 ml-2">
            {name} está digitando...
          </span>
        </div>
      </div>
    </div>
  );
}
