import fs from 'fs'
import path from 'path'

export interface ReferencePattern {
  id: string
  nome: string
  categoria: 'ouro' | 'bom' | 'ruim'
  tipo_desvio?: string
  descricao: string
  frames: string[] // Paths relativos a /public
  angulos_esperados: {
    joelho_esquerdo: number[]
    joelho_direito: number[]
    flexao_quadril: number[]
    inclinacao_tronco: number[]
  }
}

export const REFERENCE_PATTERNS: ReferencePattern[] = [
  // PADRÃO OURO
  {
    id: 'agachamento-ouro-1',
    nome: 'Agachamento Padrão Ouro - Execução Perfeita',
    categoria: 'ouro',
    descricao: 'Execução biomecânica ideal: joelhos alinhados sobre pés, coluna neutra, profundidade adequada, peso distribuído nos calcanhares.',
    frames: [
      '/references/ouro/frame-1.jpg',
      '/references/ouro/frame-2.jpg',
      '/references/ouro/frame-3.jpg',
      '/references/ouro/frame-4.jpg',
      '/references/ouro/frame-5.jpg',
      '/references/ouro/frame-6.jpg',
    ],
    angulos_esperados: {
      joelho_esquerdo: [160, 120, 88, 90, 125, 158],
      joelho_direito: [160, 120, 88, 90, 125, 158],
      flexao_quadril: [175, 135, 85, 87, 130, 172],
      inclinacao_tronco: [5, 12, 18, 17, 13, 6]
    }
  },

  // VALGO DINÂMICO SEVERO
  {
    id: 'valgo-severo-1',
    nome: 'Valgo Dinâmico Severo',
    categoria: 'ruim',
    tipo_desvio: 'valgo_joelho',
    descricao: 'Joelhos colapsam medialmente durante descida (>12°). Indica fraqueza de glúteo médio e risco aumentado de lesão de LCA.',
    frames: [
      '/references/valgo-severo/frame-1.jpg',
      '/references/valgo-severo/frame-2.jpg',
      '/references/valgo-severo/frame-3.jpg',
      '/references/valgo-severo/frame-4.jpg',
      '/references/valgo-severo/frame-5.jpg',
      '/references/valgo-severo/frame-6.jpg',
    ],
    angulos_esperados: {
      joelho_esquerdo: [160, 115, 82, 85, 120, 155],
      joelho_direito: [160, 115, 82, 85, 120, 155],
      flexao_quadril: [175, 130, 80, 82, 125, 170],
      inclinacao_tronco: [5, 12, 20, 19, 14, 7]
    }
  },

  // ANTERIORIZAÇÃO EXCESSIVA
  {
    id: 'anterorizacao-1',
    nome: 'Anteriorização Excessiva do Tronco',
    categoria: 'ruim',
    tipo_desvio: 'anterorizacao_tronco',
    descricao: 'Tronco inclinado >25° para frente. Geralmente causado por mobilidade limitada de tornozelo ou fraqueza de quadríceps.',
    frames: [
      '/references/anterorizacao-tronco/frame-1.jpg',
      '/references/anterorizacao-tronco/frame-2.jpg',
      '/references/anterorizacao-tronco/frame-3.jpg',
      '/references/anterorizacao-tronco/frame-4.jpg',
      '/references/anterorizacao-tronco/frame-5.jpg',
      '/references/anterorizacao-tronco/frame-6.jpg',
    ],
    angulos_esperados: {
      joelho_esquerdo: [160, 120, 90, 92, 125, 158],
      joelho_direito: [160, 120, 90, 92, 125, 158],
      flexao_quadril: [175, 135, 88, 90, 132, 172],
      inclinacao_tronco: [5, 18, 28, 27, 20, 8]
    }
  },

  // LORDOSE LOMBAR (BUTT WINK)
  {
    id: 'lordose-lombar-1',
    nome: 'Hiperextensão Lombar (Butt Wink)',
    categoria: 'ruim',
    tipo_desvio: 'lordose_lombar',
    descricao: 'Coluna lombar perde neutralidade no fundo do agachamento. Causado por mobilidade limitada de quadril.',
    frames: [
      '/references/lordose-lombar/frame-1.jpg',
      '/references/lordose-lombar/frame-2.jpg',
      '/references/lordose-lombar/frame-3.jpg',
      '/references/lordose-lombar/frame-4.jpg',
      '/references/lordose-lombar/frame-5.jpg',
      '/references/lordose-lombar/frame-6.jpg',
    ],
    angulos_esperados: {
      joelho_esquerdo: [160, 118, 85, 87, 122, 157],
      joelho_direito: [160, 118, 85, 87, 122, 157],
      flexao_quadril: [175, 133, 82, 84, 128, 170],
      inclinacao_tronco: [5, 12, 19, 18, 13, 6]
    }
  }
]

export function getGoldStandard(): ReferencePattern {
  return REFERENCE_PATTERNS.find(p => p.categoria === 'ouro')!
}

export function getBadPatterns(): ReferencePattern[] {
  return REFERENCE_PATTERNS.filter(p => p.categoria === 'ruim')
}

export function getReferencePattern(id: string): ReferencePattern | null {
  return REFERENCE_PATTERNS.find(p => p.id === id) || null
}

export function getPatternByDeviationType(tipo: string): ReferencePattern | null {
  return REFERENCE_PATTERNS.find(p => p.tipo_desvio === tipo) || null
}

/**
 * Verifica se os frames de referência existem no disco
 */
export function checkReferenceFramesExist(pattern: ReferencePattern): {
  available: boolean
  missing: string[]
  found: string[]
} {
  const missing: string[] = []
  const found: string[] = []

  for (const framePath of pattern.frames) {
    const fullPath = path.join(process.cwd(), 'public', framePath)
    if (fs.existsSync(fullPath)) {
      found.push(framePath)
    } else {
      missing.push(framePath)
    }
  }

  return {
    available: missing.length === 0,
    missing,
    found
  }
}

/**
 * Converte frame para base64 (para enviar ao Llama Vision)
 */
export function loadFrameAsBase64(framePath: string): string {
  const fullPath = path.join(process.cwd(), 'public', framePath)
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Frame não encontrado: ${fullPath}`)
  }
  const imageBuffer = fs.readFileSync(fullPath)
  return imageBuffer.toString('base64')
}

/**
 * Carrega todos os frames de um padrão como base64
 * Retorna apenas frames que existem
 */
export function loadPatternFrames(pattern: ReferencePattern): string[] {
  const frames: string[] = []
  for (const framePath of pattern.frames) {
    try {
      frames.push(loadFrameAsBase64(framePath))
    } catch {
      // Frame não encontrado, pular
    }
  }
  return frames
}

/**
 * Retorna ângulos de referência para um frame específico
 */
export function getExpectedAngles(pattern: ReferencePattern, frameIndex: number) {
  return {
    joelho_esquerdo: pattern.angulos_esperados.joelho_esquerdo[frameIndex] || 0,
    joelho_direito: pattern.angulos_esperados.joelho_direito[frameIndex] || 0,
    flexao_quadril: pattern.angulos_esperados.flexao_quadril[frameIndex] || 0,
    inclinacao_tronco: pattern.angulos_esperados.inclinacao_tronco[frameIndex] || 0
  }
}
