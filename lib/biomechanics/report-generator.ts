/**
 * Biomechanics Report Generator
 * Usa Llama 3.1 para gerar relatórios técnicos estruturados
 * Integrado com RAG para citações científicas
 */

import axios from 'axios';
import { FrameAnalysis } from './vision-analyzer';
import { searchBiomechanicsKnowledge, formatChunksForPrompt, RAGChunk } from './rag-service';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const TEXT_MODEL = 'llama3:8b'; // Preferir modelo menor para velocidade

export interface BiomechanicsReport {
  resumo_executivo: string;
  analise_por_fase: {
    excentrica: FaseAnalysis;
    isometrica: FaseAnalysis;
    concentrica: FaseAnalysis;
  };
  pontos_criticos: PontoCritico[];
  recomendacoes_corretivas: Recomendacao[];
  score_geral: number;
  classificacao: 'EXCELENTE' | 'BOM' | 'REGULAR' | 'NECESSITA_CORRECAO';
  proximos_passos: string[];
}

interface FaseAnalysis {
  qualidade: 'ADEQUADA' | 'PARCIALMENTE_ADEQUADA' | 'INADEQUADA';
  observacoes: string[];
  angulos_medios: {
    joelho: number;
    quadril: number;
    tronco: number;
  };
}

interface PontoCritico {
  tipo: 'ALINHAMENTO' | 'AMPLITUDE' | 'CONTROLE' | 'COMPENSACAO';
  descricao: string;
  severidade: 'LEVE' | 'MODERADO' | 'SEVERO';
  frames_afetados: number[];
}

interface Recomendacao {
  prioridade: 1 | 2 | 3;
  categoria: string;
  descricao: string;
  exercicio_corretivo?: string;
}

const REPORT_PROMPT = (exerciseType: string, frameAnalyses: FrameAnalysis[]) => {
  const framesJson = JSON.stringify(frameAnalyses, null, 2);

  return `Você é um biomecânico PhD especializado em análise de movimento humano.

Analise os dados de ${frameAnalyses.length} frames de um ${exerciseType} e gere um relatório técnico.

DADOS DOS FRAMES:
${framesJson}

Gere um relatório técnico em JSON com esta estrutura EXATA:

{
  "resumo_executivo": "Resumo em 2-3 frases do desempenho geral",
  "analise_por_fase": {
    "excentrica": {
      "qualidade": "ADEQUADA" | "PARCIALMENTE_ADEQUADA" | "INADEQUADA",
      "observacoes": ["observação 1", "observação 2"],
      "angulos_medios": { "joelho": 90, "quadril": 85, "tronco": 15 }
    },
    "isometrica": { ... mesmo formato ... },
    "concentrica": { ... mesmo formato ... }
  },
  "pontos_criticos": [
    {
      "tipo": "ALINHAMENTO" | "AMPLITUDE" | "CONTROLE" | "COMPENSACAO",
      "descricao": "Descrição técnica do problema",
      "severidade": "LEVE" | "MODERADO" | "SEVERO",
      "frames_afetados": [1, 2, 3]
    }
  ],
  "recomendacoes_corretivas": [
    {
      "prioridade": 1,
      "categoria": "Mobilidade" | "Força" | "Controle Motor" | "Técnica",
      "descricao": "O que fazer para corrigir",
      "exercicio_corretivo": "Nome do exercício específico"
    }
  ],
  "score_geral": 7.5,
  "classificacao": "BOM",
  "proximos_passos": ["Passo 1", "Passo 2"]
}

REGRAS:
- Use os dados reais dos frames para suas conclusões
- Score de 1-10 baseado na média dos frames
- Classificação: >=8 EXCELENTE, >=6 BOM, >=4 REGULAR, <4 NECESSITA_CORRECAO
- Prioridade 1 = mais urgente
- Seja específico nas recomendações
- RETORNE APENAS O JSON, sem texto antes ou depois`;
};

export async function generateBiomechanicsReport(
  frameAnalyses: FrameAnalysis[],
  exerciseType: string = 'agachamento'
): Promise<BiomechanicsReport | null> {
  const prompt = REPORT_PROMPT(exerciseType, frameAnalyses);

  try {
    // Verificar modelos disponíveis (preferir menores para velocidade)
    const modelsResponse = await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 5000 });
    const models = modelsResponse.data.models?.map((m: any) => m.name) || [];

    let textModel = TEXT_MODEL;
    if (!models.includes(TEXT_MODEL)) {
      // Preferir modelos menores para velocidade
      const preferredOrder = ['llama3:8b', 'llama3:latest', 'llama3.1:8b'];
      textModel = preferredOrder.find(m => models.includes(m)) ||
        models.find((m: string) => m.includes('llama3') && !m.includes('vision') && !m.includes('70b')) ||
        models[0];
    }

    console.log(`📝 Gerando relatório com ${textModel}...`);

    const response = await axios.post(
      `${OLLAMA_URL}/api/generate`,
      {
        model: textModel,
        prompt,
        stream: false,
        options: {
          temperature: 0.3,
          num_predict: 2000,
        },
      },
      { timeout: 180000 }
    );

    const responseText = response.data.response || '';

    // Extrair JSON da resposta
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.warn('Ollama nao retornou JSON valido para relatorio');
      return null;
    }

    try {
      const parsed = JSON.parse(jsonMatch[0]);
      return validateAndNormalizeReport(parsed, frameAnalyses);
    } catch (parseError) {
      console.warn('Erro ao parsear JSON do relatorio:', parseError);
      return null;
    }
  } catch (error: any) {
    console.error('Erro ao gerar relatorio:', error.message);
    return null;
  }
}

function validateAndNormalizeReport(
  data: any,
  frameAnalyses: FrameAnalysis[]
): BiomechanicsReport {
  const avgScore = frameAnalyses.reduce((sum, f) => sum + f.score, 0) / frameAnalyses.length;

  const getClassificacao = (score: number): BiomechanicsReport['classificacao'] => {
    if (score >= 8) return 'EXCELENTE';
    if (score >= 6) return 'BOM';
    if (score >= 4) return 'REGULAR';
    return 'NECESSITA_CORRECAO';
  };

  // Calcular médias por fase
  const faseFrames = {
    excentrica: frameAnalyses.filter(f => f.fase === 'excentrica'),
    isometrica: frameAnalyses.filter(f => f.fase === 'isometrica'),
    concentrica: frameAnalyses.filter(f => f.fase === 'concentrica'),
  };

  const calcularMediasFase = (frames: FrameAnalysis[]): FaseAnalysis['angulos_medios'] => {
    if (frames.length === 0) return { joelho: 90, quadril: 85, tronco: 15 };
    return {
      joelho: Math.round(frames.reduce((s, f) => s + f.angulos_aproximados.joelho_esq_graus, 0) / frames.length),
      quadril: Math.round(frames.reduce((s, f) => s + f.angulos_aproximados.flexao_quadril_graus, 0) / frames.length),
      tronco: Math.round(frames.reduce((s, f) => s + f.angulos_aproximados.inclinacao_tronco_graus, 0) / frames.length),
    };
  };

  const avaliarQualidadeFase = (frames: FrameAnalysis[]): FaseAnalysis['qualidade'] => {
    if (frames.length === 0) return 'ADEQUADA';
    const avgFaseScore = frames.reduce((s, f) => s + f.score, 0) / frames.length;
    if (avgFaseScore >= 7) return 'ADEQUADA';
    if (avgFaseScore >= 5) return 'PARCIALMENTE_ADEQUADA';
    return 'INADEQUADA';
  };

  return {
    resumo_executivo: data.resumo_executivo ||
      `Análise de ${frameAnalyses.length} frames de agachamento. Score médio: ${avgScore.toFixed(1)}/10.`,

    analise_por_fase: {
      excentrica: {
        qualidade: data.analise_por_fase?.excentrica?.qualidade || avaliarQualidadeFase(faseFrames.excentrica),
        observacoes: data.analise_por_fase?.excentrica?.observacoes || ['Fase de descida analisada'],
        angulos_medios: data.analise_por_fase?.excentrica?.angulos_medios || calcularMediasFase(faseFrames.excentrica),
      },
      isometrica: {
        qualidade: data.analise_por_fase?.isometrica?.qualidade || avaliarQualidadeFase(faseFrames.isometrica),
        observacoes: data.analise_por_fase?.isometrica?.observacoes || ['Fase de fundo analisada'],
        angulos_medios: data.analise_por_fase?.isometrica?.angulos_medios || calcularMediasFase(faseFrames.isometrica),
      },
      concentrica: {
        qualidade: data.analise_por_fase?.concentrica?.qualidade || avaliarQualidadeFase(faseFrames.concentrica),
        observacoes: data.analise_por_fase?.concentrica?.observacoes || ['Fase de subida analisada'],
        angulos_medios: data.analise_por_fase?.concentrica?.angulos_medios || calcularMediasFase(faseFrames.concentrica),
      },
    },

    pontos_criticos: Array.isArray(data.pontos_criticos) ? data.pontos_criticos :
      extractCriticalPoints(frameAnalyses),

    recomendacoes_corretivas: Array.isArray(data.recomendacoes_corretivas) ?
      data.recomendacoes_corretivas : generateDefaultRecommendations(frameAnalyses),

    score_geral: typeof data.score_geral === 'number' ?
      Math.min(10, Math.max(1, data.score_geral)) : avgScore,

    classificacao: data.classificacao || getClassificacao(avgScore),

    proximos_passos: Array.isArray(data.proximos_passos) ? data.proximos_passos : [
      'Revisar os pontos críticos identificados',
      'Praticar os exercícios corretivos sugeridos',
      'Gravar novo vídeo após 2 semanas de prática',
    ],
  };
}

function extractCriticalPoints(frameAnalyses: FrameAnalysis[]): PontoCritico[] {
  const pontos: PontoCritico[] = [];

  // Verificar valgo
  const framesComValgo = frameAnalyses
    .filter(f => f.alinhamentos.joelho_esq_valgo || f.alinhamentos.joelho_dir_valgo)
    .map((_, i) => i + 1);

  if (framesComValgo.length > 0) {
    pontos.push({
      tipo: 'ALINHAMENTO',
      descricao: 'Valgo dinâmico de joelho detectado durante o movimento',
      severidade: framesComValgo.length > 2 ? 'SEVERO' : 'MODERADO',
      frames_afetados: framesComValgo,
    });
  }

  // Verificar coluna
  const framesColunaNaoNeutra = frameAnalyses
    .filter(f => !f.alinhamentos.coluna_neutra)
    .map((_, i) => i + 1);

  if (framesColunaNaoNeutra.length > 0) {
    pontos.push({
      tipo: 'CONTROLE',
      descricao: 'Perda de neutralidade da coluna durante a execução',
      severidade: framesColunaNaoNeutra.length > 2 ? 'MODERADO' : 'LEVE',
      frames_afetados: framesColunaNaoNeutra,
    });
  }

  // Verificar joelhos sobre pés
  const framesJoelhosDesalinhados = frameAnalyses
    .filter(f => !f.alinhamentos.joelhos_sobre_pes)
    .map((_, i) => i + 1);

  if (framesJoelhosDesalinhados.length > 0) {
    pontos.push({
      tipo: 'ALINHAMENTO',
      descricao: 'Joelhos não mantêm alinhamento sobre os pés',
      severidade: 'MODERADO',
      frames_afetados: framesJoelhosDesalinhados,
    });
  }

  // Desvios críticos mencionados
  const todosDesvios = frameAnalyses.flatMap(f => f.desvios_criticos);
  if (todosDesvios.length > 0) {
    const uniqueDesvios = [...new Set(todosDesvios)];
    uniqueDesvios.forEach(desvio => {
      pontos.push({
        tipo: 'COMPENSACAO',
        descricao: desvio,
        severidade: 'MODERADO',
        frames_afetados: frameAnalyses
          .filter(f => f.desvios_criticos.includes(desvio))
          .map((_, i) => i + 1),
      });
    });
  }

  return pontos;
}

function generateDefaultRecommendations(frameAnalyses: FrameAnalysis[]): Recomendacao[] {
  const recomendacoes: Recomendacao[] = [];
  const hasValgo = frameAnalyses.some(f => f.alinhamentos.joelho_esq_valgo || f.alinhamentos.joelho_dir_valgo);
  const hasColunaProblem = frameAnalyses.some(f => !f.alinhamentos.coluna_neutra);
  const avgScore = frameAnalyses.reduce((s, f) => s + f.score, 0) / frameAnalyses.length;

  if (hasValgo) {
    recomendacoes.push({
      prioridade: 1,
      categoria: 'Força',
      descricao: 'Fortalecer glúteo médio e rotadores externos do quadril',
      exercicio_corretivo: 'Clamshell com banda elástica',
    });
  }

  if (hasColunaProblem) {
    recomendacoes.push({
      prioridade: 1,
      categoria: 'Controle Motor',
      descricao: 'Trabalhar estabilização lombar durante o movimento',
      exercicio_corretivo: 'Dead Bug progressivo',
    });
  }

  if (avgScore < 7) {
    recomendacoes.push({
      prioridade: 2,
      categoria: 'Mobilidade',
      descricao: 'Melhorar mobilidade de tornozelo e quadril',
      exercicio_corretivo: 'Agachamento no cálice com elevação de calcanhar',
    });
  }

  recomendacoes.push({
    prioridade: 3,
    categoria: 'Técnica',
    descricao: 'Praticar o movimento com carga reduzida focando nos pontos identificados',
    exercicio_corretivo: 'Agachamento com pausa no fundo',
  });

  return recomendacoes;
}

export async function checkTextModelAvailable(): Promise<{ available: boolean; model: string }> {
  try {
    const response = await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 5000 });
    const models = response.data.models?.map((m: any) => m.name) || [];

    if (models.includes(TEXT_MODEL)) {
      return { available: true, model: TEXT_MODEL };
    }

    // Preferir modelos menores para velocidade
    const preferredOrder = ['llama3:8b', 'llama3:latest', 'llama3.1:8b'];
    for (const preferred of preferredOrder) {
      if (models.includes(preferred)) {
        return { available: true, model: preferred };
      }
    }

    // Fallback: qualquer llama3 que não seja vision nem 70b
    const alternative = models.find((m: string) =>
      m.includes('llama3') && !m.includes('vision') && !m.includes('70b')
    );
    if (alternative) {
      return { available: true, model: alternative };
    }

    return { available: false, model: '' };
  } catch {
    return { available: false, model: '' };
  }
}

// ============================================================================
// GERAÇÃO DE RELATÓRIO COM RAG
// ============================================================================

const REPORT_WITH_RAG_PROMPT = (
  exerciseType: string,
  frameAnalyses: FrameAnalysis[],
  scientificContext: string
) => {
  const framesJson = JSON.stringify(frameAnalyses, null, 2);

  return `Você é um biomecânico PhD redigindo um laudo técnico de ${exerciseType}.

DADOS DA ANÁLISE VISUAL (Llama 3.2-Vision):
${framesJson}

REFERÊNCIAS CIENTÍFICAS DISPONÍVEIS:
${scientificContext}

---

REDIJA UM LAUDO TÉCNICO PROFISSIONAL em JSON com esta estrutura EXATA:

{
  "resumo_executivo": "Resumo em 3-4 frases incluindo score, classificação e principais achados",

  "analise_por_fase": {
    "excentrica": {
      "qualidade": "ADEQUADA" | "PARCIALMENTE_ADEQUADA" | "INADEQUADA",
      "angulos_medios": { "joelho": 90, "quadril": 85, "tronco": 15 },
      "observacoes": ["observação 1 com base científica"],
      "citacao_cientifica": "Citação direta de um livro de referência, se disponível"
    },
    "isometrica": { ... },
    "concentrica": { ... }
  },

  "desvios_identificados": [
    {
      "nome": "Valgo Dinâmico de Joelho",
      "severidade": "CRITICA" | "MODERADA" | "LEVE",
      "descricao_tecnica": "O que foi observado visualmente",
      "fundamentacao_cientifica": "Citação direta: Segundo AUTOR (LIVRO, p. X): 'texto'",
      "mecanismo_lesao": "Por que isso é problemático",
      "causas_provaveis": ["causa 1", "causa 2"],
      "frames_afetados": [1, 2, 3]
    }
  ],

  "recomendacoes_corretivas": [
    {
      "prioridade": 1,
      "desvio_alvo": "Valgo Dinâmico",
      "exercicios": [
        {
          "nome": "Clamshell com Banda",
          "execucao": "Como fazer",
          "volume": "3x15 repetições",
          "frequencia": "5x/semana"
        }
      ],
      "ajustes_tecnicos": ["ajuste 1", "ajuste 2"],
      "progressao_4_semanas": {
        "semana_1_2": "objetivos",
        "semana_3_4": "objetivos"
      }
    }
  ],

  "referencias_cientificas": [
    {
      "autor": "Netter, F.H.",
      "obra": "Atlas de Anatomia Humana",
      "edicao": "7ª Edição",
      "paginas_citadas": [478, 480]
    }
  ],

  "score_geral": 7.5,
  "classificacao": "BOM",

  "proximos_passos": [
    "Passo 1 específico",
    "Passo 2 específico"
  ],

  "proxima_avaliacao": "4 semanas"
}

REGRAS IMPORTANTES:
- Use SEMPRE citações diretas dos livros quando disponíveis nas referências
- Priorize evidência científica sobre opinião
- Seja específico com números (ângulos, graus, percentagens)
- Score de 1-10 baseado na média dos frames
- Classificação: >=8 EXCELENTE, >=6 BOM, >=4 REGULAR, <4 NECESSITA_CORRECAO
- Mantenha tom profissional mas acessível
- RETORNE APENAS O JSON, sem texto antes ou depois`;
};

export interface EnhancedBiomechanicsReport extends BiomechanicsReport {
  desvios_identificados?: Array<{
    nome: string;
    severidade: string;
    descricao_tecnica: string;
    fundamentacao_cientifica?: string;
    mecanismo_lesao?: string;
    causas_provaveis?: string[];
    frames_afetados?: number[];
  }>;
  referencias_cientificas?: Array<{
    autor: string;
    obra: string;
    edicao?: string;
    paginas_citadas?: number[];
  }>;
  rag_chunks_used?: number;
  rag_sources?: string[];
}

/**
 * Gera relatório técnico com RAG - citações científicas reais
 */
export async function generateBiomechanicsReportWithRAG(
  frameAnalyses: FrameAnalysis[],
  exerciseType: string = 'agachamento'
): Promise<EnhancedBiomechanicsReport | null> {
  // 1. Extrair todos os desvios detectados
  const allDeviations = frameAnalyses
    .flatMap(f => f.desvios_criticos)
    .filter((v, i, arr) => arr.indexOf(v) === i);

  // Adicionar termos baseados em alinhamentos
  const alignmentDeviations: string[] = [];
  frameAnalyses.forEach(f => {
    if (f.alinhamentos.joelho_esq_valgo || f.alinhamentos.joelho_dir_valgo) {
      alignmentDeviations.push('valgo dinâmico de joelho');
    }
    if (!f.alinhamentos.coluna_neutra) {
      alignmentDeviations.push('perda de neutralidade da coluna');
    }
    if (!f.alinhamentos.joelhos_sobre_pes) {
      alignmentDeviations.push('desalinhamento de joelhos');
    }
  });

  const deviationsToSearch = [...new Set([...allDeviations, ...alignmentDeviations])];

  console.log(`🔍 Desvios para busca RAG: ${deviationsToSearch.join(', ')}`);

  // 2. Buscar no RAG (se disponível)
  let ragChunks: RAGChunk[] = [];
  let ragSources: string[] = [];

  if (deviationsToSearch.length > 0) {
    try {
      const ragResult = await searchBiomechanicsKnowledge(deviationsToSearch, {
        topK: 5,
        minScore: 0.65,
        categories: ['anatomy', 'biomechanics', 'kinesiology', 'orthopedics', 'exercise'],
      });

      ragChunks = ragResult.chunks;
      ragSources = ragResult.sources;

      console.log(`📚 RAG: ${ragChunks.length} chunks de ${ragSources.length} fontes`);
    } catch (ragError) {
      console.warn('⚠️ RAG não disponível:', ragError);
    }
  }

  // 3. Formatar contexto científico
  const scientificContext = ragChunks.length > 0
    ? formatChunksForPrompt(ragChunks)
    : 'Nenhuma referência científica disponível no banco de dados.';

  // 4. Gerar relatório com Llama 3.1
  const prompt = REPORT_WITH_RAG_PROMPT(exerciseType, frameAnalyses, scientificContext);

  try {
    // Verificar modelo disponível (preferir menores para velocidade)
    const modelsResponse = await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 5000 });
    const models = modelsResponse.data.models?.map((m: any) => m.name) || [];

    let textModel = TEXT_MODEL;
    if (!models.includes(TEXT_MODEL)) {
      const preferredOrder = ['llama3:8b', 'llama3:latest', 'llama3.1:8b'];
      textModel = preferredOrder.find(m => models.includes(m)) ||
        models.find((m: string) => m.includes('llama3') && !m.includes('vision') && !m.includes('70b')) ||
        models[0];
    }

    console.log(`📝 Gerando relatório com RAG usando ${textModel}...`);

    const response = await axios.post(
      `${OLLAMA_URL}/api/generate`,
      {
        model: textModel,
        prompt,
        stream: false,
        options: {
          temperature: 0.3,
          num_predict: 4000, // Mais tokens para relatório detalhado
        },
      },
      { timeout: 300000 } // 5 minutos
    );

    const responseText = response.data.response || '';

    // Extrair JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.warn('Ollama nao retornou JSON valido com RAG');
      return null;
    }

    try {
      const parsed = JSON.parse(jsonMatch[0]);
      const validatedReport = validateAndNormalizeReportWithRAG(parsed, frameAnalyses);

      return {
        ...validatedReport,
        rag_chunks_used: ragChunks.length,
        rag_sources: ragSources,
      };
    } catch (parseError) {
      console.warn('Erro ao parsear JSON do relatorio com RAG:', parseError);
      return null;
    }
  } catch (error: any) {
    console.error('Erro ao gerar relatorio com RAG:', error.message);
    return null;
  }
}

function validateAndNormalizeReportWithRAG(
  data: any,
  frameAnalyses: FrameAnalysis[]
): EnhancedBiomechanicsReport {
  // Usar validação base
  const baseReport = validateAndNormalizeReport(data, frameAnalyses);

  // Adicionar campos específicos do RAG
  return {
    ...baseReport,
    desvios_identificados: Array.isArray(data.desvios_identificados)
      ? data.desvios_identificados.map((d: any) => ({
          nome: d.nome || 'Desvio não especificado',
          severidade: d.severidade || 'MODERADA',
          descricao_tecnica: d.descricao_tecnica || '',
          fundamentacao_cientifica: d.fundamentacao_cientifica,
          mecanismo_lesao: d.mecanismo_lesao,
          causas_provaveis: Array.isArray(d.causas_provaveis) ? d.causas_provaveis : [],
          frames_afetados: Array.isArray(d.frames_afetados) ? d.frames_afetados : [],
        }))
      : undefined,
    referencias_cientificas: Array.isArray(data.referencias_cientificas)
      ? data.referencias_cientificas.map((r: any) => ({
          autor: r.autor || 'Autor desconhecido',
          obra: r.obra || 'Obra não especificada',
          edicao: r.edicao,
          paginas_citadas: Array.isArray(r.paginas_citadas) ? r.paginas_citadas : [],
        }))
      : undefined,
  };
}
