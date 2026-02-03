/**
 * API: Deteccao de Resposta a Intervencao da IA
 * Path: /api/comunidades/ia/resposta
 *
 * Endpoint para detectar quando um usuario responde a uma pergunta da IA.
 * Atualiza o tracking de intervencoes e probabilidades.
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { detectResponseToIntervention } from '@/lib/ia';

interface RequestBody {
  userId: string;
  comunidadeSlug: string;
  mensagem: string;
  messageId: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: RequestBody = await request.json();

    // Validacao basica
    if (!body.userId || !body.comunidadeSlug || !body.mensagem || !body.messageId) {
      return NextResponse.json(
        { success: false, error: 'Campos obrigatorios: userId, comunidadeSlug, mensagem, messageId' },
        { status: 400 }
      );
    }

    // Obter credenciais do Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn('[IA Resposta] Supabase nao configurado, pulando tracking');
      return NextResponse.json({
        success: true,
        wasResponse: false,
        message: 'Tracking desabilitado (Supabase nao configurado)',
      });
    }

    // Detectar se a mensagem e uma resposta a uma intervencao pendente
    const wasResponse = await detectResponseToIntervention(
      body.userId,
      body.comunidadeSlug,
      body.mensagem,
      body.messageId,
      supabaseUrl,
      supabaseKey
    );

    return NextResponse.json({
      success: true,
      wasResponse,
      message: wasResponse
        ? 'Resposta detectada e registrada'
        : 'Nao identificada como resposta a intervencao',
    });
  } catch (err) {
    console.error('[IA Resposta Error]', err);
    return NextResponse.json(
      { success: false, error: 'Erro ao processar resposta' },
      { status: 500 }
    );
  }
}
