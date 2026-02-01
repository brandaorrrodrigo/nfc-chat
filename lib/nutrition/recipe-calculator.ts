/**
 * Recipe Calculator - Calcula valores nutricionais totais de receitas
 *
 * Usa dados TACO para calcular:
 * - Calorias totais e por porção
 * - Macros (proteína, carbs, gordura)
 * - Fibras
 * - Proporção de macros
 */

import { ParsedRecipe, Ingredient, convertToGrams } from './recipe-parser';
import { getNutritionFromTACO, TACOFood } from './taco-database';

// ==========================================
// TIPOS
// ==========================================

export interface RecipeNutrition {
  // Totais da receita
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;

  // Por porção
  perPortion: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };

  // Proporção de macros (em %)
  macroRatio: {
    proteinPercent: number;
    carbsPercent: number;
    fatPercent: number;
  };

  // Detalhes dos ingredientes
  ingredientDetails: IngredientNutrition[];

  // Ingredientes não encontrados
  unknownIngredients: string[];

  // Confiança do cálculo (0-100)
  confidence: number;
}

export interface IngredientNutrition {
  name: string;
  quantity: number;
  unit: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  found: boolean;
}

// ==========================================
// CALCULADOR PRINCIPAL
// ==========================================

/**
 * Calcula valores nutricionais de uma receita parseada
 */
export async function calculateRecipeNutrition(
  recipe: ParsedRecipe
): Promise<RecipeNutrition> {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalFiber = 0;

  const ingredientDetails: IngredientNutrition[] = [];
  const unknownIngredients: string[] = [];
  let foundCount = 0;

  // Calcular nutrição de cada ingrediente
  for (const ingredient of recipe.ingredients) {
    const nutrition = await calculateIngredientNutrition(ingredient);
    ingredientDetails.push(nutrition);

    if (nutrition.found) {
      foundCount++;
      totalCalories += nutrition.calories;
      totalProtein += nutrition.protein;
      totalCarbs += nutrition.carbs;
      totalFat += nutrition.fat;
      totalFiber += nutrition.fiber;
    } else {
      unknownIngredients.push(ingredient.name);
    }
  }

  // Calcular por porção
  const portions = recipe.portions || 1;
  const perPortion = {
    calories: Math.round(totalCalories / portions),
    protein: Math.round(totalProtein / portions * 10) / 10,
    carbs: Math.round(totalCarbs / portions * 10) / 10,
    fat: Math.round(totalFat / portions * 10) / 10,
    fiber: Math.round(totalFiber / portions * 10) / 10,
  };

  // Calcular proporção de macros
  const totalMacroCalories = (totalProtein * 4) + (totalCarbs * 4) + (totalFat * 9);
  const macroRatio = {
    proteinPercent: totalMacroCalories > 0
      ? Math.round((totalProtein * 4 / totalMacroCalories) * 100)
      : 0,
    carbsPercent: totalMacroCalories > 0
      ? Math.round((totalCarbs * 4 / totalMacroCalories) * 100)
      : 0,
    fatPercent: totalMacroCalories > 0
      ? Math.round((totalFat * 9 / totalMacroCalories) * 100)
      : 0,
  };

  // Calcular confiança baseado em ingredientes encontrados
  const confidence = recipe.ingredients.length > 0
    ? Math.round((foundCount / recipe.ingredients.length) * 100)
    : 0;

  return {
    totalCalories: Math.round(totalCalories),
    totalProtein: Math.round(totalProtein * 10) / 10,
    totalCarbs: Math.round(totalCarbs * 10) / 10,
    totalFat: Math.round(totalFat * 10) / 10,
    totalFiber: Math.round(totalFiber * 10) / 10,
    perPortion,
    macroRatio,
    ingredientDetails,
    unknownIngredients,
    confidence,
  };
}

/**
 * Calcula nutrição de um ingrediente individual
 */
async function calculateIngredientNutrition(
  ingredient: Ingredient
): Promise<IngredientNutrition> {
  // Buscar dados nutricionais
  const tacoData = getNutritionFromTACO(ingredient.name);

  // Converter quantidade para gramas
  const grams = convertToGrams(ingredient.quantity, ingredient.unit);

  if (!tacoData) {
    return {
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      grams,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      found: false,
    };
  }

  // Calcular valores proporcionais (dados TACO são por 100g)
  const multiplier = grams / 100;

  return {
    name: ingredient.name,
    quantity: ingredient.quantity,
    unit: ingredient.unit,
    grams,
    calories: Math.round(tacoData.calories * multiplier),
    protein: Math.round(tacoData.protein * multiplier * 10) / 10,
    carbs: Math.round(tacoData.carbs * multiplier * 10) / 10,
    fat: Math.round(tacoData.fat * multiplier * 10) / 10,
    fiber: Math.round(tacoData.fiber * multiplier * 10) / 10,
    found: true,
  };
}

// ==========================================
// ANÁLISES ADICIONAIS
// ==========================================

/**
 * Verifica se a receita é adequada para um objetivo
 */
export function checkRecipeGoalFit(
  nutrition: RecipeNutrition,
  goal: 'emagrecimento' | 'hipertrofia' | 'manutencao'
): {
  suitable: boolean;
  reasons: string[];
  suggestions: string[];
} {
  const { perPortion, macroRatio } = nutrition;
  const reasons: string[] = [];
  const suggestions: string[] = [];

  switch (goal) {
    case 'emagrecimento':
      // Ideal: baixo carbo, alta proteína, calorias moderadas
      if (perPortion.calories > 500) {
        reasons.push('Calorias acima do ideal para uma refeição de emagrecimento');
        suggestions.push('Reduza porção ou substitua ingredientes calóricos');
      }
      if (macroRatio.carbsPercent > 50) {
        reasons.push('Alto teor de carboidratos');
        suggestions.push('Substitua parte dos carbos por vegetais fibrosos');
      }
      if (macroRatio.proteinPercent < 25) {
        reasons.push('Proteína poderia ser maior para saciedade');
        suggestions.push('Adicione mais proteína magra');
      }
      break;

    case 'hipertrofia':
      // Ideal: alta proteína, carbos moderados, calorias adequadas
      if (perPortion.protein < 25) {
        reasons.push('Proteína abaixo do ideal para hipertrofia');
        suggestions.push('Adicione mais proteína (whey, frango, ovos)');
      }
      if (perPortion.calories < 400) {
        reasons.push('Calorias podem ser insuficientes para ganho muscular');
        suggestions.push('Aumente porção ou adicione fontes saudáveis');
      }
      break;

    case 'manutencao':
      // Ideal: balanceado
      if (macroRatio.proteinPercent < 15) {
        reasons.push('Proteína um pouco baixa');
        suggestions.push('Considere adicionar uma fonte proteica');
      }
      break;
  }

  return {
    suitable: reasons.length === 0,
    reasons,
    suggestions,
  };
}

/**
 * Calcula densidade nutricional (nutrientes por caloria)
 */
export function calculateNutrientDensity(nutrition: RecipeNutrition): {
  proteinDensity: number;  // g proteína por 100kcal
  fiberDensity: number;    // g fibra por 100kcal
  rating: 'alta' | 'media' | 'baixa';
} {
  const { totalCalories, totalProtein, totalFiber } = nutrition;

  if (totalCalories === 0) {
    return { proteinDensity: 0, fiberDensity: 0, rating: 'baixa' };
  }

  const proteinDensity = (totalProtein / totalCalories) * 100;
  const fiberDensity = (totalFiber / totalCalories) * 100;

  // Rating baseado em densidade
  let rating: 'alta' | 'media' | 'baixa' = 'media';

  if (proteinDensity > 8 || fiberDensity > 3) {
    rating = 'alta';
  } else if (proteinDensity < 4 && fiberDensity < 1) {
    rating = 'baixa';
  }

  return {
    proteinDensity: Math.round(proteinDensity * 10) / 10,
    fiberDensity: Math.round(fiberDensity * 10) / 10,
    rating,
  };
}

export default {
  calculateRecipeNutrition,
  checkRecipeGoalFit,
  calculateNutrientDensity,
};
