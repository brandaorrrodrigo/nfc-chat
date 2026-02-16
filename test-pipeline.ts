import { videoProcessingPipeline } from './src/pipelines/video-processing.pipeline';
import { CaptureMode, CameraAngle } from './src/types/biomechanical-analysis.types';

async function test() {
  const videoPath = './public/references/ouro/agachamento-perfeito.mp4';

  console.log('🎬 Testando pipeline completo...\n');

  try {
    const result = await videoProcessingPipeline.process({
      videoPath,
      exerciseName: 'Agachamento Livre',
      captureMode: CaptureMode.ESSENTIAL,
      cameraAngle: CameraAngle.SAGITTAL_RIGHT,
      fps: 15,
      maxFrames: 45, // 3 segundos @ 15fps
      onProgress: (p) => process.stdout.write(`\r⏳ Progresso: ${p.toFixed(1)}%`)
    });

    console.log('\n\n✅ Processamento concluído!\n');

    console.log('📊 Metadados:');
    console.log(`   Frames processados: ${result.metadata.processedFrames}/${result.metadata.totalFrames}`);
    console.log(`   Taxa de sucesso: ${result.metadata.successRate}%`);
    console.log(`   Tempo: ${(result.metadata.processingTimeMs / 1000).toFixed(1)}s`);
    console.log(`   FPS médio: ${result.metadata.fps.toFixed(1)}`);

    console.log('\n🔬 Análise Biomecânica:');
    console.log(`   Confiabilidade: ${result.analysis.confidenceScore.toFixed(1)}% (${result.analysis.confidenceLevel})`);
    console.log(`   Risco: ${result.analysis.riskLevel}`);

    console.log('\n📈 Scores:');
    console.log(`   Motor: ${result.analysis.scores.motor.toFixed(1)}`);
    console.log(`   Stabilizer: ${result.analysis.scores.stabilizer.toFixed(1)}`);
    console.log(`   Symmetry: ${result.analysis.scores.symmetry.toFixed(1)}`);
    console.log(`   Compensation: ${result.analysis.scores.compensation.toFixed(1)}`);
    console.log(`   IGPB: ${result.analysis.scores.igpb.toFixed(1)}`);

    if (result.analysis.rotationAnalysis.detected) {
      console.log('\n🔄 Rotação Detectada:');
      console.log(`   Confiança: ${result.analysis.rotationAnalysis.confidence}`);
      console.log(`   Tipo: ${result.analysis.rotationAnalysis.type}`);
      console.log(`   Magnitude: ${result.analysis.rotationAnalysis.magnitude.toFixed(1)}°`);
    }

    console.log(`\n💪 Ações Corretivas: ${result.analysis.correctiveActions.length}`);

  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

test();
