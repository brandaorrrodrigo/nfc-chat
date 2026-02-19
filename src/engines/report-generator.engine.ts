import {
  BiomechanicalAnalysis,
  CaptureMode,
  RiskLevel,
  CorrectiveAction,
  UpgradePrompt,
  RetestRecommendation,
  RotationType,
  RotationOrigin,
  TECHNICAL_MESSAGES,
  BIOMECHANICAL_THRESHOLDS
} from '../types/biomechanical-analysis.types';

/**
 * Engine de Geração de Relatórios Biomecânicos
 *
 * Gera relatórios técnicos completos com:
 * - Classificação de risco
 * - Ações corretivas
 * - Prompts de upgrade
 * - Recomendações de reteste
 */

export class ReportGeneratorEngine {

  /**
   * Classifica nível de risco baseado em scores
   */
  private classifyRisk(compensationScore: number): RiskLevel {
    if (compensationScore < 20) return RiskLevel.LOW;
    if (compensationScore < 40) return RiskLevel.MODERATE;
    return RiskLevel.HIGH;
  }

  /**
   * Identifica fatores de risco
   */
  private identifyRiskFactors(analysis: BiomechanicalAnalysis): string[] {
    const factors: string[] = [];
    const { scores, rotationAnalysis } = analysis;

    if (scores.motor < 70) {
      factors.push('Padrão motor primário abaixo do ideal');
    }
    if (scores.stabilizer < 70) {
      factors.push('Ativação insuficiente de musculatura estabilizadora');
    }
    if (scores.symmetry < 80) {
      factors.push('Assimetria bilateral significativa detectada');
    }
    if (rotationAnalysis.detected && rotationAnalysis.magnitude > 15) {
      factors.push('Compensação rotacional moderada a severa');
    }
    if (rotationAnalysis.type === RotationType.PATHOLOGICAL) {
      factors.push('Padrão compensatório sugestivo de restrição articular ou estratégia antálgica');
    }
    if (analysis.confidenceScore < 75) {
      factors.push('Confiabilidade da análise limitada por qualidade de captura');
    }

    return factors;
  }

  /**
   * Gera ações corretivas baseadas em análise
   */
  private generateCorrectiveActions(analysis: BiomechanicalAnalysis): CorrectiveAction[] {
    const actions: CorrectiveAction[] = [];
    const { scores, rotationAnalysis } = analysis;

    if (scores.stabilizer < 70) {
      actions.push({
        priority: 'alta',
        category: 'estabilidade',
        description: 'Fortalecimento da musculatura estabilizadora central e cintura escapular',
        exercises: [
          'Prancha frontal com variações',
          'Dead bug progressivo',
          'Pallof press anti-rotacional',
          'Bird dog com controle excêntrico'
        ],
        duration: '3-4 semanas, 3x/semana'
      });
    }

    if (scores.symmetry < 80) {
      actions.push({
        priority: 'alta',
        category: 'força',
        description: 'Correção de assimetrias de força através de trabalho unilateral',
        exercises: [
          'Bulgarian split squat',
          'Remada unilateral com halteres',
          'Desenvolvimento unilateral',
          'Farmer walk unilateral'
        ],
        duration: '4-6 semanas, iniciar com lado fraco'
      });
    }

    if (rotationAnalysis.detected && rotationAnalysis.magnitude > 10) {
      const mobilityOrigin = this.getMobilityFocusArea(rotationAnalysis.origin);
      actions.push({
        priority: rotationAnalysis.magnitude > 20 ? 'alta' : 'média',
        category: 'mobilidade',
        description: `Mobilização e liberação miofascial de ${mobilityOrigin}`,
        exercises: this.getMobilityExercises(rotationAnalysis.origin),
        duration: '2-3 semanas, diariamente'
      });
    }

    if (scores.motor < 70) {
      actions.push({
        priority: 'média',
        category: 'técnica',
        description: 'Refinamento do padrão motor através de regressões e feedback tátil',
        exercises: [
          'Execução assistida com elástico',
          'Tempo reduzido sob tensão',
          'Amplitude parcial controlada',
          'Feedback por espelho ou vídeo'
        ],
        duration: '2-3 semanas antes de progressão de carga'
      });
    }

    return actions.sort((a, b) => {
      const priorityOrder: Record<string, number> = { alta: 0, média: 1, baixa: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  private getMobilityFocusArea(origin: RotationOrigin): string {
    const areas: Record<RotationOrigin, string> = {
      [RotationOrigin.SCAPULAR]: 'complexo escapular e musculatura periescapular',
      [RotationOrigin.THORACIC]: 'coluna torácica e musculatura paravertebral',
      [RotationOrigin.LUMBAR]: 'região lombopélvica e flexores de quadril',
      [RotationOrigin.PELVIC]: 'cintura pélvica e rotadores externos de quadril',
      [RotationOrigin.FEMORAL]: 'articulação coxofemoral e adutores',
      [RotationOrigin.MULTI_SEGMENTAL]: 'cadeia posterior completa'
    };
    return areas[origin];
  }

  private getMobilityExercises(origin: RotationOrigin): string[] {
    const exercises: Record<RotationOrigin, string[]> = {
      [RotationOrigin.SCAPULAR]: [
        'Thread the needle torácico',
        'Wall slides com rotação externa',
        'Liberação miofascial de peitoral menor'
      ],
      [RotationOrigin.THORACIC]: [
        'Open book torácico',
        'Extensão torácica em foam roller',
        'Quadruped rotation'
      ],
      [RotationOrigin.LUMBAR]: [
        'Rotação lombar controlada em decúbito',
        '90/90 hip stretch',
        'Liberação de psoas'
      ],
      [RotationOrigin.PELVIC]: [
        'Pigeon pose dinâmico',
        'Clamshell com rotação',
        'Hip CARs (Controlled Articular Rotations)'
      ],
      [RotationOrigin.FEMORAL]: [
        'Cossack squat',
        'Adductor rockback',
        'Liberação de TFL'
      ],
      [RotationOrigin.MULTI_SEGMENTAL]: [
        "World's greatest stretch",
        'Flow de mobilidade global',
        'Yoga cat-cow com rotação'
      ]
    };
    return exercises[origin];
  }

  private generateUpgradePrompt(analysis: BiomechanicalAnalysis): UpgradePrompt | undefined {
    const { captureSetup, rotationAnalysis } = analysis;

    if (captureSetup.mode === CaptureMode.ESSENTIAL && rotationAnalysis.detected) {
      return {
        currentMode: CaptureMode.ESSENTIAL,
        recommendedMode: CaptureMode.ADVANCED,
        reason: TECHNICAL_MESSAGES.upgradePrompts.essentialToAdvanced,
        benefits: [
          'Confirmação biplanar de compensações rotacionais',
          'Quantificação precisa de assimetrias',
          'Identificação de origem anatômica',
          'Aumento de confiabilidade para 80-90%'
        ]
      };
    }

    if (
      captureSetup.mode === CaptureMode.ADVANCED &&
      rotationAnalysis.bilateralDifference.shoulder > BIOMECHANICAL_THRESHOLDS.asymmetry.moderate
    ) {
      return {
        currentMode: CaptureMode.ADVANCED,
        recommendedMode: CaptureMode.PRO,
        reason: TECHNICAL_MESSAGES.upgradePrompts.advancedToPro,
        benefits: [
          'Reconstrução vetorial 3D completa',
          'Análise de rotação axial confirmada',
          'Confiabilidade superior a 90%',
          'Rastreamento temporal de progressão'
        ]
      };
    }

    return undefined;
  }

  private generateRetestRecommendation(analysis: BiomechanicalAnalysis): RetestRecommendation {
    const { riskLevel } = analysis;
    const hasCorrectiveActions = analysis.correctiveActions && analysis.correctiveActions.length > 0;

    if (!hasCorrectiveActions) {
      return {
        recommended: false,
        timeframe: 'N/A',
        reason: 'Padrão biomecânico dentro dos parâmetros ideais',
        focusAreas: []
      };
    }

    const timeframes: Record<RiskLevel, string> = {
      [RiskLevel.LOW]: '6-8 semanas',
      [RiskLevel.MODERATE]: '4-6 semanas',
      [RiskLevel.HIGH]: '2-3 semanas'
    };

    const focusAreas = analysis.correctiveActions
      .filter(a => a.priority === 'alta')
      .map(a => a.description);

    return {
      recommended: true,
      timeframe: timeframes[riskLevel],
      reason: 'Validar efetividade do protocolo corretivo e progressão de parâmetros biomecânicos',
      focusAreas
    };
  }

  /**
   * Gera relatório completo
   */
  public generateReport(analysis: Partial<BiomechanicalAnalysis>): BiomechanicalAnalysis {
    const riskLevel = this.classifyRisk(analysis.scores!.compensation);
    const riskFactors = this.identifyRiskFactors(analysis as BiomechanicalAnalysis);
    const correctiveActions = this.generateCorrectiveActions(analysis as BiomechanicalAnalysis);
    const upgradePrompt = this.generateUpgradePrompt(analysis as BiomechanicalAnalysis);
    const retestRecommendation = this.generateRetestRecommendation({
      ...analysis,
      riskLevel,
      correctiveActions
    } as BiomechanicalAnalysis);

    return {
      ...analysis,
      riskLevel,
      riskFactors,
      correctiveActions,
      upgradePrompt,
      retestRecommendation
    } as BiomechanicalAnalysis;
  }
}

// Exporta instância singleton
export const reportGenerator = new ReportGeneratorEngine();
