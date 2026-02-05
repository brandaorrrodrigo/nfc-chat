import { Module } from '@nestjs/common';
import { SimilarityCalculatorService } from './similarity-calculator.service';
import { GoldStandardService } from './gold-standard.service';
import { PrismaModule } from '../prisma/prisma.module';

/**
 * Módulo de Gold Standards
 *
 * Responsável por:
 * - Gerenciar padrões ouro de execução
 * - Calcular similaridade entre movimentos
 * - Fornecer referências biomecânicas
 *
 * @module GoldStandardsModule
 */
@Module({
  imports: [PrismaModule],
  providers: [
    GoldStandardService,
    SimilarityCalculatorService,
  ],
  exports: [
    GoldStandardService,
    SimilarityCalculatorService,
  ],
})
export class GoldStandardsModule {}
