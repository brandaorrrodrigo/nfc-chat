/**
 * Construtor de prompts para análise biomecânica (NFV - NutriFitVision)
 * Estrutura dados de entrada conforme template unificado
 */

import { CriteriaClassification, ClassificationResult, summarizeClassification } from './criteria-classifier';
import { CategoryTemplate, EquipmentConstraint, CONSTRAINT_LABELS } from './category-templates';
import type { AnalysisResultV2 } from './classifier-v2';
import type { ExerciseTemplate } from './exercise-templates-v2';

export interface PromptBuilderInput {
  result: ClassificationResult;
  template: CategoryTemplate;
  exerciseName: string;
  ragContext?: RAGContext[];
  equipmentConstraint?: EquipmentConstraint;
  videoMetadata?: {
    duration?: number;
    frameCount?: number;
    fps?: number;
  };
}

export interface RAGContext {
  topic: string;
  content: string;
  source?: string;
}

export interface BuiltPrompt {
  systemPrompt: string;
  userPrompt: string;
  metadata: {
    exerciseName: string;
    category: string;
    criteriaCount: number;
    dangerCount: number;
    warningCount: number;
    ragTopicsCount: number;
  };
}

/**
 * Template do prompt do sistema (independente da análise)
 */
const SYSTEM_PROMPT = `Você é um especialista em biomecânica do movimento humano com formação em cinesiologia, fisioterapia e análise de movimento. Sua função é interpretar dados numéricos estruturados extraídos por MediaPipe e gerar relatórios biomecânicos precisos e acionáveis.

REGRAS ABSOLUTAS:
1. NUNCA invente dados - analise APENAS os números fornecidos
2. NUNCA afirme algo que os dados numéricos não suportem explicitamente
3. Se uma métrica estiver ausente ou inconclusiva, indique "não foi possível avaliar"
4. NUNCA liste problemas contraditórios (ex: cifose E lordose excessivas no MESMO segmento)
5. Use a base de conhecimento (RAG) para fundamentar cada recomendação
6. Cite a fonte/tópico RAG quando usar informação de conhecimento
7. Priorize segurança - qualquer problema em zona vermelha (danger) deve ser sinalizado claramente
8. Estruture o relatório de forma clara e actionável para um coach ou fisioterapeuta

FORMATO DE RESPOSTA:
Sempre estruture assim:
- **Resumo Geral**: 1 frase sobre a qualidade geral
- **Score**: Baseado nas métricas
- **Problemas Identificados**: Apenas aqueles com dados numéricos de suporte
- **Pontos Positivos**: O que está bem
- **Recomendações**: Máximo 3 prioridades com exercícios específicos
`;

/**
 * Cria a seção de resumo das classificações
 */
function buildClassificationsSection(classifications: CriteriaClassification[]): string {
  const lines: string[] = ['## Dados Coletados do MediaPipe\n'];

  // Agrupar por classification level
  const byLevel = {
    danger: classifications.filter((c) => c.classification === 'danger'),
    warning: classifications.filter((c) => c.classification === 'warning'),
    acceptable: classifications.filter((c) =>
      ['acceptable', 'good', 'excellent'].includes(c.classification)
    ),
  };

  // Zona de Perigo
  if (byLevel.danger.length > 0) {
    lines.push('### 🔴 ZONA CRÍTICA (Perigo)\n');
    byLevel.danger.forEach((c) => {
      const name = c.label || c.criterion;
      const infoTag = c.isInformativeOnly ? ' [INFORMATIVO]' : '';
      lines.push(`- **${name}**${infoTag} (${c.metric})`);
      lines.push(
        `  - Valor: ${c.value}${c.unit || ''} | Range Perigoso: ${c.range.danger}`
      );
      if (c.note) {
        lines.push(`  - Nota: ${c.note}`);
      }
      if (c.isSafetyCritical) {
        lines.push(`  - ⚠️ CRITÉRIO DE SEGURANÇA`);
      }
      if (c.isInformativeOnly) {
        lines.push(`  - ℹ️ Classificação informativa — amplitude limitada por equipamento/condição`);
      }
      lines.push('');
    });
  }

  // Zona de Alerta
  if (byLevel.warning.length > 0) {
    lines.push('### 🟡 ZONA DE ALERTA\n');
    byLevel.warning.forEach((c) => {
      const name = c.label || c.criterion;
      lines.push(`- **${name}** (${c.metric})`);
      lines.push(
        `  - Valor: ${c.value}${c.unit || ''} | Range de Alerta: ${c.range.warning}`
      );
      if (c.note) {
        lines.push(`  - Nota: ${c.note}`);
      }
      lines.push('');
    });
  }

  // Zona OK
  if (byLevel.acceptable.length > 0) {
    lines.push('### 🟢 DENTRO DOS LIMITES (Aceitável/Bom/Excelente)\n');
    byLevel.acceptable.forEach((c) => {
      const name = c.label || c.criterion;
      const rangeText = c.range.excellent || c.range.good || c.range.acceptable;
      lines.push(`- **${name}**: ${c.value}${c.unit || ''} (${rangeText})`);
    });
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Cria a seção de contexto RAG
 */
function buildRAGSection(ragContext?: RAGContext[]): string {
  if (!ragContext || ragContext.length === 0) {
    return '';
  }

  const lines: string[] = ['## Base de Conhecimento (RAG)\n'];

  // Agrupar por tópico
  const byTopic = ragContext.reduce(
    (acc, ctx) => {
      if (!acc[ctx.topic]) {
        acc[ctx.topic] = [];
      }
      acc[ctx.topic].push(ctx);
      return acc;
    },
    {} as Record<string, RAGContext[]>
  );

  for (const [topic, contexts] of Object.entries(byTopic)) {
    lines.push(`### ${topic}`);
    contexts.forEach((ctx) => {
      lines.push(`${ctx.content}`);
      if (ctx.source) {
        lines.push(`_Fonte: ${ctx.source}_`);
      }
    });
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Cria a seção de critérios do template
 */
function buildCriteriaSection(template: CategoryTemplate, exerciseName: string): string {
  const lines: string[] = [
    `## Critérios de Avaliação para ${exerciseName}\n`,
    `Categoria: **${template.label || template.category}**\n`,
    'Articulações monitoradas: ' + template.key_joints.join(', ') + '\n',
    'Fases do movimento: ' + template.phases.join(', ') + '\n',
  ];

  return lines.join('\n');
}

/**
 * Cria a seção de instruções específicas
 */
function buildInstructionsSection(result: ClassificationResult): string {
  const lines: string[] = [
    '## INSTRUÇÕES PARA ANÁLISE\n',
    'Ao analisar os dados acima:\n',
  ];

  if (result.constraintApplied && result.constraintApplied !== 'none') {
    lines.push(
      `0. **CONTEXTO**: Exercício com ${result.constraintLabel || result.constraintApplied}. Critérios marcados como INFORMATIVOS não devem ser interpretados como problemas reais — amplitude pode estar limitada externamente.\n`
    );
  }

  if (result.classifications.some((c) => c.classification === 'danger')) {
    lines.push(
      '1. **PRIORIDADE MÁXIMA**: Identifique os critérios em ZONA CRÍTICA e explique POR QUÊ são perigosos'
    );
    lines.push(
      '   - Qual a causa biomecânica do problema?'
    );
    lines.push(
      '   - Qual é o risco específico de lesão?'
    );
    lines.push('');
  }

  if (result.classifications.some((c) => c.classification === 'warning')) {
    lines.push(
      '2. **PRIORIDADE ALTA**: Analise critérios em ZONA DE ALERTA'
    );
    lines.push(
      '   - Como podem evoluir para problema crítico?'
    );
    lines.push(
      '   - Qual é a progressão esperada se não corrigido?'
    );
    lines.push('');
  }

  lines.push(
    '3. Gere relatório estruturado em português com:'
  );
  lines.push('   - Resumo geral (1 sentença)');
  lines.push('   - Score (já calculado: ' + result.overallScore + '/10)');
  lines.push('   - Análise detalhada dos problemas encontrados');
  lines.push('   - Recomendações específicas e exercícios corretivos');
  lines.push('   - Sequência de correção (qual problema corrigir primeiro)');
  lines.push('');

  return lines.join('\n');
}

/**
 * Constrói um prompt completo para o Ollama
 */
export function buildPrompt(input: PromptBuilderInput): BuiltPrompt {
  const {
    result,
    template,
    exerciseName,
    ragContext,
    equipmentConstraint,
    videoMetadata,
  } = input;

  const userPromptLines: string[] = [];

  // Header
  userPromptLines.push('# ANÁLISE BIOMECÂNICA DO EXERCÍCIO\n');
  userPromptLines.push(`**Exercício**: ${exerciseName}`);
  userPromptLines.push(`**Categoria**: ${template.label || template.category}`);
  userPromptLines.push(`**Data/Hora**: ${result.timestamp}`);
  if (videoMetadata?.duration) {
    userPromptLines.push(`**Duração do Vídeo**: ${videoMetadata.duration.toFixed(1)}s`);
  }
  if (videoMetadata?.frameCount) {
    userPromptLines.push(`**Frames Analisados**: ${videoMetadata.frameCount}`);
  }
  userPromptLines.push('');

  // Contexto de equipamento (se aplicável)
  if (equipmentConstraint && equipmentConstraint !== 'none') {
    const constraintLabel = CONSTRAINT_LABELS[equipmentConstraint] || equipmentConstraint;
    userPromptLines.push(`## CONTEXTO DE EQUIPAMENTO\n`);
    userPromptLines.push(`Exercício realizado com **${constraintLabel}**.`);
    userPromptLines.push(`Amplitude reduzida pode ser resultado do equipamento/condição, não de limitação técnica do praticante.`);
    userPromptLines.push(`Critérios de profundidade e mobilidade são INFORMATIVOS neste contexto — não penalizam o score.`);
    userPromptLines.push(`Avalie apenas critérios de SEGURANÇA (valgo, lombar, tronco, assimetria) como definitivos.\n`);
    userPromptLines.push('');
  }

  // Score geral (resumido)
  userPromptLines.push(`## Score Geral: ${result.overallScore}/10\n`);
  if (result.hasDangerCriteria) {
    userPromptLines.push('⚠️ **ATENÇÃO**: Existem critérios em zona crítica!\n');
  }
  userPromptLines.push('');

  // Critérios do template
  userPromptLines.push(buildCriteriaSection(template, exerciseName));
  userPromptLines.push('');

  // Dados do MediaPipe
  userPromptLines.push(buildClassificationsSection(result.classifications));
  userPromptLines.push('');

  // Contexto RAG
  if (ragContext && ragContext.length > 0) {
    userPromptLines.push(buildRAGSection(ragContext));
    userPromptLines.push('');
  }

  // Instruções de análise
  userPromptLines.push(buildInstructionsSection(result));
  userPromptLines.push('');

  // Instrução final explícita - conforme template NFV
  userPromptLines.push('## ⚠️ RETORNE EXATAMENTE NESTE JSON (sem texto antes/depois):');
  userPromptLines.push('');
  userPromptLines.push('{');
  userPromptLines.push('  "resumo_executivo": "2-3 frases, mencionar constraint se houver",');
  userPromptLines.push('  "analise_cadeia_movimento": {');
  userPromptLines.push('    "fase_excentrica": "Descrição dados numéricos + relações entre articulações",');
  userPromptLines.push('    "fase_concentrica": "Descrição retorno, controle, alinhamento",');
  userPromptLines.push('    "relacoes_proporcionais": "Análise de coerência entre ângulos"');
  userPromptLines.push('  },');
  userPromptLines.push('  "pontos_positivos": [');
  userPromptLines.push('    "Critério aceitável/superior com explicação do significado",');
  userPromptLines.push('    "Critério aceitável/superior com explicação do significado"');
  userPromptLines.push('  ],');
  userPromptLines.push('  "pontos_atencao": [');
  userPromptLines.push('    {');
  userPromptLines.push('      "criterio": "Nome",');
  userPromptLines.push('      "valor": "valor com unidade",');
  userPromptLines.push('      "o_que_indica": "Explicação baseada em dados",');
  userPromptLines.push('      "possivel_causa": "Baseado em RAG",');
  userPromptLines.push('      "corretivo_sugerido": "Exercício específico"');
  userPromptLines.push('    }');
  userPromptLines.push('  ],');
  userPromptLines.push('  "conclusao_cientifica": "2-3 frases fundamentadas com RAG. Se constraint: recomendar reavaliação.",');
  userPromptLines.push('  "recomendacoes_top3": [');
  userPromptLines.push('    {"prioridade": 1, "descricao": "Mais impactante"},');
  userPromptLines.push('    {"prioridade": 2, "descricao": "Segunda prioridade"},');
  userPromptLines.push('    {"prioridade": 3, "descricao": "Terceira prioridade"}');
  userPromptLines.push('  ],');
  userPromptLines.push('  "score_geral": ' + result.overallScore + ',');
  userPromptLines.push('  "classificacao": "EXCELENTE|BOM|REGULAR|NECESSITA_CORRECAO"');
  userPromptLines.push('}');

  const userPrompt = userPromptLines.join('\n');

  return {
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
    metadata: {
      exerciseName,
      category: template.category,
      criteriaCount: result.classifications.length,
      dangerCount: result.classifications.filter((c) => c.classification === 'danger').length,
      warningCount: result.classifications.filter((c) => c.classification === 'warning').length,
      ragTopicsCount: ragContext?.length || 0,
    },
  };
}

/**
 * Cria um prompt minimalista (sem RAG) para testes rápidos
 */
export function buildMinimalPrompt(
  result: ClassificationResult,
  template: CategoryTemplate,
  exerciseName: string
): BuiltPrompt {
  const userPromptLines: string[] = [];

  userPromptLines.push('# ANÁLISE BIOMECÂNICA\n');
  userPromptLines.push(`Exercício: ${exerciseName} (${template.label || template.category})`);
  userPromptLines.push(`Score: ${result.overallScore}/10\n`);

  // Apenas dados críticos
  const critical = result.classifications.filter((c) =>
    ['danger', 'warning'].includes(c.classification)
  );

  if (critical.length > 0) {
    userPromptLines.push('### Problemas Identificados:\n');
    critical.forEach((c) => {
      const name = c.label || c.criterion;
      userPromptLines.push(`- ${name}: ${c.value}${c.unit || ''}`);
      if (c.classification === 'danger') {
        userPromptLines.push(`  PERIGOSO: ${c.range.danger}`);
      } else {
        userPromptLines.push(`  Alerta: ${c.range.warning}`);
      }
    });
    userPromptLines.push('');
  }

  const acceptable = result.classifications.filter((c) =>
    ['acceptable', 'good', 'excellent'].includes(c.classification)
  );

  if (acceptable.length > 0) {
    userPromptLines.push('### Dentro dos Limites:\n');
    acceptable.slice(0, 5).forEach((c) => {
      const name = c.label || c.criterion;
      userPromptLines.push(`- ${name}: ${c.value}${c.unit || ''} ✓`);
    });
  }

  userPromptLines.push('\nGere um relatório breve identificando problemas e recomendações.');

  return {
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: userPromptLines.join('\n'),
    metadata: {
      exerciseName,
      category: template.category,
      criteriaCount: result.classifications.length,
      dangerCount: result.classifications.filter((c) => c.classification === 'danger').length,
      warningCount: result.classifications.filter((c) => c.classification === 'warning').length,
      ragTopicsCount: 0,
    },
  };
}

// ============================
// V2: Prompt Motor vs Estabilizador
// ============================

export interface PromptBuilderV2Input {
  result: AnalysisResultV2;
  template: ExerciseTemplate;
  ragContext?: RAGContext[];
  videoMetadata?: {
    duration?: number;
    frameCount?: number;
    fps?: number;
  };
}

const SYSTEM_PROMPT_V2 = `Você é um especialista em biomecânica do movimento humano. Analise os dados numéricos de articulações MOTORAS e ESTABILIZADORAS para gerar um laudo biomecânico preciso.

CONCEITOS:
- MOTORA: articulação que EXECUTA o movimento. Mais ROM = melhor.
- ESTABILIZADORA: articulação que deve PERMANECER FIRME. Menos variação = melhor.

REGRAS:
1. NUNCA invente dados — use APENAS os números fornecidos
2. Para motoras: analise ROM, contração máxima e simetria
3. Para estabilizadoras: analise variação e interprete o significado da instabilidade
4. Liste corretivos específicos para cada estabilizador instável
5. Use a base de conhecimento (RAG) quando disponível
6. Responda em português do Brasil
7. RETORNE SOMENTE O JSON especificado`;

/**
 * Constrói prompt V2 com seções Motor e Estabilizador separadas
 */
export function buildPromptV2(input: PromptBuilderV2Input): BuiltPrompt {
  const { result, template, ragContext, videoMetadata } = input;
  const lines: string[] = [];

  // Header
  lines.push('# LAUDO BIOMECÂNICO — ' + result.exerciseName);
  lines.push(`**Tipo**: ${result.type === 'compound' ? 'Composto' : 'Isolado'} (${template.articulationType === 'biarticular' ? 'Biarticular' : 'Monoarticular'})`);
  lines.push(`**Categoria**: ${result.category}`);
  lines.push(`**Score**: ${result.overallScore}/10 | Motor: ${result.motorScore}/10 | Estabilização: ${result.stabilizerScore}/10`);
  if (videoMetadata?.frameCount) {
    lines.push(`**Frames**: ${videoMetadata.frameCount}`);
  }
  lines.push('');

  // Fases do exercício
  lines.push('## Fases do Movimento');
  for (const phase of template.phases) {
    const motorTag = phase.evaluateMotors ? ' [Motor]' : '';
    const stabTag = phase.evaluateStabilizers ? ' [Estabilização]' : '';
    lines.push(`- ${phase.label}${motorTag}${stabTag}${phase.description ? ': ' + phase.description : ''}`);
  }
  lines.push('');

  // Articulações MOTORAS
  lines.push('## ARTICULAÇÕES MOTORAS (mais ROM = melhor)\n');
  for (const m of result.motorAnalysis) {
    const icon = m.rom.classification === 'excellent' || m.rom.classification === 'good' ? '🟢'
      : m.rom.classification === 'acceptable' ? '🟡'
      : m.rom.classification === 'warning' ? '🟠' : '🔴';
    lines.push(`### ${icon} ${m.label} — ${m.movement}`);
    lines.push(`- ROM: ${m.rom.value}${m.rom.unit} → **${m.rom.classificationLabel}**`);
    if (m.peakContraction) {
      lines.push(`- Contração pico: ${m.peakContraction.value}${m.peakContraction.unit} → **${m.peakContraction.classificationLabel}**`);
    }
    if (m.symmetry) {
      lines.push(`- Simetria D/E: ${m.symmetry.diff}${m.symmetry.unit} → ${m.symmetry.classification === 'ok' ? 'OK' : '⚠️ ' + m.symmetry.classification}`);
    }
    lines.push('');
  }

  // Articulações ESTABILIZADORAS
  lines.push('## ARTICULAÇÕES ESTABILIZADORAS (menos variação = melhor)\n');
  for (const s of result.stabilizerAnalysis) {
    const icon = s.variation.classification === 'firme' ? '🟢'
      : s.variation.classification === 'alerta' ? '🟡' : '🔴';
    lines.push(`### ${icon} ${s.label}`);
    lines.push(`- Esperado: ${s.expectedState}`);
    lines.push(`- Variação: ${s.variation.value}${s.variation.unit} → **${s.variation.classificationLabel}**`);
    lines.push(`- ${s.interpretation}`);
    if (s.correctiveExercises.length > 0) {
      lines.push(`- Corretivos: ${s.correctiveExercises.join(', ')}`);
    }
    lines.push('');
  }

  // Músculos
  lines.push('## MÚSCULOS TRABALHADOS');
  lines.push(`- Primários: ${result.muscles.primary.join(', ')}`);
  lines.push(`- Secundários: ${result.muscles.secondary.join(', ')}`);
  lines.push(`- Estabilizadores: ${result.muscles.stabilizers.join(', ')}`);
  lines.push('');

  // RAG
  if (ragContext && ragContext.length > 0) {
    lines.push(buildRAGSection(ragContext));
    lines.push('');
  }

  // JSON output format V2
  lines.push('## ⚠️ RETORNE EXATAMENTE NESTE JSON (sem texto antes/depois):');
  lines.push('');
  lines.push('{');
  lines.push('  "resumo_executivo": "2-3 frases sobre o exercício",');
  lines.push('  "analise_cadeia_movimento": {');
  for (const phase of template.phases) {
    lines.push(`    "${phase.id}": "Análise da fase ${phase.label}",`);
  }
  lines.push('    "relacoes_proporcionais": "Coerência entre motoras e estabilizadoras"');
  lines.push('  },');
  lines.push('  "pontos_positivos": [');
  lines.push('    {"criterio": "Nome Articulação", "valor": "valor", "o_que_indica": "Explicação positiva", "possivel_causa": "Por que está bom", "corretivo_sugerido": "Manter exercício X"}');
  lines.push('  ],');
  lines.push('  "pontos_atencao": [');
  lines.push('    {"criterio": "Nome Articulação", "valor": "valor", "o_que_indica": "Significado da instabilidade", "possivel_causa": "Baseado em RAG", "corretivo_sugerido": "Exercício específico"}');
  lines.push('  ],');
  lines.push('  "conclusao_cientifica": "2-3 frases fundamentadas",');
  lines.push('  "recomendacoes_top3": [');
  lines.push('    {"prioridade": 1, "descricao": "Mais impactante"},');
  lines.push('    {"prioridade": 2, "descricao": "Segunda"},');
  lines.push('    {"prioridade": 3, "descricao": "Terceira"}');
  lines.push('  ],');
  lines.push('  "score_geral": ' + result.overallScore + ',');
  lines.push('  "motor_score": ' + result.motorScore + ',');
  lines.push('  "stabilizer_score": ' + result.stabilizerScore + ',');
  lines.push('  "classificacao": "EXCELENTE|BOM|REGULAR|NECESSITA_CORRECAO",');
  lines.push('  "musculos": {"primarios": [' + result.muscles.primary.map(m => `"${m}"`).join(', ') + '], "secundarios": [' + result.muscles.secondary.map(m => `"${m}"`).join(', ') + '], "estabilizadores": [' + result.muscles.stabilizers.map(m => `"${m}"`).join(', ') + ']}');
  lines.push('}');

  const dangerMotors = result.motorAnalysis.filter(m => m.rom.classification === 'danger');
  const warningMotors = result.motorAnalysis.filter(m => m.rom.classification === 'warning');
  const compensationStabs = result.stabilizerAnalysis.filter(s => s.variation.classification === 'compensação');
  const alertStabs = result.stabilizerAnalysis.filter(s => s.variation.classification === 'alerta');

  return {
    systemPrompt: SYSTEM_PROMPT_V2,
    userPrompt: lines.join('\n'),
    metadata: {
      exerciseName: result.exerciseName,
      category: result.category,
      criteriaCount: result.motorAnalysis.length + result.stabilizerAnalysis.length,
      dangerCount: dangerMotors.length + compensationStabs.length,
      warningCount: warningMotors.length + alertStabs.length,
      ragTopicsCount: ragContext?.length || 0,
    },
  };
}

/**
 * Formata um prompt para debugging (mostra estrutura interna)
 */
export function debugPrompt(prompt: BuiltPrompt): string {
  const lines: string[] = [];

  lines.push('═'.repeat(60));
  lines.push('PROMPT DE SISTEMA');
  lines.push('═'.repeat(60));
  lines.push(prompt.systemPrompt);
  lines.push('');

  lines.push('═'.repeat(60));
  lines.push('PROMPT DO USUÁRIO');
  lines.push('═'.repeat(60));
  lines.push(prompt.userPrompt);
  lines.push('');

  lines.push('═'.repeat(60));
  lines.push('METADADOS');
  lines.push('═'.repeat(60));
  lines.push(`Exercício: ${prompt.metadata.exerciseName}`);
  lines.push(`Categoria: ${prompt.metadata.category}`);
  lines.push(`Critérios: ${prompt.metadata.criteriaCount}`);
  lines.push(`  - Danger: ${prompt.metadata.dangerCount}`);
  lines.push(`  - Warning: ${prompt.metadata.warningCount}`);
  lines.push(`Tópicos RAG: ${prompt.metadata.ragTopicsCount}`);

  return lines.join('\n');
}
