import { prisma } from '../prisma'
import { safeRedis } from '../redis'

export async function calculateDailyMetrics(date: Date = new Date()) {
  const startOfDay = new Date(date.setHours(0, 0, 0, 0))
  const endOfDay = new Date(date.setHours(23, 59, 59, 999))

  const [
    dau,
    newUsers,
    postsCreated,
    commentsCreated,
    aiResponses,
    totalPosts,
    fpIssued,
    fpConsumed,
    spamDetected,
    contentRemoved
  ] = await Promise.all([
    // DAU (Daily Active Users)
    prisma.user.count({
      where: {
        lastActiveDate: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    }),

    // Novos usuários
    prisma.user.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    }),

    // Posts criados
    prisma.post.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        },
        isDeleted: false
      }
    }),

    // Comentários criados
    prisma.comment.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        },
        isDeleted: false
      }
    }),

    // Respostas da IA
    prisma.post.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        },
        isAIResponse: true
      }
    }),

    // Total de posts (para calcular taxa de aprovação)
    prisma.post.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    }),

    // FP emitidos
    prisma.fPTransaction.aggregate({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        },
        amount: { gt: 0 }
      },
      _sum: { amount: true }
    }),

    // FP consumidos
    prisma.fPTransaction.aggregate({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        },
        amount: { lt: 0 }
      },
      _sum: { amount: true }
    }),

    // Spam detectado
    prisma.moderationQueue.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        },
        reason: 'SPAM'
      }
    }),

    // Conteúdo removido
    prisma.post.count({
      where: {
        deletedAt: {
          gte: startOfDay,
          lte: endOfDay
        },
        isDeleted: true
      }
    })
  ])

  const aiApprovalRate = totalPosts > 0 ? (aiResponses / totalPosts) * 100 : 0

  const metrics = {
    date: startOfDay,
    dau,
    newUsers,
    activeUsers: dau,
    postsCreated,
    commentsCreated,
    aiResponses,
    aiApprovalRate,
    fpIssued: fpIssued._sum.amount || 0,
    fpConsumed: Math.abs(fpConsumed._sum.amount || 0),
    spamDetected,
    contentRemoved
  }

  // Salvar no banco
  await prisma.dailyMetrics.upsert({
    where: { date: startOfDay },
    update: metrics,
    create: metrics
  })

  return metrics
}

export async function getRealtimeMetrics() {
  const cacheKey = 'metrics:realtime'

  // ✅ FIX: Usar safeRedis com fallback
  const cached = await safeRedis.get(cacheKey)

  if (cached) {
    return JSON.parse(cached)
  }

  const now = new Date()
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  const [
    usersOnline,
    messagesLastHour,
    aiResponsesLast24h,
    totalMessagesLast24h,
    fpIssuedToday
  ] = await Promise.all([
    // ✅ FIX: Usuários online (do Redis com fallback)
    safeRedis.sCard('users:online'),

    // Mensagens na última hora
    prisma.post.count({
      where: {
        createdAt: { gte: oneHourAgo }
      }
    }),

    // Respostas da IA nas últimas 24h
    prisma.post.count({
      where: {
        isAIResponse: true,
        createdAt: { gte: oneDayAgo }
      }
    }),

    // Total de mensagens nas últimas 24h
    prisma.post.count({
      where: {
        createdAt: { gte: oneDayAgo }
      }
    }),

    // FP emitidos hoje
    prisma.fPTransaction.aggregate({
      where: {
        createdAt: {
          gte: new Date(now.setHours(0, 0, 0, 0))
        },
        amount: { gt: 0 }
      },
      _sum: { amount: true }
    })
  ])

  const metrics = {
    usersOnline,
    messagesPerMinute: Math.round(messagesLastHour / 60),
    aiResponseRate: totalMessagesLast24h > 0
      ? Math.round((aiResponsesLast24h / totalMessagesLast24h) * 100)
      : 0,
    fpIssuedToday: fpIssuedToday._sum.amount || 0
  }

  // ✅ FIX: Cache por 30 segundos (com fallback)
  await safeRedis.setEx(cacheKey, 30, JSON.stringify(metrics))

  return metrics
}

export async function trackUserOnline(userId: string) {
  // ✅ FIX: Usar safeRedis com fallback
  await safeRedis.sAdd('users:online', userId)
  await safeRedis.expire('users:online', 300) // 5 minutos
}

export async function trackUserOffline(userId: string) {
  // ✅ FIX: Usar safeRedis com fallback
  await safeRedis.sRem('users:online', userId)
}
