/**
 * Investigation Engine - Motor de Investigação Biomecânica
 *
 * CORAÇÃO DO SISTEMA: Gerencia o fluxo de investigação progressiva de sintomas
 *
 * Baseado em metodologia médica:
 * - Mínimo 3 perguntas antes de diagnóstico
 * - Detecção de red flags para encaminhamento médico
 * - Diagnóstico em 3 níveis: adjustment, anatomical, medical_referral
 */

import { parseSymptomFromPost, ParsedSymptom } from './symptom-parser';
import { getInvestigationFlow, InvestigationFlow, INVESTIGATION_FLOWS } from './investigation-questions';

// ==========================================
// TIPOS E INTERFACES
// ==========================================

export interface InvestigationState {
  id: string;
  comunidadeSlug: string;
  userId: string;
  postId: string;
  region: string;
  parsedSymptom: ParsedSymptom;
  questionsAsked: string[];
  answersReceived: { question: string; answer: string }[];
  redFlagsDetected: string[];
  status: 'iniciada' | 'coletando_dados' | 'concluida' | 'encaminhada';
  diagnosisType?: 'adjustment' | 'anatomical' | 'medical_referral';
  finalDiagnosis?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiagnosisResult {
  type: 'adjustment' | 'anatomical' | 'medical_referral';
  title: string;
  explanation: string;
  recommendation: string;
  severity: 'leve' | 'moderado' | 'grave';
  shouldStop: boolean; // Deve parar o exercício?
  alternativeExercises?: string[];
}

// ==========================================
// CONSTANTES
// ==========================================

const MIN_QUESTIONS_FOR_DIAGNOSIS = 3;
const MAX_QUESTIONS = 6;

// ==========================================
// FUNÇÕES PRINCIPAIS
// ==========================================

/**
 * Inicia uma nova investigação a partir de um post de sintoma
 */
export function startInvestigation(
  comunidadeSlug: string,
  userId: string,
  postId: string,
  postContent: string
): InvestigationState | null {
  const parsedSymptom = parseSymptomFromPost(postContent);

  // Validar se é realmente um post de sintoma
  if (!parsedSymptom.isValid) {
    return null;
  }

  const investigationFlow = getInvestigationFlow(parsedSymptom.region);
  if (!investigationFlow) {
    return null;
  }

  return {
    id: generateInvestigationId(),
    comunidadeSlug,
    userId,
    postId,
    region: parsedSymptom.region,
    parsedSymptom,
    questionsAsked: [],
    answersReceived: [],
    redFlagsDetected: [],
    status: 'iniciada',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Retorna a próxima pergunta a ser feita
 */
export function getNextQuestion(state: InvestigationState): string | null {
  const flow = getInvestigationFlow(state.region);
  if (!flow) return null;

  // Limite de perguntas atingido
  if (state.questionsAsked.length >= MAX_QUESTIONS) {
    return null;
  }

  // Encontrar primeira pergunta ainda não feita
  for (const question of flow.questions) {
    if (!state.questionsAsked.includes(question)) {
      return question;
    }
  }

  return null;
}

/**
 * Processa a resposta do usuário e atualiza o estado
 */
export function processAnswer(
  state: InvestigationState,
  lastQuestion: string,
  answer: string
): InvestigationState {
  const updatedState = { ...state };

  // Adicionar resposta
  updatedState.answersReceived.push({
    question: lastQuestion,
    answer: answer.toLowerCase(),
  });

  // Verificar red flags na resposta
  const newRedFlags = checkRedFlags(state.region, answer);
  updatedState.redFlagsDetected = [
    ...new Set([...updatedState.redFlagsDetected, ...newRedFlags])
  ];

  // Atualizar status
  if (newRedFlags.length > 0) {
    updatedState.status = 'encaminhada';
  } else if (shouldGiveDiagnosis(updatedState)) {
    updatedState.status = 'concluida';
  } else {
    updatedState.status = 'coletando_dados';
  }

  updatedState.updatedAt = new Date();

  return updatedState;
}

/**
 * Verifica se já pode dar diagnóstico
 */
export function shouldGiveDiagnosis(state: InvestigationState): boolean {
  // Red flags detectados → encaminhar imediatamente
  if (state.redFlagsDetected.length > 0) {
    return true;
  }

  // Mínimo de perguntas respondidas
  if (state.answersReceived.length < MIN_QUESTIONS_FOR_DIAGNOSIS) {
    return false;
  }

  // Tem dados suficientes para diagnóstico
  const hasLocationInfo = state.parsedSymptom.location !== '';
  const hasTimingInfo = state.answersReceived.some(a =>
    a.question.toLowerCase().includes('quando') ||
    a.question.toLowerCase().includes('momento')
  );

  return hasLocationInfo && hasTimingInfo;
}

/**
 * Verifica red flags na resposta do usuário
 */
export function checkRedFlags(region: string, answer: string): string[] {
  const flow = getInvestigationFlow(region);
  if (!flow) return [];

  const lowerAnswer = answer.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const detected: string[] = [];

  for (const redFlag of flow.redFlags) {
    const keywords = extractKeywords(redFlag);

    // Se encontrar palavras-chave do red flag na resposta
    if (keywords.some(kw => lowerAnswer.includes(kw))) {
      detected.push(redFlag);
    }
  }

  return detected;
}

/**
 * Gera diagnóstico final baseado nos dados coletados
 */
export function generateDiagnosis(state: InvestigationState): DiagnosisResult {
  // 1. RED FLAGS → Encaminhamento médico
  if (state.redFlagsDetected.length > 0) {
    return {
      type: 'medical_referral',
      title: '🚨 Encaminhamento Médico Necessário',
      explanation: `Detectamos sinais de alerta que exigem avaliação médica:\n\n${state.redFlagsDetected.map(rf => `• ${rf}`).join('\n')}`,
      recommendation: 'Procure um médico ortopedista ou fisioterapeuta IMEDIATAMENTE. Não treine essa região até ter avaliação profissional.',
      severity: 'grave',
      shouldStop: true,
    };
  }

  const flow = getInvestigationFlow(state.region);
  if (!flow) {
    throw new Error('Flow não encontrado para região: ' + state.region);
  }

  // 2. Tentar match com padrões conhecidos
  const matchedIssue = matchCommonIssue(state, flow);

  if (matchedIssue) {
    // 80% dos casos → Adjustment (correção técnica)
    const isAnatomical = matchedIssue.diagnosis.includes('tensão') ||
                         matchedIssue.diagnosis.includes('fraqueza');

    if (isAnatomical) {
      // 15% → Anatomical (problema estrutural/muscular)
      return {
        type: 'anatomical',
        title: '⚠️ Questão Anatômica/Muscular',
        explanation: matchedIssue.diagnosis,
        recommendation: matchedIssue.adjustment,
        severity: 'moderado',
        shouldStop: false,
        alternativeExercises: suggestAlternatives(state.parsedSymptom.exercise, state.region),
      };
    } else {
      // 80% → Adjustment
      return {
        type: 'adjustment',
        title: '🎯 Ajuste de Técnica',
        explanation: matchedIssue.diagnosis,
        recommendation: matchedIssue.adjustment,
        severity: 'leve',
        shouldStop: false,
      };
    }
  }

  // 3. Diagnóstico genérico se não houver match
  return {
    type: 'adjustment',
    title: '🎯 Ajuste Necessário',
    explanation: `Baseado nos sintomas em ${state.region}, há sinais de sobrecarga ou compensação inadequada.`,
    recommendation: `Reduza a carga em 30%, foque na técnica perfeita, e observe se a dor melhora. Se persistir após 1 semana, procure orientação profissional.`,
    severity: 'leve',
    shouldStop: false,
  };
}

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

/**
 * Tenta fazer match com padrões conhecidos de problemas
 */
function matchCommonIssue(
  state: InvestigationState,
  flow: InvestigationFlow
): { pattern: string; diagnosis: string; adjustment: string } | null {
  const symptomText = buildSymptomText(state);

  for (const issue of flow.commonIssues) {
    const patternKeywords = extractKeywords(issue.pattern);
    const matchCount = patternKeywords.filter(kw =>
      symptomText.includes(kw)
    ).length;

    // Se match com 60%+ das palavras-chave do padrão
    if (matchCount / patternKeywords.length >= 0.6) {
      return issue;
    }
  }

  return null;
}

/**
 * Constrói texto com todos os sintomas para matching
 */
function buildSymptomText(state: InvestigationState): string {
  const parts: string[] = [];

  parts.push(state.parsedSymptom.exercise);
  parts.push(state.parsedSymptom.location);
  parts.push(state.parsedSymptom.timing);
  parts.push(state.parsedSymptom.painType);

  state.answersReceived.forEach(a => {
    parts.push(a.answer);
  });

  return parts.join(' ').toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Extrai palavras-chave de um texto
 */
function extractKeywords(text: string): string[] {
  const normalized = text.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // Palavras relevantes (ignorar conectivos)
  const stopwords = ['a', 'o', 'de', 'da', 'do', 'em', 'no', 'na', 'com', 'e', 'ou', 'para'];

  return normalized
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopwords.includes(word));
}

/**
 * Sugere exercícios alternativos baseado na região afetada
 */
function suggestAlternatives(currentExercise: string, region: string): string[] {
  const alternatives: Record<string, string[]> = {
    'ombro': [
      'Face pulls (manguito rotador)',
      'External rotation com banda',
      'Y-raises (deltóide posterior)',
      'Desenvolvimento com halteres (amplitude reduzida)',
    ],
    'joelho': [
      'Leg press (pés mais altos)',
      'Hip thrust (foco no glúteo)',
      'Step-up (altura reduzida)',
      'Extensão de joelho leve',
    ],
    'lombar': [
      'Hip thrust (substitui deadlift)',
      'Back extension (45°)',
      'Bird dog (estabilização)',
      'Prancha frontal',
    ],
    'pulso': [
      'Barra EZ (menos stress)',
      'Halteres (pegada neutra)',
      'Rosca martelo',
      'Fortalecer antebraço progressivamente',
    ],
    'quadril': [
      'Agachamento box (profundidade controlada)',
      'Leg press (stance largo)',
      'Ponte glúteo',
      'Clamshell (ativação glúteo médio)',
    ],
    'cotovelo': [
      'Rosca martelo (neutra)',
      'Tríceps na polia (pegada corda)',
      'Close grip bench (amplitude reduzida)',
      'Fortalecer extensores de punho',
    ],
    'tornozelo': [
      'Agachamento com calço',
      'Leg press',
      'Mobilidade de tornozelo (wall stretch)',
      'Fortalecimento progressivo de panturrilha',
    ],
  };

  return alternatives[region] || [
    'Consulte um profissional para alternativas seguras',
  ];
}

/**
 * Gera ID único para investigação
 */
function generateInvestigationId(): string {
  return `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Formata diagnóstico para exibição
 */
export function formatDiagnosisForChat(diagnosis: DiagnosisResult): string {
  let message = `${diagnosis.title}\n\n`;
  message += `📋 **Análise:**\n${diagnosis.explanation}\n\n`;
  message += `💡 **Recomendação:**\n${diagnosis.recommendation}\n\n`;

  if (diagnosis.shouldStop) {
    message += `🛑 **IMPORTANTE:** Interrompa o exercício até avaliação médica.\n\n`;
  }

  if (diagnosis.alternativeExercises && diagnosis.alternativeExercises.length > 0) {
    message += `🔄 **Exercícios Alternativos:**\n`;
    diagnosis.alternativeExercises.forEach(ex => {
      message += `• ${ex}\n`;
    });
    message += '\n';
  }

  // Severity indicator
  const severityEmoji = {
    'leve': '🟢',
    'moderado': '🟡',
    'grave': '🔴',
  };

  message += `${severityEmoji[diagnosis.severity]} Severidade: ${diagnosis.severity}`;

  return message;
}

export default {
  startInvestigation,
  getNextQuestion,
  processAnswer,
  shouldGiveDiagnosis,
  checkRedFlags,
  generateDiagnosis,
  formatDiagnosisForChat,
};
