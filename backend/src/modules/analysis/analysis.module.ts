import { Module } from '@nestjs/common';
import { QuickAnalysisService } from './quick-analysis.service';
import { DecisionEngineService } from './decision-engine.service';
import { PrismaModule } from '../prisma/prisma.module';
import { GoldStandardsModule } from '../gold-standards/gold-standards.module';

/**
 * Módulo de Análise - Pipeline Híbrido
 *
 * Responsável por:
 * - Análise rápida com comparação a gold standards
 * - Decisão inteligente sobre análise profunda
 * - Detecção de desvios biomecânicos
 * - Cálculo de similaridade e scores
 *
 * @module AnalysisModule
 */
@Module({
  imports: [
    PrismaModule,           // Acesso ao banco de dados
    GoldStandardsModule,    // Gold standards e similarity calculator
  ],
  providers: [
    QuickAnalysisService,
    DecisionEngineService,
  ],
  exports: [
    QuickAnalysisService,
    DecisionEngineService,
  ],
})
export class AnalysisModule {}
