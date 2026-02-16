/**
 * Serviço de Scoring de Movimento
 *
 * Calcula automaticamente scores de movimento (motor, stabilizer,
 * symmetry, compensation, IGPB) a partir de landmarks.
 */

import type {
  FrameAnalysis,
  MovementScores,
  CaptureMode,
  LandmarkData
} from '../types/biomechanical-analysis.types';
import { MediaPipeAdapter } from '../adapters/mediapipe.adapter';

/**
 * Contexto para cálculo de scores
 */
export interface ScoringContext {
  /** Nome do exercício */
  exerciseName: string;
  /** Frames analisados */
  frames: FrameAnalysis[];
  /** Modo de captura */
  captureMode: CaptureMode;
}

/**
 * Serviço de scoring de movimento
 */
class MovementScoringService {
  /**
   * Calcula score motor baseado em amplitude e fluidez
   * @param frames - Frames da análise
   * @returns Score 0-100
   */
  calculateMotorScore(frames: FrameAnalysis[]): number {
    if (frames.length === 0) return 0;

    const scores: number[] = [];

    // 1. Amplitude de movimento (ROM)
    const romScore = this.calculateROMScore(frames);
    scores.push(romScore);

    // 2. Fluidez (variância de velocidade angular)
    const fluidityScore = this.calculateFluidityScore(frames);
    scores.push(fluidityScore);

    // 3. Completude do movimento (atingiu posições-chave)
    const completenessScore = this.calculateCompletenessScore(frames);
    scores.push(completenessScore);

    // Média ponderada
    return (
      romScore * 0.4 +
      fluidityScore * 0.35 +
      completenessScore * 0.25
    );
  }

  /**
   * Calcula score de amplitude de movimento
   * @param frames - Frames da análise
   * @returns Score 0-100
   * @private
   */
  private calculateROMScore(frames: FrameAnalysis[]): number {
    const kneeAngles: number[] = [];

    for (const frame of frames) {
      const leftKneeAngle = this.getJointAngle(
        frame.landmarks,
        'left_hip',
        'left_knee',
        'left_ankle'
      );
      const rightKneeAngle = this.getJointAngle(
        frame.landmarks,
        'right_hip',
        'right_knee',
        'right_ankle'
      );

      if (leftKneeAngle !== null) kneeAngles.push(leftKneeAngle);
      if (rightKneeAngle !== null) kneeAngles.push(rightKneeAngle);
    }

    if (kneeAngles.length === 0) return 50;

    // Calcular range (diferença entre min e max)
    const minAngle = Math.min(...kneeAngles);
    const maxAngle = Math.max(...kneeAngles);
    const range = maxAngle - minAngle;

    // Range ideal: 90-130° (agachamento completo)
    // Score: quanto maior o range, melhor (até 130°)
    const score = Math.min(100, (range / 130) * 100);

    return score;
  }

  /**
   * Calcula score de fluidez baseado em variância de velocidade
   * @param frames - Frames da análise
   * @returns Score 0-100
   * @private
   */
  private calculateFluidityScore(frames: FrameAnalysis[]): number {
    if (frames.length < 3) return 50;

    const velocities: number[] = [];

    // Calcular velocidade do centro de massa em cada frame
    for (let i = 1; i < frames.length; i++) {
      const prevCOM = this.getCenterOfMass(frames[i - 1].landmarks);
      const currCOM = this.getCenterOfMass(frames[i].landmarks);

      if (prevCOM && currCOM) {
        const dx = currCOM.x - prevCOM.x;
        const dy = currCOM.y - prevCOM.y;
        const velocity = Math.sqrt(dx * dx + dy * dy);
        velocities.push(velocity);
      }
    }

    if (velocities.length === 0) return 50;

    // Calcular variância (menor variância = movimento mais fluido)
    const mean = velocities.reduce((sum, v) => sum + v, 0) / velocities.length;
    const variance =
      velocities.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) /
      velocities.length;

    // Normalizar variância (valores típicos: 0.0001-0.01)
    const normalizedVariance = Math.min(1, variance * 1000);

    // Inverter (quanto menor a variância, maior o score)
    return (1 - normalizedVariance) * 100;
  }

  /**
   * Calcula score de completude (atingiu posições-chave)
   * @param frames - Frames da análise
   * @returns Score 0-100
   * @private
   */
  private calculateCompletenessScore(frames: FrameAnalysis[]): number {
    const kneeAngles: number[] = [];

    for (const frame of frames) {
      const leftKneeAngle = this.getJointAngle(
        frame.landmarks,
        'left_hip',
        'left_knee',
        'left_ankle'
      );
      if (leftKneeAngle !== null) kneeAngles.push(leftKneeAngle);
    }

    if (kneeAngles.length === 0) return 0;

    const minAngle = Math.min(...kneeAngles);

    // Agachamento completo: < 90°
    // Paralelo: 90-100°
    // Parcial: > 100°
    if (minAngle < 90) return 100;
    if (minAngle < 100) return 80;
    if (minAngle < 120) return 60;
    return 40;
  }

  /**
   * Calcula score estabilizador baseado em oscilação do tronco
   * @param frames - Frames da análise
   * @returns Score 0-100
   */
  calculateStabilizerScore(frames: FrameAnalysis[]): number {
    if (frames.length === 0) return 0;

    const scores: number[] = [];

    // 1. Estabilidade do tronco (oscilação mínima)
    const trunkStabilityScore = this.calculateTrunkStability(frames);
    scores.push(trunkStabilityScore);

    // 2. Alinhamento joelho-tornozelo
    const alignmentScore = this.calculateKneeAlignment(frames);
    scores.push(alignmentScore);

    // 3. Controle de centro de massa
    const comControlScore = this.calculateCOMControl(frames);
    scores.push(comControlScore);

    // Média ponderada
    return (
      trunkStabilityScore * 0.4 +
      alignmentScore * 0.35 +
      comControlScore * 0.25
    );
  }

  /**
   * Calcula estabilidade do tronco
   * @param frames - Frames da análise
   * @returns Score 0-100
   * @private
   */
  private calculateTrunkStability(frames: FrameAnalysis[]): number {
    const shoulderMidpoints: { x: number; y: number }[] = [];

    for (const frame of frames) {
      const leftShoulder = MediaPipeAdapter.getLandmarkByName(
        frame.landmarks,
        'left_shoulder'
      );
      const rightShoulder = MediaPipeAdapter.getLandmarkByName(
        frame.landmarks,
        'right_shoulder'
      );

      if (leftShoulder && rightShoulder) {
        const midpoint = {
          x: (leftShoulder.x + rightShoulder.x) / 2,
          y: (leftShoulder.y + rightShoulder.y) / 2
        };
        shoulderMidpoints.push(midpoint);
      }
    }

    if (shoulderMidpoints.length < 2) return 50;

    // Calcular desvio padrão da posição horizontal
    const xValues = shoulderMidpoints.map((p) => p.x);
    const xMean = xValues.reduce((sum, x) => sum + x, 0) / xValues.length;
    const xVariance =
      xValues.reduce((sum, x) => sum + Math.pow(x - xMean, 2), 0) /
      xValues.length;
    const xStdDev = Math.sqrt(xVariance);

    // Normalizar (valores típicos: 0.001-0.05)
    const normalizedStdDev = Math.min(1, xStdDev * 50);

    // Inverter (quanto menor o desvio, maior o score)
    return (1 - normalizedStdDev) * 100;
  }

  /**
   * Calcula alinhamento joelho-tornozelo
   * @param frames - Frames da análise
   * @returns Score 0-100
   * @private
   */
  private calculateKneeAlignment(frames: FrameAnalysis[]): number {
    const misalignments: number[] = [];

    for (const frame of frames) {
      const leftKnee = MediaPipeAdapter.getLandmarkByName(
        frame.landmarks,
        'left_knee'
      );
      const leftAnkle = MediaPipeAdapter.getLandmarkByName(
        frame.landmarks,
        'left_ankle'
      );

      if (leftKnee && leftAnkle) {
        // Desalinhamento horizontal (valgus/varus)
        const horizontalDiff = Math.abs(leftKnee.x - leftAnkle.x);
        misalignments.push(horizontalDiff);
      }
    }

    if (misalignments.length === 0) return 50;

    const avgMisalignment =
      misalignments.reduce((sum, m) => sum + m, 0) / misalignments.length;

    // Normalizar (valores típicos: 0.01-0.1)
    const normalizedMisalignment = Math.min(1, avgMisalignment * 20);

    // Inverter
    return (1 - normalizedMisalignment) * 100;
  }

  /**
   * Calcula controle do centro de massa
   * @param frames - Frames da análise
   * @returns Score 0-100
   * @private
   */
  private calculateCOMControl(frames: FrameAnalysis[]): number {
    const comPositions: { x: number; y: number }[] = [];

    for (const frame of frames) {
      const com = this.getCenterOfMass(frame.landmarks);
      if (com) {
        comPositions.push(com);
      }
    }

    if (comPositions.length < 2) return 50;

    // Calcular trajetória suave do COM
    const xDeviations: number[] = [];

    for (let i = 2; i < comPositions.length; i++) {
      // Desvio da trajetória linear esperada
      const expectedX =
        comPositions[i - 2].x +
        ((comPositions[i - 1].x - comPositions[i - 2].x) * 2);
      const actualX = comPositions[i].x;
      const deviation = Math.abs(actualX - expectedX);
      xDeviations.push(deviation);
    }

    if (xDeviations.length === 0) return 50;

    const avgDeviation =
      xDeviations.reduce((sum, d) => sum + d, 0) / xDeviations.length;

    // Normalizar
    const normalizedDeviation = Math.min(1, avgDeviation * 100);

    // Inverter
    return (1 - normalizedDeviation) * 100;
  }

  /**
   * Calcula score de simetria bilateral
   * @param frames - Frames da análise
   * @returns Score 0-100
   */
  calculateSymmetryScore(frames: FrameAnalysis[]): number {
    if (frames.length === 0) return 0;

    const asymmetries: number[] = [];

    for (const frame of frames) {
      // Ângulos bilaterais
      const leftKneeAngle = this.getJointAngle(
        frame.landmarks,
        'left_hip',
        'left_knee',
        'left_ankle'
      );
      const rightKneeAngle = this.getJointAngle(
        frame.landmarks,
        'right_hip',
        'right_knee',
        'right_ankle'
      );

      if (leftKneeAngle !== null && rightKneeAngle !== null) {
        const diff = Math.abs(leftKneeAngle - rightKneeAngle);
        asymmetries.push(diff);
      }

      // Alturas bilaterais (shoulder)
      const leftShoulder = MediaPipeAdapter.getLandmarkByName(
        frame.landmarks,
        'left_shoulder'
      );
      const rightShoulder = MediaPipeAdapter.getLandmarkByName(
        frame.landmarks,
        'right_shoulder'
      );

      if (leftShoulder && rightShoulder) {
        const heightDiff = Math.abs(leftShoulder.y - rightShoulder.y);
        asymmetries.push(heightDiff * 180); // Converter para escala de graus
      }
    }

    if (asymmetries.length === 0) return 50;

    // Calcular assimetria média
    const avgAsymmetry =
      asymmetries.reduce((sum, a) => sum + a, 0) / asymmetries.length;

    // Score: quanto menor a assimetria, melhor
    // Assimetria < 5° = excelente (100)
    // Assimetria 5-15° = bom (80-100)
    // Assimetria > 15° = ruim (< 80)
    const score = Math.max(0, 100 - avgAsymmetry * 5);

    return Math.min(100, score);
  }

  /**
   * Calcula score de compensação
   * @param frames - Frames da análise
   * @returns Score 0-100 (quanto maior, pior)
   */
  calculateCompensationScore(frames: FrameAnalysis[]): number {
    if (frames.length === 0) return 0;

    const compensations: number[] = [];

    for (const frame of frames) {
      // 1. Rotação axial (diferença de profundidade Z)
      const rotationComp = this.calculateRotationCompensation(frame.landmarks);
      if (rotationComp !== null) compensations.push(rotationComp);

      // 2. Shoulder hiking (elevação unilateral de ombro)
      const shoulderComp = this.calculateShoulderCompensation(frame.landmarks);
      if (shoulderComp !== null) compensations.push(shoulderComp);

      // 3. Translação lateral excessiva
      const lateralComp = this.calculateLateralCompensation(frame.landmarks);
      if (lateralComp !== null) compensations.push(lateralComp);
    }

    if (compensations.length === 0) return 0;

    // Média das compensações
    const avgCompensation =
      compensations.reduce((sum, c) => sum + c, 0) / compensations.length;

    return Math.min(100, avgCompensation);
  }

  /**
   * Calcula compensação rotacional
   * @param landmarks - Landmarks do frame
   * @returns Score de compensação ou null
   * @private
   */
  private calculateRotationCompensation(
    landmarks: LandmarkData[]
  ): number | null {
    const leftShoulder = MediaPipeAdapter.getLandmarkByName(
      landmarks,
      'left_shoulder'
    );
    const rightShoulder = MediaPipeAdapter.getLandmarkByName(
      landmarks,
      'right_shoulder'
    );

    if (
      !leftShoulder ||
      !rightShoulder ||
      leftShoulder.z === undefined ||
      rightShoulder.z === undefined
    ) {
      return null;
    }

    // Diferença de profundidade entre ombros
    const depthDiff = Math.abs(leftShoulder.z - rightShoulder.z);

    // Normalizar (valores típicos: 0.01-0.2)
    return Math.min(100, depthDiff * 500);
  }

  /**
   * Calcula compensação de shoulder hiking
   * @param landmarks - Landmarks do frame
   * @returns Score de compensação ou null
   * @private
   */
  private calculateShoulderCompensation(
    landmarks: LandmarkData[]
  ): number | null {
    const leftShoulder = MediaPipeAdapter.getLandmarkByName(
      landmarks,
      'left_shoulder'
    );
    const rightShoulder = MediaPipeAdapter.getLandmarkByName(
      landmarks,
      'right_shoulder'
    );

    if (!leftShoulder || !rightShoulder) {
      return null;
    }

    // Diferença vertical entre ombros
    const heightDiff = Math.abs(leftShoulder.y - rightShoulder.y);

    // Normalizar (valores típicos: 0.01-0.1)
    return Math.min(100, heightDiff * 1000);
  }

  /**
   * Calcula compensação lateral
   * @param landmarks - Landmarks do frame
   * @returns Score de compensação ou null
   * @private
   */
  private calculateLateralCompensation(
    landmarks: LandmarkData[]
  ): number | null {
    const leftHip = MediaPipeAdapter.getLandmarkByName(landmarks, 'left_hip');
    const rightHip = MediaPipeAdapter.getLandmarkByName(landmarks, 'right_hip');
    const leftAnkle = MediaPipeAdapter.getLandmarkByName(
      landmarks,
      'left_ankle'
    );
    const rightAnkle = MediaPipeAdapter.getLandmarkByName(
      landmarks,
      'right_ankle'
    );

    if (!leftHip || !rightHip || !leftAnkle || !rightAnkle) {
      return null;
    }

    // Centro dos quadris
    const hipCenter = (leftHip.x + rightHip.x) / 2;

    // Centro dos tornozelos
    const ankleCenter = (leftAnkle.x + rightAnkle.x) / 2;

    // Desalinhamento horizontal
    const lateralShift = Math.abs(hipCenter - ankleCenter);

    // Normalizar
    return Math.min(100, lateralShift * 500);
  }

  /**
   * Calcula IGPB (Índice Global de Performance Biomecânica)
   * @param motor - Score motor
   * @param stabilizer - Score estabilizador
   * @param symmetry - Score de simetria
   * @param compensation - Score de compensação
   * @returns IGPB (0-100)
   */
  calculateIGPB(
    motor: number,
    stabilizer: number,
    symmetry: number,
    compensation: number
  ): number {
    const igpb =
      motor * 0.3 +
      stabilizer * 0.25 +
      symmetry * 0.25 +
      (100 - compensation) * 0.2;

    return Math.round(igpb * 100) / 100;
  }

  /**
   * Calcula todos os scores de movimento
   * @param context - Contexto de scoring
   * @returns Objeto MovementScores completo
   */
  calculateAllScores(context: ScoringContext): MovementScores {
    const motor = this.calculateMotorScore(context.frames);
    const stabilizer = this.calculateStabilizerScore(context.frames);
    const symmetry = this.calculateSymmetryScore(context.frames);
    const compensation = this.calculateCompensationScore(context.frames);
    const igpb = this.calculateIGPB(motor, stabilizer, symmetry, compensation);

    return {
      motor: Math.round(motor * 100) / 100,
      stabilizer: Math.round(stabilizer * 100) / 100,
      symmetry: Math.round(symmetry * 100) / 100,
      compensation: Math.round(compensation * 100) / 100,
      igpb
    };
  }

  // ========== MÉTODOS AUXILIARES ==========

  /**
   * Calcula ângulo de uma articulação (3 landmarks)
   * @param landmarks - Landmarks do frame
   * @param nameA - Nome do landmark A
   * @param nameB - Nome do landmark B (vértice)
   * @param nameC - Nome do landmark C
   * @returns Ângulo em graus ou null
   * @private
   */
  private getJointAngle(
    landmarks: LandmarkData[],
    nameA: string,
    nameB: string,
    nameC: string
  ): number | null {
    const lmA = MediaPipeAdapter.getLandmarkByName(landmarks, nameA);
    const lmB = MediaPipeAdapter.getLandmarkByName(landmarks, nameB);
    const lmC = MediaPipeAdapter.getLandmarkByName(landmarks, nameC);

    if (!lmA || !lmB || !lmC) {
      return null;
    }

    return MediaPipeAdapter.calculateAngle(lmA, lmB, lmC);
  }

  /**
   * Calcula centro de massa aproximado (midpoint shoulders-hips)
   * @param landmarks - Landmarks do frame
   * @returns Coordenadas do COM ou null
   * @private
   */
  private getCenterOfMass(
    landmarks: LandmarkData[]
  ): { x: number; y: number } | null {
    const leftShoulder = MediaPipeAdapter.getLandmarkByName(
      landmarks,
      'left_shoulder'
    );
    const rightShoulder = MediaPipeAdapter.getLandmarkByName(
      landmarks,
      'right_shoulder'
    );
    const leftHip = MediaPipeAdapter.getLandmarkByName(landmarks, 'left_hip');
    const rightHip = MediaPipeAdapter.getLandmarkByName(landmarks, 'right_hip');

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) {
      return null;
    }

    const x =
      (leftShoulder.x + rightShoulder.x + leftHip.x + rightHip.x) / 4;
    const y =
      (leftShoulder.y + rightShoulder.y + leftHip.y + rightHip.y) / 4;

    return { x, y };
  }
}

/**
 * Instância singleton do serviço de scoring
 */
export const movementScoringService = new MovementScoringService();
