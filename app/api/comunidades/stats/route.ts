/**
 * API: Stats
 * Path: /api/comunidades/stats
 *
 * Estatísticas globais e por comunidade.
 * SEMPRE retorna JSON válido.
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/comunidades/stats
 * Retorna estatísticas globais ou de uma comunidade específica
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    // Mock: estatísticas fixas por enquanto
    // TODO: Implementar contagem real no Supabase
    if (slug) {
      // Estatísticas de comunidade específica
      return NextResponse.json({
        success: true,
        slug,
        stats: {
          membros: Math.floor(Math.random() * 500) + 50,
          topicos: Math.floor(Math.random() * 100) + 10,
          mensagens: Math.floor(Math.random() * 2000) + 100,
          online: Math.floor(Math.random() * 50) + 5,
        },
      });
    }

    // Estatísticas globais
    return NextResponse.json({
      success: true,
      global: {
        totalComunidades: 12,
        totalMembros: 3420,
        totalMensagens: 15680,
        online: 127,
      },
    });
  } catch (err) {
    console.error('[Stats Error]', err);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    );
  }
}
