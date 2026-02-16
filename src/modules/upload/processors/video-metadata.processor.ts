import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface VideoMetadata {
  duration: number;        // segundos
  width: number;
  height: number;
  fps: number;
  codec: string;
  bitrate: number;         // kbps
  size: number;            // bytes
  format: string;
}

@Injectable()
export class VideoMetadataProcessor {
  private readonly logger = new Logger(VideoMetadataProcessor.name);

  async extractMetadata(videoPath: string): Promise<VideoMetadata> {
    try {
      // Comando FFprobe para extrair todos os metadados
      const command = `ffprobe -v quiet -print_format json -show_format -show_streams "${videoPath}"`;

      const { stdout } = await execAsync(command);
      const data = JSON.parse(stdout);

      const videoStream = data.streams.find((s: any) => s.codec_type === 'video');

      if (!videoStream) {
        throw new Error('Stream de vídeo não encontrado');
      }

      const result: VideoMetadata = {
        duration: parseFloat(data.format.duration) || 0,
        width: videoStream.width || 0,
        height: videoStream.height || 0,
        fps: this.parseFps(videoStream.r_frame_rate || '0/1'),
        codec: videoStream.codec_name || 'unknown',
        bitrate: Math.round(parseInt(data.format.bit_rate || '0') / 1000),
        size: parseInt(data.format.size || '0'),
        format: data.format.format_name || 'unknown'
      };

      this.logger.log(`Metadados extraídos: ${JSON.stringify(result)}`);
      return result;

    } catch (error) {
      this.logger.error('Erro ao extrair metadados:', error);
      throw error;
    }
  }

  /**
   * Valida se vídeo atende requisitos mínimos
   */
  async validateVideo(
    videoPath: string,
    requirements: {
      minDuration?: number;
      maxDuration?: number;
      minWidth?: number;
      minHeight?: number;
      minFps?: number;
      maxSize?: number;
      allowedCodecs?: string[];
    }
  ): Promise<{ valid: boolean; errors: string[] }> {
    const metadata = await this.extractMetadata(videoPath);
    const errors: string[] = [];

    if (requirements.minDuration && metadata.duration < requirements.minDuration) {
      errors.push(`Duração muito curta: ${metadata.duration}s (mín: ${requirements.minDuration}s)`);
    }

    if (requirements.maxDuration && metadata.duration > requirements.maxDuration) {
      errors.push(`Duração muito longa: ${metadata.duration}s (máx: ${requirements.maxDuration}s)`);
    }

    if (requirements.minWidth && metadata.width < requirements.minWidth) {
      errors.push(`Largura muito pequena: ${metadata.width}px (mín: ${requirements.minWidth}px)`);
    }

    if (requirements.minHeight && metadata.height < requirements.minHeight) {
      errors.push(`Altura muito pequena: ${metadata.height}px (mín: ${requirements.minHeight}px)`);
    }

    if (requirements.minFps && metadata.fps < requirements.minFps) {
      errors.push(`FPS muito baixo: ${metadata.fps} (mín: ${requirements.minFps})`);
    }

    if (requirements.maxSize && metadata.size > requirements.maxSize) {
      errors.push(`Arquivo muito grande: ${(metadata.size / 1024 / 1024).toFixed(2)}MB (máx: ${(requirements.maxSize / 1024 / 1024).toFixed(2)}MB)`);
    }

    if (requirements.allowedCodecs && !requirements.allowedCodecs.includes(metadata.codec)) {
      errors.push(`Codec não suportado: ${metadata.codec} (permitidos: ${requirements.allowedCodecs.join(', ')})`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private parseFps(fpsString: string): number {
    const parts = fpsString.split('/');
    if (parts.length === 2) {
      return parseInt(parts[0]) / parseInt(parts[1]);
    }
    return parseFloat(fpsString);
  }
}
