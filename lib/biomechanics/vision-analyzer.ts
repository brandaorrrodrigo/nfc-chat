/**
 * Biomechanics Vision Analyzer
 * Usa Llama 3.2-Vision para análise de frames com retorno JSON estruturado
 */

import axios from 'axios';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const VISION_MODEL = 'llama3.2-vision:latest';

export interface FrameAnalysis {
  fase: 'excentrica' | 'isometrica' | 'concentrica';
  angulos_aproximados: {
    joelho_esq_graus: number;
    joelho_dir_graus: number;
    flexao_quadril_graus: number;
    inclinacao_tronco_graus: number;
  };
  alinhamentos: {
    joelhos_sobre_pes: boolean;
    joelho_esq_valgo: boolean;
    joelho_dir_valgo: boolean;
    coluna_neutra: boolean;
    peso_nos_calcanhares: boolean;
  };
  desvios_criticos: string[];
  score: number;
  justificativa: string;
}

const VISION_PROMPT_TEMPLATE = (frameNumber: number, totalFrames: number, exerciseType: string) => `
Você é um biomecânico PhD especializado em análise de movimento.

Analise este frame ${frameNumber}/${totalFrames} de um ${exerciseType}.

Retorne APENAS JSON válido com esta estrutura exata:

{
  "fase": "excentrica" | "isometrica" | "concentrica",
  "angulos_aproximados": {
    "joelho_esq_graus": 90,
    "joelho_dir_graus": 92,
    "flexao_quadril_graus": 85,
    "inclinacao_tronco_graus": 15
  },
  "alinhamentos": {
    "joelhos_sobre_pes": true,
    "joelho_esq_valgo": false,
    "joelho_dir_valgo": false,
    "coluna_neutra": true,
    "peso_nos_calcanhares": true
  },
  "desvios_criticos": [
    "Valgo dinâmico de joelho esquerdo de ~10°"
  ],
  "score": 7,
  "justificativa": "Profundidade adequada mas joelho esquerdo colapsa medialmente"
}

IMPORTANTE:
- Estime os ângulos visualmente (não precisa ser exato)
- Liste APENAS desvios que você consegue VER claramente na imagem
- Score de 1-10 baseado na qualidade técnica
- RETORNE APENAS O JSON, sem texto antes ou depois
`;

export async function analyzeFrameWithVision(
  frameImageBase64: string,
  frameNumber: number,
  totalFrames: number,
  exerciseType: string = 'agachamento'
): Promise<FrameAnalysis> {
  const prompt = VISION_PROMPT_TEMPLATE(frameNumber, totalFrames, exerciseType);

  try {
    const response = await axios.post(
      `${OLLAMA_URL}/api/generate`,
      {
        model: VISION_MODEL,
        prompt,
        images: [frameImageBase64],
        stream: false,
        options: {
          temperature: 0.1, // Baixa para respostas consistentes
          num_predict: 500,
        },
      },
      { timeout: 120000 }
    );

    const analysisText = response.data.response || '';

    // Tentar extrair JSON da resposta
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.warn(`Frame ${frameNumber}: Vision model não retornou JSON válido`);
      return createFallbackAnalysis(frameNumber, totalFrames);
    }

    try {
      const parsed = JSON.parse(jsonMatch[0]);
      return validateAndNormalizeAnalysis(parsed, frameNumber);
    } catch (parseError) {
      console.warn(`Frame ${frameNumber}: Erro ao parsear JSON:`, parseError);
      return createFallbackAnalysis(frameNumber, totalFrames);
    }
  } catch (error: any) {
    console.error(`Frame ${frameNumber}: Erro na chamada Vision:`, error.message);
    return createFallbackAnalysis(frameNumber, totalFrames);
  }
}

function validateAndNormalizeAnalysis(data: any, frameNumber: number): FrameAnalysis {
  // Determinar fase baseado no número do frame se não vier no JSON
  const faseDefault = frameNumber <= 2 ? 'excentrica' : frameNumber <= 4 ? 'isometrica' : 'concentrica';

  return {
    fase: data.fase || faseDefault,
    angulos_aproximados: {
      joelho_esq_graus: data.angulos_aproximados?.joelho_esq_graus || 90,
      joelho_dir_graus: data.angulos_aproximados?.joelho_dir_graus || 90,
      flexao_quadril_graus: data.angulos_aproximados?.flexao_quadril_graus || 85,
      inclinacao_tronco_graus: data.angulos_aproximados?.inclinacao_tronco_graus || 15,
    },
    alinhamentos: {
      joelhos_sobre_pes: data.alinhamentos?.joelhos_sobre_pes ?? true,
      joelho_esq_valgo: data.alinhamentos?.joelho_esq_valgo ?? false,
      joelho_dir_valgo: data.alinhamentos?.joelho_dir_valgo ?? false,
      coluna_neutra: data.alinhamentos?.coluna_neutra ?? true,
      peso_nos_calcanhares: data.alinhamentos?.peso_nos_calcanhares ?? true,
    },
    desvios_criticos: Array.isArray(data.desvios_criticos) ? data.desvios_criticos : [],
    score: typeof data.score === 'number' ? Math.min(10, Math.max(1, data.score)) : 7,
    justificativa: data.justificativa || 'Análise automática',
  };
}

function createFallbackAnalysis(frameNumber: number, totalFrames: number): FrameAnalysis {
  const fase = frameNumber <= Math.floor(totalFrames / 3)
    ? 'excentrica'
    : frameNumber <= Math.floor((totalFrames * 2) / 3)
    ? 'isometrica'
    : 'concentrica';

  return {
    fase,
    angulos_aproximados: {
      joelho_esq_graus: 90,
      joelho_dir_graus: 90,
      flexao_quadril_graus: 85,
      inclinacao_tronco_graus: 15,
    },
    alinhamentos: {
      joelhos_sobre_pes: true,
      joelho_esq_valgo: false,
      joelho_dir_valgo: false,
      coluna_neutra: true,
      peso_nos_calcanhares: true,
    },
    desvios_criticos: [],
    score: 7,
    justificativa: 'Análise não conclusiva - revisar manualmente',
  };
}

export async function analyzeAllFrames(
  framesBase64: string[],
  exerciseType: string = 'agachamento'
): Promise<FrameAnalysis[]> {
  const results: FrameAnalysis[] = [];

  for (let i = 0; i < framesBase64.length; i++) {
    console.log(`   Analisando frame ${i + 1}/${framesBase64.length}...`);
    const analysis = await analyzeFrameWithVision(
      framesBase64[i],
      i + 1,
      framesBase64.length,
      exerciseType
    );
    results.push(analysis);

    // Delay entre frames para não sobrecarregar
    if (i < framesBase64.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return results;
}
