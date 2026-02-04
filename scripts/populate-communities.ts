/**
 * SCRIPT DE POVOAMENTO AUTOMÁTICO DE COMUNIDADES
 *
 * Execução: npx tsx scripts/populate-communities.ts
 *
 * IMPORTANTE:
 * - Cria ghost users no banco
 * - Gera threads e respostas orgânicas
 * - Respeita horários de pico
 * - Integra com sistema de FP
 * - Controle anti-spam
 *
 * USO:
 * - Manual: npx tsx scripts/populate-communities.ts
 * - CRON: Configurar em vercel.json ou servidor
 */

import { createClient } from '@supabase/supabase-js';
import {
  GHOST_USERS,
  selecionarGhostUserAleatorio,
  type GhostUser,
} from './ghost-users-database';
import {
  gerarThread,
  gerarThreadsEmLote,
  gerarEstatisticas,
  type ThreadGerada,
} from './thread-generator';
import type { CategoriaArena } from './thread-templates';

// ============================================
// CONFIGURAÇÃO
// ============================================

const CONFIG = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  DRY_RUN: process.env.DRY_RUN === 'true', // Se true, não salva no banco
  THREADS_POR_ARENA_DIA: 1, // Quantidade de threads por arena/dia
  INCLUIR_IA: true, // Se IA deve responder (40% das threads)
};

// ============================================
// CLIENTE SUPABASE
// ============================================

const supabase = createClient(
  CONFIG.SUPABASE_URL,
  CONFIG.SUPABASE_ANON_KEY
);

// ============================================
// MAPEAMENTO DE ARENAS
// ============================================

// Mapear slugs das arenas para categorias
const ARENAS_DISPONIVEIS: Array<{ slug: string; categoria: CategoriaArena }> = [
  { slug: 'emagrecimento-saudavel', categoria: 'emagrecimento' },
  { slug: 'ganho-massa-muscular', categoria: 'hipertrofia' },
  { slug: 'nutricao-fitness', categoria: 'nutricao' },
  { slug: 'treino-iniciantes', categoria: 'treino' },
  { slug: 'saude-bem-estar', categoria: 'saude' },
  { slug: 'motivacao-disciplina', categoria: 'motivacao' },
  { slug: 'barriga-pochete-postura', categoria: 'postura' },
  { slug: 'musculacao-lipedema', categoria: 'lipedema' },
  { slug: 'hipercifose-drenagem', categoria: 'hipercifose' },
  { slug: 'meia-compressao-treino', categoria: 'compressao' },
  { slug: 'lipedema-dor-menstrual', categoria: 'menstrual' },
  { slug: 'gluteo-medio-valgo', categoria: 'gluteo_medio' },
  { slug: 'liberacao-miofascial-lipedema', categoria: 'miofascial' },
  { slug: 'desvio-bacia-gordura', categoria: 'desvio_bacia' },
];

// ============================================
// CRIAR GHOST USERS NO BANCO
// ============================================

async function criarGhostUsersNoBanco(): Promise<void> {
  console.log('\n[1/4] 👤 Criando Ghost Users no banco...\n');

  if (CONFIG.DRY_RUN) {
    console.log('⚠️  DRY RUN: Ghost users não serão criados no banco');
    return;
  }

  for (const ghostUser of GHOST_USERS) {
    try {
      // Verificar se já existe
      const { data: userExistente } = await supabase
        .from('users')
        .select('id')
        .eq('email', ghostUser.email)
        .single();

      if (userExistente) {
        console.log(`   ⏭️  ${ghostUser.username} já existe`);
        continue;
      }

      // Criar usuário
      const { error } = await supabase.from('users').insert({
        id: ghostUser.id,
        email: ghostUser.email,
        name: ghostUser.nome,
        username: ghostUser.username,
        avatar_url: ghostUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${ghostUser.username}`,
        bio: ghostUser.bio,
        is_ghost_user: true, // Flag para identificar ghost users
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error(`   ❌ Erro ao criar ${ghostUser.username}:`, error.message);
      } else {
        console.log(`   ✅ ${ghostUser.username} criado`);
      }
    } catch (err) {
      console.error(`   ❌ Erro inesperado ao criar ${ghostUser.username}:`, err);
    }
  }

  console.log('\n✅ Ghost users criados!\n');
}

// ============================================
// POVOAR ARENA
// ============================================

async function povoarArena(
  arenaSlug: string,
  categoria: CategoriaArena,
  quantidadeThreads: number = 1
): Promise<void> {
  console.log(`\n[2/4] 🏟️  Povoando arena: ${arenaSlug}\n`);

  // Buscar arena no banco
  const { data: arena, error: arenaError } = await supabase
    .from('arenas')
    .select('id, slug, name')
    .eq('slug', arenaSlug)
    .single();

  if (arenaError || !arena) {
    console.error(`   ❌ Arena ${arenaSlug} não encontrada:`, arenaError?.message);
    return;
  }

  console.log(`   Arena: ${arena.name} (${arena.id})`);

  // Gerar threads
  console.log(`   Gerando ${quantidadeThreads} thread(s)...\n`);

  const threads = gerarThreadsEmLote(categoria, quantidadeThreads, {
    incluirIA: CONFIG.INCLUIR_IA,
    dataInicio: new Date(),
    intervaloHoras: 24,
  });

  // Salvar threads no banco
  for (const thread of threads) {
    await salvarThreadNoBanco(arena.id, thread);
  }

  // Estatísticas
  const stats = gerarEstatisticas(threads);
  console.log('\n   📊 Estatísticas:');
  console.log(`      Total threads: ${stats.totalThreads}`);
  console.log(`      Total respostas: ${stats.totalRespostas}`);
  console.log(`      Média respostas/thread: ${stats.mediaRespostasPorThread}`);
  console.log(`      Threads com IA: ${stats.threadsComIA} (${stats.percentualIA})`);
  console.log(`      Autores únicos: ${stats.autoresUnicos}`);
}

// ============================================
// SALVAR THREAD NO BANCO
// ============================================

async function salvarThreadNoBanco(
  arenaId: string,
  thread: ThreadGerada
): Promise<void> {
  if (CONFIG.DRY_RUN) {
    console.log('   ⚠️  DRY RUN: Thread não será salva');
    console.log(`      Título: ${thread.titulo}`);
    console.log(`      Autor: ${thread.autor.username}`);
    console.log(`      Respostas: ${thread.respostas.length}`);
    return;
  }

  try {
    // 1. Criar post (thread)
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert({
        arena_id: arenaId,
        user_id: thread.autor.id,
        title: thread.titulo,
        content: thread.conteudo,
        is_published: true,
        created_at: thread.timestamp.toISOString(),
        updated_at: thread.timestamp.toISOString(),
      })
      .select()
      .single();

    if (postError || !post) {
      console.error(`   ❌ Erro ao criar post:`, postError?.message);
      return;
    }

    console.log(`   ✅ Thread criada: "${thread.titulo.substring(0, 40)}..."`);
    console.log(`      Autor: ${thread.autor.username}`);

    // 2. Criar mensagens (respostas)
    for (const resposta of thread.respostas) {
      const { error: mensagemError } = await supabase
        .from('nfc_chat_messages')
        .insert({
          comunidade_slug: arenaId, // Usar arena_id como comunidade_slug
          author_id: resposta.autor.id,
          author_name: resposta.autor.nome,
          content: resposta.conteudo,
          created_at: resposta.timestamp.toISOString(),
          is_ia: resposta.autor.id === 'ia_facilitadora',
        });

      if (mensagemError) {
        console.error(`      ❌ Erro ao criar resposta:`, mensagemError.message);
      } else {
        const emoji = resposta.autor.id === 'ia_facilitadora' ? '🤖' : '👤';
        console.log(`      ${emoji} ${resposta.autor.username}: "${resposta.conteudo.substring(0, 40)}..."`);
      }
    }

    // 3. Conceder FP para todos os participantes
    await concederFPParticipantes(thread);

    console.log(`   ✅ ${thread.respostas.length} respostas criadas\n`);
  } catch (err) {
    console.error(`   ❌ Erro inesperado ao salvar thread:`, err);
  }
}

// ============================================
// CONCEDER FP (FITNESS POINTS)
// ============================================

async function concederFPParticipantes(thread: ThreadGerada): Promise<void> {
  if (CONFIG.DRY_RUN) return;

  const participantes = new Set<string>();
  participantes.add(thread.autor.id);
  thread.respostas.forEach(r => participantes.add(r.autor.id));

  for (const userId of participantes) {
    // Ignorar IA
    if (userId === 'ia_facilitadora') continue;

    try {
      // Criar post = +15 FP (para autor da thread)
      if (userId === thread.autor.id) {
        await supabase.rpc('add_fitness_points', {
          p_user_id: userId,
          p_points: 15,
          p_reason: 'create_thread',
        });
      }

      // Mensagem = +2 FP (para cada resposta)
      const quantidadeRespostas = thread.respostas.filter(r => r.autor.id === userId).length;
      if (quantidadeRespostas > 0) {
        await supabase.rpc('add_fitness_points', {
          p_user_id: userId,
          p_points: 2 * quantidadeRespostas,
          p_reason: 'send_message',
        });
      }
    } catch (err) {
      console.warn(`      ⚠️  Erro ao conceder FP para ${userId}`);
    }
  }
}

// ============================================
// POVOAR TODAS AS ARENAS
// ============================================

async function povoarTodasAsArenas(): Promise<void> {
  console.log('\n════════════════════════════════════════════════════════');
  console.log('🏗️  POVOAMENTO AUTOMÁTICO DE COMUNIDADES');
  console.log('════════════════════════════════════════════════════════\n');

  console.log('⚙️  Configurações:');
  console.log(`   - Threads por arena/dia: ${CONFIG.THREADS_POR_ARENA_DIA}`);
  console.log(`   - IA incluída: ${CONFIG.INCLUIR_IA ? 'Sim' : 'Não'}`);
  console.log(`   - Dry run: ${CONFIG.DRY_RUN ? 'Sim (não salvará no banco)' : 'Não'}`);
  console.log(`   - Ghost users disponíveis: ${GHOST_USERS.length}`);

  // 1. Criar ghost users
  await criarGhostUsersNoBanco();

  // 2. Povoar cada arena
  for (const arena of ARENAS_DISPONIVEIS) {
    await povoarArena(arena.slug, arena.categoria, CONFIG.THREADS_POR_ARENA_DIA);
    await sleep(2000); // Pausa de 2s entre arenas
  }

  console.log('\n════════════════════════════════════════════════════════');
  console.log('✅ POVOAMENTO CONCLUÍDO!');
  console.log('════════════════════════════════════════════════════════\n');
}

// ============================================
// POVOAR ARENA ESPECÍFICA (para testes)
// ============================================

async function povoarArenaEspecifica(slug: string, quantidade: number = 1): Promise<void> {
  const arena = ARENAS_DISPONIVEIS.find(a => a.slug === slug);

  if (!arena) {
    console.error(`❌ Arena "${slug}" não encontrada`);
    console.log('   Arenas disponíveis:', ARENAS_DISPONIVEIS.map(a => a.slug).join(', '));
    return;
  }

  console.log('\n════════════════════════════════════════════════════════');
  console.log(`🏗️  POVOAMENTO: ${slug}`);
  console.log('════════════════════════════════════════════════════════\n');

  await criarGhostUsersNoBanco();
  await povoarArena(arena.slug, arena.categoria, quantidade);

  console.log('\n════════════════════════════════════════════════════════');
  console.log('✅ CONCLUÍDO!');
  console.log('════════════════════════════════════════════════════════\n');
}

// ============================================
// HELPERS
// ============================================

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// CLI
// ============================================

async function main() {
  const args = process.argv.slice(2);

  // Uso: npx tsx scripts/populate-communities.ts [arena-slug] [quantidade]
  // Exemplo: npx tsx scripts/populate-communities.ts emagrecimento-saudavel 3

  if (args.length === 0) {
    // Sem argumentos: povoar todas
    await povoarTodasAsArenas();
  } else if (args.length === 1) {
    // 1 argumento: povoar arena específica (1 thread)
    await povoarArenaEspecifica(args[0], 1);
  } else if (args.length === 2) {
    // 2 argumentos: povoar arena específica (N threads)
    const quantidade = parseInt(args[1], 10);
    await povoarArenaEspecifica(args[0], quantidade);
  } else {
    console.error('❌ Uso incorreto');
    console.log('\nUso:');
    console.log('  npx tsx scripts/populate-communities.ts                    # Povoar todas');
    console.log('  npx tsx scripts/populate-communities.ts <arena-slug>       # Povoar arena (1 thread)');
    console.log('  npx tsx scripts/populate-communities.ts <arena-slug> <N>   # Povoar arena (N threads)');
    console.log('\nExemplos:');
    console.log('  npx tsx scripts/populate-communities.ts');
    console.log('  npx tsx scripts/populate-communities.ts emagrecimento-saudavel');
    console.log('  npx tsx scripts/populate-communities.ts ganho-massa-muscular 5');
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(console.error);
}

// ============================================
// EXPORTS (para uso em CRON)
// ============================================

export {
  povoarTodasAsArenas,
  povoarArenaEspecifica,
  criarGhostUsersNoBanco,
  povoarArena,
};

export default {
  povoarTodasAsArenas,
  povoarArenaEspecifica,
};
