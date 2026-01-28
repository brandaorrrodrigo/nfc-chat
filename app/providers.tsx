'use client';

/**
 * Providers - Client Component Wrapper
 *
 * Agrupa todos os providers necessários para a aplicação.
 * Separado do layout.tsx para manter o layout como Server Component.
 *
 * HEADER/FOOTER GLOBAL:
 * - UniversalHeader e UniversalFooter são renderizados AQUI
 * - NENHUMA página deve renderizar header/footer
 * - Isso garante consistência visual em TODO o ecossistema
 *
 * PERSISTÊNCIA DE SESSÃO:
 * - Sessão de 365 dias (configurado em auth-config.ts)
 * - Refetch ao focar janela para manter UI sincronizada
 * - Refetch a cada 10 minutos para renovação suave
 * - Usuário SÓ sai se clicar em "Sair" explicitamente
 *
 * @version 3.0.0 - Design System Unificado
 */

import { SessionProvider, useSession, signOut } from 'next-auth/react';
import { ComunidadesAuthProvider } from '@/app/components/comunidades/ComunidadesAuthContext';
import { UniversalHeader, UniversalFooter } from '@/components/shared';
import type { UniversalUser } from '@/components/shared';

// Intervalo de refresh em segundos (10 minutos)
// Mantém a sessão viva e a UI sincronizada
const SESSION_REFETCH_INTERVAL = 10 * 60; // 10 minutos

/**
 * GlobalLayout - Wrapper que inclui Header e Footer globais
 *
 * Lê o estado de autenticação e passa para o UniversalHeader.
 * O header muda visualmente quando o usuário está logado.
 */
function GlobalLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  // Converter sessão NextAuth para formato UniversalUser
  const user: UniversalUser | null = session?.user
    ? {
        id: (session.user as any).id || session.user.email || 'user',
        name: session.user.name || session.user.email?.split('@')[0] || 'Usuário',
        email: session.user.email || '',
        image: session.user.image || undefined,
        is_premium: (session.user as any).is_premium || false,
        is_founder: (session.user as any).is_founder || false,
        is_admin: (session.user as any).is_admin || false,
      }
    : null;

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER GLOBAL - Design System v3 */}
      <UniversalHeader
        variant="chat"
        user={user}
        isLoading={status === 'loading'}
        onLogout={handleLogout}
        loginUrl="/login/comunidades"
      />

      {/* CONTEÚDO DAS PÁGINAS */}
      <main className="flex-1">
        {children}
      </main>

      {/* FOOTER GLOBAL - Design System v3 */}
      <UniversalFooter variant="chat" />
    </div>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      // Refetch ao focar a janela - ESSENCIAL para manter UI sincronizada
      // após navegação entre abas ou voltar ao navegador
      refetchOnWindowFocus={true}
      // Refetch periódico para renovar sessão silenciosamente
      // Garante que a sessão seja renovada mesmo em uso contínuo
      refetchInterval={SESSION_REFETCH_INTERVAL}
      // Garante que a sessão seja carregada do cookie ao iniciar
      // Importante para persistência após F5/reload
    >
      <ComunidadesAuthProvider>
        <GlobalLayout>
          {children}
        </GlobalLayout>
      </ComunidadesAuthProvider>
    </SessionProvider>
  );
}
