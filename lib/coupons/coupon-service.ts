/**
 * Serviço de Cupons - Gerenciamento de resgate e validação
 * Converte FP em cupons de desconto para o App
 */

import { supabase } from '../supabase';
import { spendFP } from '../fp/fp-service';
import {
  COUPON_TIERS,
  getTierById,
  canRedeemTier,
  generateCouponCode,
  calculateExpirationDate,
  CouponTier,
} from './coupon-tiers';

export interface Coupon {
  id: string;
  userId: string;
  code: string;
  tierId: string;
  tierName: string;
  discountPercent: number;
  planType: string;
  fpCost: number;
  status: 'ACTIVE' | 'USED' | 'EXPIRED';
  createdAt: string;
  expiresAt: string;
  usedAt?: string;
  arenaSource?: string; // Qual arena gerou a conversão
}

export interface RedeemResult {
  success: boolean;
  coupon?: Coupon;
  error?: string;
  reason?: string;
}

/**
 * Resgata cupom usando FP
 */
export async function redeemCoupon(
  userId: string,
  tierId: string,
  arenaSource?: string
): Promise<RedeemResult> {
  try {
    console.log(`🎟️ Redeeming coupon: ${tierId} for user ${userId}`);

    // 1. Validar tier
    const tier = getTierById(tierId);
    if (!tier) {
      return {
        success: false,
        error: 'Tier inválido',
        reason: 'tier_not_found',
      };
    }

    // 2. Verificar saldo de FP
    const { data: user } = await supabase
      .from('User')
      .select('fpAvailable')
      .eq('id', userId)
      .single();

    if (!user) {
      return {
        success: false,
        error: 'Usuário não encontrado',
        reason: 'user_not_found',
      };
    }

    const fpBalance = user.fpAvailable || 0;

    if (!canRedeemTier(fpBalance, tierId)) {
      return {
        success: false,
        error: `FP insuficiente. Necessário: ${tier.fpCost}, Disponível: ${fpBalance}`,
        reason: 'insufficient_fp',
      };
    }

    // 3. Consumir FP
    const fpResult = await spendFP(userId, tier.fpCost, {
      description: `Resgate de cupom: ${tier.name}`,
      relatedEntityType: 'COUPON',
      relatedEntityId: tierId,
    });

    if (!fpResult.success) {
      return {
        success: false,
        error: 'Erro ao consumir FP',
        reason: fpResult.reason,
      };
    }

    // 4. Gerar código do cupom
    const code = generateCouponCode(tier, userId);
    const expiresAt = calculateExpirationDate();

    // 5. Criar cupom no banco
    const { data: coupon, error: insertError } = await supabase
      .from('Coupon')
      .insert({
        userId,
        code,
        tierId: tier.id,
        tierName: tier.name,
        discountPercent: tier.discountPercent,
        planType: tier.planType,
        fpCost: tier.fpCost,
        status: 'ACTIVE',
        expiresAt: expiresAt.toISOString(),
        arenaSource,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating coupon:', insertError);
      // TODO: Reverter consumo de FP
      return {
        success: false,
        error: 'Erro ao criar cupom',
        reason: 'database_error',
      };
    }

    console.log(`✅ Coupon redeemed: ${code}`);

    return {
      success: true,
      coupon: coupon as Coupon,
    };
  } catch (error: any) {
    console.error('Error redeeming coupon:', error);
    return {
      success: false,
      error: 'Erro interno ao resgatar cupom',
      reason: 'internal_error',
    };
  }
}

/**
 * Lista cupons do usuário
 */
export async function getUserCoupons(
  userId: string,
  options: {
    status?: 'ACTIVE' | 'USED' | 'EXPIRED';
    limit?: number;
  } = {}
): Promise<Coupon[]> {
  try {
    const { status, limit = 50 } = options;

    let query = supabase
      .from('Coupon')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching coupons:', error);
      return [];
    }

    return (data || []) as Coupon[];
  } catch (error) {
    console.error('Error in getUserCoupons:', error);
    return [];
  }
}

/**
 * Valida cupom por código
 */
export async function validateCoupon(code: string): Promise<{
  valid: boolean;
  coupon?: Coupon;
  reason?: string;
}> {
  try {
    // Buscar cupom
    const { data: coupon, error } = await supabase
      .from('Coupon')
      .select('*')
      .eq('code', code)
      .single();

    if (error || !coupon) {
      return {
        valid: false,
        reason: 'coupon_not_found',
      };
    }

    // Verificar status
    if (coupon.status !== 'ACTIVE') {
      return {
        valid: false,
        coupon: coupon as Coupon,
        reason: coupon.status === 'USED' ? 'coupon_used' : 'coupon_expired',
      };
    }

    // Verificar expiração
    const expiresAt = new Date(coupon.expiresAt);
    if (expiresAt < new Date()) {
      // Atualizar status para EXPIRED
      await supabase
        .from('Coupon')
        .update({ status: 'EXPIRED' })
        .eq('id', coupon.id);

      return {
        valid: false,
        coupon: coupon as Coupon,
        reason: 'coupon_expired',
      };
    }

    return {
      valid: true,
      coupon: coupon as Coupon,
    };
  } catch (error) {
    console.error('Error validating coupon:', error);
    return {
      valid: false,
      reason: 'validation_error',
    };
  }
}

/**
 * Marca cupom como usado
 */
export async function useCoupon(code: string): Promise<boolean> {
  try {
    // Validar primeiro
    const validation = await validateCoupon(code);

    if (!validation.valid || !validation.coupon) {
      return false;
    }

    // Marcar como usado
    const { error } = await supabase
      .from('Coupon')
      .update({
        status: 'USED',
        usedAt: new Date().toISOString(),
      })
      .eq('code', code);

    if (error) {
      console.error('Error using coupon:', error);
      return false;
    }

    console.log(`✅ Coupon used: ${code}`);
    return true;
  } catch (error) {
    console.error('Error in useCoupon:', error);
    return false;
  }
}

/**
 * Expira cupons vencidos (cron job)
 */
export async function expireOldCoupons(): Promise<number> {
  try {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('Coupon')
      .update({ status: 'EXPIRED' })
      .eq('status', 'ACTIVE')
      .lt('expiresAt', now)
      .select();

    if (error) {
      console.error('Error expiring coupons:', error);
      return 0;
    }

    const count = data?.length || 0;
    console.log(`✅ Expired ${count} coupons`);

    return count;
  } catch (error) {
    console.error('Error in expireOldCoupons:', error);
    return 0;
  }
}

/**
 * Estatísticas de conversão
 */
export async function getConversionStats(period: 'day' | 'week' | 'month' = 'week'): Promise<{
  totalRedeemed: number;
  totalUsed: number;
  totalExpired: number;
  conversionRate: number;
  byTier: Record<string, number>;
  byArena: Record<string, number>;
}> {
  try {
    // Calcular data de início do período
    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
    }

    // Buscar cupons do período
    const { data: coupons } = await supabase
      .from('Coupon')
      .select('*')
      .gte('createdAt', startDate.toISOString());

    if (!coupons) {
      return {
        totalRedeemed: 0,
        totalUsed: 0,
        totalExpired: 0,
        conversionRate: 0,
        byTier: {},
        byArena: {},
      };
    }

    // Calcular stats
    const totalRedeemed = coupons.length;
    const totalUsed = coupons.filter((c) => c.status === 'USED').length;
    const totalExpired = coupons.filter((c) => c.status === 'EXPIRED').length;
    const conversionRate = totalRedeemed > 0 ? (totalUsed / totalRedeemed) * 100 : 0;

    // Por tier
    const byTier: Record<string, number> = {};
    coupons.forEach((c) => {
      byTier[c.tierName] = (byTier[c.tierName] || 0) + 1;
    });

    // Por arena
    const byArena: Record<string, number> = {};
    coupons.forEach((c) => {
      if (c.arenaSource) {
        byArena[c.arenaSource] = (byArena[c.arenaSource] || 0) + 1;
      }
    });

    return {
      totalRedeemed,
      totalUsed,
      totalExpired,
      conversionRate,
      byTier,
      byArena,
    };
  } catch (error) {
    console.error('Error getting conversion stats:', error);
    return {
      totalRedeemed: 0,
      totalUsed: 0,
      totalExpired: 0,
      conversionRate: 0,
      byTier: {},
      byArena: {},
    };
  }
}
