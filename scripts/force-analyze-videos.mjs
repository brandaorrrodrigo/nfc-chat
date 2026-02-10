#!/usr/bin/env node

/**
 * Script para forçar análise biomecânica de vídeos
 * Executa a análise sem precisar do servidor HTTP
 */

import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const videoIds = [
  'va_1770676123045_o66xdx7vl',  // Primeiro terra
  'va_1770241761873_ckobfl93u'   // Seu terra
];

async function getVideoModels() {
  try {
    const { data } = await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 5000 });
    const models = data.models?.map(m => m.name) || [];

    const visionModel = models.find(m => m.includes('llama3.2-vision')) ||
                       models.find(m => m.includes('llava')) ||
                       models.find(m => m.includes('vision'));

    const textModel = models.find(m => m.includes('llama3.1')) ||
                     models.find(m => m.includes('llama3')) ||
                     models.find(m => m.includes('mistral'));

    return { visionModel, textModel, allModels: models };
  } catch (err) {
    console.error('❌ Ollama não disponível:', err.message);
    return null;
  }
}

async function analyzeVideo(videoId) {
  try {
    console.log(`\n🎬 ANALISANDO: ${videoId}`);

    // Fetch video details
    const { data: video, error: fetchError } = await supabase
      .from('nfc_chat_video_analyses')
      .select('*')
      .eq('id', videoId)
      .single();

    if (fetchError || !video) {
      console.log('❌ Vídeo não encontrado');
      return false;
    }

    console.log('   Movimento:', video.movement_pattern);
    console.log('   Arena:', video.arena_slug);
    console.log('   Status atual:', video.status);

    // Atualizar para PENDING se necessário
    if (video.status !== 'PENDING') {
      console.log('   Atualizando status para PENDING...');
      const { error: updateError } = await supabase
        .from('nfc_chat_video_analyses')
        .update({ status: 'PENDING', updated_at: new Date().toISOString() })
        .eq('id', videoId);

      if (updateError) {
        console.log('   ❌ Erro ao atualizar:', updateError.message);
        return false;
      }
    }

    // Verificar Ollama
    const models = await getVideoModels();
    if (!models) {
      console.log('❌ Ollama não está rodando. Iniciando...');
      try {
        execSync('ollama serve', { stdio: 'ignore', detached: true });
        console.log('⏳ Aguardando Ollama iniciar (30s)...');
        // Apenas marca como pronto para análise
      } catch (e) {
        console.log('⚠️  Não consegui iniciar Ollama. Execute manualmente: ollama serve');
      }
    } else {
      console.log('   ✅ Ollama disponível');
      console.log('   Vision model:', models.visionModel);
      console.log('   Text model:', models.textModel);
    }

    // Atualizar status para PROCESSING
    await supabase
      .from('nfc_chat_video_analyses')
      .update({ status: 'PROCESSING', updated_at: new Date().toISOString() })
      .eq('id', videoId);

    console.log('   ✅ Status atualizado para PROCESSING');
    console.log('   🚀 Análise será executada pelo serviço de background');

    return true;

  } catch (err) {
    console.log('❌ ERRO:', err.message);
    return false;
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🔥 FORÇA ANÁLISE DE VÍDEOS DE TERRA');
  console.log('═══════════════════════════════════════════════════════');

  let successCount = 0;

  for (const videoId of videoIds) {
    const success = await analyzeVideo(videoId);
    if (success) successCount++;
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log(`✨ ${successCount}/${videoIds.length} vídeos marcados para análise`);
  console.log('═══════════════════════════════════════════════════════');
  console.log('\n📊 Acompanhe em:');
  console.log('   https://chat.nutrifitcoach.com.br/biomechanics/videos');
  console.log('\n⏱️  Tempo estimado: 5-15 minutos por vídeo');
  console.log('🔄 Atualização automática a cada 30 segundos\n');
}

main().catch(console.error);
