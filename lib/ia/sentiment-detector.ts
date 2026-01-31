/**
 * Sentiment Detector - Detector de Sentimento e Contexto
 *
 * Analisa mensagens para detectar:
 * - Sentimento (positivo, negativo, neutro)
 * - Necessidade de suporte emocional
 * - Tipo de conteudo (pergunta, desabafo, conquista, etc)
 * - Topico principal
 */

// ========================================
// TIPOS
// ========================================

export interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number; // 0-1
  isQuestion: boolean;
  isVenting: boolean; // Desabafo
  isAchievement: boolean; // Conquista
  isLongMessage: boolean;
  needsEmotionalSupport: boolean;
  needsScientificAnswer: boolean;
  emotion?: string;
  intensity: 'low' | 'medium' | 'high';
}

export interface TopicAnalysis {
  mainTopic: string;
  secondaryTopics: string[];
  keywords: string[];
  hasMisinformation: boolean;
  misinformationType?: string;
}

export interface ContentAnalysis extends SentimentAnalysis, TopicAnalysis {}

// ========================================
// PALAVRAS-CHAVE
// ========================================

const NEGATIVE_WORDS = [
  // Frustracao
  'frustrad', 'frustração', 'frustrante',
  'desisti', 'desistir', 'desistindo',
  'cansad', 'exaust', 'esgotad',
  // Tristeza
  'triste', 'deprimid', 'desanimad',
  'desesper', 'chorand', 'chorando',
  // Impotencia
  'não aguento', 'não consigo', 'impossível',
  'nunca funciona', 'não adianta', 'sem esperança',
  'não sei mais', 'perdid', 'confus',
  // Raiva
  'raiva', 'odei', 'irritad', 'nervos',
  // Ansiedade
  'ansiedad', 'ansios', 'preocupad', 'medo',
  // Culpa
  'culpa', 'vergonha', 'falhei', 'fracass',
];

const POSITIVE_WORDS = [
  // Conquista
  'consegui', 'perdi peso', 'emagreci', 'baixei',
  'resultado', 'evolução', 'progresso', 'vitória',
  // Motivacao
  'motivad', 'determinad', 'animad', 'empolgad',
  // Gratidao
  'obrigad', 'agradeç', 'gratidão', 'grat',
  // Felicidade
  'feliz', 'alegr', 'contente', 'satisfeit',
  // Sucesso
  'funcionou', 'deu certo', 'consegui', 'alcancei',
];

const QUESTION_WORDS = ['?', 'como', 'por que', 'porque', 'qual', 'quando', 'onde', 'quem', 'quanto', 'será que', 'alguem sabe', 'alguém sabe'];

const TOPIC_KEYWORDS: Record<string, string[]> = {
  'lipedema': ['lipedema', 'lipídema', 'inchaço', 'inchaco', 'retenção', 'retencao', 'edema', 'celulite'],
  'dieta': ['dieta', 'calorias', 'déficit', 'deficit', 'emagrecer', 'emagrecimento', 'comida', 'alimentação', 'alimentacao'],
  'treino': ['treino', 'academia', 'exercício', 'exercicio', 'musculação', 'musculacao', 'cardio', 'aeróbico'],
  'hormônios': ['hormônio', 'hormonio', 'ciclo', 'menstruação', 'menstruacao', 'tpm', 'menopausa', 'tireoide'],
  'sono': ['sono', 'dormir', 'insônia', 'insonia', 'cansaço', 'cansaco', 'descanso'],
  'suplementos': ['suplemento', 'whey', 'creatina', 'vitamina', 'proteína em pó', 'bcaa', 'pré-treino'],
  'jejum': ['jejum', 'intermitente', 'janela alimentar', 'nao comer', 'ficar sem comer'],
  'proteina': ['proteína', 'proteina', 'carne', 'frango', 'peixe', 'ovos', 'leguminosas'],
  'ansiedade_alimentar': ['compulsão', 'compulsao', 'comer emocional', 'descontrole', 'atacar a geladeira', 'beliscar'],
  'peso': ['balança', 'balanca', 'peso', 'kg', 'quilos', 'pesagem', 'estagnado'],
};

const MISINFORMATION_PATTERNS: Array<{ pattern: RegExp; type: string; correction: string }> = [
  {
    pattern: /carboidrato\s*(engorda|faz\s*mal|e\s*ruim|é\s*ruim)/i,
    type: 'carbs_myth',
    correction: 'Carboidratos não engordam por si só - o excesso calórico sim.',
  },
  {
    pattern: /(não\s*pode|nao\s*pode|nunca|proibido)\s*comer\s*(a\s*noite|à\s*noite|de\s*noite)/i,
    type: 'night_eating_myth',
    correction: 'O horário de comer não determina ganho de peso - o balanço calórico total sim.',
  },
  {
    pattern: /fruta\s*(engorda|faz\s*mal|açúcar|acucar)/i,
    type: 'fruit_myth',
    correction: 'Frutas são fontes de fibras, vitaminas e minerais. O açúcar da fruta vem com nutrientes.',
  },
  {
    pattern: /ovo\s*(faz\s*mal|colesterol|perigoso)/i,
    type: 'egg_myth',
    correction: 'Ovos são excelentes fontes de proteína. O colesterol alimentar tem pouco impacto para a maioria das pessoas.',
  },
  {
    pattern: /(gordura|lipídio)\s*(faz\s*mal|engorda|evitar)/i,
    type: 'fat_myth',
    correction: 'Gorduras são essenciais. Escolha fontes saudáveis como azeite, castanhas e abacate.',
  },
  {
    pattern: /(só|so|apenas)\s*cardio\s*(emagrece|funciona)/i,
    type: 'cardio_myth',
    correction: 'Musculação é igualmente importante para emagrecimento - aumenta metabolismo basal.',
  },
  {
    pattern: /jejum\s*(queima|consome|perde)\s*músculo/i,
    type: 'fasting_myth',
    correction: 'Jejum intermitente bem feito preserva massa muscular, especialmente com treino.',
  },
  {
    pattern: /metabolismo\s*(lento|travado|parado)/i,
    type: 'metabolism_myth',
    correction: 'Metabolismo "lento" geralmente é superestimação de calorias consumidas ou subestimação do gasto.',
  },
];

// ========================================
// FUNCOES PRINCIPAIS
// ========================================

/**
 * Detecta sentimento de uma mensagem
 */
export function detectSentiment(text: string): SentimentAnalysis {
  const lowerText = text.toLowerCase();

  // Contar palavras negativas e positivas
  let negativeCount = 0;
  let positiveCount = 0;
  let detectedEmotion = '';

  for (const word of NEGATIVE_WORDS) {
    if (lowerText.includes(word)) {
      negativeCount++;
      if (!detectedEmotion) {
        if (['frustrad', 'frustração'].some(w => word.includes(w))) detectedEmotion = 'frustração';
        else if (['triste', 'deprimid'].some(w => word.includes(w))) detectedEmotion = 'tristeza';
        else if (['ansiedad', 'ansios'].some(w => word.includes(w))) detectedEmotion = 'ansiedade';
        else if (['raiva', 'irritad'].some(w => word.includes(w))) detectedEmotion = 'raiva';
        else if (['culpa', 'vergonha'].some(w => word.includes(w))) detectedEmotion = 'culpa';
        else detectedEmotion = 'desanimo';
      }
    }
  }

  for (const word of POSITIVE_WORDS) {
    if (lowerText.includes(word)) {
      positiveCount++;
      if (!detectedEmotion) {
        detectedEmotion = 'alegria';
      }
    }
  }

  // Detectar pergunta
  const isQuestion = QUESTION_WORDS.some(word => lowerText.includes(word));

  // Detectar conquista
  const achievementWords = ['consegui', 'perdi', 'emagreci', 'baixei', 'resultado', 'vitória', 'progresso'];
  const isAchievement = achievementWords.some(word => lowerText.includes(word));

  // Detectar mensagem longa (desabafo potencial)
  const isLongMessage = text.length > 150;

  // Determinar sentimento
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  let confidence = 0.5;

  if (negativeCount > positiveCount) {
    sentiment = 'negative';
    confidence = Math.min(0.5 + negativeCount * 0.1, 0.95);
  } else if (positiveCount > negativeCount) {
    sentiment = 'positive';
    confidence = Math.min(0.5 + positiveCount * 0.1, 0.95);
  }

  // Determinar intensidade
  const totalEmotionWords = negativeCount + positiveCount;
  let intensity: 'low' | 'medium' | 'high' = 'low';
  if (totalEmotionWords >= 4) intensity = 'high';
  else if (totalEmotionWords >= 2) intensity = 'medium';

  // Verificar se precisa suporte emocional
  const needsEmotionalSupport = sentiment === 'negative' && (isLongMessage || intensity === 'high');

  return {
    sentiment,
    confidence,
    isQuestion,
    isVenting: sentiment === 'negative' && isLongMessage,
    isAchievement,
    isLongMessage,
    needsEmotionalSupport,
    needsScientificAnswer: isQuestion && !needsEmotionalSupport,
    emotion: detectedEmotion || undefined,
    intensity,
  };
}

/**
 * Extrai topico principal da mensagem
 */
export function extractMainTopic(text: string): TopicAnalysis {
  const lowerText = text.toLowerCase();
  const detectedTopics: string[] = [];
  const detectedKeywords: string[] = [];

  // Detectar topicos
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        if (!detectedTopics.includes(topic)) {
          detectedTopics.push(topic);
        }
        if (!detectedKeywords.includes(keyword)) {
          detectedKeywords.push(keyword);
        }
      }
    }
  }

  // Detectar desinformacao
  let hasMisinformation = false;
  let misinformationType: string | undefined;

  for (const { pattern, type } of MISINFORMATION_PATTERNS) {
    if (pattern.test(text)) {
      hasMisinformation = true;
      misinformationType = type;
      break;
    }
  }

  return {
    mainTopic: detectedTopics[0] || 'geral',
    secondaryTopics: detectedTopics.slice(1),
    keywords: detectedKeywords,
    hasMisinformation,
    misinformationType,
  };
}

/**
 * Analise completa de conteudo
 */
export function analyzeContent(text: string): ContentAnalysis {
  const sentiment = detectSentiment(text);
  const topic = extractMainTopic(text);

  return {
    ...sentiment,
    ...topic,
  };
}

/**
 * Obtem correcao para desinformacao detectada
 */
export function getMisinformationCorrection(type: string): string | null {
  const pattern = MISINFORMATION_PATTERNS.find(p => p.type === type);
  return pattern?.correction || null;
}

/**
 * Classifica tipo de mensagem para resposta
 */
export function classifyMessageType(analysis: ContentAnalysis): {
  type: 'welcome' | 'emotional_support' | 'misinformation' | 'question' | 'achievement' | 'engagement' | 'regular';
  priority: number;
  shouldRespond: boolean;
} {
  // Prioridade: misinformacao > suporte emocional > conquista > pergunta > regular

  if (analysis.hasMisinformation) {
    return { type: 'misinformation', priority: 10, shouldRespond: true };
  }

  if (analysis.needsEmotionalSupport) {
    return { type: 'emotional_support', priority: 9, shouldRespond: true };
  }

  if (analysis.isAchievement && analysis.sentiment === 'positive') {
    return { type: 'achievement', priority: 7, shouldRespond: true };
  }

  if (analysis.isQuestion && analysis.needsScientificAnswer) {
    return { type: 'question', priority: 6, shouldRespond: true };
  }

  if (analysis.isLongMessage) {
    return { type: 'engagement', priority: 4, shouldRespond: false };
  }

  return { type: 'regular', priority: 2, shouldRespond: false };
}

export default {
  detectSentiment,
  extractMainTopic,
  analyzeContent,
  getMisinformationCorrection,
  classifyMessageType,
};
