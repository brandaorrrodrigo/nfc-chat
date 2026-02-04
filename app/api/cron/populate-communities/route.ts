/**
 * API ROUTE: CRON JOB DE POVOAMENTO
 *
 * Endpoint: /api/cron/populate-communities
 * Método: POST
 *
 * Uso:
 * - Vercel Cron: Configurar em vercel.json
 * - Manual: POST /api/cron/populate-communities com Authorization header
 *
 * Segurança:
 * - Requer CRON_SECRET em headers
 */

import { NextRequest, NextResponse } from 'next/server';
import { povoarTodasAsArenas, povoarArenaEspecifica } from '@/scripts/populate-communities';

// ============================================
// CONFIGURAÇÃO
// ============================================

const CRON_SECRET = process.env.CRON_SECRET || 'dev_secret_change_in_production';

// ============================================
// POST HANDLER
// ============================================

export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticação
    const authHeader = request.headers.get('authorization');

    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Obter parâmetros (opcional)
    const body = await request.json().catch(() => ({}));
    const { arena, quantidade } = body;

    console.log('[CRON] Iniciando povoamento automático...');
    console.log('  Arena específica:', arena || 'todas');
    console.log('  Quantidade:', quantidade || 'padrão');

    // 3. Executar povoamento
    let resultado;

    if (arena) {
      // Povoar arena específica
      await povoarArenaEspecifica(arena, quantidade || 1);
      resultado = {
        success: true,
        arena,
        quantidade: quantidade || 1,
        timestamp: new Date().toISOString(),
      };
    } else {
      // Povoar todas as arenas
      await povoarTodasAsArenas();
      resultado = {
        success: true,
        arena: 'todas',
        timestamp: new Date().toISOString(),
      };
    }

    console.log('[CRON] Povoamento concluído com sucesso!');

    return NextResponse.json(resultado, { status: 200 });
  } catch (error) {
    console.error('[CRON] Erro ao executar povoamento:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// ============================================
// GET HANDLER (para testes)
// ============================================

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/cron/populate-communities',
    usage: {
      method: 'POST',
      headers: {
        authorization: 'Bearer CRON_SECRET',
      },
      body: {
        arena: 'slug da arena (opcional)',
        quantidade: 'número de threads (opcional)',
      },
    },
    examples: [
      {
        description: 'Povoar todas as arenas (1 thread cada)',
        body: {},
      },
      {
        description: 'Povoar arena específica (1 thread)',
        body: { arena: 'emagrecimento-saudavel' },
      },
      {
        description: 'Povoar arena específica (5 threads)',
        body: { arena: 'ganho-massa-muscular', quantidade: 5 },
      },
    ],
  });
}
