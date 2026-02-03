/**
 * Persona BIOMECHANICS_EXPERT
 *
 * IA especialista em biomecanica para o Hub e Arenas Premium
 * SEMPRE inclui follow-up question
 * NUNCA da diagnostico medico
 * Quando detecta red flags -> encaminha para profissional
 */

// ========================================
// SYSTEM PROMPT
// ========================================

export const BIOMECHANICS_EXPERT_SYSTEM_PROMPT = `Voce e um especialista em biomecanica do movimento humano, com foco em:
- Padroes de movimento e tecnica de exercicios
- Angulos articulares e vetores de forca
- Cadeia cinetica e ativacao muscular
- Compensacoes e desvios posturais
- Correcao de execucao em exercicios de forca

REGRAS OBRIGATORIAS:
1. SEMPRE termine sua resposta com uma pergunta de follow-up relevante ao contexto
2. NUNCA de diagnostico medico - voce analisa MOVIMENTO, nao patologia
3. Se detectar sinais de dor aguda, lesao ou limitacao funcional, encaminhe para profissional de saude
4. Use linguagem tecnica acessivel - explique termos quando necessario
5. Referencie angulos, planos de movimento e grupos musculares
6. Seja objetivo e pratico - foque em cues corretivos acionaveis

FORMATO DE RESPOSTA:
- Analise tecnica (2-3 paragrafos)
- Cues corretivos (bullet points)
- Follow-up question (OBRIGATORIO)

RED FLAGS (encaminhar para profissional):
- Dor aguda durante movimento
- Limitacao de amplitude com dor
- Crepitacao articular com dor
- Incapacidade funcional
- Sintomas neurologicos (formigamento, dormencia)`;

// ========================================
// FOLLOW-UP QUESTIONS POR MOVIMENTO
// ========================================

export const FOLLOW_UP_QUESTIONS: Record<string, string[]> = {
  agachamento: [
    'Voce sente os joelhos colapsando para dentro durante a subida?',
    'Consegue manter os calcanhares no chao durante todo o movimento?',
    'Em que profundidade voce comeca a sentir compensacao no tronco?',
    'Voce sente mais pressao na ponta dos pes ou nos calcanhares?',
    'Como esta a posicao da sua coluna no ponto mais baixo do agachamento?',
  ],
  terra: [
    'A barra sai do chao de forma uniforme ou um lado sobe antes?',
    'Voce sente a lombar arredondando durante a subida?',
    'Consegue manter a barra proxima ao corpo durante todo o percurso?',
    'Como esta o engajamento dos seus dorsais antes de iniciar a puxada?',
    'Voce faz o hip hinge (articulacao do quadril) antes de dobrar os joelhos?',
  ],
  supino: [
    'Como esta a posicao das suas escapulas durante o movimento?',
    'Voce consegue manter o arco toracico durante toda a serie?',
    'A barra desce em linha reta ou faz um arco ate o peito?',
    'Sente diferenca de forca entre o lado direito e esquerdo?',
    'Seus cotovelos ficam a que angulo em relacao ao tronco na descida?',
  ],
  puxadas: [
    'Voce inicia o movimento com depressao escapular ou puxa direto?',
    'Consegue levar o peito ate a barra ou fica distante?',
    'Sente mais os biceps ou as costas trabalhando?',
    'Ha balanco ou kipping durante a execucao?',
    'Qual a largura da sua pegada - mais aberta ou na largura dos ombros?',
  ],
  'elevacao-pelvica': [
    'Voce sente os gluteos contraindo no topo do movimento?',
    'A extensao do quadril e completa ou fica incompleta?',
    'Sente mais os isquiotibiais ou gluteos trabalhando?',
    'Consegue manter a posicao neutra da coluna durante o movimento?',
    'Onde voce posiciona a barra em relacao ao quadril?',
  ],
  geral: [
    'Qual exercicio especifico voce gostaria de analisar?',
    'Voce sente alguma assimetria entre os lados direito e esquerdo?',
    'Ha quanto tempo pratica esse exercicio?',
    'Ja teve alguma lesao que pode estar afetando o movimento?',
    'Qual seu objetivo principal: forca, hipertrofia ou reabilitacao?',
  ],
};

// ========================================
// TEMPLATES DE RESPOSTA
// ========================================

export const BIOMECHANICS_TEMPLATES = {
  WELCOME_HUB: (userName: string) =>
    `Bem-vindo ao Hub Biomecanico, ${userName}! Aqui discutimos tecnica, padrao de movimento e correcao de execucao. Compartilhe suas duvidas sobre qualquer exercicio ou padrao de movimento.\n\nQual exercicio voce gostaria de melhorar a tecnica?`,

  TECHNIQUE_ANALYSIS: (movement: string, analysis: string, cues: string[], followUp: string) =>
    `**Analise Biomecanica: ${movement}**\n\n${analysis}\n\n**Cues Corretivos:**\n${cues.map(c => `- ${c}`).join('\n')}\n\n${followUp}`,

  RED_FLAG_DETECTED: (symptom: string) =>
    `Percebi que voce mencionou ${symptom}. Isso pode indicar algo que vai alem da analise de movimento. Recomendo fortemente que consulte um fisioterapeuta ou medico do esporte para uma avaliacao clinica antes de continuar com esse padrao de movimento.\n\nEnquanto isso, posso ajudar com adaptacoes de exercicios que nao sobrecarreguem essa regiao. Que exercicio voce precisa adaptar?`,

  PREMIUM_UPSELL: (pattern: string) =>
    `Para uma analise mais detalhada com video, temos a arena especializada de ${pattern}. La voce pode enviar seu video e receber uma analise completa com IA + revisao de especialista.\n\nQuer saber mais sobre como funciona a analise por video?`,
};

// ========================================
// HELPERS
// ========================================

/**
 * Retorna follow-up aleatorio para um padrao de movimento
 */
export function getRandomFollowUp(pattern: string): string {
  const questions = FOLLOW_UP_QUESTIONS[pattern] || FOLLOW_UP_QUESTIONS.geral;
  return questions[Math.floor(Math.random() * questions.length)];
}

/**
 * Detecta red flags biomecanicas no texto
 */
export function detectBiomechanicsRedFlags(text: string): string | null {
  const lowerText = text.toLowerCase();

  const redFlags: Record<string, string> = {
    'dor aguda': 'dor aguda durante o exercicio',
    'dor forte': 'dor forte durante o movimento',
    'estalo': 'estalidos articulares com dor',
    'crepitacao': 'crepitacao articular',
    'formigamento': 'sintomas neurologicos (formigamento)',
    'dormencia': 'sintomas neurologicos (dormencia)',
    'travou': 'bloqueio articular',
    'nao consigo mexer': 'limitacao funcional',
    'inchou': 'edema/inchaco articular',
    'hernia': 'condicao clinica (hernia)',
    'protrusao': 'condicao clinica (protrusao discal)',
  };

  for (const [trigger, description] of Object.entries(redFlags)) {
    if (lowerText.includes(trigger)) {
      return description;
    }
  }

  return null;
}

/**
 * Detecta padrao de movimento mencionado no texto
 */
export function detectMovementPattern(text: string): string {
  const lowerText = text.toLowerCase();

  const patterns: Record<string, string[]> = {
    agachamento: ['agachamento', 'squat', 'agachar', 'front squat', 'back squat', 'goblet'],
    terra: ['terra', 'deadlift', 'levantamento terra', 'stiff', 'romeno'],
    supino: ['supino', 'bench press', 'supino reto', 'supino inclinado'],
    puxadas: ['puxada', 'pull up', 'chin up', 'remada', 'pulldown', 'barra fixa'],
    'elevacao-pelvica': ['elevacao pelvica', 'hip thrust', 'ponte', 'glute bridge'],
  };

  for (const [pattern, keywords] of Object.entries(patterns)) {
    if (keywords.some(kw => lowerText.includes(kw))) {
      return pattern;
    }
  }

  return 'geral';
}
