/**
 * GERADOR DE DADOS DA ARENA (JSON/SQL)
 *
 * Gera dados para inserir manualmente no banco
 * Execução: npx tsx scripts/gerar-dados-arena.ts
 */

import { gerarThreadsEmLote, gerarEstatisticas } from './thread-generator';
import { GHOST_USERS } from './ghost-users-database';
import { gerarAvatarVariado } from './avatar-generator';
import * as fs from 'fs';
import * as path from 'path';

console.log('════════════════════════════════════════════════════════');
console.log('🏗️  GERADOR DE DADOS - ARENA BARRIGA POCHETE');
console.log('════════════════════════════════════════════════════════\n');

// Gerar 5 threads
console.log('📝 Gerando 5 threads...\n');

const threads = gerarThreadsEmLote('postura', 5, {
  incluirIA: true,
  dataInicio: new Date(),
  intervaloHoras: 24,
});

const stats = gerarEstatisticas(threads);

console.log('📊 Estatísticas:');
console.log(`   Total threads: ${stats.totalThreads}`);
console.log(`   Total respostas: ${stats.totalRespostas}`);
console.log(`   Média respostas/thread: ${stats.mediaRespostasPorThread}`);
console.log(`   Threads com IA: ${stats.threadsComIA} (${stats.percentualIA})`);
console.log(`   Autores únicos: ${stats.autoresUnicos}`);

// ============================================
// GERAR DADOS FORMATADOS
// ============================================

interface DadosFormatados {
  ghostUsers: any[];
  threads: any[];
  mensagens: any[];
}

const dados: DadosFormatados = {
  ghostUsers: [],
  threads: [],
  mensagens: [],
};

// 1. Ghost Users únicos usados
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

// 2. Threads (Posts)
threads.forEach((thread, index) => {
  const postId = `post_${index + 1}`;

  dados.threads.push({
    id: postId,
    arena_slug: 'barriga-pochete-postura',
    user_id: thread.autor.id,
    title: thread.titulo,
    content: thread.conteudo,
    is_published: true,
    created_at: thread.timestamp.toISOString(),
    updated_at: thread.timestamp.toISOString(),
  });

  // 3. Mensagens (Respostas)
  thread.respostas.forEach((resposta, respostaIndex) => {
    dados.mensagens.push({
      id: `msg_${index}_${respostaIndex}`,
      comunidade_slug: 'barriga-pochete-postura',
      post_id: postId,
      author_id: resposta.autor.id,
      author_name: resposta.autor.nome,
      content: resposta.conteudo,
      created_at: resposta.timestamp.toISOString(),
      is_ia: resposta.autor.id === 'ia_facilitadora',
    });
  });
});

// ============================================
// SALVAR EM ARQUIVO JSON
// ============================================

const outputPath = path.join(process.cwd(), 'arena-barriga-pochete-dados.json');
fs.writeFileSync(outputPath, JSON.stringify(dados, null, 2), 'utf-8');

console.log(`\n✅ Dados gerados e salvos em: arena-barriga-pochete-dados.json\n`);

// ============================================
// GERAR SQL
// ============================================

let sql = '-- SQL PARA POVOAR ARENA BARRIGA-POCHETE-POSTURA\n\n';

// Ghost Users
sql += '-- 1. CRIAR GHOST USERS\n';
dados.ghostUsers.forEach(user => {
  sql += `INSERT INTO users (id, email, name, username, avatar_url, bio, is_ghost_user, created_at, updated_at)\n`;
  sql += `VALUES ('${user.id}', '${user.email}', '${user.name}', '${user.username}', '${user.avatar_url}', '${user.bio?.replace(/'/g, "''")}', true, NOW(), NOW())\n`;
  sql += `ON CONFLICT (id) DO NOTHING;\n\n`;
});

// Threads
sql += '\n-- 2. CRIAR THREADS (POSTS)\n';
dados.threads.forEach(thread => {
  sql += `INSERT INTO posts (id, arena_id, user_id, title, content, is_published, created_at, updated_at)\n`;
  sql += `VALUES ('${thread.id}', (SELECT id FROM arenas WHERE slug = '${thread.arena_slug}'), '${thread.user_id}', '${thread.title.replace(/'/g, "''")}', '${thread.content.replace(/'/g, "''")}', true, '${thread.created_at}', '${thread.updated_at}')\n`;
  sql += `ON CONFLICT (id) DO NOTHING;\n\n`;
});

// Mensagens
sql += '\n-- 3. CRIAR MENSAGENS (RESPOSTAS)\n';
dados.mensagens.forEach(msg => {
  sql += `INSERT INTO nfc_chat_messages (id, comunidade_slug, author_id, author_name, content, created_at, is_ia)\n`;
  sql += `VALUES ('${msg.id}', '${msg.comunidade_slug}', '${msg.author_id}', '${msg.author_name.replace(/'/g, "''")}', '${msg.content.replace(/'/g, "''")}', '${msg.created_at}', ${msg.is_ia})\n`;
  sql += `ON CONFLICT (id) DO NOTHING;\n\n`;
});

const sqlPath = path.join(process.cwd(), 'arena-barriga-pochete-dados.sql');
fs.writeFileSync(sqlPath, sql, 'utf-8');

console.log(`✅ SQL gerado e salvo em: arena-barriga-pochete-dados.sql\n`);

// ============================================
// MOSTRAR PREVIEW
// ============================================

console.log('════════════════════════════════════════════════════════');
console.log('📋 PREVIEW DOS DADOS');
console.log('════════════════════════════════════════════════════════\n');

console.log(`👤 Ghost Users: ${dados.ghostUsers.length}`);
dados.ghostUsers.slice(0, 3).forEach(u => {
  console.log(`   - ${u.username} (${u.email})`);
});
if (dados.ghostUsers.length > 3) {
  console.log(`   ... e mais ${dados.ghostUsers.length - 3}`);
}

console.log(`\n📝 Threads: ${dados.threads.length}`);
dados.threads.forEach((t, i) => {
  console.log(`\n   ${i + 1}. "${t.title}"`);
  console.log(`      Autor: ${dados.ghostUsers.find(u => u.id === t.user_id)?.username}`);
  console.log(`      Conteúdo: "${t.content.substring(0, 60)}..."`);

  const mensagensDaThread = dados.mensagens.filter(m => m.post_id === t.id);
  console.log(`      Respostas: ${mensagensDaThread.length}`);

  mensagensDaThread.slice(0, 2).forEach((m, idx) => {
    const emoji = m.is_ia ? '🤖' : '👤';
    console.log(`        ${emoji} ${m.author_name}: "${m.content.substring(0, 50)}..."`);
  });
});

console.log('\n════════════════════════════════════════════════════════');
console.log('✅ DADOS GERADOS COM SUCESSO!');
console.log('════════════════════════════════════════════════════════\n');

console.log('💡 Próximos passos:');
console.log('   1. Verifique os arquivos gerados:');
console.log('      - arena-barriga-pochete-dados.json');
console.log('      - arena-barriga-pochete-dados.sql');
console.log('\n   2. Opções de inserção:');
console.log('      a) SQL direto no Supabase Dashboard');
console.log('      b) Importar JSON via API');
console.log('      c) Configurar .env e rodar: npx tsx scripts/populate-communities.ts\n');
