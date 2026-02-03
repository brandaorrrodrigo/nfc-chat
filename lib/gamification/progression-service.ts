/**
 * Progression Service
 * Sistema de progressão e milestones para gamificação
 */

import { prisma } from '@/lib/prisma';
import { COUPON_TIERS } from '@/lib/coupons/coupon-tiers';

export interface ProgressionData {
  currentFP: number;
  currentTier: TierProgress | null;
  nextTier: TierProgress | null;
  allTiers: TierProgress[];
  milestones: Milestone[];
  completedMilestones: number;
  totalMilestones: number;
}

export interface TierProgress {
  tierId: string;
  tierName: string;
  badge: string;
  fpRequired: number;
  fpProgress: number;
  percentage: number;
  isUnlocked: boolean;
  isNext: boolean;
  discountPercent: number;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  icon: string;
  fpRequired: number;
  reward: string;
  isCompleted: boolean;
  isPending: boolean;
  completedAt?: Date;
}

/**
 * Obtém dados de progressão do usuário
 */
export async function getUserProgression(userId: string): Promise<ProgressionData> {
  // Buscar FP do usuário
  const fpLog = await prisma.fitnessPointLog.findMany({
    where: { userId },
    select: { pointsEarned: true },
  });

  const currentFP = fpLog.reduce((sum, log) => sum + log.pointsEarned, 0);

  // Calcular progresso por tier
  const allTiers: TierProgress[] = COUPON_TIERS.map((tier) => {
    const isUnlocked = currentFP >= tier.fpCost;
    const fpProgress = Math.min(currentFP, tier.fpCost);
    const percentage = (fpProgress / tier.fpCost) * 100;

    return {
      tierId: tier.id,
      tierName: tier.name,
      badge: tier.badge,
      fpRequired: tier.fpCost,
      fpProgress,
      percentage,
      isUnlocked,
      isNext: false,
      discountPercent: tier.discountPercent,
    };
  });

  // Identificar tier atual e próximo
  const unlockedTiers = allTiers.filter((t) => t.isUnlocked);
  const currentTier = unlockedTiers.length > 0 ? unlockedTiers[unlockedTiers.length - 1] : null;

  const lockedTiers = allTiers.filter((t) => !t.isUnlocked);
  const nextTier = lockedTiers.length > 0 ? lockedTiers[0] : null;

  if (nextTier) {
    nextTier.isNext = true;
  }

  // Buscar milestones
  const milestones = await getMilestones(userId, currentFP);

  const completedMilestones = milestones.filter((m) => m.isCompleted).length;

  return {
    currentFP,
    currentTier,
    nextTier,
    allTiers,
    milestones,
    completedMilestones,
    totalMilestones: milestones.length,
  };
}

/**
 * Obtém milestones do usuário
 */
export async function getMilestones(
  userId: string,
  currentFP: number
): Promise<Milestone[]> {
  const milestoneDefinitions = [
    {
      id: 'first_fp',
      name: 'Primeiros Passos',
      description: 'Ganhe seus primeiros 10 FP',
      icon: '🎯',
      fpRequired: 10,
      reward: 'Badge Iniciante',
    },
    {
      id: 'half_basic',
      name: 'Metade do Caminho',
      description: 'Acumule 50 FP',
      icon: '⚡',
      fpRequired: 50,
      reward: 'Badge Engajado',
    },
    {
      id: 'unlock_basic',
      name: 'Primeiro Desconto',
      description: 'Desbloqueie o tier Básico (100 FP)',
      icon: '🥉',
      fpRequired: 100,
      reward: '5% OFF Disponível',
    },
    {
      id: 'half_intermediate',
      name: 'Autoridade Crescente',
      description: 'Acumule 150 FP',
      icon: '🚀',
      fpRequired: 150,
      reward: 'Badge Contribuidor',
    },
    {
      id: 'unlock_intermediate',
      name: 'Membro Ativo',
      description: 'Desbloqueie o tier Intermediário (200 FP)',
      icon: '🥈',
      fpRequired: 200,
      reward: '15% OFF Disponível',
    },
    {
      id: 'half_advanced',
      name: 'Quase no Topo',
      description: 'Acumule 250 FP',
      icon: '⭐',
      fpRequired: 250,
      reward: 'Badge Autoridade',
    },
    {
      id: 'unlock_advanced',
      name: 'Autoridade Técnica',
      description: 'Desbloqueie o tier Avançado (300 FP)',
      icon: '🥇',
      fpRequired: 300,
      reward: '30% OFF Disponível',
    },
    {
      id: 'super_user',
      name: 'Super Usuário',
      description: 'Acumule incríveis 500 FP',
      icon: '👑',
      fpRequired: 500,
      reward: 'Badge Lendário',
    },
  ];

  // Buscar milestones completados
  const completedMilestones = await prisma.userMilestone.findMany({
    where: { userId },
    select: { milestoneId: true, completedAt: true },
  });

  const completedMap = new Map(
    completedMilestones.map((m) => [m.milestoneId, m.completedAt])
  );

  return milestoneDefinitions.map((def) => {
    const isCompleted = completedMap.has(def.id);
    const completedAt = completedMap.get(def.id);
    const isPending = !isCompleted && currentFP >= def.fpRequired;

    return {
      ...def,
      isCompleted,
      isPending,
      completedAt,
    };
  });
}

/**
 * Completa milestone pendente
 */
export async function completeMilestone(
  userId: string,
  milestoneId: string
): Promise<boolean> {
  try {
    // Verificar se já está completo
    const existing = await prisma.userMilestone.findUnique({
      where: {
        userId_milestoneId: { userId, milestoneId },
      },
    });

    if (existing) {
      return false;
    }

    // Marcar como completo
    await prisma.userMilestone.create({
      data: {
        userId,
        milestoneId,
        completedAt: new Date(),
      },
    });

    // Criar notificação
    const milestones = await getMilestones(userId, 0);
    const milestone = milestones.find((m) => m.id === milestoneId);

    if (milestone) {
      await prisma.notification.create({
        data: {
          userId,
          type: 'milestone_completed',
          title: `🎉 ${milestone.name} Completo!`,
          message: `Você desbloqueou: ${milestone.reward}`,
          metadata: {
            milestoneId,
            reward: milestone.reward,
          },
        },
      });
    }

    return true;
  } catch (error) {
    console.error('Error completing milestone:', error);
    return false;
  }
}

/**
 * Verifica e completa milestones pendentes
 */
export async function checkAndCompleteMilestones(userId: string): Promise<number> {
  // Buscar FP atual
  const fpLog = await prisma.fitnessPointLog.findMany({
    where: { userId },
    select: { pointsEarned: true },
  });

  const currentFP = fpLog.reduce((sum, log) => sum + log.pointsEarned, 0);

  // Buscar milestones pendentes
  const milestones = await getMilestones(userId, currentFP);
  const pendingMilestones = milestones.filter((m) => m.isPending);

  let completed = 0;

  for (const milestone of pendingMilestones) {
    const success = await completeMilestone(userId, milestone.id);
    if (success) {
      completed++;
    }
  }

  return completed;
}

/**
 * Calcula mensagem motivacional para próximo tier
 */
export function getMotivationalMessage(currentFP: number, nextTier: TierProgress | null): string {
  if (!nextTier) {
    return '🎉 Você desbloqueou todos os tiers! Continue engajando!';
  }

  const fpNeeded = nextTier.fpRequired - currentFP;
  const percentage = (currentFP / nextTier.fpRequired) * 100;

  if (percentage >= 90) {
    return `🔥 Faltam apenas ${fpNeeded} FP para ${nextTier.discountPercent}% OFF! Você está quase lá!`;
  } else if (percentage >= 75) {
    return `⚡ Você está a ${fpNeeded} FP de desbloquear ${nextTier.discountPercent}% OFF!`;
  } else if (percentage >= 50) {
    return `💪 Já percorreu metade do caminho! Faltam ${fpNeeded} FP para o próximo tier.`;
  } else if (percentage >= 25) {
    return `🎯 Continue assim! Faltam ${fpNeeded} FP para ${nextTier.tierName}.`;
  }

  return `✨ Acumule ${fpNeeded} FP para desbloquear ${nextTier.badge} ${nextTier.tierName}!`;
}

/**
 * Obtém badges conquistados do usuário
 */
export async function getUserBadges(userId: string): Promise<
  Array<{
    name: string;
    icon: string;
    earnedAt: Date;
  }>
> {
  const milestones = await prisma.userMilestone.findMany({
    where: { userId },
    orderBy: { completedAt: 'desc' },
  });

  const allMilestones = await getMilestones(userId, 0);

  return milestones
    .map((m) => {
      const def = allMilestones.find((d) => d.id === m.milestoneId);
      if (!def) return null;

      return {
        name: def.name,
        icon: def.icon,
        earnedAt: m.completedAt,
      };
    })
    .filter((b) => b !== null) as Array<{
    name: string;
    icon: string;
    earnedAt: Date;
  }>;
}
