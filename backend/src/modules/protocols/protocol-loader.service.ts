/**
 * Protocol Loader Service
 *
 * Responsável por carregar protocolos corretivos do filesystem e gerenciar cache L4
 * Cache L4: Memória, TTL infinito, FIFO eviction
 *
 * Estrutura de diretórios:
 * reference-data/corrective-protocols/
 *   ├── knee_valgus/
 *   │   ├── mild.json
 *   │   ├── moderate.json
 *   │   └── severe.json
 *   ├── butt_wink/
 *   │   └── ...
 */

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '../cache/cache.service';
import { BaseProtocol } from './interfaces/protocol.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProtocolLoaderService implements OnModuleInit {
  private readonly logger = new Logger(ProtocolLoaderService.name);
  private readonly protocolsPath: string;
  private readonly cacheLevel = 'L4_PROTOCOLS';

  constructor(
    private cache: CacheService,
    private configService: ConfigService,
  ) {
    // Caminho para protocolos (../../reference-data/corrective-protocols)
    this.protocolsPath = path.join(
      process.cwd(),
      '..',
      'reference-data',
      'corrective-protocols',
    );
  }

  /**
   * Pre-carrega todos os protocolos no cache L4 na inicialização
   */
  async onModuleInit() {
    this.logger.log('Pre-loading corrective protocols to L4 cache...');

    const startTime = Date.now();
    let loadedCount = 0;
    let errorCount = 0;

    try {
      // Verificar se diretório existe
      if (!fs.existsSync(this.protocolsPath)) {
        this.logger.warn(
          `Protocols directory not found: ${this.protocolsPath}. Skipping pre-load.`,
        );
        return;
      }

      // Listar tipos de desvio (diretórios)
      const deviationTypes = fs
        .readdirSync(this.protocolsPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

      this.logger.debug(
        `Found ${deviationTypes.length} deviation types`,
      );

      // Para cada tipo de desvio, carregar severidades
      for (const deviationType of deviationTypes) {
        const deviationPath = path.join(this.protocolsPath, deviationType);
        const severityFiles = fs
          .readdirSync(deviationPath)
          .filter((f) => f.endsWith('.json'));

        for (const file of severityFiles) {
          const severity = path.basename(file, '.json'); // 'mild', 'moderate', 'severe'

          try {
            await this.loadProtocol(deviationType, severity as any);
            loadedCount++;
          } catch (error) {
            const err = error as Error;
            this.logger.error(
              `Failed to pre-load ${deviationType}/${severity}: ${err.message}`,
            );
            errorCount++;
          }
        }
      }

      const duration = Date.now() - startTime;
      this.logger.log(
        `Pre-loaded ${loadedCount} protocols in ${duration}ms (${errorCount} errors)`,
      );
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to pre-load protocols: ${err.message}`,
        err.stack,
      );
    }
  }

  /**
   * Carrega protocolo específico (com cache L4)
   *
   * Cache key format: protocol:{deviationType}:{severity}
   * TTL: -1 (indefinido)
   *
   * @param deviationType - Tipo de desvio (knee_valgus, butt_wink, etc)
   * @param severity - Severidade (mild, moderate, severe)
   * @returns Protocolo base ou null se não encontrado
   */
  async loadProtocol(
    deviationType: string,
    severity: 'mild' | 'moderate' | 'severe',
  ): Promise<BaseProtocol | null> {
    const cacheKey = this.cache.generateKey('protocol', deviationType, severity);

    try {
      // 1. Tentar cache L4 primeiro
      const cached = await this.cache.get<BaseProtocol>(cacheKey, {
        level: this.cacheLevel as any,
      });

      if (cached) {
        this.logger.debug(`Cache HIT L4: ${cacheKey}`);
        return cached;
      }

      this.logger.debug(`Cache MISS L4: ${cacheKey}, loading from filesystem...`);

      // 2. Carregar do filesystem
      const protocol = await this.loadFromFileSystem(deviationType, severity);

      if (!protocol) {
        this.logger.warn(
          `Protocol not found: ${deviationType}/${severity}`,
        );
        return null;
      }

      // 3. Validar estrutura básica
      this.validateProtocolStructure(protocol, deviationType, severity);

      // 4. Armazenar no cache L4 (TTL -1 = indefinido)
      await this.cache.set(cacheKey, protocol, {
        level: this.cacheLevel as any,
        ttl: -1, // Nunca expira
      });

      this.logger.log(
        `Loaded and cached protocol: ${protocol.protocolId} (${deviationType}/${severity})`,
      );

      return protocol;
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Error loading protocol ${deviationType}/${severity}: ${err.message}`,
        err.stack,
      );
      return null;
    }
  }

  /**
   * Carrega protocolo do filesystem
   */
  private async loadFromFileSystem(
    deviationType: string,
    severity: string,
  ): Promise<BaseProtocol | null> {
    const filePath = path.join(
      this.protocolsPath,
      deviationType,
      `${severity}.json`,
    );

    try {
      // Verificar se arquivo existe
      if (!fs.existsSync(filePath)) {
        this.logger.debug(`File not found: ${filePath}`);
        return null;
      }

      // Ler e parsear JSON
      const content = fs.readFileSync(filePath, 'utf-8');
      const protocol = JSON.parse(content);

      return protocol;
    } catch (error) {
      const err = error as any;
      if (err.code === 'ENOENT') {
        this.logger.debug(`Protocol file not found: ${filePath}`);
        return null;
      }

      this.logger.error(
        `Error reading protocol file ${filePath}: ${err.message}`,
      );
      throw error;
    }
  }

  /**
   * Valida estrutura básica do protocolo
   * Lança exceção se inválido
   */
  private validateProtocolStructure(
    protocol: any,
    deviationType: string,
    severity: string,
  ): void {
    const errors: string[] = [];

    // Required fields
    if (!protocol.protocolId) errors.push('Missing protocolId');
    if (!protocol.version) errors.push('Missing version');
    if (!protocol.deviationType) errors.push('Missing deviationType');
    if (!protocol.severity) errors.push('Missing severity');
    if (!protocol.description) errors.push('Missing description');
    if (!protocol.phases || !Array.isArray(protocol.phases)) {
      errors.push('Missing or invalid phases array');
    }

    // Validate consistency
    if (protocol.deviationType !== deviationType) {
      errors.push(
        `Deviation type mismatch: expected ${deviationType}, got ${protocol.deviationType}`,
      );
    }

    if (protocol.severity !== severity) {
      errors.push(
        `Severity mismatch: expected ${severity}, got ${protocol.severity}`,
      );
    }

    // Validate phases
    if (protocol.phases && Array.isArray(protocol.phases)) {
      if (protocol.phases.length === 0) {
        errors.push('Protocol must have at least one phase');
      }

      protocol.phases.forEach((phase: any, index: number) => {
        if (!phase.phaseNumber) {
          errors.push(`Phase ${index} missing phaseNumber`);
        }
        if (!phase.name) {
          errors.push(`Phase ${index} missing name`);
        }
        if (!phase.durationWeeks || phase.durationWeeks <= 0) {
          errors.push(`Phase ${index} missing or invalid durationWeeks`);
        }
        if (!phase.exercises || !Array.isArray(phase.exercises)) {
          errors.push(`Phase ${index} missing or invalid exercises`);
        }
      });
    }

    if (errors.length > 0) {
      const message = `Protocol validation failed: ${errors.join(', ')}`;
      this.logger.error(message);
      throw new Error(message);
    }
  }

  /**
   * Lista todos os protocolos disponíveis
   */
  async listAvailableProtocols(): Promise<
    Array<{ deviationType: string; severity: string; protocolId: string }>
  > {
    const protocols: Array<{
      deviationType: string;
      severity: string;
      protocolId: string;
    }> = [];

    try {
      if (!fs.existsSync(this.protocolsPath)) {
        this.logger.warn(`Protocols directory not found: ${this.protocolsPath}`);
        return [];
      }

      const deviationTypes = fs
        .readdirSync(this.protocolsPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

      for (const deviationType of deviationTypes) {
        const deviationPath = path.join(this.protocolsPath, deviationType);
        const files = fs.readdirSync(deviationPath).filter((f) => f.endsWith('.json'));

        for (const file of files) {
          const severity = path.basename(file, '.json');

          // Tentar carregar (usa cache)
          const protocol = await this.loadProtocol(deviationType, severity as any);

          if (protocol) {
            protocols.push({
              deviationType,
              severity,
              protocolId: protocol.protocolId,
            });
          }
        }
      }

      return protocols;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error listing protocols: ${err.message}`);
      return [];
    }
  }

  /**
   * Invalida cache de um protocolo específico
   */
  async invalidateProtocol(
    deviationType: string,
    severity: 'mild' | 'moderate' | 'severe',
  ): Promise<void> {
    const cacheKey = this.cache.generateKey('protocol', deviationType, severity);

    await this.cache.delete(cacheKey);

    this.logger.log(`Invalidated cache for ${deviationType}/${severity}`);
  }

  /**
   * Invalida todos os protocolos de um tipo de desvio
   */
  async invalidateDeviationType(deviationType: string): Promise<number> {
    const pattern = `protocol:${deviationType}:*`;

    const deleted = await this.cache.invalidatePattern(pattern, [
      this.cacheLevel as any,
    ]);

    this.logger.log(
      `Invalidated ${deleted} protocols for deviation type: ${deviationType}`,
    );

    return deleted;
  }

  /**
   * Invalida TODOS os protocolos
   */
  async invalidateAllProtocols(): Promise<number> {
    const pattern = 'protocol:*';

    const deleted = await this.cache.invalidatePattern(pattern, [
      this.cacheLevel as any,
    ]);

    this.logger.warn(`Invalidated ALL ${deleted} protocols from cache`);

    return deleted;
  }

  /**
   * Recarrega protocolo do filesystem e atualiza cache
   */
  async reloadProtocol(
    deviationType: string,
    severity: 'mild' | 'moderate' | 'severe',
  ): Promise<BaseProtocol | null> {
    // Invalidar cache
    await this.invalidateProtocol(deviationType, severity);

    // Recarregar
    return this.loadProtocol(deviationType, severity);
  }
}
