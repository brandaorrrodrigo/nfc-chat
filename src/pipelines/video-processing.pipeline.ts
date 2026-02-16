/**
 * Pipeline de Processamento de Vídeo
 *
 * Orquestra o processamento completo de vídeos:
 * 1. Extração de frames
 * 2. Detecção de poses
 * 3. Cálculo de scores
 * 4. Análise biomecânica completa
 */

import type {
  CaptureMode,
  CameraAngle,
  FrameAnalysis,
  BiomechanicalAnalysis
} from '../types/biomechanical-analysis.types';
import { poseDetectionService } from '../services/pose-detection.service';
import { videoExtractionService } from '../services/video-extraction.service';
import { movementScoringService } from '../services/movement-scoring.service';
import { biomechanicalAnalyzer } from '../engines/biomechanical-analyzer.engine';
import { MediaPipeAdapter } from '../adapters/mediapipe.adapter';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);

/**
 * Opções de processamento de vídeo
 */
export interface ProcessingOptions {
  /** Caminho do vídeo */
  videoPath: string;
  /** Nome do exercício */
  exerciseName: string;
  /** Modo de captura */
  captureMode: CaptureMode;
  /** Ângulo da câmera (default: SAGITTAL_RIGHT) */
  cameraAngle?: CameraAngle;
  /** Callback de progresso (0-100) */
  onProgress?: (progress: number) => void;
  /** Se deve extrair frames (false = usar frames já extraídos) */
  extractFrames?: boolean;
  /** Diretório de frames (se extractFrames = false) */
  framesDir?: string;
  /** FPS de extração (default: fps original) */
  fps?: number;
  /** Limite de frames a processar */
  maxFrames?: number;
}

/**
 * Resultado do processamento
 */
export interface ProcessingResult {
  /** Análise biomecânica completa */
  analysis: BiomechanicalAnalysis;
  /** Metadados do processamento */
  metadata: {
    /** Total de frames extraídos */
    totalFrames: number;
    /** Frames processados com sucesso */
    processedFrames: number;
    /** Tempo de processamento em ms */
    processingTimeMs: number;
    /** FPS médio de processamento */
    fps: number;
    /** Taxa de sucesso (%) */
    successRate: number;
  };
  /** Caminho dos frames (se não foi cleanup) */
  framesPath?: string;
}

/**
 * Opções para processamento multi-ângulo
 */
export interface MultiAngleOptions {
  /** Caminhos dos vídeos (1 por ângulo) */
  videoPaths: string[];
  /** Ângulos correspondentes aos vídeos */
  cameraAngles: CameraAngle[];
  /** Nome do exercício */
  exerciseName: string;
  /** Modo de captura */
  captureMode: CaptureMode;
  /** Callback de progresso (0-100) */
  onProgress?: (progress: number) => void;
  /** FPS de extração */
  fps?: number;
  /** Limite de frames */
  maxFrames?: number;
}

/**
 * Pipeline de processamento de vídeo
 */
class VideoProcessingPipeline {
  /**
   * Processa um vídeo completo
   * @param options - Opções de processamento
   * @returns Resultado da análise
   */
  async process(options: ProcessingOptions): Promise<ProcessingResult> {
    const startTime = Date.now();

    // 1. Validação inicial
    await this.validateOptions(options);

    // 2. Inicializar detector se necessário
    if (!poseDetectionService.isInitialized()) {
      console.log('🤖 Inicializando detector MediaPipe...');
      await poseDetectionService.initialize();
    }

    // 3. Extração ou carregamento de frames
    let framePaths: string[];
    let videoMetadata;

    if (options.extractFrames !== false) {
      console.log('📹 Extraindo frames do vídeo...');
      videoMetadata = await videoExtractionService.getVideoMetadata(
        options.videoPath
      );

      const framesDir = path.join(
        '/tmp',
        `nfv-frames-${Date.now()}`
      );

      framePaths = await videoExtractionService.extractFrames(
        options.videoPath,
        {
          outputDir: framesDir,
          fps: options.fps || videoMetadata.fps,
          maxFrames: options.maxFrames,
          format: 'jpg',
          quality: 85,
          onProgress: (progress) => {
            if (options.onProgress) {
              options.onProgress(progress * 0.3); // 0-30% para extração
            }
          }
        }
      );
    } else {
      if (!options.framesDir) {
        throw new Error(
          'framesDir é obrigatório quando extractFrames = false'
        );
      }
      framePaths = await this.loadFramePaths(options.framesDir);
    }

    console.log(`📊 Total de frames a processar: ${framePaths.length}`);

    // 4. Processamento frame-by-frame
    console.log('🔍 Detectando poses...');
    const frameAnalyses: FrameAnalysis[] = [];
    const totalFrames = framePaths.length;

    for (let i = 0; i < framePaths.length; i++) {
      try {
        // Progress callback (30-80% para detecção)
        if (options.onProgress) {
          const progress = 30 + (i / totalFrames) * 50;
          options.onProgress(progress);
        }

        // Carregar frame como ImageData
        const imageData = await videoExtractionService.loadFrameAsImageData(
          framePaths[i]
        );

        // Detectar pose
        const pose = await poseDetectionService.detectPose(imageData);

        if (!pose) {
          console.warn(`⚠️  Frame ${i}: Nenhuma pose detectada`);
          continue;
        }

        // Converter para FrameAnalysis
        const frameAnalysis = MediaPipeAdapter.createFrameAnalysis({
          pose,
          frameNumber: i,
          timestamp: videoMetadata
            ? (i / videoMetadata.fps) * 1000
            : i * 16.67, // ~60fps
          cameraAngle: options.cameraAngle || ('SAGITTAL_RIGHT' as CameraAngle)
        });

        // Validar qualidade dos landmarks
        if (MediaPipeAdapter.validateLandmarks(frameAnalysis.landmarks)) {
          frameAnalyses.push(frameAnalysis);
        } else {
          console.warn(`⚠️  Frame ${i}: Landmarks de baixa qualidade`);
        }
      } catch (error) {
        console.error(`❌ Erro ao processar frame ${i}:`, error);
      }
    }

    const processingTime = Date.now() - startTime;

    console.log(
      `✅ ${frameAnalyses.length}/${totalFrames} frames processados com sucesso`
    );

    if (frameAnalyses.length === 0) {
      throw new Error('Nenhum frame válido processado');
    }

    // 5. Calcular scores de movimento
    console.log('📊 Calculando scores de movimento...');
    if (options.onProgress) {
      options.onProgress(85);
    }

    const scores = movementScoringService.calculateAllScores({
      exerciseName: options.exerciseName,
      frames: frameAnalyses,
      captureMode: options.captureMode
    });

    console.log('Scores calculados:');
    console.log(`  Motor: ${scores.motor.toFixed(1)}`);
    console.log(`  Stabilizer: ${scores.stabilizer.toFixed(1)}`);
    console.log(`  Symmetry: ${scores.symmetry.toFixed(1)}`);
    console.log(`  Compensation: ${scores.compensation.toFixed(1)}`);
    console.log(`  IGPB: ${scores.igpb.toFixed(1)}`);

    // 6. Executar análise biomecânica completa
    console.log('🔬 Executando análise biomecânica...');
    if (options.onProgress) {
      options.onProgress(95);
    }

    const analysis = biomechanicalAnalyzer.analyze({
      exerciseName: options.exerciseName,
      captureSetup: {
        mode: options.captureMode,
        angles: [options.cameraAngle || ('SAGITTAL_RIGHT' as CameraAngle)],
        fps: videoMetadata?.fps || 60,
        resolution: {
          width: videoMetadata?.width || 1920,
          height: videoMetadata?.height || 1080
        },
        distanceToSubject: 3.0, // TODO: implementar detecção automática
        synchronized: true,
        maxDesyncMs: 16
      },
      frames: frameAnalyses,
      scores
    });

    // 7. Cleanup (se frames foram extraídos)
    if (options.extractFrames !== false && framePaths.length > 0) {
      const framesDir = path.dirname(framePaths[0]);
      await videoExtractionService.cleanupFrames(framesDir);
    }

    // 8. Finalizar
    if (options.onProgress) {
      options.onProgress(100);
    }

    console.log('✅ Análise biomecânica concluída!');

    return {
      analysis,
      metadata: {
        totalFrames: framePaths.length,
        processedFrames: frameAnalyses.length,
        processingTimeMs: processingTime,
        fps: Math.round((frameAnalyses.length / processingTime) * 1000 * 100) / 100,
        successRate: Math.round((frameAnalyses.length / framePaths.length) * 10000) / 100
      },
      framesPath:
        options.extractFrames === false ? options.framesDir : undefined
    };
  }

  /**
   * Processa múltiplos vídeos (múltiplos ângulos sincronizados)
   * @param options - Opções de processamento multi-ângulo
   * @returns Resultado da análise
   */
  async processMultipleAngles(
    options: MultiAngleOptions
  ): Promise<ProcessingResult> {
    // Validar que número de vídeos = número de ângulos
    if (options.videoPaths.length !== options.cameraAngles.length) {
      throw new Error(
        'Número de vídeos deve ser igual ao número de ângulos'
      );
    }

    console.log(
      `🎥 Processando ${options.videoPaths.length} vídeos (modo ${options.captureMode})`
    );

    const startTime = Date.now();
    const allFrameAnalyses: FrameAnalysis[] = [];

    // Processar cada vídeo
    for (let i = 0; i < options.videoPaths.length; i++) {
      const videoPath = options.videoPaths[i];
      const cameraAngle = options.cameraAngles[i];

      console.log(`\n📹 Processando vídeo ${i + 1}/${options.videoPaths.length} (${cameraAngle})`);

      const result = await this.process({
        videoPath,
        exerciseName: options.exerciseName,
        captureMode: options.captureMode,
        cameraAngle,
        fps: options.fps,
        maxFrames: options.maxFrames,
        onProgress: (progress) => {
          if (options.onProgress) {
            const totalProgress =
              (i / options.videoPaths.length) * 100 +
              (progress / options.videoPaths.length);
            options.onProgress(totalProgress);
          }
        }
      });

      // Adicionar frames deste ângulo
      allFrameAnalyses.push(...result.analysis.rawData!.frames);
    }

    // Sincronizar frames por timestamp (se necessário)
    const syncedFrames = this.synchronizeFrames(allFrameAnalyses);

    // Recalcular scores com todos os ângulos
    const scores = movementScoringService.calculateAllScores({
      exerciseName: options.exerciseName,
      frames: syncedFrames,
      captureMode: options.captureMode
    });

    // Análise biomecânica final
    const analysis = biomechanicalAnalyzer.analyze({
      exerciseName: options.exerciseName,
      captureSetup: {
        mode: options.captureMode,
        angles: options.cameraAngles,
        fps: 60,
        resolution: { width: 1920, height: 1080 },
        distanceToSubject: 3.0,
        synchronized: true,
        maxDesyncMs: 16
      },
      frames: syncedFrames,
      scores
    });

    const processingTime = Date.now() - startTime;

    return {
      analysis,
      metadata: {
        totalFrames: allFrameAnalyses.length,
        processedFrames: syncedFrames.length,
        processingTimeMs: processingTime,
        fps: Math.round((syncedFrames.length / processingTime) * 1000 * 100) / 100,
        successRate: 100
      }
    };
  }

  /**
   * Sincroniza frames de múltiplos ângulos por timestamp
   * @param frames - Frames de todos os ângulos
   * @returns Frames sincronizados
   * @private
   */
  private synchronizeFrames(frames: FrameAnalysis[]): FrameAnalysis[] {
    // Agrupar por timestamp (tolerância de 16ms = ~60fps)
    const groups = new Map<number, FrameAnalysis[]>();
    const tolerance = 16; // ms

    for (const frame of frames) {
      // Encontrar grupo mais próximo
      let foundGroup = false;
      for (const [timestamp, group] of Array.from(groups.entries())) {
        if (Math.abs(frame.timestamp - timestamp) <= tolerance) {
          group.push(frame);
          foundGroup = true;
          break;
        }
      }

      if (!foundGroup) {
        groups.set(frame.timestamp, [frame]);
      }
    }

    // Retornar frames sincronizados (todos os grupos com pelo menos 1 frame)
    const syncedFrames: FrameAnalysis[] = [];
    for (const group of Array.from(groups.values())) {
      syncedFrames.push(...group);
    }

    return syncedFrames.sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Carrega caminhos de frames de um diretório
   * @param dir - Diretório com frames
   * @returns Array de caminhos
   * @private
   */
  private async loadFramePaths(dir: string): Promise<string[]> {
    const files = await readdir(dir);

    const framePaths = files
      .filter((f) => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'))
      .sort()
      .map((f) => path.join(dir, f));

    if (framePaths.length === 0) {
      throw new Error(`Nenhum frame encontrado em ${dir}`);
    }

    return framePaths;
  }

  /**
   * Valida opções de processamento
   * @param options - Opções a validar
   * @private
   */
  private async validateOptions(options: ProcessingOptions): Promise<void> {
    // Validar vídeo existe (se extractFrames = true)
    if (options.extractFrames !== false) {
      if (!fs.existsSync(options.videoPath)) {
        throw new Error(`Vídeo não encontrado: ${options.videoPath}`);
      }

      // Validar que é vídeo válido
      const isValid = await videoExtractionService.isValidVideo(
        options.videoPath
      );
      if (!isValid) {
        throw new Error(`Arquivo não é um vídeo válido: ${options.videoPath}`);
      }
    }

    // Validar framesDir existe (se extractFrames = false)
    if (options.extractFrames === false) {
      if (!options.framesDir) {
        throw new Error('framesDir é obrigatório quando extractFrames = false');
      }
      if (!fs.existsSync(options.framesDir)) {
        throw new Error(`Diretório de frames não encontrado: ${options.framesDir}`);
      }
    }

    // Validar exerciseName
    if (!options.exerciseName || options.exerciseName.trim().length === 0) {
      throw new Error('exerciseName é obrigatório');
    }

    // Validar captureMode
    if (!options.captureMode) {
      throw new Error('captureMode é obrigatório');
    }
  }
}

/**
 * Instância singleton do pipeline de processamento
 */
export const videoProcessingPipeline = new VideoProcessingPipeline();
