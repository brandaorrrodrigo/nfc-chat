/**
 * Follow-Up Question Generator
 *
 * Gera perguntas de follow-up personalizadas por topico
 * para engajar usuarios apos intervencoes da IA.
 *
 * FORMATO DA RESPOSTA:
 * [Resposta curta e objetiva]
 * -> [Pergunta de follow-up personalizada?]
 */

// ========================================
// TEMPLATES DE PERGUNTAS POR TOPICO
// ========================================

export const FOLLOW_UP_TEMPLATES: Record<string, string[]> = {
  // Jejum Intermitente
  jejum: [
    'Como tem sido sua energia durante as janelas de jejum?',
    'Qual horario de alimentacao funciona melhor pra sua rotina?',
    'Voce sente mais fome no comeco ou no fim do jejum?',
    'O que te ajuda a manter o jejum nos dias mais dificeis?',
  ],

  // Deficit Calorico
  deficit: [
    'O que mais dificulta manter o deficit no seu dia a dia?',
    'Como voce lida quando o peso estagna por alguns dias?',
    'Voce prefere reduzir porcoes ou trocar alimentos?',
    'Em qual refeicao voce sente mais dificuldade de controlar?',
  ],

  // Proteina
  proteina: [
    'Qual sua maior dificuldade pra bater a meta de proteina?',
    'Voce prefere proteina animal ou vegetal?',
    'Como voce distribui a proteina ao longo do dia?',
    'Ja testou suplementar com whey ou prefere so comida de verdade?',
  ],

  // Treino / Musculacao
  treino: [
    'Quantas vezes por semana voce consegue treinar consistentemente?',
    'O que te ajuda a manter a motivacao nos dias dificeis?',
    'Voce treina melhor de manha ou a noite?',
    'Qual exercicio voce mais gosta e qual mais odeia?',
  ],

  // Gluteo especifico
  gluteo: [
    'Voce sente mais o gluteo com carga alta ou com mais repeticoes?',
    'Qual exercicio de gluteo voce mais sente trabalhar?',
    'Voce consegue ativar o gluteo sem "roubar" com quadriceps?',
    'Com que frequencia voce treina gluteo por semana?',
  ],

  // Ansiedade e Emocional
  ansiedade: [
    'Em quais situacoes voce percebe que come mais por emocao?',
    'O que ja funcionou pra voce controlar esses momentos?',
    'Voce consegue identificar o gatilho antes de comer?',
    'O que te ajuda a lidar com o estresse sem recorrer a comida?',
  ],

  // Compulsao
  compulsao: [
    'Voce consegue perceber quando esta prestes a ter um episodio?',
    'O que costuma disparar a compulsao pra voce?',
    'Alguma estrategia ja funcionou pra interromper o ciclo?',
    'Voce ja conversou com um profissional sobre isso?',
  ],

  // Lipedema
  lipedema: [
    'Em que momento do dia voce sente mais dor ou peso nas pernas?',
    'A compressao faz diferenca no seu dia a dia?',
    'Voce ja encontrou um tipo de exercicio que nao piora os sintomas?',
    'Como voce lida nos dias de mais inchaco?',
  ],

  // Canetas / Medicamentos
  canetas: [
    'Quais efeitos colaterais voce sentiu no comeco?',
    'O que mais mudou no seu apetite desde que comecou?',
    'Voce consegue manter a alimentacao saudavel com a caneta?',
    'Qual foi a maior adaptacao que voce precisou fazer?',
  ],

  // Metabolismo / 35+
  metabolismo: [
    'O que voce sente que mudou mais no seu corpo com a idade?',
    'Voce ja fez exames hormonais pra investigar?',
    'O que funcionava antes e agora nao funciona mais?',
    'Voce notou diferenca na energia e disposicao?',
  ],

  // Motivacao
  motivacao: [
    'O que te fez comecar essa jornada?',
    'O que te mantem firme quando bate a vontade de desistir?',
    'Voce tem alguem que te apoia nesse processo?',
    'Qual foi sua maior vitoria ate agora, mesmo que pequena?',
  ],

  // Rotina / Organizacao
  rotina: [
    'Qual parte da sua rotina e mais dificil de encaixar alimentacao saudavel?',
    'Voce consegue planejar as refeicoes da semana?',
    'O que te atrapalha mais: falta de tempo ou falta de disposicao?',
    'Voce prefere preparar tudo no domingo ou cozinhar todo dia?',
  ],

  // Mitos e Correcoes
  mito: [
    'Onde voce ouviu isso pela primeira vez?',
    'O que mais voce gostaria de esclarecer sobre esse tema?',
    'Voce conhece alguem que ainda acredita nisso?',
    'Essa informacao mudou alguma coisa na sua abordagem?',
  ],

  // Frustracao
  frustracao: [
    'Ha quanto tempo voce esta tentando sem ver resultado?',
    'O que voce ja tentou que nao funcionou?',
    'Voce tem acompanhamento de algum profissional?',
    'O que faria diferente se pudesse voltar ao inicio?',
  ],

  // Tecnico geral
  tecnico: [
    'Voce gostaria de aprofundar mais nesse assunto?',
    'Ficou alguma duvida sobre o que foi explicado?',
    'Voce ja tinha ouvido falar sobre isso antes?',
    'Como voce pretende aplicar isso na pratica?',
  ],

  // Default - perguntas genericas
  default: [
    'O que voce mudaria se pudesse voltar ao inicio?',
    'O que ainda te deixa com duvida?',
    'Como esta sendo sua experiencia ate agora?',
    'O que mais te ajudou nesse processo?',
  ],
};

// ========================================
// TIPOS
// ========================================

export interface FollowUpContext {
  topico: string;
  ultimaMensagem: string;
  autorNome: string;
  tipoIntervencao?: 'facilitacao' | 'blog' | 'app' | 'correcao' | 'mito';
}

// ========================================
// FUNCOES
// ========================================

/**
 * Detecta o topico principal da mensagem
 */
export function detectarTopico(texto: string): string {
  const textoLower = texto.toLowerCase();

  const topicoMap: Array<{ keywords: string[]; topico: string }> = [
    { keywords: ['jejum', 'jejuar', 'janela', '16:8', '18:6'], topico: 'jejum' },
    { keywords: ['deficit', 'calorico', 'calorias', 'emagrecer'], topico: 'deficit' },
    { keywords: ['proteina', 'whey', 'frango', 'ovo', 'carne'], topico: 'proteina' },
    { keywords: ['gluteo', 'bumbum', 'hip thrust', 'elevacao pelvica'], topico: 'gluteo' },
    { keywords: ['treino', 'academia', 'musculacao', 'exercicio', 'malhar'], topico: 'treino' },
    { keywords: ['ansiedade', 'ansioso', 'estresse', 'nervoso'], topico: 'ansiedade' },
    { keywords: ['compulsao', 'compulsivo', 'descontrole', 'comi demais'], topico: 'compulsao' },
    { keywords: ['lipedema', 'pernas', 'inchaco', 'drenagem'], topico: 'lipedema' },
    { keywords: ['ozempic', 'wegovy', 'mounjaro', 'saxenda', 'caneta', 'semaglutida'], topico: 'canetas' },
    { keywords: ['metabolismo', 'tireoide', '35', '40', 'menopausa', 'hormonio'], topico: 'metabolismo' },
    { keywords: ['motivacao', 'desistir', 'cansado', 'desanimo'], topico: 'motivacao' },
    { keywords: ['rotina', 'tempo', 'organizar', 'planejar', 'marmita'], topico: 'rotina' },
    { keywords: ['frustracao', 'nao consigo', 'nada funciona', 'desisti'], topico: 'frustracao' },
    { keywords: ['mito', 'verdade', 'mentira', 'engorda', 'faz mal'], topico: 'mito' },
  ];

  for (const item of topicoMap) {
    if (item.keywords.some((kw) => textoLower.includes(kw))) {
      return item.topico;
    }
  }

  return 'default';
}

/**
 * Gera uma pergunta de follow-up baseada no contexto
 */
export function gerarFollowUpQuestion(context: FollowUpContext): string {
  // Detectar topico se nao foi fornecido
  const topico = context.topico || detectarTopico(context.ultimaMensagem);

  // Buscar templates do topico
  const templates = FOLLOW_UP_TEMPLATES[topico] || FOLLOW_UP_TEMPLATES.default;

  // Selecionar pergunta aleatoria
  const pergunta = templates[Math.floor(Math.random() * templates.length)];

  return pergunta;
}

/**
 * Formata a resposta completa com follow-up
 */
export function formatarRespostaComFollowUp(
  respostaPrincipal: string,
  followUpQuestion: string
): string {
  // Limpar resposta principal
  const respostaLimpa = respostaPrincipal.trim();

  // Formatar no padrao especificado
  return `${respostaLimpa}

-> ${followUpQuestion}`;
}

/**
 * Gera resposta completa com follow-up automatico
 */
export function gerarRespostaCompleta(
  respostaPrincipal: string,
  context: FollowUpContext
): { texto: string; followUpQuestion: string } {
  const followUpQuestion = gerarFollowUpQuestion(context);
  const texto = formatarRespostaComFollowUp(respostaPrincipal, followUpQuestion);

  return {
    texto,
    followUpQuestion,
  };
}

// ========================================
// PERGUNTAS ESPECIAIS POR TIPO DE INTERVENCAO
// ========================================

/**
 * Gera pergunta especifica para correcao de mito
 */
export function gerarFollowUpMito(): string {
  const perguntas = [
    'Voce ja tinha ouvido isso antes?',
    'Onde essa informacao costuma circular mais?',
    'Faz sentido agora ou ficou alguma duvida?',
    'Conhece alguem que ainda acredita nisso?',
  ];
  return perguntas[Math.floor(Math.random() * perguntas.length)];
}

/**
 * Gera pergunta especifica para indicacao de blog
 */
export function gerarFollowUpBlog(): string {
  const perguntas = [
    'Voce gostaria de saber mais sobre algum ponto especifico?',
    'Esse assunto te interessa pra aplicar na pratica?',
    'Ficou claro ou quer que eu explique algo mais?',
    'Ja tinha pesquisado sobre isso antes?',
  ];
  return perguntas[Math.floor(Math.random() * perguntas.length)];
}

/**
 * Gera pergunta especifica para indicacao de app
 */
export function gerarFollowUpApp(): string {
  const perguntas = [
    'O que mais te dificulta manter a consistencia?',
    'Voce prefere ter tudo organizado ou improvisar?',
    'Ja tentou usar algum app ou planilha antes?',
    'O que faria diferenca ter acompanhamento diario?',
  ];
  return perguntas[Math.floor(Math.random() * perguntas.length)];
}
