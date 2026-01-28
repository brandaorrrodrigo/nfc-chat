'use client';

/**
 * ChatHeader - Header com Persona IA
 * ====================================
 *
 * Header do chat com Dra. Sofia e contexto da usuária
 * Design feminino e acolhedor 💕✨
 */

import React from 'react';
import {
  Phone,
  Video,
  MoreVertical,
  Calendar,
  Target,
  Activity,
  Heart,
  Moon,
  Droplets,
  Apple,
  Sparkles,
} from 'lucide-react';
import ContextChip, { ChipColor } from './ContextChip';

export interface UserContext {
  icon: React.ElementType;
  label: string;
  color: ChipColor;
}

export interface ChatHeaderProps {
  aiName?: string;
  aiEmoji?: string;
  aiSpecialty?: string;
  isOnline?: boolean;
  contexts?: UserContext[];
  onCall?: () => void;
  onVideo?: () => void;
  onMore?: () => void;
}

const defaultContexts: UserContext[] = [
  { icon: Calendar, label: 'Ciclo: Fase Folicular 🌸', color: 'pink' },
  { icon: Target, label: 'Meta: -5kg 🎯', color: 'teal' },
  { icon: Activity, label: 'Treino: 4x/semana 💪', color: 'blue' },
  { icon: Heart, label: 'Low Carb 🥗', color: 'purple' },
];

export default function ChatHeader({
  aiName = 'Dra. Sofia',
  aiEmoji = '✨',
  aiSpecialty = 'Especialista em Nutrição Feminina',
  isOnline = true,
  contexts = defaultContexts,
  onCall,
  onVideo,
  onMore,
}: ChatHeaderProps) {
  return (
    <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm px-6 py-4">
      <div className="flex items-center gap-4">
        {/* Avatar IA Animado */}
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-400 to-purple-500 animate-pulse blur-md opacity-50" />

          {/* Avatar */}
          <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 via-emerald-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {aiEmoji}
          </div>

          {/* Status online */}
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm" />
          )}
        </div>

        {/* Info da IA */}
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            {aiName}
            <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-teal-500 to-purple-500 text-white font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              IA
            </span>
          </h2>
          <p className="text-sm text-gray-600 flex items-center gap-1.5">
            {isOnline ? (
              <>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Online</span>
              </>
            ) : (
              <span className="text-gray-400">Offline</span>
            )}
            <span className="text-gray-400">•</span>
            <span>{aiSpecialty} 💕</span>
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-1">
          <button
            onClick={onCall}
            className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors group"
            title="Ligar"
          >
            <Phone className="w-5 h-5 text-gray-500 group-hover:text-teal-500 transition-colors" />
          </button>
          <button
            onClick={onVideo}
            className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors group"
            title="Vídeo"
          >
            <Video className="w-5 h-5 text-gray-500 group-hover:text-teal-500 transition-colors" />
          </button>
          <button
            onClick={onMore}
            className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors group"
            title="Mais opções"
          >
            <MoreVertical className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
          </button>
        </div>
      </div>

      {/* Context Bar */}
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {contexts.map((context, idx) => (
          <ContextChip
            key={idx}
            icon={context.icon}
            label={context.label}
            color={context.color}
          />
        ))}
      </div>

      {/* Personalização Message */}
      <div className="mt-3 p-3 bg-gradient-to-r from-pink-50 via-purple-50 to-teal-50 rounded-xl border border-pink-100">
        <p className="text-xs text-gray-600 flex items-center gap-2">
          <span className="text-base">💡</span>
          <span>
            Dra. Sofia conhece seu perfil completo: ciclo menstrual, metas, preferências e histórico.
            <span className="font-medium text-teal-600 ml-1 cursor-pointer hover:underline">
              Editar perfil →
            </span>
          </span>
        </p>
      </div>
    </div>
  );
}

// Versão compacta para mobile
export function ChatHeaderCompact({
  aiName = 'Dra. Sofia',
  aiEmoji = '✨',
  isOnline = true,
  onBack,
}: {
  aiName?: string;
  aiEmoji?: string;
  isOnline?: boolean;
  onBack?: () => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white">
      {onBack && (
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          ←
        </button>
      )}

      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 via-emerald-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
          {aiEmoji}
        </div>
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        )}
      </div>

      <div className="flex-1">
        <h2 className="font-semibold text-gray-900 text-sm">{aiName} 💕</h2>
        <p className="text-xs text-gray-500">
          {isOnline ? '🟢 Online agora' : 'Offline'}
        </p>
      </div>
    </div>
  );
}
