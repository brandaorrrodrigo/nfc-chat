import { prisma } from '../prisma'

interface SpamDetectionResult {
  isSpam: boolean
  score: number
  reasons: string[]
  filters: string[]
}

export async function detectSpam(content: string, userId: string): Promise<SpamDetectionResult> {
  let score = 0
  const reasons: string[] = []
  const filters: string[] = []

  // Buscar filtros ativos
  const activeFilters = await prisma.spamFilter.findMany({
    where: { isActive: true }
  })

  // 1. Verificar filtros de palavras-chave
  const keywordFilters = activeFilters.filter(f => f.type === 'KEYWORD')
  for (const filter of keywordFilters) {
    const regex = new RegExp(filter.value, 'i')
    if (regex.test(content)) {
      score += filter.severity * 10
      reasons.push(`Palavra-chave detectada: ${filter.value}`)
      filters.push(filter.id)
    }
  }

  // 2. Verificar links suspeitos
  const linkFilters = activeFilters.filter(f => f.type === 'LINK')
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const urls = content.match(urlRegex) || []

  for (const url of urls) {
    for (const filter of linkFilters) {
      if (url.includes(filter.value)) {
        score += filter.severity * 10
        reasons.push(`Link suspeito detectado: ${filter.value}`)
        filters.push(filter.id)
      }
    }
  }

  // 3. Verificar padrões (regex)
  const patternFilters = activeFilters.filter(f => f.type === 'PATTERN')
  for (const filter of patternFilters) {
    try {
      const regex = new RegExp(filter.value, 'i')
      if (regex.test(content)) {
        score += filter.severity * 10
        reasons.push(`Padrão detectado: ${filter.value}`)
        filters.push(filter.id)
      }
    } catch (e) {
      console.error(`Invalid regex pattern in filter ${filter.id}:`, e)
    }
  }

  // 4. Heurísticas adicionais

  // Texto todo em maiúsculas
  if (content === content.toUpperCase() && content.length > 20) {
    score += 15
    reasons.push('Texto todo em maiúsculas')
  }

  // Muitos emojis
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu
  const emojiCount = (content.match(emojiRegex) || []).length
  if (emojiCount > 10) {
    score += 20
    reasons.push(`Excesso de emojis (${emojiCount})`)
  }

  // Repetição excessiva de caracteres
  if (/(.)\1{4,}/.test(content)) {
    score += 15
    reasons.push('Repetição excessiva de caracteres')
  }

  // Muitos links
  if (urls.length > 3) {
    score += 25
    reasons.push(`Excesso de links (${urls.length})`)
  }

  // 5. Verificar histórico do usuário
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { spamScore: true, isBanned: true }
  })

  if (user) {
    score += user.spamScore
    if (user.isBanned) {
      score += 50
      reasons.push('Usuário banido')
    }
  }

  return {
    isSpam: score >= 50, // Threshold: 50 pontos
    score,
    reasons,
    filters
  }
}

export async function updateUserSpamScore(userId: string, increment: number) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      spamScore: { increment }
    }
  })
}

export async function resetUserSpamScore(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { spamScore: 0 }
  })
}
