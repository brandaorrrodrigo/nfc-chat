/**
 * Script para refazer análise biomecânica do vídeo de agachamento
 * Busca o vídeo mais recente na arena e refaz a análise com Ollama
 */

import * as path from 'path';
import * as dotenv from 'dotenv';

const envLocalPath = path.join(__dirname, '..', '.env.local');
const envPath = path.join(__dirname, '..', '.env');

if (require('fs').existsSync(envLocalPath)) {
  console.log('Loading .env.local...');
  dotenv.config({ path: envLocalPath });
}

import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

const TABLE = 'nfc_chat_video_analyses';

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║   🎥 REFAZENDO ANÁLISE BIOMECÂNICA DO AGACHAMENTO     ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  try {
    if (!isSupabaseConfigured()) {
      console.error('❌ Supabase não configurado');
      return;
    }

    const supabase = getSupabase();

    // 1. Buscar vídeos de agachamento
    console.log('🔍 Buscando vídeos de agachamento recentes...\n');

    const { data: allVideos, error: fetchError } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    // Filtrar por movimento
    const videos = allVideos?.filter(v =>
      v.movement_pattern?.toLowerCase() === 'squat' ||
      v.movement_pattern?.toLowerCase() === 'agachamento'
    ) || [];

    if (fetchError) {
      console.error('❌ Erro ao buscar vídeos:', fetchError.message);
      return;
    }

    if (!videos || videos.length === 0) {
      console.error('❌ Nenhum vídeo de agachamento encontrado');
      return;
    }

    console.log(`📊 Encontrados ${videos.length} vídeo(s) de agachamento\n`);
    console.log('Vídeos encontrados:');
    videos.forEach((video, idx) => {
      console.log(`   [${idx + 1}] ID: ${video.id.substring(0, 12)}...`);
      console.log(`       Status: ${video.status}`);
      console.log(`       Usuário: ${video.user_name}`);
      console.log(`       Data: ${new Date(video.created_at).toLocaleString('pt-BR')}`);
      console.log('');
    });

    // 2. Refazer análise do vídeo mais recente
    const latestVideo = videos[0];
    console.log(`📹 Analisando vídeo: ${latestVideo.id}\n`);

    // Determinar base URL
    const baseUrl = process.env.NEXTAUTH_URL ||
                   process.env.NEXT_PUBLIC_APP_URL ||
                   'http://localhost:3000';

    console.log(`🚀 Disparando análise no servidor: ${baseUrl}`);
    console.log(`   Endpoint: POST /api/nfv/analysis`);
    console.log(`   analysisId: ${latestVideo.id}\n`);

    const response = await fetch(`${baseUrl}/api/nfv/analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ analysisId: latestVideo.id }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Erro na análise:', errorData);
      return;
    }

    const result = await response.json();

    console.log('════════════════════════════════════════════════════════════');
    console.log('📊 RESULTADO DA ANÁLISE');
    console.log('════════════════════════════════════════════════════════════\n');

    if (result.aiResult) {
      const analysis = result.aiResult;

      console.log(`✅ Análise concluída com sucesso!\n`);
      console.log(`📈 Pontuação Geral: ${analysis.overall_score?.toFixed(1) || 'N/A'}/10`);
      console.log(`🎯 Tipo de Análise: ${analysis.analysis_type || 'vision_model'}`);
      console.log(`⏱️  Timestamp: ${analysis.timestamp}`);
      console.log(`📊 Nível de Confiança: ${analysis.confidence_level || 'medium'}\n`);

      if (analysis.summary) {
        console.log('📝 RESUMO:');
        console.log(`   ${analysis.summary}\n`);
      }

      if (analysis.key_observations && analysis.key_observations.length > 0) {
        console.log('🔍 OBSERVAÇÕES PRINCIPAIS:');
        analysis.key_observations.slice(0, 5).forEach((obs: string, idx: number) => {
          console.log(`   ${idx + 1}. ${obs}`);
        });
        console.log('');
      }

      if (analysis.suggestions && analysis.suggestions.length > 0) {
        console.log('💡 SUGESTÕES DE MELHORIA:');
        analysis.suggestions.slice(0, 5).forEach((sug: string, idx: number) => {
          console.log(`   ${idx + 1}. ${sug}`);
        });
        console.log('');
      }

      if (analysis.requires_attention && analysis.requires_attention.length > 0) {
        console.log('⚠️  REQUER ATENÇÃO:');
        analysis.requires_attention.forEach((item: string, idx: number) => {
          console.log(`   ${idx + 1}. ${item}`);
        });
        console.log('');
      }

      if (analysis.technical_details) {
        console.log('🔧 DETALHES TÉCNICOS:');
        console.log(`   Quadros analisados: ${analysis.frames_analyzed || 'N/A'}`);
        console.log(`   Pontuação mais baixa: ${analysis.technical_details.lowest_score_frame || 'N/A'}/10`);
        console.log(`   Pontuação mais alta: ${analysis.technical_details.highest_score_frame || 'N/A'}/10`);
        console.log(`   Total de problemas identificados: ${analysis.technical_details.total_issues || 0}`);
        console.log('');
      }

      console.log('════════════════════════════════════════════════════════════');
      console.log('✨ Análise completa!\n');
    } else {
      console.log('⚠️  Resposta recebida mas sem análise detalhada:');
      console.log(JSON.stringify(result, null, 2));
    }

  } catch (error: any) {
    console.error('\n❌ Erro durante a análise:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
  }
}

main();
