/**
 * Script de Teste do Sistema RAG
 *
 * Testa embeddings, vector store e RAG completo
 *
 * Uso:
 * npx ts-node scripts/test-rag.ts
 */

import { generateEmbedding, checkEmbeddingModelAvailable } from '../lib/rag/embeddings';
import { initializeVectorStore, addDocument, searchSimilar, getCollectionStats } from '../lib/rag/vector-store';
import { askRAG } from '../lib/rag/rag-service';
import { ingestDocumentsBatch, SEED_DOCUMENTS } from '../lib/rag/document-ingestion';

async function main() {
  console.log('🧪 Testing RAG System\n');

  // 1. Testar modelo de embedding
  console.log('1️⃣ Testing Embedding Model...');
  const modelAvailable = await checkEmbeddingModelAvailable();
  console.log(`   Model available: ${modelAvailable ? '✅' : '❌'}`);

  if (!modelAvailable) {
    console.error('\n❌ nomic-embed-text not found!');
    console.log('Run: ollama pull nomic-embed-text');
    process.exit(1);
  }

  // 2. Testar geração de embedding
  console.log('\n2️⃣ Testing Embedding Generation...');
  const testText = 'Como ganhar massa muscular rapidamente?';
  const embedding = await generateEmbedding(testText);
  console.log(`   Embedding dimensions: ${embedding.embedding.length}`);
  console.log(`   Model: ${embedding.model}`);

  // 3. Inicializar vector store
  console.log('\n3️⃣ Initializing Vector Store...');
  await initializeVectorStore();
  const initialStats = await getCollectionStats();
  console.log(`   Collection: ${initialStats.name}`);
  console.log(`   Documents: ${initialStats.count}`);

  // 4. Seed documentos se vazio
  if (initialStats.count === 0) {
    console.log('\n4️⃣ Seeding Documents...');
    const chunksAdded = await ingestDocumentsBatch(SEED_DOCUMENTS);
    console.log(`   Chunks added: ${chunksAdded}`);

    const finalStats = await getCollectionStats();
    console.log(`   Total documents: ${finalStats.count}`);
  } else {
    console.log('\n4️⃣ Documents already seeded ✅');
  }

  // 5. Testar busca semântica
  console.log('\n5️⃣ Testing Semantic Search...');
  const searchQuery = 'Como perder peso de forma saudável?';
  console.log(`   Query: "${searchQuery}"`);

  const results = await searchSimilar(searchQuery, { limit: 3 });
  console.log(`   Results found: ${results.length}`);

  results.forEach((result, i) => {
    console.log(`\n   Result ${i + 1}:`);
    console.log(`   - Score: ${result.score.toFixed(3)}`);
    console.log(`   - Title: ${result.metadata.title || 'N/A'}`);
    console.log(`   - Excerpt: ${result.text.substring(0, 100)}...`);
  });

  // 6. Testar RAG completo
  console.log('\n6️⃣ Testing Full RAG Query...');
  const ragQuery = 'Qual a quantidade ideal de proteína para hipertrofia?';
  console.log(`   Question: "${ragQuery}"`);

  const ragResponse = await askRAG({
    question: ragQuery,
    persona: 'SCIENTIFIC',
  });

  console.log(`\n   Answer (${ragResponse.answer.length} chars):`);
  console.log(`   ${ragResponse.answer.substring(0, 300)}...`);
  console.log(`\n   Sources used: ${ragResponse.sources.length}`);
  console.log(`   Confidence: ${ragResponse.confidenceScore.toFixed(2)}`);
  console.log(`   Model: ${ragResponse.model}`);

  console.log('\n✅ All tests passed!');
}

main().catch((error) => {
  console.error('\n❌ Test failed:', error);
  process.exit(1);
});
