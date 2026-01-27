'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, ExternalLink, Loader2, Crown, CheckCircle } from 'lucide-react';
import { APP_ROUTES } from '@/lib/navigation';

const premiumFeatures = [
  'IA Nutricional personalizada 24h',
  'Cardápios ilimitados com macros',
  'Treinos adaptativos ao seu nível',
  'Dashboard de métricas completo',
  'Suporte prioritário',
];

export default function LoginAppPage() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleRedirect = () => {
    setIsRedirecting(true);
    // Redireciona para o app principal após um breve delay
    window.location.href = APP_ROUTES.LOGIN;
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800/50">
        <div className="max-w-md mx-auto px-4 py-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00ff88]/20 to-[#00ff88]/5 border border-[#00ff88]/30 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-[#00ff88]" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] text-xs font-bold mb-4">
              <Crown className="w-3 h-3" />
              PREMIUM
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
              App NutriFitCoach
            </h1>
            <p className="text-zinc-400">
              Você será redirecionado para o app principal para fazer login ou criar sua conta.
            </p>
          </div>

          {/* Features list */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8">
            <p className="text-sm text-zinc-400 mb-4 font-medium">
              O que você terá acesso:
            </p>
            <ul className="space-y-3">
              {premiumFeatures.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-white">
                  <CheckCircle className="w-5 h-5 text-[#00ff88] flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleRedirect}
            disabled={isRedirecting}
            className="w-full py-4 bg-[#00ff88] hover:bg-[#00ff88]/90 disabled:bg-[#00ff88]/50 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all flex items-center justify-center gap-3 text-lg"
          >
            {isRedirecting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Redirecionando...</span>
              </>
            ) : (
              <>
                <span>Ir para o App</span>
                <ExternalLink className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Info text */}
          <p className="text-center text-zinc-500 text-sm mt-4">
            7 dias grátis para novos usuários
          </p>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-black text-zinc-500">ou</span>
            </div>
          </div>

          {/* Free option */}
          <Link
            href="/login/comunidades"
            className="block p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors text-center"
          >
            <p className="text-zinc-400">
              Prefere começar grátis?{' '}
              <span className="text-white font-medium">Acesse as Comunidades</span>
            </p>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-6">
        <div className="max-w-md mx-auto px-4 text-center text-zinc-600 text-sm">
          <a
            href={APP_ROUTES.HOME}
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <span>Visitar app.nutrifitcoach.com.br</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </footer>
    </div>
  );
}
