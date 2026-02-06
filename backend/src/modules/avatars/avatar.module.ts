import { Module } from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { AvatarGeneratorService } from './avatar-generator.service';

/**
 * Módulo de Avatares
 *
 * Responsável por:
 * - Atribuição inteligente de avatares baseada em critérios (sexo, idade, biotipo, objetivo)
 * - Geração de avatares SVG com iniciais (fallback)
 * - Migração de dados existentes
 * - Estatísticas de uso
 *
 * IMPORTANTE: Avatares são atribuídos pelo BACKEND, NUNCA pelo LLM
 */
@Module({
  providers: [AvatarService, AvatarGeneratorService],
  exports: [AvatarService, AvatarGeneratorService],
})
export class AvatarModule {}
