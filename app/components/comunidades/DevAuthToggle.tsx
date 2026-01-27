'use client';

/**
 * DevAuthToggle - Toggle de Auth para Desenvolvimento
 *
 * Componente para testar rapidamente diferentes estados de autenticação.
 * APENAS PARA DESENVOLVIMENTO - Remover em produção.
 *
 * Permite alternar entre:
 * - Não logado
 * - Usuário Free
 * - Usuário Premium
 * - Founder
 */

import React, { useState } from 'react';
import { useComunidadesAuth } from './ComunidadesAuthContext';
import { Bug, X, User, Crown, Sparkles, LogOut } from 'lucide-react';

export default function DevAuthToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, login, logout } = useComunidadesAuth();

  // Não mostrar em produção
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-6 left-6 z-[200]
          w-12 h-12
          bg-amber-500 hover:bg-amber-400
          text-black
          rounded-full
          shadow-[0_0_20px_rgba(245,158,11,0.5)]
          hover:shadow-[0_0_30px_rgba(245,158,11,0.7)]
          transition-all duration-300
          flex items-center justify-center
          hover:scale-110
        "
        title="Dev Auth Toggle`}
      >
        <Bug className="w-5 h-5" />
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-20 left-6 z-[200] w-64 bg-zinc-900 border border-zinc-700 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-amber-500/10">
            <div className="flex items-center gap-2">
              <Bug className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-bold text-amber-500">Dev Auth</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-zinc-800 rounded transition-colors"
            >
              <X className="w-4 h-4 text-zinc-500" />
            </button>
          </div>

          {/* Current State */}
          <div className="px-4 py-3 border-b border-zinc-800">
            <p className="text-xs text-zinc-500 mb-1">Estado atual:</p>
            <p className="text-sm font-medium text-white">
              {isAuthenticated ? (
                <span className="flex items-center gap-2">
                  {user?.is_founder && <Crown className="w-4 h-4 text-yellow-400" />}
                  {user?.is_premium && !user?.is_founder && <Sparkles className="w-4 h-4 text-purple-400" />}
                  {!user?.is_premium && !user?.is_founder && <User className="w-4 h-4 text-zinc-400" />}
                  {user?.nome}
                </span>
              ) : (
                <span className="text-zinc-500">Não logado</span>
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="p-3 space-y-2">
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                ${!isAuthenticated
                  ? 'bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/50'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }
                transition-colors
              `}
            >
              <LogOut className="w-4 h-4" />
              Não logado
            </button>

            <button
              onClick={() => {
                login('free');
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                ${isAuthenticated && !user?.is_premium && !user?.is_founder
                  ? 'bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/50'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }
                transition-colors
              `}
            >
              <User className="w-4 h-4" />
              Usuário Free
            </button>

            <button
              onClick={() => {
                login('premium');
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                ${isAuthenticated && user?.is_premium && !user?.is_founder
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }
                transition-colors
              `}
            >
              <Sparkles className="w-4 h-4" />
              Usuário Premium
            </button>

            <button
              onClick={() => {
                login('founder');
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                ${isAuthenticated && user?.is_founder
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }
                transition-colors
              `}
            >
              <Crown className="w-4 h-4" />
              Founder
            </button>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-950">
            <p className="text-[10px] text-zinc-600 text-center">
              Apenas desenvolvimento
            </p>
          </div>
        </div>
      )}

      {/* Animation */}
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
    </>
  );
}
