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
    cotovelo_esq_graus: number;
    cotovelo_dir_graus: number;
    ombro_flexao_graus: number;
    lombar_flexao_graus: number;
  };
  alinhamentos: {
    joelhos_sobre_pes: boolean;
    joelho_esq_valgo: boolean;
    joelho_dir_valgo: boolean;
    coluna_neutra: boolean;
    peso_nos_calcanhares: boolean;
    escapulas_retraidas: boolean;
    tronco_estavel: boolean;
  };
  desvios_criticos: string[];
  score: number;
  justificativa: string;
}

const VISION_PROMPT_TEMPLATE = (frameNumber: number, totalFrames: number, exerciseType: string) => `
Você é um biomecânico PhD especializado em análise de movimento.

Analise este frame ${frameNumber}/${totalFrames} de um exercício: ${exerciseType}.

Retorne APENAS JSON válido com esta estrutura exata:

{
  "fase": "excentrica" | "isometrica" | "concentrica",
  "angulos_aproximados": {
    "joelho_esq_graus": 90,
    "joelho_dir_graus": 92,
    "flexao_quadril_graus": 85,
    "inclinacao_tronco_graus": 15,
    "cotovelo_esq_graus": 160,
    "cotovelo_dir_graus": 160,
    "ombro_flexao_graus": 30,
    "lombar_flexao_graus": 10
  },
  "alinhamentos": {
    "joelhos_sobre_pes": true,
    "joelho_esq_valgo": false,
    "joelho_dir_valgo": false,
    "coluna_neutra": true,
    "peso_nos_calcanhares": true,
    "escapulas_retraidas": false,
    "tronco_estavel": true
  },
  "desvios_criticos": [
    "Valgo dinâmico de joelho esquerdo de ~10°"
  ],
  "score": 7,
  "justificativa": "Breve justificativa técnica do score"
}

REGRAS:
- Estime TODOS os ângulos visualmente baseado na imagem
- joelho: ângulo entre coxa e perna (180° = estendido, 90° = flexionado)
- quadril: ângulo de flexão do quadril (180° = em pé, 90° = sentado)
- tronco: inclinação do tronco em relação à vertical (0° = ereto)
- cotovelo: ângulo do cotovelo (180° = estendido, 90° = flexionado)
- ombro: flexão do ombro (0° = braço ao lado, 90° = braço à frente, 180° = acima)
- lombar: flexão lombar em relação à posição neutra (0° = neutra)
- Se algum ângulo NÃO é visível, use -1
- Score de 1-10 baseado na qualidade técnica do ${exerciseType}
- RETORNE APENAS O JSON
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
  const faseDefault = frameNumber <= 2 ? 'excentrica' : frameNumber <= 4 ? 'isometrica' : 'concentrica';
  const a = data.angulos_aproximados || {};
  const al = data.alinhamentos || {};

  return {
    fase: data.fase || faseDefault,
    angulos_aproximados: {
      joelho_esq_graus: validAngle(a.joelho_esq_graus, -1),
      joelho_dir_graus: validAngle(a.joelho_dir_graus, -1),
      flexao_quadril_graus: validAngle(a.flexao_quadril_graus, -1),
      inclinacao_tronco_graus: validAngle(a.inclinacao_tronco_graus, -1),
      cotovelo_esq_graus: validAngle(a.cotovelo_esq_graus, -1),
      cotovelo_dir_graus: validAngle(a.cotovelo_dir_graus, -1),
      ombro_flexao_graus: validAngle(a.ombro_flexao_graus, -1),
      lombar_flexao_graus: validAngle(a.lombar_flexao_graus, -1),
    },
    alinhamentos: {
      joelhos_sobre_pes: al.joelhos_sobre_pes ?? true,
      joelho_esq_valgo: al.joelho_esq_valgo ?? false,
      joelho_dir_valgo: al.joelho_dir_valgo ?? false,
      coluna_neutra: al.coluna_neutra ?? true,
      peso_nos_calcanhares: al.peso_nos_calcanhares ?? true,
      escapulas_retraidas: al.escapulas_retraidas ?? false,
      tronco_estavel: al.tronco_estavel ?? true,
    },
    desvios_criticos: Array.isArray(data.desvios_criticos) ? data.desvios_criticos : [],
    score: typeof data.score === 'number' ? Math.min(10, Math.max(1, data.score)) : 7,
    justificativa: data.justificativa || 'Análise automática',
  };
}

function validAngle(v: any, fallback: number): number {
  if (typeof v === 'number' && v >= -1 && v <= 360) return v;
  return fallback;
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
      joelho_esq_graus: -1,
      joelho_dir_graus: -1,
      flexao_quadril_graus: -1,
      inclinacao_tronco_graus: -1,
      cotovelo_esq_graus: -1,
      cotovelo_dir_graus: -1,
      ombro_flexao_graus: -1,
      lombar_flexao_graus: -1,
    },
    alinhamentos: {
      joelhos_sobre_pes: true,
      joelho_esq_valgo: false,
      joelho_dir_valgo: false,
      coluna_neutra: true,
      peso_nos_calcanhares: true,
      escapulas_retraidas: false,
      tronco_estavel: true,
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
