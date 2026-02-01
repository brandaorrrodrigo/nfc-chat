/**
 * Nutrition Response Generator
 *
 * Gera resposta completa da IA com análise nutricional da receita.
 * Inclui: macros, timing, variações e benefícios.
 */

import { ParsedRecipe } from './recipe-parser';
import { RecipeNutrition, calculateNutrientDensity } from './recipe-calculator';
import { getFullDietClassification, DietClassification } from './diet-classifier';
import { suggestMealTiming, getWorkoutCompatibility, MealTimingSuggestion } from './meal-timing';
import { generateVariations, RecipeVariation } from './recipe-variations';

// ==========================================
// TIPOS
// ==========================================

export interface NutritionAnalysisResult {
  response: string;
  fpAwarded: number;
  confidence: number;
  summary: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    pattern: string;
    bestTiming: string;
  };
}

// ==========================================
// GERADOR DE RESPOSTA
// ==========================================

/**
 * Gera análise nutricional completa formatada
 */
export function generateNutritionAnalysis(
  userName: string,
  recipe: ParsedRecipe,
  nutrition: RecipeNutrition
): NutritionAnalysisResult {
  // Calcular todas as análises
  const classification = getFullDietClassification(recipe, nutrition);
  const timing = suggestMealTiming(nutrition, classification.pattern);
  const variations = generateVariations(recipe, nutrition, classification.pattern);
  const density = calculateNutrientDensity(nutrition);
  const workoutCompat = getWorkoutCompatibility(nutrition);

  // Calcular FP baseado na qualidade da receita
  const fpAwarded = calculateRecipeFP(recipe, nutrition, classification);

  // Gerar resposta formatada
  const response = formatNutritionResponse(
    userName,
    recipe,
    nutrition,
    classification,
    timing,
    variations,
    density,
    workoutCompat,
    fpAwarded
  );

  return {
    response,
    fpAwarded,
    confidence: nutrition.confidence,
    summary: {
      calories: nutrition.perPortion.calories,
      protein: nutrition.perPortion.protein,
      carbs: nutrition.perPortion.carbs,
      fat: nutrition.perPortion.fat,
      pattern: classification.patternName,
      bestTiming: timing.bestTimeName,
    },
  };
}

/**
 * Formata a resposta completa
 */
function formatNutritionResponse(
  userName: string,
  recipe: ParsedRecipe,
  nutrition: RecipeNutrition,
  classification: DietClassification,
  timing: MealTimingSuggestion,
  variations: RecipeVariation[],
  density: { proteinDensity: number; fiberDensity: number; rating: string },
  workoutCompat: { preWorkout: { suitable: boolean; note: string }; postWorkout: { suitable: boolean; note: string } },
  fpAwarded: number
): string {
  const { perPortion, macroRatio, unknownIngredients, confidence } = nutrition;

  // Emojis por padrão
  const patternEmojis: Record<string, string> = {
    keto: '🥑',
    low_carb: '🥗',
    high_protein: '💪',
    balanced: '⚖️',
    high_carb: '🍚',
    mediterranean: '🫒',
  };

  // Construir resposta
  let response = `🍽️ **Análise Nutricional: ${recipe.title}**

Olá, ${userName}! Analisei sua receita e aqui estão os dados completos:

---

📊 **MACROS POR PORÇÃO** (${recipe.portions} ${recipe.portions > 1 ? 'porções' : 'porção'})

🔥 **${perPortion.calories} kcal**
🥩 Proteína: **${perPortion.protein}g** (${macroRatio.proteinPercent}%)
🍞 Carboidratos: **${perPortion.carbs}g** (${macroRatio.carbsPercent}%)
🥑 Gorduras: **${perPortion.fat}g** (${macroRatio.fatPercent}%)
🌾 Fibras: **${perPortion.fiber}g**

${patternEmojis[classification.pattern] || '📌'} **Padrão:** ${classification.patternName}
${classification.description}

---

⏰ **TIMING IDEAL**

**${timing.bestTimeName}**
${timing.reason}

📚 *${timing.scientificBasis}*`;

  // Alternativas de timing
  if (timing.alternatives.length > 0) {
    response += `\n\n**Alternativas:**`;
    timing.alternatives.forEach(alt => {
      response += `\n• ${alt.timeName}: ${alt.note}`;
    });
  }

  // Evitar
  if (timing.avoid.length > 0) {
    response += `\n\n⚠️ **Evitar:**`;
    timing.avoid.forEach(av => {
      response += `\n• ${av.timeName}: ${av.reason}`;
    });
  }

  // Compatibilidade com treino
  response += `\n\n---

🏋️ **PARA QUEM TREINA**

• **Pré-treino:** ${workoutCompat.preWorkout.suitable ? '✅' : '⚠️'} ${workoutCompat.preWorkout.note}
• **Pós-treino:** ${workoutCompat.postWorkout.suitable ? '✅' : '⚠️'} ${workoutCompat.postWorkout.note}`;

  // Benefícios
  response += `\n\n---

💡 **BENEFÍCIOS NUTRICIONAIS**

${generateBenefitsText(nutrition, classification, density)}`;

  // Variações
  if (variations.length > 0) {
    response += `\n\n---

🔄 **VARIAÇÕES SUGERIDAS**`;

    variations.forEach((v, i) => {
      response += `\n\n**${i + 1}. ${v.emoji} ${v.name}** (${getDifficultyText(v.difficulty)})`;
      v.changes.forEach(change => {
        if (change.action === 'substituir') {
          response += `\n• Troque ${change.original} por ${change.replacement}`;
        } else if (change.action === 'adicionar') {
          response += `\n• Adicione ${change.replacement}${change.note ? ` (${change.note})` : ''}`;
        } else if (change.action === 'remover') {
          response += `\n• Remova ${change.original}${change.note ? ` - ${change.note}` : ''}`;
        } else if (change.action === 'aumentar' || change.action === 'reduzir') {
          response += `\n• ${change.action === 'aumentar' ? 'Aumente' : 'Reduza'} ${change.original}${change.note ? ` - ${change.note}` : ''}`;
        }
      });
      response += `\n✨ ${v.benefits.join(' | ')}`;
    });
  }

  // Compatibilidade com objetivos
  response += `\n\n---

🎯 **COMPATIBILIDADE COM OBJETIVOS**

• Emagrecimento: ${getCompatibilityBar(classification.compatibility.emagrecimento)}
• Hipertrofia: ${getCompatibilityBar(classification.compatibility.hipertrofia)}
• Manutenção: ${getCompatibilityBar(classification.compatibility.manutencao)}
• Controle Glicêmico: ${getCompatibilityBar(classification.compatibility.diabetes)}`;

  // Restrições
  if (classification.restrictions.length > 0) {
    const restrictionLabels: Record<string, string> = {
      vegetariana: '🥬 Vegetariana',
      vegana: '🌱 Vegana',
      sem_gluten: '🌾 Sem Glúten',
      sem_lactose: '🥛 Sem Lactose',
    };
    response += `\n\n✅ **Adequada para:** ${classification.restrictions.map(r => restrictionLabels[r] || r).join(' | ')}`;
  }

  // Ingredientes não encontrados (se houver)
  if (unknownIngredients.length > 0 && confidence < 80) {
    response += `\n\n⚠️ *Alguns ingredientes não foram identificados na base de dados: ${unknownIngredients.slice(0, 3).join(', ')}. Os valores podem ter pequenas variações.*`;
  }

  // CTA Premium
  response += `\n\n---

💎 **Para Membros Premium:**
PDF completo com tabela nutricional detalhada, passo a passo ilustrado e 5 variações diferentes. Acesse no **APP**!

---

🪙 **+${fpAwarded} FP** pela receita${recipe.ingredients.length >= 5 ? ' completa e detalhada' : ''}!

Ficou alguma dúvida sobre a análise? Pergunta aqui! 💚`;

  return response;
}

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

function generateBenefitsText(
  nutrition: RecipeNutrition,
  classification: DietClassification,
  density: { proteinDensity: number; fiberDensity: number; rating: string }
): string {
  const benefits: string[] = [];
  const { perPortion, macroRatio } = nutrition;

  // Proteína
  if (perPortion.protein >= 30) {
    benefits.push('✅ **Alta em proteína** - Ideal para ganho muscular e recuperação');
  } else if (perPortion.protein >= 20) {
    benefits.push('✅ **Boa fonte de proteína** - Suporta manutenção muscular');
  }

  // Fibras
  if (perPortion.fiber >= 8) {
    benefits.push('✅ **Rica em fibras** - Excelente para saúde intestinal e saciedade');
  } else if (perPortion.fiber >= 4) {
    benefits.push('✅ **Contém fibras** - Ajuda no trânsito intestinal');
  }

  // Padrão cetogênico
  if (macroRatio.carbsPercent <= 10) {
    benefits.push('✅ **Cetogênica** - Mantém corpo em cetose para queima de gordura otimizada');
  }

  // Baixo carbo
  if (macroRatio.carbsPercent <= 25 && macroRatio.carbsPercent > 10) {
    benefits.push('✅ **Low Carb** - Menor impacto na glicemia e insulina');
  }

  // Densidade nutricional
  if (density.rating === 'alta') {
    benefits.push('✅ **Alta densidade nutricional** - Muitos nutrientes por caloria');
  }

  // Gorduras boas (se tiver abacate, azeite, etc.)
  if (macroRatio.fatPercent >= 30 && macroRatio.fatPercent <= 50) {
    benefits.push('✅ **Gorduras saudáveis** - Energia estável e absorção de vitaminas');
  }

  // Se não encontrou benefícios específicos
  if (benefits.length === 0) {
    benefits.push('✅ **Balanceada** - Fornece energia equilibrada para o dia');
  }

  return benefits.join('\n');
}

function calculateRecipeFP(
  recipe: ParsedRecipe,
  nutrition: RecipeNutrition,
  classification: DietClassification
): number {
  let fp = 5; // Base

  // Receita detalhada (+2)
  if (recipe.ingredients.length >= 5) fp += 2;

  // Receita muito detalhada (+1)
  if (recipe.ingredients.length >= 8) fp += 1;

  // Alta proteína (+1)
  if (nutrition.macroRatio.proteinPercent >= 30) fp += 1;

  // Rica em fibras (+1)
  if (nutrition.perPortion.fiber >= 5) fp += 1;

  // Tem instruções (+1)
  if (recipe.instructions && recipe.instructions.length > 50) fp += 1;

  // Tem tags (+1)
  if (recipe.tags.length >= 2) fp += 1;

  // Limite máximo
  return Math.min(fp, 12);
}

function getDifficultyText(difficulty: 'facil' | 'medio' | 'dificil'): string {
  const texts = {
    facil: '🟢 Fácil',
    medio: '🟡 Médio',
    dificil: '🔴 Avançado',
  };
  return texts[difficulty];
}

function getCompatibilityBar(value: number): string {
  const filled = Math.round(value / 20); // 0-5
  const empty = 5 - filled;
  return `${'█'.repeat(filled)}${'░'.repeat(empty)} ${value}%`;
}

export default {
  generateNutritionAnalysis,
};
