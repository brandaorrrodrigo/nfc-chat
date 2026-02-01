import { Pinecone } from '@pinecone-database/pinecone'

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || ''
})

const indexName = process.env.PINECONE_INDEX || 'nutrifitcoach-knowledge'

interface RAGQueryParams {
  query: string
  arenaSlug: string
  topK?: number
}

interface RAGChunk {
  id: string
  text: string
  metadata: {
    source: string
    book?: string
    page?: number
    author?: string
    category?: string
  }
  score: number
}

export async function queryRAG(params: RAGQueryParams): Promise<RAGChunk[]> {
  const { query, arenaSlug, topK = 5 } = params

  try {
    const index = pinecone.index(indexName)

    // Gerar embedding da query (usando OpenAI)
    const embedding = await generateEmbedding(query)

    // Query Pinecone
    const queryResponse = await index.query({
      vector: embedding,
      topK,
      includeMetadata: true,
      filter: {
        arena: arenaSlug // Filtrar por arena
      }
    })

    // Formatar resultados
    const chunks: RAGChunk[] = queryResponse.matches?.map(match => ({
      id: match.id,
      text: (match.metadata?.text as string) || '',
      metadata: {
        source: (match.metadata?.source as string) || 'unknown',
        book: match.metadata?.book as string,
        page: match.metadata?.page as number,
        author: match.metadata?.author as string,
        category: match.metadata?.category as string
      },
      score: match.score || 0
    })) || []

    return chunks
  } catch (error) {
    console.error('Error querying RAG:', error)
    return []
  }
}

async function generateEmbedding(text: string): Promise<number[]> {
  // TODO: Implementar com OpenAI text-embedding-3-small
  // Por enquanto, retornar array vazio

  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text
      })
    })

    const data = await response.json()
    return data.data[0].embedding
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw error
  }
}

export async function upsertDocument(params: {
  id: string
  text: string
  metadata: any
  arenaSlug: string
}): Promise<void> {
  const { id, text, metadata, arenaSlug } = params

  try {
    const index = pinecone.index(indexName)
    const embedding = await generateEmbedding(text)

    await index.upsert([
      {
        id,
        values: embedding,
        metadata: {
          ...metadata,
          text,
          arena: arenaSlug
        }
      }
    ])

    console.log(`✅ Document upserted to Pinecone: ${id}`)
  } catch (error) {
    console.error('Error upserting document to Pinecone:', error)
    throw error
  }
}

export async function deleteDocument(id: string): Promise<void> {
  try {
    const index = pinecone.index(indexName)
    await index.deleteOne(id)
    console.log(`✅ Document deleted from Pinecone: ${id}`)
  } catch (error) {
    console.error('Error deleting document from Pinecone:', error)
    throw error
  }
}
