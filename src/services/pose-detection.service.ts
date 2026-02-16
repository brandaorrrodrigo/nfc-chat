/**
 * Serviço de Detecção de Poses
 *
 * Gerencia o detector MediaPipe/TensorFlow.js para detecção
 * de poses humanas em imagens e vídeos.
 */

import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs'; // Backend Web (alternativa funcional)
import '@tensorflow/tfjs-backend-cpu';
import * as tf from '@tensorflow/tfjs';

/**
 * Configuração do modelo de detecção
 */
interface DetectorConfig {
  modelType?: 'SinglePose.Lightning' | 'SinglePose.Thunder' | 'MultiPose.Lightning';
  enableSmoothing?: boolean;
  minPoseScore?: number;
  multiPoseMaxDimension?: number;
}

/**
 * Serviço singleton para detecção de poses
 */
class PoseDetectionService {
  private detector: poseDetection.PoseDetector | null = null;
  private isInitializing: boolean = false;

  private defaultConfig: any = {
    modelType: 'SinglePose.Thunder',
    enableSmoothing: true,
    minPoseScore: 0.3
  };

  /**
   * Inicializa o detector MediaPipe
   * @param config - Configuração opcional do detector
   * @throws Error se inicialização falhar
   */
  async initialize(config?: DetectorConfig): Promise<void> {
    if (this.detector) {
      console.log('⚠️  Detector já inicializado');
      return;
    }

    if (this.isInitializing) {
      console.log('⏳ Detector já está sendo inicializado...');
      // Aguardar inicialização
      while (this.isInitializing) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return;
    }

    this.isInitializing = true;

    try {
      console.log('🤖 Inicializando detector MediaPipe MoveNet...');

      // Configurar backend CPU (TensorFlow.js Web)
      await tf.setBackend('cpu');
      await tf.ready();
      console.log(`✅ TensorFlow.js ${tf.version.tfjs} - Backend: ${tf.getBackend()}`);

      // Merge config
      const modelConfig = {
        ...this.defaultConfig,
        ...config
      };

      // Criar detector
      this.detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        modelConfig
      );

      console.log('✅ Detector inicializado com sucesso');

      // Warmup: detectar em imagem dummy para otimizar primeira execução
      console.log('🔥 Executando warmup...');
      await this.warmup();
      console.log('✅ Warmup concluído');
    } catch (error) {
      console.error('❌ Erro ao inicializar detector:', error);
      throw new Error(`Falha na inicialização do detector: ${(error as Error).message}`);
    } finally {
      this.isInitializing = false;
    }
  }

  /**
   * Executa warmup do modelo com imagem dummy
   * @private
   */
  private async warmup(): Promise<void> {
    if (!this.detector) {
      throw new Error('Detector não inicializado');
    }

    try {
      // Criar tensor dummy 256x256x3 (RGB)
      const dummyImage = tf.zeros([256, 256, 3]);

      // Detectar pose (descarta resultado)
      await this.detector.estimatePoses(dummyImage as any);

      // Liberar memória
      dummyImage.dispose();
    } catch (error) {
      console.warn('⚠️  Warmup falhou (não crítico):', error);
    }
  }

  /**
   * Detecta uma pose em uma imagem
   * @param imageData - Dados da imagem (ImageData ou Tensor3D)
   * @returns Pose detectada ou null se nenhuma encontrada
   * @throws Error se detector não inicializado
   */
  async detectPose(
    imageData: ImageData | tf.Tensor3D
  ): Promise<poseDetection.Pose | null> {
    if (!this.detector) {
      throw new Error(
        'Detector não inicializado. Chame initialize() primeiro.'
      );
    }

    try {
      const poses = await this.detector.estimatePoses(imageData as any);

      // Retornar primeira pose ou null
      return poses.length > 0 ? poses[0] : null;
    } catch (error) {
      console.error('❌ Erro ao detectar pose:', error);
      return null;
    }
  }

  /**
   * Detecta múltiplas poses em uma imagem
   * @param imageData - Dados da imagem
   * @returns Array de poses detectadas (pode ser vazio)
   * @throws Error se detector não inicializado
   */
  async detectPoses(
    imageData: ImageData | tf.Tensor3D
  ): Promise<poseDetection.Pose[]> {
    if (!this.detector) {
      throw new Error(
        'Detector não inicializado. Chame initialize() primeiro.'
      );
    }

    try {
      const poses = await this.detector.estimatePoses(imageData as any);
      return poses;
    } catch (error) {
      console.error('❌ Erro ao detectar poses:', error);
      return [];
    }
  }

  /**
   * Detecta pose com retry em caso de falha
   * @param imageData - Dados da imagem
   * @param maxRetries - Número máximo de tentativas
   * @returns Pose detectada ou null
   */
  async detectPoseWithRetry(
    imageData: ImageData | tf.Tensor3D,
    maxRetries: number = 3
  ): Promise<poseDetection.Pose | null> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.detectPose(imageData);
      } catch (error) {
        lastError = error as Error;
        console.warn(`⚠️  Tentativa ${attempt}/${maxRetries} falhou:`, error);

        if (attempt < maxRetries) {
          // Aguardar antes de retry (backoff exponencial)
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 100)
          );
        }
      }
    }

    console.error(
      `❌ Todas as ${maxRetries} tentativas falharam:`,
      lastError
    );
    return null;
  }

  /**
   * Verifica se o detector está inicializado
   * @returns true se inicializado
   */
  isInitialized(): boolean {
    return this.detector !== null;
  }

  /**
   * Descarta o detector e libera recursos
   */
  async dispose(): Promise<void> {
    if (this.detector) {
      console.log('🗑️  Descartando detector...');
      this.detector.dispose();
      this.detector = null;
      console.log('✅ Detector descartado');
    }
  }

  /**
   * Reinicializa o detector (útil para trocar configuração)
   * @param config - Nova configuração
   */
  async reinitialize(config?: DetectorConfig): Promise<void> {
    await this.dispose();
    await this.initialize(config);
  }

  /**
   * Obtém informações do detector atual
   * @returns Objeto com informações do detector
   */
  getInfo(): {
    initialized: boolean;
    modelType: string;
    backend: string;
  } {
    return {
      initialized: this.isInitialized(),
      modelType: this.defaultConfig.modelType || 'SINGLEPOSE_THUNDER',
      backend: tf.getBackend()
    };
  }

  /**
   * Estima tempo de processamento para um frame
   * @param imageData - Dados da imagem
   * @returns Tempo em ms
   */
  async benchmarkFrame(imageData: ImageData | tf.Tensor3D): Promise<number> {
    const startTime = Date.now();
    await this.detectPose(imageData);
    return Date.now() - startTime;
  }

  /**
   * Executa benchmark de performance
   * @param iterations - Número de iterações
   * @returns Estatísticas de performance
   */
  async benchmark(iterations: number = 10): Promise<{
    avgTime: number;
    minTime: number;
    maxTime: number;
    fps: number;
  }> {
    const times: number[] = [];
    const dummyImage = tf.zeros([256, 256, 3]);

    console.log(`🏃 Executando benchmark (${iterations} iterações)...`);

    for (let i = 0; i < iterations; i++) {
      const time = await this.benchmarkFrame(dummyImage as any);
      times.push(time);
      process.stdout.write(`\rProgresso: ${i + 1}/${iterations}`);
    }

    console.log('\n');

    dummyImage.dispose();

    const avgTime = times.reduce((sum, t) => sum + t, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const fps = 1000 / avgTime;

    return {
      avgTime: Math.round(avgTime * 100) / 100,
      minTime,
      maxTime,
      fps: Math.round(fps * 100) / 100
    };
  }
}

/**
 * Instância singleton do serviço de detecção de poses
 */
export const poseDetectionService = new PoseDetectionService();
