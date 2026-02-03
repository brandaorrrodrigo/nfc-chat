/**
 * Serviço RAG (Retrieval Augmented Generation)
 * Combina busca semântica com geração de resposta LLM
 */

import { searchSimilar } from './vector-store';
import { generateAIResponse } from '../ai/llm';

export interface RAGQuery {
  question: string;
  category?: string;
  maxResults?: number;
  minScore?: number;
  persona?: 'SCIENTIFIC' | 'MOTIVATIONAL' | 'SUSTAINING' | 'BALANCED';
  arenaContext?: string;
}

export interface RAGResponse {
  answer: string;
  sources: Array<{
    id: string;
    text: string;
    score: number;
    metadata: any;
  }>;
  confidenceScore: number;
  model: string;
}

/**
 * Busca contexto relevante e gera resposta com LLM
 */
export async function askRAG(query: RAGQuery): Promise<RAGResponse> {
  const {
    question,
    category,
    maxResults = 5,
    minScore = 0.3,
    persona = 'BALANCED',
    arenaContext = 'Comunidade NFC',
  } = query;

  console.log(`🤖 RAG Query: "${question.substring(0, 50)}..."`);

  try {
    // 1. Buscar documentos relevantes
    const documents = await searchSimilar(question, {
      limit: maxResults,
      category,
      minScore,
    });

    console.log(`  Found ${documents.length} relevant documents`);

    // 2. Preparar contexto RAG
    const ragContext = documents.map((doc) => {
      return `${doc.text}\n[Fonte: ${doc.metadata.title || doc.metadata.source}]`;
    });

    // 3. Gerar resposta com LLM
    const response = await generateAIResponse({
      userMessage: question,
      arenaContext,
      persona,
      ragContext,
    });

    console.log(`✅ RAG Response generated (confidence: ${response.confidenceScore})`);

    return {
      answer: response.content,
      sources: documents,
      confidenceScore: response.confidenceScore,
      model: 'llama3.1:70b + nomic-embed-text',
    };
  } catch (error: any) {
    console.error('❌ RAG Query failed:', error.message);

    // Fallback: responder sem RAG
    const fallbackResponse = await generateAIResponse({
      userMessage: question,
      arenaContext,
      persona,
      ragContext: [],
    });

    return {
      answer: fallbackResponse.content,
      sources: [],
      confidenceScore: 0.3,
      model: 'llama3.1:70b (no RAG)',
    };
  }
}

/**
 * Busca apenas documentos relevantes (sem gerar resposta)
 */
export async function searchKnowledgeBase(
  query: string,
  options: {
    category?: string;
    limit?: number;
    minScore?: number;
  } = {}
): Promise<
  Array<{
    id: string;
    text: string;
    score: number;
    metadata: any;
  }>
> {
  const { category, limit = 10, minScore = 0.3 } = options;

  console.log(`🔍 Knowledge Base Search: "${query.substring(0, 50)}..."`);

  const results = await searchSimilar(query, {
    limit,
    category,
    minScore,
  });

  console.log(`✅ Found ${results.length} results`);

  return results;
}

/**
 * Sugere perguntas relacionadas baseadas em uma query
 */
export async function suggestRelatedQuestions(query: string): Promise<string[]> {
  // Buscar documentos similares
  const documents = await searchSimilar(query, {
    limit: 3,
    minScore: 0.4,
  });

  if (documents.length === 0) {
    return [];
  }

  // Gerar perguntas relacionadas com LLM
  const context = documents.map((d) => d.text).join('\n\n');

  const prompt = `Baseado no seguinte contexto, sugira 3 perguntas relacionadas que um usuário poderia fazer:

Contexto:
${context}

Pergunta original: ${query}

Retorne APENAS as 3 perguntas, uma por linha, sem numeração ou formatação extra.`;

  try {
    const response = await generateAIResponse({
      userMessage: prompt,
      arenaContext: 'Sugestões',
      persona: 'BALANCED',
      ragContext: [],
      useFastModel: true,
    });

    // Extrair perguntas
    const questions = response.content
      .split('\n')
      .map((q) => q.trim())
      .filter((q) => q.length > 10 && q.endsWith('?'))
      .slice(0, 3);

    return questions;
  } catch (error) {
    console.error('Error generating related questions:', error);
    return [];
  }
}

/**
 * Avalia qualidade de uma resposta
 */
export function evaluateAnswerQuality(answer: string, sources: any[]): number {
  let score = 0.5; // Base

  // Tem fontes RAG
  if (sources.length > 0) {
    score += 0.2;
  }

  // Resposta é substancial
  if (answer.length > 200) {
    score += 0.1;
  }

  // Tem estrutura (parágrafos)
  if (answer.includes('\n\n')) {
    score += 0.1;
  }

  // Tem disclaimers médicos apropriados
  if (
    answer.toLowerCase().includes('consulte') ||
    answer.toLowerCase().includes('profissional')
  ) {
    score += 0.1;
  }

  return Math.min(score, 1.0);
}
