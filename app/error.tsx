'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[Global Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">
          Erro inesperado
        </h1>

        <p className="text-zinc-400 mb-6">
          Algo deu errado. Tente recarregar a página.
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
            className="px-6 py-3 bg-[#00ff88] hover:bg-[#00ff88]/90 text-black font-semibold rounded-lg transition-all"
          >
            Ir para início
          </Link>
        </div>
      </div>
    </div>
  );
}
