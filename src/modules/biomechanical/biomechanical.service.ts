/**
 * Serviço de Análise Biomecânica - Lógica de Negócio Completa
 *
 * Gerencia fila de processamento, persistência, cache e ciclo de vida
 * completo das análises biomecânicas de vídeos.
 */

import { Injectable, Logger, OnModuleDestroy, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { videoProcessingQueue } from '../../queues/video-processing.queue';
import { optimizedPoseDetectionService } from '../../services/optimized-pose-detection.service';
import { Redis } from 'ioredis';
import { PerformanceConfig } from '../../config/performance.config';
import type { BiomechanicalAnalysis, CaptureMode } from '../../types/biomechanical-analysis.types';
import * as fs from 'fs-extra';

const prisma = new PrismaClient();

interface QueueAnalysisParams {
  videoPath: string;
  exerciseName: string;
  captureMode: CaptureMode;
  userId: string;
  webhookUrl?: string;
}

interface AnalysisStatus {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress?: {
    stage: string;
    progress: number;
  };
  result?: BiomechanicalAnalysis;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SystemStats {
  totalAnalyses: number;
  queueStats: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
  };
  detectorStats: any;
  cacheStats: {
    hits: number;
    misses: number;
    hitRate: number;
    size: number;
  };
}

@Injectable()
export class BiomechanicalService implements OnModuleDestroy {
  private readonly logger = new Logger(BiomechanicalService.name);
  private redis: Redis;
  private cacheStats = {
    hits: 0,
    misses: 0
  };

  constructor() {
    // Inicializar Redis para cache
    this.redis = new Redis({
      host: PerformanceConfig.redis.host,
      port: PerformanceConfig.redis.port,
      db: 1,  // Usar DB diferente da fila
      password: PerformanceConfig.redis.password,
      keyPrefix: 'nfv:cache:',
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      }
    });

    this.logger.log('BiomechanicalService inicializado');
  }

  /**
   * Enfileira vídeo para análise
   */
  async queueVideoAnalysis(params: QueueAnalysisParams): Promise<{ jobId: string; analysisId: string }> {
    this.logger.log(`Enfileirando análise de vídeo para usuário ${params.userId}`);

    try {
      // 1. Criar registro no banco de dados
      const analysis = await prisma.videoAnalysis.create({
        data: {
          videoId: `va_${Date.now()}_${this.generateRandomString(10)}`,
          userId: params.userId,
          exerciseName: params.exerciseName,
          captureMode: params.captureMode,
          status: 'queued',
          videoPath: params.videoPath,
          webhookUrl: params.webhookUrl,
          jobId: '',  // Será atualizado depois
          metadata: {
            queuedAt: new Date().toISOString(),
            fileSize: (await fs.stat(params.videoPath)).size
          }
        }
      });

      // 2. Adicionar job à fila
      const job = await videoProcessingQueue.addJob({
        videoId: analysis.videoId,
        videoPath: params.videoPath,
        exerciseName: params.exerciseName,
        captureMode: params.captureMode,
        userId: params.userId,
        webhookUrl: params.webhookUrl
      });

      // 3. Atualizar registro com jobId
      await prisma.videoAnalysis.update({
        where: { id: analysis.id },
        data: {
          jobId: job.id!,
          metadata: {
            queuedAt: new Date().toISOString(),
            jobId: job.id,
            fileSize: (await fs.stat(params.videoPath)).size
          }
        }
      });

      this.logger.log(`Análise ${analysis.id} enfileirada com job ${job.id}`);

      return {
        jobId: job.id!,
        analysisId: analysis.id
      };

    } catch (error) {
      this.logger.error('Erro ao enfileirar análise:', error);
      throw error;
    }
  }

  /**
   * Obtém status de uma análise
   */
  async getAnalysisStatus(analysisId: string): Promise<AnalysisStatus | null> {
    // 1. Verificar cache
    const cacheKey = `analysis:status:${analysisId}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      this.cacheStats.hits++;
      this.logger.debug(`Cache hit para análise ${analysisId}`);
      return JSON.parse(cached);
    }

    this.cacheStats.misses++;

    // 2. Buscar no banco de dados
    const analysis = await prisma.videoAnalysis.findUnique({
      where: { id: analysisId },
      include: {
        result: true
      }
    });

    if (!analysis) {
      return null;
    }

    // 3. Se está em processamento, buscar status da fila
    let jobStatus;
    if (analysis.jobId && (analysis.status === 'queued' || analysis.status === 'processing')) {
      jobStatus = await videoProcessingQueue.getJobStatus(analysis.jobId);
    }

    // 4. Construir resposta
    const status: AnalysisStatus = {
      id: analysis.id,
      status: analysis.status as any,
      createdAt: analysis.createdAt,
      updatedAt: analysis.updatedAt,
      progress: jobStatus?.progress as any,
      result: analysis.result?.fullAnalysis as any,
      error: analysis.errorMessage || undefined
    };

    // 5. Cachear resultado (TTL menor se em processamento)
    const ttl = status.status === 'completed' ? 3600 : 60;
    await this.redis.setex(cacheKey, ttl, JSON.stringify(status));

    return status;
  }

  /**
   * Atualiza status de análise (chamado pelo worker)
   */
  async updateAnalysisStatus(
    analysisId: string,
    status: 'processing' | 'completed' | 'failed',
    data?: {
      result?: any;
      error?: string;
      metadata?: any;
    }
  ): Promise<void> {
    this.logger.log(`Atualizando status da análise ${analysisId} para ${status}`);

    try {
      // Atualizar análise
      await prisma.videoAnalysis.update({
        where: { id: analysisId },
        data: {
          status,
          errorMessage: data?.error,
          metadata: data?.metadata as any,
          completedAt: status === 'completed' ? new Date() : undefined,
          startedAt: status === 'processing' ? new Date() : undefined,
          failedAt: status === 'failed' ? new Date() : undefined,
          updatedAt: new Date()
        }
      });

      // Se completou, salvar resultado
      if (status === 'completed' && data?.result) {
        const result = data.result;

        await prisma.biomechanicalResult.create({
          data: {
            videoAnalysisId: analysisId,
            motorScore: result.analysis.scores.motor,
            stabilizerScore: result.analysis.scores.stabilizer,
            symmetryScore: result.analysis.scores.symmetry,
            compensationScore: result.analysis.scores.compensation,
            igpbScore: result.analysis.scores.igpb,
            confidenceScore: result.analysis.confidenceScore,
            confidenceLevel: result.analysis.confidenceLevel,
            riskLevel: result.analysis.riskLevel,
            fullAnalysis: result.analysis as any,
            totalFrames: result.metadata.totalFrames,
            processedFrames: result.metadata.processedFrames,
            successRate: result.metadata.successRate,
            processingTimeMs: result.metadata.processingTimeMs,
            fps: result.metadata.fps
          }
        });
      }

      // Invalidar cache
      await this.redis.del(`analysis:status:${analysisId}`);

      this.logger.log(`Status da análise ${analysisId} atualizado`);

    } catch (error) {
      this.logger.error('Erro ao atualizar status:', error);
      throw error;
    }
  }

  /**
   * Lista análises de um usuário
   */
  async listUserAnalyses(
    userId: string,
    options: { limit?: number; offset?: number } = {}
  ): Promise<{
    items: any[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const limit = options.limit || 10;
    const offset = options.offset || 0;

    const [items, total] = await Promise.all([
      prisma.videoAnalysis.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          result: {
            select: {
              motorScore: true,
              stabilizerScore: true,
              symmetryScore: true,
              compensationScore: true,
              igpbScore: true,
              confidenceScore: true,
              confidenceLevel: true,
              riskLevel: true
            }
          }
        }
      }),
      prisma.videoAnalysis.count({
        where: { userId }
      })
    ]);

    return {
      items,
      total,
      limit,
      offset
    };
  }

  /**
   * Obtém estatísticas do sistema
   */
  async getSystemStats(): Promise<SystemStats> {
    // 1. Stats do banco de dados
    const totalAnalyses = await prisma.videoAnalysis.count();

    const statusCounts = await prisma.$queryRaw`
      SELECT status, COUNT(*) as count
      FROM video_analyses
      GROUP BY status
    ` as any[];

    const queueStats = {
      waiting: parseInt(statusCounts.find((s: any) => s.status === 'queued')?.count || '0'),
      active: parseInt(statusCounts.find((s: any) => s.status === 'processing')?.count || '0'),
      completed: parseInt(statusCounts.find((s: any) => s.status === 'completed')?.count || '0'),
      failed: parseInt(statusCounts.find((s: any) => s.status === 'failed')?.count || '0')
    };

    // 2. Stats do detector
    const detectorStats = optimizedPoseDetectionService.isInitialized
      ? optimizedPoseDetectionService.getStats()
      : null;

    // 3. Stats do cache
    const cacheSize = await this.redis.dbsize();
    const cacheHitRate = this.cacheStats.hits / (this.cacheStats.hits + this.cacheStats.misses) * 100;

    return {
      totalAnalyses,
      queueStats,
      detectorStats,
      cacheStats: {
        hits: this.cacheStats.hits,
        misses: this.cacheStats.misses,
        hitRate: isNaN(cacheHitRate) ? 0 : Math.round(cacheHitRate * 100) / 100,
        size: cacheSize
      }
    };
  }

  /**
   * Cleanup de arquivos antigos
   */
  async cleanupOldFiles(olderThanDays: number = 7): Promise<number> {
    this.logger.log(`Iniciando cleanup de arquivos com mais de ${olderThanDays} dias`);

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    // 1. Buscar análises antigas completadas
    const oldAnalyses = await prisma.videoAnalysis.findMany({
      where: {
        status: 'completed',
        completedAt: {
          lt: cutoffDate
        },
        videoPath: {
          not: null
        }
      },
      select: {
        id: true,
        videoPath: true
      }
    });

    let deletedCount = 0;

    // 2. Deletar vídeos
    for (const analysis of oldAnalyses) {
      try {
        if (analysis.videoPath && await fs.pathExists(analysis.videoPath)) {
          await fs.remove(analysis.videoPath);
          deletedCount++;

          // Atualizar registro
          await prisma.videoAnalysis.update({
            where: { id: analysis.id },
            data: { videoPath: null }
          });
        }
      } catch (error) {
        this.logger.error(`Erro ao deletar vídeo ${analysis.videoPath}:`, error);
      }
    }

    this.logger.log(`Cleanup concluído: ${deletedCount} arquivos deletados`);

    return deletedCount;
  }

  /**
   * Reprocessa análise falha
   */
  async retryFailedAnalysis(analysisId: string): Promise<{ jobId: string }> {
    this.logger.log(`Reprocessando análise ${analysisId}`);

    // 1. Buscar análise
    const analysis = await prisma.videoAnalysis.findUnique({
      where: { id: analysisId }
    });

    if (!analysis) {
      throw new NotFoundException('Análise não encontrada');
    }

    if (analysis.status !== 'failed') {
      throw new Error('Apenas análises falhas podem ser reprocessadas');
    }

    if (!analysis.videoPath || !await fs.pathExists(analysis.videoPath)) {
      throw new Error('Vídeo não encontrado para reprocessamento');
    }

    // 2. Adicionar novo job
    const job = await videoProcessingQueue.addJob({
      videoId: analysis.videoId,
      videoPath: analysis.videoPath,
      exerciseName: analysis.exerciseName,
      captureMode: analysis.captureMode as CaptureMode,
      userId: analysis.userId,
      webhookUrl: analysis.webhookUrl || undefined
    });

    // 3. Atualizar registro
    await prisma.videoAnalysis.update({
      where: { id: analysisId },
      data: {
        status: 'queued',
        jobId: job.id!,
        errorMessage: null,
        updatedAt: new Date(),
        metadata: {
          retriedAt: new Date().toISOString(),
          previousJobId: analysis.jobId
        }
      }
    });

    // 4. Invalidar cache
    await this.redis.del(`analysis:status:${analysisId}`);

    this.logger.log(`Análise ${analysisId} reenfileirada com job ${job.id}`);

    return { jobId: job.id! };
  }

  /**
   * Cancela análise em processamento
   */
  async cancelAnalysis(analysisId: string): Promise<void> {
    this.logger.log(`Cancelando análise ${analysisId}`);

    const analysis = await prisma.videoAnalysis.findUnique({
      where: { id: analysisId }
    });

    if (!analysis) {
      throw new NotFoundException('Análise não encontrada');
    }

    if (analysis.status === 'completed') {
      throw new Error('Análise já concluída não pode ser cancelada');
    }

    // Tentar remover job da fila
    if (analysis.jobId) {
      try {
        await videoProcessingQueue.removeJob(analysis.jobId);
      } catch (error) {
        this.logger.warn(`Erro ao remover job ${analysis.jobId}:`, error);
      }
    }

    // Atualizar status
    await prisma.videoAnalysis.update({
      where: { id: analysisId },
      data: {
        status: 'failed',
        errorMessage: 'Cancelado pelo usuário',
        updatedAt: new Date()
      }
    });

    // Cleanup de arquivos
    if (analysis.videoPath && await fs.pathExists(analysis.videoPath)) {
      await fs.remove(analysis.videoPath);
    }

    // Invalidar cache
    await this.redis.del(`analysis:status:${analysisId}`);

    this.logger.log(`Análise ${analysisId} cancelada`);
  }

  /**
   * Obtém métricas de performance
   */
  async getPerformanceMetrics(timeRange: 'day' | 'week' | 'month' = 'day'): Promise<any> {
    const now = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
    }

    // Análises completadas no período
    const completedAnalyses = await prisma.videoAnalysis.findMany({
      where: {
        status: 'completed',
        completedAt: {
          gte: startDate
        }
      },
      select: {
        metadata: true,
        createdAt: true,
        completedAt: true
      }
    });

    // Calcular métricas
    const processingTimes = completedAnalyses
      .filter(a => a.completedAt && a.createdAt)
      .map(a => a.completedAt!.getTime() - a.createdAt.getTime());

    const avgProcessingTime = processingTimes.length > 0
      ? processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length
      : 0;

    const minProcessingTime = processingTimes.length > 0
      ? Math.min(...processingTimes)
      : 0;

    const maxProcessingTime = processingTimes.length > 0
      ? Math.max(...processingTimes)
      : 0;

    return {
      timeRange,
      totalCompleted: completedAnalyses.length,
      avgProcessingTimeMs: avgProcessingTime,
      minProcessingTimeMs: minProcessingTime,
      maxProcessingTimeMs: maxProcessingTime,
      avgProcessingTimeFormatted: this.formatDuration(avgProcessingTime),
      throughput: completedAnalyses.length / ((now.getTime() - startDate.getTime()) / 3600000) // análises por hora
    };
  }

  /**
   * Helpers privados
   */
  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  private generateRandomString(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Cleanup ao desligar
   */
  async onModuleDestroy() {
    this.logger.log('Encerrando BiomechanicalService...');
    await this.redis.quit();
  }
}
