import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qducbqhuwqdyqioqevle.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkdWNicWh1d3FkeXFpb3FldmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NDM3NjgsImV4cCI6MjA4NDUxOTc2OH0.hzOmMJcRGFPShGLRecDruzOr8_W3kwdtykI2NJpyOXE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('🔍 Verificando arena Protocolo Lipedema no Supabase...\n');

  try {
    // Buscar a arena
    const { data: arena, error: arenaError } = await supabase
      .from('Arena')
      .select('*')
      .eq('slug', 'protocolo-lipedema')
      .single();

    if (arenaError) {
      console.log('❌ Arena NÃO encontrada no banco de dados');
      console.log(`   Erro: ${arenaError.message}`);
      
      // Listar arenas existentes
      console.log('\n📋 Arenas existentes no banco:');
      const { data: allArenas } = await supabase
        .from('Arena')
        .select('id, slug, name')
        .limit(10);
      
      if (allArenas) {
        allArenas.forEach(a => {
          console.log(`   - ${a.slug}: ${a.name}`);
        });
      }
      return;
    }

    console.log('✅ Arena encontrada!');
    console.log(`\n📊 Detalhes da Arena:`);
    console.log(`   ID: ${arena.id}`);
    console.log(`   Nome: ${arena.name}`);
    console.log(`   Slug: ${arena.slug}`);
    console.log(`   Descrição: ${arena.description.substring(0, 100)}...`);
    console.log(`   Icon: ${arena.icon}`);
    console.log(`   Ativa: ${arena.isActive}`);

    // Buscar posts da arena
    const { data: posts, error: postsError } = await supabase
      .from('Post')
      .select('*')
      .eq('arenaId', arena.id);

    if (postsError) {
      console.log(`\n❌ Erro ao buscar posts: ${postsError.message}`);
      return;
    }

    console.log(`\n📝 Posts na Arena:`);
    console.log(`   Total: ${posts.length}`);
    
    if (posts.length > 0) {
      console.log('\n   Primeiros 5 posts:');
      posts.slice(0, 5).forEach((post, idx) => {
        console.log(`   ${idx + 1}. [${post.isAIResponse ? 'IA' : 'USER'}] ${post.content.substring(0, 55)}...`);
      });
    }

    // Estatísticas
    const aiPosts = posts.filter(p => p.isAIResponse);
    const userPosts = posts.filter(p => !p.isAIResponse);
    
    console.log(`\n📈 Distribuição:`);
    console.log(`   Posts de Usuários: ${userPosts.length}`);
    console.log(`   Posts de IA: ${aiPosts.length}`);
    console.log(`   Publicados: ${posts.filter(p => p.isPublished).length}`);
    console.log(`   Aprovados: ${posts.filter(p => p.isApproved).length}`);

  } catch (err) {
    console.error('❌ ERRO:', err.message);
    process.exit(1);
  }
}

main();
