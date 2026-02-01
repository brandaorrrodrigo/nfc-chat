/**
 * Gerador de Respostas Educativas para Arena Aspiracional & Estética
 * Tom: Maduro, responsável, científico
 */

import { ParsedAspiration } from '../aesthetics/aspiration-parser';
import { findProcedure, ProcedureData } from '../aesthetics/procedures-database';

export function generateAestheticEducationResponse(
  userName: string,
  aspiration: ParsedAspiration
): string {
  const procedure = findProcedure(aspiration.procedure);

  // Red flag: estado emocional impulsivo
  if (aspiration.emotionalState === 'impulsive') {
    return generateImpulsiveWarning(userName, aspiration);
  }

  if (!procedure) {
    return generateGenericAestheticResponse(userName, aspiration);
  }

  // Resposta educativa completa
  return `
💎 **Análise Educativa Completa**

Olá, ${userName}! Obrigada por compartilhar seu sonho com maturidade.

Vou te orientar sobre **${procedure.name}** com base em tratados médicos.

---

📚 **ANATOMIA DO PROCEDIMENTO**

**O que é alterado:**
${procedure.anatomyInvolved.map((a) => `• ${a}`).join('\n')}

**Fonte científica:** ${procedure.scientificSource}

---

${aspiration.motivation ? `💭 **SUA MOTIVAÇÃO**\n\nVocê disse: *"${aspiration.motivation}"*\n\n${validateMotivation(aspiration.motivation, procedure)}\n\n---\n\n` : ''}

🏋️ **PREPARO NECESSÁRIO (Tempo recomendado: ${procedure.prepTimeRecommended})**

Antes de pensar em data, vamos ver se você está pronta:

**1. Preparo Físico:**
${procedure.requiredPrep.physical.map((p) => `✓ ${p}`).join('\n')}

**2. Preparo Nutricional:**
${procedure.requiredPrep.nutritional.map((n) => `✓ ${n}`).join('\n')}

**3. Preparo Médico:**
${procedure.requiredPrep.medical.map((m) => `✓ ${m}`).join('\n')}

**4. Preparo Psicológico:**
${procedure.requiredPrep.psychological.map((p) => `✓ ${p}`).join('\n')}

---

${assessCurrentPrep(aspiration.currentPrep, procedure)}

---

⏱️ **RECUPERAÇÃO REALISTA**

Não se iluda com "volta rápido":

- **Trabalho:** ${procedure.recoveryTime.returnToWork}
- **Treino leve:** ${procedure.recoveryTime.returnToTraining}
- **Resultado final:** ${procedure.recoveryTime.fullRecovery}

---

⚠️ **RISCOS QUE VOCÊ PRECISA CONHECER**

${procedure.risks.map((r) => `• ${r}`).join('\n')}

**Isso não é para assustar, é para você DECIDIR COM CONSCIÊNCIA.**

---

✅ **PERFIL IDEAL PARA ESTE PROCEDIMENTO**

${procedure.idealCandidateProfile}

❌ **NÃO recomendado se:**
${procedure.notRecommendedFor.map((n) => `• ${n}`).join('\n')}

---

${generateNextSteps(aspiration, procedure)}

---

💎 **Lembre-se:**

Cirurgia plástica é COMPLEMENTO de um estilo de vida saudável, não substituto de treino e dieta.

Quanto MELHOR você chegar na cirurgia (fisicamente e psicologicamente), MELHOR será o resultado.

---

🪙 **+10 FP** por compartilhar com maturidade!

Tem mais dúvidas? Pergunte aqui! 💚
  `.trim();
}

function validateMotivation(motivation: string, procedure: ProcedureData): string {
  const lower = motivation.toLowerCase();

  // Motivações saudáveis
  const healthyMotivations = [
    'autoestima',
    'sentir bem',
    'proporção',
    'assimetria',
    'pós-gravidez',
    'grande emagrecimento',
    'genética',
  ];

  // Motivações preocupantes
  const concerningMotivations = [
    'ex',
    'namorado',
    'marido',
    'ficar igual',
    'celebridade',
    'instagram',
    'inveja',
    'competir',
  ];

  const hasHealthy = healthyMotivations.some((m) => lower.includes(m));
  const hasConcerning = concerningMotivations.some((m) => lower.includes(m));

  if (hasConcerning) {
    return `
⚠️ **Atenção importante:**

Percebi que sua motivação pode estar ligada a comparação ou pressão externa.

**Cirurgia plástica deve ser para VOCÊ, não para:**
- Agradar parceiro
- Competir com alguém
- Ficar igual a influencer X

Se houver QUALQUER dúvida sobre isso, converse com psicólogo antes de marcar cirurgião.

Cirurgia não resolve problemas emocionais. Ela complementa um EU que já está bem consigo mesmo. 💚
    `.trim();
  }

  if (hasHealthy) {
    return `
✅ **Sua motivação é saudável!**

Você está buscando harmonia com SEU corpo, não tentando ser outra pessoa.
Isso é fundamental para um resultado satisfatório.
    `.trim();
  }

  return 'Essa motivação parece genuína. Continue sendo honesta consigo mesma durante todo o processo.';
}

function assessCurrentPrep(
  currentPrep: { training: boolean; diet: boolean; medicalFollowup: boolean },
  procedure: ProcedureData
): string {
  const { training, diet, medicalFollowup } = currentPrep;

  let assessment = '🎯 **AVALIAÇÃO DO SEU PREPARO ATUAL**\n\n';

  if (!training) {
    assessment += `
❌ **Treino:** Você ainda NÃO está treinando.

**Por que isso importa:**
${procedure.requiredPrep.physical[0]}

**Recomendação:** Comece treino de força AGORA. Isso prepara seu corpo E melhora resultado final.
    `.trim() + '\n\n';
  } else {
    assessment += '✅ **Treino:** Você já treina! Ótimo começo.\n\n';
  }

  if (!diet) {
    assessment += `
❌ **Nutrição:** Você ainda NÃO está com dieta estruturada.

**Por que isso importa:**
Nutrição adequada acelera cicatrização em até 40%.

**Recomendação:** Procure nutricionista ANTES de marcar cirurgia.
    `.trim() + '\n\n';
  } else {
    assessment += '✅ **Nutrição:** Você já cuida da dieta! Excelente.\n\n';
  }

  if (!medicalFollowup) {
    assessment += `
⚠️ **Médico:** Você ainda NÃO consultou cirurgião.

**Próximo passo OBRIGATÓRIO:**
Agende consulta com cirurgião plástico membro da SBCP (Sociedade Brasileira de Cirurgia Plástica).

Verifique no site: https://www2.cirurgiaplastica.org.br/
    `.trim();
  } else {
    assessment += '✅ **Médico:** Você já está em acompanhamento! Perfeito.\n\n';
  }

  return assessment;
}

function generateNextSteps(aspiration: ParsedAspiration, procedure: ProcedureData): string {
  const hasTraining = aspiration.currentPrep.training;
  const hasDiet = aspiration.currentPrep.diet;
  const hasMedical = aspiration.currentPrep.medicalFollowup;

  let steps = '🎯 **SEUS PRÓXIMOS PASSOS (Ordem Cronológica)**\n\n';

  if (!hasTraining && !hasDiet) {
    steps += `
**FASE 1 - PREPARO FÍSICO (Comece JÁ - 3-6 meses)**
1. Contratar personal ou seguir programa de treino estruturado
2. Focar em: ${procedure.requiredPrep.physical[0].toLowerCase()}
3. Estabilizar peso (não emagreça/engorde bruscamente)

**FASE 2 - PREPARO NUTRICIONAL (Paralelo à Fase 1)**
1. Consultar nutricionista
2. Implementar dieta anti-inflamatória
3. Suplementação básica (sob orientação)

**FASE 3 - CONSULTA MÉDICA (Após Fases 1 e 2 estabilizadas)**
1. Pesquisar cirurgiões SBCP na sua região
2. Agendar 2-3 consultas (comparar abordagens)
3. Fazer exames pré-operatórios
4. Agendar data (se tudo OK)

**FASE 4 - PÓS-OPERATÓRIO**
1. Seguir protocolo médico À RISCA
2. Drenagem linfática (se indicado)
3. Retorno gradual ao treino
4. Manutenção de resultados (treino + dieta continuam!)
    `.trim();
  } else if (hasMedical) {
    steps += `
Como você já está em acompanhamento médico, seus próximos passos são:

1. **Otimizar preparo físico** (fortalecer áreas envolvidas)
2. **Ajustar nutrição** (protocolo anti-inflamatório 30 dias antes)
3. **Exames pré-operatórios** (conforme pedido do cirurgião)
4. **Preparar suporte pós-op** (quem vai te ajudar em casa?)
5. **Estudar recuperação** (tempo, limitações, cuidados)

Você está no caminho certo! 💪
    `.trim();
  } else {
    steps += `
Você já treina e cuida da dieta, ótimo! Próximos passos:

1. **Consultar cirurgião plástico SBCP**
2. **Fazer exames pré-operatórios**
3. **Ajustar treino** (foco em áreas específicas)
4. **Protocolo nutricional** (30 dias antes)
5. **Agendar cirurgia** (quando tudo estiver alinhado)
    `.trim();
  }

  return steps;
}

function generateImpulsiveWarning(userName: string, aspiration: ParsedAspiration): string {
  return `
🚨 **ATENÇÃO - Vamos Conversar com Calma**

${userName}, percebi pela sua mensagem que você está com muita urgência para fazer **${aspiration.procedure}**.

Frases como "quero fazer já" ou "urgente" são **sinais de alerta**.

---

**Por que isso é preocupante:**

Cirurgia plástica é uma DECISÃO PERMANENTE que requer:
- Preparo físico (meses)
- Preparo psicológico (certeza genuína)
- Escolha cuidadosa de cirurgião
- Entendimento de riscos

**Decisões impulsivas aumentam:**
- Arrependimento pós-operatório
- Escolha de cirurgião inadequado (risco!)
- Resultado insatisfatório
- Complicações por falta de preparo

---

**O que eu recomendo ANTES de qualquer coisa:**

1. **Respire fundo e dê tempo a si mesma** (mínimo 3 meses pensando)
2. **Converse com psicólogo** (entender o "porquê" da urgência)
3. **Pesquise MUITO** (leia, estude, assista cirurgias reais no YouTube médico)
4. **Prepare seu corpo** (treino + dieta)

Se daqui 3-6 meses você AINDA quiser, aí sim é decisão madura.

---

Cirurgia não é "compra por impulso". É projeto de vida. 💎

Quer conversar sobre o que está gerando essa urgência? Estou aqui. 💚

🪙 **+5 FP** por compartilhar (mesmo que eu tenha questionado).
  `.trim();
}

function generateGenericAestheticResponse(userName: string, aspiration: ParsedAspiration): string {
  return `
Olá, ${userName}!

Você mencionou interesse em **${aspiration.procedure}**, mas ainda não tenho
dados técnicos completos sobre este procedimento específico.

**O que posso te orientar:**

✅ **Antes de QUALQUER cirurgia:**
1. Consulte cirurgião plástico membro da SBCP
2. Prepare seu corpo (treino + nutrição)
3. Faça exames pré-operatórios
4. Entenda riscos e recuperação
5. Tenha expectativas realistas

✅ **Perguntas para fazer ao cirurgião:**
- Qual sua especialização neste procedimento?
- Quantas cirurgias desse tipo você já fez?
- Posso ver fotos de antes/depois de pacientes reais?
- Quais são os riscos específicos para MIM?
- Qual o protocolo de recuperação?
- O que acontece se o resultado não for o esperado?

Pesquise MUITO antes de decidir. Cirurgia é para sempre. 💎

🪙 **+10 FP** por compartilhar!
  `.trim();
}
