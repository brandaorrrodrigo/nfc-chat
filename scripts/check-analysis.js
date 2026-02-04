/**
 * Script para verificar análise no banco
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl ? 'OK' : 'MISSING');
console.log('Supabase Key:', supabaseKey ? 'OK' : 'MISSING');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente faltando');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAnalysis() {
  const analysisId = process.argv[2] || 'va_1770241761873_ckobfl93u';

  console.log(`\n🔍 Buscando: ${analysisId}\n`);

  const { data, error } = await supabase
    .from('nfc_chat_video_analyses')
    .select('*')
    .eq('id', analysisId)
    .single();

  if (error) {
    console.error('❌ Erro:', error.message);
    return;
  }

  console.log('📋 Colunas existentes:');
  console.log(Object.keys(data).join(', '));

  console.log('\n📹 Dados do vídeo:');
  console.log('   ID:', data.id);
  console.log('   Arena:', data.arena_slug);
  console.log('   Status:', data.status);
  console.log('   Video URL:', data.video_url?.substring(0, 60) + '...');
  console.log('   AI Analysis:', data.ai_analysis ? 'Existe' : 'Null');
  console.log('   AI Analyzed At:', data.ai_analyzed_at || 'Null');
  console.log('   AI Confidence:', data.ai_confidence || 'Null');

  // Testar update simples
  console.log('\n🧪 Testando update...');

  const { error: updateError } = await supabase
    .from('nfc_chat_video_analyses')
    .update({
      status: 'PENDING_AI', // Manter mesmo status para teste
    })
    .eq('id', analysisId);

  if (updateError) {
    console.error('❌ Erro no update:', updateError.message);
    console.error('   Detalhes:', JSON.stringify(updateError, null, 2));
  } else {
    console.log('✅ Update funciona!');
  }
}

checkAnalysis().catch(console.error);
