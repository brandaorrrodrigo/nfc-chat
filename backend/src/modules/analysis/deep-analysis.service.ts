/**
 * Serviço de Análise Profunda (Deep Analysis)
 * Camada 2: RAG + LLM para análise científica detalhada
 */

import { Injectable, Logger } from '@nestjs/common';
import { RagService } from './rag/rag.service';
import { OllamaService } from './ollama/ollama.service';
import { DeepAnalysisInputDto, DeepAnalysisOutputDto, ScientificSourceDto } from './dto/deep-analysis.dto';
import { IScientificContext } from './interfaces/rag.interface';

@Injectable()
export class DeepAnalysisService {
  private readonly logger = new Logger(DeepAnalysisService.name);

  constructor(
    private ragService: RagService,
    private ollamaService: OllamaService,
  ) {}

  /**
   * CAMADA 2: Análise profunda com RAG + LLM
   * Executa APENAS quando decisão engine aprovar
   */
  async analyze(input: DeepAnalysisInputDto): Promise<DeepAnalysisOutputDto> {
    const startTime = Date.now();

    try {
      this.logger.log(
        `Starting deep analysis for user ${input.userId}, exercise ${input.exerciseId}`,
      );

      // 1. Identificar desvios críticos
      const deviations = JSON.parse(input.quickAnalysis.deviations_detected as string);
      const criticalDeviations = deviations.filter(
        (d: any) => d.severity === 'moderate' || d.severity === 'severe',
      );

      if (criticalDeviations.length === 0) {
        this.logger.warn('Deep analysis called with no critical deviations');
        return null;
      }

      this.logger.log(`Analyzing ${criticalDeviations.length} critical deviations`);

      // 2. Buscar contexto científico via RAG (paralelo)
      const scientificContext = await this.ragService.searchMultipleDeviations(
        criticalDeviations.map((d: any) => ({
          type: d.type,
          severity: d.severity,
        })),
        input.exerciseId,
        3, // Top 3 chunks por desvio
      );

      this.logger.log(
        `RAG retrieved ${scientificContext.totalChunks} chunks from ${scientificContext.sources.length} sources`,
      );

      if (scientificContext.totalChunks === 0) {
        this.logger.warn('No scientific context found - proceeding with limited analysis');
      }

      // 3. Gerar narrativa com LLM
      const narrative = await this.generateNarrative({
        quickAnalysis: input.quickAnalysis,
        criticalDeviations,
        scientificContext,
        exerciseId: input.exerciseId,
      });

      const processingTime = Date.now() - startTime;

      this.logger.log(`Deep analysis completed in ${processingTime}ms`);

      return {
        rag_sources_used: scientificContext.sources,
        llm_narrative: narrative.text,
        scientific_context: {
          deviations_analyzed: criticalDeviations.map((d: any) => d.type),
          sources: scientificContext.sources.map((s) => ({
            title: s.title,
            authors: s.authors,
            year: s.year,
            relevance_score: s.relevance,
          })),
          total_chunks: scientificContext.totalChunks,
        },
        processing_time_ms: processingTime,
      };
    } catch (error) {
      this.logger.error(`Deep analysis failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Gera narrativa científica usando LLM
   */
  private async generateNarrative(context: {
    quickAnalysis: any;
    criticalDeviations: any[];
    scientificContext: IScientificContext;
    exerciseId: string;
  }): Promise<{ text: string }> {
    const prompt = this.buildNarrativePrompt(context);

    this.logger.debug('Generating narrative with LLM...');

    const response = await this.ollamaService.generate({
      model: 'llama3.1:8b',
      prompt,
      options: {
        temperature: 0.3, // Baixa criatividade, alta precisão
        top_p: 0.9,
        max_tokens: 1500,
      },
    });

    return {
      text: response.text,
    };
  }

  /**
   * Constrói prompt para LLM com contexto científico
   */
  private buildNarrativePrompt(context: {
    quickAnalysis: any;
    criticalDeviations: any[];
    scientificContext: IScientificContext;
    exerciseId: string;
  }): string {
    const { quickAnalysis, criticalDeviations, scientificContext, exerciseId } = context;

    // Lista de desvios
    const deviationsList = criticalDeviations
      .map(
        (d) =>
          `- ${this.translateDeviationType(d.type)} (${this.translateSeverity(d.severity)}): ` +
          `${d.percentage}% dos frames, valor médio ${d.average_value}°`,
      )
      .join('\n');

    // Contexto científico
    const sourcesList = scientificContext.sources
      .slice(0, 5) // Limitar a 5 fontes principais
      .map((s) => `- ${s.title} (${s.authors}, ${s.year}): ${s.excerpt}`)
      .join('\n\n');

    const hasScientificContext = scientificContext.sources.length > 0;

    return `
Você é um fisioterapeuta especializado em biomecânica esportiva criando um relatório de avaliação.

DADOS DA ANÁLISE:
- Exercício: ${this.translateExercise(exerciseId)}
- Score Global: ${quickAnalysis.overall_score}/10
- Classificação: ${this.translateClassification(quickAnalysis.classification)}
- Similaridade com Padrão Ouro: ${(quickAnalysis.similarity_to_gold * 100).toFixed(1)}%

DESVIOS CRÍTICOS IDENTIFICADOS:
${deviationsList}

${
  hasScientificContext
    ? `CONTEXTO CIENTÍFICO (${scientificContext.sources.length} fontes):
${sourcesList}`
    : 'NOTA: Análise baseada em conhecimento geral de biomecânica (contexto científico específico não disponível).'
}

TAREFA:
Gere um relatório profissional seguindo EXATAMENTE esta estrutura:

## Resumo Executivo
[Parágrafo de 3-4 linhas com principais achados]

## Desvios Biomecânicos Críticos

${criticalDeviations
  .map(
    (d) => `### ${this.translateDeviationType(d.type)}
[Explicação do desvio com base científica]
- Causa provável: [baseado em literatura${hasScientificContext ? '' : ' geral'}]
- Impacto na performance: [específico]
- Risco de lesão: [evidência científica]
`,
  )
  .join('\n')}

## Análise de Padrões
[Descrever padrões compensatórios e relações entre desvios]

## Recomendações Baseadas em Evidências
1. [Recomendação específica ${hasScientificContext ? 'com citação científica' : 'baseada em biomecânica'}]
2. [Recomendação específica ${hasScientificContext ? 'com citação científica' : 'baseada em biomecânica'}]
3. [Recomendação específica ${hasScientificContext ? 'com citação científica' : 'baseada em biomecânica'}]

DIRETRIZES:
- Use linguagem técnica mas acessível
${hasScientificContext ? '- Cite estudos específicos quando relevante (Autor, Ano)' : '- Baseie-se em princípios biomecânicos estabelecidos'}
- Seja direto e objetivo
- Evite repetições
- Máximo 500 palavras
- NÃO invente dados não fornecidos

COMECE O RELATÓRIO:
`;
  }

  /**
   * Tradução de tipos de desvio para português
   */
  private translateDeviationType(type: string): string {
    const translations: Record<string, string> = {
      knee_valgus: 'Valgo de Joelho (Knee Valgus)',
      butt_wink: 'Retroversão Pélvica (Butt Wink)',
      forward_lean: 'Inclinação Anterior Excessiva',
      heel_rise: 'Elevação dos Calcanhares',
      asymmetric_loading: 'Carga Assimétrica',
      excessive_spinal_flexion: 'Flexão Espinhal Excessiva',
      shoulder_impingement: 'Impacto de Ombro',
      hip_shift: 'Desvio Lateral do Quadril',
    };

    return translations[type] || type;
  }

  /**
   * Tradução de severidade
   */
  private translateSeverity(severity: string): string {
    const translations: Record<string, string> = {
      mild: 'Leve',
      moderate: 'Moderado',
      severe: 'Severo',
    };

    return translations[severity] || severity;
  }

  /**
   * Tradução de classificação
   */
  private translateClassification(classification: string): string {
    const translations: Record<string, string> = {
      EXCELENTE: 'Excelente',
      BOM: 'Bom',
      REGULAR: 'Regular',
      RUIM: 'Ruim',
      'CRÍTICO': 'Crítico',
    };

    return translations[classification] || classification;
  }

  /**
   * Tradução de exercício
   */
  private translateExercise(exerciseId: string): string {
    const translations: Record<string, string> = {
      'back-squat': 'Agachamento Costas (Back Squat)',
      'front-squat': 'Agachamento Frontal (Front Squat)',
      'goblet-squat': 'Agachamento Goblet',
      squat: 'Agachamento',
      deadlift: 'Levantamento Terra (Deadlift)',
      'romanian-deadlift': 'Levantamento Terra Romeno',
      'bench-press': 'Supino',
      'overhead-press': 'Desenvolvimento',
      'military-press': 'Desenvolvimento Militar',
    };

    return translations[exerciseId] || exerciseId;
  }
}
