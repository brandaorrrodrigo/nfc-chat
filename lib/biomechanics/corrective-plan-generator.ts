/**
 * Gerador de Plano Corretivo Automatico via RAG + Ollama
 *
 * Quando a analise biomecanica identifica criterios em ALERTA ou PERIGO,
 * gera um plano corretivo personalizado de 4 semanas.
 *
 * Pipeline:
 * 1. Filtrar criterios warning/danger
 * 2. Consultar RAG local (biomechanics-rag.ts)
 * 3. Buscar exercicios base (exercise-recommendations.ts)
 * 4. Enviar prompt ao Ollama para organizar em 4 semanas
 * 5. Retornar plano estruturado
 */

import axios from 'axios';
import { queryRAG } from './biomechanics-rag';
import type { RAGContext } from './prompt-builder';
import { getRecommendations, type Exercicio, type RecomendacaoCorretiva } from './exercise-recommendations';
import type { CriteriaClassification, ClassificationResult } from './criteria-classifier';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

// ============================
// Interfaces
// ============================

export interface CorrectivePlan {
  plano_id: string;
  gerado_em: string;
  criterios_alerta: CriterionSummary[];
  semanas: WeekPlan[];
  meta_reteste: string;
  observacoes_gerais: string;
}

export interface CriterionSummary {
  criterio: string;
  nivel: 'warning' | 'danger';
  valor: string;
  causa_provavel: string;
  rag_fonte: string;
}

export interface WeekPlan {
  semana: number;
  foco: string;
  dias_treino: number;
  exercicios: PlannedExercise[];
  objetivo_semanal: string;
}

export interface PlannedExercise {
  nome: string;
  objetivo: string;
  series: string;
  frequencia: string;
  execucao: string[];
  progressao: string;
  desvio_alvo: string;
}

// ============================
// Mapeamento criterio → chave do EXERCISE_DATABASE
// ============================

const CRITERION_TO_EXERCISE_KEY: Record<string, string[]> = {
  // Membros inferiores / agachamento
  knee_valgus: ['valgo'],
  trunk_control: ['anteriorização', 'cifose'],
  lumbar_control: ['lordose', 'coluna'],
  ankle_mobility: ['anteriorização'],
  depth: ['quadril'],
  asymmetry: ['joelho'],
  lumbar_neutrality: ['lordose', 'coluna'],
  hip_hinge_dominance: ['quadril'],
  bar_path: ['coluna'],
  tempo: [],
  profundidade: ['quadril'],
  mobilidade_de_tornozelo: ['anteriorização'],
  controle_lombar: ['lordose', 'coluna'],
  valgo_de_joelho: ['valgo'],
  controle_de_tronco: ['anteriorização', 'cifose'],
  assimetria_bilateral: ['joelho'],
  compensation: ['anteriorização', 'cifose'],
  trunk_lean: ['anteriorização', 'cifose'],
  posture: ['cifose', 'coluna'],
  bar_alignment: ['coluna'],
  strength_deficit: ['quadril', 'coluna'],
  hip_control: ['quadril'],
  thoracic_kyphosis: ['cifose'],
  squat_form: ['anteriorização', 'quadril'],
  core_control: ['lordose', 'coluna'],
  lumbar_compensation: ['lordose', 'coluna'],
  // Membros superiores / puxadas / supino
  shoulder_stability: ['coluna'],
  scapular_retraction: ['coluna'],
  rom_pull: ['coluna'],
  torso_stability_row: ['coluna'],
  lumbar_position_row: ['lordose', 'coluna'],
  retração_escapular: ['coluna'],
  amplitude_da_puxada: ['coluna'],
  estabilidade_do_tronco: ['coluna'],
  posição_lombar: ['lordose', 'coluna'],
};

// ============================
// Criterios que SÓ se aplicam a membros inferiores
// Se o exercicio for de membros superiores, esses criterios sao ignorados
// ============================

const LOWER_BODY_ONLY_CRITERIA = new Set([
  'knee_valgus', 'valgo_de_joelho',
  'ankle_mobility', 'mobilidade_de_tornozelo',
  'depth', 'profundidade',
  'hip_hinge_dominance',
  'squat_form',
  'hip_control',
]);

const UPPER_BODY_CATEGORIES = new Set([
  'pull', 'puxadas', 'remada', 'puxada',
  'horizontal_press', 'supino', 'bench',
  'vertical_press', 'desenvolvimento', 'overhead',
]);

/**
 * Filtra criterios irrelevantes para o tipo de exercicio.
 * Ex: tornozelo e valgo nao fazem sentido para puxadas sentado.
 */
function filterCriteriaForExerciseType(
  criteria: CriteriaClassification[],
  exerciseType: string
): CriteriaClassification[] {
  const normalized = exerciseType.toLowerCase();
  const isUpperBody = UPPER_BODY_CATEGORIES.has(normalized) ||
    normalized.includes('puxad') || normalized.includes('remad') ||
    normalized.includes('supin') || normalized.includes('press') ||
    normalized.includes('pull') || normalized.includes('push');

  if (!isUpperBody) return criteria;

  return criteria.filter((c) => !LOWER_BODY_ONLY_CRITERIA.has(c.criterion));
}

// ============================
// Funcao auxiliar: encontrar modelo Ollama
// ============================

async function findTextModel(): Promise<string | null> {
  try {
    const response = await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 5000 });
    const models: string[] = response.data.models?.map((m: any) => m.name) || [];
    const preferred = ['llama3:8b', 'llama3:latest', 'llama3.1:8b'];
    for (const p of preferred) {
      if (models.includes(p)) return p;
    }
    return models.find((m) =>
      m.includes('llama3') && !m.includes('vision') && !m.includes('70b')
    ) || models[0] || null;
  } catch {
    return null;
  }
}

// ============================
// Funcao principal
// ============================

/**
 * Gera plano corretivo de 4 semanas a partir de uma ClassificationResult.
 * Requer Ollama rodando com modelo de texto.
 * Se Ollama indisponivel, retorna fallback baseado apenas no EXERCISE_DATABASE.
 */
export async function generateCorrectivePlan(
  classificationResult: ClassificationResult,
  exerciseType?: string
): Promise<CorrectivePlan> {
  const planoId = crypto.randomUUID();
  const geradoEm = new Date().toISOString();
  const category = exerciseType || classificationResult.category || '';

  // 1. Filtrar criterios com warning/danger (nao informativos)
  // E remover criterios irrelevantes para o tipo de exercicio
  const rawProblemCriteria = classificationResult.classifications.filter(
    (c) =>
      (c.classification === 'warning' || c.classification === 'danger') &&
      !c.isInformativeOnly
  );
  const problemCriteria = filterCriteriaForExerciseType(rawProblemCriteria, category);

  if (problemCriteria.length === 0) {
    return {
      plano_id: planoId,
      gerado_em: geradoEm,
      criterios_alerta: [],
      semanas: [],
      meta_reteste: 'Nenhum problema identificado. Continue com o protocolo atual.',
      observacoes_gerais: 'Todos os criterios estao dentro dos limites aceitaveis.',
    };
  }

  // 2. Coletar RAG context e exercicios para cada problema
  const allRagTopics: string[] = [];
  const exercisesByProblem = new Map<string, RecomendacaoCorretiva | null>();

  for (const criterion of problemCriteria) {
    // RAG topics
    const topics = criterion.ragTopics || [];
    allRagTopics.push(...topics);

    // Exercicios do banco
    const exerciseKeys = CRITERION_TO_EXERCISE_KEY[criterion.criterion] || [];
    for (const key of exerciseKeys) {
      if (!exercisesByProblem.has(key)) {
        exercisesByProblem.set(key, getRecommendations(key));
      }
    }
    // Tambem tentar buscar pelo label
    if (!exercisesByProblem.has(criterion.label)) {
      exercisesByProblem.set(criterion.label, getRecommendations(criterion.label));
    }
  }

  // 3. Consultar RAG local
  const uniqueTopics = [...new Set(allRagTopics)];
  const ragResults: RAGContext[] = uniqueTopics.length > 0 ? queryRAG(uniqueTopics) : [];

  // 4. Montar resumo dos criterios
  const criteriosSummary: CriterionSummary[] = problemCriteria.map((c) => {
    const ragForCriterion = ragResults.filter((r) =>
      c.ragTopics?.some((t) => r.topic.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(r.topic.toLowerCase()))
    );
    return {
      criterio: c.label || c.criterion,
      nivel: c.classification as 'warning' | 'danger',
      valor: c.unit && String(c.value).includes(c.unit) ? `${c.value}` : `${c.value}${c.unit || ''}`,
      causa_provavel: ragForCriterion[0]?.content?.split('\n').find((l) => l.includes('Causa'))?.trim() || c.note || 'A ser avaliado',
      rag_fonte: ragForCriterion[0]?.source || 'Base de conhecimento local',
    };
  });

  // 5. Coletar todos os exercicios disponiveis
  const allExercises: Array<{ desvio: string; exercicio: Exercicio }> = [];
  for (const [key, rec] of exercisesByProblem.entries()) {
    if (rec) {
      for (const ex of rec.exercicios) {
        allExercises.push({ desvio: key, exercicio: ex });
      }
    }
  }

  // 6. Tentar gerar via Ollama
  const textModel = await findTextModel();

  if (textModel && allExercises.length > 0) {
    try {
      const ollamaPlan = await generatePlanWithOllama(
        textModel,
        problemCriteria,
        ragResults,
        allExercises,
        criteriosSummary
      );

      if (ollamaPlan) {
        return {
          plano_id: planoId,
          gerado_em: geradoEm,
          criterios_alerta: criteriosSummary,
          semanas: ollamaPlan.semanas,
          meta_reteste: ollamaPlan.meta_reteste || 'Reavaliar em 4 semanas com novo video',
          observacoes_gerais: ollamaPlan.observacoes_gerais || 'Plano gerado com base em analise biomecanica e evidencias cientificas.',
        };
      }
    } catch (err) {
      console.warn('[CorrectivePlan] Ollama falhou, usando fallback:', err);
    }
  }

  // 7. Fallback: gerar plano estatico do EXERCISE_DATABASE
  console.log('[CorrectivePlan] Gerando plano fallback (sem Ollama)');
  return generateFallbackPlan(planoId, geradoEm, criteriosSummary, allExercises);
}

// ============================
// Geracao via Ollama
// ============================

async function generatePlanWithOllama(
  model: string,
  problemCriteria: CriteriaClassification[],
  ragResults: RAGContext[],
  exercises: Array<{ desvio: string; exercicio: Exercicio }>,
  criterios: CriterionSummary[]
): Promise<{ semanas: WeekPlan[]; meta_reteste: string; observacoes_gerais: string } | null> {
  const problemsText = criterios
    .map((c) => `- ${c.criterio}: ${c.valor} [${c.nivel.toUpperCase()}] — ${c.causa_provavel}`)
    .join('\n');

  const ragText = ragResults
    .map((r) => `### ${r.topic}\n${r.content}\n_Fonte: ${r.source}_`)
    .join('\n\n');

  const exercisesText = exercises
    .map((e) => `- ${e.exercicio.nome} (para: ${e.desvio}) | ${e.exercicio.volume} | ${e.exercicio.frequencia} | Progressao: ${e.exercicio.progressao}`)
    .join('\n');

  const prompt = `Voce e um fisioterapeuta esportivo PhD especializado em biomecanica corretiva.

TAREFA: Organize os exercicios corretivos abaixo em um PLANO DE 4 SEMANAS progressivo.

## PROBLEMAS IDENTIFICADOS NA ANALISE BIOMECANICA:
${problemsText}

## CONTEXTO CIENTIFICO (RAG):
${ragText || 'Nenhum contexto adicional disponivel.'}

## EXERCICIOS CORRETIVOS DISPONIVEIS:
${exercisesText}

## REGRAS OBRIGATORIAS:
1. Semana 1-2: MOBILIDADE + ATIVACAO (volume baixo, foco em tecnica e consciencia corporal)
2. Semana 3-4: FORTALECIMENTO + INTEGRACAO (volume progressivo, exercicios compostos)
3. Frequencia: 3 a 5 dias por semana
4. Cada exercicio DEVE ter: nome, objetivo, series (ex: "3x15"), frequencia, execucao (lista de passos), progressao
5. Priorizar criterios DANGER antes de WARNING
6. Maximo 4 exercicios por semana
7. Incluir meta de reteste e observacoes gerais

## RETORNE EXATAMENTE ESTE JSON (sem texto antes ou depois):
{
  "semanas": [
    {
      "semana": 1,
      "foco": "Mobilidade e Ativacao",
      "dias_treino": 4,
      "objetivo_semanal": "Objetivo claro da semana",
      "exercicios": [
        {
          "nome": "Nome do Exercicio",
          "objetivo": "O que resolve",
          "series": "3x15",
          "frequencia": "5x/semana",
          "execucao": ["Passo 1", "Passo 2", "Passo 3"],
          "progressao": "O que muda na proxima semana",
          "desvio_alvo": "Nome do problema que corrige"
        }
      ]
    }
  ],
  "meta_reteste": "Reavaliar em 4 semanas com novo video de agachamento",
  "observacoes_gerais": "Observacoes importantes para o praticante"
}`;

  console.log(`[CorrectivePlan] Enviando prompt ao Ollama (${model})...`);

  const response = await axios.post(
    `${OLLAMA_URL}/api/generate`,
    {
      model,
      prompt,
      stream: false,
      options: {
        temperature: 0.3,
        num_predict: 4000,
      },
    },
    { timeout: 300000 }
  );

  const responseText: string = response.data.response || '';
  console.log('[CorrectivePlan] Resposta Ollama (primeiros 300 chars):', responseText.substring(0, 300));

  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.warn('[CorrectivePlan] Ollama nao retornou JSON valido');
    return null;
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    return validateOllamaPlan(parsed);
  } catch (parseError) {
    console.warn('[CorrectivePlan] Erro ao parsear JSON:', parseError);
    return null;
  }
}

function validateOllamaPlan(data: any): { semanas: WeekPlan[]; meta_reteste: string; observacoes_gerais: string } | null {
  if (!Array.isArray(data.semanas) || data.semanas.length === 0) {
    return null;
  }

  const semanas: WeekPlan[] = data.semanas.map((s: any, i: number) => ({
    semana: typeof s.semana === 'number' ? s.semana : i + 1,
    foco: s.foco || (i < 2 ? 'Mobilidade e Ativacao' : 'Fortalecimento e Integracao'),
    dias_treino: typeof s.dias_treino === 'number' ? s.dias_treino : 4,
    objetivo_semanal: s.objetivo_semanal || `Objetivos da semana ${i + 1}`,
    exercicios: Array.isArray(s.exercicios)
      ? s.exercicios.map((e: any) => ({
          nome: e.nome || 'Exercicio',
          objetivo: e.objetivo || '',
          series: e.series || '3x10',
          frequencia: e.frequencia || '3x/semana',
          execucao: Array.isArray(e.execucao) ? e.execucao : [e.execucao || 'Executar com controle'],
          progressao: e.progressao || 'Aumentar volume na proxima semana',
          desvio_alvo: e.desvio_alvo || '',
        }))
      : [],
  }));

  return {
    semanas,
    meta_reteste: data.meta_reteste || 'Reavaliar em 4 semanas',
    observacoes_gerais: data.observacoes_gerais || 'Siga o plano com disciplina e foco na tecnica.',
  };
}

// ============================
// Fallback (sem Ollama)
// ============================

function generateFallbackPlan(
  planoId: string,
  geradoEm: string,
  criterios: CriterionSummary[],
  exercises: Array<{ desvio: string; exercicio: Exercicio }>
): CorrectivePlan {
  // Separar exercicios de mobilidade/ativacao vs fortalecimento
  const mobilityExercises = exercises.filter(
    (e) =>
      e.exercicio.nome.toLowerCase().includes('along') ||
      e.exercicio.nome.toLowerCase().includes('stretch') ||
      e.exercicio.nome.toLowerCase().includes('mobilidade') ||
      e.exercicio.nome.toLowerCase().includes('90/90') ||
      e.exercicio.nome.toLowerCase().includes('foam')
  );
  const strengthExercises = exercises.filter(
    (e) => !mobilityExercises.includes(e)
  );

  const toPlanned = (e: { desvio: string; exercicio: Exercicio }): PlannedExercise => ({
    nome: e.exercicio.nome,
    objetivo: e.exercicio.objetivo,
    series: e.exercicio.volume,
    frequencia: e.exercicio.frequencia,
    execucao: e.exercicio.execucao,
    progressao: e.exercicio.progressao,
    desvio_alvo: e.desvio,
  });

  // Semana 1-2: mobilidade + ativacao (ou primeiros exercicios se nao ha separacao clara)
  const week1Exercises = mobilityExercises.length > 0
    ? mobilityExercises.slice(0, 4).map(toPlanned)
    : exercises.slice(0, Math.min(3, exercises.length)).map(toPlanned);

  // Semana 3-4: fortalecimento + integracao
  const week3Exercises = strengthExercises.length > 0
    ? strengthExercises.slice(0, 4).map(toPlanned)
    : exercises.slice(0, Math.min(4, exercises.length)).map((e) => ({
        ...toPlanned(e),
        progressao: 'Aumentar carga ou volume em relacao as semanas anteriores',
      }));

  const semanas: WeekPlan[] = [
    {
      semana: 1,
      foco: 'Mobilidade e Ativacao',
      dias_treino: 4,
      exercicios: week1Exercises,
      objetivo_semanal: 'Melhorar amplitude de movimento e ativar musculos estabilizadores',
    },
    {
      semana: 2,
      foco: 'Mobilidade e Ativacao (progressao)',
      dias_treino: 4,
      exercicios: week1Exercises.map((e) => ({
        ...e,
        progressao: 'Aumentar tempo ou resistencia levemente',
      })),
      objetivo_semanal: 'Consolidar ganhos de mobilidade e melhorar controle motor',
    },
    {
      semana: 3,
      foco: 'Fortalecimento e Integracao',
      dias_treino: 5,
      exercicios: week3Exercises,
      objetivo_semanal: 'Fortalecer musculos fracos identificados e integrar ao padrao de movimento',
    },
    {
      semana: 4,
      foco: 'Fortalecimento e Integracao (progressao)',
      dias_treino: 5,
      exercicios: week3Exercises.map((e) => ({
        ...e,
        progressao: 'Volume e intensidade maximos antes do reteste',
      })),
      objetivo_semanal: 'Maximizar adaptacoes e preparar para reavaliacao',
    },
  ];

  return {
    plano_id: planoId,
    gerado_em: geradoEm,
    criterios_alerta: criterios,
    semanas,
    meta_reteste: 'Reavaliar em 4 semanas com novo video de analise biomecanica',
    observacoes_gerais: 'Plano gerado automaticamente com base nos exercicios corretivos do banco de dados. Para um plano mais personalizado, consulte um profissional.',
  };
}

/**
 * Gera plano corretivo a partir de dados brutos de analise (formato ai_analysis do banco).
 * Extrai problemas de multiplas fontes:
 * 1. classification_result (se existir — pipeline biomecanico V1)
 * 2. classifications_detail (formato V2 do pipeline biomecanico)
 * 3. pontos_criticos / recomendacoes_exercicios (formato script seed)
 * 4. key_observations (formato vision_model pipeline)
 * 5. frame_scores baixos + overall_score < threshold
 */
export async function generateCorrectivePlanFromAnalysis(
  aiAnalysis: Record<string, unknown>
): Promise<CorrectivePlan> {
  // Determinar tipo de exercicio para filtrar criterios irrelevantes
  const exerciseType = (aiAnalysis.exercise_type as string)
    || (aiAnalysis.movement_pattern as string)
    || '';

  // Tentar extrair ClassificationResult se existir (V1)
  const classificationData = aiAnalysis.classification_result as ClassificationResult | undefined;

  if (classificationData?.classifications) {
    return generateCorrectivePlan(classificationData, exerciseType);
  }

  // Fonte V2 direta: stabilizer_analysis com corrective_exercises do template
  const stabilizerAnalysis = aiAnalysis.stabilizer_analysis as Array<{
    joint: string;
    label: string;
    expected_state: string;
    variation: { value: number; unit: string; classification: string; classificationLabel: string };
    interpretation: string;
    corrective_exercises: string[];
  }> | undefined;

  if (stabilizerAnalysis && Array.isArray(stabilizerAnalysis) && stabilizerAnalysis.length > 0) {
    const unstableStabilizers = stabilizerAnalysis.filter(
      (s) => s.variation.classification === 'alerta' || s.variation.classification === 'compensação'
    );

    if (unstableStabilizers.length > 0) {
      console.log(`[CorrectivePlan] V2 path: ${unstableStabilizers.length} estabilizadores instáveis`);
      return generateV2CorrectivePlan(unstableStabilizers, exerciseType, aiAnalysis);
    }
  }

  // Fonte V2: classifications_detail (pipeline biomecanico V2)
  const classificationsDetail = aiAnalysis.classifications_detail as Array<{
    criterion?: string;
    label?: string;
    value?: number;
    unit?: string;
    classification?: string;
    isSafetyCritical?: boolean;
    isInformativeOnly?: boolean;
    note?: string;
    ragTopics?: string[];
  }> | undefined;

  if (classificationsDetail && Array.isArray(classificationsDetail) && classificationsDetail.length > 0) {
    const classifs: CriteriaClassification[] = classificationsDetail.map((c) => ({
      criterion: c.criterion || (c.label || '').toLowerCase().replace(/\s+/g, '_'),
      label: c.label || c.criterion || 'Criterio',
      metric: 'biomechanics_v2',
      value: c.value || 0,
      unit: c.unit || '',
      classification: (c.classification as 'warning' | 'danger' | 'acceptable' | 'good' | 'excellent') || 'acceptable',
      classificationLabel: c.classification === 'danger' ? 'Perigo' : c.classification === 'warning' ? 'Alerta' : 'OK',
      isSafetyCritical: c.isSafetyCritical ?? (c.classification === 'danger'),
      isInformativeOnly: c.isInformativeOnly ?? false,
      range: {},
      ragTopics: c.ragTopics || mapProblemToRagTopics(c.label || ''),
      note: c.note,
    }));

    const overallScore = (aiAnalysis.overall_score as number) || 7;
    const summary = aiAnalysis.classification_summary as Record<string, number> | undefined;

    const mockResult: ClassificationResult = {
      category: (aiAnalysis.exercise_type as string) || 'squat',
      categoryLabel: 'Exercicio',
      timestamp: (aiAnalysis.timestamp as string) || new Date().toISOString(),
      classifications: classifs,
      overallScore,
      hasDangerCriteria: classifs.some((c) => c.classification === 'danger'),
      hasWarningSafetyCriteria: classifs.some((c) => c.classification === 'warning'),
      summary: summary ? {
        excellent: summary.excellent || 0,
        good: summary.good || 0,
        acceptable: summary.acceptable || 0,
        warning: summary.warning || 0,
        danger: summary.danger || 0,
      } : {
        excellent: 0,
        good: 0,
        acceptable: classifs.filter((c) => c.classification === 'acceptable').length,
        warning: classifs.filter((c) => c.classification === 'warning').length,
        danger: classifs.filter((c) => c.classification === 'danger').length,
      },
    };

    return generateCorrectivePlan(mockResult, exerciseType);
  }

  // Coletar problemas de multiplas fontes (fallback)
  const mockClassifications: CriteriaClassification[] = [];

  // Fonte 1: pontos_criticos (formato seed script)
  const pontosCriticos = (aiAnalysis.pontos_criticos as Array<{
    nome: string;
    severidade: string;
    frames_afetados?: number[];
  }>) || [];

  for (const ponto of pontosCriticos) {
    const level = ponto.severidade?.toUpperCase() === 'CRITICA' ? 'danger' as const : 'warning' as const;
    const ragTopics = mapProblemToRagTopics(ponto.nome);
    mockClassifications.push({
      criterion: ponto.nome.toLowerCase().replace(/\s+/g, '_'),
      label: ponto.nome,
      metric: 'manual_assessment',
      value: 0,
      classification: level,
      classificationLabel: level === 'danger' ? 'Perigo' : 'Alerta',
      isSafetyCritical: level === 'danger',
      isInformativeOnly: false,
      range: {},
      ragTopics,
    });
  }

  // Fonte 2: recomendacoes_exercicios
  const recomendacoes = (aiAnalysis.recomendacoes_exercicios as Array<{
    desvio: string;
    severidade: string;
  }>) || [];

  for (const rec of recomendacoes) {
    const exists = mockClassifications.some(
      (c) => c.label.toLowerCase() === rec.desvio.toLowerCase()
    );
    if (!exists) {
      const level = rec.severidade?.toUpperCase() === 'CRITICA' ? 'danger' as const : 'warning' as const;
      const ragTopics = mapProblemToRagTopics(rec.desvio);
      mockClassifications.push({
        criterion: rec.desvio.toLowerCase().replace(/\s+/g, '_'),
        label: rec.desvio,
        metric: 'manual_assessment',
        value: 0,
        classification: level,
        classificationLabel: level === 'danger' ? 'Perigo' : 'Alerta',
        isSafetyCritical: level === 'danger',
        isInformativeOnly: false,
        range: {},
        ragTopics,
      });
    }
  }

  // Fonte 3: key_observations (formato vision_model pipeline)
  const keyObservations = (aiAnalysis.key_observations as string[]) || [];
  const suggestions = (aiAnalysis.suggestions as string[]) || [];
  const requiresAttention = (aiAnalysis.requires_attention as string[]) || [];
  const allTextObservations = [...keyObservations, ...requiresAttention];

  if (allTextObservations.length > 0) {
    const extracted = extractProblemsFromText(allTextObservations);
    for (const problem of extracted) {
      const exists = mockClassifications.some(
        (c) => c.criterion === problem.criterion
      );
      if (!exists) {
        mockClassifications.push(problem);
      }
    }
  }

  // Fonte 4: score baixo por frame (inferir problemas gerais)
  const overallScore = (aiAnalysis.score as number) || (aiAnalysis.overall_score as number) || 10;
  const frameScores = (aiAnalysis.frame_scores as number[]) || [];
  const lowFrames = frameScores.filter((s) => s < 7);

  if (mockClassifications.length === 0 && (overallScore < 8 || lowFrames.length > 0)) {
    // Inferir problemas genericos baseado no tipo de exercicio
    const movementPattern = (aiAnalysis.movement_pattern as string) || 'agachamento';
    const genericProblems = inferProblemsFromMovement(movementPattern, overallScore);
    mockClassifications.push(...genericProblems);
  }

  if (mockClassifications.length === 0) {
    return {
      plano_id: crypto.randomUUID(),
      gerado_em: new Date().toISOString(),
      criterios_alerta: [],
      semanas: [],
      meta_reteste: 'Nenhum problema identificado.',
      observacoes_gerais: 'Analise nao contem criterios em alerta ou perigo.',
    };
  }

  const mockResult: ClassificationResult = {
    category: (aiAnalysis.movement_pattern as string) || 'squat',
    categoryLabel: 'Exercicio',
    timestamp: new Date().toISOString(),
    classifications: mockClassifications,
    overallScore,
    hasDangerCriteria: mockClassifications.some((c) => c.classification === 'danger'),
    hasWarningSafetyCriteria: mockClassifications.some((c) => c.isSafetyCritical && c.classification === 'warning'),
    summary: {
      excellent: 0,
      good: 0,
      acceptable: 0,
      warning: mockClassifications.filter((c) => c.classification === 'warning').length,
      danger: mockClassifications.filter((c) => c.classification === 'danger').length,
    },
  };

  return generateCorrectivePlan(mockResult);
}

/**
 * Extrai problemas biomecanicos de texto livre (key_observations do Vision pipeline)
 */
function extractProblemsFromText(observations: string[]): CriteriaClassification[] {
  const problems: CriteriaClassification[] = [];
  const combined = observations.join(' ').toLowerCase();

  const patterns: Array<{
    keywords: string[];
    label: string;
    criterion: string;
    severity: 'warning' | 'danger';
  }> = [
    { keywords: ['valgo', 'valgismo', 'joelho para dentro', 'knee cave', 'colapso medial'], label: 'Valgo de Joelho', criterion: 'knee_valgus', severity: 'danger' },
    { keywords: ['compensação', 'compensacao', 'compensar', 'compensando'], label: 'Compensacao no Movimento', criterion: 'compensation', severity: 'warning' },
    { keywords: ['inclinação', 'inclinacao', 'inclinada', 'inclinado', 'lean', 'tronco'], label: 'Inclinacao Excessiva de Tronco', criterion: 'trunk_lean', severity: 'warning' },
    { keywords: ['lombar', 'lordose', 'butt wink', 'arredondamento', 'coluna'], label: 'Controle Lombar', criterion: 'lumbar_control', severity: 'warning' },
    { keywords: ['postura', 'postural', 'alinhamento'], label: 'Desvio Postural', criterion: 'posture', severity: 'warning' },
    { keywords: ['assimetria', 'assimétrico', 'desigual', 'desbalanceado', 'um lado'], label: 'Assimetria Bilateral', criterion: 'asymmetry', severity: 'warning' },
    { keywords: ['tornozelo', 'dorsiflexão', 'dorsiflexao', 'calcanhar'], label: 'Mobilidade de Tornozelo', criterion: 'ankle_mobility', severity: 'warning' },
    { keywords: ['quadril', 'hip', 'pelve', 'pélvica', 'pelvica'], label: 'Controle de Quadril', criterion: 'hip_control', severity: 'warning' },
    { keywords: ['ombro', 'escapular', 'impingement', 'shoulder'], label: 'Estabilidade de Ombro', criterion: 'shoulder_stability', severity: 'warning' },
    { keywords: ['cifose', 'cifótica', 'dorso curvo', 'rounded back'], label: 'Cifose Toracica', criterion: 'thoracic_kyphosis', severity: 'warning' },
    { keywords: ['profundidade', 'amplitude', 'parcial', 'raso'], label: 'Amplitude Insuficiente', criterion: 'depth', severity: 'warning' },
    { keywords: ['barra', 'desalinhada', 'inclinada para'], label: 'Desalinhamento da Barra', criterion: 'bar_alignment', severity: 'warning' },
    { keywords: ['forca', 'força', 'fraqueza', 'fraco'], label: 'Deficit de Forca', criterion: 'strength_deficit', severity: 'warning' },
  ];

  for (const pattern of patterns) {
    const found = pattern.keywords.some((kw) => combined.includes(kw));
    if (found) {
      const ragTopics = mapProblemToRagTopics(pattern.label);
      problems.push({
        criterion: pattern.criterion,
        label: pattern.label,
        metric: 'text_observation',
        value: 0,
        classification: pattern.severity,
        classificationLabel: pattern.severity === 'danger' ? 'Perigo' : 'Alerta',
        isSafetyCritical: pattern.severity === 'danger',
        isInformativeOnly: false,
        range: {},
        ragTopics,
      });
    }
  }

  return problems;
}

/**
 * Infere problemas genericos baseado no tipo de exercicio quando score e baixo
 */
function inferProblemsFromMovement(movementPattern: string, score: number): CriteriaClassification[] {
  const normalized = movementPattern.toLowerCase();
  const severity: 'warning' | 'danger' = score < 5 ? 'danger' : 'warning';

  const movementProblems: Record<string, Array<{ label: string; criterion: string }>> = {
    'agachamento': [
      { label: 'Tecnica de Agachamento', criterion: 'squat_form' },
      { label: 'Controle de Tronco', criterion: 'trunk_control' },
    ],
    'terra': [
      { label: 'Controle Lombar', criterion: 'lumbar_control' },
      { label: 'Padrao Hip Hinge', criterion: 'hip_hinge' },
    ],
    'supino': [
      { label: 'Estabilidade Escapular', criterion: 'scapular_stability' },
      { label: 'Alinhamento de Ombro', criterion: 'shoulder_alignment' },
    ],
    'puxadas': [
      { label: 'Retracao Escapular', criterion: 'scapular_retraction' },
      { label: 'Controle de Core', criterion: 'core_control' },
    ],
    'desenvolvimento': [
      { label: 'Mobilidade Overhead', criterion: 'overhead_mobility' },
      { label: 'Compensacao Lombar', criterion: 'lumbar_compensation' },
    ],
  };

  const key = Object.keys(movementProblems).find((k) => normalized.includes(k)) || 'agachamento';
  const problems = movementProblems[key] || movementProblems['agachamento'];

  return problems.map((p) => ({
    criterion: p.criterion,
    label: p.label,
    metric: 'score_inference',
    value: score,
    unit: '/10',
    classification: severity,
    classificationLabel: severity === 'danger' ? 'Perigo' : 'Alerta',
    isSafetyCritical: severity === 'danger',
    isInformativeOnly: false,
    range: {},
    ragTopics: mapProblemToRagTopics(p.label),
  }));
}

// ============================
// V2: Plano corretivo direto dos correctiveExercises do template
// ============================

interface UnstableStabilizer {
  joint: string;
  label: string;
  expected_state: string;
  variation: { value: number; unit: string; classification: string; classificationLabel: string };
  interpretation: string;
  corrective_exercises: string[];
}

function generateV2CorrectivePlan(
  unstable: UnstableStabilizer[],
  exerciseType: string,
  aiAnalysis: Record<string, unknown>
): CorrectivePlan {
  const planoId = crypto.randomUUID();
  const geradoEm = new Date().toISOString();

  // Separar por severidade: compensação (danger) antes de alerta (warning)
  const sorted = [...unstable].sort((a, b) => {
    const aLevel = a.variation.classification === 'compensação' ? 0 : 1;
    const bLevel = b.variation.classification === 'compensação' ? 0 : 1;
    return aLevel - bLevel;
  });

  // Coletar todos os exercicios corretivos unicos
  const allExercises: Array<{ nome: string; desvio: string; severidade: string }> = [];
  for (const stab of sorted) {
    for (const ex of stab.corrective_exercises) {
      if (!allExercises.some((e) => e.nome === ex)) {
        allExercises.push({
          nome: ex,
          desvio: stab.label,
          severidade: stab.variation.classification,
        });
      }
    }
  }

  // Dividir exercicios: mobilidade/ativação (semanas 1-2) vs fortalecimento (semanas 3-4)
  const mobilityKeywords = ['stretch', 'along', 'foam', 'mobilidade', '90/90', 'hip stretch', 'dead bug', 'bird dog', 'breathing', 'chin tuck', 'consciência', 'proprioceptiva', 'pausa', 'isométrica'];
  const isMobility = (name: string) => mobilityKeywords.some((k) => name.toLowerCase().includes(k));

  const mobilityExercises = allExercises.filter((e) => isMobility(e.nome));
  const strengthExercises = allExercises.filter((e) => !isMobility(e.nome));

  // Se não há separação clara, dividir pela metade
  if (mobilityExercises.length === 0 && strengthExercises.length > 0) {
    const half = Math.ceil(strengthExercises.length / 2);
    mobilityExercises.push(...strengthExercises.splice(0, half));
  }

  const toPlannedExercise = (
    e: { nome: string; desvio: string; severidade: string },
    weekNum: number
  ): PlannedExercise => ({
    nome: e.nome,
    objetivo: `Corrigir ${e.desvio}`,
    series: weekNum <= 2 ? '3x12-15' : '3x8-12',
    frequencia: weekNum <= 2 ? '4x/semana' : '5x/semana',
    execucao: weekNum <= 2
      ? ['Foco em controle e ativação', 'Velocidade lenta e controlada', 'Pausa de 2s na contração']
      : ['Aumentar carga progressivamente', 'Integrar ao padrão do exercício principal', 'Manter controle total'],
    progressao: weekNum <= 2
      ? 'Aumentar tempo sob tensão na próxima semana'
      : 'Aumentar carga ou volume antes do reteste',
    desvio_alvo: e.desvio,
  });

  const semanas: WeekPlan[] = [
    {
      semana: 1,
      foco: 'Mobilidade e Ativacao',
      dias_treino: 4,
      exercicios: (mobilityExercises.length > 0 ? mobilityExercises : allExercises)
        .slice(0, 4).map((e) => toPlannedExercise(e, 1)),
      objetivo_semanal: 'Melhorar mobilidade e ativar estabilizadores fracos',
    },
    {
      semana: 2,
      foco: 'Mobilidade e Ativacao (progressao)',
      dias_treino: 4,
      exercicios: (mobilityExercises.length > 0 ? mobilityExercises : allExercises)
        .slice(0, 4).map((e) => toPlannedExercise(e, 2)),
      objetivo_semanal: 'Consolidar ganhos de mobilidade e melhorar controle motor',
    },
    {
      semana: 3,
      foco: 'Fortalecimento e Integracao',
      dias_treino: 5,
      exercicios: (strengthExercises.length > 0 ? strengthExercises : allExercises)
        .slice(0, 4).map((e) => toPlannedExercise(e, 3)),
      objetivo_semanal: 'Fortalecer estabilizadores e integrar ao exercício principal',
    },
    {
      semana: 4,
      foco: 'Fortalecimento e Integracao (progressao)',
      dias_treino: 5,
      exercicios: (strengthExercises.length > 0 ? strengthExercises : allExercises)
        .slice(0, 4).map((e) => toPlannedExercise(e, 4)),
      objetivo_semanal: 'Maximizar adaptacoes e preparar para reavaliacao',
    },
  ];

  const criterios: CriterionSummary[] = sorted.map((s) => ({
    criterio: s.label,
    nivel: s.variation.classification === 'compensação' ? 'danger' as const : 'warning' as const,
    valor: `${s.variation.value.toFixed(1)}${s.variation.unit}`,
    causa_provavel: s.interpretation,
    rag_fonte: 'Template V2',
  }));

  const score = (aiAnalysis.overall_score as number) || 0;

  return {
    plano_id: planoId,
    gerado_em: geradoEm,
    criterios_alerta: criterios,
    semanas,
    meta_reteste: `Reavaliar ${exerciseType || 'exercicio'} em 4 semanas com novo video (score atual: ${score.toFixed(1)}/10)`,
    observacoes_gerais: `Plano gerado automaticamente a partir dos estabilizadores instáveis identificados na análise V2. ${sorted.length} estabilizador(es) requerem atenção.`,
  };
}

/**
 * Mapeia nome de problema para topicos RAG
 */
function mapProblemToRagTopics(problemName: string): string[] {
  const normalized = problemName.toLowerCase();

  const mappings: Record<string, string[]> = {
    'valgo': ['valgo dinâmico', 'insuficiência glúteo médio', 'ativação VMO'],
    'valgismo': ['valgo dinâmico', 'insuficiência glúteo médio'],
    'valgus': ['valgo dinâmico', 'insuficiência glúteo médio'],
    'joelho': ['valgo dinâmico', 'ativação VMO'],
    'tronco': ['inclinação anterior tronco agachamento', 'controle core'],
    'lombar': ['retroversão pélvica agachamento', 'butt wink', 'flexão lombar'],
    'lordose': ['retroversão pélvica agachamento', 'flexão lombar'],
    'cifose': ['inclinação anterior tronco agachamento'],
    'tornozelo': ['profundidade agachamento'],
    'butt wink': ['butt wink', 'retroversão pélvica agachamento', 'flexão lombar'],
    'coluna': ['flexão lombar', 'controle core'],
    'quadril': ['profundidade agachamento'],
    'assimetria': ['assimetria bilateral', 'compensação asimétrica'],
    'ombro': ['impingement subacromial', 'retração escapular'],
    'escapular': ['retração escapular'],
  };

  for (const [key, topics] of Object.entries(mappings)) {
    if (normalized.includes(key)) {
      return topics;
    }
  }

  return ['controle core'];
}
