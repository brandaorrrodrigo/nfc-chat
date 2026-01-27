/**
 * Environment Variable Validation
 * ================================
 *
 * Valida variáveis de ambiente no startup da aplicação
 * Garante que todas as variáveis necessárias estão configuradas
 */

import { z } from 'zod';

/**
 * Schema das variáveis de ambiente do servidor
 */
const serverEnvSchema = z.object({
  // Node
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL deve ser uma URL válida'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY é obrigatória'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // NextAuth
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET deve ter no mínimo 32 caracteres').optional(),

  // Google OAuth (opcional)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),

  // OpenAI (para chatbot)
  OPENAI_API_KEY: z.string().optional(),

  // App URL
  NEXT_PUBLIC_URL: z.string().url().optional(),

  // Sentry (opcional)
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
});

/**
 * Schema das variáveis de ambiente do cliente
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_URL: z.string().url().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

/**
 * Valida variáveis do servidor
 * Deve ser chamado no startup da aplicação
 */
export function validateServerEnv(): ServerEnv {
  const result = serverEnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error('='.repeat(60));
    console.error('ERRO: Variáveis de ambiente inválidas ou ausentes!');
    console.error('='.repeat(60));

    for (const issue of result.error.issues) {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    }

    console.error('='.repeat(60));
    console.error('Verifique o arquivo .env.local e configure as variáveis.');
    console.error('='.repeat(60));

    // Em produção, não quebrar a aplicação
    if (process.env.NODE_ENV === 'production') {
      console.error('Continuando com valores padrão em produção...');
      return process.env as unknown as ServerEnv;
    }

    throw new Error('Variáveis de ambiente inválidas');
  }

  return result.data;
}

/**
 * Valida variáveis do cliente
 */
export function validateClientEnv(): ClientEnv {
  const clientEnv = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  };

  const result = clientEnvSchema.safeParse(clientEnv);

  if (!result.success) {
    console.warn('Algumas variáveis de ambiente do cliente estão ausentes:');
    for (const issue of result.error.issues) {
      console.warn(`  - ${issue.path.join('.')}: ${issue.message}`);
    }
  }

  return clientEnv as ClientEnv;
}

/**
 * Helper para verificar se está em produção
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Helper para verificar se está em desenvolvimento
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Retorna URL base da aplicação
 */
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
}

/**
 * Verifica se feature específica está habilitada
 */
export function isFeatureEnabled(feature: 'stripe' | 'openai' | 'sentry' | 'google_auth'): boolean {
  switch (feature) {
    case 'stripe':
      return !!process.env.STRIPE_SECRET_KEY && !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    case 'openai':
      return !!process.env.OPENAI_API_KEY;
    case 'sentry':
      return !!process.env.NEXT_PUBLIC_SENTRY_DSN;
    case 'google_auth':
      return !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;
    default:
      return false;
  }
}

/**
 * Lista variáveis ausentes (para debug)
 */
export function getMissingEnvVars(): string[] {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];

  const recommended = [
    'NEXTAUTH_SECRET',
    'STRIPE_SECRET_KEY',
    'OPENAI_API_KEY',
  ];

  const missing: string[] = [];

  for (const key of required) {
    if (!process.env[key]) {
      missing.push(`[REQUIRED] ${key}`);
    }
  }

  for (const key of recommended) {
    if (!process.env[key]) {
      missing.push(`[RECOMMENDED] ${key}`);
    }
  }

  return missing;
}

// Validar no import (apenas servidor)
if (typeof window === 'undefined') {
  try {
    validateServerEnv();
  } catch (error) {
    // Não quebrar no build
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Env validation skipped during build');
    }
  }
}
