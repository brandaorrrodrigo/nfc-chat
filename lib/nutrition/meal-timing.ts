/**
 * Meal Timing - Sugere horário ideal para consumo da receita
 *
 * Baseado em:
 * - Proporção de macros
 * - Densidade calórica
 * - Tipo de carboidrato (se detectável)
 * - Objetivo do usuário
 */

import { RecipeNutrition } from './recipe-calculator';
import { DietPattern } from './diet-classifier';

// ==========================================
// TIPOS
// ==========================================

export type MealTime =
  | 'cafe_manha'
  | 'lanche_manha'
  | 'almoco'
  | 'lanche_tarde'
  | 'pre_treino'
  | 'pos_treino'
  | 'jantar'
  | 'ceia'
  | 'qualquer';

export interface MealTimingSuggestion {
  bestTime: MealTime;
  bestTimeName: string;
  reason: string;
  scientificBasis: string;
  alternatives: {
    time: MealTime;
    timeName: string;
    note: string;
  }[];
  avoid: {
    time: MealTime;
    timeName: string;
    reason: string;
  }[];
}

// ==========================================
// NOMES DOS HORÁRIOS
// ==========================================

export const MEAL_TIME_NAMES: Record<MealTime, string> = {
  cafe_manha: 'Café da manhã',
  lanche_manha: 'Lanche da manhã',
  almoco: 'Almoço',
  lanche_tarde: 'Lanche da tarde',
  pre_treino: 'Pré-treino',
  pos_treino: 'Pós-treino',
  jantar: 'Jantar',
  ceia: 'Ceia',
  qualquer: 'Qualquer horário',
};

// ==========================================
// SUGESTÃO PRINCIPAL
// ==========================================

/**
 * Sugere o melhor horário para consumir a receita
 */
export function suggestMealTiming(
  nutrition: RecipeNutrition,
  pattern?: DietPattern
): MealTimingSuggestion {
  const { perPortion, macroRatio } = nutrition;
  const { carbsPercent, proteinPercent, fatPercent } = macroRatio;
  const calories = perPortion.calories;

  // ====================================
  // REGRAS DE TIMING
  // ====================================

  // 1. KETO/LOW CARB (<20% carbs): Qualquer hora
  if (carbsPercent <= 20) {
    return {
      bestTime: 'qualquer',
      bestTimeName: MEAL_TIME_NAMES.qualquer,
      reason: 'Baixo teor de carboidratos mantém insulina estável ao longo do dia.',
      scientificBasis: 'Refeições low carb não causam picos glicêmicos significativos, permitindo flexibilidade de horário.',
      alternatives: [
        { time: 'cafe_manha', timeName: MEAL_TIME_NAMES.cafe_manha, note: 'Excelente para manter cetose matinal' },
        { time: 'jantar', timeName: MEAL_TIME_NAMES.jantar, note: 'Promove saciedade noturna prolongada' },
      ],
      avoid: [],
    };
  }

  // 2. ALTO CARBO + ALTA PROTEÍNA (>40% carbo, >25% proteína): Pré/Pós treino
  if (carbsPercent >= 40 && proteinPercent >= 25) {
    return {
      bestTime: 'pos_treino',
      bestTimeName: MEAL_TIME_NAMES.pos_treino,
      reason: 'Combinação ideal de carboidratos e proteínas para recuperação muscular.',
      scientificBasis: 'A janela anabólica pós-treino (até 2h) otimiza síntese proteica quando há presença de carboidratos para repor glicogênio.',
      alternatives: [
        { time: 'pre_treino', timeName: MEAL_TIME_NAMES.pre_treino, note: '1-2h antes: energia para o treino' },
        { time: 'almoco', timeName: MEAL_TIME_NAMES.almoco, note: 'Se não for treinar, boa opção para refeição principal' },
      ],
      avoid: [
        { time: 'ceia', timeName: MEAL_TIME_NAMES.ceia, reason: 'Calorias e carbos altos antes de dormir podem prejudicar sono' },
      ],
    };
  }

  // 3. MUITO ALTO CARBO (>55%): Manhã ou Almoço
  if (carbsPercent >= 55) {
    return {
      bestTime: 'cafe_manha',
      bestTimeName: MEAL_TIME_NAMES.cafe_manha,
      reason: 'Alto teor de carboidratos é melhor aproveitado no início do dia.',
      scientificBasis: 'Sensibilidade à insulina é maior pela manhã, permitindo melhor metabolização dos carboidratos. Estudo cronobiológico (Jakubowicz et al., 2013).',
      alternatives: [
        { time: 'almoco', timeName: MEAL_TIME_NAMES.almoco, note: 'Metabolismo ainda ativo para processar carbos' },
        { time: 'pre_treino', timeName: MEAL_TIME_NAMES.pre_treino, note: 'Se treinar à tarde, fornece energia' },
      ],
      avoid: [
        { time: 'jantar', timeName: MEAL_TIME_NAMES.jantar, reason: 'Carbos à noite podem prejudicar qualidade do sono e promover armazenamento como gordura' },
        { time: 'ceia', timeName: MEAL_TIME_NAMES.ceia, reason: 'Pico de insulina noturno atrapalha liberação de GH durante o sono' },
      ],
    };
  }

  // 4. ALTA PROTEÍNA + BAIXO CARBO (>35% proteína, <30% carbo): Jantar
  if (proteinPercent >= 35 && carbsPercent <= 30) {
    return {
      bestTime: 'jantar',
      bestTimeName: MEAL_TIME_NAMES.jantar,
      reason: 'Alta proteína e baixo carboidrato promovem saciedade noturna e recuperação durante o sono.',
      scientificBasis: 'Proteína estimula liberação de aminoácidos durante a noite, suportando recuperação muscular. Baixo carbo evita interferência no ciclo do sono.',
      alternatives: [
        { time: 'pos_treino', timeName: MEAL_TIME_NAMES.pos_treino, note: 'Excelente para treinos noturnos' },
        { time: 'almoco', timeName: MEAL_TIME_NAMES.almoco, note: 'Mantém saciedade por horas' },
      ],
      avoid: [],
    };
  }

  // 5. ALTA GORDURA (>45%): Café ou Almoço
  if (fatPercent >= 45) {
    return {
      bestTime: 'cafe_manha',
      bestTimeName: MEAL_TIME_NAMES.cafe_manha,
      reason: 'Gorduras no café da manhã promovem saciedade prolongada e energia estável.',
      scientificBasis: 'Dietas com gordura matinal (como bulletproof) mantêm energia constante sem picos de insulina, ideal para jejum intermitente.',
      alternatives: [
        { time: 'almoco', timeName: MEAL_TIME_NAMES.almoco, note: 'Permite digestão completa antes da noite' },
      ],
      avoid: [
        { time: 'jantar', timeName: MEAL_TIME_NAMES.jantar, reason: 'Digestão de gorduras é lenta, pode prejudicar sono' },
        { time: 'pre_treino', timeName: MEAL_TIME_NAMES.pre_treino, reason: 'Gordura retarda digestão, pode causar desconforto' },
      ],
    };
  }

  // 6. LEVE (<300 kcal): Lanche
  if (calories < 300) {
    return {
      bestTime: 'lanche_tarde',
      bestTimeName: MEAL_TIME_NAMES.lanche_tarde,
      reason: 'Porção leve ideal para manter energia entre refeições principais.',
      scientificBasis: 'Lanches moderados (150-300kcal) ajudam a manter glicemia estável e evitam fome excessiva na próxima refeição.',
      alternatives: [
        { time: 'lanche_manha', timeName: MEAL_TIME_NAMES.lanche_manha, note: 'Se o café foi leve' },
        { time: 'ceia', timeName: MEAL_TIME_NAMES.ceia, note: 'Se for proteico e baixo carbo' },
      ],
      avoid: [],
    };
  }

  // 7. BALANCEADO (default): Almoço
  return {
    bestTime: 'almoco',
    bestTimeName: MEAL_TIME_NAMES.almoco,
    reason: 'Perfil balanceado ideal para a principal refeição do dia.',
    scientificBasis: 'Refeições balanceadas ao meio-dia coincidem com o pico metabólico circadiano, otimizando absorção e utilização de nutrientes.',
    alternatives: [
      { time: 'jantar', timeName: MEAL_TIME_NAMES.jantar, note: 'Se preferir almoço mais leve' },
      { time: 'cafe_manha', timeName: MEAL_TIME_NAMES.cafe_manha, note: 'Para quem faz refeições maiores de manhã' },
    ],
    avoid: [],
  };
}

/**
 * Verifica compatibilidade com treino
 */
export function getWorkoutCompatibility(nutrition: RecipeNutrition): {
  preWorkout: { suitable: boolean; note: string };
  postWorkout: { suitable: boolean; note: string };
} {
  const { perPortion, macroRatio } = nutrition;

  // Pré-treino ideal: carbos moderados, baixa gordura, proteína moderada
  const preWorkoutSuitable =
    macroRatio.carbsPercent >= 30 &&
    macroRatio.fatPercent <= 30 &&
    perPortion.calories >= 200 &&
    perPortion.calories <= 500;

  // Pós-treino ideal: carbos + proteína, qualquer gordura
  const postWorkoutSuitable =
    macroRatio.proteinPercent >= 20 &&
    macroRatio.carbsPercent >= 25 &&
    perPortion.protein >= 20;

  return {
    preWorkout: {
      suitable: preWorkoutSuitable,
      note: preWorkoutSuitable
        ? 'Boa fonte de energia para treino'
        : macroRatio.fatPercent > 30
          ? 'Muita gordura pode causar desconforto'
          : 'Carbos ou calorias insuficientes',
    },
    postWorkout: {
      suitable: postWorkoutSuitable,
      note: postWorkoutSuitable
        ? 'Excelente para recuperação muscular'
        : perPortion.protein < 20
          ? 'Proteína insuficiente para recuperação ideal'
          : 'Adicione mais carboidratos para repor glicogênio',
    },
  };
}

export default {
  suggestMealTiming,
  getWorkoutCompatibility,
  MEAL_TIME_NAMES,
};
