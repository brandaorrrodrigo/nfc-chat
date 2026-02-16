/**
 * Pipeline de Processamento em Batch
 *
 * Processa vídeos em batches otimizados com callbacks de progresso,
 * garbage collection automático e validações completas.
 */

import { optimizedPoseDetectionService } from '../services/optimized-pose-detection.service';
import { videoExtractionService } from '../services/video-extraction.service';
import { biomechanicalAnalyzer } from '../engines/biomechanical-analyzer.engine';
import { movementScoringService } from '../services/movement-scoring.service';
import { MediaPipeAdapter } from '../adapters/mediapipe.adapter';
import { PerformanceConfig } from '../config/performance.config';
import type {
  CaptureMode,
  CameraAngle,
  FrameAnalysis,
  BiomechanicalAnalysis
} from '../types/biomechanical-analysis.types';
import * as tf from '@tensorflow/tfjs';
import * as fs from 'fs-extra';
import * as path from 'path';
import { createCanvas, loadImage } from 'canvas';

interface BatchProcessingOptions {
  videoPath: string;
  exerciseName: string;
  captureMode: CaptureMode;
  cameraAngle?: CameraAngle;
  onProgress?: (stage: string, progress: number) => void;
  onStageComplete?: (stage: string, duration: number) => void;
}

interface ProcessingResult {
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

export class BatchVideoProcessingPipeline {
  /**
   * Processa vídeo completo com otimizações de batch
   */
  async process(options: BatchProcessingOptions): Promise<ProcessingResult> {
    const stages: Record<string, number> = {
      validation: 0,
      extraction: 0,
      detection: 0,
      analysis: 0,
      cleanup: 0
    };

    const startTime = Date.now();

    try {
      // 1. VALIDAÇÃO
      options.onProgress?.('validation', 0);
      const stageStart = Date.now();

      await this.validateVideo(options.videoPath);
      const videoMeta = await videoExtractionService.getVideoMetadata(options.videoPath);

      if (videoMeta.duration > PerformanceConfig.video.maxVideoDuration) {
        throw new Error(
          `Vídeo muito longo: ${videoMeta.duration}s (máx: ${PerformanceConfig.video.maxVideoDuration}s)`
        );
      }

      stages.validation = Date.now() - stageStart;
      options.onStageComplete?.('validation', stages.validation);

      // 2. EXTRAÇÃO DE FRAMES
      options.onProgress?.('extraction', 0);
      const extractionStart = Date.now();

      const framesDir = path.join(process.cwd(), 'data', 'frames', `video_${Date.now()}`);
      await fs.ensureDir(framesDir);

      const framePaths = await videoExtractionService.extractFrames(options.videoPath, {
        outputDir: framesDir,
        fps: PerformanceConfig.video.maxFps,
        format: PerformanceConfig.video.extractionFormat,
        quality: PerformanceConfig.video.jpegQuality,
        onProgress: (progress) => {
          options.onProgress?.('extraction', progress);
        }
      });

      stages.extraction = Date.now() - extractionStart;
      options.onStageComplete?.('extraction', stages.extraction);

      console.log(`📊 Total de frames extraídos: ${framePaths.length}`);

      // 3. DETECÇÃO DE POSE (EM BATCH)
      options.onProgress?.('detection', 0);
      const detectionStart = Date.now();

      // Inicializar detector se necessário
      if (!optimizedPoseDetectionService.isInitialized) {
        await optimizedPoseDetectionService.initialize();
      }

      const frameAnalyses: FrameAnalysis[] = [];
      const batchSize = PerformanceConfig.video.batchSize;
      const totalBatches = Math.ceil(framePaths.length / batchSize);

      for (let batchIdx = 0; batchIdx < totalBatches; batchIdx++) {
        const batchStart = batchIdx * batchSize;
        const batchEnd = Math.min(batchStart + batchSize, framePaths.length);
        const batchPaths = framePaths.slice(batchStart, batchEnd);

        // Carregar batch de imagens
        const images = await Promise.all(
          batchPaths.map(async (p) => {
            try {
              return await loadImage(p);
            } catch (error) {
              console.error(`Erro ao carregar frame ${p}:`, error);
              return null;
            }
          })
        );

        // Filtrar imagens inválidas
        const validImages = images.filter(img => img !== null);

        if (validImages.length === 0) {
          console.warn(`⚠️ Batch ${batchIdx} não tem imagens válidas`);
          continue;
        }

        // Converter para tensors
        const tensors = validImages.map(img => {
          const canvas = createCanvas(img!.width, img!.height);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img!, 0, 0);

          return tf.browser.fromPixels({
            data: new Uint8Array(ctx.getImageData(0, 0, img!.width, img!.height).data),
            width: img!.width,
            height: img!.height
          } as any, 3);
        });

        // Detectar poses em batch
        const poses = await optimizedPoseDetectionService.detectPoseBatch(tensors, {
          cacheKey: `video_${path.basename(options.videoPath)}_batch_${batchIdx}`
        });

        // Processar resultados
        for (let i = 0; i < poses.length; i++) {
          const pose = poses[i];
          if (!pose) continue;

          const frameNumber = batchStart + i;
          const timestamp = (frameNumber / videoMeta.fps) * 1000;

          try {
            const frameAnalysis = MediaPipeAdapter.createFrameAnalysis({
              pose,
              frameNumber,
              timestamp,
              cameraAngle: options.cameraAngle || ('SAGITTAL_RIGHT' as CameraAngle)
            });

            if (MediaPipeAdapter.validateLandmarks(frameAnalysis.landmarks)) {
              frameAnalyses.push(frameAnalysis);
            } else {
              console.warn(`⚠️ Frame ${frameNumber}: Landmarks de baixa qualidade`);
            }
          } catch (error) {
            console.error(`Erro ao processar frame ${frameNumber}:`, error);
          }
        }

        // Cleanup tensors
        tensors.forEach(t => t.dispose());

        // Progress update
        const progress = ((batchIdx + 1) / totalBatches) * 100;
        options.onProgress?.('detection', progress);

        // Memory cleanup a cada N batches
        if ((batchIdx + 1) % 10 === 0) {
          await tf.disposeVariables();
        }
      }

      stages.detection = Date.now() - detectionStart;
      options.onStageComplete?.('detection', stages.detection);

      console.log(`✅ ${frameAnalyses.length}/${framePaths.length} frames processados com sucesso`);

      if (frameAnalyses.length === 0) {
        throw new Error('Nenhum frame válido processado');
      }

      // 4. ANÁLISE BIOMECÂNICA
      options.onProgress?.('analysis', 0);
      const analysisStart = Date.now();

      const scores = movementScoringService.calculateAllScores({
        exerciseName: options.exerciseName,
        frames: frameAnalyses,
        captureMode: options.captureMode
      });

      console.log('📊 Scores calculados:');
      console.log(`  Motor: ${scores.motor.toFixed(1)}`);
      console.log(`  Stabilizer: ${scores.stabilizer.toFixed(1)}`);
      console.log(`  Symmetry: ${scores.symmetry.toFixed(1)}`);
      console.log(`  Compensation: ${scores.compensation.toFixed(1)}`);
      console.log(`  IGPB: ${scores.igpb.toFixed(1)}`);

      const analysis = biomechanicalAnalyzer.analyze({
        exerciseName: options.exerciseName,
        captureSetup: {
          mode: options.captureMode,
          angles: [options.cameraAngle || ('SAGITTAL_RIGHT' as CameraAngle)],
          fps: videoMeta.fps,
          resolution: { width: videoMeta.width, height: videoMeta.height },
          distanceToSubject: 3.0,
          synchronized: true,
          maxDesyncMs: 16
        },
        frames: frameAnalyses,
        scores
      });

      stages.analysis = Date.now() - analysisStart;
      options.onStageComplete?.('analysis', stages.analysis);

      // 5. CLEANUP
      options.onProgress?.('cleanup', 0);
      const cleanupStart = Date.now();

      await videoExtractionService.cleanupFrames(framesDir);

      stages.cleanup = Date.now() - cleanupStart;
      options.onStageComplete?.('cleanup', stages.cleanup);

      // Resultado final
      const totalTime = Date.now() - startTime;
      const successRate = (frameAnalyses.length / framePaths.length) * 100;

      console.log('✅ Análise biomecânica concluída!');
      console.log(`⏱️ Tempo total: ${(totalTime / 1000).toFixed(2)}s`);
      console.log(`📊 Taxa de sucesso: ${successRate.toFixed(1)}%`);

      return {
        analysis,
        metadata: {
          totalFrames: framePaths.length,
          processedFrames: frameAnalyses.length,
          processingTimeMs: totalTime,
          fps: Math.round((frameAnalyses.length / (totalTime / 1000)) * 100) / 100,
          successRate: Math.round(successRate * 100) / 100,
          stages,
          detectorStats: optimizedPoseDetectionService.getStats()
        }
      };

    } catch (error) {
      console.error('❌ Erro no processamento:', error);
      throw error;
    }
  }

  /**
   * Valida vídeo antes do processamento
   */
  private async validateVideo(videoPath: string): Promise<void> {
    // Verificar se arquivo existe
    if (!await fs.pathExists(videoPath)) {
      throw new Error(`Vídeo não encontrado: ${videoPath}`);
    }

    // Verificar tamanho
    const stats = await fs.stat(videoPath);
    if (stats.size > PerformanceConfig.video.maxVideoSize) {
      const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
      const maxMB = PerformanceConfig.video.maxVideoSize / 1024 / 1024;
      throw new Error(`Vídeo muito grande: ${sizeMB}MB (máx: ${maxMB}MB)`);
    }

    // Verificar formato
    const ext = path.extname(videoPath).toLowerCase().substring(1);
    if (!PerformanceConfig.video.allowedFormats.includes(ext)) {
      throw new Error(
        `Formato não suportado: ${ext}. Formatos aceitos: ${PerformanceConfig.video.allowedFormats.join(', ')}`
      );
    }

    // Verificar se é vídeo válido
    const isValid = await videoExtractionService.isValidVideo(videoPath);
    if (!isValid) {
      throw new Error(`Arquivo não é um vídeo válido: ${videoPath}`);
    }
  }
}

/**
 * Instância singleton do pipeline de batch processing
 */
export const batchVideoProcessingPipeline = new BatchVideoProcessingPipeline();
