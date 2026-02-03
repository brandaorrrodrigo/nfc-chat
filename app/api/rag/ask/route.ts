/**
 * API: RAG Ask
 * POST /api/rag/ask
 *
 * Faz pergunta com RAG - busca conhecimento e gera resposta
 */

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

import { NextRequest, NextResponse } from 'next/server';
import { askRAG } from '@/lib/rag/rag-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, category, persona, arenaContext } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required and must be a string' },
        { status: 400 }
      );
    }

    // Validar tamanho da pergunta
    if (question.length < 10 || question.length > 1000) {
      return NextResponse.json(
        { error: 'Question must be between 10 and 1000 characters' },
        { status: 400 }
      );
    }

    console.log(`📥 RAG Ask request: "${question.substring(0, 50)}..."`);

    // Executar RAG
    const result = await askRAG({
      question,
      category,
      persona: persona || 'BALANCED',
      arenaContext: arenaContext || 'Comunidade NFC',
      maxResults: 5,
      minScore: 0.3,
    });

    return NextResponse.json({
      success: true,
      answer: result.answer,
      sources: result.sources.map((s) => ({
        title: s.metadata.title || 'Documento',
        excerpt: s.text.substring(0, 150) + '...',
        score: s.score,
        category: s.metadata.category,
      })),
      confidence: result.confidenceScore,
      model: result.model,
    });
  } catch (error: any) {
    console.error('❌ RAG Ask error:', error);

    return NextResponse.json(
      {
        error: 'Failed to process question',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
