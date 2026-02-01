/**
 * Training System - Exports
 *
 * Sistema completo de análise biomecânica de exercícios.
 */

// Parser de Exercícios
export {
  parseExerciseFromPost,
  looksLikeExercise,
  type ParsedExercise,
} from './exercise-parser';

// Base de Dados de Exercícios
export {
  findExercise,
  findSiblingExercises,
  getAvailableExercises,
  EXERCISE_DATABASE,
  type ExerciseData,
} from './exercise-database';

// Gerador de Análise Biomecânica
export {
  generateExerciseAnalysis,
  type ExerciseAnalysisResult,
} from './exercise-analysis';
