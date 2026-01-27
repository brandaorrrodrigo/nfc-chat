'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ComunidadeError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[Comunidade Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">
          Algo deu errado
        </h1>

        <p className="text-zinc-400 mb-6">
          Ocorreu um erro ao carregar esta comunidade. Tente novamente ou volte para a página inicial.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar novamente
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-[#00ff88] hover:bg-[#00ff88]/90 text-black font-semibold rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Arenas
          </Link>
        </div>

        {error.digest && (
          <p className="mt-6 text-xs text-zinc-600 font-mono">
            Código: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
