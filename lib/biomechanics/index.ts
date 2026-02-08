/**
 * Módulo de Biomecânica - Exportações Principais
 * Sistema de análise biomecânica integrado com MediaPipe, classificação, RAG e LLM
 */

// Templates e Categorias
export {
  CriterionRange,
  CategoryTemplate,
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
export {
  ClassificationLevel,
  MetricValue,
  CriteriaClassification,
  ClassificationResult,
  classifyMetrics,
  calculateOverallScore,
  extractRAGTopicsFromClassification,
  extractAllRAGTopics,
  summarizeClassification,
  summarizeClassificationResult,
  isMetricInRange,
} from './criteria-classifier';

// Processamento de MediaPipe
export {
  Landmark,
  Frame,
  ProcessedFrameMetrics,
  ProcessedVideoMetrics,
  LANDMARKS,
  processFrame,
  processFrameSequence,
} from './mediapipe-processor';

// Construção de Prompts
export {
  PromptBuilderInput,
  RAGContext,
  BuiltPrompt,
  buildPrompt,
  buildMinimalPrompt,
  debugPrompt,
} from './prompt-builder';

// Análise Integrada
export {
  BiomechanicsAnalysisInput,
  BiomechanicsAnalysisOutput,
  AnalysisConfig,
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
