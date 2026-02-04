/**
 * API ROUTE: CRON JOB DE POVOAMENTO
 *
 * NOTA: Esta rota foi desativada porque o sistema de povoamento de comunidades
 * foi concluído manualmente via SQL direto no Supabase.
 * As 16 comunidades já estão criadas e ativas no banco de dados.
 *
 * Endpoint: /api/cron/populate-communities
 * Status: DESATIVADO
 */

import { NextResponse } from 'next/server';

// Comentado - Povoamento concluído manualmente via Supabase Studio
// import { povoarTodasAsArenas, povoarArenaEspecifica } from '@/scripts/populate-communities';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    message: 'Rota de povoamento desativada - Processamento manual concluído',
    details: {
      communities_created: 16,
      method: 'Manual SQL via Supabase Studio',
      timestamp: new Date().toISOString(),
      note: 'Todas as 16 comunidades foram criadas diretamente no banco de dados Supabase'
    }
  });
}

export async function POST() {
  return NextResponse.json({
    status: 'success',
    message: 'Rota de povoamento desativada - Processamento manual concluído',
    details: {
      communities_created: 16,
      method: 'Manual SQL via Supabase Studio',
      timestamp: new Date().toISOString(),
      note: 'Todas as 16 comunidades foram criadas diretamente no banco de dados Supabase'
    }
  });
}
