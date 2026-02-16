/**
 * Serviço de Extração de Vídeo
 *
 * Extrai frames de vídeos MP4/WebM usando FFmpeg
 * e fornece utilitários para manipulação de vídeo.
 */

import ffmpeg from 'fluent-ffmpeg';
import { createCanvas, loadImage, Image } from 'canvas';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import * as tf from '@tensorflow/tfjs';

const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);
const rmdir = promisify(fs.rmdir);
const stat = promisify(fs.stat);

/**
 * Metadados de um vídeo
 */
export interface VideoMetadata {
  /** Duração em segundos */
  duration: number;
  /** Frames por segundo */
  fps: number;
  /** Largura em pixels */
  width: number;
  /** Altura em pixels */
  height: number;
  /** Número total de frames */
  frameCount: number;
  /** Codec de vídeo */
  codec?: string;
  /** Bitrate */
  bitrate?: number;
}

/**
 * Opções para extração de frames
 */
export interface ExtractionOptions {
  /** Diretório de saída para frames */
  outputDir: string;
  /** FPS de saída (default: fps original) */
  fps?: number;
  /** Limite máximo de frames */
  maxFrames?: number;
  /** Formato de saída */
  format?: 'png' | 'jpg';
  /** Qualidade JPEG (1-100, apenas para jpg) */
  quality?: number;
  /** Callback de progresso (0-100) */
  onProgress?: (progress: number) => void;
}

/**
 * Serviço de extração de vídeo
 */
class VideoExtractionService {
  /**
   * Obtém metadados de um vídeo
   * @param videoPath - Caminho do vídeo
   * @returns Metadados do vídeo
   */
  async getVideoMetadata(videoPath: string): Promise<VideoMetadata> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(videoPath, (err, metadata) => {
        if (err) {
          reject(new Error(`Erro ao ler metadados: ${err.message}`));
          return;
        }

        try {
          const videoStream = metadata.streams.find(
            (s) => s.codec_type === 'video'
          );

          if (!videoStream) {
            reject(new Error('Nenhum stream de vídeo encontrado'));
            return;
          }

          const duration = parseFloat(String(metadata.format.duration || '0'));
          const fps = this.parseFps(videoStream.r_frame_rate || '30/1');
          const width = videoStream.width || 0;
          const height = videoStream.height || 0;
          const frameCount = Math.floor(duration * fps);

          resolve({
            duration,
            fps,
            width,
            height,
            frameCount,
            codec: videoStream.codec_name,
            bitrate: parseInt(String(metadata.format.bit_rate || '0'), 10)
          });
        } catch (error) {
          reject(new Error(`Erro ao parsear metadados: ${(error as Error).message}`));
        }
      });
    });
  }

  /**
   * Parse de frame rate (converte fração para decimal)
   * @param fpsString - String no formato "30/1" ou "30"
   * @returns FPS em decimal
   * @private
   */
  private parseFps(fpsString: string): number {
    if (fpsString.includes('/')) {
      const [num, den] = fpsString.split('/').map(Number);
      return num / den;
    }
    return parseFloat(fpsString);
  }

  /**
   * Extrai frames de um vídeo
   * @param videoPath - Caminho do vídeo
   * @param options - Opções de extração
   * @returns Array com paths dos frames extraídos
   */
  async extractFrames(
    videoPath: string,
    options: ExtractionOptions
  ): Promise<string[]> {
    // Validar se vídeo existe
    if (!fs.existsSync(videoPath)) {
      throw new Error(`Vídeo não encontrado: ${videoPath}`);
    }

    // Obter metadados
    const metadata = await this.getVideoMetadata(videoPath);

    // Criar diretório de saída se não existir
    await this.ensureDir(options.outputDir);

    // Determinar FPS de saída
    const outputFps = options.fps || metadata.fps;

    // Determinar formato
    const format = options.format || 'png';

    // Calcular número de frames a extrair
    const totalFrames = options.maxFrames
      ? Math.min(options.maxFrames, metadata.frameCount)
      : metadata.frameCount;

    console.log(`📹 Extraindo frames de ${videoPath}`);
    console.log(`   FPS: ${outputFps} | Formato: ${format} | Total: ${totalFrames}`);

    return new Promise((resolve, reject) => {
      const framePaths: string[] = [];
      let lastProgress = 0;

      const command = ffmpeg(videoPath)
        .fps(outputFps)
        .output(path.join(options.outputDir, `frame-%04d.${format}`));

      // Configurar qualidade para JPEG
      if (format === 'jpg' && options.quality) {
        command.outputOptions([`-q:v ${Math.round((100 - options.quality) / 10)}`]);
      }

      // Limitar número de frames se especificado
      if (options.maxFrames) {
        command.outputOptions([`-frames:v ${options.maxFrames}`]);
      }

      // Callback de progresso
      command.on('progress', (progress) => {
        if (options.onProgress && progress.percent) {
          const currentProgress = Math.round(progress.percent);
          if (currentProgress > lastProgress) {
            lastProgress = currentProgress;
            options.onProgress(currentProgress);
          }
        }
      });

      // Callback de conclusão
      command.on('end', async () => {
        try {
          // Listar frames extraídos
          const files = await readdir(options.outputDir);
          const frameFiles = files
            .filter((f) => f.endsWith(`.${format}`))
            .sort();

          for (const file of frameFiles) {
            framePaths.push(path.join(options.outputDir, file));
          }

          console.log(`✅ ${framePaths.length} frames extraídos`);
          resolve(framePaths);
        } catch (error) {
          reject(error);
        }
      });

      // Callback de erro
      command.on('error', (err) => {
        reject(new Error(`Erro ao extrair frames: ${err.message}`));
      });

      // Executar
      command.run();
    });
  }

  /**
   * Extrai frame em timestamp específico
   * @param videoPath - Caminho do vídeo
   * @param timestamp - Timestamp em segundos
   * @returns ImageData do frame
   */
  async extractFrameAtTimestamp(
    videoPath: string,
    timestamp: number
  ): Promise<any> {
    // Criar diretório temporário
    const tempDir = path.join('/tmp', `nfv-frame-${Date.now()}`);
    await this.ensureDir(tempDir);

    try {
      // Extrair frame único
      const outputPath = path.join(tempDir, 'frame.png');

      await new Promise<void>((resolve, reject) => {
        ffmpeg(videoPath)
          .seekInput(timestamp)
          .frames(1)
          .output(outputPath)
          .on('end', () => resolve())
          .on('error', (err) => reject(err))
          .run();
      });

      // Carregar imagem
      const image = await loadImage(outputPath);

      // Converter para ImageData
      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0);

      const imageData = ctx.getImageData(0, 0, image.width, image.height);

      // Cleanup
      await this.cleanupFrames(tempDir);

      // Converter para Tensor3D que TensorFlow.js aceita
      const tensor = tf.browser.fromPixels({
        data: new Uint8Array(imageData.data),
        width: imageData.width,
        height: imageData.height
      } as any, 3);

      return tensor;
    } catch (error) {
      // Cleanup em caso de erro
      await this.cleanupFrames(tempDir).catch(() => {});
      throw error;
    }
  }

  /**
   * Carrega frame como ImageData
   * @param framePath - Caminho do frame
   * @returns ImageData (ou Tensor3D compatível)
   */
  async loadFrameAsImageData(framePath: string): Promise<any> {
    const image = await loadImage(framePath);

    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, image.width, image.height);

    // Converter para Tensor3D que TensorFlow.js aceita
    // Reshape de [width * height * 4] para [height, width, 4] e depois para RGB [height, width, 3]
    const tensor = tf.browser.fromPixels({
      data: new Uint8Array(imageData.data),
      width: imageData.width,
      height: imageData.height
    } as any, 3);

    return tensor;
  }

  /**
   * Carrega frame como Image (canvas)
   * @param framePath - Caminho do frame
   * @returns Image
   */
  async loadFrameAsImage(framePath: string): Promise<Image> {
    return loadImage(framePath);
  }

  /**
   * Remove frames extraídos e diretório
   * @param frameDir - Diretório com frames
   */
  async cleanupFrames(frameDir: string): Promise<void> {
    try {
      if (!fs.existsSync(frameDir)) {
        return;
      }

      const files = await readdir(frameDir);

      // Deletar todos os arquivos
      for (const file of files) {
        const filePath = path.join(frameDir, file);
        await unlink(filePath);
      }

      // Remover diretório
      await rmdir(frameDir);

      console.log(`🗑️  Cleanup: ${files.length} frames removidos`);
    } catch (error) {
      console.error('⚠️  Erro ao limpar frames:', error);
    }
  }

  /**
   * Garante que diretório existe (cria se necessário)
   * @param dir - Caminho do diretório
   * @private
   */
  private async ensureDir(dir: string): Promise<void> {
    try {
      await stat(dir);
    } catch {
      await mkdir(dir, { recursive: true });
    }
  }

  /**
   * Gera thumbnail de um vídeo
   * @param videoPath - Caminho do vídeo
   * @param timestamp - Timestamp em segundos (default: meio do vídeo)
   * @param outputPath - Caminho de saída do thumbnail
   * @returns Caminho do thumbnail gerado
   */
  async generateThumbnail(
    videoPath: string,
    timestamp?: number,
    outputPath?: string
  ): Promise<string> {
    // Obter metadados para calcular meio do vídeo
    const metadata = await this.getVideoMetadata(videoPath);
    const seekTime = timestamp !== undefined ? timestamp : metadata.duration / 2;

    // Gerar path de saída se não fornecido
    const thumbnailPath =
      outputPath ||
      path.join(
        path.dirname(videoPath),
        `${path.basename(videoPath, path.extname(videoPath))}_thumb.jpg`
      );

    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .seekInput(seekTime)
        .frames(1)
        .size('320x?') // Largura 320, altura proporcional
        .output(thumbnailPath)
        .on('end', () => {
          console.log(`✅ Thumbnail gerado: ${thumbnailPath}`);
          resolve(thumbnailPath);
        })
        .on('error', (err) => reject(err))
        .run();
    });
  }

  /**
   * Verifica se um arquivo é um vídeo válido
   * @param filePath - Caminho do arquivo
   * @returns true se é vídeo válido
   */
  async isValidVideo(filePath: string): Promise<boolean> {
    try {
      await this.getVideoMetadata(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Obtém tamanho de arquivo em MB
   * @param filePath - Caminho do arquivo
   * @returns Tamanho em MB
   */
  async getFileSize(filePath: string): Promise<number> {
    const stats = await stat(filePath);
    return stats.size / (1024 * 1024); // bytes para MB
  }
}

/**
 * Instância singleton do serviço de extração de vídeo
 */
export const videoExtractionService = new VideoExtractionService();
