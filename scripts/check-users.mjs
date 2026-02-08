import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qducbqhuwqdyqioqevle.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkdWNicWh1d3FkeXFpb3FldmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NDM3NjgsImV4cCI6MjA4NDUxOTc2OH0.hzOmMJcRGFPShGLRecDruzOr8_W3kwdtykI2NJpyOXE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('👥 Verificando usuários no banco...\n');
  
  const { data: users, error } = await supabase
    .from('User')
    .select('id, email, name')
    .limit(5);
  
  if (error) {
    console.error('Erro:', error.message);
    return;
  }
  
  console.log(`Total: ${users.length} usuários encontrados\n`);
  users.forEach(u => {
    console.log(`- ID: ${u.id}`);
    console.log(`  Email: ${u.email}`);
    console.log(`  Nome: ${u.name}\n`);
  });
}

main();
