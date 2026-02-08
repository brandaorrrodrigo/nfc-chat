/**
 * Classificador de critérios biomecânicos
 * Compara métricas numéricas contra ranges definidos nos templates
 */

import { CategoryTemplate, CriterionRange } from './category-templates';

export type ClassificationLevel = 'excellent' | 'good' | 'acceptable' | 'warning' | 'danger';

export interface MetricValue {
  metric: string;
  value: number;
  unit?: string;
}

export interface CriteriaClassification {
  criterion: string;
  metric: string;
  value: number;
  unit?: string;
  classification: ClassificationLevel;
  isSafetyCritical: boolean;
  range: {
    excellent?: string;
    good?: string;
    acceptable?: string;
    warning?: string;
    danger?: string;
  };
  ragTopics: string[];
  note?: string;
}

export interface ClassificationResult {
  category: string;
  exerciseType?: string;
  timestamp: string;
  classifications: CriteriaClassification[];
  overallScore: number;
  hasDangerCriteria: boolean;
  hasWarningSafetyCriteria: boolean;
  summary: {
    excellent: number;
    good: number;
    acceptable: number;
    warning: number;
    danger: number;
  };
}

/**
 * Extrai o nível de classificação de um valor numérico
 * Compara contra ranges definidos (excellent, good, acceptable, warning, danger)
 */
function classifyMetricValue(
  metricValue: number,
  criterionRange: CriterionRange
): { level: ClassificationLevel; order: number } {
  // Ordem de preferência: excellent > good > acceptable > warning > danger
  // A função verifica na ordem e retorna a primeira correspondência

  // Parse ranges (ex: "< 10°" → maxValue: 10, exclusive: true)
  const parseRange = (rangeStr?: string): { min?: number; max?: number; minExclusive?: number; maxExclusive?: number } => {
    if (!rangeStr) return {};

    const lessThan = rangeStr.match(/^<\s*([\d.]+)/);
    if (lessThan) {
      return { maxExclusive: parseFloat(lessThan[1]) };
    }

    const lessThanOrEqual = rangeStr.match(/^<=\s*([\d.]+)/);
    if (lessThanOrEqual) {
      return { max: parseFloat(lessThanOrEqual[1]) };
    }

    const greaterThan = rangeStr.match(/^>\s*([\d.]+)/);
    if (greaterThan) {
      return { minExclusive: parseFloat(greaterThan[1]) };
    }

    const greaterThanOrEqual = rangeStr.match(/^>=\s*([\d.]+)/);
    if (greaterThanOrEqual) {
      return { min: parseFloat(greaterThanOrEqual[1]) };
    }

    // Range format: "10-30°" ou "1:1 a 1.5:1"
    const rangeMatch = rangeStr.match(/([\d.]+)\s*-\s*([\d.]+)/);
    if (rangeMatch) {
      return {
        min: parseFloat(rangeMatch[1]),
        max: parseFloat(rangeMatch[2]),
      };
    }

    return {};
  };

  const isInRange = (value: number, range: ReturnType<typeof parseRange>): boolean => {
    if (range.min !== undefined && value < range.min) return false;
    if (range.max !== undefined && value > range.max) return false;
    if (range.minExclusive !== undefined && value <= range.minExclusive) return false;
    if (range.maxExclusive !== undefined && value >= range.maxExclusive) return false;
    return true;
  };

  // Verificar em ordem de preferência
  if (criterionRange.excellent && isInRange(metricValue, parseRange(criterionRange.excellent))) {
    return { level: 'excellent', order: 5 };
  }

  if (criterionRange.good && isInRange(metricValue, parseRange(criterionRange.good))) {
    return { level: 'good', order: 4 };
  }

  if (criterionRange.acceptable && isInRange(metricValue, parseRange(criterionRange.acceptable))) {
    return { level: 'acceptable', order: 3 };
  }

  if (criterionRange.warning && isInRange(metricValue, parseRange(criterionRange.warning))) {
    return { level: 'warning', order: 2 };
  }

  if (criterionRange.danger && isInRange(metricValue, parseRange(criterionRange.danger))) {
    return { level: 'danger', order: 1 };
  }

  // Fallback: se nenhum range corresponder, usar heurística baseada em "danger"
  // Se há um range de danger, assumir que fora dele é pior
  if (criterionRange.danger) {
    const dangerRange = parseRange(criterionRange.danger);
    if (!isInRange(metricValue, dangerRange)) {
      // Se está fora do range danger, mas não corresponde a nenhum, é likely danger
      return { level: 'danger', order: 0 };
    }
  }

  // Default: acceptable (se não há critérios definidos)
  return { level: 'acceptable', order: 3 };
}

/**
 * Classifica todas as métricas contra um template de categoria
 */
export function classifyMetrics(
  metrics: MetricValue[],
  template: CategoryTemplate,
  exerciseType?: string
): ClassificationResult {
  const classifications: CriteriaClassification[] = [];
  const summary = {
    excellent: 0,
    good: 0,
    acceptable: 0,
    warning: 0,
    danger: 0,
  };

  // Iterar sobre cada critério no template
  for (const [criterionName, criterionRange] of Object.entries(template.criteria)) {
    // Encontrar métrica correspondente
    const metricValue = metrics.find((m) => m.metric === criterionRange.metric);

    if (!metricValue) {
      // Métrica não fornecida - não podemos classificar
      continue;
    }

    const { level } = classifyMetricValue(metricValue.value, criterionRange);
    summary[level]++;

    const isSafetyCritical = template.safety_critical_criteria.includes(criterionName);

    classifications.push({
      criterion: criterionName,
      metric: criterionRange.metric,
      value: metricValue.value,
      unit: metricValue.unit || (criterionRange.metric.includes('degree') ? '°' : 'cm'),
      classification: level,
      isSafetyCritical,
      range: {
        excellent: criterionRange.excellent,
        good: criterionRange.good,
        acceptable: criterionRange.acceptable,
        warning: criterionRange.warning,
        danger: criterionRange.danger,
      },
      ragTopics: criterionRange.rag_topics || [],
      note: criterionRange.note,
    });
  }

  // Calcular score geral baseado no padrão especificado
  const overallScore = calculateOverallScore(classifications);

  const hasDangerCriteria = classifications.some((c) => c.classification === 'danger');
  const hasWarningSafetyCriteria = classifications.some(
    (c) => c.isSafetyCritical && c.classification === 'warning'
  );

  return {
    category: template.category,
    exerciseType,
    timestamp: new Date().toISOString(),
    classifications,
    overallScore,
    hasDangerCriteria,
    hasWarningSafetyCriteria,
    summary,
  };
}

/**
 * Calcula score geral (1-10) baseado nas classificações
 * Segue a lógica especificada: danger = 0, warning reduz, acceptable/good/excellent = full score
 */
export function calculateOverallScore(classifications: CriteriaClassification[]): number {
  if (classifications.length === 0) {
    return 5; // Score neutro se nenhuma classificação
  }

  const weights = {
    excellent: 1.0,
    good: 1.0,
    acceptable: 1.0,
    warning: 0.6,
    danger: 0,
  };

  let totalWeight = 0;
  let weightedScore = 0;

  for (const c of classifications) {
    const criterionWeight = c.isSafetyCritical ? 2.0 : 1.0;
    totalWeight += criterionWeight;
    weightedScore += weights[c.classification] * criterionWeight;
  }

  // Score raw de 1-10
  const rawScore = (weightedScore / totalWeight) * 10;

  // Se há qualquer critério de segurança em danger, limitar score a máximo 5
  if (classifications.some((c) => c.isSafetyCritical && c.classification === 'danger')) {
    return Math.min(rawScore, 5);
  }

  // Arredondar para 1 casa decimal
  return Math.round(rawScore * 10) / 10;
}

/**
 * Extrai tópicos RAG de uma classificação para posterior consulta
 */
export function extractRAGTopicsFromClassification(
  classification: CriteriaClassification
): string[] {
  // Apenas include tópicos de critérios com warning ou danger
  if (classification.classification === 'acceptable' || classification.classification === 'excellent' || classification.classification === 'good') {
    return [];
  }

  return classification.ragTopics || [];
}

/**
 * Extrai todos os tópicos RAG de um resultado de classificação
 */
export function extractAllRAGTopics(result: ClassificationResult): string[] {
  const topics = new Set<string>();

  for (const classification of result.classifications) {
    const topicsForCriterion = extractRAGTopicsFromClassification(classification);
    topicsForCriterion.forEach((topic) => topics.add(topic));
  }

  return Array.from(topics);
}

/**
 * Gera resumo textual de uma classificação
 */
export function summarizeClassification(classification: CriteriaClassification): string {
  const value = `${classification.value}${classification.unit || ''}`;

  switch (classification.classification) {
    case 'excellent':
      return `✓ ${classification.criterion}: ${value} (excelente)`;
    case 'good':
      return `✓ ${classification.criterion}: ${value} (bom)`;
    case 'acceptable':
      return `○ ${classification.criterion}: ${value} (aceitável)`;
    case 'warning':
      return `⚠ ${classification.criterion}: ${value} (atenção)`;
    case 'danger':
      return `✗ ${classification.criterion}: ${value} (perigoso)`;
  }
}

/**
 * Gera resumo textual de um resultado completo de classificação
 */
export function summarizeClassificationResult(result: ClassificationResult): string {
  const lines: string[] = [];

  lines.push(`Exercício: ${result.exerciseType || result.category}`);
  lines.push(`Score Geral: ${result.overallScore}/10`);
  lines.push('');

  const danger = result.classifications.filter((c) => c.classification === 'danger');
  const warnings = result.classifications.filter((c) => c.classification === 'warning');
  const acceptable = result.classifications.filter(
    (c) => c.classification === 'acceptable' || c.classification === 'good' || c.classification === 'excellent'
  );

  if (danger.length > 0) {
    lines.push('🔴 CRÍTICO:');
    danger.forEach((c) => lines.push(`  ${summarizeClassification(c)}`));
    lines.push('');
  }

  if (warnings.length > 0) {
    lines.push('🟡 ATENÇÃO:');
    warnings.forEach((c) => lines.push(`  ${summarizeClassification(c)}`));
    lines.push('');
  }

  if (acceptable.length > 0) {
    lines.push('🟢 OK:');
    acceptable.slice(0, 3).forEach((c) => lines.push(`  ${summarizeClassification(c)}`));
    if (acceptable.length > 3) {
      lines.push(`  ... e ${acceptable.length - 3} mais`);
    }
  }

  return lines.join('\n');
}

/**
 * Valida se uma métrica está dentro de um critério
 * (Função utilitária para testes)
 */
export function isMetricInRange(
  metricValue: number,
  criterion: CriterionRange,
  classification: ClassificationLevel
): boolean {
  const { level } = classifyMetricValue(metricValue, criterion);
  return level === classification;
}
