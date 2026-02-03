/**
 * Combo Service
 * Sistema de cupons empilháveis
 */

import { prisma } from '@/lib/prisma';

export interface ComboCoupon {
  code: string;
  type: 'tier' | 'referral' | 'event';
  discount: number;
}

export interface ComboResult {
  coupons: ComboCoupon[];
  totalDiscount: number;
  finalDiscount: number; // Limitado a 40%
  isValid: boolean;
  errors: string[];
}

const MAX_COMBO_DISCOUNT = 40;
const MAX_COUPONS_PER_COMBO = 3;

export async function validateCombo(
  userId: string,
  couponCodes: string[]
): Promise<ComboResult> {
  const errors: string[] = [];
  const coupons: ComboCoupon[] = [];

  // Limite de cupons
  if (couponCodes.length > MAX_COUPONS_PER_COMBO) {
    errors.push(`Máximo ${MAX_COUPONS_PER_COMBO} cupons por combo`);
    return {
      coupons: [],
      totalDiscount: 0,
      finalDiscount: 0,
      isValid: false,
      errors,
    };
  }

  // Validar cada cupom
  for (const code of couponCodes) {
    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      errors.push(`Cupom ${code} não encontrado`);
      continue;
    }

    if (coupon.userId !== userId) {
      errors.push(`Cupom ${code} não pertence ao usuário`);
      continue;
    }

    if (coupon.status !== 'ACTIVE') {
      errors.push(`Cupom ${code} não está ativo`);
      continue;
    }

    if (coupon.expiresAt < new Date()) {
      errors.push(`Cupom ${code} expirado`);
      continue;
    }

    // Determinar tipo
    let type: 'tier' | 'referral' | 'event' = 'tier';
    if (coupon.tierId.startsWith('referral_')) {
      type = 'referral';
    } else if (coupon.tierId.startsWith('event_')) {
      type = 'event';
    }

    coupons.push({
      code: coupon.code,
      type,
      discount: coupon.discountPercent,
    });
  }

  // Calcular desconto total
  const totalDiscount = coupons.reduce((sum, c) => sum + c.discount, 0);
  const finalDiscount = Math.min(totalDiscount, MAX_COMBO_DISCOUNT);

  return {
    coupons,
    totalDiscount,
    finalDiscount,
    isValid: errors.length === 0 && coupons.length > 0,
    errors,
  };
}

export async function applyCombo(
  userId: string,
  couponCodes: string[]
): Promise<{ success: boolean; finalDiscount?: number; error?: string }> {
  const validation = await validateCombo(userId, couponCodes);

  if (!validation.isValid) {
    return {
      success: false,
      error: validation.errors.join(', '),
    };
  }

  // Marcar cupons como usados
  for (const code of couponCodes) {
    await prisma.coupon.update({
      where: { code },
      data: {
        status: 'USED',
        usedAt: new Date(),
      },
    });
  }

  // Registrar combo
  await prisma.couponCombo.create({
    data: {
      userId,
      couponCodes: couponCodes.join(','),
      totalDiscount: validation.totalDiscount,
      finalDiscount: validation.finalDiscount,
    },
  });

  return {
    success: true,
    finalDiscount: validation.finalDiscount,
  };
}
