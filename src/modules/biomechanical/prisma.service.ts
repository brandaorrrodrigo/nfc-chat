// ==================================
// Prisma Service - Database Client
// NFC/NFV Biomechanics System
// ==================================

import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma Service
 *
 * Gerencia conexão com banco de dados PostgreSQL via Prisma ORM.
 * Inicializa conexão ao carregar módulo e desconecta ao destruir.
 *
 * Features:
 * - Connection pooling automático
 * - Query logging (desenvolvimento)
 * - Graceful shutdown
 * - Error handling
 *
 * @example
 * ```typescript
 * // Injetar no constructor
 * constructor(private prisma: PrismaService) {}
 *
 * // Usar client
 * const user = await this.prisma.user.findUnique({
 *   where: { email: 'user@example.com' }
 * });
 * ```
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
      errorFormat: 'pretty',
    });
  }

  /**
   * Conecta ao banco ao inicializar módulo
   */
  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Prisma connected to database');
    } catch (error) {
      this.logger.error('❌ Failed to connect to database:', error);
      throw error;
    }
  }

  /**
   * Desconecta ao destruir módulo (graceful shutdown)
   */
  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('🔌 Prisma disconnected from database');
  }

  /**
   * Helper: Cleanup - Remove dados antigos
   *
   * @param days - Idade mínima em dias
   * @returns Quantidade de registros removidos
   */
  async cleanupOldAnalyses(days: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await this.videoAnalysis.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
        status: {
          in: ['completed', 'failed'],
        },
      },
    });

    this.logger.log(`🗑️  Cleaned up ${result.count} old analyses (older than ${days} days)`);
    return result.count;
  }

  /**
   * Helper: Transaction wrapper com retry
   *
   * @param fn - Função a executar em transação
   * @param maxRetries - Máximo de tentativas
   * @returns Resultado da transação
   */
  async transactionWithRetry<T>(
    fn: (tx: any) => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await this.$transaction(fn);
      } catch (error) {
        lastError = error as Error;
        this.logger.warn(`Transaction failed (attempt ${i + 1}/${maxRetries}):`, error);

        // Exponential backoff
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      }
    }

    throw lastError;
  }

  /**
   * Helper: Health check
   *
   * @returns true se conexão OK
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error('❌ Health check failed:', error);
      return false;
    }
  }
}
