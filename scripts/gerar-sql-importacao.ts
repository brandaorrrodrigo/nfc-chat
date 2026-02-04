/**
 * GERADOR DE SQL PARA IMPORTAÇÃO
 *
 * Gera arquivo SQL com INSERT statements para todas as arenas
 */

import * as fs from 'fs';

console.log('════════════════════════════════════════════════════════');
console.log('📝 GERADOR DE SQL - IMPORTAÇÃO SUPABASE');
console.log('════════════════════════════════════════════════════════\n');

const ARENAS = [
  'postura',
  'lipedema',
  'hipercifose',
  'compressao',
  'menstrual',
  'gluteo_medio',
  'miofascial',
  'desvio_bacia',
];

let sql = '';

// Cabeçalho
sql += `-- ════════════════════════════════════════════════════════\n`;
sql += `-- IMPORTAÇÃO AUTOMÁTICA - 8 ARENAS NUTRIFIT\n`;
sql += `-- Gerado automaticamente em ${new Date().toISOString()}\n`;
sql += `-- ════════════════════════════════════════════════════════\n\n`;

sql += `-- Desabilitar triggers temporariamente\n`;
sql += `SET session_replication_role = 'replica';\n\n`;

let totalUsers = 0;
let totalThreads = 0;
let totalMensagens = 0;

ARENAS.forEach((arena, index) => {
  const filename = `arena-${arena}-dados.json`;

  console.log(`[${index + 1}/8] Processando ${arena}...`);

  try {
    const dados = JSON.parse(fs.readFileSync(filename, 'utf-8'));

    sql += `-- ════════════════════════════════════════════════════════\n`;
    sql += `-- ARENA ${index + 1}: ${dados.arena.nome}\n`;
    sql += `-- ════════════════════════════════════════════════════════\n\n`;

    // Ghost Users
    if (dados.ghostUsers.length > 0) {
      sql += `-- Ghost Users (${dados.ghostUsers.length})\n`;
      dados.ghostUsers.forEach((user: any) => {
        sql += `INSERT INTO users (id, email, name, username, avatar_url, bio, is_ghost_user, created_at, updated_at)\n`;
        sql += `VALUES (\n`;
        sql += `  '${user.id}',\n`;
        sql += `  '${user.email}',\n`;
        sql += `  '${user.name}',\n`;
        sql += `  '${user.username}',\n`;
        sql += `  '${user.avatar_url}',\n`;
        sql += `  '${user.bio || ''}',\n`;
        sql += `  true,\n`;
        sql += `  NOW(),\n`;
        sql += `  NOW()\n`;
        sql += `) ON CONFLICT (id) DO NOTHING;\n\n`;
      });
      totalUsers += dados.ghostUsers.length;
    }

    // Threads
    if (dados.threads.length > 0) {
      sql += `-- Threads (${dados.threads.length})\n`;
      dados.threads.forEach((thread: any) => {
        const content = thread.content.replace(/'/g, "''"); // Escapar aspas
        sql += `INSERT INTO posts (id, arena_slug, user_id, title, content, is_published, created_at, updated_at)\n`;
        sql += `VALUES (\n`;
        sql += `  '${thread.id}',\n`;
        sql += `  '${thread.arena_slug}',\n`;
        sql += `  '${thread.user_id}',\n`;
        sql += `  '${thread.title}',\n`;
        sql += `  '${content}',\n`;
        sql += `  true,\n`;
        sql += `  '${thread.created_at}',\n`;
        sql += `  '${thread.created_at}'\n`;
        sql += `) ON CONFLICT (id) DO NOTHING;\n\n`;
      });
      totalThreads += dados.threads.length;
    }

    // Mensagens
    if (dados.mensagens.length > 0) {
      sql += `-- Mensagens (${dados.mensagens.length})\n`;
      dados.mensagens.forEach((msg: any) => {
        const content = msg.content.replace(/'/g, "''"); // Escapar aspas
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
    }

    sql += `\n`;
    console.log(`   ✅ ${dados.ghostUsers.length} users, ${dados.threads.length} threads, ${dados.mensagens.length} msgs`);

  } catch (error) {
    console.error(`   ❌ Erro ao processar ${filename}:`, error);
  }
});

// Rodapé
sql += `-- Reabilitar triggers\n`;
sql += `SET session_replication_role = 'origin';\n\n`;

sql += `-- ════════════════════════════════════════════════════════\n`;
sql += `-- RESUMO DA IMPORTAÇÃO\n`;
sql += `-- ════════════════════════════════════════════════════════\n`;
sql += `-- Total Ghost Users: ${totalUsers}\n`;
sql += `-- Total Threads: ${totalThreads}\n`;
sql += `-- Total Mensagens: ${totalMensagens}\n`;
sql += `-- ════════════════════════════════════════════════════════\n`;

// Salvar arquivo
fs.writeFileSync('importacao-arenas.sql', sql);

console.log('\n════════════════════════════════════════════════════════');
console.log('✅ SQL GERADO COM SUCESSO!');
console.log('════════════════════════════════════════════════════════\n');

console.log(`📊 Estatísticas:`);
console.log(`   Ghost Users: ${totalUsers}`);
console.log(`   Threads: ${totalThreads}`);
console.log(`   Mensagens: ${totalMensagens}`);

console.log(`\n📁 Arquivo gerado: importacao-arenas.sql`);
console.log(`   Tamanho: ${(sql.length / 1024).toFixed(1)} KB`);

console.log('\n💡 Próximos passos:');
console.log('   1. Abrir Supabase SQL Editor');
console.log('   2. Copiar conteúdo de importacao-arenas.sql');
console.log('   3. Executar o SQL');
console.log('   4. Verificar se tudo foi importado corretamente\n');
