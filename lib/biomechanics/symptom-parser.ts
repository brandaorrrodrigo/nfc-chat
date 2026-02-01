/**
 * Symptom Parser - Extrai informações estruturadas de posts sobre dor/desconforto
 */

export interface ParsedSymptom {
  exercise: string;
  region: string;
  location: string; // específico: "frente do ombro", "lateral do joelho"
  timing: string; // quando dói: "descida", "subida", "amplitude completa"
  painType: string; // fisgada, choque, queimação, etc
  intensity: number; // 1-10
  duration: string; // "2 semanas", "3 meses"
  tags: string[];
  isValid: boolean;
}

export function parseSymptomFromPost(postContent: string): ParsedSymptom {
  const patterns = {
    exercise: /(?:Exercício|Exercicio):?\s*(.+?)(?:\n|$)/i,
    location: /(?:Onde|Local|Região|Regiao):?\s*(.+?)(?:\n|$)/i,
    timing: /(?:Quando|Momento|Fase):?\s*(.+?)(?:\n|$)/i,
    painType: /(?:Tipo|Tipo de dor|Sensação|Sensacao):?\s*(.+?)(?:\n|$)/i,
    intensity: /Intensidade:?\s*(\d+)(?:\/10)?/i,
    duration: /(?:Há quanto tempo|Ha quanto tempo|Tempo|Duração|Duracao):?\s*(.+?)(?:\n|$)/i
  };

  const exerciseMatch = postContent.match(patterns.exercise);
  const locationMatch = postContent.match(patterns.location);
  const timingMatch = postContent.match(patterns.timing);
  const painTypeMatch = postContent.match(patterns.painType);
  const intensityMatch = postContent.match(patterns.intensity);
  const durationMatch = postContent.match(patterns.duration);

  const exercise = exerciseMatch?.[1]?.trim() || '';
  const location = locationMatch?.[1]?.trim() || '';
  const region = extractRegion(location + ' ' + postContent);
  const timing = timingMatch?.[1]?.trim() || '';
  const painType = painTypeMatch?.[1]?.trim() || '';
  const intensity = intensityMatch ? parseInt(intensityMatch[1]) : 0;
  const duration = durationMatch?.[1]?.trim() || '';
  const tags = extractTags(postContent);

  return {
    exercise,
    region,
    location,
    timing,
    painType,
    intensity,
    duration,
    tags,
    isValid: !!(exercise && location && region !== 'indefinido')
  };
}

export function extractRegion(text: string): string {
  const regionKeywords: Record<string, string[]> = {
    'ombro': ['ombro', 'deltoid', 'manguito', 'escapula', 'escápula'],
    'joelho': ['joelho', 'patela', 'menisco', 'ligamento'],
    'lombar': ['lombar', 'costas', 'coluna', 'lombo', 'l4', 'l5'],
    'pulso': ['pulso', 'punho', 'carpo'],
    'quadril': ['quadril', 'virilha', 'iliaco', 'ilíaco', 'coxofemoral'],
    'cotovelo': ['cotovelo', 'epicondilo'],
    'tornozelo': ['tornozelo', 'calcanhar', 'aquiles', 'tornozelo'],
    'cervical': ['pescoco', 'pescoço', 'cervical', 'nuca'],
    'torácica': ['toracica', 'torácica', 'meio das costas'],
    'mão': ['mao', 'mão', 'dedo', 'dedos'],
    'pé': ['pe', 'pé', 'arco', 'plantar']
  };

  const lower = text.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  for (const [region, keywords] of Object.entries(regionKeywords)) {
    if (keywords.some(kw => {
      const normalized = kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return lower.includes(normalized);
    })) {
      return region;
    }
  }

  return 'indefinido';
}

export function extractTags(content: string): string[] {
  const tagPattern = /#(\w+)/g;
  const matches = content.matchAll(tagPattern);
  return Array.from(matches).map(m => m[1]);
}

export function looksLikePainPost(content: string): boolean {
  const painKeywords = [
    'dor', 'doi', 'dói', 'doendo', 'dolorido',
    'desconforto', 'incomodo', 'incômodo',
    'fisgada', 'choque', 'queimação', 'queimacao',
    'formigamento', 'dormência', 'dormencia',
    'estalo', 'travamento', 'pressão', 'pressao',
    'pontada', 'latejante', 'pulsante'
  ];

  const lower = content.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  return painKeywords.some(kw => {
    const normalized = kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return lower.includes(normalized);
  });
}

export function extractIntensity(content: string): number {
  const patterns = [
    /(\d+)\/10/,
    /intensidade[:\s]+(\d+)/i,
    /nivel[:\s]+(\d+)/i,
    /nível[:\s]+(\d+)/i,
    /escala[:\s]+(\d+)/i
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      const value = parseInt(match[1]);
      return Math.min(10, Math.max(1, value)); // Clamp entre 1-10
    }
  }

  return 0;
}
