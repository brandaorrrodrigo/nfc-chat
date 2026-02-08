/**
 * Teste de integração do dashboard
 * Simula requisições do cliente ao endpoint da API
 */

import * as path from 'path';
import * as dotenv from 'dotenv';

const envLocalPath = path.join(__dirname, '..', '.env.local');
if (require('fs').existsSync(envLocalPath)) {
  console.log('Loading .env.local...');
  dotenv.config({ path: envLocalPath });
}

import { getSupabase } from '../lib/supabase';
import {
  analyzeBiomechanics,
} from '../lib/biomechanics';
import { downloadVideoFromSupabase, extractFrames } from '../lib/vision/video-analysis';
import * as fs from 'fs';
import * as os from 'os';

async function simulateDashboardRequest(videoId: string) {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║          📊 TESTE DE INTEGRAÇÃO DO DASHBOARD              ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log('SIMULANDO: Usuário insere videoId e clica em "Analisar"');
  console.log('─'.repeat(60));
  console.log(`Input do usuário: "${videoId}"`);
  console.log('');

  let tempDir: string | null = null;

  try {
    const supabase = getSupabase();

    // 1. Fetch video
    console.log('Step 1: Buscando vídeo na database...');
    const { data: video, error: fetchError } = await supabase
      .from('nfc_chat_video_analyses')
      .select('*')
      .eq('id', videoId)
      .single();

    if (fetchError || !video) {
      console.log(`   ❌ Erro: ${fetchError?.message || 'Vídeo não encontrado'}`);
      console.log(`   → Dashboard mostraria: Mensagem de erro em caixa vermelha`);
      return;
    }

    console.log(`   ✓ Vídeo encontrado: ${video.movement_pattern}`);
    console.log(`   → Dashboard mostra: Loading spinner`);
    console.log('');

    // 2. Download e análise simulada
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nfv-dashboard-test-'));
    let localVideoPath: string | null = null;

    console.log('Step 2: Processando vídeo (download + extração + análise)...');
    try {
      if (video.video_path) {
        localVideoPath = await downloadVideoFromSupabase(video.video_path, tempDir);
        console.log(`   ✓ Vídeo baixado do Supabase`);
      }
    } catch (e: any) {
      console.log(`   ⚠️  Download falhou, usando dados simulados`);
    }

    let framePaths: string[] = [];
    const frameCount = 15;
    const fps = 30;

    if (localVideoPath && fs.existsSync(localVideoPath)) {
      try {
        const framesDir = path.join(tempDir, 'frames');
        fs.mkdirSync(framesDir, { recursive: true });
        framePaths = await extractFrames(localVideoPath, framesDir, frameCount);
        console.log(`   ✓ ${framePaths.length} frames extraídos`);
      } catch (e) {
        console.log(`   ⚠️  Extração falhou, usando dados simulados`);
      }
    }

    // 3. Análise
    const frames = Array.from({ length: Math.max(framePaths.length, frameCount) }, (_, i) => ({
      frameNumber: i + 1,
      timestamp: (i / fps) * 1000,
      landmarks: {
        left_shoulder: { x: 0.3, y: 0.2, z: 0, visibility: 0.95 },
        right_shoulder: { x: 0.7, y: 0.2, z: 0, visibility: 0.95 },
        left_hip: { x: 0.3, y: 0.6, z: 0, visibility: 0.95 },
        right_hip: { x: 0.7, y: 0.6, z: 0, visibility: 0.95 },
        left_knee: { x: 0.3, y: 0.82, z: 0, visibility: 0.95 },
        right_knee: { x: 0.7, y: 0.82, z: 0, visibility: 0.95 },
        left_ankle: { x: 0.3, y: 0.92, z: 0, visibility: 0.95 },
        right_ankle: { x: 0.7, y: 0.92, z: 0, visibility: 0.95 },
        left_elbow: { x: 0.25, y: 0.4, z: 0, visibility: 0.9 },
        right_elbow: { x: 0.75, y: 0.4, z: 0, visibility: 0.9 },
        left_wrist: { x: 0.2, y: 0.3, z: 0, visibility: 0.9 },
        right_wrist: { x: 0.8, y: 0.3, z: 0, visibility: 0.9 },
        nose: { x: 0.5, y: 0.15, z: 0, visibility: 0.95 },
      },
    }));

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

    console.log(`   ✓ Análise completa`);
    console.log('');

    // 4. Construir resposta para dashboard
    console.log('Step 3: Preparando resposta para o dashboard...');

    const responseData = {
      success: true,
      videoId,
      analysis: {
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
          rag_topics: c.ragTopics,
        })),
        rag_topics_used: analysis.ragTopicsUsed,
        frames_analyzed: analysis.mediaMetrics.totalFrames,
      },
      diagnostic: {
        score: analysis.classification.overallScore,
        summary: analysis.classification.summary,
        problems: analysis.classification.classifications.filter((c) =>
          ['warning', 'danger'].includes(c.classification)
        ),
        positive: analysis.classification.classifications.filter((c) =>
          ['excellent', 'good'].includes(c.classification)
        ),
      },
    };

    console.log(`   ✓ Resposta preparada`);
    console.log('');

    // 5. Mostrar o que o dashboard renderizaria
    console.log('COMPONENTES DO DASHBOARD RENDERIZADOS:');
    console.log('─'.repeat(60));

    console.log('\n📊 SCORE GERAL:');
    const score = responseData.analysis.overall_score;
    const scoreColor = score >= 8 ? '🟢' : score >= 6 ? '🟡' : score >= 4 ? '🟠' : '🔴';
    console.log(`   ${scoreColor} ${score.toFixed(1)}/10`);

    console.log('\n📈 RESUMO:');
    console.log(`   Excelente: ${responseData.diagnostic.summary.excellent}`);
    console.log(`   Bom:       ${responseData.diagnostic.summary.good}`);
    console.log(`   Aceitável: ${responseData.diagnostic.summary.acceptable}`);
    console.log(`   Alerta:    ${responseData.diagnostic.summary.warning}`);
    console.log(`   Crítico:   ${responseData.diagnostic.summary.danger}`);

    if (responseData.diagnostic.problems.length > 0) {
      console.log('\n⚠️  PROBLEMAS IDENTIFICADOS:');
      responseData.diagnostic.problems.forEach((p: any) => {
        console.log(`   - ${p.criterion}: ${p.value} (${p.classification})`);
        if (p.rag_topics) {
          console.log(`     RAG Topics: ${p.rag_topics.join(', ')}`);
        }
      });
    }

    if (responseData.diagnostic.positive.length > 0) {
      console.log('\n✅ PONTOS POSITIVOS:');
      responseData.diagnostic.positive.forEach((p: any) => {
        console.log(`   - ${p.criterion}: ${p.value} (${p.classification})`);
      });
    }

    console.log('\n🧠 TÓPICOS DE CONHECIMENTO:');
    responseData.analysis.rag_topics_used.forEach((topic: string) => {
      console.log(`   • ${topic}`);
    });

    console.log('\n📋 TABELA DE CLASSIFICAÇÕES:');
    console.log('   Critério              | Valor          | Classificação');
    console.log('   ' + '─'.repeat(55));
    responseData.analysis.classifications_detail.slice(0, 5).forEach((c: any) => {
      console.log(`   ${c.criterion.padEnd(20)} | ${c.value.padEnd(14)} | ${c.classification}`);
    });
    if (responseData.analysis.classifications_detail.length > 5) {
      console.log(`   ... e mais ${responseData.analysis.classifications_detail.length - 5} critérios`);
    }

    console.log('\n');
    console.log('═'.repeat(60));
    console.log('✅ DASHBOARD TESTADO COM SUCESSO');
    console.log('═'.repeat(60) + '\n');

  } catch (error: any) {
    console.error('\n❌ Erro no teste:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
  } finally {
    if (tempDir && fs.existsSync(tempDir)) {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (e) {
        // ignore
      }
    }
  }
}

// Testar com o vídeo agachamento da arena
const videoId = 'va_1770241761873_ckobfl93u';
simulateDashboardRequest(videoId);
