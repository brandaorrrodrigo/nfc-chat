/**
 * Classificador V2: Motor vs Estabilizador
 *
 * MOTORA: mais ROM = melhor (ranges com min/max numéricos)
 * ESTABILIZADORA: menos variação = melhor (INVERTIDO!)
 *
 * Score final: Motor 60% + Estabilizador 40%
 */

import type {
  ExerciseTemplate,
  MotorJoint,
  StabilizerJoint,
  RomRanges,
} from './exercise-templates-v2';

// ============================
// Interfaces de Resultado
// ============================

export type MotorClassification = 'excellent' | 'good' | 'acceptable' | 'warning' | 'danger';
export type StabilizerClassification = 'firme' | 'alerta' | 'compensação';

export interface MotorJointResult {
  joint: string;
  label: string;
  movement: string;
  rom: {
    value: number;
    unit: string;
    classification: MotorClassification;
    classificationLabel: string;
    startAngle?: number;
    peakAngle?: number;
    returnAngle?: number;
    eccentricControl?: 'controlled' | 'dropped' | 'unknown';
    /** Alerta contextual específico do exercício (ex: hiperextensão, trapézio dominante) */
    note?: string;
  };
  peakContraction?: { value: number; unit: string; classification: MotorClassification; classificationLabel: string };
  symmetry?: { diff: number; unit: string; classification: 'ok' | 'assimetria_leve' | 'assimetria_significativa' };
  ragTopics: string[];
}

export interface StabilizerJointResult {
  joint: string;
  label: string;
  expectedState: string;
  instabilityMeaning: string;
  stabilityMode: 'rigid' | 'controlled' | 'functional';
  stateMessages?: { firme?: string; alerta?: string; compensacao?: string };
  variation: { value: number; unit: string; classification: StabilizerClassification; classificationLabel: string };
  transparency: {
    rawValue: number;
    minFrame?: number;
    maxFrame?: number;
    p10?: number;
    p90?: number;
    correctionNote?: string;
    baseThresholds: { acceptable: number; warning: number; danger: number };
    effectiveThresholds: { acceptable: number; warning: number; danger: number };
    explanation: string;
  };
  interpretation: string;
  correctiveExercises: string[];
  ragTopics: string[];
}

export interface AnalysisResultV2 {
  exerciseId: string;
  exerciseName: string;
  category: string;
  type: 'compound' | 'isolation';
  timestamp: string;

  motorAnalysis: MotorJointResult[];
  stabilizerAnalysis: StabilizerJointResult[];

  motorScore: number;
  stabilizerScore: number;
  overallScore: number; // Motor 60% + Estabilizador 40%

  muscles: {
    primary: string[];
    secondary: string[];
    stabilizers: string[];
  };

  summary: {
    motor: { excellent: number; good: number; acceptable: number; warning: number; danger: number };
    stabilizer: { firme: number; alerta: number; compensação: number };
  };

  hasDangerMotor: boolean;
  hasCompensationStabilizer: boolean;
}

// ============================
// Métricas de Entrada
// ============================

export interface MotorMetricInput {
  joint: string;
  romValue: number;
  romUnit?: string;
  peakContractionValue?: number;
  peakContractionUnit?: string;
  leftValue?: number;
  rightValue?: number;
  startAngle?: number;
  peakAngle?: number;
  returnAngle?: number;
  eccentricControl?: 'controlled' | 'dropped' | 'unknown';
}

export interface StabilizerMetricInput {
  joint: string;
  variationValue: number;
  unit?: string;
  minFrame?: number;
  maxFrame?: number;
  p10?: number;
  p90?: number;
  /** Nota sobre correção aplicada (ex: hip correction no deadlift lombar) */
  correctionNote?: string;
}

// ============================
// Classificação Motor
// ============================

const MOTOR_LABELS: Record<MotorClassification, string> = {
  excellent: 'Excelente',
  good: 'Bom',
  acceptable: 'Aceitável',
  warning: 'Alerta',
  danger: 'Perigo',
};

/**
 * Classifica valor de articulação MOTORA
 * Compara value contra ranges numéricos {min?, max?}
 */
export function classifyMotor(value: number, ranges: RomRanges): MotorClassification {
  const levels: MotorClassification[] = ['excellent', 'good', 'acceptable', 'warning', 'danger'];

  for (const level of levels) {
    const range = ranges[level];
    if (!range) continue;

    let matches = true;
    if (range.min !== undefined && value < range.min) matches = false;
    if (range.max !== undefined && value > range.max) matches = false;

    if (matches) return level;
  }

  // Fallback: se nenhum range definido para um nível, verificar danger como last resort
  return 'acceptable';
}

// ============================
// Classificação Estabilizador
// ============================

const STABILIZER_LABELS: Record<StabilizerClassification, string> = {
  firme: 'Firme',
  alerta: 'Alerta',
  'compensação': 'Compensação',
};

/**
 * Multiplicadores de threshold por stabilityMode:
 * - rigid (1.0x): variação mínima esperada (default)
 * - controlled (1.8x): alguma variação é aceitável
 * - functional (3.0x): variação é parte do movimento
 */
const STABILITY_MULTIPLIERS: Record<'rigid' | 'controlled' | 'functional', number> = {
  rigid: 1.0,
  controlled: 1.8,
  functional: 3.0,
};

/**
 * Gera texto de explicação para o painel de transparência do estabilizador
 */
function buildTransparencyExplanation(
  value: number,
  unit: string,
  cls: StabilizerClassification,
  eff: { acceptable: number; warning: number; danger: number },
  mode: 'rigid' | 'controlled' | 'functional',
): string {
  const threshold =
    cls === 'firme' ? `<${eff.acceptable}${unit}` :
    cls === 'alerta' ? `${eff.acceptable}–${eff.warning}${unit}` :
    `>${eff.danger}${unit}`;
  const clsLabel = cls === 'firme' ? 'dentro do aceitável' : cls === 'alerta' ? 'acima do aceitável' : 'acima do limite';
  const modeNote =
    mode === 'functional' ? 'Variação esperada no movimento funcional.' :
    mode === 'controlled' ? 'Variação controlada é aceitável neste exercício.' :
    'Estabilidade máxima esperada.';
  return `Valor ${value}${unit} (${threshold}) — ${clsLabel}. ${modeNote}`;
}

/**
 * Classifica variação de articulação ESTABILIZADORA
 * MENOS variação = MELHOR (lógica INVERTIDA vs motor)
 * stabilityMode aplica multiplicador nos thresholds
 */
export function classifyStabilizer(
  variation: number,
  criteria: { acceptable: number; warning: number; danger: number },
  stabilityMode: 'rigid' | 'controlled' | 'functional' = 'rigid',
): StabilizerClassification {
  const mult = STABILITY_MULTIPLIERS[stabilityMode];
  if (variation <= criteria.acceptable * mult) return 'firme';
  if (variation <= criteria.warning * mult) return 'alerta';
  return 'compensação';
}

/**
 * Gera interpretação contextual baseada no stabilityMode:
 * - rigid: qualquer instabilidade é problema
 * - controlled: alerta é aceitável, compensação = impulso
 * - functional: alerta é esperado, compensação = momentum excessivo
 */
function getStabilizerInterpretation(
  stabClass: StabilizerClassification,
  stabilityMode: 'rigid' | 'controlled' | 'functional',
  expectedState: string,
  instabilityMeaning: string,
): string {
  if (stabilityMode === 'rigid') {
    if (stabClass === 'firme') return `${expectedState} ✓`;
    if (stabClass === 'alerta') return `Instável — ${instabilityMeaning}`;
    return `Compensação — ${instabilityMeaning}`;
  }

  if (stabilityMode === 'controlled') {
    if (stabClass === 'firme') return `${expectedState} ✓`;
    if (stabClass === 'alerta') return 'Movimento aceitável para este exercício';
    return 'Movimento excessivo — possível uso de impulso';
  }

  // functional
  if (stabClass === 'firme') return `${expectedState} ✓`;
  if (stabClass === 'alerta') return 'Momentum normal da técnica';
  return 'Momentum excessivo — reduzir carga';
}

// ============================
// Classificação de Simetria
// ============================

function classifySymmetry(
  diff: number,
  maxAcceptable: number
): 'ok' | 'assimetria_leve' | 'assimetria_significativa' {
  if (diff <= maxAcceptable) return 'ok';
  if (diff <= maxAcceptable * 2) return 'assimetria_leve';
  return 'assimetria_significativa';
}

// ============================
// Classificação Completa V2
// ============================

/**
 * Gera alertas contextuais específicos por exercício/articulação
 * Exemplos: hiperextensão lombar no hip thrust, trapézio dominante no lateral raise,
 * hip-to-knee ratio no deadlift
 */
function buildContextualNote(
  joint: string,
  input: MotorMetricInput,
  category: string,
  allMotorInputs: MotorMetricInput[],
): string | undefined {
  // Hip thrust: peakAngle de quadril > 185° → hiperextensão lombar
  if (category === 'hip_dominant' && joint === 'hip') {
    if (input.peakAngle !== undefined && input.peakAngle > 185) {
      return `⚠ Ângulo de ${input.peakAngle.toFixed(0)}° sugere hiperextensão lombar compensatória (quadril não passa de 180°)`;
    }
  }

  // Lateral raise: peakAngle de ombro > 95° → trapézio dominante
  if (category === 'isolation_shoulder' && joint === 'shoulder') {
    if (input.peakAngle !== undefined && input.peakAngle > 95) {
      return `⚠ Elevação acima de 95° (${input.peakAngle.toFixed(0)}°) — possível dominância do trapézio`;
    }
  }

  // Hinge (deadlift): hip-to-knee ratio — quadril deve dominar sobre joelho
  if (category === 'hinge' && joint === 'hip') {
    const hipInput = input;
    const kneeInput = allMotorInputs.find(m => m.joint === 'knee');
    if (kneeInput && kneeInput.romValue > 0) {
      const ratio = Math.round((hipInput.romValue / kneeInput.romValue) * 10) / 10;
      if (ratio < 1.5) {
        return `⚠ Hip/Knee ratio ${ratio}:1 (ideal >1.5) — joelho dominando sobre quadril (técnica de squat)`;
      } else {
        return `Hip/Knee ratio ${ratio}:1 ✓`;
      }
    }
  }

  // Press: peakAngle de cotovelo > 90° no fundo → profundidade insuficiente
  if ((category === 'horizontal_press' || category === 'vertical_press') && joint === 'elbow') {
    if (input.peakAngle !== undefined && input.peakAngle > 90) {
      return `⚠ Cotovelo ${input.peakAngle.toFixed(0)}° no fundo — barra não desceu ao peito (ideal <90°)`;
    }
  }

  return undefined;
}

/**
 * Ajusta os thresholds da lombar proporcionalmente à profundidade do agachamento.
 *
 * Racional: butt wink é anatomicamente esperado em ATG (<70°). O threshold fixo
 * de 22° danger penaliza atletas que fazem ATG corretamente.
 *
 * kneeMinAngle = ângulo no fundo (peakAngle do joelho):
 *   > 90°: agachamento raso → threshold BASE (mais estrito, nenhuma tolerância)
 *   70–90°: paralelo → threshold × 1.8 (relaxado)
 *   < 70°: ATG → threshold × 2.8 (muito relaxado — retroversão esperada)
 */
function getAdjustedLumbarThresholds(
  kneeMinAngle: number,
  base: { metric: string; acceptable: number; warning: number; danger: number; unit: string },
): { metric: string; acceptable: number; warning: number; danger: number; unit: string } {
  if (kneeMinAngle > 90) return base; // agachamento raso: threshold original
  const depthFactor = kneeMinAngle < 70 ? 2.8 : 1.8;
  return {
    metric: base.metric,
    unit: base.unit,
    acceptable: base.acceptable * depthFactor,
    warning: base.warning * depthFactor,
    danger: base.danger * depthFactor,
  };
}

/**
 * Retorna mensagem contextual para butt wink baseada na profundidade do agachamento.
 */
function getLumbarInstabilityMeaning(kneeMinAngle: number): string {
  if (kneeMinAngle < 70) {
    return 'Retroversão pélvica proporcional à profundidade ATG — anatomicamente esperado. Foco em mobilidade de tornozelo e quadril.';
  }
  if (kneeMinAngle > 90) {
    return 'Butt wink precoce — fraqueza de estabilizadores ou falta de mobilidade. Trabalhe mobilidade de tornozelo e hip flexor.';
  }
  return 'Butt wink — retroversão pélvica. Risco de disco lombar.';
}

/**
 * Classifica um exercício completo usando o paradigma Motor vs Estabilizador
 */
export function classifyExerciseV2(
  motorInputs: MotorMetricInput[],
  stabilizerInputs: StabilizerMetricInput[],
  template: ExerciseTemplate,
): AnalysisResultV2 {
  const motorAnalysis: MotorJointResult[] = [];
  const stabilizerAnalysis: StabilizerJointResult[] = [];

  const motorSummary = { excellent: 0, good: 0, acceptable: 0, warning: 0, danger: 0 };
  const stabilizerSummary = { firme: 0, alerta: 0, 'compensação': 0 };

  // --- Classificar articulações MOTORAS ---
  for (const mj of template.motorJoints) {
    const input = motorInputs.find(m => m.joint === mj.joint);
    if (!input) continue;

    // ROM
    const romClass = classifyMotor(input.romValue, mj.criteria.rom);
    motorSummary[romClass]++;

    const result: MotorJointResult = {
      joint: mj.joint,
      label: mj.label,
      movement: mj.movement,
      rom: {
        value: input.romValue,
        unit: input.romUnit || '°',
        classification: romClass,
        classificationLabel: MOTOR_LABELS[romClass],
        startAngle: input.startAngle,
        peakAngle: input.peakAngle,
        returnAngle: input.returnAngle,
        eccentricControl: input.eccentricControl,
      },
      ragTopics: mj.ragTopics,
    };

    // Peak Contraction
    if (mj.criteria.peakContraction && input.peakContractionValue !== undefined) {
      const pcClass = classifyMotor(input.peakContractionValue, mj.criteria.peakContraction);
      result.peakContraction = {
        value: input.peakContractionValue,
        unit: input.peakContractionUnit || mj.criteria.peakContraction.metric.includes('cm') ? 'cm' : '°',
        classification: pcClass,
        classificationLabel: MOTOR_LABELS[pcClass],
      };
    }

    // Symmetry
    if (mj.criteria.symmetry && input.leftValue !== undefined && input.rightValue !== undefined) {
      const diff = Math.abs(input.leftValue - input.rightValue);
      const symClass = classifySymmetry(diff, mj.criteria.symmetry.maxAcceptableDiff);
      result.symmetry = {
        diff,
        unit: mj.criteria.symmetry.unit,
        classification: symClass,
      };
    }

    // Alertas contextuais por categoria/joint
    const note = buildContextualNote(mj.joint, input, template.category, motorInputs);
    if (note) result.rom.note = note;

    motorAnalysis.push(result);
  }

  // --- Classificar articulações ESTABILIZADORAS ---
  for (const sj of template.stabilizerJoints) {
    const input = stabilizerInputs.find(s => s.joint === sj.joint);
    if (!input) continue;

    const mode = sj.stabilityMode || 'rigid';

    // Threshold proporcional à profundidade para lombar em squat
    let effectiveMaxVariation = sj.criteria.maxVariation;
    let effectiveInstabilityMeaning = sj.instabilityMeaning;
    if (sj.joint === 'lumbar' && template.category === 'squat') {
      const kneeInput = motorInputs.find(m => m.joint === 'knee');
      const kneeMinAngle = kneeInput?.peakAngle;
      if (kneeMinAngle !== undefined) {
        effectiveMaxVariation = getAdjustedLumbarThresholds(kneeMinAngle, sj.criteria.maxVariation);
        effectiveInstabilityMeaning = getLumbarInstabilityMeaning(kneeMinAngle);
      }
    }

    const stabClass = classifyStabilizer(input.variationValue, effectiveMaxVariation, mode);
    stabilizerSummary[stabClass]++;

    const interpretation = getStabilizerInterpretation(stabClass, mode, sj.expectedState, effectiveInstabilityMeaning);

    // Thresholds efetivos após aplicação do multiplicador de stabilityMode
    const mult = STABILITY_MULTIPLIERS[mode];
    const effThresholds = {
      acceptable: Math.round(effectiveMaxVariation.acceptable * mult * 10) / 10,
      warning: Math.round(effectiveMaxVariation.warning * mult * 10) / 10,
      danger: Math.round(effectiveMaxVariation.danger * mult * 10) / 10,
    };
    const unit = input.unit || sj.criteria.maxVariation.unit;

    stabilizerAnalysis.push({
      joint: sj.joint,
      label: sj.label,
      expectedState: sj.expectedState,
      instabilityMeaning: effectiveInstabilityMeaning,
      stabilityMode: mode,
      stateMessages: sj.stateMessages,
      variation: {
        value: input.variationValue,
        unit,
        classification: stabClass,
        classificationLabel: STABILIZER_LABELS[stabClass],
      },
      transparency: {
        rawValue: input.variationValue,
        minFrame: input.minFrame,
        maxFrame: input.maxFrame,
        p10: input.p10,
        p90: input.p90,
        correctionNote: input.correctionNote,
        baseThresholds: {
          acceptable: effectiveMaxVariation.acceptable,
          warning: effectiveMaxVariation.warning,
          danger: effectiveMaxVariation.danger,
        },
        effectiveThresholds: effThresholds,
        explanation: buildTransparencyExplanation(input.variationValue, unit, stabClass, effThresholds, mode),
      },
      interpretation,
      correctiveExercises: stabClass !== 'firme' ? sj.correctiveExercises : [],
      ragTopics: sj.ragTopics,
    });
  }

  // --- Calcular scores ---
  const motorScore = calculateMotorScore(motorAnalysis);
  const stabilizerScore = calculateStabilizerScore(stabilizerAnalysis, template.stabilizerJoints);
  const overallScore = Math.round((motorScore * 0.6 + stabilizerScore * 0.4) * 10) / 10;

  return {
    exerciseId: template.exerciseId,
    exerciseName: template.exerciseName,
    category: template.category,
    type: template.type,
    timestamp: new Date().toISOString(),
    motorAnalysis,
    stabilizerAnalysis,
    motorScore,
    stabilizerScore,
    overallScore,
    muscles: template.muscles,
    summary: { motor: motorSummary, stabilizer: stabilizerSummary },
    hasDangerMotor: motorAnalysis.some(m => m.rom.classification === 'danger'),
    hasCompensationStabilizer: stabilizerAnalysis.some(s => s.variation.classification === 'compensação'),
  };
}

// ============================
// Cálculo de Scores
// ============================

const MOTOR_WEIGHTS: Record<MotorClassification, number> = {
  excellent: 10,
  good: 8,
  acceptable: 6,
  warning: 4,
  danger: 2,
};

function calculateMotorScore(motorResults: MotorJointResult[]): number {
  if (motorResults.length === 0) return 5;

  let total = 0;
  let count = 0;

  for (const m of motorResults) {
    total += MOTOR_WEIGHTS[m.rom.classification];
    count++;

    if (m.peakContraction) {
      total += MOTOR_WEIGHTS[m.peakContraction.classification];
      count++;
    }
  }

  return Math.round((total / count) * 10) / 10;
}

const STABILIZER_WEIGHTS: Record<StabilizerClassification, number> = {
  firme: 10,
  alerta: 5,
  'compensação': 1,
};

function calculateStabilizerScore(
  stabResults: StabilizerJointResult[],
  templateJoints: StabilizerJoint[],
): number {
  if (stabResults.length === 0) return 5;

  let total = 0;
  let weightSum = 0;

  for (const s of stabResults) {
    // Peso extra para estabilizadores com instabilityMeaning que contém "RISCO" ou "CRÍTICO"
    const templateJoint = templateJoints.find(tj => tj.joint === s.joint);
    const isCritical = templateJoint?.instabilityMeaning.toUpperCase().includes('RISCO') ?? false;
    const weight = isCritical ? 2 : 1;

    total += STABILIZER_WEIGHTS[s.variation.classification] * weight;
    weightSum += weight;
  }

  return Math.round((total / weightSum) * 10) / 10;
}

// ============================
// RAG Topics Extraction
// ============================

/**
 * Extrai RAG topics apenas das articulações com problema
 */
export function extractV2RAGTopics(result: AnalysisResultV2): string[] {
  const topics: string[] = [];

  for (const m of result.motorAnalysis) {
    if (m.rom.classification === 'warning' || m.rom.classification === 'danger') {
      topics.push(...m.ragTopics);
    }
  }

  for (const s of result.stabilizerAnalysis) {
    if (s.variation.classification === 'alerta' || s.variation.classification === 'compensação') {
      topics.push(...s.ragTopics);
    }
  }

  return [...new Set(topics)];
}

// ============================
// Formatação de Resumo
// ============================

/**
 * Gera resumo textual V2 para prompt ou display
 */
export function summarizeV2Result(result: AnalysisResultV2): string {
  const lines: string[] = [];

  lines.push(`Exercício: ${result.exerciseName}`);
  lines.push(`Score: ${result.overallScore}/10 | Motor: ${result.motorScore}/10 | Estabilização: ${result.stabilizerScore}/10`);
  lines.push('');

  lines.push('── ARTICULAÇÕES MOTORAS ──');
  for (const m of result.motorAnalysis) {
    const icon = m.rom.classification === 'excellent' || m.rom.classification === 'good' ? '🟢'
      : m.rom.classification === 'acceptable' ? '🟡'
      : m.rom.classification === 'warning' ? '🟠' : '🔴';
    lines.push(`${icon} ${m.label} — ${m.movement}`);
    lines.push(`   ROM: ${m.rom.value}${m.rom.unit} (${m.rom.classificationLabel})`);
    if (m.peakContraction) {
      lines.push(`   Contração: ${m.peakContraction.value}${m.peakContraction.unit} (${m.peakContraction.classificationLabel})`);
    }
    if (m.symmetry) {
      lines.push(`   Simetria D/E: ${m.symmetry.diff}${m.symmetry.unit} (${m.symmetry.classification === 'ok' ? 'OK' : m.symmetry.classification})`);
    }
  }

  lines.push('');
  lines.push('── ARTICULAÇÕES ESTABILIZADORAS ──');
  for (const s of result.stabilizerAnalysis) {
    const icon = s.variation.classification === 'firme' ? '🟢'
      : s.variation.classification === 'alerta' ? '🟡' : '🔴';
    lines.push(`${icon} ${s.label} — ${s.interpretation}`);
    lines.push(`   Variação: ${s.variation.value}${s.variation.unit} (${s.variation.classificationLabel})`);
    if (s.correctiveExercises.length > 0) {
      lines.push(`   → Corretivos: ${s.correctiveExercises.join(', ')}`);
    }
  }

  lines.push('');
  lines.push('── MÚSCULOS TRABALHADOS ──');
  lines.push(`Primários: ${result.muscles.primary.join(', ')}`);
  lines.push(`Secundários: ${result.muscles.secondary.join(', ')}`);
  lines.push(`Estabilizadores: ${result.muscles.stabilizers.join(', ')}`);

  return lines.join('\n');
}
