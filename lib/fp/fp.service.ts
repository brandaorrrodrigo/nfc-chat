/**
 * FP Service
 *
 * Gerencia sistema de pontos (FP) para monetização de features.
 * Responsável por adicionar, deduzir, reembolsar e consultar saldo de FPs.
 */

import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

// ============================================
// TYPES
// ============================================

export interface DeductFPInput {
  user_id: string;
  amount: number;
  category: string;
  description: string;
  reference_id?: string;
  metadata?: any;
}

export interface AddFPInput {
  user_id: string;
  amount: number;
  transaction_type: 'reward' | 'bonus' | 'refund' | 'purchase';
  description: string;
  metadata?: any;
}

export class InsufficientFPError extends Error {
  constructor(
    public required: number,
    public available: number
  ) {
    super(
      `Insufficient FP. Required: ${required}, Available: ${available}`
    );
    this.name = 'InsufficientFPError';
  }
}

// ============================================
// FP SERVICE
// ============================================

export class FPService {
  /**
   * Verifica saldo de FP do usuário
   */
  async getBalance(userId: string): Promise<number> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { fp_balance: true },
    });

    return user?.fp_balance || 0;
  }

  /**
   * Obtém estatísticas completas de FP
   */
  async getStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        fp_balance: true,
        fp_lifetime: true,
        subscription_tier: true,
        subscription_status: true,
        free_baseline_used: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Total gasto = lifetime - balance
    const total_spent = user.fp_lifetime - user.fp_balance;

    return {
      balance: user.fp_balance,
      lifetime: user.fp_lifetime,
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
   * Deduz FP do usuário
   */
  async deductFP(input: DeductFPInput): Promise<void> {
    console.log(`💰 Deducting ${input.amount} FPs from user ${input.user_id}`);

    const user = await prisma.user.findUnique({
      where: { id: input.user_id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.fp_balance < input.amount) {
      throw new InsufficientFPError(
        input.amount,
        user.fp_balance
      );
    }

    // Transação atômica
    await prisma.$transaction(async (tx) => {
      // 1. Deduzir saldo
      const updatedUser = await tx.user.update({
        where: { id: input.user_id },
        data: {
          fp_balance: {
            decrement: input.amount,
          },
        },
      });

      // 2. Registrar transação
      await tx.biometricFPTransaction.create({
        data: {
          user_id: input.user_id,
          amount: -input.amount,
          balance_after: updatedUser.fp_balance,
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
   * Adiciona FP ao usuário
   */
  async addFP(input: AddFPInput): Promise<void> {
    console.log(`💰 Adding ${input.amount} FPs to user ${input.user_id}`);

    await prisma.$transaction(async (tx) => {
      // 1. Adicionar saldo
      const updatedUser = await tx.user.update({
        where: { id: input.user_id },
        data: {
          fp_balance: {
            increment: input.amount,
          },
          fp_lifetime: {
            increment: input.amount,
          },
        },
      });

      // 2. Registrar transação
      await tx.biometricFPTransaction.create({
        data: {
          user_id: input.user_id,
          amount: input.amount,
          balance_after: updatedUser.fp_balance,
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
    return await prisma.biometricFPTransaction.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: limit,
    });
  }

  /**
   * Reembolsa FP (em caso de erro)
   */
  async refundFP(transactionId: string): Promise<void> {
    const transaction = await prisma.biometricFPTransaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction || transaction.amount >= 0) {
      throw new Error('Invalid transaction for refund');
    }

    const refundAmount = Math.abs(transaction.amount);

    console.log(`🔄 Refunding ${refundAmount} FPs (transaction: ${transactionId})`);

    await this.addFP({
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

export const fpService = new FPService();
