'use client';

/**
 * ComunidadesAuthContext - Contexto de Autenticação para Comunidades
 *
 * Integrado com NextAuth para autenticação real.
 * Comunidades são públicas para leitura, login necessário para interação.
 *
 * ARQUITETURA:
 * - Usa useSession() do NextAuth para estado real de auth
 * - Login redireciona para /login com callbackUrl para retornar
 * - Logout via signOut() do NextAuth
 *
 * PERSISTÊNCIA (365 DIAS):
 * - Sessão NUNCA expira automaticamente
 * - Sobrevive: F5, fechar navegador, reiniciar PC
 * - Usuário SÓ sai se clicar em "Sair" explicitamente
 * - JWT renovado automaticamente a cada 24h de uso
 */

import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import type { AuthUser } from './AuthHeader';

// ========================================
// TIPOS
// ========================================

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  /** URL completa para redirect após login */
  loginUrl: string;
}

// ========================================
// CONTEXTO
// ========================================

const ComunidadesAuthContext = createContext<AuthContextType | null>(null);

// ========================================
// PROVIDER
// ========================================

export function ComunidadesAuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Converte sessão NextAuth para AuthUser
  const user = useMemo<AuthUser | null>(() => {
    if (!session?.user) return null;

    const sessionUser = session.user as any;

    return {
      id: sessionUser.id || sessionUser.email || 'unknown',
      nome: sessionUser.name || sessionUser.email?.split('@')[0] || 'Usuário',
      email: sessionUser.email || '',
      avatar: sessionUser.image,
      is_admin: sessionUser.is_admin || false,
      is_premium: sessionUser.is_premium || false,
      is_founder: sessionUser.is_founder || false,
    };
  }, [session]);

  // URL de login com callback para retornar à página atual
  const loginUrl = useMemo(() => {
    const callbackUrl = encodeURIComponent(pathname || '/comunidades');
    return `/login?callbackUrl=${callbackUrl}`;
  }, [pathname]);

  // Login: redireciona para página de login
  const login = () => {
    window.location.href = loginUrl;
  };

  // Logout: usa signOut do NextAuth
  const logout = async () => {
    await signOut({ callbackUrl: '/comunidades' });
  };

  return (
    <ComunidadesAuthContext.Provider
      value={{
        user,
        isAuthenticated: status === 'authenticated' && !!user,
        isLoading: status === 'loading',
        login,
        logout,
        loginUrl,
      }}
    >
      {children}
    </ComunidadesAuthContext.Provider>
  );
}

// ========================================
// HOOK
// ========================================

export function useComunidadesAuth() {
  const context = useContext(ComunidadesAuthContext);
  if (!context) {
    throw new Error('useComunidadesAuth deve ser usado dentro de ComunidadesAuthProvider');
  }
  return context;
}

// ========================================
// EXPORT TIPOS
// ========================================

export type { AuthUser };
