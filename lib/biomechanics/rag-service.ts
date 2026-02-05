/**
 * RAG Service para Análise Biomecânica
 * Busca conhecimento científico no Pinecone
 */

import { Pinecone } from '@pinecone-database/pinecone';

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX = process.env.PINECONE_INDEX_NAME || 'nutrifitcoach-books';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export interface RAGChunk {
  text: string;
  source: string;
  page: number;
  chapter?: string;
  category?: string;
  score: number;
}

export interface RAGSearchResult {
  chunks: RAGChunk[];
  sources: string[];
  totalChunks: number;
}

// Mapeamento de desvios para termos de busca em inglês/português
const DEVIATION_KEYWORDS: Record<string, string[]> = {
  'valgo': ['knee valgus', 'valgus collapse', 'dynamic knee valgus', 'medial knee collapse', 'valgo de joelho'],
  'varo': ['knee varus', 'varus alignment', 'lateral knee', 'varo de joelho'],
  'anteriorização': ['forward lean', 'trunk lean', 'anterior trunk', 'chest drop', 'inclinação anterior'],
  'cifose': ['kyphosis', 'thoracic kyphosis', 'rounded back', 'upper cross syndrome', 'cifose torácica'],
  'lordose': ['lordosis', 'lumbar lordosis', 'anterior pelvic tilt', 'hiperlordose'],
  'flexão excessiva': ['excessive flexion', 'deep squat', 'butt wink', 'posterior pelvic tilt'],
  'joelho': ['knee', 'patella', 'tibiofemoral', 'patellofemoral', 'articulação do joelho'],
  'quadril': ['hip', 'acetabulum', 'femur', 'hip flexion', 'flexão de quadril'],
  'tornozelo': ['ankle', 'dorsiflexion', 'ankle mobility', 'mobilidade de tornozelo'],
  'coluna': ['spine', 'vertebral', 'lumbar', 'thoracic', 'coluna vertebral'],
  'glúteo': ['gluteus', 'glute medius', 'glute maximus', 'hip abductor', 'glúteo médio'],
  'agachamento': ['squat', 'back squat', 'front squat', 'squat biomechanics', 'agachamento'],
};

/**
 * Gera embedding usando OpenAI
 */
async function generateEmbedding(text: string): Promise<number[]> {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY não configurada');
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erro ao gerar embedding: ${error}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

/**
 * Expande desvios para termos de busca
 */
function expandDeviationsToQueries(deviations: string[]): string[] {
  const queries: Set<string> = new Set();

  for (const deviation of deviations) {
    const deviationLower = deviation.toLowerCase();

    // Adicionar desvio original
    queries.add(deviation);

    // Buscar keywords relacionadas
    for (const [key, keywords] of Object.entries(DEVIATION_KEYWORDS)) {
      if (deviationLower.includes(key)) {
        keywords.forEach(kw => queries.add(kw));
      }
    }

    // Adicionar contexto de agachamento se não tiver
    if (!deviationLower.includes('agachamento') && !deviationLower.includes('squat')) {
      queries.add(`${deviation} squat biomechanics`);
    }
  }

  return Array.from(queries);
}

/**
 * Busca conhecimento biomecânico no Pinecone
 */
export async function searchBiomechanicsKnowledge(
  deviations: string[],
  options: {
    topK?: number;
    minScore?: number;
    categories?: string[];
  } = {}
): Promise<RAGSearchResult> {
  const { topK = 5, minScore = 0.65, categories } = options;

  // Verificar se Pinecone está configurado
  if (!PINECONE_API_KEY) {
    console.warn('⚠️ PINECONE_API_KEY não configurada - RAG desabilitado');
    return { chunks: [], sources: [], totalChunks: 0 };
  }

  try {
    const pinecone = new Pinecone({
      apiKey: PINECONE_API_KEY,
    });

    const index = pinecone.index(PINECONE_INDEX);

    // Expandir desvios para queries
    const queries = expandDeviationsToQueries(deviations);
    console.log(`🔍 RAG: Buscando ${queries.length} queries para ${deviations.length} desvios`);

    const allChunks: RAGChunk[] = [];

    // Buscar para cada query
    for (const query of queries.slice(0, 10)) { // Limitar a 10 queries
      try {
        const embedding = await generateEmbedding(query);

        // Construir filtro
        const filter: Record<string, any> = {};
        if (categories && categories.length > 0) {
          filter.category = { $in: categories };
        }

        const queryResponse = await index.query({
          vector: embedding,
          topK,
          filter: Object.keys(filter).length > 0 ? filter : undefined,
          includeMetadata: true,
        });

        // Processar resultados
        for (const match of queryResponse.matches) {
          if (match.score && match.score >= minScore) {
            allChunks.push({
              text: (match.metadata?.text as string) || '',
              source: (match.metadata?.source as string) || 'Fonte desconhecida',
              page: (match.metadata?.page as number) || 0,
              chapter: match.metadata?.chapter as string,
              category: match.metadata?.category as string,
              score: match.score,
            });
          }
        }
      } catch (queryError) {
        console.warn(`⚠️ Erro na query "${query}":`, queryError);
      }
    }

    // Deduplicate por texto
    const uniqueChunks = Array.from(
      new Map(allChunks.map(c => [c.text.substring(0, 100), c])).values()
    );

    // Ordenar por score e limitar
    const sortedChunks = uniqueChunks
      .sort((a, b) => b.score - a.score)
      .slice(0, 15); // Top 15 chunks

    // Extrair sources únicos
    const sources = [...new Set(sortedChunks.map(c => c.source))];

    console.log(`📚 RAG: Encontrados ${sortedChunks.length} chunks de ${sources.length} fontes`);

    return {
      chunks: sortedChunks,
      sources,
      totalChunks: sortedChunks.length,
    };
  } catch (error) {
    console.error('❌ Erro no RAG:', error);
    return { chunks: [], sources: [], totalChunks: 0 };
  }
}

/**
 * Formata chunks para incluir no prompt
 */
export function formatChunksForPrompt(chunks: RAGChunk[]): string {
  if (chunks.length === 0) {
    return 'Nenhuma referência científica disponível.';
  }

  return chunks
    .map((chunk, i) => {
      const sourceInfo = chunk.page > 0
        ? `[${chunk.source}, p. ${chunk.page}]`
        : `[${chunk.source}]`;

      return `--- Referência ${i + 1} ${sourceInfo} ---
${chunk.text}`;
    })
    .join('\n\n');
}

/**
 * Verifica se RAG está disponível
 */
export async function checkRAGAvailability(): Promise<{
  available: boolean;
  pinecone: boolean;
  openai: boolean;
  indexName?: string;
  error?: string;
}> {
  const result = {
    available: false,
    pinecone: !!PINECONE_API_KEY,
    openai: !!OPENAI_API_KEY,
    indexName: PINECONE_INDEX,
  };

  if (!result.pinecone || !result.openai) {
    return {
      ...result,
      error: 'Chaves de API não configuradas',
    };
  }

  try {
    const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY! });
    const index = pinecone.index(PINECONE_INDEX);

    // Verificar se índice existe
    const stats = await index.describeIndexStats();

    return {
      ...result,
      available: true,
    };
  } catch (error: any) {
    return {
      ...result,
      error: error.message,
    };
  }
}
