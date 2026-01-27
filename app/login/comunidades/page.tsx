'use client';

/**
 * PÁGINA: Login Comunidades
 *
 * IMPORTANTE: Header e Footer são renderizados GLOBALMENTE via providers.tsx
 * Esta página contém APENAS o conteúdo específico.
 */

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Users, Mail, Lock, ArrowLeft, Loader2, Eye, EyeOff, Zap, User } from 'lucide-react';

export default function LoginComunidadesPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        action: mode,
        redirect: false,
      });

      if (result?.error) {
        setError(
          mode === 'login'
            ? 'Email ou senha incorretos. Tente novamente.'
            : 'Erro ao criar conta. Tente novamente.'
        );
        return;
      }

      if (result?.ok) {
        // Full page redirect to ensure SessionProvider refreshes
        // router.push + router.refresh doesn't update client-side session state
        window.location.href = callbackUrl;
      }
    } catch (err) {
      console.error('[Login Error]', err);
      setError('Erro ao processar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black py-8">
      {/* Main Content */}
      <div className="max-w-md mx-auto px-4">
        {/* Back Link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </Link>

        <div className="w-full">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-zinc-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {mode === 'login' ? 'Entrar nas Comunidades' : 'Criar conta'}
            </h1>
            <p className="text-zinc-400">
              {mode === 'login'
                ? 'Acesse sua conta para participar'
                : 'Crie sua conta gratuita'
              }
            </p>
            <p className="text-xs text-zinc-500 mt-2">
              100% gratuito. Sem cartão de crédito.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Nome
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Seu nome"
                    className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#00ff88]/50 transition-colors"
                    required={mode === 'register'}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#00ff88]/50 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#00ff88]/50 transition-colors"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#00ff88] hover:bg-[#00ff88]/90 disabled:bg-[#00ff88]/50 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processando...</span>
                </>
              ) : (
                <span>{mode === 'login' ? 'Entrar' : 'Criar conta grátis'}</span>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="mt-6 text-center">
            <p className="text-zinc-500">
              {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}
              {' '}
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setError('');
                }}
                className="text-[#00ff88] hover:underline font-medium"
              >
                {mode === 'login' ? 'Criar agora' : 'Fazer login'}
              </button>
            </p>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-black text-zinc-500">ou</span>
            </div>
          </div>

          {/* Premium upsell */}
          <Link
            href="/login/app"
            className="block p-4 rounded-xl border border-[#00ff88]/20 bg-[#00ff88]/5 hover:bg-[#00ff88]/10 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#00ff88]" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Quer resultados mais rápidos?</p>
                <p className="text-sm text-zinc-400">Conheça o App Premium com IA</p>
              </div>
              <ArrowLeft className="w-5 h-5 text-[#00ff88] rotate-180 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Terms */}
          <p className="text-center text-zinc-600 text-sm mt-8">
            Ao continuar, você concorda com nossos{' '}
            <a href="#" className="text-zinc-400 hover:underline">Termos</a>
            {' '}e{' '}
            <a href="#" className="text-zinc-400 hover:underline">Privacidade</a>
          </p>
        </div>
      </div>
    </div>
  );
}
