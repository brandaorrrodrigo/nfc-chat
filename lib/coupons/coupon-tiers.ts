/**
 * Tiers de Cupons - Definição de recompensas por FP
 * Sistema de conversão de engajamento em vendas
 */

export interface CouponTier {
  id: string;
  name: string;
  fpCost: number;
  discountPercent: number;
  planType: 'monthly' | 'quarterly' | 'annual';
  description: string;
  badge: string;
}

/**
 * Tiers de cupons disponíveis
 */
export const COUPON_TIERS: CouponTier[] = [
  {
    id: 'tier_basic',
    name: 'Iniciante Engajado',
    fpCost: 100,
    discountPercent: 5,
    planType: 'monthly',
    description: '5% de desconto no plano mensal',
    badge: '🥉',
  },
  {
    id: 'tier_intermediate',
    name: 'Contribuidor Ativo',
    fpCost: 200,
    discountPercent: 15,
    planType: 'quarterly',
    description: '15% de desconto no plano trimestral',
    badge: '🥈',
  },
  {
    id: 'tier_advanced',
    name: 'Autoridade Técnica',
    fpCost: 300,
    discountPercent: 30,
    planType: 'annual',
    description: '30% de desconto no plano anual',
    badge: '🥇',
  },
];

/**
 * Obtém tier por ID
 */
export function getTierById(tierId: string): CouponTier | undefined {
  return COUPON_TIERS.find((t) => t.id === tierId);
}

/**
 * Obtém tier por custo de FP
 */
export function getTierByFPCost(fpCost: number): CouponTier | undefined {
  return COUPON_TIERS.find((t) => t.fpCost === fpCost);
}

/**
 * Obtém tiers disponíveis para um saldo de FP
 */
export function getAvailableTiers(fpBalance: number): CouponTier[] {
  return COUPON_TIERS.filter((t) => fpBalance >= t.fpCost);
}

/**
 * Valida se usuário pode resgatar tier
 */
export function canRedeemTier(fpBalance: number, tierId: string): boolean {
  const tier = getTierById(tierId);
  if (!tier) return false;
  return fpBalance >= tier.fpCost;
}

/**
 * Calcula preço final com desconto
 */
export function calculateDiscountedPrice(
  originalPrice: number,
  discountPercent: number
): number {
  return originalPrice * (1 - discountPercent / 100);
}

/**
 * Gera código de cupom único
 */
export function generateCouponCode(tier: CouponTier, userId: string): string {
  const prefix = 'NFC';
  const tierCode = tier.planType.substring(0, 3).toUpperCase(); // MON, QUA, ANN
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `${prefix}${tierCode}${random}`;
}

/**
 * Tempo de expiração padrão (48 horas)
 */
export const COUPON_EXPIRATION_HOURS = 48;

/**
 * Calcula data de expiração
 */
export function calculateExpirationDate(): Date {
  const now = new Date();
  now.setHours(now.getHours() + COUPON_EXPIRATION_HOURS);
  return now;
}
