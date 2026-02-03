/**
 * Análise de Vídeo com Vision Models (llama3.2-vision / llava)
 * Extrai frames e analisa com LLM multimodal
 */

import axios from 'axios';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const VISION_MODEL = process.env.VISION_MODEL || 'llama3.2-vision:latest';

export interface VideoAnalysisOptions {
  videoPath: string;
  exerciseType?: string;
  focusAreas?: string[];
  framesCount?: number;
}

export interface FrameAnalysis {
  frameNumber: number;
  timestamp: number;
  analysis: string;
  issues: string[];
  score: number;
}

export interface VideoAnalysisResult {
  exerciseType: string;
  overallScore: number;
  frames: FrameAnalysis[];
  summary: string;
  recommendations: string[];
  technicalIssues: string[];
}

/**
 * Extrai frames de um vídeo usando ffmpeg
 */
export async function extractFrames(
  videoPath: string,
  outputDir: string,
  framesCount: number = 10
): Promise<string[]> {
  console.log(`🎬 Extracting ${framesCount} frames from video...`);

  try {
    // Criar diretório de output
    await fs.mkdir(outputDir, { recursive: true });

    // Obter duração do vídeo
    const { stdout: durationOutput } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`
    );

    const duration = parseFloat(durationOutput.trim());
    console.log(`  Video duration: ${duration.toFixed(2)}s`);

    // Calcular intervalo entre frames
    const interval = duration / (framesCount + 1);

    const framePaths: string[] = [];

    // Extrair frames em momentos específicos
    for (let i = 1; i <= framesCount; i++) {
      const timestamp = interval * i;
      const framePath = path.join(outputDir, `frame_${i.toString().padStart(3, '0')}.jpg`);

      await execAsync(
        `ffmpeg -ss ${timestamp} -i "${videoPath}" -vframes 1 -q:v 2 "${framePath}" -y`
      );

      framePaths.push(framePath);
    }

    console.log(`✅ Extracted ${framePaths.length} frames`);
    return framePaths;
  } catch (error: any) {
    console.error('❌ Error extracting frames:', error.message);
    throw new Error(`Failed to extract frames: ${error.message}`);
  }
}

/**
 * Converte imagem para base64
 */
async function imageToBase64(imagePath: string): Promise<string> {
  const buffer = await fs.readFile(imagePath);
  return buffer.toString('base64');
}

/**
 * Analisa um frame com Vision Model
 */
export async function analyzeFrame(
  imagePath: string,
  prompt: string,
  frameNumber: number
): Promise<FrameAnalysis> {
  console.log(`🔍 Analyzing frame ${frameNumber}...`);

  try {
    // Converter imagem para base64
    const imageBase64 = await imageToBase64(imagePath);

    // Chamar Ollama Vision API
    const response = await axios.post(
      `${OLLAMA_URL}/api/generate`,
      {
        model: VISION_MODEL,
        prompt,
        images: [imageBase64],
        stream: false,
        options: {
          temperature: 0.3,
          num_predict: 300,
        },
      },
      {
        timeout: 60000, // 1 min timeout
      }
    );

    const analysis = response.data.response || '';

    // Extrair issues mencionados
    const issues: string[] = [];
    const lowerAnalysis = analysis.toLowerCase();

    const issueKeywords = [
      'problema',
      'erro',
      'incorreto',
      'compensação',
      'valgo',
      'arredondamento',
      'inclinação excessiva',
      'falta de',
    ];

    issueKeywords.forEach((keyword) => {
      if (lowerAnalysis.includes(keyword)) {
        // Extrair frase contendo o keyword
        const sentences = analysis.split(/[.!?]/);
        const issueSentence = sentences.find((s) =>
          s.toLowerCase().includes(keyword)
        );
        if (issueSentence) {
          issues.push(issueSentence.trim());
        }
      }
    });

    // Calcular score básico (0-10)
    const score = calculateFrameScore(analysis, issues.length);

    return {
      frameNumber,
      timestamp: 0, // Será calculado depois
      analysis,
      issues,
      score,
    };
  } catch (error: any) {
    console.error(`❌ Error analyzing frame ${frameNumber}:`, error.message);

    return {
      frameNumber,
      timestamp: 0,
      analysis: 'Erro ao analisar frame',
      issues: [],
      score: 5,
    };
  }
}

/**
 * Calcula score de um frame (0-10)
 */
function calculateFrameScore(analysis: string, issuesCount: number): number {
  let score = 10;

  // Penalizar por issues
  score -= issuesCount * 1.5;

  // Bônus se mencionar execução correta
  if (analysis.toLowerCase().includes('correto') || analysis.toLowerCase().includes('boa')) {
    score += 1;
  }

  // Penalizar se mencionar "grave" ou "severo"
  if (analysis.toLowerCase().includes('grave') || analysis.toLowerCase().includes('severo')) {
    score -= 2;
  }

  return Math.max(0, Math.min(10, score));
}

/**
 * Analisa vídeo completo de exercício
 */
export async function analyzeExerciseVideo(
  options: VideoAnalysisOptions
): Promise<VideoAnalysisResult> {
  const {
    videoPath,
    exerciseType = 'exercício',
    focusAreas = ['técnica geral', 'postura', 'amplitude'],
    framesCount = 8,
  } = options;

  console.log(`🎥 Starting video analysis: ${exerciseType}`);

  try {
    // 1. Criar diretório temporário para frames
    const tempDir = path.join(process.cwd(), 'temp', `analysis_${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });

    // 2. Extrair frames
    const framePaths = await extractFrames(videoPath, tempDir, framesCount);

    // 3. Preparar prompt
    const prompt = `Você é um especialista em biomecânica analisando um vídeo de ${exerciseType}.

Analise este frame e identifique:
- Técnica e execução
- Postura e alinhamento
- Possíveis compensações
- Pontos de atenção
- Aspectos positivos

Áreas de foco: ${focusAreas.join(', ')}

Seja objetivo e técnico. Mencione APENAS o que você vê neste frame específico.`;

    // 4. Analisar cada frame
    const frameAnalyses: FrameAnalysis[] = [];

    for (let i = 0; i < framePaths.length; i++) {
      const analysis = await analyzeFrame(framePaths[i], prompt, i + 1);

      // Calcular timestamp
      const videoDuration = 10; // Placeholder - seria calculado com ffprobe
      analysis.timestamp = (videoDuration / (framesCount + 1)) * (i + 1);

      frameAnalyses.push(analysis);

      // Delay para não sobrecarregar
      if (i < framePaths.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    // 5. Calcular score geral
    const overallScore =
      frameAnalyses.reduce((sum, f) => sum + f.score, 0) / frameAnalyses.length;

    // 6. Extrair issues técnicos únicos
    const allIssues = frameAnalyses.flatMap((f) => f.issues);
    const technicalIssues = [...new Set(allIssues)];

    // 7. Gerar recomendações
    const recommendations = generateRecommendations(technicalIssues, overallScore);

    // 8. Gerar sumário
    const summary = generateSummary(exerciseType, overallScore, technicalIssues.length);

    // 9. Limpar arquivos temporários
    try {
      await fs.rm(tempDir, { recursive: true });
    } catch (error) {
      console.warn('Failed to clean temp files:', error);
    }

    console.log(`✅ Video analysis complete (score: ${overallScore.toFixed(1)}/10)`);

    return {
      exerciseType,
      overallScore,
      frames: frameAnalyses,
      summary,
      recommendations,
      technicalIssues,
    };
  } catch (error: any) {
    console.error('❌ Video analysis failed:', error.message);
    throw error;
  }
}

/**
 * Gera recomendações baseadas nos issues
 */
function generateRecommendations(issues: string[], score: number): string[] {
  const recommendations: string[] = [];

  if (score >= 8) {
    recommendations.push('Execução está boa! Continue focando na técnica.');
  } else if (score >= 6) {
    recommendations.push('Técnica adequada, mas há pontos para melhorar.');
  } else {
    recommendations.push('Recomendado focar na correção técnica antes de aumentar carga.');
  }

  if (issues.length > 0) {
    recommendations.push('Revise os pontos técnicos identificados em cada frame.');
  }

  if (issues.some((i) => i.toLowerCase().includes('postura'))) {
    recommendations.push('Trabalhe consciência postural antes de executar o movimento.');
  }

  if (issues.some((i) => i.toLowerCase().includes('amplitude'))) {
    recommendations.push('Foque em amplitude de movimento completa e controlada.');
  }

  return recommendations;
}

/**
 * Gera sumário da análise
 */
function generateSummary(exerciseType: string, score: number, issuesCount: number): string {
  if (score >= 8) {
    return `Análise de ${exerciseType}: Execução técnica de alta qualidade. ${issuesCount === 0 ? 'Nenhum issue detectado.' : `${issuesCount} pontos de atenção identificados.`}`;
  } else if (score >= 6) {
    return `Análise de ${exerciseType}: Execução adequada com ${issuesCount} pontos para melhoria. Continue praticando com atenção à técnica.`;
  } else {
    return `Análise de ${exerciseType}: Execução precisa de correções técnicas. ${issuesCount} issues identificados que podem comprometer resultado ou causar lesão.`;
  }
}

/**
 * Verifica se Vision Model está disponível
 */
export async function checkVisionModelAvailable(): Promise<boolean> {
  try {
    const response = await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 5000 });
    const models = response.data.models || [];
    return models.some((m: any) => m.name === VISION_MODEL);
  } catch (error) {
    console.error('❌ Error checking vision model:', error);
    return false;
  }
}
