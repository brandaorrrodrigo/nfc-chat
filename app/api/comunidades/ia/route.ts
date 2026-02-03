/**
 * API: IA Facilitadora (v2)
 * Path: /api/comunidades/ia
 *
 * Endpoint para respostas da IA nas comunidades.
 * SEMPRE retorna JSON valido.
 *
 * COMPORTAMENTO:
 * - POST: Analisa mensagem e decide se IA deve responder
 *         Agora com anti-spam robusto e follow-up obrigatorio
 * - GET: Retorna pergunta do dia e status da IA
 *
 * ANTI-SPAM (v2):
 * - 8+ mensagens humanas antes de intervir
 * - Cooldown de 10 minutos por usuario
 * - Maximo 2 intervencoes/dia/usuario
 * - Probabilidade ajustavel (40% base, reduz se ignora perguntas)
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import {
  decidirEResponder,
  getPerguntaDoDia,
  getFaseAtual,
  diasDesdelancamento,
  getRespostaContextual,
  ANTI_SPAM_CONFIG,
} from '@/lib/ia';
import type { MensagemConversa } from '@/lib/ia';

// ========================================
// GET - Status e Pergunta do Dia
// ========================================

export async function GET(): Promise<NextResponse> {
  try {
    return NextResponse.json({
      success: true,
      ia: {
        status: 'ativa',
        fase: getFaseAtual(),
        diasAtiva: diasDesdelancamento(),
        perguntaDoDia: getPerguntaDoDia(),
        proximaIntervencao: null, // Calculado dinamicamente
        antiSpamConfig: {
          minHumanMessages: ANTI_SPAM_CONFIG.MIN_HUMAN_MESSAGES,
          cooldownMinutes: ANTI_SPAM_CONFIG.COOLDOWN_MINUTES,
          maxDailyInterventions: ANTI_SPAM_CONFIG.MAX_DAILY_INTERVENTIONS,
          baseProbability: ANTI_SPAM_CONFIG.BASE_PROBABILITY,
        },
      },
    });
  } catch (err) {
    console.error('[IA GET Error]', err);
    return NextResponse.json(
      { success: false, error: 'Erro ao obter status da IA' },
      { status: 500 }
    );
  }
}

// ========================================
// POST - Analisar e Gerar Resposta
// ========================================

interface RequestBody {
  mensagens: Array<{
    id: string;
    texto: string;
    autorId: string;
    autorNome: string;
    isIA: boolean;
    timestamp: string;
  }>;
  topicoTitulo: string;
  comunidadeSlug: string;
  ultimaIntervencaoIA?: string;
  linksEnviadosHoje?: number;
  // Novo: ID do usuario que enviou a ultima mensagem
  userId: string;
  // Opcional: categoria para resposta contextual
  categoria?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: RequestBody = await request.json();

    // Validacao basica
    if (!body.mensagens || !Array.isArray(body.mensagens)) {
      return NextResponse.json(
        { success: false, error: 'Campo mensagens e obrigatorio' },
        { status: 400 }
      );
    }

    if (!body.userId) {
      return NextResponse.json(
        { success: false, error: 'Campo userId e obrigatorio' },
        { status: 400 }
      );
    }

    // Se pediu resposta contextual direta (bypass anti-spam)
    if (body.categoria) {
      const resposta = getRespostaContextual(body.categoria);
      if (resposta) {
        return NextResponse.json({
          success: true,
          deveResponder: true,
          resposta: {
            texto: resposta,
            tipo: 'facilitacao',
            temLink: false,
          },
        });
      }
    }

    // Converter para formato interno
    const mensagens: MensagemConversa[] = body.mensagens.map((m) => ({
      id: m.id,
      texto: m.texto,
      autorId: m.autorId,
      autorNome: m.autorNome,
      isIA: m.isIA,
      timestamp: new Date(m.timestamp),
    }));

    // Obter credenciais do Supabase (se disponiveis)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // USAR NOVA FUNCAO: decidirEResponder (v2)
    // Integra anti-spam + decisao + follow-up em uma unica chamada
    const resultado = await decidirEResponder({
      mensagens,
      topicoTitulo: body.topicoTitulo || '',
      comunidadeSlug: body.comunidadeSlug || '',
      ultimaIntervencaoIA: body.ultimaIntervencaoIA
        ? new Date(body.ultimaIntervencaoIA)
        : undefined,
      linksEnviadosHoje: body.linksEnviadosHoje || 0,
      userId: body.userId,
      supabaseUrl,
      supabaseKey,
    });

    // Se nao deve responder
    if (!resultado.deveResponder) {
      return NextResponse.json({
        success: true,
        deveResponder: false,
        motivo: resultado.motivo,
        antiSpam: resultado.antiSpamResult ? {
          canIntervene: resultado.antiSpamResult.canIntervene,
          reason: resultado.antiSpamResult.reason,
          stats: resultado.antiSpamResult.stats,
        } : null,
      });
    }

    // Retornar resposta com follow-up
    return NextResponse.json({
      success: true,
      deveResponder: true,
      resposta: {
        texto: resultado.resposta,
        tipo: resultado.tipo,
        temLink: resultado.tipo === 'blog' || resultado.tipo === 'app',
        linkTipo: resultado.tipo === 'blog' ? 'blog' : resultado.tipo === 'app' ? 'app' : undefined,
        followUpQuestion: resultado.followUpQuestion,
      },
      interventionId: resultado.interventionId,
      motivo: resultado.motivo,
      antiSpam: resultado.antiSpamResult ? {
        adjustedProbability: resultado.antiSpamResult.adjustedProbability,
        stats: resultado.antiSpamResult.stats,
      } : null,
    });
  } catch (err) {
    console.error('[IA POST Error]', err);
    return NextResponse.json(
      { success: false, error: 'Erro ao processar mensagem' },
      { status: 500 }
    );
  }
}
