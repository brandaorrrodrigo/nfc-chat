/**
 * Serviço de Ingestão de Documentos
 * Processa documentos (texto, PDF, markdown) e adiciona ao vector store
 */

import { addDocument, addDocumentsBatch } from './vector-store';

export interface Document {
  content: string;
  metadata: {
    source: string;
    category: string;
    title?: string;
    author?: string;
    url?: string;
    createdAt?: string;
  };
}

export interface ChunkedDocument {
  id: string;
  text: string;
  metadata: any;
}

/**
 * Divide texto em chunks menores para melhor busca
 */
export function chunkText(
  text: string,
  options: {
    chunkSize?: number;
    overlap?: number;
  } = {}
): string[] {
  const { chunkSize = 500, overlap = 50 } = options;

  // Dividir por parágrafos primeiro
  const paragraphs = text.split(/\n\n+/);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();
    if (!trimmed) continue;

    // Se adicionar o parágrafo ultrapassar o limite
    if (currentChunk.length + trimmed.length > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());

      // Overlap: pegar últimas palavras do chunk anterior
      const words = currentChunk.split(/\s+/);
      const overlapWords = words.slice(-overlap).join(' ');
      currentChunk = overlapWords + ' ' + trimmed;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + trimmed;
    }
  }

  // Adicionar último chunk
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Processa documento e retorna chunks prontos para ingestão
 */
export function processDocument(doc: Document): ChunkedDocument[] {
  const chunks = chunkText(doc.content, { chunkSize: 500, overlap: 50 });

  return chunks.map((chunk, index) => ({
    id: `${doc.metadata.source}_chunk_${index}`,
    text: chunk,
    metadata: {
      ...doc.metadata,
      chunkIndex: index,
      totalChunks: chunks.length,
      chunkSize: chunk.length,
    },
  }));
}

/**
 * Ingere um único documento
 */
export async function ingestDocument(doc: Document): Promise<number> {
  console.log(`📥 Ingesting document: ${doc.metadata.source}`);

  const chunks = processDocument(doc);

  console.log(`  Split into ${chunks.length} chunks`);

  let successCount = 0;

  for (const chunk of chunks) {
    const success = await addDocument(chunk);
    if (success) successCount++;
  }

  console.log(`✅ Ingestion complete: ${successCount}/${chunks.length} chunks added`);

  return successCount;
}

/**
 * Ingere múltiplos documentos
 */
export async function ingestDocumentsBatch(docs: Document[]): Promise<number> {
  console.log(`📥 Ingesting ${docs.length} documents...`);

  const allChunks: ChunkedDocument[] = [];

  for (const doc of docs) {
    const chunks = processDocument(doc);
    allChunks.push(...chunks);
  }

  console.log(`  Total chunks: ${allChunks.length}`);

  const successCount = await addDocumentsBatch(allChunks);

  console.log(`✅ Batch ingestion complete: ${successCount}/${allChunks.length} chunks added`);

  return successCount;
}

/**
 * Ingere documento a partir de texto simples
 */
export async function ingestPlainText(
  text: string,
  metadata: Document['metadata']
): Promise<number> {
  return ingestDocument({
    content: text,
    metadata,
  });
}

/**
 * Ingere documento a partir de markdown
 */
export async function ingestMarkdown(
  markdown: string,
  metadata: Document['metadata']
): Promise<number> {
  // Remover sintaxe markdown para melhor busca
  const plainText = markdown
    .replace(/^#{1,6}\s+/gm, '') // Headers
    .replace(/\*\*(.+?)\*\*/g, '$1') // Bold
    .replace(/\*(.+?)\*/g, '$1') // Italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Links
    .replace(/`{1,3}[^`]*`{1,3}/g, '') // Code blocks
    .replace(/^\s*[-*+]\s+/gm, '') // Lists
    .trim();

  return ingestDocument({
    content: plainText,
    metadata: {
      ...metadata,
    },
  });
}

/**
 * Seed inicial com documentos base de nutrição e fitness
 */
export const SEED_DOCUMENTS: Document[] = [
  // NUTRIÇÃO
  {
    content: `# Déficit Calórico e Emagrecimento

Para perder peso, é necessário criar um déficit calórico, ou seja, consumir menos calorias do que o corpo gasta. Um déficit saudável é de 300-500 kcal por dia, resultando em perda de 0.5-1kg por semana.

Estratégias:
- Calcular gasto energético total (GET)
- Reduzir 15-20% das calorias
- Priorizar alimentos de alta saciedade
- Manter ingestão proteica alta (1.6-2.2g/kg)
- Não reduzir abaixo de 1200 kcal para mulheres ou 1500 kcal para homens

Sinais de déficit excessivo:
- Fadiga constante
- Queda de cabelo
- Perda menstrual
- Irritabilidade
- Perda muscular`,
    metadata: {
      source: 'nutricao_deficit_calorico',
      category: 'nutricao',
      title: 'Déficit Calórico e Emagrecimento',
      author: 'NFC Knowledge Base',
    },
  },
  {
    content: `# Proteína e Hipertrofia

A proteína é essencial para construção e manutenção muscular. A recomendação para hipertrofia é de 1.6-2.2g/kg de peso corporal por dia.

Distribuição ideal:
- 3-5 refeições com 25-40g de proteína cada
- Janela peritreinamento: 0.3-0.5g/kg antes e depois
- Antes de dormir: 30-40g de caseína ou whey

Fontes de qualidade:
- Carnes magras (frango, peixe, carne vermelha)
- Ovos inteiros
- Laticínios (iogurte grego, queijo cottage)
- Whey protein
- Proteína vegetal (feijão, lentilha, tofu)

Aminoácidos essenciais (EAA) e leucina são especialmente importantes para sinalização de síntese proteica.`,
    metadata: {
      source: 'nutricao_proteina_hipertrofia',
      category: 'nutricao',
      title: 'Proteína e Hipertrofia',
      author: 'NFC Knowledge Base',
    },
  },
  {
    content: `# Carboidratos e Performance

Carboidratos são a principal fonte de energia para treinos intensos. A necessidade varia de acordo com volume e intensidade.

Recomendações por objetivo:
- Sedentário: 2-3g/kg
- Treino moderado: 3-5g/kg
- Treino intenso: 5-7g/kg
- Atleta de endurance: 7-10g/kg

Timing de carboidratos:
- Pré-treino (1-3h antes): 0.5-1g/kg de carbs complexos
- Durante treino >90min: 30-60g/h de carboidratos simples
- Pós-treino (até 2h): 1-1.2g/kg para reposição de glicogênio

Tipos:
- Complexos: arroz, batata, aveia, pães integrais
- Simples: frutas, mel, dextrose (apenas peri-treino)`,
    metadata: {
      source: 'nutricao_carboidratos',
      category: 'nutricao',
      title: 'Carboidratos e Performance',
      author: 'NFC Knowledge Base',
    },
  },

  // FITNESS
  {
    content: `# Princípios da Hipertrofia Muscular

Para ganho de massa muscular, três fatores são essenciais:

1. Tensão Mecânica:
- Carga progressiva (progressive overload)
- Trabalhar com 60-85% de 1RM
- Séries de 6-12 repetições

2. Estresse Metabólico:
- Tempo sob tensão (TUT) de 40-70s por série
- Descanso curto/moderado (30-90s)
- Técnicas de intensificação (drop sets, rest-pause)

3. Dano Muscular:
- Fase excêntrica controlada (2-3s)
- Variação de exercícios
- Volume adequado (10-20 séries por músculo/semana)

Frequência ideal: 2x por músculo/semana é superior a 1x para maioria das pessoas.`,
    metadata: {
      source: 'fitness_hipertrofia',
      category: 'fitness',
      title: 'Princípios da Hipertrofia',
      author: 'NFC Knowledge Base',
    },
  },
  {
    content: `# Técnica de Agachamento

O agachamento é um exercício fundamental multiarticular. Execução correta:

Setup:
- Barra apoiada no trapézio superior (high bar) ou inferior (low bar)
- Pés largura do quadril a ombros
- Pontas dos pés 15-30° para fora
- Core ativado e peito para cima

Execução:
- Inspirar e fazer Valsalva (prender ar)
- Iniciar movimento com flexão de joelhos E quadril
- Joelhos seguem linha dos pés (não colapsam para dentro)
- Descer até quadril abaixo dos joelhos (profundidade paralela ou ATG)
- Manter calcanhar no chão
- Subir empurrando o chão, mantendo tronco estável

Erros comuns:
- Joelhos colapsando em valgo
- Calcanhar saindo do chão
- Perda da curvatura lombar (butt wink excessivo)
- Tronco inclinando muito à frente`,
    metadata: {
      source: 'fitness_agachamento',
      category: 'fitness',
      title: 'Técnica de Agachamento',
      author: 'NFC Knowledge Base',
    },
  },
  {
    content: `# Periodização de Treino

A periodização organiza o treino em ciclos para otimizar adaptação e prevenir overtraining.

Modelos principais:

1. Periodização Linear:
- Fase 1: Hipertrofia (12-15 reps, volume alto)
- Fase 2: Força (6-8 reps, intensidade moderada)
- Fase 3: Potência (3-5 reps, intensidade alta)

2. Periodização Ondulatória (DUP):
- Varia estímulo semanalmente ou por sessão
- Segunda: Hipertrofia (12 reps)
- Quarta: Força (6 reps)
- Sexta: Potência (3 reps)

3. Periodização em Blocos:
- Blocos de 3-6 semanas focados em uma qualidade
- Acumulação → Intensificação → Realização

A periodização é essencial para progressão contínua em intermediários/avançados.`,
    metadata: {
      source: 'fitness_periodizacao',
      category: 'fitness',
      title: 'Periodização de Treino',
      author: 'NFC Knowledge Base',
    },
  },
];
