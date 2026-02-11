require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ════════════════════════════════════════════════════════════
// LISTA COMPLETA DE ARENAS QUE DEVERIAM EXISTIR
// Compilada de todas as sessões anteriores
// ════════════════════════════════════════════════════════════

const ARENAS_ESPERADAS = [
  // ── Batch original (18 arenas com seeds .js prontos) ──
  { slug: 'receitas-saudaveis', nome: 'Receitas Saudáveis' },
  { slug: 'deficit-calorico', nome: 'Déficit Calórico Inteligente' },
  { slug: 'treino-gluteo', nome: 'Treino de Glúteo' },
  { slug: 'emagrecimento-35-mais', nome: 'Emagrecimento Feminino 35+' },
  { slug: 'ansiedade-alimentacao', nome: 'Ansiedade, Compulsão e Alimentação' },
  { slug: 'canetas-emagrecedoras', nome: 'Canetas Emagrecedoras' },
  { slug: 'lipedema-paradoxo', nome: 'Lipedema — Paradoxo do Cardio' },
  { slug: 'aspiracional-estetica', nome: 'Aspiracional & Estética' },
  { slug: 'antes-depois', nome: 'Antes e Depois — Processo Real' },
  { slug: 'exercicios-que-ama', nome: 'Exercícios que Você AMA' },
  { slug: 'treino-em-casa', nome: 'Treino em Casa' },
  { slug: 'barriga-pochete', nome: 'Barriga Pochete' },
  { slug: 'desvio-bacia', nome: 'Desvio de Bacia' },
  { slug: 'exercicio-quem-odeia', nome: 'Exercício pra Quem Odeia Treinar' },
  { slug: 'gluteo-medio-valgo', nome: 'Glúteo Médio / Valgo Dinâmico' },
  { slug: 'dor-funcao-saude-postural', nome: 'Dor, Função & Saúde Postural' },
  { slug: 'hipercifose-drenagem', nome: 'Hipercifose & Drenagem' },
  { slug: 'protocolo-lipedema', nome: 'Protocolo Lipedema' },

  // ── Batch 5 (4 arenas com seeds .js) ──
  { slug: 'dor-menstrual', nome: 'Dor Menstrual e Treino' },
  { slug: 'postura-estetica-real', nome: 'Postura & Estética Real' },
  { slug: 'musculacao-lipedema', nome: 'Musculação e Lipedema' },
  { slug: 'meia-compressao', nome: 'Meia de Compressão' },

  // ── Batch 5 continuação ──
  { slug: 'liberacao-miofascial', nome: 'Liberação Miofascial' },
  { slug: 'deficit-calorico-vida-real', nome: 'Déficit Calórico na Vida Real' },

  // ── Arenas da estrutura original (podem ter slugs ligeiramente diferentes) ──
  { slug: 'sinal-vermelho', nome: 'Sinal Vermelho: Dor, Ajuste ou Lesão?' },
  { slug: 'resistencia-insulinica', nome: 'Resistência Insulínica' },
  { slug: 'periodizacao-feminina', nome: 'Periodização Feminina' },
  { slug: 'avaliacao-biometrica', nome: 'Avaliação Biométrica & Assimetrias' },
];

async function diagnostico() {
  console.log('═'.repeat(70));
  console.log('🔍 DIAGNÓSTICO COMPLETO DE ARENAS — NFC');
  console.log('═'.repeat(70));
  console.log(`Data: ${new Date().toISOString()}\n`);

  // ────────────────────────────────────────────────────────
  // 1. LISTAR TODAS AS ARENAS NO BANCO
  // ────────────────────────────────────────────────────────

  console.log('📋 TODAS AS ARENAS NO BANCO:\n');

  // Tentar várias combinações de tabela/campos
  let arenas = [];
  let tableName = 'Arena';
  let postTable = 'Post';
  let threadTable = 'Thread';

  // Tentativa 1: PascalCase
  let { data, error } = await supabase.from('Arena').select('*').order('name');
  
  if (error) {
    // Tentativa 2: minúsculo plural
    ({ data, error } = await supabase.from('arenas').select('*').order('name'));
    if (!error) tableName = 'arenas';
  }

  if (error) {
    // Tentativa 3: minúsculo singular
    ({ data, error } = await supabase.from('arena').select('*').order('name'));
    if (!error) tableName = 'arena';
  }

  if (error) {
    console.error('❌ NÃO CONSEGUI ACESSAR TABELA DE ARENAS!');
    console.error('Tentei: Arena, arenas, arena');
    console.error('Erro:', error.message);
    console.log('\n💡 Rode este SQL no Supabase Dashboard para listar tabelas:');
    console.log("SELECT tablename FROM pg_tables WHERE schemaname = 'public';");
    return;
  }

  arenas = data || [];
  console.log(`Tabela encontrada: "${tableName}"`);
  console.log(`Total de arenas: ${arenas.length}\n`);

  // Identificar nomes de campos
  if (arenas.length > 0) {
    const sampleKeys = Object.keys(arenas[0]);
    console.log(`Campos disponíveis: ${sampleKeys.join(', ')}\n`);
  }

  // Listar todas
  arenas.forEach((a, i) => {
    const slug = a.slug || a.Slug || '?';
    const name = a.name || a.Name || a.title || '?';
    const posts = a.totalPosts || a.total_posts || a.TotalPosts || 0;
    const threads = a.totalThreads || a.total_threads || a.TotalThreads || 0;
    const members = a.totalMembers || a.total_members || a.TotalMembers || 0;
    const active = a.isActive || a.is_active || a.IsActive;
    const statusIcon = posts > 0 ? '✅' : '🔴';
    
    console.log(`  ${statusIcon} ${String(i+1).padStart(2)}. [${slug}]`);
    console.log(`      Nome: ${name}`);
    console.log(`      Posts: ${posts} | Threads: ${threads} | Membros: ${members} | Ativo: ${active}`);
  });

  // ────────────────────────────────────────────────────────
  // 2. VERIFICAR ARENAS ESPERADAS vs EXISTENTES
  // ────────────────────────────────────────────────────────

  console.log('\n\n📊 ARENAS ESPERADAS — STATUS:\n');

  const slugsExistentes = arenas.map(a => (a.slug || '').toLowerCase());
  const nomesExistentes = arenas.map(a => (a.name || a.Name || a.title || '').toLowerCase());

  let encontradas = 0;
  let ausentes = 0;
  let similares = 0;

  ARENAS_ESPERADAS.forEach(expected => {
    const exactMatch = slugsExistentes.includes(expected.slug.toLowerCase());
    
    if (exactMatch) {
      const arena = arenas.find(a => (a.slug || '').toLowerCase() === expected.slug.toLowerCase());
      const posts = arena?.totalPosts || arena?.total_posts || 0;
      console.log(`  ✅ [${expected.slug}] "${expected.nome}" — ${posts} posts`);
      encontradas++;
      return;
    }

    // Buscar por slug parcial
    const partialSlug = slugsExistentes.find(s => {
      const words = expected.slug.split('-').filter(w => w.length > 3);
      return words.some(word => s.includes(word));
    });

    // Buscar por nome parcial
    const partialName = nomesExistentes.find(n => {
      const words = expected.nome.toLowerCase().split(' ').filter(w => w.length > 3);
      return words.some(word => n.includes(word));
    });

    if (partialSlug || partialName) {
      const matchArena = arenas.find(a => {
        const s = (a.slug || '').toLowerCase();
        const n = (a.name || a.Name || '').toLowerCase();
        return s === partialSlug || n === partialName;
      });
      const posts = matchArena?.totalPosts || matchArena?.total_posts || 0;
      console.log(`  🟡 [${expected.slug}] → encontrada como [${matchArena?.slug}] "${matchArena?.name}" — ${posts} posts`);
      similares++;
    } else {
      console.log(`  ❌ [${expected.slug}] "${expected.nome}" — NÃO ENCONTRADA!`);
      ausentes++;
    }
  });

  // ────────────────────────────────────────────────────────
  // 3. IDENTIFICAR ARENAS CRIADAS POR ENGANO
  // ────────────────────────────────────────────────────────

  console.log('\n\n🔍 ARENAS POSSIVELMENTE CRIADAS POR ENGANO:\n');

  const expectedSlugs = new Set(ARENAS_ESPERADAS.map(e => e.slug.toLowerCase()));
  let engano = 0;

  arenas.forEach(a => {
    const slug = (a.slug || '').toLowerCase();
    const name = a.name || a.Name || '';
    const posts = a.totalPosts || a.total_posts || 0;
    
    // Verifica se bate exato com alguma esperada
    if (expectedSlugs.has(slug)) return;

    // Verifica se é variação de alguma esperada
    const isVariation = ARENAS_ESPERADAS.some(expected => {
      const words = expected.slug.split('-').filter(w => w.length > 3);
      return words.some(word => slug.includes(word));
    });

    if (isVariation) {
      console.log(`  🟡 VARIAÇÃO: [${a.slug}] "${name}" — ${posts} posts (pode ser versão alternativa)`);
    } else {
      console.log(`  ⚠️ NÃO ESPERADA: [${a.slug}] "${name}" — ${posts} posts — POSSÍVEL ENGANO`);
      engano++;
    }
  });

  if (engano === 0) {
    console.log('  Nenhuma arena claramente criada por engano.');
  }

  // ────────────────────────────────────────────────────────
  // 4. CONTAGEM REAL DE POSTS (verificar contadores)
  // ────────────────────────────────────────────────────────

  console.log('\n\n📊 VERIFICAÇÃO DE CONTADORES (posts reais vs declarados):\n');

  // Descobrir nome do campo FK
  let fkField = 'arenaId'; // tentar camelCase primeiro

  for (const arena of arenas.slice(0, 5)) {
    const posts = arena.totalPosts || arena.total_posts || 0;
    if (posts === 0) continue;

    // Tentar buscar posts diretamente pela arena
    let { count, error: postError } = await supabase
      .from(postTable)
      .select('*', { count: 'exact', head: true })
      .eq('arenaId', arena.id);

    if (postError) {
      // Tentar Post com arena_id
      ({ count, error: postError } = await supabase
        .from(postTable)
        .select('*', { count: 'exact', head: true })
        .eq('arena_id', arena.id));
      if (!postError) fkField = 'arena_id';
    }

    if (postError) {
      // Tentar posts (minúsculo)
      postTable = 'posts';
      ({ count, error: postError } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('arenaId', arena.id));
      if (!postError) break;

      ({ count, error: postError } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('arena_id', arena.id));
      if (!postError) { fkField = 'arena_id'; break; }
    }

    if (!postError) {
      const match = count === posts;
      console.log(`  ${match ? '✅' : '⚠️'} ${arena.name}: ${count} reais vs ${posts} declarados`);
      break; // Só preciso descobrir a estrutura
    }
  }

  console.log(`\n  📌 Tabela de posts: "${postTable}", campo FK: "${fkField}"`);

  // Agora verificar todas
  let desincronizadas = 0;
  for (const arena of arenas) {
    const declared = arena.totalPosts || arena.total_posts || 0;
    
    const { count, error } = await supabase
      .from(postTable)
      .select('*', { count: 'exact', head: true })
      .eq(fkField, arena.id);

    if (error) {
      console.log(`  ❓ ${arena.name}: ERRO ao contar — ${error.message}`);
      continue;
    }

    const real = count || 0;
    const match = real === declared;
    if (!match) {
      desincronizadas++;
      console.log(`  ⚠️ ${arena.name}: ${real} reais vs ${declared} declarados ${real === 0 ? '← VAZIA!' : ''}`);
    }
  }

  if (desincronizadas === 0) {
    console.log('  ✅ Todos os contadores estão sincronizados');
  }

  // ────────────────────────────────────────────────────────
  // 5. RESUMO FINAL
  // ────────────────────────────────────────────────────────

  console.log('\n\n' + '═'.repeat(70));
  console.log('📊 RESUMO DO DIAGNÓSTICO');
  console.log('═'.repeat(70));
  
  const comPosts = arenas.filter(a => (a.totalPosts || a.total_posts || 0) > 0).length;
  const vazias = arenas.filter(a => (a.totalPosts || a.total_posts || 0) === 0).length;
  
  console.log(`  Arenas no banco:           ${arenas.length}`);
  console.log(`  Arenas esperadas:          ${ARENAS_ESPERADAS.length}`);
  console.log(`  Encontradas (exatas):      ${encontradas}`);
  console.log(`  Encontradas (similares):   ${similares}`);
  console.log(`  AUSENTES:                  ${ausentes}`);
  console.log(`  Criadas por engano:        ${engano}`);
  console.log(`  Com posts:                 ${comPosts}`);
  console.log(`  VAZIAS:                    ${vazias}`);
  console.log(`  Contadores desincronizados: ${desincronizadas}`);
  console.log('═'.repeat(70));

  console.log('\n⚠️ COPIE TODO ESTE RELATÓRIO E ENVIE PARA O BRANDAO.');
  console.log('⚠️ NÃO FAÇA NENHUMA MODIFICAÇÃO SEM INSTRUÇÃO EXPLÍCITA.\n');
}

diagnostico().catch(e => {
  console.error('❌ ERRO FATAL:', e);
});