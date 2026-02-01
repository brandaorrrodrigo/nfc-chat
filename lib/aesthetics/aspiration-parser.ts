/**
 * Parser de Aspirações Estéticas
 * Detecta procedimentos desejados e analisa estado emocional
 */

export interface ParsedAspiration {
  procedure: string;
  motivation: string;
  timeline: string; // "pensando para 2026", "ainda não sei quando"
  currentPrep: {
    training: boolean;
    diet: boolean;
    medicalFollowup: boolean;
  };
  questions: string[];
  emotionalState: 'confident' | 'uncertain' | 'impulsive' | 'researching';
  tags: string[];
  isValid: boolean;
}

export function parseAspirationFromPost(postContent: string): ParsedAspiration | null {
  const patterns = {
    procedure: /(?:Procedimento|Cirurgia|Plástica):?\s*(.+?)(?:\n|$)/i,
    motivation: /(?:Por qu[eê]|Motiva[çc][ãa]o|Objetivo):?\s*(.+?)(?:\n|$)/i,
    timeline: /(?:Timeline|Quando|Prazo|Data):?\s*(.+?)(?:\n|$)/i,
    prep: /(?:Preparo|Treino|Dieta):?\s*(.+?)(?:\n|$)/i,
    questions: /(?:D[úu]vida|Quest[ãa]o|Pergunta):?\s*(.+?)(?:\n|$)/i,
  };

  const procedureMatch = postContent.match(patterns.procedure);
  const motivationMatch = postContent.match(patterns.motivation);
  const timelineMatch = postContent.match(patterns.timeline);
  const prepMatch = postContent.match(patterns.prep);
  const questionsMatch = postContent.match(patterns.questions);

  // Precisa ter pelo menos procedimento mencionado
  if (!procedureMatch && !looksLikeAestheticPost(postContent)) {
    return null;
  }

  const procedure = procedureMatch?.[1]?.trim() || extractProcedureFromContent(postContent);
  if (!procedure) return null;

  const prepText = prepMatch?.[1]?.toLowerCase() || postContent.toLowerCase();

  return {
    procedure,
    motivation: motivationMatch?.[1]?.trim() || '',
    timeline: timelineMatch?.[1]?.trim() || 'não especificado',
    currentPrep: {
      training: prepText.includes('treino') || prepText.includes('academia') || prepText.includes('musculação'),
      diet: prepText.includes('dieta') || prepText.includes('nutri') || prepText.includes('alimentação'),
      medicalFollowup: prepText.includes('médico') || prepText.includes('consulta') || prepText.includes('cirurgião'),
    },
    questions: questionsMatch?.[1]?.split(',').map((q) => q.trim()) || [],
    emotionalState: detectEmotionalState(postContent),
    tags: extractTags(postContent),
    isValid: true,
  };
}

function looksLikeAestheticPost(content: string): boolean {
  const lower = content.toLowerCase();

  const aestheticKeywords = [
    'lipo', 'abdominoplastia', 'mamoplastia', 'prótese', 'silicone',
    'rinoplastia', 'blefaroplastia', 'lifting', 'harmonização',
    'cirurgia plástica', 'procedimento estético', 'estética',
    'bbl', 'lipoescultura', 'mastopexia',
  ];

  return aestheticKeywords.some((keyword) => lower.includes(keyword));
}

function extractProcedureFromContent(content: string): string {
  const lower = content.toLowerCase();

  const procedures = [
    'lipoaspiração',
    'abdominoplastia',
    'mamoplastia de aumento',
    'mamoplastia redutora',
    'mastopexia',
    'prótese de glúteo',
    'bbl',
    'rinoplastia',
    'blefaroplastia',
    'lifting facial',
    'harmonização facial',
    'mentoplastia',
    'otoplastia',
  ];

  for (const proc of procedures) {
    if (lower.includes(proc)) {
      return proc;
    }
  }

  // Termos genéricos
  if (lower.includes('lipo')) return 'lipoaspiração';
  if (lower.includes('silicone') || lower.includes('prótese mama')) return 'mamoplastia de aumento';
  if (lower.includes('nariz')) return 'rinoplastia';
  if (lower.includes('pálpebra')) return 'blefaroplastia';
  if (lower.includes('barriga') || lower.includes('abdômen')) return 'abdominoplastia';

  return '';
}

function detectEmotionalState(content: string): 'confident' | 'uncertain' | 'impulsive' | 'researching' {
  const lower = content.toLowerCase();

  // Impulsivo (red flag)
  if (
    lower.includes('quero fazer já') ||
    lower.includes('urgente') ||
    lower.includes('amanhã') ||
    lower.includes('desesperada') ||
    lower.includes('preciso logo')
  ) {
    return 'impulsive';
  }

  // Incerto
  if (
    lower.includes('não sei') ||
    lower.includes('dúvida') ||
    lower.includes('medo') ||
    lower.includes('insegura')
  ) {
    return 'uncertain';
  }

  // Pesquisando (ideal)
  if (
    lower.includes('estudando') ||
    lower.includes('pesquisando') ||
    lower.includes('preparando') ||
    lower.includes('planejando')
  ) {
    return 'researching';
  }

  return 'confident';
}

function extractTags(content: string): string[] {
  const tagPattern = /#(\w+)/g;
  const matches = content.matchAll(tagPattern);
  return Array.from(matches).map((m) => m[1]);
}
