/**
 * Sistema de Tipos para Análise Biomecânica NFC/NFV
 *
 * Define todos os tipos, enums, interfaces e constantes para análise
 * biomecânica avançada com três níveis de captura (Essencial, Avançado, Pro).
 */

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Modos de captura de vídeo com diferentes níveis de precisão espacial
 */
export enum CaptureMode {
  /** 1 vista sagital - análise 2D monoplanar */
  ESSENTIAL = 'ESSENTIAL',
  /** 2 vistas ortogonais (sagital + frontal) - análise 2.5D biplanar */
  ADVANCED = 'ADVANCED',
  /** 3 vistas (sagital + frontal + superior) - reconstrução 3D triplanar */
  PRO = 'PRO'
}

/**
 * Ângulos de câmera padronizados para captura multiplanar
 */
export enum CameraAngle {
  /** 90° - vista lateral direita (plano sagital) */
  SAGITTAL_RIGHT = 'SAGITTAL_RIGHT',
  /** 270° - vista lateral esquerda (plano sagital) */
  SAGITTAL_LEFT = 'SAGITTAL_LEFT',
  /** 0° - vista posterior (plano frontal) */
  FRONTAL_POSTERIOR = 'FRONTAL_POSTERIOR',
  /** Vista superior - bird's eye (plano transversal) */
  TRANSVERSE_SUPERIOR = 'TRANSVERSE_SUPERIOR'
}

/**
 * Nível de confiabilidade da detecção de rotação axial
 */
export enum RotationConfidence {
  /** 0-30% - 1 ângulo, rotação não mensurável */
  NOT_MEASURABLE = 'NOT_MEASURABLE',
  /** 30-50% - assimetria visível em 1 plano */
  INFERRED = 'INFERRED',
  /** 50-80% - confirmado em 2 planos ortogonais */
  PROBABLE = 'PROBABLE',
  /** 80-100% - reconstrução 3D completa */
  CONFIRMED = 'CONFIRMED'
}

/**
 * Classificação do tipo de rotação detectada
 */
export enum RotationType {
  /** Sem rotação significativa */
  NONE = 'NONE',
  /** Rotação intencional (parte do exercício) */
  TECHNICAL = 'TECHNICAL',
  /** Assimetria esquelética/articular */
  STRUCTURAL = 'STRUCTURAL',
  /** Déficit neuromuscular */
  FUNCTIONAL = 'FUNCTIONAL',
  /** Indicadores de dor/lesão ativa */
  PATHOLOGICAL = 'PATHOLOGICAL'
}

/**
 * Origem anatômica da compensação rotacional
 */
export enum RotationOrigin {
  /** Origem escapular */
  SCAPULAR = 'SCAPULAR',
  /** Torácica */
  THORACIC = 'THORACIC',
  /** Lombar */
  LUMBAR = 'LUMBAR',
  /** Pélvica */
  PELVIC = 'PELVIC',
  /** Femoral */
  FEMORAL = 'FEMORAL',
  /** Múltiplos segmentos */
  MULTI_SEGMENTAL = 'MULTI_SEGMENTAL'
}

/**
 * Nível de risco baseado no score de compensação
 */
export enum RiskLevel {
  /** Score < 20 */
  LOW = 'LOW',
  /** Score 20-40 */
  MODERATE = 'MODERATE',
  /** Score > 40 */
  HIGH = 'HIGH'
}

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Fatores que compõem o índice de confiabilidade técnico
 */
export interface ConfidenceFactors {
  /** 0-100: qualidade da calibração espacial */
  spatialCalibration: number;
  /** 0-100: fps normalizado (60fps = 100) */
  temporalResolution: number;
  /** 0-100: % landmarks visíveis */
  landmarkVisibility: number;
  /** 0-100: estabilidade frame-to-frame */
  trackingStability: number;
  /** 0-100: cobertura espacial (planos) */
  viewCoverage: number;
  /** 0-100: qualidade da iluminação */
  lightingQuality: number;
}

/**
 * Configuração do setup de câmeras
 */
export interface CameraSetup {
  /** Modo de captura */
  mode: CaptureMode;
  /** Ângulos de câmera utilizados */
  angles: CameraAngle[];
  /** Frames por segundo */
  fps: number;
  /** Resolução do vídeo */
  resolution: { width: number; height: number };
  /** Distância até o sujeito em metros */
  distanceToSubject: number;
  /** Se as câmeras estão sincronizadas */
  synchronized: boolean;
  /** Dessincronização máxima em ms */
  maxDesyncMs: number;
}

/**
 * Dados de um landmark do MediaPipe
 */
export interface LandmarkData {
  /** Nome do landmark (ex: 'left_shoulder') */
  name: string;
  /** Coordenada X normalizada */
  x: number;
  /** Coordenada Y normalizada */
  y: number;
  /** Coordenada Z (profundidade) - opcional para 2D */
  z?: number;
  /** Confiança do MediaPipe (0-1) */
  confidence: number;
  /** Se o landmark está visível */
  visible: boolean;
  /** Se o landmark está ocluso */
  occluded: boolean;
}

/**
 * Análise de um frame individual
 */
export interface FrameAnalysis {
  /** Número do frame */
  frameNumber: number;
  /** Timestamp em ms */
  timestamp: number;
  /** Landmarks detectados neste frame */
  landmarks: LandmarkData[];
  /** Ângulo da câmera que capturou este frame */
  cameraAngle: CameraAngle;
}

/**
 * Resultado da análise de rotação axial
 */
export interface RotationAnalysis {
  /** Se rotação foi detectada */
  detected: boolean;
  /** Nível de confiança da detecção */
  confidence: RotationConfidence;
  /** Score numérico de confiança (0-100) */
  confidenceScore: number;
  /** Tipo de rotação classificada */
  type: RotationType;
  /** Origem anatômica da rotação */
  origin: RotationOrigin;
  /** Magnitude da rotação em graus */
  magnitude: number;
  /** Score de assimetria (0-100) */
  asymmetryScore: number;
  /** Diferenças bilaterais por articulação */
  bilateralDifference: {
    /** Diferença angular nos ombros (graus) */
    shoulder: number;
    /** Diferença angular nos quadris (graus) */
    hip: number;
    /** Diferença angular nos joelhos (graus) */
    knee: number;
  };
  /** Método de detecção utilizado */
  detectionMethod: string;
}

/**
 * Scores de movimento calculados
 */
export interface MovementScores {
  /** Score motor (0-100) */
  motor: number;
  /** Score estabilizador (0-100) */
  stabilizer: number;
  /** Score de simetria (0-100) */
  symmetry: number;
  /** Score de compensação (0-100, invertido) */
  compensation: number;
  /** Índice Global de Performance Biomecânica */
  igpb: number;
}

/**
 * Ação corretiva recomendada
 */
export interface CorrectiveAction {
  /** Prioridade da ação */
  priority: 'alta' | 'média' | 'baixa';
  /** Categoria da intervenção */
  category: 'mobilidade' | 'estabilidade' | 'força' | 'técnica';
  /** Descrição da ação */
  description: string;
  /** Exercícios recomendados */
  exercises: string[];
  /** Duração do protocolo */
  duration: string;
}

/**
 * Prompt para upgrade de modo de captura
 */
export interface UpgradePrompt {
  /** Modo atual */
  currentMode: CaptureMode;
  /** Modo recomendado */
  recommendedMode: CaptureMode;
  /** Razão para o upgrade */
  reason: string;
  /** Benefícios do upgrade */
  benefits: string[];
}

/**
 * Recomendação de reteste
 */
export interface RetestRecommendation {
  /** Se reteste é recomendado */
  recommended: boolean;
  /** Prazo para reteste */
  timeframe: string;
  /** Razão para o reteste */
  reason: string;
  /** Áreas de foco no reteste */
  focusAreas: string[];
}

/**
 * Interface principal da análise biomecânica completa
 */
export interface BiomechanicalAnalysis {
  /** ID único da análise */
  analysisId: string;
  /** Nome do exercício analisado */
  exerciseName: string;
  /** Timestamp da análise */
  timestamp: Date;
  /** Setup de captura utilizado */
  captureSetup: CameraSetup;
  /** Score geral de confiabilidade (0-100) */
  confidenceScore: number;
  /** Fatores que compõem o score de confiabilidade */
  confidenceFactors: ConfidenceFactors;
  /** Nível qualitativo de confiabilidade */
  confidenceLevel: 'baixa' | 'moderada' | 'alta' | 'excelente';
  /** Análise de rotação axial */
  rotationAnalysis: RotationAnalysis;
  /** Scores de movimento */
  scores: MovementScores;
  /** Nível de risco geral */
  riskLevel: RiskLevel;
  /** Fatores de risco identificados */
  riskFactors: string[];
  /** Ações corretivas recomendadas */
  correctiveActions: CorrectiveAction[];
  /** Prompt para upgrade (se aplicável) */
  upgradePrompt?: UpgradePrompt;
  /** Recomendação de reteste */
  retestRecommendation: RetestRecommendation;
  /** Dados brutos opcionais */
  rawData?: {
    /** Frames analisados */
    frames: FrameAnalysis[];
    /** Tempo de processamento em ms */
    processingTime: number;
  };
}

// ============================================================================
// CONSTANTES
// ============================================================================

/**
 * Thresholds biomecânicos para análise
 */
export const BIOMECHANICAL_THRESHOLDS = {
  /** Confiabilidade mínima por modo */
  minConfidence: {
    ESSENTIAL: 60,
    ADVANCED: 75,
    PRO: 85
  },
  /** Thresholds de assimetria em graus */
  asymmetry: {
    low: 5,
    moderate: 12,
    high: 20
  },
  /** Thresholds de rotação em graus */
  rotation: {
    negligible: 3,
    minor: 8,
    moderate: 15,
    severe: 25
  },
  /** Configurações de FPS */
  fps: {
    minimum: 30,
    recommended: 60,
    optimal: 120
  },
  /** Visibilidade de landmarks */
  landmarkVisibility: {
    minimum: 70,
    optimal: 90
  },
  /** Dessincronização máxima em ms (60fps = 16ms) */
  maxDesyncMs: 16
} as const;

/**
 * Mensagens técnicas contextuais
 */
export const TECHNICAL_MESSAGES = {
  rotationDetection: {
    NOT_MEASURABLE: 'Rotação axial não mensurável com captura monoplanar. Análise limitada ao plano sagital.',
    INFERRED: 'Possível compensação rotacional inferida através de assimetria angular visível no plano sagital.',
    PROBABLE: 'Compensação rotacional provável detectada através de análise biplanar ortogonal.',
    CONFIRMED: 'Compensação rotacional confirmada através de reconstrução vetorial tridimensional.'
  },
  rotationType: {
    NONE: 'Padrão de movimento sem rotação axial significativa detectada.',
    TECHNICAL: 'Rotação axial intencional identificada como parte do padrão motor técnico do exercício.',
    STRUCTURAL: 'Compensação rotacional de origem estrutural detectada, possivelmente relacionada a assimetria esquelética ou articular.',
    FUNCTIONAL: 'Compensação rotacional funcional identificada, sugerindo possível déficit neuromuscular ou assimetria de força.',
    PATHOLOGICAL: 'Padrão de compensação rotacional com características sugestivas de estratégia antálgica ou restrição articular.'
  },
  upgradePrompts: {
    essentialToAdvanced: 'Para validação tridimensional da compensação detectada e confirmação da origem anatômica, recomenda-se captura biplanar (modo Avançado).',
    advancedToPro: 'Detecção de assimetria bilateral superior a 12°. Captura triplanar (modo Pro) permitirá reconstrução 3D completa e quantificação precisa da rotação axial.'
  }
} as const;

/**
 * Mapeamento de níveis de confiabilidade
 */
export const CONFIDENCE_LEVEL_MAP = {
  baixa: { min: 0, max: 60 },
  moderada: { min: 60, max: 75 },
  alta: { min: 75, max: 90 },
  excelente: { min: 90, max: 100 }
} as const;
