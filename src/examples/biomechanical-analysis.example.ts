/**
 * Exemplos de Uso do Sistema de Análise Biomecânica
 *
 * Demonstra os três níveis de captura (Essencial, Avançado, Pro)
 * e como utilizar o sistema completo de análise.
 */

import { biomechanicalAnalyzer } from '../engines/biomechanical-analyzer.engine';
import type { AnalysisParams } from '../engines/biomechanical-analyzer.engine';
import {
  CaptureMode,
  CameraAngle,
  type FrameAnalysis,
  type LandmarkData
} from '../types/biomechanical-analysis.types';
import {
  formatBiomechanicalReport,
  formatConfidenceScore,
  formatRotationMagnitude,
  calculateAnalysisQuality
} from '../utils/biomechanical.helpers';

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================

/**
 * Gera landmarks mock para teste
 */
function generateMockLandmarks(frameNumber: number): LandmarkData[] {
  const landmarkNames = [
    'nose',
    'left_eye',
    'right_eye',
    'left_ear',
    'right_ear',
    'left_shoulder',
    'right_shoulder',
    'left_elbow',
    'right_elbow',
    'left_wrist',
    'right_wrist',
    'left_hip',
    'right_hip',
    'left_knee',
    'right_knee',
    'left_ankle',
    'right_ankle'
  ];

  return landmarkNames.map((name, index) => ({
    name,
    x: 0.3 + (index % 3) * 0.2 + Math.random() * 0.05,
    y: 0.2 + Math.floor(index / 3) * 0.15 + Math.random() * 0.05,
    z: Math.random() * 0.5, // Profundidade aleatória
    confidence: 0.85 + Math.random() * 0.15,
    visible: true,
    occluded: false
  }));
}

/**
 * Gera frames mock para teste
 */
function generateMockFrames(
  count: number,
  cameraAngle: CameraAngle
): FrameAnalysis[] {
  const frames: FrameAnalysis[] = [];

  for (let i = 0; i < count; i++) {
    frames.push({
      frameNumber: i,
      timestamp: (i * 1000) / 60, // 60fps
      landmarks: generateMockLandmarks(i),
      cameraAngle
    });
  }

  return frames;
}

// ============================================================================
// EXEMPLO 1: ANÁLISE ESSENCIAL (1 ÂNGULO)
// ============================================================================

console.log('='.repeat(80));
console.log('EXEMPLO 1: ANÁLISE ESSENCIAL (1 ângulo - vista sagital)');
console.log('='.repeat(80));

const essentialParams: AnalysisParams = {
  exerciseName: 'Agachamento Livre',
  captureSetup: {
    mode: CaptureMode.ESSENTIAL,
    angles: [CameraAngle.SAGITTAL_RIGHT],
    fps: 60,
    resolution: { width: 1920, height: 1080 },
    distanceToSubject: 3.0,
    synchronized: true,
    maxDesyncMs: 16
  },
  frames: generateMockFrames(120, CameraAngle.SAGITTAL_RIGHT), // 2 segundos @ 60fps
  scores: {
    motor: 75,
    stabilizer: 65,
    symmetry: 82,
    compensation: 25,
    igpb: 73
  }
};

try {
  const essentialAnalysis = biomechanicalAnalyzer.analyze(essentialParams);

  console.log('\n✅ Análise ESSENCIAL concluída com sucesso!\n');
  console.log(`ID: ${essentialAnalysis.analysisId}`);
  console.log(
    `Confiabilidade: ${formatConfidenceScore(essentialAnalysis.confidenceScore)} (${
      essentialAnalysis.confidenceLevel
    })`
  );
  console.log(`Qualidade Geral: ${calculateAnalysisQuality(essentialAnalysis).toFixed(1)}/100`);
  console.log(`Nível de Risco: ${essentialAnalysis.riskLevel}`);
  console.log(
    `Rotação Detectada: ${essentialAnalysis.rotationAnalysis.detected ? 'Sim' : 'Não'}`
  );

  if (essentialAnalysis.rotationAnalysis.detected) {
    console.log(
      `  - Confiança: ${essentialAnalysis.rotationAnalysis.confidence} (${formatConfidenceScore(
        essentialAnalysis.rotationAnalysis.confidenceScore
      )})`
    );
    console.log(
      `  - Magnitude: ${formatRotationMagnitude(essentialAnalysis.rotationAnalysis.magnitude)}`
    );
    console.log(`  - Tipo: ${essentialAnalysis.rotationAnalysis.type}`);
    console.log(`  - Origem: ${essentialAnalysis.rotationAnalysis.origin}`);
  }

  console.log(
    `\nAções Corretivas: ${essentialAnalysis.correctiveActions.length} recomendações`
  );
  essentialAnalysis.correctiveActions.forEach((action, i) => {
    console.log(`  ${i + 1}. [${action.priority.toUpperCase()}] ${action.description}`);
  });

  if (essentialAnalysis.upgradePrompt) {
    console.log(
      `\n📈 Upgrade Recomendado: ${essentialAnalysis.upgradePrompt.currentMode} → ${essentialAnalysis.upgradePrompt.recommendedMode}`
    );
    console.log(`   Razão: ${essentialAnalysis.upgradePrompt.reason}`);
  }

  console.log(
    `\nReteste: ${
      essentialAnalysis.retestRecommendation.recommended
        ? essentialAnalysis.retestRecommendation.timeframe
        : 'Não necessário'
    }`
  );

  // Gerar relatório Markdown
  // const report = formatBiomechanicalReport(essentialAnalysis);
  // console.log('\n--- RELATÓRIO MARKDOWN ---\n');
  // console.log(report);
} catch (error) {
  console.error('❌ Erro na análise ESSENCIAL:', (error as Error).message);
}

// ============================================================================
// EXEMPLO 2: ANÁLISE AVANÇADA (2 ÂNGULOS)
// ============================================================================

console.log('\n\n');
console.log('='.repeat(80));
console.log('EXEMPLO 2: ANÁLISE AVANÇADA (2 ângulos - sagital + frontal)');
console.log('='.repeat(80));

const advancedParams: AnalysisParams = {
  exerciseName: 'Levantamento Terra Convencional',
  captureSetup: {
    mode: CaptureMode.ADVANCED,
    angles: [CameraAngle.SAGITTAL_RIGHT, CameraAngle.FRONTAL_POSTERIOR],
    fps: 60,
    resolution: { width: 1920, height: 1080 },
    distanceToSubject: 3.0,
    synchronized: true,
    maxDesyncMs: 16
  },
  frames: [
    ...generateMockFrames(60, CameraAngle.SAGITTAL_RIGHT),
    ...generateMockFrames(60, CameraAngle.FRONTAL_POSTERIOR)
  ],
  scores: {
    motor: 82,
    stabilizer: 78,
    symmetry: 71,
    compensation: 35,
    igpb: 76
  }
};

try {
  const advancedAnalysis = biomechanicalAnalyzer.analyze(advancedParams);

  console.log('\n✅ Análise AVANÇADA concluída com sucesso!\n');
  console.log(`ID: ${advancedAnalysis.analysisId}`);
  console.log(
    `Confiabilidade: ${formatConfidenceScore(advancedAnalysis.confidenceScore)} (${
      advancedAnalysis.confidenceLevel
    })`
  );
  console.log(`Qualidade Geral: ${calculateAnalysisQuality(advancedAnalysis).toFixed(1)}/100`);
  console.log(`Nível de Risco: ${advancedAnalysis.riskLevel}`);
  console.log(`Rotação Detectada: ${advancedAnalysis.rotationAnalysis.detected ? 'Sim' : 'Não'}`);

  if (advancedAnalysis.rotationAnalysis.detected) {
    console.log(
      `  - Confiança: ${advancedAnalysis.rotationAnalysis.confidence} (${formatConfidenceScore(
        advancedAnalysis.rotationAnalysis.confidenceScore
      )})`
    );
    console.log(
      `  - Magnitude: ${formatRotationMagnitude(advancedAnalysis.rotationAnalysis.magnitude)}`
    );
    console.log(`  - Tipo: ${advancedAnalysis.rotationAnalysis.type}`);
    console.log(`  - Origem: ${advancedAnalysis.rotationAnalysis.origin}`);
    console.log(
      `  - Assimetrias: Ombro ${formatRotationMagnitude(
        advancedAnalysis.rotationAnalysis.bilateralDifference.shoulder
      )}, Quadril ${formatRotationMagnitude(
        advancedAnalysis.rotationAnalysis.bilateralDifference.hip
      )}, Joelho ${formatRotationMagnitude(
        advancedAnalysis.rotationAnalysis.bilateralDifference.knee
      )}`
    );
  }

  console.log(`\nAções Corretivas: ${advancedAnalysis.correctiveActions.length} recomendações`);
  advancedAnalysis.correctiveActions.forEach((action, i) => {
    console.log(`  ${i + 1}. [${action.priority.toUpperCase()}] ${action.description}`);
    console.log(`     Duração: ${action.duration}`);
  });

  if (advancedAnalysis.upgradePrompt) {
    console.log(
      `\n📈 Upgrade Recomendado: ${advancedAnalysis.upgradePrompt.currentMode} → ${advancedAnalysis.upgradePrompt.recommendedMode}`
    );
    console.log(`   Razão: ${advancedAnalysis.upgradePrompt.reason}`);
  }

  console.log(
    `\nReteste: ${
      advancedAnalysis.retestRecommendation.recommended
        ? advancedAnalysis.retestRecommendation.timeframe
        : 'Não necessário'
    }`
  );
} catch (error) {
  console.error('❌ Erro na análise AVANÇADA:', (error as Error).message);
}

// ============================================================================
// EXEMPLO 3: ANÁLISE PRO (3 ÂNGULOS)
// ============================================================================

console.log('\n\n');
console.log('='.repeat(80));
console.log('EXEMPLO 3: ANÁLISE PRO (3 ângulos - reconstrução 3D completa)');
console.log('='.repeat(80));

const proParams: AnalysisParams = {
  exerciseName: 'Supino Reto com Barra',
  captureSetup: {
    mode: CaptureMode.PRO,
    angles: [
      CameraAngle.SAGITTAL_RIGHT,
      CameraAngle.FRONTAL_POSTERIOR,
      CameraAngle.TRANSVERSE_SUPERIOR
    ],
    fps: 120,
    resolution: { width: 1920, height: 1080 },
    distanceToSubject: 3.0,
    synchronized: true,
    maxDesyncMs: 8
  },
  frames: [
    ...generateMockFrames(80, CameraAngle.SAGITTAL_RIGHT),
    ...generateMockFrames(80, CameraAngle.FRONTAL_POSTERIOR),
    ...generateMockFrames(80, CameraAngle.TRANSVERSE_SUPERIOR)
  ],
  scores: {
    motor: 88,
    stabilizer: 85,
    symmetry: 92,
    compensation: 12,
    igpb: 88
  }
};

try {
  const proAnalysis = biomechanicalAnalyzer.analyze(proParams);

  console.log('\n✅ Análise PRO concluída com sucesso!\n');
  console.log(`ID: ${proAnalysis.analysisId}`);
  console.log(
    `Confiabilidade: ${formatConfidenceScore(proAnalysis.confidenceScore)} (${
      proAnalysis.confidenceLevel
    })`
  );
  console.log(`Qualidade Geral: ${calculateAnalysisQuality(proAnalysis).toFixed(1)}/100`);
  console.log(`Nível de Risco: ${proAnalysis.riskLevel}`);
  console.log(`Rotação Detectada: ${proAnalysis.rotationAnalysis.detected ? 'Sim' : 'Não'}`);

  if (proAnalysis.rotationAnalysis.detected) {
    console.log(
      `  - Confiança: ${proAnalysis.rotationAnalysis.confidence} (${formatConfidenceScore(
        proAnalysis.rotationAnalysis.confidenceScore
      )})`
    );
    console.log(`  - Magnitude: ${formatRotationMagnitude(proAnalysis.rotationAnalysis.magnitude)}`);
    console.log(`  - Tipo: ${proAnalysis.rotationAnalysis.type}`);
    console.log(`  - Origem: ${proAnalysis.rotationAnalysis.origin}`);
    console.log(`  - Método: ${proAnalysis.rotationAnalysis.detectionMethod}`);
  }

  console.log(`\nFatores de Risco: ${proAnalysis.riskFactors.length}`);
  proAnalysis.riskFactors.forEach((factor, i) => {
    console.log(`  ${i + 1}. ${factor}`);
  });

  console.log(`\nAções Corretivas: ${proAnalysis.correctiveActions.length} recomendações`);
  proAnalysis.correctiveActions.forEach((action, i) => {
    console.log(`  ${i + 1}. [${action.priority.toUpperCase()}] ${action.category.toUpperCase()}`);
    console.log(`     ${action.description}`);
    console.log(`     Exercícios: ${action.exercises.slice(0, 2).join(', ')}...`);
  });

  console.log(
    `\nReteste: ${
      proAnalysis.retestRecommendation.recommended
        ? proAnalysis.retestRecommendation.timeframe
        : 'Não necessário'
    }`
  );

  // Processar em background (assíncrono)
  console.log('\n--- TESTE ASSÍNCRONO ---');
  biomechanicalAnalyzer
    .analyzeAsync(proParams)
    .then((result) => {
      console.log(`✅ Análise assíncrona concluída em ${result.rawData?.processingTime}ms`);
    })
    .catch((error) => {
      console.error('❌ Erro na análise assíncrona:', error.message);
    });
} catch (error) {
  console.error('❌ Erro na análise PRO:', (error as Error).message);
}

// ============================================================================
// EXEMPLO 4: ANÁLISE EM BATCH
// ============================================================================

console.log('\n\n');
console.log('='.repeat(80));
console.log('EXEMPLO 4: ANÁLISE EM BATCH (múltiplos exercícios)');
console.log('='.repeat(80));

const batchParams: AnalysisParams[] = [
  {
    exerciseName: 'Agachamento',
    captureSetup: {
      mode: CaptureMode.ESSENTIAL,
      angles: [CameraAngle.SAGITTAL_RIGHT],
      fps: 60,
      resolution: { width: 1920, height: 1080 },
      distanceToSubject: 3.0,
      synchronized: true,
      maxDesyncMs: 16
    },
    frames: generateMockFrames(60, CameraAngle.SAGITTAL_RIGHT),
    scores: { motor: 80, stabilizer: 75, symmetry: 85, compensation: 20, igpb: 78 }
  },
  {
    exerciseName: 'Levantamento Terra',
    captureSetup: {
      mode: CaptureMode.ESSENTIAL,
      angles: [CameraAngle.SAGITTAL_RIGHT],
      fps: 60,
      resolution: { width: 1920, height: 1080 },
      distanceToSubject: 3.0,
      synchronized: true,
      maxDesyncMs: 16
    },
    frames: generateMockFrames(60, CameraAngle.SAGITTAL_RIGHT),
    scores: { motor: 75, stabilizer: 70, symmetry: 80, compensation: 25, igpb: 74 }
  }
];

try {
  const batchResults = biomechanicalAnalyzer.analyzeBatch(batchParams);

  console.log(`\n✅ Análise em batch concluída: ${batchResults.length} exercícios\n`);

  batchResults.forEach((result, i) => {
    console.log(`${i + 1}. ${result.exerciseName}`);
    console.log(
      `   Confiabilidade: ${formatConfidenceScore(result.confidenceScore)} (${
        result.confidenceLevel
      })`
    );
    console.log(`   IGPB: ${result.scores.igpb}/100`);
    console.log(`   Risco: ${result.riskLevel}`);
    console.log(`   Ações Corretivas: ${result.correctiveActions.length}`);
  });
} catch (error) {
  console.error('❌ Erro na análise em batch:', (error as Error).message);
}

// ============================================================================
// EXEMPLO 5: VALIDAÇÃO DE ERRO
// ============================================================================

console.log('\n\n');
console.log('='.repeat(80));
console.log('EXEMPLO 5: VALIDAÇÃO DE ERRO (confiabilidade insuficiente)');
console.log('='.repeat(80));

const invalidParams: AnalysisParams = {
  exerciseName: 'Teste com FPS Baixo',
  captureSetup: {
    mode: CaptureMode.PRO, // PRO requer 85% de confiabilidade
    angles: [CameraAngle.SAGITTAL_RIGHT],
    fps: 15, // FPS muito baixo
    resolution: { width: 640, height: 480 }, // Resolução baixa
    distanceToSubject: 1.0, // Distância inadequada
    synchronized: false,
    maxDesyncMs: 100
  },
  frames: generateMockFrames(30, CameraAngle.SAGITTAL_RIGHT),
  scores: { motor: 70, stabilizer: 65, symmetry: 75, compensation: 30, igpb: 70 }
};

try {
  const invalidAnalysis = biomechanicalAnalyzer.analyze(invalidParams);
  console.log('⚠️  Análise concluída (não deveria acontecer)');
} catch (error) {
  console.log('✅ Erro esperado capturado com sucesso:');
  console.log(`   ${(error as Error).message}`);
}

console.log('\n\n');
console.log('='.repeat(80));
console.log('TODOS OS EXEMPLOS CONCLUÍDOS');
console.log('='.repeat(80));
