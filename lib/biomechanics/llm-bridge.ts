/**
 * LLM Bridge: Envia BuiltPrompt do Pipeline B para Ollama
 * Reutiliza padrão de conexão do report-generator.ts
 */

import axios from 'axios';
import { BuiltPrompt } from './prompt-builder';
import { ClassificationResult, summarizeClassificationResult } from './criteria-classifier';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

// ============================
// Tipos de saída
// ============================

export interface LLMAnalysisReport {
  resumo_executivo: string;
  problemas_identificados: LLMProblem[];
  pontos_positivos: string[];
  recomendacoes: LLMRecommendation[];
  score_geral: number;
  classificacao: 'EXCELENTE' | 'BOM' | 'REGULAR' | 'NECESSITA_CORRECAO';
  proximos_passos: string[];
}

interface LLMProblem {
  nome: string;
  severidade: 'CRITICA' | 'MODERADA' | 'LEVE';
  descricao: string;
  causa_provavel?: string;
  fundamentacao?: string;
}

interface LLMRecommendation {
  prioridade: number;
  categoria: string;
  descricao: string;
  exercicio_corretivo?: string;
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

  // Montar prompt completo: system + user + instrução JSON
  const fullPrompt = [
    builtPrompt.systemPrompt,
    '\n---\n',
    builtPrompt.userPrompt,
    '\n---\n',
    '\n⚠️ INSTRUÇÃO FINAL OBRIGATÓRIA:',
    'Finalize sua análise retornando EXATAMENTE neste formato JSON (sem texto antes ou depois):',
    '',
    '{',
    '  "resumo_executivo": "Resumo breve em português",',
    '  "problemas_identificados": [',
    '    {',
    '      "nome": "Nome do problema",',
    '      "severidade": "CRITICA ou MODERADA ou LEVE",',
    '      "descricao": "Descrição detalhada",',
    '      "causa_provavel": "Por que acontece",',
    '      "fundamentacao": "Base técnica (cite RAG se aplicável)"',
    '    }',
    '  ],',
    '  "pontos_positivos": ["Ponto positivo 1", "Ponto positivo 2"],',
    '  "recomendacoes": [',
    '    {',
    '      "prioridade": 1,',
    '      "categoria": "Mobilidade|Força|Técnica|Segurança",',
    '      "descricao": "Descrição da recomendação",',
    '      "exercicio_corretivo": "Nome do exercício"',
    '    }',
    '  ],',
    '  "score_geral": 8.5,',
    '  "classificacao": "EXCELENTE ou BOM ou REGULAR ou NECESSITA_CORRECAO",',
    '  "proximos_passos": ["Passo 1", "Passo 2", "Passo 3"]',
    '}',
    '',
    'RESPONDA SOMENTE COM O JSON ACIMA, SEM QUALQUER TEXTO ADICIONAL.',
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
    resumo_executivo: data.resumo_executivo || `Score: ${score.toFixed(1)}/10`,

    problemas_identificados: Array.isArray(data.problemas_identificados)
      ? data.problemas_identificados.map((p: any) => ({
          nome: p.nome || 'Problema não especificado',
          severidade: validateSeveridade(p.severidade),
          descricao: p.descricao || '',
          causa_provavel: p.causa_provavel,
          fundamentacao: p.fundamentacao,
        }))
      : extractProblemsFromClassification(classification),

    pontos_positivos: Array.isArray(data.pontos_positivos)
      ? data.pontos_positivos
      : extractPositivesFromClassification(classification),

    recomendacoes: Array.isArray(data.recomendacoes)
      ? data.recomendacoes.map((r: any) => ({
          prioridade: typeof r.prioridade === 'number' ? r.prioridade : 3,
          categoria: r.categoria || 'Técnica',
          descricao: r.descricao || '',
          exercicio_corretivo: r.exercicio_corretivo,
        }))
      : [],

    score_geral: Math.round(score * 10) / 10,
    classificacao: validateClassificacao(data.classificacao, score),

    proximos_passos: Array.isArray(data.proximos_passos)
      ? data.proximos_passos
      : ['Revisar pontos críticos', 'Praticar exercícios corretivos', 'Reavaliar em 2-4 semanas'],
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

/**
 * Relatório determinístico gerado a partir dos dados de classificação
 * quando o Ollama está indisponível.
 */
function createFallbackReport(
  classification: ClassificationResult,
  exerciseName: string
): LLMAnalysisReport {
  const score = classification.overallScore;

  return {
    resumo_executivo: `Análise biomecânica de ${exerciseName}. Score: ${score.toFixed(1)}/10. ` +
      `${classification.summary.danger} critérios críticos, ${classification.summary.warning} alertas.`,
    problemas_identificados: extractProblemsFromClassification(classification),
    pontos_positivos: extractPositivesFromClassification(classification),
    recomendacoes: classification.classifications
      .filter((c) => c.classification === 'danger')
      .slice(0, 3)
      .map((c, i) => ({
        prioridade: i + 1,
        categoria: c.isSafetyCritical ? 'Segurança' : 'Técnica',
        descricao: `Corrigir ${c.label || c.criterion}: valor atual ${c.value}${c.unit || ''}`,
      })),
    score_geral: Math.round(score * 10) / 10,
    classificacao: validateClassificacao(null, score),
    proximos_passos: [
      'Revisar os problemas identificados com um profissional',
      'Aplicar exercícios corretivos antes de aumentar carga',
      'Reavaliar técnica em 2-4 semanas',
    ],
  };
}

/**
 * Verifica se o Ollama está disponível com um modelo de texto
 */
export async function checkLLMAvailability(): Promise<{ available: boolean; model: string | null }> {
  const model = await findTextModel();
  return { available: model !== null, model };
}
