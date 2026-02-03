/**
 * Social Proof Service
 * Sistema de prova social para criar FOMO
 */

import { prisma } from '@/lib/prisma';

export interface SocialProofData {
  recentRedeems: number;
  activeUsers: number;
  popularTier: {
    name: string;
    badge: string;
    count: number;
  } | null;
  urgencyMessage: string;
  scarcityLevel: 'low' | 'medium' | 'high';
}

/**
 * Obtém dados de prova social
 */
export async function getSocialProofData(
  timeWindowHours: number = 24
): Promise<SocialProofData> {
  const since = new Date(Date.now() - timeWindowHours * 60 * 60 * 1000);

  // Buscar resgates recentes
  const recentCoupons = await prisma.coupon.findMany({
    where: {
      createdAt: {
        gte: since,
      },
    },
    select: {
      tierId: true,
      tierName: true,
      userId: true,
    },
  });

  const recentRedeems = recentCoupons.length;

  // Contar usuários únicos ativos
  const uniqueUsers = new Set(recentCoupons.map((c) => c.userId));
  const activeUsers = uniqueUsers.size;

  // Encontrar tier mais popular
  const tierCounts: Record<string, { name: string; count: number }> = {};
  for (const coupon of recentCoupons) {
    if (!tierCounts[coupon.tierId]) {
      tierCounts[coupon.tierId] = { name: coupon.tierName, count: 0 };
    }
    tierCounts[coupon.tierId].count++;
  }

  const popularTierEntry = Object.entries(tierCounts).sort(
    ([, a], [, b]) => b.count - a.count
  )[0];

  const popularTier = popularTierEntry
    ? {
        name: popularTierEntry[1].name,
        badge: getTierBadge(popularTierEntry[0]),
        count: popularTierEntry[1].count,
      }
    : null;

  // Calcular nível de escassez
  const scarcityLevel = calculateScarcityLevel(recentRedeems);

  // Gerar mensagem de urgência
  const urgencyMessage = generateUrgencyMessage(
    recentRedeems,
    activeUsers,
    scarcityLevel
  );

  return {
    recentRedeems,
    activeUsers,
    popularTier,
    urgencyMessage,
    scarcityLevel,
  };
}

/**
 * Obtém atividade em tempo real (últimos 5 resgates)
 */
export async function getRecentActivity(): Promise<
  Array<{
    tierName: string;
    badge: string;
    minutesAgo: number;
    anonymousUser: string;
  }>
> {
  const recentCoupons = await prisma.coupon.findMany({
    where: {},
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
    select: {
      tierId: true,
      tierName: true,
      createdAt: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  const now = new Date();

  return recentCoupons.map((coupon) => {
    const minutesAgo = Math.floor(
      (now.getTime() - coupon.createdAt.getTime()) / (1000 * 60)
    );

    // Anonimizar nome do usuário
    const anonymousUser = coupon.user.name
      ? `${coupon.user.name.charAt(0)}***`
      : 'Usuário***';

    return {
      tierName: coupon.tierName,
      badge: getTierBadge(coupon.tierId),
      minutesAgo,
      anonymousUser,
    };
  });
}

/**
 * Obtém estatísticas de velocidade de resgate
 */
export async function getRedemptionVelocity(): Promise<{
  last1Hour: number;
  last6Hours: number;
  last24Hours: number;
  trend: 'increasing' | 'stable' | 'decreasing';
}> {
  const now = new Date();

  const [last1Hour, last6Hours, last24Hours] = await Promise.all([
    prisma.coupon.count({
      where: {
        createdAt: { gte: new Date(now.getTime() - 1 * 60 * 60 * 1000) },
      },
    }),
    prisma.coupon.count({
      where: {
        createdAt: { gte: new Date(now.getTime() - 6 * 60 * 60 * 1000) },
      },
    }),
    prisma.coupon.count({
      where: {
        createdAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
      },
    }),
  ]);

  // Calcular tendência
  const avgPerHourRecent = last1Hour;
  const avgPerHourMedium = last6Hours / 6;
  const avgPerHourFull = last24Hours / 24;

  let trend: 'increasing' | 'stable' | 'decreasing';
  if (avgPerHourRecent > avgPerHourMedium * 1.2) {
    trend = 'increasing';
  } else if (avgPerHourRecent < avgPerHourMedium * 0.8) {
    trend = 'decreasing';
  } else {
    trend = 'stable';
  }

  return {
    last1Hour,
    last6Hours,
    last24Hours,
    trend,
  };
}

/**
 * Obtém mensagem de escassez para um tier específico
 */
export async function getScarcityMessageForTier(tierId: string): Promise<string> {
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const count = await prisma.coupon.count({
    where: {
      tierId,
      createdAt: {
        gte: last24Hours,
      },
    },
  });

  // Artificial scarcity limit
  const limit = 20;
  const remaining = Math.max(0, limit - count);

  if (remaining === 0) {
    return '❌ Limite diário atingido';
  } else if (remaining <= 3) {
    return `🔥 Apenas ${remaining} disponíveis hoje!`;
  } else if (remaining <= 10) {
    return `⚡ ${remaining} resgates restantes`;
  }

  return '';
}

/**
 * Calcula nível de escassez baseado em resgates
 */
function calculateScarcityLevel(recentRedeems: number): 'low' | 'medium' | 'high' {
  if (recentRedeems >= 30) {
    return 'high';
  } else if (recentRedeems >= 15) {
    return 'medium';
  }
  return 'low';
}

/**
 * Gera mensagem de urgência baseada nos dados
 */
function generateUrgencyMessage(
  recentRedeems: number,
  activeUsers: number,
  scarcityLevel: 'low' | 'medium' | 'high'
): string {
  if (scarcityLevel === 'high') {
    return `🔥 ${recentRedeems} pessoas resgataram nas últimas 24h! Não fique de fora!`;
  } else if (scarcityLevel === 'medium') {
    return `⚡ ${activeUsers} usuários ativos estão resgatando agora!`;
  } else if (recentRedeems > 0) {
    return `✨ ${recentRedeems} resgates realizados recentemente!`;
  }

  return '🎯 Seja um dos primeiros a resgatar!';
}

/**
 * Obtém badge do tier
 */
function getTierBadge(tierId: string): string {
  const badges: Record<string, string> = {
    tier_basic: '🥉',
    tier_intermediate: '🥈',
    tier_advanced: '🥇',
  };

  return badges[tierId] || '🎟️';
}

/**
 * Verifica se deve mostrar alerta de escassez
 */
export async function shouldShowScarcityAlert(tierId: string): Promise<boolean> {
  const message = await getScarcityMessageForTier(tierId);
  return message.length > 0 && !message.startsWith('❌');
}

/**
 * Obtém estatísticas de popularidade por hora do dia
 */
export async function getPopularityByHour(): Promise<Record<number, number>> {
  const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const coupons = await prisma.coupon.findMany({
    where: {
      createdAt: {
        gte: last7Days,
      },
    },
    select: {
      createdAt: true,
    },
  });

  const hourCounts: Record<number, number> = {};

  for (const coupon of coupons) {
    const hour = coupon.createdAt.getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  }

  return hourCounts;
}

/**
 * Obtém horário de pico para mostrar na UI
 */
export async function getPeakHours(): Promise<{
  hours: number[];
  message: string;
}> {
  const hourCounts = await getPopularityByHour();

  const sortedHours = Object.entries(hourCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([hour]) => parseInt(hour));

  const peakHours = sortedHours.slice(0, 3);

  const message =
    peakHours.length > 0
      ? `📊 Horários de maior atividade: ${peakHours.map((h) => `${h}h`).join(', ')}`
      : '';

  return {
    hours: peakHours,
    message,
  };
}
