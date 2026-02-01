import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
})

interface GenerateResponseParams {
  userMessage: string
  arenaContext: string
  persona: 'SCIENTIFIC' | 'MOTIVATIONAL' | 'SUSTAINING' | 'BALANCED'
  ragContext?: string[]
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
  const { userMessage, arenaContext, persona, ragContext = [] } = params

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
`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ]
    })

    const content = response.content[0].type === 'text'
      ? response.content[0].text
      : ''

    // Detectar quais chunks foram usados (baseado em citações)
    const chunksUsed = ragContext
      .map((chunk, i) => ({ index: i + 1, chunk }))
      .filter(({ index }) => content.includes(`[${index}]`))

    // Extrair livros referenciados (simplificado)
    const booksReferenced = chunksUsed.map(c => ({
      title: 'Livro Exemplo', // Isso viria do metadata do chunk
      page: 'XX'
    }))

    // Calcular confidence score (simplificado)
    const confidenceScore = calculateConfidenceScore(content, chunksUsed.length)

    return {
      content,
      chunksUsed,
      booksReferenced,
      confidenceScore
    }
  } catch (error) {
    console.error('Error generating AI response:', error)
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
  const { lastPostTime, frustrationThreshold, interventionRate, cooldown } = params

  // Verificar se passou o tempo de frustração
  const minutesSinceLastPost = (Date.now() - lastPostTime.getTime()) / 1000 / 60

  if (minutesSinceLastPost < frustrationThreshold) {
    return false
  }

  // Verificar cooldown
  // TODO: Implementar verificação de último post da IA

  // Verificar taxa de intervenção (probabilidade)
  const shouldIntervene = Math.random() * 100 < interventionRate

  return shouldIntervene
}
