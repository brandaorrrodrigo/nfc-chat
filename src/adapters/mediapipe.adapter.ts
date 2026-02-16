/**
 * Adapter MediaPipe → NFC/NFV
 *
 * Converte dados do MediaPipe Pose Detection para o formato
 * padrão do sistema de análise biomecânica NFC/NFV.
 */

import type * as poseDetection from '@tensorflow-models/pose-detection';
import type {
  LandmarkData,
  FrameAnalysis,
  CameraAngle
} from '../types/biomechanical-analysis.types';

/**
 * Mapeamento de nomes de keypoints MediaPipe para nomes padrão NFC
 */
const MEDIAPIPE_TO_STANDARD_NAMES: Record<string, string> = {
  // Corpo superior
  nose: 'nose',
  left_eye: 'left_eye',
  right_eye: 'right_eye',
  left_ear: 'left_ear',
  right_ear: 'right_ear',
  left_shoulder: 'left_shoulder',
  right_shoulder: 'right_shoulder',
  left_elbow: 'left_elbow',
  right_elbow: 'right_elbow',
  left_wrist: 'left_wrist',
  right_wrist: 'right_wrist',
  // Corpo inferior
  left_hip: 'left_hip',
  right_hip: 'right_hip',
  left_knee: 'left_knee',
  right_knee: 'right_knee',
  left_ankle: 'left_ankle',
  right_ankle: 'right_ankle'
};

/**
 * Landmarks críticos necessários para análise biomecânica
 */
const CRITICAL_LANDMARKS = [
  'left_shoulder',
  'right_shoulder',
  'left_hip',
  'right_hip',
  'left_knee',
  'right_knee'
];

/**
 * Adapter para conversão de dados MediaPipe
 */
export class MediaPipeAdapter {
  /**
   * Converte um keypoint do MediaPipe para LandmarkData
   * @param keypoint - Keypoint do MediaPipe
   * @returns Objeto LandmarkData ou null se inválido
   */
  static convertKeypointToLandmark(
    keypoint: poseDetection.Keypoint
  ): LandmarkData | null {
    // Validar se o keypoint tem nome mapeado
    const standardName = MEDIAPIPE_TO_STANDARD_NAMES[keypoint.name || ''];
    if (!standardName) {
      return null;
    }

    // Extrair score (confiança)
    const confidence = keypoint.score || 0;

    // Determinar visibilidade e oclusão
    const visible = confidence > 0.5;
    const occluded = confidence < 0.3;

    return {
      name: standardName,
      x: keypoint.x,
      y: keypoint.y,
      z: (keypoint as any).z, // z pode não existir dependendo do modelo
      confidence,
      visible,
      occluded
    };
  }

  /**
   * Converte uma pose completa do MediaPipe para array de landmarks
   * @param pose - Pose detectada pelo MediaPipe
   * @returns Array de LandmarkData
   */
  static convertPoseToLandmarks(pose: poseDetection.Pose): LandmarkData[] {
    const landmarks: LandmarkData[] = [];

    // Iterar sobre todos os keypoints da pose
    for (const keypoint of pose.keypoints) {
      const landmark = this.convertKeypointToLandmark(keypoint);
      if (landmark) {
        landmarks.push(landmark);
      }
    }

    return landmarks;
  }

  /**
   * Cria objeto FrameAnalysis a partir de uma pose detectada
   * @param params - Parâmetros de criação
   * @returns Objeto FrameAnalysis completo
   */
  static createFrameAnalysis(params: {
    pose: poseDetection.Pose;
    frameNumber: number;
    timestamp: number;
    cameraAngle: CameraAngle;
  }): FrameAnalysis {
    const landmarks = this.convertPoseToLandmarks(params.pose);

    return {
      frameNumber: params.frameNumber,
      timestamp: params.timestamp,
      landmarks,
      cameraAngle: params.cameraAngle
    };
  }

  /**
   * Valida se os landmarks são adequados para análise
   * @param landmarks - Array de landmarks a validar
   * @returns true se válido para análise
   */
  static validateLandmarks(landmarks: LandmarkData[]): boolean {
    // Mínimo de 12 landmarks necessários
    if (landmarks.length < 12) {
      return false;
    }

    // Verificar se landmarks críticos estão presentes e visíveis
    const criticalLandmarks = landmarks.filter(
      (lm) => CRITICAL_LANDMARKS.includes(lm.name) && lm.visible
    );

    // Todos os 6 landmarks críticos devem estar visíveis
    if (criticalLandmarks.length < CRITICAL_LANDMARKS.length) {
      return false;
    }

    // Verificar confiança mínima média
    const avgConfidence =
      landmarks.reduce((sum, lm) => sum + lm.confidence, 0) / landmarks.length;

    if (avgConfidence < 0.4) {
      return false;
    }

    return true;
  }

  /**
   * Calcula score de qualidade dos landmarks (0-100)
   * @param landmarks - Array de landmarks
   * @returns Score de qualidade
   */
  static calculateLandmarkQuality(landmarks: LandmarkData[]): number {
    if (landmarks.length === 0) {
      return 0;
    }

    // Confiança média de todos landmarks
    const avgConfidence =
      landmarks.reduce((sum, lm) => sum + lm.confidence, 0) / landmarks.length;

    // Taxa de visibilidade
    const visibleCount = landmarks.filter((lm) => lm.visible).length;
    const visibilityRate = visibleCount / landmarks.length;

    // Score combinado (60% confiança + 40% visibilidade)
    const quality = avgConfidence * 0.6 + visibilityRate * 0.4;

    return Math.round(quality * 100);
  }

  /**
   * Normaliza coordenadas se necessário (para garantir range 0-1)
   * @param landmarks - Landmarks a normalizar
   * @param imageWidth - Largura da imagem original
   * @param imageHeight - Altura da imagem original
   * @returns Landmarks normalizados
   */
  static normalizeLandmarks(
    landmarks: LandmarkData[],
    imageWidth: number,
    imageHeight: number
  ): LandmarkData[] {
    return landmarks.map((lm) => ({
      ...lm,
      x: lm.x / imageWidth,
      y: lm.y / imageHeight,
      z: lm.z !== undefined ? lm.z / imageWidth : undefined
    }));
  }

  /**
   * Filtra landmarks por confiança mínima
   * @param landmarks - Landmarks a filtrar
   * @param minConfidence - Confiança mínima (0-1)
   * @returns Landmarks filtrados
   */
  static filterByConfidence(
    landmarks: LandmarkData[],
    minConfidence: number
  ): LandmarkData[] {
    return landmarks.filter((lm) => lm.confidence >= minConfidence);
  }

  /**
   * Obtém landmark específico por nome
   * @param landmarks - Array de landmarks
   * @param name - Nome do landmark
   * @returns Landmark ou undefined
   */
  static getLandmarkByName(
    landmarks: LandmarkData[],
    name: string
  ): LandmarkData | undefined {
    return landmarks.find((lm) => lm.name === name);
  }

  /**
   * Calcula ponto médio entre dois landmarks
   * @param lm1 - Primeiro landmark
   * @param lm2 - Segundo landmark
   * @returns Ponto médio como landmark sintético
   */
  static getMidpoint(lm1: LandmarkData, lm2: LandmarkData): LandmarkData {
    return {
      name: `${lm1.name}_${lm2.name}_midpoint`,
      x: (lm1.x + lm2.x) / 2,
      y: (lm1.y + lm2.y) / 2,
      z:
        lm1.z !== undefined && lm2.z !== undefined
          ? (lm1.z + lm2.z) / 2
          : undefined,
      confidence: Math.min(lm1.confidence, lm2.confidence),
      visible: lm1.visible && lm2.visible,
      occluded: lm1.occluded || lm2.occluded
    };
  }

  /**
   * Calcula distância euclidiana entre dois landmarks
   * @param lm1 - Primeiro landmark
   * @param lm2 - Segundo landmark
   * @returns Distância normalizada
   */
  static calculateDistance(lm1: LandmarkData, lm2: LandmarkData): number {
    const dx = lm2.x - lm1.x;
    const dy = lm2.y - lm1.y;
    const dz =
      lm1.z !== undefined && lm2.z !== undefined ? lm2.z - lm1.z : 0;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Calcula ângulo entre três landmarks (em graus)
   * @param a - Landmark ponto A
   * @param b - Landmark ponto B (vértice)
   * @param c - Landmark ponto C
   * @returns Ângulo em graus
   */
  static calculateAngle(
    a: LandmarkData,
    b: LandmarkData,
    c: LandmarkData
  ): number {
    // Vetores BA e BC
    const ba = { x: a.x - b.x, y: a.y - b.y };
    const bc = { x: c.x - b.x, y: c.y - b.y };

    // Produto escalar
    const dot = ba.x * bc.x + ba.y * bc.y;

    // Magnitudes
    const magBA = Math.sqrt(ba.x * ba.x + ba.y * ba.y);
    const magBC = Math.sqrt(bc.x * bc.x + bc.y * bc.y);

    // Cosseno do ângulo
    const cos = dot / (magBA * magBC);

    // Ângulo em radianos e depois graus
    const angleRad = Math.acos(Math.max(-1, Math.min(1, cos)));
    const angleDeg = (angleRad * 180) / Math.PI;

    return angleDeg;
  }
}
