/**
 * Engine Orquestrador de Análise Biomecânica
 *
 * Coordena todos os componentes do sistema de análise biomecânica:
 * - Cálculo de confiabilidade
 * - Detecção de rotação
 * - Geração de relatórios
 */

import type {
  CameraSetup,
  FrameAnalysis,
  MovementScores,
  BiomechanicalAnalysis,
  ConfidenceFactors
} from '../types/biomechanical-analysis.types';
import { confidenceCalculator } from './confidence-calculator.engine';
import { rotationDetector } from './rotation-detector.engine';
import { reportGenerator } from './report-generator.engine';
import { generateAnalysisId } from '../utils/biomechanical.helpers';

/**
 * Parâmetros de entrada para análise
 */
export interface AnalysisParams {
  /** Nome do exercício analisado */
  exerciseName: string;
  /** Setup de câmeras utilizado */
  captureSetup: CameraSetup;
  /** Frames capturados e processados */
  frames: FrameAnalysis[];
  /** Scores de movimento já calculados externamente */
  scores: MovementScores;
}

/**
 * Engine orquestrador principal
 */
class BiomechanicalAnalyzerEngine {
  /**
   * Executa análise biomecânica completa
   * @param params - Parâmetros da análise
   * @returns Análise biomecânica completa com relatório
   * @throws Error se dados insuficientes ou confiabilidade inválida
   */
  public analyze(params: AnalysisParams): BiomechanicalAnalysis {
    const startTime = Date.now();

    // Validar parâmetros de entrada
    this.validateParams(params);

    // 1. Gerar ID único da análise
    const analysisId = generateAnalysisId();
    const timestamp = new Date();

    // 2. Calcular fatores de confiabilidade
    // Usar frame do meio como referência para cálculo de confiança
    const middleFrameIndex = Math.floor(params.frames.length / 2);
    const currentFrame = params.frames[middleFrameIndex];
    const previousFrame =
      middleFrameIndex > 0 ? params.frames[middleFrameIndex - 1] : undefined;

    const confidenceFactors: ConfidenceFactors = confidenceCalculator.calculateConfidenceFactors(
      params.captureSetup,
      currentFrame.landmarks,
      previousFrame?.landmarks || []
    );

    // 3. Calcular score geral de confiabilidade
    const confidenceScore = confidenceCalculator.calculateOverallConfidence(confidenceFactors);

    // 4. Classificar nível de confiabilidade
    const confidenceLevel = confidenceCalculator.getConfidenceLevel(confidenceScore);

    // 5. Validar confiabilidade
    const isValid = confidenceCalculator.isConfidenceValid(
      confidenceScore,
      params.captureSetup.mode
    );

    if (!isValid) {
      const recommendations = confidenceCalculator.generateRecommendations(confidenceFactors);
      console.warn(
        `[BiomechanicalAnalyzer] Confiabilidade abaixo do ideal para modo ${params.captureSetup.mode} ` +
          `(score: ${confidenceScore}%, mínimo: ${
            params.captureSetup.mode === 'ESSENTIAL'
              ? 60
              : params.captureSetup.mode === 'ADVANCED'
              ? 75
              : 85
          }%). ` +
          `Recomendações: ${recommendations.join('; ')}. Prosseguindo com análise parcial.`
      );
    }

    // 6. Analisar rotação axial
    const rotationAnalysis = rotationDetector.analyzeRotation(
      params.frames,
      params.captureSetup.mode,
      params.exerciseName
    );

    // 7. Montar análise parcial
    const processingTime = Date.now() - startTime;
    const partialAnalysis: Partial<BiomechanicalAnalysis> = {
      analysisId,
      exerciseName: params.exerciseName,
      timestamp,
      captureSetup: params.captureSetup,
      confidenceScore,
      confidenceFactors,
      confidenceLevel,
      rotationAnalysis,
      scores: params.scores,
      rawData: {
        frames: params.frames,
        processingTime
      }
    };

    // 8. Gerar relatório completo com ações corretivas
    const fullAnalysis = reportGenerator.generateReport(partialAnalysis);

    return fullAnalysis;
  }

  /**
   * Valida parâmetros de entrada
   * @param params - Parâmetros a validar
   * @throws Error se parâmetros inválidos
   */
  private validateParams(params: AnalysisParams): void {
    if (!params.exerciseName || params.exerciseName.trim().length === 0) {
      throw new Error('Nome do exercício é obrigatório');
    }

    if (!params.captureSetup) {
      throw new Error('Setup de captura é obrigatório');
    }

    if (!params.captureSetup.mode) {
      throw new Error('Modo de captura é obrigatório');
    }

    if (!params.captureSetup.angles || params.captureSetup.angles.length === 0) {
      throw new Error('Ângulos de câmera são obrigatórios');
    }

    if (!params.frames || params.frames.length === 0) {
      throw new Error('Frames de análise são obrigatórios');
    }

    if (!params.scores) {
      throw new Error('Scores de movimento são obrigatórios');
    }

    // Validar consistência entre modo e número de ângulos
    const expectedAngles = {
      ESSENTIAL: 1,
      ADVANCED: 2,
      PRO: 3
    };

    const expected = expectedAngles[params.captureSetup.mode];
    const actual = params.captureSetup.angles.length;

    if (actual < expected) {
      throw new Error(
        `Modo ${params.captureSetup.mode} requer ${expected} ângulo(s), mas apenas ${actual} fornecido(s)`
      );
    }

    // Validar que frames tem landmarks
    const framesWithLandmarks = params.frames.filter(
      (f) => f.landmarks && f.landmarks.length > 0
    );

    if (framesWithLandmarks.length === 0) {
      throw new Error('Nenhum frame contém landmarks detectados');
    }

    if (framesWithLandmarks.length < params.frames.length * 0.5) {
      throw new Error(
        `Apenas ${framesWithLandmarks.length}/${params.frames.length} frames contêm landmarks (mínimo 50%)`
      );
    }

    // Validar scores
    if (
      typeof params.scores.motor !== 'number' ||
      typeof params.scores.stabilizer !== 'number' ||
      typeof params.scores.symmetry !== 'number' ||
      typeof params.scores.compensation !== 'number' ||
      typeof params.scores.igpb !== 'number'
    ) {
      throw new Error('Scores de movimento devem ser numéricos');
    }

    // Validar ranges de scores (0-100)
    const scores = [
      params.scores.motor,
      params.scores.stabilizer,
      params.scores.symmetry,
      params.scores.compensation,
      params.scores.igpb
    ];

    for (const score of scores) {
      if (score < 0 || score > 100) {
        throw new Error('Scores devem estar entre 0 e 100');
      }
    }
  }

  /**
   * Versão assíncrona da análise (para processamento em background)
   * @param params - Parâmetros da análise
   * @returns Promise com análise completa
   */
  public async analyzeAsync(params: AnalysisParams): Promise<BiomechanicalAnalysis> {
    return new Promise((resolve, reject) => {
      try {
        const result = this.analyze(params);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Analisa múltiplos exercícios em batch
   * @param batchParams - Array de parâmetros de análise
   * @returns Array de análises completas
   */
  public analyzeBatch(batchParams: AnalysisParams[]): BiomechanicalAnalysis[] {
    return batchParams.map((params) => this.analyze(params));
  }

  /**
   * Analisa múltiplos exercícios em batch (assíncrono)
   * @param batchParams - Array de parâmetros de análise
   * @returns Promise com array de análises completas
   */
  public async analyzeBatchAsync(
    batchParams: AnalysisParams[]
  ): Promise<BiomechanicalAnalysis[]> {
    return Promise.all(batchParams.map((params) => this.analyzeAsync(params)));
  }
}

/**
 * Instância singleton do engine orquestrador
 */
export const biomechanicalAnalyzer = new BiomechanicalAnalyzerEngine();
