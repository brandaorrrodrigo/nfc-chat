import axios from 'axios'
import { redis } from '../redis'

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434'
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'nomic-embed-text'

interface EmbeddingResponse {
  embedding: number[]
}

// Cache de embeddings no Redis
async function getCachedEmbedding(text: string): Promise<number[] | null> {
  try {
    const cacheKey = `embedding:${Buffer.from(text).toString('base64').slice(0, 50)}`
    const cached = await redis.get(cacheKey)

    if (cached) {
      return JSON.parse(cached)
    }
  } catch (error) {
    console.error('Error getting cached embedding:', error)
  }

  return null
}

async function setCachedEmbedding(text: string, embedding: number[]): Promise<void> {
  try {
    const cacheKey = `embedding:${Buffer.from(text).toString('base64').slice(0, 50)}`
    await redis.setex(cacheKey, 86400, JSON.stringify(embedding)) // 24h cache
  } catch (error) {
    console.error('Error setting cached embedding:', error)
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  // Verificar cache primeiro
  const cached = await getCachedEmbedding(text)
  if (cached) {
    console.log('✅ Using cached embedding')
    return cached
  }

  try {
    console.log(`🔢 Generating embedding for text (${text.length} chars)...`)

    const response = await axios.post(`${OLLAMA_URL}/api/embeddings`, {
      model: EMBEDDING_MODEL,
      prompt: text
    }, {
      timeout: 30000
    })

    const embedding = response.data.embedding

    if (!embedding || !Array.isArray(embedding)) {
      throw new Error('Invalid embedding response')
    }

    // Cachear para uso futuro
    await setCachedEmbedding(text, embedding)

    console.log(`✅ Embedding generated (${embedding.length} dimensions)`)

    return embedding
  } catch (error: any) {
    console.error('❌ Error generating embedding:', error.message)
    throw error
  }
}

export async function generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
  console.log(`🔢 Generating ${texts.length} embeddings in batch...`)

  const embeddings: number[][] = []

  // Processar em paralelo (máx 5 por vez)
  const batchSize = 5
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map(text => generateEmbedding(text))
    )
    embeddings.push(...batchResults)
  }

  console.log(`✅ Generated ${embeddings.length} embeddings`)

  return embeddings
}

// Calcular similaridade cosseno entre dois vetores
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

// Verificar se o modelo de embeddings está disponível
export async function checkEmbeddingModelAvailable(): Promise<boolean> {
  try {
    const response = await axios.get(`${OLLAMA_URL}/api/tags`)
    const models = response.data.models?.map((m: any) => m.name) || []
    return models.includes(EMBEDDING_MODEL)
  } catch (error) {
    console.error('❌ Error checking embedding model:', error)
    return false
  }
}

// Pull do modelo de embeddings se não estiver disponível
export async function pullEmbeddingModel(): Promise<void> {
  try {
    console.log(`📥 Pulling embedding model: ${EMBEDDING_MODEL}...`)

    await axios.post(`${OLLAMA_URL}/api/pull`, {
      name: EMBEDDING_MODEL
    })

    console.log(`✅ Model ${EMBEDDING_MODEL} pulled successfully`)
  } catch (error) {
    console.error('❌ Error pulling embedding model:', error)
    throw error
  }
}
