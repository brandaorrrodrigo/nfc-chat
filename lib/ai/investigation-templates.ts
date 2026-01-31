/**
 * Investigation Templates - Perguntas Investigativas Progressivas
 *
 * A IA não responde tudo de uma vez. Ela faz perguntas para entender
 * melhor a situação antes de dar um diagnóstico completo.
 */

export interface InvestigationQuestion {
  topic: string;
  questions: string[];
  requiredAnswers: number; // Quantas respostas precisa antes de dar diagnóstico
}

export const INVESTIGATION_FLOWS: Record<string, InvestigationQuestion> = {
  lipedema: {
    topic: 'lipedema',
    requiredAnswers: 3,
    questions: [
      'Você tem sentido as pernas mais pesadas ao longo do dia?',
      'Seus pés ficam inchados no fim do dia?',
      'O que mais você percebeu além do acúmulo maior de gordura nas pernas?',
      'Na sua família tem casos parecidos (mãe, irmãs, tias)?',
      'A gordura nas pernas é simétrica (igual nos dois lados)?',
      'Você sente dor ou sensibilidade ao toque nas áreas afetadas?',
    ]
  },

  deficit_calorico: {
    topic: 'déficit calórico',
    requiredAnswers: 3,
    questions: [
      'Há quanto tempo você está em déficit calórico?',
      'Você está acompanhando as calorias ou apenas "comendo menos"?',
      'Como está seu nível de energia? Sente cansaço, tontura?',
      'Você treina? Se sim, qual tipo de treino e quantas vezes por semana?',
      'Como está seu sono? Consegue dormir bem?',
      'Você está menstruando normalmente? (Ciclo regular ou irregular?)',
    ]
  },

  treino_gluteo: {
    topic: 'treino de glúteo',
    requiredAnswers: 2,
    questions: [
      'Você já treina glúteo atualmente? Se sim, quais exercícios?',
      'Quantas vezes por semana você treina?',
      'Você sente o glúteo "queimando" durante o treino ou só cansa a perna?',
      'Qual é seu objetivo principal: hipertrofia (crescer) ou definição?',
      'Você tem acesso a academia ou treina em casa?',
    ]
  },

  ansiedade_compulsao: {
    topic: 'ansiedade e compulsão alimentar',
    requiredAnswers: 3,
    questions: [
      'Com que frequência acontecem os episódios de compulsão? (Diário, semanal?)',
      'Você consegue identificar gatilhos? (Stress, ansiedade, tédio?)',
      'Como você se sente DEPOIS de comer compulsivamente? (Culpa, alívio?)',
      'Você já fez acompanhamento com psicólogo ou psiquiatra?',
      'Você restringe muito a alimentação entre os episódios?',
    ]
  },

  emagrecimento_35_mais: {
    topic: 'emagrecimento 35+',
    requiredAnswers: 3,
    questions: [
      'Qual sua idade exata?',
      'Você está na menopausa, pré-menopausa ou ainda menstrua normalmente?',
      'Você já fez exames hormonais recentemente? (TSH, insulina, testosterona?)',
      'Como está seu sono? Acorda cansada?',
      'Você já emagreceu antes com facilidade ou sempre foi difícil?',
    ]
  },

  canetas_emagrecedoras: {
    topic: 'canetas emagrecedoras (GLP-1)',
    requiredAnswers: 3,
    questions: [
      'Você já está usando ou está pensando em começar?',
      'Se já usa: qual medicamento? (Ozempic, Wegovy, Mounjaro, Saxenda?)',
      'Você tem acompanhamento médico?',
      'Quais efeitos colaterais você está sentindo? (Náusea, intestino preso?)',
      'Você está combinando com mudanças alimentares ou só usando a caneta?',
    ]
  },

  jejum_intermitente: {
    topic: 'jejum intermitente',
    requiredAnswers: 2,
    questions: [
      'Qual protocolo de jejum você está fazendo ou pretende fazer? (16/8, 20/4, 24h?)',
      'Há quanto tempo pratica jejum? Ou está começando agora?',
      'Como está sua energia durante a janela de jejum?',
      'Você treina em jejum ou alimentada?',
      'Está tendo dificuldade em manter o protocolo? Se sim, em qual momento?',
    ]
  },

  proteina: {
    topic: 'proteína',
    requiredAnswers: 2,
    questions: [
      'Você sabe quanto de proteína está consumindo por dia atualmente?',
      'Qual seu peso atual? (Para calcular a necessidade)',
      'Você consome proteína animal, vegetal ou ambas?',
      'Tem dificuldade em atingir a meta de proteína? Qual a maior barreira?',
    ]
  },

  suplementos: {
    topic: 'suplementos',
    requiredAnswers: 2,
    questions: [
      'Qual suplemento específico você está considerando ou já usa?',
      'Qual seu objetivo principal com a suplementação?',
      'Você já fez exames para verificar deficiências nutricionais?',
      'Tem alguma condição de saúde ou toma algum medicamento?',
    ]
  },

  estagnacao_peso: {
    topic: 'estagnação de peso',
    requiredAnswers: 3,
    questions: [
      'Há quanto tempo seu peso está estagnado?',
      'Você está acompanhando as calorias de forma precisa (pesando alimentos)?',
      'Como está seu sono e nível de estresse?',
      'Você está treinando? Se sim, há quanto tempo com o mesmo treino?',
      'Já tentou fazer uma pausa no déficit (diet break)?',
    ]
  },

  // Template genérico para outros tópicos
  generic: {
    topic: 'geral',
    requiredAnswers: 2,
    questions: [
      'Pode me dar mais detalhes sobre sua situação atual?',
      'Há quanto tempo isso vem acontecendo?',
      'Você já tentou alguma estratégia antes? Se sim, o que funcionou ou não?',
      'Você tem acompanhamento médico ou nutricional atualmente?',
    ]
  }
};

/**
 * Detecta palavras-chave no conteúdo para escolher o fluxo de investigação
 */
export function getInvestigationFlow(content: string): InvestigationQuestion {
  const normalizedContent = content.toLowerCase();

  // Lipedema
  if (normalizedContent.includes('lipedema') ||
      normalizedContent.includes('pernas inchadas') ||
      normalizedContent.includes('gordura nas pernas')) {
    return INVESTIGATION_FLOWS.lipedema;
  }

  // Déficit calórico
  if (normalizedContent.includes('déficit') ||
      normalizedContent.includes('deficit') ||
      normalizedContent.includes('calorias') ||
      normalizedContent.includes('não emagreço') ||
      normalizedContent.includes('nao emagreco')) {
    return INVESTIGATION_FLOWS.deficit_calorico;
  }

  // Treino de glúteo
  if (normalizedContent.includes('glúteo') ||
      normalizedContent.includes('gluteo') ||
      normalizedContent.includes('bumbum') ||
      normalizedContent.includes('empinar')) {
    return INVESTIGATION_FLOWS.treino_gluteo;
  }

  // Ansiedade e compulsão
  if (normalizedContent.includes('ansiedade') ||
      normalizedContent.includes('compuls') ||
      normalizedContent.includes('descontrol') ||
      normalizedContent.includes('comer emocional')) {
    return INVESTIGATION_FLOWS.ansiedade_compulsao;
  }

  // Emagrecimento 35+
  if (normalizedContent.includes('menopausa') ||
      normalizedContent.includes('climatério') ||
      normalizedContent.includes('35 anos') ||
      normalizedContent.includes('40 anos') ||
      normalizedContent.includes('50 anos') ||
      normalizedContent.includes('hormônio')) {
    return INVESTIGATION_FLOWS.emagrecimento_35_mais;
  }

  // Canetas emagrecedoras
  if (normalizedContent.includes('caneta') ||
      normalizedContent.includes('ozempic') ||
      normalizedContent.includes('wegovy') ||
      normalizedContent.includes('mounjaro') ||
      normalizedContent.includes('saxenda') ||
      normalizedContent.includes('semaglutida') ||
      normalizedContent.includes('tirzepatida')) {
    return INVESTIGATION_FLOWS.canetas_emagrecedoras;
  }

  // Jejum intermitente
  if (normalizedContent.includes('jejum') ||
      normalizedContent.includes('16/8') ||
      normalizedContent.includes('janela alimentar')) {
    return INVESTIGATION_FLOWS.jejum_intermitente;
  }

  // Proteína
  if (normalizedContent.includes('proteína') ||
      normalizedContent.includes('proteina') ||
      normalizedContent.includes('whey') ||
      normalizedContent.includes('gramas de proteína')) {
    return INVESTIGATION_FLOWS.proteina;
  }

  // Suplementos
  if (normalizedContent.includes('suplemento') ||
      normalizedContent.includes('creatina') ||
      normalizedContent.includes('vitamina') ||
      normalizedContent.includes('termogênico')) {
    return INVESTIGATION_FLOWS.suplementos;
  }

  // Estagnação de peso
  if (normalizedContent.includes('estagna') ||
      normalizedContent.includes('platô') ||
      normalizedContent.includes('plato') ||
      normalizedContent.includes('peso parado') ||
      normalizedContent.includes('não desce') ||
      normalizedContent.includes('travou')) {
    return INVESTIGATION_FLOWS.estagnacao_peso;
  }

  return INVESTIGATION_FLOWS.generic;
}

/**
 * Verifica se o conteúdo é uma pergunta que merece investigação
 */
export function isInvestigableQuestion(content: string): boolean {
  const normalizedContent = content.toLowerCase();

  // Indicadores de que é uma pergunta
  const questionIndicators = [
    '?',
    'como faço',
    'como eu',
    'o que fazer',
    'o que devo',
    'alguém sabe',
    'alguem sabe',
    'preciso de ajuda',
    'me ajuda',
    'me ajudem',
    'dúvida',
    'duvida',
    'não sei',
    'nao sei',
    'será que',
    'sera que',
    'por que',
    'porque',
    'qual',
    'quanto',
    'quando',
  ];

  return questionIndicators.some(indicator => normalizedContent.includes(indicator));
}

export default {
  INVESTIGATION_FLOWS,
  getInvestigationFlow,
  isInvestigableQuestion,
};
