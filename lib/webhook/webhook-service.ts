/**
 * Webhook Service
 * Integração com App Premium para aplicação automática de cupons
 */

import { prisma } from '@/lib/prisma';

export interface WebhookPayload {
  event: 'coupon.apply' | 'coupon.used' | 'coupon.failed';
  couponCode: string;
  userId: string;
  timestamp: string;
  metadata?: any;
}

export async function sendCouponWebhook(
  couponCode: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const webhookUrl = process.env.APP_PREMIUM_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('⚠️ APP_PREMIUM_WEBHOOK_URL not configured');
    return { success: false, error: 'webhook_not_configured' };
  }

  const coupon = await prisma.coupon.findUnique({
    where: { code: couponCode },
    select: { code: true, discountPercent: true, planType: true, userId: true },
  });

  if (!coupon) {
    return { success: false, error: 'coupon_not_found' };
  }

  const payload: WebhookPayload = {
    event: 'coupon.apply',
    couponCode,
    userId,
    timestamp: new Date().toISOString(),
    metadata: {
      discountPercent: coupon.discountPercent,
      planType: coupon.planType,
    },
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': process.env.WEBHOOK_SECRET || '',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status}`);
    }

    console.log(`✅ Webhook sent successfully for coupon ${couponCode}`);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Webhook error:', error);
    return { success: false, error: error.message };
  }
}

export async function handleWebhookCallback(
  event: 'coupon.used' | 'coupon.failed',
  couponCode: string,
  metadata?: any
): Promise<void> {
  const coupon = await prisma.coupon.findUnique({
    where: { code: couponCode },
  });

  if (!coupon) return;

  if (event === 'coupon.used') {
    await prisma.coupon.update({
      where: { code: couponCode },
      data: {
        status: 'USED',
        usedAt: new Date(),
      },
    });

    // Completar referral se existir
    const { completeReferral } = await import('@/lib/referral/referral-service');
    await completeReferral(coupon.userId);

    console.log(`✅ Coupon ${couponCode} marked as USED`);
  }
}
