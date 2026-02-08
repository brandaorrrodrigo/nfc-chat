import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qducbqhuwqdyqioqevle.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkdWNicWh1d3FkeXFpb3FldmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NDM3NjgsImV4cCI6MjA4NDUxOTc2OH0.hzOmMJcRGFPShGLRecDruzOr8_W3kwdtykI2NJpyOXE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('🔍 Verificando schema da tabela User...\n');
  
  // Buscar um usuário e ver todos seus campos
  const { data: user } = await supabase
    .from('User')
    .select('*')
    .limit(1)
    .single();
  
  if (user) {
    console.log('Usuário de exemplo:');
    console.log(JSON.stringify(user, null, 2));
    console.log('\n📋 Colunas disponíveis:');
    Object.keys(user).forEach(key => {
      console.log(`   - ${key}: ${typeof user[key]}`);
    });
  }
}

main();
