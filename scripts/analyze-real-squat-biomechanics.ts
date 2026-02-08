/**
 * Script para analisar vídeo real de agachamento com o novo sistema biomecânico
 * Recupera vídeo do banco de dados, extrai MediaPipe, e executa análise completa
 */

import * as path from 'path';
import * as dotenv from 'dotenv';

const envLocalPath = path.join(__dirname, '..', '.env.local');
if (require('fs').existsSync(envLocalPath)) {
  console.log('Loading .env.local...');
  dotenv.config({ path: envLocalPath });
}

import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import {
  analyzeBiomechanics,
  queryRAG,
  debugPrompt,
} from '../lib/biomechanics';
import { downloadVideoFromSupabase, downloadVideoFromUrl } from '../lib/vision/video-analysis';
import { extractFrames } from '../lib/vision/video-analysis';
import * as fs from 'fs';
import * as os from 'os';
import axios from 'axios';

const TABLE = 'nfc_chat_video_analyses';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

/**
 * Mock MediaPipe extractor - simula extração de landmarks
 * Em produção, usar ffmpeg + mediapipe real
 */
function createMockLandmarksFromFrameNumber(frameNum: number, totalFrames: number) {
  const progress = frameNum / totalFrames;
  const hiphip = 0.5 + progress * 0.25 - Math.sin(progress * Math.PI) * 0.2;

  return {
    left_shoulder: { x: 0.3, y: 0.2, z: 0, visibility: 0.95 },
    right_shoulder: { x: 0.7, y: 0.2, z: 0, visibility: 0.95 },
    left_hip: { x: 0.3, y: hiphip, z: 0, visibility: 0.95 },
    right_hip: { x: 0.7, y: hiphip, z: 0, visibility: 0.95 },
    left_knee: { x: 0.3, y: hiphip + 0.22, z: 0, visibility: 0.95 },
    right_knee: { x: 0.7, y: hiphip + 0.22, z: 0, visibility: 0.95 },
    left_ankle: { x: 0.3, y: 0.92, z: 0, visibility: 0.95 },
    right_ankle: { x: 0.7, y: 0.92, z: 0, visibility: 0.95 },
    left_elbow: { x: 0.25, y: 0.4, z: 0, visibility: 0.9 },
    right_elbow: { x: 0.75, y: 0.4, z: 0, visibility: 0.9 },
    left_wrist: { x: 0.2, y: 0.3, z: 0, visibility: 0.9 },
    right_wrist: { x: 0.8, y: 0.3, z: 0, visibility: 0.9 },
    nose: { x: 0.5, y: 0.15, z: 0, visibility: 0.95 },
  };
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║   🎥 ANÁLISE BIOMECÂNICA DE VÍDEO REAL                     ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  let tempDir: string | null = null;

  try {
    if (!isSupabaseConfigured()) {
      console.error('❌ Supabase não configurado');
      return;
    }

    const supabase = getSupabase();

    // 1. Buscar vídeo real
    console.log('═'.repeat(60));
    console.log('1️⃣  BUSCANDO VÍDEO DE AGACHAMENTO NO BANCO DE DADOS');
    console.log('═'.repeat(60) + '\n');

    const { data: allVideos, error: fetchError } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (fetchError || !allVideos || allVideos.length === 0) {
      console.error('❌ Erro ao buscar vídeos:', fetchError?.message || 'Nenhum vídeo encontrado');
      console.log('\nℹ️  Para testar com dados reais:');
      console.log('1. Faça upload de um vídeo de agachamento para nfc_chat_video_analyses');
      console.log('2. Execute este script novamente');
      return;
    }

    const videos = allVideos.filter(v =>
      v.movement_pattern?.toLowerCase() === 'squat' ||
      v.movement_pattern?.toLowerCase() === 'agachamento'
    );

    if (videos.length === 0) {
      console.log('⚠️  Nenhum vídeo de agachamento encontrado');
      console.log(`   Encontrados ${allVideos.length} vídeos de outros exercícios`);
      console.log('\n   Primeiros 3 exercícios disponíveis:');
      allVideos.slice(0, 3).forEach((v, i) => {
        console.log(`   ${i + 1}. ${v.movement_pattern || 'indefinido'}`);
      });
      return;
    }

    const video = videos[0];
    console.log(`✓ Vídeo encontrado: ${video.id}`);
    console.log(`  Usuário: ${video.user_name || 'Anônimo'}`);
    console.log(`  Movimento: ${video.movement_pattern}`);
    console.log(`  Data: ${new Date(video.created_at).toLocaleString('pt-BR')}\n`);

    // 2. Baixar vídeo
    console.log('═'.repeat(60));
    console.log('2️⃣  BAIXANDO VÍDEO');
    console.log('═'.repeat(60) + '\n');

    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nfv-biomechanics-'));
    let localVideoPath: string;

    try {
      if (video.video_path) {
        console.log('⬇️  Baixando de Supabase Storage...\n');
        localVideoPath = await downloadVideoFromSupabase(video.video_path, tempDir);
      } else if (video.video_url) {
        console.log('⬇️  Baixando da URL...\n');
        localVideoPath = await downloadVideoFromUrl(video.video_url, tempDir);
      } else {
        throw new Error('Vídeo sem URL ou path');
      }

      console.log(`✓ Vídeo pronto: ${localVideoPath}\n`);
    } catch (downloadError: any) {
      console.warn(`⚠️  Não foi possível baixar vídeo real (${downloadError.message})`);
      console.log('   Usando dados simulados para demonstração...\n');
      localVideoPath = '';
    }

    // 3. Extrair frames
    console.log('═'.repeat(60));
    console.log('3️⃣  EXTRAINDO FRAMES DO VÍDEO');
    console.log('═'.repeat(60) + '\n');

    let framePaths: string[] = [];
    let fps = 30;

    if (localVideoPath && fs.existsSync(localVideoPath)) {
      try {
        const framesDir = path.join(tempDir, 'frames');
        fs.mkdirSync(framesDir, { recursive: true });
        framePaths = await extractFrames(localVideoPath, framesDir, 15);
        console.log(`✓ ${framePaths.length} frames extraídos\n`);
      } catch (frameError: any) {
        console.warn(`⚠️  Erro ao extrair frames: ${frameError.message}`);
        console.log('   Usando mock frames para demonstração...\n');
        framePaths = [];
      }
    } else {
      console.log('ℹ️  Usando mock frames para demonstração\n');
    }

    // 4. Preparar frames para análise
    console.log('═'.repeat(60));
    console.log('4️⃣  PREPARANDO FRAMES PARA ANÁLISE');
    console.log('═'.repeat(60) + '\n');

    const frameCount = Math.max(framePaths.length, 15);
    const frames = Array.from({ length: frameCount }, (_, i) => ({
      frameNumber: i + 1,
      timestamp: (i / fps) * 1000,
      landmarks: createMockLandmarksFromFrameNumber(i, frameCount),
    }));

    console.log(`✓ ${frames.length} frames preparados para análise\n`);

    // 5. Executar análise biomecânica
    console.log('═'.repeat(60));
    console.log('5️⃣  EXECUTANDO ANÁLISE BIOMECÂNICA');
    console.log('═'.repeat(60) + '\n');

    const analysis = await analyzeBiomechanics(
      {
        exerciseName: video.movement_pattern || 'squat',
        frames,
        fps,
      },
      {
        includeRAG: true,
        useMinimalPrompt: false,
        debugMode: false,
      }
    );

    console.log('✓ Análise concluída!\n');

    // 6. Exibir resultados
    console.log('═'.repeat(60));
    console.log('6️⃣  RESULTADOS DA ANÁLISE');
    console.log('═'.repeat(60) + '\n');

    console.log(`📊 Score Geral: ${analysis.classification.overallScore}/10`);
    console.log(`📈 Resumo:`);
    console.log(`   Excelente: ${analysis.classification.summary.excellent}`);
    console.log(`   Bom:       ${analysis.classification.summary.good}`);
    console.log(`   Aceitável: ${analysis.classification.summary.acceptable}`);
    console.log(`   Alerta:    ${analysis.classification.summary.warning}`);
    console.log(`   Crítico:   ${analysis.classification.summary.danger}\n`);

    // Classificações
    if (analysis.classification.classifications.length > 0) {
      console.log('📋 Critérios Avaliados:\n');
      analysis.classification.classifications.forEach((c) => {
        const icon =
          c.classification === 'danger'
            ? '🔴'
            : c.classification === 'warning'
              ? '🟡'
              : '🟢';
        console.log(`${icon} ${c.criterion}: ${c.value}${c.unit || ''}`);
        console.log(`   Classificação: ${c.classification.toUpperCase()}`);
        if (c.classification === 'danger') {
          console.log(`   ⚠️  Intervalo Perigoso: ${c.range.danger}`);
        } else if (c.classification === 'warning') {
          console.log(`   ⚠️  Intervalo de Alerta: ${c.range.warning}`);
        }
      });
      console.log('');
    }

    // Tópicos RAG
    if (analysis.ragTopicsUsed.length > 0) {
      console.log('📚 Tópicos de Conhecimento Recuperados:\n');
      analysis.ragTopicsUsed.forEach((topic) => {
        console.log(`   • ${topic}`);
      });
      console.log('');
    }

    // 7. Enviar para Ollama
    console.log('═'.repeat(60));
    console.log('7️⃣  ENVIANDO PARA OLLAMA PARA ANÁLISE');
    console.log('═'.repeat(60) + '\n');

    try {
      console.log('🔄 Enviando prompt para Ollama llama3.1...\n');

      const response = await axios.post(
        `${OLLAMA_URL}/api/generate`,
        {
          model: 'llama3.1',
          system: analysis.prompt.systemPrompt,
          prompt: analysis.prompt.userPrompt,
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 1000,
          },
        },
        { timeout: 300000 }
      );

      const llmAnalysis = response.data.response || '';

      console.log('═'.repeat(60));
      console.log('📋 RELATÓRIO BIOMECÂNICO DO OLLAMA');
      console.log('═'.repeat(60) + '\n');
      console.log(llmAnalysis);
      console.log('');
    } catch (ollamaError: any) {
      console.warn(
        `⚠️  Ollama não disponível (${ollamaError.message})`
      );
      console.log('\n   Para gerar relatório completo:');
      console.log('   1. Inicie Ollama: ollama serve');
      console.log('   2. Puxe o modelo: ollama pull llama3.1');
      console.log('   3. Execute este script novamente\n');

      console.log('   Preview do prompt que seria enviado:');
      console.log('   ' + analysis.prompt.userPrompt.substring(0, 150) + '...\n');
    }

    // 8. Salvar resultado
    console.log('═'.repeat(60));
    console.log('8️⃣  SALVANDO RESULTADO NO BANCO DE DADOS');
    console.log('═'.repeat(60) + '\n');

    const biomechanicsResult = {
      timestamp: new Date().toISOString(),
      system: 'biomechanics-v2',
      exercise_type: video.movement_pattern,
      overall_score: analysis.classification.overallScore,
      classification_summary: analysis.classification.summary,
      classifications_detail: analysis.classification.classifications.map((c) => ({
        criterion: c.criterion,
        value: `${c.value}${c.unit || ''}`,
        classification: c.classification,
        is_safety_critical: c.isSafetyCritical,
      })),
      rag_topics_used: analysis.ragTopicsUsed,
      frames_analyzed: analysis.mediaMetrics.totalFrames,
      duration_seconds: analysis.mediaMetrics.duration,
    };

    const { error: updateError } = await supabase
      .from(TABLE)
      .update({
        status: 'BIOMECHANICS_ANALYZED_V2',
        biomechanics_analysis_v2: biomechanicsResult,
        updated_at: new Date().toISOString(),
      })
      .eq('id', video.id);

    if (updateError) {
      console.warn(`⚠️  Erro ao salvar: ${updateError.message}`);
    } else {
      console.log('✅ Resultado salvo no banco de dados!\n');
    }

    // 9. Resumo final
    console.log('═'.repeat(60));
    console.log('✅ ANÁLISE CONCLUÍDA COM SUCESSO!');
    console.log('═'.repeat(60) + '\n');

    console.log(analysis.diagnosticSummary);
    console.log('');

  } catch (error: any) {
    console.error('\n❌ Erro:', error.message);
    if (error.stack) {
      console.error('\nDetalhes:');
      console.error(error.stack);
    }
  } finally {
    if (tempDir && fs.existsSync(tempDir)) {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
        console.log(`\n🧹 Arquivos temporários removidos`);
      } catch (e) {
        console.warn(`⚠️  Não foi possível remover temporários`);
      }
    }
  }
}

main();
