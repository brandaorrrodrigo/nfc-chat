/**
 * Engine de Geração de Relatórios Corretivos
 *
 * Gera relatórios completos com ações corretivas, prompts de upgrade
 * e recomendações de reteste baseados na análise biomecânica.
 */

import type {
  BiomechanicalAnalysis,
  CorrectiveAction,
  UpgradePrompt,
  RetestRecommendation
} from '../types/biomechanical-analysis.types';
import {
  RiskLevel,
  RotationOrigin,
  CaptureMode,
  BIOMECHANICAL_THRESHOLDS,
  TECHNICAL_MESSAGES
} from '../types/biomechanical-analysis.types';

/**
 * Engine singleton para geração de relatórios
 */
class ReportGeneratorEngine {
  /**
   * Classifica nível de risco baseado no score de compensação
   * @param compensationScore - Score de compensação (0-100)
   * @returns Nível de risco
   */
  private classifyRisk(compensationScore: number): RiskLevel {
    if (compensationScore < 20) {
      return 'LOW' as RiskLevel;
    }
    if (compensationScore < 40) {
      return 'MODERATE' as RiskLevel;
    }
    return 'HIGH' as RiskLevel;
  }

  /**
   * Identifica fatores de risco na análise
   * @param analysis - Análise biomecânica
   * @returns Array de fatores de risco identificados
   */
  private identifyRiskFactors(analysis: BiomechanicalAnalysis): string[] {
    const riskFactors: string[] = [];

    if (analysis.scores.motor < 70) {
      riskFactors.push('Padrão motor primário abaixo do ideal');
    }

    if (analysis.scores.stabilizer < 70) {
      riskFactors.push('Ativação insuficiente de musculatura estabilizadora');
    }

    if (analysis.scores.symmetry < 80) {
      riskFactors.push('Assimetria bilateral significativa detectada');
    }

    if (
      analysis.rotationAnalysis.detected &&
      analysis.rotationAnalysis.magnitude > BIOMECHANICAL_THRESHOLDS.rotation.moderate
    ) {
      riskFactors.push('Compensação rotacional moderada a severa');
    }

    if (analysis.rotationAnalysis.type === 'PATHOLOGICAL') {
      riskFactors.push(
        'Padrão compensatório sugestivo de restrição articular ou estratégia antálgica'
      );
    }

    if (analysis.confidenceScore < 75) {
      riskFactors.push('Confiabilidade da análise limitada pelo setup de captura');
    }

    return riskFactors;
  }

  /**
   * Obtém área de foco para mobilidade baseada na origem da rotação
   * @param origin - Origem anatômica da rotação
   * @returns Descrição da área de foco
   */
  private getMobilityFocusArea(origin: RotationOrigin): string {
    switch (origin) {
      case 'SCAPULAR':
        return 'complexo escapular e musculatura periescapular';
      case 'THORACIC':
        return 'coluna torácica e musculatura paravertebral';
      case 'LUMBAR':
        return 'região lombopélvica e flexores de quadril';
      case 'PELVIC':
        return 'cintura pélvica e rotadores externos de quadril';
      case 'FEMORAL':
        return 'articulação coxofemoral e adutores';
      case 'MULTI_SEGMENTAL':
        return 'cadeia posterior completa';
      default:
        return 'musculatura axial e apendicular';
    }
  }

  /**
   * Obtém exercícios de mobilidade baseados na origem da rotação
   * @param origin - Origem anatômica da rotação
   * @returns Array de exercícios recomendados
   */
  private getMobilityExercises(origin: RotationOrigin): string[] {
    switch (origin) {
      case 'SCAPULAR':
        return [
          'Thread the needle torácico',
          'Wall slides com rotação externa',
          'Liberação miofascial de peitoral menor'
        ];
      case 'THORACIC':
        return [
          'Open book torácico',
          'Extensão torácica em foam roller',
          'Quadruped rotation'
        ];
      case 'LUMBAR':
        return [
          'Rotação lombar controlada em decúbito',
          '90/90 hip stretch',
          'Liberação de psoas'
        ];
      case 'PELVIC':
        return [
          'Pigeon pose dinâmico',
          'Clamshell com rotação',
          'Hip CARs (Controlled Articular Rotations)'
        ];
      case 'FEMORAL':
        return [
          'Cossack squat',
          'Adductor rockback',
          'Liberação de TFL (tensor da fáscia lata)'
        ];
      case 'MULTI_SEGMENTAL':
        return [
          "World's greatest stretch",
          'Flow de mobilidade global',
          'Yoga cat-cow com rotação'
        ];
      default:
        return [
          'Mobilidade geral de cadeia posterior',
          'Alongamento dinâmico multiplanar'
        ];
    }
  }

  /**
   * Gera ações corretivas baseadas na análise
   * @param analysis - Análise biomecânica
   * @returns Array de ações corretivas ordenadas por prioridade
   */
  private generateCorrectiveActions(
    analysis: BiomechanicalAnalysis
  ): CorrectiveAction[] {
    const actions: CorrectiveAction[] = [];

    // Ação 1: Estabilidade (se stabilizer < 70)
    if (analysis.scores.stabilizer < 70) {
      actions.push({
        priority: 'alta',
        category: 'estabilidade',
        description:
          'Fortalecimento da musculatura estabilizadora central e cintura escapular',
        exercises: [
          'Prancha frontal com variações',
          'Dead bug progressivo',
          'Pallof press anti-rotacional',
          'Bird dog com controle excêntrico'
        ],
        duration: '3-4 semanas, 3x/semana'
      });
    }

    // Ação 2: Força/Simetria (se symmetry < 80)
    if (analysis.scores.symmetry < 80) {
      actions.push({
        priority: 'alta',
        category: 'força',
        description:
          'Correção de assimetrias de força através de trabalho unilateral',
        exercises: [
          'Bulgarian split squat',
          'Remada unilateral com halteres',
          'Desenvolvimento unilateral',
          'Farmer walk unilateral'
        ],
        duration: '4-6 semanas, iniciar com lado fraco'
      });
    }

    // Ação 3: Mobilidade (se rotação detectada)
    if (
      analysis.rotationAnalysis.detected &&
      analysis.rotationAnalysis.magnitude > BIOMECHANICAL_THRESHOLDS.rotation.minor
    ) {
      const magnitude = analysis.rotationAnalysis.magnitude;
      const origin = analysis.rotationAnalysis.origin;

      actions.push({
        priority: magnitude > BIOMECHANICAL_THRESHOLDS.rotation.moderate ? 'alta' : 'média',
        category: 'mobilidade',
        description: `Mobilização e liberação miofascial de ${this.getMobilityFocusArea(
          origin
        )}`,
        exercises: this.getMobilityExercises(origin),
        duration: '2-3 semanas, diariamente'
      });
    }

    // Ação 4: Técnica (se motor < 70)
    if (analysis.scores.motor < 70) {
      actions.push({
        priority: 'média',
        category: 'técnica',
        description:
          'Refinamento do padrão motor através de regressões e feedback tátil',
        exercises: [
          'Execução assistida com elástico',
          'Tempo reduzido sob tensão',
          'Amplitude parcial controlada',
          'Feedback por espelho ou vídeo'
        ],
        duration: '2-3 semanas antes de progressão de carga'
      });
    }

    // Ordenar por prioridade: alta → média → baixa
    const priorityOrder = { alta: 1, média: 2, baixa: 3 };
    actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return actions;
  }

  /**
   * Gera prompt para upgrade de modo de captura (se aplicável)
   * @param analysis - Análise biomecânica
   * @returns Prompt de upgrade ou undefined
   */
  private generateUpgradePrompt(
    analysis: BiomechanicalAnalysis
  ): UpgradePrompt | undefined {
    const mode = analysis.captureSetup.mode;
    const rotationDetected = analysis.rotationAnalysis.detected;
    const shoulderAsym = analysis.rotationAnalysis.bilateralDifference.shoulder;

    // Upgrade ESSENTIAL → ADVANCED (se rotação detectada)
    if (mode === 'ESSENTIAL' && rotationDetected) {
      return {
        currentMode: 'ESSENTIAL' as CaptureMode,
        recommendedMode: 'ADVANCED' as CaptureMode,
        reason: TECHNICAL_MESSAGES.upgradePrompts.essentialToAdvanced,
        benefits: [
          'Confirmação biplanar de compensações rotacionais',
          'Quantificação precisa de assimetrias através de planos ortogonais',
          'Identificação de origem anatômica da compensação',
          'Aumento de confiabilidade para 75-85%'
        ]
      };
    }

    // Upgrade ADVANCED → PRO (se assimetria de ombro > 12°)
    if (mode === 'ADVANCED' && shoulderAsym > BIOMECHANICAL_THRESHOLDS.asymmetry.moderate) {
      return {
        currentMode: 'ADVANCED' as CaptureMode,
        recommendedMode: 'PRO' as CaptureMode,
        reason: TECHNICAL_MESSAGES.upgradePrompts.advancedToPro,
        benefits: [
          'Reconstrução vetorial 3D completa',
          'Análise de rotação axial confirmada através de plano transversal',
          'Confiabilidade superior a 90%',
          'Rastreamento temporal de progressão com precisão submilimétrica'
        ]
      };
    }

    return undefined;
  }

  /**
   * Gera recomendação de reteste
   * @param analysis - Análise biomecânica
   * @returns Recomendação de reteste
   */
  private generateRetestRecommendation(
    analysis: BiomechanicalAnalysis
  ): RetestRecommendation {
    const hasCorrectiveActions = analysis.correctiveActions.length > 0;

    // Sem ações corretivas = sem necessidade de reteste
    if (!hasCorrectiveActions) {
      return {
        recommended: false,
        timeframe: 'N/A',
        reason: 'Padrão biomecânico dentro dos parâmetros ideais',
        focusAreas: []
      };
    }

    // Determinar timeframe baseado no riskLevel
    const timeframes: Record<RiskLevel, string> = {
      HIGH: '2-3 semanas',
      MODERATE: '4-6 semanas',
      LOW: '6-8 semanas'
    };

    const timeframe = timeframes[analysis.riskLevel];

    // Focar em ações de alta prioridade
    const highPriorityActions = analysis.correctiveActions
      .filter((action) => action.priority === 'alta')
      .map((action) => action.description);

    return {
      recommended: true,
      timeframe,
      reason:
        'Validar efetividade do protocolo corretivo e progressão de parâmetros biomecânicos',
      focusAreas: highPriorityActions
    };
  }

  /**
   * Gera relatório completo a partir de análise parcial
   * @param analysis - Análise biomecânica parcial
   * @returns Análise biomecânica completa com relatório
   */
  public generateReport(
    analysis: Partial<BiomechanicalAnalysis>
  ): BiomechanicalAnalysis {
    // Garantir que campos obrigatórios estão presentes
    if (
      !analysis.analysisId ||
      !analysis.exerciseName ||
      !analysis.captureSetup ||
      !analysis.scores ||
      !analysis.rotationAnalysis
    ) {
      throw new Error(
        'Análise incompleta: campos obrigatórios ausentes para geração de relatório'
      );
    }

    const fullAnalysis = analysis as BiomechanicalAnalysis;

    // Calcular riskLevel
    const riskLevel = this.classifyRisk(fullAnalysis.scores.compensation);

    // Identificar riskFactors
    const riskFactors = this.identifyRiskFactors(fullAnalysis);

    // Gerar correctiveActions
    const correctiveActions = this.generateCorrectiveActions(fullAnalysis);

    // Gerar upgradePrompt (se aplicável)
    const upgradePrompt = this.generateUpgradePrompt(fullAnalysis);

    // Gerar retestRecommendation
    const retestRecommendation = this.generateRetestRecommendation({
      ...fullAnalysis,
      riskLevel,
      correctiveActions
    });

    // Retornar análise completa
    return {
      ...fullAnalysis,
      riskLevel,
      riskFactors,
      correctiveActions,
      upgradePrompt,
      retestRecommendation
    };
  }
}

/**
 * Instância singleton do engine de geração de relatórios
 */
export const reportGenerator = new ReportGeneratorEngine();
