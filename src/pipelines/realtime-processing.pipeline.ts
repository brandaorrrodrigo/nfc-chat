/**
 * Pipeline de Processamento em Tempo Real
 *
 * Processa frames em tempo real conforme são capturados,
 * ideal para análise ao vivo via webcam ou stream de vídeo.
 */

import type {
  CaptureMode,
  CameraAngle,
  FrameAnalysis,
  BiomechanicalAnalysis
} from '../types/biomechanical-analysis.types';
import { poseDetectionService } from '../services/pose-detection.service';
import { movementScoringService } from '../services/movement-scoring.service';
import { biomechanicalAnalyzer } from '../engines/biomechanical-analyzer.engine';
import { MediaPipeAdapter } from '../adapters/mediapipe.adapter';

/**
 * Opções para processamento em tempo real
 */
export interface RealtimeOptions {
  /** Nome do exercício */
  exerciseName: string;
  /** Modo de captura */
  captureMode: CaptureMode;
  /** Ângulo da câmera */
  cameraAngle: CameraAngle;
  /** Callback quando frame é processado */
  onFrameProcessed?: (frame: FrameAnalysis, quality: number) => void;
  /** Callback quando análise completa */
  onAnalysisComplete?: (analysis: BiomechanicalAnalysis) => void;
  /** Tamanho do buffer antes de análise (default: 60 frames) */
  bufferSize?: number;
  /** Auto-análise quando buffer atinge tamanho (default: true) */
  autoAnalyze?: boolean;
  /** Intervalo de auto-análise em frames (default: bufferSize) */
  analyzeInterval?: number;
}

/**
 * Estatísticas de processamento em tempo real
 */
export interface RealtimeStats {
  /** Total de frames recebidos */
  totalFrames: number;
  /** Frames processados com sucesso */
  processedFrames: number;
  /** Frames descartados (baixa qualidade) */
  droppedFrames: number;
  /** FPS médio de processamento */
  avgFps: number;
  /** Tempo médio por frame (ms) */
  avgProcessingTime: number;
  /** Tempo total de sessão (ms) */
  totalTime: number;
}

/**
 * Pipeline de processamento em tempo real
 */
class RealtimeProcessingPipeline {
  private frameBuffer: FrameAnalysis[] = [];
  private isProcessing: boolean = false;
  private startTime: number = 0;
  private options: RealtimeOptions | null = null;
  private frameCount: number = 0;
  private processedCount: number = 0;
  private droppedCount: number = 0;
  private processingTimes: number[] = [];
  private lastAnalysisFrame: number = 0;

  /**
   * Inicia sessão de processamento em tempo real
   * @param options - Opções de processamento
   */
  async start(options: RealtimeOptions): Promise<void> {
    if (this.isProcessing) {
      throw new Error('Sessão já está em andamento. Chame stop() primeiro.');
    }

    console.log('🎥 Iniciando processamento em tempo real...');

    // Inicializar detector se necessário
    if (!poseDetectionService.isInitialized()) {
      console.log('🤖 Inicializando detector MediaPipe...');
      await poseDetectionService.initialize();
    }

    // Resetar estado
    this.frameBuffer = [];
    this.frameCount = 0;
    this.processedCount = 0;
    this.droppedCount = 0;
    this.processingTimes = [];
    this.lastAnalysisFrame = 0;
    this.startTime = Date.now();
    this.isProcessing = true;
    this.options = {
      bufferSize: 60,
      autoAnalyze: true,
      ...options
    };

    console.log(`✅ Sessão iniciada (buffer: ${this.options.bufferSize} frames)`);
  }

  /**
   * Processa um frame em tempo real
   * @param imageData - Dados da imagem
   * @returns Promise que resolve quando frame é processado
   */
  async processFrame(imageData: ImageData): Promise<void> {
    if (!this.isProcessing) {
      throw new Error('Sessão não iniciada. Chame start() primeiro.');
    }

    const frameStartTime = Date.now();
    this.frameCount++;

    try {
      // Detectar pose
      const pose = await poseDetectionService.detectPose(imageData);

      if (!pose) {
        this.droppedCount++;
        console.warn(`⚠️  Frame ${this.frameCount}: Nenhuma pose detectada`);
        return;
      }

      // Converter para FrameAnalysis
      const frameAnalysis = MediaPipeAdapter.createFrameAnalysis({
        pose,
        frameNumber: this.frameCount - 1,
        timestamp: Date.now() - this.startTime,
        cameraAngle: this.options!.cameraAngle
      });

      // Validar qualidade
      const quality = MediaPipeAdapter.calculateLandmarkQuality(
        frameAnalysis.landmarks
      );

      if (!MediaPipeAdapter.validateLandmarks(frameAnalysis.landmarks)) {
        this.droppedCount++;
        console.warn(
          `⚠️  Frame ${this.frameCount}: Landmarks de baixa qualidade (${quality}%)`
        );
        return;
      }

      // Adicionar ao buffer
      this.frameBuffer.push(frameAnalysis);
      this.processedCount++;

      // Registrar tempo de processamento
      const processingTime = Date.now() - frameStartTime;
      this.processingTimes.push(processingTime);

      // Callback de frame processado
      if (this.options!.onFrameProcessed) {
        this.options!.onFrameProcessed(frameAnalysis, quality);
      }

      // Auto-análise se buffer atingiu tamanho ou intervalo
      if (this.options!.autoAnalyze) {
        const interval = this.options!.analyzeInterval || this.options!.bufferSize!;
        const framesSinceLastAnalysis = this.processedCount - this.lastAnalysisFrame;

        if (framesSinceLastAnalysis >= interval) {
          await this.triggerAnalysis();
          this.lastAnalysisFrame = this.processedCount;
        }
      }
    } catch (error) {
      console.error(`❌ Erro ao processar frame ${this.frameCount}:`, error);
      this.droppedCount++;
    }
  }

  /**
   * Dispara análise biomecânica com frames do buffer
   * @returns Análise biomecânica ou null se buffer vazio
   * @private
   */
  private async triggerAnalysis(): Promise<BiomechanicalAnalysis | null> {
    if (this.frameBuffer.length < 10) {
      console.warn('⚠️  Buffer insuficiente para análise (mínimo 10 frames)');
      return null;
    }

    console.log(`🔬 Executando análise com ${this.frameBuffer.length} frames...`);

    try {
      // Calcular scores
      const scores = movementScoringService.calculateAllScores({
        exerciseName: this.options!.exerciseName,
        frames: this.frameBuffer,
        captureMode: this.options!.captureMode
      });

      // Análise biomecânica
      const analysis = biomechanicalAnalyzer.analyze({
        exerciseName: this.options!.exerciseName,
        captureSetup: {
          mode: this.options!.captureMode,
          angles: [this.options!.cameraAngle],
          fps: this.getAvgFps(),
          resolution: { width: 1920, height: 1080 }, // Assumido
          distanceToSubject: 3.0,
          synchronized: true,
          maxDesyncMs: 16
        },
        frames: this.frameBuffer,
        scores
      });

      // Callback de análise completa
      if (this.options!.onAnalysisComplete) {
        this.options!.onAnalysisComplete(analysis);
      }

      console.log(`✅ Análise concluída (IGPB: ${scores.igpb.toFixed(1)})`);

      return analysis;
    } catch (error) {
      console.error('❌ Erro ao executar análise:', error);
      return null;
    }
  }

  /**
   * Para sessão e executa análise final
   * @returns Análise biomecânica final ou null
   */
  async stop(): Promise<BiomechanicalAnalysis | null> {
    if (!this.isProcessing) {
      console.warn('⚠️  Nenhuma sessão ativa');
      return null;
    }

    console.log('🛑 Parando sessão...');

    this.isProcessing = false;

    // Análise final se há frames no buffer
    let finalAnalysis: BiomechanicalAnalysis | null = null;

    if (this.frameBuffer.length > 0) {
      console.log(`📊 Executando análise final...`);
      finalAnalysis = await this.triggerAnalysis();
    }

    // Exibir estatísticas
    const stats = this.getStats();
    console.log('\n📈 Estatísticas da Sessão:');
    console.log(`   Total de frames: ${stats.totalFrames}`);
    console.log(`   Processados: ${stats.processedFrames}`);
    console.log(`   Descartados: ${stats.droppedFrames}`);
    console.log(`   FPS médio: ${stats.avgFps.toFixed(1)}`);
    console.log(`   Tempo médio/frame: ${stats.avgProcessingTime.toFixed(1)}ms`);
    console.log(`   Tempo total: ${(stats.totalTime / 1000).toFixed(1)}s`);

    return finalAnalysis;
  }

  /**
   * Reseta o pipeline sem parar a sessão
   */
  reset(): void {
    if (!this.isProcessing) {
      console.warn('⚠️  Nenhuma sessão ativa');
      return;
    }

    console.log('🔄 Resetando buffer...');
    this.frameBuffer = [];
    this.lastAnalysisFrame = this.processedCount;
  }

  /**
   * Limpa apenas o buffer mantendo estatísticas
   */
  clearBuffer(): void {
    this.frameBuffer = [];
  }

  /**
   * Obtém estatísticas de processamento
   * @returns Estatísticas da sessão
   */
  getStats(): RealtimeStats {
    const totalTime = Date.now() - this.startTime;
    const avgFps = (this.processedCount / totalTime) * 1000;
    const avgProcessingTime =
      this.processingTimes.length > 0
        ? this.processingTimes.reduce((sum, t) => sum + t, 0) /
          this.processingTimes.length
        : 0;

    return {
      totalFrames: this.frameCount,
      processedFrames: this.processedCount,
      droppedFrames: this.droppedCount,
      avgFps: Math.round(avgFps * 100) / 100,
      avgProcessingTime: Math.round(avgProcessingTime * 100) / 100,
      totalTime
    };
  }

  /**
   * Obtém FPS médio atual
   * @returns FPS médio
   * @private
   */
  private getAvgFps(): number {
    const stats = this.getStats();
    return Math.min(60, Math.max(30, stats.avgFps)); // Limitar entre 30-60
  }

  /**
   * Verifica se sessão está ativa
   * @returns true se ativa
   */
  isActive(): boolean {
    return this.isProcessing;
  }

  /**
   * Obtém número de frames no buffer
   * @returns Tamanho do buffer
   */
  getBufferSize(): number {
    return this.frameBuffer.length;
  }

  /**
   * Obtém frames do buffer atual (cópia)
   * @returns Array de frames
   */
  getBufferFrames(): FrameAnalysis[] {
    return [...this.frameBuffer];
  }

  /**
   * Define tamanho máximo do buffer (limita frames antigos)
   * @param maxSize - Tamanho máximo
   */
  setMaxBufferSize(maxSize: number): void {
    if (this.frameBuffer.length > maxSize) {
      // Manter apenas os mais recentes
      this.frameBuffer = this.frameBuffer.slice(-maxSize);
    }

    if (this.options) {
      this.options.bufferSize = maxSize;
    }
  }

  /**
   * Executa análise manual (sem aguardar intervalo)
   * @returns Análise biomecânica ou null
   */
  async analyzeNow(): Promise<BiomechanicalAnalysis | null> {
    if (!this.isProcessing) {
      throw new Error('Sessão não iniciada');
    }

    return this.triggerAnalysis();
  }

  /**
   * Obtém qualidade média dos frames no buffer
   * @returns Qualidade média (0-100)
   */
  getAverageQuality(): number {
    if (this.frameBuffer.length === 0) return 0;

    const qualities = this.frameBuffer.map((frame) =>
      MediaPipeAdapter.calculateLandmarkQuality(frame.landmarks)
    );

    const avg = qualities.reduce((sum, q) => sum + q, 0) / qualities.length;
    return Math.round(avg * 100) / 100;
  }

  /**
   * Obtém último frame processado
   * @returns Último frame ou null
   */
  getLastFrame(): FrameAnalysis | null {
    if (this.frameBuffer.length === 0) return null;
    return this.frameBuffer[this.frameBuffer.length - 1];
  }
}

/**
 * Instância singleton do pipeline em tempo real
 */
export const realtimeProcessingPipeline = new RealtimeProcessingPipeline();
