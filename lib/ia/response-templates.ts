/**
 * Response Templates - Templates de Respostas da IA Moderadora
 *
 * Templates personalizaveis para diferentes tipos de interacao:
 * - Boas-vindas para novatos
 * - Validacao emocional
 * - Respostas cientificas
 * - Correcao de desinformacao
 * - Celebracao de conquistas
 * - Incentivo ao engajamento
 */

import { FP_CONFIG } from '@/lib/fp/config';

// ========================================
// TIPOS
// ========================================

export interface TemplateContext {
  userName: string;
  communityName?: string;
  topic?: string;
  emotion?: string;
  fpAwarded?: number;
  fpTotal?: number;
  streakDays?: number;
  customData?: Record<string, any>;
}

// ========================================
// TEMPLATES DE RESPOSTA
// ========================================

export const AI_RESPONSE_TEMPLATES = {
  // ========================================
  // BOAS-VINDAS (NOVATOS)
  // ========================================

  /**
   * Boas-vindas para primeiro post na comunidade
   */
  WELCOME_NEW_USER: (ctx: TemplateContext) => `
Bem-vinda a Arena ${ctx.communityName ? `de ${ctx.communityName}` : ''}, ${ctx.userName}!

Adoramos ter voce aqui. Este e um espaco seguro onde voce pode compartilhar suas duvidas, vitorias e frustracoes sem julgamento.

**Dica rapida:** As pessoas aqui sao MUITO ativas e solidarias. Nao hesite em comentar nos posts de outras tambem - quanto mais voce participa, mais FP acumula!

**+${ctx.fpAwarded || 2} FP** pelo seu primeiro post!
`.trim(),

  /**
   * Boas-vindas com contexto de comunidade especifica
   */
  WELCOME_COMMUNITY_SPECIFIC: (ctx: TemplateContext) => {
    const communityMessages: Record<string, string> = {
      'lipedema': 'Aqui voce vai encontrar pessoas que entendem exatamente o que voce passa.',
      'hipertrofia': 'Treino, nutricao e resultados - aqui a galera entende do assunto!',
      'emagrecimento': 'Cada corpo tem seu tempo. Aqui ninguem julga, so apoia.',
      'nutricao': 'Duvidas sobre alimentacao? Este e o lugar certo!',
    };

    const specificMessage = ctx.communityName
      ? communityMessages[ctx.communityName.toLowerCase()] || ''
      : '';

    return `
Oi, ${ctx.userName}! Seja muito bem-vinda!

${specificMessage}

Seu primeiro passo foi o mais importante: estar aqui. Agora e so continuar participando!

**+${ctx.fpAwarded || 2} FP** de boas-vindas!
`.trim();
  },

  // ========================================
  // VALIDACAO EMOCIONAL (DESABAFOS)
  // ========================================

  /**
   * Resposta para desabafo com frustracao
   */
  EMOTIONAL_VALIDATION: (ctx: TemplateContext) => `
${ctx.userName}, eu senti a ${ctx.emotion || 'dificuldade'} no seu relato.

Voce nao esta sozinha nisso - muitas pessoas aqui ja passaram por algo similar.

${ctx.topic ? `O que voce descreveu sobre ${ctx.topic} e mais comum do que voce imagina.` : 'Seu sentimento e completamente valido.'}

Continue compartilhando - voce esta no lugar certo.

${ctx.fpAwarded ? `**+${ctx.fpAwarded} FP** pela coragem de compartilhar!` : ''}
`.trim(),

  /**
   * Resposta para ansiedade/preocupacao
   */
  EMOTIONAL_ANXIETY: (ctx: TemplateContext) => `
${ctx.userName}, respira fundo.

Ansiedade com ${ctx.topic || 'o processo'} e normal - significa que voce se importa.

Algumas coisas que podem ajudar:
- Foque no que voce PODE controlar hoje
- Pequenos passos > grandes mudancas
- Progresso nao e linear, e isso e OK

Estamos aqui com voce.

${ctx.fpAwarded ? `**+${ctx.fpAwarded} FP** por compartilhar!` : ''}
`.trim(),

  /**
   * Resposta para frustracao com resultados
   */
  EMOTIONAL_FRUSTRATION_RESULTS: (ctx: TemplateContext) => `
${ctx.userName}, entendo sua frustracao.

Quando os resultados demoram, e facil querer desistir. Mas olha:

1. Seu corpo esta se adaptando - isso leva tempo
2. Comparar com os outros e injusto - cada metabolismo e unico
3. Os melhores resultados vem de quem persiste

O que te trouxe ate aqui? Vamos reconectar com sua motivacao original.

${ctx.fpAwarded ? `**+${ctx.fpAwarded} FP** pela persistencia!` : ''}
`.trim(),

  // ========================================
  // RESPOSTAS CIENTIFICAS
  // ========================================

  /**
   * Resposta cientifica padrao
   */
  SCIENTIFIC_RESPONSE: (ctx: TemplateContext & { explanation: string; source?: string }) => `
Otima pergunta, ${ctx.userName}!

${ctx.explanation}

${ctx.source ? `**Fonte:** ${ctx.source}` : ''}

Continue perguntando - e assim que voce evolui mais rapido!

${ctx.fpAwarded ? `**+${ctx.fpAwarded} FP** pela pergunta!` : ''}
`.trim(),

  /**
   * Resposta cientifica com referencia a artigo
   */
  SCIENTIFIC_WITH_ARTICLE: (ctx: TemplateContext & { explanation: string; articleTitle: string; articleUrl: string }) => `
Excelente pergunta sobre ${ctx.topic || 'esse tema'}, ${ctx.userName}!

${ctx.explanation}

Tenho um artigo que aprofunda isso: **${ctx.articleTitle}**
${ctx.articleUrl}

${ctx.fpAwarded ? `**+${ctx.fpAwarded} FP** pela curiosidade cientifica!` : ''}
`.trim(),

  // ========================================
  // CORRECAO DE DESINFORMACAO
  // ========================================

  /**
   * Correcao de mito/desinformacao
   */
  MISINFORMATION_CORRECTION: (ctx: TemplateContext & { topic: string; correction: string; source?: string }) => `
Oi, ${ctx.userName}! Obrigada por compartilhar, mas preciso esclarecer algo importante aqui.

O que foi mencionado sobre **${ctx.topic}** nao esta alinhado com a ciencia atual.

${ctx.correction}

${ctx.source ? `**Fonte:** ${ctx.source}` : ''}

Isso nao tira o valor da sua experiencia pessoal, mas e importante que as outras pessoas tenham a informacao correta.

${ctx.fpAwarded ? `**+${ctx.fpAwarded} FP** pela participacao!` : ''}
`.trim(),

  /**
   * Correcao gentil sem invalidar a pessoa
   */
  GENTLE_CORRECTION: (ctx: TemplateContext & { topic: string; correction: string }) => `
${ctx.userName}, interessante voce trazer isso!

Sobre ${ctx.topic}: a ciencia mais recente mostra algo um pouco diferente:

${ctx.correction}

O legal e que agora voce tem uma informacao mais atualizada pra trabalhar!

Alguma outra duvida sobre isso?
`.trim(),

  // ========================================
  // CELEBRACAO DE CONQUISTAS
  // ========================================

  /**
   * Celebracao de conquista padrao
   */
  ACHIEVEMENT_CELEBRATION: (ctx: TemplateContext & { achievement: string }) => `
@${ctx.userName}, PARABENS!

${ctx.achievement} - isso e incrivel!

Voce acabou de mostrar que e possivel. Continue assim!

${ctx.fpAwarded ? `**+${ctx.fpAwarded} FP** pela conquista!` : ''}
`.trim(),

  /**
   * Celebracao de streak
   */
  STREAK_CELEBRATION: (ctx: TemplateContext) => `
**CONQUISTA DESBLOQUEADA!**

@${ctx.userName} acabou de completar **${ctx.streakDays} DIAS CONSECUTIVOS** de engajamento!

Isso e o que chamamos de CONSISTENCIA REAL.

${ctx.fpAwarded ? `**+${ctx.fpAwarded} FP** BONUS ESPECIAL!` : ''}

${ctx.fpTotal ? `Seu total agora: **${ctx.fpTotal} FP**` : ''}

**Lembre-se:** Voce pode converter FP em desconto no APP!
- ${FP_CONFIG.MIN_FP_TO_REDEEM} FP = ${Math.floor(FP_CONFIG.MIN_FP_TO_REDEEM / FP_CONFIG.FP_PER_PERCENT)}%
- 300 FP = ${Math.floor(300 / FP_CONFIG.FP_PER_PERCENT)}%
- 600 FP = ${FP_CONFIG.MAX_DISCOUNT_PERCENT}%

Conte pra gente: como voce se sente comparando o Dia 1 com hoje?
`.trim(),

  /**
   * Celebracao de FP alcancado
   */
  FP_MILESTONE: (ctx: TemplateContext & { milestone: number }) => `
@${ctx.userName}, voce acabou de atingir **${ctx.customData?.milestone || 100} FP**!

Isso significa que voce ja pode resgatar ${Math.floor((ctx.customData?.milestone || 100) / FP_CONFIG.FP_PER_PERCENT)}% de desconto no app!

Continue participando para aumentar ainda mais seu desconto!
`.trim(),

  // ========================================
  // INCENTIVO AO ENGAJAMENTO
  // ========================================

  /**
   * Incentivo para usuario quieto
   */
  ENGAGEMENT_NUDGE: (ctx: TemplateContext) => `
${ctx.userName}, notei que voce tem lido bastante mas ainda nao fez perguntas.

Nao tenha vergonha! As melhores conversas aqui comecam com uma duvida sincera.

**Dica:** Perguntas dao **+${FP_CONFIG.CHAT_QUESTION} FP** e ainda te ajudam a aprender mais rapido!
`.trim(),

  /**
   * Reconhecimento de contribuicao valiosa
   */
  POSITIVE_REINFORCEMENT: (ctx: TemplateContext & { action: string }) => `
@${ctx.userName}, que ${ctx.action} incrivel!

Voce acabou de exemplificar o melhor dessa comunidade: pessoas ajudando pessoas com empatia E ciencia.

${ctx.fpAwarded ? `**+${ctx.fpAwarded} FP** pela contribuicao de alto valor!` : ''}

Continue assim! Contribuicoes como essa elevam toda a comunidade.
`.trim(),

  // ========================================
  // MEDIACAO DE CONFLITO
  // ========================================

  /**
   * Mediacao de discussao acalorada
   */
  CONFLICT_MEDIATION: () => `
Pessoal, vamos manter a energia positiva aqui!

Eu entendo que voces tem experiencias diferentes, e isso e valido. Mas lembrem:

- Podemos discordar com respeito
- Cada corpo responde diferente
- O que funcionou para voce pode nao funcionar para outra pessoa

Vamos focar em compartilhar o que FUNCIONOU, ao inves de invalidar o que NAO funcionou para a outra pessoa.

Sigam em frente!
`.trim(),

  // ========================================
  // CONEXAO ENTRE USUARIOS
  // ========================================

  /**
   * Sugestao de conexao com usuarios similares
   */
  CONNECT_SIMILAR_USERS: (ctx: TemplateContext & { similarUsers: Array<{ name: string; topic: string }> }) => {
    const users = ctx.customData?.similarUsers || [];
    if (users.length === 0) return '';

    const mentions = users.map((u: { name: string; topic: string }) => `- @${u.name} (tambem fala sobre ${u.topic})`).join('\n');

    return `
${ctx.userName}, achei que voce gostaria de conhecer:

${mentions}

Voces tem interesses em comum! Que tal trocar uma ideia?
`.trim();
  },
};

// ========================================
// FUNCOES AUXILIARES
// ========================================

/**
 * Obtem template por tipo
 */
export function getTemplate(
  type: keyof typeof AI_RESPONSE_TEMPLATES
): (ctx: TemplateContext & Record<string, any>) => string {
  return AI_RESPONSE_TEMPLATES[type];
}

/**
 * Gera resposta usando template
 */
export function generateResponse(
  type: keyof typeof AI_RESPONSE_TEMPLATES,
  context: TemplateContext & Record<string, any>
): string {
  const template = AI_RESPONSE_TEMPLATES[type];
  if (!template) {
    console.error(`[ResponseTemplates] Template nao encontrado: ${type}`);
    return '';
  }

  try {
    return template(context);
  } catch (error) {
    console.error(`[ResponseTemplates] Erro ao gerar resposta:`, error);
    return '';
  }
}

/**
 * Calcula FP a ser concedido baseado no tipo de interacao
 */
export function calculateFPReward(
  type: 'welcome' | 'emotional_support' | 'question' | 'achievement' | 'misinformation' | 'engagement',
  isLongMessage: boolean = false
): number {
  const baseRewards: Record<string, number> = {
    welcome: FP_CONFIG.DAILY_ACCESS,
    emotional_support: FP_CONFIG.CHAT_MESSAGE + 3, // Bonus por compartilhar
    question: FP_CONFIG.CHAT_QUESTION,
    achievement: FP_CONFIG.CHAT_MESSAGE + 5, // Bonus por conquista
    misinformation: FP_CONFIG.CHAT_MESSAGE, // Ainda ganha por participar
    engagement: FP_CONFIG.CHAT_MESSAGE,
  };

  let reward = baseRewards[type] || FP_CONFIG.CHAT_MESSAGE;

  // Bonus por mensagem longa
  if (isLongMessage) {
    reward += FP_CONFIG.CHAT_MESSAGE_LONG_BONUS;
  }

  return reward;
}

export default AI_RESPONSE_TEMPLATES;
