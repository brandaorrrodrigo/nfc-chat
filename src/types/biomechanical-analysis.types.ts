/**
 * Sistema de Análise Biomecânica NFC/NFV
 * Versão: 2.0
 * Autor: Brandao - NutriFitCoach
 */

// ============================================================================
// ENUMS - CLASSIFICAÇÕES
// ============================================================================

export enum CaptureMode {
  ESSENTIAL = 'ESSENTIAL',  // 1 vista sagital (lateral)
  ADVANCED = 'ADVANCED',    // 2 vistas ortogonais (sagital + frontal)
  PRO = 'PRO'               // 3 vistas (sagital + frontal + superior)
}

export enum CameraAngle {
  SAGITTAL_RIGHT = 'SAGITTAL_RIGHT',     // 90° - vista lateral direita
  SAGITTAL_LEFT = 'SAGITTAL_LEFT',       // 270° - vista lateral esquerda
  FRONTAL_POSTERIOR = 'FRONTAL_POSTERIOR', // 0° - vista posterior
  TRANSVERSE_SUPERIOR = 'TRANSVERSE_SUPERIOR' // vista superior (bird's eye)
}

export enum RotationConfidence {
  NOT_MEASURABLE = 'NOT_MEASURABLE',  // 0-30% - 1 ângulo apenas
  INFERRED = 'INFERRED',              // 30-50% - assimetria visível em 1 plano
  PROBABLE = 'PROBABLE',              // 50-80% - confirmado em 2 planos
  CONFIRMED = 'CONFIRMED'             // 80-100% - reconstrução 3D completa
}

export enum RotationType {
  NONE = 'NONE',                      // Sem rotação significativa
  TECHNICAL = 'TECHNICAL',            // Rotação intencional (ex: arranque)
  STRUCTURAL = 'STRUCTURAL',          // Assimetria esquelética
  FUNCTIONAL = 'FUNCTIONAL',          // Déficit neuromuscular
  PATHOLOGICAL = 'PATHOLOGICAL'       // Indicadores de dor/lesão
}

export enum RotationOrigin {
  SCAPULAR = 'SCAPULAR',              // Origem escapular
  THORACIC = 'THORACIC',             // Torácica
  LUMBAR = 'LUMBAR',                  // Lombar
  PELVIC = 'PELVIC',                  // Pélvica
  FEMORAL = 'FEMORAL',                // Femoral
  MULTI_SEGMENTAL = 'MULTI_SEGMENTAL' // Múltiplos segmentos
}

export enum RiskLevel {
  LOW = 'LOW',           // Score compensação < 20
  MODERATE = 'MODERATE', // Score compensação 20-40
  HIGH = 'HIGH'          // Score compensação > 40
}

// ============================================================================
// INTERFACES - ESTRUTURAS DE DADOS
// ============================================================================

export interface ConfidenceFactors {
  spatialCalibration: number;      // 0-100: qualidade da calibração espacial
  temporalResolution: number;      // 0-100: fps normalizado (60fps = 100)
  landmarkVisibility: number;      // 0-100: % landmarks visíveis
  trackingStability: number;       // 0-100: estabilidade frame-to-frame
  viewCoverage: number;            // 0-100: cobertura espacial dos ângulos
  lightingQuality: number;         // 0-100: qualidade de iluminação
}

export interface CameraSetup {
  mode: CaptureMode;
  angles: CameraAngle[];
  fps: number;
  resolution: { width: number; height: number };
  distanceToSubject: number;       // em metros
  synchronized: boolean;           // sync temporal entre câmeras
  maxDesyncMs: number;             // máx dessincronização em ms
}

export interface LandmarkData {
  name: string;
  x: number;
  y: number;
  z?: number;                      // opcional para modo 2D
  confidence: number;              // 0-1 (confiança do MediaPipe)
  visible: boolean;
  occluded: boolean;
}

export interface FrameAnalysis {
  frameNumber: number;
  timestamp: number;               // ms
  landmarks: LandmarkData[];
  cameraAngle: CameraAngle;
}

export interface RotationAnalysis {
  detected: boolean;
  confidence: RotationConfidence;
  confidenceScore: number;         // 0-100
  type: RotationType;
  origin: RotationOrigin;
  magnitude: number;               // graus de rotação axial
  asymmetryScore: number;          // 0-100
  bilateralDifference: {
    shoulder: number;              // graus
    hip: number;                   // graus
    knee: number;                  // graus
  };
  detectionMethod: string;         // descrição técnica do método
}

export interface MovementScores {
  motor: number;                   // 0-100: qualidade do padrão motor
  stabilizer: number;              // 0-100: ativação de estabilizadores
  symmetry: number;                // 0-100: simetria bilateral
  compensation: number;            // 0-100: grau de compensação (invertido)
  igpb: number;                    // 0-100: Índice Global Performance Biomecânica
}

export interface BiomechanicalAnalysis {
  // Metadados da análise
  analysisId: string;
  exerciseName: string;
  timestamp: Date;

  // Configuração de captura
  captureSetup: CameraSetup;

  // Índice de confiabilidade
  confidenceScore: number;         // 0-100: confiabilidade geral
  confidenceFactors: ConfidenceFactors;
  confidenceLevel: 'baixa' | 'moderada' | 'alta' | 'excelente';

  // Análise de rotação
  rotationAnalysis: RotationAnalysis;

  // Scores de movimento
  scores: MovementScores;

  // Classificação de risco
  riskLevel: RiskLevel;
  riskFactors: string[];

  // Recomendações
  correctiveActions: CorrectiveAction[];
  upgradePrompt?: UpgradePrompt;
  retestRecommendation: RetestRecommendation;

  // Dados brutos (opcional)
  rawData?: {
    frames: FrameAnalysis[];
    processingTime: number;        // ms
  };
}

export interface CorrectiveAction {
  priority: 'alta' | 'média' | 'baixa';
  category: 'mobilidade' | 'estabilidade' | 'força' | 'técnica';
  description: string;
  exercises: string[];
  duration: string;                // ex: "2-3 semanas"
}

export interface UpgradePrompt {
  currentMode: CaptureMode;
  recommendedMode: CaptureMode;
  reason: string;
  benefits: string[];
}

export interface RetestRecommendation {
  recommended: boolean;
  timeframe: string;               // ex: "4-6 semanas"
  reason: string;
  focusAreas: string[];
}

// ============================================================================
// CONFIGURAÇÕES DE THRESHOLD
// ============================================================================

export const BIOMECHANICAL_THRESHOLDS = {
  // Confiabilidade mínima por modo
  minConfidence: {
    [CaptureMode.ESSENTIAL]: 60,
    [CaptureMode.ADVANCED]: 75,
    [CaptureMode.PRO]: 85
  },

  // Assimetria bilateral (graus)
  asymmetry: {
    low: 5,
    moderate: 12,
    high: 20
  },

  // Rotação axial (graus)
  rotation: {
    negligible: 3,
    minor: 8,
    moderate: 15,
    severe: 25
  },

  // FPS normalização
  fps: {
    minimum: 30,
    recommended: 60,
    optimal: 120
  },

  // Visibilidade de landmarks
  landmarkVisibility: {
    minimum: 70,      // % mínimo para análise válida
    optimal: 90
  },

  // Dessincronização máxima
  maxDesyncMs: 16     // ~1 frame @ 60fps
} as const;

// ============================================================================
// MENSAGENS TÉCNICAS
// ============================================================================

export const TECHNICAL_MESSAGES = {
  rotationDetection: {
    [RotationConfidence.NOT_MEASURABLE]:
      'Rotação axial não mensurável com captura monoplanar. Análise limitada ao plano sagital.',

    [RotationConfidence.INFERRED]:
      'Possível compensação rotacional inferida através de assimetria angular visível no plano sagital.',

    [RotationConfidence.PROBABLE]:
      'Compensação rotacional provável detectada através de análise biplanar ortogonal.',

    [RotationConfidence.CONFIRMED]:
      'Compensação rotacional confirmada através de reconstrução vetorial tridimensional.'
  },

  rotationType: {
    [RotationType.NONE]:
      'Padrão de movimento sem rotação axial significativa detectada.',

    [RotationType.TECHNICAL]:
      'Rotação axial intencional identificada como parte do padrão motor técnico do exercício.',

    [RotationType.STRUCTURAL]:
      'Compensação rotacional de origem estrutural detectada, possivelmente relacionada a assimetria esquelética ou articular.',

    [RotationType.FUNCTIONAL]:
      'Compensação rotacional funcional identificada, sugerindo possível déficit neuromuscular ou assimetria de força.',

    [RotationType.PATHOLOGICAL]:
      'Padrão de compensação rotacional com características sugestivas de estratégia antálgica ou restrição articular.'
  },

  upgradePrompts: {
    essentialToAdvanced:
      'Para validação tridimensional da compensação detectada e confirmação da origem anatômica, recomenda-se captura biplanar (modo Avançado).',

    advancedToPro:
      'Detecção de assimetria bilateral superior a 12°. Captura triplanar (modo Pro) permitirá reconstrução 3D completa e quantificação precisa da rotação axial.'
  }
} as const;

export const CONFIDENCE_LEVEL_MAP = {
  baixa: { min: 0, max: 60 },
  moderada: { min: 60, max: 75 },
  alta: { min: 75, max: 90 },
  excelente: { min: 90, max: 100 }
} as const;
