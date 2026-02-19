/**
 * Conversion Analytics Service
 * Analytics avançado para otimização de conversão
 */

import { prisma } from '@/lib/prisma';

export interface ConversionFunnelData {
  stages: Array<{
    name: string;
    count: number;
    percentage: number;
    dropOffRate: number;
  }>;
  totalUsers: number;
  conversionRate: number;
}

export interface HeatmapData {
  hours: Array<{
    hour: number;
    count: number;
    intensity: number;
  }>;
  peakHour: number;
  peakCount: number;
}

export interface CohortData {
  cohorts: Array<{
    fpRange: string;
    totalUsers: number;
    converted: number;
    conversionRate: number;
    avgTimeToConvert: number; // em dias
  }>;
}

/**
 * Obtém dados do funil de conversão
 */
export async function getConversionFunnel(): Promise<ConversionFunnelData> {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Total de usuários ativos (com FP > 0)
  const totalUsers = await prisma.user.count({
    where: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fitnessPointLog: {
        some: {
          createdAt: { gte: thirtyDaysAgo },
        },
      },
    } as any,
  });

  // Usuários com FP >= 100 (elegíveis)
  const eligible = await prisma.fitnessPointLog.groupBy({
    by: ['userId'],
    where: {
      createdAt: { gte: thirtyDaysAgo },
    },
    _sum: {
      pointsEarned: true,
    },
    having: {
      pointsEarned: {
        _sum: { gte: 100 },
      },
    },
  });

  const eligibleCount = eligible.length;

  // Usuários que resgataram cupom
  const redeemed = await prisma.coupon.groupBy({
    by: ['userId'],
    where: {
      createdAt: { gte: thirtyDaysAgo },
    },
  });

  const redeemedCount = redeemed.length;

  // Usuários que usaram cupom
  const used = await prisma.coupon.groupBy({
    by: ['userId'],
    where: {
      status: 'USED',
      usedAt: { gte: thirtyDaysAgo },
    },
  });

  const usedCount = used.length;

  // Calcular stages
  const stages = [
    {
      name: 'Usuários Ativos',
      count: totalUsers,
      percentage: 100,
      dropOffRate: 0,
    },
    {
      name: 'Elegíveis (100+ FP)',
      count: eligibleCount,
      percentage: totalUsers > 0 ? (eligibleCount / totalUsers) * 100 : 0,
      dropOffRate: totalUsers > 0 ? ((totalUsers - eligibleCount) / totalUsers) * 100 : 0,
    },
    {
      name: 'Resgataram Cupom',
      count: redeemedCount,
      percentage: eligibleCount > 0 ? (redeemedCount / eligibleCount) * 100 : 0,
      dropOffRate: eligibleCount > 0 ? ((eligibleCount - redeemedCount) / eligibleCount) * 100 : 0,
    },
    {
      name: 'Usaram Cupom',
      count: usedCount,
      percentage: redeemedCount > 0 ? (usedCount / redeemedCount) * 100 : 0,
      dropOffRate: redeemedCount > 0 ? ((redeemedCount - usedCount) / redeemedCount) * 100 : 0,
    },
  ];

  const conversionRate = totalUsers > 0 ? (usedCount / totalUsers) * 100 : 0;

  return {
    stages,
    totalUsers,
    conversionRate,
  };
}

/**
 * Obtém heatmap de conversões por hora do dia
 */
export async function getConversionHeatmap(): Promise<HeatmapData> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const coupons = await prisma.coupon.findMany({
    where: {
      createdAt: { gte: thirtyDaysAgo },
    },
    select: { createdAt: true },
  });

  // Agrupar por hora
  const hourCounts: Record<number, number> = {};
  for (let i = 0; i < 24; i++) {
    hourCounts[i] = 0;
  }

  for (const coupon of coupons) {
    const hour = coupon.createdAt.getHours();
    hourCounts[hour]++;
  }

  const maxCount = Math.max(...Object.values(hourCounts));

  const hours = Object.entries(hourCounts).map(([hour, count]) => ({
    hour: parseInt(hour),
    count,
    intensity: maxCount > 0 ? (count / maxCount) * 100 : 0,
  }));

  const peakHour = hours.reduce((max, h) => (h.count > max.count ? h : max), hours[0]);

  return {
    hours,
    peakHour: peakHour.hour,
    peakCount: peakHour.count,
  };
}

/**
 * Cohort analysis por faixa de FP
 */
export async function getCohortAnalysis(): Promise<CohortData> {
  const fpRanges = [
    { min: 100, max: 149, label: '100-149 FP' },
    { min: 150, max: 199, label: '150-199 FP' },
    { min: 200, max: 299, label: '200-299 FP' },
    { min: 300, max: 999, label: '300+ FP' },
  ];

  const cohorts = await Promise.all(
    fpRanges.map(async (range) => {
      // Usuários nesta faixa
      const usersInRange = await prisma.fitnessPointLog.groupBy({
        by: ['userId'],
        _sum: { pointsEarned: true },
        having: {
          pointsEarned: {
            _sum: {
              gte: range.min,
              ...(range.max < 999 && { lte: range.max }),
            },
          },
        },
      });

      const totalUsers = usersInRange.length;
      const userIds = usersInRange.map((u) => u.userId);

      // Usuários que converteram
      const converted = await prisma.coupon.groupBy({
        by: ['userId'],
        where: {
          userId: { in: userIds },
          status: 'USED',
        },
      });

      const convertedCount = converted.length;
      const conversionRate = totalUsers > 0 ? (convertedCount / totalUsers) * 100 : 0;

      // Calcular tempo médio para converter
      let avgTimeToConvert = 0;
      if (convertedCount > 0) {
        const times = await Promise.all(
          converted.map(async (c) => {
            const firstFP = await prisma.fitnessPointLog.findFirst({
              where: { userId: c.userId },
              orderBy: { createdAt: 'asc' },
            });

            const firstCoupon = await prisma.coupon.findFirst({
              where: { userId: c.userId, status: 'USED' },
              orderBy: { usedAt: 'asc' },
            });

            if (firstFP && firstCoupon?.usedAt) {
              const diffMs = firstCoupon.usedAt.getTime() - firstFP.createdAt.getTime();
              return diffMs / (1000 * 60 * 60 * 24); // em dias
            }
            return 0;
          })
        );

        avgTimeToConvert = times.reduce((sum, t) => sum + t, 0) / times.length;
      }

      return {
        fpRange: range.label,
        totalUsers,
        converted: convertedCount,
        conversionRate,
        avgTimeToConvert: Math.round(avgTimeToConvert),
      };
    })
  );

  return { cohorts };
}

/**
 * Identifica "quase convertidos" (perto de atingir threshold)
 */
export async function getAlmostConverters(): Promise<
  Array<{
    userId: string;
    userName: string;
    currentFP: number;
    nextTierFP: number;
    fpNeeded: number;
    daysActive: number;
  }>
> {
  const almostThresholds = [
    { target: 100, min: 80, max: 99 },
    { target: 200, min: 170, max: 199 },
    { target: 300, min: 270, max: 299 },
  ];

  const results: Array<{
    userId: string;
    userName: string;
    currentFP: number;
    nextTierFP: number;
    fpNeeded: number;
    daysActive: number;
  }> = [];

  for (const threshold of almostThresholds) {
    const usersNearThreshold = await prisma.fitnessPointLog.groupBy({
      by: ['userId'],
      _sum: { pointsEarned: true },
      _min: { createdAt: true },
      having: {
        pointsEarned: {
          _sum: {
            gte: threshold.min,
            lte: threshold.max,
          },
        },
      },
    });

    for (const userGroup of usersNearThreshold) {
      const user = await prisma.user.findUnique({
        where: { id: userGroup.userId },
        select: { name: true },
      });

      const currentFP = userGroup._sum.pointsEarned || 0;
      const fpNeeded = threshold.target - currentFP;

      const firstActivity = userGroup._min.createdAt;
      const daysActive = firstActivity
        ? Math.floor((Date.now() - firstActivity.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      results.push({
        userId: userGroup.userId,
        userName: user?.name || 'Usuário',
        currentFP,
        nextTierFP: threshold.target,
        fpNeeded,
        daysActive,
      });
    }
  }

  return results.sort((a, b) => a.fpNeeded - b.fpNeeded).slice(0, 20);
}
