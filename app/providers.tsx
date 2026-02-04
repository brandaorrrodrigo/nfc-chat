'use client';

/**
 * Providers - Client Component Wrapper
 *
 * Mantém SessionProvider + ComunidadesAuthProvider (necessário para hooks de auth)
 * Outros providers foram removidos para evitar erros client-side
 */

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { ComunidadesAuthProvider } from './components/comunidades/ComunidadesAuthContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={10 * 60}
      refetchOnWindowFocus={true}
    >
      <ComunidadesAuthProvider>
        {children}
      </ComunidadesAuthProvider>
    </SessionProvider>
  );
}
