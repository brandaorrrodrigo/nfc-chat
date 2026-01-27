'use client';

/**
 * Providers - Client Component Wrapper
 *
 * Agrupa todos os providers necessários para a aplicação.
 * Separado do layout.tsx para manter o layout como Server Component.
 */

import { SessionProvider } from 'next-auth/react';
import { ComunidadesAuthProvider } from '@/app/components/comunidades/ComunidadesAuthContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      // Refetch session when window regains focus to catch updates
      refetchOnWindowFocus={true}
      // Refetch session every 5 minutes to keep it fresh
      refetchInterval={5 * 60}
    >
      <ComunidadesAuthProvider>
        {children}
      </ComunidadesAuthProvider>
    </SessionProvider>
  );
}
