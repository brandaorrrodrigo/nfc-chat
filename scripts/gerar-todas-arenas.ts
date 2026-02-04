/**
 * GERADOR DE DADOS - TODAS AS 8 ARENAS
 *
 * Execução: npx tsx scripts/gerar-todas-arenas.ts
 */

import { gerarThreadsEmLote, gerarEstatisticas } from './thread-generator';
import { GHOST_USERS } from './ghost-users-database';
import * as fs from 'fs';

console.log('════════════════════════════════════════════════════════');
console.log('🏗️  GERADOR - TODAS AS 8 ARENAS');
console.log('════════════════════════════════════════════════════════\n');

type CategoriaArena = 'postura' | 'lipedema' | 'hipercifose' | 'compressao' | 'menstrual' | 'gluteo_medio' | 'miofascial' | 'desvio_bacia';

const ARENAS: Array<{ nome: string; categoria: CategoriaArena; slug: string }> = [
  { nome: 'Barriga Pochete', categoria: 'postura', slug: 'barriga-pochete-postura' },
  { nome: 'Musculação Lipedema', categoria: 'lipedema', slug: 'musculacao-lipedema' },
  { nome: 'Hipercifose Drenagem', categoria: 'hipercifose', slug: 'hipercifose-drenagem' },
  { nome: 'Meia Compressão', categoria: 'compressao', slug: 'meia-compressao-treino' },
  { nome: 'Dor Menstrual', categoria: 'menstrual', slug: 'lipedema-dor-menstrual' },
  { nome: 'Glúteo Médio/Valgo', categoria: 'gluteo_medio', slug: 'gluteo-medio-valgo' },
  { nome: 'Liberação Miofascial', categoria: 'miofascial', slug: 'liberacao-miofascial-lipedema' },
  { nome: 'Desvio de Bacia', categoria: 'desvio_bacia', slug: 'desvio-bacia-gordura' },
];

const QUANTIDADE_THREADS = 5; // 5 threads por arena

let totalThreads = 0;
let totalRespostas = 0;
let totalIA = 0;

ARENAS.forEach((arena, index) => {
  console.log(`\n[${ index + 1 }/8] 🏟️  ${arena.nome}`);
  console.log('─'.repeat(60));

  // Gerar threads
  const threads = gerarThreadsEmLote(arena.categoria, QUANTIDADE_THREADS, {
    incluirIA: true,
    dataInicio: new Date(),
  });

  const stats = gerarEstatisticas(threads);

  console.log(`   Threads: ${stats.totalThreads}`);
  console.log(`   Respostas: ${stats.totalRespostas}`);
  console.log(`   Com IA: ${stats.threadsComIA}`);
  console.log(`   Autores: ${stats.autoresUnicos}`);

  totalThreads += stats.totalThreads;
  totalRespostas += stats.totalRespostas;
  totalIA += stats.threadsComIA;

  // Gerar dados formatados
  const dados = {
    arena: {
      nome: arena.nome,
      slug: arena.slug,
      categoria: arena.categoria,
    },
    ghostUsers: [] as any[],
    threads: [] as any[],
    mensagens: [] as any[],
  };

  const ghostUsersIds = new Set<string>();
  threads.forEach(thread => {
    ghostUsersIds.add(thread.autor.id);
    thread.respostas.forEach(r => ghostUsersIds.add(r.autor.id));
  });

  dados.ghostUsers = Array.from(ghostUsersIds)
    .map(id => GHOST_USERS.find(u => u.id === id))
    .filter(u => u && u.id !== 'ia_facilitadora')
    .map(u => ({
      id: u!.id,
      email: u!.email,
      name: u!.nome,
      username: u!.username,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u!.username}`,
      bio: u!.bio,
      is_ghost_user: true,
    }));

  threads.forEach((thread, threadIndex) => {
    const postId = `post_${arena.categoria}_${threadIndex + 1}`;

    dados.threads.push({
      id: postId,
      arena_slug: arena.slug,
      user_id: thread.autor.id,
      title: thread.titulo,
      content: thread.conteudo,
      is_published: true,
      created_at: thread.timestamp.toISOString(),
    });

    thread.respostas.forEach((resposta, respostaIndex) => {
      dados.mensagens.push({
        id: `msg_${arena.categoria}_${threadIndex}_${respostaIndex}`,
        comunidade_slug: arena.slug,
        post_id: postId,
        author_id: resposta.autor.id,
        author_name: resposta.autor.nome,
        content: resposta.conteudo,
        created_at: resposta.timestamp.toISOString(),
        is_ia: resposta.autor.id === 'ia_facilitadora',
      });
    });
  });

  // Salvar arquivo
  const filename = `arena-${arena.categoria}-dados.json`;
  fs.writeFileSync(filename, JSON.stringify(dados, null, 2));
  console.log(`   ✅ Salvo: ${filename}`);
});

console.log('\n\n════════════════════════════════════════════════════════');
console.log('📊 ESTATÍSTICAS TOTAIS');
console.log('════════════════════════════════════════════════════════\n');

console.log(`Total de arenas: 8`);
console.log(`Total de threads: ${totalThreads}`);
console.log(`Total de respostas: ${totalRespostas}`);
console.log(`Threads com IA: ${totalIA} (${((totalIA / totalThreads) * 100).toFixed(1)}%)`);
console.log(`Média respostas/thread: ${(totalRespostas / totalThreads).toFixed(1)}`);

console.log('\n📁 Arquivos gerados:');
ARENAS.forEach(arena => {
  console.log(`   - arena-${arena.categoria}-dados.json`);
});

console.log('\n════════════════════════════════════════════════════════');
console.log('✅ GERAÇÃO CONCLUÍDA!');
console.log('════════════════════════════════════════════════════════\n');

console.log('💡 Próximos passos:');
console.log('   1. Revisar os arquivos JSON gerados');
console.log('   2. Importar para o banco Supabase');
console.log('   3. Ou usar: npx tsx scripts/populate-communities.ts\n');
