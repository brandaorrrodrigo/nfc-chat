'use client';

/**
 * Providers - Client Component Wrapper
 *
 * SessionProvider + ComunidadesAuthProvider + NFCHeader global
 */

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { ComunidadesAuthProvider } from './components/comunidades/ComunidadesAuthContext';
import NFCHeader from '@/components/shared/NFCHeader';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={10 * 60}
      refetchOnWindowFocus={true}
    >
      <ComunidadesAuthProvider>
        <NFCHeader currentPage="chat" />
        {children}
      </ComunidadesAuthProvider>
    </SessionProvider>
  );
}
