/**
 * Vector Store usando ChromaDB
 * Armazena e busca documentos usando embeddings vetoriais
 */

import { ChromaClient, Collection } from 'chromadb';
import { generateEmbedding } from './embeddings';

const CHROMA_URL = process.env.CHROMA_URL || 'http://localhost:8000';
const COLLECTION_NAME = 'nfc_knowledge_base';

let chromaClient: ChromaClient | null = null;
let collection: Collection | null = null;

/**
 * Inicializa cliente ChromaDB
 */
export async function initializeVectorStore(): Promise<void> {
  try {
    console.log('🔌 Connecting to ChromaDB...');

    chromaClient = new ChromaClient({ path: CHROMA_URL });

    // Criar ou obter coleção
    collection = await chromaClient.getOrCreateCollection({
      name: COLLECTION_NAME,
      metadata: { description: 'NFC Knowledge Base - Nutrição e Fitness' },
    });

    console.log(`✅ Vector store initialized: ${COLLECTION_NAME}`);
  } catch (error: any) {
    console.error('❌ Error initializing vector store:', error.message);
    // Fallback: usar modo in-memory se ChromaDB não estiver disponível
    console.warn('⚠️ Running without persistent vector store');
  }
}

/**
 * Adiciona documento à base de conhecimento
 */
export async function addDocument(doc: {
  id: string;
  text: string;
  metadata: {
    source: string;
    category: string;
    title?: string;
    author?: string;
    page?: number;
  };
}): Promise<boolean> {
  try {
    if (!collection) {
      console.warn('⚠️ Vector store not initialized');
      return false;
    }

    console.log(`📄 Adding document: ${doc.id}`);

    // Gerar embedding
    const { embedding } = await generateEmbedding(doc.text);

    // Adicionar ao ChromaDB
    await collection.add({
      ids: [doc.id],
      embeddings: [embedding],
      documents: [doc.text],
      metadatas: [doc.metadata],
    });

    console.log(`✅ Document added: ${doc.id}`);
    return true;
  } catch (error: any) {
    console.error(`❌ Error adding document ${doc.id}:`, error.message);
    return false;
  }
}

/**
 * Adiciona múltiplos documentos em batch
 */
export async function addDocumentsBatch(
  docs: Array<{
    id: string;
    text: string;
    metadata: any;
  }>
): Promise<number> {
  if (!collection) {
    console.warn('⚠️ Vector store not initialized');
    return 0;
  }

  console.log(`📚 Adding ${docs.length} documents in batch...`);

  let successCount = 0;

  // Processar em chunks de 10 para não sobrecarregar
  const CHUNK_SIZE = 10;
  for (let i = 0; i < docs.length; i += CHUNK_SIZE) {
    const chunk = docs.slice(i, i + CHUNK_SIZE);

    try {
      // Gerar embeddings para o chunk
      const embeddings = await Promise.all(
        chunk.map((doc) => generateEmbedding(doc.text))
      );

      // Adicionar ao ChromaDB
      await collection.add({
        ids: chunk.map((doc) => doc.id),
        embeddings: embeddings.map((e) => e.embedding),
        documents: chunk.map((doc) => doc.text),
        metadatas: chunk.map((doc) => doc.metadata),
      });

      successCount += chunk.length;
      console.log(`  Progress: ${Math.min(i + CHUNK_SIZE, docs.length)}/${docs.length}`);
    } catch (error) {
      console.error(`  Failed for chunk ${i / CHUNK_SIZE + 1}:`, error);
    }
  }

  console.log(`✅ Batch complete: ${successCount}/${docs.length} documents added`);
  return successCount;
}

/**
 * Busca semântica por similaridade
 */
export async function searchSimilar(
  query: string,
  options: {
    limit?: number;
    category?: string;
    minScore?: number;
  } = {}
): Promise<
  Array<{
    id: string;
    text: string;
    metadata: any;
    score: number;
  }>
> {
  try {
    if (!collection) {
      console.warn('⚠️ Vector store not initialized');
      return [];
    }

    const { limit = 5, category, minScore = 0.0 } = options;

    console.log(`🔍 Searching for: "${query.substring(0, 50)}..."`);

    // Gerar embedding da query
    const { embedding } = await generateEmbedding(query);

    // Buscar documentos similares
    const results = await collection.query({
      queryEmbeddings: [embedding],
      nResults: limit * 2, // Buscar mais para depois filtrar
      where: category ? { category } : undefined,
    });

    // Processar resultados
    const documents = [];

    if (results.ids && results.ids[0]) {
      for (let i = 0; i < results.ids[0].length; i++) {
        const score = results.distances?.[0]?.[i];

        // Converter distância em score de similaridade (0-1)
        // ChromaDB usa distância euclidiana por padrão
        const similarity = score !== undefined ? 1 / (1 + score) : 0;

        if (similarity >= minScore) {
          documents.push({
            id: results.ids[0][i],
            text: results.documents?.[0]?.[i] || '',
            metadata: results.metadatas?.[0]?.[i] || {},
            score: similarity,
          });
        }
      }
    }

    // Ordenar por score
    documents.sort((a, b) => b.score - a.score);

    // Limitar resultados
    const finalResults = documents.slice(0, limit);

    console.log(`✅ Found ${finalResults.length} relevant documents`);

    return finalResults;
  } catch (error: any) {
    console.error('❌ Error searching documents:', error.message);
    return [];
  }
}

/**
 * Remove documento da base
 */
export async function deleteDocument(id: string): Promise<boolean> {
  try {
    if (!collection) {
      console.warn('⚠️ Vector store not initialized');
      return false;
    }

    await collection.delete({ ids: [id] });
    console.log(`✅ Document deleted: ${id}`);
    return true;
  } catch (error: any) {
    console.error(`❌ Error deleting document ${id}:`, error.message);
    return false;
  }
}

/**
 * Limpa toda a coleção
 */
export async function clearCollection(): Promise<boolean> {
  try {
    if (!chromaClient) {
      console.warn('⚠️ Vector store not initialized');
      return false;
    }

    await chromaClient.deleteCollection({ name: COLLECTION_NAME });
    console.log(`✅ Collection cleared: ${COLLECTION_NAME}`);

    // Recriar coleção vazia
    await initializeVectorStore();
    return true;
  } catch (error: any) {
    console.error('❌ Error clearing collection:', error.message);
    return false;
  }
}

/**
 * Obtém estatísticas da coleção
 */
export async function getCollectionStats(): Promise<{
  count: number;
  name: string;
}> {
  try {
    if (!collection) {
      return { count: 0, name: COLLECTION_NAME };
    }

    const count = await collection.count();

    return {
      count,
      name: COLLECTION_NAME,
    };
  } catch (error: any) {
    console.error('❌ Error getting stats:', error.message);
    return { count: 0, name: COLLECTION_NAME };
  }
}
