/**
 * IA Decision Engine - Motor de Decisao
 *
 * Determina QUANDO e COMO a IA deve intervir nas conversas.
 *
 * PRINCIPIOS:
 * 1. Valor da conversa acima de tudo
 * 2. Blog como extensao natural do debate
 * 3. App como solucao pratica final (nao primeira opcao)
 *
 * NUNCA:
 * - Misturar blog e app na mesma resposta
 * - Usar linguagem de marketing
 * - Interromper conversas desnecessariamente
 */

import {
  contemTopicoTecnico,
  contemFrustracao,
  buscarArtigoRelevante,
  TEMPLATES_IA,
  CONFIG_INTERVENCAO,
  ArtigoBlog,
} from '@/app/comunidades/config/ia-facilitadora';

// ========================================
// TIPOS
// ========================================

export type TipoResposta =
  | 'nenhuma' // IA nao deve intervir
  | 'facilitacao' // Complemento sem links
  | 'blog' // Indicar artigo do blog
  | 'app' // Indicar app (empatico)
  | 'correcao'; // Corrigir informacao errada

export interface DecisaoIA {
  deveIntervir: boolean;
  tipo: TipoResposta;
  prioridade: number; // 1-10, maior = mais urgente
  motivo: string;
  artigo?: ArtigoBlog;
  contexto?: string;
}

export interface ContextoConversa {
  mensagens: MensagemConversa[];
  topicoTitulo: string;
  comunidadeSlug: string;
  ultimaIntervencaoIA?: Date;
  linksEnviadosHoje: number;
}

export interface MensagemConversa {
  id: string;
  texto: string;
  autorId: string;
  autorNome: string;
  isIA: boolean;
  timestamp: Date;
}

// ========================================
// ANALISE DE MENSAGEM
// ========================================

/**
 * Analisa uma mensagem individual
 */
function analisarMensagem(texto: string): {
  temTopicoTecnico: boolean;
  temFrustracao: boolean;
  temPergunta: boolean;
  temMito: boolean;
  artigo: ArtigoBlog | null;
} {
  const temPergunta = texto.includes('?') ||
    texto.toLowerCase().includes('como') ||
    texto.toLowerCase().includes('porque') ||
    texto.toLowerCase().includes('qual') ||
    texto.toLowerCase().includes('quando') ||
    texto.toLowerCase().includes('quanto');

  // Detectar mitos comuns
  const mitos = [
    'carboidrato engorda',
    'nao pode comer a noite',
    'fruta engorda',
    'ovo faz mal',
    'gordura faz mal',
    'so cardio emagrece',
    'jejum queima musculo',
    'metabolismo lento',
  ];
  const temMito = mitos.some((mito) => texto.toLowerCase().includes(mito));

  return {
    temTopicoTecnico: contemTopicoTecnico(texto),
    temFrustracao: contemFrustracao(texto),
    temPergunta,
    temMito,
    artigo: buscarArtigoRelevante(texto),
  };
}

// ========================================
// MOTOR DE DECISAO PRINCIPAL
// ========================================

/**
 * Decide se a IA deve intervir e como
 */
export function decidirIntervencao(contexto: ContextoConversa): DecisaoIA {
  const { mensagens, ultimaIntervencaoIA, linksEnviadosHoje } = contexto;

  // Sem mensagens = nada a fazer
  if (mensagens.length === 0) {
    return {
      deveIntervir: false,
      tipo: 'nenhuma',
      prioridade: 0,
      motivo: 'Sem mensagens para analisar',
    };
  }

  // Ultima mensagem
  const ultimaMensagem = mensagens[mensagens.length - 1];

  // Nao responder a si mesma
  if (ultimaMensagem.isIA) {
    return {
      deveIntervir: false,
      tipo: 'nenhuma',
      prioridade: 0,
      motivo: 'Ultima mensagem e da propria IA',
    };
  }

  // Respeitar intervalo minimo
  if (ultimaIntervencaoIA) {
    const tempoDesdeUltima = Date.now() - ultimaIntervencaoIA.getTime();
    if (tempoDesdeUltima < CONFIG_INTERVENCAO.INTERVALO_MINIMO_MS) {
      return {
        deveIntervir: false,
        tipo: 'nenhuma',
        prioridade: 0,
        motivo: 'Intervalo minimo nao atingido',
      };
    }
  }

  // Minimo de mensagens na conversa
  const mensagensHumanas = mensagens.filter((m) => !m.isIA);
  if (mensagensHumanas.length < CONFIG_INTERVENCAO.MIN_MENSAGENS_ANTES_INTERVENCAO) {
    return {
      deveIntervir: false,
      tipo: 'nenhuma',
      prioridade: 0,
      motivo: 'Conversa ainda em desenvolvimento',
    };
  }

  // Analisar ultima mensagem
  const analise = analisarMensagem(ultimaMensagem.texto);

  // PRIORIDADE 1: Correcao de mito (mais importante)
  if (analise.temMito) {
    return {
      deveIntervir: true,
      tipo: 'correcao',
      prioridade: 9,
      motivo: 'Detectado mito que precisa correcao',
      artigo: analise.artigo || undefined,
      contexto: ultimaMensagem.texto,
    };
  }

  // PRIORIDADE 2: Frustracao = App (empatico)
  if (analise.temFrustracao && !analise.temTopicoTecnico) {
    // Verificar se ja enviou muitos links hoje
    if (linksEnviadosHoje >= CONFIG_INTERVENCAO.MAX_LINKS_DIA_USUARIO) {
      return {
        deveIntervir: true,
        tipo: 'facilitacao',
        prioridade: 7,
        motivo: 'Usuario frustrado, mas limite de links atingido',
        contexto: 'Entendo sua frustracao. Manter a consistencia e o maior desafio, e voce nao esta sozinho nisso.',
      };
    }

    return {
      deveIntervir: true,
      tipo: 'app',
      prioridade: 8,
      motivo: 'Usuario demonstra frustracao ou necessidade de acompanhamento',
      contexto: 'Entendo. Quando a gente tenta fazer tudo de cabeca, fica dificil manter a consistencia.',
    };
  }

  // PRIORIDADE 3: Topico tecnico = Blog
  if (analise.temTopicoTecnico && analise.temPergunta && analise.artigo) {
    // Verificar limite de links
    if (linksEnviadosHoje >= CONFIG_INTERVENCAO.MAX_LINKS_DIA_USUARIO) {
      return {
        deveIntervir: true,
        tipo: 'facilitacao',
        prioridade: 6,
        motivo: 'Pergunta tecnica, mas limite de links atingido',
      };
    }

    return {
      deveIntervir: true,
      tipo: 'blog',
      prioridade: 7,
      motivo: 'Pergunta tecnica com artigo relevante disponivel',
      artigo: analise.artigo,
    };
  }

  // PRIORIDADE 4: Pergunta direta = Facilitacao
  if (analise.temPergunta) {
    // Intervencao probabilistica para nao parecer bot
    const random = Math.random();
    if (random > CONFIG_INTERVENCAO.PROBABILIDADE_INTERVENCAO) {
      return {
        deveIntervir: false,
        tipo: 'nenhuma',
        prioridade: 0,
        motivo: 'Pergunta detectada, mas deixando espaco para comunidade',
      };
    }

    return {
      deveIntervir: true,
      tipo: 'facilitacao',
      prioridade: 5,
      motivo: 'Pergunta que pode ser complementada',
    };
  }

  // DEFAULT: Nao intervir
  return {
    deveIntervir: false,
    tipo: 'nenhuma',
    prioridade: 0,
    motivo: 'Conversa fluindo naturalmente, sem necessidade de intervencao',
  };
}

// ========================================
// GERADOR DE RESPOSTAS
// ========================================

export interface RespostaIA {
  texto: string;
  tipo: TipoResposta;
  temLink: boolean;
  linkTipo?: 'blog' | 'app';
}

/**
 * Gera resposta da IA baseada na decisao
 */
export function gerarResposta(
  decisao: DecisaoIA,
  mensagemOriginal: string
): RespostaIA | null {
  if (!decisao.deveIntervir || decisao.tipo === 'nenhuma') {
    return null;
  }

  switch (decisao.tipo) {
    case 'blog':
      if (!decisao.artigo) {
        return {
          texto: TEMPLATES_IA.FACILITACAO(
            'Boa pergunta! Este e um tema que merece aprofundamento.'
          ),
          tipo: 'facilitacao',
          temLink: false,
        };
      }
      return {
        texto: TEMPLATES_IA.BLOG_TECNICO(
          'Resumindo de forma pratica: a chave esta em entender o mecanismo antes de aplicar.',
          decisao.artigo
        ),
        tipo: 'blog',
        temLink: true,
        linkTipo: 'blog',
      };

    case 'app':
      return {
        texto: TEMPLATES_IA.APP_EMPATICO(decisao.contexto || 'Entendo sua situacao.'),
        tipo: 'app',
        temLink: true,
        linkTipo: 'app',
      };

    case 'correcao':
      return {
        texto: TEMPLATES_IA.CORRECAO_MITO(
          'essa crenca',
          'A ciencia mostra que o contexto geral da dieta e o que importa, nao alimentos isolados.',
          decisao.artigo
        ),
        tipo: 'correcao',
        temLink: !!decisao.artigo,
        linkTipo: decisao.artigo ? 'blog' : undefined,
      };

    case 'facilitacao':
    default:
      return {
        texto: TEMPLATES_IA.FACILITACAO(
          decisao.contexto || 'Ponto interessante! O que mais a comunidade pensa sobre isso?'
        ),
        tipo: 'facilitacao',
        temLink: false,
      };
  }
}

// ========================================
// RESPOSTAS PRE-DEFINIDAS POR CONTEXTO
// ========================================

export const RESPOSTAS_CONTEXTUAIS: Record<string, string[]> = {
  // Emagrecimento
  emagrecimento: [
    'O deficit calorico e a base, mas a forma como voce chega nele faz toda diferenca na sustentabilidade.',
    'Perder peso rapido vs perder gordura de verdade sao coisas diferentes. Foco em composicao corporal.',
    'A balanca e so um dos indicadores. Medidas, roupas e energia contam muito tambem.',
  ],

  // Hipertrofia
  hipertrofia: [
    'Progressao de carga + proteina adequada + descanso. A triade basica que funciona.',
    'Treino e o estimulo, comida e o combustivel, descanso e quando o musculo cresce de verdade.',
    'Consistencia supera intensidade no longo prazo. Melhor treinar 4x/semana todo mes do que 7x uma semana e parar.',
  ],

  // Nutricao
  nutricao: [
    'Nao existe alimento magico ou proibido. Existe contexto e quantidade.',
    'A melhor dieta e aquela que voce consegue manter. Sustentabilidade > perfeicao.',
    'Flexibilidade metabolica e o objetivo: seu corpo usar bem tanto carbo quanto gordura.',
  ],

  // Motivacao
  motivacao: [
    'Disciplina > motivacao. Motivacao vai e vem, habito permanece.',
    'Pequenas vitorias diarias constroem grandes transformacoes.',
    'Comparar com quem voce era ontem, nao com os outros.',
  ],
};

/**
 * Obtem resposta contextual aleatoria
 */
export function getRespostaContextual(categoria: string): string | null {
  const respostas = RESPOSTAS_CONTEXTUAIS[categoria];
  if (!respostas || respostas.length === 0) return null;

  const indice = Math.floor(Math.random() * respostas.length);
  return respostas[indice];
}
