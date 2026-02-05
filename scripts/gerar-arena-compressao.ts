/**
 * GERADOR DE DADOS - ARENA MEIA DE COMPRESSÃO
 */

import { gerarThreadsEmLote, gerarEstatisticas } from './thread-generator';
import { GHOST_USERS } from './ghost-users-database';
import { gerarAvatarVariado } from './avatar-generator';
import * as fs from 'fs';

console.log('════════════════════════════════════════════════════════');
console.log('🏗️  GERADOR - ARENA MEIA DE COMPRESSÃO');
console.log('════════════════════════════════════════════════════════\n');

const threads = gerarThreadsEmLote('compressao', 5, {
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
  .map((u, index) => ({
    id: u!.id,
    email: u!.email,
    name: u!.nome,
    username: u!.username,
    avatar_url: gerarAvatarVariado(u!.username, index, u!.genero),
    bio: u!.bio,
    is_ghost_user: true,
  }));

threads.forEach((thread, index) => {
  const postId = `post_compressao_${index + 1}`;

  dados.threads.push({
    id: postId,
    arena_slug: 'meia-compressao-treino',
    user_id: thread.autor.id,
    title: thread.titulo,
    content: thread.conteudo,
    is_published: true,
    created_at: thread.timestamp.toISOString(),
  });

  thread.respostas.forEach((resposta, respostaIndex) => {
    dados.mensagens.push({
      id: `msg_compressao_${index}_${respostaIndex}`,
      comunidade_slug: 'meia-compressao-treino',
      post_id: postId,
      author_id: resposta.autor.id,
      author_name: resposta.autor.nome,
      content: resposta.conteudo,
      created_at: resposta.timestamp.toISOString(),
      is_ia: resposta.autor.id === 'ia_facilitadora',
    });
  });
});

fs.writeFileSync('arena-compressao-dados.json', JSON.stringify(dados, null, 2));
console.log('✅ Dados salvos em: arena-compressao-dados.json\n');

console.log('════════════════════════════════════════════════════════');
console.log('✅ CONCLUÍDO!');
console.log('════════════════════════════════════════════════════════\n');
