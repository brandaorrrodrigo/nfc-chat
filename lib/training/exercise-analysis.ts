/**
 * Exercise Analysis Generator
 *
 * Gera análise biomecânica completa para exercícios compartilhados.
 * Inclui: músculos ativados, progressões, variações e combo de treino.
 */

import { ParsedExercise } from './exercise-parser';
import { findExercise, findSiblingExercises, ExerciseData } from './exercise-database';

// ==========================================
// TIPOS
// ==========================================

export interface ExerciseAnalysisResult {
  response: string;
  fpAwarded: number;
  exerciseFound: boolean;
  exerciseData?: ExerciseData;
  siblings: string[];
}

// ==========================================
// GERADOR PRINCIPAL
// ==========================================

/**
 * Gera análise biomecânica completa para um exercício
 */
export function generateExerciseAnalysis(
  userName: string,
  exercise: ParsedExercise
): ExerciseAnalysisResult {
  const exerciseData = findExercise(exercise.name);

  if (!exerciseData) {
    return generateGenericAnalysis(userName, exercise);
  }

  const siblings = findSiblingExercises(
    exerciseData.primaryMuscles[0],
    exercise.name
  ).map(e => e.name);

  const response = formatFullAnalysis(userName, exercise, exerciseData, siblings);
  const fpAwarded = calculateExerciseFP(exercise, exerciseData);

  return {
    response,
    fpAwarded,
    exerciseFound: true,
    exerciseData,
    siblings,
  };
}

// ==========================================
// FORMATADOR DE RESPOSTA COMPLETA
// ==========================================

function formatFullAnalysis(
  userName: string,
  exercise: ParsedExercise,
  data: ExerciseData,
  siblings: string[]
): string {
  let response = `💪 **Análise Biomecânica Completa**

Olá, ${userName}! Excelente escolha de exercício! Vou te mostrar EXATAMENTE o que está acontecendo no seu corpo:

---

🎯 **MÚSCULOS ATIVADOS**

**Principais:**
${data.primaryMuscles.map(m => `• ${capitalize(m)} (ativação primária)`).join('\n')}

**Secundários:**
${data.secondaryMuscles.map(m => `• ${capitalize(m)} (estabilização/suporte)`).join('\n')}

📊 **Dados de ativação:** ${data.biomechanics.activation}

📚 *Fonte: ${data.scientificSource}*

---

🔬 **POR QUE VOCÊ SENTE O QUE SENTE**`;

  // Explicar a sensação se foi mencionada
  if (exercise.feel) {
    response += `

Você mencionou: *"${exercise.feel}"*

${explainFeeling(exercise.feel, data)}`;
  }

  response += `

**Padrão de movimento:** ${data.movementPattern}
**Articulação principal:** ${data.biomechanics.joint}
**Amplitude (ROM):** ${data.biomechanics.rom}

📖 **Segundo o Atlas Netter:** ${generateNetterReference(data)}

---

📈 **PROGRESSÕES SUGERIDAS**`;

  // Mostrar carga atual se informada
  if (exercise.load) {
    response += `

Você está em: **${exercise.load.weight}kg x ${exercise.load.reps} reps${exercise.load.sets ? ` x ${exercise.load.sets} séries` : ''}**`;
  }

  response += `

**Próximos passos para evoluir:**
${data.progressions.map((p, i) => `${i + 1}. ${p}`).join('\n')}

💡 **Dica:** Mude UMA variável por vez (peso, reps, tempo, amplitude) para evitar platô!

---

🔄 **VARIAÇÕES DO EXERCÍCIO**

Estes exercícios trabalham os MESMOS músculos de forma diferente:

${data.variations.map((v, i) => `${i + 1}. **${v}**`).join('\n')}

Experimente rotacionar entre eles a cada 4-6 semanas para estimular novas adaptações!`;

  // Exercícios irmãos (mesmo grupo muscular)
  if (siblings.length > 0) {
    response += `

---

👯 **EXERCÍCIOS IRMÃOS**

Outros exercícios que ativam ${data.primaryMuscles[0]}:

${siblings.slice(0, 4).map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
  }

  // Erros comuns
  if (data.commonMistakes.length > 0) {
    response += `

---

⚠️ **ERROS COMUNS A EVITAR**

${data.commonMistakes.map(m => `• ${m}`).join('\n')}`;
  }

  // Combo de treino sugerido
  response += `

---

🎯 **COMBO PERFEITO DE TREINO**

${generateWorkoutCombo(data, exercise)}

---

💎 **Para Membros Premium:**

Quer o protocolo completo de progressão deste exercício?

Acesse agora no **APP**:
📹 Vídeos com execução perfeita (3 ângulos)
📈 Protocolo de sobrecarga progressiva (12 semanas)
🔍 Análise de erros comuns + correções
📋 Fichas de treino prontas para imprimir

---

🪙 **+${calculateExerciseFP(exercise, data)} FP** pelo exercício compartilhado!`;

  // Motivo mencionado
  if (exercise.reason) {
    response += `

*"${exercise.reason}"* - Excelente motivo! Quando você ama um exercício, a consistência vem naturalmente. 💚`;
  }

  response += `

Quer análise de outro exercício favorito? Posta aqui! 🔥`;

  return response;
}

// ==========================================
// ANÁLISE GENÉRICA (exercício não encontrado)
// ==========================================

function generateGenericAnalysis(
  userName: string,
  exercise: ParsedExercise
): ExerciseAnalysisResult {
  let response = `💪 Olá, ${userName}!

Adorei saber que você ama **${exercise.name}**!`;

  if (exercise.reason) {
    response += ` E concordo totalmente: *"${exercise.reason}"*`;
  }

  if (exercise.feel) {
    response += `

Quando você sente *"${exercise.feel}"*, isso mostra que o exercício está trabalhando exatamente onde deveria! ✅`;
  }

  if (exercise.load) {
    response += `

Sua carga atual de **${exercise.load.weight}kg x ${exercise.load.reps} reps** mostra que você já tem boa familiaridade com o movimento!`;
  }

  // Sugerir músculos baseado no que foi detectado
  if (exercise.targetMuscles.length > 0) {
    response += `

🎯 **Músculos que você provavelmente está trabalhando:**
${exercise.targetMuscles.map(m => `• ${capitalize(m)}`).join('\n')}`;
  }

  response += `

---

📝 **Para uma análise mais detalhada, me conta:**

1. Em qual fase do movimento você sente mais o músculo? (subida, descida, parado?)
2. Você sente algum desconforto em alguma articulação?
3. Qual sua progressão de carga nos últimos 3 meses?
4. Qual equipamento você usa? (barra, halteres, máquina?)

Responda aqui e vou buscar informações específicas para você! 💚

---

🪙 **+5 FP** pelo compartilhamento!

Enquanto isso, se quiser, pode postar outro exercício favorito que eu analiso também! 🔥`;

  return {
    response,
    fpAwarded: 5,
    exerciseFound: false,
    siblings: [],
  };
}

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function explainFeeling(feel: string, data: ExerciseData): string {
  const lower = feel.toLowerCase();

  if (lower.includes('queima') || lower.includes('queimando') || lower.includes('fogo')) {
    return `A "queimação" que você sente é **acúmulo de lactato** + **microlesões nas fibras musculares**. É sinal de que você está gerando tensão mecânica suficiente para hipertrofia! 🔥

Este é o principal estímulo para crescimento muscular no padrão de movimento "${data.movementPattern}".`;
  }

  if (lower.includes('estica') || lower.includes('alonga') || lower.includes('puxando')) {
    return `Essa sensação de "alongamento sob carga" é o músculo trabalhando em **amplitude máxima (ROM)**. Quanto maior a amplitude, maior o estímulo para crescimento! 📏

Estudos mostram que treinar na posição alongada pode gerar **até 30% mais hipertrofia** comparado a amplitudes reduzidas.`;
  }

  if (lower.includes('contrai') || lower.includes('contração') || lower.includes('apertando')) {
    return `Essa "contração forte" é a **ativação máxima das fibras musculares**. Você está gerando pico de tensão, ótimo para força e hipertrofia! 💪

No pico da contração, as fibras de ${data.primaryMuscles[0]} estão em ativação máxima (${data.biomechanics.activation}).`;
  }

  if (lower.includes('pump') || lower.includes('cheio') || lower.includes('inchado')) {
    return `O "pump" que você sente é **hiperemia muscular** - aumento do fluxo sanguíneo para os músculos trabalhados. 🎈

Embora o pump em si não cause hipertrofia diretamente, ele indica que você está gerando estresse metabólico, um dos 3 mecanismos de crescimento muscular!`;
  }

  if (lower.includes('cansaço') || lower.includes('fadiga') || lower.includes('pesado')) {
    return `A fadiga que você sente indica que as fibras musculares de ${data.primaryMuscles[0]} estão sendo recrutadas progressivamente. 💪

Quando as fibras mais resistentes fadigam, seu corpo recruta fibras de maior limiar - onde está o maior potencial de hipertrofia!`;
  }

  return `O que você sente é exatamente o esperado para o padrão de movimento **${data.movementPattern}**.

Seus músculos (${data.primaryMuscles.join(', ')}) estão trabalhando na amplitude correta (${data.biomechanics.rom}).`;
}

function generateNetterReference(data: ExerciseData): string {
  const references: Record<string, string> = {
    'extensão de quadril': 'O glúteo máximo se origina no ílio e sacro, inserindo-se no fêmur e trato iliotibial. É o principal extensor de quadril, com máxima eficiência mecânica quando o quadril parte de flexão.',

    'agachamento bilateral com abdução': 'Na abdução de quadril, o glúteo médio e mínimo (abdutores) trabalham junto com os adutores de forma excêntrica, criando estabilidade pélvica durante o movimento.',

    'dobradiça de quadril (hip hinge)': 'Os isquiotibiais (semitendíneo, semimembranoso, bíceps femoral) cruzam duas articulações, permitindo tanto flexão de joelho quanto extensão de quadril simultaneamente.',

    'agachamento unilateral': 'O trabalho unilateral aumenta a demanda sobre os estabilizadores laterais (glúteo médio, TFL) e reduz compensações de assimetria corporal.',

    'puxada horizontal': 'O grande dorsal se origina na coluna torácica/lombar e se insere no úmero, criando adução, extensão e rotação interna de ombro durante a puxada.',

    'puxada vertical': 'Durante a puxada vertical, os músculos da escápula (romboides, trapézio) trabalham em sinergia com o grande dorsal para deprimir e retrair a escápula.',

    'empurrar horizontal': 'O peitoral maior tem duas porções: clavicular (superior) e esternal (inferior). O ângulo do banco determina qual porção é mais ativada.',

    'empurrar vertical': 'O deltoide tem 3 porções (anterior, lateral, posterior). No press vertical, a porção anterior é dominante, com assistência significativa do tríceps.',

    'empurrar bilateral': 'O movimento de empurrar ativa a cadeia anterior (quadríceps, core) de forma bilateral, permitindo cargas mais altas com menor demanda de estabilização.',

    'flexão de cotovelo': 'O bíceps braquial tem duas cabeças (longa e curta) que se unem para inserir no rádio. A supinação do antebraço aumenta a ativação da cabeça longa.',

    'extensão de cotovelo': 'O tríceps braquial tem 3 cabeças: longa (cruza o ombro), lateral e medial. Exercícios overhead enfatizam a cabeça longa.',

    'estabilização (anti-extensão)': 'O transverso abdominal é o principal estabilizador profundo da coluna, criando pressão intra-abdominal que protege a região lombar.',

    'flexão de quadril com retroversão pélvica': 'O reto abdominal trabalha em cadeia com o iliopsoas. A retroversão pélvica (posteriorização) é crucial para transferir o trabalho do flexor de quadril para o abdômen.',

    'abdução de ombro': 'O deltoide lateral é o principal motor da abdução de ombro, mas só assume o trabalho após os primeiros 15° (iniciados pelo supraespinhal).',
  };

  return references[data.movementPattern] ||
    `A ativação muscular segue o padrão anatômico descrito nos tratados de anatomia funcional, com ${data.primaryMuscles[0]} como motor primário.`;
}

function generateWorkoutCombo(data: ExerciseData, exercise: ParsedExercise): string {
  const primaryMuscle = data.primaryMuscles[0].toLowerCase();

  // Treinos específicos por grupo muscular
  if (primaryMuscle.includes('glúteo')) {
    return `**Treino de Glúteo Completo:**
1. **${data.name}** (seu favorito!) - 4x10-12
2. Agachamento búlgaro - 3x12 cada perna
3. Abdução com elástico - 3x15
4. Stiff - 3x10

⏱️ Descanso: 60-90s entre séries
📅 Frequência ideal: 2-3x/semana

*Ordem estratégica: Exercício favorito PRIMEIRO (quando você está 100%)!*`;
  }

  if (primaryMuscle.includes('isquiotibiais') || primaryMuscle.includes('posterior')) {
    return `**Treino de Posterior Completo:**
1. **${data.name}** (seu favorito!) - 4x8-10
2. Leg curl deitado - 3x12
3. Elevação pélvica - 3x12
4. Good morning - 3x10

⏱️ Descanso: 90s entre séries
📅 Frequência ideal: 2x/semana

*Ordem estratégica: Exercício favorito PRIMEIRO para máxima intensidade!*`;
  }

  if (primaryMuscle.includes('quadríceps')) {
    return `**Treino de Quadríceps Completo:**
1. **${data.name}** (seu favorito!) - 4x8-12
2. Leg press - 3x12
3. Cadeira extensora - 3x12-15
4. Afundo - 3x10 cada

⏱️ Descanso: 90-120s entre séries
📅 Frequência ideal: 2x/semana

*Ordem estratégica: Exercício favorito PRIMEIRO!*`;
  }

  if (primaryMuscle.includes('dorsal') || primaryMuscle.includes('costas')) {
    return `**Treino de Costas Completo:**
1. **${data.name}** (seu favorito!) - 4x8-10
2. Puxada frontal - 3x10-12
3. Remada cavalinho - 3x12
4. Face pull - 3x15

⏱️ Descanso: 90s entre séries
📅 Frequência ideal: 2x/semana

*Ordem estratégica: Exercício favorito PRIMEIRO para máxima carga!*`;
  }

  if (primaryMuscle.includes('peitoral') || primaryMuscle.includes('peito')) {
    return `**Treino de Peito Completo:**
1. **${data.name}** (seu favorito!) - 4x8-10
2. Supino inclinado halteres - 3x10-12
3. Crucifixo - 3x12
4. Flexão - 3x máximo

⏱️ Descanso: 90s entre séries
📅 Frequência ideal: 2x/semana

*Ordem estratégica: Exercício favorito PRIMEIRO!*`;
  }

  if (primaryMuscle.includes('deltoide') || primaryMuscle.includes('ombro')) {
    return `**Treino de Ombro Completo:**
1. **${data.name}** (seu favorito!) - 4x8-10
2. Elevação lateral - 3x12-15
3. Elevação frontal - 3x12
4. Face pull - 3x15

⏱️ Descanso: 60-90s entre séries
📅 Frequência ideal: 2x/semana

*Ordem estratégica: Exercício favorito PRIMEIRO!*`;
  }

  if (primaryMuscle.includes('bíceps')) {
    return `**Treino de Bíceps Completo:**
1. **${data.name}** (seu favorito!) - 4x10-12
2. Rosca alternada - 3x10 cada
3. Rosca concentrada - 3x12
4. Rosca martelo - 3x10

⏱️ Descanso: 60s entre séries
📅 Frequência ideal: 2x/semana

*Ordem estratégica: Exercício favorito PRIMEIRO!*`;
  }

  if (primaryMuscle.includes('tríceps')) {
    return `**Treino de Tríceps Completo:**
1. **${data.name}** (seu favorito!) - 4x10-12
2. Tríceps francês - 3x10-12
3. Tríceps coice - 3x12 cada
4. Mergulho no banco - 3x máximo

⏱️ Descanso: 60s entre séries
📅 Frequência ideal: 2x/semana

*Ordem estratégica: Exercício favorito PRIMEIRO!*`;
  }

  if (primaryMuscle.includes('abdominal') || primaryMuscle.includes('core') || primaryMuscle.includes('transverso')) {
    return `**Treino de Core Completo:**
1. **${data.name}** (seu favorito!) - 3-4 séries
2. Prancha lateral - 3x30s cada lado
3. Dead bug - 3x10 cada
4. Bird dog - 3x10 cada

⏱️ Descanso: 30-60s entre séries
📅 Frequência ideal: 3-4x/semana

*Ordem estratégica: Core pode ser treinado no início ou final!*`;
  }

  // Fallback genérico
  return `Monte seu treino colocando **${data.name}** como PRIMEIRO exercício (quando você está fresca e com energia máxima)!

Adicione 2-3 exercícios complementares para o mesmo grupo muscular e finalize com 1-2 exercícios de estabilização ou acessórios.`;
}

function calculateExerciseFP(exercise: ParsedExercise, data?: ExerciseData): number {
  let fp = 5; // Base

  // Exercício encontrado na base (+1)
  if (data) fp += 1;

  // Descreveu o que sente (+1)
  if (exercise.feel && exercise.feel.length > 10) fp += 1;

  // Explicou o motivo (+1)
  if (exercise.reason && exercise.reason.length > 20) fp += 1;

  // Informou carga (+1)
  if (exercise.load) fp += 1;

  // Usou tags (+1)
  if (exercise.tags.length >= 2) fp += 1;

  // Limite máximo
  return Math.min(fp, 10);
}

export default {
  generateExerciseAnalysis,
};
