/**
 * Controller de Análise Biomecânica
 *
 * Endpoints REST para upload de vídeos, consulta de status
 * e recuperação de resultados de análises.
 */

import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Query
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BiomechanicalService } from './biomechanical.service';
import { AnalyzeVideoDto, GetAnalysisDto } from './dto';
import { diskStorage } from 'multer';
import { PerformanceConfig } from '../../config/performance.config';
import * as path from 'path';
import * as fs from 'fs-extra';

@Controller('api/v1/biomechanical')
export class BiomechanicalController {

  constructor(private biomechanicalService: BiomechanicalService) {}

  /**
   * POST /api/v1/biomechanical/analyze
   * Upload e análise de vídeo
   */
  @Post('analyze')
  @UseInterceptors(FileInterceptor('video', {
    storage: diskStorage({
      destination: async (req, file, cb) => {
        const uploadDir = PerformanceConfig.upload.uploadDir;
        await fs.ensureDir(uploadDir);
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
      }
    }),
    limits: {
      fileSize: PerformanceConfig.upload.maxFileSize
    },
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase().substring(1);
      if (!PerformanceConfig.video.allowedFormats.includes(ext)) {
        return cb(
          new HttpException('Formato de vídeo não suportado', HttpStatus.BAD_REQUEST) as any,
          false
        );
      }

      if (!PerformanceConfig.upload.allowedMimeTypes.includes(file.mimetype)) {
        return cb(
          new HttpException('MIME type não suportado', HttpStatus.BAD_REQUEST) as any,
          false
        );
      }

      cb(null, true);
    }
  }))
  async analyzeVideo(
    @UploadedFile() video: Express.Multer.File,
    @Body() dto: AnalyzeVideoDto
  ) {
    if (!video) {
      throw new HttpException('Vídeo não enviado', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.biomechanicalService.queueVideoAnalysis({
        videoPath: video.path,
        exerciseName: dto.exerciseName,
        captureMode: dto.captureMode,
        userId: dto.userId,
        webhookUrl: dto.webhookUrl
      });

      return {
        success: true,
        data: {
          analysisId: result.videoId,
          jobId: result.jobId,
          status: result.status,
          message: 'Vídeo enviado para análise'
        }
      };

    } catch (error) {
      // Cleanup em caso de erro
      await fs.remove(video.path).catch(() => {});
      throw new HttpException(
        (error as Error).message || 'Erro ao processar vídeo',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * GET /api/v1/biomechanical/analysis/:id
   * Obter status e resultado de análise
   */
  @Get('analysis/:id')
  async getAnalysis(@Param('id') id: string) {
    try {
      const status = await this.biomechanicalService.getAnalysisStatus(id);

      return {
        success: true,
        data: status
      };
    } catch (error) {
      if ((error as any).status === 404) {
        throw error;
      }
      throw new HttpException(
        (error as Error).message || 'Erro ao obter análise',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * GET /api/v1/biomechanical/analyses
   * Listar análises do usuário
   */
  @Get('analyses')
  async listAnalyses(@Query() query: GetAnalysisDto) {
    try {
      const analyses = await this.biomechanicalService.listUserAnalyses(
        query.userId,
        {
          limit: query.limit || 10,
          offset: query.offset || 0
        }
      );

      return {
        success: true,
        data: analyses
      };
    } catch (error) {
      throw new HttpException(
        (error as Error).message || 'Erro ao listar análises',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * GET /api/v1/biomechanical/stats
   * Estatísticas do sistema
   */
  @Get('stats')
  async getStats() {
    try {
      const stats = await this.biomechanicalService.getSystemStats();

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      throw new HttpException(
        (error as Error).message || 'Erro ao obter estatísticas',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
