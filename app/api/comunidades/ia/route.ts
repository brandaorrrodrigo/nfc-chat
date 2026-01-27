/**
 * API: IA Facilitadora
 * Path: /api/comunidades/ia
 *
 * Endpoint para respostas da IA nas comunidades.
 * SEMPRE retorna JSON valido.
 *
 * COMPORTAMENTO:
 * - POST: Analisa mensagem e decide se IA deve responder
 * - GET: Retorna pergunta do dia e status da IA
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  decidirIntervencao,
  gerarResposta,
  getPerguntaDoDia,
  getFaseAtual,
  diasDesdelancamento,
  getRespostaContextual,
} from '@/lib/ia';
import type { ContextoConversa, MensagemConversa } from '@/lib/ia';

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

    // Se pediu resposta contextual direta
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

    const contexto: ContextoConversa = {
      mensagens,
      topicoTitulo: body.topicoTitulo || '',
      comunidadeSlug: body.comunidadeSlug || '',
      ultimaIntervencaoIA: body.ultimaIntervencaoIA
        ? new Date(body.ultimaIntervencaoIA)
        : undefined,
      linksEnviadosHoje: body.linksEnviadosHoje || 0,
    };

    // Decidir se deve intervir
    const decisao = decidirIntervencao(contexto);

    // Se nao deve intervir, retorna sem resposta
    if (!decisao.deveIntervir) {
      return NextResponse.json({
        success: true,
        deveResponder: false,
        motivo: decisao.motivo,
        debug: {
          tipo: decisao.tipo,
          prioridade: decisao.prioridade,
        },
      });
    }

    // Gerar resposta
    const ultimaMensagem = mensagens[mensagens.length - 1];
    const resposta = gerarResposta(decisao, ultimaMensagem?.texto || '');

    if (!resposta) {
      return NextResponse.json({
        success: true,
        deveResponder: false,
        motivo: 'Nao foi possivel gerar resposta adequada',
      });
    }

    return NextResponse.json({
      success: true,
      deveResponder: true,
      resposta: {
        texto: resposta.texto,
        tipo: resposta.tipo,
        temLink: resposta.temLink,
        linkTipo: resposta.linkTipo,
      },
      decisao: {
        motivo: decisao.motivo,
        prioridade: decisao.prioridade,
        artigo: decisao.artigo
          ? {
              titulo: decisao.artigo.titulo,
              url: decisao.artigo.url,
            }
          : null,
      },
    });
  } catch (err) {
    console.error('[IA POST Error]', err);
    return NextResponse.json(
      { success: false, error: 'Erro ao processar mensagem' },
      { status: 500 }
    );
  }
}
