import { prisma } from '../prisma'
import { redis } from '../redis'

interface FPCalculationParams {
  userId: string
  action: string
  metadata?: any
}

export async function calculateAndAwardFP(params: FPCalculationParams): Promise<{
  awarded: boolean
  amount: number
  reason?: string
}> {
  const { userId, action, metadata } = params

  // Buscar regra de FP
  const rule = await prisma.fPRule.findUnique({
    where: { action }
  })

  if (!rule || !rule.isActive) {
    return { awarded: false, amount: 0, reason: 'Regra não encontrada ou inativa' }
  }

  // Verificar cooldown
  if (rule.cooldown) {
    const cooldownKey = `fp:cooldown:${userId}:${action}`
    const lastAction = await redis.get(cooldownKey)

    if (lastAction) {
      const elapsed = Date.now() - parseInt(lastAction)
      const cooldownMs = rule.cooldown * 60 * 1000

      if (elapsed < cooldownMs) {
        return {
          awarded: false,
          amount: 0,
          reason: `Cooldown ativo (${Math.ceil((cooldownMs - elapsed) / 1000 / 60)} min restantes)`
        }
      }
    }
  }

  // Verificar cap diário
  if (rule.dailyCap) {
    const today = new Date().toISOString().split('T')[0]
    const capKey = `fp:cap:${userId}:${action}:${today}`
    const currentCount = await redis.get(capKey)

    if (currentCount && parseInt(currentCount) >= rule.dailyCap) {
      return {
        awarded: false,
        amount: 0,
        reason: 'Cap diário atingido para esta ação'
      }
    }
  }

  // Conceder FP
  await prisma.$transaction(async (tx) => {
    // Criar transação
    await tx.fPTransaction.create({
      data: {
        userId,
        amount: rule.fpValue,
        action,
        description: `FP concedido por: ${action}`,
        metadata
      }
    })

    // Atualizar saldo do usuário
    await tx.user.update({
      where: { id: userId },
      data: {
        fpTotal: { increment: rule.fpValue },
        fpAvailable: { increment: rule.fpValue }
      }
    })
  })

  // Atualizar Redis (cooldown e cap)
  if (rule.cooldown) {
    const cooldownKey = `fp:cooldown:${userId}:${action}`
    await redis.setEx(cooldownKey, rule.cooldown * 60, Date.now().toString())
  }

  if (rule.dailyCap) {
    const today = new Date().toISOString().split('T')[0]
    const capKey = `fp:cap:${userId}:${action}:${today}`
    await redis.incr(capKey)
    await redis.expireAt(capKey, Math.floor(new Date().setHours(23, 59, 59, 999) / 1000))
  }

  return { awarded: true, amount: rule.fpValue }
}

export async function deductFP(userId: string, amount: number, reason: string) {
  await prisma.$transaction(async (tx) => {
    await tx.fPTransaction.create({
      data: {
        userId,
        amount: -amount,
        action: 'deduction',
        description: reason
      }
    })

    await tx.user.update({
      where: { id: userId },
      data: {
        fpAvailable: { decrement: amount }
      }
    })
  })
}

export async function getUserFPStats(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      fpTotal: true,
      fpAvailable: true,
      currentStreak: true,
      longestStreak: true
    }
  })

  const transactions = await prisma.fPTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50
  })

  return {
    ...user,
    recentTransactions: transactions
  }
}
