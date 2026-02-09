/**
 * LLM Bridge: Envia BuiltPrompt do Pipeline B para Ollama
 * Usa SYSTEM_PROMPT unificado NFV (NutriFitVision)
 */

import axios from 'axios';
import { BuiltPrompt } from './prompt-builder';
import { ClassificationResult, summarizeClassificationResult } from './criteria-classifier';
import { NFV_SYSTEM_PROMPT } from './system-prompt';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

// ============================
// Tipos de saída (Conforme NFV System Prompt)
// ============================

export interface LLMAnalysisReport {
  resumo_executivo: string;
  analise_cadeia_movimento: {
    fase_excentrica: string;
    fase_concentrica: string;
    relacoes_proporcionais: string;
  };
  pontos_positivos: string[];
  pontos_atencao: AnalysisPointOfAttention[];
  conclusao_cientifica: string;
  recomendacoes_top3: Recommendation[];
  score_geral: number;
  classificacao: 'EXCELENTE' | 'BOM' | 'REGULAR' | 'NECESSITA_CORRECAO';
}

interface AnalysisPointOfAttention {
  criterio: string;
  valor: string;
  o_que_indica: string;
  possivel_causa?: string;
  corretivo_sugerido?: string;
}

interface Recommendation {
  prioridade: number;
  descricao: string;
}

export interface LLMBridgeOptions {
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

// ============================
// Descoberta de modelo (replicado de report-generator.ts)
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
// Função principal
// ============================

/**
 * Envia um BuiltPrompt (gerado pelo prompt-builder) ao Ollama
 * e retorna um relatório estruturado.
 */
export async function sendPromptToOllama(
  builtPrompt: BuiltPrompt,
  classification: ClassificationResult,
  options: LLMBridgeOptions = {}
): Promise<LLMAnalysisReport> {
  const {
    temperature = 0.3,
    maxTokens = 4000,
    timeoutMs = 300000,
  } = options;

  const textModel = await findTextModel();
  if (!textModel) {
    console.warn('[LLM Bridge] Ollama indisponível, usando fallback determinístico');
    return createFallbackReport(classification, builtPrompt.metadata.exerciseName);
  }

  // Montar prompt completo: system + user
  const fullPrompt = [
    NFV_SYSTEM_PROMPT,
    '\n---\n[DADOS DE ENTRADA]\n---\n',
    builtPrompt.userPrompt,
    '\n---\n',
    'RETORNE SOMENTE O JSON CONFORME ESPECIFICADO (sem texto antes ou depois).',
  ].join('\n');

  try {
    console.log(`[LLM Bridge] Enviando prompt ao Ollama (${textModel})...`);

    const response = await axios.post(
      `${OLLAMA_URL}/api/generate`,
      {
        model: textModel,
        prompt: fullPrompt,
        stream: false,
        options: { temperature, num_predict: maxTokens },
      },
      { timeout: timeoutMs }
    );

    const responseText: string = response.data.response || '';

    // Debug: log primeira parte da resposta
    console.log('[LLM Bridge] Resposta Ollama (primeiros 500 chars):', responseText.substring(0, 500));

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.warn('[LLM Bridge] ❌ Ollama não retornou JSON válido');
      console.warn('[LLM Bridge] Resposta completa:', responseText.substring(0, 1000));
      return createFallbackReport(classification, builtPrompt.metadata.exerciseName);
    }

    try {
      const parsed = JSON.parse(jsonMatch[0]);
      console.log('[LLM Bridge] ✅ JSON parseado com sucesso');
      return normalizeReport(parsed, classification);
    } catch (parseError) {
      console.error('[LLM Bridge] ❌ Erro ao fazer parse do JSON:', parseError);
      console.error('[LLM Bridge] JSON extraído:', jsonMatch[0].substring(0, 500));
      return createFallbackReport(classification, builtPrompt.metadata.exerciseName);
    }
  } catch (error: any) {
    console.error('[LLM Bridge] Erro:', error.message);
    return createFallbackReport(classification, builtPrompt.metadata.exerciseName);
  }
}

// ============================
// Normalização e fallback
// ============================

function normalizeReport(
  data: any,
  classification: ClassificationResult
): LLMAnalysisReport {
  const score = typeof data.score_geral === 'number'
    ? Math.min(10, Math.max(0, data.score_geral))
    : classification.overallScore;

  return {
    resumo_executivo: data.resumo_executivo || `Análise biomecânica com score ${score.toFixed(1)}/10`,

    analise_cadeia_movimento: {
      fase_excentrica: data.analise_cadeia_movimento?.fase_excentrica || 'Não avaliado',
      fase_concentrica: data.analise_cadeia_movimento?.fase_concentrica || 'Não avaliado',
      relacoes_proporcionais: data.analise_cadeia_movimento?.relacoes_proporcionais || 'Não avaliado',
    },

    pontos_positivos: Array.isArray(data.pontos_positivos)
      ? data.pontos_positivos
      : extractPositivesFromClassification(classification),

    pontos_atencao: Array.isArray(data.pontos_atencao)
      ? data.pontos_atencao.map((p: any) => ({
          criterio: p.criterio || 'Critério não especificado',
          valor: p.valor || '',
          o_que_indica: p.o_que_indica || '',
          possivel_causa: p.possivel_causa,
          corretivo_sugerido: p.corretivo_sugerido,
        }))
      : extractAttentionPointsFromClassification(classification),

    conclusao_cientifica: data.conclusao_cientifica || 'Análise concluída. Recomenda-se aplicar os exercícios corretivos conforme prioridade.',

    recomendacoes_top3: Array.isArray(data.recomendacoes_top3)
      ? data.recomendacoes_top3.map((r: any) => ({
          prioridade: typeof r.prioridade === 'number' ? r.prioridade : 1,
          descricao: r.descricao || '',
        }))
      : extractRecommendationsFromClassification(classification),

    score_geral: Math.round(score * 10) / 10,
    classificacao: validateClassificacao(data.classificacao, score),
  };
}

function validateSeveridade(s: any): 'CRITICA' | 'MODERADA' | 'LEVE' {
  if (['CRITICA', 'MODERADA', 'LEVE'].includes(s)) return s;
  return 'MODERADA';
}

function validateClassificacao(
  c: any,
  score: number
): 'EXCELENTE' | 'BOM' | 'REGULAR' | 'NECESSITA_CORRECAO' {
  if (['EXCELENTE', 'BOM', 'REGULAR', 'NECESSITA_CORRECAO'].includes(c)) return c;
  if (score >= 8) return 'EXCELENTE';
  if (score >= 6) return 'BOM';
  if (score >= 4) return 'REGULAR';
  return 'NECESSITA_CORRECAO';
}

function extractProblemsFromClassification(classification: ClassificationResult): LLMProblem[] {
  return classification.classifications
    .filter((c) => c.classification === 'danger' || c.classification === 'warning')
    .map((c) => ({
      nome: c.label || c.criterion,
      severidade: (c.classification === 'danger' ? 'CRITICA' : 'MODERADA') as 'CRITICA' | 'MODERADA',
      descricao: `${c.metric}: ${c.value}${c.unit || ''} (range ${c.classificationLabel || c.classification}: ${c.range[c.classification]})`,
      causa_provavel: c.note,
    }));
}

function extractPositivesFromClassification(classification: ClassificationResult): string[] {
  return classification.classifications
    .filter((c) => ['excellent', 'good', 'acceptable'].includes(c.classification))
    .map((c) => `${c.label || c.criterion}: ${c.value}${c.unit || ''} (${c.classificationLabel || c.classification})`);
}

function extractAttentionPointsFromClassification(classification: ClassificationResult): AnalysisPointOfAttention[] {
  return classification.classifications
    .filter((c) => ['danger', 'warning'].includes(c.classification) && !c.isInformativeOnly)
    .map((c) => ({
      criterio: c.label || c.criterion,
      valor: `${c.value}${c.unit || ''}`,
      o_que_indica: `${c.label}: ${c.value}${c.unit || ''} está em zona de ${c.classificationLabel}`,
      possivel_causa: c.note,
      corretivo_sugerido: `Trabalhar mobilidade e controle de ${c.label}`,
    }));
}

function extractRecommendationsFromClassification(classification: ClassificationResult): Recommendation[] {
  const recommendations = classification.classifications
    .filter((c) => c.classification === 'danger')
    .slice(0, 3)
    .map((c, i) => ({
      prioridade: i + 1,
      descricao: `Corrigir ${c.label}: valor atual ${c.value}${c.unit || ''}`,
    }));

  // Preencher com recomendações genéricas se houver menos de 3
  while (recommendations.length < 3) {
    const idx = recommendations.length + 1;
    recommendations.push({
      prioridade: idx,
      descricao: idx === 2
        ? 'Trabalhar controle de core e estabilização'
        : 'Reavaliar técnica em 2-4 semanas',
    });
  }

  return recommendations;
}

/**
 * Relatório determinístico gerado a partir dos dados de classificação
 * quando o Ollama está indisponível (fallback NFV).
 */
function createFallbackReport(
  classification: ClassificationResult,
  exerciseName: string
): LLMAnalysisReport {
  const score = classification.overallScore;

  return {
    resumo_executivo: `Análise de ${exerciseName} com score ${score.toFixed(1)}/10. ` +
      `${classification.summary.danger} critérios críticos identificados.`,

    analise_cadeia_movimento: {
      fase_excentrica: 'Avaliação baseada em dados de classificação.',
      fase_concentrica: 'Avaliação baseada em dados de classificação.',
      relacoes_proporcionais: 'Relacionamento entre articulações foi analisado durante a classificação.',
    },

    pontos_positivos: extractPositivesFromClassification(classification),

    pontos_atencao: extractAttentionPointsFromClassification(classification),

    conclusao_cientifica: `O movimento apresenta ${classification.summary.danger} problema(s) crítico(s) ` +
      `e ${classification.summary.warning} alerta(s). Recomenda-se revisão técnica com profissional antes de aumentar carga.`,

    recomendacoes_top3: extractRecommendationsFromClassification(classification),

    score_geral: Math.round(score * 10) / 10,
    classificacao: validateClassificacao(null, score),
  };
}

/**
 * Verifica se o Ollama está disponível com um modelo de texto
 */
export async function checkLLMAvailability(): Promise<{ available: boolean; model: string | null }> {
  const model = await findTextModel();
  return { available: model !== null, model };
}
