/**
 * Módulo de Biomecânica - Exportações Principais
 * Sistema de análise biomecânica integrado com MediaPipe, classificação, RAG e LLM
 */

// Templates e Categorias
export type { CriterionRange, CategoryTemplate } from './category-templates';
export {
  SQUAT_TEMPLATE,
  HINGE_TEMPLATE,
  HORIZONTAL_PRESS_TEMPLATE,
  VERTICAL_PRESS_TEMPLATE,
  PULL_TEMPLATE,
  UNILATERAL_TEMPLATE,
  CORE_TEMPLATE,
  EXERCISE_CATEGORY_MAP,
  getCategoryTemplate,
  getExerciseCategory,
} from './category-templates';

// Classificação de Critérios
export type {
  ClassificationLevel,
  MetricValue,
  CriteriaClassification,
  ClassificationResult,
} from './criteria-classifier';
export {
  classifyMetrics,
  calculateOverallScore,
  extractRAGTopicsFromClassification,
  extractAllRAGTopics,
  summarizeClassification,
  summarizeClassificationResult,
  isMetricInRange,
} from './criteria-classifier';

// Processamento de MediaPipe
export type {
  Landmark,
  Frame,
  ProcessedFrameMetrics,
  ProcessedVideoMetrics,
} from './mediapipe-processor';
export {
  LANDMARKS,
  processFrame,
  processFrameSequence,
} from './mediapipe-processor';

// Construção de Prompts
export type { PromptBuilderInput, RAGContext, BuiltPrompt } from './prompt-builder';
export {
  buildPrompt,
  buildMinimalPrompt,
  debugPrompt,
} from './prompt-builder';

// Análise Integrada
export type {
  BiomechanicsAnalysisInput,
  BiomechanicsAnalysisOutput,
  AnalysisConfig,
} from './biomechanics-analyzer';
export {
  analyzeBiomechanics,
  classifyOnly,
  generateMockFrames,
} from './biomechanics-analyzer';

// RAG - Retrieval-Augmented Generation
export {
  queryRAG,
  listAvailableTopics,
  getTopicsByCategory,
  addCustomTopic,
} from './biomechanics-rag';
