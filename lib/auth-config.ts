/**
 * NextAuth Configuration for Comunidades
 *
 * Auth SIMPLES e ISOLADO para Comunidades (FREE)
 * - Provider: Credentials (email + senha)
 * - Sem Stripe
 * - Sem verificação de pagamento
 * - Sessão JWT simples
 *
 * ARQUITETURA:
 * - Comunidades = FREE
 * - App NutriFitCoach = PAGO (domínio separado)
 * - Auth NÃO compartilhado entre os dois
 */

import type { AuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { v4 as uuidv4 } from 'uuid';

// Usuários mock para desenvolvimento
// TODO: Substituir por integração com Supabase
const MOCK_USERS = [
  {
    id: '1',
    email: 'demo@nutrifitcoach.com.br',
    password: 'demo123',
    name: 'Usuário Demo',
    image: null,
  },
  {
    id: '2',
    email: 'admin@nutrifitcoach.com.br',
    password: 'admin123',
    name: 'Admin',
    image: null,
    is_admin: true,
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
          const newUser: User = {
            id: uuidv4(),
            email: email.toLowerCase(),
            name: name || email.split('@')[0],
            image: null,
          };
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
          } as User;
        }

        // TODO: Verificar no Supabase
        // Por enquanto, aceita login se email termina com @nutrifitcoach.com.br
        if (email.endsWith('@nutrifitcoach.com.br') || email.endsWith('@gmail.com')) {
          return {
            id: uuidv4(),
            email: email.toLowerCase(),
            name: email.split('@')[0],
            image: null,
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
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
        // Comunidades são FREE - sem verificação premium
        token.is_premium = false;
        token.is_founder = false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).is_admin = token.is_admin || false;
        (session.user as any).is_premium = false;
        (session.user as any).is_founder = false;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
};
