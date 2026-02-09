/**
 * Construtor de prompts para análise biomecânica (NFV - NutriFitVision)
 * Estrutura dados de entrada conforme template unificado
 */

import { CriteriaClassification, ClassificationResult, summarizeClassification } from './criteria-classifier';
import { CategoryTemplate, EquipmentConstraint, CONSTRAINT_LABELS } from './category-templates';

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
