/**
 * API: Search
 * Path: /api/comunidades/search
 *
 * Busca em comunidades, tópicos e mensagens.
 * SEMPRE retorna JSON válido.
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/comunidades/search
 * Busca global nas comunidades
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all'; // all, comunidades, topicos, mensagens

    // Mock: retorna resultados vazios por enquanto
    // TODO: Implementar busca real no Supabase
    return NextResponse.json({
      success: true,
      query,
      type,
      results: {
        comunidades: [],
        topicos: [],
        mensagens: [],
      },
      total: 0,
    });
  } catch (err) {
    console.error('[Search Error]', err);
    return NextResponse.json(
      { success: false, error: 'Erro na busca' },
      { status: 500 }
    );
  }
}
