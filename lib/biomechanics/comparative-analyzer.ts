/**
 * Analisador Comparativo de Biomecânica
 * Estratégia: modelo Vision mede ângulos, código calcula similaridades
 * com base nos ângulos de referência do padrão ouro
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

/**
 * Chama Ollama Vision para medir ângulos em 1 imagem
 */
async function measureAnglesWithVision(imageBase64: string, frameNumber: number, totalFrames: number): Promise<{
  knee_l: number
  knee_r: number
  hip: number
  trunk: number
  valgus: boolean
  forward_lean: boolean
  score: number
}> {
  const phase = frameNumber <= Math.ceil(totalFrames / 3) ? 'eccentric' :
    frameNumber <= Math.ceil((totalFrames * 2) / 3) ? 'bottom' : 'concentric'

  // Ranges esperados por fase (mesmo approach do analyze-video-direct.js que funciona)
  const ranges: Record<string, { knee: string; hip: string; trunk: string; desc: string }> = {
    eccentric: { knee: '120-160', hip: '100-140', trunk: '10-18', desc: 'DESCENDING - knees more extended' },
    bottom: { knee: '85-100', hip: '75-95', trunk: '18-25', desc: 'BOTTOM - maximum flexion' },
    concentric: { knee: '100-160', hip: '90-145', trunk: '12-20', desc: 'ASCENDING - extending' }
  }
  const r = ranges[phase]

  const prompt = `You are a HUMAN GONIOMETER. Analyze squat frame ${frameNumber}/${totalFrames}.

Phase: ${phase.toUpperCase()} (${r.desc})
Expected ranges: Knee ${r.knee}deg, Hip ${r.hip}deg, Trunk ${r.trunk}deg

MEASURE using anatomical landmarks:
- Knee: angle femur-tibia (180=straight, 90=parallel)
- Hip: torso-femur angle (180=standing, 90=seated)
- Trunk: lean from vertical (0=upright, 30=leaned)

VARY angles based on ACTUAL body position visible!

Return JSON: {"knee_l":0,"knee_r":0,"hip":0,"trunk":0,"score":7}`

  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: VISION_MODEL,
      prompt,
      images: [imageBase64],
      format: 'json',
      stream: false,
      options: { temperature: 0.1, num_predict: 300 }
    })
  })

  if (!response.ok) {
    const errText = await response.text().catch(() => '')
    throw new Error(`Ollama ${response.status}: ${errText.substring(0, 100)}`)
  }

  const data = await response.json()
  const content = (data.response || '').trim()
  const jsonMatch = content.replace(/```json\s*/gi, '').replace(/```/g, '').match(/\{[\s\S]*\}/)

  if (!jsonMatch) {
    throw new Error(`Sem JSON: ${content.substring(0, 100)}`)
  }

  const parsed = JSON.parse(jsonMatch[0])
  const keys = Object.keys(parsed)

  // Busca flexível de chaves
  const findNum = (candidates: string[], def: number): number => {
    for (const c of candidates) {
      if (parsed[c] !== undefined) {
        const n = Number(parsed[c])
        if (!isNaN(n)) return n
      }
    }
    // Busca parcial
    for (const k of keys) {
      for (const c of candidates) {
        if (k.includes(c) || c.includes(k)) {
          const n = Number(parsed[k])
          if (!isNaN(n) && n > 0) return n
        }
      }
    }
    return def
  }

  const knee_l = findNum(['knee_l', 'kne_l', 'left_knee', 'knee'], 0)
  const knee_r_raw = findNum(['knee_r', 'kne_r', 'right_knee'], 0)

  return {
    knee_l,
    knee_r: knee_r_raw > 0 ? knee_r_raw : knee_l,
    hip: findNum(['hip', 'hip_flexion'], 0),
    trunk: findNum(['trunk', 'trn', 'tr', 'trunk_lean'], 0),
    // Valgus e forward lean calculados pelo código, não pelo modelo
    valgus: Math.abs(knee_l - (knee_r_raw > 0 ? knee_r_raw : knee_l)) > 10,
    forward_lean: findNum(['trunk', 'trn', 'tr', 'trunk_lean'], 0) > 25,
    score: findNum(['score', 'quality'], 5)
  }
}

/**
 * Calcula similaridade com padrão ouro baseado em diferença angular
 * 100% = idêntico, 0% = diferença >= maxDiff
 */
function calcSimilarity(measured: number, reference: number, maxDiff: number = 40): number {
  if (measured === 0) return 0 // Sem medição
  const diff = Math.abs(measured - reference)
  return Math.max(0, Math.min(100, Math.round(100 - (diff / maxDiff) * 100)))
}

/**
 * Analisa um frame comparativamente com padrões de referência
 */
export async function analyzeFrameComparative(
  userFrameBase64: string,
  frameNumber: number,
  totalFrames: number,
  goldFrames: string[],
  _valgoFrames: string[],
  _anteroFrames: string[],
  goldStandard: ReferencePattern,
  videoDuration: number = 3
): Promise<ComparativeFrameResult> {

  console.log(`  🔍 Análise comparativa frame ${frameNumber}/${totalFrames}...`)

  const frameIndex = frameNumber - 1
  const angRefOuro = getExpectedAngles(goldStandard, frameIndex)
  const hasGoldRef = goldFrames.length > 0

  try {
    // Tentar medir ângulos até 2 vezes
    let angles: Awaited<ReturnType<typeof measureAnglesWithVision>> | null = null

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        angles = await measureAnglesWithVision(userFrameBase64, frameNumber, totalFrames)
        if (angles.knee_l > 0 || angles.hip > 0) break // Tem dados válidos
        if (attempt < 2) console.log(`  ⚠️ Frame ${frameNumber}: ângulos zerados, tentando novamente...`)
      } catch (err) {
        if (attempt < 2) {
          const msg = err instanceof Error ? err.message : String(err)
          console.log(`  ⚠️ Frame ${frameNumber}: ${msg}, tentando novamente...`)
        } else {
          throw err
        }
      }
    }

    if (!angles) {
      throw new Error('Falha após 2 tentativas')
    }

    // Se knee_r = 0, usar knee_l
    if (angles.knee_r === 0 && angles.knee_l > 0) angles.knee_r = angles.knee_l

    // CALCULAR SIMILARIDADES PROGRAMATICAMENTE
    const simKnee = calcSimilarity(angles.knee_l, angRefOuro.joelho_esquerdo)
    const simHip = calcSimilarity(angles.hip, angRefOuro.flexao_quadril)
    const simTrunk = calcSimilarity(angles.trunk, angRefOuro.inclinacao_tronco, 20)

    // Similaridade geral com ouro (ponderada)
    const simOuro = angles.knee_l > 0
      ? Math.round(simKnee * 0.4 + simHip * 0.35 + simTrunk * 0.25)
      : 0

    // Similaridade com valgo (baseado em detecção + diferença angular)
    const simValgo = angles.valgus ? 70 : (Math.abs(angles.knee_l - angles.knee_r) > 10 ? 40 : 10)

    // Similaridade com anteriorização (baseado em inclinação)
    const simAntero = angles.trunk > 25 ? 70 : angles.trunk > 18 ? 40 : angles.trunk > 10 ? 15 : 5

    // Detectar desvios automaticamente
    const desvios: string[] = []
    const positivos: string[] = []

    if (angles.valgus) desvios.push('Valgo dinâmico de joelho detectado')
    if (angles.forward_lean || angles.trunk > 25) desvios.push(`Anteriorização do tronco (${angles.trunk}°)`)
    if (simKnee < 50 && angles.knee_l > 0) desvios.push(`Joelho ${angles.knee_l}° vs referência ${angRefOuro.joelho_esquerdo}°`)
    if (simHip < 50 && angles.hip > 0) desvios.push(`Quadril ${angles.hip}° vs referência ${angRefOuro.flexao_quadril}°`)

    if (simOuro >= 70) positivos.push('Execução próxima ao padrão ouro')
    if (!angles.valgus && Math.abs(angles.knee_l - angles.knee_r) <= 5) positivos.push('Bom alinhamento bilateral')
    if (angles.trunk > 0 && angles.trunk <= 18) positivos.push('Tronco bem posicionado')
    if (simKnee >= 80) positivos.push('Flexão de joelho adequada')

    // Score ajustado pela comparação com referência
    const scoreAjustado = Math.max(0, Math.min(10,
      Math.round(((simOuro / 100) * 10 - (simValgo > 40 ? 1.5 : 0) - (simAntero > 40 ? 1 : 0)) * 10) / 10
    ))

    console.log(`    📐 Joelho=${angles.knee_l}°/${angles.knee_r}° Quadril=${angles.hip}° Tronco=${angles.trunk}° | SimOuro=${simOuro}% Score=${angles.score} Ajust=${scoreAjustado}`)

    return {
      frame_numero: frameNumber,
      timestamp: `${((frameNumber - 1) * (videoDuration / totalFrames)).toFixed(1)}s`,
      similaridade_com_padrao_ouro: simOuro,
      similaridade_com_valgo: simValgo,
      similaridade_com_anterorizacao: simAntero,
      desvios_observados: desvios,
      aspectos_positivos: positivos,
      angulos_estimados: {
        joelho_esquerdo: angles.knee_l,
        joelho_direito: angles.knee_r,
        flexao_quadril: angles.hip,
        inclinacao_tronco: angles.trunk
      },
      angulos_referencia: angRefOuro,
      score: angles.score,
      score_ajustado: scoreAjustado,
      justificativa: desvios.length > 0
        ? `Desvios: ${desvios.join('; ')}`
        : positivos.length > 0
          ? positivos.join('; ')
          : 'Análise visual sem desvios significativos',
      metodo: hasGoldRef ? 'comparative_with_gold_standard' : 'standalone_vision'
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
}): number {
  const simOuro = analysis.similaridade_com_padrao_ouro || 0
  const simValgo = analysis.similaridade_com_valgo || 0
  const simAntero = analysis.similaridade_com_anterorizacao || 0

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

  // 3. Carregar frames disponíveis (para referência de ângulos)
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
    pontos_criticos: pontosCriticos,
    references_used: {
      gold_standard: goldFrames.length > 0,
      valgo_pattern: valgoFrames.length > 0,
      anterorizacao_pattern: anteroFrames.length > 0,
      lordose_pattern: false
    },
    metodo: goldFrames.length > 0 ? 'comparative_with_gold_standard' : 'standalone_vision',
    timestamp: new Date().toISOString()
  }
}
