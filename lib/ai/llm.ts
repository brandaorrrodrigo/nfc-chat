import axios from 'axios'

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434'
const DEFAULT_MODEL = process.env.DEFAULT_LLM_MODEL || 'llama3.1:70b'
const FAST_MODEL = process.env.FAST_LLM_MODEL || 'llama3.1:8b'

interface GenerateResponseParams {
  userMessage: string
  arenaContext: string
  persona: 'SCIENTIFIC' | 'MOTIVATIONAL' | 'SUSTAINING' | 'BALANCED'
  ragContext?: string[]
  useFastModel?: boolean
}

const PERSONA_PROMPTS = {
  SCIENTIFIC: `Você é um especialista científico em nutrição e fitness.
Suas respostas devem:
- Citar estudos e referências científicas quando possível
- Usar linguagem técnica mas acessível
- Ser preciso e baseado em evidências
- Incluir disclaimers quando necessário`,

  MOTIVATIONAL: `Você é um coach motivacional acolhedor e empático.
Suas respostas devem:
- Usar linguagem simples e encorajadora
- Focar no aspecto emocional e motivacional
- Celebrar pequenas vitórias
- Ser empático com dificuldades`,

  SUSTAINING: `Você é um facilitador que mantém conversas ativas.
Suas respostas devem:
- Fazer perguntas para manter o engajamento
- Explorar diferentes ângulos do assunto
- Sugerir ações práticas
- Conectar com experiências pessoais`,

  BALANCED: `Você é um especialista equilibrado em nutrição e fitness.
Suas respostas devem:
- Combinar ciência com empatia
- Ser práticas e acionáveis
- Adaptar o tom ao contexto da mensagem
- Equilibrar técnica com motivação`
}

export async function generateAIResponse(params: GenerateResponseParams): Promise<{
  content: string
  chunksUsed: any[]
  booksReferenced: any[]
  confidenceScore: number
}> {
  const { userMessage, arenaContext, persona, ragContext = [], useFastModel = false } = params

  const systemPrompt = `${PERSONA_PROMPTS[persona]}

Contexto da Arena: ${arenaContext}

${ragContext.length > 0 ? `
Referências disponíveis (RAG):
${ragContext.map((chunk, i) => `[${i + 1}] ${chunk}`).join('\n')}

IMPORTANTE: Cite as referências usando [1], [2], etc quando usar informações delas.
` : ''}

Regras importantes:
- Seja conciso (max 300 palavras)
- Use parágrafos curtos
- Evite jargões desnecessários
- Seja autêntico e natural
- NÃO invente informações - se não souber, admita
- Responda SEMPRE em português do Brasil`

  try {
    const model = useFastModel ? FAST_MODEL : DEFAULT_MODEL

    console.log(`🤖 Generating response with ${model}...`)

    // Ollama API call
    const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
      model,
      prompt: `${systemPrompt}\n\nUsuário: ${userMessage}\n\nAssistente:`,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        top_k: 40,
        num_predict: 500
      }
    }, {
      timeout: 120000 // 2 min timeout
    })

    const content = response.data.response || ''

    // Detectar quais chunks foram usados (baseado em citações)
    const chunksUsed = ragContext
      .map((chunk, i) => ({ index: i + 1, chunk }))
      .filter(({ index }) => content.includes(`[${index}]`))

    // Extrair livros referenciados
    const booksReferenced = chunksUsed.map(c => ({
      title: 'Referência RAG',
      page: 'N/A'
    }))

    // Calcular confidence score
    const confidenceScore = calculateConfidenceScore(content, chunksUsed.length)

    console.log(`✅ Response generated (${content.length} chars, confidence: ${confidenceScore})`)

    return {
      content,
      chunksUsed,
      booksReferenced,
      confidenceScore
    }
  } catch (error: any) {
    console.error('❌ Error generating AI response:', error.message)

    // Fallback para modelo mais rápido se o principal falhar
    if (!useFastModel && error.code === 'ECONNREFUSED') {
      console.log('⚠️ Trying fast model as fallback...')
      return generateAIResponse({ ...params, useFastModel: true })
    }

    throw error
  }
}

function calculateConfidenceScore(content: string, referencesUsed: number): number {
  let score = 0.5 // Base score

  // Aumenta se usou referências
  score += Math.min(referencesUsed * 0.1, 0.3)

  // Aumenta se tem estrutura clara
  if (content.includes('\n\n')) score += 0.1

  // Aumenta se tem disclaimers apropriados
  if (content.toLowerCase().includes('consulte') ||
      content.toLowerCase().includes('profissional')) {
    score += 0.1
  }

  return Math.min(score, 1.0)
}

export async function shouldAIIntervene(params: {
  arenaId: string
  lastPostTime: Date
  frustrationThreshold: number
  interventionRate: number
  cooldown: number
}): Promise<boolean> {
  const { lastPostTime, frustrationThreshold, interventionRate } = params

  // Verificar se passou o tempo de frustração
  const minutesSinceLastPost = (Date.now() - lastPostTime.getTime()) / 1000 / 60

  if (minutesSinceLastPost < frustrationThreshold) {
    return false
  }

  // Verificar taxa de intervenção (probabilidade)
  const shouldIntervene = Math.random() * 100 < interventionRate

  return shouldIntervene
}

// Verificar se Ollama está disponível
export async function checkOllamaHealth(): Promise<boolean> {
  try {
    const response = await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 5000 })
    return response.status === 200
  } catch (error) {
    console.error('❌ Ollama not available:', error)
    return false
  }
}

// Listar modelos disponíveis
export async function listAvailableModels(): Promise<string[]> {
  try {
    const response = await axios.get(`${OLLAMA_URL}/api/tags`)
    return response.data.models?.map((m: any) => m.name) || []
  } catch (error) {
    console.error('❌ Error listing models:', error)
    return []
  }
}
