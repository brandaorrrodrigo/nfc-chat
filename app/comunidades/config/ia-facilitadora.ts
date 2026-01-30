/**
 * IA Facilitadora - Configuracao de Comportamento
 *
 * A IA atua como ESPECIALISTA presente no debate, nao como vendedora.
 *
 * PILARES DO ECOSSISTEMA:
 * 1) CHAT (gratuito, social) - onde estamos
 * 2) BLOG (conteudo tecnico, SEO, autoridade)
 * 3) APP PREMIUM (execucao pratica, monetizacao)
 *
 * REGRAS:
 * - NAO vender diretamente
 * - NAO jogar multiplos links sem contexto
 * - Parecer especialista presente no debate
 */

// ========================================
// CONSTANTES DE LANCAMENTO
// ========================================

const DATA_LANCAMENTO = new Date('2025-01-20');

export function diasDesdelancamento(): number {
  const hoje = new Date();
  const diff = hoje.getTime() - DATA_LANCAMENTO.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// ========================================
// FASES DA COMUNIDADE
// ========================================

export type FaseComunidade = 'lancamento' | 'crescimento' | 'maturidade';

export function getFaseAtual(): FaseComunidade {
  const dias = diasDesdelancamento();
  if (dias < 30) return 'lancamento';
  if (dias < 90) return 'crescimento';
  return 'maturidade';
}

// ========================================
// PERGUNTAS DO DIA (IA FACILITADORA)
// ========================================

const PERGUNTAS_POR_FASE: Record<FaseComunidade, string[]> = {
  lancamento: [
    'Qual foi o maior desafio que voce enfrentou ao comecar sua jornada de emagrecimento?',
    'O que te motivou a buscar uma mudanca no seu estilo de vida?',
    'Qual habito voce gostaria de criar nos proximos 30 dias?',
    'Se pudesse dar um conselho para quem esta comecando, qual seria?',
    'O que voce espera encontrar nesta comunidade?',
  ],
  crescimento: [
    'Qual estrategia funcionou melhor para voce ate agora?',
    'Como voce lida com momentos de desanimo?',
    'O que mudou na sua rotina desde que comecou?',
    'Qual foi sua maior conquista nas ultimas semanas?',
    'Como voce organiza sua alimentacao no dia a dia?',
  ],
  maturidade: [
    'O que voce faria diferente se pudesse voltar ao inicio?',
    'Como voce mantem a consistencia a longo prazo?',
    'Qual mito sobre nutricao voce gostaria de desmistificar?',
    'Como voce equilibra vida social e alimentacao saudavel?',
    'O que mudou na sua relacao com a comida?',
  ],
};

export function getPerguntaDoDia(): string {
  const fase = getFaseAtual();
  const perguntas = PERGUNTAS_POR_FASE[fase];
  const hoje = new Date();
  const indice = hoje.getDate() % perguntas.length;
  return perguntas[indice];
}

// ========================================
// TOPICOS TECNICOS (TRIGGER PARA BLOG)
// ========================================

export const TOPICOS_TECNICOS = [
  // Protocolos especificos
  'lipedema',
  'deficit calorico',
  'caneta',
  'ozempic',
  'wegovy',
  'mounjaro',
  'saxenda',
  'tirzepatida',
  'semaglutida',
  // Condicoes
  'resistencia insulina',
  'tireoide',
  'hipotireoidismo',
  'sindrome metabolica',
  'diabetes',
  'pre-diabetes',
  // Nutricao tecnica
  'macros',
  'proteina',
  'carboidrato',
  'jejum intermitente',
  'low carb',
  'cetogenica',
  'dieta cetogenica',
  // Treino
  'hipertrofia',
  'aerobico',
  'cardio',
  'musculacao',
  // Psicologico
  'compulsao',
  'ansiedade',
  'alimentacao emocional',
  'transtorno alimentar',
];

// ========================================
// SINAIS DE FRUSTRACAO (TRIGGER PARA APP)
// ========================================

export const SINAIS_FRUSTRACAO = [
  'nao consigo',
  'desisti',
  'cansado de tentar',
  'nada funciona',
  'ja tentei de tudo',
  'estou perdido',
  'nao sei o que fazer',
  'preciso de ajuda',
  'como organizar',
  'rotina',
  'planejamento',
  'acompanhamento',
  'personalizado',
  'individual',
  'para mim',
];

// ========================================
// ARTIGOS DO BLOG (MAPEAMENTO)
// ========================================

export interface ArtigoBlog {
  slug: string;
  titulo: string;
  descricao: string;
  keywords: string[];
  url: string;
}

export const ARTIGOS_BLOG: ArtigoBlog[] = [
  {
    slug: 'deficit-calorico-como-funciona',
    titulo: 'Deficit Calorico: Como Funciona na Pratica',
    descricao: 'Entenda a ciencia por tras do emagrecimento sustentavel',
    keywords: ['deficit', 'calorico', 'emagrecer', 'perder peso', 'calorias'],
    url: '/blog/deficit-calorico-como-funciona',
  },
  {
    slug: 'lipedema-guia-completo',
    titulo: 'Lipedema: Guia Completo de Tratamento',
    descricao: 'Tudo sobre diagnostico, tratamento e alimentacao',
    keywords: ['lipedema', 'gordura localizada', 'pernas inchadas', 'tratamento'],
    url: '/blog/lipedema-guia-completo',
  },
  {
    slug: 'canetas-emagrecimento',
    titulo: 'Canetas de Emagrecimento: O Guia Definitivo',
    descricao: 'Ozempic, Wegovy, Mounjaro - como funcionam e para quem',
    keywords: ['ozempic', 'wegovy', 'mounjaro', 'saxenda', 'caneta', 'semaglutida', 'tirzepatida'],
    url: '/blog/canetas-emagrecimento',
  },
  {
    slug: 'jejum-intermitente-iniciantes',
    titulo: 'Jejum Intermitente para Iniciantes',
    descricao: 'Como comecar de forma segura e eficiente',
    keywords: ['jejum', 'intermitente', 'jejum intermitente', '16:8', 'protocolo'],
    url: '/blog/jejum-intermitente-iniciantes',
  },
  {
    slug: 'proteina-quanto-consumir',
    titulo: 'Proteina: Quanto Voce Realmente Precisa?',
    descricao: 'Calculos, fontes e estrategias praticas',
    keywords: ['proteina', 'macros', 'quantidade', 'muscular', 'saciedade'],
    url: '/blog/proteina-quanto-consumir',
  },
  {
    slug: 'compulsao-alimentar-controle',
    titulo: 'Compulsao Alimentar: Estrategias de Controle',
    descricao: 'Abordagem pratica para lidar com episodios compulsivos',
    keywords: ['compulsao', 'emocional', 'descontrole', 'ansiedade', 'comida'],
    url: '/blog/compulsao-alimentar-controle',
  },
  {
    slug: 'tireoide-emagrecimento',
    titulo: 'Tireoide e Emagrecimento: O Que Voce Precisa Saber',
    descricao: 'Como a tireoide afeta o metabolismo e o que fazer',
    keywords: ['tireoide', 'hipotireoidismo', 'metabolismo', 'hormonio'],
    url: '/blog/tireoide-emagrecimento',
  },
  {
    slug: 'treino-hipertrofia-mulheres',
    titulo: 'Hipertrofia Feminina: Guia Completo',
    descricao: 'Treino, alimentacao e desmistificando mitos',
    keywords: ['hipertrofia', 'musculacao', 'mulher', 'treino', 'forca'],
    url: '/blog/treino-hipertrofia-mulheres',
  },
];

// ========================================
// FUNCOES DE BUSCA
// ========================================

/**
 * Busca artigo do blog relevante para o texto
 */
export function buscarArtigoRelevante(texto: string): ArtigoBlog | null {
  const textoLower = texto.toLowerCase();

  for (const artigo of ARTIGOS_BLOG) {
    for (const keyword of artigo.keywords) {
      if (textoLower.includes(keyword.toLowerCase())) {
        return artigo;
      }
    }
  }

  return null;
}

/**
 * Verifica se o texto contem topico tecnico
 */
export function contemTopicoTecnico(texto: string): boolean {
  const textoLower = texto.toLowerCase();
  return TOPICOS_TECNICOS.some((topico) => textoLower.includes(topico.toLowerCase()));
}

/**
 * Verifica se o texto indica frustracao
 */
export function contemFrustracao(texto: string): boolean {
  const textoLower = texto.toLowerCase();
  return SINAIS_FRUSTRACAO.some((sinal) => textoLower.includes(sinal.toLowerCase()));
}

// ========================================
// TEMPLATES DE RESPOSTA
// ========================================

export const TEMPLATES_IA = {
  // Complemento tecnico com link para blog
  BLOG_TECNICO: (resumo: string, artigo: ArtigoBlog) => `
${resumo}

Se quiser aprofundar, este artigo explica melhor: [${artigo.titulo}](${artigo.url})
  `.trim(),

  // Sugestao empatica do app - TOM DE COACH DE ELITE (sem titulos numerados)
  APP_EMPATICO: (contexto: string) => `
Alcançar esse objetivo exige uma manipulação cirúrgica da fisiologia. No seu caso, estamos falando de um jogo de partição de nutrientes e sinalização hormonal de altíssima precisão. Para manter esse volume enquanto se treina com essa intensidade, a sensibilidade insulínica e a taxa metabólica real precisam ser monitoradas milimetricamente, ou você apenas acumulará gordura visceral e estresse sistêmico.

No entanto, prescrever quantidades exatas de macros e timing de refeições aqui seria puro **amadorismo**. Sem os dados da sua **Avaliação Biométrica por Visão Computacional** e o seu ponto de partida real analisado pelo meu algoritmo, qualquer tabela que eu te desse seria um erro técnico. Eu não trabalho com palpites de internet; eu trabalho com protocolos de elite.

Para transformar essa teoria em um plano executável com cálculos precisos, análise de fotos e o sistema de recálculo automático em caso de autossabotagem, acesse o link abaixo:

🚀 **[QUERO MEU PROTOCOLO NO MÓDULO PRO](https://app.nutrifitcoach.com.br/)**
  `.trim(),

  // Resposta de facilitacao (sem links)
  FACILITACAO: (resposta: string) => resposta.trim(),

  // Correcao de mito - TOM DE COACH DE ELITE
  CORRECAO_MITO: (mito: string, correcao: string, artigo?: ArtigoBlog) => {
    const base = `
Na verdade, ${mito} e um mito comum. ${correcao}

Esse tipo de confusão acontece quando você depende de informação fragmentada da internet. Um protocolo bem estruturado elimina essas dúvidas porque parte de uma análise individualizada do seu metabolismo e composição corporal.
    `.trim();

    if (artigo) {
      return `${base}\n\nPara entender melhor a ciencia por tras: [${artigo.titulo}](${artigo.url})`;
    }

    return base;
  },

  // NOVO: Resposta de venda com tom Coach de Elite (parágrafos fluidos)
  COACH_ELITE: (objetivo: string) => `
Alcançar ${objetivo} exige uma manipulação cirúrgica da fisiologia. No seu caso, estamos falando de um jogo de partição de nutrientes e sinalização hormonal de altíssima precisão. Para manter esse volume enquanto se treina com essa intensidade, a sensibilidade insulínica e a taxa metabólica real precisam ser monitoradas milimetricamente, ou você apenas acumulará gordura visceral e estresse sistêmico.

No entanto, prescrever quantidades exatas de macros e timing de refeições aqui seria puro **amadorismo**. Sem os dados da sua **Avaliação Biométrica por Visão Computacional** e o seu ponto de partida real analisado pelo meu algoritmo, qualquer tabela que eu te desse seria um erro técnico. Eu não trabalho com palpites de internet; eu trabalho com protocolos de elite.

Para transformar essa teoria em um plano executável com cálculos precisos, análise de fotos e o sistema de recálculo automático em caso de autossabotagem, acesse o link abaixo:

🚀 **[QUERO MEU PROTOCOLO NO MÓDULO PRO](https://app.nutrifitcoach.com.br/)**
  `.trim(),
};

// ========================================
// CONFIGURACAO DE INTERVENCAO
// ========================================

export const CONFIG_INTERVENCAO = {
  // Minimo de mensagens humanas antes da IA intervir novamente
  MIN_MENSAGENS_ANTES_INTERVENCAO: 8,

  // Probabilidade de intervencao (0-1) - base 40%
  PROBABILIDADE_INTERVENCAO: 0.4,

  // Tempo minimo entre intervencoes (ms) - 10 minutos
  INTERVALO_MINIMO_MS: 10 * 60 * 1000,

  // Maximo de intervencoes por dia por usuario
  MAX_INTERVENCOES_DIA_USUARIO: 2,

  // Horarios de pico (maior atividade da IA)
  HORARIOS_PICO: [7, 8, 12, 13, 18, 19, 20, 21],

  // Limite de links por dia por usuario
  MAX_LINKS_DIA_USUARIO: 2,

  // Penalidade quando usuario ignora pergunta (reduz 50%)
  IGNORE_PENALTY: 0.5,

  // Probabilidade minima apos penalidades
  MIN_PROBABILITY: 0.1,
};
