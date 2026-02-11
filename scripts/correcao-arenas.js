require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function correcao() {
  console.log('═'.repeat(70));
  console.log('🔧 CORREÇÃO CIRÚRGICA DE ARENAS — NFC');
  console.log('═'.repeat(70));
  console.log(`Data: ${new Date().toISOString()}\n`);

  // ════════════════════════════════════════════════════════════
  // AÇÃO 1: DELETAR POSTS LIXO de arenas que devem ficar VAZIAS
  // (manter as arenas, apagar apenas os posts)
  // ════════════════════════════════════════════════════════════

  const ARENAS_LIMPAR_POSTS = [
    'analise-agachamento',
    'analise-elevacao-pelvica',
    'analise-terra',
    'analise-puxadas',
    'analise-supino',
    'hub-biomecanico',
    'hub-avaliacao-fisica',
    'avaliacao-assimetrias',
    'avaliacao-fisica-foto',
    'dor-funcao-saude',
    'postura-estetica',     // Vai ser re-seedada depois
  ];

  console.log('🗑️ AÇÃO 1: Apagando posts lixo de arenas...\n');

  for (const slug of ARENAS_LIMPAR_POSTS) {
    // Encontrar arena
    const { data: arenas } = await supabase
      .from('Arena')
      .select('id, slug, name, totalPosts')
      .eq('slug', slug);

    if (!arenas || arenas.length === 0) {
      console.log(`  ⚠️ [${slug}] — Não encontrada, pulando`);
      continue;
    }

    const arena = arenas[0];

    // Deletar posts desta arena
    const { data: deleted, error: delError } = await supabase
      .from('Post')
      .delete()
      .eq('arenaId', arena.id)
      .select('id');

    if (delError) {
      console.log(`  ❌ [${slug}] — Erro ao deletar posts: ${delError.message}`);
      continue;
    }

    const deletedCount = deleted?.length || 0;

    // Atualizar contador para 0
    await supabase
      .from('Arena')
      .update({ totalPosts: 0, totalComments: 0, dailyActiveUsers: 0 })
      .eq('id', arena.id);

    console.log(`  ✅ [${slug}] "${arena.name}" — ${deletedCount} posts deletados, contador zerado`);
  }

  // ════════════════════════════════════════════════════════════
  // AÇÃO 2: DELETAR arena hub-avaliacao-biometrica COMPLETAMENTE
  // (posts + arena)
  // ════════════════════════════════════════════════════════════

  console.log('\n🗑️ AÇÃO 2: Deletando arena hub-avaliacao-biometrica...\n');

  const { data: hubArenas } = await supabase
    .from('Arena')
    .select('id, slug, name')
    .eq('slug', 'hub-avaliacao-biometrica');

  if (hubArenas && hubArenas.length > 0) {
    const hubArena = hubArenas[0];

    // Deletar posts primeiro (FK)
    const { data: hubPosts } = await supabase
      .from('Post')
      .delete()
      .eq('arenaId', hubArena.id)
      .select('id');

    console.log(`  Posts deletados: ${hubPosts?.length || 0}`);

    // Deletar a arena
    const { error: arenaDelError } = await supabase
      .from('Arena')
      .delete()
      .eq('id', hubArena.id);

    if (arenaDelError) {
      console.log(`  ❌ Erro ao deletar arena: ${arenaDelError.message}`);
    } else {
      console.log(`  ✅ Arena [hub-avaliacao-biometrica] "${hubArena.name}" DELETADA completamente`);
    }
  } else {
    console.log('  ⚠️ Arena hub-avaliacao-biometrica não encontrada');
  }

  // ════════════════════════════════════════════════════════════
  // AÇÃO 3: SINCRONIZAR contadores de TODAS as arenas restantes
  // ════════════════════════════════════════════════════════════

  console.log('\n📊 AÇÃO 3: Sincronizando contadores de todas as arenas...\n');

  const { data: allArenas } = await supabase
    .from('Arena')
    .select('id, slug, name, totalPosts')
    .order('name');

  if (!allArenas) {
    console.log('  ❌ Erro ao buscar arenas');
    return;
  }

  let sincronizadas = 0;
  let corrigidas = 0;

  for (const arena of allArenas) {
    // Contar posts reais
    const { count, error } = await supabase
      .from('Post')
      .select('*', { count: 'exact', head: true })
      .eq('arenaId', arena.id);

    if (error) {
      console.log(`  ❌ [${arena.slug}] — Erro ao contar: ${error.message}`);
      continue;
    }

    const real = count || 0;
    const declared = arena.totalPosts || 0;

    if (real !== declared) {
      await supabase
        .from('Arena')
        .update({ totalPosts: real })
        .eq('id', arena.id);

      console.log(`  🔧 [${arena.slug}] "${arena.name}" — corrigido: ${declared} → ${real}`);
      corrigidas++;
    } else {
      sincronizadas++;
    }
  }

  console.log(`\n  ✅ ${sincronizadas} arenas já estavam corretas`);
  console.log(`  🔧 ${corrigidas} arenas tiveram contador corrigido`);

  // ════════════════════════════════════════════════════════════
  // RELATÓRIO FINAL
  // ════════════════════════════════════════════════════════════

  console.log('\n\n' + '═'.repeat(70));
  console.log('📊 RELATÓRIO FINAL PÓS-CORREÇÃO');
  console.log('═'.repeat(70));

  const { data: finalArenas } = await supabase
    .from('Arena')
    .select('id, slug, name, totalPosts')
    .order('name');

  console.log(`\nTotal de arenas: ${finalArenas?.length || 0}\n`);

  finalArenas?.forEach((a, i) => {
    const posts = a.totalPosts || 0;
    const icon = posts > 20 ? '✅' : posts > 0 ? '🟡' : '⬜';
    console.log(`  ${icon} ${String(i+1).padStart(2)}. [${a.slug}] ${a.name} — ${posts} posts`);
  });

  const totalPosts = finalArenas?.reduce((sum, a) => sum + (a.totalPosts || 0), 0) || 0;
  const arenasComPosts = finalArenas?.filter(a => (a.totalPosts || 0) > 0).length || 0;
  const arenasVazias = finalArenas?.filter(a => (a.totalPosts || 0) === 0).length || 0;

  console.log('\n' + '─'.repeat(40));
  console.log(`  Total arenas: ${finalArenas?.length}`);
  console.log(`  Com posts: ${arenasComPosts}`);
  console.log(`  Vazias (prontas pra seed): ${arenasVazias}`);
  console.log(`  Total posts: ${totalPosts}`);
  console.log('═'.repeat(70));

  console.log('\n✅ CORREÇÃO CONCLUÍDA!');
  console.log('📌 Próximo passo: re-seedar arenas que ficaram vazias.');
  console.log('⚠️ COPIE ESTE RELATÓRIO E ENVIE PARA O BRANDAO.\n');
}

correcao().catch(e => {
  console.error('❌ ERRO FATAL:', e);
});
