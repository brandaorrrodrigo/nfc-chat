require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
  console.log('🔍 Buscando todas as arenas...');

  const { data: arenas, error: arenasError } = await supabase
    .from('Arena')
    .select('id, slug, name, totalPosts')
    .order('name');

  if (arenasError) {
    console.error('❌ Erro ao buscar arenas:', arenasError);
    return;
  }

  console.log(`\n📊 Recalculando contagem de posts para ${arenas.length} arenas...\n`);

  for (const arena of arenas) {
    // Contar posts não deletados
    const { count, error: countError } = await supabase
      .from('Post')
      .select('id', { count: 'exact', head: true })
      .eq('arenaId', arena.id)
      .eq('isDeleted', false);

    if (countError) {
      console.error(`❌ Arena "${arena.name}": erro ao contar posts`, countError.message);
      continue;
    }

    // Atualizar totalPosts se diferente
    if (count !== arena.totalPosts) {
      const { error: updateError } = await supabase
        .from('Arena')
        .update({ totalPosts: count })
        .eq('id', arena.id);

      if (updateError) {
        console.error(`❌ Arena "${arena.name}": erro ao atualizar`, updateError.message);
      } else {
        console.log(`✅ "${arena.name}" — Posts: ${arena.totalPosts} → ${count}`);
      }
    } else {
      console.log(`✔️  "${arena.name}" — Posts: ${count} (sem mudanças)`);
    }
  }

  console.log('\n🎉 Sincronização completa!');
}

main().catch(console.error);
