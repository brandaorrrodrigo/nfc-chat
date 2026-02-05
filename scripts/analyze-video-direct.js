/**
 * Script para análise DIRETA de vídeo com Ollama
 * Usa o novo sistema biomecânico estruturado com RAG
 *
 * Uso: node scripts/analyze-video-direct.js <analysisId> [--no-rag]
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const fsPromises = require('fs').promises;
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Configurações
const OLLAMA_URL = 'http://localhost:11434';
const VISION_MODEL = 'llama3.2-vision:latest';
const TEXT_MODEL = 'llama3:8b'; // Preferir modelo menor para velocidade

// RAG Local Config
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
];

// Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase não configurado');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const analysisId = process.argv[2];
const useRAG = !process.argv.includes('--no-rag');

if (!analysisId) {
  console.error('❌ Uso: node scripts/analyze-video-direct.js <analysisId> [--no-rag]');
  process.exit(1);
}

// ============================================================================
// RAG LOCAL FUNCTIONS - Busca em arquivos MD locais
// ============================================================================

const DEVIATION_KEYWORDS = {
  'valgo': ['valgo', 'valgus', 'valgismo', 'colapso medial', 'knee cave', 'joelho para dentro'],
  'varo': ['varo', 'varus', 'varismo'],
  'anteriorização': ['anteriorização', 'forward lean', 'inclinação anterior', 'trunk lean'],
  'cifose': ['cifose', 'kyphosis', 'dorso curvo', 'rounded back'],
  'lordose': ['lordose', 'lordosis', 'hiperlordose', 'anterior pelvic tilt'],
  'joelho': ['joelho', 'knee', 'patela', 'patelar', 'ligamento cruzado', 'LCA'],
  'quadril': ['quadril', 'hip', 'coxofemoral', 'glúteo', 'gluteus'],
  'coluna': ['coluna', 'spine', 'vertebral', 'lombar', 'lumbar'],
  'glúteo': ['glúteo', 'gluteus', 'glute', 'gluteo médio'],
  'agachamento': ['agachamento', 'squat', 'squatting', 'agachar'],
  'tornozelo': ['tornozelo', 'ankle', 'dorsiflexão'],
};

function extractSearchTerms(deviations) {
  const terms = new Set();
  for (const deviation of deviations) {
    const deviationLower = deviation.toLowerCase();
    deviationLower.split(/\s+/).forEach(word => {
      if (word.length > 3) terms.add(word);
    });
    for (const [key, searchTerms] of Object.entries(DEVIATION_KEYWORDS)) {
      if (deviationLower.includes(key)) {
        searchTerms.forEach(term => terms.add(term.toLowerCase()));
      }
    }
  }
  // Sempre incluir termos de agachamento
  DEVIATION_KEYWORDS['agachamento'].forEach(term => terms.add(term.toLowerCase()));
  return Array.from(terms);
}

function searchInFile(filePath, searchTerms, maxChunks = 2) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath, '.md');
    const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 100);

    const scoredParagraphs = [];
    for (const paragraph of paragraphs) {
      const paragraphLower = paragraph.toLowerCase();
      let score = 0;
      for (const term of searchTerms) {
        const regex = new RegExp(term, 'gi');
        const matches = paragraphLower.match(regex);
        if (matches) score += matches.length * (term.length > 5 ? 2 : 1);
      }
      // Bonus para exercícios corretivos
      if (paragraphLower.includes('exercício') || paragraphLower.includes('correção') ||
          paragraphLower.includes('fortalecimento') || paragraphLower.includes('exercise')) {
        score += 3;
      }
      if (score > 2) {
        scoredParagraphs.push({ text: paragraph.substring(0, 800), score });
      }
    }

    return scoredParagraphs
      .sort((a, b) => b.score - a.score)
      .slice(0, maxChunks)
      .map(p => ({
        text: p.text.trim(),
        source: cleanSourceName(fileName),
        relevance: p.score,
      }));
  } catch {
    return [];
  }
}

function cleanSourceName(fileName) {
  let name = fileName.replace(/^\d+-/, '').replace(/[-_]+/g, ' ');
  return name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ').trim();
}

async function searchRAG(deviations) {
  if (!fs.existsSync(CONHECIMENTO_PATH)) {
    console.log(`   ⚠️ Pasta de conhecimento não encontrada: ${CONHECIMENTO_PATH}`);
    return { chunks: [], sources: [] };
  }

  const searchTerms = extractSearchTerms(deviations);
  console.log(`   🔍 Buscando ${searchTerms.length} termos em arquivos MD locais...`);

  const allChunks = [];

  // Buscar em arquivos prioritários
  for (const fileName of BIOMECHANICS_FILES) {
    const filePath = path.join(CONHECIMENTO_PATH, fileName);
    const chunks = searchInFile(filePath, searchTerms, 2);
    allChunks.push(...chunks);
  }

  // Deduplicate e ordenar
  const uniqueChunks = Array.from(new Map(allChunks.map(c => [c.text.substring(0, 100), c])).values());
  const sortedChunks = uniqueChunks.sort((a, b) => b.relevance - a.relevance).slice(0, 10);
  const sources = [...new Set(sortedChunks.map(c => c.source))];

  return { chunks: sortedChunks, sources };
}

function formatChunksForPrompt(chunks) {
  if (chunks.length === 0) return 'Nenhuma referência encontrada na base de conhecimento.';

  return chunks.map((chunk, i) => {
    return `--- Referência ${i + 1} [${chunk.source}] ---\n${chunk.text}`;
  }).join('\n\n');
}

// ============================================================================
// EXTRAÇÃO DE PONTOS CRÍTICOS E RECOMENDAÇÕES
// ============================================================================

const EXERCISE_DATABASE = {
  'valgo': {
    severidade: 'CRITICA',
    exercicios: [
      { nome: 'Clamshell com Banda Elástica', volume: '3x15', frequencia: '5x/semana' },
      { nome: 'Side Plank com Abdução', volume: '3x30s', frequencia: '3x/semana' },
      { nome: 'Monster Walk Lateral', volume: '3x20 passos', frequencia: 'Diário' }
    ],
    ajustes_tecnicos: [
      'Adicionar banda elástica nos joelhos durante agachamento',
      'Reduzir carga em 20-30% e focar em execução',
      'Comando: "Empurra joelhos para FORA"'
    ],
    tempo_correcao: '4-6 semanas'
  },
  'anteriorização': {
    severidade: 'MODERADA',
    exercicios: [
      { nome: 'Alongamento de Panturrilha', volume: '3x30s', frequencia: '2x/dia' },
      { nome: 'Goblet Squat com Pausa', volume: '4x8', frequencia: '3x/semana' }
    ],
    ajustes_tecnicos: [
      'Elevar calcanhares 2-3cm temporariamente',
      'Foco em "sentar para trás"'
    ],
    tempo_correcao: '2-4 semanas'
  },
  'lordose': {
    severidade: 'MODERADA',
    exercicios: [
      { nome: 'Dead Bug', volume: '3x10', frequencia: '4x/semana' },
      { nome: 'Prancha com Retroversão', volume: '3x30s', frequencia: '4x/semana' }
    ],
    ajustes_tecnicos: [
      'Contrair abdômen ANTES de iniciar descida',
      'Imaginar "meter o cóccix para dentro"'
    ],
    tempo_correcao: '3-4 semanas'
  },
  'coluna': {
    severidade: 'MODERADA',
    exercicios: [
      { nome: 'Bird Dog', volume: '3x10 cada lado', frequencia: '4x/semana' },
      { nome: 'McGill Curl-Up', volume: '3x10', frequencia: '4x/semana' }
    ],
    ajustes_tecnicos: [
      'Ativar core antes de qualquer movimento',
      'Manter coluna neutra em todas as fases'
    ],
    tempo_correcao: '4-6 semanas'
  },
  'joelho': {
    severidade: 'MODERADA',
    exercicios: [
      { nome: 'Terminal Knee Extension', volume: '3x15', frequencia: '4x/semana' },
      { nome: 'Step Down Controlado', volume: '3x10 cada lado', frequencia: '3x/semana' }
    ],
    ajustes_tecnicos: [
      'Manter joelhos alinhados com 2º dedo do pé',
      'Evitar bloqueio agressivo no topo'
    ],
    tempo_correcao: '3-5 semanas'
  }
};

function extractCriticalPoints(frameAnalyses) {
  const deviationsMap = new Map();

  for (const frame of frameAnalyses) {
    const desvios = frame.desvios_criticos || [];

    // Adicionar desvios explícitos
    for (const desvio of desvios) {
      const key = desvio.toLowerCase().replace(/[~°\d]/g, '').trim();
      if (!deviationsMap.has(key)) {
        deviationsMap.set(key, { nome: desvio, frames: [], count: 0 });
      }
      const dev = deviationsMap.get(key);
      dev.frames.push(frame.frameNumber);
      dev.count++;
    }

    // Adicionar desvios de alinhamento
    if (frame.alinhamentos?.joelho_esq_valgo || frame.alinhamentos?.joelho_dir_valgo) {
      const key = 'valgo de joelho';
      if (!deviationsMap.has(key)) {
        deviationsMap.set(key, { nome: 'Valgo dinâmico de joelho', frames: [], count: 0 });
      }
      deviationsMap.get(key).frames.push(frame.frameNumber);
      deviationsMap.get(key).count++;
    }

    if (frame.alinhamentos?.coluna_neutra === false) {
      const key = 'perda coluna neutra';
      if (!deviationsMap.has(key)) {
        deviationsMap.set(key, { nome: 'Perda de neutralidade da coluna', frames: [], count: 0 });
      }
      deviationsMap.get(key).frames.push(frame.frameNumber);
      deviationsMap.get(key).count++;
    }

    if (frame.alinhamentos?.joelhos_sobre_pes === false) {
      const key = 'desalinhamento joelhos';
      if (!deviationsMap.has(key)) {
        deviationsMap.set(key, { nome: 'Joelhos desalinhados sobre os pés', frames: [], count: 0 });
      }
      deviationsMap.get(key).frames.push(frame.frameNumber);
      deviationsMap.get(key).count++;
    }
  }

  // Converter para array e classificar severidade
  return Array.from(deviationsMap.values()).map(dev => {
    const frequency = dev.count / frameAnalyses.length;
    return {
      nome: dev.nome,
      severidade: frequency >= 0.6 ? 'CRITICA' : frequency >= 0.3 ? 'MODERADA' : 'LEVE',
      frames_afetados: [...new Set(dev.frames)],
      frequencia: `${(frequency * 100).toFixed(0)}% dos frames`
    };
  }).sort((a, b) => {
    const order = { 'CRITICA': 0, 'MODERADA': 1, 'LEVE': 2 };
    return order[a.severidade] - order[b.severidade];
  });
}

function getRecommendations(desvio) {
  const normalized = desvio.toLowerCase();
  for (const [key, value] of Object.entries(EXERCISE_DATABASE)) {
    if (normalized.includes(key)) {
      return value;
    }
  }
  // Sinônimos
  if (normalized.includes('valgismo') || normalized.includes('colapso medial')) {
    return EXERCISE_DATABASE['valgo'];
  }
  if (normalized.includes('inclinação') || normalized.includes('forward lean')) {
    return EXERCISE_DATABASE['anteriorização'];
  }
  return null;
}

function generateAllRecommendations(pontosCriticos) {
  return pontosCriticos.map(ponto => {
    const rec = getRecommendations(ponto.nome);
    if (!rec) return null;
    return {
      desvio: ponto.nome,
      severidade: ponto.severidade,
      exercicios: rec.exercicios,
      ajustes_tecnicos: rec.ajustes_tecnicos,
      tempo_correcao: rec.tempo_correcao
    };
  }).filter(Boolean);
}

// Estimar fase baseado na posição no vídeo
function estimateFase(frameNumber, totalFrames) {
  const progress = frameNumber / totalFrames;
  if (progress < 0.33) return 'excentrica';
  if (progress < 0.66) return 'isometrica';
  return 'concentrica';
}

// Prompt APRIMORADO para Vision - força medição precisa de ângulos
const VISION_PROMPT = (frameNumber, totalFrames, exerciseType) => {
  const faseEstimada = estimateFase(frameNumber, totalFrames);

  // Ranges esperados por fase
  const rangeInfo = {
    excentrica: { joelho: '120-160°', quadril: '100-140°', tronco: '10-18°', desc: 'DESCIDA - joelhos mais estendidos' },
    isometrica: { joelho: '85-100°', quadril: '75-95°', tronco: '18-25°', desc: 'FUNDO - flexão máxima' },
    concentrica: { joelho: '100-160°', quadril: '90-145°', tronco: '12-20°', desc: 'SUBIDA - estendendo' }
  };

  const range = rangeInfo[faseEstimada];

  return `Você é um GONIÔMETRO HUMANO especializado em biomecânica.

Analise o frame ${frameNumber} de ${totalFrames} de um ${exerciseType}.

CONTEXTO TEMPORAL:
- Este é o frame ${frameNumber} de ${totalFrames}
- Fase provável: ${faseEstimada.toUpperCase()} (${range.desc})
- Ângulos esperados para esta fase: Joelho ${range.joelho}, Quadril ${range.quadril}

INSTRUÇÕES CRÍTICAS DE MEDIÇÃO:
1. MEÇA ângulos com PRECISÃO usando referências anatômicas visíveis
2. Joelho: ângulo entre FÊMUR e TÍBIA (180° = perna reta, 90° = flexão profunda)
3. Quadril: ângulo entre TRONCO e FÊMUR (180° = em pé, 90° = sentado)
4. Tronco: inclinação anterior em relação à vertical (0° = reto, 30° = inclinado)

VARIE OS ÂNGULOS BASEADO NA POSIÇÃO REAL DO CORPO:
- Se corpo está MAIS ALTO → joelhos MAIS estendidos (>120°)
- Se corpo está MAIS BAIXO → joelhos MAIS flexionados (<100°)
- Se está NO FUNDO do agachamento → máxima flexão (85-95°)

Retorne APENAS JSON válido:

{
  "fase": "${faseEstimada}",
  "angulos_aproximados": {
    "joelho_esq_graus": [MEÇA: ${range.joelho} para fase ${faseEstimada}],
    "joelho_dir_graus": [MEÇA: pode variar 2-5° do esquerdo],
    "flexao_quadril_graus": [MEÇA: ${range.quadril} para fase ${faseEstimada}],
    "inclinacao_tronco_graus": [MEÇA: ${range.tronco} para fase ${faseEstimada}]
  },
  "alinhamentos": {
    "joelhos_sobre_pes": true/false,
    "joelho_esq_valgo": true/false [joelho vai para DENTRO?],
    "joelho_dir_valgo": true/false,
    "coluna_neutra": true/false [lordose excessiva?],
    "peso_nos_calcanhares": true/false
  },
  "desvios_criticos": [
    "Seja ESPECÍFICO - ex: 'Valgo de 12° no joelho esquerdo no fundo'",
    "Se NÃO VER desvio claro, retorne array vazio"
  ],
  "score": [5-9 baseado na qualidade técnica VISÍVEL],
  "justificativa": "Descreva O QUE você VÊ neste frame específico - posição, ângulos, desvios"
}

CRÍTICO: Retorne APENAS o JSON. Ângulos DEVEM variar entre frames!`;
};

// Prompt para gerar relatório técnico com Llama 3.1 (COM RAG)
const REPORT_PROMPT_WITH_RAG = (exerciseType, frameAnalyses, scientificContext) => {
  const framesJson = JSON.stringify(frameAnalyses, null, 2);

  return `Você é um biomecânico PhD redigindo um laudo técnico de ${exerciseType}.

DADOS DA ANÁLISE VISUAL (Llama 3.2-Vision):
${framesJson}

REFERÊNCIAS CIENTÍFICAS DISPONÍVEIS:
${scientificContext}

---

REDIJA UM LAUDO TÉCNICO PROFISSIONAL em JSON com esta estrutura EXATA:

{
  "resumo_executivo": "Resumo em 3-4 frases incluindo score, classificação e principais achados",

  "analise_por_fase": {
    "excentrica": {
      "qualidade": "ADEQUADA" | "PARCIALMENTE_ADEQUADA" | "INADEQUADA",
      "angulos_medios": { "joelho": 90, "quadril": 85, "tronco": 15 },
      "observacoes": ["observação 1 com base científica"],
      "citacao_cientifica": "Citação direta de um livro de referência, se disponível"
    },
    "isometrica": { ... mesmo formato ... },
    "concentrica": { ... mesmo formato ... }
  },

  "desvios_identificados": [
    {
      "nome": "Valgo Dinâmico de Joelho",
      "severidade": "CRITICA",
      "descricao_tecnica": "O que foi observado visualmente",
      "fundamentacao_cientifica": "Citação direta: Segundo AUTOR (LIVRO, p. X): 'texto'",
      "mecanismo_lesao": "Por que isso é problemático",
      "causas_provaveis": ["causa 1", "causa 2"],
      "frames_afetados": [1, 2, 3]
    }
  ],

  "recomendacoes_corretivas": [
    {
      "prioridade": 1,
      "desvio_alvo": "Valgo Dinâmico",
      "exercicios": [
        {
          "nome": "Clamshell com Banda",
          "execucao": "Como fazer",
          "volume": "3x15 repetições",
          "frequencia": "5x/semana"
        }
      ],
      "ajustes_tecnicos": ["ajuste 1", "ajuste 2"],
      "progressao_4_semanas": {
        "semana_1_2": "objetivos",
        "semana_3_4": "objetivos"
      }
    }
  ],

  "referencias_cientificas": [
    {
      "autor": "Netter, F.H.",
      "obra": "Atlas de Anatomia Humana",
      "edicao": "7ª Edição",
      "paginas_citadas": [478, 480]
    }
  ],

  "score_geral": 7.5,
  "classificacao": "BOM",
  "proximos_passos": ["Passo 1", "Passo 2"],
  "proxima_avaliacao": "4 semanas"
}

REGRAS IMPORTANTES:
- Use SEMPRE citações diretas dos livros quando disponíveis nas referências
- Priorize evidência científica sobre opinião
- Seja específico com números (ângulos, graus, percentagens)
- Score de 1-10 baseado na média dos frames
- Classificação: >=8 EXCELENTE, >=6 BOM, >=4 REGULAR, <4 NECESSITA_CORRECAO
- RETORNE APENAS O JSON, sem texto antes ou depois`;
};

// Prompt para gerar relatório técnico com Llama 3.1 (SEM RAG)
const REPORT_PROMPT = (exerciseType, frameAnalyses) => {
  const framesJson = JSON.stringify(frameAnalyses, null, 2);

  return `Você é um biomecânico PhD especializado em análise de movimento humano.

Analise os dados de ${frameAnalyses.length} frames de um ${exerciseType} e gere um relatório técnico.

DADOS DOS FRAMES:
${framesJson}

Gere um relatório técnico em JSON com esta estrutura EXATA:

{
  "resumo_executivo": "Resumo em 2-3 frases do desempenho geral",
  "analise_por_fase": {
    "excentrica": {
      "qualidade": "ADEQUADA",
      "observacoes": ["observação 1", "observação 2"],
      "angulos_medios": { "joelho": 90, "quadril": 85, "tronco": 15 }
    },
    "isometrica": {
      "qualidade": "PARCIALMENTE_ADEQUADA",
      "observacoes": ["observação"],
      "angulos_medios": { "joelho": 90, "quadril": 85, "tronco": 15 }
    },
    "concentrica": {
      "qualidade": "ADEQUADA",
      "observacoes": ["observação"],
      "angulos_medios": { "joelho": 90, "quadril": 85, "tronco": 15 }
    }
  },
  "pontos_criticos": [
    {
      "tipo": "ALINHAMENTO",
      "descricao": "Descrição técnica do problema",
      "severidade": "MODERADO",
      "frames_afetados": [1, 2, 3]
    }
  ],
  "recomendacoes_corretivas": [
    {
      "prioridade": 1,
      "categoria": "Força",
      "descricao": "O que fazer para corrigir",
      "exercicio_corretivo": "Nome do exercício específico"
    }
  ],
  "score_geral": 7.5,
  "classificacao": "BOM",
  "proximos_passos": ["Passo 1", "Passo 2"]
}

REGRAS:
- Use os dados reais dos frames para suas conclusões
- Score de 1-10 baseado na média dos frames
- Classificação: >=8 EXCELENTE, >=6 BOM, >=4 REGULAR, <4 NECESSITA_CORRECAO
- Prioridade 1 = mais urgente
- Seja específico nas recomendações
- RETORNE APENAS O JSON, sem texto antes ou depois`;
};

async function main() {
  console.log('🎥 Análise Biomecânica Estruturada com Ollama');
  console.log(`   RAG: ${useRAG ? 'HABILITADO' : 'DESABILITADO'}\n`);
  const startTime = Date.now();

  // 1. Buscar análise no banco
  console.log(`📋 Buscando: ${analysisId}`);
  const { data: analysis, error } = await supabase
    .from('nfc_chat_video_analyses')
    .select('*')
    .eq('id', analysisId)
    .single();

  if (error || !analysis) {
    console.error('❌ Análise não encontrada:', error?.message);
    process.exit(1);
  }

  console.log('   Arena:', analysis.arena_slug);
  console.log('   Padrão:', analysis.movement_pattern);
  console.log('   URL:', analysis.video_url);
  console.log('');

  // 2. Verificar Ollama
  console.log('🤖 Verificando Ollama...');
  let visionModel = null;
  let textModel = null;

  try {
    const { data } = await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 5000 });
    const models = data.models?.map(m => m.name) || [];

    // Modelo de visão
    if (models.includes(VISION_MODEL)) {
      visionModel = VISION_MODEL;
    } else {
      visionModel = models.find(m => m.includes('vision') || m.includes('llava'));
    }

    // Modelo de texto (preferir modelos menores para velocidade)
    if (models.includes(TEXT_MODEL)) {
      textModel = TEXT_MODEL;
    } else if (models.includes('llama3:8b')) {
      textModel = 'llama3:8b';
    } else if (models.includes('llama3:latest')) {
      textModel = 'llama3:latest';
    } else if (models.includes('llama3.1:8b')) {
      textModel = 'llama3.1:8b';
    } else {
      // Fallback: qualquer llama3 que não seja vision nem 70b
      textModel = models.find(m => m.includes('llama3') && !m.includes('vision') && !m.includes('70b'));
    }

    if (!visionModel) {
      console.error('❌ Nenhum modelo de visão encontrado');
      console.log('   Modelos disponíveis:', models.join(', '));
      console.log('   Execute: ollama pull llama3.2-vision');
      process.exit(1);
    }

    console.log('   ✅ Vision:', visionModel);
    console.log('   ✅ Text:', textModel || 'N/A (usará fallback)');
  } catch (err) {
    console.error('❌ Ollama não está rodando:', err.message);
    console.log('   Execute: ollama serve');
    process.exit(1);
  }

  // 3. Criar diretório temporário
  const tempDir = path.join(process.cwd(), 'temp', `analysis_${Date.now()}`);
  await fsPromises.mkdir(tempDir, { recursive: true });
  console.log('📁 Temp dir:', tempDir);

  try {
    // 4. Baixar vídeo
    console.log('\n⬇️  Baixando vídeo...');
    const videoPath = path.join(tempDir, 'video.mp4');

    const videoResponse = await axios.get(analysis.video_url, {
      responseType: 'arraybuffer',
      timeout: 120000,
      onDownloadProgress: (p) => {
        if (p.total) {
          const pct = Math.round((p.loaded / p.total) * 100);
          process.stdout.write(`\r   ${pct}% (${Math.round(p.loaded / 1024)}KB)`);
        }
      }
    });

    await fsPromises.writeFile(videoPath, Buffer.from(videoResponse.data));
    console.log('\n   ✅ Download completo');

    // 5. Verificar ffmpeg
    console.log('\n🎬 Verificando ffmpeg...');
    try {
      await execAsync('ffmpeg -version');
      console.log('   ✅ ffmpeg disponível');
    } catch {
      console.error('❌ ffmpeg não instalado');
      console.log('   Windows: choco install ffmpeg');
      console.log('   Mac: brew install ffmpeg');
      process.exit(1);
    }

    // 6. Extrair frames
    console.log('\n🖼️  Extraindo frames...');
    const framesCount = 6;
    const framePaths = [];

    // Obter duração do vídeo
    const { stdout: durationOut } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`
    );
    const duration = parseFloat(durationOut.trim()) || 10;
    console.log(`   Duração: ${duration.toFixed(1)}s`);

    const interval = duration / (framesCount + 1);

    for (let i = 1; i <= framesCount; i++) {
      const timestamp = interval * i;
      const framePath = path.join(tempDir, `frame_${i}.jpg`);

      await execAsync(
        `ffmpeg -ss ${timestamp} -i "${videoPath}" -vframes 1 -q:v 2 "${framePath}" -y`
      );

      framePaths.push({ path: framePath, timestamp });
      process.stdout.write(`\r   Frame ${i}/${framesCount}`);
    }
    console.log('\n   ✅ Frames extraídos');

    // 7. Analisar cada frame com Ollama Vision (JSON estruturado)
    console.log('\n🔍 Analisando frames com', visionModel, '(JSON estruturado)...');

    const exerciseType = analysis.movement_pattern || 'agachamento';
    const frameAnalyses = [];

    for (let i = 0; i < framePaths.length; i++) {
      process.stdout.write(`\r   Analisando frame ${i + 1}/${framePaths.length}...`);

      const imageBuffer = await fsPromises.readFile(framePaths[i].path);
      const imageBase64 = imageBuffer.toString('base64');

      const prompt = VISION_PROMPT(i + 1, framePaths.length, exerciseType);

      try {
        const response = await axios.post(
          `${OLLAMA_URL}/api/generate`,
          {
            model: visionModel,
            prompt,
            images: [imageBase64],
            stream: false,
            options: { temperature: 0.1, num_predict: 500 },
          },
          { timeout: 120000 }
        );

        const analysisText = response.data.response || '';

        // Extrair JSON
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[0]);
            frameAnalyses.push({
              frameNumber: i + 1,
              timestamp: framePaths[i].timestamp,
              ...validateFrameAnalysis(parsed, i + 1, framePaths.length),
            });
          } catch {
            frameAnalyses.push(createFallbackFrameAnalysis(i + 1, framePaths.length, framePaths[i].timestamp));
          }
        } else {
          frameAnalyses.push(createFallbackFrameAnalysis(i + 1, framePaths.length, framePaths[i].timestamp));
        }

      } catch (err) {
        console.error(`\n   ⚠️ Erro no frame ${i + 1}:`, err.message);
        frameAnalyses.push(createFallbackFrameAnalysis(i + 1, framePaths.length, framePaths[i].timestamp));
      }

      // Delay entre frames
      if (i < framePaths.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log('\n   ✅ Análise de frames completa');

    // 8. Buscar referências científicas com RAG LOCAL (se habilitado)
    let ragChunks = [];
    let ragSources = [];

    if (useRAG && textModel) {
      console.log('\n📚 Buscando referências nos livros locais (RAG)...');

      // Extrair desvios para busca
      const allDeviations = frameAnalyses
        .flatMap(f => f.desvios_criticos || [])
        .filter((v, i, arr) => arr.indexOf(v) === i);

      // Adicionar desvios de alinhamento
      frameAnalyses.forEach(f => {
        if (f.alinhamentos.joelho_esq_valgo || f.alinhamentos.joelho_dir_valgo) {
          allDeviations.push('valgo dinâmico de joelho');
        }
        if (!f.alinhamentos.coluna_neutra) {
          allDeviations.push('perda de neutralidade da coluna');
        }
      });

      const uniqueDeviations = [...new Set(allDeviations)];
      console.log(`   Desvios: ${uniqueDeviations.join(', ') || 'nenhum'}`);

      try {
        const ragResult = await searchRAG(uniqueDeviations);
        ragChunks = ragResult.chunks;
        ragSources = ragResult.sources;
        console.log(`   ✅ ${ragChunks.length} chunks de ${ragSources.length} fontes`);
      } catch (ragErr) {
        console.log('   ⚠️ Erro no RAG:', ragErr.message);
      }
    }

    // 9. Gerar relatório técnico com Llama 3.1
    let report = null;

    if (textModel) {
      const hasRAG = ragChunks.length > 0;
      console.log(`\n📝 Gerando relatório técnico com ${textModel}${hasRAG ? ' + RAG' : ''}...`);

      const scientificContext = hasRAG ? formatChunksForPrompt(ragChunks) : '';
      const reportPrompt = hasRAG
        ? REPORT_PROMPT_WITH_RAG(exerciseType, frameAnalyses, scientificContext)
        : REPORT_PROMPT(exerciseType, frameAnalyses);

      try {
        const response = await axios.post(
          `${OLLAMA_URL}/api/generate`,
          {
            model: textModel,
            prompt: reportPrompt,
            stream: false,
            options: { temperature: 0.3, num_predict: hasRAG ? 4000 : 2000 },
          },
          { timeout: 300000 } // 5 min para RAG
        );

        const responseText = response.data.response || '';
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
          try {
            report = JSON.parse(jsonMatch[0]);
            console.log('   ✅ Relatório gerado');
          } catch {
            console.log('   ⚠️ Erro ao parsear JSON do relatório');
          }
        }
      } catch (err) {
        console.log('   ⚠️ Erro ao gerar relatório:', err.message);
      }
    }

    // 10. Extrair pontos críticos e gerar recomendações
    console.log('\n🎯 Extraindo pontos críticos...');
    const pontosCriticos = extractCriticalPoints(frameAnalyses);
    console.log(`   ✅ ${pontosCriticos.length} pontos críticos identificados`);

    console.log('💪 Gerando recomendações de exercícios...');
    const recomendacoesExercicios = generateAllRecommendations(pontosCriticos);
    console.log(`   ✅ ${recomendacoesExercicios.length} protocolos de exercícios`);

    // 11. Calcular resultado final
    const avgScore = frameAnalyses.reduce((sum, f) => sum + f.score, 0) / frameAnalyses.length;
    const hasRAG = ragChunks.length > 0;

    const getClassificacao = (score) => {
      if (score >= 8) return 'EXCELENTE';
      if (score >= 6) return 'BOM';
      if (score >= 4) return 'REGULAR';
      return 'NECESSITA_CORRECAO';
    };

    const finalResult = {
      analysis_type: hasRAG ? 'biomechanics_structured_rag' : 'biomechanics_structured',
      model_vision: visionModel,
      model_text: textModel || 'fallback',
      rag_enabled: hasRAG,
      rag_chunks_used: ragChunks.length,
      rag_sources: ragSources,
      timestamp: new Date().toISOString(),
      duration_seconds: duration,
      frames_analyzed: frameAnalyses.length,
      exercise_type: exerciseType,

      // Análise frame a frame
      frame_analyses: frameAnalyses.map(f => ({
        frame: f.frameNumber,
        timestamp: `${f.timestamp.toFixed(1)}s`,
        fase: f.fase,
        angulos: f.angulos_aproximados,
        alinhamentos: f.alinhamentos,
        desvios: f.desvios_criticos,
        score: f.score,
        justificativa: f.justificativa,
      })),

      // PONTOS CRÍTICOS EXTRAÍDOS (novo!)
      pontos_criticos: pontosCriticos,

      // RECOMENDAÇÕES DE EXERCÍCIOS (novo!)
      recomendacoes_exercicios: recomendacoesExercicios,

      // Relatório técnico (se gerado pelo LLM)
      report: report ? {
        resumo: report.resumo_executivo,
        analise_por_fase: report.analise_por_fase,
        pontos_criticos: report.pontos_criticos || report.desvios_identificados || pontosCriticos,
        recomendacoes: report.recomendacoes_corretivas || recomendacoesExercicios,
        classificacao: report.classificacao,
        proximos_passos: report.proximos_passos,
        desvios_detalhados: report.desvios_identificados,
        referencias_cientificas: report.referencias_cientificas,
      } : {
        resumo: `Análise de ${exerciseType}: Score médio ${avgScore.toFixed(1)}/10. ${pontosCriticos.length} pontos críticos identificados.`,
        classificacao: getClassificacao(avgScore),
        pontos_criticos: pontosCriticos,
        recomendacoes: recomendacoesExercicios,
      },

      // Scores
      overall_score: report?.score_geral || avgScore,
      frame_scores: frameAnalyses.map(f => f.score),

      // Resumo para UI
      summary: report?.resumo_executivo ||
        `Análise de ${exerciseType}: Score ${avgScore.toFixed(1)}/10. ${pontosCriticos.length} desvios detectados em ${frameAnalyses.length} frames.`,
      recommendations: report?.proximos_passos || recomendacoesExercicios.flatMap(r => r.ajustes_tecnicos).slice(0, 5) || [
        avgScore >= 7 ? 'Boa execução! Continue praticando.' : 'Foque na correção técnica.',
      ],

      // Tempo de processamento
      processing_time_ms: Date.now() - startTime,
    };

    // 12. Salvar no banco
    console.log('\n💾 Salvando resultado...');

    const { error: updateError } = await supabase
      .from('nfc_chat_video_analyses')
      .update({
        ai_analysis: finalResult,
        ai_analyzed_at: new Date().toISOString(),
        ai_confidence: avgScore / 10,
        status: 'AI_ANALYZED',
      })
      .eq('id', analysisId);

    if (updateError) {
      console.error('❌ Erro ao salvar:', updateError.message);
    } else {
      console.log('   ✅ Salvo no banco!');
    }

    // 13. Resultado final
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESULTADO DA ANÁLISE BIOMECÂNICA');
    console.log('='.repeat(60));
    console.log(`   Score Geral: ${(report?.score_geral || avgScore).toFixed(1)}/10`);
    console.log(`   Classificação: ${report?.classificacao || getClassificacao(avgScore)}`);
    console.log(`   Frames: ${frameAnalyses.length}`);
    console.log(`   Pontos Críticos: ${pontosCriticos.length}`);
    console.log(`   Protocolos de Exercícios: ${recomendacoesExercicios.length}`);
    console.log(`   Modelos: Vision=${visionModel}, Text=${textModel || 'N/A'}`);
    console.log(`   RAG: ${hasRAG ? `${ragChunks.length} chunks de ${ragSources.length} fontes` : 'Desabilitado'}`);
    console.log(`   Tempo: ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
    console.log('');

    if (report?.resumo_executivo) {
      console.log('📝 Resumo:');
      console.log(`   ${report.resumo_executivo}`);
      console.log('');
    }

    console.log('📝 Análise por Frame:');
    frameAnalyses.forEach(f => {
      console.log(`   Frame ${f.frameNumber} (${f.timestamp.toFixed(1)}s) [${f.fase}]: ${f.score}/10`);
      console.log(`      Ângulos: Joelho=${f.angulos_aproximados.joelho_esq_graus}°, Quadril=${f.angulos_aproximados.flexao_quadril_graus}°`);
      if (f.desvios_criticos.length > 0) {
        console.log(`      Desvios: ${f.desvios_criticos.join(', ')}`);
      }
      console.log(`      ${f.justificativa}`);
    });

    // PONTOS CRÍTICOS (sempre mostrar - extraídos automaticamente)
    if (pontosCriticos.length > 0) {
      console.log('\n⚠️  PONTOS CRÍTICOS IDENTIFICADOS:');
      pontosCriticos.forEach((p, i) => {
        const severityIcon = p.severidade === 'CRITICA' ? '🔴' : p.severidade === 'MODERADA' ? '🟡' : '🟢';
        console.log(`   ${i + 1}. ${severityIcon} [${p.severidade}] ${p.nome}`);
        console.log(`      Frequência: ${p.frequencia}`);
        console.log(`      Frames afetados: ${p.frames_afetados.join(', ')}`);
      });
    }

    // RECOMENDAÇÕES DE EXERCÍCIOS (sempre mostrar - geradas automaticamente)
    if (recomendacoesExercicios.length > 0) {
      console.log('\n💪 PROTOCOLOS DE EXERCÍCIOS CORRETIVOS:');
      recomendacoesExercicios.forEach((rec, i) => {
        console.log(`\n   ${i + 1}. Para: ${rec.desvio} [${rec.severidade}]`);
        console.log(`      Tempo estimado de correção: ${rec.tempo_correcao}`);
        console.log('      Exercícios:');
        rec.exercicios.forEach(ex => {
          console.log(`         → ${ex.nome}: ${ex.volume}, ${ex.frequencia}`);
        });
        console.log('      Ajustes técnicos:');
        rec.ajustes_tecnicos.forEach(aj => {
          console.log(`         • ${aj}`);
        });
      });
    }

    // Desvios detalhados do relatório LLM (se disponível)
    if (report?.desvios_identificados?.length > 0) {
      console.log('\n📝 Análise Detalhada (LLM):');
      report.desvios_identificados.forEach((d, i) => {
        console.log(`   ${i + 1}. ${d.nome}`);
        if (d.fundamentacao_cientifica) {
          console.log(`      📖 ${d.fundamentacao_cientifica.substring(0, 150)}...`);
        }
      });
    }

    // Referências científicas
    if (report?.referencias_cientificas?.length > 0) {
      console.log('\n📚 Referências Científicas:');
      report.referencias_cientificas.forEach((ref, i) => {
        const pages = ref.paginas_citadas?.length > 0 ? `, p. ${ref.paginas_citadas.join(', ')}` : '';
        console.log(`   ${i + 1}. ${ref.autor} - ${ref.obra}${ref.edicao ? ` (${ref.edicao})` : ''}${pages}`);
      });
    }

    // Fontes RAG
    if (hasRAG && ragSources.length > 0) {
      console.log('\n📖 Fontes consultadas (RAG):');
      ragSources.forEach((source, i) => {
        console.log(`   ${i + 1}. ${source}`);
      });
    }

    console.log('\n' + '='.repeat(60));

  } finally {
    // Limpar temp
    try {
      await fsPromises.rm(tempDir, { recursive: true });
      console.log('\n🧹 Arquivos temporários removidos');
    } catch { }
  }
}

function validateFrameAnalysis(data, frameNumber, totalFrames) {
  const faseDefault = frameNumber <= Math.floor(totalFrames / 3) ? 'excentrica' :
    frameNumber <= Math.floor((totalFrames * 2) / 3) ? 'isometrica' : 'concentrica';

  return {
    fase: data.fase || faseDefault,
    angulos_aproximados: {
      joelho_esq_graus: data.angulos_aproximados?.joelho_esq_graus || 90,
      joelho_dir_graus: data.angulos_aproximados?.joelho_dir_graus || 90,
      flexao_quadril_graus: data.angulos_aproximados?.flexao_quadril_graus || 85,
      inclinacao_tronco_graus: data.angulos_aproximados?.inclinacao_tronco_graus || 15,
    },
    alinhamentos: {
      joelhos_sobre_pes: data.alinhamentos?.joelhos_sobre_pes ?? true,
      joelho_esq_valgo: data.alinhamentos?.joelho_esq_valgo ?? false,
      joelho_dir_valgo: data.alinhamentos?.joelho_dir_valgo ?? false,
      coluna_neutra: data.alinhamentos?.coluna_neutra ?? true,
      peso_nos_calcanhares: data.alinhamentos?.peso_nos_calcanhares ?? true,
    },
    desvios_criticos: Array.isArray(data.desvios_criticos) ? data.desvios_criticos : [],
    score: typeof data.score === 'number' ? Math.min(10, Math.max(1, data.score)) : 7,
    justificativa: data.justificativa || 'Análise automática',
  };
}

function createFallbackFrameAnalysis(frameNumber, totalFrames, timestamp) {
  const fase = frameNumber <= Math.floor(totalFrames / 3) ? 'excentrica' :
    frameNumber <= Math.floor((totalFrames * 2) / 3) ? 'isometrica' : 'concentrica';

  return {
    frameNumber,
    timestamp,
    fase,
    angulos_aproximados: {
      joelho_esq_graus: 90,
      joelho_dir_graus: 90,
      flexao_quadril_graus: 85,
      inclinacao_tronco_graus: 15,
    },
    alinhamentos: {
      joelhos_sobre_pes: true,
      joelho_esq_valgo: false,
      joelho_dir_valgo: false,
      coluna_neutra: true,
      peso_nos_calcanhares: true,
    },
    desvios_criticos: [],
    score: 7,
    justificativa: 'Análise não conclusiva - revisar manualmente',
  };
}

main().catch(err => {
  console.error('❌ Erro fatal:', err);
  process.exit(1);
});
