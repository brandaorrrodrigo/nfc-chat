/**
 * NextAuth Configuration for Comunidades
 *
 * Auth SIMPLES e ISOLADO para Comunidades (FREE)
 * - Provider: Credentials (email + senha)
 * - Sem Stripe
 * - Sem verificação de pagamento
 * - Sessão JWT PERSISTENTE (365 dias)
 *
 * ARQUITETURA:
 * - Comunidades = FREE
 * - App NutriFitCoach = PAGO (domínio separado)
 * - Auth NÃO compartilhado entre os dois
 *
 * PERSISTÊNCIA:
 * - Sessão dura 1 ANO (365 dias)
 * - JWT atualiza a cada 24h de uso
 * - Usuário SÓ sai se clicar em "Sair" explicitamente
 * - Sobrevive: F5, fechar navegador, reiniciar PC
 */

import type { AuthOptions, User } from 'next-auth';
import type { CookiesOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { v4 as uuidv4 } from 'uuid';

// ========================================
// CONFIGURAÇÃO DE PERSISTÊNCIA
// ========================================

// Sessão de 1 ANO - usuário NUNCA é deslogado automaticamente
const SESSION_MAX_AGE = 365 * 24 * 60 * 60; // 365 dias em segundos

// Atualiza o token a cada 24 horas de uso ativo
const SESSION_UPDATE_AGE = 24 * 60 * 60; // 24 horas em segundos

// Configuração de cookies para máxima persistência
const isProduction = process.env.NODE_ENV === 'production';
const cookieDomain = isProduction ? '.nutrifitcoach.com.br' : undefined;

const cookieOptions: Partial<CookiesOptions> = {
  sessionToken: {
    name: isProduction
      ? '__Secure-next-auth.session-token'
      : 'next-auth.session-token',
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: isProduction,
      // Domain para permitir cookies em subdomínios (chat., app., blog.)
      domain: cookieDomain,
      // maxAge definido pela sessão
    },
  },
  callbackUrl: {
    name: isProduction
      ? '__Secure-next-auth.callback-url'
      : 'next-auth.callback-url',
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: isProduction,
      domain: cookieDomain,
    },
  },
  csrfToken: {
    name: isProduction
      ? '__Host-next-auth.csrf-token'
      : 'next-auth.csrf-token',
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: isProduction,
    },
  },
};

// Emails com assinatura premium ativa (App NutriFitCoach pago)
const PREMIUM_EMAILS = [
  'admin@nutrifitcoach.com.br',
  'demo@nutrifitcoach.com.br',
  'brandaorrrodrigo@gmail.com',
];

// Usuários mock para desenvolvimento
// TODO: Substituir por integração com Supabase
const MOCK_USERS = [
  {
    id: '1',
    email: 'demo@nutrifitcoach.com.br',
    password: 'demo123',
    name: 'Usuário Demo',
    image: null,
    is_premium: true,
  },
  {
    id: '2',
    email: 'admin@nutrifitcoach.com.br',
    password: 'admin123',
    name: 'Admin',
    image: null,
    is_admin: true,
    is_premium: true,
  },
];

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Email e Senha',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'seu@email.com' },
        password: { label: 'Senha', type: 'password' },
        action: { label: 'Action', type: 'text' }, // 'login' ou 'register'
        name: { label: 'Nome', type: 'text' },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const { email, password, action, name } = credentials;

        // Registro de novo usuário
        if (action === 'register') {
          // Em produção, criar usuário no Supabase
          // Por enquanto, aceita qualquer registro e cria sessão
          const isPremiumEmail = PREMIUM_EMAILS.includes(email.toLowerCase());
          const newUser: User = {
            id: uuidv4(),
            email: email.toLowerCase(),
            name: name || email.split('@')[0],
            image: null,
            is_premium: isPremiumEmail,
          } as User;
          return newUser;
        }

        // Login existente
        // Primeiro, verifica usuários mock
        const mockUser = MOCK_USERS.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (mockUser) {
          return {
            id: mockUser.id,
            email: mockUser.email,
            name: mockUser.name,
            image: mockUser.image,
            is_admin: (mockUser as any).is_admin || false,
            is_premium: (mockUser as any).is_premium || false,
          } as User;
        }

        // TODO: Verificar no Supabase
        // Por enquanto, aceita login se email termina com @nutrifitcoach.com.br
        if (email.endsWith('@nutrifitcoach.com.br') || email.endsWith('@gmail.com')) {
          const isPremiumEmail = PREMIUM_EMAILS.includes(email.toLowerCase());
          return {
            id: uuidv4(),
            email: email.toLowerCase(),
            name: email.split('@')[0],
            image: null,
            is_premium: isPremiumEmail,
          } as User;
        }

        return null;
      },
    }),
  ],
  // ========================================
  // SESSÃO PERSISTENTE (365 DIAS)
  // ========================================
  session: {
    strategy: 'jwt',
    maxAge: SESSION_MAX_AGE, // 365 dias - NUNCA expira automaticamente
    updateAge: SESSION_UPDATE_AGE, // Renova a cada 24h de uso
  },
  jwt: {
    maxAge: SESSION_MAX_AGE, // JWT também dura 365 dias
  },
  // Cookies configurados para máxima persistência
  cookies: cookieOptions,
  pages: {
    signIn: '/login/comunidades',
    error: '/login/comunidades',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.is_admin = (user as any).is_admin || false;
        // Verifica premium pelo email ou flag do usuário
        const emailPremium = PREMIUM_EMAILS.includes((user.email || '').toLowerCase());
        token.is_premium = (user as any).is_premium || emailPremium;
        token.is_founder = (user as any).is_founder || false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).is_admin = token.is_admin || false;
        (session.user as any).is_premium = token.is_premium || false;
        (session.user as any).is_founder = token.is_founder || false;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
};
