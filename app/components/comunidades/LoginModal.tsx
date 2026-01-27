'use client';

/**
 * COMPONENTE: LoginModal - Gate de Interação
 *
 * Regras:
 * - Leitura: livre
 * - Criar tópico / responder / reagir: login obrigatório
 *
 * Implementa:
 * - Modal de login rápido
 * - Aviso contextual ao tentar interagir sem login
 *
 * Visual: Modal cyberpunk
 */

import React, { useState } from 'react';
import {
  X,
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Github,
  Chrome,
  Zap,
} from 'lucide-react';

// ========================================
// TIPOS
// ========================================

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  contexto?: string; // Ex: "criar tópico", "responder", "reagir"
}

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export default function LoginModal({
  isOpen,
  onClose,
  contexto = 'participar',
}: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // MVP: Simular login
    setTimeout(() => {
      setIsLoading(false);
      alert('[MVP DEMO] Login simulado. Em produção, você seria autenticado.');
      onClose();
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    alert(`[MVP DEMO] Login com ${provider} será implementado na versão final.`);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-[0_0_60px_rgba(0,255,136,0.1)] overflow-hidden">
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4 border-b border-zinc-800">
            {/* Decorative glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-[#00ff88]/50 to-transparent" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-[#00ff88]/10 rounded-xl border border-[#00ff88]/30">
                <LogIn className="w-5 h-5 text-[#00ff88]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Entrar no Sistema</h2>
                <p className="text-xs text-zinc-500">
                  Necessário para {contexto}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Contextual Message */}
            <div className="mb-6 p-3 bg-[#00ff88]/5 border border-[#00ff88]/20 rounded-lg">
              <p className="text-sm text-[#00ff88] flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>A leitura é livre. Login é necessário apenas para interagir.</span>
              </p>
            </div>

            {/* Social Login */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleSocialLogin('Google')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition-colors"
              >
                <Chrome className="w-5 h-5 text-zinc-300" />
                <span className="text-sm font-medium text-white">Continuar com Google</span>
              </button>

              <button
                onClick={() => handleSocialLogin('GitHub')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition-colors"
              >
                <Github className="w-5 h-5 text-zinc-300" />
                <span className="text-sm font-medium text-white">Continuar com GitHub</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-[1px] bg-zinc-800" />
              <span className="text-xs text-zinc-600 uppercase">ou</span>
              <div className="flex-1 h-[1px] bg-zinc-800" />
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-[#00ff88]/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-11 pr-12 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-[#00ff88]/50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-700 rounded transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-zinc-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-zinc-500" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-[#00ff88] focus:ring-[#00ff88]/50"
                  />
                  <span className="text-xs text-zinc-500">Lembrar de mim</span>
                </label>
                <a href="#" className="text-xs text-[#00ff88] hover:underline">
                  Esqueci a senha
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#00ff88] hover:bg-[#00ff88]/80 disabled:bg-zinc-700 text-black font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(0,255,136,0.5)] disabled:shadow-none"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Entrando...
                  </span>
                ) : (
                  'Entrar'
                )}
              </button>
            </form>

            {/* Register Link */}
            <p className="mt-6 text-center text-sm text-zinc-500">
              Não tem conta?{' '}
              <a
                href="https://app.nutrifitcoach.com.br/registro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00ff88] hover:underline"
              >
                Criar conta grátis
              </a>
            </p>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-zinc-950/50 border-t border-zinc-800">
            <p className="text-[10px] text-zinc-600 text-center font-mono">
              MVP DEMO • AUTENTICAÇÃO SIMULADA
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// ========================================
// HOOK HELPER
// ========================================

export function useLoginModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [contexto, setContexto] = React.useState('participar');

  const openLogin = (ctx?: string) => {
    if (ctx) setContexto(ctx);
    setIsOpen(true);
  };

  const closeLogin = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    contexto,
    openLogin,
    closeLogin,
  };
}
