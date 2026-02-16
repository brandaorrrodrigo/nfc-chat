/**
 * Funções Auxiliares para Análise Biomecânica
 *
 * Utilitários para formatação, visualização e manipulação
 * de dados da análise biomecânica.
 */

import type { BiomechanicalAnalysis, RiskLevel } from '../types/biomechanical-analysis.types';

/**
 * Gera ID único para análise
 * @returns ID único baseado em timestamp + random
 */
export function generateAnalysisId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `bio_${timestamp}_${random}`;
}

/**
 * Formata score de confiabilidade para exibição
 * @param score - Score numérico (0-100)
 * @returns String formatada com 1 casa decimal e símbolo %
 */
export function formatConfidenceScore(score: number): string {
  return `${score.toFixed(1)}%`;
}

/**
 * Formata magnitude de rotação para exibição
 * @param magnitude - Magnitude em graus
 * @returns String formatada com 1 casa decimal e símbolo °
 */
export function formatRotationMagnitude(magnitude: number): string {
  return `${magnitude.toFixed(1)}°`;
}

/**
 * Retorna cor hexadecimal baseada no nível de confiabilidade
 * @param level - Nível qualitativo de confiabilidade
 * @returns Código de cor hexadecimal
 */
export function getConfidenceColor(level: string): string {
  const colorMap: Record<string, string> = {
    baixa: '#EF4444', // Red
    moderada: '#F59E0B', // Amber
    alta: '#10B981', // Green
    excelente: '#3B82F6' // Blue
  };

  return colorMap[level] || '#6B7280'; // Gray default
}

/**
 * Retorna cor hexadecimal baseada no nível de risco
 * @param risk - Nível de risco
 * @returns Código de cor hexadecimal
 */
export function getRiskColor(risk: RiskLevel): string {
  const colorMap: Record<RiskLevel, string> = {
    LOW: '#10B981', // Green
    MODERATE: '#F59E0B', // Amber
    HIGH: '#EF4444' // Red
  };

  return colorMap[risk];
}

/**
 * Formata relatório biomecânico completo em Markdown
 * @param analysis - Análise biomecânica completa
 * @returns String formatada em Markdown
 */
export function formatBiomechanicalReport(analysis: BiomechanicalAnalysis): string {
  const sections: string[] = [];

  // Cabeçalho
  sections.push('# Relatório de Análise Biomecânica\n');
  sections.push(`**Exercício:** ${analysis.exerciseName}\n`);
  sections.push(`**Data:** ${analysis.timestamp.toLocaleDateString('pt-BR')}\n`);
  sections.push(`**ID da Análise:** ${analysis.analysisId}\n`);
  sections.push('---\n');

  // Setup de Captura
  sections.push('## 📹 Setup de Captura\n');
  sections.push(`- **Modo:** ${analysis.captureSetup.mode}\n`);
  sections.push(`- **Ângulos:** ${analysis.captureSetup.angles.join(', ')}\n`);
  sections.push(`- **FPS:** ${analysis.captureSetup.fps}\n`);
  sections.push(
    `- **Resolução:** ${analysis.captureSetup.resolution.width}x${analysis.captureSetup.resolution.height}\n`
  );
  sections.push(`- **Distância:** ${analysis.captureSetup.distanceToSubject}m\n`);
  sections.push('---\n');

  // Confiabilidade
  sections.push('## 🎯 Índice de Confiabilidade\n');
  sections.push(
    `**Score Geral:** ${formatConfidenceScore(analysis.confidenceScore)} (${
      analysis.confidenceLevel
    })\n\n`
  );
  sections.push('### Fatores de Confiabilidade:\n');
  sections.push(
    `- Calibração Espacial: ${formatConfidenceScore(
      analysis.confidenceFactors.spatialCalibration
    )}\n`
  );
  sections.push(
    `- Resolução Temporal: ${formatConfidenceScore(
      analysis.confidenceFactors.temporalResolution
    )}\n`
  );
  sections.push(
    `- Visibilidade de Landmarks: ${formatConfidenceScore(
      analysis.confidenceFactors.landmarkVisibility
    )}\n`
  );
  sections.push(
    `- Estabilidade de Tracking: ${formatConfidenceScore(
      analysis.confidenceFactors.trackingStability
    )}\n`
  );
  sections.push(
    `- Cobertura de Planos: ${formatConfidenceScore(analysis.confidenceFactors.viewCoverage)}\n`
  );
  sections.push(
    `- Qualidade de Iluminação: ${formatConfidenceScore(
      analysis.confidenceFactors.lightingQuality
    )}\n`
  );
  sections.push('---\n');

  // Scores de Movimento
  sections.push('## 📊 Scores de Movimento\n');
  sections.push(`- **Motor:** ${analysis.scores.motor.toFixed(1)}/100\n`);
  sections.push(`- **Estabilizador:** ${analysis.scores.stabilizer.toFixed(1)}/100\n`);
  sections.push(`- **Simetria:** ${analysis.scores.symmetry.toFixed(1)}/100\n`);
  sections.push(`- **Compensação:** ${analysis.scores.compensation.toFixed(1)}/100\n`);
  sections.push(`- **IGPB:** ${analysis.scores.igpb.toFixed(1)}/100\n`);
  sections.push('---\n');

  // Análise de Rotação
  sections.push('## 🔄 Análise de Rotação Axial\n');
  sections.push(`**Detectada:** ${analysis.rotationAnalysis.detected ? 'Sim' : 'Não'}\n\n`);

  if (analysis.rotationAnalysis.detected) {
    sections.push(`- **Confiança:** ${analysis.rotationAnalysis.confidence}\n`);
    sections.push(
      `- **Score de Confiança:** ${formatConfidenceScore(
        analysis.rotationAnalysis.confidenceScore
      )}\n`
    );
    sections.push(`- **Tipo:** ${analysis.rotationAnalysis.type}\n`);
    sections.push(`- **Origem:** ${analysis.rotationAnalysis.origin}\n`);
    sections.push(
      `- **Magnitude:** ${formatRotationMagnitude(analysis.rotationAnalysis.magnitude)}\n`
    );
    sections.push(`- **Score de Assimetria:** ${analysis.rotationAnalysis.asymmetryScore}/100\n`);
    sections.push('\n### Diferenças Bilaterais:\n');
    sections.push(
      `- Ombro: ${formatRotationMagnitude(
        analysis.rotationAnalysis.bilateralDifference.shoulder
      )}\n`
    );
    sections.push(
      `- Quadril: ${formatRotationMagnitude(analysis.rotationAnalysis.bilateralDifference.hip)}\n`
    );
    sections.push(
      `- Joelho: ${formatRotationMagnitude(
        analysis.rotationAnalysis.bilateralDifference.knee
      )}\n`
    );
    sections.push(`\n**Método:** ${analysis.rotationAnalysis.detectionMethod}\n`);
  }
  sections.push('---\n');

  // Avaliação de Risco
  sections.push('## ⚠️ Avaliação de Risco\n');
  sections.push(`**Nível de Risco:** ${analysis.riskLevel}\n\n`);

  if (analysis.riskFactors.length > 0) {
    sections.push('### Fatores de Risco:\n');
    analysis.riskFactors.forEach((factor) => {
      sections.push(`- ${factor}\n`);
    });
  }
  sections.push('---\n');

  // Ações Corretivas
  if (analysis.correctiveActions.length > 0) {
    sections.push('## 💪 Protocolo Corretivo\n\n');

    analysis.correctiveActions.forEach((action, index) => {
      sections.push(`### ${index + 1}. ${action.description}\n`);
      sections.push(`**Prioridade:** ${action.priority.toUpperCase()}\n`);
      sections.push(`**Categoria:** ${action.category}\n`);
      sections.push(`**Duração:** ${action.duration}\n\n`);
      sections.push('**Exercícios:**\n');
      action.exercises.forEach((exercise) => {
        sections.push(`- ${exercise}\n`);
      });
      sections.push('\n');
    });
    sections.push('---\n');
  }

  // Prompt de Upgrade
  if (analysis.upgradePrompt) {
    sections.push('## 🎥 Recomendação de Upgrade\n');
    sections.push(
      `**Modo Atual:** ${analysis.upgradePrompt.currentMode} → **Recomendado:** ${analysis.upgradePrompt.recommendedMode}\n\n`
    );
    sections.push(`**Razão:** ${analysis.upgradePrompt.reason}\n\n`);
    sections.push('**Benefícios:**\n');
    analysis.upgradePrompt.benefits.forEach((benefit) => {
      sections.push(`- ${benefit}\n`);
    });
    sections.push('---\n');
  }

  // Recomendação de Reteste
  sections.push('## 🔁 Recomendação de Reteste\n');
  if (analysis.retestRecommendation.recommended) {
    sections.push(`**Prazo:** ${analysis.retestRecommendation.timeframe}\n`);
    sections.push(`**Razão:** ${analysis.retestRecommendation.reason}\n\n`);
    if (analysis.retestRecommendation.focusAreas.length > 0) {
      sections.push('**Áreas de Foco:**\n');
      analysis.retestRecommendation.focusAreas.forEach((area) => {
        sections.push(`- ${area}\n`);
      });
    }
  } else {
    sections.push(`**Reteste não necessário:** ${analysis.retestRecommendation.reason}\n`);
  }
  sections.push('---\n');

  // Dados Brutos (opcional)
  if (analysis.rawData) {
    sections.push('## 📈 Dados de Processamento\n');
    sections.push(`- **Frames Analisados:** ${analysis.rawData.frames.length}\n`);
    sections.push(`- **Tempo de Processamento:** ${analysis.rawData.processingTime}ms\n`);
  }

  return sections.join('');
}

/**
 * Formata relatório biomecânico em HTML
 * @param analysis - Análise biomecânica completa
 * @returns String formatada em HTML
 */
export function formatBiomechanicalReportHTML(analysis: BiomechanicalAnalysis): string {
  const markdown = formatBiomechanicalReport(analysis);

  // Conversão básica de Markdown para HTML
  let html = markdown
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/---/g, '<hr>');

  // Envolver em tags HTML
  html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório Biomecânico - ${analysis.exerciseName}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #2563EB; border-bottom: 2px solid #2563EB; padding-bottom: 10px; }
    h2 { color: #4B5563; margin-top: 30px; border-left: 4px solid #10B981; padding-left: 10px; }
    h3 { color: #6B7280; }
    li { margin: 5px 0; }
    hr { border: none; border-top: 1px solid #E5E7EB; margin: 20px 0; }
    .confidence-${analysis.confidenceLevel} { color: ${getConfidenceColor(
    analysis.confidenceLevel
  )}; }
    .risk-${analysis.riskLevel} { color: ${getRiskColor(analysis.riskLevel)}; }
  </style>
</head>
<body>
  ${html}
</body>
</html>
  `.trim();

  return html;
}

/**
 * Converte análise para formato JSON legível
 * @param analysis - Análise biomecânica completa
 * @param pretty - Se deve formatar com indentação
 * @returns String JSON
 */
export function analysisToJSON(analysis: BiomechanicalAnalysis, pretty = true): string {
  return JSON.stringify(analysis, null, pretty ? 2 : 0);
}

/**
 * Calcula score agregado de qualidade da análise (0-100)
 * @param analysis - Análise biomecânica completa
 * @returns Score de qualidade agregado
 */
export function calculateAnalysisQuality(analysis: BiomechanicalAnalysis): number {
  const weights = {
    confidence: 0.4,
    igpb: 0.3,
    symmetry: 0.2,
    riskLevel: 0.1
  };

  const riskScore = analysis.riskLevel === 'LOW' ? 100 : analysis.riskLevel === 'MODERATE' ? 60 : 30;

  const qualityScore =
    analysis.confidenceScore * weights.confidence +
    analysis.scores.igpb * weights.igpb +
    analysis.scores.symmetry * weights.symmetry +
    riskScore * weights.riskLevel;

  return Math.round(qualityScore * 100) / 100;
}
