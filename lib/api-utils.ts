/**
 * API Utilities - Helper para respostas seguras de API
 *
 * REGRA: Nunca retornar HTML em chamadas fetch()
 * Todas as respostas DEVEM ser JSON válido
 */

import { NextResponse } from 'next/server';

// Tipos de resposta padronizados
interface ApiSuccessResponse<T = unknown> {
  success: true;
  data?: T;
  message?: string;
}

interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
}

type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Cria resposta de sucesso padronizada
 */
export function apiSuccess<T>(data?: T, message?: string, status = 200): NextResponse {
  const body: ApiSuccessResponse<T> = {
    success: true,
    ...(data !== undefined && { data }),
    ...(message && { message }),
  };
  return NextResponse.json(body, { status });
}

/**
 * Cria resposta de erro padronizada
 */
export function apiError(error: string, status = 400, code?: string): NextResponse {
  const body: ApiErrorResponse = {
    success: false,
    error,
    ...(code && { code }),
  };
  return NextResponse.json(body, { status });
}

/**
 * Wrapper para handlers de API com try/catch automático
 * Garante que erros nunca retornem HTML
 */
export function withApiHandler<T>(
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  return handler().catch((err: Error) => {
    console.error('[API Error]', err);
    return apiError(
      err.message || 'Erro interno do servidor',
      500,
      'INTERNAL_ERROR'
    );
  });
}

/**
 * Valida se request tem body JSON válido
 */
export async function parseJsonBody<T>(request: Request): Promise<T | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

/**
 * Extrai userId da sessão (placeholder para uso com NextAuth)
 */
export function getUserIdFromSession(session: any): string | null {
  return session?.user?.id || session?.user?.email || null;
}
