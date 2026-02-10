#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

(async () => {
  console.log('\n📊 STATUS ATUAL DOS VÍDEOS DE TERRA:\n');

  const { data: videos } = await supabase
    .from('nfc_chat_video_analyses')
    .select('id, status, movement_pattern, ai_analysis, updated_at')
    .eq('movement_pattern', 'terra')
    .order('created_at', { ascending: false });

  if (!videos || videos.length === 0) {
    console.log('   Nenhum vídeo encontrado');
    return;
  }

  videos.forEach((v, i) => {
    const time = new Date(v.updated_at).toLocaleTimeString('pt-BR');
    let badge = '';
    let detail = '';

    if (v.status === 'BIOMECHANICS_ANALYZED_V2') {
      badge = '✅ ANALISADO';
      if (v.ai_analysis) {
        try {
          const analysis = JSON.parse(v.ai_analysis);
          detail = `Score: ${analysis.classification?.overall_score?.toFixed(1)}/10`;
        } catch (e) {
          detail = 'Dados inválidos';
        }
      } else {
        detail = 'Sem dados de análise';
      }
    } else if (v.status === 'PROCESSING') {
      badge = '⏳ PROCESSANDO';
      detail = 'Aguarde...';
    } else if (v.status === 'PENDING') {
      badge = '⌛ PENDENTE';
      detail = 'Aguardando processamento';
    } else {
      badge = '❓ ' + v.status;
      detail = '';
    }

    console.log(`  ${i + 1}. ${badge}`);
    console.log(`     ID: ${v.id.substring(0, 12)}...`);
    console.log(`     Status: ${v.status}`);
    console.log(`     ${detail}`);
    console.log(`     Atualizado: ${time}\n`);
  });
})();
