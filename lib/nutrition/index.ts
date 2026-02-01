/**
 * Nutrition System - Exports
 *
 * Sistema completo de análise nutricional de receitas.
 */

// Parser de Receitas
export {
  parseRecipeFromPost,
  convertToGrams,
  looksLikeRecipe,
  type ParsedRecipe,
  type Ingredient,
} from './recipe-parser';

// Base de Dados TACO
export {
  getNutritionFromTACO,
  getAvailableFoods,
  TACO_DATABASE,
  type TACOFood,
} from './taco-database';

// Calculador de Nutrição
export {
  calculateRecipeNutrition,
  checkRecipeGoalFit,
  calculateNutrientDensity,
  type RecipeNutrition,
  type IngredientNutrition,
} from './recipe-calculator';

// Classificador de Dieta
export {
  classifyDiet,
  classifyRestrictions,
  getFullDietClassification,
  type DietPattern,
  type DietaryRestriction,
  type DietClassification,
} from './diet-classifier';

// Timing de Refeições
export {
  suggestMealTiming,
  getWorkoutCompatibility,
  MEAL_TIME_NAMES,
  type MealTime,
  type MealTimingSuggestion,
} from './meal-timing';

// Variações de Receita
export {
  generateVariations,
  SUBSTITUTIONS,
  type RecipeVariation,
  type IngredientChange,
} from './recipe-variations';

// Gerador de Resposta
export {
  generateNutritionAnalysis,
  type NutritionAnalysisResult,
} from './nutrition-response';
