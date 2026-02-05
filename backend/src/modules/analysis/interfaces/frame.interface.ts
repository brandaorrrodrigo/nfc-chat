/**
 * Interface para representar um frame extraído de análise de vídeo
 */
export interface IFrame {
  frame_number: number;
  timestamp_ms: number;
  phase: string;
  angles: IFrameAngles;
  landmarks_3d: any[];
}

/**
 * Ângulos articulares medidos em um frame
 */
export interface IFrameAngles {
  knee_left: number;
  knee_right: number;
  hip: number;
  trunk: number;
  ankle_left: number;
  ankle_right: number;
}

/**
 * Resultado da análise de um frame individual
 */
export interface IFrameAnalysis {
  frame_number: number;
  timestamp_ms: number;
  phase: string;
  angles: IFrameAngles;
  similarity: number;
  similarity_by_joint: Record<string, number>;
  deviations: IDeviation[];
  score: number;
}

/**
 * Ângulos ideais do gold standard com tolerâncias
 */
export interface IGoldAngles {
  knee_left: { ideal: number; tolerance: number };
  knee_right: { ideal: number; tolerance: number };
  hip: { ideal: number; tolerance: number };
  trunk: { ideal: number; tolerance: number };
  ankle_left: { ideal: number; tolerance: number };
  ankle_right: { ideal: number; tolerance: number };
}

/**
 * Fase do gold standard com ângulos de referência
 */
export interface IGoldPhase {
  phase_name: string;
  angles: IGoldAngles;
}

/**
 * Pesos para cálculo de similaridade ponderada
 */
export interface ISimilarityWeights {
  knee: number;
  hip: number;
  trunk: number;
  ankle: number;
  symmetry: number;
}
