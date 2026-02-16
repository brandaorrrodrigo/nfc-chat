/**
 * Exemplo Completo de Análise de Vídeo
 *
 * Demonstra o uso do sistema de processamento de vídeo
 * com MediaPipe + Análise Biomecânica NFC/NFV.
 */

import { videoProcessingPipeline } from '../pipelines/video-processing.pipeline';
import { realtimeProcessingPipeline } from '../pipelines/realtime-processing.pipeline';
import { CaptureMode, CameraAngle } from '../types/biomechanical-analysis.types';
import {
  formatBiomechanicalReport,
  formatConfidenceScore,
  formatRotationMagnitude
} from '../utils/biomechanical.helpers';
import {
  getVideoInfo,
  formatProcessingTime,
  formatSuccessRate
} from '../utils/video.helpers';
import * as path from 'path';

/**
 * Exemplo 1: Análise de Vídeo Modo ESSENCIAL
 */
async function example1_EssentialMode() {
  console.log('='.repeat(80));
  console.log('EXEMPLO 1: Análise de Vídeo - Modo ESSENCIAL');
  console.log('='.repeat(80));
  console.log();

  const videoPath = './test-videos/agachamento-lateral.mp4';

  // Exibir informações do vídeo
  console.log('📹 Informações do Vídeo:');
  try {
    const videoInfo = await getVideoInfo(videoPath);
    console.log(`   Nome: ${videoInfo.name}`);
    console.log(`   Tamanho: ${videoInfo.size}`);
    console.log(`   Duração: ${videoInfo.duration}`);
    console.log(`   Resolução: ${videoInfo.resolution}`);
    console.log(`   FPS: ${videoInfo.fps}`);
    console.log(`   Qualidade: ${videoInfo.quality}`);
    console.log(`   Codec: ${videoInfo.codec || 'N/A'}`);
    console.log();
  } catch (error) {
    console.error(`❌ Erro ao obter informações: ${(error as Error).message}`);
    console.log(`⚠️  Vídeo não encontrado. Pulando exemplo 1.\n`);
    return;
  }

  // Processar vídeo
  try {
    console.log('🎬 Iniciando processamento...\n');

    const result = await videoProcessingPipeline.process({
      videoPath,
      exerciseName: 'Agachamento Livre',
      captureMode: CaptureMode.ESSENTIAL,
      cameraAngle: CameraAngle.SAGITTAL_RIGHT,
      fps: 30, // Reduzir FPS para processamento mais rápido
      maxFrames: 90, // Limitar a 3 segundos @ 30fps
      onProgress: (progress) => {
        process.stdout.write(`\r⏳ Progresso: ${progress.toFixed(1)}%`);
      }
    });

    console.log('\n');
    console.log('✅ Processamento concluído!\n');

    // Exibir metadados
    console.log('📊 Metadados do Processamento:');
    console.log(`   Total de frames: ${result.metadata.totalFrames}`);
    console.log(`   Frames processados: ${result.metadata.processedFrames}`);
    console.log(
      `   Taxa de sucesso: ${formatSuccessRate(
        result.metadata.processedFrames,
        result.metadata.totalFrames
      )}`
    );
    console.log(
      `   Tempo de processamento: ${formatProcessingTime(
        result.metadata.processingTimeMs
      )}`
    );
    console.log(`   FPS médio: ${result.metadata.fps.toFixed(1)}`);
    console.log();

    // Exibir análise biomecânica
    console.log('🔬 Análise Biomecânica:');
    console.log();
    console.log(`ID: ${result.analysis.analysisId}`);
    console.log(
      `Confiabilidade: ${formatConfidenceScore(
        result.analysis.confidenceScore
      )} (${result.analysis.confidenceLevel})`
    );
    console.log(`Nível de Risco: ${result.analysis.riskLevel}`);
    console.log();

    console.log('📈 Scores de Movimento:');
    console.log(`   Motor: ${result.analysis.scores.motor.toFixed(1)}/100`);
    console.log(
      `   Stabilizer: ${result.analysis.scores.stabilizer.toFixed(1)}/100`
    );
    console.log(
      `   Symmetry: ${result.analysis.scores.symmetry.toFixed(1)}/100`
    );
    console.log(
      `   Compensation: ${result.analysis.scores.compensation.toFixed(1)}/100`
    );
    console.log(`   IGPB: ${result.analysis.scores.igpb.toFixed(1)}/100`);
    console.log();

    // Detecção de rotação
    if (result.analysis.rotationAnalysis.detected) {
      console.log('🔄 Compensação Rotacional Detectada:');
      console.log(
        `   Confiança: ${result.analysis.rotationAnalysis.confidence} (${formatConfidenceScore(
          result.analysis.rotationAnalysis.confidenceScore
        )})`
      );
      console.log(`   Tipo: ${result.analysis.rotationAnalysis.type}`);
      console.log(`   Origem: ${result.analysis.rotationAnalysis.origin}`);
      console.log(
        `   Magnitude: ${formatRotationMagnitude(
          result.analysis.rotationAnalysis.magnitude
        )}`
      );
      console.log();
    }

    // Ações corretivas
    if (result.analysis.correctiveActions.length > 0) {
      console.log('💪 Protocolo Corretivo:');
      result.analysis.correctiveActions.forEach((action, i) => {
        console.log(
          `\n   ${i + 1}. [${action.priority.toUpperCase()}] ${
            action.description
          }`
        );
        console.log(`      Duração: ${action.duration}`);
        console.log(`      Exercícios: ${action.exercises.slice(0, 2).join(', ')}...`);
      });
      console.log();
    }

    // Recomendação de reteste
    if (result.analysis.retestRecommendation.recommended) {
      console.log('🔁 Recomendação de Reteste:');
      console.log(
        `   Prazo: ${result.analysis.retestRecommendation.timeframe}`
      );
      console.log(
        `   Razão: ${result.analysis.retestRecommendation.reason}`
      );
      console.log();
    }

    // Prompt de upgrade
    if (result.analysis.upgradePrompt) {
      console.log('📈 Recomendação de Upgrade:');
      console.log(
        `   ${result.analysis.upgradePrompt.currentMode} → ${result.analysis.upgradePrompt.recommendedMode}`
      );
      console.log(`   ${result.analysis.upgradePrompt.reason}`);
      console.log();
    }
  } catch (error) {
    console.error(`\n❌ Erro no processamento: ${(error as Error).message}\n`);
  }
}

/**
 * Exemplo 2: Análise Multi-Ângulo (Modo AVANÇADO)
 */
async function example2_AdvancedMode() {
  console.log('\n\n');
  console.log('='.repeat(80));
  console.log('EXEMPLO 2: Análise Multi-Ângulo - Modo AVANÇADO');
  console.log('='.repeat(80));
  console.log();

  const videoPaths = [
    './test-videos/deadlift-lateral.mp4',
    './test-videos/deadlift-posterior.mp4'
  ];

  const cameraAngles = [
    CameraAngle.SAGITTAL_RIGHT,
    CameraAngle.FRONTAL_POSTERIOR
  ];

  try {
    console.log(
      `🎥 Processando ${videoPaths.length} vídeos (modo ADVANCED)...\n`
    );

    const result = await videoProcessingPipeline.processMultipleAngles({
      videoPaths,
      cameraAngles,
      exerciseName: 'Levantamento Terra Convencional',
      captureMode: CaptureMode.ADVANCED,
      fps: 30,
      maxFrames: 60,
      onProgress: (progress) => {
        process.stdout.write(`\r⏳ Progresso: ${progress.toFixed(1)}%`);
      }
    });

    console.log('\n');
    console.log('✅ Processamento multi-ângulo concluído!\n');

    console.log('📊 Resultado da Análise:');
    console.log(
      `   Confiabilidade: ${formatConfidenceScore(
        result.analysis.confidenceScore
      )} (${result.analysis.confidenceLevel})`
    );
    console.log(`   IGPB: ${result.analysis.scores.igpb.toFixed(1)}/100`);
    console.log(`   Risco: ${result.analysis.riskLevel}`);
    console.log(
      `   Rotação Detectada: ${
        result.analysis.rotationAnalysis.detected ? 'Sim' : 'Não'
      }`
    );

    if (result.analysis.rotationAnalysis.detected) {
      console.log(
        `   Confiança da Rotação: ${result.analysis.rotationAnalysis.confidence}`
      );
    }

    console.log();
  } catch (error) {
    console.error(`❌ Erro: ${(error as Error).message}`);
    console.log(`⚠️  Vídeos não encontrados. Pulando exemplo 2.\n`);
  }
}

/**
 * Exemplo 3: Processamento em Tempo Real (simulado)
 */
async function example3_RealtimeMode() {
  console.log('\n\n');
  console.log('='.repeat(80));
  console.log('EXEMPLO 3: Processamento em Tempo Real (Simulado)');
  console.log('='.repeat(80));
  console.log();

  const videoPath = './test-videos/agachamento-lateral.mp4';

  try {
    // Importar serviço de extração para simular frames
    const { videoExtractionService } = await import(
      '../services/video-extraction.service'
    );

    // Extrair frames
    console.log('📹 Extraindo frames para simulação...\n');
    const framesDir = path.join('/tmp', `nfv-realtime-${Date.now()}`);

    const framePaths = await videoExtractionService.extractFrames(videoPath, {
      outputDir: framesDir,
      fps: 15, // Simular taxa baixa
      maxFrames: 45, // 3 segundos @ 15fps
      format: 'jpg'
    });

    console.log(`✅ ${framePaths.length} frames extraídos\n`);

    // Iniciar sessão em tempo real
    console.log('🎥 Iniciando sessão em tempo real...\n');

    await realtimeProcessingPipeline.start({
      exerciseName: 'Agachamento Livre',
      captureMode: CaptureMode.ESSENTIAL,
      cameraAngle: CameraAngle.SAGITTAL_RIGHT,
      bufferSize: 30,
      autoAnalyze: true,
      analyzeInterval: 30,
      onFrameProcessed: (frame, quality) => {
        console.log(
          `✓ Frame ${frame.frameNumber} processado (qualidade: ${quality}%)`
        );
      },
      onAnalysisComplete: (analysis) => {
        console.log(
          `\n🔬 Análise Automática Completa (IGPB: ${analysis.scores.igpb.toFixed(
            1
          )})\n`
        );
      }
    });

    // Simular processamento de frames
    for (let i = 0; i < framePaths.length; i++) {
      const imageData = await videoExtractionService.loadFrameAsImageData(
        framePaths[i]
      );

      await realtimeProcessingPipeline.processFrame(imageData);

      // Simular delay entre frames (~60fps)
      await new Promise((resolve) => setTimeout(resolve, 16));
    }

    // Parar e obter análise final
    console.log('\n🛑 Parando sessão...\n');
    const finalAnalysis = await realtimeProcessingPipeline.stop();

    if (finalAnalysis) {
      console.log('📊 Análise Final:');
      console.log(`   IGPB: ${finalAnalysis.scores.igpb.toFixed(1)}/100`);
      console.log(
        `   Confiabilidade: ${formatConfidenceScore(
          finalAnalysis.confidenceScore
        )}`
      );
    }

    // Cleanup
    await videoExtractionService.cleanupFrames(framesDir);

    console.log();
  } catch (error) {
    console.error(`❌ Erro: ${(error as Error).message}`);
    console.log(`⚠️  Erro na simulação em tempo real.\n`);
  }
}

/**
 * Exemplo 4: Geração de Relatório Completo
 */
async function example4_FullReport() {
  console.log('\n\n');
  console.log('='.repeat(80));
  console.log('EXEMPLO 4: Geração de Relatório Completo (Markdown)');
  console.log('='.repeat(80));
  console.log();

  const videoPath = './test-videos/agachamento-lateral.mp4';

  try {
    console.log('🎬 Processando vídeo...\n');

    const result = await videoProcessingPipeline.process({
      videoPath,
      exerciseName: 'Agachamento Livre',
      captureMode: CaptureMode.ESSENTIAL,
      fps: 30,
      maxFrames: 60,
      onProgress: () => {} // Silencioso
    });

    console.log('✅ Processamento concluído!\n');
    console.log('📝 Gerando relatório completo...\n');

    // Gerar relatório Markdown
    const report = formatBiomechanicalReport(result.analysis);

    console.log('─'.repeat(80));
    console.log(report);
    console.log('─'.repeat(80));
    console.log();
  } catch (error) {
    console.error(`❌ Erro: ${(error as Error).message}`);
    console.log(`⚠️  Vídeo não encontrado. Pulando exemplo 4.\n`);
  }
}

/**
 * Main: Executar todos os exemplos
 */
async function main() {
  console.log('\n');
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(15) + '🎥 SISTEMA DE ANÁLISE DE VÍDEO NFC/NFV' + ' '.repeat(24) + '║');
  console.log('║' + ' '.repeat(20) + 'Exemplos de Uso Completos' + ' '.repeat(32) + '║');
  console.log('╚' + '═'.repeat(78) + '╝');
  console.log();

  try {
    // Exemplo 1: Modo Essencial
    await example1_EssentialMode();

    // Exemplo 2: Modo Avançado (Multi-Ângulo)
    await example2_AdvancedMode();

    // Exemplo 3: Tempo Real (Simulado)
    await example3_RealtimeMode();

    // Exemplo 4: Relatório Completo
    await example4_FullReport();

    console.log('\n');
    console.log('='.repeat(80));
    console.log('✅ TODOS OS EXEMPLOS CONCLUÍDOS COM SUCESSO!');
    console.log('='.repeat(80));
    console.log();
  } catch (error) {
    console.error('\n❌ Erro fatal:', error);
    process.exit(1);
  }
}

// Executar se for script principal
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Erro não tratado:', error);
    process.exit(1);
  });
}

export { main };
