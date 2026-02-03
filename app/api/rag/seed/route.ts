/**
 * API: RAG Seed
 * POST /api/rag/seed
 *
 * Popula base de conhecimento com documentos iniciais
 * ATENÇÃO: Requer autenticação de admin
 */

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutos

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { initializeVectorStore, clearCollection, getCollectionStats } from '@/lib/rag/vector-store';
import { ingestDocumentsBatch, SEED_DOCUMENTS } from '@/lib/rag/document-ingestion';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação de admin
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action = 'seed', clearFirst = false } = body;

    console.log(`🌱 RAG Seed request: action=${action}, clearFirst=${clearFirst}`);

    // Inicializar vector store
    await initializeVectorStore();

    // Limpar coleção se solicitado
    if (clearFirst) {
      console.log('🗑️ Clearing existing collection...');
      await clearCollection();
    }

    // Ingerir documentos
    console.log(`📚 Ingesting ${SEED_DOCUMENTS.length} seed documents...`);

    const chunksAdded = await ingestDocumentsBatch(SEED_DOCUMENTS);

    // Obter stats finais
    const stats = await getCollectionStats();

    return NextResponse.json({
      success: true,
      message: 'Knowledge base seeded successfully',
      stats: {
        documentsIngested: SEED_DOCUMENTS.length,
        chunksAdded,
        totalChunksInCollection: stats.count,
      },
    });
  } catch (error: any) {
    console.error('❌ RAG Seed error:', error);

    return NextResponse.json(
      {
        error: 'Seed failed',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Verificar status da base de conhecimento
 */
export async function GET(request: NextRequest) {
  try {
    const stats = await getCollectionStats();

    return NextResponse.json({
      success: true,
      stats: {
        totalChunks: stats.count,
        collectionName: stats.name,
        seedDocumentsAvailable: SEED_DOCUMENTS.length,
      },
    });
  } catch (error: any) {
    console.error('❌ RAG Stats error:', error);

    return NextResponse.json(
      {
        error: 'Failed to get stats',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
