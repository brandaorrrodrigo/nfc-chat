'use client';

/**
 * SmartFAB - Floating Action Button Inteligente
 *
 * Comportamento baseado em autenticação:
 * - Não logado: "Entrar para participar" → link para login
 * - Logado: "Responder" ou "Criar tópico" → ação real
 *
 * Estilo: Cyberpunk com verde neon
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { Send, LogIn, Plus, X, MessageSquare, PenSquare } from 'lucide-react';

// ========================================
// TIPOS
// ========================================

interface SmartFABProps {
  isAuthenticated: boolean;
  variant?: 'responder' | 'criar' | 'ambos';
  onResponder?: () => void;
  onCriarTopico?: () => void;
  onLoginRequired?: () => void;
}

// ========================================
// COMPONENTE: FAB Expandido (logado)
// ========================================

function ExpandedFAB({
  variant,
  onResponder,
  onCriarTopico,
}: {
  variant: 'responder' | 'criar' | 'ambos';
  onResponder?: () => void;
  onCriarTopico?: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  // FAB simples para variante única
  if (variant === 'responder') {
    return (
      <button
        onClick={onResponder}
        className={`
          fixed bottom-6 right-6 z-50
          flex items-center gap-2
          px-5 py-3
          bg-[#00ff88] hover:bg-[#00ff88]/90
          text-black font-bold
          rounded-full
          shadow-[0_0_30px_rgba(0,255,136,0.5)]
          hover:shadow-[0_0_40px_rgba(0,255,136,0.7)]
          hover:scale-105
          transition-all duration-300
        `}
      >
        <Send className="w-5 h-5" />
        <span>Responder</span>
      </button>
    );
  }

  if (variant === 'criar') {
    return (
      <button
        onClick={onCriarTopico}
        className={`
          fixed bottom-6 right-6 z-50
          flex items-center gap-2
          px-5 py-3
          bg-[#00ff88] hover:bg-[#00ff88]/90
          text-black font-bold
          rounded-full
          shadow-[0_0_30px_rgba(0,255,136,0.5)]
          hover:shadow-[0_0_40px_rgba(0,255,136,0.7)]
          hover:scale-105
          transition-all duration-300
        `}
      >
        <PenSquare className="w-5 h-5" />
        <span>Criar Tópico</span>
      </button>
    );
  }

  // FAB expandível para ambas opções
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Opções expandidas */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 flex flex-col gap-3 items-end animate-fadeIn">
          {/* Criar Tópico */}
          <button
            onClick={() => {
              setIsExpanded(false);
              onCriarTopico?.();
            }}
            className={`
              flex items-center gap-2
              px-4 py-2.5
              bg-zinc-900 hover:bg-zinc-800
              border border-zinc-700
              text-white font-medium
              rounded-full
              shadow-lg
              transition-all
              whitespace-nowrap
            `}
          >
            <PenSquare className="w-4 h-4 text-[#00ff88]" />
            <span>Criar Tópico</span>
          </button>

          {/* Responder */}
          <button
            onClick={() => {
              setIsExpanded(false);
              onResponder?.();
            }}
            className={`
              flex items-center gap-2
              px-4 py-2.5
              bg-zinc-900 hover:bg-zinc-800
              border border-zinc-700
              text-white font-medium
              rounded-full
              shadow-lg
              transition-all
              whitespace-nowrap
            `}
          >
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>Responder</span>
          </button>
        </div>
      )}

      {/* FAB principal */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          flex items-center justify-center
          w-14 h-14
          rounded-full
          shadow-[0_0_30px_rgba(0,255,136,0.5)]
          hover:shadow-[0_0_40px_rgba(0,255,136,0.7)]
          transition-all duration-300
          ${isExpanded
            ? 'bg-zinc-800 hover:bg-zinc-700 rotate-45'
            : 'bg-[#00ff88] hover:bg-[#00ff88]/90 hover:scale-105'
          }
        `}
      >
        {isExpanded ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Plus className="w-6 h-6 text-black" />
        )}
      </button>

      {/* Animação CSS */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

// ========================================
// COMPONENTE: FAB para Não Logado
// ========================================

function LoginFAB({ onLoginRequired }: { onLoginRequired?: () => void }) {
  return (
    <button
      onClick={onLoginRequired}
      className={`
        fixed bottom-6 right-6 z-50
        flex items-center gap-2
        px-5 py-3
        bg-zinc-900 hover:bg-zinc-800
        border border-[#00ff88]/50 hover:border-[#00ff88]
        text-[#00ff88] font-semibold
        rounded-full
        shadow-[0_0_20px_rgba(0,255,136,0.2)]
        hover:shadow-[0_0_30px_rgba(0,255,136,0.4)]
        hover:scale-105
        transition-all duration-300
      `}
    >
      <LogIn className="w-5 h-5" />
      <span className="hidden sm:inline">Entrar para participar</span>
      <span className="sm:hidden">Entrar</span>
    </button>
  );
}

// ========================================
// COMPONENTE PRINCIPAL: SmartFAB
// ========================================

export default function SmartFAB({
  isAuthenticated,
  variant = 'responder',
  onResponder,
  onCriarTopico,
  onLoginRequired,
}: SmartFABProps) {
  if (!isAuthenticated) {
    return <LoginFAB onLoginRequired={onLoginRequired} />;
  }

  return (
    <ExpandedFAB
      variant={variant}
      onResponder={onResponder}
      onCriarTopico={onCriarTopico}
    />
  );
}
