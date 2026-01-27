/**
 * Navigation Constants - NFC Comunidades
 *
 * ECOSSISTEMA NUTRIFITCOACH:
 * - CHAT (chat.nutrifitcoach.com.br) → comunidades FREE
 * - BLOG (blog.nutrifitcoach.com.br) → conteudo publico
 * - APP (app.nutrifitcoach.com.br) → produto PREMIUM
 *
 * REGRAS:
 * 1. CHAT nunca usa login do APP
 * 2. BLOG nunca passa por autenticacao
 * 3. Apenas CTAs premium podem levar ao APP
 */

// ========================================
// URLs BASE DO ECOSSISTEMA
// ========================================

export const CHAT_URL = process.env.NEXT_PUBLIC_COMUNIDADES_URL || 'https://chat.nutrifitcoach.com.br';
export const BLOG_URL = process.env.NEXT_PUBLIC_BLOG_URL || 'https://blog.nutrifitcoach.com.br';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.nutrifitcoach.com.br';

// Legacy aliases (manter compatibilidade)
export const APP_BASE_URL = APP_URL;
export const COMUNIDADES_BASE_URL = CHAT_URL;

// ========================================
// ROTAS DO CHAT (este projeto)
// ========================================

export const CHAT_ROUTES = {
  HOME: '/',
  CRIAR: '/criar',
  LOGIN: '/login',
  LOGIN_COMUNIDADES: '/login/comunidades',
  REGISTRO: '/registro',
  COMUNIDADE: (slug: string) => `/comunidades/${slug}`,
  TOPICO: (comunidadeSlug: string, topicoSlug: string) => `/comunidades/${comunidadeSlug}/${topicoSlug}`,
  ADMIN: (slug: string) => `/comunidades/${slug}/admin`,
  CRIAR_TOPICO: (slug: string) => `/comunidades/${slug}/criar-topico`,
} as const;

// Legacy alias
export const COMUNIDADES_ROUTES = CHAT_ROUTES;

// ========================================
// ROTAS DO BLOG (link externo)
// ========================================

export const BLOG_ROUTES = {
  HOME: BLOG_URL,
  ARTIGO: (slug: string) => `${BLOG_URL}/${slug}`,
} as const;

// ========================================
// ROTAS DO APP PREMIUM (link externo)
// ========================================

export const APP_ROUTES = {
  HOME: APP_URL,
  LOGIN: `${APP_URL}/login`,
  REGISTRO: `${APP_URL}/registro`,
  DASHBOARD: `${APP_URL}/dashboard/unified`,
  PERFIL: `${APP_URL}/perfil`,
  CONFIGURACOES: `${APP_URL}/configuracoes-ia`,
  ADMIN: `${APP_URL}/admin`,
  CHATBOT: `${APP_URL}/chatbot`,
} as const;

// ========================================
// HELPERS - LOGIN DO CHAT (LOCAL)
// ========================================

/**
 * Gera URL de login do CHAT (local)
 * NUNCA redireciona para o APP
 */
export function getChatLoginUrl(callbackUrl?: string): string {
  if (!callbackUrl) return CHAT_ROUTES.LOGIN_COMUNIDADES;
  return `${CHAT_ROUTES.LOGIN_COMUNIDADES}?callbackUrl=${encodeURIComponent(callbackUrl)}`;
}

/**
 * Gera URL de registro do CHAT (local)
 * NUNCA redireciona para o APP
 */
export function getChatRegistroUrl(callbackUrl?: string): string {
  if (!callbackUrl) return CHAT_ROUTES.REGISTRO;
  return `${CHAT_ROUTES.REGISTRO}?callbackUrl=${encodeURIComponent(callbackUrl)}`;
}

// ========================================
// HELPERS - APP PREMIUM (EXTERNO)
// ========================================

/**
 * Gera URL de login do APP PREMIUM
 * Usar apenas para CTAs premium
 */
export function getAppLoginUrl(redirectTo?: string): string {
  if (!redirectTo) return APP_ROUTES.LOGIN;
  return `${APP_ROUTES.LOGIN}?redirect=${encodeURIComponent(redirectTo)}`;
}

/**
 * Gera URL de registro do APP PREMIUM
 * Usar apenas para CTAs premium
 */
export function getAppRegistroUrl(redirectTo?: string): string {
  if (!redirectTo) return APP_ROUTES.REGISTRO;
  return `${APP_ROUTES.REGISTRO}?redirect=${encodeURIComponent(redirectTo)}`;
}

// ========================================
// LEGACY HELPERS (deprecados, manter compatibilidade)
// ========================================

/**
 * @deprecated Use getChatLoginUrl() para login do CHAT
 * ou getAppLoginUrl() para login do APP PREMIUM
 */
export function getLoginUrl(returnTo?: string): string {
  // CORRIGIDO: Agora usa login LOCAL do CHAT
  return getChatLoginUrl(returnTo);
}

/**
 * @deprecated Use getChatRegistroUrl() para registro do CHAT
 * ou getAppRegistroUrl() para registro do APP PREMIUM
 */
export function getRegistroUrl(returnTo?: string): string {
  // CORRIGIDO: Agora usa registro LOCAL do CHAT
  return getChatRegistroUrl(returnTo);
}
