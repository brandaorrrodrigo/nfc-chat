/**
 * Script para análise DIRETA de vídeo com Ollama
 * Bypassa a API e faz a análise localmente
 *
 * Uso: node scripts/analyze-video-direct.js <analysisId>
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Configurações
const OLLAMA_URL = 'http://localhost:11434';
const VISION_MODEL = 'llama3.2-vision:latest';
const FALLBACK_MODEL = 'llava:latest';

// Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase não configurado');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const analysisId = process.argv[2];

if (!analysisId) {
  console.error('❌ Uso: node scripts/analyze-video-direct.js <analysisId>');
  process.exit(1);
}

async function main() {
  console.log('🎥 Análise Direta com Ollama Vision\n');

  // 1. Buscar análise no banco
  console.log(`📋 Buscando: ${analysisId}`);
  const { data: analysis, error } = await supabase
    .from('nfc_chat_video_analyses')
    .select('*')
    .eq('id', analysisId)
    .single();

  if (error || !analysis) {
    console.error('❌ Análise não encontrada:', error?.message);
    process.exit(1);
  }

  console.log('   Arena:', analysis.arena_slug);
  console.log('   Padrão:', analysis.movement_pattern);
  console.log('   URL:', analysis.video_url);
  console.log('');

  // 2. Verificar Ollama
  console.log('🤖 Verificando Ollama...');
  let visionModel = null;

  try {
    const { data } = await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 5000 });
    const models = data.models?.map(m => m.name) || [];

    if (models.includes(VISION_MODEL)) {
      visionModel = VISION_MODEL;
    } else if (models.includes(FALLBACK_MODEL)) {
      visionModel = FALLBACK_MODEL;
    } else {
      // Procurar qualquer modelo de visão
      visionModel = models.find(m => m.includes('vision') || m.includes('llava'));
    }

    if (!visionModel) {
      console.error('❌ Nenhum modelo de visão encontrado');
      console.log('   Modelos disponíveis:', models.join(', '));
      console.log('   Execute: ollama pull llama3.2-vision');
      process.exit(1);
    }

    console.log('   ✅ Modelo:', visionModel);
  } catch (err) {
    console.error('❌ Ollama não está rodando:', err.message);
    console.log('   Execute: ollama serve');
    process.exit(1);
  }

  // 3. Criar diretório temporário
  const tempDir = path.join(process.cwd(), 'temp', `analysis_${Date.now()}`);
  await fs.mkdir(tempDir, { recursive: true });
  console.log('📁 Temp dir:', tempDir);

  try {
    // 4. Baixar vídeo
    console.log('\n⬇️  Baixando vídeo...');
    const videoPath = path.join(tempDir, 'video.mp4');

    const videoResponse = await axios.get(analysis.video_url, {
      responseType: 'arraybuffer',
      timeout: 120000,
      onDownloadProgress: (p) => {
        if (p.total) {
          const pct = Math.round((p.loaded / p.total) * 100);
          process.stdout.write(`\r   ${pct}% (${Math.round(p.loaded/1024)}KB)`);
        }
      }
    });

    await fs.writeFile(videoPath, Buffer.from(videoResponse.data));
    console.log('\n   ✅ Download completo');

    // 5. Verificar ffmpeg
    console.log('\n🎬 Verificando ffmpeg...');
    try {
      await execAsync('ffmpeg -version');
      console.log('   ✅ ffmpeg disponível');
    } catch {
      console.error('❌ ffmpeg não instalado');
      console.log('   Windows: choco install ffmpeg');
      console.log('   Mac: brew install ffmpeg');
      process.exit(1);
    }

    // 6. Extrair frames
    console.log('\n🖼️  Extraindo frames...');
    const framesCount = 6;
    const framePaths = [];

    // Obter duração do vídeo
    const { stdout: durationOut } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`
    );
    const duration = parseFloat(durationOut.trim()) || 10;
    console.log(`   Duração: ${duration.toFixed(1)}s`);

    const interval = duration / (framesCount + 1);

    for (let i = 1; i <= framesCount; i++) {
      const timestamp = interval * i;
      const framePath = path.join(tempDir, `frame_${i}.jpg`);

      await execAsync(
        `ffmpeg -ss ${timestamp} -i "${videoPath}" -vframes 1 -q:v 2 "${framePath}" -y`
      );

      framePaths.push(framePath);
      process.stdout.write(`\r   Frame ${i}/${framesCount}`);
    }
    console.log('\n   ✅ Frames extraídos');

    // 7. Analisar cada frame com Ollama
    console.log('\n🔍 Analisando frames com', visionModel, '...');

    const exerciseType = analysis.movement_pattern || 'exercício';
    const prompt = `Você é um especialista em biomecânica analisando um vídeo de ${exerciseType}.

Analise este frame e identifique:
- Técnica e execução
- Postura e alinhamento
- Possíveis compensações
- Pontos de atenção

Seja objetivo e técnico. Responda em português.`;

    const frameAnalyses = [];

    for (let i = 0; i < framePaths.length; i++) {
      process.stdout.write(`\r   Analisando frame ${i + 1}/${framePaths.length}...`);

      const imageBuffer = await fs.readFile(framePaths[i]);
      const imageBase64 = imageBuffer.toString('base64');

      try {
        const response = await axios.post(
          `${OLLAMA_URL}/api/generate`,
          {
            model: visionModel,
            prompt,
            images: [imageBase64],
            stream: false,
            options: { temperature: 0.3, num_predict: 300 },
          },
          { timeout: 120000 }
        );

        const analysisText = response.data.response || '';

        // Calcular score
        let score = 7;
        const lower = analysisText.toLowerCase();
        if (lower.includes('correto') || lower.includes('boa')) score += 1;
        if (lower.includes('problema') || lower.includes('erro')) score -= 1;
        if (lower.includes('grave') || lower.includes('severo')) score -= 2;
        score = Math.max(0, Math.min(10, score));

        frameAnalyses.push({
          frameNumber: i + 1,
          timestamp: interval * (i + 1),
          analysis: analysisText,
          score,
        });

      } catch (err) {
        console.error(`\n   ⚠️ Erro no frame ${i + 1}:`, err.message);
        frameAnalyses.push({
          frameNumber: i + 1,
          timestamp: interval * (i + 1),
          analysis: 'Erro ao analisar',
          score: 5,
        });
      }
    }

    console.log('\n   ✅ Análise de frames completa');

    // 8. Calcular resultado final
    const overallScore = frameAnalyses.reduce((sum, f) => sum + f.score, 0) / frameAnalyses.length;

    const aiAnalysis = {
      movement_pattern: exerciseType,
      analysis_type: 'vision_model',
      model: visionModel,
      timestamp: new Date().toISOString(),
      overall_score: overallScore,
      frames_analyzed: frameAnalyses.length,
      frame_scores: frameAnalyses.map(f => f.score),
      frame_analyses: frameAnalyses.map(f => ({
        frame: f.frameNumber,
        timestamp: f.timestamp.toFixed(1) + 's',
        analysis: f.analysis.substring(0, 500),
        score: f.score,
      })),
      summary: `Análise de ${exerciseType}: Score médio ${overallScore.toFixed(1)}/10 baseado em ${frameAnalyses.length} frames analisados com ${visionModel}.`,
      recommendations: [
        overallScore >= 7 ? 'Boa execução! Continue praticando.' : 'Foque na correção técnica.',
        'Revise os pontos identificados em cada frame.',
      ],
    };

    // 9. Salvar no banco
    console.log('\n💾 Salvando resultado...');

    const { error: updateError } = await supabase
      .from('nfc_chat_video_analyses')
      .update({
        ai_analysis: aiAnalysis,
        ai_analyzed_at: new Date().toISOString(),
        ai_confidence: overallScore / 10,
        status: 'AI_ANALYZED',
      })
      .eq('id', analysisId);

    if (updateError) {
      console.error('❌ Erro ao salvar:', updateError.message);
    } else {
      console.log('   ✅ Salvo no banco!');
    }

    // 10. Resultado final
    console.log('\n' + '='.repeat(50));
    console.log('📊 RESULTADO DA ANÁLISE');
    console.log('='.repeat(50));
    console.log(`   Score: ${overallScore.toFixed(1)}/10`);
    console.log(`   Frames: ${frameAnalyses.length}`);
    console.log(`   Modelo: ${visionModel}`);
    console.log('');
    console.log('📝 Análise por frame:');
    frameAnalyses.forEach(f => {
      console.log(`   Frame ${f.frameNumber} (${f.timestamp.toFixed(1)}s): ${f.score}/10`);
      console.log(`      ${f.analysis.substring(0, 100)}...`);
    });
    console.log('='.repeat(50));

  } finally {
    // Limpar temp
    try {
      await fs.rm(tempDir, { recursive: true });
      console.log('\n🧹 Arquivos temporários removidos');
    } catch {}
  }
}

main().catch(err => {
  console.error('❌ Erro fatal:', err);
  process.exit(1);
});
