/**
 * GERADOR DE SQL POR ARENA (SEPARADO)
 * Gera um arquivo SQL para cada arena + um arquivo de setup inicial
 */

import * as fs from 'fs';

// Função para sanitizar texto e garantir encoding correto
function sanitizeText(text: string): string {
  return text
    .replace(/'/g, "''")  // Escapar aspas simples
    .normalize('NFC');     // Normalizar Unicode
}

console.log('🔧 Gerando arquivos SQL separados por arena...\n');

const ARENAS_CONFIG = [
  { slug: 'postura', nome: 'Barriga Pochete', categoria: 'postura', id: 'arena_postura', jsonFile: 'arena-postura-dados.json' },
  { slug: 'lipedema', nome: 'Musculação Lipedema', categoria: 'lipedema', id: 'arena_lipedema', jsonFile: 'arena-lipedema-dados.json' },
  { slug: 'hipercifose', nome: 'Hipercifose Drenagem', categoria: 'hipercifose', id: 'arena_hipercifose', jsonFile: 'arena-hipercifose-dados.json' },
  { slug: 'compressao', nome: 'Meia Compressão', categoria: 'compressao', id: 'arena_compressao', jsonFile: 'arena-compressao-dados.json' },
  { slug: 'menstrual', nome: 'Dor Menstrual', categoria: 'menstrual', id: 'arena_menstrual', jsonFile: 'arena-menstrual-dados.json' },
  { slug: 'gluteo_medio', nome: 'Glúteo Médio/Valgo', categoria: 'gluteo_medio', id: 'arena_gluteo_medio', jsonFile: 'arena-gluteo_medio-dados.json' },
  { slug: 'miofascial', nome: 'Liberação Miofascial', categoria: 'miofascial', id: 'arena_miofascial', jsonFile: 'arena-miofascial-dados.json' },
  { slug: 'desvio_bacia', nome: 'Desvio de Bacia', categoria: 'desvio_bacia', id: 'arena_desvio_bacia', jsonFile: 'arena-desvio_bacia-dados.json' },
];

// ════════════════════════════════════════════════════════
// ARQUIVO 0: SETUP INICIAL
// ════════════════════════════════════════════════════════

let setupSql = '';
setupSql += `-- ════════════════════════════════════════════════════════\n`;
setupSql += `-- SETUP INICIAL - NUTRIFIT COMMUNITIES\n`;
setupSql += `-- Execute este arquivo PRIMEIRO\n`;
setupSql += `-- ════════════════════════════════════════════════════════\n\n`;

// Adicionar colunas necessárias
setupSql += `-- Adicionar campos necessários à tabela User\n`;
setupSql += `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS is_ghost_user BOOLEAN DEFAULT false;\n`;
setupSql += `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS username TEXT;\n`;
setupSql += `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS bio TEXT;\n`;
setupSql += `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS avatar_url TEXT;\n\n`;

// Criar as 8 arenas
setupSql += `-- Criar as 8 arenas\n`;
ARENAS_CONFIG.forEach(arena => {
  const arenaSlugCompleto = arena.jsonFile.replace('arena-', '').replace('-dados.json', '');
  const dados = JSON.parse(fs.readFileSync(`../${arena.jsonFile}`, 'utf-8'));
  const arenaSlug = dados.arena.slug;

  setupSql += `INSERT INTO "Arena" (id, slug, name, description, icon, color, category, "isActive", "createdAt", "updatedAt")\n`;
  setupSql += `VALUES (\n`;
  setupSql += `  '${arena.id}',\n`;
  setupSql += `  '${arenaSlug}',\n`;
  setupSql += `  '${arena.nome}',\n`;
  setupSql += `  'Discussões sobre ${arena.nome.toLowerCase()}',\n`;
  setupSql += `  '💬',\n`;
  setupSql += `  '#8B5CF6',\n`;
  setupSql += `  '${arena.categoria}',\n`;
  setupSql += `  true,\n`;
  setupSql += `  NOW(),\n`;
  setupSql += `  NOW()\n`;
  setupSql += `) ON CONFLICT (id) DO UPDATE SET\n`;
  setupSql += `  slug = EXCLUDED.slug,\n`;
  setupSql += `  name = EXCLUDED.name;\n\n`;
});

// Criar tabela de mensagens
setupSql += `-- Criar tabela de mensagens\n`;
setupSql += `CREATE TABLE IF NOT EXISTS nfc_chat_messages (\n`;
setupSql += `    id TEXT PRIMARY KEY,\n`;
setupSql += `    comunidade_slug TEXT NOT NULL,\n`;
setupSql += `    post_id TEXT,\n`;
setupSql += `    author_id TEXT NOT NULL,\n`;
setupSql += `    author_name TEXT NOT NULL,\n`;
setupSql += `    content TEXT NOT NULL,\n`;
setupSql += `    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n`;
setupSql += `    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n`;
setupSql += `    is_ia BOOLEAN DEFAULT false\n`;
setupSql += `);\n\n`;

setupSql += `CREATE INDEX IF NOT EXISTS idx_chat_comunidade ON nfc_chat_messages(comunidade_slug);\n`;
setupSql += `CREATE INDEX IF NOT EXISTS idx_chat_post ON nfc_chat_messages(post_id);\n\n`;

setupSql += `-- ✅ Setup inicial concluído!\n`;

fs.writeFileSync('0_SETUP.sql', setupSql, { encoding: 'utf-8' });
console.log('✅ 0_SETUP.sql criado');

// ════════════════════════════════════════════════════════
// ARQUIVOS 1-8: UMA ARENA POR ARQUIVO
// ════════════════════════════════════════════════════════

ARENAS_CONFIG.forEach((arenaConfig, index) => {
  const arenaNum = index + 1;
  const filename = `${arenaNum}_arena_${arenaConfig.slug}.sql`;

  console.log(`\n[${arenaNum}/8] Gerando ${filename}...`);

  try {
    const dados = JSON.parse(fs.readFileSync(`../${arenaConfig.jsonFile}`, 'utf-8'));

    let sql = '';
    sql += `-- ════════════════════════════════════════════════════════\n`;
    sql += `-- ARENA ${arenaNum}: ${arenaConfig.nome}\n`;
    sql += `-- ════════════════════════════════════════════════════════\n\n`;

    // Ghost Users
    sql += `-- Ghost Users (${dados.ghostUsers.length})\n`;
    dados.ghostUsers.forEach((user: any) => {
      const bio = sanitizeText(user.bio || '');
      sql += `INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")\n`;
      sql += `VALUES (\n`;
      sql += `  '${user.id}',\n`;
      sql += `  '${user.email}',\n`;
      sql += `  '${user.name}',\n`;
      sql += `  '${user.username}',\n`;
      sql += `  '${user.avatar_url}',\n`;
      sql += `  '${bio}',\n`;
      sql += `  true,\n`;
      sql += `  NOW(),\n`;
      sql += `  NOW()\n`;
      sql += `) ON CONFLICT (id) DO NOTHING;\n\n`;
    });

    // Threads/Posts
    sql += `-- Threads (${dados.threads.length})\n`;
    dados.threads.forEach((thread: any) => {
      const title = sanitizeText(thread.title);
      const content = sanitizeText(thread.content);
      const fullContent = `${title}\n\n${content}`;

      sql += `INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")\n`;
      sql += `VALUES (\n`;
      sql += `  '${thread.id}',\n`;
      sql += `  '${arenaConfig.id}',\n`;
      sql += `  '${thread.user_id}',\n`;
      sql += `  '${fullContent}',\n`;
      sql += `  true,\n`;
      sql += `  '${thread.created_at}'::timestamptz,\n`;
      sql += `  '${thread.created_at}'::timestamptz\n`;
      sql += `) ON CONFLICT (id) DO NOTHING;\n\n`;
    });

    // Mensagens
    sql += `-- Mensagens (${dados.mensagens.length})\n`;
    dados.mensagens.forEach((msg: any) => {
      const content = sanitizeText(msg.content);
      const authorName = sanitizeText(msg.author_name);

      sql += `INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, updated_at, is_ia)\n`;
      sql += `VALUES (\n`;
      sql += `  '${msg.id}',\n`;
      sql += `  '${msg.comunidade_slug}',\n`;
      sql += `  ${msg.post_id ? `'${msg.post_id}'` : 'NULL'},\n`;
      sql += `  '${msg.author_id}',\n`;
      sql += `  '${authorName}',\n`;
      sql += `  '${content}',\n`;
      sql += `  '${msg.created_at}'::timestamptz,\n`;
      sql += `  '${msg.created_at}'::timestamptz,\n`;
      sql += `  ${msg.is_ia}\n`;
      sql += `) ON CONFLICT (id) DO NOTHING;\n\n`;
    });

    sql += `-- ✅ Arena ${arenaNum} importada!\n`;

    fs.writeFileSync(filename, sql, { encoding: 'utf-8' });
    console.log(`   ✅ ${dados.ghostUsers.length} users, ${dados.threads.length} threads, ${dados.mensagens.length} msgs`);

  } catch (error) {
    console.error(`   ❌ Erro: ${error}`);
  }
});

console.log('\n════════════════════════════════════════════════════════');
console.log('✅ ARQUIVOS SQL GERADOS COM SUCESSO!');
console.log('════════════════════════════════════════════════════════\n');

console.log('📁 Arquivos criados:');
console.log('   0_SETUP.sql - Execute PRIMEIRO');
ARENAS_CONFIG.forEach((arena, index) => {
  console.log(`   ${index + 1}_arena_${arena.slug}.sql`);
});

console.log('\n💡 Como executar:');
console.log('   1. Execute 0_SETUP.sql no Supabase');
console.log('   2. Execute 1_arena_postura.sql');
console.log('   3. Execute 2_arena_lipedema.sql');
console.log('   4. Continue com as demais arenas...\n');
