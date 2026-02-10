const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testando conexão com Supabase...');
console.log('URL:', url ? '✅ Configurada' : '❌ Não configurada');
console.log('Key:', key ? '✅ Configurada' : '❌ Não configurada');

if (!url || !key) {
  console.log('❌ Variáveis de ambiente não estão carregadas');
  process.exit(1);
}

const supabase = createClient(url, key);
supabase
  .from('Arena')
  .select('id')
  .limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.log('❌ Erro ao conectar:', error.message);
      process.exit(1);
    } else {
      console.log('✅ Supabase está ONLINE!');
      console.log('   Arenas na base:', data?.length || 0);
      process.exit(0);
    }
  })
  .catch(err => {
    console.log('❌ Erro:', err.message);
    process.exit(1);
  });
