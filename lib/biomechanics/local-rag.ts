/**
 * Local RAG Service - Busca em arquivos MD locais
 * Não precisa de Pinecone nem OpenAI
 */

import * as fs from 'fs';
import * as path from 'path';

// Caminho para a pasta de conhecimento
const CONHECIMENTO_PATH = process.env.CONHECIMENTO_PATH || 'D:\\NUTRIFITCOACH_MASTER\\conhecimento';

// Arquivos prioritários para biomecânica
const BIOMECHANICS_FILES = [
  '582000800-BIOMECANICA-E-AVALIACAO-POSTURAL.md',
  'Bases Biomecanicas do Movimento Humano.md',
  'Aaron Horschig - The Squat Bible_ The Ultimate Guide to Mastering the Squat and Finding your True St.md',
  'Chad Wesley Smith - Squat manual.md',
  'Charles-Poliquin-The-Ultimate-Guide-to-Squatting_-Strength-Sensei-on-the-King-of-Lifts-_1_.md',
  'Carol A. Oatis - Cinesiologia_ A mecânica e a patomecânica do movimento humano-Manole (2014).md',
  '209437942-Exame-Fisico-Ortopedico.md',
  '729427629-Applied-Kinesiology.md',
  '739712076-Manual-of-Structural-Kinesiology.md',
  '834321029-E-BOOK-A-BIOMECANICA-DOS-EQUIPAMENTOS-DE-MUSCULACAO.md',
  'Anatomia Palpatória e Funcional.md',
  'Blandine Calais-Germain_ Andrée Lamotte - Anatomia para o Movimento_ Introdução à Análise das Técnic.md',
  'Arnold G. Nelson_ Jouko Kokkonen - Anatomia do Alongamento. 1-Manole (2007).md',
];

export interface LocalRAGChunk {
  text: string;
  source: string;
  relevance: number;
}

export interface LocalRAGResult {
  chunks: LocalRAGChunk[];
  sources: string[];
  totalChunks: number;
}

// Mapeamento de desvios para termos de busca
const DEVIATION_SEARCH_TERMS: Record<string, string[]> = {
  'valgo': ['valgo', 'valgus', 'valgismo', 'colapso medial', 'medial collapse', 'knee cave', 'joelho para dentro'],
  'varo': ['varo', 'varus', 'varismo', 'lateral'],
  'anteriorização': ['anteriorização', 'forward lean', 'inclinação anterior', 'trunk lean', 'tronco inclinado'],
  'cifose': ['cifose', 'kyphosis', 'cifótica', 'dorso curvo', 'rounded back'],
  'lordose': ['lordose', 'lordosis', 'hiperlordose', 'anterior pelvic tilt'],
  'joelho': ['joelho', 'knee', 'patela', 'patelar', 'tibiofemoral', 'ligamento cruzado', 'LCA', 'ACL'],
  'quadril': ['quadril', 'hip', 'coxofemoral', 'glúteo', 'gluteus', 'abdutores'],
  'agachamento': ['agachamento', 'squat', 'squatting', 'agachar'],
  'coluna': ['coluna', 'spine', 'vertebral', 'lombar', 'lumbar', 'torácica', 'thoracic'],
  'glúteo': ['glúteo', 'gluteus', 'glute', 'gluteo médio', 'glute medius'],
  'tornozelo': ['tornozelo', 'ankle', 'dorsiflexão', 'dorsiflexion'],
  'alinhamento': ['alinhamento', 'alignment', 'postura', 'posture'],
};

/**
 * Extrai termos de busca a partir dos desvios detectados
 */
function extractSearchTerms(deviations: string[]): string[] {
  const terms: Set<string> = new Set();

  for (const deviation of deviations) {
    const deviationLower = deviation.toLowerCase();

    // Adicionar termos do desvio original
    const words = deviationLower.split(/\s+/);
    words.forEach(word => {
      if (word.length > 3) terms.add(word);
    });

    // Adicionar termos mapeados
    for (const [key, searchTerms] of Object.entries(DEVIATION_SEARCH_TERMS)) {
      if (deviationLower.includes(key)) {
        searchTerms.forEach(term => terms.add(term.toLowerCase()));
      }
    }
  }

  // Sempre incluir termos de agachamento para contexto
  DEVIATION_SEARCH_TERMS['agachamento'].forEach(term => terms.add(term.toLowerCase()));

  return Array.from(terms);
}

/**
 * Busca trechos relevantes em um arquivo MD
 */
function searchInFile(filePath: string, searchTerms: string[], maxChunks: number = 3): LocalRAGChunk[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath, '.md');

    // Dividir em parágrafos/seções
    const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 100);

    const scoredParagraphs: Array<{ text: string; score: number }> = [];

    for (const paragraph of paragraphs) {
      const paragraphLower = paragraph.toLowerCase();
      let score = 0;

      // Calcular relevância baseado em termos encontrados
      for (const term of searchTerms) {
        const regex = new RegExp(term, 'gi');
        const matches = paragraphLower.match(regex);
        if (matches) {
          score += matches.length * (term.length > 5 ? 2 : 1);
        }
      }

      // Bonus para parágrafos que mencionam exercícios corretivos
      if (paragraphLower.includes('exercício') || paragraphLower.includes('exercise') ||
          paragraphLower.includes('correção') || paragraphLower.includes('correction') ||
          paragraphLower.includes('fortalecimento') || paragraphLower.includes('strengthening')) {
        score += 3;
      }

      if (score > 2) {
        scoredParagraphs.push({
          text: paragraph.substring(0, 800), // Limitar tamanho
          score,
        });
      }
    }

    // Ordenar por relevância e pegar os melhores
    return scoredParagraphs
      .sort((a, b) => b.score - a.score)
      .slice(0, maxChunks)
      .map(p => ({
        text: p.text.trim(),
        source: cleanSourceName(fileName),
        relevance: p.score,
      }));

  } catch (error) {
    // Arquivo não encontrado ou erro de leitura
    return [];
  }
}

/**
 * Limpa nome do arquivo para exibição
 */
function cleanSourceName(fileName: string): string {
  // Remover números do início
  let name = fileName.replace(/^\d+-/, '');

  // Remover underscores e hífens extras
  name = name.replace(/[-_]+/g, ' ');

  // Capitalizar
  name = name.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return name.trim();
}

/**
 * Busca conhecimento local sobre biomecânica
 */
export async function searchLocalKnowledge(
  deviations: string[],
  options: { maxChunksPerFile?: number; maxTotalChunks?: number } = {}
): Promise<LocalRAGResult> {
  const { maxChunksPerFile = 2, maxTotalChunks = 10 } = options;

  // Verificar se pasta existe
  if (!fs.existsSync(CONHECIMENTO_PATH)) {
    console.warn(`⚠️ Pasta de conhecimento não encontrada: ${CONHECIMENTO_PATH}`);
    return { chunks: [], sources: [], totalChunks: 0 };
  }

  const searchTerms = extractSearchTerms(deviations);
  console.log(`🔍 RAG Local: Buscando ${searchTerms.length} termos em ${BIOMECHANICS_FILES.length} arquivos`);

  const allChunks: LocalRAGChunk[] = [];

  // Buscar em arquivos prioritários
  for (const fileName of BIOMECHANICS_FILES) {
    const filePath = path.join(CONHECIMENTO_PATH, fileName);
    const chunks = searchInFile(filePath, searchTerms, maxChunksPerFile);
    allChunks.push(...chunks);
  }

  // Se não encontrou muito, buscar em outros arquivos MD
  if (allChunks.length < 5) {
    try {
      const allFiles = fs.readdirSync(CONHECIMENTO_PATH)
        .filter(f => f.endsWith('.md') && !BIOMECHANICS_FILES.includes(f));

      for (const fileName of allFiles.slice(0, 20)) {
        const filePath = path.join(CONHECIMENTO_PATH, fileName);
        const chunks = searchInFile(filePath, searchTerms, 1);
        allChunks.push(...chunks);

        if (allChunks.length >= maxTotalChunks * 2) break;
      }
    } catch (error) {
      // Ignorar erro de leitura de diretório
    }
  }

  // Deduplicate e ordenar por relevância
  const uniqueChunks = Array.from(
    new Map(allChunks.map(c => [c.text.substring(0, 100), c])).values()
  );

  const sortedChunks = uniqueChunks
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, maxTotalChunks);

  const sources = [...new Set(sortedChunks.map(c => c.source))];

  console.log(`📚 RAG Local: ${sortedChunks.length} chunks de ${sources.length} fontes`);

  return {
    chunks: sortedChunks,
    sources,
    totalChunks: sortedChunks.length,
  };
}

/**
 * Formata chunks para incluir no prompt
 */
export function formatLocalChunksForPrompt(chunks: LocalRAGChunk[]): string {
  if (chunks.length === 0) {
    return 'Nenhuma referência encontrada na base de conhecimento local.';
  }

  return chunks
    .map((chunk, i) => `--- Referência ${i + 1} [${chunk.source}] ---
${chunk.text}`)
    .join('\n\n');
}

/**
 * Verifica se RAG local está disponível
 */
export function checkLocalRAGAvailability(): { available: boolean; path: string; filesFound: number } {
  if (!fs.existsSync(CONHECIMENTO_PATH)) {
    return { available: false, path: CONHECIMENTO_PATH, filesFound: 0 };
  }

  try {
    const files = fs.readdirSync(CONHECIMENTO_PATH).filter(f => f.endsWith('.md'));
    return {
      available: files.length > 0,
      path: CONHECIMENTO_PATH,
      filesFound: files.length,
    };
  } catch {
    return { available: false, path: CONHECIMENTO_PATH, filesFound: 0 };
  }
}
