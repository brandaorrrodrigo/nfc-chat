/**
 * Investigative Response - Lógica de Resposta Investigativa
 *
 * A IA faz perguntas progressivas para entender melhor a situação
 * antes de dar um diagnóstico completo.
 *
 * FLUXO:
 * 1. Usuário faz pergunta
 * 2. IA identifica tópico e inicia investigação
 * 3. IA faz primeira pergunta investigativa
 * 4. Usuário responde
 * 5. IA faz mais perguntas (até atingir requiredAnswers)
 * 6. IA dá diagnóstico completo
 */

import {
  getInvestigationFlow,
  isInvestigableQuestion,
  InvestigationQuestion,
} from './investigation-templates';
import {
  getInvestigationState,
  saveInvestigationState,
  shouldAskNextQuestion,
  getNextQuestion,
  isReadyForDiagnosis,
  createNewInvestigationState,
  InvestigationState,
} from './investigation-state';

// ========================================
// TIPOS
// ========================================

export interface InvestigativeResponseResult {
  shouldRespond: boolean;
  response?: string;
  responseType: 'investigation_start' | 'investigation_question' | 'investigation_diagnosis' | 'none';
  fpAwarded: number;
  investigationId?: string;
  questionsRemaining?: number;
}

export interface InvestigativeContext {
  userId: string;
  userName: string;
  messageId: string;
  comunidadeSlug: string;
  content: string;
  isReplyToIA?: boolean;
  parentMessageId?: string;
}

// ========================================
// FUNÇÃO PRINCIPAL
// ========================================

/**
 * Gera resposta investigativa baseada no contexto
 */
export async function generateInvestigativeResponse(
  context: InvestigativeContext
): Promise<InvestigativeResponseResult> {
  const { userId, userName, messageId, comunidadeSlug, content, isReplyToIA, parentMessageId } = context;

  // 1. Se é resposta à IA, processar como continuação de investigação
  if (isReplyToIA && parentMessageId) {
    return await handleInvestigationReply(context);
  }

  // 2. Verificar se é uma pergunta investigável
  if (!isInvestigableQuestion(content)) {
    return {
      shouldRespond: false,
      responseType: 'none',
      fpAwarded: 2,
    };
  }

  // 3. Identificar tópico e fluxo de investigação
  const flow = getInvestigationFlow(content);

  // 4. Verificar se já existe investigação para este post
  let state = await getInvestigationState(messageId);

  // 5. Se não existe, criar nova investigação
  if (!state) {
    state = createNewInvestigationState(userId, messageId, comunidadeSlug, flow.topic);
  }

  // 6. Gerar primeira pergunta investigativa
  const nextQuestion = getNextQuestion(state, flow);

  if (!nextQuestion) {
    // Não tem mais perguntas - dar resposta genérica
    return {
      shouldRespond: false,
      responseType: 'none',
      fpAwarded: 2,
    };
  }

  // 7. Montar resposta inicial
  const response = formatInitialResponse(userName, flow.topic, nextQuestion);

  // 8. Atualizar estado
  state.questionsAsked++;
  state.askedQuestions.push(nextQuestion);
  state.lastQuestionAt = new Date();

  const investigationId = await saveInvestigationState(state);

  return {
    shouldRespond: true,
    response,
    responseType: 'investigation_start',
    fpAwarded: 5,
    investigationId: investigationId || undefined,
    questionsRemaining: flow.requiredAnswers,
  };
}

/**
 * Processa resposta do usuário a uma pergunta da IA
 */
async function handleInvestigationReply(
  context: InvestigativeContext
): Promise<InvestigativeResponseResult> {
  const { userId, userName, messageId, comunidadeSlug, content, parentMessageId } = context;

  // Buscar investigação pelo messageId do parent (pergunta da IA)
  // Na prática, precisamos buscar pelo postId original
  // Por simplicidade, vamos criar/buscar pelo messageId atual

  let state = await getInvestigationState(parentMessageId || messageId);

  if (!state) {
    // Não encontrou investigação - pode ser resposta genérica
    return {
      shouldRespond: false,
      responseType: 'none',
      fpAwarded: 3,
    };
  }

  const flow = getInvestigationFlow(state.topic);

  // Incrementar respostas recebidas
  state.answersReceived++;
  state.lastQuestionAt = new Date();

  // Verificar se já tem respostas suficientes para diagnóstico
  if (isReadyForDiagnosis(state, flow)) {
    // Gerar diagnóstico final
    const diagnosis = generateFinalDiagnosis(userName, state.topic, flow);

    state.isComplete = true;
    await saveInvestigationState(state);

    return {
      shouldRespond: true,
      response: diagnosis,
      responseType: 'investigation_diagnosis',
      fpAwarded: 10,
      investigationId: state.id,
    };
  }

  // Ainda precisa de mais perguntas
  if (shouldAskNextQuestion(state, flow)) {
    const nextQuestion = getNextQuestion(state, flow);

    if (nextQuestion) {
      const response = formatFollowUpResponse(userName, nextQuestion, state.answersReceived, flow.requiredAnswers);

      state.questionsAsked++;
      state.askedQuestions.push(nextQuestion);
      await saveInvestigationState(state);

      return {
        shouldRespond: true,
        response,
        responseType: 'investigation_question',
        fpAwarded: 3,
        investigationId: state.id,
        questionsRemaining: flow.requiredAnswers - state.answersReceived,
      };
    }
  }

  // Não tem mais perguntas mas também não completou - dar diagnóstico parcial
  const partialDiagnosis = generatePartialDiagnosis(userName, state.topic);
  state.isComplete = true;
  await saveInvestigationState(state);

  return {
    shouldRespond: true,
    response: partialDiagnosis,
    responseType: 'investigation_diagnosis',
    fpAwarded: 6,
    investigationId: state.id,
  };
}

// ========================================
// FORMATAÇÃO DE RESPOSTAS
// ========================================

function formatInitialResponse(userName: string, topic: string, question: string): string {
  const greetings = [
    `${userName}, ótima pergunta!`,
    `Oi ${userName}!`,
    `${userName}, vamos entender melhor sua situação.`,
    `Obrigada por compartilhar, ${userName}!`,
  ];

  const greeting = greetings[Math.floor(Math.random() * greetings.length)];

  return `${greeting} 💚

Para te dar uma orientação mais precisa sobre **${topic}**, preciso entender alguns detalhes:

➡️ **${question}**

Quanto mais informações você compartilhar, melhor consigo te ajudar!`;
}

function formatFollowUpResponse(
  userName: string,
  question: string,
  answersReceived: number,
  requiredAnswers: number
): string {
  const progress = Math.round((answersReceived / requiredAnswers) * 100);

  const transitions = [
    'Entendi!',
    'Perfeito, isso ajuda muito!',
    'Ótimo, estamos avançando!',
    'Obrigada pela resposta!',
  ];

  const transition = transitions[Math.min(answersReceived - 1, transitions.length - 1)];

  return `${transition} 📝

➡️ **${question}**

(${progress}% das informações necessárias)`;
}

function generateFinalDiagnosis(userName: string, topic: string, flow: InvestigationQuestion): string {
  // Templates de diagnóstico por tópico
  const diagnoses: Record<string, string> = {
    'lipedema': `
Baseado no que você compartilhou, **${userName}**, aqui está minha análise:

📋 **Sobre Lipedema:**
O lipedema é uma condição de acúmulo desproporcional de gordura, geralmente nas pernas e braços, com características específicas:
- Simetria bilateral
- Sensibilidade/dor ao toque
- Não afeta mãos e pés
- Resistência a dieta e exercício

**Próximos passos recomendados:**
1. Consultar um angiologista ou médico especializado em lipedema
2. Considerar drenagem linfática como tratamento complementar
3. Exercícios de baixo impacto (natação, pilates, hidroginástica)
4. Usar meias de compressão conforme orientação médica

⚠️ **Importante:** O diagnóstico definitivo só pode ser feito por um médico especialista.
`,

    'déficit calórico': `
${userName}, baseado nas suas respostas, aqui está minha análise:

📋 **Sobre seu déficit calórico:**
Para emagrecer de forma sustentável, alguns pontos são essenciais:

**Recomendações:**
1. **Déficit moderado:** 300-500 kcal abaixo da sua manutenção
2. **Proteína adequada:** 1.6-2.2g por kg de peso corporal
3. **Treino de força:** Preserva massa muscular durante o déficit
4. **Sono:** Mínimo 7-8h por noite (afeta hormônios da fome)
5. **Paciência:** 0.5-1% do peso corporal por semana é o ideal

**Sinais de déficit excessivo:**
- Fadiga constante
- Queda de cabelo
- Ciclo menstrual irregular
- Irritabilidade extrema

Se você está experienciando esses sinais, considere uma "diet break" de 1-2 semanas.
`,

    'treino de glúteo': `
${userName}, aqui estão as orientações para seu treino de glúteo:

📋 **Para hipertrofia de glúteo:**

**Exercícios essenciais:**
1. Hip thrust (barra ou máquina)
2. Elevação pélvica
3. Agachamento sumo
4. Passada/Afundo
5. Abdução de quadril

**Frequência ideal:** 2-3x por semana com 48-72h de descanso

**Dicas importantes:**
- Conexão mente-músculo: sinta o glúteo trabalhando
- Progressão de carga: aumente peso gradualmente
- Variedade de estímulos: combine exercícios diferentes
- Proteína: fundamental para recuperação e crescimento
`,

    'ansiedade e compulsão alimentar': `
${userName}, agradeço por compartilhar algo tão pessoal. Aqui estão algumas orientações:

📋 **Sobre compulsão alimentar:**

**Estratégias que podem ajudar:**
1. **Não restringir demais:** Restrição severa aumenta compulsão
2. **Comer regular:** 3-4 refeições/dia sem pular
3. **Identificar gatilhos:** Anotar situações que precedem episódios
4. **Técnica STOP:** Parar, respirar, observar pensamentos, prosseguir consciente
5. **Saciedade:** Priorizar proteína e fibras nas refeições

**Muito importante:**
⚠️ Compulsão alimentar é uma condição séria que se beneficia muito de acompanhamento profissional (psicólogo/psiquiatra). Não hesite em buscar ajuda especializada.

💚 Você não está sozinha nisso.
`,

    'canetas emagrecedoras (GLP-1)': `
${userName}, sobre as canetas de GLP-1:

📋 **Informações importantes:**

**Como funcionam:**
- Aumentam saciedade
- Retardam esvaziamento gástrico
- Regulam glicemia

**Efeitos colaterais comuns:**
- Náusea (geralmente melhora com o tempo)
- Intestino preso ou diarreia
- Dor de cabeça

**Recomendações essenciais:**
1. **SEMPRE com acompanhamento médico**
2. Combinar com alimentação adequada (proteína!)
3. Manter exercício físico (especialmente musculação)
4. Beber muita água
5. Comer devagar e em pequenas porções

⚠️ **Atenção:** Sem mudança de hábitos, o peso pode retornar ao parar o medicamento.
`,
  };

  const diagnosis = diagnoses[topic] || diagnoses['geral'] || generateGenericDiagnosis(userName, topic);

  return `${diagnosis}

---
💡 **Quer um plano mais detalhado?**
Assinantes Premium têm acesso a protocolos completos no APP.

🪙 **+10 FP** pela consulta completa!`;
}

function generateGenericDiagnosis(userName: string, topic: string): string {
  return `
${userName}, baseado no que você compartilhou sobre **${topic}**:

📋 **Minhas recomendações gerais:**

1. **Consistência:** Resultados vêm com tempo e regularidade
2. **Individualidade:** O que funciona para uma pessoa pode não funcionar para outra
3. **Acompanhamento:** Considere buscar um profissional especializado
4. **Paciência:** Mudanças sustentáveis levam tempo

Se quiser, pode compartilhar mais detalhes para eu te ajudar melhor!
`;
}

function generatePartialDiagnosis(userName: string, topic: string): string {
  return `
${userName}, com as informações que tenho até agora sobre **${topic}**:

📋 **Orientação preliminar:**

Ainda não tenho todas as informações para uma análise completa, mas posso te dizer que:
- Cada caso é único e merece atenção individualizada
- Recomendo buscar acompanhamento profissional para uma avaliação completa
- Continue participando da comunidade - outras pessoas podem ter experiências similares!

💚 Estou aqui se quiser continuar a conversa!

🪙 **+6 FP** pela participação!`;
}

// ========================================
// EXPORTS
// ========================================

export default {
  generateInvestigativeResponse,
};
