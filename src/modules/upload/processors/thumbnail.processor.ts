import { Injectable, Logger } from '@nestjs/common';
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs-extra';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface ThumbnailOptions {
  videoPath: string;
  outputPath?: string;
  timestamp?: number;     // Segundos no vídeo
  width?: number;
  height?: number;
  quality?: number;
}

@Injectable()
export class ThumbnailProcessor {
  private readonly logger = new Logger(ThumbnailProcessor.name);

  /**
   * Gera thumbnail de vídeo usando FFmpeg
   */
  async generateVideoThumbnail(options: ThumbnailOptions): Promise<string> {
    try {
      const timestamp = options.timestamp || 1; // 1 segundo por padrão
      const outputPath = options.outputPath ||
        path.join(path.dirname(options.videoPath), 'thumbnail.jpg');

      const width = options.width || 640;
      const height = options.height || 360;

      // Comando FFmpeg para extrair frame
      const command = `ffmpeg -ss ${timestamp} -i "${options.videoPath}" -vframes 1 -vf scale=${width}:${height} -y "${outputPath}"`;

      await execAsync(command);

      // Otimizar thumbnail com sharp se quality especificado
      if (options.quality) {
        await sharp(outputPath)
          .jpeg({ quality: options.quality })
          .toFile(outputPath + '.tmp');

        await fs.move(outputPath + '.tmp', outputPath, { overwrite: true });
      }

      this.logger.log(`Thumbnail gerado: ${outputPath}`);
      return outputPath;

    } catch (error) {
      this.logger.error('Erro ao gerar thumbnail:', error);
      throw error;
    }
  }

  /**
   * Gera múltiplos thumbnails ao longo do vídeo
   */
  async generateMultipleThumbnails(
    videoPath: string,
    count: number = 5
  ): Promise<string[]> {
    // Obter duração do vídeo
    const duration = await this.getVideoDuration(videoPath);

    const interval = duration / (count + 1);
    const timestamps = Array.from({ length: count }, (_, i) => (i + 1) * interval);

    const thumbnails: string[] = [];

    for (let i = 0; i < timestamps.length; i++) {
      const outputPath = path.join(
        path.dirname(videoPath),
        `thumbnail_${i}.jpg`
      );

      const thumbnail = await this.generateVideoThumbnail({
        videoPath,
        timestamp: timestamps[i],
        outputPath,
        quality: 80
      });

      thumbnails.push(thumbnail);
    }

    return thumbnails;
  }

  private async getVideoDuration(videoPath: string): Promise<number> {
    try {
      const command = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`;
      const { stdout } = await execAsync(command);
      return parseFloat(stdout.trim());
    } catch (error) {
      this.logger.error('Erro ao obter duração:', error);
      return 0;
    }
  }
}
