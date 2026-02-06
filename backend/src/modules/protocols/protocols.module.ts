/**
 * Protocols Module
 *
 * Módulo de geração de protocolos corretivos baseado em regras determinísticas
 *
 * Serviços:
 * - ProtocolMatcherService: Orquestrador principal (LAYER 3)
 * - ProtocolLoaderService: Carregamento com cache L4
 * - ProtocolValidatorService: Validação de protocolos
 * - ProtocolPersonalizerService: 5 regras de personalização
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '../cache/cache.module';
import { ProtocolMatcherService } from './protocol-matcher.service';
import { ProtocolLoaderService } from './protocol-loader.service';
import { ProtocolValidatorService } from './protocol-validator.service';
import { ProtocolPersonalizerService } from './protocol-personalizer.service';

@Module({
  imports: [ConfigModule, CacheModule],
  providers: [
    ProtocolMatcherService,
    ProtocolLoaderService,
    ProtocolValidatorService,
    ProtocolPersonalizerService,
  ],
  exports: [ProtocolMatcherService, ProtocolLoaderService],
})
export class ProtocolsModule {}
