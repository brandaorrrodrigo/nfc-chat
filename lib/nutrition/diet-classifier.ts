/**
 * Diet Classifier - Classifica padrão alimentar da receita
 *
 * Detecta automaticamente se a receita se encaixa em:
 * - Keto (cetogênica)
 * - Low Carb
 * - High Protein
 * - Balanced
 * - High Carb
 * - Vegetariana
 * - Vegana
 */

import { RecipeNutrition } from './recipe-calculator';
import { ParsedRecipe } from './recipe-parser';

// ==========================================
// TIPOS
// ==========================================

export type DietPattern =
  | 'keto'
  | 'low_carb'
  | 'high_protein'
  | 'balanced'
  | 'high_carb'
  | 'mediterranean';

export type DietaryRestriction =
  | 'vegetariana'
  | 'vegana'
  | 'sem_gluten'
  | 'sem_lactose';

export interface DietClassification {
  pattern: DietPattern;
  patternName: string;
  description: string;
  restrictions: DietaryRestriction[];
  compatibility: {
    emagrecimento: number;  // 0-100
    hipertrofia: number;
    manutencao: number;
    diabetes: number;
  };
}

// ==========================================
// CLASSIFICADOR PRINCIPAL
// ==========================================

/**
 * Classifica o padrão alimentar baseado nos macros
 */
export function classifyDiet(macroRatio: {
  proteinPercent: number;
  carbsPercent: number;
  fatPercent: number;
}): DietPattern {
  const { proteinPercent, carbsPercent, fatPercent } = macroRatio;

  // Keto: <10% carbs, >60% fat
  if (carbsPercent <= 10 && fatPercent >= 60) {
    return 'keto';
  }

  // Low Carb: <25% carbs
  if (carbsPercent <= 25) {
    return 'low_carb';
  }

  // High Protein: >35% protein
  if (proteinPercent >= 35) {
    return 'high_protein';
  }

  // High Carb: >55% carbs
  if (carbsPercent >= 55) {
    return 'high_carb';
  }

  // Mediterranean: moderado em tudo, com boa gordura
  if (carbsPercent >= 35 && carbsPercent <= 50 &&
      fatPercent >= 25 && fatPercent <= 40 &&
      proteinPercent >= 15) {
    return 'mediterranean';
  }

  // Balanced: tudo no meio
  return 'balanced';
}

/**
 * Classifica restrições dietéticas baseado nos ingredientes
 */
export function classifyRestrictions(recipe: ParsedRecipe): DietaryRestriction[] {
  const restrictions: DietaryRestriction[] = [];
  const ingredientNames = recipe.ingredients.map(i => i.name.toLowerCase());
  const allIngredients = ingredientNames.join(' ');

  // Ingredientes animais
  const animalProducts = [
    'frango', 'carne', 'bovina', 'porco', 'peixe', 'camarão', 'camarao',
    'salmao', 'salmão', 'atum', 'tilapia', 'tilápia', 'bacon', 'linguiça',
    'linguica', 'presunto', 'peru', 'pato'
  ];

  // Produtos de origem animal (não-carne)
  const animalDerived = [
    'ovo', 'leite', 'queijo', 'iogurte', 'manteiga', 'nata', 'creme',
    'requeijão', 'requeijao', 'whey', 'cream cheese', 'ricota', 'cottage'
  ];

  // Glúten
  const glutenProducts = [
    'trigo', 'farinha', 'pão', 'pao', 'macarrão', 'macarrao', 'massa',
    'aveia', 'cevada', 'centeio', 'biscoito', 'bolacha', 'torrada'
  ];

  // Lactose
  const lactoseProducts = [
    'leite', 'queijo', 'iogurte', 'nata', 'creme de leite', 'requeijão',
    'requeijao', 'manteiga', 'cream cheese'
  ];

  // Verificar restrições
  const hasAnimalMeat = animalProducts.some(p => allIngredients.includes(p));
  const hasAnimalDerived = animalDerived.some(p => allIngredients.includes(p));
  const hasGluten = glutenProducts.some(p => allIngredients.includes(p));
  const hasLactose = lactoseProducts.some(p => allIngredients.includes(p));

  // Vegetariana: sem carne, pode ter derivados
  if (!hasAnimalMeat) {
    restrictions.push('vegetariana');

    // Vegana: sem nada animal
    if (!hasAnimalDerived) {
      restrictions.push('vegana');
    }
  }

  // Sem glúten
  if (!hasGluten) {
    restrictions.push('sem_gluten');
  }

  // Sem lactose
  if (!hasLactose) {
    restrictions.push('sem_lactose');
  }

  return restrictions;
}

/**
 * Retorna classificação completa da dieta
 */
export function getFullDietClassification(
  recipe: ParsedRecipe,
  nutrition: RecipeNutrition
): DietClassification {
  const pattern = classifyDiet(nutrition.macroRatio);
  const restrictions = classifyRestrictions(recipe);

  const patternInfo: Record<DietPattern, { name: string; description: string }> = {
    keto: {
      name: 'Cetogênica (Keto)',
      description: 'Muito baixa em carboidratos, alta em gorduras. Promove cetose.',
    },
    low_carb: {
      name: 'Low Carb',
      description: 'Baixa em carboidratos, moderada em proteínas e gorduras.',
    },
    high_protein: {
      name: 'Proteica',
      description: 'Alta em proteínas. Ideal para recuperação muscular.',
    },
    balanced: {
      name: 'Balanceada',
      description: 'Distribuição equilibrada de macronutrientes.',
    },
    high_carb: {
      name: 'Rica em Carboidratos',
      description: 'Alta em carboidratos. Boa para energia rápida.',
    },
    mediterranean: {
      name: 'Mediterrânea',
      description: 'Balanceada com foco em gorduras boas e fibras.',
    },
  };

  // Calcular compatibilidade com objetivos
  const { proteinPercent, carbsPercent, fatPercent } = nutrition.macroRatio;
  const calories = nutrition.perPortion.calories;

  const compatibility = {
    // Emagrecimento: prefere baixo carbo, alta proteína, calorias moderadas
    emagrecimento: Math.min(100, Math.max(0,
      100 - (carbsPercent > 40 ? carbsPercent - 40 : 0) * 1.5 +
      (proteinPercent > 25 ? 20 : 0) -
      (calories > 500 ? (calories - 500) / 10 : 0)
    )),

    // Hipertrofia: prefere alta proteína, carbos moderados
    hipertrofia: Math.min(100, Math.max(0,
      50 + (proteinPercent - 25) * 2 +
      (carbsPercent >= 30 && carbsPercent <= 50 ? 20 : 0) +
      (calories > 400 ? 10 : 0)
    )),

    // Manutenção: balanceado
    manutencao: Math.min(100, Math.max(0,
      70 +
      (proteinPercent >= 15 && proteinPercent <= 35 ? 15 : -10) +
      (carbsPercent >= 30 && carbsPercent <= 55 ? 15 : -10)
    )),

    // Diabetes: prefere baixo carbo
    diabetes: Math.min(100, Math.max(0,
      100 - carbsPercent * 1.5 +
      (nutrition.perPortion.fiber > 3 ? 15 : 0)
    )),
  };

  return {
    pattern,
    patternName: patternInfo[pattern].name,
    description: patternInfo[pattern].description,
    restrictions,
    compatibility,
  };
}

export default {
  classifyDiet,
  classifyRestrictions,
  getFullDietClassification,
};
