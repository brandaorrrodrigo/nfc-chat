/**
 * Script para listar todos os vídeos NFV disponíveis
 */

import * as path from 'path';
import * as dotenv from 'dotenv';

const envLocalPath = path.join(__dirname, '..', '.env.local');

if (require('fs').existsSync(envLocalPath)) {
  console.log('Loading .env.local...');
  dotenv.config({ path: envLocalPath });
}

import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║        📺 LISTANDO TODOS OS VÍDEOS NFV              ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  try {
    if (!isSupabaseConfigured()) {
      console.error('❌ Supabase não configurado');
      return;
    }

    const supabase = getSupabase();

    // Buscar todos os vídeos
    const { data: videos, error: fetchError } = await supabase
      .from('nfc_chat_video_analyses')
      .select('id, user_name, movement_pattern, status, created_at, video_url, video_path')
      .order('created_at', { ascending: false })
      .limit(20);

    if (fetchError) {
      console.error('❌ Erro ao buscar vídeos:', fetchError.message);
      return;
    }

    if (!videos || videos.length === 0) {
      console.log('❌ Nenhum vídeo encontrado\n');
      return;
    }

    console.log(`📊 Total de vídeos encontrados: ${videos.length}\n`);
    console.log('━'.repeat(100));

    videos.forEach((video, idx) => {
      console.log(`\n[${idx + 1}] ${video.user_name || 'Anônimo'}`);
      console.log(`    ID: ${video.id}`);
      console.log(`    Movimento: ${video.movement_pattern || 'N/A'}`);
      console.log(`    Status: ${video.status}`);
      console.log(`    Data: ${new Date(video.created_at).toLocaleString('pt-BR')}`);
      if (video.video_url) {
        console.log(`    URL: ${video.video_url.substring(0, 60)}...`);
      }
    });

    console.log('\n' + '━'.repeat(100));
    console.log('\n✅ Listagem completa!\n');

  } catch (error: any) {
    console.error('❌ Erro:', error.message);
  }
}

main();
