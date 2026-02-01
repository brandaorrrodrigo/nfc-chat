/**
 * Recipe Variations - Gera variações da receita para diferentes dietas
 *
 * Sugere modificações para:
 * - Versão Keto
 * - Versão Vegana
 * - Versão High Protein
 * - Versão Low Carb
 * - Versão Sem Glúten
 */

import { ParsedRecipe } from './recipe-parser';
import { DietPattern } from './diet-classifier';
import { RecipeNutrition } from './recipe-calculator';

// ==========================================
// TIPOS
// ==========================================

export interface RecipeVariation {
  name: string;
  emoji: string;
  targetPattern: DietPattern | string;
  changes: IngredientChange[];
  estimatedMacroChange: {
    proteinChange: string;  // "+20%", "-10%", "=", etc
    carbsChange: string;
    fatChange: string;
  };
  benefits: string[];
  difficulty: 'facil' | 'medio' | 'dificil';
}

export interface IngredientChange {
  action: 'substituir' | 'adicionar' | 'remover' | 'reduzir' | 'aumentar';
  original?: string;
  replacement?: string;
  note?: string;
}

// ==========================================
// SUBSTITUIÇÕES POR CATEGORIA
// ==========================================

export const SUBSTITUTIONS = {
  // Proteínas animais → vegetais
  animalToVegan: {
    'frango': 'tofu firme ou grão-de-bico',
    'carne': 'cogumelos portobello ou lentilhas',
    'carne moida': 'proteína de soja texturizada',
    'peixe': 'tofu defumado ou palmito',
    'camarao': 'cogumelos shimeji',
    'ovo': 'linhaça hidratada (1 colher + 3 colheres água) ou banana',
    'leite': 'leite de amêndoas ou aveia',
    'queijo': 'castanha de caju processada ou tofu amassado',
    'iogurte': 'iogurte de coco',
    'manteiga': 'óleo de coco ou pasta de amendoim',
    'whey': 'proteína de ervilha ou arroz',
    'cream cheese': 'tofu batido com limão',
  },

  // Carbos → Low Carb
  carbsToLowCarb: {
    'arroz': 'couve-flor ralada (arroz de couve-flor)',
    'batata': 'abobrinha ou chuchu',
    'batata doce': 'abóbora cabotiá',
    'macarrao': 'espaguete de abobrinha ou shirataki',
    'pao': 'pão de frigideira (ovo + cream cheese)',
    'farinha de trigo': 'farinha de amêndoas ou coco',
    'aveia': 'farinha de linhaça',
    'tapioca': 'crepioca (tapioca + ovo)',
    'acucar': 'eritritol ou stevia',
    'mel': 'xilitol',
    'banana': 'abacate',
  },

  // Aumentar proteína
  addProtein: {
    additions: [
      '1 scoop de whey protein',
      '2 claras de ovo extras',
      '50g de frango desfiado',
      '30g de queijo cottage',
      '1 colher de colágeno',
    ],
  },

  // Glúten → Sem glúten
  glutenFree: {
    'farinha de trigo': 'farinha de arroz ou amêndoas',
    'aveia': 'aveia certificada sem glúten ou quinoa em flocos',
    'pao': 'pão sem glúten ou wrap de ovo',
    'macarrao': 'macarrão de arroz ou abobrinha',
    'cerveja': 'vinho ou suco',
  },

  // Lactose → Sem lactose
  lactoseFree: {
    'leite': 'leite sem lactose ou vegetal',
    'queijo': 'queijo sem lactose ou vegetal',
    'iogurte': 'iogurte sem lactose ou coco',
    'manteiga': 'manteiga ghee (sem lactose) ou óleo de coco',
    'requeijao': 'requeijão sem lactose',
    'cream cheese': 'cream cheese sem lactose',
  },
};

// ==========================================
// GERADOR DE VARIAÇÕES
// ==========================================

/**
 * Gera variações da receita baseado no padrão atual
 */
export function generateVariations(
  recipe: ParsedRecipe,
  nutrition: RecipeNutrition,
  currentPattern: DietPattern
): RecipeVariation[] {
  const variations: RecipeVariation[] = [];
  const ingredientNames = recipe.ingredients.map(i => i.name.toLowerCase());

  // 1. VERSÃO VEGANA (se tiver produtos animais)
  if (hasAnimalProducts(ingredientNames)) {
    const veganChanges = generateVeganChanges(ingredientNames);
    if (veganChanges.length > 0) {
      variations.push({
        name: 'Versão Vegana',
        emoji: '🌱',
        targetPattern: 'vegana',
        changes: veganChanges,
        estimatedMacroChange: {
          proteinChange: '-10%',
          carbsChange: '+15%',
          fatChange: '=',
        },
        benefits: [
          'Livre de produtos animais',
          'Rica em fibras vegetais',
          'Mais sustentável ambientalmente',
        ],
        difficulty: 'medio',
      });
    }
  }

  // 2. VERSÃO HIGH PROTEIN (se proteína < 35%)
  if (nutrition.macroRatio.proteinPercent < 35) {
    variations.push({
      name: 'Versão High Protein',
      emoji: '💪',
      targetPattern: 'high_protein',
      changes: generateHighProteinChanges(ingredientNames),
      estimatedMacroChange: {
        proteinChange: '+40%',
        carbsChange: '-10%',
        fatChange: '-5%',
      },
      benefits: [
        'Ideal para hipertrofia',
        'Maior saciedade',
        'Melhor recuperação muscular',
      ],
      difficulty: 'facil',
    });
  }

  // 3. VERSÃO LOW CARB (se carbs > 30%)
  if (nutrition.macroRatio.carbsPercent > 30 && currentPattern !== 'keto' && currentPattern !== 'low_carb') {
    const lowCarbChanges = generateLowCarbChanges(ingredientNames);
    if (lowCarbChanges.length > 0) {
      variations.push({
        name: 'Versão Low Carb',
        emoji: '🥑',
        targetPattern: 'low_carb',
        changes: lowCarbChanges,
        estimatedMacroChange: {
          proteinChange: '+10%',
          carbsChange: '-60%',
          fatChange: '+30%',
        },
        benefits: [
          'Reduz picos de insulina',
          'Acelera oxidação de gordura',
          'Melhora energia mental',
        ],
        difficulty: 'medio',
      });
    }
  }

  // 4. VERSÃO KETO (se não for keto e tiver carbos significativos)
  if (currentPattern !== 'keto' && nutrition.macroRatio.carbsPercent > 10) {
    variations.push({
      name: 'Versão Keto',
      emoji: '🥓',
      targetPattern: 'keto',
      changes: generateKetoChanges(ingredientNames),
      estimatedMacroChange: {
        proteinChange: '=',
        carbsChange: '-80%',
        fatChange: '+50%',
      },
      benefits: [
        'Mantém cetose',
        'Energia estável de gorduras',
        'Ideal para jejum intermitente',
      ],
      difficulty: 'dificil',
    });
  }

  // 5. VERSÃO SEM GLÚTEN (se tiver glúten)
  if (hasGluten(ingredientNames)) {
    variations.push({
      name: 'Versão Sem Glúten',
      emoji: '🌾',
      targetPattern: 'sem_gluten',
      changes: generateGlutenFreeChanges(ingredientNames),
      estimatedMacroChange: {
        proteinChange: '=',
        carbsChange: '=',
        fatChange: '=',
      },
      benefits: [
        'Adequada para celíacos',
        'Pode reduzir inflamação',
        'Digestão mais leve',
      ],
      difficulty: 'facil',
    });
  }

  // Limitar a 3 variações mais relevantes
  return variations.slice(0, 3);
}

// ==========================================
// GERADORES DE MUDANÇAS
// ==========================================

function generateVeganChanges(ingredients: string[]): IngredientChange[] {
  const changes: IngredientChange[] = [];

  for (const ing of ingredients) {
    for (const [animal, vegan] of Object.entries(SUBSTITUTIONS.animalToVegan)) {
      if (ing.includes(animal)) {
        changes.push({
          action: 'substituir',
          original: ing,
          replacement: vegan,
        });
        break;
      }
    }
  }

  return changes;
}

function generateHighProteinChanges(ingredients: string[]): IngredientChange[] {
  const changes: IngredientChange[] = [];

  // Dobrar proteínas existentes
  const proteinSources = ['frango', 'carne', 'peixe', 'ovo', 'tofu'];
  for (const ing of ingredients) {
    if (proteinSources.some(p => ing.includes(p))) {
      changes.push({
        action: 'aumentar',
        original: ing,
        note: 'Dobrar a quantidade',
      });
      break;
    }
  }

  // Adicionar fonte de proteína
  changes.push({
    action: 'adicionar',
    replacement: '1 scoop de whey protein ou 2 claras extras',
  });

  // Reduzir gorduras se houver
  const fatSources = ['azeite', 'oleo', 'manteiga'];
  for (const ing of ingredients) {
    if (fatSources.some(f => ing.includes(f))) {
      changes.push({
        action: 'reduzir',
        original: ing,
        note: 'Reduzir em 30%',
      });
      break;
    }
  }

  return changes;
}

function generateLowCarbChanges(ingredients: string[]): IngredientChange[] {
  const changes: IngredientChange[] = [];

  for (const ing of ingredients) {
    for (const [carb, replacement] of Object.entries(SUBSTITUTIONS.carbsToLowCarb)) {
      if (ing.includes(carb)) {
        changes.push({
          action: 'substituir',
          original: ing,
          replacement: replacement,
        });
        break;
      }
    }
  }

  // Adicionar gordura boa
  if (changes.length > 0) {
    changes.push({
      action: 'adicionar',
      replacement: '1 colher de azeite ou 1/4 de abacate',
      note: 'Para compensar energia',
    });
  }

  return changes;
}

function generateKetoChanges(ingredients: string[]): IngredientChange[] {
  const changes: IngredientChange[] = [];

  // Usar substituições low carb
  for (const ing of ingredients) {
    for (const [carb, replacement] of Object.entries(SUBSTITUTIONS.carbsToLowCarb)) {
      if (ing.includes(carb)) {
        changes.push({
          action: 'substituir',
          original: ing,
          replacement: replacement,
        });
        break;
      }
    }
  }

  // Remover frutas (exceto abacate e coco)
  const highCarbFruits = ['banana', 'maca', 'laranja', 'manga', 'uva'];
  for (const ing of ingredients) {
    if (highCarbFruits.some(f => ing.includes(f))) {
      changes.push({
        action: 'remover',
        original: ing,
        note: 'Alto teor de açúcar',
      });
    }
  }

  // Adicionar gordura
  changes.push({
    action: 'adicionar',
    replacement: '2 colheres de azeite ou manteiga',
    note: 'Aumentar gorduras para energia',
  });

  return changes;
}

function generateGlutenFreeChanges(ingredients: string[]): IngredientChange[] {
  const changes: IngredientChange[] = [];

  for (const ing of ingredients) {
    for (const [gluten, replacement] of Object.entries(SUBSTITUTIONS.glutenFree)) {
      if (ing.includes(gluten)) {
        changes.push({
          action: 'substituir',
          original: ing,
          replacement: replacement,
        });
        break;
      }
    }
  }

  return changes;
}

// ==========================================
// HELPERS
// ==========================================

function hasAnimalProducts(ingredients: string[]): boolean {
  const animalKeywords = [
    'frango', 'carne', 'peixe', 'ovo', 'leite', 'queijo', 'iogurte',
    'manteiga', 'whey', 'camarao', 'bacon', 'presunto', 'cream cheese'
  ];
  return ingredients.some(ing =>
    animalKeywords.some(keyword => ing.includes(keyword))
  );
}

function hasGluten(ingredients: string[]): boolean {
  const glutenKeywords = ['trigo', 'farinha', 'pao', 'macarrao', 'aveia', 'massa'];
  return ingredients.some(ing =>
    glutenKeywords.some(keyword => ing.includes(keyword))
  );
}

export default {
  generateVariations,
  SUBSTITUTIONS,
};
