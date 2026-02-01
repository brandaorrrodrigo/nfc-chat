/**
 * Investigation Response Generator - Gerador de Respostas da IA Investigativa
 *
 * Gera respostas contextuais e empáticas para cada fase da investigação biomecânica
 */

import { InvestigationState, DiagnosisResult } from '../biomechanics/investigation-engine';
import { ParsedSymptom } from '../biomechanics/symptom-parser';

// ==========================================
// TIPOS
// ==========================================

interface ResponseTemplate {
  greeting: string[];
  transition: string[];
  question: string;
}

// ==========================================
// RESPOSTA INICIAL (ao detectar post de dor)
// ==========================================

export function generateInitialResponse(symptom: ParsedSymptom, firstQuestion: string): string {
  const greetings = [
    'Opa, vi que você está com desconforto',
    'Percebi que mencionou dor',
    'Vamos investigar isso com cuidado',
    'Importante a gente entender melhor esse sintoma',
  ];

  const concerns = {
    'ombro': 'O ombro é uma articulação complexa e merece atenção',
    'joelho': 'Joelho é fundamental pra maioria dos exercícios, vamos cuidar disso',
    'lombar': 'Lombar exige cuidado especial, vamos investigar',
    'pulso': 'Pulso é delicado, importante entender o que está acontecendo',
    'quadril': 'Quadril é a base de muitos movimentos, vamos ver isso',
    'cotovelo': 'Cotovelo merece atenção, vamos investigar',
    'tornozelo': 'Tornozelo é crucial pra estabilidade, vamos analisar',
  };

  const greeting = greetings[Math.floor(Math.random() * greetings.length)];
  const concern = concerns[symptom.region as keyof typeof concerns] || 'Vamos investigar isso com atenção';

  let response = `${greeting} em **${symptom.region}**. ${concern}.\n\n`;

  // Se já tiver informações do post
  if (symptom.exercise) {
    response += `📌 Exercício: **${symptom.exercise}**\n`;
  }
  if (symptom.location) {
    response += `📍 Local: ${symptom.location}\n`;
  }
  if (symptom.intensity > 0) {
    const intensityLabel = getIntensityLabel(symptom.intensity);
    response += `⚡ Intensidade: ${symptom.intensity}/10 (${intensityLabel})\n`;
  }
  if (symptom.duration) {
    response += `⏱️ Duração: ${symptom.duration}\n`;
  }

  response += `\n🔍 Vou te fazer algumas perguntas pra entender melhor:\n\n`;
  response += `**${firstQuestion}**`;

  return response;
}

// ==========================================
// PERGUNTA DE FOLLOW-UP (durante investigação)
// ==========================================

export function generateFollowUpResponse(
  state: InvestigationState,
  nextQuestion: string,
  questionNumber: number
): string {
  const transitions = [
    'Entendi. Agora me diz:',
    'Certo, próxima pergunta:',
    'Okay, mais uma coisa:',
    'Beleza, continua comigo:',
    'Valeu pela resposta. Agora:',
  ];

  const encouragements = [
    'Essas informações vão me ajudar a te orientar melhor 👊',
    'Quanto mais detalhes, melhor consigo te ajudar 💪',
    'Estamos quase lá, só mais algumas perguntas 🎯',
    'Obrigado pelas respostas, está me ajudando muito 🙏',
  ];

  let response = '';

  // A cada 2 perguntas, adicionar encorajamento
  if (questionNumber % 2 === 0 && questionNumber > 1) {
    response += `${encouragements[Math.floor(Math.random() * encouragements.length)]}\n\n`;
  }

  const transition = transitions[Math.floor(Math.random() * transitions.length)];
  response += `${transition}\n\n**${nextQuestion}**`;

  return response;
}

// ==========================================
// DIAGNÓSTICO FINAL
// ==========================================

export function generateFinalDiagnosisResponse(
  state: InvestigationState,
  diagnosis: DiagnosisResult
): string {
  let response = '';

  // Header baseado no tipo
  if (diagnosis.type === 'medical_referral') {
    response += generateMedicalReferralResponse(state, diagnosis);
  } else if (diagnosis.type === 'anatomical') {
    response += generateAnatomicalResponse(state, diagnosis);
  } else {
    response += generateAdjustmentResponse(state, diagnosis);
  }

  // Footer comum
  response += '\n\n---\n';
  response += generateFooter(diagnosis.type);

  return response;
}

// ==========================================
// RESPOSTAS POR TIPO DE DIAGNÓSTICO
// ==========================================

function generateMedicalReferralResponse(
  state: InvestigationState,
  diagnosis: DiagnosisResult
): string {
  let response = '🚨 **ATENÇÃO: Encaminhamento Médico Necessário**\n\n';

  response += `Baseado nas suas respostas, identifiquei sinais de alerta que exigem avaliação profissional:\n\n`;

  state.redFlagsDetected.forEach(flag => {
    response += `⚠️ ${flag}\n`;
  });

  response += `\n**O que fazer AGORA:**\n\n`;
  response += `1. ❌ **PARE** de treinar essa região imediatamente\n`;
  response += `2. 👨‍⚕️ Procure um **ortopedista** ou **fisioterapeuta** ainda esta semana\n`;
  response += `3. 📋 Leve essas informações na consulta:\n`;
  response += `   • Exercício: ${state.parsedSymptom.exercise || 'não especificado'}\n`;
  response += `   • Local: ${state.parsedSymptom.location || 'região de ' + state.region}\n`;
  response += `   • Tempo: ${state.parsedSymptom.duration || 'não especificado'}\n\n`;

  response += `**Por que isso é importante:**\n`;
  response += diagnosis.explanation + '\n\n';

  response += `Não se preocupe excessivamente, mas também não ignore. Agir rápido pode prevenir problemas maiores. 💪`;

  return response;
}

function generateAnatomicalResponse(
  state: InvestigationState,
  diagnosis: DiagnosisResult
): string {
  let response = '⚠️ **Questão Anatômica/Muscular Detectada**\n\n';

  response += `**Diagnóstico:**\n`;
  response += diagnosis.explanation + '\n\n';

  response += `**O que fazer:**\n`;
  response += diagnosis.recommendation + '\n\n';

  if (diagnosis.alternativeExercises && diagnosis.alternativeExercises.length > 0) {
    response += `**Exercícios Alternativos (enquanto trata):**\n`;
    diagnosis.alternativeExercises.forEach((ex, idx) => {
      response += `${idx + 1}. ${ex}\n`;
    });
    response += '\n';
  }

  response += `**Protocolo sugerido:**\n`;
  response += `1. 🧊 Gelo após treino (15-20 min) se houver inflamação\n`;
  response += `2. 🔄 Trabalhe os exercícios alternativos por 2 semanas\n`;
  response += `3. 💪 Fortaleça a região com carga progressiva e leve\n`;
  response += `4. 📊 Monitore: se melhorar, ótimo! Se piorar ou estabilizar, procure fisio\n\n`;

  response += `Isso é comum e geralmente resolve com ajustes. Paciência e consistência! 🎯`;

  return response;
}

function generateAdjustmentResponse(
  state: InvestigationState,
  diagnosis: DiagnosisResult
): string {
  let response = '🎯 **Ajuste de Técnica Necessário**\n\n';

  response += `**O que está acontecendo:**\n`;
  response += diagnosis.explanation + '\n\n';

  response += `**Correção (aplique JÁ no próximo treino):**\n`;
  response += diagnosis.recommendation + '\n\n';

  response += `**Checklist antes do próximo treino:**\n`;
  response += `✅ Reduzir carga em 30% pra focar na técnica\n`;
  response += `✅ Fazer aquecimento específico da região\n`;
  response += `✅ Filmar um set pra checar a execução\n`;
  response += `✅ Se a dor sumir nos primeiros sets = caminho certo!\n\n`;

  // Dicas específicas por região
  const regionTips: Record<string, string> = {
    'ombro': '💡 **Dica de ouro:** Retrai a escápula ANTES de iniciar qualquer movimento de ombro. Imagina que está tentando segurar um lápis entre as escápulas.',
    'joelho': '💡 **Dica de ouro:** Pensa em "empurrar o chão com os pés" ao invés de "levantar o peso". Muda completamente a ativação.',
    'lombar': '💡 **Dica de ouro:** Core tenso ANTES de puxar/empurrar qualquer peso. Expire forcando no esforço.',
    'pulso': '💡 **Dica de ouro:** Aperte a barra/halter FORTE. Isso estabiliza o punho naturalmente.',
    'quadril': '💡 **Dica de ouro:** Abre bem o quadril antes (90-90 stretch 2 min). Mobilidade resolve 80% dos problemas.',
    'cotovelo': '💡 **Dica de ouro:** Cotovelo sempre alinhado com o movimento. Se ele "escapa" pro lado, reduza a carga.',
    'tornozelo': '💡 **Dica de ouro:** Trabalhe mobilidade de tornozelo TODO DIA (wall ankle mobility 3x30seg).',
  };

  response += regionTips[state.region] || '💡 Foco total na execução perfeita com carga moderada.';
  response += '\n\n';

  response += `Na dúvida, **sempre** prefira técnica perfeita do que carga pesada. Seu corpo agradece a longo prazo! 💪`;

  return response;
}

// ==========================================
// RODAPÉ
// ==========================================

function generateFooter(diagnosisType: string): string {
  if (diagnosisType === 'medical_referral') {
    return `🏥 Este sistema é baseado em literatura científica (Netter, Sobotta, Cyriax), mas **NÃO substitui avaliação médica**. Em caso de sinais de alerta, sempre consulte um profissional.`;
  }

  return `📚 Diagnóstico baseado em: Netter (Anatomia), Sobotta (Atlas), Cyriax (Medicina Ortopédica), Kapandji (Fisiologia Articular)\n\n💬 Aplique as correções e me conta o resultado no próximo treino!`;
}

// ==========================================
// HELPERS
// ==========================================

function getIntensityLabel(intensity: number): string {
  if (intensity <= 3) return 'leve';
  if (intensity <= 6) return 'moderado';
  if (intensity <= 8) return 'forte';
  return 'muito forte';
}

/**
 * Gera resumo da investigação para logging
 */
export function generateInvestigationSummary(state: InvestigationState): string {
  let summary = `Investigação: ${state.region}\n`;
  summary += `Exercício: ${state.parsedSymptom.exercise || 'não especificado'}\n`;
  summary += `Perguntas feitas: ${state.questionsAsked.length}\n`;
  summary += `Red flags: ${state.redFlagsDetected.length > 0 ? state.redFlagsDetected.join(', ') : 'nenhum'}\n`;
  summary += `Status: ${state.status}`;
  return summary;
}

export default {
  generateInitialResponse,
  generateFollowUpResponse,
  generateFinalDiagnosisResponse,
  generateInvestigationSummary,
};
