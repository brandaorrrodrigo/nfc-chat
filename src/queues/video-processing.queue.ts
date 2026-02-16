/**
 * Fila de Processamento de Vídeos
 *
 * Sistema de filas assíncrono usando BullMQ e Redis para
 * processamento escalável de análises biomecânicas.
 */

import { Queue, Worker, Job } from 'bullmq';
import { Redis } from 'ioredis';
import { batchVideoProcessingPipeline } from '../pipelines/batch-video-processing.pipeline';
import { PerformanceConfig } from '../config/performance.config';
import type { BiomechanicalAnalysis, CaptureMode } from '../types/biomechanical-analysis.types';

interface VideoProcessingJobData {
  videoId: string;
  videoPath: string;
  exerciseName: string;
  captureMode: CaptureMode;
  userId: string;
  webhookUrl?: string;
  metadata?: Record<string, any>;
}

interface JobResult {
  videoId: string;
  analysis: BiomechanicalAnalysis;
  metadata: {
    totalFrames: number;
    processedFrames: number;
    processingTimeMs: number;
    fps: number;
    successRate: number;
    stages: Record<string, number>;
    detectorStats: any;
  };
}

export class VideoProcessingQueue {
  private queue: Queue<VideoProcessingJobData, JobResult>;
  private worker: Worker<VideoProcessingJobData, JobResult>;
  private redis: Redis;

  constructor() {
    // Configurar Redis
    this.redis = new Redis({
      host: PerformanceConfig.redis.host,
      port: PerformanceConfig.redis.port,
      db: PerformanceConfig.redis.db,
      password: PerformanceConfig.redis.password,
      keyPrefix: PerformanceConfig.redis.keyPrefix,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      }
    });

    // Criar fila
    this.queue = new Queue<VideoProcessingJobData, JobResult>('video-processing', {
      connection: this.redis,
      defaultJobOptions: PerformanceConfig.queue.defaultJobOptions
    });

    // Criar worker
    this.worker = new Worker<VideoProcessingJobData, JobResult>(
      'video-processing',
      async (job: Job<VideoProcessingJobData>) => {
        return await this.processJob(job);
      },
      {
        connection: this.redis,
        concurrency: PerformanceConfig.video.maxConcurrentVideos,
        limiter: PerformanceConfig.queue.limiter
      }
    );

    // Setup event listeners
    this.setupEventListeners();

    console.log('✅ Fila de processamento de vídeos inicializada');
    console.log(`📊 Redis: ${PerformanceConfig.redis.host}:${PerformanceConfig.redis.port}`);
    console.log(`🔢 Concorrência: ${PerformanceConfig.video.maxConcurrentVideos}`);
  }

  /**
   * Processa um job da fila
   */
  private async processJob(job: Job<VideoProcessingJobData>): Promise<JobResult> {
    const { videoId, videoPath, exerciseName, captureMode, userId } = job.data;

    console.log(`📹 Processando vídeo ${videoId} para usuário ${userId}`);
    console.log(`   Exercício: ${exerciseName}`);
    console.log(`   Modo: ${captureMode}`);

    // Atualizar progresso inicial
    await job.updateProgress({
      stage: 'initializing',
      progress: 0
    });

    try {
      // Processar vídeo usando pipeline otimizado
      const result = await batchVideoProcessingPipeline.process({
        videoPath,
        exerciseName,
        captureMode,
        onProgress: async (stage, progress) => {
          await job.updateProgress({
            stage,
            progress: Math.round(progress)
          });
        },
        onStageComplete: async (stage, duration) => {
          console.log(`  ✅ Stage ${stage} completo em ${duration}ms`);
          await job.log(`Stage ${stage} completed in ${duration}ms`);
        }
      });

      // Atualizar progresso final
      await job.updateProgress({
        stage: 'completed',
        progress: 100
      });

      console.log(`✅ Vídeo ${videoId} processado com sucesso`);

      return {
        videoId,
        analysis: result.analysis,
        metadata: result.metadata
      };

    } catch (error) {
      console.error(`❌ Erro ao processar vídeo ${videoId}:`, error);
      await job.log(`Error: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Configura event listeners do worker
   */
  private setupEventListeners(): void {
    // Job completo
    this.worker.on('completed', async (job, result) => {
      console.log(`✅ Job ${job.id} completo`);
      console.log(`   Frames: ${result.metadata.processedFrames}/${result.metadata.totalFrames}`);
      console.log(`   Tempo: ${(result.metadata.processingTimeMs / 1000).toFixed(2)}s`);
      console.log(`   FPS médio: ${result.metadata.fps.toFixed(2)}`);

      // Enviar webhook se configurado
      if (job.data.webhookUrl) {
        await this.sendWebhook(job.data.webhookUrl, {
          event: 'analysis.completed',
          videoId: result.videoId,
          userId: job.data.userId,
          analysis: result.analysis,
          metadata: result.metadata,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Job falhou
    this.worker.on('failed', (job, error) => {
      console.error(`❌ Job ${job?.id} falhou:`, error.message);

      // Enviar webhook de erro se configurado
      if (job?.data.webhookUrl) {
        this.sendWebhook(job.data.webhookUrl, {
          event: 'analysis.failed',
          videoId: job.data.videoId,
          userId: job.data.userId,
          error: error.message,
          timestamp: new Date().toISOString()
        }).catch((err) => {
          console.error('Erro ao enviar webhook de falha:', err);
        });
      }
    });

    // Progresso do job
    this.worker.on('progress', (job, progress: any) => {
      if (typeof progress === 'object' && progress.stage) {
        console.log(`⏳ Job ${job.id} [${progress.stage}]: ${progress.progress}%`);
      }
    });

    // Worker ativo
    this.worker.on('active', (job) => {
      console.log(`🏃 Job ${job.id} iniciado`);
    });

    // Erro no worker
    this.worker.on('error', (error) => {
      console.error('❌ Erro no worker:', error);
    });
  }

  /**
   * Adiciona job à fila
   */
  async addJob(data: VideoProcessingJobData, options?: {
    priority?: number;
    delay?: number;
    jobId?: string;
  }): Promise<Job<VideoProcessingJobData>> {
    const job = await this.queue.add(
      `video-${data.videoId}`,
      data,
      {
        jobId: options?.jobId || data.videoId,
        priority: options?.priority || 10,
        delay: options?.delay || 0
      }
    );

    console.log(`📥 Job ${job.id} adicionado à fila`);

    return job;
  }

  /**
   * Obtém job por ID
   */
  async getJob(jobId: string): Promise<Job<VideoProcessingJobData> | undefined> {
    return await this.queue.getJob(jobId);
  }

  /**
   * Obtém status detalhado do job
   */
  async getJobStatus(jobId: string): Promise<any> {
    const job = await this.getJob(jobId);

    if (!job) {
      return null;
    }

    const state = await job.getState();
    const progress = job.progress;
    const logs = await this.queue.getJobLogs(jobId);

    return {
      id: job.id,
      state,
      progress,
      data: job.data,
      result: job.returnvalue,
      failedReason: job.failedReason,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
      attemptsMade: job.attemptsMade,
      logs: logs.logs || []
    };
  }

  /**
   * Lista jobs ativos
   */
  async getActiveJobs(): Promise<Job<VideoProcessingJobData>[]> {
    return await this.queue.getActive();
  }

  /**
   * Lista jobs aguardando
   */
  async getWaitingJobs(): Promise<Job<VideoProcessingJobData>[]> {
    return await this.queue.getWaiting();
  }

  /**
   * Lista jobs completos (últimos N)
   */
  async getCompletedJobs(limit: number = 10): Promise<Job<VideoProcessingJobData>[]> {
    return await this.queue.getCompleted(0, limit - 1);
  }

  /**
   * Lista jobs falhos (últimos N)
   */
  async getFailedJobs(limit: number = 10): Promise<Job<VideoProcessingJobData>[]> {
    return await this.queue.getFailed(0, limit - 1);
  }

  /**
   * Obtém estatísticas da fila
   */
  async getQueueStats(): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
  }> {
    const counts = await this.queue.getJobCounts();

    return {
      waiting: counts.waiting || 0,
      active: counts.active || 0,
      completed: counts.completed || 0,
      failed: counts.failed || 0,
      delayed: counts.delayed || 0
    };
  }

  /**
   * Remove job por ID
   */
  async removeJob(jobId: string): Promise<void> {
    const job = await this.getJob(jobId);
    if (job) {
      await job.remove();
      console.log(`🗑️ Job ${jobId} removido`);
    }
  }

  /**
   * Limpa jobs completos
   */
  async cleanCompleted(grace: number = 24 * 60 * 60 * 1000): Promise<void> {
    await this.queue.clean(grace, 100, 'completed');
    console.log('🗑️ Jobs completos limpos');
  }

  /**
   * Limpa jobs falhos
   */
  async cleanFailed(grace: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    await this.queue.clean(grace, 100, 'failed');
    console.log('🗑️ Jobs falhos limpos');
  }

  /**
   * Envia webhook
   */
  private async sendWebhook(url: string, payload: any): Promise<void> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'NFC-NFV-VideoProcessor/1.0'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Webhook retornou status ${response.status}`);
      }

      console.log(`🪝 Webhook enviado para ${url}`);
    } catch (error) {
      console.error('❌ Erro ao enviar webhook:', error);
      // Não lançar erro para não falhar o job
    }
  }

  /**
   * Pausa a fila
   */
  async pause(): Promise<void> {
    await this.queue.pause();
    console.log('⏸️ Fila pausada');
  }

  /**
   * Resume a fila
   */
  async resume(): Promise<void> {
    await this.queue.resume();
    console.log('▶️ Fila resumida');
  }

  /**
   * Fecha worker e fila
   */
  async close(): Promise<void> {
    console.log('🛑 Fechando fila de processamento...');

    await this.worker.close();
    await this.queue.close();
    await this.redis.quit();

    console.log('✅ Fila fechada');
  }
}

/**
 * Instância singleton da fila de processamento
 */
export const videoProcessingQueue = new VideoProcessingQueue();
