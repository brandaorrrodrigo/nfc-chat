/**
 * Script para disparar análise de vídeo com Ollama
 * Uso: node scripts/trigger-analysis.js <analysisId>
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase não configurado. Verifique .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const analysisId = process.argv[2];

if (!analysisId) {
  console.error('❌ Uso: node scripts/trigger-analysis.js <analysisId>');
  process.exit(1);
}

async function triggerAnalysis() {
  console.log(`🎥 Buscando análise: ${analysisId}`);

  // Buscar análise
  const { data: analysis, error } = await supabase
    .from('nfc_chat_video_analyses')
    .select('*')
    .eq('id', analysisId)
    .single();

  if (error || !analysis) {
    console.error('❌ Análise não encontrada:', error?.message);
    process.exit(1);
  }

  console.log('📹 Vídeo encontrado:');
  console.log('   Arena:', analysis.arena_slug);
  console.log('   URL:', analysis.video_url);
  console.log('   Status:', analysis.status);

  if (analysis.status !== 'PENDING_AI') {
    console.log('⚠️ Análise já foi processada. Status atual:', analysis.status);
    process.exit(0);
  }

  // Chamar API de análise LOCAL (para usar Ollama)
  // Força localhost para análise com vision model
  const baseUrl = 'http://localhost:3000';

  console.log(`\n🤖 Disparando análise em: ${baseUrl}/api/nfv/analysis`);
  console.log('   (Isso pode demorar alguns minutos...)\n');

  try {
    const response = await fetch(`${baseUrl}/api/nfv/analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ analysisId }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Erro na análise:', result);
      process.exit(1);
    }

    console.log('✅ Análise concluída!');
    console.log('   Score:', result.aiResult?.overall_score?.toFixed(1) || 'N/A');
    console.log('   Tipo:', result.aiResult?.analysis_type);
    console.log('   Sumário:', result.aiResult?.summary?.substring(0, 100) + '...');

  } catch (err) {
    console.error('❌ Erro ao chamar API:', err.message);

    // Tentar análise direta
    console.log('\n🔄 Tentando análise direta via Ollama...');
    await analyzeDirectly(analysis);
  }
}

async function analyzeDirectly(analysis) {
  const axios = require('axios');
  const OLLAMA_URL = 'http://localhost:11434';

  // Verificar Ollama
  try {
    const { data } = await axios.get(`${OLLAMA_URL}/api/tags`);
    const models = data.models?.map(m => m.name) || [];

    const visionModel = models.find(m =>
      m.includes('vision') || m.includes('llava')
    );

    if (!visionModel) {
      console.error('❌ Nenhum modelo de visão encontrado no Ollama');
      console.log('   Modelos disponíveis:', models.join(', '));
      console.log('   Execute: ollama pull llama3.2-vision');
      process.exit(1);
    }

    console.log(`✅ Modelo de visão encontrado: ${visionModel}`);
    console.log('\n⚠️ Para análise completa, o servidor Next.js precisa estar rodando.');
    console.log('   Execute: npm run dev');
    console.log('   E depois rode este script novamente.');

  } catch (err) {
    console.error('❌ Ollama não está rodando:', err.message);
    console.log('   Execute: ollama serve');
  }
}

triggerAnalysis().catch(console.error);
