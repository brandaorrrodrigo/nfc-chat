/**
 * Hybrid Analysis Worker
 *
 * Worker BullMQ que orquestra o pipeline completo híbrido:
 * - Quick Analysis (sempre)
 * - Conditional Deep Analysis (baseado em decisão)
 * - Corrective Protocols (sempre)
 *
 * Pipeline: Cache → Extract → MediaPipe → Quick → Decision → [Deep] → Protocols → Save → Notify
 */

import {
  Processor,
  Process,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  OnQueueProgress,
} from '@nestjs/bull';
import { Job } from 'bull';
import { Logger, Injectable } from '@nestjs/common';
import { QuickAnalysisService } from '../modules/analysis/quick-analysis.service';
import { DecisionEngineService } from '../modules/analysis/decision-engine.service';
import { ProtocolMatcherService } from '../modules/protocols/protocol-matcher.service';
import { CacheService } from '../modules/cache/cache.service';
import { PrismaService } from '../modules/prisma/prisma.service';
import {
  ErrorHandlingStrategy,
  PipelineStage,
  ProcessingError,
} from './error-handling.strategy';
import {
  MetricsCollectorService,
  JobMetrics,
} from './metrics-collector.service';
import { STAGE_TIME_ESTIMATES } from './queue.config';
import axios from 'axios';
import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync, readFileSync, unlinkSync, readdirSync } from 'fs';

const execPromise = promisify(exec);

/**
 * Job data interface
 */
interface HybridAnalysisJob {
  videoPath: string;
  userId: string;
  exerciseId: string;
  userProfile?: any;
  skipCache?: boolean;
  priority?: number;
}

/**
 * Job result interface
 */
interface HybridAnalysisResult {
  videoAnalysis: any;
  performance: {
    totalTime: number;
    quickAnalysisTime: number;
    deepAnalysisTime: number;
    protocolsTime: number;
    cacheHit: boolean;
    decision: {
      ranDeepAnalysis: boolean;
      reason: string;
      triggers: string[];
    };
  };
  metrics: JobMetrics;
}

@Processor('hybrid-video-analysis')
@Injectable()
export class HybridAnalysisWorker {
  private readonly logger = new Logger(HybridAnalysisWorker.name);
  private readonly errorHandler = new ErrorHandlingStrategy();

  constructor(
    private quickAnalysis: QuickAnalysisService,
    private decisionEngine: DecisionEngineService,
    private protocolMatcher: ProtocolMatcherService,
    private cache: CacheService,
    private prisma: PrismaService,
    private metricsCollector: MetricsCollectorService,
  ) {}

  @OnQueueActive()
  onActive(job: Job<HybridAnalysisJob>) {
    this.logger.log(
      `[Job ${job.id}] Processing for user ${job.data.userId}, exercise ${job.data.exerciseId}`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: HybridAnalysisResult) {
    this.logger.log(
      `[Job ${job.id}] Completed in ${result.performance.totalTime}ms (tier: ${result.performance.decision.ranDeepAnalysis ? 'deep' : 'quick'})`,
    );
  }

  @OnQueueFailed()
  onError(job: Job, error: Error) {
    this.logger.error(
      `[Job ${job.id}] Failed: ${error.message}`,
      error.stack,
    );
  }

  @OnQueueProgress()
  onProgress(job: Job, progress: number) {
    this.logger.debug(`[Job ${job.id}] Progress: ${progress}%`);
  }

  /**
   * Main processor: orchestrates entire hybrid pipeline
   */
  @Process('analyze-video-hybrid')
  async handleHybridAnalysis(
    job: Job<HybridAnalysisJob>,
  ): Promise<HybridAnalysisResult> {
    const startTime = Date.now();
    const { videoPath, userId, exerciseId, userProfile, skipCache } =
      job.data;

    // Inicializar métricas
    const metrics: Partial<JobMetrics> = {
      jobId: job.id.toString(),
      userId,
      exerciseId,
      startTime: new Date(),
      stages: {},
      cacheHits: { l1: false, l2: false, l3: false },
      errors: [],
    };

    let stageStartTime: number;

    try {
      // ═══════════════════════════════════════════════════════════
      // STAGE 0: CHECK CACHE L1 (Complete Analysis)
      // ═══════════════════════════════════════════════════════════
      if (!skipCache) {
        await job.progress(5);
        stageStartTime = Date.now();

        const cached = await this.cache.getCompleteAnalysis(
          videoPath,
          userId,
          exerciseId,
        );

        if (cached) {
          this.logger.log(`[Job ${job.id}] Cache hit L1 - returning immediately`);
          metrics.cacheHits!.l1 = true;
          metrics.totalTime = Date.now() - startTime;
          metrics.endTime = new Date();

          return {
            videoAnalysis: cached,
            performance: {
              totalTime: Date.now() - startTime,
              quickAnalysisTime: 0,
              deepAnalysisTime: 0,
              protocolsTime: 0,
              cacheHit: true,
              decision: {
                ranDeepAnalysis: false,
                reason: 'Cache hit',
                triggers: [],
              },
            },
            metrics: metrics as JobMetrics,
          };
        }
      }

      // ═══════════════════════════════════════════════════════════
      // STAGE 1: EXTRACT FRAMES (FFmpeg)
      // ═══════════════════════════════════════════════════════════
      await job.progress(10);
      stageStartTime = Date.now();

      let frames: any[];
      try {
        frames = await this.extractFrames(videoPath, {
          fps: 2,
          maxFrames: 6,
          quality: 85,
        });

        this.logger.log(`[Job ${job.id}] Extracted ${frames.length} frames`);
        metrics.stages!.extraction = Date.now() - stageStartTime;
        metrics.framesExtracted = frames.length;
      } catch (error) {
        const processingError = this.errorHandler.classifyError(
          error,
          PipelineStage.EXTRACTION,
        );
        metrics.errors!.push({
          stage: PipelineStage.EXTRACTION,
          type: processingError.type,
          message: error.message,
          recovered: false,
        });

        // Tentar fallback: menos frames
        if (processingError.fallbackAvailable) {
          const fallback = await this.errorHandler.executeFallback(
            processingError,
            { videoPath },
          );

          if (fallback.success) {
            frames = await this.extractFrames(videoPath, fallback.data.options);
            metrics.errors![metrics.errors!.length - 1].recovered = true;
            metrics.stages!.extraction = Date.now() - stageStartTime;
          } else {
            throw error;
          }
        } else {
          throw error;
        }
      }

      // ═══════════════════════════════════════════════════════════
      // STAGE 2: MEDIAPIPE POSE DETECTION
      // ═══════════════════════════════════════════════════════════
      await job.progress(20);
      stageStartTime = Date.now();

      let poseData: any;
      try {
        poseData = await this.callMediaPipeService(frames);
        this.logger.log(
          `[Job ${job.id}] MediaPipe processed ${poseData.frames.length} frames`,
        );
        metrics.stages!.mediapipe = Date.now() - stageStartTime;
        metrics.framesAnalyzed = poseData.frames.length;
      } catch (error) {
        const processingError = this.errorHandler.classifyError(
          error,
          PipelineStage.MEDIAPIPE,
        );
        metrics.errors!.push({
          stage: PipelineStage.MEDIAPIPE,
          type: processingError.type,
          message: error.message,
          recovered: false,
        });

        // MediaPipe crítico - não há fallback
        this.logger.error(
          `[Job ${job.id}] MediaPipe failed - no fallback available`,
        );
        throw error;
      }

      // ═══════════════════════════════════════════════════════════
      // STAGE 3: QUICK ANALYSIS (Gold Standard Comparison)
      // SEMPRE EXECUTADA - BASE DO SISTEMA
      // ═══════════════════════════════════════════════════════════
      await job.progress(40);
      stageStartTime = Date.now();

      let quickResult: any;
      try {
        quickResult = await this.quickAnalysis.analyze({
          videoPath,
          exerciseId,
          userId,
          frames: poseData.frames,
        });

        this.logger.log(
          `[Job ${job.id}] Quick analysis: score=${quickResult.overall_score.toFixed(2)}, similarity=${(quickResult.similarity_to_gold * 100).toFixed(1)}%`,
        );

        metrics.stages!.quickAnalysis = Date.now() - stageStartTime;
        metrics.quickScore = quickResult.overall_score;
        metrics.deviationsCount = JSON.parse(
          quickResult.deviations_detected as string,
        ).length;
      } catch (error) {
        const processingError = this.errorHandler.classifyError(
          error,
          PipelineStage.QUICK_ANALYSIS,
        );
        metrics.errors!.push({
          stage: PipelineStage.QUICK_ANALYSIS,
          type: processingError.type,
          message: error.message,
          recovered: false,
        });

        // Tentar fallback: análise básica
        if (processingError.fallbackAvailable) {
          const fallback = await this.errorHandler.executeFallback(
            processingError,
            {},
          );

          if (fallback.success) {
            quickResult = fallback.data;
            metrics.errors![metrics.errors!.length - 1].recovered = true;
          } else {
            throw error;
          }
        } else {
          throw error;
        }
      }

      // ═══════════════════════════════════════════════════════════
      // STAGE 4: DECISION ENGINE (Run Deep Analysis?)
      // ═══════════════════════════════════════════════════════════
      await job.progress(50);
      stageStartTime = Date.now();

      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new Error(`User ${userId} not found`);
      }

      const decision = await this.decisionEngine.shouldRunDeepAnalysis(
        quickResult,
        user,
      );

      this.logger.log(
        `[Job ${job.id}] Decision: ${decision.shouldRun ? 'RUN' : 'SKIP'} deep analysis. Reason: ${decision.reason}`,
      );

      metrics.stages!.decision = Date.now() - stageStartTime;
      metrics.deepAnalysisTriggered = decision.shouldRun;
      metrics.decisionTriggers = decision.triggers;

      let deepResult: any = null;

      // ═══════════════════════════════════════════════════════════
      // STAGE 5: DEEP ANALYSIS (CONDITIONAL - RAG + LLM)
      // ═══════════════════════════════════════════════════════════
      if (decision.shouldRun) {
        await job.progress(60);
        stageStartTime = Date.now();

        try {
          // TODO: Implementar DeepAnalysisService
          // Por enquanto, simulando
          deepResult = {
            scientific_context: [],
            rag_sources_used: [],
            llm_narrative: 'Deep analysis placeholder',
            llm_model_used: 'gpt-4',
            llm_tokens_used: 1000,
            personalized_cues: [],
            risk_assessment: {},
            action_plan: {},
            processing_time_ms: 35000,
          };

          this.logger.log(
            `[Job ${job.id}] Deep analysis completed (simulated)`,
          );

          metrics.stages!.deepAnalysis = Date.now() - stageStartTime;
          metrics.ragDocsRetrieved = deepResult.rag_sources_used.length;
          metrics.llmTokensUsed = deepResult.llm_tokens_used;
        } catch (error) {
          const processingError = this.errorHandler.classifyError(
            error,
            PipelineStage.DEEP_ANALYSIS,
          );
          metrics.errors!.push({
            stage: PipelineStage.DEEP_ANALYSIS,
            type: processingError.type,
            message: error.message,
            recovered: true, // Deep é opcional
          });

          // Deep analysis é opcional - continuar sem ela
          this.logger.warn(
            `[Job ${job.id}] Deep analysis failed, continuing without it`,
          );
          deepResult = null;
        }
      } else {
        await job.progress(80); // Skip para 80% se não rodar deep
      }

      // ═══════════════════════════════════════════════════════════
      // STAGE 6: CORRECTIVE PROTOCOLS (SEMPRE - Rule-Based)
      // ═══════════════════════════════════════════════════════════
      await job.progress(90);
      stageStartTime = Date.now();

      let protocols: any[] = [];
      try {
        const deviations = JSON.parse(
          quickResult.deviations_detected as string,
        );

        protocols = await this.protocolMatcher.generateProtocols({
          deviations,
          userProfile: userProfile || {},
          deepContext: deepResult?.scientific_context,
        });

        this.logger.log(
          `[Job ${job.id}] Generated ${protocols.length} corrective protocols`,
        );

        metrics.stages!.protocols = Date.now() - stageStartTime;
        metrics.protocolsGenerated = protocols.length;
      } catch (error) {
        const processingError = this.errorHandler.classifyError(
          error,
          PipelineStage.PROTOCOLS,
        );
        metrics.errors!.push({
          stage: PipelineStage.PROTOCOLS,
          type: processingError.type,
          message: error.message,
          recovered: false,
        });

        // Fallback: protocolos genéricos
        const fallback = await this.errorHandler.executeFallback(
          processingError,
          {},
        );
        if (fallback.success) {
          protocols = fallback.data.protocols;
          metrics.errors![metrics.errors!.length - 1].recovered = true;
        }
      }

      // ═══════════════════════════════════════════════════════════
      // STAGE 7: SAVE RESULTS
      // ═══════════════════════════════════════════════════════════
      await job.progress(95);
      stageStartTime = Date.now();

      const videoAnalysis = await this.prisma.videoAnalysis.create({
        data: {
          user_id: userId,
          exercise_id: exerciseId,
          video_path: videoPath,
          video_duration: poseData.duration_ms || null,
          analysis_tier: decision.shouldRun ? 'deep' : 'quick',
          processing_time_ms: Date.now() - startTime,
          cache_hit: false,
          status: 'completed',
          completed_at: new Date(),
        },
      });

      // Salvar quick result
      await this.prisma.quickAnalysisResult.create({
        data: {
          video_analysis_id: videoAnalysis.id,
          overall_score: quickResult.overall_score,
          classification: quickResult.classification,
          similarity_to_gold: quickResult.similarity_to_gold,
          frames_data: quickResult.frames_data,
          deviations_detected: quickResult.deviations_detected,
          processing_time_ms: quickResult.processing_time_ms,
        },
      });

      // Salvar deep result (se houver)
      if (deepResult) {
        await this.prisma.deepAnalysisResult.create({
          data: {
            video_analysis_id: videoAnalysis.id,
            scientific_context: deepResult.scientific_context,
            rag_sources_used: deepResult.rag_sources_used,
            llm_narrative: deepResult.llm_narrative,
            llm_model_used: deepResult.llm_model_used,
            llm_tokens_used: deepResult.llm_tokens_used,
            personalized_cues: deepResult.personalized_cues,
            risk_assessment: deepResult.risk_assessment,
            action_plan: deepResult.action_plan,
            processing_time_ms: deepResult.processing_time_ms,
          },
        });
      }

      // Salvar protocols
      for (const protocol of protocols) {
        await this.prisma.correctiveProtocol.create({
          data: {
            video_analysis_id: videoAnalysis.id,
            deviation_type: protocol.deviation_type,
            deviation_severity: protocol.deviation_severity,
            protocol_id: protocol.protocol_id,
            protocol_version: protocol.protocol_version,
            protocol_data: protocol.protocol_data,
            user_modifications: protocol.user_modifications,
          },
        });
      }

      metrics.stages!.save = Date.now() - stageStartTime;
      metrics.videoAnalysisId = videoAnalysis.id;

      // ═══════════════════════════════════════════════════════════
      // STAGE 8: CACHE RESULT (L1)
      // ═══════════════════════════════════════════════════════════
      await job.progress(98);

      await this.cache.setCompleteAnalysis(
        videoPath,
        userId,
        exerciseId,
        videoAnalysis,
      );

      // ═══════════════════════════════════════════════════════════
      // STAGE 9: NOTIFY USER
      // ═══════════════════════════════════════════════════════════
      await job.progress(99);
      stageStartTime = Date.now();

      try {
        await this.notifyUser(userId, {
          type: 'analysis_complete',
          analysisId: videoAnalysis.id,
          score: quickResult.overall_score,
          tier: decision.shouldRun ? 'deep' : 'quick',
        });
        metrics.stages!.notification = Date.now() - stageStartTime;
      } catch (error) {
        // Notificação não é crítica
        this.logger.warn(`[Job ${job.id}] Notification failed: ${error.message}`);
      }

      // Cleanup: remover frames temporários
      await this.cleanupTempFiles(frames);

      // ═══════════════════════════════════════════════════════════
      // FINALIZE METRICS
      // ═══════════════════════════════════════════════════════════
      await job.progress(100);

      metrics.totalTime = Date.now() - startTime;
      metrics.endTime = new Date();

      // Salvar métricas
      await this.metricsCollector.recordJobMetrics(metrics as JobMetrics);

      const result: HybridAnalysisResult = {
        videoAnalysis,
        performance: {
          totalTime: metrics.totalTime,
          quickAnalysisTime: metrics.stages!.quickAnalysis,
          deepAnalysisTime: metrics.stages!.deepAnalysis || 0,
          protocolsTime: metrics.stages!.protocols || 0,
          cacheHit: false,
          decision: {
            ranDeepAnalysis: decision.shouldRun,
            reason: decision.reason,
            triggers: decision.triggers,
          },
        },
        metrics: metrics as JobMetrics,
      };

      this.logger.log(
        `[Job ${job.id}] Pipeline completed successfully: ${result.performance.totalTime}ms total`,
      );

      return result;
    } catch (error) {
      this.logger.error(
        `[Job ${job.id}] Pipeline failed: ${error.message}`,
        error.stack,
      );

      // Atualizar status para failed
      if (metrics.videoAnalysisId) {
        await this.prisma.videoAnalysis.update({
          where: { id: metrics.videoAnalysisId },
          data: {
            status: 'failed',
            error_message: error.message,
          },
        });
      }

      throw error;
    }
  }

  /**
   * Extract frames usando FFmpeg
   */
  private async extractFrames(
    videoPath: string,
    options: { fps: number; maxFrames: number; quality: number },
  ): Promise<any[]> {
    const outputDir = '/tmp/frames';
    const outputPattern = `${outputDir}/frame_%04d.jpg`;

    // Criar diretório
    await execPromise(`mkdir -p ${outputDir}`);

    // FFmpeg command
    const command = `ffmpeg -i "${videoPath}" -vf "fps=${options.fps}" -q:v ${100 - options.quality} -frames:v ${options.maxFrames} "${outputPattern}" -y`;

    this.logger.debug(`Executing FFmpeg: ${command}`);

    try {
      await execPromise(command);
    } catch (error) {
      throw new Error(`FFmpeg extraction failed: ${error.message}`);
    }

    // Ler frames gerados
    const files = readdirSync(outputDir)
      .filter((f) => f.startsWith('frame_'))
      .sort()
      .slice(0, options.maxFrames);

    const frames = files.map((filename, idx) => ({
      path: `${outputDir}/${filename}`,
      number: idx + 1,
      timestamp_ms: (idx / options.fps) * 1000,
    }));

    return frames;
  }

  /**
   * Chama serviço Python MediaPipe
   */
  private async callMediaPipeService(frames: any[]): Promise<any> {
    const MEDIAPIPE_SERVICE_URL =
      process.env.MEDIAPIPE_SERVICE_URL || 'http://python-service:5000';

    try {
      const response = await axios.post(
        `${MEDIAPIPE_SERVICE_URL}/analyze-frames`,
        {
          frames: frames.map((f) => ({
            path: f.path,
            timestamp_ms: f.timestamp_ms,
          })),
        },
        {
          timeout: 30000, // 30s timeout
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('MediaPipe service unavailable');
      }
      throw new Error(`MediaPipe service error: ${error.message}`);
    }
  }

  /**
   * Notifica usuário via WebSocket/Push
   */
  private async notifyUser(userId: string, notification: any): Promise<void> {
    // TODO: Implementar com @nestjs/websockets ou serviço de notificações
    this.logger.debug(
      `Notification sent to user ${userId}: ${JSON.stringify(notification)}`,
    );
  }

  /**
   * Cleanup de arquivos temporários
   */
  private async cleanupTempFiles(frames: any[]): Promise<void> {
    try {
      for (const frame of frames) {
        if (existsSync(frame.path)) {
          unlinkSync(frame.path);
        }
      }
      this.logger.debug(`Cleaned up ${frames.length} temporary frames`);
    } catch (error) {
      this.logger.warn(`Cleanup failed: ${error.message}`);
    }
  }
}
