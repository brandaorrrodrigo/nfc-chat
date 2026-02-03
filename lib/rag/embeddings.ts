/**
 * Serviço de Embeddings usando Ollama (nomic-embed-text)
 * Gera embeddings vetoriais para busca semântica
 */

import axios from 'axios';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const EMBEDDING_MODEL = 'nomic-embed-text:latest';

export interface EmbeddingResult {
  embedding: number[];
  model: string;
  tokensUsed?: number;
}

/**
 * Gera embedding para um texto usando Ollama
 */
export async function generateEmbedding(text: string): Promise<EmbeddingResult> {
  try {
    console.log(`🔢 Generating embedding for text (${text.length} chars)...`);

    const response = await axios.post(
      `${OLLAMA_URL}/api/embeddings`,
      {
        model: EMBEDDING_MODEL,
        prompt: text,
      },
      { timeout: 30000 }
    );

    const embedding = response.data.embedding;

    if (!embedding || !Array.isArray(embedding)) {
      throw new Error('Invalid embedding response');
    }

    console.log(`✅ Embedding generated (${embedding.length} dimensions)`);

    return {
      embedding,
      model: EMBEDDING_MODEL,
      tokensUsed: text.split(/\s+/).length,
    };
  } catch (error: any) {
    console.error('❌ Error generating embedding:', error.message);
    throw new Error(`Embedding generation failed: ${error.message}`);
  }
}

/**
 * Gera embeddings em batch (múltiplos textos)
 */
export async function generateEmbeddingsBatch(
  texts: string[]
): Promise<EmbeddingResult[]> {
  console.log(`🔢 Generating ${texts.length} embeddings in batch...`);

  const embeddings: EmbeddingResult[] = [];

  for (let i = 0; i < texts.length; i++) {
    try {
      const result = await generateEmbedding(texts[i]);
      embeddings.push(result);

      // Log progresso
      if ((i + 1) % 10 === 0) {
        console.log(`  Progress: ${i + 1}/${texts.length}`);
      }
    } catch (error) {
      console.error(`  Failed for text ${i + 1}:`, error);
      // Continuar mesmo se falhar
      embeddings.push({
        embedding: [],
        model: EMBEDDING_MODEL,
      });
    }
  }

  console.log(`✅ Batch complete: ${embeddings.length} embeddings generated`);

  return embeddings;
}

/**
 * Calcula similaridade de cosseno entre dois embeddings
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Embeddings must have same dimension');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Verifica se o modelo de embedding está disponível
 */
export async function checkEmbeddingModelAvailable(): Promise<boolean> {
  try {
    const response = await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 5000 });
    const models = response.data.models || [];
    return models.some((m: any) => m.name === EMBEDDING_MODEL);
  } catch (error) {
    console.error('❌ Error checking embedding model:', error);
    return false;
  }
}
