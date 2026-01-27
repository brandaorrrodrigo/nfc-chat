/**
 * Navigation Constants - NFC Comunidades
 *
 * URLs de navegação para o projeto de comunidades.
 * App está em projeto separado.
 */

// URLs BASE
export const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.nutrifitcoach.com.br';
export const COMUNIDADES_BASE_URL = process.env.NEXT_PUBLIC_COMUNIDADES_URL || '';

// ROTAS DAS COMUNIDADES (este projeto)
export const COMUNIDADES_ROUTES = {
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

// ROTAS DO APP (link externo)
export const APP_ROUTES = {
  HOME: APP_BASE_URL,
  LOGIN: `${APP_BASE_URL}/login`,
  REGISTRO: `${APP_BASE_URL}/registro`,
  DASHBOARD: `${APP_BASE_URL}/dashboard/unified`,
  PERFIL: `${APP_BASE_URL}/perfil`,
  CONFIGURACOES: `${APP_BASE_URL}/configuracoes-ia`,
  ADMIN: `${APP_BASE_URL}/admin`,
  BLOG: `${APP_BASE_URL}/cerebro/blog`,
  CHATBOT: `${APP_BASE_URL}/chatbot`,
} as const;

// HELPERS
export function getLoginUrl(returnTo?: string): string {
  const loginUrl = APP_ROUTES.LOGIN;
  if (!returnTo) return loginUrl;
  return `${loginUrl}?redirect=${encodeURIComponent(COMUNIDADES_BASE_URL + returnTo)}`;
}

export function getRegistroUrl(returnTo?: string): string {
  const registroUrl = APP_ROUTES.REGISTRO;
  if (!returnTo) return registroUrl;
  return `${registroUrl}?redirect=${encodeURIComponent(COMUNIDADES_BASE_URL + returnTo)}`;
}
