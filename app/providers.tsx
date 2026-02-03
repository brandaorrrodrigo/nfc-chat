'use client';

/**
 * Providers - Client Component Wrapper
 *
 * Agrupa todos os providers necessários para a aplicação.
 * Separado do layout.tsx para manter o layout como Server Component.
 *
 * HEADER/FOOTER GLOBAL:
 * - NFCHeader (logo holográfico) + AuthHeader (área de login)
 * - UniversalFooter
 * - NENHUMA página deve renderizar header/footer
 * - Isso garante consistência visual em TODO o ecossistema
 *
 * PERSISTÊNCIA DE SESSÃO:
 * - Sessão de 365 dias (configurado em auth-config.ts)
 * - Refetch ao focar janela para manter UI sincronizada
 * - Refetch a cada 10 minutos para renovação suave
 * - Usuário SÓ sai se clicar em "Sair" explicitamente
 *
 * @version 4.2.0 - NFCHeader + AuthHeader + FP Gamification
 */

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { ComunidadesAuthProvider, useComunidadesAuth } from '@/app/components/comunidades/ComunidadesAuthContext';
import { NFCHeader, UniversalFooter } from '@/components/shared';
import { FPProvider } from '@/contexts/FPContext';
import { StreakIcon } from '@/components/gamification/StreakBadge';
import { Coins } from 'lucide-react';

// Intervalo de refresh em segundos (10 minutos)
// Mantém a sessão viva e a UI sincronizada
const SESSION_REFETCH_INTERVAL = 10 * 60; // 10 minutos

/**
 * UserAreaCompact - Área de usuário compacta (só login/avatar)
 * Posicionada no canto superior direito sobre o NFCHeader
 */
function UserAreaCompact() {
  const { user, isLoading, logout } = useComunidadesAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Fechar menu ao clicar fora
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="absolute top-4 right-4 z-50">
        <div className="w-10 h-10 rounded-full bg-zinc-800 animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <a
          href="/login"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 rounded-lg transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="hidden sm:inline">Visualizar</span>
        </a>
        <a
          href="/registro"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-emerald-500 to-cyan-500 text-black rounded-lg hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <span className="hidden sm:inline">Criar Conta</span>
        </a>
      </div>
    );
  }

  // Usuário logado - mostrar avatar com menu
  const initials = (user.name || user.email || 'U').charAt(0).toUpperCase();
  const [fpBalance, setFpBalance] = React.useState<number | null>(null);

  // Buscar saldo de FP
  React.useEffect(() => {
    if (user?.id) {
      fetch(`/api/fp/balance?userId=${user.id}`)
        .then(res => res.json())
        .then(data => setFpBalance(data.available))
        .catch(() => setFpBalance(0));
    }
  }, [user?.id]);

  return (
    <div className="absolute top-4 right-4 z-50 flex items-center gap-3" ref={menuRef}>
      {/* Streak Icon */}
      {user?.id && <StreakIcon userId={user.id} />}

      {/* FP Balance */}
      {fpBalance !== null && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-full">
          <Coins className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-semibold text-yellow-400">{fpBalance}</span>
          <span className="text-xs text-zinc-500 hidden sm:inline">FP</span>
        </div>
      )}

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 p-1 pr-3 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 rounded-full transition-all"
      >
        {user.image ? (
          <img src={user.image} alt={user.name || ''} className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/50" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-black font-bold text-sm">
            {initials}
          </div>
        )}
        <span className="text-sm text-zinc-300 hidden sm:block">{user.name?.split(' ')[0] || 'Usuário'}</span>
        <svg className={`w-4 h-4 text-zinc-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden">
          <div className="p-3 border-b border-zinc-800">
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
          </div>
          <div className="py-1">
            <a href="/perfil" className="block px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800">Perfil</a>
            <a href="https://app.nutrifitcoach.com.br" className="block px-4 py-2 text-sm text-emerald-400 hover:text-emerald-300 hover:bg-zinc-800">Ir para o App</a>
          </div>
          <div className="border-t border-zinc-800 py-1">
            <button
              onClick={() => { setMenuOpen(false); logout(); }}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-zinc-800"
            >
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * GlobalLayout - Wrapper que inclui Header e Footer globais
 */
function GlobalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a14]">
      {/* HEADER GLOBAL - NFCHeader com logo holográfico */}
      <div className="relative">
        <NFCHeader currentPage="chat" />
        {/* Área de usuário no canto superior direito */}
        <UserAreaCompact />
      </div>

      {/* CONTEÚDO DAS PÁGINAS */}
      <main className="flex-1">
        {children}
      </main>

      {/* FOOTER GLOBAL */}
      <UniversalFooter variant="chat" />
    </div>
  );
}

/**
 * FPWrapper - Wrapper que conecta FPProvider com o usuario autenticado
 */
function FPWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useComunidadesAuth();

  return (
    <FPProvider userId={user?.id} showWidget={!!user}>
      {children}
    </FPProvider>
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
        <FPWrapper>
          <GlobalLayout>
            {children}
          </GlobalLayout>
        </FPWrapper>
      </ComunidadesAuthProvider>
    </SessionProvider>
  );
}
