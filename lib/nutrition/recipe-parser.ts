/**
 * Recipe Parser - Extrai dados estruturados de receitas em texto
 *
 * Detecta padrões comuns de formatação de receitas e extrai:
 * - Título
 * - Ingredientes com quantidades
 * - Número de porções
 * - Tempo de preparo
 * - Tags/hashtags
 */

// ==========================================
// TIPOS
// ==========================================

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  originalText: string;
}

export interface ParsedRecipe {
  title: string;
  ingredients: Ingredient[];
  portions: number;
  prepTime?: string;
  cookTime?: string;
  tags: string[];
  instructions?: string;
  isValid: boolean;
}

// ==========================================
// UNIDADES DE MEDIDA
// ==========================================

const UNIT_ALIASES: Record<string, string> = {
  // Peso
  'g': 'g',
  'gr': 'g',
  'gramas': 'g',
  'grama': 'g',
  'kg': 'kg',
  'kilo': 'kg',
  'quilo': 'kg',

  // Volume
  'ml': 'ml',
  'l': 'l',
  'litro': 'l',
  'litros': 'l',

  // Medidas caseiras
  'xicara': 'xicara',
  'xíc': 'xicara',
  'xic': 'xicara',
  'cup': 'xicara',
  'copo': 'xicara',

  'colher': 'colher',
  'colheres': 'colher',
  'cs': 'colher',  // colher de sopa
  'colher de sopa': 'colher',
  'colheres de sopa': 'colher',
  'tbsp': 'colher',

  'colher de cha': 'colher_cha',
  'colheres de cha': 'colher_cha',
  'cc': 'colher_cha',
  'tsp': 'colher_cha',

  // Unidades
  'unidade': 'unidade',
  'unidades': 'unidade',
  'un': 'unidade',
  'u': 'unidade',
  'und': 'unidade',

  // Fatias/pedaços
  'fatia': 'fatia',
  'fatias': 'fatia',
  'pedaco': 'pedaco',
  'pedacos': 'pedaco',

  // Dente (alho)
  'dente': 'dente',
  'dentes': 'dente',

  // Pitada
  'pitada': 'pitada',
  'pitadas': 'pitada',
  'pct': 'pacote',
  'pacote': 'pacote',

  // Scoop
  'scoop': 'scoop',
  'scoops': 'scoop',
  'dose': 'scoop',
  'doses': 'scoop',
};

// Conversão para gramas (aproximado por 100g de referência)
const UNIT_TO_GRAMS: Record<string, number> = {
  'g': 1,
  'kg': 1000,
  'ml': 1,
  'l': 1000,
  'xicara': 120,      // média para sólidos
  'colher': 15,       // colher de sopa
  'colher_cha': 5,    // colher de chá
  'unidade': 50,      // média
  'fatia': 30,
  'pedaco': 50,
  'dente': 5,         // dente de alho
  'pitada': 1,
  'pacote': 200,
  'scoop': 30,
};

// ==========================================
// PARSER PRINCIPAL
// ==========================================

/**
 * Extrai dados estruturados de uma receita em texto livre
 */
export function parseRecipeFromPost(postContent: string): ParsedRecipe {
  const content = postContent.trim();

  // Extrair título
  const title = extractTitle(content);

  // Extrair ingredientes
  const ingredients = extractIngredients(content);

  // Extrair porções
  const portions = extractPortions(content);

  // Extrair tempo de preparo
  const prepTime = extractPrepTime(content);

  // Extrair tags
  const tags = extractTags(content);

  // Extrair instruções (modo de preparo)
  const instructions = extractInstructions(content);

  // Validar se é realmente uma receita
  const isValid = ingredients.length >= 2 && ingredients.some(i => i.quantity > 0);

  return {
    title,
    ingredients,
    portions,
    prepTime,
    tags,
    instructions,
    isValid,
  };
}

// ==========================================
// EXTRATORES
// ==========================================

function extractTitle(content: string): string {
  const lines = content.split('\n').filter(l => l.trim());

  // Primeira linha geralmente é o título
  if (lines.length > 0) {
    const firstLine = lines[0].trim();

    // Remover emojis e hashtags do título
    const cleanTitle = firstLine
      .replace(/[#@]\w+/g, '')
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .trim();

    // Se a primeira linha for curta e não contiver "ingredientes", é o título
    if (cleanTitle.length > 0 && cleanTitle.length < 100 &&
        !cleanTitle.toLowerCase().includes('ingrediente')) {
      return cleanTitle;
    }
  }

  return 'Receita';
}

function extractIngredients(content: string): Ingredient[] {
  const ingredients: Ingredient[] = [];

  // Padrões para detectar seção de ingredientes
  const ingredientSectionPatterns = [
    /ingredientes?:?\s*\n([\s\S]+?)(?:\n(?:modo|preparo|como fazer|instrucoes|$))/i,
    /\*\*ingredientes?\*\*:?\s*\n([\s\S]+?)(?:\n(?:\*\*|modo|preparo|como fazer|$))/i,
  ];

  let ingredientsText = '';

  // Tentar encontrar seção de ingredientes
  for (const pattern of ingredientSectionPatterns) {
    const match = content.match(pattern);
    if (match) {
      ingredientsText = match[1];
      break;
    }
  }

  // Se não encontrou seção, tentar detectar linhas que parecem ingredientes
  if (!ingredientsText) {
    const lines = content.split('\n');
    const ingredientLines: string[] = [];

    for (const line of lines) {
      if (looksLikeIngredient(line)) {
        ingredientLines.push(line);
      }
    }

    ingredientsText = ingredientLines.join('\n');
  }

  // Processar cada linha de ingrediente
  const lines = ingredientsText.split('\n').filter(l => l.trim());

  for (const line of lines) {
    const ingredient = parseIngredientLine(line);
    if (ingredient) {
      ingredients.push(ingredient);
    }
  }

  return ingredients;
}

function looksLikeIngredient(line: string): boolean {
  const trimmed = line.trim().toLowerCase();

  // Ignorar linhas vazias ou muito curtas
  if (trimmed.length < 3) return false;

  // Ignorar linhas que parecem instruções
  if (/^(modo|preparo|como fazer|instrucoes|dica|obs)/i.test(trimmed)) return false;
  if (/^(misture|bata|leve|coloque|adicione|despeje|reserve)/i.test(trimmed)) return false;

  // Linha com número no início geralmente é ingrediente
  if (/^\d/.test(trimmed)) return true;

  // Linha que começa com marcador
  if (/^[-•*]/.test(trimmed)) return true;

  // Linha curta com palavras de alimento
  const foodKeywords = ['ovo', 'frango', 'carne', 'leite', 'farinha', 'azeite', 'sal', 'açúcar'];
  if (foodKeywords.some(k => trimmed.includes(k))) return true;

  return false;
}

function parseIngredientLine(line: string): Ingredient | null {
  const trimmed = line.trim()
    .replace(/^[-•*]\s*/, '')  // Remove marcadores
    .replace(/^\d+\.\s*/, ''); // Remove numeração

  if (trimmed.length < 2) return null;

  // Padrões de quantidade + unidade + ingrediente
  const patterns = [
    // "200g de frango" ou "200 g de frango"
    /^(\d+(?:[.,]\d+)?)\s*(g|kg|ml|l|xicara|xíc|colher|cs|cc|un|u|unidade|scoop|dose)s?\s*(?:de\s+)?(.+)/i,

    // "2 ovos" ou "2 unidades de ovo"
    /^(\d+(?:[.,]\d+)?)\s*(?:unidades?\s+de\s+)?(.+)/i,

    // "1/2 xícara de aveia"
    /^(\d+\/\d+)\s*(xicara|xíc|colher|cs|cc)s?\s*(?:de\s+)?(.+)/i,

    // "meia xícara de aveia"
    /^(meia?|uma?)\s*(xicara|xíc|colher|cs|cc)s?\s*(?:de\s+)?(.+)/i,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) {
      let quantity = parseQuantity(match[1]);
      let unit = normalizeUnit(match[2] || 'unidade');
      let name = match[3] || match[2];

      // Se só tem 2 grupos, ajustar
      if (!match[3]) {
        name = match[2];
        unit = 'unidade';
      }

      return {
        name: cleanIngredientName(name),
        quantity,
        unit,
        originalText: trimmed,
      };
    }
  }

  // Se não bateu nenhum padrão, retornar com quantidade padrão
  return {
    name: cleanIngredientName(trimmed),
    quantity: 1,
    unit: 'unidade',
    originalText: trimmed,
  };
}

function parseQuantity(value: string): number {
  if (!value) return 1;

  // Converter frações
  if (value.includes('/')) {
    const [num, den] = value.split('/').map(Number);
    return num / den;
  }

  // Converter palavras
  const wordToNumber: Record<string, number> = {
    'meia': 0.5,
    'meio': 0.5,
    'uma': 1,
    'um': 1,
  };

  const lower = value.toLowerCase();
  if (wordToNumber[lower]) return wordToNumber[lower];

  // Converter número
  return parseFloat(value.replace(',', '.')) || 1;
}

function normalizeUnit(unit: string): string {
  const lower = unit.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove acentos

  return UNIT_ALIASES[lower] || 'unidade';
}

function cleanIngredientName(name: string): string {
  return name
    .replace(/\([^)]*\)/g, '')  // Remove parênteses
    .replace(/a gosto/gi, '')
    .replace(/opcional/gi, '')
    .replace(/picad[oa]/gi, '')
    .replace(/ralad[oa]/gi, '')
    .replace(/cortad[oa]/gi, '')
    .replace(/fati[oa]d[oa]/gi, '')
    .replace(/desfi[oa]d[oa]/gi, '')
    .replace(/cozid[oa]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractPortions(content: string): number {
  const patterns = [
    /(?:rende|porções?|serve):?\s*(\d+)/i,
    /(\d+)\s*(?:porções?|pessoas?|servings?)/i,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      return parseInt(match[1], 10);
    }
  }

  return 1; // Default: 1 porção
}

function extractPrepTime(content: string): string | undefined {
  const patterns = [
    /(?:tempo|preparo|preparação):?\s*(\d+\s*(?:min|minutos?|h|horas?))/i,
    /(\d+)\s*(?:min|minutos?)\s*(?:de\s*)?(?:preparo|preparação)/i,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1].toLowerCase();
    }
  }

  return undefined;
}

function extractTags(content: string): string[] {
  const tagPattern = /#(\w+)/g;
  const matches = content.matchAll(tagPattern);
  return Array.from(matches).map(m => m[1].toLowerCase());
}

function extractInstructions(content: string): string | undefined {
  const patterns = [
    /(?:modo de preparo|preparo|como fazer|instrucoes):?\s*\n([\s\S]+?)(?:\n#|$)/i,
    /\*\*(?:modo de preparo|preparo)\*\*:?\s*\n([\s\S]+?)(?:\n\*\*|$)/i,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  return undefined;
}

// ==========================================
// UTILITÁRIOS
// ==========================================

/**
 * Converte quantidade + unidade para gramas
 */
export function convertToGrams(quantity: number, unit: string): number {
  const normalizedUnit = normalizeUnit(unit);
  const multiplier = UNIT_TO_GRAMS[normalizedUnit] || 50;
  return quantity * multiplier;
}

/**
 * Verifica se o conteúdo parece ser uma receita
 */
export function looksLikeRecipe(content: string): boolean {
  const lower = content.toLowerCase();

  // Verificar palavras-chave de receita
  const recipeKeywords = [
    'ingrediente',
    'modo de preparo',
    'preparo',
    'como fazer',
    'rende',
    'porções',
    'porcao',
    'receita',
    'bolo',
    'torta',
    'panqueca',
    'omelete',
    'sopa',
    'salada',
    'shake',
    'smoothie',
    'vitamina',
    'frango',
    'carne',
    'peixe',
    'batata',
    'arroz',
  ];

  const hasKeyword = recipeKeywords.some(k => lower.includes(k));

  // Verificar se tem números + unidades (expandido)
  const hasQuantity = /\d+\s*(g|gr|gramas?|kg|kilo|ml|l|litros?|xicara|xíc|colher|colheres|cs|cc|un|unidades?|ovo|ovos|fatias?|pedaços?|dentes?|scoop)/i.test(content);

  // Verificar se tem múltiplas linhas com vírgulas ou quebras (formato lista de ingredientes)
  const hasMultipleItems = (content.match(/\n/g) || []).length >= 2 || (content.match(/,/g) || []).length >= 2;

  const result = hasKeyword || hasQuantity || (hasMultipleItems && hasQuantity);

  console.log('[looksLikeRecipe]', {
    hasKeyword,
    hasQuantity,
    hasMultipleItems,
    result,
    contentPreview: content.substring(0, 100) + '...'
  });

  return result;
}

export default {
  parseRecipeFromPost,
  convertToGrams,
  looksLikeRecipe,
};
