import axios from 'axios'
import { readFileSync } from 'fs'

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434'
const VISION_MODEL = process.env.VISION_MODEL || 'llava:13b'

interface VisionAnalysisParams {
  imagePath?: string
  imageBase64?: string
  prompt: string
  context?: string
}

interface VisionAnalysisResult {
  description: string
  confidence: number
  model: string
}

export async function analyzeImage(params: VisionAnalysisParams): Promise<VisionAnalysisResult> {
  const { imagePath, imageBase64, prompt, context } = params

  try {
    let imageData: string

    // Carregar imagem do path ou usar base64 fornecido
    if (imagePath) {
      console.log(`📷 Loading image from: ${imagePath}`)
      const buffer = readFileSync(imagePath)
      imageData = buffer.toString('base64')
    } else if (imageBase64) {
      imageData = imageBase64
    } else {
      throw new Error('Either imagePath or imageBase64 must be provided')
    }

    const systemPrompt = context
      ? `${context}\n\n${prompt}`
      : prompt

    console.log(`🔍 Analyzing image with ${VISION_MODEL}...`)

    // Ollama LLaVA API call
    const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
      model: VISION_MODEL,
      prompt: systemPrompt,
      images: [imageData],
      stream: false,
      options: {
        temperature: 0.3, // Mais determinístico para análise de imagens
        top_p: 0.9
      }
    }, {
      timeout: 180000 // 3 min timeout (visão é mais lenta)
    })

    const description = response.data.response || ''

    console.log(`✅ Image analysis completed (${description.length} chars)`)

    return {
      description,
      confidence: 0.85, // Placeholder - pode ser melhorado com análise de probabilidades
      model: VISION_MODEL
    }
  } catch (error: any) {
    console.error('❌ Error analyzing image:', error.message)
    throw error
  }
}

// Analisar foto de refeição (caso de uso específico)
export async function analyzeMealPhoto(imagePath: string): Promise<{
  foods: string[]
  estimatedCalories?: number
  nutritionalInfo?: string
  description: string
}> {
  const prompt = `Analise esta foto de refeição e forneça:
1. Lista de alimentos visíveis
2. Estimativa aproximada de calorias totais
3. Informações nutricionais relevantes
4. Descrição geral da refeição

Responda em português do Brasil, de forma clara e objetiva.`

  const context = `Você é um especialista em nutrição analisando uma foto de refeição.
Seja preciso mas honesto sobre limitações de análise visual.`

  const result = await analyzeImage({
    imagePath,
    prompt,
    context
  })

  // Parse da resposta (simplificado - pode ser melhorado)
  const foods = extractFoodsFromDescription(result.description)

  return {
    foods,
    estimatedCalories: extractCaloriesFromDescription(result.description),
    nutritionalInfo: result.description,
    description: result.description
  }
}

// Analisar foto de exercício/postura
export async function analyzeExercisePhoto(imagePath: string): Promise<{
  exercise: string
  form: string
  tips: string[]
  description: string
}> {
  const prompt = `Analise esta foto de exercício físico e forneça:
1. Identificação do exercício sendo realizado
2. Análise da forma/postura
3. Dicas para melhorar a execução
4. Possíveis riscos ou pontos de atenção

Responda em português do Brasil, de forma técnica mas acessível.`

  const context = `Você é um personal trainer experiente analisando uma foto de exercício.
Foque em segurança e efetividade do movimento.`

  const result = await analyzeImage({
    imagePath,
    prompt,
    context
  })

  return {
    exercise: 'Exercício identificado', // Parse da resposta
    form: 'Análise de forma',
    tips: ['Dica 1', 'Dica 2'],
    description: result.description
  }
}

// Funções auxiliares de parsing
function extractFoodsFromDescription(text: string): string[] {
  // Regex simplificado - pode ser melhorado
  const lines = text.split('\n')
  const foods: string[] = []

  for (const line of lines) {
    if (line.match(/^[\d\-\*]\s*(.+)/)) {
      const food = line.replace(/^[\d\-\*]\s*/, '').trim()
      if (food) foods.push(food)
    }
  }

  return foods.length > 0 ? foods : ['Alimentos não identificados']
}

function extractCaloriesFromDescription(text: string): number | undefined {
  // Buscar padrão "XXX calorias" ou "XXX kcal"
  const match = text.match(/(\d+)\s*(calorias|kcal)/i)
  return match ? parseInt(match[1]) : undefined
}

// Verificar se modelo de visão está disponível
export async function checkVisionModelAvailable(): Promise<boolean> {
  try {
    const response = await axios.get(`${OLLAMA_URL}/api/tags`)
    const models = response.data.models?.map((m: any) => m.name) || []
    return models.some((m: string) => m.includes('llava'))
  } catch (error) {
    console.error('❌ Error checking vision model:', error)
    return false
  }
}

// Pull do modelo de visão se não estiver disponível
export async function pullVisionModel(): Promise<void> {
  try {
    console.log(`📥 Pulling vision model: ${VISION_MODEL}...`)
    console.log(`⚠️  This may take several minutes (model is ~8GB)`)

    await axios.post(`${OLLAMA_URL}/api/pull`, {
      name: VISION_MODEL
    }, {
      timeout: 600000 // 10 min timeout para download
    })

    console.log(`✅ Model ${VISION_MODEL} pulled successfully`)
  } catch (error) {
    console.error('❌ Error pulling vision model:', error)
    throw error
  }
}
