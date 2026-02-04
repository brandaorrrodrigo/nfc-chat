/**
 * GERADOR DE SQL PARA SUPABASE
 * Usa os nomes corretos das tabelas existentes
 */

import * as fs from 'fs';

console.log('════════════════════════════════════════════════════════');
console.log('📝 GERADOR DE SQL - SUPABASE (Schema Correto)');
console.log('════════════════════════════════════════════════════════\n');

const ARENAS = [
  'postura', 'lipedema', 'hipercifose', 'compressao',
  'menstrual', 'gluteo_medio', 'miofascial', 'desvio_bacia',
];

let sql = '';

// Cabeçalho
sql += `-- ════════════════════════════════════════════════════════\n`;
sql += `-- IMPORTAÇÃO 8 ARENAS - NUTRIFIT COMMUNITIES\n`;
sql += `-- Gerado: ${new Date().toISOString()}\n`;
sql += `-- ════════════════════════════════════════════════════════\n\n`;

// Adicionar campos necessários
sql += `-- Adicionar campos necessários\n`;
sql += `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS is_ghost_user BOOLEAN DEFAULT false;\n`;
sql += `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS bio TEXT;\n`;
sql += `ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS arena_slug TEXT;\n\n`;

// Criar tabela de mensagens
sql += `-- Criar tabela de mensagens\n`;
sql += `CREATE TABLE IF NOT EXISTS nfc_chat_messages (\n`;
sql += `    id TEXT PRIMARY KEY,\n`;
sql += `    comunidade_slug TEXT NOT NULL,\n`;
sql += `    post_id TEXT,\n`;
sql += `    author_id TEXT NOT NULL,\n`;
sql += `    author_name TEXT NOT NULL,\n`;
sql += `    content TEXT NOT NULL,\n`;
sql += `    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n`;
sql += `    is_ia BOOLEAN DEFAULT false\n`;
sql += `);\n\n`;

sql += `CREATE INDEX IF NOT EXISTS idx_chat_comunidade ON nfc_chat_messages(comunidade_slug);\n`;
sql += `CREATE INDEX IF NOT EXISTS idx_chat_post ON nfc_chat_messages(post_id);\n\n`;

let totalUsers = 0;
let totalThreads = 0;
let totalMensagens = 0;

ARENAS.forEach((arena, index) => {
  const filename = `arena-${arena}-dados.json`;
  console.log(`[${index + 1}/8] ${arena}...`);

  try {
    const dados = JSON.parse(fs.readFileSync(filename, 'utf-8'));

    sql += `-- ════ ARENA ${index + 1}: ${dados.arena.nome} ════\n\n`;

    // Ghost Users
    dados.ghostUsers.forEach((user: any) => {
      sql += `INSERT INTO "User" (id, email, name, username, "createdAt", "updatedAt", is_ghost_user, bio)\n`;
      sql += `VALUES (\n`;
      sql += `  '${user.id}',\n`;
      sql += `  '${user.email}',\n`;
      sql += `  '${user.name}',\n`;
      sql += `  '${user.username}',\n`;
      sql += `  NOW(), NOW(), true,\n`;
      sql += `  '${user.bio || ''}'\n`;
      sql += `) ON CONFLICT (id) DO NOTHING;\n\n`;
    });
    totalUsers += dados.ghostUsers.length;

    // Threads/Posts
    dados.threads.forEach((thread: any) => {
      const content = thread.content.replace(/'/g, "''");
      const title = thread.title.replace(/'/g, "''");
      sql += `INSERT INTO "Post" (id, "userId", title, content, "isPublished", "createdAt", "updatedAt", arena_slug)\n`;
      sql += `VALUES (\n`;
      sql += `  '${thread.id}',\n`;
      sql += `  '${thread.user_id}',\n`;
      sql += `  '${title}',\n`;
      sql += `  '${content}',\n`;
      sql += `  true,\n`;
      sql += `  '${thread.created_at}',\n`;
      sql += `  '${thread.created_at}',\n`;
      sql += `  '${thread.arena_slug}'\n`;
      sql += `) ON CONFLICT (id) DO NOTHING;\n\n`;
    });
    totalThreads += dados.threads.length;

    // Mensagens
    dados.mensagens.forEach((msg: any) => {
      const content = msg.content.replace(/'/g, "''");
      sql += `INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)\n`;
      sql += `VALUES (\n`;
      sql += `  '${msg.id}',\n`;
      sql += `  '${msg.comunidade_slug}',\n`;
      sql += `  ${msg.post_id ? `'${msg.post_id}'` : 'NULL'},\n`;
      sql += `  '${msg.author_id}',\n`;
      sql += `  '${msg.author_name}',\n`;
      sql += `  '${content}',\n`;
      sql += `  '${msg.created_at}',\n`;
      sql += `  ${msg.is_ia}\n`;
      sql += `) ON CONFLICT (id) DO NOTHING;\n\n`;
    });
    totalMensagens += dados.mensagens.length;

    console.log(`   ✅ ${dados.ghostUsers.length} users, ${dados.threads.length} threads, ${dados.mensagens.length} msgs`);

  } catch (error) {
    console.error(`   ❌ Erro: ${error}`);
  }
});

sql += `-- ════════════════════════════════════════════════════════\n`;
sql += `-- RESUMO: ${totalUsers} users, ${totalThreads} threads, ${totalMensagens} msgs\n`;
sql += `-- ════════════════════════════════════════════════════════\n`;

fs.writeFileSync('IMPORTACAO_SUPABASE.sql', sql);

console.log('\n✅ SQL GERADO: IMPORTACAO_SUPABASE.sql');
console.log(`📊 ${totalUsers} users, ${totalThreads} threads, ${totalMensagens} mensagens\n`);
