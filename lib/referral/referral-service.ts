/**
 * Referral Service
 * Sistema de indicação de amigos (viral loop)
 */

import { prisma } from '@/lib/prisma';

export interface ReferralCode {
  id: string;
  code: string;
  referrerId: string;
  usageCount: number;
  maxUsages: number;
  bonusFP: number;
  bonusDiscount: number;
  expiresAt: Date | null;
  createdAt: Date;
}

export interface ReferralStats {
  totalReferrals: number;
  successfulConversions: number;
  totalFPEarned: number;
  pendingReferrals: number;
  conversionRate: number;
  topReferrers: Array<{
    userId: string;
    userName: string;
    referralCount: number;
    fpEarned: number;
  }>;
}

export interface ReferralReward {
  referrerFP: number; // FP para quem indicou
  refereeDiscount: number; // Desconto extra para indicado (%)
}

const DEFAULT_REWARDS: ReferralReward = {
  referrerFP: 50,
  refereeDiscount: 10,
};

/**
 * Gera código de indicação único
 */
export async function generateReferralCode(
  userId: string,
  customCode?: string
): Promise<ReferralCode> {
  // Verificar se usuário já tem código ativo
  const existing = await prisma.referral.findFirst({
    where: {
      referrerId: userId,
      expiresAt: {
        gte: new Date(),
      },
    },
  });

  if (existing) {
    return existing as ReferralCode;
  }

  // Gerar código único
  const code = customCode || generateUniqueCode(userId);

  // Criar referral
  const referral = await prisma.referral.create({
    data: {
      code,
      referrerId: userId,
      usageCount: 0,
      maxUsages: 10, // Máximo 10 indicações por código
      bonusFP: DEFAULT_REWARDS.referrerFP,
      bonusDiscount: DEFAULT_REWARDS.refereeDiscount,
      expiresAt: null, // Sem expiração por padrão
    },
  });

  return referral as ReferralCode;
}

/**
 * Valida código de indicação
 */
export async function validateReferralCode(
  code: string
): Promise<{
  valid: boolean;
  referral?: ReferralCode;
  reason?: string;
}> {
  const referral = await prisma.referral.findUnique({
    where: { code },
  });

  if (!referral) {
    return {
      valid: false,
      reason: 'code_not_found',
    };
  }

  // Verificar expiração
  if (referral.expiresAt && referral.expiresAt < new Date()) {
    return {
      valid: false,
      reason: 'code_expired',
      referral: referral as ReferralCode,
    };
  }

  // Verificar limite de uso
  if (referral.usageCount >= referral.maxUsages) {
    return {
      valid: false,
      reason: 'max_usage_reached',
      referral: referral as ReferralCode,
    };
  }

  return {
    valid: true,
    referral: referral as ReferralCode,
  };
}

/**
 * Aplica código de indicação (quando novo usuário se registra)
 */
export async function applyReferralCode(
  referralCode: string,
  refereeUserId: string
): Promise<{
  success: boolean;
  reward?: {
    referrerFP: number;
    refereeDiscount: number;
  };
  error?: string;
}> {
  try {
    // Validar código
    const validation = await validateReferralCode(referralCode);

    if (!validation.valid || !validation.referral) {
      return {
        success: false,
        error: validation.reason || 'invalid_code',
      };
    }

    const referral = validation.referral;

    // Verificar se usuário não está tentando usar próprio código
    if (referral.referrerId === refereeUserId) {
      return {
        success: false,
        error: 'cannot_use_own_code',
      };
    }

    // Verificar se usuário já usou código de indicação
    const alreadyUsed = await prisma.referralUsage.findUnique({
      where: {
        refereeUserId,
      },
    });

    if (alreadyUsed) {
      return {
        success: false,
        error: 'already_used_referral',
      };
    }

    // Registrar uso
    await prisma.referralUsage.create({
      data: {
        referralId: referral.id,
        referrerId: referral.referrerId,
        refereeUserId,
        fpAwarded: referral.bonusFP,
        discountAwarded: referral.bonusDiscount,
        status: 'pending', // Muda para 'completed' quando indicado converter
      },
    });

    // Incrementar contador
    await prisma.referral.update({
      where: { id: referral.id },
      data: {
        usageCount: {
          increment: 1,
        },
      },
    });

    // Criar notificação para indicador
    await prisma.notification.create({
      data: {
        userId: referral.referrerId,
        type: 'referral_signup',
        title: '🎉 Novo Indicado!',
        message: `Alguém se cadastrou usando seu código! Ganhe ${referral.bonusFP} FP quando ele converter.`,
        metadata: {
          referralCode: referral.code,
          bonusFP: referral.bonusFP,
        },
      },
    });

    return {
      success: true,
      reward: {
        referrerFP: referral.bonusFP,
        refereeDiscount: referral.bonusDiscount,
      },
    };
  } catch (error) {
    console.error('Error applying referral code:', error);
    return {
      success: false,
      error: 'application_failed',
    };
  }
}

/**
 * Completa referral (quando indicado faz primeira conversão)
 */
export async function completeReferral(refereeUserId: string): Promise<boolean> {
  try {
    const usage = await prisma.referralUsage.findUnique({
      where: { refereeUserId },
      include: { referral: true },
    });

    if (!usage || usage.status === 'completed') {
      return false;
    }

    // Atualizar status
    await prisma.referralUsage.update({
      where: { refereeUserId },
      data: {
        status: 'completed',
        completedAt: new Date(),
      },
    });

    // Adicionar FP para indicador
    await prisma.fitnessPointLog.create({
      data: {
        userId: usage.referrerId,
        activityType: 'referral_conversion',
        pointsEarned: usage.fpAwarded,
        metadata: {
          refereeUserId,
          referralCode: usage.referral.code,
        },
      },
    });

    // Criar notificação para indicador
    await prisma.notification.create({
      data: {
        userId: usage.referrerId,
        type: 'referral_completed',
        title: `🎊 Você ganhou ${usage.fpAwarded} FP!`,
        message: `Seu indicado fez a primeira conversão! Parabéns!`,
        metadata: {
          fpAwarded: usage.fpAwarded,
          referralCode: usage.referral.code,
        },
      },
    });

    console.log(`✅ Referral completed: ${usage.referrerId} earned ${usage.fpAwarded} FP`);

    return true;
  } catch (error) {
    console.error('Error completing referral:', error);
    return false;
  }
}

/**
 * Obtém estatísticas de indicações do usuário
 */
export async function getUserReferralStats(userId: string): Promise<{
  code: string | null;
  totalReferrals: number;
  successfulConversions: number;
  pendingReferrals: number;
  totalFPEarned: number;
  conversionRate: number;
}> {
  // Buscar código do usuário
  const referral = await prisma.referral.findFirst({
    where: { referrerId: userId },
    orderBy: { createdAt: 'desc' },
  });

  if (!referral) {
    return {
      code: null,
      totalReferrals: 0,
      successfulConversions: 0,
      pendingReferrals: 0,
      totalFPEarned: 0,
      conversionRate: 0,
    };
  }

  // Buscar usages
  const usages = await prisma.referralUsage.findMany({
    where: { referralId: referral.id },
  });

  const totalReferrals = usages.length;
  const successfulConversions = usages.filter((u) => u.status === 'completed').length;
  const pendingReferrals = usages.filter((u) => u.status === 'pending').length;
  const totalFPEarned = usages
    .filter((u) => u.status === 'completed')
    .reduce((sum, u) => sum + u.fpAwarded, 0);

  const conversionRate = totalReferrals > 0 ? (successfulConversions / totalReferrals) * 100 : 0;

  return {
    code: referral.code,
    totalReferrals,
    successfulConversions,
    pendingReferrals,
    totalFPEarned,
    conversionRate,
  };
}

/**
 * Obtém top indicadores (leaderboard)
 */
export async function getTopReferrers(limit: number = 10): Promise<
  Array<{
    userId: string;
    userName: string;
    referralCount: number;
    fpEarned: number;
  }>
> {
  const usages = await prisma.referralUsage.findMany({
    where: {
      status: 'completed',
    },
    include: {
      referrer: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Agregar por referrer
  const referrerMap = new Map<
    string,
    { userId: string; userName: string; referralCount: number; fpEarned: number }
  >();

  for (const usage of usages) {
    const existing = referrerMap.get(usage.referrerId);
    if (existing) {
      existing.referralCount++;
      existing.fpEarned += usage.fpAwarded;
    } else {
      referrerMap.set(usage.referrerId, {
        userId: usage.referrerId,
        userName: usage.referrer.name || 'Usuário',
        referralCount: 1,
        fpEarned: usage.fpAwarded,
      });
    }
  }

  // Ordenar por FP ganho
  return Array.from(referrerMap.values())
    .sort((a, b) => b.fpEarned - a.fpEarned)
    .slice(0, limit);
}

/**
 * Gera código único baseado em userId
 */
function generateUniqueCode(userId: string): string {
  const timestamp = Date.now().toString(36);
  const userHash = userId.slice(0, 4).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();

  return `NFC${userHash}${random}${timestamp}`.substring(0, 16);
}
