/**
 * Análise de Vídeo com Vision Models (llama3.2-vision / llava)
 * Extrai frames e analisa com LLM multimodal
 * Suporta vídeos locais e do Supabase Storage
 */

import axios from 'axios';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

const execAsync = promisify(exec);

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const VISION_MODEL = process.env.VISION_MODEL || 'llama3.2-vision:latest';
const VISION_MODEL_FALLBACK = 'llava:latest'; // Fallback se llama3.2-vision não disponível

// Detectar sistema operacional
const isWindows = process.platform === 'win32';

// Caminhos absolutos para ffmpeg/ffprobe no Windows (evita problema com /bin/sh no PATH)
const FFMPEG_BIN = isWindows
  ? (process.env.FFMPEG_PATH || 'C:\\ProgramData\\chocolatey\\bin\\ffmpeg.exe')
  : 'ffmpeg';
const FFPROBE_BIN = isWindows
  ? (process.env.FFPROBE_PATH || 'C:\\ProgramData\\chocolatey\\bin\\ffprobe.exe')
  : 'ffprobe';
const EXEC_OPTIONS = isWindows ? { shell: 'cmd.exe' } : {};

/**
 * Verifica se ffmpeg está instalado
 */
export async function checkFfmpegAvailable(): Promise<boolean> {
  try {
    await execAsync(`"${FFMPEG_BIN}" -version`, EXEC_OPTIONS);
    return true;
  } catch {
    console.warn('⚠️ ffmpeg não encontrado. Instale com: choco install ffmpeg (Windows) ou brew install ffmpeg (Mac)');
    return false;
  }
}

// Supabase client para download de vídeos
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export interface VideoAnalysisOptions {
  videoPath?: string;
  videoUrl?: string; // URL do Supabase Storage ou URL pública
  exerciseType?: string;
  focusAreas?: string[];
  framesCount?: number;
}

/**
 * Baixa vídeo do Supabase Storage para arquivo temporário
 */
export async function downloadVideoFromSupabase(
  videoPath: string,
  outputDir: string
): Promise<string> {
  if (!supabase) {
    throw new Error('Supabase não configurado');
  }

  const bucketName = 'nfv-videos';
  const localPath = path.join(outputDir, `video_${Date.now()}.mp4`);

  console.log(`⬇️ Downloading video from Supabase: ${videoPath}`);

  const { data, error } = await supabase.storage
    .from(bucketName)
    .download(videoPath);

  if (error) {
    throw new Error(`Erro ao baixar vídeo: ${error.message}`);
  }

  // Converter Blob para Buffer e salvar
  const arrayBuffer = await data.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(localPath, buffer);

  console.log(`✅ Video downloaded to: ${localPath}`);
  return localPath;
}

/**
 * Baixa vídeo de URL pública
 */
export async function downloadVideoFromUrl(
  videoUrl: string,
  outputDir: string
): Promise<string> {
  const localPath = path.join(outputDir, `video_${Date.now()}.mp4`);

  console.log(`⬇️ Downloading video from URL: ${videoUrl}`);

  const response = await axios.get(videoUrl, {
    responseType: 'arraybuffer',
    timeout: 120000, // 2 min timeout
  });

  await fs.writeFile(localPath, Buffer.from(response.data));

  console.log(`✅ Video downloaded to: ${localPath}`);
  return localPath;
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
 * Extrai um único frame (fallback quando ffmpeg tem limitações)
 */
export async function extractSingleFrame(
  videoPath: string,
  outputDir: string
): Promise<string | null> {
  try {
    const framePath = path.join(outputDir, 'frame_001.jpg');

    // Tentar extrair frame no segundo 1
    await execAsync(
      `"${FFMPEG_BIN}" -ss 1 -i "${videoPath}" -vframes 1 -q:v 2 "${framePath}" -y`,
      EXEC_OPTIONS
    );

    // Verificar se arquivo foi criado
    await fs.access(framePath);
    return framePath;
  } catch (error) {
    console.error('Erro ao extrair frame único:', error);
    return null;
  }
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
      `"${FFPROBE_BIN}" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`,
      EXEC_OPTIONS
    );

    const duration = parseFloat(durationOutput.trim());
    console.log(`  Video duration: ${duration.toFixed(2)}s`);

    // Calcular intervalo entre frames — divide o vídeo em N+1 segmentos
    // Garante que nenhum frame busca exatamente o final do vídeo (evita EOF error)
    // Exemplo: 48 frames em 80s → interval=1.63s → frames distribuídos de 1.63s até 78.43s
    const interval = duration / (framesCount + 1);

    const framePaths: string[] = [];

    // Extrair frames em momentos específicos
    for (let i = 1; i <= framesCount; i++) {
      const timestamp = interval * i;
      const framePath = path.join(outputDir, `frame_${i.toString().padStart(3, '0')}.jpg`);

      await execAsync(
        `"${FFMPEG_BIN}" -ss ${timestamp} -i "${videoPath}" -vframes 1 -q:v 2 "${framePath}" -y`,
        EXEC_OPTIONS
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
  frameNumber: number,
  modelOverride?: string
): Promise<FrameAnalysis> {
  console.log(`🔍 Analyzing frame ${frameNumber}...`);

  try {
    // Converter imagem para base64
    const imageBase64 = await imageToBase64(imagePath);

    // Determinar qual modelo usar
    const modelToUse = modelOverride || await getBestVisionModel() || VISION_MODEL;
    console.log(`   Using model: ${modelToUse}`);

    // Chamar Ollama Vision API
    const response = await axios.post(
      `${OLLAMA_URL}/api/generate`,
      {
        model: modelToUse,
        prompt,
        images: [imageBase64],
        stream: false,
        options: {
          temperature: 0.3,
          num_predict: 300,
        },
      },
      {
        timeout: 120000, // 2 min timeout (modelos de visão são mais lentos)
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
 * Suporta videoPath local ou videoUrl do Supabase/URL pública
 */
export async function analyzeExerciseVideo(
  options: VideoAnalysisOptions
): Promise<VideoAnalysisResult> {
  const {
    videoPath,
    videoUrl,
    exerciseType = 'exercício',
    focusAreas = ['técnica geral', 'postura', 'amplitude'],
    framesCount = 8,
  } = options;

  console.log(`🎥 Starting video analysis: ${exerciseType}`);

  // 1. Criar diretório temporário para frames e downloads
  const tempDir = path.join(process.cwd(), 'temp', `analysis_${Date.now()}`);

  try {
    await fs.mkdir(tempDir, { recursive: true });

    // 2. Obter path do vídeo (baixar se necessário)
    let localVideoPath: string | undefined;

    // Verificar se videoPath é um arquivo local que existe
    if (videoPath) {
      try {
        await fs.access(videoPath);
        localVideoPath = videoPath;
        console.log(`📁 Using local video file: ${videoPath}`);
      } catch {
        // videoPath não é um arquivo local — é um path no Supabase Storage
        console.log(`☁️ videoPath "${videoPath}" is not a local file, downloading from storage...`);
        localVideoPath = await downloadVideoFromSupabase(videoPath, tempDir);
      }
    }

    // Se não conseguiu via videoPath, tentar via videoUrl
    if (!localVideoPath && videoUrl) {
      if (videoUrl.includes('supabase') || videoUrl.startsWith(supabaseUrl || '')) {
        const urlPath = videoUrl.split('/nfv-videos/')[1] || videoUrl;
        localVideoPath = await downloadVideoFromSupabase(urlPath, tempDir);
      } else {
        localVideoPath = await downloadVideoFromUrl(videoUrl, tempDir);
      }
    }

    if (!localVideoPath) {
      throw new Error('videoPath ou videoUrl é obrigatório');
    }

    // 3. Verificar se ffmpeg está disponível
    const ffmpegAvailable = await checkFfmpegAvailable();

    let framePaths: string[] = [];

    if (ffmpegAvailable) {
      // 4. Extrair frames do vídeo com ffmpeg
      framePaths = await extractFrames(localVideoPath, tempDir, framesCount);
    } else {
      // Fallback: Usar thumbnail se disponível, ou analisar primeiro frame
      console.log('⚠️ ffmpeg não disponível. Tentando análise com frame único...');

      // Tentar extrair um único frame de forma alternativa
      try {
        const singleFramePath = await extractSingleFrame(localVideoPath, tempDir);
        if (singleFramePath) {
          framePaths = [singleFramePath];
        }
      } catch (frameError) {
        console.warn('Não foi possível extrair frame:', frameError);
      }

      if (framePaths.length === 0) {
        throw new Error('ffmpeg não instalado. Instale com: choco install ffmpeg (Windows) ou brew install ffmpeg (Mac)');
      }
    }

    // 4. Obter melhor modelo de visão disponível
    const visionModel = await getBestVisionModel();
    if (!visionModel) {
      throw new Error('Nenhum modelo de visão disponível. Execute: ollama pull llama3.2-vision');
    }
    console.log(`🤖 Using vision model: ${visionModel}`);

    // 5. Preparar prompt
    const prompt = `Você é um especialista em biomecânica analisando um vídeo de ${exerciseType}.

Analise este frame e identifique:
- Técnica e execução
- Postura e alinhamento
- Possíveis compensações
- Pontos de atenção
- Aspectos positivos

Áreas de foco: ${focusAreas.join(', ')}

Seja objetivo e técnico. Mencione APENAS o que você vê neste frame específico.`;

    // 6. Analisar cada frame
    const frameAnalyses: FrameAnalysis[] = [];

    for (let i = 0; i < framePaths.length; i++) {
      const analysis = await analyzeFrame(framePaths[i], prompt, i + 1, visionModel);

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
 * Verifica se Vision Model está disponível e retorna qual usar
 */
export async function checkVisionModelAvailable(): Promise<boolean> {
  try {
    const response = await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 5000 });
    const models = response.data.models || [];
    const modelNames = models.map((m: any) => m.name);

    // Verificar modelo primário ou fallback
    const hasVisionModel = modelNames.includes(VISION_MODEL) ||
                          modelNames.includes('llama3.2-vision') ||
                          modelNames.includes(VISION_MODEL_FALLBACK) ||
                          modelNames.includes('llava');

    if (hasVisionModel) {
      console.log('✅ Vision model disponível:', modelNames.filter((n: string) =>
        n.includes('vision') || n.includes('llava')
      ));
    }

    return hasVisionModel;
  } catch (error) {
    console.error('❌ Error checking vision model:', error);
    return false;
  }
}

/**
 * Retorna o melhor modelo de visão disponível
 */
export async function getBestVisionModel(): Promise<string | null> {
  try {
    const response = await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 5000 });
    const models = response.data.models || [];
    const modelNames = models.map((m: any) => m.name);

    // Ordem de preferência
    const preferredModels = [
      'llama3.2-vision:latest',
      'llama3.2-vision',
      'llava:latest',
      'llava',
    ];

    for (const model of preferredModels) {
      if (modelNames.includes(model)) {
        return model;
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}
