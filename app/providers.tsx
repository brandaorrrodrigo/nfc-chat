'use client';

/**
 * Providers - Client Component Wrapper
 *
 * Agrupa todos os providers necessários para a aplicação.
 * Separado do layout.tsx para manter o layout como Server Component.
 *
 * HEADER/FOOTER GLOBAL:
 * - NFCHeader (logo holográfico) e UniversalFooter são renderizados AQUI
 * - NENHUMA página deve renderizar header/footer
 * - Isso garante consistência visual em TODO o ecossistema
 *
 * PERSISTÊNCIA DE SESSÃO:
 * - Sessão de 365 dias (configurado em auth-config.ts)
 * - Refetch ao focar janela para manter UI sincronizada
 * - Refetch a cada 10 minutos para renovação suave
 * - Usuário SÓ sai se clicar em "Sair" explicitamente
 *
 * @version 4.0.0 - NFCHeader com logo holográfico
 */

import { SessionProvider } from 'next-auth/react';
import { ComunidadesAuthProvider } from '@/app/components/comunidades/ComunidadesAuthContext';
import { NFCHeader, UniversalFooter } from '@/components/shared';

// Intervalo de refresh em segundos (10 minutos)
// Mantém a sessão viva e a UI sincronizada
const SESSION_REFETCH_INTERVAL = 10 * 60; // 10 minutos

/**
 * GlobalLayout - Wrapper que inclui Header e Footer globais
 */
function GlobalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a14]">
      {/* HEADER GLOBAL - NFCHeader com logo holográfico */}
      <NFCHeader currentPage="chat" />

      {/* CONTEÚDO DAS PÁGINAS */}
      <main className="flex-1">
        {children}
      </main>

      {/* FOOTER GLOBAL */}
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
