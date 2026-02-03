/**
 * Events Service
 * Sistema de eventos especiais automatizados
 */

import { prisma } from '@/lib/prisma';

export interface SpecialEvent {
  id: string;
  name: string;
  type: 'fp_multiplier' | 'discount_boost' | 'challenge';
  multiplier?: number;
  discountBoost?: number;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
}

const RECURRING_EVENTS = [
  {
    id: 'friday_fp_double',
    name: 'FP em Dobro - Sexta-feira',
    type: 'fp_multiplier' as const,
    multiplier: 2,
    dayOfWeek: 5, // Friday
  },
  {
    id: 'black_friday',
    name: 'Black Friday Tech',
    type: 'discount_boost' as const,
    discountBoost: 50,
    month: 10, // November
    day: 25,
  },
];

export function getActiveEvent(): SpecialEvent | null {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const month = now.getMonth();
  const day = now.getDate();

  // Friday FP Double
  if (dayOfWeek === 5) {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    return {
      id: 'friday_fp_double',
      name: 'FP em Dobro - Sexta-feira',
      type: 'fp_multiplier',
      multiplier: 2,
      isActive: true,
      startDate: start,
      endDate: end,
    };
  }

  // Black Friday
  if (month === 10 && day === 25) {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    return {
      id: 'black_friday',
      name: 'Black Friday Tech',
      type: 'discount_boost',
      discountBoost: 50,
      isActive: true,
      startDate: start,
      endDate: end,
    };
  }

  return null;
}

export async function applyEventBonus(
  userId: string,
  activityType: string,
  basePoints: number
): Promise<number> {
  const event = getActiveEvent();

  if (!event || event.type !== 'fp_multiplier') {
    return basePoints;
  }

  const bonusPoints = basePoints * (event.multiplier! - 1);

  await prisma.fitnessPointLog.create({
    data: {
      userId,
      activityType: `${activityType}_event_bonus`,
      pointsEarned: bonusPoints,
      metadata: {
        eventId: event.id,
        basePoints,
        multiplier: event.multiplier,
      },
    },
  });

  return basePoints + bonusPoints;
}
