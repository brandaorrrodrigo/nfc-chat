/**
 * Script para refazer análise biomecânica do vídeo de agachamento
 * Acessa diretamente a API de análise (sem passar pelo servidor web)
 */

import * as path from 'path';
import * as dotenv from 'dotenv';

const envLocalPath = path.join(__dirname, '..', '.env.local');

if (require('fs').existsSync(envLocalPath)) {
  console.log('Loading .env.local...');
  dotenv.config({ path: envLocalPath });
}

import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import { analyzeExerciseVideo, checkVisionModelAvailable, downloadVideoFromUrl, downloadVideoFromSupabase } from '../lib/vision/video-analysis';
import * as fs from 'fs';
import * as os from 'os';

const TABLE = 'nfc_chat_video_analyses';

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║   🎥 ANÁLISE BIOMECÂNICA DIRETA DO AGACHAMENTO         ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  let tempDir: string | null = null;

  try {
    if (!isSupabaseConfigured()) {
      console.error('❌ Supabase não configurado');
      return;
    }

    const supabase = getSupabase();

    // 1. Buscar vídeo de agachamento
    console.log('🔍 Buscando vídeo de agachamento mais recente...\n');

    const { data: allVideos, error: fetchError } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (fetchError) {
      console.error('❌ Erro ao buscar vídeos:', fetchError.message);
      return;
    }

    const videos = allVideos?.filter(v =>
      v.movement_pattern?.toLowerCase() === 'squat' ||
      v.movement_pattern?.toLowerCase() === 'agachamento'
    ) || [];

    if (!videos || videos.length === 0) {
      console.error('❌ Nenhum vídeo de agachamento encontrado');
      return;
    }

    const video = videos[0];
    console.log(`📹 Vídeo encontrado: ${video.id}`);
    console.log(`   Usuário: ${video.user_name || 'Anônimo'}`);
    console.log(`   Status: ${video.status}`);
    console.log(`   Data: ${new Date(video.created_at).toLocaleString('pt-BR')}\n`);

    // 2. Verificar se Vision Model está disponível
    console.log('🔍 Verificando disponibilidade do Ollama llama3.2-vision...\n');
    const visionAvailable = await checkVisionModelAvailable();

    if (!visionAvailable) {
      console.warn('⚠️  Vision model (Ollama) não disponível');
      console.log('   Certifique-se de que Ollama está rodando: ollama serve\n');
      return;
    }

    console.log('✅ Ollama disponível!\n');

    // 3. Baixar vídeo
    console.log('═'.repeat(60));
    console.log('🚀 PREPARANDO VÍDEO PARA ANÁLISE');
    console.log('═'.repeat(60) + '\n');

    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nfv-analysis-'));
    console.log(`📁 Diretório temporário: ${tempDir}\n`);

    let localVideoPath: string;

    // Tentar baixar do Supabase
    if (video.video_path) {
      console.log('⬇️  Baixando vídeo do Supabase Storage...\n');
      localVideoPath = await downloadVideoFromSupabase(video.video_path, tempDir);
    } else if (video.video_url) {
      console.log('⬇️  Baixando vídeo da URL...\n');
      localVideoPath = await downloadVideoFromUrl(video.video_url, tempDir);
    } else {
      throw new Error('Nenhuma URL ou path de vídeo encontrado');
    }

    console.log(`✅ Vídeo pronto para análise\n`);

    // 4. Executar análise de vídeo
    console.log('═'.repeat(60));
    console.log('🚀 INICIANDO ANÁLISE COM OLLAMA LLAMA3.2-VISION');
    console.log('═'.repeat(60) + '\n');

    const visionResult = await analyzeExerciseVideo({
      videoPath: localVideoPath,
      exerciseType: video.movement_pattern,
      focusAreas: ['técnica', 'postura', 'amplitude', 'compensações', 'alinhamento'],
      framesCount: 8,
    });

    console.log('\n═'.repeat(60));
    console.log('📊 RESULTADO DA ANÁLISE');
    console.log('═'.repeat(60) + '\n');

    console.log(`✅ Análise concluída com sucesso!\n`);
    console.log(`📈 Pontuação Geral: ${visionResult.overallScore.toFixed(1)}/10`);
    console.log(`📊 Quadros Analisados: ${visionResult.frames.length}`);
    console.log(`⏱️  Timestamp: ${new Date().toISOString()}\n`);

    if (visionResult.summary) {
      console.log('📝 RESUMO:');
      console.log(`   ${visionResult.summary}\n`);
    }

    if (visionResult.technicalIssues && visionResult.technicalIssues.length > 0) {
      console.log('🔍 PROBLEMAS TÉCNICOS IDENTIFICADOS:');
      visionResult.technicalIssues.slice(0, 7).forEach((issue: string, idx: number) => {
        console.log(`   ${idx + 1}. ${issue}`);
      });
      console.log('');
    }

    if (visionResult.recommendations && visionResult.recommendations.length > 0) {
      console.log('💡 RECOMENDAÇÕES DE MELHORIA:');
      visionResult.recommendations.slice(0, 7).forEach((rec: string, idx: number) => {
        console.log(`   ${idx + 1}. ${rec}`);
      });
      console.log('');
    }

    // 5. Análise por frame
    console.log('📊 ANÁLISE FRAME-BY-FRAME:');
    console.log('');
    visionResult.frames.forEach((frame, idx) => {
      const barLength = 30;
      const filledLength = Math.round((frame.score / 10) * barLength);
      const emptyLength = barLength - filledLength;
      const bar = '█'.repeat(filledLength) + '░'.repeat(emptyLength);

      console.log(`   Frame ${idx + 1}: [${bar}] ${frame.score.toFixed(1)}/10`);
      if (frame.analysis) {
        console.log(`             ${frame.analysis.substring(0, 80)}...`);
      }
    });

    console.log('');
    const avgScore = (visionResult.frames.reduce((sum, f) => sum + f.score, 0) / visionResult.frames.length).toFixed(1);
    console.log(`📈 Pontuação Média: ${avgScore}/10`);
    console.log(`   Variação: ${(Math.max(...visionResult.frames.map(f => f.score)) - Math.min(...visionResult.frames.map(f => f.score))).toFixed(1)} pontos\n`);

    // 6. Salvar resultado no banco
    console.log('💾 Salvando resultado na base de dados...\n');

    const aiAnalysis = {
      movement_pattern: video.movement_pattern,
      analysis_type: 'vision_model',
      timestamp: new Date().toISOString(),
      model: 'llama3.2-vision',
      overall_score: visionResult.overallScore,
      summary: visionResult.summary,
      key_observations: visionResult.technicalIssues.slice(0, 5),
      suggestions: visionResult.recommendations,
      requires_attention: visionResult.technicalIssues.filter(i =>
        i.toLowerCase().includes('grave') || i.toLowerCase().includes('severo')
      ),
      frames_analyzed: visionResult.frames.length,
      frame_scores: visionResult.frames.map(f => f.score),
      confidence_level: visionResult.overallScore >= 7 ? 'high' : 'medium',
      technical_details: {
        lowest_score_frame: Math.min(...visionResult.frames.map(f => f.score)),
        highest_score_frame: Math.max(...visionResult.frames.map(f => f.score)),
        total_issues: visionResult.technicalIssues.length,
      },
    };

    // Atualizar registro
    const { error: updateError } = await supabase
      .from(TABLE)
      .update({
        status: 'AI_ANALYZED',
        ai_analysis: aiAnalysis,
        updated_at: new Date().toISOString(),
      })
      .eq('id', video.id);

    if (updateError) {
      console.error('⚠️  Erro ao salvar resultado:', updateError.message);
    } else {
      console.log('✅ Resultado salvo com sucesso!\n');
    }

    console.log('═'.repeat(60));
    console.log('🎉 ANÁLISE CONCLUÍDA!');
    console.log('═'.repeat(60) + '\n');

  } catch (error: any) {
    console.error('\n❌ Erro durante a análise:', error.message);
    if (error.stack) {
      console.error('\nDetalhes:');
      console.error(error.stack);
    }
  } finally {
    // Limpar arquivos temporários
    if (tempDir && fs.existsSync(tempDir)) {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
        console.log(`\n🧹 Diretório temporário removido: ${tempDir}`);
      } catch (e) {
        console.warn(`⚠️  Não foi possível remover: ${tempDir}`);
      }
    }
  }
}

main();
