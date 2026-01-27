import Link from 'next/link';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export default function ComunidadeNotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-amber-400" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">
          Comunidade não encontrada
        </h1>

        <p className="text-zinc-400 mb-6">
          Esta comunidade não existe ou foi removida.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#00ff88] hover:bg-[#00ff88]/90 text-black font-semibold rounded-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Arenas
        </Link>
      </div>
    </div>
  );
}
