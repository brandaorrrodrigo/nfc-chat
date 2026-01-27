/**
 * Auth Utilities
 * Utilitários de autenticação para client e server components
 *
 * ARQUITETURA:
 * - Comunidades = FREE (auth local)
 * - App = PAGO (auth separado em app.nutrifitcoach.com.br)
 */

import { getServerSession } from 'next-auth/next';
import { useSession } from 'next-auth/react';
import { authOptions } from '@/lib/auth-config';

// Re-export authOptions for use in API routes
export { authOptions };

/**
 * Hook para obter o user ID do usuário autenticado (client components)
 * @returns { userId, isLoading, isAuthenticated }
 */
export function useAuthUser() {
  const { data: session, status } = useSession();

  return {
    userId: (session?.user as any)?.id as string | undefined,
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    isPremium: (session?.user as any)?.is_premium || (session?.user as any)?.is_founder || false,
    isAdmin: (session?.user as any)?.is_admin || false,
  };
}

/**
 * Hook que retorna o userId ou redireciona para login
 * Para uso em páginas que REQUEREM autenticação
 */
export function useRequireAuth() {
  const { userId, isLoading, isAuthenticated } = useAuthUser();

  return {
    userId: userId || '',
    isLoading,
    isAuthenticated,
    shouldRedirect: !isLoading && !isAuthenticated,
  };
}

/**
 * Obtém o user ID da sessão no servidor
 * Para uso em Server Components e API routes
 */
export async function getServerUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return (session?.user as any)?.id || null;
}

/**
 * Requer autenticação no servidor (para Server Components)
 * Retorna o userId ou null se não autenticado
 */
export async function requireServerAuth(): Promise<{ userId: string } | null> {
  const userId = await getServerUserId();
  if (!userId) {
    return null;
  }
  return { userId };
}
