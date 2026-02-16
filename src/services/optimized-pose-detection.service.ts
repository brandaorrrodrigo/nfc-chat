/**
 * Serviço Otimizado de Detecção de Poses
 *
 * Versão otimizada com batch processing, cache de frames,
 * garbage collection automático e fila de processamento.
 */

import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-cpu';
import * as tf from '@tensorflow/tfjs';
import { PerformanceConfig } from '../config/performance.config';
import PQueue from 'p-queue';

interface DetectionStats {
  totalFrames: number;
  cacheHits: number;
  cacheMisses: number;
  avgProcessingTime: number;
  totalErrors: number;
}

export class OptimizedPoseDetectionService {
  private detector: poseDetection.PoseDetector | null = null;
  private queue: PQueue;
  private frameCache: Map<string, poseDetection.Pose> = new Map();
  private isInitializing: boolean = false;

  private stats: DetectionStats = {
    totalFrames: 0,
    cacheHits: 0,
    cacheMisses: 0,
    avgProcessingTime: 0,
    totalErrors: 0
  };

  constructor() {
    this.queue = new PQueue({
      concurrency: PerformanceConfig.video.maxConcurrentVideos,
      timeout: 30000  // 30s timeout
    });
  }

  /**
   * Inicializa o detector com backend configurado
   */
  async initialize(): Promise<void> {
    if (this.detector) {
      console.log('⚠️ Detector já inicializado');
      return;
    }

    if (this.isInitializing) {
      console.log('⏳ Detector já está sendo inicializado...');
      while (this.isInitializing) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return;
    }

    this.isInitializing = true;

    try {
      console.log('🚀 Inicializando Optimized Pose Detection Service...');

      // Configurar backend TensorFlow
      await this.configureBackend();

      // Carregar detector
      this.detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: 'SinglePose.Thunder',
          enableSmoothing: true,
          minPoseScore: 0.3
        }
      );

      // Warmup
      console.log('🔥 Executando warmup...');
      const dummyTensor = tf.zeros([256, 256, 3]);
      await this.detector.estimatePoses(dummyTensor as any);
      dummyTensor.dispose();

      console.log('✅ Optimized Pose Detection Service pronto');
      console.log(`📊 Backend: ${tf.getBackend()}`);
      console.log(`🔢 Threads: ${PerformanceConfig.tensorflow.threads}`);
      console.log(`💾 Cache: ${PerformanceConfig.cache.enableFrameCache ? 'Habilitado' : 'Desabilitado'}`);

    } catch (error) {
      console.error('❌ Erro ao inicializar detector:', error);
      throw new Error(`Falha na inicialização do detector: ${(error as Error).message}`);
    } finally {
      this.isInitializing = false;
    }
  }

  /**
   * Configura backend TensorFlow baseado nas configurações
   */
  private async configureBackend(): Promise<void> {
    const backend = PerformanceConfig.tensorflow.backend;

    try {
      if (backend === 'gpu') {
        // Tentar carregar backend GPU (requer @tensorflow/tfjs-node-gpu)
        try {
          await require('@tensorflow/tfjs-node-gpu');
          await tf.setBackend('tensorflow');
          console.log('✅ Backend GPU configurado');
        } catch (error) {
          console.warn('⚠️ GPU não disponível, usando CPU');
          await tf.setBackend('cpu');
        }
      } else if (backend === 'cpu') {
        // Tentar carregar backend CPU nativo (requer @tensorflow/tfjs-node)
        try {
          await require('@tensorflow/tfjs-node');
          await tf.setBackend('tensorflow');
          console.log('✅ Backend CPU nativo configurado');
        } catch (error) {
          console.warn('⚠️ tfjs-node não disponível, usando WASM');
          await tf.setBackend('wasm');
        }
      } else {
        // Fallback para WASM
        await tf.setBackend('wasm');
        console.log('✅ Backend WASM configurado');
      }

      await tf.ready();
    } catch (error) {
      console.warn('⚠️ Erro ao configurar backend, usando fallback WASM');
      await tf.setBackend('wasm');
      await tf.ready();
    }
  }

  /**
   * Processa batch de frames (principal método otimizado)
   */
  async detectPoseBatch(
    frames: any[],
    options?: { cacheKey?: string }
  ): Promise<(poseDetection.Pose | null)[]> {
    if (!this.detector) {
      throw new Error('Detector não inicializado. Chame initialize() primeiro.');
    }

    return this.queue.add(async () => {
      const results: (poseDetection.Pose | null)[] = [];

      for (let i = 0; i < frames.length; i++) {
        const cacheKey = options?.cacheKey ? `${options.cacheKey}_${i}` : null;

        // Verificar cache
        if (cacheKey && this.frameCache.has(cacheKey) && PerformanceConfig.cache.enableFrameCache) {
          results.push(this.frameCache.get(cacheKey)!);
          this.stats.cacheHits++;
          continue;
        }

        // Processar frame
        const startTime = Date.now();

        try {
          const poses = await this.detector!.estimatePoses(frames[i]);
          const pose = poses.length > 0 ? poses[0] : null;

          results.push(pose);

          // Cachear resultado
          if (cacheKey && pose && PerformanceConfig.cache.enableFrameCache) {
            this.frameCache.set(cacheKey, pose);

            // Limpar cache se muito grande
            if (this.frameCache.size > PerformanceConfig.cache.maxCacheSize) {
              const firstKey = this.frameCache.keys().next().value;
              if (firstKey) {
                this.frameCache.delete(firstKey);
              }
            }
          }

          // Atualizar stats
          const processingTime = Date.now() - startTime;
          this.stats.totalFrames++;
          this.stats.cacheMisses++;
          this.stats.avgProcessingTime =
            (this.stats.avgProcessingTime * (this.stats.totalFrames - 1) + processingTime) /
            this.stats.totalFrames;

        } catch (error) {
          console.error(`Erro ao processar frame ${i}:`, error);
          this.stats.totalErrors++;
          results.push(null);
        }

        // Garbage collection periódico
        if (this.stats.totalFrames % 100 === 0 && PerformanceConfig.memory.enableMemoryMonitoring) {
          await this.runGarbageCollection();
        }
      }

      return results;
    }) as Promise<(poseDetection.Pose | null)[]>;
  }

  /**
   * Processa frame único (wrapper para batch)
   */
  async detectPose(frame: any): Promise<poseDetection.Pose | null> {
    const results = await this.detectPoseBatch([frame]);
    return results[0];
  }

  /**
   * Garbage collection manual
   */
  private async runGarbageCollection(): Promise<void> {
    const before = tf.memory();
    await tf.disposeVariables();
    const after = tf.memory();

    if (PerformanceConfig.tensorflow.enableProfiling) {
      console.log(`🗑️ GC: ${before.numTensors} → ${after.numTensors} tensors`);
    }
  }

  /**
   * Obter estatísticas de performance
   */
  getStats() {
    const cacheHitRate = this.stats.cacheHits + this.stats.cacheMisses > 0
      ? (this.stats.cacheHits / (this.stats.cacheHits + this.stats.cacheMisses)) * 100
      : 0;

    return {
      ...this.stats,
      cacheSize: this.frameCache.size,
      cacheHitRate: Math.round(cacheHitRate * 100) / 100,
      queueSize: this.queue.size,
      queuePending: this.queue.pending,
      memoryUsage: tf.memory()
    };
  }

  /**
   * Limpar cache de frames
   */
  clearCache(): void {
    this.frameCache.clear();
    console.log('🗑️ Cache de frames limpo');
  }

  /**
   * Reset de estatísticas
   */
  resetStats(): void {
    this.stats = {
      totalFrames: 0,
      cacheHits: 0,
      cacheMisses: 0,
      avgProcessingTime: 0,
      totalErrors: 0
    };
    console.log('📊 Estatísticas resetadas');
  }

  /**
   * Verifica se detector está inicializado
   */
  get isInitialized(): boolean {
    return this.detector !== null;
  }

  /**
   * Descarta detector e libera recursos
   */
  async dispose(): Promise<void> {
    if (this.detector) {
      console.log('🗑️ Descartando detector...');

      this.frameCache.clear();
      await this.detector.dispose();
      this.detector = null;

      // Garbage collection final
      await tf.disposeVariables();

      console.log('✅ Detector descartado');
    }
  }
}

/**
 * Instância singleton do serviço otimizado
 */
export const optimizedPoseDetectionService = new OptimizedPoseDetectionService();
