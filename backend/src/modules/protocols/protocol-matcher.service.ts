/**
 * Protocol Matcher Service
 *
 * Busca e retorna protocolos corretivos apropriados baseado em desvios detectados
 */

import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { IAggregatedDeviation } from '../analysis/interfaces/deviation.interface';

interface UserProfile {
  training_level?: string;
  training_age_years?: number;
  injury_history?: any[];
  age?: number;
  height_cm?: number;
  weight_kg?: number;
}

interface ProtocolGenerationInput {
  deviations: IAggregatedDeviation[];
  userProfile: UserProfile;
  deepContext?: any;
}

interface GeneratedProtocol {
  deviation_type: string;
  deviation_severity: string;
  protocol_id: string;
  protocol_version: string;
  protocol_data: any;
  user_modifications?: any;
}

@Injectable()
export class ProtocolMatcherService {
  private readonly logger = new Logger(ProtocolMatcherService.name);
  private readonly protocolsBasePath = join(
    process.cwd(),
    'reference-data',
    'corrective-protocols',
  );

  /**
   * Gera protocolos corretivos baseado nos desvios detectados
   */
  async generateProtocols(input: ProtocolGenerationInput): Promise<GeneratedProtocol[]> {
    const { deviations, userProfile, deepContext } = input;

    this.logger.log(
      `Generating protocols for ${deviations.length} deviations`,
    );

    const protocols: GeneratedProtocol[] = [];

    for (const deviation of deviations) {
      try {
        // Buscar protocolo correspondente
        const protocol = await this.loadProtocol(deviation.type, deviation.severity);

        if (!protocol) {
          this.logger.warn(
            `Protocol not found for ${deviation.type} / ${deviation.severity}`,
          );
          continue;
        }

        // Personalizar baseado no perfil do usuário
        const personalized = this.personalizeProtocol(protocol, userProfile, deepContext);

        protocols.push({
          deviation_type: deviation.type,
          deviation_severity: deviation.severity,
          protocol_id: protocol.protocol_id,
          protocol_version: protocol.version,
          protocol_data: protocol,
          user_modifications: personalized,
        });

        this.logger.debug(
          `Generated protocol ${protocol.protocol_id} for ${deviation.type}`,
        );
      } catch (error) {
        this.logger.error(
          `Error generating protocol for ${deviation.type}: ${error.message}`,
        );
      }
    }

    return protocols;
  }

  /**
   * Carrega protocolo do filesystem
   */
  private async loadProtocol(
    deviationType: string,
    severity: string,
  ): Promise<any | null> {
    try {
      const protocolPath = join(
        this.protocolsBasePath,
        deviationType,
        `${severity}.json`,
      );

      this.logger.debug(`Loading protocol from ${protocolPath}`);

      const content = await fs.readFile(protocolPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.logger.warn(
          `Protocol file not found: ${deviationType}/${severity}.json`,
        );
      } else {
        this.logger.error(
          `Error loading protocol: ${error.message}`,
        );
      }
      return null;
    }
  }

  /**
   * Personaliza protocolo baseado no perfil do usuário
   */
  private personalizeProtocol(
    protocol: any,
    userProfile: UserProfile,
    deepContext?: any,
  ): any {
    const modifications: any = {
      training_age_adjusted: false,
      injury_history_adjusted: false,
      age_adjusted: false,
      recommendations: [],
    };

    // PERSONALIZAÇÃO 1: Training Age
    if (userProfile.training_age_years !== undefined) {
      const trainingAge = userProfile.training_age_years;

      if (trainingAge < 1) {
        // Beginner: progressão mais lenta
        modifications.training_age_adjusted = true;
        modifications.recommendations.push(
          'Como iniciante, progrida com cautela. Não tenha pressa para aumentar carga.',
        );
        modifications.phase_duration_multiplier = 1.5; // 50% mais tempo por fase
      } else if (trainingAge > 5) {
        // Advanced: progressão mais agressiva
        modifications.training_age_adjusted = true;
        modifications.recommendations.push(
          'Seu nível avançado permite progressão mais rápida, mas não negligencie a correção.',
        );
        modifications.phase_duration_multiplier = 0.8; // 20% menos tempo
      }
    }

    // PERSONALIZAÇÃO 2: Injury History
    if (userProfile.injury_history && userProfile.injury_history.length > 0) {
      const relevantInjuries = userProfile.injury_history.filter(
        (injury: any) => this.isRelevantInjury(injury, protocol.deviation),
      );

      if (relevantInjuries.length > 0) {
        modifications.injury_history_adjusted = true;
        modifications.recommendations.push(
          `Histórico de lesão em ${relevantInjuries[0].location}: progressão extra cautelosa recomendada.`,
        );
        modifications.contraindications_added = relevantInjuries.map(
          (i: any) => `Atenção especial com ${i.type}`,
        );
      }
    }

    // PERSONALIZAÇÃO 3: Idade
    if (userProfile.age !== undefined) {
      if (userProfile.age > 50) {
        modifications.age_adjusted = true;
        modifications.recommendations.push(
          'Idade 50+: Priorize mobilidade e controle motor sobre carga.',
        );
        modifications.mobility_emphasis = true;
      } else if (userProfile.age < 25) {
        modifications.recommendations.push(
          'Aproveite sua capacidade de adaptação: foque em correção de padrão agora.',
        );
      }
    }

    // PERSONALIZAÇÃO 4: Deep Context (se disponível)
    if (deepContext) {
      modifications.deep_context_integrated = true;
      modifications.llm_insights = deepContext.personalized_cues || [];
    }

    return modifications;
  }

  /**
   * Verifica se lesão é relevante para o desvio
   */
  private isRelevantInjury(injury: any, deviationType: string): boolean {
    const injuryLocation = injury.location?.toLowerCase() || '';
    const injuryType = injury.type?.toLowerCase() || '';

    const relevanceMap: Record<string, string[]> = {
      knee_valgus: ['knee', 'joelho', 'ligament', 'meniscus', 'lca', 'lcl', 'acl'],
      butt_wink: ['hip', 'quadril', 'lower back', 'lombar', 'disc', 'disco'],
      forward_lean: ['hip', 'quadril', 'ankle', 'tornozelo', 'lower back', 'lombar'],
      heel_rise: ['ankle', 'tornozelo', 'achilles', 'aquiles', 'calf', 'panturrilha'],
      asymmetric_loading: ['knee', 'joelho', 'hip', 'quadril', 'leg', 'perna'],
    };

    const keywords = relevanceMap[deviationType] || [];

    return keywords.some(
      (keyword) =>
        injuryLocation.includes(keyword) || injuryType.includes(keyword),
    );
  }

  /**
   * Busca todos os protocolos disponíveis
   */
  async listAvailableProtocols(): Promise<string[]> {
    try {
      const deviations = await fs.readdir(this.protocolsBasePath);
      const protocols: string[] = [];

      for (const deviation of deviations) {
        const deviationPath = join(this.protocolsBasePath, deviation);
        const stat = await fs.stat(deviationPath);

        if (stat.isDirectory()) {
          const files = await fs.readdir(deviationPath);
          for (const file of files) {
            if (file.endsWith('.json')) {
              protocols.push(`${deviation}/${file}`);
            }
          }
        }
      }

      return protocols;
    } catch (error) {
      this.logger.error(`Error listing protocols: ${error.message}`);
      return [];
    }
  }

  /**
   * Valida integridade de um protocolo
   */
  validateProtocol(protocol: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields
    if (!protocol.protocol_id) errors.push('Missing protocol_id');
    if (!protocol.deviation) errors.push('Missing deviation');
    if (!protocol.severity) errors.push('Missing severity');
    if (!protocol.version) errors.push('Missing version');
    if (!protocol.phases || !Array.isArray(protocol.phases))
      errors.push('Missing or invalid phases');

    // Validate phases
    if (protocol.phases) {
      for (const phase of protocol.phases) {
        if (!phase.phase_number) errors.push(`Phase missing phase_number`);
        if (!phase.name) errors.push(`Phase ${phase.phase_number} missing name`);
        if (!phase.exercises || !Array.isArray(phase.exercises))
          errors.push(`Phase ${phase.phase_number} missing exercises`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
