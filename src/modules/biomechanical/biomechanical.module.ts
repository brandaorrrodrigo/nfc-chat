/**
 * Módulo de Análise Biomecânica
 *
 * Módulo NestJS que fornece funcionalidades de upload,
 * processamento e análise biomecânica de vídeos.
 */

import { Module } from '@nestjs/common';
import { BiomechanicalController } from './biomechanical.controller';
import { BiomechanicalService } from './biomechanical.service';

@Module({
  imports: [],
  controllers: [BiomechanicalController],
  providers: [BiomechanicalService],
  exports: [BiomechanicalService]
})
export class BiomechanicalModule {}
