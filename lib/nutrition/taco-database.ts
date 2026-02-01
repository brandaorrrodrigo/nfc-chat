/**
 * TACO Database - Tabela Brasileira de Composição de Alimentos
 *
 * Dados nutricionais por 100g de alimento.
 * Fonte: TACO 4ª edição - UNICAMP/NEPA
 */

export interface TACOFood {
  calories: number;    // kcal
  protein: number;     // g
  carbs: number;       // g
  fat: number;         // g
  fiber: number;       // g
  sodium?: number;     // mg
  potassium?: number;  // mg
  calcium?: number;    // mg
  iron?: number;       // mg
  vitaminC?: number;   // mg
}

// Base de dados com ~100 alimentos comuns
export const TACO_DATABASE: Record<string, TACOFood> = {
  // ==========================================
  // PROTEÍNAS ANIMAIS
  // ==========================================
  'frango peito': { calories: 159, protein: 32, carbs: 0, fat: 2.5, fiber: 0, sodium: 45 },
  'frango coxa': { calories: 215, protein: 26, carbs: 0, fat: 12, fiber: 0, sodium: 75 },
  'frango': { calories: 187, protein: 29, carbs: 0, fat: 7, fiber: 0, sodium: 60 },
  'carne bovina patinho': { calories: 133, protein: 21.6, carbs: 0, fat: 4.9, fiber: 0, sodium: 51 },
  'carne bovina alcatra': { calories: 162, protein: 21.5, carbs: 0, fat: 8.4, fiber: 0, sodium: 50 },
  'carne moida': { calories: 212, protein: 26, carbs: 0, fat: 12, fiber: 0, sodium: 65 },
  'carne': { calories: 172, protein: 23, carbs: 0, fat: 8.5, fiber: 0, sodium: 55 },
  'peixe tilapia': { calories: 96, protein: 20, carbs: 0, fat: 1.7, fiber: 0, sodium: 52 },
  'peixe salmao': { calories: 208, protein: 20, carbs: 0, fat: 13.4, fiber: 0, sodium: 47 },
  'peixe atum': { calories: 118, protein: 25.5, carbs: 0, fat: 0.9, fiber: 0, sodium: 39 },
  'peixe': { calories: 141, protein: 22, carbs: 0, fat: 5.3, fiber: 0, sodium: 46 },
  'camarao': { calories: 91, protein: 18.5, carbs: 0, fat: 1.3, fiber: 0, sodium: 185 },
  'porco lombo': { calories: 165, protein: 27, carbs: 0, fat: 5.8, fiber: 0, sodium: 54 },
  'porco': { calories: 198, protein: 25, carbs: 0, fat: 10.5, fiber: 0, sodium: 58 },
  'peru': { calories: 119, protein: 25, carbs: 0, fat: 1.6, fiber: 0, sodium: 65 },

  // ==========================================
  // OVOS E LATICÍNIOS
  // ==========================================
  'ovo': { calories: 147, protein: 13, carbs: 0.6, fat: 10, fiber: 0, sodium: 140, calcium: 50 },
  'ovo inteiro': { calories: 147, protein: 13, carbs: 0.6, fat: 10, fiber: 0 },
  'clara de ovo': { calories: 43, protein: 10.5, carbs: 0.3, fat: 0, fiber: 0, sodium: 166 },
  'gema de ovo': { calories: 352, protein: 16, carbs: 1, fat: 31, fiber: 0 },
  'leite integral': { calories: 61, protein: 3, carbs: 4.5, fat: 3.5, fiber: 0, calcium: 123 },
  'leite desnatado': { calories: 35, protein: 3.4, carbs: 5, fat: 0.2, fiber: 0, calcium: 125 },
  'leite': { calories: 61, protein: 3, carbs: 4.5, fat: 3.5, fiber: 0 },
  'iogurte natural': { calories: 51, protein: 4.1, carbs: 6.1, fat: 0.7, fiber: 0, calcium: 143 },
  'iogurte grego': { calories: 97, protein: 10, carbs: 3.6, fat: 5, fiber: 0, calcium: 110 },
  'iogurte': { calories: 74, protein: 7, carbs: 4.8, fat: 2.8, fiber: 0 },
  'queijo mussarela': { calories: 280, protein: 22, carbs: 2.2, fat: 21, fiber: 0, calcium: 505 },
  'queijo cottage': { calories: 98, protein: 11, carbs: 3.4, fat: 4.3, fiber: 0, calcium: 83 },
  'queijo ricota': { calories: 140, protein: 12.6, carbs: 3.8, fat: 8, fiber: 0, calcium: 253 },
  'queijo parmesao': { calories: 392, protein: 35.8, carbs: 4.1, fat: 25.8, fiber: 0, calcium: 1184 },
  'queijo': { calories: 264, protein: 20, carbs: 3, fat: 20, fiber: 0 },
  'requeijao': { calories: 257, protein: 9.2, carbs: 3.4, fat: 23.4, fiber: 0 },
  'cream cheese': { calories: 342, protein: 6, carbs: 4, fat: 34, fiber: 0 },
  'manteiga': { calories: 726, protein: 0.6, carbs: 0, fat: 82, fiber: 0 },
  'whey protein': { calories: 400, protein: 80, carbs: 8, fat: 4, fiber: 0 },

  // ==========================================
  // CARBOIDRATOS E GRÃOS
  // ==========================================
  'arroz branco': { calories: 128, protein: 2.5, carbs: 28, fat: 0.2, fiber: 1.6 },
  'arroz integral': { calories: 124, protein: 2.6, carbs: 25.8, fat: 1, fiber: 2.7 },
  'arroz': { calories: 128, protein: 2.5, carbs: 28, fat: 0.2, fiber: 1.6 },
  'aveia': { calories: 394, protein: 13.9, carbs: 66.6, fat: 8.5, fiber: 9.1 },
  'aveia flocos': { calories: 394, protein: 13.9, carbs: 66.6, fat: 8.5, fiber: 9.1 },
  'feijao preto': { calories: 77, protein: 4.5, carbs: 14, fat: 0.5, fiber: 8.4 },
  'feijao carioca': { calories: 76, protein: 4.8, carbs: 13.6, fat: 0.5, fiber: 8.5 },
  'feijao': { calories: 77, protein: 4.6, carbs: 13.8, fat: 0.5, fiber: 8.4 },
  'lentilha': { calories: 108, protein: 6.3, carbs: 16.3, fat: 0.5, fiber: 7.9 },
  'grao de bico': { calories: 164, protein: 8.9, carbs: 27.4, fat: 2.6, fiber: 7.6 },
  'quinoa': { calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9, fiber: 2.8 },
  'batata doce': { calories: 118, protein: 0.6, carbs: 28.3, fat: 0.1, fiber: 2.2 },
  'batata inglesa': { calories: 64, protein: 1.2, carbs: 14.7, fat: 0, fiber: 1.3 },
  'batata': { calories: 64, protein: 1.2, carbs: 14.7, fat: 0, fiber: 1.3 },
  'mandioca': { calories: 125, protein: 0.6, carbs: 30.1, fat: 0.3, fiber: 1.9 },
  'macarrao': { calories: 138, protein: 4.9, carbs: 28.4, fat: 0.4, fiber: 1.6 },
  'pao integral': { calories: 253, protein: 9.4, carbs: 49.9, fat: 2.9, fiber: 6.9 },
  'pao frances': { calories: 300, protein: 8, carbs: 58.6, fat: 3.1, fiber: 2.3 },
  'pao': { calories: 276, protein: 8.7, carbs: 54, fat: 3, fiber: 4.6 },
  'tapioca': { calories: 360, protein: 0.5, carbs: 87.8, fat: 0.1, fiber: 0.5 },
  'farinha de trigo': { calories: 360, protein: 9.8, carbs: 75.1, fat: 1.4, fiber: 2.3 },
  'farinha de amendoas': { calories: 581, protein: 21, carbs: 19, fat: 50, fiber: 10 },
  'farinha de coco': { calories: 443, protein: 14, carbs: 26, fat: 35, fiber: 38 },
  'granola': { calories: 421, protein: 9.8, carbs: 71.4, fat: 12.6, fiber: 5 },

  // ==========================================
  // GORDURAS E OLEAGINOSAS
  // ==========================================
  'azeite de oliva': { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 },
  'azeite': { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 },
  'oleo de coco': { calories: 862, protein: 0, carbs: 0, fat: 100, fiber: 0 },
  'oleo': { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 },
  'castanha de caju': { calories: 574, protein: 18.5, carbs: 29.1, fat: 46.3, fiber: 3.7 },
  'castanha do para': { calories: 656, protein: 14.5, carbs: 11.7, fat: 67.1, fiber: 7.9 },
  'amendoim': { calories: 544, protein: 27.2, carbs: 20.3, fat: 43.9, fiber: 8 },
  'pasta de amendoim': { calories: 589, protein: 28, carbs: 14, fat: 51, fiber: 5 },
  'amêndoas': { calories: 579, protein: 21.2, carbs: 21.6, fat: 49.9, fiber: 12.5 },
  'nozes': { calories: 654, protein: 15.2, carbs: 13.7, fat: 65.2, fiber: 6.7 },
  'abacate': { calories: 160, protein: 2, carbs: 8.5, fat: 14.7, fiber: 6.7 },
  'coco': { calories: 354, protein: 3.3, carbs: 15.2, fat: 33.5, fiber: 9 },
  'leite de coco': { calories: 230, protein: 2.3, carbs: 5.5, fat: 23.8, fiber: 0 },

  // ==========================================
  // VEGETAIS E LEGUMES
  // ==========================================
  'brocolis': { calories: 25, protein: 3.6, carbs: 2.1, fat: 0.3, fiber: 3.4, vitaminC: 42 },
  'espinafre': { calories: 17, protein: 2.9, carbs: 0.8, fat: 0.4, fiber: 2.1, iron: 2.4 },
  'couve': { calories: 27, protein: 2.9, carbs: 4.3, fat: 0.5, fiber: 3.1 },
  'couve flor': { calories: 23, protein: 1.9, carbs: 4, fat: 0.2, fiber: 2.4 },
  'alface': { calories: 11, protein: 1.3, carbs: 1.7, fat: 0.2, fiber: 1 },
  'tomate': { calories: 15, protein: 1.1, carbs: 3.1, fat: 0.2, fiber: 1.2, vitaminC: 21 },
  'cebola': { calories: 39, protein: 1.7, carbs: 8.9, fat: 0.1, fiber: 2.2 },
  'alho': { calories: 113, protein: 7, carbs: 23.9, fat: 0.2, fiber: 4.3 },
  'pimentao': { calories: 25, protein: 1.1, carbs: 5.4, fat: 0.2, fiber: 1.6, vitaminC: 100 },
  'cenoura': { calories: 34, protein: 1.3, carbs: 7.7, fat: 0.2, fiber: 3.2 },
  'abobrinha': { calories: 19, protein: 1.1, carbs: 3.5, fat: 0.3, fiber: 1.6 },
  'berinjela': { calories: 19, protein: 1.2, carbs: 3.1, fat: 0.1, fiber: 2.9 },
  'pepino': { calories: 10, protein: 0.9, carbs: 2, fat: 0.1, fiber: 1 },
  'rucula': { calories: 20, protein: 2.1, carbs: 2.3, fat: 0.3, fiber: 1.6 },
  'agriao': { calories: 17, protein: 2.7, carbs: 2.3, fat: 0.2, fiber: 2.1 },
  'repolho': { calories: 17, protein: 0.9, carbs: 3.9, fat: 0.1, fiber: 1.9 },
  'vagem': { calories: 25, protein: 1.8, carbs: 4.6, fat: 0.1, fiber: 2.4 },
  'ervilha': { calories: 63, protein: 4.9, carbs: 10.6, fat: 0.2, fiber: 4.9 },
  'milho': { calories: 108, protein: 3.4, carbs: 21.3, fat: 1.5, fiber: 3.9 },
  'cogumelo': { calories: 27, protein: 2.5, carbs: 4.4, fat: 0.3, fiber: 2.1 },
  'shimeji': { calories: 27, protein: 2.5, carbs: 4.4, fat: 0.3, fiber: 2.1 },

  // ==========================================
  // FRUTAS
  // ==========================================
  'banana': { calories: 92, protein: 1.4, carbs: 23.8, fat: 0.1, fiber: 2, potassium: 358 },
  'maca': { calories: 56, protein: 0.3, carbs: 15.2, fat: 0, fiber: 1.3 },
  'laranja': { calories: 37, protein: 1, carbs: 8.9, fat: 0.1, fiber: 0.8, vitaminC: 57 },
  'morango': { calories: 30, protein: 0.9, carbs: 6.8, fat: 0.3, fiber: 1.7, vitaminC: 64 },
  'mirtilo': { calories: 32, protein: 0.6, carbs: 6.9, fat: 0.1, fiber: 3.5 },
  'blueberry': { calories: 32, protein: 0.6, carbs: 6.9, fat: 0.1, fiber: 3.5 },
  'framboesa': { calories: 30, protein: 1.2, carbs: 5.1, fat: 0.3, fiber: 6.7 },
  'manga': { calories: 51, protein: 0.4, carbs: 12.8, fat: 0.3, fiber: 1.6 },
  'mamao': { calories: 40, protein: 0.5, carbs: 10.4, fat: 0.1, fiber: 1 },
  'abacaxi': { calories: 48, protein: 0.9, carbs: 12.3, fat: 0.1, fiber: 1 },
  'melancia': { calories: 33, protein: 0.9, carbs: 8.1, fat: 0, fiber: 0.1 },
  'melao': { calories: 29, protein: 0.7, carbs: 7.5, fat: 0, fiber: 0.3 },
  'uva': { calories: 53, protein: 0.7, carbs: 13.6, fat: 0.2, fiber: 0.9 },
  'kiwi': { calories: 51, protein: 1.3, carbs: 11.5, fat: 0.6, fiber: 2.7, vitaminC: 70 },
  'limao': { calories: 32, protein: 0.9, carbs: 11.1, fat: 0.1, fiber: 1, vitaminC: 38 },
  'acai': { calories: 58, protein: 0.8, carbs: 6.2, fat: 3.9, fiber: 2.6 },

  // ==========================================
  // PROTEÍNAS VEGETAIS
  // ==========================================
  'tofu': { calories: 64, protein: 6.6, carbs: 2.4, fat: 3.5, fiber: 0.3, calcium: 130 },
  'tofu firme': { calories: 76, protein: 8, carbs: 2, fat: 4.2, fiber: 0.5 },
  'tempeh': { calories: 193, protein: 20.3, carbs: 7.6, fat: 10.8, fiber: 4.4 },
  'edamame': { calories: 122, protein: 11.9, carbs: 8.9, fat: 5.2, fiber: 5.2 },
  'seitan': { calories: 370, protein: 75, carbs: 14, fat: 1.9, fiber: 0.6 },
  'proteina de soja': { calories: 335, protein: 52, carbs: 33, fat: 1, fiber: 18 },

  // ==========================================
  // ADOÇANTES E EXTRAS
  // ==========================================
  'mel': { calories: 309, protein: 0.4, carbs: 84, fat: 0, fiber: 0 },
  'acucar': { calories: 387, protein: 0, carbs: 99.5, fat: 0, fiber: 0 },
  'cacau em po': { calories: 228, protein: 19.6, carbs: 57.9, fat: 13.7, fiber: 33 },
  'chocolate amargo': { calories: 479, protein: 5.5, carbs: 52, fat: 30.4, fiber: 5.9 },
  'canela': { calories: 261, protein: 4, carbs: 55.5, fat: 3.2, fiber: 24.4 },
  'chia': { calories: 486, protein: 16.5, carbs: 42.1, fat: 30.7, fiber: 34.4 },
  'linhaca': { calories: 495, protein: 14.1, carbs: 43.3, fat: 32.3, fiber: 33.5 },
  'psyllium': { calories: 196, protein: 2.4, carbs: 83.7, fat: 0.6, fiber: 80.3 },
  'gelatina': { calories: 62, protein: 15, carbs: 0, fat: 0, fiber: 0 },

  // ==========================================
  // BEBIDAS
  // ==========================================
  'cafe': { calories: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0 },
  'cha verde': { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
  'leite de amendoas': { calories: 17, protein: 0.6, carbs: 0.3, fat: 1.5, fiber: 0.2 },
  'leite de aveia': { calories: 46, protein: 1, carbs: 8, fat: 1.4, fiber: 0.8 },
  'agua de coco': { calories: 22, protein: 0, carbs: 5.3, fat: 0, fiber: 0, potassium: 250 },
};

/**
 * Busca dados nutricionais de um alimento
 * Tenta match exato primeiro, depois parcial
 */
export function getNutritionFromTACO(ingredientName: string): TACOFood | null {
  const normalized = ingredientName.toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove acentos

  // 1. Tentar match exato
  for (const [key, value] of Object.entries(TACO_DATABASE)) {
    const keyNormalized = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (keyNormalized === normalized) {
      return value;
    }
  }

  // 2. Tentar match parcial (ingrediente contém a chave)
  for (const [key, value] of Object.entries(TACO_DATABASE)) {
    const keyNormalized = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (normalized.includes(keyNormalized)) {
      return value;
    }
  }

  // 3. Tentar match parcial (chave contém o ingrediente)
  for (const [key, value] of Object.entries(TACO_DATABASE)) {
    const keyNormalized = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (keyNormalized.includes(normalized) && normalized.length > 3) {
      return value;
    }
  }

  // 4. Tentar match por palavras-chave
  const words = normalized.split(/\s+/);
  for (const word of words) {
    if (word.length < 4) continue;
    for (const [key, value] of Object.entries(TACO_DATABASE)) {
      const keyNormalized = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (keyNormalized.includes(word)) {
        return value;
      }
    }
  }

  console.log(`[TACO] Alimento não encontrado: ${ingredientName}`);
  return null;
}

/**
 * Exporta lista de alimentos disponíveis
 */
export function getAvailableFoods(): string[] {
  return Object.keys(TACO_DATABASE);
}
