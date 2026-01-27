'use client';

/**
 * EcossistemaLayout - Layout Wrapper Unificado do Ecossistema NutriFitCoach
 *
 * COMPONENTE IDENTICO em todos os sistemas:
 * - chat.nutrifitcoach.com.br
 * - app.nutrifitcoach.com.br
 * - blog.nutrifitcoach.com.br
 *
 * Envolve o conteudo com Header e Footer unificados.
 * Gerencia estado de autenticacao para o Header.
 *
 * NAO ALTERAR ESTE COMPONENTE SEM ATUALIZAR TODOS OS SISTEMAS
 */

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import EcossistemaHeader from './EcossistemaHeader';
import EcossistemaFooter from './EcossistemaFooter';
import type { EcossistemaUser } from './EcossistemaHeader';

interface EcossistemaLayoutProps {
  children: React.ReactNode;
  /** Se true, nao mostra Header (para paginas full-screen) */
  hideHeader?: boolean;
  /** Se true, nao mostra Footer (para paginas full-screen) */
  hideFooter?: boolean;
}

export default function EcossistemaLayout({
  children,
  hideHeader = false,
  hideFooter = false,
}: EcossistemaLayoutProps) {
  const { data: session, status } = useSession();

  // Converter session para formato do Header
  const user: EcossistemaUser | null = session?.user
    ? {
        id: (session.user as any).id || session.user.email || 'user',
        nome: session.user.name || session.user.email?.split('@')[0] || 'Usuario',
        email: session.user.email || '',
        avatar: session.user.image || undefined,
      }
    : null;

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      {!hideHeader && (
        <EcossistemaHeader
          user={user}
          isLoading={status === 'loading'}
          onLogout={handleLogout}
        />
      )}

      <main className="flex-1">
        {children}
      </main>

      {!hideFooter && <EcossistemaFooter />}
    </div>
  );
}
