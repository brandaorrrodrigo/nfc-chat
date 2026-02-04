'use client';

/**
 * Providers - Client Component Wrapper (MÍNIMO)
 *
 * Apenas SessionProvider. ComunidadesAuthProvider será envolvido localmente
 * onde necessário para evitar erros de hook call fora do contexto.
 */

import React from 'react';
import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={10 * 60}
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  );
}
