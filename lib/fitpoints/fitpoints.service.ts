/**
 * FitPoints Service
 *
 * Gerencia sistema de pontos (FitPoints) para monetização de features.
 * Responsável por adicionar, deduzir, reembolsar e consultar saldo de FPs.
 */

import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

// ============================================
// TYPES
// ============================================

export interface DeductFitPointsInput {
  user_id: string;
  amount: number;
  category: string;
  description: string;
  reference_id?: string;
  metadata?: any;
}

export interface AddFitPointsInput {
  user_id: string;
  amount: number;
  transaction_type: 'reward' | 'bonus' | 'refund' | 'purchase';
  description: string;
  metadata?: any;
}

export class InsufficientFitPointsError extends Error {
  constructor(
    public required: number,
    public available: number
  ) {
    super(
      `Insufficient FitPoints. Required: ${required}, Available: ${available}`
    );
    this.name = 'InsufficientFitPointsError';
  }
}

// ============================================
// FITPOINTS SERVICE
// ============================================

export class FitPointsService {
  /**
   * Verifica saldo de FitPoints do usuário
   */
  async getBalance(userId: string): Promise<number> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { fitpoints_balance: true },
    });

    return user?.fitpoints_balance || 0;
  }

  /**
   * Obtém estatísticas completas de FitPoints
   */
  async getStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        fitpoints_balance: true,
        fitpoints_lifetime: true,
        subscription_tier: true,
        subscription_status: true,
        free_baseline_used: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Total gasto = lifetime - balance
    const total_spent = user.fitpoints_lifetime - user.fitpoints_balance;

    return {
      balance: user.fitpoints_balance,
      lifetime: user.fitpoints_lifetime,
      spent: total_spent,
      subscription: {
        tier: user.subscription_tier,
        status: user.subscription_status,
      },
      quotas: {
        free_baseline_used: user.free_baseline_used,
      },
    };
  }

  /**
   * Deduz FitPoints do usuário
   */
  async deductFitPoints(input: DeductFitPointsInput): Promise<void> {
    console.log(`💰 Deducting ${input.amount} FPs from user ${input.user_id}`);

    const user = await prisma.user.findUnique({
      where: { id: input.user_id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.fitpoints_balance < input.amount) {
      throw new InsufficientFitPointsError(
        input.amount,
        user.fitpoints_balance
      );
    }

    // Transação atômica
    await prisma.$transaction(async (tx) => {
      // 1. Deduzir saldo
      const updatedUser = await tx.user.update({
        where: { id: input.user_id },
        data: {
          fitpoints_balance: {
            decrement: input.amount,
          },
        },
      });

      // 2. Registrar transação
      await tx.fitPointsTransaction.create({
        data: {
          user_id: input.user_id,
          amount: -input.amount,
          balance_after: updatedUser.fitpoints_balance,
          transaction_type: 'spend',
          category: input.category,
          description: input.description,
          reference_id: input.reference_id,
          metadata: input.metadata || null,
        },
      });
    });

    console.log(
      `✅ Deducted ${input.amount} FPs (category: ${input.category})`
    );
  }

  /**
   * Adiciona FitPoints ao usuário
   */
  async addFitPoints(input: AddFitPointsInput): Promise<void> {
    console.log(`💰 Adding ${input.amount} FPs to user ${input.user_id}`);

    await prisma.$transaction(async (tx) => {
      // 1. Adicionar saldo
      const updatedUser = await tx.user.update({
        where: { id: input.user_id },
        data: {
          fitpoints_balance: {
            increment: input.amount,
          },
          fitpoints_lifetime: {
            increment: input.amount,
          },
        },
      });

      // 2. Registrar transação
      await tx.fitPointsTransaction.create({
        data: {
          user_id: input.user_id,
          amount: input.amount,
          balance_after: updatedUser.fitpoints_balance,
          transaction_type: input.transaction_type,
          category: 'system',
          description: input.description,
          metadata: input.metadata || null,
        },
      });
    });

    console.log(
      `✅ Added ${input.amount} FPs (type: ${input.transaction_type})`
    );
  }

  /**
   * Histórico de transações
   */
  async getTransactionHistory(userId: string, limit: number = 50) {
    return await prisma.fitPointsTransaction.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: limit,
    });
  }

  /**
   * Reembolsa FitPoints (em caso de erro)
   */
  async refundFitPoints(transactionId: string): Promise<void> {
    const transaction = await prisma.fitPointsTransaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction || transaction.amount >= 0) {
      throw new Error('Invalid transaction for refund');
    }

    const refundAmount = Math.abs(transaction.amount);

    console.log(`🔄 Refunding ${refundAmount} FPs (transaction: ${transactionId})`);

    await this.addFitPoints({
      user_id: transaction.user_id,
      amount: refundAmount,
      transaction_type: 'refund',
      description: `Refund: ${transaction.description}`,
      metadata: { original_transaction_id: transactionId },
    });

    console.log(`✅ Refunded ${refundAmount} FPs to user ${transaction.user_id}`);
  }

  /**
   * Verifica se usuário tem saldo suficiente
   */
  async hasSufficientBalance(
    userId: string,
    requiredAmount: number
  ): Promise<boolean> {
    const balance = await this.getBalance(userId);
    return balance >= requiredAmount;
  }

  /**
   * Calcula quanto falta para comprar algo
   */
  async calculateShortfall(
    userId: string,
    requiredAmount: number
  ): Promise<number> {
    const balance = await this.getBalance(userId);
    const shortfall = requiredAmount - balance;
    return shortfall > 0 ? shortfall : 0;
  }
}

// ============================================
// EXPORT SINGLETON
// ============================================

export const fitpointsService = new FitPointsService();
