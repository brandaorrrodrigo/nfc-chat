import * as path from 'path';
import * as dotenv from 'dotenv';

const envLocalPath = path.join(__dirname, '..', '.env.local');
if (require('fs').existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
}

import { getSupabase } from '../lib/supabase';

async function listVideos() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║          📹 LISTA DE VÍDEOS ANALISADOS                      ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const supabase = getSupabase();

  try {
    const { data, error } = await supabase
      .from('nfc_chat_video_analyses')
      .select('id, user_name, movement_pattern, created_at, status, ai_analysis')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.log(`❌ Erro ao buscar vídeos: ${error.message}`);
      return;
    }

    if (!data || data.length === 0) {
      console.log('Nenhum vídeo encontrado na database');
      return;
    }

    console.log(`Total de vídeos: ${data.length}\n`);
    console.log('═'.repeat(60));

    data.forEach((video: any, idx: number) => {
      console.log(`\n[${idx + 1}] ID: ${video.id}`);
      console.log(`    Usuário: ${video.user_name || 'N/A'}`);
      console.log(`    Exercício: ${video.movement_pattern || 'N/A'}`);
      console.log(`    Criado: ${new Date(video.created_at).toLocaleString('pt-BR')}`);
      console.log(`    Status: ${video.status || 'PENDING'}`);
      
      if (video.ai_analysis) {
        const analysis = typeof video.ai_analysis === 'string' 
          ? JSON.parse(video.ai_analysis) 
          : video.ai_analysis;
        console.log(`    Score: ${analysis.overall_score || analysis.score || 'N/A'}/10`);
      } else {
        console.log(`    Score: Não analisado`);
      }
    });

    console.log('\n' + '═'.repeat(60));
    console.log(`\n✅ ${data.length} vídeo(s) encontrado(s)\n`);

  } catch (error: any) {
    console.error('❌ Erro:', error.message);
  }
}

listVideos();
