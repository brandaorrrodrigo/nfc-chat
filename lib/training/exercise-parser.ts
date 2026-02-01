/**
 * Exercise Parser - Extrai dados estruturados de posts sobre exercícios
 *
 * Detecta padrões comuns de formatação e extrai:
 * - Nome do exercício
 * - Músculos trabalhados (sentidos pelo usuário)
 * - Motivo por amar o exercício
 * - Carga/volume atual
 * - Tags
 */

// ==========================================
// TIPOS
// ==========================================

export interface ParsedExercise {
  name: string;
  targetMuscles: string[];
  feel: string;
  reason: string;
  load?: {
    weight: number;
    reps: number;
    sets?: number;
  };
  tags: string[];
  equipment?: string;
  isValid: boolean;
}

// ==========================================
// MAPEAMENTO DE MÚSCULOS
// ==========================================

const MUSCLE_KEYWORDS: Record<string, string[]> = {
  'glúteo': ['gluteo', 'glúteo', 'bumbum', 'glute', 'hip thrust'],
  'posterior': ['posterior', 'femoral', 'isquio', 'hamstring', 'biceps femoral'],
  'quadríceps': ['quadriceps', 'quadríceps', 'coxa', 'quad', 'frente da coxa', 'vasto'],
  'panturrilha': ['panturrilha', 'gastrocnêmio', 'sóleo', 'calf', 'batata da perna'],
  'costas': ['costas', 'dorsal', 'trapézio', 'romboide', 'lat', 'back'],
  'peito': ['peito', 'peitoral', 'chest', 'pec'],
  'ombro': ['ombro', 'deltoide', 'deltóide', 'shoulder'],
  'bíceps': ['biceps', 'bíceps', 'braço frente'],
  'tríceps': ['triceps', 'tríceps', 'braço trás'],
  'core': ['core', 'abdômen', 'abdomen', 'abdominal', 'lombar', 'transverso', 'oblíquo'],
  'adutor': ['adutor', 'adductor', 'parte interna da coxa', 'virilha'],
};

// Mapeamento de equipamentos
const EQUIPMENT_KEYWORDS: Record<string, string[]> = {
  'barra': ['barra', 'barbell', 'bar'],
  'halteres': ['halter', 'halteres', 'dumbbell', 'dumbbells'],
  'kettlebell': ['kettlebell', 'kb', 'kettle'],
  'máquina': ['máquina', 'maquina', 'smith', 'leg press', 'hack'],
  'elástico': ['elástico', 'elastico', 'band', 'faixa', 'rubber'],
  'corpo livre': ['corpo livre', 'bodyweight', 'peso corporal', 'calistenia'],
  'cabo': ['cabo', 'polia', 'cross', 'cable'],
};

// ==========================================
// PARSER PRINCIPAL
// ==========================================

/**
 * Extrai dados estruturados de um post sobre exercício
 */
export function parseExerciseFromPost(postContent: string): ParsedExercise {
  const content = postContent.trim();

  // Extrair nome do exercício
  const name = extractExerciseName(content);

  // Extrair o que a pessoa sente trabalhando
  const feel = extractFeel(content);

  // Extrair músculos baseado no que a pessoa disse
  const targetMuscles = extractMuscles(feel || content);

  // Extrair motivo por amar
  const reason = extractReason(content);

  // Extrair carga/volume
  const load = extractLoad(content);

  // Extrair tags
  const tags = extractTags(content);

  // Extrair equipamento
  const equipment = extractEquipment(content);

  // Validar se é realmente um post sobre exercício
  const isValid = name.length > 2 && (feel.length > 0 || reason.length > 0 || targetMuscles.length > 0);

  return {
    name,
    targetMuscles,
    feel,
    reason,
    load,
    tags,
    equipment,
    isValid,
  };
}

// ==========================================
// EXTRATORES
// ==========================================

function extractExerciseName(content: string): string {
  const patterns = [
    /[Ee]xerc[ií]cio:?\s*(.+?)(?:\n|$)/i,
    /[Mm]eu (?:exercício|exercicio) (?:favorito|preferido):?\s*(.+?)(?:\n|$)/i,
    /[Aa]mo (?:fazer|o|a)?:?\s*(.+?)(?:\n|$)/i,
    /\*\*(.+?)\*\*/,  // Texto em negrito no início
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      const cleaned = match[1]
        .replace(/[*_]/g, '')
        .replace(/porque.*/i, '')
        .replace(/pois.*/i, '')
        .trim();

      if (cleaned.length > 2 && cleaned.length < 100) {
        return cleaned;
      }
    }
  }

  // Tentar extrair da primeira linha
  const firstLine = content.split('\n')[0].trim();
  if (firstLine.length > 2 && firstLine.length < 80) {
    return firstLine.replace(/[*_#]/g, '').trim();
  }

  return '';
}

function extractFeel(content: string): string {
  const patterns = [
    /[Ss]into (?:trabalhando|trabalhar|que trabalha):?\s*(.+?)(?:\n|$)/i,
    /[Ss]ente (?:trabalhando|trabalhar):?\s*(.+?)(?:\n|$)/i,
    /[Tt]rabalha:?\s*(.+?)(?:\n|$)/i,
    /[Aa]tiva:?\s*(.+?)(?:\n|$)/i,
    /[Mm]úsculo(?:s)?:?\s*(.+?)(?:\n|$)/i,
    /[Ss]ensação:?\s*(.+?)(?:\n|$)/i,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  // Buscar descrição de sensação
  const sensationPatterns = [
    /((?:glúteo|posterior|quadríceps|costas|peito|ombro)\s+(?:queimando|contraindo|esticando|trabalhando)[^.]*)/i,
    /(?:sinto|sente)\s+(?:muito|bastante)?\s*(queima(?:ção|ndo)?|contração|pump)[^.]*/i,
  ];

  for (const pattern of sensationPatterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  return '';
}

function extractMuscles(text: string): string[] {
  const found: string[] = [];
  const lowerText = text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  for (const [muscle, keywords] of Object.entries(MUSCLE_KEYWORDS)) {
    for (const kw of keywords) {
      const normalizedKw = kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (lowerText.includes(normalizedKw)) {
        if (!found.includes(muscle)) {
          found.push(muscle);
        }
        break;
      }
    }
  }

  return found;
}

function extractReason(content: string): string {
  const patterns = [
    /[Pp]or que (?:amo|adoro|gosto|curto):?\s*(.+?)(?:\n\n|$)/is,
    /[Aa]mo porque:?\s*(.+?)(?:\n\n|$)/is,
    /[Mm]otivo:?\s*(.+?)(?:\n\n|$)/is,
    /[Pp]or qu[êe]:?\s*(.+?)(?:\n\n|$)/is,
    /[Oo] que (?:mais )?(?:gosto|amo|curto):?\s*(.+?)(?:\n\n|$)/is,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1].trim().substring(0, 500);
    }
  }

  return '';
}

function extractLoad(content: string): ParsedExercise['load'] | undefined {
  const patterns = [
    // "70kg x 10 reps x 4 séries" ou "70kg 10 reps 4 séries"
    /(\d+)\s*kg\s*[x×]?\s*(\d+)\s*(?:reps?|repetições?)\s*(?:[x×]\s*(\d+)\s*(?:séries?|sets?))?/i,
    // "Carga: 70kg, 10 reps"
    /[Cc]arga:?\s*(\d+)\s*kg.*?(\d+)\s*(?:reps?|repetições?)/i,
    // "Peso: 70kg"
    /[Pp]eso:?\s*(\d+)\s*kg/i,
    // "4x10 com 70kg"
    /(\d+)\s*[x×]\s*(\d+)\s*(?:com|@)\s*(\d+)\s*kg/i,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      // Detectar qual formato foi encontrado
      if (pattern.source.includes('[Pp]eso')) {
        return { weight: parseInt(match[1]), reps: 0 };
      }

      if (pattern.source.startsWith('(\\d+)\\s*[x×]\\s*(\\d+)\\s*(?:com')) {
        return {
          sets: parseInt(match[1]),
          reps: parseInt(match[2]),
          weight: parseInt(match[3]),
        };
      }

      return {
        weight: parseInt(match[1]),
        reps: parseInt(match[2]),
        sets: match[3] ? parseInt(match[3]) : undefined,
      };
    }
  }

  return undefined;
}

function extractTags(content: string): string[] {
  const tagPattern = /#(\w+)/g;
  const matches = content.matchAll(tagPattern);
  return Array.from(matches).map(m => m[1].toLowerCase());
}

function extractEquipment(content: string): string | undefined {
  const lowerContent = content.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  for (const [equipment, keywords] of Object.entries(EQUIPMENT_KEYWORDS)) {
    for (const kw of keywords) {
      const normalizedKw = kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (lowerContent.includes(normalizedKw)) {
        return equipment;
      }
    }
  }

  return undefined;
}

// ==========================================
// UTILITÁRIOS
// ==========================================

/**
 * Verifica se o conteúdo parece ser sobre um exercício
 */
export function looksLikeExercise(content: string): boolean {
  const lower = content.toLowerCase();

  // Palavras-chave de exercício (expandidas)
  const exerciseKeywords = [
    'exercício',
    'exercicio',
    'treino',
    'sinto trabalhando',
    'músculos',
    'musculo',
    'carga',
    'reps',
    'séries',
    'series',
    'sets',
    'kg',
    'execução',
    'execucao',
    'amo fazer',
    'gosto de fazer',
    'meu favorito',
    'agachamento',
    'supino',
    'levantamento',
    'remada',
    'avanço',
    'avanco',
    'afundo',
    'rosca',
    'pulldown',
    'leg press',
    'stiff',
    'crucifixo',
    'elevação',
    'elevacao',
  ];

  const hasKeyword = exerciseKeywords.some(k => lower.includes(k));

  // Verificar se menciona grupo muscular
  const hasMuscle = Object.values(MUSCLE_KEYWORDS).flat().some(kw =>
    lower.includes(kw.toLowerCase())
  );

  // Verificar se menciona equipamento
  const hasEquipment = Object.values(EQUIPMENT_KEYWORDS).flat().some(kw =>
    lower.includes(kw.toLowerCase())
  );

  // Verificar se tem carga
  const hasLoad = /\d+\s*kg/i.test(content) || /\d+\s*(?:reps?|repetições?)/i.test(content);

  const result = hasKeyword || hasMuscle || hasEquipment || hasLoad;

  console.log('[looksLikeExercise]', {
    hasKeyword,
    hasMuscle,
    hasEquipment,
    hasLoad,
    result,
    contentPreview: content.substring(0, 100) + '...'
  });

  return result;
}

export default {
  parseExerciseFromPost,
  looksLikeExercise,
};
