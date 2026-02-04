'use client';

/**
 * Providers - Client Component Wrapper
 *
 * SessionProvider + ComunidadesAuthProvider + UniversalHeader global
 */

import React from 'react';
import { SessionProvider, useSession, signOut } from 'next-auth/react';
import { ComunidadesAuthProvider } from './components/comunidades/ComunidadesAuthContext';
import UniversalHeader from '@/components/shared/UniversalHeader';
import type { UniversalUser } from '@/components/shared/UniversalHeader';

function HeaderWithSession() {
  const { data: session, status } = useSession();

  const user: UniversalUser | null = session?.user
    ? {
        id: (session.user as any).id || session.user.email || '',
        name: session.user.name || '',
        email: session.user.email || '',
        image: session.user.image,
        is_premium: (session.user as any).is_premium,
        is_founder: (session.user as any).is_founder,
        is_admin: (session.user as any).is_admin,
      }
    : null;

  return (
    <UniversalHeader
      variant="chat"
      user={user}
      isLoading={status === 'loading'}
      onLogout={() => signOut({ callbackUrl: '/' })}
      loginUrl="/login"
    />
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={10 * 60}
      refetchOnWindowFocus={true}
    >
      <ComunidadesAuthProvider>
        <HeaderWithSession />
        {children}
      </ComunidadesAuthProvider>
    </SessionProvider>
  );
}
