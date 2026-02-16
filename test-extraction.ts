import { videoExtractionService } from './src/services/video-extraction.service';
import { getVideoInfo } from './src/utils/video.helpers';

async function test() {
  const videoPath = './public/references/ouro/agachamento-perfeito.mp4';

  console.log('📹 Testando extração de vídeo...\n');

  try {
    // Obter informações
    const info = await getVideoInfo(videoPath);
    console.log('ℹ️  Informações do vídeo:');
    console.log(`   Nome: ${info.name}`);
    console.log(`   Tamanho: ${info.size}`);
    console.log(`   Duração: ${info.duration}`);
    console.log(`   Resolução: ${info.resolution}`);
    console.log(`   FPS: ${info.fps}`);
    console.log(`   Qualidade: ${info.quality}`);

    // Extrair frames
    console.log('\n📊 Extraindo frames...');
    const frames = await videoExtractionService.extractFrames(videoPath, {
      outputDir: './temp-frames',
      fps: 15,
      maxFrames: 30,
      format: 'jpg',
      onProgress: (p) => process.stdout.write(`\r⏳ Progresso: ${p.toFixed(1)}%`)
    });

    console.log(`\n✅ ${frames.length} frames extraídos!`);
    console.log(`   Frames: ${frames[0]} ... ${frames[frames.length - 1]}`);

    // Cleanup
    await videoExtractionService.cleanupFrames('./temp-frames');
    console.log('✅ Cleanup concluído');

  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

test();
