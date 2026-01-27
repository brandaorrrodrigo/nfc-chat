/**
 * CAMADA 2: FACILITADORA
 *
 * Intervem APENAS quando:
 * - Discussao empaca
 * - Tema se repete muito
 * - Informacao tecnica fica confusa
 *
 * Formato das intervencoes:
 * - Perguntas abertas
 * - Resumos curtos
 * - Destaques de usuarios
 *
 * A IA NAO:
 * - Responde tudo
 * - Da aula longa
 * - Disputa atencao
 * - Invalida relatos humanos
 */

import type {
  ObservacaoComunidade,
  UsuarioDestaque,
  PadraoDetectado,
} from './observer';

// ========================================
// TIPOS
// ========================================

export type TipoIntervencao =
  | 'nenhuma'           // NAO intervir
  | 'resumo'            // Resumir discussao
  | 'destaque_usuario'  // Destacar contribuicao humana
  | 'pergunta_aberta'   // Fazer pergunta para desempatar
  | 'ponte_blog'        // Direcionar para artigo
  | 'ponte_app';        // Mencionar app (sem CTA)

export interface DecisaoFacilitadora {
  deveIntervir: boolean;
  tipo: TipoIntervencao;
  urgencia: 'baixa' | 'media' | 'alta';
  motivo: string;
  dados: {
    usuarioDestaque?: UsuarioDestaque;
    padraoDetectado?: PadraoDetectado;
    temasTecnicos?: string[];
    resumoContexto?: string;
  };
}

export interface IntervencaoIA {
  tipo: TipoIntervencao;
  texto: string;
  metadados: {
    usuarioMencionado?: string;
    linkBlog?: string;
    temaRelacionado?: string;
  };
}

// ========================================
// CONFIGURACAO DE INTERVENCAO
// ========================================

export const CONFIG_FACILITADORA = {
  // Minimo de mensagens para considerar intervencao
  MIN_MENSAGENS: 8,

  // Taxa de frustracao para intervir
  LIMIAR_FRUSTRACAO: 0.25,

  // Mensagens desde ultima intervencao
  INTERVALO_MINIMO_MENSAGENS: 10,

  // Probabilidade de NÃO intervir mesmo quando poderia (para parecer natural)
  CHANCE_SILENCIO: 0.4,

  // Maximo de intervencoes por hora
  MAX_INTERVENCOES_HORA: 2,
};

// ========================================
// MOTOR DE DECISAO
// ========================================

/**
 * Decide se a IA deve intervir baseado na observacao
 */
export function decidirIntervencao(
  observacao: ObservacaoComunidade,
  mensagensDesdeUltimaIntervencao: number
): DecisaoFacilitadora {
  // Nao intervir se poucas mensagens
  if (observacao.totalMensagens < CONFIG_FACILITADORA.MIN_MENSAGENS) {
    return {
      deveIntervir: false,
      tipo: 'nenhuma',
      urgencia: 'baixa',
      motivo: 'Comunidade ainda em aquecimento',
      dados: {},
    };
  }

  // Respeitar intervalo minimo
  if (mensagensDesdeUltimaIntervencao < CONFIG_FACILITADORA.INTERVALO_MINIMO_MENSAGENS) {
    return {
      deveIntervir: false,
      tipo: 'nenhuma',
      urgencia: 'baixa',
      motivo: 'Intervalo minimo nao atingido',
      dados: {},
    };
  }

  // Aplicar chance de silencio (para parecer natural)
  if (Math.random() < CONFIG_FACILITADORA.CHANCE_SILENCIO) {
    return {
      deveIntervir: false,
      tipo: 'nenhuma',
      urgencia: 'baixa',
      motivo: 'Silencio estrategico',
      dados: {},
    };
  }

  // PRIORIDADE 1: Empate de discussao
  const empate = observacao.padroes.find((p) => p.tipo === 'empate_discussao');
  if (empate) {
    return {
      deveIntervir: true,
      tipo: 'pergunta_aberta',
      urgencia: 'alta',
      motivo: 'Discussao empacada - precisa de nova perspectiva',
      dados: { padraoDetectado: empate },
    };
  }

  // PRIORIDADE 2: Tema tecnico recorrente
  const temaTecnico = observacao.padroes.find(
    (p) => p.tipo === 'tema_tecnico' && p.frequencia >= 3
  );
  if (temaTecnico && observacao.temasAtivos.length > 0) {
    return {
      deveIntervir: true,
      tipo: 'ponte_blog',
      urgencia: 'media',
      motivo: 'Tema tecnico merece aprofundamento',
      dados: {
        padraoDetectado: temaTecnico,
        temasTecnicos: observacao.temasAtivos,
      },
    };
  }

  // PRIORIDADE 3: Destacar usuario com boa contribuicao
  if (observacao.usuariosDestaque.length > 0) {
    const melhor = observacao.usuariosDestaque[0];
    if (melhor.score >= 40) {
      return {
        deveIntervir: true,
        tipo: 'destaque_usuario',
        urgencia: 'baixa',
        motivo: 'Contribuicao valiosa merece destaque',
        dados: { usuarioDestaque: melhor },
      };
    }
  }

  // PRIORIDADE 4: Resumo quando muitas mensagens
  if (observacao.totalMensagens >= 20 && mensagensDesdeUltimaIntervencao >= 15) {
    return {
      deveIntervir: true,
      tipo: 'resumo',
      urgencia: 'baixa',
      motivo: 'Discussao longa merece sintese',
      dados: {
        resumoContexto: `${observacao.totalMensagens} mensagens, sentimento ${observacao.sentimentoGeral}`,
      },
    };
  }

  // PRIORIDADE 5: Frustracao alta = mencionar app (sem forcar)
  const frustracao = observacao.padroes.find((p) => p.tipo === 'frustracao');
  if (
    frustracao &&
    observacao.sentimentoGeral === 'frustrado' &&
    frustracao.frequencia >= 4
  ) {
    return {
      deveIntervir: true,
      tipo: 'ponte_app',
      urgencia: 'media',
      motivo: 'Frustracao recorrente - solucao pratica pode ajudar',
      dados: { padraoDetectado: frustracao },
    };
  }

  // DEFAULT: Nao intervir
  return {
    deveIntervir: false,
    tipo: 'nenhuma',
    urgencia: 'baixa',
    motivo: 'Conversa fluindo bem, IA em modo observacao',
    dados: {},
  };
}

// ========================================
// GERADOR DE INTERVENCOES
// ========================================

/**
 * Gera o texto da intervencao baseado na decisao
 */
export function gerarIntervencao(decisao: DecisaoFacilitadora): IntervencaoIA | null {
  if (!decisao.deveIntervir || decisao.tipo === 'nenhuma') {
    return null;
  }

  switch (decisao.tipo) {
    case 'resumo':
      return gerarResumo(decisao);

    case 'destaque_usuario':
      return gerarDestaqueUsuario(decisao);

    case 'pergunta_aberta':
      return gerarPerguntaAberta(decisao);

    case 'ponte_blog':
      return gerarPonteBlog(decisao);

    case 'ponte_app':
      return gerarPonteApp(decisao);

    default:
      return null;
  }
}

function gerarResumo(decisao: DecisaoFacilitadora): IntervencaoIA {
  const templates = [
    'Resumo do painel ate agora:',
    'O que a comunidade esta discutindo:',
    'Pontos principais da conversa:',
  ];

  const template = templates[Math.floor(Math.random() * templates.length)];

  return {
    tipo: 'resumo',
    texto: `${template} ${decisao.dados.resumoContexto || 'Discussao em andamento.'}`,
    metadados: {},
  };
}

function gerarDestaqueUsuario(decisao: DecisaoFacilitadora): IntervencaoIA {
  const usuario = decisao.dados.usuarioDestaque;
  if (!usuario) {
    return {
      tipo: 'destaque_usuario',
      texto: 'Otimas contribuicoes nessa discussao.',
      metadados: {},
    };
  }

  const templates: Record<UsuarioDestaque['motivo'], string[]> = {
    explicacao_clara: [
      `O comentario de ${usuario.autorNome} explicou isso de forma muito clara.`,
      `${usuario.autorNome} trouxe uma explicacao que vale a pena reler.`,
    ],
    ponto_importante: [
      `${usuario.autorNome} levantou um ponto importante aqui.`,
      `O que ${usuario.autorNome} disse merece atencao.`,
    ],
    sintese: [
      `${usuario.autorNome} sintetizou bem o que esta sendo discutido.`,
      `Boa sintese de ${usuario.autorNome}.`,
    ],
    experiencia_relevante: [
      `A experiencia que ${usuario.autorNome} compartilhou e muito relevante.`,
      `${usuario.autorNome} trouxe um relato pratico importante.`,
    ],
  };

  const opcoes = templates[usuario.motivo];
  const texto = opcoes[Math.floor(Math.random() * opcoes.length)];

  return {
    tipo: 'destaque_usuario',
    texto,
    metadados: { usuarioMencionado: usuario.autorNome },
  };
}

function gerarPerguntaAberta(decisao: DecisaoFacilitadora): IntervencaoIA {
  const perguntas = [
    'Alguem que passou por isso tem uma perspectiva diferente?',
    'O que mais poderia ser considerado aqui?',
    'Alguem encontrou uma abordagem que funcionou?',
    'Qual foi o maior desafio de voces nesse ponto?',
    'O que voces mudariam se pudessem voltar atras?',
  ];

  const pergunta = perguntas[Math.floor(Math.random() * perguntas.length)];

  return {
    tipo: 'pergunta_aberta',
    texto: pergunta,
    metadados: {},
  };
}

function gerarPonteBlog(decisao: DecisaoFacilitadora): IntervencaoIA {
  const temas = decisao.dados.temasTecnicos || [];
  const tema = temas[0] || 'esse assunto';

  // Mapeamento tema -> slug do blog
  const mapaBlog: Record<string, string> = {
    lipedema: '/blog/lipedema-guia-completo',
    'deficit calorico': '/blog/deficit-calorico-como-funciona',
    jejum: '/blog/jejum-intermitente-iniciantes',
    proteina: '/blog/proteina-quanto-consumir',
    ozempic: '/blog/canetas-emagrecimento',
    wegovy: '/blog/canetas-emagrecimento',
    semaglutida: '/blog/canetas-emagrecimento',
    tireoide: '/blog/tireoide-emagrecimento',
    hipertrofia: '/blog/treino-hipertrofia-mulheres',
  };

  const link = mapaBlog[tema] || '/blog';

  return {
    tipo: 'ponte_blog',
    texto: `Esse ponto sobre ${tema} e mais tecnico. Tem um artigo que explica em detalhes: ${link}`,
    metadados: {
      linkBlog: link,
      temaRelacionado: tema,
    },
  };
}

function gerarPonteApp(decisao: DecisaoFacilitadora): IntervencaoIA {
  const templates = [
    'Esse tipo de acompanhamento continuo e dificil de fazer sozinho. No app isso e organizado automaticamente.',
    'Quando o problema e organizacao do dia a dia, ter um sistema estruturado ajuda muito. O app foi feito pra isso.',
    'Essa dificuldade de consistencia e comum. No app, isso vira rotina personalizada.',
  ];

  const texto = templates[Math.floor(Math.random() * templates.length)];

  return {
    tipo: 'ponte_app',
    texto,
    metadados: {},
  };
}
