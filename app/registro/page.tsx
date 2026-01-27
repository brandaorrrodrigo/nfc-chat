'use client';

/**
 * Página de Registro
 * Redireciona para /login/comunidades com modo registro
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegistroPage() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para login/comunidades que tem o formulário de registro
    router.replace('/login/comunidades?mode=register');
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-[#00ff88] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-zinc-500 font-mono text-sm">Redirecionando...</p>
      </div>
    </div>
  );
}
