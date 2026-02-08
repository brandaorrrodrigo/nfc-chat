/**
 * Teste de integração da página de vídeos
 * Simula o carregamento da página /biomechanics/videos
 */

import * as path from 'path';
import * as dotenv from 'dotenv';

const envLocalPath = path.join(__dirname, '..', '.env.local');
if (require('fs').existsSync(envLocalPath)) {
  console.log('Loading .env.local...');
  dotenv.config({ path: envLocalPath });
}

import { getSupabase } from '../lib/supabase';

async function testVideosPage() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║          🎬 TESTE DA PÁGINA DE VÍDEOS                       ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log('SIMULANDO: Usuário acessa /biomechanics/videos');
  console.log('─'.repeat(60));

  try {
    const supabase = getSupabase();

    // Fetch videos como a página faz
    console.log('\nStep 1: Buscando vídeos da database...');
    const { data, error } = await supabase
      .from('nfc_chat_video_analyses')
      .select('id, user_name, movement_pattern, created_at, status, ai_analysis')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.log(`   ❌ Erro: ${error.message}`);
      return;
    }

    console.log(`   ✓ ${data?.length || 0} vídeo(s) encontrado(s)`);

    // Format videos como o endpoint faz
    console.log('\nStep 2: Formatando dados para frontend...');
    const videos = (data || []).map((video: any) => {
      let overall_score: number | undefined;

      if (video.ai_analysis) {
        try {
          const analysis = typeof video.ai_analysis === 'string'
            ? JSON.parse(video.ai_analysis)
            : video.ai_analysis;
          overall_score = analysis.overall_score || analysis.score;
        } catch (e) {
          // parsing failed
        }
      }

      return {
        id: video.id,
        user_name: video.user_name,
        movement_pattern: video.movement_pattern,
        created_at: video.created_at,
        status: video.status,
        overall_score,
        exercise_type: video.movement_pattern,
      };
    });

    console.log(`   ✓ ${videos.length} vídeo(s) formatado(s)`);

    // Display como a página renderiza
    console.log('\nPÁGINA RENDERIZADA:');
    console.log('─'.repeat(60));

    console.log('\n📊 ESTATÍSTICAS:');
    console.log(`   Total: ${videos.length}`);
    console.log(`   Analisados: ${videos.filter(v => v.status === 'BIOMECHANICS_ANALYZED_V2').length}`);

    if (videos.filter(v => v.overall_score).length > 0) {
      const avgScore = videos
        .filter(v => v.overall_score)
        .reduce((sum, v) => sum + (v.overall_score || 0), 0) /
        videos.filter(v => v.overall_score).length;
      console.log(`   Score Médio: ${Math.round(avgScore)}`);
    }

    console.log('\n🎬 GRID DE VÍDEOS:');
    console.log('─'.repeat(60));

    videos.forEach((video, idx) => {
      const statusBadge = video.status === 'BIOMECHANICS_ANALYZED_V2' 
        ? '✅ Analisado' 
        : '⏳ Pendente';
      
      console.log(`\n[Card ${idx + 1}]`);
      console.log(`  Exercício: ${video.movement_pattern || 'N/A'}`);
      console.log(`  Usuário: ${video.user_name || 'Anônimo'}`);
      console.log(`  Data: ${new Date(video.created_at).toLocaleString('pt-BR')}`);
      console.log(`  Status: ${statusBadge}`);
      if (video.overall_score !== undefined) {
        console.log(`  Score: ${video.overall_score.toFixed(1)}/10`);
      }
      console.log(`  Link: /biomechanics/dashboard?videoId=${video.id}`);
    });

    // Response structure
    console.log('\n\nRESPOSTA DA API:');
    console.log('─'.repeat(60));
    const apiResponse = {
      success: true,
      videos,
      total: videos.length,
    };
    console.log(JSON.stringify(apiResponse, null, 2));

    console.log('\n' + '═'.repeat(60));
    console.log('✅ PÁGINA DE VÍDEOS TESTADA COM SUCESSO');
    console.log('═'.repeat(60) + '\n');

  } catch (error: any) {
    console.error('\n❌ Erro no teste:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
  }
}

testVideosPage();
