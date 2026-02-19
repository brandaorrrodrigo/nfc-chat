/**
 * Reactivation Service
 * Sistema de segunda chance para cupons expirados
 */

import { prisma } from '@/lib/prisma';

export async function reactivateCoupon(
  couponId: string,
  userId: string
): Promise<{ success: boolean; newCoupon?: any; error?: string }> {
  const coupon = await prisma.coupon.findUnique({
    where: { id: couponId },
  });

  if (!coupon || coupon.userId !== userId) {
    return { success: false, error: 'coupon_not_found' };
  }

  if (coupon.status !== 'EXPIRED') {
    return { success: false, error: 'coupon_not_expired' };
  }

  // Verificar se já reativou este cupom
  const alreadyReactivated = await prisma.couponReactivation.findUnique({
    where: { originalCouponId: couponId },
  });

  if (alreadyReactivated) {
    return { success: false, error: 'already_reactivated' };
  }

  // Cobrar 20% dos FP (80% de reembolso)
  const fpCost = Math.ceil(coupon.fpCost * 0.2);

  // Verificar saldo
  const fpLog = await prisma.fitnessPointLog.findMany({
    where: { userId },
    select: { pointsEarned: true },
  });
  const currentFP = fpLog.reduce((sum, log) => sum + log.pointsEarned, 0);

  if (currentFP < fpCost) {
    return { success: false, error: 'insufficient_fp' };
  }

  // Consumir FP
  await prisma.fitnessPointLog.create({
    data: {
      userId,
      activityType: 'coupon_reactivation',
      pointsEarned: -fpCost,
      metadata: { originalCouponId: couponId },
    },
  });

  // Criar novo cupom
  const { generateCouponCode } = await import('@/lib/coupons/coupon-tiers');
  const newCode = generateCouponCode(coupon as any, userId);

  const newCoupon = await prisma.coupon.create({
    data: {
      userId,
      code: newCode,
      tierId: coupon.tierId,
      tierName: coupon.tierName,
      discountPercent: coupon.discountPercent,
      planType: coupon.planType,
      fpCost: coupon.fpCost,
      status: 'ACTIVE',
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      arenaSource: coupon.arenaSource,
    },
  });

  // Registrar reativação
  await prisma.couponReactivation.create({
    data: {
      originalCouponId: couponId,
      newCouponId: newCoupon.id,
      fpCharged: fpCost,
    },
  });

  // Notificação
  await prisma.notification.create({
    data: {
      userId,
      type: 'coupon_reactivated',
      title: '🔄 Cupom Reativado!',
      message: `Seu cupom foi reativado por ${fpCost} FP. Válido por mais 48h!`,
      metadata: { newCode, fpCharged: fpCost },
    },
  });

  return { success: true, newCoupon };
}
