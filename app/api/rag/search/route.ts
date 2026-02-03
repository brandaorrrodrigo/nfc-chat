/**
 * API: RAG Search
 * GET /api/rag/search?q=query&category=nutricao&limit=10
 *
 * Busca documentos relevantes na base de conhecimento
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { searchKnowledgeBase } from '@/lib/rag/rag-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category') || undefined;
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 RAG Search: "${query}"`);

    // Buscar documentos
    const results = await searchKnowledgeBase(query, {
      category,
      limit,
      minScore: 0.3,
    });

    return NextResponse.json({
      success: true,
      results: results.map((r) => ({
        id: r.id,
        text: r.text,
        score: r.score,
        metadata: r.metadata,
      })),
      total: results.length,
    });
  } catch (error: any) {
    console.error('❌ RAG Search error:', error);

    return NextResponse.json(
      {
        error: 'Search failed',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
