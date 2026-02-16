// ==================================
// Prisma Module
// NFC/NFV Biomechanics System
// ==================================

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Prisma Module
 *
 * Módulo global que exporta PrismaService para todos os módulos da aplicação.
 * Marcado com @Global() para evitar imports repetidos.
 *
 * @example
 * ```typescript
 * // No app.module.ts
 * @Module({
 *   imports: [PrismaModule, ...],
 *   ...
 * })
 *
 * // Em qualquer módulo
 * constructor(private prisma: PrismaService) {}
 * ```
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
