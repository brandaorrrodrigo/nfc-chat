require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function fixHubs() {
  console.log('═'.repeat(60));
  console.log('🔧 FIX: Configurar HUBs e arenas filhas');
  console.log('═'.repeat(60));

  const ALL_CHILDREN = [
    'avaliacao-assimetrias',
    'avaliacao-fisica-foto',
    'postura-estetica',
    'dor-funcao-saude',
    'analise-agachamento',
    'analise-elevacao-pelvica',
    'analise-terra',
    'analise-puxadas',
    'analise-supino',
  ];

  // Fix: arenas filhas devem ser GENERAL, não NFV_HUB
  console.log('\n🔧 Corrigindo arenaType das filhas para GENERAL...\n');

  for (const slug of ALL_CHILDREN) {
    const { data, error } = await supabase
      .from('Arena')
      .update({ arenaType: 'GENERAL' })
      .eq('slug', slug)
      .select('slug, name, arenaType');

    if (data && data.length > 0) {
      console.log(`  ✅ [${slug}] → arenaType = GENERAL`);
    }
  }

  // Verificação
  console.log('\n📊 Verificação...\n');

  const { data: hubs } = await supabase
    .from('Arena')
    .select('slug, name, arenaType')
    .eq('arenaType', 'NFV_HUB');

  console.log(`  Hubs (NFV_HUB): ${hubs?.length || 0}`);
  hubs?.forEach(h => console.log(`    - [${h.slug}] ${h.name}`));

  const { data: children } = await supabase
    .from('Arena')
    .select('slug, name, parentArenaSlug, arenaType')
    .not('parentArenaSlug', 'is', null);

  console.log(`\n  Arenas filhas: ${children?.length || 0}`);
  children?.forEach(c => console.log(`    - [${c.slug}] type=${c.arenaType} parent=${c.parentArenaSlug}`));

  console.log('\n✅ DONE!');
}

fixHubs().catch(e => console.error('❌ ERRO:', e));
