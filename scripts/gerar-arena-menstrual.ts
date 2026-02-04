/**
 * GERADOR DE DADOS - ARENA DOR MENSTRUAL
 */

import { gerarThreadsEmLote, gerarEstatisticas } from './thread-generator';
import { GHOST_USERS } from './ghost-users-database';
import * as fs from 'fs';

console.log('════════════════════════════════════════════════════════');
console.log('🏗️  GERADOR - ARENA DOR MENSTRUAL LIPEDEMA');
console.log('════════════════════════════════════════════════════════\n');

const threads = gerarThreadsEmLote('menstrual', 5, {
  incluirIA: true,
  dataInicio: new Date(),
});

const stats = gerarEstatisticas(threads);

console.log('📊 Estatísticas:');
console.log(`   Total threads: ${stats.totalThreads}`);
console.log(`   Total respostas: ${stats.totalRespostas}`);
console.log(`   Threads com IA: ${stats.threadsComIA}`);
console.log(`   Autores únicos: ${stats.autoresUnicos}\n`);

console.log('📝 Threads geradas:\n');
threads.forEach((t, i) => {
  console.log(`   ${i+1}. "${t.titulo}" (${t.tipo})`);
  console.log(`      Autor: ${t.autor.username}`);
  console.log(`      Respostas: ${t.respostas.length}`);

  const temIA = t.respostas.some(r => r.autor.id === 'ia_facilitadora');
  if (temIA) {
    const respostaIA = t.respostas.find(r => r.autor.id === 'ia_facilitadora');
    console.log(`      🤖 IA: "${respostaIA!.conteudo.substring(0, 60)}..."`);
  }
  console.log('');
});

// Gerar dados
const dados = {
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

threads.forEach((thread, index) => {
  const postId = `post_menstrual_${index + 1}`;

  dados.threads.push({
    id: postId,
    arena_slug: 'lipedema-dor-menstrual',
    user_id: thread.autor.id,
    title: thread.titulo,
    content: thread.conteudo,
    is_published: true,
    created_at: thread.timestamp.toISOString(),
  });

  thread.respostas.forEach((resposta, respostaIndex) => {
    dados.mensagens.push({
      id: `msg_menstrual_${index}_${respostaIndex}`,
      comunidade_slug: 'lipedema-dor-menstrual',
      post_id: postId,
      author_id: resposta.autor.id,
      author_name: resposta.autor.nome,
      content: resposta.conteudo,
      created_at: resposta.timestamp.toISOString(),
      is_ia: resposta.autor.id === 'ia_facilitadora',
    });
  });
});

fs.writeFileSync('arena-menstrual-dados.json', JSON.stringify(dados, null, 2));
console.log('✅ Dados salvos em: arena-menstrual-dados.json\n');

console.log('════════════════════════════════════════════════════════');
console.log('✅ CONCLUÍDO!');
console.log('════════════════════════════════════════════════════════\n');
