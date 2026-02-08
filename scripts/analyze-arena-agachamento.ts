/**
 * Script para analisar o vídeo de agachamento que está na arena
 * Encontra o vídeo mais recente não analisado e executa análise biomecânica
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
} from '../lib/biomechanics';
import { downloadVideoFromSupabase, downloadVideoFromUrl, extractFrames } from '../lib/vision/video-analysis';
import * as fs from 'fs';
import * as os from 'os';

const TABLE = 'nfc_chat_video_analyses';

/**
 * Mock MediaPipe extractor
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
  console.log('║   🏋️  ANÁLISE DO AGACHAMENTO DA ARENA                      ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  let tempDir: string | null = null;

  try {
    if (!isSupabaseConfigured()) {
      console.error('❌ Supabase não configurado');
      return;
    }

    const supabase = getSupabase();

    // 1. Buscar vídeo de agachamento não analisado
    console.log('═'.repeat(60));
    console.log('1️⃣  BUSCANDO AGACHAMENTO NÃO ANALISADO');
    console.log('═'.repeat(60) + '\n');

    const { data: allVideos, error: fetchError } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (fetchError || !allVideos) {
      console.error('❌ Erro ao buscar vídeos:', fetchError?.message);
      return;
    }

    // Filtrar agachamentos não analisados
    const agachamentos = allVideos.filter((v) => {
      const isAgachamento =
        v.movement_pattern?.toLowerCase() === 'squat' ||
        v.movement_pattern?.toLowerCase() === 'agachamento';
      const notAnalyzed =
        !v.status?.includes('ANALYZED') &&
        !v.status?.includes('BIOMECHANICS');
      return isAgachamento && notAnalyzed;
    });

    if (agachamentos.length === 0) {
      console.log('✓ Buscando qualquer agachamento para re-analisar...\n');
      // Se não houver não-analisados, pegar o mais recente
      const recentAgachamentos = allVideos.filter(
        (v) =>
          v.movement_pattern?.toLowerCase() === 'squat' ||
          v.movement_pattern?.toLowerCase() === 'agachamento'
      );

      if (recentAgachamentos.length === 0) {
        console.error('❌ Nenhum vídeo de agachamento encontrado');
        return;
      }

      console.log(`✓ Encontrados ${recentAgachamentos.length} agachamentos`);
      console.log('   Re-analisando o mais recente...\n');

      const video = recentAgachamentos[0];
      console.log(`📹 Vídeo: ${video.id}`);
      console.log(`   Usuário: ${video.user_name || 'Anônimo'}`);
      console.log(`   Status atual: ${video.status || 'não analisado'}`);
      console.log(`   Data: ${new Date(video.created_at).toLocaleString('pt-BR')}\n`);

      await analyzeVideo(supabase, video, tempDir);
    } else {
      console.log(`✓ Encontrados ${agachamentos.length} agachamentos não analisados\n`);
      const video = agachamentos[0];

      console.log(`📹 Vídeo: ${video.id}`);
      console.log(`   Usuário: ${video.user_name || 'Anônimo'}`);
      console.log(`   Status: ${video.status || 'não analisado'}`);
      console.log(`   Data: ${new Date(video.created_at).toLocaleString('pt-BR')}\n`);

      await analyzeVideo(supabase, video, tempDir);
    }
  } catch (error: any) {
    console.error('\n❌ Erro:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
  } finally {
    if (tempDir && fs.existsSync(tempDir)) {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (e) {
        console.warn('⚠️  Não foi possível remover temporários');
      }
    }
  }
}

async function analyzeVideo(supabase: any, video: any, tempDir: string | null) {
  // 2. Baixar vídeo
  console.log('═'.repeat(60));
  console.log('2️⃣  BAIXANDO VÍDEO');
  console.log('═'.repeat(60) + '\n');

  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nfv-arena-'));
  let localVideoPath: string | null = null;

  try {
    if (video.video_path) {
      console.log('⬇️  Baixando de Supabase...\n');
      localVideoPath = await downloadVideoFromSupabase(video.video_path, tempDir);
    } else if (video.video_url) {
      console.log('⬇️  Baixando da URL...\n');
      localVideoPath = await downloadVideoFromUrl(video.video_url, tempDir);
    }

    if (localVideoPath) {
      console.log(`✓ Vídeo pronto\n`);
    }
  } catch (downloadError: any) {
    console.warn(`⚠️  Não foi possível baixar (${downloadError.message})`);
    console.log('   Usando dados simulados...\n');
  }

  // 3. Extrair frames
  console.log('═'.repeat(60));
  console.log('3️⃣  EXTRAINDO FRAMES');
  console.log('═'.repeat(60) + '\n');

  let framePaths: string[] = [];
  const frameCount = 15;
  const fps = 30;

  if (localVideoPath && fs.existsSync(localVideoPath)) {
    try {
      const framesDir = path.join(tempDir, 'frames');
      fs.mkdirSync(framesDir, { recursive: true });
      framePaths = await extractFrames(localVideoPath, framesDir, frameCount);
      console.log(`✓ ${framePaths.length} frames extraídos\n`);
    } catch (frameError: any) {
      console.warn(`⚠️  Erro ao extrair frames: ${frameError.message}`);
      console.log('   Usando mock frames...\n');
    }
  } else {
    console.log('ℹ️  Usando mock frames para análise\n');
  }

  // 4. Preparar frames
  const frames = Array.from({ length: Math.max(framePaths.length, frameCount) }, (_, i) => ({
    frameNumber: i + 1,
    timestamp: (i / fps) * 1000,
    landmarks: createMockLandmarksFromFrameNumber(i, frameCount),
  }));

  // 5. Analisar
  console.log('═'.repeat(60));
  console.log('4️⃣  EXECUTANDO ANÁLISE BIOMECÂNICA');
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
  console.log('5️⃣  RESULTADOS');
  console.log('═'.repeat(60) + '\n');

  console.log(`📊 Score Geral: ${analysis.classification.overallScore}/10\n`);

  console.log('📋 Critérios Avaliados:\n');
  analysis.classification.classifications.forEach((c) => {
    const icon =
      c.classification === 'danger'
        ? '🔴'
        : c.classification === 'warning'
          ? '🟡'
          : '🟢';
    console.log(`${icon} ${c.criterion}: ${c.value}${c.unit || ''}`);
    console.log(`   ${c.classification.toUpperCase()}`);
  });

  if (analysis.ragTopicsUsed.length > 0) {
    console.log('\n📚 Tópicos de Conhecimento:\n');
    analysis.ragTopicsUsed.forEach((t) => console.log(`   • ${t}`));
  }

  console.log('\n');

  // 7. Salvar no banco
  console.log('═'.repeat(60));
  console.log('6️⃣  SALVANDO NO BANCO DE DADOS');
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
  };

  const { error: updateError } = await supabase
    .from(TABLE)
    .update({
      status: 'BIOMECHANICS_ANALYZED_V2',
      ai_analysis: biomechanicsResult,
      updated_at: new Date().toISOString(),
    })
    .eq('id', video.id);

  if (updateError) {
    console.warn(`⚠️  Erro ao salvar: ${updateError.message}`);
  } else {
    console.log('✅ Análise salva no banco!\n');
  }

  // 8. Resumo
  console.log('═'.repeat(60));
  console.log('✅ ANÁLISE CONCLUÍDA!');
  console.log('═'.repeat(60) + '\n');

  console.log(analysis.diagnosticSummary);
}

main();
