import { poseDetectionService } from './src/services/pose-detection.service';

async function test() {
  console.log('🤖 Inicializando detector MediaPipe...');

  try {
    await poseDetectionService.initialize();
    console.log('✅ Detector inicializado com sucesso!');

    const info = poseDetectionService.getInfo();
    console.log('ℹ️  Informações do detector:');
    console.log(`   Modelo: ${info.modelType}`);
    console.log(`   Backend: ${info.backend}`);

    console.log('\n🏃 Executando benchmark...');
    const stats = await poseDetectionService.benchmark(5);
    console.log(`✅ Benchmark concluído!`);
    console.log(`   Tempo médio: ${stats.avgTime}ms`);
    console.log(`   FPS: ${stats.fps}`);

    await poseDetectionService.dispose();
    console.log('✅ Detector descartado');
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

test();
