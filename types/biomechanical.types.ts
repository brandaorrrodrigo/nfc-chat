export interface BiomechanicalAnalysis {
  id: string;
  exerciseName: string;
  timestamp: Date;

  // Capture setup
  captureSetup: {
    mode: 'ESSENTIAL' | 'ADVANCED' | 'PRO';
    angles: string[];
    fps: number;
    resolution: { width: number; height: number };
  };

  // Confiabilidade
  confidenceScore: number;
  confidenceLevel: 'baixa' | 'moderada' | 'alta' | 'excelente';
  confidenceFactors?: {
    spatialCalibration: number;
    temporalResolution: number;
    landmarkVisibility: number;
    trackingStability: number;
    viewCoverage: number;
    lightingQuality: number;
  };

  // Scores
  scores: {
    motor: number;
    stabilizer: number;
    symmetry: number;
    compensation: number;
    igpb: number;
  };

  // ROM com 3 pontos
  romMeasurements?: Array<{
    joint: string;
    angle: number;
    phase: 'inicial' | 'médio' | 'profundo';
  }>;
  romTotal?: number;

  // Análise de rotação
  rotationAnalysis: {
    detected: boolean;
    confidence: string;
    confidenceScore: number;
    type: 'NONE' | 'TECHNICAL' | 'STRUCTURAL' | 'FUNCTIONAL' | 'PATHOLOGICAL';
    origin: 'SCAPULAR' | 'THORACIC' | 'LUMBAR' | 'PELVIC' | 'FEMORAL' | 'MULTI_SEGMENTAL';
    magnitude: number;
    asymmetryScore: number;
    bilateralDifference: {
      shoulder: number;
      hip: number;
      knee: number;
    };
    detectionMethod: string;
  };

  // Classificação de risco
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  riskFactors: string[];

  // Plano corretivo
  correctiveActions?: Array<{
    priority: 'alta' | 'média' | 'baixa';
    category: 'mobilidade' | 'estabilidade' | 'força' | 'técnica';
    description: string;
    exercises: string[];
    duration: string;
  }>;

  // Upgrade prompt
  upgradePrompt?: {
    currentMode: string;
    recommendedMode: string;
    reason: string;
    benefits: string[];
  };

  // URLs
  videoUrl?: string;
  thumbnailUrl?: string;
}
