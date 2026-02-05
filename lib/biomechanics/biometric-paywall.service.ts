/**
 * Biometric Paywall Service
 *
 * Gerencia paywall estratégico para avaliações biométricas:
 * - Baseline: Grátis (1x lifetime) para Free, Ilimitado para Premium
 * - Comparação: 25 FPs para Free, Ilimitado para Premium
 * - Export PDF: 15 FPs para Free, Ilimitado para Premium
 */

import { PrismaClient } from '../generated/prisma';
import { fitpointsService, InsufficientFitPointsError } from '../fitpoints/fitpoints.service';

const prisma = new PrismaClient();

// ============================================
// TYPES
// ============================================

export interface PaywallCheckResult {
  allowed: boolean;
  reason?: string;
  cost_fps?: number;
  payment_required: boolean;
  payment_method?: 'fitpoints' | 'subscription' | 'free_quota';
  current_balance?: number;
  shortfall?: number;
}

export interface PaymentResult {
  method: 'fitpoints' | 'subscription' | 'free_quota';
  transaction_id?: string;
  cost_fps: number;
}

export class PaywallBlockedError extends Error {
  constructor(
    public reason: string,
    public cost_fps?: number,
    public shortfall?: number
  ) {
    super(reason);
    this.name = 'PaywallBlockedError';
  }
}

// ============================================
// BIOMETRIC PAYWALL SERVICE
// ============================================

export class BiometricPaywallService {
  // Preços fixos (podem vir do banco depois via BiometricPricing)
  private readonly BASELINE_COST_FPS = 0; // Primeira grátis
  private readonly COMPARISON_COST_FPS = 25;
  private readonly EXPORT_PDF_COST_FPS = 15;

  /**
   * Verifica se usuário pode criar baseline
   */
  async checkBaselineAccess(userId: string): Promise<PaywallCheckResult> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        free_baseline_used: true,
        subscription_tier: true,
        subscription_status: true,
        fitpoints_balance: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Premium: sempre pode
    if (
      (user.subscription_tier === 'premium' ||
        user.subscription_tier === 'premium_plus') &&
      user.subscription_status === 'active'
    ) {
      return {
        allowed: true,
        payment_required: false,
        payment_method: 'subscription',
      };
    }

    // Free: primeira baseline grátis
    if (!user.free_baseline_used) {
      return {
        allowed: true,
        payment_required: false,
        payment_method: 'free_quota',
        cost_fps: 0,
      };
    }

    // Já usou grátis: precisa assinar Premium
    return {
      allowed: false,
      payment_required: true,
      reason:
        'Baseline gratuita já utilizada. Assine Premium para avaliações ilimitadas ou adquira FitPoints.',
      cost_fps: 0, // Baseline adicional não tem preço, só Premium
      current_balance: user.fitpoints_balance,
    };
  }

  /**
   * Verifica se usuário pode criar comparação
   */
  async checkComparisonAccess(userId: string): Promise<PaywallCheckResult> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscription_tier: true,
        subscription_status: true,
        fitpoints_balance: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Premium: sempre pode
    if (
      (user.subscription_tier === 'premium' ||
        user.subscription_tier === 'premium_plus') &&
      user.subscription_status === 'active'
    ) {
      return {
        allowed: true,
        payment_required: false,
        payment_method: 'subscription',
      };
    }

    // Free: precisa FitPoints
    if (user.fitpoints_balance >= this.COMPARISON_COST_FPS) {
      return {
        allowed: true,
        payment_required: true,
        payment_method: 'fitpoints',
        cost_fps: this.COMPARISON_COST_FPS,
        current_balance: user.fitpoints_balance,
      };
    }

    // Saldo insuficiente
    const shortfall = this.COMPARISON_COST_FPS - user.fitpoints_balance;

    return {
      allowed: false,
      payment_required: true,
      reason: `Saldo insuficiente de FitPoints. Necessário: ${this.COMPARISON_COST_FPS} FPs. Você tem: ${user.fitpoints_balance} FPs. Faltam: ${shortfall} FPs.`,
      cost_fps: this.COMPARISON_COST_FPS,
      current_balance: user.fitpoints_balance,
      shortfall,
    };
  }

  /**
   * Processa pagamento de baseline
   */
  async processBaselinePayment(userId: string): Promise<PaymentResult> {
    const access = await this.checkBaselineAccess(userId);

    if (!access.allowed && !access.payment_required) {
      throw new PaywallBlockedError(access.reason!);
    }

    // Se é grátis (primeira vez)
    if (access.payment_method === 'free_quota') {
      await prisma.user.update({
        where: { id: userId },
        data: { free_baseline_used: true },
      });

      console.log(`🎁 User ${userId} used free baseline quota`);

      return {
        method: 'free_quota',
        cost_fps: 0,
      };
    }

    // Se é Premium
    if (access.payment_method === 'subscription') {
      return {
        method: 'subscription',
        cost_fps: 0,
      };
    }

    // Se precisa pagar FitPoints (não deveria chegar aqui para baseline)
    throw new PaywallBlockedError(
      'Baseline adicional requer assinatura Premium'
    );
  }

  /**
   * Processa pagamento de comparação
   */
  async processComparisonPayment(
    userId: string,
    comparisonId: string
  ): Promise<PaymentResult> {
    const access = await this.checkComparisonAccess(userId);

    if (!access.allowed) {
      throw new PaywallBlockedError(
        access.reason!,
        access.cost_fps,
        access.shortfall
      );
    }

    // Se é Premium
    if (access.payment_method === 'subscription') {
      return {
        method: 'subscription',
        cost_fps: 0,
      };
    }

    // Se paga com FitPoints
    if (access.payment_method === 'fitpoints') {
      await fitpointsService.deductFitPoints({
        user_id: userId,
        amount: this.COMPARISON_COST_FPS,
        category: 'biometric_analysis',
        description: 'Avaliação Biométrica Comparativa',
        reference_id: comparisonId,
        metadata: {
          type: 'comparison',
          cost: this.COMPARISON_COST_FPS,
        },
      });

      // Buscar transaction_id
      const transactions = await fitpointsService.getTransactionHistory(
        userId,
        1
      );

      return {
        method: 'fitpoints',
        transaction_id: transactions[0]?.id,
        cost_fps: this.COMPARISON_COST_FPS,
      };
    }

    throw new Error('Invalid payment method');
  }

  /**
   * Verifica acesso a export PDF
   */
  async checkExportAccess(userId: string): Promise<PaywallCheckResult> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscription_tier: true,
        subscription_status: true,
        fitpoints_balance: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Premium: sempre pode
    if (
      (user.subscription_tier === 'premium' ||
        user.subscription_tier === 'premium_plus') &&
      user.subscription_status === 'active'
    ) {
      return {
        allowed: true,
        payment_required: false,
        payment_method: 'subscription',
      };
    }

    // Free: precisa FitPoints
    if (user.fitpoints_balance >= this.EXPORT_PDF_COST_FPS) {
      return {
        allowed: true,
        payment_required: true,
        payment_method: 'fitpoints',
        cost_fps: this.EXPORT_PDF_COST_FPS,
      };
    }

    const shortfall = this.EXPORT_PDF_COST_FPS - user.fitpoints_balance;

    return {
      allowed: false,
      payment_required: true,
      reason: `Saldo insuficiente. Necessário: ${this.EXPORT_PDF_COST_FPS} FPs.`,
      cost_fps: this.EXPORT_PDF_COST_FPS,
      current_balance: user.fitpoints_balance,
      shortfall,
    };
  }

  /**
   * Obtém saldo do usuário (delegação ao FitPointsService)
   */
  async getUserBalance(userId: string): Promise<number> {
    return await fitpointsService.getBalance(userId);
  }

  /**
   * Obtém estatísticas do usuário
   */
  async getUserStats(userId: string) {
    return await fitpointsService.getStats(userId);
  }
}

// ============================================
// EXPORT SINGLETON
// ============================================

export const biometricPaywall = new BiometricPaywallService();
