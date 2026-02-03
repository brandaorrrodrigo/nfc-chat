/**
 * Moderação Automática com LLM Local
 * Classifica conteúdo, detecta spam e low quality
 */

import axios from 'axios';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const FAST_MODEL = process.env.FAST_LLM_MODEL || 'llama3:8b';

export interface ModerationResult {
  decision: 'APPROVE' | 'FLAG' | 'REJECT';
  confidence: number;
  reason: string;
  categories: {
    spam: number; // 0-1
    lowQuality: number; // 0-1
    offensive: number; // 0-1
    offtopic: number; // 0-1
  };
  suggestions?: string[];
}

export interface ContentToModerate {
  text: string;
  author?: string;
  context?: string; // Arena, tópico, etc
  metadata?: Record<string, any>;
}

/**
 * Modera conteúdo usando LLM
 */
export async function moderateContent(
  content: ContentToModerate
): Promise<ModerationResult> {
  const { text, context = 'Comunidade NFC' } = content;

  console.log(`🛡️ Moderating content (${text.length} chars)...`);

  // Validações rápidas antes de chamar LLM
  const quickCheck = quickModerationCheck(text);
  if (quickCheck) {
    return quickCheck;
  }

  try {
    const prompt = `Você é um moderador automático de conteúdo para uma comunidade de nutrição e fitness.

Analise o seguinte conteúdo e classifique em categorias:

Conteúdo: "${text}"
Contexto: ${context}

RESPONDA APENAS EM JSON com o seguinte formato (SEM TEXTO ADICIONAL):
{
  "decision": "APPROVE/FLAG/REJECT",
  "spam": 0.0-1.0,
  "lowQuality": 0.0-1.0,
  "offensive": 0.0-1.0,
  "offtopic": 0.0-1.0,
  "reason": "explicação breve"
}

Critérios:
- SPAM: Links suspeitos, venda agressiva, repetitivo
- LOW QUALITY: Sem conteúdo útil, muito curto, incompreensível
- OFFENSIVE: Ofensivo, discriminatório, harassment
- OFFTOPIC: Completamente fora do tema nutrição/fitness

DECISION:
- APPROVE: Conteúdo ok (scores < 0.5)
- FLAG: Suspeito, revisar (algum score 0.5-0.7)
- REJECT: Violar regras (algum score > 0.7)`;

    const response = await axios.post(
      `${OLLAMA_URL}/api/generate`,
      {
        model: FAST_MODEL,
        prompt,
        stream: false,
        options: {
          temperature: 0.1, // Baixa temperatura para consistência
          num_predict: 150,
        },
      },
      { timeout: 30000 }
    );

    const generatedText = response.data.response || '';

    // Extrair JSON da resposta
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.warn('⚠️ Failed to parse LLM response, using fallback');
      return createFallbackResult('APPROVE', 'Análise inconclusiva');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validar e normalizar resposta
    const result: ModerationResult = {
      decision: parsed.decision || 'APPROVE',
      confidence: calculateConfidence(parsed),
      reason: parsed.reason || 'Sem razão específica',
      categories: {
        spam: Math.max(0, Math.min(1, parsed.spam || 0)),
        lowQuality: Math.max(0, Math.min(1, parsed.lowQuality || 0)),
        offensive: Math.max(0, Math.min(1, parsed.offensive || 0)),
        offtopic: Math.max(0, Math.min(1, parsed.offtopic || 0)),
      },
      suggestions: generateSuggestions(parsed),
    };

    console.log(`✅ Moderation complete: ${result.decision} (confidence: ${result.confidence})`);

    return result;
  } catch (error: any) {
    console.error('❌ Moderation error:', error.message);

    // Fallback: aprovar com baixa confiança
    return createFallbackResult('APPROVE', 'Erro na análise automática');
  }
}

/**
 * Verificações rápidas sem LLM
 */
function quickModerationCheck(text: string): ModerationResult | null {
  // Muito curto
  if (text.trim().length < 5) {
    return {
      decision: 'REJECT',
      confidence: 1.0,
      reason: 'Conteúdo muito curto (< 5 caracteres)',
      categories: {
        spam: 0,
        lowQuality: 1.0,
        offensive: 0,
        offtopic: 0,
      },
    };
  }

  // Muito longo
  if (text.length > 5000) {
    return {
      decision: 'FLAG',
      confidence: 0.8,
      reason: 'Conteúdo muito longo (> 5000 caracteres)',
      categories: {
        spam: 0.5,
        lowQuality: 0,
        offensive: 0,
        offtopic: 0,
      },
    };
  }

  // Spam óbvio: muitos links
  const linkCount = (text.match(/https?:\/\//g) || []).length;
  if (linkCount > 3) {
    return {
      decision: 'REJECT',
      confidence: 0.9,
      reason: `Muitos links (${linkCount})`,
      categories: {
        spam: 0.9,
        lowQuality: 0,
        offensive: 0,
        offtopic: 0,
      },
    };
  }

  // Caps lock excessivo
  const upperCount = (text.match(/[A-Z]/g) || []).length;
  const lowerCount = (text.match(/[a-z]/g) || []).length;
  if (upperCount > 0 && upperCount / (upperCount + lowerCount) > 0.7) {
    return {
      decision: 'FLAG',
      confidence: 0.7,
      reason: 'Uso excessivo de maiúsculas',
      categories: {
        spam: 0.6,
        lowQuality: 0.3,
        offensive: 0,
        offtopic: 0,
      },
    };
  }

  // Palavrões óbvios (lista básica)
  const profanityList = ['porra', 'caralho', 'merda', 'filho da puta', 'fdp'];
  const hasProfanity = profanityList.some((word) =>
    text.toLowerCase().includes(word)
  );

  if (hasProfanity) {
    return {
      decision: 'FLAG',
      confidence: 0.8,
      reason: 'Linguagem imprópria detectada',
      categories: {
        spam: 0,
        lowQuality: 0.3,
        offensive: 0.8,
        offtopic: 0,
      },
    };
  }

  return null; // Sem issues óbvios, precisa análise LLM
}

/**
 * Calcula confiança da decisão
 */
function calculateConfidence(parsed: any): number {
  const scores = [
    parsed.spam || 0,
    parsed.lowQuality || 0,
    parsed.offensive || 0,
    parsed.offtopic || 0,
  ];

  const maxScore = Math.max(...scores);

  // Confiança alta se score extremo (muito alto ou muito baixo)
  if (maxScore > 0.8) return 0.9;
  if (maxScore < 0.2) return 0.9;

  // Confiança média se scores intermediários
  return 0.6;
}

/**
 * Gera sugestões de melhoria
 */
function generateSuggestions(parsed: any): string[] {
  const suggestions: string[] = [];

  if (parsed.lowQuality > 0.5) {
    suggestions.push('Adicione mais detalhes ou contexto à sua mensagem');
  }

  if (parsed.offtopic > 0.5) {
    suggestions.push('Tente manter o foco em nutrição e fitness');
  }

  if (parsed.spam > 0.5) {
    suggestions.push('Evite links excessivos ou conteúdo promocional');
  }

  if (parsed.offensive > 0.5) {
    suggestions.push('Revise o tom da mensagem para ser mais respeitoso');
  }

  return suggestions;
}

/**
 * Cria resultado fallback
 */
function createFallbackResult(
  decision: 'APPROVE' | 'FLAG' | 'REJECT',
  reason: string
): ModerationResult {
  return {
    decision,
    confidence: 0.3,
    reason,
    categories: {
      spam: 0,
      lowQuality: 0,
      offensive: 0,
      offtopic: 0,
    },
  };
}

/**
 * Batch moderation de múltiplos conteúdos
 */
export async function moderateBatch(
  contents: ContentToModerate[]
): Promise<ModerationResult[]> {
  console.log(`🛡️ Batch moderating ${contents.length} contents...`);

  const results: ModerationResult[] = [];

  for (const content of contents) {
    try {
      const result = await moderateContent(content);
      results.push(result);

      // Delay para não sobrecarregar
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      console.error('Batch moderation error:', error);
      results.push(createFallbackResult('APPROVE', 'Erro na análise'));
    }
  }

  console.log(`✅ Batch moderation complete`);

  return results;
}

/**
 * Calcula score de qualidade de conteúdo (0-100)
 */
export function calculateQualityScore(content: string, moderation: ModerationResult): number {
  let score = 100;

  // Penalizar por categorias negativas
  score -= moderation.categories.spam * 40;
  score -= moderation.categories.lowQuality * 30;
  score -= moderation.categories.offensive * 50;
  score -= moderation.categories.offtopic * 20;

  // Bônus por tamanho razoável (100-1000 chars)
  if (content.length >= 100 && content.length <= 1000) {
    score += 10;
  }

  // Bônus por estrutura (parágrafos)
  if (content.includes('\n\n')) {
    score += 5;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}
