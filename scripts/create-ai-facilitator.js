require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
  console.log('🔍 Verificando se usuário ai_facilitator existe...');

  // Verificar se já existe
  const { data: existing } = await supabase
    .from('User')
    .select('id, email')
    .eq('id', 'ai_facilitator')
    .single();

  if (existing) {
    console.log('✅ Usuário já existe:', existing.email);
    return;
  }

  console.log('📝 Criando usuário ai_facilitator...');

  const { data, error } = await supabase
    .from('User')
    .insert({
      id: 'ai_facilitator',
      email: 'ai-facilitator@nutrifitcoach.com',
      name: 'IA Facilitadora',
      is_ghost_user: true,
      role: 'USER',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Erro ao criar usuário:', error.message);
    return;
  }

  console.log('✅ Usuário criado com sucesso:', data.email);
}

main().catch(console.error);
