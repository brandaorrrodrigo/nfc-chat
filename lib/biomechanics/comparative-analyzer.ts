/**
 * Analisador Comparativo de Biomecânica
 * Compara frames do usuário com padrões de referência (ouro + ruins)
 */

import {
  getGoldStandard,
  getBadPatterns,
  loadPatternFrames,
  checkReferenceFramesExist,
  getExpectedAngles,
  type ReferencePattern
} from './reference-patterns'

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434'
const VISION_MODEL = 'llama3.2-vision:latest'

export interface ComparativeFrameResult {
  frame_numero: number
  timestamp: string
  similaridade_com_padrao_ouro: number
  similaridade_com_valgo: number
  similaridade_com_anterorizacao: number
  desvios_observados: string[]
  aspectos_positivos: string[]
  angulos_estimados: {
    joelho_esquerdo: number
    joelho_direito: number
    flexao_quadril: number
    inclinacao_tronco: number
  }
  angulos_referencia: {
    joelho_esquerdo: number
    joelho_direito: number
    flexao_quadril: number
    inclinacao_tronco: number
  }
  score: number
  score_ajustado: number
  justificativa: string
  metodo: string
}

export interface ComparativeAnalysisResult {
  score: number
  classification: string
  similaridade_padrao_ouro: number
  frames_analyzed: number
  comparative_analysis: ComparativeFrameResult[]
  pontos_criticos: Array<{
    tipo: string
    nome: string
    severidade: string
    frames_afetados: string
    frequencia: string
  }>
  references_used: {
    gold_standard: boolean
    valgo_pattern: boolean
    anterorizacao_pattern: boolean
    lordose_pattern: boolean
  }
  metodo: string
  timestamp: string
}

async function ollamaVisionChat(images: string[], prompt: string) {
  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: VISION_MODEL,
      messages: [{
        role: 'user',
        content: prompt,
        images
      }],
      stream: false,
      options: {
        temperature: 0.2,
        top_p: 0.85,
        seed: 42
      }
    })
  })

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status}`)
  }

  return response.json()
}

/**
 * Analisa um frame comparativamente com padrões de referência
 */
export async function analyzeFrameComparative(
  userFrameBase64: string,
  frameNumber: number,
  totalFrames: number,
  goldFrames: string[],
  valgoFrames: string[],
  anteroFrames: string[],
  goldStandard: ReferencePattern,
  videoDuration: number = 3
): Promise<ComparativeFrameResult> {

  console.log(`  🔍 Análise comparativa frame ${frameNumber}/${totalFrames}...`)

  const frameIndex = frameNumber - 1
  const goldFrame = goldFrames[frameIndex] || null
  const valgoFrame = valgoFrames[frameIndex] || null
  const anteroFrame = anteroFrames[frameIndex] || null

  // Ângulos de referência do padrão ouro
  const angRefOuro = getExpectedAngles(goldStandard, frameIndex)

  // Montar lista de imagens e prompt dinâmico
  const images: string[] = [userFrameBase64]
  let imageDescriptions = '1. **FRAME DO USUÁRIO** (analisar este)'

  if (goldFrame) {
    images.push(goldFrame)
    imageDescriptions += '\n2. **PADRÃO OURO** (execução perfeita - referência positiva)'
  }

  let imgIndex = images.length + 1
  if (valgoFrame) {
    images.push(valgoFrame)
    imageDescriptions += `\n${imgIndex}. **PADRÃO RUIM - Valgo Dinâmico** (erro comum - joelhos para dentro)`
    imgIndex++
  }
  if (anteroFrame) {
    images.push(anteroFrame)
    imageDescriptions += `\n${imgIndex}. **PADRÃO RUIM - Anteriorização** (erro comum - tronco muito inclinado)`
  }

  const prompt = `
Você é um biomecânico especializado comparando execuções de agachamento.

Você recebeu ${images.length} imagens nesta ORDEM:
${imageDescriptions}

TAREFA:
Compare VISUALMENTE o frame do usuário com as referências.
MEÇA ângulos reais, NÃO copie valores de exemplo.

Retorne APENAS este JSON (sem texto adicional):

{
  "similaridade_com_padrao_ouro": 0-100,
  "similaridade_com_valgo": 0-100,
  "similaridade_com_anterorizacao": 0-100,
  "desvios_observados": [
    "Liste APENAS desvios VISUALMENTE ÓBVIOS vs padrão ouro"
  ],
  "aspectos_positivos": [
    "O que está IGUAL ou MELHOR que o padrão ouro"
  ],
  "angulos_estimados": {
    "joelho_esquerdo": numero,
    "joelho_direito": numero,
    "flexao_quadril": numero,
    "inclinacao_tronco": numero
  },
  "score": 0-10,
  "justificativa": "Baseado na comparação visual com as referências"
}
`.trim()

  try {
    const response = await ollamaVisionChat(images, prompt)
    const content = response.message?.content || ''
    const jsonMatch = content.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      throw new Error('Vision não retornou JSON válido')
    }

    const analysis = JSON.parse(jsonMatch[0])

    // Calcular score ajustado
    const scoreAjustado = calculateComparativeScore(analysis)

    return {
      frame_numero: frameNumber,
      timestamp: `${((frameNumber - 1) * (videoDuration / totalFrames)).toFixed(1)}s`,
      similaridade_com_padrao_ouro: analysis.similaridade_com_padrao_ouro || 0,
      similaridade_com_valgo: analysis.similaridade_com_valgo || 0,
      similaridade_com_anterorizacao: analysis.similaridade_com_anterorizacao || 0,
      desvios_observados: analysis.desvios_observados || [],
      aspectos_positivos: analysis.aspectos_positivos || [],
      angulos_estimados: analysis.angulos_estimados || { joelho_esquerdo: 0, joelho_direito: 0, flexao_quadril: 0, inclinacao_tronco: 0 },
      angulos_referencia: angRefOuro,
      score: analysis.score || 0,
      score_ajustado: scoreAjustado,
      justificativa: analysis.justificativa || '',
      metodo: goldFrame ? 'comparative_with_references' : 'standalone_vision'
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error(`  ❌ Frame ${frameNumber}: ${msg}`)

    return {
      frame_numero: frameNumber,
      timestamp: `${((frameNumber - 1) * (videoDuration / totalFrames)).toFixed(1)}s`,
      similaridade_com_padrao_ouro: 0,
      similaridade_com_valgo: 0,
      similaridade_com_anterorizacao: 0,
      desvios_observados: [],
      aspectos_positivos: [],
      angulos_estimados: { joelho_esquerdo: 0, joelho_direito: 0, flexao_quadril: 0, inclinacao_tronco: 0 },
      angulos_referencia: angRefOuro,
      score: 0,
      score_ajustado: 0,
      justificativa: `Erro na análise: ${msg}`,
      metodo: 'error_fallback'
    }
  }
}

function calculateComparativeScore(analysis: {
  similaridade_com_padrao_ouro?: number
  similaridade_com_valgo?: number
  similaridade_com_anterorizacao?: number
  score?: number
}): number {
  const simOuro = analysis.similaridade_com_padrao_ouro || 0
  const simValgo = analysis.similaridade_com_valgo || 0
  const simAntero = analysis.similaridade_com_anterorizacao || 0

  // Fórmula: proximidade ao ouro bonifica, proximidade aos ruins penaliza
  const scoreBase = (simOuro / 100) * 10
  const penalidade = ((simValgo + simAntero) / 200) * 4

  const scoreFinal = Math.max(0, Math.min(10, scoreBase - penalidade))
  return Math.round(scoreFinal * 10) / 10
}

/**
 * Pipeline completo de análise comparativa
 */
export async function runComparativeAnalysis(
  userFramesBase64: string[],
  videoDuration: number = 3
): Promise<ComparativeAnalysisResult> {

  console.log('\n📊 ANÁLISE COMPARATIVA COM PADRÕES DE REFERÊNCIA')
  console.log('='.repeat(50))

  // 1. Carregar padrões
  const goldStandard = getGoldStandard()
  const badPatterns = getBadPatterns()

  const valgoPattern = badPatterns.find(p => p.tipo_desvio === 'valgo_joelho')
  const anteroPattern = badPatterns.find(p => p.tipo_desvio === 'anterorizacao_tronco')

  // 2. Verificar disponibilidade de frames de referência
  const goldCheck = checkReferenceFramesExist(goldStandard)
  const valgoCheck = valgoPattern ? checkReferenceFramesExist(valgoPattern) : { available: false, found: [], missing: [] }
  const anteroCheck = anteroPattern ? checkReferenceFramesExist(anteroPattern) : { available: false, found: [], missing: [] }

  console.log(`  Padrão Ouro: ${goldCheck.available ? '✅' : '⚠️ sem frames'} (${goldCheck.found.length}/${goldStandard.frames.length})`)
  console.log(`  Valgo: ${valgoCheck.available ? '✅' : '⚠️ sem frames'} (${valgoCheck.found.length}/${valgoPattern?.frames.length || 0})`)
  console.log(`  Anteriorização: ${anteroCheck.available ? '✅' : '⚠️ sem frames'} (${anteroCheck.found.length}/${anteroPattern?.frames.length || 0})`)

  // 3. Carregar frames disponíveis
  const goldFrames = goldCheck.available ? loadPatternFrames(goldStandard) : []
  const valgoFrames = valgoCheck.available && valgoPattern ? loadPatternFrames(valgoPattern) : []
  const anteroFrames = anteroCheck.available && anteroPattern ? loadPatternFrames(anteroPattern!) : []

  if (goldFrames.length === 0) {
    console.warn('\n  ⚠️ Sem padrão ouro disponível - análise será standalone')
    console.warn('  💡 Adicione vídeos em public/references/ouro/ e rode:')
    console.warn('     node scripts/extract-reference-frames.js\n')
  }

  // 4. Analisar cada frame
  const results: ComparativeFrameResult[] = []

  for (let i = 0; i < userFramesBase64.length; i++) {
    const result = await analyzeFrameComparative(
      userFramesBase64[i],
      i + 1,
      userFramesBase64.length,
      goldFrames,
      valgoFrames,
      anteroFrames,
      goldStandard,
      videoDuration
    )
    results.push(result)
  }

  // 5. Calcular score médio
  const validScores = results.map(f => f.score_ajustado).filter(s => s > 0)
  const avgScore = validScores.length > 0
    ? validScores.reduce((a, b) => a + b, 0) / validScores.length
    : (results.map(f => f.score).filter(s => s > 0).reduce((a, b) => a + b, 0) / Math.max(results.length, 1))

  // 6. Similaridade média com ouro
  const simOuroMedia = results.reduce((sum, f) => sum + f.similaridade_com_padrao_ouro, 0) / Math.max(results.length, 1)

  // 7. Identificar desvios por frequência
  const desviosMap = new Map<string, number>()

  for (const frame of results) {
    if (frame.similaridade_com_valgo > 40) {
      desviosMap.set('valgo_joelho', (desviosMap.get('valgo_joelho') || 0) + 1)
    }
    if (frame.similaridade_com_anterorizacao > 40) {
      desviosMap.set('anterorizacao_tronco', (desviosMap.get('anterorizacao_tronco') || 0) + 1)
    }

    // Também considerar desvios observados textualmente
    for (const desvio of frame.desvios_observados) {
      const lower = desvio.toLowerCase()
      if (lower.includes('valgo') || lower.includes('joelho')) {
        desviosMap.set('valgo_joelho', (desviosMap.get('valgo_joelho') || 0) + 1)
      }
      if (lower.includes('tronco') || lower.includes('anterior') || lower.includes('inclin')) {
        desviosMap.set('anterorizacao_tronco', (desviosMap.get('anterorizacao_tronco') || 0) + 1)
      }
      if (lower.includes('lordose') || lower.includes('lombar') || lower.includes('butt wink')) {
        desviosMap.set('lordose_lombar', (desviosMap.get('lordose_lombar') || 0) + 1)
      }
    }
  }

  // 8. Pontos críticos
  const nomesDesvio: Record<string, string> = {
    'valgo_joelho': 'Valgo Dinâmico de Joelho',
    'anterorizacao_tronco': 'Anteriorização Excessiva do Tronco',
    'lordose_lombar': 'Hiperextensão Lombar (Butt Wink)'
  }

  const pontosCriticos = Array.from(desviosMap.entries())
    .filter(([, count]) => count > 0)
    .map(([tipo, count]) => {
      const frequency = count / userFramesBase64.length
      return {
        tipo,
        nome: nomesDesvio[tipo] || tipo,
        severidade: frequency >= 0.6 ? 'CRITICA' : frequency >= 0.3 ? 'MODERADA' : 'LEVE',
        frames_afetados: `${count}/${userFramesBase64.length}`,
        frequencia: `${(frequency * 100).toFixed(0)}%`
      }
    })
    .sort((a, b) => {
      const order: Record<string, number> = { 'CRITICA': 0, 'MODERADA': 1, 'LEVE': 2 }
      return (order[a.severidade] || 3) - (order[b.severidade] || 3)
    })

  // 9. Classificação
  const roundedScore = Math.round(avgScore * 10) / 10
  let classification: string
  if (roundedScore >= 9) classification = 'EXCELENTE'
  else if (roundedScore >= 7.5) classification = 'BOM'
  else if (roundedScore >= 6) classification = 'REGULAR'
  else classification = 'NECESSITA_CORREÇÃO'

  return {
    score: roundedScore,
    classification,
    similaridade_padrao_ouro: Math.round(simOuroMedia),
    frames_analyzed: userFramesBase64.length,
    comparative_analysis: results,
    pontos_criticos,
    references_used: {
      gold_standard: goldFrames.length > 0,
      valgo_pattern: valgoFrames.length > 0,
      anterorizacao_pattern: anteroFrames.length > 0,
      lordose_pattern: false // Ainda não implementado
    },
    metodo: goldFrames.length > 0 ? 'comparative_with_gold_standard' : 'standalone_vision',
    timestamp: new Date().toISOString()
  }
}
